# Cloudflare Gate · 2026-10-09

## Follow-up resolution · 2026-10-10

The earlier gate below described the repository before the public-asset boundary existed. The root URL layout is intentionally preserved, while a root `.assetsignore` now excludes repository-internal documentation, `_inbox`, handovers and editable authoring formats from the Cloudflare asset upload.

- tracked tree: 25,137 files;
- ignored by public asset rules: 5,805 files;
- deployable upper bound: 19,332 files;
- Wrangler 4.149.0 dry-run: PASS;
- no file is deleted from GitHub, and nothing under `tools/KFB-ToolBox/_inbox/` is modified.

This resolves the 20,000-file gate while preserving existing public routes. A successful GitHub/Cloudflare deployment remains the final external proof after merge.

## Finding

The condition for opening a full `sync/lab-rkit-2026-10-09` → `main` PR is **not met**.

- `main@909828efa85a2f85584cb47d6a7cee3fd37989bd` contains exactly **24,995 tracked files**.
- Repository `wrangler.jsonc` declares `assets.directory: "."`, so the repository-configured Cloudflare asset root is the repo root.
- Cloudflare Pages check `113888829066` for that head completed on 2026-10-09 with conclusion **failure** and summary **Build failed**.
- The separate GitHub Pages `deploy` check `113824770557` succeeded, but it is not the Cloudflare deployment.
- `https://kayfabizarro.pages.dev/` returns an older site and therefore does not prove the current main revision deployed.
- The authenticated Cloudflare dashboard build log was unavailable, so the exact build-error cause is not asserted.

## Decision

Do not treat the 20k concern as disproved and do not open the full sync-branch PR under the user's conditional instruction. This Deck Library slice remains a separate bounded PR candidate.

No files under `tools/KFB-ToolBox/_inbox/` were removed or modified.
