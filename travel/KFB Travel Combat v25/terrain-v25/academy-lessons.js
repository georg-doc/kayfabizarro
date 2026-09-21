// ============================================================================
// academy-lessons.js — KFB Travel · Slice S31 · Lektionen nach Adapter-Vertrag
// ----------------------------------------------------------------------------
// DER VERTRAG (eine Zeile, drei Verbote):
//
//   initLesson(THREE, ctx) → { scene, camera, update(dt), onPointer(u,v,type),
//                              resize(w,h), dispose() }
//
//   ctx = { width, height, data, progress() }   — KEIN Renderer, KEIN Canvas, KEIN RAF
//
//   ✗ kein `new THREE.WebGLRenderer`      (es gibt EINEN Renderer, den der Runner hält)
//   ✗ kein `setAnimationLoop` / `rAF`     (der Takt kommt von `update(dt)`)
//   ✗ kein `appendChild`                  (die Lektion hat kein DOM, sie hat ein Fenster)
//
// Der teuerste Einzelfall sind Controls, die sich an `renderer.domElement` binden
// (OrbitControls & Co.). Genau deshalb ist die ERSTE Lektion hier bewusst
// „Drag-Controls" und nicht die einfachste: die Zeiger-Bedienung wird von
// `onPointer(u, v, type)` HANDGEFÜTTERT — u/v kommen aus dem UV-Treffer auf dem
// Kartenfenster. Wer das einmal gebaut hat, weiß, was jede weitere Demo kostet.
//
// `u`/`v` sind 0..1 im Fenster (v = 0 unten, wie THREE-UV). `type` ist
// 'down' | 'move' | 'up' | 'leave'.
// ============================================================================

const ZONE = [0xb5642a, 0x5e6f33, 0x6b4f9c, 0x9a4f86, 0x3e6a83, 0x8f3a5f];
const PAPER = 0xefe6d0;

const ndc = (u, v) => ({ x: u * 2 - 1, y: v * 2 - 1 });

// ---------------------------------------------------------------------------
// Kapitel 04 · Lektion 1 — „Drag-Controls" (three.js: misc_controls_drag)
// Acht Körper auf einer Platte. Ziehen greift den Körper unter dem Zeiger und
// schiebt ihn auf der Platte; ziehen im Leeren kreist die Kamera. Das ist der
// Refactor-Fall, an dem sich alles entscheidet — hier ohne jedes Control-Objekt.
// ---------------------------------------------------------------------------
function initDrag(THREE, ctx) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xdfe7ea);
  const camera = new THREE.PerspectiveCamera(46, ctx.width / ctx.height, 0.1, 120);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x707060, 1.15));
  const key = new THREE.DirectionalLight(0xfff4e2, 1.5);
  key.position.set(6, 11, 5); scene.add(key);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(26, 26),
    new THREE.MeshLambertMaterial({ color: PAPER }));
  floor.rotation.x = -Math.PI / 2; scene.add(floor);
  const grid = new THREE.GridHelper(26, 13, 0x1f1a14, 0x1f1a14);
  grid.material.transparent = true; grid.material.opacity = 0.18; scene.add(grid);

  const bodies = [];
  for (let i = 0; i < 8; i++) {
    const s = 1.5 + (i % 3) * 0.55;
    const geo = i % 3 === 0 ? new THREE.BoxGeometry(s, s, s)
      : i % 3 === 1 ? new THREE.IcosahedronGeometry(s * 0.62, 0)
        : new THREE.CylinderGeometry(s * 0.45, s * 0.45, s, 12);
    const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color: ZONE[i % ZONE.length] }));
    const a = (i / 8) * Math.PI * 2;
    mesh.position.set(Math.cos(a) * 6.4, s / 2, Math.sin(a) * 6.4);
    mesh.userData.rest = s / 2;
    scene.add(mesh); bodies.push(mesh);
  }

  // Kamera-Orbit als zwei Zahlen — kein Controls-Objekt, kein domElement.
  let yaw = 0.7, pitch = 0.72, dist = 19, spin = 0.06;
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hitPt = new THREE.Vector3(), grabOff = new THREE.Vector3();
  let grabbed = null, last = null, hover = null;

  function placeCamera() {
    camera.position.set(Math.sin(yaw) * Math.cos(pitch) * dist, Math.sin(pitch) * dist, Math.cos(yaw) * Math.cos(pitch) * dist);
    camera.lookAt(0, 1.2, 0);
  }
  placeCamera();

  function onPointer(u, v, type) {
    const p = ndc(u, v);
    if (type === 'down') {
      ray.setFromCamera(p, camera);
      const hit = ray.intersectObjects(bodies, false)[0];
      if (hit) {
        grabbed = hit.object;
        plane.constant = -grabbed.position.y;
        if (ray.ray.intersectPlane(plane, hitPt)) grabOff.subVectors(grabbed.position, hitPt);
        grabbed.material.emissive = new THREE.Color(0x000000);
      }
      last = p;
      return;
    }
    if (type === 'move') {
      if (grabbed) {
        ray.setFromCamera(p, camera);
        if (ray.ray.intersectPlane(plane, hitPt)) {
          grabbed.position.x = Math.max(-11, Math.min(11, hitPt.x + grabOff.x));
          grabbed.position.z = Math.max(-11, Math.min(11, hitPt.z + grabOff.z));
          grabbed.position.y = grabbed.userData.rest + 0.55;   // angehoben, solange gegriffen
        }
      } else if (last) {
        yaw -= (p.x - last.x) * 1.6;
        pitch = Math.max(0.12, Math.min(1.35, pitch + (p.y - last.y) * 1.1));
        placeCamera();
      }
      last = p;
      // Hover-Marke nur, wenn nichts gegriffen ist (sonst zappelt sie beim Ziehen)
      if (!grabbed) { ray.setFromCamera(p, camera); const h = ray.intersectObjects(bodies, false)[0]; hover = h ? h.object : null; }
      return;
    }
    grabbed = null; last = null; hover = null;
  }

  function update(dt) {
    if (!grabbed && !last) { yaw += dt * spin; placeCamera(); }
    for (const b of bodies) {
      const t = b === grabbed ? b.userData.rest + 0.55 : b.userData.rest;
      b.position.y += (t - b.position.y) * Math.min(1, dt * 8);
      b.rotation.y += dt * (b === hover ? 1.1 : 0.16);
    }
  }

  return {
    scene, camera, update, onPointer,
    resize(w, h) { camera.aspect = w / h; camera.updateProjectionMatrix(); },
    dispose() {
      scene.traverse((n) => { if (n.isMesh) { n.geometry.dispose(); n.material.dispose(); } });
      grid.geometry.dispose(); grid.material.dispose();
    },
  };
}

// ---------------------------------------------------------------------------
// Kapitel 02 · Lektion 1 — „Instancing" (three.js: webgl_instancing_dynamic)
// 1200 Würfel, EIN Draw-Call, jede Matrix pro Frame neu geschrieben. Die Lektion
// ist genau das: dynamisches Instancing kostet CPU, nicht Draw-Calls. Ziehen
// dreht das Feld — Steuerung wieder ohne Controls-Objekt.
// ---------------------------------------------------------------------------
function initInstancing(THREE, ctx) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x121018);
  const camera = new THREE.PerspectiveCamera(52, ctx.width / ctx.height, 0.1, 300);
  camera.position.set(0, 16, 42); camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xbcd0ff, 0x201828, 1.3));
  const key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(8, 14, 10); scene.add(key);

  const N = 1200, SIDE = Math.round(Math.sqrt(N));
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshLambertMaterial({ color: 0xffffff }), N);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const col = new THREE.Color();
  for (let i = 0; i < N; i++) {
    col.setHex(ZONE[i % ZONE.length]).offsetHSL(0, 0, ((i * 37) % 100) / 480);
    mesh.setColorAt(i, col);
  }
  scene.add(mesh);

  const _m = new THREE.Matrix4(), _p = new THREE.Vector3(), _q = new THREE.Quaternion(), _s = new THREE.Vector3(1, 1, 1), _e = new THREE.Euler();
  let T = 0, yaw = 0, vel = 0.22, last = null;

  function update(dt) {
    T += dt; yaw += vel * dt; vel += (0.22 - vel) * Math.min(1, dt * 1.4);
    for (let i = 0; i < N; i++) {
      const gx = (i % SIDE) - SIDE / 2, gz = Math.floor(i / SIDE) - SIDE / 2;
      const r = Math.hypot(gx, gz);
      const wave = Math.sin(T * 1.6 - r * 0.42) * 2.6 + Math.sin(T * 0.9 + gx * 0.3) * 0.9;
      _p.set(gx * 1.55, wave, gz * 1.55);
      _e.set(wave * 0.2, yaw + r * 0.05, 0);
      _q.setFromEuler(_e);
      const sc = 0.55 + Math.max(0, wave) * 0.16;
      _s.set(sc, sc, sc);
      _m.compose(_p, _q, _s);
      mesh.setMatrixAt(i, _m);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.rotation.y = yaw * 0.15;
  }

  return {
    scene, camera, update,
    onPointer(u, v, type) {
      const p = ndc(u, v);
      if (type === 'down') { last = p; return; }
      if (type === 'move' && last) { vel += (last.x - p.x) * 6; last = p; return; }
      last = null;
    },
    resize(w, h) { camera.aspect = w / h; camera.updateProjectionMatrix(); },
    dispose() { mesh.geometry.dispose(); mesh.material.dispose(); mesh.dispose(); },
  };
}

// ---------------------------------------------------------------------------
// Meta · Der HUB (KFB, keine three.js-Vorlage). Die Reise selbst als Objekt:
// fünf Zonen-Reihen à sechs Würfel, besuchte stehen aufrecht und leuchten in der
// Zonenfarbe, offene liegen blass. Kein Punktestand — man SIEHT, wo man war.
// ---------------------------------------------------------------------------
function initHub(THREE, ctx) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x16121a);
  const camera = new THREE.PerspectiveCamera(42, ctx.width / ctx.height, 0.1, 120);
  camera.position.set(0.4, 7.4, 15.5); camera.lookAt(0, 0.4, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x30283a, 1.25));
  const key = new THREE.DirectionalLight(0xfff0d8, 1.2); key.position.set(5, 10, 8); scene.add(key);

  const cells = [];
  const geo = new THREE.BoxGeometry(1.25, 1.25, 1.25);
  for (let c = 0; c < 5; c++) {
    for (let i = 0; i < 6; i++) {
      const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ color: ZONE[c] }));
      m.position.set((i - 2.5) * 1.85, 0, (c - 2) * 2.15);
      m.userData.k = c * 6 + i;
      scene.add(m); cells.push(m);
    }
  }
  let T = 0, yaw = 0, last = null, vel = 0.1;

  function update(dt) {
    T += dt; yaw += vel * dt; vel += (0.1 - vel) * Math.min(1, dt * 1.5);
    const p = ctx.progress ? ctx.progress() : null;
    const flags = (p && p.flags) || [];
    for (const m of cells) {
      const on = !!flags[m.userData.k];
      const ty = on ? 1.1 + Math.sin(T * 1.7 + m.userData.k) * 0.12 : 0.1;
      m.position.y += (ty - m.position.y) * Math.min(1, dt * 4);
      const s = on ? 1 : 0.52;
      m.scale.y += (s - m.scale.y) * Math.min(1, dt * 4);
      m.material.opacity = 1;
      if (m.material.emissive) m.material.emissive.setHex(on ? ZONE[Math.floor(m.userData.k / 6)] : 0x000000);
      if (m.material.emissiveIntensity != null) m.material.emissiveIntensity = on ? 0.35 : 0;
    }
    camera.position.set(Math.sin(yaw * 0.5) * 4 + 0.4, 7.4, 15.5);
    camera.lookAt(0, 0.4, 0);
  }

  return {
    scene, camera, update,
    onPointer(u, v, type) {
      const p = ndc(u, v);
      if (type === 'down') { last = p; return; }
      if (type === 'move' && last) { vel += (p.x - last.x) * 4; last = p; return; }
      last = null;
    },
    resize(w, h) { camera.aspect = w / h; camera.updateProjectionMatrix(); },
    dispose() { geo.dispose(); for (const m of cells) m.material.dispose(); },
  };
}

// Registry: Schlüssel ist die three.js-Beispiel-Id aus dem Curriculum. Was hier fehlt,
// bleibt Blatt mit Fenster — die Fallback-Leiter ist kein Notplan, sondern der Normalfall,
// solange nur drei von 31 Lektionen live sind. **Keine Blanko-Wette auf 30.**
export const LESSONS = {
  misc_controls_drag: initDrag,
  webgl_instancing_dynamic: initInstancing,
  kfb_academy_hub: initHub,
};

export const hasLesson = (example) => !!LESSONS[example];
export function initLesson(THREE, example, ctx) {
  const f = LESSONS[example];
  return f ? f(THREE, ctx) : null;
}
