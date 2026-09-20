// ============================================================================
// asset-inventur.js — Slice „Meckertronic" · Schritt 0: INDIZIEREN, nicht einbauen
// ----------------------------------------------------------------------------
// Anlass (1.9., zweite Runde): Georg nennt media/3D_Assets/KFB/ als Ablage der neuen
// Palm-/Pine-/Cube-Tree- und MECH-Modelle. Zwei Werkzeuge haben den Bestand FALSCH verneint:
//   · das Tree-Listing des Agenten filtert .glb grundsätzlich weg („importable files"),
//   · asset-repo.json (Stand 25.7.) und die CATALOG-Manifeste (23.7.) sind älter als der Upload.
// Die Regel steht im Repo selbst (ASSETS.md): **„Ein Manifest ist eine Behauptung, der
// Live-Abruf der Beweis."** Also fragt diese Seite den LIVE-GitHub-Baum (git/trees API,
// rekursiv) und lädt jedes .glb wirklich — erst dann gibt es Zahlen.
//
// Je Modell wird gemessen, was der Sprintplan verlangt (Onboarding §5, Meckertronic):
//   Maßstab (Bounding-Box) · Dreieckszahl · Farbweg (Atlas / Vertexfarben / Material-Farbe) ·
//   Clips (Name + Länge — die Boden-Slice-Checkliste braucht genau die) · Vorschaubild.
// Ergebnis zusätzlich als kopierfertiger JSON-Block im asset-repo-Format (Merge kommt später,
// von Hand — dieser Index BEHAUPTET nichts in die Manifeste hinein).
//
// PM-41: Kontrollprobe eingebaut — ein bekannt vorhandenes Nicht-GLB (alphaMap.jpg) muss im
// Baum auftauchen, sonst ist die Baumabfrage selbst kaputt und alle Zahlen wertlos.
// ============================================================================
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const REPO_API = 'https://api.github.com/repos/georg-doc/kayfabizarro/git/trees/main?recursive=1';
const RAW_BASE = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/';
const PREFIX = 'media/3D_Assets/KFB/';
const KONTROLLE = PREFIX + 'alphaMap.jpg';   // lag am 1.9. nachweislich im Baum

const wurzel = document.getElementById('inv-wurzel') || document.body;
const el = (tag, css, text) => { const e = document.createElement(tag); if (css) e.style.cssText = css; if (text != null) e.textContent = text; return e; };
const status = el('div', 'font:13px/1.5 monospace;color:#8fbcff;margin:6px 0 14px;white-space:pre-wrap;');
wurzel.appendChild(status);
const sag = (t) => { status.textContent = t; };

// EIN Renderer für alle Vorschauen — 30 WebGL-Kontexte wären das Budget der Hauptseite.
const R = 220;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });
renderer.setSize(R, R);
const cam = new THREE.PerspectiveCamera(35, 1, 0.01, 100);
const licht1 = new THREE.HemisphereLight(0xffffff, 0x445566, 1.2);
const licht2 = new THREE.DirectionalLight(0xffffff, 1.6); licht2.position.set(2, 3, 2);

function vorschau(objekt, groesse) {
  const scene = new THREE.Scene();
  scene.add(licht1.clone(), licht2.clone(), objekt);
  const d = Math.max(groesse.x, groesse.y, groesse.z) || 1;
  cam.position.set(d * 1.4, d * 0.9, d * 1.4);
  cam.lookAt(0, groesse.y * 0.4, 0);
  renderer.render(scene, cam);
  return renderer.domElement.toDataURL('image/png');
}

function farbweg(gltf) {
  let atlas = false, vertex = false, meshes = 0;
  gltf.scene.traverse((c) => {
    if (!c.isMesh) return;
    meshes++;
    const m = Array.isArray(c.material) ? c.material : [c.material];
    for (const mat of m) if (mat && mat.map) atlas = true;
    if (c.geometry && c.geometry.attributes && c.geometry.attributes.color) vertex = true;
  });
  // ⚠ Lehre vom 1.9. (Onboarding §5): das Tor damals las `material.color` statt der gebauten
  // Szene und erklärte ein funktionierendes Modell für farblos. Hier zählt die GEOMETRIE.
  return { meshes, weg: atlas ? 'Atlas/Textur' : vertex ? 'Vertexfarben' : 'Material-Farbe' };
}

function dreiecke(gltf) {
  let tri = 0;
  gltf.scene.traverse((c) => {
    if (!c.isMesh || !c.geometry) return;
    const g = c.geometry;
    tri += Math.round((g.index ? g.index.count : (g.attributes.position ? g.attributes.position.count : 0)) / 3);
  });
  return tri;
}

async function los() {
  sag('Live-Baum wird geholt (api.github.com, main, rekursiv) …');
  let baum;
  try {
    const r = await fetch(REPO_API);
    if (!r.ok) throw new Error('HTTP ' + r.status + (r.status === 403 ? ' — vermutlich API-Rate-Limit (60/h ohne Token); in ein paar Minuten neu laden' : ''));
    baum = await r.json();
  } catch (e) { sag('✗ Baumabfrage fehlgeschlagen: ' + e.message); return; }
  const alle = (baum.tree || []).filter((n) => n.path.startsWith(PREFIX) && n.type === 'blob');
  // PM-41 · Kontrollprobe: die Abfrage muss das bekannt Vorhandene sehen, sonst schweigt sie zu Recht.
  if (!alle.some((n) => n.path === KONTROLLE)) {
    sag('✗ KAPUTTES INSTRUMENT · Kontrollprobe fehlt (' + KONTROLLE + ' nicht im Ergebnis' +
        (baum.truncated ? '; Baum ist TRUNCATED' : '') + ') — keine Aussage über den Bestand möglich.');
    return;
  }
  const glbs = alle.filter((n) => /\.(glb|gltf)$/i.test(n.path));
  const rest = alle.filter((n) => !/\.(glb|gltf)$/i.test(n.path));
  sag('✓ Baum live · ' + alle.length + ' Dateien unter ' + PREFIX + ' · davon ' + glbs.length +
      ' GLB/glTF · Kontrollprobe bestanden' + (baum.truncated ? ' · ⚠ truncated' : '') +
      '\nSonstiges: ' + rest.map((n) => n.path.slice(PREFIX.length)).join(' · '));

  const liste = el('div', 'display:flex;flex-wrap:wrap;gap:14px;');
  wurzel.appendChild(liste);
  const index = [];
  const loader = new GLTFLoader();

  for (const n of glbs) {
    const name = n.path.slice(PREFIX.length);
    const karte = el('div', 'width:236px;background:#101826;border:1px solid #2a3a52;border-radius:8px;padding:8px;font:12px/1.45 monospace;color:#cfe0f4;');
    karte.appendChild(el('div', 'font-weight:bold;color:#e8d38a;margin-bottom:4px;word-break:break-all;', name));
    liste.appendChild(karte);
    try {
      // Cache-Buster nach Hausregel (ASSETS.md): ohne ?v= liefert der CDN bis zu 5 min alte 404.
      const gltf = await loader.loadAsync(RAW_BASE + n.path + '?v=' + Date.now());
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const s = box.getSize(new THREE.Vector3());
      // Fuß auf den Ursprung für die Vorschau, Original-Transform bleibt gemessen.
      gltf.scene.position.y -= box.min.y;
      const fw = farbweg(gltf);
      const tri = dreiecke(gltf);
      const clips = (gltf.animations || []).map((c) => c.name + ' ' + c.duration.toFixed(2) + 's');
      const img = el('img', 'width:220px;height:220px;background:#0a1020;border-radius:4px;');
      img.src = vorschau(gltf.scene, s);
      karte.appendChild(img);
      karte.appendChild(el('div', 'margin-top:5px;',
        'Hülle ' + s.x.toFixed(3) + ' × ' + s.y.toFixed(3) + ' × ' + s.z.toFixed(3) + ' u\n'));
      karte.appendChild(el('div', '', tri.toLocaleString('de-DE') + ' tri · ' + fw.meshes + ' Meshes · ' + fw.weg));
      karte.appendChild(el('div', 'color:' + (clips.length ? '#8fe0a0' : '#9aa79c') + ';',
        clips.length ? 'Clips: ' + clips.join(' · ') : 'keine Animation'));
      karte.appendChild(el('div', 'color:#9aa79c;', (n.size / 1024).toFixed(0) + ' kB'));
      index.push({ id: 'KFB/' + name.replace(/\.(glb|gltf)$/i, ''), name: name.replace(/\.(glb|gltf)$/i, ''),
                   pack: 'KFB', size: [+s.x.toFixed(3), +s.y.toFixed(3), +s.z.toFixed(3)],
                   fp: [+s.x.toFixed(3), +s.z.toFixed(3)], tri, farbweg: fw.weg,
                   anim: clips.length > 0, clips,
                   ghUrl: RAW_BASE + n.path });
    } catch (e) {
      karte.appendChild(el('div', 'color:#f08a7c;', '✗ lädt nicht: ' + e.message));
    }
  }

  const kopf = el('div', 'font:bold 14px monospace;color:#e8d38a;margin:18px 0 6px;',
    'Kopierfertiger Index (asset-repo-Format, Merge von Hand — dieser Block behauptet nichts):');
  wurzel.appendChild(kopf);
  const pre = el('pre', 'background:#0a1020;border:1px solid #2a3a52;border-radius:8px;padding:10px;color:#cfe0f4;font:11px/1.5 monospace;white-space:pre-wrap;max-height:340px;overflow:auto;');
  pre.textContent = JSON.stringify(index, null, 2);
  wurzel.appendChild(pre);
  window.__inventur = index;
}
los();
