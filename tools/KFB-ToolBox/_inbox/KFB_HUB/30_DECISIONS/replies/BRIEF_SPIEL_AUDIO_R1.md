# Auftrag Spiel-Sitzung · Songs und ASMR ins Spiel · WS0 · 31.10.2026 (V-1109)
Georg hat auf der Audio-Site freigegeben; das nächste Urteil fällt im Spiel. Kein neuer Klang, keine neue ElevenLabs-Generierung. Lies die WSA-Rückgabe: https://github.com/georg-doc/kayfabizarro/blob/f94d3290afc5949851b1982151c6730b50496723/skills/chat/workflows/KFB_ADAPTIVE_MUSIC_STEM_PROOF_2026-10-06/WSA_SONGS_ASMR_R2_RETURN_2026-10-31.md und den letzten WSA-Kommentar auf PR #455.

**Ort:** eigener Branch `game/audio-asmr-r1` von `game/integration-r2`, vorhandener Mixer und MusicClock, `kfbAudio` und Busse (`replies/AUDIO_ROUTING_R1.md`, V-841), kein zweiter AudioContext. Trage die zwei Songs und den ASMR-Satz vor dem Einbau dort ein (Datei, Ablage, Bus, Regel, Tier 0 Nr. 3). Songs auf den Musik-Bus; ASMR auf den Bus, den die Routing-Seite für Effekte aus der Welt nennt, mit Raumposition. Die Quelle des ASMR-Satzes pinnst du auf einen festen Stand von `assets/private`.

## A · Songs
`shepard_ascent` und `bouncing_busker_groove` in die vorhandene Soundbed- und Radio-Auswahl. AAC-Pin `georg-doc/kayfabizarro@fae628c2d85699a203742cb008e344a4653bc28d`, `media/kfb-audio/r1/suno_r2/`. Katalog `assets/private` @1c186978, `40_AUDIO/music_catalog_r1.json`. Feste Korrektur −1,6 und −1,7 dB vor den Kontext-Bussen. Tempo und Tonart sind Schätzungen, also kein Beat-Sync darauf. Stems bleiben privat.

## B · ASMR an echte Ereignisse, hinter `asmr=1`
Satz `asmr_r1_lufs`, Dateien unverändert. Finde die Stellen, an denen Knete, Goo und Fluff im Spiel wirklich etwas tun, und häng dort an: Knete drücken oder wachsen, Goo ziehen, tropfen, reinigen, Fluff bewegen und ankommen. MiB und Technik nur, wo es die Aktion gibt. Position und Stärke aus dem Ereignis. Nie je Bild oder je Partikel auslösen, Kontakte begrenzen und zusammenfassen, keine Dauerfläche. Erfinde keine Ereignisse; was fehlt, kommt als Liste zurück.

## C · Gebäude: noch nicht bauen
`G01_goo_house_crack`, `G02_goo_house_wobble`, `G03_goo_house_burst` kommen nach dem Merge von `design/kartengebaeude-r1`. Lies dort nur nach, welche Ereignisse die Kaskade liefert, und schreib den Plan: Riss → crack, echtes Wackeln → wobble, Ausbruch → burst, eine gemeinsame Kennung und Zeitbasis mit den VFX.

## Tests und Rückgabe (V-1107)
Eigene Tests. Ohne Schalter bleiben Programmliste und Bild gleich, der Ton ebenso bis auf die zwei neuen Titel. Nenne angefasste gemeinsame Dateien. Pflichtliste läuft beim Merge. Rückgabe an WS0, dann Stopp: Branch, Commit, Ereignis-Tabelle (Ereignis, Datei, Stelle im Code, Begrenzung), eine kurze Spielaufnahme **mit Ton** je Materialart, gemeinsame Dateien. Tab nach dem Test schließen, Server stoppen. Merge nur mit Georg.
