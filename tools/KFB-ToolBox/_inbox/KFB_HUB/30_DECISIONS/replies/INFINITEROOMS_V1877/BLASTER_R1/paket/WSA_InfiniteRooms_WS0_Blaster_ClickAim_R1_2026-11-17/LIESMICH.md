# WS0 · InfiniteRooms / HeroMan-Blaster / Klick-Zielen · R1

Stand 17.11.2026. Privater Prüfstand, kein Merge, kein Einbau in den Stamm. Dieses Paket wurde vorbereitet und nicht an WS0 versendet.

**Start:** RETURN.md → OFFENE_SPIELANSCHLUESSE.md → PRUEFPLAN.md. Maßgeblich sind diese Dokumente und MEASUREMENTS.json. Ältere RETURN/PERFORMANCE-Dateien unter source/ und ältere comparison*-Dateien sind unveränderte Quell-/Verlaufsbelege und können überholte Zwischenstände enthalten.

- Private Vorführung: https://kfb-infiniterooms.frizzlebob.chatgpt.site/blaster-lab/
- Site-Quellstand: `3e677e271927fd0dd226704db11821a858baef7d`.
- Unveränderter nativer Prüfstand: Game `abe7bc24f02147dfcd785bf60feaae574aa13779`.
- Lokal beobachteter neuer Game-HEAD: `ce01bf76fa211e20b3d6babdf9b2c8edc2badc57`. Kein Port und keine Spielprüfung gegen diesen HEAD erfolgt.

## Inhalt und Anwendung

`source/` enthält die Originaldateien aus dem genannten Site-Commit mit korrekten relativen Pfaden: Adapter, Geometrie, Masken-Worker, Klicksteuerung, Waffenprofile, Rezept, Tests und Build-Konfiguration. `SITE_CHANGE.patch` enthält nur die Performance-/Klick-Änderung seit Site-Basis `8e5e87d28a977e170642c02f21d9e9f1056490af`; **kein Patch zum direkten Anwenden auf das Game**.

Das Quellpaket ist bewusst kein eigenständig startbares Vollspiel: native/ mit 1367 übernommenen Textdateien, private GLB-/Audio-/Kartenressourcen und gemeinsame Site-Helfer sind nicht dupliziert. Für die unveränderte Reproduktion ist der vollständige owner-private Site-Checkout am gepinnten Commit erforderlich. Dort `npm ci`, `npm test`, `npm run build`; danach Vite-Preview mit `probes/patch-transfer-r1/vite.config.mjs` starten. Ressourcen aus der kanonischen privaten Ablage beibehalten; keine Modelle ersetzen.

`evidence/` enthält Rohmessungen, Tests/Build-Logs, Videos und Screenshot. `BELEGE.md` ordnet Hauptbelege und ältere Gegenbeispiele zu. `MANIFEST.sha256` prüft sämtliche Paketdateien; `PACKAGE.json` listet Quellen und Prüfgrenzen. Keine neuen Game-Besitzer, Assets oder Waffen wurden eingeführt.
