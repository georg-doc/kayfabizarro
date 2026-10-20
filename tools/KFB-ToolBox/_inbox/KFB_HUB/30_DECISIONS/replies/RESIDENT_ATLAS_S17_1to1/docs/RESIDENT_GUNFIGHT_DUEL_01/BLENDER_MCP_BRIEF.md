# BLENDER-MCP · Auftrag BLENDER-DUEL-01 · Fernkampf-Clips und Waffen-Sockel · 2026-10-04

Für den Blender-MCP-Chat. Quelle der Wahrheit für die Laufzeit ist `lib/gunfight-duel-01.js` + `data/gunfight-duel-01.json`
im Resident Atlas (`KFB_Resident_Atlas_S17.html#__duel`). Dieses Dokument sagt, was die Laufzeit heute **zur Laufzeit
ausgleicht** und was Blender stattdessen **ins Asset backen** soll, damit die Korrekturen verschwinden.

## Rahmen

- Rigs: KayKit `Rig_Medium` (Pflicht) und `Rig_Large` (gleiche Namen, zweiter Export). Knochen: `hips`, `chest`, `head`,
  `upperarm.l/.r`, `handslot.l`, `handslot.r`. Waffen hängen an `handslot.r`.
- Ablage: `georg-doc/kayfabizarro` · `media/3D_Assets/Animations/KFB_Motion_Library/libs/<Rig>/KFB_Motion_<gruppe>.glb`,
  Katalog-Eintrag wie bestehende Clips (`frames`, `loop`, `rootMotion`, `props`). Heute gelesen @ `georg-doc-patch-3`
  (Branch, ungepinnt). Bitte nach der Lieferung einen Commit-SHA nennen.
- Namensschema wie die Bibliothek: `kfb_<kategorie>_<name>_<variante>`.
- Originale der KayKit-Packs bleiben unverändert. Geänderte Waffen als neue Datei `<Name>_KFB.glb`.
- 30 fps. In-place, außer wo ausdrücklich `travel`.

## Was die Laufzeit heute ausgleicht (gemessen)

| Punkt | Heute | Folge |
|---|---|---|
| Pistolen-/Blasterhaltung | `kfb_action_shooting_gun_a` Bild 40 als Haltepose (Bild 61 verworfen, Arm 101° seitlich). Blaster: Lauf +Z → Slot +X, **Roll 75°**, **Griffkorrektur 23,3°** | Lauf liegt auf der Bahn (≤ 3,2°), aber **Georg: Blasterhaltung sieht nicht richtig aus** |
| Gewehr | kein Schuss-Clip. Beine `Idle_A` + Oberkörper `Running_HoldingRifle` bei 0,3 s, Rückstoß prozedural | **linke Hand liegt nicht am Gewehr** (kein IK) |
| Minigun | gleiche Gewehr-Schicht, Lauf dreht zur Laufzeit (`CombatMech_Minigun_Barrel`, 2,4 U/s) | Haltung geliehen, kein Feuerstoß im Körper |
| Mündung | aus der Geometrie gemessen (Vertex-Scheibe am langen Ende) | bricht, sobald ein Modell anders gebaut ist |
| Würfel | prozedural (weißer Körper, dunkle Augen) | Arena-Würfel nicht eingebunden |
| Treffer-Richtung | `Hit_A` (KayKit) bzw. `standing_react_small_from_right` (Richtung geschätzt) | Schüsse kommen von vorn |

## Aufträge (Priorität von oben)

**B1 · Blaster-/Pistolenhaltung neu.** `kfb_action_aim_blaster_a` (Loop, Halten) und `kfb_action_shoot_blaster_a`
(einmal, Rückstoß im Arm, 8–12 Bilder). Rechte Hand. Der Lauf zeigt in der Haltung entlang **+Z von `handslot.r`**, damit die
Laufzeit Roll 0 und Griff 0 setzen kann. Ruhige Schulter, Ellbogen leicht gebeugt, Blick über den Lauf.
*Abnahme:* Oberarm–Unterarm–Lauf zur Schusslinie ≤ 5°, Lauf zur Bahn ≤ 3° ohne Laufzeitkorrektur, Griff sichtbar in der
Handfläche (Nahaufnahme), alle Spuren binden (Hero Man heute 69/69).

**B2 · Gewehr beidhändig.** `kfb_action_aim_rifle_a` (Loop) und `kfb_action_shoot_rifle_a` (einmal, Rückstoß in Schulter
und Oberkörper). `handslot.l` liegt am Vorderschaft von `ToySoldier_Rifle`. Damit entfällt IK zur Laufzeit.
*Abnahme:* linke Hand zum Socket `socket_grip_l` ≤ 0,02 Figurhöhen über den ganzen Clip, Lauf zur Bahn ≤ 3°.

**B3 · Minigun aus der Hüfte.** `kfb_action_hold_minigun_a` (Loop) und `kfb_action_fire_minigun_a` (Loop, Feuerstoß-Zittern,
Takt 0,11 s wie Arena-Stinger). Zwei Hände. Lauf-Drehung bleibt Laufzeit.

**B4 · Waffen-Sockel.** In `UltraTurboHeroMan_Blaster`, `ToySoldier_Rifle`, `CombatMech_Minigun` Empties
`socket_grip_r`, `socket_grip_l` (wo sinnvoll), `socket_muzzle`. Lauf entlang +Z, Ursprung = `socket_grip_r`.
Die Laufzeit liest dann die Sockel statt zu messen.

**B5 · Würfel.** Würfel-GLB mit Augen (Vorbild Arena `kfb-weapon-dice.js`), Höhe 0,14 Figurhöhen, Ursprung Mitte.

**B6 · Treffer von vorn.** `kfb_reaction_hit_front_small_a` und `_big_a` (Rückstoß nach hinten, in-place oder kurzer
`travel` ≤ 0,3 m). Tod von vorn existiert schon (`kfb_reaction_death_from_the_front_a`).

**B7 · Ring-Bausatz (später, für die Stage).** Kein fester Ring. Ein **Bausatz**: Eckpfosten, Seilsegment, Boden-Kachel,
Schürze. Seile als **Gummibänder**: Segment mit 3–5 Knochen oder Shape-Keys für die Durchbiegung, damit die Laufzeit
den Rückprall zeigen kann. Größe setzt die Stage-Instanz (Rig-Klasse der Besetzung); Fight 02 lief mit 9 m für Medium.
Erst nach WSA-STAGE-01 bauen, damit Maße und Knochennamen aus dem Vertrag kommen.

## Bestehende Blender-Punkte aus Fight 02 (nicht vergessen)

`docs/RESIDENT_FIGHT_SANDBOX_02/GEORG_FEEDBACK_2026-09-30.md`: Hammer im eigenen Körper (Requisiten-Kapsel), liegende
Figuren 30–62 % unter dem Boden, Wunschliste Schubsen / Tackle / Body Slam.

## Rückgabe

`BLENDER_DUEL_01_RETURN.md`: je Clip Name, Rig, Bilder, Loop, rootMotion, Datei + Commit-SHA, und die Abnahmewerte als
Zahl. Je Waffe die Sockel mit Weltlage in der Bind-Pose. Nicht gemessene Werte heißen NOT_RUN.
