/* KFB HUD R4 · Ziel-Pfeil + Zielring als Knet-Objekte (Look-Spezifikation, kein Spielcode).
 * WS0 baut die GLB aus SPEC_HUD_R4.md §3; diese Datei ist das Modell zum Anschauen und Vergleichen.
 * Maße relativ zur Pfeillänge L = 1 (Spielmaß: L = 0,55 × Figurhöhe zu Fuß, 1,35× über dem Auto).
 * Achsen: vorne = −Z, oben = +Y. Drehpunkt bei 45 % der Länge ab Heck. yaw > 0 = links, pitch > 0 = Nase hoch. */
import * as THREE from 'three';

/* ---------- Daumenabdruck-Relief (Bump), einmal erzeugt ---------- */
let THUMB = null;
export function thumbTexture() {
  if (THUMB) return THUMB;
  const N = 512, c = document.createElement('canvas'); c.width = c.height = N;
  const g = c.getContext('2d'); g.fillStyle = '#808080'; g.fillRect(0, 0, N, N);
  let s = 7; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 2600; i++) { const v = 110 + r() * 36 | 0; g.fillStyle = `rgba(${v},${v},${v},.35)`; g.fillRect(r() * N, r() * N, 2 + r() * 3, 2 + r() * 3); }
  for (let k = 0; k < 7; k++) {
    const cx = r() * N, cy = r() * N, rot = r() * Math.PI, sx = 46 + r() * 30, sy = sx * (1.25 + r() * 0.25);
    g.save(); g.translate(cx, cy); g.rotate(rot);
    for (let i = 1; i < 14; i++) { g.beginPath(); g.ellipse(0, i * 0.8, sx * i / 14, sy * i / 14, 0, Math.PI * (0.05 + r() * 0.05), Math.PI * (1.95 - r() * 0.05)); g.strokeStyle = i % 2 ? 'rgba(160,160,160,.55)' : 'rgba(96,96,96,.55)'; g.lineWidth = 2.2; g.stroke(); }
    g.restore();
  }
  THUMB = new THREE.CanvasTexture(c); THUMB.wrapS = THUMB.wrapT = THREE.RepeatWrapping; THUMB.repeat.set(1.6, 1.6);
  return THUMB;
}
export const clayMat = (hex, o = {}) => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.86, metalness: 0, bumpMap: thumbTexture(), bumpScale: o.bump ?? 1.1, vertexColors: !!o.vc });

/* ---------- Umriss mit gerundeten Ecken ---------- */
function roundedShape(pts, radii) {
  const S = new THREE.Shape(), n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[i], a = pts[(i - 1 + n) % n], b = pts[(i + 1) % n], r = radii[i] ?? radii;
    const da = new THREE.Vector2(a[0] - p[0], a[1] - p[1]), db = new THREE.Vector2(b[0] - p[0], b[1] - p[1]);
    const la = da.length(), lb = db.length(); da.normalize(); db.normalize();
    const rr = Math.min(r, la * 0.45, lb * 0.45);
    const p1 = [p[0] + da.x * rr, p[1] + da.y * rr], p2 = [p[0] + db.x * rr, p[1] + db.y * rr];
    if (i === 0) S.moveTo(p1[0], p1[1]); else S.lineTo(p1[0], p1[1]);
    S.quadraticCurveTo(p[0], p[1], p2[0], p2[1]);
  }
  S.closePath(); return S;
}
/* Formen: R4 = Knet-Neumodell (Spender D „arrow-rounded“ weich nachgeformt), D und A = Nachbau nach Kontaktbogen (nur Vergleich). */
export const ARROW_KINDS = {
  R4: { label: 'R4 Knetpfeil (Neumodell nach D)', pts: [[-0.19, -0.5], [-0.19, 0.0], [-0.43, 0.0], [0, 0.5], [0.43, 0.0], [0.19, 0.0], [0.19, -0.5]], r: [0.085, 0.05, 0.075, 0.1, 0.075, 0.05, 0.085], depth: 0.13, bevel: 0.055, bevelSize: 0.05, seg: 5 },
  D: { label: 'D Kenney arrow-rounded (Nachbau)', pts: [[-0.25, -0.5], [-0.25, 0.04], [-0.5, 0.04], [-0.14, 0.5], [0.14, 0.5], [0.5, 0.04], [0.25, 0.04], [0.25, -0.5]], r: [0.03, 0.02, 0.05, 0.04, 0.04, 0.05, 0.02, 0.03], depth: 0.3, bevel: 0.012, bevelSize: 0.012, seg: 1 },
  A: { label: 'A Quaternius Arrow flach (Nachbau)', pts: [[-0.085, -0.5], [-0.085, 0.14], [-0.27, 0.14], [0, 0.5], [0.27, 0.14], [0.085, 0.14], [0.085, -0.5]], r: 0.01, depth: 0.06, bevel: 0.014, bevelSize: 0.014, seg: 1 }
};
const PIVOT_Z = 0.05;   // Drehpunkt 45 % ab Heck (Heck z = +0,5 → Drehpunkt bei z = +0,05 vor der Mitte)
export function arrowGeometry(kind = 'R4') {
  const K = ARROW_KINDS[kind] || ARROW_KINDS.R4;
  const g = new THREE.ExtrudeGeometry(roundedShape(K.pts, K.r), { depth: K.depth, bevelEnabled: true, bevelThickness: K.bevel, bevelSize: K.bevelSize, bevelSegments: K.seg, curveSegments: 10 });
  g.rotateX(-Math.PI / 2);                      // Umriss-y → −Z (vorne), Extrusion → +Y (oben)
  g.translate(0, -K.depth / 2, 0);
  g.computeBoundingBox(); const bb = g.boundingBox; g.translate(0, -(bb.min.y + bb.max.y) / 2, PIVOT_Z);
  g.computeVertexNormals();
  /* Helligkeit nach Lage: Oberseite hell, Flanke mitte, Unterseite dunkel (lesbare Neigung) */
  const n = g.attributes.normal, col = new Float32Array(n.count * 3);
  for (let i = 0; i < n.count; i++) { const y = n.getY(i); const k = y > 0 ? 1 + 0.16 * y : 1 + 0.5 * y; col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = k; }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}

/* Pfeil-Gruppe: root (Ort, yaw) → tilt (pitch) → body. Horizont-Kardanring nur im Flug. */
export function createArrow({ kind = 'R4', color = '#E8794A', cream = '#F3EBDD' } = {}) {
  const root = new THREE.Group(); root.name = 'kfb_target_arrow';
  const tilt = new THREE.Group(); tilt.name = 'pitch';
  const mat = clayMat(color, { vc: true });
  const body = new THREE.Mesh(arrowGeometry(kind), mat); body.name = 'arrow_body'; body.castShadow = true;
  tilt.add(body); root.add(tilt);
  const gyro = new THREE.Group(); gyro.name = 'horizon_ring';
  const gm = clayMat(cream, { bump: 0.6 });
  gyro.add(new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.032, 10, 64).rotateX(Math.PI / 2), gm));
  [-1, 1].forEach((sx) => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.065, 14, 10), gm); b.position.x = sx * 0.66; gyro.add(b); });
  const fwd = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), gm); fwd.position.z = -0.66; gyro.add(fwd);
  gyro.visible = false; root.add(gyro);
  return {
    root, body, gyro, mat,
    setKind(k) { body.geometry.dispose(); body.geometry = arrowGeometry(k); },
    setColor(hex) { mat.color.set(hex); },
    setYaw(r) { root.rotation.y = r; },
    setPitch(r) { tilt.rotation.x = r; },
    setFlight(on) { gyro.visible = !!on; },
    setScale(s) { root.scale.setScalar(s); }
  };
}

/* Zielring + Nadel. Ring R 1,6 m, Wulst 0,18 m (Pad-Gelb, 8 Daumen-Dellen), Filz-Einlage, Nadel 2,8 m mit Kugel 0,45 m. */
export function createTargetRing({ color = '#E9C14A', cream = '#F3EBDD', lo = '#B8901C' } = {}) {
  const g = new THREE.Group(); g.name = 'kfb_target_ring';
  const m = clayMat(color), mc = clayMat(cream, { bump: 0.6 }), ml = clayMat(lo);
  const torus = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.18, 14, 72).rotateX(Math.PI / 2), m); torus.position.y = 0.16; torus.name = 'ring';
  const felt = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 0.04, 56), new THREE.MeshStandardMaterial({ color: cream, roughness: 1, transparent: true, opacity: 0.55 })); felt.position.y = 0.03; felt.name = 'felt';
  for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, d = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), ml); d.position.set(Math.cos(a) * 1.6, 0.31, Math.sin(a) * 1.6); d.scale.y = 0.4; g.add(d); }
  const pin = new THREE.Group(); pin.name = 'pin';
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 2.4, 10), mc); stick.position.y = 1.2;
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.45, 24, 18), m); ball.position.y = 2.75;
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.06, 8, 32).rotateX(Math.PI / 2), mc); band.position.y = 2.75;
  pin.add(stick, ball, band);
  g.add(torus, felt, pin);
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return { root: g, pin, setColor(hex) { m.color.set(hex); }, mats: { m, mc, ml } };
}

/* Gedämpfte Drehung (V-335): Totzone, kritisch gedämpfte Feder ~0,3 s, Höchstgeschwindigkeit. Reine Funktion – WS1 kann sie übernehmen. */
export function createSteer({ settle = 0.3, deadDeg = 3, maxDegS = 240 } = {}) {
  let cur = 0, vel = 0, goal = 0;
  const w = 4 / settle;                       // kritische Dämpfung: ~98 % in `settle`
  const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  return {
    get value() { return cur; },
    set(v) { cur = goal = v; vel = 0; },
    /* Totzone: kleine Schwankungen um das letzte Ziel werden ignoriert, große übernommen */
    target(v) { if (Math.abs(wrap(v - goal)) * 180 / Math.PI > deadDeg) goal = cur + wrap(v - cur); },
    tick(dt) {
      const x = wrap(goal - cur);
      const acc = w * w * x - 2 * w * vel;
      vel += acc * dt; const mx = maxDegS * Math.PI / 180; vel = Math.max(-mx, Math.min(mx, vel));
      cur += vel * dt; return cur;
    }
  };
}

/* ---------- Schnappschuss-Bühne: ein Renderer, viele Bilder (die Tafel braucht keine 20 WebGL-Kontexte) ---------- */
export function createSnapper() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.shadowMap.enabled = true; renderer.setPixelRatio(1);
  const light = (scene) => {
    scene.add(new THREE.HemisphereLight(0xfff4e0, 0x3a3226, 1.25));
    const sun = new THREE.DirectionalLight(0xffffff, 1.8); sun.position.set(6, 11, 7); scene.add(sun);
    return sun;
  };
  const shot = (scene, cam, w, h, clear = null) => {
    renderer.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    if (clear) renderer.setClearColor(clear, 1); else renderer.setClearColor(0x000000, 0);
    renderer.render(scene, cam); return renderer.domElement.toDataURL('image/png');
  };
  /* eine Pfeil-Bühne, eine Ring-Bühne, wiederverwendet (Shader nur einmal kompilieren) */
  const aScene = new THREE.Scene(); light(aScene);
  const AR = createArrow({ kind: 'R4' }); aScene.add(AR.root);
  const aCam = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  const geos = {}; const geo = (k) => (geos[k] = geos[k] || arrowGeometry(k));
  AR.body.geometry.dispose(); AR.body.geometry = geo('R4');
  const rScene = new THREE.Scene(); light(rScene);
  const RR = createTargetRing({}); rScene.add(RR.root);
  const rCam = new THREE.PerspectiveCamera(30, 1, 0.1, 80);
  return {
    renderer,
    /* Pfeil allein, transparent, aus Verfolger-Sicht (leicht von oben hinten) */
    arrow({ kind = 'R4', color = '#E8794A', cream = '#F3EBDD', yaw = 0, pitch = 0, flight = false, w = 420, h = 320, camUp = 0.62, camBack = 2.7, fov = 30 } = {}) {
      AR.body.geometry = geo(kind); AR.setColor(color); AR.gyro.children.forEach((m) => m.material && m.material.color.set(cream));
      AR.setYaw(yaw); AR.setPitch(pitch); AR.setFlight(flight);
      aCam.fov = fov; aCam.position.set(0, camUp, camBack); aCam.lookAt(0, 0, 0);
      return shot(aScene, aCam, w, h);
    },
    ring({ color = '#E9C14A', cream = '#F3EBDD', lo = '#B8901C', w = 300, h = 260, camUp = 2.4, camBack = 9, fov = 30 } = {}) {
      RR.mats.m.color.set(color); RR.mats.mc.color.set(cream); RR.mats.ml.color.set(lo);
      rCam.fov = fov; rCam.position.set(0, camUp, camBack); rCam.lookAt(0, 1.3, 0);
      return shot(rScene, rCam, w, h);
    },
    /* Flug-Bild: Tafel-Bühne (hud-board-scene) mit Figur, Pfeil darüber, Ziel oben auf Schwebe-Insel oder unten am Boden */
    async flight({ B, T, pal, pitch = 0.52, yaw = 0.15, w = 1920, h = 1080, arrowColor, look = 0 } = {}) {
      const S = B.createBoardScene({ seed: 11 });
      if (pal) S.setBiome({ pal: { grass: pal.roles.top, paved: pal.roles.path, hill: pal.roles.hill[0], lip: pal.roles.leaf[0], grass2: pal.roles.leaf[1], rock: pal.roles.rock, water: pal.roles.water }, sky: [pal.roles.sky, pal.roles.cloud, pal.roles.cloud] });
      S.pose('fly');
      const up = pitch > 0;
      S.fig.position.set(0, up ? 5 : 15, 0);
      S.frame(true);
      const A = createArrow({ kind: 'R4', color: arrowColor || T.accent, cream: T.cream }); A.setFlight(true); A.setYaw(yaw); A.setPitch(pitch);
      A.root.position.set(0, S.fig.position.y + 2.35, 0.25); S.scene.add(A.root);
      const R = createTargetRing({ color: T.target || T.pad, cream: T.cream, lo: T.targetLo || T.padLo });
      if (up) {
        const isl = new THREE.Mesh(new THREE.SphereGeometry(6, 28, 18), clayMat(pal ? pal.roles.top : '#A7C48F')); isl.scale.set(1, 0.34, 1); isl.position.set(-16, 24, -78);
        const und = new THREE.Mesh(new THREE.ConeGeometry(5.4, 7, 9), clayMat(pal ? pal.roles.under[1] : '#9A6B4F')); und.rotation.x = Math.PI; und.position.set(-16, 20, -78);
        S.scene.add(isl, und); R.root.position.set(-16, 26, -78); R.root.scale.setScalar(1.7);
      } else { R.root.position.set(-5, 0.02, -26); R.root.scale.setScalar(1.6); }
      S.scene.add(R.root);
      const cam = S.camera; cam.fov = 52;
      cam.position.set(0, S.fig.position.y + 3.0, 7.6);
      cam.lookAt(0, S.fig.position.y + 1.6 + look, -4);
      renderer.shadowMap.enabled = true;
      const url = shot(S.scene, cam, w, h);
      const p = A.root.position.clone().project(cam);
      return { url, ax: (p.x + 1) / 2, ay: (1 - p.y) / 2, scale: (() => { const q = A.root.position.clone().add(new THREE.Vector3(0.5, 0, 0)).project(cam); return Math.abs(q.x - p.x) / 2 * 2; })() };
    },
    dispose() { renderer.dispose(); }
  };
}
