/**
 * KFB Fluid v1 · BLASEN
 * =====================
 * Kleine Kugeln, die aus nassen Zellen aufsteigen und an der Oberflaeche platzen. Keine
 * Sprites, keine Partikeltextur — in einer Voxelwelt liest eine Billboard-Wolke falsch.
 *
 * DIE WICHTIGE ZEILE ist nicht die Physik, sondern die QUELLE: die Zellliste kommt aus
 * `gutter.wetCells`, also aus demselben Nass-Test wie das Wassernetz. Damit kann konstruktiv
 * keine Blase im Trockenen stehen. Eine eigene Zufallsauswahl ueber alle Grabenzellen waere
 * eine zweite Wahrheit (KFB-Regel 4).
 *
 * Die Rate haengt an der Fuellung: Saeure (kind 2) sprudelt, Schlacke (kind 3) gibt kaum etwas
 * her. Start- und Steigwerte sind pro Blase gestreut, sonst pulsiert der ganze Graben im
 * Gleichtakt.
 *
 * @module kfb-bubbles
 * @version 1.0.0
 * @herkunft KFB Card Zone Lab v2 (2026-09)
 */

import { FLUIDS } from './kfb-fluid-shader.js';

/**
 * @param {object} cfg
 * @param {object} cfg.THREE · @param {object} cfg.scene
 * @param {object} cfg.gutter  aus createGutter() — liefert wetCells und fluidY
 * @param {number} [cfg.count=90]
 * @param {number} [cfg.cell=3]
 */
export function createBubbles(cfg) {
  const T = cfg.THREE, cell = cfg.cell || 3, N = cfg.count || 90;
  const gutter = cfg.gutter;
  const mat = new T.MeshStandardMaterial({
    color: 0xffffff, roughness: 0.1, metalness: 0, transparent: true, opacity: 0.5, depthWrite: false,
  });
  const mesh = new T.InstancedMesh(new T.SphereGeometry(1, 8, 6), mat, N);
  mesh.name = 'kfb-bubbles';
  mesh.frustumCulled = false;
  mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
  cfg.scene.add(mesh);

  const state = Array.from({ length: N }, () => ({ life: -Math.random() * 4 }));
  let enabled = true, fluidKey = 'wasser';
  const d = new T.Object3D();

  function update(dt) {
    const cells = gutter.wetCells || [];
    const kind = (FLUIDS[fluidKey] || FLUIDS.wasser).kind;
    const rate = enabled ? (kind === 2 ? 1.9 : kind === 3 ? 0.35 : 1) : 0;
    mesh.visible = rate > 0 && cells.length > 0;
    if (!mesh.visible) return api;
    const surface = gutter.fluidY;

    state.forEach((b, i) => {
      b.life -= dt;
      if (b.life <= 0) {
        const c = cells[(Math.random() * cells.length) | 0];
        b.x = c.x + (Math.random() - 0.5) * cell * 0.8;
        b.z = c.z + (Math.random() - 0.5) * cell * 0.8;
        b.y0 = Math.max(c.top + 0.05, surface - cell * 1.2);
        b.r = 0.07 + Math.random() * 0.13;
        b.spd = (0.5 + Math.random() * 0.9) * rate;
        b.life = Math.max(0.25, (surface - b.y0) / b.spd);
        b.t = 0;
        b.wait = Math.random() * (2.6 / rate);
      }
      if (b.wait > 0) { b.wait -= dt; d.scale.setScalar(0.0001); d.position.set(0, -900, 0); }
      else {
        b.t = (b.t || 0) + dt;
        const y = b.y0 + b.t * b.spd;
        const up = Math.max(0, Math.min(1, (surface - y) / 0.4));   // dicht unter der Oberflaeche platzen
        d.position.set(b.x + Math.sin(b.t * 3 + i) * 0.06, Math.min(y, surface - 0.02), b.z);
        d.scale.setScalar(b.r * (0.5 + up * 0.5));
        if (y >= surface) b.life = 0;
      }
      d.updateMatrix();
      mesh.setMatrixAt(i, d.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    const f = FLUIDS[fluidKey] || FLUIDS.wasser;
    mat.color.setRGB(0.6 + f.col[0] * 0.4, 0.6 + f.col[1] * 0.4, 0.6 + f.col[2] * 0.4);
    return api;
  }

  const api = {
    name: 'kfb-bubbles', version: '1.0.0', mesh,
    update,
    setFluid(k) { fluidKey = k; return api; },
    setEnabled(v) { enabled = !!v; return api; },
    measure() { return { instances: N, visible: mesh.visible, sources: (gutter.wetCells || []).length }; },
    dispose() { cfg.scene.remove(mesh); mesh.geometry.dispose(); mat.dispose(); },
  };
  return api;
}

export default createBubbles;
