# Code-Map · KFB Card Zone Lab v2

`KFB Card Zone Lab v2.dc.html`, 2586 Zeilen. Eine Design-Component: Template (Zeile 9–~300)
plus `class Component extends DCLogic` mit 143 Methoden. Zeilennummern gelten für die Datei
in diesem Export.

## Aufbau der Datei

| Zeilen | Abschnitt |
|---|---|
| 1–8 | Dokumentrumpf, `support.js` |
| 10–36 | `<helmet>`: Fonts, Reset, Importmap (three 0.160.0 über unpkg), three-Bootstrap → `window.__CZ` |
| 37–~300 | Template: Canvas, Kopfzeile, Fokus-Panel, Bedienleisten |
| ~300–2586 | `class Component` |

## Methoden nach Aufgabe

**Aufbau und Welt**
| Zeile | Methode |
|---|---|
| 317 | `boot()` — three holen, Module laden, Szene, Licht, Texturen, Welt |
| 487 | `loadTex(url, srgb)` |
| 499 | `buildWorld(VT)` |
| 521 | `applyCarve()` |
| 2451 | `rebuildWorld()` |

**Zone (Kartenfeld)**
| 549 | `zoneCellList()` · 560 `buildZone()` · 590 `zoneTopAt()` · 603 `anchorTops()` · 616 `layoutZone()` |
| 1992 | `applyZoneLook()` — Photo-Textur, Verschleiß |

**Wanne, Fluss, Ufer** — die Geometrie unter dem Wasser
| Zeile | Methode |
|---|---|
| 634 | `buildMoat()` |
| 667 | `reach()` · 678 `moatRing()` |
| 712 | `waterY()` — Wasserlinie |
| 759 | `perimS()` |
| 772 | `riverPath()` · 789 `riverField()` · 810 `riverTopAt()` · 840 `riverHalf()` · 842 `riverCells()` |
| 862 | `bankTopAt()` · 914 `bankCalib()` — Ufer-Kalibrierung |
| 937 | `layoutMoat()` |

**Fluid** — der Shader, um den es im Post Mortem geht
| Zeile | Methode |
|---|---|
| 1010 | `buildFluidSurface()` — Uniforms, `waterdudv.jpg` → `uDudv`, `water.jpg` → `uMap`, ShaderMaterial |
| 1010–1117 | Vertex- und Fragment-GLSL als Zeilen-Array |
| 1118 | `layoutFluid()` |
| 1706 | `buildBubbles()` · 1720 `tickBubbles()` |

Anmerkung zum Fragment-Shader: `float u = 0.5;` ist konstant, seit der Shader-Beschnitt
ausgebaut wurde. Damit ist `shore == 1` und `foam == 0` — der Schaum ist **konstruktiv tot**.
Wer den Block liest und für vergessen hält, baut ihn versehentlich wieder ein. Genau das ist
am 2026-09-21 passiert.

**Projektion (Beam)**
| 1210 | `buildProjection()` · 1296 `updateProjection()` · 1908 `loadProjector()` · 1954 `loadBase()` |

**Karten**
| Zeile | Methode |
|---|---|
| 1357 | `faceTexture(kind, card)` |
| 1514 | `buildCardCube()` · 1576 `refreshArtFace()` · 1585 `snapQuat()` |
| 2268 | `buildCard()` — Card-Builder anbinden, `kfb-index.json` vor `index.json` |
| 2189 | `buildStack()` · 2309 `placeCard()` · 2106 `poseCard()` · 2173 `setCardSide()` |
| 2055 | `prepReveal()` · 2229 `tickReveal()` · 2243 `tickCard()` · 1878 `tickCube()` · 1862 `faceToCamera()` |

**Fokus-Modus**
| 1606 | `enterFocus()` · 1629 `exitFocus()` · 1638 `tickFocus()` · 1688 `drawFocusArt()` · 1822 `focusBlocks()` · 1841 `sendChat()` |

**Audio**
| 1767 | `initAudio()` · 1797 `tickAudio()` |

**Seeds und Zustand**
| 2013 | `set(patch)` · 2347 `seedCard()` · 2357 `triplet()` · 2379 `buildBaseline()` · 2394 `dev(k)` · 2400 `seedMode()` · 2406 `seedSignature()` · 2436 `applySeed()` |

**Render**
| 2477 | `chip()` · 2482 `renderVals()` |

## Wenn daraus wieder Module geschnitten werden

Die Reihenfolge, die beim letzten Mal gefehlt hat:

1. Methode im Original lesen, **ganz**, inklusive Kommentaren.
2. Text kopieren, nicht nachschreiben. Umbenennen erst, wenn die Kopie läuft.
3. Jede Bedingung der Quelle, die man nicht mitnimmt, benennen — auch toten Code.
4. Vergleichsbild gegen das Original, gleiche Szene, gleiche Kameraposition.
5. Die Messung muss den **Pfad** prüfen (hängen die Texturen? welches Material?), nicht nur
   die Geometrie.
