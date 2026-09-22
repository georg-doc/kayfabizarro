/**
 * vfx-sfx.v1.js — Burst, ein Wort, Gun-Rauch, Ton (standardmäßig aus).
 *
 * @kfb name        VFX+SFX, Comic-Treffer nach kfb-cartoon-animation_v2 §4–§7
 * @kfb category    vfx
 * @kfb capability  three@0.160
 * @kfb capability  clock
 * @kfb capability  rng
 * @kfb capability  audio
 * @kfb view        3d
 * @kfb determinism seeded
 * @kfb since       combat-arena v1 (CA-4)
 *
 * Grammatik (SOP): Feuern = Bewegung/Kontakt → 2–3 kleine gefüllte Rauchpuffs, kein Burst, kein
 * Wort (§4.2). Treffer = EIN kleiner gefüllter Burst + 2 Staubkrümel, kein Ring (§4.3/§4.5).
 * Niederlage = EIN Wort (§4.4, §6.2 höchstens eines zugleich) + kleiner Burst. Wort wird mit der
 * echten Schrift GEMESSEN (§6.3), Lage/Animation getrennt (§6.4: Sprite-Position vs. Skala), gesetzt
 * in freier Fläche seitlich vom Anlass, nie auf einem Kopf (§6.5 — geschützte Rechtecke der Köpfe).
 * Kontur je Ereignis EINMAL geseedet (§5.2), danach nur Transform. Ton: eine Marke je Ereignis,
 * synthetisch, Standard AUS, Einschaltgeste beim Wirt (Gründungsdokument §3.3).
 */
export const WORDS = { down: ['KRACH!', 'PLUMPS!', 'BONK!', 'TOCK!'], ko: ['AUTSCH!', 'OOF!'] };
const BUDGET = { maxWords: 1, maxBursts: 2, maxPuffs: 6 };

export default class VfxSfx {
  static describe() { return { name: 'VfxSfx', capabilities: ['three@0.160', 'clock', 'rng', 'audio'], view: '3d', determinism: 'seeded' }; }
  async init(ctx) {
    this.THREE = ctx.three; this.rng = ctx.rng; this.camera = ctx.camera; this.log = (s) => (ctx.log || console.info)('[vfx] ' + s);
    this.items = []; this.word = null; this.soundOn = false; this.protected = () => []; this.count = { burst: 0, word: 0, puff: 0, omitted: 0, cue: 0 };
  }
  mount(parent) { this.group = new this.THREE.Group(); this.group.name = 'vfx'; parent.add(this.group); return this.group; }

  /* ---------- Leinwände: einmal je Ereignis geseedet ---------- */
  _burstTex(seed, col) {
    const c = document.createElement('canvas'); c.width = c.height = 192; const g = c.getContext('2d');
    let s = seed >>> 0; const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    const n = 8 + Math.floor(r() * 3), cx = 96, cy = 96;
    g.beginPath();
    for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2 + (r() - 0.5) * 0.25; const rad = (i % 2 ? 34 : 78) * (0.82 + r() * 0.36); g.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); }
    g.closePath(); g.fillStyle = col; g.fill(); g.lineWidth = 7; g.lineJoin = 'round'; g.strokeStyle = '#1f1a14'; g.stroke();
    const t = new this.THREE.CanvasTexture(c); t.colorSpace = this.THREE.SRGBColorSpace; return t;
  }
  _puffTex(seed) {
    const c = document.createElement('canvas'); c.width = c.height = 96; const g = c.getContext('2d');
    let s = seed >>> 0; const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    g.fillStyle = 'rgba(236,230,214,0.92)'; g.beginPath();
    for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; const rad = 26 + r() * 12; g.arc(48 + Math.cos(a) * 12, 48 + Math.sin(a) * 12, rad * 0.55, 0, Math.PI * 2); }
    g.fill(); g.lineWidth = 4; g.strokeStyle = 'rgba(31,26,20,0.75)'; g.beginPath(); g.arc(48, 48, 34, 0, Math.PI * 2); g.stroke();
    const t = new this.THREE.CanvasTexture(c); t.colorSpace = this.THREE.SRGBColorSpace; return t;
  }
  _wordTex(text) {
    const font = '900 96px "Bangers", "Space Grotesk", sans-serif';
    const m = document.createElement('canvas').getContext('2d'); m.font = font;
    const w = Math.ceil(m.measureText(text).width) + 48, h = 132;                 // §6.3: gemessen, nicht geschätzt
    const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
    g.font = font; g.textBaseline = 'middle'; g.textAlign = 'center'; g.lineJoin = 'round';
    g.lineWidth = 16; g.strokeStyle = '#1f1a14'; g.strokeText(text, w / 2, h / 2 + 4);
    g.fillStyle = '#f2c93c'; g.fillText(text, w / 2, h / 2 + 4);
    const t = new this.THREE.CanvasTexture(c); t.colorSpace = this.THREE.SRGBColorSpace; return { tex: t, w, h, measured: w - 48 };
  }
  _sprite(tex, size, pos, extra) {
    const T = this.THREE, s = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }));
    s.scale.set(size * (tex.image.width / tex.image.height), size, 1); s.position.copy(pos); s.renderOrder = 5;
    this.group.add(s);
    const it = Object.assign({ s, t: 0, tex, base: size, aspect: tex.image.width / tex.image.height }, extra);
    this.items.push(it); return it;
  }

  /* ---------- Ereignisse ---------- */
  fire(pos, dir) {   // Rauch aus der Mündung: Bewegung, tertiär, 3 Puffs, kein Burst
    const n = Math.min(3, BUDGET.maxPuffs - this.items.filter((i) => i.kind === 'puff').length);
    for (let i = 0; i < n; i++) {
      const p = pos.clone().addScaledVector(dir, 0.12 + i * 0.16); p.y += 0.05 * i;
      this._sprite(this._puffTex(1000 + i + this.count.puff), 0.16 + i * 0.05, p, { kind: 'puff', dur: 0.55 + i * 0.12, vel: dir.clone().multiplyScalar(0.9 + i * 0.3).setY(0.7) });
      this.count.puff++;
    }
    this._cue('fire');
  }
  hit(pos, from) {   // Kontakt: EIN kleiner Burst + 2 Krümel, kein Ring, kein Wort
    if (this.items.filter((i) => i.kind === 'burst').length >= BUDGET.maxBursts) { this.count.omitted++; return; }
    this._sprite(this._burstTex(77 + this.count.burst * 31, '#f7f0da'), 0.55, pos.clone().addScaledVector(from, -0.15), { kind: 'burst', dur: 0.32 });
    for (let i = 0; i < 2; i++) this._sprite(this._puffTex(500 + i + this.count.burst), 0.09, pos.clone().add(new this.THREE.Vector3((i ? 1 : -1) * 0.18, -0.25, 0.1)), { kind: 'puff', dur: 0.45, vel: new this.THREE.Vector3((i ? 1 : -1) * 0.8, 1.1, 0.3) });
    this.count.burst++; this._cue('hit');
  }
  down(pos, kind = 'down') {   // Niederlage: EIN Wort in freier Fläche + kleiner Burst
    this._sprite(this._burstTex(900 + this.count.word * 17, '#e9c14a'), 0.8, pos.clone(), { kind: 'burst', dur: 0.45 });
    const list = WORDS[kind] || WORDS.down, text = list[Math.floor(this.rng() * list.length)];
    if (this.word) { this._kill(this.word); this.word = null; }   // §6.2: ein Wort ersetzt das vorige
    const placed = this._placeWord(pos);
    if (!placed) { this.count.omitted++; this.log('word omitted — no free spot (§6.5)'); this._cue(kind); return; }
    const { tex, measured } = this._wordTex(text);
    const it = this._sprite(tex, 0.9, placed, { kind: 'word', dur: 1.05, text });
    it.s.center.set(0.5, 0.5);
    this.word = it; this.count.word++;
    this.log('word "' + text + '" measured ' + measured + ' px · at ' + placed.toArray().map((v) => v.toFixed(2)).join(', '));
    this._cue(kind);
  }
  /* Kandidaten §6.5: rechts, links, oben, schräg — der erste, der kein geschütztes Rechteck trifft. */
  _placeWord(anchor) {
    const T = this.THREE, cam = this.camera, prot = this.protected() || [];
    const cands = [[1.6, 0.9, 0], [-1.6, 0.9, 0], [0, 1.7, 0], [1.4, 1.6, 0], [-1.4, 1.6, 0], [0, 2.3, 0]];
    const toNdc = (p) => p.clone().project(cam);
    for (const [dx, dy, dz] of cands) {
      const p = anchor.clone().add(new T.Vector3(dx, dy, dz)), n = toNdc(p);
      if (Math.abs(n.x) > 0.86 || Math.abs(n.y) > 0.82) continue;
      const hitProt = prot.some((r) => Math.abs(n.x - r.x) < r.w / 2 + 0.16 && Math.abs(n.y - r.y) < r.h / 2 + 0.12);
      if (!hitProt) return p;
    }
    return null;
  }
  _kill(it) { if (it.s.parent) it.s.parent.remove(it.s); it.s.material.dispose(); it.tex.dispose(); const i = this.items.indexOf(it); if (i >= 0) this.items.splice(i, 1); }

  update(dt) {
    for (const it of this.items.slice()) {
      it.t += dt; const k = it.t / it.dur;
      if (k >= 1) { if (it === this.word) this.word = null; this._kill(it); continue; }
      if (it.kind === 'burst') { const sc = it.base * (0.6 + 0.9 * Math.min(1, k * 3)) * (1 - 0.3 * k); it.s.scale.set(sc * it.aspect, sc, 1); it.s.material.opacity = k < 0.7 ? 1 : 1 - (k - 0.7) / 0.3; }
      else if (it.kind === 'puff') { it.s.position.addScaledVector(it.vel, dt); it.vel.multiplyScalar(1 - 2.2 * dt); const sc = it.base * (1 + 1.4 * k); it.s.scale.set(sc, sc, 1); it.s.material.opacity = 0.9 * (1 - k * k); }
      else if (it.kind === 'word') {   // §6.6: pop-in 120 ms, hold, exit 220 ms — Skala/Deckkraft, Lage bleibt
        const tIn = 0.12, tOut = 0.22, pop = it.t < tIn ? (1.25 * Math.sin((it.t / tIn) * Math.PI / 2)) : it.t > it.dur - tOut ? 1 + 0.2 * ((it.t - (it.dur - tOut)) / tOut) : 1 + 0.02 * Math.sin(it.t * 18);
        it.s.scale.set(it.base * it.aspect * pop, it.base * pop, 1);
        it.s.material.opacity = it.t > it.dur - tOut ? 1 - (it.t - (it.dur - tOut)) / tOut : 1;
      }
    }
  }

  /* ---------- Ton: synthetisch, eine Marke je Ereignis, Standard aus ---------- */
  setSound(on) {
    this.soundOn = !!on;
    if (on && !this.ac) { try { this.ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { this.soundOn = false; this.log('no audio context'); } }
    if (this.ac && on && this.ac.state === 'suspended') this.ac.resume();
    this.log('sound ' + (this.soundOn ? 'on (gesture)' : 'off'));
  }
  _cue(kind) {
    if (!this.soundOn || !this.ac) return;
    const ac = this.ac, t0 = ac.currentTime, out = ac.createGain(); out.gain.value = 0.35; out.connect(ac.destination);
    const env = (g, a, d, peak = 1) => { g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(peak, t0 + a); g.gain.exponentialRampToValueAtTime(0.0001, t0 + a + d); };
    if (kind === 'fire') {   // kurzer gefilterter Rausch-Knall
      const len = 0.18, buf = ac.createBuffer(1, ac.sampleRate * len, ac.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.5);
      const src = ac.createBufferSource(); src.buffer = buf; const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 900; f.Q.value = 0.7;
      const g = ac.createGain(); env(g, 0.005, 0.16, 0.9); src.connect(f).connect(g).connect(out); src.start(t0);
    } else if (kind === 'hit') {   // trockener Thump
      const o = ac.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(190, t0); o.frequency.exponentialRampToValueAtTime(60, t0 + 0.14);
      const g = ac.createGain(); env(g, 0.004, 0.16, 0.8); o.connect(g).connect(out); o.start(t0); o.stop(t0 + 0.2);
    } else {   // down/ko: fallender Ton
      const o = ac.createOscillator(); o.type = 'square'; o.frequency.setValueAtTime(420, t0); o.frequency.exponentialRampToValueAtTime(70, t0 + 0.42);
      const g = ac.createGain(); env(g, 0.01, 0.42, 0.5); o.connect(g).connect(out); o.start(t0); o.stop(t0 + 0.5);
    }
    this.count.cue++;
  }
  report() { return { active: this.items.length, word: this.word ? this.word.text : null, count: Object.assign({}, this.count), sound: this.soundOn }; }
  dispose() { this.items.slice().forEach((i) => this._kill(i)); if (this.group && this.group.parent) this.group.parent.remove(this.group); if (this.ac) this.ac.close(); }
}
