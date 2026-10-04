# Asset Librarian GPT Site · Source / Donor Evidence

Status: **PREP EVIDENCE · NO RUNTIME CHANGE**  
Date: 2026-10-04  
Workflow: `WSA-ASSET-LIBRARIAN-GPT-SITE-01`

## Current owner baseline

Repository: `georg-doc/kayfabizarro`  
Main at slice start: `ffeb161d7c09c64436fbdf1dc83ce2b71e8f8a74`

Current Librarian source:
`tools/asset_registry/librarian/`

Existing compatibility/public surface:
`https://kayfabizarro.pages.dev/asset-librarian/`

This preparation slice does not modify that runtime or publication.

## Main Librarian facts recovered

Current main UI identifies itself as v1.7 and already contains:
- Live / Canonical Registry modes;
- global asset search;
- type / format / dependency / review / rig / animation / clip / joint filters;
- list/gallery result views;
- 3D, image and audio preview;
- persistent Selection Tray;
- candidate-only consumer handoff;
- Assets / Actors / Rigs / Motions / FX production-resource scopes.

The current UI is therefore a functional donor, not a blank-slate replacement target.

## Current Return / changelog caveat

`tools/asset_registry/librarian/RETURN.md` still begins with the old v1.2 WSA return.

The central Recovery explicitly warns not to infer current version from README/RETURN alone. This new handoff therefore records current main + current code + current donor evidence directly.

## PR #304 frozen donor

Draft PR: `#304`  
Branch: `chatgpt-web/asset-librarian-collections-motion-preview-2026-10-01`  
PR status: frozen partial candidate; do not merge as-is.

Frozen implementation pin:
`545853924c4c177b6e26af588020b7a59307bb71`

Proven reusable core recorded by that recovery:
- KayKit as a real Registry family filter;
- Family → Pack → Collection browsing;
- Tiny Treats = 8 packs in tested Registry;
- Bubbly Bathroom → Assets = 86 tested candidates;
- Motion → real preview actor → existing binding/playback path;
- prior v1–v1.7 browser regressions stayed green.

Stopped / excluded:
- new motion Scrub control failed after two focused repair passes;
- no third repair;
- new transport bar is not a Site donor.

## Dropbox read-only reconnaissance

The connected Dropbox search for `Asset Librarian` found:
- historical WSA handover ZIPs from 2026-09-12;
- a v1.2 Site Core briefing ZIP;
- local/Codex mirrors of repository docs;
- a 2026-10-02 local Git branch log/ref for the PR #304 branch;
- older project copies and review evidence.

Interpretation:
- Dropbox is useful as an optional source/intake channel;
- it does not contain a newer authoritative Librarian/Registry SSOT than current GitHub;
- no Dropbox mutation is required for this Site-preparation slice.

## What was not tested in this slice

No runtime source changed.

Therefore no new browser/WebGL regression was run and no public route was republished.

This slice verifies planning/source reconciliation only:
- current main owner recovered;
- existing UI surfaces read;
- frozen PR #304 donor/recovery read;
- Dropbox source role checked;
- new GPT Site + shared Picker contract written on a fresh branch.

## WSA source pins

Primary owner:
`main@ffeb161d7c09c64436fbdf1dc83ce2b71e8f8a74`

Site-prep branch:
`chatgpt-web/asset-librarian-gpt-site-prep-2026-10-04`

Green product-core donor:
`PR #304 frozen implementation @ 545853924c4c177b6e26af588020b7a59307bb71`

Do not use the later PR #304 recovery-doc head as proof that the frozen transport defect was fixed.

## Next gate

`WSA-ASSET-LIBRARIAN-GPT-SITE-01`

Build the GPT Site from the current owner and verified donor subset. Return the Site link, source/handoff, and one reviewable Phase-A Browse + Saved-Set slice.
