# 2D and 2.5D Compatibility

The portable skill remains compatible with the existing KFB 2D/2.5D workflows while the new research deepens 3D/game animation.

## 2D sprites

Use a stable logical anchor, normally foot/ground contact.
Do not position from changing transparent sprite bounds.

Clip changes occur on state changes, not every render frame.
Frame progression is delta-time based.
Sort by ground/foot layer, not image top edge.

## SVG / cutout rigs

Use a hierarchy:
character root → torso → head / limbs → hands / props.

Rotate around explicit joints.
Do not animate unrelated endpoints independently when a shared rig/centerline is required.

For ropes, tails, limbs and flexible props, use one coherent hierarchy/curve or rig rather than unrelated line segments.

## Shared doctrine

2D/2.5D still follows:
- cause and recovery;
- readable silhouette;
- timing/spacing;
- one primary read;
- whole-body participation;
- overlap;
- controlled secondary action;
- evidence fixtures.

## Boundary

Do not import 3D-specific assumptions such as foot IK, export skeletons, glTF root-motion policy or motion matching into 2D work unless the implementation truly has an equivalent concept.
