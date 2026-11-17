# Blaster fracture performance · final candidate · 2026-11-17

Private proof, no merge. Supersedes the synchronous mask and timing sections of RETURN.md. Native combat, fracture/impact-mask source and all model bytes remain unchanged at the pinned Game proof source. No Game worktree edits.

## Final built comparison

Same Chrome tab/viewport, production bundle, seed1337, pixel ratio1, 2048 shadows, original blaster, audio off, canvas recording30fps. Six native releases in TPS, reset, six in FPS. Native muzzle/clip timing and seeds stay active; baseline confirmed2/2 hits, final candidate2/2 (early TPS shots can dent before breaching). This is a scene/workload comparison, not an identical-impact replay.

| Maximum host update + render submission | Reference | Final prepared candidate |
|---|---:|---:|
| TPS |185.9 ms|19.3 ms|
| FPS |58.5 ms|7.0 ms|

One-time preparation before readiness:1015ms. Final built-worker delivery includes a 410.7ms cold outlier (off-thread, no main-frame freeze); geometry/collision commit follows together before the next physics step. No worker errors or pending jobs at the end. Full CPU/rAF telemetry and counts are in PERFORMANCE.json. These performance.now CPU/submission observations are not GPU timings, guaranteed60fps or controlled hardware/statistical evidence. The game-dev CLI was unavailable; no sealed/admitted game-dev-run claim is made.

## Changes

- Exact native planar samples are shared by their six thickness voxels. Unchanged planes cache by native field version. Every solid byte and dirty chunk is compared with the reference, including six faces, repeated/overlapping hits and reset.
- Exact native dropLaserPanel/clay materials are resident and shared. Native masks, voxel/collider/panel builders, texture uploads and both render paths are prepared before play. Setup uses the existing renderer and actual backbuffer while the canvas is hidden, followed by a1×1 readback gate; no quality, art resolution, mask resolution, shadows, piece limit or lifetime was reduced.
- Worker setup computes pure derived fixture masks, never game hits, receipts, effects or audio. Preflight restores every room bit, collider/body count, mask and hit counter; temporary buffers are released. Readiness follows preparation. The first host delta is clamped nonnegative to respect native motion timing.
- One module Worker runs the unchanged native syncField mask/polygon derivation. The existing main-thread core owns commands; the worker has no combat queries, physics, renderer, audio or frame loop. Copies are transferred without detaching its working buffers.
- Visible geometry and real colliders commit together before physics. Receipts explicitly say geometryPending until completion. Mask completion emits no second hit, cascade, FX or audio event.
- Reset advances a generation and cancels pending jobs. Late results cannot reopen a restored wall. Capacity is8 surface jobs; no unbounded backlog. Full native Gatling/bomb/vehicle throughput remains a later integration test.

## Validation / limits

288 full-suite tests pass. Real-worker tests prove identical native float masks and polygons. Real-builder tests retain piece positions/normals/UVs, clay colours/parameters, hull/collider counts and cleanup; preflight leaves no damage or hit/body/collider residue. Existing real Rapier six-plane breach/reset tests remain green. Build succeeds including the Worker.

The first local candidate looked faster than the initial cold publication: that publication still reached104/50ms main work and404–505ms worker delivery. Those traces are retained in the evidence. Final preflight explicitly addresses those cold paths rather than discarding the cold run. A later live test is documented in the handoff evidence, separately from the local comparison.

Default /blaster-lab/ uses the prepared candidate; QA reference is ?fracture=baseline. WS0 should connect the derived job to the chosen Game lifecycle, preserve generation/commit ordering and recheck burst throughput. Existing FPS-presentation/pose and native audio-bank packaging limitations remain. Three bounded optimization candidates used; no merge or Game integration PASS implied.

## Click-to-aim · 2026-11-17

Default free cursor: choose a visible motif, ease the camera/actor toward the immutable picked point, then ask native combatPlayer to fire exactly once. Classic center aiming remains selectable. Pointer dragging looks around; movement/reset/mode changes cancel pending alignment. Reduced motion removes the turn animation. Selection is presentation only: the real native projectile and combatTargets still decide contact/damage, FX and audio. Cut-hole rim normals are assigned to the actual physical wall slab; a hidden infinite projectile ground plane was removed in this private host.

Two manual off-center clicks hit their chosen points from the identical body position, with center error below 2e-16 at release and no duplicate hit. A separate built click demo recorded four accepted native hits in TPS and four in FPS; max host work9.9/5.2ms, preparation1769.2ms, worker delivery3.3–58.6ms. This is a different workload from the six-release comparison above. DOM target marker is omitted from canvas-only recording.

FPS gun presentation shares the native gun material/state and follows native child transforms. Final Game FPS arm/pose/muzzle anchoring remains an open WS0 integration item; this is not a final animation/HUD acceptance. Audio is native-only, opt-in; existing bank packaging limits remain.
