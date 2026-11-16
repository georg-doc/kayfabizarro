# Apex Drift

A drifting game for the browser with a cinematic look: HDR sky and sun shadows, bloom, speed blur, wet night asphalt, and a rally car whose tyres really build grip, peak and let go.

- **3 tracks:** Kirishima Pass (a 4 km mountain road at golden hour), Neon Harbor (a wet night race through a container port), Sunrise Airfield (a huge empty airfield at dawn with a skid pad).
- **6 modes:** Drift Attack, Skill Rush, Zone Battle, Time Attack, Combo Rush and Free Roam, each with bronze, silver and gold medals and saved bests.
- **3 cars:** Vireo D1 (rear drive, made to slide), Vireo RS (four-wheel drive, easy to hold) and Vireo X (turbo, loose).
- **Boosters and EXP:** glowing pads appear at random places on the road for a burst of speed. Sliding earns EXP, and the longer you slide without a break the faster it comes: x2, x3, x4, x5 and on.
- **Skill Rush:** drifting charges energy and levels unlock four skills with their own effects: Nitro (Q), Drift Lock (E), Overdrive (F) and Time Warp (G).
- **Controls:** W/S or arrows to drive, A/D to steer, Space for the handbrake, V changes camera, R puts you back on the road, P pauses, M turns the music off. Gamepads work.

## Built from

Realistic car by @patch (https://patch.gg/patch/car) for the car physics, the car model, the tyre marks and the sounds. Everything else is new: the track builder, terrain, sky, lighting, bloom and grade, the drift assist, the scoring and the menus. See `CREDITS.md`.

## Running it

```
npm install
npm run dev     # http://127.0.0.1:5400
npm run build   # dist/
```

The design lives in `data/*.json` (tracks, environments, cars, modes, medals). `npm run check` verifies every cell is filled and every reference between the sheets resolves, and it runs before each build.

`tools/` has the checks used while making it: a click-through of the whole game (`flow.mjs`), frame rate and long-task measurements, and track map drawings.
