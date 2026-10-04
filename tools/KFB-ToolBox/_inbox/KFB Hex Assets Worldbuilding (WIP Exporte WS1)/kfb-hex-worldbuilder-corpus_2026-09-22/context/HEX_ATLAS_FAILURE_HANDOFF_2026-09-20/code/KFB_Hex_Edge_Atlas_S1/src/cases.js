/* BT2 \u00b7 Die Bauvorgaben des Herstellers, 1:1 nachgebaut.

   KayKit legt dem Pack zwei Anleitungsbilder bei. Sie sind keine Dekoration, sondern eine
   Bauanleitung mit drei ausdr\u00fccklichen Regeln (\u00bbuse as padding between height gaps\u00ab,
   \u00bbdecorate tiles\u00ab, \u00bbcreate rocky landscapes\u00ab) und zwei fertigen Inselkompositionen.

   HIER WIRD NACHGEBAUT, NICHT GENERIERT. Der verworfene `diorama.js` war eine Layout-Formel,
   und `growBand()` im Babel-Generator ist ein Random Walk \u2014 beide setzen Dinge irgendwohin.
   Die Zellen unten stehen einzeln da, weil sie an dieser Stelle stehen sollen. Das ist die
   Bedingung aus `FAIL_ISLANDS.md`: Inseln werden entworfen.

   Und jeder Fall endet mit einem BEFUND, nicht mit einem Bild. Was das Pack nicht hergibt,
   wird ausgewiesen \u2014 nicht durch etwas \u00c4hnliches ersetzt. */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { readPack } from '../../KFB_Hex_Baukasten_S0/src/inventory.js';
import { load, instance, measured, warm } from '../../KFB_Hex_Baukasten_S0/src/kit.js';
import { hexToWorld, buildNetwork, solveHexTile, auditTileFit, rotDeg, neighbor, dirBetween }
  from '../../hexrealm/lib/hex-grid.js';

/* ── Bestand f\u00fcr die F\u00e4lle ─────────────────────────────────────────────────────────────
   Der Kanten-Atlas l\u00e4dt nur Kacheln. Die Vorgaben brauchen H\u00e4user, B\u00e4ume, Felsen, T\u00fcrme \u2014
   die kommen hier dazu, beim \u00d6ffnen des Bildschirms, nicht beim Start. */
export async function loadStock(onStep) {
  const packs = [];
  for (const key of ['hex', 'builder']) {
    try { packs.push(await readPack(key)); } catch (e) { /* Bestand meldet den Ausfall selbst */ }
  }
  const parts = packs.flatMap((p) => p.parts);
  const res = await warm(parts, onStep, 12);
  const recs = res.ok.map((p) => measured.get(p.path) || p).filter((r) => r.size);
  return {
    parts: recs,
    /* Suche am Namen UND an der Familie, weil beide Packs verschieden ordnen. `not`
       schlie\u00dft aus, was sonst mitkommt (Unterseiten, Schr\u00e4gen, Ruinen). */
    find(re, opts = {}) {
      const not = opts.not || /(_bottom|_sloped|_slope|_ramp|_destroyed|_ruin)/i;
      const pack = opts.pack;
      return recs.filter((r) => (!pack || r.pack === pack)
        && (re.test(r.base) || (opts.family && opts.family.test(r.family || '')))
        && !not.test(r.base));
    },
    one(re, opts) { return this.find(re, opts)[0] || null; },
    byBase(base, pack) { return recs.find((r) => r.base === base && (!pack || r.pack === pack)) || null; },
  };
}

const place = async (group, part, x, y, z, yawDeg = 0, scale = 1) => {
  if (!part) return null;
  let node;
  try { node = await instance(part); } catch (e) { return null; }
  node.position.set(x, y, z);
  node.rotation.y = THREE.MathUtils.degToRad(yawDeg);
  if (scale !== 1) node.scale.setScalar(scale);
  group.add(node);
  return node;
};

/* Die Deckfl\u00e4che liegt bei y = 0, der K\u00f6rper h\u00e4ngt darunter (S11-Befund, hier nicht
   nachgemessen). Eine Terrassenstufe ist also genau die K\u00f6rperh\u00f6he. */

/* DIE GEBÄUDE HEISSEN `building_home_*`, NICHT `house`. Ein `/^house/i` fand nichts und
   meldete »kein Wohnhaus im Hexagon-Pack« — die sechste Vokabelsuche in diesem Sprint.
   Gefunden durch Hinsehen im Teile-Bogen: `building_home_A_red`, 0,79 × 0,85 × 0,93.

   Dabei fiel eine Bauregel auf, die kein Namensmuster hergibt: das Pack ordnet Gebäude nach
   DACHFARBE (`buildings/red|blue|green|yellow|neutral`). Beide Vorlagen zeigen durchgehend
   blaue Dächer — eine Siedlung hat eine Farbe. Deshalb wird hier eine Farbe gewählt und
   durchgehalten, nicht je Gebäude gewürfelt. */
const ROOF = 'blue';
const building = (stock, re, roof = ROOF) =>
  stock.one(new RegExp(`^building_${re}.*_${roof}$`, 'i'), { pack: 'hex' })
  || stock.one(new RegExp(`^building_${re}`, 'i'), { pack: 'hex' });

const cellXZ = (c, r, m) => { const [x, , z] = hexToWorld(c, r, m); return [x, z]; };

/* ═══ Fall 1 ═══════════════════════════════════════════════════════════════════════════
   »USE AS PADDING BETWEEN HEIGHT GAPS«

   DIE PADDING-TEILE LIEGEN NICHT UNTER `tiles`. Zwei Fassungen suchten sie dort und in der
   Form (Sechseckverhältnis bei kleinerem Grundriss) und meldeten erst 36 Gebäude, dann
   »kein Teilsechseck im Bestand« — mit dem Zusatz, der Verdacht sei widerlegt und das Pack
   liefere die Teile nicht. Beides falsch.

   Sie heißen `hill_single_A/B/C` und `hills_A` und liegen in `decoration/nature`: gelbe
   Oberseite, rotbrauner Erdrand, 0,31 bis 0,79 hoch, teils mit aufgesetzten Steinen. Genau
   die Teile unten links im Vorlagenbild. Dazu kommen `hex_grass_sloped_low` (1,5) und
   `hex_grass_sloped_high` (2,0) aus `tiles/base` — Kacheln, deren Oberseite von einer Höhe
   zur nächsten führt. `kit.js` schließt `_sloped` als LAUFFLÄCHE aus; daraus zu schließen,
   sie seien nichts, war der Fehler.

   Gefunden wurden sie durch Hinsehen: 447 Teile als Bilder, nach Familie sortiert. Kein
   Namensmuster hätte `hill_single_B` als Höhenausgleich erkannt. */
async function buildPadding(stock, m, findings) {
  const g = new THREE.Group();
  const P = { pack: 'hex' };
  const base = stock.one(/^hex_grass$/, P);
  const step = m.step;
  /* `hills_A_trees` & Co. sind bewachsene Hügel, kein Ausgleichsteil — sie standen in der
     Aufzählung, obwohl der Höhenfilter sie ohnehin nie setzte. Eine Liste, die mehr nennt
     als sie meint, ist auch eine falsche Aussage über den Bestand. */
  const pads = stock.find(/^hill_single_|^hills_/i, P)
    .filter((r) => !/_trees?$/i.test(r.base))
    .sort((x, y) => x.size[1] - y.size[1]);
  const slopeLow = stock.byBase('hex_grass_sloped_low', 'hex');
  const slopeHigh = stock.byBase('hex_grass_sloped_high', 'hex');
  findings.push(pads.length
    ? { ok: true, text: `Höhenausgleich aus \`decoration/nature\`: ${pads.map((p) => `${p.base} (${p.size[1]})`).join(', ')} — NICHT aus \`tiles\`, wo zwei Fassungen vergeblich suchten.` }
    : { ok: false, text: 'Keine hill_single/hills-Teile gefunden.' });
  findings.push(slopeLow && slopeHigh
    ? { ok: true, text: `Schrägkacheln \`hex_grass_sloped_low\` (${slopeLow.size[1]}) und \`_high\` (${slopeHigh.size[1]}) überbrücken eine bzw. zwei Stufen.` }
    : { ok: false, text: 'Schrägkacheln nicht gefunden.' });

  /* Drei Terrassen, entworfen: unten eine breite Fläche, darüber ein Absatz, oben eine
     Kuppe. Der Absatz ist die Stelle, an der die Vorlage ihr Padding zeigt. */
  const terraces = [
    { cells: [[0, 2], [1, 2], [-1, 3], [0, 3], [1, 3], [0, 4], [1, 4]], level: 0 },
    { cells: [[0, 0], [1, 0], [0, 1], [1, 1], [2, 1]], level: 1 },
    { cells: [[2, 0], [2, -1]], level: 2 },
  ];
  const occupied = new Set();
  for (const t of terraces) for (const [c, r] of t.cells) occupied.add(c + ',' + r);
  for (const t of terraces) {
    for (const [c, r] of t.cells) {
      const [x, z] = cellXZ(c, r, m);
      await place(g, base, x, t.level * step, z);
      for (let k = 1; k <= t.level; k++) await place(g, base, x, (t.level - k) * step, z);
    }
  }

  /* Das Padding sitzt AUF der tieferen Fläche, an der Kante zur höheren — dort, wo sonst
     eine nackte Wand steht. Welches Teil: das höchste, das unter die Stufe passt. */
  let padCount = 0;
  for (const t of terraces) {
    for (const [c, r] of t.cells) {
      for (let d = 0; d < 6; d++) {
        const [nc, nr] = neighbor(c, r, d);
        const up = terraces.find((o) => o.cells.some((p) => p[0] === nc && p[1] === nr) && o.level > t.level);
        if (!up) continue;
        const gap = (up.level - t.level) * step;
        const pad = pads.filter((p) => p.size[1] <= gap * 0.95).pop() || pads[0];
        if (!pad) continue;
        const [x, z] = cellXZ(c, r, m);
        const a = (d * Math.PI) / 3;
        await place(g, pad, x + Math.cos(a) * m.inradius * 0.52, t.level * step,
          z + Math.sin(a) * m.inradius * 0.52, rotDeg(d));
        padCount++;
      }
    }
  }
  findings.push({ ok: padCount > 0, text: `${padCount} Ausgleichsteile an den Absätzen gesetzt.` });

  /* Eine Schrägkachel als begehbarer Übergang, dort wo die Stufe genau eine Höhe beträgt. */
  if (slopeLow) { const [x, z] = cellXZ(-1, 2, m); await place(g, slopeLow, x, 0, z, rotDeg(5)); }

  /* Bewuchs als fertige Gruppe, nicht als Streu (Rule of Three steckt im Teil). */
  const cluster = stock.find(/^detail_forest|^detail_hill/i);
  if (cluster.length) {
    const spots = [[2, 0], [0, 2]];
    for (let i = 0; i < spots.length; i++) {
      const lvl = terraces.find((t) => t.cells.some((p) => p[0] === spots[i][0] && p[1] === spots[i][1]))?.level ?? 0;
      const [x, z] = cellXZ(spots[i][0], spots[i][1], m);
      await place(g, cluster[i % cluster.length], x, lvl * step, z, 40 + i * 120);
    }
  }
  const house = building(stock, 'home');
  if (house) { const [x, z] = cellXZ(1, 1, m); await place(g, house, x, step, z, 180); }
  return g;
}

/* ═══ Fall 2 ═══════════════════════════════════════════════════════════════════════════
   »DECORATE TILES«

   Eine Kachel, ein Gebäude, Bewuchs. Die Pfeile der Vorlage zeigen die Reihenfolge.

   ENTSCHEIDEND IST, WAS MAN NICHT SELBER STREUT. Die erste Fassung verteilte vier Einzel-
   bäume und fünf Einzelsteine über Winkel und Radius — heraus kam ein Baum, ein Zaun (den
   die Steinsuche mit eingefangen hatte) und ein paar Kiesel ohne Gruppenbildung. Das Pack
   liefert die Gruppen fertig: `detail_forestA` sind drei Bäume mit Steinen an einem Fuß,
   `detail_rocks_small` eine Steingruppe. Die Rule of Three ist im Teil modelliert; wer sie
   per Zufallswinkel nachbaut, bekommt Streu statt Komposition. */
async function buildDecorate(stock, m, findings) {
  const g = new THREE.Group();
  const P = { pack: 'hex' };
  const base = stock.one(/^hex_grass$/, P);
  await place(g, base, 0, 0, 0);

  const house = building(stock, 'home');
  if (house) await place(g, house, 0, 0, -m.inradius * 0.2, 180);
  else findings.push({ ok: false, text: 'Kein building_home_* im Hexagon-Pack gefunden.' });
  findings.push(house ? { ok: true, text: `Gebäude »${house.base}« — das Pack ordnet nach Dachfarbe, die Vorlage zeigt durchgehend ${ROOF}. Eine Siedlung, eine Farbe.` } : { ok: false, text: '—' });

  const forest = stock.one(/^detail_forest/i);
  const rocks = stock.one(/^detail_rocks/i);
  if (forest) await place(g, forest, m.inradius * 0.42, 0, m.circumradius * 0.30, 150);
  if (rocks) await place(g, rocks, -m.inradius * 0.5, 0, m.circumradius * 0.34, 20);
  findings.push(forest || rocks
    ? { ok: true, text: `Fertige Gruppen statt Streu: ${[forest, rocks].filter(Boolean).map((p) => p.base).join(', ')} — die Rule of Three steckt im Teil.` }
    : { ok: false, text: 'Keine detail_*-Gruppen gefunden; es bliebe nur Streu.' });

  const stairs = stock.one(/^stairs|^steps/i, P);
  if (stairs) await place(g, stairs, 0, 0, m.circumradius * 0.52, 0);
  return g;
}

/* ═══ Fall 3 ═══════════════════════════════════════════════════════════════════════════
   »CREATE ROCKY LANDSCAPES«

   Drei Größen wachsen zur Formation zusammen, oben sitzt das Bauwerk. Die Größen kommen aus
   dem Bestand (`deriveRockClasses` im Baukasten), hier werden sie nur benutzt. */
async function buildRocky(stock, m, findings) {
  const g = new THREE.Group();
  const stone = stock.find(/^mountain/i, { pack: 'hex' }).filter((r) => r.size[1] > 0.25);
  const rocky = stone.length ? stone
    : stock.find(/mountain|hills|hill_single|rock/i, { pack: 'hex' }).filter((r) => r.size[1] > 0.25);
  if (!rocky.length) { findings.push({ ok: false, text: 'Keine Felsteile gefunden.' }); return g; }
  const big = rocky.slice().sort((x, y) => y.foot - x.foot);
  const ring = [[0, 0], [1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1]];
  for (let i = 0; i < ring.length; i++) {
    const [c, r] = ring[i];
    const [x, z] = cellXZ(c, r, m);
    await place(g, big[i % Math.min(3, big.length)], x * 0.62, 0, z * 0.62, i * 60);
  }
  const mid = big[Math.min(3, big.length - 1)];
  for (let i = 0; i < 3; i++) {
    const a = i * 2.1;
    await place(g, mid, Math.cos(a) * m.inradius * 0.8, mid.size[1] * 0.35, Math.sin(a) * m.inradius * 0.8, i * 47);
  }
  const top = Math.max(...big.slice(0, 3).map((r) => r.size[1]));
  await place(g, stock.one(/^hex_grass$/, { pack: 'hex' }), 0, top * 0.72, 0);
  const tower = building(stock, 'castle') || building(stock, 'tower');
  if (tower) await place(g, tower, 0, top * 0.72, 0);
  else findings.push({ ok: false, text: 'Kein Turm/Burgteil gefunden.' });
  findings.push({ ok: true, text: `Formation aus ${Math.min(3, big.length)} Größen, größtes Teil ${big[0].base} (${big[0].foot} breit).` });
  return g;
}

/* ═══ Fall 4 ═══════════════════════════════════════════════════════════════════════════
   DIE DORFINSEL aus dem ersten Promobild.

   Hier entscheidet die DREHUNG, nicht die Kachelwahl. Wald, Felder und Wiese sind beliebig
   drehbar, Fluss und Straße nicht: deren Kachel und Winkel kommen aus `solveHexTile()`, die
   Netze aus `buildNetwork()`, und `auditTileFit()` prüft hinterher jede Fuge.

   DIE BRÜCKE VERBINDET LAND ÜBER WASSER. Die erste Fassung setzte sie irgendwo auf den Fluss,
   mit einem Winkel aus dem letzten Straßenglied — sie endete im Wasser und verband nichts.
   `bridge` misst 2 × 0,744 × 0,777: genau eine Kachelbreite, also überspannt sie GENAU EINE
   Flusszelle. Damit ist ihre Stelle nicht wählbar, sondern bestimmt: die Zelle, in der die
   Straße den Fluss kreuzt. Die Straße bricht dort ab und setzt jenseits wieder an; die
   Brücke IST das fehlende Glied. */
async function buildVillage(stock, m, findings) {
  const g = new THREE.Group();
  const P = { pack: 'hex' };
  const grass = stock.one(/^hex_grass$/, P);
  const water = stock.one(/^hex_water$/, P);
  const grain = stock.one(/^building_grain/i, P);

  const land = {
    forest: [[0, 0], [1, 0], [0, 1]],
    field: [[2, 0], [3, 0], [2, 1], [3, 1]],
    grass: [[1, 1], [0, 2], [1, 2], [2, 2], [3, 2], [1, 3], [2, 3], [3, 3], [0, 5], [1, 5], [2, 5]],
  };
  /* Fluss quer durch die vorletzte Reihe, Mündung an beiden Enden (die Flussfamilie hat
     keine Quellkachel — ein Lauf, der im Feld endet, ist nicht baubar). */
  const mouths = [[-1, 4], [4, 4]];
  const isMouth = (c, r) => mouths.some((p) => p[0] === c && p[1] === r);
  const river = { id: 'fluss', cells: [[-1, 4], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4]] };
  /* Die Straße läuft von der Windmühle hinunter und ENDET AM UFER. Jenseits setzt sie
     wieder an. Die Lücke ist genau eine Zelle breit — dort liegt die Brücke. */
  const crossing = [1, 4];
  const roadN = { id: 'strasse-nord', cells: [[2, 1], [2, 2], [1, 3]] };
  const roadS = { id: 'strasse-sued', cells: [[1, 5], [2, 5]] };

  const riverNet = buildNetwork([river]);
  const roadNet = buildNetwork([roadN, roadS]);
  for (const [net, id] of [[riverNet, 'Fluss'], [roadNet, 'Straße']]) {
    if (net.breaks.length) findings.push({ ok: false, text: `${id}: ${net.breaks.length} Sprung/Sprünge — nicht kantenbenachbart.` });
  }

  const audit = [];
  const put = async (part, c, r, yaw = 0, y = 0) => {
    const [x, z] = cellXZ(c, r, m);
    await place(g, part, x, y, z, yaw);
  };
  for (const [c, r] of land.forest) await put(grass, c, r);
  for (const [c, r] of land.field) { await put(grass, c, r); if (grain) await put(grain, c, r); }
  for (const [c, r] of land.grass) await put(grass, c, r);
  for (const [c, r] of mouths) await put(water || grass, c, r);
  findings.push(grain
    ? { ok: true, text: `Feld = Auflieger »${grain.base}« (${grain.size[0]} × ${grain.size[2]} × ${grain.size[1]}) auf Graskachel — im Pack keine Feld-HEXKACHEL, sondern eine flache Bodendecke.` }
    : { ok: false, text: 'Kein Feld-Auflieger gefunden.' });

  for (const [net, family] of [[riverNet, 'river'], [roadNet, 'road']]) {
    for (const [ck, maskv] of net.mask) {
      const [c, r] = ck.split(',').map(Number);
      if (family === 'river' && isMouth(c, r)) continue;
      const sol = solveHexTile(maskv, family);
      if (!sol) { findings.push({ ok: false, text: `Keine ${family}-Kachel für Maske ${maskv.toString(2).padStart(6, '0')} bei ${ck}.` }); continue; }
      const part = stock.byBase(sol.name, 'hex');
      if (!part) { findings.push({ ok: false, text: `${sol.name} nicht im Bestand.` }); continue; }
      await put(part, c, r, sol.rot);
      audit.push({ col: c, row: r, a: sol.name, open: maskv });
    }
  }
  const ends = new Set(roadNet.ends.map((c) => c.join(',')));
  const fit = auditTileFit(audit, { isOpenOutside: (c, r, d) => {
    const [nc, nr] = neighbor(c, r, d);
    return ends.has(c + ',' + r) || isMouth(nc, nr);
  } });
  findings.push({ ok: fit.clean, text: fit.clean
    ? `Kantenschluss sauber: ${fit.checked} Fugen geprüft, 0 Fehlstellen.`
    : `Kantenschluss: ${fit.bad.length} von ${fit.checked} Fugen falsch — ${fit.bad.slice(0, 3).map((x) => `${x.a}@${x.cell} ${x.why}`).join(' · ')}` });

  /* Die Brücke liegt auf der Kreuzungszelle und zeigt in Richtung der beiden Straßenenden.
     Geprüft wird, dass sie wirklich zwei Landzellen verbindet — eine Brücke, die nur an
     einem Ufer ansetzt, ist keine. */
  const bridge = stock.one(/^bridge$/i) || stock.one(/^bridge/i);
  const northEnd = roadN.cells[roadN.cells.length - 1], southEnd = roadS.cells[0];
  const dN = dirBetween(crossing, northEnd), dS = dirBetween(crossing, southEnd);
  if (bridge && dN >= 0 && dS >= 0) {
    await put(bridge, crossing[0], crossing[1], rotDeg(dS), 0);
    findings.push({ ok: true, text: `Brücke \`${bridge.base}\` (${bridge.size[0]} lang = eine Kachelbreite) überspannt die Kreuzungszelle ${crossing} und verbindet ${northEnd} mit ${southEnd}.` });
  } else {
    findings.push({ ok: false, text: bridge
      ? `Brücke gefunden, aber die Kreuzungszelle ${crossing} grenzt nicht an beide Straßenenden — sie würde im Wasser enden und bleibt weg.`
      : 'Keine Brücke im Bestand — der Weg endet am Wasser.' });
  }

  const windmill = building(stock, 'windmill');
  if (windmill) await put(windmill, 3, 1, 200);
  /* Eine Dachfarbe für die ganze Siedlung — so zeigt es die Vorlage, so ordnet es das Pack. */
  /* Nicht eine Vokabelliste (»home|market|blacksmith«), sondern der Bestand: alle Gebäude
     der Dachfarbe, ohne Wehrbauten und Windmühle — die stehen woanders. */
  const houses = stock.find(new RegExp(`_${ROOF}$`, 'i'), P)
    .filter((r) => /^building_/i.test(r.base) && !/castle|tower|wall|gate|windmill|barracks/i.test(r.base)
      && r.size[1] < 1.6);
  for (let i = 0; i < Math.min(3, houses.length); i++) {
    const [c, r] = [[1, 1], [0, 2], [1, 2]][i];
    await put(houses[i], c, r, 150 + i * 40);
  }
  findings.push({ ok: houses.length >= 3,
    text: `${houses.length} Gebäude mit Dachfarbe »${ROOF}«: ${houses.slice(0, 3).map((h) => h.base).join(', ')}` });
  /* Wald als fertige Gruppen, nicht als Baumstreu. */
  const cluster = stock.find(/^detail_forest/i);
  if (cluster.length) {
    let i = 0;
    for (const [c, r] of land.forest) await put(cluster[i++ % cluster.length], c, r, 30 + i * 95);
  }
  return g;
}

export const CASES = [
  { id: 'padding', title: 'Use as padding between height gaps',
    rule: 'Zwischen zwei H\u00f6henstufen liegen kleinere Sechsecke mit Felsrand und f\u00fcllen den Absatz.',
    source: 'Nature Usage Guide, links', build: buildPadding },
  { id: 'decorate', title: 'Decorate tiles',
    rule: 'Kachel zuerst, dann das Geb\u00e4ude, dann Bewuchs und Streu \u2014 alles bleibt auf der Kachel.',
    source: 'Nature Usage Guide, Mitte', build: buildDecorate },
  { id: 'rocky', title: 'Create rocky landscapes',
    rule: 'Drei Gr\u00f6\u00dfen wachsen zur Formation zusammen: gro\u00df unten, mittel am Fu\u00df, Bauwerk oben.',
    source: 'Nature Usage Guide, rechts', build: buildRocky },
  { id: 'village', title: 'Dorfinsel',
    rule: 'Wald, Felder, Wiese frei drehbar \u2014 Fluss und Stra\u00dfe nicht. Deren Winkel kommt aus dem Kantenl\u00f6ser, und jede Fuge wird nachgepr\u00fcft.',
    source: 'Packbild 1, rechte Insel', build: buildVillage },
];

/* ── Betrachter ──────────────────────────────────────────────────────────────────────
   EIN RENDERER FÜR ALLE FÄLLE (Projektregel 5). Die erste Fassung gab jedem Fall einen
   eigenen `WebGLRenderer` — mit dem des Kontaktbogens waren das fünf Kontexte, und der
   Browser opfert bei Bedarf den ÄLTESTEN. Genau der gehörte dem ersten Fall, der deshalb
   schwarz blieb, während sein Bericht 32 gesetzte Teile meldete. Ein leeres Bild neben
   einer Erfolgszahl ist die schlechteste Kombination.

   Jetzt rendert ein einziger Kontext reihum in ein Offscreen-Canvas, und jedes Fall-Canvas
   bekommt das Bild per `drawImage`. Die Maussteuerung hängt trotzdem am sichtbaren Canvas —
   OrbitControls braucht nur ein Element, das Events liefert. */
let shared = null;
const stages = new Set();
function sharedRenderer() {
  if (shared) return shared;
  const cv = document.createElement('canvas');
  const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true });
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  shared = { renderer, cv };
  const tick = () => { requestAnimationFrame(tick); for (const st of stages) st.draw(); };
  tick();
  return shared;
}

export function makeStage(canvas, opts = {}) {
  const { renderer, cv } = sharedRenderer();
  let ctx = canvas.getContext('2d');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(opts.bg ?? 0x1b1f26);
  scene.add(new THREE.HemisphereLight(0xdfefff, 0x3b4252, 1.7));
  const sun = new THREE.DirectionalLight(0xffffff, 2.0);
  sun.position.set(6, 11, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12, near: 0.5, far: 40 });
  scene.add(sun);
  const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
  const ctrl = new OrbitControls(cam, canvas);
  ctrl.enableDamping = true;
  ctrl.enablePan = false;
  let obj = null;

  /* DREI BENANNTE SICHTEN (Guardrail G5). Ein Winkel zeigt nie, was ein Teil ist: die
     Draufsicht klärt Grundriss und Zellraster, die Dreiviertelsicht die Komposition, und
     erst die SEITENANSICHT verrät Höhenstufen und Auflieger. Der flache `building_grain`
     war von schräg oben nicht von einer Kachel zu unterscheiden. */
  const VIEWS = {
    top:  { dir: [0.0, 1.0, 0.001], label: 'Draufsicht' },
    iso:  { dir: [0.62, 0.62, 0.72], label: 'Dreiviertel' },
    side: { dir: [0.05, 0.16, 1.0], label: 'Seitenansicht' },
  };
  let view = 'iso';
  const fit = () => {
    if (!obj) return;
    const box = new THREE.Box3().setFromObject(obj);
    const c = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const rad = Math.max(size.x, size.y, size.z) * 0.62;
    const dist = rad / Math.tan((cam.fov * Math.PI) / 360) * 1.12;
    ctrl.target.copy(c);
    const d = VIEWS[view].dir;
    cam.position.set(c.x + dist * d[0], c.y + dist * d[1], c.z + dist * d[2]);
    cam.near = dist / 60; cam.far = dist * 12;
    cam.updateProjectionMatrix();
  };
  const resize = () => {
    const w = Math.max(64, canvas.clientWidth || 480), h = Math.max(64, canvas.clientHeight || 320);
    canvas.width = w; canvas.height = h;
    cam.aspect = w / h; cam.updateProjectionMatrix();
  };
  const st = {
    show(group) {
      if (obj) scene.remove(obj);
      obj = group;
      obj.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      scene.add(obj);
      resize(); fit();
      stages.add(st);
    },
    /* Gezeichnet wird nur, was sichtbar ist — vier beschattete Szenen in jedem Bild kosten
       sonst dauerhaft Rechenzeit für Canvas, die niemand ansieht. */
    draw() {
      if (!obj || !canvas.isConnected || !canvas.offsetParent) return;
      if (canvas.width !== Math.max(64, canvas.clientWidth)) resize();
      ctrl.update();
      renderer.setSize(canvas.width, canvas.height, false);
      renderer.render(scene, cam);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(cv, 0, 0);
    },
    /* Der Bildschirm wird bei jedem Tabwechsel neu geschrieben — `#pane.innerHTML` erzeugt
       NEUE Leinwände, während die zwischengespeicherte Bühne in ihrem Closure noch die alte,
       abgelöste hielt. `draw()` brach dort an `!canvas.isConnected` ab und bediente das neue
       Element nie: vier leere Kästen in Default-Größe, bei laufender Renderschleife.
       Statt die Bühne wegzuwerfen (und Kamerawinkel und Szene mit ihr) tauscht sie das
       Element. */
    attach(next) {
      canvas = next;
      ctx = next.getContext('2d');
      resize(); fit();
      stages.add(st);
    },
    resize, fit,
    setView(v) { if (VIEWS[v]) { view = v; fit(); } },
    views: VIEWS,
    stop() { stages.delete(st); },
  };
  return st;
}
