# POSTMORTEM

## SOURCE

S21 R02 is the accepted room-composition donor. World Atlas S14 is the current browser/editor host.
The browser remains the layout owner; Blender consumes the exported world matrices.

## ATTEMPTS

See `ATTEMPT_LOG.md`.

## WORKING PARTS

- 24/24 R02 source-model names resolve in the existing KayKit Dungeon registry.
- Browser room loads and reads as the accepted treasure/dining diorama.
- TransformControls editor persistence works end-to-end.
- Browser emits a deterministic Blender manifest with 37 visible + 4 hidden instances.
- Blender 4.0.2 downloads and imports the pinned KayKit glTF sources.
- Blender logs 37 manifest instances / 39 imported objects.
- Blender saves a valid `KFB_R02.blend`.

## FAILURE EVIDENCE

The Linux headless review phase aborts after the save:
`Couldn't open libEGL.so.1: libEGL.so.1: cannot open shared object file`
followed by exit code 134.

No review PNG is produced. The GLB export is after the render step, so it is not reached.

## PROVEN CAUSES

- **PROVEN:** the first Blender gate lacked numpy for Blender's glTF importer.
- **PROVEN:** after numpy is available, source glTF import and .blend save succeed.
- **PROVEN:** the remaining CI failure is the runner's missing EGL library during rendering, not a
  missing room asset or browser-manifest failure.

## HYPOTHESES

- **HYPOTHESIS:** the saved .blend will open/render normally in Georg's local macOS Blender.
- **UNKNOWN until visual review:** whether Three.js→Blender basis conversion gives exact visual
  parity from the desired review camera.

## SALVAGE

Keep the browser blueprint, manifest bridge, importer, one-click macOS runner and saved .blend.
Do not continue repairing the Ubuntu review renderer in this slice.

## LESSONS LEARNED

1. A Blender process exit is not sufficient proof; validate expected files and propagate Python errors.
2. Separate environment/render infrastructure from room import truth. Here the room import succeeded
   before EGL failed.
3. Keep accepted layout truth in one host and export matrices; do not start a second Blender layout
   authoring path just because a render gate fails.

## NEXT GATE

Exactly one gate: **open the preserved `KFB_R02.blend` in Georg's local Blender and visually compare
the room/camera orientation to the S14 browser screenshot.** No Blender editing is required.

## PUBLIC DEPLOYMENT

Not part of this frozen Blender gate. Browser Stage publication is a separate S14 human-review gate.

## GEORG ACCEPTANCE

OPEN.
