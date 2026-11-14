# ML v2 R2b · R2 außer den vier Hände-zusammen-Clips · RETURN (WSB, Mac mini, 14.11.2026, Georg q682)

**Auftrag (WS0, Georg q682 „So nehmen, die 4 Hände-zusammen-Clips aber wie vorher lassen“):**
- R2 für alle Clips.
- Ausgenommen sind `kfb_idle_praying_a`, `kfb_gesture_clapping_a`, `kfb_gesture_standing_clap_a` und `kfb_gesture_counting_a`: Diese bleiben exakt wie heute im Spiel, also aus R1 (`WSB_ML_V2_KK_R1/clips_kaykit/*.kk.glb`).

| Datei (`clips_kaykit/`) | Größe | sha256 (Anfang) |
|---|---|---|
| `KFB_Motion_idle.v2.Rig_Medium.kk.r2b.glb` | 2 598 420 B | b1cc2167cb442bba |
| `KFB_Motion_gesture.v2.Rig_Medium.kk.r2b.glb` | 2 126 044 B | 8ef9d3df64b01633 |

**Gebaut** aus den R2-Dateien (`scripts/r2b.mjs`): In den vier Clips sind alle 69 Spuren durch die R1-Spuren ersetzt. Clipnamen, Clipzahl (29 und 17) und Reihenfolge sind wie R2.

## Prüfsummen-Vergleich je Clip
sha256 (Anfang) über alle Spuren eines Clips: Knoten, Pfad, Interpolation, Zeiten, Werte, sortiert nach Knoten und Pfad. Ergebnis: **0 Abweichungen**.
- Die vier R1-Clips sind bitgleich zu R1.
- Die 42 übrigen Clips sind bitgleich zu R2.

Daten in `data/vergleich_r2b.json`.

| Clip | Quelle | r2b | R1 | R2 | gleich zur Quelle |
|---|---|---|---|---|---|
| `kfb_gesture_clapping_a` | R1 | fac45319763ba90f | fac45319763ba90f | 2bb4c38c20c0d55d | ja |
| `kfb_gesture_counting_a` | R1 | c930c27d166192ab | c930c27d166192ab | f3ab0d31ba18b2c9 | ja |
| `kfb_gesture_standing_clap_a` | R1 | 749b24dc7404bea1 | 749b24dc7404bea1 | a8b6a75cb2ff9b5c | ja |
| `kfb_idle_praying_a` | R1 | 40b7a3fdc528e761 | 40b7a3fdc528e761 | aba492c22d7e36d8 | ja |
| `kfb_gesture_angry_gesture_a` | R2 | 929c609e106e4e76 | de823b5f8e1c472b | 929c609e106e4e76 | ja |
| `kfb_gesture_cheering_a` | R2 | 107866da7024a5d3 | 6c93019aa65387be | 107866da7024a5d3 | ja |
| `kfb_gesture_dismissing_gesture_a` | R2 | b0d8df5cb441f079 | a276fc85454c407d | b0d8df5cb441f079 | ja |
| `kfb_gesture_look_over_shoulder_a` | R2 | 5e768e7943da59f0 | fab32ca3927951a1 | 5e768e7943da59f0 | ja |
| `kfb_gesture_pointing_a` | R2 | 68fd62ec9c2c2862 | 4ac50dca924be4fc | 68fd62ec9c2c2862 | ja |
| `kfb_gesture_salute_a` | R2 | 8a87bc0e75110c1f | 8794db87089d990e | 8a87bc0e75110c1f | ja |
| `kfb_gesture_standing_greeting_a` | R2 | 185b3af9f8644e6b | 48134f43d794760d | 185b3af9f8644e6b | ja |
| `kfb_gesture_strong_gesture_a` | R2 | a58d5b00b5ce92cc | 891ff426c809673a | a58d5b00b5ce92cc | ja |
| `kfb_gesture_talking_a` | R2 | cf54cadd40deddf9 | fbe619920ce3384c | cf54cadd40deddf9 | ja |
| `kfb_gesture_talking_on_phone_a` | R2 | c7b78ad1bd97ccdd | cbf62569c63ba4df | c7b78ad1bd97ccdd | ja |
| `kfb_gesture_taunt_a` | R2 | 4ee92f1169b97692 | ccf9db078221fc38 | 4ee92f1169b97692 | ja |
| `kfb_gesture_thoughtful_head_shake_a` | R2 | 9891d8b25dc5ffa1 | 2731ea8882882f41 | 9891d8b25dc5ffa1 | ja |
| `kfb_gesture_waving_gesture_a` | R2 | 2376255314567ae8 | 342182939df002e4 | 2376255314567ae8 | ja |
| `kfb_gesture_yelling_a` | R2 | 78367191301531ac | 5f191b23b11ff0ef | 78367191301531ac | ja |
| `kfb_idle_breathing_a` | R2 | bf721cb9fa217e66 | 067bac060beb7764 | bf721cb9fa217e66 | ja |
| `kfb_idle_breathing_b` | R2 | cc6471376d421ff7 | a82b5a391e20c4ee | cc6471376d421ff7 | ja |
| `kfb_idle_defeat_a` | R2 | 73d8e70d0fa91c59 | 7e42ef5914c66b91 | 73d8e70d0fa91c59 | ja |
| `kfb_idle_drunk_idle_variation_a` | R2 | 8f7a51dfdce641b6 | a5b2c849c9ec6214 | 8f7a51dfdce641b6 | ja |
| `kfb_idle_happy_a` | R2 | f6a913d11aa1090d | 55749bd991e5060d | f6a913d11aa1090d | ja |
| `kfb_idle_idle_a` | R2 | 1c1f3e90fb5409d8 | 7e509da41d2489ed | 1c1f3e90fb5409d8 | ja |
| `kfb_idle_idle_b` | R2 | 2ba8c997c09cb8bf | efa634390e479600 | 2ba8c997c09cb8bf | ja |
| `kfb_idle_idle_c` | R2 | 0ef1fc48e411709d | 94622cf35b3a0f75 | 0ef1fc48e411709d | ja |
| `kfb_idle_idle_d` | R2 | ee9a1db34d6154b4 | 208149aeba17324d | ee9a1db34d6154b4 | ja |
| `kfb_idle_idle_e` | R2 | b9175502960dc03c | cbcf39a81634123d | b9175502960dc03c | ja |
| `kfb_idle_idle_f` | R2 | e41768af5ce5c950 | da9c2f028de92292 | e41768af5ce5c950 | ja |
| `kfb_idle_injured_a` | R2 | 0793eec946d0b464 | 35812989924dc6b3 | 0793eec946d0b464 | ja |
| `kfb_idle_kneeling_a` | R2 | 2830df0e0adcc7cf | 19ac618348856f67 | 2830df0e0adcc7cf | ja |
| `kfb_idle_laughing_a` | R2 | 93d7c4afc5433193 | 9b88353c893bdb68 | 93d7c4afc5433193 | ja |
| `kfb_idle_lying_down_a` | R2 | 35336d12722554c2 | e24a38ba546b5c5a | 35336d12722554c2 | ja |
| `kfb_idle_mutant_idle_a` | R2 | 25ca2e2c9e3020a7 | e01a166fe88a839e | 25ca2e2c9e3020a7 | ja |
| `kfb_idle_ninja_a` | R2 | da5dfdf87116ffb2 | 6218c96560339526 | da5dfdf87116ffb2 | ja |
| `kfb_idle_ninja_b` | R2 | 0f02ef8767b982b8 | 648b3ea6d1fd9cdf | 0f02ef8767b982b8 | ja |
| `kfb_idle_offensive_idle_a` | R2 | 1c69e07824ec7b7f | 8a80804236e0059c | 1c69e07824ec7b7f | ja |
| `kfb_idle_old_man_idle_a` | R2 | 97dd3e8144ce072c | 46ca48e27c405964 | 97dd3e8144ce072c | ja |
| `kfb_idle_orc_a` | R2 | 6ebec56d44f556b6 | 2e7a1285e83789ea | 6ebec56d44f556b6 | ja |
| `kfb_idle_rejected_a` | R2 | 13e2c2ddecdb40cd | 592af7ac53b8023b | 13e2c2ddecdb40cd | ja |
| `kfb_idle_sad_a` | R2 | 39de595478c39751 | 192096a91f979140 | 39de595478c39751 | ja |
| `kfb_idle_sitting_a` | R2 | 9c7f9fafead52c11 | 4ec2c22743fb5ddc | 9c7f9fafead52c11 | ja |
| `kfb_idle_standing_a` | R2 | 6597c1aec8c6cb2b | 57834f64d7d8f86e | 6597c1aec8c6cb2b | ja |
| `kfb_idle_standing_idle_03_a` | R2 | 4e6fe413b608ac82 | dcdaa88bd069e8e5 | 4e6fe413b608ac82 | ja |
| `kfb_idle_treading_water_a` | R2 | 50a293eb0477d04b | 055e6d911fda9989 | 50a293eb0477d04b | ja |
| `kfb_idle_unarmed_idle_looking_ver_1_a` | R2 | 73bffa8337d00f71 | 7e7b67b07ca0ac66 | 73bffa8337d00f71 | ja |

**Werte:** wie im R2-RETURN. Die 42 R2-Clips liegen ≤ 1,5 cm; die vier R1-Clips behalten ihre R1-Werte (praying 14,59, clapping 10,65, standing_clap 10,12, counting 13,69 cm), dafür bleiben die Hände zusammen.
