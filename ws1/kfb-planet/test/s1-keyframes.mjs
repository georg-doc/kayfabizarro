// S1 Fortbewegung · Schritt 0b (V-740): Bild-Paket mit 6 Keyframes aus dem Live-Stand, gestellt mit vorhandenen Teilen (nichts davon ist gebaut).
// 1 zu Fuß mit HUD 3D (echt) · 2 Auto rufen: Wagen erscheint klein neben der Figur und wächst (gestellt: Maßstab) · 3 Einsteigen: Figur bis zur Hüfte im
// Dach (gestellt: Figur auf die Dachfläche gesetzt; J-7 geliefert, noch nicht eingebaut) · 4 Fahrt mit Figur im Dach (gestellt) · 5 Verschwinden: Wagen schrumpft neben der Figur (gestellt,
// Fluff-Wolke fehlt noch: Richtung build/suck) · 6 Flug: Figur im Schwungflug flight=elan (echt). Einzelbilder 1600×900 @2, JPG 88, index.json.
// Ablage ~/kfb-ws1/research/audits/abnahme/s1-fortbewegung/. Nur im Test-Slot.
import fs from 'fs'
import os from 'os'
import path from 'path'
import { chromium } from 'playwright'
const sharp = (await import('sharp')).default
const OUT = process.env.S1_OUT || path.join(os.homedir(), 'kfb-ws1/research/audits/abnahme/s1-fortbewegung' + (process.env.S1_QUICK ? '-quick' : '')); fs.mkdirSync(OUT, { recursive: true })
const BASE = '#m1,harvest,debug,clean,look=terrain3,world=probe,hud=3d', RACER = process.env.S1_RACER || 'crimson_flame_dragster', index = []
const launch = async (hash, ready) => { const browser = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
  const page = await (await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 })).newPage(); page.on('pageerror', (e) => console.log('err', e.message))
  await page.goto('file://' + path.resolve('dist/index.html') + hash); await page.waitForFunction(ready, null, { timeout: 240000 }); await page.mouse.click(800, 450); await page.waitForTimeout(2500); return { browser, page } }
const saveShot = async (page, n, name, text, hash, gestellt) => { const f = `s1-${n}-${name}.jpg`; await sharp(await page.screenshot()).jpeg({ quality: 88 }).toFile(path.join(OUT, f)); index.push({ file: f, nr: n, szene: text, hash, gestellt }); console.log('ok', f) }
const saveUrl = async (url, n, name, text, hash, gestellt) => { const f = `s1-${n}-${name}.jpg`; await sharp(Buffer.from(url.split(',')[1], 'base64')).flatten().jpeg({ quality: 88 }).toFile(path.join(OUT, f)); index.push({ file: f, nr: n, szene: text, hash, gestellt }); console.log('ok', f) }

// ---- 1 zu Fuß (echt, mit HUD 3D) und 6 Flug (echt, Schwungflug)
{ const hash = BASE + ',flight=elan'; const { browser, page } = await launch(hash, () => window.__kfbM1?.status?.().ready?.player === 'OK')
  await page.keyboard.down('KeyW'); await page.waitForTimeout(1600); await page.keyboard.up('KeyW'); await page.waitForTimeout(400)
  await saveShot(page, 1, 'zu-fuss', 'Zu Fuß unterwegs; HUD 3D unten (das Fahrzeug-Symbol zum Rufen baut WS1e, fehlt noch)', hash, false)
  // Flug: Schwungflug starten (wie zweimal Leertaste), etwas Höhe und Vorwärts
  await page.evaluate(() => { const p = window.__kfbM1.player(), s = window.__kfbM1.status().pos; p.teleport([-109, s[1] + 40, 145], 2.4); p.setFlying(true) }); await page.waitForTimeout(600)
  await page.keyboard.down('KeyW'); await page.waitForTimeout(2200); await page.keyboard.up('KeyW')
  await saveShot(page, 6, 'flug', 'Flug: Figur im Schwungflug (flight=elan, vorhanden); Racer-Flug (fly) ebenfalls vorhanden – Übergang Auto ↔ Flug fehlt', hash, false)
  await browser.close() }

// ---- 2–5 gestellt im Auto-Modus: Figur steht eingefroren, Wagen daneben; Lage je Bild in EINEM Zeichenschritt gesetzt
{ const hash = BASE + ',car,racer=' + RACER; const { browser, page } = await launch(hash, () => window.__kfbM2?.stats?.model === 'OK' && window.__kfbM1?.status?.().ready?.player === 'OK')
  await page.addStyleTag({ content: '#m2-kind,#m2-keys{display:none!important}' })
  // Wagen 4 m rechts neben die Figur, gleiche Blickrichtung
  const placeCar = () => page.evaluate(() => { const M1 = window.__kfbM1, M = window.__kfbM2, s = M1.status().pos, fig = M1.mods.player.object3d, q = fig.getWorldQuaternion(fig.quaternion.clone()), yaw = Math.atan2(2 * (q.w * q.y + q.x * q.z), 1 - 2 * (q.y * q.y + q.x * q.x))
    const x = s[0] + Math.cos(yaw) * -4, z = s[2] + Math.sin(yaw) * 4; M.camPose(null); M.setKind('k2b', { p: [x, M.ground(x, z) + 1.2, z], yaw }); return { fig: s, yaw } })
  await placeCar(); await page.waitForTimeout(2600)
  const DRIVER = JSON.parse(fs.readFileSync('src/data/vehicles/kfb-vehicle-rig.r1.json', 'utf8'))
  const stage = (opts) => page.evaluate((o) => { const M1 = window.__kfbM1, M = window.__kfbM2, gl = M.renderer(), cam = M.camera(), pr = gl.getPixelRatio(); let root = M.headlights.inst.group; while (root.parent) root = root.parent
    const fig = M1.mods.player.object3d, car = M.stats.rig.stretch, vis = M.stats.rig.object3d, fp = fig.position.clone(), fs0 = fig.scale.clone(), vs0 = vis.scale.clone()
    if (o.camPose) { M.camPose(o.camPose) } gl.setPixelRatio(devicePixelRatio)
    // Maße: Figur- und Wagen-Hülle in Weltkoordinaten
    const box = (obj) => { const b = { min: [1e9, 1e9, 1e9], max: [-1e9, -1e9, -1e9] }; obj.updateMatrixWorld(true); obj.traverse((m) => { if (!m.isMesh || !m.geometry) return; m.geometry.computeBoundingBox(); const bb = m.geometry.boundingBox.clone().applyMatrix4(m.matrixWorld); for (let i = 0; i < 3; i++) { b.min[i] = Math.min(b.min[i], bb.min.getComponent(i)); b.max[i] = Math.max(b.max[i], bb.max.getComponent(i)) } }); return b }
    if (o.carScale != null) vis.scale.setScalar(o.carScale)
    if (o.seat) { const T = fig.position.constructor, nm = (c) => { let n = 0; c.traverse((m) => { if (m.isMesh) n++ }); return n }, model = car.children.slice().sort((a, b) => nm(b) - nm(a))[0], fb = box(fig), figH = fb.max[1] - fb.min[1]; model.updateMatrixWorld(true)
      // Dachfläche am Fahrer-Punkt (Rig-Daten driver, gleiche Lage wie J-7 KFB_roof_seat): höchster Wagen-Punkt im Umkreis 0,35 m
      const d = new T(...o.driver).applyMatrix4(model.matrixWorld), v = new T(); let roof = -1e9
      model.traverse((m) => { if (!m.isMesh || !m.visible || !m.geometry?.attributes?.position) return; const a = m.geometry.attributes.position; for (let i = 0; i < a.count; i++) { v.fromBufferAttribute(a, i).applyMatrix4(m.matrixWorld); if (Math.hypot(v.x - d.x, v.z - d.z) < 0.35 && v.y > roof) roof = v.y } })
      if (roof < -1e8) roof = box(car).max[1]
      const dy = (roof - 0.3 * figH) - fb.min[1], w = fig.getWorldPosition(new T()); w.set(d.x + (w.x - (fb.min[0] + fb.max[0]) / 2), w.y + dy, d.z + (w.z - (fb.min[2] + fb.max[2]) / 2))
      fig.position.copy(w.applyMatrix4(fig.parent.matrixWorld.clone().invert())); window.__s1seat = { roof, d: d.toArray(), figH } }
    cam.updateMatrixWorld(); fig.updateMatrixWorld(true); gl.render(root, cam); const url = gl.domElement.toDataURL('image/png')
    fig.position.copy(fp); fig.scale.copy(fs0); vis.scale.copy(vs0); gl.setPixelRatio(pr); return url }, { ...opts, driver: (DRIVER.vehicles || DRIVER.racers || DRIVER)[RACER].driver })
  const side = { dist: 11, yaw: 2.3, pitch: 0.28, ty: 0.6, ahead: 0 }
  await page.evaluate((p) => window.__kfbM2.camPose(p), side); await page.waitForTimeout(900)
  await saveUrl(await stage({ carScale: 0.45 }), 2, 'auto-rufen', 'Auto rufen: der gewählte Racer erscheint neben der Figur und wächst auf volle Größe (gestellt: Maßstab 45 %; Entstehen über kfb-fluff-suck Richtung build fehlt)', hash, true)
  await saveUrl(await stage({ seat: true }), 3, 'einsteigen', 'Einsteigen: Figur hüpft hinein und steckt bis zur Hüfte im Dach (gestellt: Figur auf die Dachfläche am Fahrer-Punkt gesetzt; Sitz-Anker, Lenkrad und Hineinhüpf-Clip hat WSB mit J-7 geliefert, privat, noch nicht eingebaut; FB-Teile gesperrt bis FB_CANON)', hash, true)
  await page.evaluate(() => window.__kfbM2.camPose(null)); await page.keyboard.down('KeyW'); await page.waitForTimeout(1800)
  await page.evaluate(() => window.__kfbM2.camPose({ dist: 10, yaw: Math.PI - 0.55, pitch: 0.3, ty: 0.6, ahead: 0 })); await page.waitForTimeout(300)
  await saveUrl(await stage({ seat: true }), 4, 'fahrt', 'Fahrt: Figur im Dach fährt mit (gestellt; heute fährt der Wagen ohne Figur, Lenkrad fehlt noch)', hash, true); await page.keyboard.up('KeyW')
  await page.waitForTimeout(800); await placeCar(); await page.waitForTimeout(2200); await page.evaluate(() => window.__kfbM2.camPose({ dist: 11, yaw: 2.3, pitch: 0.28, ty: 0.6, ahead: 0 })); await page.waitForTimeout(900)
  await saveUrl(await stage({ carScale: 0.3 }), 5, 'verschwinden', 'Aussteigen und Verschwinden: zweiter Klick, Figur steht neben dem Wagen, der wie ein Reittier verschwindet (gestellt: Maßstab 30 %; Einsaugen über kfb-fluff-suck Richtung suck vorhanden, am Wagen noch nicht angeschlossen)', hash, true)
  await browser.close() }

fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify({ schema: 'kfb.abnahme-bilder/1', date: new Date().toISOString(), size: '3200x1800', quality: 88, slice: 'S1 Fortbewegung (V-746), Schritt 0b (V-740)', hinweis: 'Storyboard aus dem Live-Stand: gestellte Bilder zeigen die Absicht, nicht gebaute Funktionen', racer: RACER, items: index }, null, 1))
console.log('DONE s1-keyframes', index.length)
