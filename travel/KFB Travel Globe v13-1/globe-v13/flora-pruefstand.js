// ============================================================================
// flora-pruefstand.js — v11 · Screenshot-Beweise VOR dem Einbau
// ----------------------------------------------------------------------------
// Georg (2.9.): „korrekte Skalierungen, Gruppen- und Einzelformationen vor Einbau mit
// Screenshot-Beweisen (keine halbgaren oder falsch zusammengestellten Assets in Ausgabe)".
// Dieser Prüfstand lädt die Modelle über DENSELBEN Weg wie die Welt (`flora.js: ladeModell`)
// und baut Formationen mit DERSELBEN Regel (`formation.js`). Was hier steht, steht so in der
// Welt — sonst wäre der Beweis ein Beweis für etwas anderes.
//
// Bühne: Kugel R = 5 (wie die Welt), alles auf dem Nordpol im Tangentialrahmen. Kamera „flug"
// steht 0,03 u über Grund — die Reiseflughöhe — damit man sieht, was der Spieler sieht.
// Links immer die Referenz: Kenney `tree_default` (BAUM_WELT, der Eichpunkt aller Kits).
// ============================================================================
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { ladeModell, familienBoden } from './flora.js';
import { triadeSuchen, detailPlaetze, bueschel, kleinsterWinkel } from './formation.js';
import { BAUM_WELT, KIT, BODEN } from './kit-massstab.js';

const R = 5;
const q = new URLSearchParams(location.search);
let fam = q.get('fam') || 'baum';
let cam = q.get('cam') || 'flug';

// ⚠ Der DC-Wirt rendert die Vorlage nach dem Helmet-Skript noch einmal — gemerkte Elemente sind dann
// stale (Fehlerklasse 11, gemerkte DOM-Referenz). Also: Canvas selbst bauen und jedes Bild neu einhängen,
// Textziele bei jedem Zugriff frisch holen.
const canvas = document.createElement('canvas');
canvas.style.cssText = 'position:absolute; inset:0; width:100%; height:100%; display:block;';
const el = (id) => document.getElementById(id);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1));
renderer.outputColorSpace = THREE.SRGBColorSpace;
const scene = new THREE.Scene(); scene.background = new THREE.Color(0xcfe3ee);
const camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.005, 60);
scene.add(new THREE.HemisphereLight(0xdfe8ff, 0x6b5a3a, 1.1));
const sun = new THREE.DirectionalLight(0xfff1d6, 1.6); sun.position.set(3, 9, 4); scene.add(sun);
const boden = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 64), new THREE.MeshLambertMaterial({ color: 0x7f9a58 }));
scene.add(boden);
const buehne = new THREE.Group(); scene.add(buehne);

const N = new THREE.Vector3(0, 1, 0), T1 = new THREE.Vector3(1, 0, 0), T2 = new THREE.Vector3(0, 0, 1);
const bodenRadius = () => R;
function auf(n, m, sink) {
  const qq = new THREE.Quaternion().setFromUnitVectors(N, n);
  const p = n.clone().multiplyScalar(R - m.hW * (sink || 0.06));
  return new THREE.Matrix4().compose(p, qq, new THREE.Vector3(1, 1, 1));
}
function versatz(x, z) { return N.clone().addScaledVector(T1, x / R).addScaledVector(T2, z / R).normalize(); }
function mesh(m, M) {
  const g = new THREE.Group();
  for (const t of m.geo) { const mm = new THREE.Mesh(t.g, t.mat); g.add(mm); }
  g.applyMatrix4(M); buehne.add(g); return g;
}

let auswahl, repo, loader = new GLTFLoader(), ref = null;
const cache = new Map();
async function modell(e, detail) {
  const k = e.ghUrl + (detail ? '#d' : '');
  if (!cache.has(k)) cache.set(k, await ladeModell({ THREE, loader, eintrag: e }));
  return cache.get(k);
}
/** Familie laden + Familien-Boden anlegen — derselbe Weg wie flora.js `ladeFamilie`. */
const famCache = new Map();
async function familie(fam) {
  if (famCache.has(fam)) return famCache.get(fam);
  const ms = [];
  for (const e of auswahl.familien[fam].namen) { const m = await modell(e); if (m) ms.push(m); else zeile('⚠ nicht ladbar: ' + e.name); }
  const fb = familienBoden({ THREE, modelle: ms });
  famCache.set(fam, { ms, fb });
  return { ms, fb };
}
function seeded(s) { let x = s >>> 0 || 1; return () => { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x / 4294967296; }; }

const zeilenPuffer = [];
let titelText = 'Flora-Prüfstand';
let standText = 'lädt …';
function zeile(t) { zeilenPuffer.push(t); }
function domSync() {
  const host = el('fp-host'); if (host && canvas.parentElement !== host) host.appendChild(canvas);
  const t = el('fp-titel'); if (t && t.textContent !== titelText) t.textContent = titelText;
  const z = el('fp-zeilen');
  if (z && z.childElementCount !== zeilenPuffer.length) { z.textContent = ''; for (const x of zeilenPuffer) { const d = document.createElement('div'); d.textContent = x; z.appendChild(d); } }
  const sel = el('fp-fam');
  if (sel && auswahl && !sel.dataset.bound) { sel.dataset.bound = '1'; sel.textContent = '';
    for (const f of Object.keys(auswahl.familien).concat(['palme'])) { const o = document.createElement('option'); o.value = f; o.textContent = f; sel.appendChild(o); }
    sel.value = fam; sel.onchange = () => { fam = sel.value; bauen(); }; }
  const cs = el('fp-cam'); if (cs && !cs.dataset.bound) { cs.dataset.bound = '1'; cs.value = cam; cs.onchange = () => { cam = cs.value; kameraSetzen(); }; }
  const st = el('fp-stand'); if (st && st.textContent !== standText) st.textContent = standText;
}

let breite = 1;
async function bauen() {
  while (buehne.children.length) buehne.remove(buehne.children[0]);
  zeilenPuffer.length = 0;
  const F = auswahl.familien[fam];
  if (!F && fam !== 'palme') { titelText = 'Familie „' + fam + '" unbekannt'; return; }
  titelText = (fam === 'palme' ? 'BUG-08 · Palmenkrone' : 'Familie ' + fam) + ' · Kamera ' + cam;
  standText = 'baut ' + fam + ' …';
  if (!ref) {
    const e = repo.assets.find((a) => a.name === 'tree_default');
    ref = await modell({ pack: e.pack, name: e.name, ghUrl: e.ghUrl });
  }
  let x = 0;
  const reihe = [];
  // Referenzbaum links
  mesh(ref, auf(versatz(x, 0), ref)); reihe.push(ref);
  zeile('REF tree_default (kenney) · h ' + ref.hW.toFixed(4) + ' u (Eichpunkt 0,075 · Baum-Median jedes Kits = BAUM_WELT ' + BAUM_WELT.toFixed(4) + ') · ' + ref.tri + ' tri');
  x += ref.rGrund;
  if (fam === 'palme') {
    // Alle vier Palmen der Welt (SURREAL in globe-landmarks): Teile, Seiten, Dreiecke — gemessen am geladenen glTF.
    for (const nm of ['palm-detailed-straight', 'palm-bend', 'palm-straight', 'palm-detailed-bend']) {
      const e = repo.assets.find((a) => a.name === nm); if (!e) { zeile('⚠ ' + nm + ' nicht im asset-repo'); continue; }
      const a = await modell({ pack: e.pack, name: e.name, ghUrl: e.ghUrl });
      if (!a) { zeile('⚠ ' + nm + ' nicht ladbar'); continue; }
      const aQuelle = { ...a, geo: a.geo.map((t) => ({ ...t, mat: t.mat.clone() })) };
      for (const t of aQuelle.geo) t.mat.side = t.quellSeite != null ? t.quellSeite : THREE.FrontSide;
      x += a.rGrund * 1.3; mesh(aQuelle, auf(versatz(x, 0), aQuelle)); x += a.rGrund * 1.3; reihe.push(aQuelle);
      zeile(nm + ' mit QUELL-Seite ' + a.geo.map((t) => ['Front', 'Back', 'Double'][t.quellSeite] || '?').join('/') + ' · h ' + a.hW.toFixed(4) + ' u = ' + (a.hW / BAUM_WELT).toFixed(2) + ' Bäume · ' + a.tri + ' tri · ' + a.geo.length + ' Teil(e), je ' + a.geo.map((t) => t.tri).join('/') + ' tri · map ' + a.geo.map((t) => (t.mat.map ? 'ja' : 'nein')).join('/'));
    }
    zeile('Kamera „unten“ steht auf Reiseflughöhe 0,03 u unter den Kronen. Hypothese BUG-08 (Backface-Culling) gilt nur, wenn hier eine Quellseite „Front“ steht UND die Krone von unten fehlt.');
  } else {
    const { ms, fb } = await familie(fam);
    ms.sort((p, r) => p.rGrund - r.rGrund);
    zeile('FAMILIEN-BODEN: Median kit-treu ' + fb.median.toFixed(4) + ' u → Faktor ×' + fb.f.toFixed(2) + (fb.f > 1.001 ? ' (auf Boden ' + BODEN.mindestHoehe + ' gehoben, Verhältnisse erhalten)' : ' (kit-treu, kein Eingriff)') + (fb.gedeckelt ? ' · DECKEL griff: größtes Stück auf 0,6 Bäume = ' + fb.hMax.toFixed(4) + ' u begrenzt' : ''));
    for (const m of ms) {
      x += m.rGrund * 1.25; mesh(m, auf(versatz(x, 0), m)); x += m.rGrund * 1.25; reihe.push(m);
      zeile(m.name + ' · roh ' + m.roh.map((v) => v.toFixed(2)).join('×') + ' m · Welt h ' + m.hW.toFixed(4) + ' u = '
        + (m.hW / BAUM_WELT).toFixed(2) + ' Bäume · ' + m.weg
        + ' · ' + m.tri + ' tri · ' + m.geo.length + ' Teil(e) · Quellseite ' + m.geo.map((t) => ['Front', 'Back', 'Double'][t.quellSeite] || '?').join('/'));
    }
    // Formation VOR der Reihe, links versetzt (z positiv = zur Kamera): dieselben Funktionen wie flora.js
    const rnd = seeded(4711);
    const z = 0.22, gueltig = () => true;
    let fx = -0.16;
    const bauart = F.bauart;
    if (bauart === 'triade') {
      const G = ms[ms.length - 1], Mi = ms[Math.floor(ms.length / 3)];
      const K = (await familie('busch')).ms[4];
      const n = versatz(fx, z);
      const t = triadeSuchen({ THREE, n, rG: G.rGrund, rM: Mi.rGrund, rK: K.rGrund, R, gueltig, rnd });
      mesh(G, auf(n, G)); mesh(Mi, auf(t.pM, Mi)); mesh(K, auf(t.pK, K));
      const det = auswahl.familien.pilz.namen[1]; const D = await modell(det, true);
      for (const pD of detailPlaetze({ THREE, n, rG: G.rGrund, R, anzahl: 2, gueltig, rnd })) mesh(D, auf(pD, D));
      zeile('FORMATION Triade: ' + G.name + ' (groß) · ' + Mi.name + ' (mittel, 0,85·(rG+rM)) · ' + K.name + ' (klein, 1,7·(rG+rK), 70–110°) · kleinster Winkel '
        + t.winkel.toFixed(0) + '° (Tor ≥ 25°) · 2 Details ' + D.name + ' ohne Boden (h ' + D.hW.toFixed(4) + ')');
    } else if (bauart === 'einzel+detail') {
      const S = ms[Math.floor(ms.length / 2)]; const D = await modell(auswahl.familien.pilz.namen[0], true);
      const n = versatz(fx, z); mesh(S, auf(n, S));
      const pl = detailPlaetze({ THREE, n, rG: S.rGrund, R, anzahl: 3, gueltig, rnd, deckel: 2.2 });
      for (const p of pl) mesh(D, auf(p, D));
      zeile('FORMATION Stumpf + ' + pl.length + ' Pilze als Detail (' + D.name + ', ohne Boden h ' + D.hW.toFixed(4) + ' — kit-treu 0,2 m)');
    } else if (bauart === 'bueschel') {
      const span = F.anzahlJe || [3, 3];
      const L = ms[Math.floor(ms.length * 0.6)];
      const n = versatz(fx, z);
      const pl = bueschel({ THREE, n, r: L.rGrund, R, anzahl: span[1], gueltig, rnd });
      for (const p of pl) mesh(L, auf(p, L));
      zeile('FORMATION Büschel ' + pl.length + '× ' + L.name + ' (Mindestabstand 0,72·r, Radius ' + L.rGrund.toFixed(4) + ')');
    } else zeile('FORMATION: einzeln (' + bauart + ')');
  }
  breite = x;
  kameraSetzen();
}

function kameraSetzen() {
  const mitte = versatz(breite / 2, -0.1).multiplyScalar(R);
  const hMax = Math.max(0.08, ...buehne.children.map((g) => (g.userData.h || 0)));
  if (cam === 'flug') {
    // Reiseflughöhe: 0,03 u über Grund, schräg von vorn, so weit weg, dass die Reihe ins Bild passt
    const d = Math.max(0.5, breite * 0.75);
    camera.position.copy(versatz(breite / 2, d).multiplyScalar(R + 0.03));
    camera.lookAt(mitte.clone().add(N.clone().multiplyScalar(0.03)));
  } else if (cam === 'oben') {
    const d = Math.max(0.5, breite * 0.6);
    camera.position.copy(versatz(breite / 2, d * 0.8).multiplyScalar(R + d * 0.7));
    camera.lookAt(mitte);
  } else if (cam === 'formation') {
    // Nahaufnahme der Formation (steht bei x = -0,16, z = +0,22), aus Reiseflughöhe
    camera.position.copy(versatz(-0.16 + 0.05, 0.22 + 0.28).multiplyScalar(R + 0.03));
    camera.lookAt(versatz(-0.16, 0.22).multiplyScalar(R + 0.02));
  } else if (cam === 'unten') {
    // unter der Krone, Blick leicht nach oben — der Palmenfall
    camera.position.copy(versatz(breite / 2, 0.14).multiplyScalar(R + 0.03));
    camera.lookAt(versatz(breite / 2, 0).multiplyScalar(R + 0.07));
  }
  camera.updateProjectionMatrix();
  titelText = (fam === 'palme' ? 'BUG-08 · Palmenkrone' : 'Familie ' + fam) + ' · Kamera ' + cam;
}

function groesse() {
  const pe = canvas.parentElement; if (!pe) return;
  const w = pe.clientWidth || 960, h = pe.clientHeight || 540;
  if (canvas.width === Math.round(w * renderer.getPixelRatio()) && canvas.height === Math.round(h * renderer.getPixelRatio())) return;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
}
addEventListener('resize', groesse);
let letzterFehler = null;
function bild() {
  try { domSync(); groesse(); renderer.render(scene, camera); }
  catch (e) { letzterFehler = String(e && e.message || e); const st = el('fp-stand'); if (st) st.textContent = 'Fehler im Bild: ' + letzterFehler; }
}
// ⚠ rAF allein reicht nicht: in einem verdeckten Rahmen drosselt der Browser es auf null (Lehre
// aus pruefstand.js). Ein Taktgeber daneben hält Bild und DOM-Abgleich am Leben.
function loop() { bild(); requestAnimationFrame(loop); }
setInterval(bild, 250);

(async () => {
  auswahl = await (await fetch('./globe-v13/flora-auswahl.json')).json();
  repo = await (await fetch('./asset-repo.json')).json();
  window.__fp = { async setzen(f, c) { fam = f || fam; cam = c || cam; const sel = el('fp-fam'); if (sel) sel.value = fam; const cs = el('fp-cam'); if (cs) cs.value = cam; await bauen(); standText = 'bereit'; },
                  kamera(c) { cam = c; const cs = el('fp-cam'); if (cs) cs.value = c; kameraSetzen(); }, scene, renderer, camera, bild, get cam() { return cam; }, get bereit() { return standText === 'bereit'; } };
  loop();
  await bauen();
  standText = 'bereit';
})().catch((e) => { standText = 'Fehler: ' + (e.message || e); console.error(e); });
