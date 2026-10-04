# RETURN · KFB ChatterBox · planning slice

Date: 2026-10-05
Status: **PLANNING READY · SITE NOT BUILT**
Owner: **KFB ChatterBox / KFB ToolBox**

## What is now prepared

A bounded Site packet now exists for one ToolBox specialist product:

**KFB ChatterBox**

Triplet Curator is one module inside it. KFB ChatterBox now also includes a bounded live Dialogue Lab, Critic/Repair, reaction/choreography testing, real-3D bubble staging and Audio/TTS preview. It is deliberately not a second gameplay dialogue engine.

The design makes:
- ChatterBox the speech/content route;
- the existing Resident Chatter adapter the deterministic semantic selector;
- Resident Lean Cards read-only character clamps;
- Hypernormalisation the quote/provenance/rights owner;
- current/Claude speech-bubble work the presentation owner;
- GitHub the authoritative Triplet persistence layer;
- the Site the editorial review/control surface.

## 2026-10-05 extension · live Resident dialogue laboratory

Binding extension:
`CHATTERBOX_LLM_DIALOG_LAB_EXTENSION_V1.md`

First implementation is deliberately limited to **two Residents** so voice collapse can be measured cleanly.

Comparison ladder:
- deterministic Triplet adapter baseline;
- **L0:** same model, one shared conversation context;
- **L1:** same model, separate Resident contexts/agents;
- **L2:** different model/profile per Resident only if L0/L1 evidence shows a material need.

First acceptance pair:
**Goth Girl ↔ Clown**, same scene seed, 8–12 turns.

The lab also includes:
- free player Triplet replies;
- KayfaBINGO / KayfaBONGO / KayfaBOGGLE / BLÖDSINN interventions;
- second non-speaking LLM Critic;
- non-destructive repair revisions;
- promotion of strong generated Triplets/clusters into the candidate pool;
- durable negative semantic patterns / prompt guardrails;
- What the FLUFF?! / Stay fluffy! and four-call reaction/choreography testing;
- real Resident Atlas 3D actors with EyeRig v6;
- free Orbit camera and responsive bubble-readability/occlusion checks;
- browser TTS;
- reuse of current KFB Audio mixer-owned ducking;
- exportable session logs with prompt/model/mode provenance.

The purpose is to learn whether Resident distinctness requires different base models, or whether separate Resident contexts with the same model already solve the monotony problem.

## Editorial workflow

Georg does not need to review the initial 20 Triplets as a one-off chat dump.

The Site is designed to seed those exact 20 items and let Georg:
- KEEP;
- TUNE;
- CUT;
- approve;
- edit/add;
- link a Hypernormalisation quote by stable ID;
- preview one Resident pair + Card/Quote semantic exchange;
- see it through the current bubble presentation adapter.

Normal Web Chat can populate additional candidate batches without Work.

## Source packet

Repo: `georg-doc/kayfabizarro`

Branch: `planning/chatterbox-triplet-curator-site-2026-10-04`

Base synced:
`coworker/coordination-plan-2026-10-04@b2ddd72346e3d804b53625f50addbba87be3c9a0`

Files:
- `START_HERE.md`
- `SOURCE.json`
- `TRIPLET_POOL_SEED_20.json`
- `TRIPLET_CURATOR_SCHEMA.json`
- `WORK_ONE_SHOT_BRIEF.md`
- `TEST_PLAN.md`
- `TEST_REPORT.md`
- `CHANGELOG.md`
- this `RETURN.md`

## Existing Review Stage donor

The current Coworker branch now already contains a useful review prototype:

- `KFB_TRIPLET_POOL_REVIEW_STAGE_v1.html` · blob `2d4fa60931ae0f1f1815788bb801a5f1e156c1d6`
- `BRIEF_WEBCHAT_TRIPLET_POOL_01.md` · blob `796a1236ab634ebf9385fdc8a070165d2b8a043f`

The GPT Site must reuse this source/workflow first. It already proves the 20-item review flow, pair/Card fixtures, KEEP/CUT/CHANGE, import/export and exposes concrete semantic coverage gaps. The Site extends it with durable persistence, quote bridge, Lean Card lens and Bubble adapter instead of replacing it with generic admin UI.

## Seed

Exact current PR #310 donor:
- 20 Triplets;
- 4 global;
- 4 Lorekeeper;
- 4 Goth Girl;
- 4 Clown;
- 4 Witch.

No Triplet was rewritten or auto-approved in this planning slice.

## Quote bridge

Source owner:
PR #354 / Hypernormalisation Quote Pool.

The Curator stores only stable quote references plus a semantic role:
- SEED;
- COUNTERPOINT;
- REFRAME;
- PROVENANCE_ANCHOR;
- FRIZZLEQUESTION_PROMPT.

Canonical quote text, rights, provenance, Brain Food and FrizzleQuestion remain in the Hypernormalisation owner.

## Claude Design correction · HUMAN FAIL for character presentation

Georg reports that the current Claude Design result **cut out figures instead of using the real 3D models**.

Binding correction:
- cut-out/sprite figures are **REJECTED** as Resident/scene presentation;
- the Site's Pair/Scene/Bubble Lab must use the exact Resident Atlas 3D actors/sets/rigs already source-proven in PR #310;
- do not substitute screenshots, cardboard cutouts, image planes or 2D character stand-ins;
- Claude Design output may still be mined for bubble geometry, VFX, layout or timing only if those parts are shown independently from the rejected character cutouts and are actually reusable;
- no Claude visual return becomes a donor merely because it loaded or looked approximately correct.

## Bubble seam

Existing presentation donors remain external.

The current Claude Design speech/thought-bubble result is intentionally **PENDING**.

When it returns:
1. show the actual source/presentation in isolation;
2. pin the source Return;
3. integrate it through the Bubble Preview adapter if accepted;
4. do not change Triplet semantics or ChatterBox ownership.

The Triplet Curator must still work if the Bubble Preview is temporarily unavailable.

## ToolBox

Do not add a second specialist lane.

The current ToolBox already has:
`chatterbox-comic-vfx · DESIGN_SITE_PLANNED`.

This is the receiving slot for **KFB ChatterBox**.

Canonical ToolBox front door stays:
https://kfb-toolbox.frizzlebob.chatgpt.site

## Validation

Planning/data/donor/Site-readiness validation: **34/34 PASS**.

Runtime/browser/Site tests: **not run by scope**.

## Migration / existing reviews

The Cowork/sidebar review state is not assumed readable cross-origin by the future GPT Site.

Instead, the current stage's existing JSON export becomes the formal import contract:
`kfb.triplet-pool-review/1`.

The Site imports those saved decisions directly:
- keep → GEORG_KEEP
- cut → GEORG_CUT
- change → GEORG_TUNE

So any review Georg performs now in the Cowork sidebar/Dropbox-stage workflow can be carried into the Site without doing it again.

The Dropbox copy of `KFB_TRIPLET_POOL_REVIEW_STAGE_v1.html` was independently found with the same filename and exact byte size (**26,833 bytes**) as the GitHub donor.

## Quote bridge fixture

PR #354 Batch 01 currently provides six real deck-level quote IDs for `forget_utopia` / `ignore_dystopia`.

Important: none is a direct Batch-01 Card match for the three S1 Cards (#11 Standing Ovation, #30 Cortisol Economy, #1 Doomsday Clock). The Site may suggest deck-level quote refs editorially but must not auto-link them.

## Work handoff

Token-light executable handoff:
`WORK_MIN.md`

Machine-readable Site packet:
`SITE_IMPLEMENTATION_PACKET.json`

## Publication state

GPT Site: **NOT BUILT**.

Final Site URL: **not invented**.

Reserved formal Stage, only if later required:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/chatterbox/`

Stage: **NOT DEPLOYED**.

No merge. No Live promotion.

## Exactly one next gate

**SITES IMPLEMENTATION · KFB ChatterBox v1**

A Sites-capable executor builds exactly one private specialist Site, imports the 20-item seed, proves one real quote-ID bridge, deterministic pair/SILENCE, L0-vs-L1 two-Resident live dialogue, Critic/Repair, player four-call interaction, real-3D bubble/orbit behavior and browser-TTS/Audio-ducking reuse, then returns KFB ChatterBox to Georg for PASS / TUNE / FAIL.
