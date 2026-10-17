// ============================================================================
// world-context.js — KFB Terrain + Skydome v1
// ----------------------------------------------------------------------------
// The HEART (BRIEFING §"drei Karten → semantischer Vektor → Seed → Landschaft").
// Ported 1:1 from the Perplexity WorldContext.ts SCHEMA, but as plain JS — no
// TypeScript, no React, no framework. Pure data + logic → portable everywhere
// (terrain, skydome, PetFlight, the ride). Deterministic: same card → same world.
//
// The pipeline:
//   CardTriplet {current,next,nextNext}   ← the three-beat, as a fractal
//        │  cardSemanticVector()   (deterministic, reads the KFB analysis corpus —
//        │                          NOT an LLM guess. The scores/tags/mood in the
//        │                          SSOT card JSON ARE the source.)
//        ▼
//   CardSemanticVector ×3  (8 dims: power lore name chaos wonder threat humor melancholy)
//        │  weighted aggregate  (current dominates: the beat as self-similar fractal)
//        ▼
//   makeWorldContext()  → { storyMode, biome, accent, palette, params, audio, anchors }
//        │  params drive the terrain:
//        ▼  heightScale · terrainRoughness · waterLevel · colorShift · surrealism ·
//           fogDensity · motionAmplitude
// ============================================================================

// ---------------------------------------------------------------- StoryMode (SSOT)
// The six canonical D6 modes. ink/panel are the KFB Rules Print v4 canon
// (09_MODE_COLORS_canonical, 1:1 with rollercoaster-ride MODES). Index = D6-1.
export const MODES = [
  { n: 1, name: 'TRAGIC',    key: 'tragic',    ink: 0x3e6a83, panel: 0xdbe4e9 },
  { n: 2, name: 'COMIC',     key: 'comic',     ink: 0x5e6f33, panel: 0xe3e9d3 },
  { n: 3, name: 'ABSURD',    key: 'absurd',    ink: 0x9a4f86, panel: 0xefe0ec },
  { n: 4, name: 'HEROIC',    key: 'heroic',    ink: 0xb5642a, panel: 0xf0e2d2 },
  { n: 5, name: 'MYSTICAL',  key: 'mystical',  ink: 0x6b4f9c, panel: 0xe6dff0 },
  { n: 6, name: 'FORBIDDEN', key: 'forbidden', ink: 0x8f3a5f, panel: 0xefdbe2 },
];
export const STORY_MODES = MODES.map((m) => m.key);

// Canonical 3-stop palettes per mode (SSOT mirror of MOOD_SKY / FRACTAL_PALETTES —
// base → mid → glow-core). Terrain AND skydome pull from the SAME table so a ride
// never shows two disagreeing versions of a mood. RGB 0..1.
export const STORY_PALETTES = [
  { c: [[0.06, 0.10, 0.16], [0.24, 0.42, 0.55], [0.62, 0.74, 0.82]] }, // 0 TRAGIC — folding steel
  { c: [[0.14, 0.18, 0.06], [0.52, 0.66, 0.20], [0.94, 0.92, 0.62]] }, // 1 COMIC — bouncy lime
  { c: [[0.16, 0.10, 0.02], [0.85, 0.20, 0.62], [0.16, 0.72, 0.66]] }, // 2 ABSURD — mismatched breaks
  { c: [[0.14, 0.05, 0.02], [0.86, 0.42, 0.12], [1.00, 0.86, 0.52]] }, // 3 HEROIC — radiant beams
  { c: [[0.08, 0.04, 0.14], [0.52, 0.36, 0.72], [0.84, 0.78, 0.94]] }, // 4 MYSTICAL — luminous halos
  { c: [[0.10, 0.01, 0.05], [0.72, 0.08, 0.20], [0.94, 0.24, 0.52]] }, // 5 FORBIDDEN — red/black
];

export function modeIndex(storyMode) {
  if (typeof storyMode === 'number') return ((storyMode % 6) + 6) % 6;
  const i = STORY_MODES.indexOf(String(storyMode || '').toLowerCase());
  return i < 0 ? 3 : i;
}

// ---------------------------------------------------------------- seed logic (deterministic)
// FNV-1a → uint32; the whole point is reproducibility (BRIEFING §Stack-Regeln).
export function hashStr(s) {
  let h = 0x811c9dc5 >>> 0;
  s = String(s);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); }
  return h >>> 0;
}
export function normalizeSeed(v) {
  if (v == null) return 0;
  if (typeof v === 'number') return (v >>> 0);
  return hashStr(v);
}
export function joinSeeds(...seeds) {
  let h = 0x9e3779b9 >>> 0;
  for (const s of seeds) { h ^= normalizeSeed(s); h = Math.imul(h, 0x85ebca6b) >>> 0; h ^= h >>> 13; }
  return h >>> 0;
}
// mulberry32 — tiny fast seeded PRNG, returns () → [0,1).
export function mulberry32(seed) {
  let a = normalizeSeed(seed) || 1;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------- colour helpers (pure, no THREE)
function hslToRgb(h, s, l) {
  if (s === 0) return [l, l, l];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const hk = (t) => { t = (t % 1 + 1) % 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
  return [hk(h + 1 / 3), hk(h), hk(h - 1 / 3)];
}
function rgbToHsl(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h;
  if (mx === r) h = (g - b) / d + (g < b ? 6 : 0); else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4;
  return [h / 6, s, l];
}
export function hexToRgb(hex) { return [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255]; }
export function rgbToHex(r, g, b) {
  const q = (x) => Math.max(0, Math.min(255, Math.round(x * 255)));
  return '#' + [q(r), q(g), q(b)].map((n) => n.toString(16).padStart(2, '0')).join('');
}
// glowOf — ink lifted into a legible neon (1:1 with rollercoaster-ride glowOf). Returns [r,g,b].
export function glowOf(hex) {
  const [h, s, l] = rgbToHsl(...hexToRgb(hex));
  return hslToRgb(h, Math.min(1, s * 1.55 + 0.12), Math.min(0.74, l * 1.3 + 0.3));
}

// ---------------------------------------------------------------- palette from cards (v2)
// Build a cartoony 3-stop palette [dark → mid → glow] live from the aggregated
// card vector. Each emotional dimension owns a canonical hue; the two strongest
// dimensions set base + accent hue, chaos widens the hue gap (more "mismatched"),
// wonder/humor lift saturation & value. Deterministic per (vector, seed).
const DIM_HUE = { wonder: 0.50, humor: 0.15, threat: 0.00, melancholy: 0.62, chaos: 0.85, power: 0.08, lore: 0.55, name: 0.33 };
export function paletteFromVector(v, seed) {
  v = v || emptyVector();
  const rng = mulberry32(((seed >>> 0) ^ 0x9e3779b9) >>> 0);
  const ranked = Object.keys(DIM_HUE)
    .map((k) => [k, (v[k] != null ? v[k] : 0.2)])
    .sort((a, b) => b[1] - a[1]);
  const h1 = DIM_HUE[ranked[0][0]];
  let h2 = DIM_HUE[ranked[1][0]];
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  // chaos pushes the accent hue further from the base → more clashing / cartoony
  const spread = 0.10 + clamp01(v.chaos) * 0.32 + (rng() - 0.5) * 0.06;
  const dir = (((h2 - h1 + 1.5) % 1) < 0.5) ? -1 : 1;   // rotate toward the shorter arc, away
  h2 = (h1 + dir * spread + 1) % 1;
  const glowH = (h1 + (rng() - 0.5) * 0.06 + 1) % 1;
  // cartoony: high saturation, bright glow. wonder/humor lift; melancholy/threat darken a touch.
  const lift = clamp01(0.55 + v.wonder * 0.3 + v.humor * 0.25);
  const satBase = clamp01(0.62 + v.chaos * 0.28 + v.threat * 0.12);
  const dark = hslToRgb(h1, clamp01(satBase * 0.7 + 0.1), 0.12 + (rng() * 0.05));
  const mid = hslToRgb(h2, clamp01(satBase + 0.05), 0.44 + lift * 0.12);
  const glow = hslToRgb(glowH, clamp01(0.55 + v.wonder * 0.2), 0.70 + lift * 0.14);
  return [dark, mid, glow];
}

// ============================================================================
// cardSemanticVector — the connection the research left open (BRIEFING).
// NOT an LLM guess at runtime. The KFB analysis corpus IS the deterministic
// source: grade, power/lore/gradeReason text, the artwork Mood line, deck role.
// A small keyword mapper reads that analysis → 8 dimensions. Card in, vector out,
// no network. Same card → same vector, always.
// ============================================================================
const LEX = {
  chaos:      ['chaos', 'chaot', 'mess', 'break', 'broke', 'wrong', 'disobed', 'sabotage', 'storm', 'frantic', 'smash', 'crossed-out', 'noncompliance', 'mismatch', 'clumsy', 'scribble', 'overflow', 'spray', 'burst'],
  wonder:     ['wonder', 'curious', 'curiosity', 'question', 'imagine', 'luminous', 'glow', 'kaleidoscop', 'insight', 'investigat', 'fertile', 'wildflower', 'discover', 'marvel', 'awe', 'open', 'experiment', 'possib', 'lightbulb', 'wander'],
  threat:     ['threat', 'death', 'die', 'pain', 'alarm', 'trap', 'danger', 'burn', 'fear', 'panic', 'reject', 'doom', 'dead', 'kill', 'weapon', 'warning', 'guard', 'brick', 'armored', 'force', 'irreversible', 'collapse'],
  humor:      ['grin', 'gleeful', 'glee', 'amuse', 'playful', 'cheer', 'joke', 'bounce', 'silly', 'absurd', 'funny', 'ridic', 'goggles', 'denim', 'flannel', 'raccoon', 'possum', 'quokka', 'unashamed', 'gang'],
  melancholy: ['quiet', 'calm', 'still', 'slow', 'melanchol', 'alone', 'grief', 'tombstone', 'boring', 'rain', 'tired', 'weary', 'mourn', 'lonely', 'ache', 'breath', 'exhale', 'sovereign', 'unbothered', 'persist', 'serene', 'silence'],
  power:      ['do ', 'make', 'build', 'start', 'run ', 'find', 'take', 'act', 'go ', 'pick', 'place', 'write', 'pay ', 'choose', 'trade', 'draw', 'lay', 'name', 'improve', 'fix', 'commit', 'drive', 'grip', 'hammer'],
};
const ROLE_BIAS = {
  FORGET: { melancholy: 0.14, wonder: 0.06 },
  IGNORE: { threat: 0.16, chaos: 0.10 },
  EMBRACE: { wonder: 0.12, power: 0.08 },
  MED: { chaos: 0.10, humor: 0.08 },
};
function lexScore(text, words) {
  let n = 0;
  for (const w of words) { let i = 0; while ((i = text.indexOf(w, i)) !== -1) { n++; i += w.length; } }
  return 1 - Math.exp(-n * 0.55);   // saturating: 1 hit ≈ .42, 2 ≈ .67, 3 ≈ .81
}
function capsWords(name) { return (String(name).match(/\b[A-Z]{2,}\b/g) || []).length; }

// card: { cardNumber, cardName, grade(1..3), power, lore, gradeReason, artworkPrompt }
// deckRole: 'FORGET' | 'IGNORE' | 'EMBRACE' | 'MED' (optional)
export function cardSemanticVector(card, deckRole) {
  card = card || {};
  const name = String(card.cardName || '');
  // Mood line from the artwork prompt is the strongest single signal → weight it double.
  const mood = (String(card.artworkPrompt || '').match(/Mood:\s*([^.]*)/i) || [, ''])[1];
  const text = (name + ' ' + (card.power || '') + ' ' + (card.lore || '') + ' ' +
    (card.gradeReason || '') + ' ' + (card.artworkPrompt || '') + ' ' + mood + ' ' + mood).toLowerCase();

  const grade = Math.max(1, Math.min(3, card.grade || 2));
  const gradePow = 1 - (grade - 1) / 2;                       // G1=1 (embodied) … G3=0 (abstract)
  const loreLen = String(card.lore || '').length;

  const jitter = (salt) => (mulberry32(hashStr(name + '·' + salt))() - 0.5) * 0.10;
  const clamp01 = (x) => Math.max(0, Math.min(1, x));

  const v = {
    power:      clamp01(0.15 + 0.55 * gradePow + 0.30 * lexScore(text, LEX.power) + jitter('p')),
    lore:       clamp01(0.20 + 0.55 * Math.min(1, loreLen / 190) + 0.20 * lexScore(text, LEX.wonder) + jitter('l')),
    name:       clamp01(0.30 + 0.40 * Math.min(1, capsWords(name) / 2) + 0.30 * (hashStr(name) % 1000) / 1000 + jitter('n')),
    chaos:      clamp01(0.08 + 0.82 * lexScore(text, LEX.chaos) + jitter('c')),
    wonder:     clamp01(0.08 + 0.82 * lexScore(text, LEX.wonder) + jitter('w')),
    threat:     clamp01(0.06 + 0.84 * lexScore(text, LEX.threat) + jitter('t')),
    humor:      clamp01(0.06 + 0.84 * lexScore(text, LEX.humor) + jitter('h')),
    melancholy: clamp01(0.08 + 0.80 * lexScore(text, LEX.melancholy) + jitter('m')),
  };
  const bias = ROLE_BIAS[String(deckRole || '').toUpperCase()];
  if (bias) for (const k in bias) v[k] = clamp01(v[k] + bias[k]);
  return v;
}

// ---------------------------------------------------------------- default factories (schema)
export function emptyVector() {
  return { power: 0.4, lore: 0.4, name: 0.4, chaos: 0.3, wonder: 0.3, threat: 0.2, humor: 0.2, melancholy: 0.2 };
}
// A CardTriplet is {current,next,nextNext}. Each entry: a card object (+ optional _role),
// OR an already-computed vector. Missing beats fall back to the current one.
function toVector(entry) {
  if (!entry) return null;
  if (entry.power != null && entry.chaos != null && entry.cardName == null) return entry;  // already a vector
  return cardSemanticVector(entry, entry._role || entry.role);
}

// Weighted aggregate: the CURRENT beat dominates, next/nextNext echo it (the three-beat
// as a self-similar fractal — the immediate card sets the ground, the coming cards bend it).
const TRIPLET_W = { current: 0.60, next: 0.28, nextNext: 0.12 };
export function aggregateTriplet(triplet) {
  triplet = triplet || {};
  const cur = toVector(triplet.current) || emptyVector();
  const nxt = toVector(triplet.next) || cur;
  const nn = toVector(triplet.nextNext) || nxt;
  const out = {};
  for (const k in cur) out[k] = cur[k] * TRIPLET_W.current + nxt[k] * TRIPLET_W.next + nn[k] * TRIPLET_W.nextNext;
  return out;
}

// ---------------------------------------------------------------- makeWorldContext
// The public factory (BRIEFING Modul 1 output). Same card + mode + seeds → same world.
export function makeWorldContext({ cardTriplet, storyMode = 'heroic', seeds = [] } = {}) {
  const mi = modeIndex(storyMode);
  const mode = MODES[mi];
  const v = aggregateTriplet(cardTriplet);
  const clamp01 = (x) => Math.max(0, Math.min(1, x));

  // deterministic world seed from mode + the three card identities + caller seeds
  const cardKey = (c) => (c && (c.cardName || c.name)) ? (c.cardName || c.name) : 'ø';
  const seed = joinSeeds(
    'kfb-terrain-v1', mode.key,
    cardKey(cardTriplet && cardTriplet.current),
    cardKey(cardTriplet && cardTriplet.next),
    cardKey(cardTriplet && cardTriplet.nextNext),
    ...(Array.isArray(seeds) ? seeds : [seeds]),
  );
  const rng = mulberry32(seed);

  const surrealism = clamp01(0.5 * v.chaos + 0.5 * v.wonder);
  // params — the terrain-forming knobs (BRIEFING Modul 1). Each maps a dimension → a shape.
  const params = {
    heightScale:      6 + v.power * 22 + v.chaos * 10,          // vertical drama
    terrainRoughness: 0.35 + v.chaos * 0.95 + surrealism * 0.30, // fbm gain / broken-ness
    waterLevel:       -3 + v.melancholy * 11,                    // flood line (world Y)
    colorShift:       clamp01(0.5 + (v.wonder - v.melancholy) * 0.5 + (rng() - 0.5) * 0.14), // ramp bias 0..1
    surrealism,                                                  // warps sampling + scatter oddness
    fogDensity:       0.006 + v.melancholy * 0.020 + v.threat * 0.014,
    motionAmplitude:  0.20 + v.power * 0.60 + v.humor * 0.40,    // how much the world breathes on the beat
  };

  // biome — dominant dimension picks the surface character.
  const cand = [
    ['scorched', v.threat * 1.15],
    ['luminous', v.wonder * 1.05],
    ['tidal', v.melancholy + (params.waterLevel > 3 ? 0.25 : 0)],
    ['meadow', v.humor * 1.1],
    ['fractured', v.chaos * 1.1],
    ['plateau', 0.42 + v.power * 0.2],
  ].sort((a, b) => b[1] - a[1]);
  const biome = cand[0][0];

  const palette = STORY_PALETTES[mi].c;                          // 3 RGB stops
  const glow = glowOf(mode.ink);
  const accent = rgbToHex(...glow);

  const audio = {
    bpm: 88 + Math.round(params.motionAmplitude * 46),
    energyBias: clamp01(0.24 + v.power * 0.42),
    modeName: mode.name,
  };

  // anchors — seeded hotspot points (for the later SkyHotspotLayer / trip layer). The 'name'
  // dimension governs how many landmarks the world grows. Positions in chunk-local units 0..1.
  const anchorCount = 3 + Math.round(v.name * 5);
  const anchors = [];
  const dims = ['power', 'wonder', 'threat', 'humor', 'melancholy', 'chaos'];
  for (let i = 0; i < anchorCount; i++) {
    anchors.push({ x: rng(), z: rng(), strength: 0.4 + rng() * 0.6, dim: dims[Math.floor(rng() * dims.length)] });
  }

  return {
    storyMode: mode.key, storyModeName: mode.name, storyModeIndex: mi,
    biome, accent, palette, params, audio, anchors,
    vector: v, seed,
  };
}
