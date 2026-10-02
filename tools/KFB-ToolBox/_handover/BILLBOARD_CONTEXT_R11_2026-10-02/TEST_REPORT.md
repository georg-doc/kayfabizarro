# TEST REPORT · Billboard Context R11

Status: DONOR_ISOLATION_PASS · integration not yet claimed
Date: 2026-10-02
Owner: KFB ToolBox / Billboard Media Residency
Branch: `chatgpt-web/billboard-context-r11-2026-10-02`
Draft PR: #321

## H13 source-object isolation

Workflow run: `37035146148`
Job: `110931373142`
Artifact: `11238619910`
Artifact digest: `sha256:a43179892e80aa469cf98673bbc1cd19e6426c44ff073e465af9635278798660`

Result: **8/8 PASS**

1. local H13 HTTP 200
2. H13 root runtime booted
3. existing `palSource=CARDS` option exists
4. existing `kfbShare` prop exists
5. real 1024×512 H13 face canvas visible
6. isolated source screenshot contains real rendered bytes
7. H13 survives existing `__dcSetProps(..., { palSource:'CARDS', kfbShare:1 })`
8. zero page errors

## Visual evidence

- `01-h13-source-isolated.png`: real frozen H13 canvas, captured before integration.
- `02-h13-cards-prop.png`: same H13 donor after the existing CARDS palette/KFB-share prop seam is applied.

These screenshots prove the source object itself was used before integration. They are not a replacement mockup.

## Protected source check

The candidate's H13 files are byte-identical to current main:
- H13 HTML blob `46670cfa5c62c3aea6aa3840d301fc7a35723407`
- support.js blob `6ca00e36551a5e172311990a3eaebffb581d3d0b`
- h6-card-crops.json blob `f91ee4a85c879c43de9d19cb1c09998b230553aa`

## Next gate

Integrate this proven H13 face as one content source inside the existing B2a Billboard runtime. Do not alter H13, B1 content-fit or B2a front/rear video semantics.
