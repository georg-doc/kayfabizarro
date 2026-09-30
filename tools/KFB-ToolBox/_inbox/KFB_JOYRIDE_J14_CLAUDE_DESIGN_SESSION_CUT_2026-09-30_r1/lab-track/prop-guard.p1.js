/* P1 · Prop-Wache für T4 (29.09. abends) · additiv über window.__KFB_T4_PROPS, ohne Schalter baut T4 wie bisher.
 * Georg: „im Track stecken noch Bäume etc.“ · „alle Lampen müssen korrekt zur Straße ausgerichtet werden“.
 * T4 setzt Stadtmöbel, Häuser und Natur nach der TD03-Logik je Streckenseite. Auf einem größeren Parcours kreuzen
 * andere Abschnitte (Überführung, Helix, Loop, Tunnel) diese Plätze. Die Wache prüft jeden Platz gegen ALLE Samples:
 *   road  – der Fuß steht auf/in einer Fahrbahn gleicher Höhe
 *   deck  – ein höheres Deck (Überführung, Loop, Rampe) geht durch den Körper
 *   tunnel – der Platz liegt in einer Tunnelröhre
 * Abgelehnt wird der ganze Gegenstand (kein halber Baum). yaw: Drehung je Asset vor dem Setzen (KayKit-Laterne: Arm auf -X). */
export function makePropGuard(opt = {}) {
  const CELL = 12, grid = new Map(), stats = { ok: 0, road: 0, deck: 0, tunnel: 0, byName: {} };
  let ready = false;
  const key = (x, z) => Math.floor(x / CELL) + ',' + Math.floor(z / CELL);
  function init(td) {
    const S = td.samples, tun = new Uint8Array(S.length);
    for (const t of td.tunnels || []) for (let i = Math.max(0, t.i0 - 20); i <= Math.min(S.length - 1, t.i1 + 20); i++) tun[i] = 1;
    for (let i = 0; i < S.length; i += 2) { const q = S[i]; if ((q.prm.surface ?? 1) < 0.5) continue;
      const sl = q.slots, half = (sl[7][0] - sl[6][0]) / 2, ext = Math.max(Math.abs(sl[0][0]), Math.abs(sl[13][0]), half + 4.3);
      const c = [q.p[0] + q.R[0] * (sl[6][0] + sl[7][0]) / 2, q.p[1], q.p[2] + q.R[2] * (sl[6][0] + sl[7][0]) / 2];
      const k = key(c[0], c[2]); if (!grid.has(k)) grid.set(k, []); grid.get(k).push({ x: c[0], y: c[1], z: c[2], half, ext, tun: tun[i], up: q.U[1] }); }
    ready = true; api.closed = !!td.closed; }
  function ok(nm, x, y, z, footR = 0.5, crownR = 1, h = 4) {
    if (!ready) return true;
    const R = 18 + crownR, n = Math.ceil(R / CELL), cx = Math.floor(x / CELL), cz = Math.floor(z / CELL);
    let why = null;
    for (let a = -n; a <= n && !why; a++) for (let b = -n; b <= n && !why; b++) { const L = grid.get((cx + a) + ',' + (cz + b)); if (!L) continue;
      for (const q of L) { const d = Math.hypot(q.x - x, q.z - z);
        if (q.up > 0.7 && d < q.half + 0.6 + footR && y > q.y - 3.5 && y < q.y + 1.2) { why = 'road'; break; }
        if (d < q.ext + crownR && q.y > y + 3 && q.y - 2.6 < y + h) { why = 'deck'; break; }
        if (q.tun && d < q.ext + 7 + crownR && Math.abs(y - q.y) < 14) { why = 'tunnel'; break; } } }
    if (why) { stats[why]++; stats.byName[nm] = (stats.byName[nm] || 0) + 1; return false; }
    stats.ok++; return true; }
  const api = { init, ok, yaw: opt.yaw || {}, stats, closed: false };
  return api;
}
