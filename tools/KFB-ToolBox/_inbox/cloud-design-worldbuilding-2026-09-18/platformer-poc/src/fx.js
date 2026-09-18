/* Kleine Ereignis-Schicht: Ton und Sicht-Feedback reagieren auf Events aus physics.js.
   Kein zweiter Audio-Motor, kein Gameplay-Besitz — nur Abbildung Ereignis → Reiz.
   Der Ton ist synthetisiert (WebAudio), damit der Export keine Audio-Binärdateien trägt. */
import * as THREE from 'three';

export class Sfx {
  constructor() { this.ctx = null; this.on = true; }
  ensure() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }
  blip(freq, dur = 0.12, type = 'triangle', gain = 0.07, slide = 0) {
    if (!this.on) return;
    const ctx = this.ensure();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), ctx.currentTime + dur);
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    o.connect(g).connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + dur);
  }
  event(e) {
    switch (e.type) {
      case 'jump': this.blip(420, 0.14, 'triangle', 0.06, 260); break;
      case 'land': this.blip(180, 0.10, 'sine', 0.07, -60); break;
      case 'bounce': this.blip(300, 0.22, 'square', 0.05, 520); break;
      case 'pickup': this.blip(880, 0.10, 'triangle', 0.05, 420); break;
      case 'rescue': this.blip(520, 0.30, 'sine', 0.05, -260); break;
      case 'hit': this.blip(140, 0.18, 'sawtooth', 0.05, -60); break;
      case 'portal': this.blip(660, 0.26, 'sine', 0.05, 300); break;
      default: break;
    }
  }
}

export class Fx {
  constructor(scene, cell) {
    this.scene = scene;
    this.cell = cell;
    this.puffs = [];

    const ringGeo = new THREE.RingGeometry(0.55, 0.78, 40);
    ringGeo.rotateX(-Math.PI / 2);
    this.target = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xffd479, transparent: true, opacity: 0.85, depthWrite: false }));
    this.target.visible = false;
    scene.add(this.target);

    this.alt = [0, 1].map(() => {
      const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, depthWrite: false }));
      m.visible = false; scene.add(m); return m;
    });

    this.arc = new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]),
      new THREE.LineDashedMaterial({ color: 0xffd479, transparent: true, opacity: 0.55, dashSize: 0.18, gapSize: 0.16 }));
    this.arc.visible = false;
    scene.add(this.arc);
  }

  showTarget(best, alts, arcPts) {
    if (!best) { this.target.visible = false; this.arc.visible = false; this.alt.forEach((m) => (m.visible = false)); return; }
    const c = this.cell;
    const s = Math.min(best.platform.half.x, best.platform.half.y) * 1.25;
    this.target.visible = true;
    this.target.position.set(best.aim.x, best.platform.top + 0.02 * c, best.aim.z);
    this.target.scale.setScalar(Math.max(0.8 * c, s));
    this.alt.forEach((m, i) => {
      const a = alts[i];
      m.visible = !!a;
      if (a) {
        m.position.set(a.aim.x, a.platform.top + 0.02 * c, a.aim.z);
        m.scale.setScalar(Math.max(0.6 * c, Math.min(a.platform.half.x, a.platform.half.y) * 0.9));
      }
    });
    if (arcPts) {
      this.arc.geometry.dispose();
      this.arc.geometry = new THREE.BufferGeometry().setFromPoints(arcPts);
      this.arc.computeLineDistances();
      this.arc.visible = true;
    }
  }

  puff(pos) {
    const c = this.cell;
    const geo = new THREE.RingGeometry(0.2, 0.34, 24);
    geo.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xfff3dc, transparent: true, opacity: 0.8, depthWrite: false }));
    m.position.set(pos.x, pos.y + 0.03 * c, pos.z);
    m.scale.setScalar(c * 0.8);
    this.scene.add(m);
    this.puffs.push({ m, t: 0 });
  }

  sparkle(pos) {
    const c = this.cell;
    const geo = new THREE.RingGeometry(0.1, 0.5, 18);
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }));
    m.position.copy(pos);
    m.scale.setScalar(c * 0.6);
    this.scene.add(m);
    this.puffs.push({ m, t: 0, billboard: true });
  }

  update(dt, camera) {
    this.target.material.opacity = 0.55 + 0.3 * Math.sin(performance.now() / 260);
    for (let i = this.puffs.length - 1; i >= 0; i--) {
      const p = this.puffs[i];
      p.t += dt;
      const u = p.t / 0.45;
      p.m.scale.setScalar(this.cell * (0.6 + u * 1.5));
      p.m.material.opacity = Math.max(0, 0.85 * (1 - u));
      if (p.billboard) p.m.quaternion.copy(camera.quaternion);
      if (u >= 1) { this.scene.remove(p.m); p.m.geometry.dispose(); p.m.material.dispose(); this.puffs.splice(i, 1); }
    }
  }
}
