/**
 * @kfb name        KFB VFX — Cartoon Combat Choreographie
 * @kfb category    vfx
 * @kfb capability  three@0.160
 * @kfb view        3d
 * @kfb since       Mech Combat Slice v10.1 (02.09.2026)
 *
 * EIN Zeichner: ein Atlas (Brackeys-Masken, weiss auf Alpha), ein Pool von Quads, vier
 * Ausrichtungen (Kamera · Boden · Flaeche · Flugrichtung), eine Schleife. Flipbooks nur fuer
 * die PRIMAERE Interpunktion (gezeichnete Bursts). Zwei Tabellen: SURFACE x ENERGY.
 *
 * Das Modul ZEICHNET. Es entscheidet nicht, was getroffen wurde (Physik = Wirt) und es
 * bewegt keine Kamera, spielt keinen Ton und schiebt kein Ziel — dafuer feuert es
 * Ereignisse: 'shake' {amt} · 'hitstop' {s} · 'cue' {kind, vol, at, weight} ·
 * 'react' {target, knock, squash, dir}. Der Wirt hoert zu oder nicht.
 *
 * Mentale Modelle: docs/VFX_DESIGN_v10.md. Die Zahlen hier sind Folgen dieser Modelle.
 */

export const FX_BASE = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/FX_Visual/brackeys_vfx_bundle/';

/* ATLAS 4 x 4, Kachel 256 px. Jede Kachel hat GENAU EINE Rolle. Reihenfolge = UV-Index.
   file = Maske aus particles/alpha (512 px, weiss auf Alpha) · proc = Notweg, falls das Netz fehlt. */
export const ATLAS = [
  { id: 'cone',   file: 'muzzle_01_a.png', proc: 'cone', rot90: true, role: 'Muendung schmal (Schnellfeuer, Rail)' },
  { id: 'wide',   file: 'muzzle_02_a.png', proc: 'cone', rot90: true, role: 'Muendung breit (Schrot, Rakete, Moerser)' },
  { id: 'star4',  file: 'star_04_a.png',   proc: 'star',  role: 'harter Kontakt (kinetisch, Metall/Luft)' },
  { id: 'star8',  file: 'star_01_a.png',   proc: 'star',  role: 'Kill-Glanz, Strahl-Kontakt' },
  { id: 'bolt',   file: 'spark_03_a.png',  proc: 'bolt',  role: 'elektrisch: Netz am Ziel' },
  { id: 'flare',  file: 'flare_01_a.png',  proc: 'soft',  role: 'Glanzpunkt, Strahlkern' },
  { id: 'smoke',  file: 'smoke_03_a.png',  proc: 'soft',  role: 'Rauch, Nachwirkung' },
  { id: 'puff',   file: 'smoke_06_a.png',  proc: 'soft',  role: 'Staub, Landung, Erde-Treffer' },
  { id: 'dirt',   file: 'dirt_01_a.png',   proc: 'splat', role: 'Klecks / Erdspritzer / Kleber' },
  { id: 'scorch', file: 'scorch_01_a.png', proc: 'splat', role: 'Schmauch-Marke (heiss)' },
  { id: 'ring',   file: 'circle_02_a.png', proc: 'ring',  role: 'Reif — NUR Wasser, Schild, Ladung, Respawn' },
  { id: 'glow',   file: 'circle_05_a.png', proc: 'soft',  role: 'weicher Kern unter allem Heissen' },
  { id: 'trace',  file: 'trace_01_a.png',  proc: 'line', rot90: true, role: 'Speedline: Tracer, Funke, Strahl' },
  { id: 'slash',  file: 'slash_01_a.png',  proc: 'ring',  role: 'Wasserwelle (halb), Trudel-Bogen' },
  { id: 'flame',  file: 'flame_05_a.png',  proc: 'cone',  role: 'Flammenzunge (heiss auf Metall/Knochen)' },
  { id: 'twirl',  file: 'twirl_01_a.png',  proc: 'ring',  role: 'Kleber-Wirbel, Ladung Strahl' }
];

/* FLIPBOOKS aus predrawn/. Frames werden gezaehlt, nicht geraten: die Bogen sind 6 x 5, aber die
   gezeichnete Handlung endet frueher (Rest leer). fps 30, ein Durchlauf, kein Loop. */
export const FLIP = {
  hit:   { file: 'predrawn/big_hit_6x5.png',        cols: 6, rows: 5, frames: 11, fps: 36 },   // grosse Interpunktion (heiss, schwer)
  white: { file: 'predrawn/impact_white_6x4.png',   cols: 6, rows: 4, frames: 11, fps: 40 },   // harter weisser Schlag (kinetisch)
  star:  { file: 'predrawn/star_explosion_6x5.png', cols: 6, rows: 5, frames: 26, fps: 42 },   // Funkenregen (Kill)
  ering: { file: 'predrawn/electric_ring_6x5.png',  cols: 6, rows: 5, frames: 30, fps: 40 }    // elektrischer Reif (Schild)
};

/* TABELLE B · IMPACT[energy][surface]. Die Waffe bringt Farbe + Wucht (heft), die OBERFLAECHE
   bringt Form, Ton, Marke, Reaktion. Eine neue Waffe ist eine Zeile in der Waffentabelle des
   Wirts (energy + color + heft + muz); eine neue Oberflaeche ist eine Spalte hier.
     prim  = primaeres Signal: ['flip', sheet] ODER ['tile', kachel]
     sec   = max 2 sekundaere [kachel, n]   ·  tint/t = Beimischung der Oberflaeche
     stop/knock = Gewicht (M4)  ·  decal = Marke (M7) oder null  ·  sfx = Klangfamilie */
export const IMPACT = {
  kinetic: {
    earth:  { prim: ['tile', 'puff'],  sec: [['trace', 3], ['puff', 1]],  tint: 0xbfae86, t: 0.55, stop: 0,    knock: 0.18, decal: 'hole',   sfx: 'hitdirt',  size: 0.8 },
    metal:  { prim: ['flip', 'white'], sec: [['trace', 5]],               tint: 0xfff3cf, t: 0.35, stop: 0.02, knock: 0.26, decal: 'hole',   sfx: 'hitmetal', size: 0.7 },
    bone:   { prim: ['flip', 'white'], sec: [['trace', 3], ['puff', 1]],  tint: 0xf3ead3, t: 0.30, stop: 0.03, knock: 0.30, decal: 'hole',   sfx: 'hitbone',  size: 0.75 },
    air:    { prim: ['tile', 'star4'], sec: [['trace', 4]],               tint: 0xfff3cf, t: 0.30, stop: 0.02, knock: 0.34, decal: null,     sfx: 'hitmetal', size: 0.65 },
    water:  { prim: ['tile', 'ring'],  sec: [['puff', 2]],                tint: 0x9fd4e6, t: 0.75, stop: 0,    knock: 0,    decal: null,     sfx: 'splash',   size: 1.0 },
    shield: { prim: ['flip', 'ering'], sec: [['trace', 3]],               tint: 0x8fe6ff, t: 0.8,  stop: 0.02, knock: 0.1,  decal: null,     sfx: 'ping',     size: 0.9 }
  },
  hot: {
    earth:  { prim: ['flip', 'hit'],   sec: [['smoke', 2], ['trace', 3]], tint: 0xffb35c, t: 0.4,  stop: 0.03, knock: 0.24, decal: 'scorch', sfx: 'hitdirt',  size: 1.0 },
    metal:  { prim: ['flip', 'hit'],   sec: [['flame', 2], ['trace', 3]], tint: 0xffd27a, t: 0.35, stop: 0.04, knock: 0.30, decal: 'scorch', sfx: 'hitmetal', size: 0.95 },
    bone:   { prim: ['flip', 'hit'],   sec: [['flame', 2]],               tint: 0xffe0a8, t: 0.35, stop: 0.04, knock: 0.34, decal: 'scorch', sfx: 'hitbone',  size: 0.9 },
    air:    { prim: ['flip', 'hit'],   sec: [['trace', 4], ['smoke', 1]], tint: 0xffc46a, t: 0.35, stop: 0.05, knock: 0.42, decal: null,     sfx: 'hitmetal', size: 0.9 },
    water:  { prim: ['tile', 'ring'],  sec: [['smoke', 2]],               tint: 0xcfe6ee, t: 0.7,  stop: 0,    knock: 0,    decal: null,     sfx: 'splash',   size: 1.1 },
    shield: { prim: ['flip', 'ering'], sec: [['flame', 2]],               tint: 0x8fe6ff, t: 0.8,  stop: 0.03, knock: 0.12, decal: null,     sfx: 'ping',     size: 0.95 }
  },
  wet: {
    earth:  { prim: ['tile', 'dirt'],  sec: [['dirt', 3]],                tint: 0x000000, t: 0.0,  stop: 0.02, knock: 0.14, decal: 'splat',  sfx: 'splat',    size: 1.0 },
    metal:  { prim: ['tile', 'dirt'],  sec: [['dirt', 3]],                tint: 0x000000, t: 0.0,  stop: 0.03, knock: 0.2,  decal: 'splat',  sfx: 'splat',    size: 0.9 },
    bone:   { prim: ['tile', 'dirt'],  sec: [['dirt', 4]],                tint: 0xffffff, t: 0.15, stop: 0.04, knock: 0.22, decal: 'splat',  sfx: 'splat',    size: 0.95 },
    air:    { prim: ['tile', 'dirt'],  sec: [['dirt', 3]],                tint: 0xffffff, t: 0.15, stop: 0.04, knock: 0.3,  decal: null,     sfx: 'splat',    size: 0.85 },
    water:  { prim: ['tile', 'ring'],  sec: [['puff', 2]],                tint: 0x9fd4e6, t: 0.75, stop: 0,    knock: 0,    decal: null,     sfx: 'splash',   size: 1.1 },
    shield: { prim: ['flip', 'ering'], sec: [['dirt', 1]],                tint: 0x8fe6ff, t: 0.7,  stop: 0.02, knock: 0.1,  decal: null,     sfx: 'ping',     size: 0.9 }
  },
  electric: {
    earth:  { prim: ['tile', 'bolt'],  sec: [['trace', 3], ['puff', 1]],  tint: 0x8fe6ff, t: 0.5,  stop: 0.03, knock: 0.2,  decal: 'scorch', sfx: 'snap',     size: 0.9 },
    metal:  { prim: ['tile', 'bolt'],  sec: [['trace', 4]],               tint: 0xd8f6ff, t: 0.4,  stop: 0.05, knock: 0.34, decal: 'hole',   sfx: 'snap',     size: 0.95 },
    bone:   { prim: ['tile', 'bolt'],  sec: [['trace', 4]],               tint: 0xd8f6ff, t: 0.4,  stop: 0.06, knock: 0.38, decal: 'hole',   sfx: 'snap',     size: 0.95 },
    air:    { prim: ['tile', 'bolt'],  sec: [['trace', 3]],               tint: 0xd8f6ff, t: 0.4,  stop: 0.05, knock: 0.44, decal: null,     sfx: 'snap',     size: 0.9 },
    water:  { prim: ['tile', 'ring'],  sec: [['bolt', 2]],                tint: 0xbfe9f4, t: 0.7,  stop: 0.02, knock: 0,    decal: null,     sfx: 'splash',   size: 1.15 },
    shield: { prim: ['flip', 'ering'], sec: [['trace', 3]],               tint: 0x8fe6ff, t: 0.8,  stop: 0.03, knock: 0.1,  decal: null,     sfx: 'ping',     size: 0.95 }
  }
};

/* Der RHYTHMUS (M4). Struktur konstant, Amplitude skaliert mit heft. Sekunden. */
export const BEAT = { muzzle: 0.055, burstMin: 0.14, burstPerHeft: 0.06, after: 0.55, markGround: 22, markBody: 6 };

const TILE_N = 4, TILE_PX = 256;

export default class VFX {
  constructor({ THREE, scene, camera, poolSize = 260, decalCap = 70, rng }) {
    this.T = THREE; this.scene = scene; this.cam = camera;
    this.rng = rng || Math.random;
    this.N = poolSize; this.decalCap = decalCap;
    this.off = false;                 // F2: alle Sprites aus (Gegenprobe M6)
    this.density = 1;
    this.useLedger = true;
    this.tint = { dust: 0x9a8f76, smoke: 0x8f8570, water: 0xdfeef4 };
    this.ledger = { t: -9, loud: 0, events: 0, level: 2, chain: '—' };
    this.cues = [];
    this._ev = {};
    this.decals = [];
    this._beam = null;
    this._up = new THREE.Vector3(0, 1, 0);
    this._tmp = { a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3(), q: new THREE.Quaternion(), m: new THREE.Matrix4(), col: new THREE.Color(), col2: new THREE.Color() };
    this._buildProcAtlas();           // sofort zeichenbereit; die Masken ersetzen den Atlas, wenn sie da sind
    this._pool();
    this.flipTex = {};
    this.atlasSource = 'prozedural';
  }

  /* ---------- Ereignisse ---------- */
  on(evt, fn) { (this._ev[evt] = this._ev[evt] || []).push(fn); return this; }
  _fire(evt, data) { const l = this._ev[evt]; if (l) for (const f of l) f(data); }

  /* ---------- Laden: Masken in den Atlas, Flipbooks als eigene Texturen ---------- */
  async load(base) {
    base = base || FX_BASE;
    const T = this.T;
    const img = (url) => new Promise((res, rej) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = () => rej(new Error(url)); i.src = url; });
    const cv = document.createElement('canvas'); cv.width = cv.height = TILE_N * TILE_PX;
    const c = cv.getContext('2d');
    let ok = 0;
    await Promise.all(ATLAS.map(async (t, i) => {
      try {
        const im = await img(base + 'particles/alpha/' + t.file);
        const x = (i % TILE_N) * TILE_PX, y = Math.floor(i / TILE_N) * TILE_PX;
        // 12 px Saum: gefilterte Kacheln bluten sonst in die Nachbarn. rot90: Spitze nach +X,
        // denn im Modus 'vel' laeuft die Textur-U-Achse entlang der Flugrichtung.
        c.save(); c.translate(x + TILE_PX / 2, y + TILE_PX / 2); if (t.rot90) c.rotate(Math.PI / 2);
        c.drawImage(im, -TILE_PX / 2 + 12, -TILE_PX / 2 + 12, TILE_PX - 24, TILE_PX - 24); c.restore(); ok++;
      } catch (e) { this._drawProcTile(c, i, ATLAS[i].proc); }
    }));
    if (ok) {
      this.atlasCanvas = cv;
      const tex = new T.CanvasTexture(cv); tex.colorSpace = T.SRGBColorSpace; tex.minFilter = T.LinearMipmapLinearFilter;
      const old = this.atlasTex; this.atlasTex = tex;
      for (const s of this.sprites) if (s.m.material.map === old) { s.m.material.map = tex; s.m.material.needsUpdate = true; }
      this.atlasSource = ok + '/' + ATLAS.length + ' Brackeys-Masken';
    }
    const ld = new T.TextureLoader(); ld.setCrossOrigin('anonymous');
    await Promise.all(Object.keys(FLIP).map((k) => new Promise((res) => {
      ld.load(base + FLIP[k].file, (t) => { t.colorSpace = T.SRGBColorSpace; this.flipTex[k] = t; res(); }, undefined, () => res());
    })));
    return this;
  }

  /* Notweg-Atlas: einfache Formen, gesaeter Zufall. Wird sofort ersetzt, sobald die Masken laden. */
  _buildProcAtlas() {
    const T = this.T, cv = document.createElement('canvas'); cv.width = cv.height = TILE_N * TILE_PX;
    const c = cv.getContext('2d');
    ATLAS.forEach((t, i) => this._drawProcTile(c, i, t.proc));
    this.atlasCanvas = cv;
    this.atlasTex = new T.CanvasTexture(cv); this.atlasTex.colorSpace = T.SRGBColorSpace;
  }
  _drawProcTile(c, i, kind) {
    const S = TILE_PX, x = (i % TILE_N) * S + S / 2, y = Math.floor(i / TILE_N) * S + S / 2;
    let a = 4711 + i * 97; const rnd = () => { a = (a * 1103515245 + 12345) & 0x7fffffff; return a / 0x7fffffff; };
    c.save(); c.fillStyle = '#fff'; c.strokeStyle = '#fff';
    const soft = (r, al) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,255,255,' + al + ')'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 6.2832); c.fill(); };
    if (kind === 'soft') soft(S * 0.42, 0.7);
    else if (kind === 'cone') { c.beginPath(); c.moveTo(x - S * 0.42, y); c.lineTo(x + S * 0.1, y - S * 0.22); c.lineTo(x + S * 0.44, y); c.lineTo(x + S * 0.1, y + S * 0.22); c.closePath(); c.fill(); }
    else if (kind === 'star') { for (let k = 0; k < 4; k++) { const an = k * Math.PI / 4; c.beginPath(); c.moveTo(x + Math.cos(an) * S * 0.44, y + Math.sin(an) * S * 0.44); c.lineTo(x + Math.cos(an + 1.5) * S * 0.04, y + Math.sin(an + 1.5) * S * 0.04); c.lineTo(x - Math.cos(an) * S * 0.44, y - Math.sin(an) * S * 0.44); c.lineTo(x - Math.cos(an + 1.5) * S * 0.04, y - Math.sin(an + 1.5) * S * 0.04); c.closePath(); c.fill(); } }
    else if (kind === 'bolt') { c.lineWidth = S * 0.035; c.lineCap = 'round'; for (let k = 0; k < 3; k++) { c.beginPath(); let px = x, py = y; c.moveTo(px, py); for (let j = 0; j < 5; j++) { px += (rnd() - 0.5) * S * 0.3; py += (rnd() - 0.5) * S * 0.3; c.lineTo(px, py); } c.stroke(); } }
    else if (kind === 'splat') { c.beginPath(); c.arc(x, y, S * 0.24, 0, 6.2832); c.fill(); for (let k = 0; k < 8; k++) { const an = rnd() * 6.2832, d = S * (0.28 + rnd() * 0.16); c.beginPath(); c.arc(x + Math.cos(an) * d, y + Math.sin(an) * d, S * (0.03 + rnd() * 0.05), 0, 6.2832); c.fill(); } }
    else if (kind === 'ring') { c.lineWidth = S * 0.05; c.beginPath(); c.arc(x, y, S * 0.38, 0, 6.2832); c.stroke(); }
    else if (kind === 'line') { const g = c.createLinearGradient(x - S * 0.46, 0, x + S * 0.46, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.7, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,1)'); c.fillStyle = g; c.beginPath(); c.moveTo(x - S * 0.46, y); c.lineTo(x + S * 0.4, y - S * 0.06); c.arc(x + S * 0.4, y, S * 0.06, -Math.PI / 2, Math.PI / 2); c.lineTo(x - S * 0.46, y); c.fill(); }
    c.restore();
  }

  /* ---------- Pool ---------- */
  _pool() {
    const T = this.T;
    this.sprites = []; this._cur = 0;
    for (let i = 0; i < this.N; i++) {
      const g = new T.PlaneGeometry(1, 1);
      const m = new T.Mesh(g, new T.MeshBasicMaterial({ map: this.atlasTex, transparent: true, depthWrite: false, opacity: 0 }));
      m.visible = false; m.renderOrder = 3; m.frustumCulled = false;
      this.scene.add(m);
      this.sprites.push({ m, live: false, id: i });
    }
  }
  _uv(s, u0, v0, du, dv) {
    const uv = s.m.geometry.attributes.uv;
    uv.setXY(0, u0, v0 + dv); uv.setXY(1, u0 + du, v0 + dv); uv.setXY(2, u0, v0); uv.setXY(3, u0 + du, v0);
    uv.needsUpdate = true;
  }
  _tileUV(s, tile) {
    const idx = Math.max(0, ATLAS.findIndex((t) => t.id === tile));
    this._uv(s, (idx % TILE_N) / TILE_N, 1 - (Math.floor(idx / TILE_N) + 1) / TILE_N, 1 / TILE_N, 1 / TILE_N);
  }
  _acquire() {
    for (let i = 0; i < this.N; i++) {
      const k = (this._cur + i) % this.N, s = this.sprites[k];
      if (!s.live) { this._cur = (k + 1) % this.N; return s; }
    }
    return null;   // Pool voll: das Ereignis faellt aus, die Szene waechst nicht
  }
  _setMat(s, map, color, op, add) {
    const T = this.T, mat = s.m.material;
    if (mat.map !== map) { mat.map = map; mat.needsUpdate = true; }
    const bl = add ? T.AdditiveBlending : T.NormalBlending;
    if (mat.blending !== bl) { mat.blending = bl; mat.needsUpdate = true; }
    mat.color.setHex(color == null ? 0xffffff : color);
    mat.opacity = op;
  }

  /**
   * EIN Sprite. o: color, add, size, ar (Seitenverhaeltnis), life, grow (Wachstum ueber die
   * Lebenszeit, negativ = Kollaps), rot, spin, op, fade (Kurve), vel, grav, drag,
   * mode: 'bill' | 'ground' | 'surf' (normal) | 'vel' (dir, gestreckt) — vier Ausrichtungen,
   * ein Pool. parent: Traeger (Marke reist mit dem Ziel).
   */
  emit(tile, pos, o) {
    o = o || {};
    if (this.off && !o.always) return null;
    const s = this._acquire(); if (!s) return null;
    this._tileUV(s, tile);
    this._setMat(s, this.atlasTex, o.color, o.op == null ? 1 : o.op, !!o.add);
    return this._arm(s, pos, o);
  }
  _arm(s, pos, o) {
    const T = this.T;
    s.live = true; s.m.visible = true; s.flip = null;
    s.life = s.life0 = o.life || 0.16; s.size = o.size || 1; s.ar = o.ar || 1;
    s.grow = o.grow == null ? 0.6 : o.grow; s.rot = o.rot || 0; s.spin = o.spin || 0;
    s.op = o.op == null ? 1 : o.op; s.fade = o.fade || 1; s.vel = o.vel || null; s.grav = o.grav || 0; s.drag = o.drag || 0;
    s.mode = o.mode || 'bill'; s.normal = o.normal || null; s.dir = o.dir || null; s.hold = !!o.hold; s.k = o.k == null ? 1 : o.k;
    s.distFloor = o.distFloor == null ? 0.55 : o.distFloor;
    s.parent = null;
    if (s.m.parent !== this.scene) { if (s.m.parent) s.m.parent.remove(s.m); this.scene.add(s.m); }
    s.m.renderOrder = o.order == null ? 3 : o.order;
    s.m.position.copy(pos);
    s.head = s.mode === 'vel' ? (s.head || new T.Vector3()).copy(pos) : null;   // 'vel': Kopf, Mesh-Mitte wird abgeleitet
    if (o.parent) {
      s.parent = o.parent; o.parent.attach(s.m);
      s.pscale = o.parent.getWorldScale(this._tmp.a).x || 1;
    }
    this._orient(s, 0);
    return s;
  }
  release(s) { if (!s || !s.live) return; s.live = false; s.m.visible = false; s.m.material.opacity = 0; if (s.m.parent !== this.scene) { s.m.parent && s.m.parent.remove(s.m); this.scene.add(s.m); } s.parent = null; }

  /* Streuung als billige Variation: Richtung, Tempo, Drehung, Groesse. */
  scatter(tile, pos, n, o) {
    const T = this.T; o = o || {};
    for (let i = 0; i < n; i++) {
      const d = (o.dir ? this._tmp.a.copy(o.dir) : this._tmp.a.set(0, 1, 0))
        .add(this._tmp.b.set((this.rng() - 0.5) * 2, (this.rng() - 0.3) * 2, (this.rng() - 0.5) * 2).multiplyScalar(o.spread == null ? 1 : o.spread))
        .normalize().multiplyScalar((o.speed || 5) * (0.5 + this.rng())).clone();
      this.emit(tile, this._tmp.c.copy(pos).addScaledVector(d, 0.02), {
        color: o.color, add: o.add, size: (o.size || 0.4) * (0.7 + this.rng() * 0.7),
        life: (o.life || 0.3) * (0.7 + this.rng() * 0.6), grow: o.grow == null ? 0.3 : o.grow,
        rot: this.rng() * 6.2832, spin: (this.rng() - 0.5) * 6, vel: d, grav: o.grav == null ? 14 : o.grav,
        drag: o.drag == null ? 1.6 : o.drag, op: o.op, ar: o.ar,
        // Speedlines fliegen laengs: ein Funke ist im Cartoon ein STRICH in seine Richtung
        mode: tile === 'trace' ? 'vel' : 'bill', dir: tile === 'trace' ? d : null
      });
    }
  }

  /* Flipbook-Burst: die gezeichnete Interpunktion. Ein Durchlauf, dann frei. */
  flip(sheet, pos, o) {
    const F = FLIP[sheet], tex = this.flipTex[sheet];
    if (!F || !tex) return this.emit(sheet === 'ering' ? 'ring' : 'star8', pos, Object.assign({ add: true, life: 0.16, grow: 1.6 }, o));   // Notweg: Kachel
    if (this.off && !(o && o.always)) return null;
    const s = this._acquire(); if (!s) return null;
    o = o || {};
    this._setMat(s, tex, o.color, o.op == null ? 1 : o.op, o.add !== false);
    this._arm(s, pos, Object.assign({}, o, { life: F.frames / F.fps, grow: o.grow == null ? 0.15 : o.grow, fade: o.fade == null ? 0.35 : o.fade }));
    s.flip = F; s.frame = -1;
    this._flipFrame(s, 0);
    return s;
  }
  _flipFrame(s, f) {
    if (f === s.frame) return; s.frame = f;
    const F = s.flip, du = 1 / F.cols, dv = 1 / F.rows;
    this._uv(s, (f % F.cols) * du, 1 - (Math.floor(f / F.cols) + 1) * dv, du, dv);
  }

  /* Reif — flach in der Welt. Nur Wasser, Schild, Ladung, Respawn (semantische Sperre). */
  ring(pos, color, size, o) {
    return this.emit('ring', pos, Object.assign({ color, size: 0.5, grow: (size || 5) * 2, life: 0.45, op: 0.9, fade: 1.2, mode: 'ground', order: 2 }, o || {}));
  }

  /* Speedline als GESCHOSS: persistenter Strich, der Wirt fuehrt die Position (s.m.position),
     das Modul die Ausrichtung. Kopf am Ursprung, Schwanz zieht nach hinten. */
  streak(pos, dir, color, len, width) {
    const s = this.emit('trace', pos, { color, add: true, size: len || 4.6, ar: (width || 0.26) / (len || 4.6), life: 1e9, grow: 0, mode: 'vel', dir: dir.clone(), hold: true, k: 0.001, distFloor: 0.3, op: 0.95 });
    if (s) s.core = this.emit('trace', pos, { color: 0xffffff, add: true, size: (len || 4.6) * 0.55, ar: (width || 0.26) * 0.42 / ((len || 4.6) * 0.55), life: 1e9, grow: 0, mode: 'vel', dir: dir.clone(), hold: true, k: 0.001, distFloor: 0.3, order: 4 });
    return s;
  }
  /* Streak nachfuehren: pos, Wachstum k (0..1, waechst aus der Muendung), Deckkraft */
  moveStreak(s, pos, k, op) {
    if (!s || !s.live) return;
    s.head.copy(pos); s.k = k; s.op = op == null ? 0.95 : op * 0.95;
    if (s.core && s.core.live) { s.core.head.copy(pos); s.core.k = k; s.core.op = op == null ? 1 : op; }
  }
  releaseStreak(s) { if (!s) return; if (s.core) this.release(s.core); this.release(s); }

  /* DAUERSTRAHL: ein einziger Strich Muendung -> Kontaktpunkt, jeden Frame nachgefuehrt,
     verblasst von selbst, wenn niemand mehr ruft. Kern + Mantel + Kontaktglanz. */
  beam(from, to, color, width) {
    const T = this.T;
    if (!this._beam) {
      this._beam = { mant: this.emit('trace', from, { color, add: true, life: 1e9, hold: true, mode: 'vel', dir: new T.Vector3(0, 0, 1), distFloor: 0 }),
        core: this.emit('trace', from, { color: 0xffffff, add: true, life: 1e9, hold: true, mode: 'vel', dir: new T.Vector3(0, 0, 1), distFloor: 0, order: 4 }),
        tip: this.emit('flare', to, { color: 0xffffff, add: true, life: 1e9, hold: true, distFloor: 0.2 }), t: 0 };
      if (!this._beam.mant) { this._beam = null; return; }
    }
    const B = this._beam; B.t = 0;
    const len = from.distanceTo(to), w = width || 0.42;
    const dir = this._tmp.b.copy(to).sub(from).normalize();
    // 'vel': Kopf am Kontaktpunkt, der Strich zieht bis zur Muendung zurueck
    for (const [s, ww, o] of [[B.mant, w, 0.85], [B.core, w * 0.4, 1]]) {
      if (!s || !s.live) continue;
      s.head.copy(to); s.dir.copy(dir);
      s.size = len; s.ar = ww / len; s.k = 1; s.op = o * (0.85 + this.rng() * 0.15); s.m.material.color.setHex(s === B.core ? 0xffffff : color);
    }
    if (B.tip && B.tip.live) { B.tip.m.position.copy(to); B.tip.size = w * 3.2 * (0.8 + this.rng() * 0.4); B.tip.op = 0.9; }
  }

  /* ---------- Hauptbuch (M2): drei Stellen im Bild, nicht drei pro Effekt ---------- */
  claim(loud) {
    const t = (performance.now() || 0) / 1000, L = this.ledger;
    const gap = t - L.t, decayed = L.loud * Math.max(0, 1 - gap * 5);
    let lvl = 2;
    if (gap < 0.12 && decayed >= loud * 0.85) lvl = 1;
    if (gap < 0.045 && decayed > loud) lvl = 0;
    if (!this.useLedger) lvl = 2;
    L.t = t; L.loud = Math.max(loud, decayed); L.events++; L.level = lvl;
    return lvl;
  }
  /* Ton-Vorrang: hoechstens drei Cues in 90 ms, der schwaechste weicht. Spielt nicht — meldet. */
  cue(kind, vol, at, weight) {
    const now = (performance.now() || 0) / 1000, w = weight == null ? vol : weight;
    this.cues = this.cues.filter((c) => now - c.t < 0.09);
    if (this.cues.length >= 3) { let weakest = 9; for (const c of this.cues) weakest = Math.min(weakest, c.w); if (w <= weakest) return false; }
    this.cues.push({ t: now, w });
    this._fire('cue', { kind, vol, at, weight: w });
    return true;
  }

  /* ---------- MUENDUNG (Subjekt): 40-70 ms, Form = Waffenklasse ---------- */
  muzzle(from, dir, w) {
    const c = w.flash || w.color, kind = w.muz || 'star';
    const fwd = this._tmp.a.copy(dir).normalize();
    const at = this._tmp.b.copy(from).addScaledVector(fwd, 0.12);
    // Kegel: Kopf vorn, waechst also aus der Muendung nach vorn (Kopf = at + size)
    const cone = (tile, size, life) => this.emit(tile, this._tmp.c.copy(at).addScaledVector(fwd, size * 0.9), { color: c, add: true, size, ar: 0.7, life, grow: 0.5, mode: 'vel', dir: fwd.clone(), k: 1, distFloor: 0.2 });
    if (kind === 'star') { cone('cone', 1.0, BEAT.muzzle); this.emit('star4', at, { color: 0xffffff, add: true, size: 0.5, life: 0.05, grow: 1.4, rot: this.rng() * 6.2832 }); }
    else if (kind === 'spread') { cone('wide', 1.5, 0.07); this.scatter('trace', at, 5, { color: c, add: true, dir: fwd, spread: 0.55, speed: 11, size: 0.5, ar: 0.14, life: 0.16, grav: 10 }); }
    else if (kind === 'blast') { cone('wide', 1.8, 0.08); this.emit('glow', at, { color: c, add: true, size: 1.4, life: 0.09, grow: 1.6 }); this.emit('smoke', at, { color: this.tint.smoke, size: 1.5, life: 0.6, grow: 1.7, rot: this.rng() * 6.2832, op: 0.4, fade: 1.5 }); }
    else if (kind === 'charge') { this.emit('twirl', at, { color: c, add: true, size: 0.9, life: 0.09, grow: -0.55, rot: this.rng() * 6.2832, spin: 4, op: 0.85 }); }
    else if (kind === 'rail') { cone('cone', 2.2, 0.07); this.emit('star8', at, { color: 0xffffff, add: true, size: 0.9, life: 0.07, grow: 1.4, rot: this.rng() * 6.2832 }); this.scatter('trace', at, 3, { color: c, add: true, dir: fwd, spread: 0.4, speed: 12, size: 0.6, ar: 0.1, life: 0.18, grav: 6 }); }
  }

  /**
   * DER EINE IMPACT. ev: { point, normal, weapon{color,energy,heft,name,fxExtra}, surface,
   * heavy, scale, target, groundY, waterY }. Zeichnet Primaer/Sekundaer/Marke, fuehrt das
   * Hauptbuch, meldet 'react', 'cue', 'shake', 'hitstop'. Gibt { level, D } zurueck.
   */
  impact(ev) {
    const T = this.T, w = ev.weapon, surf = ev.surface || 'earth';
    const E = IMPACT[w.energy] || IMPACT.kinetic, D = E[surf] || E.earth;
    const heft = Math.min(1.6, (w.heft || 0.5) * (ev.heavy ? 1.7 : 1));
    const lvl = this.claim(heft);
    const pt = ev.point, nrm = ev.normal || this._up;
    const col = this._tmp.col.setHex(w.color).lerp(this._tmp.col2.setHex(D.tint), D.t), hexc = col.getHex();
    const base = (D.size || 1) * (0.65 + heft * 1.15) * (ev.scale || 1);
    const burstLife = BEAT.burstMin + heft * BEAT.burstPerHeft;

    // REAKTION zuerst (M6) — kostet kein Objekt, traegt den Treffer allein
    if (ev.target) this._fire('react', { target: ev.target, knock: (D.knock || 0.2) * (0.6 + heft), squash: D.prim[1] === 'dirt' ? 0.22 : 0, dir: nrm, surface: surf });

    // PRIMAER — genau eins (M1)
    if (surf === 'water') {
      const wy = ev.waterY != null ? ev.waterY : pt.y;
      this.ring(this._tmp.a.set(pt.x, wy + 0.05, pt.z), hexc, 2.2 + heft * 2);
      this.emit('puff', this._tmp.a.set(pt.x, wy + 0.2, pt.z), { color: this.tint.water, size: base * 0.9, life: 0.35, grow: 1.8, rot: this.rng() * 6.2832, op: 0.75, fade: 1.2 });
    } else if (D.prim[0] === 'flip') {
      this.flip(D.prim[1], pt, { color: hexc, size: base * 1.6, rot: this.rng() * 6.2832 });
    } else {
      const tile = D.prim[1];
      this.emit(tile, pt, { color: hexc, add: tile !== 'dirt', size: base * 1.1, life: burstLife, grow: tile === 'bolt' ? 0.4 : 1.9, rot: this.rng() * 6.2832, fade: 0.8, spin: tile === 'bolt' ? 2 : 0 });
      if (w.energy === 'hot' || w.energy === 'electric') this.emit('glow', pt, { color: hexc, add: true, size: base * 1.3, life: 0.1, grow: 1.5 });
    }

    // SEKUNDAER — hoechstens zwei, bei Degradierung eins, bei Stufe 0 keins
    if (lvl > 0) {
      const secs = D.sec.slice(0, lvl === 2 ? 2 : 1);
      for (const [name, n] of secs) {
        const cnt = Math.max(1, Math.round((lvl === 2 ? n : n * 0.5) * this.density));
        if (name === 'smoke' || name === 'puff') {
          for (let i = 0; i < cnt; i++) this.emit(name, this._tmp.a.copy(pt).add(this._tmp.b.set((this.rng() - 0.5) * base, this.rng() * base * 0.6, (this.rng() - 0.5) * base)), {
            color: surf === 'water' ? this.tint.water : this.tint.dust, size: base * (1.1 + this.rng() * 0.6), life: 0.5 + this.rng() * 0.35, grow: 1.5, rot: this.rng() * 6.2832, op: 0.5, fade: 1.4
          });
        } else if (name === 'flame') {
          this.scatter('flame', pt, cnt, { color: hexc, add: true, dir: nrm, spread: 0.7, speed: 3 + heft * 3, size: base * 0.5, ar: 0.6, life: 0.3, grav: -6, drag: 2 });
        } else if (name === 'dirt') {
          this.scatter('dirt', pt, cnt, { color: hexc, add: false, dir: nrm, spread: 1, speed: 4 + heft * 4, size: base * 0.3, life: 0.45, grav: 16, drag: 0.8, op: 0.95 });
        } else {
          this.scatter(name, pt, cnt, { color: hexc, add: true, dir: nrm, spread: 0.9, speed: 4 + heft * 5, size: base * 0.7, ar: name === 'trace' ? 0.14 : 1, life: 0.28 + heft * 0.12, grav: 15 });
        }
      }
    }
    if (w.fxExtra && lvl === 2) this.scatter(w.fxExtra[0], pt, w.fxExtra[1], { color: w.color, add: false, dir: nrm, spread: 1.1, speed: 4.5, size: base * 0.4, life: 0.7, grav: 11, drag: 1.1, op: 0.9 });

    // TERTIAER — die Marke (M7). Luft, Wasser und Schild bekommen keine.
    if (D.decal) {
      const ground = surf === 'earth';
      const n2 = ground ? this._tmp.b.set(0, 1, 0) : nrm;
      const at2 = ground && ev.groundY != null ? this._tmp.a.set(pt.x, ev.groundY + 0.02, pt.z) : pt;
      this.decal(at2, n2, D.decal, ev.heavy ? 0.8 : 0.55, ev.target && ev.target.g ? ev.target.g : (ev.target && ev.target.isObject3D ? ev.target : null), w.color);
      if (ground && lvl === 2) this.dust(this._tmp.a.set(pt.x, ev.groundY != null ? ev.groundY : pt.y, pt.z), ev.heavy ? 4 : 2);
    }

    this.cue(D.sfx, 0.4 + heft * 0.4, pt, heft);
    if (lvl === 2) this._fire('shake', { amt: 0.03 + heft * 0.1 });
    if (lvl > 0 && D.stop) this._fire('hitstop', { s: D.stop * (ev.heavy ? 1.8 : 1) });
    this.ledger.chain = (w.name || w.energy) + ' → ' + surf + ' → ' + D.prim.join(':') + (lvl < 2 ? (lvl === 1 ? ' · gedämpft' : ' · stumm') : '');
    return { level: lvl, D };
  }

  /* NACHWIRKUNG schwerer Treffer: Rauch, Truemmer, Kameraimpuls. Kein zweiter Burst (M1). */
  aftermath(pos, radius, color) {
    for (let i = 0; i < 3; i++) this.emit('smoke', this._tmp.a.copy(pos).add(this._tmp.b.set((this.rng() - 0.5) * radius * 0.7, this.rng() * radius * 0.45, (this.rng() - 0.5) * radius * 0.7)), {
      color: this.tint.smoke, size: radius * (0.7 + this.rng() * 0.5), life: 0.75 + this.rng() * 0.5, grow: 1.4, rot: this.rng() * 6.2832, op: 0.45, fade: 1.6, vel: new this.T.Vector3(0, 0.6, 0)
    });
    this.flip('star', pos, { color: color || 0xffd27a, size: radius * 1.4, rot: this.rng() * 6.2832 });
    this._fire('shake', { amt: 0.16 });
    this.cue('boom', 0.9, pos, 1.5);
  }

  /* Staub: tertiaer, gefuellt, bodennah — kein Ring (der waere ein Auswahl-Marker). */
  dust(pos, n) {
    for (let i = 0; i < (n || 3); i++) {
      const a = this.rng() * 6.2832, r = 0.5 + this.rng() * 0.7;
      this.emit('puff', this._tmp.b.set(pos.x + Math.cos(a) * r, pos.y + 0.14 + this.rng() * 0.1, pos.z + Math.sin(a) * r), {
        color: this.tint.dust, size: 0.65 + this.rng() * 0.4, life: 0.34 + this.rng() * 0.18, grow: 1.7, rot: this.rng() * 6.2832, op: 0.42, fade: 1.3
      });
    }
  }
  spark(pos, dir, color, spread) {
    this.scatter('trace', pos, 1, { color, add: true, dir: dir || this._tmp.a.set(0, 1, 0), spread: spread || 1, speed: 6.5, size: 0.55, ar: 0.14, life: 0.4, grav: 17, drag: 0.9 });
  }
  puff(pos, color) {
    this.emit('smoke', pos, { color: color || this.tint.smoke, size: 0.9 + this.rng() * 0.5, life: 0.7 + this.rng() * 0.4, grow: 1.5, rot: this.rng() * 6.2832, op: 0.45, fade: 1.5 });
  }

  /* MARKE (M7): ein Sprite im selben Pool, Modus 'surf', lange Lebenszeit, altert. Am Ziel
     verankert, wenn es eines gibt. Deckel: die aelteste weicht. */
  decal(pos, normal, kind, size, parent, color) {
    const tile = kind === 'scorch' ? 'scorch' : kind === 'splat' ? 'dirt' : 'dirt';
    const col = kind === 'hole' ? 0x1a1610 : kind === 'scorch' ? 0x120e0a : this._tmp.col.setHex(color == null ? 0x9ad63f : color).multiplyScalar(0.75).getHex();
    const life = parent ? BEAT.markBody : BEAT.markGround;
    const s = this.emit(tile, this._tmp.a.copy(pos).addScaledVector(normal, 0.03), {
      color: col, add: false, size: kind === 'hole' ? size * 0.7 : size, life, grow: 0, rot: this.rng() * 6.2832,
      op: kind === 'scorch' ? 0.85 : kind === 'hole' ? 0.9 : 0.95, fade: 0.25, mode: 'surf', normal: normal.clone(), parent, order: 2, distFloor: 0, always: true
    });
    if (!s) return null;
    s.decal = true; s.size0 = size;
    this.decals.push(s);
    while (this.decals.length > this.decalCap) { const d = this.decals.shift(); this.release(d); }
    return s;
  }

  /* Welt-Farbe: Staub und Rauch gehoeren zur Palette, nicht zu einem festen Beige. */
  setWorldTint(pal) {
    if (!pal) return;
    const T = this.T, mid = new T.Color(pal[1][0], pal[1][1], pal[1][2]), hi = new T.Color(pal[2][0], pal[2][1], pal[2][2]);
    this.tint.dust = mid.clone().lerp(hi, 0.45).lerp(new T.Color(0xbfb6a6), 0.35).getHex();
    this.tint.smoke = mid.clone().lerp(new T.Color(0x6f6a62), 0.55).getHex();
    this.tint.water = hi.clone().lerp(new T.Color(0xffffff), 0.5).getHex();
  }

  /* ---------- Ausrichtung: vier Modi, ein Pool ---------- */
  _orient(s, k) {
    const T = this.T, m = s.m;
    if (s.mode === 'ground') { m.quaternion.set(-0.7071068, 0, 0, 0.7071068); if (s.rot) m.rotateZ(s.rot); return; }
    if (s.mode === 'surf') {
      m.quaternion.setFromUnitVectors(this._tmp.a.set(0, 0, 1), s.normal || this._tmp.b.set(0, 1, 0));
      if (s.parent) { s.parent.getWorldQuaternion(this._tmp.q); m.quaternion.premultiply(this._tmp.q.invert()); }
      if (s.rot) m.rotateZ(s.rot); return;
    }
    if (s.mode === 'vel' && s.dir) {
      // X = Flugrichtung, Flaeche zur Kamera gedreht; ohne das ist der Strich aus manchen Winkeln eine Linie
      const X = this._tmp.a.copy(s.dir).normalize();
      m.getWorldPosition(this._tmp.c);
      const L = this._tmp.b.copy(this.cam.position).sub(this._tmp.c).normalize();
      const Y = this._tmp.c.crossVectors(L, X);
      if (Y.lengthSq() < 1e-6) return;
      Y.normalize();
      const Z = L.crossVectors(X, Y).normalize();
      this._tmp.m.makeBasis(X, Y, Z); m.quaternion.setFromRotationMatrix(this._tmp.m);
      return;
    }
    m.quaternion.copy(this.cam.quaternion);
    if (s.rot || s.spin) m.rotateZ(s.rot + s.spin * k);
  }

  /* ---------- Die eine Schleife ---------- */
  update(dt) {
    let live = 0, dec = 0;
    const camPos = this.cam.position;
    for (const s of this.sprites) {
      if (!s.live) continue;
      live++;
      if (!s.hold) s.life -= dt;
      if (s.life <= 0 || (s.parent && !s.parent.parent)) { this.release(s); if (s.decal) { const i = this.decals.indexOf(s); if (i >= 0) this.decals.splice(i, 1); } continue; }
      const k = s.hold ? 0 : 1 - s.life / s.life0;
      if (s.vel) {
        (s.head || s.m.position).addScaledVector(s.vel, dt);
        if (s.grav) s.vel.y -= s.grav * dt;
        if (s.drag) s.vel.multiplyScalar(Math.max(0, 1 - s.drag * dt));
      }
      if (s.flip) this._flipFrame(s, Math.min(s.flip.frames - 1, Math.floor(k * s.flip.frames)));
      // M5: Feder auf der Bildebene — Entfernungs-Boden, damit ein Treffer in 40 m noch liest
      if (s.head) s.m.position.copy(s.head);
      s.m.getWorldPosition(this._tmp.c);
      const dist = camPos.distanceTo(this._tmp.c);
      let sc = s.size * (1 + s.grow * k) * (1 + Math.min(s.distFloor, dist / 150));
      if (s.parent) sc /= (s.parent.getWorldScale(this._tmp.a).x || 1);
      if (s.mode === 'vel') {
        // Kopf = head, Schwanz zieht entgegen der Flugrichtung; das Quad ist um seine Mitte gebaut
        const kk = s.k == null ? 1 : s.k;
        s.m.scale.set(sc * kk, sc * s.ar, 1);
        s.m.position.copy(s.head).addScaledVector(this._tmp.a.copy(s.dir).normalize(), -sc * kk / 2);
        this._orient(s, k);
      } else { s.m.scale.set(sc * s.ar, sc, 1); this._orient(s, k); }
      if (s.decal) {
        const age = k; s.m.material.opacity = s.op * (1 - age * 0.35) * (s.life < 4 ? Math.max(0, s.life / 4) : 1);
        if (s.decal) dec++;
      } else s.m.material.opacity = s.hold ? s.op : s.op * Math.pow(1 - k, s.fade);
    }
    // Der Strahl verblasst, wenn niemand mehr ruft
    if (this._beam) {
      const B = this._beam; B.t += dt;
      if (B.t > 0.08) { this.release(B.mant); this.release(B.core); this.release(B.tip); this._beam = null; }
    }
    this.live = live; this.decalCount = dec;
  }

  stats() {
    return { sprites: this.live || 0, pool: this.N, decals: this.decals.length, decalCap: this.decalCap, ledger: this.ledger, cues: this.cues.length, atlas: this.atlasSource, flips: Object.keys(this.flipTex).length, off: this.off };
  }
  dispose() {
    for (const s of this.sprites) { if (s.m.parent) s.m.parent.remove(s.m); s.m.geometry.dispose(); s.m.material.dispose(); }
    this.sprites.length = 0; this.atlasTex.dispose(); Object.values(this.flipTex).forEach((t) => t.dispose());
  }
}
