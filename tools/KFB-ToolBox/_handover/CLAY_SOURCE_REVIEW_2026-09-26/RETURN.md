# KFB ClayBound · External Source Review + Gemini Seam QA · RETURN · 2026-09-26

Status: **REVIEW READY · DRAFT PR · NO STAGE / LIVE PROMOTION**

Owner: **KFB ToolBox / ClayBound material exploration**  
Human: Georg

## Repository / branch / PR

- repo: `georg-doc/kayfabizarro`
- base: `main@5240bb4a6ddcee111d6453b43879426574c1bf88`
- branch: `chatgpt-web/clay-gemini-seam-qa-2026-09-26`
- Draft PR: **#230**
- implementation/evidence head before Return metadata: `07dd5d92971748f98e15e8418a4c18afa802372a`
- merge: **NOT REQUESTED**
- Stage: **N/A · no browser/runtime publication in this slice**

## Goal

Classify the supplied external clay/claymation sources for KFB production, add RandTextureGen/Xargiv as a supporting texture tool, and independently QA the new Gemini `rx1f` texture candidate without changing runtime/material ownership.

## Actual result

### External sources

Recorded in:
`tools/KFB-ToolBox/_inbox/KFB Style References/ClayBound Cozy Platformer + Editor/CLAY_PRODUCTION_SOURCE_REVIEW_2026-09-26.md`

Classified:
- **RandTextureGen / Xargiv** → supporting external texture-authoring tool;
- **Dandruff Clay seamless texture pack** → incoming calibration/source pack;
- **Clay Knight** → combat behavior / feel reference only;
- **Unreal clay stop-motion project** → concept donor only;
- **Belimoth Clay (Classic)** → generative-art patch environment, not a clay-material source.

### Xargiv license/provenance

Verified from `DD-moe/xargiv`:
- repository `LICENSE`: MIT;
- website terms: site features/code/tutorials described as CC BY-NC-ND;
- generated images: **CC BY**, commercial use allowed, attribution required;
- landing page says generated textures may be further processed, published or sold.

KFB action:
- use as hosted/supporting tool;
- preserve attribution/provenance on generated textures;
- do not relabel output as CC0;
- do not fork/redistribute the full site code in this slice because the software/site wording is not perfectly aligned.

### Gemini rx1f seam QA

Source:
`Gemini_Generated_Image_rx1fvxrx1fvxrx1f.jpeg`

Verified:
- blob `d2ecee01172f0e87a47bde9d923eb7abfc3c0333`
- 3,100,820 B
- **2048 × 2048**
- **JPEG / RGB**
- SHA-256 `7f6fe45b7553d892e686a519a11f3f51d70e7234008b3d9155b323d1b19cbb47`

GitHub Actions:
- run **36257239128**
- job **108446236219**
- tested head `eb3fc60bee9b8030b68d08dd27116e5aa229546b`
- substantive QA steps: **6/6 PASS**
- artifact **10911321215**
- artifact digest `sha256:bd61a384798c310fd7a87a4b337d6c3ae11b5a37d22d296dda6db96599349778`

Metrics:
- X opposite-edge/internal ratio: **1.359317 · BORDERLINE**
- Y opposite-edge/internal ratio: **1.093300 · LIKELY_CONTINUOUS**

Visual 3×3 / offset review:
- no catastrophic hard horizontal seam;
- large pressed/smeared clay shapes repeat visibly as a grid.

Verdict:
**NEEDS FIX FOR CLAY-ASSET-01**.

Preserve as a possible later compressed/kneaded/worked-clay donor.

The temporary QA workflow was removed after the successful evidence run, so it will not enter `main` through this PR.

## Changed production records

- `.../CLAY_PRODUCTION_SOURCE_REVIEW_2026-09-26.md` — new
- `.../CLAY_GEMINI_RX1F_SEAM_QA_2026-09-26.md` — new
- `.../CLAY_ASSET_01_CANDIDATE_2026-09-26.md` — updated
- `.../CLAYBOUND_INPUT_INTAKE_2026-09-26.md` — updated
- `tools/KFB-ToolBox/CHANGELOG.md` — additive update
- `skills/chat/START_HERE.md` — current routing update

## Existing owners retained

- KFB Clay Asset Studio → one-at-a-time raster candidate production / QA helper.
- KFB ToolBox → ClayBound material exploration receiver.
- Asset Librarian → approved asset discovery/receiving owner.
- Blender / Blender MCP → material proof only after human-approved source asset.
- KFB Combat Arena → combat gameplay owner.
- KayKit animation source/registry → existing motion source; no Clay Knight animation extraction.
- HUB-CTRL #202 → existing visible ClayBound production lane.

## Hub / publication

No new Hub card is required because the active human gate is unchanged.

Existing visible lane:
**ClayBound · Production Assets**

No new Cloudflare route was created. No Stage/Live claim.

## Dandruff pack arrival check

At main `5240bb4a6ddcee111d6453b43879426574c1bf88`, `media/3D_Assets/Textures/` still exposes the pre-existing clay folders:
- `Clay001`
- `Clay002`
- `Clay004`
- `clay_floor_001`

The newly mentioned Dandruff pack is **not yet visible as a newly named top-level texture entry** at this check.

Status:
**EXPECTED SOURCE · INVENTORY AFTER ARRIVAL**

## Unresolved / deferred

- primary ChatGPT/Clay Asset Studio Asset-1 seam QA is still pending;
- Gemini `rx1f` is not accepted as Asset 1;
- Dandruff pack contents still need repository inventory after upload appears;
- no Blender clay material POC until at least one core texture is human-approved;
- no Xargiv code fork or embedded KFB tool in this slice.

## Exactly one next gate

**Finish the primary CLAY-ASSET-01 source + 3×3 repeat / edge QA and obtain Georg's PASS / NEEDS FIX decision before Asset 2 or Blender integration.**
