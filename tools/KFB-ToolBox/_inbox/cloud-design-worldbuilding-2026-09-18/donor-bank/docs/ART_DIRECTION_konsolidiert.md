# Art-Direction — konsolidierter Stand (2026-07-25)

Eingang: `uploads/KFB_Art_Direction_Voxel_Comic.md` und `uploads/KFB_Voxel_World_Art_Direction_Guide_v1.md`.
Beide decken sich weitgehend mit dem, was hier schon läuft. Diese Datei sagt, **was übernommen ist,
was bewusst wartet, und was nicht kommt** — plus die Bewertung dazu. Demo: `KFB Voxel Zone S2.dc.html`.

## Übernommen (steht in S2)

| Vorschlag | Umsetzung | Warum zuerst |
|---|---|---|
| **Screen-Space-Tusche** (Sobel auf Tiefe + Normalen) | `kfb-ink-outline.js` — ein Pass über das ganze Bild, Linienstärke schwankt (Stift-Druck), dünnt in der Ferne aus, Tuschefarbe folgt dem Story-Mode | **Der Kitt.** Ein einziger Effekt bindet Voxel, Kenney-GLB, Pet und Karte zusammen — ohne ein einziges Asset anzufassen. Größter Hebel pro Zeile Code |
| **Triplanar statt Face-Mapping** | war schon drin (Material + Foto-Layer in Welt-Koordinaten) | verhindert das Raster |
| **Prozedurale Schraffur an steilen Wänden** | `uKfbHatch`: schräge Striche, dichter je steiler und dunkler | löst „hohe Wände ohne verzerrte Textur" |
| **Vertex-Wobble / Boiling Lines** | `uKfbWobble`, in 8-fps-Stufen | nimmt der Geometrie das CAD |
| **Wenige Materialfamilien statt vieler Texturen** | sechs prozedurale Materialien, Zuordnung über Terrassen | war die Entscheidung der Vorrunde, deckt sich 1:1 |
| **Wasser als Fläche mit Schaum-Kante** | Höhenfeld als `DataTexture` im Wasser-Shader → ausgefranste Schaumlinie exakt am Ufer, Tiefe dunkelt | Ufer war die härteste Kante im Bild |
| **Große Formen vor Details / ruhige Landschaft** | Fassung fleckenweise, Oberseiten ruhiger | genau der Punkt, der oben schon gefiel |

## Bewusst später

- **Hero-Assets + Zonen-Aufbau (Wasser → Terrain → Terrassen → Hero → Atmosphäre)** — das ist Slice 2/3.
  Erst wenn ein Konstrukt steht, lohnt das Zonen-Preset.
- **Edge-Zustände (clean/worn/moss/sand/snow/glow)** — das Fugen-System kann das tragen
  (ein Parameter mehr), sinnvoll aber erst mit Biomen, nicht in der Testzone.
- **Vegetation-Cluster / Streuung** — Slice 4, läuft über `asset-repo.json` und das Streu-Rezept.
- **Aquarell-Washes als große Papierfläche über die ganze Insel** — reizvoll, aber es kollidiert mit
  dem Story-Mode-Tint (zwei Farbquellen). Wenn, dann als **Luminanz**-Layer, nicht als Farbe.

## Nicht übernehmen

- **Restriktive Retro-Palette als eigene Farbquelle.** Die Farbe kommt aus den sechs D6-Story-Modi
  (`world-context.js`) — das ist Kanon und darf keine zweite Wahrheit bekommen.
- **PBR pauschal verbieten.** Der Renderer bleibt `MeshStandardMaterial`; wir *steuern* ihn
  (Rauheit hoch, Metall 0, weiche Wert-Bänder). Ein eigener Flat-Shader würde Licht, Nebel und
  Environment neu erfinden, die schon funktionieren.

## Bewertung: was die Konzepte wirklich zusammenbringt

Nicht die Textur — die **Kontur** und das **Licht**. Deshalb ist S2 so gebaut, dass man es sieht:
links das Bestands-Rezept (edge3-Kachel, glattes Material, keine Fuge — das, was in Travel v9 läuft),
rechts das prozedurale System, dazwischen eine verschiebbare Naht. Mit **Tusche aus** sieht man zwei
Rezepte. Mit **Tusche an** sieht man eine Welt. Das ist das Argument für v10+.

**Empfehlung für die Übernahme in Travel v10+:** in dieser Reihenfolge, jeder Schritt einzeln nutzbar —
1. Tusche-Pass (`kfb-ink-outline.js`) über die bestehende Szene legen. Ändert nichts an Assets.
2. Material-System für neue Bauteile (Konstrukte, Terrassen); Bestands-Cubes bleiben, wie sie sind.
3. Schraffur + Boiling erst danach, sie sind Geschmack, kein Fundament.
4. Kenney-GLBs zuletzt: Colormap behalten, Abnutzungs-Overlay drüber.
