// Island palettes. The first three are the Joyride world palettes 1:1 (donors/lab-track/track-look.v5.js · WORLDS),
// mapped onto island parts. Further biomes (snow, autumn, …) are derived from them later.

export interface IslandPalette {
  id: string;
  name: string;
  /** what the Joyride donor says about it */
  note: string;
  sky: string;
  /** top surface main colour + variation patches */
  top: string;
  top2: string;
  /** soft hills / dunes */
  hill: [string, string];
  /** beach + pond shore */
  sand: string;
  /** grass lip at the edge */
  rim: string;
  /** torn-earth underside, top band → tip */
  under: [string, string, string, string];
  rock: string;
  tower: [string, string];
  leaf: [string, string, string];
  trunk: string;
  cloud: string;
  water: string;
  /** footpath colour */
  path: string;
  /** Joyride street / track colours (for the connecting tracks later) */
  roadStreet: string;
  roadTrack: string;
  strang: string;
}

export const PALETTES: Record<string, IslandPalette> = {
  canyon: {
    id: 'canyon', name: 'A · Claybound-Canyon',
    note: 'Joyride A: oranger Strang auf violettem Tisch, orange Tafeltürme, grüne Kugelbäume',
    sky: '#96bede', top: '#8b68c7', top2: '#9877d0', hill: ['#a582d9', '#7b5bb8'], sand: '#e2d0bc', rim: '#7b5bb8',
    under: ['#5e4294', '#e8743a', '#d0602e', '#a8482a'], rock: '#e2d0bc', tower: ['#ef5a22', '#e8743a'],
    leaf: ['#1f7a3e', '#2f8a45', '#cdc666'], trunk: '#8a5a3a', cloud: '#e2d0bc', water: '#5983ac',
    path: '#e9d8c0', roadStreet: '#566680', roadTrack: '#3d4a60', strang: '#ef5a22',
  },
  bucht: {
    id: 'bucht', name: 'B · Bikini-Bucht',
    note: 'Joyride B: Sand, Aqua-Dünen, violette Korallentürme, Tangbäume mit rosa Blüten',
    sky: '#8fd6ec', top: '#f0cf7e', top2: '#f4d98f', hill: ['#5cc3bf', '#46adb2'], sand: '#fbe8b4', rim: '#e3bc66',
    under: ['#d9a85c', '#c9895a', '#b0724a', '#8e5a40'], rock: '#9a6fd0', tower: ['#9a6fd0', '#b08ae0'],
    leaf: ['#8fcf45', '#5fb84a', '#f7a1c4'], trunk: '#c9895a', cloud: '#fff4e2', water: '#3fc4d4',
    path: '#fff1d2', roadStreet: '#5f7f9a', roadTrack: '#3e5d7c', strang: '#f2708a',
  },
  otown: {
    id: 'otown', name: 'C · O-Town',
    note: 'Joyride C: Petrol-Boden, magentafarbene Wackeltürme, orange Kronen auf lila Stämmen, Mintgrün als Himmel',
    sky: '#a8d8b9', top: '#3aa596', top2: '#45b2a2', hill: ['#2f8f83', '#4cb5a5'], sand: '#f3ead8', rim: '#2f8f83',
    under: ['#277a70', '#6b4a8a', '#5a3c78', '#462e60'], rock: '#e0679f', tower: ['#c9508f', '#e0679f'],
    leaf: ['#f08a2c', '#f5b041', '#c9508f'], trunk: '#6b4a8a', cloud: '#f3ead8', water: '#5f7f9a',
    path: '#f3e6c8', roadStreet: '#6a6e8f', roadTrack: '#4a4d6e', strang: '#e9b53b',
  },
  wueste: {
    id: 'wueste', name: 'D · Pyramiden-Wüste',
    note: 'abgeleitet aus Joyride (Canyon-Orange + Bucht-Sand): Sanddünen, Sandstein-Pyramide, Oasen-Türkis, Palmen',
    sky: '#9fd0e6', top: '#eac47c', top2: '#f1d08c', hill: ['#ddaa60', '#cf9650'], sand: '#f7e2ad', rim: '#d6a455',
    under: ['#c98d4a', '#bb763d', '#9f6034', '#7d4729'], rock: '#e9b46e', tower: ['#f0c46f', '#dba553'],
    leaf: ['#5fb04a', '#3f9142', '#ef7a4f'], trunk: '#a8713f', cloud: '#fff4e2', water: '#34bccb',
    path: '#c8955a', roadStreet: '#7a6f8f', roadTrack: '#5a4f6e', strang: '#ef5a22',
  },
};

/**
 * Environment colour grammar (QA_RULEBOOK_ENVIRONMENT_R1 §0b.4): one colour family per MATERIAL ROLE, derived from the
 * natural shading of the biome and shifted into the island palette. The Joyride palettes above are moods for a track
 * world; their single `rock` swatch is a tower / cloud colour on three of four islands, so stone, grass and props get
 * their own derived roles here. Tones: [light, mid, dark].
 */
export interface EnvRoles {
  /** where it comes from, per role (shown on the colour-grammar sheet) */
  why: Record<string, string>;
  ground: [string, string, string];
  /** grass tufts: always the ground family, lighter and a little greener, never the leaf colour */
  grass: [string, string, string];
  /** stone / rock: from the island's own earth (underside, hills), never a tower colour */
  stone: [string, string, string];
  bark: [string, string, string];
  leaf: [string, string, string];
  bloom: [string, string, string];
  water: [string, string, string];
  /** props and the one accent family that leads to the landmark */
  accent: [string, string, string];
}

export const ENV_ROLES: Record<string, EnvRoles> = {
  wueste: {
    why: {
      ground: 'Sand der Insel (top, top2)', grass: 'Trockengras: Sand + Ocker, leicht oliv', stone: 'Sandstein-Ocker aus Dünen und Pyramide (hill, rock)',
      bark: 'Palmstamm: warmes Braun (trunk)', leaf: 'Palmen-Oliv bis Grün (leaf 0/1)', bloom: 'Kaktusblüte Koralle (leaf 2)',
      water: 'Oasentürkis (water)', accent: 'Pyramidenspitze hell + Koralle für Requisiten',
    },
    ground: ['#f1d08c', '#eac47c', '#d6a455'], grass: ['#e3cf86', '#c9b46a', '#a99550'], stone: ['#f0c98a', '#e2aa62', '#c48a4a'],
    bark: ['#c08a55', '#a8713f', '#7d5230'], leaf: ['#7cc05a', '#5fb04a', '#3f9142'], bloom: ['#f59a74', '#ef7a4f', '#c95a35'],
    water: ['#5fd0db', '#34bccb', '#1f95a6'], accent: ['#f8dc98', '#ef7a4f', '#c95a35'],
  },
  canyon: {
    why: {
      ground: 'Violetter Tisch (top, hill)', grass: 'Laubgrün entsättigt, Richtung Tisch-Violett verschoben (liest als Gras, fügt sich in den Boden)', stone: 'Orange Canyonfels aus Unterseite und Tafeltürmen (under 1–2, tower), wie Claybound',
      bark: 'Rinde Braun (trunk)', leaf: 'Kugelkronen Waldgrün (leaf 0/1)', bloom: 'Lime-Gelb (leaf 2)',
      water: 'Teich Schieferblau (water)', accent: 'Strang-Orange: Mühlrad, Requisiten',
    },
    ground: ['#a582d9', '#8b68c7', '#7b5bb8'], grass: ['#8aa486', '#6e8a6a', '#566e58'], stone: ['#f0955a', '#e8743a', '#c45a2c'],
    bark: ['#a6704a', '#8a5a3a', '#64402a'], leaf: ['#3a9a55', '#2f8a45', '#1f7a3e'], bloom: ['#e0da80', '#cdc666', '#a8a048'],
    water: ['#7aa0c4', '#5983ac', '#3f6690'], accent: ['#f2b632', '#ef5a22', '#c4441a'],
  },
  bucht: {
    why: {
      ground: 'Sand (top, sand)', grass: 'Dünengras: Sand + Aqua-Hauch', stone: 'Strandstein: warmer Ocker aus der Unterseite (under 1–2)',
      bark: 'Stamm Sandbraun (trunk)', leaf: 'Lime-Grün (leaf 0/1)', bloom: 'Tangblüten Rosa (leaf 2)',
      water: 'Lagune Aqua (water)', accent: 'Korallen-Violett (rock, tower): nur Akzent und Requisit, nicht Fels',
    },
    ground: ['#fbe8b4', '#f0cf7e', '#e3bc66'], grass: ['#dfe0a0', '#c4cf86', '#9fb46a'], stone: ['#e0b080', '#c9895a', '#a06a45'],
    bark: ['#dca070', '#c9895a', '#a06a45'], leaf: ['#a8dc60', '#8fcf45', '#5fb84a'], bloom: ['#fbc0d8', '#f7a1c4', '#e07aa6'],
    water: ['#6fd8e4', '#3fc4d4', '#2aa0b2'], accent: ['#b08ae0', '#9a6fd0', '#7a52b0'],
  },
  otown: {
    why: {
      ground: 'Petrol (top, hill)', grass: 'Petrol heller, Richtung Mint', stone: 'Schiefer: Lila-Grau aus der Unterseite (under 2–3), entsättigt',
      bark: 'Lila Stämme (trunk = Unterseiten-Lila)', leaf: 'Herbstkronen Orange (leaf 0/1)', bloom: 'Magenta (leaf 2)',
      water: 'Taubenblau (water)', accent: 'Magenta der Wackeltürme (tower, rock): nur Akzent und Requisit',
    },
    ground: ['#45b2a2', '#3aa596', '#2f8f83'], grass: ['#6cc6ae', '#4fb39e', '#3a9a88'], stone: ['#8e80a6', '#74688e', '#584e72'],
    bark: ['#83619f', '#6b4a8a', '#4f3568'], leaf: ['#f5b041', '#f08a2c', '#d06a1c'], bloom: ['#e07ab0', '#c9508f', '#a03a72'],
    water: ['#7f9fba', '#5f7f9a', '#46627c'], accent: ['#f08ab8', '#e0679f', '#c9508f'],
  },
};
