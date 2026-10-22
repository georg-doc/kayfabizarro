// Knet-HUD (V-653) · drei Zonenfarben der HUD-Props aus der Insel-Palette: base = Grundton, accent = Blickfang, detail = dunkle Kante.
// Quelle ist die Palette, mit der das Gelände malt (terrain3: TERRAIN3_CFG.palettes, Rollen water/sand/low/mid/high/peak/cliff/sky):
//   base   = mid (Grundton des Bodens, V-305 „Boden trägt den Grundton“)
//   accent = water (Gegenfarbe der Insel im Candy-Band, deutlich bunter gezogen), Kit-Akzente (Tasten, Halbkreis, Ziffern) heben sich so ab
//   detail = cliff, in OKLCH um ΔL 0,12 dunkler (WS0-Messung: dunkel = mitte − ΔL 0,04…0,12), Kanten und Beschläge
// Prüf-Paletten der N29-Bögen (otown, bucht) 1:1 aus data/kfb_hud_props.r1.json (proofPalettes), Schalter hudpal=otown|bucht.
import { hexToOklch, oklchHex } from '../look/paletteGen.js'

export const PROOF_PALETTES = Object.freeze({
  otown: { base: '#3aa596', accent: '#c9508f', detail: '#462e60' },
  bucht: { base: '#f0cf7e', accent: '#9a6fd0', detail: '#8e5a40' },
})

const shift = (hex, dL = 0, kC = 1, Lmin = 0, Cmin = 0) => { const [L, C, H] = hexToOklch(hex); return oklchHex(Math.max(Lmin, L + dL), Math.max(Cmin, C * kC), H) }

// P: Palette mit Rollen (terrain3) · Rückgabe { base, accent, detail } als #rrggbb
export function hudZones(P) {
  if (!P) return { ...PROOF_PALETTES.otown }
  if (P.base && P.accent && P.detail) return { base: P.base, accent: P.accent, detail: P.detail }
  return {
    base: P.mid || P.low || '#cc6c42',
    accent: shift(P.water || P.cliff || '#3fa7a0', 0, 1.35, 0.55, 0.12),
    detail: shift(P.cliff || P.high || '#5a3a2a', -0.12, 0.9),
  }
}

// Hash-Schalter hudpal=otown|bucht (Prüfung gegen die N29-Bögen), sonst null
export function proofPaletteFromHash(hash = '') { const m = /(^|[#,])hudpal=(otown|bucht)(,|$)/.exec(hash); return m ? PROOF_PALETTES[m[2]] : null }
