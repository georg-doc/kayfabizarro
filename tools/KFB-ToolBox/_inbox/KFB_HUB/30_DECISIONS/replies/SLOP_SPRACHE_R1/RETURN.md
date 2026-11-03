# RETURN · Slop-Sprache, Treffer-Codes, Zerfall · R1 (WS-Flight → WS0, 04.11.2026)

Konzept-Probe auf Auftrag von WS0 (03.11.). Nichts davon ist im Spiel.

## Belege (dieser Ordner)
- **Ton** (Standbild des 3er-Mobs, Blasentext am Sprecher, −16 LUFS):
  - `SLOP_R1_1_PLAUDERN.mp4` (12 s): Die drei ergänzen sich zu einer Melodie, zweimal mit Schluss im Dreiklang.
  - `SLOP_R1_2_GETROFFEN.mp4` (11 s): Mitte wird mitten im Satz getroffen. Bass und Oben regen sich auf, höher, schneller und dichter, und sprechen am Ende zusammen.
  - `SLOP_R1_3_TOD.mp4` (15 s): drei Tod-Glissandi nacheinander (Oben, Mitte, Bass).
  - `SLOP_R1_4_TREFFERCODES.mp4` (12 s): Gebäude, Slop ungepanzert und Slop gepanzert, je zweimal.
- **Zerfall:**
  - `SLOP_R1_Storyboard_1.jpg` und `SLOP_R1_Storyboard_2.jpg` (2 Folien mit je 2 Bildern).
  - `SLOP_R1_ZERFALL_VORN.mp4` und `SLOP_R1_ZERFALL_SEITE.mp4` (je 10 s, mit Ton): echtes Spiel, ein Treffer, Kamera von vorn bzw. von der Seite.
- `KONZEPTBLATT_SLOP_R1.md`: eine Seite dazu, wie Ton und Bild zusammenspielen.

## Code (Branch `fx/slop-r1`, aufbauend auf `game/inkblobs-r1`)
- `src/audio/slopVoice.js`: Stimme, rein und Node-fest.
  - Planer aus probe_r10 (Modus A);
  - Blasen-Synthese (Minnaert, van den Doel);
  - Mob-Satz mit Halteton und Dreiklang, Aufregung, Tod-Glissando, Ducken.
- `scripts/audio/slop-probe.mjs`, `slop-clips.py`, `slop-zerfall-ton.mjs`: Hörproben und Clips.
- `src/npc/slopZerfall.js`: der Zerfall-Effekt, ein InstancedMesh.
  - Die Schnitte werden im Shader ausgewertet, gerade und kreisförmig.
  - Die Papier-Physik rechnet die CPU.
  - Tropfen kommen aus dem vorhandenen Pool, die Pfütze aus der vorhandenen Spur.
- `src/npc/mobs2d.js`: hinter `slopzerfall=1`.
  - Der Zerfall ersetzt das Platzen.
  - Der tödliche Treffer zerreißt sofort, ohne Umfallen.
  - Die Waffen-Explosion hat dann die Größe „puff“.
  - Prüf-Haken `wound(i, hp)`.
- `test/inkblobs.mjs zerfall`: PASS. 18–20 Schnipsel je Blob, alle liegen am Ende, keine Fehler. Die Kamera folgt dem Blob.
- ElevenLabs-Basisschicht: `40_AUDIO/elevenlabs_r1/slop_treffer_r1/`, 8 Clips, etwa 550 Credits.

## Ehrlich
- Den Ton habe ich nicht gehört. Geprüft sind Spektrum, Lautheit und Ablauf.
- Gefunden und behoben: tiefes Brummen durch Differenztöne bei Sättigung auf dem ganzen Bus, dazu klickende Plopps.
- Bild-Schwächen stehen im Konzeptblatt:
  - Die Rückseite wirkt noch flach.
  - Auf der Pfütze haben die liegenden Schnipsel wenig Kontrast.
  - Von der Seite ist der Blob nur ein Strich.
- Für den Zerfall-Beleg steht ein einzelner Blob auf der Fläche, damit nichts verdeckt.
- Bildzeit ist nicht gemessen; der Aufwand ist klein (bis 384 Schnipsel als ein Zeichenaufruf).
