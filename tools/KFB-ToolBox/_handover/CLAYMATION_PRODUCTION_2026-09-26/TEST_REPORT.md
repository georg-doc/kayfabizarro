# TEST REPORT · CLAY-RECON-2026-09-26-r1

- Static checks: **6/6 PASS** — four unique Hub clay identifiers, three briefing entries, Stage revision marker, actual PNG dimensions, seven Stage anchors, parseable HTML.
- Legacy main Hub inline JavaScript: `node --check` **1/1 PASS** for the updated source copy. It is not the Cloudflare-live v2 shell.
- Direct public HTTP: **2/2 HTTP 200** — `/kfb-hub/` and `/kfb-hub/stage/toolbox/clay-production/` after publication commit `3793f099469ef1923a71672c3bca4d919eee679a` on `cloudflare-live`. Exact Stage marker and Hub link both present in returned HTML.
- Browser: **2/2 visible route checks PASS** — cloud browser opened the exact Stage and Hub. Stage DOM showed `CLAY-RECON-2026-09-26-r1`, Asset 01, Asset 03, MVP sequence and three briefing links. The isolated source poster image reported `complete=true`, `naturalWidth=1254`. Hub DOM showed the visible `Claymation · Briefings` link to that route.
- Source image: actual **1254×1254 8-bit RGB PNG** inspected; poster as a seamless production texture **FAIL**, with no false 4096 or 3×3 certification. PR #228's later r1 binary was not opened in this slice.
- Not run: Blender, runtime/GLB, ToolBox/WorldBuilder/Race integration, edge pixel QA on the later r1, visual acceptance of Asset 03, mobile browser QA, four PDF content audits.

Public Stage proves **briefing publication only**, not the clay material in a game. Georg's material look/gameplay review remains open.

- New Gemini source QA: 2048×2048 RGB JPEG pinned to main `4daf059`, SHA-256 `05ae7c6fc97ce7b4094288ca01dca626f32e88d3e182f521f3db6f0b86041d33`; opposite-edge RGB MAE x **5.538**, y **5.534** /255 versus immediate inside neighbors x **4.304**, y **3.911**. Visual 3×3 shows joins and dominant motif repetition: **raw seamless FAIL**. See `GEMINI_IMAGE_SEAM_QA_2026-09-26.md`. Blender sphere/plane and human Web Chat approval pending.

- Public revision r2: `cloudflare-live` commit `cb7745607074e269a2070c8c5008519057d25560`; browser opened exact `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/clay-production/` and saw `CLAY-RECON-2026-09-26-r2`, Gemini status and QA/Web Chat links. Both displayed source images loaded (`naturalWidth` 1254 and 2048). This verifies briefing publication, not a seamless material or Blender integration.
