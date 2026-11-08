# Look Calibration R2 · WS0 · 08.11.2026

**Grundlage:** Spiel `game/integration-r2` Stand 63 @5a18f004 (Worktree `~/kfb-ws0/look-wt`, Split-Build, lokaler Server 5310), RC4-Testfahrt-Hash, `hour=12 | 17.4 | 22`, `tlapse=0`. Freie Kamera über `yieldCamera`, HUD ausgeblendet. Skript `lookcal.mjs`. Keine Änderung am Spiel.

**Ansichten** (Abweichung vom Brief: statt „Fahrkamera“ eine Fern-Ansicht, weil die Tiefenstaffelung die Valheim-Frage ist):
1. Amphitheater (Diorama am Start), vorn-seitlich
2. Kartenhaus seitlich, nah
3. Ferne über das Viertel, erhöht

Kontaktblatt: `LOOKCAL_R2_kontakt.jpg`. Zeilen: Tag, Golden Hour, Nacht. Spalten: Ansicht 1–3.

## Befund

| Prinzip | Was man sieht |
|---|---|
| Minish: große Farbflächen | Am Amphitheater gut: Farbbänder als große, ruhige Formen auf Sand. Im Viertel nicht: Der Deckground-Boden ist aus der Nähe ein kleinteiliges Op-Art-Muster und konkurriert mit den Häusern. |
| Minish: Sättigungshierarchie | Fehlt im Viertel und in der Ferne: Boden, Hänge und Häuser sind gleich laut. Nichts führt das Auge. |
| Valheim: Tiefe | Fehlt: Die fernen Hügel bleiben voll gesättigt und so kleinteilig wie der Vordergrund. Keine Kontrastabnahme, kaum atmosphärische Farbe. `hoehendunst=1` wirkt kaum. |
| Valheim: Golden Hour | Gut: lange warme Schatten, Himmelsverlauf stimmt, Amphitheater wird plastisch. |
| Valheim: Nacht mit Lichtinseln | Fehlt: Die Nacht ist nur global dunkler und blauer. Keine Fenster, kein Feuer, keine leuchtenden Pilze, also keine Blickfänge. |
| Dioramen (V-341) | Amphitheater braun auf Sand, harte Kante, kein Übergang. Ist an WS1 als N-235 bis N-237 (r832 + Einbettung). |
| Kuppel, Himmel | Kuppel lila am Horizont, Wolken tags/gold passend, nachts dunkle Wolkenscheiben vor Sternen. Planeten und Luftschiffe nicht im Bild (Blickrichtung). |

**Lücke im Lauf:** Die HyperNorm-Fassaden blieben schwarz. Die Kern-Fassade startete in diesem Prüflauf nicht (`engine.ready=false`, Pool 0), obwohl WS1s eigener Test `hnkern-fassade` grün ist. Vermutlich fehlt meinem Lauf ein Ladeschritt (WS1 hängt `viertel=1,hnkern=1` an und wartet auf `engine.ready`). Die Häuser in Spalte 2 und 3 sind deshalb nicht als Look-Urteil zu werten.

**GPU-Zeit:** nicht gemessen. Die 1×1-Readback-Torschaltung ist im Spiel-Build nicht vorhanden; ohne sie gibt es auf diesem Mac keine verlässlichen Zahlen.

## Vorschläge als Daten (nichts geändert)

1. **Tiefenstaffel je Stimmung:** Dunstfarbe = Horizontfarbe des Himmels. Ab etwa 80 m Sättigung und Kontrast abnehmend, bei 400 m etwa die Hälfte; nachts früher einsetzend. Muster-Detail der Farbbänder in der Ferne ausdünnen.
2. **Boden-Hierarchie im Viertel:** Deckground-Muster nah an Gebäuden in Kontrast und Sättigung deckeln (z. B. 60 %), damit Häuser und Figuren führen.
3. **Nacht-Lichtinseln aus vorhandenen Quellen:** Fenster der Kartenhäuser, Laternen und Pilze als begrenzte warme bzw. farbige Punkte im einen Rig (V-385). Am Amphitheater eine Feuerstelle.
4. **Dioramen:** r832 und Einbettung (läuft, N-235 bis N-237).

**Nächster Schritt nach Georgs Urteil:** Die Vorschläge 1–3 als Schalter `lookcal=r1` bei WS1, mit gleichem Kontaktblatt vorher/nachher. Davor der Lauf mit laufender Fassade.
