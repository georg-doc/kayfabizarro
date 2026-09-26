/* KFB Resident Atlas host environment · ENV-PREVIEW-01 consumer.
   The Atlas keeps the host seam; current World/Travel presentation is supplied by the shared
   adapter. Residents still own neither sky, terrain nor a mandatory baseplate. */
import * as THREE from 'three';
import { mountEnvironmentPreview } from '../../environment-preview.v1.js';

export const ENV_SCHEMA = 'kfb.resident-host-env/2';

function presetForTime(t) {
  const h = ((+t % 24) + 24) % 24;
  if (h < 6 || h >= 20.5) return 'world.night';
  if (h < 8 || h >= 16.5) return 'world.evening';
  return 'world.day';
}

function label(t) {
  const h = ((+t % 24) + 24) % 24;
  return h < 5 || h >= 21 ? 'Nacht' : h < 8 ? 'Morgen' : h < 16.5 ? 'Tag' : h < 19.5 ? 'Abendsonne' : 'Dämmerung';
}

export function mountHostEnv(V, { time = 14, on = true } = {}) {
  let hour = ((+time % 24) + 24) % 24;
  const hostSupport = [];
  V.scene.traverse((o) => {
    if (o && o.isMesh && o.material && o.material.isShadowMaterial) hostSupport.push(o);
  });

  const shared = mountEnvironmentPreview({
    THREE,
    host: { scene: V.scene, camera: V.camera, renderer: V.renderer },
    mode: on ? 'WORLD_MATCH' : 'SOURCE_ISOLATION',
    preset: presetForTime(hour),
    support: 'ground',
    hostSupport,
    groundSize: 160,
    debugName: 'Resident Atlas S40'
  });

  const api = {
    schema: ENV_SCHEMA,
    setOn(next) {
      shared.setMode(next ? 'WORLD_MATCH' : 'SOURCE_ISOLATION', presetForTime(hour));
      return api.state();
    },
    setTime(h) {
      hour = ((+h % 24) + 24) % 24;
      if (shared.mode !== 'SOURCE_ISOLATION') shared.applyPreset(presetForTime(hour));
      return api.state();
    },
    get on() { return shared.mode !== 'SOURCE_ISOLATION'; },
    state() {
      return {
        schema: ENV_SCHEMA,
        on: api.on,
        time: +hour.toFixed(2),
        label: label(hour),
        environment: shared.resolveProfile()
      };
    },
    post() { shared.update(); },
    probe() { return shared.probe(); },
    dispose() { shared.dispose(); }
  };

  V.post.add(() => api.post());
  return api;
}
