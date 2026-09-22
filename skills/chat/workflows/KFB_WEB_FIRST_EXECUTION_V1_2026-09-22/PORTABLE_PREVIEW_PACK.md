# KFB Portable Preview Pack · zero-clone local review

Status: **CURRENT LOCAL REVIEW OPTION**
Date: 2026-09-22

Purpose: let Georg test browser/game/3D slices locally **without cloning the full KFB repository**.

## Default rule

For visual/runtime slices, prefer a tiny disposable preview bundle over a full local checkout.

A preview pack contains only:

- the exact runtime files needed by the slice;
- exact required assets or source-pinned remote asset references;
- `REVISION.json`;
- `LOCAL_PREVIEW.md`;
- `START_PREVIEW.command` for macOS when practical;
- optional `STOP_PREVIEW.command`.

No repository history. No unrelated assets. No node_modules unless absolutely required.

## User loop

1. Web/Claude produces a GitHub branch and a portable preview artifact.
2. Georg downloads/unzips the pack to a temporary folder, e.g. `~/Downloads/KFB-Preview/<slice>/`.
3. Double-click `START_PREVIEW.command` or run the documented one-liner.
4. Browser opens `http://127.0.0.1:<port>/...`.
5. Georg reviews the visible/interactable result.
6. Web/Claude repairs the GitHub branch.
7. Replace/delete the old preview folder and test the next pack.
8. Delete the folder after acceptance.

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

## Server

Never rely on `file://` for ES-module/Three.js applications.

Prefer the smallest available local HTTP server.

Example macOS launcher:

```bash
#!/bin/bash
cd "$(dirname "$0")"
PORT=4176
python3 -m http.server "$PORT" &
PID=$!
echo "$PID" > .preview.pid
open "http://127.0.0.1:$PORT/"
wait "$PID"
```

If Python is unavailable, document one existing project-local alternative. Do not install a development stack merely to preview a slice.

## Artifact creation

Preferred sources, in order:

1. Web/Chat generated ZIP artifact;
2. GitHub Actions artifact from the exact branch/head;
3. small release/preview folder downloaded from GitHub;
4. sparse/local checkout only when the preview cannot be packaged independently.

## Acceptance language

Portable preview = `LOCAL REVIEW · NOT PUBLIC`.

It is ideal for rapid iteration and Georg feedback.

It does not replace a later `PUBLIC_VERIFIED` gate when public Stage acceptance is actually required.
