/* KFB · S21 · Ton und Effekt für die Raumgruppen
   Kein Pack der Reihe enthält Audio — also wird der Ton SYNTHETISIERT (WebAudio), nicht
   heruntergeladen und nicht gefaked. Jeder Klang ist aus drei Bausteinen gebaut: Rauschen mit
   Hüllkurve (Material), ein gestimmter Körper (Grösse), ein Anschlag (Geste).

   Die Effekte sind bewusst nicht „nichts dazugemalt" wie in S13.3: hier ist Freigabe für
   Sprites, Glühen und Schockwellen. Sie hängen aber an einem EREIGNIS (Zustandswechsel), nie am
   Dauerzustand — ein Effekt, der immer läuft, ist Tapete. */

import * as THREE from 'three';

/* ---------- Ton ---------- */
export function makeAudio() {
  let ctx = null, master = null;
  const ensure = () => {
    if (ctx) return ctx;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
    return ctx;
  };
  const noiseBuf = (c, sec) => {
    const b = c.createBuffer(1, Math.ceil(c.sampleRate * sec), c.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  };
  const noise = (sec, { type = 'bandpass', f = 800, q = 1, g = 0.3, at = 0.004, dec = sec, t0 = 0, sweep = null } = {}) => {
    const c = ensure(), t = c.currentTime + t0;
    const src = c.createBufferSource();
    src.buffer = noiseBuf(c, sec);
    const flt = c.createBiquadFilter();
    flt.type = type; flt.frequency.value = f; flt.Q.value = q;
    if (sweep) { flt.frequency.setValueAtTime(f, t); flt.frequency.exponentialRampToValueAtTime(sweep, t + dec); }
    const amp = c.createGain();
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(g, t + at);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dec);
    src.connect(flt).connect(amp).connect(master);
    src.start(t); src.stop(t + sec + 0.02);
  };
  const tone = (f, { sec = 0.25, g = 0.18, type = 'triangle', t0 = 0, to = null, at = 0.003 } = {}) => {
    const c = ensure(), t = c.currentTime + t0;
    const o = c.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + sec);
    const amp = c.createGain();
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(g, t + at);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + sec);
    o.connect(amp).connect(master);
    o.start(t); o.stop(t + sec + 0.02);
  };

  const KLANG = {
    /* Truhendeckel: Holz reibt (Rauschen mit fallendem Band), dann rastet der Beschlag ein. */
    truhe: () => { noise(0.42, { f: 1300, q: 0.9, g: 0.16, dec: 0.4, sweep: 380 }); tone(180, { sec: 0.18, g: 0.1, t0: 0.3, to: 120 }); tone(640, { sec: 0.09, g: 0.07, t0: 0.34, type: 'square' }); },
    deckel: () => { tone(110, { sec: 0.22, g: 0.22, to: 62 }); noise(0.14, { f: 500, q: 0.6, g: 0.12, dec: 0.12 }); },
    /* Münzen: sieben kurze helle Anschläge mit Streuung — eine einzelne Frequenz klingt nach Klingel. */
    muenzen: () => { for (let i = 0; i < 9; i++) { const f = 1500 + Math.random() * 1700; tone(f, { sec: 0.07 + Math.random() * 0.06, g: 0.06, type: 'triangle', t0: i * 0.035 + Math.random() * 0.02 }); } noise(0.3, { f: 4200, q: 1.4, g: 0.05, dec: 0.28 }); },
    geschirr: () => { for (let i = 0; i < 4; i++) tone(900 + Math.random() * 900, { sec: 0.1, g: 0.05, t0: i * 0.06 }); },
    /* Stein auf Stein: breites tiefes Rauschen, das sich öffnet. */
    stein: () => { noise(0.65, { type: 'lowpass', f: 260, q: 0.7, g: 0.3, dec: 0.6, sweep: 90 }); tone(70, { sec: 0.4, g: 0.16, to: 48 }); },
    spikes: () => { noise(0.12, { f: 3200, q: 3, g: 0.14, dec: 0.1 }); tone(2400, { sec: 0.16, g: 0.08, to: 900, type: 'sawtooth', t0: 0.01 }); tone(96, { sec: 0.26, g: 0.18, to: 60, t0: 0.05 }); },
    fass: () => { tone(140, { sec: 0.3, g: 0.16, to: 92 }); noise(0.2, { f: 700, q: 0.8, g: 0.1, dec: 0.18 }); },
    klick: () => tone(1200, { sec: 0.05, g: 0.05, type: 'square' })
  };

  return {
    an: false,
    liste: Object.keys(KLANG),
    play(name) { if (!this.an) return; const k = KLANG[name]; if (!k) return; ensure(); if (ctx.state === 'suspended') ctx.resume(); k(); },
    setAn(v) { this.an = v; if (v) { ensure(); if (ctx.state === 'suspended') ctx.resume(); } }
  };
}

/* ---------- Effekte ---------- */
function dotTexture(inner = '#fff6d8', outer = '#ffb03a') {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const rad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  rad.addColorStop(0, inner);
  rad.addColorStop(0.35, outer);
  rad.addColorStop(1, 'rgba(255,140,30,0)');
  g.fillStyle = rad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function makeVfx(scene, opts = {}) {
  const layer = opts.layer ?? 0;
  const tex = dotTexture();
  const live = [];

  const funken = (pos, { n = 26, spread = 1.1, up = 2.2, farbe = 0xffc24a, dauer = 1.1, scale = 1 } = {}) => {
    const geo = new THREE.BufferGeometry();
    const p = new Float32Array(n * 3), v = [];
    for (let i = 0; i < n; i++) {
      p[i * 3] = pos[0]; p[i * 3 + 1] = pos[1]; p[i * 3 + 2] = pos[2];
      const a = Math.random() * Math.PI * 2, r = Math.random() * spread;
      v.push([Math.cos(a) * r, up * (0.4 + Math.random()), Math.sin(a) * r]);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const mat = new THREE.PointsMaterial({
      size: 0.42 * scale, map: tex, color: farbe, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, sizeAttenuation: true
    });
    const pts = new THREE.Points(geo, mat);
    pts.layers.set(layer);
    pts.frustumCulled = false;
    scene.add(pts);
    live.push({ t: 0, dauer, tick(dt) {
      const a = geo.attributes.position;
      for (let i = 0; i < n; i++) {
        a.array[i * 3] += v[i][0] * dt;
        a.array[i * 3 + 1] += (v[i][1] - 4.4 * this.t) * dt;
        a.array[i * 3 + 2] += v[i][2] * dt;
      }
      a.needsUpdate = true;
      mat.opacity = Math.max(0, 1 - this.t / dauer);
    }, ende() { scene.remove(pts); geo.dispose(); mat.dispose(); } });
  };

  const welle = (pos, { r0 = 0.4, r1 = 5.2, farbe = 0x9b7fd0, dauer = 0.8 } = {}) => {
    const geo = new THREE.RingGeometry(0.9, 1, 48);
    const mat = new THREE.MeshBasicMaterial({ color: farbe, transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false });
    const ring = new THREE.Mesh(geo, mat);
    ring.layers.set(layer);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(pos[0], pos[1] + 0.12, pos[2]);
    scene.add(ring);
    live.push({ t: 0, dauer, tick() {
      const k = this.t / dauer;
      const s = r0 + (r1 - r0) * (1 - Math.pow(1 - k, 2));
      ring.scale.setScalar(s);
      mat.opacity = 0.85 * (1 - k);
    }, ende() { scene.remove(ring); geo.dispose(); mat.dispose(); } });
  };

  /* Glühen als Sprite hinter dem Objekt — nur für den Moment eines Zustandswechsels. */
  const glut = (pos, { farbe = 0xffc24a, gross = 3.4, dauer = 1.4 } = {}) => {
    const mat = new THREE.SpriteMaterial({ map: tex, color: farbe, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
    const sp = new THREE.Sprite(mat);
    sp.layers.set(layer);
    sp.position.set(pos[0], pos[1], pos[2]);
    sp.scale.setScalar(gross);
    scene.add(sp);
    live.push({ t: 0, dauer, tick() {
      const k = this.t / dauer;
      mat.opacity = Math.sin(Math.min(1, k) * Math.PI) * 0.85;
      sp.scale.setScalar(gross * (0.7 + 0.5 * k));
    }, ende() { scene.remove(sp); mat.dispose(); } });
  };

  const tick = (dt) => {
    for (let i = live.length - 1; i >= 0; i--) {
      const e = live[i];
      e.t += dt;
      e.tick(dt);
      if (e.t >= e.dauer) { e.ende(); live.splice(i, 1); }
    }
  };
  const alleWeg = () => { while (live.length) live.pop().ende(); };
  return { funken, welle, glut, tick, alleWeg, get anzahl() { return live.length; } };
}
