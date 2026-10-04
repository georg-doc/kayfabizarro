/* Stationen, Bewohner, Besetzung.
   Die Stationen kommen NICHT aus einer getippten Liste von Links, sondern aus hub-tiles.json:
   eine Sektion des Hubs ist eine Station, ihre Kacheln sind ihr Inhalt. Wer eine Kachel im Hub
   hinzufügt, bekommt sie hier automatisch.
   Die Zuordnung Sektion → Gebäude → Bewohner liegt in hub/model.js und ist dort abgeleitet,
   nicht getippt. */
import { RESIDENTS } from '../data/cast.js';
import { STATION_MAP, BUILDING_MODEL, RESIDENT_MODEL } from './model.js';

export { STATION_MAP };

export function buildStations(tiles) {
  const bySection = new Map();
  for (const t of tiles) {
    if (!bySection.has(t.section)) bySection.set(t.section, []);
    bySection.get(t.section).push(t);
  }
  return STATION_MAP.map((s, i) => ({
    id: 's' + (i + 1),
    ...s,
    tiles: bySection.get(s.section) || [],
    recipe: RESIDENTS.find((r) => r.residentId === s.resident) || null,
    model: { building: BUILDING_MODEL[s.building], resident: RESIDENT_MODEL[s.resident] }
  }));
}

/* ---------- Besetzung: aus den Rezepten gelesen, nicht getippt ----------
   Jeder Aktor eines Rezepts ist eine spielbare Figur; ein Requisiten-Eintrag mit eigenem `rig`
   ist ein zweiter Aktor (Farmer_B). Damit steht der Pfad, das Rig und der Pin an genau einer
   Stelle — in cast.js. */
export function castRoster() {
  const out = [];
  const seen = new Set();
  const add = (e, res, note) => {
    if (!e?.a || seen.has(e.a)) return;
    seen.add(e.a);
    out.push({
      id: (e.id || res.residentId) + '@' + res.residentId,
      name: e.id === res.actor?.id ? res.name : `${res.name} · ${e.id}`,
      path: e.a, commit: e.commit, rig: e.rig || e.rigFamily || 'Rig_Medium',
      group: 'Mystery Series 6 + Skeletons', note
    });
  };
  for (const res of RESIDENTS) {
    add(res.actor, res);
    for (const p of res.signatureProps || []) if (p.rig) add(p, res);
  }
  return out;
}

/* ---------- Legacy-Figuren ----------
   Pfade wörtlich aus docs/LEGACY_INTAKE_2026-09-18.md (Resident Atlas S6), nicht geraten.
   Rig-Zuordnung ist dort ausdrücklich NICHT bewiesen: „Presence in the same top-level Legacy
   folder does not prove compatibility." Sie stehen deshalb als eigene Gruppe mit Rig_Legacy als
   Startannahme — die Bindungsquote im HUD sagt, ob es trägt. */
const LG = 'media/3D_Assets/KayKit Legacy/';
/* Zwei Pins, aus einem gemessenen Grund: der S5-Legacy-Pin kennt Spooktober und Dungeon 1.0
   noch nicht (404 geprüft). Der Intake nennt `eb48f50…` als Registry-Quellrevision dieser
   Packs — dort liegen sie, und das Legacy-Rig ebenfalls (200 geprüft). Kein `main`. */
const LEGACY_PIN = '10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0';
const INTAKE_PIN = 'eb48f50489b9e4903ec1e3d2fb1837605ce7d792';
export const LEGACY_ROSTER = [
  ['Orc A', LG + 'Orc Warband - legacy/characters/gltf/character_orcA.gltf', LEGACY_PIN],
  ['Orc B', LG + 'Orc Warband - legacy/characters/gltf/character_orcB.gltf', LEGACY_PIN],
  ['Jack', LG + 'KayKit Spooktober Seasonal Pack 1.1/Models/Characters/Jack/gltf/character_jack.gltf', INTAKE_PIN],
  ['Witch · Spooktober', LG + 'KayKit Spooktober Seasonal Pack 1.1/Models/Characters/Witch/gltf/character_witch.gltf', INTAKE_PIN],
  ['Barbarian · Dungeon 1.0', LG + 'KayKit Dungeon Pack 1.0 2/Models/Characters/gltf/character_barbarian.gltf', INTAKE_PIN],
  ['Knight · Dungeon 1.0', LG + 'KayKit Dungeon Pack 1.0 2/Models/Characters/gltf/character_knight.gltf', INTAKE_PIN],
  ['Mage · Dungeon 1.0', LG + 'KayKit Dungeon Pack 1.0 2/Models/Characters/gltf/character_mage.gltf', INTAKE_PIN],
  ['Rogue · Dungeon 1.0', LG + 'KayKit Dungeon Pack 1.0 2/Models/Characters/gltf/character_rogue.gltf', INTAKE_PIN]
].map(([name, path, commit]) => ({
  id: 'legacy:' + name, name, path, commit, rig: 'Rig_Legacy',
  group: 'Legacy · Rig ungeprüft', note: 'Rig-Kompatibilität laut Intake nicht belegt'
}));

export function roster() {
  return [...castRoster(), ...LEGACY_ROSTER];
}

/* Wegweiser: Kenney-Nature-Schild, weil das Hexagon-FREE-Pack keines hat (PACK_GAPS.md).
   Ausgewiesen, nicht stillschweigend gemischt. */
export const SIGN_REF = 'nature:sign';
