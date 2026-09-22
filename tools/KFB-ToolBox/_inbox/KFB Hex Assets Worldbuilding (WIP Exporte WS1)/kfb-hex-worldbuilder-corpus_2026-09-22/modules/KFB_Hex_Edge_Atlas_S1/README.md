# Hex-Kanten-Atlas S1 · BT1

Sechs Kanten je Kachel, gemessen — und **gegen eine bekannte Wahrheit geeicht**, bevor die
Messung etwas beschreibt, das niemand nachprüfen kann.

## Warum es das gibt

Der Babel-Generator setzte Kacheln mit `Math.floor(rand()*6)*60` — also zufällig gedreht.
Eine Ufer-, Übergangs- oder Straßenkachel hat aber eine **gerichtete** Kante. Zufällig
gedreht zeigt der Strand landeinwärts und die Straße ins Nichts. Genau das war im Bild zu
sehen, und es war kein Platzierungsfehler: die Kantenkunde fehlte ganz.

`hexrealm/lib/hex-grid.js` führt `TILE_EDGES` — aber nur für die 32 Kacheln des Hexagon-Packs.
Die 128 Hex-Kacheln des Builder-Packs sind dort ungedeckt. BT1 des Briefs verlangt
ausdrücklich „Footprint, **sechs Kanten**, Pivot, Unterkante, Höhe und **erlaubte Nachbarn**"
für **beide** Packs.

## Das Verfahren

Kein Rendern in der Messkette. `hex-grid.js` dokumentiert zwei gescheiterte Anläufe, die hier
nicht wiederholt werden: UV-Sampling je Deckfläche (lieferte für `hex_grass` sechs
„Wasser"-Kanten) und Draufsicht-Rendering mit Pixelprobe (in z gespiegelt — nur symmetrische
Kacheln überlebten). Gerendert wird ausschließlich für den **Blick**, nie für eine Zahl.

**Überdeckungsprobe an der Fuge.** An fünf Punkten entlang jeder Kante, bei 0,92 · Inkreis,
wird gefragt: welche nach oben zeigende Fläche liegt hier? Das oberste Dreieck, das den Punkt
in x/z überdeckt, gewinnt. Seine Atlas-Farbe und seine Höhe sind die Probe.

Zwei Vorstufen waren über **Nähe** definiert und deshalb zu grob:

| Fassung | Verfahren | Kanten richtig |
|---|---|---|
| 1 | 60°-Tortenstück, äußerer Ring | 75,3 % |
| 2 | Fenster um den Kantenmittelpunkt | 89,4 % |
| 3 | Überdeckungsprobe an fünf Fugenpunkten | **99,5 %** |

Fassung 2 scheiterte sichtbar an `hex_water` → `w?w?w?`: getestet wurde der **Schwerpunkt**
jedes Dreiecks, und das Pack baut Deckflächen aus vier großen Dreiecken. Deren Schwerpunkte
liegen in der Kachelmitte, an der Fuge liegt keiner. Eine Nähe-Heuristik kann die
Tesselierung nicht wegrechnen.

## Die Klassen kommen aus dem Bestand

Kein „grün ist Wiese, gelb ist Sand". Die Sektorfarben aller Kacheln werden agglomerativ
gruppiert; die Verschmelzungsgrenze ist der Median-Nachbarabstand × 2,6, nicht eine Zahl aus
meinem Kopf (dieselbe Lehre wie `deriveRockClasses` in `kit.js`, wo drei gesetzte Schwellen
hintereinander falsch waren).

Ihre **Bedeutung** bekommen die Gruppen aus `TILE_EDGES`: für jede Gruppe wird ausgezählt,
welche Klasse (`g` Wiese · `s` Sand · `w` Wasser) die bekannte Tabelle an diesen Kanten führt.
Eine Gruppe, die in der bekannten Menge gar nicht vorkommt, ist eine neue Klasse des
Builder-Packs und bekommt keinen erfundenen Namen.

## Zwei Regeln, beide gemessen

Das Werkzeug entscheidet nicht heimlich, welche Regel gilt — es fährt beide durch dieselbe
Eichung und stellt die Quoten nebeneinander:

| Regel | Kanten | Kacheln |
|---|---|---|
| A · Geometrie schlägt Farbe (Fuge unter Deckhöhe = Wasser) | 94,3 % | 84,4 % |
| B · Nur Farbe (Gruppe der Probe entscheidet) | **99,5 %** | **96,9 %** |

**Befund, und er ist das Gegenteil meiner Annahme beim Bauen:** die Geometrie ist hier die
schlechtere Quelle. Regel A lag bei genau einer Sorte daneben — den fünf Uferkacheln, wo
`sssggg` als `wwwggg` zurückkam. Ein Strand fällt zum Wasser hin ab; die Höhe allein trennt
ihn nicht vom See. Statt eine vierte Schwelle zu erfinden, hat die Messung entschieden.

## Zwei Fehler, die erst die Prüfung gefunden hat

Beide betrafen ausschließlich das Builder-Pack — also genau den Teil, für den es dieses
Werkzeug gibt. Die Eichquote von 99,5 % war dabei die ganze Zeit korrekt und hat sie
verdeckt, weil sie nur die Kacheln misst, die schon eine Tabelle hatten.

**Ein Atlas für alles.** `atlasProbe` nahm die ERSTE Textur, die auftauchte, und maß alle
Kacheln dagegen. `hex_forest` kam als `wwwwww` zurück — sechs Wasserkanten für eine Kachel,
die im Bild sattgrün ist. Genau der Fehlertyp, den `hex-grid.js` für sein verworfenes
UV-Sampling protokolliert.

**Die erste Erklärung dafür war ebenfalls falsch** und stand in diesem README, in `github.md`
und im Lehren-Bildschirm: »die beiden Packs haben verschiedene Atlanten«. Nachgemessen hat das
**Builder-Pack gar keinen Atlas** — es benutzt einfarbige Materialien ohne `map`
(`hex_forest`: Material `Green`, `#48bc8d`). Seine Geometrie trägt aber UVs, und die
Bedingung `if (uv && probe)` griff mit der global gesetzten Hexagon-Sonde, statt auf die
Materialfarbe zurückzufallen. Die Sonde hängt jetzt am **Material**: fehlt `mat.map`, fällt
die Messung auf die Flachfarbe zurück. Es gibt genau **eine** Sonde, für das Hexagon-Pack.

Dass eine plausible, aber ungemessene Ursache drei Dokumente weit getragen wurde, ist selbst
ein Fall für Guardrail G2 — siehe `POSTMORTEM_GOLDEN_SAMPLES_2026-09-20.md`.

**Eine Zuordnung, die schon feststand, wurde weggeworfen und dann geraten.** `lookup()` machte
ein unbegrenztes Nächster-Nachbar über alle 32 Farbgruppen, ließ aber nur die 4 geeichten als
Antwort zu. Eine Builder-Farbe rastete damit auf die am wenigsten weit entfernte der vier ein,
egal wie fern. Dabei **ist** jede Sektorprobe Mitglied ihrer Gruppe — die Zuordnung steht seit
dem Gruppieren fest. Es wird nicht mehr gesucht.

## Zwei Ausgaben, weil es zwei Fragen sind

`kinds` — sechs Zeichen im Alphabet der bekannten Tabelle (`g`/`s`/`w`/`?`). Nur damit lässt
sich gegen `TILE_EDGES` prüfen.

`classes` — die Klasse, die für **Nachbarschaft** zählt. Das Builder-Pack bringt eigene
Geländesorten mit, die das Hexagon-Alphabet per Konstruktion nicht benennen kann: es kennt
dieses Pack nicht. Sie bekommen ihre Gruppen-ID (`#3`) statt eines erfundenen Buchstabens.
»Passt A an B« heißt ohnehin nur »gleiche Klasse beiderseits der Fuge« — das beantwortet
eine ID genauso gut wie ein Buchstabe, und sie lügt nicht. `hex_forest` ist jetzt
`#3 #3 #3 #3 #3 #3`, `hex_forest_roadA` ist `#6 #3 #3 #3 #3 #3`: eine abweichende Kante,
genau die mit dem Sandarm.

## Ergebnis

**Zwei getrennte Zahlen, weil es zwei getrennte Aussagen sind.**

Eichung — gilt **ausschließlich** für die 32 Kacheln des **Hexagon-Packs**, die bereits eine
Tabelle hatten: 99,5 % der Kanten, 96,9 % der Kacheln vollständig richtig. Eine Abweichung
bleibt (`hex_coast_A`, Kante 1 — eine Farbe, die zu keiner geeichten Gruppe passt); sie steht
als `?` da, statt erzwungen zu werden.

Zugewinn — die 144 Kacheln **ohne** bekannte Tabelle, der eigentliche Zweck von BT1:

| | |
|---|---|
| alle sechs Kanten klassifiziert | **126** (88 %) |
| teilweise | 17 |
| gar nicht | 1 |
| davon im Alphabet `g`/`s`/`w` | 10 — der Rest trägt eigene Klassen des Packs |

Dazu ausgewiesen und aus dem Export gehalten: Kacheln ohne Deckfläche (Unterseiten-Kappen,
alle Normalen zeigen nach unten — kein Messfehler, sondern keine Fläche) und Kacheln, die
nicht auf dem Modulgitter liegen.

## Der Schlüssel ist pack-qualifiziert

`hex_water` gibt es in **beiden** Packs. Eine frühere Fassung schlüsselte den Export nach
bloßem Basenamen — einer überschrieb den anderen stillschweigend, und die Eichung zählte
beide gegen dieselbe Tabelle (33 geprüfte Kacheln, wo die Tabelle 32 Einträge hat). Der Brief
verbietet genau das: die beiden Packfamilien dürfen nebeneinander stehen, aber ihre Maße und
Anschlüsse werden nicht stillschweigend gleichgesetzt — zumal sie gegen **verschiedene
Atlanten** gemessen wurden. Heute messen beide zufällig dasselbe; das Schema dürfte den
Unterschied trotzdem nicht verlieren können.

Schlüssel ist jetzt `pack|base`, und jeder Eintrag trägt zusätzlich `pack` und `path`, damit
ein Leser ihn auf eine Datei zurückführen kann. Geeicht wird nur gegen das Pack, das die
Tabelle beschreibt. Auch der Kontaktbogen nennt das Pack unter jedem Namen — er ist die
Ansicht, an der ein Mensch prüft, und ausgerechnet dort dürfen die Packs nicht zusammenfallen.
Der Blick lohnt: `hex_water` ist im Hexagon-Pack dunkelblau, im Builder-Pack türkis. Beide
messen `wwwwww`, beide sind nicht dasselbe Teil.

Export `edge-atlas.json`, Schema `kfb.hex-edge-atlas/3`, mit `calibration`, `coverage`,
`sharedBasenames`, `tiles`, `edges`, `classes`, `colorGroups` und `excluded` getrennt.

## Der Kontaktbogen

Jede Kachel von oben, darüber die sechs gemessenen Kanten als Ring. Die Kamera hat
`up = (0,0,−1)`, damit +x rechts und +z unten liegt — dieselbe Konvention wie der Messwinkel.
Läge sie anders, sähe der Ring richtig aus und wäre es nicht: genau der Fehler, an dem
Fassung 2 in `hex-grid.js` gescheitert ist. Bekannte Kacheln mit Abweichung bekommen einen
roten Zweitring.

Belege: `screenshots/edge-atlas-0{1..4}.png` (die Eichung über alle vier Fassungen).

## BT2 · Die Bauvorgaben des Herstellers

KayKit legt dem Pack zwei Anleitungsbilder bei. Sie sind eine Bauanleitung mit drei
ausdrücklichen Regeln und zwei fertigen Inselkompositionen. Der Bildschirm **Bauvorgaben**
stellt Vorlage und Nachbau nebeneinander — und unter jeden Fall den Befund.

**Nachgebaut, nicht generiert.** Der verworfene `diorama.js` war eine Layout-Formel,
`growBand()` im Babel-Generator ist ein Random Walk. Hier steht jede Zelle einzeln da, weil
sie dort stehen soll. Das ist die Bedingung aus `FAIL_ISLANDS.md`.

| Fall | Ergebnis |
|---|---|
| Use as padding between height gaps | Terrasse steht. **Kein Teilsechseck im Bestand** — gegen den VOLLEN Bestand geprüft, der Verdacht aus dem Baukasten (`tiles/square`, `objects`) ist damit widerlegt. Die Padding-Teile des Promobildes sind im ausgelieferten Pack nicht enthalten. |
| Decorate tiles | Vollständig. Versatz auf Inkreis minus halbe Teilebreite gedeckelt, nichts ragt über die Kante. |
| Create rocky landscapes | Vollständig, drei Größen aus dem Bestand, größtes Teil `mountain_C`. |
| Dorfinsel (Packbild 1) | **48 Fugen geprüft, 0 Fehlstellen.** Feld = Auflieger `building_grain` (1,87 × 2,09 × 0,39) auf Graskachel — keine Feld-HEXKACHEL im Pack, sondern eine flache Bodendecke. |

Die Dorfinsel ist der eigentliche Beweis: dort entscheidet nicht die Kachelwahl, sondern die
**Drehung**. Wald, Felder und Wiese sind beliebig drehbar, Fluss und Straße nicht. Deren
Kachel und Winkel kommen aus `solveHexTile()`, die Netze aus `buildNetwork()`, und
`auditTileFit()` prüft hinterher jede Fuge gegen ihren Nachbarn. Genau diese Kette fehlte im
Babel-Generator — dort stand `Math.floor(rand()*6)*60`.

## Living document

Der Bildschirm **Lehren** führt die verworfenen Verfahren dieses Projekts: was gebaut wurde,
warum es falsch war, und was an seine Stelle trat. Der Atlas ist die ausführliche Fassung,
auf die ein knappes Embed-Modul verweisen kann — nicht eine zweite, kürzere Wahrheit daneben.

Eine Spiegelseite liegt als `KFB Hex-Kanten-Atlas S1.html` auf Projektebene, damit das
Dokument im Dropdown auftaucht. Gespiegelt ist nur die Hülle; die Logik liegt unverändert in
`KFB_Hex_Edge_Atlas_S1/src/`.

## Status

| | |
|---|---|
| `SOURCE` | Brief BT1 @ main · `hexrealm/lib/hex-grid.js` (TILE_EDGES) · Registry-Shards beider Packs |
| `IMPLEMENTATION` | Kanten-Atlas, fünf Bildschirme (Eichung · Kontaktbogen · Bauvorgaben · Tabelle · Lehren), Export, Spiegel auf Projektebene |
| `TESTED RESULT` | Eichung 99,5 % / 96,9 % auf 32 Hexagon-Kacheln · 126 von 144 ungedeckten Kacheln vollständig klassifiziert · Dorfinsel 48 Fugen, 0 Fehlstellen · alle vier Bauvorgaben gebaut und im Bild geprüft |
| `EXPORT` | `edge-atlas.json` aus der Seite |
| `PUBLIC DEPLOYMENT` | `NOT_TESTED` |
| `GEORG ACCEPTANCE` | offen |
| `OPEN` | 18 von 144 Builder-Kacheln unvollständig · der Babel-Generator ist unberührt |

## Was hier NICHT drinsteht

Pivot, Unterkante und Höhe je Kachel misst der Baukasten (`KFB_Hex_Baukasten_S0/src/kit.js`)
und werden hier nicht zweitgemessen. Welche Teile tragend sind und welche nur erzählen, steht
dort als Rollenzuordnung. Dieser Atlas ergänzt genau eine fehlende Sache: die Kanten.
