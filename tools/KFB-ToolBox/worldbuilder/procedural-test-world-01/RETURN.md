# RETURN · WB2 current-main convergence + Golden corridor

Status: **PASS · WORLD READY FOR MOTION ATTACHMENT**

## Product reality

The world preflight requested for the One-Shot is complete.

The current WB2 candidate now contains one browser-proven, data-driven four-island world:
- Town hub;
- Dystopia;
- Utopia;
- Protopia.

Three inter-island routes are compiled by the existing Track Core.
The world recipe carries the Golden-Journey locations and the three future-deck/Card seed sets.
The world stays open; no quest lock blocks early exploration.

## Technical evidence

Tested implementation head:
`0841b89ae8274118687e946318458201b402c5b5`

Source:
**9/9 PASS**
run `37166355940` · job `111329943298`.

Chromium/WebGL:
**PASS**
run `37166356027` · job `111329943523`.

Artifact:
`11289583486`
`sha256:c6a3da665ad0b113ac23a50c263fd36c7a3dc1478ef37f2f37a3508e013ad472`.

Resource Registry:
**PASS**
run `37166355944` · job `111329943425`.

## Reused owners

- WB2 = renderer/world/edit/support.
- R2D core = island plan/height/masks.
- Track Core = all island roads + all three inter-island connections.
- existing P1/P2 procedural environment = nature.
- `wd1-city.js / kfb-facade-rule-v1` = building/facade owner.
- R2C palette data = Town/Utopia/Dystopia/Protopia palette identity.

No second world, road, building, movement or Resident runtime was created.

## Still intentionally absent

Player / locomotion,
Taxi/Drive,
Clown and other Residents,
Orc Band/Disco runtime,
Robots/Farmers/Lorekeeper,
Lean-Memory runtime,
Stage/Live publication.

The Golden anchors already reserve their world-space targets, so those systems can attach without rebuilding the world.

## Motion dependency correction · 2026-10-04

Motion PR #344 is **already complete**.
The stale PREPARED/NOT RUN router state has been corrected in the Motion owner.

Current consumer source:
`KAYKIT_LOCO_SET_01/KFB_KAYKIT_LOCO_SET_01.v1.json`
on Motion PR #344.

Binding Medium set:
- Walk = Walking_B
- Run = Running_A
- Sprint = Running_B
- Jog = Walk↔Run speed/phase blend
- Mannequin_Medium = reviewed runtime fixture
- ActionFigure = optional compatibility smoke only

## One-Shot execution correction · 2026-10-04

`KFB-LOCO-WB2-PLAYER-01` is **not** a separate Georg-facing next gate.
It is the first internal implementation checkpoint inside the current One-Shot.

Current execution authority:
`skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/ONE_SHOT_INTEGRATION_LOCK_2026-10-04.md`.

## Exactly one next action

**WSA / Codex continues on this PR #348 through the One-Shot internal sequence until the integrated Golden Journey candidate is ready or a real blocker/stop rule is reached.**


## KFB-LOCO-WB2-PLAYER-01 · BROWSER PASS · 2026-10-04

Tested runtime/test head: `531fcc3f912d226254bab0e5e43a0a78750f001b`. Existing Draft PR #348, WB2 receiving owner.

**Result:** native Mannequin_Medium is controllable in the existing Town / Dystopia / Utopia / Protopia world. W progresses Walking_B → Running_A; Shift reaches Running_B; S moves backward; A/D turn. Jog remains the specified shared-phase neighbour blend. RMB orbit, wheel zoom and Ground follow camera work. Save/reload restores actor profile, world, position and heading with zero held input/speed.

**Evidence:** source/contract tests **13/13 PASS**, Chromium/WebGL player checks **10/10 PASS**, original four-island / three Track-Core bridge / building / single-canvas regression **PASS**, page errors **0**, console errors **0**. Browser run [37177630060](https://github.com/georg-doc/kayfabizarro/actions/runs/37177630060), job `111363480592`; source run `37177630053`; Resource Registry run `37177631103` **PASS**. Artifact `11293584372` · `sha256:943aa9daf8b71ecad996b0a508ac7b97c8678dda20aa8fb46818289786713991`. Durable readback: `player-01-evidence/state.json`. Town idle/run/sprint, native source-isolate and four-island images are preserved in the linked Actions artifact; local review copies remain available.

**Retained owners:** WB2 renderer/edit/save/world; R2D world data; Track Core roads/bridges; P1/P2 environment; existing building/facade family. One planar Ground writer extracted from WB0 intent/camera semantics and one native animation mixer. No consumer rig scaling or native clip retiming. Motion contract copied semantically unchanged from #344 @ `dfb6b8a15b3f04c52f49825252fcaf60f45df51c`. Original asset blobs are identical on the Motion and World refs; four native clips bind **251/251 available tracks**, omitting only the two absent hand slots (24 channels across four clips). Native root x/z translations are zero, so no double root travel.

**Limits:** no new WB2 centimetre foot-creep certification was made. The accepted Blender RAMP_02 remains the visual/measurement reference; original timing, phase, speeds and metre rig are preserved. Known start/stop/turn/strafe gaps remain as in that contract. No public Stage/deployment or human freeplay acceptance is claimed. Local In-App Browser visibly verified the integrated player; Chromium evidence is the repeatable runtime proof.

**Next internal action:** continue the Resident/activity seam under the existing `ONE_SHOT_INTEGRATION_LOCK_2026-10-04.md`, inside this same world/PR. This is an internal checkpoint, not a new Georg-facing approval gate. The explicitly requested Player checkpoint ends here; no Resident, Drive or Flight implementation was added in this turn.


## 2026-10-04 · POST-WSA ONE-SHOT RECONCILIATION

Status correction after Georg's visual review and the returned Player-only WSA run:

- **Topology / WB2 ownership / Track graph / Golden anchors = PASS / KEEP.**
- **Native Player/Motion = BROWSER PASS / KEEP.**
- **Visible environment foundation = HUMAN VISUAL FAIL.**
- Legacy Hürth/OSM-derived visible content is rejected for the current MVP foundation.
- The previous phrase "existing building/facade family retained" must not be read as visible-content acceptance. Only source-clean, explicitly typed MECHANISM reuse may survive.
- The returned WSA run stopped after an internal Player checkpoint. Under the binding ONE_SHOT mode, that is incomplete execution rather than project completion.
- Residents, Drive, Golden Journey, Curtain, Almanac/Lean Memory, World Studio/Site Stage and final whole-game review remain part of the **same continuous assignment**, not separate Georg-facing jobs.

Binding continuation:
- `ONE_SHOT_RECOVERY_COMPLETION_BRIEF_2026-10-04.md`
- `ONE_SHOT_STATUS.json`
- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/ONE_SHOT_EXTERNAL_CRITIC_LOOP_2026-10-04.md`

Reserved final human Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/world-studio-mvp/`
= **RESERVED · NOT DEPLOYED**.

### Exactly one next action

**WSA / Codex resumes this same PR and continues automatically through the full recovery/completion One-Shot. It must not return after Residents, Drive, Site, or any other green internal checkpoint.**


## 2026-10-04 · Continuous One-Shot resumed / source firewall checkpoint

Verified receiving base `3989ae8a6aa12f6c00004fcc39b884285ff51077`. Valid WB2 topology, Ground/native Motion and Track work are KEEP. Legacy visible city CONTENT/PRESENTATION/DATA are REJECT; its mechanism is HOLD until cleanly decoupled. `VISIBLE_SOURCE_MANIFEST.json` resolves the intended RED / Industrial / Space Base / GREEN roster directly from the existing Registry, including exact source commits, blobs and dependencies. Independent no-code Critic established; no visual PASS or deployment claimed. Next internal action: actual original/adapted/detail source captures in the existing renderer, then replace rejected visible presentation and continue the full One-Shot.


## 2026-10-04 · Source inspection / first repair

Harness head `77a9e3a263201cb5a48f7b61d6feabd75bdcc616`: browser run `37180597250` failed before captures because Player readiness preceded async evidence adapter readiness; page/console errors were zero. Explicit evidence-ready wait added. Native RED castle was actually viewed in WB2 isolation: identity KEEP, material FAIL (overstrong rocky folds). Independent Critic confirms both. First repair reduces K2/v10 relief amplitude to 0.15, preserves source colours/shape and widens isolate framing; re-evidence pending. No visual acceptance, no Stage. Continue source-clean full MVP integration.
