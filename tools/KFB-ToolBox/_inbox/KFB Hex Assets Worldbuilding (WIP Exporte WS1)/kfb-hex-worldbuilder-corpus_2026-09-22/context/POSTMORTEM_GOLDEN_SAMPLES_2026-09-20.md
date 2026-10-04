# Post Mortem · Golden Samples sind kein Serviervorschlag

**Datum** 20.09.2026 · **Sprint** KFB Hex-Kanten-Atlas S1 (BT1/BT2)
**Anlass** Sechs Runden derselbe Fehler, zweimal von Georg gefunden, dreimal vom Prüfer,
einmal — nach Einführung der Guardrails — von mir selbst.
**Gilt zusammen mit** `skills/session-entry-use-what-works_v1.md` — dieses Dokument ergänzt
dort zwei Anti-Patterns und sieben Guardrails. Es ersetzt den Skill nicht, es schärft ihn.

---

## Der Satz, um den es geht

> **Ich baue aus Namensmustern, die ich mir ausdenke, statt aus dem Bestand.**

Das ist keine Ungenauigkeit und kein Flüchtigkeitsfehler. Es ist eine **Arbeitsweise**, und sie
ist ein Anti-Pattern. Sie darf **niemals** die Standardvorgehensweise sein — weder als
Abkürzung, wenn die Zeit knapp ist, noch als erster Anlauf, der später verfeinert wird. Sie
erzeugt Ergebnisse, die aussehen wie Arbeit, und Berichte, die aussehen wie Befunde.

Der Schaden ist nicht der falsche Baum an der falschen Stelle. Der Schaden ist, dass der
Bericht daneben **eine Aussage über den Bestand macht, die falsch ist** — und dass diese
Aussage in die Dokumentation wandert, wo der nächste Chat sie als Tatsache liest.

---

## Was passiert ist

Fünf Wiederholungen desselben Musters in einem Sprint. Jede wurde einzeln repariert, keine an
der Wurzel.

| # | Gefunden von | Was ich behauptete | Was tatsächlich im Pack liegt |
|---|---|---|---|
| 1 | Prüfer | `hex_forest` hat sechs Wasserkanten | Eine sattgrüne Kachel. Ich maß sie gegen den **Atlas des anderen Packs** — eine Sonde für beide. |
| 2 | Prüfer | 28 Farbgruppen sind »unbekannt« | Es sind die Geländeklassen des Builder-Packs. `lookup()` ließ nur die 4 geeichten Gruppen als Antwort zu und rastete Waldgrün auf »Wasser«. |
| 3 | Prüfer | »Keine Feldkachel im Hexagon-Pack« | `building_grain`, 1,87 × 2,09 × **0,39** — ein flacher Auflieger. Im Pack unter `building_*`, weil das Pack keine Kategorie »Auflieger« kennt. |
| 4 | **Georg** | »Kein Teilsechseck im Bestand — der Verdacht ist gegen den VOLLEN Bestand geprüft und widerlegt« | `hill_single_A/B/C` und `hills_A` in `decoration/nature`: gelbe Oberseite, rotbrauner Erdrand, 0,31–0,79 hoch, teils mit Steinen. **Exakt die Teile aus dem Vorlagenbild.** Dazu `hex_grass_sloped_low/high` in `tiles/base`. |
| 5 | **Georg** | Deko = vier Einzelbäume und fünf Einzelsteine, per Zufallswinkel verteilt | `detail_forestA/B`, `detail_hill`, `detail_rocks_small` — **fertige Gruppen**. Die Rule of Three ist im Teil modelliert. Meine Streu fing zusätzlich einen **Zaun** ein. |
| 6 | *ich selbst, nach G1* | »Kein Wohnhaus im Hexagon-Pack gefunden« | `building_home_A_red`, 0,79 × 0,85 × 0,93. Mein `/^house/i` traf nichts, weil die Gebäude `building_home_*` heißen. **Erst der Bilderbogen hat es gezeigt** — und dabei eine Bauregel mitgeliefert, die kein Namensmuster hergibt: das Pack ordnet Gebäude nach **Dachfarbe** (`buildings/red\|blue\|green\|yellow\|neutral`), und beide Vorlagen zeigen durchgehend blau. Eine Siedlung, eine Farbe. |

Dazu zwei Folgefehler derselben Haltung:

- **Die Brücke endete im Wasser.** `bridge` misst 2 × 0,744 × 0,777 — genau eine Kachelbreite.
  Ihr Ort ist damit **nicht wählbar**, sondern bestimmt: die Zelle, in der die Straße den Fluss
  kreuzt. Ich habe sie irgendwohin gesetzt, mit einem Winkel aus dem letzten Straßenglied.
- **Ein Fix, der ein Leerlauf war, wurde als behoben gemeldet.** Der Atlas-Sondenschlüssel
  sollte auf `texture.image.src` gehen; GLTFLoader decodiert zu `ImageBitmap`, das weder `src`
  noch `currentSrc` hat. Der Schlüssel fiel still auf die alte uuid zurück, die Seite zeigte
  weiter »60«, und `github.md` führte den Fix als erledigt. Das ist **Regel 3 und Regel 6** aus
  `use-what-works`, gebrochen in einem Satz.

### Die Kosten

Fünf Baurunden, drei Prüferberichte, zwei Zurückweisungen durch Georg. Der eigentliche Preis
ist nicht die Zeit — es ist, dass vier Behauptungen über den Bestand in README und `github.md`
standen, die falsch waren, und dass eine davon (»das Pack liefert die Padding-Teile nicht«)
den nächsten Chat aktiv in die Irre geführt hätte.

---

## Warum es so hartnäckig war

**Erstens: ein Teilerfolg hat den Rest verdeckt.** Die Eichung gegen `TILE_EDGES` traf 99,5 %.
Diese Zahl war die ganze Zeit korrekt — sie gilt nur für die 32 Kacheln, die schon eine Tabelle
hatten. Genau der Teil, für den das Werkzeug gebaut wurde (die 144 ungedeckten Kacheln), war
ungeprüft. Eine gute Zahl an der falschen Stelle ist gefährlicher als gar keine.

**Zweitens — und das ist der eigentliche Befund: ich hatte die Lehre aufgeschrieben und sie
danach dreimal gebrochen.** Der Atlas hat einen Bildschirm »Lehren«. Dort stand, während ich
Fehler 3, 4 und 5 baute:

> *»Schwellen aus dem Kopf teilen keinen Bestand«* — Lehre 04
> *»Die Familie entscheidet vor dem Maß«* — Lehre 09

Beide beschreiben exakt das, was ich dann tat. **Eine Lehre aufzuschreiben schützt nicht davor,
sie zu brechen.** Deshalb sind die Guardrails unten keine Vorsätze, sondern Gates: Schritte, die
stattfinden oder nicht stattfinden, und deren Ausbleiben sichtbar ist.

**Drittens: das Golden Sample wurde als Illustration gelesen.** Ich habe das Vorlagenbild
angeschaut wie ein Werbebild — »so ungefähr soll es aussehen« — und dann aus dem Gedächtnis
gebaut. Es ist aber eine **Bauanleitung mit Teileliste**: jedes Objekt darin existiert als
Datei, und seine Lage im Bild sagt, wie es zu setzen ist.

---

## Die zwei neuen Anti-Patterns

Zur Aufnahme in die Tabelle von `use-what-works_v1.md`:

| Anti-Pattern | Diagnose | Guardrail |
|---|---|---|
| **Vokabelsuche** | Im Bestand nach einem Namen gesucht, den ich mir ausgedacht habe (`/^hex_(farm\|field\|wheat)/`, `/^tree_/`) — und das Nichtfinden als **Befund über den Bestand** gemeldet. | G1–G3 |
| **Serviervorschlag-Irrtum** | Ein Golden Sample als Stimmungsbild behandelt statt als Bauanleitung: angesehen, nicht zerlegt; aus dem Gedächtnis nachgebaut statt Teil für Teil identifiziert. | G4–G6 |

Beide sind Varianten von **Regel 2** (»ein nachgerechnetes Verfahren ist ein NEUES Verfahren«),
eine Ebene tiefer: nicht das Verfahren wird nacherfunden, sondern der **Bestand**.

---

## Guardrails

Sieben Gates. Jedes ist ein Schritt, der stattfindet oder nicht — kein Vorsatz, den man
nachträglich behaupten kann.

### G1 · Bestandsansicht vor Bestandsaussage

**Bevor eine Zeile Code den Bestand durchsucht, liegt der Bestand als Bilderbogen vor:** jedes
Teil gerendert, mit Pack, Familie und gemessenen Maßen, nach Familie gruppiert.

Nicht die Dateiliste. Nicht der Registry-Shard. **Bilder.** Ein Name sagt nicht, dass
`hill_single_B` ein Höhenausgleich mit Erdrand ist; das Bild sagt es in einer Sekunde.

*Prüfbar: der Bilderbogen existiert als Bildschirm oder Screenshot-Serie, und im Bericht steht,
welche Familien angesehen wurden.*

### G2 · Ein Negativbefund über ein Pack ist ein Gate, kein Ergebnis

Die Sätze »X gibt es nicht«, »das Pack liefert kein Y«, »der Verdacht ist widerlegt« sind
**gesperrt**, solange nicht beides vorliegt:

1. der volle Bestand als Bild (G1), **und**
2. eine Suche nach **Maß und Form**, nicht nach Namen (G3).

Ein Negativbefund, der nur auf einem Namensmuster beruht, ist keine Aussage über das Pack,
sondern über mein Vokabular. Er geht nie in README, `github.md` oder einen Bericht.

*Verletzt in Runde 3 und 4. Beide Male stand die falsche Aussage bereits in der Dokumentation.*

### G3 · Nach Maß, Rolle und Familie suchen — Vokabel zuletzt

Reihenfolge beim Auffinden eines Teils:

1. **Familie** — was sagt die Ordnung des Packs? (`tiles/base`, `decoration/nature`, `objects`)
2. **Maß** — Grundfläche, Höhe, Seitenverhältnis gegen das Modulmaß
3. **Rolle** — trägt es, liegt es auf, steht es darauf?
4. **Name** — erst jetzt, und nur zur Bestätigung

`building_grain` war über den Namen nicht zu finden und über das Maß sofort: kachelgroß,
0,39 hoch, also eine Bodendecke. `hill_single_B` genauso: kleiner als eine Kachel, 0,42 hoch,
Erdrand — ein Höhenausgleich.

*Umgekehrt gilt: ein Namensmuster, das etwas findet, ist kein Beweis, dass es nichts anderes
gibt. `/^tree_/` fand Bäume und übersah, dass das Pack Baumgruppen liefert.*

### G4 · Golden Samples werden reverse-engineert, nicht betrachtet

**Jedes Sample von KayKit, Tiny Treats, Kenney und Konsorten ist ein Benchmark.** Ziel ist der
**1:1-Nachbau mit den vorhandenen Assets** — nicht »etwas in dieser Richtung«.

Das Verfahren, verbindlich, vor dem ersten Bauteil:

1. **Sample in Arbeitsgröße öffnen** und in mindestens **drei aussagekräftigen Kamerawinkeln**
   ansehen: Draufsicht (Grundriss, Zellraster), Dreiviertel (Komposition, Gruppen),
   **Seitenansicht** (Höhenstufen, Auflieger, was worauf steht). Ein Winkel zeigt nie, was ein
   Teil ist — die Seitenansicht hätte den flachen `building_grain`-Auflieger sofort verraten.
2. **Teileliste schriftlich**, Objekt für Objekt: was ist das, in welcher Familie liegt es,
   welches Maß hat es. Kein »ein Baum« — `detail_forestA`, `decoration/objects`, 1,84 × 1,18 × 0,73.
3. **Q&A-Loop nach `use-what-works`**, ins Dokument, bevor gebaut wird:

```
[Q] Womit ist der Boden dieser Zelle gebaut?
[A] hex_grass · tiles/base · 2 × 2.309 × 1
[Q] Die Felder oben rechts sind gelb-gepunktet — eigene Kachel?
[A] Nein. building_grain · buildings · 1.874 × 2.094 × 0.394 — flach, liegt AUF hex_grass
[Q] Die drei Bäume mit Steinen am Fuß — Einzelteile?
[A] Nein. detail_forestA · objects · eine Gruppe, Rule of Three ist im Teil
[Q] Wie breit ist die Brücke im Verhältnis zur Zelle?
[A] bridge · 2 × 0.744 × 0.777 — exakt eine Kachelbreite, überspannt GENAU eine Zelle
```

4. **Erst dann bauen.**

*Stehen die Q&A-Zeilen nicht, bevor gebaut wird, ist das Sample nicht verstanden, sondern
angeschaut.*

### G5 · Der Nachbau wird gegen das Sample gestellt, aus denselben Winkeln

Vorlage und Nachbau **nebeneinander**, in denselben drei Kamerawinkeln wie G4. Nicht der
Nachbau allein, nicht eine Prozentzahl daneben.

Was verglichen wird, in dieser Reihenfolge: **Grundriss** (stimmen Zellen und Formen?) ·
**Höhenaufbau** (was steht auf welcher Stufe?) · **Gruppen** (wo das Sample eine Dreiergruppe
zeigt, steht keine Streu) · **Einzelteile** (ist es dasselbe Modell?).

*Runde 5 wäre hier aufgefallen: die Vorlage zeigt drei Bäume in einer Gruppe mit Steinen am
Fuß, mein Nachbau einen Baum, einen Zaun und verteilte Kiesel.*

### G6 · Kein »behoben« ohne die Zahl oder das Bild, das sich geändert hat

Übernahme von Regel 3 und 6 aus `use-what-works`, hier verschärft: Wenn ein Fix eine **Kennzahl
auf der Seite** betrifft, wird diese Zahl **vor und nach** dem Fix genannt. »Geschlüsselt wird
jetzt auf die Bildquelle« ohne den Blick auf die Anzeige war ein Leerlauf, der als Erfolg in die
Dokumentation ging — die Seite zeigte unverändert »60«.

*Praktisch: Fix → Seite neu laden → die betroffene Zeile ablesen → erst dann melden.*

### G7 · Was das Pack fertig liefert, wird nicht selbst zusammengesetzt

Liefert das Pack eine **Gruppe** (`detail_forestA`), wird sie gesetzt — kein eigenes Verteilen
von Einzelteilen über Winkel und Radius. Liefert es einen **Auflieger** (`building_grain`), wird
er aufgelegt — keine Ersatzkachel. Liefert es ein Teil, dessen **Maß genau eine Zelle
überspannt** (`bridge`), ist sein Ort **bestimmt**, nicht wählbar.

Die Komposition steckt im Teil. Wer sie nachbaut, ersetzt eine gestaltete Gruppe durch eine
zufällige — und genau so sieht es dann aus.

---

## Zusammenspiel mit `use-what-works_v1.md`

Dieses Dokument ist **immer gemeinsam** mit dem Skill anzuwenden. Die Zuordnung:

| Guardrail | verschärft Regel |
|---|---|
| G1, G2, G3 | **R2** — nicht das Verfahren nacherfinden, hier: nicht den Bestand nacherfinden |
| G4 | **Q&A-Loop** — die Fragen VOR dem Bauen, hier aus dem Bild statt aus dem Code |
| G5, G6 | **R3** — erst sehen, dann melden · **R6** — Beweis durch die Ausgabe der Quelle |
| G7 | **R1** — eine Theorie schlägt keine Vorlage, die funktioniert |

Und die kürzeste Fassung, für den Fall, dass ein Satz hängen bleibt — als Ergänzung zu
»Nimm, was läuft. Zeig das Bild. Sag, was anders ist«:

> **Sieh dir an, was da ist, bevor du sagst, was fehlt.**

---

## Was richtig war, damit die Liste ehrlich bleibt

- Die Eichung gegen `TILE_EDGES` war die richtige Konstruktion: ein Prüfwerkzeug vor dem
  Gegenstand, geeicht an einer bekannten Wahrheit, mit ausgewiesenem FAIL bei 75,3 % im ersten
  Anlauf. Sie hat die Kantenmessung durch drei Fassungen getragen.
- Zwei Regeln (Geometrie gegen Farbe) durch dieselbe Eichung zu fahren und **beide Quoten** zu
  zeigen, statt die bevorzugte zu wählen, war richtig — und das Ergebnis war das Gegenteil
  meiner Annahme.
- Die getrennte Berichterstattung (Eichquote für 32 bekannte Kacheln · Abdeckung für 144
  ungedeckte) kam auf Zuruf des Prüfers, ist aber jetzt die Form, in der solche Zahlen stehen
  müssen.
- `hex-grid.js` wurde durchgängig **benutzt und nicht nachgebaut** (`buildNetwork`,
  `solveHexTile`, `auditTileFit`, `rotDeg`). Die Dorfinsel schloss mit 54 geprüften Fugen und
  0 Fehlstellen.

---

## Offen

- Die vier Bauvorgaben sind nach G1–G7 neu gebaut und stehen in drei Winkeln neben der
  Vorlage. **Georgs Urteil steht aus** — der 1:1-Abgleich ist seine Entscheidung, nicht meine.
- Die Vorlage der Dorfinsel zeigt Mauern entlang der Felder und einen dichteren Wald als der
  Nachbau. Das ist eine bekannte Abweichung, keine Behauptung über den Bestand — die Teile
  dafür liegen im Bilderbogen und sind identifiziert.

## Was G1–G7 im selben Sprint schon eingebracht haben

Die Guardrails wurden nach Fehler 5 angewandt, nicht erst danach dokumentiert:

- **G1 (Bilderbogen)** hat Fehler 6 gefunden, bevor Georg ihn finden musste — und mit ihm die
  Dachfarb-Regel, die aus keinem Namen und keinem Maß hervorgeht.
- **G1** hat außerdem `hill_single_*`/`hills_*` und `hex_grass_sloped_low/high` sichtbar
  gemacht: der Negativbefund aus Fehler 4 war damit in einer Minute widerlegt.
- **G7** hat die Baumstreu durch `detail_forest*` ersetzt — 4 statt 11 Teile, und die Gruppe
  sitzt, statt zu liegen.
- **G5** hat in der Seitenansicht gezeigt, was die Dreiviertelsicht verdeckte.
- **G3** hat die Vokabelliste `home|market|blacksmith` durch eine Bestandsabfrage ersetzt
  (alle Gebäude der Dachfarbe unter 1,6 Höhe, ohne Wehrbauten): aus 2 gefundenen wurden 8.

---

*Zur Ablage bei WSA. Bei Wiederholung eines der beiden Anti-Patterns: dieses Dokument und
`use-what-works_v1.md` neu laden, Guardrail-Nummer benennen, zurücksetzen.*
