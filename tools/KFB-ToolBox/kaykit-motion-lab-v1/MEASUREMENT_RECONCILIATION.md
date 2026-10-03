# Motion Measurement Reconciliation

## Rule
Blender MCP and existing Three.js/KCL measurements are independent evidence sources.

Neither source silently overrides the other.

The reconciler:
- places values side by side;
- computes absolute and relative deltas;
- preserves semantic warnings such as Running_B HOLD;
- leaves the candidate null when values differ;
- requires a later explicit resolution step.

No arbitrary tolerance is used to declare agreement.

Exact equality can be marked MATCHED.
Everything else stays UNRESOLVED until the measurement method or human visual evidence justifies a decision.

## Current exact existing evidence
KCL-M1 source:
- PR #107
- head fc49a336af57adb6317b74211b3318d004d96de5
- MEASURED_PROFILE_CANDIDATE.json blob 943b0cb91965d05421a826f8938aa2ada7690df9

The exact evidence file is copied byte-identically into this branch under:
`kaykit-motion-lab-v1/evidence/KCL_M1_MEASURED_PROFILE_CANDIDATE.json`

## Blender input
Use:
- BLENDER_MEASUREMENT_BRIEF.md
- BLENDER_MEASUREMENT_INTAKE.schema.json
- BLENDER_MEASUREMENT_INTAKE.template.json

## CLI
```
node tools/KFB-ToolBox/kaykit-motion-lab-v1/reconcile-measurements.mjs \
  tools/KFB-ToolBox/kaykit-motion-lab-v1/evidence/KCL_M1_MEASURED_PROFILE_CANDIDATE.json \
  <filled-blender-intake.json> \
  <reconciliation-output.json>
```

The reconciliation output is evidence, not automatic promotion.
