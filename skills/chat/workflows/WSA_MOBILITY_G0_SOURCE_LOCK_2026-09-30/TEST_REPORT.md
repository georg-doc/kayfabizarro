# G0 Test Report

Status: **PASS · 51/51**

The repeatable validator is `validate-g0.mjs`. It checks exact local Git objects for current main, PR #294, PR #297, the KayKit hatchback, J14 and the J15 ZIP; it also checks the no-occupant source fact and the locked owner/input invariants.

The private Race repository was read back separately through the authenticated GitHub browser at exact head `df1e35b5692273e8a48eaa219697c927e2c39faa`. Its selected source files are pinned in `INTEGRATION_LOCK.json` with Git blob and SHA-256 values.

## Repeatable validator

`validate-g0.mjs`: **51 passed, 0 failed**.

Covered:

- current main, PR #294 and PR #297 commit existence;
- 9 exact planning/Ground Git blobs;
- KayKit GLTF/BIN/texture Git blobs and SHA-256 values;
- exact KayKit node inventory, zero animations, zero skins and no occupant node;
- 8 exact J14 source/document blobs and all 6 P1a stream-part blobs;
- J15 ZIP blob, 13,316,447-byte size and SHA-256;
- single Ground writer, KayKit-only vehicle policy, J14/J15 non-owner classifications and mode/input rules.

## Private Race read-back

At `df1e35b…` the browser read and hashed:

- v0.8 config: blob `38afec4…`, SHA-256 `2d82083…`;
- v0.8 host: blob `53300a7…`, SHA-256 `652bb5d…`;
- FR-S04-02 physics: blob `c14483b…`, SHA-256 `098510d…`;
- drive intent: blob `57ae25c…`, SHA-256 `8b2e60c…`;
- world declarations: blob `2cfe241…`, SHA-256 `d5bbfba…`;
- track adapter and flow/config dependencies.

Static dependency inspection found no OSM dependency in the selected v0.8 or FR-S04-02 files. It did find optional Kenney presentation references in the Race host/world inventory; therefore the G1 lock explicitly selects only the KayKit hatchback and forbids wholesale presentation imports.

## Initial repair history

The first validator run reported 50/51 because the human-readable KayKit node aliases in the lock did not match the exact glTF node strings. The lock was corrected to the source names; the second run passed 51/51. No runtime or product code was changed.
