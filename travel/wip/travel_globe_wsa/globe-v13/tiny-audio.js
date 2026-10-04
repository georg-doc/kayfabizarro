// ============================================================================
// tiny-audio.js — 1:1-Portierung von tinyskies `client/src/audio/AudioManager.ts`
// ----------------------------------------------------------------------------
// Aus TypeScript in ein ES-Modul übersetzt, ohne Umbau: dieselben drei Musik-
// Ebenen (day/evening/night) mit Gewichten je Bild, dieselbe End-Times-Ebene,
// dieselben Schleifen mit `targetVolume` + `FADE_SPEED`, dasselbe `playSFX` mit
// `endFadeFraction`. Wer den Original-Klang will, hört diesen Graphen.
//
// ⚠ **BEFUND, GEMESSEN, NICHT GERATEN: im Repo liegen keine Audiodateien.**
// Der Zweig `cursor/globefly-multiplayer-globe-flight-game` hat 201 importierbare
// Dateien, davon 0 mit Endung mp3/ogg/wav/m4a (Baum mit Filter abgefragt, 27.8.).
// `AudioManager` lädt aus `/audio/music/day_1.mp3` usw. — das sind Pfade auf den
// SERVER des Originals, keine Repo-Inhalte. Die MECHANIK ist portierbar, die
// TÖNE sind es nicht.
//
// Konsequenz, und das ist die ganze Bauentscheidung dieses Moduls: die Quellen
// sind DATEN. `sources` bildet Namen auf URLs ab, `base` stellt einen Präfix
// davor. Ohne Einträge läuft der Graph leer und sagt das (`report().quellen`) —
// die Umschaltung im Spiel fällt dann auf die synthetischen Einsätze der
// KFB-Fassung zurück (siehe `audio-switch.js`). Kein stiller Ausfall.
//
//   const t = createTinyAudio({ base: 'https://…/audio/', sources: { … } });
//   await t.init();  t.startMusic();          // aus einer Nutzergeste
//   t.setWeights(1, 0, 0);  t.update(dt);
//   t.playSFX('shoot_1', 0.82);
// ============================================================================

const FADE_SPEED = 2.0;                 // AudioManager.ts
const MASTER_MUSIC_VOLUME = 0.35;       // AudioManager.ts
const PHASES = ['day', 'evening', 'night'];

// Die Namen und Pfade der Quelle — als SOLL, nicht als Versprechen. Wer eigene
// Dateien einhängt, überschreibt einzelne Einträge; was fehlt, fehlt hörbar
// dokumentiert statt stumm.
export const TINY_SOLL = {
  music: {
    day: ['music/day_1.mp3', 'music/day_2.mp3'],
    evening: ['music/evening_1.mp3', 'music/evening_2.mp3'],
    night: ['music/night_1.mp3', 'music/night_2.mp3'],
    end_times: ['music/end_times_1.mp3', 'music/end_times_2.mp3'],
  },
  // Nur die, die diese Kugelwelt überhaupt auslösen kann. Game.ts lädt ~60.
  sfx: {
    engine_carpet: 'sfx/carpet_1.mp3',
    ocean_waves_1: 'sfx/ocean_waves_1.mp3',
    crickets_loop: 'sfx/crickets_loop.mp3',
    birds_chirp_1: 'sfx/birds_chirp_1.mp3',
    rumbling_1: 'sfx/rumbling_1.mp3',
    shoot_1: 'sfx/shoot_1.mp3',
    splash_1: 'sfx/splash_1.mp3',
    chime_1: 'sfx/chime_1.mp3',
    click_1: 'sfx/click_1.mp3',
    portal_1: 'sfx/portal_1.mp3',
  },
};

export function createTinyAudio(opts = {}) {
  const base = opts.base || '';
  // `sources` überschreibt punktuell; ohne `base` und ohne Eintrag gibt es keine URL.
  const musicSrc = Object.assign({}, TINY_SOLL.music, (opts.sources && opts.sources.music) || {});
  const sfxSrc = Object.assign({}, TINY_SOLL.sfx, (opts.sources && opts.sources.sfx) || {});
  const url = (p) => (/^https?:|^data:|^blob:/.test(p) ? p : (base ? base + p : null));

  let ctx = null, masterGain = null, layers = null;
  let endLayers = [], endIndex = 0, endWeight = 0;
  let started = false, muted = false;
  let versucht = 0, geladen = 0;
  const sfxBuffers = new Map();
  const loops = new Map();

  const createLayer = () => {
    const gain = ctx.createGain(); gain.gain.value = 0; gain.connect(masterGain);
    return { buffer: null, source: null, targetVolume: 0, gain };
  };

  async function holen(u) {
    if (!u) return null;
    versucht++;
    try {
      const res = await fetch(u);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const buf = await ctx.decodeAudioData(await res.arrayBuffer());
      geladen++;
      return buf;
    } catch (e) {
      // Eine Zeile pro Ausfall, mit URL — sonst sucht man später an der Mechanik.
      console.warn('[tiny-audio] Quelle nicht ladbar:', u, (e && e.message) || e);
      return null;
    }
  }

  async function init() {
    if (ctx) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    ctx = new Ctx();
    ctx.resume && ctx.resume();
    masterGain = ctx.createGain();
    masterGain.gain.value = muted ? 0 : 1;
    masterGain.connect(ctx.destination);

    layers = { day: createLayer(), evening: createLayer(), night: createLayer() };
    endLayers = musicSrc.end_times.map(() => createLayer());
    endIndex = Math.round(Math.random());

    loadSFX('click_1');                      // wie im Original: vor der Musik

    // Je Phase EINE zufällige Auswahl aus der Liste — das ist die Quelle, nicht
    // eine Sparmaßnahme (`urls[Math.floor(Math.random() * urls.length)]`).
    await Promise.all([
      ...PHASES.map(async (ph) => {
        const list = musicSrc[ph] || [];
        if (!list.length) return;
        const pick = list[Math.floor(Math.random() * list.length)];
        layers[ph].buffer = await holen(url(pick));
      }),
      ...musicSrc.end_times.map(async (p, i) => { endLayers[i].buffer = await holen(url(p)); }),
    ]);
  }

  function startLayer(layer) {
    if (!layer.buffer || !ctx) return;
    const source = ctx.createBufferSource();
    source.buffer = layer.buffer; source.loop = true;
    source.connect(layer.gain); source.start(0);
    layer.source = source;
  }

  function startMusic() {
    if (started || !ctx || !layers) return;
    started = true;
    if (ctx.state === 'suspended') ctx.resume();
    for (const ph of PHASES) startLayer(layers[ph]);
    for (const l of endLayers) startLayer(l);
  }

  function setWeights(day, evening, night) {
    if (!layers) return;
    const normal = 1 - endWeight;
    layers.day.targetVolume = day * MASTER_MUSIC_VOLUME * normal;
    layers.evening.targetVolume = evening * MASTER_MUSIC_VOLUME * normal;
    layers.night.targetVolume = night * MASTER_MUSIC_VOLUME * normal;
  }

  function setEndTimesWeight(w) {
    if (endWeight === 0 && w > 0 && endLayers.length) endIndex = (endIndex + 1) % endLayers.length;
    endWeight = w;
    for (let i = 0; i < endLayers.length; i++) {
      endLayers[i].targetVolume = i === endIndex ? w * MASTER_MUSIC_VOLUME : 0;
    }
  }

  // Rampe je Bild, kein `setTargetAtTime` — genau wie in der Quelle.
  function rampe(layer, dt, speed) {
    const cur = layer.gain.gain.value, diff = layer.targetVolume - cur;
    if (Math.abs(diff) < 0.001) layer.gain.gain.value = layer.targetVolume;
    else layer.gain.gain.value = cur + diff * Math.min(1, speed * dt);
  }

  function update(dt) {
    if (!layers) return;
    for (const ph of PHASES) rampe(layers[ph], dt, FADE_SPEED);
    for (const l of endLayers) rampe(l, dt, FADE_SPEED);
    const weg = [];
    for (const [name, loop] of loops) {
      rampe(loop, dt, FADE_SPEED * 3);
      if (loop.stopWhenSilent && loop.targetVolume === 0 && loop.gain.gain.value < 0.001) weg.push(name);
    }
    for (const n of weg) stopLoop(n);
  }

  async function loadSFX(name, u) {
    if (!ctx || sfxBuffers.has(name)) return;
    const q = u || url(sfxSrc[name]);
    if (!q) return;
    sfxBuffers.set(name, null);              // Platzhalter: nicht zweimal laden
    const buf = await holen(q);
    if (buf) sfxBuffers.set(name, buf); else sfxBuffers.delete(name);
  }

  const hasSFX = (name) => !!sfxBuffers.get(name);

  function playSFX(name, volume, playbackRate, endFadeFraction) {
    if (!ctx || !masterGain || muted) return false;
    const buffer = sfxBuffers.get(name);
    if (!buffer) return false;
    const v = volume == null ? 1 : volume;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const rate = Math.max(0.35, Math.min(2, playbackRate == null ? 1 : playbackRate));
    source.playbackRate.value = rate;
    const gain = ctx.createGain();
    source.connect(gain); gain.connect(masterGain);
    const dur = buffer.duration / rate;
    const fade = Math.max(0, Math.min(1, endFadeFraction || 0));
    if (fade > 0 && dur > 0.001) {
      const t0 = ctx.currentTime;
      gain.gain.setValueAtTime(v, t0);
      gain.gain.linearRampToValueAtTime(v, t0 + dur * (1 - fade));
      gain.gain.linearRampToValueAtTime(0, t0 + dur);
    } else gain.gain.value = v;
    source.start(0);
    return true;
  }

  function startLoop(name, initialVolume, playbackRate) {
    if (!ctx || !masterGain) return false;
    if (loops.has(name)) stopLoop(name);
    const buffer = sfxBuffers.get(name);
    if (!buffer) return false;
    const source = ctx.createBufferSource();
    source.buffer = buffer; source.loop = true;
    source.playbackRate.value = Math.max(0.5, Math.min(2, playbackRate == null ? 1 : playbackRate));
    const gain = ctx.createGain();
    gain.gain.value = initialVolume || 0;
    source.connect(gain); gain.connect(masterGain); source.start(0);
    loops.set(name, { source, gain, targetVolume: initialVolume || 0, stopWhenSilent: false });
    return true;
  }

  function stopLoop(name) {
    const loop = loops.get(name);
    if (!loop) return;
    try { loop.source.stop(); loop.source.disconnect(); loop.gain.disconnect(); } catch (e) {}
    loops.delete(name);
  }

  return {
    name: 'tiny-audio', init, startMusic, setWeights, setEndTimesWeight, update,
    loadSFX, hasSFX, playSFX, startLoop, stopLoop,
    get ready() { return !!ctx; },
    get running() { return !!(ctx && ctx.state === 'running' && !muted); },
    get state() { return ctx ? ctx.state : 'off'; },
    get muted() { return muted; },
    setLoopVolume(name, v) { const l = loops.get(name); if (l) l.targetVolume = v; },
    setLoopGainImmediate(name, v) {
      const l = loops.get(name); if (!l) return;
      const c = Math.max(0, Math.min(1, v)); l.gain.gain.value = c; l.targetVolume = c;
    },
    fadeOutLoop(name) { const l = loops.get(name); if (!l) return; l.targetVolume = 0; l.stopWhenSilent = true; },
    resumeContextIfNeeded() { if (ctx && ctx.state === 'suspended') ctx.resume(); },
    toggleMute() { muted = !muted; if (masterGain) masterGain.gain.value = muted ? 0 : 1; return muted; },
    setEnabled(on) { muted = !on; if (masterGain) masterGain.gain.value = muted ? 0 : 1; },
    // DAS ist die Zeile, die der Marke sagt, ob überhaupt Töne vorliegen.
    report() {
      return { quellen: geladen, versucht, sfx: sfxBuffers.size,
               musik: PHASES.filter((p) => layers && layers[p].buffer).length,
               base: base || '(keine)', zustand: ctx ? ctx.state : 'off' };
    },
    dispose() {
      for (const n of Array.from(loops.keys())) stopLoop(n);
      if (layers) for (const ph of PHASES) { try { layers[ph].source && layers[ph].source.stop(); } catch (e) {} }
      for (const l of endLayers) { try { l.source && l.source.stop(); } catch (e) {} }
      if (ctx) { try { ctx.close(); } catch (e) {} }
      ctx = null; layers = null; endLayers = []; started = false;
    },
  };
}
