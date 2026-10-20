# TEST REPORT · 2026-10-04 r2

Nur ausgeführte Prüfungen heißen PASS.

| Prüfung | Ergebnis | Wie |
|---|---|---|
| S17 `#__duel` lädt ohne Konsolenfehler (vor der Kamera-Verschiebung) | PASS | Live-Vorschau, Logs gelesen |
| Clips aufgelöst, Schuss-Clip bindet 69/69 (Hero Man) | PASS | Build-Bericht im Panel (`missing` leer) |
| Lauf zur Geschossbahn ≤ 3,2° (Blaster, 5 Schüsse), Minigun/Gewehr 2,8° | PASS | Weltachse Lauf gegen Bahnvektor je Schuss gemessen |
| Ausweichweg Dodge_Left 0,69 m, Rest 0,04 m | PASS | Hüftweg gemessen |
| Kette duel5: 1 miss + 2 dodge + 2 hit, 2 Puffs = 2 Reaktionen | PASS | Ereignisliste gezählt |
| Konsolenfreiheit nach Kamera-Verschiebung | NOT_RUN | Änderung nach dem letzten Lauf |
| Bewegungs-Vorschau (Screenshots eingefroren) | NOT_RUN | im Browser nicht bestätigt |
| Blasterhaltung | FAIL (Georg) | Sichturteil 2026-10-04 → Blender B1 |
| Linke Hand am Gewehr | FAIL (bekannt) | kein IK → Blender B2 |
| fps M1 | NOT_RUN | |
| S16-Residents, Disco, Band, Fight in S17 | NOT_RUN | S17 = Kopie, nicht neu geprüft |
| Georg-Sichturteil Duell | PASS (als Grundlage) | Sprachnachricht 2026-10-04, Details offen |
| ZIP-Clean-Run: 91 Einträge, CRC 0 Fehler, SHA-256 0/90 Abweichungen, Closure ab Entry 51 Dateien / 0 fehlend, größte Datei 246215 B, Secret-Scan sauber | PASS | ZIP-Bytes nach dem Packen neu gelesen (Vorlauf; danach mit diesem Bericht neu gepackt, Lauf wiederholt) |
