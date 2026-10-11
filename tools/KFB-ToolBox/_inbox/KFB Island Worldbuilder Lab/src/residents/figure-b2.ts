// B2 Figuren-Auswahl (Steuerung 11.10.): every figure of the catalogue (public/assets/figures-b2/catalog.json, built by
// tools/b2/build-catalog.py) as a playable figure. Build as the Resident Atlas: clay class `figure` (= RA2 `fine`) + K1 form on
// the skin, never scaled beyond FIG_SCALE (V-060). Eyes per catalogue entry — rule (vorläufig): the NEWER Georg acceptance wins:
//   anchored  EYE-CLEANUP-01 (PASS 01.10.) / -02 (Kandidat): NoEyes file + eye_anchorl/r, lid = that figure's measured skin
//   dxdy      rig-large-reviewed.v1.json (Georg 20.09.): original GLB + mountBatchEyes (RA1 lib/frizzlegraft, vendored 1:1)
//   original / own   the model's own eyes (no rig)
// Clips: Rig_Medium or Rig_Large set (KayKit 1.1, same names); Legacy = its embedded clips mapped onto the role names, or none.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
// @ts-ignore – Atlas donor, plain JS
import { mountAnchoredEyes } from './anchored-eyes.v1.js';
// @ts-ignore – Atlas donor (RA1 lib/frizzlegraft/batch-eyes.v1.js), plain JS, unchanged
import { mountBatchEyes } from './batch-eyes.v1.js';
import { softenSkinned } from './soften-skinned';
import { claySeed, clayMaterial } from '../clay';
import { FIG_SCALE } from '../scale';

export interface FigureEntry {
  id: string; label: string; group: 'A' | 'B' | 'C' | 'D' | 'E'; rig: 'Medium' | 'Large' | 'Legacy'; glb: string;
  eyes: { mode: 'anchored' | 'dxdy' | 'original' | 'own'; source: string; skin?: string; profile?: string };
  status: string; skin: string | null; variants: string[]; bindTexture?: boolean; note?: string | null;
}
export const GROUPS: Record<FigureEntry['group'], string> = {
  A: 'EYE-CLEANUP-01 · Georg PASS', B: 'Large dx/dy · Georg 20.09. (vorläufig)', C: 'EYE-CLEANUP-02 · Kandidat', D: 'Original-Augen', E: 'FrizzleBob',
};

const loader = new GLTFLoader();
const BASE = '/assets/';
let CAT: Promise<FigureEntry[]> | null = null;
export const loadFigureCatalog = () => (CAT ??= fetch(BASE + 'figures-b2/catalog.json').then((r) => r.json()).then((j) => j.figures as FigureEntry[]));
let PROF: Promise<Map<string, any>> | null = null;
const dxdyProfiles = () => (PROF ??= fetch(BASE + 'figures-b2/eye-profiles/rig-large-reviewed.v1.json').then((r) => r.json()).then((j) => new Map((j.profiles as any[]).map((p) => [p.actorId, p]))));

const SETS: Record<string, Promise<THREE.AnimationClip[]>> = {};
/** KayKit 1.1 clip set per rig (Medium: General · Simulation · MovementBasic; Large: General · Simulation · MovementBasic) */
export function rigClips(rig: 'Medium' | 'Large'): Promise<THREE.AnimationClip[]> {
  return (SETS[rig] ??= Promise.all(['General', 'Simulation', 'MovementBasic'].map((s) => loader.loadAsync(`${BASE}kaykit/anims/Rig_${rig}_${s}.glb`))).then((gs) => gs.flatMap((g) => g.animations)));
}
/** Legacy (KayKit Animated Character v1.2) embedded clips → role clip names */
const LEGACY_MAP: Record<string, string> = { Idle: 'Idle_A', Walk: 'Walking_A', Run: 'Running_A', Jump: 'Jump_Full_Short' };

const SRC = new Map<string, Promise<any>>();
const TEX = new Map<string, Promise<THREE.Texture>>();
const SOFT = new WeakMap<THREE.BufferGeometry, THREE.BufferGeometry>();
const tex = (url: string) => {
  let p = TEX.get(url);
  // GLTF convention: flipY false, sRGB (the KayKit atlases are authored for the glTF UV origin)
  if (!p) { p = new THREE.TextureLoader().loadAsync(BASE + url).then((t) => { t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; return t; }); TEX.set(url, p); }
  return p;
};
const eyeMesh = (o: THREE.Object3D) => { for (let x: THREE.Object3D | null = o; x; x = x.parent) if (x.userData.eyeRig || /^FB_Eye/.test(x.name)) return true; return false; };

export interface PlayableFigure {
  entry: FigureEntry; obj: THREE.Object3D; mixer: THREE.AnimationMixer; clips: THREE.AnimationClip[];
  eyes: { update(dt: number): void; dispose?(): void } | null; eyeReport: any; variant: number;
  feet: { l: THREE.Object3D; r: THREE.Object3D } | null; hips: THREE.Object3D | null;
  setVariant(i: number): Promise<void>; update(dt: number): void; dispose(): void;
}

export async function buildPlayable(e: FigureEntry, variant = 0): Promise<PlayableFigure> {
  let sp = SRC.get(e.glb); if (!sp) { sp = loader.loadAsync(BASE + e.glb); SRC.set(e.glb, sp); }
  const gl = await sp;
  const obj = SkeletonUtils.clone(gl.scene); obj.userData.figureId = e.id;
  // clay on every mesh of the figure (RA2: skinned meshes → `fine`; the rigid parts of a figure ride with it), K1 form on skins
  obj.traverse((o) => {
    const m = o as THREE.Mesh; if (!m.isMesh) return;
    m.castShadow = m.receiveShadow = true;
    if ((m as THREE.SkinnedMesh).isSkinnedMesh) { let g = SOFT.get(m.geometry); if (!g) { g = softenSkinned(m.geometry) as THREE.BufferGeometry; claySeed(g, 5); SOFT.set(m.geometry, g); } m.geometry = g; }
    else claySeed(m.geometry, 5);
    m.material = clayMaterial('figure', m.material as THREE.MeshStandardMaterial);
  });
  obj.scale.setScalar(FIG_SCALE);
  obj.updateMatrixWorld(true);
  // eyes
  let eyes: PlayableFigure['eyes'] = null, eyeReport: any = { mode: e.eyes.mode, source: e.eyes.source };
  if (e.eyes.mode === 'anchored') {
    const r: any = (mountAnchoredEyes as any)({ THREE, figure: obj, skin: e.eyes.skin ?? e.skin });
    eyeReport = { ...eyeReport, status: r.status, lid: r.skin ?? null, reason: r.reason };
    if (r.status === 'OK') eyes = r;
  } else if (e.eyes.mode === 'dxdy') {
    const prof = (await dxdyProfiles()).get(e.eyes.profile!);
    const r: any = prof ? (mountBatchEyes as any)({ THREE, figure: obj, profile: prof }) : { status: 'UNSUPPORTED', reason: 'kein Profil ' + e.eyes.profile };
    eyeReport = { ...eyeReport, status: r.status, lid: r.lid ?? null, lidSource: r.lidSource, removed: r.removed, reason: r.reason, reviewState: r.reviewState };
    if (r.status === 'OK') eyes = r;
  }
  if (eyeReport.status && eyeReport.status !== 'OK') console.warn('[figure-b2] eyes', e.id, eyeReport);
  // clips
  let clips: THREE.AnimationClip[] = [];
  if (e.rig === 'Legacy') clips = (gl.animations as THREE.AnimationClip[]).filter((c) => LEGACY_MAP[c.name]).map((c) => { const k = c.clone(); k.name = LEGACY_MAP[c.name]; return k; });
  else clips = await rigClips(e.rig);
  if (e.rig === 'Legacy' && clips.some((c) => c.name === 'Jump_Full_Short')) { const j = clips.find((c) => c.name === 'Jump_Full_Short')!.clone(); j.name = 'Jump_Full_Long'; clips.push(j); }
  const mixer = new THREE.AnimationMixer(obj);
  const idle = clips.find((c) => c.name === 'Idle_A'); if (idle) mixer.clipAction(idle).play();
  // GLTFLoader sanitises node names (`foot.l` → `footl`)
  const node = (n: string) => obj.getObjectByName(n) ?? obj.getObjectByName(n.replace(/[.\[\]:/]/g, '')) ?? null;
  const fl = node('foot.l'), fr = node('foot.r');
  const P: PlayableFigure = {
    entry: e, obj, mixer, clips, eyes, eyeReport, variant: -1, feet: fl && fr ? { l: fl, r: fr } : null, hips: node('hips'),
    async setVariant(i: number) {
      const url = e.variants[i]; if (!url) return;
      const t = await tex(url);
      obj.traverse((o) => { const m = o as THREE.Mesh; if (!m.isMesh || eyeMesh(m)) return; for (const mm of (Array.isArray(m.material) ? m.material : [m.material]) as THREE.MeshStandardMaterial[]) { if (mm.map || e.bindTexture) { mm.map = t; mm.needsUpdate = true; } } });
      P.variant = i;
    },
    update(dt: number) { mixer.update(dt); eyes?.update(dt); },
    dispose() { mixer.stopAllAction(); eyes?.dispose?.(); obj.removeFromParent(); },
  };
  // OrcRaider: the GLB has images=[] (registry says „embedded“ — wrong), so its texture is bound here at runtime
  if (e.bindTexture) await P.setVariant(Math.max(0, variant));
  else if (variant > 0) await P.setVariant(variant);
  return P;
}
