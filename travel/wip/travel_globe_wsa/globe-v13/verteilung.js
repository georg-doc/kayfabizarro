// ============================================================================
// verteilung.js — v9 · Die Streuungsschicht: nachrücken statt wegwerfen
// ----------------------------------------------------------------------------
// **Georg, 1.9.:** *„die Verteilungs-/Streuungs-Logik der Props, Wegweiser und Karten muss dabei
// die aktuellen Ballungen und Leerflächen ausgleichen."*
//
// Erst der Befund, gemessen an der laufenden Welt (776 Prop-Instanzen):
//   idealer Nachbarabstand 4,11°  ·  Median tatsächlich 1,54°  ·  engster 0,08°
//   größte Lücke 17,93°  ·  151 von 776 (19,5 %) unter einem Viertel des Ideals
//
// Und dann die Korrektur an meiner ersten Lesart, denn die Hälfte davon ist **Absicht**: die
// Kokos- und Felsgruppen der Quelle sind Cluster (4–9 bzw. 3–5 Stück), sie SOLLEN eng stehen.
// *Eine Kennzahl über alle Instanzen misst die Absicht mit und nennt sie Fehler.* Was zählt, ist
// die Streuung der **Sitze** (Bauplätze) und die Größe der **Leerflächen**.
//
// Der eigentliche Fund liegt eine Ebene tiefer, in `globe-zones.planSites`: die Sitze stehen auf
// einer Fibonacci-Spirale (goldener Winkel) — die ist von sich aus gut gestreut, das ist nicht das
// Problem. Das Problem ist die **Rückweisung**: ein Kandidat im Wasser oder am Steilhang wird
// WEGGEWORFEN. Übrig bleibt eine Spirale mit Löchern genau dort, wo kein Land war — und weil die
// Überzeichnung (`overdraw`) die Zielzahl trotzdem erreicht, wandern die Ersatzsitze an das Ende
// der Spirale und liegen dort dichter. Beides zusammen ist exakt Georgs Bild: Ballungen UND Leere.
//
// **Die Reparatur ist ein Wort: nachrücken.** Ein zurückgewiesener Kandidat wird nicht verworfen,
// sondern in seiner Nachbarschaft neu gesucht (Spiralsuche im Tangentialrahmen, kleiner Radius,
// wenige Schritte). Dazu ein Mindestabstand, der ebenfalls nicht wegwirft, sondern schiebt.
// Deterministisch: derselbe Seed ergibt dieselben Plätze (Georgs Vorgabe „gleiche Welt, Props
// dürfen wandern" — die Sitze bleiben, die Streuung INNERHALB eines Sitzes darf frei sein).
//
// Diese Datei rechnet nur. Sie kennt weder Props noch Karten und entscheidet nichts über Aussehen.
// ============================================================================

/** Kleiner deterministischer Generator — dieselbe Formel wie in `globe-zones.js`. */
function seededRandom(seed) {
  let s = (seed >>> 0) || 1;
  return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 0x100000000; };
}

/** Tangentialrahmen zu `n` (zwei Einheitsvektoren senkrecht zu n und zueinander). */
function rahmen(THREE, n, t1, t2) {
  const helfer = Math.abs(n.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  t1.crossVectors(n, helfer).normalize();
  t2.crossVectors(n, t1).normalize();
}

/**
 * Sucht in der NACHBARSCHAFT von `n` einen gültigen Platz. Spirale statt Zufall, damit die
 * Verschiebung so klein wie möglich bleibt: erst nah, dann weiter.
 * @returns Vector3 oder null
 */
export function nachruecken({ THREE, n, gueltig, maxRad = 0.09, ringe = 4, proSpirale = 8 }) {
  const t1 = new THREE.Vector3(), t2 = new THREE.Vector3(), p = new THREE.Vector3();
  rahmen(THREE, n, t1, t2);
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let r = 1; r <= ringe; r++) {
    const rad = maxRad * (r / ringe);
    for (let k = 0; k < proSpirale; k++) {
      const a = ga * (r * proSpirale + k);
      p.copy(n).addScaledVector(t1, Math.cos(a) * rad)
               .addScaledVector(t2, Math.sin(a) * rad).normalize();
      if (gueltig(p)) return p.clone();
    }
  }
  return null;
}

/**
 * Streut `count` Punkte auf der Kugel: Fibonacci-Basis, Nachrücken statt Rückweisung,
 * Mindestabstand als Schub statt als Verwerfen.
 *
 * @param gueltig  (Vector3) => bool — Prädikat der Sorte (Land · Küste · Binnenland · Höhenband)
 * @param minSep   Mindestabstand in RADIANT (0 = aus). Voreinstellung: 55 % des Idealabstands —
 *                 hoch genug gegen Ballung, niedrig genug, dass Nachrücken nicht zum Ringelreihen wird.
 */
export function streuen({ THREE, count, seed = 1, salt = 0, gueltig = () => true,
                          minSep = null, jitter = 0.12, maxRad = 0.09, ringe = 4, over = null }) {
  const rnd = seededRandom((seed | 0) + salt);
  const ga = Math.PI * (3 - Math.sqrt(5));
  const dreh = rnd() * Math.PI * 2;
  const ideal = 2 * Math.asin(Math.min(1, Math.sqrt(1 / Math.max(1, count))));
  const sep = minSep != null ? minSep : ideal * 0.55;
  // ⚠ **ÜBERZEICHNUNG, und sie ist bei kleinen Zahlen der ganze Unterschied.**
  // Erste Fassung nahm genau `count` Spiralpunkte als Basis. Für 26 Sitze geht das; für **2**
  // Vulkane und **3** Leuchttürme ist es aussichtslos — zwei Würfe auf einer Kugel, von denen
  // einer Hochland treffen muss, und Nachrücken reicht nur 0,22 rad. Gemessen: 1/2 Vulkane,
  // 2/3 Leuchttürme. *Ein Sampler, der so viele Kandidaten zieht, wie er Treffer braucht, hat
  // keine Reserve — und je seltener die Sorte, desto sicherer scheitert er.*
  // Die Quelle löst dasselbe Problem mit 3000 Würfen (Volcano.ts); hier ist es eine Spirale mit
  // Überzeichnung plus dieselbe Zwei-Durchgang-Auswahl wie in `planSites`: erst alle gültigen
  // Plätze sammeln, dann gleichmäßig über den Spiralindex greifen.
  const basis = Math.max(count, Math.round(count * (over != null ? over : Math.max(8, 256 / Math.max(1, count)))));
  const punkte = [];
  const bericht = { gesucht: count, basis, direkt: 0, nachgerueckt: 0, verloren: 0,
                    gueltigePlaetze: 0, ideal, sep };
  const frei = [];
  for (let i = 0; i < basis; i++) {
    const y = 1 - (2 * (i + 0.5)) / basis;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = ga * i + dreh + (rnd() - 0.5) * jitter;
    let n = new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r).normalize();
    if (gueltig(n)) { bericht.direkt++; frei.push(n); continue; }
    const neu = nachruecken({ THREE, n, gueltig, maxRad, ringe });
    if (neu) { bericht.nachgerueckt++; frei.push(neu); }
    else bericht.verloren++;
  }
  bericht.gueltigePlaetze = frei.length;
  const stride = frei.length > 0 ? frei.length / count : 0;
  const genommen = new Uint8Array(frei.length);
  const zuNah = (p) => {
    for (const q of punkte) if (p.angleTo(q) < sep) return true;
    return false;
  };
  for (let k = 0; k < count && frei.length; k++) {
    const start = Math.min(frei.length - 1, Math.floor(k * stride));
    let gewaehlt = -1;
    for (let d = 0; d < frei.length; d++) {
      const idx = (start + (d % 2 ? -Math.ceil(d / 2) : Math.ceil(d / 2)) + frei.length) % frei.length;
      if (genommen[idx] || zuNah(frei[idx])) continue;
      gewaehlt = idx; break;
    }
    if (gewaehlt < 0) break;
    genommen[gewaehlt] = 1;
    punkte.push(frei[gewaehlt]);
  }
  bericht.gesetzt = punkte.length;
  punkte.bericht = bericht;
  return punkte;
}

/**
 * v11 · **Die Belegung** — was schon steht, in EINER Liste, damit die nächste Familie ihre Plätze
 * daneben sucht statt darauf. `frei(n, r)` ist ein Prädikat für `streuen()` (Nachrücken statt
 * Verwerfen bleibt), `merke()` trägt Gesetztes ein. Reihenfolge ist Vertrag: Landmarken → Wegweiser
 * → Vulkane → Leuchttürme → Karten → Portale werden SYNCHRON beim Start eingetragen; die asynchronen
 * Familien (Felsen, Flora) lesen die fertige Liste — dadurch bleibt dieselbe Welt dieselbe Welt.
 */
export function createBelegung({ R = 5, luft = 0.01 } = {}) {
  const liste = [];
  return {
    liste,
    merke(n, r, familie) { liste.push({ n: n.clone ? n.clone() : n, r: r || 0, familie: familie || '?' }); },
    merkeAlle(orte, r, familie) { for (const o of orte) this.merke(o.n || o, o.r != null ? o.r : r, familie); },
    frei(n, r) {
      for (const b of liste) if (n.angleTo(b.n) * R - b.r - (r || 0) < luft) return false;
      return true;
    },
    zaehle() { const z = {}; for (const b of liste) z[b.familie] = (z[b.familie] || 0) + 1; return z; },
  };
}

/**
 * v11 · **Das Familien-Abstand-Tor** (Georg, OFFENE_SLICES 1: „kleinster Abstand ZWISCHEN Familien —
 * Karte unter Leuchtturm wird meldepflichtig"). Jede Familie liefert ihre Stücke als { n, r }
 * (Richtung, Grundradius in Weltmaß). Gemessen wird die LÜCKE auf der Oberfläche: Bogen·R minus
 * beide Radien. Lücke < 0 = Überlappung. Innerhalb einer Familie wird NICHT gemessen — Cluster
 * (Triaden, Büschel) sind dort Absicht (Lehre aus dem ersten Streuungsbefund).
 * @param familien [{ name, orte: [{ n, r }] }]
 */
export function familienAbstandTor({ familien, R = 5, name = 'families' }) {
  const paare = [];
  let ueberlappungen = 0, gemessen = 0, schlimmste = null;
  for (let a = 0; a < familien.length; a++) for (let b = a + 1; b < familien.length; b++) {
    const A = familien[a], B = familien[b];
    if (!A.orte.length || !B.orte.length) continue;
    let min = Infinity, minPaar = null, ueber = 0;
    for (const p of A.orte) for (const q of B.orte) {
      const luecke = p.n.angleTo(q.n) * R - (p.r || 0) - (q.r || 0);
      gemessen++;
      if (luecke < 0) ueber++;
      if (luecke < min) { min = luecke; minPaar = [p, q]; }
    }
    ueberlappungen += ueber;
    paare.push({ a: A.name, b: B.name, min, ueber, paar: minPaar });
    if (!schlimmste || min < schlimmste.min) schlimmste = paare[paare.length - 1];
  }
  const ok = ueberlappungen === 0;
  const eng = paare.filter((p) => p.min < 0.02).sort((x, y) => x.min - y.min).slice(0, 4);
  return { ok, ueberlappungen, gemessen, paare, schlimmste,
    text: (ok ? '✓ ' : '⚠ ') + name + ': ' + familien.map((f) => f.name + ' ' + f.orte.length).join(' · ')
      + ' · ' + gemessen + ' cross-family pairs measured · ' + ueberlappungen + ' overlaps (gap < 0)'
      + (schlimmste ? ' · tightest ' + schlimmste.a + '↔' + schlimmste.b + ' gap ' + (schlimmste.min * 1000).toFixed(0) + ' mm' : '')
      + (eng.length ? ' · under 20 mm: ' + eng.map((p) => p.a + '↔' + p.b + ' ' + (p.min * 1000).toFixed(0) + ' mm' + (p.ueber ? ' (' + p.ueber + ' overlapping)' : '')).join(', ') : '') };
}

/**
 * ⚠ Das Tor. Es misst GENAU die vier Zahlen, mit denen der Befund gestellt wurde — sonst wäre
 * „besser" eine Behauptung. `proben` Richtungen für die Leerflächen (gleichverteilt, Fibonacci).
 */
export function streuungTor({ THREE, punkte, name = 'sites', gueltig = null, proben = 2000,
                              reichweite = 0.09 }) {
  const n = punkte.length;
  if (n < 2) return { idle: true, ok: null, text: '— ' + name + ': ' + n + ' points, nothing to measure' };
  const grad = 180 / Math.PI;

  // ⚠ **Erst die FLÄCHE, dann das Ideal — und das war der Fehler der ersten Fassung.**
  // Sie rechnete `ideal = 2·asin(√(1/n))` = 22,62° für 26 Sitze, also so, als dürften Sitze auf der
  // GANZEN Kugel stehen. Sie dürfen nur auf Land: die Abnahme zählte 465 von 1200 Proben als gültig
  // (38,8 %), das flächenrichtige Ideal ist damit `2·asin(√(f/n))` ≈ **14,03°** — und der gemessene
  // Median 13,14° sind davon 94 %, also ein Bestehen. Die Zeile meldete ✗ auf eine Schicht, deren
  // Platzierungszahlen gleichzeitig 24 Nachrücker und **null** Ballungen auswiesen.
  // *Ein Instrument, das dauerhaft ✗ meldet, erzieht dazu, es zu überlesen* (§05q, hier an mir selbst).
  const ga = Math.PI * (3 - Math.sqrt(5));
  const _p = new THREE.Vector3();
  let luecke = 0, gezaehlt = 0, fern = 0;
  const abstaende = [];
  for (let i = 0; i < proben; i++) {
    const y = 1 - (2 * (i + 0.5)) / proben;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const th = ga * i;
    _p.set(Math.cos(th) * r, y, Math.sin(th) * r).normalize();
    if (gueltig && !gueltig(_p)) continue;
    gezaehlt++;
    let best = Infinity;
    for (const q of punkte) { const d = _p.angleTo(q); if (d < best) best = d; }
    abstaende.push(best);
    if (best > luecke) luecke = best;
  }
  const anteil = gueltig ? (gezaehlt / Math.max(1, proben)) : 1;
  const ideal = 2 * Math.asin(Math.min(1, Math.sqrt(anteil / n))) * grad;

  const nn = [];
  for (let i = 0; i < n; i++) {
    let best = Infinity;
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const d = punkte[i].angleTo(punkte[j]);
      if (d < best) best = d;
    }
    nn.push(best * grad);
  }
  nn.sort((a, b) => a - b);
  const median = nn[Math.floor(nn.length / 2)];
  const eng = nn.filter((d) => d < ideal * 0.25).length;

  // ⚠ **Dritte Fassung des Urteils, und die zweite war auch falsch.** Fassung 2 verlangte, dass
  // höchstens ein Viertel der gültigen Fläche weiter als 1,5 Ideale von einem Sitz weg liegt —
  // eine DECKUNGS-Forderung, die niemand gestellt hat. 26 Landmarken auf einer Kugel sollen selten
  // sein; dass Land dazwischen liegt, ist der Sinn der Sache, kein Fehler. Nach dem Spiralen-Fix
  // meldete sie weiter ✗ (62,9 %), obwohl die größte Lücke von 125,6° auf 36,4° gefallen war.
  // Georgs Befund heißt „Ballungen und Leerflächen", nicht „Deckung". Beides ist RELATIV messbar:
  //   Ballung  = Nachbarabstände deutlich unter dem flächenrichtigen Ideal
  //   Leerfläche = eine Lücke, die deutlich größer ist als der TYPISCHE Abstand zum nächsten Sitz
  // Die absoluten Deckungszahlen bleiben als Angabe stehen, nur nicht im ✓/✗.
  // *Ein Tor darf nur fordern, was der Mechanismus leisten soll.*
  const schwelle = ideal * 1.5 / grad;
  for (const d of abstaende) if (d > schwelle) fern++;
  const fernAnteil = gezaehlt ? fern / gezaehlt * 100 : 0;
  abstaende.sort((a, b) => a - b);
  const typisch = (abstaende[Math.floor(abstaende.length / 2)] || 0) * grad;
  const lueckeGrad = luecke * grad;
  const lochFaktor = typisch > 0 ? lueckeGrad / typisch : 0;
  const ok = median >= ideal * 0.6 && eng === 0 && lochFaktor < 3.5;
  return { ok, punkte: n, nnMin: +nn[0].toFixed(2), nnMedian: +median.toFixed(2),
    nnMax: +nn[nn.length - 1].toFixed(2), ideal: +ideal.toFixed(2), eng,
    luecke: +lueckeGrad.toFixed(2), proben: gezaehlt, flaechenAnteil: +(anteil * 100).toFixed(1),
    fernAnteil: +fernAnteil.toFixed(1), typisch: +typisch.toFixed(2),
    lochFaktor: +lochFaktor.toFixed(2),
    text: (ok ? '✓ ' : '✗ ') + name + ': ' + n + ' points on ' + (anteil * 100).toFixed(0)
      + ' % of the sphere · spacing median ' + median.toFixed(2) + '° = '
      + (ideal > 0 ? (median / ideal * 100).toFixed(0) : '0') + ' % of the area-corrected ideal '
      + ideal.toFixed(2) + '° (tightest ' + nn[0].toFixed(2) + '°, ' + eng
      + ' under a quarter — that is the clumping test) · typical distance from valid ground to the '
      + 'nearest point ' + typisch.toFixed(1) + '°, largest gap ' + lueckeGrad.toFixed(1)
      + '° = ' + lochFaktor.toFixed(1) + '× typical (that is the hole test, limit 3.5×)'
      + ' · for reference ' + fernAnteil.toFixed(0) + ' % of valid area lies farther than 1.5 ideals'
      + ' (reported, not judged: 26 landmarks are MEANT to be sparse)'
      + (ok ? '' : (eng ? ' — ⚠ clumping' : '') + (median < ideal * 0.6 ? ' — ⚠ too tight' : '')
              + (lochFaktor >= 3.5 ? ' — ⚠ one region is disproportionately empty' : '')) };
}
