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

Before designing combinations, show exact pinned source donors in isolation for:

- CITY_STREET / road surface;
- current RKIT track surface;
- KFB marking styles;
- verified barrier/edge sources;
- verified fence/guardrail source if one exists;
- KFB terrain/ground style;
- current sky/environment profiles relevant to the proof;
- any verified Cosmic/Surreal donor actually approved for KFB.

If a visible source does not exist, mark `SOURCE_REQUIRED`.

Do not manufacture generic racing/futuristic assets as substitutes.

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

- none;
- curb;
- low/high barrier;
- fence socket;
- wall;
- terrain/water edge.

Design the visible choreography of how one yields to another.

## Material/look

Blend references/tokens, not arbitrary new materials.

Use KFB palette/material owners.

## Props/environment

Density / family transitions may lag or lead the road transition:

- lamps;
- signs;
- fences;
- vegetation;
- industrial props;
- surreal props.

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

## Exactly one next gate

**PLAYABLE_TRACK_R0 · Claude Design composition** using the now-proven Track Core plus these visual recipes, after Web prepares the exact input pack.
