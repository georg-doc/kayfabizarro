/* kfb-tod-bloedsinn.v1 · Baustein „eigener Tod“ (WS1 Prüfer D → WS1-Lead) · 21.10.2026 · Georg: PASS mit TUNE
 * Rahmenunabhängig (kein three, kein React): ein DOM-Overlay über dem Spiel. Der Host verdrahtet Ton, Augen und Kamera über Rückrufe.
 *
 *   import { createTodScreen } from './kfb-tod-bloedsinn.v1.mjs'
 *   const tod = createTodScreen({
 *     onCue:   (name, tS) => kfbAudio.play(name),        // 'fall' (0 s), 'die' (0,42 s), 'word' (Wort steht) – Ton nur über den WS-Audio-Pfad (V-598)
 *     onEyes:  (style) => eyeRig.setPupil(style),         // 'kreuz' beim Tod (Georg 21.10. freigegeben; Augen-Rig v6 braucht pupil 'kreuz')
 *     onZoom:  (e) => cam.zoomToCorpse(e),                // 0 → 1 in zoomS, der Host bewegt seine Kamera selbst
 *     onWordSettled: () => showDeathMenu(),               // D2: das eigene Tod-Menü erst JETZT zeigen, sonst steht „Blödsinn!“ doppelt
 *   })
 *   tod.play()   // beim Wechsel in die Niederlage
 *   tod.stop()   // bei Neustart/Aufstehen (blendet 0,3 s aus)
 *
 * Inhalt
 *   Tusche  Kanon #1f1a14 sammelt sich oben (gewellte Kante) und läuft in zähen LÄUFERN herab (Georg: keine Kugeln am Ende):
 *           stumpfe, abgerundete Front in Körperbreite, Breite schwillt an und ab, 3 lange Hauptläufer + kurze, Glanzstreifen (zwei Töne).
 *           Die Bildmitte bleibt frei.
 *   Wort    „Blödsinn!“ in --kfb-blodsinn #b8361f. v1: 2D-Knet-Platzhalter (Verlauf, Fingerabdrücke, Saum, Lichtkante), gestaffelter Pop.
 *           PFLICHT-TUNE D5 (Georg): Claymation-Modell aus comicmäßig gebogenem, typografisch sauberem Lettering → als `wordRenderer` einstecken.
 * Eigener Code. Zufall aus eigenem Seed (deterministisch). Keine Abhängigkeiten. */
export const TOD_DEFAULTS = {
  word: 'Blödsinn!', ink: '#1f1a14', inkHi: '#3b3340', red: '#b8361f', redHi: '#e0664a', redLo: '#7e2112', saum: '#4a1410',
  runners: 18, mainRunners: 3, dieAtS: 0.42, wordAtS: 0.75, zoomS: 1.2, fadeS: 0.3, seed: 20261021, zIndex: 9000, reducedMotion: false
}
const rng = (seed) => () => { seed = (seed + 0x6D2B79F5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }

/* v1-Wort (Platzhalter bis D5): je Buchstabe eine Canvas mit Knet-Anmutung. Ein D5-Renderer liefert dasselbe Interface:
   wordRenderer({ word, P, R, parent }) → { el, settleS } – el wird eingehängt, settleS = Zeit bis das Wort steht. */
export function wordRenderer2D({ word, P, R, parent }) {
  const box = document.createElement('div'); box.className = 'kfb-tod-wort'
  const letter = (ch) => { const fs = 150, c = document.createElement('canvas'), g = c.getContext('2d'), font = `${fs}px Bangers, "Luckiest Guy", Impact, sans-serif`; g.font = font
    const w = Math.ceil(g.measureText(ch).width) + 40, h = fs + 50; c.width = w; c.height = h; g.font = font; const x = 20, y = fs + 10; g.lineJoin = 'round'
    g.lineWidth = 16; g.strokeStyle = P.saum; g.strokeText(ch, x, y); g.fillStyle = P.red; g.fillText(ch, x, y); g.globalCompositeOperation = 'source-atop'
    const gr = g.createLinearGradient(0, y - fs, 0, y); gr.addColorStop(0, P.redHi); gr.addColorStop(0.45, P.red); gr.addColorStop(1, P.redLo); g.fillStyle = gr; g.fillRect(0, 0, w, h)
    for (let i = 0; i < 26; i++) { g.strokeStyle = R() < 0.5 ? 'rgba(255,235,220,.10)' : 'rgba(40,6,2,.12)'; g.lineWidth = 1.5 + R() * 2.5; g.beginPath(); g.arc(R() * w, y - R() * fs, 8 + R() * 30, R() * 6.28, R() * 6.28 + 1 + R() * 2); g.stroke() }
    g.strokeStyle = 'rgba(255,225,205,.55)'; g.lineWidth = 4; g.strokeText(ch, x - 2, y - 3); g.globalCompositeOperation = 'source-over'; return c }
  ;[...word].forEach((ch, i) => { const c = letter(ch); c.style.animationDelay = `${i * 0.06}s, ${0.9 + i * 0.06}s`; c.style.setProperty('--r', `${(R() - 0.5) * 10}deg`); c.style.height = 'min(120px, 16vw)'; box.append(c) })
  parent.append(box); return { el: box, settleS: 0.62 + (word.length - 1) * 0.06 }
}

export function createTodScreen(opt = {}) {
  const P = { ...TOD_DEFAULTS, ...opt }, cb = { onCue: opt.onCue || (() => {}), onEyes: opt.onEyes || (() => {}), onZoom: opt.onZoom || (() => {}), onWordSettled: opt.onWordSettled || (() => {}) }
  const renderWord = opt.wordRenderer || wordRenderer2D, parent = opt.parent || document.body
  /* Webfont vorladen: Canvas-Text zeichnet sonst in der Ersatzschrift, wenn Bangers noch nicht geladen ist (in der Demo beobachtet) */
  let fontReady = false; (document.fonts?.load ? document.fonts.load('150px Bangers') : Promise.resolve()).then(() => { fontReady = true }, () => { fontReady = true })
  const css = document.createElement('style'); css.textContent = `
    .kfb-tod-wort{position:fixed;left:50%;top:30%;transform:translate(-50%,-50%);display:flex;gap:2px;z-index:${P.zIndex + 1};pointer-events:none}
    .kfb-tod-wort canvas{transform-origin:50% 90%;animation:kfbTodPop .62s cubic-bezier(.2,.9,.3,1.3) both, kfbTodWackel 1.6s ease-in-out .9s infinite alternate}
    @keyframes kfbTodPop{0%{transform:translateY(-60px) scale(0) rotate(-18deg)}45%{transform:translateY(6px) scale(1.28,.78) rotate(4deg)}70%{transform:translateY(-4px) scale(.9,1.14) rotate(-2deg)}100%{transform:translateY(0) scale(1) rotate(var(--r,0deg))}}
    @keyframes kfbTodWackel{from{transform:rotate(calc(var(--r,0deg) - 2deg))}to{transform:rotate(calc(var(--r,0deg) + 2deg))}}
    @media (prefers-reduced-motion: reduce){.kfb-tod-wort canvas{animation:none}}`
  document.head.append(css)
  let run = null, runs = 0
  const play = () => { if (run) return; runs++; const R = rng(P.seed + runs)
    const cv = document.createElement('canvas'); cv.style.cssText = `position:fixed;inset:0;width:100vw;height:100vh;z-index:${P.zIndex};pointer-events:none`; parent.append(cv)
    const W = cv.width = innerWidth, H = cv.height = innerHeight, g = cv.getContext('2d')
    // Läufer: 3 lange Hauptläufer (außerhalb der Mitte), Rest kurz; Mitte immer kurz
    const runners = [...Array(P.runners)].map((_, i) => { const x = (i + 0.2 + R() * 0.6) / P.runners * W, mitte = Math.abs(x / W - 0.5) < 0.18
      return { x, w: 16 + R() * 44, len: H * (mitte ? 0.06 + R() * 0.1 : 0.14 + R() * 0.26), speed: 0.6 + R() * 0.5, delay: R() * 0.45, ph: R() * 6.28, main: false } })
    const seiten = runners.filter((r) => Math.abs(r.x / W - 0.5) >= 0.22).sort(() => R() - 0.5).slice(0, P.mainRunners)
    for (const r of seiten) { r.main = true; r.len = H * (0.55 + R() * 0.3); r.w *= 1.15; r.speed *= 0.85 }
    run = { cv, g, W, H, runners, t0: performance.now(), word: null, cues: { fall: false, die: false, word: false, settled: false } }
    cb.onEyes('kreuz')
    const frame = () => { if (!run) return; const t = (performance.now() - run.t0) / 1000; g.clearRect(0, 0, W, H)
      const band = H * 0.07 * Math.min(1, t / 0.5); g.fillStyle = P.ink
      g.beginPath(); g.moveTo(0, 0); g.lineTo(W, 0); g.lineTo(W, band)
      for (let x = W; x >= 0; x -= 24) g.lineTo(x, band + Math.sin(x * 0.045 + t * 1.3) * band * 0.18 + Math.sin(x * 0.013) * band * 0.25); g.closePath(); g.fill()
      for (const r of runners) {
        // zäh: Weg ~ Kurve mit langsamem Anlauf, dann gleichmäßigem Kriechen (kein freier Fall), Hauptläufer kriechen länger
        const u = Math.max(0, t - r.delay) * r.speed, k = 1 - Math.exp(-u * 0.9), L = band * 0.7 + r.len * (P.reducedMotion ? 1 : k)
        if (L <= band + 3) continue
        const N = 16, left = [], right = []
        for (let i = 0; i <= N; i++) { const f = i / N, y = band * 0.5 + (L - band * 0.5) * f
          const swell = 1 + 0.18 * Math.sin(f * 7 + r.ph + t * 0.8) * f - 0.12 * f            // Breite schwillt an und ab, nach unten leicht schmaler
          const sway = Math.sin(f * 2.6 + r.ph) * r.w * 0.22 * f                                // leicht geschwungen
          const w = r.w / 2 * (i === 0 ? 1.7 : swell); left.push([r.x + sway - w, y]); right.push([r.x + sway + w, y]) }
        // Kontur: links runter, STUMPFE runde Front in Körperbreite (+8 % Verdickung, keine Kugel), rechts hoch
        const fl = left[N], fr = right[N], fw = (fr[0] - fl[0]) / 2 * 1.08, fc = (fl[0] + fr[0]) / 2
        g.fillStyle = P.ink; g.beginPath(); g.moveTo(left[0][0], 0)
        for (let i = 0; i < N; i++) { const a = left[i], b = left[i + 1]; g.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2) }
        g.lineTo(fc - fw, L); g.bezierCurveTo(fc - fw, L + fw * 0.9, fc + fw, L + fw * 0.9, fc + fw, L)
        for (let i = N; i > 0; i--) { const a = right[i], b = right[i - 1]; g.quadraticCurveTo(a[0], a[1], (a[0] + b[0]) / 2, (a[1] + b[1]) / 2) }
        g.lineTo(right[0][0], 0); g.closePath(); g.fill()
        // Glanzstreifen (zweiter Ton) entlang der linken Innenseite, endet vor der Front
        g.strokeStyle = P.inkHi; g.lineWidth = Math.max(2, r.w * 0.09); g.lineCap = 'round'; g.beginPath()
        for (let i = 2; i < N - 1; i++) { const x = left[i][0] + (right[i][0] - left[i][0]) * 0.26, y = left[i][1]; i === 2 ? g.moveTo(x, y) : g.lineTo(x, y) } g.stroke() }
      const z = Math.min(1, t / P.zoomS); cb.onZoom(z * z * (3 - 2 * z))
      if (!run.cues.fall) { run.cues.fall = true; cb.onCue('fall', t) }
      if (!run.cues.die && t >= P.dieAtS) { run.cues.die = true; cb.onCue('die', t) }
      if (!run.word && t >= P.wordAtS && (fontReady || t >= P.wordAtS + 0.5)) { run.word = renderWord({ word: P.word, P, R, parent }); run.wordAt = t }
      if (run.word && !run.cues.word) { run.cues.word = true; cb.onCue('word', t) }
      if (run.word && !run.cues.settled && t >= run.wordAt + run.word.settleS) { run.cues.settled = true; cb.onWordSettled() }
      requestAnimationFrame(frame) }
    requestAnimationFrame(frame) }
  const stop = () => { if (!run) return; const r = run; run = null; cb.onEyes('normal'); cb.onZoom(0)
    for (const el of [r.cv, r.word?.el]) if (el) { el.style.transition = `opacity ${P.fadeS}s`; el.style.opacity = '0' }
    setTimeout(() => { r.cv.remove(); r.word?.el.remove() }, P.fadeS * 1000 + 20) }
  return { play, stop, active: () => !!run, dispose() { stop(); css.remove() }, version: 'kfb-tod-bloedsinn.v1' }
}
