// Billboard-Modul · Host-Vertrag R1.2: create(options) -> { object3d, update(dt, ctx), dispose() }
// Körper = World Billboard Clay01 r2, bodyStyle "plain" (vendor/billboard-clay01-r2, unverändert). Keine TV, nichts an den Pfosten.
// V-224 responsive Fläche: fitFace = fit_face aus build_billboard_b3_v2.py (contain der Kartenproportion in maxW × maxH);
// Rahmen und Pfosten folgen, weil bodyGeometry(W, H) um die Fläche gebaut wird.
// Karte randlos: Canvas = Kartenproportion, Karte füllt die Fläche vollständig; der Knetrahmen sitzt direkt an der Kartenkante.
// Niedrig: STYLES.plain.gb im exportierten STYLES-Objekt gesetzt (LAB-ANPASSUNG, Quelldatei unverändert).
import * as THREE from 'three';
import { bodyGeometry, faceGeometry, buildPalette, STYLES } from '../vendor/billboard-clay01-r2/billboard-clay.js';
import { k1Material, seedGeometry } from '../vendor/k1/clay-k1-adapter.js';

export const fitFace = (aspect, maxW, maxH) => { let w = maxW, h = maxW / aspect; if (h > maxH) { h = maxH; w = maxH * aspect; } return { w, h }; };
export const READ_LABEL = 'card text (no curated quote yet)';

export function create(o) {
  const card = o.card, K1U = o.K1U, maxW = o.maxW ?? 12, maxH = o.maxH ?? 6, gb = o.gb ?? 0.9, corner = o.corner ?? 0;
  const phrases = o.phrases || [];
  STYLES.plain.gb = gb; // LAB-ANPASSUNG: r2 exportiert STYLES als Objekt; nur gb (Bodenabstand) geändert
  const aspect = card.width / card.height, { w: W, h: H } = fitFace(aspect, maxW, maxH);
  const P = buildPalette({ biomePalette: { mode: 'fixed', ...(o.frame ? { override: { frame: o.frame } } : {}) } }, null);
  const g = new THREE.Group(); g.name = 'billboard-plain';
  const geo = bodyGeometry(W, H, P, 'plain', corner); if (!geo.attributes.claySeed) seedGeometry(THREE, geo, 5);
  const bodyMat = k1Material(K1U, '#ffffff', 'prop', true);
  const body = new THREE.Mesh(geo, bodyMat); body.castShadow = body.receiveShadow = true; body.name = 'body'; g.add(body);
  const cw = Math.min(2048, card.width), ch = Math.round(cw / aspect), cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
  const x = cv.getContext('2d'), tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const faceMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
  const face = new THREE.Mesh(faceGeometry(W, H, corner), faceMat); face.position.set(0, STYLES.plain.gb + H / 2, 0.035); face.name = 'face'; g.add(face);
  let last = '';
  const wrap = (t, maxWpx) => { const ws = t.split(' '), out = []; let l = ''; for (const s of ws) { const n = l ? l + ' ' + s : s; if (x.measureText(n).width > maxWpx && l) { out.push(l); l = s; } else l = n; } if (l) out.push(l); return out; };
  function paint(ra) {
    const key = ra && ra.active ? 'r' + ra.idx + ':' + Math.round((ra.k ?? 1) * 10) : 'card';
    if (key === last) return; last = key;
    x.clearRect(0, 0, cw, ch); x.drawImage(card, 0, 0, cw, ch);
    if (ra && ra.active) {
      const k = ra.k ?? 1; x.fillStyle = `rgba(31,26,20,${0.6 * k})`; x.fillRect(0, 0, cw, ch);
      const u = cw / 1024; x.textAlign = 'left'; x.textBaseline = 'top';
      x.font = `600 ${Math.round(22 * u)}px ui-monospace,Menlo,monospace`; const lw = x.measureText(READ_LABEL).width + 28 * u;
      x.fillStyle = '#f3ead3'; x.fillRect(24 * u, 22 * u, lw, 40 * u); x.fillStyle = '#1f1a14'; x.fillText(READ_LABEL, 38 * u, 31 * u);
      const ph = phrases[ra.idx] || ''; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = `900 ${Math.round(58 * u)}px system-ui,-apple-system,Helvetica,Arial,sans-serif`;
      const L = wrap(ph.toUpperCase(), cw * 0.84), lh = 74 * u;
      L.forEach((l, i) => { const y = ch / 2 + (i - (L.length - 1) / 2) * lh, w = x.measureText(l).width + 40 * u; x.globalAlpha = k; x.fillStyle = '#f3ead3'; x.fillRect(cw / 2 - w / 2, y - lh / 2 + 4 * u, w, lh - 8 * u); x.fillStyle = '#1f1a14'; x.fillText(l, cw / 2, y + 3 * u); x.globalAlpha = 1; });
      x.textAlign = 'left'; x.textBaseline = 'top'; x.font = `600 ${Math.round(22 * u)}px ui-monospace,Menlo,monospace`; const pt = 'POWER · ' + (ra.idx + 1) + ' / ' + phrases.length, pw = x.measureText(pt).width + 28 * u; x.fillStyle = '#f3ead3'; x.fillRect(cw - 24 * u - pw, 22 * u, pw, 40 * u); x.fillStyle = '#1f1a14'; x.fillText(pt, cw - 10 * u - pw, 31 * u);
    }
    tex.needsUpdate = true;
  }
  paint(null);
  g.updateMatrixWorld(true);
  const faceCenter = new THREE.Vector3(0, STYLES.plain.gb + H / 2, 0.035); // lokal zum Billboard-Objekt
  return {
    object3d: g,
    info: { W, H, gb: STYLES.plain.gb, aspect, faceCenter, canvas: [cw, ch], corner, palette: P, top: STYLES.plain.gb + H / 2 + H / 2 + 0.45 },
    update(dt, ctx) { paint(ctx && ctx.readAlong); },
    dispose() { tex.dispose(); faceMat.dispose(); bodyMat.dispose(); /* Geometrien gehören dem Cache von billboard-clay.js */ }
  };
}
