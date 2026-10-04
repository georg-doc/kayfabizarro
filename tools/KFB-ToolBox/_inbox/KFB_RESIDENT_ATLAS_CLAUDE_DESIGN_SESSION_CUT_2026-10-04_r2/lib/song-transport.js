/* KFB · Song-Transport · EINE Uhr für eine Resident-Performance
   Dieselbe Semantik wie die Band-Werkstatt (S8) und MUSIC-PERF-01: der Song ist die Master-Uhr,
   beatPos = (songTime − phase) · bpm / 60. Gelesen wird der `song`-Block aus der Band-Moduldatei,
   nicht kopiert — damit gibt es genau eine Quelle für BPM, Phase und Blob.
   S40e · Rotation: `load(song)` tauscht den Titel, die Uhr bleibt EINE. Trägt ein Titel eine
   gemessene `tempoMap` ([Zeit s, Schlag]-Anker), wird zwischen den Ankern linear interpoliert —
   so folgt die Uhr Titeln, deren Tempo driftet. Ohne Karte gilt die alte Formel unverändert.
   Kein zweiter Mixer, keine zweite Musiklogik: diese Datei spielt eine Datei ab und rechnet
   Schläge. Was sich bewegt, gehört dem Verbraucher. */
const rawUrl = (c, p) => `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${c}/${p.split('/').map(encodeURIComponent).join('/')}`;
const mod = (a, n) => ((a % n) + n) % n;

export async function loadSongDef(url, key = 'song') {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error('song def HTTP ' + r.status);
  const d = await r.json();
  return { ...d[key], from: url + '#' + key };
}

export async function loadPlaylist(url) {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error('playlist HTTP ' + r.status);
  const d = await r.json();
  const byId = new Map(d.tracks.map((t) => [t.id, { ...t, from: url + '#' + t.id }]));
  return { ...d, list: (d.rotation || d.tracks.map((t) => t.id)).map((id) => byId.get(id)).filter(Boolean) };
}

/* Anker → Schlag und zurück. Außerhalb der Karte mit der Steigung des Randsegments. */
function mapper(map) {
  if (!map || map.length < 2) return null;
  const n = map.length;
  const seg = (arr, x, k) => { let lo = 0, hi = n - 2; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (arr[m][k] <= x) lo = m; else hi = m - 1; } return lo; };
  const beatAt = (t) => { const i = seg(map, t, 0), a = map[i], b = map[i + 1]; return a[1] + (t - a[0]) * (b[1] - a[1]) / (b[0] - a[0]); };
  const timeAt = (bp) => { const i = seg(map, bp, 1), a = map[i], b = map[i + 1]; return a[0] + (bp - a[1]) * (b[0] - a[0]) / (b[1] - a[1]); };
  /* Sekunden je Schlag über ±2 Segmente gemittelt — weniger Stufen für Clips mit nativer Rate */
  const spbAt = (t) => { const i = seg(map, t, 0), a = map[Math.max(0, i - 2)], b = map[Math.min(n - 1, i + 3)]; return (b[0] - a[0]) / (b[1] - a[1]); };
  return { beatAt, timeAt, spbAt };
}

export function createSongTransport(song, { storeKey = null, onEnded = null } = {}) {
  const keyOf = (s) => (!storeKey ? null : s.id && s.id !== 'rubbish-groove' ? storeKey + '.' + s.id : storeKey);
  const load = (s) => { try { const k = keyOf(s); return k ? JSON.parse(localStorage.getItem(k) || 'null') : null; } catch { return null; } };
  const clock = { bpm: 100, phase: 0, beatsPerBar: 4 };
  const save = () => { try { const k = keyOf(T.song); if (k) localStorage.setItem(k, JSON.stringify({ bpm: clock.bpm, phase: clock.phase, beatsPerBar: clock.beatsPerBar })); } catch {} };
  const audio = new Audio();
  audio.preload = 'auto';
  let state = 'lädt', blobHash = null, blobOk = null, playing = false, freeT = 0, map = null, gen = 0, url = null;
  const listeners = new Set();
  const emit = () => listeners.forEach((f) => f());
  async function fetchSong(s, my, wantPlay) {
    try {
      const r = await fetch(rawUrl(s.commit, s.repoPath));
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const buf = new Uint8Array(await r.arrayBuffer());
      if (my !== gen) return;
      const head = new TextEncoder().encode(`blob ${buf.length}\0`);
      const all = new Uint8Array(head.length + buf.length); all.set(head); all.set(buf, head.length);
      blobHash = [...new Uint8Array(await crypto.subtle.digest('SHA-1', all))].map((x) => x.toString(16).padStart(2, '0')).join('');
      if (my !== gen) return;
      blobOk = blobHash === s.gitBlob;
      if (url) URL.revokeObjectURL(url);
      url = URL.createObjectURL(new Blob([buf], { type: 'audio/mpeg' }));
      audio.src = url;
      state = 'bereit';
      audio.currentTime = 0;
      if (wantPlay) T.play();
    } catch (e) { if (my === gen) state = 'fehlt · ' + (e.message || e); }
    emit();
  }
  function setSong(s, wantPlay = false) {
    gen++;
    audio.pause(); playing = false;
    T.song = s;
    Object.assign(clock, { bpm: s.bpm, phase: s.phaseOffset, beatsPerBar: s.beatsPerBar || 4 }, load(s) || {});
    map = mapper(s.tempoMap);
    state = 'lädt'; blobHash = null; blobOk = null; freeT = 0;
    emit();
    fetchSong(s, gen, wantPlay);
  }
  audio.addEventListener('ended', () => { playing = false; emit(); if (onEnded) onEnded(T.song); });
  let actx = null, anl = null, abuf = null, fbuf = null, level = 0.6, bass = 0.5;
  function ensureAnalyser() {
    if (actx || state !== 'bereit') return;
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
      const src = actx.createMediaElementSource(audio);
      anl = actx.createAnalyser(); anl.fftSize = 1024; abuf = new Float32Array(anl.fftSize); fbuf = new Uint8Array(anl.frequencyBinCount);
      src.connect(anl); anl.connect(actx.destination);
    } catch { actx = null; }
  }
  const songTime = () => (state === 'bereit' ? audio.currentTime : freeT);
  const setSongTime = (t) => { if (state === 'bereit') audio.currentTime = Math.max(0, t); else freeT = Math.max(0, t); };
  /* Nachstellung der Phase wirkt mit Karte als Zeitversatz gegen die gemessenen Anker */
  const shift = () => clock.phase - T.song.phaseOffset;
  const beatPosAt = (t) => (map ? map.beatAt(t - shift()) : (t - clock.phase) * clock.bpm / 60);
  const spbAt = (t) => (map ? map.spbAt(t - shift()) : 60 / clock.bpm);
  const T = {
    song, clock,
    get playing() { return playing; }, get state() { return state; }, get blobOk() { return blobOk; }, get blobHash() { return blobHash; },
    get duration() { return audio.duration || T.song.duration || 120; },
    get mapped() { return !!map; },
    onChange(f) { listeners.add(f); return () => listeners.delete(f); },
    songTime,
    beatPos: () => beatPosAt(songTime()),
    secPerBeat: () => spbAt(songTime()),
    localBpm: () => 60 / spbAt(songTime()),
    load: setSong,
    level() {
      if (!anl || !playing) return level;
      anl.getFloatTimeDomainData(abuf);
      let s = 0; for (let i = 0; i < abuf.length; i++) s += abuf[i] * abuf[i];
      const v = Math.min(1, Math.sqrt(s / abuf.length) / 0.25);
      level += (v - level) * (v > level ? 0.35 : 0.08);
      return level;
    },
    /* Bass: Mittel der untersten Frequenzbänder (~40–170 Hz bei 1024er FFT), schnell rauf, langsam runter.
       Ohne Analyser (kein Play, keine Geste) bleibt ein neutraler Wert stehen — die Beat-Hüllkurve trägt dann allein. */
    bass() {
      if (!anl || !playing) return bass;
      anl.getByteFrequencyData(fbuf);
      const lo = Math.max(1, Math.round(40 / (actx.sampleRate / anl.fftSize))), hi = Math.max(lo + 1, Math.round(170 / (actx.sampleRate / anl.fftSize)));
      let s = 0; for (let i = lo; i <= hi; i++) s += fbuf[i];
      const v = Math.min(1, s / ((hi - lo + 1) * 210));
      bass += (v - bass) * (v > bass ? 0.5 : 0.12);
      return bass;
    },
    /* ohne Audiodatei läuft die Uhr frei weiter — der Host treibt sie mit tick(dt) */
    tick(dt) { if (playing && state !== 'bereit') freeT += dt; },
    play() { playing = true; ensureAnalyser(); if (actx && actx.state === 'suspended') actx.resume(); if (state === 'bereit') audio.play().catch(() => { playing = false; emit(); }); emit(); },
    pause() { playing = false; audio.pause(); emit(); },
    toggle() { playing ? T.pause() : T.play(); },
    restart() { setSongTime(map ? T.seekTimeOfBeat(0) : clock.phase); emit(); },
    seek(t) { setSongTime(t); emit(); },
    seekFrac(k) { setSongTime(k * T.duration); emit(); },
    seekTimeOfBeat(b) { return map ? map.timeAt(b) + shift() : clock.phase + b * 60 / clock.bpm; },
    seekBeat(b) { setSongTime(T.seekTimeOfBeat(b)); emit(); },
    nudgePhase(d) { clock.phase = +(clock.phase + d).toFixed(3); save(); emit(); },
    /* Taktanfang um ganze Schläge verschieben — die gemessene Stelle bleibt, nur die Zählung wandert */
    nudgeBeat(n) { T.nudgePhase(n * spbAt(songTime())); },
    resetClock() { clock.bpm = T.song.bpm; clock.phase = T.song.phaseOffset; save(); emit(); },
    now() {
      const bp = T.beatPos(), bpb = clock.beatsPerBar;
      return { time: songTime(), dur: audio.duration || 0, playing, beatPos: bp, bar: Math.floor(bp / bpb) + 1, beat: Math.floor(mod(bp, bpb)) + 1, bpm: map ? +T.localBpm().toFixed(1) : clock.bpm, phase: clock.phase, shift: +shift().toFixed(3), mapped: !!map };
    },
    dispose() { T.pause(); audio.src = ''; if (url) URL.revokeObjectURL(url); if (actx) actx.close(); listeners.clear(); }
  };
  setSong(song);
  return T;
}
