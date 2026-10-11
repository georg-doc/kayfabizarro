// Stufe 2 · KFB-Cabrio (Steuerung 10.10.: replaces the cut-open Cicada; template J17 FB Cabrio, FB-CAR-01). The car is the
// pinned KFB_CVP1_cabrio.glb r2 (public/kfb-pin, VENDOR.md), prepared by J17's own `cabrioVehicle().prep` (roof open at
// frame 52, side windows down, inner mirror raised). Scale from the seat contract, never from the figure: one cabrio unit =
// 1.8 rig units (J17 CAR_K) and one rig unit = 1.6 lab (K2 FIG_SCALE) → 2.88 lab.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// @ts-ignore – vendored template, plain JS
import { cabrioVehicle, CAR_K, SRC } from './vendor/j17/cabrio-seat.j17.js';
import { clayMaterial, claySeed } from '../clay';
import { FIG_SCALE } from '../scale';

export const CAB_UNIT = CAR_K * FIG_SCALE;
// lacquered clay: fine thumb strokes, no dents (the nature mix read as craters on the Retro cars, Messung 03/04)
const CAR_CLAY = { tools: { thumb: { k: 0.3, s: 0.25, c: 0.4 }, smear: { k: 0.2, s: 0.5, c: 0.3 } }, dent: 0, gouge: 0, crack: 0, print: 0.15 };

export async function loadCabrio() {
  const [g, contract] = await Promise.all([new GLTFLoader().loadAsync(SRC.cabrio), fetch(SRC.contract).then((r) => r.json())]);
  const model = g.scene;
  cabrioVehicle(contract).prep(model, g);
  let seed = 41;
  model.traverse((o) => {
    const m = o as THREE.Mesh; if (!m.isMesh) return;
    const conv = (mm: THREE.Material) => (/glass/i.test(mm.name) ? mm : clayMaterial('model', mm as THREE.MeshStandardMaterial, CAR_CLAY));
    m.material = Array.isArray(m.material) ? m.material.map(conv) : conv(m.material);
    claySeed(m.geometry, seed++); m.castShadow = m.receiveShadow = true;
  });
  model.scale.setScalar(CAB_UNIT); model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model); model.position.y = -box.min.y;
  const wrap = new THREE.Group(); wrap.name = 'kfb-cabrio'; wrap.add(model); wrap.userData.cabrio = { model, contract, gltf: g };
  return wrap;
}
