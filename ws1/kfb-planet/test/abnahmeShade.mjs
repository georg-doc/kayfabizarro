// Abnahme V-683 (Schattenseite aller Nicht-Gelände-Objekte): A = heute, B = shade=1, gleiche Kamera. Prüfbild wie Georgs Donner-Jet-Fall (FB von der Schattenseite).
import path from 'path'
import fs from 'fs'
import { chromium } from 'playwright'
const OUT = path.resolve(process.env.HOME, 'kfb-ws1/research/audits/abnahme/schattenseite'); fs.mkdirSync(OUT, { recursive: true })
const b = await chromium.launch({ channel: 'chromium', args: ['--use-angle=metal', '--enable-gpu', '--ignore-gpu-blocklist'] })
const CASES = [['fb-schattenseite-tag', ',car,racer=crimson_thunderjet', 'fb'], ['bewohner-band-tag', ',npc,patrol,band', 'band'], ['fb-schattenseite-gold', ',car,racer=crimson_thunderjet,tod=gold', 'fb'], ['spawn-nacht', ',tod=night', 'spawn']]
const res = []
for (const [name, h, kind] of CASES) {
  const p = await b.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2 })
  await p.goto('file://' + path.resolve('dist/index.html') + '#m1,debug,clean,harvest,look=terrain3,world=probe,shade=1' + h)
  await p.waitForFunction(() => window.__kfbM1?.status?.().player?.status === 'OK', null, { timeout: 300000 }).catch(() => {}); await p.waitForTimeout(6000)
  /* A und B im selben Moment: gleiche Kamera, Regel aus (A) bzw. an (B); Uhr angehalten */
  const shots = await p.evaluate(async (kind) => { const M = window.__kfbM1, gl = M.renderer(), sc = M.scene(), T = M.three()
    let tgt; if (kind === 'band') { const a = M.band?.()?.debug?.at; tgt = a ? new T.Vector3(a[0], M.terrainH(a[0], a[1]) + 1.1, a[1]) : null } else { const f = M.feet(); tgt = new T.Vector3(f[0], f[1] + 0.9, f[2]) }
    let sun = null; sc.traverse((o) => { if (o.isDirectionalLight && o.castShadow) sun = o })
    const sd = sun ? sun.position.clone().sub(sun.target.position).setY(0).normalize() : new T.Vector3(1, 0, 0)
    const cam = new T.PerspectiveCamera(35, 16 / 9, 0.1, 500); cam.position.copy(tgt).addScaledVector(sd, kind === 'band' ? -14 : -5.5).add(new T.Vector3(0, kind === 'band' ? 3 : 1.4, 0)); cam.lookAt(tgt); cam.updateMatrixWorld()
    const rt = new T.WebGLRenderTarget(1600, 900, { samples: 4 }), buf = new Uint8Array(1600 * 900 * 4), out = []
    const S = window.__kfbShade, U = []; sc.traverse((o) => { if (o.isMesh) for (const m of [].concat(o.material)) if (m.userData.shadeFloor) U.push(m) })
    for (const off of [true, false]) { S.off = off; await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
      gl.setRenderTarget(rt); gl.render(sc, cam); gl.readRenderTargetPixels(rt, 0, 0, 1600, 900, buf); gl.setRenderTarget(null)
      let s = ''; for (let i = 0; i < buf.length; i += 8192) s += String.fromCharCode.apply(null, buf.subarray(i, i + 8192)); out.push(btoa(s)) }
    S.off = false; return { a: out[0], b: out[1], patched: U.length } }, kind)
  const sharp = (await import('sharp')).default
  for (const [tag, d] of [['a-heute', shots.a], ['b-regel', shots.b]]) { await sharp(Buffer.from(d, 'base64'), { raw: { width: 1600, height: 900, channels: 4 } }).flip().resize(3200, 1800).jpeg({ quality: 90 }).toFile(`${OUT}/${name}-${tag}.jpg`); res.push({ file: `${name}-${tag}.jpg`, fall: name, stufe: tag, patchedMaterials: shots.patched }) }
  await p.close()
}
await b.close(); fs.writeFileSync(`${OUT}/index.json`, JSON.stringify({ schema: 'kfb.abnahme-bilder/1', date: new Date().toISOString(), punkt: 'V-683 Schattenseite', files: res }, null, 1)); console.log(res.length)
