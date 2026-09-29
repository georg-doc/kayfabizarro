# KFB Motion Profile Router

Status: **CANDIDATE STABLE OWNER · 2026-09-29**
Owner: **Animation Lab / ToolBox Motion**

## Canonical files on this candidate branch

- `tools/KFB-ToolBox/kfb-lib/locomotion-profiles.v1.js`
- `tools/KFB-ToolBox/kfb-lib/anim-map.v1.js`

These are byte-identical promotions from the accepted ToolBox Production-03 session-cut donors. They are not rewritten summaries.

## Ownership

### locomotion-profiles.v1.js
Owns:
- KayKit semantic locomotion roles;
- source clip selection rules;
- measured cadence / stance-speed / contact facts;
- transition hints;
- consumer-view export.

Does not own:
- world position;
- physics;
- gameplay input;
- camera.

### anim-map.v1.js
Owns:
- broader gameplay state → source clip / procedural presentation classification;
- exact/adaptable/procedural/missing status;
- seated and drive presentation roles such as `SitVehicle`, `DriveIdle`, `DriveSteerLeft/Right`, `DriveAccelerate`, `DriveBrake`, `DriveAirborneBrace`, `DriveLandingReact`.

Does not own:
- steering;
- suspension;
- drift;
- acceleration/braking physics;
- flight physics.

## Consumer order

1. **Ground now** — Turbo Ground reads locomotion roles/transitions; `walk-controller` stays movement owner.
2. **Cars later** — KFB-Stunt-Car-Race reads drive/rider/vehicle profile facts; Race v0.8 driving feel and physics stay Race-owned.
3. **Flight later** — KFB-Travel-Globe reads carrier/profile/presentation facts; Travel Flight / `carpet.js` stays movement owner.

## Source provenance

Promoted from:
`tools/KFB-ToolBox/_inbox/KFB ToolBox Production-03/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-27_r2/kfb-lib/`

Exact donor blobs:
- locomotion: `3db9fbd482e6a527c417e79af826138ff28efa33`
- anim-map: `7120f80e25e8a91106441039fb036c059a4d0e0d`

Do not re-create local role tables in consumers when these files answer the mapping question.
