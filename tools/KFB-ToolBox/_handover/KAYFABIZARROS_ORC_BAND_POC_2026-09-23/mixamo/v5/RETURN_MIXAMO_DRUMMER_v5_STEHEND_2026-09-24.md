# RETURN · Trommler v5 „stehend" (Orc Brute, Mixamo Breathing Idle) · 2026-09-24

**Status: zur Abnahme durch Georg, noch nicht abgenommen.** Review-Seite: Artifact „Trommler v5".

## Verlauf heute
- **v3:** abgelehnt. Die Keule steckte zwischen den Fingern, weil sie 8° zum Unterarm gedreht war.
- **v4:** Griff korrigiert (Keule quer durch die Faust). Beim Ausholen gestoppt: Der sitzende Mixamo-Körper (Playing Drums) hatte den Kopf weit vorn, die Keulen kreuzten sich oder gingen durch den Kopf.
- **v5:** Georgs Entscheidung ist ein stehender Körper (Breathing Idle), mit Körpereinsatz beim Ausholen und beim Schlag.

## Bewegung (Loop, 2 Schläge = 48 Frames bei 24 fps)
- **Rechts trifft auf Schlag 1** (Frame 1), **links auf Schlag 2** (Frame 25).
- **Griff:** Originalgriff, Keule quer durch die Faust.
  - Beim Treffer: Handrücken oben, Daumen innen, Keule quer nach innen aufs Fell (Georgs Skizze 2).
  - Beim Ausholen: Der Unterarm dreht bis Daumen oben, die Keule steht hoch (Skizze 1).
  - Schlag: im Bogen nach unten.
- **Körper:** Zurücklehnen beim Ausholen, Vorlehnen und Eindrehen der schlagenden Schulter beim Treffer, leichtes Einknicken. Die Füße sind per Bein-IK fest am Boden.
- **Arm-Ziele relativ zur Schulter:** Die Hände wandern mit, wenn der Körper sich lehnt.

## Messwerte (alle 48 Frames)
| Prüfung | Ergebnis |
|---|---|
| Keulenkopf auf dem Fell beim Treffer | ≤ 4 mm |
| Keule in Kopf / Körper / Trommel | 0 |
| Keule gegen Keule | 0 |
| Arme in der Trommel | 0 |
| Ellbogen | 77–100° |
| Unterarmdrehung | −38° (Treffer) bis +80° (Ausholen) |

## Timing zur Musik
- Gebaut mit 24 Frames pro Schlag, passend zum `beatClock` in `module.json`. Die Clip-Zeit ergibt sich aus BPM und Startversatz des Stücks, der Treffer liegt bei jedem Tempo auf dem Schlag.
- Pro MP3 werden BPM und Startversatz gebraucht, entweder vorab gemessen (wie beim Rubbish Groove mit librosa) oder live im Browser.
- **Nächster Schritt für freie Musik:** Einzelschläge rechts und links als eigene Clips, ausgelöst auf erkannte Akzente.

## Offen
- Ausfallschritt als Akzent-Clip.
- Einbau ins Band-Modul.
- Die Animation heißt im GLB „Animation"; die Blender-Action heißt `drum`.

## Dateien
- **Dropbox `ORB/`:**
  - `DRUMMER_v5_STEHEND.blend` (gespeichert)
  - `drummer_v5_stehend_loop2.glb`
  - Zwischenstand v4: `DRUMMER_v4_WIP_HAMMERGRIFF.blend`
- **Repo `mixamo/v5/`:**
  - Skripte: `v5_drum.py`, `v4_drum.py`, `v3_drum.py`, `v3_checks.py`
  - Daten: `v5_params.json`, `v5_log.json`, `v5_idle_base.json`
  - Videos und GLB
