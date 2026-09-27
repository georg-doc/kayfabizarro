/* KFB WorldDesign Lab v1 · Spendertafel (GATE WD0)
   Jeder Eintrag sagt, WELCHE Quelle er zeigt und über WELCHE Owner-Funktion sie geladen wird.
   Nichts wird hier nachgebaut: Laden/Messen kommt aus `atlas.js` (Resident Atlas), die
   Texturreparatur aus `kit-lab.js` (World Atlas), Graft und CapsuleCarl aus ihren eigenen
   Readern in `kfb-rigs-embed-v3`. Pack- und Pfadwahrheit kommt aus dem Asset-Registry-Shard.

   WD0 verändert KEINE Darstellung: kein Mattieren, kein Dämmerungslicht, kein Makro. Das ist
   Gate WD1/WD2. Hier wird nur bewiesen, dass die echten Quellen sichtbar erscheinen. */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const GHR = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@053bc922bfb7f3ee22195e22c35a62eb9aada4eb/';
import {
  instance, loadAsset, measured, legacyAssemble, loadClips, bindReport, LEGACY_RIG, PIN
} from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@053bc922bfb7f3ee22195e22c35a62eb9aada4eb/tools/resident_atlas_s6/lib/atlas.js';
import { repairTextures } from 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@053bc922bfb7f3ee22195e22c35a62eb9aada4eb/tools/world_atlas/source/lib/kit-lab.js';
import * as REG from './wd-registry.js';

const RIGS = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@053bc922bfb7f3ee22195e22c35a62eb9aada4eb/tools/KFB-ToolBox/kfb-rigs-embed-v3/';
const loader = new GLTFLoader();
const n3 = (v) => Math.round(v * 1000) / 1000;

export class SourceRequired extends Error {
  constructor(msg) { super(msg); this.name = 'SOURCE_REQUIRED'; }
}

export const BEFUNDE = [
  /* Gemessen 2026-09-22: der Rahmen meldet beim Start einmal `SCRIPT failed to load:` OHNE URL.
     Nachgemessen über `performance.getEntriesByType('resource')`: alle 30 Modulanfragen dieser
     Seite (eigene Module, three 0.184, Addons, atlas.js, kit-lab.js) sind aufgelöst, kein
     fehlgeschlagener Eintrag. Der Fehler ist vom Host, nicht von dieser Seite zuordenbar —
     seitenseitige Ladefehler werden ab jetzt hier mit Tag und URL eingetragen. */
  'Host-Meldung beim Start: „SCRIPT failed to load" ohne URL — 0 fehlgeschlagene Ressourcen-Einträge dieser Seite (nachgemessen)'
];

/* ---------- Owner-Modul laden · Umgebungsbefund 2026-09-22 ----------
   Für einzelne Modul-URLs liefert dieselbe Adresse per `fetch` 200 mit korrektem
   `application/javascript`, per `import()` aber dauerhaft "error loading dynamically imported
   module" — eine vergiftete Cache-Ebene vor diesem Vorschaurahmen. Gemessen: betroffen ist
   `lab-v2/audit.js` (und damit die ganze CapsuleCarl-Kette), NICHT `graft-mount.v1.js`; mit
   Cache-Brecher-Query lädt dieselbe Datei sofort.
   Zweiter Weg deshalb: die Owner-Quelle WÖRTLICH holen und als Blob-Modul ausführen, relative
   Spezifizierer dabei auf absolute URLs legen. Kein Nachbau — derselbe Quelltext, anderer
   Transport. */
const BUST = '?kfb=wd0';
const modCache = new Map();
export async function ownerImport(url) {
  if (modCache.has(url)) return modCache.get(url);
  const p = import(url + BUST).catch(async (e) => {
    const src = await (await fetch(url)).text();
    const fixed = src.replace(/(from\s*|import\s*\(\s*)(['"])(\.\.?\/[^'"]+)\2/g,
      (m, pre, q, spec) => pre + q + new URL(spec, url).href + BUST + q);
    BEFUNDE.push('Modul-Transport: ' + url.split('/').slice(-2).join('/') + ' ist per import() gesperrt ('
      + e.message.slice(0, 48) + '…), wörtlich als Blob-Modul geladen');
    return import(URL.createObjectURL(new Blob([fixed], { type: 'text/javascript' })));
  });
  modCache.set(url, p);
  return p;
}

/* Owner-Quelle WÖRTLICH mit genau EINER benannten Ersetzung laden (z. B. Spenderdatei tauschen).
   Kein Nachbau: dieselbe Logik, ein anderes Argument, das der Owner nicht als Parameter anbietet. */
export async function ownerImportWith(url, ...pairs) {
  const key = url + '|' + pairs.flat().join('>');
  if (modCache.has(key)) return modCache.get(key);
  const p = (async () => {
    let src = await (await fetch(url)).text();
    for (const [from, to] of pairs) {
      if (!src.includes(from)) throw new SourceRequired('Owner ' + url.split('/').pop() + ' enthält „' + from + '" nicht mehr');
      src = src.split(from).join(to);
    }
    const fixed = src.replace(/(from\s*|import\s*\(\s*)(['"])(\.\.?\/[^'"]+)\2/g,
      (m, pre, q, spec) => pre + q + new URL(spec, url).href + BUST + q);
    return import(URL.createObjectURL(new Blob([fixed], { type: 'text/javascript' })));
  })();
  modCache.set(key, p);
  return p;
}

const MYS = 'media/3D_Assets/KayKit_Mystery_Series6/';
const MYS_REV = 'fd52a9c4d571b7d918aac9f826adbfb56ef1d028';

function facts(path, rev, owner, extra = {}) {
  const m = measured.get(path) || {};
  return {
    path, rev, owner,
    name: m.name || (path || '').split('/').pop(),
    size: (m.size || [0, 0, 0]).map(n3),
    min: (m.min || [0, 0, 0]).map(n3),
    skin: !!m.skin,
    bones: (m.joints || []).length,
    clips: m.clips || [],
    ...extra
  };
}

/* ---------- gemeinsamer Registry-Weg ---------- */
async function fromRegistry(slug, patterns, owner = 'atlas.js loadAsset/instance/measure') {
  const a = await REG.pick(slug, ...patterns);
  if (!a) throw new SourceRequired('kein Namenstreffer in Shard ' + slug + ' für ' + patterns.map(String).join(' | '));
  const rev = REG.revOf(a);
  const g = await loadAsset(a.path, rev);
  const node = await instance(a.path, rev);
  repairTextures(node);
  return { node, clips: g.animations || [], facts: facts(a.path, rev, owner, { shard: 'packs/' + slug + '.json', bytes: a.sizeBytes, deps: a.dependencyStatus }) };
}

async function fromPath(path, rev, owner = 'atlas.js loadAsset/instance/measure') {
  const g = await loadAsset(path, rev);
  const node = await instance(path, rev);
  repairTextures(node);
  return { node, clips: g.animations || [], facts: facts(path, rev, owner) };
}

/* Rig-Klasse wird GEMESSEN, nicht behauptet: wie viele Tracks eines geteilten KayKit-Clipsatzes
   binden wirklich an dieses Skelett. Zwei Zahlen statt eines Etiketts. */
async function rigProbe(node) {
  const out = [];
  for (const rig of ['Rig_Medium', 'Rig_Large']) {
    try {
      const set = await loadClips(rig, ['MovementBasic']);
      if (!set.length) { out.push(rig + ': Clipsatz leer'); continue; }
      const r = bindReport(node, set[0].clip);
      out.push(rig + ': ' + r.bound + '/' + r.total + ' Tracks (' + set[0].name + ')');
    } catch (e) { out.push(rig + ': ' + e.message); }
  }
  return out;
}

/* ================= §6 · Charakter-Adapterklassen C1…C7 ================= */
export const CHARACTERS = [
  {
    id: 'C1', label: 'Rig_Legacy · character_orcA',
    note: 'Legacy-Teilfigur (0 Bones) auf das Legacy-Rig gesetzt. NICHT auf Medium-Höhe skaliert — '
        + 'die kopfgrössenbasierte Familienskalierung bleibt wie sie ist.',
    async mount() {
      const parts = 'media/3D_Assets/KayKit Legacy/Orc Warband - legacy/characters/gltf/character_orcA.gltf';
      const node = await legacyAssemble(parts, LEGACY_RIG, PIN.legacy);
      repairTextures(node);
      const rig = await loadAsset(LEGACY_RIG, PIN.legacy);
      const rep = node.userData.legacy || {};
      return {
        node, clips: rig.animations || [],
        facts: facts(parts, PIN.legacy, 'atlas.js legacyAssemble() + LEGACY_RIG', {
          gebunden: (rep.assembled || []).join(', ') || '—',
          fehlend: (rep.missing || []).join(', ') || 'keine',
          rigDatei: LEGACY_RIG, rigClips: (rig.animations || []).length
        })
      };
    }
  },
  {
    id: 'C2', label: 'Rig_Medium · GothGirl',
    note: 'In diesem Projekt bereits verwendeter Rig_Medium-Spender (Restage-Pass).',
    async mount() {
      const r = await fromPath('media/3D_Assets/KayKit_Mystery_Series6/GothGirl/characters/GothGirl.glb', 'main');
      r.facts.rigProbe = await rigProbe(r.node);
      r.facts.revHinweis = 'Mystery Series6 hat keinen eigenen Registry-Shard — Revision main, ungepinnt.';
      return r;
    }
  },
  {
    id: 'C3', label: 'Rig_Large-Kandidat · Knight',
    note: 'Aus dem Registry-Shard Adventurers 2.0. Die Rig-Klasse steht als GEMESSENE Bindung im '
        + 'Beleg, nicht als Etikett. Large bleibt die grössere Körperklasse — keine Höhenanpassung.',
    async mount() {
      const r = await fromRegistry('kaykit-adventurers-2-0-free', [/^Knight$/i, /knight/i]);
      r.facts.rigProbe = await rigProbe(r.node);
      return r;
    }
  },
  {
    id: 'C4', label: 'Graft · FrizzleBob Driver',
    note: 'Gebaut vom eigenen Reader (mountGraft) nach dem Pet-Graft-Vertrag v4. Nicht nachgebaut.',
    async mount() {
      const mod = await ownerImport(RIGS + 'frizzlegraft-v1/graft-mount.v1.js');
      const lib = await (await fetch(RIGS + 'contracts/kfb-pet-graft-driver.v4.json')).json();
      const pet = mod.pickGraftPet(lib);
      const holder = new THREE.Group();
      holder.name = 'graft:frizzlebob';
      const graft = await mod.mountGraft({ THREE, loader, parent: holder, pet, lib, camera: null, animation: 'own', log: () => {} });
      const box = new THREE.Box3().setFromObject(holder);
      const s = box.getSize(new THREE.Vector3());
      return {
        node: holder,
        update: graft && graft.update ? (dt) => graft.update(dt) : null,
        facts: {
          path: 'tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js',
          rev: 'main', owner: 'graft-mount.v1.js mountGraft() + contracts/kfb-pet-graft-driver.v4.json',
          name: 'FrizzleBob Driver Graft', pet: pet && (pet.id || pet.name || ''),
          size: [n3(s.x), n3(s.y), n3(s.z)], min: box.min.toArray().map(n3), skin: true, bones: 0, clips: []
        }
      };
    }
  },
  {
    id: 'C5', label: 'Prozedural · CapsuleCarl (rot)',
    note: 'Georg 23.09.: Carl ist der ROTE — enemy.gltf, nicht player.gltf. mountCarl() hat die Spenderdatei '
        + 'fest verdrahtet (CARL_URL); der Owner wird wörtlich mit genau dieser einen Ersetzung geladen. '
        + 'Den aufgemalten Mund übermalt der Owner selbst (texclean.paintOverRegion), für den roten mit grow 1,4 statt 0,3.',
    async mount() {
      const gm = await ownerImport(RIGS + 'frizzlegraft-v1/graft-mount.v1.js');
      const cm = await ownerImportWith(RIGS + 'lab-v6/carlrig-mount.v1.js',
        ['CapsuleCarl/gltf/player.gltf', 'CapsuleCarl/gltf/enemy.gltf'],
        /* Der rote Carl hat einen BREITEREN aufgemalten Mund als der Mundhohlraum im Netz — mit der
           Owner-Vorgabe grow 0,3 blieb ein Rand stehen (gemessen 23.09.). Region grosszügiger. */
        ['boxesLocal: heal.boxesLocal })', 'boxesLocal: heal.boxesLocal, grow: 1.4, samples: 900 })']);
      const mods = await gm.faceMods();
      const host = new THREE.Group();
      host.name = 'carl';
      const carl = await cm.mountCarl({ THREE, loader, scene: host, mods, pet: null });
      /* Gemessen 23.09.: der rote Carl trägt in capsule_texture.png einen BREITEREN aufgemalten Mund
         (mit Zähnen) als der Mundhohlraum, den der Owner vermisst — dessen Heilregion lässt ihn stehen.
         Zweiter Aufruf DERSELBEN Owner-Funktion (texclean.paintOverRegion) mit einer gemessenen Box
         im Körperraum (x ±0,34 · y 0,94–1,30 · Vorderseite), Füllfarbe liest der Owner selbst ab. */
      let stache = 0;
      try {
        const tc = await ownerImport(RIGS + 'lab-v6/texclean.js');
        let body = null;
        host.traverse((o) => { if (o.isMesh && o.name === 'body') body = o; });
        if (body) {
          /* paintOverRegion gibt die GEHEILTE Tafel zurück — sie muss zugewiesen werden (Owner tut das auch) */
          /* Vertrag laut Owner: boxesLocal = [{ min:[x,y,z], max:[x,y,z] }], Rückgabe { map, report } */
          const shared = body.material;
          body.material = shared.clone();
          /* texclean liest zuerst userData.origMap — das ist die UNGEHEILTE Tafel. Auf der schon geheilten
             weitermalen, sonst gehen die Heilungen des Owners (Augenhöhlen) verloren (gemessen: Augen gelb) */
          const prevOrig = body.userData.origMap;
          body.userData.origMap = body.material.map;
          const r = tc.paintOverRegion({ THREE, mesh: body, boxesLocal: [{ min: [-0.36, 0.9, 0.05], max: [0.36, 1.27, 0.6] }], grow: 0.05, samples: 900 });
          /* Material ist mit den Augen geteilt (gemessen: Augäpfel wurden gelb) → nur für den Körper klonen */
          body.userData.origMap = prevOrig;
          if (r && r.map) { body.material.map = r.map; body.material.needsUpdate = true; stache = r.report ? r.report.triangles || 1 : 1; }
          else BEFUNDE.push('Carl-Mund: paintOverRegion ' + ((r && r.report && r.report.reason) || 'ohne Ergebnis'));
        }
      } catch (e) { BEFUNDE.push('Carl-Mund: texclean nicht ladbar · ' + e.message.slice(0, 60)); }
      const box = new THREE.Box3().setFromObject(host);
      const s = box.getSize(new THREE.Vector3());
      return {
        node: host,
        update: carl && carl.update ? (dt) => carl.update(dt) : null,
        facts: {
          path: cm.CARL_URL.replace('https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/', ''),
          rev: 'main', owner: 'lab-v6/carlrig-mount.v1.js mountCarl() (Spender enemy.gltf) + lab-v4/carlrig.js',
          name: 'CapsuleCarl rot', teile: (carl.parts || []).length, mund: stache ? 'aufgemalter Mund übermalt (texclean, ' + stache + ' Dreiecke)' : 'NICHT übermalt',
          zonen: (carl.names && carl.names.length) || 0,
          size: [n3(s.x), n3(s.y), n3(s.z)], min: box.min.toArray().map(n3), skin: false, bones: 0, clips: []
        }
      };
    }
  },
  {
    id: 'C6', label: 'KFB Pet · Cube-Pet Katze',
    note: 'Nicht-humanoider Materialtest. Owner-Weg nach EMBED_CUBE_PET_FULL_v2.2: `kfb-pets.js` '
        + 'makePet() baut Character + EyeRig + PetFace + PetMouth + PetMotion. Augen NIE selbst bauen.',
    async mount() {
      const PETS = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@053bc922bfb7f3ee22195e22c35a62eb9aada4eb/media/3D_Assets/kfb-pets.js';
      try {
        const mod = await ownerImport(PETS);
        const lib = await mod.loadPets();
        const e = (lib.pets || []).find((p) => p.id === 'cat' || /animal-cat/.test(p.glb || ''));
        if (!e) throw new SourceRequired('kfb-pets.json enthält keinen Katzen-Eintrag');
        const pet = await mod.makePet(lib, e.id, { THREE, emote: e.defaultEmote || 'happy', motion: 'idle' });
        const box = new THREE.Box3().setFromObject(pet.object3D);
        const s = box.getSize(new THREE.Vector3());
        return {
          node: pet.object3D,
          update: (dt) => pet.update(dt),
          facts: {
            path: 'media/3D_Assets/kfb-pets.js + kfb-pets.json → ' + mod.glbUrl(lib, e.id).split('/').pop(),
            rev: 'main', owner: 'kfb-pets.js makePet() · EyeRig v5 · PetFace v1 · PetMouth v1 · PetMotion v2',
            name: pet.name || e.id, augen: pet.rig && pet.rig.eyes ? 'EyeRig gebaut' : 'KEINE Augen gebaut',
            mund: pet.mouth && pet.mouth.mesh ? 'PetMouth gebaut' : 'kein Mund',
            vertrag: lib._source, emote: e.defaultEmote || 'happy',
            size: [n3(s.x), n3(s.y), n3(s.z)], min: box.min.toArray().map(n3), skin: false, bones: 0, clips: []
          }
        };
      } catch (e) {
        if (e instanceof SourceRequired) throw e;
        /* Ehrlich benannt statt still auf das nackte GLB zurückfallen: das GLB IST das Pet,
           aber ohne EyeRig/Mund ist es nicht die KFB-Figur. Beides wird gemeldet. */
        const r = await fromRegistry('glb-cube-pets', [/^animal-cat$/i, /cat/i]);
        r.facts.owner = 'atlas.js instance() — ROHES GLB';
        r.facts.augen = 'FEHLT · kfb-pets.js makePet() nicht ladbar: ' + e.message.slice(0, 120);
        BEFUNDE.push('Cube-Pet EyeRig: kfb-pets.js-Kette nicht ladbar (' + e.message.slice(0, 80) + ')');
        return r;
      }
    }
  },
  {
    id: 'C8', label: 'Rig_Large · Monstrosity',
    note: 'KayKit Mystery Series 6 · Oktober 2025. Grosse Körperklasse, keine Höhenanpassung. Revision gepinnt.',
    async mount() {
      const r = await fromPath(MYS + '4 - October 2025 - Monstrosity/Monstrosity.glb', MYS_REV);
      r.facts.rigProbe = await rigProbe(r.node);
      return r;
    }
  },
  {
    id: 'C9', label: 'Large-Objekt · Driver-Auto',
    note: 'KayKit Mystery Series 6 · August 2023 · car.glb. Fahrzeug als grosses Objekt neben den Figuren.',
    mount: () => fromPath(MYS + '2 - August 2023 - Driver/assets/gltf/car.glb', MYS_REV)
  },
  {
    id: 'C7', label: 'Prop / Standee-Akteur',
    note: 'Brief §6 C7 verlangt einen QUELLENBELEGTEN PropActor/CardRig/Standee-Owner.',
    async mount() {
      throw new SourceRequired(
        'Kein geprüfter PropActor/CardRig/Standee-Owner in dieser Umgebung auffindbar. '
        + 'Gesucht: ein Owner-Reader analog mountGraft()/mountCarl(). Kein Skelett wird auf eine '
        + 'Requisite gezwungen, kein Ersatzkörper gezeigt.');
    }
  }
];

/* ================= Slot-Tafeln · Registry-aufgelöst ================= */
const slot = (label, slug, patterns, note = '') => ({
  id: label, label, note, slug,
  mount: () => fromRegistry(slug, patterns)
});

/* §9 STRUKTUR — echte Dungeon-/Builder-Spender */
const DUN = 'kaykit-dungeon-pack-1-1-free-2';
const BLD = 'kaykit-medieval-builder-pack-1-0';
export const STRUKTUR = [
  slot('Boden', DUN, [/^floor_tile_large$/i, /^floor_tile/i]),
  slot('Wand', DUN, [/^wall$/i, /^wall_[a-z]+$/i]),
  slot('Wandecke', DUN, [/^wall_corner$/i, /corner/i]),
  slot('Durchgang / Tür', DUN, [/^wall_arched$/i, /door/i, /opening/i]),
  slot('Bogen', DUN, [/arch/i]),
  slot('Treppe', DUN, [/^stairs$/i, /stairs/i], 'Brief §10: asymmetrisches Teil — erst einzeln zeigen.'),
  slot('Geländer', DUN, [/railing/i, /fence/i], 'Brief §10: asymmetrisches Teil — erst einzeln zeigen.'),
  slot('Säule / Pfeiler', DUN, [/^pillar/i, /column/i]),
  slot('Decke', DUN, [/^ceiling_tile$/i, /ceiling/i]),
  slot('Plattform / Fundament', DUN, [/^floor_foundation_allsides$/i, /foundation/i, /platform/i]),
  slot('Brücke / Auflage', BLD, [/bridge/i, /support/i], 'Brief §10: asymmetrisches Teil — erst einzeln zeigen.')
];

/* §9 WELT / RACE / OSM */
const HEX = 'kaykit-medieval-hexagon-pack-1-0-free';
const CITY = 'kaykit-city-builder-bits-1-0-free';
const RACE = 'kenney-racing-kit';
export const WELT = [
  slot('Hex-Kachel', HEX, [/^base$/i, /^base_/i, /grass/i]),
  slot('Hex-Strasse', HEX, [/road/i]),
  slot('Hex-Fluss / Wasser', HEX, [/river/i, /water/i]),
  slot('Hex-Küste', HEX, [/coast/i]),
  slot('Stadt · Gebäudemasse', CITY, [/^building/i, /house/i]),
  slot('Stadt · Strassenfläche', CITY, [/road/i]),
  slot('Stadt · Bordstein / Gehweg', CITY, [/pavement/i, /sidewalk/i, /curb/i]),
  slot('Race · Strecke', RACE, [/^road/i, /track/i]),
  slot('Race · Barriere', RACE, [/barrier/i, /fence/i, /cone/i]),
  slot('Race · Bogen / Auflage', RACE, [/gate/i, /arch/i, /bridge/i, /ramp/i]),
  slot('Race · Fahrzeug', RACE, [/^car/i, /vehicle/i, /truck/i]),
  {
    id: 'Landmark', label: 'Landmark', slug: '—',
    note: 'Brief §9/§20.',
    async mount() {
      throw new SourceRequired(
        'Kein Landmark-Spender als Registry-Asset auffindbar. Die aktuellen KFB-Landmarks entstehen '
        + 'als Geometrie IM Race-/OSM-Code (Option C-2 Landmark-Modul), nicht als Paketdatei. '
        + 'Ein erfundener Ersatz-Landmark wäre nach §20 unzulässig — hier steht deshalb die Lücke.');
    }
  }
];

/* §9 NATUR */
const FOR = 'kaykit-forest-nature-pack-1-0-free';
export const NATUR = [
  slot('Baum', FOR, [/^tree_[a-z]/i, /tree/i]),
  slot('Busch', FOR, [/bush/i, /shrub/i]),
  slot('Bodenbewuchs / Gras', FOR, [/grass/i, /fern/i]),
  slot('Fels', FOR, [/rock/i, /stone/i]),
  slot('Pflanze / Blume', FOR, [/flower/i, /plant/i, /mushroom/i]),
  slot('Stamm / Totholz', FOR, [/log/i, /trunk/i, /stump/i])
];

/* NATUR · weitere Familien (Brief-Nachtrag 22.09.): Kenney Nature Kit, Tiny Treats, Plant Lab */
const KEN = 'kenney-nature-kit';
export const NATUR_PLUS = [
  slot('Kenney · Baum', KEN, [/^tree_default$/i, /^tree_oak$/i, /^tree_/i]),
  slot('Kenney · Nadelbaum', KEN, [/^tree_pineRoundA$/i, /^tree_pine/i]),
  slot('Kenney · Busch', KEN, [/^plant_bush$/i, /^plant_bushLarge$/i, /bush/i]),
  slot('Kenney · Blume', KEN, [/^flower_redA$/i, /^flower_/i]),
  slot('Kenney · Pilz', KEN, [/^mushroom_red$/i, /^mushroom/i]),
  slot('Kenney · Fels', KEN, [/^rock_largeA$/i, /^rock_large/i, /^stone_large/i]),
  slot('Kenney · Gras', KEN, [/^grass_large$/i, /^grass/i]),
  slot('Tiny Treats · Parkbaum', 'tiny-treats-pretty-park-1-0-free', [/tree/i]),
  slot('Tiny Treats · Zimmerpflanze', 'tiny-treats-house-plants-1-0-free-2', [/monstera/i, /plant/i])
];

/* PLANT LAB · Owner `KFB_Plant_Prop_Lab_v2/src/plant-recipe.js`: generate(inputs) → buildProp(recipe).
   Ein Pflanzen-Prop ist dort ein Szenen-REZEPT (Topf + Untersetzer + Pflanze, gemessen gesetzt),
   kein GLB. Presets A (normal), B (Alien/Quaternius), C (Mischgruppe) wörtlich aus dem Owner. D (Landmarke) ist
   absichtlich RIESIG (Owner-Massstabsklasse LANDMARK) und sprengt die Testszene — nur in der Bank sinnvoll. */
const PLANT = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@053bc922bfb7f3ee22195e22c35a62eb9aada4eb/tools/KFB-ToolBox/_inbox/KFB_Plant_Prop_Lab_v1/KFB_Plant_Prop_Lab_v2_EXPORT_2026-09-19/KFB_Plant_Prop_Lab_v2/src/plant-recipe.js';
const plantLab = (id, label) => ({
  id: 'plant-' + id, label, slug: 'plant-lab',
  note: 'Plant Prop Lab v2 · buildProp(generate(PRESETS.' + id + '))',
  async mount() {
    const mod = await ownerImport(PLANT);
    const P = mod.PRESETS[id];
    if (!P) throw new SourceRequired('Plant-Lab-Preset ' + id + ' fehlt im Owner');
    const recipe = mod.generate({ ...P.inputs, seed: 7, preset: id, label: P.label });
    const built = await mod.buildProp(recipe);
    const node = built.root;
    const box = new THREE.Box3().setFromObject(node);
    const s = box.getSize(new THREE.Vector3());
    return {
      node,
      facts: {
        path: 'KFB_Plant_Prop_Lab_v2/src/plant-recipe.js · Rezept ' + recipe.id, rev: 'main',
        owner: 'plant-recipe.js generate() + buildProp()', name: P.label,
        teile: built.report.plants + built.report.containers,
        size: [n3(s.x), n3(s.y), n3(s.z)], min: box.min.toArray().map(n3), skin: false, bones: 0, clips: [],
        fehlend: built.report.notes.join(' · ') || 'keine'
      }
    };
  }
});
export const PLANT_LAB = [
  plantLab('A', 'Plant Lab · A normal'),
  plantLab('B', 'Plant Lab · B Alien'),
  plantLab('C', 'Plant Lab · C Mischgruppe')
];

/* §8 TINY TREATS · Abdeckungskategorien statt eines schönen Einzelmodells */
export const TREATS_SLOTS = [
  slot('Gebäudehülle', 'tiny-treats-homely-house-1-0-free', [/house/i, /wall/i, /roof/i]),
  slot('Möbel', 'tiny-treats-charming-kitchen-1-1-free', [/chair/i, /table/i, /cabinet/i, /shelf/i]),
  slot('Gerät', 'tiny-treats-charming-kitchen-1-1-free', [/oven/i, /stove/i, /fridge/i, /sink/i]),
  slot('Essen', 'tiny-treats-baked-goods-1-0-free', [/cake/i, /bread/i, /donut/i, /pie/i, /cookie/i]),
  slot('Geschirr / Kochgerät', 'tiny-treats-charming-kitchen-1-1-free', [/plate/i, /cup/i, /^pot/i, /pan/i, /bowl/i]),
  slot('Kleinkram', 'tiny-treats-bakery-interior-1-1-free', [/jar/i, /box/i, /bag/i, /basket/i]),
  slot('Pflanze', 'tiny-treats-house-plants-1-0-free-2', [/plant/i, /pot/i]),
  slot('Baum / Bewuchs', 'tiny-treats-pretty-park-1-0-free', [/tree/i, /bush/i, /hedge/i]),
  slot('Aussenrequisite', 'tiny-treats-pleasant-picnic-1-0-free', [/blanket/i, /basket/i, /grill/i, /picnic/i]),
  slot('Park-Struktur', 'tiny-treats-pretty-park-1-0-free', [/bench/i, /fountain/i, /lamp/i, /fence/i]),
  slot('Bad / Sanitär', 'bubbly-bathroom-tiny-treats-1-1', [/tub/i, /toilet/i, /sink/i, /shower/i])
];

/* Beliebiges Registry-Asset (Pack-Browser) */
export async function mountAsset(a) {
  const rev = REG.revOf(a);
  const g = await loadAsset(a.path, rev);
  const node = await instance(a.path, rev);
  repairTextures(node);
  return { node, clips: g.animations || [], facts: facts(a.path, rev, 'atlas.js loadAsset/instance/measure', { bytes: a.sizeBytes, deps: a.dependencyStatus, shard: 'packs/' + a.packId + '.json' }) };
}

/* Repräsentant je Paketfamilie — für Reihe und Gesamtszene */
export function packReps(fam) {
  return fam.map(([slug, lab]) => ({
    id: slug, label: lab, slug,
    mount: async () => {
      const list = await REG.models(slug);
      if (!list.length) throw new SourceRequired('Shard ' + slug + ' enthält kein ladbares 3D-Modell');
      return mountAsset(list[0]);
    }
  }));
}

export const OWNERS = [
  ['Laden / Messen / Klonen', 'tools/resident_atlas_s6/lib/atlas.js', 'loadAsset · instance · measure · measured · legacyAssemble · loadClips · bindReport'],
  ['Texturreparatur', 'tools/world_atlas/source/lib/kit-lab.js:346', 'repairTextures()'],
  ['Renderer / Kamera / Orbit / Rahmung', 'tools/world_atlas/source/lib/kit-lab.js:541', 'makeViewer() · frame()'],
  ['Graft-Akteur', 'kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js', 'mountGraft() · pickGraftPet() · faceMods()'],
  ['Prozeduraler Akteur', 'kfb-rigs-embed-v3/lab-v6/carlrig-mount.v1.js', 'mountCarl() (+ lab-v4/carlrig.js)'],
  ['Cube-Pet (Gesicht/Augen/Mund/Bewegung)', 'media/3D_Assets/kfb-pets.js', 'loadPets() · makePet() — EyeRig v5, PetFace, PetMouth, PetMotion'],
  ['Pack-/Pfad-/Revisionswahrheit', 'registry/assets/v1/packs/*.json', 'kfb.asset-pack.v1 Shards, lazy geladen']
];
