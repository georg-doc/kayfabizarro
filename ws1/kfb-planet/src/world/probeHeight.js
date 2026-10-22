// #439 · world=probe: Geländeform der Gelände-Probe als zweite Welt (Georg 21.10.). GENERIERT von probe/port/gen_height.py aus probe/gelaende-probe.html,
// nicht von Hand ändern: Probe ändern und neu erzeugen. Kopiert (nicht abgeschrieben): Rauschen (snoise), Höhenfunktion hgt() mit hraw/fbm/rfbm/octW,
// Diorama-Anker (dioSDJS/dioModJS), Sockelhöhe ringY, Flussrinne (rivSampleJS/rivModJS), Uferböschung (bankJS), Vorlagen und recipeToUI.
// Rezept → Regler → S wie „Rezept übernehmen“ in einer frischen Probe: Regler-Grundwerte aus dem HTML, Startvorlage, recipeToUI, Schieberegler-Rundung, readUI.
// Einheit J17-Meter (1 Probe-m = 1 Spiel-m, beide M_PER_RIG 0,616). Ohne three, ohne DOM.
//   createProbeHeight(recipe, { anchors, riverField, fluid }) → { height(x, z), settings, anchors, ringY(A) }
//   anchors    Diorama-Anker im Probe-Format { x, z, R, y, on, bh, bw, open, hx, hz, rot, blend }; lebende Liste wie DIOA (spätere gewinnen)
//   riverField { N, size, ox, oz, data } wie RIV der Probe (RGBA-Float: R = Sohle·Gewicht, G = Gewicht, B = 3×3-Maximum); Standard keiner → rivMod ohne Wirkung
//   fluid      Fluid-Auswahl der Probe (steht nicht im Rezept; 3 = Island Kit, Grundwert) – wirkt nur über die Böschung bei Wasserstand > 0
export const PROBE_HEIGHT_SRC = Object.freeze({"source": "probe/gelaende-probe.html", "blocksSha256": "8c02f6b0a4d83716", "generated": "2026-10-21", "NE0": "600/256", "lines": {"snoise": 2030, "hgt": 2108, "dioModJS": 2152, "ringY": 3424, "recipeToUI": 3193, "PRESETS": 2002}})
const UI = {"NUM":["scale","amp","oct","ridge","warp","macro","seed","valley","plateau","steps","sharp","maxslope","water","soft","cliff","cover","cstretch","sunel","sgrad","gs"],"BOOL":["rivers","otown","shadowdyn","retina","claytex","hero","strata","toon","mix","grid","painted","puffs","trails","rings","gridworld","clay","dio","dpal","berm","ring","stones","props","ground","shadows","crumbs","fgmass","edges","org","ether","rockc","sky2","kul","vox","voxsmooth","voxtex","flowspeed","disco","flare","cards","flowdown"],"inputs":{"scale":{"type":"range","min":60,"max":400,"step":5,"value":230},"amp":{"type":"range","min":5,"max":140,"step":1,"value":73},"oct":{"type":"range","min":1,"max":7,"step":1,"value":4},"ridge":{"type":"range","min":0,"max":1,"step":0.01,"value":0.5},"warp":{"type":"range","min":0,"max":1.6,"step":0.01,"value":0.8},"macro":{"type":"range","min":0,"max":1,"step":0.01,"value":0.5},"seed":{"type":"range","min":1,"max":999,"step":1,"value":500},"valley":{"type":"range","min":0,"max":1,"step":0.01,"value":0.5},"plateau":{"type":"range","min":0.25,"max":1,"step":0.01,"value":0.63},"steps":{"type":"range","min":0,"max":12,"step":1,"value":6},"sharp":{"type":"range","min":0,"max":1,"step":0.01,"value":0.5},"maxslope":{"type":"range","min":30,"max":80,"step":1,"value":52},"water":{"type":"range","min":0,"max":0.5,"step":0.01,"value":0.25},"rivers":{"type":"checkbox","checked":true},"ether":{"type":"checkbox","checked":true},"rockc":{"type":"checkbox","checked":true},"org":{"type":"checkbox","checked":true},"flowspeed":{"type":"checkbox","checked":true},"flowdown":{"type":"checkbox","checked":true},"soft":{"type":"range","min":0,"max":1,"step":0.01,"value":0.5},"cliff":{"type":"range","min":15,"max":60,"step":1,"value":38},"strata":{"type":"checkbox","checked":false},"toon":{"type":"checkbox","checked":false},"mix":{"type":"checkbox","checked":false},"rings":{"type":"checkbox","checked":false},"otown":{"type":"checkbox","checked":false},"disco":{"type":"checkbox","checked":false},"vox":{"type":"checkbox","checked":false},"voxsmooth":{"type":"checkbox","checked":true},"voxtex":{"type":"checkbox","checked":true},"gridworld":{"type":"checkbox","checked":false},"gs":{"type":"range","min":3,"max":32,"step":1,"value":8},"clay":{"type":"checkbox","checked":false},"claytex":{"type":"checkbox","checked":false},"dio":{"type":"checkbox","checked":true},"dpal":{"type":"checkbox","checked":true},"berm":{"type":"checkbox","checked":true},"ring":{"type":"checkbox","checked":true},"stones":{"type":"checkbox","checked":true},"props":{"type":"checkbox","checked":true},"ground":{"type":"checkbox","checked":true},"crumbs":{"type":"checkbox","checked":true},"fgmass":{"type":"checkbox","checked":true},"edges":{"type":"checkbox","checked":false},"shadowdyn":{"type":"checkbox","checked":false},"shadows":{"type":"checkbox","checked":true},"sky2":{"type":"checkbox","checked":true},"kul":{"type":"checkbox","checked":true},"sunel":{"type":"range","min":4,"max":70,"step":1,"value":49},"sgrad":{"type":"range","min":0,"max":1,"step":0.05,"value":0.6},"flare":{"type":"checkbox","checked":false},"hero":{"type":"checkbox","checked":true},"retina":{"type":"checkbox","checked":false},"painted":{"type":"checkbox","checked":true},"cards":{"type":"checkbox","checked":false},"puffs":{"type":"checkbox","checked":false},"cover":{"type":"range","min":0,"max":1,"step":0.01,"value":0.45},"cstretch":{"type":"range","min":1,"max":4,"step":0.1,"value":1},"trails":{"type":"checkbox","checked":false},"grid":{"type":"checkbox","checked":false}}}   /* Regler der Probe (aus dem HTML): NUM/BOOL wie readUI, Grundwert und Bereich je Regler */
const PRESETS = {
    'Sanfte Hügel':    { scale: 180, amp: 28, oct: 5, ridge: 0,    warp: 0.2,  macro: 0.5, seed: 42,  valley: 0.3,  plateau: 1,    steps: 0, sharp: 0.5,  water: 0.06, palA: 'moos',    palB: 'mesa',   soft: 0.35, cliff: 32, strata: false, toon: false, mix: false },
    'Tafelberge':      { scale: 230, amp: 62, oct: 5, ridge: 0.15, warp: 0.5,  macro: 0.7, seed: 7,   valley: 0.65, plateau: 0.55, steps: 4, sharp: 0.85, water: 0,    palA: 'mesa',    palB: 'wueste', soft: 0.15, cliff: 30, strata: true,  toon: true,  mix: false },
    'Terrassen-Insel': { scale: 160, amp: 40, oct: 4, ridge: 0,    warp: 0.3,  macro: 0.6, seed: 123, valley: 0.2,  plateau: 1,    steps: 7, sharp: 0.6,  water: 0.2,  palA: 'moos',    palB: 'pastell',soft: 0.1,  cliff: 34, strata: false, toon: true,  mix: false },
    'Grat-Gebirge':    { scale: 260, amp: 95, oct: 6, ridge: 0.8,  warp: 0.25, macro: 0.8, seed: 311, valley: 0.5,  plateau: 1,    steps: 0, sharp: 0.5,  water: 0.04, palA: 'schnee',  palB: 'moos',   soft: 0.25, cliff: 36, strata: true,  toon: false, mix: false },
    'Wirbel-Dünen':    { scale: 120, amp: 18, oct: 3, ridge: 0.5,  warp: 1.2,  macro: 0.3, seed: 58,  valley: 0,    plateau: 1,    steps: 0, sharp: 0.5,  water: 0,    palA: 'wueste',  palB: 'mesa',   soft: 0.3,  cliff: 40, strata: false, toon: false, mix: false },
    'Biom-Reise':      { scale: 200, amp: 45, oct: 5, ridge: 0.3,  warp: 0.45, macro: 0.75,seed: 900, valley: 0.4,  plateau: 0.7,  steps: 3, sharp: 0.7,  water: 0.04, palA: 'moos',    palB: 'mesa',   soft: 0.2,  cliff: 32, strata: true,  toon: true,  mix: true },
  };
  const DEFAULT = 'Tafelberge';
const PALETTES = {}, PAL_KEYS = [], regRezeptPal = () => {}   /* Farben zählen für die Höhe nicht; recipeToUI braucht nur die Namen */
function recipeToUI(r) {
    const p = {}, f = r.form || {}, st = r.stylize || {}, c = r.color || {}, w = r.world || {}, sk = r.sky || {}, d = w.diorama || {};
    const num = (k, v) => { if (typeof v === 'number' && isFinite(v)) p[k] = v }, bool = (k, v, dflt) => { p[k] = typeof v === 'boolean' ? v : dflt }, idx = (k, arr, v) => { const i = arr.indexOf(v); if (i >= 0) p[k] = i };
    num('seed', r.seed); num('scale', f.featureSize); num('amp', f.height); num('oct', f.octaves); num('ridge', f.ridge); num('warp', f.warp); num('macro', f.calmHillyVariation);
    num('valley', st.flatValleys); p.plateau = typeof st.plateauAt === 'number' ? st.plateauAt : 1; num('steps', st.terraces); num('sharp', st.terraceEdge); p.maxslope = typeof st.maxSlopeDeg === 'number' ? st.maxSlopeDeg : 80; num('water', st.waterLevel);
    bool('ether', st.etheringtonRound, false); bool('rockc', st.rockClusters, false);
    bool('org', c.organicFields, false); idx('fstage', ['B makro', 'C +übergänge', 'D +sprenkel', 'v3', 'v4 formlogik', '70er fliessfarben'], c.surfaceStage); num('flow', c.flowSpeed); num('bands', c.bandDensity); bool('flowspeed', c.flowWithSpeed, true); num('flowtree', c.flowOverTrees); p.kus = Math.max(0, ['aus', 'biom', 'konfetti', 'netz'].indexOf(c.polkaDot));
    if (c.palette && typeof c.palette === 'object') { const base = PALETTES[c.biome], keys = PAL_KEYS.filter((k) => /^#[0-9a-f]{6}$/i.test(c.palette[k] || ''))
      if (keys.length === PAL_KEYS.length && (!base || keys.some((k) => base[k].toLowerCase() !== c.palette[k].toLowerCase()))) { regRezeptPal(c.palette); p.palA = 'rezept' } }
    if (!p.palA && c.biome && PALETTES[c.biome]) p.palA = c.biome; if (c.biomeTravel && PALETTES[c.biomeTravel]) p.palB = c.biomeTravel; p.mix = c.biomeTravel != null;
    num('soft', c.bandSoftness); num('cliff', c.cliffSlopeDeg); bool('strata', c.strata, false); bool('toon', c.steppedLight, false);
    { const v = w.voxel || {}; bool('vox', v.on, false); if (typeof v.size === 'number') p.voxs = v.size; p.voxhSel = v.step === 'cube' ? -1 : (typeof v.step === 'number' ? v.step : 1); bool('voxsmooth', v.smoothDrive, true); bool('voxtex', v.edge3, true) }
    bool('rings', w.viewRings, false); bool('gridworld', w.gridWorld, false); num('gs', w.gridSpacing); idx('gshape', ['eckig', 'geschwungen', 'kreise'], w.gridShape); idx('gfill', ['linien', 'schachbrett', 'schachbrett+linien'], w.gridFill);
    if (w.checkerColors) p.gcol = w.checkerColors === 'bunt' ? 1 : 0; p.gtex = w.checkerTexture === 'edge3' ? 1 : 0; bool('clay', w.clayLook, false); if (w.testTempo) p.tempo = w.testTempo;
    bool('dio', d.on, false); bool('dpal', d.palette, true); bool('berm', d.plinthAndBerm, true); bool('ring', d.colourRingSpeckle, true); bool('stones', d.stoneBand, true); bool('props', d.props, true); bool('ground', d.grounding, true); bool('shadows', d.realShadows, true); bool('crumbs', d.contactCrumbs, true); bool('fgmass', d.foregroundMass, false); bool('edges', d.colouredEdges, false);
    if (sk.timeOfDay) p.tod = sk.timeOfDay; bool('painted', sk.paintedClouds, true); bool('puffs', sk.clayClouds, true); num('cover', sk.cloudCover); num('cstretch', sk.cloudStretch); num('sunel', sk.sunElevation); num('sgrad', sk.skyGradient); bool('flare', sk.lensFlare, true); if (sk.cloudFormation) p.cform = { gemischt: 0, haufen: 1, schaefchen: 2, baenke: 3, kuppel: 4 }[sk.cloudFormation] ?? 4; if (sk.aurora) p.aurora = { aus: 0, nachts: 1, immer: 2 }[sk.aurora] ?? 1; bool('trails', sk.contrails, true);
    bool('sky2', sk.v2, true); bool('kul', sk.backdrops, true); p.moon = Math.max(0, ['keiner', 'knet-mond', 'ringplanet'].indexOf(sk.body));
    return p }

// Schieberegler wie im Browser: auf [min, max] begrenzt, auf das Schrittraster gerundet (Werte auf dem Raster bleiben bitgleich)
const dec = (s) => (String(s).split('.')[1] || '').length
function rangeValue(r, v) { let x = Number(v); if (!Number.isFinite(x)) return r.value; x = Math.min(r.max, Math.max(r.min, x)); const k = (x - r.min) / r.step
  if (Math.abs(k - Math.round(k)) < 1e-9) return x; let y = +(r.min + Math.floor(k + 0.5) * r.step).toFixed(dec(r.step)); if (y > r.max) y = +(y - r.step).toFixed(dec(r.step)); return y }
function freshUI() { const st = { v: {}, c: {} }; for (const [id, r] of Object.entries(UI.inputs)) { if (r.type === 'range') st.v[id] = r.value; else st.c[id] = r.checked } return st }
function setUI(st, p) { for (const k of UI.NUM) if (p[k] != null && UI.inputs[k]) st.v[k] = rangeValue(UI.inputs[k], p[k]); for (const k of UI.BOOL) if (p[k] != null && UI.inputs[k]) st.c[k] = !!p[k] }   /* = setUI der Probe (nur Regler) */

export function createProbeHeight(recipe, { anchors = [], riverField = null, fluid = 3 } = {}) {
  if (!recipe || typeof recipe !== 'object' || !String(recipe.schema || '').startsWith('kfb.terrain-recipe/')) throw new Error('createProbeHeight: kein Gelände-Rezept (schema „kfb.terrain-recipe/…“ fehlt)')
  /* ---------- Probe 1:1 ---------- */
  const m289 = (x) => x - Math.floor(x / 289) * 289, perm = (x) => m289((x * 34 + 1) * x), fract = (x) => x - Math.floor(x);
  function snoise(vx, vy) {
    const Cx = 0.211324865405187, Cy = 0.366025403784439, Cz = -0.577350269189626, Cw = 0.024390243902439;
    const s = (vx + vy) * Cy; let ix = Math.floor(vx + s), iy = Math.floor(vy + s);
    const t = (ix + iy) * Cx, x0x = vx - ix + t, x0y = vy - iy + t;
    const i1x = x0x > x0y ? 1 : 0, i1y = x0x > x0y ? 0 : 1;
    const x1x = x0x + Cx - i1x, x1y = x0y + Cx - i1y, x2x = x0x + Cz, x2y = x0y + Cz;
    ix = m289(ix); iy = m289(iy);
    const p0 = perm(perm(iy) + ix), p1 = perm(perm(iy + i1y) + ix + i1x), p2 = perm(perm(iy + 1) + ix + 1);
    let m0 = Math.max(0.5 - (x0x * x0x + x0y * x0y), 0), m1 = Math.max(0.5 - (x1x * x1x + x1y * x1y), 0), m2 = Math.max(0.5 - (x2x * x2x + x2y * x2y), 0);
    m0 = m0 * m0 * m0 * m0; m1 = m1 * m1 * m1 * m1; m2 = m2 * m2 * m2 * m2;
    const g = (p, ax, ay, mm) => { const x = 2 * fract(p * Cw) - 1, h = Math.abs(x) - 0.5, a0 = x - Math.floor(x + 0.5); return mm * (1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h)) * (a0 * ax + h * ay) };
    return 130 * (g(p0, x0x, x0y, m0) + g(p1, x1x, x1y, m1) + g(p2, x2x, x2y, m2));
  }
  const S = {};
  const rot = (x, y) => [1.6 * x - 1.2 * y + 3.1, 1.2 * x + 1.6 * y + 1.7]; // mat2(1.6,1.2,-1.2,1.6) spaltenweise wie in GLSL
  let OCMAX = 7;
  function fbm(x, y) { let s = 0, a = 1, n = 0; const oc = Math.min(S.ether ? Math.min(S.oct, 5) : S.oct, OCMAX); for (let i = 0; i < 7 && i < oc; i++) { const ow = octW(i); if (ow < 0.001) break; s += a * ow * snoise(x, y); n += a * ow; [x, y] = rot(x, y); a *= 0.5 } return s / Math.max(n, 1e-4) }
  function rfbm(x, y) { let s = 0, a = 1, n = 0; const oc = Math.min(S.ether ? Math.min(S.oct, 4) : S.oct, OCMAX), gr = S.ether ? 0.45 : 0.5; for (let i = 0; i < 7 && i < oc; i++) { if (octW(i) < 0.001) break; const sn = snoise(x, y); const wlr = S.scale / Math.pow(2, i), kg = Math.min(0.2, Math.pow(3 * NEJ / wlr, 2)), ke = 0.06 + kg, r = S.ether ? Math.max(0, (1 - Math.sqrt(sn * sn + ke)) / (1 - Math.sqrt(ke))) : 1 - Math.sqrt(sn * sn + kg), ow = octW(i); s += a * ow * r * r; n += a * ow; [x, y] = rot(x, y); a *= S.ether ? 0.45 : 0.5 } return s / Math.max(n, 1e-4) }
  const NE0 = 600 / 256; let NEJ = NE0, GZERO = false; const octW = (i) => sstep(2, 4, (S.scale / Math.pow(2, i)) / NEJ); // wie octW/gNE im Shader (Nahgitter)
  const strU = (s) => { const k = Math.floor(s * 0.5) * 2, t = s - k; return k + (t < 1.3 ? t / 1.3 : 1 + (t - 1.3) / 0.7) }, strS = (u) => { const k = Math.floor(u * 0.5) * 2, t = u - k; return k + (t < 1 ? t * 1.3 : 1.3 + (t - 1) * 0.7) };
  const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) };
  function hraw(px, py) {
    let qx = px / S.scale + S.sx, qy = py / S.scale + S.sy;
    if (S.warp > 0) { const wx = fbm(qx * 0.6 + 5.2, qy * 0.6 + 1.3), wy = fbm(qx * 0.6 - 3.7, qy * 0.6 + 8.1); qx += S.warp * wx; qy += S.warp * wy }
    const b = Math.min(1, Math.max(0, fbm(qx, qy) * 0.75 + 0.5)), r = rfbm(qx + 17, qy - 9);
    let h = b + (r - b) * S.ridge;
    const region = sstep(-0.35, 0.45, snoise(px / (S.scale * 6) + S.sx * 0.37 + 11, py / (S.scale * 6) + S.sy * 0.37 + 11));
    h *= 1 + ((0.22 + (1.15 - 0.22) * region) - 1) * S.macro;
    h = Math.min(1, Math.max(0, h));
    if (S.valley > 0) h = Math.pow(h, 1 + S.valley * 1.6);
    return h;
  }
  function hgt(px, py) {
    let h = hraw(px, py);
    let gG = 0; if (!GZERO) { const om = OCMAX; OCMAX = 5; const a0 = hraw(px, py); gG = Math.hypot(hraw(px + NE0, py) - a0, hraw(px, py + NE0) - a0) / NE0; OCMAX = om } // wie gG im Shader
    if (S.plateau < 0.999) { const dP = h - S.plateau, kP = Math.min(0.1, Math.max(0.02, 2.6 * NEJ * gG)); h = S.plateau + dP * (1 + (0.12 - 1) * sstep(0, 2 * kP, dP)) }
    if (S.steps >= 1) { if (S.ether) { const tw = 0.35 * snoise(px / (S.scale * 2.5) + S.sx * 0.11 + 23, py / (S.scale * 2.5) + S.sy * 0.11 + 23), u = strU(h * S.steps + tw); let f = fract(u); const tanMax = S.maxslope >= 80 ? 1e6 : Math.tan(S.maxslope * Math.PI / 180), w = Math.max(Math.max(0.5 + (0.03 - 0.5) * S.sharp, 0.16), Math.min(0.5, 2.6 * NEJ * S.steps * gG / 0.7), Math.min(0.5, 0.75 * S.amp * gG / (0.7 * tanMax))); f = sstep(0.5 - w, 0.5 + w, f); h = (strS(Math.floor(u) + f) - tw) / S.steps }
      else { const s = h * S.steps; let f = fract(s); const tanMax2 = S.maxslope >= 80 ? 1e6 : Math.tan(S.maxslope * Math.PI / 180), w = Math.max(0.5 + (0.03 - 0.5) * S.sharp, Math.min(0.5, 2.6 * NEJ * S.steps * gG), Math.min(0.5, 0.75 * S.amp * gG / tanMax2)); f = sstep(0.5 - w, 0.5 + w, f); h = (Math.floor(s) + f) / S.steps } }
    return bankJS(dioModJS(px, py, rivModJS(px, py, h * S.amp)));
  }
  const BANK = { L: 0, D: 0 };
  const RIV = { on: false, N: 512, size: 1024, ox: 0, oz: 0, data: null, v: 0 };   /* Rinnen-Feld (wie uRiv/uRivO im Shader) */
  function rivSampleJS(px, pz) { if (!RIV.on) return null; const N = RIV.N, tx = (px - RIV.ox) / RIV.size * N - 0.5, tz = (pz - RIV.oz) / RIV.size * N - 0.5, cx = Math.floor(tx + 0.5), cz = Math.floor(tz + 0.5)
    if (cx < 1 || cz < 1 || cx > N - 2 || cz > N - 2) return null; const D = RIV.data; if (D[(cz * N + cx) * 4 + 2] < 1e-4) return null
    const fx = tx - cx, fz = tz - cz, wx = [0.5 * (0.5 - fx) ** 2, 0.75 - fx * fx, 0.5 * (0.5 + fx) ** 2], wz = [0.5 * (0.5 - fz) ** 2, 0.75 - fz * fz, 0.5 * (0.5 + fz) ** 2]; let r = 0, g = 0
    for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) { const k = ((cz + j - 1) * N + cx + i - 1) * 4, w = wx[i] * wz[j]; r += w * D[k]; g += w * D[k + 1] } return [r, g] }
  function rivModJS(px, pz, h) { const v = rivSampleJS(px, pz); if (!v || v[1] < 1e-4) return h; return h * (1 - v[1]) + v[0] }   /* wie bankMod im Shader (Werte setzt pushUniforms) */
  const bankJS = (hm) => BANK.D > 0 ? hm - BANK.D * (1 - sstep(-1.8, 0.4, hm - BANK.L)) : hm;
  const DIOA = anchors.map((a) => ({ ...a }));   /* Spiel: eigene Liste statt DIO/DIOS der Probe */
  const dioSDJS = (px, pz, A) => { let qx = px - A.x, qz = pz - A.z; const cs = Math.cos(A.rot || 0), sn = Math.sin(A.rot || 0), rx = cs * qx + sn * qz, rz = -sn * qx + cs * qz, ex = Math.abs(rx) - (A.hx || 0), ez = Math.abs(rz) - (A.hz || 0); return Math.hypot(Math.max(ex, 0), Math.max(ez, 0)) + Math.min(Math.max(ex, ez), 0) - A.R }
  function dioModJS(px, pz, h) {
    for (const A of DIOA) { if (!A.on) continue
      const dx = px - A.x, dz = pz - A.z, reach = A.R + Math.max(A.hx || 0, A.hz || 0) + Math.max(A.blend ?? 8, A.bw) + 1; if (dx * dx + dz * dz > reach * reach) continue
      const d = dioSDJS(px, pz, A); h = h + (A.y - h) * (1 - sstep(0, A.blend ?? 8, d))
      if (d > -0.6 && d < A.bw && S.berm) { const a = Math.atan2(dz, dx), da = Math.abs(((a - A.open + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI);
        const open = sstep(0.38, 0.62, da), vary = 1 + 0.3 * (Math.sin(a * 3 + 1.3) * 0.6 + Math.sin(a * 7 - 0.4) * 0.4);
        h += A.bh * vary * (d < 0 ? 1 : 1 - sstep(0, A.bw, d)) * open } }
    return h;
  }
  const ringY = (A) => { let y = 0; for (let k = 0; k < 9; k++) { const a = (k / 8) * Math.PI * 2, rr0 = A.R + Math.max(A.hx, A.hz); y += k === 8 ? hgt(A.x, A.z) : hgt(A.x + Math.cos(a) * rr0, A.z + Math.sin(a) * rr0) } return Math.max(y / 9, S.water * S.amp + 0.4) }
  /* ---------- Rezept → S wie in der frischen Probe: setUI(PRESETS[DEFAULT]), grid aus, setUI(recipeToUI(r)), readUI ---------- */
  const ui = freshUI(); setUI(ui, PRESETS[DEFAULT]); ui.c.grid = false; setUI(ui, recipeToUI(recipe))
  for (const k of UI.NUM) S[k] = parseFloat(ui.v[k]); for (const k of UI.BOOL) S[k] = ui.c[k]; S.fluid = fluid
  const sd = S.seed; S.sx = fract(Math.sin(sd * 12.9898) * 43758.5453) * 200 - 100; S.sy = fract(Math.sin(sd * 78.233) * 12345.6789) * 200 - 100;
  BANK.L = S.water * S.amp + 0.15; BANK.D = S.fluid === 3 && S.water > 0.005 && !S.vox ? 1.5 : 0   /* = pushUniforms der Probe (Wortlaut prüft der Generator) */
  if (riverField) Object.assign(RIV, riverField, { on: true })
  GZERO = !(S.plateau < 0.999 || S.steps >= 1)   /* gG (3 von 4 hraw je Punkt) braucht hgt nur für Tafelkante und Terrassen; ohne beide bitgleich, ≈ 4× schneller (Schalter der Probe, Voxel-Pfad) */
  return { height: hgt, settings: S, anchors: DIOA, ringY }
}
