// Bühnen-Host (Demo) · besitzt Renderer, Kamera, Takt, Eingabe. In WS1 übernimmt der Slice-Host diese Rolle;
// die Module (billboard, ground, actors, bubbles, shots, sequence) werden 1:1 eingehängt.
import * as THREE from 'three';
import { initK1, K1_LIGHT } from '../vendor/k1/clay-k1-adapter.js';
import * as Billboard from './billboard.module.js';
import * as Ground from './ground.module.js';
import * as Actors from './actors.module.js';
import * as Bubbles from './bubbles.module.js';
import * as Shots from './shots.module.js';
import * as Sequence from './sequence.module.js';

const CARD = new URL('../assets/card_forget_utopia_7.png', import.meta.url).href;
const PADS = { '16:9': { l: 18, r: 18, t: 18, b: 18 }, '9:16': { l: 12, r: 64, t: 96, b: 150 } };
const loadImg = src => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error('Bild nicht ladbar: ' + src)); i.src = src; });

export async function mount(root, ui = {}) {
  const frame = document.createElement('div'); frame.style.cssText = 'position:absolute;overflow:hidden;background:#b9d0de;box-shadow:0 0 0 1px rgba(0,0,0,.2)'; root.appendChild(frame);
  const canvas = document.createElement('canvas'); canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'; frame.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const [K1, card] = await Promise.all([initK1(renderer), loadImg(CARD)]);
  const scene = new THREE.Scene(); scene.background = new THREE.Color(K1_LIGHT.sky);
  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.3, 400);
  scene.add(new THREE.HemisphereLight(K1_LIGHT.hemiS, K1_LIGHT.hemiG, K1_LIGHT.hemiI));
  const el = K1_LIGHT.el * Math.PI / 180, az = K1_LIGHT.az * Math.PI / 180, dir = new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el));
  const sun = new THREE.DirectionalLight(K1_LIGHT.sun, K1_LIGHT.sunI); sun.position.copy(dir).multiplyScalar(60); sun.castShadow = true;
  Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 160 }); sun.shadow.camera.updateProjectionMatrix(); sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -0.0003; sun.shadow.normalBias = 0.03;
  const fill = new THREE.DirectionalLight(K1_LIGHT.fillC, K1_LIGHT.sunI * K1_LIGHT.fillK); fill.position.copy(dir).multiplyScalar(-40).setY(14);
  scene.add(sun, sun.target, fill);

  const ground = Ground.create({ K1U: K1.U }); scene.add(ground.object3d);
  let corner = 0, bb = null;
  const buildBB = () => { if (bb) { scene.remove(bb.object3d); bb.dispose(); } bb = Billboard.create({ card, K1U: K1.U, gb: 0.9, corner, phrases: Sequence.SCRIPT.power }); bb.object3d.position.z = -1.2; scene.add(bb.object3d); };
  buildBB();
  const xA = -(bb.info.W / 2 + 0.6), xB = bb.info.W / 2 + 0.6, zA = 3.6;
  const A = Actors.create({ id: 'A', role: 'A · spricht', x: xA, z: zA, y: ground.heightAt(xA, zA) });
  const B = Actors.create({ id: 'B', role: 'B · reagiert', x: xB, z: zA, y: ground.heightAt(xB, zA) });
  scene.add(A.object3d, B.object3d);
  const bubbles = Bubbles.create({ host: frame });
  const shots = Shots.create({ camera, A, B, billboard: { get info() { return bb.info; }, get object3d() { return bb.object3d; } } });
  const seq = Sequence.create({});
  let aspect = '16:9', auto = true;

  for (const [k, act] of [['A', A], ['B', B]]) { const s = localStorage.getItem('kfb-wfstage-standin-' + k); if (s) loadImg(s).then(im => act.setImage(im)).catch(() => {}); }
  frame.addEventListener('dragover', e => e.preventDefault());
  frame.addEventListener('drop', e => {
    e.preventDefault(); const f = e.dataTransfer.files && e.dataTransfer.files[0]; if (!f || !f.type.startsWith('image/')) return;
    const r = frame.getBoundingClientRect(), who = (e.clientX - r.left) < r.width / 2 ? A : B, fr = new FileReader();
    fr.onload = () => loadImg(fr.result).then(im => { who.setImage(im); try { localStorage.setItem('kfb-wfstage-standin-' + who.id, fr.result); } catch (err) {} });
    fr.readAsDataURL(f);
  });

  function layout() {
    const W = root.clientWidth, H = root.clientHeight, ar = aspect === '9:16' ? 9 / 16 : 16 / 9;
    let w = W, h = W / ar; if (h > H) { h = H; w = H * ar; }
    Object.assign(frame.style, { width: Math.round(w) + 'px', height: Math.round(h) + 'px', left: Math.round((W - w) / 2) + 'px', top: Math.round((H - h) / 2) + 'px' });
    renderer.setSize(Math.round(w), Math.round(h), false); camera.aspect = ar; camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(layout); ro.observe(root); layout();

  let last = performance.now(), info = {}, frames = 0, fpsT = last, fps = 0;
  function step(now) {
    const dt = Math.min(0.1, Math.max(0, (now - last) / 1000)); if (now - last < 12) return; last = now;
    const s = seq.update(dt, {
      onCue: c => { if (auto) shots.set(c.shot); if (c.say === 'A') { bubbles.clear(); bubbles.say(A, Sequence.SCRIPT.a, '#e6b53a'); } if (c.say === 'B') { bubbles.clear('A'); bubbles.say(B, Sequence.SCRIPT.b, '#59c3e6'); } if (c.clear) bubbles.clear(); },
      onLoop: () => bubbles.clear()
    });
    A.setSpeaking(s.speaking === 'A'); B.setSpeaking(s.speaking === 'B');
    shots.update(dt, { aspect: camera.aspect });
    const ctx = { camera, aspect: camera.aspect, readAlong: s.readAlong };
    bb.update(dt, ctx); ground.update(dt, ctx); A.update(dt, ctx); B.update(dt, ctx);
    renderer.render(scene, camera);
    const Wf = frame.clientWidth, Hf = frame.clientHeight, v = new THREE.Vector3(), avoid = [A, B].map(a => { const f = a.faceBox(); v.copy(f.center).project(camera); const hpx = f.h / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * f.center.distanceTo(camera.position)) * Hf; return { x: (v.x + 1) / 2 * Wf - hpx * 0.6, y: (1 - v.y) / 2 * Hf - hpx / 2, w: hpx * 1.2, h: hpx }; });
    bubbles.update(dt, { camera, pads: PADS[aspect], avoid });
    frames++; if (now - fpsT > 1000) { fps = Math.round(frames * 1000 / (now - fpsT)); frames = 0; fpsT = now; }
    info = { t: seq.t.toFixed(1), end: seq.END.toFixed(1), phase: s.phase, shot: shots.shot, aspect, fps, calls: renderer.info.render.calls, tris: renderer.info.render.triangles, face: bb.info.W.toFixed(2) + ' × ' + bb.info.H.toFixed(2) + ' m', cardAspect: bb.info.aspect.toFixed(3), sdk: A.sdkState, corner };
    ui.onInfo && ui.onInfo(info);
  }
  let alive = true; const tick = () => { if (!alive) return; step(performance.now()); };
  const iv = setInterval(tick, 1000 / 60); const raf = () => { if (!alive) return; tick(); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
  return {
    setShot(n) { auto = false; shots.set(n); }, setAuto(v) { auto = v; }, get auto() { return auto; },
    setAspect(a) { aspect = a; layout(); bubbles.list.forEach(b => b.hl = null); },
    restart() { seq.seek(0); bubbles.clear(); shots.set('two'); }, pause(v) { seq.pause(v); },
    setCorner(r) { corner = r; buildBB(); }, get info() { return info; },
    seek(t) { seq.seek(t); bubbles.clear(); },
    dispose() { alive = false; clearInterval(iv); ro.disconnect(); [bb, ground, A, B, bubbles].forEach(m => m.dispose()); renderer.dispose(); frame.remove(); }
  };
}
