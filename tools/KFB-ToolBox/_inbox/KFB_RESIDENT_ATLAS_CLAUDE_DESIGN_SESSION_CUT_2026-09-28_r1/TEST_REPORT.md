# TEST REPORT · 2026-09-28T20:15:00Z

| Test | Ergebnis | Beleg |
|---|---|---|
| S11 lädt, Friedhof-Resident baut | PASS | evidence/s11b-diorama.jpg · Konsole ohne Fehler (nur three.js-Deprecation-Warnungen) |
| Texturen gesetzt, keine schwarzen Teile | PASS | Sichtprüfung nach dem Lade-Fix |
| Zerfall in Takt 9 | PASS | evidence/s11b-collapse-bar9.jpg |
| Tore öffnen nach innen | PASS | evidence/s11b-gate-open.jpg |
| Suno-Audio laden, Uhr folgt Audio | NOT_RUN | keine Audiodatei |
| Spawn_Ground-Modus | NOT_RUN | |
| Set „Inventar“ | NOT_RUN | |
| Andere Residents in S11 (Regression gegen S10) | NOT_RUN | |
| Clean-Run im Browser aus dem entpackten ZIP | NOT_RUN | nur Strukturprüfung, siehe nächste Zeile |
| ZIP-Strukturprüfung: entpackt, Checksummen, Closure vollständig, keine Datei > 2 MB | siehe EXPORT_MANIFEST.json → zipCheck | automatisch beim Export |

Secret-Scan: siehe EXPORT_MANIFEST.json → secrets.
