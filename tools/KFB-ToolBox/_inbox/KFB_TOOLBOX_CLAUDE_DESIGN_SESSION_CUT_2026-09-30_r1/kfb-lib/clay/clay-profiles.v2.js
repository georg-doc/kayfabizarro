/* KFB Knet-Profile v2 — v2: Druckstellen und Haarrisse auf Gelände, Häusern und Straße seltener (Pixelaufnahme H0: zu dicht, Risse lasen als Netz).
 * KFB Knet-Profile v1 — ein Profil je Asset-Klasse. Gelesen von clay-material.v5 (makeClayMaterial({ profile })).
 * Maßstab: Welteinheiten, Figur ≈ 1,2 (D1, H0, WorldBuilder-Figur). Handmaß = Spuren haben feste Weltgröße.
 *   role   Rauheit/Glanz/Grundrelief (world · soft · knetbar)
 *   scale  Maßstab der Stempelkarte und Facetten (wie v4)
 *   stroke/grain/facet/crease  Faktor auf die globalen Regler
 *   print  Fingerabdrücke · gouge Kerben (Anteil der Zellen) · crack Haarrisse (Anteil der Flächen) · dent Druckstellen (Anteil)
 *   gougeSize/crackSize/dentSize  Zellgröße der Spur in Welteinheiten (vor Streuung je Objekt)
 *   soften  Vorstufe (clay-soften.v1) für diese Klasse, null = keine
 * Werte sind Setzungen aus H0/D1 (27.09.), nicht gemessen; Messung = Pixelaufnahme in drei Abständen. */
export const PROFILES = {
  terrainFg: { role: 'world',   scale: 1.1,  stroke: 1.0, grain: 1.0, facet: 1.0, crease: 1.0, print: 0.7, gouge: 0.30, crack: 0.28, dent: 0.3, gougeSize: 0.9,  crackSize: 0.34, dentSize: 1.2,  soften: null },
  terrainBg: { role: 'world',   scale: 3.2,  stroke: 0.8, grain: 0.6, facet: 1.0, crease: 0.6, print: 0.0, gouge: 0.0,  crack: 0.0,  dent: 0.6,  gougeSize: 2.0,  crackSize: 1.0,  dentSize: 3.5,  soften: null },
  nature:    { role: 'soft',    scale: 0.6,  stroke: 0.8, grain: 1.0, facet: 0.8, crease: 0.5, print: 1.0, gouge: 0.12, crack: 0.0,  dent: 0.75, gougeSize: 0.35, crackSize: 0.2,  dentSize: 0.32, soften: { maxLevels: 0, iters: 1, lump: 0.06 } },
  house:     { role: 'world',   scale: 0.5,  stroke: 1.0, grain: 1.0, facet: 1.0, crease: 1.0, print: 0.8, gouge: 0.40, crack: 0.22, dent: 0.3, gougeSize: 0.6,  crackSize: 0.26, dentSize: 0.6,  soften: {} },
  road:      { role: 'world',   scale: 0.5,  stroke: 0.55, grain: 1.2, facet: 0.6, crease: 0.4, print: 0.4, gouge: 0.14, crack: 0.35, dent: 0.2, gougeSize: 0.8,  crackSize: 0.3,  dentSize: 0.8,  soften: { maxEdge: 0.16, iters: 4, lump: 0.01 } },
  figure:    { role: 'soft',    scale: 0.5,  stroke: 1.0, grain: 1.0, facet: 1.0, crease: 1.0, print: 1.0, gouge: 0.0,  crack: 0.0,  dent: 0.35, gougeSize: 0.3,  crackSize: 0.2,  dentSize: 0.3,  soften: null },
  vehicle:   { role: 'soft',    scale: 0.5,  stroke: 0.9, grain: 1.0, facet: 1.0, crease: 0.8, print: 0.9, gouge: 0.08, crack: 0.0,  dent: 0.35, gougeSize: 0.4,  crackSize: 0.2,  dentSize: 0.4,  soften: { maxEdge: 0.03, iters: 4, lump: 0.002 } },
  prop:      { role: 'world',   scale: 0.5,  stroke: 1.0, grain: 1.0, facet: 1.0, crease: 1.0, print: 0.9, gouge: 0.25, crack: 0.15, dent: 0.4,  gougeSize: 0.4,  crackSize: 0.2,  dentSize: 0.4,  soften: {} },
  water:     { role: 'knetbar', scale: 0.9,  stroke: 0.7, grain: 0.8, facet: 0.6, crease: 0.3, print: 0.6, gouge: 0.0,  crack: 0.0,  dent: 0.3,  gougeSize: 0.9,  crackSize: 0.3,  dentSize: 1.0,  soften: null },
  cloud:     { role: 'soft',    scale: 0.75, stroke: 1.0, grain: 1.0, facet: 1.0, crease: 0.8, print: 0.7, gouge: 0.0,  crack: 0.0,  dent: 0.5,  gougeSize: 1.0,  crackSize: 0.3,  dentSize: 1.0,  soften: { maxLevels: 0, iters: 1, lump: 0.07 } }
};
PROFILES.default = PROFILES.prop;

export const PROFILE_LABELS = {
  terrainFg: 'Gelände Vordergrund', terrainBg: 'Gelände Hintergrund', nature: 'Natur', house: 'Häuser', road: 'Straße',
  figure: 'Figuren', vehicle: 'Fahrzeuge', prop: 'Requisiten', water: 'Wasser', cloud: 'Wolken'
};
