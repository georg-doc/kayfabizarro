# TEST REPORT · CLAY-EMANATA-V1 · concept checkpoint

Date: 2026-09-27  
Repo: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/toolbox-clay-emanata-v1-2026-09-27`

This slice changes **documentation / proposed semantic catalog only**. No ToolBox runtime or Stage candidate was built, so no browser/runtime PASS is claimed.

## Actual checks run

| Check | Result |
|---|---|
| `clay-emanata.v0.1.json` parses as JSON | **PASS** |
| Emanata family count | **19** |
| Named acting preset count | **18** |
| First proof IDs | **4 IDs / 3 visual families**: `tear_bead`, `tear_burst`, `heart`, `shock_rays` |
| Default active-family budget | **1 family / actor** |
| Current ToolBox Return source read | **PASS** |
| Current ToolBox Recovery source read | **PASS** |
| Current ToolBox SOURCE source read | **PASS** |
| Current ToolBox TEST_REPORT source read | **PASS** |
| Current `clay-lids.v1.js` source read | **PASS** |
| KFB custom asset registry source read | **PASS** |
| Cartoon animation SOP source read | **PASS** |
| 3D Cartoon Style source read | **PASS** |
| Cartoon Authoring Living Brief source read | **PASS** |
| Total required source reads | **9/9 PASS** |
| Repo-exact 2D Emanata registry pin | **PASS** · blob `bfcd4780e8d31363eb2ac771909cf800911d9c35` |
| Current Return contains `RECOVERY-01` gate | **PASS** |
| Reserved Stage file exists | **NO / expected** |
| Runtime tests | **NOT RUN — runtime unchanged** |
| Browser visual tests | **NOT RUN — no candidate runtime/Stage exists** |
| Human visual review | **NOT REQUESTED — no integrated visual candidate exists yet** |

## Current upstream baseline carried into the brief

The newest checked-in Production-02 Session Cut reports:

- page/load: PASS;
- self-test: **27/28**, Clay-Lids step 27 FAIL;
- Studio Viseme parity/layout issues remain open;
- exactly one next gate: **RECOVERY-01**.

Clay Emanata implementation must not lower that future baseline silently.

## Source identity verified

2D Emanata donor:

`media/2D_Assets/KFB_Custom/KFB_Emanata_ChatGPT Image 12. Aug. 2026, 16_41_34.png`

Registry metadata:
- blob: `bfcd4780e8d31363eb2ac771909cf800911d9c35`;
- source commit: `378b209355b13304e3cff656ec0806ca5b89df28`;
- size: `2,175,271 B`.

## Stage status

Reserved route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/clay-emanata-v1/`

Status: **NOT DEPLOYED**. No claim of public availability or visual verification.

## Next test gate

After RECOVERY-01 and Claude Design implementation:

1. establish current ToolBox baseline;
2. isolate/show exact donors;
3. run tears + hearts + shock rays on one real current Resident;
4. verify anchors, stable seed, one-family budget, cleanup/retrigger and pool stability;
5. rerun all existing ToolBox tests;
6. only then package a Stage candidate and perform browser/visual evidence.


## Reaction Choreography extension checks

This remains a **contract/source checkpoint**, not a runtime implementation.

| Check | Result |
|---|---|
| `reaction-choreography.v0.1.json` parses as JSON | **PASS** |
| Core semantic event recipes | **17** |
| Semantic reaction clip roles | **15** |
| First integrated proof events | **5** |
| Reaction owner/source reads | **7/7 PASS** |
| EyeRig v6 owner pin | **PASS** · `853bcf5f...` |
| Face owner pin | **PASS** · `583807bd...` |
| Body-shape owner pin | **PASS** · `60f2a57f...` |
| PoseRig owner pin | **PASS** · `a418fe55...` |
| Motion Library catalog pin | **PASS** · `694d7977...` |
| Resident Atlas subtree-layer evidence | **PASS** · `a1e21656...` |
| Ear Dangle PR #214 donor pin | **PASS** · `6bb4531a...` |
| Animation clips included as primary skeletal reaction layer | **YES / contract only** |
| Runtime choreography tests | **NOT RUN — implementation blocked by RECOVERY-01** |

Verified source behavior incorporated into the contract:

- EyeRig: `applyEmote`, `blinkNow`, `setKinetics`, `setLife`;
- Face: Brow-Life / `browReact`, mouth swap respecting Talk/Viseme ownership;
- Ear Dangle: acted pose + `impulse` + spring recovery, updated after mixer/root movement;
- Body Shape: morphology update after mixer, explicitly **not** reaction animation ownership;
- Resident Atlas: existing clip layering along a bone subtree;
- current Motion Library emotional clips are classified as state/hold candidates unless proven as one-shot reaction clips.

No browser/runtime/visual PASS is claimed by these additional checks.
