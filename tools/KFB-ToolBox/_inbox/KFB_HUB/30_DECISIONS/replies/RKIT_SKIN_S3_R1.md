# RKIT · Skin-Schnittstelle Schritt 3: Markierungs-Daten · Track Core 0.16.3 (R1)

Stand 2026-10-11 · privat · Lab-Vendor nicht berührt · Grundlage V-145, V-150 #1 (Pfeile), #3 (Kerb nur innen am Scheitel, RKIT schlägt Radius vor)

## 1 · Pfeile: nur dort, wo eine Linienwahl passiert (V-150 #1)

| Stelle | Pfeile | Lage | Daten |
|---|---|---|---|
| EXIT | 2 × `exit_right` bzw. `exit_left`, 40 und 15 m vor dem Abzweig | Welt: Spur der eigenen Fahrtrichtung auf der Ausfahrtseite (HIGHWAY rechts lat 8,75); race: Fahrbahnhälfte auf der Seite (±W/4 = ±3,6), weil race keine Spuren hat | `g.arrows[]` {route, s, lat, p, T, U, len 5,0, w 1,6} |
| ENTRY | 2 × `merge_left` bzw. `merge_right` auf dem Einfädel-Ast bei 20 % und 55 % der Verjüngung | Mitte des Asts | dto. |
| FORK | 2 × `split`, 25 und 8 m vor der Aufweitung | Mittellinie | dto. |
| JOIN | 1 × `merge` bei 30 % des Zusammenführens | Mittellinie | dto. |
| Kreisel-Ausfahrt (TD4 #10) | 1 × `straight` je Arm auf der ausfahrenden Spur, zeigt vom Ring weg | ausfahrende Spur | `node.arrows[]` |

**Gemessen** (Testgraph der Race-Exit-Suite):
- RACE: Exit-Pfeile bei s 20 und 45 (lat 3,6), Merge-Pfeile auf `R_on` bei s 186,7 und 214,9.
- HIGHWAY: lat 8,75.
- FORK: Pfeile bei s 35,5 und 52,5. JOIN: Pfeil bei s 290,4.

## 2 · Ringspuren

- `ringLanes` gibt es nur ausdrücklich am Kreisel: ganze Zahl ≥ 2, mindestens 3 m je Spur. Daraus werden gestrichelte Linien `ring_lane` (Strich 3 / Lücke 3) bei Insel + k · Ring/n.
- Beispiel: TOWN mit 2 Ringspuren hat eine Linie bei r 23,2; alle Checks grün.
- Auf race oder cosmic ist `ringLanes` ein Fehler (V-150 #1).
- Ohne Angabe gibt es keine Ringspuren. Die NPC-Wege bleiben einspurig auf der Ringmitte (unverändert).

## 3 · Scheitel-Kerb (V-150 #3): Radius-Vorschlag

| Wert | Vorschlag | Herkunft |
|---|---|---|
| `maxRadius` | **45 m** | J17-Regel „innen voll“ (Rippen voll ab R 45, `track-look.v5.js:204`). Kerb und Rippen setzen damit am selben Radius ein. |
| `minLength` | 8 m | S4-v2-Nahtregel |
| Krümmung | über ±2 m abgetastet, über ±8 m geglättet | wie J17 |
| Geltung | nur race-Querschnitt (keine Spuren, Fahrfläche, nicht im Tunnel); Innenseite; Slot `shoulder_L` / `shoulder_R` | S4 v2 §599 (Kerb außerhalb road) |

**Gemessen:**

| Kurve | Seite | Bereich (s) | rMin (geglättet) |
|---|---|---|---|
| R 25 rechts | innen rechts | 59,5–94,8 | 27,2 |
| R 40 links | innen links | 171,7–203,7 | 43,7 |
| R 80 | kein Kerb | – | – |
| Weltstraße (TOWN) | kein Kerb | – | – |

**Ausgabe:** `apexKerbsOf(stream)` für Rezepte, `g.apexKerbs[route]` für Graphen.

Wenn Georg bei #4 (Banden-Übergang) andere Schwellen wählt, folgt der Kerb-Radius mit.

## 4 · Gleichheit und Tests

| | |
|---|---|
| `test-skin.mjs` | **73/73**, davon 14 neu für Schritt 3: Exit / Merge race und HIGHWAY je Seite; FORK; JOIN; Kreisel-Pfeile auf der Ausfahrtspur und abseits der Achse; Ringspuren und 2 Ablehnungen; Scheitel-Kerbs race; keine auf Weltstraßen |
| `test-turnaround.mjs` | 18/18 (lässt das Zusatzfeld `node.arrows` aus) |
| test.mjs 329/0, v013 60, v014 15, v015 97 (1 erwartet), v016 116, race-exit 19, level-ramp 16 | unverändert |
| **Teil 0** (`parity/teil0_parity_v0163s3.json`) | bitgleich, Abweichung 0 |
| Schritt 4 → 3 | Graphen mit Kreisel, Kurve und EXIT (TOWN, RACE, COUNTRY, HIGHWAY): alle Ströme und Knotendaten bitgleich. Neu sind nur die Schlüssel `arrows` und `apexKerbs`. |

## 5 · Weiter

**Schritt 5:** dasselbe Muster für EXIT/ENTRY, Banden-Übergänge und Verjüngungen, also Skin am Modul, Kappen-Daten und Pfeile (schon da). Vorlagen-Zeile folgt vor dem Bau.

Offen bei Georg:
- #4 Banden-Übergang (A/B/C);
- DIRT B/C;
- CR-Fragen;
- HIGHWAY-Skin.
