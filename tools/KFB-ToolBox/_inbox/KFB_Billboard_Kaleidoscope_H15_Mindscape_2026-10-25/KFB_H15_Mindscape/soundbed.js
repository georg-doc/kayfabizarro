// KFB H15 · Soundbed: Binaural-Schwebung, Drone, Schellack-Luft, Puls am Engine-Takt, PD-Schellack aus dem Internet Archive.
// Ein AudioContext (von der Engine), ein Ausgang (Engine-Analyser). Keine Tondateien im Projekt: Aufnahmen werden gestreamt.
const SEC = { INTRO: 4, VERSE: 6, BUILD: 7.83, DROP: 10, BREAK: 3, OUTRO: 2.5 };
function rng(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function noiseBuf(ac, sec, crackle) {
  const n = Math.floor(ac.sampleRate * sec), b = ac.createBuffer(2, n, ac.sampleRate);
  for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); let p = 0; for (let i = 0; i < n; i++) { const w = Math.random() * 2 - 1; p = .97 * p + .03 * w; d[i] = crackle ? (Math.random() < .0006 ? (Math.random() * 2 - 1) : p * .4) : w; } }
  return b;
}
function impulse(ac, sec) {
  const sr = Math.min(ac.sampleRate, 24000), n = Math.floor(sr * sec), b = ac.createBuffer(2, n, sr);
  for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3); }
  return b;
}

export function createSoundbed(ac, out, seed, records) {
  const r = rng(seed >>> 0), T = () => ac.currentTime, tc = (p, v, k) => p.setTargetAtTime(v, T(), k);
  const master = ac.createGain(); master.gain.value = 0; master.connect(out);
  const verb = ac.createConvolver(); verb.buffer = impulse(ac, 1.6); const verbG = ac.createGain(); verbG.gain.value = .5; verb.connect(verbG).connect(master);
  // Binaural: Träger links, Träger + Δ rechts, Δ je Sektion
  const carrier = 140 + Math.floor(r() * 6) * 20;
  const bL = ac.createOscillator(), bR = ac.createOscillator(), mg = ac.createChannelMerger(2), bG = ac.createGain();
  bL.frequency.value = carrier; bR.frequency.value = carrier + SEC.INTRO; bG.gain.value = .055;
  bL.connect(mg, 0, 0); bR.connect(mg, 0, 1); mg.connect(bG).connect(master); bL.start(); bR.start();
  // Drone: Grundton = halber Träger, Quinte, Oktave durch Tiefpass mit langsamer Bewegung
  const root = carrier / 2, lp = ac.createBiquadFilter(), dG = ac.createGain(); lp.type = 'lowpass'; lp.Q.value = 5; lp.frequency.value = 400; dG.gain.value = .05;
  const dro = [[root, 'sine', 0, .9], [root * 1.5, 'triangle', 6, .35], [root * 2, 'sawtooth', -5, .12], [root * 1.002, 'sawtooth', 3, .1]].map(([f, t, det, g]) => { const o = ac.createOscillator(), gg = ac.createGain(); o.type = t; o.frequency.value = f; o.detune.value = det; gg.gain.value = g; o.connect(gg).connect(lp); o.start(); return o; });
  const lfo = ac.createOscillator(), lfoG = ac.createGain(); lfo.frequency.value = .05 + r() * .05; lfoG.gain.value = 180; lfo.connect(lfoG).connect(lp.frequency); lfo.start();
  lp.connect(dG); dG.connect(master); dG.connect(verb);
  // Luft: gefiltertes Rauschen mit Knistern (Schellack)
  const air = ac.createBufferSource(), bp = ac.createBiquadFilter(), aG = ac.createGain(); air.buffer = noiseBuf(ac, 3, true); air.loop = true; bp.type = 'bandpass'; bp.frequency.value = 2400; bp.Q.value = .6; aG.gain.value = .05;
  air.connect(bp).connect(aG).connect(master); air.start();
  // Aufnahmen
  const rec = { cur: null, list: records || [], idx: Math.floor(r() * Math.max(1, (records || []).length)), state: 'aus', title: '', analysed: false, err: null, next: 0 };
  const recBus = ac.createGain(), hp = ac.createBiquadFilter(), lp2 = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 140; lp2.type = 'lowpass'; lp2.frequency.value = 4200; recBus.gain.value = .42;
  hp.connect(lp2).connect(recBus); recBus.connect(master); recBus.connect(verb);
  const fileFor = e => { const id = (/details\/([^/?#]+)/.exec(e.seite) || [])[1]; if (!id) return Promise.reject(new Error('keine IA-Kennung'));
    return fetch('https://archive.org/metadata/' + id).then(x => x.json()).then(j => { const fs = (j.files || []).filter(f => /\.mp3$/i.test(f.name)); if (!fs.length) throw new Error('keine MP3'); const f = fs[Math.floor(r() * Math.min(fs.length, 12))]; return 'https://archive.org/download/' + id + '/' + f.name.split('/').map(encodeURIComponent).join('/'); }); };
  function playNext() {
    if (!rec.list.length || !api.on) return; const e = rec.list[rec.idx % rec.list.length]; rec.idx += 1 + Math.floor(r() * 5); rec.state = 'lädt'; rec.title = e.titel; rec.err = null;
    fileFor(e).then(url => {
      if (!api.on) return; const el = new Audio(); el.crossOrigin = 'anonymous'; el.preload = 'auto'; el.preservesPitch = false; el.playbackRate = .88 + r() * .18;
      const g = ac.createGain(); g.gain.value = 0; let src = null; try { src = ac.createMediaElementSource(el); src.connect(g); g.connect(hp); } catch (err) { src = null; }
      el.addEventListener('playing', () => { rec.state = 'läuft'; rec.analysed = !!src; tc(g.gain, 1, 1.2); });
      el.addEventListener('error', () => { rec.err = 'nicht ladbar'; rec.state = 'Fehler'; setTimeout(playNext, 1500); });
      el.addEventListener('ended', () => playNext());
      const old = rec.cur; rec.cur = { el, g, e, url }; if (old) { tc(old.g.gain, 0, 1.4); setTimeout(() => { old.el.pause(); old.el.src = ''; }, 6000); }
      el.src = url; el.currentTime = 0; el.play().catch(err => { rec.err = String(err && err.message || err); });
      rec.next = T() + 45 + r() * 50;
    }).catch(err => { rec.err = String(err && err.message || err); rec.state = 'Fehler'; setTimeout(playNext, 2500); });
  }
  let lastSec = 'INTRO';
  const api = {
    on: false, carrier, rec,
    start() { api.on = true; ac.resume && ac.resume(); tc(master.gain, .9, .8); if (!rec.cur) playNext(); else rec.cur.el.play().catch(() => {}); },
    stop() { api.on = false; tc(master.gain, 0, .4); if (rec.cur) setTimeout(() => { if (!api.on && rec.cur) rec.cur.el.pause(); }, 1500); },
    binaural(on) { tc(bG.gain, on ? .055 : 0, .3); api.bin = on; },
    section(sec, e) {
      if (sec !== lastSec) { lastSec = sec; tc(bR.frequency, carrier + (SEC[sec] || 6), 1.5); }
      tc(lp.frequency, 260 + 2400 * e * e, .6); tc(dG.gain, .035 + .05 * e, .8); tc(aG.gain, .03 + .04 * (1 - e), 1); tc(recBus.gain, sec === 'DROP' ? .55 : sec === 'BREAK' ? .25 : .42, 1.2);
      if (api.on && rec.cur && T() > rec.next) playNext();
    },
    pulse(e, down, sec) {
      if (!api.on || sec === 'BREAK' || e < .25) return; const t = T() + .02, o = ac.createOscillator(), g = ac.createGain();
      o.frequency.setValueAtTime(down ? 96 : 80, t); o.frequency.exponentialRampToValueAtTime(38, t + .22); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime((down ? .5 : .32) * e * e, t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + .35);
      o.connect(g).connect(master); o.start(t); o.stop(t + .4);
      if (e > .6 && !down) { const n = ac.createBufferSource(), f = ac.createBiquadFilter(), ng = ac.createGain(); n.buffer = air.buffer; f.type = 'highpass'; f.frequency.value = 7000; ng.gain.setValueAtTime(.12 * e, t + .01); ng.gain.exponentialRampToValueAtTime(.0001, t + .08); n.connect(f).connect(ng).connect(master); n.start(t, Math.random() * 2, .1); }
    },
    status() { const d = SEC[lastSec] || 6; return { carrier, delta: d, sec: lastSec, rec: rec.title, recState: rec.state, analysed: rec.analysed, err: rec.err }; }
  };
  return api;
}
