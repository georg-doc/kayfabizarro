# WSA/Work · Consolidation Round 01 · 2026-09-24

Status: **CLOSED PACKET · REQUESTED BY GEORG**
From: Claude Coworker (operational lead since 23.09). Bus: GitHub only (see `COWORKER_WSA_SYNC_BRIDGE.md`).

## Why you, why now

Since your last round everything ran through ChatGPT Web chats + Coworker. Georg wants one consolidation round that uses what only Work/WSA has:

- **read/write access to the private repos** `georg-doc/KFB-Travel-Globe` and `georg-doc/KFB-Stunt-Car-Race` (Claude cannot read them: 404);
- **local multi-repo checkout** (compare/assemble across repos);
- **your own knowledge from the earlier lead rounds** that never made it into GitHub.

## Decisions since your last round (do not reopen)

1. **GitHub is the only SSOT.** Dropbox/local copies are never authoritative.
2. **World base:** our continuous terrain editor (WB1 scene editor R2 PASS · WB2 sculpt ACCEPT, PRs #186/#190) on a **sphere**; ZyFou/ProceduralTerrains (MIT) is the planet donor. **Travel Globe is out as world base** (polygon anatomy cannot take the racetrack). From TinySkies only sky dome, clouds, weather, day/night, moods, camera-flight idea. Hex/voxel/OSM/landmarks are placed content. Source: `tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/TERRAIN_FIRST_RESET_2026-09-23.md`.
3. **Next visible build is Claude Design:** `.../WORLD_BUILDER_V1_2026-09-22/START_CLAUDE_DESIGN_WORLDBUILDER_V1.md` (main).
4. **Form language:** Hürth Elastic Grotesque Clay V2 (#194 @`0c59e92d`) → TUNE ONCE, then basis. It is the **default view only**; Clean/Cartoon/Grotesque stay switchable. Look composition with landmarks, StoryMap, OSM zones, WorldDesign Lab shaders, TinySkies sky: `LOOK_COMPOSITION_01_2026-09-24.md` (#194 branch).
5. **Animations:** Mixamo FBX (33, Dropbox) → retarget to Rig_Medium/Large in Blender → KFB Motion Library + catalogue in the public repo; raw FBX never on GitHub. Eyes on by default via EyeRig Atlas; Legacy eye review pending. `.../ANIMATION_INTAKE_01_MIXAMO_2026-09-24.md` (main).
6. **Review transport:** unchanged multi-file apps are published as a small wrapper (`<base href>` → jsDelivr @commit) under `kfb-hub/pruefen/<name>/` on `cloudflare-live`. No single-file bundles, no simplified chat mirrors (they caused the "Schwundformen").
7. **KFB Hub** = one live page `kayfabizarro.pages.dev/kfb-hub/` (Production Desk built from `tools/production_desk/config.json`; branch `claude/production-desk-v0-2026-09-23`, not merged).
8. Racetrack: separate Blender MCP chat builds a modular kit from Stunt PR #33 @`71e7051b` (R3d TUNE).

## Work may do (closed list)

A. **One current-state file.** Read all open kayfabizarro PRs (#174–#196), Travel and Stunt repos (main + open PRs), and write `CURRENT_STATE_2026-09-24_WSA.md` next to this packet: per lane → exact head, what Georg accepted/rejected, the single next gate, owner. Mark every contradiction with the decisions above instead of resolving it by rewriting history.

B. **Private-repo facts Claude cannot see.** For Travel and Stunt, list what is still needed by the new direction and what is superseded (e.g. Travel terrain/flight = superseded as world base; TinySkies sky/weather modules = still needed; Stunt track/vehicle/physics = needed). Name exact paths/heads of the parts to reuse.

C. **Status bridge for the Hub.** Propose (do not silently deploy) the smallest way for Travel/Stunt status to reach the public Hub registry (e.g. a status JSON pushed to kayfabizarro by a workflow in each private repo). Name the secret/token Georg must create.

D. **cloudflare-live route loss.** Several earlier routes (travel world-builder, free-roam) vanished from `cloudflare-live` while `main` still has them. Find the cause (commit/rebuild) and list which routes are still wanted under the new direction. Restore nothing without Georg's yes.

E. **Knowledge return.** Write down anything you know from earlier lead rounds that is not on GitHub and still matters (owners, rejected directions, credentials setup, private-repo conventions).

## Work must not

Design features, tune visuals, rebuild donors, reopen decisions 1–8, merge PRs, promote Live, run debugging loops.

## Success check

One commit on branch `chatgpt-web/kfb-hybrid-production-handoff-2026-09-23` adding `CURRENT_STATE_2026-09-24_WSA.md` + `WSA_RETURN_2026-09-24.md` covering A–E, with exact heads.

## Stop condition

First unexpected failure or missing access: record it, stop, return. If none of A–E needs Work capabilities after all, return `WSA NOT NEEDED` with the reason.

## Start prompt for the WSA/Work chat

```
@GitHub Read georg-doc/kayfabizarro branch chatgpt-web/kfb-hybrid-production-handoff-2026-09-23: skills/chat/workflows/KFB_HYBRID_PRODUCTION_HANDOFF_2026-09-23/WSA_CONSOLIDATION_ROUND_01_2026-09-24.md, then COWORKER_WSA_SYNC_BRIDGE.md. Refresh every repo/PR head including the private KFB-Travel-Globe and KFB-Stunt-Car-Race. Execute only items A–E, respect decisions 1–8, commit the two return files to that branch, and stop.
```
