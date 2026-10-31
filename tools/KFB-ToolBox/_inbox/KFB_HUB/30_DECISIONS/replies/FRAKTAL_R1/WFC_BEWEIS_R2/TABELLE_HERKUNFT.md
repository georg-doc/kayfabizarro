# Tabelle der Kaskade · gemessen oder gesetzt · V-1117

Vollständig in `TABELLE_VOLL.json` (`src/data/worlds/kfb-place-cascade.r3.json` @3f047405). **Gemessen** heißt: `scripts/place/vorlage-mess.mjs` an V-1078 Vorlage 5 (`VORLAGE5_MESSUNG.json`). Das ist ein Bildchat-Bild, also Hinweis und keine Bauanleitung (V-148), und nur eine einzige Vorlage.

## Gemessen

| Wert | Vorlage 5 | Eingang in die Tabelle | Löser, Saat A / B |
|---|---|---|---|
| Kiesel je m² nach Felsrand: 0–0,5 / 0,5–1 / 1–1,5 / 1,5–2 / 2–3 / 3–4 m | 0,99 / 1,16 / 0,68 / 0,57 / 0,19 / 0,05 | Kurve `bezug.kies.fels`, auf Stück und Korn umgerechnet, danach um rund 20 % gesenkt (Spielkosten) | A 0,96 / 0,88 / 0,76 / 0,56 / 0,21 / 0,13 |
| Blumen je m² nach Felsrand | 0,02 / 0,21 / 0,23 / 0,08 / 0,06 / 0,02 | Kurve `bezug.blume.fels` | A 0,09 / 0,20 / 0,18 / 0,15 / 0,08 / 0,03 |
| Gras je m² nach Felsrand | 0,02 / 0,04 / 0,11 / 0,15 / 0,04 / 0,01 | Kurve `bezug.gras.fels` | A 0,08 / 0,05 / 0,13 / 0,16 / 0,08 / 0,06 |
| Einseitigkeit um den Fels (Resultante) | Kies 0,82, Pflanzen 0,86 | `seite.kappa` 3 | Kies 0,83–0,87, Pflanzen 0,81–0,91 |
| Winkel Kies gegen Pflanzen | 93° | `seite.winkel` 1,62 rad | **144–155°, passt nicht** (Nachbarwerte schieben sie weiter auseinander) |
| Nachbarn nah Kies–Gras, Kies–Blume, Gras–Blume | 0,22, 0,27, 1,78 | `stueck.adj` | **nicht vergleichbar erreicht:** Ausgabe trennt stärker, 0–0,04 und 0,3–0,4 (Zählung über alle Stellen) |
| Nachbarn fern dieselben | 0,40, 0,52, 1,33 | `stueck.far` | wie oben |
| Kiesel untereinander nah, fern | 1,43, 1,32 | `korn.adj`, `korn.far` | Ausgabe 2,2–4,2, dichter gehäuft als die Vorlage |
| Abstand der Felsgruppen | Median 9,1 m | `patch.far` fels–fels 0,12, `patch.adj` fels–fels 0 | nicht gemessen, im Bild ähnlich |
| Felsradien | 0,33–1,25 m | Fels 0,7–1,5 m, Brocken 0,33–0,7 m | aus der Tabelle |
| Kieselradien | 0,075–0,16 m | 0,05–0,14 m, untere Grenze gesetzt | aus der Tabelle |
| Freie 4-m-Zellen | 60 % | keine direkte Eingabe | 72–76 %, also ruhiger als die Vorlage |

## Belegt

Fast-Berühren 0,85–1,25 der Radien (V-749).

## Gesetzt

Alle Geländewerte (Hang, Senke, Kuppe, Wasser, Straße), Ufer- und Straßenabstand, Lücke zwischen Felsen, Hangeinfluss auf Seite und Winkel, alles zu Busch, Strunk, Baum, Pilz, Kugel, Krume, Halm, Grasquelle und Blumenquelle, alle Zonen außer Geröll. Blume–Blume und Gras–Gras sind nach dem Spielbild stärker geklumpt als gemessen, weil die gemessenen Werte gleichmäßig gesteckte Blumen ergaben.

## Nicht gemessen

- **Etherington-Tafeln:** Sie liegen nur als Links vor, lokal gibt es kein Bild. Es fließen nur die schon verschriftlichten Zahlen ein.
- **Vorlagen 1–4:** Schrägansichten, nur angesehen. Vorlage 4 zeigt Kies zum Sand und Pflanzen zum Grün; der Bezug zu den Bodenbändern fehlt im Löser, weil die Bänder nur im Shader leben.
