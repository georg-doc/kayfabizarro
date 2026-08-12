// ============================================================================
// zone-ring.js — KFB Travel v13 · Slice S84 · Der player-zentrierte Hex-Ring
// ----------------------------------------------------------------------------
// v12 hat die Welt als STERN gebaut: `academy-cards.place()` legte jede Deck-Zone
// auf einen Strahl `chapter * 72° + 18°` vom Nullpunkt nach außen. Das war eine
// zweite Wahrheit neben den Daten — die Lage einer Zone stand im Code, nicht in
// der Registry, und die Reise war die Deck-Reihenfolge.
//
// v13 dreht das um (BRIEF §4 B1/B4): die Zonen, ihre Biome, ihre Lage und ihre
// Sprungziele stehen in `zone-index.json` (Struktur-Wahrheit) und
// `zone-registry.json` (Ableitungs-Wahrheit). Dieses Modul liest sie und ist
// **der einzige Eigentümer der Zonen-Lage**.
//
// DIE VIER REGELN, die den Bau bestimmen:
//
// 1. **Nichts, was die Registry ableiten kann, steht hier als Zahl.** Modus,
//    Biome, Ebene und Seed kommen aus `derive()` — genau die Rechnung des Card
//    Zone Lab v2 (`dev()` = Abstand zum POOL-MITTEL, nicht Rohwert; sonst gewinnt
//    immer `power` und alles wird heroic). Hand-Korrekturen gehören in
//    `zone-registry.overrides.byZone`, nicht in dieses Modul.
// 2. **Das Gitter ist um den Spieler zentriert** (`hexGrid.playerCentered`),
//    flat-top, axial. Gebaut wird `center + 6 neighbors` (Contract) plus die
//    zweite Schale — ohne sie stehen im Blickfeld (65° FOV) nur ~1 Zone statt der
//    verlangten ~3, weil sechs Nachbarn zwangsläufig 60° auseinander liegen.
// 3. **Keine vorgegebenen Wege, keine Strahlenwinkel.** Welche Karte auf welchem
//    Nachbar-Hex landet, entscheiden die Kanten der Registry (`edges.flow` =
//    gleiches Deck, nächste Nummer; `edges.river` = benachbarte Biome) und die
//    RICHTUNG, in der das Biome laut `hexHomes` liegt. Kein Winkel im Code.
// 4. **Eine Zahl gegen Überlagerung: `minSep` (Grad).** Das ist die eine
//    Stellschraube mit einem Eigentümer (BRIEF B1). Sie korrigiert Paare, die aus
//    Sicht der Kamera hintereinander stehen, indem der FERNERE um das Defizit um
//    den Spieler gedreht wird — es gibt keine zweite Platzierungslogik.
//
// GEMESSEN wird über `sweep(camera)`: eine 360°-Drehung in 24 Schritten liefert
// Mittel/Min/Max der sichtbaren Zonen, den kleinsten Winkelabstand und die Zahl
// echter Überlagerungen (Winkelabstand < Summe der Halbbreiten). Abnahme: Mittel
// ~3, Überlagerungen 0.
//
//   const ring = createZoneRing({ THREE });
//   if (await ring.load()) { ring.derive(cards); ring.recenter(pos, anchor); }
//   ring.homeOf(card)            // Vector3 oder null
//   ring.report() / ring.sweep(camera)
// ============================================================================

import { cardSemanticVector, joinSeeds, mulberry32, MODES } from './world-context.js';

// Die sechs Achsen-Richtungen des axialen Gitters (flat-top). Reihenfolge ist die
// kanonische aus dem Hex-Contract — sie ist Daten-Ordnung, kein Gestaltungswinkel.
const AX_DIRS = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]];

// Welche Vektor-Dimension welchen D6-Modus ruft. 1:1 aus `KFB Card Zone Lab v2`
// (`seedMode()`) — dieselbe Karte muss in beiden Werkzeugen dieselbe Zone ergeben,
// sonst hätte die Registry zwei Ableitungs-Wahrheiten.
const MODE_DIM = [
  ['tragic', 'melancholy'], ['comic', 'humor'], ['absurd', 'chaos'],
  ['heroic', 'power'], ['mystical', 'wonder'], ['forbidden', 'threat'],
];

export function createZoneRing(opts = {}) {
  const THREE = opts.THREE;
  const P = Object.assign({
    // u — Abstand zweier Hex-Mittelpunkte. **Der eine Eigentümer der Dichte.**
    // 150 u ist der Ausgangswert aus v12 (`zoneNear` 150, `zoneStep` 105 lagen bei
    // gemessen ~3 Karten im Bild); die Abnahme-Zahl ist `sweep().mittel`.
    hexSize: 132,
    // Schalen um den Spieler. 1 = Contract-Minimum (center + 6 neighbors),
    // 2 = was es braucht, damit im 65°-Fenster mehr als eine Zone steht.
    shells: 2,
    // **Der Kachel-Versatz ist die EINZIGE Trennung** (BRIEF B1): der tangentiale Versatz einer Kachel,
    // als Anteil des halben Kachelabstands. Er wirkt beim PLATZIEREN und ist damit in der Welt
    // verankert — eine Zone, die einmal steht, steht. 0.45 · 66 u = 30 u seitlich.
    stagger: 0.45,
    // Nur für die MESSUNG: ab welchem Vielfachen der Berührungsgrenze ein Paar als „eng" gezählt wird.
    sep: 1.35,
    // **S87 · Ausweichen ist standardmäßig AUS, und das ist eine Entscheidung, kein Versehen.**
    // Georgs Befund: „viele Karten bewegen sich sichtbar ruckartig am Horizont beim 6-km/h-Basis-Flug".
    // Gemessen: eine Karte wanderte **73,8 u in 2 s**, während der Spieler 3,6 u/s flog — zehnmal
    // schneller als die Welt. Der Grund ist Bauart, nicht Feinschliff: `settle` rechnete gegen die
    // KAMERA, und die bewegt sich jeden Frame. Bei 250 u Entfernung sind 24 °/s über 100 u/s
    // Querbewegung, und ein Paar, das aus der Bedingung fällt, hört mitten in der Drehung auf — das
    // ist genau das Ruckeln.
    //
    // Dahinter liegt der eigentliche Denkfehler: „aus KEINER Kamerastellung überlagert sich etwas" ist
    // mit stillstehenden Karten nicht erfüllbar, also war es das falsche Ziel. Die Prime Directive
    // sagt, was gilt: keine Bewegung ohne Anlass. **Eine Zone steht in der Welt und bleibt stehen**;
    // getrennt wird räumlich (Kachel-Versatz + die abgeleiteten Ebenen up/mid/down), und was dann noch
    // hintereinander steht, ist Tiefe — dafür dreht man den Kopf. Der Regler bleibt für Vergleiche.
    settleRate: 0,
    // u — bis hierher gilt eine Zone als LESBAR. Das ist die Zahl, an der „im Schnitt ~3 Zonen im
    // sichtbaren Bereich" hängt (v12 zählte mit 260 u dieselbe Klasse). Alles dahinter ist Tiefe,
    // keine Wand.
    visR: 250,
    // Höhenband. **`yOverPlayer` ist keine Weltkoordinate, sondern der Abstand ÜBER dem Spieler** — das
    // ist die Regel aus v12 (`follow`: Band auf die Flughöhe legen, geklemmt auf 26–62 u). S84 hatte hier
    // absolute 34 u stehen, und das war Georgs „einige Karten stehen in Cubes": das Terrain reicht an
    // vielen Stellen höher, die Karte steckte im Berg. Die Ebene (up/mid/down) bleibt abgeleitet.
    // Die Ebene ist eine Aussage über die Karte, kein Anspruch auf eine Weltkoordinate.
    // Als zweite Trennung (übereinander statt ineinander) wurden 30 u je Stufe probiert — gemessen
    // wurde es SCHLECHTER (22 Überlagerungen gegen 9 bei 22 u): das Boden-Veto (`clear`) hebt tief
    // gelegte Zonen wieder an, die Ebenen fallen dadurch teilweise zusammen, und mehr Karten landen
    // auf ähnlicher Höhe. Also zurück auf 22 — eine Änderung, die nichts bringt, ist keine Änderung.
    yOverPlayer: 8, yMin: 26, yMax: 62, yLevel: 22, yJitter: 7,
    // u — Mindestluft zwischen Kartenmitte und höchstem Würfel darunter. Die Karte ist rund 13 u hoch,
    // also braucht die Mitte gut die halbe Höhe plus Reserve. Gemessen wird der KLEINSTE Wert über alle
    // Zonen (`report().luft`), Soll: > 0 (besser: nahe `clear`).
    clear: 16,
    // Anteil des Hex-Radius, den eine Karte innerhalb ihrer Kachel abweichen darf (nur noch die
    // radiale Unruhe — der tangentiale Versatz ist `stagger`).
    inHex: 0.3,
    // Kartenbreite (u) — nur für die Überlagerungs-Messung (Halbwinkel).
    cardW: 30,
    levelSplit: 0.35,   // Schwelle für up/down auf der (wonder+humor)−(threat+melancholy)-Achse
    seed: 4242,
  }, opts.params || {});

  let atlas = null, reg = null, ok = false;
  const zones = new Map();        // cardKey → { mode, biome, level, seed, hex:[q,r] }
  const homes = new Map();        // cardKey → THREE.Vector3 (SOLL-Lage)
  const shown = new Map();        // cardKey → THREE.Vector3 (was wirklich in der Welt steht)
  const slots = new Map();        // "q,r" → cardKey
  const locked = new Set();       // cardKey — Anflugziel: Platz eingefroren
  let baseline = null, pool = [], center = null, lastCenter = null, lastAnchor = '';
  let stat = { slots: 0, belegt: 0, neu: 0, korrigiert: 0 };
  // Der Boden. Ohne ihn kann der Ring nicht wissen, ob eine Kachel im Berg liegt — mit ihm ist es eine
  // Abfrage, keine Schätzung. Fehlt der Haken, verhält sich der Ring wie S84 (nur Höhenband).
  let groundAt = null, baseY = 40, lowClear = 1e9;

  const keyOf = (card) => {
    const d = card && card.data ? card.data : card || {};
    return String(d.packId || 'ø') + '#' + String(d.n != null ? d.n : d.route);
  };
  const hexKey = (h) => h[0] + ',' + h[1];

  // ---------------------------------------------------------------- Daten holen
  // **Auf „läuft" gaten, nie auf „existiert"**: fehlt eine der beiden Dateien oder
  // ist sie unvollständig, bleibt `ok` false und `academy-cards` behält sein
  // v12-Raster. Ein halb geladener Ring wäre schlimmer als keiner.
  async function load() {
    try {
      const [a, r] = await Promise.all([
        fetch(new URL('../zone-index.json', import.meta.url)).then((x) => x.json()),
        fetch(new URL('../zone-registry.json', import.meta.url)).then((x) => x.json()),
      ]);
      if (!a || !Array.isArray(a.biomes) || !a.biomes.length) throw new Error('zone-index ohne biomes');
      if (!r || !r.modeBiome || !r.hexHomes) throw new Error('zone-registry ohne modeBiome/hexHomes');
      atlas = a; reg = r; ok = true;
    } catch (e) {
      console.warn('[zone-ring] Zonen-Daten nicht nutzbar — v12-Raster bleibt', e);
      ok = false;
    }
    return ok;
  }

  const biomeOf = (id) => (atlas ? atlas.biomes.find((b) => b.id === id) : null);
  const hexHome = (biomeId) => {
    const h = reg && reg.hexHomes ? reg.hexHomes[biomeId] : null;
    return Array.isArray(h) ? h : [0, 0];
  };

  // ---------------------------------------------------------------- Ableitung
  // Der Vektor braucht die Karten-Felder, die `card-registry` normalisiert hat
  // (title/power/lore) — vor `fillDeck` steht dort nur ein Platzhalter, dann ist
  // die Ableitung neutral und wird beim nächsten `derive()` nachgeholt.
  const toSemantic = (d) => ({
    cardNumber: d.n, cardName: d.title || '', power: d.power || '', lore: d.lore || '',
    grade: d.grade || 2, gradeReason: d.gradeReason || '', artworkPrompt: d.artworkPrompt || '',
  });
  const roleOf = (d) => String(d.role || d.deckRole || '').toUpperCase();

  function derive(cards) {
    if (!ok) return 0;
    pool = (cards || []).filter((c) => c && c.data && c.data.kind === 'kfbcard');
    if (!pool.length) return 0;
    // Pool-Mittel EINMAL für alle Karten: die Abweichung ist der ganze Trick der
    // Ableitung, und ein Mittel pro Karte wäre keins.
    const sum = {}; let n = 0;
    const vecs = new Map();
    for (const c of pool) {
      const v = cardSemanticVector(toSemantic(c.data), roleOf(c.data));
      vecs.set(keyOf(c), v);
      for (const k in v) sum[k] = (sum[k] || 0) + v[k];
      n++;
    }
    baseline = {}; for (const k in sum) baseline[k] = sum[k] / n;

    zones.clear();
    for (const c of pool) {
      const d = c.data, k = keyOf(c);
      const v = vecs.get(k);
      const dev = (key) => Math.max(0, Math.min(1, 0.5 + ((v[key] || 0) - (baseline[key] != null ? baseline[key] : 0.35)) * 2.6));
      // stärkste ABWEICHUNG → Modus (nicht stärkster Rohwert)
      let mode = MODE_DIM[0][0], best = -1;
      for (const [m, dim] of MODE_DIM) { const s = dev(dim); if (s > best) { best = s; mode = m; } }
      const ov = reg.overrides && reg.overrides.byZone ? reg.overrides.byZone[k] : null;
      if (ov && ov.mode) mode = ov.mode;
      let biome = (reg.modeBiome && reg.modeBiome[mode]) || atlas.biomes[0].id;
      if (ov && ov.biome) biome = ov.biome;
      // Ebene: Staunen+Humor gegen Bedrohung+Schwermut (Registry `derivation.level`).
      const lift = (dev('wonder') + dev('humor')) - (dev('threat') + dev('melancholy'));
      let level = lift > P.levelSplit ? 'up' : (lift < -P.levelSplit ? 'down' : 'mid');
      if (ov && ov.level) level = ov.level;
      const seed = joinSeeds(String(d.packId || 'ø'), String(d.n != null ? d.n : 0), 'kfb-zone');
      zones.set(k, { key: k, card: c, mode, biome, level, seed, lift: +lift.toFixed(3),
                     dev: best, hexHome: hexHome(biome) });
    }
    lastCenter = null;   // Ableitung geändert → Lage neu vergeben
    return zones.size;
  }

  // ---------------------------------------------------------------- Hex ⇄ Welt
  // flat-top, axial: Nachbarn liegen genau `hexSize` auseinander. `s` ist der
  // Umkreisradius, `hexSize` der Mittelpunkt-Abstand — eine Zahl, eine Ableitung.
  const S = () => P.hexSize / Math.sqrt(3);
  function axialToWorld(q, r, out) {
    const s = S();
    const v = out || new THREE.Vector3();
    return v.set(1.5 * s * q, 0, Math.sqrt(3) * s * (r + q / 2));
  }
  function worldToAxial(x, z) {
    const s = S();
    const q = (2 / 3) * x / s;
    const r = z / (Math.sqrt(3) * s) - q / 2;
    // Cube-Rounding: ohne sie springt die Mitte an den Kachelgrenzen zweimal.
    let cx = q, cz = r, cy = -cx - cz;
    let rx = Math.round(cx), ry = Math.round(cy), rz = Math.round(cz);
    const dx = Math.abs(rx - cx), dy = Math.abs(ry - cy), dz = Math.abs(rz - cz);
    if (dx > dy && dx > dz) rx = -ry - rz; else if (dy > dz) ry = -rx - rz; else rz = -rx - ry;
    return [rx, rz];
  }
  function ringSlots(c, shells) {
    const out = [];
    for (let dq = -shells; dq <= shells; dq++) {
      for (let dr = Math.max(-shells, -dq - shells); dr <= Math.min(shells, -dq + shells); dr++) {
        if (!dq && !dr) continue;                       // die Kachel des Spielers bleibt frei
        const dist = Math.max(Math.abs(dq), Math.abs(dr), Math.abs(dq + dr));
        out.push({ h: [c[0] + dq, c[1] + dr], ring: dist });
      }
    }
    // Stabile Ordnung: erst innere Schale (Contract-Preload), dann Winkel.
    const _p = new THREE.Vector3(), _c = axialToWorld(c[0], c[1]);
    for (const s of out) { axialToWorld(s.h[0], s.h[1], _p); s.ang = Math.atan2(_p.x - _c.x, _p.z - _c.z); }
    out.sort((a, b) => (a.ring - b.ring) || (a.ang - b.ang));
    return out;
  }

  // ---------------------------------------------------------------- Vergabe
  // Kandidaten-Ordnung = die Kanten der Registry, nicht die Deck-Liste:
  //   1. `edges.flow`  — gleiches Deck, nächste Kartennummer (Leserichtung)
  //   2. `edges.river` — Zonen benachbarter Biome (`adjacency` im Atlas)
  //   3. der Rest, unbesuchte zuerst (der Lernstand schiebt die Reise vorwärts)
  function candidates(anchorKey) {
    const list = [...zones.values()];
    const a = anchorKey ? zones.get(anchorKey) : null;
    const adj = a ? (biomeOf(a.biome) || {}).adjacency || [] : [];
    const rank = (z) => {
      if (a && z.key === a.key) return 9;
      if (a && z.card.data.packId === a.card.data.packId && z.card.data.n > a.card.data.n) return 0;   // flow
      if (a && adj.indexOf(z.biome) >= 0) return 1;                                                    // river
      return 2;
    };
    return list.sort((x, y) => (rank(x) - rank(y))
      || ((x.card.data.visited ? 1 : 0) - (y.card.data.visited ? 1 : 0))
      || (x.seed - y.seed));
  }

  // Die Richtung, in der ein Biome laut Registry liegt — von der Heimat des Ankers
  // zur Heimat des Kandidaten. **Daraus entstehen die Winkel**, nicht aus Code.
  const _bd = new THREE.Vector3(), _sd = new THREE.Vector3(), _h0 = new THREE.Vector3(), _h1 = new THREE.Vector3();
  function biomeDir(z, aZone, out) {
    const from = aZone ? aZone.hexHome : [0, 0];
    axialToWorld(from[0], from[1], _h0);
    axialToWorld(z.hexHome[0], z.hexHome[1], _h1);
    const v = (out || _bd).subVectors(_h1, _h0);
    if (v.lengthSq() < 1e-6) v.set(0, 0, 1);
    return v.normalize();
  }

  function recenter(pos, anchorCard, force, obs) {
    if (!ok || !zones.size || !pos) return 0;
    const c = worldToAxial(pos.x, pos.z);
    const aKey = anchorCard ? keyOf(anchorCard) : '';
    // **S87 · Neu vergeben wird NUR bei einem Kachelwechsel** — der Anker zählt nicht mehr mit.
    // Vorher stand `aKey === lastAnchor` in der Bedingung: jedes neue Blickziel warf damit die ganze
    // Kachelvergabe neu, und weil die Kandidaten-Ordnung am Anker hängt, zogen Karten um, während man
    // nur hinsah. Der Anker darf die REIHENFOLGE beeinflussen, aber kein Ereignis sein. Gemessen:
    // Wanderung im Ruheflug von 73,8 u je 2 s auf unter 1 u.
    if (!force && lastCenter && lastCenter[0] === c[0] && lastCenter[1] === c[1]) return 0;
    lastAnchor = aKey; lastCenter = c; center = c;

    const list = ringSlots(c, P.shells);
    const cand = candidates(aKey);
    const used = new Set();
    // Festgeschriebene Karten (Anflugziel) behalten Platz UND Kachel: eine Karte,
    // die während der Ankunft umzieht, ist Georgs „dreht sich durch die Karte weg".
    for (const k of locked) if (zones.has(k)) used.add(k);
    const nextSlots = new Map();
    for (const k of locked) {
      const home = homes.get(k);
      if (!home) continue;
      nextSlots.set(hexKey(worldToAxial(home.x, home.z)), k);
    }

    let neu = 0;
    const aZone = aKey ? zones.get(aKey) : null;
    // **S89 · Besuchte Zonen kommen nicht zurück.** Georgs Befund: „eine besuchte Karte taucht nach
    // kurzer Strecke wieder vor mir auf". Das war keine Doppelung, sondern Arithmetik: zwei Schalen
    // ergeben **18 Kacheln**, und es gibt **18 Zonen** — also bekam JEDE Karte immer einen Platz um
    // den Spieler, auch die längst gelesene, und beim Kachelwechsel landete sie wieder vorne.
    // Jetzt werden besuchte Zonen übersprungen, solange es noch unbesuchte gibt. Die Welt dünnt sich
    // also aus, während man liest — das ist der Lernstand, den man SIEHT. Sind alle besucht, greift
    // wieder der ganze Pool (sonst stünde man am Ende im Leeren).
    const offen = [...zones.values()].filter((z) => !z.card.data.visited).length;
    const nurOffen = offen > 0;
    for (const s of list) {
      const hk = hexKey(s.h);
      if (nextSlots.has(hk)) continue;
      axialToWorld(s.h[0], s.h[1], _sd);
      _sd.sub(axialToWorld(c[0], c[1], _h0)).normalize();
      // Beste Passung Slot-Richtung ↔ Biome-Richtung; bei Gleichstand gewinnt die
      // Kandidaten-Ordnung (flow vor river vor Rest).
      let pick = null, bs = -1e9;
      for (let i = 0; i < cand.length; i++) {
        const z = cand[i];
        if (used.has(z.key)) continue;
        if (nurOffen && z.card.data.visited && !locked.has(z.key)) continue;
        const dot = biomeDir(z, aZone, _bd).dot(_sd);
        const score = dot * 2 - i * 0.02;
        if (score > bs) { bs = score; pick = z; }
      }
      if (!pick) break;
      used.add(pick.key);
      nextSlots.set(hk, pick.key);
      if (slots.get(hk) !== pick.key) neu++;
      // **Der Platz in der Kachel ist die Trennung** (kein Nachtrag, keine zweite Logik).
      // Zwei Kacheln in derselben Richtung (Schale 1 und Schale 2) ständen aus der Mitte exakt
      // hintereinander — das war messbar der einzige Überlagerungs-Fall (11 Paare je 360°-Drehung).
      // Also wird jede Kachel TANGENTIAL versetzt, mit dem Vorzeichen der Schale: Schale 1 nach
      // links, Schale 2 nach rechts, Schale 3 wieder links. Aus 0° werden so ~22° (bei `stagger`
      // 0.45: 34 u seitlich, 130 u vs. 260 u Entfernung). Das hält auch, während der Spieler fliegt —
      // ein nachträgliches Wegdrehen hätte nur für EINEN Kamerapunkt gestimmt (so gemessen).
      const rnd = mulberry32(pick.seed);
      const li = pick.level === 'up' ? 1 : (pick.level === 'down' ? -1 : 0);
      const home = homes.get(pick.key) || new THREE.Vector3();
      axialToWorld(s.h[0], s.h[1], home);
      const sign = (s.ring % 2) ? 1 : -1;
      const tan = sign * P.stagger * (P.hexSize / 2) * (0.8 + 0.4 * rnd());
      home.x += -_sd.z * tan; home.z += _sd.x * tan;              // senkrecht zur Blickrichtung
      const rad = (rnd() - 0.5) * 2 * 0.08 * P.hexSize;           // wonky, nicht gerastert
      home.x += _sd.x * rad; home.z += _sd.z * rad;
      home.y = liftAt(home.x, home.z, li, rnd);
      homes.set(pick.key, home);
    }
    // Karten ohne Kachel liegen außerhalb des Rings — sie behalten ihre letzte
    // Lage (kein Umschieben in den Nullpunkt, sonst reißt die Welt beim Drehen).
    slots.clear();
    for (const [k, v] of nextSlots) slots.set(k, v);
    stat = { slots: list.length, belegt: nextSlots.size, neu };
    return neu;
  }

  // Die Höhe einer Zone: Band um die Flughöhe, versetzt um ihre abgeleitete Ebene — und darüber liegt
  // das Veto des Bodens. Eine Karte darf ÜBER ihrer Ebene stehen, wenn ein Berg es verlangt; darunter
  // nie. Die Ebene ist eine Aussage über die Karte, kein Anspruch auf eine Weltkoordinate.
  function liftAt(x, z, li, rnd) {
    const jit = rnd ? (rnd() - 0.5) * 2 * P.yJitter : 0;
    let y = baseY + li * P.yLevel + jit;
    if (groundAt) {
      const g = groundAt(x, z);
      if (g + P.clear > y) y = g + P.clear;
    }
    return y;
  }

  // Der Boden bewegt sich nicht, aber der Spieler und das Terrain unter ihm schon (neue Chunks,
  // Weltwechsel). Die Höhe wird deshalb nachgeführt, OHNE die Kachel-Vergabe anzufassen — dieselbe
  // Trennung wie in v12, wo `follow` auch nur das Band nachzog.
  function reheight(player) {
    if (!ok || !homes.size) return 0;
    if (player) {
      const want = Math.max(P.yMin, Math.min(P.yMax, player.y + P.yOverPlayer));
      baseY += (want - baseY) * 0.08;   // weich, damit ein Steigflug die Welt nicht mitreißt
    }
    let moved = 0; lowClear = 1e9;
    for (const [k, v] of homes) {
      // **S88 · Ein Ziel, das man anfliegt, bewegt sich NICHT — auch nicht nach oben.** Das war der
      // Fehler hinter Georgs „Pet fliegt unter der Karte durch": `lock` hielt x/z fest, aber die Höhe
      // lief weiter durch dieses Band. Gemessen an EINEM Anflug: die Karte stieg von 31,9 auf 67,6 u
      // (+35,7 u), weil der Spieler steigt und das Band ihm folgt — und in der Landung noch 1,0 u
      // weiter, während das Pet stand. Ergebnis: das Pet endet unter der Karte. Die Bremskurve der
      // Regie rechnet dabei gegen ein Ziel, das es nicht mehr gibt.
      if (locked.has(k)) { if (groundAt) lowClear = Math.min(lowClear, v.y - groundAt(v.x, v.z)); continue; }
      const z = zones.get(k);
      const li = z ? (z.level === 'up' ? 1 : (z.level === 'down' ? -1 : 0)) : 0;
      const rnd = z ? mulberry32(z.seed) : null;
      if (rnd) { rnd(); rnd(); }   // dieselben zwei Züge wie bei der Vergabe → derselbe Jitter
      const y = liftAt(v.x, v.z, li, rnd);
      if (Math.abs(y - v.y) > 0.05) { v.y = y; moved++; }
      if (groundAt) lowClear = Math.min(lowClear, v.y - groundAt(v.x, v.z));
    }
    return moved;
  }

  // ---------------------------------------------------------------- Die Trennung (laufend)
  // Kein zweites Raster: gedreht wird um den BEOBACHTER, mit `settleRate`, und niemals das
  // eingefrorene Anflugziel. **Alle Zonen, nicht nur die im Bild**: die Bedingung lautet „in KEINER
  // Kameradrehung überlagern sich zwei sichtbare Karten" — wer nur das aktuelle Bild aufräumt, hat
  // messbar nichts getan (Trennung im Bild: 0 Paare, während die 360°-Messung 10 Überlagerungen
  // zeigte). Der Preis: eine ausgewichene Karte kann in die Nachbarkachel wandern. Das ist
  // hingenommen — die Kachel ist die Herkunft der Zone, nicht ihr Gefängnis.
  let settleStat = { paare: 0, grad: 0 };
  function settle(dt, camera) {
    // Rate 0 = aus, und aus heißt NICHT ANFASSEN. Vorher lief die Schleife trotzdem durch und schrieb
    // jede Lage aus Polarkoordinaten zurück — bei Schrittweite 0 war das reine Rundungsdrift, gemessen
    // 1,2 u je 3 s auf fünf Karten. Eine abgeschaltete Korrektur, die trotzdem schreibt, ist der
    // Unterschied zwischen „aus" und „existiert".
    if (!ok || !camera || !homes.size || !(dt > 0) || P.settleRate <= 0) return settleStat;
    const cp = camera.position;
    const arr = [];
    for (const [k, v] of homes) {
      const d = Math.hypot(v.x - cp.x, v.z - cp.z);
      if (d < 1) continue;
      arr.push({ k, v, d, a: Math.atan2(v.x - cp.x, v.z - cp.z), el: Math.atan2(v.y - cp.y, d) });
    }
    arr.sort((x, y) => x.d - y.d);
    const half = (d) => Math.atan((P.cardW / 2) / Math.max(1, d));
    const step = P.settleRate * Math.PI / 180 * dt;
    let paare = 0, grad = 0;
    for (let i = 1; i < arr.length; i++) {
      if (locked.has(arr[i].k)) continue;
      for (let j = 0; j < i; j++) {
        const min = (half(arr[i].d) + half(arr[j].d)) * P.sep;
        let daz = arr[i].a - arr[j].a;
        while (daz > Math.PI) daz -= Math.PI * 2;
        while (daz < -Math.PI) daz += Math.PI * 2;
        const del = arr[i].el - arr[j].el;
        if (Math.hypot(daz, del) >= min) continue;
        // Gedreht wird immer VON dem näheren weg — die fernere Karte ist die, die ausweicht.
        const dir = (daz >= 0 ? 1 : -1);
        const push = Math.min(step, min - Math.abs(daz));
        arr[i].a += dir * push;
        arr[i].v.x = cp.x + Math.sin(arr[i].a) * arr[i].d;
        arr[i].v.z = cp.z + Math.cos(arr[i].a) * arr[i].d;
        paare++; grad += push * 180 / Math.PI;
      }
    }
    settleStat = { paare, grad: +grad.toFixed(2) };
    return settleStat;
  }

  // ---------------------------------------------------------------- Die Reise
  // **Der Weg ist der Ring, nicht die Deck-Liste** (BRIEF §8, Abnahme 1). Gelaufen wird über die
  // Kanten der Registry: `flow` (gleiches Deck, nächste Nummer — Leserichtung) hat Vorrang, sonst
  // `river` (benachbartes Biome, nächste Kachel-Heimat), sonst die nächste unbesuchte Zone. Das ist
  // dieselbe Ordnung, die auch die Kacheln vergibt — eine Wahrheit, zwei Verbraucher.
  // Messbar an `kanten` in `walkReport()`: Anteil der Schritte, die wirklich eine Registry-Kante
  // benutzen (Deck-Reihenfolge käme auf ~0 river-Schritte und 2 Zonenwechsel).
  let walkStat = null;
  function walk(pos, limit) {
    if (!ok || !zones.size) return [];
    const all = [...zones.values()];
    const used = new Set();
    const startFrom = () => {
      let best = null, bd = 1e18;
      for (const z of all) {
        const h = homes.get(z.key);
        if (!h || !pos) continue;
        const d = (h.x - pos.x) * (h.x - pos.x) + (h.z - pos.z) * (h.z - pos.z);
        if (d < bd) { bd = d; best = z; }
      }
      return best || candidates('')[0];
    };
    const out = [];
    let cur = startFrom(), flow = 0, river = 0, rest = 0;
    const max = limit || all.length;
    while (cur && out.length < max) {
      used.add(cur.key); out.push(cur.card);
      const d = cur.card.data;
      let next = all.find((z) => !used.has(z.key) && z.card.data.packId === d.packId && z.card.data.n === d.n + 1);
      if (next) flow++;
      if (!next) {
        const adj = (biomeOf(cur.biome) || {}).adjacency || [];
        const near = all.filter((z) => !used.has(z.key) && adj.indexOf(z.biome) >= 0)
          .sort((x, y) => hexDist(x.hexHome, cur.hexHome) - hexDist(y.hexHome, cur.hexHome) || (x.seed - y.seed));
        next = near[0];
        if (next) river++;
      }
      if (!next) { next = candidates(cur.key).find((z) => !used.has(z.key)); if (next) rest++; }
      cur = next;
    }
    const schritte = Math.max(1, out.length - 1);
    walkStat = { länge: out.length, flow, river, rest,
                 kanten: +(((flow + river) / schritte) * 100).toFixed(1),
                 zonenwechsel: out.reduce((n, c, i) => n + (i && c.data.packId !== out[i - 1].data.packId ? 1 : 0), 0) };
    return out;
  }
  const hexDist = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]), Math.abs(a[0] + a[1] - b[0] - b[1]));

  // ---------------------------------------------------------------- Messung
  // 360° in `steps` Schritten: was steht im Bild, wie eng, überlagert es sich.
  // **Gemessen wird, was WIRKLICH in der Welt steht** (`shown`), nicht die Soll-Lage: eine Karte,
  // deren neue Kachel noch auf den Blickwechsel wartet, steht noch alt da — eine Messung der
  // Absicht wäre eine Behauptung. `wartend` sagt, wie viele noch abweichen.
  function sweep(camera, steps) {
    if (!camera || !shown.size) return null;
    const N = steps || 24;
    const fov = (camera.fov || 60) * Math.PI / 180;
    const hFov = 2 * Math.atan(Math.tan(fov / 2) * (camera.aspect || 1.6));
    const cp = camera.position;
    // Richtung UND Höhe: eine Überlagerung ist ein Ereignis auf dem Schirm, und zwei Zonen auf
    // verschiedenen Ebenen (up/mid/down) stehen dort übereinander, nicht ineinander. Nur den Azimut
    // zu messen hätte die Ebene verschwiegen, die die Registry ohnehin ableitet.
    const list = [...shown.values()].map((v) => ({
      d: Math.hypot(v.x - cp.x, v.z - cp.z),
      a: Math.atan2(v.x - cp.x, v.z - cp.z),
      el: Math.atan2(v.y - cp.y, Math.max(1, Math.hypot(v.x - cp.x, v.z - cp.z))),
    })).filter((x) => x.d > 1);
    let wartend = 0;
    for (const [k, v] of homes) { const s = shown.get(k); if (!s || s.distanceToSquared(v) > 0.25) wartend++; }
    let sum = 0, mn = 1e9, mx = 0, minSep = 1e9, overlaps = 0, eng = 0, lSum = 0, lMn = 1e9, lMx = 0;
    for (let s = 0; s < N; s++) {
      const yaw = (s / N) * Math.PI * 2;
      const vis = list.filter((x) => {
        let da = x.a - yaw;
        while (da > Math.PI) da -= Math.PI * 2;
        while (da < -Math.PI) da += Math.PI * 2;
        return Math.abs(da) <= hFov / 2;
      });
      sum += vis.length; mn = Math.min(mn, vis.length); mx = Math.max(mx, vis.length);
      const les = vis.filter((x) => x.d <= P.visR).length;
      lSum += les; lMn = Math.min(lMn, les); lMx = Math.max(lMx, les);
      for (let i = 1; i < vis.length; i++) for (let j = 0; j < i; j++) {
        let daz = Math.abs(vis[i].a - vis[j].a);
        if (daz > Math.PI) daz = Math.PI * 2 - daz;
        const del = Math.abs(vis[i].el - vis[j].el);
        const da = Math.hypot(daz, del);
        minSep = Math.min(minSep, da);
        const half = Math.atan((P.cardW / 2) / vis[i].d) + Math.atan((P.cardW / 2) / vis[j].d);
        if (da < half) overlaps++;
        else if (da < half * P.sep) eng++;
      }
    }
    return {
      mittel: +(sum / N).toFixed(2), min: mn === 1e9 ? 0 : mn, max: mx,
      lesbar: +(lSum / N).toFixed(2), lesbarMin: lMn === 1e9 ? 0 : lMn, lesbarMax: lMx,
      minWinkel: minSep === 1e9 ? null : +(minSep * 180 / Math.PI).toFixed(1),
      überlagerungen: overlaps, eng, fovGrad: +(hFov * 180 / Math.PI).toFixed(1), zonen: list.length, wartend,
    };
  }

  return {
    name: 'zone-ring',
    load, derive, recenter, walk, settle, reheight,
    // Der Boden wird EINGEHÄNGT, nicht importiert — der Ring soll nichts über das Terrain wissen
    // müssen, nur eine Frage stellen können.
    setGround(fn) { groundAt = typeof fn === 'function' ? fn : null; },
    settleReport() { return Object.assign({}, settleStat); },
    walkReport() { return walkStat ? Object.assign({}, walkStat) : null; },
    get ok() { return ok; },
    get ready() { return ok && zones.size > 0; },
    get atlas() { return atlas; },
    get registry() { return reg; },
    homeOf(card) { return homes.get(keyOf(card)) || null; },
    // Der Verbraucher (academy-cards) meldet, was er wirklich übernommen hat — nur so kann `sweep`
    // die Welt messen statt die Absicht.
    mark(card) {
      const k = keyOf(card), h = homes.get(k);
      if (!h) return false;
      const s = shown.get(k) || new THREE.Vector3();
      s.copy(h); shown.set(k, s);
      return true;
    },
    zoneOf(card) { const z = zones.get(keyOf(card)); return z ? { mode: z.mode, biome: z.biome, level: z.level, seed: z.seed, lift: z.lift } : null; },
    // Anflugziel einfrieren — der Rückweg dazu ist `unlock`.
    lock(card) { if (card) locked.add(keyOf(card)); },
    unlock(card) { if (card) locked.delete(keyOf(card)); },
    unlockAll() { locked.clear(); },
    modeInk(card) {
      const z = zones.get(keyOf(card));
      const m = z ? MODES.find((x) => x.key === z.mode) : null;
      return m ? m.ink : null;
    },
    get center() { return center ? center.slice() : null; },
    sweep,
    // Abnahme-Zeile: Kacheln, Belegung, Neuvergaben, Winkel-Korrekturen, und wie
    // die Biome verteilt sind (eine Verteilung, in der ein Biome alles gewinnt,
    // wäre der `power`-Fehler aus der Registry-Notiz).
    report() {
      const b = {};
      for (const z of zones.values()) b[z.biome] = (b[z.biome] || 0) + 1;
      const l = {};
      for (const z of zones.values()) l[z.level] = (l[z.level] || 0) + 1;
      return Object.assign({}, stat, { zonen: zones.size, hex: P.hexSize, sep: P.sep,
                                       basis: +baseY.toFixed(1),
                                       luft: lowClear === 1e9 ? null : +lowClear.toFixed(1),
                                       mitte: center ? center.join(',') : '–', biome: b, ebenen: l });
    },
    get params() { return P; },
  };
}
