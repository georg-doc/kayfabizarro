/* KFB WhackMan v1 · Rezeptur → Dungeon-Modell (Owner-Form)
   Brief §6: das Labyrinth ist von HAND autoriert, kein Prozedurgenerator. Der BSP-Generator des
   Dungeon-Owners (`dungeon-grid.js` `generate()`) bleibt deshalb unangetastet.

   MISSING_DELTA · MODELL AUS HANDSCHRIFT
   Der Owner kennt genau einen Weg in seine Modellform: `generate()`, also den Zufall. Für eine
   autorierte Karte gibt es keinen Eingang. Diese Datei baut ihn — und zwar strikt nach SEINEN
   Regeln, nicht nach eigenen:

     · die Fuge trägt das Merkmal, nicht die Kachel;
     · die Fugenliste ist ein Set mit kanonischem Schlüssel, also ist doppeltes Wandsetzen
       strukturell unmöglich statt nur geprüft;
     · das Eckteil verbraucht die halbe Nachbarfuge — zwei freie Gitterpunkte = ganze Wand,
       einer = `wall_half` in die freie Hälfte geschoben, keiner = gar kein Teil;
     · `wall_pillar` / `wall_shelves` ragen in eine Zelle und sind im ein Modul breiten Gang
       deshalb nicht wählbar.

   Alles Weitere — Anker, Drehung, Höhe, Fackelachse — macht `layout()` des Owners. Hier wird
   keine Position gerechnet. */

import { DIR, seamKey, cellId } from './tools/world_atlas/source/lib/dungeon-grid.js';

/* ---------- Die Rezeptur · 17 × 15 Zellen, lesbar als Text ----------
     #  Wand / kein Knoten          o  Sonderleckerei → POWERED
     .  Gang mit Sammelgut          S  Story-Bit (G3)
     ,  Gang ohne Sammelgut         P  Spielerstart
     H  Whack-Pferch                D  Pferchtür (einziger Austritt)
     T  Tunnelmund (Paar)                                                        */
export const RECIPE = [
  '#################',
  '#.......#.......#',
  '#o##.##.#.##.##o#',
  '#.......S.......#',
  '#.##.#.###.#.##.#',
  '#....#..,..#....#',
  '####.###D###.####',
  'T....##HHH##....T',
  '####.##HHH##.####',
  '#....#######....#',
  '#.##.#######.##.#',
  '#o.............o#',
  '#.##.##.#.##.##.#',
  '#.......P.......#',
  '#################'
];

export const LEGEND = {
  '#': { walk: false },
  '.': { walk: true, role: 'corridor', pellet: true },
  ',': { walk: true, role: 'corridor' },
  o: { walk: true, role: 'special' },
  S: { walk: true, role: 'story' },
  P: { walk: true, role: 'playerSpawn', pellet: true },
  H: { walk: true, role: 'pen' },
  D: { walk: true, role: 'penDoor' },
  T: { walk: true, role: 'tunnel' }
};

export const key = (x, y) => x + ',' + y;

/* Reproduzierbare Varianz: dieselbe Karte ergibt dieselben Wandvarianten. */
function hash(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) / 4294967296;
}

/* Nur flache Varianten. Der gemessene Überstand (wall_pillar +0,50, wall_shelves +0,37,
   wall_cracked +0,26) ragt in EINE Zelle; ein Gang ist ein Modul breit. wall_cracked bleibt
   drin, weil 0,26 der Wandfläche und nicht dem Weg gehören — die dicken beiden nicht. */
const FLAT = ['wall', 'wall', 'wall', 'wall_cracked', 'wall_cracked', 'wall_window_closed'];

/* ---------- Zellrollen: die Lesart der Rezeptur, ohne Geometrie ---------- */
export function cellRoles(recipe = RECIPE) {
  const h = recipe.length, w = recipe[0].length;
  const bad = recipe.map((r, i) => (r.length === w ? null : i + ':' + r.length)).filter(Boolean);
  if (bad.length) throw new Error('Rezept hat ungleiche Zeilenlängen: ' + bad.join(' '));
  const cells = new Map();
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ch = recipe[y][x];
      const L = LEGEND[ch];
      if (!L) throw new Error(`Unbekanntes Zeichen "${ch}" bei ${x},${y}`);
      if (!L.walk) continue;
      cells.set(key(x, y), { x, y, ch, role: L.role, pellet: !!L.pellet });
    }
  }
  return { w, h, cells, recipe: [...recipe] };
}

/* ---------- Umgekehrte Lauffläche: die WANDBLÖCKE sind begehbar ----------
   Georgs Frage, ob die Figuren wie Pacman auf den Wänden laufen — und sein eigener Nachsatz:
   dann aber LOGISCH auf den Innenwänden, nicht als Höhenversatz über dem Gang. Also wird der
   Graph wirklich umgedreht: begehbar ist, was in der Rezeptur `#` ist.

   Ehrlicher Hinweis, der beim Messen herauskommt: ein Pacman-Grundriss hat einen zusammen-
   hängenden Rand und viele EINZELNE Innenblöcke. Die Umkehrung ist deshalb kein Feld, sondern
   ein Ring plus Inseln. Die Seite meldet die Komponenten, statt so zu tun, als sei es eine Karte.
   Wer wirklich auf Wänden spielen will, braucht eine eigene Rezeptur — das ist eine
   Entwurfsentscheidung, keine Umschaltung. */
export function cellRolesInverted(recipe = RECIPE) {
  const h = recipe.length, w = recipe[0].length;
  const cells = new Map();
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (recipe[y][x] !== '#') continue;
      cells.set(key(x, y), { x, y, ch: '.', role: 'corridor', pellet: true });
    }
  }
  /* Zusammenhangskomponenten zählen und die grösste als Spielfeld nehmen. */
  const seen = new Set(), comps = [];
  for (const c of cells.values()) {
    const k0 = key(c.x, c.y);
    if (seen.has(k0)) continue;
    const list = [k0], q = [c];
    seen.add(k0);
    while (q.length) {
      const cur = q.pop();
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const k2 = key(cur.x + dx, cur.y + dy);
        const nb = cells.get(k2);
        if (!nb || seen.has(k2)) continue;
        seen.add(k2); list.push(k2); q.push(nb);
      }
    }
    comps.push(list);
  }
  comps.sort((a, b) => b.length - a.length);
  const main = new Set(comps[0] || []);
  for (const [k2] of [...cells]) if (!main.has(k2)) cells.delete(k2);

  const first = cells.values().next().value;
  if (first) { first.role = 'playerSpawn'; first.pellet = true; }
  return {
    w, h, cells, recipe: [...recipe],
    inverted: true,
    komponenten: comps.length,
    groesste: comps[0] ? comps[0].length : 0,
    verworfen: comps.slice(1).reduce((s, c) => s + c.length, 0)
  };
}

/* ---------- Rezeptur → Modell in der Form, die `layout()` konsumiert ---------- */
export function dungeonModel(roles, parts) {
  const { w, h, cells: walk } = roles;
  const avail = (n) => !parts || parts.has(n);
  const L = 0;

  /* Zellen. `kind` folgt der Rolle: der Pferch ist ein Raum, alles andere Gang. Der Boden ist
     die ganze Raumsprache dieser Karte — Fliese im Gang, Holz im Pferch, Erde in der
     Kreuzungsluft. Lesbarer Boden/Wand-Kontrast ist eine Forderung des Briefs (§11). */
  const cells = new Map();
  for (const c of walk.values()) {
    const pen = c.role === 'pen' || c.role === 'penDoor';
    const want = pen ? 'floor_wood_large' : c.ch === ',' ? 'floor_dirt_large' : 'floor_tile_large';
    cells.set(cellId(L, c.x, c.y), {
      level: L, c: c.x, r: c.y, kind: pen ? 'room' : 'corr', region: pen ? 1 : 0,
      floor: avail(want) ? want : 'floor_tile_large',
      floorRot: [0, 90, 180, 270][Math.floor(hash(key(c.x, c.y)) * 4)]
    });
  }

  /* Fugen als Set mit kanonischem Schlüssel. */
  const seams = new Map();
  const add = (ax, ay, bx, by) => {
    const ia = cellId(L, ax, ay), ib = cellId(L, bx, by);
    const k = seamKey(ia, ib);
    if (seams.has(k)) return;
    const a = walk.has(key(ax, ay)), b = walk.has(key(bx, by));
    if (!a && !b) return;
    const dir = [bx - ax, by - ay];
    seams.set(k, {
      key: k, level: L, a: [ax, ay], b: [bx, by],
      run: ax === bx ? 'x' : 'z',
      mid: [(ax + bx) / 2, (ay + by) / 2],
      ra: a ? 0 : null, rb: b ? 0 : null,
      kind: a && b ? 'open' : 'solid',
      /* Überstand zeigt aus dem Gang heraus: nach aussen, nie in den Weg. */
      into: a ? [-dir[0], -dir[1]] : dir
    });
  };
  for (const c of walk.values()) {
    for (const [, [dx, dy]] of Object.entries(DIR)) add(c.x, c.y, c.x + dx, c.y + dy);
  }

  const tunnels = [...walk.values()].filter((c) => c.role === 'tunnel');
  const tunnelSeams = tunnels.map((t) => {
    const out = t.x === 0 ? [-1, 0] : t.x === w - 1 ? [1, 0] : t.y === 0 ? [0, -1] : [0, 1];
    return seams.get(seamKey(cellId(L, t.x, t.y), cellId(L, t.x + out[0], t.y + out[1])));
  }).filter(Boolean);
  /* Erster Versuch: der Tunnelmund trägt einen Durchgang. */
  for (const s of tunnelSeams) if (avail('wall_doorway')) { s.kind = 'door'; s.tunnel = true; }

  /* ---------- Ecken VOR der Bauteilwahl (Reihenfolge des Owners) ----------
     Die Armtopologie hängt nur daran, ob eine Fuge ein Objekt trägt. Erst danach ist bekannt,
     welche Fuge noch zwei Gitterpunkte frei hat. */
  const gp = (i, j) => `${L}|${i},${j}`;
  function solveCorners() {
    const armsAt = new Map();
    const arm = (i, j, d) => {
      const k = gp(i, j);
      if (!armsAt.has(k)) armsAt.set(k, { i, j, arms: new Set() });
      armsAt.get(k).arms.add(d);
    };
    for (const s of seams.values()) {
      const c = Math.max(s.a[0], s.b[0]), r = Math.max(s.a[1], s.b[1]);
      s.pts = s.run === 'z' ? [gp(c, r), gp(c, r + 1)] : [gp(c, r), gp(c + 1, r)];
      if (s.kind === 'open') continue;
      if (s.run === 'z') { arm(c, r, 'S'); arm(c, r + 1, 'N'); }
      else { arm(c, r, 'E'); arm(c + 1, r, 'W'); }
    }
    const corners = [], freeEnds = [], junctions = [], cornerAt = new Set();
    for (const [k, pt] of armsAt) {
      const a = [...pt.arms];
      if (a.length === 1) { freeEnds.push(k); continue; }
      if (a.length > 2) { junctions.push(k); continue; }   // T/Kreuz: der Zug läuft durch
      if ((a.includes('N') && a.includes('S')) || (a.includes('E') && a.includes('W'))) continue;
      corners.push({ level: L, i: pt.i, j: pt.j, dirs: a, arms: a.map((d) => DIR[d]) });
      cornerAt.add(k);
    }
    return { corners, freeEnds, junctions, cornerAt };
  }
  let { corners, freeEnds, junctions, cornerAt } = solveCorners();

  /* Zweiter Durchgang, falls der Mund zwischen zwei Eckteilen liegt. Ein Durchgang ist gemessen
     4 lang und nicht kürzbar — das Pack hat keinen halben. Zwei Eckschenkel à 2,0 decken ihn
     vollständig; gebaut sähe das aus wie eine Tür und wäre eine Wand, und die Prüfung meldete
     zwei Durchdringungen von 1,0. Genau dieser Fall steht in S13 als „Treppenkopf zwischen zwei
     Eckteilen" und wird dort mit einer neuen Saat gelöst — hier gibt es keine Saat, also wird
     der Mund stattdessen OFFEN gelassen: der Gang läuft sichtbar über den Kartenrand hinaus,
     was für einen Wrap-Tunnel die richtige Lesart ist. Der Preis sind freie Wandenden; die
     stehen gezählt im Bericht, statt weggeredet zu werden. */
  let tunnelOffen = 0;
  for (const s of tunnelSeams) {
    if (s.kind !== 'door') continue;
    if (s.pts.filter((k) => !cornerAt.has(k)).length >= 2) continue;
    s.kind = 'open';
    s.tunnelOpen = true;
    tunnelOffen++;
  }
  if (tunnelOffen) ({ corners, freeEnds, junctions, cornerAt } = solveCorners());

  /* ---------- Bauteil je Fuge ---------- */
  let halves = 0, covered = 0, doors = 0, walls = 0;
  for (const s of seams.values()) {
    if (s.kind === 'open') { s.part = null; continue; }
    const free = s.pts.filter((k) => !cornerAt.has(k)).length;
    s.halfShift = 0;
    s.openPref = cornerAt.has(s.pts[0]) ? 1 : cornerAt.has(s.pts[1]) ? -1 : 0;
    if (s.kind === 'door') { s.part = 'wall_doorway'; doors++; }
    else if (free === 0) { s.part = null; s.covered = true; covered++; }
    else if (free === 1) {
      s.part = avail('wall_half') ? 'wall_half' : 'wall';
      s.halfShift = cornerAt.has(s.pts[0]) ? 1 : -1;
      halves++; walls++;
    } else {
      const list = FLAT.filter(avail);
      s.part = list.length ? list[Math.floor(hash(s.key) * list.length)] : 'wall';
      walls++;
    }
  }

  /* ---------- Fackeln · Licht aus einem BAUTEIL ----------
     Nur auf Fugen ohne Eckanteil und ohne Überstand, deterministisch ausgedünnt. Die Achse,
     der Abstand von der Wandfläche und die Höhe rechnet `layout()` — hier steht nur, WO. */
  const torches = [];
  if (avail('torch_mounted')) {
    const plain = new Set(['wall', 'wall_cracked', 'wall_window_closed']);
    for (const s of seams.values()) {
      if (s.kind !== 'solid' || !plain.has(s.part)) continue;
      if (s.pts.filter((k) => !cornerAt.has(k)).length < 2) continue;
      if (hash('t' + s.key) > 0.13) continue;
      torches.push({ level: L, region: 0, seam: s.key, part: s.part, mid: s.mid, into: s.into, run: s.run });
    }
  }

  return {
    w, h, cells, seams, corners, torches,
    candles: [],
    stair: { part: null },
    checks: { seams: seams.size, walls, halves, covered, doors, corners: corners.length,
      freeWallEnds: freeEnds.length, junctions: junctions.length, tunnelOffen }
  };
}
