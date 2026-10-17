# WSA V-390 · Legacy tool navigation

This PR adds 572 explicit path-only HTTP 302 redirects for 158 legacy entry pages and their HTML/extensionless/index/trailing-slash aliases. Original HTML, models, JS and JSON remain unchanged. Unknown or retired modules go to one small archive notice linking to the five current places; this is not a new tool. Existing Motion Lab entry goes to ToolBox `/?tab=motion` (prepared Site v10, publication pending Georg's acceptance).

The existing `.github/scripts/build-cloudflare-pages.mjs` copies root `_redirects` into the published `.cloudflare-pages/_redirects`. A fixture run of that exact builder confirmed byte-identical copying and retention of the root and model bytes. No builder, workflow or game runtime changes.

Base: main@904f0e95968999c7e8af77cc6667161bd4f3f788. Main was selected by HTTP body hashes: all 191 accepted main HTML paths match served bytes exactly; historical cloudflare-live paths often return root fallback despite 200. Source-only references are not falsely claimed as served pages.

No root, `/index.html`, `.js`, `.json`, `.glb`, broad `/tools/*` or `/media/*` rule. `ws1/preview` is a separate untouched branch, with verified original 18,100,983-byte fallback. Path-only rules are deployment-wide, not host-scoped: do not merge this file into WS1 preview without separate review.

Validation: 572 unique rules; <=2000 static rule limit; max323 chars (<1000); no archive self-loop; Motion target and existing data exceptions checked. Independent review caught unsupported absolute source URLs before PR creation; fixed to documented relative paths. No remaining P0/P1. Cloudflare's platform parser/production behavior still needs post-merge acceptance.

Georg owns merge. Publish ToolBox v10 and old Hub v13 only after Georg accepts; then merge this PR and verify exact production URLs (Hub, Motion, Audio, Asset and one archive), plus unchanged WS1 fallback. No auto-merge or Live deployment was performed.

Inventory/WS0 handoff: Register branch, `replies/WSA_TOOL_CLEANUP_R1_RETURN.md`, `replies/WSA_TOOL_CLEANUP_R1_INVENTORY.md`, `replies/WSA_TOOL_MAP_R1_PATCH.md`.

Primary platform contract: https://developers.cloudflare.com/pages/configuration/redirects/ — relative source path; redirects override matching assets; no fragment source matching; Functions exemption. No Functions owner found for these static pages.
