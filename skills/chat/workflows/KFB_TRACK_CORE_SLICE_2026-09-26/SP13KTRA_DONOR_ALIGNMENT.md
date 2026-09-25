# Track Core × SP13KTRA · donor alignment · 2026-09-26

**Author:** Claude Coworker (Blender MCP lane), on Georg's request: "align everything with the logic, technique, concept and construction of the original".
**Donor:** `KilledByAPixel/SP13KTRA` @ `e9b25895a1ebad787a5b92857035d2e5751eccb7` (24.09.2026). The earlier Race TARCH-0 donor proof pinned `166ad838…`, so the donor has moved and this is the re-pin.
**Files read:**
- `code/skeleton.js`, `code/trackGen.js`, `code/track.js`, `code/levels.js`;
- the contact parts of `code/vehicle.js`;
- `LICENSE`, `README.md`.

## Licence boundary (binding)

SP13KTRA is **All Rights Reserved**. It was published so the game can be viewed and judged, and nothing more.

- Reading it to understand the architecture is what this document does.
- **Not allowed:**
  - copying code, tables, constants, text or assets;
  - porting functions line by line;
  - deriving KFB files from its files.
- KFB re-implements **principles** independently, in its own words, names and numbers. Every KFB number must come from KFB measurements (RKIT, Race feel v0.8, PR #204), never from the donor.
- This matches the existing Race rule `SOURCE_PINS.filamentReferenceOnly` and TARCH-0.

## 1 · What the donor actually is (architecture, in our words)

SP13KTRA is a complete anti-gravity racer with eight circuits. Its track pipeline has **four stages and one world**.

1. **Authored skeleton.** A circuit is a tiny corner polygon. Each corner carries four values:
   - a fillet radius;
   - a height keyframe;
   - flags for the edge it leaves: wave, chicane, crossing deck, arch / big / dense-tunnel;
   - a banked flag for its own arc.

   That is the whole authored intent. There are no meshes and no spline handles.
2. **Pure skeleton builder.** It turns the polygon into N evenly spaced route samples:
   - fillets are shrunk jointly until neighbours fit on their shared edge;
   - wave and chicane offsets use an envelope that keeps position **and** heading continuous at both ends;
   - heights are eased keyframes;
   - signed curvature ("turn") is computed and smoothed.

   The builder is pure (no engine globals) so it runs in Node tests.
3. **Generator.** On the samples it computes:
   - a seamless height swell;
   - **bank derived from curvature**, then heavily smoothed so it never changes suddenly;
   - the AI racing line (look-ahead curvature, slowly eased);
   - **semantic paint over s**: pads, recharge strips, rough shoulders, as per-sample `type + lateral offset`, with explicit rules for who yields to whom;
   - corner warnings from a signed curvature sum. An S-bend cancels itself, so it does not trigger a warning.
4. **One permanent world, baked once.**
   - **Frames:**
     - Every sample gets forward, right and up.
     - Right is the *flat* heading-right rotated by the bank.
     - Up comes from forward and right.
     - A route query at any `s` interpolates two frames and re-orthogonalises them.
   - **Profile as a function:**
     - A surface point is `frame(s).point(lateralX, lift)`.
     - The cross-section is a *function of x*: flat, then a quadratic berm near the wall.
     - It is not a vertex list.
   - **Road** is baked in fixed chunks of samples. Panels are coarse on plain road and single-sample at markings, and a panel never straddles a marking change.
   - **Lane lines are cuts in the surface itself** (narrow co-planar strips of the same surface pass), not lifted decals. Only pads and strips are lifted, just enough to clear panel twist.
   - **Walls** are simple vertical inner faces at the half-width, with an emissive rail on top.
   - **Ground** is one "causeway" plane below the lowest road *including banked outer edges*. Terrain is never cut around the road.
   - **Tunnels and gates** are **scenery**: arches placed from the route frame over the *same* road. There is no second road, no tunnel floor and no collider.
   - **All scenery** is welded into one mesh and placed by route queries (distance to route, inside the loop) with clearance from the road. It is seeded, and scenery draws from the random stream **last**, so it can never move gameplay placements.
5. **Contact is route-space, not mesh-space.**
   - The craft is projected to `(s, x)` with a **search window around its last `s`**. That keeps it on its own deck at crossings and on its own branch of a hairpin.
   - Walls are a clamp on `x`.
   - The hull is seated a fixed lift above the frame.
   - The track mesh has no role in physics.

**What the donor does NOT have:**
- width changes around a circuit (width is constant per circuit);
- street↔track transitions;
- inverted 3D loops;
- ramps or airborne flight with re-capture;
- varying edge treatments.

KFB needs all of these. So the donor gives us the **skeleton → samples → frames → paint → baked world** backbone, and KFB must add the parameter curves for these features on top.

## 2 · Alignment matrix with the Track Core decision

| Topic | Donor principle | Track Core today (PR #219) | Alignment decision |
|---|---|---|---|
| Authoring | corner polygon + flags = whole intent | RouteRecipe (#216) with gestures/anchors | **ADOPT the spirit:** the recipe stays tiny and semantic (gestures + few numbers). The Pieces schema must be expressible as "corner/edge + flags" for simple circuits. |
| Build stage | pure function, Node-testable, deterministic | "automatic checks" | **ADOPT:** the core solver is a pure function with no engine/Three/Blender globals. Tests hash a route fingerprint (cumulative heading). |
| Samples | arc-length resampled, evenly spaced | frames over `s` | **ADOPT:** one sample stream at fixed spacing is the only truth. Pieces never output meshes. |
| Curvature | circular fillets + smoothed curvature for bank/AI | real clothoids planned (M1/M2) | **ADAPT / TEST:** the donor ships a great-feeling racer with *circular* fillets because bank and AI read a *smoothed* curvature. Clothoids are therefore **not a prerequisite for feel**. Blender sprint B2 compares both on the same corners before we spend on clothoid solving everywhere. |
| Wave / chicane | lateral offset with an end-continuous envelope | M2 OFFSET_S / CHICANE | **ADOPT the mechanism:** an offset family with position- and heading-continuous envelopes. Cheaper than clothoid chains for S-shapes. |
| Heights | eased keyframes + seamless swell | M4 grade/crest/dip | **ADOPT:** height is a separate channel over `s` (keyframes + ease), independent of plan geometry. |
| Bank | derived from curvature, heavily smoothed, clamped | not yet specified | **ADOPT:** `bank(s) = clamp(k · smoothed κ(s))`, plus an authored "fully banked" flag. This was my open point from 26.09; the donor confirms it. |
| Frames | flat heading-right rotated by bank; no Frenet | "one frame type", RMF suggested for loops | **ADOPT for all non-inverting track:** the heading + bank frame is stable on S-bends (no Frenet flip). **EXTEND for loops/ramps:** rotation-minimising transport when pitch passes ±90°. It is the same frame type, with a different propagation law flagged per piece. |
| Profile | function of lateral x (flat + berm) | canonical slot vertex list | **MERGE:** the slot profile is a **function** `profile(x; params(s))`, sampled at named slot x-positions. Slots give topology and parity, the function gives smoothness. Transitions blend `params(s)`. |
| Markings | co-planar surface cuts; decals lifted only where needed | separate marking layer | **ADAPT:** the marking *definition* is a separate layer (style over `s`). The *emission* is a split of the same surface strip at line x-positions, so there is no z-fighting and no host-line cutting. Lifted decals only for pads and strips. |
| Paint | per-sample `type + lateral` with yield rules | stripes, pads | **ADOPT:** gameplay surfaces (boost, recharge, rough, mag) are paint over `s` with explicit priority rules, never geometry. |
| Chunks | fixed sample chunks, adaptive panel length, never straddle a marking change | not specified | **ADOPT:** GLB export and runtime both chunk by sample ranges, which also gives streaming for the long Köln route. |
| Walls / edges | simple inner wall + light rail | edge-treatment layer | **ADOPT the principle:** edges are a layer at `±w(s)` with a type per span. KFB keeps richer edge types (none, curb, low, high, fence). |
| Ground | causeway plane below the lowest road incl. banked edges; no terrain cuts | WorldBuilder terrain | **ADAPT:** wherever KFB has no real terrain, use the causeway rule. Where WB terrain exists, the road **owns a clearance corridor**; terrain is lowered or excluded there and never cut around a shell. This is TARCH-0's lesson again. |
| Tunnels / arches / bridges | scenery over the same road | bridge deck as "route section" | **ADOPT:** tunnel, arches, bridge pylons, cables and portal are **scenery keyed to the route frame**. The Mülheimer Brücke deck is simply road with deck parameters; the pylons are scenery. |
| Scenery | one welded mesh, route queries, seeded, drawn last | Claude Design lane | **ADOPT:** scenery placement is a separate, seeded, last-drawn pass. It can never move gameplay. |
| Contact | route-space projection with a windowed search around the last `s` | Race uses Rapier | **DECISION NEEDED (Race/WSA):** route-space contact is the donor's key robustness trick for crossings, hairpins and our loop self-overlap. Proposal: Race keeps Rapier for dynamics and props, but road contact and progress use windowed route projection from the core. The core must at least expose `project(pos, sHint)`. |
| Crossings | height keyframes + windowed projection | RKIT-03 figure-8 | **ADOPT:** crossings need no special geometry, only separate heights and the windowed projection. |

## 3 · Consequences for the plan

1. **The core API shape is now concrete:**
   - `buildSamples(recipe) → SampleStream`;
   - `frameAt(s)`;
   - `pointAt(s, x, lift)`;
   - `project(pos, sHint)`;
   - `paintAt(s)`;
   - `bakeChunks(stream, style) → meshes`.

   It is pure, deterministic and fingerprint-tested.
2. **Clothoids get downgraded from prerequisite to option.** They are to be proven in Blender against the donor's fillet + smoothing approach.
3. **The loop is the only real extension** of the donor frame law: rotation-minimising propagation per piece. Ramps and flight need re-capture via `project` with a hint.
4. **RKIT-11's hacks each map to a donor principle:**
   - monkey-patched profile → profile function with parameters;
   - host-line cuts → co-planar marking emission;
   - separate bridge sweep → deck = road + scenery shell;
   - loop lane on a plate → the same sample stream leaving the deck.

## 4 · Honest limits of this alignment

- I did not run the donor in a browser for this document. It is a source reading. TARCH-0 had already looked at the live build.
- Donor feel numbers (sample spacing, smoothing windows, clamps) are deliberately **not** transferred. KFB tunes its own values in B2 against Race v0.8 feel.
- Race's actual contact / collider code for the current C-3 lab is still unread (census gate).
