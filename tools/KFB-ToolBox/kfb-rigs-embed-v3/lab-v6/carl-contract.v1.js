/* KFB · Carls Einstellung in der Form, die das Studio liest.
 *
 * Georgs Entscheidung (13.09.): ÜBERSETZEN, nicht zweigleisig fahren. Es gibt danach EINEN
 * Export-Pfad — die Werkbank gibt `kfb.pets/1` heraus, dieselbe Form, die
 * `kfb-pet-graft-driver.json` hat und die `_openImport` im Studio annimmt.
 *
 * Was übersetzt wird, und was das Neue daran ist:
 *   `kfb.carl.rig/6` trägt `zones` als INDEX-ARRAY — die Inselnummer steht nur in der Position.
 *   `kfb.pets/1` kennt keine Inseln. Die Nummer wird darum zum FELD (`island`) und bekommt den
 *   gemessenen Namen aus `zonenames.v4` dazu. Das ist die eine Stelle, an der die Übersetzung
 *   etwas hinzufügt statt umzubenennen: aus einer stillen Position wird eine benannte Angabe.
 *
 * Drei Felder gibt es in `kfb.pets/1` bisher nicht (ehrlich als NEU geführt, siehe FIELD_MAP):
 *   `eye.lashes`   — `pet-eye-rig.v6.js` kennt Länge, Dichte, Breite; der Vertrag hatte kein Feld.
 *   `eye.colors`   — Farbe je Augen-Teil (Augapfel, Lid, Wimper, Pupille), 13.09. gebaut.
 *   `moustache`    — der Bart stand in keinem Pet-Eintrag; `pet-moustache.v1.js` hat ihn längst.
 *
 * ⚠ KEIN zweites Original. Es wird kein `kfb.carl.rig/6`-Block in die Datei gelegt: zwei Wahrheiten
 * in einer Datei sind genau das, was diese Übersetzung vermeiden soll. Verlustfrei ist sie über
 * `fromPets1`, nicht über eine mitgeführte Kopie.
 */
export const SCHEMA_IN = 'kfb.carl.rig/6';
export const SCHEMA_OUT = 'kfb.pets/1';
export const PET_ID = 'capsule-carl';

/* Der Wirt. `kind` ist das EINE Feld, an dem das Studio erkennt, dass hier ein Modul gebaut wird
   und kein Cube-Pet geladen — derselbe Weg wie `hanging` (Klo-Rolli) und `biped` (FrizzleBob).
   `module` nennt den Bauweg; dass das Studio ihn noch nicht hat, steht in `notes`, nicht als
   stille Annahme. */
export const HOST = Object.freeze({
  id: PET_ID, name: 'CapsuleCarl', kind: 'capsule', module: 'CarlRig',
  variant: 'player', color: '#d99a4e', skin: 'native',
  source: 'KayKit_Mystery_Series6/CapsuleCarl/gltf/player.gltf',
});

/* Die Karte. Jede Zeile ist eine Behauptung, die an den zwei Dateien nachprüfbar ist. */
export const FIELD_MAP = [
  ['eye.dx / dy / ring / track', 'pets[].eye.dx / dy / ring / track', 'gleich'],
  ['eye.pupilSize / lidFit / gloss', 'pets[].eye.pupilSize / lidFit / gloss', 'gleich'],
  ['eye.lashLength / lashDensity / lashWidth', 'pets[].eye.lashes.length / density / width', 'umbenannt · NEUES Feld'],
  ['(neu, 13.09.)', 'pets[].eye.colors.ball / lid / lash / pupil', 'NEUES Feld'],
  ['mouth.*', 'pets[].mouth.*', 'gleich (beide sind PetMouth-Regler)'],
  ['mouthSet', 'pets[].mouth.set', 'umbenannt'],
  ['moustache.enabled / form / color', 'pets[].moustache.enabled / form / color', 'NEUES Feld'],
  ['brow.mod', 'pets[].brow.mod', 'gleich'],
  ['brow.drawn.*', 'pets[].brow.* (flach)', 'aufgelöst — BrowRig-Regler liegen im Pet flach, wie beim Driver'],
  ['brow.original.{islands,…}', 'pets[].brow.original.{islands,…}', 'gleich (PartRig-Regler)'],
  ['brow.graft.*', 'pets[].brow.graft.*', 'gleich (BrowGraft-Regler · Carls Braue auf einem fremden Kopf)'],
  ['nose.mod / nose.original', 'pets[].nose.mod / pets[].nose.original', 'gleich'],
  ['zones[i] (Index implizit)', 'pets[].zones[].island + .name + .hidden + .color', 'AUFGELÖST — Position wird Feld, Name kommt aus der Messung'],
];

const clone = (v) => (v == null ? v : JSON.parse(JSON.stringify(v)));

/** `kfb.carl.rig/6` → eine Einzel-Pet-Datei in `kfb.pets/1`. */
export function toPets1(rig, opts) {
  const o = opts || {};
  const names = o.names || [];
  const eye = rig.eye || {};
  const brow = rig.brow || {};
  const nose = rig.nose || {};
  const stache = rig.moustache || {};
  const drawn = brow.drawn || null;

  /* Die BrowRig-Regler liegen im Pet-Eintrag flach (so trägt sie `graft-driver`), die Punktliste
     der Kurve nicht — die gehört der Form, nicht der Figur. */
  const browFlat = {};
  if (drawn) for (const k of Object.keys(drawn)) if (k !== 'points' && k !== 'enabled') browFlat[k] = clone(drawn[k]);

  const pet = {
    ...HOST,
    notes: 'CapsuleCarl, geriggt in der Rigging-Werkbank (KFB Rigging Lab v1). Statischer Körper ohne '
      + 'Knochen: 1 Netz, 21 Inseln, 0 Morphs. Die Mundmulde ist eingeebnet (0,1865 u), das '
      + 'PetStudio-Gesicht sitzt auf abgelesenen Ankern, die Quelldatei bleibt unberührt. '
      + 'ACHTUNG: das Studio hat den Bauweg »CarlRig« noch nicht — dieser Eintrag ist die '
      + 'Einstellung, nicht der Bau.',
    eye: {
      dx: eye.dx, dy: eye.dy, ring: eye.ring, track: eye.track,
      pupilSize: eye.pupilSize, lidFit: eye.lidFit, gloss: eye.gloss,
      lashes: { length: eye.lashLength, density: eye.lashDensity, width: eye.lashWidth },
      colors: clone(rig.eyeColors) || { ball: null, lid: null, lash: null, pupil: null },
    },
    mouth: { ...clone(rig.mouth), set: rig.mouthSet || null },
    moustache: { enabled: !!stache.enabled, form: stache.form || null, color: stache.color || null },
    brow: { mod: brow.mod || null, ...browFlat, original: clone(brow.original), graft: clone(brow.graft) },
    nose: { mod: nose.mod || null, original: clone(nose.original) },
    /* Hier passiert die Auflösung: aus `zones[7] = {hidden,color}` wird
       `{island: 8, name: 'Brow L', hidden, color}` — die Nummer ist 1-basiert wie in der Liste
       der Werkbank, `name` ist der GEMESSENE Name, nicht eine Vermutung. */
    zones: (rig.zones || []).map((z, i) => ({
      island: i + 1,
      name: (names[i] && names[i].label) || null,
      hidden: !!z.hidden,
      color: z.color || null,
    })),
  };

  const hidden = pet.zones.filter((z) => z.hidden).length;
  return {
    $schema: SCHEMA_OUT,
    version: o.version || '1.0.0',
    updated: new Date().toISOString().slice(0, 10),
    note: 'Übersetzt aus ' + SCHEMA_IN + ' (Rigging-Werkbank). Ein Export-Pfad, keine zweite Form: '
      + 'die Index-Zonen sind zu benannten Feldern aufgelöst, die Karte der Felder steht in '
      + 'lab-v6/carl-contract.v1.js (FIELD_MAP).',
    pets: [pet],
    meta: {
      contract: '1.3.0', source: 'KFB Rigging Lab v1', translatedFrom: SCHEMA_IN,
      label: 'single', count: 1, ids: [PET_ID],
      measured: clone(o.measured) || null,
      zones: { total: pet.zones.length, hidden, named: pet.zones.filter((z) => z.name).length },
    },
  };
}

/** Rückweg, damit die Übersetzung nachprüfbar verlustfrei ist (laden → exportieren → gleich). */
export function fromPets1(file) {
  const pet = (file && file.pets && file.pets[0]) || (file && file.pet) || null;
  if (!pet) return null;
  const eye = pet.eye || {}, lash = eye.lashes || {}, mouth = { ...(pet.mouth || {}) };
  const set = mouth.set || 'red'; delete mouth.set;
  const brow = { ...(pet.brow || {}) };
  const mod = brow.mod || null, original = brow.original || null, graft = brow.graft || null;
  delete brow.mod; delete brow.original; delete brow.graft;
  return {
    schema: SCHEMA_IN, figure: pet.name || HOST.name,
    eye: {
      dx: eye.dx, dy: eye.dy, ring: eye.ring, track: eye.track,
      pupilSize: eye.pupilSize, lidFit: eye.lidFit, gloss: eye.gloss,
      lashLength: lash.length, lashDensity: lash.density, lashWidth: lash.width,
    },
    eyeColors: clone(eye.colors) || null,
    mouth, mouthSet: set,
    moustache: clone(pet.moustache) || null,
    brow: { mod, drawn: Object.keys(brow).length ? brow : null, original: clone(original), graft: clone(graft) },
    nose: clone(pet.nose) || null,
    zones: (pet.zones || []).map((z) => ({ hidden: !!z.hidden, color: z.color || null })),
  };
}
