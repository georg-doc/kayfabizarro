# WS0 → WSA audio work · Freigabe deines Briefings „Songs, Fahrzeug-/Flugforschung, ASMR-Gebäude R1“ mit drei WS0-Punkten (V-1029) · 29.10.2026

**Dein Briefing gilt als Auftrag:** https://github.com/georg-doc/kayfabizarro/blob/bf5ab0b34bf33f431fecf8e08472677b359cd853/skills/chat/workflows/KFB_ADAPTIVE_MUSIC_STEM_PROOF_2026-10-06/WSA_AUDIO_SONGS_ASMR_BUILDINGS_BRIEF_R1_2026-10-29.md
Owner bleibt die bestehende Audio-Site (Branch `feature/kfb-audio-site-immersive-ws0-2026-10-26`, PR #455), ein AudioContext, keine zweite Site. Reihenfolge wie bei dir: A Songs in Soundbeds und Radio → C Hörmatrix ASMR/Gebäude → Georgs Hörurteil → erst dann Spielanschluss.

**WS0-Punkte dazu**
1. **Bass gilt für alle Antriebe** (Georg 28.10. auf PR 45, V-1029): satter Bass und räumlicher Klang, auch beim kleinen Jetpack; Metall-, Klapper- und Schepper-Akzente kurz, sparsam und wechselnd. Die Fahrzeug-/Flugforschung (Teil B) setzt du in V-908 auf PR 45 mit dieser Regel um; der Jetpack-Stand R4 wartet auf Georgs Hörurteil, dort nichts überschreiben.
2. **Keine neuen ElevenLabs-Klänge** in diesem Auftrag: erst die vorhandenen 40 ASMR-Clips (Satz asmr_r1, so übernommen nach V-979) und die 3 Goo-House-Clips in der Hörmatrix hören lassen; neue Generierung nur nach Georgs Go über WS0.
3. **Spielanschluss der Gebäude-Klänge** nicht auf `game/proc-world-ws0`: Das Spiel liegt bis So 1.11. 20 Uhr bei WS1 auf `game/integration-r2`. Nach Georgs Hörurteil meldest du die gewählten Klänge mit Ereignisnamen an WS0; WS0 gibt sie über den Kanal `comms/ws0-ws1` weiter. Gemeinsame Kaskadenkennung und Zeitbasis für Klang und Goo-Partikel wie in deinem Teil C.

4. **Katalog und Ablage:** Beide Titel neu in `40_AUDIO/music_catalog_r1.json` im Schema kfb.music-catalog/1 (V-688) mit bpm, Versatz, Tonart und LUFS (sie fehlen dort noch). Die Site lädt die Master als AAC über den Klang-Speicher bzw. den remote.json-Pin (V-894, V-859); Stems und Rohdateien bleiben in `assets/private`, nie auf einem öffentlichen Branch (V-598).
5. **Hörmatrix:** Keep/Tune/Cut entscheidet Georg, du baust nur die Matrix. Gleiche Lautheit nur zum Vergleichen; der freigegebene Pegel −14 LUFS bleibt (V-976). Synthetisches Rauschen beim Fahrtwind nur sehr leise unter der Aufnahme (V-857).

**Rückgabe:** wie in deinem Abschnitt „Abnahme und nächstes Gate“ (Revision, Katalog, Stem-Messung, hörbare Probe, Hörmatrix mit Quellenstatus).
