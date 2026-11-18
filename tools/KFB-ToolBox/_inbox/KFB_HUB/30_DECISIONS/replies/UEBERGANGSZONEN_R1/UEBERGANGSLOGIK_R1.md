# Übergangslogik R1 · aus Meshy „Oasis of the Ruins“ (WSB, 18.11.2026)

**Auftrag:** WS0 18.11. (3), Georg. Das Modell wird nur analysiert, nicht eingebaut: Wie sind die Ränder gebaut? Daraus kurze Regeln mit Zahlen für die Einbettung von Dioramen und Assets, fraktal anwendbar, als Grundlage für WFC. Abgleich mit der SOP `kfb_place.r1.json` → `embed.sop` (V-753).
**Quelle:** `CLAUDE/MeshyModels/Meshy Mixed 01/Meshy_AI_Oasis_of_the_Ruins_1118020912_texture.glb` (lag lokal in Georgs Dropbox, kein Download). Ein Netz, 1,47 Mio. Ecken, eingebrannte Textur, Ausdehnung 1,90 × 1,89 × 1,06 Modell-Einheiten.

## Wie gemessen, wie belastbar
- **Gemessen (belastbar):** Draufsicht-Raster 1200² (Höhe plus Texturfarbe je Ecke) und radiales Profil ab Teichmitte, alle 8 Zellen ≈ 0,013 (`data/oasis_profil_fein.json`). Daraus stammen Zonen, Breiten, Höhen, Bedeckung, Helligkeit und Schürzenform.
- **Am Bild abgelesen (Schätzung ±30 %):** Steingrößen, Abstände und Häufungen, aus den orthografischen Ausschnitten (`belege/roh2/ausschnitt_*.png`, 2258 px je Einheit) und den Schrägansichten.
- **Automatische Steinzählung:** nicht belastbar für M/S. Das Meshy-Netz hat viele dünne Spitzen (Gras, Rauschen), die als „Steine“ zählen: Höhe/Durchmesser lag im Median bei 6–40 statt unter 1. Die Zahlen stehen nur als Hinweis in `data/oasis_radial*.json`.
- **Grundmaß W** = Breite der Mauerkrone ≈ 0,08 Einheiten. Alle Längen sind in W angegeben, damit sie für jede Größe gelten.

## Aufbau des Modells (innen → außen)
| Zone | Radius (Einh.) | Breite | Merkmal (gemessen) |
|---|---|---|---|
| Teich | 0 – 0,52 | – | Wasser mit Algen und Seerosen, flache Oberfläche |
| Kantstein | 0,52 – 0,57 | 0,6 W | Höhe +0,08 (≈ 1 W) auf 0,6 W: harte Wasserkante aus kleinen behauenen Steinen |
| Terrasse | 0,57 – 0,72 | 1,9 W | dunkle feuchte Erde (L* 73 → 77 zur Mauer hin), dichter Schutt, Grün 50 % → 11 % zur Mauer |
| Mauerkrone | 0,72 – 0,80 | 1 W | helle behauene Blöcke (L* 78–81), Risse |
| Außenwand | 0,80 – 0,86 | 0,75 W | Abfall um ≈ 1,1 W (0,127 → 0,043) |
| Außenschürze | 0,86 – 1,08 | 2,7 W | Auftrag 0,03 (≈ 0,4 W), läuft auf ≈ 0,15 aus (Auslauf/Höhe ≈ 4–6), Bedeckung 64 % → 3 %, ausgefranstes Ende |

## Regeln mit Zahlen

### R1 · Schürze am Fuß (stimmt mit SOP Schritt 2 überein)
- Auftrag am Wandfuß ≈ 0,3–0,4 W hoch.
- Auslauf ≈ 4–6 × Auftragshöhe (SOP: 3,75 ×). Flanke im Mittel ≈ 12° (SOP ≤ 22°).
- Die Schürze endet nicht als Linie, sondern **ausgefranst**: Die Bedeckung fällt über ≈ 2,5 W von ≈ 65 % auf 0. Am Ende stehen Erdbrösel und Spritzer in der Größe von S-Steinen und kleiner (SOP Schritt 8: Sprenkel, nie Linie; bestätigt).

### R2 · Brocken-Kranz am Wandfuß (Band 0)
- Runde L-Brocken liegen direkt am Fuß, viele berühren die Wand oder ragen ein Stück unter die Krone.
- **Größe:** L ≈ 0,5–0,8 W.
- **Abstand entlang der Kante:** ≈ 1–3 L-Durchmesser, in Gruppen zu 2–3 mit Lücken.
- **Wechsel Brocken – Büschel:** Zwischen zwei Brocken steht fast immer ein Gras- oder Agavenbüschel. Büschel stehen am Steinfuß (erste Auswertung: Gras-Inseln im Median 2 Zellen ≈ 0,03 W vom nächsten Stein).
- **Abdeckung:** Brocken plus Büschel decken grob 50–70 % des Wandfußes (SOP Schritt 3 verlangt für den Sockel 15–25 % Geländebedeckung; das hier ist der Kranz davor, also eine zusätzliche Schicht).

### R3 · Ausreißer (Band 1–2)
- Einzelne runde M-Steine (≈ 0,6–0,7 L) liegen frei 1–2,5 W vor der Kante, etwa 1 je 4–6 W Umfang.
- Sie liegen auf der Schürze oder schon dahinter; die Kante „streut“ damit nach außen.
- Passt zu SOP-Band 1/2 (Dichte nach außen fallend, `downhill_only`).

### R4 · Schutt-Terrasse innen (Band 0 innen)
- Die Fläche zwischen Mauer und Wasserkante ist dicht mit Schutt belegt: am Mauerfuß dicht, zum Wasser hin dünner. Grün übernimmt zum Wasser hin (11 % → 50 %).
- **Größenleiter (abgelesen):** L-Blöcke (eckig, gefallene Mauersteine oder Säulenstumpf) ≈ 0,6–1,6 W; M ≈ 0,3–0,4 W, gerundet; S ≈ 0,12–0,18 W, gerundet.
  - Verhältnis M/L ≈ 0,4–0,6, S/M ≈ 0,5–0,6.
  - SOP `group.sizes` [1; 0,62; 0,38]: S/M passt, M/L ist in der Oasis kleiner.
- **Häufung (fraktal, abgelesen):**
  - An jedem L-Block liegen 1–3 M, an etwa jedem dritten M liegen 1–2 S (kleine an mittleren).
  - Die meisten S sitzen in Nestern, nicht verstreut. Erste Auswertung: S liegen 2–5× häufiger innerhalb eines Radius an einem größeren Stein als zufällig.
  - SOP `nest.counts` [1; 3; 1–5] ist eher zu reich: In der Oasis hat ein L meist 1–2 M.
- **Kontaktton:** Schutt liegt auf dunkler, feuchter Erde (L* ≈ 73 gegen 80 an der Krone), die sich in die Fugen zieht. Kein Verlauf: Die Erde ist zwischen den Steinen dunkel, die Steine sind hell.

### R5 · Harte Kante am Wasser
- Zum Wasser hin kein Schuttband, sondern eine Reihe kleiner behauener Kantsteine (≈ 0,4–0,6 W).
- Daran stehen Pflanzen (Agave, Palme) direkt an der Kante, Seerosen 0,5–1,5 W im Wasser.
- Wasser ist keine Fläche zum Bestreuen.

### R6 · Material → Boden (Abschluss, SOP Schritt 6)
- Die behauene Krone (hell, mit Rissen) geht nie direkt in den Sand über. Dazwischen liegen
  - außen: Außenwand → Brocken-Kranz → Schürze → Brösel;
  - innen: Krone → Schutt-Terrasse → Kantstein → Wasser.
- **Am Tor (Süden)** sind Mauer und Stufen breiter, und davor liegen mehr und größere Brocken (Ausschnitt SO). Eingänge sind also stärker eingebettet, nicht freier als der Rest. SOP Schritt 4 („Eingänge frei, Rampe ≤ 15°“) gilt nur für den Laufweg selbst.

## Für WFC (Slots, Familien)
- **Kante außen** als Übergangsfamilie `edge_outer`, Sockel-Schicht 0 bis 2,7 W:
  - Slot-Reihe A „Kranz“ bei 0–0,4 W: Brocken L (0,5–0,8 W) im Abstand von 1–3 L, 2–3 je Gruppe, dazwischen ein Büschel-Slot.
  - Slot-Feld B „Schürze“ bei 0,4–1,5 W: Auftrag nach R1, M/S nur als Nester an A.
  - Sprenkel-Saum C bei 1,5–2,7 W: Brösel und S, Dichte linear 1 → 0 (nie Linie).
  - Ausreißer-Slot D bei 1–2,5 W: 1 je 4–6 W Umfang, Wahrscheinlichkeit 0,5.
- **Fläche innen** `apron_inner`: Schuttdichte linear von 1 am Mauerfuß bis 0 an der Wasserkante. L-Anker zuerst, dann M an L (1–3), dann S an M (1–2, etwa jedes dritte M).
- **Wasserkante** als Sockel-Modul `kerb_water`: feste Reihe, kein Streu-Slot.
- **Fraktal:** Dieselbe Regel „Anker → 1–3 kleinere am Anker → je 1–2 noch kleinere an etwa jedem dritten davon“ gilt mit Faktor ≈ 0,5 pro Stufe für L→M→S und weiter für S→Kiesel. Drei Stufen reichen; Kies und Brösel übernimmt der Sprenkel.
- **WFC-Grenzen** wie `kfb_place.r1.json` → `wfc`: nur `slot_fill` und `transition_families`, nie Landmarken oder Geländehöhe.

## Abgleich mit der SOP (V-753) · Vorschläge (Entscheid bei WS0/Georg)
- **Bestätigt:** Schritt 2 (Schürze nur auftragen, Auslauf ≈ 4–6 × Höhe, flach), Schritt 5 (Steinbänder, nach außen dünner), Schritt 7 (Kontakt mit Ursache: dunkle Erde in den Fugen) und Schritt 8 (Sprenkel statt Linie).
- **Ergänzen:**
  1. **Brocken-Kranz** als eigene Schicht am Wandfuß (R2, Wechsel Brocken – Büschel).
  2. **Ausreißer-Slot** (R3).
  3. **Nester kleiner:** `nest.counts` eher [1; 1–2; 0–2] je Anker statt [1; 3; 1–5].
  4. **Tor stärker eingebettet** als die übrige Kante (R6).
  5. **Wasserkante** als harte Kante ohne Streu (R5).
- **Abweichung:** M/L ≈ 0,4–0,6 statt 0,62. Die Oasis setzt die mittlere Stufe kleiner ab; für den Knet-Look wäre der SOP-Wert lesbarer.

## Dateien
- `scripts/oasis_analyse.py`: Raster und erste Auswertung (Blender).
- `scripts/oasis_profil_fein.py`: feines Radialprofil.
- `scripts/oasis_radial.py` und `scripts/oasis_radial.r2.py`: automatische Steinstatistik, nicht belastbar für M/S.
- `scripts/oasis_renders.py`, `scripts/oasis_ausschnitte.py`: Bildbelege.
- `data/oasis_analyse.json`, `oasis_profil_fein.json`, `oasis_radial.json`, `oasis_radial.r2.json`, Karten `karte_*.png`.
- `belege/UEBERGANG_OASIS_zonen.r4.jpg`, `UEBERGANG_OASIS_aussen.jpg`, `UEBERGANG_OASIS_innen.jpg`, Einzelbilder in `belege/roh2/`.
