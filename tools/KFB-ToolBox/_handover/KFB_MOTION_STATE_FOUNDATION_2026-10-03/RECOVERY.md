# RECOVERY · KFB Animation/Motion SSOT Foundation

## Human intent

One central 3D animation/locomotion truth.

Do not build another Travel-, Combat- or Resident-local locomotion state machine.

Parallel Island World / Residents / EyeRig work remains active.

## Current owner

KFB ToolBox / Animation-Motion authoring

Repository:
georg-doc/kayfabizarro

Branch:
chatgpt-web/motion-ssot-convergence-2026-10-03

Draft PR:
#333

Current tested head:
aaf7f899caee381ede876a50276e0a3d2aaeb6c8

## What is proven

- central pure motion-state-machine exists;
- exact existing locomotion/anim-map donors are promoted byte-identically into the same candidate owner line;
- semantic state selection consumes real motion facts instead of number-key state selection;
- gait thresholds/hysteresis derive from measured speed windows;
- missing data remains pending;
- Blender measurement intake has a versioned schema/template;
- focused Foundation CI is green.

## What remains open

Do not claim final locomotion yet.

Open:
- reconcile Blender MCP measurements against current Three.js/KCL measurements;
- resolve approved playback ranges;
- resolve Walking_A/B/C semantic use;
- resolve Jog/Fast-Walk profile;
- resolve Sprint source/rate;
- cross-check backward/strafe/jump;
- turn policy;
- clean neutral ActionFigure WASD+Shift+Space prototype;
- Georg visual/freeplay acceptance.

## Recovery source order

1. START_HERE.md
2. SOURCE.json
3. TEST_REPORT.md
4. ../../docs/MOTION_PROFILE_ROUTER.md
5. ../../kfb-lib/MOTION_STATE_CONTRACT.v1.json
6. ../../kfb-lib/motion-state-machine.v1.js
7. ../../kaykit-motion-lab-v1/BLENDER_MEASUREMENT_BRIEF.md

## Exactly one next action

Build the measurement reconciler:
existing KCL/Three.js facts + Blender intake
→ per-clip agreement/delta/unresolved report
→ one merged candidate profile
without silently preferring either measurement source.

Then use that reconciled profile for the neutral ActionFigure prototype.


## Blender lane alignment · 2026-10-03

Active Blender measurement job is NOT the earlier local template.

Use:
- branch `coworker/locomotion-ladder-01-brief-2026-10-03`
- brief blob `746cd98e7185907cc18a95112a235e4bfbbdfd8f`
- incoming artifact `LOCOMOTION_LADDER_01.json`

Motion Library v6 was independently checked from Dropbox by this chat:
- catalogue schema `kfb.motion-catalog.v1`
- version `2026-09-30`
- 370 total clips
- 148 clips in group `locomotion`
- existing locomotion sets include male_basic, female_basic, magic_caster, drunk, carry_box, carry_holding and wheelbarrow.

The private Dropbox catalogue is not copied into this public branch.

### Updated next action

Do NOT invent a second Blender schema or preselect a gait ladder.

Wait for the actual GitHub-delivered `LOCOMOTION_LADDER_01.json`, inspect its real schema, then run the existing measurement reconciler against:
1. KCL/Three.js measurements;
2. Motion Library v6 facts;
3. Blender ladder measurements.

Every disagreement remains visible and unresolved until an explicit decision.


## Blender ladder delivered · 2026-10-03

PR #334 delivered the requested measurement/data return and has now been copied byte-identically into the current Motion SSOT evidence folder.

Exact intake:
- `evidence/blender-ladder/LOCOMOTION_LADDER_01.json`
  - blob `aa089a25157b057fd2456b8305f2ce97f3858972`
- `evidence/blender-ladder/RETURN.md`
  - blob `565aa5327a3597189b53ac664a576b120055ba22`
- `evidence/blender-ladder/KFB_LOCOMOTION_LADDER_01_review_plan.json`
  - blob `8eef67369a208182bd7f470bd9ec87113033121b`

Key measured findings:
- KayKit-only Walk→Run has a large no-slip gap;
- Blender candidate ladder uses walk → jog → runEasy → run;
- no accepted clean sprint source yet;
- backward/strafe still need large stretch and remain review items;
- several same-clip measurements differ >10% from Motion Lab v1 and stay unresolved;
- no ladder is HUMAN_ACCEPTED yet.

### Current next action

Reconcile the delivered ladder against KCL/Three.js and Motion Library facts, preserving all conflicts.
Then build the clean neutral ActionFigure prototype from the explicitly resolved profile only.

Do not integrate Travel/Combat/Residents before that prototype passes Georg visually.


## Ladder 02 convergence · CURRENT · 2026-10-03

This section supersedes the earlier Ladder 01 / Motion Library v6 next-action notes above.

### Exact current state

- PR #333 / `chatgpt-web/motion-ssot-convergence-2026-10-03`
- tested head `aaf7f899caee381ede876a50276e0a3d2aaeb6c8`
- Motion Library v7 donor subtree `ca6218cc0d79f9e75f1ffccc2715f60cecf0e2bb`
- catalogue blob `7f333d0a1809ff5b299263a5e2ec21a29dba723c`
- 395 clips
- Ladder 02 evidence blob `59f49e9952b0d266c7cd435e85de601bd9da94f1`

PR #336 is now a donor/evidence line, not a second current Motion owner.

### Proven

Forward technical ladder:
`walk → jog → run.easy → run → sprint`

Selected technical candidates:
- walk `kfb_locomotion_walking_c`
- jog `kfb_locomotion_jog_forward_a`
- run.easy `kfb_locomotion_slow_run_a`
- run `kfb_locomotion_medium_run_a`
- sprint `kfb_locomotion_sprint_a`

The adapter derives exact shared handoff boundaries from measured handoff speed / measured natural speed. It does not use the rounded display rates as runtime truth.

CI:
- ToolBox Motion State Foundation run `37094212032` / job `111120689860` · SUCCESS
- 26/26 Node tests PASS
- JavaScript syntax PASS
- JSON contracts PASS
- exact Ladder 02 reconcile smoke PASS
- Production Resource Registry run `37094211990` · SUCCESS
- Asset Registry Refresh run `37094211962` · SUCCESS

### Deliberately unresolved

The KCL same-clip cross-check for `Walking_A` and `Running_A` remains 2/2 unresolved because the methods produce different speeds. No source wins silently. This does **not** block the independently measured Ladder 02 forward technical candidate.

Human visual choice remains open for jog/run/sprint. Directional gaps remain as recorded in Ladder 02.

### Exactly one next action

Build the neutral ActionFigure freeplay prototype on PR #333's central owner and use that real moving character to choose/accept the look.

Do not return to Travel Globe as a test host. After Georg PASS, integrate the same owner into procedural World #332.


## ActionFigure freeplay · CURRENT · 2026-10-03

The neutral ActionFigure prototype is now implemented and browser-proven.

Tested implementation head:
`f1ce90d31a18973fa981bc982309c4bb01b204b8`

Proof:
- ActionFigure Freeplay run `37125874478` · SUCCESS;
- Motion Foundation `37125874493` · 27/27 PASS;
- Resource Registry + Asset Registry PASS;
- exact tested Site mirror persisted as file `c3588833-b1c3-4392-8582-1f80a2c55eed`.

Current next action is now a genuine human visual/freeplay decision, not another technical implementation gate.

### Plain-language continuation

**Next executor: Georg.**

Open the private Site link delivered in chat and test WASD / Shift / Space plus Jog A/B, Run A/B, Sprint A/B.

After Georg replies with the preferred variants, ChatGPT Web/GitHub acts next and records those choices before integrating the same Motion owner into procedural World #332.

Cloudflare publication is deferred. Travel Globe remains excluded.


## HUMAN FAIL OVERRIDE · 2026-10-03

This section supersedes the earlier "ActionFigure freeplay current" section.

The browser candidate is frozen:
`ARCHIVED_FAILED_CANDIDATE`.

Georg's observed failure:
- step length mismatch;
- jitter/wobble;
- arms pressed into/inside body;
- dirty transitions;
- jump mismatch;
- jerky animation timing.

### Proven source-policy regression

The current branch already contains the canonical KayKit-native profile:
`tools/KFB-ToolBox/kfb-lib/locomotion-profiles.v1.js`
blob `3db9fbd482e6a527c417e79af826138ff28efa33`.

Its rule is explicit:
KayKit Character Animations 1.1 is the native role owner; Mixamo / KFB Motion Library is the variant/action layer and must not overwrite those roles.

The mixed Ladder-02 forward family violated that policy.

### Recovery donors

- ActionFigure source blob `4785276defdb929cb397954eb74b76aecb84486b`
- KayKit Character Animations 1.1 @ `b97b5ac55df2724fae623992433685583eece51e`
- General GLB `5d16cb6815fc8371705147188813f851c10ba26a`
- MovementBasic GLB `98e965e886ec539e80f8984a77a29b0c1c02e5e5`
- MovementAdvanced GLB `f3ea309627f3ad76b92b85877ebc46f945cd4f1d`
- J14 native ActionFigure profile blob `f88522de6a6b087d9ff4d609e8ad0238072a848c`
- KCL-M1 remains independent measurement evidence

Ladder 02 / Motion Library v7 are retained only as later gap-fill donors.

### Current continuation

Read:
`skills/chat/workflows/KAYKIT_NATIVE_LOCOMOTION_BASELINE_01_2026-10-03/START_HERE.md`

Next executor:
**Coworker / Blender MCP**

Georg:
**Du musst jetzt nichts tun.**
