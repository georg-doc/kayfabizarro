# BRIEF · Work/WSA · one-time Style Reference live-data migration

Status: **READY · TOKEN-SAVING ONE-TIME MIGRATION**
Date: 2026-10-07

## Executor
**ChatGPT Work/WSA**

## Outcome

Perform one final structural Site update so future **data-only Style Reference updates no longer require Work/Sites publication**.

In the same run:
1. sync the current curated corpus to **69 built-ins**;
2. add a GitHub-live data loader with deployed fallback;
3. publish/update the **existing** Asset Librarian Site in place;
4. prove one GitHub-data-only change appears after refresh without another Site publish.

## Existing owner / Site

Repo:
`georg-doc/kayfabizarro`

Draft PR:
**#359**

Branch:
`planning/style-reference-library-r1-surface-2026-10-05`

Existing Site:
`https://kfb-asset-librarian.frizzlebob.chatgpt.site/?view=style-references`

Project:
`appgprj_6ac1afef08191b62b95f184bf845e`

Last accepted Site:
- source `3ea2eab909f266889c8eaa4e5624ddf5970b7d89`
- version **4**
- deployment `appgdep_6ac5769bdae0819195ca516e9625d6ec`
- accepted Viewer R2: **YES · usable, not optimal**

**UPDATE EXISTING SITE ONLY.**

## Read first · minimal

1. `skills/chat/START_HERE.md`
2. `tools/asset_registry/librarian/_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/RETURN.md`
3. `tools/asset_registry/librarian/_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/STYLE_REFERENCE_LIVE_DATA_CONTRACT_2026-10-07.md`
4. `tools/asset_registry/librarian/_handover/STYLE_REFERENCE_LIBRARY_R1_2026-10-05/STYLE_REFERENCE_SITE_DELTA_DIALOGUE_NARRATION_2026-10-07.json`
5. current exact Site project/source/version

Do not reopen the accepted R2 Viewer UX.

## Canonical live-data target

Create/maintain on **main**:

`tools/asset_registry/librarian/live/style-reference-live.json`

Remote loader URL:

`https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/tools/asset_registry/librarian/live/style-reference-live.json`

This is analogous to the proven Hub live-data model.

## Initial manifest

Build a complete normalized manifest from current canonical PR #359 curation:

- **64 Etherington official**
- **5 supplementary professional/academic**
- **69 total curated built-ins**

Use current stable IDs and provenance.

Do not include private PDFs/photos/scans or private storage locators.

Include an explicit revision / updatedAt / schema.

## Site implementation

Modify only the existing Asset Librarian shell as needed:

- remote manifest fetch on Style References load/refresh;
- `cache: no-store`;
- schema validation;
- merge with existing browser-local Cards/Sets/Notes/Principles/tags/relations/inspection state;
- deployed local 69-record snapshot as fallback;
- unobtrusive freshness indicator: live vs fallback;
- fail closed to local fallback if remote JSON invalid/unreachable.

Do **not** change accepted Viewer R2 layout unless necessary for the tiny freshness indicator.

## Critical local-state rule

Remote refresh must never silently delete:
- user Cards;
- Reference Sets;
- Notes;
- Principles;
- custom tags;
- relations;
- inspected state;
- discovery candidates.

Stable built-ins merge by `referenceId` and canonical URL.

## Proof test · mandatory

After publishing the one-time loader:

1. verify Site renders the 69-record live manifest;
2. change one harmless dedicated probe/revision field in the **main live JSON only**;
3. do **not** publish Site;
4. refresh the existing Site;
5. prove the changed revision/freshness is visible/read by the Site;
6. restore/finalize probe value if temporary;
7. prove local Cards/Sets/Notes unchanged.

This is the key acceptance test.

## After this migration

Routine curation path becomes:

`Web Chat → main live JSON → verify → refresh Site`

No Work/Sites run for:
- new public curated sources;
- tags;
- use cases;
- verification/provenance metadata;
- KFB-derived notes/principles;
- board/source URLs;
- curated pack/semantic lane metadata.

Work remains necessary only for shell/behavior/schema/private-storage changes.

## Regressions

Must retain:
- accepted Viewer R2;
- board navigation / zoom;
- source isolation/export;
- Assets;
- Motions;
- Saved Sets;
- Intake;
- 3D previews;
- mobile viewer;
- page errors = 0.

## Protected boundary

No second Site.
No Viewer redesign.
No private source publication.
No Cloudflare.
No merge / Live promotion of PR #359.
Do not make live JSON a runtime code channel.

## Final Return

Return:
- exact Site project/source/version/deployment;
- exact main commit containing live manifest;
- manifest path + schema/revision;
- pre/post built-in count;
- data-only refresh proof with **no Site republish**;
- local-state persistence proof;
- regressions;
- unresolved items;
- one next gate.

## Exactly one next gate

**WEB_CHAT_DATA_ONLY_STYLE_REFERENCE_UPDATES**
