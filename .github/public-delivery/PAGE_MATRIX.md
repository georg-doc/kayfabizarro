# Page → current result · V-599 · 2026-10-22

**No production PASS and no permission to switch visibility.** PASS_LOCAL means the candidate copy passed only the stated browser scope with Raw, all jsDelivr, github.io, API and githack excluded by CSP. The local origin substituted the existing Cloudflare origin. Source scan status alone is not runtime proof.

Test source checkpoint: `7db84628fe2b5c345c4af6239e1f8599c2e111aa`; the 29 source blob identities are in `TEST_REPORT.json`. No new live revision was deployed.

## Observed local browser cases

| Candidate route | Result | Observed scope |
| --- | --- | --- |
| `/` | PASS_LOCAL_BLOCKED_HOSTS | Existing rules/home content visible |
| `/FrizzleBob/` | PASS_LOCAL_BLOCKED_HOSTS | Essay and reader selection, avatar image loaded; a temporary test-copy Markdown version marker was visibly reread, then restored |
| `/FrizzleBob/LERNEN_MIT_MASCHINE.html` | PASS_LOCAL_BLOCKED_HOSTS | Das Werkzeug ist gemietet text visible |
| `/media/kfb/` | PASS_LOCAL_BLOCKED_HOSTS | 130 comics / 1914 pages / 6985 cards and actual PDF artwork visible |
| `/KFB Comic Card Deck Viewer v4 (WS0)/KFB Deck Viewer v3.dc.html` | PASS_LOCAL_BLOCKED_HOSTS | 130 comics / 6985 cards |
| `/KFB Comic Card Deck Viewer v4 (WS0)/KFB Deck Viewer v4.dc.html` | PASS_LOCAL_BLOCKED_HOSTS | 130 comics / 6985 cards |
| `/KFB Comic Card Deck Viewer v4 (WS0)/KFB Deck Viewer v5.dc.html?deck=frizzlebob_s_mission_control&card=56` | PASS_LOCAL_BLOCKED_HOSTS | Mission Control, card 56, page 15/15; 130 comics / 1915 pages / 6985 cards |
| `/KFB Comic Card Deck Viewer v4 (WS0)/exports/KFB Deck Viewer v4 standalone.html` | PASS_LOCAL_BLOCKED_HOSTS | 130 comics / 6985 cards |


## Full generated HTML inventory

192 HTML entry files from this generated projection, including historical/standalone entries. This is a conservative file inventory; reconcile its public links with the current Hub before declaring scope complete. A PASS_LOCAL here applies only to the scope above. All other entries remain NOT_ACCEPTED.

| Page path on existing Cloudflare origin | Local proof | Direct entry source scan |
| --- | --- | --- |
| `/asset-librarian/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/FrizzleBob/index.html` | PASS_LOCAL (scope above) | NO_BLOCKED_HOST_IN_ENTRY |
| `/FrizzleBob/LERNEN_MIT_MASCHINE.html` | PASS_LOCAL (scope above) | NO_BLOCKED_HOST_IN_ENTRY |
| `/FrizzleBob/The Marvelous Miss Messy - Live Exhibition.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/index.html` | PASS_LOCAL (scope above) | NO_BLOCKED_HOST_IN_ENTRY |
| `/kayfabizarro_browser.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/KFB Boxel Blitz/audio-feedback-poc/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/KFB Boxel Blitz/KFB Boxel Blitz v4.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/KFB Combat Arena/KFB Combat Arena v2.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/KFB Comic Card Deck Viewer v4 (WS0)/exports/KFB Deck Viewer v4 standalone.html` | PASS_LOCAL (scope above) | NO_BLOCKED_HOST_IN_ENTRY |
| `/KFB Comic Card Deck Viewer v4 (WS0)/KFB Deck Viewer v3.dc.html` | PASS_LOCAL (scope above) | NO_BLOCKED_HOST_IN_ENTRY |
| `/KFB Comic Card Deck Viewer v4 (WS0)/KFB Deck Viewer v4 -standalone src-.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/KFB Comic Card Deck Viewer v4 (WS0)/KFB Deck Viewer v4.dc.html` | PASS_LOCAL (scope above) | NO_BLOCKED_HOST_IN_ENTRY |
| `/KFB Comic Card Deck Viewer v4 (WS0)/KFB Deck Viewer v5.dc.html` | PASS_LOCAL (scope above) | NO_BLOCKED_HOST_IN_ENTRY |
| `/KFB Comic Card Deck Viewer v4 (WS0)/KFB Deck Viewer.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/KFB Comic Card Deck Viewer v4 (WS0)/KFB Gameplay Stage.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/KFB Comic Card Deck Viewer v4 (WS0)/KFB Living Illustration Lab.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/2d-animation-studio.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/archiv/tools-r1/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/doc-animation.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/free-roam/cities/ehrenfeld/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/free-roam/cities/huerth/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/free-roam/game-dev-studio/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/free-roam/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/free-roam/versions/fr-s04-01/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/free-roam/versions/fr-s04-02/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/sim-blood-3d-rbc/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/sim-blood-3d-rbc/selfcheck.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/sim-blood-cell-atlas/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/sim-blood-flexikon-embed/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/sim-blood-hub/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/sim-blood-management.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/sim-blood-management/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/sim-blood-medical-review/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/sim-blood-poc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/sim-blood-poc/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/sim-blood-wbc-review/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/sim-blood.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/stage/audio-calibration/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/stage/boxel-audio-feedback-poc/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/stage/combat/ca2-sword-01/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stage/game-dev-studio/kcl-m1-locomotion-sync/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/stage/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/stage/maplibre-world-owner-spike-01/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stage/stunt-world/hud-2d-v1/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stage/stunt-world/hud-game-v3/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stage/stunt-world/hud-racer-v2/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stage/stunt-world/hud-rig-v1/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stage/stunt-world/hud-rig-v2/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stage/stunt-world/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/stage/stunt-world/runtime/ChatGPT_web/osm-city-drive/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stage/stunt-world/te01-osm-depth-ink/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/stage/stunt-world/te01-osm-depth-ink/runtime/ChatGPT_web/osm-city-drive/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stage/stunt-world/tinyskies-terrain-donor/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stage/stunt-world/tinyskies-track-corridor-tc01/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stage/stunt-world/track-ribbon-st01/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stage/toolbox/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/stage/toolbox/kaykit-character-compat-v0/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stage/toolbox/kaykit-motion-lab-v1/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stage/vehicle-deformer-v2/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/stunt-race.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/kfb-hub/stunt-race/track-environment-lab/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stunt-race/track-lab-gate/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stunt-race/track-lab-v062/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stunt-race/track-lab-v07/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stunt-race/track-lab-v08/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stunt-race/track-lab-v09/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stunt-race/track-lab/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/stunt-race/v010-topology/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/kfb-hub/travel-world.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/media/kfb/index.html` | PASS_LOCAL (scope above) | NO_BLOCKED_HOST_IN_ENTRY |
| `/Nexus Castle/nexus-castle-v5/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/Nexus Castle/nexus-castle-v5/Nexus Castle v5 - standalone.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/Nexus Castle/nexus-castle-v5/quellcode/Nexus Castle v4.dc.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/Nexus Castle/nexus-castle-v5/quellcode/Nexus Castle v5.dc.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/Nexus Castle/nexus-castle-v5/quellcode/Nexus Village v3.dc.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/overworld/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/overworld/KFB Overworld Masterplan.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/overworld/KFB Overworld v10.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/overworld/KFB Pet Studio v4.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/overworld/KFB Pottymouth Key.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/overworld/overworld-v12_2026-08-12/KFB Overworld v12.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/overworld/overworld-v13_2026-08-12/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/overworld/overworld-v13_2026-08-12/KFB Blasen-Formen v1.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/overworld/overworld-v13_2026-08-12/KFB Bubble-Fixtures v1.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/overworld/overworld-v13_2026-08-12/KFB Overworld v13.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/overworld/overworld-v13_2026-08-12/KFB Terrain-Probe v1.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/overworld/overworld-v13_2026-08-12/standalone/KFB Blasen-Formen v1 (standalone).html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/overworld/overworld-v13_2026-08-12/standalone/KFB Bubble-Fixtures v1 (standalone).html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/overworld/overworld-v13_2026-08-12/standalone/KFB Overworld v13 (standalone).html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/overworld/overworld-v13_2026-08-12/standalone/KFB Terrain-Probe v1 (standalone).html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/overworld/overworld-v14_2026-08-13/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/overworld/overworld-v14_2026-08-13/KFB-Overworld-v14-standalone.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/resident-atlas-s6/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/resident-atlas/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/2D Animation Studio/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/2D Animation Studio/labs/eumel-rig-lab/site/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/2D Animation Studio/labs/eumel-rig-lab/source-assets/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/2D Animation Studio/proofs/cross-render-eye-v1/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/tools/2D Animation Studio/proofs/eumel-three2p5d-v1/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/tools/2D Animation Studio/shared/eye-rig/modifier-atlas/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/asset_registry/librarian/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/tools/game-dev-studio/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/img2threejs/archive/2026-09-18/koelner_dom_lowpoly_threejs.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/img2threejs/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/img2threejs/landmarks/pilot-01/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/img2threejs/landmarks/pilot-02/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/img2threejs/landmarks/pilot-03/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/img2threejs/landmarks/pilot-04/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/img2threejs/landmarks/pilot-05/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/img2threejs/landmarks/pilot-06/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/img2threejs/prototypes/koelner-dom/v0.1/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/img2threejs/prototypes/koelner-dom/v0.2/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/kfb-cartoon-map-board/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/kfb-graveyard/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/KFB-ToolBox/KFB ToolBox (studio v17 - rigging v1 - animation v2)/WSA_2026-09-13/KFB Animation Lab v2 -standalone-.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/KFB-ToolBox/KFB ToolBox (studio v17 - rigging v1 - animation v2)/WSA_2026-09-13/KFB FrankenStein Studio v17 -standalone-.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/tools/KFB-ToolBox/KFB ToolBox (studio v17 - rigging v1 - animation v2)/WSA_2026-09-13/KFB Rigging Lab v1 -standalone-.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/osm-city-lab/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/KayKit_City_Sample_S4.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/KayKit_Dungeon_Room_S1.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/Kenney_City_Block_S2.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/Kenney_Racing_Track_S3.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/KFB_Resident_Atlas_S5.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/KFB_Resident_Atlas_S6.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/tools/animatronic-grip-probe.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/tools/animatronic-scale-probe.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/tools/guitar-actionfigure-probe.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/tools/guitar-anatomy-probe.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/tools/guitar-construct-probe.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/tools/guitar-grid-probe.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/tools/guitar-place-reach-probe.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/tools/guitar-pose-probe2.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/tools/guitar-qa.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/tools/legacy-rig-probe.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas_s6/tools/measure.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/tools/resident_atlas_s6/tools/orc-monstrosity-probe.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/resident_atlas/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/tools/world_atlas/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/KayKit_Cards_Hourglass_S10.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/tools/world_atlas/source/KayKit_Chess_Immortal_S8.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/KayKit_City_Sample_S4.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/KayKit_Domino_Run_S9.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/KayKit_Dungeon_Generator_S13_2.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/KayKit_Dungeon_Model_S13.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/KayKit_Dungeon_Room_S1.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/KayKit_Forest_Clearing_S6.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/KayKit_Hex_Realm_S11.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/KayKit_Hex_Tile_Model_S12.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/KayKit_Road_Network_S5.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/KayKit_Tools_Workshop_S7.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/Kenney_City_Block_S2.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/Kenney_Racing_Setup_S3b.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/Kenney_Racing_Track_S3.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/tools/measure-hex.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/tools/measure-racing.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/tools/measure.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/tools/probe-dungeon-parts.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/tools/probe-hex.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/tools/probe-racing.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/tools/registry-probe.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/tools/world_atlas/source/tools/scan-hex-coast.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/tools/scan-hex-edges.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/tools/scan-hex-render.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/tools/world_atlas/source/tools/truth-hex-axes.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/travel/3D Conspiracy Iceberg Explorer/Conspiracy Iceberg Explorer.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/travel/3D Conspiracy Iceberg Explorer/Conspiracy Iceberg Explorer.standalone.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/travel/3D Conspiracy Iceberg Explorer/Schema v2 Reader.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/travel/3D Conspiracy Iceberg Explorer/templates/KayfabPaperDoc.template.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/travel/KFB Travel Combat v25/KFB Travel Combat v25.dc.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/travel/KFB Travel Globe v13-1/KFB Travel Globe v13.dc.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/travel/travel-v16/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/travel/travel-v16/KFB Travel Testliste.dc.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/travel/travel-v16/KFB Travel v16.dc.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/travel/wip/travel_globe_wsa/build/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/travel/wip/travel_globe_wsa/docs/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/travel/wip/travel_globe_wsa/docs/web-start.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/travel/wip/travel_globe_wsa/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/travel/wip/travel_globe_wsa/KFB Travel Globe v13.dc.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/travel/wip/travel_globe_wsa/QA/browser.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/travel/wip/travel_globe_wsa/QA/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/travel/wip/travel_globe_wsa/town/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/travel/wip/travel_globe_wsa/world-builder/index.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/travel/wip/travel_globe_wsa/world/composer.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/travel/wip/travel_globe_wsa/world/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/travel/wip/travel_globe_wsa/world/prefab-lab.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/travel/wip/travel_globe_wsa/world/route-lab.html` | NOT_ACCEPTED / NOT_RUN | BLOCKED_HOST_PRESENT |
| `/travel/wip/travel_globe_wsa/world/seed-lab.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |
| `/world-atlas/index.html` | NOT_ACCEPTED / NOT_RUN | NO_BLOCKED_HOST_IN_ENTRY |


## Data checks in the fresh browser copy

The 283/283 summary comprises the following 278 data checks and five denied-host controls. PDF PASS below means HTTP HEAD success with PDF content type; the local signature check also passed. It does not mean every PDF page was rendered. JSON PASS means fetched and parsed. Only the first rendered PDF and the listed deck interactions received visual/UI checks.

| Reading path | Result |
| --- | --- |
| `/FrizzleBob/01-first-reading.md` | PASS_LOCAL_GET |
| `/FrizzleBob/02-the-eye.md` | PASS_LOCAL_GET |
| `/FrizzleBob/03-collegial-critique.md` | PASS_LOCAL_GET |
| `/FrizzleBob/04-finger-in-the-wound.md` | PASS_LOCAL_GET |
| `/FrizzleBob/05-yourself-in-five-years.md` | PASS_LOCAL_GET |
| `/FrizzleBob/06-publisher-pitch.md` | PASS_LOCAL_GET |
| `/FrizzleBob/07-le-curateur.md` | PASS_LOCAL_GET |
| `/FrizzleBob/08-the-comics-theorist.md` | PASS_LOCAL_GET |
| `/FrizzleBob/09-the-literalist.md` | PASS_LOCAL_GET |
| `/FrizzleBob/10-the-synaesthete.md` | PASS_LOCAL_GET |
| `/FrizzleBob/11-the-doomscroller.md` | PASS_LOCAL_GET |
| `/FrizzleBob/12-the-superfan.md` | PASS_LOCAL_GET |
| `/FrizzleBob/13-the-heckler.md` | PASS_LOCAL_GET |
| `/FrizzleBob/14-frizzlebob-carny.md` | PASS_LOCAL_GET |
| `/FrizzleBob/15-the-page-speaks-back.md` | PASS_LOCAL_GET |
| `/FrizzleBob/16-archaeologist-2525.md` | PASS_LOCAL_GET |
| `/FrizzleBob/17-the-dialogue-doctor.md` | PASS_LOCAL_GET |
| `/FrizzleBob/18-the-concept-reader.md` | PASS_LOCAL_GET |


| Registry deck | PDF HEAD | JSON fetch/parse |
| --- | --- | --- |
| Uncle FrizzleBob's 1001 Kayfabe Nights | PASS_LOCAL `1001_Kayfabe_Nights - ADD web ID.pdf` | PASS_LOCAL `1001_Kayfabe_Nights_-_ADD_web_ID.pdf.json` |
| Roko's Basilisk & The AI Kayfabe Takeover | PASS_LOCAL `AI_Kayfabe - ADD web ID.pdf` | PASS_LOCAL `AI_Kayfabe_-_ADD_web.pdf.json` |
| Unseal the Academic Anarchy — Academic Alphas vs Brain Benders | PASS_LOCAL `Academic_Anarchy - INTELLECTUAL ADD web ID.pdf` | PASS_LOCAL `Academic_Anarchy_-_INTELLECTUAL_ADD_web_ID.pdf.json` |
| The Anti-Rules Manifesto | PASS_LOCAL `Anti-Rules_Toolkit - ADD web ID.pdf` | PASS_LOCAL `Anti-Rules_Toolkit_-_ADD_web.pdf.json` |
| Big Bad Brain Wrestling | PASS_LOCAL `Big_Bad_Brain_Wrestling - ADD web.pdf` | PASS_LOCAL `Big_Bad_Brain_Wrestling_-_ADD_web.pdf.json` |
| The Brain-Flipper Pack | PASS_LOCAL `Brain_Flipper IMAGE SPOTS - ADD web ID.pdf` | PASS_LOCAL `Brain_Flipper_IMAGE_SPOTS_-_ADD_web.pdf.json` |
| Cinematic Legacy & Motion Picture Kayfabe | PASS_LOCAL `Cinematic_Kayfabizarro_(2) - ADD web.pdf` | PASS_LOCAL `Cinematic_Kayfabizarro__2__-_ADD_web.pdf.json` |
| Cosmic Grift – Dark Journalism | PASS_LOCAL `Cosmic_Grift_-_Dark_Journalism - ADD web ID.pdf` | PASS_LOCAL `Cosmic_Grift_-_Dark_Journalism_-_ADD_web_ID.pdf.json` |
| Forget Utopia | PASS_LOCAL `Deck_A_UTOPIA_-_Forget_Utopia web H.pdf` | PASS_LOCAL `Deck_A_UTOPIA_-_Forget_Utopia_web_H.pdf.json` |
| IGNORE DYSTOPIA — Anatomy of a Trap (Deck B) | PASS_LOCAL `Deck_B_DYSTOPIA_-_ANATOMY_OF_A_TRAP web H.pdf` | PASS_LOCAL `Deck_B_DYSTOPIA_-_ANATOMY_OF_A_TRAP_web_H.pdf.json` |
| Protopia Sketchbook — Deck C: EMBRACE | PASS_LOCAL `Deck_C_PROTOPIA_-_Protopia_Sketchbook_(1) web H.pdf` | PASS_LOCAL `Deck_C_PROTOPIA_-_Protopia_Sketchbook_(1)_web_H.pdf.json` |
| Power, Plumbing & Pyramid Pimps | PASS_LOCAL `Deep_State_Plumbing - ADD web ID.pdf` | PASS_LOCAL `Deep_State_Plumbing_-_ADD_web_ID.pdf.json` |
| Dream-Wrestling with Kayfabe-Freud: Where the Id Always Kicks Out at Two! | PASS_LOCAL `Dream_Wrestling_with_Kayfabe_Freud - ADD web ID.pdf` | PASS_LOCAL `Dream_Wrestling_with_Kayfabe_Freud_-_ADD_web_ID.pdf.json` |
| Epistemic Sabotage: Let AI Read Your Comic | PASS_LOCAL `Epistemic_Sabotage_LET_AI_READ_YOUR_COMIC_v1 - ADD web.pdf` | PASS_LOCAL `Epistemic_Sabotage_LET_AI_READ_YOUR_COMIC_v1_-_ADD_web.pdf.json` |
| Federal Kayfabe | PASS_LOCAL `Federal_Kayfabe - ADD web ID.pdf` | PASS_LOCAL `Federal_Kayfabe_-_ADD_web.pdf.json` |
| It’s All About Me! (And Also FrizzleBob) | PASS_LOCAL `FrizzleBob_s_Ego_Mania_NARCISSIST - ADD web ID.pdf` | PASS_LOCAL `FrizzleBob_s_Ego_Mania_NARCISSIST_-_ADD_web.pdf.json` |
| Du Elender Wicht! — Uncle FrizzleBob’s Kayfabizarro Kompendium of Insults, Curses & Ritual Provocations | PASS_LOCAL `FrizzleBob_s_KayfaBizarro_Kompendium_ELENDER_WICHT_INSULTS - ADD web ID.pdf` | PASS_LOCAL `FrizzleBob_s_KayfaBizarro_Kompendium_ELENDER_WICHT_INSULTS_-_ADD_web.pdf.json` |
| Uncle FrizzleBob’s Mission Control Deck | PASS_LOCAL `FrizzleBob_s_Mission_Control - ADD web ID.pdf` | PASS_LOCAL `FrizzleBob_s_Mission_Control_-_ADD_web.pdf.json` |
| Grimms' Kayfabe Legends — Expansion Set 02: The Fairy Tale Screwjob | PASS_LOCAL `GRIMMS_KAYFABE_LEGENDS_EXPANSION_SET_02 - ADD web ID.pdf` | PASS_LOCAL `GRIMMS_KAYFABE_LEGENDS_EXPANSION_SET_02_-_ADD_web.pdf.json` |
| Hilfe, ich bin ein Mensch! — Human Nature Science Wrestling | PASS_LOCAL `Help_I_Am_A_Human - ADD web ID.pdf` | PASS_LOCAL `Help_I_Am_A_Human_-_ADD_web.pdf.json` |
| Human Nature Uncut — Hilfe ich bin ein Mensch | PASS_LOCAL `Human_Nature_Uncut_-_Hilfe_ich_bin._ein_Mensch - ADD web.pdf` | PASS_LOCAL `Human_Nature_Uncut_-_Hilfe_ich_bin._ein_Mensch_-_ADD_web.pdf.json` |
| George's Ideology-Wrestling Kayfabizarro Komik Kards — A Field Guide to the War for Your Mind (Version 4.1 Unstable) | PASS_LOCAL `Ideology_Wrestling - ADD web ID.pdf` | PASS_LOCAL `Ideology_Wrestling_-_ADD_web.pdf.json` |
| Jung and Shinn: A Guide to Cosmic Cringe | PASS_LOCAL `Jung_and_Shinn_A_Guide_to_Cosmic_Cringe - ADD web ID.pdf` | PASS_LOCAL `Jung_and_Shinn_A_Guide_to_Cosmic_Cringe_-_ADD_web.pdf.json` |
| Beyond the Banalities of Good vs Evil — Uncle FrizzleBob's KAYFABIZARRO Komik Kards for Monster Morality Wrestling & Flexible Kayfabizarro Ethiks | PASS_LOCAL `KAYFABIZARRO-1_-_MORALE_&_ETHICS - ADD web RE.pdf` | PASS_LOCAL `KAYFABIZARRO-1_-_MORALE___ETHICS_-_ADD_web_RE.pdf.json` |
| Kosmik Kayfabizarro Kollektive (Vol II) | PASS_LOCAL `KOSMIK_KAYFABIZARRO_-_SCI-FI_SPACE_OPERA_long_dark_II - ADD web.pdf` | PASS_LOCAL `KOSMIK_KAYFABIZARRO_-_SCI-FI_SPACE_OPERA_long_dark_II_-_ADD_web.pdf.json` |
| Monopolies, Manipulation & Murder Vol. II | PASS_LOCAL `Kayfabizarro_-_Monopolies,_Manipulation_&_Murder_Vol._II - ADD web ID.pdf` | PASS_LOCAL `Kayfabizarro_-_Monopolies,_Manipulation_&_Murder_Vol._II - ADD web.pdf.json` |
| The Great Kayfabe Improv Komedy SKETCHBOOK | PASS_LOCAL `Kayfabizarro_Improv_Comedy_WEB_v1 ID.pdf` | PASS_LOCAL `Kayfabizarro_Improv_Comedy_WEB_v1.pdf.json` |
| 17 Kayfabe-Questions from Socrates to the FBI | PASS_LOCAL `Kayfabizarro_Mind_Traps - ADD web.pdf` | PASS_LOCAL `Kayfabizarro_Mind_Traps_-_ADD_web.pdf.json` |
| Monomyth Mayhem | PASS_LOCAL `Kayfabizarro_Monomyth_Mayhem_WEB_v1 ID.pdf` | PASS_LOCAL `Kayfabizarro_Monomyth_Mayhem_WEB_v1.pdf.json` |
| The Kraziest Philosophical Kayfabe-Theories Expansion | PASS_LOCAL `Kayfabizarro_Philosophy - ADD web.pdf` | PASS_LOCAL `Kayfabizarro_Philosophy_-_ADD_web.pdf.json` |
| Propositum 2040: Forget Utopia, Ignore Dystopia, Embrace Protopia | PASS_LOCAL `Kayfabizarro_Protopia_WEB_v1 ID.pdf` | PASS_LOCAL `Kayfabizarro_Protopia_WEB_v1_ID.pdf.json` |
| Pulitzer Punk — Kayfabizarro #05 | PASS_LOCAL `Kayfabizarro_Pulitzer_Punk_WEB_v1 ID.pdf` | PASS_LOCAL `Kayfabizarro_Pulitzer_Punk_WEB_v1.pdf.json` |
| Reality Redrawn | PASS_LOCAL `Kayfabizarro_Reality_Redrawn_WEB_v1 ID.pdf` | PASS_LOCAL `Kayfabizarro_Reality_Redrawn_WEB_v1_ID.pdf.json` |
| Ruled by Organized Kayfabe-Krime | PASS_LOCAL `Kayfabizarro_ShadowPolitics_WEB_v1 ID.pdf` | PASS_LOCAL `Kayfabizarro_ShadowPolitics_WEB_v1_ID.pdf.json` |
| Kayfabizarro Siege Kompendium | PASS_LOCAL `Kayfabizarro_Siege_-_TOWER_&_WALL_SIEGE_KAMPAIGNS - ADD web ID.pdf` | PASS_LOCAL `Kayfabizarro_Siege_-_TOWER___WALL_SIEGE_KAMPAIGNS_-_ADD_web.pdf.json` |
| What Work Was For: A Field Report from Before the Timesheet — Vol. I | PASS_LOCAL `Kayfabizarro_What_Work_Was_For_Vol_1_WEB_v1 ID.pdf` | PASS_LOCAL `Kayfabizarro_What_Work_Was_For_Vol_1_WEB_v1_ID.pdf.json` |
| Plato’s Dungeon Raids | PASS_LOCAL `Kayfabizarros_Ontological_Hazards - ADD web ID.pdf` | PASS_LOCAL `Kayfabizarros_Ontological_Hazards_-_ADD_web.pdf.json` |
| Politics — The Starter Set of Doom: 5,000 Years of Bad Ideas & One Very Tired Ballot Box | PASS_LOCAL `Kayfabizzaro_Politics ADD web RE.pdf` | PASS_LOCAL `Kayfabizzaro_Politics_ADD_web_RE.pdf.json` |
| Kreative Kayfab-Kicks & Boomerang Brain Boosters | PASS_LOCAL `Kreative_Kayfab - creative Hero Journey - ADD web ID.pdf` | PASS_LOCAL `Kreative_Kayfab_-_creative_Hero_Journey_-_ADD_web.pdf.json` |
| History of Medicine: The Ancestral Arena | PASS_LOCAL `MedKayfab_Ancestral_Medicine - ADD web.pdf` | PASS_LOCAL `MedKayfab_Ancestral_Medicine_-_ADD_web.pdf.json` |
| Biochemistry & Cell Biology Wrestling | PASS_LOCAL `MedKayfab_Biochemistry - ADD web.pdf` | PASS_LOCAL `MedKayfab_Biochemistry_-_ADD_web.pdf.json` |
| MedKayfab: Cardiology Expansion | PASS_LOCAL `MedKayfab_Cardiology - ADD web.pdf` | PASS_LOCAL `MedKayfab_Cardiology_-_ADD_web.pdf.json` |
| MedKayfab Synthesis Scenarios: The Grand Rumble | PASS_LOCAL `MedKayfab_Clinical_Cases - ADD web.pdf` | PASS_LOCAL `MedKayfab_Clinical_Cases_-_ADD_web.pdf.json` |
| The Differential Engine | PASS_LOCAL `MedKayfab_DIfferential_Diagnosis - ADD web.pdf` | PASS_LOCAL `MedKayfab_DIfferential_Diagnosis_-_ADD_web.pdf.json` |
| MedKayfab: Dentistry — The Oral Arena | PASS_LOCAL `MedKayfab_Dentistry - ADD web.pdf` | PASS_LOCAL `MedKayfab_Dentistry_-_ADD_web.pdf.json` |
| MedKayfab Dermatology 01: The Great Barrier Brawl | PASS_LOCAL `MedKayfab_Dermatology_01 - ADD web.pdf` | PASS_LOCAL `MedKayfab_Dermatology_01_-_ADD_web.pdf.json` |
| Dermatology Wrestling: The Surface Skirmish | PASS_LOCAL `MedKayfab_Dermatology_02 - ADD web.pdf` | PASS_LOCAL `MedKayfab_Dermatology_02_-_ADD_web.pdf.json` |
| The Diagnostic Toolkit: The Detective's Gear | PASS_LOCAL `MedKayfab_Diagnostic_Tools - ADD web.pdf` | PASS_LOCAL `MedKayfab_Diagnostic_Tools_-_ADD_web.pdf.json` |
| Disease Timeline Wrestling: The Temporal Tide | PASS_LOCAL `MedKayfab_Disease_Timelines - ADD web.pdf` | PASS_LOCAL `MedKayfab_Disease_Timelines_-_ADD_web.pdf.json` |
| The Golden Hour Gauntlet — Resuscitation, Rhythms & The Triage Tempest | PASS_LOCAL `MedKayfab_Emergency_Medicine - ADD web.pdf` | PASS_LOCAL `MedKayfab_Emergency_Medicine_-_ADD_web.pdf.json` |
| Endocrinology Edition | PASS_LOCAL `MedKayfab_Endocrinology - ADD web.pdf` | PASS_LOCAL `MedKayfab_Endocrinology_-_ADD_web.pdf.json` |
| Gastrology Edition | PASS_LOCAL `MedKayfab_Gastrology - ADD web.pdf` | PASS_LOCAL `MedKayfab_Gastrology_-_ADD_web.pdf.json` |
| MedKayfab Geriatrics — The Silver Circuit | PASS_LOCAL `MedKayfab_Geriatrics - ADD web.pdf` | PASS_LOCAL `MedKayfab_Geriatrics_-_ADD_web.pdf.json` |
| MedKayfab: Gross Anatomy — Systems Edition | PASS_LOCAL `MedKayfab_Gross_Anatomy - ADD web.pdf` | PASS_LOCAL `MedKayfab_Gross_Anatomy_-_ADD_web.pdf.json` |
| Hematology Wrestling: The Bloodline Feuds | PASS_LOCAL `MedKayfab_Hematology - ADD web.pdf` | PASS_LOCAL `MedKayfab_Hematology_-_ADD_web.pdf.json` |
| MedKayfab: Histology & Microanatomy Edition | PASS_LOCAL `MedKayfab_Histology - ADD web.pdf` | PASS_LOCAL `MedKayfab_Histology_-_ADD_web.pdf.json` |
| The Hospital Hierarchy | PASS_LOCAL `MedKayfab_Hospital_Hierarchy - ADD web.pdf` | PASS_LOCAL `MedKayfab_Hospital_Hierarchy_-_ADD_web.pdf.json` |
| MedKayfab: Immunology & Pathology Edition | PASS_LOCAL `MedKayfab_Immunology - ADD web.pdf` | PASS_LOCAL `MedKayfab_Immunology___ADD_web.pdf.json` |
| Internal Medicine Wrestling: The Multimorbid Melee | PASS_LOCAL `MedKayfab_Internal_Medicine - ADD web.pdf` | PASS_LOCAL `MedKayfab_Internal_Medicine_-_ADD_web.pdf.json` |
| Laboratory Medicine Wrestling: The Numerical Noir & The Biomarker Betrayal | PASS_LOCAL `MedKayfab_Laboratory_Medicine - ADD web.pdf` | PASS_LOCAL `MedKayfab_Laboratory_Medicine_-_ADD_web.pdf.json` |
| MedKayfab: Microbiology & Infectiology Edition | PASS_LOCAL `MedKayfab_Microbiology_Infectiology - ADD web.pdf` | PASS_LOCAL `MedKayfab_Microbiology_Infectiology_-_ADD_web.pdf.json` |
| Neonatal Medicine: The Micro-Battalion | PASS_LOCAL `MedKayfab_Neonatal_Medicine - ADD web.pdf` | PASS_LOCAL `MedKayfab_Neonatal_Medicine_-_ADD_web.pdf.json` |
| Nephrology Edition — MedKayfab | PASS_LOCAL `MedKayfab_Nephrology - ADD web.pdf` | PASS_LOCAL `MedKayfab_Nephrology_-_ADD_web.pdf.json` |
| MedKayfab: Neuroanatomy Edition | PASS_LOCAL `MedKayfab_Neuroanatomy - ADD web.pdf` | PASS_LOCAL `MedKayfab_Neuroanatomy_-_ADD_web.pdf.json` |
| Neurology Edition | PASS_LOCAL `MedKayfab_Neurology - ADD web.pdf` | PASS_LOCAL `MedKayfab_Neurology_-_ADD_web.pdf.json` |
| Nursing & Care: The Vigilance Vanguard | PASS_LOCAL `MedKayfab_Nursing_Care - ADD web.pdf` | PASS_LOCAL `MedKayfab_Nursing_Care_-_ADD_web.pdf.json` |
| The Pelvic Proving Grounds — MedKayfab OB/GYN | PASS_LOCAL `MedKayfab_Obstetrics_Gynaecology - ADD web.pdf` | PASS_LOCAL `MedKayfab_Obstetrics_Gynaecology_-_ADD_web.pdf.json` |
| MedKayfab: Oncology Wrestling! — The Hall of Malignant Mirrors | PASS_LOCAL `MedKayfab_Oncology - ADD web.pdf` | PASS_LOCAL `MedKayfab_Oncology_-_ADD_web.pdf.json` |
| The Optical Octagon: Focal Points & Retinal Rebels | PASS_LOCAL `MedKayfab_Ophthalmology - ADD web.pdf` | PASS_LOCAL `MedKayfab_Ophthalmology_-_ADD_web.pdf.json` |
| The Kinetic Chaos — Orthopaedics & Trauma | PASS_LOCAL `MedKayfab_Orthopedics_&_Trauma - ADD web.pdf` | PASS_LOCAL `MedKayfab_Orthopedics___Trauma_-_ADD_web.pdf.json` |
| ENT: The Sensory Siege | PASS_LOCAL `MedKayfab_Otolaryngology_ENT - ADD web.pdf` | PASS_LOCAL `MedKayfab_Otolaryngology_ENT_-_ADD_web.pdf.json` |
| Pathology & Forensic Medicine: The Post-Mortem Posture | PASS_LOCAL `MedKayfab_Pathology - ADD web.pdf` | PASS_LOCAL `MedKayfab_Pathology_-_ADD_web.pdf.json` |
| Pediatrics: The Growing Gauntlet | PASS_LOCAL `MedKayfab_Pediatrics - ADD web.pdf` | PASS_LOCAL `MedKayfab_Pediatrics_-_ADD_web.pdf.json` |
| Pharmacology Core Edition | PASS_LOCAL `MedKayfab_Pharmacology_01 - ADD web.pdf` | PASS_LOCAL `MedKayfab_Pharmacology_01_-_ADD_web.pdf.json` |
| MedKayfab: Pharmacology Wrestling | PASS_LOCAL `MedKayfab_Pharmacology_01 - ADD web.pdf` | PASS_LOCAL `MedKayfab_Pharmacology_02_-_ADD_web.pdf.json` |
| Physiology Wrestling: Life-Force Logic & Homeostatic Heavyweights | PASS_LOCAL `MedKayfab_Physiology - ADD web.pdf` | PASS_LOCAL `MedKayfab_Physiology_-_ADD_web.pdf.json` |
| Pneumology — MedKayfab Pneumology Wrestling! | PASS_LOCAL `MedKayfab_Pneumology - ADD web.pdf` | PASS_LOCAL `MedKayfab_Pneumology_-_ADD_web.pdf.json` |
| MedKayfab — Psychiatry Wrestling: The Mind-Bending Mat | PASS_LOCAL `MedKayfab_Psychiatry - ADD web.pdf` | PASS_LOCAL `MedKayfab_Psychiatry_-_ADD_web.pdf.json` |
| MedKayfab: Mnemetic Medicine Mayhem — Anti-Rule Book | PASS_LOCAL `MedKayfab_RULES_COMIC_01 - ADD web.pdf` | PASS_LOCAL `MedKayfab_RULES_COMIC_01_-_ADD_web.pdf.json` |
| The Epistemia Edge: Peer-Review Pandemonium! | PASS_LOCAL `MedKayfab_Science - ADD web.pdf` | PASS_LOCAL `MedKayfab_Science_-_ADD_web.pdf.json` |
| MedKayfab: General Surgery — The Surgical Scrimmage | PASS_LOCAL `MedKayfab_Surgery - ADD web.pdf` | PASS_LOCAL `MedKayfab_Surgery_-_ADD_web.pdf.json` |
| The Bedside Ballet: Human Interaction | PASS_LOCAL `MedKayfab_The_Bedside_Ballet - ADD web.pdf` | PASS_LOCAL `MedKayfab_The_Bedside_Ballet_-_ADD_web.pdf.json` |
| Thinking Traps: The Mental Muddle | PASS_LOCAL `MedKayfab_Thinking_Traps - ADD web.pdf` | PASS_LOCAL `MedKayfab_Thinking_Traps_-_ADD_web.pdf.json` |
| Global Outbreak: The Vector Vengeance | PASS_LOCAL `MedKayfab_Tropical_Medicine - ADD web.pdf` | PASS_LOCAL `MedKayfab_Tropical_Medicine_-_ADD_web.pdf.json` |
| MedKayfab Urology 01 — The Renal Reservoir: Pressure, Pipes, and the Pelvic Vault | PASS_LOCAL `MedKayfab_Urology_01 - ADD web.pdf` | PASS_LOCAL `MedKayfab_Urology_01_-_ADD_web.pdf.json` |
| MedKayfab Urology Wrestling: The Renal Reservoir | PASS_LOCAL `MedKayfab_Urology_02 - ADD web.pdf` | PASS_LOCAL `MedKayfab_Urology_02_-_ADD_web.pdf.json` |
| MedKayfab Elemental Wrestling: The Atomic Arena | PASS_LOCAL `Medkayfab_Atomic_Elements - ADD web.pdf` | PASS_LOCAL `Medkayfab_Atomic_Elements_-_ADD_web.pdf.json` |
| Essential Pharmacology: The Synaptic Arsenal | PASS_LOCAL `Medkayfab_Essential_Pharmacology - ADD web.pdf` | PASS_LOCAL `Medkayfab_Essential_Pharmacology_-_ADD_web.pdf.json` |
| Medical Genetics: The Genetic Codebreaker — Source Code Sabotage & The Blueprint Rebellion | PASS_LOCAL `Medkayfab_Genetics - ADD web.pdf` | PASS_LOCAL `Medkayfab_Genetics_-_ADD_web.pdf.json` |
| Intensive Care Medicine: The Vital Vigil | PASS_LOCAL `Medkayfab_Intensive_Care_Medicine - ADD web.pdf` | PASS_LOCAL `Medkayfab_Intensive_Care_Medicine_-_ADD_web.pdf.json` |
| MedKayfab: Radiology ADD | PASS_LOCAL `Medkayfab_Radiology - ADD web.pdf` | PASS_LOCAL `Medkayfab_Radiology___ADD_web.pdf.json` |
| Museum of Modern Mess | PASS_LOCAL `Museum_of_Modern_Mess - ADD web crop01-13.pdf` | PASS_LOCAL `Museum_of_Modern_Mess_-_ADD_web.pdf.json` |
| Nibelungen Booster Pack | PASS_LOCAL `Nibelungen_Booster_Pack_Design - ADD web ID.pdf` | PASS_LOCAL `Nibelungen_Booster_Pack_Design_-_ADD_web_ID.pdf.json` |
| Observation Underground — ADD | PASS_LOCAL `Observation_Underground - ADD web.pdf` | PASS_LOCAL `Observation_Underground_-_ADD_web.pdf.json` |
| Pharaoh Piledriver | PASS_LOCAL `Pharaoh_Piledriver - ADD web ID.pdf` | PASS_LOCAL `Pharaoh_Piledriver_-_ADD_web_ID.pdf.json` |
| Plato's Dungeon Raids: The Odyssey Edition | PASS_LOCAL `Philosopher_Dungeon_Raid ADD web RE.pdf` | PASS_LOCAL `Philosopher_Dungeon_Raid_ADD_web_RE.pdf.json` |
| Plato's Dungeon Raid: Bring Your Own Legend — Hero Set 01 | PASS_LOCAL `Plato’s_Dungeon_Raid - Hero Set 01 - ADD web.pdf` | PASS_LOCAL `Plato_s_Dungeon_Raid_-_Hero_Set_01_-_ADD_web.pdf.json` |
| Plato's Dungeon Raid — Full Class Roster v05 | PASS_LOCAL `Plato_s_Dungeon_Raid_(3) version 05 - ADD web.pdf` | PASS_LOCAL `Plato_s_Dungeon_Raid__3__version_05_-_ADD_web.pdf.json` |
| Dramatic Drops & Krazy Konflikts | PASS_LOCAL `Plot_Pusher_Posse - ADD web ID.pdf` | PASS_LOCAL `Plot_Pusher_Posse_-_ADD_web_ID.pdf.json` |
| Programming the Whole Child | PASS_LOCAL `Programming_the_Whole_Child - ADD web ID.pdf` | PASS_LOCAL `Programming_the_Whole_Child_-_ADD_web_ID.pdf.json` |
| Project Gateway Kayfabe | PASS_LOCAL `Project_GATEWAY_Kayfabe - ADD web ID.pdf` | PASS_LOCAL `Project_GATEWAY_Kayfabe_-_ADD_web_ID.pdf.json` |
| Romantic Love-Wrestling & Krass Kayfabe-Heartbreaks | PASS_LOCAL `Romantic_Kayfabe - ADD web ID.pdf` | PASS_LOCAL `Romantic_Kayfabe_-_ADD_web.pdf.json` |
| The Iceberg Session Cards | PASS_LOCAL `SONIC_WARFARE_Music_History_01 - ADD web ID.pdf` | PASS_LOCAL `SONIC_WARFARE_Music_History_01_-_ADD_web_ID.pdf.json` |
| Medicine Madness: The Waiting Room Anarchy | PASS_LOCAL `Saboteur_Sketchbook_MEDICINE_HISTORY_&_PSYOPS_-_ADD web ID.pdf` | PASS_LOCAL `Saboteur_Sketchbook_MEDICINE_HISTORY___PSYOPS_-_ADD_web_ID_uu.pdf.json` |
| Secret Spy Suplexes | PASS_LOCAL `Secret_Spy_Suplexes - ADD web ID.pdf` | PASS_LOCAL `Secret_Spy_Suplexes_-_ADD_web_ID.pdf.json` |
| Shadow Monopoly: The Great Octopus Wrestling Match — BlackRock, Vanguard & Co | PASS_LOCAL `Shadow_Monopoly_Blackrock,_Vanguard_&_Co - ADD web ID.pdf` | PASS_LOCAL `Shadow_Monopoly_Blackrock__Vanguard___Co_-_ADD_web_ID.pdf.json` |
| Shakespearean Animal Beatdown — The Shakespearean Expansion | PASS_LOCAL `Shakespearean_Animal_Beatdown - ADD web ID.pdf` | PASS_LOCAL `Shakespearean_Animal_Beatdown_-_ADD_web_ID.pdf.json` |
| Sonic Slaughterhouse — Music Industry | PASS_LOCAL `Sonic_Slaughterhouse_MUSIC_INDUSTRY - ADD web.pdf` | PASS_LOCAL `Sonic_Slaughterhouse_MUSIC_INDUSTRY_-_ADD_web.pdf.json` |
| The Most Suppressed Books | PASS_LOCAL `Suppressed_Book_Deck_-_ADD web ID.pdf` | PASS_LOCAL `Suppressed_Book_Deck_-_ADD_web_ID.pdf.json` |
| Symphonic Savagery | PASS_LOCAL `Symphonic_Savagery - ADD web ID.pdf` | PASS_LOCAL `Symphonic_Savagery_-_ADD_web_ID.pdf.json` |
| THE MOVE: A Field Guide to Managed Reactions | PASS_LOCAL `THE_MOVE_(1) - ADD web ID.pdf` | PASS_LOCAL `THE_MOVE_(1).pdf.json` |
| The Bard's Barnyard Beatdown | PASS_LOCAL `The_Bards_Barnyard_Beatdown - shakespeare - ADD web ID.pdf` | PASS_LOCAL `The_Bards_Barnyard_Beatdown_-_shakespeare_-_ADD_web_ID.pdf.json` |
| The Biological Metropolis | PASS_LOCAL `The_Biological_Metropolis - ADD web ID.pdf` | PASS_LOCAL `The_Biological_Metropolis_-_ADD_web_ID.pdf.json` |
| The Biology of Rebellion | PASS_LOCAL `The_Biology_of_Rebellion_-_Hilfe,_ich_bin_ein_Mensch - ADD web.pdf` | PASS_LOCAL `The_Biology_of_Rebellion_-_Hilfe,_ich_bin_ein_Mensch_-_ADD_web.pdf.json` |
| The Carnival of Unsolved Problems | PASS_LOCAL `The_Carnival_of_Unsolved_Problems - THERAPY - ADD web ID.pdf` | PASS_LOCAL `The_Carnival_of_Unsolved_Problems_-_THERAPY_-_ADD_web.pdf.json` |
| Oscar Wilde's Importance of KAYFAB-EARNEST | PASS_LOCAL `The_Importance_of_Being_Kayfab-Earnest - ADD web ID.pdf` | PASS_LOCAL `The_Importance_of_Being_Kayfab-Earnest_-_ADD_web_ID.pdf.json` |
| Kayfabe Koming-of-Age Wrestling All-Stars | PASS_LOCAL `The_Kayfabe_Crucible_COMING_of_AGE - ADD web ID.pdf` | PASS_LOCAL `The_Kayfabe_Crucible_COMING_of_AGE_-_ADD_web_ID.pdf.json` |
| The Kayfabe Money Trail: 9/11 | PASS_LOCAL `The_Kayfabe_Money_Trail - 9-11 - ADD web ID.pdf` | PASS_LOCAL `The_Kayfabe_Money_Trail_-_9-11_-_ADD_web_ID.pdf.json` |
| How To Stage A Cover-Up | PASS_LOCAL `The_Kayfabizarro_Manifesto_-_How_To_Stage_A_Cover-Up - ADD web ID.pdf` | PASS_LOCAL `The_Kayfabizarro_Manifesto_-_How_To_Stage_A_Cover-Up_-_ADD_web_ID.pdf.json` |
| The Move: A Field Guide to Managed Reactions | PASS_LOCAL `The_Move - ADD web ID.pdf` | PASS_LOCAL `The_Move_-_ADD_web_ID.pdf.json` |
| The Pharaoh Script — Psychology of Evil | PASS_LOCAL `The_Pharaoh_Script_-_Psychology_of_Evil_-_Secret_History_vol_06 - ADD web ID.pdf` | PASS_LOCAL `The_Pharaoh_Script_-_Psychology_of_Evil_-_Secret_History_vol_06_-_ADD_web_ID.pdf.json` |
| The Uruk Rumble | PASS_LOCAL `The_Uruk_Rumble - ADD web ID.pdf` | PASS_LOCAL `The_Uruk_Rumble_-_ADD_web_ID.pdf.json` |
| Power Pyramid Plumbing & Global Psyop Wrestling – Expansion Deck 01 | PASS_LOCAL `Uncle_FrizzleBob’s_Kayfabizarro_-_Geopolitical_Thrillers_and_Conspiracy_Theories - ADD web ID.pdf` | PASS_LOCAL `Uncle_FrizzleBob_s_Kayfabizarro_-_Geopolitical_Thrillers_and_Conspiracy_Theories_-_ADD_web_ID.pdf.json` |
| Uncle FrizzleBob’s Tragic Flaws | PASS_LOCAL `Uncle_FrizzleBob_s_Tragic_Flaws - shakespeare - ADD web ID.pdf` | PASS_LOCAL `Uncle_FrizzleBob_s_Tragic_Flaws_-_shakespeare_-_ADD_web.pdf.json` |
| Uncle FrizzleBob's Tragic Flaws | PASS_LOCAL `Uncle_FrizzleBob_s_Tragic_Flaws - shakespeare - ADD web ID.pdf` | PASS_LOCAL `Uncle_FrizzleBob_s_Tragic_Flaws_-_shakespeare_-_ADD_web_ID.pdf.json` |
| Trust & Betrayal — The 'Trust Me, Bro' Edition | PASS_LOCAL `Uncle_FrizzleBobs_Kayfabizarro_Kards_TRUST_&_BETRAYAL - ADD web.pdf` | PASS_LOCAL `Uncle_FrizzleBobs_Kayfabizarro_Kards_TRUST_&_BETRAYAL_-_ADD_web.pdf.json` |
| Unspoken Systems — Kayfabizarro Meta Deck 01 | PASS_LOCAL `Unspoken_Systems_-_Kayfabizarro_Meta_Deck_01 - ADD web.pdf` | PASS_LOCAL `Unspoken_Systems_-_Kayfabizarro_Meta_Deck_01_-_ADD_web.pdf.json` |
| Bullshit Jobs Uncut: A Field Report from Before the Timesheet | PASS_LOCAL `What_Work_Was_For_(3)_Bullshit_Jobs_Uncut - ADD web ID.pdf` | PASS_LOCAL `What_Work_Was_For_(3)_Bullshit_Jobs_Uncut_-_ADD_web_ID.pdf.json` |
| Wine, Woad & Warrior Chiefs | PASS_LOCAL `Woad_and_Warriors - ADD web ID.pdf` | PASS_LOCAL `Woad_and_Warriors_-_ADD_web_ID.pdf.json` |
| Fractal Future Fantasy: The Wrinkle-Rumble Starter Kit | PASS_LOCAL `Wrinkle_Rumble - ADD web ID.pdf` | PASS_LOCAL `Wrinkle_Rumble_-_ADD_web_ID.pdf.json` |


## Other required consumers

No private-game current deployment binding or runtime was verified. No private repo source changed. Source references are evidence of dependencies, not proof every current scene uses each asset.

| Consumer | Evidence | Result |
| --- | --- | --- |
| KFB-Combat-Arena / kfb-combat-arena.pages.dev | 70 source files at `f6a59ad15b9ffcf3164b0ab013f223962b63f61f`; Raw/API/jsDelivr and Mystery figures | NOT_ACCEPTED |
| KFB-Stunt-Car-Race Pages | 41 source files at `df1e35b5692273e8a48eaa219697c927e2c39faa`; pinned shared model/texture roots | NOT_ACCEPTED |
| KFB-Travel-Globe Pages | 122 source files at `8614282aab2ced43bb5dda9fcf7abadf9768100a`; Raw roots and Mystery figures | NOT_ACCEPTED |

| Existing chatgpt.site consumer | Observed deployed version | Blocked-host result |
| --- | --- | --- |
| [KFB · WS1 Staging](https://kfb-ws1-staging.frizzlebob.chatgpt.site) | 4 | NOT_RUN / NOT_ACCEPTED |
| [KFB ToolBox](https://kfb-toolbox.frizzlebob.chatgpt.site) | 11 | NOT_RUN / NOT_ACCEPTED |
| [KFB FrankenStein Composer](https://kfb-frankenstein-composer.frizzlebob.chatgpt.site) | 4 | NOT_RUN / NOT_ACCEPTED |
| [KFB World Studio · MVP 1](https://kfb-world-studio-mvp1.frizzlebob.chatgpt.site) | 2 | NOT_RUN / NOT_ACCEPTED |
| [KFB Hypernormalisation Curator](https://kfb-hypernormalisation-curator.frizzlebob.chatgpt.site) | 1 | NOT_RUN / NOT_ACCEPTED |
| [KFB Audio](https://kfb-audio.frizzlebob.chatgpt.site) | 20 | NOT_RUN / NOT_ACCEPTED |
| [KFB EyeRig Workbench](https://kfb-eyerig-workbench.frizzlebob.chatgpt.site) | 1 | NOT_RUN / NOT_ACCEPTED |
| [KFB Asset Librarian](https://kfb-asset-librarian.frizzlebob.chatgpt.site) | 19 | NOT_RUN / NOT_ACCEPTED |
| [KFB Production Control](https://kfb-production-control.frizzlebob.chatgpt.site) | 79 | NOT_RUN / NOT_ACCEPTED |
| [KFB Production Hub](https://kfb-production-hub.frizzlebob.chatgpt.site) | 13 | NOT_RUN / NOT_ACCEPTED |
| [KFB Combat Arena · CA2-04 Melee Lab](https://kfb-ca2-04-melee-lab.frizzlebob.chatgpt.site) | 1 | NOT_RUN / NOT_ACCEPTED |
| [KFB Combat Arena v4](https://kfb-combat-arena-v4.frizzlebob.chatgpt.site) | 9 | NOT_RUN / NOT_ACCEPTED |


The WS1 environment inventory is empty (revision 0). Its inspected server source snapshot is not authenticated. Native visitor-write eligibility is still unavailable for ToolBox. Existing Site identities, audience and versions were preserved. See `SITES_STATUS.json` and `RETURN.md`.

## Negative controls

Raw, jsDelivr, GitHub Pages, GitHub API and githack each rejected one deliberately attempted fetch: PASS_LOCAL_DENIED, 5/5. These demonstrate that the local test copy could not fall back to those hosts. They are not production network controls.
