// WS-NPC Sprech-Anlässe (src/npc/chatterCues.js, Georg 24.10.), ohne Browser: Liedende genau einmal je Grenze · Band-Lied 16 Takte bei 100 bpm = 38,4 s
// · Bemerken mit Hysterese und Sperrzeit (first, dann known) · Deckel je Gruppe (minGapS), Bemerken darf den Deckel überspringen · Sprecher reihum
import { report } from './_report.mjs'
import { CHATTER, songBoundary, bandSongLength, createNotice, createChatterLog, pickSpeakers } from '../../src/npc/chatterCues.js'

const C = {}
C.songLength = Math.abs(bandSongLength({ bpm: 100, beatsPerBar: 4 }) - 38.4) < 1e-9
let ends = 0; for (let t = 0, p = null; t < 200; t += 1 / 60) { if (songBoundary(p, t, 38.4) != null) ends++; p = t }
C.boundaryOncePerSong = ends === 5 && songBoundary(null, 1, 38.4) === null && songBoundary(40, 39, 38.4) === null
const N = createNotice({ inR: 3, outR: 5, cooldownS: 10 }), seq = [[9, 0], [2.9, 1], [2, 2], [4, 3], [6, 4], [2, 5], [6, 6], [2, 12], [6, 13], [2, 30]].map(([d, t]) => N.step(d, t))
C.noticeHysteresisCooldown = JSON.stringify(seq) === JSON.stringify([null, 'first', null, null, null, null, null, 'known', null, 'known'])
const L = createChatterLog({ group: 'g', minGapS: 90 }), a = L.emit([{ mood: 'froh' }, { mood: 'froh' }], 10), b = L.emit([{ mood: 'froh' }], 50), c = L.emit([{ mood: 'staunend' }], 60, { force: true }), d = L.emit([{ mood: 'froh' }], 101)
// Bemerken (force) bei 60 verbraucht den Deckel nicht: Liedende bei 101 (≥ 90 nach 10) kommt
C.capPerGroup = a.length === 2 && b.length === 0 && c.length === 1 && d.length === 1 && L.events().map((e) => e.seq).join() === '1,2,3,4' && L.events().every((e) => e.type === 'chatter' && e.group === 'g')
C.speakersRotate = pickSpeakers(['a', 'b', 'c'], 0).join() === 'a,b' && pickSpeakers(['a', 'b', 'c'], 2).join() === 'c,a' && pickSpeakers([], 1).length === 0
C.moods = ['froh', 'introspektiv', 'staunend'].every((m) => Object.values(CHATTER.mood).includes(m))
process.exit(report('unit-chatterCues (WS-NPC Sprech-Anlässe gothgirl, Band, Disco)', C, { ends, seq }))
