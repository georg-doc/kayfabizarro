# Tool Node · FrankenStein Studio v16

Status: CURRENT_TOOL
Source: `skills/KFB PetStudio/KFB FrankenStein Studio 16/KFB-v16/`
Standalone: `KFB-FrankenStein-Studio-v16-STANDALONE.html`

## Owns

Actor graft, host/body integration, head/face zones, material zones, look authoring, donor-eye handling, static pose/measurement, Card Rider measurement/export, and weapon attachment/mod presentation measurement/calibration using the existing v16 weapon modules.

## Key current modules

- `frizzlegraft-v1/graft-biped.v1.js`
- `frizzlegraft-v1/matzones.v1.js`
- `frizzlegraft-v1/headzones.v1.js`
- `frizzlegraft-v1/donoreyes.v1.js`
- `frizzlegraft-v1/cardrider.v1.js`
- `petstudio-v9/studio-v13/pose-rig.v1.js`
- `petstudio-v9/studio-v12/weapon-mods.v1.js`

## Start docs

- `docs/WSA_UEBERGABE_STUDIO_V16_2026-09-13.md`
- `docs/ONBOARDING_frischer_chat.md`
- `docs/OFFEN_nach_v16.md`
- `docs/LIVING_frizzlegraft.md` only for targeted history lookup

## Does not own

Travel flight physics, game world movement, game camera, projectile logic, damage, runtime combat aim, or consumer-specific world facing.

## Current placement boundary

Studio may measure/export generic actor-relative placement facts such as scale, pose, local XYZ/yaw, footprint, contacts and lift. Consumer-specific world behavior remains with the consumer:

- Travel owns flight/player-facing/world presentation.
- Combat owns Arena surface/world transform, combat facing and aim.

Do not refactor `cardrider.v1` into a new shared schema during an active consumer slice merely because a second consumer exists. Finish and verify the measured Studio output first; extract a generic rider-placement base later as an additive successor if two real consumers prove the need.

## Known current rules

Tint is not the actor material solution. Driver clothing uses measured atlas material zones. Black leather jacket was tested through `matzones`; consumers must apply the actual look state, not merely instantiate the module.

`weapon-mods.v1.js` measures the existing default gun in hand-bone coordinates and uses it as the reference for replacement weapon placement/scale. This is presentation/attachment calibration, not combat ownership.

Card Rider contains real measurement/export work, but documented card-art/visual-tilt issues remain historical open items until reverified in the consuming runtime.
