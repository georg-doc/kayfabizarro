// RESIDENT-CHAT-POC-01 · deterministic semantic adapter v0.1
// Candidate only. ChatterBox remains owner of speaker timing, speech budget and presentation.
// This module only filters speaker knowledge and selects/validates shared semantic Triplet material.

const DEFAULT_MAX_WORDS = 15;
const OPERATORS = new Set(['BINGO', 'BONGO', 'BOGGLE', 'BLOEDSINN']);
const STOP_WORDS = new Set([
  'a','an','and','are','as','at','be','by','for','from','has','have','he','her','his','i','if',
  'in','is','it','its','of','on','one','or','our','she','so','that','the','their','them','they',
  'this','to','was','we','were','with','you','your'
]);

function asArray(value) {
  return Array.isArray(value) ? value : value == null ? [] : [value];
}

function upper(value) {
  return String(value || '').trim().toUpperCase();
}

function words(text) {
  return String(text || '').trim().split(/\s+/).filter(Boolean);
}

function tokens(text) {
  return new Set(
    String(text || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter((token) => token.length > 2 && !STOP_WORDS.has(token))
  );
}

function intersectCount(a, b) {
  let count = 0;
  for (const value of a) if (b.has(value)) count++;
  return count;
}

function addAll(target, values) {
  for (const value of asArray(values)) {
    if (value != null && String(value).trim()) target.add(String(value));
  }
}

function poolEntries(pool) {
  if (Array.isArray(pool)) return pool;
  return Array.isArray(pool && pool.entries) ? pool.entries : [];
}

function fallbackOf(entry, speakerId, borrowed) {
  if (borrowed) {
    const borrowedMap = entry && entry.borrowedFallbacks;
    const borrowedFallback = borrowedMap && borrowedMap[speakerId];
    if (!borrowedFallback) return null;
    return {
      subject: String(borrowedFallback.subject || ''),
      connector: String(borrowedFallback.connector || ''),
      reframe: String(borrowedFallback.reframe || '')
    };
  }
  if (entry && entry.fallback) {
    return {
      subject: String(entry.fallback.subject || ''),
      connector: String(entry.fallback.connector || ''),
      reframe: String(entry.fallback.reframe || '')
    };
  }
  if (entry && ('subject' in entry || 'connector' in entry || 'reframe' in entry)) {
    return {
      subject: String(entry.subject || ''),
      connector: String(entry.connector || ''),
      reframe: String(entry.reframe || '')
    };
  }
  return null;
}

function parseVariant(variant) {
  if (!variant) return null;
  if (typeof variant === 'object') {
    return {
      subject: String(variant.subject || ''),
      connector: String(variant.connector || ''),
      reframe: String(variant.reframe || '')
    };
  }
  const parts = String(variant).split('/').map((part) => part.trim());
  if (parts.length !== 3) return null;
  return { subject: parts[0], connector: parts[1], reframe: parts[2] };
}

function authoredFluffVariant(entry, request) {
  if (!request || !request.enabled) return { ok: true, fallback: null };
  const fluff = entry && entry.fluffOlect;
  if (!fluff || !fluff.allowed) return { ok: false, reason: 'FLUFF_NOT_AUTHORED' };
  const requestedTarget = request.target == null ? null : String(request.target);
  const authoredTarget = fluff.replaceTarget == null ? null : String(fluff.replaceTarget);
  if (requestedTarget && requestedTarget !== authoredTarget) {
    return { ok: false, reason: 'FLUFF_TARGET_NOT_AUTHORED' };
  }
  if ((fluff.maxReplacements || 1) > 1) {
    return { ok: false, reason: 'FLUFF_REPLACEMENT_BUDGET' };
  }
  const variant = parseVariant(fluff.fallbackVariant || fluff.variant);
  if (!variant) return { ok: false, reason: 'FLUFF_VARIANT_MISSING' };
  return { ok: true, fallback: variant };
}

function relationOf(entry) {
  return upper(entry && entry.semantic && entry.semantic.relation || entry && entry.relation);
}

function transformOperation(entry) {
  return upper(entry && entry.transformIntent && entry.transformIntent.operation);
}

function semanticConcepts(entry, fallback) {
  const out = new Set();
  addAll(out, entry && entry.semantic && entry.semantic.latentConcepts);
  addAll(out, entry && entry.latentConcepts);
  for (const value of [fallback && fallback.subject, fallback && fallback.connector, fallback && fallback.reframe]) {
    for (const token of tokens(value)) out.add(token);
  }
  return out;
}

function priorConcepts(priorSemantic) {
  const out = new Set();
  if (!priorSemantic) return out;
  addAll(out, priorSemantic.latentConcepts);
  for (const value of [priorSemantic.subject, priorSemantic.connector, priorSemantic.reframe, priorSemantic.utterance]) {
    for (const token of tokens(value)) out.add(token);
  }
  return out;
}

function sharesMaterial(entry, fallback, priorSemantic) {
  const current = semanticConcepts(entry, fallback);
  const prior = priorConcepts(priorSemantic);
  return intersectCount(current, prior) > 0;
}

function knowledgeContext(event, speakerId, knowledgeItems, profile) {
  const tags = new Set(['SELF']);
  const provenance = new Set();
  const cardRefs = new Set();
  const witnessed = new Set(asArray(event && event.witnessIds));
  const heard = new Set(asArray(event && event.hearingIds));
  const isWitness = witnessed.has(speakerId);
  const isHearer = heard.has(speakerId);

  if (profile && profile.knowledgePolicy && profile.knowledgePolicy.publicWorld) tags.add('PUBLIC_WORLD');
  addAll(tags, event && event.publicKnowledgeTags);

  if (isWitness) {
    tags.add('OBSERVED');
    tags.add('VISIBLE_SCENE');
    provenance.add('OBSERVED');
    addAll(tags, event && event.knowledgeTags);
    if (event && event.cardRef) {
      tags.add('CARD_PRESENT');
      tags.add('CARD_SEEN');
      cardRefs.add(String(event.cardRef));
    }
  } else if (isHearer) {
    tags.add('HEARD');
    provenance.add('HEARD');
    addAll(tags, event && event.heardKnowledgeTags);
    if (event && event.cardRef && event.cardReportedToHearers) {
      tags.add('CARD_REPORTED');
      cardRefs.add(String(event.cardRef));
    }
  }

  for (const item of asArray(knowledgeItems)) {
    if (!item || (item.residentId && item.residentId !== speakerId)) continue;
    const prov = upper(item.provenance);
    if (prov) {
      provenance.add(prov);
      tags.add(prov);
    }
    addAll(tags, item.tags);
    if (item.cardRef) cardRefs.add(String(item.cardRef));
  }

  return { tags, provenance, cardRefs, isWitness, isHearer };
}

function eligibility(entry, context, event, relationshipTags) {
  const rule = entry && entry.eligibility || {};
  for (const tag of asArray(rule.requiresKnowledgeTags)) {
    if (!context.tags.has(String(tag))) return false;
  }
  for (const prov of asArray(rule.requiresProvenance)) {
    if (!context.provenance.has(upper(prov))) return false;
  }
  if (rule.requiresCardRef && !context.cardRefs.has(String(rule.requiresCardRef))) return false;

  const requiredEventTags = asArray(rule.requiresEventTags);
  if (requiredEventTags.length) {
    const actual = new Set(asArray(event && event.tags).map(String));
    if (!requiredEventTags.every((tag) => actual.has(String(tag)))) return false;
  }

  const requiredRelationshipTags = asArray(rule.requiresRelationshipTags);
  if (requiredRelationshipTags.length) {
    const actual = new Set(asArray(relationshipTags).map(String));
    if (!requiredRelationshipTags.every((tag) => actual.has(String(tag)))) return false;
  }
  return true;
}

function profileSignatureRefs(profile) {
  return new Set(asArray(profile && profile.signatureTriplets && profile.signatureTriplets.refs));
}

function baselineAttitude(profile) {
  return profile && profile.attitude && profile.attitude.baseline || {};
}

function affinityScore(entry, profile, affectState) {
  let score = 1;
  const affinity = entry && entry.attitudeAffinity || {};
  const baseline = baselineAttitude(profile);
  for (const dimension of ['warmth','energy','pressure','play','openness','reserve']) {
    const allowed = new Set(asArray(affinity[dimension]).map(upper));
    if (allowed.size && allowed.has(upper(baseline[dimension]))) score *= 1.15;
  }
  const affects = new Set(asArray(affinity.affects).map(upper));
  if (affectState && affects.has(upper(affectState.primary))) score *= 1.5;
  return score;
}

function relevanceScore(entry, event, relationshipTags) {
  let score = 1;
  const eligibilityRule = entry && entry.eligibility || {};
  const actualEventTags = new Set(asArray(event && event.tags).map(String));
  const actualCardTags = new Set(asArray(event && event.cardTags).map(String));
  const actualRelationshipTags = new Set(asArray(relationshipTags).map(String));

  if (intersectCount(new Set(asArray(eligibilityRule.eventTags).map(String)), actualEventTags)) score *= 1.35;
  if (intersectCount(new Set(asArray(eligibilityRule.cardTags).map(String)), actualCardTags)) score *= 1.35;
  if (intersectCount(new Set(asArray(eligibilityRule.relationshipTags).map(String)), actualRelationshipTags)) score *= 1.25;
  return score;
}

function operatorAllows(operator, entry, fallback, priorSemantic) {
  if (!operator) return true;
  if (operator === 'BINGO') return true;
  if (operator === 'BONGO') return !!priorSemantic && sharesMaterial(entry, fallback, priorSemantic);
  if (operator === 'BOGGLE') {
    if (!priorSemantic || !sharesMaterial(entry, fallback, priorSemantic)) return false;
    return transformOperation(entry) === 'REFRAME' || relationOf(entry) === 'CATEGORY_SHIFT';
  }
  if (operator === 'BLOEDSINN') {
    const allowed = new Set(asArray(entry && entry.socialOperators).map(upper));
    return transformOperation(entry) === 'OBJECT' || relationOf(entry) === 'COLLISION' || allowed.has('BLOEDSINN');
  }
  return false;
}

function chooseWeighted(candidates, rng) {
  const total = candidates.reduce((sum, candidate) => sum + candidate.weight, 0);
  if (!(total > 0)) return null;
  const raw = Number(rng());
  const normalized = Number.isFinite(raw) ? Math.min(0.999999999, Math.max(0, raw)) : 0;
  let cursor = normalized * total;
  for (const candidate of candidates) {
    cursor -= candidate.weight;
    if (cursor < 0) return candidate;
  }
  return candidates[candidates.length - 1] || null;
}

function presentationHints(profile, affectState, operator) {
  const base = asArray(profile && profile.chatterBoxAdapter && profile.chatterBoxAdapter.presentationHints);
  const hints = {
    semanticHints: base,
    affect: affectState && affectState.primary || 'NEUTRAL',
    intensity: affectState && affectState.intensity || 'LOW',
    handClosureToPlayer: operator === 'BINGO',
    holdFrame: operator === 'BONGO',
    reframe: operator === 'BOGGLE',
    objectFrame: operator === 'BLOEDSINN'
  };
  if (upper(affectState && affectState.primary) === 'BORED') hints.exitPreferred = true;
  if (upper(affectState && affectState.primary) === 'MOVED') hints.pauseBias = 'LONG';
  if (upper(affectState && affectState.primary) === 'IRRITATED') hints.pauseBias = 'SHORT';
  return hints;
}

function outputIsSafe(output) {
  const serialized = JSON.stringify(output).toLowerCase();
  return !serialized.includes('"reward"') &&
    !serialized.includes('"pop"') &&
    !serialized.includes('"bone"') &&
    !serialized.includes('"clip"') &&
    !serialized.includes('"animation"') &&
    !serialized.includes('"statemutation"');
}

export function prepareResidentTurn(input = {}) {
  const speakerId = String(input.speakerId || '');
  const profile = input.residentProfile;
  if (!speakerId || !profile || profile.residentId !== speakerId) {
    return { kind: 'silence', speakerId, reason: 'INVALID_SPEAKER', presentationHints: {} };
  }

  if (input.forceSilence === true) {
    return {
      kind: 'silence',
      speakerId,
      reason: 'EXPLICIT_SILENCE',
      presentationHints: presentationHints(profile, input.affectState, null)
    };
  }

  const operator = input.socialOperator == null ? null : upper(input.socialOperator);
  if (operator && !OPERATORS.has(operator)) {
    return {
      kind: 'silence',
      speakerId,
      reason: 'INVALID_SOCIAL_OPERATOR',
      presentationHints: presentationHints(profile, input.affectState, null)
    };
  }

  const event = input.event || {};
  const context = knowledgeContext(event, speakerId, input.knowledgeItems, profile);
  const relationshipTags = asArray(input.relationshipTags);
  const signatureRefs = profileSignatureRefs(profile);
  const ownSignatureWeight = Number(profile && profile.signatureTriplets && profile.signatureTriplets.signatureWeight) || 4;
  const globalWeight = Number(profile && profile.signatureTriplets && profile.signatureTriplets.globalWeight) || 1;
  const recent = new Set(asArray(input.recentTripletIds).map(String));
  const unlocked = new Set(asArray(input.unlockedTripletRefs).map(String));
  const candidates = [];

  for (const entry of poolEntries(input.pool)) {
    if (!entry || !entry.tripletId) continue;
    if (input.requireTransformIntent !== false && !(entry.transformIntent && entry.transformIntent.invariant)) continue;
    if (!eligibility(entry, context, event, relationshipTags)) continue;

    const signatures = asArray(entry.signatureOf).map(String);
    const global = signatures.length === 0;
    const ownSignature = signatures.includes(speakerId) || signatureRefs.has(String(entry.tripletId));
    let borrowed = false;
    let borrowedFrom = null;

    if (!global && !ownSignature) {
      if (!unlocked.has(String(entry.tripletId))) continue;
      if (!(entry.borrowedFallbacks && entry.borrowedFallbacks[speakerId])) continue;
      borrowed = true;
      borrowedFrom = signatures[0] || null;
    }

    let fallback = fallbackOf(entry, speakerId, borrowed);
    if (!fallback || !fallback.subject || !fallback.connector || !fallback.reframe) continue;

    const fluff = authoredFluffVariant(entry, input.fluffOlect);
    if (!fluff.ok) continue;
    if (fluff.fallback) fallback = fluff.fallback;

    if (!operatorAllows(operator, entry, fallback, input.priorSemantic)) continue;

    const maxWords = event.performanceMode ? (Number(input.maxPerformanceWords) || 30) : (Number(input.maxWords) || DEFAULT_MAX_WORDS);
    const utterance = [fallback.subject, fallback.connector, fallback.reframe].join(' / ');
    if (words(utterance).length > maxWords) continue;

    let weight = ownSignature ? ownSignatureWeight : globalWeight;
    if (borrowed) weight *= 1.2;
    if (asArray(profile && profile.signatureTriplets && profile.signatureTriplets.relationBias).map(upper).includes(relationOf(entry))) {
      weight *= 1.4;
    }
    weight *= affinityScore(entry, profile, input.affectState);
    weight *= relevanceScore(entry, event, relationshipTags);
    if (recent.has(String(entry.tripletId))) weight *= 0.03;
    if (operator === 'BINGO' && relationOf(entry) === 'SYNERGY') weight *= 1.3;
    if (operator === 'BOGGLE' && relationOf(entry) === 'CATEGORY_SHIFT') weight *= 1.5;
    if (operator === 'BLOEDSINN' && relationOf(entry) === 'COLLISION') weight *= 1.5;

    if (weight > 0) {
      candidates.push({ entry, fallback, utterance, weight, borrowed, borrowedFrom });
    }
  }

  const selected = chooseWeighted(candidates, typeof input.rng === 'function' ? input.rng : Math.random);
  if (!selected) {
    return {
      kind: 'silence',
      speakerId,
      reason: 'NO_ELIGIBLE_TRIPLET',
      presentationHints: presentationHints(profile, input.affectState, operator)
    };
  }

  const semantic = {
    subject: selected.fallback.subject,
    connector: selected.fallback.connector,
    reframe: selected.fallback.reframe,
    latentConcepts: Array.from(semanticConcepts(selected.entry, selected.fallback)),
    transformIntent: selected.entry.transformIntent
  };

  const output = {
    kind: 'turn',
    speakerId,
    addresseeId: input.addresseeId == null ? null : String(input.addresseeId),
    tripletId: String(selected.entry.tripletId),
    borrowedFrom: selected.borrowed ? selected.borrowedFrom : null,
    socialOperator: operator,
    semantic,
    utterance: selected.utterance,
    provenanceRefs: asArray(input.provenanceRefs),
    affect: input.affectState || null,
    presentationHints: presentationHints(profile, input.affectState, operator),
    memoryCandidates: []
  };

  if (!outputIsSafe(output)) {
    return {
      kind: 'silence',
      speakerId,
      reason: 'UNSAFE_OUTPUT_SHAPE',
      presentationHints: presentationHints(profile, input.affectState, operator)
    };
  }
  return output;
}

export function inspectResidentKnowledge(input = {}) {
  const profile = input.residentProfile || {};
  const speakerId = String(input.speakerId || profile.residentId || '');
  const context = knowledgeContext(input.event || {}, speakerId, input.knowledgeItems, profile);
  return {
    speakerId,
    tags: Array.from(context.tags).sort(),
    provenance: Array.from(context.provenance).sort(),
    cardRefs: Array.from(context.cardRefs).sort(),
    isWitness: context.isWitness,
    isHearer: context.isHearer
  };
}

export function validateResidentTurn(output) {
  if (!output || !['silence', 'turn'].includes(output.kind)) return false;
  if (output.kind === 'silence') return typeof output.reason === 'string';
  if (!output.speakerId || !output.tripletId || !output.utterance) return false;
  if (!output.semantic || !output.semantic.subject || !output.semantic.connector || !output.semantic.reframe) return false;
  if (!(output.semantic.transformIntent && output.semantic.transformIntent.invariant)) return false;
  return outputIsSafe(output);
}
