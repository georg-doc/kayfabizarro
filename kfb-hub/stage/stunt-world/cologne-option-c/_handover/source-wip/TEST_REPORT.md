# TEST REPORT · Cologne Option C

Date: 2026-09-20T04:58:00Z · Producer: Claude Design · **No public deployment, no CI run, no Cloudflare verification.**

## 1 · Donor load (lab-v9/probe.html)

All against pin `2ff8b350beefe02912bbff6eeeead3882e583d08`.

| Donor | HTTP | Bytes |
|---|---|---|
| tools/osm-city-lab/data/dom-zentrum-v0/normalized.json | 200 | 7 198 533 |
| KayKit car_hatchback.gltf | 200 | 10 952 |
| KayKit car_hatchback.bin | 200 | 53 564 |
| kenney_racing-kit billboard.glb | 200 | 14 520 |
| kenney_racing-kit camera_exclusive.glb | 200 | 11 560 |
| media/kfb/index.json | 200 | 48 368 |

Failures: 0.

## 2 · Donor isolation (donor-isolation.html)

Eight cells, each donor alone, orbitable, measured:

1. Kölner Dom — built 82,4 × 157,3 × 119,9 m, scale 1,873, twin-tower identity intact
2. car_hatchback — 0,419 × 0,369 × 0,806 u, 4 named wheel nodes
3. car_sedan — 0,419 × 0,369 × 0,938 u, 4 wheels
4. car_stationwagon — 0,419 × 0,369 × 0,938 u, 4 wheels
5. billboard.glb — 1,000 × 1,000 × 0,476 u
6. camera_exclusive.glb — 0,107 × 0,409 × 0,264 u
7. KFB card image — Forget Utopia, card 7, page 3 of 15, quadrant 2, real deck PDF
8. OSM cache — Dom outline 535 pts, Rhine 127 pts, 70 named driveable roads, 7 hero anchors, frame 2 280 × 2 115 m

## 3 · Static checks

- Route closes: yes. 598 samples, arc length 1 997,4 m, no gap at the seam.
- Topology tags present on every sample: SURFACE_BOUND / STRUCTURE / TUNNEL.
- Banking capped: |bank| ≤ 0,42 rad after two smoothing passes.
- Movement constants byte-identical with the two pinned Race v0.8 mirrors. One controller.
- No colour in `option-c-style.v1.js` without a measured share from one of the two boards.

## 4 · Browser run

- Boot to playable: ~9 s cold (dominated by normalized.json).
- Frame rate: 118–120 fps at 924 × 560 CSS / 1848 × 1120 device px.
- Console errors after boot: 0. Failed requests: 0.
- Lap logic: advances at the start/finish crossing with an 8 s minimum guard.
- Containment: verified at 148 km/h on the elevated Rhine deck — the vehicle is held on the ribbon edge. The status field reports WALL while the vehicle grinds the edge; it never reports OFF TRACK, because with the hard edge it cannot leave the ribbon.
- Steering: A turns left, D turns right, Q drifts left, E drifts right — checked against the pinned control map.

## 5 · Findings during the run, and what was changed

| # | Finding | Change |
|---|---|---|
| 1 | Saturated sun colour (#fed95a, blue channel 0,35) multiplied the teal roadbed into green | Directional light set to warm white 0xffe4b0; the bed carries its own emissive so the measured teal holds |
| 2 | Ground plate 0x3f5a52 read as bright green and swallowed the ribbon | Ground set to the measured dark warm #422d1d (board 02, 3,44 %) |
| 3 | At 41 m/s the soft rail alone let the vehicle leave the Rhine deck and hang in the air, because height follows the route band | Hard clamp added on the ribbon edge — a structure has an edge |
| 4 | CCTV1 stood south of the opening straight and looked away from the Dom | Moved 44 m north, raised to 31 m, FOV 54 — the Dom now stands behind the vehicle |
| 5 | An OMS block stood between CCTV1 and the track | 46 m clearance circle carved around every hero camera |
| 6 | Water glint rendered as large soft discs from the oblique camera | Glint frequency raised, exponent 14 → 40 |
| 7 | Almanac thumbnails came back black | Renderer switched to preserveDrawingBuffer so the captures are the real frame |
| 8 | Close-orbit camera sat inside the vehicle; orb halo filled the frame | Orbit 8,5 → 14,5 m; orb core 0,46 → 0,30, halo 0,95 → 0,58 |
| 9 | One 404 on every load: the Almanac image carried the template hole directly in `src`, so the runtime requested the literal string `{{ card.thumb }}` as a URL before any value existed | Image source set through a ref instead. Two intermediate attempts were measured and rejected: wrapping the image in `sc-if` did not stop the request (it fires at 509 ms, before the guard), and a `background-image` hole arrived truncated in the style translator — 22 characters instead of the 60 kB data URL |

| 10 | Steering was inverted — A turned right | `FLOW.steerBase` is negative in the pinned donor config; `Math.abs()` had thrown that sign away. The donor value is now used signed, and the drift yaw follows the same convention (Q left, E right) |
| 11 | The car drove through buildings standing on the track | Buildings that overlap the track corridor are no longer deleted — they get a passage. The block starts above 11,0 m clearance and stands on piers placed at the footprint vertices outside the corridor. A building fully on the track, or too low to span, is dropped |
| 12 | Speed trails grew wider than the vehicle and broke off in hard corners | Rewritten. Width is capped at 0,44 m per lane against a 1,08 m vehicle half-width, so two trails never exceed the rear. Speed lengthens the trail instead of widening it. History is sampled every 0,35 m of travel rather than per frame, the side vector comes from the trail's own local tangent, and the tail fades to zero width and zero alpha — no stub |
| 13 | The HUD put a large button bar and a large radio panel into the field of view | Review controls collapsed behind one 26 px toggle, radio reduced to three small icons and a slim volume slider in the top-right block, state bars thinned and moved under the speedometer |
| 14 | From the oblique camera the Rhine showed a lattice of white discs and diagonal gold bands | The foam term was the product of an x-wave and a z-wave, so its maxima sat on a grid; the glint wave had different periods in x and z, which reads as diagonals. Both removed — all waves now run along the river axis and foam appears as transverse crests |

| 15 | Georg's capture showed the chase camera inside a black mass — a building standing across the track | The passage test only sampled the footprint CORNERS. A large block whose EDGE crosses the road but whose corners both lie outside passed the test and stayed solid. Edges are now sampled every 6 m, and the clearance margin went from 3 m to 9 m so the camera, which trails ~9 m behind and swings wide in corners, stays out of the geometry |
| 16 | With three Almanac cards the column ran from y 150 to 420 and cut the minimap at y 340 | Two cards |

| 17 | A and D felt like sliding, Q and E threw the car off the road and the camera through facades | Two numbers. The steering gain gave a 210 m turning radius at 41 m/s — on a 2 km loop with a technical section that reads as sliding, not steering; the gain is now set for a ~60 m radius. And the centrifugal term was added WITHOUT `dt`, so at 120 fps it was roughly 120× too strong. The drift kick was a 17 m/s lateral impulse; drift is now a bounded lateral acceleration (9 m/s², capped at 7,5 m/s) plus a yaw bias, which is what a drift is |
| 18 | The start line was a tinted rectangle, and it showed as an ochre slab across the opening straight | Replaced with the real Kenney `roadStart.glb` (13 692 B), scaled from its measured hull to the 20,7 m track width (factor 16,434), plus two `flagCheckers.glb` on the shoulders |
| 19 | No checkpoints | Three drive-through gates from `overheadLights.glb` (26 068 B) at route fractions 0,20 / 0,47 / 0,72. Each is scaled to the local track width and then RE-checked: if the beam underside sits below 8 m the gate is scaled up until it clears. Measured result 8,21 / 8,33 / 8,20 m — a gate you cannot drive through is not a gate |

| 20 | The whole header collapsed to a bare "DOM LOOP" with one empty-path button — no cameras, no radio, no vehicle select, no evidence panel | Not a markup loss. `renderVals` was THROWING: `ev.checkpoints.gates.map()` runs even when `buildCheckpoints` took its error branch and returned no `gates`. One throw leaves every hole in the template unresolved, so the caret path came out empty and both `sc-if` blocks rendered nothing. Fixed at the cause — the evidence rows are wrapped in try/catch and every optional field is guarded. A donor receipt is a side dish; it must never carry the surface. `document.querySelectorAll('button,select,input').length` is 18 again |
| 21 | Sky bodies rendered as formless white lumps | The Quaternius models carry their colour in the embedded Atlas texture; the base colour is WHITE. Setting `emissive = color` therefore produced self-lit white. The override is gone and the texture stands. `Rock_1`/`Rock_2` are dropped from the sky pool — they read as crumpled paper at that distance and belong on the ground |

## 6 · Screenshots

`screenshots/01-c.png` CCTV1 · Dom reveal with billboard
`screenshots/02-c.png` chase, opening straight
`screenshots/03-c.png` chase, tunnel arches
`screenshots/04-c.png` track surface, close review
`screenshots/05-c.png` chase, elevated Rhine deck
`screenshots/06-c.png` high oblique, structure and pylons
`screenshots/07-c.png` landmark hero, Dom over the OMS field
`screenshots/08-c.png` close orbit, vehicle, trails and orb
`screenshots/09-c.png` HUD with the donor evidence panel open

| 22 | The header still wrapped to two rows and the centred pill ran under the clock and the lap counter | Measured: the pill was 897 px wide in a 924 px viewport. Clock, pill and lap counter now sit in ONE flex row; the pill lost its redundant label when open, the buttons went to 8 px / 2 px padding, the volume slider to 30 px, and the vehicle `<select>` became a 3-letter cycling button. Re-measured: pill 661 px, left edge 117, right edge 778 — no collision, 20 controls present |
| 23 | Sky bodies read as pale grey lumps in a palette of their own | The Quaternius Atlas texture stays; the base colour is multiplied by a measured board tone per body (magenta b01 1,44 %, shoulder b02 5,04 %, water b01 3,31 %, gold b01 0,43 %, skyMidDusk b02 3,87 %, bedDark b01 3,31 %) and darkened to 0,82 |

| 24 | The `Würfel` evidence row printed the literal string `undefined` | When the sky dice moved to `skyDice` and `dice` became the companion die's measurements, the HUD row was left reading `ev.dice.placed` / `ev.dice.reason` — neither exists on that object. Two rows now: `Würfel-Begleiter` (hull, factor, lit pips) and `Himmelswürfel` (count, factor). The donor receipt is the one place in the handoff that cannot be sloppy |
| 25 | Six sky bodies, but `Planet_1` twice and `Planet_3` missing | Two causes in one chain: `count = 7` over a six-model list requested Planet_1 again, and the sun-window guard then silently dropped the slot Planet_3 sat in. A duplicate out of six is the opposite of an organic arrangement, and reporting it as "6 Körper" hid it. Each body is now requested exactly once, a blocked slot retries on the next azimuth instead of being dropped, and the row reports placed-of-requested plus the retry count. Measured after: 6 of 6, Planet_1…Planet_6, 1 retry |
| 26 | The root carried `min-height: 560px` against a 540 px viewport, clipping 2 px off the tacho and minimap | `max-height: 100vh`; measured root height is now 540 against a 540 px viewport |

| 27 | The countdown digits were sourced from the Platformer Game Kit but recorded only as "aus dem Handoff" — a reader who asked for racing-pack numbers would read that as the racing kit | This project treats an undeclared donor substitution as a defect, and it was handled correctly for FILAMENT and for the synthesized gate sound. Two probes establish the gap: `/number|digit/i` across all 213 handoff assets returns only `Numbers_0..9` from `platformer-game-kit-dec-2021`, and 19 guessed racing-kit digit filenames all 404. The evidence row now reads `Numbers_1..3 · platformer-game-kit-dec-2021 · ERSATZ: das Racing Kit führt keine Ziffern` and RETURN.md carries the same |

| 28 | The sky bodies rendered as near-black silhouettes — the previous fix overshot in the other direction | Measured at the framebuffer, not eyeballed: material #c68861, rendered centre #1b0b02 (luminance 14) against a sky of #df3718 (luminance 88) — 16 % of the sky, a hole punched in the sunset. Cause: removing the emissive left only a 0,62 hemisphere and one car-locked key light, and at ~2 km the camera-facing side of most bodies sits in shadow. The emissive is back, but in the body's OWN measured tint rather than its base colour — that distinction is exactly what broke it the round before, when the Quaternius base colour turned out to be white. Re-measured the same way: Planet_1 material #b15f7f, emissive #b86384 at 0,42, rendered centre #844a5a luminance 87 against sky luminance 87 |

| 29 | A Hohenzollernbrücke pier stood on the ribbon at the tunnel mouth — and the displacement that was supposed to prevent it had silently broken the project's own OSM rule (65,5 m off `relation/5460390`) while fixing nothing | Three faults in one function. `clearOfRoute()` pushed along ONE route point's normal and never re-tested against the rest of the route. It measured with a CIRCLE of radius max(sx,sz)/2 — for a 255 × 64 m train hall that is 127 m, so a building lying lengthwise BESIDE the track read as unclearable. And the bridge margin, a crude leftover from the circle era, demanded 78,8 m of clearance where the real gap was 21 m, which is why the bridge was thrown away entirely. Rewritten: the test is the rotated RECTANGLE, it re-tests every candidate position against ALL 598 route points, and it has three levers in order — small capped offset, shrink my OWN module (that is mine, not OSM's), and vertical separation (a route passing above the arch crown is not a conflict; that is how the Rhine deck already works). Margins back to honest values. Result: all five landmarks placed, four exactly on their OSM anchor, HBF with a declared 28 m offset, nothing shrunk |
| 30 | Three of the four reported intrusions were false positives, which masked the one real obstruction | The audit's `byDesign` filter tested only the FIRST named ancestor. The chequered flags carry their own glTF names (`Mesh_Group_391`), so the walk stopped there and `flagCheckers` was never consulted. The filter now tests the whole ancestor chain. After both fixes the audit reports **0 intrusions at step 1** — every one of the 598 route points, against 463 meshes |

| 31 | The v4 tacho rewrite dropped the dark backing the v3 version carried, leaving the speed numeral floating on the 3D scene | Measured against the rendered framebuffer: the numeral read **1,89:1** at low speed and **1,00:1** in the hot zone — literally indistinguishable, and exactly at top speed when the readout matters. The cause is structural: the brief's low-speed teal-cyan and its hot-zone red both sit at the same luminance as the saturated teal roadbed, so no colour choice alone fixes it. Restoring the ground is what HUD v4 §8 asks for ("charcoal / dark transparent base"), not a deviation from it. Added: a rounded `rgba(20,16,14,.82)` plate behind the tacho cluster, dark grounds under BEST / segment / surface, and a 1,1 px cream outline on the numeral — red on charcoal stays just under 3:1 even with the plate, and the outline carries legibility without touching the gradient semantics. Recomputed: numeral 1,89 → **6,86** cool and 1,00 → **3,64** hot (outline 14,49 against the plate), BEST 2,41 → **7,09**, segment 2,60 → **8,71**, surface 1,70 → **4,97** |

| 32 | MOTOR appeared twice in the overlay, DICE had vanished, and its handler was dead code | Replacing the DICE button with MOTOR left a duplicate switch in one panel — the opposite of "layers individually testable" — while `onToggleDice` / `diceBg` / `diceFg` stayed in `renderVals` with nothing bound, and the companion GLB (100 880 B) kept loading unreachable. DICE is back in the toggle row, MOTOR sits once, beside MUSIK and JINGLE where it belongs |
| 33 | The overlay rebuilt in that round was never re-measured, and its active-state labels sat below the project's own rule | White on `#279797` gave **3,52:1** for DRIVE/TRAILS and white on `#fb3233` **3,75:1** for the active camera — at 11 px and bold, 4,5:1 applies, not the 3:1 headline allowance. This is the same class of fault fixed for the tacho one round earlier; fixing one element and not re-measuring the rest is the actual mistake. Active fills darkened to measured board tones — `#1c7685` (board 01, 3,31 %) and `#88243c` (board 02, 4,43 %) — rather than lightening the text. Re-measured from computed styles: CHASE **8,88**, DRIVE/TRAILS **5,28**, DONUT **6,29**, DICE **13,72** |

| 34 | The restored DICE button was unstyled and dead | Putting the button back was not the fix. `diceBg` / `diceFg` / `onToggleDice` had been removed from `renderVals()` when the button was swapped for MOTOR, so the three holes stayed unresolved: the element fell back to browser button chrome (`rgb(43,42,51)` inside a `rgba(20,16,14,.93)` panel) and the click bound to nothing. Re-added with the darkened active fill. Verified by ACTION, not by presence: clicking flips `scene.getObjectByName('kfb-dice-companion').visible` from `false` to `true`, and the computed background goes `rgba(0,0,0,0)` → `rgb(28,118,133)` |

## 6b · Unattributed

One console line remains on every load: `[resource_error] SCRIPT failed to load:` with an EMPTY url. It is not attributable from inside the page: all 19 resource-timing entries return 200, `performance.getEntriesByType('resource').filter(r => r.responseStatus >= 400)` is empty, no `<script>` in the document has an empty or broken `src` (checked: 8 tags, 5 inline, 3 with valid absolute urls), and an error listener registered after boot captures nothing. It is not the pdf.js worker — that was the earlier cause and is fixed and verified. Recorded as open rather than explained away.

## 7 · Not tested

- Cloudflare Stage route (no access)
- CI (no access)
- Cross-browser beyond the Chromium preview
- Sustained multi-lap performance
- Audio playback (blocked until a user gesture)
