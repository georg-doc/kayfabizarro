# KFB ChatterBox / Triplet Curator · START HERE

Status: **PLANNING READY · SITE NOT BUILT**
Date: 2026-10-04
Owner: **KFB ToolBox / ChatterBox content curation**
Repo: `georg-doc/kayfabizarro`
Branch: `planning/chatterbox-triplet-curator-site-2026-10-04`
Base: `coworker/coordination-plan-2026-10-04@422c48e2a82b13c8ae380da70f6c66619639d8aa`

## Outcome

Create one ToolBox specialist Site for curating the shared KFB Semantic Triplet pool.

Working title:

**KFB ChatterBox / Triplet Curator**

This is an **editor/review/control surface**, not a second dialogue runtime.

It must let Georg and normal Web Chat:
- inspect, add, edit, KEEP/TUNE/CUT and approve Triplets;
- view Resident Lean Cards as read-only character clamps;
- map Triplets to Residents by weights/signature refs without creating private phrase banks;
- reference Hypernormalisation quotes by stable quote ID;
- preview one Resident pair + Card/Quote semantic exchange through the existing deterministic Resident Chatter adapter;
- preview content inside the current/incoming speech/thought-bubble presentation owner;
- import/export schema-valid candidate batches for GitHub persistence.

## Existing owners — do not replace

- **ChatterBox** owns speech/content routing.
- **host / mob-ai** owns WHEN / behavior / timing.
- **Resident Chatter adapter** owns knowledge filtering + shared-pool semantic selection only.
- **Resident Atlas** owns actor/set/rig truth.
- **Resident Lean Cards** own character clamps/profile references, not dialogue lines.
- **Journey / Resident Social Memory** owns episodic provenance/memory.
- **Hypernormalisation Curator / Quote Pool** owns quote text, provenance, rights, FrizzleQuestion and deck/card quote mapping.
- **bubble-shaper / bubbles + current Claude Design bubble return** own visible speech/thought-bubble presentation.
- **KFB ToolBox** remains the single front door for specialist tools.

## Current donor truth

### Resident prep
`coworker/coordination-plan-2026-10-04@422c48e2a82b13c8ae380da70f6c66619639d8aa`

`skills/chat/workflows/S1_RESIDENT_PREP_2026-10-04/`

Three regular Lean Cards:
- Goth Girl
- Clown
- Witch

Lorekeeper remains a special Resident role.

### Shared Triplet pool
PR #310 donor:
`chatgpt-web/resident-chat-ensemble-01b-2026-10-01@7c6522fb24774ca5753fe8b5551b920479cc50dd`

Exact data module blob:
`cf975a72637630d97fc626962ef591b356ce0bbf`

The current pool contains exactly **20 AUTHORING_CANDIDATE Triplets**:
- 4 global;
- 4 Lorekeeper;
- 4 Goth Girl;
- 4 Clown;
- 4 Witch.

This packet freezes the exact donor payload as `TRIPLET_POOL_SEED_20.json`.
No item is auto-approved by this planning slice.

### Deterministic semantic kernel
PR #305 donor:
`chatgpt-web/resident-chat-poc-01-2026-10-01@5b595a075b789f683ef0871f8c24d95e96416449`

Result: **29/29 PASS**.

Do not fork that kernel to support the editor. The Site authors data that can be exported into the existing adapter contract.

### Quote bridge
Hypernormalisation owner:
`planning/billboard-quote-hypernorm-curator-2026-10-04@05d61058eaaa8f465b4e2add08cffbf70752fe8f`

Quote schema blob:
`dc986b0eeece6e67d72b67dc1d6ff6de727358db`

The Triplet Curator references quotes by ID. It must not duplicate quote wording, rights, provenance, Brain Food or FrizzleQuestion as canonical data.

### Bubble presentation
Existing source/donor family:
- `bubble-shaper.v3.js`
- `bubbles.v4.js`
- `bubbles.v5.js`
- KFB Ink Canon
- NPC-CARD-SPEC-01 `createBubbles`

A newer speech/thought-bubble design pass is currently being authored via Claude Design. Treat its return as a **presentation donor/adapter update**. It may replace preview styling after source isolation and acceptance, but it may not change Triplet semantics or become a dialogue owner.

## ToolBox routing decision

The current canonical ToolBox manifest already reserves:

`chatterbox-comic-vfx · DESIGN_SITE_PLANNED`

Do **not** add a parallel dialogue specialist Site.

This slice turns that reserved specialist lane into:

**ChatterBox / Triplet Curator · dialogue semantics + comic presentation preview**

The canonical ToolBox router remains:
https://kfb-toolbox.frizzlebob.chatgpt.site

## Persistence model

Follow the proven Hypernormalisation Curator pattern:

**GitHub = authoritative curated data.**

The Site is the review/control surface.

Normal Web Chat can research/author candidate batches and write schema-valid JSON/JSONL to the owner branch. Georg can review the same candidates in the Site.

Routine Triplet population must not require Work.

## First Site scope

1. Pool browser/search/filter.
2. Triplet editor.
3. Resident Lens using Lean Cards read-only.
4. Quote Bridge using stable Hypernormalisation quote IDs.
5. Pair / Scene Lab using the existing deterministic adapter.
6. Bubble Preview using an adapter to the accepted bubble presentation owner.
7. Import / export / diff / validation.
8. Review queue: KEEP / TUNE / CUT / APPROVE.

No live LLM is required for v1.

## Deferred

- runtime autonomous scene scheduling;
- persistent social-memory writes;
- TTS implementation;
- generative dialogue at runtime;
- direct World Studio integration;
- rewriting Bubble geometry;
- copying the Hypernormalisation quote database;
- a second ChatterBox or Resident dialogue engine.

## Publication

Primary product when built: one private GPT Site under the existing ToolBox specialist inventory.

Do not invent its final `.frizzlebob.chatgpt.site` URL before Sites returns it.

Reserved formal Cloudflare review route, only when a public/browser acceptance mirror is actually required:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/triplet-curator/`

No Stage exists yet. No Live promotion.

## Exactly one next gate

**SITES IMPLEMENTATION · KFB CHATTERBOX / TRIPLET CURATOR v1**

Build the editor/control Site from this packet, import the exact 20-item seed, prove one quote-ID bridge and one resident-pair semantic preview, then return it for Georg's editorial use.
