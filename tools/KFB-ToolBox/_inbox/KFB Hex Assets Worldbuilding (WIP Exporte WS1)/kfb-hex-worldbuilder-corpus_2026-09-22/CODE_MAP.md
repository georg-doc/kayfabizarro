# CODE_MAP

Alle Zahlen aus dem ausgelieferten Stand gemessen (22.09.2026), nicht aus dem Gedächtnis.
Zeilenzahl · Bytes · Methodenindex mit Zeilennummer.

## Kanten-Atlas S1 — die Kantenkunde beider Packs

`modules/KFB_Hex_Edge_Atlas_S1/`

| Datei | Zeilen | Bytes | Methoden |
|---|---:|---:|---:|
| `index.html` | 108 | 7.126 | 0 |
| `src/app.js` | 662 | 43.526 | 21 |
| `src/cases.js` | 477 | 24.996 | 19 |
| `src/measure.js` | 319 | 15.194 | 12 |

**`src/app.js`** — `$` · 23 · `say` · 27 · `chrome` · 36 · `isTile` · 47 · `boot` · 49 · `probeFor` · 82 · `resolver` · 142 · `renderCalib` · 201 · `kv` · 205 · `shooter` · 280 · `thumb` · 301 · `renderSheet` · 344 · `renderTable` · 381 · `key` · 392 · `up` · 448 · `renderCases` · 458 · `renderLessons` · 582 · `renderStock` · 601 · `set` · 626 · `partThumb` · 633 · `bindTabs` · 650

**`src/cases.js`** — `loadStock` · 24 · `find` · 36 · `place` · 48 · `building` · 71 · `cellXZ` · 75 · `buildPadding` · 94 · `buildDecorate` · 182 · `buildRocky` · 211 · `buildVillage` · 251 · `isMouth` · 266 · `put` · 281 · `sharedRenderer` · 379 · `tick` · 387 · `makeStage` · 392 · `fit` · 420 · `resize` · 433 · `show` · 439 · `draw` · 449 · `attach` · 464

**`src/measure.js`** — `edgeGeometry` · 28 · `atlasProbe` · 41 · `at` · 53 · `harvestTriangles` · 74 · `inTri` · 129 · `sectorProfile` · 136 · `deriveColorGroups` · 176 · `dist` · 179 · `stockName` · 234 · `calibrate` · 244 · `classifyEdges` · 288 · `verify` · 301

## Babel Hex-Generator v1 — Turm aus Hex-Bändern, drei Modi

`modules/KFB_Babel_Hex_Generator_v1/`

| Datei | Zeilen | Bytes | Methoden |
|---|---:|---:|---:|
| `index.html` | 163 | 7.947 | 0 |
| `src/app.js` | 403 | 18.184 | 30 |
| `src/build.js` | 169 | 7.673 | 8 |
| `src/player.js` | 302 | 14.261 | 13 |
| `src/tower.js` | 252 | 12.422 | 17 |

**`src/app.js`** — `$` · 17 · `el` · 18 · `say` · 27 · `resize` · 61 · `tick` · 70 · `boot` · 92 · `fits` · 114 · `buildKit` · 137 · `chooseBiome` · 157 · `rebuild` · 168 · `frameTower` · 192 · `frameOnPlayer` · 206 · `topView` · 211 · `slider` · 220 · `toggle` · 227 · `panelBuild` · 232 · `kv` · 252 · `panelClimb` · 254 · `panelSelection` · 276 · `step` · 281 · `apply` · 282 · `moveBand` · 305 · `swingBand` · 311 · `shiftFrom` · 318 · `select` · 322 · `exportRecipe` · 336 · `hint` · 345 · `wire` · 353 · `setMode` · 374 · `onPick` · 387

**`src/build.js`** — `pickFrom` · 10 · `rand01` · 12 · `buildTower` · 20 · `place` · 28 · `neighbourOf` · 114 · `sameCell` · 120 · `buildArcs` · 125 · `selectionRing` · 161

**`src/player.js`** — `constructor` · 25 · `mountCarl` · 44 · `bind` · 68 · `down` · 69 · `up` · 74 · `place` · 80 · `surfaceAt` · 95 · `jump` · 109 · `planArc` · 124 · `update` · 162 · `info` · 278 · `approach` · 284 · `placeholderBody` · 290

**`src/tower.js`** — `K` · 17 · `rng` · 19 · `jumpModel` · 29 · `single` · 35 · `double` · 43 · `classify` · 58 · `growBand` · 70 · `localXZ` · 84 · `planTower` · 92 · `proj` · 131 · `nearestPair` · 174 · `relink` · 191 · `summarise` · 206 · `count` · 208 · `cellWorld` · 222 · `bandTop` · 227 · `recipe` · 231

## Hex-Baukasten S0 — Bestand → Bauteile → Regeln → Generator

`modules/KFB_Hex_Baukasten_S0/`

| Datei | Zeilen | Bytes | Methoden |
|---|---:|---:|---:|
| `index.html` | 95 | 5.230 | 0 |
| `src/app.js` | 478 | 25.352 | 23 |
| `src/generator.js` | 416 | 19.424 | 15 |
| `src/inventory.js` | 156 | 7.671 | 9 |
| `src/kit.js` | 279 | 15.081 | 10 |
| `src/sources.js` | 76 | 3.132 | 5 |

**`src/app.js`** — `$` · 14 · `el` · 15 · `say` · 24 · `done` · 25 · `frame` · 53 · `tick` · 63 · `boot` · 78 · `fits` · 116 · `buildKit` · 135 · `by` · 136 · `plainOf` · 147 · `tabs` · 188 · `show` · 192 · `kv` · 198 · `bestand` · 200 · `regeln` · 239 · `thumb` · 304 · `bauteile` · 328 · `draw` · 343 · `generator` · 364 · `row` · 366 · `renderReport` · 409 · `generate` · 445

**`src/generator.js`** — `K` · 26 · `rng` · 27 · `pick` · 32 · `toCube` · 35 · `hexDist` · 40 · `planPlatform` · 53 · `inSet` · 114 · `routePath` · 135 · `buildPlatform` · 166 · `place` · 176 · `world` · 186 · `isBoundary` · 187 · `offsetFor` · 199 · `inwardAngle` · 205 · `lay` · 289

**`src/inventory.js`** — `harvest` · 18 · `walk` · 20 · `dedupe` · 35 · `familyOf` · 54 · `readPack` · 61 · `polyName` · 100 · `listDir` · 107 · `probeQuaternius` · 121 · `bucket` · 149

**`src/kit.js`** — `load` · 35 · `instance` · 64 · `warm` · 74 · `assignRole` · 100 · `deriveRockClasses` · 177 · `biomeOf` · 217 · `isRockish` · 232 · `isDeckTile` · 251 · `moduleMetrics` · 259 · `key` · 262

**`src/sources.js`** — `raw` · 19 · `jsd` · 20 · `note` · 49 · `getJSON` · 53 · `exists` · 64

## hexrealm — Hex-Gitter, Kantenmasken, Atlas-Bank, Hub-Insel

`modules/hexrealm/`

| Datei | Zeilen | Bytes | Methoden |
|---|---:|---:|---:|
| `KFB_Hex_Hub.html` | 278 | 14.069 | 7 |
| `KayKit_Hex_Realm_S11.html` | 607 | 36.689 | 22 |
| `lib/atlas.js` | 1410 | 81.364 | 45 |
| `lib/hex-grid.js` | 480 | 24.644 | 28 |
| `lib/kit-lab.js` | 662 | 33.377 | 31 |
| `scenes/hex-realm.js` | 194 | 11.814 | 1 |
| `hub/island.js` | 178 | 8.082 | 13 |
| `hub/model.js` | 110 | 8.535 | 0 |
| `hub/stations.js` | 83 | 4.128 | 4 |
| `hub/world.js` | 525 | 25.938 | 21 |
| `data/cast.js` | 1166 | 119.026 | 0 |

**`KFB_Hex_Hub.html`** — `$` · 120 · `esc` · 121 · `showScreen` · 123 · `hideScreen` · 124 · `openStation` · 149 · `openTodo` · 176 · `row` · 200

**`KayKit_Hex_Realm_S11.html`** — `f2` · 133 · `load` · 164 · `worker` · 177 · `loadTiming` · 189 · `sizeOf` · 199 · `key` · 203 · `isLand` · 212 · `isWater` · 213 · `isVoid` · 214 · `isSea` · 215 · `seaMaskOf` · 227 · `cellKind` · 241 · `fitList` · 289 · `seaOutside` · 292 · `centreOffset` · 316 · `onCell` · 323 · `scatter` · 333 · `probePixels` · 363 · `mid` · 366 · `seamHas` · 374 · `build` · 437 · `setMode` · 573

**`lib/atlas.js`** — `raw` · 21 · `loadAsset` · 43 · `instance` · 71 · `measure` · 76 · `legacyAssemble` · 105 · `loadClips` · 151 · `p` · 162 · `applySkin` · 192 · `pawAnchor` · 238 · `poseAtFirstKey` · 272 · `bindReport` · 293 · `normName` · 304 · `findBone` · 305 · `ancestry` · 318 · `lca` · 319 · `boneRig` · 330 · `subtreeNames` · 340 · `splitClip` · 347 · `reachChain` · 360 · `holdInstrument` · 409 · `segSum` · 461 · `localOf` · 489 · `strumClip` · 570 · `axisFor` · 597 · `smooth` · 615 · `stroke` · 616 · `orderItems` · 703 · `visit` · 706 · `box` · 721 · `topOf` · 722 · `drop` · 723 · `buildVignette` · 734 · `f` · 925 · `dist` · 1083 · `arrange` · 1217 · `respace` · 1234 · `visibleBox` · 1257 · `makeViewer` · 1272 · `mood` · 1295 · `resize` · 1328 · `frame` · 1337 · `showBounds` · 1368 · `select` · 1373 · `draw` · 1379 · `picker` · 1393

**`lib/hex-grid.js`** — `hexMetrics` · 16 · `hexToWorld` · 30 · `worldToHex` · 40 · `neighbor` · 61 · `popcount` · 73 · `isRun` · 75 · `kindsMask` · 176 · `rotKinds` · 177 · `solveCoast` · 198 · `rotMask` · 213 · `rotDeg` · 227 · `solveHexTile` · 232 · `wantedMask` · 242 · `dirBetween` · 261 · `buildNetwork` · 268 · `k` · 269 · `add` · 272 · `auditTileFit` · 294 · `k` · 295 · `netComponents` · 314 · `k` · 315 · `normaliseShore` · 351 · `k` · 353 · `sea` · 355 · `endSeaEdge` · 403 · `auditHexSeams` · 422 · `auditOnCell` · 442 · `auditOnLand` · 464

**`lib/kit-lab.js`** — `loadAsset` · 61 · `instance` · 81 · `measure` · 87 · `buildScene` · 94 · `load` · 102 · `audit` · 133 · `auditWorld` · 163 · `dev` · 167 · `r2` · 168 · `auditJoints` · 199 · `probeSurface` · 217 · `hitAt` · 221 · `auditGround` · 246 · `snapToSurface` · 277 · `measureSurface` · 306 · `span` · 329 · `materialColor` · 351 · `repairTextures` · 366 · `mats` · 368 · `auditFootprints` · 385 · `auditClearance` · 429 · `box` · 431 · `relaxOverlaps` · 455 · `makeTopDownProbe` · 516 · `at` · 533 · `kindOf` · 540 · `kind` · 549 · `makeViewer` · 561 · `resize` · 604 · `frame` · 613 · `draw` · 636

**`scenes/hex-realm.js`** — `bldRef` · 73

**`hub/island.js`** — `key` · 11 · `loadParts` · 16 · `load` · 25 · `worker` · 33 · `islandRefs` · 38 · `centreOffset` · 49 · `buildIsland` · 57 · `world` · 59 · `isLand` · 65 · `isSea` · 66 · `cellKind` · 85 · `onCell` · 125 · `scatter` · 130

**`hub/stations.js`** — `buildStations` · 12 · `castRoster` · 31 · `add` · 34 · `roster` · 76

**`hub/world.js`** — `clamp` · 10 · `start` · 13 · `figureScale` · 58 · `addOutline` · 67 · `pinTexture` · 102 · `yardCellFor` · 199 · `placeResidents` · 211 · `local` · 239 · `entryOf` · 252 · `groundY` · 253 · `topOf` · 254 · `restY` · 259 · `usable` · 288 · `focusStation` · 373 · `onLand` · 393 · `pickClip` · 409 · `resolveMotion` · 413 · `playClip` · 419 · `spawn` · 431 · `focusPlayer` · 460 · `measuredModel` · 504

## Spiegelseiten auf Projektebene (nur Hülle, Logik liegt in modules/)

`mirrors/`

| Datei | Zeilen | Bytes | Methoden |
|---|---:|---:|---:|
| `KFB Babel Hex-Generator v1.html` | 163 | 7.976 | 0 |
| `KFB Hex-Baukasten S0.html` | 99 | 5.511 | 0 |
| `KFB Hex-Kanten-Atlas S1.html` | 110 | 7.322 | 0 |

## Studien — GLB_hexagon_kit und 2D-Hexflächen, eigene Linie

`studies/`

| Datei | Zeilen | Bytes | Methoden |
|---|---:|---:|---:|
| `Hex-Buehne.dc.html` | 260 | 26.201 | 1 |
| `Hex-Worldbench.dc.html` | 707 | 41.493 | 33 |
| `HexTile.dc.html` | 100 | 5.615 | 1 |

**`Hex-Buehne.dc.html`** — `renderVals` · 219

**`Hex-Worldbench.dc.html`** — `cap` · 189 · `hexDist` · 210 · `genGrid` · 211 · `constructor` · 226 · `componentDidMount` · 250 · `componentWillUnmount` · 256 · `gradMap` · 262 · `loadGLTF` · 271 · `tileColor` · 281 · `applyMode` · 289 · `makeFrom` · 295 · `init` · 309 · `setupComposer` · 363 · `loadSky` · 378 · `buildWorld` · 385 · `buildTile` · 406 · `swapTile` · 418 · `reskinAll` · 423 · `buildPad` · 431 · `computeSlots` · 446 · `placeActors` · 465 · `makeHexBand` · 490 · `makeHexFill` · 497 · `buildFX` · 503 · `paintFX` · 518 · `loadPet` · 529 · `buildDie` · 556 · `applyLights` · 575 · `updateSunPos` · 591 · `fitView` · 598 · `resize` · 618 · `animate` · 628 · `renderVals` · 671

**`HexTile.dc.html`** — `renderVals` · 28

## Summe

| | |
|---|---:|
| Dateien mit Code | 32 |
| Zeilen | 11487 |
| Bytes | 689.003 |
| indizierte Methoden | 389 |

Der Index findet benannte Funktionen, Pfeilzuweisungen und Klassenmethoden. Anonyme
Rückrufe und Methoden tiefer als vier Einrückstufen fehlen darin — er ist eine Landkarte,
kein Vollständigkeitsbeweis.
