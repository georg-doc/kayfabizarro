# BRIEF · Work/WSA · Style Reference Browser/Viewer R2A handoff export

Status: **READY FOR WORK/WSA · RECOVERY PREP**
Date: 2026-10-06

## Executor
**ChatGPT Work/WSA**

## Outcome
Prepare a complete portable design handoff of the **current private Style References implementation** for Claude Design.

Do **not** redesign the UI in this slice.

The goal is to export enough exact current source/state/evidence so Claude Design can redesign the Reference Browser/Viewer without direct access to the private Site.

## Owner
**KFB Asset Registry / Asset Librarian**

Existing Site only:
`https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=style-references`

Existing project:
`appgprj_6ac1afef08148191b62b95f184bf845e`

Repo:
`georg-doc/kayfabizarro`

Draft PR:
**#359**

Branch:
`planning/style-reference-library-r1-surface-2026-10-05`

Read current PR/head before work.

## Read first
1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. current `tools/asset_registry/librarian/_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/RETURN.md`
5. `tools/asset_registry/librarian/_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/STYLE_REFERENCE_BROWSER_VIEWER_R2_UX_FINDINGS_2026-10-06.md`
6. current Site project/version/source using Sites tools

## Georg decision

Current published R1 Style Reference UX is **HUMAN FAIL**.

Reason:
the actual tutorial drawings cannot be inspected at useful size. The current Asset-style card/filter pattern is not an acceptable reference browser/viewer.

This is a product recovery input, not a request for cosmetic tuning.

## Export packet required

Create a portable GitHub folder:

`tools/asset_registry/librarian/reference-browser-r2/design-handoff-current/`

Include:

### 1. CURRENT_SOURCE
Export/copy the exact current Site source relevant to Style References:
- Style References view/components;
- current gallery/card rendering;
- current Inspector;
- current intake UI;
- current filters/search;
- current persistence/data adapters;
- current mobile navigation pieces used by this view.

Preserve source identity/version.

Do not reconstruct from screenshots if the Site source can be exported directly.

### 2. CURRENT_STATE.md
Document:
- current Site project/version/deployment/source commit;
- current 58 built-in records behavior;
- local card/set persistence behavior;
- source-isolation flow;
- all current Style Reference interactions;
- protected Asset/Motion/Saved Set behavior;
- known remote-image constraints.

### 3. SCREENSHOTS
Capture at least:
- 1440×900 desktop Style References overview;
- desktop selected Etherington reference;
- desktop source with two tutorial boards if available;
- mobile overview;
- mobile selected reference.

The screenshots must show the actual current product, not a mock.

### 4. FAIL_ANALYSIS.md
Use Georg's direct review and the R2 findings.

Record these concrete failures:
- cards crop tutorial drawings too aggressively;
- selected Inspector still does not expose complete tutorial boards at useful size;
- filter/search/intake chrome consumes too much viewport;
- reference visual is not the dominant object;
- current Asset-style browse pattern is the wrong primary interaction for tall tutorial/reference sheets;
- user must leave the Librarian to understand the source content.

### 5. DATA_SAMPLE.json
Include a representative data fixture with:
- Clouds;
- one two-board Etherington source;
- Sound Effects;
- Speech Bubbles;
- one Emanata/reaction supplementary source;
- source classes / preview URLs / board URLs where available;
- saved/inspected/set state examples.

Do not include private/purchased image binaries.

### 6. PROTECTED_BOUNDARIES.md
Claude Design must preserve:
- existing Asset Librarian owner/site;
- existing Style Reference data model;
- 58 built-in records;
- local Cards/Sets/Notes persistence;
- source isolation/provenance;
- Assets/Motions/Saved Sets/Intake functionality;
- Paper/Dark/KFB visual family;
- no second Site.

## Important
No R2 implementation in this Work slice.
No Site redesign.
No publication.
No second Site.

This job ends with a **portable Claude Design packet** on GitHub.

## Done when
1. exact current Site source snapshot exists in the handoff;
2. current Site identity/version is recorded;
3. desktop/mobile screenshots are included;
4. representative data fixture is included;
5. FAIL analysis is explicit;
6. protected behaviors are explicit;
7. Claude Design can start R2 without private Site access.

## INDEPENDENT EXECUTION

Outcome: portable current-State packet for Claude Design  
Builder: ChatGPT Work/WSA  
Tester: verify source snapshot/screenshots/data packet completeness  
Critic: short read-only check against Georg's Human-Fail reasons  
Guard: ensure no redesign/implementation leaked into R2A  
Only writer: Builder  
STOP authority: Guard only  
Human gate: none; this is transport/prep only

## Exactly one next gate

**CLAUDE_DESIGN_STYLE_REFERENCE_BROWSER_VIEWER_R2**
