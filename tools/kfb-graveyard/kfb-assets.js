// ============================================================================
// kfb-assets.js — Pfad-SSOT für das Graveyard-Modul
// ----------------------------------------------------------------------------
// EINE Regel: kein Asset liegt im Projekt. Jeder Pfad löst zu einer kanonischen
// RAW-URL im KFB-Repo auf. Ein Consumer-Projekt kopiert nur Code (2 JS-Dateien),
// nie GLBs, Texturen, Skydomes oder Sounds.
//
// Stand der Repo-Wahrheit: 2026-08-04, gemessen am Live-Tree
// (media/3D_Assets/CATALOG/github_status.json + Direktabruf).
// ============================================================================

export const REPO = { owner: 'georg-doc', repo: 'kayfabizarro', ref: 'main', root: 'media/3D_Assets/' };

let _ref = REPO.ref;
let _bust = null;

/** Auf einen Commit/Tag pinnen (reproduzierbare Builds). setRef('65083e97…') */
export function setRef(ref) { _ref = ref || REPO.ref; }
/** Globaler Cache-Buster. Frisch gepushte Datei liefert 404? bust('2') anhängen. */
export function setCacheBust(v) { _bust = v == null ? null : String(v); }

export function rawBase() {
  return `https://raw.githubusercontent.com/${REPO.owner}/${REPO.repo}/${_ref}/${REPO.root}`;
}

/** raw('KFB/edge3.jpg') → volle RAW-URL (relativ zu media/3D_Assets/) */
export function raw(path) {
  const u = rawBase() + String(path).replace(/^\/+/, '');
  return _bust ? u + (u.includes('?') ? '&' : '?') + 'v=' + encodeURIComponent(_bust) : u;
}

// ---------------------------------------------------------------- Packs (live im Repo)
// Flache GLB_*-Packs liegen 1:1 im Repo-Root von media/3D_Assets/.
// Kenney-Kits mit Unterstruktur brauchen den vollen Präfix — deshalb steht er hier
// und nirgendwo sonst (naming_map aus github_status.json, verifiziert 2026-07-23).
export const PACKS = {
  graveyard:    'GLB_graveyard/',
  pets:         'GLB_cube-pets/',
  pirate:       'GLB_pirate/',
  hexagon:      'GLB_hexagon_kit/',
  miniChars:    'GLB_mini_chars/',
  blockyChars:  'GLB_blocky_chars/',
  blockChars:   'GLB_block_chars/',
  monsters:     'Ultimate Monsters Bundle-glb/',
  nature:       'kenney_nature-kit/Models/GLTF format/',
  graveyardKit: 'kenney_graveyard-kit_5.0/Models/GLB format/',
  survival:     'kenney_survival-kit/Models/GLB format/',
  fantasyTown:  'kenney_fantasy-town-kit_2.0/Models/GLB format/',
};

/** glb('graveyard','gravestone-round') → RAW-URL des Modells */
export function glb(pack, name) {
  const p = PACKS[pack] || pack;
  return raw(p + String(name).replace(/\.glb$/i, '') + '.glb');
}

// Packs, die NICHT (oder nur als Teilmenge) im Repo liegen — nicht per RAW adressierbar.
// Wer sie braucht, muss sie erst pushen; siehe docs/ASSET_PATHS.md.
export const PACKS_LOCAL_ONLY = [
  'kenney_building-kit', 'kenney_castle-kit', 'kenney_factory-kit_3.0', 'kenney_furniture-kit',
  'kenney_modular-buildings', 'kenney_modular-cave-kit_1.0', 'kenney_modular-dungeon-kit_1.0',
  'kenney_prototype-kit', 'kenney_tower-defense-kit', 'kenney_coaster-kit', 'Dice',
  'kenney_city-kit-commercial', 'kenney_city-kit-industrial', 'kenney_city-kit-suburban', 'kenney_holiday-kit',
];
export const PACKS_PARTIAL = {
  'kenney_mini-arcade': 'GLB_mini_arcade/ (2 von 20)',
  'kenney_mini-arena': 'GLB_mini_arena/ (1 von 22)',
  'kenney_mini-dungeon': 'GLB_mini_dungeon/ (2 von 25)',
  'kenney_mini-market': 'GLB_mini_market/ (1 von 20)',
  'kenney_platformer-kit': 'GLB_platformer/ (5 von 153)',
};

// ---------------------------------------------------------------- Code (kanonische Spiegel)
// Der Pet-Stack ist Code, nicht Asset — das Modul lädt ihn per dynamischem Import:
// erst neben sich (falls das Consumer-Projekt eine Kopie hat), sonst von hier.
export const CODE = {
  petLibrary: raw('build/pet-library.v6.js'),
  eyeRig:     raw('build/pet-eye-rig.v5.js'),
  petMotion:  raw('build/pet-motion.v2.js'),
  petFace:    raw('build/pet-face.v1.js'),
};

// ---------------------------------------------------------------- Daten / Contracts
export const DATA = {
  petContract: raw('pet-LIBRARY.json'),   // Aussehen-Contract v0.4.x (live im Repo)
  motion:      raw('motion-LIBRARY.json'),
  jukebox:     raw('Sounds/jukebox.json'),
  // Kanon seit 2026-09-24: tools/kfb-graveyard/postmortems.json im KFB-Repo.
  postmortems: 'https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/tools/kfb-graveyard/postmortems.json',
};

export const SKY = { a: raw('skydome_a.webp'), b: raw('skydome_b.webp') };

export const TEX = {
  edge1: raw('KFB/edge1.png'), edge2: raw('KFB/edge2.png'), edge3: raw('KFB/edge3.jpg'),
  noise: raw('KFB/noise.png'), alpha: raw('KFB/alphaMap.jpg'),
  brickDiffuse: raw('KFB/brick_diffuse.jpg'), brickBump: raw('KFB/brick_bump.jpg'),
  brickRoughness: raw('KFB/brick_roughness.jpg'),
  water: raw('KFB/water.jpg'), waterDuDv: raw('KFB/waterdudv.jpg'), waterNormals: raw('KFB/waternormals.jpg'),
  colormapGraveyard: raw('GLB_graveyard/Textures/colormap.png'),
  colormapPets: raw('GLB_cube-pets/Textures/colormap.png'),
};

/** three.js-Importmap, die dieses Modul erwartet (ein Build, klassisches WebGL). */
export const THREE_IMPORTMAP = {
  imports: {
    'three': 'https://unpkg.com/three@0.160.0/build/three.module.js',
    'three/addons/': 'https://unpkg.com/three@0.160.0/examples/jsm/',
  },
};

export default { REPO, PACKS, PACKS_LOCAL_ONLY, PACKS_PARTIAL, CODE, DATA, SKY, TEX, THREE_IMPORTMAP, raw, rawBase, glb, setRef, setCacheBust };
