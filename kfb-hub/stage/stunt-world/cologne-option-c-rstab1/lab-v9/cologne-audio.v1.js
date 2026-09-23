// KFB Cologne Race · Option C · Klangschichten
//
// Drei Schichten, ein Mischer. Sie gehören verschiedenen Besitzern und dürfen
// sich nicht gegenseitig übersteuern:
//
//   BED     Motorenlauf. Endlosschleife, Tonhöhe und Pegel am Tempo.
//   MUSIC   Jukebox. Eigener Regler, eigene Titelliste, vom Fahrer geschaltet.
//   SFX     Einzelereignisse (Tordurchfahrt). Kurz, laut, selten.
//
// Quelle Motorenlauf:
//   media/3D_Assets/Audio/KFB Racer/  — 19 Dateien, Pool für spätere
//   Fahrzeug-Zuordnung (V8 Muscle, V8 Load, Steampunk SciFi, Vintage Big-Block).
//
// PIN-HINWEIS, weil er nicht selbstverständlich ist: der Audio-Ordner wurde am
// 2026-09-20T06:24:33Z mit Commit 26c00b98a60ec6346810f6777c1b7873600e1767
// hinzugefügt — also NACH dem Basis-Pin dieser Slice (2ff8b350beef). Unter dem
// Basis-Pin liefert derselbe Pfad 404. Deshalb trägt der Klang seinen eigenen,
// eigens ermittelten Pin.

export const AUDIO_PIN = '26c00b98a60ec6346810f6777c1b7873600e1767';
const AUDIO_DIR = 'media/3D_Assets/Audio/KFB Racer/';

export const rawAudio = file =>
  'https://raw.githubusercontent.com/georg-doc/kayfabizarro/' + AUDIO_PIN + '/' +
  (AUDIO_DIR + file).split('/').map(encodeURIComponent).join('/');

// Der Pool, wie er im Ordner liegt. Für diese Slice läuft EINE Datei; die
// übrigen sind die spätere Zuordnung je Fahrzeug, nicht toter Ballast.
export const ENGINE_POOL = [
  { id: 'v8-seamless', file: 'Seamless_10–12_secon_#1-1789884544910.mp3', label: 'V8 · Seamless 10–12 s', bytes: 55341, role: 'DEFAULT_BED' },
  { id: 'v8-seamless-2', file: 'Seamless_10–12_secon_#2-1789884654695.mp3', label: 'V8 · Seamless Variante 2', bytes: 55341 },
  { id: 'v8-muscle-idle', file: 'KFB_V8_Muscle_Idle_Loop_12s_48k.wav', label: 'V8 Muscle · Leerlauf 12 s', bytes: 2304044 },
  { id: 'v8-load', file: 'KFB_V8_Load_Loop_10s_48k.wav', label: 'V8 · Last 10 s', bytes: 1920044 },
  { id: 'v8-rev', file: 'KFB_V8_Rev_Sweep_8s_48k.wav', label: 'V8 · Rev Sweep 8 s', bytes: 1536044 },
  { id: 'steampunk-idle', file: 'KFB_Steampunk_SciFi_Engine_Idle_Loop_12s_48k.wav', label: 'Steampunk SciFi · Leerlauf', bytes: 2304044 },
  { id: 'bigblock', file: 'Vintage_tuned_big-bl_#1-1789885183009.mp3', label: 'Vintage Big-Block', bytes: 37485 }
];

// Der Motorenlauf. Tonhöhe folgt dem Tempo, Pegel folgt Tempo und Gas.
// Bewusst KEIN Beat-Pumpen und kein Zittern — auf Ansage zurückgestellt.
export function createEngineBed(opts = {}) {
  const spec = ENGINE_POOL.find(e => e.id === (opts.id || 'v8-seamless')) || ENGINE_POOL[0];
  const el = new Audio();
  el.crossOrigin = 'anonymous';
  el.loop = true;
  el.preload = 'auto';
  el.src = rawAudio(spec.file);
  el.volume = 0;

  let started = false, muted = false, level = opts.level ?? 0.5;
  let ctx = null, src = null, gain = null, rate = 1;

  // Web Audio nur, wenn es geht. Scheitert es (Herkunft, Richtlinie), läuft
  // das Element blank weiter — der Klang ist Beiwerk, er darf nichts blockieren.
  function wire() {
    if (ctx || !window.AudioContext) return;
    try {
      ctx = new AudioContext();
      src = ctx.createMediaElementSource(el);
      gain = ctx.createGain();
      gain.gain.value = 0;
      src.connect(gain); gain.connect(ctx.destination);
    } catch (e) { ctx = null; }
  }

  return {
    spec, pool: ENGINE_POOL, pin: AUDIO_PIN,
    get started() { return started; },
    // Browser verlangen eine Geste. Der Aufrufer ruft das aus einem Klick heraus.
    async start() {
      wire();
      try {
        if (ctx && ctx.state === 'suspended') await ctx.resume();
        await el.play();
        started = true;
      } catch (e) { started = false; }
      return started;
    },
    stop() { el.pause(); started = false; },
    setMuted(v) { muted = !!v; },
    setLevel(v) { level = Math.max(0, Math.min(1, v)); },
    // speedNorm 0..1, gas true/false, boost true/false
    update(speedNorm, gas, boost) {
      if (!started) return;
      // Tonhöhe: Leerlauf 0,78, Vollgas 1,42, Boost legt nochmal zu.
      // Der Bereich ist bewusst schmal — darüber klingt eine Schleife nach Spielzeug.
      const target = 0.78 + speedNorm * 0.64 + (boost ? 0.12 : 0);
      rate += (target - rate) * 0.08;
      try { el.playbackRate = rate; } catch (e) { /* manche Browser begrenzen */ }
      const want = muted ? 0 : level * (0.26 + speedNorm * 0.62 + (gas ? 0.1 : 0));
      if (gain) gain.gain.value += (want - gain.gain.value) * 0.1;
      else el.volume = Math.max(0, Math.min(1, el.volume + (want - el.volume) * 0.1));
    },
    playbackRate() { return +rate.toFixed(3); }
  };
}
