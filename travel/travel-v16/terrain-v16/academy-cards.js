// ============================================================================
// academy-cards.js — KFB Travel · Slice S31/S32a · Die Akademie im Himmel
// ----------------------------------------------------------------------------
// 31 Karten (5 Kapitel × 6 Lektionen + Meta-Hub) hängen als FESTER ORT im
// Himmel — nicht als Strom. Das ist der Unterschied zu `sky-cards.js`: dort ist
// eine Karte ein Ereignis, das erscheint, durchflogen wird und sich auflöst;
// hier ist eine Karte ein ZIEL, das bleibt. Eine Lektion, die sich beim
// Durchflug auflöst, wäre Unsinn — also kein Respawn, kein Portal, ein Stempel.
//
// ÜBERNOMMEN aus sky-cards.js (bewährte Mathematik, nicht neu erfunden):
//  · Zero-G aus drei inkommensurablen Sinus-Termen pro Achse (√2, √3, √5,
//    goldener Schnitt) — die Summe hat keine gemeinsame Periode.
//  · Ausrichtung zur Kamera per GEDÄMPFTEM Slerp plus Eigen-Neigung obendrauf.
//  · Durchflug = Vorzeichenwechsel des Abstands zur Kartenebene, gültig nur
//    innerhalb der halben Kantenlängen. Kein Solver.
//
// S32a — **DIE KARTENFLÄCHE IST EIN STECKPLATZ.** Zwei Quads in Kartengröße:
//   surface  = was zu sehen ist, VOLLFLÄCHIG, ausgestanzt per Silhouetten-`alphaMap`
//   decal    = nur die kanonische Tuschelinie (+ Stempel), sonst transparent
// Der Steckplatz nimmt vier Sprossen derselben Leiter — **Zonenfarbe → Zonenfeld →
// three.js-Vorschaubild → LIVE-Render-Textur** — und morgen ohne neuen Mechanismus
// auch ein Video oder die Chat-UI. Deshalb heißt er `setSurface`, nicht `setLive`.
//
// Zonen: Kapitel c belegt einen 72°-Sektor um den Anker, die Lektion bestimmt die
// HÖHE (leicht tief, schwer hoch) — der Schwierigkeitsgrad ist ein Steigflug und
// keine Zahl auf dem Blatt.
// ============================================================================

import { academyDeck, fieldTexture, maskTexture, decalTexture, postitTexture, previewURL,
         previewSheet, kfbCardSheet, seedFor, SHEET_AR, CHAPTERS, HUB, DECK_ZONES } from './academy-deck.js';
import { MODES } from './world-context.js';

const PAPER = '#efe6d0', CREAM = '#f7f0dd';

// Zonen-Platzhalter: die erste Sprosse. Sechs Texturen für 31 Karten — aus der Distanz
// ist eine Zone ohnehin ihre FARBE, nicht ihre Schrift.
function zoneTexture(THREE, ink, nr) {
  const W = 128, H = Math.round(W / SHEET_AR);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#' + ink.toString(16).padStart(6, '0'); g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(247,240,221,.3)'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = '700 ' + Math.round(H * 0.6) + 'px "Irish Grover", Georgia, serif';
  g.fillText(nr, W / 2, H / 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 2;
  return t;
}

export function createAcademyCards(opts = {}) {
  const THREE = opts.THREE;
  const P = Object.assign({
    width: 13,
    // Verteilung: die Zone bleibt ein Sektor (die Farbe ist die Orientierung), aber die sechs
    // Lektionen füllen ihn jetzt fast ganz aus UND liegen in verschiedenen TIEFEN. Vorher saßen
    // sie in einem 54°-Bogen auf einer Schale: man musste sich drehen, bis ein zu dichter Cluster
    // im Bild war (Georgs Befund). Mit gestaffelten Radien ist in jeder Blickrichtung etwas nah
    // und etwas fern — Tiefe statt Wand.
    // **S43 · Sternförmige Zonen um den STARTPUNKT.** Die vorige Fassung streute alle 31 Karten in
    // EINEN Ring um den Spieler und zog ihn an einer Leine mit — dadurch war die Akademie überall
    // und nirgends, und in jeder Blickrichtung lag ein Klumpen (Georgs Befund, dreimal).
    // Jetzt ist jedes Kapitel ein ORT: fünf Zonen im 72°-Stern um den Nullpunkt, jede mit eigener
    // Kreisfläche, und die Lektionen liegen darin in Reihenfolge auf einem sanften Bogen nach
    // außen — man reist ein Kapitel ab und hat die nächste Lektion im Blickfeld.
    // S73 · **Weiter auseinander — aber fliegbar.** Georgs Befund: sechs bis acht Karten im Bild, obwohl
    // drei gewollt sind. Die Zahlen stammten aus v8 (31 Karten auf fünf Zonen); seit S71 sind es 18 auf
    // drei, der Ort wurde also enger statt weiter. Erster Versuch mit 560/280 machte die Reise zäh:
    // gemessen brauchte ein Bein 507 u bei einer Höchstgeschwindigkeit von 42 u/s — zwölf Sekunden Flug
    // für eine Karte. 380/200 ist der Kompromiss: Nachbarn ~130 u (drei Karten im Bild), ein Bein ~3 s.
    // S76 · Der Strahl: `zoneNear` = wo die erste Karte einer Zone liegt, `zoneStep` = Abstand zur
    // nächsten. Zwei Zahlen, aus denen alles folgt — vorher waren es fünf (`zoneR`, `zoneSpan`,
    // `zoneTurn`, `zoneInner`, `stepJitter`) und der Kartenabstand war ihr Nebenprodukt.
    // 105 u ist gemessen der Wert, bei dem etwa drei Karten im Bild stehen (S73) und ein Bein bei
    // 42 u/s Höchstgeschwindigkeit **2,5 s** dauert — nicht 12 wie bei 380/200.
    zoneNear: 150, zoneStep: 105, raySpread: 7,
    zoneR: 380,          // u — nur noch für den Hub und alte Aufrufe
    zoneSpan: 200,       // u — dito (der Strahl braucht sie nicht mehr)
    zoneTurn: 2.1,       // rad Gesamtdrehung des Bogens innerhalb der Zone
    zoneInner: 0.18,     // wo der Bogen anfängt (0 = Zonenmitte)
    stepJitter: 0.06,    // wie frei die Lektionen im Bogen sitzen (deterministisch)
    hubR: 0,             // der Hub sitzt im Stern-Mittelpunkt: der Startpunkt IST die Aula
    // Höhe steigt innerhalb eines Kapitels: eine Reise, die aufsteigt.
    yBase: 30, yRise: 34, yZone: 7,
    // `ring`/`rNear`/`rFar`/`spread`/`ySpread` sind mit dem Zonen-Stern (S43) ENTFALLEN — sie
    // standen noch hier und im Panel, ohne dass `place()` sie liest. Gemessen: Verschiebung einer
    // Karte 0,00 u bei jeder Änderung. Ein Parameter, den niemand liest, ist eine Lüge im Kopf.
    // Höhenband relativ zur FLUGHÖHE, nicht absolut: bei Start auf 9 u lagen sonst alle 31 Karten
    // über dem Spieler (Georgs Screenshot). Die Mitte folgt der Flughöhe weich nach.
    yMin: 24, yMax: 96,
    // **Die Leine.** Die Akademie ist ein Ort — aber ein Ort, der den Spieler UMSCHLIESST.
    // Erste Fassung hatte `leash` 112 bei `ring` 100: damit hing der Spieler im Reiseflug genau
    // am Ringrand, und ein Ring, dessen Mittelpunkt 112 u entfernt liegt, liegt zwangsläufig
    // komplett in EINER Richtung. Gemessen: alle 31 Karten in einem Bogen von 145°, größte
    // Lücke 215°, vier von acht Oktanten leer — genau Georgs „ich muss mich um 180° drehen".
    // Die Leine muss also DEUTLICH INNERHALB des Rings liegen: ~0,3 · ring.
    // **Die Leine ist AUS** (`leash: 0`). Sie war die falsche Antwort auf „ich finde die Karten
    // nicht": eine mitwandernde Akademie ist kein Ort, und der Anflug musste sie extra stillstellen.
    // Ein Ort bleibt liegen; erreichbar wird er durch Tempo (Warp), nicht durch Nachlaufen.
    leash: 0,
    // Nachziehen mit BEGRENZTER Rate: sonst springt der Anker (und mit ihm alle 31 Karten)
    // um den ganzen Überschuss, sobald das Folgen wieder eingeschaltet wird.
    pullRate: 26,
    // **Und die Leine steht still, solange ein Anflug läuft.** Sonst flieht die Zielkarte genau
    // mit dem Überschuss der eigenen Bewegung — ein Laufband, auf dem man die Karte endlos jagt
    // (gemessen: ETA 0,0 s, „Zeit nicht erfüllbar“, 76 km/h, Abstand konstant).
    followOn: true,
    sector: 72,
    faceDamp: 0.9,
    driftAmp: 2.2,
    tiltAmp: 0.18,
    passRadius: 1.0,
    // S61 · Post-it-Klappe. `foldPeek` ist der Anteil der Blattlänge, der eingeklappt unter der
    // Kartenkante hervorschaut — der „dünne Rand", der im Flug nicht stört und trotzdem sagt:
    // hier ist eine Notiz. `foldSpeed` ist die Dämpfung, nicht eine Dauer (Faktoren statt Schalter).
    // S61 · Post-it-Klappe. **`foldPeek` ist die Scharnier-Skala, NICHT der sichtbare Rand** — die
    // Kippung verkürzt (cos), und was oberhalb der Kartenkante liegt, verschwindet hinter der Karte.
    // Der ehrliche Wert ist der Überhang unter der Kante in Prozent Kartenhöhe: `foldReport()`.
    // Ziel: der Klebestreifen (obere 16 % des Blattes) muss ganz unter der Kante liegen.
    foldPeek: 0.24,
    foldTilt: 0.28,     // rad, Rückkippung im eingeklappten Zustand (16° — verkürzt nur um 4 %)
    foldSpeed: 7,
    focusDist: 46,
    visible: true,
    sheetW: 512,
    // S74 · Post-its: Standard aus (Georgs Befund — unfertiges Design, Bedienung kollidiert mit Esc).
    postits: false,
    previews: true,
    // S59 · Sagt, ob eine Lektion wirklich laufen KANN. Die Karten wissen nichts von Lektionen —
    // deshalb kommt die Antwort von außen. Ohne diese Auskunft gilt: nicht spielbar (kein Versprechen
    // auf Verdacht — dieselbe Regel wie „auf läuft gaten, nicht auf existiert").
    canRun: null,
    // S84 · Der Zonen-Ring (`zone-ring.js`). Läuft er, ist ER der Eigentümer der Lage der
    // Deck-Karten; das v12-Raster unten bleibt als Rückweg stehen (auf „läuft" gaten, nicht
    // auf „existiert"). `null` = v13 verhält sich wie v12.
    ring: null,
    // u — ab dieser Verschiebung gilt eine neue Lage als UMZUG (wartet auf den Blickwechsel).
    // Darunter ist es die laufende Trennung, und die greift sofort.
    ringJump: 12,
  }, opts.params || {});

  const group = new THREE.Group();
  group.frustumCulled = false;
  const cards = [];
  const api = { onPass: null, onFocus: null, onPreview: null };
  let cx = 0, cz = 0, T = 0, visited = 0, focused = null;
  const chapterCount = {};   // Kapitel → Anzahl Lektionen (füllt sich beim Bauen)
  let cy = 34;   // Mitte des Höhenbands (folgt der Flughöhe)
  let sheetQ = [], prevBusy = false, prevDone = 0, prevFail = 0;

  const zoneTex = [];
  CHAPTERS.forEach((ch, i) => {
    const m = MODES.find((x) => x.key === ch.mode) || MODES[3];
    zoneTex[i] = zoneTexture(THREE, m.ink, ch.nr);
  });
  {
    const m = MODES.find((x) => x.key === HUB.mode) || MODES[5];
    zoneTex[5] = zoneTexture(THREE, m.ink, HUB.nr);
  }
  // Vier Kanten-Seeds, geteilt: Maske stanzt aus, Decal trägt die Linie.
  const SEEDS = [7, 23, 41, 59];
  const maskTex = SEEDS.map((s) => maskTexture(THREE, s, 512));
  const decalTex = SEEDS.map((s) => decalTexture(THREE, s, 1024));
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');   // ohne CORS kein WebGL-Upload → sonst stille Ausfälle

  const _v = new THREE.Vector3(), _n = new THREE.Vector3(), _to = new THREE.Vector3();
  const _q = new THREE.Quaternion(), _m = new THREE.Matrix4();
  const _up = new THREE.Vector3(0, 1, 0), _right = new THREE.Vector3(), _look = new THREE.Vector3();
  const _tiltQ = new THREE.Quaternion(), _tiltE = new THREE.Euler();

  const w = P.width, h = w / SHEET_AR;

  function place(card) {
    const d = card.data;
    // S78 · **Festgeschrieben bleibt festgeschrieben.** Eine Karte, die vor dem Spieler platziert wurde,
    // behält ihren Platz — auch wenn jemand am Layout dreht. Das ist der halbe Kompromiss aus dem
    // Konzept: die REISE wächst mit, der ORT bleibt liegen.
    if (card.fixed) return;
    // S84 · **Der Ring hat Vorrang.** Liegt für diese Karte eine Kachel-Lage vor, kommt sie von
    // dort — Modus, Biome, Ebene und Kachel sind abgeleitet (Registry), nicht gerechnet. Lektionen
    // und den Hub kennt der Ring nicht; die behalten den Stern.
    if (P.ring && P.ring.ready) {
      const rh = P.ring.homeOf(card);
      if (rh) { card.home.copy(rh); return; }
    }
    if (d.kind === 'hub') {
      card.home.set(cx, P.yBase + P.yRise * 0.35, cz - P.hubR);
      return;
    }
    // S76 · **Strahl statt Bogen** (Georgs Befund: „Cluster/Blobs statt strahlenförmige Zonen ums
    // Zentrum"). Der alte Code hat es selbst zugegeben — „der Bogen dreht sich mit, statt strahlenförmig
    // zu liegen": sechs Karten in einer KREISFLÄCHE um die Zonenmitte sind aus der Ferne ein Klumpen,
    // und aus der Mitte sieht man drei Klumpen am Himmel statt drei Wege.
    //
    // Jetzt liegt eine Zone auf einem STRAHL vom Startpunkt nach außen: Karte 1 nah, Karte 6 fern, in
    // Kartenordnung. Das macht drei Dinge auf einmal richtig — man sieht, wohin ein Deck führt; die
    // lineare Reise fliegt geradeaus nach außen statt quer; und der Abstand zwischen zwei Karten ist
    // EINE Zahl (`zoneStep`) statt ein Nebenprodukt aus Bogenradius, Drehung und Streuung.
    const zdeg = d.chapter * P.sector + 18;
    const n = Math.max(1, chapterCount[d.chapter] || 6);
    const t = n > 1 ? d.index / (n - 1) : 0.5;
    const jit = Math.sin((d.route + 1) * 12.9898) * 0.5 + 0.5;
    // Leichter Fächer: der Strahl öffnet sich nach außen (±`raySpread`° bei der letzten Karte), sonst
    // ständen sechs Karten exakt hintereinander und die hintere verdeckt die vordere.
    const za = (zdeg + (jit - 0.5) * 2 * P.raySpread * (0.25 + t)) * Math.PI / 180;
    const r = P.zoneNear + P.zoneStep * d.index + (jit - 0.5) * P.zoneStep * P.stepJitter;
    const y = Math.max(P.yMin, Math.min(P.yMax,
      P.yBase + P.yRise * t + Math.sin(d.chapter * 2.3) * P.yZone + (jit - 0.5) * 6));
    card.home.set(cx + Math.sin(za) * r, y, cz + Math.cos(za) * r);
  }

  // Pro Frame: Anker an der Leine nachziehen, Höhenband weich auf die Flughöhe legen.
  // Nur wenn sich wirklich etwas ändert, werden die 31 Heimatpunkte neu gerechnet.
  function follow(dt, player) {
    if (!player || !P.followOn || P.leash <= 0) return false;   // leash 0 = die Akademie liegt fest
    let moved = false;
    const dx = player.x - cx, dz = player.z - cz;
    const d = Math.hypot(dx, dz);
    if (d > P.leash) {
      const step = Math.min(d - P.leash, P.pullRate * dt) / d;
      cx += dx * step; cz += dz * step; moved = true;
    }
    const wantY = Math.max(26, Math.min(62, player.y + 8));
    if (Math.abs(wantY - cy) > 0.05) { cy += (wantY - cy) * Math.min(1, dt * 0.5); moved = true; }
    if (moved) for (const c of cards) place(c);
    return moved;
  }

  function make(data, i) {
    const si = (data.route | 0) % SEEDS.length;
    const holder = new THREE.Group();
    holder.frustumCulled = false;
    // Fläche: vollflächig, Silhouette per alphaMap ausgestanzt (harte Kante, kein Glow).
    const mat = new THREE.MeshBasicMaterial({
      map: zoneTex[data.chapter], alphaMap: maskTex[si], alphaTest: 0.5,
      side: THREE.DoubleSide, toneMapped: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h, 1, 1), mat);
    mesh.frustumCulled = false;
    holder.add(mesh);
    // Tusche liegt auf der Bildebene, nicht am Objekt: eigenes Quad, 2 cm davor.
    const dmat = new THREE.MeshBasicMaterial({ map: decalTex[si], transparent: true,
                                               side: THREE.DoubleSide, toneMapped: false, depthWrite: false });
    const decal = new THREE.Mesh(new THREE.PlaneGeometry(w, h, 1, 1), dmat);
    decal.position.z = 0.02;
    decal.renderOrder = 1;
    decal.frustumCulled = false;
    holder.add(decal);
    // Post-it: der Besuch als Beweisstück. Es klebt UNTEN LINKS AN DER KARTENKANTE und hängt
    // größtenteils darunter — es darf keine Demo-Fläche verdecken (Georgs Befund). Größe und
    // Höhe sind auf den HUD-Würfel unten rechts eingestellt: die beiden sind ein Gegengewicht.
    const pw = w * 0.145;
    const pmat = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide,
                                               toneMapped: false, depthWrite: false });
    // S61b · **Ein Durchgang, nicht zwei.** Ein transparentes DoubleSide-Material rendert three.js
    // in zwei Pässen (Rückseiten, dann Vorderseiten) — bei 31 Zetteln sind das 62 Zeichenaufrufe
    // statt 31. Gemessen: 332 → 301 bei sichtbarer Akademie. Papier braucht keine Sortierung in
    // sich, die Transparenz ist nur die Luft außerhalb der Tuschekante.
    pmat.forceSinglePass = true;
    const ph = pw * 1.06;
    const postit = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph, 1, 1), pmat);
    // S61 · **Scharnier statt freiem Blatt.** Georgs Bild: das Post-it lebt auf der Rückseite der
    // Karte, im Flug sieht man nur einen dünnen Rand, in der Detailansicht klappt man es auf. Das
    // kann eine Gruppe mit EINER Zahl: das Scharnier sitzt an der Kartenkante, die Höhe wächst von
    // dort nach unten. Ein zentriertes Blatt zu skalieren würde von der MITTE schrumpfen und am Rand
    // ein Loch lassen — deshalb Scharnier oben und das Blatt um halbe Höhe nach unten versetzt.
    const postHinge = new THREE.Group();
    // Weit genug NACH VORN und mit Renderreihenfolge: bei 0,05 u vor einem 13 u breiten Blatt
    // rutschte die Ecke unter die Tuschekante, sobald die Karte leicht gekippt stand.
    // 0,16 u ist optisch noch flüchtig, aber tiefensicher — und der Überstand ist größer,
    // damit das Blatt am Rand KLEBT statt darunter zu rutschen.
    postHinge.position.set(-w / 2 + pw * 0.78, -h / 2 + pw * 0.02, 0.16);
    postHinge.rotation.z = -0.07;
    postit.position.y = -ph / 2;
    postit.renderOrder = 2;
    postit.visible = false;
    postit.frustumCulled = false;
    postHinge.add(postit);
    holder.add(postHinge);
    group.add(holder);
    const card = { data, holder, mesh, mat, decal, dmat, seedIdx: si,
                   postit, postHinge, pmat, pw, ph,
                   fold: 0, foldWant: 0,   // 0 = eingeklappt (Standard), 1 = aufgeklappt
                   lagX: 0, lagY: 0, prev: new THREE.Vector3(),
                   pinAmt: 0, pinWant: 0,
                   half: { w: w / 2, h: h / 2 }, home: new THREE.Vector3(),
                   phase: (i * 7.13) % 100, side: 0,
                   field: null, preview: null, live: false, kind: 'zone' };
    place(card);
    return card;
  }

  academyDeck(P.deck).forEach((d, i) => cards.push(make(d, i)));  // Wie viele Lektionen hat jedes Kapitel? Der Bogen einer Zone braucht die ZAHL, nicht eine
  // Annahme — die Karten sind nicht gleichmäßig auf die Zonen verteilt (S71: sechs pro Deck,
  // drei in der Werkstatt, eine Meta).
  for (const c of cards) if (c.data.kind === 'lesson' || c.data.kind === 'kfbcard') chapterCount[c.data.chapter] = (chapterCount[c.data.chapter] || 0) + 1;
  for (const c of cards) { place(c); c.holder.position.copy(c.home); }
  sheetQ = cards.slice();

  // S71 · **Der Inhalt kommt nach.** Ein Steckplatz weiß beim Bau nur Deck und Nummer; Titel,
  // Power und Lore stehen im Repo-Manifest und kommen über das Netz. Wer die Karten hat, legt sie
  // hier ab — die Akademie holt nichts selbst (sie wüsste sonst von PDFs, und das ist nicht ihre
  // Aufgabe). Ein Deck, das nie ankommt, lässt die Zone bei ihrem Zonenfeld: kein leeres Blatt.
  function fillDeck(packId, list) {
    if (!packId || !list) return 0;
    let n = 0;
    for (const c of cards) {
      const d = c.data;
      if (d.kind !== 'kfbcard' || d.packId !== packId) continue;
      const src = list.find((x) => x.n === d.n) || list[d.index];
      if (!src) continue;
      d.title = src.title || d.title;
      d.power = src.power || '';
      d.lore = src.lore || '';
      // S84 · Die Deck-ROLLE wandert mit: `cardSemanticVector` legt über sie ihren ROLE_BIAS, und
      // ohne Rolle leitet der Zonen-Ring aus derselben Karte einen anderen Modus ab als das Lab.
      d.role = src.role || d.role || '';
      if (src.grade != null) d.grade = src.grade;
      d.n = src.n != null ? src.n : d.n;
      // Der Glyph landet im Klebestreifen des Post-its — ein Wort, keine Zahl
      // („Karten sind Beweisstücke, keine Powers").
      d.glyph = String(d.title).replace(/^The\s+/i, '').split(/\s+/)[0].toUpperCase().slice(0, 12);
      if (!c.live) sheetQ.push(c);        // Blatt neu malen: jetzt steht ein Titel darauf
      n++;
    }
    return n;
  }

  // Das Artwork der Karte (die geschnittene Zelle) trifft ein. Wer sie geholt hat, gibt sie her —
  // wir malen daraus das Blatt (Sollformat + Tuschekante) und legen es auf.
  function setArt(card, crop) {
    if (!card || !crop) return false;
    try {
      const t = kfbCardSheet(THREE, crop, card.data.route, P.sheetW * 2);
      if (card.preview) card.preview.dispose();
      card.preview = t; card.artDone = true;
      applyBest(card);
      return true;
    } catch (e) { card.previewFail = 'sheet'; return false; }
  }

  // Beste verfügbare Sprosse auf die Fläche legen. Live schlägt Vorschau schlägt Feld
  // schlägt Zonenfarbe — an EINER Stelle entschieden, nicht an vier.
  function applyBest(card) {
    if (card.live) return;
    const t = card.preview || card.field || zoneTex[card.data.chapter];
    card.kind = card.preview ? 'preview' : (card.field ? 'field' : 'zone');
    if (card.mat.map !== t) { card.mat.map = t; card.mat.needsUpdate = true; }
  }

  function paintField(card) {
    const t = fieldTexture(THREE, card.data, P.sheetW);
    if (card.field) card.field.dispose();
    card.field = t;
    applyBest(card);
  }

  // Gepacet und nächstgelegen zuerst — dieselbe Regel wie der Artwork-Pacer aus S23.
  function pumpSheets(player, budget) {
    if (document.hidden || !sheetQ.length) return 0;
    let n = 0; const max = budget || 2;
    while (n < max && sheetQ.length) {
      let bi = 0, bd = 1e18;
      for (let i = 0; i < sheetQ.length; i++) {
        const d = player ? sheetQ[i].holder.position.distanceToSquared(player) : i;
        if (d < bd) { bd = d; bi = i; }
      }
      paintField(sheetQ.splice(bi, 1)[0]); n++;
    }
    return n;
  }

  // Vorschaubilder von threejs.org: EIN Auftrag zur Zeit, nächstgelegen zuerst, und ein
  // Fehlschlag ist endgültig (kein Retry-Sturm). Ohne CORS-Freigabe kann WebGL das Bild
  // nicht laden — dann bleibt das Zonenfeld stehen, und der Zähler sagt, warum.
  function pumpPreviews(player) {
    if (!P.previews || prevBusy || document.hidden) return false;
    let best = null, bd = 1e18;
    for (const c of cards) {
      if (c.preview || c.previewFail || !c.field) continue;
      if (!previewURL(c.data.example)) { c.previewFail = 'none'; continue; }
      const d = player ? c.holder.position.distanceToSquared(player) : 0;
      if (d < bd) { bd = d; best = c; }
    }
    if (!best) return false;
    const card = best;
    prevBusy = true;
    loader.load(previewURL(card.data.example),
      (tex) => {
        prevBusy = false; prevDone++;
        // Nicht das rohe Foto aufs Blatt, sondern ein BLATT aus dem Foto: auf die Kartenkontur
        // geclippt und mit einer Bauchbinde, die sagt, was es ist (Foto oder Ladezustand einer
        // echten Demo). `canRun` kommt von außen — die Karten wissen nichts von Lektionen.
        const runnable = !!(P.canRun && P.canRun(card.data.example));
        const img = tex.image;
        let sheet = null;
        try {
          if (img && (img.naturalWidth || img.width)) {
            sheet = previewSheet(THREE, img, card.data, 1024, runnable);
            tex.dispose();
          }
        } catch (e) {
          // Fremdes Bild ohne CORS färbt das Canvas ein; dann lieber das rohe Foto ohne Bauchbinde
          // als ein Blatt, das der Grafikkarte nicht übergeben werden kann.
          console.warn('[academy] Vorschau-Blatt nicht baubar — rohes Foto', e);
          sheet = null;
        }
        if (!sheet) { tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; sheet = tex; }
        card.preview = sheet; applyBest(card);
        if (api.onPreview) { try { api.onPreview(card, true); } catch (e) {} }
      },
      undefined,
      () => {
        prevBusy = false; prevFail++; card.previewFail = 'error';
        if (api.onPreview) { try { api.onPreview(card, false); } catch (e) {} }
      });
    return true;
  }

  // Läuft der Webfont noch, malt der Browser still Georgia — nach fonts.ready alles
  // EINMAL neu einreihen (Lehre aus v11, in v7 zweimal bestätigt).
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => { for (const c of cards) if (c.field) sheetQ.push(c); });
  }

  // S61b · **Jede Karte im Raster trägt ihren Zettel, von Anfang an** (Georg, 26.7.: „dauerhaft auf
  // der Kartenrückseite"). Vorher war das Post-it die Belohnung für den Besuch — es erschien aus
  // nichts. Jetzt ist es Teil der Karte: eingeklappt, ein Streifen Zonenfarbe an der Kante.
  //
  // Die Kosten dafür wären 31 Leinwände à 256² gewesen (7,9 MB Texturspeicher, 31 Canvas-Zeichnungen
  // beim Aufbau der Akademie). Deshalb: **ein LEERER Zettel gehört seiner Zone, nicht seiner Karte.**
  // Ohne Glyph und ohne „BESUCHT" sind alle Zettel einer Zone dasselbe Bild — sechs Texturen statt 31.
  // Erst beim Besuch oder beim ersten Wort bekommt eine Karte ihre eigene.
  const blankTex = [];
  function blankFor(card) {
    const ch = card.data.chapter | 0;
    if (!blankTex[ch]) blankTex[ch] = postitTexture(THREE, card.data, 256, '', { blank: true });
    return blankTex[ch];
  }
  function dressBlank(card) {
    if (card.postTex) return;
    const t = blankFor(card);
    if (card.pmat.map !== t) { card.pmat.map = t; card.pmat.needsUpdate = true; }
    card.postit.visible = !!P.postits;
  }
  for (const c of cards) dressBlank(c);

  // Der Besuch wird ein Post-it am Kartenrand — kein Stempel im Bild, kein Punktestand.
  function markVisited(card) {
    if (!card || card.data.visited) return;
    card.data.visited = true; visited++;
    if (!card.postTex) card.postTex = postitTexture(THREE, card.data, 256, card.data.note);
    card.pmat.map = card.postTex; card.pmat.needsUpdate = true;
    // S74 · **Aufdecken geht durch EIN Tor.** `dressBlank` fragte `P.postits`, diese Stelle nicht —
    // dadurch poppten die Zettel beim Start wieder auf (die Journey stellt jeden früheren Besuch her)
    // und live bei jeder Ankunft. Die Textur darf gebaut werden, sichtbar macht sie nur der Schalter.
    card.postit.visible = !!P.postits;
  }

  // S51 · Die Notiz landet auf der Textur, nicht in einem Overlay-Kasten. Die alte Textur wird
  // freigegeben — sonst sammelt jede Änderung eine tote Textur im Speicher an.
  function setNote(card, text) {
    if (!card) return false;
    card.data.note = String(text == null ? '' : text);
    if (!card.data.visited) markVisited(card);
    const old = card.postTex;
    card.postTex = postitTexture(THREE, card.data, 256, card.data.note);
    card.pmat.map = card.postTex; card.pmat.needsUpdate = true;
    card.postit.visible = !!P.postits;   // S74 · dasselbe Tor wie oben
    if (old) old.dispose();
    return true;
  }

  // S84 · Ring-Abgleich. Zwei Dinge, die zusammengehören und deshalb hier stehen:
  //  · **Neu vergeben** wird nur, wenn der Spieler die Kachel wechselt (der Ring entscheidet das
  //    selbst und meldet 0, wenn nichts zu tun ist) — nicht pro Frame.
  //  · **Übernommen** wird ein UMZUG (neue Kachel) erst, wenn die Karte NICHT im Bild steht — vor
  //    den Augen des Spielers ist das ein Sprung. Eine KLEINE Korrektur (unter `ringJump`) greift
  //    dagegen sofort: die laufende Trennung (`ring.settle`) muss im Bild wirken, sonst hätte sie
  //    keine Wirkung dort, wo Georgs Befund entsteht.
  let ringPending = 0;
  const _fr = new THREE.Frustum(), _fm = new THREE.Matrix4();
  function ringSync(dt, camera, player) {
    const ring = P.ring;
    if (!ring || !ring.ready || !player || !camera) return 0;
    ring.recenter(player, focused || null, false, camera.position);
    ring.reheight(player);     // S85 · Höhenband + Boden-Veto, damit keine Karte im Berg steckt
    ring.settle(dt, camera);
    _fm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    _fr.setFromProjectionMatrix(_fm);
    let wait = 0, moved = 0;
    for (const c of cards) {
      if (c.data.kind !== 'kfbcard' || c.fixed) continue;
      const h = ring.homeOf(c);
      if (!h) continue;
      const d2 = c.home.distanceToSquared(h);
      if (d2 < 0.04) continue;
      if (d2 > P.ringJump * P.ringJump && _fr.containsPoint(c.holder.position)) { wait++; continue; }
      c.home.copy(h); ring.mark(c); moved++;
    }
    ringPending = wait;
    return moved;
  }

  function update(dt, camera, player) {
    if (!P.visible) return;
    T += dt;
    follow(dt, player);
    ringSync(dt, camera, player);
    camera.getWorldPosition(_look);
    let best = null, bd = P.focusDist * P.focusDist;
    for (const card of cards) {
      const m = card.holder;
      const p = card.phase, s = T * 0.16;
      // **Pinnen ist ein VERLAUF, kein Schalter.** Vorher sprang über `card.pinned` die
      // Ausrichtungsdämpfung von 3 auf 27 und die Drift auf null — und zwar genau im Moment der
      // Landung. Das war das letzte Ruckeln der Detailansicht (Georgs Befund): die Karte richtete
      // sich in einem Frame neu aus, während die Kamera schon stand.
      card.pinAmt += ((card.pinWant || 0) - card.pinAmt) * Math.min(1, dt * 2.2);
      const pin = card.pinAmt;
      {
        const dx = Math.sin(s * 1.0 + p) + 0.6 * Math.sin(s * 1.4142 + p * 1.7) + 0.35 * Math.sin(s * 2.2360 + p * 2.3);
        const dy = Math.sin(s * 1.1 + p * 1.3) + 0.55 * Math.sin(s * 1.7320 + p * 0.7) + 0.3 * Math.sin(s * 2.6457 + p * 3.1);
        const dz = Math.sin(s * 0.9 + p * 2.1) + 0.6 * Math.sin(s * 1.6180 + p * 1.1) + 0.35 * Math.sin(s * 2.4494 + p * 0.4);
        // Drift-Amplitude fährt mit `pin` gegen null: eine Karte, die man von vorn ansieht und
        // bedient, darf nicht unter dem Zeiger wegdriften — sie ist dann ein Bild, kein Mobile.
        const amp = P.driftAmp * (1 - pin);
        m.position.set(card.home.x + dx * amp, card.home.y + dy * amp * 0.55, card.home.z + dz * amp);
      }

      _to.subVectors(_look, m.position).normalize();
      _right.crossVectors(_up, _to);
      if (_right.lengthSq() < 1e-6) _right.set(1, 0, 0); else _right.normalize();
      _v.crossVectors(_to, _right).normalize();
      _m.makeBasis(_right, _v, _to);
      _q.setFromRotationMatrix(_m);
      // Eine Karte, an der man gerade arbeitet, hält STILL: die Eigen-Neigung fährt
      // gegen null, sobald eine Demo auf ihr läuft — sonst zielt man auf ein Blatt,
      // das unter dem Finger wegkippt.
      const tilt = P.tiltAmp * (1 - pin) * (card.live ? 0.25 : 1);
      _tiltE.set(Math.sin(s * 1.3 + p) * tilt,
                 Math.sin(s * 0.8 + p * 1.9) * tilt * 0.7,
                 Math.sin(s * 1.9 + p * 0.6) * tilt);
      _q.multiply(_tiltQ.setFromEuler(_tiltE));
      // Dämpfung wächst mit `pin` stetig (3 → 8), nicht in einem Sprung auf 27.
      m.quaternion.slerp(_q, Math.min(1, dt * P.faceDamp * (3 + pin * 5)));

      // Post-it: Klappe + Wind. Die Klappe ist eine gedämpfte Zahl (`fold`), der Wind zieht die
      // Eigenbewegung der Karte nach — zwei Tiefpassfilter, kein Cloth, keine Physik. Der Wind wird
      // MIT der Klappe eingeblendet: ein eingeklappter Streifen, der im Wind wippt, sieht nach
      // Fehler aus — er liegt an der Karte an.
      if (card.postit.visible) {
        card.fold += (card.foldWant - card.fold) * Math.min(1, dt * P.foldSpeed);
        // sanftes Ein-/Ausrollen (cubic in/out) — lineares Aufklappen liest sich mechanisch
        const f = card.fold < 0.5 ? 4 * card.fold * card.fold * card.fold
                                  : 1 - Math.pow(-2 * card.fold + 2, 3) / 2;
        card.postHinge.scale.y = P.foldPeek + (1 - P.foldPeek) * f;
        // eingeklappt kippt der Streifen leicht nach hinten und liegt an der Rückseite an. Wenig:
        // 41° haben ihn um ein Viertel verkürzt und die Hälfte des Klebestreifens gefressen.
        card.postHinge.rotation.x = -P.foldTilt * (1 - f);
        card.postHinge.position.z = -0.16 + 0.32 * f;
        const vx = (m.position.x - card.prev.x) / Math.max(dt, 1e-3);
        const vy = (m.position.y - card.prev.y) / Math.max(dt, 1e-3);
        card.lagX += (vx - card.lagX) * Math.min(1, dt * 1.6);
        card.lagY += (vy - card.lagY) * Math.min(1, dt * 2.2);
        card.postHinge.rotation.z = -0.07 - (Math.max(-0.5, Math.min(0.5, card.lagX * 0.09))
                                  + Math.sin(T * 0.9 + p) * 0.035) * f;
      }
      card.prev.copy(m.position);

      if (!player) continue;
      const d2 = m.position.distanceToSquared(player);
      if (d2 < bd) { bd = d2; best = card; }

      _n.set(0, 0, 1).applyQuaternion(m.quaternion);
      _v.subVectors(player, m.position);
      const dd = _v.dot(_n);
      const side = dd >= 0 ? 1 : -1;
      if (card.side !== 0 && side !== card.side) {
        _right.set(1, 0, 0).applyQuaternion(m.quaternion);
        _to.set(0, 1, 0).applyQuaternion(m.quaternion);
        if (Math.abs(_v.dot(_right)) < card.half.w * P.passRadius && Math.abs(_v.dot(_to)) < card.half.h * P.passRadius) {
          markVisited(card);
          if (api.onPass) { try { api.onPass(card, visited); } catch (e) {} }
        }
      }
      card.side = side;
    }
    if (best !== focused) { focused = best; if (api.onFocus) { try { api.onFocus(focused); } catch (e) {} } }
  }

  return {
    name: 'academy-cards', group, update, pumpSheets, pumpPreviews, markVisited, setNote, follow,
    // S84 · Der Ring wird von außen eingehängt (der Ort kennt keine JSON-Dateien) und kann
    // jederzeit wieder abgehängt werden — das ist der Rückweg auf das v12-Raster.
    setRing(ring) {
      P.ring = ring || null;
      for (const c of cards) {
        c.fixed = false; place(c); c.holder.position.copy(c.home);
        if (P.ring && P.ring.mark) P.ring.mark(c);
      }
      ringPending = 0;
      return !!(ring && ring.ready);
    },
    get ring() { return P.ring; },
    get ringPending() { return ringPending; },
    ringSync,
    // S71 · Deck-Zonen: Inhalt nachlegen, Artwork annehmen, und sagen, welche Karte als nächste
    // ihr Bild braucht (nächstgelegene zuerst — dieselbe Regel wie der Artwork-Pacer aus S23).
    fillDeck, setArt,
    get deckZones() { return DECK_ZONES.map((z) => z.packId); },
    wantsArt(player) {
      let best = null, bd = 1e18;
      for (const c of cards) {
        if (c.data.kind !== 'kfbcard' || c.artDone || c.artBusy || !c.data.power) continue;
        const d = player ? c.holder.position.distanceToSquared(player) : 0;
        if (d < bd) { bd = d; best = c; }
      }
      return best;
    },
    // S73 · **Wie viele Karten sind wirklich im Bild?** Georgs Befund war „6–8 statt 3", und ohne
    // diese Zahl wäre jede Abstands-Änderung Geschmackssache. Gezählt wird im Kamera-Frustum, nicht
    // per Winkel-Schätzung — und getrennt nach „im Bild" und „nah genug, um lesbar zu sein".
    visibleReport(camera, lesbar) {
      if (!camera) return null;
      const m = new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
      const fr = new THREE.Frustum().setFromProjectionMatrix(m);
      const R = lesbar || 260;
      let imBild = 0, nah = 0, dMin = 1e9;
      const p = new THREE.Vector3();
      for (const c of cards) {
        c.holder.getWorldPosition(p);
        const d = p.distanceTo(camera.position);
        if (!fr.containsPoint(p)) continue;
        imBild++;
        if (d < R) nah++;
        if (d < dMin) dMin = d;
      }
      return { imBild, nah, nächste: dMin < 1e9 ? +dMin.toFixed(1) : null, karten: cards.length };
    },
    // S78 · **Die Reise wächst mit, der Ort bleibt liegen** (Georgs Entscheidung, Konzept §1).
    // Eine Karte, die noch weit weg und noch nicht besucht ist, wird VOR den Spieler gesetzt — und
    // dabei **festgeschrieben**. Das ist der Unterschied zu einer mitwandernden Akademie (die es in v8
    // gab und die kein Ort war, S43): platziert wird EINMAL, danach liegt die Karte da. Wer zurückfliegt,
    // findet sie wieder.
    //
    // Was hier NICHT passiert: nichts wird nachgeladen, nichts erzeugt, nichts gelöscht. Es ist eine
    // Positionszuweisung — deshalb kostet der „endlose" Teil auch nichts.
    growAhead(card, pos, dir, o = {}) {
      if (!card || !pos || !dir) return false;
      if (card.fixed || card.data.visited) return false;
      const dist = o.dist != null ? o.dist : 190;
      // Seitlicher Versatz und Höhe deterministisch aus der Route: dieselbe Reise legt die Karte
      // an dieselbe Stelle (das passt zur gesäten Journey, S72 — ein Wurf, eine Welt).
      const jit = Math.sin((card.data.route + 1) * 12.9898) * 0.5 + 0.5;
      const side = (jit - 0.5) * 2 * (o.spread != null ? o.spread : 70);
      const dy = (jit - 0.5) * 2 * (o.rise != null ? o.rise : 26);
      _look.set(dir.x, 0, dir.z);
      if (_look.lengthSq() < 1e-6) _look.set(0, 0, 1);
      _look.normalize();
      _right.set(-_look.z, 0, _look.x);
      const y = Math.max(P.yMin, Math.min(P.yMax, pos.y + dy + 10));
      card.home.set(pos.x + _look.x * dist + _right.x * side, y, pos.z + _look.z * dist + _right.z * side);
      card.holder.position.copy(card.home);
      card.fixed = true;
      return true;
    },
    // Abnahme: wie viele Karten liegen an ihrem gewachsenen Platz, wie viele noch im Ur-Raster.
    growReport() {
      const k = cards.filter((c) => c.data.kind === 'kfbcard');
      return { karten: k.length, gewachsen: k.filter((c) => c.fixed).length,
               besucht: k.filter((c) => c.data.visited).length };
    },
    // Zurück ins Ur-Raster — der Rückweg, den jeder Auftrag braucht (Fehlerklasse v8).
    ungrow() {
      let n = 0;
      for (const c of cards) if (c.fixed) { c.fixed = false; place(c); c.holder.position.copy(c.home); n++; }
      return n;
    },
    // Abnahme dieses Slices: wie viele Steckplätze haben Inhalt, wie viele ein echtes Kartenbild.
    deckReport() {
      const k = cards.filter((c) => c.data.kind === 'kfbcard');
      return {
        steckplätze: k.length,
        mitText: k.filter((c) => !!c.data.power).length,
        mitKartenbild: k.filter((c) => c.artDone).length,
        lektionen: cards.filter((c) => c.data.kind === 'lesson').length,
        zonen: DECK_ZONES.length,
      };
    },
    // S61 · Klappe: nur ein Wunschwert: die Animation macht die Schleife. Wer hier eine Position
    // setzen würde, kämpft im nächsten Bild gegen die Dämpfung.
    setFold(card, on) { if (card) card.foldWant = on ? 1 : 0; },
    toggleFold(card) { if (!card) return false; card.foldWant = card.foldWant > 0.5 ? 0 : 1; return card.foldWant > 0.5; },
    isFolded(card) { return !card || card.foldWant < 0.5; },
    foldAll(on) { let n = 0; for (const c of cards) { if (c.postit.visible) { c.foldWant = on ? 1 : 0; n++; } } return n; },
    // S74 · **Post-its Standard AUS** (Georg, 26.7.): der Zettel ist gestalterisch unfertig — er wackelt
    // aufgeklappt, und seine Bedienung kollidiert mit Esc. Für die Reise und die Story-Beats braucht es
    // ihn nicht. Er bleibt gebaut und einschaltbar; die saubere Fassung (dezenter Ruhezustand, ruhige
    // Bewegung im Wind) ist eine eigene Runde.
    setPostits(on) {
      P.postits = !!on;
      let n = 0;
      for (const c of cards) {
        if (!P.postits) c.foldWant = 0;
        c.postit.visible = !!P.postits;
        if (P.postits) n++;
      }
      return n;
    },
    get postitsOn() { return !!P.postits; },
    // Abnahme der Klappe: der Überhang UNTER der Kartenkante, nicht die Scharnier-Skala — die
    // verschweigt, was hinter der Karte verschwindet (Befund der Abnahme zu S61).
    foldReport() {
      const seen = cards.filter((c) => c.postit.visible);
      const c = seen[0];
      if (!c) return { zettel: 0, offen: 0 };
      const reach = (s) => c.ph * s * Math.cos(P.foldTilt * (1 - (s > 0.5 ? 1 : 0)));
      const above = c.postHinge.position.y + c.half.h;     // Scharnier über der Kante
      const overhang = (s) => c.ph * s * Math.cos(s > 0.5 ? 0 : P.foldTilt) - above;
      return {
        zettel: seen.length,
        offen: seen.filter((x) => x.foldWant > 0.5).length,
        skala: +c.postHinge.scale.y.toFixed(3),
        randZu: +(overhang(P.foldPeek) / (c.half.h * 2) * 100).toFixed(2),   // % Kartenhöhe
        randOffen: +(overhang(1) / (c.half.h * 2) * 100).toFixed(2),
        tapeGanzSichtbar: overhang(P.foldPeek) >= c.ph * 0.16,
      };
    },
    get onPass() { return api.onPass; }, set onPass(f) { api.onPass = f; },
    get onFocus() { return api.onFocus; }, set onFocus(f) { api.onFocus = f; },
    get onPreview() { return api.onPreview; }, set onPreview(f) { api.onPreview = f; },
    setCenter(x, z, alt) {
      cx = x; cz = z;
      if (alt != null) cy = Math.max(26, Math.min(62, alt + 8));
      for (const c of cards) { place(c); c.holder.position.copy(c.home); }
    },
    get center() { return { x: cx, z: cz, y: cy }; },
    get cards() { return cards; },
    route() { return cards.slice().sort((a, b) => a.data.route - b.data.route); },
    // Raycast auf die Fläche. Die Karte ist gedreht und geneigt, aber THREE.Raycaster
    // rechnet die Quaternion korrekt mit — kein Sonderfall. UV ist jetzt die GANZE
    // Karte, also direkt die Demo-Koordinate.
    // S89g · `skip` = die angedockte Karte. Sie ist in der Detailansicht der Bildschirm, nicht ein
    // Ziel, und wird deshalb aus dem Treffertest genommen (Begründung in `pickAcademy`).
    pick(raycaster, skip) {
      const objs = [];
      for (const c of cards) if (c !== skip) objs.push(c.mesh);
      const hits = raycaster.intersectObjects(objs, false);
      if (!hits.length) return null;
      const hit = hits[0];
      const card = cards.find((c) => c.mesh === hit.object);
      if (!card) return null;
      return { card, onScreen: true, uv: hit.uv, distance: hit.distance, point: hit.point };
    },
    get focused() { return focused; },
    nearest(player) {
      let best = null, bd = 1e18;
      for (const c of cards) { const d = c.holder.position.distanceToSquared(player); if (d < bd) { bd = d; best = c; } }
      return best;
    },
    // DER STECKPLATZ. Heute: Render-Textur der Lektion. Morgen ohne neuen Mechanismus:
    // Video-Textur (YouTube), Sprite-Loop, gerenderte DOM-UI.
    setSurface(card, texture, kind) {
      if (!card) return;
      if (!texture) { card.live = false; applyBest(card); return; }
      card.live = kind !== 'static';
      card.kind = kind || 'live';
      card.mat.map = texture; card.mat.needsUpdate = true;
    },
    clearSurface(card) { if (card) { card.live = false; applyBest(card); } },
    setLive(card, texture) { this.setSurface(card, texture, 'live'); },
    clearLive(card) { this.clearSurface(card); },
    setPreviews(on) {
      P.previews = !!on;
      if (on) return;
      for (const c of cards) { if (c.preview) { c.preview.dispose(); c.preview = null; c.previewFail = 'off'; applyBest(c); } }
    },
    setVisible(on) { P.visible = !!on; group.visible = !!on; },
    // Anflug läuft → Welt hält still. Der Runner schaltet das pro Frame.
    setFollowEnabled(on) { P.followOn = !!on; },
    get following() { return P.followOn; },
    // Detailansicht: Karte still stellen — als Verlauf (`pinWant`), nicht als Schalter.
    pin(card, on) { if (card) card.pinWant = on ? 1 : 0; },
    get pinOf() { return (c) => (c ? c.pinAmt : 0); },
    setParams(p) { Object.assign(P, p || {}); for (const c of cards) place(c); },
    // Wie viele Lektionen hat eine Zone? Die Journey braucht die Zahl, um einen Abschluss zu erkennen
    // — und sie soll sie nicht selbst raten (sonst steht dieselbe Zahl an zwei Orten).
    chapterTotal(ch) { return chapterCount[ch] || 0; },
    get params() { return P; },
    get visited() { return visited; },
    get total() { return cards.length; },
    get pending() { return sheetQ.length; },
    get previewStats() { return { ok: prevDone, fail: prevFail, busy: prevBusy }; },
    // Gegenstück zu `markVisited` — EINE Karte zurücknehmen. Die eigene Textur wird freigegeben, der
    // Zettel fällt auf den geteilten Leerzettel seiner Zone zurück (bleibt also da, wie es sich für
    // ein Stück Karte gehört). Wer die Reise mitschreibt, ruft daneben `journey.forget(card)`.
    unvisit(card) {
      if (!card || !card.data.visited) return false;
      card.data.visited = false;
      card.data.note = '';
      if (visited > 0) visited--;
      if (card.postTex) { card.postTex.dispose(); card.postTex = null; }
      card.pmat.map = null;
      dressBlank(card);
      card.foldWant = 0;
      return true;
    },
    resetProgress() {
      for (const c of cards) {
        if (!c.data.visited) continue;
        c.data.visited = false;
        // Der Zettel bleibt — er wird wieder leer. Vorher verschwand er; das war richtig, solange er
        // der Beweis des Besuchs war, und ist falsch, seit er zur Karte gehört.
        if (c.postTex) { c.postTex.dispose(); c.postTex = null; }
        c.data.note = '';
        dressBlank(c);
      }
      visited = 0;
    },
    dispose() {
      for (const c of cards) {
        c.mesh.geometry.dispose(); c.mat.dispose();
        c.decal.geometry.dispose(); c.dmat.dispose();
        c.postit.geometry.dispose(); c.pmat.dispose();
        if (c.postTex) c.postTex.dispose();
        if (c.field) c.field.dispose();
        if (c.preview) c.preview.dispose();
      }
      for (const t of zoneTex) t && t.dispose();
      for (const t of blankTex) t && t.dispose();
      for (const t of maskTex) t.dispose();
      for (const t of decalTex) t.dispose();
    },
  };
}
