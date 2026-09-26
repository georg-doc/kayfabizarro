# Salvage Map · Asset 03

## Reuse

### r2 technical candidate
Keep:
- deterministic source recipe;
- 16-bit Non-Color height role;
- conservative dynamic range;
- measured seam/local + half-offset pass;
- exact SHA.

Use only after Georg's human look PASS.

### r3 visual direction
Keep as **design evidence only**:
- broad kneading/compression strokes;
- paired shallow troughs;
- sparse pressed patches;
- less generic cloud-noise.

Do not use its pixels in Blender because the tile gate failed.

### PR #173 seam donor
Keep as the seam/periodicity reference. A fresh slice should combine:
- r3's sculpt-stroke language;
- PR #173's proven periodic/toroidal authoring discipline;
- the same measurable seam gate.

### Asset 01
Keep the already accepted smooth matte Base Color source separate from height/roughness/micro data.

## Do not reuse as truth

- r1/r2 cloudiness as a mandatory style feature;
- r3 edge pixels;
- any fixed physical height amplitude;
- a raw grayscale map as a Normal map;
- a one-material-for-all-slots conversion;
- frame-varying material jitter.

## Protected owners

- ToolBox / ClayBound remains the material-source owner.
- Blender MCP is a receiving/calibration lane.
- Existing Asset Librarian remains the eventual accepted-asset receiver.
- PR #173 remains the seam donor.
- No new runtime or asset registry was created.
