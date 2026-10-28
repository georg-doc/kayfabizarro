# WSA → WS0 · V-908 · 28.10.2026

**TECHNISCHES KANDIDATENPAKET GESICHERT — V-908 NICHT VOLLSTÄNDIG ABGENOMMEN.** Kein Spielcode, keine Site und keine Originaldatei geändert.

Asset-Commit: https://github.com/georg-doc/kayfabizarro/commit/f38d7e382fed488ebf9ba802f49b81645f39921c
Branch: `assets/kfb-audio-r1`.
Vollständiger Return: https://github.com/georg-doc/kayfabizarro/blob/f38d7e382fed488ebf9ba802f49b81645f39921c/media/kfb-audio/r1/el/drive_georg_r2/RETURN.md
Mapping: https://github.com/georg-doc/kayfabizarro/blob/f38d7e382fed488ebf9ba802f49b81645f39921c/media/kfb-audio/r1/el/drive_georg_r2/drive_georg_r2.mapping.json

46 Quellen / 662 Sekunden gemessen. 12 FLAC-Mono-Schleifen (je zwei body/grit/stutter/whine/skid/cockpit) und 9 MP3-128-Ereigniskandidaten (je drei shift/skid/stutter), zusammen 2.31 MB. Rollen beruhen auf Dateinamen und Signalmessungen, NICHT auf erfolgtem Anhören. Insbesondere skid/shift sind unbestätigt. Kein pass/Doppler erfunden; keine behauptete separate Attack/Body/Tail-Isolation.

117 technische Checks bestanden; 21/21 Ausgaben auf −16.45 bis −16.00 LUFS, höchster 4×-Spitzenwert −1.78 dBFS. Alle zwölf FLAC-Grenzen numerisch nach Kodierung geprüft; dies ersetzt keine Hörprüfung. Quellen unverändert. Nach GitHub-Schreiben exakter Branch-Head, 29 Dateien samt Blob-Hashes/Größen und vollständiger Index gelesen und bestätigt. Änderung insgesamt: 29 neue Paketdateien plus ein neuer sets-Eintrag; bestehende Index-Einträge bewahrt.

Dropbox-Arbeitsordner (34 Dateien lokal kopiert, alle SHA-256 nachgelesen):
`~/Dropbox/CLAUDE/KFB_HUB/40_AUDIO/elevenlabs_r1/drive_georg_r2/`
Einstieg `HOERPROBEN.html`; vier WAVs unter `auditions/`:
- `dragster_baseline_partial.wav`
- `dragster_candidate_layers.wav`
- `hover_baseline_partial.wav`
- `hover_candidate_layers.wav`

Je 24s bei gleicher Lautheit −23 LUFS: Start, Schaltmarker 6/12s, Driftphase 14–19s, Gas weg 20s. Offline-Materialstudien, kein exakter Spiel-Render und kein Gameplay-Timingbeweis. WAVs bleiben in Dropbox.

**Drei offene Punkte für WS0:**
1. Reale Hörprüfung aller Quellen und Rollen fehlt. Kandidaten vor Zuordnung hören, insbesondere Gangwechsel/Reifen. Keine semantische Qualitätsabnahme aus den technischen Checks ableiten.
2. `engine_georg_r1` aus V-903 fehlt im aktuellen Ton-Index und vorgesehenen lokalen Ordner; Rückfrage an Georg gestellt. Geforderter vollständiger Bestandsvergleich daher offen, die WAVs tragen ausdrücklich `baseline_partial`.
3. Spiel-Lader am geprüften `game/proc-world-ws0`-Head `c3212e261433dd4f545b4a77b5e7f0c331106af1` kann nur `set.ext`. Neuer Index listet ausschließlich die zwölf vorhandenen FLACs; neun MP3-Pfade stehen separat in `eventFiles`/Manifest. WS0 muss vor Event-Anbindung Dateiendungen pro Clip oder einen eigenen homogenen Event-Satz unterstützen. Keine falschen FLAC-URLs für MP3s.

**Nächster Gate:** WS0/hörfähiger Audio-Prüfer bestätigt Rollen im Hörpaket und ergänzt V-903; danach gezielter Einbau durch WS0. Keine Änderungen an Hub-Routing, kein Merge, keine Live-Promotion. 
