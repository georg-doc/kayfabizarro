# KFB StoryMap v1 (SMA1) — handover export for WSA lead

Status: **OPEN bug, not closed.** The 2026-09-22 water-shader session ends with the
integration verified source-correct but visibility unresolved and unverified live.
Do not read this as a green light.

## What this is

A Three.js Europe puzzle-piece board (`KFB StoryMap v1.dc.html` + `sma1-map-animator.js`),
forked from `tools/kfb-cartoon-map-board/src/app.js`, animated with flat/table/flyover/
pop-up camera presets, ink outlines, graph-colored country tones, an optional voxel view,
KayKit board-game-bit figures, and a fluid-shader sea.

## Read order for a fresh agent / WSA lead

1. This file.
2. `POSTMORTEM-2026-09-22.md` — what broke this session, what's proven, what's still open.
3. `SPRINTPLAN.md` — the next-session TODOs, priority-ordered.
4. `CHANGELOG.md` — additive history across all sessions.
5. `HOUSEKEEPING.md` — per-file status (AKTIV/FROZEN/SUPERSEDED/DEAD/ASSET).
6. `docs/SMA1-GATE.md` — the full donor-pin ledger, Q&A, and design decisions. This is the
   canonical gate document; everything above is a summary layer on top of it.

## Files in this export

- `KFB StoryMap v1.dc.html` — the DC entrypoint (UI + boot).
- `KFB StoryMap v1.standalone.html` — self-contained single-file bundle of the same page
  (local assets inlined; the remote donor assets — three.js CDN, OpenPlanetData GeoJSON,
  KayKit glTF, KFB water textures — still load over the network at runtime, same as the DC).
- `sma1-map-animator.js` — the runtime: map build, graph coloring, ink outlines, voxel
  view, fluid-shader integration, camera/action API.
- `kfb-fluid-v2/card-zone-v2-fluid-source.js` — the source-locked real Card Zone Lab v2
  fluid donor (see POSTMORTEM for why this replaced `kfb-fluid-v1`).
- `kfb-voxel-world-v1/` — donor reference for the D6 height step + edge texture used by
  the voxel view (procedural voxel field itself was NOT reused — see `docs/SMA1-GATE.md`).
- `support.js` — DC runtime. Never edit; ships as-is so this export runs unmodified.
- `docs/SMA1-GATE.md`, `github.md` — full project history and sync ledger.

## Open bug, first thing to do

**"Wasser" (water) toggle shows no visible shader effect in live usage — reported twice by
Georg.** The integration is programmatically verified correct (mesh/material/uniform/texture
parity against the real Card Zone Lab v2 donor blob, confirmed live GPU draw calls) but the
*visual* result could not be confirmed or denied in this session's tooling because the
preview environment throttles/freezes the render loop almost completely once the tab isn't
the foregrounded one. **Start the next session with a real, focused, human-driven browser
tab check** — see `POSTMORTEM-2026-09-22.md` §3 and `SPRINTPLAN.md` item 1.
