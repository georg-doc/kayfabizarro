// ============================================================================
// gear-icon.js — Das Zahnrad, das die Messwerte versteckt hält
// ----------------------------------------------------------------------------
// Ein KLEINER eigener Renderer (44 px, transparent) mit einem echten 3D-Zahnrad.
// Drei Zustände, wie Georg sie bestellt hat: Ruhe (langsame Drehung) · Hover
// (schneller, größer, Tuschekante hell) · aktiv/geklickt (rastet um 30° weiter,
// Farbe kippt auf Rot).
//
// ⚠ **Das GLB ist die Hauptsache, das gebaute Zahnrad nur der Rückweg.** Erste Fassung dieses
// Kopfes behauptete das Gegenteil („existiert im Repo nicht"), gestützt auf einen Baum-Filter
// über `georg-doc/kayfabizarro@main` — der listet BINÄRDATEIEN wie .glb aber gar nicht, die
// Suche konnte den Treffer also nie zeigen. Gemessen im laufenden Bild: `gear.source === 'GLB'`,
// Konsole `[gear] GEAR_ICON.glb geladen`. Eine Abwesenheit, die ein Werkzeug nicht sehen KANN,
// ist keine Abwesenheit — das ist die Lehre, nicht der Dateipfad.
// Der gebaute Kranz (Nabe, Zähne) bleibt trotzdem: er steht sofort, während das GLB lädt, und
// er trägt den Knopf, falls die RAW-URL einmal nicht antwortet. Welcher gerade läuft, sagt das
// Panel unter „Zahnrad".
// ============================================================================

const GLB_URL = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/GEAR_ICON.glb';

const CREAM = 0xefe6d0, INK = 0x1f1a14, RED = 0xb8352a;

export function createGearIcon(o = {}) {
  const THREE = o.THREE;
  const size = o.size || 44;

  const el = document.createElement('button');
  el.id = 'kfb-gear';
  el.type = 'button';
  el.title = 'Einstellungen (G)';
  el.setAttribute('aria-label', 'Einstellungen');

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.setSize(size, size, false);
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
  el.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 20);
  // Blickfeld: bei fov 34 und z = 3,1 ist das Bild 1,9 Einheiten hoch. Der gebaute Kranz spannt
  // 1,74 (Zahnspitze 0,87 im Radius), das eingepasste GLB 1,5 — beide passen mit Luft hinein.
  // Mit den vorherigen 2,35 wurden die Zähne am Rand angeschnitten (Bild 1,44 hoch).
  camera.position.set(0, 0.42, 3.1);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x30281f, 1.05));
  const key = new THREE.DirectionalLight(0xfff4dc, 1.35);
  key.position.set(1.4, 2.0, 2.2);
  scene.add(key);

  const holder = new THREE.Group();
  scene.add(holder);
  const gear = new THREE.Group();
  holder.add(gear);

  const matBody = new THREE.MeshStandardMaterial({ color: CREAM, roughness: 0.55, metalness: 0.1 });
  const matHub = new THREE.MeshStandardMaterial({ color: INK, roughness: 0.7, metalness: 0 });
  let source = 'geometrie';

  function buildGear() {
    const TEETH = 12, R = 0.66, TH = 0.22;
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(R, R, TH, 36), matBody);
    ring.rotation.x = Math.PI / 2;
    gear.add(ring);
    const toothGeo = new THREE.BoxGeometry(0.20, 0.24, TH);
    for (let i = 0; i < TEETH; i++) {
      const a = (i / TEETH) * Math.PI * 2;
      const t = new THREE.Mesh(toothGeo, matBody);
      t.position.set(Math.cos(a) * (R + 0.09), Math.sin(a) * (R + 0.09), 0);
      t.rotation.z = a + Math.PI / 2;
      gear.add(t);
    }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, TH + 0.06, 24), matHub);
    hub.rotation.x = Math.PI / 2;
    gear.add(hub);
  }
  buildGear();

  // Das GLB darf gewinnen, sobald es existiert — asynchron, ohne den Knopf zu blockieren.
  (async () => {
    try {
      const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
      const gltf = await new Promise((res, rej) => new GLTFLoader().load(GLB_URL, res, undefined, rej));
      const root = gltf && gltf.scene;
      if (!root) return;
      const box = new THREE.Box3().setFromObject(root);
      const span = Math.max(1e-3, Math.max(box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z));
      root.scale.setScalar(1.5 / span);
      const c = box.getCenter(new THREE.Vector3()).multiplyScalar(1.5 / span);
      root.position.sub(c);
      gear.clear();
      gear.add(root);
      source = 'GLB';
      console.info('[gear] GEAR_ICON.glb geladen');
    } catch (e) {
      console.info('[gear] GEAR_ICON.glb nicht geladen (' + ((e && e.message) || e) + ') — gebautes Zahnrad bleibt');
    }
  })();

  let hover = false, open = false, press = 0, spin = 0, snap = 0, rate = 0.55, scale = 1, tilt = 0;
  el.addEventListener('pointerenter', () => { hover = true; });
  el.addEventListener('pointerleave', () => { hover = false; });
  el.addEventListener('pointerdown', () => { press = 1; snap = Math.PI / 6; });
  addEventListener('pointerup', () => { press = 0; });
  el.addEventListener('click', () => { if (o.onClick) o.onClick(); });

  let last = performance.now(), raf = 0;
  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000) || 0.016;
    last = now;
    const wantRate = hover ? 2.6 : (open ? 1.2 : 0.55);
    rate += (wantRate - rate) * Math.min(1, dt * 6);
    spin += rate * dt;
    if (snap > 0) { const s = Math.min(snap, dt * 9); spin += s; snap -= s; }
    const wantScale = (hover ? 1.13 : 1) * (press ? 0.9 : 1);
    scale += (wantScale - scale) * Math.min(1, dt * 14);
    const wantTilt = open ? 0.42 : (hover ? 0.2 : 0);
    tilt += (wantTilt - tilt) * Math.min(1, dt * 8);
    gear.rotation.z = spin;
    holder.rotation.x = tilt * 0.5;
    holder.rotation.y = Math.sin(now * 0.0006) * 0.12 + tilt * 0.3;
    holder.scale.setScalar(scale);
    matBody.color.setHex(open ? RED : CREAM);
    matHub.color.setHex(open ? CREAM : INK);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);

  return {
    name: 'gear-icon', el,
    get source() { return source; },
    setOpen(on) { open = !!on; el.classList.toggle('an', open); },
    dispose() { cancelAnimationFrame(raf); renderer.dispose(); el.remove(); },
  };
}
