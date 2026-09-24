# KFB Legacy Web Pet v0 · FAILURE RECOVERY

**Date:** 2026-09-21  
**Status:** FROZEN_EXTENSION_GATE_AFTER_TWO_ATTEMPTS · WEB_RUNTIME_SALVAGEABLE  
**Branch:** `chatgpt-web/legacy-web-pet-v0-2026-09-21`  
**Tested runtime head:** `f41c59a8178bf77266c0f776f2e20a7948ee6223`

## Preserve

Do not delete or restart this candidate.

### Proven / salvageable

- shared Legacy Web Pet runtime;
- default Rogue and four-character selector;
- Rig_Legacy animation playback;
- walk/run/hop presentation;
- real 3D shadow;
- Warband camp with real banner and two props;
- click action + VFX + user-gesture SFX;
- right-click settings;
- narrow measured hitboxes preserving normal page interaction;
- Hub mount adapter;
- MV3 source and successful esbuild bundle.

Evidence:
- **15/15 static PASS**
- **12/12 Web/Hub WebGL PASS**

## Frozen gate

The extension inject test failed twice.

### Attempt 1

Run:
`35553680781`

Observed:
- plain neutral page HTTP 200;
- no Hub mount script;
- no extension ready marker after 120 seconds.

### Attempt 2

Run:
`35553968462`

Change from attempt 1:
- test launch used explicit Playwright `channel:'chromium'`;
- pet runtime unchanged.

Observed:
- plain neutral page HTTP 200;
- no Hub mount script;
- same timeout waiting for extension ready marker.

## Known / unknown boundary

Known:
- the extension source passes static MV3 checks;
- esbuild produces `dist/`;
- shared pet runtime works as a normal Web host;
- neutral test page itself loads.

Unknown:
- whether the content script begins execution;
- whether `mountLegacyWebPet()` begins;
- whether the extension iframe is inserted;
- whether the extension frame hits CSP/network/runtime failure.

Do not select one unknown as the cause without evidence.

## Artifact

Run 4:
- artifact ID `10619267683`
- digest `sha256:da9bdfa9e0dd03c83f4335e61963449b7d559fc91e892867dd2c98843f361bf3`

The package step did not run, so this artifact is evidence only, not a validated installable extension ZIP.

## Protected scope

Do not change:
- Rig_Legacy source;
- Legacy animation vocabulary;
- character/camp asset pins;
- Web host runtime;
- Hub mount behavior;
- VFX/SFX behavior;
- page hitbox model;
- LLM/chat.

## Exactly one next gate

### LWP-EXT-F1 · extension-load observability

Diagnostic only.

A fresh slice should add the smallest possible markers:

`CONTENT_ENTRY → HOST_CREATED → FRAME_INSERTED → FRAME_LOADED | FRAME_ERROR → PET_READY`

The browser proof should stop as soon as the first missing transition is identified and preserve console/CSP/frame diagnostics.

Only after this gate identifies the failing layer may an extension repair be attempted.
