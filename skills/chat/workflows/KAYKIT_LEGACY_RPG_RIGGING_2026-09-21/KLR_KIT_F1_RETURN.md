# KLR-KIT-F1 · Selector Regression Isolation · RETURN

**Date:** 2026-09-21  
**Owner:** KFB ToolBox / Rigging  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/klr-kit-f1-2026-09-21`  
**Base / frozen KLR-KIT candidate:** `e3a06e3451637a8b447192113cab43f3ece84cd8`  
**Tested head:** `44d595bc60259f4a74da7043df13582f1b5ccd89`  
**Status:** PASS · LOCAL BROWSER / WEBGL · NO PUBLIC STAGE

## Goal

Repair exactly the proven KLR-KIT selector regression and prove one deterministic recipe only:

`gate-16 = Knight + Rogue Head C + no held item`

No three-seed matrix, Combat integration, WhackMan integration, Stage publication or Live promotion was performed.

## Implementation

Runtime change only:

`syncModeButtons()`

from the broken single-node selector:

`$('[data-mode]')`

back to the existing collection helper:

`$$('[data-mode]')`

The repair is mirrored in:

- `tools/KFB-ToolBox/legacy-rpg-rigging/app.js`
- `kfb-hub/stage/toolbox/legacy-rpg-rigging/app.js`

No source asset, ActorRecipe schema, Rig_Legacy assembly, EyeRig, Combat or gameplay owner changed.

## Write/recovery note

The first F1 write used JavaScript `String.replace()` with a replacement string containing `$$`, reproducing the same replacement-string collapse and producing no semantic tree change.

Readback caught it immediately.

The actual repair used literal-safe `split/join`, then both exact files were read back and confirmed to contain:

`$$('[data-mode]')`

This is preserved as useful tooling evidence; no force-push was used.

## Tests

Workflow:
`35552848730`

Job:
`106190694773`

Result:
**SUCCESS**

### Existing static/source contracts

**33/33 PASS**

### ActorRecipe deterministic suite

**16/16 PASS**

### Focused selector regression

**2/2 PASS**

- Tool app collection selector
- Stage mirror collection selector

### Isolated browser/WebGL gate

**21/21 PASS**

Proved:

- HTTP PASS
- boot READY
- randomizer UI exists
- WebGL canvas
- initial source isolate settled
- `gate-16` reaches assembly `ready`
- ready token matches request `1:knight:rogue-c`
- assembly identity = Knight / Rogue Head C
- UI body/head = Knight / Rogue Head C
- no held item
- `RIG_LEGACY`
- `ASSEMBLED`
- visible identity = `Knight + Rogue Head C`
- recipe seed = `gate-16`
- recipe body/head exact
- recipe held values exact null/null
- recipe key DOM exact
- 30 clips retained
- core parts retained
- 0 failed HTTP/resources
- 0 page/console errors

Recipe key:

`Rig_Legacy|knight|rogue-c|extras|R:-|L:-|eb48f50489b9e4903ec1e3d2fb1837605ce7d792|10a7fdce6b3a1ae22504ade71b7dbec5f25e0ff0`

## Evidence

Artifact:
`10618729208`

Name:
`klr-kit-f1-evidence`

Digest:
`sha256:d2983c413b975f3d00bfbfb87564c5b90e16be4a99deb1bcd29369a4cb335c64`

Files:
- `gate-16.png`
- `browser.json`

## PR handling

No new PR was opened for this F1 branch because the inherited KLR-KIT workflow has a `pull_request` trigger that would immediately resume the deferred three-seed matrix. F1 remains a bounded branch + Actions evidence slice.

The parent Draft PR remains:
`#155`

## Public Stage

Intended Legacy route remains:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/legacy-rpg-rigging/`

**NOT PUBLIC_VERIFIED.**

No F1 runtime was copied to `cloudflare-live`.

## Unresolved

- three-seed browser matrix has not been resumed;
- repeat-seed determinism is not browser-proven in F1;
- Combat consumer integration not started;
- WhackMan consumer integration not started;
- Legacy public Stage not published;
- Georg visual review remains pending.

## Exactly one next gate

**Resume the KLR-KIT-01 three-seed browser matrix** on a fresh bounded branch using the repaired selector seam:

`gate-16 → gate-75 → gate-33 → repeat gate-16`

Require exact recipe/UI identity, same-seed reconstruction, at least two unique recipes, 0 failed resources and 0 browser errors.

Do not start Combat/WhackMan integration or public Stage before that matrix passes.
