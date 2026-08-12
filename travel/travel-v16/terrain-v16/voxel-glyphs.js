// ============================================================================
// voxel-glyphs.js — KFB Travel · Slice S32b · Würfel-Schrift (WebGL-Port)
// ----------------------------------------------------------------------------
// Portiert aus `terrain-vN/voxel-glyphs.js` (WebGPU/TSL, r178, PoC-Freeze) nach
// **klassischem WebGL (three 0.160)**. Der Look bleibt: dieselben Würfel wie das
// Terrain (`edge3.jpg`-Kachel), Farbe aus einer 3-Stopp-Palette über die Zeilen,
// Helligkeits-Jitter pro Würfel — und derselbe **Tumble** beim Textwechsel
// (Kippen um X + Skalieren, mit Versatz pro Spalte: der „Würfelzähler"-Effekt).
//
// WAS DER PORT ÄNDERT — und warum:
//  · Das TSL-`colorNode`/`emissiveNode`-Material kann WebGL nicht. Statt einen
//    Shader nachzubauen: **`instanceColor`**. Die Rampe (Zeile → Palette) und der
//    Helligkeits-Jitter werden auf der CPU gerechnet und pro Instanz gesetzt.
//    Bei ~250 Würfeln für ein Wort ist das nichts, und es bleibt EIN Draw-Call.
//  · `mesh.count = idx` statt „Schwanz wegskalieren" — die unbenutzten Instanzen
//    werden gar nicht gezeichnet.
//  · 5×7-Font, Layout, Reconcile-Logik und Tumble-Kurven sind 1:1 übernommen.
//
// Layout ist um den Gruppen-Ursprung zentriert, ein Würfel = 1 Einheit. Die
// Skalierung macht der Aufrufer (`measure()` liefert die Maße in Zellen).
//
//   const g = createVoxelGlyphs({ THREE });
//   card.holder.add(g.group);
//   g.setPalette([[r,g,b],[r,g,b],[r,g,b]]);
//   g.setText('DRAG');       // animierter Wechsel
//   g.update(dt);            // jeden Frame
// ============================================================================

const _edgeURL = new URL('./edge3.jpg', import.meta.url).href;
let _edgeTex = null;
function edgeTexture(T) {
  if (!_edgeTex) {
    _edgeTex = new T.TextureLoader().load(_edgeURL);
    _edgeTex.colorSpace = T.SRGBColorSpace;
    _edgeTex.anisotropy = 4;
  }
  return _edgeTex;
}

const GW = 5, GH = 7;
const FONT = {
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11111', '00010', '00100', '00010', '00001', '10001', '01110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
  'A': ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  'B': ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  'C': ['01110', '10001', '10000', '10000', '10000', '10001', '01110'],
  'D': ['11100', '10010', '10001', '10001', '10001', '10010', '11100'],
  'E': ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  'F': ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  'G': ['01110', '10001', '10000', '10111', '10001', '10001', '01111'],
  'H': ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  'I': ['01110', '00100', '00100', '00100', '00100', '00100', '01110'],
  'J': ['00111', '00010', '00010', '00010', '10010', '10010', '01100'],
  'K': ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  'L': ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  'M': ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  'N': ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  'O': ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  'P': ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  'Q': ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  'R': ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  'S': ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  'T': ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  'U': ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  'V': ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  'W': ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  'X': ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  'Y': ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  'Z': ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
  ':': ['00000', '00100', '00100', '00000', '00100', '00100', '00000'],
  '.': ['00000', '00000', '00000', '00000', '00000', '00110', '00110'],
  '!': ['00100', '00100', '00100', '00100', '00100', '00000', '00100'],
  '?': ['01110', '10001', '00001', '00010', '00100', '00000', '00100'],
  '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
  '+': ['00000', '00100', '00100', '11111', '00100', '00100', '00000'],
  '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'],
  '*': ['00000', '10101', '01110', '11111', '01110', '10101', '00000'],
};
const glyphRows = (ch) => FONT[ch] || FONT['?'];
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
function hashCell(i) { let h = Math.imul(i ^ 0x9e37, 2654435761) >>> 0; return ((h ^ (h >>> 15)) >>> 0) / 4294967296; }

export function createVoxelGlyphs(opts = {}) {
  const T = opts.THREE;
  const GAP = opts.gap != null ? opts.gap : 0.14;
  const CHAR_SPACE = opts.charSpace != null ? opts.charSpace : 1.4;
  const DUR = opts.dur != null ? opts.dur : 0.5;
  const STAGGER = opts.stagger != null ? opts.stagger : 0.028;

  const group = new T.Group();
  group.frustumCulled = false;
  let cap = 0, mesh = null;
  let cells = [], clock = 0, textStr = '';

  // Palette + Look als CPU-Werte (im TSL-Original waren das Uniforms)
  const pal = [new T.Color(0.14, 0.05, 0.02), new T.Color(0.86, 0.42, 0.12), new T.Color(1.0, 0.86, 0.52)];
  let brightMin = 0.62, brightRange = 0.45, gradient = 0.75;
  const _col = new T.Color(), _lo = new T.Color(), _hi = new T.Color();

  function buildMesh(capacity) {
    if (mesh) { group.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose(); }
    cap = capacity;
    const geo = new T.BoxGeometry(1, 1, 1);
    const mat = new T.MeshLambertMaterial({ map: edgeTexture(T) });
    mesh = new T.InstancedMesh(geo, mat, cap);
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
    mesh.count = 0;
    group.add(mesh);
  }

  function layout(str) {
    const chars = [...str];
    const step = GW + CHAR_SPACE;
    const totalW = chars.length ? chars.length * step - CHAR_SPACE : 0;
    const x0 = -totalW / 2 + 0.5;
    const y0 = (GH - 1) / 2;
    const list = [];
    chars.forEach((ch, ci) => {
      const rows = glyphRows(ch);
      for (let r = 0; r < GH; r++) {
        for (let c = 0; c < GW; c++) {
          const lit = rows[r][c] === '1' || rows[r][c] === '#';
          if (!lit) continue;
          list.push({ x: x0 + ci * step + c, y: y0 - r, col: ci * GW + c, ramp: 1 - r / (GH - 1) });
        }
      }
    });
    return { list, totalW };
  }

  function makeCell(p) {
    const rand = hashCell((p.x * 131 + p.y * 17) | 0);
    return {
      x: p.x, y: p.y, col: p.col, ramp: p.ramp, rand,
      cur: 0, tgt: 0, t0: -999, delay: 0,
      startFlip(now) { this.t0 = now; this.delay = this.col * STAGGER; },
    };
  }

  function setText(str) {
    str = String(str == null ? '' : str).toUpperCase();
    if (str === textStr) return;
    textStr = str;
    const { list } = layout(str);
    // **Kapazität für BEIDE Wörter.** Während des Tumbles leben die ausgehenden Zellen weiter;
    // wer nur das neue Wort gegen `cap` prüft, verliert alles darüber still (`idx >= cap`) —
    // sichtbar als halb fehlende Buchstaben (Georgs „Glyphen glitchen“).
    const alive = cells.reduce((n, c) => n + (c.cur || c.tgt ? 1 : 0), 0);
    if (list.length + alive > cap) buildMesh(Math.max(256, Math.ceil((list.length + alive) * 1.4)));
    const wantKey = new Map();
    list.forEach((p) => wantKey.set(p.x + ',' + p.y, p));
    const haveKey = new Map();
    cells.forEach((cell) => haveKey.set(cell.x + ',' + cell.y, cell));
    cells.forEach((cell) => {
      if (!wantKey.has(cell.x + ',' + cell.y) && cell.cur) { cell.tgt = 0; cell.startFlip(clock); }
    });
    list.forEach((p) => {
      let cell = haveKey.get(p.x + ',' + p.y);
      if (!cell) { cell = makeCell(p); cells.push(cell); }
      cell.ramp = p.ramp; cell.col = p.col;
      if (!cell.cur || cell.tgt === 0) { cell.tgt = 1; cell.startFlip(clock); }
    });
  }

  // Rampe Zeile → Palette, plus Helligkeits-Jitter. Im Original war das der
  // Shader-Pfad (mix/step auf `aRamp`/`aRand`); hier dieselbe Kurve auf der CPU.
  function cellColor(cell, out) {
    const t = Math.max(0, Math.min(1, cell.ramp * gradient));
    if (t < 0.5) out.copy(_lo.copy(pal[0]).lerp(pal[1], t * 2));
    else out.copy(_hi.copy(pal[1]).lerp(pal[2], (t - 0.5) * 2));
    return out.multiplyScalar(brightMin + cell.rand * brightRange);
  }

  const _p = new T.Vector3(), _q = new T.Quaternion(), _e = new T.Euler(), _s = new T.Vector3(), _m = new T.Matrix4();
  let dropped = 0;
  function writeMatrices() {
    if (!mesh) return;
    let idx = 0;
    const size = 1 - GAP;
    for (const cell of cells) {
      let p = 1;
      const local = clock - cell.t0 - cell.delay;
      if (cell.t0 > -900 && local < DUR) p = Math.max(0, local) / DUR;
      const pe = easeOut(Math.min(1, Math.max(0, p)));
      let angle = 0, scl = 1, visible = true;
      if (cell.tgt === 1) {
        angle = (-Math.PI / 2) * (1 - pe);
        scl = 0.15 + 0.85 * pe;
        if (local < 0) visible = false;
      } else if (cell.tgt === 0 && cell.cur === 1) {
        angle = (Math.PI / 2) * pe;
        scl = 1 - 0.85 * pe;
        if (p >= 1) visible = false;
      } else if (cell.cur !== 1) visible = false;
      if (p >= 1) { cell.cur = cell.tgt; if (cell.cur === 0) visible = false; }
      if (!visible) continue;
      if (idx >= cap) { dropped++; continue; }   // darf nicht mehr vorkommen — aber sichtbar machen
      _p.set(cell.x, cell.y, 0);
      _e.set(angle, 0, 0, 'XYZ'); _q.setFromEuler(_e);
      _s.set(size, size * scl, size);
      _m.compose(_p, _q, _s);
      mesh.setMatrixAt(idx, _m);
      mesh.setColorAt(idx, cellColor(cell, _col));
      idx++;
    }
    mesh.count = idx;
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    if ((clock | 0) % 2 === 0) cells = cells.filter((c) => c.cur === 1 || c.tgt === 1 || (clock - c.t0 - c.delay) < DUR);
  }

  buildMesh(256);

  return {
    name: 'voxel-glyphs', group, setText,
    update(dt) { clock += (dt || 0.016); writeMatrices(); },
    // Maße in ZELLEN (ein Würfel = 1). Der Aufrufer skaliert damit auf Weltmaß.
    measure(str) {
      const chars = [...String(str || '').toUpperCase()];
      const step = GW + CHAR_SPACE;
      return { w: chars.length ? chars.length * step - CHAR_SPACE : 0, h: GH, chars: chars.length };
    },
    setPalette(stops) {
      if (!stops || stops.length < 3) return;
      for (let i = 0; i < 3; i++) pal[i].setRGB(stops[i][0], stops[i][1], stops[i][2]);
    },
    setColorParams(o = {}) {
      if (o.brightMin != null) brightMin = o.brightMin;
      if (o.brightRange != null) brightRange = o.brightRange;
      if (o.gradient != null) gradient = o.gradient;
    },
    get text() { return textStr; },
    get live() { return mesh ? mesh.count : 0; },
    get dropped() { return dropped; },
    GW, GH,
    dispose() {
      if (mesh) { group.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose(); mesh = null; }
      cells = [];
      if (group.parent) group.parent.remove(group);
    },
  };
}
