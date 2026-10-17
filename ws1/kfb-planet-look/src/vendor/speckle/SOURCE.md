# Herkunft · Sprenkel-Modul `kfb-speckle-transition.v1` (Vertrag `kfb.speckle-transition/1`, V-403)

Auftrag: WS0-Entscheid V-403 (Register-Branch `docs/kfb-decisions-register-2026-10-11`, `30_DECISIONS/DECISIONS.md`), Audit `replies/SPECKLE_TRANSITION_AUDIT_R1.md` §4, Absicht `replies/TRANSITION_INTENT_R1.md`, Eintrag „Gesprenkelte Übergänge als ein Modul – V-403“ in `replies/WS0_TO_WS1.md`. Regel darüber: V-011 (keine harten Schnitte).

## Donor

Repo georg-doc/kayfabizarro, Branch `sync/lab-snapshot-2026-10-11`, Commit **64ae61fe781e79235790359449f2eee23ce201f9** (2026-10-11, „sync(lab): code + text docs snapshot 2026-10-11“), Ordner `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/src/`. Laut Audit byte-gleich mit dem Dropbox-Lab (md5 identisch).

| Datei | Git-Blob | md5 | Verwendung |
|---|---|---|---|
| `clay/kfb-speckle.ts` | ffac76a630d5f5011a34d6497ad80adfcc918a7d | 8d0669cbba49d8cd67cbe0b700e2bd3e | vendort: Z. 7–79 (S1-GLSL + Quantil-Kalibrierung) |
| `island/r2d/top-material.ts` | 4003e9862c829c4e0e870e20f9d1ffd1b6a08ae6 | d50dced3e973b8ecd519a5726df0ace2 | vendort: Z. 9–14, 16–17, 19–31, 44–45, 78–142; `patchSpeckle` (Z. 55–75) als Muster für `patch()` |
| `island/r2d/ground.ts` | c4cf5126d763cae087d1ec0aa5ae4b2710ae8edb | c9d23aedf78963fda3c6481ba6f4d7a0 | nur gelesen: Reihenfolge Clay-Material → Sprenkel-Patch, ≤ 2 Terrain-Draw-Calls |
| `island/r2d/scholle.ts` | 4b245b7ca594cdfade00f963beec2f2040334e2e | 4848b2a8845e29d64b97fdffdf777228 | nur gelesen: Gewicht `aGW` nach Tiefe mit wanderndem Einsatz (Z. 340–351) → `weights.depthBelowRim`, Wobble |
| `island/r2d/terrain-mesh.ts` | d4954ffd8e85c96a3c4306959567c22c1cf8f8f8 | ab9a811b80e34e8f8be311bd71861958 | nur gelesen: Gewichte je Vertex (`aTW` Sand/Pflaster/Fels), breite Flecken statt schmaler Stufen |
| `environment/grounding.ts` | 303f33587eda202b13225b67194a33f172efa103 | 374932b1d6b6dcce91b31b645000e57c | nur gelesen: `nest()`-Gruppenregel → `vegetation`-Haken (nest selbst nicht vendort) |

## Was ist was in `kfb-speckle-transition.v1.js`

Markiert im Quelltext mit `═══ DONOR D1 …`, `═══ DONOR D2 …`, `═══ WS1-ERWEITERUNG …`, `═══ WS1-HÜLLE ═══`.

**Byte-gleich (GLSL und GLSL-Strings, Test `glslByteIdentical` + `glslRuntimeEqualDonor`):**
- `KFB_SPECKLE_GLSL` (kfb-speckle.ts Z. 43–79: `kfbH3`, `kfbDiskField`, `kfbSpeckleK`, `kfbSpeckle`, `kfbSpeckleLod`, `kfbSpeckleLayer`)
- `HOSKINS_H3` und `SPECKLE_GLSL_NOSIN` (sinusfreier Hash, Ersetzung samt Prüfung)
- `WARP_GLSL` (`kfbWH`, `kfbVN`, `kfbWarp2/3`, `kfbWarpV2/V3`, Warp 0,34 Zelle)
- `SPECKLE3_GLSL` (`kfbH4`, `kfbDiskField3`, `kfbSpeckleK3`, `kfbSpeckle3`, `kfbSpeckleLod3`, `kfbSpeckleLayer3`)

**Donor-JS, nur TypeScript-Typen entfernt (Test: gleiche Ausgaben wie der Donor, `thresholdsEqualDonor`, `thresholds3EqualDonor`, `speckleSeedEqualDonor`):**
`SPECKLE_STEPS`, `fract`, `h3`, `diskField`, `speckleThresholds`, `SPECKLE_CELL` (Lab-Einheiten, nur für `speckleSeed`), `speckleK`, `speckleSeed`, `h3js`, `diskField3`, `speckleK3`. Fingerabdruck (sha256 über JSON) der Tabellen: K `5211d938…61b7`, K3 `0be21941…18af2` (im Test festgehalten, greift auch ohne Klon).

**Nicht vendort:** `TOP_LAYERS`, `patchSpeckle`, `patchScholle` (Inselbau-spezifisch, Paletten `R2DPal`, `location.search`), `reliefFade`, `rollShadow` (R2D-Kante). `patch()` folgt dem Muster von `patchSpeckle` (Uniforms per `Object.assign`, Verkettung von `onBeforeCompile`/`customProgramCacheKey`, Einhängen nach `#include <color_fragment>`).

**WS1-Erweiterung (neu, eigener Block, nutzt nur Donor-Funktionen):**
- `speckleBiThresholds` / `speckleBiK`: Quantil-Tabelle des Differenzfelds `F(x) − F(x + 71,3)` (Seeds 17/23), gleiche Methode und Stichprobe wie `speckleThresholds`; punktsymmetrisch (Test `biTableAntisymmetric`), Deckung = w (Test `coverageEqualsW`).
- `WS1_SHAPE_GLSL` (`kfbWs1Shape2/3`): zwei feinere Warp-Oktaven gegen runde Scheiben; dazu im Wrapper die flächentreue Streckung `uSpStretch` je Seed.
- `WS1_BI_GLSL` (`kfbWs1BiK`, `kfbWs1SpeckleBi`, Uniforms `uSpBiK[64]`, `uSpMix`): zweiseitige große Ebene.
- `ws1LayerGLSL(name, bi, micro)`: Ebenen-Sätze. `bi = false, micro = true` erzeugt wörtlich den Donor-`kfbSpeckleLayer` (Test `layerGeneratorEqualsDonor`), wird dann aber gar nicht erzeugt (patch ruft die Donor-Funktion). `micro = false` = Preset `built`. `bi = true` = spiegelbildliche kleine Ebenen (Dichte-Buckel zur fernen Seite, `uSpMix`).

**WS1-Hülle (neu):** `createSpeckle`, `.patch`, `.setColors`, `.bake`, `.dispose`, `seedOf`, `zoneSeed` (Donor-`speckleSeed` + Umrechnung Lab-1,6 → `cell_m`), `PRESETS`/`presetOf`, `LOOKS`, `weights.band/zone/depthBelowRim` (mit Wobble nach scholle.ts), `valueNoise`, `vegetation.density/nestParams/thin`.

## Einheiten

J17-Meter. Eine Lab-Einheit ≈ 1,46 m (RACE_W). Lab-Zelle 1,6 Einheiten ≈ 1,1 × 1,46 → `CELL_M = 1,1` (V-403-Startwert). Rand/Scholle aus Lab-Einheiten × 1,46 umgerechnet (voll 1,2 → 1,75 m; Ende ≈ 3 + 0,01·Dm → Band 3,8 m).

## Prüfung

`node test/unit/speckle.mjs` (Node, ohne Browser). Liest den Donor über `git -C ~/kfb-ws1/kayfabizarro show 64ae61fe7:<pfad>` (anderer Klon: `KFB_CLONE=<pfad>`); fehlt der Klon, werden Byte-Gleichheit und Live-Vergleich mit INFO übersprungen, der Tabellen-Fingerabdruck greift trotzdem. Eine echte GLSL-Kompilierung findet dort nicht statt (kein Compiler ohne Browser); geprüft wird der Shadertext: Ebenen-Code vorhanden, keine offenen Platzhalter, alle `uSp*`-Uniforms deklariert und geliefert, alle `kfb*`-Funktionen definiert, Klammern und `#if/#endif` ausgeglichen.
