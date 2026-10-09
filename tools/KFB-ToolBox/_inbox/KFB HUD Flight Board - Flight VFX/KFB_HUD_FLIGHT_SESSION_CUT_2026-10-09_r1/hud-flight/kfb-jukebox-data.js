/* KFB Rucksack + Jukebox · Daten R1
 * Nur Daten und Auflösung. Musik spielt der KFB-Audio-Owner (song-transport.js), Modelle lädt der Verbraucher.
 *
 * Quellen (gelesen, nicht kopiert):
 *   Biom-Farben  tools/KFB-ToolBox/_inbox/KFB_OPEN_WORLD_STYLEGUIDE_2026-10-07/00_referenzblatt/01-farbpaletten.jpg
 *                → Abschnitt „HEX-INSELN · lab-world/hex-archipel.r2c.js → PAL“ (Werte vom Blatt abgelesen)
 *   Titel        tools/KFB-ToolBox/_inbox/KFB_Resident_Atlas_S9/S40-disco-rotation/data/disco-playlist-01.json (Rotation 01)
 *                media/3D_Assets/Sounds/jukebox.json (1.0.0, 2026-07-18)
 *   Rucksack     Golden Journey Beat 4: 20 Slots, Taxi-Schlüssel, KayKit-Rucksack (Hoarder_Backpack oder Orc_Backpack)
 */

export const REPO = 'georg-doc/kayfabizarro';
export const rawUrl = (commit, path) => `https://raw.githubusercontent.com/${REPO}/${commit}/${path.split('/').map(encodeURIComponent).join('/')}`;

/* ---------- Biome · vier Hex-Inseln ----------
 * pal: 1:1 vom Referenzblatt. hud: Vorschlag, welche zwei Töne das HUD treiben (createHud({ palette: biome.hud })).
 * Regel: primary = mittlerer Grün-/Grundton der Insel (trägt Plaketten), accent = Wasser oder Sand, je nachdem was sich abhebt. */
export const BIOMES = {
  burg: {
    id: 'burg', name: 'Burg · King Kayfabian', short: 'BURG', role: 'Town-Hub',
    pal: { grass: '#7cba48', grass2: '#6aa83c', paved: '#e8dcc6', sand: '#e3c98f', rock: '#9b6b4a', lip: '#5f9a38', hill: '#6fae40', water: '#5aa6d6' },
    hud: { primary: '#6aa83c', accent: '#5aa6d6' }, sky: ['#A9CBE0', '#D9E6E6', '#F3E3CF']
  },
  utopia: {
    id: 'utopia', name: 'A · Utopia', short: 'UTOPIA', role: 'Forget Utopia',
    pal: { grass: '#a6d7a8', grass2: '#bfe3b4', paved: '#f3ecdf', sand: '#f1dcb5', rock: '#cdb59a', lip: '#8cc497', hill: '#9ccf9e', water: '#7cc4e4' },
    hud: { primary: '#8cc497', accent: '#7cc4e4' }, sky: ['#BFE3F0', '#E6F2EC', '#F6EEDD']
  },
  dystopia: {
    id: 'dystopia', name: 'B · Dystopia', short: 'DYSTOPIA', role: 'Ignore Dystopia',
    pal: { grass: '#9a74cc', grass2: '#8a66bd', paved: '#d4c8da', sand: '#b591d9', rock: '#6e4a3a', lip: '#7a58aa', hill: '#8b66c2', water: '#5f8fae' },
    hud: { primary: '#8a66bd', accent: '#5f8fae' }, sky: ['#8E86B8', '#C9BCD8', '#E9D6D2']
  },
  protopia: {
    id: 'protopia', name: 'C · Protopia', short: 'PROTOPIA', role: 'Embrace Protopia',
    pal: { grass: '#6aae3a', grass2: '#88b840', paved: '#e6d3a8', sand: '#d9b04a', rock: '#8a5634', lip: '#58932f', hill: '#5f9f34', water: '#4fa3c9' },
    hud: { primary: '#58932f', accent: '#d9b04a' }, sky: ['#B3D2DE', '#E2E8D8', '#F4E2C2']
  }
};
export const BIOME_ORDER = ['burg', 'dystopia', 'utopia', 'protopia'];

/* ---------- Titel ----------
 * artist: wer im Display steht. Eigene Produktionen = „KFB“. Fremde Assets bekommen hier Künstler + credit. */
const RT2 = 'media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/';
const C_RT2 = '5f268e806a4f48b68944ce025ee8f1d2837a0590';
const C_V1 = 'f8f8f1fd72f76220688af78edbf9703086dac972';
export const TRACKS = {
  'rubbish-groove': { title: 'Rubbish Groove', artist: 'KFB', style: 'Beweis-Uhr', bpm: 100, path: RT2 + 'Rubbish Groove 2min A extend 01.mp3', commit: 'c19e291e78463a095e1b41802d37e4ec236cd897' },
  'skeleton-shuffle': { title: 'Skeleton Shuffle Deluxe 01', artist: 'KFB', style: 'Psych-Disco-Funk', bpm: 111.8, path: RT2 + 'Skeleton Shuffle Deluxe 01.mp3', commit: C_RT2 },
  'orc-cumbia': { title: 'Orc Cumbia Wobble 01', artist: 'KFB', style: 'Digital Chicha', bpm: 97.61, path: RT2 + 'Orc Cumbia Wobble 01.mp3', commit: C_RT2 },
  'demon-afro-strut': { title: 'Demon Lord Afro-Strut 01', artist: 'KFB', style: 'Psych-Afrobeat', bpm: 103.18, path: RT2 + 'Demon Lord Afro-Strut 01.mp3', commit: C_RT2 },
  'witch-hat-acid': { title: 'Witch Hat Acid Picnic 01', artist: 'KFB', style: 'Acid House', bpm: 125.45, path: RT2 + 'Witch Hat Acid Picnic 01.mp3', commit: C_RT2 },
  'toy-soldier-brass': { title: 'Toy Soldier Brass Riot 01', artist: 'KFB', style: 'Balkan-Electro-Swing', bpm: 130.28, path: RT2 + 'Toy Soldier Brass Riot 01.mp3', commit: C_RT2 },
  'desert-preacher': { title: 'KFB Desert Preacher 01', artist: 'KFB', style: 'Rockabilly · Two-Beat', bpm: 107.01, path: RT2 + 'KFB Desert Preacher 01.mp3', commit: C_RT2 },
  'brave-new-world-news': { title: 'KFB BraveNewWorldNews 01', artist: 'KFB', style: '70s-TV-Werbung', bpm: 116.78, path: RT2 + 'KFB BraveNewWorldNews 01.mp3', commit: C_RT2 },
  van_freestyle_v2_1: { title: 'KFB Van Freestyle v2-1', artist: 'KFB', style: 'Van Freestyle', path: 'media/3D_Assets/Sounds/KFB_Van_Freestyle_v2-1.mp3', commit: C_V1 },
  kfb_shepard_coaster: { title: 'KFB Shepards Coaster', artist: 'FrizzleTune', style: 'Coaster', bpm: 90, path: 'media/3D_Assets/Sounds/KFB_Shepards_Coaster-SONG-Bob_01_A.mp3', commit: C_V1 },
  kayfabizarro_02_2: { title: 'Kayfabizarro 02.2', artist: 'KFB', style: 'Hymne', path: 'media/3D_Assets/Sounds/Kayfabizarro 02.2.mp3', commit: C_V1 },
  kayfabizarro_06_hook: { title: 'Kayfabizarro 06 HOOK song', artist: 'KFB', style: 'A+++ Cover', path: 'media/3D_Assets/Sounds/Kayfabizarro 06 HOOK song - A+++ COVER 4.0.mp3', commit: C_V1 }
};
for (const [id, t] of Object.entries(TRACKS)) { t.id = id; t.url = rawUrl(t.commit, t.path); }

/* ---------- Biom-Radio · Vorschlag ----------
 * Fest gesetzt ist nur Dystopia → Demon Lord Afro-Strut (Golden Journey Beat 6). Alles andere ist ein Startvorschlag. */
export const BIOME_STATIONS = {
  burg: { name: 'Radio Kayfabian', tracks: ['rubbish-groove', 'desert-preacher', 'toy-soldier-brass'] },
  dystopia: { name: 'Demon FM', tracks: ['demon-afro-strut', 'skeleton-shuffle', 'orc-cumbia'] },
  utopia: { name: 'Utopia Inc. Radio', tracks: ['brave-new-world-news', 'witch-hat-acid'] },
  protopia: { name: 'Feldfunk', tracks: ['van_freestyle_v2_1', 'kfb_shepard_coaster', 'kayfabizarro_02_2'] }
};

/* ---------- Kassetten · gesammelte Playlists (Knet-Platzhalter, kein Tape-Modell gefunden) ---------- */
export const TAPES = [
  { id: 'tape.dystopia-party', label: 'Demon Lord Party', color: '#8a66bd', tracks: ['demon-afro-strut', 'skeleton-shuffle', 'orc-cumbia'] },
  { id: 'tape.roadtrip', label: 'Roadtrip', color: '#d9b04a', tracks: ['desert-preacher', 'rubbish-groove', 'kayfabizarro_06_hook'] },
  { id: 'tape.blank', label: 'Leerkassette', color: '#E8DCC6', tracks: [], blank: true }
];

/* ---------- Items · Modelle aus KayKit / Tiny Treats ---------- */
const C_IT = 'f8f8f1fd72f76220688af78edbf9703086dac972';
export const PACK_MODEL = {
  id: 'backpack.hoarder', name: 'Hoarder-Rucksack', pack: 'KayKit Mystery Series 6 · Hoarder',
  path: 'media/3D_Assets/KayKit_Mystery_Series6/8 - February 2026 - Hoarder/gltf/Hoarder_Backpack.gltf', commit: C_IT,
  alt: 'Orc_Backpack (KayKit) als zweiter Kandidat laut Golden Journey'
};
export const ITEMS = {
  'item.taxi-key.01': { name: 'Taxi-Schlüssel', note: 'Vom Driver. Öffnet das Taxi.', pack: 'KayKit Dungeon Pack 1.1 · key', path: 'media/3D_Assets/KayKit_Dungeon_Pack_1.1_FREE 2/Assets/gltf/key.gltf', commit: C_IT, spin: [0, 0, 0.62], view: { rotY: 0.18, tilt: 0.12, zoom: 1.12 } },
  'item.donut.01': { name: 'Donut', note: 'Süßigkeit. Ein Bissen Fluff.', pack: 'Tiny Treats Baked Goods · donut_pink', path: 'media/3D_Assets/Tiny_Treats_Baked_Goods_1.0_FREE/Assets/gltf/donut_pink.gltf', commit: C_IT, spin: [0, 0, 0], view: { rotY: 0.3, tilt: 0.62, zoom: 1.1 } },
  'item.radio.01': { name: 'Kassettenradio', note: 'Kassette einlegen, das HUD-Radio spielt sie.', pack: 'Tiny Treats Pleasant Picnic · radio', path: 'media/3D_Assets/Tiny_Treats_Pleasant_Picnic_1.0_FREE/Assets/gltf/radio.gltf', commit: C_IT, spin: [0, 0, 0], view: { rotY: -0.38, tilt: 0.16, zoom: 1.05 }, deck: true },
  'item.map.01': { name: 'Karte', note: 'Die vier Inseln, gerollt.', pack: 'KayKit RPG Tools Bits · map_rolled', path: 'media/3D_Assets/KayKit_RPGToolsBits_1.0_FREE/Assets/gltf/map_rolled.gltf', commit: C_IT, spin: [0, Math.PI / 2, 0.38], view: { rotY: 0.12, tilt: 0.3, zoom: 1.05 } }
};
for (const it of [PACK_MODEL, ...Object.values(ITEMS)]) it.url = rawUrl(it.commit, it.path);
for (const [id, it] of Object.entries(ITEMS)) it.id = id;

export const BAG_SLOTS = 20;
/* Startinhalt der Tafel: vier Items, drei Kassetten, Rest leer */
export const DEFAULT_BAG = ['item.taxi-key.01', 'item.radio.01', 'item.donut.01', 'item.map.01', 'tape.dystopia-party', 'tape.roadtrip', 'tape.blank'];
