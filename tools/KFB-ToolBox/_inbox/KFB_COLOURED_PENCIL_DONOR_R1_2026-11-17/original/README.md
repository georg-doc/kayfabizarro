---
kind: effect
engine: three.js
---

# Coloured pencil

Draws a three.js world in coloured pencil on a page of a sketchbook: every surface is shaded in strokes of its own pencil that follow its form and stay put as you move, light is a layer of warm yellow and shade a second, blue-violet pencil laid across the first, a soft graphite line goes round each thing, and the drawing fades to bare paper at the edges of the page. The demo is a small harbour town on a bright morning, with a young sailor to walk about in it.

![A sailor in a red beret on a wooden pier, looking at a row of coloured houses, a clock tower and a lighthouse, all drawn in coloured pencil](shots/readme.jpg)

**In the demo:** click to look with the mouse, WASD to move, Shift to sprint, Space to jump, the wheel to step the eye back or in, H hides the hint. A gamepad works too. There is no sound.

Walk in off the pier, along the quay under the bunting, past the fruit stall and the cat, to the lighthouse at the far end.

![The lighthouse at the end of the quay, red and white, with its iron gallery](shots/lighthouse.jpg)

![The hill above the town: a farmhouse on its terrace, an orchard, cypresses, the chapel with its bell](shots/hill.jpg)

It is a starting point, not a filter. You can't lay it over a finished game: each thing in the world carries the directions its strokes run in. Start from this scene, change it, replace it.

## The idea

Nothing is a photograph run through a filter. Each thing is drawn the way a hand with a pencil would draw it.

- **Strokes belong to the thing.** Every vertex carries two numbers, a `hatch` attribute (`field()` and `fieldBy()` in `src/pencil.js`): strokes are drawn along the level lines of each. Because they are fixed to the surface, they don't swim when the camera moves. How close together they are is chosen from how big the thing is on screen, in whole octaves, so strokes never slide or swap as you walk up to something.
- **Colour is laid in layers on white.** `pcDraw` puts down a warm yellow where the light falls, then the thing's own colour lightly all over, then strokes of it pressed harder toward the shade, then a blue-violet shadow pencil across those. The paper's tooth breaks every layer. A vertex's colour is the colour of its pencil.
- **It is still an ordinary material.** The pencil is a `MeshLambertMaterial` with one piece of its shader replaced, so shadows, skinning and instancing work as usual. `createPencil()` gives three of them: `line` (solid things), `both` (cloth and flags, seen from either side) and `flat` (strings, rigging, smoke: one even line with no outline).
- **The page finishes it.** `src/page.js` draws a graphite contour from depth alone, leaves flecks of bare paper where the wax skipped, and fades the drawing out toward the edges of the sheet.
- **Sky and sea are drawn with the same pencils.** Clouds and the sun's glints are paper left bare. The sea mirrors the housefronts and the moored boats, broken by its ripples.
- **Things are built to be drawn.** `src/shape.js` makes soft, slightly uneven solids (`ball`, `block`, `turned`, `roll`, `knead`), and everything in the town is put together from them in code: no model or picture is loaded.
- **Small things move.** Bunting flutters, washing sways, smoke curls from the chimneys as a pencil line, bells swing, boats bob, the windmill turns, gulls go round.

## Use it

```
npm install
npm run build        # dist/, the demo as it is published
npm run serve        # http://127.0.0.1:5476/
```

- `src/pencil.js` is the pencil: the shader, the stroke fields, the batches things are gathered into. Start there to draw a world of your own.
- `src/page.js` is the sheet of paper: contour, flecks, the fade at the edges.
- `src/harbour/world.js` puts the demo together: sky, sea, quay, pier, lamps and bunting, the stall, the lighthouse, boats, gulls, the light.
- `src/harbour/houses.js` is the row of houses (tiled roofs, chimneys, shutters, balconies, awnings, signs, vines), `quayside.js` the flagstones, café, bicycle and washing, `tower.js` the church tower, `hills.js` the farms, chapel, vineyard, windmill and trees, `mountains.js` the two ranges behind.
- `src/sailor.js` is the sailor, sewn onto a skeleton that walks.
- `?px=5` sets how far apart the strokes are, in pixels at 1080 lines.

The tools in `tools/` take stills and films of the built demo with a headless Chromium (`CHROME` names one of your own): `sh tools/go.sh --name still` builds and takes one.

## What it costs

About 2 ms a frame at 1080p on a fast desktop card. It has not been measured on a laptop. The demo is about 9 MB to download: the sailor's skeleton and clips are 3.6 MB of it and the physics engine 2 MB.

## Licence

Code MIT, art CC0 1.0. Everything drawn is made in code. The sailor moves on Patch's starter man's skeleton with clips from Quaternius' Universal Animation Library and Patch's own, all CC0. Physics is Rapier (Apache-2.0). `LICENCE-NOTES.md` has every part and where it came from.
