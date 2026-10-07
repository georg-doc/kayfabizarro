// /?showcase=assets&view=gallery — every used asset family on clean ground, plus the material-policy report
// (unique canonical materials per pack after loading ALL hex + forest assets).
import * as THREE from 'three';
import { clone as skClone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { CameraView, CoreContext } from '../../core/types';
import { hexToWorld, worldToHex } from '../../core/hex';
import { makeBatch, trs, groundLabel } from './showcase-util';
import { tickScale } from './showcase-scale';

type Lib = { ids(): string[]; url(id: string): string | null; scaleOf(id: string): number; materialStats(): { materials: Record<string, number>; textures: string[] }; allMaterials(): THREE.Material[] };

const name = (id: string) => id.split('/').pop()!.replace('_Color1', '').replace('building_', '').replace('hex_', '');

// section origins (world metres)
const SEC = {
  tiles: { x: 0, z: 0 },
  buildings: { x: 0, z: 200 },
  nature: { x: 0, z: 330 },
  props: { x: 0, z: 470 },
  forest: { x: 60, z: 470 },
  chars: { x: 150, z: 470 },
};

export async function showcaseGallery(ctx: CoreContext): Promise<void> {
  const lib = ctx.assets as unknown as Lib;
  const all = lib.ids();
  const statics = all.filter((id) => id.startsWith('hex/') || id.startsWith('forest/'));
  const t0 = performance.now();
  await ctx.assets.preload(statics);
  const loadMs = performance.now() - t0;
  const batch = makeBatch(ctx);
  const labels = new THREE.Group();
  const root = new THREE.Group();
  const at = (id: string, x: number, z: number, y = 0, rot = 0) => batch.add(id, trs(x, y, z, rot));
  const lab = (t: string, x: number, z: number, w = 9) => labels.add(groundLabel(t, x, 0.35, z, w));
  const title = (t: string, x: number, z: number, w = 90) => labels.add(groundLabel(t, x, 0.35, z, w, '#fff', 'rgba(10,40,80,0.9)'));

  /** Lay `ids` on the hex lattice, `perRow` per row, stride `s` cells, one hex row gap between rows. */
  const lattice = (ids: string[], o: { x: number; z: number }, perRow: number, s: number, ground: boolean) => {
    const c0 = worldToHex(o.x, o.z);
    ids.forEach((id, i) => {
      const col = i % perRow, row = Math.floor(i / perRow);
      const r = c0.r + 2 * row, q = c0.q + s * col - row;
      const p = hexToWorld(q, r);
      if (ground) at('hex/tiles/base/hex_grass', p.x, p.z);
      at(id, p.x, p.z);
      lab(name(id), p.x, p.z + 9.2, 11);
    });
  };
  /** Clean floor of hex_grass covering a rectangle. */
  const floor = (x0: number, z0: number, x1: number, z1: number) => {
    const a = worldToHex(x0, z0), b = worldToHex(x1, z1);
    for (let r = a.r - 2; r <= b.r + 2; r++)
      for (let q = a.q - 12; q <= b.q + 12; q++) {
        const p = hexToWorld(q, r);
        if (p.x < x0 - 8 || p.x > x1 + 8 || p.z < z0 - 8 || p.z > z1 + 8) continue;
        at('hex/tiles/base/hex_grass', p.x, p.z);
      }
  };
  const grid = (ids: string[], o: { x: number; z: number }, perRow: number, dx: number, dz: number) => {
    ids.forEach((id, i) => {
      const x = o.x + (i % perRow) * dx, z = o.z + Math.floor(i / perRow) * dz;
      at(id, x, z);
      lab(name(id), x, z + dz * 0.42, Math.min(dx * 0.95, 6));
    });
  };

  const by = (prefix: string) => statics.filter((id) => id.startsWith(prefix)).sort();
  // 1. tiles
  // waterless variants are cut-outs for a custom water surface (they show holes on their own) → not shown here
  const tiles = [...by('hex/tiles/base/'), ...by('hex/tiles/roads/'), ...by('hex/tiles/rivers/hex'), ...by('hex/tiles/coast/hex')];
  lattice(tiles, SEC.tiles, 12, 2, false);
  title(`HEX TILES (${tiles.length}) at rotation 0`, SEC.tiles.x + 160, SEC.tiles.z - 18, 140);
  // 2. buildings: all blue, the common ones in every colour, all neutral
  const blue = by('hex/buildings/blue/');
  const common = ['home_A', 'home_B', 'tavern', 'well', 'church', 'market'];
  const other = ['green', 'red', 'yellow'].flatMap((c) => common.map((n) => `hex/buildings/${c}/building_${n}_${c}`)).filter((id) => statics.includes(id));
  const neutral = by('hex/buildings/neutral/');
  lattice([...blue, ...other, ...neutral], SEC.buildings, 18, 1, true);
  title(`BUILDINGS (${blue.length} blue, ${other.length} other colours, ${neutral.length} neutral)`, SEC.buildings.x + 130, SEC.buildings.z - 18, 140);
  // 3. hex decoration nature
  const nature = by('hex/decoration/nature/');
  lattice(nature, SEC.nature, 14, 1, true);
  title(`HEX DECORATION / NATURE (${nature.length})`, SEC.nature.x + 100, SEC.nature.z - 18, 110);
  // 4. hex props (grid on floor)
  // tent dropped: at any scale it reads as a table / canopy, not a tent (see NOTES)
  const props = by('hex/decoration/props/').filter((id) => !id.endsWith('/tent'));
  floor(SEC.props.x - 4, SEC.props.z - 4, SEC.props.x + 6 * 4 + 4, SEC.props.z + 4 * 4 + 4);
  grid(props, SEC.props, 7, 4, 4);
  title(`HEX PROPS (${props.length}, tent excluded) at HEX_PROP_SCALE 4.5 (flags at HEX_SCALE)`, SEC.props.x + 12, SEC.props.z - 5, 34);
  // 5. forest pack
  const forest = by('forest/');
  floor(SEC.forest.x - 4, SEC.forest.z - 4, SEC.forest.x + 9 * 9 + 4, SEC.forest.z + 9 * 9 + 4);
  grid(forest, SEC.forest, 10, 9, 9);
  title(`FOREST NATURE PACK (${forest.length}) at FOREST_SCALE`, SEC.forest.x + 40, SEC.forest.z - 10, 70);
  // 6. characters (Idle_A)
  floor(SEC.chars.x - 4, SEC.chars.z - 4, SEC.chars.x + 16, SEC.chars.z + 6);
  const chars = all.filter((id) => id.startsWith('char/'));
  const au = lib.url('anim/Rig_Medium_General');
  const ag = au ? await ctx.assets.loadGltf(au) : null;
  const idle = ag?.animations.find((c) => c.name === 'Idle_A');
  for (const [i, id] of chars.entries()) {
    const u = lib.url(id);
    const g = u ? await ctx.assets.loadGltf(u) : null;
    if (!g) continue;
    const k = skClone(g.scene);
    k.scale.setScalar(lib.scaleOf(id));
    k.position.set(SEC.chars.x + i * 2.8, 0, SEC.chars.z);
    k.traverse((o) => ((o as THREE.Mesh).castShadow = true));
    if (idle) {
      const mixer = new THREE.AnimationMixer(k);
      mixer.clipAction(idle).play();
      mixer.update(0.3 + i * 0.4);
    }
    root.add(k);
    lab(name(id), k.position.x, SEC.chars.z + 1.6, 2.4);
  }
  title(`CHARACTERS (${chars.length}) at CHAR_SCALE`, SEC.chars.x + 7, SEC.chars.z + 3.4, 12);

  // material policy report
  const st = lib.materialStats();
  const mats = lib.allMaterials() as THREE.MeshStandardMaterial[];
  const desc = mats.map((m) => `${m.name}: metal ${m.metalness} rough ${m.roughness} ${m.map?.colorSpace} aniso ${m.map?.anisotropy}`);
  const report = `materials ${JSON.stringify(st.materials)} · atlases ${st.textures.join(', ')} · ${statics.length} assets in ${loadMs.toFixed(0)} ms`;
  console.info('[assets] ' + report + ' | ' + desc.join(' | '));
  (window as any).__kfbMaterials = { ...st, desc, loadMs, assets: statics.length };
  title(report, SEC.tiles.x + 160, SEC.tiles.z - 34, 260);

  const g = batch.finish();
  ctx.scene.add(g, labels, root);
  void tickScale;
}

const orbit = (tx: number, tz: number, yaw: number, pitch: number, dist: number, ty = 0, fov = 45): CameraView => {
  const y = (yaw * Math.PI) / 180, p = (pitch * Math.PI) / 180;
  return { position: [tx + dist * Math.cos(p) * Math.sin(y), ty + dist * Math.sin(p), tz + dist * Math.cos(p) * Math.cos(y)], target: [tx, ty, tz], fov };
};
export const galleryPresets: Record<string, (ctx: CoreContext) => CameraView> = {
  gallery_tiles: () => orbit(SEC.tiles.x + 165, SEC.tiles.z + 65, 0, 70, 190),
  gallery_buildings: () => orbit(SEC.buildings.x + 125, SEC.buildings.z + 40, 0, 35, 150, 4),
  gallery_buildings_close: () => orbit(SEC.buildings.x + 45, SEC.buildings.z + 5, 0, 22, 60, 4),
  gallery_nature: () => orbit(SEC.nature.x + 95, SEC.nature.z + 35, 0, 35, 130, 3),
  gallery_props: () => orbit(SEC.props.x + 12, SEC.props.z + 7, 0, 32, 30, 0.5),
  gallery_forest: () => orbit(SEC.forest.x + 40, SEC.forest.z + 36, 0, 45, 115, 2),
  gallery_chars: () => orbit(SEC.chars.x + 7, SEC.chars.z, 0, 10, 15, 1),
  gallery_overview: () => orbit(130, 280, 0, 55, 520),
};
