# KFB Cartoon Brawl · Research Source Matrix

Status: RESEARCH CHECKPOINT A
Verified: 2026-10-03
Workflow: KFB-CARTOON-BRAWL-SKILL-01
Purpose: source-backed baseline for a reusable 3D melee / cartoon-brawl skill. This is research evidence, not a runtime owner.

## Evidence classes

- **P1 · official engine/project documentation** — implementation facts and supported mechanisms.
- **P2 · developer / GDC primary talk or first-party interview** — shipped-game design and production practice.
- **P3 · specialist training / professional practitioner** — craft workflow and animation heuristics.
- **KFB · current repository donor evidence** — existing KFB contracts/results to preserve and generalize carefully.

## A · Runtime timing, state and alignment

| ID | Class | Source | What it supports |
|---|---|---|---|
| A01 | P1 | Unreal Engine · Animation Notifies · https://dev.epicgames.com/documentation/en-us/unreal-engine/animation-notifies-in-unreal-engine | Animation-synchronous point events and state windows; branching points for precise gameplay decisions; sound/particle hooks. |
| A02 | P1 | Unreal Engine · Motion Warping · https://dev.epicgames.com/documentation/en-us/unreal-engine/motion-warping-in-unreal-engine | Bounded root-motion warping windows to align translation/rotation/facing with a target instead of globally dragging an attack. |
| A03 | P1 | Unreal Engine · Root Motion · https://dev.epicgames.com/documentation/en-us/unreal-engine/root-motion-in-unreal-engine | Animation-driven displacement as an explicit movement mode/contract. |
| A04 | P1 | Unreal Engine · Locomotion / pose warping · https://dev.epicgames.com/documentation/en-us/unreal-engine/locomotion-in-unreal-engine | Pose warping, distance matching and motion-warping as tools for coverage/alignment rather than a reason to author every variant. |
| A05 | P1 | Godot · AnimationTree · https://docs.godotengine.org/en/stable/tutorials/animation/animation_tree.html | State-machine/blend-tree transitions plus root-motion extraction for CharacterBody-style movement. |
| A06 | P1 | Godot · Animation track types · https://docs.godotengine.org/en/latest/tutorials/animation/animation_track_types.html | Call Method tracks as precise timeline event hooks. |
| A07 | P1 | Unity · AnimatorState / state machines · https://docs.unity3d.com/ScriptReference/Animations.AnimatorState.html | Explicit animation states and event-driven transitions. |
| A08 | P1 | Unity · Animation Events · https://docs.unity3d.com/Manual/script-AnimationWindowEvent.html | Function calls at precise animation times. |
| A09 | P1 | Unity · root motion / OnAnimatorMove · https://docs.unity3d.com/ScriptReference/Animator-applyRootMotion.html | Root-motion ownership can be explicit and intercepted rather than silently mixed with controller movement. |

### Baseline inference

A melee move should be represented as a **timed attack contract**, not merely a clip name. The contract needs explicit entry conditions, timeline windows/markers, movement/alignment mode and exit/recovery rules. Engine-native mechanisms support this pattern across Unreal, Unity and Godot.

## B · Weapon attachment, retargeting and hand correctness

| ID | Class | Source | What it supports |
|---|---|---|---|
| B01 | P1 | Unreal Engine · Skeletal Mesh Sockets · https://dev.epicgames.com/documentation/unreal-engine/skeletal-mesh-sockets-in-unreal-engine | Dedicated transformed attachment points relative to bones; preferred over repeatedly guessing per-instance offsets. |
| B02 | P1 | Unreal Engine · IK Rig Animation Retargeting · https://dev.epicgames.com/documentation/en-us/unreal-engine/ik-rig-animation-retargeting-in-unreal-engine | Retargeting across skeleton/proportion differences; IK goals can preserve hand/foot contacts. |
| B03 | P1 | Unreal Engine · IK Rig Solvers · https://dev.epicgames.com/documentation/en-us/unreal-engine/ik-rig-solvers-in-unreal-engine | Limb/FBIK goals, limits and twist correction; explicit forward-axis support for twist correction. |
| B04 | P1 | Unreal Engine · Control Rig Full Body IK · https://dev.epicgames.com/documentation/en-us/unreal-engine/control-rig-full-body-ik-in-unreal-engine | Multiple end-effectors, preferred angles, per-bone controls for procedural correction/reaching. |
| B05 | P1 | Unity Animation Rigging · Two Bone IK · https://docs.unity.cn/Packages/com.unity.animation.rigging%401.2/manual/constraints/TwoBoneIKConstraint.html | Position + rotation target, elbow/knee hint and maintain-offset behavior for hand placement. |
| B06 | P1 | Unity Animation Rigging · Multi-Parent / Multi-Referential constraints · https://docs.unity.cn/Packages/com.unity.animation.rigging%406.6/manual/constraints/MultiReferentialConstraint.html | Dynamic parent-like relationships useful when prop drives hand or hand drives prop. |
| B07 | P1 | Blender 4.5 · IK constraint · https://docs.blender.org/manual/en/4.5/animation/constraints/tracking/ik_solver.html | End-effector orientation, pole target, chain limits and influence. |
| B08 | P1 | Blender · Child Of constraint · https://docs.blender.org/manual/en/5.0/animation/constraints/relationship/child_of.html | Animatable parent influence and inverse preservation for pickup/hand-off/sheath-style parent switching. |
| B09 | P1 | Adobe Mixamo · upload/rig/map · https://helpx.adobe.com/creative-cloud/help/mixamo-rigging-animation.html | Humanoid auto-rigging, skeleton mapping and applying library animations to mapped custom rigs. |
| B10 | P1 | Adobe Mixamo FAQ · https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html | Auto-rigger constraints: humanoid only; neutral/default pose, clean centered mesh and limited extra appendages matter. |

### Baseline inference

The repair order for a weapon that intersects its owner is:

`canonical weapon basis → attachment/socket frame → neutral grip proof → retarget pose → hand/off-hand IK → attack clip → sweep/self-clearance proof`.

Per-clip wrist rotation is **not** the first repair. A wrong attachment basis or retarget pose will otherwise be hidden rather than fixed.

## C · Contact, hit windows and consequence timing

| ID | Class | Source | What it supports |
|---|---|---|---|
| C01 | P1 | Unreal Engine · Traces overview · https://dev.epicgames.com/documentation/en-us/unreal-engine/traces-in-unreal-engine---overview | Collision queries along a path rather than only point overlap. |
| C02 | P1 | Unity Physics.CapsuleCast · https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Physics.CapsuleCast.html | Swept-volume collision for moving melee volumes. |
| C03 | P1 | Unity Physics.SphereCast · https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Physics.SphereCast.html | Thick-ray / swept-volume query for robust fast contact. |
| C04 | P2 | Naughty Dog · Melee AI in The Last of Us Part II · https://www.gdcvault.com/play/1027115/Melee-AI-in-The-Last | Modular melee solutions required because small visual/control errors are amplified at close range. |
| C05 | P2 | Game Developer summary of Naughty Dog TLOU2 melee · https://www.gamedeveloper.com/design/how-naughty-dog-defined-melee-attacks-and-behaviors-in-i-the-last-of-us-part-ii-i- | Attack definitions include attacker/defender animation, range/facing/line conditions and timeline markers for hit frames, tracking and invulnerability. |
| C06 | P2 | Naughty Dog · Unsynced: The Last of Us Melee System · https://gdcvault.com/play/1021172/Unsynced-The-Last-of-Us | Shipped melee architecture, animation synchronization and the move away from requiring every ordinary hit to be a fully paired animation. |
| C07 | P2 | GDC YouTube · Unsynced: The Last of Us Melee System · https://www.youtube.com/watch?v=Ox2H3kUQByo | Video form of the above talk for detailed study/reference. |
| C08 | KFB | Combat Arena PR #7 · CA2 Melee Lab | Existing KFB donor: startup/active/recovery helper, swept weapon contact and per-attack AttackLedger. |

### Baseline inference

A reliable default is:

`startup → active sensing window → recovery`

with swept/volume contact between prior/current weapon positions and a per-swing target ledger. The animation timeline should open/close sensing; **validated contact** should decide damage/reaction/impact, not a visual frame marker alone.

## D · Game-animation craft, impact and readability

| ID | Class | Source | What it supports |
|---|---|---|---|
| D01 | P2 | GDC · Mariel Cartwright, Fluid and Powerful Animation within Frame Restrictions · https://www.gdcvault.com/play/1020575/Animation-Bootcamp-Fluid-and-Powerful | Strong key poses, anticipation and timing remain critical under responsiveness/frame limits. |
| D02 | P2 | GDC · Powerful and Effective Animation for 2D/3D Games · https://www.gdcvault.com/play/1021657/Powerful-and-Effective-Animation-for | The same timing/anticipation/smear/readability principles transfer to 3D game animation and must serve gameplay. |
| D03 | P2 | GameAnim · Mike Jungbluth, Anatomy of a Hit Reaction · https://www.gameanim.com/2017/03/27/anatomy-hit-reaction/ | Impact feedback is a combined animation/VFX/sound/UI problem; synced and unsynced combat need different treatment. |
| D04 | P2 | PlayStation Blog · developers explain God of War combat · https://blog.playstation.com/2022/10/04/game-developers-explain-what-makes-god-of-war-2018s-combat-tick/ | Large attack arcs/follow-through, exaggerated reactions, strong audio and short hit-stop can sell weight while camera remains readable. |
| D05 | P2 | Santa Monica / PlayStation Blog · Stranger fight creation · https://blog.playstation.com/archive/2018/08/16/santa-monica-studio-details-the-epic-creation-of-god-of-wars-unforgettable-stranger-fight/ | Prototype key beats early; reaction range/environmental destruction can be pushed experimentally; continuous-camera transitions need planned repositioning/masking. |
| D06 | P2 | GDC · Master of the Katana: Melee Combat in Ghost of Tsushima · https://www.gdcvault.com/play/1027194 | End-to-end melee design/technical lessons from a demanding sword-combat system. |
| D07 | P2 | GDC · Designing and Implementing a Satisfying Sword Fight · https://www.gdcvault.com/play/1015226/Designing-and-Implementing-a-Satisfying | Third-person sword-fight design spanning pacing, camera, rigging and animation. |
| D08 | P3 | Gnomon · Jason Shum, Combat Animation for Games · https://www.thegnomonworkshop.com/workshops/combat-animation-for-games | Professional workflow: define combat intention, study reference, establish weapon/idle, find key poses, retime, add breakdowns, polish arcs. |
| D09 | P2 | GDC · Overwatch animation pipeline · https://gdcvault.com/play/1024267/The-Animation-Pipeline-of-Overwatch | Flexible hero/weapon animation pipeline and animation-driven performances across a diverse stylized cast. |

### Baseline inference

For KFB, "cartoon" means controlled exaggeration of **pose, arc, spacing, reaction and timing**, not indiscriminate particles/shake. Readability and responsiveness constrain film-style anticipation/follow-through.

## E · Fight choreography, mocap, paired interactions and crowds

| ID | Class | Source | What it supports |
|---|---|---|---|
| E01 | P2 | Unreal Developer Interview · Sifu / Sloclap · https://www.unrealengine.com/developer-interviews/old-boy-john-wick-sifu-the-design-of-a-pak-mei-master?lang=en | Design team defines move needs; martial-arts expert interprets; main move set hand-keyframed; coordinated takedowns captured with master + stunt artist. |
| E02 | P2 | PlayStation Blog · How Sifu's kung fu combat works · https://blog.playstation.com/2021/11/18/how-sifus-kung-fu-combat-works/ | Crowd-control moves, positioning, target switching and bounded enemy aggression are central to one-v-many readability. |
| E03 | P2 | Sloclap YouTube · Behind the Scenes: Kung Fu & Motion Capture · https://www.youtube.com/watch?v=w77IYxQpBOw | Combat-design workshops, martial-arts expertise, mocap and authenticity review in the actual Sifu pipeline. |
| E04 | P3/P2 | Benjamin Colussi · Sifu project page · https://www.benjamincolussi.com/sifu | Fight choreographer describes 213 main-character moves across unarmed/staff/bat/machete plus takedowns; varying rhythm and brawl design were deliberate. |
| E05 | P2 | Action Talks with Sloclap (2026) · https://podcasts.apple.com/us/podcast/sloclap-the-team-behind-sifu-action-talks-47/id1686666319?i=1000744172219 | Long-form developer discussion with explicit sections on making efficient styles look good, mocap, cinematography and making game combat work. |
| E06 | P2 | Naughty Dog · Unsynced TLOU melee | Ordinary hits can use independent attacker/reaction animations rather than an explosion of paired animation sets. Paired interaction remains valuable when exact contact choreography is the point. |

### Baseline inference

Use **unsynced/systemic** attacks for ordinary gameplay wherever possible; reserve paired/synchronized animation for takedowns, grapples, special finishers and interactions whose meaning depends on exact two-body contact. For crowds, schedule aggression instead of allowing every nearby NPC to commit simultaneously.

## F · Existing KFB donors and owner boundaries

### F01 · Base motion canon

`skills/kfb-cartoon-animation_v2.md`

Retain:
- cause → anticipation → action → impact → follow-through → recovery;
- one primary read;
- semantic VFX classes;
- event budgets;
- protected areas;
- quiet camera unless justified;
- fixed fixtures/debug evidence.

The Brawl skill specializes this. It does not replace it.

### F02 · Combat Arena CA2 Sword donor

Repository: `georg-doc/KFB-Combat-Arena`  
Branch: `chatgpt-web/ca2-04-melee-vfx-sfx-2026-09-20`  
PR: #7

Current branch-local evidence:
- exact `Skeleton_Blade.gltf`;
- authored `handslot.r` / runtime `handslotr`;
- local weapon transform identity in the current candidate;
- real `Melee_1H_Attack_Chop`;
- swept contact + active window + `AttackLedger`;
- non-overlap Spacing diagnostic;
- forced-contact diagnostic;
- visible sweep/hurt capsule/marker debug;
- human Blade mount/body-clearance/readability still pending.

This is a donor pattern, not proof that every actor/weapon can use the same socket transform or clip.

### F03 · Shield attachment owner lesson

Combat deferred notes preserve a human-rejected Black Knight shield placement. The correction belongs in the Resident Atlas / attachment owner, with neutral/T-pose and block-pose proof, then Combat consumes the promoted transform.

**General rule:** do not hide an attachment-source defect with a consumer-only attack correction.

## First-pass principles to carry into the skill

1. **Attack = contract, not clip.**
2. **Weapon geometry has a canonical basis and named grip/contact anchors.**
3. **Prove neutral attachment before attack choreography.**
4. **Retarget/IK corrects proportion and contact differences; it does not excuse a wrong weapon basis.**
5. **Timeline markers open/close opportunities; validated contact creates consequences.**
6. **Fast weapon paths use swept/volume contact, not only instantaneous overlap.**
7. **A swing owns a target-consumption ledger or explicit multi-hit policy.**
8. **Ordinary melee should prefer systemic/unsynced reactions; paired animation is reserved for exact-contact interactions.**
9. **Motion warping/alignment is bounded to declared windows and never becomes a second global movement owner.**
10. **Cartoon impact exaggerates pose/arc/timing/reaction while preserving spatial causality.**
11. **Crowd aggression is scheduled/limited for readability.**
12. **VFX/SFX/camera consume semantic attack/contact/reaction events and remain subordinate to the physical read.**
13. **A motion-library clip is intake, not acceptance; it must pass retarget, attachment, self-clearance, transition and contact tests.**
14. **Debug proof must show socket axes, weapon path, active window, hurt volumes, contact result and recovery.**

## Next research gate

**RESEARCH-BLOCK-B · weapon-class profiles + transition/clearance taxonomy**

Define what must differ for:
- unarmed;
- 1H blade;
- 1H blunt/club;
- shield + 1H;
- 2H;
- polearm/staff;
- improvised/soft or absurd KFB prop ("Brickfish" class);

without creating separate collision architectures for each.
