// L1 (V-329) · Licht-Schreiber hinter light=l1: J17-Tageswerte und -Richtung, Gold/Nacht stufenlos, ACES, nur die Sonne wirft Schatten,
// Kontaktschatten unter beiden Figuren, Pool von 6 PointLights ohne Schatten (nachts je Figur eins), Himmel folgt der Tageszeit,
// Kartenpixel bei Tag und Nacht unverändert (G3), ohne Schalter bleibt das bisherige Bühnenlicht.
import { openPage, report } from './_page.mjs'
const ready = (page) => page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S?.billboard?.info()?.source === 'CARD' && S.left?.status().shown && S.right?.status().shown !== false }, null, { timeout: 420000 })
const probe = (page) => page.evaluate(() => { const S = window.__kfbStageMods, c = window.__kfbStageCamera; let scene = null; S.amph.object3d.traverseAncestors((o) => { if (o.isScene) scene = o })
  const lights = []; scene.traverse((o) => { if (o.isLight) lights.push({ type: o.type, cast: !!o.castShadow, i: +(o.intensity || 0).toFixed(3) }) })
  const casters = []; scene.traverse((o) => { if (o.isMesh && o.castShadow && o.name !== 'face') { let n = o; while (n && !n.name?.startsWith('meshy-model') && n.name !== 'amphitheater-model') n = n.parent; if (n) casters.push(o.name) } })
  const f = S.billboard.object3d.getObjectByName('face'); f.updateWorldMatrix(true, false); f.geometry.computeBoundingBox(); const v = f.geometry.boundingBox.clone().applyMatrix4(f.matrixWorld).getCenter(c.position.clone()).project(c)
  return { rimMod: !!S.rim, light: window.__kfbStageLight?.info() || null, lights, stageCasters: casters.length, blobs: S.blobs?.count?.() ?? null, pract: S.practicals?.info?.() || null, faceTM: f.material.toneMapped, sky: window.__kfbStageCtl.sky(), skyView: { top: '#' + window.__kfbStageMods.amph.object3d.parent.getObjectByName?.('sky')?.material.uniforms.top.value.getHexString() },
    cardPx: [(v.x + 1) / 2 * innerWidth, (1 - v.y) / 2 * innerHeight], tm: window.__kfbStageCamera && document.querySelector('canvas') ? null : null } })
const cardMean = async (page, px) => { const b = await page.screenshot({ clip: { x: px[0] - 60, y: px[1] - 40, width: 120, height: 80 } }); return b }
const run = async (h) => { const o = await openPage('#stage,debug,actors=fb' + h, { viewport: { width: 1280, height: 720 } }); await ready(o.page); await o.page.waitForTimeout(1500); const p = await probe(o.page); const img = await cardMean(o.page, p.cardPx); await o.browser.close(); return { ...p, img, errs: o.errs } }
const day = await run(',light=l1,tod=day'), night = await run(',light=l1,tod=night'), base = await run('')
// L2 Schritt 1: Look B (warm) mit Randlicht je Figur gegen Look A; Randlicht nur mit look=…
const runRim = async (h) => { const o = await openPage('#stage,debug,actors=fb' + h, { viewport: { width: 1280, height: 720 } }); await ready(o.page)
  await o.page.waitForFunction(() => (window.__kfbStageMods.rim?.info?.() || []).length === 2, null, { timeout: 120000 }).catch(() => {}); await o.page.waitForTimeout(1500)
  const p = await probe(o.page), rim = await o.page.evaluate(() => window.__kfbStageMods.rim?.info?.() || null), img = await cardMean(o.page, p.cardPx); await o.browser.close(); return { ...p, rim, img, errs: o.errs } }
const la = await runRim(',light=l1,tod=day,look=a'), lb = await runRim(',light=l1,tod=day,look=b')
// L2 Schritt 2: Knet-Material (K1/H0 v8, Profil figure) für KayKit (clay=1) bzw. auch FB (clay=all); Gesicht und Augen bleiben beim eigenen Besitzer
const runClay = async (h) => { const o = await openPage('#stage,debug,actors=fb' + h, { viewport: { width: 640, height: 360 } }); await ready(o.page)
  await o.page.waitForFunction((n) => (window.__kfbStageMods.clay?.info?.() || []).length === n, h.includes('clay=all') ? 2 : 1, { timeout: 120000 }).catch(() => {})
  const r = await o.page.evaluate(() => { const S = window.__kfbStageMods, look = (a) => { const out = []; a.object3d.traverse((m) => { if (m.isMesh) out.push({ n: m.name, clay: !!m.material.userData?.clay, prof: m.material.userData?.clay?.profile, met: m.material.metalness, rough: m.material.roughness }) }); return out }
    return { info: S.clay.info(), right: look(S.right), left: look(S.left) } }); await o.browser.close(); return { ...r, errs: o.errs } }
const c1 = await runClay(',light=l1,tod=day,look=b,clay=1'), call = await runClay(',light=l1,tod=day,look=b,clay=all')
const eyesUntouched = (list) => list.filter((m) => /eye|brow|nose|moust/i.test(m.n)).every((m) => !m.clay)
const sharp = (await import('sharp')).default, mean = async (b) => (await sharp(b).stats()).channels.slice(0, 3).map((c) => c.mean)
const md = await mean(day.img), mn = await mean(night.img), dCard = Math.max(...md.map((v, i) => Math.abs(v - mn[i])))
const ma = await mean(la.img), mb = await mean(lb.img), dCardAB = Math.max(...ma.map((v, i) => Math.abs(v - mb[i])))
const J = day.light
process.exit(report('light L1 + L2-1/2', {
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
  lookBIsWarmerSameSun: lb.light.look === 'b' && la.light.look === 'a' && lb.light.sunI === la.light.sunI && lb.light.sun !== la.light.sun && lb.light.hemiGround !== la.light.hemiGround && lb.skyView.top !== la.skyView.top,
  rimOnBothFiguresOnlyWithLook: Array.isArray(la.rim) && la.rim.length === 2 && la.rim.every((n) => n > 0) && lb.rim.every((n) => n > 0) && day.rimMod === false,
  cardUnchangedAB: dCardAB < 2.5,
  clayKayKitBodyOnly: c1.info.length === 1 && c1.info[0] >= 6 && c1.right.filter((m) => /GothGirl_(Body|Arm|Leg|Head)/.test(m.n)).every((m) => m.clay) && !c1.left.some((m) => m.clay) && eyesUntouched(c1.right),
  clayAllIncludesFbNotFace: call.info.length === 2 && call.left.filter((m) => /CharacterTemplate_/.test(m.n)).every((m) => m.clay) && eyesUntouched(call.left),
  clayMattNoMetal: [...c1.right, ...call.left].filter((m) => m.clay).every((m) => m.met === 0 && m.rough >= 0.3), // G8: kein Metall, kein Glanz
  noPageErrors: day.errs.length === 0 && night.errs.length === 0 && base.errs.length === 0 && la.errs.length === 0 && lb.errs.length === 0 && c1.errs.length === 0 && call.errs.length === 0,
}, { la: { light: la.light, rim: la.rim }, lb: { light: lb.light, rim: lb.rim, skyView: lb.skyView }, dCardAB, day: { light: day.light, pract: day.pract, sky: day.sky, skyView: day.skyView }, night: { light: night.light, pract: night.pract, skyView: night.skyView }, dCard, base: base.lights }))
