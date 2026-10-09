# KFB Profilfamilien · Track Core v0.14 · Maßstab-Kontrakt K2 · 2026-10-08

Ersetzt `KFB_PROFILE_FAMILIES_v013.md`. **Keine Meter mehr**: Einheiten des Labs, gemessen in **H** (Medium-Figur = 3,64) und **MC** (MacroCell = 6,4 = ein Stockwerk). Quelle: Island Worldbuilder Lab `docs/SCALE_CONTRACT_K2.md` und `docs/RKIT_GATE1_SCALE_NOTE.md` (Steuer-Sitzung, Georgs Korrektur).

## 1 · Was K2 an v0.13 ändert

| Größe | v0.13 | v0.14 (K2) | Regel |
|---|---|---|---|
| Figur | „1,9 m“ (falscher Lab-Kommentar) | **1 H = 3,64** | Figuren werden nie umskaliert |
| Spurbreiten | 3,75 / 4,0 / 4,5 | **unverändert (PASS)** | aus Autobreite 2,76–3,11 |
| Gehweg (TOWN) | 2,5 | **5,2** (≥ 1,3 H = 4,8) | |
| Bordstein | 0,18 | **0,35** (≈ 0,1 H) | |
| Wand / Leitplanke (HIGHWAY), Brückengeländer | 1,0 / 0,95 | **1,3** (≈ 0,35 H) | |
| TOWN 1+1 gesamt | 13,5 | **19,2 = 3 MC** | Häuser auf dem Zellraster |
| TOWN 2+2 gesamt | 21,5 | **32,0 = 5 MC** (Mittelstreifen 4,8) | MC-Fang über den Mittelstreifen |
| DRIVING_SCHOOL 1+1 gesamt | 11,5 | **12,8 = 2 MC** (Vorfeld 2,0, kein Gehweg) | falls Gehweg nötig → 19,2 |
| Durchfahrtshöhe | 7,0 | 7,0 (Core-Hülle, ≥ 5,8 ✓) | Fußgänger ≥ 4,8 |
| COUNTRY / MOUNTAIN / HIGHWAY | 12,5 / 10,1 / 29,8 | unverändert (frei) | |

Einbahn-Rampen (TOWN 0+1 = 15,2) sind keine Häuserstraßen und bleiben ungefangen.

## 2 · Vorschlag Rennen = Weltmaßstab (Punkt 5, **nicht umgesetzt**, wartet auf Georg)

Problem: Der Track Core rechnet Rennen mit Autos der Länge 4,1 (Box-Stop BOX1), die Welt mit 6,0. Georgs Richtung: dieselben Autos überall, keine Sonderklasse.

**Vorschlag: neue Rennklasse `RACE_W` daneben, Joyride-Klasse bleibt unberührt.**

| | Joyride `RACE` (bleibt) | `RACE_W` = `RACE` × 1,46 |
|---|---|---|
| Faktor | – | 6,0 / 4,1 = **1,463** |
| Breitenklassen NARROW … HERO_XL | 10,8 / 14,4 / 18 / 21,6 / 28,8 | 15,8 / 21,1 / 26,3 / 31,6 / 42,1 |
| Seitenteil (Bankett, Spalt, Bande) | 1,98 / 0,72 / 1,62, Bande 1,35 hoch | 2,90 / 1,05 / 2,37, Bande 1,98 hoch |
| Gesamt (STANDARD) | 23,0 | 33,7 |
| Deck | 2,25 | 3,29 |
| Loop-Mindesthöhe | 60 | 88 |
| Fahrzeughülle | Breite 4,1, Höhe 4,0 + 3,0 | Breite 3,11 (Weltauto), Höhe 3,2 + 2,6 = **5,8** (K2-Durchfahrt) |
| Querneigung | bis 24° | bis 24° (Rennen) |

- **Umsetzung (nach OK):** eine Familie `RACE_W` in `PROFILE_FAMILIES` (Slot-Profil = v0.12 × 1,463, gleiche Rollen und Joyride-Farben), eigene `WIDTHS_W` und `LOOP_MIN_H_W`; alle bisherigen Fixtures und der Joyride-Bestand (`track-look`, Rennphysik, Kamera) bleiben byte-gleich. Regression: S13-Bericht muss weiter byte-identisch sein.
- **Nicht skaliert werden:** Rennphysik (g 15, vMax 27) und Kamera; die tunt der Race-Owner später für die größeren Autos. Mit 1,46-mal breiteren Bahnen bei gleicher Geschwindigkeit wirkt die Strecke „langsamer“. Das ist eine Physik-Entscheidung, keine Profilfrage.
- **Alternative (nicht empfohlen):** Rennautos auf 4,1 lassen und nur die Welt groß. Das widerspricht „keine Sonderklasse“.
