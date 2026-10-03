# EYE_RIG_PER_EYE_CONTROL_01

Date: 2026-10-03  
Status: DEFERRED_DETAIL_AFTER_LEGACY · not current gate  
Current prerequisite: KLR-EYE-VIS-01 · Legacy 17-head visual review on PR #162  
Owner: KFB ToolBox / Rigging  
Repo: georg-doc/kayfabizarro  
Branch: toolbox/eye-rig-batch-2026-09-18  
PR: #104 · Draft/Open/Unmerged

## Starting point

The current Stage runtime is human-accepted by Georg.

Accepted runtime app blob:
`5635b28496af0e06cfe7f60a01b23e5612bad6e1`

Accepted capabilities include:
- actor catalog boot and Rig_Large switching;
- Control R2;
- 40-profile Medium recovery;
- 25 texture families / 56 source appearances;
- bounded wheel zoom;
- Neutral / Clay K1 view.

Do not regress or replace these owners.

## Outcome

Add the minimum authoring seam needed for genuinely asymmetric eye cases.

### Required

1. **Mirrored pair remains the default**
   - old profiles keep the current appearance and behavior;
   - no schema-wide migration required merely to open an old profile.

2. **Optional independent L/R position**
   - independent offsets must be opt-in;
   - pair controls remain the normal fast path;
   - independent values should be deltas from the pair solution, not a second unrelated placement model.

3. **Per-eye visibility**
   - left eye on/off;
   - right eye on/off;
   - visibility affects EyeRig rendering only, not source geometry ownership.

4. **First proof: Survivalist**
   - use the current exact Survivalist source;
   - eyepatch side must be identified from source evidence before choosing left/right;
   - the covered eye is disabled;
   - visible eye remains correctly seated through Front / 3/4 / Side and normal gaze/blink behavior.

5. **Persistence**
   - same LocalStorage key: `kfb.toolbox.eye-rig-batch.v0`;
   - current 40-profile batch must import/load unchanged;
   - new fields are additive;
   - no automatic profile reset.

6. **Runtime ownership**
   - EyeRig v6 remains the eye owner;
   - existing adapter is extended rather than forked;
   - no second per-eye runtime owner;
   - FaceHost remains unchanged unless a measured requirement proves otherwise.

## Suggested data shape

Backward-compatible optional fields under the existing eye profile:

```json
{
  "eye": {
    "perEye": {
      "enabled": false,
      "left":  { "visible": true, "dx": 0, "dy": 0, "dz": 0 },
      "right": { "visible": true, "dx": 0, "dy": 0, "dz": 0 }
    }
  }
}
```

Names are provisional; preserve the semantics even if the exact contract differs.

## UI

Keep the main paired controls unchanged.

Add one compact section:
- `Per-eye overrides` toggle;
- L/R visibility;
- L/R X/Y/Z delta fields.

Do not duplicate the entire Eye profile control surface.

## Tests

Minimum focused contract:
- old profile with no `perEye` behaves exactly as current paired mode;
- old 40-profile batch loads without mutation/reset;
- enabling per-eye with zero deltas is visually/numerically identical to paired mode;
- left/right deltas affect only the named eye;
- visibility affects only the named eye;
- gaze/oval/pupil seating remains valid on the visible eye;
- actor switch + reload persistence;
- Survivalist source-proven eyepatch side;
- Medium/Large existing behavior unchanged.

## Human gate

`GEORG_EYERIG_PER_EYE_SURVIVALIST_VIS_01`

Check:
1. normal paired actor still unchanged;
2. Survivalist loads;
3. eyepatch-covered EyeRig side is off;
4. visible eye is correctly placed in Front / 3/4 / Side;
5. gaze, blink, Oval and pupil behavior remain clean;
6. reload preserves per-eye state.

## Explicitly deferred

- Farmers palette A/B → model mapping;
- broad Blender/NoEyes cleanup batch;
- Pet Studio / FrankenStein numeric-edit parity;
- consumer/profile promotion;
- merge / Live promotion.
