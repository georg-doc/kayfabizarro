/* Die Welt: Plattform-Graph + Geometrie aus dem Platformer-Pack.

   Zwei Dinge bleiben hier bewusst getrennt:
   · SOLID   — die Kollisionsbox einer Plattform. Kommt aus den Zellmaßen, nicht aus Box3
               über die Deko (ein Baum darf die Landefläche nicht vergrößern).
   · VISUAL  — die gekachelten Pack-Würfel. Rein dekorativ für die Physik.

   Die Zellkantenlänge wird GEMESSEN (Cube_Grass_Center), nicht als 1.0 angenommen. Alle
   Level-Maße sind Zellen; erst hier werden daraus Weltmaße. */
import * as THREE from 'three';
import { instance, measureNode, rng } from './loader.js';

const TOP = { grass: ['Cube_Grass_Center', 'Cube_Grass_Side', 'Cube_Grass_Corner', 'Cube_Grass_Single'],
              dirt: ['Cube_Dirt_Center', 'Cube_Dirt_Side', 'Cube_Dirt_Corner', 'Cube_Dirt_Single'] };
/* Die Unterschicht ist die DIRT-Single-Height-Reihe, nicht die "_Tall"-Reihe: gemessen ist
   `Cube_Dirt_Center_Tall` 2 × 0 × 2 — ein flacher Deckel für gestapelte Türme, kein Block.
   Mit ihm als Unterschicht blieben die Inseln papierdünn. */
const UNDER = ['Cube_Dirt_Center', 'Cube_Dirt_Side', 'Cube_Dirt_Corner'];
const DECO = { tree: ['Tree', 'Tree_Fruit'], bush: ['Bush', 'Bush_Fruit'], grass: ['Grass_1', 'Grass_2', 'Grass_3'], rock: ['Rock_1', 'Rock_2'] };
/* Zielhöhen in ZELLEN — die Pack-Bäume sind 8,6 Einheiten hoch (4,3 Zellen) und würden eine
   7×7-Insel auffressen. Skaliert wird auf gemessene Höhe, nicht mit geratenen Faktoren. */
const DECO_H = { tree: 1.9, bush: 0.62, grass: 0.28, rock: 0.5 };
const PICKUP_H = 0.5;

/* Kantenmaske → Teil + Drehung. Konvention EINMAL hier, damit eine falsche Annahme an
   genau einer Stelle korrigiert wird: das Seitenteil zeigt bei Drehung 0 nach -Z (Norden),
   das Eckteil deckt -Z und -X. Geprüft im Preview, nicht angenommen. */
function tilePiece(left, right, back, front) {
  const n = (left ? 1 : 0) + (right ? 1 : 0) + (back ? 1 : 0) + (front ? 1 : 0);
  if (n === 0) return ['center', 0];
  if (n === 1) return ['side', back ? 0 : right ? Math.PI / 2 : front ? Math.PI : -Math.PI / 2];
  if (n === 2) {
    if (back && left) return ['corner', 0];
    if (back && right) return ['corner', Math.PI / 2];
    if (front && right) return ['corner', Math.PI];
    if (front && left) return ['corner', -Math.PI / 2];
    return ['single', 0];            // gegenüberliegende Kanten: 1 Zelle breit
  }
  return ['single', 0];
}

export async function buildWorld(scene, level, packIndex, portals, opts = {}) {
  const pack = (name) => {
    const rel = packIndex.files[name];
    if (!rel) throw new Error('nicht im Pack-Index: ' + name);
    return packIndex.root + rel;
  };
  const pin = packIndex.commit;
  const get = (name) => instance(pack(name), pin);

  /* --- Zellmaß messen --- */
  const probe = await get('Cube_Grass_Center');
  const pm = measureNode(probe);
  const cell = +pm.size.x.toFixed(4);
  const topH = +pm.size.y.toFixed(4);
  const tallProbe = await get(UNDER[0]);
  const tallH = +measureNode(tallProbe).size.y.toFixed(4);

  /* Ein Modell auf eine Zielhöhe in Zellen bringen — gemessen, nicht geschätzt. */
  const fit = (node, cells) => {
    const m = measureNode(node);
    if (m.size.y > 0.001) node.scale.multiplyScalar((cells * cell) / m.size.y);
    return node;
  };

  const group = new THREE.Group();
  group.name = 'world';
  scene.add(group);

  const platforms = [];
  const pickups = [];
  const hazards = [];
  const bouncers = [];
  const portalMarks = [];

  for (const p of level.platforms) {
    const node = new THREE.Group();
    node.name = 'platform:' + p.id;
    const topY = p.y * cell;
    const cx = p.cx * cell, cz = p.cz * cell;
    const w = p.w * cell, d = p.d * cell;
    node.position.set(cx, 0, cz);
    group.add(node);

    const names = TOP[p.theme] || TOP.grass;
    const tallNames = UNDER;
    for (let i = 0; i < p.w; i++) {
      for (let j = 0; j < p.d; j++) {
        const [kind, rot] = tilePiece(i === 0, i === p.w - 1, j === 0, j === p.d - 1);
        const pick = { center: names[0], side: names[1], corner: names[2], single: names[3] }[kind];
        const tile = await get(pick);
        tile.position.set((i - (p.w - 1) / 2) * cell, topY - topH, (j - (p.d - 1) / 2) * cell);
        tile.rotation.y = rot;
        node.add(tile);

        const tpick = { center: tallNames[0], side: tallNames[1], corner: tallNames[2], single: tallNames[1] }[kind];
        const under = await get(tpick);
        under.position.set(tile.position.x, topY - topH - tallH, tile.position.z);
        under.rotation.y = rot;
        node.add(under);
      }
    }

    const solid = new THREE.Box3(
      new THREE.Vector3(cx - w / 2, topY - topH - tallH, cz - d / 2),
      new THREE.Vector3(cx + w / 2, topY, cz + d / 2));

    const plat = {
      id: p.id, title: p.title || null, data: p, node, top: topY,
      solid, center: new THREE.Vector3(cx, topY, cz),
      half: new THREE.Vector2(w / 2, d / 2),
      checkpoint: !!p.checkpoint, portal: p.portal ? { id: p.portal, ...portals.portals[p.portal] } : null,
      neighbours: []
    };
    platforms.push(plat);

    /* --- Deko: deterministisch gestreut, immer INNERHALB der Landefläche --- */
    if (p.deco) {
      const r = rng('deco:' + p.id);
      for (const [kindKey, count] of Object.entries(p.deco)) {
        for (let k = 0; k < count; k++) {
          const list = DECO[kindKey]; if (!list) continue;
          const name = list[Math.floor(r() * list.length)];
          const deco = fit(await get(name), DECO_H[kindKey] || 0.6);
          const edge = 1.1 * cell;
          deco.position.set((r() - 0.5) * Math.max(0, w - edge), topY, (r() - 0.5) * Math.max(0, d - edge));
          deco.rotation.y = r() * Math.PI * 2;
          deco.scale.setScalar(0.8 + r() * 0.4);
          node.add(deco);
        }
      }
    }

    if (p.goalFlag) {
      const flag = fit(await get('Goal_Flag'), 1.5);
      flag.position.set(p.goalFlag[0] * cell, topY, p.goalFlag[1] * cell);
      node.add(flag);
    }

    for (const pk of p.pickups || []) {
      const item = fit(await get(pk.kind), PICKUP_H);
      const pos = new THREE.Vector3(cx + pk.at[0] * cell, topY + 0.5 * cell, cz + pk.at[1] * cell);
      item.position.copy(pos);
      group.add(item);
      pickups.push({ id: p.id + ':' + pk.kind + ':' + pk.at.join(','), kind: pk.kind, node: item, pos, home: plat, taken: false });
    }

    for (const hz of p.hazards || []) {
      const item = await get(hz.kind);
      const pos = new THREE.Vector3(cx + hz.at[0] * cell, topY, cz + hz.at[1] * cell);
      item.position.copy(pos);
      group.add(item);
      const m = measureNode(item);
      hazards.push({ id: p.id + ':' + hz.kind, kind: hz.kind, node: item, pos,
        radius: Math.max(m.size.x, m.size.z) * 0.45, height: m.size.y, home: plat });
    }

    if (p.bouncer) {
      const item = await get('Bouncer');
      const pos = new THREE.Vector3(cx + p.bouncer[0] * cell, topY, cz + p.bouncer[1] * cell);
      item.position.copy(pos);
      group.add(item);
      const m = measureNode(item);
      bouncers.push({ id: p.id + ':bouncer', node: item, pos, radius: Math.max(m.size.x, m.size.z) * 0.55,
        base: pos.y, home: plat });
    }

    if (plat.portal) {
      const mark = fit(await get('Cube_Question'), 0.45);
      mark.position.set(cx, topY + 1.7 * cell, cz);
      group.add(mark);
      portalMarks.push({ plat, node: mark, base: mark.position.y });
    }
  }

  for (const c of level.clouds || []) {
    const name = ['Cloud_1', 'Cloud_2', 'Cloud_3'][Math.abs(Math.round(c[0])) % 3];
    const cloud = fit(await get(name), 1.4);
    cloud.position.set(c[0] * cell, c[1] * cell, c[2] * cell);
    group.add(cloud);
  }

  /* --- Nachbarschaft: plausible Sprungkandidaten, aus der Geometrie statt getippt --- */
  const maxLink = 5.5 * cell;
  for (const a of platforms) {
    for (const b of platforms) {
      if (a === b) continue;
      const gap = edgeGap(a, b);
      if (gap < maxLink) a.neighbours.push({ to: b, gap, drop: b.top - a.top });
    }
    a.neighbours.sort((x, y) => x.gap - y.gap);
  }

  return {
    group, cell, topH, tallH, platforms, pickups, hazards, bouncers, portalMarks,
    byId: new Map(platforms.map((p) => [p.id, p])),
    killY: level.killY * cell,
    /* Plattform unter einem Punkt (Landefläche, Radius eingerechnet) */
    supportAt(x, z, y, radius = 0) {
      let best = null;
      for (const p of platforms) {
        if (x < p.center.x - p.half.x - radius || x > p.center.x + p.half.x + radius) continue;
        if (z < p.center.z - p.half.y - radius || z > p.center.z + p.half.y + radius) continue;
        if (p.top > y + 0.001) continue;
        if (!best || p.top > best.top) best = p;
      }
      return best;
    },
    inside(p, x, z, margin = 0) {
      return x >= p.center.x - p.half.x - margin && x <= p.center.x + p.half.x + margin &&
             z >= p.center.z - p.half.y - margin && z <= p.center.z + p.half.y + margin;
    },
    update(t) {
      for (const pk of pickups) if (!pk.taken) { pk.node.rotation.y = t * 1.6; pk.node.position.y = pk.pos.y + Math.sin(t * 2 + pk.pos.x) * 0.06 * cell; }
      for (const h of hazards) if (h.kind === 'Hazard_Saw') h.node.rotation.z = t * 6;
      for (const m of portalMarks) m.node.position.y = m.base + Math.sin(t * 1.4 + m.plat.center.x) * 0.12 * cell;
    }
  };
}

export function edgeGap(a, b) {
  const dx = Math.max(0, Math.abs(a.center.x - b.center.x) - a.half.x - b.half.x);
  const dz = Math.max(0, Math.abs(a.center.z - b.center.z) - a.half.y - b.half.y);
  return Math.hypot(dx, dz);
}
