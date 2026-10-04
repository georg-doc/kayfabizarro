# RETURN · KFB ChatterBox / Triplet Curator · planning slice

Date: 2026-10-04
Status: **PLANNING READY · SITE NOT BUILT**
Owner: **KFB ToolBox / ChatterBox content curation**

## What is now prepared

A bounded Site packet now exists for a single ToolBox specialist editor:

**KFB ChatterBox / Triplet Curator**

It is deliberately not a second dialogue engine.

The design makes:
- ChatterBox the speech/content route;
- the existing Resident Chatter adapter the deterministic semantic selector;
- Resident Lean Cards read-only character clamps;
- Hypernormalisation the quote/provenance/rights owner;
- current/Claude speech-bubble work the presentation owner;
- GitHub the authoritative Triplet persistence layer;
- the Site the editorial review/control surface.

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

Base:
`coworker/coordination-plan-2026-10-04@422c48e2a82b13c8ae380da70f6c66619639d8aa`

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

This is the receiving slot for the ChatterBox / Triplet Curator.

Canonical ToolBox front door stays:
https://kfb-toolbox.frizzlebob.chatgpt.site

## Validation

Planning/data validation: **12/12 PASS**.

Runtime/browser/Site tests: **not run by scope**.

## Publication state

GPT Site: **NOT BUILT**.

Final Site URL: **not invented**.

Reserved formal Stage, only if later required:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/triplet-curator/`

Stage: **NOT DEPLOYED**.

No merge. No Live promotion.

## Exactly one next gate

**SITES IMPLEMENTATION · ChatterBox / Triplet Curator v1**

A Sites-capable executor builds exactly one private specialist Site, imports the 20-item seed, proves one real quote-ID bridge and one Resident-pair semantic/bubble preview, then returns the editor to Georg for PASS / TUNE / FAIL.
