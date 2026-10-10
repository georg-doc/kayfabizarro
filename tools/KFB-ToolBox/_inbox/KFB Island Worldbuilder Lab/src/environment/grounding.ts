// Environment Kit R1 · grounding helpers after docs/biome-sheets/Bauweise_Erdung (Georg PASS 2026-10-08).
// Pure geometry, no scene: foot line of a kit model at its sink height (for field.addEmbed and the saum),
// cause-driven saum layouts (rule 1), clustered nests with negative space (rule 2), fractal 1 : 3 : 9 staffel (rule 4).
import * as THREE from 'three';
import type { P2 } from '../island/shape';
import type { EnvSpecies } from './kits';

/** where the model meets the ground when sunk by `sinkFrac` of its height: radius per sector (object coords) */
export function footRadii(sp: EnvSpecies, sinkFrac: number, sectors = 16): number[] {
  const p = sp.geo.attributes.position, y0 = sinkFrac * sp.height, out = new Array(sectors).fill(0);
  const put = (x: number, z: number) => {
    const k = Math.floor(((Math.atan2(z, x) / (Math.PI * 2)) + 1) * sectors) % sectors;
    out[k] = Math.max(out[k], Math.hypot(x, z));
  };
  for (let t = 0; t + 2 < p.count; t += 3) for (const [i, j] of [[t, t + 1], [t + 1, t + 2], [t + 2, t]]) {
    const ya = p.getY(i), yb = p.getY(j);
    if ((ya - y0) * (yb - y0) > 0 || ya === yb) continue;
    const u = (y0 - ya) / (yb - ya);
    put(p.getX(i) + (p.getX(j) - p.getX(i)) * u, p.getZ(i) + (p.getZ(j) - p.getZ(i)) * u);
  }
  for (let pass = 0; pass < 2; pass++) for (let k = 0; k < sectors; k++) if (!out[k]) out[k] = Math.max(out[(k + sectors - 1) % sectors], out[(k + 1) % sectors]);
  const m = Math.max(...out) || sp.footR;
  return out.map((r) => r || m);
}

/** foot line polygon in object coordinates (for field.addEmbed footprint) */
export function footPolygon(radii: number[]): P2[] {
  const n = radii.length;
  return radii.map((r, k) => { const a = ((k + 0.5) / n) * Math.PI * 2; return [Math.cos(a) * r, Math.sin(a) * r] as P2; });
}

/** radius of the foot line towards world direction `a` for an object turned by rotY (three.js rotation.y) */
export function radiusToward(radii: number[], a: number, rotY: number): number {
  const n = radii.length, local = a + rotY; // world angle → object angle
  return radii[Math.floor((((local / (Math.PI * 2)) % 1) + 1) * n) % n];
}

export interface Bit { x: number; z: number; size: number; rot: number }

/**
 * A nest grown from one source (rule 2): the first bits are the biggest and sit at the source, the rest
 * get smaller and lighter outward, biased along `dir` (spread ± `spread` rad). Fractal staffel: 1 big, ~3 medium, ~9 small.
 */
export function nest(R: () => number, sx: number, sz: number, dir: number, spread: number, reach: number, big: number, count: number): Bit[] {
  const out: Bit[] = [];
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0; // 0 source … 1 outer edge
    const tier = i === 0 ? 1 : i <= 3 ? 0.62 : 0.38; // 1 : 3 : rest
    const a = dir + (R() - 0.5) * 2 * spread * (0.4 + t), d = reach * Math.sqrt(t) * (0.7 + R() * 0.5);
    out.push({ x: sx + Math.cos(a) * d, z: sz + Math.sin(a) * d, size: big * tier * (0.85 + R() * 0.3), rot: R() * Math.PI * 2 });
  }
  return out;
}

/**
 * Debris that broke off and rolled downhill (rule 1, gravity): most pieces lie at the foot, fewer, smaller and wider
 * spread further out (talus cone), with small buddies next to bigger pieces (fractal), never a bead chain.
 */
export function fan(R: () => number, fx: number, fz: number, down: [number, number], reach: number, big: number, count: number): Bit[] {
  const a0 = Math.atan2(down[1], down[0]), out: Bit[] = [];
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0;
    const d = reach * (0.06 + 0.94 * Math.pow(t, 1.8)) * (0.8 + R() * 0.4); // crowded at the foot
    const spread = 0.35 + 0.75 * t, a = a0 + (R() - 0.5) * 2 * spread;  // cone widens downhill
    const size = big * (i === 0 ? 1 : (0.75 - 0.5 * t) * (0.7 + R() * 0.6));
    const x = fx + Math.cos(a) * d, z = fz + Math.sin(a) * d;
    out.push({ x, z, size, rot: R() * Math.PI * 2 });
    if (size > big * 0.45 && R() < 0.6) { // a smaller chip resting against it
      const b = R() * Math.PI * 2, r = size * 0.9;
      out.push({ x: x + Math.cos(b) * r, z: z + Math.sin(b) * r, size: size * (0.3 + R() * 0.2), rot: R() * Math.PI * 2 });
    }
  }
  return out;
}

/** windfall: drops at (x, z), rolls down the terrain gradient until it settles in a hollow (no physics engine) */
export function rollToRest(height: (x: number, z: number) => number, x: number, z: number, maxDist: number, step = 0.25): P2 {
  let px = x, pz = z, travelled = 0, vx = 0, vz = 0;
  for (let i = 0; i < 400 && travelled < maxDist; i++) {
    const g = 0.3, dx = height(px + g, pz) - height(px - g, pz), dz = height(px, pz + g) - height(px, pz - g);
    vx = vx * 0.8 - dx * 1.6; vz = vz * 0.8 - dz * 1.6;
    const v = Math.hypot(vx, vz);
    if (v < 0.02) break;
    const k = Math.min(step, v) / v;
    px += vx * k; pz += vz * k; travelled += Math.min(step, v);
  }
  return [px, pz];
}
