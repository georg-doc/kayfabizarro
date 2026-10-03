# Tool Node · Animation Lab

Status: UNVERIFIED

This node intentionally does not invent a current site or implementation SSOT. Promote it to `CURRENT_TOOL` only after the current Animation Lab source/site is explicitly pinned.

## Intended responsibility

Clip inventory/audit, playback, animation behavior, dynamic pose/clip calibration and later authored vehicle/weapon/surf motion.

## Contract with FrankenStein Studio

FrankenStein Studio decides/measures actor, look, rig/static pose and exports configuration. Animation Lab consumes that state and plays/audits motion. Do not rebuild actor material/head ownership inside the Lab.

## Load with

`skills/kfb-cartoon-animation/SKILL.md`

This portable folder skill is the current shared animation/motion method reference. It preserves the former v2 doctrine and adds progressive-disclosure 3D/game-animation references; current project/runtime SSOTs still win.

## Promotion gate

Pin current implementation repository/path, current standalone/live site if any, current handover/return, and tested clip source revision.
