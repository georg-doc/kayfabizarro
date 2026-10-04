/* KFB WB-D1 · Straßennamen, zwei Darstellungen (Georg 25.09.)
   'road'  = Schrift flach auf der Fahrbahn, entlang eines geraden Segments, lesbar von W→O bzw. S→N
   'signs' = schwebende Straßenschilder an Kreuzungen, Sprite (dreht sich immer zur Kamera),
             angelehnt an das blaue Schild mit weißer Schrift, entsättigt in die KFB-Palette
   Dazu die Homebase (zone.home): goldener Bodenring um den Grundriss + Schild über dem Dach. */
import * as THREE from 'three';

const FONT = '"Barlow Condensed", "Arial Narrow", sans-serif';
const SIGN = { fill: '#46698f', rim: '#e9e1cf', ink: '#f6efe0', homeRim: '#f1c85b' };
const HOME = { fill: '#f1c85b', ink: '#2b2530', ring: '#f1c85b' };
const DRIVE = new Set(['primary', 'primary_link', 'secondary', 'secondary_link', 'tertiary', 'tertiary_link', 'residential', 'service', 'living_street', 'unclassified', 'pedestrian']);

function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
function tex(cv) { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; return t; }

function roadTex(text, ink) {
  const fs = 96, cv = document.createElement('canvas'), c = cv.getContext('2d');
  c.font = '600 ' + fs + 'px ' + FONT; const w = Math.ceil(c.measureText(text).width) + 40;
  cv.width = w; cv.height = 128; c.font = '600 ' + fs + 'px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillStyle = ink; c.fillText(text, w / 2, 68);
  return { t: tex(cv), aspect: w / 128 };
}
function signTex(text, { fill, rim, ink }) {
  const fs = 66, H = 112, cv = document.createElement('canvas'), c = cv.getContext('2d');
  c.font = '600 ' + fs + 'px ' + FONT; const w = Math.ceil(c.measureText(text).width) + 64;
  cv.width = w; cv.height = H; c.font = '600 ' + fs + 'px ' + FONT;
  rr(c, 2, 2, w - 4, H - 4, 16); c.fillStyle = fill; c.fill();
  rr(c, 10, 10, w - 20, H - 20, 10); c.lineWidth = 4; c.strokeStyle = rim; c.globalAlpha = 0.8; c.stroke(); c.globalAlpha = 1;
  c.fillStyle = ink; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, w / 2, H / 2 + 3);
  return { t: tex(cv), aspect: w / H };
}

export async function buildStreetNames(zone, { y = 0.05, homeStreet = null } = {}) {
  try { await Promise.race([document.fonts.load('600 64px "Barlow Condensed"'), new Promise((r) => setTimeout(r, 2500))]); } catch {}
  const ground = new THREE.Group(); ground.name = 'street-names:road';
  const signs = new THREE.Group(); signs.name = 'street-names:signs';
  const stats = { names: 0, roadLabels: 0, signs: 0, intersections: 0 };
  const roads = zone.roads.filter((r) => r.name && DRIVE.has(r.cls) && r.tunnel !== 'yes' && !(r.layer < 0) && r.line.length > 1);
  const names = [...new Set(roads.map((r) => r.name))]; stats.names = names.length;

  /* ---- auf der Fahrbahn ---- */
  const rtex = new Map();
  const up = new THREE.Vector3(0, 1, 0);
  for (const r of roads) {
    const hot = r.name === homeStreet;
    if (!rtex.has(r.name)) rtex.set(r.name, { n: roadTex(r.name, 'rgba(246,239,224,.9)'), h: roadTex(r.name, '#ffe08a') });
    const T = rtex.get(r.name)[hot ? 'h' : 'n'];
    const hT = Math.max(1.5, Math.min(3.2, r.w * 0.42)), wT = hT * T.aspect;
    let run = 0, last = -1e9;
    for (let i = 1; i < r.line.length; i++) {
      const A = r.line[i - 1], B = r.line[i], L = Math.hypot(B.x - A.x, B.z - A.z);
      const mid = run + L / 2; run += L;
      if (L < wT + 3 || mid - last < 110 || mid < 18) continue;
      last = mid;
      let dx = (B.x - A.x) / L, dz = (B.z - A.z) / L;
      if (dx < -0.2 || (Math.abs(dx) <= 0.2 && dz > 0)) { dx = -dx; dz = -dz; }        // W→O, sonst S→N lesbar
      const X = new THREE.Vector3(dx, 0, dz), Y = new THREE.Vector3(dz, 0, -dx);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(wT, hT), new THREE.MeshStandardMaterial({ map: T.t, transparent: true, depthWrite: false, roughness: 0.95, metalness: 0, polygonOffset: true, polygonOffsetFactor: -8, polygonOffsetUnits: -16 }));
      m.matrixAutoUpdate = false; m.matrix.makeBasis(X, Y, up).setPosition((A.x + B.x) / 2, y + 0.04, (A.z + B.z) / 2);
      m.receiveShadow = true; m.renderOrder = 3; m.name = 'road-label:' + r.name; ground.add(m); stats.roadLabels++;
    }
  }

  /* ---- Schilder an Kreuzungen ---- */
  const key = (p) => Math.round(p.x * 5) + ':' + Math.round(p.z * 5);
  const at = new Map();
  for (const r of roads) for (const p of r.line) { const k = key(p); if (!at.has(k)) at.set(k, { x: p.x, z: p.z, n: new Set() }); at.get(k).n.add(r.name); }
  const nodes = [...at.values()].filter((v) => v.n.size > 1);
  const clusters = [];
  for (const v of nodes) { const c = clusters.find((q) => Math.hypot(q.x - v.x, q.z - v.z) < 22); if (c) { v.n.forEach((n) => c.n.add(n)); } else clusters.push({ x: v.x, z: v.z, n: new Set(v.n) }); }
  stats.intersections = clusters.length;
  const signed = new Set(); clusters.forEach((c) => c.n.forEach((n) => signed.add(n)));
  const lenOf = (r) => { let s = 0; for (let i = 1; i < r.line.length; i++) s += Math.hypot(r.line[i].x - r.line[i - 1].x, r.line[i].z - r.line[i - 1].z); return s; };
  for (const n of names) if (!signed.has(n)) {
    const r = roads.filter((q) => q.name === n).sort((a, b) => lenOf(b) - lenOf(a))[0], m = r.line[Math.floor(r.line.length / 2)];
    clusters.push({ x: m.x, z: m.z, n: new Set([n]) });
  }
  /* Eindeutig an Kreuzungen (Georg 25.09.: gestapelte Schilder in der Mitte = unklar, welches wozu gehört):
     jedes Schild steht ÜBER SEINER EIGENEN Straße, 12 m vom Knoten weg auf einem ihrer Arme, mit einem
     dünnen Stab bis auf die Fahrbahn. Hat die Straße mehrere Arme, nimmt das Schild pro Bild den der Kamera
     nächsten — es springt nie auf die Querstraße. */
  const LEG = 12;
  const walk = (line, i, dir, dist) => { let left = dist, a = line[i]; for (let j = i + dir; j >= 0 && j < line.length; j += dir) { const b = line[j], L = Math.hypot(b.x - a.x, b.z - a.z); if (L >= left) { const t = left / L; return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t }; } left -= L; a = b; } return null; };
  const legsOf = (c, n) => {
    const out = [];
    for (const r of roads) if (r.name === n) r.line.forEach((p, i) => {
      if (Math.hypot(p.x - c.x, p.z - c.z) > 22) return;
      for (const dir of [1, -1]) { const q = walk(r.line, i, dir, LEG); if (q && Math.hypot(q.x - c.x, q.z - c.z) > LEG * 0.6 && !out.some((o) => Math.hypot(o.x - q.x, o.z - q.z) < 7)) out.push(q); }
    });
    return out.length ? out : [{ x: c.x, z: c.z }];
  };
  const stex = new Map(), sprites = [];
  const pinMat = new THREE.LineBasicMaterial({ color: SIGN.fill, transparent: true, opacity: 0.85 });
  for (const c of clusters) for (const n of c.n) {
    const hot = n === homeStreet;
    if (!stex.has(n)) stex.set(n, signTex(n, { ...SIGN, rim: hot ? SIGN.homeRim : SIGN.rim }));
    const T = stex.get(n), legs = legsOf(c, n).map((q) => new THREE.Vector3(q.x, y + 4.2, q.z));
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.t, transparent: true, depthWrite: false }));
    const pin = new THREE.Line(new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(6), 3)), pinMat.clone());
    pin.frustumCulled = false; pin.name = 'sign-pin:' + n; signs.add(pin);
    s.userData = { base: legs[0], legs, h: 0.95, aspect: T.aspect, stack: 0, cls: 'street', pin, y0: y + 0.05 }; s.renderOrder = 8; s.name = 'sign:' + n;
    sprites.push(s); signs.add(s); stats.signs++; stats.legs = (stats.legs || 0) + legs.length;
  }

  /* ---- Homebase ---- */
  let home = null;
  const hb = zone.home && zone.buildings.find((b) => b.id === zone.home.id);
  if (hb) {
    const hg = new THREE.Group(); hg.name = 'homebase:' + zone.home.address;
    const fp = hb.fp.slice(0, -1); let cx = 0, cz = 0; for (const p of fp) { cx += p.x; cz += p.z; } cx /= fp.length; cz /= fp.length;
    const off = (d) => fp.map((p) => { const dx = p.x - cx, dz = p.z - cz, l = Math.hypot(dx, dz) || 1; return new THREE.Vector2(p.x + dx / l * d, -(p.z + dz / l * d)); });
    const sh = new THREE.Shape(off(2.1)); sh.holes.push(new THREE.Path(off(0.9)));
    const rg = new THREE.ShapeGeometry(sh); rg.rotateX(-Math.PI / 2); rg.translate(0, y + 0.05, 0);
    const ring = new THREE.Mesh(rg, new THREE.MeshStandardMaterial({ color: HOME.ring, roughness: 0.8, metalness: 0, emissive: HOME.ring, emissiveIntensity: 0.25, polygonOffset: true, polygonOffsetFactor: -9, polygonOffsetUnits: -18 }));
    ring.receiveShadow = true; ring.name = 'homebase-ring'; hg.add(ring);
    const T = signTex(zone.home.address, { fill: HOME.fill, rim: '#2b2530', ink: HOME.ink });
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.t, transparent: true, depthWrite: false, depthTest: false }));
    s.userData = { base: new THREE.Vector3(cx, (hb.minH || 0) + hb.h + 5, cz), h: 1.4, aspect: T.aspect, stack: 0, cls: 'home' }; s.renderOrder = 12; s.name = 'homebase-sign';
    sprites.push(s); hg.add(s);
    home = { group: hg, centroid: { x: cx, z: cz }, id: hb.id, h: hb.h };
  }

  /* Größe mit Abstand leicht mitwachsen (lesbar bis ~150 m), ab 300 m ausblenden — nicht dominant */
  const P = new THREE.Vector3();
  function update(camera) {
    for (const s of sprites) {
      if (!s.parent || !s.parent.visible) continue;
      const u = s.userData;
      if (u.legs && u.legs.length > 1) { let bd = Infinity; for (const L of u.legs) { const dd = camera.position.distanceToSquared(L); if (dd < bd) { bd = dd; u.base = L; } } }
      const d = camera.position.distanceTo(u.base);
      const k = Math.max(1, Math.min(u.cls === 'home' ? 6 : 3.2, d / 38)), fade = u.cls === 'home' ? 1 : Math.max(0, Math.min(1, (320 - d) / 90));
      s.visible = fade > 0.02; if (u.pin) u.pin.visible = s.visible; if (!s.visible) continue;
      s.material.opacity = fade;
      s.scale.set(u.h * u.aspect * k, u.h * k, 1);
      P.copy(u.base); P.y += u.stack * u.h * 1.18 * k; s.position.copy(P);
      if (u.pin) { const a = u.pin.geometry.attributes.position; a.setXYZ(0, P.x, u.y0, P.z); a.setXYZ(1, P.x, P.y - u.h * k / 2, P.z); a.needsUpdate = true; u.pin.material.opacity = 0.85 * fade; }
    }
  }
  return { ground, signs, home, stats, update };
}
