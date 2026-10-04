# TEST REPORT · WORLD-MULTI-ISLAND-CORRIDOR-01

Status: **PASS**

Tested implementation head:
`0841b89ae8274118687e946318458201b402c5b5`

| Gate | Evidence | Result |
|---|---|---|
| source/syntax | run 37166355940 · job 111329943298 | **9/9 PASS** |
| Chromium/WebGL | run 37166356027 · job 111329943523 | **PASS** |
| browser evidence | artifact 11289583486 · sha256:c6a3da665ad0b113ac23a50c263fd36c7a3dc1478ef37f2f37a3508e013ad472 | **PRESENT** |
| Resource Registry | run 37166355944 · job 111329943425 | **PASS** |

The browser gate explicitly rejects the candidate unless it has:
- 4 stable world nodes;
- 3 `ROAD_BRIDGE` connections owned by Track Core;
- Dystopia/Utopia/Protopia deck routing;
- Golden-Journey anchor IDs;
- four visible island groups;
- four reused building-owner reports with `kfb-facade-rule-v1`;
- one WB2 canvas;
- no legacy `wi1-play`, Travel Globe or card-start resource;
- no page/console error gate.

No Player/Drive/Resident behavior is claimed by this test.


## KFB-LOCO-WB2-PLAYER-01 · BROWSER PASS · 2026-10-04

Tested runtime/test head: `531fcc3f912d226254bab0e5e43a0a78750f001b`. Existing Draft PR #348, WB2 receiving owner.

**Result:** native Mannequin_Medium is controllable in the existing Town / Dystopia / Utopia / Protopia world. W progresses Walking_B → Running_A; Shift reaches Running_B; S moves backward; A/D turn. Jog remains the specified shared-phase neighbour blend. RMB orbit, wheel zoom and Ground follow camera work. Save/reload restores actor profile, world, position and heading with zero held input/speed.

**Evidence:** source/contract tests **13/13 PASS**, Chromium/WebGL player checks **10/10 PASS**, original four-island / three Track-Core bridge / building / single-canvas regression **PASS**, page errors **0**, console errors **0**. Browser run [37177630060](https://github.com/georg-doc/kayfabizarro/actions/runs/37177630060), job `111363480592`; source run `37177630053`; Resource Registry run `37177631103` **PASS**. Artifact `11293584372` · `sha256:943aa9daf8b71ecad996b0a508ac7b97c8678dda20aa8fb46818289786713991`. Durable readback: `player-01-evidence/state.json`. Town idle/run/sprint, native source-isolate and four-island images are preserved in the linked Actions artifact; local review copies remain available.

**Retained owners:** WB2 renderer/edit/save/world; R2D world data; Track Core roads/bridges; P1/P2 environment; existing building/facade family. One planar Ground writer extracted from WB0 intent/camera semantics and one native animation mixer. No consumer rig scaling or native clip retiming. Motion contract copied semantically unchanged from #344 @ `dfb6b8a15b3f04c52f49825252fcaf60f45df51c`. Original asset blobs are identical on the Motion and World refs; four native clips bind **251/251 available tracks**, omitting only the two absent hand slots (24 channels across four clips). Native root x/z translations are zero, so no double root travel.

**Limits:** no new WB2 centimetre foot-creep certification was made. The accepted Blender RAMP_02 remains the visual/measurement reference; original timing, phase, speeds and metre rig are preserved. Known start/stop/turn/strafe gaps remain as in that contract. No public Stage/deployment or human freeplay acceptance is claimed. Local In-App Browser visibly verified the integrated player; Chromium evidence is the repeatable runtime proof.

**Next internal action:** continue the Resident/activity seam under the existing `ONE_SHOT_INTEGRATION_LOCK_2026-10-04.md`, inside this same world/PR. This is an internal checkpoint, not a new Georg-facing approval gate. The explicitly requested Player checkpoint ends here; no Resident, Drive or Flight implementation was added in this turn.
