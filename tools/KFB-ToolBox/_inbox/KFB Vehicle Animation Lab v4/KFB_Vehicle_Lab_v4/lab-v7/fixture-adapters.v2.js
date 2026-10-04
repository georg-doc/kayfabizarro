/**
 * lab-v7/fixture-adapters.v2.js · Die Fixture-Liste. EINE Quelle für beide Labs.
 *
 * Aufgebaut aus zwei Quellen, jede Zeile trägt ihre Herkunft:
 *
 *   via: 'handoff'  — aus Georgs `kfb-race-track-asset-handoff-generic-runtime.json`
 *                     (`kfb.asset-handoff.v1`, sourceCommit 10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0).
 *                     Das ist der Satz, den Race wirklich benutzt. Adressen und Bytes sind aus
 *                     der Datei übernommen, nicht getippt.
 *   via: 'registry'  — aus `registry/assets/v1/packs/*.json` @ 34cde3f8f752d481a03c9714f1c3b3a8b2c15c46.
 *                     Im Registry ladbar, aber NICHT Teil des Handoff-Satzes. Getrennt gehalten,
 *                     damit niemand sie für abgestimmt hält.
 *
 * Der Handoff sagt selbst, was er ist: `selectionStatus: "candidate-only"`,
 * `suitabilityDecision: "owned-by-receiving-consumer"`, und
 * »The receiving module owns final suitability and integration.«
 * Diese Liste ist also eine Kandidatenliste, keine Freigabe.
 *
 * BLICKRICHTUNG ist keine Messung. Kein Modell gibt sie her. `facing` ist eine ANNAHME je Pack:
 * kenney-toy-car-kit steht auf −1, gemessen an Georgs Aufnahme vom 17.09. (die Heckschürze zeigte
 * zum Fahrtrichtungspfeil); alles andere steht auf +1, bis es widerlegt ist. Der Flip in der
 * Oberfläche merkt sich die Korrektur je Fahrzeug, damit sie nicht zweimal gemacht werden muss.
 *
 * PROFILE ordnen jedem Fahrzeug einen Startpunkt in `deformer-profiles.json` zu. HEAVY_FUTURE ist
 * reine Profilstruktur — an keinem echten Fixture abgestimmt (Briefing-Vorgabe).
 */
export const SCHEMA = 'kfb.vehicle-fixtures-adapter/2';

export const SOURCES = {
  "handoff": {
    "schema": "kfb.asset-handoff.v1",
    "repo": "georg-doc/kayfabizarro",
    "commit": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
    "consumer": "generic-runtime",
    "selectionStatus": "candidate-only",
    "suitabilityDecision": "owned-by-receiving-consumer"
  },
  "registry": {
    "schema": "kfb.asset-registry.v1",
    "repo": "georg-doc/kayfabizarro",
    "commit": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46"
  },
  "librarian": "https://kayfabizarro.pages.dev/tools/asset_registry/librarian/"
};

/** Vom Briefing verlangt, im Handoff NICHT vorhanden. Zurückgemeldet statt ersetzt. */
export const OPEN_ASSETREFS = [
  { need: 'KayKit ActionFigure / Rig_Medium', why: 'Briefing-Fixture 3 (Skateboard + Rider)',
    searched: 'Handoff-Satz, 141 Assets, Muster rig_medium|actionfigure',
    found: 'nichts. Nächstliegende gerigte Figuren im Satz: Astronaut_* (43 Joints, 18 Clips) und Mech_* (13 Joints, 17 Clips) — beide keine ActionFigure.',
    consequence: 'Board-Rider-Kette (hips → knee → torso → head) ist im Profil angelegt, aber ohne Rider nicht abnehmbar.' },
  { need: 'Go kart by Poly by Google · achsenparallele Aufrichtung', why: 'Fixture steht schief, Georgs Sichtpruefung 17.09.',
    searched: 'alle sechs achsenparallelen Lagen durchgemessen (0°, X−90°, X+90°, X180°, Z−90°, Z+90°)',
    found: 'keine richtet ihn auf — einmal gekippt, einmal auf dem Kopf, viermal auf der Kante. Die Radsuche findet entsprechend 0 bis 2 Raeder statt vier.',
    consequence: 'Das Modell ist nicht achsenparallel autoriert. Es braucht eine freie Rotation im Asset selbst (einmal in Blender gerade stellen und als .glb neu ablegen) — ein Schalter in der Werkbank kann das nicht heilen. Bis dahin unbrauchbar als Fixture.' },
  { need: 'Skateboard und Rollerskate · drehende Raeder', why: 'Georg 17.09.: »koennten sich bei accel auch die Raeder drehen?«',
    searched: 'Knoten-Weg und Insel-Weg an beiden Modellen',
    found: 'Skateboard ist ein verschweisstes Einzelnetz — die Inseltrennung kann die Rollen nicht herausloesen, also 0 Raeder. Rollerskate ist noch nicht gemessen.',
    consequence: 'Board-Roll und Rider-Kette laufen ohne Raeder; ein Radlauf braucht entweder benannte Rollenknoten im Asset oder ein getrenntes Netz.' },
];

/** Erledigt. Steht hier, damit der Weg nachvollziehbar bleibt. */
export const RESOLVED_ASSETREFS = [
  { need: 'KayKit Space Base Bits · spacetruck, spacetruck_large, spacetruck_trailer',
    was: 'lag nur in KFB-Stunt-Car-Race, von dort im Browser nicht abrufbar, und die glTF sind ohne ihre .bin-Sidecars unbrauchbar',
    now: 'liegt in kayfabizarro unter media/3D_Assets — glTF, .bin und Textur im selben Ordner, im Registry-Pack kaykit-space-base-bits-1-0-free indiziert, Pin eb48f50489b9',
    checked: '18.09., byteweise auf allen sieben Dateien (drei glTF, drei .bin, eine Textur). Ordneransichten zeigen die glTF weiterhin nicht — das ist die bekannte Falle, keine Abwesenheit.' },
];

export const GROUPS = [
  {
    "id": "spacebits",
    "label": "KayKit Space Base Bits",
    "note": "Der Auftrag vom 17.09. Seit dem Umzug nach kayfabizarro ladbar: glTF, .bin und spacebits_texture.png liegen im selben Ordner, Pin eb48f50489b9. Blickrichtung ist hier NICHT geraten — die Radknoten heissen selbst front und rear, front liegt bei +z.",
    "profile": "SPACE_HAULER",
    "rows": [
      {
        "id": "spacetruck",
        "name": "spacetruck",
        "label": "Spacetruck",
        "path": "media/3D_Assets/KayKit_Space_Base_Bits_1.0_FREE/Assets/gltf/spacetruck.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/eb48f50489b9e4903ec1e3d2fb1837605ce7d792/media/3D_Assets/KayKit_Space_Base_Bits_1.0_FREE/Assets/gltf/spacetruck.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_Space_Base_Bits_1.0_FREE/Assets/gltf/spacetruck.gltf",
        "pin": "eb48f50489b9e4903ec1e3d2fb1837605ce7d792",
        "format": "gltf",
        "bytes": 10917,
        "dep": "complete",
        "facing": 1,
        "orientDefault": 0,
        "profile": "SPACE_HAULER",
        "via": "registry",
        "measured": "gelesen in spacetruck.gltf: 5 Netze, 4 benannte Radknoten (spacetruck_wheel_front_left/right, _rear_left/right). Radradius 0,0877 u, Radbreite 0,0916 u auf x. Spur ±0,1720, Radstand ±0,2136. Karosserie x ±0,2447, y 0,0108…0,4883, z −0,4455…+0,4478. Radmitte y +0,0098, Aufstandsebene also y −0,0779."
      },
      {
        "id": "spacetruck-large",
        "name": "spacetruck_large",
        "label": "Spacetruck Large",
        "path": "media/3D_Assets/KayKit_Space_Base_Bits_1.0_FREE/Assets/gltf/spacetruck_large.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/eb48f50489b9e4903ec1e3d2fb1837605ce7d792/media/3D_Assets/KayKit_Space_Base_Bits_1.0_FREE/Assets/gltf/spacetruck_large.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_Space_Base_Bits_1.0_FREE/Assets/gltf/spacetruck_large.gltf",
        "pin": "eb48f50489b9e4903ec1e3d2fb1837605ce7d792",
        "format": "gltf",
        "bytes": 10963,
        "dep": "complete",
        "facing": 1,
        "orientDefault": 0,
        "profile": "SPACE_HAULER",
        "via": "registry",
        "measured": "gelesen in spacetruck_large.gltf: 5 Netze, 4 benannte Radknoten. Radradius 0,1140 u, Radbreite 0,1620 u auf x. Spur ±0,1720, Radstand ±0,2136. Karosserie x ±0,2447, y −0,0107…0,5519, z −0,5718…+0,4559 — der Aufbau steht 0,0579 u nach hinten ueber, Nickachse liegt also nicht in der Mitte. Radmitte y −0,0196, Aufstandsebene y −0,1335."
      },
      {
        "id": "spacetruck-trailer",
        "name": "spacetruck_trailer",
        "label": "Spacetruck Trailer",
        "path": "media/3D_Assets/KayKit_Space_Base_Bits_1.0_FREE/Assets/gltf/spacetruck_trailer.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/eb48f50489b9e4903ec1e3d2fb1837605ce7d792/media/3D_Assets/KayKit_Space_Base_Bits_1.0_FREE/Assets/gltf/spacetruck_trailer.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_Space_Base_Bits_1.0_FREE/Assets/gltf/spacetruck_trailer.gltf",
        "pin": "eb48f50489b9e4903ec1e3d2fb1837605ce7d792",
        "format": "gltf",
        "bytes": 10945,
        "dep": "complete",
        "facing": 1,
        "orientDefault": 0,
        "profile": "TRAILER_TOWED",
        "via": "registry",
        "measured": "gelesen in spacetruck_trailer.gltf: 5 Netze, 4 benannte Radknoten. Radradius 0,0877 u, Radbreite 0,0916 u auf x. Spur ±0,1720, Radstand ±0,2636. Karosserie x ±0,2400, y −0,0477…0,1951, z ±0,5000. Radmitte y −0,0554, Aufstandsebene y −0,1431.",
        "note": "gezogene Einheit — kein Antrieb. Ein Anhaengepunkt ist im Asset nicht autoriert; die vordere Karosseriekante liegt bei z +0,5000. Ob der Nachlauf zum Zugfahrzeug gehoert oder ein eigener Actor ist, ist Georgs Entscheidung."
      }
    ]
  },
  {
    "id": "citybuilder",
    "label": "KayKit City Builder Bits",
    "note": "Briefing-Fixtures 1 und 2 · glTF + .bin + citybits_texture.png, alle drei im Handoff als vorhanden geprüft",
    "profile": "CAR_CHILL_LIGHT",
    "rows": [
      {
        "id": "car-hatchback",
        "name": "car_hatchback",
        "label": "Hatchback",
        "path": "media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_hatchback.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_hatchback.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_hatchback.gltf",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "gltf",
        "bytes": 10952,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "handoff"
      },
      {
        "id": "car-sedan",
        "name": "car_sedan",
        "label": "Sedan",
        "path": "media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_sedan.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_sedan.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_sedan.gltf",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "gltf",
        "bytes": 10928,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "handoff"
      },
      {
        "id": "car-stationwagon",
        "name": "car_stationwagon",
        "label": "Stationwagon",
        "path": "media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_stationwagon.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_stationwagon.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_stationwagon.gltf",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "gltf",
        "bytes": 10970,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "handoff"
      },
      {
        "id": "car-taxi",
        "name": "car_taxi",
        "label": "Taxi",
        "path": "media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_taxi.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_taxi.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_taxi.gltf",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "gltf",
        "bytes": 10924,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "handoff"
      },
      {
        "id": "car-police",
        "name": "car_police",
        "label": "Police",
        "path": "media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_police.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_police.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_City_Builder_Bits_1.0_FREE/Assets/gltf/car_police.gltf",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "gltf",
        "bytes": 10937,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "handoff"
      }
    ]
  },
  {
    "id": "poly",
    "upFix": true,
    "label": "Poly by Google und Frankensteining",
    "note": "Karts und Wagen mit eingebetteten Texturen",
    "profile": "CAR_CHILL_LIGHT",
    "rows": [
      {
        "id": "go-kart-by-poly-by-google-3hkutvs0aav",
        "name": "Go kart by Poly by Google - 3hkutVs0AAV",
        "label": "Go Kart",
        "path": "media/3D_Assets/Frankensteining/Go kart by Poly by Google - 3hkutVs0AAV.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/Frankensteining/Go%20kart%20by%20Poly%20by%20Google%20-%203hkutVs0AAV.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Frankensteining/Go%20kart%20by%20Poly%20by%20Google%20-%203hkutVs0AAV.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 188320,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 0,
        "profile": "CAR_CHILL_LIGHT",
        "via": "handoff"
      },
      {
        "id": "go-kart-by-zsky-mkbyxzcsma",
        "name": "Go Kart by Zsky - MkByxZCSMA",
        "label": "Go Kart",
        "path": "media/3D_Assets/Frankensteining/Go Kart by Zsky - MkByxZCSMA.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/Frankensteining/Go%20Kart%20by%20Zsky%20-%20MkByxZCSMA.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Frankensteining/Go%20Kart%20by%20Zsky%20-%20MkByxZCSMA.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 127912,
        "dep": "embedded",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "handoff"
      },
      {
        "id": "kart-by-ben-harrison-bkdlm4mh7rg",
        "name": "Kart by Ben Harrison - bKDlM4mH7rg",
        "label": "Kart",
        "path": "media/3D_Assets/Frankensteining/Kart by Ben Harrison - bKDlM4mH7rg.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/Frankensteining/Kart%20by%20Ben%20Harrison%20-%20bKDlM4mH7rg.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Frankensteining/Kart%20by%20Ben%20Harrison%20-%20bKDlM4mH7rg.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 123920,
        "dep": "embedded",
        "facing": -1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "handoff"
      },
      {
        "id": "taxi-by-poly-by-google-cgbyoqkekfc",
        "name": "Taxi by Poly by Google - cgbyoqkeKFC",
        "label": "Taxi",
        "path": "media/3D_Assets/Frankensteining/Taxi by Poly by Google - cgbyoqkeKFC.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/Frankensteining/Taxi%20by%20Poly%20by%20Google%20-%20cgbyoqkeKFC.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Frankensteining/Taxi%20by%20Poly%20by%20Google%20-%20cgbyoqkeKFC.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 892156,
        "dep": "embedded",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "handoff"
      },
      {
        "id": "wagon-by-poly-by-google-136bu5geshs",
        "name": "Wagon by Poly by Google - 136bU5GesHs",
        "label": "Wagon",
        "path": "media/3D_Assets/Frankensteining/Wagon by Poly by Google - 136bU5GesHs.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/Frankensteining/Wagon%20by%20Poly%20by%20Google%20-%20136bU5GesHs.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Frankensteining/Wagon%20by%20Poly%20by%20Google%20-%20136bU5GesHs.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 281108,
        "dep": "embedded",
        "facing": 1,
        "orientDefault": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "handoff"
      },
      {
        "id": "police-car-by-poly-by-google-erayhpz-n2h",
        "name": "Police car by Poly by Google - erAyhpZ-N2h",
        "label": "Police Car",
        "path": "media/3D_Assets/KFB/Police car by Poly by Google - erAyhpZ-N2h.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/KFB/Police%20car%20by%20Poly%20by%20Google%20-%20erAyhpZ-N2h.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KFB/Police%20car%20by%20Poly%20by%20Google%20-%20erAyhpZ-N2h.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 1119328,
        "dep": "embedded",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "handoff"
      },
      {
        "id": "police-car-by-kay-lousberg-uj7i2vlmir",
        "name": "Police Car by Kay Lousberg - Uj7i2vlmir",
        "label": "Police Car",
        "path": "media/3D_Assets/Frankensteining/Police Car by Kay Lousberg - Uj7i2vlmir.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/Frankensteining/Police%20Car%20by%20Kay%20Lousberg%20-%20Uj7i2vlmir.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/Frankensteining/Police%20Car%20by%20Kay%20Lousberg%20-%20Uj7i2vlmir.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 89468,
        "dep": "embedded",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "handoff"
      }
    ]
  },
  {
    "id": "karts",
    "label": "kenney car-kit · Karts",
    "note": "fünf Kart-Varianten aus dem Handoff-Satz",
    "profile": "CAR_CHILL_LIGHT",
    "rows": [
      {
        "id": "kart-oobi",
        "name": "kart-oobi",
        "label": "Kart Oobi",
        "path": "media/3D_Assets/kenney_car-kit/Models/GLB format/kart-oobi.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/kenney_car-kit/Models/GLB%20format/kart-oobi.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_car-kit/Models/GLB%20format/kart-oobi.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 251516,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "handoff"
      },
      {
        "id": "kart-oodi",
        "name": "kart-oodi",
        "label": "Kart Oodi",
        "path": "media/3D_Assets/kenney_car-kit/Models/GLB format/kart-oodi.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/kenney_car-kit/Models/GLB%20format/kart-oodi.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_car-kit/Models/GLB%20format/kart-oodi.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 230984,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "handoff"
      },
      {
        "id": "kart-ooli",
        "name": "kart-ooli",
        "label": "Kart Ooli",
        "path": "media/3D_Assets/kenney_car-kit/Models/GLB format/kart-ooli.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/kenney_car-kit/Models/GLB%20format/kart-ooli.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_car-kit/Models/GLB%20format/kart-ooli.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 233380,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "handoff"
      },
      {
        "id": "kart-oopi",
        "name": "kart-oopi",
        "label": "Kart Oopi",
        "path": "media/3D_Assets/kenney_car-kit/Models/GLB format/kart-oopi.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/kenney_car-kit/Models/GLB%20format/kart-oopi.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_car-kit/Models/GLB%20format/kart-oopi.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 236196,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "handoff"
      },
      {
        "id": "kart-oozi",
        "name": "kart-oozi",
        "label": "Kart Oozi",
        "path": "media/3D_Assets/kenney_car-kit/Models/GLB format/kart-oozi.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/kenney_car-kit/Models/GLB%20format/kart-oozi.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_car-kit/Models/GLB%20format/kart-oozi.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 240776,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "handoff"
      }
    ]
  },
  {
    "id": "heavy",
    "label": "Schwere Einheiten",
    "note": "Profilstruktur HEAVY_FUTURE · noch nicht abgestimmt",
    "profile": "HEAVY_FUTURE",
    "rows": [
      {
        "id": "truck",
        "name": "truck",
        "label": "Truck",
        "path": "media/3D_Assets/kenney_car-kit/Models/GLB format/truck.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/kenney_car-kit/Models/GLB%20format/truck.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_car-kit/Models/GLB%20format/truck.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 176360,
        "dep": "complete",
        "facing": 1,
        "profile": "HEAVY_FUTURE",
        "via": "handoff"
      },
      {
        "id": "truck-flat",
        "name": "truck-flat",
        "label": "Truck-Flat",
        "path": "media/3D_Assets/kenney_car-kit/Models/GLB format/truck-flat.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/kenney_car-kit/Models/GLB%20format/truck-flat.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_car-kit/Models/GLB%20format/truck-flat.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 207424,
        "dep": "complete",
        "facing": 1,
        "profile": "HEAVY_FUTURE",
        "via": "handoff"
      },
      {
        "id": "firetruck",
        "name": "firetruck",
        "label": "Firetruck",
        "path": "media/3D_Assets/kenney_car-kit/Models/GLB format/firetruck.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/kenney_car-kit/Models/GLB%20format/firetruck.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_car-kit/Models/GLB%20format/firetruck.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 232448,
        "dep": "complete",
        "facing": 1,
        "profile": "HEAVY_FUTURE",
        "via": "handoff"
      },
      {
        "id": "garbage-truck",
        "name": "garbage-truck",
        "label": "Garbage-Truck",
        "path": "media/3D_Assets/kenney_car-kit/Models/GLB format/garbage-truck.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/kenney_car-kit/Models/GLB%20format/garbage-truck.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_car-kit/Models/GLB%20format/garbage-truck.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 268224,
        "dep": "complete",
        "facing": 1,
        "profile": "HEAVY_FUTURE",
        "via": "handoff"
      },
      {
        "id": "vehicle-monster-truck",
        "name": "vehicle-monster-truck",
        "label": "Monster-Truck",
        "path": "media/3D_Assets/kenney_toy-car-kit/Models/GLB format/vehicle-monster-truck.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/kenney_toy-car-kit/Models/GLB%20format/vehicle-monster-truck.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_toy-car-kit/Models/GLB%20format/vehicle-monster-truck.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 121628,
        "dep": "complete",
        "facing": -1,
        "profile": "HEAVY_FUTURE",
        "via": "handoff"
      },
      {
        "id": "vehicle-truck",
        "name": "vehicle-truck",
        "label": "Truck",
        "path": "media/3D_Assets/kenney_toy-car-kit/Models/GLB format/vehicle-truck.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/kenney_toy-car-kit/Models/GLB%20format/vehicle-truck.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_toy-car-kit/Models/GLB%20format/vehicle-truck.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 103488,
        "dep": "complete",
        "facing": -1,
        "profile": "HEAVY_FUTURE",
        "via": "handoff"
      }
    ]
  },
  {
    "id": "board",
    "upFix": true,
    "label": "Board und Rider",
    "note": "Briefing-Fixture 3 · Rider fehlt, siehe OPEN_ASSETREFS",
    "profile": "BOARD_RIDER_LIGHT",
    "rows": [
      {
        "id": "skateboard-by-poly-by-google-7dfn4vttcwy",
        "name": "Skateboard by Poly by Google - 7Dfn4VtTCWY",
        "label": "Skateboard",
        "path": "media/3D_Assets/KFB/Skateboard by Poly by Google - 7Dfn4VtTCWY.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/KFB/Skateboard%20by%20Poly%20by%20Google%20-%207Dfn4VtTCWY.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KFB/Skateboard%20by%20Poly%20by%20Google%20-%207Dfn4VtTCWY.glb",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "glb",
        "bytes": 1148924,
        "dep": "embedded",
        "facing": 1,
        "profile": "BOARD_RIDER_LIGHT",
        "via": "handoff"
      },
      {
        "id": "rollerskate-a",
        "name": "rollerskate_A",
        "label": "Rollerskate A",
        "path": "media/3D_Assets/KayKit_Mixed_Bag_1_FREE/Assets/gltf/rollerskate_A.gltf",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0/media/3D_Assets/KayKit_Mixed_Bag_1_FREE/Assets/gltf/rollerskate_A.gltf",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/KayKit_Mixed_Bag_1_FREE/Assets/gltf/rollerskate_A.gltf",
        "pin": "10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0",
        "format": "gltf",
        "bytes": 3044,
        "dep": "complete",
        "facing": 1,
        "profile": "BOARD_RIDER_LIGHT",
        "via": "handoff"
      }
    ]
  },
  {
    "id": "car-kit-road",
    "label": "kenney car-kit · Straßenwagen",
    "note": "im Registry ladbar, aber NICHT im Race-Handoff-Satz",
    "profile": "CAR_CHILL_LIGHT",
    "rows": [
      {
        "id": "race",
        "name": "race",
        "label": "Race",
        "path": "media/3D_Assets/kenney_car-kit/Models/GLB format/race.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_car-kit/Models/GLB%20format/race.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_car-kit/Models/GLB%20format/race.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 167272,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      },
      {
        "id": "race-future",
        "name": "race-future",
        "label": "Race Future",
        "path": "media/3D_Assets/kenney_car-kit/Models/GLB format/race-future.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_car-kit/Models/GLB%20format/race-future.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_car-kit/Models/GLB%20format/race-future.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 173164,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      },
      {
        "id": "hatchback-sports",
        "name": "hatchback-sports",
        "label": "Hatchback Sports",
        "path": "media/3D_Assets/kenney_car-kit/Models/GLB format/hatchback-sports.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_car-kit/Models/GLB%20format/hatchback-sports.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_car-kit/Models/GLB%20format/hatchback-sports.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 197804,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      },
      {
        "id": "sedan-sports",
        "name": "sedan-sports",
        "label": "Sedan Sports",
        "path": "media/3D_Assets/kenney_car-kit/Models/GLB format/sedan-sports.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_car-kit/Models/GLB%20format/sedan-sports.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_car-kit/Models/GLB%20format/sedan-sports.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 177676,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      },
      {
        "id": "van",
        "name": "van",
        "label": "Van",
        "path": "media/3D_Assets/kenney_car-kit/Models/GLB format/van.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_car-kit/Models/GLB%20format/van.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_car-kit/Models/GLB%20format/van.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 175664,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      },
      {
        "id": "police",
        "name": "police",
        "label": "Police",
        "path": "media/3D_Assets/kenney_car-kit/Models/GLB format/police.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_car-kit/Models/GLB%20format/police.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_car-kit/Models/GLB%20format/police.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 195336,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      },
      {
        "id": "taxi",
        "name": "taxi",
        "label": "Taxi",
        "path": "media/3D_Assets/kenney_car-kit/Models/GLB format/taxi.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_car-kit/Models/GLB%20format/taxi.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_car-kit/Models/GLB%20format/taxi.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 175608,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      },
      {
        "id": "suv",
        "name": "suv",
        "label": "SUV",
        "path": "media/3D_Assets/kenney_car-kit/Models/GLB format/suv.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_car-kit/Models/GLB%20format/suv.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_car-kit/Models/GLB%20format/suv.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 207572,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      }
    ]
  },
  {
    "id": "toy",
    "label": "kenney toy-car-kit",
    "note": "Spielzeugmaßstab · Blickrichtung −z, gemessen an Georgs Aufnahme 17.09.",
    "profile": "CAR_CHILL_LIGHT",
    "rows": [
      {
        "id": "vehicle-racer",
        "name": "vehicle-racer",
        "label": "Racer",
        "path": "media/3D_Assets/kenney_toy-car-kit/Models/GLB format/vehicle-racer.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_toy-car-kit/Models/GLB%20format/vehicle-racer.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_toy-car-kit/Models/GLB%20format/vehicle-racer.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 104328,
        "dep": "complete",
        "facing": -1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      },
      {
        "id": "vehicle-racer-low",
        "name": "vehicle-racer-low",
        "label": "Racer Low",
        "path": "media/3D_Assets/kenney_toy-car-kit/Models/GLB format/vehicle-racer-low.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_toy-car-kit/Models/GLB%20format/vehicle-racer-low.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_toy-car-kit/Models/GLB%20format/vehicle-racer-low.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 103808,
        "dep": "complete",
        "facing": -1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      },
      {
        "id": "vehicle-speedster",
        "name": "vehicle-speedster",
        "label": "Speedster",
        "path": "media/3D_Assets/kenney_toy-car-kit/Models/GLB format/vehicle-speedster.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_toy-car-kit/Models/GLB%20format/vehicle-speedster.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_toy-car-kit/Models/GLB%20format/vehicle-speedster.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 103636,
        "dep": "complete",
        "facing": -1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      },
      {
        "id": "vehicle-drag-racer",
        "name": "vehicle-drag-racer",
        "label": "Drag Racer",
        "path": "media/3D_Assets/kenney_toy-car-kit/Models/GLB format/vehicle-drag-racer.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_toy-car-kit/Models/GLB%20format/vehicle-drag-racer.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_toy-car-kit/Models/GLB%20format/vehicle-drag-racer.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 104636,
        "dep": "complete",
        "facing": -1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      },
      {
        "id": "vehicle-vintage-racer",
        "name": "vehicle-vintage-racer",
        "label": "Vintage Racer",
        "path": "media/3D_Assets/kenney_toy-car-kit/Models/GLB format/vehicle-vintage-racer.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_toy-car-kit/Models/GLB%20format/vehicle-vintage-racer.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_toy-car-kit/Models/GLB%20format/vehicle-vintage-racer.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 102156,
        "dep": "complete",
        "facing": -1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      },
      {
        "id": "vehicle-suv",
        "name": "vehicle-suv",
        "label": "SUV",
        "path": "media/3D_Assets/kenney_toy-car-kit/Models/GLB format/vehicle-suv.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_toy-car-kit/Models/GLB%20format/vehicle-suv.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_toy-car-kit/Models/GLB%20format/vehicle-suv.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 106724,
        "dep": "complete",
        "facing": -1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      }
    ]
  },
  {
    "id": "racing",
    "label": "kenney racing-kit",
    "note": "Formel-Silhouette · Texturen eingebettet",
    "profile": "CAR_CHILL_LIGHT",
    "rows": [
      {
        "id": "raceCarRed",
        "name": "raceCarRed",
        "label": "Race Car Red",
        "path": "media/3D_Assets/kenney_racing-kit/Models/GLTF format/raceCarRed.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_racing-kit/Models/GLTF%20format/raceCarRed.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_racing-kit/Models/GLTF%20format/raceCarRed.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 106064,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      },
      {
        "id": "raceCarGreen",
        "name": "raceCarGreen",
        "label": "Race Car Green",
        "path": "media/3D_Assets/kenney_racing-kit/Models/GLTF format/raceCarGreen.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_racing-kit/Models/GLTF%20format/raceCarGreen.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_racing-kit/Models/GLTF%20format/raceCarGreen.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 106068,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      },
      {
        "id": "raceCarOrange",
        "name": "raceCarOrange",
        "label": "Race Car Orange",
        "path": "media/3D_Assets/kenney_racing-kit/Models/GLTF format/raceCarOrange.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_racing-kit/Models/GLTF%20format/raceCarOrange.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_racing-kit/Models/GLTF%20format/raceCarOrange.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 106068,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      },
      {
        "id": "raceCarWhite",
        "name": "raceCarWhite",
        "label": "Race Car White",
        "path": "media/3D_Assets/kenney_racing-kit/Models/GLTF format/raceCarWhite.glb",
        "url": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/34cde3f8f752d481a03c9714f1c3b3a8b2c15c46/media/3D_Assets/kenney_racing-kit/Models/GLTF%20format/raceCarWhite.glb",
        "urlLatest": "https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/media/3D_Assets/kenney_racing-kit/Models/GLTF%20format/raceCarWhite.glb",
        "pin": "34cde3f8f752d481a03c9714f1c3b3a8b2c15c46",
        "format": "glb",
        "bytes": 105864,
        "dep": "complete",
        "facing": 1,
        "profile": "CAR_CHILL_LIGHT",
        "via": "registry"
      }
    ]
  }
];

export const ALL = GROUPS.flatMap((g) => g.rows.map((r) => Object.assign({ group: g.id, upFix: !!g.upFix }, r)));
export const byId = (id) => ALL.find((r) => r.id === id) || null;

/* Blickrichtungs-Korrekturen überleben den Neuladen — eine Annahme, die Georg einmal richtigstellt,
   bleibt richtiggestellt. */
const FKEY = 'kfb-vehicle-facing/1';
export function facingOf(id) {
  const row = byId(id); if (!row) return 1;
  try { const m = JSON.parse(localStorage.getItem(FKEY) || '{}'); if (m[id]) return m[id]; } catch (e) {}
  return row.facing || 1;
}
export function rememberFacing(id, facing) {
  try { const m = JSON.parse(localStorage.getItem(FKEY) || '{}'); m[id] = facing; localStorage.setItem(FKEY, JSON.stringify(m)); } catch (e) {}
}

/* AUFRICHTUNG je Fixture, in Vierteldrehungen um die Querachse.
 *
 * Warum von Hand und nicht gemessen: der `upFix`-Schalter richtet Z-up-Assets auf, solange sie
 * hoeher als lang sind. Beim Go-Kart von Poly greift er nicht — das Modell ist 33,9 hoch gegen
 * 39,5 lang, liegt also nach der Huellbox flach und steht trotzdem auf der Nase. Eine Huellbox
 * kann das nicht unterscheiden; ein Mech ist legitim hoch, ein Kart auf der Seite sieht aus wie
 * ein flaches Kart. Also entscheidet das Auge einmal und der Browser merkt es sich. Das ist
 * ehrlicher als eine Heuristik, die bei jedem dritten Asset daneben liegt. */
const OKEY = 'kfb-vehicle-orient/1';
export function orientOf(id) {
  const row = byId(id);
  /* `orientDefault` ist am Bild ABGELESEN (Georgs Sichtpruefung 17.09.), nicht gemessen — eine
     Huellbox kann ein gekipptes Kart nicht von einem flachen unterscheiden. Ein gespeicherter
     Wert schlaegt den abgelesenen: wer nachjustiert, behaelt seine Korrektur. */
  try { const m = JSON.parse(localStorage.getItem(OKEY) || '{}'); if (m[id] != null) return m[id]; } catch (e) {}
  /* Abgelesen an Georgs Sichtpruefung 17.09. und durchgemessen: der Wagon steht bei X−90°
     (Index 1). Der Go-Kart steht in KEINER der sechs Lagen — Default bleibt 0 und er ist als
     offener AssetRef gemeldet, statt eine Lage zu setzen, die auch falsch ist. */
  return (row && row.orientDefault) || 0;
}
export function rememberOrient(id, index) {
  try { const m = JSON.parse(localStorage.getItem(OKEY) || '{}'); m[id] = ((index % 6) + 6) % 6; localStorage.setItem(OKEY, JSON.stringify(m)); } catch (e) {}
}
