// L3 (LIGHT_MODEL_R2) · Beweis und Messung. Zwei Teile:
//   tone   Tonemapping-Wahl bei fester Belichtung (Regel 5): ACES | Neutral | AgX | ohne auf demselben Bild (Tag, Gold); Maß = Abweichung von Boden und
//          Bühne in OKLab-L/C gegen „ohne“ (Georgs Urteil V-346: Boden wirkte „ohne“ besser) und Clipping (< 0,1 %); Gewinner = kleinste Abweichung ohne Clipping.
//   proof  3 Stimmungen × (Totale, Nah FB, Nah Karte) × (16:9, 9:16), mit Knet, ohne Bedien-Elemente (V-383); Messwerte L-1…L-9 (soweit im Bild messbar)
//          aus Totale und Nah FB; Ergebnis test/out/l3/l3.json + Bildtafeln je Stimmung.
// node scripts/light/l3-proof.mjs [tone|proof|all] [out]
import fs from 'fs'
import sharp from 'sharp'
import { openPage } from '../../test/_page.mjs'
const PART = process.argv[2] || 'all', OUT = process.argv[3] || 'test/out/l3'; fs.mkdirSync(OUT, { recursive: true })
const BASE = '#stage,debug,actors=fb,light=l1,nobar'
const ready = (page) => page.waitForFunction(() => { const S = window.__kfbStageMods; return S?.amph?.status().status === 'OK' && S?.billboard?.info()?.source === 'CARD' && S.left?.status().shown && S.right?.status().shown !== false && (S.clay?.info?.() || []).length >= 1 }, null, { timeout: 480000 })
const hideUi = (page) => page.evaluate(() => { if (!document.getElementById('l3-clean')) { const st = document.createElement('style'); st.id = 'l3-clean'; st.textContent = '#kfb-cam-marks,#kfb-compare,#kfb-preview-badge,#kfb-info{display:none!important}'; document.head.appendChild(st) } }) // V-383: Beweisbild ohne Bedien-Elemente

// sRGB → OKLab (für Mittelwerte von Bildbereichen)
const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
const oklab = (r, g, b) => { const R = lin(r), G = lin(g), B = lin(b); const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B), m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B), s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B)
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s] }
async function region(buf, r) { // { L, C, a, b, lum (0–255, Rec. 709), clip (Anteil Kanal ≥ 254) }
  const img = r ? sharp(buf).extract(r) : sharp(buf), { data, info } = await img.raw().toBuffer({ resolveWithObject: true }); let n = 0, L = 0, A = 0, B = 0, Y = 0, clip = 0
  for (let i = 0; i < data.length; i += info.channels) { const [l, a, b] = oklab(data[i], data[i + 1], data[i + 2]); L += l; A += a; B += b; Y += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]; if (Math.max(data[i], data[i + 1], data[i + 2]) >= 254) clip++; n++ }
  L /= n; A /= n; B /= n; return { L: +(L * 100).toFixed(2), C: +(Math.hypot(A, B) * 100).toFixed(2), a: A, b: B, lum: +(Y / n).toFixed(1), clip: +(clip / n).toFixed(5) }
}
const dE = (p, q) => +(100 * Math.hypot(p.L / 100 - q.L / 100, p.a - q.a, p.b - q.b)).toFixed(2)
const dAB = (p, q) => +(100 * Math.hypot(p.a - q.a, p.b - q.b)).toFixed(2) // Farbton/Chroma-Abstand ohne Helligkeit (G3 neu, L-2)
const relLum = (y) => { const v = y / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
const contrast = (y1, y2) => { const a = relLum(y1), b = relLum(y2); return +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2) }

// Bildbereiche aus der Szene (projizierte Hüllboxen): Karte, Rahmen-Band, Hintergrund über dem Rahmen, FB-Kopf (Mund-/Stirn-Drittel), Boden neben FB,
// Schatten- und Lichtpunkt am Boden neben FB (Sonnenrichtung)
const regions = (page) => page.evaluate(() => {
  const S = window.__kfbStageMods, cam = window.__kfbStageCamera, W = innerWidth, H = innerHeight, V = cam.position.constructor
  const pr = (v) => { const q = v.clone().project(cam); return [(q.x + 1) / 2 * W, (1 - q.y) / 2 * H] }
  const rect = (obj, pick = () => true) => { let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; obj.updateWorldMatrix(true, true)
    obj.traverse((o) => { if (!o.isMesh || !o.geometry || !pick(o)) return; o.geometry.computeBoundingBox(); const b = o.geometry.boundingBox
      for (let i = 0; i < 8; i++) { const [x, y] = pr(new V(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).applyMatrix4(o.matrixWorld)); x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) } })
    return [x0, y0, x1, y1] }
  const clampR = ([x0, y0, x1, y1]) => { const l = Math.max(0, Math.round(x0)), t = Math.max(0, Math.round(y0)), r = Math.min(W, Math.round(x1)), b = Math.min(H, Math.round(y1)); return r - l >= 2 && b - t >= 2 ? { left: l, top: t, width: r - l, height: b - t } : null }
  const card = rect(S.billboard.object3d, (o) => o.name === 'face'), body = rect(S.billboard.object3d, (o) => o.name === 'body')
  const fw = card[2] - card[0], fh = card[3] - card[1]
  const frameBand = [card[0] - fw * 0.06, card[3] + 1, card[2] + fw * 0.06, Math.min(body[3], card[3] + fh * 0.08)] // Rahmen unter der Karte (Zierleiste)
  const bg = [body[0], body[1] - fh * 0.22, body[2], body[1] - fh * 0.04]
  const head = rect(S.left.object3d, (o) => /CharacterTemplate_Head/.test(o.name)), hh = head[3] - head[1], hw = head[2] - head[0]
  const face = [head[0] + hw * 0.22, head[1] + hh * 0.3, head[2] - hw * 0.22, head[3] - hh * 0.08]
  const fhH = face[3] - face[1], forehead = [face[0], face[1], face[2], face[1] + fhH / 3], mouth = [face[0], face[3] - fhH / 3, face[2], face[3]]
  const fb = S.left.object3d.getWorldPosition(new V()), info = window.__kfbStageLight.info(), sd = info.mood ? (() => { const e = info.mood.elev * Math.PI / 180, a = info.mood.az * Math.PI / 180; return [Math.cos(e) * Math.sin(a), Math.cos(e) * Math.cos(a)] })() : [0, 1]
  const k = window.__kfbStageCtl.worldK, sh = pr(new V(fb.x - sd[0] * 0.55 * k, 0.02, fb.z - sd[1] * 0.55 * k)), lit = pr(new V(fb.x + sd[0] * 1.2 * k, 0.02, fb.z + sd[1] * 1.2 * k))
  const box = (p, s = 10) => [p[0] - s, p[1] - s, p[0] + s, p[1] + s]
  const ground = [fb.x, 0, fb.z].length && (() => { const g = pr(new V(fb.x + 0.9 * k, 0.02, fb.z + 0.4 * k)); return box(g, 14) })()
  return { card: clampR(card), frame: clampR(frameBand), bg: clampR(bg), face: clampR(face), forehead: clampR(forehead), mouth: clampR(mouth), shadow: clampR(box(sh)), lit: clampR(box(lit)), ground: clampR(ground),
    gl: window.__kfbStageLight.gl(), info, pract: S.practicals?.info?.() }
})
async function shot(hash, W, H, view = 'total') {
  const o = await openPage(hash, { viewport: { width: W, height: H } }); await ready(o.page); await o.page.waitForTimeout(2200); await hideUi(o.page)
  if (view !== 'total') { await o.page.evaluate((v) => { const O = window.__kfbStageOrbit, cam = window.__kfbStageCamera, S = window.__kfbStageMods, V = cam.position.constructor, k = window.__kfbStageCtl.worldK
      O.setActive?.(true); const ctl = O.controls
      if (v === 'card') { O.jump('nah'); return }
      const head = new V(); S.left.object3d.getObjectByName?.('CharacterTemplate_Head')?.getWorldPosition(head) || S.left.object3d.getWorldPosition(head); if (head.y < 0.3) head.y = 1.5 * k
      const dir = cam.position.clone().sub(head).setY(0).normalize(); ctl.target.copy(head); cam.position.copy(head).addScaledVector(dir, 1.6 * k).setY(head.y + 0.08 * k); ctl.update() }, view)
    await o.page.waitForTimeout(view === 'card' ? 1800 : 900) }
  const r = await regions(o.page), buf = await o.page.screenshot({ timeout: 180000 }); await o.browser.close(); return { buf, r, errs: o.errs.length }
}
const label = (t, w) => Buffer.from(`<svg width="${w}" height="64" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="rgba(20,16,12,0.82)"/><text x="20" y="44" font-family="Helvetica, Arial, sans-serif" font-size="34" font-weight="700" fill="#fff">${t.replace(/&/g, '&amp;')}</text></svg>`)
async function grid(items, cols, cw, ch, title, out) { // Bildtafel mit großer Beschriftung je Feld (V-253)
  const rows = Math.ceil(items.length / cols), W = cols * cw, Hh = 90 + rows * (ch + 64)
  const comp = [{ input: Buffer.from(`<svg width="${W}" height="90" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#1c1610"/><text x="24" y="60" font-family="Helvetica, Arial, sans-serif" font-size="44" font-weight="700" fill="#fff">${title}</text></svg>`), left: 0, top: 0 }]
  for (const [i, it] of items.entries()) { const x = (i % cols) * cw, y = 90 + Math.floor(i / cols) * (ch + 64)
    comp.push({ input: label(it.label, cw), left: x, top: y }, { input: await sharp(it.buf).resize(cw, ch, { fit: 'contain', background: '#1c1610' }).png().toBuffer(), left: x, top: y + 64 }) }
  await sharp({ create: { width: W, height: Hh, channels: 3, background: '#1c1610' } }).composite(comp).png().toFile(out)
}
const res = { tone: null, proof: null }
if (PART === 'tone' || PART === 'all') {
  res.tone = {}
  for (const tod of ['day', 'gold']) {
    const shots = {}; for (const tm of ['none', 'aces', 'neutral', 'agx']) shots[tm] = await shot(`${BASE},tod=${tod},tm=${tm}`, 1600, 900)
    const ref = { ground: await region(shots.none.buf, { left: 0, top: 720, width: 1600, height: 170 }), stage: await region(shots.none.buf) }
    res.tone[tod] = {}
    for (const tm of ['aces', 'neutral', 'agx', 'none']) { const g = await region(shots[tm].buf, { left: 0, top: 720, width: 1600, height: 170 }), all = await region(shots[tm].buf), face = shots[tm].r.face ? await region(shots[tm].buf, shots[tm].r.face) : null
      res.tone[tod][tm] = { groundDE: dE(g, ref.ground), groundL: g.L, groundC: g.C, stageDE: dE(all, ref.stage), clip: all.clip, faceClip: face?.clip ?? null, faceL: face?.L ?? null } }
    await grid(['aces', 'neutral', 'agx', 'none'].map((tm) => ({ label: { aces: 'ACES', neutral: 'Neutral', agx: 'AgX', none: 'ohne' }[tm] + ` · Boden ΔE ${res.tone[tod][tm].groundDE} · Clip ${(res.tone[tod][tm].clip * 100).toFixed(2)} %`, buf: shots[tm].buf })), 2, 960, 540, `L3 · Tonemapping bei fester Belichtung · ${tod === 'day' ? 'Tag' : 'Gold'}`, `${OUT}/tone_${tod}.png`)
  }
  const score = (tm) => ['day', 'gold'].reduce((s, t) => s + res.tone[t][tm].groundDE + res.tone[t][tm].stageDE + (res.tone[t][tm].clip >= 0.001 ? 100 : 0), 0)
  res.tone.winner = ['aces', 'neutral', 'agx'].sort((a, b) => score(a) - score(b))[0]; res.tone.scores = Object.fromEntries(['aces', 'neutral', 'agx'].map((t) => [t, +score(t).toFixed(2)]))
  console.log('tone', JSON.stringify(res.tone))
}
if (PART === 'proof' || PART === 'all') {
  const TM = process.env.TM || res.tone?.winner || null, tmArg = TM ? `,tm=${TM}` : ''
  res.proof = { tm: TM || 'Standard', moods: {} }
  const tot = {}
  for (const tod of ['day', 'gold', 'night']) {
    const items = []
    for (const [aid, W, H] of [['16x9', 1920, 1080], ['9x16', 1080, 1920]]) for (const view of ['total', 'fb', 'card']) {
      const s = await shot(`${BASE},tod=${tod}${tmArg}`, W, H, view); fs.writeFileSync(`${OUT}/${tod}_${view}_${aid}.png`, s.buf)
      items.push({ label: `${{ total: 'Totale', fb: 'Nah FB', card: 'Nah Karte' }[view]} · ${aid.replace('x', ':')}`, buf: s.buf })
      if (aid === '16x9' && view === 'total') tot[tod] = s
      if (aid === '16x9' && view === 'fb') tot[tod + '_fb'] = s
    }
    await grid(items, 3, 640, 640, `L3 · ${{ day: 'Tag', gold: 'Goldene Stunde', night: 'Nacht' }[tod]} · ohne Bedien-Elemente, mit Knet`, `${OUT}/tafel_${tod}.png`)
  }
  for (const tod of ['day', 'gold', 'night']) {
    const s = tot[tod], r = s.r, R = async (k) => (r[k] ? region(s.buf, r[k]) : null)
    const card = await R('card'), frame = await R('frame'), bg = await R('bg'), ground = await R('ground'), shadow = await R('shadow'), lit = await R('lit'), all = await region(s.buf)
    const f = tot[tod + '_fb'], fr = f.r, face = fr.face ? await region(f.buf, fr.face) : null, mouth = fr.mouth ? await region(f.buf, fr.mouth) : null, fore = fr.forehead ? await region(f.buf, fr.forehead) : null, fall = await region(f.buf)
    const fgr = fr.ground ? await region(f.buf, fr.ground) : null
    res.proof.moods[tod] = { all, card, frame, bg, ground, shadow, lit, face, mouth, fore, fall, gl: r.gl, pract: r.pract, mood: r.info?.mood,
      L1: frame && card ? { frameToCard: +(frame.lum / card.lum).toFixed(2), frameToBg: bg ? contrast(frame.lum, bg.lum) : null } : null,
      L2: tod === 'night' && frame && card ? { cardToFrame: +(card.lum / frame.lum).toFixed(2) } : null,
      L5: face && fgr ? +(face.lum / fgr.lum).toFixed(2) : null,
      L6: shadow && lit ? { shadowContrast: +(1 - shadow.lum / lit.lum).toFixed(2), shadowL: shadow.L, clip: all.clip } : null,
      L7: r.pract?.lit ?? null,
      L9: face && mouth && fore ? { faceToStage: +(face.lum / fall.lum).toFixed(2), faceClip: face.clip, mouthToForehead: +(mouth.lum / fore.lum).toFixed(2), warm: face.b > 0 && face.a > -0.01 } : null,
      L8: r.gl }
  }
  const m = res.proof.moods
  res.proof.L4 = { dayGold: dE(m.day.all, m.gold.all), goldNight: dE(m.gold.all, m.night.all) }
  res.proof.L2hue = { cardDayNight: m.day.card && m.night.card ? dAB(m.day.card, m.night.card) : null, cardDayGold: m.day.card && m.gold.card ? dAB(m.day.card, m.gold.card) : null }
  const g = (v, ok) => (v == null ? 'n/a' : ok ? 'PASS' : 'FAIL')
  res.proof.grid = {
    'L-1 Rahmen lesbar': Object.fromEntries(['day', 'gold', 'night'].map((t) => [t, g(m[t].L1, m[t].L1 && m[t].L1.frameToCard >= 0.25 && m[t].L1.frameToBg >= 1.5)])),
    'L-2 Karte nie heller als ihr Licht': g(m.night.L2, m.night.L2 && m.night.L2.cardToFrame <= 1.5 && res.proof.L2hue.cardDayNight <= 5),
    'L-4 Stimmungen unterscheidbar': g(res.proof.L4, res.proof.L4.dayGold >= 8 && res.proof.L4.goldNight >= 12),
    'L-5 Figuren gehören zur Bühne': Object.fromEntries(['day', 'gold', 'night'].map((t) => [t, g(m[t].L5, m[t].L5 >= 0.8 && m[t].L5 <= 1.6)])),
    'L-6 Schatten/Clipping': Object.fromEntries(['day', 'gold', 'night'].map((t) => [t, g(m[t].L6, m[t].L6 && (t === 'night' ? m[t].L6.shadowL >= 8 : m[t].L6.shadowContrast >= 0.25) && m[t].L6.clip < 0.001)])),
    'L-7 Nacht-Inseln': g(m.night.L7, m.night.L7 >= 2),
    'L-8 Budget (Calls ≤ 300, Dreiecke ≤ 600 k)': Object.fromEntries(['day', 'night'].map((t) => [t, g(m[t].L8, m[t].L8 && m[t].L8.calls <= 300 && m[t].L8.tris <= 600000)])),
    'L-9 Figurenlicht': Object.fromEntries(['day', 'gold', 'night'].map((t) => [t, g(m[t].L9, m[t].L9 && m[t].L9.faceToStage >= 0.9 && m[t].L9.faceClip < 0.001 && m[t].L9.mouthToForehead >= 0.85 && m[t].L9.warm)])),
  }
  console.log('proof', JSON.stringify({ L4: res.proof.L4, L2hue: res.proof.L2hue, grid: res.proof.grid }))
}
fs.writeFileSync(`${OUT}/l3${PART === 'all' ? '' : '-' + PART}.json`, JSON.stringify(res, (k, v) => (k === 'a' || k === 'b') && typeof v === 'number' ? +v.toFixed(4) : v, 1))
