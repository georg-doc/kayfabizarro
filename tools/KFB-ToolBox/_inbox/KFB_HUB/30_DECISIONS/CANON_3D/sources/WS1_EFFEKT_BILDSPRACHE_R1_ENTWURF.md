# KFB Effekt-Bildsprache · R1 · Entwurf · 21.10.2026

Für Georg und WS0. Auftrag Georg 21.10.: „eine gemeinsame Bildsprache für Effekte, die zum Terrain passt“ (Speedlines wie tinyskies, Düse von hinten, Rauchwölkchen wirken nur, wenn sie sich überlagern). Status: Entwurf aus dem Stand der Gelände-Probe; nichts davon ist Kanon.

## 1 · Kurzfassung
Effekte sprechen dieselbe Sprache wie Gelände, Himmel und Wolken: **harte Fläche plus weicher Verlauf, additiv** (Ferne R1, Prinzip Georg). Formen sind **durchgehende Kurven und geschlossene Kuppeln**, nie lose Punktwolken. Farben kommen **aus der Szene** (Licht-/Schattenton des Himmels `uLit/uShade`, Biom-Palette, Sonnenfarbe), Leuchten nur dort, wo eine Ursache leuchtet (Düse, Säure, Lampe – V-572). Bewegung folgt der Knete: Wachsen, Stauchen, Nachschwingen, Platzen – kein lineares Ein-/Ausblenden.

## 2 · Fünf Regeln
1. **Form:** Linien als durchgehende Bänder (Speedlines, Kondensstreifen, Kielwelle), Masse als Kuppeln mit flacher Unterseite (Wolken, Staub, Rauch, Blasen). Keine Einzelscheiben, die erst in der Überlagerung eine Form ergeben.
2. **Ton:** zwei harte Töne (Licht/Schatten aus einer Hüllen-Normale) plus dunklerer Saum wie die Kuppelwolken; Verlauf nur für Licht (Glühen, Sonnenhof, Silberrand, Leuchten).
3. **Farbe:** aus der Szene, nicht frei: Staub = Bodenfarbe unter dem Fahrzeug (wie `terrainDustColor` im Spiel), Rauch = `uShade`, Linien = `uLit` → Weiß, Funken = Sonnenfarbe, Fluide aus ihrem Parametersatz.
4. **Bewegung:** Knet-Kurven (Wachsen 0→1 mit Überschwingen, Zittern vor dem Platzen, Platzen als Ring), Weltfest wo es physisch ist (Spuren, Staub), am Fahrzeug wo es Antrieb ist (Düse).
5. **Sichtbarkeit aus jeder Richtung:** Jeder Antriebseffekt braucht eine Ansicht von hinten (Glühen zur Kamera), von der Seite (Kegel) und von oben (Bodenlicht/Staubring).

## 3 · Bestand in der Probe und Abgleich
| Effekt | Stand 21.10. | Regel erfüllt? | Nächster Schritt |
|---|---|---|---|
| Speedlines | durchgehende Bänder von den Heckkanten, laufen spitz aus, vor der Kamera ausgeblendet | ja (1, 3) | Breite an Tempo koppeln; in Kurven außen länger |
| Düse | Kegel + Kern + Glühen zur Kamera (von hinten am stärksten), flackert | ja (5) | Stoß-Ringe bei Boost (Knet-Ring, Regel 4) |
| Kondensstreifen (Flug) | Punktwolke aus Scheiben | **nein** (1) | durch Bänder ersetzen (wie Speedlines, weicher, länger) – vorläufig abgeschaltet |
| Wolken | Kuppelwolken + Wolkenkörper (Stufe 1) | ja (1, 2) | Wolkenschatten am Boden (günstig, WOLKEN_R1) |
| Fluide | Schaumringe, Blasen (Wachsen/Zittern/Platzen), Säure-Leuchten | ja (2, 4) | Kielwelle des Racers (WASSER_R1 Stufe 3) |
| Lichtpfützen | kfb-light-pool.v1 (V-572) | ja | – |
| Staub beim Fahren | fehlt in der Probe (Spiel: racerRig-Staub) | – | als Kuppel-Puffs in Bodenfarbe, die wachsen und sinken, aus dem Spiel übernehmen |
| Landung / Aufprall | fehlt in der Probe (Spiel: Deformer-Ereignisse) | – | Staubring als Knet-Ring + Squash (Ereignisse aus k2t sind schon da) |

## 4 · Offene Fragen an Georg/WS0
1. Sollen Speedlines nur Tempo zeigen (wie tinyskies) oder auch Boost/Drift farbig unterscheiden?
2. Kondensstreifen ganz durch Bänder ersetzen oder als zweite, weichere Linie behalten?
3. Ein gemeinsames Effekt-Modul für Probe und Spiel (wie kfb-light-pool) – Name `kfb-vfx.v1`?
