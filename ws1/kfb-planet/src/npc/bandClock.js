// WS-NPC Phase D (Lead 21.10.: Modul „band“) · Takt der Ork-Band, rein, Node-geprüft (test/unit/bandClock.mjs).
// Fahrplan statt Simulation: die Clip-Zeit jedes Musikers ist eine reine Funktion der Weltzeit, nach der Formel des Scenelets (kfb.scenelet/1 R2,
// timeline.beatClock): beatPos = (songTime − phaseOffset) · bpm / 60 ; clipTime = mod(beatPos + phase, beats) · clip.duration / beats.
// Wer weggeht und zurückkommt, sieht die Band im selben Takt weiterspielen (kein Neustart, kein Pop-in).
export const beatPos = (clock, songT) => (songT - (clock.phaseOffset_s || 0)) * clock.bpm / 60
export function clipTimeAt(beat, beats, duration, phase = 0) { const b = beats > 0 ? beats : 1, u = (((beat + phase) % b) + b) % b; return u * duration / b }
// Aufstellung: Scenelet-Einheiten (u, glTF-Raum, +z vorn) → Welt (x, z) um den Anker mit Drehung yaw; s = Meter je u im Spiel
export function placeActor(a, anchor, yaw, s) {
  const [px, , pz] = a.p || [0, 0, 0], c = Math.cos(yaw), sn = Math.sin(yaw)
  return { x: anchor[0] + (px * c + pz * sn) * s, z: anchor[1] + (-px * sn + pz * c) * s, yaw: yaw + ((a.ry || 0) * Math.PI) / 180 }
}
