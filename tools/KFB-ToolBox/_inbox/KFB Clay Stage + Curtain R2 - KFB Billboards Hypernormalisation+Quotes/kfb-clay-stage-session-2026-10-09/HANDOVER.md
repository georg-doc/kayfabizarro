# HANDOVER · KFB Clay Stage R2 → MVP-Slice (09.10.2026)

Für Coworker, die Billboards und/oder Bühne + Vorhang modular in die MVP-Slice einbauen. Alle Pfade relativ zu `code/`.

## 1 · Was ist was
| Modul | Datei | Renderer | Besitzer |
|---|---|---|---|
| Rollenpalette | `KFB_Clay_Stage_R2/palette-roles.js` | – | EIN Besitzer der Farbrollen für Tafeln und Bühne |
| Billboard-Kit | `KFB_Clay_Stage_R2/billboards/kit.js` | three 0.180 | Geometrie der sieben Familien, Rollen statt Farben |
| Billboard-Bühne | `KFB_Clay_Stage_R2/billboards/stage.js` | WebGL | Demo-Host: Renderer, Licht, Bloom, Birnen, Inhalt, Kamera |
| Bühnen-Look | `KFB_Clay_Stage_R2/curtain/clay-look.js` | three/webgpu 0.186 | Einkleidung des Vorhang-Kerns: Stoff-Shader, Portal, Boden, Säulen, Schmuckvorhang |
| Bühnen-Host | `KFB_Clay_Stage_R2/curtain/host.js` | WebGPU | Demo-Host: Kern laden, Renderer, Kamera, Licht, Takt, Eingabe |
| Vorhang-Kern | extern, jsDelivr | WebGPU | Issue #372. Nur importieren. |

`stage.js` und `host.js` sind **Demo-Hosts**. In der Slice übernimmt der Slice-Host Renderer, Kamera und Takt; wiederverwendet werden `palette-roles.js`, `kit.js` und `clay-look.js`.

## 2 · Schnittstellen

### palette-roles.js
```js
import { roles, DEFAULT_STOPS, DEFAULT_ACCENT } from './palette-roles.js';
const pal = roles(stops /* [dunkel, mitte, hell] */, wcAccent, night);
// Tafeln:  frame, trim, accent, accent2, dark, post, back, ground, bulbOn, bulbOff, bulbOffK, glow
// Stoff:   cloth, clothFade, clothHem, clothWear, dust, patchA, patchB, stitch, stain
// Bühne:   wood, woodDark, nail, stone, column, capital, valance (= cloth), valanceDark, tassel, cord,
//          signBoard, lantern, portal, portalEdge, portalLine, skyTop, skyBottom, studio, table
// R1-Reste, in R2 ungenutzt: woodPatch, colRing, flat, flat2
```
Stops kommen in der Preview aus `world-context.js`/`world-palettes.js` @5b523eb (Biom oder Karten). In der Slice: denselben WorldContext übergeben.

### billboards/kit.js
```js
import { FAMILIES, rngOf, recolor, FACE } from './billboards/kit.js';
const fam = FAMILIES[1](rngOf('arrow'));   // 0 crown · 1 arrow · 2 orbit · 3 tower · 4 starburst · 5 totem · 6 belt
// fam.B          Body (statisch) → fam.B.build(material) liefert Mesh mit Vertexfarben-Rollen
// fam.S[]        bewegte Teile { id, B, pivot, motion }
// fam.bulbs[]    { pts, r, mode: 'loop'|'dir', sub }   Birnenpositionen
// fam.blink      { shape, depth, bevel, front, sub }   Blink-Element (02: Pfeilspitze)
// fam.face       { cx, cy }  Bildfläche 12 × 6 m (FACE)
// fam.arc        nur 02: { C, R, a0, a1, apexDeg, headAxisDeg, headTurnDeg, margin, rim }
recolor(mesh, pal);                        // Palettenwechsel ohne Neubau
```
Bauweise 02 für eigene Formen: `arcArrow(C, R, a0, a1, w, head, r)`, `insetTri(A, T, B, m)`, `offsetShape(shape, o)`, `slab(shape, depth, bevel, front)`.
Wie Birnen, Glows und Blinken gezeichnet werden: siehe `billboards/stage.js` (`buildFamily`, Birnen-Instancing, `blinkMat`).

### curtain/clay-look.js
```js
import { createTheatreCurtain } from '<Kern über jsDelivr, gepinnt>';
import { dressClay, STAGE } from './curtain/clay-look.js';
const curtain = createTheatreCurtain({ proscenium: false, floor: false, hardware: 'none' /* Pflicht für R2-Look */ });
const look = dressClay(curtain, pal);      // hängt look.group an curtain.group
look.setPalette(pal);                       // Stoff-Uniforms + Vertexfarben + Schild
look.setFootlights(0..1) · look.setDecals(bool) · look.setAge(0..1) · look.setSign(bool)
look.measure   // { opening, clothWing, clothOverlapEachSide, clothRestBottom, floorTop, hemBuried }
look.stats     // { tris, parts, meshes }
look.dispose()
```
Kern-Vertrag (nicht Teil dieses Pakets): `warmup(renderer, ms)`, `update(renderer, dt)`, `requestReveal()`, `cover()`, `snap(open)`, `impact()`, `setFootlights()`, `onState(cb)`, `isSupported()`, `DIM`. Halb offen in der Preview = Host hält den Takt bei 50 % an.

### curtain/host.js (nur als Vorlage)
`mountStage(el, { pal, onChange })` → `{ setPalette, shot('closed'|'half'|'open'), view('front'|'frame'|'stage'|'side'), act('reveal'|'cover'|'impact'), set({decals, sign, age, footlights}), pause(bool), evidence(bool), dispose() }`.

## 3 · Einbau in die MVP-Slice (Vorschlag)
1. Slice-Host besitzt Renderer, Kamera, Takt. Kein zweiter rAF.
2. `roles()` einmal pro Kontextwechsel, Ergebnis an Tafeln und Bühne verteilen.
3. Bühne: Kern gepinnt importieren, `dressClay()` aufrufen, `curtain.update()` im Slice-Takt. Character-Select hinter dem Vorhang ist Slice-Sache.
4. Tafeln: `FAMILIES[i]` bauen, Meshes mit Slice-Material; Birnen/Blink nach Vorbild `stage.js`. Bildinhalt über den bestehenden CLAY-01-Scheduler (`billboard-clay.js`, jsDelivr) oder Slice-eigene Quelle.
5. Renderer-Frage klären (BAUSTELLEN T2), bevor beide Module in derselben Szene landen.

## 4 · Abhängigkeiten
| Was | Wie | Im Paket |
|---|---|---|
| three 0.180 / three/webgpu 0.186 | Importmap in den DC-Previews, jsDelivr | nein |
| Vorhang-Kern `kfb-curtain-core.js` | jsDelivr `@main` (Pfad in `curtain/host.js` → `SRC.core`) | nein |
| CLAY-01 `billboard-clay.js` + embed-spec | jsDelivr / raw `@main` (`billboards/stage.js` → `SRC`) | nein |
| world-context.js, world-palettes.js | jsDelivr @5b523eb | nein |
| Quote-Pool (PR #354) | raw `main` über `sequence.js` | Code ja, Daten nein |
| H14-Frames | `export/kfb-h14-static-bake-2026-09-30/integration-set.json` + `frames/` im Hauptprojekt | Loader ja, Frames nein |
| H13 Kaleidoscope (Live-Inhalt) | iframe `export/kfb-collage-session-2026-09-30/…H13.dc.html` im Hauptprojekt | nein |
| Referenzbild Bildschirm C | `uploads/…avif` im Hauptprojekt | nein |
| Font helvetiker_bold | jsDelivr three@0.180 | nein |

Fehlt H13/H14, laden die Tafeln trotzdem (jede Quelle über `tryLoad`, Status im Snapshot).

## 5 · Status (Ehrlichkeit)
| Feld | Stand |
|---|---|
| SOURCE | R2 dieses Projekts · Kern @main ungepinnt · CLAY-01 @main · WorldContext @5b523eb |
| DECISION | Portal vor dem Stoff für vollständiges Schließen · Saum per angehobenem Boden versenkt · Bogenpfeil mit Sehnenachse |
| IMPLEMENTATION | Module in `code/KFB_Clay_Stage_R2/` |
| TESTED RESULT | Einzelrender: Bühne geschlossen/offen aus vier Ansichten, 02 aus vier Ansichten (`code/KFB_Clay_Stage_R2/evidence/`). Messwerte siehe CHANGELOG. |
| NOT_TESTED | Billboard-Bildschirm live (Boot hing in der Vorschau, BAUSTELLEN B8) · Vorhangbewegung live · fps · Safari/Firefox · Mobil · Paket aus `code/` per statischem Server gestartet |
| EXPORT | dieses ZIP |
| PUBLIC DEPLOYMENT | NOT RUN |
| GEORG ACCEPTANCE | R2 „passt so mit TUNE für später" (09.10.2026) |
| OPEN | BAUSTELLEN.md |
