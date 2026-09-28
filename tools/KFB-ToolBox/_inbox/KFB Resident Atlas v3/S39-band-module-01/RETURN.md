# RETURN · RESIDENT-BAND-MODULE-01 · 2026-09-28

Status: **RECOVERED EXISTING IMPLEMENTATION · HUMAN DRUMMER POSE PENDING**

## Owner / branch / outcome

- Repo: `georg-doc/kayfabizarro`
- Owner: Resident Atlas · S39 band module
- Branch: `chatgpt-web/resident-band-module-01-2026-09-28`
- Base recovered from main: `67f28c955b8dfeb10085d9d09c895e004edb6614`
- Outcome: publish the existing baseplate-free S39/S8 Orc-band authoring surface for one real visual drummer-pose gate; do not rebuild the band or create a second runtime owner.
- Planned Stage route: `https://kayfabizarro.pages.dev/kfb-hub/stage/resident-atlas/band/`

## Recovered GitHub truth

The requested module already exists on main as S39 and is later consumed by S8/S9 and ToolBox. The correct action is continuation, not reconstruction.

Existing implementation:
- `KFB_Resident_Atlas_S8.html#__band` = current S39 band workspace;
- `data/resident-band-module-01.json` = `kfb.resident-band-module/1`, `baseplate:false`;
- `lib/band-module.js` = one module root, host support anchor, host beat clock;
- Legacy Orc B leader from its own source;
- Orc Raider guitarist from its own source;
- Orc Brute drummer from its own source;
- exact Wardrum + two WardrumStick assets;
- song `Rubbish Groove 2min A extend 01.mp3`, 100 BPM, phase 0.465 s;
- Motion Library Guitar A plus current drum/bounce actions;
- source ORB stage GLBs are read for clips only, never used as replacement geometry.

Historical measured evidence retained in S39:
- action binding: 7/7 · 69/69 · 69/69;
- song git blob: `368eb5ae…` matched in browser;
- drummer closest-contact frames: v5c R frame 0 = +0.026; L frame 25 = +0.025;
- one-root placement + host support probe exists;
- S8 provides Play/Pause/song timeline, bone/prop picking, puppet controls and whole-module root selection.

## Exact remaining acceptance gap

`data/resident-band-module-01.json` currently persists:

```json
"posePatches": { "drummer": null }
```

S39b proved the reference-pose machinery, but its test pose was deliberately deleted after the probe. Therefore the only blocking product decision is Georg's real drummer contact pose.

Required next flow:
1. open the real S8 band workspace;
2. hold the measured strike frame (R frame 0 or L frame 25);
3. adjust with the existing bone / puppet / stick controls;
4. save the Studio reference pose;
5. test one constant delta over all 48 frames;
6. if acceptable, persist it as the Resident patch;
7. if not, export the exact time-varying delta to `POSE-TO-BLENDER-01`.

No new automatic arm-to-drum solver is permitted.

## Deferred / non-blocking

- Existing notes report drummer support penetration of roughly 0.08–0.105 and banner-foot offset 0.209. These are not the named pose gate unless they prevent the visual contact review.
- Optional trumpeter extension is not part of the acceptance target.
- `kfb-web-push` was checked once but is not exposed as a connector action and no repo helper by that name was found. Repository-native GitHub writes are the fallback for this slice.

## One next gate

**BAND-POSE-GATE-01:** publish the existing S8 owner surface at the fixed KFB Stage route and let Georg author the drummer contact pose there. No other human micro-gate is required.
