/* Der Turm als Rezept. Keine Geometrie, kein three.js — nur Zellen, Höhen und die Frage,
   ob der Spieler von einem Band zum nächsten kommt.

   Warum getrennt: die Sprungprüfung muss ohne Szene laufen können. Ein Generator, der erst
   nach dem Bauen merkt, dass eine Stufe zu weit ist, hat schon gebaut.

   DIE SPRUNGWERTE SIND GERECHNET, NICHT ÜBERNOMMEN.
   `data/movement-config.json` des POC nennt apexHeight 2.817, airTimeFlat 0.867 und
   flatReachAtRun 7.80. Diese drei Zahlen folgen exakt aus impulse 13.0, gravity 30.0 und
   runSpeed 9.0 — nachgerechnet in `jumpModel()`. Was NICHT übernommen wird, ist die
   Weltskala: der POC rechnet auf Zellkante 2.0 und Modulhöhe 2.0 aus dem kubischen Pack.
   Hier ist die Zellkante die GEMESSENE Hexbreite und die Stufe die GEMESSENE Kachelhöhe;
   beide kommen zur Laufzeit aus `moduleMetrics()`. Deshalb steht in der Leiste, welche
   Reichweite in Kachelbreiten das ergibt — und nicht »7.8«, als wäre das eine Naturkonstante. */
import { hexMetrics, hexToWorld, neighbor } from '../../hexrealm/lib/hex-grid.js';

export const K = (c, r) => c + ',' + r;

export function rng(seed) {
  let s = 0;
  for (const ch of String(seed)) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

/* ── Sprungmodell ───────────────────────────────────────────────────────────────────────
   y(t) = v·t − g·t²/2. Die Flugzeit bis zu einem Zielhöhenunterschied dh ist die SPÄTERE
   Nullstelle (der absteigende Ast) — wer die frühere nimmt, misst den Weg bis zum Scheitel
   und hält jede Lücke für halb so breit. */
export function jumpModel(cfg) {
  const g = cfg.air.gravity, v = cfg.jump.impulse, v2 = cfg.doubleJump.impulse, run = cfg.ground.runSpeed;
  const apex = v * v / (2 * g);
  const t1 = v / g;                                   // Zeit bis zum ersten Scheitel
  const apex2 = apex + v2 * v2 / (2 * g);

  const single = (dh) => {
    const disc = v * v - 2 * g * dh;
    if (disc <= 0) return { t: 0, dist: 0 };
    const t = (v + Math.sqrt(disc)) / g;
    return { t, dist: run * t };
  };
  /* Doppelsprung: zweiter Impuls im Scheitel. Das ist die konservative Lesart — früher
     gezündet trägt er weiter, aber darauf darf ein Generator sich nicht verlassen. */
  const double = (dh) => {
    const rest = dh - apex;
    const disc = v2 * v2 - 2 * g * rest;
    if (disc <= 0) return { t: 0, dist: 0 };
    const t = t1 + (v2 + Math.sqrt(disc)) / g;
    return { t, dist: run * t };
  };
  return { g, v, v2, run, apex, apex2, single, double, cfg };
}

/* Sicherheitsabzug. Die gerechnete Weite ist Kante-zu-Kante bei voller Laufgeschwindigkeit
   und perfektem Timing. Gebaut wird auf 82 % davon, damit die Landung IN der Kachel liegt
   und nicht auf ihrer Kante. */
export const MARGIN = 0.82;

export function classify(gap, dh, model, allowDouble) {
  const s = model.single(dh), d = model.double(dh);
  if (s.dist > 0 && gap <= s.dist * MARGIN) return { cls: 'direct', need: s, room: s.dist * MARGIN };
  if (allowDouble && d.dist > 0 && gap <= d.dist * MARGIN) return { cls: 'double', need: d, room: d.dist * MARGIN };
  return { cls: 'far', need: d.dist > 0 ? d : s, room: (allowDouble ? d.dist : s.dist) * MARGIN };
}

/* ── Ein Band ───────────────────────────────────────────────────────────────────────────
   Ein Band ist eine kleine, EINSTUFIGE Hex-Fläche. Einstufig mit Absicht: der Turm erzählt
   seine Höhe über die Abstände zwischen den Bändern, nicht über Terrassen im Band. Wer
   beides mischt, bekommt eine Höhenarchitektur, die man nicht mehr lesen kann — und genau
   das Lesen ist laut Brief der Wert von S2b. */
function growBand(rand, want) {
  const set = new Set([K(0, 0)]);
  const cells = [[0, 0]];
  let guard = want * 40;
  while (cells.length < want && guard-- > 0) {
    const from = cells[Math.floor(rand() * cells.length)];
    const [nc, nr] = neighbor(from[0], from[1], Math.floor(rand() * 6));
    if (set.has(K(nc, nr))) continue;
    set.add(K(nc, nr));
    cells.push([nc, nr]);
  }
  return { cells, set };
}

function localXZ(cells, m) {
  return cells.map(([c, r]) => { const [x, , z] = hexToWorld(c, r, m); return [x, z]; });
}

/* ── Der Turm ───────────────────────────────────────────────────────────────────────────
   Bänder auf einer Wendel: jedes Band liegt ein Stück höher und ein Stück weiter gedreht.
   Der Abstand ist KEINE Designzahl, sondern das Ergebnis der Sprungprüfung: erst die Höhe,
   daraus die erlaubte Weite, daraus der Ort. */
export function planTower(opts) {
  const { seed = 'B1', bands = 10, size = 7, twist = 112, allowDouble = true, metrics, model } = opts;
  const m = hexMetrics([metrics.W, metrics.step, metrics.H]);
  const step = metrics.step;
  const rand = rng(seed + ':tower');
  const list = [];
  const rejects = [];
  let angle = rand() * Math.PI * 2;
  let level = 0;

  for (let i = 0; i < bands; i++) {
    const want = Math.max(3, Math.round(size * (0.7 + rand() * 0.7)));
    const g = growBand(rng(seed + ':band' + i), want);
    const pts = localXZ(g.cells, m);
    const radius = Math.max(...pts.map(([x, z]) => Math.hypot(x, z))) + m.inradius;
    const band = { i, cells: g.cells, set: g.set, pts, radius, level, cx: 0, cz: 0, angle,
                   role: i === 0 ? 'start' : (i === bands - 1 ? 'goal' : 'path') };
    if (i === 0) { list.push(band); continue; }

    const prev = list[i - 1];
    /* Höhenschritt zuerst. Zwei Stufen liegen über dem Scheitel eines Einfachsprungs, sobald
       die gemessene Stufe hoch genug ist — dann ist der Schritt per Konstruktion ein
       Doppelsprung und wird als solcher ausgewiesen, nicht versteckt.
       Die Stufenzahl kommt deshalb NICHT aus einem Bereich wie »1 bis 3«, sondern aus dem
       gemessenen Scheitel: ein direkter Schritt bleibt unter 80 % der Einfachsprunghöhe,
       ein Doppelsprungschritt darf bis 85 % der Doppelsprunghöhe. Mit Kachelhöhe 1.0 sind
       das 2 bzw. 3–4 Stufen — und der Turm steigt, statt in die Fläche zu fransen. */
    const wantDouble = allowDouble && rand() < 0.5;
    const ceil = (wantDouble ? model.apex2 * 0.85 : model.apex * 0.8);
    let rise0 = Math.max(1, Math.round(ceil * (0.7 + rand() * 0.3) / step));
    while (rise0 > 1 && rise0 * step > ceil) rise0--;

    angle += (twist + (rand() - 0.5) * 46) * Math.PI / 180;
    const dirx = Math.cos(angle), dirz = Math.sin(angle);
    /* Ausdehnung IN DER SPRUNGRICHTUNG, nicht der größte Zellabstand überhaupt.
       Mit Radien gerechnet blieben neun von zwanzig Saaten mit einer zu weiten Stufe
       stehen: ein Band mit einem langen Arm nach hinten bekam einen Radius von vier
       Einheiten, und die Mindestentfernung schob die zugewandten Kanten weiter auseinander,
       als der Sprung trug. Projiziert wird, was sich wirklich gegenübersteht. */
    const proj = (b, sx, sz) => Math.max(...b.pts.map(([x, z]) => x * sx + z * sz)) + m.inradius;
    const eP = proj(prev, dirx, dirz), eN = proj(band, -dirx, -dirz);
    const floorDist = eP + eN + m.W * 0.12;

    let link = null;
    /* Zwei Schrauben, in dieser Reihenfolge: erst das Band heranziehen, und erst wenn das
       nicht reicht, den Höhenschritt kleiner machen. Eine zu weite Stufe wird nicht
       stehengelassen und im Bericht entschuldigt — sie wird repariert. */
    outer:
    for (let rise = rise0; rise >= 1; rise--) {
      band.level = level + rise;
      const dh = rise * step;
      const cls0 = classify(0, dh, model, allowDouble);
      const room = Math.max(m.W * 0.5, cls0.room);
      /* Zielweite: ein knappes Drittel bis die Hälfte der erlaubten Weite, zusätzlich auf
         2,2 Kachelbreiten gedeckelt. Ohne den Deckel frisst die volle Reichweite (7,8 =
         3,9 Kacheln) jede Vertikale auf: der erste Lauf stand als flache Wolke im Bild,
         nicht als Turm. Die Reichweite bleibt die SCHRANKE, sie ist nicht die Bauvorgabe. */
      let dist = eP + eN + Math.min(m.W * 2.2, Math.max(m.W * 0.3, room * (0.28 + rand() * 0.24)));
      for (let tries = 0; tries < 8; tries++) {
        band.cx = prev.cx + dirx * dist;
        band.cz = prev.cz + dirz * dist;
        link = nearestPair(prev, band, m);
        link.dh = dh;
        Object.assign(link, classify(link.gap, dh, model, allowDouble));
        if (link.cls !== 'far') break outer;
        rejects.push({ band: i, rise, gap: +link.gap.toFixed(2), room: +link.room.toFixed(2),
                       why: 'measured gap over reach — pulled in' });
        if (dist <= floorDist) break;                 // näher geht nicht, also niedriger
        dist = Math.max(floorDist, dist - Math.max(0.4, link.gap - link.room + m.inradius * 0.5));
      }
    }
    band.link = link;
    band.angle = angle;
    level = band.level;
    list.push(band);
  }
  return relink({ seed, bands: list, m, step, model, allowDouble, rejects, twist, size });
}

/* Nächstes Zellpaar zwischen zwei Bändern: der Absprung und die Landung. Gemessen wird
   Kante zu Kante (Mittelpunktabstand minus zwei Inkreise) — genau die Strecke, die der
   Spieler wirklich in der Luft ist. */
export function nearestPair(a, b, m) {
  let best = null;
  for (let i = 0; i < a.cells.length; i++) {
    const ax = a.cx + a.pts[i][0], az = a.cz + a.pts[i][1];
    for (let j = 0; j < b.cells.length; j++) {
      const bx = b.cx + b.pts[j][0], bz = b.cz + b.pts[j][1];
      const d = Math.hypot(bx - ax, bz - az);
      if (!best || d < best.centre) best = { centre: d, from: a.cells[i], to: b.cells[j],
                                             fromXZ: [ax, az], toXZ: [bx, bz] };
    }
  }
  best.gap = Math.max(0, best.centre - 2 * m.inradius);
  return best;
}

/* Nach jeder Editor-Änderung neu messen. Der Editor darf alles verschieben — er darf nur
   nicht so tun, als bliebe die Prüfung gültig. */
export function relink(tower) {
  const { bands, m, step, model, allowDouble } = tower;
  for (let i = 0; i < bands.length; i++) {
    bands[i].i = i;
    bands[i].role = i === 0 ? 'start' : (i === bands.length - 1 ? 'goal' : 'path');
    if (i === 0) { bands[i].link = null; continue; }
    const link = nearestPair(bands[i - 1], bands[i], m);
    link.dh = (bands[i].level - bands[i - 1].level) * step;
    Object.assign(link, classify(link.gap, link.dh, model, allowDouble));
    bands[i].link = link;
  }
  tower.summary = summarise(tower);
  return tower;
}

export function summarise(tower) {
  const links = tower.bands.slice(1).map((b) => b.link);
  const count = (c) => links.filter((l) => l.cls === c).length;
  const far = count('far');
  return {
    bands: tower.bands.length,
    cells: tower.bands.reduce((s, b) => s + b.cells.length, 0),
    direct: count('direct'), double: count('double'), far,
    height: +((tower.bands[tower.bands.length - 1].level - tower.bands[0].level) * tower.step).toFixed(2),
    levels: tower.bands[tower.bands.length - 1].level - tower.bands[0].level,
    reachable: far === 0,
  };
}

/* Weltposition einer Zelle. Eine Stelle, damit Bauer, Spieler und Prüfung dieselbe Zahl
   benutzen — zwei Umrechnungen wären zwei Wahrheiten. */
export function cellWorld(band, cell, tower) {
  const [x, , z] = hexToWorld(cell[0], cell[1], tower.m);
  return [band.cx + x, band.level * tower.step, band.cz + z];
}

export function bandTop(band, tower) { return band.level * tower.step; }

/* Export-Rezept. Gleicher Seed, gleiche Zahlen — und ein Turm, den der Web Lead ohne diese
   Seite nachbauen kann. */
export function recipe(tower) {
  return {
    schema: 'kfb.babel-hex.recipe/1',
    seed: tower.seed, twist: tower.twist, size: tower.size,
    grid: { W: +tower.m.W.toFixed(3), H: +tower.m.H.toFixed(3), step: +tower.step.toFixed(3),
            inradius: +tower.m.inradius.toFixed(3) },
    jump: { impulse: tower.model.v, doubleImpulse: tower.model.v2, gravity: tower.model.g,
            runSpeed: tower.model.run, apex: +tower.model.apex.toFixed(3),
            apex2: +tower.model.apex2.toFixed(3), margin: MARGIN },
    summary: tower.summary,
    rejected: tower.rejects,
    bands: tower.bands.map((b) => ({
      i: b.i, role: b.role, level: b.level,
      centre: [+b.cx.toFixed(3), +b.cz.toFixed(3)],
      cells: b.cells,
      link: b.link ? { from: b.link.from, to: b.link.to, gap: +b.link.gap.toFixed(3),
                       dh: +b.link.dh.toFixed(3), cls: b.link.cls,
                       room: +b.link.room.toFixed(3) } : null,
    })),
  };
}
