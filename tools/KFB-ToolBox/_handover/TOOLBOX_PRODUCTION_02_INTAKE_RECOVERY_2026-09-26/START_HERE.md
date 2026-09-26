# ToolBox Production-02 · Intake Recovery · 2026-09-26

Status: **RECOVERY CHECKPOINT · SOURCE SAFE · NOT INTEGRATED · HUMAN GATE OPEN**
Owner: **KFB ToolBox receiving owner remains Draft PR #185 / `chatgpt-web/toolbox-source-lock-2026-09-23`**
Recovery branch: `chatgpt-web/toolbox-production-02-intake-recovery-2026-09-26`
Stage route: **NONE · NOT PUBLISHED · NOT PUBLIC_VERIFIED**

## Exact source package

GitHub main inbox:
`tools/KFB-ToolBox/_inbox/KFB ToolBox Production-01-2/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-26_r1/`

Dropbox backup:
`/CLAUDE/KFB ToolBox Production-01-2/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-26_r1/`

Dropbox ZIP:
`/CLAUDE/KFB ToolBox Production-01-2.zip` · 436462 bytes.

At intake verification, GitHub and Dropbox match exactly by **name + object type + file size** for:
- top level: 19/19;
- `kfb-lib`: 7/7;
- `evidence`: 6/6;
- `docs`: 2/2;
- `blender`: 1/1.

## What the export claims

Entry:
`KFB ToolBox Production-02.dc.html`

Claude Design reports:
- free orbit camera;
- text-to-13-mouth-decal lip-sync;
- expression rest-mouth authoring;
- wider painted-part ranges;
- EyeRig lid shells + clay-volume lids using the PR #159 donor;
- three FrizzleBob hair tufts;
- Blender face-parts brief v2;
- built-in preview self-test **27/27 PASS**.

These are **intake claims**, not receiving-owner acceptance.

## Receiving-owner check

At PR #185 head `10a83a63acd76d29f6867d15640f7861efc57b00`, the proposed Production-02 files were not present:
- `tools/KFB-ToolBox/kfb-lib/face-mount.v1.js`
- `tools/KFB-ToolBox/kfb-lib/hair-tufts.v1.js`
- `tools/KFB-ToolBox/kfb-lib/lipsync-text.v1.js`
- `tools/KFB-ToolBox/kfb-lib/clay-lids.v1.js`
- `tools/KFB-ToolBox/stage-first/src/KFB ToolBox Production-02.dc.html`

Therefore this checkpoint **does not integrate, duplicate or promote** those modules.

## Open evidence gates

Not yet receiving-owner-proved:
- clean unpacked HTTP run;
- repository-native `zipcheck.py`;
- owner-branch integration/regression;
- direct KFB Stage publication;
- Georg visual acceptance.

Claude's own human gate is `FACE-VIS-01`: inspect clay lids open / half / closed / skeptical / side plus hair tufts and decide whether the lids read as two rounded clay halves rather than a visor.

## Next gate

**INTAKE REVIEW ONLY:** keep this package frozen and recoverable. After Georg's visual direction, a fresh receiving-owner slice may selectively rehome the accepted modules into PR #185, rerun owner regressions, and only then prepare a direct `kayfabizarro.pages.dev` Stage review.

Do not merge this recovery checkpoint as a runtime promotion and do not publish a Production-02 human-test route from the inbox package.
