# Studie Übergangszonen R1 · RETURN (WSB, 18.11.2026)

**Auftrag:** WS0 18.11. (3), Georg. Meshy „Oasis of the Ruins“ analysieren, nicht einbauen: Wie sind die Ränder gebaut? Daraus eine Übergangslogik mit Regeln und Zahlen, fraktal anwendbar, als Grundlage für WFC-Platzierung, dazu Bildbelege. Abgleich mit der SOP `embed.sop` (V-753).

**Ergebnis:** `UEBERGANGSLOGIK_R1.md`. Kurzfassung:
- **Zonen** (gemessen, W = Breite der Mauerkrone): Teich → Kantstein (0,6 W, Anstieg ≈ 1 W) → Schutt-Terrasse (1,9 W) → Krone (1 W) → Außenwand (Abfall ≈ 1,1 W) → Außenschürze (2,7 W).
- **Schürze:** Auftrag ≈ 0,4 W, Auslauf ≈ 4–6 × Höhe, ≈ 12° Flanke. Sie endet ausgefranst als Sprenkel (Bedeckung 65 % → 0 über 2,5 W). Das bestätigt SOP Schritt 2 und 8.
- **Neu gegenüber der SOP:**
  - Brocken-Kranz am Wandfuß (L 0,5–0,8 W, Abstand 1–3 L, Wechsel Brocken – Büschel).
  - Ausreißer-Steine 1–2,5 W vor der Kante.
  - Kleinere Nester (ein L hat meist 1–2 M, etwa jedes dritte M hat 1–2 S).
  - Tor stärker eingebettet als der Rest.
  - Harte Wasserkante ohne Streu.
- **Fraktal:** Anker → 1–3 kleinere am Anker → je 1–2 noch kleinere an etwa jedem dritten; Größenfaktor ≈ 0,5 je Stufe. Drei Stufen, danach übernimmt der Sprenkel.
- **WFC:** Übergangsfamilie `edge_outer` mit vier Slot-Arten (Kranz, Schürze, Sprenkel-Saum, Ausreißer), dazu `apron_inner` und `kerb_water`.
- **Bildbelege:**
  - `belege/UEBERGANG_OASIS_zonen.r4.jpg` (Draufsicht mit Zonen),
  - `belege/UEBERGANG_OASIS_aussen.jpg` (Außenrand: Draufsicht-Ausschnitte und schräg),
  - `belege/UEBERGANG_OASIS_innen.jpg` (Terrasse und Wasserkante),
  - Einzelbilder in `belege/roh2/`.

**Belastbarkeit (wichtig):**
- Zonen, Höhen, Bedeckung und Schürze sind gemessen.
- Steingrößen und Häufungen habe ich am orthografischen Bild abgelesen (±30 %).
- Die automatische Zählung von M/S-Steinen ist am Meshy-Netz nicht belastbar: Dünne Spitzen aus Gras und Rauschen zählen als Steine. Ich gebe sie nur als Hinweis mit (`data/oasis_radial*.json`).
- In einem ersten Lauf hatte ich Terrasse und Krone als eine Zone gemessen; das ist mit dem feinen Radialprofil korrigiert.
- Wer die Regeln als Zahlenwerk für `kfb_place` übernehmen will, sollte sie an einem zweiten Referenzmodell gegenprüfen.

**Für WS0/Georg zu entscheiden:**
- SOP-Ergänzungen 1–5 aus `UEBERGANGSLOGIK_R1.md`.
- `nest.counts` kleiner, also [1; 1–2; 0–2] statt [1; 3; 1–5].
- M/L 0,62 der SOP lassen (lesbarer im Knet-Look) oder auf ≈ 0,5 wie in der Oasis.
