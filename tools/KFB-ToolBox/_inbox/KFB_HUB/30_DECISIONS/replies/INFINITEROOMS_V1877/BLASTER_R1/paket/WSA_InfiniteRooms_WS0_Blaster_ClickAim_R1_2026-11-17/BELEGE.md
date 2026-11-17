# Belegindex

## Maßgebliche aktuelle Belege

- `MEASUREMENTS.json`: kompakte Zusammenfassung und Quell-Pins.
- `evidence/live-display-final.json`: finale private Site, sechsmal TPS/Reset/sechsmal FPS, vollständige CPU-/rAF-/Worker-Telemetrie.
- `evidence/production-baseline.json`: Produktions-Referenz 185,9/58,5 ms.
- `evidence/production-display-final.json`: korrigierter lokaler Backbuffer-Warmup, 19,3/7,0 ms; enthält auch den Worker-Latenzausreißer.
- `evidence/live-click-final.json`: vier gezielte Klicktreffer je Sicht, letzte Auswahl/echter Kontakt/keine Duplikate.
- `evidence/click-left.json`, `click-right.json`: manuelle Auswahl zweier Punkte aus identischer Körperposition.
- `evidence/live-fps-tps-final.webm`: finale Live-Performance-Vorführung (Audio aus).
- `evidence/live-click-aim-fps-tps.webm`: finale Live-Klick-Vorführung (Audio aus).
- `evidence/live-click-fps.jpg`: Spielansicht mit Ziel und Durchbrüchen.
- `evidence/tests-288.txt`, `build.txt`, `aim-tests-3.txt`: Test-/Build-Ausgaben.

## Bewusst erhaltene Gegenbelege und Zwischenstände

`live-final.json` und `live-candidate3.json` zeigen ältere kalte Veröffentlichungsläufe mit weiter bestehenden langen Frames. `candidate*`, `production-candidate*`, `comparison*`, ältere Screenshots/Videos und Test-Logs sind Entwicklungshistorie. Ihr Name „final“ macht sie nicht zum aktuellen Ergebnis. Nicht mit den oben benannten Live-Daten vermischen. Keine GPU-/sealed-run-Zertifizierung.
