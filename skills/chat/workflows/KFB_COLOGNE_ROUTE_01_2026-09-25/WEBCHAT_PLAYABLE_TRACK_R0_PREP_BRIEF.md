# WEB-PREP-TRACK-R0 · Fresh Web Chat briefing · 2026-09-26

**Executor:** ChatGPT Web + GitHub  
**Execution role:** source recovery, integration planning, input-pack preparation, later rehome/test  
**Owner changed:** none  
**Runtime owner:** `georg-doc/KFB-Stunt-Car-Race`  
**Outcome:** a closed, exact-source input pack for Claude Design to assemble `PLAYABLE_TRACK_R0`

> Do not implement a second Race runtime. Do not model the missing Blender pieces. Do not start the full Köln OSM route in this slice.

## Start here

Read current GitHub versions completely:

1. `georg-doc/kayfabizarro/skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/chat/workflows/KFB_COLOGNE_ROUTE_01_2026-09-25/START_HERE.md`
5. `.../TRACK_TO_OSM_EXECUTION_LADDER_2026-09-26.md`
6. `.../EVIDENCE_AND_GAP_MATRIX.md`
7. current `georg-doc/KFB-Stunt-Car-Race/main` → `WSA_START.md`, `RECOVERY.md`
8. current Race PRs/branches relevant to RKIT, including the newest Blender MCP output.

GitHub state overrides this brief when newer facts conflict.

## Current known state

At brief-writing time:

- Race main observed: `3ef3ebec6975736edb6ec8d5dabebc4ee5b51402`;
- visible RKIT branches ended at `chat/rkit-08-09-stunts-2026-09-25`;
- Georg reports Blender MCP is currently building the missing connector/offset pieces;
- no GitHub-visible `rkit-10` branch was found yet.

Therefore **the first job is to recover the MCP output**, not to recreate it from this brief.

If the MCP output is still not on GitHub:
- record `MCP_OUTPUT_NOT_YET_VISIBLE`;
- prepare all source/runtime/recipe work that does not require guessing its files;
- do not invent replacements;
- leave the missing module refs unresolved for Claude.

## Five-line bounded slice

**Goal:** prepare exact sources + one playable closed-loop recipe for Claude Design.  
**Owner:** KFB-Stunt-Car-Race.  
**Source:** current Race runtime + actual current RKIT/MCP branches.  
**Protected boundary:** no new physics/controller/world/editor owner; no Blender modeling.  
**Done when:** Claude receives one closed input pack with runtime pin, module pins, recipe, OSM seam contract and donor evidence.

---

# 1 · Recover and pin the playable Race baseline

Read current Race history narrowly enough to answer:

- Which exact runtime owns the accepted current driving feel?
- Which exact runtime can actually use geometry contact for ramps/elevation?
- Which current movement/contact path is safe to reuse?
- Which current player-facing host can boot without a test-dashboard dependency?

Do not choose from chat memory.

Create:

`RUNTIME_BASE.json`

Minimum fields:

```json
{
  "repo": "georg-doc/KFB-Stunt-Car-Race",
  "branch": "...",
  "head": "...",
  "entry": "...",
  "movementOwner": "...",
  "contactOwner": "...",
  "cameraOwner": "...",
  "recoveryOwner": "...",
  "knownAcceptedFeelRef": "...",
  "protectedFiles": []
}
```

Binding selection rules:

- preserve the accepted movement/feel owner;
- preserve one contact owner;
- preserve one camera owner;
- use geometry-capable contact for the track;
- do not revive a route-relative path that still cannot launch from ramps;
- do not tune physics in this prep slice.

---

# 2 · Recover the actual RKIT/MCP source set

Inspect the current branches, not just PR prose.

For every module intended for R0, record:

- exact repo;
- branch/head;
- file path;
- source script / blend provenance if available;
- GLB path;
- recipe/compiler compatibility;
- dimensions / connector frame;
- status: source-proven / geometry-tested / runtime-tested / human-accepted.

Create:

`MODULE_CATALOG.json`

Required roles:

1. base swept track profile;
2. width/profile logic;
3. curve/bank ease;
4. S-offset/chicane;
5. hairpin / serpentine;
6. city-street profile;
7. street↔track adapter;
8. grade/crest/dip/bridge approach;
9. switch / safe bypass;
10. optional `LOOP_REAL`;
11. supports/arches/structure.

If Blender MCP delivers several alternatives, choose the smallest set that can build R0. Do not put every experiment into Claude.

## Mandatory visual donor evidence

Before integrated composition, provide isolated evidence for the actual source objects Claude must use.

At minimum:

- track surface/profile;
- city street;
- S/chicane;
- hairpin;
- grade/bridge;
- street↔track adapter;
- LOOP_REAL if included.

Loaded bytes are not enough.

---

# 3 · Author PLAYABLE_TRACK_R0

Create:

`PLAYABLE_TRACK_R0.recipe.json`

This is a **new route recipe**, not a copy of TRACK_A.

Design target:

- closed loop;
- roughly 1.2–2.0 km unless exact current modules require another envelope;
- approximately 2–4 minutes per relaxed lap at current Race speeds;
- one obvious start/finish;
- ordinary route remains fully playable if all optional stunts are bypassed;
- no mandatory high-difficulty jump to finish the lap.

Recommended topology:

```text
START / WIDE STRAIGHT
→ FLOWING CURVE
→ OFFSET_S
→ CHICANE
→ DRIFT HAIRPIN / BOWL
→ GRADE UP
→ SHORT ELEVATED / OVERPASS
→ OPTIONAL LOOP_REAL BRANCH
   ├─ stunt lane
   └─ SAFE BYPASS
→ DESCENT
→ WIDE SWEEPER
→ TRACK_TO_STREET
→ CITY_STREET SEGMENT
→ STREET_TO_TRACK
→ FINAL FLOWING CURVE
→ START
```

The exact plan may change to fit proven modules, but preserve these learning beats:

- flow;
- rapid left/right transition;
- tight drift corner;
- elevation;
- optional stunt + bypass;
- ordinary street-profile seam;
- return.

## Drift intent

The hairpin/chicane is the future Tokyo-Drift mechanics fixture.

Geometry should support later profiles:

- `CHILL_SHOW`
- `DRIVE`

But this prep slice does not retune drift physics.

---

# 4 · Plan OSM now without building it yet

Create:

`OSM_SEAM_CONTRACT.md`

This prevents R0 becoming a dead-end custom track.

Binding rules:

### Same route schema

Both R0 and Köln Route 01 use the same semantic section model:

- centre line / frames;
- surfaceProfile;
- edgeProfile;
- structureProfile;
- stunt/module socket;
- provenance/source;
- KFB deviation allowance.

### Same metre frame

OSM sections and RKIT sections must enter the same local metre transform contract.

### Existing donors to reuse

Explicitly inspect and cite:

- RKIT-06 real OSM Trankgasse;
- Race PR #12 Hürth→Ehrenfeld continuous OSM corridor / receiver pattern;
- current Hürth OSM/WorldBuilder sources.

Do not create a second route/city import path.

### Transition contract

The OSM seam must allow:

```text
OSM CITY_STREET
→ STREET_TO_TRACK
→ RKIT/stunt geometry
→ TRACK_TO_STREET
→ OSM CITY_STREET
```

without changing player/controller ownership.

---

# 5 · Prepare Claude's exact input

Create one folder/package, e.g.

`_handover/PLAYABLE_TRACK_R0_CLAUDE_INPUT_2026-09-26/`

Include:

- `START_HERE.md`
- `CLAUDE_INPUT.md`
- `RUNTIME_BASE.json`
- `MODULE_CATALOG.json`
- `PLAYABLE_TRACK_R0.recipe.json`
- `OSM_SEAM_CONTRACT.md`
- `SOURCE.json`
- donor screenshots/renders;
- known defects / unavailable sources;
- exact tests inherited from sources, attributed to their original slices.

`CLAUDE_INPUT.md` must point to the canonical briefing:

`skills/chat/workflows/KFB_COLOGNE_ROUTE_01_2026-09-25/CLAUDE_DESIGN_PLAYABLE_TRACK_R0_BRIEF.md`

Do not paste old whole project histories into the input pack.

---

# 6 · Player-facing constraints for Claude

Record these in the pack:

- boot directly into the playable track;
- no giant test palette;
- no selector wall;
- no generic debug dashboard;
- diagnostics may live behind a query flag or developer key;
- reuse the actual current vehicle/player-facing presentation;
- no fabricated KFB branding;
- no placeholder track geometry;
- no replacement HUD unless the current runtime already owns it.

---

# 7 · Prep checks

This slice does not need to drive the final track, but it must verify:

- every referenced file exists at the exact pin;
- recipe parses;
- all required module refs resolve or are explicitly `SOURCE_REQUIRED`;
- connector/frame conventions are recorded;
- no duplicate movement/contact/camera owner is planned;
- OSM seam contract uses the same route schema.

Report actual counts.

---

# 8 · Do not do

- no Claude-style visual rebuild inside Web prep;
- no new Blender geometry;
- no whole Köln OSM capture;
- no physics tuning;
- no track editor UI;
- no seeded generator implementation;
- no Stage deployment before there is a playable candidate;
- no auto-merge.

---

# Done when

Claude can start with **zero architectural guesses**.

Return:

- repo/branch/PR/head;
- exact files;
- source-proof images;
- prep check counts;
- unresolved module refs;
- one next gate.

## Exactly one next gate

**CLAUDE DESIGN · PLAYABLE-TRACK-R0** using the prepared input pack.
