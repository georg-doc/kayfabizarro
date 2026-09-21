/**
 * KFB Fluid v1 · GRABEN-BAULOGIK
 * ==============================
 * Setzt Feld (kfb-fluid-field) und Shader (kfb-fluid-shader) zu einem Objekt zusammen:
 * die Wanne als InstancedMesh, das Wasser als durchgehendes Netz, und die drei Aufrufe, die
 * das Terrain davon wissen muessen (setCarve / setCarvePath / setZones).
 *
 * BESITZVERHAELTNIS (KFB-Regel 5: ein Besitzer je Sache). Dieses Modul besitzt:
 *   · die Wannen-Cubes und ihre Farben
 *   · das Wassernetz und dessen Hoehe
 *   · die Nass-Liste (`wetCells`) — EINE Quelle fuer Blasen, Audio und Tests
 * Es besitzt NICHT: Terrain, Zonenboden, Kamera, Licht. Die Zonenhoehen kommen als Callback
 * herein (`zoneTopAt`), das Terrain wird nur benachrichtigt.
 *
 * REIHENFOLGE. layout() muss laufen, NACHDEM der Zonenboden steht und BEVOR etwas darauf
 * gestellt wird — der Wasserstand entscheidet, was als trocken gilt.
 *
 * KALIBRIERUNG. Das Ufer soll das Terrain fortsetzen. Terrain v10 rechnet sein Licht selbst im
 * Shader (Helligkeitsspreizung, Saettigungs-Jitter, Kanten-Textur, ungetonemappt), die
 * Graben-Cubes tragen die Palette als reine Instanzfarbe und rendern getonemappt. Ohne Abgleich
 * rendert das Ufer rund 2,4-fach heller als das Terrain daneben — ein heller Rahmen um die
 * Zone. `calibrate()` liest den Faktor AUS DEN ECHTEN UNIFORMS statt ihn zu raten: dreht jemand
 * an setColorParams, wandert das Ufer mit.
 *
 * @module kfb-gutter
 * @version 1.0.0
 * @herkunft KFB Card Zone Lab v2 (2026-09)
 */

import { createFluidMaterial, buildFluidGeometry, FLUIDS } from './kfb-fluid-shader.js';
import { h2 } from './kfb-fluid-field.js';

const DEFAULT_PALETTE = [[0.20, 0.16, 0.13], [0.50, 0.36, 0.24], [0.80, 0.68, 0.50]];

/**
 * @param {object} cfg
 * @param {object} cfg.THREE
 * @param {object} cfg.scene
 * @param {object} cfg.field         aus createGutterField()
 * @param {object} [cfg.terrain]     voxel-terrain v10 — bekommt Carve, Pfad und Ruhezonen
 * @param {(x:number,z:number)=>number} [cfg.zoneTopAt] Oberkante des Zonenbodens. Standard: 0.
 * @param {number[][]} [cfg.palette] Drei Stops RGB 0..1 (world-context liefert sie).
 * @param {string} [cfg.fluid='wasser']
 * @param {object} [cfg.basinMaterial] Eigenes Material fuer die Wanne. Standard: MeshStandard.
 * @param {number} [cfg.capacity=2400] Instanzen. Bleibt konstant, ungenutzte werden weggeskaliert.
 * @param {object} [cfg.dudvMap] · @param {object} [cfg.map] vorgeladene Wassertexturen
 */
export function createGutter(cfg) {
  const T = cfg.THREE, scene = cfg.scene, field = cfg.field;
  const cell = field.cell, SUB = field.SUB, WMARGIN = field.WMARGIN;
  const capacity = cfg.capacity || 2400;
  let palette = cfg.palette || DEFAULT_PALETTE;
  let zoneTopAt = cfg.zoneTopAt || (() => 0);
  let terrain = cfg.terrain || null;
  let calib = null;

  // ------------------------------------------------------------ Wanne
  // BOXKIT IST DER NORMALFALL, nicht die Option. Das Lab baut die Wanne mit
  // kfb-box-material (`makeVariedBoxMaterial` + `makeBoxGeometry` + `writeVariation`) —
  // Streifen, Baender und Materialvariation gehoeren zum Bild. Ein blankes
  // MeshStandardMaterial ist der Notpfad, wenn das Kit fehlt, und sieht anders aus.
  const K = cfg.boxKit || null;
  const basinMat = cfg.basinMaterial || (K ? K.makeVariedBoxMaterial(T, {
    edgeMap: null, edgeStrength: 0, grain: 0,
    seam: 0, seamWidth: 0, stripe: 0.12, hatch: 0, bands: 3, bandAmount: 0.14, roughness: 0.95,
  }) : new T.MeshStandardMaterial({ roughness: 0.95, metalness: 0 }));
  const basinGeo = K ? K.makeBoxGeometry(T, capacity, cell)
    : new T.BoxGeometry(cell, 1, cell).translate(0, 0.5, 0);   // Ursprung unten: scale.y = Hoehe
  const basin = new T.InstancedMesh(basinGeo, basinMat, capacity);
  basin.name = 'kfb-gutter-basin';
  basin.receiveShadow = true;
  basin.instanceMatrix.setUsage(T.DynamicDrawUsage);
  scene.add(basin);

  // ------------------------------------------------------------ Wasser
  const fluidMat = createFluidMaterial(T, {
    fluid: cfg.fluid, dudvMap: cfg.dudvMap, map: cfg.map,
    moat: field.options.rows, halfX: field.halfX, halfZ: field.halfZ,
  });
  const fluid = new T.Mesh(new T.BufferGeometry(), fluidMat.material);
  fluid.name = 'kfb-gutter-fluid';
  fluid.renderOrder = 1;
  fluid.frustumCulled = false;
  scene.add(fluid);

  // ------------------------------------------------------------ Zustand
  let cells = [];        // alle Grabenzellen mit gemessener Oberkante
  let wetCells = [];     // nur die nassen — EINE Quelle fuer Blasen/Audio/Tests
  let waterLevel = -cell * 0.5;   // klassifiziert (auf SUB)
  let fluidY = waterLevel - SUB * 0.25;  // gezeichnet (NIE auf SUB, sonst koplanar → Flackern)
  let zoneCells = [];

  /**
   * Faktor, der Graben-Instanzfarben auf die Terrain-Helligkeit bringt. Gemessen, nicht geraten.
   * @param {object} [edgeImage] Die Kanten-Textur des Terrains (edge3). Optional.
   */
  function calibrate(edgeImage) {
    if (calib != null) return calib;
    let U = null;
    ((terrain && terrain.group ? terrain.group.children : []) || []).forEach((c) => {
      if (!U && c.material && c.material.uniforms && c.material.uniforms.uBrightMin) U = c.material.uniforms;
    });
    const bright = U ? U.uBrightMin.value + 0.5 * U.uBrightRange.value : 0.83;
    const light = U ? U.uAmbient.value + 0.62 * U.uLightInt.value : 0.98;
    let edge = 0.62;
    if (edgeImage && edgeImage.width) {
      const cv = document.createElement('canvas'); cv.width = cv.height = 32;
      const cx = cv.getContext('2d'); cx.drawImage(edgeImage, 0, 0, 32, 32);
      const d = cx.getImageData(0, 0, 32, 32).data;
      let s = 0; for (let i = 0; i < d.length; i += 4) s += (d[i] + d[i + 1] + d[i + 2]) / 765;
      edge = s / (d.length / 4);
    }
    // 1.18: der Graben rendert getonemappt (ACES nimmt Mitteltoene um etwa ein Sechstel zurueck),
    // das Terrain nicht.
    calib = bright * edge * light * 1.18;
    return calib;
  }

  /** Terrain benachrichtigen. Ohne diesen Aufruf steht Terrain IM Graben. */
  function pushCarve() {
    if (!terrain) return;
    terrain.setCarve(field.carveRect());
    if (terrain.setCarvePath) {
      terrain.setCarvePath(field.options.river ? field.riverPath() : null, field.riverHalf() * 2);
    }
    if (terrain.setZones) terrain.setZones(field.calmZones());
  }

  /**
   * Der Hauptaufruf. Misst den Zonenboden, setzt die Wasserlinie, baut Wanne und Wassernetz.
   * @param {Array<{x:number,z:number}>} [zoneCellList] Zellen des Zonenbodens. Ohne sie bleibt
   *   der Zonenboden unberuecksichtigt (nur Graben flutet).
   */
  function layout(zoneCellList) {
    if (zoneCellList) zoneCells = zoneCellList;
    zoneCells.forEach((c) => { c.top = zoneTopAt(c.x, c.z); });

    waterLevel = field.waterLevelFrom(zoneCells.map((c) => c.top), 0);
    fluidY = waterLevel - SUB * 0.25;

    cells = field.allCells();
    const d = new T.Object3D(), col = new T.Color();
    const cal = calibrate(cfg.edgeImage);

    for (let k = 0; k < capacity; k++) {
      const c = cells[k];
      if (!c) { d.position.set(0, -900, 0); d.scale.set(0.001, 0.001, 0.001); d.updateMatrix(); basin.setMatrixAt(k, d.matrix); continue; }
      const m = field.topAt(c, waterLevel);
      c.bottom = m.bottom; c.top = m.top; c.dry = m.dry;
      const base = -cell * 3.6;
      d.position.set(c.x, base, c.z);
      d.scale.set(1, c.top - base, 1);
      d.updateMatrix();
      basin.setMatrixAt(k, d.matrix);
      if (K) K.writeVariation(basinGeo, k, 'moat', {
        variation: 0.5, heightCells: 2, mat: K.matId ? K.matId('stein') : 0,
      });

      // FARBE FOLGT DER HOEHE, nicht dem Ringindex: alles ueber der Wasserlinie ist Strand,
      // alles darunter Wannenboden. Am Ringindex laege ein Sandband an der Ringgrenze, obwohl
      // das Ufer im Feld ganz woanders ansteigt.
      if (c.dry) {
        const gh = terrain && terrain.groundHeightAt ? terrain.groundHeightAt(c.x, c.z) : 0;
        const t = Math.min(1, Math.max(0, (c.top - waterLevel) / Math.max(cell * 0.5, gh - waterLevel)));
        // Sand AN der Wasserlinie, Terrainton am Aussenrand — nicht umgekehrt. Zieht die Farbe
        // nach aussen zum hellsten Stop, entsteht ein heller Streifen an der Naht zum Terrain.
        col.setRGB(palette[2][0], palette[2][1], palette[2][2])
          .lerp(new T.Color(palette[1][0], palette[1][1], palette[1][2]), 0.35 + t * 0.65);
        const lum = col.r * 0.299 + col.g * 0.587 + col.b * 0.114;
        col.lerp(new T.Color(lum, lum, lum), 0.11);   // Saettigungs-Jitter wie im Terrain-Shader
        col.multiplyScalar(cal);
      } else {
        col.setRGB(0.13, 0.11, 0.10);                 // nur die Wanne ist dunkel
      }
      col.offsetHSL(0, 0, (h2(Math.round(c.x), Math.round(c.z), 71) - 0.5) * 0.05);
      basin.setColorAt(k, col);
    }
    basin.instanceMatrix.needsUpdate = true;
    if (basin.instanceColor) basin.instanceColor.needsUpdate = true;

    layoutFluid();
    pushCarve();
    return api;
  }

  /**
   * Wassernetz. Graben UND Zone speisen dieselbe Ebene (KISS): was darunter liegt, fuellt sich.
   * Die Zone bekommt damit Teiche, Kanaele und Durchfluesse aus ihren eigenen Stufen, ohne ein
   * zweites Niveau-Modell.
   *
   * NACHBARSCHAFTSPRUEFUNG nur in der Zone: eine einzelne tiefe Zelle mitten im Plateau liest
   * als Fleck, nicht als Teich. Wasser braucht dort mindestens einen nassen Nachbarn — der
   * Graben zaehlt mit, damit ein Kanal an der Kante zur Muendung wird.
   */
  function layoutFluid() {
    const wet = (c) => c && c.top != null && field.isWet(c.top, waterLevel);
    const key = (x, z) => Math.round(x / cell) + ':' + Math.round(z / cell);
    const wetSet = new Set();
    cells.concat(zoneCells).forEach((c) => { if (wet(c)) wetSet.add(key(c.x, c.z)); });

    const out = [];
    cells.forEach((c) => { if (wet(c)) out.push(c); });
    zoneCells.forEach((c) => {
      if (!wet(c)) return;
      const n = [[cell, 0], [-cell, 0], [0, cell], [0, -cell]]
        .filter(([dx, dz]) => wetSet.has(key(c.x + dx, c.z + dz))).length;
      if (n > 0) out.push(c);
    });
    wetCells = out;

    buildFluidGeometry(T, out, {
      y: fluidY, cell, geometry: fluid.geometry,
      flowAt: (x, z) => field.flowAt(x, z),
    });
    return api;
  }

  const api = {
    name: 'kfb-gutter', version: '1.0.0',
    basin, fluid, material: fluidMat,
    get cells() { return cells; },
    get wetCells() { return wetCells; },
    get waterLevel() { return waterLevel; },
    get fluidY() { return fluidY; },
    get calibration() { return calib; },

    layout, layoutFluid, pushCarve, calibrate,

    /**
     * Laedt die beiden Wassertexturen aus dem Repo nach. OHNE SIE IST DAS BILD EIN ANDERES:
     * `uDudv` = null macht die Verzerrung zur Konstanten, `uMap` = null nimmt die Struktur weg.
     */
    ready(o) { return fluidMat.ready(o).then(() => api); },

    /** Einmal pro Frame. `t` = Sekunden seit Start. */
    update(t) { fluidMat.update(t); return api; },

    setFluid(k) { fluidMat.setFluid(k); return api; },
    setPalette(p) { palette = p || DEFAULT_PALETTE; calib = null; return api; },
    setTerrain(tr) { terrain = tr; calib = null; return api; },
    setZoneTopAt(fn) { zoneTopAt = fn || (() => 0); return api; },

    /** Feldparameter aendern und sofort neu bauen. */
    set(patch) { field.set(patch); layout(); return api; },

    /**
     * MESSUNG. Genau die Zahlen, die ein Beweis braucht — keine Schaetzung, kein Screenshot.
     * @returns {{cells:number,wet:number,dry:number,river:number,waterLevel:number,fluidY:number,
     *            quads:number,vertices:number,flowMax:number,calibration:number}}
     */
    measure() {
      const g = fluid.geometry;
      const pos = g.getAttribute('position'), fl = g.getAttribute('aFlow');
      let flowMax = 0;
      if (fl) for (let i = 0; i < fl.count; i++) flowMax = Math.max(flowMax, Math.hypot(fl.getX(i), fl.getY(i)));
      return {
        cells: cells.length,
        wet: wetCells.length,
        dry: cells.filter((c) => c.dry).length,
        river: cells.filter((c) => c.river).length,
        waterLevel: +waterLevel.toFixed(3),
        fluidY: +fluidY.toFixed(3),
        quads: pos ? pos.count / 4 : 0,
        vertices: pos ? pos.count : 0,
        flowMax: +flowMax.toFixed(3),
        calibration: calib != null ? +calib.toFixed(3) : null,
        textures: fluidMat.hasTextures,       // false = nicht das Bild aus dem Lab
        basin: K ? 'kfb-box-material' : 'MeshStandard',
      };
    },

    dispose() {
      scene.remove(basin); scene.remove(fluid);
      basinGeo.dispose(); basin.dispose && basin.dispose();
      fluid.geometry.dispose(); fluidMat.dispose();
    },
  };
  return api;
}

export { FLUIDS };
export default createGutter;
