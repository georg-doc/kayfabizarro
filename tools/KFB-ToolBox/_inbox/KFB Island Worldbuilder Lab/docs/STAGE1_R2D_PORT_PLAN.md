# Stufe 1 · R2D-Inselbasis im Lab · Bauplan

Stand: 2026-10-09 · Vorbereitung vor Georgs Reset · Bau erst danach, in einem Zug. Der Bau ist Abarbeiten dieses Plans, kein Suchen.
Grundlage:
- `donors/kfb-island-kit-r2-2026-10-08/BAUANLEITUNG.md` (§0–§11), `KFB_R2D_v0/island.js` (548 Zeilen), `KFB_R2D_v0/scholle-bench.js` (Scholle v7);
- Masterplan R2 §0, §4, §5;
- QA-Regelwerke §00/§01;
- `SCALE_CONTRACT_K2.md`.

## 0 · Ziel und Abnahme

**Ziel:** Eine Lab-Insel entsteht nach R2D-Bauweise, im Lab-Editor, auf three r186, im Maßstab K2:
- analytische Höhe, Masken und Gewichte je Vertex;
- Polarnetz mit Farbkarte in Draufsicht;
- Sprenkel S1;
- Viertelkreis-Kante, Scholle v7 als Körper.

Gebäude-Katalog K2 und Straßenbett laufen darauf. Das alte Gelände bleibt nur noch über `?terrain=old` erreichbar, bis Stufe 1 abgenommen ist.

**Abnahme:**
- **Harte Regeln (§6)**, automatisch.
- **Blinder Kritiker** nach `QA_CRITIC_PROTOCOL_R1.md`: Mittel ≥ 8, kein Wert < 6, Weltlogik ≥ 7.
- **Georg:** eine Insel aus 4 Kameras.
- **Stopp** nach 2 erfolglosen Reparaturen.

## 1 · Was aus R2D übernommen wird (Zuordnung)

| R2D (`island.js`) | Lab-Ziel | Art |
| --- | --- | --- |
| `clamp`, `lerp`, `sstep`, `vnoise`, `fbm`, `smin`, `distSeg`, `sdHex` (Z. 49–57) | `src/island/r2d/math.ts` | 1:1 portieren, typisieren |
| `planIsland(seed, TC, shape, cfg)` (Z. 60–136) | `src/island/r2d/plan.ts` → `planFromSpec(spec, road)` | **umbauen** (§2): R2D plant die Insel um eine Track-Core-Straße; das Lab plant aus dem Editor-Umriss plus RKIT-Straßenbett |
| `fields(P)` → `heightAt`, `maskAt`, `weightsAt` (Z. 137–163) | `src/island/r2d/fields.ts` | 1:1, Eingaben aus `planFromSpec` |
| `buildTerrain(P, F, pal, U0)` (Z. 165–206): Polarnetz, Viertelkreis-Kante (cap 1,4, ov 0,45), Ränder | `src/island/r2d/terrain-mesh.ts` | 1:1, three-API r186 prüfen (§4) |
| `buildBody` (Z. 210–258), Unterseite v3–v6 | **nicht übernehmen**, ersetzt durch Scholle v7 | – |
| `scholle-bench.js` `buildScholle(pr, {soft, Dm})`, `PRESETS`, `TARGET` | `src/island/r2d/scholle.ts` | 1:1; Umriss = Lab-Insel, Querschnitt geschrumpft auf den Flächenschwerpunkt |
| `paintMaps(P, pal, box, N = 1024)` (Z. 261–285): Grasflecken-Farbkarte, Maskenkarte | `src/island/r2d/maps.ts` | 1:1 (Canvas 2D) |
| `patchTop` (Z. 333–352): `kfbLayer` im Fragment-Shader auf `aTW` | `src/island/r2d/top-material.ts` | **tauschen**: `kfbSpeckleLayer` aus `src/clay/kfb-speckle.ts` (S1) statt `kfbLayer`; gleicher Vertrag (Gewicht → Maske), Uniform `uSpeckleK` |
| `BIOMES`, `SNOW_PAL` (Z. 32–47) | `src/palettes.ts` | **zusammenführen** mit `ENV_ROLES`: Biom-Zeile `{ pal, terr, under, transitions }`, eine Farbquelle (§3) |
| `boot()`: Renderer, Licht, Himmel, `importPinned` | **nicht übernehmen** | Lab-Host behält Renderer, Licht, Kamera; Himmel aus `sky-core.r0a.js` nur, wenn Georg es will |
| fluid.js F0–F2 (Island Kit R2) | `src/island/r2d/water.ts` | 1:1, Teich und Bach; F3/F4 später |
| Clay v10 + Relief | bereits im Lab (`src/clay/clay-material.ts`, `clay-relief-v2.ts`) | kein Neuimport |

## 2 · `planFromSpec`: R2D-Plan aus Lab-Daten

| R2D-Feld | Herkunft im Lab |
| --- | --- |
| `sdf(x, z)` | Abstand zum Polygon aus `spec.outline` (gesampelt wie heute `polygonize`), dazu `+ 2.2·fbm(x·0.04, z·0.04) − 0.4` wie R2D „frei“. Der Umriss-Editor bleibt Owner |
| `natural(x, z)` | `spec.terrain.hills`/`hillScale` als fBm-Amplitude und -Frequenz; `spec.terrain.mount` als weicher Hügel (smoothstep-Glocke) |
| `roll` | aus Biom-Zeile `terr.roll` (R2D-Werte) |
| `pads` | aus `spec.buildings[]`: `{ x, z, r: pad, h }`, h = Grundhöhe am Gebäude |
| `plazas`, `paths` | aus dem heutigen Kompositions-Teil von `IslandField` (Landmarke, Freifläche, Wege) bzw. später aus dem Editor |
| `roadDist`, `hw`, `roadY` | aus `RoadBedField` (`kfb.road-bed/1`): Abstand zur Achse aus den `sections`; **hw und roadY je Station** (hw = Stützpunkt 6 zur Achse), interpoliert entlang s. Ohne Straße: `roadDist = ∞` |
| `pond`, `creek` | `spec.terrain.pond`; Bach später im Editor |
| Böschung | `lerp(h, roadY − 0.35, 1 − sstep(hw, hw + W, d))` mit **W = max(7, 1,5 · |h − roadY|)**, rund (Recherche P2) |

## 3 · Adapter: Was die anderen Module weiter aufrufen

`IslandField` bleibt als Fassade erhalten, damit Environment, Natur, Straßenbett und Probes ohne Änderung laufen. Gezählte Aufrufe: `height` 11×, `base` 3×, `bed` 3×, `inOpen` 2×, `free` 1×, `isClear` (Environment), `pathDist` 2×, `addEmbed`/`clearEmbeds` (main, probe2).

| Methode | neue Umsetzung |
| --- | --- |
| `height(x, z)` / `base(x, z)` | `fields.heightAt` (+ Embeds als analytische Höhe) |
| `bed(x, z)`, `inOpen`, `free`, `isClear`, `pathDist` | aus `maskAt` bzw. Plan (Pads, Plätze, Wege, Straßenmaske) |
| `addEmbed(e)` | Einbettung als analytische Höhe (Erdkeil bergauf, Halde bergab) plus `aTW`-Gewichte (Erde bzw. Fels am Fuß). **Kein** `contact`-Verlauf mehr, `contactShade` entfällt (§01) |
| `rebuildGround()` | baut Oberseite, Kante und Scholle neu, nur die betroffene Insel |
| Straßenbett-Messung `measureRoadBed`, `exportRimProfiles` | bleiben; Rim-Profile danach neu exportieren (RKIT braucht sie für die Kämpferbänke) |

**Farbquelle:** Gras, Erde, Sand, Pflaster und Fels kommen aus `ENV_ROLES` (Lab). Die R2D-Paletten werden als Biom-Zeilen eingetragen, nicht parallel geführt.

## 4 · three r160 → r186: zu prüfende Punkte

- `onBeforeCompile`-Patches: Chunk-Namen `#include <color_fragment>` bzw. `<begin_vertex>` gegen r186 prüfen (im Lab bereits genutzt, also bekannt gut).
- `customProgramCacheKey` je Patch setzen (S1 vs. alt).
- Scholle v7 braucht **kein** Marching Cubes (Ring-Lofting + Taubin-Glättung, `scholle-bench.js`); keine addons-Abhängigkeit.
- **Hash ohne Sinus** (Hoskins-Stil, wie in fluid.js vorgeschrieben) für S1 prüfen: `fract(sin(…))` verliert weit vom Ursprung bzw. bei großen Weltkoordinaten an Genauigkeit (Hinweis aus NotebookLM-Report). Teil des S1-TUNE.
- `outputColorSpace`, `toneMapping`: Lab-Werte beibehalten (Neutral). R2D nutzt ACES, deshalb Farben im Vergleichsbild prüfen.
- `fwidth` in GLSL3: vorhanden (S1 nutzt es schon).

## 5 · Reihenfolge (ein Zug nach dem Reset)

1. `r2d/math.ts`, `fields.ts`, `plan.ts` (`planFromSpec`) mit Einheitstest gegen R2D-Referenzwerte: gleiche Höhen an 50 Stichpunkten bei gleichem Seed in einem Testaufbau.
2. `terrain-mesh.ts` (Polarnetz + Kante) und `maps.ts`; `top-material.ts` mit S1.
3. `scholle.ts` aus der Bench; Insel-Umriss als Querschnitt.
4. `IslandField`-Fassade auf die neuen Felder umstellen, Schalter `?terrain=old`.
5. Straßenbett analytisch (§2), T1/T2 messen auf `rkit_hub`.
6. Gebäude-Katalog auf K2 umstellen (Tür ≥ 1,15 H), Migration der gespeicherten Welten (`scale-k2`).
7. Rim-Profile neu exportieren und an RKIT melden.
8. Harte Regeln (§6), dann Kritiker nach Protokoll, dann Georg.

## 6 · Harte Regeln Stufe 1

| Regel | Messung |
| --- | --- |
| keine Farbverläufe bzw. kein Alpha an Übergängen | Shader-Audit: Übergänge nur über `kfbSpeckleLayer`; Pixeltest entlang eines Bankett-Schnitts: nur Palettenfarben ± Licht |
| keine harte Schnittkante | Kante = Viertelkreis (cap/ov); Draufsicht ohne helle Ringe; Seitenansicht ohne Stufe zwischen Oberseite und Scholle |
| Scholle | eine zentrale Spitze unter dem Schwerpunkt (Abstand ≤ 2), 2–6 Nebenspitzen senkrecht, kein Drehkörper bzw. Fächer |
| Straße | T1 = 0 Gelände-Dreiecke auf der Fahrbahn; T2: Schürze ≥ 0,3, Gelände an hw ≥ 0,05 unter der Oberkante, kein Spalt aus den Kameras |
| Maßstab | Tür ≥ 1,15 H; `__kfb.sizes()` ohne Ausreißer |
| Budget | Gelände ≤ 2 Calls je Insel; Frame-Budget laut Profiler (MacBook, 30–60 fps) |
| Adapter | Environment, Probes und Straßenbett laufen ohne Fehler (`envCheck` grün) |

## 7 · Risiken

- **Kompositions-Teil in `IslandField`** (Landmarke, Freifläche, Wege) ist mit dem alten Gelände verwoben. Lösung: ihn als `composition.ts` herauslösen, bevor die Fassade umgestellt wird.
- **Zellgröße des Sprenkels** in K2: 1,1 × 1,46 ≈ 1,6 (Straßenkontext). Für Inselflächen ohne Straße eventuell 1,1 × 1,65 (POC-Maß); vor dem Bau festlegen. Vorschlag: einheitlich 1,6.
- **Speicherstände:** alte Welten speichern keine R2D-Felder. Die Migration leitet `terr` aus dem Biom ab.
- **Leistung:** Polarnetz plus Farbkarte je Insel (1024²) mal 4 Inseln ergibt Texturspeicher; bei Bedarf 512² für ferne Inseln.
