# CHANGELOG · KFB Racer MVP Stabilization

## 2026-09-23 · RSTAB-0 mapped on Race Draft PR #31

- newest Claude export pinned to Race `main@cc80f4a1c6c509db9668df79fd53b13cee093a9d` / `KFB Cologne Race Option C-3/`;
- GitHub ↔ Dropbox unpacked parity: 38/38 files, 1,118,828 B each, zero path/size differences;
- RSTAB-0 packet created on `georg-doc/KFB-Stunt-Car-Race#31`, branch `chat/racer-rstab0-audit-2026-09-23`;
- exact verified Race head at coordination return: `58d837a5b858bdf7af178bcf0bb578d6ab018ff4`;
- full route reconstructed/scanned: 598 points, 2063.844 m;
- hard-curve hotspot localized to index 176 / 29.4% / s≈589 m, local radius ≈35.3 m against ≈61.6 m v0.8 full-steer radius at 41 m/s;
- all 54 generated `structure-pillar` placements scanned; three deterministic penetrations found at indices 166, 179 and 187;
- ground-wedge owner localized to ground-cut ↔ tunnel-shell seam, but exact current visible wedge mesh remains a browser/raycast gate;
- existing diagnostic blind spots recorded: `ground-plate` and `structure-*` are excluded from normal route scans;
- no runtime repair, no FLOW/FEEL change, no HUD/billboard/vehicle expansion;
- no new browser/GPU/audio/public PASS claimed;
- `game-dev` unavailable once; repository-native fallback used.

Exactly one next gate:

**RSTAB-1 · static geometry intrusions — ground wedges + support pillars.**


## 2026-09-23 · RSTAB-1 technical PASS

- Race Draft PR #32 / `chat/racer-rstab1-geometry-2026-09-23`, stacked on RSTAB-0 PR #31;
- exact runtime + bounded-CI candidate head `e9c72a404aff63d46762d9101a727a9e7f94a6b0`;
- ground-cut seam now follows the actual banked 14-facet tunnel shell with separate left/right edges, 10-point transition and 0.03 m seam clearance;
- old post-`SLEW_M` seam owner removed;
- support pillars now terminate at actual banked soffit endpoints; existing **54** support instances retained;
- old placement reproduces penetrations 166 / 179 / 187; repaired rule yields **0** road penetrations;
- GitHub Actions run `35807766171` / job `107012285119`: **5/5 PASS · 0 FAIL**;
- route remains 598 points / 2063.844351 m;
- route, v0.8 FLOW/FEEL, camera, grounding, HUD, billboards, audio, trails and roster unchanged;
- no RSTAB-2 work started;
- no current C-3 browser/Cloudflare PASS claimed.

Exactly one next gate:

**RSTAB-1 HUMAN GEOMETRY GATE** — tunnel/ground-cut + support endpoints. Human ACCEPT is required before RSTAB-2.


## 2026-09-23 · RSTAB-1 zero-install Stage prepared

- Race PR #32 remains the runtime owner; current handoff head `d712a17904f532c2eca9f120d24924073eae0f3c`, runtime-tested head `e9c72a404aff63d46762d9101a727a9e7f94a6b0`;
- kayfabizarro Draft PR #178 packages the additive review route `kfb-hub/stage/stunt-world/cologne-option-c-rstab1/`;
- Stage source branch `stage/racer-rstab1-review-2026-09-23@13191b0f600878f96b06db8142d8d7393411a67d`;
- Stage `lab-v9` mirror: **20/20 filenames + blob SHAs identical** to Race RSTAB-1;
- Cloudflare source commit `77e4bd44aac0d0ce720c5b0149eedb3eef62ac36`;
- Cloudflare Hub metadata commit `a075934bb5f8628535b673459b0b9ddcc0af5312`;
- main Hub metadata commit `fd7680034171f9a327936e9ee7fa2a3cc1f6b4dc`;
- intended human URL `https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c-rstab1/`;
- public verification remains **UNKNOWN / PENDING** because the current environment cannot resolve/access `pages.dev`;
- local Git/Python preview is retained only as developer fallback, not the human acceptance surface;
- no RSTAB-2 implementation started.

Exactly one next gate remains **RSTAB-1 HUMAN GEOMETRY GATE**.


## 2026-09-23 · Human WEDGE fail → repair pass 2

- First zero-install RSTAB-1 human gate failed: at least two brown wedges remained in the first tunnel;
- new human findings recorded for later gates: stationary vehicle float/front-wheel lift, extreme first hard-curve jerk, Tail/Speedline rectangle breakup;
- remaining brown cut transitions localized exactly to route **99→100** and **133→134**;
- both are inside TUNNEL with rendered shell at both endpoints;
- Pass 2 gives those transition segments to the tunnel shell and stops brown cut wall/invert emission there;
- historical mouth **90→91** remains ground-owned;
- Race runtime/test candidate `a9dd49995d32423e101a67f2e591c2b069583252`;
- GitHub runs `35814096388` and `35814091421`: SUCCESS;
- current test file: **6 active / 0 skipped**;
- WEDGE pass 2 is the final repair attempt on this foundation; same-gate failure again => failure-recovery export, no pass 3;
- Stage source PR #178 head `df82e1fa31213d21c13af1f39f369608078633a3`;
- Cloudflare route source `ad0036c465e7c5a87c3cfcc0d49cfb2cf3378de0`;
- Hub metadata `cloudflare-live@f904c318172848078b9d7f58e2b186c5fda03e7d`, main `db3a651698d4f829ebc1f7be543ab1b51dc20494`;
- intended review URL unchanged: `https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c-rstab1/`;
- public verification remains UNKNOWN/PENDING due pages.dev access/DNS failure in this environment;
- downstream order after WEDGE ACCEPT: vehicle support/orientation/landing → hard-curve stability → trail continuity recheck.


## 2026-09-23 · TARCH-0 architecture reset + Chat artifact QA

- old RSTAB-1 tunnel/ground foundation archived after two failed human repair passes; no WEDGE pass 3;
- new Race Draft PR #33: `chat/racer-tarch0-sp13ktra-2026-09-23`;
- current handoff head `45fa80d0449efecf6a9ecfb69386c6cb4f9ba1fd`;
- runtime-tested TARCH integration `b37cbad1038e669a0c9929d25789d54d0283b0fc`;
- GitHub Actions `35817990559 / 107043574054`: SUCCESS;
- architecture regression: **7 active / 0 skipped**;
- donor principle: `KilledByAPixel/SP13KTRA@166ad838b9a067f85100eaff7876522f7cfe9feb`;
- donor license All Rights Reserved; no donor code/assets copied;
- KFB tunnel architecture now uses one continuous road/causeway, broad ground exclusion and dense arch scenery;
- rejected runtime owners removed from the tunnel path: `TUNNEL_SHELL`, `tunnel-shell`, `ground-cut-wall-*`, `ground-cut-invert`;
- human visual QA moved to attached ChatGPT HTML artifacts: R1 isolated → R2 integrated → optional R3 correction;
- Cloudflare / Pages deferred until after human visual acceptance;
- no vehicle grounding, hard-curve or trail work started.

Exactly one next gate:
**TARCH-0 HUMAN ARCHITECTURE GATE · R1 CHAT HTML**.


## 2026-09-23 · TARCH R1 accepted · verified review donor · R2 prepared

- Georg accepted the isolated TARCH R1 Chat HTML review;
- exact accepted artifact archived on Race PR #33:
  `TARCH-0/review/KFB_Racer_TARCH0_R1_review.html`;
- acceptance evidence:
  `TARCH-0/review/R1_ACCEPTED.md`;
- accepted harness registered centrally as `threejs-focus-review-v1`;
- shared pool:
  `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/REVIEW_TEMPLATE_POOL.md`;
- registry:
  `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/review-templates/REGISTRY.json`;
- review-pool ownership follows the Resident Scene principle: review presentation may own camera/toggles/debug, never product movement/collision/runtime ownership;
- R2 integrated review generated from runtime head `b37cbad1038e669a0c9929d25789d54d0283b0fc`;
- R2 artifact SHA-256 `bc5a97f5239c66f54e8cb53bfd21fef0326a7c3f40f524419ddce60cce3b5fc4`;
- R2 recovery marker on Race PR #33 head `6e37fa689441946a1e063af939b16cf0cbb54ce1`;
- Cloudflare/Pages remain deferred;
- no grounding, curve or trail repair started.

Exactly one next gate:
**TARCH-0 R2 · integrated Racer Chat HTML human review**.


## 2026-09-23 · R2 TUNE → R3 Track Edge + Banking

- R2 retained the TARCH architecture direction but returned TUNE;
- saw-tooth edge artifacts were proven to come from the chat-review painter path, not the runtime TARCH Ground Void;
- runtime Ground Void architecture therefore remains unchanged;
- actual runtime banking sign corrected in `cologne-route.v1.js`: `-curv*26` → `curv*26`;
- gain/cap/smoothing, route topology and widths unchanged;
- R3 banking regression added;
- runtime/test head `5f1ec224a96af7444f0c86ebbcf178dc70d35b72`;
- GitHub runs `35859446787` and `35859451138`: SUCCESS;
- **11/11 PASS · 0 fail · 0 skipped**;
- R3 chat review uses verified `threejs-focus-review-v1`;
- review-only road/shoulder/wall/ground edges changed to continuous polygons;
- hard-bend / bank-side camera presets and inside/outside guide added;
- R3 artifact SHA-256 `980b245478a28f9e39dcf284ece6caaf9e013a65a766f9c0fb51121e48e2d88b`;
- Race PR #33 current docs head `59fa2a4235e7705a495bbd724d92a315befe1628`;
- Cloudflare remains deferred;
- grounding, clamp/jitter, trails and jump/landing remain later.

Exactly one next gate:
**R3 · TRACK EDGE + BANKING CHAT HTML HUMAN REVIEW**.


## 2026-09-23 · R3 review fail → R3b harness repair

- R3 human review showed arch frames while the track largely disappeared in CHASE;
- sanity confirmed runtime road, Ground ShapeGeometry and corrected banking were still present;
- failure localized to the chat review renderer, not runtime;
- root cause: one long road/shoulder/wall review polygon was discarded when any vertex moved behind the camera;
- R3b restores road/shoulder/walls to short per-segment review quads;
- continuous city-ground review edge is retained to preserve the R2 saw-tooth cleanup;
- corrected banking remains unchanged;
- no runtime file changed for R3b;
- R3b artifact `KFB_Racer_TARCH0_R3b_track_edge_banking_review.html`;
- SHA-256 `100310fbc4794f317ce572d403142ee464e6b2a57a4e32a5a84382294b03fd3b`;
- Race PR #33 current docs head `308ed3b7e464f573b85d004f13fbf9e0642c818c`.

Exactly one next gate:
**R3b · TRACK EDGE + BANKING CHAT HTML HUMAN RECHECK**.


## 2026-09-23 · R3c closed track body + rounded frames

- R3b remained TUNE: visual ground/track overlap, ambiguous flat-band curve anatomy, unfinished underside, boxy/gapped TARCH frames;
- Dropbox C-3 owner/donor documentation re-read; no Dropbox mutation;
- project-owned `cologne-landmarks.v1.js` reused as visual implementation donor for continuous smooth TubeGeometry;
- track presentation changed to one cyclic closed `track-body`;
- road + shoulders + side skirts + complete underside now share one cross-section;
- old primary `track-bed` and primary shoulder ribbons removed;
- old partial `structure-soffit` / underside skirts removed;
- tested RSTAB-1 `structurePillarSpan()` salvaged into current branch;
- supports terminate at local banked soffit endpoints; former hotspots 166/179/187 covered;
- support cylinder radial segments 10→14;
- TARCH frames changed from BoxGeometry post/post/lintel to one rounded CurvePath / TubeGeometry frame;
- tube radius 0.48 m; corner radius 1.15 m; 10 radial segments; bases remain `u=1.30`;
- final runtime/test head `b48ba46bb23e656cad968cb347bde7aa4bd445c4`;
- final CI runs `35874800062` and `35874807681`: SUCCESS;
- aggregate **17/17 PASS · 0 fail · 0 skipped**;
- Race PR #33 current docs head `f8f29f7b742e0b18fd9887398cd6bb4b7c320a32`;
- R3c review artifact `KFB_Racer_TARCH0_R3c_track_body_rounded_frames_review.html`;
- SHA-256 `36a363efd5412b41f9b8bea26998e32a16a1965b9335000ed8b82d6f795ff0f0`;
- Cloudflare remains deferred.

Exactly one next gate:
**R3c · TRACK BODY + ROUNDED FRAMES CHAT HTML HUMAN REVIEW**.
