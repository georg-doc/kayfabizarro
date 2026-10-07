import { surfaceFor } from '../../core/surface';
// terrain module: stage-1 world layer (levels, lakes, coast, ramps, biomes, forest potential), hex tiles per chunk,
// animated lake water, terrain colliders, exact ground height, showcase + camera presets.
import * as THREE from 'three';
import type { CameraView, CellData, CoreContext, GameModule, WorldLayerCtx } from '../../core/types';
import { DIRS, edgeVector, hexToWorld } from '../../core/hex';
import { LEVEL_H } from '../../core/units';
import { orbitToView } from '../../core/debug';
import { terrainGen, TerrainGen } from './gen';
import { TerrainBuilder, setWaterDrop, T_BOTTOM, T_GRASS, T_SLOPE_HIGH, T_SLOPE_LOW } from './build';
import { makeWaterMaterial } from './water';
import { NOISE } from './look';
import { TAG, cellTopY, bindSurfaceQueries } from './api';

const genFor = terrainGen;

const continuousMaterial=new THREE.MeshStandardMaterial({color:0x81a466,roughness:.95});
const water = makeWaterMaterial();
let builder: TerrainBuilder | null = null;

const DECO_IDS = [
  ...['A', 'B', 'C'].flatMap((l) => [`mountain_${l}`, `mountain_${l}_grass`, `mountain_${l}_grass_trees`, `hills_${l}`, `hills_${l}_trees`]),
].map((n) => `hex/decoration/nature/${n}`);

function applyLayer(cell: CellData, lctx: WorldLayerCtx): void {
  const t = genFor(lctx.seed).cell(cell.q, cell.r);
  cell.level = t.level;
  cell.water = t.water;
  cell.coastMask = t.coastMask;
  cell.slope = t.slope ? { ...t.slope } : null;
  cell.biome = t.biome;
  cell.forest = t.forest;
  if (t.water) cell.tags.push(TAG.lake);
  if (t.coastMask) cell.tags.push(TAG.coast);
  if (t.slope) cell.tags.push(TAG.ramp);
  else if (!t.water) {
    const g = genFor(lctx.seed);
    for (let d = 0; d < 6; d++) {
      const nd = g.rampDir(cell.q + DIRS[d][0], cell.r + DIRS[d][1]);
      if (nd < 0) continue;
      const rel = ((d + 3) % 6 - nd + 6) % 6;
      if (rel === 1 || rel === 2 || rel === 4 || rel === 5) { cell.tags.push(TAG.embankment); break; }
    }
  }
  if (t.cliffUp > 0) cell.tags.push(TAG.cliff);
  if (t.deco) cell.tags.push(TAG.rock);
  if (t.biome === 'mountain') {
    cell.tags.push(TAG.mountain);
    cell.reserved = true;
  }
}

// ------------------------------------------------------------------ preset search (real, unbounded world)
/** Spiral search around the origin for the nearest cell satisfying pred. */
function search(ctx: CoreContext, pred: (c: Readonly<CellData>) => boolean, maxR = 60, from = { q: 0, r: 0 }): Readonly<CellData> | null {
  for (let rad = 0; rad <= maxR; rad++) {
    let q = from.q - rad, r = from.r + rad;
    const cells: [number, number][] = [];
    if (rad === 0) cells.push([from.q, from.r]);
    else
      for (let d = 0; d < 6; d++)
        for (let i = 0; i < rad; i++) {
          cells.push([q, r]);
          q += DIRS[d][0];
          r += DIRS[d][1];
        }
    for (const [cq, cr] of cells) {
      const c = ctx.world.cell(cq, cr);
      if (pred(c)) return c;
    }
  }
  return null;
}

const yawFrom = (vx: number, vz: number) => (Math.atan2(vx, vz) * 180) / Math.PI;

function nb(ctx: CoreContext, c: Readonly<CellData>, d: number) {
  return ctx.world.cell(c.q + DIRS[d][0], c.r + DIRS[d][1]);
}

function maxDrop(ctx: CoreContext, c: Readonly<CellData>): { drop: number; dir: number } {
  let drop = 0, dir = 0;
  for (let d = 0; d < 6; d++) {
    const n = nb(ctx, c, d);
    if (!n.water && c.level - n.level > drop) { drop = c.level - n.level; dir = d; }
  }
  return { drop, dir };
}

const presets: Record<string, (ctx: CoreContext) => CameraView> = {
  /** A stretch of lake shore (nearest lake to the origin), seen from the land at a 3/4 angle. */
  coast(ctx) {
    const c = search(ctx, (c) => !c.water && c.coastMask !== 0 && c.roadMask === 0 && countBits(c.coastMask) === 2);
    if (!c) return presets.wide(ctx);
    const p = hexToWorld(c.q, c.r);
    let wx = 0, wz = 0;
    for (let d = 0; d < 6; d++) if ((c.coastMask >> d) & 1) { const v = edgeVector(d); wx += v.x; wz += v.z; }
    const l = Math.hypot(wx, wz) || 1;
    wx /= l; wz /= l;
    const a = Math.atan2(-wz, -wx) + 0.6;
    return orbitToView({ target: [p.x + wx * 8, cellTopY(c) - 1.5, p.z + wz * 8], yaw: yawFrom(Math.cos(a), Math.sin(a)), pitch: 28, dist: 48 });
  },
  /** A tall (2+ level) dirt cliff near the origin, seen from its foot. */
  cliff(ctx) {
    const c = search(ctx, (c) => !c.water && !c.slope && !c.coastMask && maxDrop(ctx, c).drop >= 2);
    if (!c) return presets.wide(ctx);
    const { dir } = maxDrop(ctx, c);
    const p = hexToWorld(c.q, c.r);
    const v = edgeVector(dir);
    const a = Math.atan2(v.z, v.x) + 0.4;
    return orbitToView({ target: [p.x + v.x * 8, (c.level - 1) * LEVEL_H, p.z + v.z * 8], yaw: yawFrom(Math.cos(a), Math.sin(a)), pitch: 12, dist: 40 });
  },
  ramp(ctx) {
    const c = search(ctx, (c) => !!c.slope && !c.roadMask);
    if (!c) return presets.wide(ctx);
    const p = hexToWorld(c.q, c.r);
    const v = edgeVector(c.slope!.dir);
    const a = Math.atan2(-v.z, -v.x) + 0.55; // from the low side
    return orbitToView({ target: [p.x, (c.level + 0.5) * LEVEL_H, p.z], yaw: yawFrom(Math.cos(a), Math.sin(a)), pitch: 20, dist: 36 });
  },
  /** Nearest mountain massif with its terraced foothills. */
  mountain(ctx) {
    const c = search(ctx, (c) => c.biome === 'mountain');
    if (!c) return presets.wide(ctx);
    const p = hexToWorld(c.q, c.r);
    return orbitToView({ target: [p.x, cellTopY(c), p.z], yaw: 35, pitch: 26, dist: 110 });
  },
  /** Nearest river valley (corridor centre line). */
  river(ctx) {
    const g = genFor(ctx.world.seed);
    const c = search(ctx, (c) => g.river(c.q, c.r).onCentre, 50);
    if (!c) return presets.wide(ctx);
    const p = hexToWorld(c.q, c.r);
    return orbitToView({ target: [p.x, cellTopY(c), p.z], yaw: 20, pitch: 35, dist: 90 });
  },
  wide(ctx) {
    return orbitToView({ target: [0, cellTopY(ctx.world.cell(0, 0)), 0], yaw: 25, pitch: 42, dist: 230 });
  },
  /** Open same-level meadow seen at eye level (~2 m), looking along its longest open direction. */
  meadow: (ctx) => meadowView(ctx, 'eye'),
  meadow15: (ctx) => meadowView(ctx, 15),
  meadow60: (ctx) => meadowView(ctx, 60),
  meadow200: (ctx) => meadowView(ctx, 200),
  /** Close-up of a one-step terrace rim (KayKit bevel lip) seen from the plateau side. */
  rim(ctx) {
    const lowerFlat = (c: Readonly<CellData>, n: Readonly<CellData>) => !n.water && !n.slope && !n.roadMask && n.level === c.level - 1;
    const c = search(ctx, (c) => {
      if (c.water || c.slope || c.coastMask || c.roadMask || c.riverMask || c.village || c.forest > 0.3) return false;
      let low = 0, same = 0;
      for (let d = 0; d < 6; d++) {
        const n = nb(ctx, c, d);
        if (lowerFlat(c, n)) low++;
        else if (n.level === c.level && !n.water) same++;
      }
      return low >= 1 && low <= 2 && same >= 3;
    });
    if (!c) return presets.wide(ctx);
    let dir = 0;
    for (let d = 0; d < 6; d++) if (!nb(ctx, c, d).water && nb(ctx, c, d).level === c.level - 1) dir = d;
    const p = hexToWorld(c.q, c.r);
    const v = edgeVector(dir);
    const a = Math.atan2(v.z, v.x) + 0.6; // camera over the lower ground, slightly to the side, looking at the rim
    return orbitToView({ target: [p.x + v.x * 6.5, cellTopY(c) - 1.2, p.z + v.z * 6.5], yaw: yawFrom(Math.cos(a), Math.sin(a)), pitch: 22, dist: 18 });
  },
  /** Close-up of a shore (procedural beach) from the land side. */
  coastclose(ctx) {
    const c = search(ctx, (c) => !c.water && c.coastMask !== 0 && c.roadMask === 0 && countBits(c.coastMask) === 2);
    if (!c) return presets.wide(ctx);
    const v = presets.coast(ctx);
    const [tx, ty, tz] = v.target;
    const [px, py, pz] = v.position;
    const k = 18 / Math.hypot(px - tx, py - ty, pz - tz);
    return { ...v, position: [tx + (px - tx) * k, ty + (py - ty) * k, tz + (pz - tz) * k] };
  },
  /** Where a flat road tile meets same-level terrain grass (flat surroundings). */
  roadedge: (ctx) => tileEdgeView(ctx, 'road'),
  /** Where a river tile meets same-level terrain grass. */
  riveredge: (ctx) => tileEdgeView(ctx, 'river'),
};

function tileEdgeView(ctx: CoreContext, kind: 'road' | 'river'): CameraView {
  let dir = 0;
  const flatRing = (c: Readonly<CellData>) => {
    for (let d = 0; d < 6; d++) {
      const n = nb(ctx, c, d);
      if (n.level !== c.level || n.slope || n.water || n.coastMask) return false;
    }
    return true;
  };
  const c = search(ctx, (c) => {
    const m = kind === 'road' ? c.roadMask : c.riverMask;
    if (!m || c.slope || (kind === 'road' && c.riverMask) || c.village || !flatRing(c)) return false;
    for (let d = 0; d < 6; d++) {
      const n = nb(ctx, c, d);
      if (openGrass(n, c.level) && !((m >> d) & 1)) { dir = d; return true; }
    }
    return false;
  });
  if (!c) return presets.wide(ctx);
  const p = hexToWorld(c.q, c.r);
  const v = edgeVector(dir);
  const a = Math.atan2(v.z, v.x) + 0.5; // camera over the grass side
  return orbitToView({ target: [p.x + v.x * 7.5, cellTopY(c), p.z + v.z * 7.5], yaw: yawFrom(Math.cos(a), Math.sin(a)), pitch: 38, dist: 16 });
}

/** Plain grass cell drawn by terrain (no road/river/village/water/coast/ramp, little forest). */
function openGrass(c: Readonly<CellData>, level: number): boolean {
  return !c.water && !c.coastMask && !c.slope && !c.roadMask && !c.riverMask && !c.village && !c.building && c.level === level && c.forest < 0.2;
}

function meadowView(ctx: CoreContext, h: 'eye' | number): CameraView {
  const ring = (c: Readonly<CellData>, rad: number) => {
    for (let dr = -rad; dr <= rad; dr++)
      for (let dq = Math.max(-rad, -dr - rad); dq <= Math.min(rad, -dr + rad); dq++)
        if (!openGrass(ctx.world.cell(c.q + dq, c.r + dr), c.level)) return false;
    return true;
  };
  const c = search(ctx, (c) => openGrass(c, c.level) && ring(c, 3), 40) ?? search(ctx, (c) => openGrass(c, c.level) && ring(c, 2), 40);
  if (!c) return presets.wide(ctx);
  // look along the direction with the longest run of open same-level grass
  let best = 0, bestN = -1;
  for (let d = 0; d < 6; d++) {
    let n = 0;
    for (let k = 1; k <= 8; k++) {
      const m = ctx.world.cell(c.q + DIRS[d][0] * k, c.r + DIRS[d][1] * k);
      if (!openGrass(m, c.level)) break;
      n++;
    }
    if (n > bestN) { bestN = n; best = d; }
  }
  const p = hexToWorld(c.q, c.r);
  const v = edgeVector(best);
  const dx = v.x / Math.hypot(v.x, v.z), dz = v.z / Math.hypot(v.x, v.z);
  const fx = dx, fz = dz;
  const y = cellTopY(c);
  const yaw = yawFrom(-fx, -fz);
  if (h === 'eye') return orbitToView({ target: [p.x + fx * 6, y + 1.7, p.z + fz * 6], yaw, pitch: 3, dist: 8 });
  const pitch = h === 15 ? 35 : h === 60 ? 40 : 45;
  const dist = h / Math.sin((pitch * Math.PI) / 180);
  const ahead = h === 15 ? 15 : h === 60 ? 45 : 90;
  return orbitToView({ target: [p.x + fx * ahead, y, p.z + fz * ahead], yaw, pitch, dist });
}

function countBits(m: number): number {
  let n = 0;
  for (; m; m &= m - 1) n++;
  return n;
}

// ------------------------------------------------------------------ module
const mod: GameModule = {
  id: 'terrain',
  layer: { id: 'terrain', stage: 1, apply: applyLayer },

  async init(ctx) {
    const surface=surfaceFor(ctx.world.seed);
    bindSurfaceQueries(surface);
    const g=genFor(ctx.world.seed);
    surface.contribute({id:'00-river-corridor',owner:'river',sample:(x,z)=>{
      const dist=g.riverDistanceWorld(x,z);const w=Math.max(0,1-dist/40);return w>0?{height:dist<5?-3:0,weight:w*w*(3-2*w)}:null;
    }});
    surface.onChange(()=>{ctx.world.invalidateDerived();ctx.chunks.clear();ctx.events.emit('surface:changed',{revision:surface.revision});});
    ctx.services.set('terrain',{heightAt:(x:number,z:number)=>surface.heightAt(x,z),gen:g,surface,waterMaterial:water.material,stats:()=>({owner:'WB2.SurfaceTruth',revision:surface.revision})});
  },

  buildChunk(chunk, out, ctx) {
    const data=surfaceFor(ctx.world.seed).mesh(chunk.cx,chunk.cz);
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(data.positions,3));geo.setIndex(new THREE.BufferAttribute(data.indices,1));geo.computeVertexNormals();
    const mesh=new THREE.Mesh(geo,continuousMaterial);mesh.receiveShadow=true;mesh.userData.surfaceRevision=data.revision;mesh.userData.semanticId=`surface:${ctx.world.seed}:${chunk.cx},${chunk.cz}`;
    mesh.position.set(data.origin.x,0,data.origin.z);
    out.addObject(mesh);out.addCollider(ctx.rapier.ColliderDesc.trimesh(data.positions,data.indices).setTranslation(data.origin.x,0,data.origin.z));
  },

  update(_dt, ctx) {
    water.uniforms.uTime.value = ctx.time;
  },

  showcaseUses: [],
  /** The real, unbounded streamed world around the origin (no staging); presets jump to interesting spots. */
  showcase(ctx) {
    ctx.chunks.configure({ loadRadius: 300 });
    ctx.chunks.focus.set(0, 0, 0);
    const v = orbitToView({ target: [0, cellTopY(ctx.world.cell(0, 0)), 0], yaw: 30, pitch: 38, dist: 95 });
    ctx.camera.position.set(...v.position);
    ctx.camera.lookAt(new THREE.Vector3(...v.target));
  },

  cameraPresets: presets,
};

export default mod;
