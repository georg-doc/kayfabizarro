# FB Web-Kanon · r1f: vier Katana-Clips für den Hero-Shot · RETURN (WSB, Mac mini, 14.11.2026, V-1766)

**Auftrag (WS0, Claude Design über Georg):** Zu `FB_WEB_KANON_agent_twin.r1e.glb` vier Clips aus vorhandenen Bibliotheken, unverändert übernommen:
1. tiefer Hieb mit der Spitze am Boden;
2. waagerechter Hieb auf Hüfthöhe;
3. kurzer Dash mit gezogenem Katana;
4. Schlusspose.

| Datei (`_privat_kauf_asset/`) | Größe | sha256 (Anfang) |
|---|---|---|
| `FB_WEB_KANON_agent_twin.r1f.glb` | 5,73 MB | f1f1295c456beb02 |

**Inhalt:** r1e plus `FB_Katana_tief`, `FB_Katana_waagerecht`, `FB_Katana_dash`, `FB_Katana_wegstecken`, sonst nichts geändert.
- Gebaut aus dem r1e-Zwischenstand vor dem Packen, gleiche Packung.
- 56 Clips (r1e 52 + 4).
- Kanon-Wache ok: Anzug, Jetpack-Anker, beide Ohren, Schwanz; Höhe 1,742 m.

**Katana wie bisher:** `waffen/KFB_Katana.r1d.glb` an `handslot.r` (Halterung aus der Spielkarte `kfb_kit_ninja_katana.fb_r1`, `KFB_Tip` aus dem Spender), in three.js `fig.getObjectByName('handslotr').add(katana.scene)`.

**Messung:**
- Spitze `KFB_Tip` über dem Boden (y = 0 = Fußsohle in Ruhe), 30 Bilder/s, FB-Agent-Twin r1e mit dem Katana in der Hand.
- Gegenprobe: der bisherige `KFB_Katana_chop_R1` hat seinen tiefsten Punkt bei 0,356 m nach 0,633 s; das deckt sich mit Claude Designs 36 cm.
- FBs Hüfte steht in Ruhe auf 0,250 m.

| Clip | Quelle (Bibliothek · Originalname) | Länge | Messwert |
|---|---|---|---|
| `FB_Katana_tief` | Stamm @0b211f2b `src/assets/actors/Rig_Medium_CombatMelee.glb` · `Melee_2H_Attack_Chop` | 1,63 s | tiefster Punkt der Spitze **−0,013 m bei 1,00 s** (Boden erreicht, 1,3 cm darunter) |
| `FB_Katana_waagerecht` | dieselbe Bibliothek · `Melee_1H_Attack_Slice_Horizontal` | 1,37 s | flachster Moment nahe der Hüfte: **Spitze 0,385 m bei 0,50 s**, Klinge −9,7° (Bauchhöhe; FBs Hüfte liegt bei 0,25 m) |
| `FB_Katana_dash` | Stamm @0b211f2b `Rig_Medium_MovementAdvanced.glb` · `Dodge_Forward`, darüber die Katana-Haltung des Spiels (`Melee_Blocking` bei 0,2 s für Oberkörper und Arme, wie `weaponHoldPose.js`) | 0,40 s | Hüfte 0,20 m nach vorn, Spitze 0,22–0,54 m |
| `FB_Katana_wegstecken` | `assets/private` @f10cbfc3 `motion_lib_r1/KFB_Motion_action_v2.Rig_Medium.glb` · `kfb_action_pistol_to_idle_a` | 1,73 s | Ersatz, siehe unten; am Ende Klinge waagerecht an der Seite, Spitze 0,31 m |

## Anmerkungen
- **1 tief:**
  - Das ist ein Zweihand-Clip; die linke Hand geht mit an den Griff.
  - Im Spiel schließt die Katana-Karte die 2H-Clips für FB aus („No FB two-hand katana grip acceptance“). Für das Bild der Website passt er, im Spiel bliebe er draußen.
  - Einhändige Alternative in derselben Bibliothek: `Melee_1H_Attack_Slice_Diagonal` (im Spiel `KFB_Katana_diagonal_R1`), Spitze 0,048 m bei 0,767 s, also 5 cm über dem Boden.
- **2 waagerecht:**
  - Der einzige echte Waagerecht-Hieb im Bestand.
  - Die Spiel-Karte schließt ihn für FB aus: Im Spiel steckt beim Original-FB der Knauf in Bild 2 im Rumpf. Beim Agenten im Anzug ist das auf dem Blatt nicht zu sehen, ich habe es aber nicht eigens gemessen.
  - Tiefer an der Hüfte, aber Doppelklingen-Clips mit leer mitschwingendem linkem Arm: `Melee_Dualwield_Attack_Slice` (waagerecht 0,30 m bei 0,67 s) und `Melee_Dualwield_Attack_Chop` (0,24 m bei 1,03 s).
- **3 dash:** Der Dash selbst ist der Original-Clip. Die Haltung ist genau die, die das Spiel beim Laufen mit dem Katana über den Körper-Clip legt; kein Keyframing. Als Alternative für einen längeren Sprint lässt sich `FB_Halten_katana` über `Running_A` legen, beide sind in der Datei.
- **4 Schlusspose — Wegstecken fehlt:**
  - Im Bestand gibt es keinen Clip, der eine Klinge in eine Scheide steckt oder abschüttelt, und FB hat keine Scheide.
  - Am nächsten kommt `pistol_to_idle`: eine Waffe aus dem Anschlag an die Seite nehmen. Er beginnt vorgebeugt (0,4 s) und endet mit gesenkter Klinge an der Hüfte.
  - Ich habe ihn als Ersatz unter dem verlangten Namen eingefügt. Wenn er nicht passt, kann Claude Design ihn auslassen. Echtes Wegstecken oder Abschütteln = **fehlt**.

## Blatt
`blaetter/K1_katana_r1f.jpg`: je Clip drei Momente seitlich, rote Linie = Boden, roter Punkt = Spitze; der waagerechte Hieb zusätzlich von vorn. Bilder in `bilder_r1f_jpg/`, Messdaten in `data/r1f/` (alle Kandidaten mit Spitzenhöhe je Bild), Skripte in `scripts/r1f/`.
