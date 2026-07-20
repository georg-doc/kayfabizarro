/**
 * kfb-pets.js — EIN Import, ein korrekter Pet.
 *
 * Duenne Kompositionsschicht ueber den kanonischen Stack. Sie erfindet nichts neu:
 *   Character  aus pet-library.v6.js   (Geometrie, GLB, Materialien, Squash-Feder)
 *   EyeRig     aus pet-eye-rig.v5.js   (Augen, Lider, Blick, Blinzeln, Kinetik)
 *   PetMotion  aus pet-motion.v2.js    (Bewegungen, Clips, Trigger)
 *
 * Ihr einziger eigener Beitrag ist der VERTRAG: laden, Geltungsebenen aufloesen,
 * die Werte an die drei Klassen verteilen. Damit ist "wie binde ich einen Cube-Pet ein"
 * eine Zeile Code statt eines Dokuments, und der richtige Weg ist der kuerzeste.
 *
 * VERBOTE (stehen auch in kfb-pets.json unter embed.verbote):
 *   1. Keine Zone schreibt eine eigene Augen-Implementierung.
 *      Wer googly braucht, setzt face.pupil.form = "googly".
 *   2. Keine Zone legt eine lokale Kopie an, die gewinnt.
 *   3. Keine hartkodierten Defaults. Jeder Anfangswert kommt aus der Datei.
 *   4. Klassisches WebGL, ein three-Build (0.160), eine Quelle.
 *
 * VERSION 1 · 2026-07-20
 */

// MODUL-IMPORTE LAUFEN UEBER jsdelivr, NICHT UEBER DIE GITHUB-ROHADRESSE.
// Gemessen am 20.07.: raw.githubusercontent.com liefert text/plain, und Browser weigern sich,
// so etwas als ES-Modul auszufuehren -> schwarzer Bildschirm. jsdelivr liefert
// application/javascript aus demselben Repo, damit laeuft es.
//
// UNTERSCHIED MERKEN: DATEN (kfb-pets.json, die GLBs, Texturen) werden per fetch geholt,
// da ist die Rohadresse voellig in Ordnung. Nur ECHTE MODUL-IMPORTE brauchen jsdelivr.
import * as THREE_NS from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Character } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/build/pet-library.v6.js';
import { EyeRig } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/build/pet-eye-rig.v5.js';
import { PetMotion } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/build/pet-motion.v2.js';
import { PetFace } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/build/pet-face.v1.js';
import { PetMouth } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/media/3D_Assets/build/pet-mouth.v1.js';

export const VERSION = 1;

const CANONICAL =
  'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kfb-pets.json';

/* --------------------------------------------------------------------------
 * 1  Laden: canonical -> lokal -> Inline-Fallback
 *
 * Die Reihenfolge ist umgedreht gegenueber dem alten Code, und das ist der
 * eigentliche Fix. Solange lokal gewinnt, gewinnt immer die aelteste Kopie, die
 * zufaellig danebenliegt. Genau so entstanden 102 Kopien in 9 Fassungen.
 *
 * Stufe 3 ist bewusst VOLLSTAENDIG genug zum Booten. Ein halber Fallback
 * degradiert lautlos, das hat der Graveyard teuer gezeigt.
 * ------------------------------------------------------------------------ */

const INLINE = {
  $schema: 'kfb.pets/1', version: '0.0.0-inline', _fallback: true,
  assets: { glbBase: 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/GLB_cube-pets/' },
  face: {
    eye: { dx: 0.345, dy: -0.10, ring: 0.30, track: 0.10, inset: 0, lidFit: 0.9,
           converge: 0, lids: { upper: true, lower: true }, recolorDefault: '#f2c93c',
           blink: { minGap: 2.5, maxGap: 6.5, dur: 0.12 }, fx: [] },
    pupil: { form: 'googly', gloss: 0.85, size: 0.4 },
    emotes: {
      neutral:   { lidUpper: -0.40, lidLower: 0, slant: 0, pupil: 'normal', gaze: [0, 0] },
      happy:     { lidUpper: -0.10, lidLower: 0.30, slant: 0.10, pupil: 'normal', gaze: [0, 0] },
      sad:       { lidUpper:  0.30, lidLower: 0, slant: -0.20, pupil: 'normal', gaze: [0, -0.4] },
      angry:     { lidUpper:  0.35, lidLower: 0, slant: 0.35, pupil: 'small', gaze: [0, 0] },
      surprised: { lidUpper: -0.60, lidLower: -0.20, slant: 0, pupil: 'big', gaze: [0, 0.2] },
      thinking:  { lidUpper:  0.10, lidLower: 0, slant: 0.10, pupil: 'normal', gaze: [0.6, 0.3] }
    }
  },
  motion: { global: { squashStretch: 1, smoothTime: 0.07 },
            front: { x: 0, z: 1.1 }, back: { x: 0, z: -1.3 },
            motions: {}, clips: {}, triggers: {} },
  pets: [{ id: 'bunny', name: 'Uncle FrizzleBob', glb: 'animal-bunny.glb',
           isDefault: true, color: '#d3a244', defaultEmote: 'neutral' }]
};

let _cache = null;

/**
 * Laedt den Vertrag. Ergebnis wird gecacht, mehrfaches Aufrufen kostet nichts.
 * @param {{url?:string, local?:string, force?:boolean}} [opts]
 */
export async function loadPets(opts = {}) {
  if (_cache && !opts.force) return _cache;
  const tries = [opts.url || CANONICAL];
  if (opts.local) tries.push(opts.local);
  else tries.push('kfb-pets.json');

  for (const url of tries) {
    try {
      const r = await fetch(url, { cache: 'no-store' });
      if (!r.ok) continue;
      const j = await r.json();
      if (j && j.$schema === 'kfb.pets/1') {
        j._source = url;
        return (_cache = j);
      }
    } catch (e) { /* naechste Stufe */ }
  }
  console.warn('[kfb-pets] Vertrag nicht erreichbar, Inline-Fallback aktiv. Werte sind Notbehelf.');
  return (_cache = { ...INLINE, _source: 'inline' });
}

/* --------------------------------------------------------------------------
 * 2  Geltungsebenen aufloesen: global -> pet -> session
 *
 * Der Per-Pet-Wert gewinnt gegen den globalen. Das ist keine Feinheit:
 * bunny hat dy -0.14 und ring 0.25, global steht -0.10 und 0.30. Wer nur global
 * liest, setzt allen 24 Pets dieselben Augen auf.
 * ------------------------------------------------------------------------ */

const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

function deepMerge(base, over) {
  if (!isObj(base)) return over === undefined ? base : over;
  const out = { ...base };
  for (const k of Object.keys(over || {})) {
    if (k.startsWith('_')) continue;                 // Kommentar-Felder nie mergen
    out[k] = isObj(out[k]) && isObj(over[k]) ? deepMerge(out[k], over[k]) : over[k];
  }
  return out;
}

/** Findet den Pet-Eintrag. Ohne id: der als isDefault markierte, sonst der erste. */
export function petEntry(lib, id) {
  const list = lib.pets || [];
  if (!id) return list.find((p) => p.isDefault) || list[0] || null;
  return list.find((p) => p.id === id) || null;
}

/**
 * Effektive Konfiguration fuer EIN Pet: global mit den Pet-Ueberschreibungen verrechnet.
 * @returns {{id, name, glb, color, face, actor, motion, koerper, entry}}
 */
export function resolvePet(lib, id, session = {}) {
  const e = petEntry(lib, id);
  if (!e) throw new Error('[kfb-pets] unbekanntes Pet: ' + id);

  // face: global.face  <-  pets[].eye / pets[].face  <-  session
  let face = deepMerge(lib.face || {}, {});
  if (e.eye) {
    face.eye   = deepMerge(face.eye || {}, e.eye.anchor || {});
    face.eye   = deepMerge(face.eye, omit(e.eye, ['anchor', 'pupil', 'pupilStyle']));
    face.pupil = deepMerge(face.pupil || {}, e.eye.pupil || {});
  }
  if (e.face) face = deepMerge(face, e.face);
  face = deepMerge(face, session.face || {});

  return {
    id: e.id,
    name: e.name || e.id,
    glb: e.glb || ('animal-' + e.id + '.glb'),
    color: e.color || (lib.face && lib.face.eye && lib.face.eye.recolorDefault) || '#f2c93c',
    archetype: e.archetype || null,
    narratorPromptRef: e.narratorPromptRef || null,
    defaultEmote: e.defaultEmote || 'neutral',
    face,
    actor:   deepMerge(lib.actor   || {}, deepMerge(e.actor   || {}, session.actor   || {})),
    motion:  deepMerge(lib.motion  || {}, deepMerge(e.motion  || {}, session.motion  || {})),
    koerper: deepMerge(lib.koerper || {}, deepMerge(e.koerper || {}, session.koerper || {})),
    entry: e
  };
}

function omit(o, keys) {
  const out = {};
  for (const k of Object.keys(o || {})) if (!keys.includes(k)) out[k] = o[k];
  return out;
}

/* --------------------------------------------------------------------------
 * 3  Bauen
 * ------------------------------------------------------------------------ */

function defaultLoadGltf(THREE) {
  const loader = new GLTFLoader();
  return (url) => new Promise((res, rej) => loader.load(url, res, undefined, rej));
}

function defaultMakeMat(THREE) {
  // Haelt sich absichtlich zurueck: die Cube-Pet-GLBs haben ihre colormap EINGEBETTET.
  // Wer sie uebertoent, bekommt gelbe Pets. (Das Graveyard-Kit ist der andere Fall,
  // dort liegt Textures/colormap.png daneben und MUSS mitkommen.)
  return (opts = {}) => new THREE.MeshStandardMaterial({
    color: opts.color != null ? opts.color : 0xffffff,
    map: opts.map || null,
    roughness: opts.roughness != null ? opts.roughness : 0.85,
    metalness: 0
  });
}

/**
 * Baut einen fertigen Pet.
 *
 *   const lib = await loadPets();
 *   const pet = await makePet(lib, 'bunny', { emote:'happy', motion:'idle' });
 *   scene.add(pet.object3D);
 *   // im Loop:  pet.update(dt);
 *
 * @param {object} lib      Ergebnis von loadPets()
 * @param {string} id       Pet-Id, z. B. 'bunny'. Leer = das als isDefault markierte.
 * @param {object} [opts]   { THREE, loadGltf, makeMat, emote, motion, session, eyes:false }
 */
export async function makePet(lib, id, opts = {}) {
  const THREE = opts.THREE || THREE_NS;
  const cfg = resolvePet(lib, id, opts.session || {});

  const ch = new Character({
    THREE,
    loadGltf: opts.loadGltf || defaultLoadGltf(THREE),
    makeMat: opts.makeMat || defaultMakeMat(THREE),
    layer: opts.layer,
    receiveShadow: opts.receiveShadow
  });

  // WICHTIG: die Bibliothek rechnet mit ZAHLEN, nicht mit Farbtexten.
  // Ihr _recolorMap() macht Bit-Verschiebungen; ein '#d3a244' wird dabei zu 0,0,0,
  // und dann faerbt sie jeden farbigen Bildpunkt der Textur schwarz. Genau das war
  // das schwarze Bunny im Studio v2 (20.07.). Einmal umwandeln, ueberall benutzen.
  const colorHex = new THREE.Color(cfg.color).getHex();

  // mods OHNE 'googly': die Bibliothek haengt sonst ihre eigenen FLACHEN Scheiben-Augen an
  // (MODS.googly, CircleGeometry). Die gehoeren zu 2D-Figuren wie dem Hampelmann, NIE an ein
  // Cube-Pet. Cube-Pets bekommen ausschliesslich den EyeRig: echte Kugeln mit Lidern.
  // NUR recolor, KEIN tint. Die Bibliothek laedt FrizzleBob kanonisch mit
  // { recolor: 0xf2c93c } und ohne tint (ARCHETYPES). recolor faerbt SELEKTIV die farbigen
  // Bildpunkte der Colormap; neutrale bleiben stehen, dadurch behaelt das Pet seine Zeichnung.
  // tint multipliziert zusaetzlich das ganze Material und drueckt die Zeichnung platt.
  // Beides zusammen ergab den einfarbigen Karamell-Hasen ohne Textur (20.07.).
  await ch.load('animals', cfg.id, { recolor: colorHex, mods: ['emotes'] });

  // --- Augen: NIE selbst bauen, immer der Rig ---------------------------------
  let rig = null;
  if (opts.eyes !== false) {
    const f = cfg.face || {};
    const eye = f.eye || {};
    const pup = f.pupil || {};
    rig = new EyeRig(ch, {
      anchor: { dx: eye.dx, dy: eye.dy, ring: eye.ring, track: eye.track },
      // HINWEIS: der Rig gattert pupilStyle noch ueber PUPIL_STYLES (matte/glossy).
      // Der Vertrag trennt Form und Glanz. Bis der Rig nachzieht, bleibt der Stil
      // aus dem Glanzwert abgeleitet, die FORM wird separat durchgereicht.
      pupilStyle: (pup.gloss != null && pup.gloss > 0.5) ? 'glossy-googly' : 'matte-cute',
      pupilForm: pup.form || 'googly',
      gloss: pup.gloss,
      pupilSize: pup.size,
      inset: eye.inset,
      lidFit: eye.lidFit,
      converge: eye.converge,
      blink: eye.blink,
      baseColor: new THREE.Color(cfg.color).getHex(),
      fx: (Array.isArray(eye.fx) ? eye.fx[0] : eye.fx) || 'none',
      kinetics: (cfg.actor && cfg.actor.kinetik) || undefined
    });
    // OHNE diesen Aufruf erzeugt der Rig KEINE Geometrie. Er laeuft dann leer mit, und
    // sichtbar bleiben die flachen Bibliotheks-Augen. Genau das war der Fehler am 20.07.
    rig.build();
    if (!rig.eyes) console.warn('[kfb-pets] EyeRig hat keine Augen gebaut — Pet zeigt keine Augen.');
  }

  // --- Mienenspiel: treibt den Rig UND haengt den Ruhe-Mund an das Emote ---------
  // Jedes Modul dokumentiert seinen eigenen Vertrag im Dateikopf. PetFace verlangt
  // update(dt) NACH PetMotion und VOR rig.update(dt). Daran haelt sich api.update().
  let face = null;
  if (rig) {
    const f = cfg.face || {};
    face = new PetFace(rig, { params: { emotes: f.emotes, drift: f.drift, react: f.react } });
  }

  // --- Mund: 12 Visem-Bilder als flache Ebene auf dem Koerper --------------------
  // Ohne build() gibt es keinen Mund. Genau das fehlte am 20.07., FrizzleBob war mundlos.
  let mouth = null;
  if (opts.mouth !== false) {
    const mp = (cfg.face && cfg.face.mouth) || {};
    mouth = new PetMouth(ch, { params: {
      size: mp.size, dy: mp.dy, sx: mp.sx, rot: mp.rot, bend: mp.bend,
      rate: mp.rate, restMap: mp.restMap
    } });
    mouth.build();
    if (!mouth.mesh) console.warn('[kfb-pets] PetMouth hat keinen Mund gebaut.');
    // Der Ruhe-Mund folgt dem Gesichtsausdruck (Hook aus pet-face.v1.js).
    if (face) face.onSet = (n) => mouth.setRest(n);
  }

  // --- Bewegung ---------------------------------------------------------------
  const m = cfg.motion || {};
  const motion = new PetMotion(ch, {
    rig,
    face,
    params: m.motions,
    clipParams: m.clips,
    squashStretch: m.global && m.global.squashStretch,
    front: m.front,
    back: m.back
  });

  const api = {
    id: cfg.id,
    name: cfg.name,
    cfg,
    object3D: ch.group,
    character: ch,
    rig,
    face,
    mouth,
    motion,

    /** Emote setzen. Geht ueber PetFace, damit der Ruhe-Mund mitwandert. */
    setEmote(name, o) {
      const e = (cfg.face && cfg.face.emotes && cfg.face.emotes[name]) || null;
      if (!e) { console.warn('[kfb-pets] unbekanntes Emote:', name); return api; }
      if (face) face.set(name, o || {});
      else if (rig) rig.emote = { lidUpper: e.lidUpper, lidLower: e.lidLower, slant: e.slant,
                                  pupil: e.pupil || 'normal', gaze: e.gaze };
      return api;
    },

    /** Sprechen an/aus (Visem-Wechsel im Silbentakt, kein echter Lippen-Sync). */
    talk(on) { if (mouth && mouth.talk) mouth.talk(on !== false); return api; },

    /** Bewegung starten. Name aus motion.motions oder motion.clips. */
    setMotion(name, o) {
      if (motion && typeof motion.play === 'function') motion.play(name, o);
      else if (motion && typeof motion.start === 'function') motion.start(name, o);
      return api;
    },

    /**
     * Reihenfolge ist NICHT beliebig. pet-face.v1.js schreibt sie im Dateikopf vor:
     * Bewegung zuerst, dann das Mienenspiel, dann der Augen-Rig. Wer sie vertauscht,
     * bekommt ein Gesicht, das einen Frame hinterherhinkt.
     */
    update(dt) {
      if (ch.update) ch.update(dt);
      if (motion && motion.update) motion.update(dt);
      if (face && face.update) face.update(dt);
      if (rig) rig.update(dt);
      if (mouth && mouth.update) mouth.update(dt);
      return api;
    },

    dispose() {
      if (mouth && mouth.dispose) mouth.dispose();
      if (face && face.dispose) face.dispose();
      if (rig && rig.dispose) rig.dispose();
      if (motion && motion.dispose) motion.dispose();
      if (ch.dispose) ch.dispose();
    }
  };

  api.setEmote(opts.emote || cfg.defaultEmote);
  if (opts.motion) api.setMotion(opts.motion);
  return api;
}

/* --------------------------------------------------------------------------
 * 4  Kleinkram, den sonst jede Zone selbst schreibt
 * ------------------------------------------------------------------------ */

/** Alle Pet-Ids in Vertragsreihenfolge. */
export const petIds = (lib) => (lib.pets || []).map((p) => p.id);

/** Anzeige-Liste fuer Dropdowns: [{id, name, color, isDefault}] */
export const petList = (lib) =>
  (lib.pets || []).map((p) => ({ id: p.id, name: p.name || p.id, color: p.color, isDefault: !!p.isDefault }));

/** Volle GLB-URL eines Pets. */
export function glbUrl(lib, id) {
  const e = petEntry(lib, id);
  const base = (lib.assets && lib.assets.glbBase) || '';
  return base + ((e && e.glb) || ('animal-' + id + '.glb'));
}

export default { VERSION, loadPets, makePet, resolvePet, petEntry, petIds, petList, glbUrl };
