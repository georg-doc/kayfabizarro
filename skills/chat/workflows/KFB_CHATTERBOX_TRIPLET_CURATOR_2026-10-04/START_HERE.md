# KFB ChatterBox · START HERE

Status: **PLANNING READY · SITE NOT BUILT**
Date: 2026-10-04
Owner: **KFB ChatterBox / KFB ToolBox**
Repo: `georg-doc/kayfabizarro`
Branch: `planning/chatterbox-triplet-curator-site-2026-10-04`
Base synced: `coworker/coordination-plan-2026-10-04@b2ddd72346e3d804b53625f50addbba87be3c9a0`

## Outcome

Create one ToolBox specialist Site under the umbrella product name:

**KFB ChatterBox**

Triplet Curator is one module inside ChatterBox, not a separate product. ChatterBox combines deterministic Triplet curation with a bounded live Dialogue Lab, Critic/Repair, reaction choreography, real-3D bubble preview and Audio/TTS testing. It remains an **authoring/evaluation surface**, not a second dialogue runtime.

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

### Existing Triplet Review Stage · REUSE DONOR

Current Coworker coordination head:
`coworker/coordination-plan-2026-10-04@b2ddd72346e3d804b53625f50addbba87be3c9a0`

Reuse:
- `skills/chat/workflows/S1_RESIDENT_PREP_2026-10-04/KFB_TRIPLET_POOL_REVIEW_STAGE_v1.html`
- `skills/chat/workflows/S1_RESIDENT_PREP_2026-10-04/BRIEF_WEBCHAT_TRIPLET_POOL_01.md`

The existing review stage already provides:
- the 20 candidate Triplets;
- pair A/B/C;
- current Card fixtures;
- KEEP / CUT / CHANGE review;
- import/export;
- a simplified port of the #305 selection logic;
- explicit current coverage-gap evidence.

**Do not rebuild this from generic UI chrome.** Show/use this source object first, then grow it into the Site.

The Site adds durable owner-safe capabilities around it:
- schema-backed persistence;
- quote-ID bridge;
- Lean Card lens;
- exact existing adapter seam;
- accepted bubble presentation adapter;
- Web Chat batch intake.

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
2. Triplet editor / curator.
3. Resident Lens using Lean Cards read-only.
4. Quote Bridge using stable Hypernormalisation quote IDs.
5. Pair / Scene Lab using the existing deterministic adapter.
6. **Two-Resident Dialogue Lab** with live LLM generation and session logging.
7. **Critic / Repair Lab** as a second non-speaking evaluation agent.
8. Reaction / choreography testing for KayfaBINGO/BONGO/BOGGLE/BLÖDSINN, What the FLUFF?!, Stay fluffy! and compatible facial/body responses.
9. Bubble Preview on exact Resident Atlas 3D actors with EyeRig v6, responsive camera/orbit tests and streaming text.
10. Browser TTS + current Audio-owner ducking seam.
11. Import / export / diff / validation.
12. Review queue: KEEP / TUNE / CUT / APPROVE / PROMOTE_TO_POOL.

Binding extension brief:
`CHATTERBOX_LLM_DIALOG_LAB_EXTENSION_V1.md`

First live comparison starts with two Residents and tests L0 shared-agent vs L1 isolated same-model Resident agents before any L2 multi-model-per-character complexity.

## Deferred

- runtime autonomous scene scheduling;
- persistent social-memory writes;
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
