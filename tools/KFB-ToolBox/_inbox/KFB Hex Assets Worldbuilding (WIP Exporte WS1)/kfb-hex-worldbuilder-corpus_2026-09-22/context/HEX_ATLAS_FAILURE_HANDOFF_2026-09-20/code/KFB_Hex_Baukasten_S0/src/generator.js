/* Der Generator. Aus dem Baukasten wird eine Hex-Plattform.

   Vorbild ist ausdrücklich ein Dungeon-Generator und die Nutzungsanleitung, die KayKit dem
   Pack selbst beilegt (Promobild »Nature usage guide«): Kacheln setzen, Höhensprünge mit
   Teilsechsecken abfangen, Kacheln dekorieren, Felsformationen für Klippen stapeln.

   Sieben Schritte, jeder mit einer Frage, die er beantwortet:

     1 GRUNDRISS   Welche Zellen gehören dazu?            Wachstum aus einer Form-Regel.
     2 TERRASSEN   Wie hoch liegt jede Zelle?             Abstand zum Rand, nicht Zufall.
     3 KÖRPER      Was sieht man von der Seite?           Kacheln bis zur tiefsten Nachbarkante.
     4 PADDING     Wie überbrücke ich zwei Stufen?        Teilsechseck auf der Sprungkante.
     5 WEG         Wie kommt man hindurch?                A* über begehbare Nachbarn, dann
                                                          Straßenkacheln aus der Kantenmaske.
     6 FELSEN      Wo steht Stein, in welcher Klasse?     A einmal, B an Kanten, C dazwischen.
     7 AUFBAU      Was steht wo und warum?                Landmarke mittig-hoch, Natur außen,
                                                          Laufweg bleibt frei.

   Der Weg wird VOR den Aufbauten gelegt und sperrt seine Zellen. Das ist die Lehre aus dem
   Insel-FAIL: eine Fläche, die man nicht betreten kann, ohne durch die Deko zu stapfen,
   erzählt nichts. */
import * as THREE from 'three';
import { hexMetrics, hexToWorld, neighbor, wantedMask, solveHexTile, rotDeg } from '../../hexrealm/lib/hex-grid.js';
import { instance, ROCK_ROLES } from './kit.js';

const K = (c, r) => c + ',' + r;
export function rng(seed) {
  let s = 0;
  for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
const pick = (rand, arr) => arr[Math.floor(rand() * arr.length) % arr.length];

/* Hex-Distanz in odd-r-Offsetkoordinaten, über Würfelkoordinaten. */
function toCube(col, row) {
  const x = col - ((row - (row & 1)) >> 1);
  const z = row;
  return [x, -x - z, z];
}
export function hexDist(a, b) {
  const A = toCube(a[0], a[1]), B = toCube(b[0], b[1]);
  return Math.max(Math.abs(A[0] - B[0]), Math.abs(A[1] - B[1]), Math.abs(A[2] - B[2]));
}

export const SHAPES = {
  blob:  { label: 'Blob',   score: () => 1 },
  ring:  { label: 'Ring',   score: (d, _a, max) => (d >= Math.max(1, max - 1) ? 3 : 0.15) },
  spine: { label: 'Spine',  score: (_d, a) => (Math.abs(Math.sin(a * 3)) < 0.45 ? 3 : 0.1) },
  star:  { label: 'Star',   score: (_d, a) => (Math.abs(Math.cos(a * 1.5)) > 0.75 ? 3 : 0.12) },
};

/* ── 1 GRUNDRISS + 2 TERRASSEN ─────────────────────────────────────────────────────────── */
export function planPlatform(opts = {}) {
  const seed = opts.seed ?? 'kfb';
  const want = Math.max(3, opts.cells ?? 19);
  const terraces = Math.max(1, opts.terraces ?? 3);
  const shape = SHAPES[opts.shape] ? opts.shape : 'blob';
  const rand = rng(seed);

  const set = new Set([K(0, 0)]);
  const cells = [[0, 0]];
  const maxR = Math.ceil(Math.sqrt(want)) + 1;
  let guard = want * 60;
  while (cells.length < want && guard-- > 0) {
    const from = cells[Math.floor(rand() * cells.length)];
    const d = Math.floor(rand() * 6);
    const [nc, nr] = neighbor(from[0], from[1], d);
    if (set.has(K(nc, nr))) continue;
    const dist = hexDist([nc, nr], [0, 0]);
    const ang = Math.atan2(nr, nc);
    if (rand() > SHAPES[shape].score(dist, ang, maxR) / 3) continue;
    set.add(K(nc, nr)); cells.push([nc, nr]);
  }

  /* 2 TERRASSEN — PLATEAUS, nicht Hochzeitstorte.
     Vorher war die Höhe eine monotone Funktion des Hex-Abstands zur Mitte. Das sieht
     ordentlich aus und hat einen Konstruktionsfehler: Nachbarzellen liegen dann immer
     höchstens eine Stufe auseinander. Gemessen über 16 Konfigurationen (Terrassen 2–5 ×
     Zellen 7/19/37/61): in 14 von 16 Fällen NULL Zweistufensprünge. Bauschritt 4 konnte
     also nie laufen — nicht weil Teile fehlten, sondern weil das Gelände keine Sprünge
     kennt. Genau die zeigt das Promobild unter »use as padding between height gaps«.

     Jetzt: die Zellen werden in \`terraces\` Plateaus geteilt (Voronoi über weit
     auseinanderliegende Startzellen), und jedes Plateau bekommt EINE Höhe aus einer
     durchgemischten Reihenfolge. Damit können benachbarte Plateaus zwei Stufen
     auseinanderliegen — und tun es auch. */
  const rand2 = rng(seed + ':terraces');
  const seeds = [cells[0]];
  while (seeds.length < terraces && seeds.length < cells.length) {
    let best = null, bestD = -1;
    for (const c of cells) {
      const d = Math.min(...seeds.map((s) => hexDist(c, s)));
      if (d > bestD) { bestD = d; best = c; }
    }
    if (!best || bestD <= 0) break;
    seeds.push(best);
  }
  /* Höhenreihenfolge durchmischen, sonst steigt sie wieder brav von außen nach innen. */
  const order = seeds.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rand2() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  const level = new Map();
  for (const c of cells) {
    let owner = 0, bestD = Infinity;
    for (let i = 0; i < seeds.length; i++) {
      const d = hexDist(c, seeds[i]);
      if (d < bestD) { bestD = d; owner = i; }
    }
    level.set(K(...c), order[owner]);
  }

  const inSet = (c, r) => set.has(K(c, r));
  const boundary = cells.filter(([c, r]) => {
    for (let d = 0; d < 6; d++) { const [nc, nr] = neighbor(c, r, d); if (!inSet(nc, nr)) return true; }
    return false;
  });

  /* Sprungkanten: Nachbarn mit zwei oder mehr Stufen Unterschied. Genau die Stellen, an die
     laut Pack-Anleitung ein Teilsechseck gehört. */
  const gaps = [];
  for (const [c, r] of cells) {
    for (let d = 0; d < 6; d++) {
      const [nc, nr] = neighbor(c, r, d);
      if (!inSet(nc, nr)) continue;
      const a = level.get(K(c, r)), b = level.get(K(nc, nr));
      if (a - b >= 2) gaps.push({ from: [c, r], to: [nc, nr], dir: d, hi: a, lo: b });
    }
  }
  return { seed, shape, terraces, cells, set, level, boundary, gaps, seeds };
}

/* ── 5 WEG ─────────────────────────────────────────────────────────────────────────────── */
export function routePath(plan) {
  const { cells, set, level } = plan;
  if (cells.length < 4) return [];
  const far = [...plan.boundary].sort((a, b) => hexDist(b, [0, 0]) - hexDist(a, [0, 0]));
  const start = far[0];
  const goal = [...far].sort((a, b) => hexDist(b, start) - hexDist(a, start))[0];
  if (!start || !goal || K(...start) === K(...goal)) return [];

  const open = [start], came = new Map(), cost = new Map([[K(...start), 0]]);
  while (open.length) {
    open.sort((a, b) => (cost.get(K(...a)) + hexDist(a, goal)) - (cost.get(K(...b)) + hexDist(b, goal)));
    const cur = open.shift();
    if (K(...cur) === K(...goal)) break;
    for (let d = 0; d < 6; d++) {
      const n = neighbor(cur[0], cur[1], d);
      if (!set.has(K(...n))) continue;
      /* Begehbar heißt: höchstens eine Stufe Unterschied. Ein Weg, der eine Klippe
         hinaufführt, ist kein Weg. */
      if (Math.abs(level.get(K(...n)) - level.get(K(...cur))) > 1) continue;
      const g = cost.get(K(...cur)) + 1;
      if (g < (cost.get(K(...n)) ?? Infinity)) { cost.set(K(...n), g); came.set(K(...n), cur); open.push(n); }
    }
  }
  if (!came.has(K(...goal))) return [];
  const out = [goal];
  let cur = goal;
  while (K(...cur) !== K(...start)) { cur = came.get(K(...cur)); out.unshift(cur); }
  return out;
}

/* ── Bauen ─────────────────────────────────────────────────────────────────────────────── */
export async function buildPlatform(plan, kit, metrics, opts = {}) {
  const m = hexMetrics([metrics.W, metrics.step, metrics.H]);
  const step = metrics.step;
  const rand = rng(plan.seed + ':build');
  const group = new THREE.Group();
  group.name = 'platform:' + plan.seed;
  const report = { cells: plan.cells.length, tiles: 0, fill: 0, padding: 0, path: 0, pathStyle: '—',
                   rocks: { A: 0, B: 0, C: 0 }, nature: 0, landmark: 0, missing: [], pathUnsolved: 0,
                   tooBig: 0, paddingParts: 0 };

  const place = async (part, x, y, z, yawDeg = 0, scale = 1) => {
    if (!part) return null;
    let node;
    try { node = await instance(part); } catch (e) { report.missing.push(part.base); return null; }
    node.position.set(x, y, z);
    node.rotation.y = THREE.MathUtils.degToRad(yawDeg);
    if (scale !== 1) node.scale.setScalar(scale);
    group.add(node);
    return node;
  };
  const world = (c, r) => hexToWorld(c, r, m);
  const isBoundary = (c, r) => {
    for (let d = 0; d < 6; d++) { const n = neighbor(c, r, d); if (!plan.set.has(K(...n))) return true; }
    return false;
  };

  /* Ein Streuteil darf die Kachel nicht verlassen.
     Erste Fassung versetzte Cluster mit `inradius * (0.6…0.9)` vom Zellmittelpunkt — bei
     Teilen wie `hill_single_A` (1,11–1,53 breit, halbe Ausdehnung bis 0,76) ergab das
     0,9 + 0,76 = 1,66 bei Inkreis 1,0. Auf einer Randzelle steht das in der Luft und wirft
     seinen Schatten ins Nichts; acht von 51 Teilen taten genau das. Der Versatz wird deshalb
     durch die GEMESSENE halbe Ausdehnung gedeckelt. Passt ein Teil selbst mittig nicht auf
     die Kachel, wird es nicht gestreut. */
  const offsetFor = (rec) => {
    const half = (rec?.foot ?? 0) / 2;
    return Math.max(0, m.inradius * 0.92 - half);
  };
  /* Auf einer Randzelle zeigt »außen« ins Leere. Die Richtung, in die gestreut werden darf,
     ist der Mittelwert der Richtungen zu den vorhandenen Nachbarn. */
  const inwardAngle = (c, r) => {
    let sx = 0, sz = 0, n = 0;
    for (let d = 0; d < 6; d++) {
      const nb = neighbor(c, r, d);
      if (!plan.set.has(K(...nb))) continue;
      const a = world(...nb), o = world(c, r);
      sx += a[0] - o[0]; sz += a[2] - o[2]; n++;
    }
    return n && (sx || sz) ? Math.atan2(sz, sx) : null;
  };

  const path = opts.path === false ? [] : routePath(plan);
  const onPath = new Set(path.map((c) => K(...c)));
  /* Wegart muss VOR dem Körper feststehen: eine Hex-Straßenkachel ERSETZT die Deckkachel,
     eine Quaternius-Pfadkachel liegt darauf. Wer das erst später entscheidet, legt zwei
     Kacheln auf dieselbe Höhe und bekommt Z-Flimmern. */
  const style = opts.pathStyle === 'auto' || !opts.pathStyle
    ? (kit.pathTiles?.length ? 'quaternius' : 'hexroad')
    : opts.pathStyle;
  report.pathStyle = path.length ? style : '—';
  const replacesTile = style === 'hexroad' || !kit.pathTiles?.length;

  /* 3 KÖRPER — je Zelle eine Deckkachel auf ihrer Stufe, darunter so viele Füllkacheln, wie
     der tiefste Nachbar verlangt. Ein Körper, der nur eine Kachel tief ist, zeigt an jedem
     Zweistufensprung ein Loch — der Fehler, den die Promobilder mit dem sichtbaren Rand
     gerade nicht machen. */
  for (const [c, r] of plan.cells) {
    const L = plan.level.get(K(c, r));
    const [x, , z] = world(c, r);
    let lowest = L;
    for (let d = 0; d < 6; d++) {
      const n = neighbor(c, r, d);
      lowest = Math.min(lowest, plan.set.has(K(...n)) ? plan.level.get(K(...n)) : -1);
    }
    if (!(replacesTile && onPath.has(K(c, r)))) {
      /* Varianten haben Stellen, nicht Wahrscheinlichkeiten.
         Eine `_transition`-Kachel ist ein Übergang und gehört an den RAND; mitten in die
         Fläche gewürfelt erzeugt sie grüne Flecken im Sand — im Belegbogen gut zu sehen.
         `_detail` ist ein Akzent und bleibt selten. Alles andere ist Grundkachel. */
      const B = kit.biome;
      let tile;
      if (B) {
        const edge = isBoundary(c, r);
        if (edge && B.transition.length) tile = pick(rand, B.transition);
        else if (!edge && B.detail.length && rand() < 0.18) tile = pick(rand, B.detail);
        else tile = B.base;
      }
      await place(tile || pick(rand, kit.modules) || kit.modules[0], x, L * step, z,
        Math.floor(rand() * 6) * 60);
      report.tiles++;
    }
    for (let l = L - 1; l > lowest; l--) { await place(kit.modules[0], x, l * step, z, 0); report.fill++; }
  }

  /* 4 PADDING — Teilsechseck auf die Sprungkante, auf halber Höhe. Wo das Pack keine
     Teilsechsecke liefert, wird NICHTS gesetzt und der Bericht sagt es. */
  report.paddingParts = kit.padding.length;
  report.gaps = plan.gaps.length;
  if (kit.padding.length) {
    for (const g of plan.gaps) {
      const A = world(...g.from), B = world(...g.to);
      const mid = [(A[0] + B[0]) / 2, 0, (A[2] + B[2]) / 2];
      const lvl = Math.floor((g.hi + g.lo) / 2);
      await place(pick(rand, kit.padding), mid[0], lvl * step, mid[2], Math.floor(rand() * 6) * 60);
      report.padding++;
    }
  }

  /* 5 WEG — zwei Arten, und sie sind nicht austauschbar.

     HEX-STRASSENKACHEL tauscht die ganze Kachel gegen eine mit eingebackenem Sandweg. Die
     Rotation kommt aus der KANTENMASKE (hexrealm/lib/hex-grid.js, dort gegen Geometrie
     belegt) — kein Rätselraten. Sauber, aber der Weg gehört dann der Kachel.

     QUATERNIUS-PFADKACHEL liegt OBEN AUF. Sie ist flach, quadratisch und kennt kein
     Sechseck, also wird sie nicht gelöst, sondern gelegt: eine je Wegzelle plus eine auf
     jeder Kantenmitte dazwischen, mit dem Kachelabstand skaliert und zufällig gedreht. Das
     ist ein Trampelpfad über der Wiese, keine andere Wiese.

     `auto` nimmt die Pfadkacheln, sobald welche im Bestand sind — sie sind die feinere
     Sprache und Georgs ausdrücklicher Wunsch. */
  if (style === 'quaternius' && kit.pathTiles?.length) {
    /* Pfadkacheln sind Poly-Pizza-Einzelteile ohne gemeinsames Maß. Jede wird auf die
       Kachelbreite skaliert, sonst liegt mal ein Teppich und mal ein Kiesel. */
    const lay = async (x, z, L) => {
      const p = pick(rand, kit.pathTiles);
      const rec = p.foot ? p : null;
      const s = rec ? (m.inradius * 1.15) / Math.max(0.001, rec.foot) : 1;
      await place(p, x, L * step + 0.01, z, Math.floor(rand() * 8) * 45, s);
      report.path++;
    };
    for (let i = 0; i < path.length; i++) {
      const [c, r] = path[i];
      const L = plan.level.get(K(c, r));
      const [x, , z] = world(c, r);
      await lay(x, z, L);
      const nxt = path[i + 1];
      if (!nxt) continue;
      const [nx, , nz] = world(...nxt);
      const nL = plan.level.get(K(...nxt));
      /* Kantenmitte nur auf gleicher Höhe — über eine Stufe hinweg läge sie in der Luft. */
      if (nL === L) await lay((x + nx) / 2, (z + nz) / 2, L);
    }
  } else {
    for (const [c, r] of path) {
      const L = plan.level.get(K(c, r));
      const [x, , z] = world(c, r);
      const wanted = wantedMask(c, r, (cc, rr) => onPath.has(K(cc, rr)));
      const sol = solveHexTile(wanted, 'road');
      const part = sol && kit.byName.get(sol.name);
      if (!part) { report.pathUnsolved++; await place(kit.modules[0], x, L * step, z); continue; }
      await place(part, x, L * step, z, rotDeg(sol.turns));
      report.path++;
    }
  }

  /* 6 FELSEN — die drei Klassen, jede mit ihrer eigenen Regel. Zusammen ein System:
     A zieht B an, B zieht C an, C allein nur auf freier Wiese.
     A ist tilegroß und steht deshalb MITTIG und ungedreht auf seiner Kachel — ein
     Landschaftsstück, das man wie einen Kiesel verdreht, hängt über die Kante. */
  const A = kit.rocks.A, B = kit.rocks.B, C = kit.rocks.C;
  const free = plan.cells.filter((c) => !onPath.has(K(...c)));
  if (A.length) {
    const top = [...plan.cells].sort((a, b) => (plan.level.get(K(...b)) - plan.level.get(K(...a))) || (hexDist(b, [0, 0]) - hexDist(a, [0, 0])))[0];
    const [x, , z] = world(...top);
    const L = plan.level.get(K(...top));
    await place(pick(rand, A), x, L * step, z, Math.floor(rand() * 6) * 60);
    report.rocks.A++;
    /* Fuß der Landmarke: zwei bis drei B, dazwischen C. */
    for (let i = 0; i < 2 + Math.floor(rand() * 2) && B.length; i++) {
      const b = pick(rand, B), lim = offsetFor(b);
      if (lim <= 0) { report.tooBig++; continue; }
      const a = rand() * Math.PI * 2, rr = lim * (0.5 + rand() * 0.5);
      await place(b, x + Math.cos(a) * rr, L * step, z + Math.sin(a) * rr, rand() * 360);
      report.rocks.B++;
    }
  }
  if (B.length) {
    for (const [c, r] of plan.boundary) {
      if (onPath.has(K(c, r)) || rand() > 0.55) continue;
      const L = plan.level.get(K(c, r));
      const [x, , z] = world(c, r);
      const n = 2 + Math.floor(rand() * 3);
      const base = inwardAngle(c, r) ?? rand() * Math.PI * 2;
      for (let i = 0; i < n; i++) {
        const b = pick(rand, B), lim = offsetFor(b);
        if (lim <= 0) { report.tooBig++; continue; }
        /* Fächer um die Richtung nach INNEN, ±60° — außen ist Leere. */
        const a = base + (i / Math.max(1, n - 1) - 0.5) * (Math.PI / 1.5);
        const rr = lim * (0.45 + rand() * 0.55);
        await place(b, x + Math.cos(a) * rr, L * step, z + Math.sin(a) * rr, rand() * 360);
        report.rocks.B++;
      }
    }
  }
  if (C.length) {
    for (const [c, r] of free) {
      if (rand() > 0.5) continue;
      const L = plan.level.get(K(c, r));
      const [x, , z] = world(c, r);
      for (let i = 0; i < 1 + Math.floor(rand() * 3); i++) {
        const cc = pick(rand, C), lim = offsetFor(cc);
        const a = rand() * Math.PI * 2, rr = lim * rand();
        await place(cc, x + Math.cos(a) * rr, L * step, z + Math.sin(a) * rr, rand() * 360);
        report.rocks.C++;
      }
    }
  }

  /* 7 AUFBAU — eine Landmarke, mittig und hoch, damit die Plattform eine Adresse hat.
     Natur bleibt außen, der Weg bleibt frei. */
  if (kit.landmarks.length) {
    const centreHigh = [...plan.cells]
      .filter((c) => !onPath.has(K(...c)))
      .sort((a, b) => (plan.level.get(K(...b)) - plan.level.get(K(...a))) || (hexDist(a, [0, 0]) - hexDist(b, [0, 0])))[0];
    if (centreHigh) {
      const [x, , z] = world(...centreHigh);
      await place(pick(rand, kit.landmarks), x, plan.level.get(K(...centreHigh)) * step, z, Math.floor(rand() * 6) * 60);
      report.landmark++;
    }
  }
  if (kit.nature.length) {
    for (const [c, r] of plan.boundary) {
      if (onPath.has(K(c, r)) || rand() > 0.4) continue;
      const L = plan.level.get(K(c, r));
      const [x, , z] = world(c, r);
      const base = inwardAngle(c, r) ?? rand() * Math.PI * 2;
      for (let i = 0; i < 1 + Math.floor(rand() * 3); i++) {
        const t = pick(rand, kit.nature), lim = offsetFor(t);
        if (lim <= 0) { report.tooBig++; continue; }
        const a = base + (rand() - 0.5) * (Math.PI / 1.5), rr = lim * (0.2 + rand() * 0.7);
        await place(t, x + Math.cos(a) * rr, L * step, z + Math.sin(a) * rr, rand() * 360);
        report.nature++;
      }
    }
  }

  /* Plattform auf den Ursprung zentrieren, damit sie unabhängig vom Grundriss im Bild sitzt. */
  const box = new THREE.Box3().setFromObject(group);
  const c = box.getCenter(new THREE.Vector3());
  group.position.set(-c.x, 0, -c.z);
  report.size = box.getSize(new THREE.Vector3()).toArray().map((v) => +v.toFixed(2));
  /* Nur Regeln melden, die auch gelaufen sind. Eine Klasse ohne Teile ist kein Versprechen. */
  report.rockRule = ROCK_ROLES
    .filter((r) => (r.id === 'A' ? A : r.id === 'B' ? B : C).length)
    .map((r) => `${r.id} ${r.label}: ${r.rule}`);
  report.rockInactive = ROCK_ROLES
    .filter((r) => !(r.id === 'A' ? A : r.id === 'B' ? B : C).length)
    .map((r) => `${r.id} ${r.label}`);
  return { group, report, path };
}
