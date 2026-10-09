# KFB Technik und Schnittstellen R1

Stand: 2026-10-09 · Zweck: technischer Überblick für die Recherche. Gesucht sind Beispiele, Repos, Demos und Tutorials, die zu genau diesem Stack passen.

## 1 · Laufzeit und Werkzeuge

| Teil | Technik |
| --- | --- |
| Engine | three.js **r186** (WebGL2; WebGPU/TSL wäre eine Option, ist aber noch nicht im Einsatz), ES-Module, Vite-Dev-Server |
| Sprache | TypeScript im Lab, JavaScript in den Donor-Modulen (Joyride, R2D) |
| Kamera | OrbitControls (God Mode) mit `zoomToCursor` und `dampingFactor` 0,25; Third-Person-Kamera aus Joyride (Abstand nach Fahrzeuglänge) |
| Instanzierung | `BatchedMesh` je Insel, zwei Pässe (Schattenwerfer bzw. nur Empfänger); Instanzdaten (Gruppe, Phase, Steifigkeit, Paletten-Slot) in einer Daten-Textur |
| Knet-Look | Clay v10 bzw. K2: `onBeforeCompile`-Patches am Standard-Material, Relief- und Fingerabdruck-Texturen, weiche Normalen |
| Triangulierung | cdt2d (Constrained Delaunay) für Gelände mit Straßennaht als feste Kante |
| Unterseite | SDF-Feld + Marching Cubes (three/addons, 96³) bei R2D |
| Wasser | fluid.js (eigenes Modul): ein Feld je Gewässer, Uferabstand als Attribut, Schaum am Ufer |
| 3D-Werkzeuge | Blender über MCP (Straßenkörper, Mauerwerk, Renders), Blender-Coworker auf zweitem Rechner (Figuren, Animation) |
| Prüfung | three-inspect (MIT, gepatcht für r186), Headless Chrome für Renders, Messfunktionen `__kfb.sizes()`, `__kfb.envCheck()`, `__kfb.passes()`, `__kfb.measureRoadBed()` |

## 2 · Inselgelände nach R2D v0 (Zielbild, Stufe 1)

1. **Umriss:** vorzeichenbehaftetes Abstandsfeld `sdf(x, z)`, frei oder aus Hexzellen.
2. **Höhe:** analytisch, zwei Oktaven fBm in Weltkoordinaten. Jede Abflachung ist ein `lerp` mit `smoothstep`-Gewicht über mehrere Einheiten, harte Kanten gibt es nicht.
3. **Masken und Gewichte je Vertex** (`aTW`): Sand (Bankett, Ufer), Pflaster (Plätze, Wege), Fels (Rand, Schlucht).
4. **Netz:** Polarnetz über die Insel, Oberseite mit 1024²-Farbkarte in Draufsicht-UV (Grasflecken je Pixel).
5. **Sprenkel im Fragment-Shader:** `kfbLayer` je Material mit eigener Zellgröße (Basis 1,1 R2D-Einheiten; im Lab × 1,46): große Flecken, mittlere und kleine Tropfen, Rücktropfen. Das Muster hängt an der Weltposition und läuft dadurch nahtlos über Mesh-Grenzen.
6. **Kante:** Die Oberfläche rundet sich als Viertelkreis über den Rand (Kappe 1,4, Überhang 0,45) und taucht dann in den Fels.
7. **Körper:** Scholle v7. Querschnitt in Tiefe h ist der Inselumriss, geschrumpft auf den Flächenschwerpunkt, k = (1 − h/D)^pw. Eine Hauptspitze unter dem Schwerpunkt, 2–6 Nebenspitzen senkrecht nach unten.

**Sprenkel-Befund (09.10.):** Das Muster ist maßstabsabhängig. Aus Spiel- und Fahrkamera liest es sich als Sprenkel, aus Laufhöhe verschmelzen die Felder zu Flächen. Offen ist, ob für die Nahsicht eine kleinere Zelle oder eine eigene Punktlage nötig ist (Recherche P1).

## 3 · Naht Straße ↔ Gelände: `kfb.road-bed/1`

Die RKIT-Seite liefert JSON (und GLB) in Inselkoordinaten. Das Lab schneidet daraus Gelände, Wege und Rand.

```ts
interface RoadBedSpec {
  schema: 'kfb.road-bed/1'; rkitVersion; islandId; outlineHash /* fnv1a32 des Umrisses */; frame; units;
  roads: { id; profileFamily;
    sections: { s; support; family; L: V3[]; R: V3[] }[];        // Querschnitte je Station
    seam: { L: {s; p; from; kind}[]; R: {…}[]; falloff } }[];     // Naht links/rechts mit Auslauf
  mask: V3[][];    // Straßenfläche (dort kein Gelände)
  clear: V3[][];   // Freiflächen (dort keine Natur)
  anchors: { id; kind; p; dir; width }[];   // Anschlüsse (Inselweg, Brücke)
  rim: { s; centre; contour; rootDepth }[]; // Brückenwurzeln am Inselrand
}
```

- **Gemessen auf der Testinsel:** 0 Gelände-Dreiecke über Fahrbahn, Bord oder Gehweg. 244/244 Nahtpunkte und 242/242 Nahtkanten liegen im Netz, Höhenfehler 0.
- **Neue Vereinbarung für die R2D-Basis:**
  - Das Straßenbett wird analytisch: `lerp(h, roadY − 0.35, 1 − smoothstep(hw, hw + 7, d))`, mit `hw` und `roadY` je Station aus den Sections.
  - Der Straßenkörper endet mit einer Schürze ≥ 0,3 unter dem Gelände.
  - Prüfregel T2: Schürzentiefe ≥ 0,3, Gelände an hw ≥ 0,05 unter der Gehweg-Oberkante, kein sichtbarer Spalt.
- **Gelände-Einbettung** (`TerrainEmbed`): Arten `boulder` (Erdkeil bergauf), `outcrop` (Halde bergab), `rim` (Band rollt flach aus), `shrub`, `tree`, `prop`. Parameter sind Fußpolygon, Einsinken, Anstieg, Auslauf und Hangrichtung. Beim R2D-Umbau wird daraus analytische Höhe plus `aTW`-Gewichte, ohne Kontakt-Verlauf.

## 4 · Track Core (RKIT)

- **Straßen-Compiler** mit Profilen (Querschnitte mit Stützpunkten), Familien (z. B. Stadt, Land, Autobahn bzw. Rennstrecke), Stationen und Fenstern für Übergänge, etwa Übergangsstein, Bandenkopf und Verziehung.
- **Familienwechsel** sind gebaute Abfolgen von Bauteilen mit Station, kein Form- oder Farbverlauf.
- **Prüfsuite:** test-v015 97/97, Regressionen byte-gleich.
- **Offene Bausteine:** Looping, Rampensprung, Steilkurve, Tunnelportal, Rand-Rhythmus (Pattern-Baustein), Steinbogen-Brücke aus dem Fels.
- **Physik:** Fahren aus Joyride (Arcade). Loopings und Sprünge auf Inselstrecken sind noch ungetestet.

## 5 · Leistungsbudget

| Messung (Übersicht, 4 Inseln) | vorher | nachher (Kit R1) |
| --- | ---: | ---: |
| Natur Draw Calls (Haupt- / Schattenpass) | 25 / 25 | 8 / 4 |
| Natur Dreiecke (Haupt- / Schattenpass) | 145 k / 145 k | 51 k / 16 k |
| ganze Szene je Frame | 158 Calls, 483 k Dreiecke | 120 Calls, 261 k Dreiecke |

- **Budget Natur:** ≤ 16 Calls und ≤ 120 k Dreiecke je Pass.
- **Ziel:** MacBook mit 30–60 fps.
- **Regeln für `kfbBlend`:** nur in Übergangszonen rechnen, statische Übergänge backen, günstiger Hash.
- **Inspector-Befund:** Der Schatten-Pass verdoppelt die Kosten; jedes Objekt mit Schatten zählt doppelt.

## 6 · Weitere Module und Besitzer

| Modul | Hinweis |
| --- | --- |
| Joyride | Fahren, Banden-Look, `kfbBlend` (J14), Cabrio und Sitz (J17), Kamera (J10) |
| ChatterBox Voice Layer | Sprachausgabe der Bewohner, Bubble und Text auch stumm, Ducking |
| KFB-Audio-Owner | ein AudioContext, Cozy Tunes, Motor, Umgebung |
| Curtain-Modul | Theatervorhang als Character Select bzw. Übergang (Cloth-Animation) |
| Asset Librarian v10 | GPT-Site mit Registry aller Assets, Intake ohne Work-Lauf |
| Billboard-Modul | Billboard je Insel, später Video-Loops |

## 7 · Bekannte technische Fehler und Risiken

- FrizzleBob dreht sich im Cabrio um die eigene Achse (Sitz-Schicht bzw. Elternbezug).
- Die Kamera lief im letzten MVP ins Mesh; die Verdeckung war verbuggt.
- Der Sprenkel verschmilzt aus der Nahsicht zu Flächen.
- Der Wind-Deformer braucht ein eigenes `customDepthMaterial`, damit Schatten mitbiegen.
- three-inspect bündelt ein altes troika-Text, das auf r186 abstürzt; ein Vite-Transform-Patch fängt das ab.
