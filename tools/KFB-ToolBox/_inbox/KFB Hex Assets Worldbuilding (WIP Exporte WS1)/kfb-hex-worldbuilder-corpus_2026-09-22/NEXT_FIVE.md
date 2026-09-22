# NEXT_FIVE — fünf Dinge, an die bisher niemand gedacht hat

Nicht Wunschliste, sondern die fünf Stellen, an denen ein modularer Baukasten aus diesem
Material heute noch scheitern würde. Jede ist aus einem konkreten Befund in diesem Paket
abgeleitet, keine ist eine allgemeine Empfehlung.

---

## 1 · Ein Kachel-Steckbrief als gebackenes Artefakt

**Der Befund.** Dieselbe Kachel wird heute an drei Stellen beschrieben: `TILE_EDGES` in
`hex-grid.js` kennt 32 Kacheln, `kit.js` misst Footprint, Pivot, Unterkante und Rolle zur
Laufzeit, der Kanten-Atlas misst sechs Kanten und exportiert `edge-atlas.json`. Drei
Teilwahrheiten, keine vollständig, keine mit den anderen verheiratet. Ein Editor, der 447
Modelle bei jedem Start lädt und neu vermisst, ist kein Editor.

**Was fehlt.** Eine Datei `tiles.json`, Schema `kfb.hex-tiles/1`, ein Eintrag je `pack|base`:

```
{ key, pack, path, commit,
  footprint:[w,d], height, pivot:[x,y,z], underside,
  edges:{ kinds:"gggsss", classes:["#3","#3",...] },
  role, family, symmetry, rotationLocked, measuredAt }
```

Erzeugt von einem benannten Bake-Lauf, mit Datum und Commit-Pin im Kopf. Das Backen ist der
Moment, in dem die Messung zur Wahrheit wird — danach liest jeder nur noch.

**Warum jetzt.** Die Packs laufen heute ungepinnt auf `main`. Ein Steckbrief ohne Commit
beschreibt einen Bestand, den es morgen vielleicht nicht mehr gibt.

---

## 2 · Symmetrieperiode als Datenfeld, nicht als Gedächtnisleistung

**Der Befund.** `Math.floor(rand()*6)*60` steht dreimal in der Projektgeschichte, und jedes
Mal wurde derselbe Fehler neu entdeckt: der Strand zeigt landeinwärts, die Straße endet im
Nichts. Der Kanten-Atlas kann das heute *prüfen* (`auditTileFit()`), aber keine Datenstruktur
*verhindert* es.

**Was fehlt.** Aus dem Kantenstring fällt die Antwort ohne Zusatzmessung heraus: rotiere ihn
zyklisch und zähle, nach wie vielen Schritten er auf sich selbst fällt. `gggggg` hat Periode
1 — sechs freie Drehungen. `sssggg` hat Periode 6 — genau eine richtige Drehung je
Nachbarschaft. Als Feld `symmetry: 1|2|3|6` im Steckbrief, und `rotationLocked = symmetry > 1`.

**Die Regel danach.** Wer eine Kachel mit `symmetry > 1` setzen will, ruft den Löser oder
bekommt eine Ablehnung. Es gibt keinen Pfad, auf dem eine gerichtete Kachel zufällig gedreht
werden kann — das ist billiger als jede weitere Prüfschicht.

---

## 3 · Ein Platzierungslöser mit Vertrag, statt drei Kopien

**Der Befund.** `solveHexTile()` liegt im Kanten-Atlas, `growBand()` im Babel-Turm, das A*
über Höhennachbarn im Baukasten, der Straßenlöser in `hex-grid.js`. Vier Orte, an denen
entschieden wird, welches Teil wohin kommt. Der nächste Slice baut den fünften.

**Was fehlt.** Ein Modul mit genau einem Eingang und drei erlaubten Ausgängen:

```
solve(cell, constraints) → { tile, rotation }        eindeutig
                         → { candidates:[...] }      mehrdeutig, Aufrufer wählt
                         → { fail, reason }          kein Kandidat, ehrlich
```

Der dritte Ausgang ist der wichtige. Bauschritt 4 meldet heute vorbildlich »Teilsechsecke
fehlen« statt etwas Falsches zu setzen — dieses Verhalten gehört in den Löser, nicht in
jeden Aufrufer einzeln.

**Dazu: `auditTileFit()` immer an.** Es prüfte 48 Fugen der Dorfinsel und fand 0 Fehlstellen.
Als Nachprüfung eines Beweisfalls ist es eine Messung; als Dauerprüfung jeder gesetzten
Kachel ist es eine Garantie. Der Unterschied kostet Rechenzeit und spart die dritte Runde
desselben Fehlers.

---

## 4 · Ein Weltdokument mit Rückgängig — sonst bleibt es ein Generator

**Der Befund.** Alle drei Werkzeuge erzeugen Welten aus einem Seed. Keines kann eine Welt
**aufheben**. Der Babel-Editor lässt Bänder verschieben, aber was dabei entsteht, überlebt
den Tab nicht. Ein Baukasten ohne Speicherformat ist ein Würfelbecher.

**Was fehlt.** Schema `kfb.hex-world/1`:

```
{ schema, seed, packs:[{packId, commit}],
  grid:"axial",
  cells:[ { q, r, height, tile, rotation, props:[{key, offset, rot}] } ],
  paths:[...], authoredAt, generatorVersion }
```

Dazu drei Dinge, die zusammengehören: ein Befehls-Stapel für Rückgängig/Wiederholen
(jede Änderung als Befehl, nicht als Zustandskopie), ein **Round-Trip-Test** (laden →
speichern → byteidentisch), und die Pin-Liste der Packs im Dokument. Ohne die Pins beschreibt
eine gespeicherte Welt Teile, die sich unter ihr weggedreht haben.

**Der Nebeneffekt.** Ein Dokumentformat macht die vier Bauvorgaben des Herstellers und die
Dorfinsel zu ladbaren Dateien statt zu Code in `cases.js`. Golden Samples werden damit
Testdaten, nicht Programm.

---

## 5 · Die Fehlteil-Liste als Auftrag, mit prozeduralem Ersatz bis dahin

**Der Befund.** »Teilsechsecke fehlen im Bestand« steht heute in drei READMEs als offener
Punkt. Bauschritt 4 läuft seit vier Runden nicht. Eine Lücke, die nur beschrieben wird,
bleibt liegen.

**Was fehlt, erstens:** eine Datei `MISSING_PARTS.md`, die jedes fehlende Teil mit dem Maß
beschreibt, das es haben müsste — abgeleitet aus dem gemessenen Bestand, nicht geschätzt.
Für das Padding-Teil: halbe Kachelhöhe 0,50, Grundriss als Segment der 2,00 × 2,309-Kachel,
Pivot auf der Sprungkante. Das ist ein Modellierauftrag, den ein Mensch oder ein Einkauf
erfüllen kann. Dazu die Wasserkachel-Regel, die heute nur als Rolle existiert.

**Was fehlt, zweitens:** ein **prozeduraler Lückenfüller**, bis die Teile da sind. Der
Höhensprung zwischen zwei Nachbarzellen ist gemessen bekannt, der Kachelgrundriss auch — eine
vertikale Schürze zwischen beiden Kanten ist Geometrie, kein Kunstwerk. Sie wird als
**erkennbarer Platzhalter** ausgewiesen, in der Materialfarbe der unteren Kachel und im
Bericht gezählt. Das ist dieselbe Regel wie bei der CapsuleCarl-Kapsel: ein gekennzeichneter
Platzhalter ist zulässig, ein stillschweigender Ersatz nicht.

---

## Nicht aufgenommen, aber notiert

Vorschaubilder der 447 Teile backen (der Teile-Bildschirm rendert sie heute live),
`InstancedMesh` für wiederholte Kacheln, und eine Bild-Regression über die Golden Samples.
Alle drei sind Leistungs- und Komfortfragen; die fünf oben sind Struktur.
