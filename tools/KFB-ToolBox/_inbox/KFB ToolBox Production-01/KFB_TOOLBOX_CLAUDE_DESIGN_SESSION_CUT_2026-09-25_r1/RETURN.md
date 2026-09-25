# RETURN · TOOLBOX-PRODUCTION-01 · 2026-09-25

Status: **FUNCTIONAL CANDIDATE · Claude-Preview 13/13 PASS · GEORG REVIEW PENDING**

## Artifact
`KFB ToolBox Production-01.dc.html` (Projektwurzel). Coherent-01 bleibt unverändert als Vorstand.

## UI — umgebaut, nicht angeklebt
- Zwei Hauptbereiche oben: **Studio · Animation Lab**. Tab-Wechsel baut die Figur nicht neu (Selbsttest 06/11: Runtime identisch, Build-Zähler unverändert).
- Ein festes Raster in beiden Tabs: oben *was* (Actor ▾ mit Rig-Familie, Stage ▾), rechts *Inspektor* (300 px), unten *Werkzeug* (Studio: Transform-Leiste · Lab: Timeline-Dock), Bühne dominant und frei (Lehre aus AN-PROFILE-02 FAIL).
- Studio-Inspektor: Body · Face · Pose · Scene statt Body/Face/Motion/Voice/Messen; inerte Tabs entfernt. Reload wanderte ins „…“-Panel → Kopfzeile passt bei 832 px.
- Pose direkt am Objekt: IK-Punkte (Hand L/R, Fuß L/R) auf der Bühne anklicken → derselbe Edit-Layer-Anfasser (`borrow`) → kleines Kontextmenü am Punkt (Unpin/Delete · ✕). Kein zweiter Gizmo.
- Animation Lab: Clip ▾ (Motion Library 33 nach Gruppe · KayKit stock · Legacy 1.2), Transport, Loop, Speed, Scrub-Timeline mit gemessenen Fußkontakten (AN-PROFILE-01) und Korrektur-Rauten.

## Owners consumed (not rebuilt)
- Edit-layer `lib/edit-layer.js` @8922d4b1 · Graft `graft-mount.v1` im Modus `animation:'host'` (ToolBox besitzt den einen Mixer) · EyeRig v6 · pet-mouth v1 (Viseme/Talk/Set) · Pose `pose-rig.v1` (Solver A, `_solve`)
- Motion Library 01 @032c9d50: Katalog + Profil-Katalog + `motion-profile-reader.v1.js` direkt (gleiche Pins/Prüfungen wie `stage-first/src/lab/motion-library.v1.js`, PR #185); GLB Rig_Medium/Large lazy
- KayKit stock: Graft über `biped.allClips()` (General + MovementBasic); Brute: `Rig_Large_MovementBasic` @b97b5ac5
- Legacy: Resident-Atlas-Regel (4 Teile → 6-Bone Rig_Legacy via boneInverses) + In-Memory-GLB-Packung aus TMB-1E (Georg-accepted) @10a7fdce; Builder: Body/Head/Arms je Orc A|B, Held item (Sword/Hammer-axe/Shield/Banner) mit Griff-Fit am Anfasser
- Orc Brute (Rig_Large) @891eadf0 mit explizitem Textur-Adapter

## Datenvertrag (Workspace `kfb-toolbox-workspace` v1, Key `kfb-toolbox-production-01`)
- `scene` = `kfb-worldbuilder-scene` v1 (WB2/R2-Records unverändert)
- `actors[id]` = Actor Profile (face.eye/mouth/brow/nose, legacy build)
- `poses[id]` = Pose Profile (angles + IK-Ziele + gemessene Miss, **kein Look**)
- `motion[actor]` = Motion Profile (roles → clipRef, clips[ref]: loop, speed, calibration, corrections[{target, frame, radius, type: key|contact|override|blender, pos}])
- `active[actor]` = aktive Pose / Pose an

## Tests (Selbsttest „…“, echte Quellen)
01 Studio offen · 02 Graft (Rig_Medium, Pose OK, 26 stock clips) · 03 EyeRig + Mund (Viseme open→oh, Talk) · 04 IK Hand R miss 0.0000 · 05 Pose Profile gespeichert · 06 Lab ohne Rebuild · 07 `kfb_music_drums_a` 69/69 Tracks · 08 Scrub f60 · 09 Kontaktkorrektur f60 miss 0.0000 · 10 Rolle `music.drums` + Profil · 11 zurück ins Studio, nichts verloren · 12 Reload stellt Pose/Rolle/Korrektur her · 13 Legacy-Builder 4 Teile + 30 Clips → **13/13 PASS**

## Befund (für Solver-Vergleich)
Solver A (`pose-rig.v1`) nimmt die Unterarmlänge aus `F.position`. Am Driver hängt `handr` unter `wristr` → 0.074 statt gemessen 0.334, Hand verfehlt ihr Ziel um ~0.05. Die ToolBox misst Achsen/Längen je Lösung neu (bis 4 Durchgänge des unveränderten `_solve`). Owner-Fix gehört in `pose-rig.v1`, nicht hierher.

## Offen / sichtbar
- Solver B/C (CCDIKSolver, constrained) noch nicht verglichen — Miss-Messung steht dafür bereit.
- Rig_Large-Fußkontakte bleiben „unknown“ (Vertrag: nicht von Medium kopiert).
- Orc Brute / Legacy haben keinen Face-Owner (TB-PRODUCTION-04). Rig_Legacy hat keine IK-Ketten.
- Jump-State-Kette, State-Graph, Vehicle Fit, Bubbles, Materials: nicht in diesem Slice.
- Push weiterhin nicht möglich (403).

## Exactly one next gate
**GEORG HUMAN REVIEW · TOOLBOX-PRODUCTION-01** im echten Host: Figur laden → Gesicht → Hand per IK → Pose speichern → Lab → Drum-Clip → Kontakt fixen → speichern → zurück.
