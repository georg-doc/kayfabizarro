# WORK ONE-SHOT · KFB ChatterBox / Triplet Curator Site v1

Status: **READY FOR SITES-CAPABLE IMPLEMENTATION**
Date: 2026-10-04
Execution mode: **ONE_SHOT**
Owner: **KFB ToolBox / ChatterBox content curation**
Repo: `georg-doc/kayfabizarro`
Planning branch: `planning/chatterbox-triplet-curator-site-2026-10-04`
Primary product: **one private GPT Site**
Reserved formal Stage: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/triplet-curator/`
Live promotion: **NOT AUTHORIZED**

## Mission

Build the already-reserved ToolBox `chatterbox-comic-vfx` specialist lane as one coherent editor:

**KFB ChatterBox / Triplet Curator**

The Site must make the shared Semantic Triplet pool easy to curate by Georg and easy to populate in batches from normal Web Chat while preserving all existing runtime owners.

This is the content-authoring counterpart to the Hypernormalisation Curator pattern.

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. this folder's `START_HERE.md`
5. `SOURCE.json`
6. `TRIPLET_CURATOR_SCHEMA.json`
7. `TRIPLET_POOL_SEED_20.json`
8. `skills/chat/workflows/S1_RESIDENT_PREP_2026-10-04/resident-lean-card.v0.2.schema.json`
9. PR #305 Resident Chatter kernel Return/tests
10. PR #310 Resident ensemble data module
11. PR #354 Hypernormalisation `QUOTE_POOL_SCHEMA.json` + current quote batches
12. current ToolBox manifest from surface-consolidation branch
13. current Claude Design speech/thought-bubble Return when it exists

GitHub state at execution time wins.

## Owner firewall

Do not create:
- a second ChatterBox;
- a second dialogue scheduler;
- a second Resident memory owner;
- a second Quote Pool;
- a second Card/deck registry;
- a new Bubble geometry owner;
- a new ToolBox front door.

The Site is an **authoring and preview client** around existing owners.

## Product layout

### A · Pool

Default screen.

Show all Triplets in a compact searchable table/card grid:
- Triplet ID;
- subject / connector / reframe;
- review state;
- relation;
- tags;
- signature Residents;
- linked quotes count;
- linked Cards count;
- source/provenance.

Filters:
- review status;
- Resident;
- relation;
- tag;
- global/signature;
- has quote / no quote;
- deck / Card;
- source status.

Current 20 donor Triplets load as **DONOR_UNREVIEWED**, never as approved.

### B · Triplet Inspector / Editor

Edit only authoring data.

Core runtime-compatible fields:
- subject;
- connector;
- reframe;
- relation;
- tags;
- signatureOf;
- Fluff-o-lect authored target/variant where present.

Review:
- KEEP;
- TUNE;
- CUT;
- APPROVE runtime;
- archive;
- note.

Do not permit free-form dialogue paragraphs masquerading as Triplets.

### C · Resident Lens

Load the current Resident Lean Cards **read-only**.

Show:
- clamp;
- method;
- coreWant;
- coreIrritation;
- contradiction;
- failureLoop;
- fears;
- speechAvoid;
- relation/transform biases;
- signature Triplet refs;
- preferred operators;
- deck lane.

The Site may propose mappings/weights but must not silently rewrite character clamps.

### D · Quote Bridge

Read the current Hypernormalisation Quote Pool owner.

Search/filter by:
- quote ID;
- author;
- themes;
- deck;
- Card;
- status;
- rights/provenance.

When linking a quote to a Triplet, persist only:
- stable `quoteId`;
- role: SEED / COUNTERPOINT / REFRAME / PROVENANCE_ANCHOR / FRIZZLEQUESTION_PROMPT;
- optional curator note.

Do **not** copy quote text, rights, source URL, Brain Food or FrizzleQuestion into the Triplet record as canonical data.

If quote status/rights do not allow runtime/public use, the bridge must visibly mark that. It may still be an editorial reference.

### E · Pair / Scene Lab

Inputs:
- Resident A;
- Resident B;
- canonical Card ref;
- optional linked quote;
- social operator;
- deterministic RNG seed;
- optional Affect;
- recent Triplet history.

Run the existing PR #305 deterministic adapter contract.

Output:
- chosen Triplet ID;
- speaker/addressee;
- TURN or SILENCE;
- semantic relation/transform;
- provenance;
- presentation hints.

No live LLM is required for v1.

Use A/B/C S1 pair candidates as first fixtures:
- Goth Girl × Clown × Standing Ovation;
- Witch × Clown × Cortisol Economy;
- Goth Girl × Witch × Doomsday Clock.

### F · Bubble Preview

This tab proves presentation compatibility; it does not author bubble geometry.

Required adapter behavior:
1. load the accepted current bubble owner in isolation;
2. render the selected deterministic Triplet as a visible speech/thought bubble;
3. support responsive text layout and overflow warning;
4. show timing/presentation hints separately from semantics;
5. when Claude Design's current bubble package returns and is accepted, mount it through the same preview adapter.

The Triplet Site must remain functional if the bubble preview adapter is temporarily unavailable.

### G · Import / Export / Diff

Support:
- import exact seed;
- import Web Chat candidate JSON/JSONL;
- schema validation;
- duplicate-ID detection;
- diff against last GitHub-backed revision;
- export only selected review states;
- export runtime-compatible pool;
- export full authoring wrapper.

No Site-local data is silently authoritative.

## Normal Web Chat authoring loop

Routine content work must not need Work:

`request/theme/resident/card/quote context → Web Chat proposes Triplets → schema validation → GitHub candidate batch → Site review → Georg KEEP/TUNE/CUT → GitHub curated state`

Web Chat should generate in small batches and cite exact source/card/quote refs.

The Site is for editing/review, not for requiring Georg to type every record by hand.

## Initial fixture

Import all exact 20 donor Triplets.

For the first visible semantic demo use:

**Goth Girl × Clown × Forget Utopia #11 · The Standing Ovation**

Use linked Hypernormalisation quote material only if an actual quote ID exists and passes the bridge rules. Do not invent a quote ID merely to fill the demo.

## Bubble donor rule

Before integrating the current Claude Design result:
- show its actual source object/presentation in isolation;
- record exact source/return;
- compare against existing bubble owner;
- integrate only if it is the current accepted presentation path.

A loaded asset or screenshot alone is not proof that the intended donor implementation is active.

## Data tests

At minimum:
- seed contains exactly 20 unique Triplets;
- relation enum remains the current five values;
- no private Resident phrase pools;
- all approved runtime entries have subject/connector/reframe;
- no duplicate Triplet IDs;
- quote refs resolve to existing quote IDs or are explicitly unresolved editorial candidates;
- no canonical quote text is duplicated into the Triplet pool;
- Lean Cards remain read-only;
- import → edit → export → reload roundtrip preserves reviewed data;
- runtime export remains consumable by the existing adapter without changing its owner contract.

## Browser/Site tests

At minimum:
- desktop;
- narrow/mobile;
- 20 seed items visible;
- filter/search;
- KEEP/TUNE/CUT;
- edit one Triplet;
- quote-ID link/unlink;
- pair preview;
- SILENCE case;
- bubble preview;
- import/export roundtrip;
- zero page errors.

## Publication

Use GPT Site first.

If an existing productive Site for this reserved specialist lane is discovered, update it. Do not create a duplicate.

If no Site exists, create exactly one.

Persist exact:
- project ID;
- version ID;
- deployment ID;
- Site URL;
- source commit.

Update the **existing** ToolBox specialist entry `chatterbox-comic-vfx`; do not add a competing entry.

Only if a formal public/browser milestone is required after the private Site works, publish the bounded mirror to:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/triplet-curator/`

and link it from the KFB Hub in the same publication batch.

## Return

Return:
- repo / branch / PR / exact head;
- changed files;
- exact Site project/version/deployment/URL;
- actual test counts;
- seed count and review-state counts;
- quote bridge proof;
- Resident pair proof;
- Bubble source-isolation + integrated preview proof;
- screenshots;
- unresolved items;
- exactly one next gate.

No auto-merge. No Live promotion.

## Exactly one human gate

Georg opens the Triplet Curator and can, without GitHub editing:
1. review the 20 donor Triplets;
2. KEEP/TUNE/CUT them;
3. edit/add a Triplet;
4. link a real Hypernormalisation quote by ID;
5. preview the result through one Resident pair and current bubble presentation.

Return **PASS / TUNE / FAIL** on the editor as an editorial tool.
