# SPECKLE_TRANSITION_AUDIT_R1 · Gesprenkelte Übergänge (Kontaktzonen) · WS0, 2026-10-17

Auftrag: alle Umsetzungen der „gesprenkelten Übergänge“ finden (Joyride, Insel-Biome, Lab), die Entscheidungslage klären und ein zentrales Modul für WS1 vorschlagen. Nur gelesen, nichts geändert. Repo-Stand: `gh/*` frisch geholt am 17.10.

---

## 1 · Gefundene Umsetzungen (in zeitlicher Reihenfolge)

| # | Name | Ort @ Ref | Technik | Parameter | Bilder | Georg-Urteil |
|---|---|---|---|---|---|---|
| A | **`kfbBlend`, die „Knetfleck-Regel“** (Joyride M1, 28.09.) | `gh/main` · `tools/KFB-ToolBox/_inbox/KFB_JOYRIDE_J14_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/lab-track/road-markings.m1.js:13–24` (`KFB_BLEND_GLSL`). Ältere Kopie in `…/KFB World Design Setup Claymation Test/JOYRIDE_SESSION_2026-09-29/code/lab-track/` | Shader-Maske im Fragment-Shader (`onBeforeCompile` an `#include <color_fragment>`). Feld F = Summe Gauß-Kugeln A − Summe Gauß-Kugeln B, eine Kugel je Zelle, 3×3-Nachbarschaft, Hash `fract(sin)`. Harte Schwelle `F < k(w)` mit Polynom `k = 0.66t + 0.43t⁷` (t = 2w − 1), damit Deckung ≈ w. Ergebnis: harte Maske 0/1, dazu `rim` (smoothstep 0…0,07) für 10–12 % Randabdunklung. Kein Alpha, kein Verlauf | Gewicht `w` je Vertex. Musterkoordinate **im Streckenraum (s, u)**, nicht in Weltkoordinaten. Zellgrößen: Fahrbahn Straße↔Bahn **1,7** (`track-look.v5.js:76`), Platzsand-Verwehung **1,1** (`:82`, `discard`), Strang/Bande `patchify(…, 1.7)` (`:149`), Damm/Böschung **2,4** (`:159`). Farben aus den Welt-Paletten in `track-look.v5.js`: `roadStreet`/`roadTrack`/`nature.path` (`:137`), Strang → `city.curb` bzw. `nature.grass`, Damm → `nature.ditch` bzw. `nature.hill` (`transition-atlas.v1.js:362–363`) | J14-Cut `evidence/` | BASELINE_ACCEPTED_R1 Zeile 6: kfbBlend 2026-10-08 19:37 „finde ich gut“ (Sitzung 2ecdb67e). Kein V-Eintrag |
| A′ | **J17** nutzt A unverändert | `gh/main` · `…/KFB Joyride J17 · FB Cabrio/JOYRIDE_J17_2026-10-01/code/KFB Joyride J17 · FB Cabrio.dc.html` lädt `track-look.v5.js` (der J17-Cut enthält nur Cabrio, Sitz und Fahren, keinen eigenen Boden-Code) | wie A | wie A | `JOYRIDE_J17…/pictures/chase-*.jpg` | J17 = Look-Vorlage (RKIT-R3 Konzept v3 §11.3, siehe §2) |
| B | **`kfbLayer`**, drei Größen + Rücktropfen (R2D v0 Insel, 03.10.) | `gh/main` · `…/KFB World Core R2D v0 Insel + KFB Scholle Bench v7/…/KFB_R2D_v0/island.js:333–352`; Lab-Kopie `donors/kfb-island-kit-r2-2026-10-08/KFB_R2D_v0/island.js`; Anleitung `donors/kfb-island-kit-r2-2026-10-08/BAUANLEITUNG.md §4` | vier `kfbBlend`-Aufrufe: große Flecken (cell), mittlere Tropfen (cell×0,42, w′ = smoothstep(0, .95, w)·0,5), kleine Tropfen (cell×0,2, ·0,32), Rücktropfen der Grundfarbe (cell×0,36, aus 1−w, ·0,42). Drei Kanäle `aTW` = (Sand, Pflaster, Fels), Reihenfolge Fels → Sand → Pflaster | `uTCell` **1,1**; Fels ×1,3, Pflaster ×0,8. Bänder (`weightsAt`, `island.js:146–153`): Sand am Bankett `1 − smoothstep(hw+0,6, hw+3,4, d)` = **2,8 breit**; Teich `r+0,8…r+3,6`; Pflaster an Plätzen `r−1,2…r+1,4`, an Wegen `0,8…2,4`; Fels aus `carveAt`. Farben `pal.sand / paved / rock` | `docs/style-references/r2d_v0_sprenkel_referenz_burg.jpg` (Lab) | `KFB_R2D_v0/RETURN.md:12` **TUNE** für „Farbflecken“; `:43`: „Übergänge jetzt in drei Größen … Kein Verlauf“ (Georg 03.10. laut Code-Kommentar `island.js:340`) |
| C | **S1 „Scheiben-Sprenkel“** `kfbSpeckleLayer` (Lab, 09.10.) **= heutiger Stand** | Lab `src/clay/kfb-speckle.ts` (md5 `8d0669cb…`) + `src/island/r2d/top-material.ts` (md5 `d50dced3…`). Byte-gleich auf GitHub: `gh/sync/lab-snapshot-2026-10-11` @64ae61fe7, Pfad `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/src/…` | Gleicher Vertrag wie B (Gewicht → harte Maske), aber das Feld ist das **Maximum diskreter, gejitterter Knet-Scheiben** (r 0,28–0,60 je Zelle, Höhe 0,45–1,0), leicht verwirbelt. Schwelle aus einer **Quantil-Tabelle** (64 Stufen, `speckleThresholds()`, Uniform `uSpeckleK[64]`), also Deckung = w. Kanten-AA mit `fwidth`. Sechs Ebenen: groß, 0,42, 0,2, Mikro 0,09 (nur nah, LOD) sowie Rücktropfen 0,36 und 0,16; kleine Ebenen dünnen mit w^1,5 aus. Randlinie nur an der sichtbaren Kante. **Weltfest** (kein „infinite zoom“). Lab-Zusätze in `top-material.ts`: Hoskins-Hash ohne `sin` (Genauigkeit bei großen Weltkoordinaten), Warp mit 0,34 Zelle (Kleckse statt Kreis-Decals), Seed je Insel (`speckleSeed`: Versatz + Zelle ×0,9–1,12), **3D-Variante** `kfbSpeckleLayer3` für steile Flächen (Fels, Scholle) mit eigener Quantil-Tabelle | Musterkoordinate **Welt-xz** (`vTS`) bzw. Welt-3D (`vWP3`). `SPECKLE_CELL = 1,6` Lab-Einheiten („¼ MC“, Steuerung F4); Vergleich in `speckle.ts` mit 1,1 × RACE_W 1,46. LOD (`kfbSpeckleLod`): Ebene voll bei Zelle ≥ ~6,7 px, weg bei ≤ ~2,9 px. Rand: 10–12 % dunkler. Farben aus der R2D-Palette (`ENV_ROLES`) über `patchSpeckle(m, pal, …)` | `docs/feedback/speckle/speckle_{overview,drive,walk}_{old,new}.jpg` (`tools/render-speckle.mjs`, Seite `/speckle.html`) | BASELINE Zeile 6: 2026-10-09 02:12 „das mit den Sprenkeln, das gefällt mir, können wir … so nehmen … Tune später“ = **PASS mit TUNE**, Konfidenz hoch. **V-138 TUNE** (11.10.): „Knet-Tropfen lesen sich als flache Scheiben“. Kritiker Stufe 1 (`docs/critic/lab-stage1/2026-10-10_02` und `_03`): perfekte Kreis-Decals, identisches Muster auf beiden Inseln, gestrichelte Randlinien → in Lauf 03 behoben (Warp, Seed, `fwidth` vor jeder Verzweigung; `POSTMORTEM_MVP1_STAGE1_R1.md:20`) |
| C′ | S1 im Inselbau des Lab | `src/island/r2d/ground.ts:56` (Oberseite), `scholle.ts:340–354` (Gras → Erde unter der Kante, Gewicht `aGW` nach Tiefe), `terrain-mesh.ts:52–60` (Moos und Fels nach Steilheit), `form.ts:65` (Felskappe) | wie C | höchstens 2 Terrain-Draw-Calls je Insel | Lab-Kameras §4 | BASELINE Zeile 17 (Inselkante): „mit diesen gesprenkelten Dots … als würde … Gras über diese Böschung … wachsen“ |

Nicht gefunden: instanzierte Sprenkel-Decals, Dither in Vertex-Farben, triplanare Splat-Masken als Übergang. „Dither“ kommt nur bei LOD/Verdeckung vor (V-027, V-115), nicht bei Farbzonen.

## 2 · Welche Version meint Georg, und wurde sie zum Standard erklärt?

- **Herkunft „Rennstrecke/J17“:** Gemeint ist A, die Knetfleck-Regel aus Joyride M1/T4 (J14-Cut, von J17 übernommen). Beim Strecken- und Übergangsbau am 08.10. wurde sie zur Grammatik erklärt:
  - **RKIT-R3 Übergangs-Konzept v3** (`~/Developer/rkit-r3/docs/RKIT_R3_UEBERGANGS_KONZEPT.src.html`, §11 „Entscheidungen (Georg, 08.10.: alle Empfehlungen angenommen)“, Punkt 3): „Joyride J17 (01.10.) als aktuelle Vorlage. Dazu kommen die Joyride-Übergangsgrammatik T3/T4 (Knetflecken statt harter Wechsel …)“.
  - **SPEC_EDGE_RUBBLE_GRAMMAR_R1** (Lab-Docs, Status „GRUNDSATZ · Georg 2026-10-08“): erster von drei gemeinsamen Bausteinen ist `kfbBlend` („Oberflächen-Wechsel. Statisch gebacken, live nur, wo sich etwas ändert“).
  - **ENV_ERZAEHLRASTER_R1 §8** (Georg 2026-10-08): Übergangsart **Sprenkel** (`kfbLayer`) für Erde, Sand, Pflaster, Fels am Fuß und Gras → Erde. Feld in der Biom-Zeile `transitions: { ground: 'sprenkel', snow: 'zacken' | 'flocken' }`.
  - Regel darüber: **V-011** und QA §01 „keine harten Schnitte“; verboten sind Verlauf, Alpha, gerade Linie und „Rausch-Gesprenkel“.
- **Heute gültige Umsetzung:** C (S1). Sie hat am 09.10. `kfbLayer` abgelöst. BASELINE_ACCEPTED_R1 Zeile 6: „S1 `kfbSpeckleLayer` … ersetzt `kfbLayer`; `kfbBlend` (Joyride …) für gebaute Übergänge“. Dazu STYLE_GUIDE_3D_R1:64.
- **Lücke im Register:** Es gibt **keine eigene V-Nummer**, die S1 oder `kfbBlend` als zentrales Modul festlegt. Der Standard steht nur verteilt in BASELINE Zeile 6, STYLE_GUIDE, RKIT-Konzept §11.3, SPEC_EDGE_RUBBLE und ENV §8. V-081 („Terrain-Painter mit Dots-Übergang“) und `WORLD_CONTRACT_R1` `paint.stroke` (Sprenkel S1) setzen ihn bereits voraus.

## 3 · Was WS1 heute macht, und die Lücke

- **Code:** `terrainStitch.js` / `terrainStitch3d` liegen im lokalen WS1-Branch `s1/weltboden` und sind **nicht auf GitHub** (weder in `gh/ws1/r3f-frame` @d65f5c26 noch in `gh/ws1/preview` oder `gh/main`). Ich habe sie deshalb nicht gelesen. Laut `WS1_STATUS.md §65.2/§65.3`: Schürze je Bühne aus `kfb.stage-edges/1`, **4 m breit mit 3 Ringen**, Bodenfarbe `fromColors(edgePalette)`. Wie die Farbe vom Ring in den Zonenboden übergeht, steht dort nicht.
- Im gespiegelten `ws1/kfb-planet/src` gibt es keinen Sprenkel- oder Blend-Shader (Boden einfarbig, z. B. `StageTest.jsx:57`). Rollen auf dem Amphitheater wechseln mit einem **weichen Normalen-Verlauf** n.y 0,55–0,8 (`WS1_STATUS.md:1280`).
- **Vorgaben, die einen Verlauf nahelegen** (Widerspruch zu V-011/§01):
  - V-341: „weich in den Zonenboden überblendet“;
  - BRIEF_WS1_LOOK_RUN_L2 G12: „smooth fade to the zone ground“;
  - WS0_TO_WS1:25: „Farbübergang 3–8 m `edgePalette` → Zonenboden“;
  - WS0_TO_WS1:13: „Schürze mit Platzhalter-Verlauf ist ok“ (ausdrücklich nur vorläufig).
  - Track Core `SKIN_BLEND` blendet Farben über 32 m weich (RKIT_SKIN_S1_R1:56). Das ist ebenfalls ein Verlauf und kein Sprenkel.
- **Lücke:**
  - WS1 hat kein Sprenkel-Modul.
  - Die Vorgaben sagen „weich“, ohne festzulegen, dass das S1-Sprenkel heißt.
  - Der Donor liegt nur in einem Sync-Snapshot, nicht als Modul nach dem Modulvertrag.
  - S1 rechnet in Lab-Einheiten, WS1 in J17-Metern.

## 4 · Vorschlag: ein Modul `kfb-speckle-transition.v1` (Vertrag `kfb.speckle-transition/1`, kurz „Sprenkel-Modul“)

**Donor zum Vendoren:** `gh/sync/lab-snapshot-2026-10-11` @64ae61fe7 · `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/src/clay/kfb-speckle.ts` (S1-GLSL + Quantil-Kalibrierung) und aus `src/island/r2d/top-material.ts`: `HOSKINS_H3`/`SPECKLE_GLSL_NOSIN`, `WARP_GLSL`, `speckleSeed`, `SPECKLE3_GLSL`/`speckleK3`, `patchSpeckle`. Beide byte-gleich mit dem Dropbox-Lab. Die Regeln in GLSL bleiben byte-gleich; neu ist nur die Hülle. three 0.186.1 passt zu Host-Vertrag und Lab. Joyride bleibt unangetastet (T12 „Joyride-RACE byte-gleich“); `kfbBlend` ist die Referenz für den Look.

**API-Skizze** (reines three.js; in R3F nutzbar über `useMemo` am Material):
```js
import { createSpeckle, weights } from './kfb-speckle-transition.v1.js'
const sp = createSpeckle({ seed, cell_m: 1.1, space: 'world-xz' /* | 'world-3d' | 'track-su' */ })
sp.patch(material, {            // onBeforeCompile an <color_fragment>, Cache-Key je Ebenen-Satz
  layers: [                     // max. 3 Ebenen je Material, Reihenfolge = Malreihenfolge
    { weight: 'aSW.x', color: roles.sand,  cellScale: 1.0, rim: 0.10 },
    { weight: 'aSW.y', color: roles.paved, cellScale: 0.8, rim: 0.12 },
    { weight: 'aSW.z', color: roles.rock,  cellScale: 1.3, rim: 0.10, space: 'world-3d' },
  ] })
// Gewichte statisch je Vertex backen (SPEC_EDGE_RUBBLE: live nur, wo sich etwas ändert):
weights.band(geom, distFn, { inner, outer })        // w = 1 − smoothstep(inner, outer, d)
weights.zone(geom, zoneOfFn, zoneId, { band_m })    // Biom ↔ Biom: Anteil Zone B über das Band
weights.depthBelowRim(geom, { band_m })             // Gras → Erde über die Kante (Scholle)
sp.setColors({ ... }) / sp.dispose()                // Palettenwechsel ohne Neu-Kompilieren
```
**Presets** (Werte aus den Quellen, ⚠ = Vorschlag, noch kein Georg-Urteil):

| Preset | Gewicht | Band | Farben (Rollen) |
|---|---|---|---|
| `track↔ground` | Abstand zum Straßen- bzw. Bahnrand: `hw+0,6 … hw+3,4` (R2D/Joyride, 2,8 m) | 2,8 m | shoulder/sand über ground (V-305-Rollen) |
| `diorama↔ground` | Abstand zum `footprint`/`terrainRing` | 3–8 m (WS0_TO_WS1:25) | Ring = größter Anteil der `edgePalette` (WS0_TO_WS1 §1), außen Zonenboden; G12 ΔE ≤ 0,05 am Ring bleibt |
| `biome↔biome` | Zonenanteil | ⚠ 6–12 m | ground-Rolle beider Biome |
| `rim/scholle` | Tiefe unter der Kante, `world-3d` | wie Lab | grass → earth |
| `built` (Ersatz für `kfbBlend` bei Belagwechseln) | ⚠ eine Ebene, keine Mikro-Punkte, Zelle 1,7 | – | – |

Einheiten: `cell_m` in J17-Metern. Lab 1,6 Einheiten entspricht 1,1 × 1,46, also ⚠ Startwert **1,1 m**; Joyride-Fahrbahn 1,7 m.

**Abnahme-Metriken:**
1. **Keine harte Kante** (V-011, QA §01):
   - Kritiker G3 ohne Befund „Verlauf“, „gerade Linie“, „Geisterlinie“ oder „gestrichelter Rand“ aus allen Prüfkameras (Übersicht, Fahrhöhe J17-Chase, Laufhöhe 0,9 H);
   - automatisch: keine Isolinie w = 0,001 bzw. 0,999 als Linie im Bild (Regressionstest für den `fwidth`-Fehler).
2. **Sprenkelgröße:**
   - kleinste sichtbare Ebene ≥ 3 px (im Code: LOD voll ab ~6,7 px, weg ab ~2,9 px), damit kein Rausch-Gesprenkel entsteht;
   - ⚠ große Flecken (Ø 0,56–1,2 × Zelle) in Laufhöhe ≥ 24 px und in der Übersicht ≥ 6 px, gemessen mit `render-speckle`-Kameras im WS1-Rahmen.
3. **Kachelung unsichtbar:**
   - Seed je Zone bzw. Bühne (Versatz + Zelle ±11 %) und Warp 0,34;
   - zwei Zonen nebeneinander zeigen nie dasselbe Muster (Kritiker-Befund „identisches Sprenkelmuster“ darf nicht wiederkommen);
   - kein Raster und keine Wiederholung in der Übersicht.
4. **Weltfest und deterministisch:** gleiche Seeds geben gleiche Bilder; die Fleckgröße ändert sich nicht mit dem Kameraabstand.
5. **Leistung:**
   - Gewichte gebacken, ≤ 3 Ebenen je Material, keine zusätzlichen Draw Calls;
   - Budget V-370 bzw. V-115 (≥ 30 fps im sichtbaren Fenster) gemessen.
6. **Kontaktfarbe:** Diorama-Ring ΔE ≤ 0,05 zur `edgePalette` (G12) auf der Terrain-Seite der Naht.

## 5 · Entscheidungen für WS0/Georg (Vorschlag)

1. Neue V-Nummer: „Sprenkel S1 ist der eine Übergangsstandard für Zonen, Biome, Strecke ↔ Gelände und Diorama ↔ Gelände; Besitzer ist das Modul `kfb-speckle-transition.v1`, Donor wie §4“.
2. V-341 und L2-G12 klarstellen: „weich überblendet“ heißt S1-Sprenkel über 3–8 m, kein Farbverlauf. WS0_TO_WS1:13 bleibt bis zum Modul gültig.
3. `kfbBlend` behalten (Joyride byte-gleich) oder im neuen Code durch das Preset `built` ersetzen?
4. Track Core `SKIN_BLEND` (32 m Verlauf): auf das Sprenkel-Modul umstellen oder ausnehmen (Belag statt Gelände)?
5. WS1 soll `s1/weltboden` (terrainStitch) nach GitHub spiegeln, damit WS0 die Schürze prüfen kann.
