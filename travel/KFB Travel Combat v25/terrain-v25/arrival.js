// ============================================================================
// arrival.js — KFB Travel · Slice S56 (v10) · die Ankunfts-Regie
// ----------------------------------------------------------------------------
// Georgs Befund vom 2026-07-25, wörtlich: „das dreht sich da irgendwie durch die
// Karte weg, wird dann transparent". Die Reise ist okay — **Anflug und Abflug
// sind es nicht.**
//
// DIE URSACHE IST NICHT EIN FEHLER, SONDERN EINE FEHLERKLASSE: es sind heute
// VIER Bewegungen, die sich nicht kennen, und jede hat ihre eigene Uhr.
//
//   1. der Dock-Mix        `k += (1−k)·dt·2,4`            → eigene Rate
//   2. der POV-Faktor      aus `dist`, Rate 2,2/s          → eigene Rate
//   3. die Flug-Karte      Tiefpass 2,4/s auf einer Schwelle bei k = 0,28
//   4. das Pet-Facing      Mischung 2,4/s auf `speed01`    → eigene Rate
//
// Jede für sich ist weich. Zusammen ergeben sie das Durchdrehen und das
// Wegtransparentieren — und beim Abflug war es schlimmer, weil dort VIER
// verschiedene Rückwege liefen (Zoom 2,4/s, Dock 1/0,55 s, Verdeckung 2,4/s,
// Facing 2,4/s) und der Zoom beim Lösen zusätzlich HART auf 9 gesetzt wurde.
//
// DIE REGEL HIER, dieselbe wie bei `camera-rig.js`: **eine Bewegung, ein
// Fortschritt.** Die Regie besitzt EINE Zahl `a` von 0 bis 1. Alle vier Anteile
// werden aus ihr ABGELEITET — sie haben keine eigene Uhr mehr, nur ein Fenster
// auf `a`. Der Abflug ist derselbe Fortschritt rückwärts, also sind die vier
// Anteile auf dem Rückweg zwangsläufig dieselben Kurven.
//
// DIE FÜNF BEATS liegen als Grenzen auf demselben `a` (`P.seg`):
//
//   0.00 ──anfliegen── 0.30 ──bremsen── 0.62 ──ausrichten── 0.80 ──landen── 1.00
//        (Karte wird groß)   (Schwung)      (Pet steht)        (Kamera nimmt
//                                                               das Blatt)
//
// **Woher der Fortschritt kommt, ist pro Beat verschieden — und das ist Absicht:**
//   · anfliegen  aus der Restdistanz relativ zum Bremsweg (die Physik führt)
//   · bremsen    aus `1 − v/v₀` (der Schwung selbst ist die Kurve, Kanon aus S32c)
//   · ausrichten aus dem settle-Beat des Piloten (Zeitrampe, das Pet steht ja)
//   · landen     aus einer Zeitrampe (`landTime`) — hier gibt es keine Physik mehr,
//                nur noch den letzten Weg der Kamera zum Blatt
// Alles läuft durch DIESELBE Sprungbremse (`maxRate`), also kann kein Beat
// springen, auch wenn seine Quelle springt.
//
// **Die vier Fenster fallen auf die Beats** — das ist keine Kosmetik, sondern die
// Bedingung dafür, dass beim Anfordern des Docks nichts springt: `dockWin` beginnt
// genau dort, wo der Pilot das Dock anfordert (0,80). Ein Fenster, das früher
// aufmacht, würde beim Anfordern von 0 auf 0,53 schnappen.
//
//   const arr = createArrival({});
//   arr.update(dt, { armed, flying, braking, settling, docked, speed, dist, brakeStart });
//   camRig.setZoom(arr.zoom, arr.zoomRate);   // nur solange `arr.owns`
//   dock.setK(arr.dockK);                     // das Dock hat keine eigene Uhr mehr
//   fadeApply(pet, arr.hide);  petFace.update(dt, { …, arrive: arr.face });
//   arr.release();                            // Esc/Steuern → derselbe Faktor rückwärts
// ============================================================================

export function createArrival(opts = {}) {
  const P = Object.assign({
    // Die Beats als Grenzen auf EINEM Fortschritt. `out` = Sekunden, die der
    // RÜCKWEG durch dieses Segment braucht — der Abflug ist damit derselbe Weg,
    // nur mit eigenem Tempo pro Beat (gleichmäßig rückwärts wäre falsch: das
    // Landen dauert vorwärts 0,9 s, rückwärts darf es nicht in 0,17 s wegreißen).
    seg: [
      { name: 'anfliegen', to: 0.30, out: 0.18 },
      { name: 'bremsen', to: 0.62, out: 0.34 },
      { name: 'ausrichten', to: 0.80, out: 0.22 },
      { name: 'landen', to: 1.00, out: 0.48 },
    ],
    approachSpan: 2.4,   // ×Bremsweg: so weit vor dem Bremspunkt beginnt „anfliegen"
    outScale: 1,         // Gesamttempo des Rückwegs (1 = die `out`-Zeiten oben)
    alignTime: 0.7,      // s — Zeitrampe durch „ausrichten" (das Pet steht schon)
    landTime: 1.6,       // s — der letzte Weg der Kamera auf das Blatt
    maxRate: 1.5,        // 1/s — Sprungbremse: KEIN Beat darf springen, egal was die Quelle tut
    v0Min: 8,            // u/s — Untergrenze für das Referenztempo der Bremskurve
    // S75 · **Der Anflug endet im POV** (Georgs Regie: Anflug → kinetisch plausibles Einzoomen auf das
    // Pet bis POV → durch die Karte → Gummiband zurück in die Reiseansicht).
    //
    // Hier lag der Grund für sein „das Pet dreht sich zur Seite und verschwindet in der Karte", und es
    // war eine ZAHL: `zoomNear` war 2,4 u — das POV-Mischband in `camera-rig.js` reicht aber von 3,6 u
    // (ganz Follow) bis 1,0 u (ganz POV). Bei 2,4 u steht der Mischfaktor auf **0,46**: die Regie kam
    // nie im POV an, das Pet blieb halb sichtbar, und man sah es sich drehen. Jetzt 0,75 u — unter
    // `povNear`, also erreicht der Anflug den POV wirklich, und das Pet ist dann WEG statt verdreht.
    // **S89 · Der POV-Zoom beginnt ERST, wenn das Pad steht.** Georgs Regie, wörtlich: „man fliegt
    // mit dem Pad ganz normal auf die Karte zu, und in dem Moment, wo das Pad vor der Karte ist,
    // hört es auf, diese rollende Bewegung zu machen, bleibt einfach stehen — und dann zoomt man
    // auf den Point of View." Zwei Beats nacheinander, nicht übereinander.
    //
    // Vorher lag `zoomWin` bei [0,15 · 0,72] — also mitten im ANFLUG: die Kamera fuhr ins POV,
    // während das Pad noch bremste, und weil sie dabei ins Pad hineinfährt, verschwand es aus dem
    // Bild, kurz bevor die Karte da war. Das ist Georgs „Pad verschwindet unter oder hinter ihr":
    // nicht Geometrie (gemessen endet das Pad 6,3 u VOR der Karte, Höhenversatz 0,0 u), sondern
    // REIHENFOLGE. Jetzt beginnt der Zoom bei 0,66 — das Bremsen endet bei 0,62, das Pad steht also —
    // und läuft über `alignTime` + `landTime` = 2,3 s in den POV. Damit ist die Ankunft dieselbe, die
    // man von Hand hinbekommt: hinfliegen, stehen bleiben, reinzoomen.
    // **S93 · `zoomNear` darf eine FRAGE sein, keine Zahl.** Solange es eine Zahl war, hatte die
    // Ankunft zwei Endzustände: hier 0,75 u (POV), im Dock die Leseweite (gemessen 8 u vor der
    // Karte, also 2,19 u hinter dem Fahrzeug). Der letzte Beat musste die Differenz rückwärts
    // fahren — dabei kam das Pad zurück ins Bild und wurde sichtbar weggeblendet. Jetzt fragt die
    // Regie das Dock, wohin sein Lesebild die Kamera stellt (`dock.followFor`), und läuft genau
    // dorthin: EIN Endzustand, kein Rückweg, kein Ausblenden.
    // Rückweg: `zoomNearOf` weglassen → dieser Wert gilt wieder, inklusive POV-Ende.
    zoomWin: [0.66, 0.94], zoomFar: 9, zoomNear: 0.75, zoomRate: 3.4,
    // **S88 · Der Abflug wird in u/s begrenzt, nicht in Fortschritt/s. Das ist die Reparatur des
    // Katapults.** Georgs Befund „Abflug ist auch nicht sauber gebaut", gemessen: der Anflug dauert
    // 9 s, der Rückweg **1,2 s**; der Zoom lief dabei 0,75 → 2,1 → 11,86 → 9 u, größter Schritt
    // **7,13 u in 300 ms**. Das Pet kam im selben Augenblick von Deckkraft 0 auf 1 zurück.
    //
    // Der Grund ist eine Maßstabsfalle: die Segment-Zeiten (`out`) messen FORTSCHRITT, aber die
    // gesamte Zoom-Strecke von 8,25 u liegt in nur 0,57 davon (`zoomWin`). Bei 0,9 Fortschritt/s
    // sind das ~13 u/s Kamerafahrt — in derselben Regie, in der der Anflug dieselbe Strecke über
    // Sekunden zurücklegt. Eine Zahl, die in einer Richtung Sekunden bedeutet und in der anderen
    // Meter, ist keine Zahl.
    //
    // Jetzt begrenzt `zoomOutMax` die Rückfahrt in Weltmaß: die Regie rechnet jeden Frame aus, wie
    // viel Kamerafahrt ein Schritt Fortschritt gerade kostet (numerische Steigung von `zoom`), und
    // drosselt den Schritt entsprechend. EINE Uhr bleibt es trotzdem — `a` ist weiter der einzige
    // Fortschritt, nur seine Geschwindigkeit kennt jetzt die Welt. Alles andere (Verdeckung, Dock,
    // Facing) hängt an `a` und wird dadurch automatisch mitgebremst; das Pet blendet nicht mehr
    // über 0,6 s zurück, sondern über den ganzen Weg.
    // 4,5 u/s = die 8,25 u in ~1,8 s, der ganze Abflug in ~2,6 s (gemessen unten).
    zoomOutMax: 4.5,
    // **S89m · Auch die Dock-Fahrt wird gedrosselt — sie war der einzige ungebremste Abschnitt.**
    // Über a = 0,94 endet `zoomWin`, `zoom` ist dort KONSTANT — der Steigungsschätzer aus S89c liest
    // also Steigung 0 und drosselt gar nicht. Gemessen: das Dock mischt auf dem Hinweg in 0,467 s ein
    // und auf dem Rückweg in **0,150 s** aus (Verhältnis 3,11×, Spitzenrate 10,35/s), und die
    // Kamerafahrt des Docks (~1,4–2,2 u) läuft damit bei ~9–15 u/s gegen den eigenen Deckel von 4,5.
    // Ursache war die Verengung von `dockWin` (0,80 → 0,94) ohne neue Abnahme.
    // Derselbe Griff wie beim Zoom, nur auf der Dock-Kurve: 1/s, wie schnell `dockK` fallen darf.
    // 2,1 ≈ die 0,467 s des Hinwegs — rein und raus dauern damit gleich lang.
    dockOutMax: 2.1,
    // **Das Gummiband des Abflugs.** Nur auf dem Rückweg, und **am ENDE davon**: das war der Fehler des
    // ersten Versuchs — `sin(πu)` über den ganzen Weg hebt nur die MITTE an, und dort liegt der Abstand
    // noch 4 u unter der Reiseansicht. Gemessen: Überschwinger 0,00 u, also gar keine Feder. Jetzt liegt
    // der Bogen in den letzten `springWin` des Weges (u → 0), wo der Abstand fast schon der Ruheabstand
    // ist — dort hebt er ihn darüber hinaus, und bei u = 0 ist er wieder null (kein Sprung am Ziel).
    // Gemessen mit `zoomSpring 4.2`: Überschwinger 2,86 u — das war zusammen mit der ungebremsten
    // Rückfahrt ein Schnalzen. Mit der Drosselung darunter reicht die Hälfte, um als Feder zu lesen.
    zoomSpring: 2.4, springWin: 0.35,
    // Das Pet dreht sich erst, wenn es schon aus dem Bild ist — vorher lag das Facing-Fenster VOR dem
    // Ausblenden (0,38 gegen 0,70), und genau diese 0,32 Fortschritt sah man als Wegdrehen.
    //
    // **S76b · Und das Ausblenden ist ein Sicherheitsnetz, keine Regie.** Georgs Befund nach S75: „das
    // Pet ist plötzlich weg, statt unten aus dem Bild zu fahren — und ploppt nach dem Detailview wieder
    // auf". Richtig, und die Ursache ist, dass S75 das Fade noch BRAUCHTE: solange der Anflug im
    // Mischband stehen blieb (POV-Faktor 0,46), musste das Pet weggeblendet werden, weil es sonst mitten
    // im Bild saß. Seit der Anflug wirklich im POV ankommt, erledigt die KAMERA das: die POV-Position
    // liegt 1,15 u über der Karte, das Pet rutscht dabei von selbst unten aus dem Bild. Ein Fade darüber
    // ist doppelt — und weil es in der Bildmitte lag, sah man es als Verschwinden und beim Abflug als
    // Aufploppen. Jetzt liegt es ganz am Ende (0,90—1,00), also dort, wo das Pet ohnehin nicht im Bild
    // ist: es fängt nur den Fall ab, dass die Kamera doch etwas davon erwischt.
    // S93b · Etwas früher als 0,95: die Drehung soll IM Lesebild ankommen, nicht am letzten Frame
    // anfangen. Zusammen mit `arriveDamp` (8/s) sind das ~0,7 s Schwenk.
    faceWin: [0.90, 1.00], faceOn: true,
    // **S83c · Das Ausblenden muss VOR dem POV fertig sein — sonst wird ein halbdurchsichtiges Pet in
    // der Kartenebene gezeichnet, und genau das sind Georgs „Ohren unter der Ink-Outline" (das Decal
    // liegt 0,16 u vor dem Blatt). Gemessen mit `hideWin [0,45 · 0,95]`: 14 Frames sichtbar bei unter
    // 1,6 u Abstand, 8 davon unter 1,0 u — die Verdeckung war LANGSAMER als der Zoom.
    // Die Rechnung dahinter: der Zoom erreicht 1,6 u bei a ≈ 0,60, also muss die Verdeckung dort schon
    // 1 sein. Das Fenster endet deshalb bei 0,58 — und der Abflug behält seinen Überlapp, weil das
    // untere Ende (0,30) tief im Zoomfenster liegt: das Pet kommt zwischen 1,7 u und 7,6 u zurück.
    // S83c · (Fenster ersetzt durch `hideFrom`/`hideTo` — siehe dort. Der Grund steht als Messung
    // dabei; die alte Zeile bleibt weg, damit nicht zwei Bezugsgrößen nebeneinander stehen.)
    //
    // **S85 · Die Verdeckung hängt am ABSTAND, nicht am Fortschritt.** Georgs Befund am v13-Ring:
    // „Pet verschwindet plötzlich, bevor die Karte mit POV erreicht ist". Gemessen an einem echten
    // Anflug (Protokoll alle 250 ms): bei 43 u vor der Karte war das Pet schon zu 57 % weg, bei 15 u
    // ganz — die Kamera stand dabei noch 4,5 u dahinter, das Pet also mitten im Bild.
    //
    // Die Ursache ist die BEZUGSGRÖSSE: `hideWin` lag auf `a`, und `a` misst den Fortschritt der
    // Regie, nicht die Nähe der Kamera. In v12 fiel beides zufällig zusammen, weil `growAhead` jeden
    // Anflug auf dieselben 190 u zurechtschnitt. Der Ring stellt die Karten dorthin, wo die Registry
    // sie hinstellt — damit war die Kopplung weg und ein Fenster auf `a` sagt über die Bildwirkung
    // nichts mehr aus.
    //
    // Ein Sicherheitsnetz gegen „Pet in der Kartenebene" gehört an den Kamera-Abstand, denn genau der
    // entscheidet, ob das Pet noch im Bild ist. Es ist trotzdem KEINE zweite Uhr: `zoom` ist selbst
    // eine Funktion von `a`. Das Fade beginnt bei `hideFrom` u und ist bei `hideTo` u fertig — letzteres
    // liegt über der S83c-Grenze von 1,6 u, also ist das Pet verdeckt, bevor es die Tuschekante
    // erreichen kann, und der POV-Mischbereich des Rigs (3,6 u → 1,0 u) trägt den Rest.
    // **S89e · Das Netz liegt jetzt IM POV, nicht davor.** Georg: „mir ist grundsätzlich nicht klar,
    // warum wir das überhaupt ausblenden — wenn ich in den normalen POV zoome, ist das Pad ja weg."
    // Genau richtig, und der Kommentar oben (S76b) sagt es selbst: das Ausblenden ist ein
    // SICHERHEITSNETZ, keine Regie. Es lag nur an der falschen Stelle: fertig bei 1,7 u, angefangen
    // bei 3,6 u — also verschwand das Pad, während die Kamera noch drei Kartenlängen dahinter stand
    // und der POV (ab 1,0 u) noch gar nicht begonnen hatte. Man SAH also ein Ausblenden, wo die
    // Kamera es von selbst erledigt hätte.
    // Jetzt 1,9 → 1,1 u: das Pad bleibt sichtbar, bis die Kamera zu ~70 % im POV steht, und ist
    // verdeckt, bevor das Dock übernimmt (Zoom bei a = 0,94 ist 0,75 u < 1,1). Das Netz fängt nur
    // noch den einen Fall ab, für den es da ist: dass die Kamera doch etwas vom Pad erwischt.
    // **Offen und bewusst:** ganz weglassen geht erst mit der Durchflug-Animation (Rollercoaster v11),
    // dann tritt man durch die Karte, statt vor ihr zu halten.
    hideFrom: 1.9, hideTo: 1.1,
    // **S89j · Das Netz ist AUS. Georgs Entscheidung, und die Geometrie gibt ihr recht.**
    // Er hat es dreimal gemeldet und einmal gefragt, warum wir überhaupt ausblenden. Die Antwort:
    // wir müssen nicht. Bei echtem POV (`povS` = 1, ab 1,0 u) setzt das Rig die Kamera AUF das Auge
    // des Pets — der Körper liegt dann hinter der Kamera und ist von selbst weg, ohne einen einzigen
    // Deckkraft-Wert. Und der Teppich DARF zu sehen sein: in der Ego-Perspektive ist er das Fahrzeug
    // unter dir, kein Störer.
    // Der Grund, warum jede Lage des Fensters falsch aussah, ist ein echter Widerspruch: früh
    // ausblenden heißt „weg, bevor ich angekommen bin" (S89e-Befund), spät ausblenden heißt „ein
    // bildfüllendes Objekt löst sich auf" (dieser Befund). Ein Verlauf kann nicht beides vermeiden —
    // also war der Verlauf selbst die falsche Antwort.
    // Der Handbetrieb ist NICHT betroffen: dort blendet weiter `camRig.petFade` das Pet (und nur das
    // Pet) beim Zoomen ins POV — genau das Verhalten, das Georg als richtig beschrieben hat.
    // Rückweg: `hideOn` auf true, dann gilt wieder das Fenster oben.
    hideOn: false,
    // **S89b · Das Dock übernimmt ERST, wenn der POV-Zoom durch ist.** Georgs Screenshot kurz vor der
    // Landung: das Pet steht sichtbar VOR der Karte und liegt dabei auf dem Blatt, unter der Tusche.
    // Das war keine Geometrie, sondern wieder eine Überlappung von Beats: `dockWin` begann bei 0,80,
    // der Zoom war dort aber erst bei 4,9 u — die Kamera wanderte also schon auf die Leseposition VOR
    // der Karte, während das Pad noch zwischen ihr und der Karte hing und erst zu 40 % verdeckt war.
    // Bei 0,92 ist die Verdeckung rechnerisch komplett (Zoom 1,6 u < `hideTo`), also fängt das Dock
    // dort an. Der letzte Weg der Kamera ist dann klein — sie steht schon fast auf dem Zielpunkt.
    // S89e · Nachgezogen: der POV ist jetzt bei a = 0,94 erreicht, das Dock beginnt dahinter.
    dockWin: [0.94, 1.00],
  }, opts.params || {});

  let a = 0, dir = 0, releasing = false, v0 = 0, alignT = 0, landT = 0, from0 = 0;
  // S92b · **Umlenken ist keine Rückkehr.** Siehe `reorder()` unten: EIN Auftrag darf die Uhr
  // einmal nach unten stellen — auf den Wert, den der neue Auftrag braucht, nicht auf 0.
  let reordering = false;
  let endFrame = false, runs = 0, lastJump = 0;
  // Messung: Winkelsprünge pro Frame, getrennt nach Richtung. Die Abnahme dieses Slices
  // lautet „Sprung pro Frame ≤ 1,5 × Median in BEIDEN Richtungen" — also muss die Regie
  // beide Richtungen selbst zählen können, sonst misst man wieder am Bedienweg vorbei.
  const M = { up: [], down: [] };

  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const smooth = (t) => t * t * (3 - 2 * t);
  const win = (lo, hi) => smooth(clamp01((a - lo) / Math.max(1e-4, hi - lo)));
  // `zoom` als reine Funktion eines Fortschritts — damit die Drosselung des Abflugs dieselbe Kurve
  // befragen kann wie das Bild. Zwei Rechnungen für eine Kamerafahrt wären wieder zwei Wahrheiten.
  const winAt = (av, lo, hi) => smooth(clamp01((av - lo) / Math.max(1e-4, hi - lo)));
  const dockAt = (av) => winAt(av, P.dockWin[0], P.dockWin[1]);
  // Eine Zahl oder eine Frage — aber immer EIN Wert pro Frame (der Löser im Dock ist
  // deterministisch, und die Drosselung unten befragt `zoomAt` mehrfach je Frame).
  // **Der Haken heißt `zoomNearOf` und NICHT `zoomNear`.** Erster Anlauf hat die Zahl selbst zur
  // Funktion gemacht — und damit den Boot gesprengt: der Regler „Nähe in der Landung" in
  // `settings-schema.js` liest `params.zoomNear` und formatiert ihn mit `toFixed(1)`. Eine Zahl,
  // die manchmal eine Funktion ist, hat zwei Typen und damit zwei Wahrheiten. Jetzt bleibt
  // `zoomNear` die Zahl (Regler + Rückfall), `zoomNearOf` ist die Frage, und wer fragt, gewinnt.
  function nearOf() {
    if (typeof P.zoomNearOf === 'function') {
      const v = P.zoomNearOf();
      if (v > 0.05 && isFinite(v)) return v;
    }
    return P.zoomNear;
  }
  function zoomAt(av, spring) {
    const u = winAt(av, P.zoomWin[0], P.zoomWin[1]);
    const base = P.zoomFar + (nearOf() - P.zoomFar) * u;
    if (!spring || u >= P.springWin) return base;
    return base + P.zoomSpring * Math.sin(Math.PI * (u / P.springWin));
  }

  function segAt(v) {
    for (const s of P.seg) if (v <= s.to + 1e-6) return s;
    return P.seg[P.seg.length - 1];
  }
  function segSpan(s) {
    const i = P.seg.indexOf(s);
    return s.to - (i > 0 ? P.seg[i - 1].to : 0);
  }

  // Wohin will der Fortschritt DIESEN Frame? Eine Quelle pro Beat, sonst nichts.
  function wantOf(s) {
    if (!s || s.armed === false) return 0;
    if (releasing) return 0;
    const B = P.seg;
    // S92b · **Ein Umlenken beendet den alten Auftrag — auch für die Frage „wohin will der Fortschritt".**
    // `s.docked` ist `dock.owns` und damit in der Abflug-Phase noch true; ohne diese Ausnahme zieht der
    // Dock-Beat den Sollwert weiter nach oben, die Uhr bleibt bei 0,94 stehen und der Halt greift wieder
    // (gemessen: `a` 0,94, Zoom 0,75 u = POV, Tempo 0,00 u/s, Reststrecke 92,7 u eingefroren — derselbe
    // Deadlock eine Kerbe tiefer). Während des Umlenkens zählen nur die Beats des NEUEN Auftrags.
    if (!reordering && s.docked) return B[2].to + (B[3].to - B[2].to) * clamp01(landT / Math.max(0.05, P.landTime));
    if (!reordering && s.settling) return B[1].to + (B[2].to - B[1].to) * clamp01(alignT / Math.max(0.05, P.alignTime));
    if (s.braking) {
      if (!v0) v0 = Math.max(P.v0Min, s.speed || 0);
      return B[0].to + (B[1].to - B[0].to) * smooth(clamp01(1 - (s.speed || 0) / v0));
    }
    if (s.flying) {
      // Der Anflug-Beat beginnt nicht an einer festen Distanz, sondern relativ zum Bremsweg —
      // der hängt am Tempo (v²/2a), also stimmt das Bild bei 20 u/s wie bei 60. **Die Bezugsweite
      // wird beim EINTRITT eingefroren.** Gemessen: ungefroren wächst `brakeStart` mit dem Boost
      // schneller, als die Distanz fällt — der Fortschritt lief dann rückwärts (37 Frames von 550,
      // dreimal bis auf 0). Ein Maßstab, der sich mitbewegt, ist kein Maßstab.
      const bs = Math.max(1, s.brakeStart || 34);
      const d = s.dist || 0;
      if (!from0 && d > 0 && d < bs * P.approachSpan) from0 = d;
      if (!from0) return 0;
      return P.seg[0].to * smooth(clamp01(1 - d / from0));
    }
    return 0;
  }

  function update(dt, s) {
    const d = Math.max(1e-4, Math.min(0.05, dt || 1 / 60));
    // **Ein Fortschritt gehört EINEM Auftrag — aber ein neuer Auftrag ist kein Rückzug.**
    //
    // Hier stand ursprünglich `if (s.flying || s.braking) releasing = false;` („ein neuer Auftrag
    // schlägt den Rückzug"). Das widerspricht der Regel unten (`a` ist monoton, solange ein Auftrag
    // läuft) und ergab den S92-Deadlock: bricht der Rückzug mitten drin ab, während schon ein neuer
    // Auftrag läuft, ist `goal = max(a, want)` — `a` friert auf dem hohen Wert der ALTEN Ankunft ein,
    // und `travel-poc` liest genau daraus den Halt (Schub 0, Bremse 1, Tempo-Boden weg). Gemessen:
    // Pad fuhr 13,3 u, dann 0,00 u/s, Reststrecke 74,9 u eingefroren, Auftrag nach ~10 s aufgegeben.
    //
    // Der erste Versuch war „dann eben ganz auf 0 zurück und neu armieren" — **und der war sichtbar
    // falsch.** Georgs Befund dazu, wörtlich: *„jetzt bounce ich von der (eigentlich korrekten) POV
    // zurück, sehe dann wieder pet & karte, die dann verschwinden"*: die Kamera fuhr die ganzen 4 s
    // aus dem POV heraus (Pet und Karte kommen zurück) und beim neuen Anflug wieder hinein. Ein
    // Jo-Jo. Richtig ist die Regie NICHT rückwärts, sondern **weiter**: der neue Auftrag braucht bei
    // 90 u Reststrecke einen kleinen `a`, also stellt `reorder()` die Uhr EINMAL nach unten auf genau
    // diesen Wert — gedrosselt mit derselben Bremse wie der Abflug — und ab da ist sie wieder monoton.
    // Aus dem POV heraus muss die Kamera sowieso (man fliegt weg); sie fährt einmal hinaus und dann
    // erst bei der NÄCHSTEN Karte wieder hinein. Kein zweites Verschwinden in der Nähe.
    if (s && s.settling) alignT += d; else if (!(s && s.docked)) alignT = 0;
    if (s && s.docked && !releasing) landT += d; else landT = 0;
    if (s && !s.flying && !s.braking && !s.settling && !s.docked) v0 = 0;
    // Die Bezugsweite des Anflug-Beats gilt genau EINEM Auftrag: sie wird beim Eintritt in den
    // Fly-Beat gesetzt und beim Verlassen weggeworfen — sonst rechnet der nächste Anflug mit der
    // Strecke des vorigen (und das fällt erst bei kurzen Zonenwechseln auf).
    if (!(s && s.flying)) from0 = 0;

    const want = wantOf(s);
    const prev = a;
    // **Eine Ankunft geht nicht rückwärts.** Solange ein Auftrag läuft, ist `a` monoton — die
    // Quellen der einzelnen Beats dürfen zittern (die Karte driftet, der Pilot korrigiert den
    // Kurs, das Tempo schwankt in der Bremse), aber die REGIE darf es nicht: sonst atmen Zoom,
    // Deckkraft und Facing gemeinsam, und genau das sieht man. Der einzige Weg nach unten ist
    // der Abflug — gelöst (`release`) oder Auftrag weg.
    // **S92 · `leaving` zählt als Rückzug.** Der Runner gibt `docked: dock.owns` herein, und das ist
    // auch in der Abflug-Phase (`leave`) noch true — daraus entstand ein Deadlock: das Dock verlässt
    // `leave` erst, wenn `dockK` auf 0 fällt (es hat seit S56 keine eigene Uhr), und `dockK` fällt nur,
    // wenn die Regie zurücklaufen darf. **Gemessen vorher: nach 14 s Phase „leave", `dockK` 1,000,
    // Tempo 0,0 u/s — das Dock wartete auf die Regie, die Regie auf das Dock.** `leaving` ist die eine
    // fehlende Tatsache; sie gehört dem Dock (`dock.phase === 'leave'`) und ist nicht zirkulär, weil
    // sie in `dock.release()` entsteht und nicht aus `dockK`.
    // `leaving` zählt als Rückzug — aber nicht, wenn gerade umgelenkt wird: dann bringt die Fahrt auf
    // den neuen Wert `dockK` ohnehin nach unten, und der Weg auf 0 wäre wieder das Jo-Jo.
    const retreat = releasing || (s && s.leaving && !reordering) || !(s && (s.flying || s.braking || s.settling || s.docked));
    // Drei Fälle, und jeder hat einen Satz: **Rückzug** → 0 · **Umlenken** → auf den Wert des neuen
    // Auftrags (einmal, auch nach unten) · **laufender Auftrag** → monoton nach oben.
    if (reordering && want >= a - 1e-4) reordering = false;   // unten angekommen: ab hier wieder monoton
    const goal = retreat ? 0 : (reordering ? want : Math.max(a, want));
    // Rate: vorwärts die Sprungbremse, rückwärts das Tempo des Segments, in dem wir gerade sind.
    let rate = P.maxRate;
    if (goal < a) {
      const sg = segAt(a);
      rate = Math.min(P.maxRate, segSpan(sg) / Math.max(0.05, sg.out * P.outScale));
      // **Drosselung in Weltmaß.** Wie viel Kamerafahrt kostet ein Schritt Fortschritt hier?
      //
      // **S89c · Die Steigung muss LOKAL gemessen werden, und über den Schritt, der wirklich kommt.**
      // Erster Anlauf war eine Rückwärts-Sehne über feste 0,02 — und die hebt sich am Scheitel der
      // Feder gegenseitig auf: die steigende und die fallende Hälfte kürzen sich weg, der Begrenzer
      // sah 6,1 statt 29,6 und öffnete den Gashahn genau an der steilsten Stelle. Gemessen: Spitze
      // **22,0 u/s** gegen eine Deckelung von 4,5, und 47 von 149 Frames über dem Limit — alle im
      // Federbogen, also ausgerechnet dort, wofür die Drosselung geschrieben wurde. Eine Sehne über
      // einen Bogen ist keine Steigung.
      //
      // Jetzt: zentrale Differenz mit winzigem h an VIER Punkten über den bevorstehenden Schritt, und
      // der schlechteste zählt. Zwei Durchgänge, weil der Schritt selbst von der Rate abhängt (kleinere
      // Rate → kürzerer Schritt → andere Punkte); nach zwei Runden steht er.
      const h = 0.0015;
      for (let it = 0; it < 2; it++) {
        const step = Math.max(1e-4, rate * d);
        let slope = 0, dSlope = 0;
        for (let i = 0; i <= 3; i++) {
          const ai = a - step * (i / 3);
          const lo = Math.max(0, ai - h);
          const s = Math.abs(zoomAt(ai + h, releasing) - zoomAt(lo, releasing)) / (2 * h);
          if (s > slope) slope = s;
          const sd = Math.abs(dockAt(ai + h) - dockAt(lo)) / (2 * h);
          if (sd > dSlope) dSlope = sd;
        }
        if (slope > 1e-3) rate = Math.min(rate, P.zoomOutMax / slope);
        if (dSlope > 1e-3) rate = Math.min(rate, P.dockOutMax / dSlope);
      }
    }
    const step = rate * d;
    a = goal > a ? Math.min(goal, a + step) : Math.max(goal, a - step);
    lastJump = a - prev;
    dir = lastJump > 1e-6 ? 1 : (lastJump < -1e-6 ? -1 : 0);
    if (prev <= 0 && a > 0) runs++;
    endFrame = prev > 0 && a <= 0;      // ein letzter Frame, damit der Zoom sauber ausläuft
    if (a <= 0) { releasing = false; reordering = false; v0 = 0; from0 = 0; }
    return a;
  }

  return {
    name: 'arrival', update,
    // ---- der eine Fortschritt und sein Zustand
    get a() { return a; },
    get dir() { return dir; },
    get phase() { return a <= 0 ? 'off' : segAt(a).name; },
    // `owns` gilt einen Frame länger als `a > 0`: sonst bliebe der Zoom auf dem vorletzten
    // Wert stehen und die Hand fände beim nächsten Rad-Ereignis einen fremden Startpunkt.
    get owns() { return a > 0 || endFrame; },
    get releasing() { return releasing; },
    get reordering() { return reordering; },
    get runs() { return runs; },
    // ---- die VIER Anteile. Alle sind Funktionen von `a` — keine eigene Uhr, kein eigener Zustand.
    get zoom() { return zoomAt(a, releasing); },
    get zoomRate() { return P.zoomRate; },
    get dockK() { return win(P.dockWin[0], P.dockWin[1]); },
    get hide() {
      // S89j · Standard aus: die Kamera erledigt es (Begründung an `hideOn`).
      if (!P.hideOn) return 0;
      const z = zoomAt(a, false);
      return smooth(clamp01((P.hideFrom - z) / Math.max(1e-4, P.hideFrom - P.hideTo)));
    },
    get face() {
      // **S93b · Die Drehung ist zurück, mit einem neuen GRUND.**
      //
      // Historie in zwei Sätzen: S89b hat sie an die Verdeckung gehängt („gedreht wird nur, was
      // niemand sieht" — die Rückseite des Modells während der Drehung war Georgs Befund), S89j hat
      // die Verdeckung abgeschaltet, und damit war die Bedingung `hide >= 0.999` **nie mehr erfüllt:
      // die Drehung war strukturell tot** (gemessen `arrival.face` = 0,000 bei `a` = 1,000, das Pet
      // stand mit dem Rücken zur Kamera im Lesebild).
      //
      // Die alte Begründung ist mit S93 verfallen. Sie lautete: die Drehung diente dazu, das Pet zur
      // KARTE schauen zu lassen, während es unsichtbar war — ein Effekt ohne Betrachter. Seit das
      // Fahrzeug einen SITZ im Lesebild hat, ist das Pet der sichtbare Erzähler, und die Drehung hat
      // ein Ziel, das man sieht: **uns**. Ein Erzähler mit dem Rücken zum Publikum ist der Fehler.
      //
      // Warum Georgs alter Befund nicht zurückkommt: er entstand, als die Kamera am Ende IM Pet stand
      // (0,75 u, POV) — eine Drehung füllte da das halbe Bild. Jetzt sitzt es 5,3 u entfernt in der
      // unteren Ecke, und die Drehung läuft über `faceWin` × `arriveDamp` in ~0,7 s.
      // Rückweg: `faceOn: false` → keine Drehung (das Verhalten seit S89j).
      return P.faceOn === false ? 0 : win(P.faceWin[0], P.faceWin[1]);
    },
    // ---- Bedienung
    release() { if (a > 0) releasing = true; },
    // S92b · **Umlenken statt Zurückfahren.** Der Runner sagt an, dass ein NEUER Auftrag läuft
    // (`flyToCard` / `flyRoute` — die zwei Stellen, an denen ein Auftrag entsteht). Die Uhr darf dann
    // einmal nach unten auf den Wert dieses Auftrags, gedrosselt wie der Abflug; danach ist sie wieder
    // monoton. Ohne das entsteht entweder ein Deadlock (`a` friert oben ein) oder ein Jo-Jo (`a` fährt
    // auf 0 und wieder hoch) — beides gemessen, beides in S92/S92b beschrieben.
    reorder() { releasing = false; reordering = a > 0; },
    cancel() { a = 0; releasing = false; v0 = 0; alignT = 0; landT = 0; dir = 0; },
    // ---- Messung (der echte Bedienweg, nicht die API)
    // Der Runner meldet den Winkelsprung der Kamera pro Frame; hier wird er nach RICHTUNG
    // sortiert. Zwei Verteilungen, weil genau der Vergleich die Abnahme ist.
    // **Gemessen wird nur, wo die Regie wirklich etwas bewegt** (ab `zoomWin[0]`). Der lange
    // ruhige Anflug davor hätte sonst den Median gedrückt — gemessen 0,17° Median gegen 1,87°
    // p95, und die 1,87° waren die Kurve des Piloten, nicht die Übergabe. Eine Kennzahl, die
    // etwas anderes misst als das, was sie prüfen soll, ist schlimmer als keine.
    sample(deg) {
      if (!(deg >= 0) || dir === 0 || a < P.zoomWin[0]) return;
      const arr = dir > 0 ? M.up : M.down;
      arr.push(deg);
      if (arr.length > 900) arr.shift();
    },
    report() {
      const stat = (arr) => {
        if (!arr.length) return { n: 0 };
        const s = arr.slice().sort((x, y) => x - y);
        const q = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))];
        const p95 = q(0.95), max = s[s.length - 1];
        return { n: s.length, med: +q(0.5).toFixed(2), p95: +p95.toFixed(2), max: +max.toFixed(2),
                 spike: +(max / Math.max(0.02, p95)).toFixed(2) };
      };
      // **Die Abnahmezahl ist der AUSREISSER, nicht das Median-Verhältnis.** Erste Fassung
      // prüfte „p95 ≤ 1,5 × Median" — und fiel durch, obwohl gar kein Sprung mehr da war:
      // der Median wird von den vielen ruhigen Frames der Reise gedrückt (0,05°), das p95 vom
      // Übergang (0,37° = exakt die Winkelbremse). Was zählt, ist, dass die Spitze nicht über
      // dem Übergang liegt: `max ≤ 1,5 × p95`, in BEIDEN Richtungen.
      const up = stat(M.up), down = stat(M.down);
      const ok = up.n && down.n ? (up.spike <= 1.5 && down.spike <= 1.5) : null;
      return { up, down, ok, runs, phase: this.phase, a: +a.toFixed(3) };
    },
    resetMeter() { M.up.length = 0; M.down.length = 0; },
    setParams(p) { Object.assign(P, p || {}); },
    get params() { return P; },
  };
}
