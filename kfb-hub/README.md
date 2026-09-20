# KFB Production Hub

**Permanent URL:** https://kayfabizarro.pages.dev/kfb-hub/

Human-facing navigator for the wider KFB production scope. It is deliberately **not** a new SSOT.

Candidate playground: `https://kayfabizarro.pages.dev/kfb-hub/stage/`. Stage is publicly testable
but never implies Live promotion or Georg acceptance.

## What it contains

- recovery and current lead entry points;
- Asset Librarian and ToolBox links;
- KFB Town current start/session/living documents;
- Travel, Combat and Stunt implementation repositories and public previews where available;
- DocCheck project recovery through the central Registry/current lead checkpoint, including SimBlood and Doc Animation;
- central production skills and protocols;
- search and simple category filters;
- a small **Next actions** board for Georg's current working list.

## Recovery contract

The Hub is the human bookmark after a broken/ended chat.

The current recovery path is:

1. open the Hub;
2. open **Current Lead Checkpoint**;
3. follow the current dated pointer;
4. route through `skills/chat/REGISTRY.json` to the actual project SSOT;
5. inside the project, read its own recovery/current-WIP files.

### KFB Travel / World Builder

Human recovery page:
`https://kayfabizarro.pages.dev/kfb-hub/travel-world.html`

Current implementation SSOT:
`https://github.com/georg-doc/KFB-Travel-Globe`

Runtime / Ground Movement Lab:
`https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world-builder/?wb0=1`

GitHub Pages fallback:
`https://georg-doc.github.io/kayfabizarro/travel/wip/travel_globe_wsa/world-builder/?wb0=1`

Parallel authoring-UX POC:
`https://kayfabizarro.pages.dev/travel/wip/travel_globe_wsa/world/`

Recovery distinction is hard: `/world-builder/` is the productive Travel runtime proof; `/world/` is a candidate-authoring POC / donor and does not become a second runtime SSOT.

### DocCheck · SimBlood

Human recovery page:
`https://kayfabizarro.pages.dev/kfb-hub/sim-blood.html`

Current SSOT:
`https://github.com/georg-doc/doccheck/tree/main/sim-blood`

Recovery:
`https://github.com/georg-doc/doccheck/blob/main/sim-blood/RECOVERY.md`

Current WIPs:
`https://github.com/georg-doc/doccheck/blob/main/sim-blood/WIP_STATUS.json`

DocCheck project surfaces use `#cc0033` as a restrained accent color. This is a UI convention, not a medical-image tint.

### DocCheck · Doc Animation

Human recovery page:
`https://kayfabizarro.pages.dev/kfb-hub/doc-animation.html`

Current SSOT:
`https://github.com/georg-doc/doccheck/tree/main/doc-animation`

Current first module:
`https://github.com/georg-doc/doccheck/tree/main/doc-animation/eumel`

Clean vector sheet:
`https://github.com/georg-doc/doccheck/blob/main/doc-animation/eumel/assets/EUMEL_PARTS_CLEAN_VECTOR.svg`

Rig-guide sheet:
`https://github.com/georg-doc/doccheck/blob/main/doc-animation/eumel/assets/EUMEL_PARTS_RIG_GUIDE_VECTOR.svg`

Measurements / evidence boundary:
`https://github.com/georg-doc/doccheck/blob/main/doc-animation/eumel/data/measurements.json`

The Hub does not become animation truth. Source geometry, derived hidden completion, rig constraints and the additive changelog remain under the DocCheck repository.

## Next actions contract

The To-do board is a personal convenience layer, not project truth. Task definitions live inside the static page; checkmarks are stored only in the current browser via `localStorage` and never modify GitHub, project status, owner contracts or consumer runtimes.

## Contract

1. GitHub/project SSOT wins whenever a card or task on this page is stale.
2. The Hub may link to a status; it does not promote that status.
3. Project/runtime ownership does not move into the Hub.
4. Keep the page useful for Georg: prefer a small number of durable entry links over mirroring every file.
5. For chat recovery, prefer `skills/chat/RECOVERY_PATH.md` and the current lead checkpoint linked from the Hub.
6. A checked task is not a tested result or accepted implementation.

## Maintenance

The page is intentionally dependency-free and self-contained in `index.html`. Update links, labels and current task definitions only when they remain useful for daily work. Avoid turning it into a second registry, issue tracker or project dashboard with independently maintained truth.

For project-specific recovery pages such as Travel/World Builder, SimBlood and Doc Animation, the Hub should route to the project recovery/current-state files rather than duplicate implementation truth.


### 2D Animation Studio

Human recovery page:
`https://kayfabizarro.pages.dev/kfb-hub/2d-animation-studio.html`

Tool SSOT:
`https://github.com/georg-doc/kayfabizarro/tree/main/tools/2D%20Animation%20Studio`

First lab:
`tools/2D Animation Studio/labs/eumel-rig-lab/`

The current Eumel implementation uses source-exact visible vectors extracted from the DocCheck AD Illustrator/PDF-compatible source. Browser QA and Georg/AD visual acceptance remain pending; the Hub does not promote those gates.


#### Cross-render Eye Proof

Candidate:
`https://kayfabizarro.pages.dev/tools/2D%20Animation%20Studio/proofs/cross-render-eye-v1/`

Source:
`tools/2D Animation Studio/proofs/cross-render-eye-v1/`

Purpose: same semantic EyeRig sequence on source-exact Eumel 2D and the existing Rig_Medium / EyeRig-v6 ToolBox Graft actor. Static sanity PASS; browser visual proof pending.

Modifier Atlas:
`tools/2D Animation Studio/shared/eye-rig/modifier-atlas/`


## 2026-09-20 · Hub UI candidate · Paper/Dark + visual Stage/Live

Draft PR: `#141`  
Branch: `work/kfb-hub-paper-dark-previews-2026-09-20`  
Status: **STATIC PASS · STAGE/PUBLIC PENDING · NO LIVE PROMOTION**

This candidate keeps `kfb-hub/index.html` as the only Hub runtime owner and adds:

- shareable hash navigation such as `#stage`, `#briefings`, `#tools` and DocCheck-prefixed variants such as `#doccheck-stage`;
- explicit Paper / Dark presentation with the choice stored only in the browser;
- a Stage / Live visual gallery derived from the Hub's existing `links`, `todos` and `briefings` arrays, deduplicated by current public URL;
- screenshot tiles requested from the current public target with a one-hour maximum cache; if a thumbnail cannot load, the tile falls back to a lazy, non-interactive view of that same public target.

The gallery is presentation only. It does not create a second registry, change project status, or promote a Stage candidate to Live.

Current static result: **18/18 PASS**. Derived current inventory: **KFB 19 targets = 8 Stage + 11 Live; DocCheck 4 Live targets**.

Evidence and Return:
`skills/chat/workflows/KFB_HUB_UI_V2_2026-09-19/PAPER_DARK_PREVIEWS_2026-09-20/`

No new `kayfabizarro.pages.dev` review link is claimed until the exact candidate revision has been deliberately published and opened on Cloudflare.
