# KFB WS1 Staging R1

Owner: WSA delivery adapter. Runtime owner remains WS1, `georg-doc/kayfabizarro` / `ws1/preview`.

Private Sites frontend + server-side R2 archive. Polling is request-driven: opening the Site synchronizes it; while open it checks every 15 seconds. No schedule, webhook, Cloudflare Pages deployment or WS1 source mutation.

`/api/status` reads raw branch build.json with cache-busting; only a changed qualified manifest triggers GitHub commit resolution and immutable bundle archival. Exact SHA is the transport identity, distinct from the WS1 commit label. Full bundle lands before the catalog changes. Test strings, passed/total objects and explicit pass-result arrays are supported. Unknown array shapes fail closed. Absolute WS1 Cloudflare hashes become same-Site bundle URLs.

R1 adapter limits (not claimed platform maxima): 25 MiB per file, 100 MiB per bundle, 250 dist files. Last five qualified catalog entries are selectable, with initial history backfill from build.json commits. Only two qualified manifest revisions currently exist. Older immutable archived objects remain stored so already-open games keep resolving assets. No premature garbage collection.

Concurrent catalog updates use R2 conditional ETags. Initial bundle upload failures cannot replace a known-good catalog. Bad metadata, zero or failed tests, missing stage target and unapproved entry paths are rejected. Failed upstream checks retain previous builds and are throttled for 10 seconds. External game assets remain source-hosted and are not captured in bundle snapshots.

Future saves/configuration/kfb.world/1: Sites supports D1 structured records and R2 JSON/files. This delivery adapter does not inject a save API into WS1 or change existing localStorage behavior. A later WS1-owned integration must use authenticated user IDs, schema versions and explicit import/export semantics.

Validation: `node --experimental-strip-types tests/contracts.mjs`; standard Sites build. Human product acceptance and final game Live promotion remain Georg's authority. Private staging publication is only the test surface.
