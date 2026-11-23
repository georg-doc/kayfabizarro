# WS0 / VS Code — KFB Cartoon Locomotion Toolkit and design brief
Date: 2026-10-27
Status: RESEARCH + TOOL PREPARATION; NOT MOTION-AUTHORED, NOT RUNTIME-INTEGRATED
Owning lane: existing KFB Cartoon Animation method / KFB ToolBox Motion authoring
Branch: research/motionbricks-macbook-ws0-2026-10-27 (Draft PR #456)
Product outcome (later, independently authorized): make KFB walking, starting, pivoting and high-jump presentation feel immediate, energetic and elastic using original KFB motion.

## Read order and authority
1. skills/chat/START_HERE.md
2. skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md
3. skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md
4. skills/kfb-cartoon-animation/SKILL.md
5. skills/kfb-cartoon-animation/references/kfb-integration-current-ssot.md
6. current Motion SSOT PR #344; its current Return, Rig_Medium files and native clips
7. this document, WS0_CARTOON_LOCOMOTION_DONOR_ATLAS_2026-10-27.md and WS0_VSCODE_BLENDER_MCP_START_2026-10-27.md
8. only later, if needed: WS0_MOTIONBRICKS_MACBOOK_DONOR_RESEARCH_2026-10-27.md

Current known KFB baseline: Mannequin_Medium then FrizzleBob v5; KayKit Character Animations 1.1 native source first; accepted 21 KEEP / 3 HOLD / 0 REJECT; selected Medium Walk Walking_B, Run Running_A, Sprint Running_B, Jog speed/phase blend. Known gaps: start, stop, pivot, turn in place, strafe and some Rig_Large coverage. Never silently replace or re-pick approved motions. Retain all identity, retargeting, gameplay physics and camera owners.

## Creative reference: Super Mario 64, movement language rather than copyrighted assets
Reference = strong line of action, immediate response, clear acceleration/deceleration, squash/stretch on contact, silhouette-first poses, snappy starts/stops, dynamic air pose, apex/fall contrast, elastic landing and readable directional recovery. Motion behavior ideas: run-forward impulse, high jump, triple-jump progression, backflip/side-somersault as separate later semantics. These do NOT authorize copying or extracting Nintendo models, animations, code, sounds or textures. Independently author original KFB keyposes and timing with KayKit/KFB rigs.

## First isolated three-study portfolio (proposal, not a runtime task)
A. CARTOON_WALK_A: contact → down → passing → up → opposite contact. Wide-but-supported steps; torso/shoulder counterrotation, strong arm swing; controlled center of mass, foot lock and loop seam; stay within existing gait identity unless product acceptance explicitly changes it.
B. HIGH_JUMP_A: input-responsive launch → rapid compressed anticipation on presentation layer → stretched ascent → apex hang/read → active fall pose → pronounced impact squash → interruptible recovery. The gameplay movement owner controls jump velocity, gravity, apex, collision and midair steering; animation only presents them. Compare standstill launch and running launch.
C. START_STOP_PIVOT_A: immediate input acknowledgement; directional lean, bracing, foot-supported 180-degree pivot; fast recovery without waiting on a cinematic animation hold.

High-jump should initially be ONE original high jump. Backflip, side somersault, long jump, triple jump and wall jump remain separately classified future candidates, not hidden scope.

## Tools and order of adoption
0. Blender built-ins first: Pose Library (Asset Browser), mirrored poses, Pose Breakdowner / Blend to Neighbor, Motion Paths, Dope Sheet/Graph Editor, NLA, IK/FK, foot roll/constraints, Action baking, glTF/GLB export. Existing KFB Motion Library ml_bake.py and ml_sheets.py remain source workflow; they are historical scripts with local absolute paths, requiring deliberate non-destructive adaptation, not blind execution.
1. Existing Blender MCP installation: identify actual installed connection/version; use it for bpy scene interrogation, guided posing, multi-view inspection and reliable output manifests. DO NOT install a second MCP endpoint without discovering a documented need.
2. Optional AnimAide when verified Blender version matches its maintained release; targeted F-curve edits, push/pull, easing, time offset and cleanup; not an automatic animator.
3. Optional B Onion Skin when compatible; show before/after mesh ghosts for arcs, pose spacing, overshoot. Prefer built-in Motion Paths when not compatible.
4. Snow v4 / Rain v3 as CC-BY educational source rigs shown in isolation. Study controls / pose affordances; preserve KFB export rig as actual product actor. Inspect custom embedded Python scripts before enabling them.
5. CloudRig as control-rig authoring design donor; only evaluate a temporary separate control rig if KFB-specific limitations are proven. Do not replace skeleton.
6. Cascadeur (licensed external DCC) and additional Retarget add-ons remain future HOLD and must clear export and pricing/tool compatibility gates.
7. MotionBricks is FUTURE RESEARCH ONLY. It is not needed or required in A/B/C and should not be installed, invoked, downloaded or benchmarked in this first Cartoon Locomotion authoring slice.

## Reusable WS0 authoring loop
SOURCE_ISOLATE: open the actual accepted Mannequin_Medium/KayKit clip alone; record source revision, rig names, action, duration, contact frames and license.
REFERENCE: collect movement study only; independent pose thumbnail and line-of-action; choose fixed side, front and 3/4 cameras at real game viewing distance.
POSE_BUILD: use Asset Browser poses; make stepped/constant contact, down, passing, up, jump anticipation, stretch, apex, impact poses. Pose ownership is per actual rig; no stand-in cubes or imported replacement actors.
TIME_POLISH: inspect timing/spacing and velocity arcs; use Blender built-in in-betweens; only optionally enable AnimAide. Preserve strong accents, avoid spline smoothing into mush.
CONTACT_AND_ARCS: compute Motion Paths and foot-space sample data, then compare real planted windows with actual ground; sample with read-only helper tools/pose_motion_audit.py (tool is NOT a foot-slide PASS by itself).
CONTACT_SHEET: reuse measured donor / Motion Library contact-sheet routines; export reproducible front/side/3-4 shot sets and short preview. Show originals isolated before comparing.
BAKE_EXPORT: if good, bake evaluated animator controls to accepted export skeleton, use existing KFB retarget/export pipeline, verify bone IDs, scale, first/last keys, action name, root policy and playability in the existing Animation Lab.
COMPARE: A/B side-by-side source KayKit versus original cartoon study, same actor, camera and real speed. Gameplay feel requires separate consumer controller freeplay; never claim from Blender viewport alone.

## Diagnostic checks and acceptance
Minimum: precise input-to-first-visual-reaction latency (later runtime only); keypose silhouettes; planted-foot horizontal drift; root displacement; COM arc; contact duration / stance; foot phase; frames to launch; apex frame/time; recovery duration; loop seam rotation; GLB bone-track parity; stable scale; no new collisions/world transforms; editable Blender source and provenance.
A useful fixture must show idle → walk → stop → pivot → jump in place → moving jump → landing and immediate re-input. For missing states record HOLD, not fabricated PASS.
Existing KFB method: skills/kfb-cartoon-animation/references/{10-body-mechanics-cartoon-style.md,20-locomotion-gaits-transitions.md,30-travel-modes-traversal.md,40-blender-authoring-rig-export.md,80-retargeting-library-metadata.md,90-validation-debug-evidence.md}.
Existing Motion Library scripts: media/3D_Assets/Animations/KFB_Motion_Library/source/{ml_bake.py,ml_sheets.py}.
Owner caution: PR #348 WB2 R4 is STOPPED / NO MVP; this independent Blender/VS Code research does not authorize WB2 game or geometry modifications.

## Boundaries, status, gate
Present GitHub packet contains documentation, verified upstream research, one read-only audit helper, VS Code instructions and existing MotionBricks donor study. NO posed or animated KFB files were produced; no add-on installed; no Blender playback, Mac motion inference, runtime or Stage acceptance completed.
One next gate when WS0 resumes: WS0_CARTOON_LOCO_SOURCE_ISOLATION_01 — identify the actual Blender/MCP version and accepted KFB source rig, produce an isolated visual source sheet plus measured baseline with the currently installed tools. Only proceed to new authored motion after that source contact sheet is verified.