# KFB Mobile Preview + ChatterBox / Legacy Web Pet · START HERE

**Date:** 2026-09-21  
**Status:** PLANNING / LIVING CHAT SLICE · NO NEW RUNTIME OWNER  
**Owner:** KFB ToolBox / Legacy Web Pet presentation adapter  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/mobile-preview-chatterbox-legacy-pet-2026-09-21`  
**Stacked on:** Draft PR #157 / `chatgpt-web/legacy-web-pet-v0-2026-09-21` at `4e26e04ab1e95e6e36001ebb14ce66be95d91570`  
**Authoritative tested Legacy Web Pet runtime:** `f41c59a8178bf77266c0f776f2e20a7948ee6223`

## Goal

Use this chat as the persistent KFB **mobile preview / rendering / ideation lane** for the existing Legacy Web Pet and its reusable rigs.

The lane may later host bounded Stage experiments for:
- real mobile viewport presentation;
- touch interaction;
- Legacy actor / rig visual checks;
- ChatterBox presentation;
- existing phrase / semantic-triplet donors;
- deterministic preview fixtures useful to the Chrome-extension and Hub host.

This lane does **not** create a second pet runtime, a second rig owner, a second dialogue engine or a replacement KFB Hub.

## Current source truth

Legacy Web Pet v0:
- Draft PR #157;
- Web/Hub candidate: **15/15 static + 12/12 WebGL PASS** at tested runtime head `f41c59a...`;
- MV3 build: PASS;
- arbitrary-page extension injection: frozen after two failed ready-gates;
- current exact next extension gate remains **LWP-EXT-F1 · extension-load observability**.

Current PR #157 source/docs head:
`4e26e04ab1e95e6e36001ebb14ce66be95d91570`.

Current main observed during slice start:
`ce514192d2647a8e4882a7f3f010665a4a3964e7`.

PR #157 is currently diverged from main; do not silently rebase or rewrite it from this ideation lane.

## ChatterBox donors

Reuse existing sources; do not invent a replacement grammar.

Primary located donors:
- `overworld/overworld/chatter-phrases.js` — static faction phrase pools + `SYNTHESE` + activity thoughts;
- `overworld/overworld/chatter-2d.js` — existing source-selection / chatter runtime;
- `overworld/overworld-v13_2026-08-12/overworld-v13/bubble-layout.js` — text-derived measured bubble layout;
- `overworld/overworld-v13_2026-08-12/overworld-v13/bubble-ts.js` — existing interactive bubble presentation;
- `skills/chat/masterplan/CHATTERBOX_TOURBUS_REUSE_2026-09-14.md` — current reuse/status boundaries;
- `skills/chat/meta/CHATTERBOX_TOURBUS_SOURCE_INDEX_2026-09-14.json` — provenance and source comparisons.

Current routing grammar:
`NIE → Performance Mask → ChatterBox → Bubble / Emote / TTS`.

ChatterBox remains presentation/performance. The receiving host owns movement, gameplay, actor state and page interaction.

## Triplet boundary

Do not conflate three different things:

1. semantic sentence roles: **Subject / Connector / Reframe**;
2. performance arc: **SHOW IT → SPIN IT → SELL IT**;
3. existing KFB labels / IDs such as `bingo / bongo / boggle`.

The current Tourbus direction permits consciously combining sentence roles and performance roles, but three arbitrary fragments are not automatically a valid Triplet.

Known canonical labels in the located v13 source lineage:
**KayfaBINGO · KayfaBONGO · KayfaBOGGLE**; code IDs stay lowercase.

The original uploaded `KFB_TOURBUS_MEDIA_TRIPLETS_FRANKENSTEINING_v2` bytes are indexed by provenance but are not a current repository file. Do not fabricate missing pool content from memory.

## Mobile preview contract

Primary mobile viewport:
- **390 × 844** — required first-class review size.

Secondary preview fixtures may include:
- 430 × 932 portrait;
- 844 × 390 landscape.

The final product overlay stays clean. Debug controls belong only to the Stage preview harness.

Touch mapping proposal:
- tap pet → existing real Legacy action + existing VFX/SFX;
- long-press pet or camp → existing character settings action;
- tap camp → existing return-home action;
- ordinary page content remains interactive outside measured pet/camp/bubble hitboxes.

Right-click remains the desktop equivalent; touch must not depend on context-menu availability.

Use `visualViewport` / safe-area-aware positioning during implementation rather than assuming the CSS viewport equals the visible phone viewport.

## ChatterBox mobile rules for first experiments

- one interactive bubble maximum;
- mobile default should avoid permanent ambient chatter;
- source text before generated text;
- deterministic seed fixtures for visual comparison;
- player closure remains open;
- no generic LLM joke fallback;
- no automatic TTS requirement;
- no bubble may hide the actor, home zone or primary host interaction longer than necessary.

The v13 bubble donor already contains measured text layout, five named registers and a two-bubble world cap. Treat these as donor facts, not automatic mobile defaults.

## Donor-first visual gate

Before ChatterBox is integrated over the pet:

1. render the exact chosen v13 bubble donor in isolation;
2. show its real geometry / lettering / wrapping at mobile size;
3. record the source revision and screenshot;
4. only then adapt it into the Legacy Web Pet preview.

A loaded module or matching URL is not visual proof.

## Intended Stage surface

Keep the existing Legacy Web Pet Stage route as the product review route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/legacy-web-pet/`

A nested preview harness may later live below it, for example:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/legacy-web-pet/mobile-preview/`

Neither route is claimed PUBLIC_VERIFIED by this planning checkpoint.

When a mobile preview is published it must be linked from the KFB Hub and opened at the exact Cloudflare URL before any live claim.

## Protected boundary

Until explicitly changed by a later accepted gate, this lane does not:
- repair or bypass the frozen extension injection issue;
- change Rig_Legacy source or animation vocabulary;
- replace the shared Web Pet runtime;
- make the Legacy Web Pet the owner of ChatterBox;
- add LLM chat;
- merge or promote Live;
- invent missing Triplet source material;
- create replacement KFB Hub chrome.

## Candidate experiment sequence

**MOB-0 · source isolation**
- exact v13 bubble donor at 390×844;
- exact static phrase donor view;
- no pet integration.

**MOB-1 · real pet mobile host**
- existing Rogue + camp;
- portrait/landscape resize;
- touch mapping and hitbox evidence;
- no ChatterBox yet.

**MOB-CB-1 · one-bubble adapter**
- existing static phrase donor only;
- one deterministic bubble anchored to the existing pet;
- no LLM and no new actor voice canon.

**MOB-TRI-1 · Triplet lab**
- explicit source / counter / synthesis fixture;
- presentation experiment only;
- player closure left open;
- no new reward, card or memory owner.

These are proposals, not implementation status.

## Living sync

Every substantive turn in this chat should append to:
- `LIVING.md` for decisions, proposals, questions and evidence;
- `CHANGELOG.md` for GitHub checkpoints.

Runtime work, tests, Stage publication and human acceptance must remain separately labelled.


## 2026-09-21 · Current side experiment · Toy / Clay Form Lab v0

Georg added a cross-cutting modelling question to this loose ideation lane: reliably produce soft, rounded Tiny-Treats/KayKit-adjacent props and iconically simplified landmarks rather than hard-edged or micro-detailed models.

Current implementation candidate:
- ToolBox authoring donor under `tools/KFB-ToolBox/toy-clay-form-lab/`;
- exact Tiny Treats toaster isolated first;
- rounded three-button panel;
- Eiffel toy icon;
- Cologne Cathedral toy icon;
- rules in `TOY_CLAY_STYLE_RULES.md`;
- additive failure learning in `POSTMORTEMS.md`.

Tested implementation head:
`8825d05caed888e8bc35cc3b49d0cf01da3664da`.

Evidence:
**15/15 static + 16/16 desktop/mobile WebGL PASS**, run `35555718144`.

Boundary:
City Grotesque remains the current landmark default; `tools/img2threejs/` remains landmark owner. This lab is a candidate authoring grammar only.

Intended Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/toy-clay-form-lab/`.

Public status:
**BLOCKED / NOT PUBLIC_VERIFIED** because Cloudflare Pages reported a build failure for PR #158 at the tested implementation head.

Current next gate:
**TOY-CLAY-PUB-1 · publication-only recovery, without changing the proven geometry.**
