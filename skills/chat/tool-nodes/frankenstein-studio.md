# Tool Node · FrankenStein Studio v16

Status: CURRENT_TOOL
Source: `skills/KFB PetStudio/KFB FrankenStein Studio 16/KFB-v16/`
Standalone: `KFB-FrankenStein-Studio-v16-STANDALONE.html`

## Owns

Actor graft, host/body integration, head/face zones, material zones, look authoring, donor-eye handling, static pose/measurement and Card Rider measurement/export.

## Key current modules

- `frizzlegraft-v1/graft-biped.v1.js`
- `frizzlegraft-v1/matzones.v1.js`
- `frizzlegraft-v1/headzones.v1.js`
- `frizzlegraft-v1/donoreyes.v1.js`
- `frizzlegraft-v1/cardrider.v1.js`
- `petstudio-v9/studio-v13/pose-rig.v1.js`

## Start docs

- `docs/WSA_UEBERGABE_STUDIO_V16_2026-09-13.md`
- `docs/ONBOARDING_frischer_chat.md`
- `docs/OFFEN_nach_v16.md`
- `docs/LIVING_frizzlegraft.md` only for targeted history lookup

## Does not own

Travel flight physics, world movement, game camera or project-level implementation SSOTs.

## Known current rules

Tint is not the actor material solution. Driver clothing uses measured atlas material zones. Black leather jacket was tested through `matzones`; consumers must apply the actual look state, not merely instantiate the module.

Card Rider contains real measurement/export work, but documented card-art/visual-tilt issues remain historical open items until reverified in the consuming runtime.
