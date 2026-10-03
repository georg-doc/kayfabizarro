/* KFB WorldDesign Lab v1 · Himmel (unabhängige Vergleichsschicht wie das Licht)
   Keine eigene Himmelsmalerei — die Varianten kommen aus ihren Ownern:
   · REALISTISCH   three.js `Sky` (examples/jsm/objects/Sky.js, Preetham-Modell), Sonne aus dem
                   Schlüssellicht. Braucht Tonemapping — ohne ACES überstrahlt er (benannt).
   · SHADER S / A  `createSkydome()` aus `travel/KFB Travel Combat v25/terrain-v25/skydome-shader.js`
                   (Nebel-fbm bzw. gefalteter Waber), Story-Palette aus der Voxel Zone S2.
   · AQUARELL 1/2  derselbe Owner, statische Kuppel `skydome_a/_b.webp`. Laut Owner-Kommentar ist das
                   „EXACT rollercoaster-v11 recipe" — die im Brief genannte Rollercoaster-v13-Quelle
                   selbst liegt nicht im Repo; v11-Rezept über den Owner ist der belegte Weg.
   · TINYSKIES     `paintRadialSky()` + Presets aus `travel/wip/travel_globe_wsa/globe-v13/sky-presets.js`
                   (1:1 aus dannylimanseta/tinyskies SkyPresets.ts): Bildschirm-Backdrop, KEIN Dome —
                   genau so, wie die Quelle ihn malt (Owner-Kommentar zum Equirect-Fehler).
   Der Himmel wird nicht vom Look/Tusche erfasst (ausgeschlossen), er ist Hintergrund. */

import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { ownerImport } from './wd-donors.js';

const GH = 'https://cdn.jsdelivr.net/gh/georg-doc/kayfabizarro@main/';
const DOME = GH + 'travel/KFB%20Travel%20Combat%20v25/terrain-v25/skydome-shader.js';
const TINY = GH + 'travel/wip/travel_globe_wsa/globe-v13/sky-presets.js';

export const MODES = [
  ['AUS', 'aus'], ['REALISTISCH', 'real'], ['SHADER S', 'S'], ['SHADER A', 'A'],
  ['AQUARELL 1', 'watercolor'], ['AQUARELL 2', 'watercolor2'],
  ['TINYSKIES TAG', 'tiny:day'], ['TINYSKIES ABEND', 'tiny:evening'], ['TINYSKIES NACHT', 'tiny:night']
];

let domeMod = null, tinyMod = null;
const domeP = () => (domeMod ||= ownerImport(DOME).catch((e) => { domeMod = null; throw e; }));
const tinyP = () => (tinyMod ||= ownerImport(TINY).catch((e) => { tinyMod = null; throw e; }));

/* Ein Himmel je Szene (Felder im Raster sind eigene Szenen). */
export async function makeSky(scene, mode, opts = {}) {
  const out = { mode, group: null, background: null, update() {}, dispose() {}, label: '' };
  if (mode === 'aus') return out;
  if (mode === 'real') {
    const sky = new Sky();
    sky.name = 'sky:real';
    const u = sky.material.uniforms;
    u.turbidity.value = 6; u.rayleigh.value = 1.6; u.mieCoefficient.value = 0.005; u.mieDirectionalG.value = 0.8;
    const sun = new THREE.Vector3();
    scene.add(sky);
    out.group = sky;
    out.label = 'three.js Sky (Preetham)';
    out.update = (camera, keyPos) => {
      sky.scale.setScalar(camera.far * 0.45);
      sky.position.copy(camera.position);
      if (keyPos) sun.copy(keyPos).sub(camera.position).normalize();
      else sun.set(-0.5, 0.6, 0.6).normalize();
      u.sunPosition.value.copy(sun);
    };
    out.dispose = () => { scene.remove(sky); sky.geometry.dispose(); sky.material.dispose(); };
    return out;
  }
  if (mode.startsWith('tiny:')) {
    const T = await tinyP();
    const preset = T.getSkyPreset(mode.slice(5));
    out.background = T.paintRadialSky(THREE, preset, 512);
    out.fog = preset.fogColor;
    out.label = 'tinyskies ' + mode.slice(5) + ' · paintRadialSky()';
    out.dispose = () => { out.background.dispose(); };
    return out;
  }
  const D = await domeP();
  const dome = D.createSkydome({ THREE, variant: mode, mode: opts.story ?? 2, exposure: 0.72, worldMix: 0.4 });
  if (opts.stops) dome.setPalette(opts.stops);
  scene.add(dome.group);
  dome.group.name = 'sky:dome';
  out.group = dome.group;
  out.label = 'skydome-shader.js · ' + mode;
  let t0 = performance.now();
  out.update = (camera) => {
    /* Owner-Radien 1400 (Shader) / 700 (Aquarell) → auf die Kamerareichweite skalieren */
    dome.group.scale.setScalar((camera.far * 0.45) / 1400);
    dome.follow(camera);
    const now = performance.now();
    dome.update(Math.min(0.05, (now - t0) / 1000));
    t0 = now;
  };
  out.dispose = () => dome.dispose(scene);
  return out;
}
