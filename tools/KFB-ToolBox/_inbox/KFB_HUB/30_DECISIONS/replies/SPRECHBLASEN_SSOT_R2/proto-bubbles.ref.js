// Prototyp-Brücke zur Sprechblasen-SSOT (hud_r1/sprechblasen/code). Körper, Schichten, Layout, Schrift und Flip-Reveal
// kommen unverändert aus bubbleLayer.js / chatterbox-core.js (bubbleBodySvg, KFB_CB.layout, AIR, STAGGER).
// Hier nur, was der Prototyp anders braucht: feste Bühne 1440×900 statt innerWidth/innerHeight, Anker als Bildschirmpunkte
// statt 3D-Anker, Spielerwahl als wählbare Sprechblasen (choiceLayer liegt nicht im Paket).
import { bubbleBodySvg, aimRoundRectPath, AIR, STAGGER } from './code/bubbleLayer.js'
// SVG-Definitionen 1:1 aus bubbleLayer.js (dort nicht exportiert): kfbWallShade, kfbSoftShadow, kfbDotsWarm, kfbFaceShade, kfbFade, kfbCornerMask
const DEFS = '<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="kfbWallShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#1a0f05" stop-opacity=".32"/></linearGradient><filter id="kfbSoftShadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter><pattern id="kfbDotsWarm" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.3" fill="#b38a55"/></pattern><linearGradient id="kfbFaceShade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".34"/><stop offset=".48" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#2a1a0c" stop-opacity=".14"/></linearGradient><radialGradient id="kfbFade" cx="0.8" cy="0.86" r="0.8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#000000"/></radialGradient><mask id="kfbCornerMask" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#kfbFade)"/></mask></defs></svg>'
// Abweichung vom Spiel (Georg 31.10.): Zipfel im Prototyp länger und breiter (aMax 30 statt 18, Fuß 22 statt 12); Form sonst unverändert
const TAIL = { aMax: 30, foot: 22 }

const INK = '#1f1a14', M = 34
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;')
function lineHtml(ln) { let h = '', on = false; for (const t of ln.toks || [{ text: ln.text }]) { const b = !!t.bold; if (b !== on) { h += b ? '<b>' : '</b>'; on = b } h += esc(t.text) } return h + (on ? '</b>' : '') }

export function createProtoBubbles({ host, W = 1440, H = 900 }) {
  const C = window.KFB_CB
  const root = document.createElement('div'); root.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden'
  root.innerHTML = DEFS
  host.appendChild(root)
  let items = []

  // layoutTri() aus bubbleLayer.js, Bühnenmaße statt Fenster
  const layoutTri = (parts, kind) => {
    const base = Math.round(Math.max(15, Math.min(20, H / 42))), Ls = parts.map((p) => C.layout(p, kind, { basePx: base, maxPx: Math.min(420, W * 0.42) })), L0 = Ls[0], fs = L0.fontPx, lh = L0.lh, gap = 0   // Abweichung (Georg 31.10.): Satzteile mit normalem Zeilenabstand statt +0,5 em
    const inner = Math.max(...Ls.map((l) => l.w - 2 * l.padX)); let n = 0; const lines = []
    Ls.forEach((l, pi) => l.lines.forEach((toks, li) => { lines.push({ text: toks.map((t) => t.text).join(''), toks, mt: pi > 0 && li === 0 ? gap : 0, part: pi }); n++ }))
    const padX = L0.padX + Math.round(fs * AIR.x), padY = L0.padY + Math.round(fs * AIR.y), lh2 = lh + AIR.lh
    return { w: Math.round(inner + 2 * padX), h: Math.round(n * fs * lh2 + gap * (Ls.length - 1) + 2 * padY), padX, padY, fs, lh: lh2, lines }
  }
  // draw() aus bubbleLayer.js
  const draw = (b, hl, flip) => {
    const { L } = b, w = L.w, h = L.h, seed = C.hash(b.text + b.kind) % 9999
    const dN = aimRoundRectPath(M, w, h, Math.min(14, Math.round(h * 0.3)), hl[0], hl[1], TAIL.aMax, TAIL.foot)
    const svg = bubbleBodySvg(M, w, h, hl[0], hl[1], b.col, b.kind, seed).replace(/ d="[^"]*"/g, ' d="' + dN + '"')
    if (b.el.firstElementChild) { b.el.querySelector('svg').innerHTML = svg; return }
    const txt = L.lines.map((ln) => `<div data-part="${ln.part}" style="white-space:pre;text-align:center;margin-top:${ln.mt}px;transform-origin:50% 0">${lineHtml(ln)}</div>`).join('')
    b.el.innerHTML = `<div style="position:absolute;inset:0;transform-origin:${Math.round(hl[0])}px ${Math.round(hl[1])}px;filter:drop-shadow(0 3px 5px rgba(42,26,12,.28))"><svg width="${w + 2 * M}" height="${h + 2 * M}" style="position:absolute;left:0;top:0;overflow:visible">${svg}</svg><div style="position:absolute;left:${M}px;top:${M}px;width:${w}px;height:${h}px;padding:${L.padY}px ${L.padX}px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:'Shantell Sans','Comic Sans MS',cursive;font-size:${L.fs}px;line-height:${L.lh};color:${INK}">${txt}</div></div>`
    b.el.firstElementChild.animate([{ transform: 'scale(.82)', opacity: 0 }, { transform: 'scale(1.04)', opacity: 1, offset: 0.65 }, { transform: 'scale(1)', opacity: 1 }], { duration: 170, delay: b.delay || 0, fill: 'backwards', easing: 'cubic-bezier(.3,1.3,.5,1)' })
    if (flip) b.el.querySelectorAll('[data-part]').forEach((ln) => ln.animate([{ opacity: 0, transform: 'perspective(520px) rotateX(-86deg)' }, { opacity: 1, transform: 'perspective(520px) rotateX(0deg)' }], { duration: 300, delay: (b.delay || 0) + Number(ln.dataset.part) * STAGGER, fill: 'backwards', easing: 'cubic-bezier(.2,.9,.3,1.12)' }))
  }
  const make = (parts, kind, col, delay) => {
    const L = layoutTri(parts, kind), el = document.createElement('div')
    el.style.cssText = `position:absolute;left:0;top:0;width:${L.w + 2 * M}px;height:${L.h + 2 * M}px;transition:opacity .18s;will-change:transform`
    root.appendChild(el); const b = { el, L, w: L.w, h: L.h, kind, col, text: parts.join(' / '), delay }; items.push(b); return b
  }
  const put = (b, x, y, head) => { b.el.style.transform = `translate(${Math.round(x - M)}px,${Math.round(y - M)}px)`; b.x = x; b.y = y; return [Math.round(head[0] - (x - M)), Math.round(head[1] - (y - M))] }
  // Platzsuche aus bubbleLayer.js update(): Kandidaten um den Wunschplatz, kleinste Überdeckung mit HUD/Figuren/Blasen gewinnt
  const place = (b, x0, y0, placed) => {
    const pad = 12, cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
    const ov = (x, y) => { let a = 0; for (const o of placed) a += Math.max(0, Math.min(x + b.w + 8, o.x + o.w + 8) - Math.max(x, o.x)) * Math.max(0, Math.min(y + b.h + 8, o.y + o.h + 8) - Math.max(y, o.y)); return a }
    x0 = cl(x0, pad, W - pad - b.w); y0 = cl(y0, pad, H - pad - b.h); let best = null
    for (const dy of [0, -0.6, -1.2, 0.6, 1.2, 1.8, -1.8]) for (const dx of [0, -0.5, 0.5, -1, 1, -1.5, 1.5, -2, 2]) {
      const x = cl(x0 + dx * b.w, pad, W - pad - b.w), y = cl(y0 + dy * (b.h + 8), pad, H - pad - b.h), sc = ov(x, y) * 10 + Math.abs(x - x0) + 2 * Math.abs(y - y0)
      if (!best || sc < best.sc) best = { x, y, sc } }
    placed.push({ x: best.x, y: best.y, w: b.w, h: b.h }); return best
  }
  const clear = () => { for (const b of items) { const el = b.el; el.style.opacity = '0'; setTimeout(() => el.remove(), 250) } items = [] }

  // scene: { npc: {top:[x,y], head:[x,y], parts, col}, player: {head:[x,y]}, choices: [text], avoid: [{x,y,w,h}], onPick(i) }
  const show = (scene) => {
    clear(); const placed = (scene.avoid || []).map((r) => ({ ...r }))
    const n = scene.npc, nb = make(n.parts, 'speech', n.col || '#fbf2df', 0)
    const p = place(nb, n.top[0] - nb.w / 2, n.top[1] - 26 - nb.h, placed); draw(nb, put(nb, p.x, p.y, n.head), true)
    const t0 = n.parts.length * STAGGER + 260, ph = scene.player.head
    // Antwortspalte mittig auf Kopfhöhe der Spielfigur, damit jeder Zipfel vom linken Rand zum Kopf geht; NPC-Blase nur berücksichtigen, wenn sie darüber liegt
    const cb = scene.choices.map((txt, i) => make([txt], 'choice', '#fbf2df', t0 + i * 90)), GAP = 18
    const tot = cb.reduce((a, b) => a + b.h, 0) + GAP * (cb.length - 1)
    let y = ph[1] - tot / 2
    if (p.x + nb.w > scene.choiceX && p.x < scene.choiceX + Math.max(...cb.map((b) => b.w))) y = Math.max(y, p.y + nb.h + 30)
    scene.choices.forEach((txt, i) => {
      const b = cb[i]
      const q = { x: scene.choiceX, y }; placed.push({ x: q.x, y: q.y, w: b.w, h: b.h }); y = q.y + b.h + GAP
      // Spielerwahl: Zipfel immer links mittig, leicht zur Kopfhöhe geneigt (choiceLayer fehlt im Paket)
      const cy = q.y + b.h / 2, aim = [q.x - 90, cy + Math.max(-12, Math.min(12, (ph[1] - cy) * 0.2))]
      const hl = put(b, q.x, q.y, aim); draw(b, hl, false)
      const el = b.el, body = el.firstElementChild
      el.style.pointerEvents = 'none'; body.style.pointerEvents = 'none'; body.style.transition = 'transform .16s cubic-bezier(.3,1.6,.5,1)'
      const hit = body.lastElementChild; hit.style.pointerEvents = 'auto'; hit.style.cursor = 'pointer'
      hit.onmouseenter = () => { b.col = '#E9B53A'; draw(b, hl); body.style.transform = 'scale(1.05)' }
      hit.onmouseleave = () => { b.col = '#fbf2df'; draw(b, hl); body.style.transform = 'scale(1)' }
      hit.onpointerdown = (e) => { e.stopPropagation(); body.style.transform = 'scale(.96,.92)' }
      hit.onpointerup = () => { body.style.transform = 'scale(1.05)'; scene.onPick(i) }
      b.press = () => { body.style.transform = 'scale(.96,.92)'; setTimeout(() => { body.style.transform = 'scale(1)' }, 110) }
    })
  }
  return { show, clear, press: (i) => { const ch = items.filter((b) => b.kind === 'choice'); ch[i] && ch[i].press && ch[i].press() }, dispose() { root.remove(); items = [] } }
}
