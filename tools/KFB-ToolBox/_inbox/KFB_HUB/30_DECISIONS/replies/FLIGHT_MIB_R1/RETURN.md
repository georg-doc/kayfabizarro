# game/flight-mib-r1 · Rückgabe an WS0 · 31.10.2026 (V-1059, V-1062, V-1065)
Merge nach So 20 Uhr durch WS0. Der Build braucht `src/private` mit assets/private ab c8b5d13; ohne die Dateien läuft das Spiel weiter (Jetpack r2d, Jump_Idle im Flug, kein MiB).

**Schalter:** `jetvar=r2d|cape` (Standard Rakete), `jetsmoke=0`, `mib=0`, `mibauto=<s>`. Auslöser zum Testen: `__kfbM1.mib().spawnAhead()` mit `debug`.

**Aufnahmen hier im Ordner:** Rakete_Flug, MiB_V1, Cape_Flug, Ruhe_am_Hang. Spielkamera, Hash der Site. Prüfskript `test/flight-mib-clip.mjs`.

**Gemessen:** Abgas-Ausstoß frei 74, im Kampf 14 Puffs je 180 Schritte (V-1043, Kampf nur über die Prüfhilfe `smoke.force`, Budget je Zelle bleibt beim Mess-Spike). MiB-Modul Spitze 2,2 ms je Bild gegen 1,5 ms aus V-603. Kopf in Ruhe am Hang mindestens 0,69 über Grund, eben 0,70.

**Offen im Spiel:**
- Orb-Auge ist ein Augapfel mit Pupille in den drei Zuständen, ohne Augen-Rig und Lider (V-737 nur teilweise).
- Turm und Agenten haben keine Kollision, die Figur läuft durch.
- Opfer ist eine eigene Figur, die vor dem Turm in den Ort geht, kein vorhandener Bewohner.
- Ort: im Blickfeld statt außer Sicht (V-637), damit man die Landung sieht. WS0 entscheidet.
- Raketen-Skins und Materialzonen sind nur getrennt geladen, nicht geprüft. Cape nur über `jetvar=`, Merkmal in der Figurenkarte fehlt.
- Cape im schnellen Flug von hinten schmal (WSB-Befund bestätigt).
- `test/deps.mjs` meldet `oneThreeInstall`: am verlinkten node_modules des Worktrees, Pakete sind unverändert.
- Beobachtet, nicht von diesem Branch geändert: Figur driftet in Ruhe am Hang langsam talwärts.

## Runde 2 · game/flight-mib-r1-orb @70d8e0f3 · 31.10.2026
**Flamme:** Ursache war das Rechnen vor der Bild-Interpolation: Flamme und Rauch standen dort, wo die Figur im Bild davor war. Jetzt in `M1INTERP.preDraw`. WSBs Lesart (a) trifft zu, (b) nur teilweise (Tropfen erbten 78 % des Tempos, jetzt 100 %). Nahbilder: `Rakete_Flamme_Nahbilder.jpg`, Aufnahme `Rakete_Flug_Flamme.mp4`.
**Cape:** r1c mit Flug r1h eingebaut. Anker am Knochen chest, Endlage aus dem Vertrag. `Cape_r1c_Nah.mp4`, `Cape_r1c_Nahbilder.jpg`.
**MiB:** Aufnahmen `MiB_R2.mp4`, `MiB_R2_Tuer_nah.mp4`. Aus den Ablaufdaten laufen `pulses_in_s`, `pulses_out_s`, `preview_silhouette_s`, `land_s`, `lift_s`, `tower[]`, `door`, `door_light[]`, `orb`, `agents`, `victim`-Zeiten nach WSBs Kette, `beam_s`, `ruf_s`, `eye_c`. Sprites aus FX_Visual: `vortex_6x5`, `electric_ring_6x5`, `spotlight_03` (verkleinert in `src/assets/fx/brackeys`). Schatten: Sonnenbereich des einen Rigs umfasst Turm und Figur, solange das Ereignis läuft.
**Offen:** MiB-Spitze jetzt 3,1 ms (vorher 2,2). Die Leuchtfläche hinter der Tür ist eine flache weiße Fläche ohne Tiefe. Rauch am Turm von der Landung ist nur noch ein kurzer Kranz.
