# EYE_RIG_UNIFIED_SITE_01

Date: 2026-10-04  
Owner: KFB ToolBox / Rigging  
Repo: `georg-doc/kayfabizarro`  
Branch: `toolbox/eye-rig-batch-2026-09-18`  
Draft PR: #104

## Outcome

One productive EyeRig workbench now owns all three character families:

`Medium | Large | Legacy`

There is no second productive Legacy UI.

Legacy PR #162 is retained as source/evidence donor only:
- 17/17 persisted profiles;
- 16 MEASURED_CANDIDATE;
- Skull HUMAN_REQUIRED;
- 247/247 automatic browser proof;
- 215/215 persisted-profile remount proof.

The unified #104 interface consumes those exact data/donors and exposes the same controls already accepted for Medium/Large.

## Unified runtime

Source root:
`tools/KFB-ToolBox/eye-rig-batch/`

Entry:
`index.html`

Common UI includes:
- class switch Medium / Large / Legacy;
- actor roster / review states;
- Front / 3/4 / Side / Face;
- Neutral / Clay K1;
- bounded wheel zoom;
- source-eye cleanup toggle;
- Placement;
- Oval;
- Pupil / gaze;
- expressions / blink;
- numeric direct entry;
- import/export;
- Approve / Adjusted approve / Reject workflow.

Persistence remains:
`kfb.toolbox.eye-rig-batch.v0`

Legacy is additive to that storage. Existing Medium/Large browser data is not cleared or migrated destructively.

## Legacy runtime seam

Legacy is class-specific only at actor construction:

exact head source
→ proven Rig_Legacy modular assembly
→ LegacyFaceHost
→ persisted Legacy profile
→ existing EyeRig v6
→ common #104 controls/review/persistence

Local exact donor copies:
- `lib/legacy/legacy-rig-adapter.v1.js` · blob `41ba111d264cb73f2b3fbd70370dbb0ba042c91d`
- `lib/legacy/legacy-facehost.v1.js` · blob `186323777ff78a9e4f4a246ad10232dd8ef82bc9`

No second EyeRig runtime owner is introduced.

## Evidence

Implementation checkpoints:
- Legacy donor/data intake: `4c34e076360b5e9ece502ff42c8d00130bb41f63`
- unified three-class runtime: `847954178551952c9f5860cede3cae7fe57bf3ed`
- unified static contract: `9247d6b3832bdb73fac20d55bf76a766bc2d4453`

Focused unified readback:
**33/33 PASS**

Expanded static contract:
**160 assertions persisted · NOT_RUN**
(no GitHub Actions run exists for the current head; do not relabel as CI PASS).

Historical Legacy technical proof remains separate:
- 24/24 static + 247/247 browser/WebGL;
- 30/30 profile + 215/215 persisted-remount browser/WebGL.

Medium/Large baseline was human-accepted before this integration.

## Site publication

The productive target is now a **ChatGPT Site**, not another Cloudflare review fork.

Site source:
- publish the source root above;
- use `index.html` as entrypoint;
- preserve relative files under `data/`, `lib/`, `docs/`;
- do not replace the UI with a generated dashboard;
- do not embed the old Legacy page;
- do not introduce a second storage namespace.

Cloudflare remains recovery/regression infrastructure only.

### Work handoff

Use Work/Site publishing for the final publication action because the current Webchat toolset has no Site create/publish action.

Instruction:

> Publish the existing unified EyeRig workbench from `georg-doc/kayfabizarro`, branch `toolbox/eye-rig-batch-2026-09-18`, source root `tools/KFB-ToolBox/eye-rig-batch/`, entrypoint `index.html`, as one ChatGPT Site. Do not redesign it. Preserve all relative files, the `Medium | Large | Legacy` class switch, and storage key `kfb.toolbox.eye-rig-batch.v0`. Return the resulting Site URL and publication revision only; do not merge PR #104 or promote any other runtime.

## Gates

Publishing gate:
`EYE_RIG_UNIFIED_SITE_PUBLISH_01`

After the Site exists, first human gate:
`GEORG_EYERIG_UNIFIED_SITE_01`

Human check:
1. Medium loads with previous saved state;
2. Large switch works;
3. Legacy switch opens the 17-head roster in the same UI;
4. Barbarian Default and one alternate head load their persisted EyeRig profiles;
5. Skull remains clearly manual/HUMAN_REQUIRED;
6. numeric controls, wheel zoom and Neutral/Clay K1 still work;
7. reload preserves class + profiles.

Per-eye/eyepatch remains deferred detail after unified Site acceptance.

No auto-merge or Live promotion.
