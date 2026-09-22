# Failure Recovery · CA2 Public Stage Packaging

Status: **BINARY TRANSFER RECOVERED · R1 CANDIDATE PRESERVED · NOT PUBLISHED**

## 2026-09-22 recovery update

The binary transfer boundary is resolved without replacing any asset:

- all 215 portable runtime files were written as exact Git blobs to `georg-doc/kayfabizarro`;
- candidate branch: `stage/combat-ca2-pr5-c-mvp-a-2026-09-22`;
- candidate head after Hub metadata: `906c9e93f36664b685ac21cd894ccd1b96981ff2`;
- 215/215 packaged file blob SHAs match the rebuilt local `dist/`;
- the 19 WOFF2 files and Combat VFX atlas retain their exact source blob identities.

The new blocker is not packaging. R1 disproved the initial face diagnosis, repaired the missing `forwardZ` transform root cause, and preserved the finite-actor candidate. The remaining real-browser blocker is release/targeting: real target clicks reach `Idle_Gun` but record 0 shots/0 hits. See `C_MVP_A_R1_BROWSER_REPAIR_2026-09-22.md`. The protected publication branch remains unchanged.

This export is for the next binary-capable WSA/local handoff. It does not change Combat runtime ownership.

## Preserved candidate

- Repository: `georg-doc/KFB-Combat-Arena`
- Branch: `chatgpt-web/combat-arena-integration-v2-2026-09-19`
- PR: #5
- Runtime implementation parent: `6bd36e7a2da090d240ab520de9c280ac73fe12cb`
- CI/evidence head: `ebcbde06d931e71a410d5f68bd7ade4eae8984dc`
- Return checkpoint before this export: `223d5f0a98f10bb3a41b8751eede04e4e6ae524f`
- Last exact-head CI evidence: run 35523705001 / job 106112088597 / 68 of 68 tests PASS
- Planned public route: `https://kayfabizarro.pages.dev/kfb-hub/stage/combat/`

## Gate

Publish the existing CA2 candidate through the established KFB public-mirror pattern:

`kayfabizarro/kfb-hub/stage/combat/runtime/`

Do not rebuild the Arena, replace fonts/VFX, or create a second combat owner.

## Transfer attempt 1 · GitHub connector binary path

Result: **BLOCKED**

- private Combat binary blobs are present;
- text blobs can be read and recreated;
- GitHub connector rejects non-UTF-8 blob/content reads;
- the required binary Git object SHAs are not present in current `georg-doc/kayfabizarro` object storage, so they cannot simply be reattached there.

No public write was made.

## Transfer attempt 2 · Dropbox recovery mirror path

Result: **BLOCKED**

Dropbox contains the recovery mirror under:

`/CLAUDE/KFB Combat Arena/KFB-Combat-Arena/`

The 19 local WOFF2 files and Combat atlas are discoverable there with matching names and file sizes. Temporary download links can be created, but this chat environment cannot bridge those private single-use binary payloads into the GitHub public blob writer. Local/container network isolation also prevents direct retrieval.

No public write was made.

## Required binary set

| Runtime path | Private Git blob | Bytes |
| --- | --- | ---: |
| `bundle/1a08ede4-7f12-45db-b64d-bb625f763cc2.woff2` | `d4a9723bdaaff046f491e5ca8685300e0e50621b` | 5100 |
| `bundle/213b6865-5972-4709-af79-b272aebdde1b.woff2` | `d702c5a3aea0f2ec488e6a1f301d101010eb0335` | 12372 |
| `bundle/2c64f14d-cb5d-4a05-b4e9-c4383255b90f.woff2` | `56f045cce6643de71270bffae6005644f2a14d0f` | 11460 |
| `bundle/30ece64f-b2a2-4038-9518-98475a5da90c.woff2` | `05c7748811f4d448bcbd0d19c573083912b6e79f` | 53040 |
| `bundle/31af4eea-b8aa-4e5b-943e-d410655892c2.woff2` | `a80e8e90abb9621beb5b66ddd2242085730a85f2` | 79368 |
| `bundle/6b9896bf-3679-43b9-a598-50a55d10a6c2.woff2` | `fb78ce670561dbd311edd0ebde88fa879d4bd720` | 17188 |
| `bundle/6c28316c-b99c-473c-9699-6b62d617613c.woff2` | `0d422e9090e781ed783cf61fcab42650ce3173a5` | 58456 |
| `bundle/6e20df58-6e4d-4c8e-b911-1c110d893890.woff2` | `c3c28a8b5e8b79a0cb95e980bfbe5eb64d274328` | 35276 |
| `bundle/822fc644-3ef1-4af3-b59c-dc345210ddbf.woff2` | `5dda7d666d505077ba7006b7fea78426faaab6f5` | 48296 |
| `bundle/8e7ee9e3-a234-40ec-a78a-16a0d2dbad6d.woff2` | `a0fadcfcb265537b275875c510df4ad41f9ef31f` | 6772 |
| `bundle/9286f4bc-9a53-4990-a5c0-99d9117b2654.woff2` | `079ee850dbfde3ca697a161e434dfbe109a3c5b4` | 23348 |
| `bundle/93844524-584e-4738-8f2d-595f6dd938a5.woff2` | `948d9ebacadf77c76752842fcc7a6b28485c84af` | 22396 |
| `bundle/a20ea22c-73d2-4b77-a794-ff0d752f2cef.woff2` | `54671c3dacaee0bffaea44c02b545cd3ca0e014f` | 37320 |
| `bundle/a5abc2dc-9648-486c-b395-6bf9f18a9905.woff2` | `e3aa61ccdd2ae7bd4b119f4f73285b44fff5c768` | 18924 |
| `bundle/b0bc1363-cf50-45bc-a681-ccf866261344.woff2` | `2c695ef939d2444a86d96b12dd8381a5094f5f6d` | 7272 |
| `bundle/b6d3f555-40f9-440e-8653-7439d71a0084.woff2` | `7b0e76a5c9bdfdb5ccc8c9ab44780b5ff788c6db` | 22320 |
| `bundle/df2b85b6-10ac-4330-88e0-6006ce2e1cad.woff2` | `a2540b713b4d9cc32851a16f8e6ad1de75ebb7f4` | 18144 |
| `bundle/f3204fd6-5a98-4a16-b366-4d4922d521fa.woff2` | `f99b2f4861a832aa4945903196276dd267c3cc4e` | 30688 |
| `bundle/f6616f21-5739-4e37-9c12-89d69aaf17c8.woff2` | `05f2af2d50d21865c709391f1e2cd1024bc4af87` | 24900 |
| `assets/vfx/kfb-combat-atlas_4x3.png` | `3a66d1011d096ebb429d006b475ca0b2caa310c8` | 425449 |

## Known mirror scope

The private runtime scope inspected contains **180 blob files**.

- **83** exact blob SHAs are already reusable from current `kayfabizarro@main`.
- **97** need transfer/recreation.
- Of those, **77** are UTF-8/text-like and connector-readable.
- The **20** binaries above are the hard boundary.

Do not publish a partial 160-file/179-file candidate just to obtain a URL.

## Binary-capable next procedure

1. Check out PR #5 branch locally or through WSA.
2. Run `npm test`, `python3 tools/build.py`, and `python3 tools/verify_rehome.py`.
3. Mirror the exact portable/runtime files into `kayfabizarro/kfb-hub/stage/combat/runtime/`.
4. Add the stable Stage wrapper at `kfb-hub/stage/combat/index.html` targeting `./runtime/slices/combat-integration-v2/`.
5. Add provenance/deployment/public manifest and KFB Hub Stage card.
6. Commit on a bounded public packaging branch/PR; do not promote Live.
7. Open the exact Cloudflare route and confirm the expected revision.
8. Only then run the browser state sequence from `STATE_SEQUENCE.md`.

## Acceptance boundary

No public Stage PASS, browser PASS, performance PASS or Georg acceptance exists yet. The preserved candidate remains the CI-green PR #5 line.
