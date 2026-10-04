# RETURN · Trommler v3 „Daumen innen" (Orc Brute, Mixamo-Körper) · 2026-09-24

**Status: zur Abnahme durch Georg, noch nicht abgenommen.**
Review: Artifact „Trommler v3" (claude.ai/artifact/FzZheXmS3RS18D435Hdz6y) · Videos `preview/dr_brute_v3_f34.mp4`, `preview/dr_brute_v3_front.mp4`

## Auftrag (Georg, 24.09.)
Die Hände waren nach außen gedreht. Sie sollen nach innen gedreht sein, Daumen innen, in natürlicher Haltung und ohne weitere Verdrehung der Gelenke. Danach die Keulen so winkeln, dass sie korrekt auf die Trommelfläche schlagen. Preview zeigen, Blender schließbar hinterlassen, auf GitHub dokumentieren.

## Vorgehen (anders als v1/v2)
- **Kein Optimierer auf Gelenkwinkel, keine IK.** Die Arme werden pro Frame analytisch gebaut (`v3_drum.py`):
  - Oberarm und Unterarm liegen in einer Ebene (Schulter–Ellbogen–Handgelenk), der Ellbogen ist ein reines Scharnier.
  - Die Handfläche kommt über die Unterarmdrehung nach unten, begrenzt auf ±18°.
  - Das Handgelenk macht nur Streckung und Beugung.
- **Einziges numerisches Lösen:** die Handgelenk-Position, sodass der Keulenkopf beim Treffer auf dem Fell liegt (3 Unbekannte, 3 Gleichungen, Newton). Kein Gelenkwinkel ist dabei frei.
- **Körper:** Mixamo „Playing Drums" unverändert, ohne die Armkanäle, als Action `DR_v3_body`. Die NLA-Basisspur ist stumm, aber erhalten.
- **Ausrichtung:** Das Armature-Objekt ist um −23,5° gedreht (Mixamo steht schräg zur Trommel) und 15 cm näher an die Trommel gesetzt.
- **Keulen:** Drehpunkt ist die mittige Griffposition. Der Winkel zur Unterarmachse ist jetzt 8° statt 90°, damit die Keule vorn aus der Faust kommt (zwischen Daumen und Fingern).
- **Treffer:** Georgs Marker „R Schlag" (11) und „L Schlag" (10). Die Trefferpunkte liegen bei x = ±0,45 und y = −1,9 auf dem Fell (Mitte y = −2,3, Radius 0,78).
- **Ausholen:** vor allem über das Handgelenk (−22° beim Treffer bis +40°). Der Unterarm hebt sich erst bei längeren Pausen (Hub ∝ s^1,8).

## Messwerte (alle 142 Frames)
| Größe | rechts | links |
|---|---|---|
| Ellbogen-Beugung | 87–119° | 88–115° |
| Unterarmdrehung | −17…+18° | −14…+17° |
| Treffer-Fehler Keulenkopf | ≤ 5 mm | ≤ 5 mm |
| Keule in Trommel | ≤ 4 mm | ≤ 8 mm |
| Keule in Kopf/Körper | 0 | 0 |

- Arme, Körper, Beine und Kopf in der Trommel: 0 Punkte (Paritätstest per Strahl).
- Die Limit-Constraints im Rig sind aktiv:
  - Ellbogen: Z 0…150, Y ±25 (neu, für die Unterarmdrehung).
  - Handgelenk: X ab −25 (vorher −20).
  - Die Pose ändert sich durch die Constraints um weniger als 0,001 mm. Alle Werte liegen also innerhalb der harten Grenzen.

## Bekannte Punkte
- Bei schnellen Doppelschlägen kreuzen die Keulen kurz vor dem Gesicht (Frontansicht).
- Die Beine kommen aus Mixamo, die Haltung ist leicht in der Hocke.
- Die GLB ist noch nicht in `orb_band_module` eingebaut. Das kommt nach der Abnahme.

## Dateien
- **Dropbox `BLENDER MCP/ORB/`:**
  - `DRUMMER_v3_DAUMEN_INNEN.blend` (nur Szene `DRUM_MANUAL`, sauber gespeichert)
  - `drummer_v3_daumen_innen.glb` (0,9 MB, Animation gebacken)
- **Unverändert:**
  - `orb_band_module_v5.blend` (Probe-Szenen verworfen, nicht gespeichert)
  - `DRUMMER_POSE_WERKSTATT.blend`
- **Repo `mixamo/v3/`:**
  - Skripte: `v3_drum.py`, `v3_checks.py`, `v3_render.py`
  - Daten: `v3_params.json`, `v3_bake_log.json`, `v3_checks.json`
  - `drummer_v3_daumen_innen.glb`
- **Nachbauen:** `exec(open("v3_drum.py").read())`, dann `setup_action()`, `set_object(-23.5,(0.143,-0.15,0))`, `set_stick_angle(8)`, dann pro Frame `pose_frame2` und `apply_pose(..., key=f)`.

## Blender
Offen ist nur `DRUMMER_v3_DAUMEN_INNEN.blend`, gespeichert. Blender kann ohne Nachfrage geschlossen werden und ist frei für den Racetrack-Chat.
