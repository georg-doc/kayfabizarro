/* Tafel-Bühne für HUD + Flug-VFX: kleine Knet-Insel, Platzhalter-Figur mit Jetpack, Platzhalter-Kart.
 * Nur für die Bildtafeln. Im Lab übernehmen Figur, Jetpack (Combat-Mech-Geschenk) und Welt ihre echten Owner. */
import * as THREE from 'three';

const clay = (c, r = 0.92) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: 0 });
function lump(r, seed, sx = 1, sy = 1, sz = 1) {
  const g = new THREE.SphereGeometry(r, 18, 12), p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const k = 1 + 0.06 * Math.sin(v.x * 4 + seed) * Math.cos(v.z * 3.3 - seed) + 0.04 * Math.sin(v.y * 5 + seed * 2); p.setXYZ(i, v.x * k * sx, v.y * k * sy, v.z * k * sz); }
  g.computeVertexNormals(); return g;
}
const rng = (s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; };

export function createBoardScene({ seed = 11 } = {}) {
  const R = rng(seed);
  const scene = new THREE.Scene();
  const cv = document.createElement('canvas'); cv.width = 4; cv.height = 256;
  const g2 = cv.getContext('2d'), gr = g2.createLinearGradient(0, 0, 0, 256);
  gr.addColorStop(0, '#A9CBE0'); gr.addColorStop(0.55, '#D9E6E6'); gr.addColorStop(1, '#F3E3CF');
  g2.fillStyle = gr; g2.fillRect(0, 0, 4, 256);
  const sky = new THREE.CanvasTexture(cv); sky.colorSpace = THREE.SRGBColorSpace; scene.background = sky;
  const paintSky = (a, b, c) => { const g = g2.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, a); g.addColorStop(0.55, b); g.addColorStop(1, c); g2.fillStyle = g; g2.fillRect(0, 0, 4, 256); sky.needsUpdate = true; };
  scene.fog = new THREE.Fog('#E4E3DA', 60, 190);
  scene.add(new THREE.HemisphereLight('#F4F0FF', '#8E9C72', 1.25));
  const sun = new THREE.DirectionalLight('#FFF1DE', 2.1); sun.position.set(-18, 30, 14); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 90 }); sun.shadow.bias = -0.0008;
  scene.add(sun, sun.target);

  const groundM = clay('#A7C48F'), pathM = clay('#E6D3AE');
  const ground = new THREE.Mesh(new THREE.CircleGeometry(220, 48).rotateX(-Math.PI / 2), groundM); ground.receiveShadow = true; scene.add(ground);
  const path = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 440).rotateX(-Math.PI / 2), pathM); path.position.y = 0.02; path.receiveShadow = true; scene.add(path);
  /* Wasser: Seen quer über den Weg, alle 200 m (−z 100…170) – für den Überflug-Effekt */
  const WATER_PERIOD = 200, W0 = 100, W1 = 170;
  const isWater = (z) => { const m = (((-z) % WATER_PERIOD) + WATER_PERIOD) % WATER_PERIOD; return m >= W0 && m <= W1; };
  const waterM = new THREE.MeshStandardMaterial({ color: '#86BCCB', roughness: 0.35, metalness: 0 });
  const lakes = [0, 1].map(() => { const w = new THREE.Mesh(new THREE.PlaneGeometry(260, W1 - W0).rotateX(-Math.PI / 2), waterM); w.position.y = 0.04; w.receiveShadow = true; scene.add(w); return w; });
  const surfaceAt = (x, z) => (isWater(z) ? { y: 0.04, water: true } : { y: 0, water: false });

  /* Streu-Objekte, wickeln um die Figur herum (Tafel braucht keine echte Welt) */
  const props = [], TILE = 120;
  const trunkM = clay('#9A6B4F'), crownA = clay('#77AA6C'), crownB = clay('#93BE73'), hillM = clay('#96B983'), houseM = clay('#F3E6D2'), roofM = clay('#E58F6E'), stoneM = clay('#C9BBA6');
  for (let i = 0; i < 64; i++) {
    const kind = R() < 0.55 ? 'tree' : R() < 0.5 ? 'hill' : R() < 0.6 ? 'house' : 'stone';
    const o = new THREE.Group();
    if (kind === 'tree') {
      const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.26, 1.6, 8), trunkM); tr.position.y = 0.8;
      const cr = new THREE.Mesh(lump(1.25 + R() * 0.6, i, 1, 1.1, 1), R() < 0.5 ? crownA : crownB); cr.position.y = 2.4;
      o.add(tr, cr);
    } else if (kind === 'hill') { const h = new THREE.Mesh(lump(4 + R() * 4, i, 1.4, 0.45, 1.1), hillM); o.add(h); }
    else if (kind === 'house') {
      const b = new THREE.Mesh(lump(1, i, 1.6, 1.2, 1.4), houseM); b.position.y = 1.1;
      const rf = new THREE.Mesh(new THREE.ConeGeometry(2.0, 1.5, 6), roofM); rf.position.y = 2.7; rf.rotation.y = R();
      o.add(b, rf);
    } else { const s = new THREE.Mesh(lump(0.5 + R() * 0.5, i, 1.2, 0.7, 1), stoneM); s.position.y = 0.2; o.add(s); }
    let x = (R() - 0.5) * TILE; if (Math.abs(x) < 4.5) x += Math.sign(x || 1) * 5;
    o.position.set(x, 0, (R() - 0.5) * TILE); o.rotation.y = R() * 6.28;
    o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
    scene.add(o); props.push(o);
  }

  /* Platzhalter-Figur (Knet) mit Jetpack */
  const fig = new THREE.Group(); fig.name = 'placeholderFigure'; fig.rotation.order = 'YXZ';
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.55, 6, 14), clay('#E56F5B')); body.position.y = 0.78;
  const head = new THREE.Mesh(lump(0.3, 3), clay('#F3D2B3')); head.position.y = 1.5;
  const eyeM = clay('#2D2340', 0.6), eL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), eyeM), eR = eL.clone(); eL.position.set(-0.1, 1.53, -0.27); eR.position.set(0.1, 1.53, -0.27);
  const legM = clay('#5B4A86'), lL = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.3, 4, 8), legM), lR = lL.clone(); lL.position.set(-0.15, 0.25, 0); lR.position.set(0.15, 0.25, 0);
  const jet = new THREE.Group(); jet.name = 'jetpack'; jet.position.set(0, 0.9, 0.36);
  const tankM = clay('#A895D2'), nozM = clay('#4A3D6B'), bandM = clay('#FFA97A');
  [-0.15, 0.15].forEach((x) => {
    const t = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.32, 4, 12), tankM); t.position.set(x, 0.04, 0.04);
    const b = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.035, 6, 14).rotateX(Math.PI / 2), bandM); b.position.set(x, 0.1, 0.04);
    const n = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.1, 0.12, 12), nozM); n.position.set(x, -0.27, 0.04);
    jet.add(t, b, n);
  });
  fig.add(body, head, eL, eR, lL, lR, jet);
  fig.traverse((m) => { if (m.isMesh) m.castShadow = true; });
  scene.add(fig);
  const nozzles = [-0.15, 0.15].map((x) => ({ object: jet, offset: [x, -0.34, 0.04], dir: [0, -1, 0.25], scale: 1 }));
  /* Speedline-Anker: Außenkanten der Tanks bzw. hintere Kart-Ecken */
  const trailsFly = [-0.29, 0.29].map((x) => ({ object: jet, offset: [x, -0.18, 0.06] }));

  /* Platzhalter-Kart (Fahren) */
  const kart = new THREE.Group(); kart.name = 'placeholderKart';
  const kb = new THREE.Mesh(lump(1, 5, 0.8, 0.32, 1.25), clay('#FFA97A')); kb.position.y = 0.42;
  kart.add(kb);
  [[-0.7, -0.8], [0.7, -0.8], [-0.7, 0.85], [0.7, 0.85]].forEach(([x, z]) => { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.22, 14).rotateZ(Math.PI / 2), clay('#3D3359')); w.position.set(x, 0.28, z); kart.add(w); });
  kart.traverse((m) => { if (m.isMesh) m.castShadow = true; });
  kart.visible = false; scene.add(kart);
  const trailsDrive = [-0.82, 0.82].map((x) => ({ object: kart, offset: [x, 0.5, 1.2] }));

  const camera = new THREE.PerspectiveCamera(52, 16 / 9, 0.1, 400);
  const look = new THREE.Vector3(), camGoal = new THREE.Vector3();
  let mode = 'walk';

  function pose(m) {
    mode = m; kart.visible = m === 'drive';
    fig.rotation.set(0, 0, 0); lL.rotation.x = lR.rotation.x = 0; body.position.y = 0.78; lL.visible = lR.visible = true; jet.visible = m === 'fly';
    if (m === 'drive') fig.position.y = 0.45;
    if (m === 'fly') { fig.rotation.x = -0.55; }
  }
  /* Kamera: Verfolger hinter der Figur; im Flug etwas höher und weiter */
  function frame(snap = false, dt = 0.016) {
    const P = fig.position;
    const off = mode === 'fly' ? [0, 2.4, 7.4] : mode === 'drive' ? [0, 2.6, 7.2] : [0, 2.3, 5.8];
    camGoal.set(P.x + off[0], P.y + off[1], P.z + off[2]);
    if (snap) camera.position.copy(camGoal); else camera.position.lerp(camGoal, 1 - Math.exp(-6 * dt));
    look.set(P.x, P.y + (mode === 'fly' ? 1.0 : 1.2), P.z - 3); camera.lookAt(look);
    kart.position.set(P.x, 0, P.z); kart.rotation.y = fig.rotation.y;
    const k = Math.floor(-P.z / WATER_PERIOD); lakes.forEach((w, i) => { w.position.z = -((k + i) * WATER_PERIOD + (W0 + W1) / 2); w.position.x = P.x; });
    sun.position.set(P.x - 18, 30, P.z + 14); sun.target.position.copy(P);
    ground.position.set(P.x, 0, P.z); path.position.z = P.z;
    for (const o of props) { while (o.position.z > P.z + TILE / 2) o.position.z -= TILE; while (o.position.z < P.z - TILE / 2) o.position.z += TILE; o.visible = !isWater(o.position.z + 6) && !isWater(o.position.z - 6); }
  }
  pose('walk'); frame(true);
  /* Biom-Palette (BIOMES[x] aus kfb-jukebox-data.js): Boden, Weg, Hügel, Kronen, Steine, Wasser, Himmel */
  const DEF = { grass: '#A7C48F', paved: '#E6D3AE', hill: '#96B983', lip: '#77AA6C', grass2: '#93BE73', rock: '#C9BBA6', water: '#86BCCB' };
  function setBiome(b) {
    const p = (b && b.pal) || DEF;
    groundM.color.set(p.grass); pathM.color.set(p.paved); hillM.color.set(p.hill); crownA.color.set(p.lip); crownB.color.set(p.grass2);
    stoneM.color.set(p.rock); waterM.color.set(p.water);
    const sk = (b && b.sky) || ['#A9CBE0', '#D9E6E6', '#F3E3CF']; paintSky(sk[0], sk[1], sk[2]); scene.fog.color.set(sk[1]);
  }
  return { scene, camera, fig, jet, kart, legs: [lL, lR], nozzles, setBiome, trailsFly, trailsDrive, surfaceAt, isWater, pose, frame, get mode() { return mode; } };
}
