/* P1 · Parcours-Rezepte für den bestehenden Track Core (lab-track/core/track-core.v012.mjs, Kopie aus
 * KFB Racetrack Blender Kit/TRACK-CORE/S13_V012_2026-09-28). Kein zweiter Track-Owner: hier stehen nur Rezepte,
 * kompiliert und geprüft wird ausschließlich vom Core (compileRecipe / compileGraph + runChecks / runGraphChecks).
 * TD03 wird unverändert aus presets.v012.json übernommen (Fingerprint 256f2478 = td03.stream.json).
 * Fahrschul-Bausteine = FS01-Stücke (layout/fs01.mjs, S7) · Tunnel = TUNNEL_PRESETS · Hero Jump / Skydrive: im Core
 * kein eigenes Stück, hier aus KICKER/AIR/LANDING/SPIRAL/WIDTH_STEP komponiert (Vorschlag, Georg entscheidet). */
const LOCKED = { mode: 'locked' }, FREE = { mode: 'free' }, ASSIST = { mode: 'assist' };
const hop = (k) => [
  { id: `buoy${k}_kick`, type: 'KICKER', length: 14, lipHeight: 1.5, lipDeg: 16, skin: 'buoy', drive: { mode: 'assist', fx: ['bounce'] }, tags: ['fahrschule'] },
  { id: `buoy${k}_air`, type: 'AIR', gap: 26, drop: 1.5, drive: { mode: 'assist', fx: ['bounce'] }, tags: ['fahrschule'] },
  { id: `buoy${k}_land`, type: 'LANDING', length: 26, drop: 0, skin: 'buoy', drive: { mode: 'assist', fx: ['bounce'] }, tags: ['fahrschule'] }];
export const BLOCKS = {
  tunnel: (turn = 90, preset = 'gotthard') => [
    { id: 'p1_to_nature', type: 'TRANSITION', to: 'nature', length: 80 },
    { id: 'tunnel_in', type: 'STRAIGHT', length: 60, tunnel: { preset }, tags: ['tunnel'] },
    { id: 'tunnel_bend', type: 'CURVE_EASE', turn, radius: 90, bankDeg: 0, tags: ['tunnel'] },
    { id: 'tunnel_out', type: 'STRAIGHT', length: 40, tunnel: null, tags: ['tunnel'] }],
  hero: () => [
    { id: 'hero_wide', type: 'WIDTH_STEP', widthTo: 'HERO', markings: 'TRACK', tags: ['hero'] },
    { id: 'hero_run', type: 'STRAIGHT', length: 60, tags: ['hero'] },
    { id: 'hero_kick', type: 'KICKER', length: 40, lipHeight: 6, lipDeg: 20, tags: ['hero'] },
    { id: 'hero_air', type: 'AIR', gap: 42, drop: 0, tags: ['hero'] },
    { id: 'hero_land', type: 'LANDING', length: 40, drop: 6, tags: ['hero'] },
    { id: 'hero_narrow', type: 'WIDTH_STEP', widthTo: 'STANDARD', tags: ['hero'] }],
  fahrschule: (turnIn = 90, hops = 3) => [
    { id: 'fs_bend', type: 'CURVE_EASE', turn: turnIn, radius: 70, bankDeg: 0, tags: ['fahrschule'] },
    { id: 'fs_pad', type: 'STRAIGHT', length: 120, drive: FREE, tags: ['fahrschule', 'practice_pad'], markings: 'STREET' },
    { id: 'fs_pier', type: 'STRAIGHT', length: 30, rise: 2.2, markings: 'TRACK', tags: ['fahrschule'] },
    ...Array.from({ length: hops }, (_, k) => hop(k + 1)).flat(),
    { id: 'fs_pier_in', type: 'STRAIGHT', length: 30, rise: -2.2, skin: 'track', tags: ['fahrschule'] },
    { id: 'fs_loop_in', type: 'STRAIGHT', length: 16, markings: 'MAG', drive: LOCKED, tags: ['fahrschule'], params: { sideL: { to: 0.45 }, sideR: { to: 0.45 }, deckDepth: { to: 1 } } },
    { id: 'fs_loop', type: 'LOOP', height: 60, side: 1, drive: LOCKED, tags: ['fahrschule'] },
    { id: 'fs_loop_out', type: 'STRAIGHT', length: 20, markings: 'TRACK', tags: ['fahrschule'], params: { sideL: { to: 1 }, sideR: { to: 1 }, deckDepth: { to: 2.25 } } },
    { id: 'fs_catch', type: 'CURVE_EASE', turn: 90, radius: 42, ease: 18, bankDeg: 18, markings: 'MAG', drive: { mode: 'locked', fx: ['magnet_catch'] }, tags: ['fahrschule'] }],
  skydrive: (turn = 720, ridge = 60) => [
    { id: 'sky_run', type: 'STRAIGHT', length: 40, markings: 'TRACK', tags: ['skydrive'] },
    { id: 'sky_spiral', type: 'SPIRAL', turn, radius: 40, rise: 40, riseEase: 'ramp', riseBlend: 0.3, bankDeg: 0, tags: ['skydrive'] },
    { id: 'sky_ridge', type: 'STRAIGHT', length: ridge, markings: 'MAG', tags: ['skydrive'] },
    { id: 'sky_kick', type: 'KICKER', length: 30, lipHeight: 2, lipDeg: 10, tags: ['skydrive'] },
    { id: 'sky_air', type: 'AIR', gap: 50, drop: 10, tags: ['skydrive'] },
    { id: 'sky_land', type: 'LANDING', length: 70, drop: 32, tags: ['skydrive'] }],
  home: (start) => [{ id: 'home', type: 'CONNECT', to: { p: start.p, headingDeg: start.headingDeg, grade: 0 }, stretch: 1, bankDeg: 0, markings: 'STREET' }]
};
const S = (id, length, x = {}) => ({ id, type: 'STRAIGHT', length, ...x });
/* Alle drei Varianten: Core v0.12, alle error-Checks grün (29.09., run_script). Offene warns stammen aus TD03 selbst
 * (roof_loop 26 m, Breitenwechsel 1:11, Kreuzung 3,35 m unter 7 m Hüllkurve) plus Hero Jump „Boost nötig“ (Lippe 31–32 m/s > vMax 27). */
/* J14 · Fahrschul-Pad + geführte Wendestelle als Core-Pads (v0.6 `recipe.pads`, compilePad + Check pad_level). Pads ändern die Route nicht:
 * die Samples (und damit der Fingerprint) bleiben gleich, der Core liefert nur Umriss + Stationen in Weltkoordinaten. Lage relativ zu einem
 * Stück der kompilierten Route (u entlang, v nach rechts = +R). Geführt: k2 bleibt an der Strecke, Parkboxen liegen AUF den Fahrspuren. */
export const J14_PADS = [
  { id: 'fs_pad_j14', piece: 'fs_pad', kind: 'practice', size: [120, 14.4], radius: 1.5, drive: { mode: 'free', guided: true },
    stations: [{ type: 'parking_box', id: 'P1', at: [-24, -3.6], size: [5.4, 3.0] }, { type: 'parking_box', id: 'P2', at: [24, 3.6], size: [5.4, 3.0] },
      { type: 'brake_line', from: [50, -7.2], to: [50, 7.2] }, { type: 'sign', at: [-56, 0], text: 'FAHRSCHULE · Parken geführt' }] },
  { id: 'wende_j14', piece: 'plaza_hairpin', kind: 'turnaround', fit: 'piece', radius: 2, drive: { mode: 'assist', guided: true },
    stations: [{ type: 'sign', at: [0, 0], text: 'WENDESTELLE · geführt' }] }];
/* Pad-Rahmen aus der kompilierten Route: Mitte, Richtung, Höhe des Stücks (fit 'piece' = Umriss um alle Stück-Samples + Halbbreite) */
export function placePads(stream, defs = J14_PADS) {
  const S = stream.samples, J = stream.joints || stream._joints;
  return defs.map(d => { const k = J.findIndex(j => j.piece === d.piece); if (k < 0) return null; const a = J[k].index, b = k + 1 < J.length ? J[k + 1].index : S.length - 1;
    const mid = S[Math.round((a + b) / 2)], T = d.fit === 'piece' ? S[a].T : mid.T, psi = Math.atan2(-T[0], T[2]), deg = psi * 180 / Math.PI;
    let center = [mid.p[0], mid.p[2]], size = d.size;
    if (d.fit === 'piece') { const Tu = [-Math.sin(psi), Math.cos(psi)], Rv = [-Math.cos(psi), -Math.sin(psi)], hw = (S[a].prm.width || 14.4) / 2 + 0.3; let u0 = 1e9, u1 = -1e9, v0 = 1e9, v1 = -1e9;
      for (let i = a; i <= b; i++) { const x = S[i].p[0], z = S[i].p[2], u = x * Tu[0] + z * Tu[1], v = x * Rv[0] + z * Rv[1]; u0 = Math.min(u0, u - hw); u1 = Math.max(u1, u + hw); v0 = Math.min(v0, v - hw); v1 = Math.max(v1, v + hw); }
      const uc = (u0 + u1) / 2, vc = (v0 + v1) / 2; center = [Tu[0] * uc + Rv[0] * vc, Tu[1] * uc + Rv[1] * vc]; size = [u1 - u0, v1 - v0]; }
    const { piece, fit, ...pad } = d; return { ...pad, center, y: mid.p[1], size, headingDeg: +deg.toFixed(4), anchor: { piece, s0: S[a].s, s1: S[b].s } }; }).filter(Boolean);
}
export function variants(td03) {
  const td = td03.pieces.map(p => ({ ...p })), start = td03.start, base = { schema: 'kfb.route-recipe/0.1-draft', start, defaults: td03.defaults, closed: true };
  const B = BLOCKS;
  return [
    { key: 'A', label: 'Große Runde', note: 'Uni-Center → Tunnel → Hero Jump → Fahrschule → Skydrive → Start', kind: 'recipe',
      recipe: { ...base, id: 'P1_A_GROSSE_RUNDE', pieces: [...td, ...B.tunnel(90), ...B.hero(), ...B.fahrschule(90), ...B.skydrive(720, 60), ...B.home(start)] } },
    { key: 'B', label: 'Stadt → Fahrschule → Finale', note: 'Uni-Center → Stadtstraße → Fahrschule (4 Bojen) → Skydrive → Tunnel → Hero Jump als Finale vor dem Start', kind: 'recipe',
      recipe: { ...base, id: 'P1_B_STADT_FINALE', pieces: [...td, S('city_east', 250, { markings: 'STREET' }), ...B.fahrschule(90, 4), ...B.skydrive(720, 60), ...B.tunnel(90), ...B.hero(), ...B.home(start)] } },
    { key: 'C', label: 'Weiche: Hero-Linie oder Straße', note: 'Uni-Center → Weiche (links Hero-Sprung, rechts Straße) → Tunnel → Fahrschule (6 Bojen) → Skydrive → Start', kind: 'graph',
      graph: { schema: 'kfb.route-graph/0.1-draft', id: 'P1_C_WEICHE', ds: 0.5, defaults: td03.defaults, routes: [
        { id: 'M', closed: true, start, pieces: [...td,
          { id: 'p1_to_track', type: 'TRANSITION', to: 'track', length: 80 },
          { id: 'switch', type: 'FORK', fullWidth: 28.8, widen: 30, length: 60, keep: 1 },
          S('street_lane', 200),
          { id: 'rejoin', type: 'JOIN', narrowTo: 14.4, length: 60, narrow: 30, keep: 1 },
          ...B.tunnel(90).slice(1), S('south_run', 400), ...B.fahrschule(90, 6), ...B.skydrive(720, 60), ...B.home(start)] },
        { id: 'J', from: { route: 'M', piece: 'switch' }, to: { route: 'M', piece: 'rejoin' }, pieces: [
          { id: 'j_run', type: 'STRAIGHT', length: 20, markings: 'TRACK', tags: ['hero'] },
          { id: 'j_kick', type: 'KICKER', length: 40, lipHeight: 6, lipDeg: 20, tags: ['hero'] },
          { id: 'j_air', type: 'AIR', gap: 34, drop: 0, tags: ['hero'] },
          { id: 'j_land', type: 'LANDING', length: 40, drop: 6, tags: ['hero'] }] }] } }
  ];
}
