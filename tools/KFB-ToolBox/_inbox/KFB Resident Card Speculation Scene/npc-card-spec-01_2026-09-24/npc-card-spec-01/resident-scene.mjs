/* NPC-CARD-SPEC-01 · resident-scene.mjs — thin Resident Scene recipe runner.
 *
 * Owns ONLY: the scene root, the two actor wrappers (local transforms), the Card presentation
 * pivot, the beat clock and the bubble overlay placement. Every face/mouth/eye/mixer/bubble-ink is
 * the donor's. The host supplies renderer, THREE, GLTFLoader, camera, overlay element, card canvas.
 *
 *   const s = await mountResidentScene({ THREE, GLTFLoader, parent, camera, overlay, recipe,
 *                                        getCardCanvas, base, log });
 *   per frame:  s.update(dt, camera, viewW, viewH);
 *   s.restart(variant) · s.play() · s.pause() · s.setReview(mode) · s.report() · s.dispose()
 *
 * Gaze follows the Podcast v5 lesson: the EyeRig is the owner; this module sends IMPULSES
 * (setGazeFollow + pointTo once, released after `hold`) and never writes the gaze every frame.
 */
import { shapeForBox, paintBubble, inkPenFor, fontOf, textOf, VOICE_STYLE } from './donor/podcast-v5/bubble-shaper.v2.js';
import { mountKayKitEyes } from './donor/eye-rig-batch/kaykit-eye-adapter.v1.js';
import { prepareVerifiedGothGirlCleanup } from './donor/eye-rig-batch/source-face-cleanup.v1.js';
import { sampleActorFaceColor } from './donor/eye-rig-batch/face-color-sampler.v1.js';

export const SCHEMA = 'kfb.resident-scene-runner/0.1-candidate';
const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/';
const enc = (s) => s.split('/').map(encodeURIComponent).join('/');
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = (k) => 1 - Math.pow(1 - clamp(k, 0, 1), 3);
const D2R = Math.PI / 180;

function applyTransform(obj, t) {
  if (!t) return;
  if (t.position) obj.position.fromArray(t.position);
  obj.rotation.y = (t.yaw || 0) * D2R;
  if (t.scale != null) obj.scale.setScalar(t.scale);
}
async function json(url) { const r = await fetch(url); if (!r.ok) throw new Error(url + ' HTTP ' + r.status); return r.json(); }
function hostOf(rig) {
  const inner = rig && rig.ch && rig.ch.inner;
  let body = null;
  if (inner) inner.traverse((n) => { if (!body && n.isMesh && n.name === 'body') body = n; });
  return body;
}

/* ── Motion · ONE mixer per actor, clips from the KFB Motion Library (Mixamo → Rig_Medium, Blender MCP) ──
   idle loops; talk/reaction clips are crossfaded in and hand back to idle after `hold`. */
function createMotion(THREE, root, clips, map, log) {
  const mixer = new THREE.AnimationMixer(root);
  const acts = {}; let cur = null, back = null, curId = null;
  const get = (id) => { if (!id) return null; if (!acts[id]) { const c = clips.find((x) => x.name === id); if (!c) { log('clip missing: ' + id); return null; } acts[id] = mixer.clipAction(c); } return acts[id]; };
  const api = {
    mixer, map,
    to(id, { fade = 0.35, hold = null } = {}) {
      const a = get(id); if (!a) return false;
      back = hold != null ? { t: hold } : null;
      if (a === cur) return true;
      a.reset(); a.enabled = true; a.setEffectiveTimeScale(1); a.setEffectiveWeight(1); a.setLoop(THREE.LoopRepeat, Infinity); a.play();
      if (cur) cur.crossFadeTo(a, fade, false); else a.fadeIn(fade);
      cur = a; curId = id; return true;
    },
    idle(fade = 0.45) { back = null; return api.to(map.idle, { fade }); },
    talk(hold) { return api.to(map.talk || map.idle, { hold }); },
    react(key, hold) { const id = (map.reactions || {})[key]; return id ? api.to(id, { hold, fade: 0.3 }) : false; },
    update(dt) { mixer.update(dt); if (back) { back.t -= dt; if (back.t <= 0) { back = null; api.to(map.idle, { fade: 0.5 }); } } },
    current() { return curId; },
  };
  return api;
}

/* Mouth recess → surface. Method of lab-v4/carlrig.js#flattenRecesses (move the MEASURED recess
   points onto the MEASURED surrounding surface, analytic normals, file untouched), adapted to a
   head that is not a capsule: the surface is a quadratic z = f(x, y) fitted to the ring of face
   vertices around the measured mouth box (below the nose only). */
function flattenMouthRecess(THREE, geo, box, ringX = 0.8, ringDown = 0.09) {
  const P = geo.attributes.position, N = geo.attributes.normal, n = P.count;
  const B = new THREE.Box3(new THREE.Vector3().fromArray(box.min), new THREE.Vector3().fromArray(box.max));
  const bw = B.max.x - B.min.x;
  const O = new THREE.Box3(new THREE.Vector3(B.min.x - bw * ringX, B.min.y - ringDown, B.min.z), new THREE.Vector3(B.max.x + bw * ringX, B.max.y, B.max.z));
  const v = new THREE.Vector3(), rows = [], zs = [];
  for (let i = 0; i < n; i++) { v.fromBufferAttribute(P, i); if (O.containsPoint(v) && !B.containsPoint(v)) { rows.push([1, v.x, v.y, v.x * v.x, v.y * v.y, v.x * v.y]); zs.push(v.z); } }
  if (rows.length < 12) return { status: 'SKIPPED', reason: 'ring too small (' + rows.length + ')' };
  const k = 6, A = Array.from({ length: k }, () => new Float64Array(k + 1));
  rows.forEach((r, j) => { for (let a = 0; a < k; a++) { for (let b = 0; b < k; b++) A[a][b] += r[a] * r[b]; A[a][k] += r[a] * zs[j]; } });
  for (let c = 0; c < k; c++) { let p = c; for (let r = c + 1; r < k; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r; [A[c], A[p]] = [A[p], A[c]]; const d = A[c][c] || 1e-12; for (let r = 0; r < k; r++) if (r !== c) { const f = A[r][c] / d; for (let q = c; q <= k; q++) A[r][q] -= f * A[c][q]; } }
  const w = A.map((r, i) => r[k] / (r[i] || 1e-12));
  const f = (x, y) => w[0] + w[1] * x + w[2] * y + w[3] * x * x + w[4] * y * y + w[5] * x * y;
  let moved = 0, maxIn = 0, maxOut = 0;
  for (let i = 0; i < n; i++) {
    v.fromBufferAttribute(P, i); if (!B.containsPoint(v)) continue;
    const z = f(v.x, v.y), d = z - v.z; if (d > maxIn) maxIn = d; if (-d > maxOut) maxOut = -d;
    P.setZ(i, z); moved++;
    if (N) { const gx = w[1] + 2 * w[3] * v.x + w[5] * v.y, gy = w[2] + 2 * w[4] * v.y + w[5] * v.x, l = Math.hypot(gx, gy, 1); N.setXYZ(i, -gx / l, -gy / l, 1 / l); }
  }
  P.needsUpdate = true; if (N) N.needsUpdate = true;
  geo.computeBoundingBox(); geo.computeBoundingSphere();
  return { status: 'OK', ring: rows.length, moved, maxInsetBefore: +maxIn.toFixed(4), maxRidgeBefore: +maxOut.toFixed(4) };
}

/* ── Actor A · FrizzleBob Driver Graft through the one Graft reader ───────────────────────── */
async function mountDriver({ THREE, loader, M, slot, camera, contract, clips, log }) {
  const wrap = new THREE.Group(); wrap.name = 'actor · A · ' + slot.actorId;
  const pet = M.pickGraftPet(contract, slot.actorId) || M.pickGraftPet(contract);
  const g = await M.mountGraft({ THREE, loader, parent: wrap, pet, lib: contract, camera, animation: clips ? 'host' : 'own',
    override: slot.override || null, log: (s) => log('[A] ' + s) });
  g.root.traverse((n) => { if (n.isMesh) { n.castShadow = true; } });
  const motion = clips ? createMotion(THREE, g.figure, clips, slot.motion || {}, (s) => log('[A] ' + s)) : null;
  if (motion) motion.idle(0);
  const emotes = (contract.face && contract.face.emotes) || {};
  return {
    motion,
    slot: 'A', id: pet.id, name: slot.displayName, wrap, rig: g.rig, mouth: g.mouth, handle: g,
    host: hostOf(g.rig),
    update(dt, cam) { if (motion) motion.update(dt); g.update(dt, cam); },
    emote(id) { if (emotes[id]) g.rig.applyEmote(emotes[id]); if (g.mouth) g.mouth.setRest(id); },
    report() {
      return { reader: 'graft-mount.v1#mountGraft', id: pet.id, animation: motion ? 'host · 1 mixer · ' + motion.current() : 'own', mouthSet: g.mouth && g.mouth.setId,
        mouthParent: g.mouth && g.mouth.mesh && g.mouth.mesh.parent && g.mouth.mesh.parent.name,
        eyes: 'EyeRig v6 · anchor ' + JSON.stringify(g.rig.anchor), weapon: g.report.weapon ? g.report.weapon.status : 'off',
        notes: g.report.notes.length };
    },
    dispose() { g.dispose(); },
  };
}

/* Median texel of triangles fully OUTSIDE the paint box but inside it grown by ring
   (bind-pose geometry coords). Read-only; null if the texture is unreadable. */
function ringTone(THREE, geo, map, box, ring) {
  const img = map && map.image; if (!img || !img.width) return null;
  const B = new THREE.Box3(new THREE.Vector3().fromArray(box.min), new THREE.Vector3().fromArray(box.max));
  const O = B.clone().expandByVector(B.getSize(new THREE.Vector3()).multiplyScalar(ring));
  const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  try { cx.drawImage(img, 0, 0); } catch (e) { return null; }
  const P = geo.attributes.position, U = geo.attributes.uv, I = geo.index ? geo.index.array : null;
  const n = I ? I.length / 3 : P.count / 3, v = new THREE.Vector3(), cols = [], flip = map.flipY !== false;
  for (let t = 0; t < n; t++) {
    let inner = false, outer = true, u = 0, w = 0;
    for (let k = 0; k < 3; k++) {
      const vi = I ? I[t * 3 + k] : t * 3 + k; v.fromBufferAttribute(P, vi);
      if (B.containsPoint(v)) inner = true; if (!O.containsPoint(v)) outer = false;
      u += U.getX(vi) / 3; w += U.getY(vi) / 3;
    }
    if (inner || !outer) continue;
    const d = cx.getImageData(Math.min(img.width - 1, Math.round(u * img.width)), Math.min(img.height - 1, Math.round((flip ? 1 - w : w) * img.height)), 1, 1).data;
    if (d[3] > 8) cols.push([d[0], d[1], d[2]]);
  }
  if (!cols.length) return null;
  cols.sort((a, b) => (a[0] * 0.299 + a[1] * 0.587 + a[2] * 0.114) - (b[0] * 0.299 + b[1] * 0.587 + b[2] * 0.114));
  const m = cols[Math.floor(cols.length / 2)];
  return { css: 'rgb(' + m.join(',') + ')', samples: cols.length };
}

/* ── Actor B · GothGirl on her own head: EYE_RIG_BATCH cleanup + eyes, profile mouth ────────── */
async function mountGoth({ THREE, loader, M, slot, camera, contract, seed, profile, pin, clips, log }) {
  const L = (s) => log('[B] ' + s);
  const wrap = new THREE.Group(); wrap.name = 'actor · B · ' + slot.actorId;
  const url = (p) => RAW + pin + '/' + enc(p);
  const gltf = await loader.loadAsync(url(slot.source.glb));
  const fig = gltf.scene; fig.name = 'figure · gothgirl';
  wrap.add(fig);
  fig.updateMatrixWorld(true);
  const bb = new THREE.Box3().setFromObject(fig);
  fig.position.y -= bb.min.y; fig.updateMatrixWorld(true);
  fig.traverse((n) => { if (n.isMesh) { n.castShadow = true; n.frustumCulled = false; } });

  let head = null;
  fig.traverse((n) => { if (!head && n.isSkinnedMesh && n.name === 'GothGirl_Head') head = n; });
  if (!head) throw new Error('GothGirl_Head not found');
  /* goth-biped Falle 1: six meshes share ONE material. The head gets its own copy before the
     mouth is painted over, otherwise the legs are repainted too. Done before the cleanup captures it. */
  const headMat = (Array.isArray(head.material) ? head.material[0] : head.material).clone();
  head.material = headMat;
  const origGeo = head.geometry;

  const cleanup = prepareVerifiedGothGirlCleanup({ figure: fig, log: L });
  if (cleanup.status !== 'AUTO_CANDIDATE') throw new Error('GothGirl source-face guard: ' + cleanup.status);
  cleanup.apply(true);
  const flat = [head.geometry, origGeo].filter((gq, i, a) => a.indexOf(gq) === i).map((gq) => flattenMouthRecess(THREE, gq, slot.source.mouthPaint.box));
  L('source mouth recess flattened · ' + JSON.stringify(flat[0]));
  fig.updateMatrixWorld(true);

  const eyes = await mountKayKitEyes({ THREE, figure: fig, sourceRef: seed.source, profile: seed, expressionContract: contract, camera, log: L });
  if (seed.life) eyes.setLife(seed.life);

  /* Mouth host: the profile mouth values (size .58 · dy −.40 · sx 1.15) were tuned on the face-shell
     host (goth-biped Falle 2), not on the head-bone box the eye seed uses. Same facehost module,
     re-centred on component 0 (seed identity: head-face-shell). One PetMouth, one owner. */
  const fh = M.buildFaceHost({ THREE, figure: fig, log: L });
  const fb = cleanup.report.components[0].bounds;
  const c = new THREE.Vector3((fb.x[0] + fb.x[1]) / 2, (fb.y[0] + fb.y[1]) / 2, (fb.z[0] + fb.z[1]) / 2);
  const s = new THREE.Vector3(fb.x[1] - fb.x[0], fb.y[1] - fb.y[0], fb.z[1] - fb.z[0]);
  head.localToWorld(c); fh.head.updateMatrixWorld(true);
  fh.inner.position.copy(fh.head.worldToLocal(c));
  fh.box.geometry.dispose();
  fh.box.geometry = new THREE.SphereGeometry(1, 40, 28).scale(s.x / 2, s.y / 2, s.z / 2);
  fh.box.geometry.computeBoundingBox();
  L('mouth host on face shell ' + s.toArray().map((v) => v.toFixed(3)).join('×') + ' (head-bone box ' + fh.report.headSize.join('×') + ')');
  const gp = (profile.pets || []).find((p) => p.id === 'gothgirl') || {};
  const mp = { ...(gp.mouth || {}), ...(slot.mouthOverride || {}) };
  const mouth = new M.PetMouth(fh.faceCtx(), { params: mp });
  if (mp.set && mouth.setId !== mp.set) mouth.setSet(mp.set);
  mouth.build(); mouth.rest = 'neutral'; mouth.setTex('neutral');

  /* Painted source mouth -> texclean over the measured region. Fill = median texel of the RING of
     triangles just outside the box (the skin that actually surrounds the mouth). Measured, because
     the head mesh is >50 % hair (whole-mesh median = hair black, goth-biped faceTone note) and the
     eye-area sampler reads a highlight-pale tone that leaves the white crescent readable. */
  const tone = sampleActorFaceColor({ THREE, figure: fig, faceHost: eyes.faceHost, anchor: seed.eye.anchor, preferredHeadMesh: 'GothGirl_Head', log: L });
  const mpaint = slot.source.mouthPaint;
  const ring = ringTone(THREE, origGeo, headMat.map, mpaint.box, 0.6);
  const pr = M.paintOverRegion({ THREE, mesh: { geometry: origGeo, material: headMat, userData: {} },
    boxesLocal: [mpaint.box], grow: mpaint.grow, color: ring ? ring.css : (tone.status === 'OK' ? tone.color : null) });
  if (pr.map) { headMat.map = pr.map; headMat.needsUpdate = true; }
  L('source mouth painted over · ' + pr.report.status + ' · ' + pr.report.triangles + ' tris · ' + pr.report.colour + ' (ring ' + (ring ? ring.samples : 0) + ' samples; eye sampler ' + (tone.color || tone.status) + ')');

  let motion = null, clipName = null;
  if (clips) { motion = createMotion(THREE, fig, clips, slot.motion || {}, L); motion.idle(0); }
  else {
    try {
      const pack = await loader.loadAsync(url(slot.source.clips));
      motion = createMotion(THREE, fig, pack.animations, { idle: slot.source.idle }, L); motion.idle(0);
    } catch (e) { L('clips unavailable: ' + e.message); }
  }
  const mixer = motion ? motion.mixer : null;

  const emotes = (contract.face && contract.face.emotes) || {};
  return {
    slot: 'B', id: 'gothgirl', name: slot.displayName, wrap, rig: eyes.rig, mouth, eyes, mixer, motion,
    host: eyes.faceHost.box,
    update(dt, cam) { if (motion) motion.update(dt); eyes.update(dt, cam); mouth.update(dt, cam); },
    emote(id) { if (emotes[id]) eyes.applyExpression(id); mouth.setRest(id); },
    report() {
      return { glb: slot.source.glb + '@' + pin.slice(0, 7), cleanup: cleanup.report.status + ' · hidden ' + cleanup.report.eyeCandidates.map((e) => e.component).join('+'),
        eyes: 'EyeRig v6 · mountKayKitEyes · seed ' + seed.status, mouthSet: mouth.setId, mouthHost: 'face shell',
        mouthPaint: pr.report.status + ' ' + pr.report.triangles + ' tris ' + pr.report.colour, faceTone: tone.status === 'OK' ? tone.color : 'fallback',
        mixer: 'AnimationMixer ×1 · ' + (motion ? motion.current() : 'none'), recess: flat[0].status + ' · ' + (flat[0].moved || 0) + ' verts' };
    },
    dispose() { if (mixer) mixer.stopAllAction(); mouth.dispose(); fh.dispose(); eyes.dispose(); cleanup.dispose(); if (pr.map) pr.map.dispose(); },
  };
}

/* ── Card · real card bitmap from the Card owner, one presentation pivot ─────────────────────── */
async function mountCard({ THREE, slot, canvas, log }) {
  const pivot = new THREE.Group(); pivot.name = 'card · ' + slot.name;
  applyTransform(pivot, slot.transform);
  const spin = new THREE.Group(); pivot.add(spin);
  const tex = new THREE.CanvasTexture(canvas); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const h = slot.transform.height, w = h * (canvas.width / canvas.height);
  const back = new THREE.TextureLoader().load(RAW + 'main/' + enc(slot.back), (t) => { t.colorSpace = THREE.SRGBColorSpace; });
  const edge = new THREE.MeshStandardMaterial({ color: 0xefe8da, roughness: 0.9, transparent: true });
  const front = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true });
  const backM = new THREE.MeshBasicMaterial({ map: back, toneMapped: false, transparent: true, color: 0xffffff });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, h * 0.014), [edge, edge, edge, edge, front, backM]);
  mesh.name = 'card mesh'; mesh.castShadow = true;
  spin.add(mesh);
  const mats = [edge, front, backM];
  const st = { t0: null, shown: false };
  log('[card] ' + slot.name + ' · ' + canvas.width + '×' + canvas.height + ' px · ' + w.toFixed(2) + '×' + h.toFixed(2) + ' u');
  return {
    pivot, mesh, w, h, name: slot.name,
    hide() { st.t0 = null; st.shown = false; spin.visible = false; },
    reveal(now) { st.t0 = now; st.shown = true; spin.visible = true; },
    showNow() { st.t0 = -99; st.shown = true; spin.visible = true; },
    focus() { return pivot.localToWorld(new THREE.Vector3(0, 0, 0)); },
    screenRect(cam, vw, vh) {
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; const v = new THREE.Vector3();
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        v.set(sx * w / 2, sy * h / 2, 0); mesh.localToWorld(v); v.project(cam);
        const px = (v.x * 0.5 + 0.5) * vw, py = (-v.y * 0.5 + 0.5) * vh;
        x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py);
      }
      return { x0, y0, x1, y1 };
    },
    update(now) {
      if (!st.shown) return;
      const k = st.t0 == null ? 1 : ease((now - st.t0) / 1.2);
      spin.position.y = (1 - k) * -0.55 + Math.sin(now * 1.25) * 0.022 * k;
      spin.rotation.y = (1 - k) * Math.PI + Math.sin(now * 0.45) * 0.025 * k;
      spin.rotation.z = Math.sin(now * 0.8 + 1) * 0.012;
      spin.scale.setScalar(0.6 + 0.4 * k);
      for (const m of mats) m.opacity = clamp(k * 1.4, 0, 1);
    },
    dispose() { mesh.geometry.dispose(); tex.dispose(); back.dispose(); mats.forEach((m) => m.dispose()); },
  };
}

/* ── Bubbles · Podcast v5 shaper/ink, placed in the world above the speaker ──────────────────── */
function createBubbles({ overlay, shapes }) {
  const bank = {}; (shapes.shapes || []).forEach((s) => { bank[s.name] = s; });
  const live = [];
  const meas = document.createElement('canvas').getContext('2d');
  function wrapLines(text, font, maxW) {
    meas.font = font;
    const words = text.split(/\s+/), out = []; let cur = '';
    for (const w of words) { const t = cur ? cur + ' ' + w : w; if (meas.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t; }
    if (cur) out.push(cur);
    return out;
  }
  function build(text, voice, side, seed, tail) {
    const V = VOICE_STYLE[voice] || VOICE_STYLE.mid, fontPx = V[2], font = fontOf(voice, fontPx);
    const lines = wrapLines(textOf(voice, text), font, 300);
    meas.font = font;
    const tw = Math.max(...lines.map((l) => meas.measureText(l).width)), lh = fontPx * 1.2;
    const sh = shapeForBox(voice === 'whisper' ? bank.round : bank.rect, tw + fontPx * 1.5, lines.length * lh + fontPx * 1.1, { tail: tail != null ? tail : (side === 'A' ? 0.58 : -0.58) });
    const pen = inkPenFor(voice, fontPx), m = Math.ceil(pen * 3 + 12);
    const W = Math.ceil(sh.w + m * 2), H = Math.ceil(sh.h + m * 2), dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cv = document.createElement('canvas'); cv.width = W * dpr; cv.height = H * dpr;
    cv.style.cssText = 'position:absolute;left:0;top:0;width:' + W + 'px;height:' + H + 'px;pointer-events:none;opacity:0;transition:opacity .22s ease, transform .05s linear;will-change:transform,opacity';
    const g = cv.getContext('2d'); g.scale(dpr, dpr); g.translate(m, m);
    paintBubble(g, sh.pts, { pen, seed, voice, k: 1 });
    g.fillStyle = '#1f1a14'; g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
    lines.forEach((ln, i) => g.fillText(ln, sh.inner.cx, sh.inner.cy + (i - (lines.length - 1) / 2) * lh));
    let tip = sh.pts[0]; for (const p of sh.pts) if (p.y > tip.y) tip = p;
    const bodyBottom = sh.inner.cy + sh.inner.h / 2 + fontPx * 0.4;
    return { el: cv, W, H, tipX: tip.x + m, tipY: tip.y + m, tailH: Math.max(0, tip.y - bodyBottom), shapeW: sh.w, m, tail: tail != null ? tail : (side === 'A' ? 0.58 : -0.58), text, voice, seed };
  }
  return {
    show({ actor, text, voice, until, seed, now }) {
      live.filter((b) => b.actor === actor).forEach((b) => { b.until = Math.min(b.until, now); });
      const b = build(text, voice, actor.slot, seed);
      overlay.appendChild(b.el);
      live.push({ ...b, actor, until, born: now });
    },
    clear() { live.splice(0).forEach((b) => b.el.remove()); },
    update({ now, camera, vw, vh, THREE, cardRect }) {
      for (let i = live.length - 1; i >= 0; i--) {
        const b = live[i];
        if (now > b.until + 0.3) { b.el.remove(); live.splice(i, 1); continue; }
        const host = b.actor.host; if (!host) continue;
        const p = host.getWorldPosition(new THREE.Vector3());
        if (!host.geometry.boundingBox) host.geometry.computeBoundingBox();
        const hs = host.geometry.boundingBox.getSize(new THREE.Vector3()).y * host.getWorldScale(new THREE.Vector3()).y;
        p.y += hs * 0.62;
        const q = p.project(camera);
        /* Never slide down over the face: if the bubble does not fit above the head it SHRINKS
           around its tail tip (min 0.62) instead of being pushed into the head. */
        const ax = (q.x * 0.5 + 0.5) * vw, ay = (-q.y * 0.5 + 0.5) * vh - 6;
        let sc = clamp((ay - 50) / b.tipY, 0.62, 1);
        let x = ax - b.tipX * sc, y = ay - b.tipY * sc;
        x = clamp(x, 8, Math.max(8, vw - b.W * sc - 8)); y = Math.max(46, y);
        /* Card stays clear: if the box (minus its tail) would reach into the card's screen rect,
           slide it outward first, then shrink around the tail tip (min 0.62). */
        if (cardRect) {
          const bodyBottom = () => y + (b.tipY - b.tailH) * sc, overlapsX = () => x < cardRect.x1 && x + b.W * sc > cardRect.x0;
          if (bodyBottom() > cardRect.y0 && overlapsX()) {
            if (b.actor.slot === 'A') x = Math.max(8, Math.min(x, cardRect.x0 - b.W * sc - 4)); else x = Math.min(vw - b.W * sc - 8, Math.max(x, cardRect.x1 + 4));
            if (overlapsX() && bodyBottom() > cardRect.y0) { sc = clamp(sc * (cardRect.y0 - y) / Math.max(1, (b.tipY - b.tailH) * sc), 0.62, sc); }
          }
        }
        /* The tail tip always points at the speaker's head centre: if the box had to move, the
           tail slides along the bottom edge (shaper tail -1…1 = 15 %…85 % of the width) and the
           bubble is re-inked once at the new tail position. */
        const tipNow = x + b.tipX * sc;
        if (Math.abs(tipNow - ax) > 6) {
          const want = ((ax - x) / sc - b.m) / b.shapeW;
          const t = clamp((want - 0.5) / 0.35, -1, 1);
          if (Math.abs(t - b.tail) > 0.02) {
            const nb = build(b.text, b.voice, b.actor.slot, b.seed, t);
            nb.el.style.opacity = b.el.style.opacity; b.el.replaceWith(nb.el);
            Object.assign(b, nb); b.el.style.transition = 'none';
            requestAnimationFrame(() => { if (b.el) b.el.style.transition = 'opacity .22s ease, transform .05s linear'; });
          }
          x = ax - b.tipX * sc;
        }
        b.el.style.transformOrigin = '0 0';
        b.el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + sc.toFixed(3) + ')';
        b.el.style.opacity = now < b.until ? '1' : '0';
      }
    },
  };
}

/* ── Mount ───────────────────────────────────────────────────────────────────────────────── */
export async function mountResidentScene(o) {
  const { THREE, GLTFLoader, parent, camera, overlay, recipe, getCardCanvas } = o;
  const base = o.base || new URL('./', import.meta.url).href;
  const log = o.log || ((s) => console.info('[resident-scene] ' + s));
  const P = recipe.pins, RIGS = 'https://cdn.jsdelivr.net/gh/' + P.repo + '@' + P.rigs + '/' + P.rigsPath;
  const [GM, PM, FH, TC] = await Promise.all([
    import(RIGS + 'frizzlegraft-v1/graft-mount.v1.js'),
    import(RIGS + 'petstudio-v9/studio-v3/pet-mouth.v1.js'),
    import(RIGS + 'frizzlegraft-v1/facehost.v1.js'),
    import(RIGS + 'lab-v6/texclean.js'),
  ]);
  const M = { mountGraft: GM.mountGraft, pickGraftPet: GM.pickGraftPet, PetMouth: PM.PetMouth, buildFaceHost: FH.buildFaceHost, paintOverRegion: TC.paintOverRegion };
  const sA = recipe.actors.find((a) => a.slot === 'A'), sB = recipe.actors.find((a) => a.slot === 'B');
  const [contract, seed, profile, shapes, cardCanvas] = await Promise.all([
    json(RIGS + sA.source.contract),
    json(base + sB.source.eyeProfile),
    json(base + sB.source.profile.split('#')[0]),
    json(base + 'donor/podcast-v5/bubble-shapes.json'),
    getCardCanvas(recipe.card),
  ]);
  let clips = null;
  if (recipe.motion && recipe.motion.library) {
    try { clips = (await new GLTFLoader().loadAsync(base + recipe.motion.library)).animations; log('[motion] library ' + recipe.motion.library + ' · ' + clips.length + ' clips'); }
    catch (e) { log('[motion] library unavailable, KayKit idle fallback: ' + e.message); }
  }

  const root = new THREE.Group(); root.name = 'resident-scene · ' + recipe.id;
  applyTransform(root, recipe.root);
  parent.add(root);
  const loader = new GLTFLoader();
  const [A, B] = await Promise.all([
    mountDriver({ THREE, loader, M, slot: sA, camera, contract, clips, log }),
    mountGoth({ THREE, loader, M, slot: sB, camera, contract, seed, profile, pin: P.rigs, clips, log }),
  ]);
  const card = await mountCard({ THREE, slot: recipe.card, canvas: cardCanvas, log });
  for (const [a, s] of [[A, sA], [B, sB]]) { applyTransform(a.wrap, s.transform); root.add(a.wrap); }
  root.add(card.pivot);
  const actors = { A, B };
  const bubbles = createBubbles({ overlay, shapes });

  const T = recipe.timing, beats = recipe.beats.slice().sort((a, b) => a.at - b.at);
  const end = (beats.find((b) => b.do === 'end') || beats[beats.length - 1]).at;
  const S = { t: 0, playing: true, variant: 0, fired: 0, label: 'idle', review: 'scene', ended: false, clock: 0, talkUntil: { A: 0, B: 0 }, gazeUntil: { A: 0, B: 0 }, reviewT: 0 };
  const talkDur = (text) => clamp(0.6 + text.split(/\s+/).length * T.talkSecondsPerWord, T.talkMin, T.talkMax);
  const lineOf = (slot, key) => { const pool = recipe.triplets[slot]; return (pool[S.variant % pool.length] || pool[0])[key]; };

  function targetPoint(key, from) {
    if (key === 'card') return card.focus();
    if (key === 'viewer') return camera.position.clone();
    const a = actors[key]; return a && a.host ? a.host.getWorldPosition(new THREE.Vector3()) : null;
  }
  function gaze(a, key, hold) {
    const pt = targetPoint(key, a); if (!pt || !a.host) return;
    a.host.updateWorldMatrix(true, false);
    const l = a.host.worldToLocal(pt.clone());
    const nx = clamp(Math.atan2(l.x, l.z) / 0.9, -1, 1), ny = clamp(Math.atan2(l.y, Math.hypot(l.x, l.z)) / 0.9, -1, 1);
    a.rig.setGazeFollow(true); a.rig.pointTo(nx, ny);
    S.gazeUntil[a.slot] = S.clock + hold;
  }
  function releaseAll() {
    for (const a of [A, B]) { a.rig.setGazeFollow(false); S.gazeUntil[a.slot] = 0; if (a.mouth) a.mouth.talk(false); S.talkUntil[a.slot] = 0; a.emote('neutral'); }
  }
  function fire(b) {
    if (b.label) S.label = b.label;
    const a = b.actor ? actors[b.actor] : null;
    if (b.do === 'settle') { releaseAll(); bubbles.clear(); [A, B].forEach((x) => x.motion && x.motion.idle()); }
    else if (b.do === 'motion' && a && a.motion) a.motion.react(b.clip, b.hold || 2);
    else if (b.do === 'card') card.reveal(S.clock);
    else if (b.do === 'emote' && a) a.emote(b.id);
    else if (b.do === 'gaze' && a) gaze(a, b.target, b.hold || 1.5);
    else if ((b.do === 'say' || b.do === 'think') && a) {
      const text = lineOf(a.slot, b.line); if (!text) return;
      const dur = talkDur(text);
      if (b.do === 'say' && a.mouth) { a.mouth.talk(true); S.talkUntil[a.slot] = S.clock + dur; }
      if (a.motion) { if (b.motion) a.motion.react(b.motion, dur + 0.4); else if (b.do === 'say') a.motion.talk(dur + 0.3); else if (b.thinkMotion) a.motion.react(b.thinkMotion, dur + 0.6); }
      const voice = b.do === 'think' ? 'whisper' : ((recipe.actors.find((x) => x.slot === a.slot) || {}).voice || 'mid');
      bubbles.show({ actor: a, text, voice, until: S.clock + dur + T.bubbleTail, seed: 11 + Math.round(b.at * 7), now: S.clock });
    } else if (b.do === 'end') { S.ended = true; S.label = 'settled · card inspectable'; }
  }
  function restart(variant) {
    if (variant != null) S.variant = variant;
    S.t = 0; S.fired = 0; S.ended = false; S.label = 'idle'; S.playing = true;
    releaseAll(); bubbles.clear(); card.hide();
  }

  /* Review lanes (isolation): same actors, same owners — only visibility and a talk loop. */
  const REVIEW = ['scene', 'actor-a', 'actor-b', 'mouths'];
  function setReview(mode) {
    if (!REVIEW.includes(mode)) mode = 'scene';
    S.review = mode; S.reviewT = 0;
    releaseAll(); bubbles.clear();
    A.wrap.visible = mode !== 'actor-b'; B.wrap.visible = mode !== 'actor-a';
    card.pivot.visible = mode === 'scene';
    const iso = mode !== 'scene';
    A.wrap.rotation.y = (iso ? (mode === 'mouths' ? 14 : 0) : sA.transform.yaw) * D2R;
    B.wrap.rotation.y = (iso ? (mode === 'mouths' ? -14 : 0) : sB.transform.yaw) * D2R;
    if (mode === 'scene') restart();
  }
  const CYCLE = ['neutral', 'happy', 'thinking', 'surprised', 'angry', 'neutral'];
  function reviewTick(dt) {
    S.reviewT += dt;
    const period = 3.4, k = Math.floor(S.reviewT / period), ph = S.reviewT - k * period;
    const list = S.review === 'actor-a' ? [A] : S.review === 'actor-b' ? [B] : [A, B];
    list.forEach((a, i) => {
      const talking = S.review === 'mouths' ? ((k + i) % 2 === 0 && ph < 2.2) : ph < 2.2;
      if (a.mouth && a.mouth.talking !== talking) { a.mouth.talk(talking); if (a.motion) { if (talking) a.motion.talk(null); else a.motion.idle(); } }
      if (ph < dt * 1.5) a.emote(CYCLE[k % CYCLE.length]);
    });
    S.label = S.review + ' · ' + CYCLE[k % CYCLE.length] + (ph < 2.2 ? ' · talk' : ' · rest');
  }

  function update(dt, cam, vw, vh) {
    S.clock += dt;
    if (S.review === 'scene') {
      if (S.playing && !S.ended) {
        S.t += dt;
        while (S.fired < beats.length && beats[S.fired].at <= S.t) fire(beats[S.fired++]);
      }
    } else reviewTick(dt);
    for (const a of [A, B]) {
      if (S.talkUntil[a.slot] && S.clock >= S.talkUntil[a.slot]) { a.mouth.talk(false); S.talkUntil[a.slot] = 0; }
      if (S.gazeUntil[a.slot] && S.clock >= S.gazeUntil[a.slot]) { a.rig.setGazeFollow(false); S.gazeUntil[a.slot] = 0; }
    }
    A.update(dt, cam); B.update(dt, cam);
    card.update(S.clock);
    bubbles.update({ now: S.clock, camera: cam, vw, vh, THREE, cardRect: card.pivot.visible && card.mesh.parent.visible ? card.screenRect(cam, vw, vh) : null });
  }

  restart(0);
  return {
    schema: SCHEMA, root, actors, card, recipe,
    update, restart, setReview,
    play() { S.playing = true; if (S.ended) restart(); }, pause() { S.playing = false; },
    showCard() { card.showNow(); },
    state() { return { t: S.t, duration: end, playing: S.playing, ended: S.ended, label: S.label, variant: S.variant, review: S.review }; },
    focus(mode) {
      const hp = (a) => a.host.getWorldPosition(new THREE.Vector3());
      if (mode === 'actor-a') return { target: hp(A), dist: 3.0 };
      if (mode === 'actor-b') return { target: hp(B), dist: 3.0 };
      if (mode === 'mouths') return { target: hp(A).add(hp(B)).multiplyScalar(0.5), dist: 4.6 };
      if (mode === 'card') return { target: card.focus(), dist: 1.55 };
      return null;
    },
    report() {
      let meshes = 0; root.traverse((n) => { if (n.isMesh) meshes++; });
      return { schema: SCHEMA, recipe: recipe.id, root: { name: root.name, position: root.position.toArray().map((v) => +v.toFixed(2)), yawDeg: +(root.rotation.y / D2R).toFixed(1), children: root.children.map((c) => c.name), meshes, baseplate: 'none' },
        owners: { eyeRigs: 2, mouths: 2, mixers: 2, motion: clips ? recipe.motion.library.split('/').pop() + ' · ' + clips.length + ' clips' : 'KayKit idle', bubbleDrawer: 'bubble-shaper.v2 paintBubble' },
        A: A.report(), B: B.report(), card: { owner: recipe.card.owner, deck: recipe.card.deck, index: recipe.card.index, name: recipe.card.name, px: cardCanvas.width + '×' + cardCanvas.height } };
    },
    dispose() { bubbles.clear(); A.dispose(); B.dispose(); card.dispose(); if (root.parent) root.parent.remove(root); },
  };
}
export default mountResidentScene;
