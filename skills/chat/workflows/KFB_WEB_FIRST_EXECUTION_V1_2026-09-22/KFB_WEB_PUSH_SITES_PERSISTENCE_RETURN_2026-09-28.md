# KFB Web Push · Sites persistence · RETURN · 2026-09-28

Owner: Georg / KFB Web-First execution lane
Branch: `chatgpt-web/kfb-web-push-sites-persistence-2026-09-28`
PR: #276
Outcome: bind executor-specific delivery, register `KFB-Web-Read` / `KFB-Web-Push`, and define one concrete existing-Site persistence proof without creating another Hub or runtime owner.
Stage route: none; documentation/workflow slice only.

## Result

- `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md` now distinguishes GitHub-capable Web/Work/Codex chats from Claude Design and Blender MCP.
- `FRESH_CHAT_SLICE_PROTOCOL.md` requires the executor to be classified before a brief is written.
- Claude Design and Blender receive a closed input package and return a complete package. They are not assigned commit/push/PR/hidden-repository/Hub duties unless a verified connector exists.
- `KFB-Web-Read` means a bounded task/source packet. `KFB-Web-Push` means a verified GitHub write by a GitHub-capable executor.
- Added `KFB_SITES_GAME_TOOL_PLATFORM_P0_2026-09-28.md` for the existing KFB Production Control Site.
- P0 covers D1 records, R2 uploads, optional Sign in with ChatGPT, playtest/error reports, task packets, tool JSON and later player/NPC/world state.
- Existing HUB-CTRL / Production Desk and GitHub owner truth remain unchanged. No second status database or Hub was introduced.
- No merge, Cloudflare Stage publication, Sites deployment or Live promotion was performed.

## Changed files

- `skills/chat/START_HERE.md`
- `skills/chat/CHANGELOG.md`
- `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
- `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
- `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/KFB_WEB_PUSH_SITES_PERSISTENCE_2026-09-28.md`
- `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/KFB_SITES_GAME_TOOL_PLATFORM_P0_2026-09-28.md`
- this Return

## Verified checkpoints

1. `bde7162b1bb827d62c22e89f8960676f4e468ff8` — executor matrix written and read back.
2. `bc5d8930c63fa1e96cf6edb2315d2aeb7f8246d1` — fresh-chat routing rule written and read back.
3. `77553ee32c5b7e586c3e49898d89d9bae701e841` — P0 product brief created and read back.
4. `de6123c36aec5b7b10c8830a2ee425d24189ebb0` — Web Read/Push semantics and P0 gate written and read back.
5. `25e7cc3b62bffc7495de55cb32e37523447d5275` — router entries written and read back.
6. `a0c8828415576b5ff641e9be5be3c4b5187d455f` — additive changelog written and read back.

Documentation checks: required headings and links read back from GitHub; official OpenAI Sites documentation rechecked on 2026-09-28. Runtime/browser/Stage tests: 0 by design.

## Known external status

Cloudflare reported a failed preview build for the earlier documentation head `b2f52f2...`. This branch has no Stage route and no publication outcome; the failure is not retried or promoted as part of this documentation slice.

Exactly one next gate: implement **P0A** in the existing KFB Production Control Site — one authenticated user-owned World M2 or Combat playtest report in D1 plus one screenshot/JSON/ZIP attachment in R2. Save a review version first; deploy only after auth, reload, ownership and delete behavior are verified.
