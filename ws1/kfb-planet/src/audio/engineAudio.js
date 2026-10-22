// R1a Ton (V-481/V-487 Stufe 1) · Motorklang der Racer aus ElevenLabs propulsion_r1 (WS0, Audio-Branch assets/kfb-elevenlabs-sfx-r1-2026-10-18 @ac72e087):
// je Anker-Typ eine Schleife (thrust → P01 Jet-Schub, fan → P02 Turbinen-Lüfter, Schweben → P05 Antigrav-Summen), Einzelklänge P04 Boost-Zündung und
// P06 Schalt-Flammenknall. Ein Signal mit Antrieb und Deformer: Tonhöhe = Drehzahl, Lautstärke = Schub (Gas, Boost), Schaltdelle hörbar, Knall bei
// shift/backfire (Ereignisse aus vehicleRig.update). Die Quellen sind 4-s-Aufnahmen ohne Schleifenschnitt: Schleife über zwei versetzte Spuren mit
// Überblendung (keine Naht). Ein AudioContext für das Spiel (startet erst nach einer Taste, Browser-Regel); ohne Ton (Hash mute) still.
// createEngineAudio({ types: Set(['thrust','fan','hover']), base, variant }) → { resume(), update(dt, { rpm, thrust, boost }), event(e), stop(), info() }
export const PROPULSION_PIN = 'ac72e087a2a95bb1962867d5a85fbf2e78eb4462'
const BASE = `https://raw.githubusercontent.com/georg-doc/kayfabizarro/${PROPULSION_PIN}/media/3D_Assets/Audio/KFB_ElevenLabs_SFX_r1/propulsion_r1/`
const FILES = { thrust: 'P01_jet_thrust_loop', fan: 'P02_turbine_fan_loop', exhaust: 'P03_exhaust_rumble_loop', hover: 'P05_antigrav_hum_loop', boost: 'P04_boost_ignite', shift: 'P06_shift_flame_pop' }
export const ENGINE_MIX = Object.freeze({ master: 0.55, loop: { thrust: 0.8, fan: 0.6, exhaust: 0.7, hover: 0.35 }, oneShot: { boost: 0.9, shift: 0.7 }, rate: [0.78, 1.32], xfade: 0.6 })
// WS-Audio R1 (V-598): EIN AudioContext und EIN Mixer für das ganze Spiel (kfbAudio). Mit lokalem Ton-Server (volle Fassung) übernimmt der WSA-Racer
// (Motor-Gitter L1–L5, Gänge, Flug) – dieser Motor startet dann keine eigenen Schleifen und reicht nur Boost weiter; ohne ihn (dist, Vorschau) klingt er
// wie bisher, aber über den SFX-Bus statt direkt an den Ausgang.
import { audioContext, bus, unlock, audioMode, vehicleEvent } from './kfbAudio.js'
export const audioCtx = () => audioContext() // ein AudioContext für alle Spielklänge (Motor, Saugen)
const ctx = audioCtx
const delegated = () => audioMode() !== 'public' && audioMode() !== 'idle' // volle Fassung (oder lädt noch): Racer der WSA spielt

export function createEngineAudio({ types = new Set(['thrust']), base = BASE, variant = 'a', muted = false } = {}) {
  const st = { ok: false, error: null, loops: {}, buffers: {}, gain: null, started: false, events: 0 }
  const ac = muted ? null : ctx(); if (!ac) return { resume() {}, update() {}, event() {}, stop() {}, info: () => ({ muted: true }) }
  st.gain = ac.createGain(); st.gain.gain.value = ENGINE_MIX.master; st.gain.connect(bus('sfx'))
  const want = [...types].filter((t) => FILES[t]).concat(['boost', 'shift'])
  const load = (k) => fetch(`${base}${FILES[k]}_${variant}.mp3`).then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer() }).then((b) => ac.decodeAudioData(b)).then((buf) => { st.buffers[k] = buf })
  const ready = Promise.all(want.map(load)).then(() => { st.ok = true }).catch((e) => { st.error = String(e?.message || e) })
  // Schleife ohne Naht: zwei Spuren, je Durchgang um die halbe Länge versetzt, Überblendung xfade s an jedem Ende
  const startLoop = (k) => {
    const buf = st.buffers[k]; if (!buf) return null
    const g = ac.createGain(); g.gain.value = 0; g.connect(st.gain)
    const L = { g, rate: 1, srcs: [], buf, next: ac.currentTime + 0.05 }
    const sched = () => { const D = buf.duration, X = Math.min(ENGINE_MIX.xfade, D / 3), t0 = L.next
      for (let n = 0; n < 2; n++) { const s = ac.createBufferSource(), v = ac.createGain(); s.buffer = buf; s.playbackRate.value = L.rate; s.connect(v); v.connect(g)
        const at = t0 + n * (D - X) / L.rate; v.gain.setValueAtTime(0, at); v.gain.linearRampToValueAtTime(1, at + X / L.rate); v.gain.setValueAtTime(1, at + (D - X) / L.rate); v.gain.linearRampToValueAtTime(0, at + D / L.rate)
        s.start(at); s.stop(at + D / L.rate + 0.02); L.srcs.push(s) }
      L.next = t0 + 2 * (D - X) / L.rate; L.srcs = L.srcs.slice(-4) }
    L.sched = sched; sched(); return L
  }
  const oneShot = (k, gain = 1) => { const buf = st.buffers[k]; if (!buf || !st.started) return; const s = ac.createBufferSource(), v = ac.createGain(); s.buffer = buf; v.gain.value = gain; s.connect(v); v.connect(st.gain); s.start(); st.events++ }
  return {
    ready,
    resume() { unlock(); if (ac.state === 'suspended') ac.resume(); if (delegated()) return; if (!st.started && st.ok) { st.started = true; for (const t of types) if (FILES[t]) st.loops[t] = startLoop(t) } },
    update(dt, { rpm = 0.2, thrust = 0.12, boost = 0 } = {}) {
      if (!st.started) return
      const rate = ENGINE_MIX.rate[0] + (ENGINE_MIX.rate[1] - ENGINE_MIX.rate[0]) * Math.min(1, rpm) + 0.06 * boost
      for (const [t, L] of Object.entries(st.loops)) { if (!L) continue
        L.rate = rate; const vol = (ENGINE_MIX.loop[t] ?? 0.5) * (t === 'hover' ? 0.6 + 0.4 * thrust : 0.2 + 0.8 * Math.min(1.2, thrust))
        L.g.gain.setTargetAtTime(vol, ac.currentTime, 0.06); L.srcs.forEach((s) => s.playbackRate.setTargetAtTime(rate, ac.currentTime, 0.08))
        if (ac.currentTime > L.next - 0.5) L.sched() }
    },
    event(e) { if (delegated()) { if (e?.type === 'boost') vehicleEvent(e); return } if (e?.type === 'shift' && e.up) oneShot('shift', ENGINE_MIX.oneShot.shift); if (e?.type === 'backfire') oneShot('shift', ENGINE_MIX.oneShot.shift * 0.8); if (e?.type === 'boost') oneShot('boost', ENGINE_MIX.oneShot.boost) },
    stop() { for (const L of Object.values(st.loops)) { if (!L) continue; L.srcs.forEach((s) => { try { s.stop() } catch {} }); L.g.disconnect() } st.loops = {}; st.gain.disconnect(); st.started = false },
    info: () => ({ ok: st.ok, error: st.error, started: st.started, delegated: delegated(), loops: Object.keys(st.loops), events: st.events, state: ac.state }),
  }
}
