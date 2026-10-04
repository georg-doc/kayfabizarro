# TEST REPORT · 2026-09-27 r2
| Test | Ergebnis | Beleg |
|---|---|---|
| Laden Workspace | PASS | evidence/03-studio-face-zu-neutral.jpg |
| Selbsttest Workspace | **PASS 33/33** | evidence/01-selftest-33of33.jpg |
| Clean Run aus dem Cut-Ordner (HTTP, relative Pfade, echte Pins) | **PASS 33/33 · 0 SOURCE MISSING** | evidence/10-cleanrun-staged-selftest.jpg |
| Mundregler-Latenz | PASS · 14–29 ms je Schritt (vorher 105–130) · wrap 12 ms, 52/52 | evidence/08-mouth-latency.jpg |
| »Zu« → Neutral | PASS (21d) | evidence/03-studio-face-zu-neutral.jpg |
| 24 States auf echten Clips | PASS (21e) · ✓10 ≈8 ƒ5 ✗1 | evidence/04-lab-states-24.jpg |
| Motion Export → Import mit Override | PASS (21f) | — |
| Eigene Emote-Werte | PASS (26b) | — |
| Clay-Lider | PASS (27) | evidence/01-selftest-33of33.jpg |
| Strip · Sheet · Trail | manuell gesehen | evidence/05–07 |
| zipcheck.py | NOT_RUN (kein Python in Claude Design) | — |
| Kaltstart aus dem entpackten ZIP | NOT_RUN (WSA, HANDOVER Schritt 3) | — |
| Georg-Abnahme | OPEN | Next Gate |
Bekannt, keine Regression: ein leeres `[error] {}` in der Konsole beim Laden (seit Production-02).
