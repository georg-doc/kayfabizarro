# S14 Blender Review Gate · Failure Recovery

Status: **FROZEN GATE · SALVAGEABLE ROOM BUILD**

This recovery package freezes only the automated Blender review-render gate. It does **not** reject
the S14 browser room blueprint.

## Source

- repo: `georg-doc/kayfabizarro`
- branch: `world-atlas/dungeon-room-blueprint-s14-blender-2026-09-20`
- tested implementation head: `da04e03378f79ca973a3768e0c934bc5372b1aa5`
- Draft PR: #126
- room: `R02 · Schatz- und Esskammer`
- source owner: `tools/world_atlas/`

## What is preserved

- browser/editor candidate: 15/15 Chromium PASS;
- exact browser-exported Blender manifest;
- valid Blender 4.00 `KFB_R02.blend`, 4,115,904 bytes;
- full workflow/log IDs and checksums;
- the Blender importer/compiler and macOS one-click runner remain on the branch.

## Why stopped

After the room imported and the .blend was saved, Ubuntu headless Blender aborted because
`libEGL.so.1` was unavailable. This is the second failed Blender review-gate repair pass in this
slice. Per KFB recovery policy, no third repair is attempted.

Read `POSTMORTEM.md`, `ATTEMPT_LOG.md`, `SALVAGE_MAP.md`, `NEXT_GATE.md`,
`TEST_REPORT.md`, then `EXPORT_MANIFEST.json`.
