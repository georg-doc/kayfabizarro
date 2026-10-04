# RECOVERY · WB2 convergence + Golden corridor

Status: **WORLD-CONVERGENCE-BASE-01 PASS · WORLD-MULTI-ISLAND-CORRIDOR-01 PASS**

Owner: KFB WorldBuilder / WB2  
Branch: `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04`  
Draft PR: **#348**  
Tested corridor implementation head: `0841b89ae8274118687e946318458201b402c5b5`

## Product reality

The current-main WB2 world base is clean and the four-island MVP corridor is now real browser-proven world data:
- KFB Town;
- Dystopia;
- Utopia;
- Protopia;
- three Track-Core `ROAD_BRIDGE` connections;
- Golden-Journey anchors;
- canonical deck/Card seed refs.

No Player, Motion, Drive or Resident runtime is mounted yet.

## Passing corridor evidence

- Source: **9/9 PASS** · run `37166355940` / job `111329943298`.
- Chromium/WebGL: **PASS** · run `37166356027` / job `111329943523`.
- Browser artifact: `11289583486`.
- Digest: `sha256:c6a3da665ad0b113ac23a50c263fd36c7a3dc1478ef37f2f37a3508e013ad472`.
- Resource Registry: **PASS** · run `37166355944` / job `111329943425`.

Browser QA proves:
- 4 world nodes;
- 3 Track Core bridge connections;
- canonical future deck routing;
- required Golden-Journey anchor IDs;
- 4 island presentation groups;
- 4 existing facade/building-owner reports;
- no `wi1-play`, Travel Globe or card-start host;
- one WB2 renderer canvas;
- no unexpected page/console error gate.

## World recipe source

`WORLD_RECIPES.json` is now the corridor fixture.
The compressed island distances are explicitly MVP-scale data derived from the prior R2C directional relation, not final movement balance.

Global rule:
**PULL, DON'T GATE.**
All islands are physically explorable; later state gates Card/reward handoffs rather than world access.

## Motion dependency correction · 2026-10-04

Motion PR #344 is complete.
The accepted/decided Medium set is:
Walking_B → Running_A → Running_B, with jog as speed/phase blend.

Read exact Motion owner at PR #344 head `dfb6b8a15b3f04c52f49825252fcaf60f45df51c`:
- `RETURN/KAYKIT_NATIVE_BASELINE_01_RETURN.md`
- `KAYKIT_LOCO_SET_01/HANDOVER_AND_PROPOSAL_KAYKIT_LOCO_SET_01.md`
- `KAYKIT_LOCO_SET_01/KFB_KAYKIT_LOCO_SET_01.v1.json`

## One-Shot execution correction · 2026-10-04

The former Player → Resident sequence remains valid **internally**, but is no longer a series of external gates.

Current execution authority:
`skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/ONE_SHOT_INTEGRATION_LOCK_2026-10-04.md`.

Internal order begins with:
1. `KFB_LOCO_WB2_PLAYER_01_BRIEF.md`;
2. Resident-set integration;
3. Golden Journey interactions/Drive/performance;
4. Curtain/Character Select;
5. Almanac/Lean Memory;
6. Site Stage and end-to-end acceptance.

WSA/Codex checkpoints and continues automatically unless a real blocker or Georg-only product decision appears.

## Exactly one next action

**WSA / Codex runs the One-Shot on PR #348.**


## KFB-LOCO-WB2-PLAYER-01 · implementation checkpoint · 2026-10-04

Owner WB2, existing PR #348. Added native Mannequin_Medium, pinned Motion #344 contract copy, shared planar WB0 Ground extraction and one speed/phase AnimationMixer. Four-island world/Track Core/render owners retained. Source regression 9/9 PASS; syntax PASS. Runtime/browser is NOT YET VERIFIED. No Stage/merge/Live. Next action: integrated browser input, native binding, support and save/resume proof; stop before Residents.


## KFB-LOCO-WB2-PLAYER-01 · BROWSER PASS · 2026-10-04

Tested runtime/test head: `531fcc3f912d226254bab0e5e43a0a78750f001b`. Existing Draft PR #348, WB2 receiving owner.

**Result:** native Mannequin_Medium is controllable in the existing Town / Dystopia / Utopia / Protopia world. W progresses Walking_B → Running_A; Shift reaches Running_B; S moves backward; A/D turn. Jog remains the specified shared-phase neighbour blend. RMB orbit, wheel zoom and Ground follow camera work. Save/reload restores actor profile, world, position and heading with zero held input/speed.

**Evidence:** source/contract tests **13/13 PASS**, Chromium/WebGL player checks **10/10 PASS**, original four-island / three Track-Core bridge / building / single-canvas regression **PASS**, page errors **0**, console errors **0**. Browser run [37177630060](https://github.com/georg-doc/kayfabizarro/actions/runs/37177630060), job `111363480592`; source run `37177630053`; Resource Registry run `37177631103` **PASS**. Artifact `11293584372` · `sha256:943aa9daf8b71ecad996b0a508ac7b97c8678dda20aa8fb46818289786713991`. Durable readback: `player-01-evidence/state.json`. Town idle/run/sprint, native source-isolate and four-island images are preserved in the linked Actions artifact; local review copies remain available.

**Retained owners:** WB2 renderer/edit/save/world; R2D world data; Track Core roads/bridges; P1/P2 environment; existing building/facade family. One planar Ground writer extracted from WB0 intent/camera semantics and one native animation mixer. No consumer rig scaling or native clip retiming. Motion contract copied semantically unchanged from #344 @ `dfb6b8a15b3f04c52f49825252fcaf60f45df51c`. Original asset blobs are identical on the Motion and World refs; four native clips bind **251/251 available tracks**, omitting only the two absent hand slots (24 channels across four clips). Native root x/z translations are zero, so no double root travel.

**Limits:** no new WB2 centimetre foot-creep certification was made. The accepted Blender RAMP_02 remains the visual/measurement reference; original timing, phase, speeds and metre rig are preserved. Known start/stop/turn/strafe gaps remain as in that contract. No public Stage/deployment or human freeplay acceptance is claimed. Local In-App Browser visibly verified the integrated player; Chromium evidence is the repeatable runtime proof.

**Next internal action:** continue the Resident/activity seam under the existing `ONE_SHOT_INTEGRATION_LOCK_2026-10-04.md`, inside this same world/PR. This is an internal checkpoint, not a new Georg-facing approval gate. The explicitly requested Player checkpoint ends here; no Resident, Drive or Flight implementation was added in this turn.
