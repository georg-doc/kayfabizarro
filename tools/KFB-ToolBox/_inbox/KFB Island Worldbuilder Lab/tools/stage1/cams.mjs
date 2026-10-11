// Fixed critic cameras for one island (QA_CRITIC_PROTOCOL_R1 §3 set "Insel" I1–I5 + §1b set "Nah"), computed in the page
// from the island's own geometry so they stay valid when the outline changes. Returns { name: {pos, look, fov} }.
export const camsInPage = (id) => {
  const k = window.__kfb, isl = k.app.islands.get(id), f = isl.field, P = isl.spec.pos, g = isl.r2d, T = g.terrain, H = 3.64;
  const R = f.radius, c0 = f.plan.c0, S = g.scholle;
  const W = (x, y, z) => [x + P[0], y + P[1], z + P[2]];
  const gy = (x, z) => f.height(x, z);
  const orbit = (t, yaw, pitchDeg, dist, fov = 38) => { const e = pitchDeg * Math.PI / 180; return { pos: [t[0] + Math.sin(yaw) * Math.cos(e) * dist, t[1] + Math.sin(e) * dist, t[2] + Math.cos(yaw) * Math.cos(e) * dist], look: t, fov }; };
  const C = W(c0[0], 0, c0[1]);
  const out = {};
  out.I1 = orbit([C[0], C[1] - 0.12 * R, C[2]], 0.65, 27, 3.3 * R);
  // I2: eye height 1 H on the arrival path (the one that starts at a road anchor = bridge head), a few steps in, towards
  // the landmark; without anchors the main path
  const path = f.paths[0], L = f.landmark, lh = isl.spec.buildings[0] ? 0.35 * 41 : 5;
  const roadA = (isl.spec.anchors ?? []).filter((a) => (a.kind === 'road' || a.kind === 'bridge') && a.p && a.y === undefined);
  const near = (q) => roadA.some((a) => Math.hypot(q[0] - a.p[0], q[1] - a.p[1]) < 2);
  let arrival = f.paths.find((pp) => near(pp[0]) || near(pp[pp.length - 1])) ?? path;
  if (near(arrival[arrival.length - 1])) arrival = [...arrival].reverse();
  const p0 = arrival[Math.min(arrival.length - 1, 4)];
  out.I2 = { pos: W(p0[0], gy(p0[0], p0[1]) + H, p0[1]), look: W(L[0], gy(L[0], L[1]) + lh, L[1]), fov: 50 };
  out.I3 = orbit([C[0], C[1] - 0.3 * R, C[2]], 2.2, 5, 3.4 * R);
  out.I4 = orbit([C[0], C[1] - 0.45 * R, C[2]], 0.9, -24, 3.0 * R);
  // I5 / N4: path edge (paving speckle into grass) at walk height 0.9 H, looking along the path
  const q = (i) => path[Math.min(path.length - 1, i)];
  const a = q(9), b = q(15), tx = b[0] - a[0], tz = b[1] - a[1], tl = Math.hypot(tx, tz) || 1, nx = -tz / tl, nz = tx / tl, w = (f.pathW[0] / 2) + 2.2;
  out.I5 = { pos: W(a[0] + nx * w, gy(a[0] + nx * w, a[1] + nz * w) + 0.9 * H, a[1] + nz * w), look: W(b[0] + nx * 0.6, gy(b[0], b[1]), b[1] + nz * 0.6), fov: 50 };
  // rim at angle th (towards I1's camera side): edge point, outward normal
  const th = Math.atan2(Math.cos(0.65), Math.sin(0.65)), er = f.plan.rAt(th), ex = c0[0] + Math.cos(th) * er, ez = c0[1] + Math.sin(th) * er, ox = Math.cos(th), oz = Math.sin(th);
  const ey = gy(ex - ox * 0.5, ez - oz * 0.5), tgx = -oz, tgz = ox;
  out.N1_kante_lauf = { pos: W(ex - ox * 6 - tgx * 10, ey + 0.9 * H, ez - oz * 6 - tgz * 10), look: W(ex + tgx * 8, ey - 1, ez + tgz * 8), fov: 50 };
  out.N2_kante_unten = { pos: W(ex + ox * 12, ey - 9, ez + oz * 12), look: W(ex, ey - 1.6, ez), fov: 45 };
  const ap = S.apex;
  out.N3_scholle_unten = { pos: [C[0] + ox * 0.95 * R, P[1] + ap[1] + 0.3 * S.D, C[2] + oz * 0.95 * R], look: [P[0] + ap[0], P[1] + ap[1] + 0.25 * S.D, P[2] + ap[2]], fov: 50 };
  const c = q(19), d = q(23), ux = d[0] - c[0], uz = d[1] - c[1], ul = Math.hypot(ux, uz) || 1;
  out.N4_wegrand_lauf = { pos: W(c[0] - (uz / ul) * 4, gy(c[0], c[1]) + 0.9 * H, c[1] + (ux / ul) * 4), look: W(c[0] + (uz / ul) * 1.2, gy(c[0], c[1]), c[1] - (ux / ul) * 1.2), fov: 50 };
  const b0 = isl.spec.buildings[0];
  if (b0) { const fx = Math.sin(b0.rot), fz = Math.cos(b0.rot), dd = b0.pad + 6; out.N5_platzhalter_fuss = { pos: W(b0.x + fx * dd + fz * 8, gy(b0.x + fx * dd, b0.z + fz * dd) + 0.9 * H, b0.z + fz * dd - fx * 8), look: W(b0.x + fx * 19, gy(b0.x, b0.z) + 1, b0.z + fz * 19), fov: 50 }; }
  // N6: the break (cliff) from outside, a little below the rim, so wall, rock face and body read together
  const cl = isl.spec.form?.cliffs?.[0];
  if (cl) { const ct = cl.dir * Math.PI / 180, er2 = f.plan.rAt(ct), bx = c0[0] + Math.cos(ct) * er2, bz = c0[1] + Math.sin(ct) * er2, by = gy(bx - Math.cos(ct) * 2, bz - Math.sin(ct) * 2);
    out.N6_bruch = { pos: W(bx + Math.cos(ct + 0.5) * 0.9 * R, by - 0.12 * R, bz + Math.sin(ct + 0.5) * 0.9 * R), look: W(bx, by - 0.15 * R, bz), fov: 45 }; }
  // Silhouette set (QA §3): S1 side view from flight distance, S2 from race-track height (just above the rim, 2.2 R away)
  out.S1_flug = orbit([C[0], C[1] - 0.25 * R, C[2]], 2.2, 3, 4.6 * R, 30);
  { const yaw = 2.2, d = 2.4 * R; out.S2_racetrack = { pos: [C[0] + Math.sin(yaw) * d, C[1] + 2.5, C[2] + Math.cos(yaw) * d], look: [C[0], C[1] - 0.2 * R, C[2]], fov: 50 }; }
  return out;
};
/** S3: both islands side by side at one scale (camera far away on the perpendicular of the Town–Protopia line) */
export const camS3InPage = () => {
  const k = window.__kfb, a = k.app.islands.get('kfb_town').spec.pos, b = k.app.islands.get('protopia').spec.pos;
  const mx = (a[0] + b[0]) / 2 + 10, mz = (a[2] + b[2]) / 2, dx = b[0] - a[0], dz = b[2] - a[2], l = Math.hypot(dx, dz), nx = -dz / l, nz = dx / l, d = 590;   // lab orbit control clamps at 600
  return { pos: [mx + nx * d, (a[1] + b[1]) / 2 - 20, mz + nz * d], look: [mx, (a[1] + b[1]) / 2 - 42, mz], fov: 36 };
};
