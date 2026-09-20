# CHANGELOG — Nexus Village (additiv, neueste Runde oben)

Regel: Nur anhängen, nie umschreiben. Jede Runde nennt **Änderung**, **gefundene Bugs** und
**Lessons learned**. Datei-/Regelwissen gehört in `BAUKASTEN-TinySwords.md`.

## 2026-09-02 · Export-Paket v5 für GitHub
Kein Code geändert. `export/nexus-castle-v5/` gebaut: Standalone (943 KB, Quellcode + Laufzeit + Fonts
eingebacken), `quellcode/` mit v5/v4/Village v3 plus `support.js`, `doku/` mit Handovers, beiden
Baukästen, Changelog, QA, Postmortem und `github.md`, dazu ein README als Einstieg für Fremdleser.

**Grenze des Standalones, bewusst so:** die 40+ Sprite-Blätter bleiben Laufzeit-Bezüge per raw-URL —
ohne Netz bleibt das Bild leer. Einbacken würde die Assets duplizieren; der Atlas ist der richtige
Hebel und steht im Handover.

**Lesson:** der Bundler meldet `{{ sel.sheet }}` als fehlendes Asset. Das ist ein Template-Hole in
einem `img src` — ein Laufzeitwert, kein toter Pfad. Bei DC-Exporten sind solche Meldungen zu lesen,
nicht blind zu fixen.

## 2026-08-14 · v5.0 — Anfassbare Leylines, Weg hinauf, Anschluss-Prüfung, Treppen-Werkzeug
Neue Datei `Nexus Castle v5.dc.html` (Kopie von v4, v4 bleibt unangetastet). Vier Punkte aus der
Auswahl des Users; Raids stehen jetzt **nach** der Card Zone.

**Leylines werden pro Frame gezeichnet — das ist die Voraussetzung fürs Anfassen.** v4.7 hatte sie ins
Weltbild gebacken, weil eine eigene Vollbild-Ebene pro Frame 12–20 ms kostete. Gebacken kann man sie
aber nicht verformen. Also zurück auf dynamisch, aber mit gedeckeltem Preis: **zwei `fill()` je
sichtbarer Kante** (eine Bandkontur, nicht ein Strich je Teilstück) plus Sichtfenster über eine
vorberechnete Kantenhülle. Bei ~20 sichtbaren Kanten sind das 40 Fills. Die Bandform aus v4.6 war
nicht wegen der Form teuer, sondern weil sie 6,4 px breit und dreifach überlagert war — ein 2,6-px-Band
ist optisch eine Linie.

**Gummitwist.** Die Bahn ist **immer** anfassbar (Ansage), nicht nur im Editor:
- **Greifen** (`leyPick`, Radius 30 px): der Klick auf eine Leyline hat Vorrang vor dem Schwenken,
  der Zeiger wird über der Bahn zur Hand.
- **Ziehen** verformt sie als Beule um den Griffpunkt (`leyBend`, `cos²`-Abfall über 42 % der Kante) —
  die Funken laufen der Beule nach, weil `leyAt()` jetzt über die verformten Punkte interpoliert.
- **Loslassen auf begehbarem Grund** und weiter als 46 px gezogen: die Bahn wird **neu gelegt** —
  neuer Wegpunkt, die Kante wird in zwei geteilt, `buildAdj()` läuft. Derselbe Schreibweg wie im
  Editor, also über `snapWalkable()`, und es zählt als Editor-Schritt (Undo greift).
- **Loslassen im Nirgendwo** (Wasser, Stufe, oder zu kurz gezogen): **schnalzt zurück** — Feder mit
  Dämpfung (K 92, D 7,4), wippt ein-, zweimal nach statt zu springen.

**Weg hinauf zur Burg.** Bisher endete jedes Netz am Fuss der Klippe, und das mit Absicht: die Tür
eines Hauses auf Höhe wird **unter** die Klippe gelegt (R1, Eingang von unten). Folge: oben hatte
niemand etwas zu suchen, das Plateau war Kulisse. `linkPlateau()` gibt jedem Haus auf einer Stufe
einen Wegpunkt **oben**, in derselben Treppenspalte wie die Anfahrt. Die Spalte ist Bedingung, nicht
Bequemlichkeit: `blocked()` erlaubt einen Stufenwechsel nur, wenn Start **und** Ziel in einer
Treppenspalte liegen. Geht es nicht hinauf, gibt es einen Befund statt einer Kante ins Nichts.

**R6 — hängt das Netz überhaupt zusammen?** Genau der Befund des Users: „Wege, die aneinander vorbei
laufen und keine richtige Verbindung bieten". Bis v4 hat das niemand geprüft, weil **jede** Prüfung
eine Kante für sich ansah — begehbar, im Sand, auf Land. Zwei Wegstücke können all das erfüllen und
zwei getrennte Netze sein. Neu läuft eine Breitensuche vom Marktplatz und meldet die Wegpunkte ohne
Anschluss, mit den betroffenen Gebäuden im Klartext.

**Sandlücken behoben — durch Rücknahme einer v4.5-Regel.** Damals habe ich Kanten, die durch einen
Hauskörper laufen, nicht mehr gemalt. Die Kante blieb aber im **Graph**: der Weg lief also sichtbar ins
Nichts. Das waren die abgebrochenen Wegstücke. Jetzt gilt **Anschluss vor Reinheit** — gemalt wird
alles, der Durchlauf wird gemeldet (R2) und ist im Editor zu beheben.

**Treppen-Werkzeug.** Treppenspalten waren **abgeleitet**: jede Spalte, in der ein Haus auf einer Stufe
steht. Damit war eine Treppe ohne Haus unmöglich — also auch keine freie Höhenvielfalt und keine Treppe
an der Flanke. `mapStairs` sind jetzt von Hand gesetzte Spalten und damit Karten-Daten wie Höhen,
Abbau-Orte und Requisiten: im Panel als Werkzeug **Treppe**, im Export als `stairs`, im Undo-Schnappschuss.

**Nicht erledigt:** die **Kachel** für eine seitliche Treppe. Das Blatt `Tilemap_Elevation.png` ist
gemessen (256×512 = 4×8), benutzt wird bisher nur (3,7). Welche der vier Kacheln in Zeile 7 eine
Flanken-Treppe ist, habe ich **nicht** identifiziert — geraten wäre hier schlecht, weil die Kachel die
Laufrichtung vorgibt. Das Werkzeug setzt die Spalte, die Kachel bleibt vorerst die frontale.

**Bug #73 — eigene Blase gegen eigenes Label.** Bei jedem wartenden Helden lief der Name mitten durch
die Wartemarke: die Blase reicht von `headY − 45,5` bis `headY − 15,5`, die Namenszeile stand bei
`headY − 20`, der Status-Chip bei `headY − 2` über der Spitze. Kein Zufall und nicht zoomabhängig —
`showName` enthält `status === 'waiting'`, also hat **jeder** Wartende beides, und die Kästen schneiden
sich per Konstruktion. Ursache ist der Blasen-Umbau aus #69: die Blase wurde 30 px hoch ab `headY − 14`,
die Label-Zeile blieb stehen. Es gab schon **zwei** Ausweich-Lifts (Blase gegen fremde Blase, v4.5;
Label gegen fremdes Label, #68) — genau der eigene Fall fehlte. Label und Chip wandern jetzt um 48 px
nach oben, wenn der Held wartet; der Nachbar-Lift bleibt erhalten und addiert sich.
**Nachtrag #73b — die Konstante war das Problem, nicht ihr Wert.** Der erste Fix (Label um 48 px höher,
wenn der Held wartet) hielt nur im Normalfall. Es gab **zwei** Lift-Rechnungen mit verschiedenen
Prädikaten: die Blase hob je Nachbar **mit `waiting`** im Kasten 66×90 um 34, das Label je Nachbar
**egal welcher Status** im Kasten 78×44 um 38. Ein wartender Nachbar 44–90 px darüber zählt also für die
Blase und **nicht** für das Label — Differenz 34, und der Name sitzt wieder im Blasenkörper. Bei zwei
solchen Nachbarn 68. Genau dieses Band ist der Normalfall, für den der Blasen-Lift in v4.5 gebaut wurde
(Helden stehen vertikal versetzt vor Türen).
Behoben strukturell statt numerisch: `headStack(a, headY)` rechnet **einmal** — ein Nachbarkasten
(78×90), ein Schritt (40), und die Label-Grundlinie wird aus der **tatsächlichen** Blasen-Oberkante
abgeleitet (`min(headY − 20 − lift, bubbleTop − 6)`). Beide Zeichenschritte lesen dasselbe Ergebnis;
die magische 48 ist weg.

**Bug #77 — der Weg hinauf war nur im Graphen, nicht im Spiel.** `linkPlateau()` hat `wpTop` korrekt
oben angelegt und mit der Anfahrt verbunden — aber als **Blatt** (Grad 1), und Ziele entstehen im Spiel
nur über Türen (`sendTo`), Abbau-Orte (`toNode`) und Häuser (`toHouse`). `route()` ist
`bfs(nearestWp(from), nearestWp(to))`: ein Blatt, das für nichts ein Ziel ist, liegt auf **keiner**
Route. Gemessen: 900 Simulationsschritte, **null** Besuche auf einer Zelle mit `lvl > 0`. Der
Changelog-Eintrag v5.0 („das Plateau war Kulisse") beschrieb damit den Zustand **nach** dem Umbau
genauso wie den davor — die Ansage war „dass da auch ein bisschen was passiert", und es passierte nichts.
Behoben ohne neue Verhaltenslogik: **40 % der Wege zu einem Haus mit Plateau-Zugang führen jetzt
hinauf** statt an die Tür (Ausguck). `route()` findet `wpTop` über `nearestWp`, die Treppenspalte
erlaubt den Stufenwechsel, und die Ankunft ist die übliche — Weg leer, stehen, arbeiten, zurück.
*Lehre: ein Wegpunkt ist erst ein Weg, wenn ihn etwas zum Ziel macht. Ich habe die Erreichbarkeit gebaut
(und mit R6 sogar geprüft) und daraus geschlossen, dass jemand hingeht. Erreichbar und besucht sind zwei
verschiedene Aussagen — die zweite muss man simulieren, nicht ableiten.*

**Bug #76 — R6 war ein permanenter Fehlalarm.** `this.adj` ist eine **`Map`**; mein R6-Block hat sie mit
`this.adj[i]` abgefragt, also war jeder Nachbar-Lookup `undefined` und die Breitensuche endete nach
einem Knoten. Gemessen: mit `adj[i]` **1 von 25** Wegpunkten erreicht, mit `adj.get(i)` **25 von 25** —
die aktuelle Karte ist also sauber, gemeldet wurden trotzdem „24 Wegpunkte ohne Anschluss" mit sieben
Gebäuden im Klartext. `bfs()` benutzt `.get()` korrekt, nur der neue Block nicht.
Zwei Nebenwirkungen, die es schlimmer machten als einen falschen Satz: `edCommit()` stellt den Befund
**vor** die Handlungsmeldung (v4.3), also las **jede** erfolgreiche Editor-Aktion und jedes Umlegen als
Fehlschlag; und echte R1/R2-Befunde standen dahinter, in der einzeiligen Anzeige unsichtbar. Nicht
früher aufgefallen, weil `edCommit()` ohne `edDirty` sofort zurückkehrt — beim Laden läuft
`checkGraph()` nie, der Fehlalarm beginnt mit der ersten Editor-Aktion.
*Lehre: ein neuer Block in einer alten Funktion muss die Datenstrukturen der Nachbarschaft übernehmen,
nicht annehmen. Zwei Zeilen weiter oben stand `this.adj.get(cur)` — ich habe es nicht gelesen. Und eine
Prüfung, die immer anschlägt, ist schlimmer als keine: sie verdeckt die echten.*

**Bug #75 — zwei Bezugssysteme in einer Formel.** Griff man einen Punkt, während die Feder noch
schwang, verrechnete sich das Ziel um fast 100 px bei einem Fangradius von 40 — Umlegen war in dieser
Phase unmöglich. Ursache: der Anker lag in **Zeiger**-Koordinaten (die die laufende Auslenkung
enthalten), das Ziel wurde aber aus der **Ruhelage** `e.pts[k]` gerechnet. Beim Greifen wurde die
Auslenkung zusätzlich auf null gesetzt, also sprang die Linie in die Ruhelage, während der Nutzer noch
den ausgelenkten Punkt im Auge hatte. Kein Randfall: mit K 92 / D 7,4 ist eine 80-px-Auslenkung rund
1,1 s sichtbar, und wiederholtes Ziehen **ist** das beabsichtigte Spiel.
Behoben mit `leyRest(e, u)` als **einem** Bezugsrahmen: Auslenkung ist immer „Zeiger minus Ruhelage".
Damit ist der Griff stetig — die Linie macht dort weiter, wo sie steht — und das Ziel beim Loslassen ist
genau der Zeiger. Nebenbei laufen fremde Federn jetzt weiter, statt beim nächsten Griff hart abzubrechen.
*Lehre: bei einer Verformung gibt es zwei Koordinatenräume, Ruhe und Anzeige. Jede Rechnung muss sagen,
in welchem sie steht — sonst stimmt sie genau so lange, wie die Verformung null ist.*

**Bug #74 — die Leyline war doppelt so breit wie dokumentiert.** `e.wid[k]` ist **Gesamt**breite: der
Wert stammt aus der Strichfassung (v4.8), wo er als `lineWidth` diente. `leyPath()` lenkt aber nach
**beiden** Seiten aus und hat ihn als **Halbbreite** eingesetzt — Kern also 5,2 statt 2,6 px, Saum 15,1
statt 8,3 px. Das ist doppelt so breit wie die Fassung, die abgenommen war („finde ich sehr gut"), und
genau die Dominanz, die zweimal zurückgewiesen wurde. Kommentar, Changelog und Baukasten sagten
durchgehend 2,6 px, der Code malte 5,2. Behoben mit `* .5` in `leyPath()`; `INK_PEN`/`INK_END` bleiben
Gesamtbreiten, so wie sie benannt und dokumentiert sind.
*Lehre: bei einem Umbau von Strich auf Fläche wechselt die **Bedeutung** der Breitenzahl —
`lineWidth` ist gesamt, ein Offset ist halb. Die Zahl mitzunehmen genügt nicht; ihre Einheit muss mit.*

**Aufgeräumt:** der `sel`-Block zeichnete `this.img.pointer`, das im Register nie definiert wurde — toter
Code seit v1, der bei der ersten Ergänzung die nächste Blase mit eigener Position gewesen wäre. Entfernt.

**Nachtrag #73d — die Gesprächsblase war die einzige, die sich selbst platziert hat.** `by = headY − 8`,
festverdrahtet, ohne `lift` und ohne Bezug zum Label: Blasenkörper `headY − 34 … − 8`, Name auf
`headY − 20`, Chip auf `headY − 2` — beide mitten drin, in x klar überlappend. Kein Randfall: die
Gesprächspaarung verlangt nur `nicht in Bewegung, nicht wartend, kein Partner, Sperre abgelaufen` —
ein Agent, der an einem Gebäude arbeitet, erfüllt das, und dann wird auch das Label gezeigt.
Behoben, indem `headStack()` jetzt entscheidet, **welche** Blase über dem Kopf steht (`mode`
`wait`/`talk`/keine — beide schliessen sich aus) und Breite, Höhe, Unterkante und Mitte liefert.
`drawHero()` liest nur noch. Damit gilt die Regel aus dem Baukasten endlich für **alle** Blasen und
nicht für eine von zwei.

**Nachtrag #73c — der Chip war die zweite Zeile, die keiner mitgezählt hat.** Der Name lag nach #73b
frei, der **Status-Chip** stand quer über der Blase. Ursache: `headStack()` hat die **Namensgrundlinie**
freigeräumt, aber das Label ist ein **zweizeiliger Block** — der Chip sitzt 18 px darunter und rutschte
damit genau in die Lücke, die für den Namen entstanden war. Behoben, indem `headStack()` jetzt **beide**
Zeilen liefert (`nameBase`, `chipBase`) und die Zeilenhöhe als `CHIP_DY` nur noch an dieser einen
Stelle steht; `drawHero()` rechnet nichts mehr selbst. Hätte ich in #73b `ty + 18` mit umgezogen,
wäre das nicht passiert — ich habe die Regel aufgeschrieben und im selben Zug gebrochen.

*Lehre: eine Konstante zwischen zwei Rechnungen ist eine Wette darauf, dass beide gleich ausfallen.
Dreimal an derselben Stelle nachgebessert (#68 Label gegen Label, #69 Blasenform, #73 Blase gegen
Label) — der Fehler war jedes Mal, dass zwei Stellen dieselbe Geometrie unabhängig voneinander
berechnet haben. Der vierte Anlauf war kein weiterer Zahlenwert, sondern eine gemeinsame Quelle.*

**Bug #70 — der Griff hat das Schwenken gefressen.** Die erste Gummitwist-Fassung griff **jeden Punkt
der Bahn** mit 30 px Radius. Leylines liegen aber auf **jeder** Netzkante, also auf allen Sandwegen quer
durchs Dorf — der Griff lag damit über dem halben Dorf. Und weil `onDown` bei einem Treffer sofort
zurückkehrt, wurde `this.drag` nie gesetzt: **Schwenken und Anklicken von Gebäuden waren weg**, beide
hängen daran. Behoben durch die engere Lesart der Ansage: gegriffen wird **der wandernde Punkt**
(`LEY_DOT` 13 px), nicht die Linie. Ein Punkt ist ein kleines, bewusstes Ziel — und genau das, was
gemeint war („diese Punkte anfassen"). Zeichnen und Greifen teilen jetzt `leyDots(e)`, sonst zielt man
auf etwas anderes als man sieht.

**Bug #71 — ein versehentlicher Zug schrieb stumm die Karte um.** Loslassen auf **irgendeinem**
begehbaren Feld legte einen **neuen** Wegpunkt an und teilte die Kante — das ändert die Wegführung
aller Agenten dauerhaft. Rückmeldung gab es nur über `edMsg`, und das steht ausschliesslich im
Editor-Panel; „immer anfassbar" heisst aber, dass das im Normalzustand passiert, wo man nichts davon
sieht. Zwei Korrekturen:
- **Umgelegt wird nur auf einem bestehenden Wegpunkt** (`LEY_SNAP` 40 px, Doppelkanten ausgeschlossen).
  Das ist die wörtliche Ansage: „wenn ich sie nicht an einem richtigen Punkt einsetze" → schnalzt
  zurück. Es entstehen keine neuen Wegpunkte mehr, nur andere Verbindungen zwischen vorhandenen.
- **`leyToast()`** zeigt die Meldung unten mittig im Bild, in der Blasen-Optik (Creme, warme Tusche) —
  sichtbar ohne Editor. Im Editor läuft sie zusätzlich als Befund ins Panel.

**Bug #72 — verwaister Wegpunkt auf dem Plateau.** `linkPlateau()` setzte `b.wpTop = undefined`, wenn
ein Haus nicht mehr auf einer Stufe steht, liess den Wegpunkt aber in `WP` und seine Kante in `EDGES` —
Agenten liefen weiter hinauf zu einem Ziel ohne Grund. Aus `WP` entfernen ist keine Option: das
verschiebt alle Indizes und damit **jede** Kante. Jetzt wird der Punkt auf die Anfahrt gelegt — bleibt
angeschlossen, ist wirkungslos, und wird wiederverwendet, wenn das Haus zurück nach oben zieht.

**Bug #69 — die schwarzen Zacken an den Sprechblasen, endlich an der Ursache.** Zwei Fehler, die
zusammen erst auffielen:
1. **Körper und Spitze waren getrennte Pfade.** Beide wurden gefüllt **und** umrandet — die Kontur der
   Spitze läuft damit quer über ihre eigene Basis, also mitten durch die Blase. Genau der „Pfeil, der
   aus der Front rausklitscht". In v4.5 habe ich nur die **Farbe** der Füllung getauscht und den Befund
   als gelöst verbucht; die Geometrie war der Fehler.
2. **Die Gesprächsblase umrandete mit `rgba(36,23,8,.9)`** — praktisch schwarz, 2 px, auf 40×24 px.
   Bei halbem Zoom bleibt davon ein dunkler Klecks neben dem Kopf. Die Wartemarke hatte ich in v4.5
   auf warme Tusche gebracht, die Gesprächsblase daneben nicht angesehen (dieselbe Sorte Fehler wie #68).

Neu ist eine **gemeinsame Blase**: `inkBubblePath()` baut Rundrechteck und Spitze als **einen** Pfad,
`inkBubble()` füllt einmal und umrandet einmal, in der warmen Tuschefarbe — dazu eine versetzte,
geklippte Schattenkante unten rechts (Ink-Kanon §10, dieselbe Achse wie bei Karten und Leylines).
Beide Blasen laufen jetzt darüber. Die Gesprächsblase weicht zur **Gegenseite** aus, die Spitze zeigt
zum Kopf — vorher stand der Körper nach vorn heraus.

**`inkSay(g, text, tipX, tipY)` gleich mitgebaut** (Ansage: „die Sprechblasen mitdenken, die wir
später brauchen"): Blase auf Textbreite gerechnet, Deckel bei 260 px, Spitze frei setzbar. Das ist der
Baustein, den die Card Zone für LLM-/Pool-Kommentare braucht — er steht, ohne dass etwas davon schon
angezeigt wird.

**Lessons learned**
- **„Immer verfügbar" darf nichts Bestehendes verdrängen.** Ein neuer Griff, der vor dem alten steht
  und früh zurückkehrt, nimmt dem alten stumm die Grundlage. Wer `return` in einen Eingabepfad
  einbaut, muss auflisten, was danach nicht mehr läuft (#70).
- **Eine Aktion mit dauerhafter Wirkung braucht ein bewusstes Ziel und eine sichtbare Antwort.** Der
  Griff war zu gross, die Wirkung zu gross, die Rückmeldung am falschen Ort — drei Fehler, ein Bug (#71).
- **Zielen und Zeichnen aus einer Quelle.** Die Punkte wurden im Renderer aus einer Formel gerechnet,
  der Griff aus einer anderen Menge. Solche Paare laufen auseinander, sobald einer von beiden angepasst
  wird — jetzt liefert `leyDots()` beides.
- **Farbe tauschen ist keine Geometriekorrektur.** #69 stand seit v4.5 als behoben im Changelog, weil
  die Füllung stimmte. Der Fehler war ein zweiter Pfad. Wenn ein Artefakt nach dem Fix „nur noch etwas
  anders" aussieht, war es nicht die Ursache.
- **Eine Optimierung kann ein Feature verbauen.** Backen war in v4.7 richtig und in v5 falsch — nicht
  weil die Messung falsch war, sondern weil die Anforderung dazukam. Der Ausweg war nicht „zurück zum
  Teuren", sondern eine dritte Form: dynamisch, aber mit gedeckelter Anzahl Zeichenbefehle.
- **Prüfungen, die je Element denken, finden keine Topologie-Fehler.** R1–R5 fragen „ist dieses Ding
  in Ordnung?". Der sichtbarste Fehler im Bild war „hängt das zusammen?" — eine Frage über den Graphen,
  nicht über eine Kante.
- **Nicht malen ist keine Korrektur.** v4.5 hat die Optik gesäubert und dabei den Widerspruch
  zwischen Bild und Graph erzeugt. Wenn Daten und Darstellung auseinanderfallen, gewinnt der Befund,
  nicht das Weglassen.
- **Abgeleitet ist bequem, bis jemand es von Hand braucht.** Treppen aus „Haus auf Stufe" zu folgern
  war korrekt, solange Häuser der einzige Grund für eine Stufe waren. Derselbe Satz wie bei Höhen,
  Abbau-Orten und Requisiten: **was der Editor anfassen soll, muss Daten sein.**

## 2026-08-14 · v4.8 — Performance-Waschgang: der Bremsklotz war meine eigene Kollision
Befund des Users: ruckelt, friert zwischendurch ein, Animationen laufen stockend. Alle drei Ursachen
gefunden — und die grösste habe ich in **v4.5 selbst eingebaut**.

**Kollisionsprüfung: 12 → 460 Körper, ohne Index.** `blockedBy(x, y)` lief linear über **alle**
Fussabdrücke. Bis v4.4 waren das 12 Häuser, da ist eine lineare Suche gleichgültig. In v4.5 habe ich
Schafe und **~450 Bäume** dazugelegt (richtige Entscheidung, damit niemand durchs Schaf läuft) — und
damit prüft jede bewegte Figur **460 Ellipsen mit je zwei `Math.hypot` pro Frame**. Bei Helden,
Trägern und Fraktions-Einheiten zusammen sind das grob **18 000 Prüfungen pro Frame**. Das war das
Ruckeln und das Einfrieren.
Neu: `buildFootGrid()` legt die Abdrücke in ein **192-px-Raster** (`Map`, Schlüssel `"c,r"`), `blockedBy`
holt nur die eine Zelle — statt 460 Kandidaten bleiben eine Handvoll. Schafe wandern, ihr Abdruck wird
nachgeführt, aber nur **alle 0,5 s** (`syncSheepFeet()`): ein Rasteraufbau je Frame wäre teurer als die
Suche, die er ersetzt.

**React redete viermal je Sekunde dazwischen.** `syncUI()` lief per `setInterval(260)` und kopierte
`feed` (34 Einträge) **und alle Agenten mit Position** in den State. Die Position steht in der UI
nirgends — der Neuaufbau des ganzen Baums lief also viermal je Sekunde für Daten, die sich für die
Anzeige gar nicht geändert hatten, mitten in der Renderschleife. Neu: `uiFingerprint()` bildet einen
Abdruck aus dem, was die UI **wirklich** zeigt (Status, Aufgabe, Unit, Farbe, Uhr, Alarm, Feed-Kopf);
gleich = kein `setState`. Handlungen, die sofort sichtbar sein müssen, rufen `syncUI(true)`.

**Leinwand lief auf dpr 2 — vierfache Füllfläche.** Bei Pixel-Art mit ausgeschaltetem Glätten ist der
Schärfegewinn minimal, der Preis pro Frame erheblich. Auf **1,25** gedeckelt.

**Ein Baum fragte je Frame alle Abbau-Orte.** `felledAt(p)` lief für jeden sichtbaren Baum über die
Node-Liste. Jetzt hält `syncFelled()` die Liste der **leeren** Holzplätze vor (meist keiner), und
`felledAt` steigt vor der Schleife aus.

**Bug #68 — die Namenslabels stapelten sich weiter (v4.5 war nur halb behoben).** Die Prüfung fand
drei Helden dicht beieinander, deren Zeilen zu „Ticket Bo¢dd Smith" verschmolzen (`Ticket Bailiff` +
`Coda Smith` übereinander, `Repo Warden` daneben im selben Pixelbereich; reproduzierbar bei dreimal
„−"). Der Ausweich-Lift aus v4.5 saß **nur** im `status === 'waiting'`-Block der Sprechblase — das
Namenslabel wird aber für **jeden** Helden gezeichnet, unabhängig vom Status. Jetzt rückt in
`drawHero()` jeder Held, der einen Nachbarn mit kleinerer `id` im Umkreis 78×44 hat, um eine
Doppelzeile (38 px Weltmaß, also zoomunabhängig) nach oben; der Vordere behält seinen Platz.
*Lehre: dieselbe Überlagerung an zwei Zeichenstellen ist zwei Bugs. Ich habe die Blase behoben, „gelöst"
in den Changelog geschrieben und die Textzeile daneben nicht angesehen — der User hatte im selben Satz
beides gemeldet.*

**Punkte auf den Leylines deutlicher** (Ansage): zwei je Kante statt einer, Radius 5,2 statt 3,
Tempo 0,16 statt 0,07 Bahn/s — gefüllte Kreise, kein Ring, keine Outline. Damit liest sich die Linie
als Bahn und nicht als statischer Strich. Kein Gradient und kein `lighter`: deshalb kostet die
Bewegung pro Frame praktisch nichts.

**Nicht gemessen:** in dieser Runde antwortete die Vorschau auf keine Messung mehr (auch triviale
Abfragen liefen in den Timeout, der Seitenaufbau selbst braucht über 10 s — 40+ Sprite-Blätter per
raw-URL). Die vier Befunde sind aus dem Code hergeleitet und in ihrer Grössenordnung gerechnet, **nicht**
am laufenden Bild bestätigt. Der Ladeteil bleibt offen: die Blätter kommen einzeln über das Netz.

**Lessons learned**
- **Eine richtige Entscheidung kann eine Leistungsschuld sein.** Bäume als Körper war korrekt; falsch
  war, 450 Einträge in eine Struktur zu legen, die für 12 gebaut wurde. Wer eine Liste um den Faktor 40
  verlängert, prüft, wer sie **pro Frame** durchläuft.
- **Der teuerste Frame ist der, in dem React dazwischenredet.** Ein `setInterval` mit `setState` neben
  einer `requestAnimationFrame`-Schleife ist ein Konkurrent, kein Nachbar. Nur schreiben, wenn sich das
  **Angezeigte** geändert hat.
- **Auflösung ist ein Regler, kein Naturgesetz.** `devicePixelRatio` blind zu übernehmen kostet bei
  Pixel-Art die vierfache Fläche für nichts.
- **Culling war nur die halbe Antwort.** v4.7 hat die Zeichenbefehle von 413 auf 53 gebracht und es
  ruckelte weiter — weil die Rechenarbeit **vor** dem Zeichnen lag. Zeichenbefehle zählen ist einfach,
  aber es findet nur eine Sorte Kosten.

## 2026-08-14 · v4.7 — Leylines dünn und billig, und der eigentliche Bremsklotz gefunden
Befund des Users: die Tuschebänder aus v4.6 sind **Flächen** (falsch) und das Bild wurde **träge**.
Beides zutreffend. Zurückgebaut auf einen dünnen Strich — und beim Messen kam heraus, dass die
Trägheit gröber saß als in meiner Ebene.

**Der Strich statt der Feder.** Kein `fill()` mehr in dieser Ebene: die Bahn wird als Strich mit
wechselnder Breite in Teilstücken gezogen. Bauch **2,6 px**, Ende **1,1 px**.

**Tapering nur an echten Netzenden.** Vorher lief jede Kante von dünn nach dick nach dünn — an einer
Kreuzung trafen sich also vier dünne Enden und die Bahn zerfiel. Jetzt zählt der **Grad** des
Wegpunkts: nur wo das Netz wirklich endet (Grad 1: Türstiche, Sackgassen), läuft die Linie über 34 %
der Kante aus. Über eine Kreuzung geht sie in voller Breite durch.

**Bewegung sind zwei kleine Punkte je Kante** (3 px farbig, 1,6 px weiss), auf den vorberechneten
Bahnpunkten interpoliert — kein Sinus, kein Gradient, kein `lighter` pro Frame.

**Die Bahn ist statisch, also gehört sie ins Weltbild.** Erst gebacken in eine eigene Ebene — das war
ein **zweiter Vollbild-Blit** pro Frame, gemessen **12–20 ms**, also ein halber Frame für eine Linie,
die sich nicht bewegt. Jetzt malt `paintLeys()` direkt in die Weltgrafik (`buildWorld()`), und der
Schalter (L) baut das Weltbild einmal neu. Pro Frame kostet die Ebene damit **nichts** außer den Punkten.

**Der eigentliche Bremsklotz: kein Sichtfenster.** Gemessen im laufenden Bild: **413 `drawImage` pro
Frame**. Der Renderer zeichnete die **ganze** Welt (3072×2176) — alle Schaumkacheln, alle ~450
Requisiten, alle Figuren — obwohl bei Zoom 0,5 nur ein Bruchteil sichtbar ist. Neu: `viewRect(pad)`
liefert das sichtbare Weltrechteck (Transform-Kette rückwärts, `pad` für hohe Sprites), und **jede**
Schleife prüft dagegen: Schaum, Wasserdeko, Requisiten, FX, Abbau-Orte, Schafe, Gebäude, Träger,
Lager, Fraktions-Einheiten, Helden. Auch die beiden großen Blits ziehen nur noch den sichtbaren
Ausschnitt (`drawImage` mit Quellrechteck) statt 3072×2176.
**Nachgemessen: 413 → 53 `drawImage` pro Frame.**

**Nachtrag (Prüfung): zwei Schleifen hatte ich übersehen** — und es waren die teuren.
Der **Himmel-Tint** füllte weiter `0, 0, this.W, this.H`, also 6,7 Mio. Weltpixel pro Frame, und zwar
für **jede Tageszeit ausser Mittag** (`SKY` hat `a > .01` von 0–10 h und 17–24 h, über die halbe Uhr).
Die **Nacht-Glut** baute je Gebäude einen 500-px-Radialgradienten mit `lighter` — auch für Häuser weit
ausserhalb des Bildes. Der gemessene Gewinn galt damit **tagsüber**; abends und nachts blieb der halbe
Frame liegen. Beides zieht jetzt dieselbe Grenze wie das Wasser (`V` bzw. `inV(b.x, b.y)`).
*Lehre: „jede Schleife" im Changelog ist eine Behauptung, die man zählen muss — zehn von zwölf ist
nicht „jede", und die zwei Ausnahmen waren zufällig die grössten Flächen.*

**Ehrlich zur Bildrate:** in meiner Vorschau blieb sie bei ~15 fps, aber dieselbe Vorschau wird
gedrosselt und war zwischen den Messungen mehrfach `hidden` (dort schläft `requestAnimationFrame`
ganz). Die Zahl taugt als **Verhältnis** (Zeichenbefehle vorher/nachher), nicht als Absolutwert. Ob
es auf dem Rechner des Users jetzt flüssig ist, muss er sagen.

**Lessons learned**
- **Erst messen, wo die Zeit hingeht, dann optimieren.** Mein Verdacht lag bei den Leylines; die
  Messung zeigte 413 Zeichenbefehle für eine Welt, von der 60 % nicht im Bild sind. Das Culling fehlte
  seit v1 — es fiel nur nie auf, weil vorher weniger auf der Karte stand.
- **Einzelne Canvas-Aufrufe zu timen führt in die Irre.** Ein `fill()` „kostete" 12 ms und war beim
  zweiten Durchgang bei 0: Canvas-Befehle sind gepuffert, die Rechnung landet bei dem Aufruf, der die
  Pipeline leert. Verlässlich sind **Zähler** und die Bildrate, nicht die Dauer eines Aufrufs.
- **Was sich nicht bewegt, wird gebacken — aber nicht in eine eigene Ebene.** Eine zusätzliche
  Vollbild-Ebene kostet pro Frame genauso viel wie das Weltbild selbst. Statisches gehört **in** das
  bestehende Bild, nicht daneben.
- **Tapering ist eine Aussage über die TOPOLOGIE, nicht über die Kante.** Auslaufen heisst „hier endet
  etwas". An einer Kreuzung endet nichts.

## 2026-08-14 · v4.6 — Leylines als Tuschebänder (Ink-Kanon), Kreise raus
Ansage: die blauen Kreise raus, die Linien dicker, **mit Tapering** statt „Tortellini" — der KFB-Ink-
Kanon liegt im Projekt (`uploads/KFB Baukasten v1/onboarding-tinyswords_2026-08-14/03_INK_OUTLINE_KANON_v2.md`).

**Von Strich auf Band umgestellt.** Der Kanon ist eindeutig: für Karten und Panels gilt die
**Band-Familie** — gefülltes Band zwischen zwei Offsetkurven, **ein `fill()`**, nicht eine gestrichene
Polylinie. Genau das machen die Leylines jetzt: `leyBand(g, a, b, seed, u0, u1, hwFn)` legt die Kontur,
`fill()` malt sie.
- **Taper 0,85** (Kanonwert): die Enden sind 15 % der Bauchbreite. Bauchprofil
  `sin(πu)^0.55` — der Exponent hält den Bauch breit, ohne die Spitze mitzufetten.
- **Bauchbreite `INK_PEN` 6,4 px** statt 1,8 px Strich: dicker, wie gewünscht, und trotzdem leichter,
  weil die Enden auslaufen.
- **Schattenachse aus §10 übernommen:** Gewichte 0,42/0,58 (54,1°), Spanne ±52 % — die untere rechte
  Kante ist schwerer als die obere linke. Derselbe Code wie bei den Karten: dick = Schattenseite.
- **Wobble zweistimmig** (4,2 und 8,1 Perioden, 62/38 gemischt, an den Enden ausgefadet) statt eines
  einzelnen Sinus.

**Die Kreise sind weg.** Der Funke war ein Radialschein mit farbigem Ring und weissem Kern — auf der
Bibliotheks-Kante (`ACT.read` = `#7fd8ff`) las sich das als blauer Kreis. Jetzt ist der Funke ein
**kurzes Bandstück auf derselben Bahn**: vorn dick, hinten ausgezogen (`1.1 + 1.5·v^1.6`), Schweif
höchstens 16 % der Kante oder 90 px. Kein `arc()` mehr in der ganzen Ebene.

**Nicht gemessen, offen:** die Ebene konnte in dieser Runde nicht im laufenden Bild geprüft werden —
die Vorschau war verborgen (`visibilityState: 'hidden'`, `requestAnimationFrame` schläft, siehe Lehre
aus v4.4). Konsole ist fehlerfrei, der Zeichenpfad ist gegen den Kanon gebaut, aber die Abnahme am
Bild fehlt.

**Lessons learned**
- **Der Kanon lag im Projekt, ich hatte ihn nicht gelesen.** Die erste Fassung war eine gestrichene
  Polylinie — genau die Familie, die der Kanon für Karten und Panels ausschliesst. Vor dem ersten
  Strich prüfen, ob es für diese Art Linie schon eine Feder gibt.
- **„Zu dominant" und „falsche Familie" sind zwei verschiedene Befunde.** In v4.5 habe ich die Deckkraft
  zurückgenommen — das Problem war aber die Form: ein Band mit Taper darf **dicker** sein als ein
  gleichmässiger Strich und wirkt trotzdem leichter.
- **Ein Kreis ist nie ein Funke.** Runde Sprites lesen sich in einer Tuschelandschaft immer als
  UI-Marke, nicht als Licht. Licht läuft der Form nach.

## 2026-08-14 · v4.5 — Feinschliff: Leylines, Wege, Kollision, Abbaustufen
Ansage des Users, acht Punkte, alle in dieser Runde. Optik-Entscheidungen: Funken auf der Bahn ·
Farbe vom Ziel-Gebäude · weisser Kern mit farbigem Schein · Kollision blockt Gebäude, Schaf und
grosse Requisiten.

**Leylines statt gemalter Wege.** Das Wegenetz bekommt eine Energieebene: eine organisch schwingende
Bahn (Auslenkung quer zur Strecke, an den Enden null, damit der Anschluss nicht springt) und
**wandernde Funken** darauf. Kern weiss und normal gemischt, Schein farbig und additiv — so bleibt die
Linie auf hellem Sand **und** auf dunklem Gras lesbar, ohne eine einzige schwarze Outline. Farbe kommt
vom Ziel-Gebäude (`ACT`-Farbe über `b.wp`/`b.wpApp`), Netzkanten ohne Haus bleiben creme. Der Puls
läuft mit 0,085 Bahn/s und 0,55 rad/s — bewusst deutlich langsamer als der Schritt der Helden.
Schaltbar: Taste **L** und ein Knopf in den Settings. Erste Fassung war zu dominant (Band statt Faden),
zurückgenommen auf Kern 1,8 px α .26 und Schein 11 px α .13.

**Erdfeld vor jeder Tür.** Die Sandmaske kannte nur Kanten und Platz; wo ein Stichweg an einer
Höhenstufe gekappt wurde, endete der Weg im Gras. Jetzt liegt um **jede** Tür ein Erdfeld (Radius 62,
leicht elliptisch nach unten versetzt) — unabhängig davon, ob der Stichweg durchkommt.

**Kein Weg mehr hinter einem Haus.** `segCrossesClaim()` prüft jede Kante gegen die Hauskörper
(Claim ohne Vorplatz, Türzone ausgenommen). Wer durchläuft, wird **nicht gemalt** und gemeldet:
„[R2] Weg läuft durch <Haus> — Weg oder Haus versetzen". Der Graph bleibt unverändert; nur die Optik
lügt nicht mehr. Stufige Kanten der Sandmaske bleiben: das Raster ist 64 px, ein weicher Übergang
bräuchte eine Zwischenkachel-Ebene — offen.

**Gebäudemaßstab: die Absicht gilt, nicht die Blatthöhe.** `loadAssets()` hat `b.h` mit der rohen
Blatthöhe **überschrieben** — damit bestimmte das Blatt die Hierarchie, und Depot (128×192) stand neben
Schmiede (viel größer) wie ein Spielzeug. Jetzt bleibt die im Register gesetzte Höhe stehen
(Depot 176 … Burg 240) und die Breite folgt dem Seitenverhältnis; `drawBuilding()` zeichnet aus
`b.h`/`b.w` statt aus dem Blatt.

**Kollision: Schaf und Baum sind Körper.** `footprints()` kannte nur Häuser, deshalb liefen Helden
mitten durch (und optisch unter) dem Schaf. Ergänzt: Schaf (rx 34/ry 15) und Baum (rx 26/ry 12).
Büsche und Steine bleiben begehbar — sie sind flach. `_foot` wird beim Neuaufbau der Ressourcen
verworfen, sonst blockt der Satz von gestern.

**Kein Feuer an einem intakten Haus.** Der Alarm hat Feuer und Rauch hinter den Wachturm gesetzt.
Ein intaktes Dach brennt nicht, und Partikel hinter der Fassade erklären nichts — der Alarm steht in
der Ampel und in der Approval-Karte. Block entfernt; die Brand-Frames des Packs gehören zu den
**beschädigten** Fassungen und kommen mit den Raids (v5). Schmiedenrauch bleibt: das ist ein Schornstein.

**Blase ohne schwarze Zacken.** Die Wartemarke war ein dunkler Block mit hartem weissen Rand, die
Spitze in derselben dunklen Farbe — zusammen las sich das als gezacktes Artefakt. Jetzt Creme-Füllung
mit warmem Rand (2 px), Ausrufezeichen in Alarmrot, Puls von 5 auf 2,2 rad/s beruhigt. **Und sie
überlagern sich nicht mehr:** wer neben einem anderen Wartenden steht, wird um 34 px angehoben.

**Vorrat sitzt im Boden.** Der Stapel vor dem Haus stand als 3er-Raster im Gras. Jetzt ein Erdfleck
darunter (Ellipse, α .22) und sechs Plätze mit Versatz — aus dem Index gerechnet, also jedes Bild
identisch, aber nichts mehr in Reihe.

**Abbaustufen sind sichtbar.** Gemessen und aufgenommen: **Gold Stone 1–6** (je 128×128) und
**Stump 1–4** (je 192×256). Modell: ein Abbau-Ort hat einen Vorrat (Gold 6, Holz 4, Fleisch 3), jeder
Träger nimmt eine Last (`mine()`), bei 0 läuft eine Regeneration von 26–40 s (`regrowNodes()`), und
`toNode()` meidet leere Orte, solange ein voller da ist. Gold zeigt eine **Ader statt eines Steins**:
Hauptstein in der Stufengröße, zwei kleinere versetzt daneben, mit sinkendem Vorrat verschwinden erst
die Beisteine, dann schrumpft der Hauptstein; darunter ein Erdfleck, der mitschrumpft. Ein abgeholzter
Holzplatz zeigt **einen Stumpf**, und der Baum an dieser Stelle verschwindet. Fleisch bleibt ohne Stufe:
Schafe grasen nach, ein „abgebautes" Schaf wäre eine andere Geschichte. `left` fährt im Export mit.

**Lessons learned**
- **Ein überschriebener Autorenwert ist ein stiller Verlust.** `b.h` stand mit Absicht im Register und
  wurde beim Laden von der Blatthöhe ersetzt — der Maßstab war nicht falsch gerechnet, er war
  **weggeworfen**. Wenn ein gemessener Wert einen gesetzten überschreibt: prüfen, welcher von beiden
  die Aussage ist.
- **Additiv allein ist nicht sichtbar.** Ein rein additiver Glow verschwindet auf hellem Sand. Die
  Lösung war die Mischung: farbiger Schein additiv, weisser Kern normal — nicht mehr Deckkraft.
- **Erst zu dominant, dann richtig.** Die Leylines waren als Band gebaut und mussten auf einen Faden
  zurück. Bei Overlays über einer fertigen Grafik ist die erste Fassung fast immer zu laut.
- **Kollision und Tiefensortierung sind zwei Dinge.** Das Schaf war korrekt sortiert und trotzdem
  „durchlaufen": es fehlte der Körper, nicht die Reihenfolge.
- **Partikel erklären nichts, was man nicht sieht.** Effekt hinter einer intakten Fassade = Rätsel.
  Wenn ein Zustand einen Effekt braucht, braucht er auch die Fassung dazu (beschädigt, brennend).

## 2026-08-14 · v4.4 — Fraktionen: Register, Lager, Revier, Kader
Entscheid des Users: eine Fraktion ist **Kader + eigene Bauten + Revier**, alle sieben gewählten
Fraktionen, **jede Ritterfarbe eine eigene Fraktion**, Lager **und** einzelne Einheiten setzbar,
Verhalten vorerst **Idle** (Raids bleiben v5). Stilbruch zu den Sidescroller-Packs ist gewollt.

**Erst gemessen, dann gebaut.** 40 Blätter gemessen, nichts geraten
und nichts kopiert. Ergebnis in `BAUKASTEN-TinySwords.md` (Tabelle). Kurzform: Enemy-Pack-Einheiten sind
**Strips quadratischer Frames** (192/256/320/384 — Troll 384×12, Minotaur 320×16, Turtle 320×10),
Update-010-Goblins sind **Raster** (Torch 7×5, TNT 7×3, Barrel 4×4 à 192), Bauten sind Einzelbilder
(Goblin_House 128×192, Castle 320×256, GoldMine 192×128) **ausser** den animierten: Goblin Hut 256×12,
Fish Hut 192×8, Cave 192×8.

**Register `FACTIONS`** (10): Nexus Blue/Red/Yellow/Purple (`kind:'knight'`, nutzt die **bereits
geladenen** Nexus-Blätter, Lager = House_<Farbe>) · Goblin Raiders (Hut, Spear, Torch, Pig Rider,
Shaman, Pig) · Pirate Fish (`water:true`, Fish Hut, Bomb Fish, Harpoon, Paddle, Seahorse, Boat) ·
Caveborn (Cave, Bear, Lizard, Snake, Spider, Turtle) · Goblins 010 (Goblin House, Torch, TNT, Barrel) ·
Einzelgänger (Dead Tree als Mal, Troll, Minotaur, Gnoll, Gnome, Panda, Skull, Thief) · Goldmine
(neutral, Bergmann und Träger sind Free-Pack-Pawns mit Pickaxe/Gold, beide 1536×192 = **8** Frames).
**Nexus Black fehlt bewusst:** Free-Pack-Schwarz liegt als Strip vor, nicht als Update-010-Raster —
andere Blattform, also eigener Handgriff. Backlog, nicht halb eingebaut.

**Blätter werden faul geladen.** `facLoad()`/`facEnsure()` holen Lager und Kader einer Fraktion erst,
wenn sie gewählt oder importiert wird — der Startladebalken bleibt bei den Nexus-Blättern.

**Werkzeuge:** **Lager** setzt den Bau der gewählten Fraktion **und vier Einheiten ins Revier**
(ein Lager kommt nicht allein), Klick auf ein Lager entfernt es. **Einheit** setzt die im Panel
gewählte Einheit, Klick auf eine bestehende entfernt sie. Panel: Fraktionsreihe mit Farbpunkt,
Kader der Fraktion, **Revier-Regler** (140–640 px, gilt für neue Lager), Zähler „N Lager · M Einheiten".

**Grundart ist Teil der Fraktion.** Pirate Fish gehört ins Wasser, alle anderen an Land. Dafür die
Gegenprobe zu `snapWalkable()`: `waterCell()`/`snapWater()`, und **ein** Einstieg `snapFac(p, fc)`,
den jeder Schreibweg nimmt — Werkzeug, Import und Slot.

**Neue Prüfung R5 `checkFacs()`:** Einheiten ausserhalb **jedes** Reviers ihrer Fraktion · Einheiten auf
falschem Grund · Revier, das in einen Nexus-Claim greift (Erstprobe meldete sofort
„[R5] Revier Goblin Raiders greift in Tavern" — genau der Zweck).

**Kader-Editor:** je Held eine Zeile im Panel, ein Klick dreht die **Einheit**, einer die **Fraktionsfarbe**
weiter. Kombinationen ohne Blatt werden übersprungen (Lancer/Rot fehlt im Free Pack). Die Wahl liegt in
`this.kader` und überlebt `spawnAgents()`, Undo und Import.

**Daten und Export:** `mapCamps` und `funits` sind Karten-Daten wie Höhen, Abbau-Orte und Requisiten —
in `edSnap()`, in `mapConfig()` als `camps` + `factionUnits` (Erweiterung wie `nodes`, in MapConfig v1
gibt es keine Fraktionen), in `applyConfig()` durch `snapFac()` gefiltert und gezählt. Der Kader fährt
in `npcs` mit.

**Bug #68 — der faule Lader ohne `crossOrigin` hätte den Renderer stillgelegt.** `facLoad()` war eine
zweite Ladefunktion neben `load()`, und der eine Beisatz `im.crossOrigin = 'anonymous'` fehlte. Folge
wäre nicht ein fehlendes Bild gewesen, sondern eine **vergiftete Leinwand**: `scanSheet()` liest
`getImageData()`, das ist auf einem Cross-Origin-Bild ohne CORS verboten — ein `SecurityError` **pro
Frame** in der Zeichenschleife, sobald die erste Fraktions-Einheit gemalt wird. Gefunden vor dem
Ausliefern durch Vergleich mit `load()`. **Fix:** derselbe Beisatz — plus ein zweiter Riegel
`facPad()`, der den Scan einfasst und im Fehlerfall einen Schätzwert liefert, damit **ein** Blatt nie
das ganze Dorf stilllegt.

**Lessons learned**
- **Eine zweite Ladefunktion ist eine zweite Chance auf denselben Fehler.** `load()` hatte
  `crossOrigin` aus gutem Grund; die Kopie hatte es nicht (#68). Wer neben einen bestehenden Pfad baut,
  liest den bestehenden Pfad **Zeile für Zeile**.
- **Messen ist billiger als raten — und „fast gemessen" ist geraten.** Die zwei Goldmine-Pawns standen
  zuerst mit 6 Frames im Register, übernommen aus dem Kommentar über die Pawn-**Run**-Blätter
  (1152×192). Nachgemessen: `Pawn_Idle Pickaxe` und `Pawn_Idle Gold` sind **1536×192 = 8 Frames** —
  der Bergmann hätte zwei Frames verschluckt. Idle- und Run-Blatt derselben Einheit haben **nicht**
  dieselbe Framezahl. 38 Blätter in einem Durchgang gemessen; dabei fielen die
  Nicht-Quadrate auf (Pirate Tower 1024×192, Wood_Tower 1024×192) — die wären als Strip falsch
  zerschnitten worden und stehen deshalb nicht im Register.
- **Die Gliederung des Packs ist die Gliederung der Fraktionen.** Goblin Raiders, Pirate Fish und
  Caveborn liegen im Enemy Pack bereits mit Hütte, Turm und Höhle zusammen — die Ordnerstruktur war
  der Entwurf, nicht meine Erfindung.
- **Prüfen, was der Editor jetzt kaputt machen kann.** Neue Setzbarkeit heisst neue Prüfung: R5 kam
  mit den Fraktionen, nicht danach.
- **Ein hidden Iframe zeichnet nicht.** `requestAnimationFrame` schläft in einer verborgenen Ansicht:
  leere Leinwand und 0 `drawImage`-Aufrufe sind dann **kein** Befund. Vor der Fehlersuche
  `document.visibilityState` prüfen.

## 2026-08-14 · v4.3 — Undo, Requisiten-Werkzeug, Karten-Slots, Tageszeit festsetzen
Runde nach Ansage: Undo (20 Schritte + Redo) · Deko-Werkzeug · Slots in localStorage **und** Datei ·
Uhr im Kopf als Wahl **Day | Night | Cycle**. Kader-Editor und Sprite-Fusion bleiben offen.

**Undo ist eine Kopie der Karten-Daten, kein Journal.** `edSnap()` nimmt Höhen, Gebäude-Positionen,
Wegpunkte, Kanten, Abbau-Orte, Requisiten und Spawn; `edRestore()` schreibt sie zurück und lässt
danach `edCommit()` laufen — Türen, Claims und Netz kommen also auch beim Zurücknehmen aus der Regel,
nicht aus dem Schnappschuss. **Ein Schritt ist eine Gestik**, nicht ein Pinselpunkt: `edBegin()` merkt
beim Mausdruck, `edEnd()` behält den Schnappschuss beim Loslassen nur, wenn sich das JSON wirklich
geändert hat. Ein Klick auf leeren Grund füllt den Stapel damit nicht. Tiefe 20, Redo spiegelbildlich,
`Ctrl/Cmd+Z` und `Ctrl/Cmd+Shift+Z` (nur im Editor), Zähler stehen auf den Knöpfen.

**Requisiten sind ab jetzt Daten** — `this.mapDeco`, dieselbe Beförderung wie `mapLvl` und `mapNodes`:
einmal vom Generator erzeugt, danach gemalt oder importiert. Vorher würfelte **jeder** Editor-Schritt
den Wald neu, weil `buildWorld()` die 1600 Baum-Versuche jedes Mal frisch verlost hat. Werkzeuge
Baum/Busch/Stein: Klick setzt (Baum unskaliert 192, Busch `d1..d4`, Stein `d9..d12` mit Zufallsgröße),
Klick auf ein vorhandenes entfernt es — dieselbe Handhabung wie beim Abbau-Ort. Neue Prüfung
**`checkDeco()` (R4)**: was im Wasser oder an der Klippe steht, wird gezählt und gemeldet. Seit die
Requisiten Daten sind, räumt sie kein Neuaufbau mehr stumm weg; wer Höhe unter einen Baum malt, bekommt
einen Befund statt eines verschwundenen Baums.

**Karten-Slots teilen die Serialisierung mit dem Download.** `exportMap()` ist in `mapConfig(name)`
(baut MapConfig v1) und den Download zerlegt, `importMap(text)` in `applyConfig(cfg)` (schreibt) und
die Meldung. Slot speichern/laden/löschen läuft über `mapConfig()`/`applyConfig()` — **ein** Schreibweg
für Datei und Speicher, also auch **ein** `snapWalkable()`-Filter (#63/#64 gelten weiter). Ablage:
`localStorage['nvMapSlots']` als `{ Name: MapConfig }`, Liste im Panel mit Laden und ×, Laden ist
undo-fähig. `decorations` wird jetzt auch **gelesen** (`kind`, `textureKey`, `frame`, `scale`), sonst
wäre der gesetzte Wald beim Import weg.

**Tageszeit festsetzen** (Ansage: Testbarkeit): Die Uhr ist aus `statLine` heraus und ein eigener Knopf
im Kopf, Klick öffnet **Day (12:00) · Night (22:00) · Cycle** (Vorgabe). Der Regler in den Settings
setzt `todMode:'fixed'`, damit die Wahl nicht falsch leuchtet. Vorbereitet, nicht gebaut: Aktivitäten
an Tageszeiten hängen, Wetter-Regler (Regen/Schnee/Nebel) daneben.

**Bug #66 — zwei Schreibwege ohne `edDirty`, also ohne Prüfung.** Abbau-Ort setzen und entfernen
schrieben `this.nodes`/`mapNodes` und meldeten Erfolg, ohne `edDirty` zu setzen — `edCommit()` kehrt
ohne diese Flagge sofort um. Ergebnis: kein Neuaufbau, keine Türen, **kein `checkGraph()`**. Genau die
Prüfung, die #63 eingebaut hat, lief beim häufigsten Handgriff nie. Nachgemessen: Gold auf die Stufe
gesetzt → jetzt „gold-Abbau gesetzt · 1 Befund(e): [R2] Abbau-Ort 3 liegt … auf der Stufe".

**Bug #65 — drei verirrte Zeilen aus `checkGraph()` standen in `drawEditOverlay()`.** Beim Bauen von
#63 kopiert: die Node- und Spawn-Prüfung mitsamt `say(...)`. `say` ist eine lokale Hilfsfunktion von
`checkGraph()` — im Overlay existiert sie nicht. Das Overlay zeichnet **jeden Frame**, die Zeilen
stehen aber in einer Bedingung, die nur bei einem echten Befund zutrifft: ein Abbau-Ort im Wasser oder
ein Spawn auf der Stufe hätte den Renderer mit `ReferenceError: say is not defined` **pro Frame**
abgeschossen — im Editor, genau in dem Moment, in dem man den Fehler sehen will. Entfernt (die Prüfung
steht korrekt in `checkGraph()`).

**Bug #67 — die Erfolgsmeldung wurde von „ok" gefressen.** `edCommit()` schreibt zum Schluss immer in
dieselbe Zeile, also stand nach „Baum gesetzt" sofort „ok — keine Befunde": kein Fehler, aber der
Handgriff war unbestätigt. Neu: `edDo(m)` merkt die Handlung in `this.edAct`, `edCommit()` stellt sie
**vor** das Ergebnis — „Baum gesetzt · ok" bzw. bei Befund gewinnt der Befund (Lehre aus #64, jetzt in
beide Richtungen).

**Lessons learned**
- **Alles, was der Editor anfassen kann, muss Daten sein.** Höhen (v4.2), Abbau-Orte (v4.2),
  Requisiten (jetzt) — sonst überschreibt der Generator beim nächsten Neuaufbau die Handarbeit. Der
  Prüfsatz dazu: *würfelt `buildWorld()` das noch mal aus?*
- **Ein neuer Schreibweg braucht auch die Flagge.** Prüfung an einer Stelle (`snapWalkable`) reicht
  nicht, wenn der Aufruf der Prüfung an `edDirty` hängt und der neue Weg sie nicht setzt (#66).
- **Zwischen Prüf- und Zeichenfunktion nichts kopieren.** Prüffunktionen haben lokale Melder (`say`),
  Zeichenfunktionen nicht — und ein Fehler im Zeichenpfad zeigt sich erst, wenn es etwas zu melden gibt (#65).
- **Undo pro Gestik, und nur bei echter Änderung** (JSON-Vergleich); sonst ist der Stapel nach zehn
  Klicks voll mit Nichts.
- **Eine Serialisierung für alle Ausgänge.** Download, Slot und später der Konverter teilen
  `mapConfig()`/`applyConfig()`; jede eigene Kopie ist ein neuer ungeprüfter Schreibweg.

## 2026-08-14 · v4.2 — Karten-Editor im Dorf (MapConfig v1)
Entscheidung des Users: **Import als Grundlage + eigener Editor nur für die Nexus-Ebene**, Terrain
gemalt, **Wege und Türen bleiben Regel**, Speicherung als Import + Download, Editor **im Dorf
umschaltbar**.

**Schema übernommen, nicht erfunden.** `FulAppiOS/Agent-Quest` → `client/src/editor/types/map.ts`
definiert `MapConfig` v1: `version · world · terrain` (Zellen-Map `"c,r" → {tile:{set,frame}, walkable}`)
`· decorations · paths` (`style: main|secondary|trail|plaza`) `· buildings · npcs · spawn · settings · meta`,
`TILE_SIZE 64`. Dessen Editor (Phaser/React) hat die Werkzeuge Select · Paint · Erase · Decoration ·
Path · Move-Building · NPC · Spawn — die Liste war die Vorlage für unsere.
Unsere Erweiterung: `nodes` (Abbau-Orte) als eigenes Feld, weil Ressourcen dort nicht vorkommen.

**Höhen sind ab jetzt Daten.** `this.mapLvl` (0/1/2 je Zelle) wird **einmal** vom Generator erzeugt und
danach gemalt oder importiert; `buildWorld()` leitet L1/L2 daraus ab, statt die Burg-Kuppe jedes Mal neu
zu berechnen. Damit ist der Renderer unverändert regelbasiert (Autotile, Klippenart, Foam, Schatten),
aber die **Form** kommt aus der Karte.

**Werkzeuge:** Stufe 0/1/2 (2×2-Pinsel, nur auf Land) · Gebäude greifen und auf Zellmitte ziehen
(mit Claim-Befund beim Loslassen) · Wegpunkt setzen, wählen, verbinden · Holz/Gold/Schaf-Abbauort
setzen und entfernen · Spawn setzen. Linke Maustaste malt, rechte/mittlere schwenkt weiter.
`E` schaltet um, `Escape` schließt.

**Nach jedem Schritt** läuft `edCommit()`: Türen neu (R1/R2), Claims neu (R3) — und die Befunde landen
**im Editor-Panel**, nicht nur in der Konsole. Terrain wird neu gebaut.

**Overlay** nur im Editor: Raster, Höhenmarken (Stufe 1 blau, Stufe 2 gelb), Wegenetz mit Punkten,
Claims als Rahmen, Türen als Punkte, Abbau-Orte als Ringe, Spawn als Kreis.

**Panel ist responsiv** (Ansage: muss im Split-View gehen): `width:min(300px, calc(100vw − 20px))`,
Werkzeuge in einer umbrechenden Reihe, Befundzeile mit Ellipse, Panel scrollt bei geringer Höhe.

**Export/Import:** Download als `nexus-castle-map.json` (MapConfig v1), Import per Dateiwahl —
Terrainhöhen, Gebäudepositionen, Abbau-Orte und Spawn werden übernommen, danach läuft `edCommit()`.

**Bug #64 — der Import war der vierte Schreibweg und umging beide Hälften der Absicherung.**
`importMap()` schrieb `mapNodes`/`nodes` und `PLAZA` direkt aus der Datei — ohne `snapWalkable()` — und
rief `edSay('importiert: N Zellen')` **nach** `edCommit()`, überschrieb also die Befundmeldung. Eine
Datei mit einem Goldvorkommen im Meer und einem Spawn im Wasser meldete „importiert: 1 Zellen", während
zwei Befunde bereits vorlagen; der Spawn im Wasser vergiftet Platz-Sand, `recenter` und **jede** Route.
**Fix am Importpfad:** zuerst `deriveLvl()` (sonst prüft `snapWalkable()` gegen die alte Höhe), dann
läuft **jeder** importierte Abbau-Ort und der Spawn durch `snapWalkable()`; was keinen begehbaren Platz
findet, wird **übersprungen und gezählt**. Und die Meldung stellt die Zählung **vor** den Befund statt
ihn zu ersetzen: `importiert: N Zellen · M übersprungen · 2 Befund(e): …` bzw. `· ok`.
Nachgemessen mit genau dieser Datei: `importiert: 1 Zellen · 2 übersprungen · ok`, alle Abbau-Orte
begehbar, Spawn bleibt auf (28,23) begehbar, 0 Befunde.

**Bug #63 — zwei der fünf Schreibwege liefen weiter ungeprüft.** #62 hat nur das Wegpunkt-Werkzeug
abgesichert: Abbau-Ort und Spawn schrieben direkt in `this.nodes` bzw. `this.PLAZA`, und `checkGraph()`
sah nur `WP`/`EDGES` an. Ein Goldvorkommen aufs offene Meer geklickt hieß „gold-Abbau gesetzt" und
danach „ok — keine Befunde", während Träger eine Etappe auf die See geschickt wurden; ein Spawn im
Wasser vergiftet zusätzlich Platz-Sand, `recenter` und **jede** Route, weil alle bei `PLAZA` beginnen.
**Fix: eine Stelle statt drei.** `snapWalkable(p)` rastet auf die nächste begehbare Zellmitte ein oder
gibt `null` — **alle** Schreibwege (Wegpunkt, Abbau-Ort, Spawn) laufen jetzt hierdurch, und
`checkGraph()` prüft zusätzlich jeden Abbau-Ort und den Spawn.
Nachgemessen: Klick aufs Wasser mit `ng` → kein Knoten, Meldung „hier nicht: Wasser oder Mauer";
Spawn-Klick aufs Wasser → `PLAZA` bleibt stehen; nach dem Commit sind alle Abbau-Orte und der Spawn
begehbar, 0 Befunde. (Gebäude-Verschieben war schon ehrlich: es meldete den Fall über `layoutDoors()`.)

**Bug #62 — das Wegpunkt-Werkzeug prüfte nichts, und das Netz wurde nie als Ganzes geprüft.** Die
Begehbarkeit war an drei Stellen abgesichert (Türen, Anfahrten, Basis-Netzpunkte) — aber ein per
Editor gesetzter Knoten landet bei Index ≥ `_netCount` und wurde von keiner davon angesehen: ein Klick
aufs Meer erzeugte einen Knoten in der See, ein Klick auf die Klippenwand einen auf dem Mauerwerk, und
das Panel meldete „ok — keine Befunde", während BFS von dort losroutete.
**Zwei Stellen, eine Regel:** `walkableCell(c,r)` (Land, keine Stufe, keine Klippe) ist jetzt die eine
Prüfung; das Werkzeug **rastet** auf die nächste begehbare Zelle ein (Radius 3) oder **verweigert**
mit Meldung, und `checkGraph()` prüft nach jedem Commit das **ganze** Netz — jeden Knoten und jede
Kante entlang abgetastet (32-px-Schritte) auf Wasser und Mauer — und schreibt Befunde ins Panel.
Nachgemessen: Ausgangsnetz 0 Befunde · Klick aufs Wasser wird abgelehnt („hier nicht: Wasser oder
Mauer", kein neuer Knoten) · Klick auf die Klippe rastet auf (32,10) ein · nach dem Commit sind **alle**
Wegpunkte begehbar, 0 Befunde.

**Bug #61 — die Ausweichsuche der Netzpunkte kannte kein Wasser.** Die Schleife in `buildWorld()`, die
Netzpunkte aus der Höhenstufe herausschiebt, prüfte nur `onStep()`, nie `land` — ein Plateau am
Küstenrand (Wachturm) schob `WP[8]` auf Zelle (21,37) **ins Meer**. Weil es ein **Basis**-Netzpunkt ist,
blieb der Fehler auch nach dem Löschen aller Höhen bestehen, und Routen zu Wachturm **und** Depot
liefen über diese Wasserzelle, während `warn` leer war.
**Fix an der Stelle, wo der Punkt bewegt wird:** akzeptiert wird nur eine **begehbare** Zelle (Land,
keine Stufe, keine Klippe); erst nach unten, dann nach oben suchen, sonst Befund
(`[R2] Netzpunkt N findet keine begehbare Zelle`). Und die Suche startet jedes Mal aus der
**Ausgangslage** (`_wpBase`) — vorher wanderte ein einmal verschobener Punkt bei jedem Commit weiter
und kam nie zurück.
Nachgemessen: **0** Wegpunkte im Wasser und **0** Wasserzellen in allen sieben Routen — im
Ausgangszustand, nach dem Küstenplateau unter dem Wachturm (dort 1 ehrlicher Befund) und nach dem
Löschen aller Höhen (0 Befunde, Netz wieder in Ausgangslage).

**Bug #60 — die Tür selbst wurde nie auf Begehbarkeit geprüft.** #59 hat den Anfahrtspunkt geprüft, die
Tür nicht: ein mit dem Pinsel gemaltes Plateau unter der **küstennahen Arena** schob die Tür vier Reihen
nach unten ins Meer, und das Panel meldete „ok — keine Befunde".
**Fix an derselben Stelle:** `walkable(c,r)` (Land, keine Stufe, keine Klippe) gilt jetzt für **Tür und
Anfahrt**. Die Tür wandert bis zu vier Reihen weiter nach unten; klappt das nicht, sucht sie eine
**Ausweichzelle** am Sockel (bis zwei Spalten seitlich) und der Fall wird gemeldet
(`[R1] arena: Eingang nicht von unten möglich — Ausweichzelle`); gibt es gar keine, bleibt die Tür am
Sockel und der Befund sagt „Gebäude verschieben". Nie eine Tür im Wasser, nie ein stilles „ok".
Der Anfahrtspunkt liegt jetzt **immer in der Türspalte** (der frühere Diagonal-Fallback ließ die Kante
Tür→Anfahrt eine Ecke über Wasser schneiden).
Nachgemessen, Küstenfall: Arena-Tür (36,35) auf Land, alle Anfahrten auf Land, **keine** Route mit
Wasserzelle, ein Befund im Panel.

**Bug #59 — zwei Anfahrtspunkte lagen im Meer (schon in der ausgelieferten Karte).** `layoutDoors()`
setzte den Anfahrtspunkt blind auf `Tür + 96`, ohne die Landmaske zu fragen: bei **Arena** (Zelle 36,36)
und **Wachturm** (18,36) war das Wasser. Jede Route dorthin ging eine Etappe aufs offene Meer und
zurück — die Sandmaske malt nur auf Land, also endete die sichtbare Straße am Ufer, während die Läufer
weiterliefen. Verstößt gegen Zellregel 4 (Wasser nur über eine Brücke) und Prüfliste §5.3.
**Fix an der Stelle, wo der Knoten entsteht:** von der Tür nach unten die erste **begehbare** Zelle
suchen (drei Reihen weit, `land` und nicht `stepped`), sonst seitlich versetzt; findet sich keine, ist
das ein **Befund** im Editor-Panel (`[R2] kein Anfahrtspunkt für …`) statt eines stillen Punkts im
Wasser. `this.warn` wird im Commit jetzt **vor** `layoutDoors()` geleert, sonst hätte `computeClaims()`
die R2-Befunde weggeworfen.
Nachgemessen: alle sieben Anfahrtspunkte auf Land, alle Türzellen auf Sand, **keine** Route mit einer
Wasserzelle, 0 Befunde.

**Bug #58 — die Sandstraße war einen Durchgang hinter den Türen.** `buildWorld()` rastert die Sandmaske
aus `WP`/`EDGES`, aber der höhenbewusste `layoutDoors()` lief **danach**. Die Maske zeigte also immer
die vorige, grobe Türlage: in Spalte 37 lag Sand auf den Hofreihen 17/18 und der Klippenreihe 19 — die
Straße führte das Plateau hinauf zur alten Tür — während die echte Türzelle (Reihe 20) Gras war.
**Fix an der Reihenfolge, nicht an der Maske:** die Höhenmaske hängt nur an `mapLvl`, nicht an den
Türen. Neue `deriveLvl()` leitet `lvl` und `stairCols` ab, **ohne zu zeichnen**. Ablauf jetzt überall
gleich: **Maske → Türen (R1/R2) → Claims (R3) → malen**. Beim Erstaufbau wird nach den
höhenbewussten Türen ein zweites Mal gemalt, im Editor-Commit läuft `deriveLvl()` vor `layoutDoors()`
und `buildWorld()` erst danach.
Nachgemessen: alle sieben Türzellen liegen auf **Sand** (vorher wie nachher), und es gibt **0** Sandzellen
auf einer Höhenstufe, die nicht Hof ist — vor und nach einem Editor-Schritt.

**Bug #57 — der Türwegpunkt wanderte nicht mit der Tür.** `layoutDoors()` stieg bei `_stubsDone`
früh aus: das Stub-Paar (Tür + Anfahrt) wurde **einmal** aus der noch groben Tür angelegt und dann
eingefroren, während `b.door` beim zweiten, höhenbewussten Durchgang und bei **jedem** Editor-Commit
neu berechnet wird. Folge: Burgtür 3 Reihen (192 px) neben ihrem Knoten — der lag oben im Hof, also
liefen Agenten die Treppe hoch und wieder herunter; die Taverne endete eine Reihe vor der Tür.
Das bricht R2 in den Daten, weil Sandmaske **und** BFS den Wegpunkten folgen, nicht der Tür.
**Fix:** der Wegpunkt **ist** die Tür — beim ersten Mal anlegen, danach mitführen
(`WP[b.wp] = door`, `WP[b.wpApp] = door + 96`), dann `buildAdj()`. Kein `_stubsDone`-Ausstieg mehr,
und die Netzgröße wird in `_netCount` gemerkt, damit die Suche nach dem nächsten Netzpunkt beim
Anlegen nicht die Stubs mitzählt.
Nachgemessen: alle sieben Gebäude `WP-Reihe === Tür-Reihe`, vor **und** nach dem Malen einer Stufe
unter der Taverne (Tür 19 → 20, Knoten folgt), WP-Zahl bleibt 24 (keine Duplikate).
Dazu drei tote `this.stairC`-Zuweisungen aus der `stairCols`-Umstellung entfernt.
**Kosmetik, nicht blockierend:** Netzpunkt 3 liegt exakt auf der Taverne-Tür, deshalb liefert
`nearestWp()` dort den Netz- statt den Türknoten — dieselbe Position, gleiches Ziel; Zusammenlegen
deckungsgleicher Knoten wäre Aufräumarbeit.

**Bug #56 — `lift` und eine globale Treppenspalte waren Konstanten für Daten, die jetzt gemalt werden.**
Mit dem Höhenpinsel ließ sich die Türregel für **jedes** Gebäude brechen: Stufe 1 unter die Taverne
gemalt (`lift: 0`) legte ihre Tür in die Klippenwand — Straße endet am Mauerwerk, niemand kommt an;
umgekehrt behielt die Burg beim Import einer Karte **ohne** Plateau ihr `lift: 192` und hatte eine Tür
drei Zellen frei in der Wiese, während Treppenkacheln weiter in Spalte 37 gezeichnet wurden.
**Fix an derselben Stelle wie die Höhen selbst:** `layoutDoors()` läuft von der Sockelreihe nach unten,
solange die **gemalte** Stufe anhält (Hof), rechnet dann eine Klippenreihe und setzt die Tür darunter —
`lift` ist gestrichen. Treppen sind jetzt eine **Menge von Spalten** (`stairCols`), gefüllt aus jeder
Spalte, in der ein Gebäude auf einer Stufe steht; `isStair()` ersetzt `c === stairC` in `stepped()`,
`blocked()` und im Zeichner. Reihenfolge im Commit gedreht: **erst Terrain, dann Türen** (die brauchen
`this.lvl`), dann Claims.
Nachgemessen: Burg Sockel 16 → Tür 20 (Hof 2 + Klippe 1), Stufe unter der Taverne gemalt → Tür 20,
weder `stepped` noch `cliffCell`, `stairCols` wächst auf `[37, 28]`; Burg-Plateau gelöscht → Tür 17,
also genau eine Reihe unter dem Sockel.

**Bug #55 — jeder Editor-Schritt löschte die Wirtschaft.** `edCommit()` rief `buildWorld()`, und
`buildWorld()` endete in `initResources()` — der Generator überschrieb also einen Frame später genau
das, was der Editor geschrieben hatte: gesetzte Abbau-Orte verschwanden, importierte `nodes` kamen nie
an, Vorräte und Zähler standen wieder auf 0, Träger wurden neu gespawnt.
**Zwei Trennungen statt einer Ausnahme:** (1) Abbau-Orte sind jetzt Karten-**Daten** (`mapNodes`,
genau wie `mapLvl`) — `initResources()` liest sie, wenn sie da sind, statt zu würfeln; Werkzeug und
Import schreiben hinein. (2) `seedEconomy()` (Vorräte, Zähler, Träger) ist aus `initResources()`
herausgezogen und läuft **nur beim ersten Aufbau** — ein Editor-Schritt baut Terrain neu, nicht die
Wirtschaft.
Nachgemessen: Knoten 7 → 8 → 8 über einen Höhen-Schritt hinweg (`gesetzterNochDa: true`),
`schmiede.stock` bleibt 4 und `res.wood` bleibt 9 nach einem Commit, Import mit zwei `nodes` landet
tatsächlich (`gold@672` vorhanden).

**Getestet an der Instanz:** Stufe malen 0 → 1 (`mapLvl` und `lvl` beide 1), Wegpunkte 24 → 26,
Kanten 27 → 28, Konsole leer.
**Offen:** Kader-Editor (Unit/Farbe je Agent), Deko-Werkzeug, Undo, Sprite-Fusion-JSON-Konverter,
Karten-Slots.

## 2026-08-14 · v4.0 — Nexus Castle: Höhenstufe, Klippe, Treppe (neue Datei)
`Nexus Castle v4.dc.html` ist eine Kopie von v3.15; v3 bleibt als Dorf liegen.
**Türen zuerst repariert (gilt auch in v3):** die Tür wurde vor dem Messen gesetzt (`y + 96`), lag
bei den hohen 1:1-Blättern also **unter dem Dach**. Jetzt läuft `layoutDoors()` **nach** dem Messen:
`door = snap(y + 0.45h + 64)` — eine Zellreihe unter der Sockel**unterkante** — und baut danach die
Stichwege (`buildAdj()` wird neu aufgebaut, weil die Kanten später entstehen).
**Elevation-Blatt gemessen:** `Tilemap_Elevation.png` 256×512 = 4×8 Kacheln. Spalte = links/mitte/
rechts/einzeln (dieselbe 4×4-Blob-Logik wie Flat), Zeilen 0–2 = Plateau-Oberseite (oben/mitte/unten),
Zeile 3 = Klippengesicht dazu, Zeilen 4/5 = einreihiges Plateau + seine Klippe, Zeile 7 = Treppen
(3 breit + 1 einzeln). `Shadows.png` 192×192 = 3×3, `Bridge_All.png` 192×256 = 3×4.
**Plateau unter der Burg:** Zellen aus Claim-Breite + Blatthöhe, nur auf Land. Reihenfolge nach
Guide: Flat → Sand → **Shadow** (Stempel zwei Reihen unter der Unterkante) → **Elevated** → Klippe.
Die **Treppe** sitzt in der Türspalte an der Kante, nie frei im Gras — und weil die Tür jetzt eine
Reihe unter dem Sockel liegt, endet die Sandstraße genau am Treppenfuß.
**Höhenstufe ist eine Grenze:** `blocked()` ersetzt `blockedBy()` in der Bewegung — Sockel (R4) plus
Höhenwechsel nur über die Treppenspalte; sonst Abprall. Träger nutzen dieselbe Prüfung.
**Prüfbefund direkt nachgezogen (v4.1):**
- **Bug #41 — falsches Blatt für Elevated.** `Tilemap_Elevation.png` (lietz-nexus) ist ein
  **Steinplateau**: alle sechs Kachelreihen sind Mauerwerk, es gibt darin keine Grasreihe. Das
  Plateau sah deshalb aus wie ein Steinfleck auf der Wiese. Das echte Terrain-Tileset liegt im
  Free Pack: `Terrain/Tileset/Tilemap_color1.png`, **gemessen 576×384 = 9×6** — Spalten 0–3 Flat-Gras,
  **Spalten 5–8 Zeilen 0–3 Elevated-Gras** (dieselbe 4×4-Blob-Logik), **Spalten 5–8 Zeilen 4–5 Klippe**
  (zwei Kacheln hoch) = die 16 + 8 Kacheln aus §1 der Konstruktionsregeln. Aus dem Steinblatt bleibt
  nur die **Treppe** (Zeile 7) — sie hat genau den Blaugrau-Ton der Klippe.
- **Bug #42 — Shadow war unsichtbar.** `Shadow.png` (Free Pack, gemessen 192×192) ist **ein Stempel**
  wie Foam, kein Autotile — vorher wurden 64-px-Ausschnitte mit fest verdrahteter Blattzeile gesetzt.
  Jetzt ein 192-Stempel je Plateau-Zelle plus einer **unter** der Klippe, wo er auf dem Gras liegt und
  sichtbar wird.
- **Bug #43 — Phantom-Ernte.** Eine blockierte Etappe setzte `c.pi = c.path.length`, und der nächste
  Frame las genau das als „angekommen": Träger, die an der Klippe abprallten, ernteten aus dem Nichts
  und buchten Vorräte ein (Holz stand bei 23, Gold bei 0). Blockiert heißt jetzt **neu zielen**, nicht
  ankommen. Dazu schließen `freeAt()` und `freeSpot()` Plateau **und** Klippenfuß aus, damit
  Abbau-Orte, Schafe und Deko nie auf der Höhenstufe landen.
- **Tür bei Häusern auf Höhe:** neues Feld `lift` (Burg: 128 = Klippenhöhe). Die Tür liegt damit
  unter dem **Treppenfuß**, nicht in der Klippenwand, und die Sandstraße endet wieder genau dort.

- **Bug #45 — gemalter Gebäudeschatten raus (Ansage des Users: lieber keinen als einen falschen).**
  Unter jedem Haus lag eine weiche `ctx.ellipse`-Fläche. Im Top-down-Pixelset ist das immer falsch —
  dieselbe Sache wie die Unit-Schatten (v3.10) und der Brunnen: was auf dem Boden liegt, muss ein
  Sprite sein. Ersatzlos gestrichen, in v4 **und** v3. Echte Schatten gibt es nur, wo das Pack ein
  Blatt dafür hat (Shadow-Stempel unter Elevated).
- **Bug #44 — Straßen liefen in die Klippenwand.** Die Sandmaske wurde **vor** der Höhenstufe
  gerechnet, also malte sie Wege bis an die Wand, wo niemand hochkommt. Zwei Ursachen, beide behoben:
  die Elevation-Maske entsteht jetzt **vor** der Sandmaske (`onStep(c,r)` sperrt Plateau + beide
  Klippenreihen, nur die Treppenspalte bleibt frei), und Netz-Wegpunkte, die in der Höhenstufe liegen
  (WP 7 lag mitten in der Klippe), werden nach unten herausgeschoben — sonst schickt BFS Läufer
  weiter gegen die Wand. Ergebnis: die Autotile-Kante endet eine Reihe unter der Klippe, nur an der
  Treppe führt eine Straße hinauf.
- **Schattenband:** der Stempel unter der Klippe wird nur gesetzt, wo links **und** rechts Plateau
  ist. Damit folgt das Band der Silhouette statt in einer geraden Kante abzubrechen.

**Hof (R6) gebaut:** das Plateau reicht jetzt `HOF = 2` Reihen über den Sockel hinaus, und diese
Reihen sind **Sand** — derselbe Sand-Block wie die Wege, nur auf der Oberseite gezeichnet. Damit
erklärt sich, warum vor dem Tor gelaufen wird, und die Treppe verbindet Hof und Netz sichtbar.
`lift` der Burg entsprechend auf 256 (2 Hof- + 2 Klippenreihen), damit die Tür weiter unter dem
Treppenfuß liegt. Der Hof ist an den Seiten eine Zelle eingerückt, damit die Klippenkante Kante bleibt.

**Guide gelesen (PDF), drei Korrekturen + Klotz raus:**
- **Bug #46 — Shadow-Versatz war geraten.** Der Guide sagt: Stempel je begehbarer Elevated-Zelle,
  **genau eine Kachel (64 px) nach unten**. Vorher standen dort handgewählte 14/18-px-Offsets, deshalb
  lag ein dunkler Rahmen rechts und unten um das Plateau, und der Streifen am Treppenfuß sah wie
  Dreck auf der Straße aus. Jetzt exakt +64 px, Treppenspalte bleibt frei.
- **Bug #53 — die obere Terrasse hatte keine Kollision.** Ursache war die Datenform: `this.elev` war
  die **Vereinigung** beider Stufen, also waren bei einem Schritt von Stufe 1 auf Stufe 2 beide Zellen
  „elevated" und `blocked()` gab schon im ersten Kurzschluss frei. Statt eine weitere Ausnahme
  einzubauen: **Höhenindex** `lvl[r][c]` (0 Flachland, 1 Plateau, 2 Terrasse) plus `level()` und
  `cliffCell()` (= darüber liegt eine höhere Stufe). `blocked()` prüft jetzt nur noch drei Dinge:
  Treppenspalte frei, Klippenwand gesperrt, **jeder** Stufenwechsel gesperrt. Damit gilt die Regel für
  Stufe 2 automatisch mit — und für jede weitere, die dazukommt.
  Nachgemessen: L2 seitlich BLOCK, L2-Klippe BLOCK, Treppe 13→12→11 frei, L1-Klippe BLOCK, Hof frei.
- **Bug #54 — drei Bäume standen auf dem Plateau.** Die Baum-Schleife prüfte Land, Sand, Uferabstand,
  Claims und Abstand — aber nie die Höhenmaske (nur die spätere Busch/Fels-Schleife lief über
  `freeAt()`). Test ergänzt; `deko_auf_stufe` ist jetzt 0.
- **Bug #52 — Vorrat der Burg klebte an der Klippenwand.** `drawStock()` hing am Türanker
  (`door.y − 44`); bei Häusern mit `lift` liegt die Tür aber absichtlich eine ganze Höhenstufe tiefer,
  also landete der Goldhaufen auf dem Mauerwerk statt vor dem Tor. Anker ist jetzt die **Sockellinie**
  (`b.y + 0.45h + 20`) — für Häuser mit und ohne `lift` gleich richtig. Nachgemessen: Vorratsreihe je
  Gebäude 16/19/22/26/28/33/33, keine davon eine Klippenreihe; die Burg legt ihr Gold jetzt im Hof ab.
- **Bug #51 — Sockel-Ellipse nahm die Höhe als Ersatz für die Breite.** `footprints()` rechnete beide
  Radien aus `b.h` — das ging nur, solange alle Gebäudeblätter ~200 px hoch normiert waren. Mit 1:1
  gemessenen Blättern passte die Ellipse zu keinem Sprite mehr: Bibliothek (210×420) sperrte 30 px
  **neben** dem Haus leere Wiese (unsichtbare Wand), Burg (400×270) und Schmiede (307×460) waren im
  unteren Drittel **durchlaufbar**. Jetzt aus der gemessenen Breite und der Sockellinie:
  `{ x: b.x, y: b.y + 0.45h − 26, rx: 0.34w, ry: 0.12w }`. Nachgemessen an der Instanz: neben dem Haus
  frei, Torfront und Sockelmitte gesperrt, über dem Dach frei — für alle drei Fälle. v4 und v3.
  **Lehre (dieselbe wie #50):** ein Maß aus einem anderen ableiten hält nur, solange die Blätter
  normiert sind. Nach 1:1 gilt: Breite aus der Breite, Höhe aus der Höhe.
- **Bug #50 — Fusslinie und Kopfhöhe hingen an der Blattgröße.** `FOOT = 23` / `HEAD = 130` waren an
  192er-Blätter angepasst, aber **jeder** TS-Frame hat anderen transparenten Rand. Gemessen (Alpha-Scan
  von Frame 0, 1:1): Warrior footPad 56 / bodyH 90 · Archer 58 / 74 · Pawn 64 / 58 · **Lancer 122 / 149**
  · Monk 58 / 68 · Träger-Pawn (Free Pack) 57 / 74. Weil die Blattunterkanten gleich ausgerichtet
  wurden, schwebte der Lancer ~65 px über der Bodenlinie, sein Namensschild lag auf der Brust und die
  Sprechblase unter den Füßen — während er bei `a.y` sortierte und kollidierte.
  **Fix an der Quelle:** `scanSheet()` misst die Inhaltsbox jedes Blattes einmal nach dem Laden,
  `measureUnits()` schreibt `footPad`/`bodyH` in die Unit-Spec. Gezeichnet wird mit Füßen auf `a.y`,
  alle Overlays hängen an `headY = a.y − bodyH`. Gilt auch für die Träger. In v4 **und** v3.
  **Lehre:** nicht nur die Blattgröße messen, sondern den **Inhalt** — der Rand ist je Blatt anders.
- **Bug #49 — doppelt gestapelte Klippe (Befund des Users).** Zeile 4 und 5 des Tilesets sind nicht
  Ober- und Unterteil **einer** Klippe, sondern die **zwei Klippenarten** aus dem Guide: 4 zur Wiese
  darunter, 5 zum Wasser. Eine Klippe ist **eine Kachel hoch**. Vorher lagen beide untereinander —
  zwei Mauerreihen mit je eigener Rundung, sichtbar als Doppelwand. Jetzt eine Reihe, Art nach
  Untergrund gewählt; Treppe entsprechend **eine** Kachel; `stepped()`, `freeAt()`, `freeSpot()`
  prüfen eine Klippenreihe statt zwei; `lift` der Burg 256 → **192** (2 Hofreihen + 1 Klippenreihe),
  damit die Tür wieder genau unter dem Treppenfuß liegt; Schattenband eine Reihe höher.
- **Bug #48 — halber Schatten.** Die Ausnahme „nur die Treppenspalte bleibt frei" machte aus dem
  Fehler eine Inkonsistenz: links vom Treppenfuß lag ein dunkles Rechteck auf der Straße, in der
  Treppenspalte nicht. Jetzt **eine** Regel für alle Unterkanten — der Wurfschatten liegt auf Gras,
  nie auf Sand (geprüft wird die ganze 3×3-Fläche des 192-Stempels). Gemessen: Straße links und
  Straße an der Treppe beide 248,242,115, Gras unter der Klippe 90,124,83.
- **Bug #47 — Klippenwand war begehbar.** `blocked()` prüfte nur die Plateau-Maske, nicht die zwei
  Reihen, in die die Klippe **gezeichnet** wird. Beide benutzen jetzt dieselbe Prüfung `stepped()`
  wie die Sandmaske; oben auf Plateau/Hof bleibt frei, seitlich hinauf ist gesperrt, hinauf geht es
  nur in der Treppenspalte.
- **Farbwahl nach Guide statt Bauchgefühl.** „Use different terrain colors … to make the different
  elevation layers more noticable." Gemessen: color1 184,185,88 · color2 147,186,79 · color3 116,179,99
  · color4 150,159,100 · color5 99,164,134. Flat Ground im Projekt ist 121,168,99 — also **≈ color3**,
  das vorher für Stufe 2 verbaut war (unsichtbar). Jetzt Stufe 1 = color2, Stufe 2 = color1.
- **Zweite Stufe + Silhouette (Ansage: „keine Klotzbau-Einstellung").** Der Zeichner läuft jetzt pro
  Stufe (Guide: Shadow/Elevated wiederholen sich), es gibt eine obere Terrasse hinter der Burg, und
  die Form kommt aus einem **Breitenprofil** je Reihe: oben eingezogen, unten eine durchgehende Kante.
  Zwischenschritt mit Ellipse plus Arm und Kerbe ist verworfen — jede Spalte hatte ihre eigene
  Unterkante, die Klippe zerfiel in Mauerstücke und die Burg sah aus wie ein Labyrinth.
- **Offen aus dem Guide:** die **zweite** Klippenart (die zum Wasser) ist noch nicht verbaut.

**Offen für v4.1:** Höfe als Sand-Plateaus auf der Oberseite, Brücken über Wasser, Flood-Fill gegen
Sackgassen, weitere Fraktionsbauten auf Elevation, Graveyard/Krypta (Backlog).

## 2026-08-14 · v3.15 — Ressourcen als Nexus-Metaphern, alle Blätter 1:1
**Mapping (Entscheidung des Users):** Holz = **rohe Artefakte** (ungeprüft), Gold = **Token-Budget**
(wird verbraucht), Fleisch/Schafe = **geerntete Datenquellen** (RSS, Slack, Repos).
**Abbau-Orte:** drei Schlagplätze an weit auseinander liegenden Bäumen, zwei Goldadern
(`Gold Stone 3/5`, gemessen 128×128) als Stempel auf freiem Gras, eine Schafweide aus sechs Schafen
(`Sheep_Idle`, 768×128 = 6 Frames); zwei Schafe sind Ernteplätze. Alles über `freeSpot()`:
Gras, kein Sand, nicht am Ufer, ausserhalb aller Claims (R3).
**Träger:** vier Pawn-Träger (blau, Ambience — **keine** Chronik-Einträge, Baukasten §3). Kreislauf
Abbauort → Haus → Abbauort mit Pause und Staubwolke; Blätter `Pawn_Run`, `Pawn_Run Wood|Gold|Meat`
(je 1152×192 = 6 Frames). Am Sockel wird die Etappe abgebrochen und neu gezielt (R4).
**Vorräte vor jedem Haus:** `b.needs` je Gebäude (Library/Watchtower = Fleisch, Castle/Arena = Gold,
Forge/Tavern/Depot = Holz), max. 5 Sprites in der Türzone. Die Burg **verbraucht** Gold im Takt
(6–11 s) — Token-Budget läuft aus, der Stapel schrumpft sichtbar.
**7. Gebäude:** `Blue Buildings/House3` (gemessen 128×192) als **Depot** — offener Stand für rohe
Artefakte, eigene Quelle über `b.src` statt `BuildingsCustom`.
**Kader:** Lancer und Monk dazu. Zweites Blatt-Modell nötig, weil das Free Pack Run und Idle
**getrennt** ablegt: `{ strip:true, F, runN, idleN }` neben dem Grid-Modell von Update 010.
Gemessen: Lancer_Run 1920×320 (6), Lancer_Idle 3840×320 (12), Monk Run 768×192 (4), Idle 1152×192 (6).
**Rotes Lancer-Blatt fehlt im Pack** — deshalb Lancer nur blau/gelb/purpur, und der Loader
überspringt die Kombination.
**Ressourcen-Leiste im Kopf:** Icon_02/03/04 mit Zahlen, blendet 3.8 s nach einer Änderung ein und
verschwindet wieder — der Kopf bleibt ruhig.

**1:1 (Ansage des Users): jedes TS-Blatt in Originalgröße und Original-Relation.**
`SCALE = 1` ist der eine Knopf; `blit()` ohne Höhe nimmt die Blatthöhe, FX laufen in Blattgröße,
Bäume verlieren ihren Zufallsfaktor, Deko wird in Bilddicke gezeichnet, Helden in Frame-Größe
(192, Lancer 320), Gebäude in **gemessener** Blatthöhe/-breite (Library 210×420, Castle 400×270,
Forge 307×460, Arena 320×429, Tower 195×390, Tavern 233×350).
**Folge 1 — Claims neu:** `computeClaims()` rechnet jetzt mit echter Breite und der Zeichenlage
(`y − 0.55h` … `y + 0.45h + 96`) statt mit `h·0.42/0.95`; sie läuft ein zweites Mal, nachdem die
Blätter gemessen sind.
**Folge 2 — Grundriss gestreckt:** mit 1:1-Blättern schnitten sich vier Claims
(bibliothek×wachturm, burg×schmiede, schmiede×arena, wachturm×depot). Statt Häuser zu schrumpfen
wird der **Grundriss** gestreckt: `LAYOUT_K = 1.6` auf alle Autoren-Koordinaten (WP, Gebäude, Platz),
Insel entsprechend 48×34 Kacheln (3072×2176). Konsole ist danach leer. Dichten mitgezogen
(Bäume 1600 Versuche, Deko 420, Gras 1000, Blumen 200), Platz-Radius × K.
**Folge 3 — Zoomleiter:** Default ist `zoom = 1` (Pixel 1:1). Stufen `[.5, .75, 1, 1.5, 2, 3]`,
Rad rastet ein (150 ms Sperre) statt frei zu skalieren — freies Zoomen hätte das Pixelraster
zerrieben, genau wie Upscale.
**Lehre:** „1:1" ist keine Zeichenregel, sondern eine **Layout**-Regel. Sobald die Blätter ihre
echte Größe haben, ist der Grundriss zu klein — und die Claims sagen es, bevor man es sieht.
**Bug #40 (Befund der Prüfung):** die Kopf-Overlays hingen weiter an `disp` — mit 1:1 wuchs das
mit der Frame-Größe, also schwebte die Sprechblase des Lancers (320er Blatt) ~100 px über dem Helm,
und der Lancer stand 15 px höher als alle anderen. Ursache: TS-Frames sind grösstenteils Rand, die
Figur darin ist immer gleich hoch. Jetzt zwei feste Maße statt Frame-Anteilen: `FOOT = 23`
(Blattunterkante über dem Fusspunkt, gleich für 192 und 320) und `HEAD = 130` für Namen, Blasen,
Wartemarke und Zeiger. **Lehre:** Overlays und Bodenlinie gehören an Weltmaße, nie an die Blattgröße.

**Backlog (Idee des Users):** Graveyard mit Skeleton + Krypta/Gruft für Post-mortems.
Skelette liegen im Enemy Pack; ein Gruft-Blatt ist noch nicht gefunden.

## 2026-08-14 · v3.14 — R1–R3 durchgesetzt, Kopf-Icons aus dem Free Pack
**R1 Eingang von unten:** die handgesetzten `door`-Felder in `BUILDINGS` sind weg. Die Tür wird
berechnet — `door = { x: snap(b.x), y: snap(b.y + 96) }`, genau eine je Gebäude, eine Zellreihe
unter dem Sockel.
**R2 Stichweg:** die sechs handgelegten Tür-Wegpunkte (WP 10–15) und ihre Kanten sind aus dem Netz
raus. Stattdessen entstehen je Gebäude **zwei** Punkte: Türpunkt und ein Anfahrtspunkt 96 px
darunter, verbunden mit dem nächstgelegenen Netzpunkt (`_stubsDone`-Merker gegen Doppel-Einfügen).
Die letzte Etappe läuft damit zwangsläufig **von unten** in die Tür, und die Sandmaske malt die
Stichstraße selbst, weil sie den Segmenten folgt.
**R3 Claims:** jedes Gebäude hat eine Anspruchsfläche (`x ± h·0.42`, `y − h·0.95 … y + 128`).
Schnitte gehen als `console.warn('[R3] Claim-Schnitt: …')` in die Konsole — keine stille Korrektur.
Erster Befund: **schmiede × arena** (18 px Überlappung) → Arena von `x 1330` auf `1296` gerückt,
Konsole ist jetzt leer. Deko, Blumen und Bäume prüfen gegen die Claims statt gegen `±110/±120`
bzw. einen 220-px-Radius.
**Kopf-Icons:** die drei Linien-SVGs sind ersetzt (Befund aus der Prüfung: 2-px-Vektorlinien in einer
Pixel-Oberfläche, Zahnrad ohne Zähne). Free Pack, `UI Elements/UI Elements/Icons`, **gemessen
64×64** für alle zwölf Blätter, eingesetzt auf 32 px = exakt halbe Kantenlänge (integerer Downscale,
kein Upscale): Log = `Icon_11` (Info-Ring), Settings = `Icon_10` (Zahnrad mit Zähnen),
Hide UI = `Icon_09` (rotes X), Show UI = `Icon_07` (grüner Pfeil). Nur `Centre` bleibt gezeichnet
— das Pack hat kein Fokus-Motiv — jetzt aber in der Ink-Sprache: dunkle Outline 6.4 px unter der
Cream-Linie 3.2 px, keine Hairlines mehr.
**Bug #39:** `spawnFx('dust', …)` beim Cartoon-Abprall — den Schlüssel `dust` gibt es im ATLAS
nicht (das Blatt heißt `smoke`, Datei `Dust_02.png`). Jeder Abprall warf eine `TypeError` in der
Render-Schleife; durch R1/R2 prallen mehr Helden ab, deshalb fiel es jetzt auf. → `smoke`.
**Lehre:** FX-Schlüssel gegen den ATLAS prüfen, nicht gegen den Dateinamen — `Dust_02.png` liegt
unter `smoke`. Und: ein Befund, der in die Konsole schreibt, findet Layoutfehler, die im Bild
unsichtbar sind (die 18 px Überlappung hätte man nie gesehen).

## 2026-08-14 · v3.13 — Kollision, Cartoon-Abprall, Wartemarke
**Kollision:** Gebäude haben jetzt einen Fussabdruck (Ellipse am **Sockel**, `rx = h·0.32`,
`ry = h·0.13`). Ein Schritt, der hineinführt, wird nicht ausgeführt — stattdessen **Cartoon-Abprall**:
Rückstoss entlang der Sockel-Normalen, Hopser (`sin`-Bogen, 16 px) mit Quetschung (0.82/1.18),
Staubwolke, `back`-Sound; danach wird die Route zum alten Ziel **neu berechnet**.
**Warum die Ellipse klein ist:** ein grosser Block hätte die Fläche **hinter** dem Haus mitgesperrt —
dann läuft nie jemand dahinter und die Tiefensortierung ist unsichtbar. Nur der Sockel ist massiv,
darüber darf gelaufen werden und der Held wird korrekt verdeckt (Sortierung nach Fuss-Y).
**Wartemarke:** der rote Bodenkreis ist weg (Bug #38 — flacher 2D-Ring, stilfremd, wie die alten
Unit-Schatten). Ersatz ist eine **Blase über dem Kopf** in der Ink-Sprache des HUD: dunkle Platte,
Cream-Outline, pulsierendes „!".
**Lehre:** Alles, was auf dem Boden liegt, muss aus dem Pack kommen oder als Sprite gestempelt sein.
Selbstgemalte Ringe/Ellipsen sind in einem Top-down-Pixelset immer falsch — das war schon der
Befund bei den Unit-Schatten und beim Brunnen.

## 2026-08-14 · v3.12 — Check-in v3: ruhiger Header, Ampel statt Modal, Icons
**Header:** Ribbon-Grafik raus. Grund: das 192×64-Blatt trägt zwei Zeilen nur, wenn man es
hochskaliert — und Upscale zerstört das Pixelraster (Bug #35, sichtbar klobig). Stattdessen eine
ruhige dunkle Platte: „Nexus Castle" (Shantell 700) über „Your Living Knowledge World", daneben die
Statuszeile, die schrumpfen darf (`flex:0 1 auto`, Ellipse) — der Kopf bleibt einzeilig und
responsiv. **UI-Flächen aus echten TS-Tiles kommen in v4 über das Canvas-UI-Kit**, nicht über
CSS-Upscale.
**Typo:** Irish Grover raus (überall). Shantell für alles, `pottymouth_bb` ab v4 nur in Blasen.
**Approval:** kein aufdringliches Modal mehr. Rechts unter dem Auge sitzt eine **dezente Ampel**
(grün = ruhig, gelb = freie Hand, rot = Freigabe offen); die Karte dockt darunter an und öffnet
**nur auf Klick** — auch bei neuem Alarm (vorher sprang sie auf).
**Icons:** Zahnrad war ein Blüten-Glyph aus `UI/Icons/Regular_02` (Bug #36) → eigenes Zahnrad in
derselben Ink-Linie; `Centre` ist ein Fokus-Icon, die Zoom-Zahl ist weg.
**Bug #37:** Beim Verschieben der Ampel blieb eine zweite Kopie im Konsolen-Kopf stehen (falscher
Slice-Anker) — entfernt. **Lehre:** Blöcke nie über `indexOf` auf einen Style-String ankern, der
mehrfach vorkommt.

## 2026-08-14 · v3.11 — Wasserrand, Gebäude zurück, Irish Grover
**Bug #33 (schwer):** Beim Entfernen des Welt-Banners war in `drawBuilding` die `drawImage`-Zeile
mitgelöscht worden — alle sechs Gebäude fehlten, während Schatten, Hover und Klickflächen weiter
funktionierten (deshalb fiel es in der Logik nicht auf). **Lehre:** Wenn ein Block "einen Teil" einer
Zeichenmethode entfernt, danach immer das Bild ansehen, nicht nur die Konsole.
**Bug #34:** Die Insel stieß oben an den Weltrand. Ursache: Ellipse mit nur ~1 Kachel Rand
(`irx = C/2 − 1.2`). Jetzt: Welt um **4 Kacheln je Seite** größer (COLS 38, ROWS 29), Inhalt um
256 px verschoben, Ellipse mit 4,5 Kacheln Inset → mindestens 4 Wasserkacheln in alle Richtungen.
Kamera wird nach der Verschiebung neu gesetzt.
**Typo:** Überschriften jetzt **Irish Grover** — im Ribbon exakt in die innere Platte gesetzt
(gemessen: x 45..240, y 18..63 bei 288×96), Fließtext bleibt Shantell Sans.

## 2026-08-14 · v3.9 — Ribbon-Header, Approval als Ampel, Laufwege raus
**Änderung:** Header ist jetzt das TS-Ribbon (`Ribbon_Red_3Slides.png`) — **als ein Bild 1:1**,
192×64, feste Breite, Text zentriert im sichtbaren Band. Die Uhrzeit steht daneben in einer eigenen
Fläche, damit das Band nie mitwächst. **Approval** ist eine dezente Ampel oben rechts (rot = offen,
gelb = freie Hand, grün = ruhig); die Karte öffnet auf Klick und bei einem neuen Alarm einmal von
selbst. Das Weltbanner am Wachturm ist weg — **keine Doppelung** mehr. **Gezeichnete Laufwege
entfernt**: sie tauchten mitten im Bild auf, sprangen bei jeder Neuberechnung und dominierten alles;
geblieben ist ein leiser Punkt am Ziel. Routen werden geglättet (kein Wegpunkt hinter dem Helden,
kollineare Punkte fallen weg). Freistehende Knöpfe sind deckend, sonst waren sie über dem hellen
Dorf unlesbar.
**Bugs:** #33 Alarm doppelt (Welt + HUD) · #34 Laufwege sprangen und erschlugen das Bild ·
#35 Route lief erst rückwärts zum nächsten Wegpunkt · #36 Knöpfe zu transparent ·
#37 Header sprang mit der Uhrzeit · #38 Klammer-Fehler beim Entfernen des Weg-Blocks → Logikklasse
fiel komplett aus (Template rannte nur mit Props weiter).
**Lessons:** **Slice erst messen, dann schneiden.** Ich habe zweimal 64er-Zellen geraten und mit
`border-image` halbiert (blasse Kappen). Messung: 192×64, drei Zellen à 64 — und weil das Band in
Originalgröße genau passt, ist die richtige Lösung **kein** Slicing, sondern das ganze Blatt 1:1.
Zweite Lehre: beim Herausschneiden eines Code-Blocks die **Klammerbilanz** prüfen — der Ausfall der
Logikklasse sieht im Bild fast normal aus (Welt steht, HUD leer).

## 2026-08-14 · v3.8 — TS-Slice-HUD verworfen, eigenes minimales UI
**Änderung:** `asset-source.js`/`ui-kit-ts.js` aus dem Dokument entfernt, samt `KEYMAP`,
`initKit`, `paintSlices`, `repaintSlices` und `componentDidUpdate` — damit ist auch das **Blinken
des Headers** weg (jeder Zustandswechsel tauschte die Hintergrund-DataURLs aus). Neues HUD in
eigener Sprache: dunkle Glasflächen, drei Fenster (Alarm · Konsole mit Reitern Log/Settings ·
Detail), Banner oben links, Steuerung unten rechts, **Tab** blendet alles außer Banner und
Steuerung aus, **Escape** schließt Fenster. Party-Leiste entfernt (Auswahl im Dorf).
Außerdem: **Brunnen** vom Dorfplatz entfernt (kein TS-Motiv, gemalter Kreis ohne Top-down-Logik).
**Laufwege** jetzt sichtbar — dunkle Fassung, heller Kern, Aktivitätsfarbe obenauf.
**Kader** (`ROSTER`): jede Kombination Einheit+Farbe genau einmal, keine Doppelgänger mehr.
Jukebox um *Doorways 01 Nexus rug* und *Doorways 01 Nexus van* erweitert.
**Bugs:** #29 Header blinkte (Kit-Repaint) · #30 Laufwege auf Sand unsichtbar · #31 gleiche
Einheit/Farbe mehrfach · #32 gemalter Brunnen ohne Pack-Logik.
**Lessons:** siehe `POSTMORTEM-UI-v3.md` — Kern: erst die **Bau-Logik** eines Slice-Blatts
verstehen (Zellgröße → Mindestgröße → 3-Slice oder 9-Slice), dann zeichnen. Ich hatte nur die
Ecken des großen Button-Blatts genommen.
**Backlog:** Lancer und Monk liegen im **Free Pack** (Blätter müssen erst gemessen werden) ·
Gegner-Lager + Kartenerweiterung · Witze-Pool des Monks (LLM + sessionStorage) ·
Wege-Audit (jede Sackgasse an das Netz hängen).

## 2026-08-14 · v3.7 — Knöpfe zeigen ihre untere Schnitzkante
**Änderung:** `min-height`/`min-width` in `paintSlices()` wieder gesetzt, aber **nach** dem Zeichnen
und nur nach oben (`dh > h0`, `dw > w0`). Grund: `paper9` rastet auf ganze 64er-Zellen (130 Quell-
pixel → 65 Anzeigepixel), die Box blieb bei 49–52 px, und `background-repeat:no-repeat` schnitt
13–16 px unten ab — auf jedem Knopf fehlte die untere Kante. Gefahrlos, weil der Sichtbarkeitsfilter
aus v3.6 (`offsetWidth<24 || offsetHeight<16`) verhindert, dass eine Fehlmessung einfriert.
**Abnahmeprobe:** `clipX`/`clipY` aller 12 `[data-ts-key]` = 0.
**Bugs:** #28 Knöpfe unten und rechts beschnitten.
**Lessons:** Bei 9-Slice bestimmt das Blatt die Mindestgröße, nicht das Layout — wer die Box kleiner
hält als die geraste Zelle, schneidet die Schnitzerei ab. Die Reihenfolge zählt: erst zeichnen,
dann die Box dem Bild anpassen.
**Belege:** `screenshots/01-qa-10-clip.png`, `screenshots/02-qa-10-clip.png`.

## 2026-08-14 · v3.6 — UI-Kit wirklich verdrahtet (drei stumme Fehlschläge davor)
**Änderung:** `initKit()` wird jetzt in `componentDidMount` aufgerufen (der Patch davor hatte den
Anker verfehlt — im File stand die Methode, aber kein Aufruf). `paintSlices()` greift auf
`this.el.stage` zu (Callback-Ref), nicht auf ein nicht existierendes `this.stage.current`.
Die Ladung wird **bei jedem Anstrich geprüft** (`K.PARTS.carved9`), weil das Helmet-Skript zweimal
ausgewertet werden kann und `window.OW_UIKIT` dann auf eine frische Instanz mit leerem `PARTS`
zeigt — genau daran scheiterte der erste Versuch lautlos. Das CSS-`border-image` wird erst
abgeschaltet, **wenn das Canvas vorliegt** (vorher blieben Tafeln nackt). Maßstab: gezeichnet wird in
doppelter Boxgröße und ganzzahlig halbiert gezeigt. Unsichtbare Boxen (`offsetWidth<24`) werden
übersprungen, und es werden **keine Mindestmaße** mehr gesetzt — das hatte eine Fehlmessung als
`min-height` eingefroren und eine Parchment-Fläche über die halbe Karte gezogen.
**Abnahmeprobe:** `[data-ts-key]` = 12, aktive CSS-`border-image` = 0, keine Konsolenfehler.
**Bugs:** #16 jetzt tatsächlich geschlossen · #23 `initKit` nie aufgerufen (stummer Patch) ·
#24 falscher Ref `this.stage.current` · #25 zweite Kit-Instanz mit leerem `PARTS` ·
#26 Rahmen vor dem Bild abgeschaltet → nackte Tafeln · #27 eingefrorene Mindestmaße → Riesenfläche.
**Lessons:** Eine Zusage wie „Kanon erfüllt" braucht eine **Probe im laufenden Bild**
(`[data-ts-key]` > 0 **und** border-image-Zähler = 0), nicht einen Screenshot, auf dem der Rahmen
dicker aussieht. Und: nach jedem Skript-Patch prüfen, ob der Anker getroffen hat — dreimal in dieser
Datei war der Anker daneben, dreimal lief es „grün" weiter.
**Belege:** `screenshots/01-qa-09.png`, `screenshots/02-qa-09.png`.

## 2026-08-14 · v3.5 — Canvas-UI-Kit eingebaut (Bug #16, erster Versuch)
**Änderung:** `code/ui-kit-ts.js` + `code/asset-source.js` aus dem Onboarding-Paket ins Projekt
übernommen (`ui-kit-ts.js`, `asset-source.js`; `mode='raw'` gesetzt) und im `<helmet>` geladen.
Neue Logik-Methoden `initKit()` / `paintSlices()`: nach `OW_UIKIT.load()` wird jede HUD-Fläche
gemessen, mit `paper9(key,w,h)` bzw. `band3(key,w)` **auf Canvas** gezeichnet und als
`background-image` in 1:1-Größe gesetzt; das CSS-`border-image` wird dabei abgeschaltet
(`borderImageSource:none`, Rahmen transparent). Neu gemalt wird bei `componentDidUpdate` und
`resize` (Größen-Cache `data-ts-size` verhindert Dauerarbeit). Knöpfe haben jetzt
`min-height:64px`/`min-width:128px`, damit die 64er-Ecken nicht überlappen; Ribbons laufen mit
`band3` auf **64 px** Höhe. Damit sind **Ecken 1:1 und Kanten gekachelt** — der Kanon ist erfüllt.
Zusätzlich: Sprechblasen entzerrt (max. zwei Paare, 3–6 s Dauer, 10–20 s Sperre, Blase nur beim
Sprecher, Position weg vom Partner) und Alarmtafel aus der Dorfmitte in die rechte Spalte verlegt.
**Bugs:** #16 geschlossen · #21 Sprechblasen bei allen Helden gleichzeitig, Blase auf dem Partner-Sprite ·
#22 Alarmtafel lag über der Party-Zone.
**Lessons:** Das Kit misst die Blätter selbst — `ui-slices.json` ist nur Cache. Und: eine Fläche,
die man in jeder Größe braucht, gehört **nicht** in CSS `border-image`, weil dort die Ecken an
`border-width` hängen; Canvas ist der einzige Weg zu 1:1-Ecken mit gekachelten Kanten.
**Belege:** `screenshots/01-qa-04-uikit.png`, `screenshots/02-qa-04-uikit.png`.

## 2026-08-14 · v3.4 — HUD minimiert, EN, QA-Runde
**Änderung:** HUD auf Progressive Disclosure umgebaut: Statuszeile + `Log`/`Settings`; alle Regler
wandern ins Settings-Fenster; Party-Leiste einklappbar; Gebäude-Meta erst on Hover (Weltschild) und
on Click (Tafel); DOM-Tooltip entfernt. Alles **EN**. Scrollbars und Regler im TS-Stil (Holzrinne,
Messing-Griff, harte Outline). Wolken deckend. Units zeigen ihre **Absicht** (gestrichelter Weg +
Ziel-Raute) und **interagieren** (Paare in der Party-Zone mit Sprechblase). Responsiv über Flex-Wrap
und `min(px, calc(100vw − 20px))`.
**Bugs:** #17 `roundRect` fehlte nach dem Template-Neubau (TypeError, Sim stand) · #18 `partyOpen`
fehlte im State · #19 Weltbanner noch deutsch · #20 doppelte Hover-Anzeige.
**Lessons:** Nach einem Template-Neubau immer die Konsole prüfen — ein fehlender Helfer stoppt die
ganze Simulation, das Bild bleibt aber stehen und sieht „fast richtig" aus. Neue Template-Holes
brauchen denselben Commit im `renderVals()`.
**Belege:** `screenshots/qa-01-overview.png`, `screenshots/01-qa-02.png`, `screenshots/02-qa-02.png`;
Prüfmatrix in `QA-Nexus-Village-v3.md`.

## 2026-08-14 · v3.3 — Befund: CSS border-image kann den Kanon nicht
**Onboarding-Paket gelesen:** `uploads/KFB Baukasten v1/onboarding-tinyswords_2026-08-14/`
(`data/ui-slices.json`, `02_UI_BAUKASTEN_TS.md`). Kanon dort: die UI-Blätter sind **Atlanten auf
64er-Raster**; Ecken **1:1**, Kanten und Mitte **gekachelt**, Maßstab nur ganzzahlig, halbiert zeichnen
ist ausdrücklich falsch. `Banner_Slots`/`WoodTable_Slots`/`Papers` sind **9-Slice** (nicht 3),
Bars sind 3-Slice **mit Lücken** (Base 320×64, Fill wird **beschnitten**, nie skaliert),
`Swords.png` ist ein 3-Slice-Trennstrich mit fünf Farbzeilen.
**Versuch:** `border-image … 64 fill round` mit `border-width:64px` (Ecken 1:1, Kanten gekachelt).
**Ergebnis: gescheitert** — 64-px-Ränder sprengen kleine HUD-Boxen, die Mitte fällt aus, das HUD wurde
zu braunen Klötzen. Zurückgebaut auf den halben Maßstab (Panels 32, Buttons 16, Ribbon 32).
**Bug #16:** CSS `border-image` kann „Ecken 1:1 + Kanten kacheln" bei Elementgrößen < 128 px nicht
leisten — es skaliert die Ecken auf `border-width`.
**Konsequenz (nächste Runde, klar umrissen):** HUD-Flächen nicht mehr per CSS, sondern mit
`code/ui-kit-ts.js` (`OW_UIKIT.paper9/band3/bar/fixed` + `drawScreen`) **auf ein Canvas** zeichnen und
als Hintergrund hinter den DOM-Text legen (oder das HUD komplett im Canvas rendern). Nur dieser Weg
erfüllt Ecken-1:1 + Kachelung. `ui-slices.json` ist Cache — das Modul misst zur Laufzeit selbst.

## 2026-08-14 · v3.2 — EIN Slice-Maßstab
**Änderung:** UI-Scale 0.5 festgeschrieben: 9-Slice-Panels `border-width:32px`, kleine Rahmen und
Buttons `16px`, 3-Slice-Ribbons Höhe **32 px** mit `border-width:0 32px`. Innenabstände angepasst.
**Bugs:** #15 krumme Slice-Maßstäbe (0,20×/0,59×/0,66×) → Outline verschwand, Ribbon-Zipfel wurden Klötze.
**Lessons:** Pixel-Art-Slices nur in ganzen Teilern von 64 zeichnen; ein Maßstab-Satz für das ganze HUD,
nie pro Element raten.
**Offen (nächste Runde):** `Banner.png`/`Slots.png` (Free Pack, Store-Page-Banner) und
`media/3D_Assets/CATALOG/2d-catalog.json` lesen, Maße/Slice-Zonen messen, ATLAS dagegen abgleichen und
die Kopfzeilen (Titelbanner, Chronik-Tab) auf die echten Banner-Assets umstellen.

## 2026-08-14 · v3.1 — UI-Slices korrigiert
**Änderung:** Alle Buttons von 3-Slice auf **9-Slice** (`Button_*_9Slides`) umgestellt, einheitliche
Rahmenbreite 13 px, Innenabstand 2/6 px. Ribbons behalten 3-Slice, aber mit `border-width = Elementhöhe`
(42 px Chronik-Tab, 38 px Alarmband). Alarmkarte, Chronik-Tab und Chronik liegen in **einer** rechten
Flex-Spalte, Ratsstube scrollt und endet über der Party-Leiste, Ton-Schalter in eigener Zeile.
**Bugs:** #7 3-Slice-Buttons mit fester Kappenbreite → gequetschte Kappen · #8 zwei absolute Panels auf
demselben Anker (Alarm unter Ratsstube unklickbar) · #9 fester `margin-top` für die Chronik konnte den
textabhängig wachsenden Alarm nie treffen.
**Lessons:** 3-Slice heißt „nur horizontal, Höhe fix". Panels gehören in Flex-Spalten, nicht auf
Einzelanker. Overlays immer bei 924×540 gegenprüfen, nicht nur im großen Fenster.

## 2026-08-14 · v3.0 — Baukasten, Küste, Zeit, FX
**Änderung:** `ATLAS`-Registry + `blit()/frameOf()`; Foam als 192-px-Stempel; Shadow-Ebene entfernt;
Bäume nur im Inland; Wolken; Tageszeit 0–24 h mit `SKY`-Keyframes; Particle FX (Feuer/Rauch/Explosion/
Splash); Water Rocks + Quietscheente; Gebäude-Hover-Tooltip und Klick-Tafel; Unit-Schatten entfernt.
**Bugs:** #3 Shadow-Ebene ohne Elevation gemalt · #4 Foam per-Kachel autotiled → Bänder und weiße Kästen ·
#5 zusätzlicher Unit-Schatten · #6 Namensschild lag auf dem Sprite · #1 `this.deco` hieß `this.props`
und hat React-Props überschrieben (`TypeError: this.props is not iterable`).
**Lessons:** Erst den Guide lesen, dann rendern. Foam und Shadow sind **Stempel**, kein Autotile.
Klassenfelder in DCLogic nie `props/state/refs` nennen.

## 2026-08-14 · v2.0 — Tile-Logik und In-Game-UI
**Änderung:** Dunkle Dashboard-Chrome ersetzt durch Pixel-Dorf mit In-Game-UI (Carved-Panels, Ribbons,
Shantell Sans); 4×4-Blob-Autotiler; Sand-Wege auf Kachelraster; BFS-Pathfinding über das Wegenetz;
Tiefensortierung nach Fuß-Y.
**Bugs:** #10 Autotile-Mapping falsch (Spalte/Zeile 3 als Mitte behandelt → Kanten in der Fläche) ·
#11 9-Slice ohne `background-color` → Panelmitte optisch durchsichtig · #12 `replaceText` mit
falschem Anker schlug stumm fehl, Änderungen fehlten unbemerkt.
**Lessons:** Autotile-Tabelle am Kontaktabzug verifizieren (Raster über das PNG legen). Nach jedem
Patch das Ergebnis prüfen, nicht dem `ok` vertrauen.

## 2026-08-14 · v1.0 — Weg B, dunkle Nexus-Chrome
**Änderung:** Erster POC: Canvas-Dorf in dunklem Enterprise-HUD, Artefakt-Feed, Alarm mit Freigabe,
Regler Mensch↔Autonomie, drei Quellen (Mock/RSS/Szenario), Jukebox + UI-SFX.
**Bugs:** #13 Topbar nicht schrumpfbar → Regler außerhalb des Fensters · #14 zwei Overlay-Pillen auf
derselben Grundlinie.
**Lessons:** Kein Copy-Paste des Forks (Bun + Server + 373 Dateien), sondern Event-Vertrag nachbauen.

## Housekeeping-Backlog
- `media/3D_Assets/CATALOG/2d-catalog.json` gegen den `ATLAS` abgleichen (Frames/Größen/Pfade) und
  Abweichungen hier notieren.
- Free-Pack-UI (`Banner.png`, `Papers`, `WoodTable`, `Bars`, `Icons`, `Human Avatars`) als
  zweite HUD-Familie aufnehmen; Slice-Werte messen und in §3 des Baukastens ergänzen.
- Enemy Pack: Lager außerhalb der Insel, Raids auf dem Wegenetz, Angriff = Nexus-Incident.
- Elevation + Stairs (`Tilemap_Elevation.png`), Regeln stehen im Guide.
- Editor: Maske + Wegenetz serialisieren, ATLAS als Palette.
- Onboarding-Paket aus den anderen KFB-Chats einarbeiten, sobald es vorliegt.
