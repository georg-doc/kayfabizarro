# Locomotion practice for the KFB gait ladder: research notes

Scope: third-person WASD locomotion in three.js r160 with KayKit Character Animations 1.1 (Rig_Medium / Rig_Large) plus Mixamo clips. Goal: give the Blender "gait ladder" data file and the later controller a sourced basis.

Labels: **[sourced]** means a fetched page states it. **[inference]** means my own conclusion from the sources, not stated by any of them. Every URL below was fetched or appeared in search results during this research (2026-10-03).

---

## 0. The core problem in numbers

- KayKit `Walking_A` ≈ 0.61 m/s, `Running_A` ≈ 2.48 m/s (measured by our lane, not by a source).
- Reference speed tiers from a mocap vendor: walk 2–4 km/h (0.55–1.1 m/s), jog 6–8 km/h (1.7–2.2 m/s), run 10–12 km/h (2.8–3.3 m/s), sprint 15+ km/h (4.2+ m/s) **[sourced]**.
- So `Walking_A` is a slow walk and `Running_A` is a fast jog / slow run. **[inference]**
- With a ±20% window per clip (see §1), Walk covers about 0.49–0.73 m/s and Run about 1.98–2.98 m/s. That leaves **0.73–1.98 m/s uncovered**. Stretching across it is the sliding we see. The fix is more rungs on the ladder, not a bigger multiplier. **[inference]**

---

## 1. Speed bands and playback-rate limits

| Source | Takeaway |
|---|---|
| [Epic tech blog: Adapting Lyra animation](https://www.unrealengine.com/en-US/tech-blog/adapting-lyra-animation-to-your-ue5-game) | Play rate and stride warping together should stay within **15–20% up or down**. Beyond that, quality drops noticeably. To stay inside the window, Lyra lowered movement speed and acceleration rather than stretching clips further. **[sourced]** This is the best number we found. |
| [UE docs: Pose Warping](https://dev.epicgames.com/documentation/en-us/unreal-engine/pose-warping-in-unreal-engine) | Stride warping computes `StrideScale = LocomotionSpeed / RootMotionSpeed` and moves the feet plus the pelvis (pelvis on a spring, with a max distance). The stride scale has a clamp parameter. The doc's example values are 0.5 to 2.0, which is a mechanical limit, not a quality recommendation. **[sourced]** |
| [UE docs: Set Playrate to Match Speed](https://dev.epicgames.com/documentation/unreal-engine/BlueprintAPI/DistanceMatching/SetPlayratetoMatchSpeed) | It assumes a constant-speed cycle and takes a `PlayRateClamp` (0,0 = unclamped). Meant for cycles, not starts or stops. **[sourced]** |
| [UE docs: Animation in Lyra](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-in-lyra-sample-game-in-unreal-engine) | When play rate alone isn't enough, stride warping adjusts stride length. Cycles are chosen by cardinal direction. **[sourced]** |
| [Jayden Games: Lyra breakdown](https://www.jaydengames.com/posts/ue5-black-magic-game-core-animation/) | Lyra clamps the effective play rate. The article gives no numbers. Lyra's cycle is Idle → Start → Cycle → Stop, plus Pivot. **[sourced]** |
| [MoCap Online: Locomotion animations](https://mocaponline.com/blogs/mocap-news/locomotion-animations-game-dev) | Use at least three clean speed tiers instead of two, because that reduces mid-range interpolation artifacts. Measure ground coverage per cycle and place each clip at its real speed in the blendspace. **[sourced]** |
| [nikoff: Fix foot sliding in in-place animations](https://nikoff.cc/resources/fix-foot-sliding-in-place-animations) | Implied speed = distance covered ÷ cycle duration. Large play-rate changes alter weight, cadence and personality. IK cannot fix a 2x speed mismatch. **[sourced]** |
| [Unity: 1D Blending](https://docs.unity3d.com/Manual/BlendTree-1DBlending.html) | "Compute Thresholds → Speed" places each clip at its own measured speed. This is the same idea as a gait ladder. **[sourced]** |

**What this means for us [inference]:**
- Per-clip `playRateWindow` defaults to [0.8, 1.2] (Lyra figure). Mark [0.85, 1.15] as "ideal" and use the outer band only during transitions.
- Fill gaps with a blend between two neighbouring rungs that both play near rate 1.0. Never stretch one clip. A 1D blend between Walk (0.61) and Run (2.48) still slides in the middle because the two clips have very different cadence. A Jog rung near 1.3–1.6 m/s is required.
- Optional later step: a cheap stride warp. Scale the foot IK targets along the move direction by `speed / clipSpeed` before IK. This is an approximation of what UE does.

## 2. Phase sync

| Source | Takeaway |
|---|---|
| [UE docs: Animation Sync Groups](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-sync-groups-in-unreal-engine) | Leader/follower model: the highest-weight clip leads and the others follow its timing. Marker-based sync works across clips with different lengths or step counts. Only markers present in every clip in the group get synced. Example marker name: "Right Foot Down". **[sourced]** |
| [Unity: Blend Trees manual](https://docs.unity3d.com/6000.3/Documentation/Manual/class-BlendTree.html) | Mecanim syncs clips by normalized time, so foot contacts must sit at the same normalized points: "the left foot hits at 0.0 and the right foot at 0.5". **[sourced]** |
| [Unity: Blend Tree additional options](https://docs.unity3d.com/Manual//BlendTree-AdditionalOptions.html) | The Mirror option shifts the foot cycle automatically so mirrored clips still blend. **[sourced]** Takeaway: phase offset is a property of each clip. |
| [arrowinmyknee: Sync groups in Paragon](https://arrowinmyknee.com/2019/12/29/better-animation-transition-using-sync-group-in-ue4/) | Paragon put markers where the left or right foot crosses the hip bone, in both jog-start and jog-loop. That allows a transition at any moment without sliding. **[sourced]** |
| [A Clockwork Berry / gportelli: FootSyncMarkers](https://github.com/gportelli/FootSyncMarkers) | Places foot markers automatically through animation modifiers. The page doesn't describe the method in detail. **[sourced]** |
| [HaJH: FootSyncMarkerGenerator](https://github.com/HaJH/FootSyncMarkerGenerator) | Offers several detectors: pelvis crossing along the move axis, foot velocity minima (default threshold 5 cm/s), curve saliency, or a weighted vote of these. **[sourced]** Good reference algorithms for the Blender lane. |
| [SimonDev ThreeJS_Tutorial_CharacterController (main.js)](https://github.com/simondevyoutube/ThreeJS_Tutorial_CharacterController) | Checked in the code: on walk↔run it sets `curAction.time = prevAction.time * (curDur / prevDur)`, which carries normalized phase across, then calls `crossFadeFrom(prev, 0.5, true)`. **[sourced]** This is the minimal three.js phase sync. |

**For the ladder [inference]:** store `lfdPhase`, the left-foot-down position as normalized time 0..1. Also store `rfdPhase`, because steps are not always symmetric. The controller then maps phases with `t_target = (phase - lfd_src + lfd_tgt) mod 1`. Use one detection rule for every clip (velocity minimum or pelvis crossing), otherwise the markers will disagree between clips.

## 3. Foot sliding: fix and measure

| Source | Takeaway |
|---|---|
| [Daniel Holden: Inverse Kinematics and Foot Locking](https://theorangeduck.com/page/inverse-kinematics-foot-locking) | Detects contact from toe velocity under about 0.1–0.5 m/s, with a height check around 0.1 m and a 5-frame majority filter at 60 Hz. The foot locks on contact and unlocks when contact ends or an unlock distance is exceeded. The switch is blended over 3–5 frames (inertialization). Two-bone IK solves the leg, and the toe uses a look-at. Key line: "Stop thinking about it in terms of sliding". **[sourced]** |
| [Daniel Holden: Code vs Data Driven Displacement](https://theorangeduck.com/page/code-vs-data-driven-displacement) | Options to reconcile the gameplay capsule with root motion: hard sync (responsive but slides), damped adjustment, clamped deviation, or a blend. Foot IK and hiding feet with the camera are secondary fixes. **[sourced]** |
| [Twelve Minutes devlog: Motion-capture & Locomotion](https://twelveminutesgame.com/2017/12/motion-capture-locomotion/) | Foot IK with 0..1 weight curves keeps feet planted while they are in contact in the source clip. Stop clips are picked by foot phase (contact or passing, left or right). **[sourced]** |
| [MoCap Online: Walk cycle integration](https://mocaponline.com/blogs/mocap-news/walk-cycle-animation) | Set movement speed from root displacement per stride. A mismatch causes sliding. Loop seams need matching position, rotation and velocity. **[sourced]** |
| [Lyra docs](https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-in-lyra-sample-game-in-unreal-engine) | Rotate Root Bone with a root-yaw offset reduces sliding while turning. **[sourced]** |

**How to measure slip [inference, built from Holden's thresholds]:** during frames detected as contact, add up the foot's horizontal world displacement after in-place speed compensation. Report it per clip as `slipMeanCmPerContact` and `slipMax`. Do it twice: at playback rate 1.0 to judge clip quality, and at the window edges to judge how far the clip can stretch.

**In-place vs root motion for us [inference]:** keep the KayKit clips in-place and drive the capsule from code (that's what responsiveness needs). Use the measured root speed only as metadata for rate matching. Foot locking is a later polish step and does not replace correct rungs.

## 4. Starts, stops, pivots, turn-in-place

| Source | Takeaway |
|---|---|
| [Epic: Adapting Lyra](https://www.unrealengine.com/en-US/tech-blog/adapting-lyra-animation-to-your-ue5-game) | Lyra's set: directional starts, jog cycles, stops, turn-in-place, and 180° start variants (turning left or right). Turn clips need yaw curves generated by an animation modifier. **[sourced]** |
| [Jayden Games: Lyra breakdown](https://www.jaydengames.com/posts/ue5-black-magic-game-core-animation/) | A pivot triggers when acceleration opposes velocity (dot < 0). Turn-in-place triggers when root yaw offset exceeds 50°. Jump states: Start → Loop → Apex → FallLoop → Land. **[sourced]** |
| [UE docs: Distance Matching](https://dev.epicgames.com/documentation/unreal-engine/distance-matching-in-unreal-engine) | Starts and stops use a distance curve baked from root motion. Starts advance clip time by distance travelled. Stops seek the frame that matches the remaining distance to the predicted stop point. A stop-speed threshold matters for pivots. **[sourced]** |
| [Game Anim: Free ALS](https://www.gameanim.com/2020/02/25/free-unreal-advanced-locomotion-system/) / [ALS-Community discussion](https://github.com/PanicPetal/ALS-Community/discussions/320) | ALS has walk/run/sprint gaits, foot locking and turn-in-place. It uses a `StrideBlend` curve plus a separate `StandingPlayRate`, which is the "rungs + rate correction" pattern. **[sourced]** I found no numeric thresholds. |
| [guip97: phase-blending](https://github.com/guip97/phase-blending) | Choosing a walk→stop clip by phase, with "dead zones" where no transition is allowed, avoids the double step. It needs 8 stop clips for 8 directions and doesn't scale. **[sourced]** |
| [MoCap Online](https://mocaponline.com/blogs/mocap-news/locomotion-animations-game-dev) | Loop-only set: 5–8 clips. Production set with starts, stops and turns: 40–80. AAA: 80–150+. **[sourced]** |
| [Game Anim: For Honor motion matching](https://www.gameanim.com/2016/05/03/motion-matching-ubisofts-honor/) | The capture "dance card" covers walks, runs, starts, stops, circles, plant-and-turn at 45/90/135/180°, strafe squares and strafe plants. **[sourced]** Useful as a checklist of what is missing. |

**Minimal indie set [inference]:** Idle; Walk, Jog, Run and Sprint forward; Walk back; Walk/Jog strafe left and right (or mirror one side); one Start (walk) and one Stop for each foot phase (`Stop_L` and `Stop_R` is the Twelve Minutes trick); Turn-in-place 90 left and right; Jump start, loop and land. Skip pivots and 180° starts at first: a short crossfade plus fast capsule yaw is acceptable for a cartoon look.

## 5. Motion matching: why not now, and what to borrow

| Source | Takeaway |
|---|---|
| [Zadziuk GDC 2016 slides (PDF)](https://media.gdcvault.com/gdc2016/Presentations/Zadziuk_Kristjan_MotionMatchingFutureOfGamesAnimation.pdf) / [GDC Vault](https://www.gdcvault.com/play/1023478/Animation-Bootcamp-Motion-Matching-The) | State-machine locomotion needs an exploding set of starts, stops and turns. Motion matching instead searches a large mocap set by pose, velocity and trajectory. "The more data you use the more precise it is". **[sourced]** |
| [Game Anim: For Honor](https://www.gameanim.com/2016/05/03/motion-matching-ubisofts-honor/) | Clavet calls it brute force: about 10 features (feet positions and velocities, local velocity), with a realism-vs-responsiveness slider. The goal is predictability more than raw responsiveness. **[sourced]** |
| [Holden et al.: Learned Motion Matching (PDF)](https://theorangeduck.com/media/uploads/other_stuff/Learned_Motion_Matching.pdf) / [ACM](https://dl.acm.org/doi/10.1145/3386569.3392440) | Machine learning shrinks the memory cost of motion matching for huge databases. **[sourced]** |
| [orangeduck/Motion-Matching](https://github.com/orangeduck/Motion-Matching/tree/inertialize_feature_cubic) | Reference implementation: motion matching, inertialization, foot locking. Appeared in search; robots.txt blocked the fetch. **[sourced: search only]** |

**Why it's overkill [inference]:** it needs long, unstructured, continuous mocap (dance cards). KayKit is short hand-keyed loops. A few dozen clips give the search almost nothing to choose from.

**Cheap ideas worth borrowing [inference]:**
1. Use a matching cost to pick the entry frame of a transition: compare foot positions and velocities of the outgoing pose against candidate frames of the incoming clip. Precompute this in Blender as `entryFrameForPhase[]`.
2. Use inertialization or dead blending instead of long linear crossfades.
3. Make the capsule predictable: a critically damped velocity spring, so the target speed (and therefore the rung) is known about 0.2–0.3 s ahead.

## 6. Web / three.js specifics

| Source | Takeaway |
|---|---|
| [three.js example: skinning_blending](https://threejs.org/examples/webgl_animation_skinning_blending.html) ([source](https://github.com/mrdoob/three.js/blob/dev/examples/webgl_animation_skinning_blending.html)) | Checked in the code: `synchronizeCrossFade` waits for the mixer `loop` event of the outgoing action, then `executeCrossFade` sets `endAction.time = 0` and calls `crossFadeTo(end, dur, true)`. This is loop-boundary sync, which only works if both clips have LFD at time 0. **[sourced]** |
| [three.js AnimationAction docs](https://threejs.org/docs/pages/AnimationAction.html) | `warp(start, end, dur)` ramps `timeScale`. `syncWith(action)` copies time and timeScale. `setEffectiveTimeScale` / `setEffectiveWeight`. **[sourced]** Source checked: `crossFadeFrom(..., warp=true)` warps the outgoing action from 1 to `durOut/durIn` and the incoming one from `durIn/durOut` to 1, so warp equalizes cycle lengths during the fade. That only helps when the two clips are in phase. **[sourced: three.js src/animation/AnimationAction.js]** |
| [SimonDev character controller](https://github.com/simondevyoutube/ThreeJS_Tutorial_CharacterController) | FSM with idle, walk, run, dance; normalized-phase handoff (§2); MIT license. The best minimal pattern to copy. **[sourced]** |
| [pmndrs/ecctrl](https://github.com/pmndrs/ecctrl) | R3F + Rapier floating-capsule controller. Discrete states IDLE, WALK, RUN, JUMP_START/IDLE/FALL/LAND with fixed 0.15 s fades. No gait blending or rate sync. Good for physics and capsule behaviour, not for locomotion animation. **[sourced]** |
| [pmndrs/BVHEcctrl](https://github.com/pmndrs/BVHEcctrl) | Simpler R3F controller built on BVH collision. Appeared in search only. **[sourced: search]** |
| [nigh3252-prog/three-player-controller](https://github.com/nigh3252-prog/three-player-controller) | Plain three.js with three-mesh-bvh capsule, directional walk/run, 3-part jump and a foot-IK plugin. MIT. Worth reading for foot IK. **[sourced]** |
| [KrtinShet/threejs-character-controller](https://github.com/KrtinShet/threejs-character-controller), [Alex-DG/threejs-character-controls](https://github.com/Alex-DG/threejs-character-controls), [RobeSantoro/ThreeJS-Avatar-Controller](https://github.com/RobeSantoro/ThreeJS-Avatar-Controller) | Basic walk/run/jump FSMs. Appeared in search, not inspected. **[search only]** |

**Recommended three.js pattern [inference]:** keep every ladder rung's action playing all the time, with weights driven by speed. Give all of them one shared normalized phase `φ`, advanced each frame by `dt / blendedCycleDuration`. Set each action as `action.time = ((φ + lfd_i) mod 1) * dur_i` and `timeScale = 0` (a manual phase driver). That is Unity-style normalized sync plus UE-style markers, without depending on `crossFadeTo`. Use `crossFadeTo` only for non-cyclic states (start, stop, jump, turn).

## 7. KayKit and Mixamo

| Source | Takeaway |
|---|---|
| [itch.io: KayKit Character Animations](https://kaylousberg.itch.io/kaykit-character-animations) | Rig_Medium has 100+ clips; Rig_Large has 25+ and is still in progress. FBX + glTF, CC0. Built for KayKit characters; other characters need engine retargeting. Godot setup videos exist. Clip names and in-place vs root motion are not documented on the page. **[sourced]** |
| [Devlog: Update 1.1](https://kaylousberg.itch.io/kaykit-character-animations/devlog/1139588/character-animations-update-11) | 1.1 added 28 tool animations (chop, dig, fish…) to Rig_Medium. No new locomotion clips. **[sourced]** |
| [kaylousberg.com: Character Animations](https://kaylousberg.com/game-assets/character-animations) | Lists movement categories (walking, running, jumping, sneaking, dodging, crouching) and links a preview video. I found no written guidance from Kay on locomotion blending. Any Discord notes were not reachable. **[sourced: absence]** |
| [Upstate Indie: Torque3D player anim II](https://www.upstateindie.com/tutorials/2020/01/11/T3DPlayerAnim_II.html) | Confirmed Mixamo names: **"Left Strafe Walking", "Right Strafe Walking", "Left Strafe", "Right Strafe", "Strafe", "Crouch Walk Left/Right/Forward/Back", "Crouch Idle"**. **[sourced]** |
| [Steam Workshop Mixamo package](https://steamcommunity.com/sharedfiles/filedetails/?id=3103817811) | Confirmed names: **"Walking", "Walking Backwards", "Running", "Jogging", "Slow Jog Backwards", "Female Walk"**. **[sourced]** |
| [UE forum: Mixamo turn-in-place](https://forums.unrealengine.com/t/mixamo-turn-in-place-animations-not-working-with-motion-matching-video-example-included/1893261) | Mixamo turn clips keep their rotation on the hips, not the root. Fix in Blender by moving the yaw keys to the root. **[sourced]** Relevant for our turn-in-place metadata. |
| [Adobe community: missing "In Place"](https://community.adobe.com/t5/mixamo-discussions/fix-missing-quot-in-place-quot-for-animations-that-moves/td-p/13598055) | Some Mixamo clips have no "In Place" checkbox. Fix by flattening hip translation in Blender's graph editor. **[sourced]** |

**Mixamo names to search for, NOT verified as exact titles [inference / memory]:** "Start Walking", "Stop Walking", "Jog Forward", "Fast Run", "Sprint", "Run To Stop", "Left Turn 90" / "Right Turn 90", "Left Turn" / "Right Turn", "Running Turn 180", "Jog Strafe Left/Right". Check each one in the Mixamo search before it goes into the ladder. Mixamo's rig also differs from KayKit's, so every Mixamo clip needs retargeting and its own ladder measurement.

## 8. SOP: building the gait ladder from a clip library

1. **Inventory and normalize.** List every cyclic locomotion clip per rig (Rig_Medium, Rig_Large, Mixamo retargets). Same unit (m), same up axis, same fps. Set the in-place flag; for Mixamo, move hip yaw and translation to the root where needed. *(UE Mixamo forum, Adobe thread)*
2. **Measure natural speed.** Root, or pelvis if in-place, horizontal displacement over one full cycle ÷ cycle duration. For in-place clips, measure how far the stance foot travels backwards during contact. *(nikoff, MoCap Online)*
3. **Find the cycle.** Cycle length = 2 steps. Report loop-seam error for position, rotation and velocity of pelvis and feet on the first vs last frame. *(MoCap Online: zero difference at the seam)*
4. **Detect contacts with one rule.** Toe/ankle horizontal speed below about 0.1–0.3 m/s, plus a height check, plus a 5-frame majority filter. Cross-check with pelvis crossing. *(Holden; FootSyncMarkerGenerator)*
5. **Write phase markers.** `lfdPhase`, `rfdPhase`, `contactIntervalsL/R` as normalized 0..1. Flag clips whose L/R spacing is far from 0.5 (asymmetric gait). *(Unity blend tree, UE sync markers)*
6. **Measure foot slip at rate 1.0.** Sum of contact-foot drift per contact, mean and max. Clips above a threshold go to cleanup or get rejected. *(Holden; MoCap Online "foot should not move during contact")*
7. **Set the playback-rate window.** Default [0.8, 1.2] *(Lyra 15–20%)*. Re-measure slip at both edges and narrow the window if slip grows past the threshold.
8. **Derive speed bands.** `band = naturalSpeed × window`. Sort the rungs by speed and list the gaps. Any gap means a missing rung (jog, fast walk), not a wider window. *(MoCap Online "three tiers", Lyra)*
9. **Define blend pairs.** For each pair of adjacent rungs, set a crossover speed and check that cadence (steps per second) differs by less than about 30%. *(inference: blending clips with very different cadence slides even when phase-synced)*
10. **Measure transitional clips** (start, stop, turn, jump). Store a distance curve (distance travelled vs time) for starts and stops, yaw-vs-time for turns, and the end foot phase for stops (`Stop_L` / `Stop_R`). *(UE Distance Matching, Twelve Minutes)*
11. **Directional coverage.** Tag each clip's move direction (F, B, L, R, plus diagonals if any) and whether it can be mirrored. Record "mirror of X with phase +0.5". *(Unity Mirror, Lyra cardinals)*
12. **Validate in-engine.** Play every rung at window min, 1.0 and max on a grid floor at the matching capsule speed. Record screenshots or GIFs and a slip readout, and sign off each rung. A clean syntax check is not a test.

---

### Confidence summary
- **Well sourced:** the 15–20% Lyra window; the UE stride-warp formula; sync-marker semantics; Unity's normalized-time requirement; Holden's contact thresholds; three.js warp and crossfade mechanics (checked in source); SimonDev's phase handoff (checked in source); KayKit pack facts; the Mixamo names listed as confirmed.
- **Inference:** our gap numbers; cadence-ratio rule; manual phase-driver pattern; minimal clip set; slip metric definition; unverified Mixamo names.
- **Not found:** written locomotion guidance from Kay Lousberg; exact Lyra play-rate clamp numbers; ALS numeric thresholds.
