# Prototyp „Knete als echte Verformung“ R1 · 16.11.2026

Anlass: Georg findet weder das prozedurale Relief noch eine einzelne Textur überzeugend („muss eine gewisse Dreidimensionalität haben“). Als Vorbild nennt er das Greyscalegorilla-Tutorial (E.J. Hassenfratz, youtube F-oA5cvokJ8).

## 1. Mund-Quadrat: Ursache und Fix
- **Ursache:** `FB_Mund_closed` ist eine durchsichtige, beidseitige Karte vor dem Gesicht (`transparent`, `side 2`, 0,41 × 0,28). In meinem Harness warf sie Schatten. Die Schattenkarte kennt keine Durchsichtigkeit, also fiel ein voller rechteckiger Schatten mit Streifen auf das Gesicht. Daher kamen das Quadrat und das „Raster“ auf Wange und Kiefer, das beide Kritiker gemeldet hatten.
- **Im Spiel richtig:** `faceMountActor.js` (V-1773) lässt nur Nase und Brauen Schatten werfen, den Mund nicht.
- **Fix im Harness:** `castShadow = false` für `FB_Mund_*`. Beleg: `evidence/mund_m1.jpg`, drei Spalten: wie geladen | ohne Mund-Schatten | Mund ausgeblendet.
- **Gleicher Fehler in älteren Bildern:** Das Lichtkante-Harness (`CLAY_LICHTKANTE_R1/lichtkante.html`) hat ihn auch, also auch die Bilder fb_ssot_* von dort.

## 2. Was das Tutorial macht (im Transkript gelesen, 16.11.)
1. **Knete-Material mit Höhenkarte als echtes Displacement.** Redshift unterteilt das Netz beim Rendern (Tessellation, minimale Kantenlänge 0) und verschiebt die Geometrie, also nicht nur die Normalen.
2. **Maßstab = Handgröße.** Die Figur ist in echter Größe gebaut (ein Frosch, so groß wie eine Hand), die Knete-Textur deshalb in echter Knete-Größe. Bei KFB habe ich die Texturen bisher auf 1,74 m Figurenhöhe gekachelt; damit sind die Merkmale rund fünfmal zu klein gegenüber einer Knetpuppe.
3. **Displacer mit „Knocky“-Rauschen** (zellartig) auf jedes Teil: Er verbiegt die **Silhouette**. Höhe 0,5 cm, am Kopf 0,25 cm, an Augen und Mund 0,1 cm. Am Kopf wird nur nach außen verschoben, damit der Mund nicht schwebt. Bei einer handgroßen Figur sind das grob 1,5–3 % der Größe.
4. **Subsurface (Random Walk):** Farbe wie die Grundfarbe, Eindringtiefe etwa 0,5 cm, Stärke etwas herunter.
5. **Triplanar**, wenn die UVs nicht passen.
6. **„Boiling“:** UV-Versatz der Textur und Seed des Displacers springen alle 4 Bilder bei 30 fps (Signal-Plugin, Step Time 4). Gehört in die spätere Bewegungsrunde.

**Kern:** Der 3D-Eindruck kommt aus echter Verformung, und zwar groß an der Silhouette und klein in der Fläche. Unsere bisherigen Versuche (v1.1, v1.2, v1.3, Texturen) haben nur Normalen verbogen; die Silhouette blieb glatt wie CGI. Deshalb überzeugte keiner.

## 3. Prototyp (nur Harness, kein Kanon)
- `knete_v13.html` → `KFB_DISP`, Lauf: `KFB_OPTS='{"amp":0.008}' node tests/render_disp.mjs --tag d4`.
- **Netz:** Nur die Haut von FB (r1j). Sie wird einmal fein unterteilt; die neuen Kantenmitten werden auf die Tangentialebenen gezogen, das rundet.
- **Verschiebung** entlang der gemittelten Normale:
  - Zellenfeld (F2−F1, weich), das ergibt flache Daumenflächen mit weichen Furchen und jeweils eigener Höhe, ähnlich wie „Knocky“;
  - dazu eine leichte Großform-Wellung.
- **Gleiche Position, gleiche Verschiebung**, also keine Risse an UV-Nähten.
- **Teile verschieden stark:**

  | Teil | Faktor |
  |---|---|
  | Arme, Beine, Schwanz | 1,0 |
  | Kopf | 0,6 |
  | Ohren | 0,5 |
  | Bauch unter dem Shirt | 0,25 |

  Um die Mundkarte herum wird nicht verschoben.
- **Fläche:** v1.1 ohne Relief, dazu Clay009 triplanar in Handgröße-Kachel (1,0 Figurenhöhe).
- **Stärken:**

  | Lauf | Stärke (Figurenhöhe) | Ergebnis |
  |---|---|---|
  | d2 | 0,012 | zu stark: Blumenkohl-Kopf, die Haut drückt durch Mund und Shirt |
  | d3 | 0,005 | leicht |
  | d4 | 0,008 | mittel, wird gezeigt |

- **Kanon-Wache:** PASS.
- **Noch offen:**
  - Subsurface (in three.js nicht eingebaut; als Näherung bräuchte es eine Änderung am Licht- und Materialmodell, Entscheidung WS0);
  - Höhenkarte der Textur als zweite, feine Verschiebung;
  - Boiling.

## 4. Was das fürs Spiel hieße (Vorschlag, nicht entschieden)
- Verformung **einmal backen**, nicht live: WSB verschiebt die Haut in Blender (Displace-Modifier mit Zellenrauschen, je Teil eigene Stärke, Mund-Bereich ausgespart) und exportiert den Web-Kanon neu, mit vertretbarer Polygonzahl. Im Spiel kostet das dann nichts zusätzlich.
- Die feine Knete (Fläche) bleibt im Knete-Modul oder als Karte.
- Boiling später: zwei bis drei gebackene Seed-Varianten bzw. ein Versatz, der alle 4 Bilder springt.
- **Abnahme:** im Spiel, nicht nur im Stilbild.

Bilder: `evidence/disp_gesicht_d4.jpg`, `evidence/disp_ganz_d4.jpg` (heute | Verformung), `evidence/disp_ganz_d2.jpg` (zu stark, zur Einordnung).
