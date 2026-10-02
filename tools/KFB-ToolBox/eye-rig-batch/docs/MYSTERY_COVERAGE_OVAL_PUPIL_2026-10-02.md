# EyeRig Mystery Coverage + Oval Pupil Isolation · 2026-10-02

Status: **IMPLEMENTED IN SOURCE · FOCUSED EVIDENCE PASS · STAGE MIRROR PENDING**

## 2026-10-02 · EYE-RIG-MYSTERY-COVERAGE-OVAL-01

### Latest Georg Medium batch

Pinned authoring input:

`tools/KFB-ToolBox/_inbox/eye-rig-medium.batch (1).json`  
`main@2c92dd13cbc379ad3a6028144b8976bb3d6a840d`  
blob `0ed0a157389e469ce8b6623bd4542ee49cd31a28`

- 33 profiles / 33 selected
- 30 `ADJUSTED`
- 2 `ADJUSTED_APPROVED`: `mannequin-medium`, `adventurer-rogue-hooded`
- 1 `UNREVIEWED`: `gothgirl`
- **33/33** batch profile actor IDs resolve in the expanded Medium catalog
- **33/33** source paths match exactly

This input is authoring evidence; it does not auto-approve the 19 newly added Mystery Medium actors.

### Oval / pupil isolation repair

Root cause:
`eyeoval.v1.js` used `e.scale.set(w,h,d)` on the full EyeRig eye root, whose descendants include the pupil pivot.

Canonical shared-owner repair:
`ed59390ce105e0e47a5ecdcc2b87bc91222f54cb`

- Eye root scale held at 1×1×1.
- Sclera mesh gets W/H/D.
- Lid group gets W/H/D.
- Pupil pivot scale stays 1×1×1.
- Oval Depth moves the pupil pivot only along local Z by `R * (d - 1)`, so it remains on the deformed eye front without changing pupil size.
- Tilt remains mirrored on the eye root.
- ToolBox shared module and current FrankenStein Studio 16 snapshot read back as the **same blob** `9a559f789fb9dd1d7fb45e0c73ae2b246ef40c55`.

Batch adapter pin:
`0542a9020e8eb7144d62aaff73fe8c64a7b7469a`

Direct synthetic behavior proof: **7/7 PASS**:
root unit; sclera scaled; lids scaled; pupil scale unit; pupil depth follow; mirrored tilt; report marks pupil unit.

### Mystery monthly coverage

Inventory source:
`tools/asset_registry/librarian/_handover/KAYKIT_REFERENCE_ATLAS_2026-09-15/KAYKIT_PACK_COVERAGE_MATRIX.md`

Scope is the owned monthly Mystery Series 4 + 5 + 6 + current Series 7 physical character GLBs. Non-monthly extras such as Santa, Mummy and CharacterTemplate are not silently counted as monthly characters.

Before this slice the EyeRig catalogs covered 26 of those physical monthly GLBs.

Added **23**:
- **19 Rig_Medium**
- **4 Rig_Large**

Catalog commit:
`f12a063b456cf7105bd3792ddf5b6daa404762a0`

Current totals:
- Medium catalog: **52**
- Large catalog: **8**
- Mystery monthly coverage: **49/49**
  - **41 Rig_Medium**
  - **8 Rig_Large**

Focused source/catalog/adapter checks: **26/26 PASS**.

Static test contract was updated at:
`d685f23d447193d4ea84034aafefb7f4af78f19c`

The complete historical static suite was not rerun in-process because Code Mode hit its tool-call ceiling while materializing the full fixture set. That attempt made no repository write. The focused owner/source checks above are the current evidence.

### Paladin

Both physical model variants are now in Rig_Medium:
- `Paladin.glb`
- `Paladin_with_Helmet.glb`

Both source GLBs embed palette A. Palette B is separately pinned:
- A blob `d3e67d9902caa5a75927ad2e0fdcd3e2f162da34`
- B blob `eb45816ada5c84bc91abc0225e3b25f5998accc1`

Georg identifies **palette B as the light/blonde King candidate**. The EyeRig calibration stays geometry/model based; no fake duplicate skeleton is created for the palette. Palette pin metadata commit:
`7165a7c0087ceee57d6269ecf2b1fdf3f35c6931`

### Remaining gate

The 23 added Mystery characters are roster-available for batch authoring. They are not thereby visually approved and do not all have Blender NoEyes/anchor evidence yet.

## Owner boundary

- Eye geometry/lids/gaze owner remains EyeRig v6.
- Oval deformation owner remains the existing shared `eyeoval.v1.js`.
- Batch adapter only pins the repaired shared owner.
- No second pupil/oval implementation was introduced.
- No Resident Atlas cast, Asset Librarian runtime, Combat runtime or Live branch was modified by source implementation.

## Exactly one next gate

Mirror the repaired adapter + 52/8 catalogs + 49-character coverage manifest to the existing EyeRig Stage, read back the exact revision, then hand to Georg for visual review of:
1. Oval Width/Height while pupil size remains unchanged;
2. both Paladin model variants;
3. representative newly added Mystery Medium and Large characters.
