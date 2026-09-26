# TEST REPORT · CLAY-RECON-2026-09-26-r1

- Static checks: **6/6 PASS** — four unique Hub clay identifiers, three briefing entries, Stage revision marker, actual PNG dimensions, seven Stage anchors, parseable HTML.
- Legacy main Hub inline JavaScript: `node --check` **1/1 PASS** for the updated source copy. It is not the Cloudflare-live v2 shell.
- Direct public HTTP: **2/2 HTTP 200** — `/kfb-hub/` and `/kfb-hub/stage/toolbox/clay-production/` after publication commit `3793f099469ef1923a71672c3bca4d919eee679a` on `cloudflare-live`. Exact Stage marker and Hub link both present in returned HTML.
- Browser: **2/2 visible route checks PASS** — cloud browser opened the exact Stage and Hub. Stage DOM showed `CLAY-RECON-2026-09-26-r1`, Asset 01, Asset 03, MVP sequence and three briefing links. The isolated source poster image reported `complete=true`, `naturalWidth=1254`. Hub DOM showed the visible `Claymation · Briefings` link to that route.
- Source image: actual **1254×1254 8-bit RGB PNG** inspected; poster as a seamless production texture **FAIL**, with no false 4096 or 3×3 certification. PR #228's later r1 binary was not opened in this slice.
- Not run: Blender, runtime/GLB, ToolBox/WorldBuilder/Race integration, edge pixel QA on the later r1, visual acceptance of Asset 03, mobile browser QA, four PDF content audits.

Public Stage proves **briefing publication only**, not the clay material in a game. Georg's material look/gameplay review remains open.
