// Phase C · C1b+C3 smoke test: the O1 v7 ring (LAB fork) built into a plain scene with three r186 — build time, triangles, errors,
// offline. Not a Lab page; tools/track/organ-smoke.mjs reads window.__organ.
import * as THREE from 'three';
// @ts-ignore – LAB fork of the O1 v7 module, plain JS
import { buildOrganWorld } from './world/organ/vendor/lab-organ/organ-world.lab.js';
const canvas = document.getElementById('c') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); renderer.setPixelRatio(1); renderer.shadowMap.enabled = true;
const scene = new THREE.Scene(); scene.background = new THREE.Color('#96bede');
const camera = new THREE.PerspectiveCamera(36, innerWidth / innerHeight, 1, 30000); camera.position.set(-2900, 1900, 2900); camera.lookAt(0, 80, 0);
const sun = new THREE.DirectionalLight('#fff4e6', 2.9); sun.position.set(1500, 2500, 900); scene.add(sun, new THREE.HemisphereLight('#eef4fa', '#9a8a78', 1.05));
const resize = () => { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }; resize(); addEventListener('resize', resize);
const notes: string[] = [];
const t0 = performance.now();
(window as any).__organ = { done: false, notes };
(buildOrganWorld as any)({ scene, renderer, onNote: (n: string) => { if (n) notes.push(n); } }).then((W: any) => {
  const ms = Math.round(performance.now() - t0); let tris = 0; W.world.traverse((o: any) => { if (o.isMesh && o.visible) tris += (o.geometry.index ? o.geometry.index.count : o.geometry.attributes.position.count) / 3; });
  Object.assign((window as any).__organ, { done: true, ms, tris: Math.round(tris), info: W.info, track: W.trackInfo, hub: { c: W.hub.c, y: W.hub.y, E: W.hub.E, X: W.hub.X, W: W.hub.HM?.W }, tunLights: W.tunLights.length, islands: W.built.map((b: any) => ({ id: b.id, hits: b.hits, ms: b.ms, tiers: Object.fromEntries(Object.entries(b.tiers).map(([k, T]: any) => [k, T.tris])) })), W });
  const loop = () => { requestAnimationFrame(loop); W.update(1 / 60); renderer.render(scene, camera); }; loop();
}).catch((e: Error) => { (window as any).__organ = { done: true, error: String(e.stack || e), notes }; console.error(e); });
