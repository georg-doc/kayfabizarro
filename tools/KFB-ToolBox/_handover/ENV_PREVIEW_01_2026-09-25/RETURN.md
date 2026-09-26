# RETURN · ENV-PREVIEW-01 · 2026-09-25

Status: **STAGE PACKAGE LOCAL BROWSER VERIFIED · PUBLICATION PENDING · NOT LIVE**

## Outcome

The first shared KFB Environment Preview Host is implemented as a thin consumer adapter rather than another world runtime.

The same current World/Travel presentation source can now be mounted into:
1. Resident Atlas S40;
2. ToolBox Production-01 / Animation workspace.

Modes:
- **WORLD_MATCH** · default;
- **SOURCE_ISOLATION**;
- **CONSUMER_PRESET** · currently source-backed Evening/Night examples.

Support contract:
- `ground` works in this proof;
- `terrainPatch` / `worldZone` require a real delegated provider and fail closed otherwise.

## Repo / branch / PR

- repo: `georg-doc/kayfabizarro`
- branch: `chatgpt-web/env-preview-01-2026-09-25`
- Draft PR: **#218**
- base: `main`
- implementation: `32e12c837d347368fc4ae0bac1fa880a191aa258`
- static evidence: `733e5e7da1623f79c73062f23252497ae5597548`
- browser evidence: `3327a901f1b20ea49e38b4c6f8d8aea29f9a57e6`

Final handoff head is the commit containing this Return.

## Changed runtime files

- `tools/KFB-ToolBox/lib/environment-preview.v1.js`
- `tools/KFB-ToolBox/_inbox/KFB_Resident_Atlas_S9/S40-disco-rotation/lib/host-env.js`
- `tools/KFB-ToolBox/_inbox/KFB_Resident_Atlas_S9/S40-disco-rotation/KFB_Resident_Atlas_S9.html`
- `tools/KFB-ToolBox/_inbox/KFB ToolBox Production-01/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-25_r1/KFB ToolBox Production-01.dc.html`

## Evidence / QA files

- `.github/workflows/env-preview-01.yml`
- `tools/KFB-ToolBox/tests/env_preview_01_contract_test.mjs`
- `tools/KFB-ToolBox/tests/env_preview_01_browser_test.mjs`
- `tools/KFB-ToolBox/_handover/ENV_PREVIEW_01_2026-09-25/SOURCE.json`
- `tools/KFB-ToolBox/_handover/ENV_PREVIEW_01_2026-09-25/TEST_REPORT.md`
- `tools/KFB-ToolBox/_handover/ENV_PREVIEW_01_2026-09-25/TEST_EVIDENCE.md`
- this `RETURN.md`
- additive `tools/KFB-ToolBox/CHANGELOG.md`

## Owners preserved

WorldBuilder, OSM and the current terrain owners remain authoritative for world construction and height/support truth.

The pinned Travel source is a **presentation donor**, not the world owner:
`georg-doc/KFB-Travel-Globe@8614282aab2ced43bb5dda9fcf7abadf9768100a` supplies the current sky/light/fog/mood profile used by this comparison.

Receiving hosts retain:
- renderer;
- scene;
- camera;
- clock;
- gameplay/movement;
- actor/Resident;
- mixer/animation;
- editor;
- persistence.

No second terrain/sky/world owner was introduced.

## Tests

- static owner/contract: **30/30 PASS**
- local real Chromium/WebGL: **15/15 PASS**
- existing Production Resource Registry on browser checkpoint: **SUCCESS**
- page errors in both consumer proofs: **0**
- portable Stage wrapper: **9/9 local real Chrome PASS**

Browser artifact:
`10886214792`
SHA-256:
`a3b2e0bbb575a549155ae2bdf0c66fda9a1c98cfd10ad60b497c5475f7556807`

## Visual proof inspected

Resident Atlas:
- World Match = current Travel sky/light presentation + shared visible support;
- Source Isolation = original neutral Atlas source-review presentation.

ToolBox:
- World Match = current Travel sky/light presentation;
- Source Isolation = preserved neutral ToolBox floor/light presentation.

The source actor/Resident stays the same across each A/B.

## Publication

Cloudflare Stage package prepared at:
`kfb-hub/stage/toolbox/environment-preview-01/`.

Intended human route:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/environment-preview-01/`

Public verification: **PENDING**.
Live: **UNCHANGED**.

## Unresolved / deferred

- real `terrainPatch` and `worldZone` provider integration;
- Human visual judgement of whether World Match is the desired default presentation;
- `SPINDLE-01` as a separate named environment provider;
- `WORLD-ENV-CONSOLIDATE-01` and later Biome/Mood/Nature work;
- no promotion of the inbox consumer candidates to canonical runtime ownership in this slice.

Exactly one next gate:
**publish the exact prepared Stage package, verify its marker and both consumers on the fixed Cloudflare route, then let Georg review World Match vs Source Isolation.**
