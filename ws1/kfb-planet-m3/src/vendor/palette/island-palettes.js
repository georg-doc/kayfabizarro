const PALETTES = {
  canyon: {
    id: "canyon",
    name: "A \xB7 Claybound-Canyon",
    note: "Joyride A: oranger Strang auf violettem Tisch, orange Tafelt\xFCrme, gr\xFCne Kugelb\xE4ume",
    sky: "#96bede",
    top: "#8b68c7",
    top2: "#9877d0",
    hill: ["#a582d9", "#7b5bb8"],
    sand: "#e2d0bc",
    rim: "#7b5bb8",
    under: ["#5e4294", "#e8743a", "#d0602e", "#a8482a"],
    rock: "#e2d0bc",
    tower: ["#ef5a22", "#e8743a"],
    leaf: ["#1f7a3e", "#2f8a45", "#cdc666"],
    trunk: "#8a5a3a",
    cloud: "#e2d0bc",
    water: "#5983ac",
    path: "#e9d8c0",
    roadStreet: "#566680",
    roadTrack: "#3d4a60",
    strang: "#ef5a22"
  },
  bucht: {
    id: "bucht",
    name: "B \xB7 Bikini-Bucht",
    note: "Joyride B: Sand, Aqua-D\xFCnen, violette Korallent\xFCrme, Tangb\xE4ume mit rosa Bl\xFCten",
    sky: "#8fd6ec",
    top: "#f0cf7e",
    top2: "#f4d98f",
    hill: ["#5cc3bf", "#46adb2"],
    sand: "#fbe8b4",
    rim: "#e3bc66",
    under: ["#d9a85c", "#c9895a", "#b0724a", "#8e5a40"],
    rock: "#9a6fd0",
    tower: ["#9a6fd0", "#b08ae0"],
    leaf: ["#8fcf45", "#5fb84a", "#f7a1c4"],
    trunk: "#c9895a",
    cloud: "#fff4e2",
    water: "#3fc4d4",
    path: "#fff1d2",
    roadStreet: "#5f7f9a",
    roadTrack: "#3e5d7c",
    strang: "#f2708a"
  },
  otown: {
    id: "otown",
    name: "C \xB7 O-Town",
    note: "Joyride C: Petrol-Boden, magentafarbene Wackelt\xFCrme, orange Kronen auf lila St\xE4mmen, Mintgr\xFCn als Himmel",
    sky: "#a8d8b9",
    top: "#3aa596",
    top2: "#45b2a2",
    hill: ["#2f8f83", "#4cb5a5"],
    sand: "#f3ead8",
    rim: "#2f8f83",
    under: ["#277a70", "#6b4a8a", "#5a3c78", "#462e60"],
    rock: "#e0679f",
    tower: ["#c9508f", "#e0679f"],
    leaf: ["#f08a2c", "#f5b041", "#c9508f"],
    trunk: "#6b4a8a",
    cloud: "#f3ead8",
    water: "#5f7f9a",
    path: "#f3e6c8",
    roadStreet: "#6a6e8f",
    roadTrack: "#4a4d6e",
    strang: "#e9b53b"
  },
  wueste: {
    id: "wueste",
    name: "D \xB7 Pyramiden-W\xFCste",
    note: "abgeleitet aus Joyride (Canyon-Orange + Bucht-Sand): Sandd\xFCnen, Sandstein-Pyramide, Oasen-T\xFCrkis, Palmen",
    sky: "#9fd0e6",
    top: "#eac47c",
    top2: "#f1d08c",
    hill: ["#ddaa60", "#cf9650"],
    sand: "#f7e2ad",
    rim: "#d6a455",
    under: ["#c98d4a", "#bb763d", "#9f6034", "#7d4729"],
    rock: "#e9b46e",
    tower: ["#f0c46f", "#dba553"],
    leaf: ["#5fb04a", "#3f9142", "#ef7a4f"],
    trunk: "#a8713f",
    cloud: "#fff4e2",
    water: "#34bccb",
    path: "#c8955a",
    roadStreet: "#7a6f8f",
    roadTrack: "#5a4f6e",
    strang: "#ef5a22"
  },
  kfb_town: {
    id: "kfb_town",
    name: "KFB Town (R2C burg)",
    note: "R2D v0 Biom \u201EBurg\u201C (hex-archipel.r2c.js PAL.burg): sattes Wiesengr\xFCn, Pflaster aus hellem Kalkstein, Erde und Fels warmbraun",
    sky: "#96bede",
    top: "#7cba48",
    top2: "#86c452",
    hill: ["#6fae40", "#6aa83c"],
    sand: "#e3c98f",
    rim: "#5f9a38",
    under: ["#8f6040", "#7a5236", "#6e4630", "#5a3a28"],
    rock: "#9b6b4a",
    tower: ["#e8dcc6", "#cfc0a4"],
    leaf: ["#2a8a45", "#3a9a55", "#e0da80"],
    trunk: "#8a5a3a",
    cloud: "#fff4e2",
    water: "#5aa6d6",
    path: "#e8dcc6",
    roadStreet: "#566680",
    roadTrack: "#3d4a60",
    strang: "#ef5a22"
  },
  protopia: {
    id: "protopia",
    name: "Protopia (R2C protopia)",
    note: "R2D v0 Biom \u201EProtopia\u201C (hex-archipel.r2c.js PAL.protopia): Bergwiese gelbgr\xFCn, Ocker-Sand, rotbrauner Fels",
    sky: "#96bede",
    top: "#6aae3a",
    top2: "#88b840",
    hill: ["#5f9f34", "#58932f"],
    sand: "#d9b04a",
    rim: "#58932f",
    under: ["#8a5634", "#764628", "#643a22", "#52301c"],
    rock: "#8a5634",
    tower: ["#e6d3a8", "#c9b07a"],
    leaf: ["#4f8f2f", "#5fa03a", "#f2c94c"],
    trunk: "#7a4a2a",
    cloud: "#fff4e2",
    water: "#4fa3c9",
    path: "#e6d3a8",
    roadStreet: "#5f6f7a",
    roadTrack: "#45525c",
    strang: "#ef5a22"
  }
};
const ASPHALT_DEFAULT = ["#636d8a", "#545e7a", "#454e66"];
const MASONRY_DEFAULT = ["#e6d5b7", "#dccdb9", "#d2bc9a", "#b49d7e"];
const BANDE_DEFAULT = { bande_rot: "#d73d30", bande_weiss: "#eee9dc" };
const ASPHALT_WHY = "Fahrbahn: RKIT J17 road clay #545e7a (k\xFChles Schiefer-Blaugrau, hebt sich von warmem Pflaster und Kalkstein ab)";
const ENV_ROLES = {
  wueste: {
    why: {
      ground: "Sand der Insel (top, top2)",
      grass: "Trockengras: Sand + Ocker, leicht oliv",
      stone: "Sandstein-Ocker aus D\xFCnen und Pyramide (hill, rock)",
      bark: "Palmstamm: warmes Braun (trunk)",
      leaf: "Palmen-Oliv bis Gr\xFCn (leaf 0/1)",
      bloom: "Kaktusbl\xFCte Koralle (leaf 2)",
      water: "Oasent\xFCrkis (water)",
      accent: "Pyramidenspitze hell + Koralle f\xFCr Requisiten"
    },
    ground: ["#f1d08c", "#eac47c", "#d6a455"],
    grass: ["#e3cf86", "#c9b46a", "#a99550"],
    stone: ["#f0c98a", "#e2aa62", "#c48a4a"],
    bark: ["#c08a55", "#a8713f", "#7d5230"],
    leaf: ["#7cc05a", "#5fb04a", "#3f9142"],
    bloom: ["#f59a74", "#ef7a4f", "#c95a35"],
    water: ["#5fd0db", "#34bccb", "#1f95a6"],
    accent: ["#f8dc98", "#ef7a4f", "#c95a35"],
    sand: ["#fbecc4", "#f7e2ad", "#e0c48a"],
    paved: ["#d8a872", "#c8955a", "#a87a44"],
    earth: ["#c98d4a", "#bb763d", "#9f6034"]
  },
  canyon: {
    why: {
      ground: "Violetter Tisch (top, hill)",
      grass: "Laubgr\xFCn ents\xE4ttigt, Richtung Tisch-Violett verschoben (liest als Gras, f\xFCgt sich in den Boden)",
      stone: "Orange Canyonfels aus Unterseite und Tafelt\xFCrmen (under 1\u20132, tower), wie Claybound",
      bark: "Rinde Braun (trunk)",
      leaf: "Kugelkronen Waldgr\xFCn (leaf 0/1)",
      bloom: "Lime-Gelb (leaf 2)",
      water: "Teich Schieferblau (water)",
      accent: "Strang-Orange: M\xFChlrad, Requisiten"
    },
    ground: ["#a582d9", "#8b68c7", "#7b5bb8"],
    grass: ["#8aa486", "#6e8a6a", "#566e58"],
    stone: ["#f0955a", "#e8743a", "#c45a2c"],
    bark: ["#a6704a", "#8a5a3a", "#64402a"],
    leaf: ["#3a9a55", "#2f8a45", "#1f7a3e"],
    bloom: ["#e0da80", "#cdc666", "#a8a048"],
    water: ["#7aa0c4", "#5983ac", "#3f6690"],
    accent: ["#f2b632", "#ef5a22", "#c4441a"],
    sand: ["#ece0cf", "#e2d0bc", "#c9b49c"],
    paved: ["#f1e4d0", "#e9d8c0", "#d0bca0"],
    earth: ["#e8743a", "#d0602e", "#a8482a"]
  },
  bucht: {
    why: {
      ground: "Sand (top, sand)",
      grass: "D\xFCnengras: Sand + Aqua-Hauch",
      stone: "Strandstein: warmer Ocker aus der Unterseite (under 1\u20132)",
      bark: "Stamm Sandbraun (trunk)",
      leaf: "Lime-Gr\xFCn (leaf 0/1)",
      bloom: "Tangbl\xFCten Rosa (leaf 2)",
      water: "Lagune Aqua (water)",
      accent: "Korallen-Violett (rock, tower): nur Akzent und Requisit, nicht Fels"
    },
    ground: ["#fbe8b4", "#f0cf7e", "#e3bc66"],
    grass: ["#dfe0a0", "#c4cf86", "#9fb46a"],
    stone: ["#e0b080", "#c9895a", "#a06a45"],
    bark: ["#dca070", "#c9895a", "#a06a45"],
    leaf: ["#a8dc60", "#8fcf45", "#5fb84a"],
    bloom: ["#fbc0d8", "#f7a1c4", "#e07aa6"],
    water: ["#6fd8e4", "#3fc4d4", "#2aa0b2"],
    accent: ["#b08ae0", "#9a6fd0", "#7a52b0"],
    sand: ["#fdf2d2", "#fbe8b4", "#e8cf90"],
    paved: ["#fff6e2", "#fff1d2", "#e8d6b0"],
    earth: ["#c9895a", "#b0724a", "#8e5a40"]
  },
  otown: {
    why: {
      ground: "Petrol (top, hill)",
      grass: "Petrol heller, Richtung Mint",
      stone: "Schiefer: Lila-Grau aus der Unterseite (under 2\u20133), ents\xE4ttigt",
      bark: "Lila St\xE4mme (trunk = Unterseiten-Lila)",
      leaf: "Herbstkronen Orange (leaf 0/1)",
      bloom: "Magenta (leaf 2)",
      water: "Taubenblau (water)",
      accent: "Magenta der Wackelt\xFCrme (tower, rock): nur Akzent und Requisit"
    },
    ground: ["#45b2a2", "#3aa596", "#2f8f83"],
    grass: ["#6cc6ae", "#4fb39e", "#3a9a88"],
    stone: ["#8e80a6", "#74688e", "#584e72"],
    bark: ["#83619f", "#6b4a8a", "#4f3568"],
    leaf: ["#f5b041", "#f08a2c", "#d06a1c"],
    bloom: ["#e07ab0", "#c9508f", "#a03a72"],
    water: ["#7f9fba", "#5f7f9a", "#46627c"],
    accent: ["#f08ab8", "#e0679f", "#c9508f"],
    sand: ["#f8f1e4", "#f3ead8", "#dccfb6"],
    paved: ["#f8eed8", "#f3e6c8", "#d8c8a4"],
    earth: ["#6b4a8a", "#5a3c78", "#462e60"]
  }
};
ENV_ROLES.kfb_town = {
  why: {
    ground: "Wiese der Burg-Anh\xF6he (R2C burg grass, grass2 hell, hill dunkel)",
    grass: "Grasb\xFCschel: Wiese heller, Lippe dunkler (R2C lip)",
    stone: "Burgfels: heller warmer Kalkstein (Steinbruch f\xFCr Burg und Mauern; R2C paved verwandt), damit Wand und Fels sich von der Erde abheben",
    bark: "Rinde Braun",
    leaf: "Laub Waldgr\xFCn (R2C LEAF burg)",
    bloom: "Lime-Gelb",
    water: "Teichblau (R2C water)",
    accent: "Burg-Rot aus dem Strang",
    sand: "Bankett und Ufer: Weg-Sand (R2C sand)",
    paved: "Pflaster der Stadt: heller Kalkstein (R2C paved)",
    earth: "Erde unter der Grasnarbe: Braun aus dem Fels, dunkler"
  },
  ground: ["#86c452", "#7cba48", "#6aa83c"],
  grass: ["#8cc95a", "#6fae40", "#5f9a38"],
  stone: ["#d2c3a4", "#b8a684", "#93805f"],
  bark: ["#a6704a", "#8a5a3a", "#64402a"],
  leaf: ["#3a9a55", "#2a8a45", "#1f7a3e"],
  bloom: ["#e0da80", "#cdc666", "#a8a048"],
  water: ["#7cbce2", "#5aa6d6", "#3f86b8"],
  accent: ["#f2b632", "#ef5a22", "#c4441a"],
  sand: ["#ecd7a6", "#e3c98f", "#c9ad72"],
  paved: ["#f1e8d6", "#e8dcc6", "#cfc0a4"],
  earth: ["#a8754f", "#8f6040", "#6e4630"]
};
ENV_ROLES.protopia = {
  why: {
    ground: "Bergwiese (R2C protopia grass, grass2 hell, hill dunkel)",
    grass: "Grasb\xFCschel: Wiese heller, Lippe dunkler (R2C lip)",
    stone: "Grauer Bergfels der jungen Gipfel (R2C rock war braun wie die Erde und las sich nicht als Fels)",
    bark: "Rinde Braun",
    leaf: "Laub Gr\xFCn (R2C LEAF protopia)",
    bloom: "Ocker-Gelb",
    water: "Bergsee-Blau (R2C water)",
    accent: "Werkstatt-Orange",
    sand: "Ocker-Sand am Bankett und Ufer (R2C sand)",
    paved: "Pflaster: heller Sandstein (R2C paved)",
    earth: "Erde unter der Grasnarbe: Rotbraun aus dem Fels, dunkler"
  },
  ground: ["#88b840", "#6aae3a", "#5f9f34"],
  grass: ["#94c450", "#6aae3a", "#58932f"],
  stone: ["#a7a097", "#857d73", "#645d56"],
  bark: ["#946040", "#7a4a2a", "#5a361e"],
  leaf: ["#6fae48", "#5fa03a", "#4f8f2f"],
  bloom: ["#f5d870", "#f2c94c", "#d0a830"],
  water: ["#74bede", "#4fa3c9", "#3a84a8"],
  accent: ["#f5a050", "#e8742a", "#c05a1c"],
  sand: ["#e6c46a", "#d9b04a", "#b8923a"],
  paved: ["#f0e2c0", "#e6d3a8", "#c9b48a"],
  earth: ["#9a6a48", "#7e5236", "#5e3c26"]
};
function r2dPal(paletteId) {
  const r = ENV_ROLES[paletteId] ?? ENV_ROLES.canyon;
  return { grass: r.ground[1], grass2: r.ground[0], hill: r.ground[2], lip: r.grass[2], sand: r.sand[1], paved: r.paved[1], rock: r.stone[1], earth: r.earth[1], earthDark: r.earth[2], water: r.water[1] };
}
const R2D_BIOMES = {
  kfb_town: { label: "Burg (R2D burg)", roll: [0.6, 2], terrace: 0, edge: { cap: 1.4, ov: 0.45 }, scholle: "D" },
  protopia: { label: "Protopia (R2D protopia)", roll: [0.6, 2], terrace: 0, edge: { cap: 1.4, ov: 0.45 }, scholle: "B" },
  // Wald: tapering V (Formblatt: schmal-hoch-zackig)
  canyon: { label: "Canyon (wie burg)", roll: [0.6, 2], terrace: 0, edge: { cap: 1.4, ov: 0.45 }, scholle: "C" },
  bucht: { label: "Bucht (wie utopia)", roll: [1, 3.5], terrace: 0, edge: { cap: 1.6, ov: 0.5 }, scholle: "E" },
  otown: { label: "O-Town (wie burg)", roll: [0.6, 2], terrace: 0, edge: { cap: 1.4, ov: 0.45 }, scholle: "B" },
  wueste: { label: "W\xFCste (wie utopia)", roll: [1, 3.5], terrace: 0, edge: { cap: 1.6, ov: 0.5 }, scholle: "F" }
};
function roleColor(paletteId, role) {
  const r = ENV_ROLES[paletteId] ?? ENV_ROLES.canyon, [k, i] = role.split(".");
  if (k === "asphalt") return (r.asphalt ?? ASPHALT_DEFAULT)[Number(i ?? 1)] ?? ASPHALT_DEFAULT[1];
  if (k === "masonry") return (r.masonry ?? MASONRY_DEFAULT)[Number(i ?? 1)] ?? MASONRY_DEFAULT[1];
  if (k === "bande_rot" || k === "bande_weiss") return BANDE_DEFAULT[k];
  return (r[k] ?? r.earth)[Number(i ?? 1)] ?? r.earth[1];
}
export {
  ASPHALT_DEFAULT,
  ASPHALT_WHY,
  BANDE_DEFAULT,
  ENV_ROLES,
  MASONRY_DEFAULT,
  PALETTES,
  R2D_BIOMES,
  r2dPal,
  roleColor
};
