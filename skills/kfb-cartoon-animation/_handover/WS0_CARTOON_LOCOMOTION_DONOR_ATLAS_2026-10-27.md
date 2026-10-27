# KFB / WS0 Motion, Posing and Locomotion Donor Atlas
Date: 2026-10-27
Status: SOURCE / DOCUMENTATION RESEARCH — not installed, visually donor-proven, integrated or human-accepted.
Scope: reusable future motion libraries, rig/pose donors, procedural authoring aids, and Blender MCP tools.
Owner: existing KFB shared Cartoon Animation / Motion authoring; no new Asset Librarian, Motion state, runtime or world owner.

Classification: EXISTING_KFB (owned donor), BUILTIN (Blender), EXTERNAL_SOURCE (public source checked), FUTURE_HOLD (not first slice).
Do not conflate source website inspection with the actual downloaded donor asset/animation displayed in isolation. License notes are source-level, not final redistribution clearance.

| Tool/donor | Type / cost-license | What WS0 can reuse | Verification/limitation | First slice |
| --- | --- | --- | --- | --- |
| Existing KFB KayKit native clips + Motion PR #344 | EXISTING_KFB, source under KFB custody | Accepted baseline 21 KEEP / 3 HOLD; Medium Walking_B/Running_A/Running_B; verified speed/phase model | Re-read source branch; do not replace default clips, verify exact rig and license | REQUIRED |
| KFB Motion Library v1 catalogue / ml_bake.py / ml_sheets.py | EXISTING_KFB, script + 33 historical Mixamo clips | Real bone-space retarget process, contacts, contact-sheet renderer, audit heuristics | Historical script hardcodes local Dropbox directories; separate original FBX licensing; reuse concepts, do not run blindly | REQUIRED DONOR |
| KFB Cartoon Animation skill and existing animation method refs | EXISTING_KFB | Production invariants, weight/contacts, gameplay animation split, export and visual QA | Canon on main; repository current stage overrides old docs | REQUIRED |
| Blender Asset Browser Pose Library | BUILTIN | Keypose assets, masks, blending and categorization per real rig | Verify armature/action-slot compatibility on installed version | REQUIRED |
| Blender Pose Breakdowner / Blend to Neighbor, Graph Editor, NLA | BUILTIN | Breakdown poses, timing/spacing and transition refinement | Built-in tools are first choice before addon | REQUIRED |
| Blender Motion Paths | BUILTIN | Show bone origin/arcs over frames | Paths are diagnostics, not contact proof | REQUIRED |
| Blender MCP, existing installed connector | EXISTING_KFB installation to inventory | bpy inspection, pose workflows, viewport screenshots | Current installed implementation/version must be identified; do not fork second server | REQUIRED INVENTORY |
| ahujasid/mcp-for-blender | EXTERNAL_SOURCE; third-party MCP; https://github.com/ahujasid/blender-mcp | Reference implementation of execute_blender_code, look / angles / frames, inspect scene | Current upstream repository naming/config may change; consult repo at install time; no adoption if existing KFB MCP works | OPTIONAL DONOR |
| AnimAide maintained fork | EXTERNAL_SOURCE, GPL-3.0-or-later; https://github.com/maneerat3d/animaide | Tween, Ease, Push/Pull, Smooth, Scale, Anim Offset / F-curves | Current main verifies Blender 5.1.2, NOT general 4.x or 5.2+; verify actual WS0 Blender version first | OPTIONAL HIGH |
| B Onion Skin | EXTERNAL_SOURCE, GPL-3.0-or-later; https://extensions.blender.org/add-ons/b-onion-skin/ | Before/after 3D mesh ghost frames and trajectory visual QA | 1.1.0 Blender 5.2 LTS+; older 1.0.0 available for 5.0+; user reviews note some breakdowner interplay issues | OPTIONAL HIGH |
| Snow v4 rig | EXTERNAL_SOURCE, CC-BY with required attribution; https://studio.blender.org/characters/snow/v4/ | Isolated stylized animation/IK/FK/stretch/foot-control study; parkour reference | Blender 4.1+, included script must be inspected before executing, full rig not KFB runtime drop-in | DONOR ISOLATION |
| Rain v3 rig | EXTERNAL_SOURCE, CC-BY with required attribution; https://studio.blender.org/characters/rain/v3/ | Isolated readable body mechanics, IK/FK, stretch and pose control | Blender 4.1+, attribution, embedded scripts, do not copy uninspected rig into KFB production | DONOR ISOLATION |
| CloudRig | EXTERNAL_SOURCE, GPL-3.0-or-later; https://extensions.blender.org/add-ons/cloudrig/ | Cartoon control-rig architecture, metarig / IK / rubber hose / baking | Version 2.2.31 published 2026-10-05, Blender 5.0+ and <6.0 on store; source donor, not a new KFB export skeleton | FUTURE HOLD |
| Rigify | BUILTIN extension where installed; https://docs.blender.org/manual/en/latest/addons/rigging/rigify/index.html | Control rig ideas and IK/FK option | Check actual Blender availability; no full re-rig without proven need | FUTURE HOLD |
| Blender Studio Toon Character Workflow | EXTERNAL_SOURCE, training reference; https://studio.blender.org/training/toon-character-workflow/ | Walk-cycle blocking and cartoon animation lessons | Subscription may be needed for most video lessons/assets; not a free source pack | OPTIONAL REFERENCE |
| Cascadeur | EXTERNAL_SOURCE, proprietary tiered; https://cascadeur.com/help/faq | Auto-posing / dynamic jumps / backflips | Free tier exports only native .casc and prohibits commercial use; FBX in paid plans, additional restrictions apply | FUTURE HOLD |
| KBS-DEV Retarget add-on | EXTERNAL_SOURCE; https://extensions.blender.org/add-ons/retarget/ | Additional retarget alternative only for measured gap | Verify Blender 5 requirement, actual license/current compatibility; existing ml_bake first | FUTURE HOLD |
| NVIDIA MotionBricks | EXTERNAL_SOURCE; https://huggingface.co/nvidia/MotionBricks and https://github.com/NVlabs/motionbricks | Neural pose interpolation / Smart Primitives, future on-demand offline-baked clips | Official TensorRT demo NVIDIA GPU; ONNX CPU only partial feasibility path; Apple Mac unknown; code/model/sample licenses distinct | SEPARATE FUTURE HOLD |

Reference style only: Super Mario 64 1996 locomotion/jumps. Study gameplay cadence, silhouettes, anticipations, input response, air control. Do not extract or redistribute Nintendo proprietary animation/model/texture/audio/code as KFB donor; original pose/action authoring only.

Source URLs checked on 2026-10-27:
- Pose Library https://docs.blender.org/manual/en/dev/animation/armatures/posing/editing/pose_library.html
- Motion Paths https://docs.blender.org/manual/en/latest/animation/motion_paths.html
- In-betweens https://docs.blender.org/manual/en/latest/animation/in_betweens.html
- AnimAide maintained fork https://github.com/maneerat3d/animaide
- B Onion Skin release history https://extensions.blender.org/add-ons/b-onion-skin/versions/
- CloudRig official https://extensions.blender.org/add-ons/cloudrig/
- Snow / Rain official Blender Studio pages https://studio.blender.org/characters/snow/v4/ and https://studio.blender.org/characters/rain/v3/
- MCP reference https://github.com/ahujasid/blender-mcp
- Cascadeur plans https://cascadeur.com/help/faq
- Existing KFB source and scope from GitHub, read before execution.

No external zip, blend, plugin code, original copyrighted clips, purchased assets, or model weights were committed. At this stage external donor SOURCE INSPECTION is documentation only; visually isolated actual donated rigs = 0; local add-on runs = 0.