# Test Report · KFB Popup Assets Paris 1950s + Hollywood LA · 2026-10-25
**Status:** ORIGINAL IMAGE FILE / ALPHA TEST COMPLETED; **not sprite-ready**; no game or browser test. No binary PNG objects committed to GitHub in this session.
**Input:** four exact generated RGBA PNG files still available in current conversation runtime; original pixel bytes copied unchanged to local handoff ZIP. Reference SHA256 in [QA manifest](ASSET_SHEETS_QA_MANIFEST_R1.json), direct inspect 4/4.

## Tests actually executed

| Check | Count | Result |
| --- | ---: | --- |
| Original PNGs located/opened | 4/4 | PASS |
| Pillow decoder verify, RGBA mode, 1448×1086 | 4/4 | PASS |
| SHA256 unique and recorded | 4/4 | PASS |
| Has zero-alpha pixels / intentional transparency | 4/4 | PASS |
| Pixel-level alpha diagnostic at threshold 128 | 4/4 | PASS as **diagnostic**; nonzero partial background halos |
| OpenCV >=2,000px connected regions detected | 8 / 9 / 5 / 15 | ANALYTICAL RESULT; **not** counts of detachable semantic sprites |
| ZIP can be unpacked and CRC verified | 1/1 | PASS |
| Clean independent standalone game sprites | 0/4 sheets | **NOT READY** — touching borders, semi-transparent detritus, mixed scenery ground/perspective |
| Full-size single-object source isolation | 0/4 | NOT RUN |
| Browser image test / alpha atlas parser | 0 | NOT RUN |
| WS1/Racer gameplay, GPU, physics/LOD tests | 0 | NOT RUN |
| GitHub-original binary readback | 0/4 | **NOT UPLOADED** |
| Golden sample approved by Georg | 0 | NOT APPROVED |
| GPT plugin created / published | 0 | NOT BUILT |

## Individual image alpha and integrity

| Sheet | Fully-transparent fraction | Distinct large alpha-connected regions | Assessment |
| --- | ---: | ---: | --- |
| Paris landmarks | 26.405% | 8 | compositional sheet; some edge residues |
| Paris street props | 20.372% | 9 | image/piece overlaps, grouped props |
| Hollywood landmarks | 18.159% | 5 | joined skyline/landmark chunks |
| Hollywood props | 22.352% | 15 | more separated but still shared outline edges and signs/plinths |

**Quality note:** Semi-transparent antialiased pixels inside the proper cut outline are expected; *ghostly colored alpha noise far from a sprite* is not. No fixed universal threshold is approved from this exercise. Visually inspect on checkerboard, black, white, KFB actual terrain, and at target small gameplay resolution; detect semantic boundaries, not merely raw connected components. No automated cropping accepted as source-true.

### Local QA tooling and deliverable

Used Pillow + OpenCV script `kfb_popup_qa_pack.py`. Verified downloadable conversation artifact `KFB_POPUP_ASSETS_PARIS_LA_R1_ORIGINALS_AND_QA.zip`: original 4 PNGs and unmodified bytes, manifest, README, local QA checkerboard contact preview, reproducible check script; archive byte size 12,030,358; SHA256 `7efd549a9de6daccdfa1e570ed0a33f174613669a12886a2c9492fad78c59414`. Files exist in current sandbox; **a local sandbox URL is not a durable GitHub blob or Stage**.

## Preflight failure / fix guidance

First output sample quality is creatively promising but no source-fit/clean extraction claim. Rerun asset generation for ONE selected prop/landmark per frame or a spacious small bounded sheet with actual no-touch margins. Then auto flag edge/alpha defects, inspect original isolated result, record foreground white outline on black+white+checker and comparison to normal KFB 3D/Clay. Fail one object's cutout if it merges with another; never force a broken automatic mask crop into game use.

**Single next gate remains WS0 → WS1 terrain/world intake:** WS0 reviews source/QA and nominates one actual sprite-cutout source-isolated POC, while original image binary GitHub upload remains a bounded transfer task to perform in the same existing branch once an authorized binary-capable executor can read the actual original files.