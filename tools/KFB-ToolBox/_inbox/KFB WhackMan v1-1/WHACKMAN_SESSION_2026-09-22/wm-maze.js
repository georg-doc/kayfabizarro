/* KFB WhackMan v1 · MazeGraph
   Die einzige Schicht dieses Projekts, die niemandem sonst gehört: die SPIELWAHRHEIT.

   Der Dungeon-Owner besitzt Katalog, Messung, Fugenmodell, Platzierung und Licht. Der MazeGraph
   besitzt nur logische Verbundenheit: begehbare Knoten, erlaubte Nachbarn, Spawns, Sammelplätze,
   Tunnelpaar, Streuziele, schaltbare Tore.

   Sichtbare Wandmeshes sind NICHT die Navigationswahrheit (Brief §6). Kollision folgt der
   Belegung hier, nicht einem Strahl auf eine Requisite. */

import { cellRoles, cellRolesInverted, RECIPE, key } from './wm-recipe.js';

export { key, RECIPE, cellRoles, cellRolesInverted };

export const DIRS = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
export const OPP = { N: 'S', S: 'N', E: 'W', W: 'E' };

export function mazeGraph(roles) {
  const nodes = new Map();
  for (const c of roles.cells.values()) {
    nodes.set(key(c.x, c.y), {
      x: c.x, y: c.y, role: c.role, pellet: c.pellet, pen: c.role === 'pen', nbr: {}
    });
  }
  for (const n of nodes.values()) {
    for (const [d, [dx, dy]] of Object.entries(DIRS)) {
      const k = key(n.x + dx, n.y + dy);
      if (nodes.has(k)) n.nbr[d] = k;
    }
  }

  const pick = (role) => [...roles.cells.values()].filter((c) => c.role === role);
  const tun = pick('tunnel').sort((a, b) => a.x - b.x || a.y - b.y);
  const tunnelPairs = [];
  for (let i = 0; i + 1 < tun.length; i += 2) {
    const a = nodes.get(key(tun[i].x, tun[i].y)), b = nodes.get(key(tun[i + 1].x, tun[i + 1].y));
    const dA = a.x < b.x ? 'W' : 'E';
    a.nbr[dA] = key(b.x, b.y);
    b.nbr[OPP[dA]] = key(a.x, a.y);
    a.tunnel = key(b.x, b.y); b.tunnel = key(a.x, a.y);
    tunnelPairs.push([key(a.x, a.y), key(b.x, b.y)]);
  }

  const spawnCell = pick('playerSpawn')[0];
  if (!spawnCell) throw new Error('Kein Spielerstart (P) in der Rezeptur');
  const inverted = !!roles.inverted;
  const penCells = pick('pen'), doorCell = pick('penDoor')[0];

  /* Streuziele = die vier Ecken des begehbaren Bereichs. Eine Aussage über den Grundriss,
     keine getippte Koordinate. */
  const corner = (fx, fy) => {
    let best = null, bd = Infinity;
    for (const n of nodes.values()) {
      if (n.pen) continue;
      const d = Math.hypot(n.x - fx, n.y - fy);
      if (d < bd) { bd = d; best = n; }
    }
    return key(best.x, best.y);
  };

  return {
    nodes, w: roles.w, h: roles.h,
    spawn: key(spawnCell.x, spawnCell.y),
    penNodes: penCells.map((c) => key(c.x, c.y)),
    penDoor: doorCell ? key(doorCell.x, doorCell.y) : null,
    pickupNodes: [...roles.cells.values()].filter((c) => c.pellet).map((c) => key(c.x, c.y)),
    specialNodes: pick('special').map((c) => key(c.x, c.y)),
    storyNodes: pick('story').map((c) => key(c.x, c.y)),
    tunnelPairs, inverted,
    scatter: [corner(0, 0), corner(roles.w - 1, 0), corner(0, roles.h - 1), corner(roles.w - 1, roles.h - 1)],
    gates: new Map()
  };
}

/* ---------- Breitensuche · die einzige Wegewahrheit ----------
   Gemerkt wird das Ergebnis je ZIEL. Die Verfolger fragen bei jeder Knotenankunft nach einem
   Abstandsfeld, und die Ziele wiederholen sich stark (Spielerknoten, Streuecke, Pferchtür).
   Ohne Cache läuft pro Ankunft eine volle Suche über 123 Knoten — mal drei Verfolger, mal
   mehrere Ankünfte pro Bild, und die Seite steht. Der Cache wird geleert, wenn sich die
   Topologie ändert (G3-Tore), sonst nie: der Graph ist konstant. */
const distCache = new Map();
export function clearDistCache() { distCache.clear(); }
export function bfsCached(graph, fromKey) {
  let d = distCache.get(fromKey);
  if (!d) { d = bfs(graph, fromKey); distCache.set(fromKey, d); }
  return d;
}

export function bfs(graph, fromKey, blocked = null) {
  const dist = new Map([[fromKey, 0]]);
  const q = [fromKey];
  for (let i = 0; i < q.length; i++) {
    const cur = q[i], n = graph.nodes.get(cur);
    if (!n) continue;
    for (const d of Object.keys(n.nbr)) {
      const nx = n.nbr[d];
      if (dist.has(nx)) continue;
      if (blocked && blocked(nx, cur, d)) continue;
      dist.set(nx, dist.get(cur) + 1);
      q.push(nx);
    }
  }
  return dist;
}

export function stepToward(graph, fromKey, targetKey, banDir = null) {
  const n = graph.nodes.get(fromKey);
  if (!n) return null;
  const dist = bfs(graph, targetKey);
  let best = null, bd = Infinity;
  for (const [d, k] of Object.entries(n.nbr)) {
    if (banDir && d === banDir) continue;
    const v = dist.has(k) ? dist.get(k) : Infinity;
    if (v < bd) { bd = v; best = d; }
  }
  return best;
}

/* ---------- Prüfung · Zahlen, keine Behauptungen ---------- */
export function auditMaze(graph) {
  const nodes = graph.nodes;
  const deg = (n) => Object.keys(n.nbr).length;
  const dist = bfs(graph, graph.spawn);
  const unreachable = [...nodes.values()].filter((n) => !dist.has(key(n.x, n.y)));
  const deadEnds = [...nodes.values()].filter((n) => deg(n) === 1 && !n.pen);

  /* Ein Abzweig (Grad 3) ist in einem Labyrinth der Normalfall und kein „lesbarer Kreuzungsort".
     Der Brief meint mit Cluster die Stellen, an denen mehrere Wege WIRKLICH zusammenlaufen —
     also Grad 4. */
  const branches = [...nodes.values()].filter((n) => deg(n) === 3);
  const junctions = [...nodes.values()].filter((n) => deg(n) >= 4);
  const edges = [...nodes.values()].reduce((s, n) => s + deg(n), 0) / 2;
  const loops = edges - nodes.size + 1;

  const jset = new Set(junctions.map((n) => key(n.x, n.y)));
  const seen = new Set();
  let clusters = 0;
  for (const n of junctions) {
    const k = key(n.x, n.y);
    if (seen.has(k)) continue;
    clusters++;
    const q = [k]; seen.add(k);
    while (q.length) {
      const cur = nodes.get(q.pop());
      for (const nk of Object.values(cur.nbr)) if (jset.has(nk) && !seen.has(nk)) { seen.add(nk); q.push(nk); }
    }
  }

  const penDoorOk = !!graph.penDoor && graph.penNodes.some((p) =>
    Object.values(nodes.get(p).nbr).includes(graph.penDoor));

  return {
    widthCells: graph.w, heightCells: graph.h,
    walkable: nodes.size, edges, loops,
    deadEnds: deadEnds.map((n) => key(n.x, n.y)),
    branches: branches.length, junctions: junctions.length, junctionClusters: clusters,
    unreachable: unreachable.map((n) => key(n.x, n.y)),
    pellets: graph.pickupNodes.length, specials: graph.specialNodes.length,
    story: graph.storyNodes.length, tunnelPairs: graph.tunnelPairs.length,
    pen: graph.penNodes.length, penDoorOk,
    gates: {
      breite: graph.w >= 13 && graph.w <= 19,
      schleifen: loops >= 4,
      cluster: clusters >= 3 && clusters <= 5,
      sackgassen: deadEnds.length === 0,
      erreichbar: unreachable.length === 0,
      tunnel: graph.tunnelPairs.length >= 1,
      pferch: graph.penNodes.length >= 4 && penDoorOk,
      sonderleckerei: graph.specialNodes.length >= 3
    }
  };
}
