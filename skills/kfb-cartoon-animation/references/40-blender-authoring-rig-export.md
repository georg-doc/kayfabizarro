# Blender Authoring, Rig and Export

## Rig layers

Keep distinct:
1. deformation/export skeleton;
2. animator control rig;
3. optional IK/helper/space-switch/control bones.

Runtime should not depend on Blender control constraints.

## Authoring loop

For each important clip:
1. collect reference and define intent;
2. thumbnail/pose study if useful;
3. block with stepped/constant interpolation;
4. validate silhouette from gameplay/shot camera;
5. establish root/contact trajectory;
6. establish weight transfer and primary arcs;
7. spline/polish timing and spacing;
8. add asymmetry/overlap;
9. add bounded cartoon exaggeration;
10. mark contacts/phases/events;
11. test layering/NLA needs;
12. bake evaluated transforms;
13. export named runtime actions;
14. validate exported GLB in target runtime.

Do not approve animation only because the Blender viewport looks correct.

## Blocking

Use stepped/constant keys while solving:
- key poses;
- contacts;
- balance;
- silhouette;
- timing;
- force.

Spline only after the pose/timing structure works.

## Graph Editor

Polish:
- spacing;
- acceleration/deceleration;
- overshoot;
- settle;
- arc continuity;
- rotation order problems;
- foot drift.

Avoid smoothing away intended accents.

## NLA / actions

Use actions as reusable authored units.
Use NLA when non-destructive layering, sequencing or evaluation is useful.

Keep clip role, frame range, loop intent and source identity explicit.

## Constraints and IK

Constraints are authoring tools.
Before export, bake the evaluated result required by the runtime skeleton.

Check:
- pole vector stability;
- foot orientation;
- toe/heel behavior;
- hand/prop orientation;
- space switching;
- scale/shear artifacts.

## Root policy

Resolve per clip/system:
- in-place;
- extracted root;
- authoritative root motion;
- cinematic root.

For KFB browser locomotion, controller/world movement remains authoritative unless the current project SSOT explicitly changes that.

## Export

glTF/GLB is a delivery format, not an animation state machine.

Export named animation clips with:
- stable skeleton;
- intended translation/rotation/scale tracks;
- morph weights where required;
- no hidden dependency on authoring-only controls.

Runtime semantic metadata lives outside raw glTF when richer facts are needed.

## Export validation

Compare:
- bone count/names expected by target;
- clip names/ranges;
- duration;
- loop seam;
- root translation;
- foot/hand contact;
- props/attachments;
- scale/orientation;
- first/last frame continuity;
- target-engine playback.

## Film versus gameplay authoring

Label animation intent:
- GAMEPLAY_360
- GAMEPLAY_DIRECTIONAL
- INTERACTION_LOCKED
- CINEMATIC_SHOT

Camera-specific cheats may be valid for a shot and invalid for general gameplay.
