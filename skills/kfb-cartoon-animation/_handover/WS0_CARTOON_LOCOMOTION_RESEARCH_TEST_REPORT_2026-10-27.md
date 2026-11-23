# Test / evidence report — WS0 cartoon locomotion donor and tool research
Date: 2026-10-27
Repo: georg-doc/kayfabizarro
Branch: research/motionbricks-macbook-ws0-2026-10-27
Draft PR: #456
Research/source milestone head: f178b69f0846fb6e870f8c375d0d40cea3145896
Status: **RESEARCH CHECKED-IN; BLENDER/VS CODE/PLUGIN RUNTIME UNTESTED**

## Actual evidence
- Read current GitHub START_HERE, chat workflow, fresh slice protocol, canonical KFB Cartoon Animation skill, animation source references/current SSOT and existing KFB motion processing source.
- Existing reused source: Motion Library ml_bake.py, ml_sheets.py and RETURN; these contain measured retarget/contacts and source-aligned contact sheets, and local absolute paths.
- External source reading/verification performed for Pose Library and In-Betweens, Blender Motion Paths, maintained AnimAide, official B Onion Skin versions, CloudRig, Blender Studio Snow v4 and Rain v3, Blender MCP public repo, Blender Studio Toon Character Workflow and Cascadeur terms.
- GitHub source milestone file readback: **5/5 paths**: toolkit, donor atlas, WS0 start, JSON registry, Blender sampler.
- Registry parse via JSON.parse: **1/1 PASS**, schema kfb.ws0.cartoon-locomotion-toolkit/0.1.
- Source readback branch head: f178b69f0846fb6e870f8c375d0d40cea3145896, **exact expected head PASS**.
- New sampler is source-only. No local Blender installed in the available check environment; external GitHub raw download from the container was also unavailable, so **no local Python syntax compile or bpy execution test was completed**. Do not count it as Blender PASS.

## Not performed (zero means zero)
- local Blender run: **0**
- VS Code / local Blender MCP connection or command run: **0**
- addon/plugin install: **0**
- real rig imports/isolated image proofs: **0**
- animation renders / contact sheets on new studies: **0**
- pose modifications / animation clips generated: **0**
- export or GLB playback: **0**
- gameplay/browser/controller tests: **0**
- MotionBricks ONNX/model evaluation: **0**
- real performance benchmark: **0**
- product Site / formal Stage verification: **0**
- production runtime file changes: **0**

## Known limitations
- Exact MacBook Pro chip and installed Blender/version not recovered; do not assume plugin compatibility.
- Python sampler inspects the active action's named bone origins only; no automatic foot-contact PASS, no terrain/collision proof, no edit. bpy compatibility and correct rig/action semantics must be verified by WS0 before relying on output.
- External donor source checked, but no actual donor rig loaded and shown in isolation; even a loaded URL would not satisfy the design-source gate.
- CloudRig, AnimAide, B Onion Skin and Cascadeur compatibility/rights are version- and tier-dependent. Retargeting and source license checks remain mandatory.
- WB2 R4 remains STOPPED / NO MVP. This is source authoring prep only, not game feel acceptance.

## One next gate
**WS0_CARTOON_LOCO_SOURCE_ISOLATION_01** — WS0 checks the actual installed Blender/MCP and accepted KayKit real actor/clip in isolation, confirms named skeleton/action/contact facts, uses built-in pose and motion inspectors first, returns visual evidence and exact tests before any new cartoon locomotion authoring.
