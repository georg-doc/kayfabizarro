// KFB Cologne Race · Option C · Requisiten und Kartenbild
//
// Kenney Racing Kit — byteweise geprueft, nicht aus einer Ordneransicht geschlossen:
//   billboard.glb          14 520 B   @2ff8b350beef
//   camera_exclusive.glb   11 560 B   @2ff8b350beef
// (Die Ordneransicht des Repos listet unter kenney_racing-kit nur Preview.png und
//  Sample.png. Die Modelle sind trotzdem da — Byte-Abfrage auf den Pfad.)
//
// Kartenbild: der echte Vertrag aus overworld/overworld/card-art-2d.js (blob 9485bdee).
// Verwendet wird der Weg `quarter()` — Seite rendern, rohes 2x2-Viertel schneiden.
// Kein erfundenes Kartenmotiv, kein Ersatzbild.

import { C } from './option-c-style.v1.js';
import { RAW } from './cologne-world.v1.js';

const PDFJS = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.min.mjs';
const PDFJS_WORKER = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs';

export const CARD_POOL = [
  { packId: 'forget_utopia', n: 7 },
  { packId: 'embrace_protopia', n: 12 },
  { packId: 'medkayfab_cardiology', n: 5 }
];

// ---------------------------------------------------------- Kartenbild
export async function renderCardQuarter(pick) {
  const reg = await (await fetch(RAW('media/kfb/index.json'))).json();
  const deck = (reg.decks || []).find(d => d.packId === pick.packId);
  if (!deck || !deck.pdf) throw new Error('deck not in registry: ' + pick.packId);

  const lib = await import(/* @vite-ignore */ PDFJS);
  // Gemessen: ein Worker von einer fremden Herkunft laesst sich nicht bauen. pdf.js
  // meldet den Fehler auf der Konsole und rechnet still auf dem Hauptfaden weiter —
  // eine 1400-px-Seite mitten in einer 120-fps-Szene. Das Skript wird deshalb geholt
  // und als gleichherkuenftiges Blob-URL uebergeben.
  if (!renderCardQuarter._worker) {
    const src = await (await fetch(PDFJS_WORKER)).text();
    renderCardQuarter._worker = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
  }
  lib.GlobalWorkerOptions.workerSrc = renderCardQuarter._worker;

  const url = reg.baseUrl + '/' + encodeURIComponent(deck.pdf);
  const doc = await lib.getDocument({ url }).promise;

  const off = deck.coverOffset != null ? deck.coverOffset : 1;
  const num = off + 1 + Math.floor((pick.n - 1) / 4);
  const qi = (pick.n - 1) % 4;
  if (num < 1 || num > doc.numPages) throw new Error('page ' + num + ' of ' + doc.numPages);

  const page = await doc.getPage(num);
  const scale = 1400 / page.getViewport({ scale: 1 }).width;
  const vp = page.getViewport({ scale });
  const cv = document.createElement('canvas');
  cv.width = Math.ceil(vp.width); cv.height = Math.ceil(vp.height);
  await page.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise;

  const cw = Math.floor(cv.width / 2), ch = Math.floor(cv.height / 2);
  const out = document.createElement('canvas');
  out.width = cw; out.height = ch;
  out.getContext('2d').drawImage(cv, (qi % 2) * cw, ((qi / 2) | 0) * ch, cw, ch, 0, 0, cw, ch);

  return {
    canvas: out, ar: cw / ch, page: num, quadrant: qi,
    packId: pick.packId, cardNumber: pick.n, title: deck.title,
    pdf: deck.pdf, pages: doc.numPages, method: 'quarter-page (card-art-2d.js v1.2 contract)'
  };
}

// ------------------------------------------------------------ Billboard
export async function buildBillboard(THREE, GLTFLoader, route, frac = 0.062) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(RAW('media/3D_Assets/kenney_racing-kit/Models/GLTF format/billboard.glb'));
  const model = gltf.scene;

  const raw = new THREE.Box3().setFromObject(model);
  const size = raw.getSize(new THREE.Vector3());
  const TARGET_H = 13.5;
  const scale = TARGET_H / Math.max(0.001, size.y);
  model.scale.setScalar(scale);
  model.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

  const p = route.sampleAt(route.length * frac);
  const holder = new THREE.Group();
  holder.name = 'kenney-billboard';
  const side = p.w * 0.5 + 11;
  holder.position.set(p.x + p.nx * side, p.y, p.z + p.nz * side);
  // Zur Fahrbahn gedreht, nicht zufaellig gestellt
  holder.rotation.y = Math.atan2(-p.nx, -p.nz);
  holder.add(model);

  const box = new THREE.Box3().setFromObject(model);
  const bs = box.getSize(new THREE.Vector3());

  // Kartenflaeche vor der Tafel, Querformat (§16: keine gequetschten Hochformate)
  const panelW = bs.x * 0.86;
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(panelW, panelW * 0.66),
    new THREE.MeshBasicMaterial({ color: 0x1b2430 })
  );
  panel.position.set(0, box.max.y - bs.y * 0.34, bs.z * 0.5 + 0.22);
  panel.name = 'billboard-card-surface';
  holder.add(panel);

  return {
    group: holder, panel, model,
    measuredM: { x: +bs.x.toFixed(2), y: +bs.y.toFixed(2), z: +bs.z.toFixed(2) },
    scale: +scale.toFixed(4),
    setCard(card) {
      const tex = new THREE.CanvasTexture(card.canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      panel.material.dispose();
      panel.material = new THREE.MeshBasicMaterial({ map: tex });
      const w = panelW;
      panel.geometry.dispose();
      panel.geometry = new THREE.PlaneGeometry(w, w / card.ar);
      panel.position.y = box.max.y - bs.y * 0.34;
    }
  };
}

// ---------------------------------------------------- CCTV-Heldenkameras
export async function buildCCTV(THREE, GLTFLoader, cams) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(RAW('media/3D_Assets/kenney_racing-kit/Models/GLTF format/camera_exclusive.glb'));
  const proto = gltf.scene;
  const raw = new THREE.Box3().setFromObject(proto);
  const size = raw.getSize(new THREE.Vector3());
  const scale = 3.4 / Math.max(0.001, size.y);

  const group = new THREE.Group();
  group.name = 'cctv-hero-cameras';
  const flashes = [];

  for (const c of cams) {
    const m = proto.clone(true);
    m.scale.setScalar(scale);
    m.traverse(o => { if (o.isMesh) o.castShadow = true; });
    const holder = new THREE.Group();
    holder.name = c.cameraId;
    holder.position.set(c.position.x, c.position.y, c.position.z);
    holder.lookAt(c.lookAt.x, c.lookAt.y, c.lookAt.z);
    holder.add(m);

    // Mast bis zum Boden, damit die Kamera nicht in der Luft steht
    const h = Math.max(1, c.position.y);
    const mast = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.42, h, 8),
      new THREE.MeshStandardMaterial({ color: C.structureLo, roughness: 0.95 })
    );
    mast.position.set(c.position.x, h * 0.5, c.position.z);
    mast.castShadow = true;
    group.add(mast);

    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 10, 8),
      new THREE.MeshBasicMaterial({ color: C.lineYellow, transparent: true, opacity: 0 })
    );
    bulb.position.set(c.position.x, c.position.y + 1.2, c.position.z);
    group.add(bulb);
    flashes.push({ bulb, meta: c, armed: true, until: 0 });
    group.add(holder);
  }

  return {
    group, flashes, scale: +scale.toFixed(4),
    // Ausloesen, wenn der Fahrer den Triggerradius betritt; Blitz + Aufnahme-Metadaten
    check(d, t, onShot) {
      for (const f of flashes) {
        const dist = Math.hypot(d.x - f.meta.lookAt.x, d.z - f.meta.lookAt.z);
        if (f.armed && dist < f.meta.triggerRadius) {
          f.armed = false; f.until = t + 0.42;
          onShot && onShot({
            cameraId: f.meta.cameraId, criterion: f.meta.criterion, shotType: f.meta.shotType,
            routeS: f.meta.routeS, fov: f.meta.fov, atSeconds: +t.toFixed(2),
            speedMs: +Math.abs(d.speed).toFixed(1),
            vehicleWorld: { x: +d.x.toFixed(1), y: +d.y.toFixed(1), z: +d.z.toFixed(1) }
          });
        }
        if (!f.armed && dist > f.meta.triggerRadius * 1.9) f.armed = true;
        const k = Math.max(0, f.until - t) / 0.42;
        f.bulb.material.opacity = k;
        f.bulb.scale.setScalar(1 + k * 2.4);
      }
    }
  };
}


// ------------------------------------------- Start/Ziel und Checkpoint-Boegen
// Byteweise geprueft @2ff8b350beef:
//   roadStart.glb        13 692 B
//   overheadLights.glb   26 068 B   (Torgeruest, Durchfahrt)
//   flagCheckers.glb     15 188 B
// Alle drei werden an der GEMESSENEN Huelle skaliert, nicht an einer geratenen Zahl.

const KEN = 'media/3D_Assets/kenney_racing-kit/Models/GLTF format/';

async function kenney(THREE, GLTFLoader, file) {
  const g = await new GLTFLoader().loadAsync(RAW(KEN + file));
  const s = g.scene;
  s.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  const box = new THREE.Box3().setFromObject(s);
  return { scene: s, box, size: box.getSize(new THREE.Vector3()) };
}

export async function buildStartGate(THREE, GLTFLoader, route) {
  const p0 = route.sampleAt(0);
  const holder = new THREE.Group();
  holder.name = 'start-finish';
  holder.position.set(p0.x, p0.y, p0.z);
  holder.rotation.y = Math.atan2(p0.tx, p0.tz);
  const measured = {};

  // Fahrbahnstueck Start/Ziel: auf die Bandbreite gezogen
  try {
    const m = await kenney(THREE, GLTFLoader, 'roadStart.glb');
    const s = p0.w / Math.max(0.001, m.size.x);
    m.scene.scale.set(s, s, s);
    m.scene.position.y = 0.11 - m.box.min.y * s;
    holder.add(m.scene);
    measured.roadStart = { modelU: [+m.size.x.toFixed(3), +m.size.y.toFixed(3), +m.size.z.toFixed(3)], scale: +s.toFixed(3), spanM: +p0.w.toFixed(1) };
  } catch (e) { measured.roadStartError = e.message; }

  // Zwei Zielflaggen an den Schultern
  try {
    const f = await kenney(THREE, GLTFLoader, 'flagCheckers.glb');
    const s = 5.5 / Math.max(0.001, f.size.y);
    for (const side of [-1, 1]) {
      const c = f.scene.clone(true);
      c.scale.setScalar(s);
      c.position.set(side * (p0.w * 0.5 + 2.4), -f.box.min.y * s, 0);
      holder.add(c);
    }
    measured.flag = { modelU: [+f.size.x.toFixed(3), +f.size.y.toFixed(3), +f.size.z.toFixed(3)], scale: +s.toFixed(3) };
  } catch (e) { measured.flagError = e.message; }

  return { group: holder, measured };
}

// Torkette. Quelle ist der gepinnte Asset-Handoff
//   tools/KFB-ToolBox/_inbox/kfb-RACE_TRACK+UI_asset-handoff-animation-lab (7).json
//   (schema kfb.asset-handoff, 213 Assets) — daraus die Kenney-Racing-Torbauten:
//     overheadRound         9 136 B
//     overheadRoundColored  8 064 B
//     overheadLights       26 068 B
//     overhead              9 188 B
//
// Die Tore stehen in REGELMAESSIGEN Streckenabstaenden, nicht an gewuerfelten
// Bruchteilen. Die Lichte wird nach dem Skalieren NACHGEMESSEN und das Tor
// notfalls hochskaliert — ein Tor, durch das man nicht passt, ist kein Tor.
const GATE_KINDS = [
  { file: 'overheadRound.glb', role: 'checkpoint' },
  { file: 'overheadLights.glb', role: 'checkpoint-lit' },
  { file: 'overheadRoundColored.glb', role: 'checkpoint-colored' },
  { file: 'overhead.glb', role: 'checkpoint-plain' }
];

export async function buildGateChain(THREE, GLTFLoader, route, opts = {}) {
  const SPACING = opts.spacingM || 240;      // regelmaessiger Abstand
  const MIN_CLEAR = opts.minClearanceM || 8.0;
  const group = new THREE.Group();
  group.name = 'gate-chain';

  const models = {};
  for (const k of GATE_KINDS) {
    try { models[k.file] = await kenney(THREE, GLTFLoader, k.file); }
    catch (e) { console.warn('[gates]', k.file, e.message); }
  }
  const avail = GATE_KINDS.filter(k => models[k.file]);
  if (!avail.length) return { group, placed: 0, gates: [], error: 'kein Torspender erreichbar' };

  const gates = [];
  const count = Math.max(1, Math.floor(route.length / SPACING));
  const step = route.length / count;

  for (let i = 0; i < count; i++) {
    const s = i * step;
    const p2 = route.sampleAt(s);
    // Im Tunnel kein Tor — dort traegt die Roehre schon den Rhythmus
    if (p2.kind === 'TUNNEL') continue;
    const kind = avail[i % avail.length];
    const m = models[kind.file];
    const beamBottomU = m.box.max.y - m.size.y * 0.22;
    let sc = (p2.w * 1.04) / Math.max(0.001, m.size.x);
    const clear = () => (beamBottomU - m.box.min.y) * sc;
    let guard = 0;
    while (clear() < MIN_CLEAR && guard++ < 40) sc *= 1.06;

    const c = m.scene.clone(true);
    c.scale.setScalar(sc);
    c.position.y = -m.box.min.y * sc;
    const holder = new THREE.Group();
    holder.name = 'gate-' + i + '-' + kind.role;
    holder.position.set(p2.x, p2.y, p2.z);
    holder.rotation.y = Math.atan2(p2.tx, p2.tz);
    holder.add(c);
    group.add(holder);
    gates.push({
      index: i, role: kind.role, file: kind.file,
      routeS: +s.toFixed(1), scale: +sc.toFixed(3),
      clearanceM: +clear().toFixed(2), spanM: +(m.size.x * sc).toFixed(1),
      x: p2.x, z: p2.z, armed: true
    });
  }

  return {
    group, placed: gates.length, gates, spacingM: +step.toFixed(1), minClearanceM: MIN_CLEAR,
    source: 'kfb-RACE_TRACK+UI_asset-handoff-animation-lab (7).json',
    // Durchfahrt melden: der Aufrufer macht daraus den Klang
    check(d, onPass) {
      for (const g of gates) {
        const dist = Math.hypot(d.x - g.x, d.z - g.z);
        if (g.armed && dist < 14) { g.armed = false; onPass && onPass(g, Math.abs(d.speed)); }
        else if (!g.armed && dist > 34) g.armed = true;
      }
    }
  };
}

// Durchfahrt-Klang. Synthetisiert, kein Asset — im Repo liegt unter
// media/3D_Assets/Sounds nur Musik, kein Torgeraeusch. Gefiltertes Rauschen mit
// fallender Mittenfrequenz liest als Vorbeiziehen.
export function createGateSfx() {
  let ctx = null;
  return {
    pass(speedMs) {
      try {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume();
        const t0 = ctx.currentTime;
        const dur = 0.34;
        const n = Math.floor(ctx.sampleRate * dur);
        const buf = ctx.createBuffer(1, n, ctx.sampleRate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 1.6);
        const src = ctx.createBufferSource(); src.buffer = buf;
        const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.4;
        const f0 = 420 + Math.min(1, speedMs / 41) * 1500;
        bp.frequency.setValueAtTime(f0, t0);
        bp.frequency.exponentialRampToValueAtTime(Math.max(90, f0 * 0.22), t0 + dur);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.16 + Math.min(1, speedMs / 41) * 0.2, t0 + 0.03);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        src.connect(bp); bp.connect(g); g.connect(ctx.destination);
        src.start(t0); src.stop(t0 + dur);
      } catch (e) { /* Klang ist Beiwerk, er darf die Fahrt nicht stoppen */ }
    }
  };
}

// Countdown 3 · 2 · 1 aus dem Handoff-Ziffernsatz
//   media/3D_Assets/Platformer Game Kit - Dec 2021/Level and Mechanics/glTF/Numbers_N.gltf
const NUM = 'media/3D_Assets/Platformer Game Kit - Dec 2021/Level and Mechanics/glTF/Numbers_';

export async function buildCountdown(THREE, GLTFLoader, route) {
  const loader = new GLTFLoader();
  const digits = {};
  const measured = {};
  for (const n of [1, 2, 3]) {
    try {
      const g = await loader.loadAsync(RAW(NUM + n + '.gltf'));
      const box = new THREE.Box3().setFromObject(g.scene);
      const size = box.getSize(new THREE.Vector3());
      const sc = 9 / Math.max(0.001, size.y);           // 9 m hoch, aus der Verfolgerkamera lesbar
      g.scene.scale.setScalar(sc);
      g.scene.position.y = -box.min.y * sc;
      g.scene.traverse(o => {
        if (!o.isMesh) return;
        o.material = o.material.clone();
        o.material.toneMapped = false;
        if (o.material.emissive) { o.material.emissive = new THREE.Color(C.lineYellow); o.material.emissiveIntensity = 0.8; }
      });
      digits[n] = g.scene;
      measured[n] = { modelU: [+size.x.toFixed(3), +size.y.toFixed(3), +size.z.toFixed(3)], scale: +sc.toFixed(3) };
    } catch (e) { console.warn('[countdown] Numbers_' + n, e.message); }
  }
  if (!Object.keys(digits).length) return null;

  const p0 = route.sampleAt(route.length * 0.012);
  const holder = new THREE.Group();
  holder.name = 'countdown';
  holder.position.set(p0.x, p0.y + 7, p0.z);
  holder.visible = false;

  let shown = null;
  return {
    group: holder, measured, heightM: 9,
    // t0 ist der Startzeitpunkt; 3 Sekunden Vorlauf
    update(t, t0) {
      const left = 3 - (t - t0);
      const n = Math.ceil(left);
      if (left <= 0 || n > 3) { holder.visible = false; if (shown) { holder.remove(shown); shown = null; } return false; }
      if (n !== (shown && shown.userData.n)) {
        if (shown) holder.remove(shown);
        shown = digits[n] || null;
        if (shown) { shown.userData.n = n; holder.add(shown); }
      }
      holder.visible = !!shown;
      const frac = left - Math.floor(left);
      holder.scale.setScalar(0.75 + (1 - frac) * 0.45);
      holder.rotation.y = (1 - frac) * 0.5 - 0.25;
      return true;
    },
    faceCamera(cam) { holder.lookAt(cam.position.x, holder.position.y, cam.position.z); }
  };
}
