# KFB Asset Librarian · Visual Scene Atlas Preflight · SCENE_RECIPE v0 Proposal

**Date:** 2026-09-16  
**Status:** `PROPOSAL ONLY / VISUAL-PREFLIGHT PROFILE / NOT A RUNTIME CONTRACT`  
**Branch:** `chat/kaykit-visual-scene-atlas-preflight-2026-09-16`

## 0. Governing rule

The pre-existing preflight `LIVING_STATUS.md` already names **`kfb.scene-recipe.v0` as a PROPOSAL** and requires the first 3–5 Claude Design jobs to prove or modify it before any v1 contract is declared.

This file therefore **does not create a competing `visual-scene-recipe` schema**. It proposes a visual-preflight profile for the existing `kfb.scene-recipe.v0` concept.

If a receiving consumer already has its own world/scene contract, adapt the accepted evidence into that owner. Do not replace or fork the consumer contract silently.

## 1. Purpose

A visual agent should inspect an official/demo/reference capture and return enough structured evidence that a later consumer can:

1. understand what was actually demonstrated;
2. find matching owned source assets where possible;
3. reconstruct a compact candidate scene without reopening the full asset library;
4. distinguish observed placement from inferred placement;
5. know what remains untested.

Maturity remains governed by the existing preflight:

- L0 reference indexed
- L1 visual annotation
- L2 asset-matched
- L3 static reconstruction
- L4 reusable scene recipe
- L5 consumer-tested

Only the receiving consumer may promote to L5.

## 2. Required evidence states

Every claim must carry one of:

- `SOURCE_FACT`
- `OBSERVED_DEMO`
- `INFERENCE`
- `PROPOSAL`
- `TESTED_RESULT`
- `UNRESOLVED`

`TESTED_RESULT` is allowed only when referencing an actual prior KFB test with scope. Visual reconstruction normally produces `OBSERVED_DEMO`, `INFERENCE`, and `PROPOSAL`, not runtime test results.

## 3. Proposed v0 visual-preflight profile

```json
{
  "schema": "kfb.scene-recipe.v0",
  "profile": "visual-preflight",
  "recipeId": "CQ-001:ultra-turbo-hero-man:blaster-pose",
  "status": "candidate-only",
  "maturity": "L1",
  "sourceCaptures": [],
  "consumerTargets": [],
  "sceneIntent": {},
  "environment": {},
  "assets": [],
  "relations": [],
  "camera": {},
  "lighting": {},
  "materialsFx": [],
  "characters": [],
  "evidenceSummary": {},
  "unresolved": [],
  "reconstructionChecklist": []
}
```

This is a research/authoring return shape while v0 is being proven. No field becomes authoritative merely because it exists.

## 4. `sourceCaptures`

Required for provenance.

```json
{
  "sourceId": "ultra-hero-blaster-demo",
  "path": "_inbox/KayKit_PACKS_References_Scenes_Demos/Weapons- DEMO - BLASTER - GRIP - POSE August2026_UltraHeroTurboMan.gif",
  "sourceKind": "official-demo-gif",
  "rightsHandling": "reference-only",
  "inspectionState": "frame-reviewed | image-reviewed | metadata-only",
  "frameOrTime": null,
  "notes": []
}
```

Rules:

- never upgrade `metadata-only` into `OBSERVED_DEMO`;
- keep heavy/reference media at its source location;
- use explicit frame/time anchors when the medium supports them.

## 5. `sceneIntent`

Describes why the recipe exists, not runtime behavior.

```json
{
  "label": "source-authored weapon/grip/pose reconstruction",
  "status": "PROPOSAL",
  "smallestUsefulSlice": "actor + visible prop + demonstrated pose + source camera",
  "nonGoals": [
    "generic weapon compatibility",
    "automatic attachment",
    "runtime combat implementation"
  ]
}
```

## 6. `environment`

Functional visual roles may be recorded as a sidecar without becoming Registry taxonomy.

```json
{
  "ground": [],
  "tiles": [],
  "roads": [],
  "edges": [],
  "buildings": [],
  "structuralProps": [],
  "naturalDressing": [],
  "background": []
}
```

Useful role labels include:

- `ground_base`
- `road_straight`
- `road_corner`
- `road_intersection`
- `edge_transition`
- `platform`
- `stage`
- `arena_floor`
- `building_anchor`
- `facade_repeat`
- `entrance_marker`
- `fence_boundary`
- `tree_cluster`
- `rock_cluster`
- `resource_landmark`
- `background_mass`

A receiving owner must explicitly adopt/map any of these labels before they become product semantics.

## 7. `assets`

Each selected/candidate source object gets its own evidence record.

```json
{
  "assetRole": "weapon_prop",
  "displayName": "UltraTurboHeroMan Blaster",
  "sourcePath": "media/3D_Assets/KayKit_Mystery_Series6/UltraTurboHeroMan/assets/gltf/UltraTurboHeroMan_Blaster.gltf",
  "sourceMatch": "exact | family-only | unresolved",
  "sourceMatchConfidence": "high | medium | low",
  "availability": "OWNED | REFERENCE_ONLY | MISSING | UNKNOWN",
  "evidence": [
    {"status": "SOURCE_FACT", "claim": "same authored source family"}
  ],
  "required": true
}
```

Rules:

- `sourcePath` may be null;
- never invent a path from appearance;
- `same_collection` is not attachment compatibility;
- archive-only source gets family/pack info, not fake per-model records.

## 8. `relations`

Relations record what is seen/inferred, not what runtime guarantees.

```json
{
  "type": "adjacent | stacked_on | placed_on | held_by | aligned_to | repeated_with | surrounds | faces | source_companion | same_collection",
  "a": "asset-or-role-id",
  "b": "asset-or-role-id",
  "status": "OBSERVED_DEMO",
  "confidence": "high",
  "transformEvidence": {
    "translation": "measured | estimated | unresolved",
    "rotation": "measured | estimated | unresolved",
    "scale": "measured | estimated | unresolved"
  },
  "notes": []
}
```

`held_by` as `OBSERVED_DEMO` means only that a prop is visibly held in the reference. It does not establish KFB anchor/pivot/retarget/attachment compatibility.

## 9. Placement / transform evidence

Prefer relative/normalized reconstruction evidence over false precision.

```json
{
  "relativeTo": "actor_root_visual",
  "position": {"x": 0.12, "y": 0.48, "z": 0.0},
  "units": "normalized-frame",
  "status": "OBSERVED_DEMO",
  "confidence": "medium"
}
```

For proposed 3D reconstruction values, keep evidence separate:

```json
{
  "relativeTo": "actor_root",
  "position": {"x": null, "y": null, "z": null},
  "units": "consumer-world",
  "status": "UNRESOLVED",
  "confidence": "low"
}
```

Do not derive world meters from one perspective image unless a calibrated reconstruction actually supports it.

## 10. Scale relations

Prefer ratios:

```json
{
  "a": "prop",
  "b": "actor",
  "relation": "height_ratio",
  "value": 0.25,
  "status": "INFERENCE",
  "confidence": "medium"
}
```

If not reliably measurable, use `UNRESOLVED`.

## 11. Camera

```json
{
  "projection": "perspective | orthographic | unknown",
  "viewClass": "eye-level | low | high | isometric-like | top-down | unknown",
  "azimuth": null,
  "elevation": null,
  "focalLengthEquivalent": null,
  "framing": "wide | medium | close | unknown",
  "target": "scene-role-id",
  "status": "OBSERVED_DEMO | INFERENCE | UNRESOLVED",
  "confidence": "high | medium | low"
}
```

Exact camera numbers belong only in a measured reconstruction.

## 12. Lighting

```json
{
  "keyDirection": "front-left | back-right | unknown",
  "fill": "soft ambient | hard | unknown",
  "contrast": "low | medium | high | unknown",
  "timeOfDay": "day | night | indoor | stylized | unknown",
  "status": "OBSERVED_DEMO | INFERENCE | SOURCE_FACT | UNRESOLVED",
  "confidence": "high | medium | low",
  "notes": []
}
```

Source-page lighting notes are `SOURCE_FACT`; they are not observations about a specific capture unless the capture is inspected.

## 13. Materials / glow / FX

Keep three layers separate:

1. source/material fact;
2. effect actually observed;
3. proposed KFB treatment.

Example:

```json
{
  "target": "holiday-light-prop",
  "effect": "emissive/glow",
  "sourceMaterial": "holiday_glow",
  "sourceStatus": "SOURCE_FACT",
  "observedInCapture": false,
  "kfbTreatment": null
}
```

## 14. Characters / motion / props

```json
{
  "actor": "GothGirl",
  "sourcePath": "media/3D_Assets/KayKit_Mystery_Series6/GothGirl/...",
  "rigFamily": {
    "value": "Rig_Medium",
    "status": "SOURCE_FACT"
  },
  "poseOrMotion": {
    "label": "unknown",
    "sourceClip": null,
    "status": "UNRESOLVED"
  },
  "props": [],
  "relations": []
}
```

Prior tested evidence may be referenced separately with exact scope, e.g. the GothGirl Librarian preview result. Never generalize it to unrelated clips/consumers.

## 15. `evidenceSummary`

Every recipe should end with a compact evidence balance:

```json
{
  "sourceFacts": 8,
  "observedDemoClaims": 12,
  "inferences": 5,
  "proposals": 3,
  "testedResultsReferenced": 0,
  "unresolvedCount": 7,
  "overallConfidence": "medium"
}
```

## 16. `unresolved`

Preserve blockers explicitly.

```json
[
  {
    "question": "What exact local blaster transform reproduces the source grip?",
    "ownerNeeded": "ToolBox / receiving consumer measurement",
    "blocking": false
  }
]
```

## 17. Reconstruction checklist

At L2–L3, a visual agent may:

1. load only listed source candidates;
2. reproduce coarse composition;
3. compare silhouette/spacing with the source;
4. tune relative scale;
5. tune camera;
6. add material/light/FX only where evidence exists;
7. capture comparison evidence;
8. list residual mismatches;
9. leave unsupported behavior unresolved.

This is visual reconstruction evidence, not L5 runtime acceptance.

## 18. Minimal example

```json
{
  "schema": "kfb.scene-recipe.v0",
  "profile": "visual-preflight",
  "recipeId": "VR-003:block-bits:motif-A",
  "status": "candidate-only",
  "maturity": "L0",
  "sourceCaptures": [
    {
      "path": "Block_Bits_Sample - VOXEL PYRAMID + STAGE + WRESTLING RING FLOOR + BOXEL BLITZ.png",
      "inspectionState": "metadata-only"
    }
  ],
  "sceneIntent": {
    "label": "source-authored motif awaiting visual review",
    "status": "PROPOSAL"
  },
  "assets": [],
  "relations": [],
  "camera": {"status": "UNRESOLVED"},
  "lighting": {"status": "UNRESOLVED"},
  "unresolved": [
    {"question": "Which visible motif is represented?"},
    {"question": "Which exact Block Bits models are used?"}
  ]
}
```

The example intentionally remains L0 because a descriptive filename is not visual evidence.

## 19. Promotion rule

The first 3–5 Claude Design jobs must test whether this v0 shape is sufficient.

Allowed outcomes:

- keep v0 as-is;
- add/remove fields based on actual reconstruction needs;
- adapt into a pre-existing receiving-owner contract;
- reject parts that proved unnecessary.

Not allowed yet:

- declare `kfb.scene-recipe.v1` from desk design alone;
- promote any recipe to L5 without receiving-consumer testing;
- make this preflight file the runtime SSOT by default.

## 20. Exit criterion

The v0 proposal is ready for trial because:

- corpus index exists;
- source-match matrix exists;
- bounded visual jobs exist;
- canonical and WORLD NOW tracks are separated;
- owner boundaries are explicit.

Next evidence must come from actual Claude Design visual jobs, not additional schema speculation.