# KFB Eye Actor Studio v1 · CHANGELOG

## 2026-09-21 · EAS1-A/B/C/D working candidate

Created fresh branch from main@66d6d96b5e8f6ef8fb06a0888baa70d822fb9a69.

Implemented:
- exact EyeRig v6 / BrowRig v2 / EyeOval v1 donor mode;
- Studio shell;
- Eye Cluster 1–4;
- per-eye position, size, W/H/D and Pitch/Yaw/Roll;
- asymmetric pair;
- frog-side pair;
- single / three / four-eye fixtures;
- Clay lids;
- scoped pose shelf;
- 3D sweat/soot preview;
- JSON export;
- desktop/mobile responsive authoring surface.

Evidence at cfead6b064a36075f3c360217ed42c92b065bec3:
- 20/20 static PASS;
- 4/4 syntax PASS;
- 22/22 desktop/mobile WebGL PASS;
- 0 failed resources;
- 0 page/console errors.

GPT/sandbox single-file mirror prepared for fast iteration without Cloudflare.

Open visual issue: Clay lids on extreme frog orientation remain heavy/rim-like.

Next: EAS1-VIS-1 human visual review in GPT workbench.
