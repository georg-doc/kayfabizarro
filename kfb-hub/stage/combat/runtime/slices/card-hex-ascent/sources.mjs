// Card-Hex Ascent · pinned source registry + loader cache.
// Every visible asset is loaded from georg-doc/kayfabizarro at an exact commit (lab.mjs RAW pattern).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as skeletonClone } from 'three/addons/utils/SkeletonUtils.js';

export const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/';
export const PIN = Object.freeze({
  kaykit: '378b209355b13304e3cff656ec0806ca5b89df28',      // Combat lab MODEL_PIN (characters + Rig_Medium animations)
  duel: 'b7f6013bf00d0661ae943e69e7c3dfde38abcebd',         // georg-doc-patch-3 · BLENDER-DUEL-01 weapons
  rangedLib: 'c59ded7b1dbfc4c42b5a6eae2b4218ebf7e66809',    // KFB_Motion_ranged.glb (sha256 9308b6d3…)
});
const ANIM_DIR = 'media/3D_Assets/KayKit_Character_Animations_1.1/Animations/gltf/Rig_Medium/';
const DUEL_DIR = 'skills/chat/workflows/RESIDENT_GUNFIGHT_DUEL_01_BLENDER_2026-10-04/';
export const SRC = Object.freeze({
  hero: [PIN.kaykit, 'media/3D_Assets/KayKit_Mystery_Series6/UltraTurboHeroMan/characters/UltraTurboHeroMan.glb'],
  soldier: [PIN.kaykit, 'media/3D_Assets/KayKit_Mystery_Series6/6 - December 2025 - Toy Soldier/ToySoldier.glb'],
  mech: [PIN.kaykit, 'media/3D_Assets/KayKit_Mystery_Series6/1 - July 2024 - Combat Mech/characters/CombatMech.glb'],
  animBasic: [PIN.kaykit, ANIM_DIR + 'Rig_Medium_MovementBasic.glb'],
  animGeneral: [PIN.kaykit, ANIM_DIR + 'Rig_Medium_General.glb'],
  animAdvanced: [PIN.kaykit, ANIM_DIR + 'Rig_Medium_MovementAdvanced.glb'],
  animRanged: [PIN.rangedLib, 'media/3D_Assets/Animations/KFB_Motion_Library/libs/Rig_Medium/KFB_Motion_ranged.glb'],
  blaster: [PIN.duel, DUEL_DIR + 'UltraTurboHeroMan_Blaster_KFB.glb'],
  rifle: [PIN.duel, DUEL_DIR + 'ToySoldier_Rifle_KFB.glb'],
  minigun: [PIN.duel, DUEL_DIR + 'CombatMech_Minigun_KFB.glb'],
});
export function raw(pin, path) { return RAW + pin + '/' + path.split('/').map(encodeURIComponent).join('/'); }

const loader = new GLTFLoader();
const cache = new Map();
export const loadLog = [];
export function loadGLTF(pin, path) {
  const url = raw(pin, path);
  if (!cache.has(url)) {
    const t0 = performance.now();
    cache.set(url, loader.loadAsync(url).then(g => { loadLog.push({ path, pin: pin.slice(0, 8), ok: true, ms: Math.round(performance.now() - t0) }); return g; },
      e => { loadLog.push({ path, pin: pin.slice(0, 8), ok: false, err: String(e.message || e) }); throw e; }));
  }
  return cache.get(url);
}
export function loadSrc(key) { const [pin, path] = SRC[key]; return loadGLTF(pin, path); }

// Fresh skinned instance (shared geometry/material buffers).
export function instanceSkinned(gltf) { return skeletonClone(gltf.scene); }
// Fresh static instance (shared geometry/material).
export function instanceStatic(gltf) { return gltf.scene.clone(true); }

// Keep only tracks whose node exists; drop root/hips translation that would move the actor in world space
// (controller owns position). Root rotation stays: the ranged clips carry their authored root yaw there.
export function cleanClip(clip, nodeNames, { zeroHipsXZ = false } = {}) {
  const tracks = [];
  for (const t of clip.tracks) {
    const [node, prop] = splitTrack(t.name);
    if (!nodeNames.has(node)) continue;
    if (prop === 'position' && /^root$/i.test(node)) continue;
    if (prop === 'position' && /^hips$/i.test(node)) {
      if (!zeroHipsXZ) { tracks.push(t); continue; }
      // in-place: keep vertical bob, remove horizontal travel relative to the first key (dodge root travel)
      const v = t.values.slice(); const x0 = v[0], z0 = v[2];
      for (let i = 0; i < v.length; i += 3) { v[i] = x0; v[i + 2] = z0; }
      tracks.push(new THREE.VectorKeyframeTrack(t.name, t.times, v)); continue;
    }
    tracks.push(t);
  }
  return new THREE.AnimationClip(clip.name, clip.duration, tracks);
}
function splitTrack(name) { const i = name.lastIndexOf('.'); return [name.slice(0, i), name.slice(i + 1)]; }
export function nodeNames(root) { const s = new Set(); root.traverse(n => { if (n.name) s.add(n.name); }); return s; }
export function findNode(root, re) { let f = null; root.traverse(n => { if (!f && re.test(n.name)) f = n; }); return f; }
