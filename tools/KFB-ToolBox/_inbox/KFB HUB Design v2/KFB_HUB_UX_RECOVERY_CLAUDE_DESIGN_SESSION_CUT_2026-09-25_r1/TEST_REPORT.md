# TEST REPORT · Session Cut 2026-09-25 r1

## Static / source
- JSON-Parse `SOURCE.json`, `EXPORT_MANIFEST.json`: PASS (im Export-Script).
- Lokale Importe der Entries existieren im Paket: `support.js`, `hub-recovery/embedded-registry-2026-09-25.js`, `hub-recovery/resident-overlay.v1.js`, `hub-recovery/donor/kfb-hub-v2-dfaafac.html`: PASS.
- Keine Datei > 2 MB: PASS (Script-Prüfung).
- Secret-Scan (token|api[_-]?key|secret|password|bearer|cookie): siehe EXPORT_MANIFEST.secretScan.

## Runtime / browser (Claude-Design-Vorschau, Chromium)
- Live-Registry geladen, Reload „aktualisiert, 5 Änderungen“ und „keine Änderung“: PASS.
- Fehlerpfad Reload: per Code gelesen, nicht ausgelöst → `NOT_RUN` als Laufzeitbeleg.
- Layout 1440 / 880 / 390, Paper + Dark: beobachtet (evidence/).
- Resident-Overlay: FrizzleBob lädt, 12 Klick-Clips, `play('Jump_Full_Long')` sichtbar, echter Schatten sichtbar, z-index 2147483000: PASS. Keine Konsolenfehler.
- Entscheidung erfassen → speichern: im Kandidaten v1 beobachtet, v2 gleicher Code. Sync-Paket kopieren/Export: `NOT_RUN` im Browser (Zwischenablage/Download nicht beobachtet).

## Visual / human (Georg)
- v1: zu kleinteilig → TUNE.
- v2: „gefällt mir super“, Ecken leicht runden → umgesetzt.
- Overlay: „reicht als Prototyp völlig aus“, Ebenen- und Schattenfix → umgesetzt, **Georg-Blick auf v1.1 ausstehend**.

## Not tested
GothGirl, Black Knight im Overlay · echtes Maus-/Touch-Ziehen · Datei-Drop in die Inbox · Betrieb auf kayfabizarro.pages.dev · Start aus diesem entpackten ZIP.

## zipcheck / Clean Run
- `zipcheck.py`: `ZIPCHECK_NOT_RUN` (kein Python in Claude Design). Dieselben Prüfungen im Export-Script ausgeführt: siehe EXPORT_MANIFEST.checks.
- Clean Run: `CLEAN_RUN_NOT_EXECUTED` (Paket wird vom Host gezippt; Start aus dem Staging per HTTP-Server hier nicht möglich).
