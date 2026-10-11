// Klang (6) · Steuerung 10.10. spät: ONE AudioContext, three layers after Joyride cologne-audio.v1 (BED / MUSIC / SFX, one
// mixer, owners do not override each other). Template first:
//   · BED   island ambience from the island theme (public/themes/island-themes.json): loops + sparse one-shots, crossfade
//           when the nearest island changes; ducked while music plays
//   · MUSIC song-transport.js (Resident Atlas, LAB PATCH: shared context + MUSIC bus), songs commit-pinned from raw GitHub
//           with the git-blob check; playlists = biome station (HUD R3 BIOME_STATIONS / TRACKS) · Cozy Tunes (island picks
//           first) · cassettes from the backpack (insertTape / ownSong)
//   · SFX   racer sound while driving (race-audio.ts, V-128): engine bed, jingles, contact SFX, Kenney one-shots, tunnel hall
//   · V-129 while driving the radio plays Georg's Suno RoadTrip JukeBox v2 (private local copy), 2.5 s hand-over walk ↔ drive
// The HUD R3 radio is the only control surface (hud.radio events in, setTrack / setSource / setPlaying out). The context
// starts on the first user gesture (browser rule). No private audio is copied: everything loads from its existing location.
import * as ST from './vendor/song-transport.js';
import * as DATA_R3 from '../hud/vendor/kfb-jukebox-data.js';
import { rawUrl, themeFor, type ThemeFile, type IslandTheme } from '../theme/island-theme';
import { createRaceAudio, type RaceAudio } from './race-audio';
const { createSongTransport } = ST as any;
const { TRACKS, BIOME_STATIONS } = DATA_R3 as any;

interface Song { id: string; title: string; artist: string; repoPath?: string; commit?: string; gitBlob?: string; url?: string; name?: string; bpm: number; phaseOffset: number }
interface List { id: string; label: string; sub: string; songs: Song[] }
const XF = 2.5;   // bed crossfade (s); also the radio hand-over walk ↔ drive (V-129)
// V-129: Georg's Suno RoadTrip JukeBox v2 — private, local, gitignored (V-071); 14 mp3 (the m4a twin of Endless Forward Motion B is skipped)
const SUNO_DIR = 'private-audio/suno-roadtrip-jukebox-v2/', SUNO = ['Roadtrip Lift A', 'Endless Forward Motion A', 'Checkpoint Rush A', 'Night Circuit Runner', 'Night Desert Lap A', 'Final Lap Lift A', 'KFB Shepards_Coaster 01',
  'Roadtrip Lift B', 'Endless Forward Motion B', 'Checkpoint Rush B', 'Night Circuit Runner B', 'Night Desert Lap B', 'Final Lap Lift B', 'KFB Shepards_Coaster 02'];
const sunoList = () => ({ id: 'roadtrip', label: 'RoadTrip JukeBox', sub: 'Suno · beim Fahren', songs: SUNO.map((n, i) => ({ id: 'suno-' + i, title: n.replace('KFB ', '').replace('_', ' '), artist: 'Georg · Suno', url: '/' + (SUNO_DIR + n + '.mp3').split('/').map(encodeURIComponent).join('/'), bpm: 110, phaseOffset: 0 })) });

export function createAudioOwner(o: { theme: ThemeFile; radio: any; bag: any; islandId: string }) {
  const T = o.theme;
  let ctx: AudioContext | null = null, master: GainNode, tap: AnalyserNode, tapBuf: Float32Array, trim: GainNode;
  const bus: Record<'bed' | 'music' | 'sfx', GainNode> = {} as any;
  const buffers = new Map<string, Promise<AudioBuffer | null>>();
  const buffer = (id: string) => {
    if (!buffers.has(id)) { const f = T.sounds[id]; buffers.set(id, !f ? Promise.resolve(null) : fetch(rawUrl(T.repo, f)).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error('HTTP ' + r.status)))).then((b) => ctx!.decodeAudioData(b)).catch((e) => { errors.push(id + ': ' + e.message); return null; })); }
    return buffers.get(id)!;
  };
  const errors: string[] = [];
  // loudness: every bed / sprinkle buffer is scaled to one RMS (theme gains are then relative levels; files differ by > 20 dB)
  const NORM_RMS = 0.05, norm = new WeakMap<AudioBuffer, number>();
  const normOf = (b: AudioBuffer) => { let k = norm.get(b); if (k === undefined) { let s = 0, n = 0; for (let c = 0; c < b.numberOfChannels; c++) { const d = b.getChannelData(c); for (let i = 0; i < d.length; i += 4) { s += d[i] * d[i]; n++; } } const rms = Math.sqrt(s / Math.max(1, n)); k = Math.max(0.25, Math.min(8, NORM_RMS / Math.max(1e-4, rms))); norm.set(b, k); } return k; };
  let rec: { r: MediaRecorder; parts: Blob[]; d: MediaStreamAudioDestinationNode; mime: string } | null = null;

  // ---------------- BED ----------------
  type Layer = { id: string; theme: IslandTheme; gain: GainNode; srcs: AudioBufferSourceNode[]; spr: { id: string; gain: number; every: [number, number]; t: number }[] };
  let layer: Layer | null = null, islandId = o.islandId;
  const startBed = (id: string) => {
    if (!ctx) return;
    const th = themeFor(T, id), g = ctx.createGain(); g.gain.value = 0; g.connect(bus.bed);
    const L: Layer = { id: th.id, theme: th, gain: g, srcs: [], spr: th.sound.sprinkles.map((s) => ({ ...s, t: s.every[0] + Math.random() * (s.every[1] - s.every[0]) })) };
    for (const b of th.sound.bed) buffer(b.id).then((buf) => { if (!buf || layer !== L || !ctx) return; const s = ctx.createBufferSource(), sg = ctx.createGain(); s.buffer = buf; s.loop = true; sg.gain.value = b.gain * normOf(buf); s.connect(sg).connect(g); s.start(ctx.currentTime, Math.random() * buf.duration); L.srcs.push(s); });
    g.gain.setTargetAtTime(1, ctx.currentTime, XF / 3);
    const old = layer; layer = L;
    if (old) { old.gain.gain.cancelScheduledValues(ctx.currentTime); old.gain.gain.setTargetAtTime(0, ctx.currentTime, XF / 3); setTimeout(() => { old.srcs.forEach((s) => { try { s.stop(); } catch { /* */ } }); old.gain.disconnect(); }, XF * 2000); }
  };
  const sprinkle = (id: string, gain: number) => buffer(id).then((buf) => { if (!buf || !ctx) return; const s = ctx.createBufferSource(), g = ctx.createGain(), p = ctx.createStereoPanner(); s.buffer = buf; g.gain.value = gain * normOf(buf) * (0.7 + Math.random() * 0.3); p.pan.value = (Math.random() - 0.5) * 1.2; s.connect(g).connect(p).connect(bus.bed); s.start(); });

  // ---------------- MUSIC ----------------
  const trackSong = (id: string): Song | null => { const t = TRACKS[id]; return t ? { id, title: t.title, artist: t.artist, repoPath: t.path, commit: t.commit, gitBlob: T.trackBlobs[id], bpm: t.bpm ?? 100, phaseOffset: 0 } : null; };
  // Cozy Tunes (V-073): the private local copy (public/private-audio, gitignored) — never the public repo; the git-blob check stays
  const cozySong = (id: string): Song | null => { const c = T.cozy[id]; return c ? { id, title: c.title, artist: c.artist, repoPath: c.path, commit: c.commit, gitBlob: c.gitBlob, url: c.local ? '/' + c.local.split('/').map(encodeURIComponent).join('/') : undefined, bpm: 100, phaseOffset: 0 } : null; };
  let lists: List[] = [], active = 'station', idx = 0, transport: any = null, want = false, musicOn = false, lastState = '';
  const buildLists = (th: IslandTheme) => {
    const st = BIOME_STATIONS[th.biome] ?? BIOME_STATIONS.burg, picks = th.sound.cozy, rest = Object.keys(T.cozy).filter((k) => !picks.includes(k));
    const keep = lists.filter((l) => l.id === 'tape' || l.id === 'own');
    lists = [
      { id: 'station', label: st.name, sub: 'Biom-Sender', songs: st.tracks.map(trackSong).filter(Boolean) as Song[] },
      { id: 'cozy', label: 'Cozy Tunes', sub: picks.length + ' für diese Insel', songs: [...picks, ...rest].map(cozySong).filter(Boolean) as Song[] },
      sunoList(),
      ...keep,
    ];
    o.radio.setPlaylists(lists.map((l) => ({ id: l.id, label: l.label, sub: l.sub })), active);
  };
  const cur = () => lists.find((l) => l.id === active) ?? lists[0];
  const show = () => { const l = cur(), s = l?.songs[idx]; o.radio.setSource(l?.label ?? ''); o.radio.setTrack(s ? { title: s.title, artist: s.artist, index: idx, count: l.songs.length } : null); };
  const loadCur = () => {
    const s = cur()?.songs[idx]; show(); if (!s || !ctx) return;
    trim.gain.setTargetAtTime(T.musicGain?.[active] ?? 1, ctx.currentTime, handT ? XF / 8 : 0.15);   // theme: per-playlist level (Cozy is mastered much quieter)
    if (!transport) {
      transport = createSongTransport(s, { audioContext: ctx, output: trim, onEnded: () => step(1) });
      transport.onChange(() => { const st = transport.state; if (st !== lastState) { lastState = st; if (st === 'bereit' && want) transport.play(); if (st.startsWith('fehlt')) { errors.push('music: ' + st); o.radio.setTitle('FEHLT · ' + s.title); } } duck(); });
      if (want) transport.play();
    } else transport.load(s, want);
  };
  const step = (d: number) => { const l = cur(); if (!l?.songs.length) return; idx = (idx + d + l.songs.length) % l.songs.length; loadCur(); };
  const duck = () => { if (ctx) bus.bed.gain.setTargetAtTime(want && musicOn ? 0.55 : 1, ctx.currentTime, 0.4); };
  o.radio.on('music', (e: any) => { musicOn = e.on; if (!e.on && transport) { want = false; transport.pause(); } duck(); });
  o.radio.on('play', (e: any) => { want = e.playing; if (want) { unlock(); if (!transport) loadCur(); else transport.play(); } else transport?.pause(); duck(); });
  o.radio.on('next', () => step(1));
  o.radio.on('prev', () => step(-1));
  o.radio.on('playlist', (e: any) => { active = e.id; idx = 0; loadCur(); });
  // backpack cassettes (HUD R3 bag events): a tape becomes the active playlist; eject goes back to the station
  o.bag.on('insertTape', (e: any) => { const t = e.tape; if (!t || t.blank || !t.tracks?.length) return; lists = lists.filter((l) => l.id !== 'tape'); lists.push({ id: 'tape', label: t.label, sub: 'Kassette', songs: t.tracks.map(trackSong).filter(Boolean) }); active = 'tape'; idx = 0; o.radio.setPlaylists(lists.map((l) => ({ id: l.id, label: l.label, sub: l.sub })), active); unlock(); want = true; musicOn = true; o.radio.setMusic(true); o.radio.setPlaying(true); loadCur(); });
  o.bag.on('eject', () => { lists = lists.filter((l) => l.id !== 'tape'); if (active === 'tape') { active = 'station'; idx = 0; o.radio.setPlaylists(lists.map((l) => ({ id: l.id, label: l.label, sub: l.sub })), active); loadCur(); } });
  o.bag.on('ownSong', (e: any) => { const url = URL.createObjectURL(e.file); lists = lists.filter((l) => l.id !== 'own'); lists.push({ id: 'own', label: 'Eigener Song', sub: 'aus dem Rucksack', songs: [{ id: 'own', title: e.name, artist: 'eigener Song', url, name: e.name, bpm: 100, phaseOffset: 0 }] }); active = 'own'; idx = 0; o.radio.setPlaylists(lists.map((l) => ({ id: l.id, label: l.label, sub: l.sub })), active); unlock(); want = true; musicOn = true; o.radio.setMusic(true); o.radio.setPlaying(true); loadCur(); });

  // ---------------- V-129: radio hand-over walk ↔ drive ----------------
  // entering the car: the music fades out (½ XF), the RoadTrip list starts (music on, playing) and fades in; leaving: the same back to
  // the list, song and play state from before. Radio controls stay live while driving (a pick there is kept for the next drive).
  let driving = false, before: { active: string; idx: number; want: boolean; musicOn: boolean } | null = null, roadIdx = 0, handT: any = null;
  const hand = (fn: () => void) => { if (!ctx) { fn(); return; } trim.gain.cancelScheduledValues(ctx.currentTime); trim.gain.setTargetAtTime(0, ctx.currentTime, XF / 8); clearTimeout(handT); handT = setTimeout(fn, (XF / 2) * 1000); };
  const setDriving = (on: boolean) => {
    if (on === driving) return; driving = on;
    if (on) { before = { active, idx, want, musicOn }; unlock();
      hand(() => { if (!driving) return; active = 'roadtrip'; idx = roadIdx; musicOn = true; want = true; o.radio.setPlaylists(lists.map((l) => ({ id: l.id, label: l.label, sub: l.sub })), active); o.radio.setMusic(true); o.radio.setPlaying(true); loadCur(); duck(); }); }
    else { if (active === 'roadtrip') roadIdx = idx; const b = before; before = null;
      hand(() => { if (driving || !b) return; active = b.active; idx = b.idx; want = b.want; musicOn = b.musicOn; o.radio.setPlaylists(lists.map((l) => ({ id: l.id, label: l.label, sub: l.sub })), active); o.radio.setMusic(musicOn); o.radio.setPlaying(want); if (want) loadCur(); else { transport?.pause(); show(); } duck(); }); }
  };
  let racer: RaceAudio | null = null, racerOpts: any = null;

  // ---------------- context: first user gesture ----------------
  function unlock() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    ctx = new AudioContext();
    master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination);
    tap = ctx.createAnalyser(); tap.fftSize = 2048; tapBuf = new Float32Array(tap.fftSize); master.connect(tap);
    for (const k of ['bed', 'music', 'sfx'] as const) { bus[k] = ctx.createGain(); bus[k].connect(master); }
    bus.music.gain.value = 0.75;
    trim = ctx.createGain(); trim.connect(bus.music);
    startBed(islandId);
  }
  const gesture = () => unlock();
  addEventListener('pointerdown', gesture, true); addEventListener('keydown', gesture, true);
  buildLists(themeFor(T, islandId)); show();

  return {
    unlock,
    /** nearest island changed (or ?soundIsland=): bed crossfades, station / Cozy picks follow the island's theme */
    setIsland(id: string) { const th = themeFor(T, id); if (th.id === themeFor(T, islandId).id) return; islandId = id; buildLists(th); if (active === 'station' || active === 'cozy') { idx = 0; if (want) loadCur(); else show(); } startBed(id); },
    update(dt: number) {
      if (!ctx || !layer) return;
      for (const s of layer.spr) { s.t -= dt; if (s.t <= 0) { sprinkle(s.id, s.gain); s.t = s.every[0] + Math.random() * (s.every[1] - s.every[0]); } }
      transport?.tick(dt);
    },
    /** V-129: FAHREN on / off (travel mode AUTO) → radio hand-over to the RoadTrip list and back */
    setDriving,
    /** V-128: racer sound per frame (engine, contacts, one-shots, jingles, tunnel hall); created on the shared context once it runs */
    racer(dt: number, d: any, inp: any, tunnel: number, on: boolean, opts?: { joints?: any[]; ds?: number; length?: number }) { if (opts) racerOpts = opts; if (!ctx) return; if (!racer) racer = createRaceAudio(ctx, bus.sfx, racerOpts ?? {}); racer.update(dt, d, inp, tunnel, on); },
    racerState: () => (racer ? racer.state() : null),
    /** probes (parity): start a playlist as the radio would (music on + play) */
    debugPlay(listId: string) { unlock(); active = listId; idx = 0; musicOn = true; want = true; o.radio.setMusic(true); o.radio.setPlaying(true); loadCur(); duck(); },
    /** probes: record the master mix (same context, a MediaStream tap) for the acceptance video's sound track */
    recordStart() { if (!ctx) return false; const d = ctx.createMediaStreamDestination(); master.connect(d); const mime = ['audio/mp4;codecs=mp4a.40.2', 'audio/mp4', 'audio/webm;codecs=opus'].find((m) => MediaRecorder.isTypeSupported(m))!; const R = (rec = { r: new MediaRecorder(d.stream, { mimeType: mime }), parts: [] as Blob[], d, mime }); R.r.ondataavailable = (e) => { if (e.data.size) R.parts.push(e.data); }; R.r.start(500); return mime; },
    async recordStop() { if (!rec) return null; const R = rec; rec = null; R.r.stop(); await new Promise((r) => (R.r.onstop = r)); master.disconnect(R.d); const u = new Uint8Array(await new Blob(R.parts, { type: R.mime }).arrayBuffer()); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000)); return { mime: R.mime, b64: btoa(s) }; },
    /** V-137 probes: set one bus level (bed / music / sfx) */
    debugBus(k: 'bed' | 'music' | 'sfx', g: number) { if (ctx) bus[k].gain.setValueAtTime(g, ctx.currentTime); },
    /** V-137 probes: raw PCM of the master for `sec` seconds (no codec) → click detector: 1-ms frames of high-passed energy, a click = a frame
     *  > 12× the median of its ±50 ms neighbourhood and > 1e-6 absolute; returns the click times (s) and the loudness */
    async capturePcm(sec: number) { if (!ctx) return null; const sp = ctx.createScriptProcessor(4096, 1, 1), z = ctx.createGain(); z.gain.value = 0; const buf: Float32Array[] = [];
      sp.onaudioprocess = (e) => { buf.push(new Float32Array(e.inputBuffer.getChannelData(0))); }; master.connect(sp); sp.connect(z).connect(ctx.destination);
      await new Promise((r) => setTimeout(r, sec * 1000)); master.disconnect(sp); sp.disconnect(); const n = buf.reduce((a, b) => a + b.length, 0), x = new Float32Array(n); let o = 0; for (const b of buf) { x.set(b, o); o += b.length; }
      const sr = ctx.sampleRate, F = Math.round(sr / 1000), nf = Math.floor(n / F), E = new Float32Array(nf); for (let f = 0; f < nf; f++) { let e = 0; for (let i = f * F + 2; i < (f + 1) * F; i++) { const d = x[i] - 2 * x[i - 1] + x[i - 2]; e += d * d; } E[f] = e / F; }
      const clicks: number[] = []; for (let f = 50; f < nf - 50; f++) { const nb = Array.from(E.subarray(f - 50, f + 50)).sort((a, b) => a - b), med = nb[50]; if (E[f] > 12 * med && E[f] > 1e-6 && (!clicks.length || f / 1000 - clicks[clicks.length - 1] > 0.02)) clicks.push(+(f / 1000).toFixed(3)); }
      let rms = 0; for (let i = 0; i < n; i++) rms += x[i] * x[i]; return { seconds: +(n / sr).toFixed(2), rms: +Math.sqrt(rms / n).toFixed(4), clicks: clicks.length, at: clicks.slice(0, 40) }; },
    /** probes / ?debug: one context, bus levels, current bed and song */
    state() {
      let rms = 0; if (ctx && tap) { tap.getFloatTimeDomainData(tapBuf as any); let s = 0; for (let i = 0; i < tapBuf.length; i++) s += tapBuf[i] * tapBuf[i]; rms = Math.sqrt(s / tapBuf.length); }
      const s = cur()?.songs[idx];
      return { context: ctx ? ctx.state : 'none', contexts: ctx ? 1 : 0, island: layer?.id ?? themeFor(T, islandId).id, biome: layer?.theme.biome ?? null, bed: layer?.theme.sound.bed.map((b) => b.id) ?? [], bedLoaded: layer?.srcs.length ?? 0, heuristic: layer?.theme.sound.heuristic ?? null,
        driving, music: { on: musicOn, want, list: active, index: idx, title: s?.title ?? null, state: transport?.state ?? 'idle', blobOk: transport?.blobOk ?? null, time: transport ? +transport.songTime().toFixed(2) : 0 },
        masterRms: +rms.toFixed(4), errors: errors.slice() };
    },
  };
}
export type AudioOwner = ReturnType<typeof createAudioOwner>;
