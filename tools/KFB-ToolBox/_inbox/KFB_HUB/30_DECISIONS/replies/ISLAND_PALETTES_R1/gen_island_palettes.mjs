#!/usr/bin/env node
// KFB · Insel-Paletten R1 · Generator-Lauf (WS0 ISLAND_PALETTES_R1, 18.10.2026)
//
//   node gen_island_palettes.mjs        -> island_palettes.r1.json (kfb.island-palettes/1)
//
// NO new palette generator (V-421 addendum: "kein zweiter Palette-Generator"). Every colour comes from the ONE V-305 generator
// ../COLOR_HARMONY_R1/kfb-cartoon-palette.js (imported read-only, sha256 recorded). This script only
//   (1) calls the generator once per island with a ground hue + harmony scheme chosen from the island's mood brief,
//   (2) maps the generator's envRoles (ENV_ROLES grammar, Lab src/palettes.ts) 1:1 onto the B27 material roles,
//   (3) fills the two proposal roles snow/cloud from the generator's own cream (ladderOf(roles.cloud)),
//   (4) applies the few per-island re-assignments allowed by Georg's chromatic-surreal six-colour rule (V-421 addendum) –
//       only generator colours, never a new hex,
//   (5) runs the checks: ground/grass not saturated green (WSB VORSCHLAG_BODENFARBE_R1 rule 1), nothing grey (OKLCH C),
//       no neon (C ≤ MODEL.C.popMax), islands distinguishable (ΔE OKLab).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as KP from '../COLOR_HARMONY_R1/kfb-cartoon-palette.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GEN = path.resolve(HERE, '../COLOR_HARMONY_R1/kfb-cartoon-palette.js');
const sha = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const r3 = (x) => +x.toFixed(3);

/* ------------------------------------------------------------------ rules (each cited) */
const RULES = {
  R1: { text: 'One OKLCH harmony rule, one generator: ground hue g carries the mood; strang/accent = g ± scheme angle on the warm side; landmark opposite, pulled into the candy band; leaf green, autumn on green/teal ground; sky = leaf + 90°; trunk/earth = leaf − 105°; lightness/chroma ladders with the anti-neon cap.', source: 'V-305 (DECISIONS.md, Hub col04 PASS) · replies/COLOR_HARMONY_R1/README.md §1–§3 · kfb-cartoon-palette.js fromHue()' },
  R2: { text: 'The mood/story colour goes on the GROUND (60 % of the picture), lightness from the J17 ladder, not from a dark web colour.', source: 'V-305 ("Story-Farbe bleibt auf dem Boden") · COLOR_HARMONY_R1/README.md §3.7 (fromStoryMode)' },
  R3: { text: 'Islands carry no story mode of their own; story-mode colours (V-292) are a later accent, not the ground. Here the ground hue comes from the island mood brief instead of a card.', source: 'V-342 (1) · V-292 (story-mode hexes, not used as ground)' },
  R4: { text: 'Role grammar = ENV_ROLES (ground, grass, stone, bark, leaf, bloom, water, accent, sand, paved, earth), three tones light/mid/dark; the generator\'s envRoles output is this grammar, mapped 1:1 by material name kfb_role_<role>_<tone>.', source: 'Lab src/palettes.ts ENV_ROLES (read only) · COLOR_HARMONY_R1/README.md §3.8 (envRoles) · B27/RETURN.md (material names)' },
  R5: { text: 'Ladders: light = +0.07 L (C × 0.95), dark = −0.09 L.', source: 'COLOR_HARMONY_R1/README.md §3.9 · MODEL.ladder' },
  R6: { text: 'Proposal roles snow and cloud = the generator cream (Creme 80–84°, L 0.93, C ≈ 0.03) as a ladder, light end only (tones light, light, mid): the dark cream tone read as sand on Iceland (iter3). B27 fallback would be sand/paved.', source: 'COLOR_HARMONY_R1/README.md §2 (Wolke · Weg · Sand) · B27/RETURN.md (snow/cloud proposal)' },
  R7: { text: 'Ground never a saturated green: no ground/grass tone with HSV hue 55–170° and saturation > 0.35 (moss, leaf, grass, lime under ACES).', source: '50_BLENDER/SPEC/VORSCHLAG_BODENFARBE_R1.md rule 1 (WSB) · V-396 context' },
  R8: { text: 'Chromatic-surreal six-colour rule: every object of a diorama may use any of the six colours of its zone palette; leaf/trunk/cloud/stone are defaults, not prohibitions (purple clouds, light-blue trunks, yellow crowns). No new hex set, V-305 stays the base.', source: 'CHANGELOG 2026-10-17 · V-421 R1.2 (register branch / PR #418, gh/research/v421-landmark-source-clay-proof-2026-10-17 commit 04cfdc7bb) · replies/V421_SOURCE_PROOF/LANDMARK_CHROMATIC_DIORAMA_STYLE_R1.md' },
  R9: { text: 'Never neon: chroma capped (pop ≤ 0.195, field ≤ 0.14, rest ≈ 0.07, neutral ≈ 0.03) even where sRGB would allow more.', source: 'COLOR_HARMONY_R1/README.md §1 · MODEL.C' },
  R10: { text: 'Fixed road/rim colours are not island roles here (asphalt #3d4a60, J17 bande) – not used by the B27 materials.', source: 'V-102 / V-174' },
};
const SIX_DEF = 'six leading colours per island (R8) = ground.mid, accent.mid (strang), landmark.mid (tower), leaf.mid, sky.mid, bark.mid (trunk/earth); order as in this list';

/* ------------------------------------------------------------------ islands: mood brief -> generator call */
// glb paths: hub-relative (private Unity-EULA assets, local only)
const G = (n) => `hub:50_BLENDER/B27/_privat_kauf_asset/KFB_Island_${n}.r1.glb`;
const ISLANDS = [
  { id: '01_Port', glb: G('01_Port'),
    mood: 'A tidy little harbour at blue hour, where the lighthouse keeper lights the lamp before the fishing boats come in. A slate-blue harbour plate, cream quay sand, a coral-red light and a brick-orange underbelly that every sailor reads from far away.',
    hue: 255, scheme: 'joyride', remap: [
      { role: 'stone', from: 'envRoles.ground', why: 'rim rock in the blue ground ladder: the whole top reads as one slate-blue harbour plate instead of dusty earth-grey' },
      { role: 'earth', from: 'envRoles.landmark', tones: [0, 0, 1], why: 'underside (earth role) in the landmark orange, one step lighter because it sits in shadow: warm brick under the blue top (Canyon-style warm underside, no brown)' },
    ] },
  { id: '02_River', glb: G('02_River'),
    mood: 'A glacier river runs through a pine valley on a clear morning; the bear fishes, the canoe drifts. Glacier-blue meadow, deep green pines, a candy-pink cliff underneath – cold water, warm heart.',
    hue: 225, scheme: 'joyride', remap: [
      { role: 'earth', from: 'envRoles.accent', why: 'underside (earth role on this island) in the strang pink instead of terracotta: no brown-under-green, pink↔green complement' },
      { role: 'stone', from: 'ladderOf(roles.cloud)', why: 'the big boulder as pale glacier granite (generator cream)' },
    ] },
  { id: '03_Backyard', glb: G('03_Backyard'),
    mood: 'Sunday afternoon in somebody\'s backyard: swing, barbecue, an old car nobody drives any more. Sun-warmed terracotta-rose lawn, a butter-yellow car, blue trunks and a blue underside like a plastic paddling pool – lazy, warm, a bit kitsch.',
    hue: 20, scheme: 'joyride', remap: [
      { role: 'bark', from: 'envRoles.landmark', why: 'trunks in the landmark blue (Georg example: light-blue trunks)' },
      { role: 'earth', from: 'envRoles.landmark', tones: [0, 0, 1], why: 'underside (earth role) in the landmark blue, one step lighter (shadow side): a paddling-pool blue cone instead of a brown one' },
    ] },
  { id: '04_Beach', glb: G('04_Beach'),
    mood: 'A stilt-house beach bar on bright sand, where the radio plays and nobody checks the time. Light sand, aqua lagoon, a violet coral reef underneath and pink blossom – the Bikini-Bucht recipe.',
    hue: 88, scheme: 'joyride', remap: [
      { role: 'stone', from: 'ladderOf(roles.rock)', why: 'rocks = the generator\'s J17 rock role (Bucht: violet coral, roles.rock = tower[1])' },
      { role: 'earth', from: 'ladderOf(roles.rock)', tones: [0, 1, 1], why: 'underside (earth role) as violet coral reef, lighter tones for the shadow side: no brown cone under the sand' },
    ] },
  { id: '05_PirateCave', glb: G('05_PirateCave'),
    mood: 'A smugglers\' fort on violet cliffs at dusk, treasure hidden somewhere in the cave below. Claybound violet stone, an orange underbelly, and everything worth stealing glows orange – the Canyon recipe with a monochrome landmark.',
    hue: 300, scheme: 'joyride', remap: [
      { role: 'stone', from: 'envRoles.ground', why: 'cliffs in the violet ground ladder (Claybound-Canyon table rock)' },
      { role: 'bark', from: 'envRoles.earth', why: 'timber in the vivid mono earth (J17 Canyon under[1–3] orange) instead of the dull mono trunk brown' },
      { role: 'earth', from: 'envRoles.accent', tones: [0, 0, 1], why: 'underside (earth role) in the light strang/landmark orange (mono): the mono earth read maroon in the underside shadow (iter3)' },
    ] },
  { id: '06_Iceland', glb: G('06_Iceland'),
    mood: 'Snowy peaks and a fishing hamlet under a northern sky, where the aurora paints the snow pink at night. Ice-blue rock and cream snow, magenta lights, warm coral huts.',
    hue: 230, scheme: 'joyride', remap: [
      { role: 'stone', from: 'envRoles.sky', why: 'mountains + underside in the sky ladder: ice-blue rock (B27 RETURN suggestion "blaugrauer Fels", Georg example light blue), never beige' },
    ] },
  { id: '07_PondLand', glb: G('07_PondLand'),
    mood: 'A torii stands at the koi pond at lantern time, and a frog keeps the beat. Plum-rose garden, vermilion-orange gate, lemon-yellow crowns and a deep plum underside – a dream of a Japanese garden, not a postcard.',
    hue: 330, scheme: 'joyride', remap: [
      { role: 'bark', from: 'envRoles.ground', tones: [1, 2, 2], why: 'trunks in the plum ground ladder: crowns and gate pop against them' },
      { role: 'bloom', from: 'ladderOf(roles.pad)', tones: [0, 0, 1], why: 'crowns (bloom role) in the pad yellow (Georg example: yellow crowns); the mono-rule lime read olive under the stage light (iter4)' },
      { role: 'earth', from: 'envRoles.ground', tones: [0, 1, 1], why: 'underside (earth role) in the plum ground ladder (J17 under0 = ground darker; lighter tones for the shadow side): one plum body' },
    ] },
  { id: '08_Forest', glb: G('08_Forest'),
    mood: 'A woodcutter\'s cabin deep in an autumn forest, chimney smoke curling into the evening. Teal forest floor, orange crowns on lilac trunks, a magenta roof light and violet smoke clouds – the O-Town recipe.',
    hue: 198, scheme: 'joyride', remap: [
      { role: 'cloud', from: 'envRoles.bark', why: 'chimney smoke + clouds in the lilac trunk ladder (Georg example: purple clouds)' },
      { role: 'earth', from: 'envRoles.bark', tones: [0, 0, 1], why: 'underside (earth role) in the lilac trunk ladder instead of the autumn earth (L 0.35 = near black in shadow): the O-Town purple underside, readable' },
    ] },
];

/* ------------------------------------------------------------------ helpers */
const hsv = (h) => { const n = parseInt(h.slice(1), 16), r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let H = 0; if (d) { if (mx === r) H = ((g - b) / d) % 6; else if (mx === g) H = (b - r) / d + 2; else H = (r - g) / d + 4; H *= 60; if (H < 0) H += 360; } return { h: Math.round(H), s: r3(mx ? d / mx : 0), v: r3(mx) }; };
const lch = (hex) => { const o = KP.hexToOklch(hex); return { L: r3(o.L), C: r3(o.C), h: +o.h.toFixed(1) }; };
const ladder = (hex) => KP.ladderOf(KP.hexToOklch(hex));
const ISLAND_ROLES = ['ground', 'grass', 'stone', 'bark', 'leaf', 'bloom', 'water', 'accent', 'sand', 'paved', 'earth', 'snow', 'cloud'];

function buildIsland(cfg) {
  const p = KP.fromHue(cfg.hue, 0, cfg.scheme);           // seed 0 = pure rule, no dice
  const env = p.envRoles, cream = ladder(p.roles.cloud);
  const roles = {}, roleSource = {};
  for (const r of ISLAND_ROLES) {
    if (env[r]) { roles[r] = [...env[r]]; roleSource[r] = `envRoles.${r} (R4)`; }
    else { roles[r] = [cream[0], cream[0], cream[1]]; roleSource[r] = 'ladderOf(roles.cloud) tones 0,0,1 (R6: snow/cloud stay at the light end; B27 tone = brightness rank inside the role, so snow_2 is still snow)'; }
  }
  // R8 re-assignments: only generator outputs
  const pool = { ...Object.fromEntries(Object.entries(env).map(([k, v]) => ['envRoles.' + k, v])), 'ladderOf(roles.cloud)': cream, 'ladderOf(roles.pad)': ladder(p.roles.pad), 'ladderOf(roles.rock)': ladder(p.roles.rock), 'ladderOf(roles.under[0])': ladder(p.roles.under[0]) };
  for (const m of cfg.remap) {
    const src = pool[m.from]; if (!src) throw new Error(cfg.id + ': unknown remap source ' + m.from);
    roles[m.role] = m.tones ? m.tones.map((i) => src[i]) : [...src];
    roleSource[m.role] = `${m.from}${m.tones ? ' tones ' + m.tones.join(',') : ''} (R8: ${m.why})`;
  }
  const six = [env.ground[1], env.accent[1], env.landmark[1], env.leaf[1], env.sky[1], env.bark[1]];
  // checks
  const groundish = ['ground', 'grass'].flatMap((r) => roles[r].map((hex, i) => ({ role: r, tone: i, hex, ...hsv(hex) })));
  const lime = groundish.filter((x) => x.h >= 55 && x.h <= 170 && x.s > 0.35);
  const all = Object.entries(roles).flatMap(([r, t]) => t.map((hex, i) => ({ role: r, tone: i, hex, ...lch(hex) })));
  const grey = all.filter((x) => x.C < 0.02 && x.L > 0.25 && x.L < 0.9);   // grey = near-neutral at mid lightness; cream/white highlights (L ≥ 0.9) are the generator's Creme
  const neon = all.filter((x) => x.C > KP.MODEL.C.popMax + 0.005);
  return {
    p, entry: {
      glb: cfg.glb, mood: cfg.mood,
      recipe: { call: `fromHue(${cfg.hue}, 0, '${cfg.scheme}')`, generator: 'kfb-cartoon-palette/1', hues: p.hues, mode: p.mode, rules: ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R9', ...(cfg.remap.length ? ['R8'] : [])] },
      six, roles, roleSource,
      remaps: cfg.remap.map((m) => ({ role: m.role, from: m.from, tones: m.tones || [0, 1, 2], why: m.why, rule: 'R8' })),
      checks: {
        groundNotGreen: { rule: 'R7', pass: lime.length === 0, offenders: lime, groundMidHSV: hsv(roles.ground[1]), grassMidHSV: hsv(roles.grass[1]) },
        noGrey: { rule: 'no tone with OKLCH C < 0.02 at 0.25 < L < 0.9 (mid grey); cream ≥ L 0.9 allowed (R6)', pass: grey.length === 0, minC: Math.min(...all.map((x) => x.C)), offenders: grey },
        noNeon: { rule: 'R9', pass: neon.length === 0, maxC: Math.max(...all.map((x) => x.C)), offenders: neon },
      },
    },
  };
}

const islands = {}, built = {};
for (const cfg of ISLANDS) { const b = buildIsland(cfg); built[cfg.id] = b; islands[cfg.id] = b.entry; }
/* distinguishability on what is actually SEEN: each island = its applied colours weighted by world-space surface area per material
   (area_shares.r1.json from island_area_shares.py; the B27 face counts are inflated by the bevel). Distance A↔B = area-weighted mean
   over A's colours of the nearest ΔE in B, averaged both ways (chamfer distance, OKLab). Also: leading colours by area, top and underside. */
const AREA = JSON.parse(fs.readFileSync(path.join(HERE, 'area_shares.r1.json'), 'utf8')).islands;
const ROLE_RE = /^kfb_role_([a-z]+)_([0-2])$/;
const applied = (id, part = 'all') => { const acc = {}; for (const [m, w] of Object.entries(AREA[id][part])) { const k = ROLE_RE.exec(m); if (!k) continue; const hex = islands[id].roles[k[1]][+k[2]]; acc[hex] = (acc[hex] || 0) + w; } return Object.entries(acc).sort((x, y) => y[1] - x[1]); };
for (const id of Object.keys(islands)) {
  const all = applied(id), up = applied(id, 'up'), down = applied(id, 'down');
  islands[id].seen = { method: 'area_shares.r1.json (world-space area per material)', leading: all.slice(0, 6).map(([hex, w]) => ({ hex, share: r3(w) })), top: up.slice(0, 3).map(([hex, w]) => ({ hex, share: r3(w) })), underside: down.slice(0, 2).map(([hex, w]) => ({ hex, share: r3(w) })) };
  islands[id].lead6 = all.slice(0, 6).map(([hex]) => hex);
}
const chamfer = (A, B) => A.reduce((s, [h, w]) => s + w * Math.min(...B.map(([g]) => KP.deltaE(h, g))), 0) / A.reduce((s, [, w]) => s + w, 0);
const ids = Object.keys(islands), pairs = [];
for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
  const A = applied(ids[i]), B = applied(ids[j]);
  pairs.push({ a: ids[i], b: ids[j], seenChamfer: r3((chamfer(A, B) + chamfer(B, A)) / 2), topMain: r3(KP.deltaE(applied(ids[i], 'up')[0][0], applied(ids[j], 'up')[0][0])), undersideMain: r3(KP.deltaE(applied(ids[i], 'down')[0][0], applied(ids[j], 'down')[0][0])) });
}
pairs.sort((x, y) => x.seenChamfer - y.seenChamfer);

const out = {
  schema: 'kfb.island-palettes/1', version: 'r1', created: new Date().toISOString().slice(0, 10), by: 'WS0 · ISLAND_PALETTES_R1',
  private: 'GLBs are Unity-EULA purchase assets (Low Poly Floating Islands, streakbyte): palette data is ours, renders stay local in evidence/_privat/',
  generator: { file: 'replies/COLOR_HARMONY_R1/kfb-cartoon-palette.js', version: KP.MODEL.version, sha256: sha(GEN), note: 'byte-identical to the WS1 vendored copies (gh/ws1/look-mesa, gh/ws1/s1-weltboden …/vendor/palette/kfb-cartoon-palette.js)' },
  apply: { module: 'apply-island-palette.v1.js', by: 'material name kfb_role_<role>_<tone>, tone 0 light / 1 mid / 2 dark, at runtime; GLBs unchanged' },
  rules: RULES, sixColours: SIX_DEF,
  islands,
  distinguishability: { metric: 'ΔE OKLab (0.02 barely, 0.05 clearly, 0.10 another colour; COLOR_HARMONY_R1 §4). seenChamfer = area-weighted nearest-colour ΔE both ways; topMain / undersideMain = ΔE of the largest top / underside colour', closestPairs: pairs.slice(0, 6), minSeenChamfer: Math.min(...pairs.map((x) => x.seenChamfer)), allPairs: pairs },
};
const file = path.join(HERE, 'island_palettes.r1.json');
fs.writeFileSync(file, JSON.stringify(out, null, 1));
for (const id of ids) {
  const e = islands[id], c = e.checks;
  console.log(`${id.padEnd(13)} ${e.recipe.call.padEnd(26)} ground ${e.roles.ground[1]} grass ${e.roles.grass[1]} accent ${e.roles.accent[1]} landmark ${e.six[2]} leaf ${e.roles.leaf[1]}  green:${c.groundNotGreen.pass ? 'ok' : 'FAIL'} grey:${c.noGrey.pass ? 'ok' : 'FAIL'}(minC ${c.noGrey.minC}) neon:${c.noNeon.pass ? 'ok' : 'FAIL'}`);
}
console.log('closest pairs (seen chamfer ΔE):', pairs.slice(0, 5).map((x) => `${x.a}/${x.b} ${x.seenChamfer} (top ${x.topMain}, under ${x.undersideMain})`).join(' · '));
console.log('-> ' + file);
