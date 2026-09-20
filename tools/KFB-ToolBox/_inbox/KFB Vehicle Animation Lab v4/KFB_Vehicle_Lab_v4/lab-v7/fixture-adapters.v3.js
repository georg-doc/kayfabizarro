/**
 * lab-v7/fixture-adapters.v3.js · Die Fixture-Liste, ERWEITERT.
 *
 * v2 bleibt unberuehrt und wird importiert. Diese Fassung haengt an, was Georg am 18.09. aus dem
 * Asset-Handoff `kfb.asset-handoff.v1` @ 29aac1061bdd73736351cb856fa9f1e322478abc
 * (consumer animation-lab, 141 Assets) nachgefordert hat. Jede Zeile ist AUS DER DATEI generiert,
 * nicht getippt: Adresse, Byteszahl und Abhaengigkeitsstand stehen so im Handoff.
 *
 * GEMESSEN, nicht geraten: 112 der 141 Assets waren in v2 nicht referenziert. Davon sind rund
 * zwanzig Fahrzeuge; der Rest sind Figuren, Planeten, Zahlen, Zaeune, Pickups und einzelne
 * RAEDER (wheel-*.glb) — Bauteile, keine Fahrzeuge.
 *
 * ZWEI EBENEN, getrennt gehalten:
 *   GROUPS_ALL  — Boden. Faehrt mit dem Cartoon-Deformer, den Manoevern, Zwei-Rad und Fassrolle.
 *   FLIGHT      — Luft. NUR DEKLARIERT. Der Flight-Deformer ist nicht gebaut; die Zeilen sind
 *                 ladbar und vermessbar, aber keine Bewegungsfamilie greift auf sie zu.
 *                 Plan: PLAN_flight_deformer.md.
 *
 * Die Papierflieger-Zeile stammt NICHT aus dem Handoff. Sie ist am 18.09. byteweise auf dem Pfad
 * geprueft (3216 B) — die Ordneransicht zeigt `.glb` nicht zuverlaessig (CLAUDE.md).
 */
import { GROUPS as GROUPS_V2, SOURCES as SOURCES_V2, OPEN_ASSETREFS, RESOLVED_ASSETREFS } from './fixture-adapters.v2.js';
export { OPEN_ASSETREFS, RESOLVED_ASSETREFS };

export const SCHEMA = 'kfb.vehicle-fixtures-adapter/3';

export const SOURCES = Object.assign({}, SOURCES_V2, {
  'handoff-animation-lab': {
    schema: 'kfb.asset-handoff.v1',
    repo: 'georg-doc/kayfabizarro',
    commit: '29aac1061bdd73736351cb856fa9f1e322478abc',
    consumer: 'animation-lab',
    selectionStatus: 'candidate-only',
    suitabilityDecision: 'owned-by-receiving-consumer',
    assets: 141,
  },
  repo: { repo: 'georg-doc/kayfabizarro', commit: '29aac1061bdd73736351cb856fa9f1e322478abc', note: 'direkt am Pfad byteweise geprueft, nicht ueber einen Handoff' },
});

/** Boden · neu aufgenommen am 18.09. */
export const GROUPS_NEW = [
  {
    "id": "driver",
    "label": "KayKit Mystery Series 6 · Driver",
    "profile": "CAR_CHILL_LIGHT",
    "note": "Georgs Beispiel vom 18.09. Ein einzelnes Fahrzeug im Driver-Paket; der Rest des Pakets sind Figur, Waffen und Requisiten. Blickrichtung ist eine ANNAHME (+z), bis sie am Bild widerlegt ist.",
    "rows": [
      {
        "id": "driver-car",
        "name": "driver-car",
        "label": "Driver Car",
        "path": "media/3D_Assets/KayKit_Mystery_Series6/2 - August 2023 - Driver/assets/gltf/car.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/KayKit_Mystery_Series6/2%20-%20August%202023%20-%20Driver/assets/gltf/car.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_Mystery_Series6/2%20-%20August%202023%20-%20Driver/assets/gltf/car.glb",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "glb",
        "bytes": 323240,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab",
        "profile": "CAR_CHILL_LIGHT"
      }
    ]
  },
  {
    "id": "heavy-franken",
    "label": "Frankensteining · schwere Einheiten",
    "profile": "HEAVY_FUTURE",
    "note": "Drei Einzelmodelle aus dem Frankensteining-Ordner. Traktor und Tourbus sind gross und schwer; der Armored Truck kommt von Quaternius. Die Poly-Modelle sind Z-up autoriert — wenn ein Modell auf der Nase steht, richtet der Orient-Schalter es auf und merkt es sich.",
    "rows": [
      {
        "id": "tractor-poly",
        "name": "tractor-poly",
        "label": "Tractor by Poly",
        "path": "media/3D_Assets/Frankensteining/Tractor by Poly by Google - eiXGnD1wN5q.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/Frankensteining/Tractor%20by%20Poly%20by%20Google%20-%20eiXGnD1wN5q.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Frankensteining/Tractor%20by%20Poly%20by%20Google%20-%20eiXGnD1wN5q.glb",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "glb",
        "bytes": 1959224,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab",
        "profile": "HEAVY_FUTURE"
      },
      {
        "id": "kfb-tourbus",
        "name": "kfb-tourbus",
        "label": "KFB Tourbus · WaterBowser",
        "path": "media/3D_Assets/Frankensteining/KFB Truck/KFB_Tourbus_WaterBowser.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/Frankensteining/KFB%20Truck/KFB_Tourbus_WaterBowser.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Frankensteining/KFB%20Truck/KFB_Tourbus_WaterBowser.glb",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "glb",
        "bytes": 990452,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab",
        "profile": "HEAVY_FUTURE"
      },
      {
        "id": "truck-armored",
        "name": "truck-armored",
        "label": "Truck Armored by Quaternius",
        "path": "media/3D_Assets/Frankensteining/Truck Armored by Quaternius - VvX8nmoCN5.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/Frankensteining/Truck%20Armored%20by%20Quaternius%20-%20VvX8nmoCN5.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Frankensteining/Truck%20Armored%20by%20Quaternius%20-%20VvX8nmoCN5.glb",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "glb",
        "bytes": 754248,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab",
        "profile": "HEAVY_FUTURE"
      }
    ]
  },
  {
    "id": "rovers",
    "label": "SciFi Ultimate Space Kit · Rover",
    "profile": "MECH_FUTURE",
    "note": "Drei Rover aus dem Quaternius-Satz, Texturen eingebettet. Profil MECH_FUTURE: harte Anschlaege, fast kein Squash — ein Rover ist kein Gummiauto.",
    "rows": [
      {
        "id": "rover-1",
        "name": "rover-1",
        "label": "Rover 1",
        "path": "media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Vehicles/GLTF/Rover_1.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/SciFI_Ultimate%20Space%20Kit_Quaternius/Vehicles/GLTF/Rover_1.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/SciFI_Ultimate%20Space%20Kit_Quaternius/Vehicles/GLTF/Rover_1.gltf",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "gltf",
        "bytes": 441623,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab",
        "profile": "MECH_FUTURE"
      },
      {
        "id": "rover-2",
        "name": "rover-2",
        "label": "Rover 2",
        "path": "media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Vehicles/GLTF/Rover_2.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/SciFI_Ultimate%20Space%20Kit_Quaternius/Vehicles/GLTF/Rover_2.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/SciFI_Ultimate%20Space%20Kit_Quaternius/Vehicles/GLTF/Rover_2.gltf",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "gltf",
        "bytes": 481320,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab",
        "profile": "MECH_FUTURE"
      },
      {
        "id": "rover-round",
        "name": "rover-round",
        "label": "Rover Round",
        "path": "media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Vehicles/GLTF/Rover_Round.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/SciFI_Ultimate%20Space%20Kit_Quaternius/Vehicles/GLTF/Rover_Round.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/SciFI_Ultimate%20Space%20Kit_Quaternius/Vehicles/GLTF/Rover_Round.gltf",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "gltf",
        "bytes": 412138,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab",
        "profile": "MECH_FUTURE"
      }
    ]
  },
  {
    "id": "mobility",
    "label": "Rollende Einheiten ohne Antrieb",
    "profile": "BOARD_RIDER_LIGHT",
    "note": "Rollstuehle und Schubkarren. ERWARTUNG, nicht Messung: die Rad-Paar-Regel (V9) verlangt ein Gegenstueck auf der anderen Seite — ein Schubkarrenrad steht allein und faellt darum durch. Was die Werkbank findet, steht im Bericht; erfunden wird nichts.",
    "rows": [
      {
        "id": "wheelchair",
        "name": "wheelchair",
        "label": "Rollstuhl",
        "path": "media/3D_Assets/GLB_mini_chars/wheelchair.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/GLB_mini_chars/wheelchair.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/GLB_mini_chars/wheelchair.glb",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "glb",
        "bytes": 64880,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab"
      },
      {
        "id": "wheelchair-deluxe",
        "name": "wheelchair-deluxe",
        "label": "Rollstuhl Deluxe",
        "path": "media/3D_Assets/GLB_mini_chars/wheelchair-deluxe.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/GLB_mini_chars/wheelchair-deluxe.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/GLB_mini_chars/wheelchair-deluxe.glb",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "glb",
        "bytes": 68788,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab"
      },
      {
        "id": "wheelchair-power",
        "name": "wheelchair-power",
        "label": "Rollstuhl Power",
        "path": "media/3D_Assets/GLB_mini_chars/wheelchair-power.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/GLB_mini_chars/wheelchair-power.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/GLB_mini_chars/wheelchair-power.glb",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "glb",
        "bytes": 84868,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab"
      },
      {
        "id": "wheelchair-power-deluxe",
        "name": "wheelchair-power-deluxe",
        "label": "Rollstuhl Power Deluxe",
        "path": "media/3D_Assets/GLB_mini_chars/wheelchair-power-deluxe.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/GLB_mini_chars/wheelchair-power-deluxe.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/GLB_mini_chars/wheelchair-power-deluxe.glb",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "glb",
        "bytes": 98712,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab"
      },
      {
        "id": "wheelchair-kenney",
        "name": "wheelchair-kenney",
        "label": "Rollstuhl · Kenney Prototype",
        "path": "media/3D_Assets/kenney_prototype-kit/Models/GLB format/wheelchair.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/kenney_prototype-kit/Models/GLB%20format/wheelchair.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_prototype-kit/Models/GLB%20format/wheelchair.glb",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "glb",
        "bytes": 27688,
        "dep": "complete",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab",
        "note": "dep complete — die Farbtafel Textures/colormap.png liegt daneben und wird ueber die relative uri geladen"
      },
      {
        "id": "wheelbarrow-farmers",
        "name": "wheelbarrow-farmers",
        "label": "Schubkarre · Farmers",
        "path": "media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/gltf/wheelbarrow.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/KayKit_Mystery_Series6/12%20-%20June%202026%20-%20Farmers/gltf/wheelbarrow.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_Mystery_Series6/12%20-%20June%202026%20-%20Farmers/gltf/wheelbarrow.gltf",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "gltf",
        "bytes": 3044,
        "dep": "complete",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab",
        "note": "glTF mit .bin und farmer_texture_A.png im selben Ordner"
      },
      {
        "id": "wheelbarrow-farmers-empty",
        "name": "wheelbarrow-farmers-empty",
        "label": "Schubkarre leer · Farmers",
        "path": "media/3D_Assets/KayKit_Mystery_Series6/12 - June 2026 - Farmers/gltf/wheelbarrow_empty.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/KayKit_Mystery_Series6/12%20-%20June%202026%20-%20Farmers/gltf/wheelbarrow_empty.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_Mystery_Series6/12%20-%20June%202026%20-%20Farmers/gltf/wheelbarrow_empty.gltf",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "gltf",
        "bytes": 3059,
        "dep": "complete",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab"
      },
      {
        "id": "wheelbarrow-hexagon",
        "name": "wheelbarrow-hexagon",
        "label": "Schubkarre · Medieval Hexagon",
        "path": "media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/wheelbarrow.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/wheelbarrow.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_Medieval_Hexagon_Pack_1.0_FREE/Assets/gltf/decoration/props/wheelbarrow.gltf",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "gltf",
        "bytes": 3059,
        "dep": "complete",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab"
      }
    ]
  }
];

/** Luft · deklariert, KEIN Deformer. Siehe PLAN_flight_deformer.md. */
export const FLIGHT_GROUPS = [
  {
    "id": "flight-poly",
    "label": "Flug · Poly und Einzelstuecke",
    "note": "Gier am Bild abgelesen (19.09., Blick von +x+z, Vorgabe-Blickrichtung +z): airplane-a, airplane-b und fighter-lowpoly haben die Nase nativ auf +x und stehen auf yawDefault 3 (270 Grad); der Papierflieger zeigt nativ richtig und bleibt auf 0. Die sechs Raumschiffe sind NICHT beurteilt und stehen auf 0. Zwei Flugzeuge von Poly by Google, ein Low-Poly-Fighter und der Papierflieger. Der Papierflieger steht NICHT im Handoff — er ist am 18.09. byteweise auf dem Pfad geprueft (3216 B @ 29aac106) und darum mit via repo gefuehrt.",
    "rows": [
      {
        "id": "airplane-a",
        "name": "airplane-a",
        "label": "Airplane A",
        "path": "media/3D_Assets/KFB/Airplane A by Poly by Google - 8VysVKMXN2J.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/KFB/Airplane%20A%20by%20Poly%20by%20Google%20-%208VysVKMXN2J.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KFB/Airplane%20A%20by%20Poly%20by%20Google%20-%208VysVKMXN2J.glb",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "glb",
        "bytes": 377648,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "yawDefault": 3,
        "via": "handoff-animation-lab"
      },
      {
        "id": "airplane-b",
        "name": "airplane-b",
        "label": "Airplane B",
        "path": "media/3D_Assets/KFB/Airplane B by Poly by Google - 6D4MwQoxK-K.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/KFB/Airplane%20B%20by%20Poly%20by%20Google%20-%206D4MwQoxK-K.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KFB/Airplane%20B%20by%20Poly%20by%20Google%20-%206D4MwQoxK-K.glb",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "glb",
        "bytes": 236484,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "yawDefault": 3,
        "via": "handoff-animation-lab"
      },
      {
        "id": "fighter-lowpoly",
        "name": "fighter-lowpoly",
        "label": "Low poly Fighter",
        "path": "media/3D_Assets/KFB/Low poly Fighter by Stephen Graybill - 1fi8ZIDdFCP.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/KFB/Low%20poly%20Fighter%20by%20Stephen%20Graybill%20-%201fi8ZIDdFCP.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KFB/Low%20poly%20Fighter%20by%20Stephen%20Graybill%20-%201fi8ZIDdFCP.glb",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "glb",
        "bytes": 10660,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "yawDefault": 3,
        "via": "handoff-animation-lab"
      },
      {
        "id": "paper-plane",
        "name": "paper-plane",
        "label": "Paper Plane",
        "path": "media/3D_Assets/KFB/Paper Plane by Anonymous - 5X4zRUBadun.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/KFB/Paper%20Plane%20by%20Anonymous%20-%205X4zRUBadun.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KFB/Paper%20Plane%20by%20Anonymous%20-%205X4zRUBadun.glb",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "glb",
        "bytes": 3216,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "repo",
        "note": "Georgs Nachtrag vom 18.09. Nicht im Handoff-Satz — Pfad byteweise geprueft: 3216 B."
      }
    ]
  },
  {
    "id": "flight-ships",
    "label": "Flug · Raumschiffe",
    "note": "Zwei KFB-Einzelmodelle von Quaternius und die vier Charakter-Schiffe aus dem SciFi Ultimate Space Kit.",
    "rows": [
      {
        "id": "spaceship-a",
        "name": "spaceship-a",
        "label": "Spaceship A",
        "path": "media/3D_Assets/KFB/Spaceship A by Quaternius - u105mYHLHU.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/KFB/Spaceship%20A%20by%20Quaternius%20-%20u105mYHLHU.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KFB/Spaceship%20A%20by%20Quaternius%20-%20u105mYHLHU.glb",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "glb",
        "bytes": 265104,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab"
      },
      {
        "id": "spaceship-b",
        "name": "spaceship-b",
        "label": "Spaceship B",
        "path": "media/3D_Assets/KFB/Spaceship B by Quaternius - VSxUAFhzbA.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/KFB/Spaceship%20B%20by%20Quaternius%20-%20VSxUAFhzbA.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KFB/Spaceship%20B%20by%20Quaternius%20-%20VSxUAFhzbA.glb",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "glb",
        "bytes": 188464,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab"
      },
      {
        "id": "spaceship-barbara",
        "name": "spaceship-barbara",
        "label": "Spaceship · Barbara the Bee",
        "path": "media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Vehicles/GLTF/Spaceship_BarbaraTheBee.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/SciFI_Ultimate%20Space%20Kit_Quaternius/Vehicles/GLTF/Spaceship_BarbaraTheBee.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/SciFI_Ultimate%20Space%20Kit_Quaternius/Vehicles/GLTF/Spaceship_BarbaraTheBee.gltf",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "gltf",
        "bytes": 347592,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab"
      },
      {
        "id": "spaceship-fernando",
        "name": "spaceship-fernando",
        "label": "Spaceship · Fernando the Flamingo",
        "path": "media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Vehicles/GLTF/Spaceship_FernandoTheFlamingo.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/SciFI_Ultimate%20Space%20Kit_Quaternius/Vehicles/GLTF/Spaceship_FernandoTheFlamingo.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/SciFI_Ultimate%20Space%20Kit_Quaternius/Vehicles/GLTF/Spaceship_FernandoTheFlamingo.gltf",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "gltf",
        "bytes": 220654,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab"
      },
      {
        "id": "spaceship-finn",
        "name": "spaceship-finn",
        "label": "Spaceship · Finn the Frog",
        "path": "media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Vehicles/GLTF/Spaceship_FinnTheFrog.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/SciFI_Ultimate%20Space%20Kit_Quaternius/Vehicles/GLTF/Spaceship_FinnTheFrog.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/SciFI_Ultimate%20Space%20Kit_Quaternius/Vehicles/GLTF/Spaceship_FinnTheFrog.gltf",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "gltf",
        "bytes": 245407,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab"
      },
      {
        "id": "spaceship-rae",
        "name": "spaceship-rae",
        "label": "Spaceship · Rae the Red Panda",
        "path": "media/3D_Assets/SciFI_Ultimate Space Kit_Quaternius/Vehicles/GLTF/Spaceship_RaeTheRedPanda.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/29aac1061bdd73736351cb856fa9f1e322478abc/media/3D_Assets/SciFI_Ultimate%20Space%20Kit_Quaternius/Vehicles/GLTF/Spaceship_RaeTheRedPanda.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/SciFI_Ultimate%20Space%20Kit_Quaternius/Vehicles/GLTF/Spaceship_RaeTheRedPanda.gltf",
        "pin": "29aac1061bdd73736351cb856fa9f1e322478abc",
        "format": "gltf",
        "bytes": 142993,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "via": "handoff-animation-lab"
      }
    ]
  }
];

export const GROUPS = GROUPS_V2.concat(GROUPS_NEW);
export const ALL = GROUPS.flatMap((g) => g.rows.map((r) => Object.assign({ group: g.id, domain: 'ground', upFix: !!g.upFix, profile: r.profile || g.profile }, r)));
export const FLIGHT = FLIGHT_GROUPS.flatMap((g) => g.rows.map((r) => Object.assign({ group: g.id, domain: 'flight' }, r)));
/** Die Spacetrucks fahren UND schweben — als Hover-Variante gefuehrt, nicht kopiert. */
export const HOVER_CANDIDATES = ['spacetruck', 'spacetruck-large', 'spacetruck-trailer'];
export const EVERY = ALL.concat(FLIGHT);
export const byId = (id) => EVERY.find((r) => r.id === id) || null;

/* Dieselben Speicherschluessel wie in v2 — eine Korrektur, die Georg einmal gemacht hat, bleibt
   gemacht. Neu implementiert statt importiert, weil die v2-Funktionen ueber die v2-Liste suchen
   und die neuen Zeilen dort nicht kennen. */
const FKEY = 'kfb-vehicle-facing/1';
const OKEY = 'kfb-vehicle-orient/1';
export function facingOf(id) {
  const row = byId(id); if (!row) return 1;
  try { const m = JSON.parse(localStorage.getItem(FKEY) || '{}'); if (m[id]) return m[id]; } catch (e) {}
  return row.facing || 1;
}
export function rememberFacing(id, facing) {
  try { const m = JSON.parse(localStorage.getItem(FKEY) || '{}'); m[id] = facing; localStorage.setItem(FKEY, JSON.stringify(m)); } catch (e) {}
}
export function orientOf(id) {
  const row = byId(id);
  try { const m = JSON.parse(localStorage.getItem(OKEY) || '{}'); if (m[id] != null) return m[id]; } catch (e) {}
  return (row && row.orientDefault) || 0;
}
export function rememberOrient(id, index) {
  try { const m = JSON.parse(localStorage.getItem(OKEY) || '{}'); m[id] = ((index % 6) + 6) % 6; localStorage.setItem(OKEY, JSON.stringify(m)); } catch (e) {}
}
