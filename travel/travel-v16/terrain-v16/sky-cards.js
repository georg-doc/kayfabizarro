// ============================================================================
// sky-cards.js — KFB Travel · Slice S22 · Karten im Himmel als Flugziele
// ----------------------------------------------------------------------------
// Der Kern des Slices, in vier Teilen: Karten im Himmel VERTEILEN · sie so
// AUSRICHTEN, dass man sie lesen und durchfliegen kann · den DURCHFLUG erkennen ·
// die Karte danach als Portal AUFLÖSEN. Vorhang-Cloth, KISS-Strahlen und Wind
// sind bewusst NICHT hier drin (S22b/S22c) — nach dem Durchflug ist das Ding
// spielbar, und genau da soll ein Zwischenstand stehen.
//
// WAS AUS ROLLERCOASTER v11 KOMMT (nicht neu erfunden):
//  · **Portal-Auflösung:** eine geteilte AlphaMap (radial-ovaler Gradient +
//    Value-Noise) und ein STEIGENDER `alphaTest`. Der frisst die Mitte zuerst
//    (dort sind die Werte niedrig) und lässt eine irreguläre Kante stehen.
//    Null CPU, rückwärts derselbe Shader mit fallendem Schwellwert.
//  · **Karten haben keine Rückseite** — sie sind immer zur Kamera gedreht.
//  · **Kartenformat als EINE Zahl** (`KFB_CARD_AR = 1.79`, gemessen, nicht geraten).
//
// WAS NEU IST — und warum es nicht einfach der v11-Code ist: dort hängen die
// Vorhänge an einer SCHIENE (`curve.getPointAt(t)`). Travel hat keine Schiene.
// Also:
//  1. **Zero-G-Bewegung ohne Wiederholung.** Drei Sinus-Terme pro Achse mit
//     inkommensurablen Frequenzen (√2, √3, √5 · Primzahl-Vielfache) — die Summe
//     hat keine gemeinsame Periode, also gibt es kein „jetzt wackelt es wieder
//     genauso". Drift, Neigung und Rollen kommen aus derselben Uhr.
//  2. **Lesbarkeit schlägt Physik.** Die Karte dreht sich zur Kamera, aber
//     GEDÄMPFT (Slerp mit Zeitkonstante): sie folgt der Blickrichtung, ohne zu
//     schnappen, und behält ihr Eigenleben. Ergebnis: immer ein guter Lesewinkel
//     UND ein guter Durchflugwinkel.
//  3. **Durchflug statt Kollision.** Kein Solver: Abstand zur Kartenebene
//     (Skalarprodukt mit der Normale) plus Treffer innerhalb der halben Kanten —
//     der Vorzeichenwechsel IST das Ereignis.
//
//   const sky = createSkyCards({ THREE, count: 7 });
//   scene.add(sky.group);
//   sky.setCenter(x, z);                       // Welt wandert mit dem Spieler
//   sky.update(dt, camera, playerPos);         // pro Frame
//   sky.onPass = (card) => { … };              // Durchflug: Audio, Story, Deck
// ============================================================================

// S62 · Sollformat aus EINER Stelle — der Kommentar oben („Voraussetzung ist, dass beide dasselbe
// Blattformat meinen") ist damit keine Mahnung mehr, sondern verdrahtet.
import { CARD_AR as KFB_CARD_AR, fitCell } from '../cardbuilder/kfb-card-format.js';
const INK = '#1f1a14', PAPER = '#efe6d0';
let lastFit = null;   // S62 · letzte eingelegte Zelle — Abnahme des Sollformats (`formatReport`)

// ---------------------------------------------------------------- Tusche (Kanon, 2026-07-26)
// Bis heute zog dieses Modul seine Kartenkante selbst: vier Ecken, alle 34 bzw. 40 px ein Punkt,
// `jit` auf x UND y mit DERSELBEN Zahl (die Kante zitterte also diagonal statt quer zur Kante),
// dann `stroke lineWidth 7`. Das ist die FALSCHE FAMILIE — gestrichelte Polylinie statt Pinselband
// (`inked` gehört auf Chips und Post-its). Gemessen am 25./26.7.: **20 Stützpunkte** auf der langen
// Kante (v11: 31, Akademie: 44), **Feder 1,74 %** von min(B,H) und konstant (v11: 1,40 %, variabel),
// **Bauchung 1,00 %** gegen 0,44 % bei v11. Kein Parameter repariert das, nur der Umzug — bei einem
// Strich IST der Jitter der Wobble. Nach dem Umbau: Band · 44 · 1,40 % · Bauchung **0,38 %**.
//
// Jetzt trägt die Sky-Karte dieselbe Kante wie die Akademie-Karte: EINE normalisierte Kontur pro
// Seed (`contourAt`, Familie `band`, wob 1,4 · bow 0,196 · Referenzrahmen 1024) und `inkTail` als
// Feder. Die Zahlen stehen NICHT hier — sie stehen an einer Stelle, in `academy-deck.js`; dieses
// Modul importiert die Kontur, es kopiert sie nicht. (Zielzustand ist `cardbuilder/kfb-ink-canon.js`,
// sobald der Umzug der Karten-Pipeline entschieden ist — SSOT v2, offene Punkte.)
// Voraussetzung dafür ist, dass beide dasselbe Blattformat meinen: `SHEET_AR === KFB_CARD_AR`.
import { contourAt, SHEET_AR } from './academy-deck.js';
import { inkTail } from './ink-tail.js';

if (Math.abs(SHEET_AR - KFB_CARD_AR) > 1e-6) {
  console.warn('[sky-cards] Blattformat weicht ab: SHEET_AR', SHEET_AR, '≠ KFB_CARD_AR', KFB_CARD_AR,
               '— die geteilte Kontur wird verzerrt.');
}
const pathOf = (g, pts) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]); g.closePath(); };

// Kanonische Kartennamen aus den Cut-&-Play-Decks (Hopium · Doom · Protopia).
// Platzhalter-Titel wären hier falsch: die Karten sind Beweisstücke, keine Deko.
const DEFAULT_CARDS = [
  { title: 'The Finished City', deck: 'Hopium' },
  { title: 'The Moving Launch Date', deck: 'Hopium' },
  { title: 'The Doomsday Clock', deck: 'Doom' },
  { title: 'The Perpetual Almost', deck: 'Doom' },
  { title: 'The Frozen Watcher', deck: 'Doom' },
  { title: 'The Held Breath', deck: 'Protopia' },
  { title: 'The Reclaimed Second', deck: 'Protopia' },
  { title: 'The Nearest Lever', deck: 'Protopia' },
];

function mulberry(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// Portal-AlphaMap: radial-ovaler Gradient + Value-Noise. Steigender alphaTest frisst
// die Mitte zuerst → Loch mit irregulärer Kante. Eine Textur für alle Karten.
let _portalTex = null;
function portalAlphaTex(THREE) {
  if (_portalTex) return _portalTex;
  const S = 256, c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d'), img = g.createImageData(S, S), rnd = mulberry(4242);
  const grid = 16, n = [];
  for (let i = 0; i < (grid + 1) * (grid + 1); i++) n.push(rnd());
  const at = (x, y) => n[Math.min(grid, y) * (grid + 1) + Math.min(grid, x)];
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const u = x / S * grid, v = y / S * grid;
      const x0 = u | 0, y0 = v | 0, fx = u - x0, fy = v - y0;
      const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * sx;
      const b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * sx;
      const noise = a + (b - a) * sy;
      const dx = (x / S - 0.5) * 2, dy = (y / S - 0.5) * 2 * 0.78;
      const r = Math.min(1, Math.sqrt(dx * dx + dy * dy));
      const val = Math.max(0, Math.min(1, r * 0.78 + noise * 0.34));
      const o = (y * S + x) * 4;
      img.data[o] = img.data[o + 1] = img.data[o + 2] = 255;
      img.data[o + 3] = (val * 255) | 0;
    }
  }
  g.putImageData(img, 0, 0);
  _portalTex = new THREE.CanvasTexture(c);
  return _portalTex;
}

// Kartenblatt als TEXT — das ist der Ladezustand und der Fallback, nicht die Zielansicht:
// die Karten-JSON ist in Millisekunden da, das PDF-Rendern dauert. Titel, Deck und Lore tragen
// die Karte, bis das echte Artwork nachkommt (Regel aus v11: nie ein leeres Blatt).
function cardTexture(THREE, card, seed) {
  const W = 720, H = Math.round(W / KFB_CARD_AR);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const pts = contourAt(seed, W, H);
  g.fillStyle = PAPER; pathOf(g, pts); g.fill();
  g.fillStyle = INK; g.textAlign = 'center';
  g.font = '700 68px "Irish Grover", Georgia, serif';
  const words = String(card.title || '').split(' ');
  const lines = words.length > 3 ? [words.slice(0, 2).join(' '), words.slice(2).join(' ')] : [words.join(' ')];
  lines.forEach((ln, i) => g.fillText(ln, W / 2, H * 0.44 + i * 72));
  g.font = '30px "Special Elite", monospace';
  g.fillText((card.deck || 'KFB').toUpperCase(), W / 2, H * 0.8);
  if (card.lore) {
    g.font = '22px "Special Elite", monospace';
    g.fillStyle = 'rgba(31,26,20,.66)';
    const wrap = [];
    let line = '';
    for (const w of String(card.lore).split(' ')) {
      const test = line ? line + ' ' + w : w;
      if (g.measureText(test).width > W - 150 && line) { wrap.push(line); line = w; } else line = test;
      if (wrap.length >= 2) break;
    }
    if (line && wrap.length < 2) wrap.push(line);
    wrap.forEach((ln, i) => g.fillText(ln, W / 2, H * 0.62 + i * 28));
  }
  // Band ZULETZT: es liegt mittig auf der Kontur, überdeckt also die halbe Papierkante — und
  // nichts vom Text kann darüber laufen.
  inkTail(g, pts, W, H, seed);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

// Echtes Artwork: der 2×2-Quadrant aus dem Deck-PDF, 1:1 in das Blatt, auf die gejitterte
// Silhouette geclippt — dadurch bleibt die Kartenkante unregelmäßig (kein Rechteck) und die
// kanonische Tuschekante liegt exakt auf derselben Kontur (Kanon aus v11).
// **Derselbe Seed wie das Textblatt** — sonst wechselt die Silhouette in dem Moment, in dem das
// Artwork nachkommt (bis 2026-07-26 waren es zwei verschiedene Reihen: `1000 + i*77` und
// `500 + n*13`, die Karte änderte beim Nachladen sichtbar ihre Kante).
function artTexture(THREE, crop, seed) {
  const W = 900, H = Math.round(W / KFB_CARD_AR);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const pts = contourAt(seed, W, H);
  g.save(); pathOf(g, pts); g.clip();
  g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
  // S62 · **Die Zelle wurde hier bis heute auf das Blatt GEZOGEN** (`drawImage(…, 0,0,W,H)`) — ein
  // 1,462er Deck lief damit auf 1,74 breit, die Zeichnung war verzerrt, und niemand konnte es sehen,
  // weil eine verzerrte Comiczeichnung immer noch wie eine Comiczeichnung aussieht. Jetzt liegt die
  // gemessene Zelle mittig im Sollformat, der Fehlbetrag ist Papier.
  const f = fitCell(crop.width, crop.height, W, H);
  lastFit = f;
  g.drawImage(crop, f.x, f.y, f.w, f.h);
  g.restore();
  inkTail(g, pts, W, H, seed);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}



export function createSkyCards(opts = {}) {
  const THREE = opts.THREE;
  const P = Object.assign({
    count: 7,
    width: 11,            // Weltbreite einer Karte
    ring: 150,            // mittlerer Abstand vom Spieler
    ringJit: 70,
    yMin: 22, yMax: 78,   // Höhenband
    faceDamp: 0.9,        // 1/s — wie schnell sich die Karte zur Kamera dreht (klein = träge)
    driftAmp: 2.6,        // Zero-G-Drift in Weltunits
    tiltAmp: 0.22,        // Neigungs-Amplitude (rad)
    passRadius: 1.0,      // Trefferfenster relativ zur halben Kantenlänge
    dissolveTime: 0.9,    // Sekunden bis die Karte weg ist
    respawn: 3.2,         // Sekunden bis eine neue Karte an neuer Stelle erscheint
    visible: true,
  }, opts.params || {});

  const group = new THREE.Group();
  group.frustumCulled = false;
  const cards = [];
  let deck = opts.cards && opts.cards.length ? opts.cards : DEFAULT_CARDS;
  const registry = opts.registry || null;   // liefert echtes Artwork nach (S23)
  let cx = 0, cz = 0, T = 0, collected = 0, nextIdx = 0;
  const fwd = { x: 0, z: -1 };              // Blick-/Flugrichtung für die Verteilung
  const api = { onPass: null };

  const _v = new THREE.Vector3(), _n = new THREE.Vector3(), _to = new THREE.Vector3();
  const _q = new THREE.Quaternion(), _m = new THREE.Matrix4();
  const _up = new THREE.Vector3(0, 1, 0), _right = new THREE.Vector3(), _look = new THREE.Vector3();
  const _tiltQ = new THREE.Quaternion(), _tiltE = new THREE.Euler();   // vorallokiert wie der Rest

  function place(card) {
    // Vorwärts-Bias: die Karten sollen VOR dem Spieler hängen, nicht rundherum — sonst ist der
    // Himmel in Flugrichtung leer und man muss suchen. ± 75° um die Flugrichtung, der Rest
    // dahinter verteilt (10 %), damit es kein starres Tor wird.
    const base = Math.atan2(fwd.x, fwd.z);
    const behind = Math.random() < 0.1;
    const a = base + (behind ? Math.PI : 0) + (Math.random() - 0.5) * (behind ? 1.6 : 2.6);
    const r = P.ring + (Math.random() - 0.5) * P.ringJit;
    card.home.set(cx + Math.sin(a) * r, P.yMin + Math.random() * (P.yMax - P.yMin), cz + Math.cos(a) * r);
    card.mesh.position.copy(card.home);
    card.phase = Math.random() * 100;
    card.state = 'idle'; card.t = 0;
    card.mesh.visible = P.visible;
    card.mat.alphaMap = null; card.mat.alphaTest = 0; card.mat.needsUpdate = true;
    card.side = 0;
    card.art = false;
  }

  // Text zuerst, Bild später — und Bild NUR AUF ZURUF. Der erste Anlauf hat alle sieben Blätter
  // beim Erscheinen in die Warteschlange geworfen: vier große Deck-PDFs gleichzeitig, dazu ein
  // 1500-px-Seitenrender pro Karte, alles auf demselben Thread wie der Flug — gemessen 0 fps und
  // ein Terrain, das nie fertig gebaut wurde. Jetzt holt der Runner EIN Artwork, wenn er Luft hat,
  // und immer für die NÄCHSTE Karte: die sieht man als erste.
  function pumpArt(player, maxDist) {
    if (!registry || registry.pending || document.hidden) return false;
    let best = null, bd = maxDist || 1e9;
    for (const c of cards) {
      if (c.state !== 'idle' || c.art || !c.data || c.data.packId == null) continue;
      const d = player ? c.mesh.position.distanceTo(player) : 0;
      if (d < bd) { bd = d; best = c; }
    }
    if (!best) return false;
    const card = best;
    card.art = 'pending';
    registry.requestArt(card.data, (crop) => {
      if (card.state === 'gone' || card.art !== 'pending') return;
      if (card.mat.map) card.mat.map.dispose();
      card.mat.map = artTexture(THREE, crop, card.seed);
      card.mat.needsUpdate = true;
      card.art = true;
    }, () => {
      // Gibt die Registry auf, muss das Blatt WIEDER FREI sein — sonst bliebe es die ganze Sitzung
      // als „läuft noch" markiert und bekommt nie Artwork, auch nicht direkt vor der Nase.
      if (card.art === 'pending') card.art = false;
    });
    return true;
  }

  function make(i) {
    const data = deck[i % deck.length];
    const seed = 1000 + i * 77;   // EIN Seed pro Blatt — Textfassung und Artwork teilen die Kontur
    const w = P.width, h = w / KFB_CARD_AR;
    const geo = new THREE.PlaneGeometry(w, h, 1, 1);
    const mat = new THREE.MeshBasicMaterial({
      map: cardTexture(THREE, data, seed),
      transparent: true, side: THREE.DoubleSide, toneMapped: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.frustumCulled = false;
    group.add(mesh);
    const card = { data, mesh, mat, geo, seed, half: { w: w / 2, h: h / 2 },
                   home: new THREE.Vector3(), phase: 0, state: 'idle', t: 0, side: 0 };
    place(card);
    return card;
  }

  for (let i = 0; i < P.count; i++) cards.push(make(nextIdx++));
  // Die Titel werden auf ein Canvas gemalt. Läuft der Webfont noch, malt der Browser still
  // Georgia — also nach `fonts.ready` EINMAL neu malen. Sonst hängt die Typografie am Zufall
  // der Ladereihenfolge (in v11 zweimal aufgeschlagen).
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        if (c.mat.map) c.mat.map.dispose();
        c.mat.map = cardTexture(THREE, c.data, c.seed);
        c.mat.needsUpdate = true;
      }
    });
  }

  function beginDissolve(card) {
    card.state = 'dissolve'; card.t = 0;
    card.mat.alphaMap = portalAlphaTex(THREE);
    card.mat.needsUpdate = true;
  }

  function update(dt, camera, player) {
    if (!P.visible) return;
    T += dt;
    camera.getWorldPosition(_look);
    for (const card of cards) {
      const m = card.mesh;
      if (card.state === 'gone') {
        card.t += dt;
        if (card.t >= P.respawn) {
          card.data = deck[nextIdx++ % deck.length];
          card.art = false;
          card.seed = 1000 + nextIdx * 77;   // neues Blatt, neue Kante — aber EINE, siehe make()
          if (card.mat.map) card.mat.map.dispose();   // sonst bleibt pro Durchflug eine Textur liegen
          card.mat.map = cardTexture(THREE, card.data, card.seed);
          place(card);
        }
        continue;
      }
      // --- Zero-G: drei inkommensurable Frequenzen pro Achse. Die Summe hat keine
      // gemeinsame Periode → die Bewegung wiederholt sich nie hörbar/sichtbar.
      const p = card.phase, s = T * 0.16;
      const dx = Math.sin(s * 1.0 + p) + 0.6 * Math.sin(s * 1.4142 + p * 1.7) + 0.35 * Math.sin(s * 2.2360 + p * 2.3);
      const dy = Math.sin(s * 1.1 + p * 1.3) + 0.55 * Math.sin(s * 1.7320 + p * 0.7) + 0.3 * Math.sin(s * 2.6457 + p * 3.1);
      const dz = Math.sin(s * 0.9 + p * 2.1) + 0.6 * Math.sin(s * 1.6180 + p * 1.1) + 0.35 * Math.sin(s * 2.4494 + p * 0.4);
      m.position.set(
        card.home.x + dx * P.driftAmp,
        card.home.y + dy * P.driftAmp * 0.55,
        card.home.z + dz * P.driftAmp);

      // --- Ausrichtung: zur Kamera, aber gedämpft, plus Eigen-Neigung um alle drei Achsen.
      // Erst die Blickachse als Basis (Karten haben keine Rückseite), dann die Neigung
      // OBEN DRAUF — so bleibt der Lesewinkel gut und die Karte trotzdem lebendig.
      _to.subVectors(_look, m.position).normalize();
      _right.crossVectors(_up, _to);
      if (_right.lengthSq() < 1e-6) _right.set(1, 0, 0); else _right.normalize();
      _v.crossVectors(_to, _right).normalize();
      _m.makeBasis(_right, _v, _to);
      _q.setFromRotationMatrix(_m);
      const tilt = P.tiltAmp;
      _tiltE.set(
        Math.sin(s * 1.3 + p) * tilt,
        Math.sin(s * 0.8 + p * 1.9) * tilt * 0.7,
        Math.sin(s * 1.9 + p * 0.6) * tilt);
      _q.multiply(_tiltQ.setFromEuler(_tiltE));
      m.quaternion.slerp(_q, Math.min(1, dt * P.faceDamp * 3));

      if (card.state === 'dissolve') {
        card.t += dt;
        const k = Math.min(1, card.t / P.dissolveTime);
        card.mat.alphaTest = Math.min(0.99, 0.03 + k * 0.97);
        if (k >= 1) { card.state = 'gone'; card.t = 0; m.visible = false; }
        continue;
      }

      // --- Durchflug: Abstand zur Kartenebene, Vorzeichenwechsel = Ereignis.
      // Kein Solver, kein Broadphase — eine Ebene und zwei Kantenlängen.
      if (player) {
        _n.set(0, 0, 1).applyQuaternion(m.quaternion);
        _v.subVectors(player, m.position);
        const d = _v.dot(_n);
        const side = d >= 0 ? 1 : -1;
        if (card.side !== 0 && side !== card.side) {
          // Treffer nur, wenn der Punkt INNERHALB der Karte liegt
          _right.set(1, 0, 0).applyQuaternion(m.quaternion);
          _to.set(0, 1, 0).applyQuaternion(m.quaternion);
          const u = Math.abs(_v.dot(_right)), w2 = Math.abs(_v.dot(_to));
          if (u < card.half.w * P.passRadius && w2 < card.half.h * P.passRadius) {
            collected++;
            beginDissolve(card);
            if (api.onPass) { try { api.onPass(card.data, collected); } catch (e) {} }
          }
        }
        card.side = side;
      }
    }
  }

  return {
    name: 'sky-cards', group, update,
    // S62 · Abnahme des Sollformats: was von der Zelle Papierrand wurde, statt abgeschnitten oder
    // verzogen zu werden. `null` heißt: noch kein Artwork eingelegt (nur Textblätter).
    formatReport() {
      if (!lastFit) return { sollformat: KFB_CARD_AR, eingelegt: 0 };
      const cellAR = (lastFit.w / lastFit.scale) / (lastFit.h / lastFit.scale);
      return {
        sollformat: KFB_CARD_AR,
        zelle: +cellAR.toFixed(3),
        randX: +(lastFit.randX * 100).toFixed(2),
        randY: +(lastFit.randY * 100).toFixed(2),
        verzerrungJetzt: 0,                                       // gleichmäßige Skalierung
        verzerrungVorher: +Math.abs(KFB_CARD_AR / cellAR - 1).toFixed(4),
      };
    },
    get onPass() { return api.onPass; },
    set onPass(fn) { api.onPass = fn; },
    setCenter(x, z) { cx = x; cz = z; },
    // Flugrichtung für die Verteilung: neue Karten erscheinen vor dem Spieler
    setForward(x, z) { const l = Math.hypot(x, z) || 1; fwd.x = x / l; fwd.z = z / l; },
    // Echtes Deck einhängen (Karten-JSON aus der Registry). Die bestehenden Blätter werden
    // beim nächsten Respawn ersetzt; die sichtbaren bekommen sofort Titel und Artwork-Auftrag.
    setDeck(list, replaceNow) {
      if (!list || !list.length) return;
      deck = list; nextIdx = 0;
      if (!replaceNow) return;
      for (const c of cards) {
        c.data = deck[nextIdx++ % deck.length];
        c.art = false;
        c.seed = 1000 + nextIdx * 77;
        if (c.mat.map) c.mat.map.dispose();
        c.mat.map = cardTexture(THREE, c.data, c.seed);
        c.mat.needsUpdate = true;
      }
    },
    pumpArt,
    // Karten, die zu weit hinter dem Spieler liegen, wandern nach vorn — sonst fliegt man
    // aus dem Kartenfeld heraus und der Himmel ist leer.
    recycle(player, maxDist) {
      const md = maxDist || P.ring * 2.4;
      for (const card of cards) {
        if (card.state !== 'idle') continue;
        if (card.home.distanceTo(player) > md) place(card);
      }
    },
    setVisible(on) { P.visible = !!on; for (const c of cards) c.mesh.visible = !!on && c.state !== 'gone'; },
    setParams(p) { Object.assign(P, p || {}); },
    get params() { return P; },
    get collected() { return collected; },
    get count() { return cards.length; },
    // Nächste Karte ZUM SPIELER — nicht zum Weltursprung. S22b (Strahlen) und S22c (Cloth,
    // Turbulenz) hängen daran; ein Abstand gegen (0,0,0) wäre dort still falsch.
    nearest(player) {
      let best = null, bd = 1e9;
      for (const c of cards) {
        if (c.state !== 'idle') continue;
        const d = player ? c.mesh.position.distanceTo(player) : c.mesh.position.length();
        if (d < bd) { bd = d; best = c; }
      }
      return best;
    },
    reset() { collected = 0; for (const c of cards) place(c); },
    dispose() { for (const c of cards) { c.geo.dispose(); if (c.mat.map) c.mat.map.dispose(); c.mat.dispose(); } },
  };
}
