// Staub-Probe r2 · Sichtbarkeit (Kriterien Lead 23.10.): Spielkamera, Geradeausfahrt (gleiche flache Linie wie dustProbe), drei Zeitpunkte. Je Zeitpunkt im
// selben Moment: Bild mit Staub und ohne Staub (Staub-Objekt aus); Fahnenfläche = Scheiben der sichtbaren Partikel (Mitte + Radius wie der Shader).
// Gemessen auf der Fahnenfläche (sRGB-Luma 0–255): mittlerer Kontrast |mit − ohne|, Vorzeichen (+ = heller als Boden), Anteil dunkler Punkte
// (mit − ohne < −6), Leuchtdichte Staub gegen Boden. Aufruf: node test/dustContrast.mjs <variante alt|neu> <tod day|night>. Pixeldichte 2.
import fs from 'fs'
import { openPage } from './_page.mjs'
const [VAR = 'neu', TOD = 'day'] = process.argv.slice(2), S = { x: -127.5, z: 12.6, yaw: Math.PI / 2 - 0.26 }
const { browser, page, errs } = await openPage('#m1,debug,clean,car,look=terrain3,world=probe,mute,dust3=0,tod=' + TOD + (VAR === 'neu' ? ',dust2=1' : ''), { viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 })
await page.waitForFunction(() => window.__kfbM2?.car?.() && window.__kfbM1?.scene?.()?.getObjectByName('vehicle-rig-dust'), null, { timeout: 180000 }); await page.waitForTimeout(3000)
await page.evaluate(async (S) => { const M2 = window.__kfbM2; M2.setKind(M2.kind(), { p: [S.x, window.__kfbM1.terrainH(S.x, S.z) + 1, S.z], yaw: S.yaw }); await new Promise((r) => setTimeout(r, 2500)) }, S)
const r = await page.evaluate(async () => {
  const M = window.__kfbM1, R = M.renderer(), Th = M.three(), scene = M.scene(), cam = M.camera3(), P = scene.getObjectByName('vehicle-rig-dust'), G = P.geometry
  // wie auf dem Bildschirm messen (Standard-Bildpuffer, Pixeldichte 2): ein sRGB-Render-Ziel kodiert den alten Staub-Shader (ohne colorspace_fragment)
  // anders als die Ausgabe und ohne Tonemapping – das täuschte hellen alten Staub vor
  const gl = R.getContext(), size0 = R.getSize(new Th.Vector2()), pr0 = R.getPixelRatio(); R.setPixelRatio(2); R.setSize(1280, 720, false)
  const W = gl.drawingBufferWidth, H = gl.drawingBufferHeight, A = new Uint8Array(W * H * 4), B = new Uint8Array(W * H * 4)
  const shot = (buf, c) => { R.setRenderTarget(null); R.render(scene, c); gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, buf) }
  const U = P.material.uniforms, sizeK = U.uSizeK?.value ?? 1, minPx = U.uMinPx?.value ?? 0, bufH = H
  const res = []; M.input({ forward: true }); const t0 = performance.now()
  for (const T of [2.0, 2.5, 3.0]) { while ((performance.now() - t0) / 1000 < T) await new Promise((q) => requestAnimationFrame(q))
    const c = cam.clone(); c.updateMatrixWorld()
    shot(A, c); P.visible = false; shot(B, c); P.visible = true
    // Fahnenfläche aus den Partikeln (Radius in Bildpunkten dieses Bildes)
    const mask = new Uint8Array(W * H), v = new Th.Vector3(), life = G.attributes.aLife.array, size = G.attributes.aSize.array, pos = G.attributes.position.array, inv = c.matrixWorldInverse; let parts = 0
    for (let j = 0; j < life.length; j++) { if (life[j] <= 0) continue; v.set(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]).applyMatrix4(inv); const z = -v.z; if (z < c.near) continue
      const age = 1 - life[j], ss = (a, b, x) => { const u = Math.min(1, Math.max(0, (x - a) / (b - a))); return u * u * (3 - 2 * u) }
      const maxPx = U.uMaxPxYoung ? U.uMaxPxYoung.value + (U.uMaxPx.value - U.uMaxPxYoung.value) * ss(0, 0.5, age) : U.uMaxPx ? U.uMaxPx.value : Infinity
      const s0 = size[j] * sizeK * U.uScale.value * (U.uMaxPxYoung ? 0.9 + 0.4 * age : U.uSizeK ? 0.5 + 1.1 * age : 0.4 + life[j]) / Math.max(0.2, z), dev = Math.min(Math.max(s0, minPx), maxPx), rad = (dev / 2) * 0.8
      v.applyMatrix4(c.projectionMatrix); const cx = (v.x * 0.5 + 0.5) * W, cy = (v.y * 0.5 + 0.5) * H; if (cx < -rad || cy < -rad || cx > W + rad || cy > H + rad) continue; parts++
      for (let y = Math.max(0, Math.floor(cy - rad)); y <= Math.min(H - 1, cy + rad); y++) for (let x = Math.max(0, Math.floor(cx - rad)); x <= Math.min(W - 1, cx + rad); x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= rad * rad) mask[y * W + x] = 1 }
    // Deckung (r3): Szene schwarz (Tiefe für Verdeckung), dann nur der Staub weiß mit seiner Deckkraft → R-Kanal = Deckung
    let covLine = null, covN = 0
    if (U.uCov) { const black = new Th.MeshBasicMaterial({ color: 0x000000 }), cC = c.clone(), cov = new Uint8Array(W * H * 4), ac = R.autoClear, cc0 = R.getClearColor(new Th.Color()), ca0 = R.getClearAlpha(), tm = R.toneMapping
      R.setRenderTarget(null); R.setClearColor(0x000000, 1); R.clear(); R.autoClear = false; R.toneMapping = Th.NoToneMapping
      P.visible = false; scene.overrideMaterial = black; R.render(scene, c); scene.overrideMaterial = null; P.visible = true
      P.layers.enable(9); cC.layers.set(9); U.uCov.value = 1; const bg = scene.background; scene.background = null; R.render(scene, cC); scene.background = bg; U.uCov.value = 0; P.layers.disable(9)
      gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, cov); R.autoClear = ac; R.setClearColor(cc0, ca0); R.toneMapping = tm; black.dispose()
      // Fahnenmitte: 3 m hinter dem Heck, Wagenmitte − Fahrtrichtung, Bodenhöhe
      const car = window.__kfbM2.car(), cp = car.pos(), yaw = car.yaw(), fx = Math.sin(yaw), fz = Math.cos(yaw), half = 2.6 * window.__kfbM1.k
      let hit = 0, tot = 0; for (let d = 0; d <= 3.0; d += 0.05) { const x = cp.x - fx * (half + d), zz = cp.z - fz * (half + d), y = window.__kfbM1.terrainH(x, zz) + 0.15
        v.set(x, y, zz).project(c); const px = Math.round((v.x * 0.5 + 0.5) * W), py = Math.round((v.y * 0.5 + 0.5) * H); if (px < 0 || py < 0 || px >= W || py >= H || v.z > 1) continue
        tot++; if (cov[(py * W + px) * 4] / 255 >= 0.15) hit++ }
      covLine = tot ? +(hit / tot).toFixed(3) : null; covN = tot
      if (T === 2.5) { let b = ''; for (let i = 0; i < cov.length; i += 0x8000) b += String.fromCharCode.apply(null, cov.subarray(i, i + 0x8000)); let mx = 0; for (let i = 0; i < cov.length; i += 4) mx = Math.max(mx, cov[i]); window.__cov = { b64: btoa(b), W, H, mx, line: [] }
        for (let d = 0; d <= 3.0; d += 0.5) { const x = cp.x - fx * (half + d), zz = cp.z - fz * (half + d); v.set(x, window.__kfbM1.terrainH(x, zz) + 0.15, zz).project(c); window.__cov.line.push([+((v.x * 0.5 + 0.5) * W).toFixed(0), +((v.y * 0.5 + 0.5) * H).toFixed(0), +v.z.toFixed(3)]) } } }
    // Kantenkontrast: Schritt der Staub-Differenz (mit − ohne) zwischen Nachbarpixeln auf der Fahnenfläche
    const dl = (i) => { const k = i * 4; return (0.2126 * A[k] + 0.7152 * A[k + 1] + 0.0722 * A[k + 2]) - (0.2126 * B[k] + 0.7152 * B[k + 1] + 0.0722 * B[k + 2]) }
    const lb = (i) => { const k = i * 4; return 0.2126 * B[k] + 0.7152 * B[k + 1] + 0.0722 * B[k + 2] }   // Kanten im Bild ohne Staub (Wagen, Geländebänder) zählen nicht als Tupferrand
    const steps = []; for (let i = W + 1; i < W * H - W - 1; i += 1) { if (!mask[i] || !mask[i + 1] || !mask[i + W]) continue; if (Math.abs(lb(i + 1) - lb(i)) > 3 || Math.abs(lb(i + W) - lb(i)) > 3 || Math.abs(lb(i - 1) - lb(i)) > 3 || Math.abs(lb(i - W) - lb(i)) > 3) continue; steps.push(Math.max(Math.abs(dl(i + 1) - dl(i)), Math.abs(dl(i + W) - dl(i)))) }
    steps.sort((a, b) => a - b); const edgeP99 = steps.length ? +steps[Math.floor(steps.length * 0.99)].toFixed(2) : 0, edgeMax = steps.length ? +steps[steps.length - 1].toFixed(2) : 0
    let n = 0, absS = 0, sgnS = 0, dark = 0, lumA = 0, lumB = 0
    for (let i = 0; i < W * H; i++) { if (!mask[i]) continue; const k = i * 4, la = 0.2126 * A[k] + 0.7152 * A[k + 1] + 0.0722 * A[k + 2], lb = 0.2126 * B[k] + 0.7152 * B[k + 1] + 0.0722 * B[k + 2]
      n++; absS += Math.abs(la - lb); sgnS += la - lb; lumA += la; lumB += lb; if (la - lb < -6) dark++ }
    if (T === 2.5) { let b64 = ''; const step = 0x8000; for (let i = 0; i < A.length; i += step) b64 += String.fromCharCode.apply(null, A.subarray(i, i + step)); window.__img = { b64: btoa(b64), W, H } }
    res.push({ T, parts, covLine, covN, edgeP99, edgeMax, maskPx: n, contrast: n ? +(absS / n).toFixed(2) : 0, signed: n ? +(sgnS / n).toFixed(2) : 0, darkFrac: n ? +(dark / n).toFixed(4) : 0, lumDust: n ? +(lumA / n).toFixed(1) : 0, lumGround: n ? +(lumB / n).toFixed(1) : 0 }) }
  M.input(null); R.setPixelRatio(pr0); R.setSize(size0.x, size0.y, false); return res })
const img = process.env.SAVE ? await page.evaluate(() => window.__img) : null, covImg = process.env.COVSAVE ? await page.evaluate(() => window.__cov) : null
await browser.close()
if (covImg) { const sharp = (await import('sharp')).default; console.error('cov max', covImg.mx, 'line', JSON.stringify(covImg.line)); await sharp(Buffer.from(covImg.b64, 'base64'), { raw: { width: covImg.W, height: covImg.H, channels: 4 } }).flip().jpeg({ quality: 85 }).toFile(process.env.COVSAVE) }
if (img) { const sharp = (await import('sharp')).default; await sharp(Buffer.from(img.b64, 'base64'), { raw: { width: img.W, height: img.H, channels: 4 } }).flip().jpeg({ quality: 85 }).toFile(process.env.SAVE) }
const mean = (k) => +(r.reduce((s, o) => s + o[k], 0) / r.length).toFixed(3)
const out = { VAR, TOD, frames: r, covLine: r[0].covLine == null ? null : mean('covLine'), edgeP99: mean('edgeP99'), edgeMax: Math.max(...r.map((o) => o.edgeMax)), contrast: mean('contrast'), signed: mean('signed'), darkFrac: mean('darkFrac'), lumDust: mean('lumDust'), lumGround: mean('lumGround'), errs: errs.slice(0, 3) }
fs.mkdirSync('test/out', { recursive: true }); fs.writeFileSync(`test/out/dust-contrast-${VAR}-${TOD}.json`, JSON.stringify(out, null, 1))
console.log(JSON.stringify(out))
