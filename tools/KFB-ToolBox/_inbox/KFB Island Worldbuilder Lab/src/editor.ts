// Worldbuilder editor: select islands, reshape outlines with handles, move/scale islands, place KayKit buildings.
// Modes: Ansehen (orbit only) · Form (outline handles) · Bauen (place / move / rotate / scale buildings).
import * as THREE from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import type { App } from './main';
import { FIG_SCALE } from './scale';
import { PALETTES } from './palettes';
import { blobOutline, centroid, type P2 } from './island/shape';
import { newId, defaultWorld, type IslandSpec, type WorldSpec } from './island/spec';
import type { Island } from './island/island';

type Mode = 'view' | 'form' | 'build';

/** Landmark catalogue (path under /assets/kaykit/, default scale). */
export const ASSETS: { label: string; asset: string; scale: number }[] = [
  { label: 'Pyramide (prozedural)', asset: 'proc:pyramid', scale: 1 },
  { label: 'Auto · Cicada', asset: 'cars/Cicada/CICADA_LOW.fbx', scale: 1 },
  { label: 'Auto · Cruiser (Polizei)', asset: 'cars/Cruiser/CRUISER_LOW.fbx', scale: 1 },
  { label: 'Auto · Carrier', asset: 'cars/Carrier/CARRIER_LOW.fbx', scale: 1 },
  { label: 'Sarkophag', asset: 'mummy/sarcophagus.gltf', scale: FIG_SCALE },
  { label: 'Goldkrug', asset: 'mummy/pot_A_gold.gltf', scale: FIG_SCALE },
  { label: 'Ankh', asset: 'mummy/ankh.gltf', scale: FIG_SCALE },
  { label: 'Windmühle', asset: 'hex/green/building_windmill_green.gltf', scale: 6 },
  { label: 'Wassermühle', asset: 'hex/yellow/building_watermill_yellow.gltf', scale: 4.2 },
  { label: 'Taverne', asset: 'hex/blue/building_tavern_blue.gltf', scale: 4.2 },
  { label: 'Markt', asset: 'hex/red/building_market_red.gltf', scale: 4.5 },
  { label: 'Kirche', asset: 'hex/yellow/building_church_yellow.gltf', scale: 4.2 },
  { label: 'Burg', asset: 'hex/red/building_castle_red.gltf', scale: 3.6 },
  { label: 'Turm', asset: 'hex/blue/building_tower_A_blue.gltf', scale: 4.5 },
  { label: 'Sägewerk', asset: 'hex/green/building_lumbermill_green.gltf', scale: 4.5 },
  { label: 'Mine', asset: 'hex/yellow/building_mine_yellow.gltf', scale: 4.5 },
  { label: 'Brunnen', asset: 'hex/blue/building_well_blue.gltf', scale: 4 },
  { label: 'Bühne', asset: 'hex/neutral/building_stage_A.gltf', scale: 4 },
  { label: 'Stadthaus A', asset: 'city/building_A.gltf', scale: 4 },
  { label: 'Stadthaus C', asset: 'city/building_C.gltf', scale: 4 },
  { label: 'Stadthaus E', asset: 'city/building_E.gltf', scale: 4.5 },
  { label: 'Wasserturm', asset: 'city/watertower.gltf', scale: 9 },
  { label: 'Springbrunnen', asset: 'park/fountain.gltf', scale: 4 },
  { label: 'Schnee-Burg', asset: 'snow/castle_snow.gltf.glb', scale: 3.6 },
  { label: 'Schnee-Wachturm', asset: 'snow/watchtower_snow.gltf.glb', scale: 4.5 },
  { label: 'Schnee-Haus', asset: 'snow/house_snow.gltf.glb', scale: 4.5 },
  { label: 'Schnee-Mühle', asset: 'snow/mill_snow.gltf.glb', scale: 4.5 },
];

export class Editor {
  mode: Mode = 'view';
  selected: Island | null = null;
  selBuilding: string | null = null;
  private ray = new THREE.Raycaster();
  private ndc = new THREE.Vector2();
  private handles = new THREE.Group();
  private drag: null | { kind: 'handle'; index: number; plane: THREE.Plane } | { kind: 'island'; plane: THREE.Plane; off: THREE.Vector3 } = null;
  private tc: TransformControls;
  private panel = document.getElementById('panel')!;
  private assetIx = 0;
  private rebuildT = 0;

  constructor(private app: App) {
    app.scene.add(this.handles);
    this.tc = new TransformControls(app.camera, app.renderer.domElement);
    this.tc.setSize(0.8);
    this.tc.addEventListener('dragging-changed', (e: any) => {
      app.controls.enabled = !e.value;
      if (!e.value) this.commitBuilding(true);
    });
    this.tc.addEventListener('objectChange', () => this.commitBuilding(false));
    app.scene.add(this.tc.getHelper());
    const el = app.renderer.domElement;
    el.addEventListener('pointerdown', (e) => this.down(e));
    el.addEventListener('pointermove', (e) => this.move(e));
    el.addEventListener('pointerup', () => this.up());
    el.addEventListener('dblclick', (e) => this.dbl(e));
    el.addEventListener('contextmenu', (e) => { if (this.mode === 'form') { e.preventDefault(); this.ctx(e); } });
    addEventListener('keydown', (e) => this.key(e));
    this.select(app.islands.values().next().value ?? null);
  }

  // ---------- picking ----------
  private setRay(e: PointerEvent | MouseEvent) {
    const r = this.app.renderer.domElement.getBoundingClientRect();
    this.ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(this.ndc, this.app.camera);
  }
  private pickIsland(): { isl: Island; point: THREE.Vector3; building: string | null } | null {
    const objs: THREE.Object3D[] = [];
    for (const isl of this.app.islands.values()) { objs.push(...isl.groundObjects); objs.push(...isl.buildingObjs.values()); }
    const hit = this.ray.intersectObjects(objs, true)[0];
    if (!hit) return null;
    let o: THREE.Object3D | null = hit.object, building: string | null = null, id: string | null = null;
    while (o) { if (o.userData.buildingId) building = o.userData.buildingId; if (o.userData.islandId) { id = o.userData.islandId; if (!o.userData.buildingId) break; } o = o.parent; }
    const isl = id ? this.app.islands.get(id) : null;
    return isl ? { isl, point: hit.point, building } : null;
  }

  // ---------- pointer ----------
  private down(e: PointerEvent) {
    if (e.button !== 0 || this.tc.dragging) return;
    this.setRay(e);
    if (this.mode === 'form' && this.selected) {
      const h = this.ray.intersectObjects(this.handles.children, false)[0];
      if (h) {
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -this.selected.spec.pos[1]);
        this.drag = { kind: 'handle', index: h.object.userData.index, plane };
        this.app.controls.enabled = false;
        return;
      }
    }
    const p = this.pickIsland();
    if (!p) return;
    if (p.isl !== this.selected) { this.select(p.isl); return; }
    if (this.mode === 'form' && e.shiftKey) {
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -p.point.y);
      const pos = new THREE.Vector3(...p.isl.spec.pos);
      this.drag = { kind: 'island', plane, off: pos.sub(p.point) };
      this.app.controls.enabled = false;
      return;
    }
    if (this.mode === 'build') {
      if (p.building) { this.selectBuilding(p.building); return; }
      if (e.altKey || this.selBuilding === null) {
        const a = ASSETS[this.assetIx];
        const local = p.point.clone().sub(new THREE.Vector3(...p.isl.spec.pos));
        const b = { id: newId('b'), asset: a.asset, x: local.x, z: local.z, y: 0, rot: Math.random() * Math.PI * 2, scale: a.scale, pad: a.asset === 'proc:pyramid' ? 31 : a.asset.startsWith('cars/') ? 3 : 4.5 };
        p.isl.spec.buildings.push(b);
        this.app.save();
        p.isl.syncBuildings().then(() => { this.selectBuilding(b.id); this.scheduleRebuild(p.isl, true); });
      } else this.selectBuilding(null);
    }
  }

  private move(e: PointerEvent) {
    if (!this.drag || !this.selected) return;
    this.setRay(e);
    const hit = new THREE.Vector3();
    if (!this.ray.ray.intersectPlane(this.drag.plane, hit)) return;
    const s = this.selected.spec;
    if (this.drag.kind === 'handle') {
      s.outline[this.drag.index] = [hit.x - s.pos[0], hit.z - s.pos[2]];
      this.placeHandles();
      this.scheduleRebuild(this.selected, false, 60);
    } else {
      s.pos[0] = hit.x + this.drag.off.x;
      s.pos[2] = hit.z + this.drag.off.z;
      this.selected.group.position.set(...s.pos);
      this.placeHandles();
    }
  }

  private up() {
    if (!this.drag) return;
    const wasHandle = this.drag.kind === 'handle';
    this.drag = null;
    this.app.controls.enabled = true;
    if (this.selected) { this.app.save(); if (wasHandle) this.scheduleRebuild(this.selected, true, 10); }
  }

  private dbl(e: MouseEvent) {
    if (this.mode !== 'form' || !this.selected) return;
    this.setRay(e);
    const s = this.selected.spec;
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -s.pos[1]);
    const hit = new THREE.Vector3();
    if (!this.ray.ray.intersectPlane(plane, hit)) return;
    const x = hit.x - s.pos[0], z = hit.z - s.pos[2];
    // insert into the nearest outline segment
    let best = 0, bd = Infinity;
    for (let i = 0; i < s.outline.length; i++) {
      const a = s.outline[i], b = s.outline[(i + 1) % s.outline.length];
      const d = segDist(x, z, a, b);
      if (d < bd) { bd = d; best = i; }
    }
    s.outline.splice(best + 1, 0, [x, z]);
    this.placeHandles();
    this.scheduleRebuild(this.selected, true, 10);
    this.app.save();
  }

  private ctx(e: MouseEvent) {
    if (!this.selected) return;
    this.setRay(e);
    const h = this.ray.intersectObjects(this.handles.children, false)[0];
    if (!h || this.selected.spec.outline.length <= 5) return;
    this.selected.spec.outline.splice(h.object.userData.index, 1);
    this.placeHandles();
    this.scheduleRebuild(this.selected, true, 10);
    this.app.save();
  }

  togglePanel(show?: boolean) {
    const hidden = this.panel.style.display === 'none';
    const on = show ?? hidden;
    this.panel.style.display = on ? '' : 'none';
    let btn = document.getElementById('showPanel');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'showPanel';
      btn.textContent = '☰ Panel';
      btn.title = 'Panel einblenden (H)';
      btn.style.cssText = 'position:fixed;top:12px;left:12px;border:0;border-radius:8px;padding:6px 10px;background:#fff8ee;color:#2b2340;font:13px system-ui;box-shadow:0 4px 14px #2b234033;cursor:pointer';
      btn.addEventListener('click', () => this.togglePanel(true));
      document.body.appendChild(btn);
    }
    btn.style.display = on ? 'none' : '';
  }

  private key(e: KeyboardEvent) {
    if ((e.target as HTMLElement).tagName === 'INPUT') return;
    if (e.key === 'h' || e.key === 'H') this.togglePanel();
    if (this.mode === 'build' && this.selBuilding) {
      if (e.key === 'w') this.tc.setMode('translate');
      if (e.key === 'e') this.tc.setMode('rotate');
      if (e.key === 'r') this.tc.setMode('scale');
      if (e.key === 'Delete' || e.key === 'Backspace') this.deleteBuilding();
    }
    if (e.key === '1') this.setMode('view');
    if (e.key === '2') this.setMode('form');
    if (e.key === '3') this.setMode('build');
  }

  // ---------- buildings ----------
  private selectBuilding(id: string | null) {
    this.selBuilding = id;
    const o = id && this.selected ? this.selected.buildingObjs.get(id) : null;
    if (o) {
      this.tc.attach(o);
      this.tc.setMode('translate');
      this.tc.showY = false;
    } else this.tc.detach();
    this.render();
  }

  private commitBuilding(final: boolean) {
    const isl = this.selected, id = this.selBuilding;
    if (!isl || !id) return;
    const o = isl.buildingObjs.get(id), b = isl.spec.buildings.find((q) => q.id === id);
    if (!o || !b) return;
    b.x = o.position.x; b.z = o.position.z; b.rot = o.rotation.y;
    b.scale = Math.max(0.5, (o.scale.x + o.scale.z) / 2);
    o.rotation.set(0, b.rot, 0);
    isl.placeBuilding(b, o);
    if (final) { this.app.save(); this.scheduleRebuild(isl, true, 10); }
  }

  private deleteBuilding() {
    const isl = this.selected;
    if (!isl || !this.selBuilding) return;
    isl.spec.buildings = isl.spec.buildings.filter((b) => b.id !== this.selBuilding);
    this.selectBuilding(null);
    isl.syncBuildings();
    this.scheduleRebuild(isl, true, 10);
    this.app.save();
  }

  // ---------- islands ----------
  select(isl: Island | null) {
    this.selected = isl;
    this.selectBuilding(null);
    this.placeHandles();
    this.render();
  }

  setMode(m: Mode) {
    this.mode = m;
    if (m !== 'build') this.selectBuilding(null);
    this.placeHandles();
    this.render();
  }

  private placeHandles() {
    for (const h of [...this.handles.children]) { this.handles.remove(h); (h as THREE.Mesh).geometry.dispose(); }
    if (this.mode !== 'form' || !this.selected) return;
    const s = this.selected.spec;
    const m = new THREE.MeshBasicMaterial({ color: '#ef5a22', depthTest: false });
    s.outline.forEach(([x, z], i) => {
      const h = new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 12), m);
      h.position.set(s.pos[0] + x, s.pos[1] + 0.6, s.pos[2] + z);
      h.renderOrder = 10;
      h.userData.index = i;
      this.handles.add(h);
    });
  }

  scheduleRebuild(isl: Island, nature: boolean, ms = 150) {
    clearTimeout(this.rebuildT);
    this.rebuildT = window.setTimeout(async () => {
      await isl.build(nature);
      if (this.selBuilding) { const o = isl.buildingObjs.get(this.selBuilding); if (o) this.tc.attach(o); }
    }, ms);
  }

  private scaleOutline(k: number) {
    const s = this.selected?.spec;
    if (!s) return;
    const c = centroid(s.outline);
    s.outline = s.outline.map(([x, z]): P2 => [c[0] + (x - c[0]) * k, c[1] + (z - c[1]) * k]);
    const scaleXZ = (o: { x: number; z: number }) => { o.x = c[0] + (o.x - c[0]) * k; o.z = c[1] + (o.z - c[1]) * k; };
    s.buildings.forEach(scaleXZ);
    if (s.terrain.pond) { scaleXZ(s.terrain.pond); s.terrain.pond.r *= k; }
    if (s.terrain.mount) { scaleXZ(s.terrain.mount); s.terrain.mount.r *= k; }
  }

  private async newIsland() {
    const n = this.app.world.islands.length;
    const pal = Object.keys(PALETTES)[n % 3];
    const ang = n * 2.1;
    const spec: IslandSpec = {
      id: newId('isl'), name: 'Insel ' + (n + 1), palette: pal, seed: Math.floor(Math.random() * 1000), pos: [Math.cos(ang) * 110, (n % 3) * 4 - 4, Math.sin(ang) * 110],
      outline: blobOutline(24, 9, Math.random() * 10, 0.25),
      terrain: { hills: 1.6, hillScale: 0.06, depth: 1.0, beach: 0, pond: null, mount: null },
      nature: { trees: 16, bushes: 18, rocks: 8, towers: 3, treeKind: pal === 'bucht' ? 'kelp' : 'ball' },
      buildings: [],
    };
    const isl = await this.app.addIsland(spec);
    this.app.save();
    this.select(isl);
    this.app.setCamera(spec.id);
  }

  // ---------- panel ----------
  render() {
    const s = this.selected?.spec;
    const opts = (list: [string, string][], v: string) => list.map(([k, l]) => `<option value="${k}"${k === v ? ' selected' : ''}>${l}</option>`).join('');
    const rng = (id: string, label: string, v: number, min: number, max: number, step: number) =>
      `<label>${label}<input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${v}"></label>`;
    const modeBtn = (m: Mode, l: string) => `<button class="${this.mode === m ? 'on' : 'ghost'}" data-mode="${m}">${l}</button>`;
    this.panel.innerHTML = `
      <h1>KFB Island Worldbuilder <button class="ghost" id="hide" title="Panel ausblenden (H)" style="float:right;padding:2px 8px">–</button></h1>
      <div class="row">${modeBtn('view', '1 Ansehen')}${modeBtn('form', '2 Form')}${modeBtn('build', '3 Bauen')}</div>
      <div class="hint">${this.mode === 'form' ? 'Punkte ziehen · Doppelklick: Punkt einfügen · Rechtsklick: Punkt löschen · Shift+Ziehen: Insel verschieben'
        : this.mode === 'build' ? 'Klick auf die Insel: Gebäude setzen · Klick auf Gebäude: auswählen · W/E/R: Bewegen/Drehen/Skalieren · Entf: löschen · Alt+Klick: weiteres setzen'
        : 'Klick auf eine Insel wählt sie aus. Maus: drehen · Rechts: schieben · Rad: zoomen'}</div>
      <h2>Insel</h2>
      <label>Auswahl<select id="isl">${opts(this.app.world.islands.map((i) => [i.id, i.name]), s?.id ?? '')}</select></label>
      ${s ? `
      <label>Name<input type="text" id="name" value="${s.name}"></label>
      <label>Palette<select id="pal">${opts(Object.values(PALETTES).map((p) => [p.id, p.name]), s.palette)}</select></label>
      <label>Unterseite-Typ<select id="under">${opts([['cone', 'Kegel'], ['lobes', 'Lappen']], s.terrain.under ?? 'cone')}</select></label>
      <label>Bäume<select id="kind">${opts([['ball', 'Kugelbäume'], ['kelp', 'Tangbäume'], ['palm', 'Palmen']], s.nature.treeKind)}</select></label>
      <label>Seed<span><input type="number" id="seed" value="${s.seed}" style="width:70px"> <button class="ghost" id="dice">🎲</button></span></label>
      ${rng('size', 'Größe', 1, 0.7, 1.4, 0.05)}
      ${rng('height', 'Höhe', s.pos[1], -30, 30, 1)}
      ${rng('hills', 'Hügel', s.terrain.hills, 0, 4, 0.1)}
      ${rng('depth', 'Unterseite', s.terrain.depth, 0.5, 1.8, 0.05)}
      ${rng('beach', 'Strand', s.terrain.beach, 0, 10, 0.5)}
      ${rng('trees', 'Bäume', s.nature.trees, 0, 60, 1)}
      ${rng('bushes', 'Büsche', s.nature.bushes, 0, 80, 1)}
      ${rng('rocks', 'Felsen', s.nature.rocks, 0, 40, 1)}
      ${rng('towers', 'Türme', s.nature.towers, 0, 14, 1)}
      <div class="row"><button class="ghost" id="pond">${s.terrain.pond ? 'Teich entfernen' : 'Teich anlegen'}</button><button class="ghost" id="mount">${s.terrain.mount ? 'Berg entfernen' : 'Berg anlegen'}</button></div>
      <div class="row"><button class="ghost" id="focus">Kamera hin</button><button class="ghost" id="del">Insel löschen</button></div>` : ''}
      ${this.mode === 'build' ? `<h2>Gebäude</h2><label>Setzen<select id="asset">${opts(ASSETS.map((a, i) => [String(i), a.label]), String(this.assetIx))}</select></label>` : ''}
      <h2>Welt</h2>
      <div class="row"><button id="new">+ Neue Insel</button><button class="ghost" id="overview">Übersicht</button></div>
      <div class="row"><button class="ghost" id="orig">Originale ein/aus</button><button class="ghost" id="compare">Vergleich</button></div>
      <div class="row"><button class="ghost" id="export">Speichern (JSON)</button><button class="ghost" id="import">Laden</button><button class="ghost" id="reset">Zurücksetzen</button></div>
      <input type="file" id="file" accept=".json" style="display:none">`;
    const $ = (id: string) => this.panel.querySelector('#' + id) as HTMLInputElement | null;
    this.panel.querySelectorAll('[data-mode]').forEach((b) => b.addEventListener('click', () => this.setMode((b as HTMLElement).dataset.mode as Mode)));
    $('hide')?.addEventListener('click', () => this.togglePanel(false));
    $('isl')?.addEventListener('change', (e) => this.select(this.app.islands.get((e.target as HTMLSelectElement).value) ?? null));
    $('new')?.addEventListener('click', () => this.newIsland());
    $('overview')?.addEventListener('click', () => this.app.setCamera('overview'));
    $('orig')?.addEventListener('click', async () => { const on = await this.app.toggleOriginals(); toast(on ? 'Originale sichtbar' : 'Originale ausgeblendet'); });
    $('compare')?.addEventListener('click', async () => { await this.app.toggleOriginals(true); this.app.setCamera('compare'); });
    $('asset')?.addEventListener('change', (e) => { this.assetIx = Number((e.target as HTMLSelectElement).value); });
    $('export')?.addEventListener('click', () => download(this.app.world));
    $('import')?.addEventListener('click', () => $('file')?.click());
    $('file')?.addEventListener('change', async (e) => {
      const f = (e.target as HTMLInputElement).files?.[0];
      if (!f) return;
      const w = JSON.parse(await f.text()) as WorldSpec;
      await this.app.load(w);
      this.select(this.app.islands.values().next().value ?? null);
      toast('Welt geladen');
    });
    $('reset')?.addEventListener('click', async () => {
      if (!confirm('Welt auf die drei Joyride-Inseln zurücksetzen?')) return;
      await this.app.load(defaultWorld());
      this.select(this.app.islands.values().next().value ?? null);
    });
    if (!s || !this.selected) return;
    const isl = this.selected;
    const live = (id: string, fn: (v: number) => void, nature = true) => $(id)?.addEventListener('input', (e) => { fn(Number((e.target as HTMLInputElement).value)); this.app.save(); this.scheduleRebuild(isl, nature); });
    $('name')?.addEventListener('change', (e) => { s.name = (e.target as HTMLInputElement).value; this.app.save(); this.render(); });
    $('pal')?.addEventListener('change', (e) => { s.palette = (e.target as HTMLSelectElement).value; this.app.save(); this.scheduleRebuild(isl, true, 10); });
    $('under')?.addEventListener('change', (e) => { s.terrain.under = (e.target as HTMLSelectElement).value as any; this.app.save(); this.scheduleRebuild(isl, false, 10); });
    $('kind')?.addEventListener('change', (e) => { s.nature.treeKind = (e.target as HTMLSelectElement).value as any; this.app.save(); this.scheduleRebuild(isl, true, 10); });
    $('seed')?.addEventListener('change', (e) => { s.seed = Number((e.target as HTMLInputElement).value); this.app.save(); this.scheduleRebuild(isl, true, 10); });
    $('dice')?.addEventListener('click', () => { s.seed = Math.floor(Math.random() * 1000); this.app.save(); this.render(); this.scheduleRebuild(isl, true, 10); });
    let lastK = 1;
    $('size')?.addEventListener('input', (e) => { const k = Number((e.target as HTMLInputElement).value); this.scaleOutline(k / lastK); lastK = k; this.placeHandles(); this.app.save(); this.scheduleRebuild(isl, true); });
    live('height', (v) => { s.pos[1] = v; isl.group.position.y = v; this.placeHandles(); }, false);
    live('hills', (v) => (s.terrain.hills = v));
    live('depth', (v) => (s.terrain.depth = v), false);
    live('beach', (v) => (s.terrain.beach = v));
    live('trees', (v) => (s.nature.trees = v));
    live('bushes', (v) => (s.nature.bushes = v));
    live('rocks', (v) => (s.nature.rocks = v));
    live('towers', (v) => (s.nature.towers = v));
    $('pond')?.addEventListener('click', () => {
      const c = centroid(s.outline);
      s.terrain.pond = s.terrain.pond ? null : { x: c[0] + 4, z: c[1] + 4, r: 6 };
      this.app.save(); this.render(); this.scheduleRebuild(isl, true, 10);
    });
    $('mount')?.addEventListener('click', () => {
      const c = centroid(s.outline);
      s.terrain.mount = s.terrain.mount ? null : { x: c[0] - 6, z: c[1] - 6, r: 10, h: 7 };
      this.app.save(); this.render(); this.scheduleRebuild(isl, true, 10);
    });
    $('focus')?.addEventListener('click', () => this.app.setCamera(s.id));
    $('del')?.addEventListener('click', () => {
      if (!confirm(`Insel „${s.name}“ löschen?`)) return;
      this.app.removeIsland(s.id);
      this.select(this.app.islands.values().next().value ?? null);
    });
  }
}

function segDist(x: number, z: number, a: P2, b: P2) {
  const dx = b[0] - a[0], dz = b[1] - a[1], L = dx * dx + dz * dz || 1e-9;
  let t = ((x - a[0]) * dx + (z - a[1]) * dz) / L;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(a[0] + dx * t - x, a[1] + dz * t - z);
}

function download(w: WorldSpec) {
  const blob = new Blob([JSON.stringify(w, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'kfb-world.json';
  a.click();
  URL.revokeObjectURL(a.href);
}

export function toast(msg: string) {
  const t = document.getElementById('toast')!;
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => (t.style.opacity = '0'), 1800);
}
