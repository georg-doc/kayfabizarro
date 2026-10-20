# Onboarding · frischer Chat · NPC-SETTINGS-01 · fehlende Characters mit Promo-Setting

**Stand:** 2026-10-01 · Atlas S15 · 27 Residents · Fight-Strang geparkt (`docs/RESIDENT_FIGHT_SANDBOX_02/RESUME_LATER.md`)

## Ziel

Die Mystery-Figuren (und ausgewählte andere), die noch keine Resident-Vignette haben, als **NPC mit ihrem individuellen Setting aus dem Promo-Bild** in den Atlas holen. Gleiches Rezeptformat wie die 27 bestehenden (`data/cast.js`): Aktor, Habitat-Basis, Landmarke, bis zu sechs Signatur-Requisiten, Pose-Bindung, Referenzbild. Alles `candidate-only`.

Zweite Frage im selben Chat: wie weit das **Eye-Rig als Option** gezeigt werden kann (§5).

## Lesereihenfolge (10 Minuten)

1. `docs/RECOVERY.md` — vier Regeln, fünf Fehlerklassen.
2. Kopf von `data/cast.js` + **ein** fertiges Rezept als Muster (Vorschlag: `witch` oder `hoarder`, beide mit Promo-Setting und Requisiten).
3. `data/npc-gap-list-01.json` — die Lücke, maschinenlesbar.
4. `docs/PACK_GAPS.md` §1–2 — was wirklich im Repo liegt.
5. `docs/EYE_RIG_BATCH_REVIEW_S38.md` + `docs/RIG_WERKSTATT_S7.md` §E5 — nur für §5.

## 1 · Bestand und Lücke (gezählt am 2026-10-01)

**Mystery, als Resident vorhanden (22):** Lorekeeper, Orc Brute, Cleric, Monstrosity, Plant Warrior, Toy Soldier, 4GTN, Hoarder, Avian Swordsman, Marksman, Farmers, Clown, Hiker, Protagonists, Black Knight, Witch, Animatronic, Action Figure, Caveman, Demon Lord, Goth Girl, Ultra Turbo Hero Man.

**Mystery, ohne Resident (19):**

| Jahrgang | Figuren |
|---|---|
| 2023 | Orc Raider¹ · Driver · Monster Costume · Werewolf |
| 2024 | Space Ranger · Ninja · Survivalist · Paladin · Combat Mech · Robot · Superhero · Vampire · Helpers |
| 2025 | Frost Golem · Clanker · Tiefling |
| 2026 | Magical Girl |
| ohne Monat | Capsule Carl · Santa |

¹ Orc Raider kämpft in der Fight Sandbox, hat aber keine Vignette.

**Andere Quellen:** Adventurers 2.0, Skeleton Minion (nur Disco), Mannequin, Quaternius Space Kit (12 Charakterdateien), Quaternius Monster Pack (eher Mobs).

**Widerspruch zuerst klären:** `PACK_GAPS.md` nennt Mystery **Series 7** „indexiert", die Registry kennt es nicht. Dazu ist das Datum des Registry-Snapshots unbekannt. Also: erster Schritt ist eine Zählung, nicht ein Rezept.

## 2 · Erster Sprint: Inventur (vor jedem Bau)

Je Kandidat eine Zeile, per Inhaltssuche im Repo gezählt (Regel S28: die Baumansicht filtert `.gltf`/`.bin` weg):

| Feld | Wie messen |
|---|---|
| Charakter-GLB | Pfad, `skin`, Joints, Rig-Klasse (Medium/Large/Legacy/fremd) |
| Promo-Bild | `artwork.png` / `promo.png` / `contents.png` vorhanden? Pfad |
| Setting-Requisiten | Anzahl Props im Ordner, welche im Promo sichtbar sind |
| Fehlt fürs Setting | was das Promo zeigt und kein Pack liefert (Ersatz Kenney/Quaternius oder weglassen) |
| Augen | als Mesh-Insel, in der Textur, hinter Helm/Maske, keine (§5) |

Ausgabe: `data/npc-gap-list-01.json` ergänzen (nicht neu anlegen) + Kontaktbogen der Promo-Bilder.

**Abbruchkriterium:** Kandidaten ohne Promo-Bild oder ohne skinned GLB kommen auf eine Warteliste, nicht in den Bau.

## 3 · Fragen an Georg (zu Beginn des Chats stellen)

1. Welche der 19 zuerst? Vorschlag nach Setting-Reichtum: **Vampire** (35 Dateien), **Werewolf** (38), **Survivalist** (35), **Space Ranger** (34), **Paladin** (32). Helpers (54) ist eine Gruppe und verdient eigene Planung.
2. Gehören Adventurers 2.0 und Quaternius-Figuren in diesen Strang oder später?
3. NPC heißt hier: Vignette wie bisher, oder zusätzlich Verhalten (Idle-Schleife, Blick zum Spieler, `makeWalker` aus `lib/resident-collide.js`)?
4. Promo 1:1 nachbauen (Kamera, Licht, Anordnung) oder Setting sinngemäß?
5. Eye-Rig im selben Chat bauen oder nur die Option belegen (§5)?

## 4 · Bauweg je Figur (bewährt)

1. Promo-Bild als `reference.src` (RAW-URL, nicht `uploads/` — sonst fehlt es im Export).
2. Aktor laden, Rig-Klasse **messen** (Black Knight und Demon Lord sind trotz gleicher 23 Bone-Namen Rig_Large).
3. Pose aus dem Promo wählen, Bindung prüfen (`poseFreeze`, `poseTime`).
4. Requisiten nach der Identitätsregel im Kopf von `cast.js`: Hand-Requisite zuerst, dann Landmarke, dann Habitat.
5. `tools/prop-qa.html?resident=<id>` laufen lassen. Mehr als drei Auffälligkeiten → erst reparieren.
6. Neue Atlas-Datei **S16** (S15 bleibt Fight-Messbasis).

## 5 · Eye-Rig als Option — Einschätzung

**Kurz:** Als Schalter „Augen: Original / Eye-Rig" je Resident ist es machbar. Die Montage ist gelöst, das Ausblenden der Original-Augen nicht.

**Was schon steht:**
- `lib/frizzlegraft/facehost.v1.js` baut die Gesichts-Box `body` am Kopfknochen für **beliebige** Figuren — EyeRig und PetMouth hängen sich dort ein, ohne das Rig zu kennen. Im Einsatz beim FrizzleBob-MC der Disco (S40e).
- Ein Profil-Batch für vier Rig_Large-Figuren (Monstrosity, Black Knight, Demon Lord, Orc Brute), Schema `kfb.eye-profile-batch/0.2-candidate`.
- `docs/RIG_WERKSTATT_S7.md` §E5 sieht den Schalter schon vor: in der Korrektur-Sammelstelle, exportierbar wie eine Pose.

**Was fehlt (aus dem S38-Review, unverändert offen):**
1. Lidfarbe ist bei allen vier derselbe Rückfallwert `#b58f83`. Muss je Figur gemessen werden (`tools/eye-lid-color-probe.html` misst das).
2. `pairConfidence` ist eine Konstante 0,7. Muss aus der Kandidatenlage gerechnet werden; Monstrosity fällt dann auf (Paar nicht gespiegelt, 6,4 % Kopfbreite).
3. `sourceEyeCleanupVisuallyAccepted: false` bei allen vier. **Das ist der eigentliche Engpass:** Sitzt das neue Auge nicht exakt über dem alten oder bleibt das alte sichtbar, sieht man vier Augen.

**Stufen, die man zeigen kann:**

| Stufe | Inhalt | Voraussetzung | Ehrlich zeigbar? |
|---|---|---|---|
| 0 | Eye-Rig **über** den Original-Augen, Debug-Ansicht „beide" | nur facehost | nur als Werkzeug, nicht als Look |
| 1 | Schalter Original / Eye-Rig für die 4 Rig_Large-Figuren | Review-Punkte 1–3 erledigt | ja |
| 2 | Rig_Medium-Klasse (Großteil der Residents) | Klassen-Saatgut, Profil je Figur, Augen-Klassifikation aus §2 | ja, figurweise |
| — | Helm, Maske, Visier, Roboter, Schädel, Wechselgesicht | — | eher „keine Option" je Figur markieren |

**Original-Augen ausblenden, zwei Wege:**
- **Augen als eigene Mesh-Insel:** zur Laufzeit die Dreiecke der Insel ausblenden (Index-Puffer), Original bleibt unberührt, Schalter zurück jederzeit. Die Inseldetektion im Batch deutet auf diesen Fall hin, belegt ist er nur für die vier.
- **Augen in der Textur:** Augenfläche in einer Kopie der Textur mit der gemessenen Gesichtsfarbe übermalen. Bei der flachen KayKit-Palette ist das sauber, braucht aber UV-Bereich je Figur.
- In beiden Fällen gilt: Abnahme per Blick (Georg), nicht per Prüfsatz.

**Vorschlag:** Erst Stufe 1 mit **einer** Figur (Orc Brute: 3 Kandidaten, Spiegelabweichung 0) als Beleg. Dann entscheidet Georg, ob die neuen NPCs gleich mit Augen-Klassifikation inventarisiert werden — das kostet in §2 eine Spalte und spart später einen Durchgang.

## Owner-Grenzen (unverändert)

Atlas: Komposition, Messung, Kandidatenrezepte. Animation Lab: Rig-, Motion-, Attachment- und Eye-Rig-Freigabe. Blender-MCP: Clips, Requisiten-Kapseln. Alle Ausgaben `candidate-only`.
