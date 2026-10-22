// C2 (V-409/V-422) · Aliens über Figurenkarte + Loader auf der Bühne: Lord Hunky links, Lady Dory rechts, E2-Lidhaut auf EyeRig v6, Sockelrand 80°.
// Prüft: beide Figuren aus Karte + Variante geladen (sha256 im Browser = Variante), je Auge genau eine lid_skin, v6-Lidschalen ganz aus,
// Passung im Sockel nach Weg A (s = (shellRadius/R − 0,006) / 1,124), Pupille bei geschlossenem Lid 0 px aus allen Blickwinkeln (Methode proof_r1e
// pupilPixels: Pupille magenta, 8 Ansichten), offen > 0 (Gegenprobe). Bildreihe Kopf front / ¾ / seitlich × Ruhe / 50 % / zu → test/out/c2/e2-sheet.png.
// Eine manipulierte Variante (falsche sha256) wird sichtbar abgelehnt (rotes Schild statt Figur).
import fs from 'fs'
import { openPage, report } from './_page.mjs'
const sharp = (await import('sharp')).default
fs.mkdirSync('test/out/c2', { recursive: true })
const ready = (page) => page.waitForFunction(() => { const S = window.__kfbStageMods; return ['left', 'right'].every((k) => ['OK', 'REFUSED', 'ERROR'].includes(S?.[k]?.status?.().status)) }, null, { timeout: 420000 })
const { browser, page, errs } = await openPage('#stage,debug,actors=aliens,light=l1,nobar,dialog=0', { viewport: { width: 1280, height: 720 } })
await ready(page); await page.waitForTimeout(1500)
const res = await page.evaluate(async () => {
  const S = window.__kfbStageMods, L = window.__kfbStageLight, gl = L.renderer(), T = L.three()
  let scene = null; S.left.object3d.traverseAncestors((o) => { if (o.isScene) scene = o })
  const RT = 360, buf = new Uint8Array(RT * RT * 4), rt = new T.WebGLRenderTarget(RT, RT), out = {}
  const views = { front: [0, 0], left40: [-40, 0], right40: [40, 0], up30: [0, 30], down30: [0, -30], side75: [75, 0], top: [0, 85] }
  for (const k of ['left', 'right']) {
    const a = S[k], st = a.status(), rig = a.debugRig(), rep = a.report()
    const o = { status: st.status, reason: st.reason, sha256: st.sha256, variant: st.variant, height: st.height, lidSkins: rep.lidSkins, v6ShellsVisible: rep.v6ShellsVisible, fit: rep.fit, pupil: {} }
    if (rig) {
      rig.setLife({ on: false }); rig.setKinetics({ enabled: false })
      for (const lid of ['open', 'rest', 'half', 'closed']) {
        a.setLid(lid); rig._blinkT = 1e9; for (let i = 0; i < 120; i++) rig.update(1 / 60)
        o.pupil[lid] = rig.eyes.filter((e) => e.visible).map((e) => { // Einaugen-Figuren: zweites Auge ist ausgeblendet (Rezept singleEye)
          const pu = e._puMesh, old = pu.material; pu.material = new T.MeshBasicMaterial({ color: 0xff00ff, toneMapped: false })
          const c = e.getWorldPosition(new T.Vector3()), q = e.getWorldQuaternion(new T.Quaternion()), R = new T.Box3().setFromObject(pu).getSize(new T.Vector3()).length()
          const cam = new T.PerspectiveCamera(24, 1, 0.005, 100), res = {}
          for (const [n, [az, el]] of Object.entries(views)) {
            const A = az * Math.PI / 180, B = el * Math.PI / 180, dir = new T.Vector3(Math.sin(A) * Math.cos(B), Math.sin(B), Math.cos(A) * Math.cos(B)).applyQuaternion(q)
            cam.position.copy(c).addScaledVector(dir, Math.max(R, 0.05) * 9); cam.up.set(0, 1, 0); cam.lookAt(c); cam.updateMatrixWorld()
            /* nur die Figur messen: andere Szenenteile (z. B. der rote Platzhalter-Kristall der gemLanterns seit d668dd5) zählten unter 40° als „Pupille“ mit */
            const hid = []; for (let n = a.object3d; n.parent; n = n.parent) for (const ch of n.parent.children) if (ch !== n && ch.visible && !ch.isLight) { ch.visible = false; hid.push(ch) }
            gl.setRenderTarget(rt); gl.render(scene, cam); gl.readRenderTargetPixels(rt, 0, 0, RT, RT, buf); gl.setRenderTarget(null)
            hid.forEach((ch) => { ch.visible = true })
            let px = 0; for (let i = 0; i < buf.length; i += 4) if (buf[i] > 200 && buf[i + 1] < 70 && buf[i + 2] > 200) px++
            res[n] = px
          }
          pu.material.dispose(); pu.material = old; return res
        })
      }
      a.setLid('rest')
    }
    out[k] = o
  }
  rt.dispose(); return out
})
// Bildreihe: Kopf jeder Figur front / ¾ / seitlich × Ruhe / 50 % / zu (Stage-Licht Mesa-Tag, Knet wie auf der Bühne)
const tiles = []
for (const k of ['left', 'right']) for (const lid of ['rest', 'half', 'closed']) for (const [vn, az] of [['front', 0], ['3/4', 40], ['side', 80]]) {
  const png = await page.evaluate(({ k, lid, az }) => {
    const S = window.__kfbStageMods, a = S[k], rig = a.debugRig(), L = window.__kfbStageLight, gl = L.renderer(), T = L.three(); if (!rig) return null
    let scene = null; a.object3d.traverseAncestors((o) => { if (o.isScene) scene = o })
    a.setLid(lid); rig._blinkT = 1e9; for (let i = 0; i < 120; i++) rig.update(1 / 60)
    const vis = rig.eyes.filter((e) => e.visible), c = new T.Vector3(); vis.forEach((e) => c.add(e.getWorldPosition(new T.Vector3()))); c.multiplyScalar(1 / vis.length)
    const eR = new T.Box3().setFromObject(vis[0]._puMesh.parent).getSize(new T.Vector3()).length() / 2, span = Math.max(vis.length > 1 ? vis[0].getWorldPosition(new T.Vector3()).distanceTo(vis[1].getWorldPosition(new T.Vector3())) : 0, eR * 3.2)
    const fwd = new T.Vector3(0, 0, 1).applyQuaternion(a.object3d.getWorldQuaternion(new T.Quaternion())), A = az * Math.PI / 180
    const dir = new T.Vector3(fwd.x * Math.cos(A) + fwd.z * Math.sin(A), 0.12, -fwd.x * Math.sin(A) + fwd.z * Math.cos(A)).normalize()
    const W = 360, cam = new T.PerspectiveCamera(26, 1, 0.01, 200); cam.position.copy(c).addScaledVector(dir, span * 4.2); cam.lookAt(c); cam.updateMatrixWorld()
    const rt = new T.WebGLRenderTarget(W, W, { colorSpace: T.SRGBColorSpace }), buf = new Uint8Array(W * W * 4)
    gl.setRenderTarget(rt); gl.render(scene, cam); gl.readRenderTargetPixels(rt, 0, 0, W, W, buf); gl.setRenderTarget(null); rt.dispose()
    const cv = document.createElement('canvas'); cv.width = cv.height = W; const g = cv.getContext('2d'), im = g.createImageData(W, W)
    for (let y = 0; y < W; y++) im.data.set(buf.subarray((W - 1 - y) * W * 4, (W - y) * W * 4), y * W * 4)
    g.putImageData(im, 0, 0); g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(0, W - 22, W, 22); g.fillStyle = '#fff'; g.font = '13px sans-serif'
    g.fillText(`${k === 'left' ? 'Lord Hunky' : 'Lady Dory'} · ${lid} · ${az === 0 ? 'front' : az === 40 ? '3/4' : 'side'}`, 6, W - 7)
    return cv.toDataURL('image/png')
  }, { k, lid, az })
  tiles.push({ k, lid, vn, png })
}
await browser.close()
const ok = tiles.filter((t) => t.png)
if (ok.length) {
  const W = 360, cols = 9, rows = 2
  const comp = ok.map((t, i) => ({ input: Buffer.from(t.png.split(',')[1], 'base64'), left: (i % cols) * W, top: Math.floor(i / cols) * W }))
  await sharp({ create: { width: cols * W, height: rows * W, channels: 3, background: '#222' } }).composite(comp).png().toFile('test/out/c2/e2-sheet.png')
}
// Gegenprobe Ablehnung: Variante mit falscher Karten-sha → rotes Schild (Node-seitig über den Loader)
const { applyVariant } = await import('../src/vendor/figure/kfb-figure-loader.v1.js')
const card = JSON.parse(fs.readFileSync('src/data/figures/lord_hunky.figure.json', 'utf8')), vv = JSON.parse(fs.readFileSync('src/data/figures/variants/lord_hunky.e2-edge80.json', 'utf8'))
const V80 = { left: vv.body.glb.sha256, right: JSON.parse(fs.readFileSync('src/data/figures/variants/lady_dory.e2-edge80.json', 'utf8')).body.glb.sha256 }
const all = (k, f) => (res[k].pupil[f] || []).flatMap((r) => Object.values(r))
process.exit(report('c2 aliens E2 (V-409/V-422)', {
  bothLoadedFromCard: ['left', 'right'].every((k) => res[k].status === 'OK'),
  shaIsVariantEdge80: ['left', 'right'].every((k) => res[k].sha256 === V80[k] && /e2-edge80/.test(res[k].variant?.id || '')),
  oneLidSkinPerEye: ['left', 'right'].every((k) => res[k].lidSkins === 2),
  v6ShellsHidden: ['left', 'right'].every((k) => res[k].v6ShellsVisible === 0),
  socketFitPathA: ['left', 'right'].every((k) => (res[k].fit || []).length === 2 && res[k].fit.every((s) => s > 0.85 && s <= 1)),
  pupilZeroWhenClosed: ['left', 'right'].every((k) => all(k, 'closed').length >= 7 && all(k, 'closed').every((n) => n === 0)),
  pupilVisibleWhenOpen: ['left', 'right'].every((k) => (res[k].pupil.open || []).every((r) => r.front > 50)),
  variantGuardsCard: !applyVariant({ ...card, body: { ...card.body, glb: { ...card.body.glb, sha256: 'x' } } }, vv).ok,
  sheetWritten: fs.existsSync('test/out/c2/e2-sheet.png') && ok.length === 18,
  noPageErrors: errs.length === 0,
}, { res, errs: errs.slice(0, 3) }))
