# Brief · Track kit look in the clay world (Knetwelt) · S4 · v2 · 2026-09-27

**From:** Claude Coworker (Track Core line). **To:** Claude Design, project "KFB Animation Lab" (the Knetwelt / claymation line).
**Decides the look:** Georg. **Supersedes:** S4 v1 (same day, written against core v0.3). v2 matches **core v0.8.1**, adds tunnels, halls, vehicle envelope, clay geometry, billboards and the inputs from the older Racer repo, and sets a priority order so the scope stays doable.

## 0 · What changed since v1 (read first)

1. **The core is v0.8.1, not v0.3.**
   - New since v1: pads, the Weiche (FORK / JOIN), per-section drive modes, the tunnel layer (5 shapes, 5 presets, junction halls, hangar), responsive tunnel sizing, the vehicle envelope and the truck-in-loop check.
   - New skins: `buoy`, `toy`.
   - The full width ladder is live. Facts are in §3.
2. **Vehicle envelope: 7 m clear over the road everywhere, loops included** (4.0 m tallest truck + 3.0 m bounce reserve; Georg 27.09).
   - Nothing you add may reach into it: portal collars, hall roofs, catch fences leaning in, billboard gantries, clay bulges.
   - Tunnels already reserve `clear` ≥ 1 m beyond it. Clay may bulge inward by at most **0.7 m** (clear − 0.3 m margin).
3. **Tunnels are now part of the look** (§4D). There are five families to dress: Gotthard, military bunker (D.U.M.B.), alien base, toy tube and hangar, plus junction halls and portals. TN02 is the test course.
4. **Clay in the geometry, not only in the texture** (§4E). Georg's question during S9 is answered as a proposal note (`notes/CLAY_GEOMETRY_NOTE_2026-09-27.md`):
   - lumps, thumb dents, slump and tool marks in stream coordinates;
   - the material mix as props on anchors: balsa struts, rivets, board-game bits.
5. **KFB billboards along the track** (§4F), with the "They Live" sunglasses layer.
6. **Inputs from the older Racer repo** (§4G), which you must reuse, not re-invent:
   - the environment grammar (KFB TOY GRID, palette ladder, Rule-of-Three, OSM track modes);
   - the Claybound benchmark (5 review axes).
7. **Georg's MVP list 27.09** makes the **edge / barrier / runoff / transition** part (§4A) the first priority:
   - barrier variants, race barriers, kerbs and sidewalks, ditch (Graben), sand / gravel bed in curves;
   - all working with claymation and the later reactive layer (dents, tyre tracks).
8. **Priority order for this run: §1A.** Do the "Phase A" items first. Everything else is reserved as a role and marked as open in your RETURN.

## 1 · What we want from you

Give the KFB track kit a look that belongs in the clay world of **H0 Hirnwelt**. Georg picked H0 as the style anchor on 27.09. **Claybound** is the benchmark for the target feel (§4G).

The kit already exists as geometry: pieces, seams, profiles, skins, markings and tunnels, computed by one JavaScript core. What it lacks is a look.

We want a **concept, not a paint-over**. Treat this as a sparring brief:

- Improve on what we did.
- Bring your own ideas.
- Red-team the parts of the kit that fight the clay look.

Where you find that the geometry itself is in the way (for example razor-thin barrier caps), say so. Propose the change as numbers the core can take (see §5).

## 1A · Priority for this run

**Phase A (deliver now):**

1. **2–3 look options** for road, shoulder, barrier and markings on TD03, each with three cameras: total, near, ride. This is the v1 core ask.
2. **Edge atlas + runoff stacks** (§4A.1, 4A.2, 4A.8-2). It must include:
   - race kerb (flat / rumble / sausage);
   - red/white barrier blocks;
   - guardrail;
   - catch fence;
   - grass / gravel / sand bed;
   - ditch / berm;
   - kerb + sidewalk;
   - parapet;
   - tunnel service strip.
3. **Transition matrix, first four families** (§4A.4 #1, #4, #5, #7):
   - street ↔ race;
   - race ↔ sand / gravel runoff;
   - road ↔ ramp / loop / kicker;
   - open road ↔ tunnel portal.
4. **Tunnel look:** one frame per family (§4D), plus the portal and one junction hall. Use TN02 and the S8 portal shots.
5. **Clay-geometry proposal** (§4E): a strength slider from "barely hand-made" to "warped", shown on one barrier run and one tube.

**Phase B (reserve the role, show later):**

- the patch-scatter biome POCs (§4A.7c);
- dirt, construction and cosmic families;
- billboards (§4F);
- the material-mix props (balsa, rivets, board-game bits);
- the building / façade adapter (§4B);
- the reactive layer S4B (§4C).

## 2 · Style anchor (read first)

**H0 Hirnwelt package** (on GitHub, `main`):
`tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/`
https://github.com/georg-doc/kayfabizarro/tree/main/tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27

- `HOWTO_KFB_3D_Claymation_Diorama_Worldbuilding.md`, sections 1–5 and 7. These are the three layers:
  - the pre-pass `clay-soften.v1.js`;
  - the material `clay-material.v4.js` + `clay-relief.v2.js`;
  - the light table.
- H0's own road profile (How-to §7.7) has bulged kerbs, a `#5d6f86` road and `#e2d0bc` kerbs and centre line. It is the closest existing clay road.
- `ref/h0/01-h0.png` and `ref/h0/04-h0.png` in this ZIP are copies of H0's evidence frames.
- **Benchmark:** Claybound (`ref/racer/KLAYBOUND_CLAYBOUND_VISUAL_BENCHMARK_2026-09-26.md`, web build linked there). Use its five review axes when you compare your options (§4G).

**Rules carried over from H0** (Georg's decisions, do not reopen):

- Models are **not** re-modelled. The look comes from the pre-pass plus the clay material.
  - Exception, new in v2: the **track core's own** geometry may carry clay deformation in stream coordinates, as proposed in §4E. It stays visual only.
- The sun is warm white. Saturated light re-colours clay (for example yellow × petrol reads as green).
- Sky is Claybound `#96bede`, flat.
- Sphere-in-sphere is the pattern for clouds and trees.

## 3 · What the kit is (facts, from the core v0.8.1)

**One core, one stream.** `track-core.mjs` compiles a route recipe (or a graph of routes) into a **stream**, a sample every 0.5 m:

- **Frame per sample:**
  - `p` position;
  - `T` forward, `U` up and `R` right, with R = T×U;
  - right-handed, +Y up, heading 0 = +Z. This is three.js's own frame.
- **14-slot cross-section** (`slots`, lateral/lift pairs in metres, driver's view):
  - `under_L`
  - `barrier_out_bot_L`, `barrier_out_top_L`, `barrier_in_top_L`, `barrier_in_bot_L`
  - `shoulder_L`
  - `road_L`, `road_R`
  - `shoulder_R`
  - `barrier_in_bot_R`, `barrier_in_top_R`, `barrier_out_top_R`, `barrier_out_bot_R`
  - `under_R`

  The face between two slots has a **role**: `road`, `shoulder`, `barrier_side`, `barrier_cap` or `underside`.
- **Skins** (`skin` per sample): `street`, `track`, `mag`, `buoy` (lifebuoy bounce pads) and `toy` (orange plastic toy track).
  - All five are **placeholders**; replacing them is your job.
  - Where the skin changes, the core blends the colours over 32 m, **staggered per role**: cap first, then side, underside and shoulder, road last. So there is never a hard colour edge (Georg's rule).
- **Markings** (`markings`, bands with `s0`..`s1`):
  - `edges`: edge lines at the road edge minus an inset;
  - `centre`: dashed centre line;
  - `bars`: magnet stripes. The first and last 5 bars of a run taper into an **arrow tip** in the driving direction.
- **Widths:**

  | Class | Width |
  |---|---|
  | NARROW | 10.8 m |
  | STANDARD | 14.4 m |
  | WIDE | 18.0 m |
  | HERO | 21.6 m |
  | HERO_XL | 28.8 m, special profile for the Weiche zone only |

  Width changes are continuous (`WIDTH_STEP`), and every set piece follows them.
- **Topology:** split and merge (`brk`), FORK / JOIN Weiche macros (14.4 → 28.8 → 2 × 14.4), pads (free practice areas), and no surface over air (jumps).
- **Open ends** (kicker lip, landing start) run out thin: barriers sink and thin, and the deck thins (`END_TAPER`).
- **Drive modes per section:** `free`, `assist` or `locked`, with fx `bounce`, `magnet_catch` and `zero_g`. These are metadata for the runtime; they may inform the look (for example a locked magnet run), but they are not geometry.
- **Pieces:**
  - STRAIGHT, CURVE_EASE (clothoid), HAIRPIN_180, SPIRAL (car-park helix), LOOP;
  - WIDTH_STEP, OFFSET_S, SPLIT_HALF / MERGE_HALF, FORK / JOIN, CONNECT;
  - CREST / DIP, KICKER → AIR → LANDING;
  - pads.
- **Tunnel layer** (core v0.7+). Any piece can carry `tunnel: {shape | preset}`; `null` leaves the tube.
  - **Shapes:** round, oval, rect, poly (n-gon), arch (horseshoe). The rings are 48 points and morph along the tube.
  - **Sections are sized from the road they carry**: road width, barriers and the 7 m envelope, plus `clear`. So the tube swells and slims with the road.
  - **Presets:**

    | Preset | Shape | Notes |
    |---|---|---|
    | `gotthard` | arch | mountain host |
    | `dumb` | rect | military bunker, wall 2.5 m |
    | `alien` | octagon | – |
    | `toy` | round | thin wall |
    | `hangar` | rect | 70 m high, 32 m clear to the sides |

  - A FORK / JOIN inside a tunnel becomes a **junction hall**: one cavern for both lanes. The tubes start and end at the hall walls.
  - Stream fields:
    - `tunnels`: segments `{id, host, kind: tube | hall, i0, i1, shapes}`;
    - `tunnelRings`: the ring palette;
    - per sample, `tunnel {ringId, wall, w, h, host}`.
- **Checks** (all green on every course): among others, clearance, headroom, `vehicle_headroom`, `loop_envelope` (trucks through loops), the tunnel checks (`tunnel_clearance`, `portal_match`, `tunnel_shell`) and `landing_dip`.

Contract and schema: `kit/README_TRACK-CORE.md`.
Core source: GitHub `skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/S9b_LOOP_TRUCKS_2026-09-27/track-core/` (branch `georg-doc-patch-2`, PR #219).

## 4 · What is in this ZIP

| Path | What |
|---|---|
| `shots/b01…b12` | Blender renders of TD03 (Tokyo Drift at the Uni-Center) and the split/merge seed. Preview colours are from the stream `paint`. |
| `shots/b13_profiles_and_skins.png` | Cross-sections, placeholder skins, seam-blend stagger curves (v1). |
| `shots/b14_three_loader_check.png` | TD03 drawn in three.js by `kit/stream-to-three.mjs`. |
| `shots/b15_three_loader_tn02_tunnel.png` | **New:** the TN02 Gotthard portal drawn in three.js by the v2 loader (tubes from the stream). |
| `shots/t02, t04, t10` | S8: mountain portal (round), building passage (rect), race-scale vehicles at a portal (Kenney sedan … firetruck, toy truck). |
| `shots/f02, f03, f04` | S7 FS01 Fahrschule: practice pad, Weiche with jump lane, lifebuoy hops (`buoy` skin). |
| `shots/r01, r02, r04–r07` | S9 TN02: overview, Gotthard at HERO width, fork hall with alien + toy mouths, toy branch, alien tube, hangar with a 72 m ship. |
| `data/td03.stream.json` | TD03, 1,570 m, all checks green (core v0.8.1). |
| `data/split_merge_seed.graph.stream.json` | HERO road that splits into two lanes, one with a magnet lift and a crest. |
| `data/tn02.graph.stream.json.gz` | **New:** TN02 responsive tunnels, 5,514 m + branch; routes M and J. |
| `data/fs01.graph.stream.json.gz` | **New:** FS01 Fahrschule at the Otto-Maigler-See, with pads, Weiche, buoy hops, mini loop and magnet catch. |
| `kit/stream-to-three.mjs` | Reference loader, stream → three.js. **v2 adds** `buildTunnels()` (inner wall, outer shell, rims per host) and `loadStream()` for `.json.gz`. Checked in headless Chromium. |
| `kit/check/index.html`, `tn02.html`, `shot.mjs` | Pixel checks: `node kit/check/shot.mjs tn02.html out.png`, with a server on :8765 at the ZIP root. |
| `notes/` | Track Core notes to design against: <ul><li>`CLAY_GEOMETRY_NOTE`</li><li>`WSA_NOTE_BILLBOARDS_ALONG_TRACKS`</li><li>`RETURN_S9` (tunnels)</li><li>`LOOP_TRUCKS_S9b`</li><li>`RECON_OLD_RACER` (what the older repo already has)</li></ul> |
| `ref/h0/` | Two H0 evidence frames. |
| `ref/racer/` | Copies from the private Racer repo `georg-doc/KFB-Stunt-Car-Race` (`origin/main`, 26.09): <ul><li>the Claybound benchmark (full)</li><li>an excerpt of the environment grammar (§1–8 start)</li></ul> |

**Shot list** (v1 shots stay valid; new rows marked ★):

| Shot | Shows | Seam or piece to design |
|---|---|---|
| b01 | TD03 overview | whole-route rhythm |
| b02 | helix top → roof straight | skin seam **street → track** |
| b03 | magnet run-in before the loop | seam **track → mag** + arrow-tip bars |
| b04 | 26 m roof loop, side | loop profile (slimmed barriers), underside |
| b05 | loop entry, driver's eye | readability at speed |
| b06 | drift ring widening to WIDE 18 | width step inside a curve |
| b07 | street into the car park | WIDTH_STEP to slim parapets, crossing under a deck |
| b08 | three-floor helix | repetition, stacked undersides |
| b09 | kicker → air → landing | **open ends** |
| b10 | plaza hairpin at WIDE 18 | tight turn, inner edge (**sand bed candidate**) |
| b11 | split start on HERO | **gore** |
| b11b | branch lift with magnet run | crest on a split lane |
| b12 | barrier close-up | barrier side / cap / shoulder at driver height (**edge atlas base**) |
| ★ t02 / b15 | mountain portal | **portal transition**, open → cut → tube |
| ★ t04 | building passage | tube through a building (rect) |
| ★ t10 | vehicles at a portal | scale check: trucks vs clay detail |
| ★ r02 | Gotthard at HERO width | tube inner wall + service strip at speed |
| ★ r04 | fork hall | **junction hall** with two tube mouths (alien / toy) |
| ★ r05 / r06 | toy / alien tube | skin family inside a tube |
| ★ r07 | hangar | huge interior, ship beside the track |
| ★ f02 / f04 | practice pad, buoy hops | pad surface, bounce-pad skin |

## 4A · Georg addendum · universal clay edge / runoff / transition kit

**New product direction, 27.09.2026.** Do not design sidewalks, kerbs, barriers, fences and runoff as a bag of unrelated props. Design one **universal edge / runoff / transition grammar** that can dress the same Track Core continuously across OSM/city streets, race track, dirt road, stunt pieces, bridge, tunnel and later Cosmic Highway.

The Track Core remains the geometry/socket truth. This addendum expands the **visible design vocabulary** and the connector/cap deliverable; it does not create another route, contact, collider or track owner.

### 4A.1 · Edge families to cover

Build a small, composable family system. Individual assets may be omitted where no source exists yet, but the grammar must reserve their role.

**Urban / OSM street and path**
- flush painted road edge;
- low / mountable kerb;
- raised kerb + clay sidewalk;
- dropped kerb / driveway transition;
- gutter / drainage channel;
- grass or soil verge;
- shallow ditch / swale and culvert mouth;
- retaining edge / low wall;
- bollard or planter edge only where a verified donor supports it.

**Race / circuit**
- painted edge line;
- flat, rumble and raised **red/white kerb** variants;
- rounded / sausage kerb as an optional high-feedback race edge;
- red/white modular barrier blocks;
- low/high wall and pit wall;
- steel/Armco-like guardrail language;
- generic impact-block / tyre-wall family without copying proprietary branding;
- low spectator fence and high catch/debris fence;
- asphalt runoff;
- grass runoff;
- gravel / **sand bed** with a designed entry and exit seam;
- sand/gravel → barrier/fence outer containment.

**Dirt / off-road**
- soft shoulder;
- clay/earth berm;
- grass verge;
- rut / drainage ditch;
- rock edge;
- wood/log fence;
- rope / low rail;
- mud or water ditch where the world owner provides the surface.

**Bridge / elevated / tunnel**
- parapet;
- guardrail / catch fence;
- slim service ledge;
- tunnel kerb / service strip;
- tunnel wall / shell meeting the track;
- portal transition: open road → cut / portal → enclosed shell → open road.

**Construction / temporary**
- cone;
- construction barrier;
- temporary fence;
- narrowing / lane-takeover edge.

**Cosmic / surreal**
- reserve a KFB-specific safe-edge family for **Cosmic Highway** and zero-/low-gravity sections;
- do not invent generic cyan/magenta neon. Until an exact KFB cosmic donor is pinned, treat this family as `SOURCE_REQUIRED`;
- it must still use the same connector/profile grammar as street, race and dirt.

The visual treatment should feel **modelled in clay**, not like normal low-poly assets painted beige: soft hand-shaped mass, rounded joins, slight controlled irregularity, tactile relief and compressed/dented detail where appropriate. Connector geometry itself remains exact even when the visible clay skin is imperfect.

### 4A.2 · Runoff is part of the road language

A boundary is not only a wall. Claude Design must design the **lateral sequence away from the driving surface**.

Examples:

```text
ROAD → KERB → SIDEWALK → FENCE
TRACK → RED/WHITE KERB → ASPHALT RUNOFF → GUARDRAIL
TRACK → KERB → GRASS → GRAVEL/SAND BED → CATCH FENCE
DIRT → SOFT SHOULDER → DITCH → EARTH BERM / WOOD FENCE
BRIDGE → SHOULDER → PARAPET / RAIL
TUNNEL → KERB / SERVICE STRIP → WALL / SHELL
```

Treat these as **role stacks** that can change over `s`, not as one-off scene dressing. Surface/contact behaviour remains Race/World owned; this brief designs visible composition and source-backed parts only.

### 4A.3 · Connector rule · cable-bed / plug logic

Georg's existing **Kabelbett** example is the design precedent for the Blender track's plug/socket idea: modules should feel like they were made to connect, and transitions should be deliberate pieces rather than gaps hidden by decoration.

The literal Kabelbett source file has not yet been pinned in the GitHub/Dropbox census under that name. **Do not invent a path or reconstruct it from memory.** For implementation truth use the current Track Core `CONNECT` / socket contract and existing Racetrack Blender socket artifacts; when the exact Kabelbett donor is identified, add it as visual precedent without changing the connector contract.

Every visible transition must respect one mathematical joint frame and its boundary state:

- position / tangent / up / right;
- surface height and bank;
- lane/track width and lateral offset;
- left/right edge state;
- shoulder/runoff state;
- skin/material family and markings;
- headroom / clearance envelope;
- semantic tags such as street, dirt, race, stunt, bridge, tunnel, mag or cosmic.

The sculpted clay transition may begin before the joint and finish after it, but the socket itself is exact. No gap, overlap, duplicate road plate or decorative cover mesh is allowed.

### 4A.4 · Required transition families

Design these as **adapters on the same core**, not separate track systems:

1. **OSM/city street ↔ Race track** — asphalt/road width, centre/lane markings, kerb/sidewalk withdrawal, race kerb/runoff/barrier arrival.
2. **Street/path ↔ Dirt road** — hard curb/edge relaxes into soft shoulder, verge and ditch.
3. **Race track ↔ Dirt track** — race kerb/runoff becomes soft shoulder/berm; return adapter must be equally intentional.
4. **Race track ↔ Sand/gravel runoff** — lateral escape zone, not a new centre-line route.
5. **Normal road/track ↔ Ramp / Loop / Kicker / Landing** — profile and edge treatment taper into stunt-safe slim edges and back out.
6. **Open road/track ↔ Bridge / elevated deck** — verge/runoff resolves into parapet/rail; supports remain world/landmark dressing.
7. **Open road/track ↔ Tunnel** — shoulder/edge becomes service strip + wall/shell; portal is a real transition family.
8. **Race/road ↔ Mag / Cosmic Highway** — same geometry/socket truth; visual family changes through the existing staggered `s` curves.
9. **Split / gore / merge** — the inner edges disappear, separate, then rise/rejoin without barrier noses or decoration crossing the drive line.
10. **Width / lane takeover / construction narrowing** — edge and marking timing follows the width change instead of snapping at one metre.

For each family, show at least one **entry**, one **mid-transition** and one **settled** state. Use the existing 32 m stagger as the default visual rhythm and the current 8 m minimum seam rule unless the source scene demonstrates a better value; do not create another hardcoded transition-length system.

### 4A.5 · Source ownership correction · our Racer geometry, external environment props only

**Hard rule from Georg, 27.09.2026:** Kenny/Kenney, KayKit and Tiny Treats are **not road/track geometry or road-detail donors for this system**. The road, track, kerb, shoulder, barrier/runoff profile, ramps, loops, dirt-track transitions, tunnel roadbed and connector pieces come from the **existing KFB Blender-MCP Racer / Track Core** and are then skinned in the new claymation language.

The external kits remain useful only for the surrounding world:
- buildings and architectural dressing;
- standalone roadside props already in the environment vocabulary, e.g. mailboxes, bins, benches, lamps, traffic lights, signs, cones and similar objects;
- vegetation and scene dressing;
- fences only when they are clearly **environment scenery outside the Track Core clearance/runoff envelope**, never the structural track edge/socket itself.

This explicitly supersedes any earlier reading of Kenney Racing, Kenney City Roads, Kenney Toy Car, KayKit Road Network S5 or Platformer road/ramp pieces as design donors for the drivable surface or its canonical edge construction. Those assets may remain historical semantic/reference evidence in the repository, but Claude Design must not trace, reskin, substitute or assemble them into the production road/track system.

**Canonical source to show first:**
1. the current Track Core / Blender-MCP Racer cross-section and slot/profile output;
2. the current socket / `CONNECT` boundary state;
3. representative existing KFB pieces from that system: ordinary road/track, width/edge transition, ramp/loop or other stunt piece, bridge/elevated piece and tunnel roadbed where available;
4. only after that, any external building/prop actually used in the surrounding OSM scene, shown in isolation under the normal donor-first rule.

**OSM integration rule:** OSM supplies geography/alignment and world context. The KFB Track Core supplies the continuous drivable construction. Kenny/KayKit/Tiny Treats add buildings and roadside/world props around it. They do not replace the OSM-aligned KFB road surface.

**Kabelbett / plug logic:** treat the existing Blender-MCP Racer connector construction as the actual modelling precedent Georg refers to. The exact historical object/file named “Kabelbett” is still not pinned by path, so do not invent one; however the *implemented idea* is no longer merely a visual metaphor. The production design must preserve the Racer's exact socket/connector grammar so modules can be skinned and joined without bespoke geometry patches.

### 4A.6 · Clay translation rules for Track Core + environment props

- **Road / track body first:** claymation changes the visible skin, relief, colour/material zones and controlled softening; it does not replace the Track Core road mesh with kit-road assets.
- **Red/white kerbs and barriers:** design them as KFB Track-Core edge/profile states, with alternating pressed-clay masses and softened corners while preserving the existing connector/profile dimensions.
- **Guardrails / rails:** design a KFB clay edge treatment on the existing profile/slot grammar; do not import a Kenney/KayKit race-road rail as the structural boundary.
- **Fences:** environment fences from Tiny Treats/KayKit/Kenney may dress the world beyond the safety/runoff envelope. Structural race/catch-fence behaviour and its attachment line remain Track-Core/Race-owned.
- **Sand / gravel beds:** the runoff shape belongs to the KFB road/edge profile and world-contact truth; clay surface relief and particles sell the material without substituting an external roadCornerSand mesh.
- **Dirt roads, ditches and berms:** remain variants/adapters of the same KFB track construction and socket system.
- **Loop/ramp edges:** are skins/profile states of the existing stunt geometry; no Toy-Car/Kenney loop or ramp donor becomes production geometry.
- **Tunnel portals:** should look pressed/built into the clay world while retaining the S8 tunnel clearance, roadbed and portal-match truth.
- **External environment props:** keep their proven source identity, then clay-adapt only where the look system explicitly allows it; they never move the mathematical track socket.
- **Cosmic:** wait for a pinned KFB visual donor; the same Track Core and sockets remain underneath.

### 4A.7 · Patch-scatter transition grammar · no visible material gradients

**Hard visual rule from Georg:** a biome or surface handoff must not read as a colour/alpha gradient. The underlying drivable surface remains the same continuous Track Core, while the visible material transition is built from **discrete clay patches / plates / blobs / pebbles / clumps / stamped pieces** whose distribution changes over route-space.

Use deterministic scatter fields over arc length `s` and lateral road-space `u`. The transition recipe may vary:
- target-patch coverage / source-remnant coverage;
- patch radius / length / thickness;
- clumping vs. isolated pieces;
- rotation and controlled shape variation;
- relief/depth and material family;
- density falloff and negative space;
- seed, so the same RouteRecipe reproduces the same transition.

A typical handoff reads:

```text
SOURCE settled
→ a few small TARGET clay patches appear
→ TARGET patches become larger / denser while SOURCE breaks into smaller islands
→ mixed seam zone with deliberate negative space
→ a few small SOURCE remnants survive
→ TARGET settled
```

This is a **coverage/scale/scatter transition**, not a smooth shader blend. Avoid transparent fades, one long texture lerp, noisy pixel dithering or a decal that merely hides a hard geometry seam. The pieces may overlap visually, but must not create a second collider, road plate or Z-fighting layer.

Suggested clay vocabularies:
- asphalt → dirt: broken asphalt/clay plates give way to packed-earth blobs, pebbles and wheel-rut relief;
- asphalt → desert: hard road patches shrink while sand pads / dunes / pebble clumps take over;
- forest floor → snow: brown/green ground islands become smaller while irregular snow clumps and sheets accumulate;
- normal road → Cosmic: ordinary clay surface fragments yield to a **source-pinned** KFB cosmic insert/material family; no generic neon gradient;
- wet/water context: damp clay/spray/puddle pieces may increase before a water crossing or water-track context, while actual drive/contact behaviour stays with Race/World.

### 4A.7a · Couple surface patches to edge / biome logic

The surface handoff and the outer road boundary belong to one recipe, but they do **not** have to change at the same metre.

A landscape may use:
- no barrier at all;
- curb / verge;
- guardrail;
- low or catch fence;
- tree avenue;
- forest clearing;
- soft ditch + berm;
- open water edge;
- canyon / cliff edge;
- bridge parapet;
- tunnel wall;
- a future source-pinned Cosmic safe edge.

The recipe therefore needs a surface-scatter state plus an edge/environment state. Their timings may lead or lag one another over `s`.

Do not force every biome into a race barrier. A country road can dissolve into an avenue or clearing; a dirt route can be held by terrain alone; a Grand-Canyon-like section may deliberately expose the cliff edge if the Race safety/contact owner says the route supports it.

### 4A.7b · Width independence

The patch/scatter field must work on the accepted Racer widths and on continuous width changes:
- NARROW 10.8 m, STANDARD 14.4 m, WIDE 18.0 m, HERO 21.6 m (the accepted ladder, 19.09);
- HERO_XL 28.8 m exists only as a named special profile (Weiche / fork zone), not as a normal class;
- continuous width changes (the core's WIDTH_STEP, forks, tunnels that follow the road width).

Define scatter in normalized lateral coordinates relative to the Track Core road/shoulder/runoff slots, never in one fixed mesh width. A STREET→DIRT or STREET→TRACK transition must survive a simultaneous width change without stretching the clay pieces into obvious bands.

### 4A.7c · Required difficult POCs

Treat these as the first high-value design probes, not as separate worlds:

1. **HIGHWAY / OSM ROAD → DIRT TRACK → DESERT PISTE**  
   Asphalt clay islands break apart into dirt clumps, stones and sand pads; curb/guardrail can withdraw into ditch/berm/open desert edge.

2. **FOREST / EARTH → SNOW LANDSCAPE**  
   Ground patches exchange by coverage/scale; tree density and edge treatment shift with the biome. No white colour fade.

3. **NORMAL ROAD → COSMIC HIGHWAY → NORMAL ROAD**  
   Same sockets, width and route truth. Cosmic surface/edge inserts arrive as discrete pressed pieces and retreat again. Exact Cosmic donor remains `SOURCE_REQUIRED` until pinned.

4. **ROAD / TRACK → LONG WATER-CROSSING CONTEXT**  
   Show how roadside ground, containment and props disappear/recompose around a long water section. Do not decide water-driving physics here; preserve the existing Track Core/contact owner.

5. **URBAN / COMMERCIAL / INDUSTRIAL → COUNTRY ROAD / AVENUE / CLEARING**  
   Building/prop density, lamps, lights, bins, mailboxes, vegetation and edge states recede in staggered beats while the same KFB road construction remains continuous.

6. **OPEN LAND → CANYON / CLIFF EDGE**  
   Prove a boundary that may intentionally have no conventional barrier, plus an alternate guarded version. Readability/safety must come from the existing edge/contact contract, not from a generic fence.

For every POC show entry / mixed zone / settled state from the same chase-height camera and one overhead view that exposes the scatter field.

### 4A.8 · New required design evidence

Add to the S4 delivery:

1. **Source isolation sheet** — the actual KFB Track Core / Blender-MCP Racer profile + socket geometry first, then each external **environment prop/building** family actually used. External road/track meshes are not candidates.
2. **Edge atlas** — one common cross-section diagram showing the major left/right states: open, curb/sidewalk, race kerb, barrier/wall, guardrail, fence, grass/gravel/sand runoff, ditch/berm, parapet/tunnel wall.
3. **Transition matrix** — show at minimum the ten families in §4A.4 as compatible socket-to-socket recipes; mark any unbuilt/source-missing family explicitly.
4. **Same-route comparison** — street, race, dirt and one enclosed/surreal state on the same core route; no duplicate route mesh.
5. **Driver-height proof** — red/white kerb + runoff + outer containment; street curb/sidewalk; dirt shoulder/ditch; tunnel portal.
6. **Connector close-up** — one joint with the mathematical socket visible in the evidence pass and the finished clay transition in the design pass, proving that visual softness did not move the joint.

The goal is a **universal clay track construction kit**, not a catalogue of pretty edge props.

### 4B · Separate follow-on slice · Building / façade Clay Adapter

Do **not** solve building deformation inside the Track Core. A separate prepared slice is routed at:

`S5_BUILDING_FACADE_CLAY_ADAPTER_2026-09-27/BRIEF_CLAUDE_DESIGN_BUILDING_FACADE_CLAY_ADAPTER_S5.md`

Its purpose is to make OSM buildings and verified KayKit/Kenney building donors share the same clay/cartoon façade language: softened massing, slightly wonky windows/doors, coherent roofs/bases and reusable façade detail treatment. It reuses H0 Knetwelt / Elastic Grotesque Clay work and keeps OSM geography and WorldBuilder ownership intact.

This is adjacent world-look work, **not** a second Track/Core owner and not a reason to replace the current road geometry.

### 4C · Phase 2 prepared · Reactive Clay VFX / SFX / temporary deformation

After Georg selects the static S4 look direction, continue with the separate prepared Phase-2 brief:

`../S4B_REACTIVE_CLAY_LAYER_2026-09-27/BRIEF_REACTIVE_CLAY_VFX_SFX_SURFACE_S4B.md`

S4B does **not** change Track Core geometry. It consumes the selected S4 surface/biome ids and adds:
- track/biome-specific clay particles for corner load, braking, drift, re-grip, takeoff, landing/bounce and impacts;
- particle colour/form derived from the actual local surface palette rather than one universal smoke;
- surface-specific SFX through the existing KFB Audio/Soundscape owner;
- temporary tyre smears, ruts, landing dents and scrape grooves;
- temporary local dents/squash on eligible OSM / asset buildings and props;
- animated clay relaxation back toward the undeformed presentation;
- mixed-surface reactions inside S4 patch-scatter transitions.

The authoritative contact/collision surface stays unchanged. This is a **presentation-reactivity layer**, not destructible track physics.

Existing donors S4B must reuse, from the older Racer (see `notes/RECON_OLD_RACER_2026-09-27.md`):
- Cologne C-3 `createTrails()` for distance-sampled tyre trails;
- the P3 / W8 **elastic surface** note, a visual-only deform field over the hit tile;
- the surface presets GRIP / DRIFT / ICE / BLACK_ICE / OIL / BOOST / BOUNCE / MAGNETIC / LOW_GRAVITY / RUMBLE as the surface ids.

S4 therefore must leave S4B stable inputs: surface/biome id, local material/colour family, route `s,u`, width/edge state and the selected skin.

## 4D · Tunnel families (new in v2)

The core owns the tube section, the portal ring and the clearance. You own how each family reads. Per family, give one ride-height frame and one portal (or hall mouth) frame. Keep the ring shape at the portal: the collar and headwall follow the tube's own ring (Georg's portal rule).

| Family | Preset / host | Direction to explore (proposals, Georg decides) |
|---|---|---|
| Gotthard / mountain | `gotthard`, arch | pressed clay rock, sprayed-concrete ribs, lights in rhythm with the toy grid |
| Military D.U.M.B. | `dumb`, rect | bunker grey-olive, blast doors at halls, yellow collar, stencils (satire: "Deep Underground Military Base" as a toy diorama) |
| Alien base | `alien`, octagon | Quaternius sci-fi parts **only as environment props** in halls; the tube is ours |
| Toy tube | `toy`, round, skin `toy` | orange plastic toy track, clip-joint rings, board-game bits in the style of "claymation toy world, but in a weird way" |
| Hangar | `hangar`, rect 70 m | big-volume interior, ship beside the track, gantries **outside** the envelope |
| Junction hall | kind `hall` | one cavern over the Weiche; hall ends are walls with tube mouths cut by the tubes' rings |
| Later (reserve only) | mine shaft, subway, sewer, pipe run | mine shaft with **balsa struts** is Georg's first wish (§4E material mix) |

Conditions:

- The road deck stays the only road. The fill under the road is the tube, not a second floor. This matches the older Racer's TARCH rule: one road owner.
- Inner-wall clay relief bulges inward by ≤ 0.7 m.
- Portals fade the deformation out over the last metres, so the mouth keeps its exact ring.

## 4E · Clay in the geometry + material mix (new in v2)

Read `notes/CLAY_GEOMETRY_NOTE_2026-09-27.md`. The key idea: deformation is a function of stream position `s`, section angle and a world seed. Therefore:

- it has no repetition and no seams at piece joints;
- it is deterministic, so runtime, Blender and GLB show the same dents.

Your part:

- **Layers:** show lumps, thumb dents, slump and tool marks, with sizes, on one barrier run and one tube.
- **Strength slider:** one knob from "barely hand-made" to "warped". Show three steps.
- **Road stays true:** at most a sub-centimetre wobble on the driving surface. Colliders are untouched.
- **Material mix as props on anchors:**
  - balsa struts and cross-beams in a mine shaft;
  - rivets and metal bands in a bunker;
  - pegs and board-game bits along a toy track;
  - later fur and hair shells.

  Each anchor gets seeded jitter (rotation, length, a missing strut now and then), so it looks hand-built, not arrayed. Say which props you would need as anchors (spacing, side, lift); the core would emit them.
- **Reactive dents and tyre tracks** belong to S4B (§4C). Leave S4B the ids and the material families.

## 4F · KFB billboards along the track (Phase B, reserve now)

Read `notes/WSA_NOTE_BILLBOARDS_ALONG_TRACKS_2026-09-27.md`.

- Regular boards along streets and tracks, visible when passing and readable when stopped.
- Slightly varied bodies, in the 1950s / 60s motel and casino sign spirit, with seeded KFB palettes.
- All display options: card, text, 4:3 video, a "living" face.
- Every board carries **two contents**: the surface message and the "true" one, revealed by the **KFB sunglasses** ("They Live").

The older Racer already has a billboard body family with KFB card art (Cologne C-3, `buildBillboardFamily()`). Extend it; do not start over. In Phase A, only reserve the edge-atlas slot (outside the barrier, eye height, 15–25° toward traffic).

## 4G · Inputs from the older Racer repo (reuse, do not re-invent)

**Claybound benchmark** (`ref/racer/…CLAYBOUND…md`): compare your options on its five axes.

1. silhouette / massing;
2. surface continuity;
3. material + light;
4. form language / detail budget;
5. camera / motion.

**Environment grammar** (`ref/racer/KFB_TRACK_ENVIRONMENT_GRAMMAR_2026-09-19_excerpt.md`), accepted direction 19.09:

- **KFB TOY GRID:** the road material carries a route-space grid.
  - It is `u` = lateral / width, `v` = `s`, with minor lines every ~4.5 m, majors every ~18 m and `fwidth` anti-aliasing.
  - It is **never an overlay mesh** (z-fighting).
  - The stream already gives you `s` and the width, so propose how the toy grid lives with the clay look. Is it a marking style? Is it pressed into the clay?
- **Palette ladder per biome:**
  1. dark road;
  2. terrain;
  3. buildings;
  4. light / sky;
  5. one saturated accent.

  A second saturated colour is only for gameplay state (boost, cards, magnet).
- **Rule-of-Three prop clusters** (anchor, support, accent), instead of uniform scatter.
- **Three OSM track modes:** OSM road skin; authored stunt socket; facility / fantasy track.
- **Colour bands** (RACE / FREEWAY / ROAMING / INTERSTATE / GALACTIC / TUNNEL / BRIDGE) set the context. Your skins are the palette per band.

**Race barriers:** Georg wants classic race barriers "looked at from Kenney, but integrated into our barrier system". Read this together with §4A.5: Kenney race barriers are a **visual reference** for the family (proportions, red/white rhythm, tyre walls). They are **not** geometry donors. The barrier is built on the core's barrier slots and profile numbers.

## 5 · Conditions (each one checkable)

1. **The geometry comes from the stream.** Your look reads `slots`, roles, `skin`, `paint`, `markings` and `tunnel`. It does not re-solve the track.
   - A proposed geometry change is stated as profile numbers the core already has:
     - `shoulderW`, `shoulderDrop`, `barrierGap`, `barrierT`, `barrierH`, `barrierOuterTop`, `deckDepth`;
     - per-side scale `sideL/sideR`;
     - tunnel `wall`, `clear` or `aspect`;
     - or a named new slot or anchor with its lateral/lift values.
   - Check: the TD03 stream renders with your look, and the centre line matches `p` to 1 cm.
2. **Roles stay the unit of style.** Keep the five face roles and three marking kinds, and add the tunnel roles `tube_inner`, `tube_outer` and `collar`. Name each further addition and the face or band it covers.
   - Check: every face of b12's section has exactly one role in your mapping.
3. **Seams have no hard edge.** The staggered blend stays; you may change its length and per-role zones. Biome handoffs use patch-scatter (§4A.7), not gradients.
   - Check: at b02 and b03, no role changes colour or material over less than 8 m.
4. **The magnet arrow stays an arrow** pointing in the driving direction.
   - Check: b03 and b05 read as a tip, not as a ladder.
5. **Readable at speed.** From the driver's eye at 25 m/s (b05 framing, and r02 inside a tube), road, shoulder, barrier and magnet bars must be told apart by value, not only by hue.
   - Check: a greyscale copy of your b05 and r02 still separates all four.
6. **Scale is stated.** H0 runs at figure ≈ 1.2 units; the track is in metres (a car is ≈ 4.1 m, a lane 14.4 m, a truck up to 4 m tall). State the relief `scale` per role and show it in one close frame (b12 framing) and one frame with the t10 vehicles.
7. **Same physics for all vehicles.** The look adds no collision geometry and moves no road surface. Kerb bulges go outside `road_L..road_R`.
8. **The 7 m vehicle envelope stays free.** This covers tubes, halls, loops and crossings. The only exception is the tube clay bulge of ≤ 0.7 m, and it lies outside the envelope.
   - Check: in r02, r04 and b04, nothing you added reaches within 7 m above the road over the road width.
9. **Georg decides the look.** Present **2–3 options** side by side, each with the same three cameras as H0: total, near, ride-along. Present no single "final".

## 6 · Deliverables

**Phase A** (§1A):

- **Skin set** `kfb.track-skins/0.1` (JSON):
  - per skin, per role: colour, clay `role` (`world` / `soft` / `knetbar`) and `scale`;
  - marking colours.
  - At least `street`, `track`, `mag`, `buoy` and `toy`, plus any clay-native skin you propose, plus the tunnel host families of §4D.

  The core already takes `SKINS` in this shape (colour per role); the clay fields are new.
- **2–3 look options**, with renders on `data/td03.stream.json` (total, near, ride) and one frame each of b03 and b11. Compare them on the Claybound axes.
- **Edge atlas + runoff stacks** (§4A.2, §4A.8-2) and the **first four transition families** (entry / mid / settled).
- **Connector and cap grammar:**
  - open end (lip, landing, route start/end);
  - split gore and merge tail;
  - width step;
  - loop profile;
  - **tunnel portal**;
  - **junction-hall mouth**.
- **Tunnel family frames** (§4D) on `data/tn02.graph.stream.json.gz`.
- **Clay-geometry proposal** (§4E), with the three slider steps.
- **RETURN.md** with defects first: what did you not solve, and what fights the look? List every Phase B item as "reserved, not shown".

**Phase B** (after Georg picks a direction):

- biome POCs (§4A.7c);
- remaining transition families;
- material-mix props;
- billboards (§4F);
- building / façade adapter (§4B);
- S4B reactive layer (§4C).

## 7 · Not yours (other owners)

- Track layout, piece solver, checks, tunnel sizing and anchors: the Coworker (Track Core).
- Race physics, contact, recovery, camera, OSM geography, World Light Rig: WSA / Race.
- Eye and face rigs, Motion Library: their own owners.
- Billboard content (surface and "true" texts): the KFB card / marketing corpus.

## 8 · Open questions for Georg (ask them inside your options, with pictures)

1. Should clay skins be **colour presets** (as now), or **"clay types"** that carry colour, clay role and relief scale together?
2. **Kerb bulges** (H0 style) on the track too, or only on the street?
3. Should the **magnet run** be clay at all? It could be glossy `knetbar` or glowing strips, like a different material pressed in.
4. **Undersides and supports** under decks and loops: clay pillars in the sphere-in-sphere spirit, or none (cartoon physics: loops may stand free)? The older Racer has pillar styles to reuse (classic / trunk / vine / rope, RKIT-03).
5. **KFB TOY GRID**: pressed into the clay road, painted on it, or only on the track and mag skins?
6. **Clay-geometry strength:** where on the slider, and does it differ per world (city vs toy vs alien)?
7. **Tunnel halls:** a flat roof as now, or a vault / dome per family?
