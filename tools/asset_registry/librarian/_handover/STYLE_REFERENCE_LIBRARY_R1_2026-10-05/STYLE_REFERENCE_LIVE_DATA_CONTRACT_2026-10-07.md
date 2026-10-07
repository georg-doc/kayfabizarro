# KFB Style Reference Librarian · Shell / Live Data Contract · 2026-10-07

Status: **PROPOSED BINDING MIGRATION TARGET**
Owner: **KFB Asset Registry / Asset Librarian**
Human authority: **Georg**

## Goal

Stop requiring ChatGPT Work/Sites publication for routine Style Reference data updates.

Target operating model:

```
ChatGPT Web Chat
  → update main/tools/asset_registry/librarian/live/style-reference-live.json
  → verify exact main head + file
  → user refreshes existing Asset Librarian Site
```

No Work/WSA or Sites publish for data-only changes.

## Layer split

### A · Stable deployed shell / behavior
Owns:
- Style Reference Browser/Viewer R2;
- search/filter UI;
- board viewer/zoom/navigation;
- local Cards/Sets/Notes/Principles;
- source-isolation gate;
- import/intake behavior;
- live-data loader;
- fallback/merge logic.

Changes here may require Work/Sites publication.

### B · GitHub live curated data
Canonical target:
`main/tools/asset_registry/librarian/live/style-reference-live.json`

Remote URL:
`https://raw.githubusercontent.com/georg-doc/kayfabizarro/main/tools/asset_registry/librarian/live/style-reference-live.json`

Owns only public/shareable curated reference data:
- reference/source IDs;
- titles;
- creators/collections;
- canonical public source URLs;
- public creator-hosted visual URLs/board URLs where already resolved;
- subjects/techniques/use cases;
- provenance/source class;
- verification;
- KFB research-derived notes/principles explicitly marked as derived;
- related curated pack IDs / semantic lanes where useful.

Must not contain:
- private PDFs/photos/scans;
- private purchased source binaries;
- browser-local personal notes unless explicitly promoted as public curated metadata;
- credentials;
- private Dropbox/storage locators.

### C · Deployed local fallback data
The Site ships a local snapshot of the last accepted live manifest.

If remote fetch fails:
- render fallback;
- visibly mark fallback/stale state;
- never clear local user state.

### D · Browser-local state
Preserve existing storage keys/behavior for:
- user-created Cards;
- Reference Sets;
- Notes;
- Principles;
- custom tags;
- asset/reference relations;
- inspected state;
- discovery candidates.

Remote refresh merges by stable ID / canonical URL and must never silently delete local user records.

## Loader rules

On Style References open/refresh:

1. fetch remote live JSON with `cache: no-store`;
2. validate schema/version;
3. if valid, use as built-in curated corpus;
4. merge browser-local user state;
5. if invalid/unavailable, use deployed local fallback;
6. surface freshness/source status unobtrusively.

Remote data must never execute code.

## Data-only definition

A change is **DATA-ONLY** when only:
`main/tools/asset_registry/librarian/live/style-reference-live.json`
changes.

Data-only changes must not require:
- Work/WSA;
- Sites publication;
- Asset Librarian source editing;
- ToolBox/Hub publication.

## Current migration payload

Current repo-curated source truth on PR #359:
- 64 Etherington official sources;
- 5 supplementary professional/academic sources;
- **69 total curated records**.

Prepared 11-record delta from accepted Site Version 4 / 58 built-ins:
`STYLE_REFERENCE_SITE_DELTA_DIALOGUE_NARRATION_2026-10-07.json`

Work should build the first complete 69-record live manifest from the current canonical seed/delta state, not merely append blindly.

## Future Web Chat rule

For routine source curation:
1. update canonical research/seed files as needed;
2. update the live manifest projection on `main`;
3. verify exact main head + manifest;
4. no Site publish;
5. user refreshes Librarian.

The live manifest is a **projection**, not a second source-of-truth for research history.

## Work still required when

- loader/data contract changes;
- Browser/Viewer behavior changes;
- local-state schema changes;
- new private-storage adapters are added;
- security/auth changes;
- structural UI changes.

## Boundary

No second Site.
No public publishing of private source imagery.
No remote JS execution.
No merge of PR #359 required solely to establish the live-data projection.
No Cloudflare substitute.
