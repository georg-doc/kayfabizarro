# START FOR VS CODE / WS0 — KFB Cartoon Locomotion tool intake
Date: 2026-10-27
Status: READY FOR LATER WS0 REVIEW; TOOL SCRIPT SOURCE COMMITTED, NOT BLENDER-TESTED
Executor: WS0 in VS Code + the SINGLE already-configured Blender MCP connection.
Repository: georg-doc/kayfabizarro
Review branch: research/motionbricks-macbook-ws0-2026-10-27
Draft PR: #456
Owner: existing KFB Cartoon Animation method + KFB ToolBox Motion authoring.

## Cold start (copyable instructions for the executor)
Read current START_HERE, CHAT_GITHUB_KFB_STAGE_WORKFLOW, FRESH_CHAT_SLICE_PROTOCOL and skills/kfb-cartoon-animation/SKILL.md, then current Motion SSOT/Recovery PR #344. Read the two companion notes:
- skills/kfb-cartoon-animation/_handover/WS0_CARTOON_LOCOMOTION_TOOLKIT_2026-10-27.md
- skills/kfb-cartoon-animation/_handover/WS0_CARTOON_LOCOMOTION_DONOR_ATLAS_2026-10-27.md
- skills/kfb-cartoon-animation/_handover/WS0_MOTIONBRICKS_MACBOOK_DONOR_RESEARCH_2026-10-27.md only as separate later HOLD.

Work on ONE outcome: source-isolated Mannequin_Medium motion baseline and a usable Blender posing/evidence tool inventory, without generating a new MotionBricks clip or changing KFB runtime. Check the real source objects in isolation before authored KFB integration. Do not install or start another MCP server when current one works.

## VS Code orientation
Source motion and donor:
- media/3D_Assets/Animations/KFB_Motion_Library/RETURN.md
- media/3D_Assets/Animations/KFB_Motion_Library/source/ml_bake.py
- media/3D_Assets/Animations/KFB_Motion_Library/source/ml_sheets.py
- skills/kfb-cartoon-animation/references/40-blender-authoring-rig-export.md
Read-only new helper (for existing .blend action):
- skills/kfb-cartoon-animation/tools/pose_motion_audit.py

Do not execute ml_bake.py unchanged; it references historical absolute Dropbox paths. The pose_motion_audit helper samples the currently ACTIVE action of a named real armature, without importing or changing actions. It outputs per-frame world-space positions and simple movement summaries. It is not a foot-ground truth validator.

## First WS0 session — bounded steps
1. Record local Blender version, OS/Mac chip if relevant, current MCP implementation/version and installed addons; source revision + currently open .blend. Do not assume Mac hardware from chat.
2. Open Mannequin_Medium real KFB/KayKit accepted actor and Walking_B source action in ISOLATION. Contact sheet or multi-view frame strip before any remix. Identify the actual foot/root bone names from Blender, not from guesses in docs.
3. Verify built-in Pose Library, Breakdowner/Blend to Neighbor, Graph Editor and Motion Paths. Run a small read-only source motion audit, preserving original blend. Compare measured positions to the existing KayKit baseline/collisions only when those sources are known.
4. Check optional AnimAide, B Onion Skin, Snow, Rain, CloudRig as documented source candidates. For anything to be installed, match version/license and isolate the actual donor before using it.
5. Return source and tool inventory (KEEP/HOLD/REJECT), source contact sheet, counts, one next gate. Authoring A/B/C is a FOLLOW-ON after source isolation is credible; do not silently extend this step into runtime or WorldBuilder.

## Tool usage example (run in VS Code terminal where Blender exists)
Replace ACTUAL_RIG, ACTUAL_HIPS, ACTUAL_FOOT_L and ACTUAL_FOOT_R only after querying the active .blend file. No default bone names are silently guessed.

blender -b /absolute/path/to/real-source.blend --python skills/kfb-cartoon-animation/tools/pose_motion_audit.py -- --armature ACTUAL_RIG --root ACTUAL_HIPS --left-foot ACTUAL_FOOT_L --right-foot ACTUAL_FOOT_R --output /absolute/path/to/local/audit.json

This command runs locally, writing JSON only. Do not upload personal local paths or non-free raw assets. The helper raises an error when the specified armature, current action or bones are missing; this is preferable to a false PASS.

## Optional later authoring contract, explicitly NOT started by this packet
Three independent studies: CARTOON_WALK_A, HIGH_JUMP_A and START_STOP_PIVOT_A, on accepted real KFB rig using original poses. Source-only before motion integration. Render original and studied versions same camera/speed. Measure joints/foot-slip/COM, bake against export skeleton, export GLB, existing Animation Lab checks, then separate playable controller feel review.
Keep: world position/collision/air control authority in the game movement owner; KFB animation only owns visual pose, contact presentation, and timing. WB2 PR #348 remains STOPPED; no runtime source changes, no public acceptance, no merge or Live.

## Acceptance and recovery
At present: files persisted on review branch, no Blender fixture run, no new animation, no exported GLB, no visual donor proof and no human look approval. No public Stage/Site required for documentation and local Blender research.
If two non-improving fixes fail the same tool/rig seam, preserve the smallest failing seam and report limitations; do not override Motion owner or stop unrelated project progress.
Next WS0 gate: WS0_CARTOON_LOCO_SOURCE_ISOLATION_01.