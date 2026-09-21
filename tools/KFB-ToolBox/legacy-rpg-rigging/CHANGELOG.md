# Legacy RPG Rigging Lab · CHANGELOG

## 2026-09-21 · Candidate implementation

Added a ToolBox-owned Legacy RPG authoring candidate for KayKit Dungeon Pack 1.0:
- real source catalog;
- source isolation;
- 4 modular character bodies;
- 17 head choices;
- body/material clothing inventory;
- head gear/hair;
- 24 tiered weapons and additional props;
- existing 6-bone/30-clip Rig_Legacy donor;
- Resident-Atlas inverse-bind assembly;
- measured rigid-arm prop mounting;
- LegacyFaceHost;
- existing EyeRig-v6 batch candidate authoring.

Static/source contract reached **26/26 PASS**.

## 2026-09-21 · Browser gate repair 1

The first full browser proof timed out on a transient motion-status string after the runtime had already advanced to Idle. Proof synchronization was corrected.

## 2026-09-21 · Git tree recovery

A Git-data checkpoint was created without the intended base-tree SHA, temporarily omitting unrelated branch files from the commit tree. No force-push was used. The complete prior tree was restored by a fast-forward recovery commit and exact core-file readback.

Recovery head:
`b9b150b971fcc3fdac087b617b73420fded01575`

## 2026-09-21 · Browser gate repair 2 / freeze

Second browser attempt proved Barbarian assembly and then hit another stale-read synchronization bug while switching to Knight. Because this was the second repair pass on the same browser gate, implementation repair stopped.

Candidate classification:
`ARCHIVED_FAILED_BROWSER_GATE_CANDIDATE · SALVAGEABLE`

Exactly one next gate:
`KLR-SYNC-01 · deterministic 4/4 actor-switch readiness proof`.


## 2026-09-21 · KLR-SYNC-01 PASS

Added an explicit request/ready lifecycle to Legacy actor assembly so rapid actor changes cannot accept stale async completions.

Dedicated deterministic body-switch browser proof:
**41/41 PASS**.

The existing full browser/WebGL candidate proof then recovered to:
**44/44 PASS**.

Current technical state:
`LOCAL_BROWSER_PASS`.

Public Stage and human visual acceptance remain separate.

Next gate:
`KLR-KIT-01 · shared Legacy ActorRecipe + caller-seeded Character/Monster Randomizer`.
