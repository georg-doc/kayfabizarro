// WS-Audio R1 (V-598) · Node-Prüfung ohne Browser: Mixer-Regeln, Zuordnung Ereignis → Ton, Wasser-Ortung, Gang/Drehzahl, Pfad-Schutz des Ton-Servers,
// keine privaten Töne im Repo. Mit lokalem Zwischenspeicher (scripts/audio/prepare.mjs) zusätzlich: jede Bank-Zuordnung findet echte Dateien.
import fs from 'fs'
import os from 'os'
import path from 'path'
import { execSync, spawnSync } from 'child_process'
import { report } from '../_page.mjs'
import { musicDuckDb, sanitizeVolumes, createModeLatch, createShuffle, uniqueTracks, variantsOf, distanceGain, distanceLowpassHz, pickVictim, PLAYLIST_FOR_MODE, SEMANTIC, BUSES } from '../../src/audio/mixer.js'
import { CUES, FLUFFER_SEQUENCE, LAUNCH, ENEMY_GAIN, k10Plan, weaponKind, GROUP_SOUNDS, GROUP_TYPES, groupPlan, groupKey, npcStepCue, stepKey, FLUFFER_PITCH } from '../../src/audio/cueMap.js'
import { createWaterIndex, waterNear, stepSurface, hoverSurface } from '../../src/audio/waterAudio.js'
import { resolveAudioPath } from '../../scripts/audio/vitePrivateAudio.mjs'

// Mixer
const duck = [musicDuckDb({}), musicDuckDb({ loud: true }), musicDuckDb({ dialogue: true }), musicDuckDb({ loud: true, dialogue: true })]
const vol = sanitizeVolumes({ music: 2, sfx: -1, atmo: 'x', muted: true })
const latch = createModeLatch(2.5), seq = [latch.update('drive', 0), latch.update('foot', 1), latch.update('foot', 3.4), latch.update('foot', 3.6), latch.update('fly', 4), latch.update('foot', 5)]
let r = 0.1; const rnd = () => (r = (r * 9301 + 49297) % 233280 / 233280), sh = createShuffle(['a', 'b', 'c', 'd'], rnd), picks = Array.from({ length: 40 }, sh)
const noRepeat = picks.every((x, i) => i === 0 || x !== picks[i - 1]), fullRounds = [0, 4, 8].every((i) => new Set(picks.slice(i, i + 4)).size === 4)
// Varianten: _r ersetzt das Original, Basis ohne Suffix zählt
const files = ['C01_punch_light_a', 'C01_punch_light_b', 'C01_punch_light_c', 'C01_punch_light_c_r', 'DF04_goo_patch_ooze', 'C01_punch_lightning_a']
const v1 = variantsOf('C01_punch_light', files), v2 = variantsOf('DF04_goo_patch_ooze', files)
// Zuordnung: jede bank-Zeile mit set/base, jeder Dark-Fluffer-Schritt verweist auf eine bank-Zeile, K10 deckt die fünf Ereignisse ab
const bank = Object.entries(CUES).filter(([, c]) => c.owner === 'bank'), badBank = bank.filter(([, c]) => !c.set || !(c.base || c.files?.length)).map(([k]) => k)
const flufferOk = Object.values(FLUFFER_SEQUENCE).flat().every(([cue]) => CUES[cue]?.owner === 'bank')
const k10 = ['fire', 'cast', 'release', 'contact', 'weaponDrop'].map((type) => k10Plan({ type, weapon: type === 'fire' ? 'rocket' : 'fist', energy: 0.8 }))
// Combat-AV R1: eigener Abgang je Waffe (13 Arena-Figuren), Ebenen mit Versatz, Gegner leiser + Whoosh, confirm nur eigene Treffer, Klinge Schwung zuerst,
// Gatling als Schleife, Rauchbombe T08, weaponDrop I05; jede Ebene verweist auf eine Bank-Zeile
const arena = ['pistol', 'blaster', 'action-rifle', 'soldier-r3d', 'gatling', 'crossbow', 'smoke', 'blade', 'wand', 'staff', 'skeleton-staff', 'bow', 'bow-a']
const kinds = arena.map(weaponKind), launchCues = Object.values(LAUNCH).flat().map(([c]) => c)
const pistol = k10Plan({ type: 'fire', weapon: 'pistol' }), enemyFire = k10Plan({ type: 'fire', weapon: 'pistol', side: 'enemy' }), gat = k10Plan({ type: 'fire', weapon: 'gatling' })
const bladeHit = k10Plan({ type: 'contact', weapon: 'blade', confirmed: true }), hurt = k10Plan({ type: 'contact', target: 'player', confirmed: true }), smoke = k10Plan({ type: 'contact', weapon: 'smoke' })
const gaps = Object.entries(CUES).filter(([, c]) => c.owner === 'gap').map(([k]) => k)
// Wasser-Ortung: Fluss nah, Fall fern, Meer am Rand; Biom mit Nachlauf
const W = createWaterIndex({ lines: [{ pts: [{ x: 0, z: 0, lv: 1 }, { x: 20, z: 0, lv: 1 }] }], falls: [{ b: { x: 400, z: 0 }, bot: 2 }], lakes: [{ cells: [0, 1, 2], lv: 3 }], grid: { HG: 4, HN: 100, o: 100 }, seaY: 0, height: (x) => (x > 150 ? -1 : 1), R: 200 })
const q1 = waterNear(W, { x: 10, y: 0, z: 30 }), q2 = waterNear(W, { x: 120, y: 0, z: 0 }), q3 = waterNear(W, { x: 90, y: 0, z: 0 }, 'beach'), q4 = waterNear(W, { x: 90, y: 0, z: 0 }, 'meadow')
const surf = [stepSurface({ r: 1, flatR: 5 }), stepSurface({ r: 50, flatR: 5, y: 0.2, seaY: 0 }), stepSurface({ r: 50, flatR: 5, nearWater: 3 }), stepSurface({ r: 50, flatR: 5 })]
// Ton-Server: nur unter den Wurzeln, kein ../
const R = { 'index.json': '/c/index.json', wsa: '/c/wsa', site: '/c/site', el: '/p/el', 'music/suno': '/p/suno', 'music/cozy': '/p/cozy' }
const paths = [resolveAudioPath('el/dark_fluffer_r1/DF01_windup_gurgle_a.mp3', R), resolveAudioPath('el/../../etc/passwd', R), resolveAudioPath('music/suno/..%2F..%2Fx', R), resolveAudioPath('nope/x', R), resolveAudioPath('index.json', R)]
// Repo: keine Ton-/Musikdateien unter Versionsverwaltung außer den bisherigen öffentlichen (es gab keine)
const tracked = execSync('git ls-files', { encoding: 'utf8' }).split('\n').filter((f) => /\.(mp3|ogg|wav|m4a|flac)$/i.test(f))
// Mit lokalem Zwischenspeicher: jede bank-Zuordnung hat Dateien
const idxPath = path.join(process.env.KFB_AUDIO_CACHE || path.join(os.homedir(), 'kfb-ws1/.kfb-audio-cache'), 'index.json')
let missing = null, cache = false
if (fs.existsSync(idxPath)) { cache = true; const idx = JSON.parse(fs.readFileSync(idxPath, 'utf8')); const have = (c) => idx.sets?.[c.set]?.files || []; missing = bank.filter(([, c]) => !c.set.startsWith('site:')).filter(([, c]) => c.files ? !c.files.every((f) => have(c).includes(f)) : !variantsOf(c.base, have(c)).length).map(([k]) => k) }

// Private MVP-Site (V-618): site-copy nur mit SITE=1; mit Zwischenspeicher: Trockenlauf ohne fehlende Dateien und ohne Datei > 25 MiB
const siteNo = spawnSync(process.execPath, ['scripts/audio/site-copy.mjs', '--dry'], { env: { ...process.env, SITE: '' }, encoding: 'utf8' })
const siteDry = cache ? spawnSync(process.execPath, ['scripts/audio/site-copy.mjs', '--dry'], { env: { ...process.env, SITE: '1' }, encoding: 'utf8' }) : null
const siteJson = siteDry?.status === 0 ? JSON.parse(siteDry.stdout.trim().split('\n').pop()) : null
const rootDefault = fs.readFileSync('src/audio/kfbAudio.js', 'utf8').includes("import.meta.env?.VITE_KFB_AUDIO_ROOT || '/@kfb-audio/'")
process.exit(report('audio-mixer', {
  busesFour: BUSES.join() === 'music,sfx,atmo,ui',
  semanticToBus: SEMANTIC.WORLD_SFX === 'sfx' && SEMANTIC.GLOBAL_BED === 'atmo' && SEMANTIC.SCORE === 'music',
  duckRules: duck[0] === 0 && duck[1] < 0 && duck[2] < duck[1] && duck[3] === duck[2],
  volumesClamped: vol.music === 1 && vol.sfx === 0 && vol.atmo === 0.7 && vol.muted === true,
  playlistByMode: PLAYLIST_FOR_MODE.drive === 'suno' && PLAYLIST_FOR_MODE.fly === 'suno' && PLAYLIST_FOR_MODE.foot === 'cozy',
  modeLatchHolds: seq.join() === 'suno,suno,suno,cozy,cozy,cozy',
  shuffleNoRepeat: noRepeat && fullRounds,
  uniqueTracks: uniqueTracks(['A.mp3', 'B.m4a', 'B.mp3', 'C.ogg']).join() === 'A.mp3,B.mp3,C.ogg',
  variantsPreferReplacement: v1.join() === 'C01_punch_light_a,C01_punch_light_b,C01_punch_light_c_r' && v2.join() === 'DF04_goo_patch_ooze',
  distance: distanceGain(4) === 1 && distanceGain(40) < 0.2 && distanceGain(1000) === distanceGain(220) && distanceLowpassHz(10) === 16000 && distanceLowpassHz(200) < 3000,
  voicePoolVictim: pickVictim([{ prio: 2, at: 0 }, { prio: 1, at: 5 }, { prio: 1, at: 3 }]).at === 3,
  bankRowsComplete: badBank.length === 0 && bank.length >= 30,
  flufferAllEvents: ['windup', 'spit', 'impact', 'taint', 'drop', 'healed', 'burst'].every((k) => FLUFFER_SEQUENCE[k]) && flufferOk && FLUFFER_SEQUENCE.healed.some(([c]) => c === 'fluffer.eyes'),
  k10FiveEvents: k10.every(Boolean) && k10[0].combat === 'rocketLaunch' && k10[3].combat === 'punchHeavy' && k10[4].layers[0][0] === 'k10.weaponDrop',
  combatAvWeaponsMapped: kinds.every((k) => LAUNCH[k]) && !!k10Plan({ type: 'fire', weapon: 'unbekannt-xyz' }).layers.length && kinds.every(Boolean) && new Set(kinds).size >= 8 && kinds[2] === 'rifle' && kinds[7] === 'melee',
  combatAvLayers: pistol.layers[0][0] === 'av.C05ab' && pistol.layers[1][1] === 0.06 && LAUNCH.blaster.length === 3 && launchCues.every((c) => CUES[c]?.owner === 'bank'),
  combatAvEnemyQuiet: enemyFire.layers.length === 1 && enemyFire.layers[0][0] === 'av.enemy' && enemyFire.layers[0][2] === ENEMY_GAIN && 20 * Math.log10(ENEMY_GAIN) <= -6,
  combatAvConfirmOwnOnly: bladeHit.confirm === true && bladeHit.swingFirst === true && hurt.confirm === false,
  combatAvGatlingSmoke: gat.loop === 'gatling' && CUES['av.gatlingLoop']?.owner === 'bank' && smoke.layers[0][0] === 'k10.smoke',
  npcGroupsComplete: ['skeleton_patrol', 'toy_squad', 'bot_crew'].every((g) => GROUP_TYPES.every((t) => groupPlan({ group: g, type: t, n: 1 })?.length >= 1)) && Object.values(GROUP_SOUNDS).every((G) => Object.values(G).flat().every(([c]) => c.startsWith('combat:') || CUES[c]?.owner === 'bank')),
  npcHitLevelAndKey: groupPlan({ group: 'toy_squad', type: 'hit', n: 3 })[0][2] > groupPlan({ group: 'toy_squad', type: 'hit', n: 1 })[0][2] && groupPlan({ group: 'x', type: 'hit' }) === null && groupKey({ group: 'bot_crew', type: 'ko', id: 'bot_comic', t: 12.5 }) === 'bot_crew|ko|bot_comic|12.5' && groupKey({ type: 'fluff', tag: 'f7' }) === 'fluff|f7',
  npcSteps: npcStepCue({ group: 'skeleton_patrol' }) === 'npc.stepSkel' && npcStepCue({ group: 'bot_crew' }) === 'npc.stepBot' && npcStepCue({}, 'foley-concrete') === 'npc.stepStone' && npcStepCue({}, 'sand') === 'npc.stepPath' && npcStepCue({}) === 'npc.stepGrass'
    && stepKey({ id: 'toy_3', foot: 'l', t: 4.2 }) === 'toy_3|l|4.2' && stepKey({ id: 'df', t: 9 }) === 'df|9' && CUES['fluffer.hop']?.owner === 'bank'
    && ['npc.stepGrass', 'npc.stepPath', 'npc.stepStone', 'npc.stepSkel', 'npc.stepToy', 'npc.stepBot'].every((c) => CUES[c].set === 'npc_steps_r1'),
  flufferPitchSmaller: FLUFFER_PITCH > 1.02 && FLUFFER_PITCH < 1.06 && Object.entries(CUES).filter(([k]) => k.startsWith('fluffer.')).every(([, c]) => c.pitch === FLUFFER_PITCH),
  gapsListed: gaps.includes('atmo.weather') && !gaps.includes('k10.kill') && !gaps.includes('k10.playerHurt') && !gaps.includes('vehicle.tyres'),
  ws0CombatAvDelivered: LAUNCH.bow[0][0] === 'k10.bowRelease' && LAUNCH.crossbow[0][0] === 'k10.crossbowRelease' && LAUNCH.magic[0][0] === 'k10.magicCast' && LAUNCH.dice[0][0] === 'k10.diceFlick'
    && k10Plan({ type: 'contact', target: 'player' }).layers[0][0] === 'k10.playerHurt' && k10Plan({ type: 'contact', target: 'player', weapon: 'bite' }).layers[0][0] === 'k10.mobBite' && k10Plan({ type: 'kill' }).layers[0][0] === 'k10.kill'
    && k10Plan({ type: 'windup', side: 'enemy' }).layers[0][0] === 'k10.mobWindup' && k10Plan({ type: 'contact', weapon: 'bow', confirmed: true }).layers[0][0] === 'k10.arrowHit' && k10Plan({ type: 'contact', weapon: 'wand' }).layers[0][0] === 'k10.magicHit'
    && k10Plan({ type: 'contact', weapon: 'smoke' }).layers.length === 2 && CUES['k10.weaponDrop'].files[0] === 'L10_weapon_drop' && CUES['k10.gatlingSpin'].loop === true,
  ws0NpcDelivered: groupPlan({ group: 'skeleton_patrol', type: 'ko' }).some(([c]) => c === 'npc.boneCollapse') && groupPlan({ group: 'bot_crew', type: 'aggro' })[0][0] === 'npc.botAngry' && groupPlan({ group: 'toy_squad', type: 'aggro' })[0][0] === 'npc.toyCall' && CUES['fluffer.hopHealed']?.set === 'npc_steps_r1' && CUES['npc.fluffGlide'].loop && CUES['npc.toyTick'].loop,
  ws0GapsR1Mapped: ['drive.surface.grass', 'drive.surface.sand', 'drive.surface.rock', 'drive.surface.water', 'drive.drift', 'vehicle.brake', 'foot.wade', 'k10.bombThrow', 'impact.metal', 'debris.tail', 'tree.leaves'].every((c) => /^(ws_audio_gaps_r1|combat_av_fix_r[12])$/.test(CUES[c]?.set)) && k10Plan({ type: 'contact', weapon: 'pistol', material: 'metal' }).layers.some(([c]) => c === 'impact.metal') && k10Plan({ type: 'release', weapon: 'bomb' }).layers[0][0] === 'k10.bombThrow',
  hoverSurfaces: [hoverSurface({ slope: 0.9 }), hoverSurface({ slope: 0.1, y: 2 }), hoverSurface({ nearWater: 3 }), hoverSurface({ slope: 0.4 })].join() === 'rock,grass,water,sand' && stepSurface({ r: 50, flatR: 5, nearWater: 1 }) === 'water',
  waterNearest: q1.emitters.some((e) => e.id === 'river' && e.d < 35) && !q1.emitters.some((e) => e.id === 'fall') && q2.emitters.some((e) => e.id === 'sea'),
  biomeHysteresis: q3.biome === 'beach' && q4.biome === 'meadow',
  stepSurfaces: surf.join() === 'foley-concrete,sand,wet-clay,digital-grass',
  serverPathGuard: paths[0] === path.resolve('/p/el/dark_fluffer_r1/DF01_windup_gurgle_a.mp3') && paths[1] === null && paths[2] === null && paths[3] === null && paths[4] === '/c/index.json',
  noAudioInRepo: tracked.length === 0,
  siteCopyOnlyWithSite: siteNo.status === 2 && rootDefault && (siteDry === null || (siteJson && siteJson.dry && siteJson.files > 300 && siteJson.mb < 400)),
  bankFilesExist: missing === null || missing.length === 0,
}, { gaps, cache, missing, tracked: tracked.slice(0, 5) }))
