# Code-Map · KFB Textur-Browser

536 Zeilen. Eine Design-Component, 12 Methoden.

| Zeile | Methode | Aufgabe |
|---|---|---|
| 220 | `async componentDidMount()` | Katalog laden, Bewertungen aus `localStorage` |
| 231 | `componentWillUnmount()` | Renderer disposen, Resize-Listener entfernen |
| 233 | `canvasRef(el)` | Canvas-Referenz |
| 240 | `async boot()` | three holen, Module laden, Voxel-Vorschau aufbauen |
| 338 | `loadTex(url)` | Textur laden |
| 351 | `async assign(slot, item)` | Textur einer A/B-Slot zuweisen |
| 363 | `layout()` | Kontaktbogen-Raster |
| 390 | `applyPreset(name)` | Voreinstellung anwenden |
| 396 | `applyTint()` | Farbton auf Vorschau |
| 409 | `live(patch)` | Live-Reglerwirkung |
| 437 | `setGrade(v)` | Bewertung setzen, in `localStorage` |
| 445 | `pick(it)` | Kachel auswählen |
| 451 | `filtered()` | Katalog nach Filter |
| 456 | `chip(active, extra)` | Chip-Stilhelfer |
| 461 | `renderVals()` | Render-Bindings |
