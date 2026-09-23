import * as THREE from 'three';
import { ENVIRONMENTS, WHACKMAN_DUSK_CANDIDATE, selectNearestSources, torchIntensityAt, resolveLocalVisibility } from './profile-core.mjs';

function glowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,214,150,0.92)');
  grad.addColorStop(0.28, 'rgba(255,150,54,0.34)');
  grad.addColorStop(1, 'rgba(255,120,40,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export function createEnvironmentRig({ scene, renderer }) {
  const root = new THREE.Group();
  root.name = 'kfb:environment-profile/1';
  scene.add(root);

  const hemi = new THREE.HemisphereLight(0xffffff, 0x333333, 1);
  const key = new THREE.DirectionalLight(0xffffff, 1);
  key.castShadow = true;
  key.shadow.mapSize.set(1536, 1536);
  key.shadow.bias = -0.0008;
  key.shadow.normalBias = 0.02;
  key.position.set(-6, 10, 7);
  key.target.position.set(0, 0, 0);
  const fill = new THREE.DirectionalLight(0xffffff, 0.2);
  fill.position.set(5, 5, -6);
  const local = new THREE.PointLight(0xffe9c8, 0, 26, 1.6);
  root.add(hemi, key, key.target, fill, local);

  const maxPool = WHACKMAN_DUSK_CANDIDATE.torch.poolMax;
  const pool = Array.from({ length: maxPool }, (_, index) => {
    const t = WHACKMAN_DUSK_CANDIDATE.torch;
    const light = new THREE.PointLight(t.color, t.intensity, t.range, t.decay);
    light.visible = false;
    light.userData.poolIndex = index;
    root.add(light);
    return light;
  });

  const tex = glowTexture();
  const sourceGlows = [];
  let sources = [];
  let focus = new THREE.Vector3();
  let mode = 'DUSK';
  let torchesEnabled = true;
  let localAmount = 0;
  let flickerAmount = 1;

  function clearGlows() {
    for (const sprite of sourceGlows.splice(0)) {
      sprite.parent?.remove(sprite);
      sprite.material.dispose();
    }
  }

  function setTorchSources(nextSources) {
    clearGlows();
    sources = nextSources.map((point, index) => ({
      x: point.x, y: point.y, z: point.z, index,
      vector: point.clone ? point.clone() : new THREE.Vector3(point.x, point.y, point.z)
    }));
    for (const source of sources) {
      const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
        map: tex, color: 0xffffff, blending: THREE.AdditiveBlending,
        transparent: true, depthWrite: false, fog: false
      }));
      sprite.position.copy(source.vector);
      sprite.scale.setScalar(0.7);
      sprite.userData.phase = source.index * 1.31;
      root.add(sprite);
      sourceGlows.push(sprite);
    }
  }

  function applyWorld() {
    const profile = ENVIRONMENTS[mode] || WHACKMAN_DUSK_CANDIDATE;
    scene.background = new THREE.Color(profile.background);
    scene.fog = profile.fog.type === 'exp2' ? new THREE.FogExp2(profile.background, profile.fog.density) : null;
    hemi.color.set(profile.world.hemiSky);
    hemi.groundColor.set(profile.world.hemiGround);
    hemi.intensity = profile.world.hemiIntensity;
    key.color.set(profile.world.keyColor);
    key.intensity = profile.world.keyIntensity;
    fill.color.set(profile.world.fillColor);
    fill.intensity = profile.world.fillIntensity;
    renderer.toneMapping = profile.toneMapping === 'aces-filmic' ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
    renderer.toneMappingExposure = profile.exposure;
    const localState = resolveLocalVisibility(profile, localAmount);
    local.color.set(localState.color);
    local.intensity = localState.intensity;
    local.distance = localState.range;
    local.decay = localState.decay;
    local.position.copy(focus);
  }

  function assignPool(timeSec = 0) {
    const profile = ENVIRONMENTS[mode] || WHACKMAN_DUSK_CANDIDATE;
    const selected = torchesEnabled ? selectNearestSources(sources, focus, profile.torch.poolMax) : [];
    for (let i = 0; i < pool.length; i++) {
      const light = pool[i];
      const hit = selected[i];
      if (!hit) { light.visible = false; continue; }
      const source = sources[hit.index];
      light.visible = true;
      light.position.copy(source.vector);
      light.color.set(profile.torch.color);
      light.distance = profile.torch.range;
      light.decay = profile.torch.decay;
      light.intensity = torchIntensityAt(profile, timeSec, i, flickerAmount);
    }
    for (let i = 0; i < sourceGlows.length; i++) {
      const sprite = sourceGlows[i];
      sprite.visible = torchesEnabled;
      const ph = sprite.userData.phase;
      const pulse = 0.86 + 0.09 * Math.sin(timeSec * 12.1 + ph) + 0.05 * Math.sin(timeSec * 7.3 + ph * 1.9);
      sprite.scale.setScalar(0.7 * pulse);
      sprite.material.opacity = pulse;
    }
    return selected;
  }

  function setEnvironment(nextMode) { mode = nextMode === 'DAY' ? 'DAY' : 'DUSK'; applyWorld(); }
  function setTorchEnabled(value) { torchesEnabled = Boolean(value); assignPool(0); }
  function setLocalVisibility(value) { localAmount = Math.max(0, Math.min(1, Number(value) || 0)); applyWorld(); }
  function setFlicker(value) { flickerAmount = Math.max(0, Math.min(1, Number(value) || 0)); }
  function setFocus(point) { focus.copy(point); local.position.copy(focus); }
  function setVisible(value) { root.visible = Boolean(value); }
  function update(timeSec) { return assignPool(timeSec); }
  function snapshot() {
    return {
      mode,
      torchesEnabled,
      activePool: pool.filter((l) => l.visible).length,
      poolMax: pool.length,
      sourceCount: sources.length,
      localVisibility: localAmount,
      fogType: scene.fog?.isFogExp2 ? 'FogExp2' : 'none',
      fogDensity: scene.fog?.density ?? 0,
      profile: (ENVIRONMENTS[mode] || WHACKMAN_DUSK_CANDIDATE).id
    };
  }

  applyWorld();
  return { root, setTorchSources, setEnvironment, setTorchEnabled, setLocalVisibility, setFlicker, setFocus, setVisible, update, snapshot, pool, local };
}
