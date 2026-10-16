// L1 (V-329) · Licht-Schreiber hinter light=l1: J17-Tageswerte und -Richtung, Gold/Nacht stufenlos, ACES, nur die Sonne wirft Schatten,
// Kontaktschatten unter beiden Figuren, Pool von 6 PointLights ohne Schatten (nachts je Figur eins), Himmel folgt der Tageszeit,
// Kartenpixel bei Tag und Nacht unverändert (G3), ohne Schalter bleibt das bisherige Bühnenlicht.
import { openPage, report } from './_page.mjs'
const ready = (page) => page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S?.billboard?.info()?.source === 'CARD' && S.left?.status().shown && S.right?.status().shown !== false }, null, { timeout: 420000 })
const probe = (page) => page.evaluate(() => { const S = window.__kfbStageMods, c = window.__kfbStageCamera; let scene = null; S.amph.object3d.traverseAncestors((o) => { if (o.isScene) scene = o })
  const lights = []; scene.traverse((o) => { if (o.isLight) lights.push({ type: o.type, cast: !!o.castShadow, i: +(o.intensity || 0).toFixed(3) }) })
  const casters = []; scene.traverse((o) => { if (o.isMesh && o.castShadow && o.name !== 'face') { let n = o; while (n && !n.name?.startsWith('meshy-model') && n.name !== 'amphitheater-model') n = n.parent; if (n) casters.push(o.name) } })
  const f = S.billboard.object3d.getObjectByName('face'); f.updateWorldMatrix(true, false); f.geometry.computeBoundingBox(); const v = f.geometry.boundingBox.clone().applyMatrix4(f.matrixWorld).getCenter(c.position.clone()).project(c)
  return { light: window.__kfbStageLight?.info() || null, lights, stageCasters: casters.length, blobs: S.blobs?.count?.() ?? null, pract: S.practicals?.info?.() || null, faceTM: f.material.toneMapped, sky: window.__kfbStageCtl.sky(), skyView: { top: '#' + window.__kfbStageMods.amph.object3d.parent.getObjectByName?.('sky')?.material.uniforms.top.value.getHexString() },
    cardPx: [(v.x + 1) / 2 * innerWidth, (1 - v.y) / 2 * innerHeight], tm: window.__kfbStageCamera && document.querySelector('canvas') ? null : null } })
const cardMean = async (page, px) => { const b = await page.screenshot({ clip: { x: px[0] - 60, y: px[1] - 40, width: 120, height: 80 } }); return b }
const run = async (h) => { const o = await openPage('#stage,debug,actors=fb' + h, { viewport: { width: 1280, height: 720 } }); await ready(o.page); await o.page.waitForTimeout(1500); const p = await probe(o.page); const img = await cardMean(o.page, p.cardPx); await o.browser.close(); return { ...p, img, errs: o.errs } }
const day = await run(',light=l1,tod=day'), night = await run(',light=l1,tod=night'), base = await run('')
const sharp = (await import('sharp')).default, mean = async (b) => (await sharp(b).stats()).channels.slice(0, 3).map((c) => c.mean)
const md = await mean(day.img), mn = await mean(night.img), dCard = Math.max(...md.map((v, i) => Math.abs(v - mn[i])))
const J = day.light
process.exit(report('light L1', {
  dayIsJ17: J && J.tm === 'aces' && J.sun === '#fff4e6' && J.sunI === 2.9 && J.hemiI === 1.05 && J.backI === 0.6 && Math.abs(J.elev - 48.99) < 0.01 && Math.abs(J.az + 53.13) < 0.01,
  nightIsDarkAndCool: night.light.tod === 0 && night.light.sunI < 0.3 && night.light.hemiI < day.light.hemiI,
  onlySunCastsShadow: day.lights.filter((l) => l.cast).length === 1 && day.lights.filter((l) => l.cast)[0].type === 'DirectionalLight',
  meshyStageCastsNone: day.stageCasters === 0,
  contactUnderBothFigures: day.blobs === 2 && night.blobs === 2,
  fixedPoolOfSix: day.pract?.pool === 6 && night.pract?.pool === 6 && day.lights.filter((l) => l.type === 'PointLight').length === 6,
  nightLendsLightToFigures: night.pract?.actors === 2 && day.pract?.actors === 0,
  skyFollowsTimeOfDay: day.sky.top === night.sky.top && night.skyView.top !== day.skyView.top,
  cardUnchangedDayNight: day.faceTM === false && dCard < 2.5, // G3: mittlere Kartenfarbe Tag vs. Nacht (0–255)
  defaultLightUnchanged: base.light === null && base.lights.some((l) => l.type === 'HemisphereLight' && l.i === 1.25) && base.lights.some((l) => l.type === 'DirectionalLight' && l.i === 1.8),
  noPageErrors: day.errs.length === 0 && night.errs.length === 0 && base.errs.length === 0,
}, { day: { light: day.light, pract: day.pract, sky: day.sky, skyView: day.skyView }, night: { light: night.light, pract: night.pract, skyView: night.skyView }, dCard, base: base.lights }))
