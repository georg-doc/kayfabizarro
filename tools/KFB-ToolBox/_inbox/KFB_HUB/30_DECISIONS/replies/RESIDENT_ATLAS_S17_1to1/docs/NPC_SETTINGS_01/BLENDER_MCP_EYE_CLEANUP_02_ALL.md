# Auftrag Blender MCP · EYE-CLEANUP-02 · alle übrigen Residents in einem Durchgang

**Von:** Resident Atlas (Claude Design) · **Für:** Coworker / Blender MCP · **Stand:** 2026-10-02 · candidate-only
**Repo:** `georg-doc/kayfabizarro` · Ablage `georg-doc-patch-3` · Quell-Commit je Datei wie in `data/cast.js` (Feld `commit:` am Eintrag, sonst `891eadf01e218f5fc21387e64cea1fec8332c5b6`)
**Verfahren:** wie `BLENDER_MCP_EYE_CLEANUP_01.md`. Charge 01 (Mummy_A, Mummy_B, Witch, Orc Brute) ist am 2026-10-01 mit PASS abgenommen und läuft im Atlas. Diese Charge macht den Rest **am Stück**.

## Arbeitsweise: Batch, nicht Einzelabnahme

- Alle Dateien unten nacheinander abarbeiten. **Nicht pro Figur zurückfragen.**
- Wenn eine Figur nicht sauber geht: `status: "blocked"` mit Grund und Bildausschnitt eintragen und **zur nächsten weitergehen**. Nicht raten, nicht anhalten.
- Figuren ohne sichtbare Augen (Helm, Visier, Maske, Schädelhöhle): `class: "none"`, keine Datei exportieren. Sie behalten im Atlas ihre Originalaugen bzw. bleiben ohne.
- Am Ende kommt **eine** Rückgabe. Georg nimmt alles in einem Durchgang ab.

## Dateien (30)

Pfade relativ zu `media/3D_Assets/`. `KMS6` = `KayKit_Mystery_Series6/`.

| # | id | Datei | Hinweis |
|---|---|---|---|
| 1 | gothgirl | `KMS6/GothGirl/characters/GothGirl.glb` | Make-up erhalten (siehe unten), Textur A und B |
| 2 | clown | `KMS6/11 - May 2024 - Clown/characters/Clown.glb` | Schminke erhalten |
| 3 | soldier | `KMS6/6 - December 2025 - Toy Soldier/ToySoldier.glb` | |
| 4 | farmer_a | `KMS6/12 - June 2026 - Farmers/Farmer_A.glb` | |
| 5 | farmer_b | `KMS6/12 - June 2026 - Farmers/Farmer_B.glb` | |
| 6 | caveman | `KMS6/8 - February 2025 - Caveman/characters/Caveman.glb` | |
| 7 | lorekeeper | `KMS6/1 - July 2025 - Lorekeeper/Lorekeeper.glb` | |
| 8 | knight | `KMS6/3 - September 2024 - Black Knight/characters/BlackKnight.glb` | Rig_Large, vermutlich `none` (Visier) |
| 9 | avian | `KMS6/9 - March 2026 - Avian Swordsman/AvianSwordsman.glb` | |
| 10 | warrior | `KayKit_Skeletons/characters/gltf/Skeleton_Warrior.glb` | Augenhöhlen: vermutlich `none` |
| 11 | rogue | `KayKit_Skeletons/characters/gltf/Skeleton_Rogue.glb` | wie 10 |
| 12 | mage | `KayKit_Skeletons/characters/gltf/Skeleton_Mage.glb` | wie 10 |
| 13 | demon | `KMS6/DemonLord/characters/DemonLord.glb` | Rig_Large |
| 14 | monster | `KMS6/4 - October 2025 - Monstrosity/Monstrosity.glb` | evtl. asymmetrisch, nicht spiegeln |
| 15 | orcA | `KayKit Legacy/Orc Warband - legacy/characters/gltf/character_orcA.gltf` | Legacy, `_eyes`-Teil ist eigener Knoten |
| 16 | orcB | `KayKit Legacy/Orc Warband - legacy/characters/gltf/character_orcB.gltf` | wie 15 |
| 17 | hero | `KMS6/UltraTurboHeroMan/characters/UltraTurboHeroMan.glb` | eine Datei für hero_red und hero_blue |
| 18 | cleric | `KMS6/3 - September 2025 - Cleric/Cleric.glb` | eine Datei für cleric und cleric_dark |
| 19 | creepy | `KMS6/5 - November 2023 - Animatronic/characters/gltf/Animatronic_Creepy.glb` | defekter Bär, Augen evtl. bewusst schief → im Bericht |
| 20 | normal | `KMS6/5 - November 2023 - Animatronic/characters/gltf/Animatronic_Normal.glb` | |
| 21 | figure | `KMS6/6 - December 2023 - Action Figure/character/gltf/ActionFigure.glb` | plus Wechselkopf `assets/gltf/ActionFigure_Head_B.gltf`, Anker dort an dessen Wurzel |
| 22 | marksman | `KMS6/10 - April 2026 - Marksman/Marksman.glb` | |
| 23 | hoarder | `KMS6/8 - February 2026 - Hoarder/Hoarder.glb` | |
| 24 | plant | `KMS6/5 - November 2025 - Plant Warrior/PlantWarrior.glb` | |
| 25 | gtn | `KMS6/7 - January 2026 - 4GTN/4GTN.glb` | Roboter: evtl. Display-Augen → `none` oder `texture` |
| 26 | gtn_forgotten | `KMS6/7 - January 2026 - 4GTN/4GTN_Forgotten.glb` | wie 25 |
| 27 | hiker | `KMS6/11 - May 2025 - Hiker/characters/Hiker.glb` | |
| 28 | prot_a | `KMS6/10 - April 2025 - Protagonists/characters/Protagonist_A.glb` | |
| 29 | prot_b | `KMS6/10 - April 2025 - Protagonists/characters/Protagonist_B.glb` | |
| 30 | pete | `KayKit Legacy/KayKit Character Animations 1.2 - legacy/Animations/gltf/KayKit_AnimatedCharacter_v1.2.glb` @ `10a7fdce` | Prototyp-Puppe, vermutlich `none` |

Bewusst nicht dabei: Clanker und Santa (unskinned), Magical Girl und Capsule Carl (Sonderfälle, eigener Auftrag).

## Je Datei

1. **Klassifizieren:** `island` | `texture` | `none` | `mixed`, mit Beleg (Mesh-Insel-Name bzw. UV-Rechteck).
2. **Entfernen:**
   - `island`: nur die Augen-Schalen löschen.
   - `texture`: in einer **Kopie** übermalen, Hautfarbe = Median direkt neben dem Auge. Originaltextur bleibt.
   - **Make-up, Eyeliner, Wimpern, Brauen, Schminke bleiben.** Nur Iris, Pupille, Augenweiß gehen. Wenn das nicht trennbar ist: `blocked`.
3. **Anker:** `eye_anchor.l` / `eye_anchor.r` als Kinder von `head` (Legacy: Kopfknoten der Figur). Position Mitte des alten Auges auf der Oberfläche, lokal +Z = Normale nach außen, Scale = Augenradius. Keine Spiegelung erzwingen.
4. **Export:** `<Dateiname>_NoEyes.glb` nach `skills/chat/workflows/EYE_CLEANUP_01_2026-10-01/glb/` (gleicher Ordner wie Charge 01). Gleicher Skin, gleiche Bone-Anzahl wie das Original, gleiche Bind-Pose, gleiche Material- und Mesh-Namen. Bindeprüfung mit `Idle_A` (Track-Anzahl gegen Original).

## Rückgabe (einmal, für alle)

- `eye-cleanup-02.json`, Schema `kfb.eye-cleanup/0.1-candidate`, ein Eintrag je Datei:
```json
{ "id": "gothgirl", "source": "<pfad>@<commit>", "out": "<pfad>_NoEyes.glb | null",
  "status": "done|none|blocked", "class": "island|texture|none|mixed",
  "removed": [], "uvRect": null, "skin": "#rrggbb",
  "anchors": { "l": { "pos": [], "normal": [], "r": 0 }, "r": {} },
  "bones": 0, "bindCheck": "Idle_A n/n", "notes": "" }
```
- **Ein Kontaktbogen** `eye-cleanup-02_contact.png`: je Figur eine Zeile, vorher/nachher, frontal und ¾, ohne Eye-Rig. Daraus nimmt Georg in einem Blick ab.
- `RETURN.md`: drei Listen — done, none, blocked (mit Grund).

## Danach im Atlas

Ein Schritt für alle: Ich lese `eye-cleanup-02.json`, trage jedes `done` mit seinem `skin` in `data/cast.js` ein und erweitere die Abnahmeseite auf alle Figuren. `none` und `blocked` behalten die Originalaugen, der Augen-Schalter ist dort ausgegraut.
