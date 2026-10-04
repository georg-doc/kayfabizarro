# Onboarding · frischer Chat (Claude Design, Projekt »KFB ToolBox«)
**Rolle:** Du arbeitest an `KFB ToolBox Production-02.dc.html`, einer Design Component im Projektwurzelverzeichnis. Georg schreibt knapp, oft per Sprache, auf Deutsch: Tippfehler sind normal, Absicht lesen.

## Zuerst lesen, in dieser Reihenfolge
1. `CLAUDE.md` (Projektregeln: Schatten-Rezept, eine Feld-API fürs Gesicht, DangleChain für Ketten).
2. `handover/PET_STUDIO_FEATURE_MAP.md` (was fertig ist, was fehlt, Sprintplan).
3. `handover/LESSONS_SHADOWS.md`, bevor du irgendetwas an Licht oder Schatten anfasst.
4. `github.md` (Repo, Pins, Sync-Historie). Der Schreibweg ist 403: nie »gepusht« behaupten.

## Architektur in 6 Zeilen
- Eine three.js-Laufzeit, drei Reiter: Studio (Szene, Edit-Layer) · **Animation Studio** (Clips, Scrub, Rollen, IK-Korrekturen) · Rigging (Eyes, Brows, Nose, Mouth, Moustache, Hair, Ears, Body, Import · Export).
- Owner-Module lokal unter `kfb-lib/` (face-mount, clay-lids, ear-base, body-shape, pose-rig, locomotion-profiles, lipsync-text, hair-tufts, pet-library). Gepinnte Repo-Module kommen über jsDelivr/raw (PIN 8922d4b1, Ohren 19088b14).
- Gesicht: jedes Feld geht über `face-mount.v1#makeFaceApi` (set/get/load/export). Neue Felder kommen dort hinein, nicht in die Oberfläche.
- Unten die Leiste Emotes · Viseme · Anim (`_padGroups`). Das 3D-Objektmenü ist der einzige Transform-Weg.
- Speichern: Workspace in localStorage (`kfb-toolbox-production-01`) je Actor-Profil. Rig-Dateien: kfb.pets/1.
- Selbsttest unter »…«. Nur wirklich gelaufene Tests heißen PASS.

## Nächste Aufgabe (Georg, 26.09.)
1. **Animation Studio im Layout von Animation Lab v1**, mit unserem Design. Die Quelle fehlt noch (siehe HANDOVER §2): zuerst nach der v1-Datei fragen bzw. sie aus `_inbox/ANIMATION_LAB_V1/` lesen. Nicht aus dem Gedächtnis nachbauen.
2. Danach die **neuen FBX-Animationen** nachziehen: als GLB-Bake über die Motion Library, mit Pin.
3. Dann Sprint S1 aus dem Feature-Map (aufklappbare Abschnitte, Erklärtext-Schalter, Emote-Werte speichern).

## Arbeitsregeln, die sich bewährt haben
- Kleine gezielte Edits, keine Neuschreibungen. Kein `//`-Kommentar mitten in einer einzeiligen Anweisung (hat 26.09. die ganze Logik lahmgelegt).
- Jede Änderung, die Georg sehen soll: am Ende `ready_for_verification`.
- Sichtbefunde aus Georgs Screenshots ernst nehmen; bekannte Wiedergänger stehen in LESSONS_*.
