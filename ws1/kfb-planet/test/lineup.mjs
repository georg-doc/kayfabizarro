// L2 Schritt 3 (V-340) · Aufstellung: 14 Fahrzeuge v3 geladen, Größe relativ zu FB wie im WS0-Größenblatt (Rig-Einheiten, FB = 2,94 Rig),
// Knet-Material für Fahrzeuge matt und ohne Metall (G8), keine Seitenfehler. Lädt ≈ 65 MB von GitHub, daher nicht in `npm test`, sondern `npm run test:lineup`.
import { openPage, report } from './_page.mjs'
const { browser, page, errs } = await openPage('#stage,debug,actors=fb,lineup=1,light=l1,tod=day,clay=1', { viewport: { width: 1280, height: 720 } })
await page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.lineup?.status().status === 'OK' && S.left?.status().shown && (S.clayV?.info?.() || []).length === 1 }, null, { timeout: 480000 })
const r = await page.evaluate(() => { const S = window.__kfbStageMods, st = S.lineup.status(), fb = new (S.lineup.object3d.position.constructor)()
  let fbH = 0; { const box = []; S.left.object3d.updateWorldMatrix(true, true); let lo = Infinity, hi = -Infinity; S.left.object3d.traverse((o) => { if (o.isMesh && o.geometry) { o.geometry.computeBoundingBox(); const b = o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld); lo = Math.min(lo, b.min.y); hi = Math.max(hi, b.max.y) } }); fbH = hi - lo }
  const mats = []; S.lineup.object3d.traverse((o) => { if (o.isMesh && o.name !== 'lineup-ground') [].concat(o.material).forEach((m) => mats.push({ clay: !!(m.userData?.kfbClay || m.userData?.clay), met: m.metalness, rough: m.roughness, sheen: m.sheen })) })
  return { st, info: S.lineup.info(), fbH, mats } })
await browser.close()
const dr = r.info.find((x) => x.id === 'crimson_flame_dragster'), ha = r.info.find((x) => x.id === 'rustwing_hauler')
const ratio = (x) => x.stageLength / (2.94 * r.st.scale)
process.exit(report('lineup L2-3', {
  allFourteenLoaded: r.st.loaded === 14 && r.info.length === 14 && r.st.status === 'OK',
  dragsterToFbLikeSizeSheet: Math.abs(ratio(dr) - 8.4042 / 2.94) < 0.06, // v3: 8,40 Rig Länge zu 2,94 Rig FB
  haulerToFbLikeSizeSheet: Math.abs(ratio(ha) - 10.9437 / 2.94) < 0.08,
  vehiclesClayMattNoMetal: r.mats.length > 0 && r.mats.every((m) => m.clay && m.met === 0 && m.rough >= 0.3),
  vehiclesClaySheenV385: r.mats.every((m) => !(m.sheen > 0.05)), // V-429: Profil midground aus kfb-clay.v1.1 (Samt 0,02, ≤ 0,05 nach V-385) statt eigener WS1-Werte
  noPageErrors: errs.length === 0,
}, { st: r.st, dragster: dr, hauler: ha, fbH: r.fbH, ratios: [ratio(dr), ratio(ha)], mats: r.mats.length }))
