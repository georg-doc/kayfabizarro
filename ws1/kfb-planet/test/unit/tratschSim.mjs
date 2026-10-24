// WS-NPC Karten-Tratsch Stufe 0 (src/npc/tratschSim.js), ohne Browser – feste Regeln, nicht die Stellwerte:
//   T1 gleicher Seed → gleicher Verlauf · T6 jeder Text ist Triplet aus dem Set, Kartentext roh oder Lore (gekürzt nur durch Weglassen ganzer Sätze)
//   · T4 nie an jemanden aus der Herkunftskette, nie nach Blödsinn! dieselbe Karte vom selben Erzähler · T7 Herkunft vollständig (Kette ≤ 3)
//   · Triplet-Zuordnung weist verschobene Zeilen ab (anti_rules_toolkit 52–57, BBBW 50/51) · MiB-Einsatz hat Opfer, Umstehende reagieren je Haltung
//   · Rückfall b erzählt nur Karten mit Triplet · Dramaturg ändert nur die Auswahl: gleiche Bewertungsfunktion (Faktoren ohne Kartentext)
import fs from 'fs'
import { report } from './_report.mjs'
import { createTratschSim, buildLibrary, bubbles, tripletFits, lineFits, startsWithTitle, lineStart, openerFits, cleanLore, rawText, loreText, loreRest, composeLine, TRATSCH } from '../../src/npc/tratschSim.js'

const cards = JSON.parse(fs.readFileSync('src/data/cards.json', 'utf8')), data = JSON.parse(fs.readFileSync('src/data/npc/tratsch/tratsch-data.r1.json', 'utf8')), lib = buildLibrary(cards, data)
const cast = [['lorekeeper', 'bewohner', 'frizzlebob_s_mission_control'], ['farmer_b', 'bewohner', 'the_bards_barnyard_beatdown'], ['skeleton_warrior', 'skelette', 'sonic_warfare_music_history_01'], ['skeleton_mage', 'skelette', 'symphonic_savagery'], ['orc_raider', 'band', 'shadow_politics'], ['kayfabrick_bot', 'bots', null]]
  .map(([id, group, deck]) => ({ id, group, deck }))
const run = (o) => { const s = createTratschSim({ lib, cast: cast.map((c) => ({ ...c })), seed: 3, ...o }); s.runDays(10); return s }
const C = {}, A = run({ drama: true, fallback: 'roh' }), A2 = run({ drama: true, fallback: 'roh' }), Bf = run({ drama: true, fallback: 'stumm' }), M = run({ drama: true, fallback: 'roh', mib: true, R: { ...TRATSCH, mib: { perDay: 1 } } })
const sig = (s) => JSON.stringify(s.S.log.map((e) => [e.kind, e.E, e.H, e.card, e.out, e.steps?.map((x) => x.call ?? x.add)]))
C.T1_deterministic = sig(A) === sig(A2) && A.S.log.length > 50
const tells = (s) => s.S.log.filter((e) => e.kind === 'tell')
const opOf = (t) => lib.openers.find((o) => o.opener === t) || null, src = (k, b) => b === lib.trip.get(k) || b === rawText(lib.card(k), TRATSCH.bubbleMax)
const lineOk = (k, t, b, o, st) => src(k, b) && t === composeLine(o ? opOf(o) : null, b, st, b === lib.trip.get(k) ? null : lib.card(k).name)
const loreOk = (k, t) => t != null && (t === loreRest(lib.card(k), null, TRATSCH.bubbleMax) || t === loreRest(lib.card(k), lib.trip.get(k), TRATSCH.bubbleMax))
C.T6_textFromSource = [A, Bf, M].every((s) => tells(s).every((e) => lineOk(e.card, e.text, e.base, e.opener, e.start) && e.steps.filter((x) => x.text).every((x) => (x.add === 'Lore' ? loreOk(e.card, x.text) : lineOk(e.card, x.text, x.base, x.opener, x.start)))))
// Baukasten: Opener + Zeile = ein Satz; Frage-Opener → „?“; Lore-Rest wiederholt nichts aus dem Triplet
// tr1: nur Satz-Opener vor ganzen Sätzen, Kleinschreibung nach Komma nur bei Funktionswort (keine Namen)
// Rückfall-Bereinigung 1:1 wie SSOT_SPOKEN_LINES/lore_fallback.py (Beispielfälle von dort); Substantiv-Opener nur vor dem Titel im Rückfall
C.cleanLoreLikeSSOT = cleanLore('The Heel Promoter', "THE HEEL PROMOTER: He thinks the roster is disposable. He's wrong. Power: 100.") === "He thinks the roster is disposable. He's wrong." && cleanLore('The Bachelor', 'PAPER BULLETS: Deal damage based on the number of words in your insult.') === 'Deal damage based on the number of words in your insult.' && cleanLore('The Hour (Polanyi)', 'In selling the hour (the commodity), you sell the self that fills it.') === 'In selling the hour, you sell the self that fills it.'
C.nounOpenerOnlyRaw = openerFits({ opener: 'Let me tell you about', slot: 'into_title' }, 'title', true, true) && !openerFits({ opener: 'Let me tell you about', slot: 'into_title' }, 'title', true, false) && composeLine({ opener: 'Did you hear of', slot: 'into_title', class: 'Q' }, 'The Maze. You cannot leave.', 'title', 'The Maze') === 'Did you hear of The Maze? You cannot leave.'
C.openerGrammar = !openerFits({ opener: 'Let me tell you about', slot: 'into_title' }, 'title') && openerFits({ opener: 'What if', slot: 'into_title' }, 'func') && !openerFits({ opener: 'What if', slot: 'into_title' }, 'other') && composeLine({ opener: 'Anyway', slot: 'interjection' }, 'Any investigation goes.', 'func') === 'Anyway, any investigation goes.' && composeLine({ opener: 'Anyway', slot: 'interjection' }, 'Nietzsche was right.', 'other') === 'Anyway, Nietzsche was right.' && lineStart('The Maze', 'The Maze is long.') === 'title'
C.openerCompose = composeLine({ opener: 'Did you hear of', slot: 'into_title', class: 'Q' }, 'The Maze, loop. No outside.') === 'Did you hear of The Maze, loop. No outside?' && composeLine({ opener: 'Everyone agrees', slot: 'own_clause', class: 'P', stance: 'Behauptung' }, 'X.') === 'Everyone agrees. X.' && composeLine({ opener: 'Meanwhile elsewhere', slot: 'own_clause', class: 'X', stance: 'Szenenwechsel' }, 'X.') === 'Meanwhile elsewhere, X.' && loreRest({ name: 'M', lore: 'Spoilers: there is no outside. Bring snacks.' }, 'The Maze. Spoilers: there is no outside.') === 'Bring snacks.'
C.loreOnlyDrops = loreText({ name: 'N', lore: 'Erster Satz. ' + 'x '.repeat(80) + 'Ende.' }, 140) === 'Erster Satz.'
// Rückfall (Georg 23.10.): Titel + gedruckte Lore, Power nie
C.rawIsTitleLoreNeverPower = rawText({ name: 'The Maze', power: 'Deal 3 damage.', lore: 'You cannot leave. Bring snacks.' }) === 'The Maze. You cannot leave. Bring snacks.' && rawText({ name: 'N', power: 'p', lore: 'y'.repeat(300) }) === 'N.'
C.T4_neverBackToChain = [A, M].every((s) => tells(s).every((e) => { const src = s.K[e.E].get(e.card); return !src || (src.from !== e.H && !src.chain.includes(e.H)) }))
C.T4_noRepeatAfterReject = tells(A).every((e, i, L) => !L.slice(0, i).some((p) => p.E === e.E && p.H === e.H && p.card === e.card && p.out === 'abgelehnt'))
C.T7_provenance = A.ids.every((i) => [...A.K[i].values()].every((v) => v.from === 'start' || (v.chain.length >= 1 && v.chain.length <= TRATSCH.chainMax && v.chain[0] === v.from)))
// tr1: Titel irgendwo im Satz; t1-Regel „Titel vorn“ bleibt für alte Sets; gesperrte Karten nie (SSOT S12)
C.tr1FitsAnywhere = lineFits('The Maze', 'Find an exit to The Maze? Spoilers, there is no outside.') && !lineFits('The Ring Post', 'The Steel Steps, weaponized furniture') && !tripletFits('The Ring Post', 'The Steel Steps, weaponized furniture') && startsWithTitle('The Maze', 'The Maze is long.') && !startsWithTitle('The Maze', 'Find an exit to The Maze?')
C.blockedNeverSpoken = lib.blocked.size === 25 && [A, Bf, M].every((s) => tells(s).every((e) => !lib.blocked.has(e.card)) && s.ids.every((i) => [...s.K[i].keys()].every((k) => !lib.blocked.has(k))))
C.noColonInBubbles = [A, M].every((s) => tells(s).every((e) => e.raw ? !e.text.includes(': ') || lib.card(e.card).name.includes(':') || String(lib.card(e.card).lore).includes(':') : true))
C.fallbackBOnlyTriplets = tells(Bf).every((e) => !e.raw) && tells(Bf).length > 10
const mibs = M.S.log.filter((e) => e.kind === 'mib')
C.mibHasVictims = mibs.length > 0 && mibs.every((e) => e.victims.length >= 1 && e.victims.every((v) => !M.K[v].has(e.card) || M.K[v].get(e.card).day > 0)) && mibs.some((e) => e.by.length > 0)
C.callsUseOnlyState = tells(A).every((e) => e.steps.filter((x) => x.f).every((x) => Object.keys(x.f).join() === 'rel,sta,rep,bub,raw,art,sat,ident,rnd'))
C.bubblesQ = bubbles(['a', 'b', 'c', 'd'], [['a', 'b'], ['a', 'b'], ['c', 'd'], ['c', 'd']]).Q > 0.4 && bubbles(['a', 'b'], []).Q === 0
process.exit(report('unit-tratschSim (WS-NPC Karten-Tratsch Stufe 0)', C, { tells: tells(A).length, mib: mibs.length, misfit: lib.misfit.length }))
