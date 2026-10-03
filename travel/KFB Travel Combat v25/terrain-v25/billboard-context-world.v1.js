// KFB · BILLBOARD-CONTEXT-REAL-WORLD-01 · 2026-10-03
// Additive Travel-v25 consumer. Travel owns scene/renderer/camera/frame/zone placement.
// This module owns only one Billboard mount and reuses the proven Kenney + K2 + H13 donors.

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HERO_DONORS, loadHero } from '../../../tools/KFB-ToolBox/_handover/BILLBOARD_B2A_CSS3D_2026-09-24/bb-scene.js';
import * as K2 from '../../../tools/KFB-ToolBox/_handover/BILLBOARD_CONTEXT_R11_2026-10-02/worldlook-k2/clay-material.v10.js';
import { makeClayRelief } from '../../../tools/KFB-ToolBox/_handover/BILLBOARD_CONTEXT_R11_2026-10-02/worldlook-k2/clay-relief.v2.js';
import { makeToolReliefs } from '../../../tools/KFB-ToolBox/_handover/BILLBOARD_CONTEXT_R11_2026-10-02/worldlook-k2/clay-relief.v5.js';
import { TOOLMIX } from '../../../tools/KFB-ToolBox/_handover/BILLBOARD_CONTEXT_R11_2026-10-02/worldlook-k2/clay-toolmix.v1.js';
import { makeWorldContext } from './world-context.js';

const H13_URL = new URL(
  '../../../tools/KFB-ToolBox/_handover/BILLBOARD_CONTEXT_R11_2026-10-02/h13/KFB Billboard Kaleidoscope H13.dc.html',
  import.meta.url
).href;

const K2_PIN = Object.freeze({
  material: 'd994a9b656131be3b7a13d45edcb4253d34f3620',
  profiles: 'af57b88ae382a36514f9fa50beed5ab6ca18647a',
  reliefV2: '2bb843d29e9f2571f87d9e6210f34240b1a0a1a9',
  reliefV5: '1dfd171e08b14f996601189a7f2c108101f84132',
  toolmix: 'b9a039ccfb90ea04910db3cf05928817d92e9399'
});

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

export function createBillboardContextWorld(opts = {}) {
  const THREE = opts.THREE;
  const scene = opts.scene;
  const renderer = opts.renderer;
  const camera = opts.camera;
  const academy = opts.academy;
  const ring = opts.ring;
  const groundAt = opts.groundAt;
  const enabled = !!opts.enabled;
  const targetSpec = Object.assign({ packId: 'forget_utopia', n: 1 }, opts.target || {});

  const mount = new THREE.Group();
  mount.name = 'kfb-real-world-billboard-01';
  mount.visible = false;

  let hero = null;
  let targetCard = null;
  let h13Frame = null;
  let h13Canvas = null;
  let h13Texture = null;
  let clayU = null;
  let ready = false;
  let started = false;
  let disposed = false;
  let updates = 0;

  const report = {
    schema: 'kfb.billboard-context-real-world/0.1',
    enabled,
    ready: false,
    status: enabled ? 'WAITING' : 'DISABLED',
    target: { packId: targetSpec.packId, n: targetSpec.n, title: null },
    zone: null,
    worldContext: null,
    placement: null,
    owners: {
      renderer: 'Travel v25',
      scene: 'Travel v25',
      camera: 'Travel v25',
      frame: 'Travel createTravelManager',
      zone: 'Travel zone-ring',
      worldContext: 'Travel world-context',
      body: 'accepted Kenney Billboard + K2 v10',
      ambient: 'frozen H13'
    },
    body: {
      donor: HERO_DONORS[0].file,
      targetHeight: 4.2,
      meshes: 0,
      clayMaterials: 0,
      accent: null,
      seed: null,
      k2: K2_PIN
    },
    content: {
      mode: 'ambient-h13',
      h13Url: H13_URL,
      h13Ready: false,
      face: null
    },
    managerOwned: true,
    separateRenderer: false,
    separateCamera: false,
    separateRaf: false,
    updates: 0,
    errors: []
  };

  function apiSnapshot() {
    return JSON.parse(JSON.stringify(report));
  }

  function k2Texture(data, size) {
    const t = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.magFilter = THREE.LinearFilter;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.generateMipmaps = true;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    t.needsUpdate = true;
    return t;
  }

  function propProfile() {
    const WK = 3;
    const QUIET = { print: 0.3, dent: 0, gouge: 0, crack: 0, stroke: 1, facet: 0.9, crease: 0.5 };
    const p = { ...K2.PROFILES.prop, ...QUIET };
    p.scale *= WK;
    p.gougeSize *= WK;
    p.crackSize *= WK;
    p.dentSize *= WK;
    p.tools = TOOLMIX.vehicle;
    return p;
  }

  async function makeClayUniforms() {
    if (clayU) return clayU;
    const t0 = performance.now();
    const size = 1024;
    const rel = makeClayRelief({ size, seed: 31 });
    const relT = k2Texture(rel.data, rel.size);
    const tools = await makeToolReliefs({ size, seed: 41 });
    const U = K2.makeClayUniforms(THREE, relT);
    [U.uClayToolA.value, U.uClayToolB.value, U.uClayToolC.value] =
      tools.maps.map(d => k2Texture(d, tools.size));
    U.uClayToolOn.value = 1;
    U.uClayLegacyStroke.value = 0;
    U.uClayMottle.value = 0.04;
    U.uClayHand.value = 1.5;
    U.uClayTile.value = 4.8;
    U.uClayPrint.value = relT;
    U.uClayPrintOn.value = 0;
    U.uClayPrintTile.value = 13.5;
    U.uClayMacro.value = 0.5;
    U.uClayLodK.value = 0.6;
    U.uClayStroke.value = 0.7;
    report.body.clayBuildMs = Math.round(performance.now() - t0);
    clayU = U;
    return U;
  }

  function semanticCard(d) {
    return {
      cardNumber: d.n,
      cardName: d.title || '',
      power: d.power || '',
      lore: d.lore || '',
      grade: d.grade || 2,
      gradeReason: d.gradeReason || '',
      artworkPrompt: d.artworkPrompt || '',
      _role: d.role || d.deckRole || ''
    };
  }

  async function waitForTarget(timeoutMs = 120000) {
    const t0 = performance.now();
    while (performance.now() - t0 < timeoutMs) {
      const card = (academy.cards || []).find(c =>
        c?.data?.kind === 'kfbcard' &&
        c.data.packId === targetSpec.packId &&
        Number(c.data.n) === Number(targetSpec.n)
      );
      const zone = card && ring?.ready ? ring.zoneOf(card) : null;
      if (card && zone && card.data.title && card.data.title !== '…' && card.data.power) {
        return { card, zone };
      }
      await sleep(100);
    }
    throw new Error('real Travel Academy target did not become ready');
  }

  async function ensureH13() {
    if (h13Canvas?.isConnected) return h13Canvas;
    h13Frame = document.createElement('iframe');
    h13Frame.id = 'travel-real-world-h13-source';
    h13Frame.title = 'Frozen H13 source for Travel real-world billboard';
    h13Frame.src = H13_URL;
    h13Frame.style.cssText =
      'position:fixed;left:-1800px;top:0;width:1280px;height:900px;border:0;opacity:0;pointer-events:none;z-index:-1;';
    document.body.appendChild(h13Frame);

    const t0 = performance.now();
    while (performance.now() - t0 < 120000) {
      const w = h13Frame.contentWindow;
      const d = h13Frame.contentDocument;
      if (w && d && typeof w.__dcRootName === 'function' && typeof w.__dcSetProps === 'function') {
        const face = d.querySelector('canvas[width="1024"][height="512"]');
        if (face) {
          const root = w.__dcRootName();
          w.__dcSetProps(root, { palSource: 'CARDS', kfbShare: 0.65 });
          h13Canvas = face;
          report.content.h13Ready = true;
          report.content.rootName = root;
          report.content.face = { width: face.width, height: face.height };
          return face;
        }
      }
      await sleep(100);
    }
    throw new Error('H13 1024x512 face unavailable');
  }

  function syncPlacement() {
    if (!targetCard || !hero) return;
    const p = new THREE.Vector3();
    targetCard.holder.getWorldPosition(p);
    const y = typeof groundAt === 'function' ? groundAt(p.x, p.z) : p.y;
    mount.position.set(p.x, y + 0.03, p.z);

    const center = academy.center || null;
    if (center && Number.isFinite(center.x) && Number.isFinite(center.z)) {
      const dx = center.x - p.x, dz = center.z - p.z;
      if (Math.abs(dx) + Math.abs(dz) > 0.001) mount.rotation.y = Math.atan2(dx, dz);
    }

    report.placement = {
      cardWorld: [p.x, p.y, p.z].map(v => +v.toFixed(3)),
      billboardWorld: [mount.position.x, mount.position.y, mount.position.z].map(v => +v.toFixed(3)),
      groundY: +y.toFixed(3),
      facesAcademyCenter: !!center
    };
  }

  async function buildBody(accent, seed) {
    const U = await makeClayUniforms();
    const profile = propProfile();
    let meshes = 0, materials = 0, i = 0;
    hero.model.traverse(o => {
      if (!o.isMesh || !o.material) return;
      meshes++;
      if (!o.userData.billboardWorldSourceMaterial) o.userData.billboardWorldSourceMaterial = o.material;
      if (!o.userData.billboardWorldSeededGeometry) {
        o.geometry = K2.seedGeometry(THREE, o.geometry.clone(), seed + i * 131);
        o.userData.billboardWorldSeededGeometry = true;
      }
      i++;
      const src = o.userData.billboardWorldSourceMaterial;
      const srcList = Array.isArray(src) ? src : [src];
      const out = srcList.map(m => {
        if (!m) return m;
        const cm = K2.makeClayMaterial(THREE, U, { src: m, color: accent, profile, objSize: 0 });
        cm.userData.worldContextAccent = accent;
        cm.userData.worldContextSeed = seed;
        materials++;
        return cm;
      });
      o.material = Array.isArray(src) ? out : out[0];
    });
    report.body.meshes = meshes;
    report.body.clayMaterials = materials;
    report.body.accent = String(accent).toLowerCase();
    report.body.seed = seed;
  }

  async function start() {
    if (!enabled || started) return api;
    started = true;
    report.status = 'STARTING';
    try {
      const target = await waitForTarget();
      targetCard = target.card;
      const zone = target.zone;
      const card = semanticCard(targetCard.data);
      const localWorld = makeWorldContext({
        cardTriplet: { current: card },
        storyMode: zone.mode,
        seeds: [String(zone.seed), targetSpec.packId, String(targetSpec.n), 'billboard-real-world-01']
      });

      report.target.title = targetCard.data.title;
      report.target.role = targetCard.data.role || null;
      report.zone = { ...zone };
      report.worldContext = {
        storyMode: localWorld.storyMode,
        biome: localWorld.biome,
        accent: localWorld.accent,
        palette: localWorld.palette,
        seed: localWorld.seed,
        audio: localWorld.audio
      };

      hero = await loadHero(GLTFLoader, HERO_DONORS[0].file, 4.2);

      // Same accepted B0/B1 source-normalization step, nested under a Travel-owned world mount.
      const box0 = new THREE.Box3().setFromObject(hero.group);
      const c0 = box0.getCenter(new THREE.Vector3());
      hero.group.position.x -= c0.x;
      hero.group.position.z -= c0.z;
      hero.group.position.y -= box0.min.y;
      mount.add(hero.group);
      scene.add(mount);

      await buildBody(localWorld.accent, localWorld.seed);

      const face = await ensureH13();
      h13Texture = new THREE.CanvasTexture(face);
      h13Texture.colorSpace = THREE.SRGBColorSpace;
      h13Texture.needsUpdate = true;
      hero.panel.userData.billboardWorldSourceMaterial = hero.panel.material;
      hero.panel.material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        map: h13Texture,
        toneMapped: false
      });

      syncPlacement();
      mount.visible = true;
      ready = true;
      report.ready = true;
      report.status = 'READY';
      report.face = {
        panelW: +hero.panelW.toFixed(4),
        panelH: +hero.panelH.toFixed(4),
        aspect: +(hero.panelW / hero.panelH).toFixed(4)
      };
      report.sameTravelScene = mount.parent === scene;
      report.sameTravelCamera = !!camera;
      report.separateRenderer = false;
      report.separateCamera = false;
      report.separateRaf = false;
      return api;
    } catch (e) {
      report.status = 'FAILED';
      report.errors.push(String(e?.stack || e));
      console.error('[billboard-real-world-01]', e);
      throw e;
    }
  }

  function update() {
    if (!enabled || !ready || disposed) return;
    updates++;
    report.updates = updates;
    syncPlacement();
    if (h13Texture) h13Texture.needsUpdate = true;
  }

  function dispose() {
    disposed = true;
    mount.removeFromParent();
    h13Texture?.dispose();
    h13Frame?.remove();
    report.status = 'DISPOSED';
  }

  const api = {
    name: 'billboard-context-real-world-01',
    enabled,
    group: mount,
    get targetCard() { return targetCard; },
    get ready() { return ready; },
    get report() { return report; },
    start,
    update,
    dispose,
    snapshot: apiSnapshot
  };
  return api;
}
