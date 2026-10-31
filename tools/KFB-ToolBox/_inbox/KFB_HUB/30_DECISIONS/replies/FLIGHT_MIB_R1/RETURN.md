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
