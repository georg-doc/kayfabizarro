# KFB Web Push · ChatGPT Sites persistence · 2026-09-28

Status: CURRENT WORKFLOW DECISION / P0 IMPLEMENTATION PLANNED
Owner: Georg / KFB Web-First execution lane
Branch: `chatgpt-web/kfb-web-push-sites-persistence-2026-09-28`
Stage route: none; documentation / workflow slice only

## Shortcut

`KFB-Web-Push` is the user shorthand for the existing crash-safe Web/GitHub production action:

1. recover the current owner/SSOT and exact GitHub branch/head;
2. persist the current decision, result, implementation note or recovery state in that existing owner surface;
3. update Return/changelog/router/Hub metadata when the owner contract requires it;
4. fetch the exact branch head and intended files after every write;
5. treat timeouts as `UNKNOWN` and inspect before retrying;
6. do not merge, promote Live or publish a Site merely because a push was requested.

This is a shortcut, not a second runtime owner and not a replacement for `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`.

## Two shortcuts, different meanings

- `KFB-Web-Read`: assemble or open the bounded source packet for the named task. It may be a GitHub ref for a GitHub-capable executor or a closed/public Site packet for Claude Design/Blender.
- `KFB-Web-Push`: a GitHub-capable executor writes and verifies the durable production checkpoint in the existing owner.

Neither shortcut implies merge, deployment or Live promotion.

Claude Design and Blender MCP are never assigned GitHub maintenance unless a verified connector is explicitly available. Their normal contract is closed input package -> complete return package -> GitHub-capable ingestion.

The concrete Site product plan is:
`skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/KFB_SITES_GAME_TOOL_PLATFORM_P0_2026-09-28.md`.

## Verified ChatGPT Sites capability

Official OpenAI documentation checked on 2026-09-28:

- Sites is a public-beta hosted runtime for websites, web apps and games.
- A Site is persistent and can be reopened, refined, versioned and deployed.
- D1 is the relational database option for durable structured data. OpenAI explicitly lists saved records, user progress and game scores as D1 use cases.
- R2 is object storage for images, documents, audio, video and other uploaded files.
- D1 + R2 can be combined when uploaded files need searchable metadata.
- `Sign in with ChatGPT` can provide identity-aware features such as saved progress or person-specific records.
- documented storage limits: D1 10 GB per Site; R2 has no fixed storage limit in the current Sites documentation.
- every Sites deployment URL is a production deployment; save a version without deploying when review-only state is intended.
- Sites does not support data/inference residency at launch, including deployed Site code, D1/R2 data, artifacts and logs.
- Sites must not be used for Protected Health Information or payment-card data.

Official sources:
- https://learn.chatgpt.com/docs/sites
- https://help.openai.com/en/articles/20001339-creating-and-managing-chatgpt-sites

## KFB implications

Treat Sites persistence as an OPTIONAL runtime capability, not as automatic migration of current KFB owners.

Good candidate data for a future KFB game Site:
- player save/progress state;
- discovered cards / Fractal Almanac progression;
- game scores and challenge results;
- per-user world or quest state;
- bounded resident/NPC memory records where the receiving runtime explicitly adopts that storage owner;
- user-created or uploaded runtime assets in R2, with metadata in D1 when useful.

Do not move these merely because Sites supports them:
- canonical source/assets from GitHub / Asset Librarian;
- project SSOT, Returns, Recovery or changelog truth;
- cross-project owner contracts;
- Cloudflare KFB Stage acceptance routes.

The existing private KFB Hub Sites mirror on Draft PR #217 remains a distribution mirror only. Its current Return is `tools/production_desk/SITES_MIRROR_RETURN_2026-09-26.md`; HUB-CTRL / Production Desk remains the Hub owner.

## Architecture rule

For future game persistence, use the smallest owner-compatible seam:

`game runtime -> server-side Site route -> D1/R2`

Identity-aware state may key records to the authenticated Site user when the product requires it. Keep authorization in server-side code. Do not expose secrets or trust client-only identity fields.

## Current decision

DECISION: register Sites persistence as a supported KFB exploration path and register `KFB-Web-Push` as the shorthand for GitHub-first crash-safe persistence.

NOT DECIDED: replacing Cloudflare hosting, migrating the main game runtime to Sites, moving canonical assets to R2, or making D1 the global KFB database.

Exactly one next gate: implement P0A in the existing KFB Production Control Site — one authenticated, user-owned World M2 or Combat playtest report in D1 plus one screenshot/JSON/ZIP attachment in R2, saved as a review version before deployment.
