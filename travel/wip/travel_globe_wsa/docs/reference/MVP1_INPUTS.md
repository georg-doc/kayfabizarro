# 05 · Config + Animation Inputs

## Existing configs in GitHub

Path:

`georg-doc/KFB-Stunt-Car-Race/_inbox/Config_JSONs/`

Observed files:

| File | SHA | Status / use |
|---|---|---|
| `kfb-pet-graft-driver (1).json` | `da0e79d2d70a97c53608c22df4f428b93c1f3bef` | current Graft config donor |
| `kfb-rig-driver.json` | `03f65a4206d575abec796b0fb81d17903cd771be` | generic Driver rig config |
| `kfb-rig-driver (Bath 01).json` | `ec392d1fcdd8d1f2ac01ee751185f56f2a753753` | measured Bath/Driver donor |
| `kfb-rig-driver (Rover 01).json` | `3978516dd20dc434d69582ca3ce47fb0757b9aaf` | measured Rover/Driver donor |

Copies of the smaller rig configs are included under `configs/` for convenience.

## Bath 01 measured donor facts

The current config already records, among other data:

- Bath asset path
- jet asset path
- wheel setup
- Driver placement
- arm pose
- Bath dimensions
- wheel diameter / track / wheelbase
- waterline and inside-floor measurements
- driver hip/head relation to Bath

Status: **DONOR DATA**.

Do not treat these numbers as Travel runtime values until the receiving slice validates them.

## Rover 01 measured donor facts

The Rover config includes:

- Rover asset path
- Driver scale/placement
- cockpit/base/panel setup
- arm pose
- measured Rover dimensions
- roof/deck relation
- driver fit/overlap observations

Status: **DONOR DATA**.

## Parallel work now in progress

Georg is working in parallel on:

### Frankenstein Studio v16
Expected later input:

- newer FrizzleBob appearance
- final yellow visible face/head/hands direction
- black/KFB branding treatment
- updated exported configuration

### Animation Lab
Expected later input:

- correct Card standing/surf pose for FrizzleBobCraft Driver body
- possibly dedicated animation clips for Card riding / balance / reactions

These are **not B0 blockers**.

## B0 action

Astra should:

- record these sources in `/docs/` or equivalent
- not integrate them
- provide a clear future input slot for MVP1
- avoid creating a substitute pose/look while the real authoring work is in progress
