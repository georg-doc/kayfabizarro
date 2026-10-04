# DRAFT · WorldBuilder · MVP M1 "a region you can walk" · 2026-09-26

Status: **DRAFT for discussion, solution-open.** Not an execution brief. Written by Coworker; must be checked (WSA/architecture) before any chat executes it.

## Problem
Georg wants one coherent, visible world in which KFB content lives: shape terrain, place things, walk a character, later drive. Many strong parts exist, but the last integration attempt (World r2) failed after two repair passes, and the direction statements in the repo contradict each other.

## What exists (read before proposing anything)
- **WB1 scene editor + WB2 terrain sculpt**, human PASS (#186, #190 @ec52eb74). Shared object editor `tools/KFB-ToolBox/lib/edit-layer.js`.
- **World r2** re-homed in #190, consumes the ToolBox locomotion profile; static 20/20, browser gate FAIL (stale selftest label semantics after profile ownership moved). Failure package: `world-integration-01/failure-recovery/`. Next gate named: `WORLD-R2-CONTRACT-RESET-01`.
- **WB-W0** (#203): measured sizes, walkable corridor, 25° slope limit, Cologne region, separate globe/local scale.
- **ENV-PREVIEW-01** (#218) and `WORLD-ENV-CONSOLIDATE-01` in #204: one thin environment recipe (terrain, biome field, mood/sky/light, nature).
- Look donors: WorldDesign Lab (triplanar RGB palette, macro texture, cel, ink), Elastic Grotesque Clay V2 + view switch, landmark colour = KFB seed (#208), TinySkies sky/weather modules, ZyFou Planet mode (MIT).
- Georg's decisions 24.09: Travel Globe is out as world base; TinySkies only for sky/weather/light/mood/camera-flight idea; no faceted polygon globe; one continuous camera move; Hex/voxel/OSM/landmarks are placed content.

## Georg 26.09.
- Rule: take what works and fits best, per module, until something better exists.
- World base of 24.09. stands: Travel Globe out; TinySkies sky/weather/light, or better methods from ongoing research. #204's "macro-world truth" wording is superseded.
- **Locomotion first**, e.g. card flight (doubles as god-mode travel); ground↔flight transition from Travel TMB-2 (accepted 400 ms), not Travel terrain.
- **Optimised orbit camera** as one shared module (like `edit-layer.js`): zoom to cursor, clean pan/orbit, touch. Donors: WhackMan cursor-focus zoom, WB2 orbit.
- Then integrate OSM zones and tracks into the terrain; needs a small height-ownership contract (carving roads/tracks into terrain).

## Open questions (to settle first, not to guess)
1. Is the globe view in v1 at all, or does M1 start as one local region?
2. Local region first (Hürth → Cologne, WB-W0) and planet later, or both scales from day one?
3. Who owns the terrain height truth once WB2 sculpt, OSM ground and track corridors meet?
4. What exactly failed in World r2's contract, and does a contract reset fix it without touching accepted parts?

## Options (not decisions)
- **A · Contract reset first:** repair the World r2 contract (labels/profile ownership), keep everything else; then add look.
- **B · Local region MVP:** WB-W0 region + WB2 sculpt + ToolBox walker + sky; planet/globe postponed.
- **C · Look pass in Claude Design** on top of A or B (triplanar/cel/ink, view switch) — only after the functional base is green.

## Success signals (checkable by looking)
- Georg walks a character across a hill he sculpted in one region, no falling through, no facets.
- Sky switches DAY/NIGHT/RAIN; mood shifts hue only.
- Save → reload → same world.
- A second chat can pick it up from GitHub alone.

## Guardrails
Take what works; no second terrain/sky/editor owner; wrapper review pages only; Claude Design delivers full export + additive changelog; two failed passes → stop and write a failure package.
