# Post Mortem · Quaternius-Pfadsteine ohne Bauanleitung gesetzt · 2026-10-03

Status: **FAIL (Georg, im Bild)** · Projekt R2D v0 Insel · Datei `KFB_R2D_v0/island.js`

## Was passiert ist
Auf den Gehwegen der Insel stehen Quaternius-Steine. Gesetzt wurde **eine** Datei (`Rock Path Round Small … GMttpOEFKT.glb`) als Trittstein, in festem Abstand entlang einer Linie, erst zu klein, dann einfach größer skaliert. Georgs Befund: die Baulogik der Steine ist nicht verstanden.

## Ursache
Derselbe Fehler wie am 19. und 20.09. (`POSTMORTEM_GOLDEN_SAMPLES_2026-09-20.md`, Bildschirm »Lehren« im Hex-Kanten-Atlas): **aus einem ausgedachten Gebrauch bauen statt aus dem Bestand.**

Das Pack `rocks-pebbles-path-tiles-by-quaternius` (13 Dateien @ 378b209) hat drei erkennbare Gruppen:

| Gruppe | Dateien | vermutete Rolle |
|---|---|---|
| Pebble Round / Pebble Square | 5 | lose Kiesel, Streu am Wegrand |
| Rock Path Round Small / Square Small | 6 | einzelne Trittplatten |
| Rock Path Square Thin / Square Wide | 2 | Wegstücke, die aneinander anschließen |

Diese Rollen sind **vermutet**. Gemessen wurde nichts: weder Grundfläche noch Höhe, noch ob »Thin« und »Wide« Anschlusskanten haben, noch wie das Pack-Vorschaubild sie kombiniert. Die Datei für den Trittstein war die erste im Listing, nicht die passende.

Das war der zweite Verstoß im selben Lauf, denn die Lehre stand schon im Projekt: G1 (Bestand ansehen), G5 (drei Kamerawinkel) und »Golden Samples sind Benchmark, kein Serviervorschlag«.

## Was gebraucht wird (Bauanleitung, vor jedem weiteren Setzen)
1. **Bilderbogen der 13 Teile** in Draufsicht, Dreiviertel- und Seitenansicht, mit gemessener Grundfläche, Höhe und Oberkante.
2. **Drei Klassen festlegen** aus Maß und Form, nicht aus dem Namen: Streu (Kiesel), Trittplatte (Einzelstein), Wegstück (Anschluss).
3. **Kombinationsregeln** wie bei den KayKit-Felsklassen (A zieht B an, B zieht C an): Wegstück bildet den Weg, Trittplatten an Enden und in Lücken, Kiesel nur am Rand und in Ecken, nie auf der Lauffläche.
4. **Ein Golden Sample** (ein Wegstück von 6 m mit Kurve) als Vorlage neben dem Nachbau, Georg nimmt ab.
5. Erst danach in `island.js` einsetzen. Bis dahin bleiben die Gehwege nur Pflasterfarbe.

## Sofortmaßnahme
Keine. Die Steine bleiben sichtbar falsch stehen, bis der Bilderbogen existiert. Kein weiteres Nachskalieren.

## Für `use-what-works_v1.md` (Vorschlag)
Anti-Pattern **»Erste Datei im Listing«**: Aus einem Pack wird die erste passende Datei genommen und als Stellvertreter der ganzen Familie eingesetzt. Gegenmittel: Bilderbogen und Klassen vor dem ersten Setzen.
