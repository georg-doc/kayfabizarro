// TRIPLET_SSOT_R1-Rückfall (lines=ssot, Georg 24.10.): clean_lore 1:1 wie lore_fallback.py (R1.2), Sperrliste, A-Satz mit Frage-Opener, Rotation ohne Wiederholung
import { cleanLore, lineA, lineB, isBlocked, createOpenerRotation, spokenTitle, CALLS } from '../../src/dialog/ssotLines.js'
import DATA from '../../src/data/spoken/ssot-lines.r1.json' with { type: 'json' }
import { report } from './_report.mjs'
const ex = [
  ['The Heel Promoter', "THE HEEL PROMOTER: He thinks the roster is disposable. He's wrong. Power: 100.", "He thinks the roster is disposable. He's wrong."],
  ['The Bachelor', 'PAPER BULLETS: Deal damage based on the number of words in your insult.', 'Deal damage based on the number of words in your insult.'],
  ['The Hour (Polanyi)', 'In selling the hour (the commodity), you sell the self that fills it.', 'In selling the hour, you sell the self that fills it.'],
]
const got = ex.map(([t, l]) => cleanLore(t, l))
const nQ = DATA.openersA.filter((o) => o.q).length, rot = createOpenerRotation(), seq = Array.from({ length: Math.min(5, nQ) }, () => rot.next().id)
const a = lineA({ name: 'The Hour (Polanyi)' }, { text: 'Have you heard of', q: true })
process.exit(report('unit-ssotLines', {
  cleanLoreLikePython: got.every((g, i) => g === ex[i][2]),
  noPowerInB: !/power\s*:?\s*\d/i.test(lineB({ name: 'The Heel Promoter', lore: ex[0][1] })),
  aIsOneQuestionWithBoldTitle: a === 'Have you heard of *The Hour*?' && !a.includes(':'),
  titleWithoutBrackets: spokenTitle('The Hour (Polanyi)') === 'The Hour',
  blockedKnown: isBlocked('shadow_politics', 13) && !isBlocked('forget_utopia', 1),
  rotationNoRepeat: new Set(seq).size === seq.length,
  callsV699: CALLS.boggle === 'Boggle...?' && CALLS.humbug === 'Humbug?!',
}, { got, seq, a }))
