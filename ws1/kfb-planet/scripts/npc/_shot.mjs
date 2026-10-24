// WS-NPC · Hilfen für Abnahmebilder in der M1-Welt (aus abnahme25.mjs herausgelöst): Stellen mit Blick, sichtbarer Anteil einer Figur (Pixelmaske)
import sharp from 'sharp'

export const ready = (page, extra = 'true') => page.waitForFunction(`window.__kfbM1?.npc?.()?.status.status === 'OK' && window.__kfbM1.status().player?.status === 'OK' && window.__kfbM1.status().amphTris > 0 && (${extra})`, null, { timeout: 300000 })

// Spieler d m vor dem Ziel q auf der Achse dir, Blick zum Ziel; az: Kamera seitlich versetzt (rad), damit die Spielfigur das Ziel nicht verdeckt
export const stand = (page, q, d, dir = [0.7071, 0.7071], az = 0) => page.evaluate(([q, d, dir, az]) => { const M = window.__kfbM1, x = q[0] + dir[0] * d, z = q[1] + dir[1] * d, w = Math.atan2(q[0] - x, q[1] - z)
  M.player().teleport([x, M.terrainH(x, z) + 1.2, z], w); M.player().camera()?.rotateAzimuthTo?.(w + Math.PI + az, false) }, [q, d, dir, az])

// Anteil der Figur (Ausdruck → object3d), der im Bild wirklich zu sehen ist: Ausschnitt um die projizierte Box mit und ohne Figur vergleichen
export async function visibleShare(page, objExpr) {
  const box = await page.evaluate((e) => { const M = window.__kfbM1, o = new Function('M', 'return ' + e)(M); if (!o) return null; const cam = M.camera3(), v = new o.position.constructor(), mn = [1e9, 1e9], mx = [-1e9, -1e9]; let n = 0
    o.updateWorldMatrix(true, true); o.traverse((x) => { if (!x.isMesh || !x.visible || !x.geometry) return; if (!x.geometry.boundingBox) x.geometry.computeBoundingBox(); const bb = x.geometry.boundingBox
      for (let i = 0; i < 8; i++) { v.set(i & 1 ? bb.max.x : bb.min.x, i & 2 ? bb.max.y : bb.min.y, i & 4 ? bb.max.z : bb.min.z).applyMatrix4(x.matrixWorld).project(cam); if (v.z > 1) return; mn[0] = Math.min(mn[0], v.x); mn[1] = Math.min(mn[1], v.y); mx[0] = Math.max(mx[0], v.x); mx[1] = Math.max(mx[1], v.y); n++ } })
    if (!n) return null; const W = innerWidth, H = innerHeight, x0 = Math.max(0, (mn[0] * 0.5 + 0.5) * W), x1 = Math.min(W, (mx[0] * 0.5 + 0.5) * W), y0 = Math.max(0, (-mx[1] * 0.5 + 0.5) * H), y1 = Math.min(H, (-mn[1] * 0.5 + 0.5) * H)
    return x1 - x0 > 8 && y1 - y0 > 8 ? { x: x0, y: y0, width: x1 - x0, height: y1 - y0 } : null }, objExpr)
  if (!box) return 0
  const raw = async () => (await sharp(await page.screenshot({ type: 'png', clip: box })).raw().toBuffer())
  const tog = (on) => page.evaluate(([e, on]) => { const o = new Function('M', 'return ' + e)(window.__kfbM1); if (o) o.visible = on }, [objExpr, on])
  await page.evaluate(() => { window.__kfbM1.clock.hidden = true }); const A = await raw(); await tog(false); await page.waitForTimeout(120); const B = await raw(); await tog(true); await page.evaluate(() => { window.__kfbM1.clock.hidden = false })
  let ch = 0; for (let i = 0; i < A.length; i += 3) if (Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]) > 24) ch++
  return ch / (A.length / 3)
}

// Richtung suchen, aus der die Figur frei zu sehen ist (8 Richtungen ab dir0); erst weiter weg, dann heran (die Kamera folgt weich)
export async function standFree(page, at, objExpr, d, dir0 = [0.7071, 0.7071], az = 0.32, min = 0.3) {
  let best = { share: -1 }
  for (let k = 0; k < 8; k++) {
    const a = Math.atan2(dir0[1], dir0[0]) + (k * Math.PI) / 4, dir = [Math.cos(a), Math.sin(a)]
    await stand(page, await at(), d + 6, dir); await page.waitForTimeout(2200)
    await stand(page, await at(), d, dir, az); await page.waitForTimeout(2500)
    const share = await visibleShare(page, objExpr); if (share > best.share) best = { share, dir }
    if (share >= min) return { share, dir }
  }
  await stand(page, await at(), d, best.dir, az); await page.waitForTimeout(2500)
  return best
}
