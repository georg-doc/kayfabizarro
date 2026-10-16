// V-345 · Ein Meter für alle: WS1 rechnet in WS0-/J17-Metern (FB 1,81 m = 2,94 Rig × 0,616 m/Rig, Maßstab A aus J17).
// Vorher stand FB auf der WS1-Bühne mit dem P08-Klassen-Faktor CLASS_K 0,947 als „1 Rig = 1 m“ da, also 2,79 m hoch; die ganze WS1-Bühne
// (Amphitheater 14 m, Tafel, Marken, Kameras) war darauf abgestimmt, ≈ 1,54 × zu groß. WORLD_K rechnet diese alten WS1-Bühnenmeter in J17-Meter um.
// Meshy-Bühnen brauchen keine Umrechnung: Ihre Slot-Dateien (scale_m_per_u) sind schon in WS0-Metern angelegt (goblin v2: figures.heights_m 1,8/2,0).
// Ohne three, ohne DOM. Physik-Werte (M1/M2) rechnet die Bewegungs-Sitzung mit denselben Konstanten um.
export const M_PER_RIG = 0.616381042 // WS0 V-311/V-345: J17-Maßstab A
export const CLASS_K = 0.947 // P08 CLASS_K (Rig_Medium), bisheriger WS1-Figurenfaktor in recipe.stage.scale
export const FB_RIG_HEIGHT = 2.94 // FB_TEMPLATE_LOOK_v5b mit Ohren, in Rig-Einheiten
export const FB_HEIGHT_M = +(FB_RIG_HEIGHT * M_PER_RIG).toFixed(3) // 1,812 m
export const WORLD_K = M_PER_RIG / CLASS_K // ≈ 0,6509: alte WS1-Bühnenmeter → J17-Meter
// Hash: wscale=legacy zeigt die alte, 1,54-fach große Bühne (nur zum Vergleich im Bildpaar)
export const worldKFor = (hash = '') => (/(^|[#,])wscale=legacy(,|$)/.test(hash) ? 1 : WORLD_K)
// Hilfen: alte WS1-Bühnenmeter (Zahl oder [x, y, z]) in J17-Meter
export const toJ17 = (v, k = WORLD_K) => (Array.isArray(v) ? v.map((x) => x * k) : v * k)
