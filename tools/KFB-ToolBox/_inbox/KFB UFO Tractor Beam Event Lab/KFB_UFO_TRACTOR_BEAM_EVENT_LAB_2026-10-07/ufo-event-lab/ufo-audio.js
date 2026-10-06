/* KFB · UFO Tractor Beam Event Lab · PREVIEW AUDIO ONLY
   One AudioContext for this isolated proof. Not a mixer, not a second runtime audio owner.
   Runtime integration hands the semantic hooks below to the KFB Audio owner instead. */
const REPO = 'georg-doc/kayfabizarro', APIN = 'd04e0b8f2c2c34e9176f7eb75a77f19487d17698';
const enc = (p) => p.split('/').map(encodeURIComponent).join('/');
const urls = (path) => [`https://cdn.jsdelivr.net/gh/${REPO}@${APIN}/${enc(path)}`, `https://raw.githubusercontent.com/${REPO}/${APIN}/${enc(path)}`];
const KD = 'media/3D_Assets/Audio/kenney_digital-audio/Audio/', SP = 'media/3D_Assets/Audio/400 Sounds Pack/';

/* exactly the shortlist (UFO_EVENT_AUDIO_DONOR_SHORTLIST_2026-10-06.md), nothing else */
const list = [];
const kd = (n) => list.push({ id: n, label: 'kenney · ' + n, path: KD + n + '.ogg' });
for (let i = 1; i <= 5; i++) kd('phaseJump' + i);
for (let i = 1; i <= 7; i++) kd('phaserUp' + i);
for (let i = 1; i <= 3; i++) kd('phaserDown' + i);
for (let i = 1; i <= 12; i++) kd('powerUp' + i);
for (let i = 1; i <= 5; i++) kd('spaceTrash' + i);
['zap1', 'zap2', 'zapThreeToneDown', 'zapThreeToneUp', 'zapTwoTone', 'zapTwoTone2', 'lowDown', 'lowRandom', 'lowThreeTone'].forEach(kd);
const sp = (dir, n) => list.push({ id: n, label: '400 · ' + n, path: SP + dir + '/' + n + '.wav' });
['white_noise_long', 'white_noise_short', 'whoosh_1', 'whoosh_2', 'ghost_long', 'elastic_twang'].forEach((n) => sp('Other', n));
['hydraulic_up', 'hydraulic_down', 'drill_whizz', 'razor_buzz'].forEach((n) => sp('Machines', n));
sp('Environment', 'air_burst');
['wobble', 'grow_big', 'power_up', 'power_down', 'undesired_effect'].forEach((n) => sp('Retro', n));
export const AUDIO_POOL = list;
export const AUDIO_PIN = APIN;
const POOL = Object.fromEntries(list.map((s) => [s.id, s]));

/* proposal only: chosen from the shortlist's "likely uses", NOT auditioned by ear yet */
export const AUDIO_EVENTS = [
  { hook: 'ufo.arrive', file: 'whoosh_1', layer: '', gain: 0.55, rate: 0.85, why: 'Anflug als Luftbewegung, kein Sci-Fi-Fanfare' },
  { hook: 'ufo.hover', file: 'white_noise_long', layer: '', gain: 0.1, loop: 'lowpass', f: [380, 380], why: 'Schwebe-Bett: Rauschen tief gefiltert, leise' },
  { hook: 'beam.lock', file: 'lowThreeTone', layer: '', gain: 0.5, rate: 1, why: 'Tiefer Akzent, danach Stille vor dem Strahl' },
  { hook: 'beam.charge', file: 'phaserUp3', layer: '', gain: 0.5, rate: 1, why: 'Aufladung = steigender Ton' },
  { hook: 'beam.transfer.start', file: 'phaseJump2', layer: '', gain: 0.55, rate: 1, why: 'Interpunktion am Materialbruch' },
  { hook: 'beam.transfer.loop', file: 'white_noise_long', layer: '', gain: 0.14, loop: 'bandpass', f: [500, 2400], why: 'Sog: Bandpass steigt mit dem Fortschritt' },
  { hook: 'beam.transfer.complete', file: 'zapTwoTone', layer: 'air_burst', gain: 0.5, rate: 1, why: 'Schluck + Luftstoß am Rumpf' },
  { hook: 'ufo.drop', file: 'phaserDown2', layer: 'elastic_twang', gain: 0.5, rate: 1, why: 'Rückgabe fällt; Twang beim Knet-Pop' },
  { hook: 'ufo.depart', file: 'phaserUp6', layer: 'whoosh_2', gain: 0.45, rate: 1, why: 'Abflug steigt, Luft zieht nach' }
];

async function fetchFirst(us) {
  let err;
  for (const u of us) { try { const r = await fetch(u); if (!r.ok) throw new Error(r.status + ' ' + u); return await r.arrayBuffer(); } catch (e) { err = e; } }
  throw err;
}

/* objective measurements, so a choice is never made from the filename alone */
function analyse(b) {
  const d = b.getChannelData(0), n = d.length, bins = 48, wave = new Array(bins).fill(0);
  let peak = 0, sum = 0;
  for (let i = 0; i < n; i++) { const a = Math.abs(d[i]); if (a > peak) peak = a; sum += d[i] * d[i]; const k = Math.min(bins - 1, (i * bins / n) | 0); if (a > wave[k]) wave[k] = a; }
  const zcr = (a, z) => { let c = 0, e = 0; for (let i = a + 1; i < z; i++) { if ((d[i] >= 0) !== (d[i - 1] >= 0)) c++; e += d[i] * d[i]; } return e > 1e-4 * (z - a) ? c / (z - a) : null; };
  const third = (n / 3) | 0, z0 = zcr(0, third), z1 = zcr(n - third, n);
  let trend = 'flat';
  if (z0 && z1) { const r = z1 / z0; trend = r > 1.25 ? 'rising' : r < 0.8 ? 'falling' : 'flat'; }
  const mx = Math.max(1e-6, ...wave);
  return { dur: +b.duration.toFixed(2), peakDb: +(20 * Math.log10(peak || 1e-6)).toFixed(1), rmsDb: +(10 * Math.log10(sum / n || 1e-9)).toFixed(1), trend, wave: wave.map((w) => w / mx) };
}

const LS = 'kfb-ufo-lab-audio-map-v1';
export function createPreviewAudio(onChange) {
  let ctx = null, master = null, on = false;
  const buf = new Map(), pend = new Map(), info = {}, errs = {};
  const saved = (() => { try { return JSON.parse(localStorage.getItem(LS) || 'null'); } catch (e) { return null; } })();
  const map = AUDIO_EVENTS.map((e) => ({ ...e, heard: false, ...(saved && saved[e.hook] ? saved[e.hook] : {}) }));
  const loops = {};
  const save = () => { try { localStorage.setItem(LS, JSON.stringify(Object.fromEntries(map.map((m) => [m.hook, { file: m.file, layer: m.layer, gain: m.gain, heard: m.heard }])))); } catch (e) {} };
  const changed = () => onChange && onChange();

  async function ensure() {
    if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = 0.9; master.connect(ctx.destination); }
    if (ctx.state === 'suspended') await ctx.resume();
  }
  function load(id) {
    if (!id || !POOL[id]) return Promise.resolve(null);
    if (buf.has(id)) return Promise.resolve(buf.get(id));
    if (pend.has(id)) return pend.get(id);
    const p = (async () => {
      try { await ensure(); const ab = await fetchFirst(urls(POOL[id].path)); const b = await ctx.decodeAudioData(ab); buf.set(id, b); info[id] = analyse(b); changed(); return b; }
      catch (e) { errs[id] = String(e.message || e); changed(); return null; }
    })();
    pend.set(id, p); return p;
  }
  function shot(id, gain = 0.5, rate = 1) {
    const b = buf.get(id); if (!b || !ctx) { load(id); return; }
    const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = b; s.playbackRate.value = rate; g.gain.value = gain; s.connect(g).connect(master); s.start();
  }
  function stopLoop(k) { const l = loops[k]; if (l) { try { l.src.stop(); } catch (e) {} l.g.disconnect(); delete loops[k]; } }
  async function startLoop(m) {
    stopLoop(m.hook); const b = await load(m.file); if (!b || !on) return;
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    src.buffer = b; src.loop = true; f.type = m.loop; f.frequency.value = m.f[0]; f.Q.value = m.loop === 'bandpass' ? 1.4 : 0.7; g.gain.value = 0;
    src.connect(f).connect(g).connect(master); src.start(); loops[m.hook] = { src, f, g, m };
  }
  const row = (hook) => map.find((m) => m.hook === hook);

  return {
    get on() { return on; },
    async enable(v) {
      on = v;
      if (v) { await ensure(); await Promise.all(map.flatMap((m) => [load(m.file), load(m.layer)])); map.filter((m) => m.loop).forEach(startLoop); }
      else { Object.keys(loops).forEach(stopLoop); }
      changed();
    },
    /* one-shot for a semantic hook (loops are driven by levels()) */
    hook(h, part = 'all') {
      if (!on) return; const m = row(h); if (!m || m.loop) return;
      if (part !== 'layer') shot(m.file, m.gain, m.rate || 1);
      if (part !== 'main' && m.layer) shot(m.layer, m.gain * 0.8, 1);
    },
    /* continuous levels 0..1 from the event state; k = sweep position 0..1 */
    levels(l) {
      if (!on || !ctx) return; const now = ctx.currentTime;
      for (const [k, lp] of Object.entries(loops)) {
        const lvl = k === 'ufo.hover' ? l.hover : l.transfer;
        lp.g.gain.setTargetAtTime(lvl * lp.m.gain, now, 0.07);
        if (k === 'beam.transfer.loop') lp.f.frequency.setTargetAtTime(lp.m.f[0] + (lp.m.f[1] - lp.m.f[0]) * l.sweep, now, 0.05);
      }
    },
    silence() { if (!ctx) return; for (const lp of Object.values(loops)) lp.g.gain.setTargetAtTime(0, ctx.currentTime, 0.05); },
    async audition(h) { await ensure(); const m = row(h); if (!m) return; await Promise.all([load(m.file), load(m.layer)]); shot(m.file, Math.max(m.gain, 0.35), m.rate || 1); if (m.layer) setTimeout(() => shot(m.layer, m.gain, 1), 120); },
    async previewFile(id) { await ensure(); await load(id); shot(id, 0.5, 1); },
    assign(h, key, val) {
      const m = row(h); if (!m) return; m[key] = key === 'gain' ? +val : val; if (key !== 'heard') m.heard = false;
      save(); if (key === 'file' || key === 'layer') { load(val); if (m.loop && on && key === 'file') startLoop(m); }
      changed();
    },
    reset() { try { localStorage.removeItem(LS); } catch (e) {} map.forEach((m, i) => Object.assign(m, AUDIO_EVENTS[i], { heard: false })); if (on) map.filter((m) => m.loop).forEach(startLoop); changed(); },
    rows: () => map.map((m) => ({ ...m, info: info[m.file] || null, layerInfo: m.layer ? info[m.layer] || null : null, err: errs[m.file] || (m.layer && errs[m.layer]) || null })),
    exportMap: () => ({ status: 'PREVIEW PROPOSAL · runtime routing stays with KFB Audio owner', pin: APIN, events: map.map((m) => ({ hook: m.hook, file: POOL[m.file] && POOL[m.file].path, layer: m.layer ? POOL[m.layer] && POOL[m.layer].path : null, gainSuggestion: m.gain, rateSuggestion: m.rate || 1, loop: m.loop || null, auditionedByEar: !!m.heard, why: m.why, measured: info[m.file] ? { dur: info[m.file].dur, peakDb: info[m.file].peakDb, trend: info[m.file].trend } : null })) }),
    dispose() { Object.keys(loops).forEach(stopLoop); if (ctx) ctx.close(); }
  };
}
