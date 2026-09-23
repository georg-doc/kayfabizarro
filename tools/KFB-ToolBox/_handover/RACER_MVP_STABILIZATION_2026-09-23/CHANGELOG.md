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
