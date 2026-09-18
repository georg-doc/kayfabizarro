# Cross-Render Eye Proof · RETURN

Updated: 2026-09-18  
Status: **IMPLEMENTATION · STATIC SANITY PASS · BROWSER QA PENDING**

## Goal

Prove that the same semantic eye sequence can drive:

1. source-exact DocCheck Eumel via SVG/2D adapter;
2. FrizzleBob Driver Graft via ToolBox EyeRig v6 on a real `Rig_Medium` host.

Exact sequence:

`neutral → blink → look_left → look_right → surprised → thinking → neutral`

## Why this 3D actor

FrizzleBob Driver Graft is used for **Phase A protocol proof** because it already has:

- measured Rig_Medium host;
- 23 joints;
- current public `mountGraft()` path;
- real EyeRig-v6 owner;
- one known update lifecycle.

No temporary second EyeRig is mounted.

This does **not** approve a generic EyeRig Batch Medium profile.

## Shared implementation

- protocol: `kfb.eye-rig.protocol/1`
- clips: `../../shared/eye-rig/eye-clips.v1.json`
- sequence runner: `../../shared/eye-rig/eye-sequence-runner.v1.js`
- 2D adapter: `../../shared/eye-rig/eye-rig-2d-adapter.v1.js`
- 3D adapter: existing ToolBox EyeRig v6 through Graft

The sequence runner has no SVG/Three.js geometry knowledge.

## Deterministic harness

For the proof:

- autonomous eye life is disabled;
- kinetics are disabled;
- automatic blink is parked;
- only semantic sequence calls should visibly change eye state.

This harness setup is proof-specific and does not modify canonical actor/source data.

## eyeFrame

The page exposes optional eyeFrame markers on both sides.

That verifies the intended shared accessory seam before the richer DocCheck Eye/Face Modifier Atlas is attached.

## Static evidence

`qa/STATIC_SANITY_2026-09-18.md`

PASS:

- proof JS parse;
- sequence runner parse;
- EyeRig2D parse;
- JSON manifests;
- exact requested sequence;
- 3D Rig_Medium / 23-joint manifest facts;
- Eumel source blob pin.

## Browser gates still open

- route loads through Cloudflare;
- Eumel source SVG visibly mounts;
- 3D Graft loads over pinned ToolBox donor URLs;
- both sides visibly execute the same sequence;
- Blink Now semantics read correctly;
- look left/right directions match;
- surprised/thinking are readable in both renderers;
- eyeFrame markers align with both eyes;
- final neutral recovery is clean;
- Georg visual acceptance.

## Phase B

After the Batch EyeRig Atlas approves its first generic Rig_Medium EyeProfile, rerun the same sequence with that actor.

That proves the generic profile/binding lane. Phase A does not claim it.

## Modifier Atlas follow-up

Initial scaffold:

`../../shared/eye-rig/modifier-atlas/`

Current source-resolved items are intentionally limited. Dropbox source discovery found no additional obvious Illustrator candidate by the searched terms; this is not proof that richer source assets do not exist.

Do not fabricate rings/lids/eyewear until the authoritative source package/path is found.
