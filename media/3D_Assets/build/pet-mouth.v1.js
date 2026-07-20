/* pet-mouth.v1.js — KFB TALKING MOUTHS v1 (2026-07-19).
   Character-Animator-Muender (12 transparente PNGs, GitHub-raw) als flache Plane auf dem
   Body — KEIN Lip-Sync: Visem-Shuffle im Silbentakt (offene Formen haeufig, M/F/W-oo als
   Closer, Mikro-Pausen auf neutral) liest sich als Sprechen. Ruhe-Mund haengt am Mienenspiel
   (PetFace.onSet -> setRest). Jeder Wechsel ploppt kurz (Snap statt Crossfade).
   Platzierung: Surface-Fit-Raycast wie EyeRig (Plane liegt AUF der Koerperflaeche unter der
   Augen-Mitte, folgt Clip + Squash als Body-Kind). Bunny: KISS unter der Schnauze (dy-Regler);
   Schnauzen-Chirurgie + Knubbelnase = Pet-Editor-Scope (stripSnout), nicht hier.
   VERTRAG: build() nach ch.load, refit() nach Pet-Wechsel, update(dt) pro Frame. */

export const MOUTH_BASE = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Textures/FrizzelBob-Mouth_01/';
export const MOUTH_FILES = {
  smile:   'FrizzleBobMouth_01_0000s_0000_Smile.png',
  neutral: 'FrizzleBobMouth_01_0000s_0001_Neutral.png',
  m:       'FrizzleBobMouth_01_0000s_0002_M.png',
  d:       'FrizzleBobMouth_01_0000s_0003_D.png',
  s:       'FrizzleBobMouth_01_0000s_0004_S.png',
  ee:      'FrizzleBobMouth_01_0000s_0005_Ee.png',
  uh:      'FrizzleBobMouth_01_0000s_0006_Uh.png',
  ah:      'FrizzleBobMouth_01_0000s_0007_Ah.png',
  oh:      'FrizzleBobMouth_01_0000s_0008_Oh.png',
  r:       'FrizzleBobMouth_01_0000s_0009_R.png',
  f:       'FrizzleBobMouth_01_0000s_0010_F.png',
  woo:     'FrizzleBobMouth_01_0000s_0011_W-oo.png',
  l:       'FrizzleBobMouth_01_0000s_0012_L.png',
};
const TALK_POOL = ['ah', 'ee', 'oh', 'uh', 'd', 's', 'l', 'r'];   // offen = haeufig
const CLOSERS = ['m', 'f', 'woo'];                                 // Konsonanten-Momente
export const MOUTH_DEFAULTS = {
  size: 0.44,        // relativ zu U (halbe Body-Hoehe)
  dy: -0.52,         // Anker unter der Body-Mitte (U-Einheiten); Bunny: unter die Schnauze
  sx: 1,             // Breite-Faktor (quer ziehen, v9-Wunsch "größer/breiter")
  rot: 0,            // Kippung ° (schiefer Mund = Charakter; animierbar)
  bend: 0,           // Bogen −1..1: + = Mundwinkel hoch (Smile-Kurve), − = runter
  rate: 1,           // Sprech-Tempo (1 = ~8-11 Visem-Wechsel/s)
  restMap: { neutral: 'neutral', happy: 'smile', angry: 's', sad: 'm', surprised: 'oh', thinking: 'woo' },
};
export const MOUTH_META = [   // [key,label,min,max,step] — Bench-Slider
  ['size', 'Mund-Größe', 0.15, 0.9, 0.01],
  ['dy', 'Höhe (± unter Mitte)', -1.0, 0.15, 0.01],
  ['sx', 'Breite ×', 0.5, 2, 0.02],
  ['rate', 'Sprech-Tempo', 0.4, 2.2, 0.05],
];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

export class PetMouth {
  constructor(ch, opts = {}) {
    this.ch = ch; this.THREE = ch.THREE;
    this.p = Object.assign({}, MOUTH_DEFAULTS, opts.params || {});
    this.p.restMap = Object.assign({}, MOUTH_DEFAULTS.restMap, (opts.params && opts.params.restMap) || {});
    this.tex = {}; this.cur = 'neutral'; this.rest = 'neutral';
    this.enabled = true;
    this._talk = false; this._t = 0; this._next = 0; this._pop = 1;
    this._asp = 1.5; this._baseS = 0.2;
    this._cb = 0; this._cr = 0; this._ex = null;   // weiche Ist-Werte fuer bend/rot + Express-Override
    this.mesh = null;
  }
  _loadTex(name) {
    if (this.tex[name]) return this.tex[name];
    const T = this.THREE;
    if (!this._loader) { this._loader = new T.TextureLoader(); this._loader.setCrossOrigin('anonymous'); }
    const t = this._loader.load(MOUTH_BASE + MOUTH_FILES[name], (tx) => {
      tx.colorSpace = T.SRGBColorSpace;
      if (name === 'neutral' && tx.image && tx.image.height) { this._asp = tx.image.width / tx.image.height; this._applyScale(); }
    });
    t.anisotropy = 4;
    this.tex[name] = t;
    return t;
  }
  build() {
    const T = this.THREE;
    this.dispose();
    const mat = new T.MeshBasicMaterial({ map: this._loadTex('neutral'), transparent: true, depthWrite: false, toneMapped: false });
    this.mesh = new T.Mesh(new T.PlaneGeometry(1, 1, 12, 3), mat);   // Segmente fuer den Bogen (Mundwinkel)
    this._basePos = this.mesh.geometry.attributes.position.clone();
    this._lastBend = 0;
    this.mesh.userData.petOverlay = true;
    this.mesh.raycast = () => {};
    this.mesh.renderOrder = 3;
    this.mesh.castShadow = false; this.mesh.frustumCulled = false;
    // alle Viseme warm laden (kleine PNGs) — kein weisses Aufblitzen beim ersten Talk
    for (const k in MOUTH_FILES) this._loadTex(k);
    this.refit();
  }
  // Surface-Fit wie EyeRig: geometrie-lokale BBox (pose-invariant), Raycast von vorn
  refit() {
    const T = this.THREE, ch = this.ch;
    if (!this.mesh || !ch.inner) return;
    const meshes = [];
    ch.inner.traverse((n) => { if (n.isMesh && !n.userData.petOverlay) meshes.push(n); });
    const body = meshes.find((m) => m.name && m.name.toLowerCase() === 'body') || meshes[0];
    if (!body) return;
    if (!body.geometry.boundingBox) body.geometry.computeBoundingBox();
    const bb = body.geometry.boundingBox;
    const sz = bb.getSize(new T.Vector3());
    const lc = bb.getCenter(new T.Vector3());
    const U = this._U = sz.y / 2;
    const mx = lc.x, my = lc.y + U * this.p.dy;
    const ray = new T.Raycaster(); ray.layers.enableAll();
    body.updateMatrixWorld(true);
    const oW = body.localToWorld(new T.Vector3(mx, my, U * 3.5));
    const dW = new T.Vector3(0, 0, -1).transformDirection(body.matrixWorld).normalize();
    ray.set(oW, dW);
    const hit = ray.intersectObject(body, false)[0];
    const z = hit ? body.worldToLocal(hit.point.clone()).z : lc.z + U * 0.7;
    if (this.mesh.parent !== body) body.add(this.mesh);
    this.mesh.position.set(mx, my, z + U * 0.055);   // knapp VOR der Flaeche (kein Z-Fight; Schnauze darf davor liegen)
    this._baseS = U * this.p.size;
    this._applyScale();
  }
  _applyScale() { if (this.mesh) this.mesh.scale.set(this._baseS * this._asp * this._pop * (this.p.sx || 1), this._baseS * this._pop, 1); }
  setParams(p) {
    Object.assign(this.p, p || {});
    if (p && ('size' in p || 'dy' in p)) this.refit();
    if (p && 'sx' in p) this._applyScale();
  }
  setTex(name) {
    if (!this.mesh || !MOUTH_FILES[name]) return;
    this.mesh.material.map = this._loadTex(name);
    this.mesh.material.needsUpdate = true;
    if (name !== this.cur) this._pop = 1.12;   // Snap-Pop bei jedem Wechsel
    this.cur = name;
  }
  // Ruhe-Mund folgt dem Mienenspiel (PetFace.onSet -> setRest(emoteId))
  setRest(emoteId) { this.rest = this.p.restMap[emoteId] || 'neutral'; if (!this._talk) this.setTex(this.rest); }
  talk(on) { this._talk = !!on; this._t = 0; this._next = 0; if (!on) this.setTex(this.rest); }
  get talking() { return this._talk; }
  talkBurst(dur = 1.6) { this.talk(true); clearTimeout(this._bt); this._bt = setTimeout(() => this.talk(false), dur * 1000); }
  // Bogen: Plane entlang X kruemmen — + hebt die Mundwinkel (Smile), − senkt sie (Frown)
  _applyBend(v) {
    if (!this.mesh || Math.abs(v - this._lastBend) < 0.001) return;
    this._lastBend = v;
    const pos = this.mesh.geometry.attributes.position, base = this._basePos;
    for (let i = 0; i < pos.count; i++) {
      const x = base.getX(i);
      pos.setY(i, base.getY(i) + v * 0.3 * (4 * x * x - 0.5));
    }
    pos.needsUpdate = true;
  }
  // Temporaerer Ausdrucks-Override (fuer Combos/FX): express({bend:0.8, rot:-8}, 1.2)
  // — faehrt weich hin und nach hold s weich auf die pet-Defaults zurueck.
  express(p, hold = 0.8) { this._ex = { p: p || {}, t: hold }; }
  update(dt) {
    if (!this.mesh) return;
    this.mesh.visible = this.enabled;
    if (this._talk && this.enabled) {
      this._t += dt;
      if (this._t >= this._next) {
        this._t = 0;
        this._next = (0.07 + Math.random() * 0.09) / Math.max(0.1, this.p.rate);
        const r = Math.random(); let n;
        if (r < 0.62) n = pick(TALK_POOL);
        else if (r < 0.86) n = pick(CLOSERS);
        else { n = 'neutral'; this._next *= 1.7; }   // Mikro-Pause (Atem)
        if (n === this.cur) n = pick(TALK_POOL);
        this.setTex(n);
      }
    }
    this._pop += (1 - this._pop) * Math.min(1, dt * 14);
    this._applyScale();
    const ex = (this._ex && this._ex.t > 0) ? this._ex.p : null;
    if (this._ex) { this._ex.t -= dt; if (this._ex.t <= 0) this._ex = null; }
    const tb = ex && ex.bend != null ? ex.bend : (this.p.bend || 0);
    const tr = ex && ex.rot != null ? ex.rot : (this.p.rot || 0);
    this._cb += (tb - this._cb) * Math.min(1, dt * 10);
    this._cr += (tr - this._cr) * Math.min(1, dt * 10);
    this._applyBend(this._cb);
    this.mesh.rotation.z = this._cr * Math.PI / 180;
  }
  dispose() {
    if (this.mesh && this.mesh.parent) this.mesh.parent.remove(this.mesh);
    if (this.mesh) { this.mesh.geometry.dispose(); this.mesh.material.dispose(); }
    this.mesh = null;
    clearTimeout(this._bt);
  }
}
try { if (typeof window !== 'undefined') window.PetMouth = PetMouth; } catch (e) {}
