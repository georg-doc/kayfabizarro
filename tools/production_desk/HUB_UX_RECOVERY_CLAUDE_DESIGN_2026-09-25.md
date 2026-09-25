# KFB Hub · UX Recovery / Production Surface · Claude Design Sprint · 2026-09-25

Status: **READY · CLAUDE DESIGN · SESSION CUT RETURN · NO LIVE PROMOTION**
Owner: **HUB-CTRL #202 / tools/production_desk**
Human: Georg

## Outcome

Turn the KFB Hub back into a fast daily production surface instead of a historical/status wall.

The sprint must preserve the current Hub/Production Desk data owners and current v3 self-service catalog while restoring the previously accepted Hub UI v2 interaction grammar.

This is **not** a new Hub architecture.

## Read first

1. Exact accepted visual/UX donor:
   - repo: `georg-doc/kayfabizarro`
   - commit: `dfaafac070747f9543b5eb5a635e2aaa74e57b83`
   - file: `kfb-hub/index.html`
   - blob: `0de46343ddeb70a5f423876e75dc916ae7200c5b`
2. Human acceptance:
   - `skills/chat/workflows/KFB_HUB_UI_V2_2026-09-19/ACCEPTANCE_RETURN_2026-09-21.md`
3. Original v2 design rules:
   - `skills/chat/workflows/KFB_HUB_UI_V2_2026-09-19/CLAUDE_DESIGN_BRIEF.md`
4. Current Hub owner:
   - PR #202 · `work/hub-ctrl-01-2026-09-24`
   - `tools/production_desk/config.json`
   - `tools/production_desk/desk/desk.template.html`
5. Current production architecture / intake:
   - PR #204
   - `skills/chat/workflows/KFB_PRODUCTION_ARCHITECTURE_V3_2026-09-24/MVP_FOCUS_PLAN_2026-09-24.md`
   - `INTAKE_SESSION_CUTS_EAR_RIG_2026-09-25.md`

## Mandatory donor proof before design

Before changing anything:

1. Render/open the exact accepted `dfaafac…/kfb-hub/index.html` donor **in isolation**.
2. Show desktop plus split-screen/mobile.
3. Explicitly identify:
   - Paper/Dark grammar;
   - compact Today flow;
   - Pocket Inbox/dropzone;
   - search/filter behavior;
   - progressive disclosure;
   - ToolBox prominence.
4. Only then integrate current Production Desk data.

A loaded source URL is not enough. The actual donor surface must be shown.

## Current human findings to fix

The current v3 Desk shell is not accepted as UX.

Known regressions:
- too much historical/status surface;
- poor visual density/hierarchy;
- Pocket Inbox disappeared;
- Reload can look like it did nothing;
- current-state items mix with historical artifacts;
- public view can be hours stale;
- decisions made in project chats are not captured as visible production state.

Keep the useful v3 data/catalog logic. Replace the bad shell, not the data owners.

## First-screen product model

The first view should answer only:

1. **What needs Georg now?**
2. **What is currently running?**
3. **What can start next?**
4. **What changed since my last visit?**

No giant hero.
No explanatory wall.
No card cemetery.

Target first viewport:
- compact KFB Hub identity;
- exact last-sync age + source;
- visible Reload with success/no-change/error feedback;
- search;
- Pocket Inbox;
- at most 4–6 current actions;
- small “changed recently” indicator;
- fast access to ToolBox and WorldBuilder.

Everything else is progressive disclosure.

## Surfaces

### 1 · Heute

Default.

Sections:
- **Needs Georg**
- **Running**
- **Can Start**
- optional **Changed recently**

Only current operational items.

Historical/superseded items never appear here.

### 2 · Briefings

Current copy-ready work.

Strand-first.
Collapsed by default.
Searchable.

Keep the v3 self-service catalog/data source.

Do not build a giant flat job-card wall.

### 3 · Projects

Compact current product state:
- WorldBuilder
- ToolBox / Animation
- Racer
- Residents
- Travel
- other active owners

Each project shows:
- current state;
- next gate;
- freshness;
- one current owner;
- current review/brief links.

### 4 · Decisions

A visible production decision queue.

Every current card may expose:
- `PASS`
- `TUNE`
- `HOLD`
- `DONE`
- `MISSING`

plus one short note.

For this Claude sprint this is **honest client-side capture**, not fake cloud persistence.

Persist locally and provide:
- “Copy sync packet”
- “Export decision JSON”

Candidate schema:
`kfb.hub-decision/1`

Minimum fields:
`itemId · decision · note · decidedAt · sourceRevision`.

The later Web/GitHub bridge may ingest these decisions into repository status truth.

Do **not** claim shared persistence until a real writable backend/GitHub action owner exists.

### 5 · Archive / Sources

Historical proofs, rejected labs, old reviews and reference material.

Searchable, but not mixed into Today.

## Pocket Inbox

Restore the accepted v2 Pocket Inbox/dropzone visibly.

Purpose:
- paste a GitHub/Dropbox link;
- paste RETURN/HANDOVER text;
- drop a small file/ZIP when browser support permits;
- keep items locally until synchronized through a production chat/bridge.

It is an intake surface, not an implementation owner.

Show unsynced count clearly.

Never claim a local Pocket item is already in GitHub.

## Freshness / fast work

The UI must distinguish:

- live/current source;
- embedded fallback;
- stale source;
- local unsynced decision/inbox items.

Use exact timestamp, not only “8 hours old”.

Reload button states:
- loading;
- updated;
- no change;
- error/fallback.

Polling may remain, but no UI may pretend polling equals source publication.

The separate Web integration slice will repair the status publication/update pipeline. Claude Design owns this UX only.

## Current product truth for the design fixture

Use current states as fixture data:

### ToolBox Production-01
**PROCEED PASS**
Not exhaustive detail acceptance.
Current direction may continue.

Next:
canonical KayKit locomotion/profile consolidation; Ear Rig may follow.

### World Integration-01
**PROCEED PASS**
Not exhaustive detail acceptance.

Next:
Web 1:1 rehome/regression; then shared locomotion/OSM continuation.

### Ear Rig
PR #214 candidate.
Animation Lab / ToolBox Motion owns the single `ear-dangle.v1.js`.
FrankenStein Studio owns authoring geometry/placement/pose/profile.

Next:
EAR-DANGLE-01.

### Hub itself
**TUNE / RECOVERY**
Current v3 data useful.
Current shell rejected.
Accepted v2 donor is the visual starting point.

## Preserve

Do not replace:
- HUB-CTRL #202;
- Production Desk config/builder/registry;
- Architecture v3 catalog;
- current promptSection extraction;
- current project owners;
- KFB Stage/publication owner.

Do not introduce:
- a second Hub runtime;
- a second status database;
- a fake server;
- generic SaaS dashboard chrome;
- a new branding system;
- another asset library.

## Design direction

Use the accepted v2 Paper/Dark family.

Improve it rather than copy every old detail blindly.

Desired:
- editorial, compact, tool-like;
- strong information hierarchy;
- good split-screen use;
- large enough controls;
- low prose;
- useful empty states;
- obvious active status;
- visual separation between “needs me” and “reference/history”.

Avoid:
- huge cards;
- giant headers;
- decorative KPI dashboard patterns;
- nested drawers for ordinary work;
- developer metadata in the primary view;
- unexplained abbreviations.

## Responsive gates

Show and test:
- desktop ~1440 px;
- split-screen ~800–900 px;
- mobile ~390 px.

Pocket Inbox and current decisions must remain reachable in all three.

## Deliverable

One Claude Design Session Cut via:

`/session-zip`

Include:
- exact donor proof;
- new candidate source;
- Handover;
- active Changelog;
- SOURCE;
- Test Report;
- screenshots for all three widths;
- feature-parity map from accepted v2 donor;
- list of data-owner seams;
- open questions;
- exactly one next gate.

## Human gate

Georg reviews one coherent candidate and answers:

1. Is this again a usable daily production cockpit?
2. Can I see what needs me within seconds?
3. Can I record PASS/TUNE/HOLD/MISSING without losing the decision?
4. Does history stay out of the way?
5. Is Pocket Inbox genuinely useful?

No Live promotion from Claude Design.

Exactly one next gate:
**GEORG HUMAN REVIEW · HUB UX RECOVERY CANDIDATE.**
