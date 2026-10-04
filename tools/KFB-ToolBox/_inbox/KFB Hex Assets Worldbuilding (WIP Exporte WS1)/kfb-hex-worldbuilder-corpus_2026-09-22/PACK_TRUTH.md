# PACK_TRUTH — was in den Packs wirklich liegt

Jede Zahl hier ist zur Laufzeit gemessen oder aus dem Registry-Shard gelesen. Keine stammt
aus einer Produktbeschreibung. Wo eine frühere Aussage falsch war, steht sie mit ihrer
Korrektur da — das ist der Sinn des Dokuments.

## Die Packs

| Pack | packId | Assets | Modelle | Format |
|---|---|---:|---:|---|
| KayKit_Medieval_Hexagon_Pack_1.0_FREE | `kaykit-medieval-hexagon-pack-1-0-free` | 240 | 221 | gltf (complete) |
| KayKit Medieval Builder Pack 1.0 | `kaykit-medieval-builder-pack-1-0` | 233 | 226 | glb (embedded) |
| GLB_hexagon_kit *(dritte Linie, siehe unten)* | `glb-hexagon-kit` | 72 | 72 | glb (embedded) |

Wurzel jeweils `media/3D_Assets/<root>` in `georg-doc/kayfabizarro@main`.
**447 Teile** beider KayKit-Packs sind im Kanten-Atlas als Bilderbogen erfasst, nach
16 Familien gruppiert.

## Maße

| Größe | Wert | Herkunft |
|---|---|---|
| Kachelmaß | 2,00 × 2,31 | Laufzeitmessung Hexagon-Pack (`moduleMetrics()`) |
| Terrassenstufe | 1,00 | dieselbe Messung |
| Builder-Hexkacheln | **alle 128** messen 2 × 2,309 | Baukasten, dritte Runde |
| kleinster Hex-Kandidat | `hex_coast_D_waterless` 1 × 1,732 | **kein Teilsechseck** — Seitenverhältnis 1,73 statt 1,15 verrät die halbe Uferkachel |

Das Modulmaß kommt **nur** aus den Kacheln des Hexagon-Packs. Käme es aus dem gemeinsamen
Topf, bestimmten die 128 Builder-Kacheln als Mehrheit das Gitter.

## Kanten

Verfahren: Überdeckungsprobe an fünf Punkten je Fuge, bei 0,92 · Inkreis. Kein Rendern in
der Messkette. Zwei Vorstufen über Nähe waren zu grob (60°-Tortenstück 75,3 %, Fenster um
den Kantenmittelpunkt 89,4 %).

| Aussage | Zahl | Gilt für |
|---|---:|---|
| Eichung, Kanten richtig | 99,5 % | die 32 Hexagon-Kacheln mit bekannter `TILE_EDGES`-Tabelle |
| Eichung, Kacheln vollständig richtig | 96,9 % | dieselben 32 |
| vollständig klassifiziert | 126 von 144 (88 %) | die Kacheln **ohne** bekannte Tabelle |
| teilweise / gar nicht | 17 / 1 | dieselben 144 |

**Zwei Regeln liefen durch dieselbe Eichung, und das Ergebnis war das Gegenteil der
Bauannahme:** A »Geometrie schlägt Farbe« 94,3 %, B »nur Farbe« **99,5 %**. Die Geometrie
ist hier die schlechtere Quelle; Regel A lag bei den Uferkacheln daneben (`sssggg` kam als
`wwwggg` zurück — ein Strand fällt zum Wasser hin ab).

Eine Abweichung bleibt stehen: `hex_coast_A`, Kante 1, eine Farbe ohne geeichte Gruppe. Sie
steht als `?` da, statt erzwungen zu werden.

## Zwei Ausgaben, weil es zwei Fragen sind

`kinds` — sechs Zeichen im Alphabet der bekannten Tabelle (`g`/`s`/`w`/`?`). Nur damit lässt
sich gegen `TILE_EDGES` prüfen.

`classes` — was für **Nachbarschaft** zählt. Builder-Geländesorten, die das
Hexagon-Alphabet per Konstruktion nicht benennen kann, tragen ihre Gruppen-ID:
`hex_forest` = `#3 #3 #3 #3 #3 #3`, `hex_forest_roadA` = `#6 #3 #3 #3 #3 #3`.

## Der Schlüssel ist pack-qualifiziert

`hex_water` gibt es in **beiden** Packs — im Hexagon-Pack dunkelblau, im Builder-Pack
türkis. Beide messen `wwwwww`, beide sind nicht dasselbe Teil. Schlüssel ist `pack|base`,
jeder Eintrag trägt zusätzlich `pack` und `path`. Eine frühere Fassung schlüsselte nach
bloßem Basenamen; einer überschrieb den anderen stillschweigend, und die Eichung zählte
33 Kacheln, wo die Tabelle 32 Einträge hat.

## Das Builder-Pack hat keinen Atlas

Korrigierte Aussage. In README, `github.md` und im Lehren-Bildschirm stand »die beiden Packs
haben verschiedene Atlanten«. Nachgemessen benutzt das Builder-Pack **einfarbige Materialien
ohne `map`** (`hex_forest`: Material `Green`, `#48bc8d`). Seine Geometrie trägt UVs, und
`if (uv && probe)` griff mit der global gesetzten Hexagon-Sonde. Die Sonde hängt jetzt am
Material; fehlt `mat.map`, fällt die Messung auf die Flachfarbe zurück. Es gibt genau
**eine** Sonde, für das Hexagon-Pack.

## Fallstricke beim Laden

| Sache | Befund |
|---|---|
| Doppelte Endung | Builder-Dateien heißen `archeryrange.gltf.glb` — beim Entpacken ergänzt statt ersetzt. Eine einzelne Abschneidung reicht nicht. |
| `github_get_tree` | listet in diesem Repo **keine** `.glb`/`.gltf`. »0 gefunden« heißt nicht »nicht da«. Registry-Shard lesen oder direkt laden. |
| Poly-Pizza-Namen | `Pebble Round by Quaternius - icVsN3lmVy.glb` — Zufalls-ID, nicht ratbar. Verzeichnislisting über die GitHub-Contents-API zur Laufzeit. |
| raw vs. jsDelivr | raw liefert JS als `text/plain`; als Modul geladen ergibt das einen schwarzen Bildschirm. Module über jsDelivr, Daten über raw. |

## Bauteilkunde

**Die Familie entscheidet vor dem Maß.** Im Hexagon-Pack sitzt jedes Gebäude auf einem
Hex-Sockel; die erste Rollenzuordnung fragte zuerst nach dem Grundriss und machte acht Burgen
zu Fußböden.

**Der Hexagon-Kachelsatz hat genau eine ebene Vollkachel** (`hex_grass`) — alles andere ist
Ufer, Fluss, Straße, Kappe oder Schräge. Die Kachelvielfalt liegt im Builder Pack. Deshalb
ist »beide gemischt« die Vorgabe.

**Felsklassen abgeleitet, nicht gesetzt.** Drei Runden lang kamen die Grenzen aus dem Kopf
und waren dreimal falsch. `deriveRockClasses()` sortiert die gemessenen Grundflächen und
sucht echte Lücken (Sprung um mindestens Faktor 2). Findet sie zwei Populationen, heißt das
Ergebnis »zwei Populationen«, und die dritte Regel wird als inaktiv gemeldet.

## Bekannte Lücken im Bestand

- **Teilsechsecke fehlen.** Bauschritt 4 (Padding) läuft deshalb nicht. Gegen den VOLLEN
  Bestand geprüft — auch `tiles/square` (68) und `objects` (30) enthalten keins. Die im
  Promobild gezeigten Padding-Teile sind im ausgelieferten Pack nicht enthalten.
- **Wasserkacheln** haben eine Rolle, aber keine Bauregel.
- **18 von 144 Builder-Kacheln** sind unvollständig klassifiziert.

## Die dritte Linie: GLB_hexagon_kit

72 GLB-Teile, im Projekt nur von `studies/Hex-Worldbench.dc.html` benutzt. Es ist **nicht**
eins der beiden KayKit-Packs, teilt weder Maß noch Atlas noch Kantenkunde mit ihnen und ist
hier nur der Vollständigkeit halber verzeichnet. Wer es einhängen will, misst es neu.
