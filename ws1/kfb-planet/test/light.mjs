// L3 (V-382/V-385/V-386/V-392, LIGHT_MODEL_R2) · Licht nur aus dem Bühnen-Licht-Modul: J17-Tag, Gold/Nacht als Rig-Einstellungen, ein Tonemapping für
// alle Schichten, nur die Sonne wirft Schatten (Bias abgeleitet), kein Rand- und kein Gegenlicht, genau ein warmes Figurenlicht (nachts stärker als tags),
// Karte = beleuchtetes mattes Papier (nachts dunkler als tags), Praktische als Pool (am Amphitheater ohne Lampen, V-429), ein Rig: Figuren werfen und empfangen Schatten (V-429), Kontakt-AO unter beiden Figuren,
// Figuren-Samt ≤ 0,05, Spalt-Selbsttest = 0, Himmel folgt der Tageszeit, Schattenlänge folgt der Sonnenhöhe; ohne Schalter bleibt das alte Bühnenlicht.
// Standard-Stimmung ist Mesa (V-402, Georg 17.10.); J17 (lset=r2) bleibt Referenz und wird mitgeprüft.
import { openPage, report } from './_page.mjs'
import { MOODS, MOODS_MESA, shadowLength } from '../src/vendor/light/kfb-stage-light.v1.1.js'
const ready = (page) => page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S?.billboard?.info()?.source === 'CARD' && S.billboard.lamps?.().status !== 'LOADING' && S.left?.status().shown && S.right?.status().shown !== false }, null, { timeout: 420000 })
const probe = (page) => page.evaluate(() => { const S = window.__kfbStageMods, c = window.__kfbStageCamera; let scene = null; S.amph.object3d.traverseAncestors((o) => { if (o.isScene) scene = o })
  const lights = []; scene.traverse((o) => { if (o.isLight) lights.push({ type: o.type, name: o.name, cast: !!o.castShadow, i: +(o.intensity || 0).toFixed(3) }) })
  let rimMats = 0, sheenMax = 0; for (const a of [S.left, S.right]) a?.object3d.traverse((m) => { if (!m.isMesh) return; [].concat(m.material).forEach((x) => { if (x?.userData?.kfbRim) rimMats++; if (x?.userData?.clay || x?.userData?.kfbClay) sheenMax = Math.max(sheenMax, x.sheen || 0) }) })
  const f = S.billboard.object3d.getObjectByName('face'); f.updateWorldMatrix(true, false); f.geometry.computeBoundingBox(); const v = f.geometry.boundingBox.clone().applyMatrix4(f.matrixWorld).getCenter(c.position.clone()).project(c)
  const figShadow = [S.left, S.right].map((a) => { let cast = 0, recv = 0, n = 0; a?.object3d.traverse((m) => { if (!m.isMesh || !m.visible || !/_(Body|Arm|Leg|Head)/.test(m.name || '')) return; n++; if (m.castShadow) cast++; if (m.receiveShadow) recv++ }); return { n, cast, recv } }) // Körperteile (Augen-Rig, Brauen, Nase bleiben schattenlos wie bisher)
  const lamps = !!S.billboard.object3d.getObjectByName('billboard-lamps'), b22 = S.billboard.lamps?.() || null
  const L = window.__kfbStageLight
  return { info: L?.info() || null, lights, rimMats, sheenMax, toneSplit: !!S.tones, blobs: S.blobs?.count?.() ?? null, pract: S.practicals?.info?.() || null, figShadow, lamps, b22, face: { std: !!f.material.isMeshStandardMaterial, tm: f.material.toneMapped },
    sky: window.__kfbStageCtl.sky(), skyTop: (() => { const m = scene.getObjectByName('sky'); return m ? '#' + m.material.uniforms.top.value.getHexString() : null })(), cardPx: [(v.x + 1) / 2 * innerWidth, (1 - v.y) / 2 * innerHeight] } })
const sharp = (await import('sharp')).default
const lum = async (b) => { const s = await sharp(b).stats(); const [r, g, bb] = s.channels.slice(0, 3).map((ch) => ch.mean); return 0.2126 * r + 0.7152 * g + 0.0722 * bb }
const run = async (h, test = false) => { const o = await openPage('#stage,debug,actors=fb,nobar' + h, { viewport: { width: 1280, height: 720 } }); await ready(o.page)
  await o.page.waitForFunction(() => (window.__kfbStageMods.clay?.info?.() || []).length >= 1 || /clay=0/.test(location.hash), null, { timeout: 120000 }).catch(() => {}); await o.page.waitForTimeout(1800)
  const p = await probe(o.page), card = await lum(await o.page.screenshot({ clip: { x: p.cardPx[0] - 60, y: p.cardPx[1] - 40, width: 120, height: 80 } }))
  const self = test ? await o.page.evaluate(() => window.__kfbStageLight.selfTest()) : null; await o.browser.close(); return { ...p, card, self, errs: o.errs } }
const day = await run(',light=l1,tod=day', true), gold = await run(',light=l1,tod=gold'), night = await run(',light=l1,tod=night'), base = await run(''), j17 = await run(',light=l1,tod=day,lset=r2')
const M = (r) => r.info?.mood || {}, S = (r) => r.info?.shadow || {}
const typ = (r, t) => r.lights.filter((l) => l.type === t)
process.exit(report('light L3 (Licht-Modul R2)', {
  defaultIsMesa: day.info?.lset === 'mesa' && day.info?.tm === 'aces' && M(day).sun === MOODS_MESA.day.sun && M(day).sunI === MOODS_MESA.day.sunI && M(day).hemiSky === MOODS_MESA.day.hemiSky,
  j17ReferenceKept: j17.info?.lset === 'r2' && M(j17).sun === MOODS.day.sun && M(j17).sunI === 2.9 && Math.abs(M(j17).elev - 48.99) < 0.01 && M(j17).az === -53.13 && M(j17).hemiI === 1.05,
  goldLowWarmCoolFill: M(gold).elev < 20 && M(gold).sun !== M(day).sun && M(gold).hemiSky !== M(day).hemiSky && M(gold).hemiI >= M(day).hemiI, // Füllung kühler, nicht dunkler (V-050)
  nightMoonDim: M(night).sunI < 0.6 && M(night).hemiI < M(day).hemiI,
  oneToneForAll: day.info?.schema === 'kfb.stage-light/1' && !day.toneSplit && day.face.tm === true, // Regel 5: kein toneSplit, Karte im selben Ton-Pfad
  onlySunCastsShadow: day.lights.filter((l) => l.cast).length === 1 && day.lights.find((l) => l.cast)?.name === 'sun',
  noRimNoBackLight: typ(day, 'DirectionalLight').length === 1 && day.rimMats === 0 && night.rimMats === 0, // V-392: kein Gegenlicht, kein Fresnel-Rand
  oneFigureLightWarm: typ(day, 'SpotLight').length === 1 && typ(day, 'SpotLight')[0].name === 'figure-light' && !typ(day, 'SpotLight')[0].cast && typ(night, 'SpotLight')[0].i > typ(day, 'SpotLight')[0].i, // Regel 11
  biasDerived: Math.abs(S(day).normalBias - 1.5 * S(day).texel) < 1e-3 && Math.abs(S(day).bias / (-(0.5 * S(day).texel) / (S(day).far - S(day).near)) - 1) < 0.03, // nie feste Zahl (F5)
  gapSelfTestZero: day.self?.pass === true,
  cardIsLitPaper: day.face.std && day.card > night.card * 1.1 && night.card > day.card * 0.5 && gold.card <= day.card * 1.05, // Regel 8: Helligkeit folgt der Stimmung; nachts leuchten die B22-Lampen die Karte aus (V-430: lesbar, aber dunkler als tags)
  practicalsB22LampsNotSelfBuilt: day.pract?.pool === 6 && day.pract?.lit === 0 && night.pract?.lit >= 2 && typ(day, 'PointLight').length === 6 && !day.lamps && night.b22?.status === 'OK' && night.b22.count >= 2, // V-429: Lampen nur als WSB-Asset (B22 r3), nachts Licht-Inseln
  oneRigFiguresCastAndReceive: day.figShadow.every((f) => f.n >= 5 && f.cast === f.n && f.recv === f.n), // V-429 Punkt 1 (V-417 auf der Bühne aufgehoben)
  contactAOUnderBoth: day.blobs === 2 && night.blobs === 2,
  figureSheenMax005: day.sheenMax > 0 && day.sheenMax <= 0.05, // Regel 1
  skyFollowsTimeOfDay: day.sky.top === night.sky.top && day.skyTop !== night.skyTop && gold.skyTop !== day.skyTop,
  shadowFollowsSun: Math.abs(M(day).shadowLen - shadowLength(MOODS_MESA.day.elev)) < 0.01 && M(gold).shadowLen > M(day).shadowLen * 3,
  defaultLightUnchanged: base.info === null && base.lights.some((l) => l.type === 'HemisphereLight' && l.i === 1.25) && base.lights.some((l) => l.type === 'DirectionalLight' && l.i === 1.8),
  noPageErrors: [day, gold, night, base, j17].every((r) => r.errs.length === 0),
}, { day: { info: day.info, pract: day.pract, figShadow: day.figShadow, card: +day.card.toFixed(1), self: day.self, sheenMax: day.sheenMax }, gold: { mood: M(gold), card: +gold.card.toFixed(1) }, night: { mood: M(night), pract: night.pract, card: +night.card.toFixed(1), lights: night.lights } }))
