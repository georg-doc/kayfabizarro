/**
 * KFB Fluid v1 · Sammel-Einstieg.
 * Ein Import fuer den Normalfall; die Einzelmodule bleiben separat importierbar.
 * @module kfb-fluid
 * @version 1.0.0
 */
export { createGutterField, h2, vnoise, fbm, spread } from './kfb-fluid-field.js';
export {
  createFluidMaterial, buildFluidGeometry, loadFluidTextures,
  FLUIDS, FLUID_VERT, FLUID_FRAG, KFB_RAW, DUDV_URL, WATER_URL,
} from './kfb-fluid-shader.js';
export { createGutter } from './kfb-gutter.js';
export { createBubbles } from './kfb-bubbles.js';

import { createGutterField } from './kfb-fluid-field.js';
import { createGutter } from './kfb-gutter.js';
import { createBubbles } from './kfb-bubbles.js';

/**
 * Kompletter Wassergraben in einem Aufruf: Feld + Wanne + Oberflaeche + Blasen.
 *
 * TEXTUREN. `mountFluidSystem` laedt `waterdudv.jpg` und `water.jpg` aus dem Repo
 * automatisch nach (`textures: false` schaltet das ab). Ohne sie rendert der Shader ein
 * flaches Rauschfeld statt des Lab-Bildes — das ist kein Geschmacksunterschied, sondern
 * ein anderer Shader-Pfad (`duv` wird konstant, `tex` wird 1.0).
 *
 * @example
 * const water = mountFluidSystem({
 *   THREE, scene, terrain, boxKit,          // boxKit = kfb-box-material.js
 *   cell: 3, halfX: 24, halfZ: 13.5, centerZ: -1.5,
 *   rows: 3, river: true, riverWidth: 3, seed: 42,
 *   zoneTopAt: (x, z) => zone.topAt(x, z),
 *   palette: wc.palette,
 * });
 * water.layout(zone.cells());        // nach jeder Aenderung am Zonenboden
 * // im Loop:
 * water.update(t, dt);
 * console.table(water.measure());    // Beweis statt Screenshot
 */
export function mountFluidSystem(cfg) {
  const field = createGutterField({
    cell: cfg.cell, subSteps: cfg.subSteps,
    halfX: cfg.halfX, halfZ: cfg.halfZ, centerZ: cfg.centerZ,
    rows: cfg.rows, river: cfg.river, riverWidth: cfg.riverWidth, seed: cfg.seed,
    groundHeightAt: cfg.terrain ? (x, z) => cfg.terrain.groundHeightAt(x, z) : cfg.groundHeightAt,
  });
  const gutter = createGutter({
    THREE: cfg.THREE, scene: cfg.scene, field, terrain: cfg.terrain, boxKit: cfg.boxKit,
    zoneTopAt: cfg.zoneTopAt, palette: cfg.palette, fluid: cfg.fluid,
    basinMaterial: cfg.basinMaterial, capacity: cfg.capacity,
    dudvMap: cfg.dudvMap, map: cfg.map, edgeImage: cfg.edgeImage,
  });
  const bubbles = cfg.bubbles === false ? null
    : createBubbles({ THREE: cfg.THREE, scene: cfg.scene, gutter, cell: cfg.cell });

  const sys = {
    name: 'kfb-fluid-system', version: '1.0.0',
    field, gutter, bubbles,
    layout: (zoneCells) => { gutter.layout(zoneCells); return sys; },
    update: (t, dt) => { gutter.update(t); if (bubbles) bubbles.update(dt); return sys; },
    setFluid: (k) => { gutter.setFluid(k); if (bubbles) bubbles.setFluid(k); return sys; },
    set: (patch) => { gutter.set(patch); return sys; },
    measure: () => Object.assign({}, gutter.measure(), bubbles ? { bubbles: bubbles.measure() } : {}),
    dispose: () => { gutter.dispose(); if (bubbles) bubbles.dispose(); },
  };
  if (cfg.textures !== false && !(cfg.dudvMap && cfg.map)) gutter.ready();
  return sys;
}

export default mountFluidSystem;
