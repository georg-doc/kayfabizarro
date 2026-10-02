# Adventurers Rig_Medium Extension · 2026-10-02

Status: **IMPLEMENTED · 12/12 FOCUSED PASS · STAGE MIRROR PENDING**

## 2026-10-02 · ADVENTURERS_RIG_MEDIUM_EXTENSION_01

Source implementation:
- catalog commit `2ae26d602689819d2dba693e8b9eea8b0a13d4c0`
- test-contract commit `908d8ed3d99f4cf2f796f719bf586cb55a727292`

Added to `Rig_Medium` roster:

1. Barbarian · blob `d06efc99d5fe8541a31affdd0a25d0c519980c89`
2. Knight · blob `793ac234dcc0509222b073a314d2ab5f18551797`
3. Mage · blob `66eac745c7d4360e463bf4c4e5e117e4c0c58b1e`
4. Ranger · blob `8edaf04430036130c3a7fcb6767049aac3c3f3a7`
5. Rogue · blob `6f28b937ec57b06815240fbf4106c58e76a74c0c`
6. Rogue Hooded · blob `7063f6cbca7fd2445c9b804a9f157c11c0e7b0f2`

Direct GLB metadata inspection on `main@f9dd7a64c4ae0907b8752717861eba065e557d9d`:
- all six have one skin;
- skin name = `Rig_Medium`;
- 23 joints;
- zero embedded animations;
- external pack provides `Rig_Medium_General.glb` + `Rig_Medium_MovementBasic.glb`.

Focused catalog checks: **12/12 PASS**
- 33/33 catalog count;
- 33 unique actor IDs;
- six Adventurers present;
- six Rig_Medium;
- six jointCount 23;
- six exact GLB blobs;
- six exact revision pins;
- six provisional runtime cleanup mode records;
- six present in the generated Adventurers pack registry;
- test contract updated to 33;
- six-specific test contract present;
- existing roster sentinels preserved.

Important limitation:
These six are now **authoring roster entries**, not Blender-cleaned/anchor-approved consumer assets. They still follow the current provisional `auto-mirrored-front-pair` runtime cleanup until a later verified NoEyes/anchor pass.

Asset Librarian cross-tool finding is tracked separately: Mannequin exists in its pack registry but is filtered from Town Characters because `isAnimationSource()` excludes the entire `kaykit-character-animations-1-1` pack.

## Owner boundary

Implementation remains KFB ToolBox / Rigging on PR #104. No Asset Librarian runtime code is changed in this slice.

## Next gate

Mirror the 33-actor Medium catalog to the existing EyeRig Stage, verify exact file readback, then return this slice. Large/Legacy remain separate.
