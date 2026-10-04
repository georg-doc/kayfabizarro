# HANDOVER · WSA-Chat · RESIDENT-BAND-MODULE-01 · 2026-09-24

**Für Georg und den WSA-Chat.** Die Orc-Band ist ein Modul ohne Grundplatte und lebt im Resident
Atlas S8 als eigener Resident (`KFB_Resident_Atlas_S8.html#__band`). Vier Musiker, eine Uhr (der
Song), ein Root zum Verschieben. Die Posen macht Georg von Hand und prüft sie gegen die Schleife.
Status **candidate-only**. Kein Push, kein Merge, kein Deployment.

## Starten

```sh
python3 -m http.server 8080
# http://localhost:8080/KFB_Resident_Atlas_S8.html#__band
```

Braucht Netz: alle Geometrie, Clips und der Song laden per RAW-URL an gepinnten Commits.

## Was drin ist

| Rolle | Quelle @ Pin | Aktion | Stand |
|---|---|---|---|
| Leader | Legacy `character_orcB.gltf` @ `10a7fdce` + GothGirl-Mikro | `orb.bounce` (PR #195 `9dda7957`) | Georg OK |
| Gitarrist | `OrcRaider.glb` @ `891eadf0` + `guitar_B` @ `c19e291e` | `ml.guitar.a.fit`: KFB Motion Library `kfb_music_guitar_a` (PR #209 `f91c4e0f`) + Passung nach `gtr_apply.apply_fit2` | Clip Georg OK · Browser-Nachbau braucht Georgs Blick |
| Trommler | `OrcBrute.glb` @ `891eadf0` + Wardrum ×2 + zwei Schlägel ×2 | `orb.drum.v5c` (Standard) / `orb.drum.v0` | v5c = Arbeitshypothese |
| Trompeter · Erweiterung | Legacy `character_orcA.gltf` + `ToySoldier_Trumpet` ×0,72 @ `e0037d79` | `kfb.trumpet-groove.v1` (erzeugt: Kontrapunkt zum Leader) · Trompete in der Pfote | braucht Georgs Blick |
| Song | `Rubbish Groove 2min A extend 01.mp3` @ `c19e291e` | 100 BPM · Phase 0,465 s · Git-Blob im Browser geprüft | — |

## Verträge und Nahtstellen

- **Modul:** `data/resident-band-module-01.json` (`kfb.resident-band-module/1`) → `lib/band-module.js`
  `mountBandModule(def, { parent, anchor })` → `{ root, update(beatPos), place(), dispose() }`.
  Der Host gibt Fläche, Anker und Uhr. Das Modul hat keine eigene Uhr.
- **Erweitern:** siehe `extension.howTo`. Ein neues Mitglied ist ein Eintrag in `actors` plus seine
  Aktion in `actions`. Eine Aktion ist entweder ein Clip (`src`) oder eine erzeugte Pose (`gen`) mit
  einer Passung (`fit`). Optional kommen Grooves dazu (`groove`).
- **Posen:** Referenzposen je Figur und Bild im Studio (`band-01.<figur>.<aktion>@f<bild>`). Daraus
  wird je Figur ein konstanter Patch Δ = q_clip⁻¹ · q_pose, geprüft über alle Bilder. Das Ergebnis
  ist entweder ein Resident-Patch oder ein **POSE-TO-BLENDER-01**-Export mit der Differenz je Bild.
- **Werkzeuge in S8:** „Glieder": ein Klick auf Arm oder Körper greift den Bone, ein Klick auf eine
  Requisite die Requisite, mit dem Werkzeugmenü aus der Raumstudie. „IK" ist `CCDIKSolver` wie in
  `webgl_animation_skinning_ik`; beim Trommler zieht der Schlägelkopf. Puppe und Prüfstand wie in S7.

## Offen · in dieser Reihenfolge

1. **Georgs Blick** auf den Gitarren-Nachbau und den Trompeter-Groove, jeweils mit Play und Ton.
   Die Stärken des Grooves sind geschätzt (`groove.bob/hop/stab/fanfare/...` im JSON).
2. **Trommler-Handpose** an R Bild 0 und L Bild 25, dann „Durch Wiedergabe prüfen". Ergebnis:
   Resident-Patch übernehmen oder POSE-TO-BLENDER-01.
3. **Trommler v5c steckt 0,08–0,105 im Boden.** Nicht still korrigiert, denn anheben hebt die
   Schlägel mit. Gehört in Georgs Pose (Puppen-Hüfte hebt nur die Figur) oder in die v5-Nacharbeit
   mit Ausfallschritt.
4. **Trompeter:** dem starren Legacy-Arm fehlen 0,30 bis zum Mund. „In der Pfote" ist der Kompromiss
   (Mundstück 0,54 vom Mund). Die Promo-Haltung ginge nur mit längerem Arm, und das wäre eine
   Abweichung von der KayKit-Quelle. Für den Toy Soldier (Rig_Medium) passt dieselbe Passung, dort
   holt IK die Hand.
5. **Pins nachziehen**, sobald gemergt: PR #195 (Clips bounce/strum/drum) und PR #209 (Motion Library).
   Beide lesen heute an Branch-Köpfen.
6. **Bannerfuß** reicht 0,209 unter die Stützebene. Auf dünnen Flächen sieht man ihn unten herausschauen.
7. **ToolBox-Kandidat:** `lib/edit-layer.js` ist jetzt im dritten Einbau (S21 · S7 · S8).
8. Nicht übernommen: der lautstärkeabhängige Sprung des Leaders aus ORB (`audioReactive`). Der
   Trompeter liest die Lautstärke schon, der Leader noch nicht.

## Nicht behauptet

Keine Consumer-Integration (Taverne, Town, WorldBuilder), keine Browser-Abnahme auf Mobil, keine
Lizenzfreigabe für die Mixamo-Ableitung. Die FBX-Rohdateien bleiben privat in Dropbox.

## Dateien

Siehe `EXPORT_MANIFEST_S39.md` im Export. Ausführlich: `docs/RESIDENT_BAND_MODULE_01.md`,
additiv `CHANGELOG.md` (S39 · S39b · S39c · S39d).
