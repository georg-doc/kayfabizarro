# KFB Sites · Game & Tool Platform P0 · 2026-09-28

Status: PLANNED / BOUNDED IMPLEMENTATION BRIEF
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
- **KFB-Site-Drop** — future Site action for Georg to upload a return ZIP/JSON/screenshot and create an intake record. Do not use this name as though it exists until P0 is browser-tested.
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

## P0A · first real implementation

Implement in the existing KFB Production Control Site, preserving its approved design:

1. optional Sign in with ChatGPT;
2. one **Playtest & Intake** panel reachable from the existing Hub;
3. save one user-owned playtest report in D1;
4. attach one screenshot or JSON/ZIP file in R2;
5. show the saved record after reload and in a compact history;
6. export a small `kfb.site-intake/1` JSON receipt with stable record id, checksum and canonical owner target;
7. handle storage failure without losing the typed report;
8. include a visible privacy/retention note and delete action.

The first proof uses a World M2 or Combat session, not dummy data.

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

Exactly one next gate: implement **P0A · one authenticated playtest report plus one attachment** in the existing KFB Production Control Site, save a review version first, and deploy only after the storage/auth behavior is verified.
