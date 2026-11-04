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

## Runde 2 (04.11.): Georgs Ton-Urteil und WS0-Rückgabe zum Zerfall
**Ton** (Georg: „noch ein bisschen dumpfer und blubbriger, Richtung gut“): `SLOP_R2_1_PLAUDERN` … `SLOP_R2_4_TREFFERCODES`, gleich aufgebaut.
- Klang:
  - Tiefpass von 1500 auf 900 Hz, Chirp langsamer (0,08 → 0,045), Blasen klingen länger;
  - weniger Obertöne, weichere Plopps;
  - 1,5-mal mehr Blasen je Silbe, jede zweite mit einer großen, zähen Blase eine Oktave tiefer;
  - zähes Nachblubbern (4 sinkende Blasen) am Ende jeder Phrase.
  - Harmonie und Ensemble bleiben unverändert.
- Messung: Energie über 300 Hz von 2,0 % auf 0,9 %. Gehört habe ich es nicht.
- Standbild neu: drei etwa gleich große Blobs (±5 %) nebeneinander, ohne Laufspur.
- Keine Sprechblasen mehr; nur die Treffer-Codes in Clip 4 sind beschriftet.

**Zerfall:** `SLOP_R2_Storyboard_1/2.jpg`, `SLOP_R2_ZERFALL_VORN.mp4`, `SLOP_R2_ZERFALL_SCHRAEG.mp4` (30° seitlich, mit Ton).
1. Kein Puff mehr, keine Explosion beim Slop-Tod. Der Akzent ist der Riss selbst, dazu Tinte aus den Schnitten.
2. Bögen dominieren:
   - zwei große, sich schneidende Kreise und zwei Bisse am Rand;
   - nur zwei Geraden, fast rechtwinklig und versetzt;
   - dünne Splitter (Füllgrad unter 30 %) fallen weg.
3. Rückseite in warmem, hellerem Weiß mit Papierfaser, Druck scheint nur leicht durch. Die Vorderseite hat einen hellen Papierrand an der Schnittkante.
4. Die Pfütze entsteht erst aus dem Zerfall: 1,2 s liegen, dann 3,5 s einsickern, kleiner und blasser. Die Laufspur ist im Beleg abgeschaltet.
5. Kamera vorn und 30° seitlich, sie folgt dem Blob. Kein Strich mehr.
6. Klonk-Funke: wartet auf Georgs Ton-Urteil.

**Ehrlich:**
- Die liegenden Schnipsel sind am Ende klein und blass, auf Folie 2 rechts kaum zu sehen.
- Die kleinen Schnipsel fliegen teils noch oben aus dem Bild.
- Code: `fx/slop-r1`; Prüf-Haken `inkClean`, `sizes`, `pose`; Testmodus `mobbild`.

## Runde 3 (04.11.): Zerfall als „Papier reißt“ (WS0-Rückgabe), ein Kritiker auf dem Endstand
Belege: `SLOP_R3_Storyboard_1/2.jpg`, `SLOP_R3_ZERFALL_VORN.mp4`, `SLOP_R3_ZERFALL_SCHRAEG.mp4` (mit Ton).
- Umgesetzt:
  - wenige große Stücke: ein großer Bogen und ein gerader Riss am Gesicht vorbei, zwei Bisse am Rand;
  - Drehung um eine waagrechte Achse, damit die helle Rückseite zeigt;
  - 4 statt 14 Tropfen, kein Treffer-Spritzer beim tödlichen Treffer;
  - die Stücke liegen 5 s auf dem Hang (meist Papierseite oben) und verblassen dann;
  - Kamera 5 m weg, 1 m höher.
- **Kritiker** (ein Durchlauf, blind auf Bildfolgen und Folien): „liest sich als Papier“ **3/10**, „ein Effekt“ **4/10**. Die Kernpunkte stimmen mit meiner eigenen Prüfung überein:
  1. Das große Stück wirkt wie ein Brett: gerade Kante, kein heller Rissrand.
  2. Es fällt zu schnell (in unter 0,5 s flach), Kippen und Flattern sind kaum sichtbar.
  3. Am Ende liegt eine helle Fläche ohne Gesicht, die Pfütze liest sich als Schatten.
  4. Splitter und ein naher Tropfen (schwarzer Ring) wirken wie eigene Effekte.
- **Vorschlag R4** (gleiche eine Operation):
  - große Stücke langsam (Endtempo etwa 1,2 m/s, 1–1,5 s in der Luft), dabei sichtbar 1–2 Umdrehungen;
  - beide großen Risse als Bögen, dazu ein breiter heller Rissrand;
  - das Gesichtsstück landet mit der Druckseite oben;
  - keine Splitter, die weit wegfliegen;
  - Tropfen nur nach unten;
  - Pfütze kleiner, nur unter den Stücken.

## Runde 4–5 Zerfall im Spiel und B: Bewegungs-Bibliothek R1 (04.11.)
**Zerfall im Spiel (R4, R5):**
- Kritiker R4: 5/10 und 4/10, R5: 3/10 und 4/10. Belege `SLOP_R5_*`.
- Ursache: Das Reißen dauerte null Bilder. Deshalb wird der Tod jetzt in Remotion als Teil von B gebaut (WS0 einverstanden).

**B · Bewegungs-Bibliothek R1:**
- Belege:
  - `SLOP_BEWEGUNG_R1.mp4` (18,5 s mit Ton);
  - `SLOP_BEWEGUNG_R1_Schluesselbilder.jpg`, `SLOP_BEWEGUNG_R1_Tod_Folge.jpg`;
  - `KONZEPTBLATT_SLOP_BEWEGUNG_R1.md`.
- Kurven-Datei `60_VIDEO/remotion/src/slop-anim/slopKurven.ts` (eine Quelle für Bild, Ton und Spiel), Komposition `Slop-Bewegung`, Ton-Skript `remotion/scripts/slop-bewegung-ton.mjs`.
- Schreck-Ton (A) in `slopVoice.js` (`schreck()`), fx/slop-r1 @83e74ead.
- Kritiker (ein Lauf, Runde 2 von B): Bewegung **6/10**, „liest sich als Papier“ **6/10**, „ein Effekt“ **4/10**. Runde 1 lag bei 4, 5 und 4.
- Was trägt:
  - Ducken vor dem Schreck, gestreckter Schrei in der Luft, Landung, maßvolle Verzerrung;
  - Panik-Zickzack;
  - Risslinie und Aufblitzen der hellen Rückseite.
- Was fehlt (Liste für Runde 2):
  1. Totes Standbild von etwa 3 s nach dem Liegen. Die Pfütze erscheint gleich in voller Größe.
  2. Das Ende schrumpft schwebend, statt in eine bleibende kleine Pfütze einzusickern.
  3. Zu wenig „zwei Hälften“: Es löst sich nur ein schmaler Streifen. Umkippen ist eine starre Drehung, ohne Biegen.
  4. Die Rückseite wirkt als konturlose Fläche wie ein Loch.
  5. Nachzittern und Treffer sind in den Proben kaum zu sehen.
  6. Gesicht und Ausdruck können sich nicht ändern, das ist ein festes Bild. Dafür bräuchte es ein „erschrocken“-Bild je Blob.
