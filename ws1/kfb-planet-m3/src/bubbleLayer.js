// S5a · Sprechblasen-Ebene (Host-Vertrag R1.2 §4, V-204, V-212): genau ein Blasen-Renderer.
// Herausgelöst aus dem Lab `src/world/organ/islands-npc.ts` (Blob 13ad2738, register-branch replies/lab-donors/):
// layoutTri(), say(), draw() (dort Z. 76–102) und die Blasen-Platzierung aus update() (Z. 160–176) – hier unverändert
// bis auf diese Stellen: (1) ohne TypeScript-Typen, (2) eine Blase hängt an einer Anker-ID statt an einem NPC, (3) liegt der
// Anker außerhalb des Bildes, wird die Blase ausgeblendet (Vertrag §4) statt an den Rand gedrückt, (4) Wurzel ist der Host-Slot
// #ui-bubbles statt eines eigenen fixed-Overlays, (5) die Sprecherfarbe kommt vom Aufrufer (Lab: ORIGINAL[npc.id].color),
// (6) Form/Schichten liegen in bubbleBodySvg(), damit die Spielerwahl denselben Körper nutzt.
// Formen und Layout: chatterbox-core.js (cbs-core 0.1) 1:1. Look V-204: „Clay pur“, keine Tusche, eine Form, ein Zipfel, weicher Schatten.
// Kein React, kein Store: Positionen setzt update() direkt per style.transform (Falle 2).
import * as THREE from 'three'
import './vendor/chatterbox-core.js' // 1:1 aus ChatterBox Studio v2 Cut r2 (Blob f59a8a1a), setzt window.KFB_CB

export const STAGGER = 520
export const BUBBLE_LIFE = 7.5
const INK = '#1f1a14'
const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v * (1 - t) + B[i] * t).toString(16).padStart(2, '0')).join('') }
const DEFS = '<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="kfbWallShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000000" stop-opacity="0"/><stop offset="1" stop-color="#1a0f05" stop-opacity=".32"/></linearGradient><filter id="kfbSoftShadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter><pattern id="kfbDotsWarm" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.3" fill="#b38a55"/></pattern><linearGradient id="kfbFaceShade" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".34"/><stop offset=".48" stop-color="#ffffff" stop-opacity="0"/><stop offset="1" stop-color="#2a1a0c" stop-opacity=".14"/></linearGradient><radialGradient id="kfbFade" cx="0.8" cy="0.86" r="0.8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#000000"/></radialGradient><mask id="kfbCornerMask" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#kfbFade)"/></mask></defs></svg>'

// Ein Blasenkörper für alle Blasenarten (V-212): Form und Schichten aus islands-npc.ts draw() (Z. 90–93), unverändert.
// Auch die Spielerwahl (choiceLayer) zeichnet ihren Körper hierüber.
export function bubbleBodySvg(M, w, h, hlx, hly, col, kind, seed) {
  const C = window.KFB_CB
  let d, dots = ''; if (kind === 'thought') { d = C.thoughtPath(M, w, h, seed); dots = C.thinkDots(M, w, h, hlx, hly, seed) } else d = C.roundRectPath(M, w, h, Math.min(14, Math.round(h * 0.3)), seed, hlx, hly, 16, 12)
  const full = dots ? d + ' ' + dots : d, face = mix('#fbf2df', col, 0.2), layers = [{ d: full, fill: face }, ...C.clayFront(full)]
  return layers.map((l) => `<path d="${l.d}" fill="${l.fill ?? 'none'}"${l.stroke ? ` stroke="${l.stroke}" stroke-width="${l.sw}" stroke-linejoin="round" stroke-miterlimit="6" stroke-linecap="round"` : ''}${l.tf ? ` transform="${l.tf}"` : ''}${l.op != null ? ` opacity="${l.op}"` : ''}${l.filter ? ` filter="${l.filter}"` : ''}${l.mask ? ` mask="${l.mask}"` : ''}/>`).join('')
}

// host: das Element des Host-Slots #ui-bubbles. Liefert show() / update() / dispose().
export function createBubbleLayer({ host }) {
  const C = window.KFB_CB
  if (!document.querySelector('link[data-kfb-shantell]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Shantell+Sans:wght@400;700&display=swap'; l.dataset.kfbShantell = '1'; document.head.appendChild(l) }
  const root = document.createElement('div'); root.style.cssText = 'position:absolute;inset:0;pointer-events:none;overflow:hidden'
  root.innerHTML = DEFS; host.appendChild(root)
  const bubbles = []
  let uid = 0

  // ---- 1:1 islands-npc.ts layoutTri()
  const layoutTri = (parts, kind) => {
    const base = Math.round(Math.max(15, Math.min(20, innerHeight / 42))), Ls = parts.map((p) => C.layout(p, kind, { basePx: base, maxPx: Math.min(420, innerWidth * 0.42) })), L0 = Ls[0], fs = L0.fontPx, lh = L0.lh, gap = Math.round(fs * 0.5)
    const inner = Math.max(...Ls.map((l) => l.w - 2 * l.padX)); let n = 0; const lines = []
    Ls.forEach((l, pi) => l.lines.forEach((toks, li) => { lines.push({ text: toks.map((t) => t.text).join(''), mt: pi > 0 && li === 0 ? gap : 0, part: pi }); n++ }))
    return { w: Math.round(inner + 2 * L0.padX), h: Math.round(n * fs * lh + gap * (Ls.length - 1) + 2 * L0.padY), padX: L0.padX, padY: L0.padY, fs, lh, lines }
  }
  // ---- 1:1 islands-npc.ts say(), Sprecher = Anker-ID, Farbe vom Aufrufer (Lab: ORIGINAL[npc.id].color)
  const say = (anchor, parts, kind, col) => {
    for (const b of bubbles) if (b.anchor === anchor) b.t = Math.max(b.t, BUBBLE_LIFE - 0.2)
    const L = layoutTri(parts, kind), M = 34, el = document.createElement('div')
    el.style.cssText = `position:absolute;left:0;top:0;width:${L.w + 2 * M}px;height:${L.h + 2 * M}px;transition:opacity .18s;will-change:transform`
    el.dataset.kind = kind; el.dataset.speaker = anchor; el.dataset.text = parts.join(' / ')
    root.appendChild(el); const b = { el, anchor, w: L.w, h: L.h, t: 0, tri: kind === 'speech' }; bubbles.push(b); draw(b, L, M, col, kind, ++uid)
    return b
  }
  // ---- 1:1 islands-npc.ts draw()
  const draw = (b, L, M, col, kind, id, hl) => {
    const w = L.w, h = L.h, seed = C.hash(b.el.dataset.text + kind) % 9999, hlx = hl ? hl[0] : M + w / 2, hly = hl ? hl[1] : M + h + 30
    const svg = bubbleBodySvg(M, w, h, hlx, hly, col, kind, seed)
    const txt = L.lines.map((ln) => `<div data-part="${ln.part}" style="white-space:pre;text-align:center;margin-top:${ln.mt}px;transform-origin:50% 0">${ln.text.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</div>`).join('')
    if (hl) { b.el.querySelector('svg').innerHTML = svg; b.hl = [hlx, hly]; return }
    b.el.innerHTML = `<div style="position:absolute;inset:0;transform-origin:${Math.round(hlx)}px ${Math.round(hly)}px;filter:drop-shadow(0 3px 5px rgba(42,26,12,.28))"><svg width="${w + 2 * M}" height="${h + 2 * M}" style="position:absolute;left:0;top:0;overflow:visible">${svg}</svg><div style="position:absolute;left:${M}px;top:${M}px;width:${w}px;height:${h}px;padding:${L.padY}px ${L.padX}px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:'Shantell Sans','Comic Sans MS',cursive;font-size:${L.fs}px;line-height:${L.lh};color:${INK}">${txt}</div></div>`
    b.el.firstElementChild.animate([{ transform: 'scale(.82)', opacity: 0 }, { transform: 'scale(1.04)', opacity: 1, offset: 0.65 }, { transform: 'scale(1)', opacity: 1 }], { duration: 170, easing: 'cubic-bezier(.3,1.3,.5,1)' })
    if (kind === 'speech') b.el.querySelectorAll('[data-part]').forEach((ln) => ln.animate([{ opacity: 0, transform: 'perspective(520px) rotateX(-86deg)' }, { opacity: 1, transform: 'perspective(520px) rotateX(0deg)' }], { duration: 300, delay: Number(ln.dataset.part) * STAGGER, fill: 'backwards', easing: 'cubic-bezier(.2,.9,.3,1.12)' }))
    b.L = L; b.M = M; b.col = col; b.kind = kind; b.id = id; b.hl = [hlx, hly]
  }

  const V = new THREE.Vector3()
  // anchorAt(id, out) -> out (Weltposition) oder null; vom Host je Frame gerufen
  const update = (dt, camera, anchorAt) => {
    // ---- 1:1 islands-npc.ts update(), Abschnitt „bubbles“
    const W = innerWidth, H = innerHeight, placed = []
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i]; b.t += dt; if (b.t > BUBBLE_LIFE) { b.el.style.opacity = '0'; if (b.t > BUBBLE_LIFE + 0.25) { b.el.remove(); bubbles.splice(i, 1) } continue }
      const p = anchorAt(b.anchor, V)
      const a = p ? p.project(camera) : null
      // Vertrag §4: Anker hinter der Kamera ODER außerhalb des Bildes -> ausblenden (Lab: nur hinter der Kamera)
      if (!a || a.z > 1 || a.z < -1 || a.x < -1 || a.x > 1 || a.y < -1 || a.y > 1) { b.el.style.display = 'none'; continue } b.el.style.display = ''
      const hx = (a.x * 0.5 + 0.5) * W, hy = (-a.y * 0.5 + 0.5) * H, M = b.M, pad = 12, gap = 26
      let bx = Math.max(pad, Math.min(W - pad - b.w, hx - b.w / 2)), by = hy - gap - b.h; if (by < pad) by = pad
      for (const o2 of placed) { const hit = () => bx < o2.x + o2.w + 8 && bx + b.w + 8 > o2.x && by < o2.y + o2.h + 8 && by + b.h + 8 > o2.y; if (!hit()) continue
        const nx = hx < o2.hx ? o2.x - b.w - 8 : o2.x + o2.w + 8; if (nx >= pad && nx + b.w <= W - pad) bx = nx; else by = Math.max(pad, o2.y - b.h - 8); if (hit()) by = o2.y + o2.h + 8 }
      placed.push({ x: bx, y: by, w: b.w, h: b.h, hx })
      const last = b.at; if (last && Math.abs(last[0] - bx) < 0.5 && Math.abs(last[1] - by) < 0.5) continue; b.at = [bx, by]
      b.el.style.transform = `translate(${Math.round(bx - M)}px,${Math.round(by - M)}px)`
      const hl = [Math.round(hx - (bx - M)), Math.round(Math.min(hy, by + b.h + 60) - (by - M))], ph = b.hl
      if (Math.abs(ph[0] - hl[0]) > 6 || Math.abs(ph[1] - hl[1]) > 6) draw(b, b.L, M, b.col, b.kind, b.id, hl)
    }
  }

  return {
    // parts: 1–3 Teile (Triplet: subject · connector · reframe), kind 'speech' | 'thought'. Textquelle prüft der Host (Vertrag §5).
    show: (anchor, parts, kind = 'speech', color = '#fbf2df') => { say(anchor, parts, kind, color) },
    update,
    list: () => bubbles.map((b) => ({ anchor: b.anchor, text: b.el.dataset.text, kind: b.el.dataset.kind, t: +b.t.toFixed(2), shown: b.el.style.display !== 'none', rect: b.el.getBoundingClientRect().toJSON() })),
    dispose() { root.remove(); bubbles.length = 0 },
  }
}
