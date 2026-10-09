# TEST REPORT · Academy First Lesson Drag v0.1 · 2026-10-09

**Owner:** KFB AI Game Art Academy / Maker Space  
**Scope:** learning content and source adapter validation only; not Academy runtime, not World/MediaSurface code  
**Input sources:**
- `travel/KFB Travel Combat v25/terrain-v25/academy-lessons.js` at blob `68d2ce26f438789b24fd4bb6f5c3567d91bf658b`
- `travel/KFB Travel Combat v25/terrain-v25/academy-live.js` at blob `7c8b4b842f43541909f63ca7fe9a040e78d11cc9`
- KFB Production Control: shared learning core `c36abe79-a560-4a7f-8286-256784aec1a9`, domain adapter `cfe2ce46-2b95-431d-afa6-8c4655636b06`.
- Content artifact `ACADEMY_FIRST_LESSON_DRAG_V01.json`.

## Results

**Contract/content validation 12/12 PASS** in current Webchat JS:
1. Four diagnostic probes.
2. No duplicated skill IDs.
3. All prerequisite IDs resolve.
4. Diagnostics reference valid skill IDs.
5. Seven-step RECAPTURE→SEE→EXPLAIN→MODIFY→BUILD→SHOW→RECAP sequence.
6. All operations belong to Shared Adaptive Learning Core operation catalog.
7. Exactly six evidence levels E0–E5.
8. Original example ID and blob format are pinned.
9. Visual/unverified status remains explicit.
10. Single Shared Adaptive Learning Core, no second engine.
11. FrizzleBob v5 is not falsely labeled visually accepted.
12. Missing observation never becomes E4/E5 verified.

**Independent source/contract cross-check 9/9 PASS** after GitHub readback:
1. Branch pointed at the new content commit.
2. Exact `academy-lessons.js` blob matches source pin.
3. Registry maps `misc_controls_drag: initDrag`.
4. UV→NDC uses `(2u-1, 2v-1)`.
5. Raycast against actual lesson bodies is present.
6. Grab-offset exists in code.
7. Shared engine version matches the actual production-control domain-adapter contract.
8. All selected session operations belong to real adapter operations catalog.
9. Visual proof remains marked NOT_RENDERED.

Site persistence: saved and read back exact `ACADEMY_FIRST_LESSON_DRAG_V01.json` in KFB Production Control: `fileId=50372341-f548-4c1c-a774-a4dcdad976c5`, SHA-256 `d0e4c0587e7895740e83a9fd7020feae03e7350bb39b4b454f617eb0c3d73e4b`, 7,825 bytes.

**Run-time visual source isolation:** 0/3; actual Chromium visual tests: 0; actual pointer/drag tests: 0; user artifact build: 0; performance: 0; Cloudflare/Site public deployment: 0; human acceptance: 0.

## Webchat limitation recorded

The source-only evidence was obtained through the authenticated GitHub connector. An actual Chromium executable exists here, but container shell networking cannot resolve github.com, and no offline Three.js module or upstream GLB is mounted. Upstream original classroom `classroom.glb` is 31,207,652 bytes, `emilian-avatar.glb` is 4,933,284 bytes; original visual donor isolation cannot be claimed in this environment. No copycat/procedural substitute was used.

## Current tutor character source routing

FrizzleBob v5b candidate is `tools/KFB-ToolBox/ear-rig/glb/FB_TEMPLATE_LOOK_v5b.glb`. Source-reconciliation is **open** between candidate pins noted in `CURTAIN_CHARACTER_SELECT_MVP_2026-10-04.md` (`23615cff`, `93abbf22`); do not promote as accepted Academy tutor mesh from historical notes alone. Current specialist FrankenStein Composer Site had previously verified FrizzleBob v5 in isolation; that is not proof of Academy integration. When the visual job begins, use the current pinned v5/v5b source and compare silhouette/rig/idle, not legacy Cube Pet or arbitrary KayKit figure.

## Result classification

**SOURCE/CONTENT READY FOR VISUAL PROOF.** A content JSON lesson and verifiable training rubrics exist. Do not infer the current World/MediaSurface receiver, the original Classroom visual quality or FrizzleBob animation from these checks.

**Exactly one next gate:** `ACADEMY_MAKERSPACE_VISUAL_SOURCE_PROOF_R1`.
