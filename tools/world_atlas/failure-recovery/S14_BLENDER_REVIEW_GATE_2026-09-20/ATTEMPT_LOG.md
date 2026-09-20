# ATTEMPT LOG

| Pass | Change / gate | Expected | Actual | Evidence | Decision |
|---|---|---|---|---|---|
| Browser 0 | Real S14 page + editor smoke | boot + roundtrip | room booted, but test misclassified 4 intentional reference deviations as failures | run 35482359643 | fix test only |
| Browser 1 | Separate documented deviations from technical failures | deterministic authoring proof | **15/15 PASS**, 0 browser errors; recipe patch survives reload | run 35482605744 | retain |
| Blender 1 | Browser manifest → Blender source glTF import | save .blend + review | glTF importer stopped on missing `numpy` | prior run 35482508205 | one dependency repair |
| Blender 2 | install `python3-numpy`; propagate Python errors | save .blend + PNG + GLB | **37 instances / 39 objects imported; .blend saved**; renderer then aborts on missing `libEGL.so.1` | run 35482605744 / job 106002993282 | STOP + recovery |

No room-layout redesign, substitute props or second Blender-side room grammar was introduced in either
Blender repair pass.
