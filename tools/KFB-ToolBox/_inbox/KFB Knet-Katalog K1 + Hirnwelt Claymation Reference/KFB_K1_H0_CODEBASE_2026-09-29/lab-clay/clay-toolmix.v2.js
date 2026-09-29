/* KFB Werkzeug-Mischungen v2 (S1, 28.09.) — wie v1, dazu Straße und Stadt. Georg 28.09.: das Straßenprofil von T2 war nur
 * gut, solange der Rest nicht stimmte; die Fahrbahn darf jetzt mit auf die Werkzeuge.
 * k Stärke · s Größe (× Handkachel 4,8 m) · c Abdeckung der Werkzeugzone. Setzungen nach Bildurteil, nicht gemessen. */
import { TOOLMIX as V1, TOOLMIX_LABELS as L1 } from './clay-toolmix.v1.js?r=2';
export const TOOLMIX = {
  ...V1,
  road:  { roll: { k: 0.55, s: 2.6, c: 0.6 }, smear: { k: 0.35, s: 1.8, c: 0.35 }, dent: { k: 0.2, s: 1.4, c: 0.3 }, thumb: { k: 0.25, s: 1.2, c: 0.25 } },
  paint: { thumb: { k: 0.35, s: 0.3, c: 0.6 }, dent: { k: 0.2, s: 0.3, c: 0.4 } },
  pave:  { dent: { k: 0.35, s: 0.7, c: 0.5 }, roll: { k: 0.35, s: 1.6, c: 0.45 }, crease: { k: 0.3, s: 0.6, c: 0.3 } },
  curb:  { thumb: { k: 0.55, s: 0.5, c: 0.55 }, smear: { k: 0.35, s: 0.6, c: 0.35 } }
};
export const TOOLMIX_LABELS = { ...L1, road: 'Fahrbahn', paint: 'Markierung', pave: 'Bürgersteig', curb: 'Bordstein' };
