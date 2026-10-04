# kfb-voxel-world-v1 — Terrain und Weltkontext

Gespiegelt aus `terrain-v10/`, unverändert. Die beiden Dateien sind bereits ES-Module und
brauchten keine Herauslösung — sie liegen hier, damit die ToolBox vollständig ist.

| Datei | Was |
|---|---|
| `voxel-terrain.js` | Das Voxelfeld: Chunks, Instanzen, eigener Shader (Licht, Nebel, Bewegung) |
| `world-context.js` | Sechs D6-Modi, Paletten, Seeds, semantischer Kartenvektor |
| `edge3.jpg` | Kanten-Textur (auch für die Ufer-Kalibrierung in kfb-fluid-v1) |

## Was man wissen muss, bevor man etwas darüber baut

**Terrain v10 rechnet sein Licht selbst.** Helligkeitsspreizung, Sättigungs-Jitter,
Kanten-Textur, ungetonemappt. Wer daneben Cubes mit Instanzfarbe stellt (Ufer, Graben, Zone),
bekommt sie rund 2,4-fach zu hell. `kfb-gutter.js#calibrate()` liest den Faktor aus den echten
Uniforms — nicht abschreiben, aufrufen.

**Das Raster.** Zeilen liegen auf `(n + 0.5) * cell`. Eine Zone mit gerader Reihenzahl passt
nur symmetrisch um `-cell/2` darauf. Deshalb rechnet im Lab und auf der Bench alles gegen
`ZC = -CELL * 0.5` statt gegen 0.

**`heightStep`** setzt das D6-Raster (`cell/6`). Terrain und alles, was daran anschließt,
müssen denselben Wert benutzen, sonst springen Übergänge in ganzen Cubes.

**Carve und Ruhezone gehören zusammen.** `setCarve()` stanzt das Plateau, `setCarvePath()` den
Flusslauf, `setZones()` beruhigt die Bewegungswelle. Die Ruhezone ist **rund**, die Card Zone
ein Rechteck — ein einzelner Kreis lässt die Welle auf der langen Achse direkt am Plateau
wieder voll aufschlagen. `field.calmZones()` liefert die drei Kreise, die das Rechteck annähern.

**`github_get_tree` listet keine .glb/.gltf.** "0 gefunden" heißt nicht "nicht da".

## Status

`SOURCE` — unverändert gespiegelt, Stand des Projektordners `terrain-v10/` vom 2026-09-21.
