// V-391 QA · Jede Figurenkarte unter src/data/figures läuft durch die Bühnen-Prüfung (figureCheck), die lokalen Körper sind byte-gleich mit der Karte,
// assets.sha.json stimmt, und die Ablehnungsgründe greifen (falsches Schema, fehlendes eyeRig, sha-Abweichung, Samt > 0,05, open-design auf der Bühne).
import fs from 'fs'
import crypto from 'crypto'
import { report } from './_report.mjs'
import { checkCard } from '../../src/actors/figureCheck.js'
import { FIGURE_FILES } from '../../src/actors/figureFiles.js'
const dir = 'src/data/figures', SHA = JSON.parse(fs.readFileSync(dir + '/assets.sha.json', 'utf8'))
const cards = Object.fromEntries(fs.readdirSync(dir).filter((f) => f.endsWith('.figure.json')).map((f) => [f.replace('.figure.json', ''), JSON.parse(fs.readFileSync(dir + '/' + f, 'utf8'))]))
const real = (id) => crypto.createHash('sha256').update(fs.readFileSync('src/assets/actors/' + FIGURE_FILES[id])).digest('hex')
const res = Object.fromEntries(Object.entries(cards).map(([id, c]) => [id, checkCard(c, { sha256: FIGURE_FILES[id] ? real(id) : null })]))
const fb = cards.frizzlebob, bad = (patch) => checkCard({ ...fb, ...patch }, { sha256: fb.body.glb.sha256 }).ok
process.exit(report('unit-figures (V-391)', {
  stageCardsPass: ['frizzlebob', 'gothgirl'].every((id) => res[id]?.ok),
  bodiesByteIdentical: Object.keys(FIGURE_FILES).every((id) => real(id) === cards[id].body.glb.sha256 && SHA[id].sha256 === real(id)),
  idEqualsFile: Object.entries(cards).every(([id, c]) => c.id === id),
  refusesWrongSchema: !bad({ schema: 'x' }),
  refusesMissingEyeRig: !bad({ eyeRig: undefined }),
  refusesNoReasonWithoutRig: !bad({ eyeRig: { required: false } }),
  refusesShaMismatch: !checkCard(fb, { sha256: 'deadbeef' }).ok,
  refusesSheen: !bad({ material: { ...fb.material, sheenMax: 0.1 } }),
  refusesOpenDesignOnStage: !bad({ approval: { ...fb.approval, status: 'open-design' } }) && checkCard({ ...fb, approval: { ...fb.approval, status: 'open-design' } }, { sha256: fb.body.glb.sha256, where: 'workshop' }).ok,
}, { res }))
