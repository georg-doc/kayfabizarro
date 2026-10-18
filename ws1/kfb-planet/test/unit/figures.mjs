// V-391 QA · Jede Figurenkarte unter src/data/figures läuft durch die Bühnen-Prüfung (figureCheck), die lokalen Körper sind byte-gleich mit der Karte,
// assets.sha.json stimmt, und die Ablehnungsgründe greifen (falsches Schema, fehlendes eyeRig, sha-Abweichung, Samt > 0,05, open-design auf der Bühne).
import fs from 'fs'
import crypto from 'crypto'
import { report } from './_report.mjs'
import { checkCard } from '../../src/actors/figureCheck.js'
import { FIGURE_FILES } from '../../src/actors/figureFiles.js'
import { applyVariant, glbUrl } from '../../src/vendor/figure/kfb-figure-loader.v1.js'
const dir = 'src/data/figures', SHA = JSON.parse(fs.readFileSync(dir + '/assets.sha.json', 'utf8'))
const cards = Object.fromEntries(fs.readdirSync(dir).filter((f) => f.endsWith('.figure.json')).map((f) => [f.replace('.figure.json', ''), JSON.parse(fs.readFileSync(dir + '/' + f, 'utf8'))]))
const real = (id) => crypto.createHash('sha256').update(fs.readFileSync('src/assets/actors/' + FIGURE_FILES[id])).digest('hex')
const res = Object.fromEntries(Object.entries(cards).map(([id, c]) => [id, checkCard(c, { sha256: FIGURE_FILES[id] ? real(id) : null })]))
// C2 (V-409/V-422): Aliens laden zur Laufzeit über feste Adresse; Varianten (Sockelrand 80°) hängen an Karten-id + Karten-sha256, Rezepte byte-gleich mit der Karte
const variants = Object.fromEntries(fs.readdirSync(dir + '/variants').map((f) => { const v = JSON.parse(fs.readFileSync(dir + '/variants/' + f, 'utf8')); return [v.base, v] }))
const recipeSha = (c) => { const f = dir + '/recipes/' + c.body.recipe.path.split('/').pop(); return fs.existsSync(f) ? crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex') : null }
const fb = cards.frizzlebob, bad = (patch) => checkCard({ ...fb, ...patch }, { sha256: fb.body.glb.sha256 }).ok
process.exit(report('unit-figures (V-391)', {
  stageCardsPass: ['frizzlebob', 'gothgirl'].every((id) => res[id]?.ok),
  bodiesByteIdentical: Object.keys(FIGURE_FILES).every((id) => real(id) === cards[id].body.glb.sha256 && SHA[id].sha256 === real(id)),
  idEqualsFile: Object.entries(cards).every(([id, c]) => c.id === id),
  aliensVariantApplies: ['lord_hunky', 'lady_dory'].every((id) => { const a = applyVariant(cards[id], variants[id]); return a.ok && checkCard(a.card, { sha256: variants[id].body.glb.sha256 }).ok && /\/fd20d925bbbbb1423481ec6894039ea8ade88075\//.test(glbUrl(a.card.body.glb)) }),
  variantRefusesOtherCard: !applyVariant(cards.lady_dory, variants.lord_hunky).ok && !applyVariant({ ...cards.lord_hunky, body: { ...cards.lord_hunky.body, glb: { ...cards.lord_hunky.body.glb, sha256: 'x' } } }, variants.lord_hunky).ok,
  alienRecipesByteIdentical: ['lord_hunky', 'lady_dory'].every((id) => recipeSha(cards[id]) === cards[id].body.recipe.sha256),
  refusesWrongSchema: !bad({ schema: 'x' }),
  refusesMissingEyeRig: !bad({ eyeRig: undefined }),
  refusesNoReasonWithoutRig: !bad({ eyeRig: { required: false } }),
  refusesShaMismatch: !checkCard(fb, { sha256: 'deadbeef' }).ok,
  refusesSheen: !bad({ material: { ...fb.material, sheenMax: 0.1 } }),
  refusesOpenDesignOnStage: !bad({ approval: { ...fb.approval, status: 'open-design' } }) && checkCard({ ...fb, approval: { ...fb.approval, status: 'open-design' } }, { sha256: fb.body.glb.sha256, where: 'workshop' }).ok,
}, { res, variants: Object.keys(variants) }))
