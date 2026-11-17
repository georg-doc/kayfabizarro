# WSA Patch → WS0 · aktueller Übergabestand

## Belegt im privaten Prüfstand

- Eine `combatTargets`-Quelle `infiniterooms` mit sweep/hit/blast. Kein boxes-Register und keine zweite Treffer-/Schadensinstanz in der Raumantwort.
- Native combatPlayer-Freigabe, Projektilkontakt und Ereignisse. Die Auswahl per Maus ist Präsentation: angeklickten Weltpunkt festhalten → Kamera/Actor drehen → einmal native fire anfordern. Tatsächliche Treffer entscheidet der Kampfbesitzer.
- Klick-Zielen standardmäßig aktiv, klassisches Mitte-Zielen umschaltbar; Mausziehen zum Umsehen. Bewegung, Reset und Moduswechsel verwerfen noch ausstehende Ausrichtung. Reduced Motion verwendet keine Drehanimation.
- Zwei manuelle benachbarte Treffer aus identischer Körperposition; bestätigte Punkte innerhalb 1e-6 am Ziel. Finale Live-Vorführung: 4/4 Treffer TPS, 4/4 FPS, keine Doppelzählung, keine neu aufgezeichneten Laufzeitfehler.
- Zwei Ursachen für den Eindruck eines falschen Wandtreffers korrigiert: physische Wandzuordnung an Lochkanten und Entfernung einer unsichtbaren unendlichen Projektil-Bodenebene im privaten Host. Ein freier Durchbruch bleibt im klassischen Modus legitimer freier Schussweg; keine pauschale Garantie, dass jede sichtbare Waffenanimation bereits stimmt.
- Native Bruchmasken/Polygone und dropLaserPanel-Stücke, unveränderte Kartenmotive, gemeinsame sichtbare Geometrie/Kollisionen. Begrenzung: 24 aktive Stücke, höchstens 6 neue pro Flächen-Commit, Lebensdauer 4,5 s. Konkave Stücke haben konvexe Hüllkollisionen.
- Dichter 12,5-cm-Volumenkörper; exakte native Flächenproben je Dickensäule geteilt, unveränderte Flächen nach Feldversion zwischengespeichert. Native Clay-Materialien bleiben resident. Keine Reduktion von Motiv-/Maskenauflösung, Schatten oder Stückbudget.
- Ein Worker berechnet nur abgeleitete native Masken. Geometrie und Collider werden zusammen vor dem Physikschritt übernommen. Reset-Generation verwirft alte Antworten; Kapazität 8 offene Flächenjobs, kein unbeschränkter Rückstau. Warmup nutzt denselben Renderer und tatsächlichen Backbuffer bei verstecktem Canvas, danach 1×1-Readback-Gate; keine sichtbaren Probe-Treffer und keine Restschäden.

## Messung und Grenzen

| Max. Hauptthread-Arbeit inkl. Render-Submission | Referenz | Korrigiert lokal | Finale private Site |
|---|---:|---:|---:|
| TPS |185,9 ms|19,3 ms|10,2 ms|
| FPS |58,5 ms|7,0 ms|5,7 ms|

Sechs native Freigaben TPS → Reset → sechs FPS, Audio aus. Vorbereitungszeit der finalen Site 1526,8 ms; Worker-Zustellung 4,1–17,2 ms; längster rAF-Abstand 41,9/41,6 ms. Das sind CPU-/Submission-Beobachtungen, keine GPU-Zeit, keine garantierten 60 FPS und kein versiegelter Hardwarebenchmark. Native Clip-/Mündungszeit und Seeds bleiben aktiv: Referenz bestätigt 2/2, final live 2/3 Kontakte; unterschiedliche Lochzustände, kein identischer Treffer-Replay. Acht gezielte Klick-Schüsse sind ein separater Lauf (6,2/5,6 ms max. Hauptthread).

Frühere kalte Läufe mit 104/50 bzw. 99/86 ms und ein lokaler Worker-Ausreißer von 410,7 ms bleiben als Gegenbelege im Paket. Keine Zusage, dass jeder Kaltstart oder jede Dauerfeuerlast gelöst ist.

288 Tests bestanden; Build bestanden. Real-Worker-Masken, Polygone, Bitsets/Dirty-Chunks, UVs, native Stücke/Hüllen und Reset werden mit der Referenz verglichen. Native Dateien und Modellbytes gegenüber dem gepinnten Prüfstand unverändert.

## Übergabegrenze

Spielanschluss und endgültige FPS-/Audio-Abnahme bleiben offen, siehe OFFENE_SPIELANSCHLUESSE.md. Im beobachteten neueren Game-HEAD sind combatPlayer.r2, combatTargets, aufprallSchaden, viertelLoader, kfbAudio, mixer und core/rezept gegenüber dem Prüfstand ohne committed Differenz; das ersetzt keinen Integrationstest. WS0 muss zum Einbau erneut den dann aktuellen Stamm prüfen. Kein Merge, kein Integration-PASS.
