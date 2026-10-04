/* Vom Rezept zur Szene. Der Bauer weiß nichts über Sprünge — er setzt, was `tower.js`
   beschlossen hat, und meldet, was er nicht setzen konnte.

   Bauteile kommen aus dem Baukasten (`KFB_Hex_Baukasten_S0/src/kit.js`): ein Loader, ein
   Cache, eine Messung, eine Rollenzuordnung. Hier wird keine zweite Teilekunde gebaut. */
import * as THREE from 'three';
import { instance } from '../../KFB_Hex_Baukasten_S0/src/kit.js';
import { cellWorld, K } from './tower.js';

const pickFrom = (rand, arr) => arr[Math.floor(rand() * arr.length) % arr.length];

function rand01(seed) {
  let s = 0;
  for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

const CLS_COLOR = { direct: 0x8fd08a, double: 0xe3c684, far: 0xf0765a };

export async function buildTower(tower, kit, opts = {}) {
  const root = new THREE.Group();
  root.name = 'babel:' + tower.seed;
  const decoOn = opts.deco !== false;
  const report = { tiles: 0, skirt: 0, deco: 0, landmark: 0, missing: [] };
  const rand = rand01(tower.seed + ':build');
  const m = tower.m, step = tower.step;

  const place = async (part, x, y, z, yaw = 0, scale = 1) => {
    if (!part) return null;
    let node;
    try { node = await instance(part); } catch (e) { report.missing.push(part.base); return null; }
    node.position.set(x, y, z);
    node.rotation.y = THREE.MathUtils.degToRad(yaw);
    if (scale !== 1) node.scale.setScalar(scale);
    return node;
  };

  for (const band of tower.bands) {
    const g = new THREE.Group();
    g.name = 'band:' + band.i;
    g.userData.band = band.i;
    const y = band.level * step;
    /* Absprungzelle dieses Bandes = Startzelle der Verbindung zum NÄCHSTEN Band. Sie bleibt
       frei von Deko, sonst steht der Spieler im Busch, wenn er abspringen soll. */
    band.out = tower.bands[band.i + 1]?.link?.from || null;

    /* Randzellen einmal bestimmen — Übergangskacheln gehören an den Rand, Detailkacheln
       nach innen. Mitten in der Fläche ist eine `_transition` ein Fleck. */
    const edge = new Set();
    for (const [c, r] of band.cells) {
      let open = false;
      for (let d = 0; d < 6; d++) {
        const nb = neighbourOf(c, r, d);
        if (!band.set.has(K(nb[0], nb[1]))) { open = true; break; }
      }
      if (open) edge.add(K(c, r));
    }

    for (const cell of band.cells) {
      const [x, , z] = cellWorld(band, cell, tower);
      const B = kit.biome;
      let tile = null;
      if (B) {
        const e = edge.has(K(cell[0], cell[1]));
        /* Übergangskacheln sind ein Akzent, kein Rand-Anstrich. Auf einem Band aus sieben
           Zellen ist fast JEDE Zelle Randzelle — »am Rand immer Transition« machte das
           ganze Band gestreift. Also: am Rand möglich, nicht zwingend. */
        if (e && B.transition.length && rand() < 0.28) tile = pickFrom(rand, B.transition);
        else if (!e && B.detail.length && rand() < 0.16) tile = pickFrom(rand, B.detail);
        else tile = B.base;
      }
      const node = await place(tile || kit.modules[0], x, y, z, Math.floor(rand() * 6) * 60);
      if (node) { g.add(node); report.tiles++; }
      /* Ein Band ist keine Papierscheibe: eine Fülllage darunter gibt ihm von der Seite
         Masse. Sie nimmt die GRUNDKACHEL DESSELBEN BIOMS — die erste Fassung griff
         `kit.modules[0]`, also irgendeine Deckkachel, und jedes braune Band stand auf einem
         grünen Sockel. */
      const skirt = await place((B && B.base) || kit.modules[0], x, y - step, z, Math.floor(rand() * 6) * 60);
      if (skirt) { g.add(skirt); report.skirt++; }
    }

    if (decoOn) {
      const deco = kit.nature.concat(kit.rocks.C || [], kit.rocks.B || []);
      if (deco.length) {
        for (const cell of band.cells) {
          if (rand() > 0.42) continue;
          if (band.link && sameCell(cell, band.link.to)) continue;          // Landefläche frei
          if (band.out && sameCell(cell, band.out)) continue;               // Absprung frei
          const part = pickFrom(rand, deco);
          const lim = Math.max(0, m.inradius * 0.9 - (part.foot ?? 0) / 2);
          if (lim <= 0) continue;
          const [x, , z] = cellWorld(band, cell, tower);
          const a = rand() * Math.PI * 2, rr = lim * rand();
          const node = await place(part, x + Math.cos(a) * rr, y, z + Math.sin(a) * rr, rand() * 360);
          if (node) { g.add(node); report.deco++; }
        }
      }
      /* Das Ziel bekommt eine Adresse. Eine Landmarke, mittig, nur dort — ein Turm mit zehn
         Landmarken hat keine Spitze. */
      if (band.role === 'goal' && kit.landmarks.length) {
        const free = band.cells.find((c) => !band.link || !sameCell(c, band.link.to)) || band.cells[0];
        const [x, , z] = cellWorld(band, free, tower);
        const node = await place(pickFrom(rand, kit.landmarks), x, y, z, Math.floor(rand() * 6) * 60);
        if (node) { g.add(node); report.landmark++; }
      }
    }
    band.group = g;
    root.add(g);
  }

  return { root, report };
}

function neighbourOf(c, r, d) {
  const DIRS = [[[+1, 0], [0, +1], [-1, +1], [-1, 0], [-1, -1], [0, -1]],
                [[+1, 0], [+1, +1], [0, +1], [-1, 0], [0, -1], [+1, -1]]];
  const [dc, dr] = DIRS[r & 1][d];
  return [c + dc, r + dr];
}
const sameCell = (a, b) => a && b && a[0] === b[0] && a[1] === b[1];

/* ── Debug-Schicht ──────────────────────────────────────────────────────────────────────
   Absprung, Bogen, Landung. Die Farbe IST die Sprungklasse; wer sie sieht, muss keine
   Tabelle lesen. Im Spiel aus, im Editor an — sie erklärt den Turm, sie schmückt ihn nicht. */
export function buildArcs(tower) {
  const g = new THREE.Group();
  g.name = 'arcs';
  for (const band of tower.bands) {
    if (!band.link) continue;
    const prev = tower.bands[band.i - 1];
    const a = new THREE.Vector3(band.link.fromXZ[0], prev.level * tower.step, band.link.fromXZ[1]);
    const b = new THREE.Vector3(band.link.toXZ[0], band.level * tower.step, band.link.toXZ[1]);
    const t = band.link.need.t || 0.8;
    const v = tower.model.v, gg = tower.model.g;
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const k = i / 24, tt = k * t;
      const y = a.y + v * tt - gg * tt * tt / 2;
      pts.push(new THREE.Vector3(a.x + (b.x - a.x) * k, Math.max(y, Math.min(a.y, b.y) - 0.4), a.z + (b.z - a.z) * k));
    }
    const col = CLS_COLOR[band.link.cls] || 0xffffff;
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.85 }));
    line.userData.band = band.i;
    g.add(line);
    for (const [p, r] of [[a, 0.5], [b, 0.62]]) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(r * 0.72, r, 24).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.55, side: THREE.DoubleSide,
          depthWrite: false }));
      ring.position.copy(p).add(new THREE.Vector3(0, 0.03, 0));
      ring.userData.band = band.i;
      g.add(ring);
    }
  }
  return g;
}

/* Auswahlrahmen im Editor: ein flacher Ring um das Band, kein Kasten. Ein Kasten um eine
   Hexfläche lügt über ihre Form. */
export function selectionRing(band, tower) {
  const geo = new THREE.RingGeometry(band.radius * 0.98, band.radius * 1.06, 48).rotateX(-Math.PI / 2);
  const ring = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
    color: 0x9b7fd0, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false }));
  ring.position.set(band.cx, band.level * tower.step + 0.05, band.cz);
  ring.renderOrder = 4;
  return ring;
}
