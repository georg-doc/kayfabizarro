# KFB Asset Librarian · Visual Scene Atlas Preflight · SCENE_RECIPE v0 Proposal

**Date:** 2026-09-16  
**Status:** `PROPOSAL ONLY / VISUAL-EVIDENCE SIDECAR / NOT A RUNTIME CONTRACT`  
**Branch:** `chat/kaykit-visual-scene-atlas-preflight-2026-09-16`

## 0. Non-ownership rule

This document proposes a **visual reconstruction return shape** for Claude Design. It is not a new Registry schema, not a ToolBox schema, and not a consumer runtime/world schema.

Project history references consumer-side world-recipe work, including a Stunt-Race `WORLD_RECIPE.v0`. A canonical current copy was not resolved in the present connector lookup, so this proposal deliberately avoids taking runtime/world ownership.

If a receiving consumer already has a world/scene recipe contract, **adapt these evidence fields into that owner**. Do not replace or fork the consumer contract silently.

Working name in this preflight:

`kfb.visual-scene-recipe.v0-proposal`

The `visual-` prefix is intentional: this object records reconstruction evidence and candidate composition, not runtime truth.

## 1. Purpose

A visual agent should be able to inspect an official/demo/reference capture and return enough structured information that a later consumer can:

1. understand what was actually demonstrated;
2. find the matching owned source assets where possible;
3. reconstruct a small candidate scene without reopening the full asset library;
4. know which placements are measured/observed versus inferred;
5. know exactly what remains untested.

## 2. Required status discipline

Each claim must carry one of:

- `SOURCE_FACT`
- `OBSERVED_DEMO`
- `INFERENCE`
- `PROPOSAL`
- `TESTED_RESULT`
- `UNRESOLVED`

`TESTED_RESULT` is allowed only when the recipe points to an already documented KFB test with scope. Claude Design visual reconstruction itself normally produces `OBSERVED_DEMO`, `INFERENCE`, and `PROPOSAL`, not runtime test results.

## 3. Proposed top-level shape

```json
{
  "schema": "kfb.visual-scene-recipe.v0-proposal",
  "recipeId": "VR-003:block-bits:stage",
  "status": "candidate-only",
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

This is an authoring/research sidecar. No field becomes authoritative merely because it exists in the object.

## 4. `sourceCaptures`

Required for traceability.

```json
{
  "sourceId": "block-bits-sample",
  "path": "_inbox/KayKit_PACKS_References_Scenes_Demos/Block_Bits_Sample ... .png",
  "sourceKind": "official-demo-image | promo | gif | mockup | saved-page | screenshot",
  "rightsHandling": "reference-only",
  "inspectionState": "frame-reviewed | image-reviewed | metadata-only",
  "notes": []
}
```

Rules:

- never upgrade `metadata-only` into `OBSERVED_DEMO`;
- keep reference paths, not copied paid media;
- for GIF/video, allow explicit frame/time anchors where available.

## 5. `sceneIntent`

Describes why the recipe exists.

```json
{
  "label": "Birthday cozy party P0",
  "status": "PROPOSAL",
  "smallestUsefulSlice": "two active heroes + compact party focal zone + depth dressing",
  "nonGoals": [
    "full interior architecture system",
    "new animation owner",
    "automatic prop compatibility"
  ]
}
```

## 6. `environment`

Functional scene roles, not Registry taxonomy.

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

Possible role labels:

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

These labels exist only inside the visual recipe unless a receiving owner explicitly adopts/matches them.

## 7. `assets`

Each selected or candidate object gets its own evidence record.

```json
{
  "assetRole": "performance_prop",
  "displayName": "GothGirl Microphone",
  "sourcePath": "media/3D_Assets/KayKit_Mystery_Series6/GothGirl/assets/gltf/GothGirl_Microphone.gltf",
  "sourceMatch": "exact | family-only | unresolved",
  "sourceMatchConfidence": "high | medium | low",
  "availability": "OWNED | REFERENCE_ONLY | MISSING | UNKNOWN",
  "evidence": [
    {"status": "SOURCE_FACT", "claim": "same authored GothGirl collection"}
  ],
  "required": false
}
```

Rules:

- `sourcePath` may be null;
- never invent a filename/path from visual appearance;
- `same authored collection` is not attachment compatibility;
- archive-only source gets pack/family information, not fake per-model assets.

## 8. `relations`

This is the most important anti-guess layer.

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

### Important distinction

`held_by` as `OBSERVED_DEMO` means the reference visibly shows a held relation.

It does not mean:

- correct KFB anchor exists;
- the pivot is correct;
- retargeting works;
- the asset can be attached without calibration.

Those remain receiving-owner tests.

## 9. Placement / transform representation

Prefer **relative** reconstruction evidence over false precision.

Example:

```json
{
  "relativeTo": "hero_zone_center",
  "position": {"x": 0.35, "y": 0.0, "z": -0.20},
  "units": "normalized-scene-width",
  "status": "INFERENCE",
  "confidence": "medium"
}
```

For visually measured pixel/frame relations, the recipe may additionally store:

```json
{
  "screenAnchor": {"x": 0.62, "y": 0.73},
  "screenUnits": "normalized-frame",
  "status": "OBSERVED_DEMO"
}
```

Do not manufacture world-meter coordinates from a single perspective image.

## 10. Scale relations

Prefer ratios:

```json
{
  "a": "stool",
  "b": "gothgirl",
  "relation": "height_ratio",
  "value": 0.42,
  "status": "INFERENCE",
  "confidence": "medium"
}
```

If not measurable with confidence, use `UNRESOLVED` rather than a plausible-looking number.

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

Exact camera numbers should only be returned when actually measured/reconstructed.

## 12. Lighting

```json
{
  "status": "OBSERVED_DEMO",
  "keyDirection": "front-left",
  "fill": "soft ambient",
  "contrast": "low",
  "timeOfDay": "day | night | indoor | stylized | unknown",
  "notes": []
}
```

A source-page statement such as Kay's day/night/indoor lighting work is `SOURCE_FACT`; it is not an observation about a specific screenshot unless the screenshot itself is reviewed.

## 13. Materials / glow / FX

```json
{
  "target": "holiday-light-prop",
  "effect": "emissive/glow",
  "sourceMaterial": "holiday_glow",
  "status": "SOURCE_FACT",
  "observedInCapture": false,
  "kfbTreatment": null
}
```

Keep three separate layers:

1. material/source fact;
2. visual effect actually observed;
3. proposed KFB rendering treatment.

## 14. Characters / motion / props

```json
{
  "actor": "GothGirl",
  "sourcePath": "...",
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

If a known KFB test exists, reference it separately:

```json
{
  "testedEvidenceRef": "GothGirl Death_A 69/69 Librarian preview",
  "scope": "Asset Librarian preview only",
  "status": "TESTED_RESULT"
}
```

Never generalize the test to unrelated clips/consumers.

## 15. `evidenceSummary`

Each recipe must end with a compact count/summary:

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

This makes it obvious whether a recipe is mostly observation or mostly proposal.

## 16. `unresolved`

Explicitly preserve blockers:

```json
[
  {
    "question": "Which exact City Builder road model matches the visible straight section?",
    "ownerNeeded": "Asset/Registry source exposure",
    "blocking": false
  }
]
```

## 17. `reconstructionChecklist`

A recipe should finish with a short visual verification sequence, e.g.:

1. load only listed source candidates;
2. reproduce coarse composition;
3. compare silhouette/spacing against source capture;
4. tune relative scale;
5. tune camera;
6. add light/material/FX only where evidence exists;
7. capture comparison screenshot;
8. label mismatches;
9. return unresolved rather than hiding them.

This is a visual reconstruction checklist, not a runtime acceptance test.

## 18. Example · minimal Block Bits sub-recipe

Illustrative structure only; values are intentionally unresolved until visual review.

```json
{
  "schema": "kfb.visual-scene-recipe.v0-proposal",
  "recipeId": "VR-003:block-bits:stage",
  "status": "candidate-only",
  "sourceCaptures": [
    {
      "path": "Block_Bits_Sample - VOXEL PYRAMID + STAGE + WRESTLING RING FLOOR + BOXEL BLITZ.png",
      "inspectionState": "metadata-only"
    }
  ],
  "sceneIntent": {
    "label": "source-authored stage motif",
    "status": "PROPOSAL"
  },
  "assets": [],
  "relations": [],
  "camera": {"status": "UNRESOLVED"},
  "lighting": {"status": "UNRESOLVED"},
  "unresolved": [
    {"question": "Which visible motif is the stage?"},
    {"question": "Which exact Block Bits models are used?"}
  ]
}
```

The example demonstrates the rule: a descriptive filename is not enough to populate visual geometry facts.

## 19. Consumer handoff rule

When a recipe is accepted as useful, the receiving owner may:

- translate roles into its existing scene/world contract;
- resolve exact runtime transforms;
- run collision/animation/attachment tests;
- accept/reject source candidates.

The visual recipe stays as provenance/evidence. It should not become the runtime source of truth unless the consumer explicitly adopts it through its own decision process.

## 20. Exit criterion

This proposal is ready for Claude Design use when:

- `SOURCE_ASSET_MATCH_MATRIX.md` is available;
- the first `VISUAL_JOB_PACKETS` cite this template;
- `CLAUDE_DESIGN_START_HERE.md` explicitly states the owner boundary;
- no receiving runtime contract is silently replaced.

## 21. Next checkpoint

Create the first bounded `VISUAL_JOB_PACKETS/` for Birthday, Orbit 7, Block Bits, City Builder/Resource, then character/prop jobs.