# START HERE · fresh chat · KFB Cologne World (after WB-DESIGN-PARALLEL-01)

1. Read: `github.md` (last sync), `returns/WB-DESIGN-PARALLEL-01_2026-09-24/HANDOVER_WSA.md`, `BACKLOG_SPRINTS.md`.
2. Open `KFB WB-D1 · Cologne World Shell.dc.html`: 03 SHELL → details ≡ (seam, water, landmarks, socket, sources, log).
3. Start with **Sprint 1 · WB-D2 · Hürth**, step S1.1 (freeze the crop, show 01 FIXTURE in isolation).
4. Keep to these rules:
   - no new OSM fetch;
   - no second presenter or runtime;
   - donors IMPORTED_AND_CALLED, never rewritten;
   - every host setting is named;
   - measure the thing that is actually in question (see the Card Zone post-mortems).
5. Controls: ink off by default. Water and landmark settings are in the app, not in chat tweaks.

Code map:
- `wd1-boot.js`: host, UI, views, editor, socket
- `wd1-seam.js`: zone source → presentation form
- `wd1-city.js`: ground map, Elastic Clay, details
- `wd1-landmark.js`: Dom/Hbf, colour, clay, fit, validation
- `wd1-water.js`: water presets
- `w0-region.js` / `w0-ink.js`: WB-W0, shared, unchanged
