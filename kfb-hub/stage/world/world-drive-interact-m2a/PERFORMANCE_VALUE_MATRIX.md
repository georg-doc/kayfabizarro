# World M2A · Performance-/Spielwert-Matrix

Stand: 2026-09-27 · Grundsatz: **Spielbarkeit und Reaktionszeit vor maximaler Detaildichte.**

| Baustein | Kosten | Spielwert im MVP | Entscheidung |
|---|---:|---:|---|
| Durchgehender Fahrboden, Radkontakt, Recovery | niedrig | kritisch | **Behalten und absichern.** Eine Kontaktfläche deckt jetzt die sichtbare 716 × 716-m-Zone ab. |
| Zu-Fuß-/Fahr-/Flugsteuerung und Kamera | niedrig bis mittel | kritisch | **Behalten.** Wenige klare Zustände und kurze Übergänge vor zusätzlichen Bewegungsvarianten. |
| Kernanimationen für Player und Fahrzeug | mittel | hoch | **Behalten, aber begrenzen.** Erst Idle/Walk/Run/Enter/Exit sauber takten; weitere Clips danach. |
| Komplette Stadtgeometrie | sehr hoch; etwa 1,02 Mio. der 1,13 Mio. gerenderten Dreiecke | hoch | **Nicht entfernen.** Als Nächstes Distanzstufen, vereinfachte Ferne und Sichtbereich statt Vollauflösung überall. |
| Dynamische Schatten aller Gebäude/Props | hoch | mittel | **Reduzieren.** Nahe Figuren/Fahrzeuge behalten echte Schatten; Ferne mit vereinfachtem oder keinem Echtzeitschatten. |
| Terrain-Netz | hoch im Authoring, mittel im Spiel | mittel | **Zwei Profile.** Editor 384 Segmente; Runtime aktuell 192 Segmente. |
| Clay-Material und gemeinsame Oberflächenstruktur | mittel | sehr hoch | **Behalten.** Eine geteilte Texturfamilie pro Größenklasse; keine individuelle Hochauflösung pro Objekt. |
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

## Harte Produktionsregel

Ein teurer Baustein bleibt nur dann im sofortigen MVP, wenn er entweder den Kernloop trägt oder die KFB-Identität sichtbar bestimmt. Alles andere wird begrenzt, nur in Spielernähe aktiviert, vereinfacht dargestellt oder später geladen.
