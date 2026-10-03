# KFB Procedural Test World 01

## What this is

A clean WorldBuilder test world cut from current `main`, using the proven B3 stable WorldBuilder owner set.

It exists so future movement/combat testing does **not** require the old Travel Globe host.

## Current behavior

- boots directly into Hürth B1 procedural-building world;
- 700-building stable WorldBuilder consumer donor;
- wider initial camera;
- terrain/edit owners retained;
- old `wi1-play` locomotion intentionally **disabled**;
- no Travel card lifecycle;
- no Flight/card-carrier dependency;
- no second renderer/world owner.

## Procedural design already available

Active world:
- proven procedural building chain / facade rules.

Pinned for next dressing pass:
- P1 procedural tree/rocks/bushes;
- P2 logs/stumps/mushrooms/grass.

These nature modules are source-proven geometry but are **not yet scattered into this world**. Do not claim otherwise.

## Why play is disabled

The old World Integration play layer contains the same local locomotion logic we are currently replacing with the central Animation/Motion SSOT.

The new test world must not silently reintroduce that legacy owner.

After the central neutral ActionFigure prototype receives Georg visual PASS, its consumer adapter can be attached here.

## Human-facing direction

This is the new development/test-world lane.
The old Travel Globe remains donor/history for specific Flight/card behaviors, not the default world for future locomotion review.

## No Stage yet

This branch is source/CI preparation only.
Do not give Georg a Cloudflare test URL until the world branch has real browser proof and a meaningful integrated review state.
