# RETURN · Card Zone v3 / Hex Project Islands · H0 source-lock checkpoint

Status: **H0 SOURCE LOCK PASS · BROWSER PARITY OPEN · H1 BLOCKED · NO STAGE / NO LIVE**

Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/card-zone-v3-h0-parity-2026-09-21`  
Draft PR: **#161**  
Stacked base: `planning/toolbox-card-zone-v3-hex-project-islands-2026-09-21@ee0f9bb6d738c538e042f799e5fb6f9b20893a01` / planning PR **#156**  
Head before this final Return commit: `56b4251d326bb78901908288e848d9cf81a763ab`

## Outcome

H0 has started from the real working Card Zone Lab v2 donor. No Hex geometry or generator work was started.

The exact v2 Fluid Shader needed for Storytelling Map / Claude Design is now recovered from:

`tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/card-zone-lab-v3/KFB Card Zone Lab v2.dc.html`

Pinned donor blob:

`43eea82f8727d3581e50374d6263e48a28241d3b`

Reusable source-locked handoff:

`tools/KFB-ToolBox/_handover/CARD_ZONE_V2_FLUID_SHADER_SOURCE_2026-09-22/`

The handoff includes:
- source-exact Vertex + Fragment GLSL;
- exact five v2 fluid colors;
- original `waterdudv.jpg` + `water.jpg` texture contract;
- original ShaderMaterial flags and elapsed-time update;
- minimal lake/river `aFlow` adapter seam;
- Claude Design Storytelling Map brief;
- source metadata and test report.

ToolBox Bench v1/v1.1 was not used as the source.

## Tests / evidence

Fluid donor source comparison: **10/10 PASS**
- palette 5/5;
- Vertex GLSL 13 source lines verbatim;
- Fragment GLSL 31 source lines verbatim;
- texture refs + color-space/wrapping/anisotropy;
- material flags;
- elapsed-time update;
- source foam state preserved;
- no Bench-only fluid-kind extension.

Handoff/router static checks: **10/10 PASS**
- both JSON contracts parse;
- all 11 H0 feature rows are source-verified;
- H1 is blocked;
- central router, KFB Hub and ToolBox Hub point to PR #161;
- no public Card Zone preview is claimed;
- both changed Hub inline scripts parse.

Dropbox corroboration:
- matching named v2 export found;
- observed size: **144800 bytes**;
- full byte equality was not claimed because Dropbox text extraction did not expose the full HTML.

`game-dev`: unavailable in this runtime; repository-native checks used. Sealed GDS evidence is not required for this source-lock checkpoint.

## H0 parity state

`FEATURE_PARITY_V2.json` now tracks the 11 required v2 features.

Source state: **11/11 SOURCE_VERIFIED**  
Browser parity: **NOT_RUN**  
Required screenshots: **0/4**  
Browser console/runtime proof: **NOT_RUN**  
H1 allowed: **NO**

## Changed files in PR #161

1. `tools/KFB-ToolBox/_handover/CARD_ZONE_V2_FLUID_SHADER_SOURCE_2026-09-22/card-zone-v2-fluid-source.js`
2. `tools/KFB-ToolBox/_handover/CARD_ZONE_V2_FLUID_SHADER_SOURCE_2026-09-22/README.md`
3. `tools/KFB-ToolBox/_handover/CARD_ZONE_V2_FLUID_SHADER_SOURCE_2026-09-22/SOURCE.json`
4. `tools/KFB-ToolBox/_handover/CARD_ZONE_V2_FLUID_SHADER_SOURCE_2026-09-22/TEST_REPORT.md`
5. `tools/KFB-ToolBox/_handover/CARD_ZONE_V2_FLUID_SHADER_SOURCE_2026-09-22/CLAUDE_DESIGN_STORYTELLING_MAP_FLUID_BRIEF.md`
6. `skills/chat/workflows/KFB_CARD_ZONE_V3_HEX_PROJECT_ISLANDS_2026-09-21/FEATURE_PARITY_V2.json`
7. `skills/chat/workflows/KFB_CARD_ZONE_V3_HEX_PROJECT_ISLANDS_2026-09-21/SOURCE.json`
8. `skills/chat/workflows/KFB_CARD_ZONE_V3_HEX_PROJECT_ISLANDS_2026-09-21/TEST_REPORT.md`
9. `skills/chat/workflows/KFB_CARD_ZONE_V3_HEX_PROJECT_ISLANDS_2026-09-21/RETURN.md`
10. `skills/chat/CHANGELOG.md`
11. `skills/chat/START_HERE.md`
12. `kfb-hub/index.html`
13. `kfb-hub/stage/toolbox/index.html`

## Publication / visual proof

Screenshots: **NONE**  
Direct Stage URL: **NONE**  
Cloudflare PUBLIC_VERIFIED: **NO**  
Live promotion: **NO**  
Human acceptance: **NOT_REQUESTED**

The future Card Zone v3 Stage route remains reserved but undeployed.

## Unresolved

H0 still needs actual browser-visible parity of the existing v2 donor:
- overview;
- real card/reveal + Card Cube;
- Sky Card/projection;
- fluid/river;
- console/runtime proof.

No source-object visual proof of the isolated shader has been produced in this runtime, so Claude Design integration should begin with the isolation gate in the supplied brief.

## Exactly one next gate

**H0-BROWSER · open the working Card Zone Lab v2 in its real browser host and capture the four required parity views + console/runtime proof.**

Do not begin H1 until that gate passes.
