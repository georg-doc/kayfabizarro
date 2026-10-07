# KFB Open World · MVP Acceptance Rule · 2026-10-07

Status: **BINDING PRODUCT RULE**
Owner: **Georg / KFB Open World**

## Rule

For KFB Open World, partial integration progress is not an MVP.

The label `Receiving Core` may be used only as a historical description of a subsystem snapshot. It must not be used as a product-progress substitute, acceptance status, or near-MVP label.

An Open World MVP exists only when the **complete frozen Acceptance Matrix** is green at the required proof level.

If any required row is partial, missing, conflicted, unproven, or below its required acceptance proof, the product status is:

**NO MVP**

Subsystems may still be classified individually as KEEP / PASS donors or useful evidence. That does not change the product-level status.

## Anti-feature-loss rule

The complete Acceptance Matrix is the product contract.

A required feature may leave that matrix only after an explicit Georg product decision.

A feature does not become optional because:
- the newest candidate does not contain it;
- an executor did not implement it;
- a local slice called itself complete;
- a technical core is stable;
- a Freeze was run;
- a subsystem scored well.

## Reporting rule

ChefWSA / Recovery Lead / Integrator must report Open World product status using only:

- **MVP PASS · COMPLETE ACCEPTANCE MATRIX GREEN**
- **NO MVP · ACCEPTANCE MATRIX NOT FULLY GREEN**

Do not use:
- near MVP;
- receiving-core MVP;
- mostly complete MVP;
- MVP except for;
- equivalent aggregate-progress language.

Partial work belongs in the capability matrix, donor census and technical evidence.

## Gate

No Open World Site may be presented to Georg as an MVP until the complete Acceptance Matrix is green and independently checked.
