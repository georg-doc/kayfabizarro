# Flächengrammatik für Cartoon-Gelände · R1 · WS1 · 20.10.2026

**Quelle:**
- Georgs Look-Feedback vom 20.10.;
- ein externes Feedback aus Georgs Perplexity-Chat zu einem Screenshot der Gelände-Probe; WS1 fasst es in eigenen Worten zusammen;
- WS1-Befunde aus den Prüfansichten der Probe.

Die genannten Industrie-Bezüge stammen aus dem externen Feedback und sind von WS1 nicht selbst geprüft:
- Epic, „Stylized Rendering Landscape“ (UE 4.27): Materialwechsel und Farbflecken als getrennte Funktionen;
- Frostbite, „Terrain Rendering“ (Andersson): grobe Maske plus materialabhängige Detailmaske;
- NVIDIA GPU Gems 1, Kapitel 20 „Texture Bombing“.

**Status:** Vorschlag. Die Übernahme in den Kanon macht WS0. Zahlen sind an der Probe kalibriert und keine Branchennorm.

## Invarianten
- **FG-1 · Aufgabe:** Jede größere Materialfläche hat eine Ursache oder eine kompositorische Aufgabe, zum Beispiel trockene Kuppe, Ufer oder Fahrkorridor.
- **FG-2 · Drei Ebenen, getrennt gesteuert:**
  - Makro legt fest, WO ein Material liegt.
  - Meso formt Kontur, Übergang und die schwache Tonvariation innerhalb eines Materials.
  - Mikro (Knete, Körnung) ändert die Lesbarkeit der beiden anderen Ebenen nicht.
- **FG-3 · Formen vor Rauschen:** Konturen bestehen aus gerichteten Grundformen (Ovale, Lappen, Keile), die per smooth-min verschmelzen. Danach folgt nur schwache Verzerrung: Hauptkontur ca. 6 m, Rand ca. 1,5 m. Keine Fläche entsteht als Rausch-Schwelle. Zum Vergleich K-F1 (WS1 §104): Seitenverhältnis ≤ 1,25, keine Zungen und keine dünnen Hälse.
- **FG-4 · Übergang = eigene Zone:**
  - Um die Grenze liegt ein Band |d| < w (Probe: w = 10 m).
  - Nur dort gibt es Gegeninseln des Nachbarmaterials.
  - Die Inseln schrumpfen weich aus dem Band heraus: Der Radius nimmt mit dem Abstand ab, statt abgeschnitten zu werden. Dadurch entstehen keine Schnittkanten.
- **FG-5 · Sprenkel mit Ursache:**
  - Wahrscheinlichkeit = Basis × Übergangsmaske × Ursachenmaske × Ruhemaske.
  - Sprenkel stehen in Nestern mit leeren Bereichen dazwischen, nicht als Konfetti und nicht gleichmäßig verteilt.
  - Formenalphabet statt reiner Kreise; das ist noch offen.
- **FG-6 · Variation < Wechsel:** Innerhalb eines Materials nur schwache Tonvariation (Probe: +7 % Helligkeit, gleicher Farbton). Zwischen Materialien ein deutlicher Unterschied bei wenigen Flächen.
- **FG-7 · Ufer mit eigener Grammatik:** Wasser → Kontaktkante → feuchte Abschnitte (nur stellenweise) → trockenes Gelände. Kein gleich breiter heller Saum (Halo).
- **FG-8 · Neigung macht plausibler, malt aber nicht schematisch:** Ein Hangwechsel läuft nur über Wert und Farbton, nie über eine Kante (siehe §104).
- **FG-9 · Kein Licht in die Albedo:** Dunkle Schattierung gehört in Licht und Schatten. Ausnahme: die bewusst komponierte Vordergrund-Tonmasse (R10); sie ist in der Grundfarbe-Ansicht als solche sichtbar und erklärt.
- **FG-10 · Abnahme-SOP:** Dieselbe Spielkamera in vier Ansichten (Endbild, nur Grundfarbe, graue Form, Material-Masken) und der Vergleich A/B/C/D:
  - A = bisher;
  - B = nur Makro;
  - C = + Übergänge;
  - D = + Sprenkel und Haptik.
  - Ist D nicht klar lesbarer als C, ist die Detailstufe zu stark.
- **FG-11 · Kalibrieren vor Ausrollen:** Prozedurale Regeln werden an einer freigegebenen Musterregion kalibriert, bevor sie auf die ganze Welt gehen.

## WS1-Befunde aus den Prüfansichten (20.10.)
- Die scharfkantigen dunklen Keile kamen von den **farbigen Gratkanten**: Die Krümmungsschwelle wurde auf Dreiecksflächen interpoliert. Die Kanten sind jetzt weicher und standardmäßig aus. Eine richtige Linien-Lösung (R11: Color Hold, nie an Farbfeldgrenzen) steht noch aus.
- Die große dunkle Fläche liegt in der **Albedo**: Es ist die Vordergrund-Tonmasse, jetzt auf ca. 15–20 L\* abgeschwächt. In der freien Übersicht wirkt sie wie ein Fleck. Sie gehört an feste Kameras (R10).
- Kantige Low-Poly-Felsen und Knet-Gelände sprachen unterschiedliche Sprachen. Die Felsen sind jetzt Knet-Blöcke: große Flächen, weiche Kanten.
