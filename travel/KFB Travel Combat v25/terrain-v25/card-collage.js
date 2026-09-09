// ============================================================================
// card-collage.js — KFB Travel v20 · Slice K1 · Kartencollage als Gelände
// ----------------------------------------------------------------------------
// Grundlage: `HANDOVER_Kartencollage_Design.md` plus der POC `kfb_card_collage_poc_v2.html`.
// Der POC hat die Technik bewiesen; DIESES Modul ist die Produktionsfassung, und es macht drei
// Dinge ausdrücklich anders (Handover §5):
//
//  1. **EINE geteilte Textur, nicht eine je Ausschnitt.** Der POC malte je Ausschnitt eine eigene
//     192er-Leinwand mit eingebrannter Maske — bei 130 Ausschnitten sind das 130 Texturen. Hier gibt
//     es einen Atlas (4×4 Felder) und einen Maskenatlas (4×2). Der Ausschnitt sitzt in den
//     UV-Koordinaten, die Reisskante kommt als `alphaMap` über den ZWEITEN UV-Kanal (`uv1`,
//     `alphaMap.channel = 1`, ab three r152). Deshalb deckt die Maske die ganze Fläche ab, während
//     der Ausschnitt nur ein Feld der Seite zeigt — das war der Kniff, den der Handover benennt.
//  2. **`alphaTest` statt Sortierung.** 0,35, wie im POC gemessen. Sonst kämpfen hundert
//     durchsichtige Flächen um die Zeichenreihenfolge.
//  3. **Quelle ist der `card-registry`**, nicht ein zweiter PDF-Lader. Georgs Entscheidung
//     (20.8.): dieselben gecachten Seiten, aus denen die Flug-Karten schon geschnitten werden.
//     Ein zweiter Lader wäre eine zweite Wahrheit über den Kartenschnitt.
//
// **Was hier NICHT passiert:** Höhe. Das Höhenfeld bleibt `voxel-terrain.js` (Georgs Wahl:
// „Karten AUF den Würfeln"). Die Collage stellt Pappaufsteller AUF den Boden, den das Terrain
// meldet — eine zweite Höhen-Wahrheit wäre dieselbe Fehlerklasse wie in Naht 109.
//
// **Determinismus.** Ort, Grösse, Ausschnitt und Maske hängen an der ZELLE, nicht am Mesh und
// nicht am Zufall des Aufbaus. Zweimal dieselbe Welt heisst deshalb zweimal dieselbe Landschaft,
// auch nach Ab- und Zuflug (Handover §7, Punkt 5). Die Meshes sind nur Blechhülsen, die
// nachziehen.
//
// **Drehung nur um die Hochachse** (Handover §3). Und der Abnahme-Schalter dazu bleibt drin:
// ohne Drehung müssen die Ausschnitte von der Seite verschwinden. Tun sie es nicht, ist irgendwo
// volles Billboarding aktiv.
//
//   const col = createCardCollage({ THREE, registry, groundHeightAt, seed });
//   await col.load();            // Atlas aus echten Karten, sonst Ersatzmotive
//   scene.add(col.group);
//   col.setRouteCards(list);     // ganze Karten = echte Reiseziele
//   col.recenter(x, z);          // beim Chunk-Wechsel, wie das Terrain
//   col.update(dt, camera);      // je Frame: nur die Hochachse
// ============================================================================

const COLS = 6, TILE = 256;              // Atlas: 36 Felder, 1536² — sechzehn waren zu wenig, das
                                         // Gelände las sich als Flickenteppich mit erkennbarer Kachel
const MCOLS = 4, MROWS = 2, MTILE = 256; // Maskenatlas: 8 Reisskanten

function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < String(s).length; i++) { h ^= String(s).charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}
// Derselbe Hash-Stil wie im Terrain (`hash2`): reine Funktion des Ortes, damit Bild und Bericht
// garantiert dasselbe sehen.
function hash2(ix, iz, seed) {
  let h = (seed ^ Math.imul(ix | 0, 374761393) ^ Math.imul(iz | 0, 668265263)) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export function createCardCollage(o = {}) {
  const T = o.THREE;
  const reg = o.registry || null;
  const groundAt = o.groundHeightAt || (() => 0);
  const seed0 = hashStr(o.seed || 'kfb-v20-collage');

  const group = new T.Group();
  group.name = 'card-collage';
  const cutGroup = new T.Group(); group.add(cutGroup);
  const placeGroup = new T.Group(); group.add(placeGroup);

  // Die drei Tiefenbänder. **Grösse ist eine Eigenschaft des Ortes, nicht der Entfernung** — sonst
  // würde ein fernes grosses Stück beim Näherkommen schrumpfen (ein Pop, den niemand ausgelöst hat).
  // Die Parallaxe kommt aus dem echten 3D-Abstand, nicht aus einer Umsortierung.
  //
  // **`w` ist die Häufigkeit, und sie ist ungleich verteilt.** Gleich verteilt wäre jedes dritte
  // Stück dreissig Einheiten hoch, und dann steht ständig eines vor der Nase — gemessen am 20.8. an
  // einem Standpunkt im Tal: die halbe Sicht war ein Papier. Selten und gross liest sich als
  // Felsvorsprung, häufig und gross als Bretterzaun.
  const BANDS = [
    { lo: 5, hi: 9, sink: 0.30, w: 0.50 },
    { lo: 9, hi: 17, sink: 0.36, w: 0.32 },
    { lo: 17, hi: 28, sink: 0.42, w: 0.18 },
  ];
  function bandFor(h, n) {
    let sum = 0, tot = 0;
    for (let i = 0; i < n; i++) tot += BANDS[i].w;
    for (let i = 0; i < n; i++) { sum += BANDS[i].w / tot; if (h <= sum) return BANDS[i]; }
    return BANDS[n - 1];
  }

  const params = {
    count: 120,       // Ausschnitte gleichzeitig im Feld
    cell: 46,         // Weltmass einer Collage-Zelle
    radius: 8,        // Zellen um den Spieler
    density: 0.4,     // Anteil belegter Zellen
    torn: true,       // Reisskante (der wichtigste Schalter, Handover §3)
    turn: true,       // Drehung um die Hochachse
    whole: true,      // ganze Karten als Orte
    wholeCount: 10,
    bands: 3,
  };

  // ---------------------------------------------------------------- Atlas und Masken
  const atlasCv = document.createElement('canvas'); atlasCv.width = atlasCv.height = COLS * TILE;
  const actx = atlasCv.getContext('2d');
  actx.fillStyle = '#efe6d2'; actx.fillRect(0, 0, atlasCv.width, atlasCv.height);

  // ZWEI Texturen auf DERSELBEN Leinwand, und das ist Absicht: das Terrain ist ein
  // `ShaderMaterial` und schreibt Anzeigefarben direkt (deshalb `NoColorSpace`, wie bei `edge3.jpg`),
  // die Pappaufsteller sind `MeshBasicMaterial` und wollen dekodiert werden (`SRGBColorSpace`).
  // Eine Textur für beides hiesse: eine der beiden Fassungen ist zu dunkel oder zu flau.
  const atlasLinear = new T.CanvasTexture(atlasCv);
  atlasLinear.colorSpace = T.NoColorSpace;
  const atlasSrgb = new T.CanvasTexture(atlasCv);
  atlasSrgb.colorSpace = T.SRGBColorSpace;
  for (const t of [atlasLinear, atlasSrgb]) { t.anisotropy = 4; t.generateMipmaps = true; }

  const maskCv = document.createElement('canvas');
  maskCv.width = MCOLS * MTILE; maskCv.height = MROWS * MTILE;
  (function tearMasks() {
    const g = maskCv.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, maskCv.width, maskCv.height);
    g.fillStyle = '#fff';
    for (let m = 0; m < MCOLS * MROWS; m++) {
      const ox = (m % MCOLS) * MTILE, oy = ((m / MCOLS) | 0) * MTILE;
      let s = m * 7919 + 13;
      const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
      g.beginPath();
      const steps = 46, cx = ox + MTILE / 2, cy = oy + MTILE / 2;
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2, kx = Math.cos(a), ky = Math.sin(a);
        const box = 1 / Math.max(Math.abs(kx), Math.abs(ky));
        // Der Riss ist grob UND unregelmässig: ein Rauschanteil (rnd) plus eine langsame Welle
        // (sin(a·7)). Nur Rauschen ergibt eine gezackte Briefmarke, nur die Welle eine Blume.
        const tear = 1 - (0.06 + rnd() * 0.16) - Math.sin(a * 7 + m) * 0.035;
        const x = cx + kx * MTILE * 0.47 * box * tear, y = cy + ky * MTILE * 0.47 * box * tear;
        i ? g.lineTo(x, y) : g.moveTo(x, y);
      }
      g.closePath(); g.fill();
    }
  })();
  const maskTex = new T.CanvasTexture(maskCv);
  maskTex.colorSpace = T.NoColorSpace;
  maskTex.channel = 1;   // ⚠ der Kniff: die Maske liest uv1, der Ausschnitt liegt in uv

  // ---------------------------------------------------------------- Ersatzmotive (Handover §4)
  // Sie bleiben ausdrücklich drin: sie machen die Datei überall vorführbar, auch ohne Netz. Der
  // Bericht sagt dann `quelle: 'ersatz'` — die Technik ist echt, die Motive sind erzeugt.
  function fillSubstitute() {
    let s = seed0 % 2147483647;
    const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
    for (let i = 0; i < COLS * COLS; i++) {
      const ox = (i % COLS) * TILE, oy = ((i / COLS) | 0) * TILE;
      const hue = (28 + i * 37) % 360;
      actx.fillStyle = 'hsl(' + hue + ',34%,84%)'; actx.fillRect(ox, oy, TILE, TILE);
      for (let b = 0; b < 7; b++) {
        const r = 30 + rnd() * 110;
        const gr = actx.createRadialGradient(ox + rnd() * TILE, oy + rnd() * TILE, 3,
                                             ox + rnd() * TILE, oy + rnd() * TILE, r);
        gr.addColorStop(0, 'hsla(' + ((hue + b * 29) % 360) + ',58%,54%,.5)');
        gr.addColorStop(1, 'hsla(' + ((hue + b * 29) % 360) + ',58%,54%,0)');
        actx.fillStyle = gr; actx.fillRect(ox, oy, TILE, TILE);
      }
      actx.fillStyle = '#1f1a14';
      for (let t = 0; t < 3; t++) actx.fillRect(ox + 22, oy + 30 + t * 22, 60 + rnd() * 140, 9);
    }
    atlasLinear.needsUpdate = atlasSrgb.needsUpdate = true;
  }

  // ---------------------------------------------------------------- Quelle: der card-registry
  let quelle = 'leer', tilesFilled = 0, sourceCards = [];
  const artCache = new Map();     // packId#n → Canvas (die ganze Karte, für die Orte)

  function art(card) {
    return new Promise((res) => {
      if (!reg || !reg.requestArt) return res(null);
      const k = card.packId + '#' + card.n;
      if (artCache.has(k)) return res(artCache.get(k));
      reg.requestArt({ packId: card.packId, n: card.n },
        (cv) => { artCache.set(k, cv); res(cv); }, () => res(null));
    });
  }

  // Ausschnitte statt ganzer Karten: ein Zwanzigstel eines Motivs, gross gezogen. Erst der
  // Anschnitt macht Landschaft daraus statt Galerie (Handover §3).
  function drawTiles(cv, from, n, salt) {
    let s = (seed0 ^ salt) % 2147483647;
    const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
    for (let i = 0; i < n && from + i < COLS * COLS; i++) {
      const idx = from + i, ox = (idx % COLS) * TILE, oy = ((idx / COLS) | 0) * TILE;
      // Eng gezogen (ein Zehntel bis ein Drittel der Karte): weiter aufgezogen sind es kleine ganze
      // Karten mit Rahmen und Textfeld, und dann liest das Gelände sich als Galerie statt als
      // zerschnittenes Papier — genau die Messlatte aus dem Handover.
      const cw = cv.width * (0.10 + rnd() * 0.22), ch = cv.height * (0.11 + rnd() * 0.24);
      actx.drawImage(cv, rnd() * (cv.width - cw), rnd() * (cv.height - ch), cw, ch, ox, oy, TILE, TILE);
      tilesFilled++;
    }
    atlasLinear.needsUpdate = atlasSrgb.needsUpdate = true;
  }

  async function load() {
    let cards = [];
    try {
      if (reg && reg.pool) {
        const pool = await reg.pool();
        if (pool && pool.length) {
          // Gesät gezogen, nicht gewürfelt: dieselbe Sitzung, dieselben Motive.
          let s = seed0 % 2147483647;
          const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
          for (let i = 0; i < 6; i++) cards.push(pool[(rnd() * pool.length) | 0]);
        }
      }
    } catch (e) { console.warn('[collage] Kartenpool nicht erreichbar', e); }

    const per = Math.ceil((COLS * COLS) / Math.max(1, cards.length));
    let at = 0;
    for (const c of cards) {
      const cv = await art(c);
      if (!cv) continue;
      drawTiles(cv, at, per, 0x9E37 + at * 131); at += per;
      sourceCards.push(c);
      if (at >= COLS * COLS) break;
    }
    if (tilesFilled === 0) { fillSubstitute(); quelle = 'ersatz'; }
    else { quelle = 'registry'; if (at < COLS * COLS) drawTiles(atlasCv, at, COLS * COLS - at, 0x517D); }
    samplePalette();
    build();
    place();
    return quelle;
  }

  // ---------------------------------------------------------------- Palette aus den Karten
  // Sechs dominante Farben, daraus drei Stops nach Helligkeit. Damit baut ein kühles Deck ein
  // kühles Tal, ohne Kunstrichtung je Deck (Handover §3).
  let stops = null, sampled = [];
  function samplePalette() {
    const w = 64, h = 64, tmp = document.createElement('canvas'); tmp.width = w; tmp.height = h;
    const tg = tmp.getContext('2d');
    tg.drawImage(atlasCv, 0, 0, w, h);
    const px = tg.getImageData(0, 0, w, h).data, bins = new Map();
    for (let i = 0; i < px.length; i += 4) {
      const k = ((px[i] >> 4) << 8) | ((px[i + 1] >> 4) << 4) | (px[i + 2] >> 4);
      bins.set(k, (bins.get(k) || 0) + 1);
    }
    const top = [...bins.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([k]) => [((k >> 8) & 15) * 17 / 255, ((k >> 4) & 15) * 17 / 255, (k & 15) * 17 / 255]);
    sampled = top;
    if (top.length < 3) { stops = null; return; }
    const lum = (c) => c[0] * 0.299 + c[1] * 0.587 + c[2] * 0.114;
    const sorted = top.slice().sort((a, b) => lum(a) - lum(b));
    stops = [sorted[0], sorted[(sorted.length / 2) | 0], sorted[sorted.length - 1]];
  }

  // ---------------------------------------------------------------- Pappaufsteller
  // Ein Material für beide Fälle wäre bequem und falsch: `alphaMap` an- und abzuschalten heisst in
  // three, das Programm neu zu übersetzen. Also zwei Materialien, ein Tausch.
  const mTorn = new T.MeshBasicMaterial({ map: atlasSrgb, alphaMap: maskTex, alphaTest: 0.35,
                                          side: T.DoubleSide, fog: true });
  const mFlat = new T.MeshBasicMaterial({ map: atlasSrgb, side: T.DoubleSide, fog: true });

  const cuts = [];
  function build() {
    if (cuts.length) return;
    for (let i = 0; i < params.count; i++) {
      const geo = new T.PlaneGeometry(1, 1);
      // uv1 kommt als KOPIE, nicht als dieselbe Referenz: der eine Kanal trägt das Atlasfeld,
      // der andere das Maskenfeld — geteilt wäre es eine Wahrheit für zwei Aufgaben.
      geo.setAttribute('uv1', new T.BufferAttribute(new Float32Array(8), 2));
      const m = new T.Mesh(geo, params.torn ? mTorn : mFlat);
      m.visible = false; m.frustumCulled = true;
      cutGroup.add(m); cuts.push(m);
    }
  }

  function setUvRect(attr, cols, rows, idx, inset) {
    const cw = 1 / cols, ch = 1 / rows;
    const x0 = (idx % cols) * cw + inset * cw, x1 = (idx % cols + 1) * cw - inset * cw;
    const y0 = 1 - (((idx / cols) | 0) + 1) * ch + inset * ch, y1 = 1 - ((idx / cols) | 0) * ch - inset * ch;
    const a = attr.array;
    a[0] = x0; a[1] = y1; a[2] = x1; a[3] = y1; a[4] = x0; a[5] = y0; a[6] = x1; a[7] = y0;
    attr.needsUpdate = true;
  }

  let focusX = 0, focusZ = 0, placed = 0;
  function place() {
    if (!cuts.length) return;
    const CW = params.cell, R = params.radius;
    const fx = Math.round(focusX / CW), fz = Math.round(focusZ / CW);
    const want = [];
    for (let dz = -R; dz <= R; dz++) {
      for (let dx = -R; dx <= R; dx++) {
        const cx = fx + dx, cz = fz + dz;
        if (hash2(cx, cz, seed0 ^ 0x0C01) > params.density) continue;
        want.push({ cx, cz, d: dx * dx + dz * dz });
      }
    }
    want.sort((a, b) => a.d - b.d);
    const n = Math.min(want.length, cuts.length);
    for (let i = 0; i < n; i++) {
      const c = want[i], m = cuts[i];
      const hA = hash2(c.cx, c.cz, seed0 ^ 0x1111), hB = hash2(c.cx, c.cz, seed0 ^ 0x2222);
      const hC = hash2(c.cx, c.cz, seed0 ^ 0x3333), hD = hash2(c.cx, c.cz, seed0 ^ 0x4444);
      const band = bandFor(hA, params.bands);
      const sc = band.lo + hB * (band.hi - band.lo);
      const wx = (c.cx + (hC - 0.5) * 0.8) * CW, wz = (c.cz + (hD - 0.5) * 0.8) * CW;
      setUvRect(m.geometry.getAttribute('uv'), COLS, COLS, (hB * COLS * COLS) | 0, 0.01);
      setUvRect(m.geometry.getAttribute('uv1'), MCOLS, MROWS, (hC * MCOLS * MROWS) | 0, 0);
      m.scale.set(sc, sc, 1);
      // Auf dem Boden STEHEN, nicht schweben: die Unterkante sinkt ein Stück ein, damit die
      // Reisskante im Gelände verschwindet statt auf ihm zu liegen.
      m.position.set(wx, groundAt(wx, wz) + sc * (0.5 - band.sink), wz);
      m.rotation.y = hD * Math.PI * 2;
      m.userData.baseTurn = m.rotation.y;
      m.visible = true;
    }
    for (let i = n; i < cuts.length; i++) cuts[i].visible = false;
    placed = n;
    placeWhole();
  }

  // ---------------------------------------------------------------- Die Orte (ganze Karten)
  // Hierarchie, sonst kippt alles: wenn alles aus Karten besteht, sticht keine Karte mehr heraus.
  // Also Ausschnitte bauen die Landschaft, **ganze aufrechte Karten markieren die Orte** — und
  // Georgs Entscheidung dazu: nur echte Reiseziele. Der ORT kommt von dieser Zelle, die IDENTITÄT
  // aus der Route. Ein erfundenes Ziel wäre ein Ort, der nichts bedeutet.
  let route = [];
  const wholes = [];
  function setRouteCards(list) {
    route = (list || []).map((c) => (c && c.data ? c.data : c)).filter((c) => c && c.packId && c.n);
    placeWhole();
  }
  function placeWhole() {
    for (const w of wholes) w.mesh.visible = false;
    if (!params.whole || !route.length) return;
    const CW = params.cell * 4, R = 3;
    const fx = Math.round(focusX / CW), fz = Math.round(focusZ / CW);
    const want = [];
    for (let dz = -R; dz <= R; dz++) {
      for (let dx = -R; dx <= R; dx++) {
        const cx = fx + dx, cz = fz + dz;
        const h = hash2(cx, cz, seed0 ^ 0x0F1E);
        if (h > 0.3) continue;
        want.push({ cx, cz, d: dx * dx + dz * dz, h });
      }
    }
    want.sort((a, b) => a.d - b.d);
    const n = Math.min(want.length, params.wholeCount);
    for (let i = 0; i < n; i++) {
      const c = want[i];
      const card = route[Math.floor(hash2(c.cx, c.cz, seed0 ^ 0x7A1E) * route.length) % route.length];
      let slot = wholes[i];
      if (!slot) {
        const geo = new T.PlaneGeometry(1, 1);
        const mat = new T.MeshBasicMaterial({ side: T.DoubleSide, fog: true, transparent: true });
        const mesh = new T.Mesh(geo, mat);
        placeGroup.add(mesh);
        slot = { mesh, mat, key: '' }; wholes[i] = slot;
      }
      const wx = (c.cx + (c.h - 0.15) * 0.5) * CW, wz = (c.cz + (c.h - 0.15) * 0.5) * CW;
      const key = card.packId + '#' + card.n;
      slot.card = card;
      if (slot.key !== key) {
        slot.key = key;
        // Gedrosselt über denselben Weg wie jedes andere Artwork. Bis es da ist, bleibt die
        // Karte unsichtbar — ein leeres weisses Blatt in der Landschaft wäre schlimmer als keins.
        slot.mesh.visible = false;
        art(card).then((cv) => {
          if (!cv || slot.key !== key) return;
          const t = new T.CanvasTexture(cv); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4;
          if (slot.mat.map) slot.mat.map.dispose();
          slot.mat.map = t; slot.mat.needsUpdate = true;
          slot.ar = cv.height / cv.width;
          layoutWhole(slot, wx, wz);
        });
      } else if (slot.mat.map) layoutWhole(slot, wx, wz);
    }
    for (let i = n; i < wholes.length; i++) wholes[i].mesh.visible = false;
  }
  function layoutWhole(slot, wx, wz) {
    const w = 9, h = w * (slot.ar || 1.4);
    slot.mesh.scale.set(w, h, 1);
    slot.mesh.position.set(wx, groundAt(wx, wz) + h * 0.5 + 0.2, wz);
    slot.mesh.visible = true;
  }

  // ---------------------------------------------------------------- Frame
  const _v = { x: 0, z: 0 };
  function update(dt, camera) {
    if (!camera) return;
    const cx = camera.position.x, cz = camera.position.z;
    for (const m of cuts) {
      if (!m.visible) continue;
      // NUR die Hochachse. Nie kippen — sonst wird aus dem Pappaufsteller ein Aufkleber, und die
      // Parallaxe, die die ganze Collage trägt, ist weg.
      m.rotation.y = params.turn ? Math.atan2(cx - m.position.x, cz - m.position.z) : m.userData.baseTurn;
    }
    for (const w of wholes) {
      if (!w.mesh.visible) continue;
      w.mesh.rotation.y = Math.atan2(cx - w.mesh.position.x, cz - w.mesh.position.z);
    }
    _v.x = cx; _v.z = cz;
  }

  function recenter(x, z) {
    focusX = x || 0; focusZ = z || 0;
    place();
  }

  return {
    name: 'card-collage', group, params, load, recenter, update, setRouteCards,
    get atlas() { return atlasLinear; },       // fürs Terrain (NoColorSpace)
    get atlasCols() { return COLS; },
    get stops() { return stops; },             // drei Stops, oder null wenn nichts abgetastet
    get quelle() { return quelle; },
    get placed() { return placed; },
    setCount(n) {
      params.count = Math.max(0, Math.round(n));
      // Wachsen heisst neue Hülsen bauen, schrumpfen heisst nur verstecken. Die Zelle bestimmt
      // weiter, WAS zu sehen ist — die Zahl bestimmt nur, wie weit die Liste reicht.
      while (cuts.length < params.count) {
        const geo = new T.PlaneGeometry(1, 1);
        geo.setAttribute('uv1', new T.BufferAttribute(new Float32Array(8), 2));
        const m = new T.Mesh(geo, params.torn ? mTorn : mFlat);
        m.visible = false; cutGroup.add(m); cuts.push(m);
      }
      place();
    },
    setTorn(on) { params.torn = !!on; for (const m of cuts) m.material = params.torn ? mTorn : mFlat; },
    setTurn(on) { params.turn = !!on; },
    setWhole(on) { params.whole = !!on; placeWhole(); },
    setBands(n) { params.bands = Math.max(1, Math.min(3, Math.round(n))); place(); },
    setDensity(v) { params.density = Math.max(0, Math.min(1, v)); place(); },
    report() {
      return { quelle, felder: tilesFilled, karten: sourceCards.map((c) => c.packId + '#' + c.n),
               ausschnitte: placed, orte: wholes.filter((w) => w.mesh.visible).length,
               reisskante: params.torn, drehung: params.turn,
               palette: (sampled || []).map((c) => '#' + [0, 1, 2].map((i) => ('0' + Math.round(c[i] * 255).toString(16)).slice(-2)).join('')) };
    },
    dispose() {
      for (const m of cuts) m.geometry.dispose();
      for (const w of wholes) { w.mesh.geometry.dispose(); if (w.mat.map) w.mat.map.dispose(); w.mat.dispose(); }
      mTorn.dispose(); mFlat.dispose(); atlasLinear.dispose(); atlasSrgb.dispose(); maskTex.dispose();
    },
  };
}
