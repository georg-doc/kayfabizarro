# World M2A · Performance-/Spielwert-Matrix

Stand: 2026-09-27 · Grundsatz: **Spielbarkeit und Reaktionszeit vor maximaler Detaildichte.**

| Baustein | Kosten | Spielwert im MVP | Entscheidung |
|---|---:|---:|---|
| Durchgehender Fahrboden, Radkontakt, Recovery | niedrig | kritisch | **Behalten und absichern.** Eine Kontaktfläche deckt jetzt die sichtbare 716 × 716-m-Zone ab. |
| Zu-Fuß-/Fahr-/Flugsteuerung und Kamera | niedrig bis mittel | kritisch | **Behalten.** Wenige klare Zustände und kurze Übergänge vor zusätzlichen Bewegungsvarianten. |
| Kernanimationen für Player und Fahrzeug | mittel | hoch | **Behalten, aber begrenzen.** Erst Idle/Walk/Run/Enter/Exit sauber takten; weitere Clips danach. |
| Komplette Stadtgeometrie | war sehr hoch; R3 reduziert auf ca. 185–198 Tsd. Gesamtdreiecke | hoch | **R3-Grundidee behalten.** Nahe Zone voll, Ferne als leichte OSM-Hülle. Noch keine Veröffentlichung. |
| Dynamische Schatten aller Gebäude/Props | im R3-Test nur kleiner Anteil | mittel | **Nicht der nächste Haupthebel.** Abschalten verbesserte Walk-p95 nur von 42,7 auf 41,6 ms. |
| Terrain-Netz | hoch im Authoring, mittel im Spiel | mittel | **Zwei Profile.** Editor 384 Segmente; Runtime aktuell 192 Segmente. |
| Clay-Material und gemeinsame Oberflächenstruktur | zusammen mit Pixelmenge jetzt größter Resthebel | sehr hoch | **Behalten, aber staffeln.** Nahe Flächen volles Relief; Ferne vereinfachtes Clay. Auflösung dynamisch statt pauschal scharf. |
| Boden-/Straßenkarte | hohe Start- und Speicherkosten | hoch | **Runtime 2048 px, Authoring 4096 px.** Bei Bedarf später kachelweise laden. |
| Straßennamen, kleine Props, ferne Details | mittel | niedrig bis mittel | **Nach Entfernung staffeln.** Erst in Spielernähe aktualisieren und zeichnen. |
| Residents/NPC-Menge | mittel bis hoch | hoch, aber nicht für den ersten Fahrloop | **Budgetieren.** Kleine aktive Nachbarschaft, entfernte Bewohner schlafen oder werden vereinfacht. |
| Ink/Postprocessing und zusätzliche Vollbild-Effekte | hoch | aktuell niedrig; Clay ist die Bildsprache | **Im MVP aus.** Nur zurückbringen, wenn ein einzelner Effekt messbar bezahlbar ist. |
| Permanente Dellen, globale Gebäude-Idle-Deformation | sehr hoch | mittel | **Anders übersetzen.** Nur lokal, kurz und ereignisgesteuert; keine weltweite Deformation pro Bild. |
| Video-Billboards und schwere Medien | hoch beim Laden/Decoding | niedrig für den Kernloop | **Auf Interaktion laden, beim Verlassen entladen.** |

## Messbefund

- Ausgangslauf: Bedienung nach ca. **19,6 s**, Frame-Median **59,4 ms**, p95 **360,8 ms**, ca. **1,35 Mio. Dreiecke**, Pixelratio **2,0**.
- R1-Candidate: bester Kaltstart **14,2 s**, ca. **1,13 Mio. Dreiecke**, Pixelratio **1,25**.
- Zu Fuß: p95 **84,4 ms**; Fahrprobe: p95 **89,4 ms**. Ziel **≤ 33,3 ms** ist noch nicht erreicht.
- Interne Zeitmessung: World-, Movement- und UI-Logik bleiben jeweils deutlich unter 1 ms; der eigentliche Renderpfad dominiert mit etwa **46–71 ms pro Bild**.
- Das reine Ausblenden der Stadt senkt die Dreiecke auf ca. **108.000**, aber p95 nur auf **79,7 ms**. Deshalb ist „Stadt einfach löschen“ keine sinnvolle Lösung; benötigt wird ein eigener Render-/LOD-Pass und eine Prüfung der tatsächlichen Grafikbeschleunigung.

## R2/R3 · gemessene Kosten statt Vermutung

- R2 bestätigte echte Metal-Hardwarebeschleunigung auf dem M1 Max. Ein vereinfachter Clay-Shader brachte keinen belastbaren Gewinn und wurde nicht veröffentlicht.
- R3 teilt die Stadt in 96-m-Bereiche. Bis 120 m bleiben die akzeptierten elastischen Gebäude samt Fassade sichtbar; entfernte Bereiche nutzen nur echte OSM-Grundrisse und Quellhöhen. Zwischen 120 und 150 m verhindert eine Umschaltspanne Flackern.
- R3 reduziert die sichtbare Last von ca. **1,13 Mio.** auf ca. **185–198 Tsd. Dreiecke**.
- Isolierte Browserläufe: Idle p95 **43,3 ms**, Walk p95 **42,7 ms**, Drive p95 **43,9 ms**. Gegenüber R1 ist das ungefähr eine Halbierung, aber das Ziel **≤ 33,3 ms** bleibt verfehlt.
- Ohne Stadt: Walk p95 **39,9 ms**. Ohne Schatten: **41,6 ms**. Beide sind nur kleine Resthebel.
- Bei Pixelratio **0,6**: Walk p95 **26,3 ms**. Damit ist der nächste klare Hebel eine adaptive Auflösungs-/Clay-Qualitätsregel, nicht das Löschen weiterer Spielwelt.

## R4/R5 · aktueller bezahlbarer Stand

- R4 hält die vollständige Welt mit City Shell LOD und adaptiver Auflösung im 30-fps-Budget.
- R5 verändert den Renderumfang nicht. Der isolierte Kontrolllauf liegt bei Walk/Drive jeweils **16,8 ms p95**; kurzfristige 33,3/33,4-ms-Quantisierung in belasteten Headless-Läufen entspricht weiterhin dem 30-fps-Raster.
- Der Playability-Gewinn kommt aus früherem Pace-up und sauberem Fahrzeug-Pre-settle, nicht aus dem Entfernen sichtbarer Welt.
- Nächster Performance-Schritt ist kein pauschales Feature-Sterben: erst Georgs freier Test, dann nur den tatsächlich störenden Zustand messen.

## Fassaden-Donor-Regel

Fenster, Türen, Vordächer und Schilder dürfen als echte KayKit-/Tiny-Treats-/Kenney-Quellbauteile isoliert und danach instanziert werden. Erlaubt sind Skalierung, leichte Cartoon-Verformung, Farbvarianten und regelbasierte Fassadenrhythmen. Ein Asset-Link oder selbst gebauter Ersatz ist kein Donor-Beweis. Die Ferne erhält keine Einzelbauteile; nahe Fassaden teilen Geometrie und Material und variieren über Instanzdaten.

## Harte Produktionsregel

Ein teurer Baustein bleibt nur dann im sofortigen MVP, wenn er entweder den Kernloop trägt oder die KFB-Identität sichtbar bestimmt. Alles andere wird begrenzt, nur in Spielernähe aktiviert, vereinfacht dargestellt oder später geladen.
