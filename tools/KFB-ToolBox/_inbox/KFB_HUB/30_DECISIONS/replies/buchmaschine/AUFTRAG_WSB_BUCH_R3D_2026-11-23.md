# Auftrag an WSB: Buch r3d und Greifarme (über WS0, 23.11.)

**Tier 0:** Der Umschlag löst sich vom sichtbaren Buchblock und liegt flach davor. Zwei Messing-Greifarme halten und führen ihn. Knochennamen von r3c bleiben.

**Grundlage:** `KFB_Buch_Mensch.r3c.glb` mit `umschlag_ausfalten`. Mechanik passt, danke.

**Beleg der Lücke** in `replies/buchmaschine/`:
- `schluesselbilder_produktfilm_r5/` (UEBERSICHT.jpg)
- `BUCHMASCHINE_PRODUKTFILM_R5.mp4`, ab 11 s
- `kritik_produktfilm_r5/BERICHT_PRODUKTFILM_R1_R5.md`

Die Bühne ist `src_produktfilm_r5/produktfilm.html`. Das Buch steht aufrecht auf dem Drehteller und zeigt der Kamera die Rückseite.

## 1. Neuer Clip `umschlag_abloesen` (etwa 2,4 s) und Rückrichtung `umschlag_anlegen`
- **Start:** das geschlossene Buch, von hinten gesehen (wie `umschlag_ausfalten`).
- Der Umschlag löst sich vom Buchblock und kommt etwa eine Blockdicke nach vorn zur Kamera. Dann öffnet er sich am Rücken und legt sich flach **vor** den Block: Außenseite zur Kamera, mittig vor dem Block.
- **Laschen:** Sie gehen erst ganz am Ende auf, links und rechts. Bitte als eigene Knochen, damit die Bühne sie getrennt steuern kann (wie heute `klappe_v` und `klappe_h`).
- **Der Buchblock bleibt sichtbar:** Er steht weiter auf dem Teller, der Rücken mit dem Hardcover-Bezug ist hinter dem flachen Umschlag erkennbar und ragt oben und unten nicht als heller Streifen heraus.
- **Die unbedruckte Innenseite** des Umschlags darf beim Schwenk nicht als heller Streifen durch das Motiv blitzen. Entweder liegt sie im Schatten des Blocks, oder der Schwenk läuft so, dass die Kamera sie nicht frontal sieht.
- Die Bewegung ist über die ganze Clipdauer verteilt, nicht in einem kurzen Teil gebündelt; in r3c lief die Drehung in etwa 20 % des Fensters.

## 2. Zwei Messing-Greifarme oder Klammern
- **Aufgabe:** Ein Arm links und einer rechts greifen die Kanten des Umschlags, ziehen ihn vom Block, führen das Aufklappen und halten den flachen Umschlag am Ende. Ein kurzer Schub öffnet die Laschen.
- Damit sieht man bei jedem Schritt, dass die Maschine die Bewegung verursacht. Die Kritik hat das dreimal als größte Lücke genannt.
- **Erst den Bestand prüfen.** Vorhanden in unserer Bühne:
  - die Orrery-Arme aus `src/vendor/codevember-orrery/parts.js` (armGeometry, Messing);
  - die Zahnräder (gearGeometry).
- **Aus der 3D-Suche (heute geprüft):**
  - **Articulated Robot** (BlenderKit, `dcbcc3e5-b8c3-4d02-aa0b-bce9334b116d`): geriggt, mit Greifer. Am besten als Teilespender.
  - **Robotic Arm** (BlenderKit, `426eda84-d4c5-4955-96a9-eab87ea51e85`): geriggt, Klaue, wenige Polygone.
  - **Desk Lamp Arm 01** (Poly Haven): Gelenkarm, passt zum Bastel-Look.
  - **Claw Arm** (3dassets.dev, Mech Hangar): sehr einfach, nur als Form.
  - KayKit und Quaternius haben laut Suche keinen passenden Greifarm. Bitte trotzdem im eigenen Bestand nachsehen.
- **Nur wenn nichts passt:** Arme aus Bestandsteilen zusammensetzen.
- **Look:** Clay-Messing wie Teller und Orrery-Arme (Messing #b08a4a, matt, Clay-Kanten). Kein Rost, kein Chrom-Hochglanz.
- **Knochen bzw. Pivots:** Schulter, Ellbogen, Handgelenk und Greiferbacken (auf/zu).
- **Dazu zwei Clips je Arm:** `greifen` (anfahren, Backen zu) und `loslassen`.
- **Befestigung:** Die Arme sitzen am Rand des Drehtellers oder an der Hubspindel und dürfen in der Totale ins Bild ragen.

## Abgabe
- **Dateien** in `assets/private 50_BLENDER/BUCH_MENSCH_R1/out`:
  - `KFB_Buch_Mensch.r3d.glb` mit Clipliste `r3d.clips.json`;
  - `KFB_Greifarm.r1.glb` mit Clipliste.
- **Je ein Beleg** als Nahaufnahme, aus Kamerasicht von hinten:
  - Ablösen;
  - flacher Umschlag mit sichtbarem Block;
  - Arm greift.
- **Knochennamen von r3c bleiben**, damit die Bühne weiterläuft: `deckel_v`, `klappe_v`, `klappe_h`, `p01`…, `ruecken`.
