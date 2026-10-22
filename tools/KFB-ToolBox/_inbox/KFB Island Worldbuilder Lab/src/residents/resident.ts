// Residents after the KFB Resident Atlas (R2, S17): NoEyes KayKit character + KFB Eye-Rig v6 on the baked eye anchors,
// clay K2 material + K1 form on the skin (eyes excluded), one clip from the shared KayKit Rig_Medium library,
// optional prop in a hand slot and optional seat on a building (Atlas: hand / sitOn).
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
// @ts-ignore – Atlas donor, plain JS
import { mountAnchoredEyes } from './anchored-eyes.v1.js';
import { softenSkinned } from './soften-skinned';
import { claySeed, clayMaterial } from '../clay';
import type { ResidentSpec } from '../island/spec';

const loader = new GLTFLoader();
const FIG = new Map<string, Promise<THREE.Object3D>>();
const SOFT = new WeakMap<THREE.BufferGeometry, THREE.BufferGeometry>();
let CLIPS: Promise<THREE.AnimationClip[]> | null = null;

/** KayKit Rig_Medium clip library (General: Idle_A/B, Interact … · Simulation: Waving, Sit_Chair_Idle … · MovementBasic: Walking_A …). */
export function loadClips(): Promise<THREE.AnimationClip[]> {
  CLIPS ??= Promise.all(['General', 'Simulation', 'MovementBasic'].map((s) => loader.loadAsync(`/assets/kaykit/anims/Rig_Medium_${s}.glb`))).then((gs) => gs.flatMap((g) => g.animations));
  return CLIPS;
}

function figure(asset: string): Promise<THREE.Object3D> {
  let p = FIG.get(asset);
  if (!p) { p = loader.loadAsync('/assets/kaykit/' + asset).then((g) => g.scene); FIG.set(asset, p); }
  return p;
}

export interface LiveResident {
  obj: THREE.Object3D;
  mixer: THREE.AnimationMixer | null;
  eyes: { update(dt: number): void; dispose?(): void } | null;
  update(dt: number): void;
}

export { FIG_SCALE } from '../scale';
import { FIG_SCALE } from '../scale';

export async function buildResident(r: ResidentSpec): Promise<LiveResident> {
  const src = await figure(r.asset);
  const obj = SkeletonUtils.clone(src);
  obj.userData.residentId = r.id;
  // clay on the skin: K1 form (Taubin, face islands kept) + K2 material; every mesh casts a shadow
  obj.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    m.castShadow = m.receiveShadow = true;
    if ((m as THREE.SkinnedMesh).isSkinnedMesh) {
      let g = SOFT.get(m.geometry);
      if (!g) { g = softenSkinned(m.geometry) as THREE.BufferGeometry; claySeed(g, 5); SOFT.set(m.geometry, g); }
      m.geometry = g;
    } else claySeed(m.geometry, 5);
    m.material = clayMaterial('model', m.material as THREE.MeshStandardMaterial);
  });
  obj.scale.setScalar(FIG_SCALE);
  // KFB Eye-Rig v6 on the anchors baked into the NoEyes file (lids in the measured skin colour)
  let eyes: LiveResident['eyes'] = null;
  if (r.eyes) {
    obj.updateMatrixWorld(true);
    const res: any = (mountAnchoredEyes as any)({ THREE, figure: obj, skin: r.eyes });
    if (res.status === 'OK') eyes = res;
    else console.warn('[resident] eye rig', r.id, res.reason);
  }
  // animation
  let mixer: THREE.AnimationMixer | null = null;
  const clips = await loadClips();
  const clip = clips.find((c) => c.name === r.anim) ?? clips.find((c) => c.name === 'Idle_A');
  if (clip) {
    mixer = new THREE.AnimationMixer(obj);
    const act = mixer.clipAction(clip);
    act.play();
    if (r.freeze !== undefined) { act.time = r.freeze * clip.duration; act.paused = true; mixer.update(0); }
    else act.time = Math.random() * clip.duration;
  }
  // prop in a hand slot (Atlas `hand`: identity transform on the slot bone)
  if (r.hand) {
    const bone = obj.getObjectByName(r.hand.bone);
    if (bone) {
      const g = await loader.loadAsync('/assets/kaykit/' + r.hand.asset);
      const prop = g.scene;
      prop.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { claySeed(m.geometry, 6); m.material = clayMaterial('model', m.material as THREE.MeshStandardMaterial); m.castShadow = true; } });
      bone.add(prop);
    } else console.warn('[resident] no bone', r.hand.bone);
  }
  return {
    obj, mixer, eyes,
    update(dt: number) { mixer?.update(dt); eyes?.update(dt); },
  };
}
