# CHANGELOG · additive, newest first

## 2026-09-28 · SESSION CUT r2 (/session-zip)
- Georg: ANIMATION-LIBRARY-V1 = PASS, UI/UX tune later.
- Cut packaged from the workspace as-is. No code changes for the export.

## 2026-09-28 · ANIMATION-LIBRARY-V1 · ToolBox Production-05

### DECISION
The Library is a fourth tab in the existing ToolBox shell, not a new tool. It reuses the actor picker, the stage, the mixer and the shadow path. The Motion Library v3 manifest is read live from PR #275 @4fa08271 and never copied.

### IMPLEMENTATION
- `KFB ToolBox Production-05.dc.html` is a copy of P04. Added the Library tab, the `ml3` clip source (per-clip `library` path), and the `local` clip source for the Drop Zone. The self-test runner is extended with a Library block.
- `kfb-lib/anim-library.v1.js` (new) covers patch normalise/export/fingerprint, gates (seat, pair, release, loop interpretation), search, facets, intake receipt and Fit & Motion.
- `kfb-lib/librarian-motion-projection.v1.js` (new) is the Asset Librarian row adapter and parses the deep links.
- Own workspace key `kfb-toolbox-production-05`, filled once from P04's key.
- Helmet: an extra, isolated module script for FBXLoader, so a failed load can't break the three.js boot.

### TESTED RESULT
Library self-test 24/24 on real sources. The FBX parse path is not exercised. See TEST_REPORT.

### NOT CHANGED
The P04 tabs, their pins and their tests. The Animation Studio tab still reads Motion Library 01 @032c9d50 (33 clips + AN-PROFILE-01).
