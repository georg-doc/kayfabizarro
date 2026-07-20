/* pet-fx.v1.js — KFB CARTOON-FX v1 (2026-07-19). Flache Cel-Partikel im Papier-Look:
   dust (Staub-Puffs + Boden-Ring), star (Comic-Impact-Stern als Sprite, easeOutBack-Pop),
   speedlines (Whoosh-Striche). Kein Physik-System: jedes Teil hat life+fn und settlet in
   Ruhe (Prime Directive — FX sind Interpunktion, kein Dauerregen).
   VERTRAG: update(dt) einmal pro Frame; Sprites billboarden von selbst. */
export class PetFX {
  constructor(THREE, scene) { this.THREE = THREE; this.scene = scene; this.items = []; this.emit = []; this.enabled = true; }
  _basic(color, op) { return new this.THREE.MeshBasicMaterial({ color, transparent: true, opacity: op != null ? op : 1, depthWrite: false }); }
  _add(mesh, life, fn) { this.scene.add(mesh); this.items.push({ m: mesh, t: 0, life, fn }); }

  dust(pos, n = 8, spread = 0.5) {
    if (!this.enabled) return;
    const T = this.THREE;
    for (let i = 0; i < n; i++) {
      const m = new T.Mesh(new T.SphereGeometry(0.03 + Math.random() * 0.04, 6, 5), this._basic(i % 3 ? 0xd8c79c : 0xefe6cb, 0.95));
      const a = Math.random() * Math.PI * 2, rr = 0.05 + Math.random() * 0.12;
      m.position.set(pos.x + Math.cos(a) * rr, (pos.y || 0) + 0.04, pos.z + Math.sin(a) * rr);
      const vx = Math.cos(a) * spread * (0.5 + Math.random() * 0.9);
      const vz = Math.sin(a) * spread * (0.5 + Math.random() * 0.9);
      const vy = 0.25 + Math.random() * 0.45;
      this._add(m, 0.5 + Math.random() * 0.25, (it, k, dt) => {
        m.position.x += vx * dt * (1 - k); m.position.z += vz * dt * (1 - k); m.position.y += vy * dt * (1 - k);
        m.scale.setScalar(1 + k * 1.4);
        m.material.opacity = 0.95 * (1 - k) * (1 - k);
      });
    }
    this.ring(pos);
  }
  ring(pos) {
    if (!this.enabled) return;
    const T = this.THREE;
    const m = new T.Mesh(new T.TorusGeometry(0.15, 0.016, 8, 28), this._basic(0x8a7a5c, 0.75));
    m.rotation.x = -Math.PI / 2; m.position.set(pos.x, (pos.y || 0) + 0.02, pos.z);
    this._add(m, 0.4, (it, k) => { const s = 1 + k * 2.8; m.scale.set(s, s, 1); m.material.opacity = 0.75 * (1 - k); });
  }
  _starTex() {
    if (this._st) return this._st;
    const T = this.THREE, c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d');
    g.translate(64, 64); g.beginPath();
    for (let i = 0; i < 16; i++) { const r = i % 2 ? 24 : 56, a = i / 16 * Math.PI * 2; g[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); }
    g.closePath(); g.fillStyle = '#e9c14a'; g.fill();
    g.lineWidth = 7; g.strokeStyle = '#1f1a14'; g.lineJoin = 'round'; g.stroke();
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace;
    this._st = t; return t;
  }
  star(pos, scale = 0.55) {
    if (!this.enabled) return;
    const T = this.THREE;
    const m = new T.Sprite(new T.SpriteMaterial({ map: this._starTex(), transparent: true, depthWrite: false }));
    m.position.set(pos.x, pos.y != null ? pos.y : 0.9, pos.z); m.scale.setScalar(0.01);
    const rot = (Math.random() - 0.5) * 0.9;
    this._add(m, 0.55, (it, k) => {
      const back = 1 + 2.2 * Math.pow(k - 1, 3) + 1.2 * Math.pow(k - 1, 2);   // easeOutBack-Pop
      const fade = k > 0.75 ? 1 - (k - 0.75) / 0.25 : 1;
      m.scale.setScalar(Math.max(0.01, scale * back * (0.6 + 0.4 * fade)));
      m.material.rotation = rot * k; m.material.opacity = fade;
    });
  }
  // getPos = fn -> {x,y,z} (folgt dem Pet), dir = Flugrichtung; Striche fliegen entgegen und verblassen
  speedlines(getPos, dir, dur = 0.5, rate = 0.028) {
    if (!this.enabled) return;
    this.emit.push({ t: 0, acc: 0, dur, rate, getPos, dir });
  }
  _line(p, dir) {
    const T = this.THREE, len = 0.35 + Math.random() * 0.4;
    const m = new T.Mesh(new T.BoxGeometry(0.02, 0.02, len), this._basic(0xf6efd9, 0.85));
    const off = 0.4;
    m.position.set(p.x + (Math.random() - 0.5) * off, p.y + (Math.random() - 0.5) * off, p.z + (Math.random() - 0.5) * off);
    const d = new T.Vector3(dir.x, dir.y, dir.z).normalize();
    m.lookAt(m.position.clone().add(d));
    this._add(m, 0.3, (it, k, dt) => { m.position.addScaledVector(d, -2.6 * dt); m.material.opacity = 0.85 * (1 - k); });
  }
  update(dt) {
    for (let i = this.emit.length - 1; i >= 0; i--) {
      const e = this.emit[i]; e.t += dt; e.acc += dt;
      while (e.acc > e.rate) { e.acc -= e.rate; this._line(e.getPos(), e.dir); }
      if (e.t >= e.dur) this.emit.splice(i, 1);
    }
    for (let i = this.items.length - 1; i >= 0; i--) {
      const it = this.items[i]; it.t += dt;
      const k = Math.min(1, it.t / it.life);
      it.fn(it, k, dt);
      if (k >= 1) {
        this.scene.remove(it.m);
        if (it.m.geometry) it.m.geometry.dispose();
        if (it.m.material && it.m.material.dispose) it.m.material.dispose();
        this.items.splice(i, 1);
      }
    }
  }
  clear() { for (const it of this.items) this.scene.remove(it.m); this.items.length = 0; this.emit.length = 0; }
}
try { if (typeof window !== 'undefined') window.PetFX = PetFX; } catch (e) {}
