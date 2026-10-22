// V-487 Stufe 2 · Saug-Ton aus ElevenLabs fluff_suction_r1 (WS0, Audio-Branch @ac72e087, wie propulsion_r1): hängt an den Cues von kfb-fluff-suck (V-389).
// charge → S01 Anlauf (einmal je Saugstoß) + S02 Saug-Schleife solange Kugeln fliegen; plop → S03 Baum / S04 Boden / S05 Wasser; swallow und cloud → S06 Schlürfen.
// S07 Tank voll wartet auf die Tank-Grenze (Saugarm-Beute aus Pack P2). Je Ereignis zwei Varianten (a/b) im Wechsel, Tonhöhe leicht gestreut, Mindestabstand
// gegen Stapeln. Ein AudioContext mit dem Motor (engineAudio.audioCtx); startet erst nach einer Taste; ohne Ton (Hash mute) still.
// createSuckAudio({ muted }) → { resume(), cue(name, job), update(dt, active), info() }
import { PROPULSION_PIN, audioCtx } from './engineAudio.js'
import { bus, audioMode, AUDIO_ROOT } from './kfbAudio.js' // WS-Audio R1: SFX-Bus; volle Fassung lädt dieselben Dateien vom lokalen Ton-Server
const BASE = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${PROPULSION_PIN}/media/3D_Assets/Audio/KFB_ElevenLabs_SFX_r1/fluff_suction_r1/`
const FILES = { start: 'S01_suck_start', loop: 'S02_suck_loop', tree: 'S03_pop_tree', ground: 'S04_pop_ground', water: 'S05_pop_water', slurp: 'S06_slurp_in', full: 'S07_tank_full' }
export const SUCK_MIX = Object.freeze({ master: 0.5, start: 0.7, loop: 0.45, pop: 0.8, slurp: 0.6, gap: { start: 0.5, pop: 0.06, slurp: 0.08 }, spread: 0.08 })

export function createSuckAudio({ base = audioMode() === 'full' ? AUDIO_ROOT + 'el/fluff_suction_r1/' : BASE, muted = false } = {}) {
  const ac = muted ? null : audioCtx(); if (!ac) return { resume() {}, cue() {}, update() {}, info: () => ({ muted: true }) }
  const st = { ok: false, error: null, buffers: {}, plays: 0, flip: 0, last: {}, loop: null }
  const out = ac.createGain(); out.gain.value = SUCK_MIX.master; out.connect(bus('sfx'))
  const keys = Object.keys(FILES).flatMap((k) => ['a', 'b'].map((v) => [k + '_' + v, `${FILES[k]}_${v}.mp3`]))
  const ready = Promise.all(keys.map(([k, f]) => fetch(base + f).then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer() }).then((b) => ac.decodeAudioData(b)).then((buf) => { st.buffers[k] = buf })))
    .then(() => { st.ok = true }).catch((e) => { st.error = String(e?.message || e) })
  const play = (k, gain, gapKey) => { const now = ac.currentTime; if (gapKey && now - (st.last[gapKey] ?? -9) < SUCK_MIX.gap[gapKey]) return; st.last[gapKey] = now
    const buf = st.buffers[k + '_' + ((st.flip++ & 1) ? 'b' : 'a')]; if (!buf) return
    const s = ac.createBufferSource(), v = ac.createGain(); s.buffer = buf; s.playbackRate.value = 1 + (Math.random() * 2 - 1) * SUCK_MIX.spread; v.gain.value = gain; s.connect(v); v.connect(out); s.start(); st.plays++ }
  const loopOn = () => { if (st.loop || !st.buffers.loop_a) return; const s = ac.createBufferSource(), g = ac.createGain(); s.buffer = st.buffers.loop_a; s.loop = true; g.gain.value = 0; s.connect(g); g.connect(out); s.start(); st.loop = { s, g } }
  return {
    ready,
    resume() { if (ac.state === 'suspended') ac.resume() },
    cue(name, job) {
      if (!st.ok) return
      if (name === 'charge') { play('start', SUCK_MIX.start, 'start'); loopOn() }
      else if (name === 'plop') play(job?.origin === 'tree' || job?.origin === 'water' ? job.origin : 'ground', SUCK_MIX.pop, 'pop')
      else if (name === 'swallow' || name === 'cloud') play('slurp', SUCK_MIX.slurp, 'slurp')
    },
    update(dt, active = 0) { if (st.loop) st.loop.g.gain.setTargetAtTime(active > 0 ? SUCK_MIX.loop : 0, ac.currentTime, active > 0 ? 0.08 : 0.25) },
    info: () => ({ ok: st.ok, error: st.error, plays: st.plays, loop: !!st.loop, state: ac.state }),
  }
}
