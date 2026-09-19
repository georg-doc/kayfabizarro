# Batch EyeRig Atlas · Test Report

Date: 2026-09-19  
Owner: KFB ToolBox / Rigging  
Source branch: `toolbox/eye-rig-batch-2026-09-18`  
Implementation checkpoint: `d900fb99f3b04d52f266febd1501368c5fedd360`

## STATIC / CONTRACT TESTS

Executed locally against the exact candidate files before GitHub persistence:

- static contract suite: **22 / 22 PASS**
- JavaScript syntax checks: **3 / 3 PASS**
  - `app.js`
  - `lib/kaykit-eye-adapter.v1.js`
  - `lib/source-face-cleanup.v1.js`

The 22 gates cover:

1. required file presence;
2. one localStorage namespace: `kfb.toolbox.eye-rig-batch.v0`;
3. no `localStorage.clear()`;
4. pinned source revision;
5. EyeRig `update(dt)` in the rendered frame loop;
6. exactly one `THREE.AnimationMixer` constructor;
7. source-eye cleanup fails closed;
8. cleanup reuses `faceShells()` + `buildStripped()`;
9. no GLTF/GLB exporter or canonical source write;
10. lashes forced off;
11. neutral expression + settle ticks before visible-ready;
12. all six existing expression IDs;
13. front / 3/4 L / 3/4 R / side L / side R / face cameras;
14. bind / idle / walk / run / jump motion buttons;
15. non-destructive profile import preview;
16. no promotion to a global `kfb.eye-profile/1` schema.

## GITHUB PERSISTENCE CHECK

After commit `d900fb9`, the branch head and all six runtime/test paths were fetched back through GitHub.

Git blob identity against the tested local candidate:

- `app.js`: exact blob match;
- `lib/kaykit-eye-adapter.v1.js`: exact blob match;
- `lib/source-face-cleanup.v1.js`: exact blob match;
- `tests/static-check.mjs`: exact blob match;
- `index.html`: exact after removing only the terminal newline;
- `styles.css`: exact after removing only the terminal newline.

No semantic difference was introduced by the connector write.

## BROWSER PASSES

Two Chromium attempts were made from the available container:

### Pass 1 · normal headless Chromium

Result: **BROWSER_ENVIRONMENT_UNAVAILABLE** before application execution.

Observed renderer startup errors included:

- `DisplayVkXcb xcb_connect failed`;
- `EGL_NOT_INITIALIZED`;
- GPU process exit / timeout before the page reached the EyeRig runtime.

### Pass 2 · software / SwiftShader attempt

Result: **BROWSER_ENVIRONMENT_UNAVAILABLE** before application execution.

The same EGL/X initialization boundary occurred. Per the two-pass recovery rule, no further local renderer repair was attempted.

This is **not** recorded as an application/browser FAIL because the app did not reach boot. It is also **not** a browser PASS.

## CURRENT TEST STATUS

| Gate | Result |
|---|---|
| static contract suite | PASS · 22/22 |
| JS syntax | PASS · 3/3 |
| GitHub persistence | PASS |
| local Chromium renderer | ENVIRONMENT_UNAVAILABLE · 2/2 pre-app failures |
| exact Cloudflare Stage URL | NOT_TESTED |
| visible 12-component source-face report | NOT_TESTED |
| visible FaceHost `OK` report | NOT_TESTED |
| neutral/open EyeRig visual boot | NOT_TESTED |
| blink / gaze / six-expression visual behavior | NOT_TESTED |
| locomotion attachment regression | NOT_TESTED |
| profile import/export interaction in browser | NOT_TESTED |

The next valid visual gate is the normal-browser Cloudflare Stage route, not another container Chromium workaround.


## PUBLICATION CHECKPOINT

Stage mirror commit: `f309948a3bd265154e6d3f5c959b69ec9b725f26` on `cloudflare-live`.

The publication branch was fetched back after the write and contains:

- the Stage HTML with visible `candidate f23b2f6 · PR #104 · Stage`;
- byte-identical runtime blobs for `app.js`, CSS, adapter and source-face cleanup;
- the GothGirl seed and source audit;
- a KFB Hub card linking directly to the Stage route.

Main router/Hub metadata was updated separately at `ac067d09919f744750649e3652dd00036d7ccd6f` without merging EyeRig implementation code.

Exact public route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/eye-rig-batch/`

Public verification attempt result: **ENVIRONMENT_UNAVAILABLE**. The web fetcher reports the `pages.dev` route as inaccessible, and the execution container reports temporary DNS resolution failure for `kayfabizarro.pages.dev`. No `PUBLIC_VERIFIED` claim is made.

This is now a **human browser gate**, not another source-code repair pass.
