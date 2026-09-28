# KFB Sites · Game & Tool Platform P0 · 2026-09-28

Status: P0A OWNER HARDENING DEPLOYED · REAL LEGACY FILE MIGRATION PENDING
Owner: HUB-CTRL / existing KFB Production Control Site
Source workflow: `KFB_WEB_PUSH_SITES_PERSISTENCE_2026-09-28.md`
Current Site: https://kfb-production-control.frizzlebob.chatgpt.site/
No new Hub or visual design.

## Product intent

Use the existing KFB Production Control Site as the single human working surface for production and early game testing:

- open current playable MVPs and tools;
- read the current brief and plain-language next action;
- save decisions and test notes between visits;
- upload JSON, ZIP, screenshots and error reports;
- keep user-specific game progress and playtest sessions;
- hand closed task packets to Claude Design / Blender MCP without assuming GitHub access;
- let a GitHub-capable receiving chat ingest accepted results into the canonical owner.

The Site is the cockpit and transfer surface. GitHub remains canonical source/asset/SSOT/Return truth until a named owner explicitly adopts a Site data record.

## Verified platform capabilities

Official OpenAI Sites documentation checked on 2026-09-28 supports:

- durable structured records and game progress in D1;
- file uploads in R2, with searchable metadata in D1;
- optional Sign in with ChatGPT for public identity-aware features;
- saved Site versions separate from deployment;
- server-side environment variables/secrets;
- normal HTTP/HTTPS and WebSocket access.

Current documented limits/boundaries:

- D1: 10 GB per Site;
- R2: no fixed storage limit in the current documentation;
- every deployed Site URL is production; review-only work must be saved without deployment;
- no data or inference residency at launch;
- no protected health information or payment-card data;
- the Site operator remains responsible for privacy notice, data minimisation, retention and deletion behavior.

Official source: https://learn.chatgpt.com/docs/sites

## Executor contracts

### GitHub-capable Web / Work / Codex

Input: `KFB-Web-Read` plus exact owner/repo/branch/head.
Output: implementation and evidence written directly through `KFB-Web-Push`, then exact read-back.

### Claude Design

Claude Design receives no fake GitHub duties.

Input must be one closed task packet containing:

- human brief and machine brief;
- exact accepted assets/donors;
- local/public source files actually needed;
- source manifest and checksums;
- acceptance views and stop conditions.

Output must be one complete downloadable return package. When a tested Site intake exists, Georg may upload that return package through the Site. A GitHub-capable receiving chat then validates and ingests it.

### Blender MCP / local asset authoring

Use the same closed packet and return package. Raw licensed files stay in their approved local/Dropbox scope. Runtime derivatives, catalogs, measurements and evidence may be uploaded or ingested.

## Proposed Site vocabulary

- **KFB-Web-Read** — open a stable, bounded task packet; read-only and safe for a fresh executor.
- **KFB-Web-Push** — GitHub-capable executor persists accepted production state in the canonical owner.
- **KFB-Site-Drop** — the deployed authenticated Production Inbox for durable text/JSON/ZIP/screenshot intake. A record is intake evidence, not canonical GitHub truth before owner ingestion.
- **KFB-Site-Report** — future in-game/tool action that stores a playtest note, runtime state, console/error summary and optional screenshot.

## Target data shape

D1 structured records:

- `users` / platform user key;
- `work_items` with owner, slice, status and canonical GitHub source;
- `decisions` with PASS/TUNE/FAIL, note and source revision;
- `playtest_sessions` with runtime, build, device, controls and performance summary;
- `reports` with severity, repro steps, position/state and linked screenshot;
- `task_packets` with bounded brief, source manifest, audience and expiry/archive state;
- `file_records` with ownership, type, checksum, R2 key and ingestion status;
- later, game-owned `player_progress`, `world_state` and bounded NPC-memory records.

R2 file objects:

- JSON exports from rigs, Resident Atlas, WorldBuilder, Racer and Combat;
- ZIP return packages;
- screenshots and compact browser evidence;
- user-approved runtime asset uploads;
- generated exports.

Do not store canonical licensed source packs in public R2 merely for convenience.

## Existing foundation already present

The current KFB Production Control Site already has:

- D1 and R2 bindings;
- ChatGPT-authenticated Production Inbox writes;
- persistent note, link and JSON records;
- ZIP/JSON/screenshot uploads with extension/size checks and SHA-256 metadata;
- reloadable history and downloadable attachments;
- browser-context tools for listing and creating Production Inbox records.

Do not rebuild those capabilities.

## P0A · deployed owner-safe Production Inbox

Implemented in the existing Site without a second Hub or replacement design:

- list, file download and delete are scoped to the authenticated `createdBy` owner;
- deleting a record also removes its matching R2 objects and D1 file rows;
- the former local-only Pocket Inbox is now the authenticated D1/R2 **Production Inbox**;
- note/JSON/file intake, export and delete are visible in the current Site;
- old browser-local entries remain in a collapsed **legacy rescue** area so they can be downloaded or uploaded once instead of silently disappearing;
- the Site build passed all five production stages and the deployed URL visibly shows the synchronized inbox;
- Animation Library V1 is recorded as **PASS → TUNE**, with 204 clips and 24/24 checks; its UI tune is governed by `KFB_UI_DENSITY_INLINE_EDITOR_STANDARD_2026-09-28.md`.

Important migration fact: the user’s `visuelle Grammatik für Fahrbahnmarkierungen.md` was verified in browser-local storage but was not present in the authenticated server inbox. Browser-local bytes cannot be migrated server-side without one upload from the browser that owns them. This is preserved as a visible rescue step, not reported as synchronized.

Still open before multi-user playtesting:

- upload the real local Fahrbahnmarkierungen file once through the new durable Production Inbox and verify its server record;
- add the explicit World/Combat playtest schema, build/state fields and portable `kfb.site-intake/1` receipt;
- prove a real attachment reload/download/delete roundtrip and cross-user isolation;
- expose a stable closed task-packet route for Claude Design / Blender MCP. Browser-context tools alone are not a provider bridge.

The first playtest proof must use a real World M2 or Combat session, not dummy data.

## Later bounded slices

- **P0B · Decisions:** replace browser-only Hub decision state with user-owned D1 records and JSON export.
- **P0C · Task packets:** generate a stable `KFB-Web-Read` packet page and downloadable closed ZIP for Claude Design/Blender.
- **P0D · Tool JSON:** save/version FB rig, Resident scene, WorldBuilder, Motion Library editorial patches and track recipes.
- **P0E · Game memory:** player progress, lean NPC interaction memory, scores and run history.
- **P0F · Assisted triage:** optional server-side LLM summary/tagging via an OpenAI API key stored as a Site secret. LLM calls are not automatic Sites functionality and must never expose the key client-side.

## Acceptance for P0A

PASS only when the production Site visibly proves:

- sign-in/anonymous behavior is intentional;
- one real report survives reload;
- its attachment downloads correctly;
- another user cannot read or mutate the record without authorization;
- delete works;
- exported receipt identifies the correct KFB owner;
- no GitHub/SSOT claim is made before ingestion;
- existing Hub, quick links and slice pages still work.

No Cloudflare mirror or second Hub is created for this proof.

Exactly one next gate: in the same browser that owns the legacy entry, upload **`visuelle Grammatik für Fahrbahnmarkierungen.md`** once through the deployed Production Inbox; then verify its authenticated server record and file roundtrip before adding the World/Combat report schema.
