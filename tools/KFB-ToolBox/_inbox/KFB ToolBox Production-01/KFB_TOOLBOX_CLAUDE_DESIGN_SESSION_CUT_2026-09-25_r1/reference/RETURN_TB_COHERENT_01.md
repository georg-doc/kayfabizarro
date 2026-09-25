# RETURN · TOOLBOX-COHERENT-INTEGRATION-01 · 2026-09-24

Status: **FUNCTIONAL CANDIDATE · Claude-Preview 12/12 PASS · GEORG REVIEW PENDING**

## Repo / branch / head
- georg-doc/kayfabizarro · main · runtime pin `8922d4b1329fbd47b8754db9dd04ca6b9eb0ee9e` (kein eigener Commit — Schreibrecht fehlt)
- Resident-Assets `891eadf01e21…`, Pose-Clip `aa16a777a970…` (aus der Szenen-JSON)

## Changed files (this project)
- NEW `KFB ToolBox Stage-First Coherent-01.dc.html` — das Review-Artefakt
- NEW `handover/RETURN_TB_COHERENT_01.md`
- UPD `github.md`
- unverändert: `KFB ToolBox Stage-First Round1.dc.html`, `kfb-lib/*`

## Owners consumed (not rebuilt)
- Selection/transform/drop: `tools/KFB-ToolBox/lib/edit-layer.js` (ein Picker, ein Gizmo, Menü am Objekt)
- FrizzleBob: `kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js` + Profil `kfb-pet-graft-driver.georg-2026-09-15.json` (v1.2.9, pet v7, Host Driver)
- Eyes: EyeRig v6 `petstudio-v9/studio-v12/pet-eye-rig.v6.js` — dieselbe Modul-URL für Graft und Cube Pets
- Resident: `tools/resident_atlas/scenes/caveman-cave-camp.json` (11 Assets, Pose vor Bodenkontakt, Ground-Lock)
- Persistenz: `kfb-worldbuilder-scene` v1 Objekt-Records wie WB2/R2

## Actual tests (Selbsttest unter „…", echte Quellen, Vorschau)
01 Roster 26 (Graft 1 · Cube Pets 24 · Resident 1) · 02 Graft gemountet · 03 Szene 11/11 · 04 Auswahl Caveman · 05 Move · 06 Rotate · 07 freies Scale 1.2/0.9/1.1 · 08 Drop Axe → Rock_1_P_Color1 y 2.362 · 09 Save · 10 Reload stellt Edits wieder her · 11 Graft nach Reload wieder da · 12 weiter editieren → **12/12 PASS**

## Unresolved visible issues
- Architecture-v3 `START_HERE.md` nicht auffindbar (GitHub main + Dropbox) → SOURCE_REQUIRED.
- Die optionalen Teile der Graft-Kette (Carl-Braue/-Nase via `facegraft.v1` → `kfb-ink-canon.js`) sind bei einem kalten CDN-Aufruf einmal still ausgefallen; jetzt vorgewärmt + jeder Ausfall als rotes Banner gemeldet.
- Cube Pets sind im Maßstab ~1 (nativ) neben dem 2,2er Caveman/Graft — gewollt, aber sichtbar klein.
- Die obere Leiste wird bei ~832 px eng (Save/Reload bleiben knapp sichtbar).
- Motion / Voice bleiben inaktiv (TB-ANIM-01 / später).

## Exactly one next capability
**TB-EYE-01 · EyeRig Production Studio** — Legacy-17-Profile front / 3/4 im Face-Reiter dieser Datei, gespeichert über denselben Szenendoc-`eye`-Patch.
