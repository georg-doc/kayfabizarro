/**
 * lab-v9/mod-carriers.v1.js · Traeger, die KEIN Fahrzeug-Fixture sind.
 *
 * Die Werkbank nimmt jeden Traeger: die 61 Boden- und 10 Flug-Fixtures aus
 * `lab-v7/fixture-adapters.v3.js`, dazu diese hier — und, das ist der eigentliche Zweck des
 * eigenen Moduls, ein frei eingegebener Pfad. Georgs Nachtrag vom 19.09.: die Werkbank soll
 * spaeter »bring your own model/rig« koennen. Dafuer braucht sie einen Weg hinein, der nicht
 * durch die Fixtureliste geht.
 *
 * Die Wanne ist der Pruefkoerper, nicht die Beschreibung (Regel aus der Sitzprobe). Gemessen am
 * 19.09. ueber die Knotenprobe: zwei Netze — `bath` 2,000 × 1,608 × 3,000 und `bath_water`
 * 1,499 × 0,213 × 2,456 bei y 0,834. Laengsachse ist z, das Wasser liegt auf halber Hoehe.
 */
export const SCHEMA = 'kfb.mod-carriers/1';

const RAW = 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/';

export const EXTRA_CARRIERS = [
  {
    id: 'bathtub-bubbly', name: 'bathtub-bubbly', label: 'Badewanne · Bubbly Bathroom',
    path: 'media/3D_Assets/Bubbly_Bathroom_Tiny_Treats_1-1/Assets/gltf/bath.gltf',
    url: RAW + 'Bubbly_Bathroom_Tiny_Treats_1-1/Assets/gltf/bath.gltf',
    urlLatest: RAW + 'Bubbly_Bathroom_Tiny_Treats_1-1/Assets/gltf/bath.gltf',
    format: 'gltf', domain: 'mod', via: 'librarian · Sitzprobe FrankenStein',
    note: 'Zwei Netze: bath und bath_water. Kein Rad, kein Antrieb — der Traeger, an dem sich '
      + 'zeigt, ob ein Mod ein Fahrzeug aus etwas macht, das keines ist.',
  },
];

export const CARRIER_GROUPS = [
  { id: 'mod-extra', label: 'Mod-Traeger · kein Fahrzeug', rows: EXTRA_CARRIERS },
];

/** Freier Pfad. Nimmt eine volle RAW-Adresse oder einen Repo-Pfad unter media/3D_Assets. */
export function carrierFromInput(input) {
  const s = String(input || '').trim();
  if (!s) return null;
  const url = /^https?:\/\//.test(s)
    ? s
    : RAW + s.replace(/^\/*/, '').replace(/^media\/3D_Assets\//, '').split('/').map(encodeURIComponent).join('/');
  const name = decodeURIComponent(url.split('/').pop() || 'modell');
  return {
    id: 'byo:' + name, name, label: 'Eigenes Modell · ' + name,
    path: s, url, urlLatest: url, format: /\.gltf$/i.test(url) ? 'gltf' : 'glb',
    domain: 'byo', via: 'von Hand eingegeben — nicht gepinnt, nicht im Registry',
    note: 'Nicht gepinnt. Ein Modell, das nur hier liegt, ist kein Fixture — es ist ein Versuch.',
  };
}
