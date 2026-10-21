// WS-NPC A0 · Begegnungs-Bus: (1) die alten Prüfungen aus PR #210 (tools/resident_atlas/life/tests/npc-life-01.test.mjs @f534a056) gegen den Modus
// 'legacy' – Bus/Host und Clip-Adapter (15 von 21; Angebots- und ChatterBox-Adapter sind nicht übernommen, Inventur §3); (2) neue Prüfungen der
// Begegnungs-Grammatik (Modus 'kfb'): Beat-Folge mit Grüßen bzw. Schweigen, Unterbrechen/Fortsetzen am selben Beat, Abbruch räumt auf, Überschneidung,
// stabile IDs, gleiche Eingabe = gleiche Folge.
import { report } from './_report.mjs'
import { EncounterBeatBus, createEncounterHost, ENCOUNTER_BEATS, createMotionBeatAdapter, KFB_SECONDS } from '../../src/npc/encounterBus.js'

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
function run({ decision = 'accept', context = {} } = {}) {
  const bus = new EncounterBeatBus(), beats = [], movement = []
  bus.subscribe((e) => beats.push(e.beat))
  const host = createEncounterHost({ bus, offerProvider: () => ({ type: 'kfb.resident.offer-ref', assetPath: 'real/source.gltf' }), movement: (e) => movement.push([e.beat, e.progress]), durations: { approach: 0.1, greet: 0.1, offer: 0.1, react: 0.1, accept: 0.1, decline: 0.1, leave: 0.1 } })
  const start = host.start({ actorId: 'toy-soldier', targetId: 'goth-girl', targetKind: 'resident', relationship: 'neutral', decision, context })
  if (start.ok) for (let i = 0; i < 20 && host.isActive; i++) host.update(0.11)
  return { beats, movement, start, host }
}
const L = {}
const acc = run({ decision: 'accept' })
L.acceptStarts = acc.start.ok
L.acceptChain = same(acc.beats, ['approach', 'greet', 'offer', 'react', 'accept', 'leave'])
L.acceptReleasesHost = !acc.host.isActive
L.acceptReleasesParticipants = same(acc.host.busyIds, [])
L.hostOwnsApproachProgress = acc.movement.some(([b, p]) => b === 'approach' && p === 1)
L.hostOwnsLeaveProgress = acc.movement.some(([b, p]) => b === 'leave' && p === 1)
L.declineOnlyBranch = same(run({ decision: 'decline' }).beats, ['approach', 'greet', 'offer', 'react', 'decline', 'leave'])
const ih = createEncounterHost({ bus: new EncounterBeatBus() })
L.selfIllegal = same(ih.start({ actorId: 'a', targetId: 'a' }), { ok: false, reason: 'illegal' })
L.combatLockIllegal = same(ih.start({ actorId: 'a', targetId: 'b', context: { combatLocked: true } }), { ok: false, reason: 'illegal' })
const bh = createEncounterHost({ bus: new EncounterBeatBus(), durations: { approach: 10 } })
L.firstReserves = bh.start({ actorId: 'a', targetId: 'b' }).ok
L.singleHostRefuses = same(bh.start({ actorId: 'c', targetId: 'd' }), { ok: false, reason: 'host-busy' })
const calls = [], motion = createMotionBeatAdapter({ availableFor: () => ['Idle_A', 'Walking_A', 'Interact'], play: (x) => calls.push(x) })
L.motionApproach = motion({ beat: 'approach', speakerId: 'toy-soldier', actorId: 'toy-soldier', encounterId: 'e' }) === 'Walking_A'
L.motionGreet = motion({ beat: 'greet', speakerId: 'toy-soldier', actorId: 'toy-soldier', encounterId: 'e' }) === 'Interact'
L.motionTransport = same(calls.map((x) => x.clip), ['Walking_A', 'Interact'])
L.vocabularyFixed = same(ENCOUNTER_BEATS, ['approach', 'greet', 'offer', 'react', 'accept', 'decline', 'leave'])

// ---- neu: Grammatik 'kfb'
function kfb({ decision = 'greet', script = () => {}, key = 'meet:a+b:d0:social', dt = 1 / 60 } = {}) {
  const bus = new EncounterBeatBus(), ev = []
  bus.subscribe((e) => ev.push(e))
  const host = createEncounterHost({ bus, grammar: 'kfb' })
  const start = host.start({ actorId: 'farmer_b', targetId: 'lore_ph', decision, encounterKey: key })
  let t = 0, n = 0
  while (host.isActive && n < 60 * 60) { script(host, t, ev); host.update(dt); t += dt; n++ }
  return { host, ev, beats: ev.map((e) => e.beat), start, t }
}
const N = {}
const g = kfb()
N.greetChain = same(g.beats, ['notice', 'approach', 'orient', 'greet', 'react', 'part', 'resume'])
N.silentChain = same(kfb({ decision: 'silent' }).beats, ['notice', 'approach', 'orient', 'silent', 'react', 'part', 'resume'])
N.badDecisionRefused = createEncounterHost({ bus: new EncounterBeatBus(), grammar: 'kfb' }).start({ actorId: 'a', targetId: 'b', decision: 'accept' }).reason === 'bad-decision'
N.stableId = g.ev.every((e) => e.encounterId === 'meet:a+b:d0:social') && g.start.encounterId === 'meet:a+b:d0:social'
N.durationAsPlanned = Math.abs(g.t - g.host.totalSeconds('greet')) < 0.05
N.releasesBoth = !g.host.isActive && g.host.busyIds.length === 0
N.silentHasNoSpeaker = kfb({ decision: 'silent' }).ev.find((e) => e.beat === 'silent').speakerId === null
N.reactSpeakerIsTarget = g.ev.find((e) => e.beat === 'react').speakerId === 'lore_ph'
// Unterbrechen in 'greet' für 3 s, dann Fortsetzen: gleiche Beat-Folge, Beat nicht neu gestartet, Gesamtzeit + 3 s
let pausedAt = null, beatsDuringPause = 0, resumedBeat = null
const ir = kfb({ script: (h, t, ev) => {
  const c = h.current
  if (c.beat === 'greet' && c.elapsed > 0.5 && pausedAt === null) { h.interrupt('player'); pausedAt = t; beatsDuringPause = ev.length }
  if (pausedAt !== null && !resumedBeat && t - pausedAt >= 3) { N.pausedHoldsBeat = h.current.beat === 'greet' && h.current.paused && ev.length === beatsDuringPause && h.busyIds.length === 2; h.resume(); resumedBeat = h.current.beat }
} })
N.interruptResumeSameBeat = resumedBeat === 'greet' && same(ir.beats, g.beats)
N.interruptAddsPauseTime = Math.abs(ir.t - (g.t + 3)) < 0.05
N.doubleInterruptRefused = (() => { const h = createEncounterHost({ bus: new EncounterBeatBus(), grammar: 'kfb' }); h.start({ actorId: 'a', targetId: 'b' }); return h.interrupt('x') === true && h.interrupt('y') === false && h.resume() === true && h.resume() === false })()
// Abbruch mitten in 'approach' → sofort 'part' (kurz) → 'resume', beide frei, cancelled im Ereignis
let cancelled = false
const cr = kfb({ script: (h) => { if (!cancelled && h.current.beat === 'approach' && h.current.elapsed > 1) { cancelled = true; h.cancel('window-end') } } })
N.cancelChain = same(cr.beats, ['notice', 'approach', 'part', 'resume']) && cr.ev.at(-1).cancelled === 'window-end'
N.cancelReleases = !cr.host.isActive && cr.host.busyIds.length === 0 && cr.t < 0.5 + KFB_SECONDS.notice + 1 + 0.6
// Abbruch während unterbrochen: nicht hängen bleiben
const cp = kfb({ script: (h) => { if (h.current.beat === 'orient' && !h.current.paused && !h.current.cancelled) { h.interrupt('player'); h.cancel('player-left') } } })
N.cancelWhilePausedFinishes = !cp.host.isActive && cp.beats.at(-1) === 'resume'
// Überschneidung: Teilnehmer belegt → zweite Begegnung mit demselben Bewohner abgelehnt (eigener Host je Paar)
const hA = createEncounterHost({ bus: new EncounterBeatBus(), grammar: 'kfb' }); hA.start({ actorId: 'a', targetId: 'b' })
N.hostBusyDuringEncounter = hA.start({ actorId: 'a', targetId: 'c' }).reason === 'host-busy'
// Aufräumen: nach Ende keine Restbelegung, neuer Start mit denselben Teilnehmern geht
N.restartAfterEnd = g.host.start({ actorId: 'farmer_b', targetId: 'lore_ph', encounterKey: 'k2' }).ok
// Gleiche Eingabe → gleiche Ereignisfolge (deterministisch)
N.deterministic = same(kfb().ev, kfb().ev)

process.exit(report('unit-npcEncounter (WS-NPC A0, #210-Port + Grammatik)', { ...Object.fromEntries(Object.entries(L).map(([k, v]) => ['pr210_' + k, v])), ...N },
  { pr210Ported: Object.keys(L).length, newChecks: Object.keys(N).length, greetBeats: g.beats, totalS: +g.t.toFixed(3) }))
