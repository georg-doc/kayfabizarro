// #439 · world=probe: Geländeform der Gelände-Probe als zweite Welt (Georg 21.10.). GENERIERT von probe/port/gen_height.py aus probe/gelaende-probe.html,
// nicht von Hand ändern: Probe ändern und neu erzeugen. Kopiert (nicht abgeschrieben): Rauschen (snoise), Höhenfunktion hgt() mit hraw/fbm/rfbm/octW,
// Diorama-Anker (dioSDJS/dioModJS), Sockelhöhe ringY, Flussrinne (rivSampleJS/rivModJS), Uferböschung (bankJS), Vorlagen und recipeToUI.
// Rezept → Regler → S wie „Rezept übernehmen“ in einer frischen Probe: Regler-Grundwerte aus dem HTML, Startvorlage, recipeToUI, Schieberegler-Rundung, readUI.
// Einheit J17-Meter (1 Probe-m = 1 Spiel-m, beide M_PER_RIG 0,616). Ohne three, ohne DOM.
//   createProbeHeight(recipe, { anchors, riverField, fluid }) → { height(x, z), settings, anchors, ringY(A) }
//   anchors    Diorama-Anker im Probe-Format { x, z, R, y, on, bh, bw, open, hx, hz, rot, blend }; lebende Liste wie DIOA (spätere gewinnen)
//   riverField { N, size, ox, oz, data } wie RIV der Probe (RGBA-Float: R = Sohle·Gewicht, G = Gewicht, B = 3×3-Maximum); Standard keiner → rivMod ohne Wirkung
//   fluid      Fluid-Auswahl der Probe (steht nicht im Rezept; 3 = Island Kit, Grundwert) – wirkt nur über die Böschung bei Wasserstand > 0
export const PROBE_HEIGHT_SRC = Object.freeze(/*@META@*/)
const UI = /*@UI@*/   /* Regler der Probe (aus dem HTML): NUM/BOOL wie readUI, Grundwert und Bereich je Regler */
/*@PRESETS@*/
const PALETTES = {}, PAL_KEYS = [], regRezeptPal = () => {}   /* Farben zählen für die Höhe nicht; recipeToUI braucht nur die Namen */
/*@RECIPE_TO_UI@*/

// Schieberegler wie im Browser: auf [min, max] begrenzt, auf das Schrittraster gerundet (Werte auf dem Raster bleiben bitgleich)
const dec = (s) => (String(s).split('.')[1] || '').length
function rangeValue(r, v) { let x = Number(v); if (!Number.isFinite(x)) return r.value; x = Math.min(r.max, Math.max(r.min, x)); const k = (x - r.min) / r.step
  if (Math.abs(k - Math.round(k)) < 1e-9) return x; let y = +(r.min + Math.floor(k + 0.5) * r.step).toFixed(dec(r.step)); if (y > r.max) y = +(y - r.step).toFixed(dec(r.step)); return y }
function freshUI() { const st = { v: {}, c: {} }; for (const [id, r] of Object.entries(UI.inputs)) { if (r.type === 'range') st.v[id] = r.value; else st.c[id] = r.checked } return st }
function setUI(st, p) { for (const k of UI.NUM) if (p[k] != null && UI.inputs[k]) st.v[k] = rangeValue(UI.inputs[k], p[k]); for (const k of UI.BOOL) if (p[k] != null && UI.inputs[k]) st.c[k] = !!p[k] }   /* = setUI der Probe (nur Regler) */

export function createProbeHeight(recipe, { anchors = [], riverField = null, fluid = 3 } = {}) {
  if (!recipe || typeof recipe !== 'object' || !String(recipe.schema || '').startsWith('kfb.terrain-recipe/')) throw new Error('createProbeHeight: kein Gelände-Rezept (schema „kfb.terrain-recipe/…“ fehlt)')
  /* ---------- Probe 1:1 ---------- */
/*@NOISE@*/
/*@HEIGHT@*/
  const DIOA = anchors.map((a) => ({ ...a }));   /* Spiel: eigene Liste statt DIO/DIOS der Probe */
/*@DIO@*/
/*@RINGY@*/
  /* ---------- Rezept → S wie in der frischen Probe: setUI(PRESETS[DEFAULT]), grid aus, setUI(recipeToUI(r)), readUI ---------- */
  const ui = freshUI(); setUI(ui, PRESETS[DEFAULT]); ui.c.grid = false; setUI(ui, recipeToUI(recipe))
  for (const k of UI.NUM) S[k] = parseFloat(ui.v[k]); for (const k of UI.BOOL) S[k] = ui.c[k]; S.fluid = fluid
/*@SEED@*/
  BANK.L = S.water * S.amp + 0.15; BANK.D = S.fluid === 3 && S.water > 0.005 && !S.vox ? 1.5 : 0   /* = pushUniforms der Probe (Wortlaut prüft der Generator) */
  if (riverField) Object.assign(RIV, riverField, { on: true })
  GZERO = !(S.plateau < 0.999 || S.steps >= 1)   /* gG (3 von 4 hraw je Punkt) braucht hgt nur für Tafelkante und Terrassen; ohne beide bitgleich, ≈ 4× schneller (Schalter der Probe, Voxel-Pfad) */
  return { height: hgt, settings: S, anchors: DIOA, ringY }
}
