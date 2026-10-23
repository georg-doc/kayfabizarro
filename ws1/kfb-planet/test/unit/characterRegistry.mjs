// Lead 22.10. · Zentraler Figuren-Leser (src/characters/registry.js) gegen das Register CHARACTERS_R1 (Snapshot registry.r1.json),
// Parität nach check_character_parity.py: jede Figuren-ID, die das Spiel benutzt, löst über aliases.json auf eine Register-Figur auf.
// Quellen: Bewohner (residents.r1), Figurenkarten (data/figures), Fluffer-Sorten (K15), Disco-K12-Körper, Cast-Rezepte, Band, Bots.
// Varianten-Suffix ':<farbe>[:helm]' wird abgetrennt; todo/PREFILL/DESIGN = null (kein stiller Rückfall). Bekannte Lücken stehen in GAPS.
import fs from 'fs'
import { report, readJson } from './_report.mjs'
import { resolveCharacterId, characterOf, chatterOf, voiceOf, splitVariant, isExcluded, unresolvedCandidates, characterIds, REGISTRY_SOURCE } from '../../src/characters/registry.js'

const S = readJson('src/data/characters/registry.r1.json')
const used = [] // [quelle, id, scope?]
const W = readJson('src/data/npc/residents.r1.json')
for (const r of W.residents) for (const k of ['residentId', 'castId', 'stageCastId']) if (r[k]) used.push(['residents.' + k, r[k]])
for (const f of fs.readdirSync('src/data/figures').filter((f) => f.endsWith('.figure.json'))) used.push(['figures', readJson('src/data/figures/' + f).id])
for (const k of readJson('src/data/npc/fluffer.kinds.k15.json').kinds) used.push(['fluffer.k15', k.kind])
for (const b of Object.keys(readJson('src/data/actors/cast/disco-k12.sources.json').blobs)) used.push(['disco-k12', 'kfb_disco_' + b.replace(/^KFB_Disco_|\.src\.glb$/g, '').toLowerCase()])
for (const f of fs.readdirSync('src/data/actors/cast').filter((f) => f.endsWith('.recipe.json'))) used.push(['cast.recipe', f.replace('.recipe.json', '')])
for (const id of ['kayfabrick-bot', 'kfb_band_drummer', 'kfb_band_guitarist', 'kfb_band_leader', 'kfb_band_trumpeter']) used.push(['bots/band', id])
// WS-NPC 22.10.: Gruppen-Darsteller (castId mit Varianten-Suffix), Fluffer je Zone (kind fest/firstKind), Band-Rollen der Szenen-Datei als Karten-ID
for (const g of W.groups) for (const m of g.members) used.push(['groups.' + g.id, m.castId])
for (const f of W.fluffers) for (const k of [f.kind, f.firstKind]) if (k) used.push(['fluffers.' + f.id, k])
for (const r of ['leader', 'guitarist', 'drummer', 'trumpeter']) used.push(['band.role', 'kfb_band_' + r])

const GAPS = {} // bekannte Lücken: id → Grund (an WS0 gemeldet); leer = alle IDs lösen auf
const miss = used.filter(([, id]) => !resolveCharacterId(id) && !isExcluded(id) && !GAPS[id])
const C = {}
C.snapshotPinned = /^[0-9a-f]{40}$/.test(REGISTRY_SOURCE.commit) && REGISTRY_SOURCE.count === characterIds().length && characterIds().length >= 130
C.allUsedResolve = miss.length === 0
C.canonicalSelf = characterIds().every((id) => resolveCharacterId(id) === id)
C.aliasesResolve = Object.entries(S.aliases).every(([a, id]) => resolveCharacterId(a) === id)
C.variantSuffix = splitVariant('farmer_b:red:helm').base === 'farmer_b' && resolveCharacterId('farmer-b:red') === 'farmer_b' && resolveCharacterId('kfb_heroman_red:blue:helm') === 'hero_man'
C.fluffer = resolveCharacterId('alien') === 'q_alien' && resolveCharacterId('kfb_q_alien_healed') === 'q_alien' && resolveCharacterId('ghost') === 'q_ghost'
C.scoped = resolveCharacterId('teen', 'S10.disco_street_01') === 'protagonist_a' && resolveCharacterId('teen') === null
C.unknownNull = resolveCharacterId('gibt_es_nicht') === null && characterOf('') === null && characterOf(undefined) === null
C.unresolvedNotGuessed = resolveCharacterId('KayKit Mummy') === null && unresolvedCandidates('KayKit Mummy')?.length === 2
C.excluded = isExcluded('georg_chronicler') && resolveCharacterId('georg_chronicler') === null
// Feldregel: todo/PREFILL/DESIGN = null; PREFILL nur auf ausdrücklichen Wunsch und markiert
const fb = characterOf('FB'), harke = characterOf('farmer_harke'), alien = characterOf('kfb_q_alien')
C.fbChatter = fb?.id === 'frizzlebob' && fb.chatter?.instrument === 'Posaune mit Dämpfer' && chatterOf('FB')?.status === 'set'
C.fbVoice = voiceOf('frizzlebob')?.spec === 'am_michael'
// seit Register @3d847c5 (V-687): farmer_harke ist Alias der Bäuerin farmer_b; todo-Beispiel aus den Daten (Figur ohne Chatter und ohne PREFILL)
const todoId = characterIds().find((id) => !characterOf(id).chatter && !characterOf(id).chatterPrefill)
C.harkeIsFarmerB = resolveCharacterId('farmer_harke') === 'farmer_b' && harke?.chatter?.instrument === 'Akkordeon'
C.todoIsNull = !!todoId && characterOf(todoId).chatter === null && chatterOf(todoId) === null
// PREFILL-Beispiel aus den Daten (Stand Register: Skelette); Aliens sind seit V-685/V-686 SPEC = gesetzt
const pf = characterIds().find((id) => characterOf(id).chatterPrefill)
C.prefillHidden = !!pf && characterOf(pf).chatter === null && chatterOf(pf) === null && chatterOf(pf, { prefill: true })?.status === 'prefill'
C.specIsSet = alien?.chatter?.instrument === 'Theremin' && chatterOf('ghost')?.instrument === 'Singende Säge' && chatterOf('kayfabrick_bot')?.instrument === 'Melodica'
C.frozen = Object.isFrozen(fb)

const withChatter = characterIds().filter((id) => characterOf(id).chatter)
const usedIds = [...new Set(used.map(([, id]) => resolveCharacterId(id)).filter(Boolean))]
process.exitCode = report('characterRegistry', C, {
  commit: REGISTRY_SOURCE.commit.slice(0, 7), figures: characterIds().length, idsChecked: used.length, miss,
  chatterSet: withChatter, usedWithoutChatter: usedIds.filter((id) => !characterOf(id).chatter),
})
