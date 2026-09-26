# TEST REPORT · ToolBox Production-02 Intake Recovery · 2026-09-26

Status: **RECOVERY EVIDENCE ONLY · NO RUNTIME INTEGRATION**

## Checks performed in this recovery slice

1. GitHub `main` source package exists at the exact inbox path.
2. Dropbox source folder exists at the exact matching project path.
3. Dropbox ZIP exists: `/CLAUDE/KFB ToolBox Production-01-2.zip` · 436462 bytes.
4. GitHub ↔ Dropbox structural parity by **name + object type + file size**:
   - top level: **19/19 MATCH**;
   - `kfb-lib`: **7/7 MATCH**;
   - `evidence`: **6/6 MATCH**;
   - `docs`: **2/2 MATCH**;
   - `blender`: **1/1 MATCH**.
5. PR #185 receiving-owner check at `10a83a63acd76d29f6867d15640f7861efc57b00`: proposed Production-02 entry and four new owner modules are **ABSENT**, so no duplicate/partial owner integration was found.

## Evidence imported from the Claude Design cut

The cut's own `TEST_REPORT.md` reports built-in Chromium preview self-test:

**27/27 PASS**

New reported tests:
- #25 lip-sync text → 13 decals;
- #26 hair tufts with / middle / bald on head bone;
- #27 PR #159 clay-volume lids on EyeRig.

Visual evidence files present:
- `01-clay-lids-open.png`
- `02-clay-lids-skeptic-asym.png`
- `03-clay-lids-closed.png`
- `04-clay-lids-side.png`
- `05-hair-tufts.png`
- `06-selftest-27-27.png`

## Not run here

- Claude Design's built-in 27-step self-test was **not rerun** by this recovery slice.
- `zipcheck.py`: **NOT RUN**.
- Clean unpacked HTTP run: **NOT RUN**.
- PR #185 owner integration/regression: **NOT RUN**.
- Cloudflare Stage browser proof: **NOT RUN / NO ROUTE**.
- Georg human visual acceptance: **NOT RUN**.

## Result

**SOURCE CHECKPOINT PASS.**

This proves recoverability and dual-location source parity only. It does not promote Production-02 into the receiving ToolBox owner and does not convert Claude preview evidence into owner/runtime or human acceptance.
