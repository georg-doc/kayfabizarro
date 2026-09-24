/* NPC-LIFE-01 adapters: deliberately stateless consumers of semantic encounter beats.
   They do not own host movement, legality, relationship, inventory or persistent memory. */

const MOTION_CANDIDATES = Object.freeze({
  approach: ['Walking_A', 'Walking_B', 'Walking_C', 'Running_A'],
  greet: ['Waving', 'Interact', 'Idle_B', 'Idle_A'],
  offer: ['Use_Item', 'Interact', 'Idle_B', 'Idle_A'],
  react: ['Interact', 'Idle_B', 'Idle_A'],
  accept: ['Interact', 'Waving', 'Idle_B', 'Idle_A'],
  decline: ['Idle_B', 'Idle_A'],
  leave: ['Walking_A', 'Walking_B', 'Walking_C', 'Running_A']
});

const CHATTER_FIELDS = Object.freeze({
  greet: 'idle',
  offer: 'handel',
  react: 'antwort',
  accept: 'antwort',
  decline: 'spott',
  leave: 'idle'
});

export function createMotionBeatAdapter({ availableFor, play } = {}) {
  if (typeof availableFor !== 'function' || typeof play !== 'function') throw new TypeError('motion adapter callbacks required');
  return (event) => {
    const id = event.speakerId || event.actorId;
    const available = new Set(availableFor(id) || []);
    const clip = (MOTION_CANDIDATES[event.beat] || []).find((name) => available.has(name)) || null;
    if (clip) play({ actorId: id, clip, beat: event.beat, encounterId: event.encounterId });
    return clip;
  };
}

export function createChatterBeatAdapter({ phrases, profileFor = () => 'townsfolk', showLine, rng = Math.random } = {}) {
  if (!phrases || typeof phrases.zeile !== 'function' || typeof showLine !== 'function') throw new TypeError('chatter source + showLine required');
  return (event) => {
    const field = CHATTER_FIELDS[event.beat];
    if (!field) return null;
    const speakerId = event.speakerId || event.actorId;
    const profile = profileFor(speakerId, event);
    const line = phrases.zeile(profile, field, rng);
    if (line) showLine({ speakerId, line, field, profile, beat: event.beat, encounterId: event.encounterId });
    return line;
  };
}

export function createResidentOfferProvider({ residentRecipes } = {}) {
  if (!Array.isArray(residentRecipes)) throw new TypeError('residentRecipes array required');
  const recipes = new Map(residentRecipes.map((r) => [r.residentId, r]));
  return ({ actorId } = {}) => {
    const recipe = recipes.get(actorId);
    if (!recipe) return null;
    const prop = (recipe.signatureProps || []).find((p) => p.id === 'present_side')
      || (recipe.signatureProps || []).find((p) => p.id === 'present');
    if (!prop) return null;
    return Object.freeze({
      type: 'kfb.resident.offer-ref',
      version: 1,
      owner: 'gift/reward-consumer',
      sourceResidentId: actorId,
      sourcePropId: prop.id,
      assetPath: prop.a,
      label: prop.role || prop.id
    });
  };
}
