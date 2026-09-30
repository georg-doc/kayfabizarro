/* KFB J14 · walkability.j14.js · DERIVED — lokale Ableitung aus den vorhandenen Stream-Stücktypen, KEIN Core-Patch.
 * Regel (WSA J14 #3): straight · ramp · plaza = begehbar; loop · skydrive · air = nur Auto. Brücke und Tunnel werden getrennt
 * über die vorhandenen Indizes aufgelöst (td.tunnels i0..i1, Deck-Überlagerung aus den Samples), nicht über ein Höhenfeld.
 * Bodenabfrage ist s-lokal (Projektion ab dem letzten s des Läufers, max. ±15 m): zwei Ebenen übereinander werden nie verwechselt.
 * Reine Funktion ohne THREE/DOM — läuft im Browser und headless (Probe). */
export const SCHEMA = 'kfb.j14.walkability/0.1-derived';
export const RULE = {
  byType: { STRAIGHT: 'straight', CURVE_EASE: 'straight', CONNECT: 'straight', TRANSITION: 'straight', WIDTH_STEP: 'straight', SPLIT_HALF: 'straight', MERGE_HALF: 'straight',
    KICKER: 'ramp', LANDING: 'ramp', HAIRPIN_180: 'plaza', LOOP: 'loop', AIR: 'air', SPIRAL: 'skydrive' },
  walkable: { straight: true, ramp: true, plaza: true, loop: false, skydrive: false, air: false, steep: false },
  notes: ['SPIRAL mit Tag parkdeck (Uni-Center-Helix) = ramp (Parkhausrampe); jede andere SPIRAL = skydrive',
    'Tag skydrive auf jedem Stück = skydrive (nur Auto)', 'Tag practice_pad = plaza', 'drive.mode locked (Looping-Zu-/Ablauf, Magnet-Catch) = loop (nur Auto)',
    'Sample surface < 0,5 = air · Fahrbahn-Oben U.y < cos 35° = steep (nur Auto)', 'Tunnel = eigene Ebene tunnel:<id> · Deck über anderer Route (Δy > 3 m) = bridge, darunter = under'],
  band: 'Fahrbahn + Bankett (Slots 5…8), außerhalb gesperrt' };

export function deriveWalkability(td) {
  const S = td.samples, J = td._joints || td.joints, N = S.length, R = td.recipe?.pieces || [], byId = new Map(R.map(p => [p.id, p]));
  const cls = new Array(N), piece = new Array(N), layer = new Array(N).fill('');
  J.forEach((j, n) => { const i1 = n + 1 < J.length ? J[n + 1].index : N, rp = byId.get(j.piece) || {}, tags = rp.tags || [];
    let c = RULE.byType[j.type] || 'straight';
    if (j.type === 'SPIRAL' && (tags.includes('parkdeck') || S[j.index].tags?.includes('parkdeck'))) c = 'ramp';
    if (tags.includes('skydrive')) c = 'skydrive'; if (tags.includes('practice_pad')) c = 'plaza'; if (rp.drive?.mode === 'locked') c = 'loop';
    for (let i = j.index; i < i1; i++) { cls[i] = c; piece[i] = j.piece; } });
  for (let i = 0; i < N; i++) { const q = S[i]; if ((q.prm.surface ?? 1) < 0.5) cls[i] = 'air'; else if (RULE.walkable[cls[i]] && q.U[1] < Math.cos(35 * Math.PI / 180)) cls[i] = 'steep'; }
  for (const t of td.tunnels || []) for (let i = t.i0; i <= Math.min(N - 1, t.i1); i++) layer[i] = 'tunnel:' + t.id;
  // Deck-Überlagerung: Raster 12 m, Paare mit |Δs| > 40 m, horizontaler Abstand < Summe der Halbbreiten, Δy > 3 m
  const G = new Map(), C = 12, key = (x, z) => Math.floor(x / C) + ',' + Math.floor(z / C);
  for (let i = 0; i < N; i += 2) { const k = key(S[i].p[0], S[i].p[2]); if (!G.has(k)) G.set(k, []); G.get(k).push(i); }
  let pairs = 0;
  for (let i = 0; i < N; i += 2) { const q = S[i], cx = Math.floor(q.p[0] / C), cz = Math.floor(q.p[2] / C), hw = q.prm.width / 2;
    for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { const L = G.get((cx + a) + ',' + (cz + b)); if (!L) continue;
      for (const j of L) { const o = S[j]; if (Math.abs(o.s - q.s) < 40) continue; const d = Math.hypot(o.p[0] - q.p[0], o.p[2] - q.p[2]); if (d > hw + o.prm.width / 2) continue;
        const dy = q.p[1] - o.p[1]; if (Math.abs(dy) < 3) continue; pairs++;
        const tag = dy > 0 ? 'bridge' : 'under'; if (!layer[i]) layer[i] = tag; else if (!layer[i].includes(tag) && !layer[i].startsWith('tunnel')) layer[i] += '+' + tag;
        if (i + 1 < N && !layer[i + 1]) layer[i + 1] = layer[i]; } } }
  const walk = cls.map(c => !!RULE.walkable[c]), id = cls.map((c, i) => c + ':' + piece[i] + (layer[i] ? '@' + layer[i] : ''));
  // Zusammenfassung je Stück (für die JSON-Spur)
  const pieces = J.map((j, n) => { const i1 = n + 1 < J.length ? J[n + 1].index : N, ids = new Set(), cs = {}; let w = 0;
    for (let i = j.index; i < i1; i++) { ids.add(layer[i] || '-'); cs[cls[i]] = (cs[cls[i]] || 0) + 1; if (walk[i]) w++; }
    return { piece: j.piece, type: j.type, s0: +S[j.index].s.toFixed(1), s1: +(S[i1 - 1] || S[N - 1]).s.toFixed(1), cls: cs, walkableShare: +(w / Math.max(1, i1 - j.index)).toFixed(3), layers: [...ids] }; });
  const tally = {}; cls.forEach(c => tally[c] = (tally[c] || 0) + 1);
  return { schema: SCHEMA, status: 'DERIVED', stream: td.id, fingerprint: td.fingerprint, rule: RULE, cls, walk, layer, piece, id, tally, overlapPairs: pairs, pieces,
    walkableShare: +(walk.filter(Boolean).length / N).toFixed(3) };
}

/* Bodenabfrage für den walk-controller (einziger Ground-Positionsschreiber). Gesperrt = Wand (letzte Höhe + 60 m): der Controller
 * gleitet daran ab statt hineinzulaufen. s-lokal: sHint = letztes s des Läufers, Projektion max. ±15 m. */
export function makeGround(td, W) {
  const S = td.samples, N = S.length, ds = td.ds, L = S[N - 1].s, closed = !!td.closed;
  const idx = s => { if (closed) s = ((s % L) + L) % L; return Math.max(0, Math.min(N - 2, Math.floor(s / ds))); };
  const st = { s: 0, y: 0, last: null };
  const probe = (x, z, sHint) => { let s = sHint;
    for (let k = 0; k < 5; k++) { const q = S[idx(s)], tx = q.T[0], tz = q.T[2], t2 = tx * tx + tz * tz; if (t2 < 0.05) return null; const d = ((x - q.p[0]) * tx + (z - q.p[2]) * tz) / t2; s += Math.max(-6, Math.min(6, d)); }
    if (Math.abs(s - sHint) > 15 && !(closed && Math.abs(Math.abs(s - sHint) - L) < 15)) return null;
    const i = idx(s), q = S[i], rx = q.R[0], rz = q.R[2], r2 = rx * rx + rz * rz || 1, lat = ((x - q.p[0]) * rx + (z - q.p[2]) * rz) / r2, sl = q.slots;
    if (lat < sl[5][0] || lat > sl[8][0]) return { s, i, lat, band: false };
    const prof = lat < sl[6][0] ? sl[5][1] + (sl[6][1] - sl[5][1]) * (lat - sl[5][0]) / (sl[6][0] - sl[5][0]) : lat > sl[7][0] ? sl[7][1] + (sl[8][1] - sl[7][1]) * (lat - sl[7][0]) / (sl[8][0] - sl[7][0]) : 0;
    return { s, i, lat, band: true, y: q.p[1] + q.R[1] * lat + q.U[1] * prof }; };
  const heightAt = (x, z) => { const r = probe(x, z, st.s); if (!r || !r.band || !W.walk[r.i]) return st.y + 60; return r.y; };
  const info = (x, z, sHint = st.s) => { const r = probe(x, z, sHint); if (!r) return { ok: false, why: 'außerhalb', id: null };
    const id = W.id[r.i], ok = r.band && W.walk[r.i]; return { ok, why: ok ? '' : !r.band ? 'neben der Fahrbahn' : W.cls[r.i], id, s: r.s, i: r.i, lat: r.lat, y: r.y }; };
  const follow = (x, z, y) => { const r = probe(x, z, st.s); if (r) st.s = closed ? ((r.s % L) + L) % L : r.s; st.y = y; return r; };
  return { heightAt, info, follow, st, L };
}

/* Parkboxen (Core-Pads, parking_box-Ecken) → Punkt-in-Box für den geführten Parkbeleg */
export function parkBoxes(td) { const out = []; (td.pads || []).forEach(p => p.stations.forEach((x, n) => { if (x.type === 'parking_box') out.push({ pad: p.id, n: out.length + 1, corners: x.corners }); })); return out; }
export function inBox(b, x, z) { const P = b.corners; let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, , zi] = P[i], [xj, , zj] = P[j]; if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) c = !c; } return c; }
