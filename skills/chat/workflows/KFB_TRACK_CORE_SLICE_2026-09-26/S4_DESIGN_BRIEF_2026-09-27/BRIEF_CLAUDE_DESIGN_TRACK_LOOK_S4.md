# Brief · Track kit look in the clay world (Knetwelt) · S4 · 2026-09-27

**From:** Claude Coworker (Track Core line). **To:** Claude Design, project "KFB Animation Lab" (the Knetwelt / claymation line).
**Decides the look:** Georg. **Runs in parallel with:** TD04 (balcony climb + closed circuit), built by the Coworker. Nothing here waits on it.

## 1 · What we want from you

Give the KFB track kit a look that belongs in the clay world of **H0 Hirnwelt**. Georg picked H0 as the style anchor on 27.09.

The kit already exists as geometry: pieces, seams, profiles, skins and markings, computed by one JavaScript core. What it lacks is a look.

We want a **concept, not a paint-over**. Treat this as a sparring brief:

- Improve on what we did.
- Bring your own ideas.
- Red-team the parts of the kit that fight the clay look.

Where you find that the geometry itself is in the way (for example razor-thin barrier caps), say so. Propose the change as numbers the core can take (see §5).

## 2 · Style anchor (read first)

**H0 Hirnwelt package** (on GitHub, `main`):
`tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27/`
https://github.com/georg-doc/kayfabizarro/tree/main/tools/KFB-ToolBox/_inbox/KFB_CLAYMATION_H0_HIRNWELT_2026-09-27

- `HOWTO_KFB_3D_Claymation_Diorama_Worldbuilding.md`, sections 1–5 and 7. These are the three layers: pre-pass `clay-soften.v1.js`, material `clay-material.v4.js` + `clay-relief.v2.js`, and the light table.
- H0's own road profile (How-to §7.7) has bulged kerbs, a `#5d6f86` road and `#e2d0bc` kerbs and centre line. It is the closest existing clay road.
- `ref/h0/01-h0.png` and `ref/h0/04-h0.png` in this ZIP are copies of H0's evidence frames.

**Rules carried over from H0** (Georg's decisions, do not reopen):

- Models are **not** re-modelled. The look comes from the pre-pass plus the clay material.
- The sun is warm white. Saturated light re-colours clay (for example yellow × petrol reads as green).
- Sky is Claybound `#96bede`, flat.
- Sphere-in-sphere is the pattern for clouds and trees.

## 3 · What the kit is (facts, from the core)

**One core, one stream.** `track-core.mjs` v0.3 compiles a route recipe into a **stream**, a sample every 0.5 m:

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

  The face between two slots has a **role**:
  - `road`
  - `shoulder`
  - `barrier_side`
  - `barrier_cap`
  - `underside`
- **Skin per sample** (`skin`: `street` | `track` | `mag`) and **`paint`**, one colour per role. Where the skin changes, the core blends the colours:
  - over 32 m, centred on the joint;
  - **staggered per role**: cap first, then side, underside and shoulder, road last.

  So there is never a hard colour edge. This is Georg's rule; see `shots/b13_profiles_and_skins.png`.
- **Markings** (`markings`, bands with `s0`..`s1`):
  - `edges`: edge lines at the road edge minus an inset;
  - `centre`: dashed centre line;
  - `bars`: magnet stripes. The first and last 5 bars of every magnet run taper from 8 % to 70 % of the lane, so the run reads as an **arrow tip** in the driving direction (Georg).
- **Widths:** STANDARD 14.4 m, WIDE 18 m (drift), HERO 21.6 m (split into 10.8 | 10.8).
- **Topology breaks** (`brk`) at split and merge, and **no surface** over air (jumps). Every run end gets a cap.
- **Pieces:**
  - STRAIGHT, CURVE_EASE (clothoid), HAIRPIN_180, SPIRAL (car-park helix), LOOP;
  - WIDTH_STEP, OFFSET_S, SPLIT_HALF / MERGE_HALF, CONNECT;
  - CREST / DIP, KICKER → AIR → LANDING.

Contract and schema: `kit/README_TRACK-CORE.md` and the S3 RETURN. Core source: GitHub `skills/chat/workflows/KFB_TRACK_CORE_SLICE_2026-09-26/S3_2026-09-27/track-core/`.

## 4 · What is in this ZIP

| Path | What |
|---|---|
| `shots/b01…b12` | Blender renders of TD03 (Tokyo Drift at the Uni-Center) and the split/merge seed. Flat preview colours come from the stream `paint`. |
| `shots/b13_profiles_and_skins.png` | The five real cross-sections, the three placeholder skins, and the seam-blend stagger curves. |
| `shots/b14_three_loader_check.png` | The TD03 stream drawn in three.js by `kit/stream-to-three.mjs` (headless Chromium, SwiftShader). |
| `data/td03.stream.json` | TD03, 1,570 m, 3,125 samples, all 13 core checks green. |
| `data/split_merge_seed.graph.stream.json` | HERO road that splits into two lanes. One lane climbs a 10 m magnet lift with a crest, then merges back. |
| `kit/stream-to-three.mjs` | Reference loader, stream → three.js meshes with vertex colours (tested, see `kit/check/`). |
| `kit/check/` | The pixel check: `index.html` + `shot.mjs` (Playwright). |
| `ref/h0/` | Two H0 evidence frames, for comparison. |

**Shot list:**

| Shot | Shows | Seam or piece to design |
|---|---|---|
| b01 | TD03 overview with Uni-Center scenery | whole-route rhythm: street, car park, roof, loop, plaza, jump |
| b02 | helix top → roof straight | skin seam **street → track** |
| b03 | magnet run-in before the loop | seam **track → mag** plus the **arrow-tip bars** |
| b04 | 26 m roof loop, side | loop profile (slimmed barriers), underside visible |
| b05 | loop entry, driver's eye | readability at speed: road vs shoulder vs barrier vs bars |
| b06 | drift ring widening to WIDE 18 | width step inside a curve |
| b07 | street into the car park | WIDTH_STEP to slim parapets, crossing under the roof deck |
| b08 | three-floor helix in the atrium | repetition: floors, parapets, stacked undersides |
| b09 | kicker → air → landing | **open ends**: lip cap, landing cap |
| b10 | plaza hairpin at WIDE 18 | tight turn, inner edge |
| b11 | split start on the HERO road | **gore**: two inner edges meet, then a barrier rises from flush |
| b11b | branch lift with magnet run | crest on a split lane |
| b12 | barrier close-up (drift ring) | barrier side / cap / shoulder at driver height |

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



- **Red/white kerbs and barriers:** alternating pressed-clay masses with softened corners and controlled hand variation; preserve exact module/connector length so the pattern does not drift at joints.
- **Guardrails / rails:** rounded stamped clay/soft-metal language is allowed, but do not distort the clear vehicle envelope or create hidden collision lips.
- **Fences:** soften the verified source silhouette; do not stretch one fence mesh arbitrarily to cover every length. Use posts/rails/corners as a real modular family.
- **Sand / gravel beds:** surface relief and particle/detail density may sell the material, but the visible driving/runoff surface must remain continuous with the core/world contact truth.
- **Ditches / berms:** design as world/edge profiles tied to the road frame; do not cut a second route trench through the world behind Track Core's back.
- **Loop/ramp edges:** become slimmer/safer through the same profile parameters; no separate stunt-road shell.
- **Tunnel portals:** should look pressed/built into the clay world while retaining the S8 tunnel clearance and portal-match truth.
- **Cosmic:** wait for a pinned KFB donor rather than using generic neon sci-fi language.

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
- STANDARD: 14.4 m;
- WIDE / WB-W0 road: 18 m;
- future parameter-driven widths.

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

S4 therefore must leave S4B stable inputs: surface/biome id, local material/colour family, route `s,u`, width/edge state and the selected skin.

## 5 · Conditions (each one checkable)

1. **The geometry comes from the stream.** Your look reads `slots`, roles, `skin`, `paint` and `markings`; it does not re-solve the track.
   - A proposed geometry change is stated as profile numbers the core already has:
     - `shoulderW`, `shoulderDrop`, `barrierGap`, `barrierT`, `barrierH`, `barrierOuterTop`, `deckDepth`;
     - per-side scale `sideL/sideR`;
     - or as a named new slot with its lateral/lift values.
   - Check: the TD03 stream renders with your look and the centre line matches `p` to 1 cm.
2. **Roles stay the unit of style.** Keep the five face roles and three marking kinds, or name each addition and the face or band it covers.
   - Check: every face of b12's section has exactly one role in your mapping.
3. **Seams have no hard edge.** The staggered blend stays, but you may change its length and per-role zones.
   - Check: at b02 and b03, no role changes colour or material over less than 8 m.
4. **The magnet arrow stays an arrow** pointing in the driving direction.
   - Check: b03 and b05 frames read as a tip, not as a ladder.
5. **Readable at speed.** From the driver's eye at 25 m/s (b05 framing), road, shoulder, barrier and magnet bars must be told apart by value, not only by hue.
   - Check: a greyscale copy of your b05 still separates all four.
6. **Scale is stated.** H0 runs at figure ≈ 1.2 units; the track is in metres (a car is ≈ 4.5 m, a lane 14.4 m). State the relief `scale` per role for the race world and show it in one close frame (b12 framing).
7. **Same physics for all vehicles.** The look adds no collision geometry and moves no road surface. Kerb bulges go outside `road_L..road_R`.
8. **Georg decides the look.** Present **2–3 options** side by side, each with the same three cameras as H0: total, near, ride-along. Present no single "final".

## 6 · Deliverables

- **Skin set** `kfb.track-skins/0.1` (JSON):
  - per skin, per role: colour, clay `role` (`world` / `soft` / `knetbar`) and `scale`;
  - marking colours;
  - at least `street`, `track`, `mag`, plus any clay-native skin you propose.

  The core already takes `SKINS` in this shape (colour per role); the clay fields are new.
- **Connector and cap grammar:** how these look:
  - an open end (lip, landing, route start/end);
  - the split gore and merge tail;
  - a width step;
  - the loop's slimmed profile.

  One frame each, from the shots above.
- **2–3 look options,** with renders on `data/td03.stream.json` (total, near, ride) and one frame each of b03 and b11.
- **RETURN.md** with defects first. What did you not solve? What fights the look?

## 7 · Not yours (other owners)

- Track layout, piece solver and the checks: the Coworker (Track Core).
- Race physics, Option-C camera, OSM geography, World Light Rig: WSA.
- Eye and face rigs, Motion Library: their own owners.

## 8 · Open questions for Georg (ask them inside your options, with pictures)

1. Clay skins as **colour presets** (like now), or as **"clay types"** that carry colour, clay role and relief scale together?
2. **Kerb bulges** (H0 style) on the track too, or only on the street?
3. Should the **magnet run** be clay at all? It could be glossy `knetbar` or glowing strips, like a different material pressed in.
4. **Undersides and supports** under decks and loops: clay pillars in the sphere-in-sphere spirit, or none (cartoon physics: loops may stand free)?
