/* KFB · HX1 · Kosmos-Route v1 (30.09.) — Vorlage: KFB World Core R1A · Tor 1 Cosmos Maquette (Georg): Burg in der Mitte, etwas höher,
 * drei Deck-Inseln außen auf leicht unterschiedlichen Höhen, Ring Burg → A → B → Looping → C → Burg. Werte aus R1A lagen nicht vor
 * (cosmos-maquette.r1a.js / cosmos.r1a.json fehlen), Lage und Höhen hier gesetzt.
 * Eine geschlossene Route für den Track Core v0.12 (vendor-j15, unverändert). Keine zweite Streckenlogik: hier stehen nur
 * Rezeptstücke, kompiliert und geprüft wird im Core. Stückfolgen im Rinnstein nach Joyride (p1-recipes.js BLOCKS: skydrive,
 * fahrschule-Looping, hero-Sprung), auf den Inseln STRAIGHT über die Hex-Wegkacheln mit flachem Deck (liegt auf).
 * Achsen auf den Inseln: nur ψ ∈ {±30°, ±90°, ±150°} — das sind die drei Durchfahrten einer Hex-Straße (hex_road_A, Kanten {n, n+3}). */
export const AXES = [-90, -30, 30, 90, 150, -150];   // ψ je Richtung 0…5 (O, SO, SW, W, NW, NO) — T = [−sin ψ, 0, cos ψ]
const DEG = Math.PI / 180;
const T = psi => [-Math.sin(psi * DEG), Math.cos(psi * DEG)];

/* Inseln: Mitte, Höhe der Fahrbahn, Richtung d (0…5) der Durchfahrt, Ring r (1 = 7 Hex, 2 = 19 Hex) */
export function cosmosIslands(W) {
  const R = W * 17;
  const at = (deg, k = 1) => [Math.cos(deg * DEG) * R * k, Math.sin(deg * DEG) * R * k];
  return [
    { id: 'K', name: 'Burg · King Kayfabian', deck: null, c: [0, 0], y: 140, d: 4, r: 2, start: true },
    { id: 'A', name: 'A · Utopia', deck: 'utopia', c: at(110), y: 90, d: 3, r: 1, feature: null },
    { id: 'B', name: 'B · Dystopia', deck: 'dystopia', c: at(230), y: 40, d: 1, r: 1, feature: null },
    { id: 'C', name: 'C · Protopia', deck: 'protopia', c: at(350), y: 115, d: 5, r: 1, feature: 'tunnel' }
  ];
}

export function cosmosRecipe(W, islands, { roadLift = 0.6 } = {}) {
  const thin = { deckDepth: { to: roadLift, zone: [0.9, 1] } }, thick = { deckDepth: { to: 2.25, zone: [0, 0.12] } };
  /* Durchfahrt je Insel: die Hex-Achse nächst der Winkelhalbierenden aus Anflug (vorige → diese) und Abflug (diese → nächste) */
  islands.forEach((I, i) => { if (I.fixD) return; const n = islands.length, A0 = islands[(i + n - 1) % n].c, A1 = islands[(i + 1) % n].c, u = (a, b) => { const x = b[0] - a[0], z = b[1] - a[1], l = Math.hypot(x, z) || 1; return [x / l, z / l]; };
    const vi = u(A0, I.c), vo = u(I.c, A1), dx = vi[0] + vo[0], dz = vi[1] + vo[1];
    let best = 0, bd = -2; AXES.forEach((psi, d) => { const t = T(psi), v = (t[0] * dx + t[1] * dz) / Math.hypot(dx, dz); if (v > bd) { bd = v; best = d; } }); I.d = best; });
  const r4 = x => Math.round(x * 1e4) / 1e4, P = p => p.map(r4);
  const ends = islands.map(I => { const psi = AXES[I.d], t = T(psi), h = (I.r + 0.5) * W;
    return { I, psi, t, A: P([I.c[0] - t[0] * (h + W * 3), I.y, I.c[1] - t[1] * (h + W * 3)]), E: P([I.c[0] - t[0] * h, I.y, I.c[1] - t[1] * h]), X: P([I.c[0] + t[0] * h, I.y, I.c[1] + t[1] * h]), L: (2 * I.r + 1) * W }; });
  const isle = (e, extra = {}) => ({ id: 'isle_' + e.I.id, type: 'STRAIGHT', length: r4(e.L), markings: 'STREET', tags: ['hx_isle', 'isle_' + e.I.id], ...extra });
  /* Anflug: Wegpunkt 1,5 Hex vor der Kante auf der Inselachse, dann gerade auf die Kante (sonst knickt der Hermite-Bogen) */
  const RUN = 3;   // Anlauf in Hex vor der Inselkante
  const into = (e, id) => { const a = P([e.E[0] - e.t[0] * W * RUN, e.E[1], e.E[2] - e.t[1] * W * RUN]);
    return [{ id, type: 'CONNECT', to: { p: a, headingDeg: e.psi, grade: 0 }, stretch: 1.6, markings: 'TRACK' }, { id: id + '_run', type: 'STRAIGHT', length: Math.hypot(e.E[0] - a[0], e.E[2] - a[2]), params: thin, markings: 'STREET' }]; };
  const way = (id, p, psi, extra = {}) => ({ id, type: 'CONNECT', to: { p: P(p), headingDeg: r4(psi), grade: 0 }, stretch: 1, markings: 'TRACK', ...extra });
  const mid = (a, b, f, dy = 0, out = 0) => { const x = a[0] + (b[0] - a[0]) * f, z = a[2] + (b[2] - a[2]) * f, l = Math.hypot(x, z) || 1;
    return [x + x / l * out, a[1] + (b[1] - a[1]) * f + dy, z + z / l * out]; };
  const headTo = (a, b) => Math.atan2(-(b[0] - a[0]), b[2] - a[2]) / DEG;
  const [K, A, B, C] = ends, pcs = [];
  /* K → A: Kurve raus, Skydrive (Spirale 360° + Grat + Sprung), Kurve rein */
  pcs.push(isle(K));
  { const w = mid(K.X, A.A, 0.25, 30, W * 1.2); pcs.push(way('ka_out', w, headTo(w, A.A), { params: thick }));
    pcs.push({ id: 'ka_sky', type: 'SPIRAL', turn: 360, radius: 60, rise: 45, riseEase: 'ramp', riseBlend: 0.3, bankDeg: 0, tags: ['skydrive'] });
    pcs.push({ id: 'ka_ridge', type: 'STRAIGHT', length: 60, markings: 'MAG', tags: ['skydrive'] });
    pcs.push({ id: 'ka_kick', type: 'KICKER', length: 30, lipHeight: 2, lipDeg: 10, tags: ['skydrive'] }, { id: 'ka_air', type: 'AIR', gap: 50, drop: 10, tags: ['skydrive'] },
      { id: 'ka_land', type: 'LANDING', length: 60, drop: 20, tags: ['skydrive'] });
    pcs.push(...into(A, 'ka_in')); }
  /* A → B: Looping im Rinnstein (fahrschule-Stücke) */
  pcs.push(isle(A));
  { const w = mid(A.X, B.A, 0.4, 0, W * 2); pcs.push(way('ab_out', w, headTo(w, B.A), { params: thick }));
    pcs.push({ id: 'ab_loop_in', type: 'STRAIGHT', length: 16, markings: 'MAG', drive: { mode: 'locked' }, params: { sideL: { to: 0.45 }, sideR: { to: 0.45 }, deckDepth: { to: 1 } } },
      { id: 'ab_loop', type: 'LOOP', height: 60, side: 1, drive: { mode: 'locked' } },
      { id: 'ab_loop_out', type: 'STRAIGHT', length: 20, markings: 'TRACK', params: { sideL: { to: 1 }, sideR: { to: 1 }, deckDepth: { to: 2.25 } } });
    pcs.push(...into(B, 'ab_in')); }
  /* B → C: Hero-Sprung bergauf zur höchsten Deck-Insel */
  pcs.push(isle(B));
  { const w = mid(B.X, C.A, 0.35, -10, W * 2); pcs.push(way('bc_out', w, headTo(w, C.A), { params: thick }));
    pcs.push({ id: 'bc_wide', type: 'WIDTH_STEP', widthTo: 'HERO', markings: 'TRACK' }, { id: 'bc_kick', type: 'KICKER', length: 40, lipHeight: 6, lipDeg: 20 },
      { id: 'bc_air', type: 'AIR', gap: 42, drop: 0 }, { id: 'bc_land', type: 'LANDING', length: 40, drop: 6 }, { id: 'bc_narrow', type: 'WIDTH_STEP', widthTo: 'STANDARD' });
    pcs.push(...into(C, 'bc_in')); }
  /* C: Tunnel über die Insel, dann C → K: weite Kurve zurück zur Burg */
  pcs.push(isle(C, C.I.feature === 'tunnel' ? { tunnel: { preset: 'gotthard' } } : {}));
  { const w = mid(C.X, K.A, 0.45, 20, W * 1.5); pcs.push(way('ck_out', w, headTo(w, K.A), { params: thick, ...(C.I.feature === 'tunnel' ? { tunnel: null } : {}) }));
    const [h1] = into(K, 'ck_home'); pcs.push(h1, { id: 'ck_home_run', type: 'CONNECT', to: { p: K.E, headingDeg: K.psi, grade: 0 }, stretch: 1, params: thin, markings: 'STREET' }); }   // wie BLOCKS.home: CONNECT endet exakt auf dem Start
  return { schema: 'kfb.route-recipe/0.1-draft', id: 'HX1_COSMOS_RING', closed: true,
    start: { p: P(K.E), headingDeg: K.psi }, defaults: { widthClass: 'STANDARD', markings: 'STREET', profile: { deckDepth: roadLift } }, pieces: pcs, ends: ends.map(e => ({ id: e.I.id, E: P(e.E), X: P(e.X), psi: e.psi, L: r4(e.L) })) };
}
