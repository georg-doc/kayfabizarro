// Card-Hex Ascent · support/collision owner (the only writer of support truth).
// Pure data + geometry; no three.js dependency so node tests can import it.
// Units: world units, +Y up. Hex footprints are pointy along ±Z (KayKit: 2.00 flat-to-flat × 2.31 point-to-point).

export const HEX_INRADIUS = 1.0;            // flat-to-flat 2.00 / 2
export const HEX_CIRCUMRADIUS = 2 / Math.sqrt(3); // 1.1547 → point-to-point 2.31
export const STEP_UP = 0.36;                 // max ledge the player walks up without jumping
export const PLAYER_RADIUS = 0.34;

let nextId = 1;

export class SupportGraph {
  constructor() { this.items = []; this.byId = new Map(); }
  clear() { this.items.length = 0; this.byId.clear(); }
  // kind 'hex': {x,z,top,scale}; kind 'rect': {x,z,top,hw,hd,yaw}
  add(s) {
    const item = { id: s.id ?? `s${nextId++}`, zone: s.zone ?? '', route: s.route ?? -1, family: s.family ?? '', card: s.card ?? null, solid: s.solid ?? true, ...s };
    if (item.kind === 'hex') { item.scale = item.scale ?? 1; item.rIn = HEX_INRADIUS * item.scale; item.rOut = HEX_CIRCUMRADIUS * item.scale; item.bottom = item.bottom ?? item.top - 1; }
    if (item.kind === 'rect') { item.yaw = item.yaw ?? 0; item.bottom = item.bottom ?? item.top - 0.6; }
    this.items.push(item); this.byId.set(item.id, item); return item;
  }
  get(id) { return this.byId.get(id); }

  // Local coordinates of (x,z) in support space.
  local(s, x, z) {
    const dx = x - s.x, dz = z - s.z;
    if (s.kind === 'rect' && s.yaw) { const c = Math.cos(-s.yaw), n = Math.sin(-s.yaw); return [dx * c - dz * n, dx * n + dz * c]; }
    return [dx, dz];
  }
  // Signed distance to footprint edge (negative inside). Hex uses the exact pointy-Z hexagon.
  edgeDistance(s, x, z) {
    const [lx, lz] = this.local(s, x, z);
    if (s.kind === 'rect') {
      const qx = Math.abs(lx) - s.hw, qz = Math.abs(lz) - s.hd;
      const ox = Math.max(qx, 0), oz = Math.max(qz, 0);
      return Math.hypot(ox, oz) + Math.min(Math.max(qx, qz), 0);
    }
    const ax = Math.abs(lx), az = Math.abs(lz);
    // three edge normals of a pointy-Z hexagon: (1,0), (1/2, √3/2)
    const d1 = ax - s.rIn;
    const d2 = ax * 0.5 + az * (Math.sqrt(3) / 2) - s.rIn;
    return Math.max(d1, d2);
  }
  contains(s, x, z, inset = 0) { return this.edgeDistance(s, x, z) <= -inset; }

  // Highest support whose top is at/below feetY+stepUp and whose footprint contains (x,z).
  groundAt(x, z, feetY, stepUp = STEP_UP, inset = 0) {
    let best = null;
    for (const s of this.items) {
      if (!s.solid || s.top > feetY + stepUp) continue;
      if (!this.contains(s, x, z, inset)) continue;
      if (!best || s.top > best.top) best = s;
    }
    return best;
  }
  // Continuous landing test between two feet heights (falling).
  landingBetween(x, z, yPrev, yNext) {
    let best = null;
    for (const s of this.items) {
      if (!s.solid) continue;
      if (s.top > yPrev + 1e-4 || s.top < yNext - 1e-4) continue;
      if (!this.contains(s, x, z)) continue;
      if (!best || s.top > best.top) best = s;
    }
    return best;
  }
  // Push a body (feetY..feetY+height) out of support side walls it is below the top of.
  resolveSides(pos, feetY, height = 2.2, radius = PLAYER_RADIUS) {
    let pushed = false;
    for (const s of this.items) {
      if (!s.solid) continue;
      if (feetY >= s.top - STEP_UP || feetY + height <= s.bottom) continue;
      const d = this.edgeDistance(s, pos.x, pos.z);
      if (d >= radius) continue;
      // numeric gradient of the edge distance gives the outward normal
      const e = 1e-3;
      let nx = this.edgeDistance(s, pos.x + e, pos.z) - this.edgeDistance(s, pos.x - e, pos.z);
      let nz = this.edgeDistance(s, pos.x, pos.z + e) - this.edgeDistance(s, pos.x, pos.z - e);
      const nl = Math.hypot(nx, nz) || 1; nx /= nl; nz /= nl;
      const push = radius - d;
      pos.x += nx * push; pos.z += nz * push; pushed = true;
    }
    return pushed;
  }
  // A point on support s near (fromX, fromZ), pulled inside by inset (landing target for assist).
  landingPoint(s, fromX, fromZ, inset = 0.55) {
    if (s.kind === 'rect') {
      const [lx, lz] = this.local(s, fromX, fromZ);
      const cx = Math.max(-s.hw + inset, Math.min(s.hw - inset, lx));
      const cz = Math.max(-s.hd + inset, Math.min(s.hd - inset, lz));
      const c = Math.cos(s.yaw), n = Math.sin(s.yaw);
      return { x: s.x + cx * c - cz * n, z: s.z + cx * n + cz * c, y: s.top };
    }
    const dx = fromX - s.x, dz = fromZ - s.z, d = Math.hypot(dx, dz) || 1;
    const k = Math.max(0, Math.min(d, s.rIn - inset));
    return { x: s.x + dx / d * k, z: s.z + dz / d * k, y: s.top };
  }
  lowestTop(zone) { let m = Infinity; for (const s of this.items) if (!zone || s.zone === zone) m = Math.min(m, s.top); return m; }
}
