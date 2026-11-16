/* KFB Clay SSOT R1 · proof kit for v1.4 (NOT part of the SSOT API). Same assets, renderer, cameras and helpers as proof-kit.v1.1, but the
 * stage light moves to kfb-stage-light.v1.1 (byte-identical copy of PROOF_STAGE_R1/vendor): front faces cast, shadow box fitted around the
 * subject and its cast shadow (fitAround), mapSize 4096, minCaster from the smallest figure. That removes the light seam at contacts
 * (e.g. the base of FB's nose) that kfb-stage-light.v1 produced (Proof-Stage G6). proof-kit.v1.js stays as it was so older evidence is
 * reproducible; v1.4 tests and images use this kit. Variants: 'v14' = kfb-clay.v1.4 without koernung, 'v14k' = with koernung (Ground026,
 * loaded before the first render), 'v11' / 'v12' / 'v1' / 'none' as before (v1.1 variants on this new stage). */
import * as K11 from './proof-kit.v1.1.js';
import { applyClay as applyClay14, CLAY_PROFILES as P14, KOERNUNG } from './kfb-clay.v1.4.js';
import { createStageLight, createContactAO, MOODS_MESA, castFrontFaces, fitAround, sunDirection, measureShadowSeam, VERSION as LIGHT_VERSION } from './vendor/kfb-stage-light.v1.1.js';
export * from './proof-kit.v1.1.js';
export { LIGHT_VERSION, castFrontFaces, measureShadowSeam, KOERNUNG };
export const CLAY_PROFILES_V14 = P14;
export const KOERN_MAP_URL = new URL('../CLAY_REFERENZ_R2/assets/Ground026_1K-JPG_NormalGL.jpg', import.meta.url).href;
const { THREE } = K11;
export const SUN_DIR = sunDirection(MOODS_MESA.day.elev, MOODS_MESA.day.az);

/** Stage = scene + the one rig (kfb-stage-light.v1.1). figures: roots that get the figure light, contact AO, front-face casting and the fitted shadow box.
 *  extra: further shadow casters (e.g. a rock) that are part of the subject. */
export function makeStage({ figures = [], extra = [], fit = { center: { x: 0, y: 1, z: 0 }, radius: 4 }, ground = true, scale = 1, sky = '#c9dcea' } = {}) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color(sky);
  const subj = [...figures, ...extra]; subj.forEach((o) => { o.updateMatrixWorld(true); castFrontFaces(o); });
  const boxes = subj.map((o) => new THREE.Box3().setFromObject(o, true)).filter((b) => !b.isEmpty());
  const fitNow = boxes.length ? fitAround(boxes, SUN_DIR) : fit;
  const minCaster = boxes.length ? Math.max(0.02, Math.min(...boxes.map((b) => b.max.y - b.min.y))) : null;
  const mods = figures.map((o) => ({ object3d: o, status: () => ({ status: 'OK', shown: true }) }));
  const rig = createStageLight({ moods: MOODS_MESA, tod: () => 1, groundColor: () => '#cdb48c', fit: () => fitNow, figures: () => mods, figureLight: { distance: 3.4 * scale, up: 2.2 * scale }, mapSize: 4096, minCaster: () => minCaster });
  scene.add(rig.object3d);
  let ao = null;
  if (mods.length) { ao = createContactAO({ targets: () => mods, strength: 0.42 }); scene.add(ao.object3d); }
  let gm = null;
  if (ground) { gm = new THREE.Mesh(new THREE.PlaneGeometry(400 * scale, 400 * scale).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#cdb48c', roughness: 1 })); gm.name = 'ground'; gm.receiveShadow = true; scene.add(gm); }
  figures.forEach((o) => scene.add(o)); extra.forEach((o) => scene.add(o));
  let sun = null; rig.object3d.traverse((o) => { if (!sun && o.isDirectionalLight && o.castShadow) sun = o; });
  return { scene, rig, ao, sun, ground: gm, light: LIGHT_VERSION, fit: fitNow, minCaster,
    render(renderer, camera) { rig.update(0, { camera }); ao?.update(0, { camera }); renderer.render(scene, camera); },
    seam(renderer, camera) { rig.update(0, { camera }); ao?.update(0, { camera }); return measureShadowSeam({ gl: renderer, scene, camera, sun, isFloor: (o) => o === gm }); } };
}

let mapTex = null;
export async function koernMap() { if (!mapTex) { mapTex = await new THREE.TextureLoader().loadAsync(KOERN_MAP_URL); } return mapTex; }
export async function clayVariant(variant, root, opts = {}) {
  if (variant === 'v14' || variant === 'v14k') {
    const { profile = 'character', seed, scaleRef, palette, pull, skip, koernungSkip } = opts;
    const o = { profile, seed, scaleRef, palette, pull, ...(skip ? { skip } : {}) };
    if (variant === 'v14k') Object.assign(o, { koernung: true, koernungMap: await koernMap(), ...(koernungSkip ? { koernungSkip } : {}) });
    const h = applyClay14(root, THREE, o);
    return { setRelief: h.setRelief, setKoernung: h.setKoernung, info: { variant, ...h.info() }, handle: h };
  }
  return K11.clayVariant(variant, root, opts);
}
