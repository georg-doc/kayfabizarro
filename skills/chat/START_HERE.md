# KFB Chat Production Router

Status: CURRENT ROUTER v0.3
Date: 2026-09-19
Owner: Georg / KFB

This folder is the current LLM production routing layer for ChatGPT/Astra and Claude Design.
It does not replace project SSOTs, current tools, or canonical skills. It tells an agent what is current, what to read, and what not to trust without review.

## Start order

1. Read `REGISTRY.json`.
2. Read `LIVING_MASTERPLAN.md` only when cross-project sequencing or current lead intent matters.
3. Identify the current project or tool node.
4. Read the referenced project SSOT / START / RETURN files.
5. If the task points to a shared intake package, apply `INBOX_PROTOCOL.md` before treating anything there as current truth.
6. Load only the current skills required for the task.
7. Apply the provider adapter only after the provider-neutral SOP.
8. For a bounded fresh-chat/module/POC slice, apply `FRESH_CHAT_SLICE_PROTOCOL.md` and `BOUNDED_PRODUCTION_SLICE_CONTRACT.md` before implementation.
9. For every Web/Claude/Codex delivery, apply `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md` before writing or publishing.
10. Record decisions and results additively.

For meta-narrative/cross-module ideation, especially KFB Town, use the registry entries for `kfb-meta-compendium-v1` and `kfb-town`. The Meta Compendium is an index, not a canon/implementation SSOT; Town has its own living document under `town/`.

If this is a replacement/fresh chat after context loss, use `RECOVERY_PATH.md` rather than asking Georg for a transcript reconstruction.

## Hard rules

- GitHub state beats chat recollection when they conflict.
- Reuse before rebuild. Read the donor before adapting it.
- Reuse-before-rebuild applies to concepts too: do not invent a second hub/dialogue/presenter/card-navigation/memory grammar before checking its named home.
- Never silently replace an owner, contract, or SSOT.
- A donor PASS is not an integration PASS.
- A numerical PASS is not a browser PASS.
- A browser PASS is not Georg's visual/freeplay acceptance.
- Before visual implementation, state the human review question. If materially different interpretations remain plausible, do not choose silently; resolve or stop at an explicit human gate.
- Legacy files remain useful evidence but are not current merely because they exist.
- Meta indexes may contain stale version/status/count snapshots; verify operational claims in the current project/tool SSOT.
- Inbox files are inputs, not SSOTs, until a receiving owner accepts/pins them.
- The planned shared inbox is the private `georg-doc/KFB-Production-Inbox`; the old public Travel-mirror inbox is historical staging only.
- One inbox folder per job/project; processed packages move to `_inbox/archiv/` with return/destination evidence preserved.
- Do not read giant housekeeping/history files front to back at startup. Search them only for a concrete question.
- Do not copy canonical skills into this folder. Reference them from the registry.
- Chats synchronize through GitHub state; do not assume direct chat-to-chat messaging or shared hidden context.
- Human-facing KFB preview/Stage/Live links use `kayfabizarro.pages.dev` / KFB Hub; do not publish active review links through GitHub Pages, githack or raw-CDN mirrors.
- A timeout is `UNKNOWN`, never success: verify the exact branch head, workflow/deployment and public URL before retrying or claiming completion.
- After two repair passes without progress on the same gate, stop and export. Preserve the failed candidate and route through the failure-recovery template instead of spending a third pass on the same foundation.

## Status vocabulary

`CURRENT_CANON` · `CURRENT_TOOL` · `CURRENT_REFERENCE` · `CURRENT_PROJECT_SSOT` · `LEGACY_REFERENCE` · `SUPERSEDED` · `ARCHIVED_HISTORY` · `UNVERIFIED` · `EXPERIMENTAL`

## Core docs

- `LIVING_MASTERPLAN.md` — durable cross-project lead plan and sequence
- `masterplan/` — scoped masterplan addenda, referenced from `REGISTRY.json`
- `meta/KFB_META_COMPENDIUM_v1.md` — cross-module meta index; routing/reference only
- `town/START_HERE.md` + `town/LIVING_KFB_TOWN.md` — current KFB Town ideation home
- `RECOVERY_PATH.md` — deterministic recovery after chat/context failure
- `FRESH_CHAT_SLICE_PROTOCOL.md` — bounded cold-start work and compact next-day review packet
- `BOUNDED_PRODUCTION_SLICE_CONTRACT.md` — intent-resolution, donor-isolation, post-write verification and Cloudflare-only human-test contract
- `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md` — binding Chat → GitHub → Cloudflare Stage → Hub delivery and timeout recovery
- `WEB_PROJECT_FOLDER_INSTRUCTIONS.md` — copy-ready instruction text for Web project folders
- `templates/CLAUDE_DESIGN_FAILURE_RECOVERY_EXPORT.md` — stop/export/post-mortem template after repeated visual or kit failures
- `ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md` — mandatory donor-first and every-pixel-pays-rent rules for visual briefs
- `workflows/KFB_HUB_UI_V2_2026-09-19/CLAUDE_DESIGN_BRIEF.md` — lean Hub UI brief for desktop, split-screen and mobile
- `SYNC_PROTOCOL.md` — shared GitHub-based chat/agent synchronization
- `INBOX_PROTOCOL.md` — shared cross-project intake/staging rules
- `INBOX_REPO_BOOTSTRAP.md` — one-time structure for the private production inbox
- `PRODUCTION_SOP.md` — provider-neutral production method
- `EVIDENCE_AND_STATUS.md` — claim / proof vocabulary
- `CHANGELOG.md` — additive history of this router
- `adapters/chatgpt-astra.md` — ChatGPT/Astra operating layer
- `adapters/claude-design.md` — Claude Design operating layer
- `workflows/` — reusable task workflows
- `workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/START_HERE.md` — current Baukasten catalog + Dungeon/Hex/Combat Web-Chat slices
- `tool-nodes/` — current tool/project entry cards
- `consumers/` — project/chat-specific sync adapters without copied skill bodies

## Current first-class nodes

- Asset Librarian
- FrankenStein Studio v16
- Travel Globe
- Combat Arena
- KFB Town — current living concept/reference, not a runtime project
- Wissens-Pilli / DocCheck Interactive Microlearning — `UNVERIFIED` intake until implementation SSOT/runtime is explicitly pinned
- **SimBlood / DocCheck — `CURRENT_PROJECT_SSOT` at `georg-doc/doccheck/sim-blood/`; recovery in `RECOVERY.md`, current WIPs in `WIP_STATUS.json`**
- **2D Animation Studio — `CURRENT_TOOL` at `tools/2D Animation Studio/`; browser-first 2D/2.5D cutout rig authoring, first lab DocCheck Eumel**
- Animation Lab — `UNVERIFIED` until current implementation SSOT/site is pinned

DocCheck UI convention for project surfaces: use `#cc0033` as a restrained accent for controls/links/active states; do not tint medical imagery.

When a task says only “start KFB production”, begin here. When a task names a project or tool, this file routes you to its actual SSOT rather than becoming one itself.

## 2026-09-15 · ToolBox reentry and Town birthday input

Read [the scoped masterplan addendum](masterplan/TOOLBOX_UX_TOWN_BIRTHDAY_2026-09-15.md) for the two separate ToolBox results A/B, WS0's source corrections, efficient handoff practice, birthday character selection and the Makerspace cinema direction. It routes to existing owners and preserves the distinction between a workspace report, a user direction and a tested consumer result. It does not promote tools or start a Town implementation.

## 2026-09-17 · DocCheck SimBlood recovery node

SimBlood is now a first-class project node with its own external SSOT in `georg-doc/doccheck/sim-blood/`. The KFB Hub/router only points to its `START_HERE`, `RECOVERY`, `WIP_STATUS`, Living and Return files; it does not duplicate SimBlood project truth.

## 2026-09-18 · Astra Integration 01 onboarding

On Georg's request, the prepared cross-project execution brief is now at [Astra Integration 01 · START_HERE](workflows/ASTRA_INTEGRATION_01_2026-09-18/START_HERE.md).

Scope: local multi-repository workspace, existing BOX1/Race/Vehicles/Audio, World/Environment, Residents/Animation, ToolBox/Studio/Rigging, Arena, Asset Librarian and the existing KFB Hub. A single execution instance works under the existing WSA/product/module owners; this is not a new universal runtime, Registry, monorepo or automatic promotion of any candidate.

Status: **ONBOARDING PREPARED · WORLD REVIEW PENDING · EXECUTION NOT STARTED**. Read [World review request](workflows/ASTRA_INTEGRATION_01_2026-09-18/WORLD_REVIEW.md) and [task changelog](workflows/ASTRA_INTEGRATION_01_2026-09-18/CHANGELOG.md). Current project HEADs, source arrivals and human gates must be rechecked before work; especially the incoming Audio A1 source. No local Work-session permissions or new runtime tests are claimed by this routing addition.


## 2026-09-18 · 2D Animation Studio

Georg established a current tool lane at `tools/2D Animation Studio/` for browser-first 2D/2.5D cutout rigs, pivot hierarchies, cartoon deformation/motion calibration and reusable animation modules for mini-games. Load it with `skills/kfb-cartoon-animation_v2.md`.

The first lab is DocCheck Eumel. The current measured/traced Eumel package is **provisional donor evidence** only. Georg will provide the DocCheck AD Illustrator source in the tool-local `_inbox/doccheck-ad-ai-source/`; that intake remains input until classified, measured and explicitly accepted into the tool's canonical asset library. The tool-local inbox does not replace the central production inbox contract.


## 2026-09-19 · Fresh-chat slice handoff

For Georg's parallel web chats, modules and POCs, use `FRESH_CHAT_SLICE_PROTOCOL.md`. It lets one chat finish one clearly bounded slice independently, but never grants broader ownership. Every result remains additive and returns as a small review packet: exact source state, changed files, actual tests, visible proof, open questions and the next safe gate.


## 2026-09-19 · Claude Design failure recovery

Repeated visual/kit repair loops now stop after two passes without progress on the same gate. Use `templates/CLAUDE_DESIGN_FAILURE_RECOVERY_EXPORT.md` to preserve the complete editable source/state, distinguish evidence from hypothesis, record salvageable parts and return one smaller next gate. Project-specific post-mortems remain additive examples; an exported failed candidate is not promoted to current implementation truth.


## 2026-09-19 · Modular 3D Mini-Game Hub briefing

For the next ChatGPT Web comparison, use [KFB 3D Mini-Game Hub · START_HERE](workflows/KFB_MODULAR_MINIGAME_HUB_2026-09-19/START_HERE.md). It defines one shared Baukasten catalog and three separate POCs: furnished Dungeon rooms, a measured three-piece Hex gate leading to a hand-authored Babel micro-tower, and a Combat Arena platform level that preserves the Combat repository's current owners.

The verified Claude Design recovery export is donor evidence only. Its inventory, measurement, loader, grid, camera and jump/contact ideas may be reused; its large island generator and automatic diorama composition are explicitly rejected. Tiny Treats is a first-class catalog lane and must distinguish modular interior parts from loose scenery before use.


## 2026-09-19 · Visual anti-slop guardrails + lean Hub UI

All future visual/UI/asset-based briefs load `ANTI_SLOP_VISUAL_BRIEF_GUARDRAILS.md`: source output must visibly reappear; source-mandated objects have no aesthetic fallback; generic UI chrome is not added without request; FOV/task composition outranks safe-area containment; technical PASS, visual comparison and Georg acceptance remain separate.

The KFB Production Hub now defaults to a lean `Heute` surface. Explanatory hero copy, giant focus tabs and the default link-card wall are removed from the first view. The Pocket Inbox/dropzone is open and visible; the first screen is limited to current P0 actions and four handoff briefs. Long project/reference lists remain available only through compact filters. Claude Design receives the separate three-viewport brief under `workflows/KFB_HUB_UI_V2_2026-09-19/`.

HUD Rig v1 remains rejected history. The current Race/Travel radio restart brief lives in `georg-doc/KFB-Stunt-Car-Race/_handover/RACE_HUB_3D_AUTORADIO_RESTART_BRIEF_2026-09-19.md` and starts with the isolated exact Tiny Treats radio donor, never the rejected presentation.
