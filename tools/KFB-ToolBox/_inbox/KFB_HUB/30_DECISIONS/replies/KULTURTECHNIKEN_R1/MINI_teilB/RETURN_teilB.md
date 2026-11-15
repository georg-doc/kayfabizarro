# KFB-Kulturtechniken R1 · Teil B · RETURN (WSB, Mac mini, 15.11.2026, V-1793)

**Auftrag:** `30_DECISIONS/replies/KULTURTECHNIKEN_R1/BRIEF_WSB_KULTURTECHNIKEN_R1_TEIL_B.md` mit dem Teil-B-Abschnitt des Eltern-Briefs.
- Grundlage: `assets/private` @82212dc9, Stamm `game/integration-r2` @532f63d9f.
- Georgs Wahl q686–q692: 35 Clips (t1–t5, t7, t8 · l1–l4 · f3, f5–f8 · b1–b3 · g1–g8 · d1–d8).
- KayKit-Originale sind nicht berührt.

## Kurz
1. **Import:** Alle 35 gewählten Clips liegen auf drei Rigs vor.
   - FB: `clips_fb/`, repariert.
   - KayKit Medium: `clips_kaykit/`, repariert.
   - Roh, ohne Reparatur: `clips_roh/` Rig_Medium und Rig_Large.
   - Je Technik eine Datei, Clipnamen `kfb_kult_<kandidat>`.
2. **Reparatur V-1752:** unverändertes Werkzeug `ik_push3b` und `ik_bake3`; geändert sind nur die Spuren von Oberarm, Unterarm und Handgelenk.
   - **FB:** alle 35 Clips ≤ 1,5 cm, nach 7 Durchgängen.
   - **KayKit** (6 Messkörper): 29 Clips ≤ 1,5 cm, nach 9 Durchgängen.
   - Ab Durchgang 8 bleiben 6 Clips darüber. Es sind Bewegungen mit Händen vor dem Bauch oder tiefer Beuge, wie bei den Hände-zusammen-Clips in R2. Sie werden nicht weiter kleiner.
     - House Dancing C 4,0 cm
     - Pick Fruit B 3,1 cm
     - Breakdance Freeze 2,5 cm
     - Brooklyn Uprock 1,9 cm
     - Overhand Throw 1,7 cm
     - Casting Spell 1,6 cm
   - Werte je Clip: `data/teilB/ik_r1.json`.
3. **Boden:** Bodenausgleich je Figur × Clip wie K12 (`data/teilB/floorlift/*.floorlift.json`).
   - 8 Figuren: FB, Lord Hunky, Barbarian, Farmer_B, GothGirl, Lorekeeper, Mage, Skeleton_Warrior.
   - Gemessen werden alle Hautpunkte, also auch Kopf, Ohren, Hände, Knie und Rumpf (Georgs Notiz). Die Spur bleibt unverändert, es gibt keinen Hüft-Lift.
4. **Kopf im Boden** (Georgs Notiz): Mit dem Ausgleich je Bild steckt in keinem Clip und keiner Figur der Kopf im Boden.
   - Kopf, Ohr oder Augenstiel ist der tiefste Punkt (Kopfstand) in:
     - t5 Breakdance 1990, 0–0,5 s;
     - t7 Freeze, 1,6–2,9 s.
   - Der Ausgleich hebt die Figur dort um bis zu 0,83 u (FB) bzw. 0,95 u (Mage).
   - Bild mit Zeitstellen: `beleg/KOPF_AM_BODEN_teilB.jpg`.
   - Dazu einzelne Bilder auf breiten KayKit-Körpern: t4 bei 1,9 s, f8 bei 4,1–4,3 s, d5 Mage (Hutkrempe).
5. **Brickfish** mit echtem Wurf-Requisit, KFB-Augen und Abwurf-Marke (`data/teilB/marken_r1.json`, B41-Form), Flugbahn als Parabel, Aufprall mit Abprallen und Hit_A am Ziel.
   - Kopfabstand bis zum Abwurf, je Bild gemessen (`beleg/brickfish/*_pruef_r4.json`):

     | Clip | Werfer FB | Werfer NPC (Lord Hunky) |
     |---|---|---|
     | b1 Overhand Throw | **−16,8 cm** (im rechten Ohr, 0,30 s): FAIL | +1,2 cm: PASS |
     | b2 Throwing Dice | +12,6 cm: PASS | +21,8 cm: PASS |
     | b3 Swatting Bugs (Abwehr) | −5,6 cm beim Kontakt 2,17 s | +9,4 cm: PASS |

   - Bei b1 mit FB hilft auch keine andere feste Griffdrehung: x/z ±90° geprüft, bestes Ergebnis −11 cm.
   - Darum b1 nur für KayKit-NPCs; FB wirft mit b2.
6. **Neue Kandidaten zur Hub-Wahl** (V-195), Einzelvorschauen in `vorschau_teilB/`, Bogen `blaetter/KONTAKTBOGEN_teilB.jpg`:
   - **Kevin Iglesias** (itch.io, Preis 0, kein Konto): 6 Schritte und 2 Posen, k1–k8. Zu den Posen gibt es eigene Ein- und Ausstiegs-Clips (Begin/Stop), also echte Übergänge.
   - **CMU:**
     - Charleston c1 (93_03) und c2 (93_08).
     - Side-by-Side c3/c4 (93_04/05): eine Tänzerin, zwei Aufnahmen, **kein Paar-Take**.
     - Lindy Hop c5 (93_06).
   - **Salsa 60/61 geprüft: echter Paar-Take** (p1).
     - Beide Aufnahmen haben dieselbe Länge (2242 Bilder) und dieselbe Uhr.
     - Die beiden starten 2 m voneinander, Blick zueinander.
     - Dann tanzen sie 0,5–0,9 m auseinander mit Drehungen und gehen wieder auseinander.

## Teil-B-Punkte aus dem Brief
- **Tanz und Musik** (Werte in `data/teilB/clips.kulturtechniken_r1.json` → `clips` bzw. `tanz.vorschlag_clips`):

  | Clip | bpm | beatsPerLoop | downbeatS | energy | Schleife |
  |---|---|---|---|---|---|
  | t1 Gangnam Style | 126,1 | 26 | 0,349 | 52,0 | ja |
  | t2 House Dancing C | 112,4 | 49 | 0,053 | 33,8 | ja |
  | t3 Breakdance Uprock | 114,3 | 4 | 0,087 | 56,2 | ja |
  | t4 Brooklyn Uprock | 123,3 | 10 | 0,016 | 57,0 | ja |
  | t5 Breakdance 1990 | 145,9 | 6 | 0,397 | 50,2 | **nein, Einmal-Move** |
  | t7 Breakdance Freeze | 145,2 | 10 | 0,028 | 53,0 | **nein, Einmal-Move** |
  | t8 UAL1 Dance Loop | 120,0 | 2 | 0,217 | 23,1 | ja |

  - Dieselbe Messung gibt es für die **20 ungenutzten Bestands-Tänze**, mit tier, rank, bpm, beatsPerLoop, downbeatS, energy und Schleife. Ausgeschlossen bleiben step_hip_hop, thriller ×2, locking, house_b und kip_up, jeweils mit Grund.
  - energy ist auf die idle_dance-Skala geeicht (chicken 38,5 und samba 50,7 exakt). bpm ist auf ganze Schläge je Schleife gerundet.
  - Zwei Schätzungen von WS1 weichen ab: hokey_pokey misst 148,7 statt 110, twist misst 82,4 bpm (halbes Tempo) statt 120.
- **Übergänge** nur aus Daten: je Clip ein Einstiegsbild ab Idle_A (kleinste Haltungsabweichung) plus blendS/fadeIn/fadeOut aus idle_dance.r1 (`data/teilB/uebergang_r1.json`).
  - Als Lücke gemeldet (Abweichung > 30°): l3, f6, f7, b2, d3, d4. Für d3/d4 fehlt Hinsetzen/Aufstehen.
  - Für Gehen → Tanz gibt es keine Daten (Lücke).
- **Requisiten an KFB_Grip** (`data/teilB/requisiten_r1.json`):
  - Anker wie B41 (hand.r, Faustmitte). Je Requisit ein fester slotOffset, gemessen im Bezugsbild aus der Handlage, gültig für alle Clips.
    - Buch offen K11: aus l1.
    - Karte (Kartenmodul V-1348, Seitenverhältnis 0,5578, 0,3 u lang): aus l4.
    - FluffBomb: aus f7.
    - Geschenk Present_Base: aus g6, Maßstab 0,25.
    - Brickfish: B41-Regel, Griff auf Griff.
  - Liest sich: l1 Buch, l4 Karte, f7 FluffBomb, g6 Geschenk.
  - Liest sich mit dem einen festen Wert nicht:
    - l2: Buch seitlich, weil der Clip einhändig ist.
    - l3: Buch weit seitlich, kein Stift.
    - g5/g1: Geschenk hängt an der Seite.
  - Die Augen schauen nicht aufs Requisit; das ist Sache der Spielseite (Blickziel).
- **Sitz d3–d5:** Hocker B34 unverändert, Oberkante 0,50 u. Gemessene Sitzhöhe (`data/teilB/sitz_*.json`):

  | Figur | d3 | d4 | d5 |
  |---|---|---|---|
  | FB | 0,09 u | 0,05 u | 0,23 u |
  | Lord Hunky | 0,09 u | 0,06 u | 0,23 u |
  | Barbarian | 0,14 u | 0,09 u | 0,38 u |

  - **Passt nicht** (KFB-Beine sind kurz). Es gilt Platzhalter, Build folgt; die Belege zeigen die Clips ohne Sitz.
- **Daten:** ein Manifest im Pool-Format von IDLE_R1, `data/teilB/clips.kulturtechniken_r1.json` (`kfb.idle-pool/1`). Je Clip stehen darin:
  - Technik, Gefühl, Energie;
  - Kontaktmarken (Abwurf b1/b2, Kontakt b3, Schütteln f7);
  - Partner nötig, Requisit mit slotOffset;
  - Takt, Schleife, Übergang;
  - Reparaturwerte, Bodenausgleich je Figur;
  - Lücken.
- sha256 je Datei in `SHA256SUMS_teilB.txt`.
- **Beleg:**
  - Je Technik vorn oder seitlich plus Spielkamera von hinten, FB und Lord Hunky, Proof-Bühne, Knete, KFB-Augen (`beleg/technik/`, Bögen `beleg/BELEG_<technik>_teilB.jpg`).
  - Kanon-Wache FB: beide Ohren und Schwanz in jedem Bild vorhanden (`__info.canon`).
  - Ein Kritiker je Runde: blind, nur Bilder. Seine Befunde sind eingearbeitet (siehe unten).

## Entscheide für WS0
1. **Brickfish-Datei:** Der Brief nennt für Medium `B41/props/KFB_Throw_BrickFish.medium.r1.glb`. Das ist die abgelehnte Mauerwerk-Form (mehrere Ziegel); der Kritiker hat es als Kanonbruch gefunden.
   - Belegt habe ich deshalb mit dem Kanon `BRICKFISH_R1/data/KFB_Throw_BrickFish.medium.r4.glb`: ein Ziegel mit runden Flossen und KFB-Augen an eye_anchor, Karte `brick_fish.figure.r4.json`.
   - Bitte bestätigen. Large ist laut Brief ohnehin r4.
2. **6 KayKit-Clips über 1,5 cm:** so nehmen, mildere Grenze, oder diese Clips nur für FB?
3. **b1 Overhand Throw:** nur NPCs (FB-Ohr)?
4. **Large-Rig:** nur übertragen, nicht repariert. Es gibt keinen Large-Messkörper mit KFB-Augen; welche Large-Figuren sollen gemessen werden?
5. **Paartanz-Abstand:** Die Wege der Partner sind wie jeder Clip auf die Hüfthöhe umgerechnet. Bei KFB-Proportionen (kurze Beine, großer Kopf) rücken die Partner dadurch zu nah zusammen.
   - Die Vorschau p1 setzt den Startabstand nach Körpergröße (0,75 u).
   - Im Spiel braucht es dafür einen Abstand je Figurpaar.

## Gefunden und behoben während der Runde
- **Spuren auf dem obersten Rig-Knoten:** Die erste Übertragung hat auch auf den Knoten `Rig_Medium`/`Rig_Large` Spuren geschrieben. In der Quelle trägt dieser Knoten einen Lageversatz (−2,7 / 0 / 1,2); KayKit-Körper wären im Spiel dadurch verschoben worden.
  - In allen Lieferdateien entfernt. Die übrigen Spuren sind bitgleich.
  - Arm- und Bodenmessung sind davon nicht berührt (nur waagerechter Versatz).
- **Kritiker-Runde:**
  - Brickfish: Kanon-Datei r4, Augen, Ziel auf der Kopf-Vorderseite, Abprallen statt Steckenbleiben.
  - Spielkamera mit Füßen im Bild.
  - Geschenk nicht mehr vor dem Gesicht.
  - CMU-Takes nach vorn gedreht (ganzer Take, Bewegung gleich).
- **Bilder ohne KFB-Augen:** Die KayKit-Messkörper (Barbarian usw.) haben kein KFB-Augen-Rig. Von ihnen liefere ich nur Messwerte, keine Bilder.

## Offen
- Mixamo-Reihen: Georg lädt später nach `in_mixamo/`.
- Fangen, Überreichen/Annehmen, Umblättern im Stehen, Hinsetzen/Aufstehen und Gehen → Tanz bleiben Lücken (`luecken` im Manifest).
- Kessel, Flasche (f5), Comic-Heft, geschlossenes Buch und ein passender Hocker: Platzhalter, Build folgt.

## Ordner
| Ordner | Inhalt |
|---|---|
| `clips_fb/`, `clips_kaykit/`, `clips_roh/` | GLBs, je Technik |
| `data/teilB/` | Manifest, Requisiten, Marken, Übergänge, Takt, Energie, Reparatur, Sitz, `floorlift/` (8 Figuren), sha256 der beiden Downloads |
| `beleg/` | `BELEG_*_teilB.jpg`, `KOPF_AM_BODEN_teilB.jpg`, `technik/` (140 Streifen), `brickfish/` (Seite und Spielkamera, WebP-Clips, Prüfwerte, Augen nah) |
| `vorschau_teilB/` | 13 Einzelkandidaten + Paar, .jpg/.webp |
| `blaetter/KONTAKTBOGEN_teilB.jpg` | Kontaktbogen der neuen Kandidaten |
| `scripts/teilB/` | Übertrag, Reparatur-Durchgänge, Boden, Takt, Marken, Übergänge, Proof-Bühne `spiel_view.html` |
