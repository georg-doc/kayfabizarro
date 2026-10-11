// V-128 / V-129 racer sound (Vorlage-Zeile 11.10., Steuerung: freigegeben). Everything on the Lab's ONE AudioContext, into the SFX bus:
//   · engine bed   J17 lab-hud/cologne-audio.v1.js createEngineBed(): pool file v8-seamless (AUDIO_PIN 26c00b98), rate 0.78 + v·0.64
//                  (+0.12 boost), level 0.5·(0.26 + v·0.62 + gas 0.1), both eased per update exactly as there. Only change: an
//                  AudioBufferSource loop in the Lab context instead of an <audio> element with its own context.
//   · jingles      J17 lab-hud/jingles.v1.js (JINGLE_PIN 7eebc7ca, Kenney CC0): checkpoint = random of 85, finish = jingles_STEEL00.
//                  Lab: decoded into the context (not new Audio()), level 0.55 as there.
//   · contacts     KFB Stunt Car Race race-audio-contact-lab/contact-audio-engine.mjs (vendored, LAB PATCH C1): tire_squeal while
//                  drifting, body_scrape while at the wall, impact() on a barrier hit (synth + Kenney impactMetal, a568f6f0).
//   · one-shots    race-audio-runner-lab (REV 29aac106, Kenney CC0): boost laserSmall_002, take-off forceField_000, landing
//                  impactBell_heavy_004.
//   · tunnel hall  NEW (no template found; Steuerung: yes): ConvolverNode with a short synthetic impulse response (1.4 s, decaying
//                  noise, darkened), as a send from the racer sound only, faded in by the tunnel share.
// Checkpoints: the ring has no gates; a checkpoint is the start of each island piece (joints 'isle_*'), the finish the start/finish seam.
import { KFBContactAudioEngine } from './vendor/contact-audio-engine.mjs';

const GH = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/';
const enc = (p: string) => p.split('/').map(encodeURIComponent).join('/');
const ENGINE_URL = GH + '26c00b98a60ec6346810f6777c1b7873600e1767/' + enc('media/3D_Assets/Audio/KFB Racer/Seamless_10–12_secon_#1-1789884544910.mp3');
const JPIN = '7eebc7cad1488f2c2bf37328e86cd088834f9fa9', JDIR = 'media/3D_Assets/Audio/kenney_music-jingles/Audio/';
const JFAM = [['8-Bit jingles', 'RETRO'], ['Hit jingles', 'HIT'], ['Pizzicato jingles', 'PIZZI'], ['Sax jingles', 'SAX'], ['Steel jingles', 'STEEL']];
const JPOOL = JFAM.flatMap(([dir, tag]) => Array.from({ length: 17 }, (_, i) => GH + JPIN + '/' + enc(JDIR + dir + '/jingles_' + tag + String(i).padStart(2, '0') + '.ogg')));
const JFINISH = GH + JPIN + '/' + enc(JDIR + 'Steel jingles/jingles_STEEL00.ogg');
const REV = GH + '29aac1061bdd73736351cb856fa9f1e322478abc/';
const ONE = { boost: REV + 'media/3D_Assets/Audio/kenney_sci-fi-sounds/Audio/laserSmall_002.ogg', jump: REV + 'media/3D_Assets/Audio/kenney_sci-fi-sounds/Audio/forceField_000.ogg', land: REV + 'media/3D_Assets/Audio/kenney_impact-sounds/Audio/impactBell_heavy_004.ogg' };
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));

export function createRaceAudio(ctx: AudioContext, out: AudioNode, o: { joints?: { index: number; piece: string }[]; ds?: number; length?: number } = {}) {
  // dry → out; dry → hall → wet → out (the hall only hears the racer sound)
  const dry = ctx.createGain(), wet = ctx.createGain(), hall = ctx.createConvolver(); dry.connect(out); dry.connect(hall); hall.connect(wet); wet.connect(out); wet.gain.value = 0;
  { const sr = ctx.sampleRate, n = Math.round(sr * 1.4), ir = ctx.createBuffer(2, n, sr); let seed = 0x4b464252;
    const rnd = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return ((seed >>> 0) / 4294967296) * 2 - 1; };
    for (let c = 0; c < 2; c++) { const d = ir.getChannelData(c); let lp = 0; for (let i = 0; i < n; i++) { const t = i / sr; lp += (rnd() - lp) * 0.35; d[i] = lp * Math.exp(-t * 4.2) * (t < 0.012 ? t / 0.012 : 1); } }
    hall.buffer = ir; }
  const bufs = new Map<string, Promise<AudioBuffer | null>>(), errors: string[] = [];
  const load = (url: string) => { let p = bufs.get(url); if (!p) { p = fetch(url).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error('HTTP ' + r.status)))).then((b) => ctx.decodeAudioData(b)).catch((e) => { errors.push(url.split('/').pop() + ': ' + e); return null; }); bufs.set(url, p); } return p; };
  const shot = (url: string, gain: number) => load(url).then((b) => { if (!b) return; const s = ctx.createBufferSource(), g = ctx.createGain(); s.buffer = b; g.gain.value = gain; s.connect(g).connect(dry); s.start(); });
  // engine bed (cologne-audio.v1 createEngineBed numbers)
  const eg = ctx.createGain(); eg.gain.value = 0; eg.connect(dry); let eSrc: AudioBufferSourceNode | null = null, rate = 1, level = 0.5, gainNow = 0, seam: any = null;
  // V-137 (Georg: Schmatzen / Klicken): the decoded MP3 loop clicked at its seam (period 2.255 s ÷ rate, measured). The loop buffer drops the
  // encoder padding (leading / trailing near-silence) and crossfades its last 60 ms into its first (equal power), so end → start is continuous
  const seamless = (b: AudioBuffer) => { const ch = b.numberOfChannels, sr = b.sampleRate, d0 = b.getChannelData(0), th = 1e-3; let a = 0, z = d0.length - 1; while (a < z && Math.abs(d0[a]) < th) a++; while (z > a && Math.abs(d0[z]) < th) z--;
    const L = z - a + 1, X = Math.min(Math.round(sr * 0.06), Math.floor(L / 4)), N = L - X, out = ctx.createBuffer(ch, N, sr);
    for (let c = 0; c < ch; c++) { const x = b.getChannelData(c).subarray(a, z + 1), y = out.getChannelData(c); for (let i = 0; i < N; i++) y[i] = x[i];
      for (let i = 0; i < X; i++) { const t = i / X, gi = Math.sin(t * Math.PI / 2), go = Math.cos(t * Math.PI / 2); y[i] = x[i] * gi + x[N + i] * go; } }
    seam = { trimmedStart: a, trimmedEnd: d0.length - 1 - z, crossfadeMs: Math.round(X / sr * 1000), loopS: +(N / sr).toFixed(3) }; return out; };
  load(ENGINE_URL).then((b) => { if (!b) return; eSrc = ctx.createBufferSource(); eSrc.buffer = seamless(b); eSrc.loop = true; eSrc.connect(eg); eSrc.start(); });
  const contact = new KFBContactAudioEngine({ hybrid: true, context: ctx, output: dry } as any); let cOk = false; contact.start().then(() => (cOk = true)).catch((e: any) => errors.push('contact: ' + e));
  const J = o.joints ?? [], isleAt = J.filter((j) => /^isle_/.test(j.piece)).map((j) => j.index * (o.ds ?? 0.5)).sort((a, b) => a - b);
  let sPrev: number | null = null, wasBoost = false, onWall = false, drifting = false, driving = false, lastImpact = -1, wallT = 0, offT = 0;   // V-137: impact cooldown 0.25 s, wall contact hysteresis (on after 80 ms, off after 150 ms)
  const M = { jingles: 0, finish: 0, impacts: 0, oneShots: 0, hall: 0 };
  return {
    /** per frame. d = k2b driver; inp = car input (gas); tunnel = tunnel share 0..1; on = FAHREN */
    update(dt: number, d: any, inp: any, tunnel: number, on: boolean) {
      const t = ctx.currentTime;
      if (on !== driving) { driving = on; if (!on && cOk) { contact.stopAll(0.15); onWall = drifting = false; } sPrev = null; }
      const sp = on ? clamp(Math.abs(d.speed) / 41, 0, 1) : 0, boost = on && !!d.boosting, gas = on && !!inp?.gas;
      // cologne-audio.v1 numbers (eased 0.08 / 0.1 per update); V-137: written as short ramps (setTargetAtTime, τ 30 ms) instead of per-frame
      // steps on .value — the steps were audible as zipper noise
      const target = 0.78 + sp * 0.64 + (boost ? 0.12 : 0); rate += (target - rate) * 0.08; if (eSrc) eSrc.playbackRate.setTargetAtTime(rate, t, 0.03);
      const want = on ? level * (0.26 + sp * 0.62 + (gas ? 0.1 : 0)) : 0; gainNow += (want - gainNow) * 0.1; eg.gain.setTargetAtTime(gainNow, t, 0.03);
      wet.gain.setTargetAtTime(on ? clamp(tunnel, 0, 1) * 0.55 : 0, t, 0.25); M.hall = +wet.gain.value.toFixed(3);
      if (!on) return;
      // events of this step (k2b clears them at the start of each step)
      for (const e of d.events ?? []) {
        if (e.type === 'hit' && cOk && t - lastImpact > 0.25) { lastImpact = t; contact.impact({ intensity: clamp(e.energy ?? 0.5, 0, 1), material: 'painted_rail', pan: clamp(-(e.side ?? 0) * 0.6, -1, 1) }); M.impacts++; }
        if (e.type === 'takeoff') { shot(ONE.jump, 0.35); M.oneShots++; }
        if (e.type === 'land') { shot(ONE.land, 0.3 * clamp(e.energy ?? 0.6, 0.3, 1)); M.oneShots++; }
      }
      if (boost && !wasBoost) { shot(ONE.boost, 0.32); M.oneShots++; } wasBoost = boost;
      if (cOk) {
        const dr = !d.fly && d.onGround && (d.drift ?? 0) > 0.2;
        if (dr) { const p = { speed: sp, intensity: clamp(d.drift, 0, 1), slip: clamp(d.drift, 0, 1), material: 'asphalt', pan: clamp((d.driftDir ?? 0) * 0.4, -1, 1) }; if (!drifting) contact.startContact('drift', 'tire_squeal', p); else contact.updateContact('drift', p); }
        else if (drifting) contact.stopContact('drift', 0.12); drifting = dr;
        const raw = !!d.atWall && !d.fly; if (raw) { wallT += dt; offT = 0; } else { offT += dt; wallT = 0; } const w = onWall ? offT < 0.15 : wallT >= 0.08; if (w) { const p = { speed: sp, intensity: clamp(sp * 1.2, 0.2, 1), material: 'painted_rail', pan: clamp(-Math.sign(d.lat ?? 0) * 0.6, -1, 1) }; if (!onWall) contact.startContact('wall', 'body_scrape', p); else contact.updateContact('wall', p); }
        else if (onWall) contact.stopContact('wall', 0.1); onWall = w;
      }
      // checkpoints (island pieces) and the finish (start/finish seam)
      const s = d.s; if (sPrev != null && o.length) { if (sPrev - s > o.length / 2) { shot(JFINISH, 0.55); M.finish++; }
        else for (const a of isleAt) if (sPrev < a && s >= a) { shot(JPOOL[Math.floor(Math.random() * JPOOL.length)], 0.55); M.jingles++; } }
      sPrev = s;
    },
    setLevel(v: number) { level = clamp(v, 0, 1); },
    state: () => ({ seam, engineRate: +rate.toFixed(3), engineGain: +eg.gain.value.toFixed(3), loaded: !!eSrc, contact: cOk ? contact.diagnostics() : 'starting', ...M, errors: errors.slice(-6) }),
  };
}
export type RaceAudio = ReturnType<typeof createRaceAudio>;
