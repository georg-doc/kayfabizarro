# Steuerung → WSA · Antwort auf Teil C Licht R1 (11.10.2026)

**Teil C ist abgenommen** (Head `2a08a4c`). Die J17-Sonnenhöhe 48,99° gilt, die alte 52,43° ist ersetzt. Gut ist die saubere Trennung in Quelle, Ableitung und Schätzung, ebenso die von Tunnel-Emission und echter Beleuchtung.

## Entscheidung zum Lichtvergleich im Lab
- **Ja, als ein einziger Vergleich:** die J17-Tagesreferenz und E50, beide über den vorhandenen Adapter (day-night.js / skyRig). Kein zweiter Rig, kein neuer Nebel- oder Himmels-Schreiber. Das passt zu V-174 (4): J17 ist der Licht-Maßstab, das Abend-Tuning zielt auf J17.
- **Wer und wann:** die Lab-Bau-Sitzung, *nach* den V-171-Punkten Banden und Flackern. Der Vergleich kommt hinter einen URL-Schalter, damit Georg keinen Zwischenstand sieht (V-166).
- **Bilder für Georg:** gleiche Kamera und gleiches Material bei Exposure 1, drei Standbilder (bisheriger Abend, E50, J17-Tag). Dazu ein Tunnel-Durchgang Portal → innen → Ausfahrt. Georg urteilt PASS/TUNE/FAIL. Die Exposure-Achse (+0,2 EV) wird nur getrennt geprüft, falls nötig.
- Bis zu Georgs Urteil bleibt E50 ein Vorschlag, kein Golden.

## Nächster Auftrag · Bestandssuche Rhythmus- und Schildermodelle (V-175 Punkt 5, V-172/V-173)
Grundlage: STYLE_GUIDE_3D_R1.md v0.2, §6b und §6c.
- **Gesucht:** Fackeln, Leitpfosten, Licht-Pylonen, Laternen und Laternenpfähle, Banner- bzw. Fahnenmasten, Wegweiser, Torbögen und Schilderbrücken über der Fahrbahn, Billboard-Rahmen (Holz, Stein, Neon), Poller.
- **Wo:** die kompletten Pakete von KayKit (alle, inkl. Mystery-Serie), Tiny Treats, Quaternius (frei und MegaKit-Katalog) und Kenney zuletzt, Reihenfolge nach Asset-Quellen-Priorität. Asset-Librarian-Katalog und vorhandene Inventur-Branches zuerst.
- **Pro Fund:** Paket, Dateiname, Lizenz, Polygonzahl falls bekannt, Höhe in Modell-Einheiten, passender Skin (race / town / country / dirt / trail / cosmic / stone-mesa) und ob es zur Knete-Optik passt (ja / mit Material-Tausch / nein).
- **Ergebnis:** `WSA_RHYTHM_PROPS_INVENTORY_R1.md` plus `rhythm-props.json`. Nur Text und Zahlen, keine gekauften Dateien und keine Vorschaubilder lizenzierter Pakete auf GitHub. Bei CC0 sind kleine Belegausschnitte erlaubt.
- „Nicht gefunden in …“ statt „gibt es nicht“ (V-140). Kein Bau, kein Lab-src, kein Merge.
