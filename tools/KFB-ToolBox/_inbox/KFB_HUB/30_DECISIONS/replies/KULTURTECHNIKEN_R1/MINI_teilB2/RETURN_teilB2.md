# KFB-Kulturtechniken R1 · Teil B2 · RETURN (WSB, Mac mini, 15.11.2026)

**Auftrag:** WS0 15.11., nach Georgs Antworten.
- q695: Kevin Iglesias k1–k8.
- q696: CMU c1–c5 und Salsa-Paar p1.
- q697: Kopfstand-Momente t5/t7 PASS.
- Dazu der rigs-Nachtrag zu Teil B.

Grundlage: `assets/private` @f922c319. Das Werkzeug ist dasselbe wie in Teil B; Skripte in `scripts/teilB2/`.

## Kurz
1. **Import:** Die 14 Kandidaten und die 4 Posen-Übergänge aus der Quelle (k7b/k7s/k8b/k8s = Begin/Stop) liegen in `KFB_Kultur_tanz2`:
   - `clips_fb/…fb.glb` (repariert);
   - `clips_kaykit/…kk.glb` (repariert);
   - `clips_roh/…Rig_Medium.glb`.
   - p1 hat zwei Spuren, `kfb_kult_p1_salsa_60` und `kfb_kult_p1_salsa_61`: Ausschnitt 5–33 s, beide im selben Weltbezug.
   - Large ist nicht geliefert (WS0: nicht freigegeben).
2. **Reparatur V-1752:**
   - **FB:** alle 19 Clips ≤ 1,5 cm, 6 Durchgänge.
   - **KayKit** (6 Körper): alle 14 gewählten Clips ≤ 1,5 cm, 7 Durchgänge.
   - Darüber bleiben nur die beiden Einstiegs-Übergänge k7b (2,03 cm) und k8b (3,67 cm). Sie gelten nach der Regel vom 15.11. nur für FB (`rigs: ["fb"]`).
   - Werte je Clip: `data/teilB2/ik_b2.json`.
3. **Boden:** Bodenausgleich je Figur × Clip, 8 Figuren (`data/teilB2/floorlift/`).
   - Kein Kopf ist tiefster Punkt, keiner steckt im Boden.
   - Größter Hub: p1 0,19 u, Lindy Hop 0,18 u, Fancy Charleston 0,18 u.
4. **Manifest:** `data/teilB2/clips.kulturtechniken_r1.json` (gleiches Pool-Format). Es ersetzt den Teil-B-Stand und enthält:
   - alle 54 Clips;
   - das rigs-Feld je Clip;
   - b1 mit `rigs: ["kaykit"]` und `ausnahme: "V-1752 1,68 cm, schlimmstes Bild Barbarian/Mage"`;
   - die fünf Clips nur FB (t2, t4, t7, f3, f6);
   - die neuen Clips in `tanz.vorschlag_clips` mit tier/rank (rank neu durchgezählt);
   - Large als nicht freigegeben markiert, Brickfish r4 als bestätigt.

## Takt und Schleife
| Clip | bpm | beatsPerLoop | downbeatS | energy | Schleife | rigs |
|---|---|---|---|---|---|---|
| k1 Dance01 | 120 | 4 | 0,00 | 31,1 | ja | fb, kaykit |
| k2 Dance02 | 120 | 2 | 0,25 | 49,5 | ja | fb, kaykit |
| k3 Dance03 | 120 | 4 | 0,00 | 42,8 | ja | fb, kaykit |
| k4 Dance04 | 120 | 4 | 0,00 | 49,7 | ja | fb, kaykit |
| k5 Dance05 | 120 | 4 | 0,50 | 16,5 | ja | fb, kaykit |
| k6 Dance06 | 120 | 4 | 0,00 | 39,4 | ja | fb, kaykit |
| k7 DancePose01 Loop (+ k7b ein, k7s aus) | 120 | 2 | 0,28 | 2,3 | Halteschleife | fb, kaykit (k7b nur fb) |
| k8 DancePose02 Loop (+ k8b ein, k8s aus) | 120 | 1,27 | 0,34 | 3,9 | Halteschleife | fb, kaykit (k8b nur fb) |
| c1 Charleston 01 | 147,3 | 9 | 0,04 | 49,4 | Einmal-Move | fb, kaykit |
| c2 Fancy Charleston | 103,6 | 8 | 0,08 | 61,2 | Einmal-Move | fb, kaykit |
| c3 Charleston nebeneinander (w) | 114,3 | 8 | 0,14 | 40,3 | Einmal-Move | fb, kaykit |
| c4 Charleston nebeneinander (m) | 105,9 | 8 | 0,19 | 51,4 | Einmal-Move, Schleifenfenster 0,27–2,73 s (6,7°) | fb, kaykit |
| c5 Lindy Hop | 126,0 | 7 | 0,14 | 40,2 | Einmal-Move | fb, kaykit |
| p1 Salsa 60 / 61 | 150 / 128,6 | 70 / 60 | 0,09 / 0,19 | 25,4 / 33,1 | Einmal-Folge 28 s | fb, kaykit |

- **Kevin Iglesias:** Die Quelle ist auf 120 BPM gebaut, die Messung bestätigt das. Bei k4 und k5 misst die Autokorrelation das halbe Tempo; eingetragen ist 120.
- **CMU:** Die Tänzerin dreht sich im Take, darum schließt keine Aufnahme sauber. Sie werden als Einmal-Move gespielt, Ausstieg über fadeOut. Gekürzt ist nichts.
- **p1:** Das Eigentempo der beiden Partner misst verschieden und ist unsicher. Beide Spuren laufen immer gemeinsam mit derselben timeScale.
- **Partner-Feld:** Clip des Partners, Startversatz in Hüfthöhen (0,777 / 0,142), Drehung 0. Den Abstand je Figurpaar setzt WS0.

**Übergänge** (`data/teilB2/uebergang_b2.json`):
- Einstiegsbild ab Idle_A je Clip.
- k7/k8 haben dazu eigene Ein- und Ausstiege aus der Quelle (Felder `uebergang.ein/aus`, `uebergangsClip`).

## Beleg und Kritiker
Belege: `beleg/teilB2/` (je Clip FB und NPC vorn plus Spielkamera; Paar vorn plus Spielkamera mit WebP), Bogen `beleg/teilB2/BELEG_tanz2_teilB2.jpg`.
- Kanon-Wache FB: Ohren, Schwanz und Augen überall vorhanden.

Der Kritiker hat blind geprüft (nur Bilder). Seine Befunde mit meiner Prüfung:
1. **k7 Pose 01, Lord Hunky: Kopf wirkt verdreht.**
   - Geprüft: Die Quelle dreht den Kopf um 54,5° gegen die Brust (Blick über die Schulter). Roh-, FB- und KayKit-Fassung zeigen genau 54,5°, es ist also kein Übertragungsfehler.
   - Auf Lord Hunky mit Augenstielen liest es sich in der Vorderansicht trotzdem wie ein verdrehter Hals. Zur Kenntnis für Georg.
2. **p1 Paar:** Köpfe und Hände gehen ineinander. Gründe: der kurze Abstand (WS0) und der Größenunterschied der beiden Figuren; die Haltung der Partner zielt auf Kopfhöhe.
3. **c2 Fancy Charleston, Lord Hunky:** Die dicken KayKit-Beine gehen beim Kreuzen ineinander. V-1752 misst nur die Arme, nicht Bein gegen Bein.
4. **c1 Charleston, FB:** Die rechte Hand geht in M2/M3 ins Shirt. V-1752 misst gegen den Körper unter dem Shirt; das Shirt ist nicht Teil der Messung, wie in Teil B.
5. **Lesbarkeit:** k1 und k5 lesen sich eher als Wippen bzw. Gehen.

## Ordner (neu in B2)
| Ordner | Inhalt |
|---|---|
| `clips_fb/KFB_Kultur_tanz2.Rig_Medium.fb.glb`, `clips_kaykit/KFB_Kultur_tanz2.Rig_Medium.kk.glb`, `clips_roh/KFB_Kultur_tanz2.Rig_Medium.glb` | Clip-Bibliotheken |
| `data/teilB2/` | Manifest, Takt, Übergänge, Reparatur, Bake-Protokoll, `floorlift/` (8 Figuren) |
| `beleg/teilB2/` | Belege und Bogen |
| `scripts/teilB2/` | Skripte |
| `SHA256SUMS_teilB2.txt` | Prüfsummen |
