# CHANGELOG · KFB ToolBox Cloudflare Consolidation

## 2026-09-20 · ToolBox Home v1 router candidate

- created bounded branch `toolbox/toolbox-home-v1-2026-09-20` from the reviewed KayKit Bits Bundle 1 intake branch;
- added static ToolBox Home at `kfb-hub/stage/toolbox/`;
- added machine-readable `toolbox-status.v1.json`;
- routed current Asset Librarian, Resident Atlas, World Atlas, Dungeon S13.2, Hex Realm, Motion Lab, EyeRig and 2D Animation Studio;
- represented 3D editor, Tiny Treats rooms/groups and Plant Lab as explicit integration gates;
- represented Vehicle Lab, FrankenStein Studio, Rigging Lab and Animation Lab as source-only rather than inventing public routes;
- used real public pages as previews only where a current Cloudflare route is documented;
- added prominent ToolBox links to KFB Hub header and never-empty fallback;
- static contract test: **32/32 PASS**;
- public browser/deployment: **PENDING**;
- no Dropbox mutation, no asset copies, no second Registry, no second Dungeon owner, no Live promotion.


## 2026-09-20 · Stage publication bridge

- copied only `kfb-hub/stage/toolbox/index.html` and `toolbox-status.v1.json` to `cloudflare-live`;
- patched the current publication Hub in place rather than overwriting it from the feature branch;
- publication branch head after Hub patch: `d683a3febe5f583d6fc5036943efd8c7368bdc99`;
- GitHub fetch-back confirms page marker, status marker and both Hub links;
- public Cloudflare HTTP/browser proof remains **UNKNOWN** because the available web reader/DNS path could not access the host; no Live claim.
