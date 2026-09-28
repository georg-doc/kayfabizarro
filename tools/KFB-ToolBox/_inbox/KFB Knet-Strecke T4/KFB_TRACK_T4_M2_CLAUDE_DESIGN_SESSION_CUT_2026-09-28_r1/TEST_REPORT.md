# TEST_REPORT · 2026-09-28 r1

Nur ausgeführte Tests heißen PASS.

| # | Test | Ergebnis | Beleg |
|---|---|---|---|
| T1 | T4 lädt im Projekt-Workspace, Konsole 20 s nach Öffnen ohne Meldung | PASS | get_webview_logs leer |
| T2 | T4 WebGL nach Vollbau (≈ 60 s): M2-Markierung sichtbar (Zebra, Mitte Warn/Leit, Blocklinie signal, Stärkewechsel) | PASS | evidence/01–07-t4.jpg |
| T3 | M2-Blatt rendert Einmündung DE/US, Parkbucht, Linksabbieger US, Parkdeck | PASS | evidence/01–05-m2.jpg |
| T4 | Hintergrund-Verifier auf T4 | NO_FINDINGS_REPORTED | keine Rückmeldung bis Export (kein PASS) |
| T5 | Secret-Scan aller Textdateien (API-Key, Token, Bearer, signierte URL) | PASS · 0 Treffer | Build-Skript |
| T6 | Keine Datei > 2 MB | PASS | EXPORT_MANIFEST.json sizes |
| T7 | ZIP-Integrität: ZIP neu eingelesen, jede Datei gegen CHECKSUMS.sha256 | PASS | Build-Skript (bricht sonst ohne Schreiben ab) |
| T8 | Clean-Run aus dem entpackten ZIP im Browser | NOT_RUN | kein Server für ZIP-Inhalt in dieser Umgebung |
| T9 | Leistung (fps, Draw Calls) neu gemessen | NOT_RUN | Werte aus T4-Rückgabepaket |
| T10 | US-Regelwerk in T4 | NOT_RUN | im UI nicht verdrahtet |
| T11 | td03.stream.json.gz entpackt ergibt 3 784 081 Byte | NOT_RUN | Gzip mit CompressionStream erzeugt, nicht rückgeprüft |

## Belege
- `evidence/01-t4.jpg` · T4 Kamera Zebra (M2: Zebra 12 m vor Ende, Warnlinie, gerade Enden)
- `evidence/02-t4.jpg` · T4 Auslauf von oben (Zebra, Mitte, Verwehung M1)
- `evidence/03-t4.jpg` · T4 Strang-Rand
- `evidence/04-t4.jpg` · T4 Magnet (Blocklinie B 3/3 signal, Boost)
- `evidence/05-t4.jpg` · T4 Loop
- `evidence/06-t4.jpg` · T4 Fahrt Stadt (schwaches Bild, Kart verdeckt)
- `evidence/07-t4.jpg` · T4 Stadt-Naht (Stärkewechsel, Mitte, Zebra)
- `evidence/08-t4.jpg` · T4 Panel offen
- `evidence/01-m2.jpg` · M2 Einmündung DE
- `evidence/02-m2.jpg` · M2 Parkbucht
- `evidence/03-m2.jpg` · M2 Linksabbieger US (Sperrfläche signal)
- `evidence/04-m2.jpg` · M2 Einmündung US
- `evidence/05-m2.jpg` · M2 Parkdeck Einbahn
- `evidence/georg-review-2036-01.png` · Georg Review 20:36 (vor Fix)
- `evidence/georg-review-2036-16.png` · Georg Review 20:36 (vor Fix)
- `evidence/georg-review-2036-51.png` · Georg Review 20:36 (vor Fix)
