# Promotion · KFB ToolBox Stage-First → owner repo · 2026-09-24

Status: **SOURCE PROMOTED · NOT YET BROWSER-TESTED IN THIS LOCATION · NO GEORG GATE**

Executor: Claude Coworker (Opus 5.5), approved by Georg in the Coworker chat (24.09.2026).
Uploaded through the GitHub web UI (Coworker's own GitHub integration is read-only).

## What this is

`tools/KFB-ToolBox/stage-first/` is now the single owner location of the Stage-First ToolBox
(STAGE_FIRST_V1_INTAKE_2026-09-18 §5 "Promotion target"; Sprint 01 Slice B).

Source: Georg's Dropbox `/CLAUDE/KFB ToolBox v0.5/KFB-ToolBox/stage-first/` — the current state
(17.09 export + 18.09 Sprint-01 Slice-A URL pinning, 4 files; see `TB05_DELTA_01.md`).
Per-file bytes + sha256 of `src/`: `SOURCE_MANIFEST_2026-09-24.json` (90 files before exclusions).

## Provenance copies (not owners any more)

- `tools/KFB-ToolBox/_inbox/KFB ToolBox v1-1.zip` (package provenance, unchanged)
- `georg-doc/KFB-Stunt-Car-Race/_inbox/KFB ToolBox v1/…/KFB_ToolBox_Stage-First_v1/` = 17.09 read mirror,
  older than this promotion → mark as outdated / remove later (Georg's decision).

## Deliberately excluded

- `src/_ds/doccheck-group-design-system-…` (DocCheck design-system bundle; used only by `KFB Rigging Lab v1.dc.html`,
  not by the Stage-First entry). Rigging Lab v1 styling may degrade in this copy; the file itself is unchanged.
- `qa/evidence/` screenshots (historical evidence, kept in Dropbox/v0.5 zip).

## Not changed

No source file was edited. `window.__KFB_MODBASE`, folder layout, three@0.160.0, localStorage keys, 35-entry roster: as exported.

## Next (internal, Coworker)

1. Zero-install review wrapper: sheet + `__KFB_MODBASE` → jsDelivr pinned to this promotion commit.
2. Boot test in Georg's Chrome, record console/resource errors.
3. Continue TOOLBOX_SOURCE_SAFE_INTEGRATION_01 (Concept shell alignment, Driver Graft default, Messen/R2 editor,
   Stage ▾ Resident presets, scene-patch Save/Reload) on top of this owner tree.
