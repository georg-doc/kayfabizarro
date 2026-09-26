# World Surface Adapter · contract v1

Status: **CONTRACT ONLY · NOT IMPLEMENTED**

One adapter will eventually answer one question: what is the final visible/support surface at this location?

- WorldBuilder owns the editable base terrain height.
- OSM and Track may contribute bounded, provenance-labelled corridor constraints or offsets.
- The Surface Adapter resolves those inputs once and returns one finite height, with an optional finite normal and contributor list.
- Race keeps vehicle contact and physics ownership. This contract does not migrate collision, suspension, gravity or recovery.
- Consumers must not recompute or stack their own alternative final heights.
- Travel Globe is not the world base. TinySkies/Travel remain eligible donors for sky, weather, light, mood and selected camera/mobility behaviour.

The machine-readable contract is `world-surface-adapter.v1.json`. No carving algorithm, blending kernel or runtime owner is selected in this gate.
