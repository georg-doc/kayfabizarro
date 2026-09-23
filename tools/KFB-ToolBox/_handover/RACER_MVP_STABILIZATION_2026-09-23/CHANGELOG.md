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
