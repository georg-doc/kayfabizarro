# KFB Profilfamilien · Track Core v0.13 · RKIT R3 · 2026-10-08

Status: **VORSCHLAG, gemessen und getestet, von Georg zu bestätigen.** Die Zahlen leben als Daten im Track Core (`PROFILE_FAMILIES`, `LANE_WIDTHS`, `KFB_VEHICLE`). Blender liest sie aus `profiles.v013.json` und rechnet nichts davon nach.

## 1 · Maßstab: gemessen, nicht geschätzt

| Was | Wert | Quelle |
|---|---|---|
| Figur | 1,9 m | Island Worldbuilder Lab, `src/residents/resident.ts` (KayKit Rig_Medium 1,2 m → 1,9 m) |
| Retro Cartoon Cars, Länge | 6,0 m (normiert) | Lab `loadCar()`: Länge auf 6,0 m skaliert |
| Retro Cartoon Cars, Breite | **2,76–3,11 m** (Carrier 2,76 · Cruiser 2,83 · Cicada 3,11) | im Lab-Browser mit three.js `FBXLoader` + `Box3` gemessen, dieselbe Normierung wie im Lab |
| Retro Cartoon Cars, Höhe | 2,69–3,17 m | dito |
| Race-Fahrzeuge (Track Core) | 4,1 m Länge, Hüllkurve 4,0 + 3,0 m hoch, 4,1 m breit | Track Core `VEHICLE_ENVELOPE` (unverändert) |

Die Brief-Annahme „Auto ~2,6 m breit“ trifft die echten Assets nicht. Bei 3,11 m Fahrzeugbreite sind 3,5-m-Spuren zu eng (0,2 m je Seite). Deshalb: **Spur 3,75 m Minimum, 4,0 m Standard, 4,5 m breit.**

## 2 · Familien (14 Track-Core-Slots, Rollen je Familie)

Breite = Spuren × Spurbreite (+ Mittelstreifen). Kein globaler Skalierungsfaktor (K = 0,375 ist verworfen).

| Familie | Spur | Spuren (Default) | Fahrbahn | Seitenteil je Seite | Gesamt | Deck | Kurvenradius Kreuzung | Markierung |
|---|---|---|---|---|---|---|---|---|
| TOWN | 4,0 | 1+1 | 8,0 | Rinne 0,25 · Bordstein 0,18 hoch · Gehweg 2,5 | **13,5** | 0,6 | 8 m | Spurlinien, keine Randlinie |
| DRIVING_SCHOOL | 4,0 | 1+1 (auch 0+1) | 8,0 | Rinne 0,25 · Bordstein 0,12 · Vorfeld 1,5 | 11,5 | 0,6 | 8 m | Spurlinien |
| COUNTRY | 3,75 | 1+1 | 7,5 | Schotterbankett 1,0 · Grünstreifen 1,5 fallend zum Graben | 12,5 | 0,8 | 10 m | Rand + Mitte |
| MOUNTAIN | 3,75 | 1+1 | 7,5 | Bankett 0,5 · Leitplankenstreifen 0,8 | 10,1 | 1,0 | 10 m | Rand + Mitte |
| HIGHWAY | 4,5 | 2+2 … 4+4 | 22 … 40 | Standstreifen 3,0 · Betonwand 0,6 (1,0 hoch) | 29,8 … 47,8 | 1,6 | 18 m | Rand, Spur, Mittelstreifen-Ränder |
| RACE | – | keine Spuren | WIDTHS (10,8 … 28,8) | v0.12-Profil unverändert | 23,04 (STANDARD) | 2,25 | 14 m | TRACK |
| COSMIC | – | keine Spuren | wie RACE | wie RACE | wie RACE | 2,25 | 14 m | MAG |

- **1–8 Spuren** (`lanes: [links, rechts]`, Rechtsverkehr: rechts = mit der Fahrtrichtung), Mittelstreifen nur zwischen Gegenrichtungen. 9 und 0 Spuren werden mit Regel abgelehnt (getestet).
- **Spur hinzufügen/wegnehmen** (`WIDTH_STEP lanes:[…]`): die gegenüberliegende Fahrbahnkante bleibt liegen (Drift < 1 mm), die äußere Spur wächst/schrumpft in der Rampe (Länge nach `WIDTH_TAPER`), Trennlinie erscheint erst ab halber Spurbreite. Das ist der Verzögerungs-/Beschleunigungsstreifen.
- **Familienwechsel** (`WIDTH_STEP family:'COUNTRY'`): alle Seitenmaße, Spurbreite und Fahrbahnbreite laufen weich über das Stück (max. Slot-Sprung 0,55 m bei 0,5-m-Samples).
- **Querneigung:** Weltstraßen max. **4°** (≈ 7 %), Rennen behalten bis 24°. Gefunden, weil die A1-Ankunft an der Insel sonst 21° schräg war.
- **Rollen:** jede Familie benennt, was die Slot-Spannen sind (z. B. TOWN: `barrier_side` = Bordstein, `barrier_cap` = Gehweg). Material und Clay-Look tauscht der Surface/Clay-Owner pro Rolle.

## 3 · Offene Entscheidungen für Georg

1. **Race-Maßstab vs. Welt-Maßstab:** Track Core rechnet Rennen mit 4,1-m-Autos, die Welt hat 6-m-Autos. RACE-Profile sind unverändert. Sollen Weltautos auf Rennstrecken fahren, braucht es eine Entscheidung (Rennbreiten × 1,46 oder eigene Weltrennklasse).
2. Spurbreiten 3,75 / 4,0 / 4,5 m bestätigen (Vorschlag lag bei 3,5–4).
3. Bordsteinhöhe 0,18 m (Cartoon, leicht über real) und Gehweg 2,5 m bestätigen.
