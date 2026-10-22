// WS-NPC V-662 (Lead 22.10.) · Knete-Werte „kit-figure“ für Kit-Figuren aus der Spielkamera, als Vorschlag für kfb-clay v1.2 (WS0).
// kfb-clay.v1.1.js bleibt byte-gleich: applyClay läuft mit dem Profil character, danach setzt applyKitFigure die Werte über die öffentlichen
// handle.uniforms (gleiche Shader, nur andere Uniform-Werte). Schalter #kitclay=2 (M1World); Standard bleibt character.
// Grund (K1, gemessen 22.10. bei 3200×1800, fov 55°): Kit-Figuren ≈ 1,57 m, im Bild 25 % (6 m), 12,6 % (12 m), 7,6 % (20 m) der Bildhöhe.
// Mit character liegt bei 12 m der Lump (0,085 · 0,126 = 1,07 % der Bildhöhe) nur zu ≈ 32 % in seinem Band [1/160, 1/50], die feine Dent-Ebene
// (0,03) zu ≈ 37 % in [1/480, 1/150] – die Knete blendet aus der Spielkamera weitgehend aus. kit-figure vergrößert die Merkmale so, dass sie bei
// 12 m in der oberen Bandhälfte liegen (K2), und macht sie steiler; Bänder (Kantenschutz gegen Flimmern), Körnung, Farbe und Rauheit bleiben.
export const KIT_FIGURE = Object.freeze({
  id: 'kit-figure', base: 'character', label: 'Kit-Figuren aus der Spielkamera (Vorschlag v1.2)',
  lump: Object.freeze({ size: 0.12, slope: 0.22 }), // character 0,085 / 0,16
  dent: Object.freeze({ size: 0.045, slope: 0.2 }), // character 0,03 / 0,15 (density, rim, Form unverändert)
  dent2: Object.freeze({ size: 0.1, slope: 0.24 }), // character 0,075 / 0,19
  maxSlope: 0.5, // character 0,42 (K5: ≤ 0,5)
})

// Lage eines Merkmals im Band [gone, full] bei einer Bildhöhen-Anteil der Figur (0 = ausgeblendet, 1 = voll sichtbar)
export const bandPos = (size, figShare, band) => Math.max(0, Math.min(1, (size * figShare - band[0]) / (band[1] - band[0])))

export function applyKitFigure(handle, P = KIT_FIGURE) {
  const U = handle?.uniforms; if (!U?.uClayLump) return false
  U.uClayLump.value.set(P.lump.size, P.lump.slope)
  U.uClayDent.value.x = P.dent.size; U.uClayDent.value.z = P.dent.slope
  U.uClayDent2.value.x = P.dent2.size; U.uClayDent2.value.z = P.dent2.slope
  U.uClayMaxSlope.value = P.maxSlope
  handle.kit = P.id
  return true
}
