---
kind: effect
engine: three.js
---

# Watercolour

A three.js world that begins as a pencil drawing on paper and is painted in watercolour as you walk through it. The wash spreads out from your feet with an uneven wet edge, climbs each tree from its roots to its leaves, runs off down the stream, and stays where you have been. The demo is the edge of a wood in the late afternoon, a stream with stepping stones, and a meadow going up to one tree in blossom, with a small girl in a red hooded cloak to bring the paint.

![A girl in a red hooded cloak on a path: around her the grass, bluebells and nearest trees are painted in watercolour, and beyond them the wood is still a pencil drawing](shots/readme.jpg)

**In the demo:** click to look with the mouse, WASD to move, Shift to sprint, Space to jump, the wheel to step the eye back or in, H hides the hint. A gamepad works too. There is no sound.

Follow the path through the wood, cross the stream on the stones, and go up through the meadow to the tree in blossom: when you reach it, one last wash goes out over everything.

![The meadow painted: poppies, cornflowers and daisies in long grass, a tree in pink blossom, layered misty hills](shots/meadow.jpg)

![The wood painted: trees of thousands of small leaves, a willow over the stream, bluebells](shots/wood.jpg)

It is a starting point, not a filter. You can't lay it over a finished game: each thing in the world knows where it takes its paint from. Start from this scene, change it, replace it.

## The idea

Nothing is a photograph run through a filter. The page is drawn first and painted second, the way a watercolour is made.

- **A map of when the paint arrived.** `createWash()` (`src/wash.js`) keeps, for every spot of ground, the moment the wash reached it. `paint.touch(x, z, now)` puts paint down; `paint.flood()` sends one wave over everything.
- **Everything has a root.** Each vertex carries where it takes its paint from and how long colour takes to travel a metre of it. Ground is its own root, a tree's is its foot, a flower bed's is its middle, a far hill's is the nearest ground you can walk to. So a tree fills from the roots up, and a bed of poppies goes off at once.
- **Paint is pigment on paper.** A wash is what the pigment leaves of the paper's white: thin where the light falls, deeper where it pooled, settled into the paper's grain, uneven in soft clouds, darker while wet and darkest at its creeping edge. Shade is a second, violet glaze. Before the paint there is only pencil: an outline, and hatching where the shade will be.
- **Leaves, grass and petals are touches of a brush.** One touch lays down several small leaves, or a tuft of blades, or a flower with its petals, each a little more or less full of pigment and each arriving in its own moment. A tree is some thousands of touches, darkest inside and lightest toward the sun. The demo has about 650,000.
- **Wet into wet.** `src/page.js` decides where the paper was wet: everything far, and patches of the middle distance. There the paint runs together, but only into what lies about as far off, so the inside of a crown goes soft while its edge against the sky stays crisp. Wet paint is grainy, and pencil is never wet.
- **Hills are washes.** Five ranges, each one wash that is deepest along its crest and thins to mist, out of which the next stands.
- **Life follows colour.** Grass sways, the stream runs, petals fall and butterflies fly only once they are painted.

## Use it

```
npm install
npm run build        # dist/, the demo as it is published
npm run serve        # http://127.0.0.1:5483/
```

- `src/wash.js` is the paint: the map, the materials for solid things and for touches of the brush, the hills, the sunbeams. Start there.
- `src/page.js` is the sheet of paper: wet passages, the pencil's outline, the grain.
- `src/glade/world.js` puts the demo together: the ground and stream, the trees (`tree`, `fir`, `willow`, `bush`, each built from `clump`s of leaves), flowers and grass, the far wood and the hills, the light, and when the sky and the last wash are set off.
- `src/hood.js` is the girl, sewn onto a skeleton that walks, with a cloak that swings.
- `src/pencil.js` and `src/shape.js` are the pencil strokes and the soft solids things are built from.
- `?painted` shows the page finished from the start. `?wet=0` turns off the wet passages.

The tools in `tools/` take stills and films of the built demo with a headless Chromium (`CHROME` names one of your own): `sh tools/go.sh --name still` builds and takes one.

## What it costs

About 4 to 6 ms a frame at 1080p on a fast desktop card, and about 4.5 s to build the world when it loads. It has not been measured on a laptop. The demo is about 9 MB to download: the girl's skeleton and clips are 3.6 MB of it and the physics engine 2 MB.

## Licence

Code MIT, art CC0 1.0. Everything painted is made in code. The girl moves on Patch's starter man's skeleton with clips from Quaternius' Universal Animation Library and Patch's own, all CC0. Physics is Rapier (Apache-2.0). `LICENCE-NOTES.md` has every part and where it came from.
