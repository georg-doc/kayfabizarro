# TEST REPORT · KFB Hub UX Recovery v2 · 2026-09-25

Umgebung: Claude-Design-Vorschau (Chromium). Keine Veröffentlichung, kein Cloudflare.

## Donor-Beleg
| Prüfung | Ergebnis |
|---|---|
| Donor-Datei = dfaafac0-Blob | PASS (github_copy_files am Commit) |
| Render 1440 / 880 / 390, Paper + Dark | PASS in `Hub Donor Proof v2.dc.html` (echte Iframes, im Browser sichtbar) |
| Screenshot-Datei Donor | nur native Breite (`donor-split-909-paper.jpg`); Iframe-Inhalte sind in DOM-Screenshots nicht erfassbar |
| Kopfzeilen-Links im Donor sichtbar | **FAIL im Donor** (CSS versteckt `.bookmark`) |

## Kandidat v2
| Prüfung | Ergebnis |
|---|---|
| Live-Registry geladen | PASS · Live-Registry, sourceCommit c62d903, 5 Änderungen gegenüber Fallback gemeldet |
| Reload-Zustände | PASS lädt / aktualisiert (n) / keine Änderung; Fehlerpfad per Code geprüft (beide Quellen scheitern → Stand bleibt, rote Meldung) |
| Stale-Hinweis bei > staleAfterHours | PASS per Code; im Test nicht ausgelöst (Stand 19 Min.) |
| „manuell eingespielt“ bei `mode: manual-*` | PASS sichtbar |
| Layout 1440 (2 Spalten + rechte Spalte) | PASS · `v2_desktop-1440_paper.jpg`, `_dark.jpg` |
| Layout 880 (einspaltig, Inbox vor Arbeit) | PASS · `v2_split-880_*.jpg` |
| Layout 390 | PASS · `v2_mobile-390_*.jpg`, Trefferflächen 44 px |
| Pocket Inbox im ersten Blick, alle Breiten | PASS |
| Entscheidung: Auswahl → Notizfeld → Speichern | PASS (Entwurfszustand im Screenshot v1; Speichern schreibt nur `kfb.hub.decisions.v1`) |
| Sync-Paket / JSON-Export | per Code geprüft; Kopie markiert Einträge als „exportiert, nicht in GitHub“ |
| Briefings strangweise, zu | PASS · 13 Stränge, 42 startklar, 48 später |
| Konsolenfehler | keine |

Breitenmethode für den Kandidaten: `body` auf 390/880/1440 px gesetzt; der Kandidat misst seine eigene Root-Breite (ResizeObserver) und schaltet danach um. 1440 zusätzlich per CSS-Zoom in die Vorschau eingepasst.

Nicht getestet: echte Datei-Drops (Browser-Dialog), Zwischenablage außerhalb sicherer Kontexte, Verhalten auf `kayfabizarro.pages.dev`.
