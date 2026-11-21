export const CARD_PERFORMANCE_SCHEMA = 'kfb.audio-site.card-performance-feed/1';
export const DRAFT_SCHEMA = 'kfb.audio-site.card-performance-draft/1';

const requiredString = (value, label) => {
  if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} must be a non-empty string`);
  return value.trim();
};

const sourceTextOrSilence = (value, label) => {
  if (value == null) return '';
  if (typeof value !== 'string') throw new Error(`${label} must be source text or an explicit empty string`);
  return value;
};

export function validateDeck(deck, metadata) {
  const expectedCount = metadata?.cardCount ?? deck?.cardCount ?? 48; // Legacy v9 fixture contract.
  if (!deck || !Array.isArray(deck.cards)) throw new Error('Source deck has no cards array');
  if (deck.cards.length !== expectedCount) throw new Error(`Source deck must contain ${expectedCount} Cards, received ${deck.cards.length}`);
  const numbers = deck.cards.map(card => Number(card.cardNumber));
  if (new Set(numbers).size !== expectedCount || numbers.some((number, index) => number !== index + 1)) {
    throw new Error('Source Card numbers must be unique and contiguous per verified deck count');
  }
  for (const card of deck.cards) {
    requiredString(card.cardName, `Card ${card.cardNumber} name`);
    sourceTextOrSilence(card.power, `Card ${card.cardNumber} power`);
    sourceTextOrSilence(card.lore, `Card ${card.cardNumber} lore`);
  }
  return deck;
}

export function parsePerformanceText(text, cardNumbers = Array.from({length:48},(_,i)=>i+1)) {
  const rows = String(text || '')
    .split(/\r?\n/)
    .map(row => row.trim())
    .filter(Boolean)
    .filter(row => !/^\[(?:Spoken Word|End)\]$/i.test(row));
  if (![cardNumbers.length+1,cardNumbers.length+2].includes(rows.length)) throw new Error(`Performance text must contain optional intro + ${cardNumbers.length} Cards + outro, received ${rows.length} segments`);
  if (rows.at(-1) !== 'Stay Fluffy!') throw new Error('Card Performance outro must be exactly "Stay Fluffy!"');
  const offset=rows.length===cardNumbers.length+2?1:0;
  return { intro: offset?rows[0]:'', cardLines: Object.fromEntries(rows.slice(offset,-1).map((line,index)=>[cardNumbers[index],line])), outro:rows.at(-1) };
}

export function normalizeBridges(sidecar, sourceRevision, deckId='wrinkle_rumble') {
  const edges = Array.isArray(sidecar?.editorialEdges) ? sidecar.editorialEdges : [];
  return edges.map((edge, index) => ({
    id: edge.id || `wrinkle-edge-${edge.fromCardId ?? edge.from}-${edge.toCardId ?? edge.to}-${index + 1}`,
    fromCardId: Number(edge.fromCardId ?? edge.from),
    toCardId: Number(edge.toCardId ?? edge.to),
    relation: requiredString(edge.relation, `Bridge ${index + 1} relation`),
    text: requiredString(edge.bridgeText ?? edge.text, `Bridge ${index + 1} text`),
    cost: edge.cost ?? null,
    callback: edge.callback ?? null,
    sourceRefs: edge.sourceRefs || [
      { deckId, cardNumber: Number(edge.fromCardId ?? edge.from), sourceRevision },
      { deckId, cardNumber: Number(edge.toCardId ?? edge.to), sourceRevision }
    ],
    editorialStatus: edge.editorialStatus || (edge.humanApproval ? 'REVIEWED' : 'EDITORIAL_CANDIDATE'),
    provenance: edge.provenance || 'EDITORIAL_PROPOSED_LINK_NOT_SOURCE_RULE'
  })).filter(edge => Number.isInteger(edge.fromCardId) && Number.isInteger(edge.toCardId));
}

export function validateFeed(feed) {
  if (!feed || feed.schema !== CARD_PERFORMANCE_SCHEMA) throw new Error(`Unsupported content feed schema: ${feed?.schema || 'missing'}`);
  requiredString(feed.status, 'Feed status');
  requiredString(feed.sourceRepo, 'Feed sourceRepo');
  requiredString(feed.sourceRef, 'Feed sourceRef');
  requiredString(feed.contentRevision, 'Feed contentRevision');
  if (!feed.source || !Array.isArray(feed.performances) || !feed.performances.length) throw new Error('Feed requires source metadata and at least one performance');
  for (const key of ['deckPath', 'deckRevision', 'performancePath', 'performanceRevision', 'bridgesPath', 'bridgesRevision', 'timedCuesPath', 'timedCuesRevision']) {
    requiredString(feed.source[key], `Feed source.${key}`);
  }
  for (const item of feed.performances) {
    requiredString(item.id, 'Performance id');
    requiredString(item.status, `${item.id} status`);
    if (!Array.isArray(item.selectedCardNumbers) || !item.selectedCardNumbers.length || item.selectedCardNumbers.some(number => !Number.isInteger(number) || number < 1 || number > (feed.source.cardCount ?? Number.MAX_SAFE_INTEGER))) {
      throw new Error(`${item.id} selectedCardNumbers must contain positive source Card numbers`);
    }
  }
  return feed;
}

export function selectBridge(edges, fromCardId, toCardId, seed = 'kfb') {
  const eligible = edges.filter(edge => edge.fromCardId === fromCardId && edge.toCardId === toCardId && ['REVIEWED', 'EDITORIAL_CANDIDATE'].includes(edge.editorialStatus));
  if (!eligible.length) return null;
  let hash = 2166136261;
  for (const char of `${seed}:${fromCardId}:${toCardId}`) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  return eligible[hash % eligible.length];
}

export function createDraft({ feed, performance, deck, script, bridges, contentSha }) {
  const deckId=feed.deckId || deck.deckId || 'wrinkle_rumble';
  const selected = [...performance.selectedCardNumbers];
  const sentenceOverrides = performance.sentenceOverrides || {};
  const lines = Object.fromEntries(selected.map(number => [number, sentenceOverrides[number] || script.cardLines[number]]));
  const bridgeDrafts = {};
  for (let index = 0; index < selected.length - 1; index++) {
    const from = selected[index], to = selected[index + 1];
    const edge = selectBridge(bridges, from, to, performance.seed || performance.id);
    bridgeDrafts[`${from}>${to}`] = edge ? { ...edge } : {
      id: null,
      fromCardId: from,
      toCardId: to,
      relation: 'NO_EDGE',
      text: '',
      cost: null,
      callback: null,
      sourceRefs: [
        { deckId, cardNumber: from, sourceRevision: feed.source.deckRevision },
        { deckId, cardNumber: to, sourceRevision: feed.source.deckRevision }
      ],
      editorialStatus: 'LOCAL_DRAFT_NO_EDGE',
      provenance: 'NO_SOURCE_COMPATIBLE_EDGE'
    };
  }
  return {
    schema: DRAFT_SCHEMA,
    draftStatus: 'LOCAL_EDITORIAL_DRAFT',
    sourceRepo: feed.sourceRepo,
    sourceRef: feed.sourceRef,
    sourceRevision: feed.source.deckRevision,
    contentRevision: feed.contentRevision,
    fetchedContentSha: contentSha,
    performanceId: performance.id,
    performanceStatus: performance.status,
    deckId,
    speaker: performance.speaker || { id: 'lorekeeper', label: 'Lorekeeper' },
    storyMode: performance.storyMode || 'comic',
    seed: performance.seed || performance.id,
    selectedCardNumbers: selected,
    lines,
    bridgeDrafts,
    intro: performance.intro ?? script.intro,
    outro: 'Stay Fluffy!',
    bed: performance.bed === 'DRY' ? 'DRY' : 'D',
    delivery: performance.delivery || 'measured',
    rate: Number(performance.rate || 0.92),
    pitch: Number(performance.pitch || 0.86),
    cards: Object.fromEntries(deck.cards.map(card => [card.cardNumber, card]))
  };
}

export function buildSegments(draft) {
  const result = [];
  if (draft.intro?.trim()) result.push({ cueId: 'intro', kind: 'intro', text: draft.intro.trim() });
  draft.selectedCardNumbers.forEach((number, index) => {
    const previous = draft.selectedCardNumbers[index - 1];
    const bridge = previous ? draft.bridgeDrafts[`${previous}>${number}`] : null;
    if (bridge?.text?.trim()) result.push({ cueId: `bridge-${previous}-${number}`, kind: 'bridge', fromCardId: previous, toCardId: number, relation: bridge.relation, text: bridge.text.trim() });
    result.push({ cueId: `card-${number}`, kind: 'card', cardNumber: number, text: requiredString(draft.lines[number], `Card ${number} line`) });
  });
  result.push({ cueId: 'outro', kind: 'outro', text: 'Stay Fluffy!' });
  return result;
}

export function csvForDraft(draft) {
  const quote = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const rows = [['cueId', 'kind', 'cardNumber', 'text', 'sourceRepo', 'sourceRef', 'sourceRevision', 'contentRevision', 'status']];
  for (const segment of buildSegments(draft)) rows.push([
    segment.cueId,
    segment.kind,
    segment.cardNumber || '',
    segment.text,
    draft.sourceRepo,
    draft.sourceRef,
    draft.sourceRevision,
    draft.contentRevision,
    draft.draftStatus
  ]);
  return rows.map(row => row.map(quote).join(',')).join('\n');
}

export function lyricsForDraft(draft) {
  return ['[Spoken Word]', '', ...buildSegments(draft).map(segment => segment.text), '', '[End]'].join('\n');
}
