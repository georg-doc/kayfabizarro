# RECOVERY · KFB Town Resident Social Memory + AIDA · 2026-09-28

Status: **CRASH-SAFE CHECKPOINT · DESIGN SLICE · NOT RUNTIME IMPLEMENTATION**

Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/town-resident-social-memory-2026-09-28`  
Verified branch head after timeout: `3075ed044b27a32e0f68a6cd0ad33626bbcd96a4`

## What the timeout affected

The GitHub write that extended the resident design with **Points of Interest, routine activities, personal goals/motivations and the KFB AIDA gameplay loop** returned no visible completion response in chat.

Per KFB timeout policy it was treated as **UNKNOWN**.

Recovery inspection proved the write **did land**:
- exact branch head: `3075ed044b27a32e0f68a6cd0ad33626bbcd96a4`;
- `skills/chat/town/references/KFB_RESIDENT_SOCIAL_MEMORY_AI_TOWN_2026-09-28.md` blob: `55e53537265cf4e908ff04b45f90fee8da3cb049`;
- sections `17 · Points of Interest` through `25 · Updated first productive implementation later` are present;
- both `## 17 · Points of Interest are the perception surface` and `## 21 · KFB AIDA gameplay loop` were read back from GitHub.

Do **not** retry that write.

## Current design stack

```text
world / encounter truth
→ bounded perception / POI candidates
→ Attention
→ Curiosity / Interest
→ Expectation
→ Interaction
→ Reaction
→ interpret / Lean Memory / social-thread update
→ return / resume / retarget
```

Language/performance seam:

```text
ChatterBox / semantic Triplet / selectable retort
→ optional context-valid Fluff-o-lect
→ Reaction Choreography
→ source-backed animation / body / face / ears / mouth / Emanata
→ consumer-owned recovery
```

## New post-timeout content now safely persisted

### POIs

POI classes include:
- player;
- Resident / NPC;
- Cube Pet;
- plants / trees / natural objects;
- landmarks / buildings / environment features;
- resource nodes;
- loose props;
- Cards / MediaSurfaces;
- activity stations;
- vehicles;
- temporary social events;
- hazards/obstructions.

POI is a **query/view layer over current world objects**, not a second Asset Registry or world database.

### Sight / range / search

Four tiers:
1. immediate contact / near field;
2. visible attention field;
3. deliberate local semantic search;
4. remembered/reported target that must be revalidated on arrival.

No whole-world scan per frame.

### Routine activities

Existing source-backed candidates include:
- Hammer/Hammering;
- Chop/Chopping;
- Dig/Digging;
- Pickaxe/Pickaxing;
- Saw/Sawing;
- Fishing_*;
- Work_A/B/C / Working_A/B/C.

Existing Overworld direction already includes:
- fishing;
- mining gold/ore;
- chopping wood;
- transporting/using resources;
- faction-specific routines.

Georg's additive direction adds:
- patrol;
- explore;
- inspect;
- gather/collect;
- carry/deliver;
- tend/care;
- rehearse/play music;
- rest/socialize;
- return-home / return-to-post.

### Personal goals / motivations

Stable motivations may include protection/duty, making/repair, gather/trade, perform, help, investigate/curiosity, explore, patrol, socialize, collect Cards/objects, preserve a place/resource.

Concrete current goals can compete. Goal conflict is the conflict motor but does **not** automatically imply hostility or Combat.

### KFB AIDA loop

For both player and NPC:

```text
ATTENTION
→ CURIOSITY / INTEREST
→ EXPECTATION
→ INTERACTION
→ REACTION
→ INTERPRET / REMEMBER / UPDATE THREAD
→ RETURN / RESUME / RETARGET
```

This is Georg's current KFB gameplay definition for this slice, not the classic marketing acronym.

## Sources already pinned before timeout

- `georg-doc/ai-town@2693ed6973e3461204385c9d11fb3aca4e8e3a7a`
- current Town Living;
- ChatterBox/Tourbus reuse;
- Fluff-o-lect source;
- Brick Fish PR #254;
- Reaction Choreography PR #256.

## Newly verified source donors to add to SOURCE/TEST metadata

1. `tools/KFB-ToolBox/_handover/RESIDENT_SCENE_MODULES_WSA_2026-09-19/BACKLOG.md`
   - blob `38323ce5a72c479ca5017d3daa1aa0508494c7ba`
   - source-backed Resident Activity candidates.

2. `overworld/docs/LIVING_CONCEPT_overworld.md`
   - blob `8f9e3c70c5046ce7b0e63698d500129a27975207`
   - established resource/faction routines and interruptible living-world activities.

Patrol/explore and the AIDA sequence are Georg's current additive direction; do not mislabel them as facts from those older sources.

## Existing evidence before AIDA extension

- source reads: **11/11 PASS**
- SOURCE.json parse: **1/1 PASS**
- design invariants: **12/12 PASS**
- runtime/browser/Stage: **0** by design

These counts must be updated additively after the two new donor pins are entered.

## Reserved future Stage route

`https://kayfabizarro.pages.dev/kfb-hub/stage/town/resident-social-memory-01/`

Status: **NOT DEPLOYED**.

No standalone proxy review page.

## One next implementation gate

**RESIDENT-SOCIAL-MEMORY-01**

The first real integrated proof should now include:
- two real Residents;
- one source-backed routine activity + clean interruption/resume;
- bounded sight/range POI candidate set;
- one motivation-backed attention choice;
- one expectation;
- one interaction;
- Reaction Choreography;
- optional ChatterBox/Triplet;
- one context-valid Fluff-o-lect variant;
- witness-specific Lean Memory only if the result matters;
- one bounded social thread;
- return to routine/path/dialogue or retarget to a new goal.

## Continue from here

1. Update `SOURCE.json` with the two newly verified routine/Overworld donor pins.
2. Update `TEST_REPORT.md` with new AIDA/POI/routine invariants and actual counts.
3. Update Town Session/Router/Changelog/Hub metadata to mention POI + AIDA + routines.
4. Write `RETURN.md`.
5. Open/update a Draft PR.
6. Read back exact final branch head and intended files.
7. Do not deploy Stage or promote Live in this design-only slice.


## Execution lane clarification · Web-first, WSA/Work escalation only

Current binding process from `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/START_HERE.md`:

- **ChatGPT Web/GitHub is the default KFB production lane** for recovery, planning, architecture, repository implementation, tests/CI, donor extraction, debugging, bounded repair, Return/changelog/Hub metadata and fresh-chat handoffs.
- **Claude Design** is the visual-authoring specialist when needed.
- **Work / WSA is escalation-only**, only when a concrete capability is unavailable or impractical in Web/GitHub/Claude, such as private/local binary movement, exact simultaneous local multi-repo checkout, OS/browser automation, a hard local cross-repo runtime seam or final packaging that cannot be done through GitHub.
- If there is no concrete missing capability, **do not use Work**.

The later `PRODUCTIVE_REVIEW_GATE_POLICY.md` further qualifies the older HTML-review-first wording:
- do not manufacture a zero-install/Stage review artifact merely because a slice ended;
- prefer implementation and evaluation in the **real WorldBuilder / ToolBox / Resident / Travel / Combat owner surface**;
- technical evidence stays internal unless Georg has a concrete product decision to make.

Application to this slice:
- continue Resident Social Memory / POI / Routine / AIDA design and repository work in **ChatGPT Web + GitHub**;
- do **not** wait for WSA/Work;
- do **not** create a standalone review HTML or Stage page for this design contract;
- escalate to Work only later if the real integrated RESIDENT-SOCIAL-MEMORY-01 hits an actual Web capability gap.


## Fresh-chat shorthand

Use:

> **KFB WEB PUSH/READ — Town Resident Social Memory — recover + continue**

This invokes the repository-documented shortcut in `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`: recover current GitHub truth, keep the existing owner/branch, continue Web/GitHub-first, persist before long chat prose, read back every write, treat timeouts as UNKNOWN, and avoid Work/WSA or human review surfaces unless a concrete capability/decision requires them.


## Additive recovery checkpoint · Officer Doppel-Denk · 2026-09-28

Latest verified design checkpoint before this Recovery write: `0a36500fbb16835ea9b2b3bc9dc79cbba721b3ba`.

New durable profile:
`OFFICER_DOPPEL_DENK_RESIDENT_PROFILE_2026-09-28.md`

Working name: **Officer Doppel-Denk**. Technical source remains `toy-soldier`.

Source/evidence updates:
- source manifest now contains **15** entries, adding current Resident Atlas Toy Soldier and Motion Registry pins;
- general design checks remain **20/20 PASS**;
- Officer-specific source/profile checks: **6/6 PASS**;
- no runtime/browser/Stage test is claimed.

Recovered continuation state:
```text
closed present
→ existing one-time reveal
→ Officer emerges
→ rifle march/patrol
→ resident-specific order/disorder POI scan
→ inspect/admonish/interact
→ ChatterBox/Triplet + Reaction Choreography as needed
→ Lean Memory only if socially meaningful
→ resume patrol
```

First POI examples: Brick Fish exchange, Tiny Treats pizza slice, plant/path obstruction.

Open animation seam updated: Georg identified Mixamo **`Walk with Briefcase`** as the priority external donor because its right arm already carries a load while the left arm keeps a normal walk swing. It is **USER-IDENTIFIED / NOT YET ADMITTED / NOT PINNED**. Preferred intake is In Place → existing Motion Library → retarget to `Rig_Medium` → exact Toy Soldier rifle at `handslot.r` → small right-arm/attachment fit only if needed. World/navigation remains translation owner. `Running_HoldingRifle` and `Walking_A/B` remain A/B/fallback candidates.

The single next gate remains **RESIDENT-SOCIAL-MEMORY-01**; Officer Doppel-Denk is the preferred first character-specific overlay inside that integrated proof, not a separate runtime or proxy Stage.


## Additive recovery checkpoint · Resident Dance Culture · 2026-09-28

Latest verified design checkpoint before this Recovery write: `72a403fbc9d6c836f8e093389e1ebfbdde38d819`.

New durable design:
`RESIDENT_DANCE_CULTURE_2026-09-28.md`.

Source stack expanded to **20** pinned entries with:
- Motion Library v2b dance catalogue (**24 dance entries**, Rig_Medium + Rig_Large);
- Resident Disco shared transport and pairing candidates;
- Orc Band real beat clock + accepted Legacy Orc B `orb.bounce`;
- Player Meta STRAND M progression ownership;
- versioned Journey save/export/import donor.

Recovered design state:
```text
music POI/event
→ Resident enters Common Bounce
→ shared song transport keeps group coherent
→ resident-specific Signature Move inserts on phrase boundary
→ return to Common Bounce
→ optional Brick Fish / social reaction interruption
→ re-enter groove on legal beat/bar
```

Player collection state:
```text
UNKNOWN
→ DISCOVERED (observe / join / teach context)
→ LEARNED / PERFORMABLE
```

Persistence owner: **Player Journey / Meta**. Preserve teacher Resident, source event and learning method. Learned dance moves do not consume Backpack slots.

Compatibility rule: collected move identity is semantic. Rig_Medium/Rig_Large use compatible Motion Library mappings; Legacy/CubePet/non-humanoid families use their own owner-specific adapters or remain temporarily unperformable without losing the unlock.

First authoring route: existing Animation Studio / Motion Library should define Common Bounce and resident Signature mappings/motion slices; do not create a second Dance runtime.

Evidence: **20/20 source reads · 20/20 general design invariants · 6/6 Officer checks · 12/12 Dance Culture checks PASS**. Runtime/browser/Stage remain 0.

The single next integrated gate remains **RESIDENT-SOCIAL-MEMORY-01**, now expected to consume the Dance Culture layer when the first Animation Studio mappings are available; no separate proxy Dance Stage is required.
