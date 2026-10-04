/* KFB WhackMan v1 · Host
   Renderer, Kamera, freier Orbit und die rAF-Stall-Absicherung kommen von
   `kit-lab.js makeViewer()` — dem Viewer, den alle Kit-Lab-Seiten benutzen. Hier steht kein
   zweiter Renderer und kein zweites Lichtmodell.

   Eine Lehre bleibt lokal verdrahtet: Canvas und Bedienflächen hängen an document.body, nicht
   in einem Template-Knoten — der DC-Runtime räumt fremde Kinder bei jedem Re-Render weg. */

import * as THREE from 'three';
import { makeViewer } from './tools/world_atlas/source/lib/kit-lab.js';
import { buildGateA } from './wm-gate-a.js';
import { buildGateB } from './wm-gate-b.js';
import { buildGateC } from './wm-gate-c.js';

const MONO = "400 11px/1.45 'JetBrains Mono',ui-monospace,monospace";
const INK = '#e7dfd0';
const GOLD = '#ffd9a0';
const LINE = 'rgba(231,223,208,.16)';
const BTN = 'font:' + MONO + ';color:' + INK + ';background:rgba(255,255,255,.045);border:1px solid ' + LINE +
  ';padding:7px 10px;cursor:pointer;text-align:left;width:100%;transition:border-color .12s,color .12s';

function panel(css) {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;z-index:30;font:' + MONO + ';color:' + INK +
    ';background:rgba(21,16,31,.88);border:1px solid rgba(231,223,208,.18);padding:8px 11px;' + css;
  document.body.appendChild(el);
  return el;
}

const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:fixed;inset:0;display:block;width:100%;height:100%;z-index:0';
document.body.appendChild(canvas);

/* ---------- Ein Schalter für alles Meta ----------
   Vorher standen fünf Knöpfe links, zwei rechts, eine Leiste unten und zwei Textfelder in den
   Ecken — zehn Flächen um ein Spiel herum, das drei davon braucht. Im Bild bleiben jetzt nur
   die Dinge mit Spielzweck: HUD und ein kurzer Hinweis. Alles andere — Ansicht, Steuerung,
   Lauf, Ton, Gates, Schilder, Belege, Status — liegt in EINER Schublade hinter dem Icon. */
const metaBtn = document.createElement('button');
metaBtn.setAttribute('aria-label', 'Werkzeuge');
metaBtn.style.cssText = 'position:fixed;right:14px;top:14px;z-index:34;width:34px;height:34px;padding:0;' +
  'display:grid;place-items:center;cursor:pointer;background:rgba(21,16,31,.92);border:1px solid ' + LINE + ';color:' + INK;
metaBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4">' +
  '<path d="M2 4h12M2 8h12M2 12h12"/></svg>';
document.body.appendChild(metaBtn);

const metaPanel = document.createElement('div');
metaPanel.style.cssText = 'position:fixed;right:14px;top:56px;z-index:33;width:min(320px,88vw);' +
  'max-height:calc(100vh - 72px);overflow:auto;display:none;flex-direction:column;gap:14px;' +
  'font:' + MONO + ';color:' + INK + ';background:rgba(21,16,31,.94);border:1px solid ' + LINE + ';padding:12px';
document.body.appendChild(metaPanel);

function gruppe(titel) {
  const g = document.createElement('div');
  g.style.cssText = 'display:flex;flex-direction:column;gap:5px';
  const h = document.createElement('div');
  h.textContent = titel;
  h.style.cssText = 'font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:' + GOLD + ';opacity:.75;margin-bottom:2px';
  g.appendChild(h);
  metaPanel.appendChild(g);
  return g;
}

let metaOpen = false;
function setMeta(on) {
  metaOpen = on;
  metaPanel.style.display = on ? 'flex' : 'none';
  metaBtn.style.color = on ? GOLD : INK;
  metaBtn.style.borderColor = on ? GOLD : LINE;
}
metaBtn.onclick = () => setMeta(!metaOpen);
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && metaOpen) setMeta(false);
  else if (e.key === 'Tab') { e.preventDefault(); setMeta(!metaOpen); }
});

const grpSpiel = gruppe('Spiel');
const grpBau = gruppe('Bau');
const grpBelege = gruppe('Belege');

/* ---------- Hinweiszeile: sagt etwas und geht dann ---------- */
const hintEl = panel('left:50%;top:14px;transform:translateX(-50%);letter-spacing:.09em;text-transform:uppercase;' +
  'font-weight:600;font-size:10px;pointer-events:none;transition:opacity .5s');
let hintTimer = 0;
const setHint = (t) => {
  hintEl.textContent = t;
  hintEl.style.opacity = '1';
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => { hintEl.style.opacity = '0'; }, 5000);
};
setHint('Ziehen = Orbit · Rad = Distanz');

const evidEl = document.createElement('div');
evidEl.style.cssText = 'display:none;max-height:44vh;overflow:auto;white-space:pre-wrap;font-size:10px;' +
  'line-height:1.5;word-break:break-word;border:1px solid ' + LINE + ';padding:8px;background:rgba(0,0,0,.25)';
evidEl.textContent = '…';

const toggle = document.createElement('button');
toggle.textContent = 'Belegtafel zeigen';
toggle.style.cssText = BTN;
let evidOpen = false;
toggle.onclick = () => {
  evidOpen = !evidOpen;
  evidEl.style.display = evidOpen ? 'block' : 'none';
  toggle.textContent = evidOpen ? 'Belegtafel ausblenden' : 'Belegtafel zeigen';
  toggle.style.color = evidOpen ? GOLD : INK;
  toggle.style.borderColor = evidOpen ? GOLD : LINE;
};
grpBelege.appendChild(toggle);
grpBelege.appendChild(evidEl);

const statusEl = document.createElement('div');
statusEl.style.cssText = 'font-size:10px;line-height:1.5;opacity:.72;word-break:break-word';
grpBelege.appendChild(statusEl);

const labelBtn = document.createElement('button');
labelBtn.textContent = 'Schilder';
labelBtn.style.cssText = BTN;
let labelsOn = true;
function setLabels(on) {
  labelsOn = on;
  labelBtn.textContent = on ? 'Schilder: an' : 'Schilder: aus';
  labelBtn.style.color = on ? GOLD : INK;
  labelBtn.style.borderColor = on ? GOLD : LINE;
  if (!on) for (const L of labels) L.el.style.display = 'none';
}
labelBtn.onclick = () => setLabels(!labelsOn);

const bar = document.createElement('div');
bar.style.cssText = 'display:flex;flex-wrap:wrap;gap:5px';
grpBau.appendChild(bar);
grpBau.appendChild(labelBtn);

const labelLayer = document.createElement('div');
labelLayer.style.cssText = 'position:fixed;inset:0;z-index:20;pointer-events:none;overflow:hidden';
document.body.appendChild(labelLayer);

const status = (m) => { statusEl.textContent = m; if (!metaOpen) setHint(m.length > 76 ? m.slice(0, 74) + '…' : m); };

/* Spiel-HUD: eine Zeile, nur wenn gespielt wird. Brief §11: kein UI-Element ohne Spielzweck.
   Nicht in die untere Bildmitte — die Verfolgerkamera parkt den Akteur konstruktionsbedingt
   genau dort, HUD und Figur können sich also gar nicht verfehlen. */
const hudEl = panel('left:14px;bottom:14px;letter-spacing:.06em;pointer-events:none;display:none');
const mkBtn = () => {
  const b = document.createElement('button');
  b.style.cssText = BTN + ';display:none';
  grpSpiel.appendChild(b);
  return b;
};
const viewBtn = mkBtn();
const modeBtn = mkBtn();
const laufBtn = mkBtn();
const liftBtn = mkBtn();
const sndBtn = mkBtn();

/* ---------- Viewer vom Kit-Lab ---------- */
const V = makeViewer(canvas, { background: 0x15101f, fov: 30 });
V.renderer.toneMapping = THREE.ACESFilmicToneMapping;
/* Pixeldichte deckeln. Das Kit-Lab rendert mit bis zu 2 \u2014 richtig f\u00fcr ein Standbild am
   Pr\u00fcfstand, vierfache Pixelzahl f\u00fcr ein Spiel, das 60 Bilder je Sekunde halten soll. */
V.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
/* Belichtung runter: 1,15 hat zusammen mit dem 2,4er Key des Kit-Labs auf den Wandplatten und
   dem Grasboden einen ausgebrannten Glanzfleck erzeugt — ein lackiertes Dungeon. KayKit ist auf
   matte Flächen und Flat-Shading gebaut; der Glanz kam von uns, nicht vom Pack. */
V.renderer.toneMappingExposure = 0.96;

/* ---------- Lichtkonzept: offenes Labyrinth in der Dämmerung ----------
   Das Kit-Lab-Rig ist ein PRÜFSTAND: heller Himmel, harter Key, damit man an einem Einzelteil
   Kanten zählen kann. In einem begehbaren Dungeon ist das die falsche Frage. Hier gilt:

   · EINE Himmelsquelle von oben, kalt und schwach. Die Gänge sind oben offen, also ist ein
     Streiflicht von oben die einzige plausible Grossquelle — und es liefert die Schatten.
     Dämmerung statt Mittag: erst wenn das Umgebungslicht unter das Feuer fällt, kann eine
     Fackel überhaupt etwas beleuchten. Bei Tageshelligkeit ist sie nur ein oranger Fleck.
   · Die Fackeln sind die Nahquelle — warm, unruhig, mit physikalischem Abfall (in wm-gate-b).
   · Nebel schliesst die Tiefe. Ohne ihn sieht man bis zur Kartenkante und der Raum hat kein
     Ende; mit ihm hört der Gang dort auf, wo das Licht aufhört. Billigster Stimmungsposten,
     den es gibt: eine Zeile, kein Pixel Mehrkosten.
   Gegenfarben: Himmel blaugrau, Feuer orange. Das ist der ganze Trick an Dungeonlicht —
   zwei Temperaturen, die sich an den Kanten treffen. Ein Licht allein wirkt immer flach. */
const NACHT = 0x151322;
V.scene.background = new THREE.Color(NACHT);
V.scene.fog = new THREE.FogExp2(NACHT, 0.019);
V.renderer.toneMappingExposure = 1.0;
for (const o of V.scene.children) {
  if (o.isHemisphereLight) {
    o.color.set(0x3f4a66); o.groundColor.set(0x1f1917); o.intensity = 0.48;
  } else if (o.isDirectionalLight) {
    if (o.castShadow) { o.color.set(0x9db4e8); o.intensity = 0.68; }
    else { o.color.set(0x6478a8); o.intensity = 0.12; }
  }
}

/* ---------- Materialien mattieren ----------
   Einmal pro Material, nicht pro Mesh: die Packs teilen sich Materialien, und ein Durchlauf
   über 2000 Meshes würde dasselbe Material dutzendfach anfassen. */
const mattGesehen = new WeakSet();
function mattieren(wurzel) {
  let n = 0;
  wurzel.traverse((o) => {
    if (!o.isMesh || !o.material) return;
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      if (!m || mattGesehen.has(m)) continue;
      mattGesehen.add(m);
      if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) {
        m.roughness = Math.max(m.roughness ?? 1, 0.94);
        m.metalness = 0;
        m.envMapIntensity = 0.15;
        if ('clearcoat' in m) m.clearcoat = 0;
        if (m.roughnessMap || m.metalnessMap) { m.roughnessMap = null; m.metalnessMap = null; }
        m.needsUpdate = true;
        n++;
      }
    }
  });
  return n;
}
/* Schattenkarte läuft MIT. Eingefroren war sie, solange nur Architektur in der Szene stand —
   seit Akteure darin laufen, wäre ein Standbild schlicht falsch: die Figuren würfen nichts.
   Bezahlbar bleibt es dadurch, dass flache Platten (Böden, Blockdächer) nur empfangen und
   die Karte auf 1536 steht statt 2048. */
V.renderer.shadowMap.autoUpdate = true;
const { scene, camera } = V;

/* ---------- Beschriftungen · projiziert ---------- */
const labels = [];
let activeStation = null;
function makeLabel({ kind, title, sub, anchor, y, station }) {
  const el = document.createElement('div');
  const head = kind === 'station';
  /* Das Schild hängt UNTER seinem Ankerpunkt, nicht darüber. Ein Schild, das die Figur verdeckt,
     die es beschriftet, ist keine Beschriftung. */
  el.style.cssText = 'position:absolute;transform:translate(-50%,10px);white-space:nowrap;' +
    'font:' + (head ? "600 11px/1.4 'JetBrains Mono',ui-monospace,monospace" : MONO) + ';' +
    'color:' + (head ? GOLD : INK) + ';background:rgba(21,16,31,.86);' +
    'border:1px solid rgba(' + (head ? '255,217,160' : '231,223,208') + ',.28);padding:4px 8px;text-align:center';
  el.innerHTML = '<div>' + title + '</div>' +
    (sub ? '<div style="opacity:.66;font-weight:400;color:' + INK + '">' + sub + '</div>' : '');
  labelLayer.appendChild(el);
  labels.push({ el, anchor, y: y || 0, station });
}

const v3 = new THREE.Vector3();
function placeLabels() {
  if (!labelsOn) return;
  const w = canvas.clientWidth, h = canvas.clientHeight;
  for (const L of labels) {
    if (activeStation && activeStation !== 'ALLE' && L.station && L.station !== activeStation) {
      L.el.style.display = 'none';
      continue;
    }
    L.anchor.getWorldPosition(v3);
    v3.y += L.y;
    v3.project(camera);
    const vis = v3.z < 1;
    L.el.style.display = vis ? 'block' : 'none';
    if (!vis) continue;
    L.el.style.left = ((v3.x * 0.5 + 0.5) * w) + 'px';
    L.el.style.top = ((-v3.y * 0.5 + 0.5) * h) + 'px';
  }
}

/* Beim Überblick liegen drei Stationsschilder übereinander. Also zeigt „alle" nur die Namen,
   ohne die Unterzeilen — lesbar bleibt, wer wo steht, nicht jede Zahl. */
function setOverview(on) {
  for (const L of labels) {
    const subEl = L.el.children[1];
    if (subEl) subEl.style.display = on ? 'none' : 'block';
  }
}

/* kit-labs `frame()` rahmt über die Bounding-KUGEL. Das ist für ein einzelnes Teil richtig und
   für eine breite, flache Reihe zu großzügig: die Kugel um 17 Einheiten Breite hat Radius 9,
   und die Akteure werden zu Briefmarken. Für den Überblick wird deshalb auf die BREITE gerahmt.
   Eine Kamerarechnung, keine zweite Geometriewahrheit. */
function frameRow(node, pad = 1.08, elev = 0.34) {
  const b = new THREE.Box3().setFromObject(node);
  const c = b.getCenter(new THREE.Vector3());
  const s = b.getSize(new THREE.Vector3());
  const tan = Math.tan((camera.fov * Math.PI) / 360);
  const dist = Math.max(s.x / (2 * tan * Math.max(0.5, camera.aspect)), s.y / (2 * tan)) * pad + s.z * 0.6;
  camera.position.set(c.x, c.y + dist * elev, c.z + dist * (1 - elev * 0.35));
  camera.near = Math.max(0.01, dist / 200);
  camera.far = dist * 20;
  camera.updateProjectionMatrix();
  V.controls.target.copy(c);
  V.controls.minDistance = 1;
  V.controls.maxDistance = dist * 6;
  V.controls.update();
}

function buildBar(views, rootNode) {
  bar.textContent = '';
  const mk = (id, text, node) => {
    const b = document.createElement('button');
    b.textContent = text;
    b.style.cssText = 'font:' + MONO + ';color:' + INK + ';background:rgba(21,16,31,.92);' +
      'border:1px solid rgba(231,223,208,.28);padding:6px 11px;cursor:pointer;letter-spacing:.06em';
    b.onclick = () => {
      activeStation = id;
      setOverview(id === 'ALLE');
      for (const c of bar.children) { c.style.borderColor = 'rgba(231,223,208,.28)'; c.style.color = INK; }
      b.style.borderColor = GOLD;
      b.style.color = GOLD;
      scene.updateMatrixWorld(true);
      /* Die Gruppe ist breit und flach — die Kugel um sie herum ist deshalb viel grösser als
         das, was man sehen will. Flacherer Blick und straffere Polsterung beim Überblick. */
      if (id === 'ALLE') frameRow(node);
      else V.frame(node, [1, 0.78, 1], 1.14);
    };
    bar.appendChild(b);
  };
  for (const vw of views) mk(vw.id, vw.id, vw.group);
  if (views.length > 1) mk('ALLE', 'alle', rootNode);
  if (bar.firstChild) bar.firstChild.click();
}

/* ---------- Belegtafeln ---------- */
function ownerTable(r) {
  const L = ['── Eigentümer (nicht nachgebaut, sondern aufgerufen)'];
  for (const [was, wo, wie] of r.owners) {
    L.push('   ' + was);
    L.push('     ' + wo);
    L.push('     → ' + wie);
  }
  L.push('');
  L.push('── MISSING_DELTA (das Einzige, was hier neu entsteht)');
  for (const [was, stand, warum] of r.delta) {
    L.push('   [' + stand + '] ' + was);
    L.push('     ' + warum);
  }
  return L;
}

function renderA(r) {
  const L = ['GATE A · SPENDERLAGE', 'Legacy-Pin ' + r.pin, ''];
  L.push('── Akteure, in Bewegung, über den Owner-Weg');
  for (const a of r.actors) {
    if (a.status !== 'GELADEN') { L.push('   ' + a.path + '  ' + a.status); continue; }
    L.push('   ' + a.name + '   (' + a.rolle + ')');
    L.push('     ' + a.path);
    L.push('     bbox ' + a.size.join(' × ') + ' · wahre Höhe ' + a.trueHeight + ' · gezeigt ×' + a.shownScale);
    const bits = [];
    if (a.skin) bits.push('skinned');
    if (a.joints) bits.push(a.joints + ' bones');
    if (a.clips) bits.push(a.clips + ' clips');
    if (a.assembled) bits.push(a.assembled.length + '/4: ' + a.assembled.join(', '));
    if (a.missing && a.missing.length) bits.push('FEHLEND ' + a.missing.join(', '));
    if (a.playing) bits.push('spielt ' + a.playing);
    L.push('     ' + bits.join(' · '));
  }
  L.push('');
  if (r.legacyClips) {
    L.push('── Legacy-Clipsatz (' + r.legacyClips.length + ', eine Datei)');
    L.push('   ' + r.legacyClips.join(', '));
    L.push('');
  }
  L.push(...ownerTable(r));
  L.push('');
  L.push(r.errors.length ? '── FEHLER (' + r.errors.length + ')' : '── 0 Fehler');
  for (const e of r.errors) L.push('   ' + e.station + ' · ' + e.error);
  evidEl.textContent = L.join('\n');
}

function renderB(r) {
  const L = ['GATE B · REZEPTUR → MODELL → LAYOUT → SZENE', ''];
  L.push('── Kette');
  L.push('   Messung      ' + r.owners.messung);
  L.push('   Platzierung  ' + r.owners.platzierung);
  L.push('   Aufbau       kit-lab buildScene + repairTextures + auditFootprints');
  L.push('');
  L.push('── Gemessenes Kit (vom Owner, nicht hier)');
  L.push('   Modul ' + r.kit.MOD + ' · Wandhöhe ' + r.kit.WALL_H + ' · Wandplatte ' + r.kit.WALL_THICK +
    ' · Hub ' + r.kit.HUB + ' · Bauteile ' + r.kit.bestaetigt);
  L.push('');
  L.push('── Rezeptur (von Hand, reproduzierbar)');
  for (const row of r.recipe) L.push('   ' + row);
  L.push('');
  const m = r.maze;
  L.push('── MazeGraph (WhackMan-eigen · nur logische Verbundenheit)');
  L.push('   Raster        ' + m.widthCells + ' × ' + m.heightCells);
  L.push('   begehbar      ' + m.walkable + ' Knoten · ' + m.edges + ' Kanten');
  L.push('   Schleifen     ' + m.loops);
  L.push('   Kreuzungen    ' + m.junctions + ' (Grad 4) in ' + m.junctionClusters + ' Clustern · ' + m.branches + ' Abzweige');
  L.push('   Sackgassen    ' + m.deadEnds.length + (m.deadEnds.length ? ' · ' + m.deadEnds.join(' ') : ''));
  L.push('   unerreichbar  ' + m.unreachable.length);
  L.push('   Tunnelpaare   ' + m.tunnelPairs + ' · Pferch ' + m.pen + ' Zellen, Tür ' + (m.penDoorOk ? 'JA' : 'NEIN'));
  L.push('   Sammelgut     ' + m.pellets + ' regulär · ' + m.specials + ' Sonder · ' + m.story + ' Story');
  L.push('');
  L.push('── Gates §6');
  for (const [k, ok] of Object.entries(m.gates)) L.push('   ' + (ok ? '✓' : '✗') + ' ' + k);
  L.push('');
  L.push('── Gebaut');
  L.push('   ' + r.placements + ' Platzierungen aus layout()');
  L.push('   Fugen ' + r.model.seams + ' · Wände ' + r.model.walls + ' (' + r.model.halves + ' halb, ' +
    r.model.covered + ' von Ecken gedeckt) · Türen ' + r.model.doors + ' · Eckteile ' + r.model.corners);
  L.push('   freie Wandenden ' + r.model.freeWallEnds + ' · T/Kreuz ' + r.model.junctions +
    (r.model.tunnelOffen ? ' · Tunnelmünder offen statt Durchgang ' + r.model.tunnelOffen : ''));
  L.push('   Fackellichter ' + r.torchLights + ' · Türblätter ausgeblendet ' + r.hiddenDoorLeaves);
  if (r.pickups) L.push('   Sammelgut ' + r.pickups.pellets + ' / ' + r.pickups.specials + ' / ' + r.pickups.story +
    ' — Klone EINER geprüften Quelle je Familie');
  L.push('');
  L.push('── Owner-Prüfungen auf der gerenderten Geometrie');
  L.push('   Durchdringungen ' + r.footprints.kollisionen + (r.footprints.worst ? ' · tiefste ' + r.footprints.worst : ''));
  if (r.textures) L.push('   Texturen repariert: ' + (r.textures.repaired.join(', ') || 'keine nötig') +
    ' · offen: ' + (r.textures.broken.join(', ') || 'keine'));
  L.push('');
  L.push(r.errors.length ? '── FEHLER (' + r.errors.length + ')' : '── 0 Fehler');
  for (const e of r.errors) L.push('   ' + (e.teil || '') + ' · ' + e.error);
  evidEl.textContent = L.join('\n');
}

/* ---------- Gate-Umschaltung ---------- */
let built = null;

function clearGate() {
  if (built && built.root) {
    scene.remove(built.root);
    built.root.traverse((n) => { if (n.isMesh && n.geometry) n.geometry.dispose(); });
  }
  built = null;
  for (const L of labels) L.el.remove();
  labels.length = 0;
  bar.textContent = '';
  activeStation = null;
  hudEl.style.display = 'none';
  grpSpiel.style.display = 'none';
  modeBtn.style.display = 'none';
  viewBtn.style.display = 'none';
  liftBtn.style.display = 'none';
  laufBtn.style.display = 'none';
  sndBtn.style.display = 'none';
  V.controls.enabled = true;
}

async function mount(which) {
  clearGate();
  try {
    if (which === 'C') {
      built = await buildGateC({ scene, camera, controls: V.controls, onProgress: status, label: makeLabel,
        innenDecken: (window.__wmProps && window.__wmProps.innenDecken) || 'standard',
        laufflaeche: (window.__wmProps && window.__wmProps.laufflaeche) || 'gaenge' });
      renderB(built.report);
      activeStation = 'B';
      hudEl.style.display = 'block';
      grpSpiel.style.display = 'flex';
      modeBtn.style.display = 'block';
      viewBtn.style.display = 'block';
      liftBtn.style.display = 'block';
      laufBtn.style.display = 'block';
      sndBtn.style.display = 'block';
      const setMode = (m) => {
        built.setMode(m);
        modeBtn.textContent = m === 'kamera' ? 'Steuerung: kamerarelativ' : 'Steuerung: charakterrelativ';
      };
      /* Eine Belegung, eine Zeile. Die hat schon einmal etwas anderes behauptet als die
         Steuerung tat — deshalb steht sie an EINER Stelle und folgt der Ansicht. */
      const KFB = 'W/S vor·zurück · A/D drehen · Q/E strafe · Shift rennen · Space springen';
      const VIEWS = [
        ['verfolger', 'Verfolger', KFB],
        ['draufsicht', 'Draufsicht', KFB + ' · Blick senkrecht von oben'],
        ['orbit', 'freier Orbit', 'Ziehen = Orbit · Rad = Distanz · ' + KFB],
        ['freiflug', 'Freiflug (God)', 'WASD fliegt die Kamera · Q/E Höhe · Ziehen = drehen · Akteur steht']
      ];
      const setView = (v) => {
        const e = VIEWS.find((x) => x[0] === v) || VIEWS[0];
        built.setView(e[0]);
        viewBtn.textContent = 'Ansicht: ' + e[1];
        setHint(e[2]);
      };
      const setLift = () => {
        const on = built.report.laufflaeche === 'wandkronen';
        liftBtn.textContent = on ? 'Lauffläche: Wandkronen' : 'Lauffläche: Gänge';
        liftBtn.title = 'Umschalten über den Tweak — die Wegewahrheit wird neu gebaut';
      };
      const setLauf = (v) => {
        built.setLauf(v);
        laufBtn.textContent = v === 'chill' ? 'Lauf: Chill & Fun (hält an)' : 'Lauf: Pacman (läuft weiter)';
      };
      let snd = true;
      const setSnd = (v) => {
        snd = v; built.setAudio(v);
        sndBtn.textContent = v ? 'Ton: an' : 'Ton: aus';
        sndBtn.style.color = v ? GOLD : INK;
        sndBtn.style.borderColor = v ? GOLD : 'rgba(231,223,208,.28)';
      };
      laufBtn.onclick = () => setLauf(built.state.lauf === 'chill' ? 'pacman' : 'chill');
      sndBtn.onclick = () => setSnd(!snd);
      setLauf('chill');
      setSnd(true);
      setMode('charakter');
      setView('verfolger');
      setLift();
      modeBtn.onclick = () => setMode(built.state.mode === 'kamera' ? 'charakter' : 'kamera');
      viewBtn.onclick = () => {
        const i = VIEWS.findIndex((x) => x[0] === built.state.view);
        setView(VIEWS[(i + 1) % VIEWS.length][0]);
      };
      liftBtn.onclick = () => {
        const nw = built.report.laufflaeche === 'wandkronen' ? 'gaenge' : 'wandkronen';
        window.__wmProps = { ...(window.__wmProps || {}), laufflaeche: nw };
        mounted = null;                       // erzwingt Neubau mit der anderen Wegewahrheit
      };
      /* Im Spiel sind die Gate-B-Schilder aus: sie sitzen genau auf dem Spielerstart und
         verdecken die Figur, die sie beschriften. Per Knopf wieder einblendbar. */
      setLabels(false);
      status('GATE C · Tab öffnet die Werkzeuge');
    } else if (which === 'B') {
      built = await buildGateB({ scene, onProgress: status, label: makeLabel,
        innenDecken: (window.__wmProps && window.__wmProps.innenDecken) || 'standard' });
      renderB(built.report);
      setHint('Ziehen = Orbit · Rad = Distanz');
      setLabels(true);
      activeStation = 'B';
      scene.updateMatrixWorld(true);
      /* Der Grundriss ist breit und flach — die Bounding-KUGEL, mit der kit-labs frame() rechnet,
         ist deshalb viel grösser als das, was man sehen will. Auf die Breite rahmen, steiler
         blicken. */
      frameRow(built.root, 1.04, 0.95);
      const m = built.report.maze;
      const fails = Object.entries(m.gates).filter(([, ok]) => !ok).map(([k]) => k);
      status('GATE B · ' + m.walkable + ' Knoten · ' + m.loops + ' Schleifen · ' +
        (fails.length ? 'OFFEN: ' + fails.join(', ') : '§6 8/8'));
    } else {
      built = await buildGateA({ scene, onProgress: status, label: makeLabel });
      renderA(built.report);
      setHint('Ziehen = Orbit · Rad = Distanz · unten: Station');
      setLabels(true);
      buildBar(built.views, built.content || built.root);
      const n = built.report.actors.filter((a) => a.status === 'GELADEN').length;
      status('GATE A · ' + n + '/2 Legacy-Akteure in Bewegung · 1 offener MISSING_DELTA');
    }
    mattieren(scene);
    window.__wm = { V, scene, camera, built, report: built.report, mattieren };
  } catch (e) {
    status('BOOT FEHLGESCHLAGEN · ' + e.message);
    evidEl.textContent = String(e && e.stack ? e.stack : e);
    console.error('[whackman]', e);
  }
}

let mounted = null, mounting = false;
let mountedCeiling = null;
async function sync() {
  const P = window.__wmProps || {};
  const want = P.gate || 'A';
  const ceil = (P.innenDecken || 'standard') + '|' + (P.laufflaeche || 'gaenge');
  if (want === mounted && ceil === mountedCeiling) return;
  if (mounting) return;
  mountedCeiling = ceil;
  mounting = true;
  mounted = want;
  status('Gate ' + want + ' wird gebaut …');
  await mount(want);
  mounting = false;
}
setInterval(sync, 200);
sync();

/* Takt: rAF FÜHRT, ein Intervall fängt auf. Beides einzeln ist hier schon schiefgegangen —
   rAF wird in unsichtbaren Vorschaurahmen angehalten (Diorama-Pass), und ein reines Intervall
   wird auf ein Bild pro Sekunde gedrosselt, sobald der Rahmen nicht im Vordergrund ist (dieser
   Pass). Dieselbe Bauart wie kit-labs eigener Viewer: der Nachzügler zeichnet nur, wenn der
   Führende wirklich steht. */
let last = performance.now();
let lastTick = last;

function tick() {
  const now = performance.now();
  const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
  last = now;
  lastTick = now;
  if (built && built.update) built.update(dt, now / 1000);
  if (built && built.hud) hudEl.textContent = built.hud();
  placeLabels();
}

(function loop() { requestAnimationFrame(loop); tick(); })();
setInterval(() => { if (performance.now() - lastTick > 120) tick(); }, 60);
