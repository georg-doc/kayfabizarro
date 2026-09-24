# ToolBox Source Lock · Evidence · 2026-09-23

## Compared source states

### 1 · Stage-First bundled Cube-Pet config
Dropbox:
`/CLAUDE/KFB ToolBox v0.5/KFB-ToolBox/stage-first/src/petstudio-v9/studio-v3/kfb-pets.json`

- schema: `kfb.pets/1`
- version: `1.2.7`
- length read: 36,419 characters
- updated field: `2026-08-25`

### 2 · Current GitHub Cube-Pet config
GitHub:
`media/3D_Assets/kfb-pets.json`

- blob: `cef6cca9cc69a6cb3c0b4a9d39f6b15579cbf055`
- version: `1.2.8`

### 3 · Later user-saved Cube-Pet config
Dropbox:
`/Mac/Downloads/kfb-pets (7).json`

- schema: `kfb.pets/1`
- version: `1.2.9`
- length read: 48,496 characters
- updated field: `2026-09-12`

## Concrete differences verified

### Bunny

1.2.7 contains the normal Cube-Bunny identity / eye / mouth values.

1.2.9 additionally contains measured:
- `body`
- `pad`
- `ground`

These are not present on the Bunny in the bundled 1.2.7 source.

### Penguin

1.2.7:
- eye ring `0.3`
- mouth size `0.8`
- mouth sx `1`

1.2.9:
- eye ring `0.245`
- mouth size `0.78`
- mouth sx `1.1`
- measured `body` block added

Therefore later user tuning is visibly/data-wise different from the Stage-First bundled state.

## Current FrizzleBob identity

ToolBox current actor source is not the Cube Bunny.

Verified current owner paths:
- `tools/KFB-ToolBox/kfb-rigs-embed-v3/frizzlegraft-v1/graft-mount.v1.js`
- `tools/KFB-ToolBox/kfb-rigs-embed-v3/contracts/kfb-pet-graft-driver.v4.json`

Existing current docs identify:
`FrizzleBob · Driver Graft · Rig_Medium`

Existing ToolBox SPEC explicitly says:
do not replace the FrizzleBob Driver Graft with the old Cube-Pet donor.

## Review conclusion

Claude Round 1 used a source combination that cannot satisfy current ToolBox identity/config preservation.

This evidence does not promote `kfb.pets/1.2.9` to canonical automatically.
It proves only that the current Stage-First bundled 1.2.7 file is stale relative to a later user-saved state.

Next gate remains:
`TB-SOURCE-LOCK-01` — isolated source review.
