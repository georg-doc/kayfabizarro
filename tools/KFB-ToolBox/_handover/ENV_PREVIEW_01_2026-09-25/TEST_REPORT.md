# ENV-PREVIEW-01 · TEST REPORT

Status: **SOURCE + PUBLIC STAGE BROWSER VERIFIED · HUMAN REVIEW OPEN · NOT LIVE**
Date: 2026-09-25  
PR: **#218**

## Static / owner contract

Exact checkpoint:
`733e5e7da1623f79c73062f23252497ae5597548`

Workflow run:
`36187605597` · **SUCCESS**

Result:
**30/30 PASS**

Covers:
- shared schema/source lock;
- WORLD_MATCH / SOURCE_ISOLATION / CONSUMER_PRESET;
- ground / terrainPatch / worldZone contract;
- terrain/world support fails closed without real provider;
- no renderer/camera created by the adapter;
- exact resolved-profile reporting;
- scene restore/dispose;
- Resident Atlas consumes shared adapter and no longer contains its own shader/noise environment implementation;
- ToolBox retains exactly one renderer and updates/disposes the environment through its existing lifecycle.

## Real Chromium / WebGL consumer proof

Exact checkpoint:
`3327a901f1b20ea49e38b4c6f8d8aea29f9a57e6`

Push workflow:
`36187868823` · **SUCCESS**

PR workflow:
`36187874602` · **SUCCESS**

Result from the downloaded push artifact:
**15/15 PASS · fatal = null**

### Resident Atlas S40

**7/7 PASS**
- real Resident loaded;
- exactly one host canvas;
- WORLD_MATCH default;
- resolved Travel source head = `8614282aab2ced43bb5dda9fcf7abadf9768100a`;
- SOURCE_ISOLATION switch;
- source-backed Evening preset;
- zero page errors.

### ToolBox Production-01

**8/8 PASS**
- real actor runtime loaded: `graft`;
- exactly one host canvas;
- compact environment selector mounted;
- WORLD_MATCH default;
- resolved Travel source head = `8614282aab2ced43bb5dda9fcf7abadf9768100a`;
- SOURCE_ISOLATION switch;
- source-backed Night preset;
- zero page errors.

## Browser evidence

Push-run artifact:
- ID: `10886214792`
- name: `env-preview-01-browser-proof`
- bytes: `954513`
- SHA-256: `a3b2e0bbb575a549155ae2bdf0c66fda9a1c98cfd10ad60b497c5475f7556807`

Files inspected:
- `resident-world-match.png`
- `resident-source-isolation.png`
- `toolbox-world-match.png`
- `toolbox-source-isolation.png`
- `results.json`

Visual inspection confirms that both real consumers visibly change between the current World Match presentation and the neutral/source-isolation presentation while retaining the same Resident/actor content.

## Boundary / deferred

- current proof uses shared visible `ground` support;
- `terrainPatch` and `worldZone` are intentionally not faked and require a real World/support provider;
- Combat Spindle is not integrated here; `SPINDLE-01` remains separate;
- public Cloudflare Stage is additive and does not promote either consumer to Live;
- no Georg visual acceptance is claimed.

## Portable Stage package · 2026-09-26

Route package:
`kfb-hub/stage/toolbox/environment-preview-01/`

The package contains the two exact real consumers, their required local support files, the shared adapter and the exact pinned `sky-presets.js` donor. Only import paths were made portable; consumer/runtime behavior was not redesigned.

Local real Chrome result:
**9/9 PASS**

- Stage build marker;
- exact PR #218 source-head marker;
- Resident Atlas WORLD_MATCH;
- Resident Travel presentation-source pin;
- ToolBox WORLD_MATCH;
- ToolBox Travel presentation-source pin;
- compact environment selector visible;
- zero page/request errors;
- narrow viewport without horizontal overflow.

Public verification after `cloudflare-live@bec8688c0c5a4743d8f484193939a74112d977c4`:
**9/9 PASS** against the exact fixed route, with the same checks listed above. Cloudflare Pages completed successfully; the route was then opened and both real consumer views were visibly present.

Exactly one next gate:
**Georg visually reviews World Match vs Source Isolation and returns PASS or TUNE.**
