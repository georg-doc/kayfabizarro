# Review migration · Cowork / Dropbox stage → Triplet Curator Site

Status: **SITE INPUT CONTRACT READY**

The existing review stage stores decisions in its own browser/sidebar state and exports:

`kfb.triplet-pool-review/1`

The GPT Site must accept that export directly. No re-review in chat is required.

## Canonical donor

GitHub:
`skills/chat/workflows/S1_RESIDENT_PREP_2026-10-04/KFB_TRIPLET_POOL_REVIEW_STAGE_v1.html`

Blob:
`2d4fa60931ae0f1f1815788bb801a5f1e156c1d6`

UTF-8 bytes:
`26833`

A Dropbox copy named `KFB_TRIPLET_POOL_REVIEW_STAGE_v1.html` was independently found with the same byte size, 26833. Dropbox is convenience/review transport only; GitHub remains canonical.

## Import mapping

Review export → Curator authoring state:

- `open` → `DONOR_UNREVIEWED`
- `keep` → `GEORG_KEEP`
- `cut` → `GEORG_CUT`
- `change` → `GEORG_TUNE`

If `imported=true` and there is no Georg decision yet:
- initial state → `WEB_CHAT_CANDIDATE`

Preserve:
- tripletId;
- subject;
- connector;
- reframe;
- relation;
- signatureOf;
- tags;
- Georg note;
- source export date/reviewer.

Do not silently rewrite a kept/cut/tune decision.

## Import precedence

1. newest explicit Georg review export;
2. current GitHub curated authoring state;
3. original 20-item donor seed.

A Site-local unsaved state never outranks an imported Georg export or GitHub curated state.

## Origin boundary

Cowork sidebar/localStorage cannot be assumed readable from the GPT Site origin.

Migration therefore uses **one explicit JSON export/import**. After import, the Site may persist its own working state and export GitHub-ready data.

## Roundtrip acceptance

1. Import a valid `kfb.triplet-pool-review/1` file.
2. Counts and decisions match exactly.
3. CUT entries do not appear in playable selection.
4. TUNE entries preserve original text plus Georg note until edited.
5. Export and reload preserve all decisions.
6. No duplicate Triplet IDs are created.
