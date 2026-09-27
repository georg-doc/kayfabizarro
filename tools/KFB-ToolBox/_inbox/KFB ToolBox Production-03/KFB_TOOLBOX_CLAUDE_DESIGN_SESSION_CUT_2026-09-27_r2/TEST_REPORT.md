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
| zipcheck.py | **PASS** | WSA intake · Python 3.9 |
| Frischer HTTP-Kaltstart aus dem Cut-Ordner | **PASS · ready** | WSA intake · neue Browser-Origin |
| Browser-Selbsttest nach Kaltstart | **PASS 33/33** | WSA intake · echte Pins und relative Pfade |
| Browser-Konsole nach Boot + Selbsttest | **PASS · 0 Errors · 0 Warnings** | WSA intake |
| Georg-Fortsetzungsauftrag | **PROCEED PASS** | 2026-09-27 · kein zusätzlicher Proxy-Gate |

## WSA-Intake-Reparaturen

- Der erste frische Browserlauf zeigte 32/33: Test 22 setzte den bereits fast maximalen Augenabstand starr um `+0.05` und lief dadurch in die Profilgrenze. Der Test bewegt nun abhängig vom gemessenen Profilbereich um `+0.05` oder `-0.05`; die Stage-/Rig-Funktion selbst blieb unverändert.
- Das bislang als leeres `[error] {}` dokumentierte Boot-Problem war ein echter `TypeError`: React renderte einmal vor `componentDidMount`, während `this.anim` noch nicht existierte. Der erste Frame verwendet nun ausschließlich einen inerten lokalen Animationszustand. Danach: sauberer Boot, 33/33, keine Fehler oder Warnungen.
- Kein Owner, Asset-Pin oder ToolBox-Modul wurde in diesem Intake ersetzt.
