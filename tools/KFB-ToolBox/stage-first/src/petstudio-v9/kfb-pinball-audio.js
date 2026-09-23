/* ═══════════════════════════════════════════════════════════════════
   KFB Pinball Audio · v1 · 2026-08-22

   Ein Modul, drei Schichten, keine Abhaengigkeiten.

     EREIGNISSE   Einmalklaenge aus der KFB-Bibliothek, manifestgesteuert
     DROHNE       prozedural, R/A/F aus den drei Wuerfeln, keine Dateien
     MUSIK        Deck-Jingle oder spaeter Suno-Track

   Ein- und ausbaubar: `createNullAudio()` hat dieselbe Schnittstelle und
   tut nichts. Wer das Modul nicht will, tauscht eine Zeile.

   Kanon-Bezug:
   - Audio folgt dem Spiel, nie umgekehrt. Klang darf Farbe, Licht, Raum
     und Kamera steuern, nichts was die Physik anfasst.
   - "4D ist Klang": R, A und F sind an den Wuerfeln nur Farbcodierung,
     in der Drohne sind sie wieder Resonanz, Amplitude und Frequenz.
   - Ortskopplung: das Gutter klingt anders als die Karte. Man hoert, wo
     der Ball ist, bevor man es sieht.

   Nutzung:
     import { createAudio } from './kfb-pinball-audio.js';
     const audio = await createAudio({ manifestUrl: './kfb-pinball-sfx.json' });
     // In einem Klick- oder Touch-Handler, sonst bleibt es stumm:
     await audio.unlock();
     audio.emit('dice.impact.card', { pos:[x,y,z], velocity:0.7 });
   ═══════════════════════════════════════════════════════════════════ */

export const KFB_AUDIO_VERSION = 1;

/* ── Hilfen ─────────────────────────────────────────────────────── */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp  = (a, b, t) => a + (b - a) * t;

/** Zieht ohne Wiederholung. Zweimal derselbe Aufprall klingt nach Fehler. */
function makePicker(n) {
  let last = -1;
  return () => {
    if (n <= 1) return 0;
    let i = (Math.random() * n) | 0;
    if (i === last) i = (i + 1 + ((Math.random() * (n - 1)) | 0)) % n;
    last = i;
    return i;
  };
}

/* ── Leerlauf-Fassung, gleiche Schnittstelle ────────────────────── */
export function createNullAudio() {
  const noop = () => {};
  return {
    version: KFB_AUDIO_VERSION, enabled: false,
    unlock: async () => false,
    emit: noop, setListener: noop, setZone: noop, setBus: noop,
    drone: { set: noop, reset: noop },
    music: { play: async () => {}, stop: noop },
    preload: async () => {}, stats: () => ({ enabled: false }), dispose: noop
  };
}

/* ═══════════════════════════════════════════════════════════════════
   Hauptfassung
   ═══════════════════════════════════════════════════════════════════ */
export async function createAudio(opts = {}) {
  const {
    manifestUrl = './kfb-pinball-sfx.json',
    manifest: given = null,
    baseUrl = null,            // ueberschreibt manifest.baseUrl
    positional = true,         // 3D-Panner, sonst Stereo nach x
    maxVoices = 24,
    onError = (e) => console.warn('[kfb-audio]', e)
  } = opts;

  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) { onError('Web Audio nicht verfuegbar'); return createNullAudio(); }

  let M;
  try {
    M = given || await (await fetch(manifestUrl)).json();
  } catch (e) { onError('Manifest nicht ladbar: ' + e); return createNullAudio(); }

  const BASE = baseUrl || M.baseUrl || '';
  const ctx  = new Ctx();

  /* ── Busse ────────────────────────────────────────────────────── */
  const master = ctx.createGain(); master.gain.value = 1.0;
  master.connect(ctx.destination);

  const bus = {};
  for (const name of ['sfx', 'drone', 'music']) {
    const g = ctx.createGain();
    g.gain.value = (M.buses && M.buses[name] != null) ? M.buses[name] : 0.7;
    bus[name] = g;
  }

  /* Zonenkette: Tiefpass plus einfacher Rueckkopplungshall.
     Kein Impulsantwort-Sample, damit das Modul dateifrei bleibt. */
  const zoneFilter = ctx.createBiquadFilter();
  zoneFilter.type = 'lowpass';
  zoneFilter.frequency.value = 10000;
  zoneFilter.Q.value = 0.7;

  const dry = ctx.createGain(); dry.gain.value = 1.0;
  const wet = ctx.createGain(); wet.gain.value = 0.12;
  const delay = ctx.createDelay(1.0); delay.value = 0.0;
  delay.delayTime.value = 0.085;
  const fb = ctx.createGain(); fb.gain.value = 0.42;
  const damp = ctx.createBiquadFilter();
  damp.type = 'lowpass'; damp.frequency.value = 3200;

  zoneFilter.connect(dry).connect(master);
  zoneFilter.connect(delay);
  delay.connect(damp).connect(fb).connect(delay);
  damp.connect(wet).connect(master);

  bus.sfx.connect(zoneFilter);
  bus.drone.connect(zoneFilter);
  bus.music.connect(master);          // Musik bleibt trocken

  /* ── Zwischenspeicher und Zaehler ─────────────────────────────── */
  const buffers = new Map();          // url -> AudioBuffer
  const pending = new Map();          // url -> Promise
  const pickers = new Map();          // key -> Picker
  let   voices  = 0;
  const perEvent = new Map();         // event -> laufende Stimmen
  let   loaded = 0, failed = 0;

  async function load(url) {
    if (buffers.has(url)) return buffers.get(url);
    if (pending.has(url)) return pending.get(url);
    const p = (async () => {
      const r = await fetch(BASE + url);
      if (!r.ok) throw new Error(r.status + ' ' + url);
      const b = await ctx.decodeAudioData(await r.arrayBuffer());
      buffers.set(url, b); loaded++;
      return b;
    })().catch(e => { failed++; onError(e.message); buffers.set(url, null); return null; })
        .finally(() => pending.delete(url));
    pending.set(url, p);
    return p;
  }

  /* ── Auswahl innerhalb eines Ereignisses ──────────────────────── */
  function chooseUrl(name, def, params) {
    const f = def.files;

    if (def.layers === 'velocity' && !Array.isArray(f)) {
      const v = clamp(params.velocity ?? 0.5, 0, 1);
      const th = def.thresholds || [0.25, 0.6];
      const layer = v < th[0] ? 'light' : (v < th[1] ? 'medium' : 'heavy');
      const arr = f[layer] || f.medium || Object.values(f)[0];
      const key = name + ':' + layer;
      if (!pickers.has(key)) pickers.set(key, makePicker(arr.length));
      return { url: arr[pickers.get(key)()], layerGain: lerp(0.55, 1.0, v) };
    }

    if (def.layers === 'ladder') {
      const arr = f.ladder || Object.values(f)[0];
      const step = clamp((params.step ?? 1) - 1, 0, arr.length - 1) | 0;
      return { url: arr[step], layerGain: lerp(0.8, 1.0, step / (arr.length - 1)) };
    }

    const arr = Array.isArray(f) ? f : Object.values(f).flat();
    if (!pickers.has(name)) pickers.set(name, makePicker(arr.length));
    return { url: arr[pickers.get(name)()], layerGain: 1.0 };
  }

  /* ── Hoerer und Ortung ────────────────────────────────────────── */
  const listener = { pos: [0, 0, 0], fwd: [0, 0, -1], up: [0, 1, 0] };

  function setListener({ pos, forward, up } = {}) {
    if (pos) listener.pos = pos;
    if (forward) listener.fwd = forward;
    if (up) listener.up = up;
    const L = ctx.listener;
    if (L.positionX) {
      const t = ctx.currentTime;
      L.positionX.setTargetAtTime(listener.pos[0], t, 0.02);
      L.positionY.setTargetAtTime(listener.pos[1], t, 0.02);
      L.positionZ.setTargetAtTime(listener.pos[2], t, 0.02);
      L.forwardX.setTargetAtTime(listener.fwd[0], t, 0.02);
      L.forwardY.setTargetAtTime(listener.fwd[1], t, 0.02);
      L.forwardZ.setTargetAtTime(listener.fwd[2], t, 0.02);
      L.upX.setTargetAtTime(listener.up[0], t, 0.02);
      L.upY.setTargetAtTime(listener.up[1], t, 0.02);
      L.upZ.setTargetAtTime(listener.up[2], t, 0.02);
    } else if (L.setPosition) {                 // aeltere Fassungen
      L.setPosition(...listener.pos);
      L.setOrientation(...listener.fwd, ...listener.up);
    }
  }

  function makeSpatial(pos) {
    if (!pos) return null;
    if (positional && ctx.createPanner) {
      const p = ctx.createPanner();
      p.panningModel = 'HRTF';
      p.distanceModel = 'inverse';
      p.refDistance = 6;
      p.maxDistance = 200;
      p.rolloffFactor = 0.8;
      if (p.positionX) {
        p.positionX.value = pos[0]; p.positionY.value = pos[1]; p.positionZ.value = pos[2];
      } else p.setPosition(...pos);
      return p;
    }
    const s = ctx.createStereoPanner();
    s.pan.value = clamp(pos[0] / 20, -1, 1);
    return s;
  }

  /* ── Ereignis abspielen ───────────────────────────────────────── */
  function emit(name, params = {}) {
    const def = M.events[name];
    if (!def) { onError('unbekanntes Ereignis: ' + name); return; }
    if (ctx.state !== 'running') return;                 // vor unlock() still

    const cap = def.voices || 4;
    if ((perEvent.get(name) || 0) >= cap) return;
    if (voices >= maxVoices) return;

    const { url, layerGain } = chooseUrl(name, def, params);

    const start = (buf) => {
      if (!buf) return;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const pr = def.pitch || [1, 1];
      src.playbackRate.value = (params.rate != null)
        ? params.rate
        : lerp(pr[0], pr[1], Math.random());

      const g = ctx.createGain();
      g.gain.value = (def.gain ?? 0.8) * layerGain * (params.gain ?? 1);

      const sp = makeSpatial(params.pos);
      if (sp) src.connect(g).connect(sp).connect(bus.sfx);
      else    src.connect(g).connect(bus.sfx);

      voices++; perEvent.set(name, (perEvent.get(name) || 0) + 1);
      src.onended = () => {
        voices--; perEvent.set(name, Math.max(0, (perEvent.get(name) || 1) - 1));
        try { g.disconnect(); sp && sp.disconnect(); } catch (e) {}
      };
      src.start(ctx.currentTime + (params.delay || 0));
    };

    const cached = buffers.get(url);
    if (cached !== undefined) start(cached);
    else load(url).then(start);

    /* Manche Ereignisse schalten die Zone gleich mit. */
    if (def.zone) setZone(def.zone);
  }

  /* ── Zonen ────────────────────────────────────────────────────── */
  let currentZone = 'card';
  function setZone(name, seconds = 0.45) {
    const z = (M.zones && M.zones[name]) || M.zones?.card;
    if (!z) return;
    currentZone = name;
    const t = ctx.currentTime, tau = seconds / 3;
    zoneFilter.frequency.setTargetAtTime(z.lowpass, t, tau);
    wet.gain.setTargetAtTime(z.reverb, t, tau);
    fb.gain.setTargetAtTime(clamp(0.30 + z.reverb * 0.45, 0, 0.85), t, tau);
    drone._zoneGain(z.droneGain, z.detune, seconds);
  }

  /* ── RAF-Drohne, prozedural ───────────────────────────────────── */
  const drone = (() => {
    const cfg = M.drone || { base: 55, partials: [1, 1.5, 2, 3] };
    const out = ctx.createGain(); out.gain.value = 0.0;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.value = 700; filt.Q.value = 1;
    filt.connect(out).connect(bus.drone);

    const oscs = cfg.partials.map((mult, i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? 'sine' : 'sawtooth';
      o.frequency.value = cfg.base * mult;
      const g = ctx.createGain();
      g.gain.value = 1 / (i + 1.6);
      o.connect(g).connect(filt);
      return { o, g, mult };
    });

    let started = false, zg = 0.30, zdet = 0;
    let R = 0, A = 0, F = 0;

    function apply(sec = 0.12) {
      const t = ctx.currentTime, tau = sec / 3;
      filt.Q.setTargetAtTime(lerp(0.5, 14, clamp(R, 0, 1)), t, tau);
      filt.frequency.setTargetAtTime(lerp(320, 2400, clamp(R * 0.4 + A * 0.6, 0, 1)), t, tau);
      out.gain.setTargetAtTime(clamp(A, 0, 1) * zg, t, tau);
      const semi = lerp(-12, 12, clamp((F + 1) / 2, 0, 1)) + zdet;
      for (const p of oscs) {
        p.o.frequency.setTargetAtTime(cfg.base * p.mult * Math.pow(2, semi / 12), t, tau);
      }
    }

    return {
      /** R Resonanz, A Amplitude, F Frequenz. Je 0..1, F auch -1..1. */
      set({ R: r, A: a, F: f } = {}, seconds = 0.12) {
        if (!started) return;
        if (r != null) R = r;
        if (a != null) A = a;
        if (f != null) F = f;
        apply(seconds);
      },
      reset() { R = 0; A = 0; F = 0; apply(0.6); },
      _start() { if (!started) { started = true; oscs.forEach(p => p.o.start()); apply(0.5); } },
      _zoneGain(g, det, sec) {
        zg = g; zdet = det || 0;
        if (started) apply(sec);
      },
      _dispose() { try { oscs.forEach(p => p.o.stop()); } catch (e) {} }
    };
  })();

  /* ── Musik ────────────────────────────────────────────────────── */
  const music = (() => {
    let src = null, gain = null;
    return {
      async play(deckId, { loop = true, fade = 0.8 } = {}) {
        const url = (M.decks || {})[deckId];
        if (!url) { onError('kein Track fuer Deck ' + deckId); return; }
        this.stop(fade);
        const buf = await load(url);
        if (!buf) return;
        src = ctx.createBufferSource(); src.buffer = buf; src.loop = loop;
        gain = ctx.createGain(); gain.gain.value = 0;
        src.connect(gain).connect(bus.music);
        src.start();
        gain.gain.setTargetAtTime(1, ctx.currentTime, fade / 3);
      },
      stop(fade = 0.5) {
        if (!src) return;
        const s = src, g = gain;
        g.gain.setTargetAtTime(0, ctx.currentTime, fade / 3);
        setTimeout(() => { try { s.stop(); g.disconnect(); } catch (e) {} }, fade * 1000 + 200);
        src = null; gain = null;
      }
    };
  })();

  /* ── Vorladen ─────────────────────────────────────────────────── */
  async function preload(names = M.preload || []) {
    const urls = new Set();
    for (const n of names) {
      const d = M.events[n];
      if (!d) continue;
      const f = d.files;
      (Array.isArray(f) ? f : Object.values(f).flat()).forEach(u => urls.add(u));
    }
    await Promise.all([...urls].map(load));
  }

  /* ── Freischalten. Ohne Geste bleibt iOS stumm. ───────────────── */
  async function unlock() {
    try {
      if (ctx.state === 'suspended') await ctx.resume();
      drone._start();
      setZone('card', 0.01);
      return ctx.state === 'running';
    } catch (e) { onError(e); return false; }
  }

  return {
    version: KFB_AUDIO_VERSION,
    enabled: true,
    ctx, manifest: M,
    unlock, emit, setListener, setZone, preload, drone, music,
    setBus(name, value, seconds = 0.2) {
      const g = name === 'master' ? master : bus[name];
      if (g) g.gain.setTargetAtTime(clamp(value, 0, 2), ctx.currentTime, seconds / 3);
    },
    get zone() { return currentZone; },
    stats: () => ({
      enabled: true, state: ctx.state, zone: currentZone,
      voices, loaded, failed, cached: buffers.size,
      events: Object.keys(M.events).length
    }),
    dispose() { drone._dispose(); music.stop(0.1); setTimeout(() => ctx.close(), 400); }
  };
}
