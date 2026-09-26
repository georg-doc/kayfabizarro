/* KFB Shared Environment Preview Host · ENV-PREVIEW-01
   Thin presentation adapter only. The receiving host owns renderer, scene, camera, clock,
   gameplay/movement, animation/editing and persistence.

   Current presentation owner:
   georg-doc/KFB-Travel-Globe@8614282aab2ced43bb5dda9fcf7abadf9768100a

   The public mirror modules below are byte/source-pinned mirrors of the current Travel
   presentation sources. This adapter references them; it does not copy another sky/world stack.
*/
import {
  getSkyPreset,
  paintRadialSky,
  buildLightRig
} from '../../../travel/wip/travel_globe_wsa/globe-v13/sky-presets.js';

export const ENV_PREVIEW_SCHEMA = 'kfb.environment-preview/0.1-candidate';

export const WORLD_CURRENT = Object.freeze({
  id: 'world.current',
  provider: 'travel-world-presentation',
  sourceRepo: 'georg-doc/KFB-Travel-Globe',
  sourceHead: '8614282aab2ced43bb5dda9fcf7abadf9768100a',
  mirrorRepo: 'georg-doc/kayfabizarro',
  sources: {
    skyPresets: {
      path: 'travel/wip/travel_globe_wsa/globe-v13/sky-presets.js',
      blob: '04dd730ee735f064888e8472eff79583f17bebb0'
    },
    worldMood: {
      path: 'travel/wip/travel_globe_wsa/globe-v13/weltstimmungen.js',
      blob: '2747a526e2aa38989c9c4052304da8733662b61c'
    },
    terrainSurface: {
      path: 'travel/wip/travel_globe_wsa/globe-v13/terrain-surface.js',
      blob: '9513347b6e3192dfefbeb3371085b13ac41ebb5d'
    },
    biomeField: {
      path: 'travel/wip/travel_globe_wsa/globe-v13/globe-biome.js',
      blob: 'db3acf6ae6b7ebbc6cb4a7113a0d0fe782429d74'
    }
  }
});

const MODES = new Set(['WORLD_MATCH', 'SOURCE_ISOLATION', 'CONSUMER_PRESET']);
const PRESETS = Object.freeze({
  'world.current': 'day',
  'world.day': 'day',
  'world.evening': 'evening',
  'world.night': 'night'
});

function captureScene(scene, renderer, hostSupport) {
  const lights = [];
  scene.traverse((o) => {
    if (o && o.isLight) lights.push({ o, visible: o.visible });
  });
  return {
    background: scene.background,
    environment: scene.environment,
    fog: scene.fog,
    lights,
    toneMapping: renderer ? renderer.toneMapping : undefined,
    toneMappingExposure: renderer ? renderer.toneMappingExposure : undefined,
    support: (hostSupport || []).map((o) => ({
      o,
      visible: o.visible,
      color: o.material && o.material.color ? o.material.color.clone() : null,
      opacity: o.material && typeof o.material.opacity === 'number' ? o.material.opacity : null
    }))
  };
}

function restoreScene(snapshot, scene, renderer) {
  if (!snapshot) return;
  scene.background = snapshot.background;
  scene.environment = snapshot.environment;
  scene.fog = snapshot.fog;
  for (const x of snapshot.lights) x.o.visible = x.visible;
  for (const x of snapshot.support) {
    x.o.visible = x.visible;
    if (x.color && x.o.material && x.o.material.color) x.o.material.color.copy(x.color);
    if (x.opacity != null && x.o.material) x.o.material.opacity = x.opacity;
  }
  if (renderer && snapshot.toneMapping !== undefined) renderer.toneMapping = snapshot.toneMapping;
  if (renderer && snapshot.toneMappingExposure !== undefined) renderer.toneMappingExposure = snapshot.toneMappingExposure;
}

function removeRig(rig) {
  if (!rig) return;
  for (const o of Object.values(rig)) {
    if (!o) continue;
    if (o.parent) o.parent.remove(o);
    if (o.target && o.target.parent) o.target.parent.remove(o.target);
  }
}

function makeGround(THREE, preset, size) {
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(preset.hemiGroundColor),
    roughness: 1,
    metalness: 0
  });
  const ground = new THREE.Mesh(new THREE.CircleGeometry(size, 96), material);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.002;
  ground.receiveShadow = true;
  ground.name = 'KFB Environment Preview · visible ground support';
  ground.userData.kfbEnvironmentSupport = 'ground';
  return ground;
}

function resolvePreset(requested) {
  return PRESETS[requested] || PRESETS['world.current'];
}

export function mountEnvironmentPreview({
  THREE,
  host,
  mode = 'WORLD_MATCH',
  preset = 'world.current',
  support = 'ground',
  hostSupport = [],
  supportProvider = null,
  groundSize = 120,
  debugName = 'KFB 3D preview'
} = {}) {
  if (!THREE) throw new Error('ENV-PREVIEW-01 requires the host THREE instance.');
  if (!host || !host.scene || !host.camera) throw new Error('ENV-PREVIEW-01 requires host.scene and host.camera.');
  if (!MODES.has(mode)) throw new Error('Unknown environment mode: ' + mode);
  if (!['ground', 'terrainPatch', 'worldZone'].includes(support)) throw new Error('Unknown support level: ' + support);
  if (support !== 'ground' && !supportProvider) {
    throw new Error(support + ' requires a real host supportProvider; ENV-PREVIEW will not fake terrain/world zones.');
  }

  const scene = host.scene;
  const camera = host.camera;
  const renderer = host.renderer || null;
  const snapshot = captureScene(scene, renderer, hostSupport);

  let activeMode = null;
  let requestedPreset = preset;
  let resolvedPreset = null;
  let rig = null;
  let skyTexture = null;
  let ground = null;
  let delegatedSupport = null;
  let disposed = false;

  function resolveProfile() {
    const sourceIsolation = activeMode === 'SOURCE_ISOLATION';
    return {
      schema: ENV_PREVIEW_SCHEMA,
      requestedMode: activeMode || mode,
      requestedPreset,
      resolvedPreset: sourceIsolation ? 'host.source-isolation' : (resolvedPreset || resolvePreset(requestedPreset)),
      support,
      provider: sourceIsolation ? 'host-source-isolation' : WORLD_CURRENT.provider,
      sourceRepo: sourceIsolation ? null : WORLD_CURRENT.sourceRepo,
      sourceHead: sourceIsolation ? null : WORLD_CURRENT.sourceHead,
      mirrorRepo: sourceIsolation ? null : WORLD_CURRENT.mirrorRepo,
      sources: sourceIsolation ? null : WORLD_CURRENT.sources,
      consumer: debugName
    };
  }

  function clearWorld() {
    removeRig(rig);
    rig = null;

    if (skyTexture && skyTexture.dispose) skyTexture.dispose();
    skyTexture = null;

    if (ground) {
      if (ground.parent) ground.parent.remove(ground);
      if (ground.geometry) ground.geometry.dispose();
      if (ground.material) ground.material.dispose();
      ground = null;
    }

    if (delegatedSupport && supportProvider && typeof supportProvider.dispose === 'function') {
      supportProvider.dispose(delegatedSupport);
      delegatedSupport = null;
    }

    restoreScene(snapshot, scene, renderer);
  }

  function mountSupport(p) {
    for (const x of snapshot.support) x.o.visible = false;

    if (support === 'ground') {
      ground = makeGround(THREE, p, groundSize);
      scene.add(ground);
      return;
    }

    delegatedSupport = supportProvider.mount({
      THREE,
      host,
      level: support,
      requestedPreset,
      resolvedProfile: resolveProfile()
    });
  }

  function mountWorld() {
    const key = resolvePreset(requestedPreset);
    resolvedPreset = key;
    const p = getSkyPreset(key);

    for (const x of snapshot.lights) x.o.visible = false;
    rig = buildLightRig(THREE, scene, p);

    skyTexture = paintRadialSky(THREE, p, 512);
    scene.background = skyTexture;
    scene.fog = new THREE.Fog(p.fogColor, p.fogNear, p.fogFar);

    if (renderer) {
      if ('ACESFilmicToneMapping' in THREE) renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
    }

    mountSupport(p);
  }

  function apply(nextMode, nextPreset) {
    if (disposed) throw new Error('ENV-PREVIEW-01 adapter is disposed.');
    const m = nextMode || activeMode || mode;
    if (!MODES.has(m)) throw new Error('Unknown environment mode: ' + m);

    clearWorld();
    activeMode = m;
    requestedPreset = nextPreset || requestedPreset || 'world.current';
    resolvedPreset = null;

    if (activeMode !== 'SOURCE_ISOLATION') mountWorld();
    return state();
  }

  function update() {
    if (disposed || activeMode === 'SOURCE_ISOLATION' || !rig) return;
    if (rig.petFill && camera) {
      rig.petFill.position.copy(camera.position);
      if (rig.petFill.target) rig.petFill.target.position.set(0, 0.8, 0);
    }
  }

  function state() {
    return {
      ...resolveProfile(),
      active: !disposed,
      delegatedSupport: !!delegatedSupport
    };
  }

  function dispose() {
    if (disposed) return;
    clearWorld();
    disposed = true;
  }

  const api = {
    schema: ENV_PREVIEW_SCHEMA,
    setMode(nextMode, nextPreset) { return apply(nextMode, nextPreset); },
    applyPreset(nextPreset) { return apply(activeMode || mode, nextPreset); },
    update,
    probe: state,
    resolveProfile,
    dispose,
    get mode() { return activeMode; },
    get preset() { return requestedPreset; },
    get support() { return support; }
  };

  apply(mode, preset);
  return api;
}
