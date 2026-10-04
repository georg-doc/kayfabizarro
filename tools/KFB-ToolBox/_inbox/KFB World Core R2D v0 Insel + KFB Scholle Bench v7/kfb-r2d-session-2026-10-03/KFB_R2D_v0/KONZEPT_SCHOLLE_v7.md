# Konzept · Inselkörper v7 „Scholle“ · 2026-10-03

Status: **DECISION offen (Georg)**. Noch kein Code. Grundlage: Studium der 8 Benchmarks (Floating Islands, Polygon). Vorgänger: `FAIL_UNTERSEITE_v2-v6_2026-10-03.md`.

## 1 · Was die Benchmarks gemeinsam haben (abgelesen in Bildpixeln, Blick ca. 20° von oben)

| Benchmark | Ø Oberseite px | Plattenrand px | Körpertiefe px | Tiefe/Ø | Körper oben eingerückt | Unterseite |
|---|---|---|---|---|---|---|
| Hütte | 790 | ~20 | 240 | 0,30 | kaum | 3–4 Zacken, Hauptspitze leicht versetzt |
| Food Point | 1110 | ~25 | 365 | 0,33 | kaum, Rand gelappt | 1 Hauptspitze, 2 Nebenzacken |
| Garten | 1190 | ~30 | 285 | 0,24 | leicht | breit, 4–5 Zacken |
| Wald/Camp | 1260 | ~15 | 310 | 0,25 | kaum | 1 Spitze, 4–6 Zacken am Kranz |
| Leuchtturm | 1280 | ~60 (Steinband) | 360 | 0,28 | ja | 1 Spitze, glatt |
| Strand | 1070 | ~70 (Sandband) | 290 | 0,27 | leicht | 1 Spitze |
| Wüste/Mine | 1430 (mit Wasserring) | ~20 | 255 | 0,18 | stark (~25 %) | 1 scharfe Spitze |
| Schnee | 1150 | ~70 (Eisband) | 215 | 0,19 | stark | Spalt + Fangzahn |

**Daraus folgt:**
- **Zwei Bauteile, nicht drei:** (A) eine **Deckplatte**, flach, mit senkrechtem Rand in Oberflächenfarbe, Dicke 2–6 % vom Ø. (B) **ein** facettierter **Felskörper** darunter.
- Der Körper ist **sichtbar** 0,18–0,35 × Ø tief. **Korrektur beim Bauen:** Die vordere Kante der Oberseite verdeckt einen Teil des Körpers. Die wahre Tiefe ist (sichtbar + sin e/2)/cos e, mit sin e = Höhe/Breite der Oberseiten-Ellipse, und liegt damit bei **0,36–0,50 × Ø**. Unsere 0,6 waren also nur etwas zu tief. Falsch war die Form.
- Der Körper ist ein **umgedrehter, facettierter Kegelstumpf**, der dem Umriss folgt. Er verjüngt sich von **einer** waagrechten Ebene unter der Platte zu **einer** Hauptspitze in Schwerpunktnähe.
- **Zacken sind Ecken desselben Körpers**, nach unten gezogen. Es gibt keine angesetzten Teile. 2–6 Zacken, alle zeigen senkrecht nach unten, die Hauptspitze ist am tiefsten.
- **Facetten sind groß:** 8–14 Flächen je Ring. Wenige Ringe (3–5), nach unten immer weniger Ecken. Flach schattiert.
- Farbe: einfarbig je Biom, nach unten etwas dunkler. Optional ein **Steinband** unter der Platte (Leuchtturm).

## 1b · Nachgemessen statt abgelesen (03.10., nach Georgs „keine Variante stimmt“)
Die Ablesung in Tabelle 1 und meine Profil-Ablesung an der Hütte (breite Schulter) waren falsch. Jetzt stelle ich die Silhouetten aus den Benchmark-Bildern frei: Flood-Fill vom Rand, Toleranz 5 je Schritt und höchstens 95 Abstand zur Randfarbe der Zeile, Kontrollbild `evidence/benchmark-masken.png`. Daraus entsteht je Benchmark eine Breite pro Zehntel der sichtbaren Tiefe (`benchmark-silhouetten.json`).
Befund: Alle acht Körper sind **V-förmig, fast linear** bis etwa 0,3 der Breite und enden dann in einer kurzen Spitze. Sichtbare Tiefe/Breite: 0,35–0,44, Hütte 0,6.
Die Bank rendert jede eigene Insel mit der Kamera ihres Benchmarks, stellt die Silhouette genauso frei und führt Tiefe und Profil nach. Die Abweichung steht in jeder Kachel.

## 2 · Modell (Module, je ein Besitzer)

| Modul | Eingang | Ausgang | Prüfung (gemessen, im UI) |
|---|---|---|---|
| **M1 Umriss** | Plan-SDF (vorhanden) | Polygon mit n Ecken (24–40), gelappt | Fläche, Schwerpunkt C, Ø |
| **M2 Deckplatte** | Umriss, Höhenfeld der Oberseite, Plattendicke t | EIN Mesh: Oberseite als Raster, im Umriss beschnitten + senkrechter Rand bis zur Ebene y_S. Randecken = Umrissecken | dicht (jede Kante 2×), Randhöhe ≥ y_S + t |
| **M3 Felskörper** | Umriss-Polygon auf y_S, Biom-Parameter | EIN Mesh: Ring 0 = Umriss (eingerückt um e), Ringe 1…K mit Tiefe d_k und Schrumpfung s_k um C, Ecken je Ring abnehmend, Zufallsversatz, Zacken = gezogene Ecken, unten ein Fächer zur Hauptspitze | dicht, Tiefe/Ø, Spitze–C-Abstand, Zahl der Zacken, △ < 2 000 |
| **M4 Naht** | M2-Unterkante, M3-Ring 0 | gemeinsamer Ring auf y_S, Unterseite der Platte geschlossen | keine offene Kante, kein Durchstoß |
| **M5 Material** | Biom-Farben | Knete v10 auf flachen Normalen (Facetten bleiben lesbar) | — |
| **M6 Biom-Tabelle** | — | t, e, Tiefe/Ø, Profil der Verjüngung, Ecken je Ring, Zacken, Steinband ja/nein, Farben | — |

Regeln für M3:
- Tiefe D = Ø × (0,18–0,35, je Biom). Profil d_k = D·(k/K)^a, s_k = 1 − (k/K)^b. Mit a < 1 ist der Körper bauchig, mit a > 1 spitz.
- Ecken je Ring: Ring 0 = Umriss vereinfacht auf ~14, dann 11 → 8 → 5. Jede Ecke bekommt einen eigenen Versatz radial ±8 % und vertikal ±6 % von D. Das macht die Facetten.
- Zacken: im vorletzten Ring 2–6 Ecken um 10–25 % von D nach unten ziehen. Die Hauptspitze liegt bei C + kleinem Versatz (≤ 5 % Ø) und ist am tiefsten.
- Keine Glättung, keine Abstandsfelder, keine angesetzten Kegel.

## 3 · Vorgehen
1. **Bank isoliert** (`KFB Scholle Bench v7.dc.html`): nur M1 + M3 (+ schlichte Platte M2 ohne Gelände), 8 Voreinstellungen nach Tabelle 1, Seitenansicht in Arbeitsgröße neben dem jeweiligen Benchmark. Messwerte im UI.
2. **Georg nimmt die Form ab.**
3. Erst dann Einbau in die Insel: M2 mit echtem Gelände, M4 Naht, Straße und Bach, Biome.
4. Performance-Ziel: Körper + Platte < 20 ms je Insel, statt 3–4 s wie bisher.

## Offen für Georg
- Facetten flach (wie Benchmark) oder weich auf Facetten (mehr Knete)?
- Steinband unter der Platte: nur für bestimmte Biome oder gar nicht?
- Soll die Bank die 8 Benchmarks nachstellen, oder sofort unsere 5 Biome?
