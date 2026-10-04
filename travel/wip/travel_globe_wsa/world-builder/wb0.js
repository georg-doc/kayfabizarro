import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import { createGroundController } from './ground-controller.js';
import { createRuntimeModeBridge } from './runtime-mode.js';
import {
  loadRecipe, saveRecipe, exportRecipe, importRecipeFile, makeId,
  surfaceAnchorFromWorld, worldFromSurfaceAnchor,
} from './world-recipe.js';

const ASSET_PIN = '540bcccde33bb25e2d4dda77c896aa237b5b197d';
const RAW_ROOT = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${ASSET_PIN}/`;
const BODY_HEIGHT = 0.022;

const ASSETS = {
  caveman: {
    id: 'caveman', label: 'Caveman', kind: 'actor', targetHeight: BODY_HEIGHT,
    path: 'media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/characters/Caveman.glb',
    materialPreset: 'world-lambert',
  },
  mine: {
    id: 'mine', label: 'Caveman Mine', kind: 'building', targetHeight: BODY_HEIGHT * 5.5,
    path: 'media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/buildings/green/building_mine_green.gltf',
    materialPreset: 'world-lambert',
  },
  campfire: {
    id: 'campfire', label: 'Campfire', kind: 'prop', targetHeight: BODY_HEIGHT * 0.55,
    path: 'media/3D_Assets/KayKit_Mystery_Series6/8 - February 2025 - Caveman/assets/gltf/Campfire_Base.gltf',
    materialPreset: 'world-lambert',
  },
  rockA: {
    id: 'rockA', label: 'Forest Rock A', kind: 'prop', targetHeight: BODY_HEIGHT * 0.9,
    path: 'media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Rock_2_G_Color1.gltf',
    materialPreset: 'world-lambert',
  },
  rockB: {
    id: 'rockB', label: 'Forest Rock B', kind: 'prop', targetHeight: BODY_HEIGHT * 0.65,
    path: 'media/3D_Assets/KayKit_Forest_Nature_Pack_1.0_FREE/Assets/gltf/Rock_1_P_Color1.gltf',
    materialPreset: 'world-lambert',
  },
  blockGrass: {
    id: 'blockGrass', label: 'BlockBits Grass', kind: 'voxel', targetHeight: BODY_HEIGHT * 0.7,
    path: 'media/3D_Assets/KayKit_BlockBits_1.0_FREE/Assets/gltf/grass.gltf',
    materialPreset: 'world-lambert', godOnly: true,
  },
  ramp: {
    id: 'ramp', label: 'Stunt Ramp', kind: 'prop', targetHeight: BODY_HEIGHT * 1.25,
    path: 'media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Environment/GLTF/Ramp.gltf',
    materialPreset: 'world-lambert',
  },
};

function raw(path) {
  return RAW_ROOT + path.split('/').map((p) => encodeURIComponent(p)).join('/');
}

function waitForGlobe(timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    const t0 = performance.now();
    const tick = () => {
      const g = window.__globe;
      if (g && g.scene && g.renderer && g.camera && g.globe && g.carpet && g.rig) return resolve(g);
      if (performance.now() - t0 > timeoutMs) return reject(new Error('Travel runtime did not expose window.__globe'));
      setTimeout(tick, 40);
    };
    tick();
  });
}

function visibleSize(object) {
  object.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(object);
  return { box, size: box.getSize(new THREE.Vector3()) };
}

function normalizeHeight(object, targetHeight) {
  const before = visibleSize(object);
  const nativeHeight = before.size.y;
  if (nativeHeight > 1e-6 && targetHeight > 0) object.scale.multiplyScalar(targetHeight / nativeHeight);
  object.updateMatrixWorld(true);
  const after = visibleSize(object);
  object.position.y -= after.box.min.y;
  object.updateMatrixWorld(true);
  return { nativeHeight, targetHeight, worldHeight: visibleSize(object).size.y };
}

function worldLambert(root) {
  root.traverse((node) => {
    if (!node.isMesh || !node.material) return;
    const convert = (src) => {
      if (!src) return src;
      const mat = new THREE.MeshLambertMaterial({
        color: src.color ? src.color.clone() : new THREE.Color(0xffffff),
        map: src.map || null,
        transparent: !!src.transparent,
        opacity: src.opacity == null ? 1 : src.opacity,
        alphaTest: src.alphaTest || 0,
        side: src.side,
        vertexColors: !!src.vertexColors,
      });
      mat.name = `${src.name || 'material'} · WB0 world-lambert`;
      return mat;
    };
    node.material = Array.isArray(node.material) ? node.material.map(convert) : convert(node.material);
    node.castShadow = true;
    node.receiveShadow = true;
  });
}

function alignAnchorToSurface(anchor, direction) {
  const up = direction.clone().normalize();
  anchor.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up);
}

function createUi() {
  const host = document.getElementById('wb0-root');
  const style = document.createElement('style');
  style.textContent = `
  #wb0-root{position:absolute;inset:0;z-index:120;pointer-events:none;font-family:"Baloo 2",system-ui,sans-serif;color:#f4ead7}
  .wb0-bar,.wb0-panel{pointer-events:auto;background:rgba(10,16,28,.88);backdrop-filter:blur(9px);border:1px solid rgba(244,234,215,.22);box-shadow:0 8px 28px rgba(0,0,0,.24)}
  .wb0-bar{position:absolute;left:14px;top:14px;display:flex;gap:8px;align-items:center;padding:8px;border-radius:9px}
  .wb0-bar strong{padding:0 7px;font:700 11px/1.2 "Special Elite",monospace;letter-spacing:.08em;color:#d8b25b}
  .wb0-panel{position:absolute;right:14px;top:14px;width:min(335px,42vw);max-height:calc(100% - 28px);overflow:auto;padding:12px;border-radius:10px}
  .wb0-panel[hidden]{display:none}.wb0-row{display:flex;flex-wrap:wrap;gap:6px;margin:7px 0}.wb0-section{border-top:1px solid rgba(244,234,215,.14);padding-top:9px;margin-top:9px}
  .wb0-section h3{font-size:13px;margin:0 0 6px;color:#d8b25b}.wb0-status{font-size:11px;line-height:1.35;opacity:.9;margin-top:5px}.wb0-readout{font:10px/1.4 monospace;white-space:pre-wrap;opacity:.78}
  .wb0-btn{border:1px solid rgba(244,234,215,.28);background:#263448;color:#f4ead7;border-radius:6px;padding:6px 9px;font:700 11px/1 "Baloo 2",sans-serif;cursor:pointer}
  .wb0-btn:hover{background:#33465f}.wb0-btn.active{background:#c76b42;border-color:#e6a47e;color:#fff}.wb0-btn.god{background:#5b486e}.wb0-btn.danger{background:#743f3f}
  .wb0-field{display:grid;grid-template-columns:90px 1fr;gap:7px;align-items:center;margin:6px 0;font-size:11px}.wb0-field input[type=number]{width:100%;box-sizing:border-box;background:#121c2a;color:#f4ead7;border:1px solid rgba(244,234,215,.25);border-radius:5px;padding:5px}
  .wb0-field input[type=checkbox]{justify-self:start}.wb0-assets button{flex:1 0 44%;text-align:left}.wb0-god-only[hidden]{display:none}
  @media(max-width:760px){.wb0-panel{width:calc(100% - 28px);top:auto;bottom:14px;max-height:42%}.wb0-bar{right:14px;overflow:auto}.wb0-bar strong{display:none}}
  `;
  document.head.appendChild(style);
  host.innerHTML = `
    <div class="wb0-bar">
      <strong>WB0</strong>
      <button class="wb0-btn" data-author="PLAY">PLAY</button>
      <button class="wb0-btn" data-author="BUILD">BUILD</button>
      <button class="wb0-btn" data-author="GOD">GOD</button>
      <span style="width:1px;height:24px;background:rgba(255,255,255,.2)"></span>
      <button class="wb0-btn" data-loco="GROUND">GROUND</button>
      <button class="wb0-btn" data-loco="FLIGHT">FLIGHT</button>
    </div>
    <aside class="wb0-panel" hidden>
      <div class="wb0-section" style="border-top:0;padding-top:0;margin-top:0"><h3>Palette</h3><div class="wb0-row wb0-assets"></div>
        <div class="wb0-row"><button class="wb0-btn" data-action="import">Import Librarian JSON</button><input data-file="import" type="file" accept="application/json" hidden></div>
      </div>
      <div class="wb0-section"><h3>Transform</h3><div class="wb0-row">
        <button class="wb0-btn" data-transform="translate">Move</button><button class="wb0-btn" data-transform="rotate">Rotate</button><button class="wb0-btn" data-transform="scale">Scale</button>
      </div><label class="wb0-field"><span>Surface Snap</span><input data-snap type="checkbox" checked></label>
      <label class="wb0-field"><span>Uniform scale</span><input data-scale type="number" min="0.05" max="20" step="0.05" value="1"></label>
      <div class="wb0-row"><button class="wb0-btn" data-action="duplicate">Duplicate</button><button class="wb0-btn danger" data-action="delete">Delete</button></div>
      <div class="wb0-readout" data-inspector>No selection</div></div>
      <div class="wb0-section"><h3>Spline</h3><div class="wb0-row"><button class="wb0-btn" data-action="road">Draw ROAD</button><button class="wb0-btn" data-action="finish-road">Finish ROAD</button></div><div class="wb0-status" data-road-status>Click Draw ROAD, then terrain points.</div></div>
      <div class="wb0-section wb0-god-only" hidden><h3>GOD / Voxel</h3><div class="wb0-status">Choose BlockBits Grass in the palette and click the terrain. Place five blocks for the WB0 proof.</div></div>
      <div class="wb0-section"><h3>World Recipe</h3><div class="wb0-row"><button class="wb0-btn" data-action="save">Save</button><button class="wb0-btn" data-action="reload">Reload</button><button class="wb0-btn" data-action="export">Export JSON</button></div><div class="wb0-status" data-status>Starting…</div></div>
    </aside>`;
  return {
    host,
    panel: host.querySelector('.wb0-panel'),
    assets: host.querySelector('.wb0-assets'),
    godSection: host.querySelector('.wb0-god-only'),
    status: host.querySelector('[data-status]'),
    roadStatus: host.querySelector('[data-road-status]'),
    inspector: host.querySelector('[data-inspector]'),
    scale: host.querySelector('[data-scale]'),
    snap: host.querySelector('[data-snap]'),
    file: host.querySelector('[data-file=import]'),
  };
}

async function main() {
  const g = await waitForGlobe();
  const ui = createUi();
  const loader = new GLTFLoader();
  const recipe = loadRecipe();
  const ground = createGroundController({ THREE, camera: g.camera, globe: g.globe, renderer: g.renderer, bodyHeight: BODY_HEIGHT });
  const bridge = createRuntimeModeBridge({ g, ground, onChange: () => refreshModeButtons() });
  const ray = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const instances = new Map();
  const roadMeshes = new Map();
  const palette = new Map(Object.values(ASSETS).map((a) => [a.id, { ...a, url: raw(a.path), pin: ASSET_PIN }]));
  let authorMode = String(recipe.base.authoringMode || 'PLAY').toUpperCase();
  let selectedId = null;
  let placeAssetId = null;
  let roadDrawing = false;
  let roadPoints = [];

  const transform = new TransformControls(g.camera, g.renderer.domElement);
  transform.setMode('translate');
  transform.setSpace('local');
  transform.setSize(0.72);
  g.scene.add(transform);

  function radiusAt(dir) { return ground.radiusAt(dir); }

  async function loadAsset(def) {
    const gltf = await loader.loadAsync(def.url || raw(def.path));
    const model = gltf.scene;
    if (def.materialPreset === 'world-lambert') worldLambert(model);
    const measure = normalizeHeight(model, Number(def.targetHeight || BODY_HEIGHT));
    return { model, measure };
  }

  async function loadPlayer() {
    const def = {
      url: raw('media/3D_Assets/KayKit_Mystery_Series6/11 - May 2025 - Hiker/characters/Hiker.glb'),
      targetHeight: BODY_HEIGHT, materialPreset: 'world-lambert',
    };
    const { model, measure } = await loadAsset(def);
    const root = new THREE.Group();
    root.name = 'WB0 Ground Player';
    root.add(model);
    g.scene.add(root);
    ground.setPlayerRoot(root);
    root.userData.wb0Player = true;
    return { root, measure };
  }

  const player = await loadPlayer();

  function entryFromInstance(id, rec) {
    const anchor = rec.anchor;
    const surface = surfaceAnchorFromWorld(THREE, anchor.position, radiusAt);
    return {
      id,
      label: rec.def.label,
      kind: rec.def.kind,
      assetId: rec.def.id || rec.def.path || rec.def.url,
      source: { url: rec.def.url, path: rec.def.path || null, pin: rec.def.pin || null },
      surface,
      quaternion: [anchor.quaternion.x, anchor.quaternion.y, anchor.quaternion.z, anchor.quaternion.w],
      scale: [anchor.scale.x, anchor.scale.y, anchor.scale.z],
      calibration: {
        targetHeight: rec.def.targetHeight || null,
        nativeHeight: rec.measure.nativeHeight,
        materialPreset: rec.def.materialPreset || null,
        surfaceSnap: !!rec.surfaceSnap,
      },
    };
  }

  function syncRecipeInstances() {
    recipe.instances = [...instances.entries()].map(([id, rec]) => entryFromInstance(id, rec));
  }

  function findInstanceId(object) {
    let o = object;
    while (o) {
      if (o.userData && o.userData.wb0Id) return o.userData.wb0Id;
      o = o.parent;
    }
    return null;
  }

  function snapAnchor(anchor, rec) {
    if (!rec.surfaceSnap) return;
    const dir = anchor.position.clone().normalize();
    anchor.position.copy(dir.multiplyScalar(radiusAt(dir) + BODY_HEIGHT * 0.01));
  }

  function select(id) {
    selectedId = id && instances.has(id) ? id : null;
    if (!selectedId) {
      transform.detach();
      ui.inspector.textContent = 'No selection';
      return;
    }
    const rec = instances.get(selectedId);
    transform.attach(rec.anchor);
    ui.scale.value = rec.anchor.scale.x.toFixed(3);
    const s = visibleSize(rec.anchor).size;
    ui.inspector.textContent = `${rec.def.label}\n${rec.def.kind}\nworld bbox ${s.x.toFixed(3)} × ${s.y.toFixed(3)} × ${s.z.toFixed(3)} u\nmaterial ${rec.def.materialPreset || 'native'}\nsource ${rec.def.path || rec.def.url}`;
  }

  async function createInstance(def, worldPoint, existing = null) {
    const { model, measure } = await loadAsset(def);
    const anchor = new THREE.Group();
    const id = existing && existing.id || makeId(def.kind || 'asset');
    anchor.name = `WB0 · ${def.label}`;
    anchor.userData.wb0Id = id;
    anchor.add(model);
    g.scene.add(anchor);
    const direction = worldPoint ? worldPoint.clone().normalize() : new THREE.Vector3(0, 1, 0);
    anchor.position.copy(direction).multiplyScalar(radiusAt(direction) + BODY_HEIGHT * 0.01);
    alignAnchorToSurface(anchor, direction);
    const rec = { anchor, model, def, measure, surfaceSnap: existing ? existing.calibration?.surfaceSnap !== false : true };
    instances.set(id, rec);
    if (existing) {
      anchor.position.copy(worldFromSurfaceAnchor(THREE, existing.surface, radiusAt));
      if (Array.isArray(existing.quaternion) && existing.quaternion.length === 4) anchor.quaternion.fromArray(existing.quaternion);
      if (Array.isArray(existing.scale) && existing.scale.length === 3) anchor.scale.fromArray(existing.scale);
    }
    select(id);
    return id;
  }

  function defFromRecipe(entry) {
    const known = palette.get(entry.assetId);
    if (known) return known;
    return {
      id: entry.assetId,
      label: entry.label || entry.assetId,
      kind: entry.kind || 'prop',
      url: entry.source && entry.source.url,
      path: entry.source && entry.source.path,
      pin: entry.source && entry.source.pin,
      targetHeight: entry.calibration && entry.calibration.targetHeight || BODY_HEIGHT,
      materialPreset: entry.calibration && entry.calibration.materialPreset || 'world-lambert',
    };
  }

  function updatePaletteUi() {
    ui.assets.innerHTML = '';
    for (const def of palette.values()) {
      const b = document.createElement('button');
      b.className = 'wb0-btn' + (def.godOnly ? ' god' : '');
      b.textContent = def.label;
      b.hidden = !!def.godOnly && authorMode !== 'GOD';
      b.onclick = () => {
        placeAssetId = def.id;
        roadDrawing = false;
        ui.status.textContent = `Place: ${def.label} · click terrain`;
        updatePaletteUi();
      };
      if (placeAssetId === def.id) b.classList.add('active');
      ui.assets.appendChild(b);
    }
  }

  function refreshModeButtons() {
    ui.host.querySelectorAll('[data-author]').forEach((b) => b.classList.toggle('active', b.dataset.author === authorMode));
    ui.host.querySelectorAll('[data-loco]').forEach((b) => b.classList.toggle('active', b.dataset.loco === bridge.mode));
    ui.panel.hidden = authorMode === 'PLAY';
    ui.godSection.hidden = authorMode !== 'GOD';
    updatePaletteUi();
  }

  function setAuthorMode(mode) {
    authorMode = mode;
    recipe.base.authoringMode = mode;
    if (mode === 'PLAY') {
      select(null);
      placeAssetId = null;
      roadDrawing = false;
      if (bridge.mode === 'GROUND') ground.setEnabled(true);
      if (bridge.mode === 'FLIGHT' && g.controls) g.controls.enabled = true;
    } else {
      ground.setEnabled(false);
      if (g.controls) g.controls.enabled = false;
    }
    refreshModeButtons();
  }

  function setLocomotion(mode) {
    bridge.set(mode);
    recipe.base.locomotionMode = mode;
    player.root.visible = mode === 'GROUND';
    if (authorMode !== 'PLAY') {
      ground.setEnabled(false);
      if (g.controls) g.controls.enabled = false;
    }
    refreshModeButtons();
  }

  function terrainHit(event) {
    const rect = g.renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    ray.setFromCamera(mouse, g.camera);
    const hits = ray.intersectObject(g.globe.mesh, true);
    return hits.length ? hits[0].point : null;
  }

  function instanceHit(event) {
    const rect = g.renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    ray.setFromCamera(mouse, g.camera);
    const roots = [...instances.values()].map((r) => r.anchor);
    const hits = ray.intersectObjects(roots, true);
    return hits.length ? findInstanceId(hits[0].object) : null;
  }

  function splinePointFromWorld(point) {
    return surfaceAnchorFromWorld(THREE, point, radiusAt);
  }

  function roadGeometry(spline) {
    const points = spline.points.map((a) => worldFromSurfaceAnchor(THREE, a, radiusAt));
    if (points.length < 2) return null;
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal');
    const samples = curve.getPoints(Math.max(12, points.length * 12));
    const width = spline.width || BODY_HEIGHT * 0.8;
    const positions = [], indices = [];
    const prev = new THREE.Vector3(), next = new THREE.Vector3(), tangent = new THREE.Vector3(), side = new THREE.Vector3();
    const p = new THREE.Vector3(), up = new THREE.Vector3();
    for (let i = 0; i < samples.length; i++) {
      p.copy(samples[i]);
      up.copy(p).normalize();
      const r = radiusAt(up) + BODY_HEIGHT * 0.006;
      p.copy(up).multiplyScalar(r);
      prev.copy(samples[Math.max(0, i - 1)]);
      next.copy(samples[Math.min(samples.length - 1, i + 1)]);
      tangent.copy(next).sub(prev).projectOnPlane(up).normalize();
      side.crossVectors(up, tangent).normalize();
      const l = p.clone().addScaledVector(side, width * 0.5);
      const rr = p.clone().addScaledVector(side, -width * 0.5);
      positions.push(l.x, l.y, l.z, rr.x, rr.y, rr.z);
      if (i < samples.length - 1) {
        const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
        indices.push(a, b, c, b, d, c);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices); geo.computeVertexNormals();
    return geo;
  }

  function renderRoad(spline) {
    const old = roadMeshes.get(spline.id);
    if (old) { g.scene.remove(old); old.geometry.dispose(); old.material.dispose(); }
    const geo = roadGeometry(spline); if (!geo) return;
    const mat = new THREE.MeshLambertMaterial({ color: 0x78654d, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
    const mesh = new THREE.Mesh(geo, mat); mesh.name = `WB0 ROAD · ${spline.id}`; mesh.receiveShadow = true;
    g.scene.add(mesh); roadMeshes.set(spline.id, mesh);
  }

  function finishRoad() {
    if (roadPoints.length < 2) { ui.roadStatus.textContent = 'ROAD needs at least two terrain points.'; return; }
    const spline = { id: makeId('road'), type: 'ROAD', width: BODY_HEIGHT * 0.8, points: roadPoints.slice() };
    recipe.splines.push(spline); renderRoad(spline);
    roadPoints = []; roadDrawing = false;
    ui.roadStatus.textContent = `ROAD created · ${spline.points.length} control points`;
  }

  function updateSelectedRecipe() {
    if (!selectedId || !instances.has(selectedId)) return;
    const rec = instances.get(selectedId);
    snapAnchor(rec.anchor, rec);
    syncRecipeInstances();
    select(selectedId);
  }

  transform.addEventListener('objectChange', updateSelectedRecipe);
  transform.addEventListener('dragging-changed', (e) => {
    if (bridge.mode === 'GROUND' && authorMode === 'PLAY') ground.setEnabled(!e.value);
  });

  g.renderer.domElement.addEventListener('pointerdown', async (event) => {
    if (authorMode === 'PLAY' || transform.dragging) return;
    const hitId = instanceHit(event);
    if (hitId && !placeAssetId && !roadDrawing) { select(hitId); return; }
    const p = terrainHit(event); if (!p) return;
    if (roadDrawing) {
      roadPoints.push(splinePointFromWorld(p));
      ui.roadStatus.textContent = `ROAD draft · ${roadPoints.length} point${roadPoints.length === 1 ? '' : 's'}`;
      return;
    }
    if (placeAssetId) {
      const def = palette.get(placeAssetId);
      if (def) {
        await createInstance(def, p);
        syncRecipeInstances();
        ui.status.textContent = `Placed ${def.label} · calibration stays instance-local`;
        if (def.kind !== 'voxel') placeAssetId = null;
        updatePaletteUi();
      }
    } else select(null);
  });

  ui.host.querySelectorAll('[data-author]').forEach((b) => b.onclick = () => setAuthorMode(b.dataset.author));
  ui.host.querySelectorAll('[data-loco]').forEach((b) => b.onclick = () => setLocomotion(b.dataset.loco));
  ui.host.querySelectorAll('[data-transform]').forEach((b) => b.onclick = () => {
    transform.setMode(b.dataset.transform); transform.setSpace('local');
    ui.host.querySelectorAll('[data-transform]').forEach((x) => x.classList.toggle('active', x === b));
  });
  ui.snap.onchange = () => { if (selectedId) { instances.get(selectedId).surfaceSnap = ui.snap.checked; updateSelectedRecipe(); } };
  ui.scale.onchange = () => {
    if (!selectedId) return;
    const v = Number(ui.scale.value); if (!Number.isFinite(v) || v <= 0) return;
    instances.get(selectedId).anchor.scale.setScalar(v); updateSelectedRecipe();
  };

  ui.host.querySelector('[data-action=delete]').onclick = () => {
    if (!selectedId || !instances.has(selectedId)) return;
    const rec = instances.get(selectedId); g.scene.remove(rec.anchor); instances.delete(selectedId); select(null); syncRecipeInstances();
  };
  ui.host.querySelector('[data-action=duplicate]').onclick = async () => {
    if (!selectedId || !instances.has(selectedId)) return;
    const rec = instances.get(selectedId); const p = rec.anchor.position.clone();
    const d = p.clone().normalize(); const side = new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0), d);
    if (side.lengthSq() < 1e-8) side.set(1,0,0); side.normalize();
    const shifted = d.clone().addScaledVector(side, BODY_HEIGHT * 1.5 / 5).normalize().multiplyScalar(radiusAt(d));
    const id = await createInstance(rec.def, shifted);
    instances.get(id).anchor.scale.copy(rec.anchor.scale); syncRecipeInstances(); select(id);
  };
  ui.host.querySelector('[data-action=road]').onclick = () => {
    roadDrawing = !roadDrawing; roadPoints = [];
    placeAssetId = null; updatePaletteUi();
    ui.roadStatus.textContent = roadDrawing ? 'ROAD drawing · click terrain control points, then Finish ROAD.' : 'ROAD drawing cancelled.';
  };
  ui.host.querySelector('[data-action=finish-road]').onclick = finishRoad;
  ui.host.querySelector('[data-action=save]').onclick = () => {
    syncRecipeInstances(); recipe.base.authoringMode = authorMode; recipe.base.locomotionMode = bridge.mode; saveRecipe(recipe);
    ui.status.textContent = `Saved · ${recipe.instances.length} instances · ${recipe.splines.length} spline(s)`;
  };
  ui.host.querySelector('[data-action=reload]').onclick = () => location.reload();
  ui.host.querySelector('[data-action=export]').onclick = () => { syncRecipeInstances(); exportRecipe(recipe); ui.status.textContent = 'Exported World Recipe JSON'; };
  ui.host.querySelector('[data-action=import]').onclick = () => ui.file.click();
  ui.file.onchange = async () => {
    const file = ui.file.files && ui.file.files[0]; if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const found = [];
      (function walk(x) {
        if (!x || typeof x !== 'object') return;
        const path = typeof x.path === 'string' && /\.(glb|gltf)$/i.test(x.path) ? x.path : null;
        const url = typeof x.ghUrl === 'string' ? x.ghUrl : (typeof x.rawPinned === 'string' ? x.rawPinned : null);
        if (path || url) found.push({ path, url, name: x.name || x.label || (path && path.split('/').pop()) || 'Candidate' });
        for (const v of Object.values(x)) if (v && typeof v === 'object') walk(v);
      })(parsed);
      let n = 0;
      for (const f of found) {
        const id = `candidate-${n++}-${(f.name || 'asset').replace(/\W+/g,'-').toLowerCase()}`;
        if (palette.has(id)) continue;
        palette.set(id, { id, label: `Candidate · ${f.name}`, kind: 'prop', path: f.path, url: f.url || raw(f.path), pin: f.url ? null : ASSET_PIN, targetHeight: BODY_HEIGHT, materialPreset: 'world-lambert' });
      }
      updatePaletteUi(); ui.status.textContent = `Imported candidate JSON · ${n} renderable path(s) found · still candidate-only until placed/tested`;
    } catch (error) { ui.status.textContent = 'Import failed · ' + error.message; }
    ui.file.value = '';
  };

  // Reload persistent authored state before entering the requested runtime mode.
  for (const entry of recipe.instances) {
    try { await createInstance(defFromRecipe(entry), null, entry); }
    catch (error) { console.warn('[wb0] recipe instance failed', entry.id, error); }
  }
  for (const spline of recipe.splines) renderRoad(spline);
  select(null);

  // Gate 0 starts in real Ground mode unless the saved recipe explicitly asks for Flight.
  setLocomotion(String(recipe.base.locomotionMode || 'GROUND').toUpperCase() === 'FLIGHT' ? 'FLIGHT' : 'GROUND');
  setAuthorMode(authorMode);
  updatePaletteUi();
  ui.status.textContent = `WB0 ready · ${recipe.instances.length} saved instances · ${recipe.splines.length} road(s) · ${bridge.report().activeMovementOwner}`;

  window.__wb0 = {
    schema: 'kfb.world-builder.wb0',
    status: 'IMPLEMENTATION_WIP_BROWSER_ACCEPTANCE_PENDING',
    recipe,
    ground,
    mode: bridge,
    instances,
    palette,
    save() { syncRecipeInstances(); return saveRecipe(recipe); },
    report() {
      return {
        authorMode, locomotionMode: bridge.mode, movement: bridge.report(),
        instances: recipe.instances.length, splines: recipe.splines.length,
        assetPin: ASSET_PIN, bodyHeight: BODY_HEIGHT,
      };
    },
  };
  console.info('[wb0] live authoring mounted', window.__wb0.report());
}

main().catch((error) => {
  console.error('[wb0] start failed', error);
  const root = document.getElementById('wb0-root');
  if (root) root.textContent = 'WB0 start failed · ' + (error && error.message ? error.message : String(error));
});
