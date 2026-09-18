/**
 * lab-v7/registry-vehicles.v1.js · Die Fahrzeugliste, GEZOGEN aus dem KFB Asset Registry.
 *
 * Georg, 17.09.: »nimm dann bitte die vehikel-assets aus dem json von hier« (Asset Librarian).
 * Also kommen die Pfade NICHT aus meinem Gedächtnis, sondern aus
 *   registry/assets/v1/packs/{kenney-car-kit,kenney-toy-car-kit,kenney-racing-kit}.json
 * und jede Zeile trägt die gepinnte RAW-Adresse des Registry-Quellcommits.
 *
 * Registry-Stand: kfb.asset-registry.v1 · sourceCommit 34cde3f8f752d481a03c9714f1c3b3a8b2c15c46
 * (sourceCommitTime 2026-09-17T01:21:52+02:00), 13 338 Assets, 102 Packs.
 *
 * ZWEI BEFUNDE, die dazugehören:
 *
 *   1 Space Base Bits liegt NICHT im Registry. Das Registry indiziert `media/2D_Assets` und
 *     `media/3D_Assets` von kayfabizarro; das Pack liegt in KFB-Stunt-Car-Race unter `3D Assets/`.
 *     Gesucht wurde nach `space_base`, `spacebits`, `spacetruck` — null Treffer in 1494 Dateien
 *     unter media/3D_Assets.
 *   2 Und es ist von dort auch nicht LADBAR. Gemessen am 17.09.: der RAW-Abruf auf
 *     KFB-Stunt-Car-Race scheitert im Browser (fetch error), und eine Kopie im Projekt hilft nicht,
 *     weil die `.bin`-Puffer der glTF nicht mitkopiert werden können. Die drei Spacetrucks stehen
 *     darum unten mit `available: false` samt Grund und Abhilfe — eine Zeile, die zum Laden
 *     einlädt und dabei scheitert, ist schlimmer als eine, die ihren Grund nennt.
 *   3 Das Pack hat genau DREI Fahrzeuge (spacetruck, spacetruck_large, spacetruck_trailer). Die
 *     restlichen 54 glTF sind Basismodule, Container, Terrain, Tunnel, Landepads, Felsen,
 *     Solarpanels, Windturbinen.
 */
export const SCHEMA = 'kfb.vehicle-source-list/1';

export const REGISTRY = Object.freeze({
  schema: 'kfb.asset-registry.v1',
  repo: 'georg-doc/kayfabizarro',
  commit: '34cde3f8f752d481a03c9714f1c3b3a8b2c15c46',
  commitTime: '2026-09-17T01:21:52+02:00',
  librarian: 'https://kayfabizarro.pages.dev/tools/asset_registry/librarian/',
});

const RAW = (repo, ref, path) => 'https://raw.githubusercontent.com/' + repo + '/' + ref + '/' + path.split('/').map(encodeURIComponent).join('/');

const reg = (name, path, extra = {}) => Object.assign({
  id: name, label: name, path,
  url: RAW(REGISTRY.repo, REGISTRY.commit, path),
  urlLatest: RAW(REGISTRY.repo, 'main', path),
  pin: REGISTRY.commit, source: 'registry',
}, extra);

/* kenney_car-kit · 4-Rad-Fahrzeuge, dep=complete (externe Farbtafel `Textures/colormap.png`). */
const CAR = 'media/3D_Assets/kenney_car-kit/Models/GLB format/';
/* kenney_toy-car-kit · Spielzeugmaßstab, dep=complete. */
const TOY = 'media/3D_Assets/kenney_toy-car-kit/Models/GLB format/';
/* kenney_racing-kit · Texturen eingebettet (dep=embedded). */
const RACE = 'media/3D_Assets/kenney_racing-kit/Models/GLTF format/';

export const GROUPS = [
  {
    id: 'car-kit', label: 'kenney-car-kit', note: 'Straßenfahrzeuge · Räder als eigene Modelle im Pack',
    rows: [
      reg('race', CAR + 'race.glb', { label: 'Race', bytes: 167272 }),
      reg('race-future', CAR + 'race-future.glb', { label: 'Race Future', bytes: 173164 }),
      reg('hatchback-sports', CAR + 'hatchback-sports.glb', { label: 'Hatchback Sports', bytes: 197804 }),
      reg('sedan-sports', CAR + 'sedan-sports.glb', { label: 'Sedan Sports', bytes: 177676 }),
      reg('kart-oobi', CAR + 'kart-oobi.glb', { label: 'Kart Oobi', bytes: 251516 }),
      reg('truck', CAR + 'truck.glb', { label: 'Truck', bytes: 176360 }),
      reg('van', CAR + 'van.glb', { label: 'Van', bytes: 175664 }),
      reg('police', CAR + 'police.glb', { label: 'Police', bytes: 195336 }),
      reg('taxi', CAR + 'taxi.glb', { label: 'Taxi', bytes: 175608 }),
      reg('suv', CAR + 'suv.glb', { label: 'SUV', bytes: 207572 }),
    ],
  },
  {
    id: 'toy-car-kit', label: 'kenney-toy-car-kit', note: 'Spielzeugmaßstab · passt zum Loop-Track desselben Packs',
    rows: [
      reg('vehicle-racer', TOY + 'vehicle-racer.glb', { label: 'Racer', bytes: 104328 }),
      reg('vehicle-racer-low', TOY + 'vehicle-racer-low.glb', { label: 'Racer Low', bytes: 103808 }),
      reg('vehicle-speedster', TOY + 'vehicle-speedster.glb', { label: 'Speedster', bytes: 103636 }),
      reg('vehicle-drag-racer', TOY + 'vehicle-drag-racer.glb', { label: 'Drag Racer', bytes: 104636 }),
      reg('vehicle-monster-truck', TOY + 'vehicle-monster-truck.glb', { label: 'Monster Truck', bytes: 121628 }),
      reg('vehicle-vintage-racer', TOY + 'vehicle-vintage-racer.glb', { label: 'Vintage Racer', bytes: 102156 }),
      reg('vehicle-truck', TOY + 'vehicle-truck.glb', { label: 'Truck', bytes: 103488 }),
      reg('vehicle-suv', TOY + 'vehicle-suv.glb', { label: 'SUV', bytes: 106724 }),
    ],
  },
  {
    id: 'racing-kit', label: 'kenney-racing-kit', note: 'Formel-Silhouette · Texturen eingebettet',
    rows: [
      reg('raceCarRed', RACE + 'raceCarRed.glb', { label: 'Race Car Red', bytes: 106064 }),
      reg('raceCarGreen', RACE + 'raceCarGreen.glb', { label: 'Race Car Green', bytes: 106068 }),
      reg('raceCarOrange', RACE + 'raceCarOrange.glb', { label: 'Race Car Orange', bytes: 106068 }),
      reg('raceCarWhite', RACE + 'raceCarWhite.glb', { label: 'Race Car White', bytes: 105864 }),
    ],
  },
  {
    id: 'space-base-bits', label: 'KayKit Space Base Bits · noch nicht ladbar', note: 'Quelle liegt in KFB-Stunt-Car-Race — von dort holt der Browser sie nicht',
    rows: [
      { id: 'spacetruck', label: 'Spacetruck', source: 'repo', pin: null, available: false,
        path: '3D Assets/KayKit_Space_Base_Bits_1.0_FREE/Assets/gltf/spacetruck.gltf', bytes: 10917,
        reason: 'RAW-Abruf auf georg-doc/KFB-Stunt-Car-Race schlägt im Browser fehl (gemessen 17.09.: fetch error auf main), und die Kopie im Projekt ist ohne ihre .bin-Datei unbrauchbar — die Werkzeuge legen die Binärpuffer nicht ab.',
        remedy: 'Als .glb nach kayfabizarro/media/3D_Assets legen: eine Datei ohne Sidecar, öffentlich abrufbar, und danach im Registry indiziert.',
        measured: 'gelesen in der Datei: 5 Netze, 4 benannte Radknoten (wheel_front_left/right, wheel_rear_left/right), Radradius 0,0877 u, Spurweite ±0,172, Radstand ±0,2136, Karosserie 0,489 × 0,893 u' },
      { id: 'spacetruck_large', label: 'Spacetruck Large', source: 'repo', pin: null, available: false,
        path: '3D Assets/KayKit_Space_Base_Bits_1.0_FREE/Assets/gltf/spacetruck_large.gltf',
        reason: 'dieselbe Ursache wie Spacetruck', remedy: 'als .glb ins Registry-Repo' },
      { id: 'spacetruck_trailer', label: 'Spacetruck Trailer', source: 'repo', pin: null, available: false,
        path: '3D Assets/KayKit_Space_Base_Bits_1.0_FREE/Assets/gltf/spacetruck_trailer.gltf',
        reason: 'dieselbe Ursache wie Spacetruck', remedy: 'als .glb ins Registry-Repo',
        note: 'gezogene Einheit — kein Antrieb, Nachlauf gehört zum Zugfahrzeug' },
    ],
  },
];

export const ALL = GROUPS.flatMap((g) => g.rows.map((r) => Object.assign({ group: g.id }, r)));
export const byId = (id) => ALL.find((r) => r.id === id) || null;
