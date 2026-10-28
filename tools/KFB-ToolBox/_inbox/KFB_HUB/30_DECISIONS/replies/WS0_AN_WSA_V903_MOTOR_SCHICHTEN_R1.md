# WS0 → WSA audio work · Georgs neue V8-Klänge als Motor-Schichten (V-903) · 28.10.2026

**Tier 0**
1. **Zuerst sichern und aufräumen (Georgs Ja vom 28.10., V-903: „Festplatte aufräumen“; die Platte ist fast voll):** In deinen Arbeitsordnern unter `~/.codex/.chatgpt-projects/g-p-6aa43ccf…/work`:
   - **Sichern:** Offene Stände (WS0 hat u. a. gesehen: `kfb-audio-interaction-states` 4 ungepushte Commits, `wsa-hub-update-2026-10-09` 1 Commit + 1 geänderte Datei, `kayfabizarro-toolbox-production-03` 2 Commits, `chatterbox-pr357-gpt-site-fix` 4 geänderte Dateien, `kayfabizarro-deploy-audit` viele offene Änderungen) auf einen neuen Sicherungs-Branch `backup/wsa-<ordner>-2026-10-28` pushen – nie main, kein Merge. Vor jedem Push in das öffentliche Repo kayfabizarro prüfen, ob private oder gekaufte Dateien bzw. rohe WAVs dabei sind (V-448); dann stattdessen ins private Repo georg-doc/KFB-Stunt-Car-Race. Fehlt dir dort Schreibzugriff: nicht pushen, an WS0 melden.
   - **Löschprüfung je Ordner:** nichts Uncommittetes, nichts Ungetracktes oder Ignoriertes, das nur lokal liegt (Medien, Schlüssel, Builds mit Einzelstücken), kein Stash, jeder Branch liegt auf dem Remote. Nur Ordner, die diese Prüfung bestehen, löschen; Vorschlag von WS0: zuerst die Ordner vor dem 25.10. Was die Prüfung nicht besteht, nicht löschen, sondern als Liste an WS0 (geht als Frage an Georg).
   - Freie GB und die Liste der gelöschten Ordner melden.
2. **Kein Spielcode:** Du lieferst Ton-Dateien, Index-Eintrag und eine Zuordnungstabelle. Den Einbau in den Motor-Code macht WS0.
3. **Ablage:** Ton-Repo georg-doc/kayfabizarro, Branch `assets/kfb-audio-r1`, Pfad `media/kfb-audio/r1/el/engine_georg_r1/` plus Eintrag unter `sets` in `media/kfb-audio/r1/index.json` (wie die Sets `engine_r2`/`engine_v8_r2` vom 28.10., Commit a0167cf). Rückmeldung an WS0 mit Commit-Link.

**Warum:** Georg will den Motor rau, basslastig wummernd, körperlich spürbar, räumlich, übermächtig und podracer-artig (V-900). Motor R2 ist im Spiel (echte CC0-V8-Aufnahmen plus 22 ElevenLabs-Schichten, Charakter je Fahrzeug). Georg hat 16 eigene ElevenLabs-Klänge dazu erzeugt, die ergänzt werden sollen.

**Quelle:** `~/Dropbox/CLAUDE/KFB MusicalChatterbox/KFB V8 Engine Sounds 11labs/` – 4 Anweisungen × 4 Varianten, gleichmäßige Schleifen:
- „Deep, overpowered V8“ #1–#4 (je 6 s; WS0-Messung: 77 % Energie unter 150 Hz → Körper/Wummern),
- „Aggressive, distorted …“ #1–#4 (je 4 s; Biss im Mittenband),
- „Supercharged quattro …“ #1–#4 (je 6 s; helles Kompressor-Pfeifen),
- „Supercharged twin-turbo …“ #1–#4 (je 8 s; Turbo-Pfeifen und -Rauschen).

**Einstieg Motor R2 (lesen, nicht ändern):** https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/game/proc-world-ws0/src/audio/engineLayers.js (Schichten `LAYER`, Überblendung nach Drehzahl `xfade`), https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/game/proc-world-ws0/src/audio/engineVoice.js (`ENGINE_PRESETS`, `VEHICLE_SOUND`, Klangkette), https://github.com/georg-doc/KFB-Stunt-Car-Race/blob/game/proc-world-ws0/src/audio/kfbAudio.js (Laden der Sets, `stats().racer`).

**Auftrag:**
1. Alle 16 Klänge anhören und messen: Grundton bzw. Drehzahl-Eindruck, Spektrum, Gleichmäßigkeit, Stereo/Phase (Achtung: zwei R2-Klänge kamen gegenphasig), brauchbare Schleifenstücke.
2. Je Anweisung die 2–3 besten Varianten als nahtlose Schleifen schneiden (veröffentlicht als MP3 128 kbps wie `engine_r2`; Commit klein halten, V-859) (Nulldurchgang/Überblendung, kein Klick), mono oder phasenrichtig, auf −16 LUFS wie die anderen Sätze (`40_AUDIO/elevenlabs_r1/lufs_set.py`, `norm_set.py`). Arbeitskopien in `40_AUDIO/elevenlabs_r1/engine_georg_r1/` mit `engine_georg_r1.json` (Quelle, Anweisungstext, Variante, sha256).
3. Zuordnungstabelle `engine_georg_r1.mapping.json` (die neuen Schleifen kommen zusätzlich zu den R2-Schichten, sie ersetzen keine): je Klang die Rolle (`body` = Körper unter dem Drehzahl-Gitter, `grit` = Biss unter Last, `blower` = Kompressor/Turbo-Pfeifen nach Drehzahl und Boost), Bezugs-Drehzahl bzw. Tempo-Anteil für die Überblendung (wie `keys` in `LAYER`), Grundpegel, und je Fahrzeug-Preset aus `ENGINE_PRESETS` (v8, dragster, hotrod, heavy, jet, hover) eine Stärke 0..1.
4. Hörprobe: zwei kurze Mischungen (Bestand R2 gegen R2 + neue Schichten) als WAV in den Arbeitsordner, offline aus denselben Schleifen gemischt, gleiche Lautheit.
5. Veröffentlichen wie in Tier 0 Punkt 3 (nur die geschnittenen Schleifen, Lizenz-/Quellenzeile: von Georg mit ElevenLabs erzeugt).

**Rückgabe:** Commit-Link, Dateiliste mit sha256, Zuordnungstabelle, Pfade der Hörproben (WS0 legt sie Georg in den Hub), freie GB nach dem Aufräumen, offene Fragen an Georg (nur wenn er entscheiden muss).
