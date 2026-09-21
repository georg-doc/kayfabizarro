# Code-Map · KFB Voxel Zone S2

454 Zeilen. Eine Design-Component, 10 Methoden in `class Component`.

| Zeile | Methode | Aufgabe |
|---|---|---|
| 135 | `componentDidMount()` | Bootstrap |
| 141 | `componentWillUnmount()` | Aufräumen |
| 148 | `async boot()` | three holen, Module laden, Szene aufbauen |
| 222 | `allMeshes()` | Filter über `this.meshes` |
| 224 | `matOf(c)` | Material-Zuordnung je Zelle |
| 235 | `build()` | Kern: zwei Rezepte (Bestand/prozedural), verschiebbare Naht |
| 359 | `applyPalette()` | Farbpalette anwenden |
| 381 | `applyLive()` | Live-Regler-Anwendung ohne Neubau |
| 401 | `set(patch, rebuild)` | Zustandsänderung, optional Rebuild |
| 412 | `renderVals()` | Render-Bindings |

Kernidee laut Bestandsdoku: links Bestands-Rezept (Travel v9, edge3-Kachel), rechts
prozedural, dazwischen eine verschiebbare Naht; Tusche-Kontur (`kfb-ink-outline.js`) über
allem — bei Tusche an wirken beide Rezepte wie eine Welt, bei Tusche aus wie zwei.
