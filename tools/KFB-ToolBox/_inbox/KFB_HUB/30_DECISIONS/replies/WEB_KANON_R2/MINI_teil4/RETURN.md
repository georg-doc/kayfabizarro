# ML v2 R2 · KayKit-Clips: alle tief gebeugten Clips repariert · RETURN (WSB, Mac mini, 14.11.2026, V-1752)

**Auftrag (WS0, Georg q669):** Kein Clip fliegt aus dem Pool; alle Clips werden repariert. Ziel wie ML v1: Unterarm und Hand höchstens 1,5 cm im Rumpf auf den sechs Messkörpern, in jedem Clip. Haltung und Ausdruck bleiben, kein drohend weites Abspreizen (q665). KayKit-Originalclips unverändert, gleiche Namen und Zahl.

| Datei (`clips_kaykit/`) | sha256 (Anfang) | Quelle |
|---|---|---|
| `KFB_Motion_idle.v2.Rig_Medium.kk.r2.glb` | 20b65153248b8c1b | `30_DECISIONS/replies/WSB_HALTUNG_R1/v2_quellen/KFB_Motion_idle.glb` (Original v2) |
| `KFB_Motion_gesture.v2.Rig_Medium.kk.r2.glb` | f177792398da3ca0 | `…/v2_quellen/KFB_Motion_gesture.glb` |

- 29 bzw. 17 Clips, gleiche Namen wie die Quelle.
- **Geändert sind nur die Drehspuren** von `upperarm`, `lowerarm` und `wrist` (je Seite); alle anderen Spuren sind bitgleich zur Quelle, geprüft: idle 1827 gleich, 174 Arm-Spuren geändert; gesture 1071 gleich, 102 geändert.
- Die KayKit-Originalclips (Idle_A usw.) sind nicht berührt.
- **Einbau** wie R1 (`.kk.glb` für KayKit-Körper statt `libs/Rig_Medium/KFB_Motion_idle.glb`/`gesture.glb`), Spielcode unverändert.

## Ergebnis
**Alle 46 Clips ≤ 1,5 cm**, gemessen mit dem unveränderten R1-Werkzeug (`messe4`, jedes zweite Bild, alle Ecken, sechs Körper: Barbarian, Farmer_B, GothGirl, Lorekeeper, Mage, Skeleton_Warrior). Der größte Restwert ist 1,46 cm (strong_gesture, Barbarian).

| Clip | vorher (cm) | R1 (cm) | R2 (cm) | schlimmster Körper R2 | größte Änderung Oberarm / Unterarm |
|---|---|---|---|---|---|
| `kfb_gesture_angry_gesture_a` | 9.20 | 6.03 | **1.04** | Barbarian | 29° / 24° |
| `kfb_gesture_cheering_a` | 6.38 | 6.38 | **1.25** | Barbarian | 56° / 65° |
| `kfb_gesture_clapping_a` | 11.71 | 10.65 | **1.32** | Barbarian | 52° / 39° |
| `kfb_gesture_counting_a` | 15.16 | 13.69 | **1.04** | Barbarian | 126° / 108° |
| `kfb_gesture_dismissing_gesture_a` | 10.82 | 7.81 | **0.97** | Barbarian | 35° / 60° |
| `kfb_gesture_look_over_shoulder_a` | 13.82 | 13.82 | **1.09** | Barbarian | 56° / 90° |
| `kfb_gesture_pointing_a` | 8.10 | 5.99 | **1.34** | Mage | 23° / 39° |
| `kfb_gesture_salute_a` | 5.31 | 5.31 | **0.80** | Mage | 12° / 71° |
| `kfb_gesture_standing_clap_a` | 12.49 | 10.12 | **0.93** | Barbarian | 71° / 79° |
| `kfb_gesture_standing_greeting_a` | 6.37 | 4.90 | **1.45** | Mage | 17° / 20° |
| `kfb_gesture_strong_gesture_a` | 10.96 | 8.94 | **1.46** | Barbarian | 53° / 63° |
| `kfb_gesture_talking_a` | 4.18 | 4.18 | **1.24** | Barbarian | 27° / 32° |
| `kfb_gesture_talking_on_phone_a` | 7.42 | 5.69 | **1.15** | Barbarian | 31° / 63° |
| `kfb_gesture_taunt_a` | 5.14 | 5.14 | **1.45** | Barbarian | 44° / 34° |
| `kfb_gesture_thoughtful_head_shake_a` | 11.80 | 8.35 | **1.11** | Barbarian | 39° / 11° |
| `kfb_gesture_waving_gesture_a` | 5.16 | 5.16 | **1.15** | Barbarian | 21° / 52° |
| `kfb_gesture_yelling_a` | 7.96 | 6.39 | **1.12** | Barbarian | 28° / 63° |
| `kfb_idle_breathing_a` | 13.59 | 9.26 | **1.30** | Mage | 43° / 28° |
| `kfb_idle_breathing_b` | 13.59 | 9.26 | **1.37** | Mage | 43° / 28° |
| `kfb_idle_defeat_a` | 16.33 | 12.10 | **0.96** | Barbarian | 57° / 52° |
| `kfb_idle_drunk_idle_variation_a` | 8.38 | 4.87 | **1.34** | Mage | 26° / 0° |
| `kfb_idle_happy_a` | 7.88 | 4.41 | **1.23** | Barbarian | 24° / 39° |
| `kfb_idle_idle_a` | 11.48 | 8.89 | **1.11** | Barbarian | 49° / 64° |
| `kfb_idle_idle_b` | 10.09 | 7.13 | **1.20** | Barbarian | 38° / 45° |
| `kfb_idle_idle_c` | 12.34 | 8.67 | **1.18** | Barbarian | 43° / 52° |
| `kfb_idle_idle_d` | 11.25 | 7.06 | **1.21** | Barbarian | 35° / 43° |
| `kfb_idle_idle_e` | 11.73 | 7.90 | **1.07** | Barbarian | 30° / 53° |
| `kfb_idle_idle_f` | 15.85 | 11.12 | **0.92** | Mage | 42° / 16° |
| `kfb_idle_injured_a` | 14.63 | 10.43 | **1.38** | Lorekeeper | 56° / 35° |
| `kfb_idle_kneeling_a` | 14.44 | 9.71 | **1.09** | Barbarian | 39° / 21° |
| `kfb_idle_laughing_a` | 11.74 | 7.44 | **1.13** | Mage | 50° / 47° |
| `kfb_idle_lying_down_a` | 16.82 | 12.93 | **1.13** | Mage | 52° / 56° |
| `kfb_idle_mutant_idle_a` | 6.02 | 4.35 | **1.21** | Barbarian | 17° / 30° |
| `kfb_idle_ninja_a` | 9.83 | 5.36 | **1.17** | Barbarian | 16° / 35° |
| `kfb_idle_ninja_b` | 13.04 | 8.35 | **1.19** | Barbarian | 54° / 79° |
| `kfb_idle_offensive_idle_a` | 13.01 | 9.35 | **1.12** | Barbarian | 42° / 55° |
| `kfb_idle_old_man_idle_a` | 4.79 | 4.79 | **1.29** | Barbarian | 30° / 42° |
| `kfb_idle_orc_a` | 11.68 | 7.89 | **1.43** | Lorekeeper | 42° / 54° |
| `kfb_idle_praying_a` | 14.59 | 14.59 | **0.81** | Mage | 42° / 56° |
| `kfb_idle_rejected_a` | 12.15 | 10.62 | **1.14** | Farmer_B | 56° / 23° |
| `kfb_idle_sad_a` | 15.71 | 11.15 | **1.23** | Barbarian | 45° / 23° |
| `kfb_idle_sitting_a` | 7.55 | 4.80 | **0.91** | Barbarian | 26° / 0° |
| `kfb_idle_standing_a` | 15.54 | 12.21 | **1.14** | Barbarian | 47° / 80° |
| `kfb_idle_standing_idle_03_a` | 5.07 | 5.07 | **1.15** | Barbarian | 44° / 47° |
| `kfb_idle_treading_water_a` | 4.84 | 4.84 | **0.98** | Barbarian | 29° / 63° |
| `kfb_idle_unarmed_idle_looking_ver_1_a` | 12.88 | 8.62 | **1.26** | Barbarian | 46° / 36° |

## Verfahren
1. **R1-Weg** (Oberarm abspreizen, Gitter auch mit Vorschwingen und Brust-Aufrichten bis 20°):
   - Damit kommen nur 24 von 46 Clips unter 1,5 cm, viele Clips stehen am Rand des Gitters.
   - Messung und Auswahl liegen bei (`messe5`/`auswahl`), sind aber nicht verwendet.
2. **IK-Ausdrücken** (`ik_push3`): Gemessen wird je Bild und Seite auf allen sechs Körpern gleichzeitig, wie tief Unterarm oder Hand stecken.
   - Liegt der tiefste Punkt nahe der Hand, schiebt eine Zwei-Knochen-IK das Handgelenk um genau diese Tiefe aus dem Rumpf. Die Ellbogen-Ebene des Clips bleibt, ebenso die Weltdrehung der Hand.
   - Liegt er in der oberen Hälfte des Unterarms, dreht der ganze Arm um die Schulter.
   - Richtung: radial von der Wirbelachse weg. Die nächste Rumpffläche springt in den Fell- und Kleiderzacken der KayKit-Körper hin und her und ist deshalb ungeeignet.
3. **Glätten und Backen** (`ik_bake3`):
   - Über die Zeit geglättet, Spitzen gehalten; die Idles schließen als Schleife.
   - An jeder Schlüsselzeit auf dem Rig des Originals gerechnet. Die Arm-Drehung ist auf 50° je Durchgang gekappt.
4. **Drei Durchgänge**, jeweils gegengemessen: 24 → 43 → 46 Clips ≤ 1,5 cm. Pläne in `data/plaene/`, Gegenmessung in `data/messung/`.

## Was Georg sehen muss (q665 gegen q669)
`blaetter/V2_npc_vorher_nachher_r2.jpg`: die sechs schlimmsten Clips sowie beten und klatschen, Barbarian und Mage, je schlimmstes Bild vorher und dasselbe Bild nachher.
- **Die Arme stehen deutlich weiter vom Körper ab bzw. weiter vorn als im Original.**
  - Die größte Änderung am Oberarm liegt im Mittel der Clips bei 42° (Tabelle, letzte Spalte).
  - Das ist der Preis für ≤ 1,5 cm auf allen sechs Körpern: Barbarian und Mage sind breit, und die v2-Clips legen die Arme eng an oder in den Bauch.
  - Zwischen „Ausdruck bleibt“ (q665) und „≤ 1,5 cm überall“ (q669) gibt es bei diesen Körpern keinen Wert, der beides erfüllt.
- **Hände, die zusammengehören:** `praying`, `clapping`, `standing_clap`, `counting`.
  - Die Hände sind jetzt getrennt: Gebet und Klatschen sind nicht mehr zu sehen, `counting` dreht den Oberarm in einzelnen Bildern um bis zu 126°.
  - Versucht habe ich auch, beide Hände gemeinsam nur nach vorn zu schieben (`ik_push3g`, `data/plaene/versuch_gemeinsam_vorn.json`). Dabei bleiben 2,2–3,3 cm, und die Arme müssten unnatürlich weit gestreckt werden. Auf diesen Körpern steckt eine Gebets- oder Klatschhaltung vor der Brust zwangsläufig im Rumpf.
- **Mögliche Wege, Entscheid Georg/WS0:**
  1. R2 so nehmen (alle ≤ 1,5 cm, Haltung stark verändert);
  2. für die vier Hände-zusammen-Clips die R1-Fassung behalten (Hände zusammen, R1-Restwerte 10,1–14,6 cm);
  3. eine mildere Grenze (z. B. 3 cm), die mehr Ausdruck lässt. Das rechne ich mit denselben Werkzeugen in einem Lauf.

## Ordner
- `clips_kaykit/`
- `blaetter/`
- `data/`:
  - `tabelle_r2.json`: je Clip vorher, R1, R2 und schlimmster Körper;
  - `aenderung_grad.json`: größte Drehung je Arm-Knochen;
  - `messung/`: Gegenmessung je Körper;
  - `plaene/`
- `scripts/`: `ik_push3` (+ `3b` mit mehr Durchgängen, `3g` gemeinsam), `ik_bake3`, `messe5`/`auswahl` (R1-Weg mit Gitter), `messe4` und `mkfig` aus R1
