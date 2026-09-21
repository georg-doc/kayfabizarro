# Tool Node · Animation Lab

Status: UNVERIFIED

This node intentionally does not invent a current site or implementation SSOT. Promote it to `CURRENT_TOOL` only after the current Animation Lab source/site is explicitly pinned.

## Intended responsibility

Clip inventory/audit, playback, animation behavior, dynamic pose/clip calibration and later authored vehicle/weapon/surf motion.

## Contract with FrankenStein Studio

FrankenStein Studio decides/measures actor, look, rig/static pose and exports configuration. Animation Lab consumes that state and plays/audits motion. Do not rebuild actor material/head ownership inside the Lab.

## Load with

`skills/kfb-cartoon-animation_v2.md`

This skill currently declares version 2.0 and `canonical-draft`; it provides the KFB motion, staging, VFX and recovery grammar and should be treated as a current reference unless the registry supersedes it.

## Promotion gate

Pin current implementation repository/path, current standalone/live site if any, current handover/return, and tested clip source revision.
