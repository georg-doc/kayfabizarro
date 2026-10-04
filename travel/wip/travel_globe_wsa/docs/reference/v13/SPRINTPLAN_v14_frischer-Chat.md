# Sprintplan v14 · Übergabe an einen frischen Chat

**Stand** 03.09.2026, nach der v13-Sitzung (Contrails, Kamera-Voreinstellungen, Cartoon-Trägheit).
**Art** Living Document, additiv. Setzt keinen Vorkontext voraus.
**Konvention (hart)** keine Bindestriche als Satzzeichen, echte Umlaute, Kausalität über also und aber.
**Nachbardokumente** `docs/TS-DELTA-v12.md` (der Portierplan) · `HOUSEKEEPING.md` (Status je Artefakt) ·
`uploads/GRUENDUNGSDOKUMENT_KFB_Design_Projekt.md` und `uploads/KFB_Prompt_Lab.md` (Verfahren) ·
`KFB Mech Slice v7/mech-slice-v7/docs/HANDOVER_Mech-Slice-v7.md` (die fünf Nähte).

---

## 00 · Übergabe

| | |
|---|---|
| **Zuletzt passiert** | v13 ist der Arbeitsstand, v12 eingefroren. Neu: `contrails.js` als Comic-Speedlines an der gezeichneten Karte, drei Kamera-Voreinstellungen gegen `CameraRig.ts` gemessen, `pet-traegheit.js` als Antrieb für die Cartoon-Verformung. Das Bodenreflex-Licht für die untere Pet-Region existierte bereits seit 2.9. und wurde nur benannt, nicht neu gebaut. |
| **Als Nächstes** | **Der Mech-Einbau ist der Sprint**, und er ist zugleich der erste ehrliche Test des Wirts: bisher haben ~40 Module unter einem Dach angemeldet, aber alle wurden IN diesem Dach gebaut. Der Slice ist das erste Modul mit eigener Herkunft, eigener Kamera, eigener Bodenquelle und eigenem Ton. |
| **Davor genau eine Sache** | **Den Wirt ABLESEN, nicht erfinden** (S1). Ein Vertrag, der aus einem laufenden System herausgelesen ist, kostet einen halben Tag; einer, der auf Papier entsteht, kostet den Sprint. |
| **So wird gearbeitet** | Additiv, nichts überschreiben. Zurückgenommenes bleibt stehen und wird begründet. Jede Setzung bekommt eine Kennung, jeder Fehler ein Post Mortem mit Regel in Befehlsform. |

---

## 01 · Der Befund, der die Reihenfolge bestimmt

**Das Gründungsdokument diagnostiziert zwölf Belege, die nicht komponieren. Das stimmt für die
Slices und es stimmt nicht für globe-v13.**

Der Globus ist bereits ein Wirt, und zwar ein bewiesener: **eine** three-Instanz, **eine** Zeitbasis,
**ein** Seed, **ein** Panel mit Suche, **ein** Torsystem, eine geteilte Belegung, die Flora, Felsen,
Karten, Portale und Gegner gemeinsam lesen. Am 3.9. haben zwei fremde Module angemeldet, ohne dass
eines etwas selbst geladen hat.

**Also ist der erste Auftrag nicht „Wirt schreiben", sondern „Wirt herauslesen".** Das ist genau die
eigene Regel P-15 des Prompt Labs, also nutzen, was läuft. Ein zweiter Wirt neben diesem wäre ein
Nachbau, und ein Nachbau ist laut §8 des Gründungsdokuments ein Fehler und keine Variante.

**Was das Gründungsdokument dennoch richtig sieht:** die dreizehn Fähigkeiten sind im Globus
vorhanden, aber **nirgends aufgeschrieben**. Ein Modul von außen kann sie nicht anmelden, weil es
sie nicht kennt. Genau daran scheitert ein Einbau, nicht an Code.

---

## 02 · Zwei Achsen, weil sie heute wieder verwechselt worden wären

| Achse | Klein anfangen? | Für diesen Sprint |
|---|---|---|
| **Rollen** | **Ja.** Bauer plus getrennter Prüfer | Das läuft und es trägt, siehe §05 |
| **Umfang und Vertrag** | **Nein.** Vertrag zuerst, dann zwei Module unter Last | Der Wirt trägt heute vierzig eigene Module. Der Mech ist das erste FREMDE, also ist der Vertrag erst mit ihm geprüft |

**Ein Beleg darf klein sein, ein Modul nicht.** Der Mech-Slice ist kein Beleg mehr, sondern ein
Modul, also braucht er den Vertrag vor dem Einbau und nicht danach.

---

## 03 · Die Sprints, in dieser Reihenfolge

### S0 · Check-in und Export (der Rest dieser Sitzung)

Kein Bau. v13 einchecken, Standalone-HTML, `HOUSEKEEPING.md` nachziehen, `github.md` als Beleg.
**Danach ist v13 der Referenzstand, gegen den der Mech-Einbau gemessen wird.** Ohne diesen Schnitt
gibt es beim ersten Fehler keinen Punkt, auf den man zurückkann.

### S1 · Den Wirt ablesen · `docs/WIRT_v13.md`

**Ein Lesevorgang, kein Bau.** Für jede Fähigkeit, die globe-v13 faktisch liefert, eine Zeile: wie
sie heißt, wer sie besitzt, wie ein Modul sie bekommt.

| Fähigkeit | Wo sie heute im Globus lebt |
|---|---|
| `three@0.160` | eine Instanz, über die DC-Helmet geladen |
| `clock` | die Bildschleife in `globe-poc.js`, `dt` wird durchgereicht |
| `rng` | `seed` plus die geteilte Streuung in `verteilung.js` |
| `ground` | `boden-lesung.js`, **einziger** Eigentümer der Höhe |
| `palette` | `weltstimmungen.js` plus `sky-presets.js` |
| `lights` | `buildLightRig` mit acht benannten Lampen, `light-budget.js` zählt sie |
| `audio` | ein Bus, standardmäßig aus, Einschaltgeste vorhanden |
| `camera` | `camera-rig.js`, **genau ein** Besitzer |
| `panel` | `settings-panel.js`, Zeilenarten `slider` · `toggle` · `seg` · `button` · `info` · `note` |
| `gates` | Konvention: jedes Modul liefert `tor()` mit Text und `ok` |
| `fx` | `fx-script.js`, Ereignisse statt Aufrufe |

**Abnahme von S1:** ein Modul, das nichts tut, meldet alle Fähigkeiten an, bekommt sie, und das
Panel zeigt sein Tor. Zwanzig Zeilen, und danach ist der Vertrag geprüft statt behauptet.

### S2 · Mech-Slice v10 einbauen

**Erst lesen, was v10 wirklich ist.** Beiliegend ist v7; v10 ist der Stand, den Georg nennt. Die
Nähte unten stammen aus dem v7-Handover, also gelten sie als Hypothese und nicht als Befund, bis der
v10-Quelltext gelesen ist. *Eine Naht aus einem anderen Stand ist eine Behauptung.*

Die fünf Nähte, aus `HANDOVER_Mech-Slice-v7.md` §2:

1. **`_h(x, z)` ersetzen.** Der Slice rechnet seine Höhe aus einer Sinusformel; der Globus hat
   `boden-lesung.js` als einzigen Eigentümer. Eine Stelle, und `_normal` leitet daraus ab.
2. **Kein zweiter Flugcode.** `carpet.js` bleibt die eine Flugphysik. Der Übergang Boden zu Flug ist
   eine Zustandsmaschine, keine zweite Physik.
3. **Genau ein Kamerabesitzer.** Der Slice bringt eine Over-Shoulder-Kamera mit, der Globus hat
   `camera-rig.js`. Zwei Besitzer sind laut Handover der Klassiker unter den Einbaufehlern.
4. **`_tint` aus der Biompalette**, damit Staub und Rauch die Weltfarbe tragen.
5. **Arenagrenze** von r = 42 u auf Globusmaß.

**Zwei Tore, und das zweite ist das, das bisher immer fehlte:**

| Tor | Prüft | Form des Beweises |
|---|---|---|
| **1 · Slice allein** | die Showcase-Ansicht, die es schon gibt | Screenshot plus Konsolenprotokoll |
| **2 · Slice im Globus, neben mindestens einem anderen Modul** | Verträglichkeit | Screenshot plus die Tore beider Module |

**Abbruch:** drei Runden ohne messbare Verbesserung an einer Naht heißt anhalten und den Stand
schreiben.

### S3 · Kampf, aber erst nach zwei Entscheidungen

Beides sind Georgs eigene offene Punkte aus `HOUSEKEEPING.md` des Slice, und beide sind
Konzeptfragen und keine Codefragen.

**Gegner-Färbung** (Georgs Wort: „lazy"). Der Ist-Stand multipliziert einen Ton über den ganzen
Atlas, also verdunkelt er immer, also mussten die Töne blass werden, also lesen die Gegner als
Lehmklumpen statt als Maschinen. Der Weg ist Trennung nach Material, also Chassis, Glas und
Triebwerk getrennt, Sichtbarkeit über Wert und Sättigung gegen die Weltpalette, und **ein**
Erkennungsmerkmal je Art statt Ganzkörperfarbe. **Zu entscheiden vorher:** trägt die Fraktion die
Farbe oder die Größenklasse?

**Treffer und Tod.** Winkelgrade sind das falsche mentale Modell. Ein abgeschossenes Fluggerät
verliert **Auftrieb**, also Schub weg, Nase kippt in die Flugbahn, Trudeln aus dem Restimpuls,
Aufschlag. Und hier greift der Antrieb aus dieser Sitzung: `pet-traegheit.js` liefert die Verformung
schon aus dem Rückstand, also braucht der Todesfall keine eigene Animation, sondern nur andere
Grenzen. **Ein Antrieb, vier Grenzensätze**, und ein Mech schwabbelt nicht wie ein Gummi-Pet.

### S4 · TS-Delta Stufe A abschließen

`FireflyCluster` · `FloatingLanterns` · `BirdFlock`. Zusammen unter 34 kB Quelle, keine neuen
Systeme, sofortige Wirkung auf die Nacht. **Das ist der Sprint für einen Tag, an dem der Mech
blockiert ist**, also die Rückfallarbeit und nicht die Hauptarbeit.

### S4a · Karten unter Wasser (Georg, 3.9., Bild `uploads/Bildschirmfoto 2026-09-03 um 19.45.39.png`)

**Befund am Bild, ohne Deutung:** eine Terrain-Karte liegt unter der Wasseroberfläche, also sieht
man sie durch das Wasser statt auf dem Grund liegen oder aus ihm herausschauen. Und zweitens:
**die Kartenschrift liest sich gespiegelt**, also blickt man auf die Rückseite oder die Ebene ist
verdreht.

**Das schwarze „L" auf der Karte ist der Tuschehaken** aus `karten-teppich.js`, also die Marke
„eingesammelt" (v11, Georgs Wunsch: *„noch lesbar, aber im Vorbeiflug als ‾hab ich schon‹
erkennbar"*). Zwei Dinge stimmen daran nicht. **Er liest nicht als Haken**, weil beide Schenkel fast
gleich lang und gleich fett sind (`lineWidth` 0,13 · 96 px), also ergibt er einen Winkel statt eines
Häkchens — zu reparieren am Glyph, nicht an der Platzierung: kurzer Schenkel kürzer, Strich dünner,
Anstieg steiler.

**Und er beantwortet die Spiegelfrage, also ist eine Hypothese damit erledigt.** Der Haken ist ein
EIGENES Mesh mit eigener Textur (`karten-haken`, ein InstancedMesh), und er ist im Bild **genauso
gespiegelt wie die Kartenschrift**. Zwei unabhängige Texturen spiegeln nicht gemeinsam, eine Ebene
aber schon. *Also ist es die Orientierung der Ebene und nicht die UV der Kartentextur.* Damit
bleibt für die Spiegelung genau ein Verdächtiger: die Ausrichtung der Karten-Ebene im Wasserfall
(`istLand` falsch, Floß-Zweig) gegenüber dem Landfall.

**Zur Lage im Wasser sind zwei Ursachen möglich, und sie brauchen verschiedene Reparaturen**, also
wird zuerst unterschieden statt geraten:

1. **Die Karte sitzt auf der Geländehöhe, aber die Geländehöhe liegt unter dem Meeresspiegel.**
   Dann ist die Platzierung richtig und die Auswahl falsch, also gehört der Platz verworfen wie bei
   den Pflanzen (`verteilung.js` kennt „im Wasser verworfen" schon als Zähler im Panel).
2. **Die Karte sitzt richtig, aber der Ozean-Shader zeichnet über sie.** Dann ist es eine Frage von
   `renderOrder` und Tiefentest, also dieselbe Fehlerklasse wie die Speedlines am 3.9.

**Der Unterschied ist ablesbar, nicht ratbar:** das Panel zählt verworfene Wasserplätze bereits, und
das Kartentor nennt `n afloat on water` — die Karte im Bild ist also ein Floß und kein Versehen der
Streuung, sondern ein Floß, das zu tief liegt. Sagt der Zähler das, ist es Fall 2. *Erst die zwei
Fälle trennen, dann eine Zeile ändern.*

**Drei Befunde aus einem Bild, und sie werden getrennt behoben** — Lage im Wasser, Spiegelung der
Ebene, Lesbarkeit des Hakens. Zwei Befunde in einem Fix sind der Anfang von Whack-a-Mole.

### S5 · Card Zones · Weg 2 plus Deck-as-Seed

Vorher `KFB Card Zone Lab v2.dc.html` lesen, denn dort liegen der Voxel-Ansatz und die
Zonen-Registry. Übertragbar ist alles, was auf **Abstand** gebaut ist und nicht auf Koordinaten,
also Palette, Licht, Wetter und Flora je Karte über Radius und Blende. Damit ist die Zone auch
geometrieunabhängig, also überlebt sie den Wechsel auf Würfel, Torus, flache und hohle Erde.

---

## 04 · Wie die Q&A-Schleife läuft

**Das ist der Teil, den Georg ausdrücklich sauber gebaut haben will, und er ist heute an drei
Stellen schiefgegangen.**

### 04.1 Screenshots, nicht Messungen

> **NICHT MESSEN. SCREENSHOTS für Q&A machen. IMMER.** (Georg, 3.9.)

Die Regel ist nicht Bequemlichkeit, sondern Rollentrennung: eine Messung, die der Bauende ausliest,
beantwortet die Frage, die er gestellt hat. Ein Bild beantwortet die Frage, die Georg stellt.
**Messungen bleiben trotzdem im Bau**, also im Tor, das eine Zahl nennt. Der Unterschied ist der
Adressat: das Tor prüft den Bau, das Bild führt vor.

### 04.2 Die Trennlinie für Eigenmächtigkeit

Das Prompt Lab schränkt „nicht fragen, selbst entscheiden" über die **Aufgabengröße** ein. Heute hat
sich gezeigt, dass das die falsche Achse ist:

> **Eine Änderung, die verändert, was der Nutzer sieht, ist niemals eine Routineentscheidung.**

Bezahlt mit drei Fällen an einem Abend: ein Intro, das plötzlich 2,4 s später losfuhr, ein Einzug der
Speedlines, den niemand bestellt hatte, und umgeschriebene Panel-Texte. Alle drei waren technisch
begründet, keiner war bestellt. **Bestellt war: Kontakt zur Karte, dezenter, ein Drittel schmaler.**

### 04.3 Tore prüfen Zahlen, keine Absichten

Der teuerste Fehler des Abends war eine Zuweisung, die durch einen fehlerhaften Edit **im Kommentar
gelandet** war. `ankerX` blieb 0, die beiden Speedlines lagen exakt aufeinander in der Kartenmitte,
und es sah aus wie ein einzelner Strahl unter dem Pet. Kein Tor hat es gemerkt, weil alle Tore
gefragt haben, ob ein Anker existiert, und keines, wo er liegt.

> **Jedes Tor nennt eine Zahl, die falsch werden kann.**

### 04.4 Keine Zahl abschreiben, die schon woanders steht

Zwei Fassungen der Speedlines haben ihre Ansatzpunkte aus `carpet-mesh.js` gerechnet, also aus dem
Fahrzeugmesh, das **nicht gezeichnet wird**. Gezeichnet wird der CardCarrier, und der ist 0,042 tief
statt 0,09. Es waren nie falsche Zahlen, es war die falsche Quelle.

> **Frag das Objekt nach seinen Maßen.** Die Karte kennt `halfW`, `halfD` und `surfaceAt`, also
> hängt der Anker in der Karte und nicht neben ihr. Was nicht abgeschrieben wird, kann nicht driften.

### 04.5 Ein Vorzeichen aus einem anderen Bezugsrahmen ist eine Behauptung

Die erste Fassung saß vorn oben statt hinten unten, weil das Vorzeichen aus der Quelle übernommen
wurde. Im Doppeldecker ist −Z hinten, in `carpet.matrix()` ist +Z hinten, und `carpet-trail.js` sagt
das seit v1.

### 04.6 Die Form des Beweises folgt der Behauptung

| Behauptung | Beweis |
|---|---|
| sichtbar | Screenshot an festgelegter Kamera plus Konsolenprotokoll |
| Geometrie | **beides**, Bild und Tor mit Zahl |
| Ton | Auslösen, dann Protokoll und Zustand |
| Logik | Tor mit Zahl |
| Verträglichkeit | Tor 2, also im Wirt neben einem anderen Modul |

---

## 05 · Rollen, und was von ihnen belegt ist

**Bauen und Urteilen getrennt, und das ist an diesem Abend zum dritten Mal unabhängig bestätigt
worden.**

Der `speedRatio`-Fehler wäre nie aufgefallen. Die Blende der Speedlines hing am Tempoverhältnis,
aber die Reisefahrt liegt exakt auf dem Tempoboden 0,28 und wird gegen das Maximum 0,78 gemessen,
also ist das Verhältnis dort **0,000, dieselbe Zahl wie im Stillstand**. Die Striche wären nur
sichtbar gewesen, solange man Gas hält. Gefunden hat es der Prüfer, und zwar durch **Messen**, nicht
durch Ansehen. Das ist P-06 in einem Satz: Bild und Zahl zusammen, nicht statt.

**Und die Gegenprobe zur Selbstfreundlichkeit:** derselbe Abend hat den Kommentarfehler produziert,
danach behauptet, die Reparatur sitze, und ein viertes Mal gebraucht, bis Georg fragte, was da
eigentlich gebaut wird.

---

## 06 · Entscheidungen, die vor dem Sprint fallen müssen

| Kennung | Frage | Meine Empfehlung |
|---|---|---|
| **S-01** | Wo liegt Mech-Slice **v10**? Beiliegend ist v7 | v10-Quelle in das Projekt legen, dann lesen. Die fünf Nähte gelten bis dahin als Hypothese |
| **S-02** | Trägt die Gegnerfarbe die **Fraktion** oder die **Größenklasse**? | Größenklasse, denn die Silhouette trägt die Art schon, und Gefahr liest sich über Größe schneller als über Zugehörigkeit |
| **S-03** | Kamera-Voreinstellung: bleibt **Ours**, oder wird **tinyskies plus unsere Größe** der Standard? | Erst ansehen, dann entscheiden. Die dritte Voreinstellung ist die interessante, weil sie das Verfolgerverhalten der Quelle mit unserer Pet-Größe verbindet |
| **S-04** | Braucht das Pet ein **unterteiltes Netz**? | Erst das Tor lesen. Sind es unter vier Höhenringen, gibt es Neigen statt Biegen, und dann ist die Frage, ob das reicht |
| **S-05** | Wird der Mech im Globus **geflogen oder gelaufen** zuerst? | Laufen, denn die Bodenlesung ist die Naht mit dem höchsten Risiko und der Flug hat schon einen Besitzer |
| **S-06** | Kommt `docs/WIRT_v13.md` in dieses Projekt oder in ein frisches | In dieses, denn der Wirt ist hier und ein Vertrag zieht nicht um |
| **S-07** | Karten unter Wasser: verworfener Platz oder Zeichenreihenfolge? | Erst den vorhandenen Wasser-Zähler im Panel ablesen, denn er trennt die beiden Fälle ohne eine Zeile Code. Siehe S4a |
| **S-08** | Soll die Marke „eingesammelt" weiter ein Tuschehaken sein? | Ja, aber lesbar: kurzer Schenkel kürzer, Strich dünner, Anstieg steiler. Heute liest er als schwarzes „L" (Georg, 3.9.) |

---

## 07 · Post Mortems dieser Sitzung

| Was gebrochen war | Ursache | Regel |
|---|---|---|
| Speedlines hatten eine Lücke zur Karte, zweimal | Maße aus `carpet-mesh.js` gerechnet, gezeichnet wird der CardCarrier | **Frag das Objekt nach seinen Maßen.** Was nicht abgeschrieben wird, kann nicht driften |
| Ein Strahl statt zwei, unter dem Pet | Ein Edit schrieb literale Zeilenumbrüche, die Zuweisung landete im Kommentar, die Anker blieben bei (0,0,0) | **Jedes Tor nennt eine Zahl, die falsch werden kann** |
| Speedlines in der ganzen normalen Fahrt unsichtbar | Blende auf `speedRatio` statt auf absolutem Tempo. Reisefahrt liegt auf dem Tempoboden, also Verhältnis 0 | **Wer Bewegung meint, muss Bewegung messen, nicht Ausnutzung des Spielraums** |
| Speedlines standen auf der anderen Seite des Planeten | Nur eine Wache am `update`, keine eigene Sichtbarkeitszeile. Ohne Tiefentest von überall sichtbar | **Ein Effekt, der nicht mehr rechnet, hört damit nicht auf zu erscheinen** |
| Eigenmächtige Änderungen, drei an einem Abend | „Routineentscheidungen selbst treffen" auf sichtbare Änderungen angewandt | **Eine Änderung, die verändert, was der Nutzer sieht, ist niemals eine Routineentscheidung** |
| Erste Fassung saß vorn oben | Vorzeichen aus der Quelle übernommen, anderer Bezugsrahmen | **Ein Vorzeichen aus einem anderen Bezugsrahmen ist eine Behauptung, keine Zahl** |
| Ein Tor meldete ⚠ für den gesunden Standardfall | Bedingung verlangte Stützpunkte, im Schweben ist ein Punkt richtig | **Ein Instrument, das den Normalfall warnt, erzieht dazu, es zu überlesen** |
| Beinahe zerstörtes Augen-Rig | `applyCartoonDeform` backt die Hierarchie ein und hängt an die Wurzel um. Für Requisiten richtig, für Figuren tödlich, und ohne Fehlermeldung | **Ein Werkzeug für Requisiten ist keins für Figuren: Requisiten haben keine Hierarchie, die etwas bedeutet** |

---

*Ende. Erst den Wirt ablesen, dann das erste fremde Modul anmelden. Alles andere ist Reihenfolge.*
