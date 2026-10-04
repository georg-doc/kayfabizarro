# Additiver Changelog · alle Fehler dieses Sprints, mit Maßnahme

**Zeitraum** 18.–20.09.2026 · **Additiv** — nichts wird umgeschrieben, damit die Historie
sauberer aussieht. Reihenfolge chronologisch. Jeder Eintrag: **was behauptet · was war ·
wer fand es · welche Maßnahme greift.**

Maßnahmen-Kürzel: `G1`–`G7` aus `POSTMORTEM_GOLDEN_SAMPLES_2026-09-20.md` ·
`M1`–`M6` aus `META_ANALYSIS_FAIL_PATTERNS.md` · `R1`–`R7` aus
`skills/session-entry-use-what-works_v1.md`

---

## 18.09. · Platformer POC

**F01 · Treppe gekachelt, die keine Kachel ist**
Behauptet: ein Verbinder steht. Tatsächlich: `Stairs_Modular_*` ist ein Satz aus Start ·
Middle · End; gekachelt wurde nur Middle, die Geländer endeten offen.
Gefunden: **Georg, im Bild.** → `G1` (Bilderbogen), `M4` (Rolle je Teil)

---

## 19.09. · Free Roam v1

**F02 · Inselkomposition als Formel**
Behauptet: sieben komponierte Inseln mit Erzählbögen (`beat`-Sätze im Code). Tatsächlich:
`diorama.js` ist eine Layout-Formel — *»kein Objekt steht dort, weil es dort stehen soll«*
(Georgs Urteil, `FAIL_ISLANDS.md`).
Gefunden: **Georg, im Bild.** → `M2`, `M3` — **dieser Fehler wiederholt sich als F14**

**F03 · Falsche Aussage über ein Pack**
Behauptet: »Quaternius Rocks + Pebbles + Path Tiles liegt NICHT auf main«, alle Schreibweisen
geprüft, durchgängig 404. Tatsächlich: das Pack lag auf main; `github_get_tree` listet in
diesem Repo keine `.gltf`/`.glb`, und die üblichen Markerdateien fehlten hier.
Gefunden: **Georg, mit zwei Links.** → `G2` (Negativbefund ist ein Gate)

---

## 19.09. · Babel Hex Generator v1

**F04 · Sprungweite als Bauvorgabe statt als Schranke**
Behauptet: ein Turm. Tatsächlich: eine flache Wolke — Lücke aus der vollen Reichweite
gerechnet (7,8 = 3,9 Kacheln).
Gefunden: **Georg, im Bild.** → `M1`-Denkweise: die Prüfung maß Erreichbarkeit, nicht Gestalt

**F05 · Mindestabstand aus Band-Radien**
Behauptet: alle Stufen erreichbar. Tatsächlich: neun von zwanzig Saaten mit zu weiter Stufe —
ein Band mit langem Arm schob die zugewandten Kanten auseinander.
Gefunden: eigene Messung. → korrigiert (Projektion in Sprungrichtung)

**F06 · Luftsteuerung während des gerechneten Bogens**
Behauptet: Chill & Fun landet garantiert. Tatsächlich: `approach` zog die Horizontal-
geschwindigkeit gegen null, der geprüfte Sprung kam gemessen zu kurz.
Gefunden: eigene Messung. → korrigiert

**F07 · Jedes braune Band auf grünem Sockel**
Die Fülllage griff `kit.modules[0]` statt der Grundkachel des gewählten Bioms.
Gefunden: **Georg, im Bild.** → `G1`

**F08 · Kacheln zufällig gedreht**
Behauptet: ein lesbarer Turm. Tatsächlich: `Math.floor(rand()*6)*60` auf **gerichteten**
Kacheln — Küstenlinien und Strände mitten in der Fläche, landeinwärts zeigend. `TILE_EDGES`
aus `hex-grid.js` wurde nirgends gelesen, obwohl der Brief es als Kanten-Donor nennt.
Gefunden: **Georg, im Bild.** → BT1 (Kanten-Atlas), `R1`

**F09 · Bänder aus einem Random Walk**
`growBand()`: zufällige Zelle, zufälliger Nachbar. Derselbe Fehlertyp wie F02.
Gefunden: **Georg.** → `M2`, `M3`

**F10 · BT2 übersprungen**
Der Brief verlangt drei Modulbeweise **vor** dem Generator. Gebaut wurde der Generator.
→ `M5` (ein Slice ist fertig oder nicht geliefert)

---

## 20.09. · Hex-Kanten-Atlas · BT1

**F11 · Eine Atlas-Sonde für beide Packs**
Behauptet: 99,5 % Kantenquote (korrekt — aber nur für 32 bereits bekannte Kacheln).
Tatsächlich: `hex_forest` kam als `wwwwww` zurück, sechs Wasserkanten für eine sattgrüne
Kachel.
Gefunden: Prüfer. → `G6`

**F11b · Die Ursache von F11 war ebenfalls falsch — und stand in drei Dokumenten**
Behauptet: »die beiden Packs haben verschiedene Atlanten«. Tatsächlich: das Builder-Pack hat
**gar keinen** Atlas, es benutzt einfarbige Materialien ohne `map`; seine Geometrie trägt aber
UVs, deshalb griff `if (uv && probe)` mit der global gesetzten Hexagon-Sonde.
Gefunden: Prüfer. → `G2` — *eine plausible, ungemessene Ursache ist auch eine Behauptung*

**F12 · Zuordnung weggeworfen und dann geraten**
`lookup()` machte ein unbegrenztes Nächster-Nachbar über 32 Farbgruppen, ließ aber nur die 4
geeichten als Antwort zu. Waldgrün rastete auf »Wasser«. Dabei **ist** jede Sektorprobe
Mitglied ihrer Gruppe.
Gefunden: Prüfer. → `G3`

**F13 · Fix gemeldet, der ein Leerlauf war**
Behauptet: »Geschlüsselt wird jetzt auf die Bildquelle.« Tatsächlich: GLTFLoader decodiert zu
`ImageBitmap` (kein `src`, kein `currentSrc`), der Schlüssel fiel still auf die alte uuid
zurück, die Seite zeigte unverändert »60«. `github.md` führte den Fix als erledigt.
Gefunden: Prüfer. → `G6`, `R3`, `R6`

**F13b · Export nach Basename geschlüsselt**
`hex_water` existiert in beiden Packs; einer überschrieb den anderen stillschweigend, und die
Eichung zählte 33 Kacheln, wo die Tabelle 32 Einträge hat. Der Brief verbietet das
stillschweigende Gleichsetzen der Packfamilien ausdrücklich.
Gefunden: Prüfer. → Schlüssel `pack|base`

---

## 20.09. · Bauvorgaben · BT2, Runde 1

**F14 · Vokabelsuche, fünffach**

| Behauptet | Tatsächlich |
|---|---|
| »Kein Teilsechseck im Bestand — Verdacht widerlegt« | `hill_single_A/B/C`, `hills_A` in `decoration/nature` — genau die Teile aus dem Vorlagenbild |
| »Keine Feldkachel im Hexagon-Pack« | `building_grain`, flacher Auflieger 1,87 × 2,09 × 0,39 |
| »Kein Wohnhaus im Hexagon-Pack« | `building_home_*` — Pack ordnet nach **Dachfarbe** |
| Höhensprünge nicht überbrückbar | `hex_grass_sloped_low/high` in `tiles/base` |
| Deko = vier Einzelbäume, fünf Einzelsteine, Zufallswinkel | `detail_forestA/B`, `detail_rocks_small` — **fertige Gruppen**, Rule of Three im Teil. Meine Streu fing zusätzlich einen **Zaun** ein |

Gefunden: **Georg (2), Prüfer (2), ich selbst nach Einführung von G1 (1).**
→ `G1`, `G2`, `G3`, `G7` · Post Mortem 03

**F15 · Brücke ohne Bezug**
`bridge` misst 2 × 0,744 × 0,777 — genau eine Kachelbreite, ihr Ort ist damit **bestimmt**,
nicht wählbar. Gesetzt wurde sie irgendwohin, mit einem Winkel aus dem letzten Straßenglied.
Gefunden: **Georg.** → `G7`

---

## 20.09. · Bauvorgaben · BT2, Runde 2 — Abbruch

**F16 · Durchdringung** — das Haus steckt im Felsen. Zwei Objekte an derselben Koordinate,
ohne Prüfung. → **`M1`**

**F17 · Kein Bodenkontakt** — Bäume stehen in der Luft. Cluster auf die Höhe der Terrasse
gesetzt, in der die Zelle *aufgelistet* ist, nicht auf die, auf der die Kachel *liegt*. →
**`M1`**

**F18 · Falsche Gebäude** — `building(stock, 'home')` nimmt das erste Haus mit blauem Dach.
Welches Haus die Vorlage zeigt, wurde nie gefragt. → `G1` weitergeführt, `M4`

**F19 · Steinstufe und Steinbasis nicht eingesetzt** — Teile der Vorlage nicht identifiziert.
→ `M4`

**F20 · Die Vorgartensituation fehlt** — das Zwischenteil mit der Steintreppe, von Georg als
**zentraler Punkt der Bauanleitung** benannt, kommt im Nachbau nicht vor. → **`M4`** (Relation
statt Maß)

**F21 · Kein Micro-Storytelling** — Gebäude ohne sozialen Zusammenhang, Windmühle ohne Anlass
mitten im Kornfeld, Brücke ohne Ziel. Objekte an Koordinaten statt eines Netzes von Bezügen.
→ **`M2`, `M3`** — *Wiederholung von F02, drei Tage später*

**F22 · Grüne Zahlen neben kaputter Szene** — »54 Fugen, 0 Fehlstellen«, »8 Gebäude«,
»6 Ausgleichsteile«: jede Zahl richtig, keine betraf den Fehler. → **`M1`**, Ursache `U2` der
Meta-Analyse

---

## Zählung

| | |
|---|---|
| Fehler gesamt | **24** (F01–F22 mit F11b, F13b) |
| davon von Georg im Bild gefunden | **11** |
| davon vom Prüfer gefunden | **6** |
| davon von einer eigenen Messung gefunden | **4** — alle im Bereich Sprungmechanik, keiner im Bereich Gestalt |
| davon von mir selbst nach Einführung von G1 | **1** |
| falsche Aussagen über den Bestand, die in die Dokumentation gelangten | **4** (F03, F11b, F14×2) |
| Slices mit Abnahme durch Georg | **0** |

---

## Die zwei Zahlen, auf die es ankommt

**Vier** eigene Messungen fanden Fehler — alle in der Sprungmechanik, wo eine Formel gegen
eine andere Formel geprüft wird. **Null** eigene Messungen fanden einen Gestaltfehler.

**Null** Slices haben Abnahme. Fünf Artefakte stehen nebeneinander, keines fertig.
