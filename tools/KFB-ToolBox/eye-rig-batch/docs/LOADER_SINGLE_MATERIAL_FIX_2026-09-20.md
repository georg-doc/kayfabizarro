# EyeRig Actor Loader Regression · Single-Material Heads · 2026-09-20

Status: **FIXED · REGRESSION COVERED**

## User-visible failure

When switching from GothGirl to other Medium/Large actors the workbench could stop at:

`Cannot read properties of undefined (reading 'push')`

The actor was then marked Unsupported even though the GLB itself loaded correctly.

## Root cause

The reused donor-eye stripping helper preserves material groups while rebuilding the head index.

Many KayKit heads use exactly one material / one GLTF primitive and therefore arrive in Three.js with no explicit geometry groups.

The donor assumed at least one group and attempted to push triangle indices into a non-existent group array.

This was a common loader-path bug, not a per-model asset problem.

## Repair

The batch cleanup adapter now:

1. detects a head geometry with zero explicit groups;
2. creates one temporary whole-mesh material group;
3. calls the existing donor-eye stripper unchanged;
4. removes the temporary group again on restore or failure.

The donor itself remains the source of eye-pair detection / stripping logic.

Profiles incorrectly marked `Unsupported` only because of the previous loader exception automatically return to `Unreviewed` after a successful reload.

## Concrete affected geometry proof

- Clown head: one GLTF primitive.
- Monstrosity head: one GLTF primitive.

Both match the exact missing-group condition that produced the exception.

## Regression tests

After the repair:

- focused loader repair checks: **8/8 PASS**
- full persisted suite: **84/84 PASS**
- app syntax: PASS
- generic cleanup syntax: PASS

New contract guards:

- `generic-cleanup-single-material-fallback`
- `loader-error-review-recovery`

## Human check

Reload the EyeRig Stage and select a previously failing actor such as Clown.

Expected result:

- model loads instead of showing the push exception;
- any stale technical Unsupported state caused by that exception is cleared;
- normal review can continue.
