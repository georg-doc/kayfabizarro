// Card-Hex Ascent · level presentation: real KayKit Hex tiles + real Card Builder cards on ink slabs.
// Support truth comes from route.mjs → SupportGraph; this file only makes it visible (same numbers).
import * as THREE from 'three';
import { loadGLTF, instanceStatic, raw } from './sources.mjs';
import { CARDS, ISLETS, PERCHES, SCENERY, INCREMENTS, cardDims, CARD_AR } from './route.mjs';
import { createCardBuilder } from '../../cardbuilder/kfb-card-builder.js';

export const HEX_PIN = '2d958f1625ed2f8893949216c1bff7e79b038361'; // kayfabizarro PR #353 head (Snow pin ab65e8c4 is byte-identical)
export const FAMILY = Object.freeze({
  hexagon: { label: 'KayKit Medieval Hexagon', root: 'media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/', top: 'tiles/base/hex_grass.gltf', body: 'tiles/base/hex_grass_bottom.gltf',
    decor: { flag_red: 'decoration/props/flag_red.gltf', rock_single_B: 'decoration/nature/rock_single_B.gltf', tree_single_A: 'decoration/nature/tree_single_A.gltf', barrel: 'decoration/props/barrel.gltf', tent: 'decoration/props/tent.gltf' } },
  builder: { label: 'KayKit Medieval Builder', root: 'media/3D_Assets/KayKit Medieval Builder Pack 1.0/Models/', top: 'tiles/hex/gltf/hex_forest.gltf.glb', body: 'tiles/hex/gltf/hex_rock.gltf.glb',
    tiles: { hex_forest: 'tiles/hex/gltf/hex_forest.gltf.glb', hex_rock: 'tiles/hex/gltf/hex_rock.gltf.glb', hex_sand: 'tiles/hex/gltf/hex_sand.gltf.glb' },
    decor: { detail_treeA: 'objects/gltf/detail_treeA.gltf.glb', detail_treeB: 'objects/gltf/detail_treeB.gltf.glb', detail_treeC: 'objects/gltf/detail_treeC.gltf.glb', detail_rocks_small: 'objects/gltf/detail_rocks_small.gltf.glb' } },
  snow: { label: 'KayKit Medieval Snow Biome', root: 'media/3D_Assets/Kaykit_Medieval Snow Biome/Models/', top: 'tiles/hex/gltf/hex_snow.gltf.glb', body: 'tiles/hex/gltf/hex_snow.gltf.glb',
    decor: { detail_forestA_snow: 'objects/gltf/detail_forestA_snow.gltf.glb', detail_forestB_snow: 'objects/gltf/detail_forestB_snow.gltf.glb', well_snow: 'objects/gltf/well_snow.gltf.glb' } },
});
export const INK = 0x1f1a14;
const CARD_BACK = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/c7e7dd085528af10d2c00a7349f295cb7cfa4233/media/kfb/KayfaBizarro_Card_Backside_01_lowrez.png';

const pieceCache = new Map();
async function piece(family, rel) {
  const key = family + '|' + rel;
  if (!pieceCache.has(key)) pieceCache.set(key, loadGLTF(HEX_PIN, FAMILY[family].root + rel).then(g => {
    const box = new THREE.Box3().setFromObject(g.scene);
    g.scene.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    return { gltf: g, top: box.max.y, bottom: box.min.y, size: box.getSize(new THREE.Vector3()) };
  }));
  return pieceCache.get(key);
}
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

export class Level {
  constructor(scene, graph, inc = 'S3', seed = 7) {
    this.scene = scene; this.graph = graph; this.inc = inc; this.rng = rng(seed);
    this.root = new THREE.Group(); this.root.name = 'card-hex-ascent-level'; scene.add(this.root);
    this.cards = new Map(); this.familyAudit = {}; this.errors = []; this.highlight = null;
  }
  async build(onProgress = () => {}) {
    const I = INCREMENTS[this.inc];
    const jobs = [];
    for (const s of this.graph.items) if (s.kind === 'hex') jobs.push(this.buildTile(s));
    for (const c of CARDS) if (I.cards.includes(c.id)) jobs.push(this.buildCard(c));
    for (const i of [...ISLETS, ...PERCHES]) if ((i.zone && I.zones.includes(i.zone)) || (i.zone && I.cards.includes(i.zone))) for (const d of i.decor ?? []) jobs.push(this.buildDecor(i, d));
    for (const s of SCENERY) if (this.familyActive(s.family)) jobs.push(this.buildScenery(s));
    let done = 0; await Promise.all(jobs.map(j => j.catch(e => this.errors.push(String(e.message || e))).finally(() => onProgress(++done / jobs.length))));
    this.buildHighlight();
    return this;
  }
  familyActive(f) { const I = INCREMENTS[this.inc]; return (f === 'hexagon' && I.zones.includes('A')) || (f === 'builder' && I.zones.includes('B')) || (f === 'snow' && I.zones.includes('C')); }
  auditOf(f) { return this.familyAudit[f] ??= { label: FAMILY[f].label, tiles: 0, bodyTiles: 0, pieces: new Set() }; }
  isletOf(s) { return [...ISLETS, ...PERCHES].find(i => i.id === s.islet); }

  async buildTile(s) {
    const isl = this.isletOf(s); const F = FAMILY[s.family];
    const topRel = (isl?.tile && F.tiles?.[isl.tile]) || F.top;
    const top = await piece(s.family, topRel); const body = await piece(s.family, F.body);
    const g = new THREE.Group(); g.name = 'hex:' + s.id; g.userData = { support: s.id, family: s.family, source: F.root + topRel };
    const t = instanceStatic(top.gltf); t.position.y = s.top - top.top; t.rotation.y = Math.floor(this.rng() * 6) * Math.PI / 3; g.add(t);
    const n = Math.max(0, Math.round(s.top - 1 - s.bottom));
    for (let k = 1; k <= n; k++) { const b = instanceStatic(body.gltf); b.position.y = s.top - k - body.top; b.rotation.y = Math.floor(this.rng() * 6) * Math.PI / 3; g.add(b); }
    g.position.set(s.x, 0, s.z); this.root.add(g);
    const a = this.auditOf(s.family); a.measuredTileHeight = +(top.size.y).toFixed(3); a.measuredFootprint = [+top.size.x.toFixed(3), +top.size.z.toFixed(3)];
    a.tiles++; a.bodyTiles += n; a.pieces.add(topRel); a.pieces.add(F.body);
  }
  async buildDecor(isl, name) {
    const F = FAMILY[isl.family]; const rel = F.decor?.[name]; if (!rel) return;
    const p = await piece(isl.family, rel); const o = instanceStatic(p.gltf);
    // place on the islet's outermost tile, toward its outer edge, so the walk line stays clear
    const tiles = this.graph.items.filter(s => s.islet === isl.id); const t = tiles[tiles.length - 1];
    const ang = this.rng() * Math.PI * 2, r = tiles.length > 1 ? 0.55 : 0.6;
    o.position.set(t.x + Math.cos(ang) * r, t.top - p.bottom - 0.02, t.z + Math.sin(ang) * r); o.rotation.y = this.rng() * Math.PI * 2;
    this.root.add(o); this.auditOf(isl.family).pieces.add(rel);
  }
  async buildScenery(s) {
    const p = await piece(s.family, s.piece); const o = instanceStatic(p.gltf);
    o.scale.setScalar(s.s); o.position.set(s.x, s.y, s.z); o.rotation.y = this.rng() * Math.PI * 2; this.root.add(o);
    this.auditOf(s.family).pieces.add(s.piece);
  }
  // Real Card: Combat Card Builder sheet on an ink-black slab. Support = route.mjs rect (same dims).
  async buildCard(c) {
    const { hw, hd } = cardDims(c); const w = hw * 2, d = hd * 2;
    const g = new THREE.Group(); g.name = 'card:' + c.id; g.position.set(c.x, c.top, c.z);
    const slabH = 0.5;
    const slab = new THREE.Mesh(new THREE.BoxGeometry(w * 0.995, slabH, d * 0.995), new THREE.MeshStandardMaterial({ color: INK, roughness: 0.92, metalness: 0 }));
    slab.position.y = -slabH / 2 - 0.004; slab.castShadow = true; slab.receiveShadow = true; g.add(slab);
    this.root.add(g);
    const entry = { id: c.id, group: g, artState: 'pending', title: null, card: c };
    this.cards.set(c.id, entry);
    try {
      this.cb ??= createCardBuilder({ THREE, params: { pdfRes: 3000, backUrl: CARD_BACK, aspect: CARD_AR } });
      const rec = await this.cb.makeById(c.packId, c.n, { width: w, seed: [7, 23, 41, 59][CARDS.indexOf(c) % 4], onArt: () => { entry.artState = 'artwork'; } });
      if (!rec) throw new Error('card not found ' + c.packId + ':' + c.n);
      const sheet = rec.group; sheet.rotation.set(-Math.PI / 2, 0, Math.PI); sheet.position.y = 0.012;
      sheet.traverse(o => { if (o.isMesh) { o.receiveShadow = true; } });
      g.add(sheet); entry.rec = rec; entry.title = rec.card?.title ?? rec.card?.t ?? null; entry.artState = rec.artState ?? entry.artState;
    } catch (e) { entry.artState = 'failed'; entry.error = String(e.message || e); this.errors.push('card ' + c.id + ': ' + entry.error); }
  }
  // Subtle Chill & Fun target highlight (a ring on the chosen support).
  buildHighlight() {
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.56, 36), new THREE.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0.55, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.visible = false; ring.renderOrder = 3; this.scene.add(ring); this.highlight = ring;
  }
  showTarget(plan, t) {
    const r = this.highlight; if (!r) return;
    if (!plan || plan.kind === 'hop') { r.visible = false; return; }
    r.visible = true; r.position.set(plan.point.x, plan.point.y + 0.03, plan.point.z);
    const s = 1 + Math.sin(t * 6) * 0.06; r.scale.set(s, s, s);
    r.material.color.setHex(plan.kind === 'double' ? 0xa8e1ff : plan.kind === 'long' ? 0xffc38a : 0xffe9a8);
  }
  audit() {
    const fam = {}; for (const [k, v] of Object.entries(this.familyAudit)) fam[k] = { ...v, pieces: [...v.pieces] };
    const cards = [...this.cards.values()].map(c => ({ id: c.id, packId: c.card.packId, n: c.card.n, title: c.title, artState: c.rec?.artState ?? c.artState, error: c.error ?? null }));
    return { pin: HEX_PIN, families: fam, cards, errors: this.errors.slice(0, 8) };
  }
}
export { raw };
