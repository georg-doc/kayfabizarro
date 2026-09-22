// ============================================================================
// demo.js — Schaufenster und Abnahme für den KFB CardBuilder
// ----------------------------------------------------------------------------
// Zeigt echte Cut-&-Play-Karten aus den Repo-PDFs in einer three.js-Szene und
// misst ihre Kante live. Zweck: der Zone-Builder (und jede andere Szene) sieht
// hier, was der Builder liefert, und kann die vier Zeilen abschreiben.
// ============================================================================

import * as THREE from 'three';
import { createCardBuilder } from './kfb-card-builder.js';

const stage = document.getElementById('cb-stage');
const panel = document.getElementById('cb-panel');
const INK = '#1f1a14';

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
stage.appendChild(renderer.domElement);
renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';

const scene = new THREE.Scene();
scene.background = new THREE.Color('#9fc7e8');
const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 400);
camera.position.set(0, 0, 34);

// Die Kamera RAHMT, sie steht nicht auf einer Zahl: drei Karten nebeneinander sind
// ~43 u breit, und wie viel davon ins Bild passt, hängt am Seitenverhältnis der Bühne.
// Eine feste Distanz schneidet die äußeren Karten ab, sobald das Panel breiter wird.
const SPAN = { w: 44, h: 12 };
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = Math.max(w / Math.max(h, 1), 0.2);
  const vf = camera.fov * Math.PI / 180, tan = Math.tan(vf / 2);
  const dH = (SPAN.h * 0.5) / tan;
  const dW = (SPAN.w * 0.5) / (tan * camera.aspect);
  camera.position.z = Math.max(dH, dW) * 1.06;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);
resize();

const cb = createCardBuilder({ THREE });
let cards = [], pool = [], preset = 'card', offset = 0;

async function rebuild() {
  for (const c of cards) { scene.remove(c.group); c.dispose(); }
  cards = [];
  cb.clearQueue();
  cb.setParams({ preset });
  if (!pool.length) pool = await cb.pool({ seed: 4242 });
  const take = pool.slice(offset % Math.max(1, pool.length), offset % Math.max(1, pool.length) + 3);
  const W = 13;
  take.forEach((card, i) => {
    const rec = cb.make(card, { width: W, seed: [7, 23, 41][i], onArt: () => paintPanel(), onFail: () => paintPanel() });
    rec.group.position.set((i - 1) * (W + 1.6), 0, 0);
    rec.group.rotation.y = (i - 1) * -0.18;
    rec.phase = i * 2.1;
    scene.add(rec.group);
    cards.push(rec);
  });
  paintPanel();
}

// ---------------------------------------------------------------- Panel
const PRESET_ORDER = ['card', 'academy-2026-07', 'sky-2026-07', 'chip'];
function el(tag, css, txt) { const e = document.createElement(tag); if (css) e.style.cssText = css; if (txt != null) e.textContent = txt; return e; }

function paintPanel() {
  panel.innerHTML = '';
  const P = cb.presets;

  panel.appendChild(el('div', 'font-family:"Baloo 2",system-ui,sans-serif;font-weight:800;font-size:13px;letter-spacing:.14em;text-transform:uppercase;opacity:.55;margin-bottom:10px', 'Tusche-Preset'));
  for (const key of PRESET_ORDER) {
    const p = P[key], on = key === preset;
    const b = el('button', 'display:block;width:100%;text-align:left;border:2px solid ' + INK + ';background:' + (on ? INK : 'transparent')
      + ';color:' + (on ? '#efe6d0' : INK) + ';font-family:inherit;font-size:13px;padding:9px 11px;margin-bottom:7px;cursor:pointer;line-height:1.35'
      + (p.deprecated ? ';border-style:dashed' : ''));
    b.innerHTML = '<b style="font-family:\'Baloo 2\',system-ui,sans-serif">' + p.label + '</b>'
      + '<div style="font-size:10.5px;opacity:' + (on ? '.75' : '.6') + ';margin-top:3px">' + p.use + '</div>';
    b.onclick = () => { preset = key; rebuild(); };
    panel.appendChild(b);
  }

  panel.appendChild(el('div', 'height:1px;background:rgba(31,26,20,.25);margin:16px 0'));
  panel.appendChild(el('div', 'font-family:"Baloo 2",system-ui,sans-serif;font-weight:800;font-size:13px;letter-spacing:.14em;text-transform:uppercase;opacity:.55;margin-bottom:8px', 'Abnahme dieser Kante'));

  const m = cards.length ? cards[0].measure() : null;
  if (m) {
    const rows = [
      ['Familie', m.kind + '  ·  für „' + m.for + '“'],
      ['Stützpunkte / lange Kante', String(m.points)],
      ['Federbreite  (% von min(B,H))', m.featherPct.toFixed(2) + ' %' + (m.featherResolutionBound ? ' *' : '')],
      ['Bauchung  (Spannweite, % der Breite)', m.bowPct.toFixed(2) + ' %'],
    ];
    const t = el('div', 'display:grid;grid-template-columns:1fr auto;gap:5px 10px;font-size:12.5px');
    for (const [k, v] of rows) {
      t.appendChild(el('div', 'opacity:.72', k));
      t.appendChild(el('div', 'font-weight:700;white-space:nowrap;font-family:"Baloo 2",system-ui,sans-serif', v));
    }
    panel.appendChild(t);
    if (m.featherResolutionBound) {
      panel.appendChild(el('div', 'font-size:10.5px;opacity:.6;margin-top:6px;line-height:1.45',
        '* Strich-Familie: die Federzahl hängt an der Messauflösung (' + m.measuredAt + ' px), nicht an der gezeichneten Kante — sie wird deshalb nicht gegen eine Schwelle geprüft.'));
    }
    const verdict = el('div', 'margin-top:10px;padding:9px 11px;border:2px solid ' + (m.ok ? '#3d6b4a' : '#b8361f')
      + ';color:' + (m.ok ? '#3d6b4a' : '#b8361f') + ';font-size:12px;line-height:1.45');
    verdict.innerHTML = m.ok
      ? '<b>besteht den Kanon für „' + m.for + '“.</b> Geprüft: ' + m.checked.join(' · ') + '.'
      : '<b>fällt durch:</b> ' + m.why + '.';
    panel.appendChild(verdict);
  }

  panel.appendChild(el('div', 'height:1px;background:rgba(31,26,20,.25);margin:16px 0'));
  panel.appendChild(el('div', 'font-family:"Baloo 2",system-ui,sans-serif;font-weight:800;font-size:13px;letter-spacing:.14em;text-transform:uppercase;opacity:.55;margin-bottom:8px', 'Karten'));

  const st = el('div', 'font-size:12px;line-height:1.6;opacity:.8');
  st.innerHTML = cards.map((c) => '· ' + (c.card.title || '?') + '  <span style="opacity:.6">' + c.artState + '</span>').join('<br>')
    + '<br><span style="opacity:.6">' + (cb.decks.length ? cb.decks.length + ' Decks · ' + pool.length + ' Karten aus dem Repo' : 'Registry lädt …')
    + (cb.pending ? ' · ' + cb.pending + ' PDF-Jobs' : '') + '</span>';
  panel.appendChild(st);

  const nx = el('button', 'margin-top:12px;width:100%;border:2px solid ' + INK + ';background:transparent;color:' + INK
    + ';font-family:inherit;font-size:13px;padding:9px;cursor:pointer', 'Nächste drei Karten');
  nx.onclick = () => { offset += 3; rebuild(); };
  panel.appendChild(nx);

  panel.appendChild(el('div', 'height:1px;background:rgba(31,26,20,.25);margin:16px 0'));
  const use = el('div', 'font-size:11.5px;line-height:1.6');
  use.innerHTML = '<div style="font-family:\'Baloo 2\',system-ui,sans-serif;font-weight:800;font-size:13px;letter-spacing:.14em;text-transform:uppercase;opacity:.55;margin-bottom:8px">So in eine Szene</div>'
    + '<pre style="margin:0;padding:10px;background:rgba(31,26,20,.07);overflow:auto;font-size:11px;line-height:1.55;white-space:pre-wrap">'
    + 'import { createCardBuilder }\n  from &#39;./kfb-card-builder.js&#39;;\n\n'
    + 'const cb = createCardBuilder({ THREE });\n'
    + 'const pool = await cb.pool();\n'
    + 'const c = cb.make(pool[0], { width: 11 });\n'
    + 'scene.add(c.group);</pre>'
    + '<div style="margin-top:9px;opacity:.72">Das Textblatt steht sofort, das PDF-Artwork schiebt sich selbst nach. '
    + '<code>c.measure()</code> gibt die vier Kennzahlen, <code>c.setSurface(tex)</code> setzt eine eigene Fläche ein '
    + '(Live-Render, Video, Foto) — die Silhouette bleibt.</div>';
  panel.appendChild(use);
}

// ---------------------------------------------------------------- Loop
let t0 = performance.now();
renderer.setAnimationLoop(() => {
  const t = (performance.now() - t0) / 1000;
  for (const c of cards) {
    c.group.position.y = Math.sin(t * 0.5 + c.phase) * 0.55;
    c.group.rotation.z = Math.sin(t * 0.34 + c.phase) * 0.022;
    c.group.rotation.x = Math.sin(t * 0.41 + c.phase * 1.7) * 0.03;
  }
  renderer.render(scene, camera);
});

rebuild();
window.__cardBuilder = { cb, get cards() { return cards; }, scene, camera, renderer, rebuild };
