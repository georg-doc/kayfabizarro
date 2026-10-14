// S5c · Spielerwahl „choice“ 2 × 2 (Host-Vertrag R1.2 §4, Host-Slot #ui-choice).
// Vorlage: ChatterBox Studio v2 (Cut r2, 05.10.) – Vertrag HANDOVER_WSA_CHATTERBOX_TRIPLET §3 „Zurufe (Player)“:
//   bubbleKind 'choice', 2 Spalten × 2, Reihenfolge und Tasten fix: 1 KayfaBINGO! · 2 KayfaBOGGLE? · 3 KayfaBONGO! · 4 BLÖDSINN!,
//   Labels exakt, Ziele ≥ 44 px, nach Auswahl Stempel 420 ms → Choice tritt ab → Antwort.
// Geometrie aus Studio choiceGeo() (Schrift 0,95 × Basis, padO 10, Tastenkreis 26, Abstand 8, Zeile ≥ 44 px, zwei Spalten);
// Platzierung über dem Player-Anker wie Studio place() (erste Lage: mittig über dem Kopf, sonst unten andocken).
// Bewusste Abweichungen vom Studio (Studio ist älter als V-204/V-214, Optik der Auswahl ist NICHT abgenommen):
//   (1) Blasenkörper = Plain-Blase wie die Sprechblase (roundRectPath + clayFront, ohne Rim-Wände, ein Zipfel zum Player),
//   (2) Tastenkreis ohne Tusche-Rand (Studio: 2 px #1f1a14), (3) Hover/Fokus ohne harten dunklen Schatten.
// Optional bis 8 eigene Wörter (Vertrag §4): Eingabefeld unter dem Raster; die Wörter stammen vom Spieler, nicht vom Spiel.
import './vendor/chatterbox-core.js'

export const ZURUFE = [
  { id: 'bingo', key: '1', label: 'KayfaBINGO!', color: '#e2b33c' },
  { id: 'boggle', key: '2', label: 'KayfaBOGGLE?', color: '#59c3e6' },
  { id: 'bongo', key: '3', label: 'KayfaBONGO!', color: '#7fc46a' },
  { id: 'bloedsinn', key: '4', label: 'BLÖDSINN!', color: '#e5563d' },
]
export const STAMP_MS = 420
export const MAX_OWN_WORDS = 8
const INK = '#1f1a14'
const mix = (a, b, t) => { const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v * (1 - t) + B[i] * t).toString(16).padStart(2, '0')).join('') }
export const countWords = (s) => s.trim().split(/\s+/).filter(Boolean).length

// host: Element #ui-choice. onChoice({ id, label } | { id: 'own', text }) wird nach dem Stempel gerufen.
export function createChoiceLayer({ host, onChoice }) {
  const C = window.KFB_CB
  let cur = null // { el, picked, timer, input, anchorXY }

  function geo(W, base) {
    // Studio choiceGeo(), Zweig two=true (cols 2), mobile=false
    const fs = Math.max(13, Math.round(base * 0.95)), padO = 10, keyW = 26, gap = 8, pad = 12
    const maxW = Math.min(Math.max(W * 0.42, 260), 440), textMax = maxW - 2 * padO - keyW - 34
    const rows = ZURUFE.map((o) => { const ls = C.wrapBalanced(o.label, 40, textMax, (x) => C.measure(x, fs, 'body')); return { ls, tw: Math.max(...ls.map((l) => C.measure(l, fs, 'body'))), h: Math.max(44, Math.round(ls.length * fs * 1.22 + 16)) } })
    const cw = Math.max(...rows.map((r) => r.tw)) + keyW + 40, rh = Math.max(...rows.map((r) => r.h))
    const w = Math.round(Math.min(W - 2 * pad, 2 * cw + gap + 2 * padO)), ownH = 40, h = 2 * rh + gap + 2 * padO + ownH + gap
    return { fs, padO, keyW, gap, rows, rh, w, h, ownH, pad }
  }

  function close() { if (!cur) return; clearTimeout(cur.timer); cur.el.remove(); cur = null }

  function pick(i, ownText) {
    if (!cur || cur.picked != null) return
    cur.picked = i
    const btns = cur.el.querySelectorAll('[data-key]')
    btns.forEach((b, j) => {
      if (j === i) { b.style.background = mix('#fffaf0', ZURUFE[j].color, 0.4); b.style.transform = 'scale(1.03)' }
      else { b.style.opacity = '0.15'; b.style.transform = 'translateY(6px)' }
    })
    const res = i === -1 ? { id: 'own', text: ownText } : { id: ZURUFE[i].id, label: ZURUFE[i].label }
    cur.timer = setTimeout(() => { close(); onChoice?.(res) }, STAMP_MS)
  }

  function open({ anchorXY = null } = {}) {
    close()
    const W = innerWidth, H = innerHeight, base = Math.round(Math.max(15, Math.min(20, H / 42))), g = geo(W, base), M = 34
    // Studio place(): über dem Kopf, mittig; ohne Platz -> unten andocken, neben dem Player
    const hx = anchorXY ? anchorXY[0] : W / 2, hy = anchorXY ? anchorXY[1] : H - 6
    let bx = Math.max(g.pad, Math.min(W - g.pad - g.w, hx - g.w / 2)), by = hy - 22 - g.h
    if (by < g.pad) { by = H - g.h - g.pad; bx = hx > W / 2 ? Math.max(g.pad, hx - 36 - g.w) : Math.min(W - g.pad - g.w, hx + 36) }
    const hlx = hx - (bx - M), hly = Math.min(hy, by + g.h + 60) - (by - M)
    const seed = C.hash('choice') % 9999, d = C.roundRectPath(M, g.w, g.h, Math.min(14, Math.round(g.h * 0.3)), seed, hlx, hly, 16, 12)
    const face = mix('#fbf2df', '#c9a46a', 0.2), layers = [{ d, fill: face }, ...C.clayFront(d)]
    const svg = layers.map((l) => `<path d="${l.d}" fill="${l.fill ?? 'none'}"${l.op != null ? ` opacity="${l.op}"` : ''}/>`).join('')
    const el = document.createElement('div')
    el.dataset.kind = 'choice'
    el.style.cssText = `position:fixed;left:${Math.round(bx - M)}px;top:${Math.round(by - M)}px;width:${g.w + 2 * M}px;height:${g.h + 2 * M}px;pointer-events:none;filter:drop-shadow(0 3px 5px rgba(42,26,12,.28))`
    const ow = (g.w - 2 * g.padO - g.gap) / 2
    const btn = (o, i) => {
      const lx = g.padO + (i % 2) * (ow + g.gap), yy = g.padO + Math.floor(i / 2) * (g.rh + g.gap)
      // Studio-Stil „Clay pur“ der Antwortzeile, ohne Tusche (Abweichung 2/3)
      const st = `position:absolute;left:${lx}px;top:${yy}px;width:${ow}px;height:${g.rh}px;display:flex;align-items:center;gap:10px;padding:0 10px;background:#fffaf0;border:none;border-radius:10px;cursor:pointer;text-align:left;font-family:'Shantell Sans',cursive;font-size:${g.fs}px;line-height:1.22;color:${INK};box-shadow:inset 1.5px 2px 0 rgba(255,255,255,.8), inset -2px -3px 6px rgba(90,55,25,.2), 0 2px 4px rgba(50,30,12,.22);transition:transform .16s, opacity .2s, background .14s;pointer-events:auto`
      return `<button data-key="${o.key}" title="${o.id}" style="${st}"><span style="flex:none;width:26px;height:26px;border-radius:50%;background:${o.color};display:flex;align-items:center;justify-content:center;font-family:Bangers,'Shantell Sans',cursive;font-size:16px;line-height:1;color:${INK};box-shadow:inset 0 -2px 0 rgba(0,0,0,.18)">${o.key}</span><span style="white-space:pre">${o.label}</span></button>`
    }
    const oy = g.padO + 2 * g.rh + 2 * g.gap
    el.innerHTML = `<svg width="${g.w + 2 * M}" height="${g.h + 2 * M}" style="position:absolute;left:0;top:0;overflow:visible">${svg}</svg>
      <div style="position:absolute;left:${M}px;top:${M}px;width:${g.w}px;height:${g.h}px">${ZURUFE.map(btn).join('')}
      <input data-own maxlength="80" placeholder="eigene Wörter (bis ${MAX_OWN_WORDS}) · Enter" style="position:absolute;left:${g.padO}px;top:${oy}px;width:${g.w - 2 * g.padO}px;height:${g.ownH}px;box-sizing:border-box;border:none;border-radius:10px;padding:0 12px;background:#fffaf0;font-family:'Shantell Sans',cursive;font-size:${Math.round(g.fs * 0.9)}px;color:${INK};box-shadow:inset 1.5px 2px 0 rgba(255,255,255,.8), inset -2px -3px 6px rgba(90,55,25,.2);pointer-events:auto;outline-color:#e2b33c"></div>`
    host.appendChild(el)
    el.querySelectorAll('[data-key]').forEach((b, i) => b.addEventListener('click', () => pick(i)))
    const input = el.querySelector('[data-own]')
    input.addEventListener('input', () => { input.style.boxShadow = countWords(input.value) > MAX_OWN_WORDS ? 'inset 0 0 0 2px #e5563d' : 'inset 1.5px 2px 0 rgba(255,255,255,.8), inset -2px -3px 6px rgba(90,55,25,.2)' })
    cur = { el, picked: null, timer: 0, input }
  }

  // Tastatur kommt über den Host-Router (PRIO.choice): Ziffern 1–4; Enter im Feld schickt die eigenen Wörter
  function key(e) {
    if (!cur || cur.picked != null) return false
    if (e.target === cur.input) {
      if (e.key === 'Enter') { const t = cur.input.value.trim(); const n = countWords(t); if (n >= 1 && n <= MAX_OWN_WORDS) { e.preventDefault(); pick(-1, t) } else e.preventDefault(); return true }
      return false
    }
    const i = ZURUFE.findIndex((o) => o.key === e.key)
    if (i >= 0) { e.preventDefault(); pick(i); return true }
    return false
  }

  return { open, close, key, isOpen: () => !!cur, dispose: close }
}
