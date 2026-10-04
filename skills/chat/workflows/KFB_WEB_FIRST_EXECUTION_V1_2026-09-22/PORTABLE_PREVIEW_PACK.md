# KFB Portable Preview Pack · zero-clone local review

Status: **FALLBACK REVIEW OPTION · HTML REVIEW IS DEFAULT**
Date: 2026-09-22

Purpose: let Georg test browser/game/3D slices locally **without cloning the full KFB repository**.

## Default rule

For visual/runtime slices, first prefer a single zero-install `REVIEW.html`. Use a tiny disposable preview bundle only when one HTML file is not technically reliable.

A preview pack contains only:

- the exact runtime files needed by the slice;
- exact required assets or source-pinned remote asset references;
- `REVISION.json`;
- `LOCAL_PREVIEW.md`;
- `START_PREVIEW.command` for macOS when practical;
- optional `STOP_PREVIEW.command`.

No repository history. No unrelated assets. No node_modules unless absolutely required.

## User loop

1. Web/Claude first attempts a single chat-generated `REVIEW.html`.
2. Only if that cannot reliably represent the slice, produce a tiny preview bundle.
3. Georg opens the review/bundle directly; no CLI setup is assumed.
4. Web/Claude repairs the GitHub branch from Georg's feedback.
5. Replace/delete the old review bundle after acceptance.

## Disk discipline

Target a **closed runtime roster**.

Do not copy:

- the full KFB repo;
- Git history;
- unrelated 3D asset libraries;
- duplicate source exports;
- build caches;
- `node_modules` when CDN/native browser modules suffice.

Record approximate pack size in `REVISION.json`.

## Runtime packaging

Do not require Georg to run a server.

If ES modules would make `file://` unreliable, bundle the module graph for the review artifact rather than shifting that setup burden to Georg.

If a server is genuinely unavoidable, treat it as an exception and use an already-existing capability only; do not introduce Python/Node/CLI setup as part of the feature slice.

## Artifact creation

Preferred sources, in order:

1. Web/Chat generated single `REVIEW.html`;
2. Web/Chat generated tiny review bundle;
3. GitHub Actions artifact from the exact branch/head;
4. sparse/local checkout only when the preview cannot be packaged independently.

## Acceptance language

Portable preview = `LOCAL REVIEW · NOT PUBLIC`.

It is ideal for rapid iteration and Georg feedback.

It does not replace a later `PUBLIC_VERIFIED` gate when public Stage acceptance is actually required.
