// ChronoLoom R0: pure, read-only Tzolk'in cycle and KFB navigation intents.
// This is a prototype library in the existing Fractal Almanac design lane.
// The historical 13 x 20 cycle is separate from KFB fiction and nesting.
// NO renderer, world store, calendar-date epoch, portal or time-travel execution.
export const CYCLE = 260;
export const TONES = 13;
export const SIGNS = 20;
export const SCOPES = Object.freeze(["world", "diorama", "card", "memory"]);
export const DAY_SIGNS = Object.freeze([
  { id: "imix", name: "Imix", kfbVerb: "emerge", motif: "river creature" },
  { id: "ik", name: "Ik'", kfbVerb: "breathe", motif: "wind spiral" },
  { id: "akbal", name: "Ak'b'al", kfbVerb: "conceal", motif: "night doorway" },
  { id: "kan", name: "K'an", kfbVerb: "germinate", motif: "split seed" },
  { id: "chikchan", name: "Chikchan", kfbVerb: "coil", motif: "serpent thread" },
  { id: "kimi", name: "Kimi", kfbVerb: "end", motif: "empty passage" },
  { id: "manik", name: "Manik'", kfbVerb: "grasp", motif: "open hand" },
  { id: "lamat", name: "Lamat", kfbVerb: "align", motif: "four-point star" },
  { id: "muluk", name: "Muluk", kfbVerb: "flow", motif: "water drop" },
  { id: "ok", name: "Ok", kfbVerb: "follow", motif: "wandering paw" },
  { id: "chuwen", name: "Chuwen", kfbVerb: "remix", motif: "maker's loop" },
  { id: "eb", name: "Eb", kfbVerb: "travel", motif: "forked road" },
  { id: "ben", name: "Ben", kfbVerb: "rise", motif: "jointed reed" },
  { id: "ix", name: "Ix", kfbVerb: "hide", motif: "jaguar spots" },
  { id: "men", name: "Men", kfbVerb: "survey", motif: "bird wing" },
  { id: "kib", name: "Kib", kfbVerb: "remember", motif: "worn feather" },
  { id: "kaban", name: "Kab'an", kfbVerb: "tilt", motif: "land fold" },
  { id: "etznab", name: "Etz'nab", kfbVerb: "cut", motif: "split shard" },
  { id: "kawak", name: "Kawak", kfbVerb: "discharge", motif: "storm knot" },
  { id: "ajaw", name: "Ajaw", kfbVerb: "reveal", motif: "sun disk" }
].map(Object.freeze));

function integer(value, label) {
  if (!Number.isSafeInteger(value)) throw new RangeError(label + " must be a safe integer");
}
function nonempty(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new TypeError(label + " must be a nonempty string");
}
export function mod(n, m) {
  integer(n, "n"); integer(m, "m");
  if (m <= 0) throw new RangeError("m must be positive");
  return ((n % m) + m) % m;
}
export function kinAt(step, origin = 0) {
  integer(step, "step"); integer(origin, "origin");
  const absoluteStep = step + origin;
  integer(absoluteStep, "absoluteStep");
  const index = mod(absoluteStep, CYCLE);
  const sign = DAY_SIGNS[index % SIGNS];
  return Object.freeze({
    absoluteStep,
    cycle: Math.floor(absoluteStep / CYCLE),
    kin: index + 1,
    tone: (index % TONES) + 1,
    signIndex: index % SIGNS,
    signId: sign.id,
    signName: sign.name,
    kfbVerb: sign.kfbVerb
  });
}
// KFB proposal: repeat the 260-cycle navigation operation at up to 4 scales.
// This nesting is NOT a historic Tzolk'in calendar property.
export function fractalAddress(steps) {
  if (!Array.isArray(steps) || steps.length < 1 || steps.length > SCOPES.length) {
    throw new RangeError("steps must contain 1 to 4 levels");
  }
  const nodes = steps.map((step, level) => {
    integer(step, "steps[" + level + "]");
    return Object.freeze({ scope: SCOPES[level], ...kinAt(step) });
  });
  return Object.freeze({
    contract: "kfb.chronoloom.fractal-address.r0",
    key: "chronoloom:" + steps.map(String).join("/"),
    nodes: Object.freeze(nodes)
  });
}
export function shiftLevel(steps, level, delta) {
  integer(level, "level"); integer(delta, "delta");
  if (!Array.isArray(steps) || level < 0 || level >= steps.length) throw new RangeError("invalid level");
  const copy = steps.slice();
  copy[level] += delta;
  integer(copy[level], "shifted step");
  return fractalAddress(copy);
}
export const JUMP_OPTIONS = Object.freeze([
  Object.freeze({ id: "ONE_BEAT", delta: 1, meaning: "next paired state" }),
  Object.freeze({ id: "SAME_TONE", delta: 13, meaning: "same tone, changed sign" }),
  Object.freeze({ id: "SAME_SIGN", delta: 20, meaning: "same sign, changed tone" }),
  Object.freeze({ id: "FULL_RETURN", delta: 260, meaning: "same sign and tone, different cycle" }),
  Object.freeze({ id: "BACK_ONE_BEAT", delta: -1, meaning: "previous paired state" }),
  Object.freeze({ id: "BACK_FULL_RETURN", delta: -260, meaning: "prior cycle, same pair" })
]);
// A planning/request object only. A world-authoritative owner must execute any
// memory revisit, portal transition or scene change; this module cannot do so.
export function planTimeMove({
  mode, fromStep, delta, sourceRef, snapshotRef = null, destinationRef = null
}) {
  if (!["resonance", "memory-revisit", "chrono-portal"].includes(mode)) {
    throw new RangeError("unsupported mode");
  }
  integer(fromStep, "fromStep"); integer(delta, "delta");
  nonempty(sourceRef, "sourceRef");
  if (mode === "memory-revisit") nonempty(snapshotRef, "snapshotRef");
  if (mode === "chrono-portal") nonempty(destinationRef, "destinationRef");
  const from = kinAt(fromStep), to = kinAt(fromStep + delta);
  return Object.freeze({
    contract: "kfb.chronoloom.time-move-request.r0",
    execution: "REQUEST_ONLY",
    authorization: "EXISTING_WORLD_AND_MEMORY_OWNERS_REQUIRED",
    mode, sourceRef, snapshotRef, destinationRef, delta, from, to
  });
}
