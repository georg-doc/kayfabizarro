# ENV-PREVIEW-01 · TEST REPORT

Status: **LOCAL_BROWSER_VERIFIED · HUMAN REVIEW OPEN · NOT STAGE · NOT LIVE**  
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
- no public Cloudflare Stage has been created;
- no Georg visual acceptance is claimed.

Exactly one next gate:
**public Stage packaging of the two real consumer comparisons for Georg visual review, without promoting either consumer or the adapter Live.**
