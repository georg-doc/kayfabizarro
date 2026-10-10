// @ts-nocheck
// Visual Recovery Lab: adapted 1:1 from donors/lab-clay/clay-toolmix.v1.js (KFB's own code). Imports re-pointed; no logic changes.
/* KFB Werkzeug-Mischungen v1 (K2, 28.09.) — je Asset-Klasse, gelesen von clay-material.v10 über profile.tools.
 * k Stärke · s Größe (× Handkachel, bei Handmaß 1,5 m = 4,8 m) · c Abdeckung der Werkzeugzone (0–1).
 * Setzungen nach Bildurteil in K2 (28.09., zweite Runde: Kronen-Dellen lasen als Krater, Strang-Daumenstriche als Brandspuren, Hügel-Nudelholz als Maserung), nicht gemessen. Fahrbahn bewusst ohne Werkzeuge: legacy 1 (Straßenprofil T2 21:30). */
export const TOOLMIX = {
  house:   { fan: { k: 0.8, s: 1, c: 0.5 }, smear: { k: 0.9, s: 1.4, c: 0.5 }, crease: { k: 0.55, s: 1, c: 0.35 }, dent: { k: 0.5, s: 1.6, c: 0.4 }, thumb: { k: 0.75, s: 0.8, c: 0.45 }, roll: { k: 0.6, s: 2.2, c: 0.4 } },
  strang:  { thumb: { k: 0.45, s: 1.3, c: 0.45 }, smear: { k: 0.6, s: 1.4, c: 0.45 }, fan: { k: 0.45, s: 0.9, c: 0.35 }, roll: { k: 0.4, s: 2.4, c: 0.35 }, dent: { k: 0.25, s: 1.4, c: 0.3 } },
  terrain: { smear: { k: 0.8, s: 2.2, c: 0.55 }, roll: { k: 0.35, s: 3, c: 0.35 }, dent: { k: 0.35, s: 2.5, c: 0.35 }, thumb: { k: 0.5, s: 1.6, c: 0.4 }, fan: { k: 0.4, s: 1.4, c: 0.3 } },
  nature:  { thumb: { k: 0.6, s: 0.6, c: 0.5 }, fan: { k: 0.55, s: 0.6, c: 0.45 }, smear: { k: 0.4, s: 0.7, c: 0.35 }, dent: { k: 0.22, s: 1.0, c: 0.3 }, crease: { k: 0.35, s: 0.6, c: 0.3 } },
  trunk:   { thumb: { k: 0.75, s: 0.4, c: 0.6 }, crease: { k: 0.5, s: 0.5, c: 0.4 } },
  rock:    { smear: { k: 0.8, s: 0.8, c: 0.6 }, crease: { k: 0.6, s: 0.8, c: 0.5 }, dent: { k: 0.4, s: 0.8, c: 0.4 } },
  cloud:   { dent: { k: 0.5, s: 1.2, c: 0.5 }, thumb: { k: 0.4, s: 1, c: 0.4 } },
  vehicle: { thumb: { k: 0.5, s: 0.25, c: 0.5 }, dent: { k: 0.35, s: 0.3, c: 0.4 } }
};
export const TOOLMIX_LABELS = { house: 'Türme, Häuser', strang: 'Strang, Stützen', terrain: 'Gelände, Tisch, Hügel', nature: 'Kronen, Büsche', trunk: 'Stämme', rock: 'Fels', cloud: 'Wolken', vehicle: 'Karts' };
