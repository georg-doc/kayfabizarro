# TRACK-CORE-2 · Claude Design transition visual grammar brief · 2026-09-26

**Executing agent:** **Claude Design**  
**Starts after:** TRACK-CORE-1B runtime/core parity is green  
**Geometry owner:** existing Track Core only  
**Task:** design the visible transition grammar between road/track/world styles without inventing a second geometry system  
**Output:** complete editable Session Cut + style/transition recipes

## Preconditions

Do not start from the Perplexity prompt alone.

Read:

1. current Track-Core `START_HERE.md`;
2. `PERPLEXITY_TRANSITION_RESEARCH_ASSESSMENT.md`;
3. completed TRACK-CORE-0 contracts;
4. TRACK-CORE-1A Blender evidence;
5. TRACK-CORE-1B runtime/core Return;
6. exact KFB palette/material/world/marking donors pinned by Web.

If the Track Core is not proven, stop. Claude Design does not repair core geometry.

---

## Georg scope expansion · 27.09.2026 · universal clay edge / runoff / connector kit

This visual-grammar gate now includes the **whole road/track boundary system**, not only colour/material transitions.

Read the detailed source-backed design addendum first:

`S4_DESIGN_BRIEF_2026-09-27/BRIEF_CLAUDE_DESIGN_TRACK_LOOK_S4.md §4A`

The design target is one modular clay construction language spanning:

```text
OSM / CITY STREET
↕
RACE TRACK
↕
DIRT / OFF-ROAD
↕
STUNT RAMP / LOOP / KICKER / LANDING
↕
BRIDGE / ELEVATED DECK
↕
TUNNEL
↕
MAG / COSMIC HIGHWAY
```

Left/right edge treatment and lateral runoff are first-class design states. Required vocabulary includes kerb/sidewalk, red/white race kerb, red/white barrier, wall/pit wall, guardrail, fence/catch fence, grass/asphalt/gravel/sand runoff, ditch/swale/berm, parapet and tunnel wall/service edge.

**Connector principle:** preserve the existing Track Core socket/CONNECT boundary state. Georg's existing Kabelbett example is a visual precedent for the plug/transition idea, but no literal Kabelbett source path is pinned yet; do not invent one. Visual clay softness may span the joint, but the mathematical port remains exact.

**Geometry-source rule:** the road/track system is KFB-owned. Use the existing Blender-MCP Racer / Track Core profile, slots and `CONNECT` sockets as the only drivable-geometry source. Do **not** use Kenney/Kenny, KayKit or Tiny Treats road/track/kerb/barrier/ramp/loop geometry as design or production donors. Those kits remain environment sources for buildings and standalone roadside/world props (mailboxes, bins, lamps, traffic lights, signs, vegetation, etc.). A fence from an external pack may dress the environment outside the Track Core clearance/runoff envelope, but it is not the structural track edge. Any external prop actually used must still be shown in isolation before composition.

# Goal

Create a small, reusable **visual transition grammar** for the same continuous track core.

The geometry must already work with all style layers disabled.

Claude Design only decides how the world reads when the same route passes through different contexts.

Examples:

```text
CITY STREET → KFB RACE TRACK
RACE TRACK → OPEN LAND / NATURE
ROAD / TRACK → INDUSTRIAL / FENCED
RACE TRACK → COSMIC / SURREAL
```

Do not turn these into separate track systems.

---

# 1 · Source proof first

Before designing combinations, show the **actual KFB source system** in isolation:

- current Blender-MCP Racer / Track Core road cross-section and named slot/profile roles;
- current `CONNECT` / socket boundary state and at least one real joined module pair;
- representative own KFB road/track piece, stunt transition and one bridge/tunnel roadbed state where available;
- current KFB marking/style/material owners applied to that geometry;
- the OSM/world seam showing that geography/world context surrounds the same KFB drivable construction rather than replacing it;
- any external building or roadside/world prop actually used in the scene, shown alone first;
- any verified Cosmic/Surreal visual donor actually approved for KFB.

The isolation requirement for Kenny/Kenney, KayKit and Tiny Treats applies to **environment props only**. Their road, track, kerb, barrier, runoff, ramp and loop models are not source candidates for this design pass.

If a visible environment prop source does not exist, mark `SOURCE_REQUIRED`. Do not manufacture generic racing/futuristic assets as substitutes.

---

# 2 · Transition grammar is layered

Design each transition as independent curves over route arc length `s`.

## Geometry/profile facts — READ ONLY

- road width;
- curb/walkway;
- shoulders;
- barriers;
- slots/visibility.

These come from Track Core.

## Markings

Examples:

- STREET centre/lane markings fade;
- TRACK edge markings appear;
- MAG stripes arrive later;
- crossings/tram bands end intentionally.

Claude may tune visual timing within the allowed marking curves, but not create another marking renderer.

## Edge treatment

Use pinned options such as:

- none / painted edge;
- low urban kerb;
- raised kerb + sidewalk;
- race kerb: flat / rumble / raised red-white;
- low/high barrier and pit wall;
- guardrail / rail;
- low fence / catch fence;
- wall / parapet;
- asphalt / grass / gravel / sand runoff;
- soft dirt shoulder / ditch / earth berm;
- tunnel service edge / wall;
- terrain/water edge;
- future KFB-specific Cosmic safe edge only when a donor is pinned.

Design the visible choreography of how one yields to another.

### Edge / runoff state families

Think in **lateral stacks**, for example:

```text
TRACK → RED/WHITE KERB → SAND BED → CATCH FENCE
STREET → KERB → SIDEWALK → FENCE
DIRT → SOFT SHOULDER → DITCH → BERM
BRIDGE → SHOULDER → PARAPET
TUNNEL → SERVICE STRIP → WALL
```

The stack may change through parameter curves over `s`. Do not model each stack as a separate road strip.

The visual grammar should be able to describe at least these state ids without committing the core to a new schema:

`OPEN · PAINTED · KERB_URBAN · KERB_RACE · SIDEWALK · VERGE · RUNOFF_ASPHALT · RUNOFF_GRASS · RUNOFF_GRAVEL · RUNOFF_SAND · DITCH · BERM · GUARDRAIL · BARRIER_BLOCK · WALL · PIT_WALL · FENCE_LOW · FENCE_CATCH · PARAPET · TUNNEL_WALL · COSMIC_SAFE_EDGE`.

If Track Core later needs a new field to carry one of these states, return it as a concrete schema proposal to the core owner. Claude Design must not create a parallel edge solver.

## Material/look

Use KFB palette/material owners. **Do not solve biome/surface handoffs with a visible colour or alpha gradient.**

For asphalt↔dirt, dirt↔snow, road↔desert, road↔cosmic and similar changes, use deterministic **patch-scatter fields**: discrete clay plates/blobs/clumps/pebbles whose size, coverage, density, rotation, relief and source/target ratio change over route-space `s` and normalized lateral coordinate `u`.

The underlying Track Core surface stays continuous. Scatter pieces are presentation/material language, not another road mesh or collider.

## Props/environment

Density / family transitions may lag or lead the road transition:

- lamps / traffic lights;
- signs / mailboxes / bins / benches;
- environment fences outside the Track Core safety envelope;
- vegetation / tree avenues / clearings;
- urban / commercial / industrial buildings;
- surreal props.

Kenny/Kenney, KayKit and Tiny Treats are used here as **environment/building/prop sources**, never as the drivable road/track geometry source.

Building façade deformation is a separate follow-on owner slice: `S5_BUILDING_FACADE_CLAY_ADAPTER_2026-09-27`. Track-Core-2 only composes already-approved building output around the route.

## FX

Only verified/relevant effects:

- dust;
- spray;
- atmosphere;
- restrained KFB effect cues.

FX never hides a broken geometry seam.

---

# 3 · Use staggered transition beats

RKIT-11 provides a useful principle:

**not every visible property changes at the same metre.**

Create a visual timing language such as:

```text
T0   route/profile begins changing
T1   edge treatment begins
T2   old markings fade
T3   new markings appear
T4   props/environment density changes
T5   material/look completes
T6   optional FX accent completes the beat
```

The exact timings are style recipes.

They must remain data, not hardcoded mesh edits.

---

# 4 · Required first visual recipes

Build only a small set.

## V1 · STREET → TRACK

Target:

normal road becomes KFB race track naturally.

Show:

- curb/walkway withdrawal;
- shoulders/barriers;
- marking transition;
- palette/material continuity;
- scenery transition.

No giant gate arch required.

## V2 · TRACK → OPEN LAND / WATER EDGE

Target:

race structure opens out and the route feels exposed to landscape.

Show:

- barrier reduction/ending;
- edge/readability without accidental fall-off ambiguity;
- gravel/ground/water visual seam if sources exist;
- no alpha-disappearing road geometry.

## V3 · TRACK → INDUSTRIAL / FENCED

Target:

same route core entering Mülheim/industrial language.

Use verified fence/industrial donors only.

## V4 · TRACK → SURREAL / COSMIC

Only if exact KFB donors are pinned.

Do not default to generic cyan/magenta neon.

The surreal beat should remain KFB-specific.

---

## V5 · TRACK ↔ DIRT / OFF-ROAD

Target:

the same route changes from circuit language to a clay dirt track and back without a prefab seam.

Show:
- red/white kerb ending intentionally;
- hard runoff becoming soft shoulder;
- dirt/earth relief beginning as a controlled material/profile beat;
- ditch / berm / rural fence arriving after the driving edge is already readable;
- reverse transition back to hard track.

## V6 · TRACK ↔ RUNOFF / SAND BED

Target:

a classic circuit corner with a readable escape zone.

Show:
- track edge → kerb → grass/asphalt lead-in → gravel/sand bed → outer wall/guardrail/catch fence;
- the sand bed as a lateral runoff treatment, not a second route;
- an entry/exit seam that still reads at chase speed.

Build the runoff shape from the KFB Track Core / World edge truth. Do not import or reskin a Kenney/KayKit sand-road mesh as production geometry.

## V7 · ROAD / TRACK ↔ STUNT PIECE

Target:

normal track becomes ramp, loop, kicker or landing through the same cross-section grammar.

Show:
- normal edge/barrier tapering to the stunt-safe profile;
- ramp/loop edge treatment staying legible upside down or at steep bank;
- landing widening back into normal road/runoff;
- no extra stunt-road shell or cover plate.

## V8 · OPEN ↔ BRIDGE / TUNNEL

Target:

open road becomes elevated or enclosed without changing runtime owner.

Show:
- verge/runoff resolving into parapet/rail on bridge approach;
- open shoulder resolving into tunnel service strip + wall/shell;
- portal, enclosure and exit as a continuous visual sequence;
- S8 tunnel clearance/portal-match truth preserved.

## V9 · ROAD / TRACK ↔ MAG / COSMIC HIGHWAY

Target:

the same Track Core enters a KFB-specific non-ordinary road language.

Show:
- markings and edge family changing at different beats;
- magnet/cosmic safety edge with the same socket geometry;
- no generic neon sci-fi substitute. Cosmic remains `SOURCE_REQUIRED` until an exact donor is pinned.

## V10 · CONNECTOR / ADAPTER ATLAS

Target:

make the plug logic visible as a design system.

Show a compact atlas of:
- OSM street ↔ track;
- track ↔ dirt;
- track ↔ sand/gravel runoff;
- track ↔ loop/ramp;
- road ↔ bridge;
- road ↔ tunnel;
- split/gore/merge;
- width/lane takeover;
- track ↔ mag/cosmic.

For one example, show the exact mathematical socket frame as evidence next to the finished clay transition. The visible connection should feel hand-built, while the port remains exact.

## V11 · PATCH-SCATTER BIOME / SURFACE EDGE CASES

Target:

prove the difficult handoffs without a visible material gradient.

Required probes:
- highway / OSM road → dirt track → desert piste;
- forest / earth → snow;
- normal road → Cosmic Highway → normal road (Cosmic source may remain `SOURCE_REQUIRED`);
- open road / track → long water-crossing context;
- urban/commercial/industrial → country road / tree avenue / clearing;
- open land → canyon/cliff edge with both open and guarded edge variants.

Rules:
- source and target materials exchange through discrete clay patches/clumps/plates whose scale and density change over `s`;
- scatter uses normalized road-space so it survives 14.4 m, 18 m and changing widths;
- edge/biome state is coupled but may lead/lag the material scatter;
- a biome does not automatically require a barrier;
- the road centre-line, sockets, contact surface and route owner never change.

Show entry / mixed / settled states for each selected probe.

# 5 · Preserve driving readability

Every style transition must remain readable from the real Race camera.

Review at chase height:

- road edges;
- hairpin/chicane approach;
- barrier start/end;
- street→track seam;
- split/bypass;
- elevated section;
- water/open edge.

Do not solve visibility by adding generic UI arrows.

---

# 6 · No geometry hacks

Explicitly forbidden:

- separate style track meshes;
- overlay plate to hide a seam;
- host marking cuts;
- per-case barrier mesh edits;
- changing centre-line to fix a visual material issue;
- duplicate road surfaces;
- alpha fade that changes contact truth.

If a style recipe exposes a geometry problem, return it to Web/Track Core as a concrete blocker.

---

# 7 · Deliverable format

Export a complete Session Cut plus:

- `RETURN.md` — known defects first;
- `SOURCE.json`;
- additive `CHANGELOG.md`;
- `TRACK_TRANSITION_STYLE_GRAMMAR.md`;
- `EDGE_RUNOFF_ATLAS.md` — edge/runoff state families and lateral stacks;
- `CONNECTOR_TRANSITION_MATRIX.md` — compatible source/target families, missing-source states and the chosen visual timing;
- `TRANSITION_STYLE_RECIPES.json`;
- before/after source isolation images;
- chase-height transition views;
- overview showing the same base track under multiple style recipes.

Each recipe should reference:

- core profile/edge/marking states;
- KFB material/profile ids;
- prop/environment families;
- timing curves over `s`;
- optional FX refs.

No source-free visual fallback.

---

# Done when

The same proven Track Core can move between distinct KFB environments without looking like stitched prefabs and without changing the route/contact geometry.

A circuit corner can also move through kerb → runoff → sand/gravel → outer containment, and street/race/dirt/stunt/tunnel/cosmic sections can connect through the same socket grammar without bespoke cover geometry.

## Exactly one next gate

**PLAYABLE_TRACK_R0 · Claude Design composition** using the now-proven Track Core plus these visual recipes, after Web prepares the exact input pack.
