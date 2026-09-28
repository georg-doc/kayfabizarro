# KFB Web Push · Sites persistence · RETURN · 2026-09-28

Owner: Georg / KFB Web-First execution lane
Branch: `chatgpt-web/kfb-web-push-sites-persistence-2026-09-28`
PR: #276
Outcome: bind executor-specific delivery, register `KFB-Web-Read` / `KFB-Web-Push`, inspect the existing KFB Production Control persistence foundation and define one bounded hardening proof without creating another Hub or runtime owner.
Cloudflare Stage route: none; documentation/workflow slice only.
Existing Sites surface: `https://kfb-production-control.frizzlebob.chatgpt.site/`

## Result

- `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md` now distinguishes GitHub-capable Web/Work/Codex chats from Claude Design and Blender MCP.
- `FRESH_CHAT_SLICE_PROTOCOL.md` requires the executor to be classified before a brief is written.
- Claude Design and Blender receive a closed input package and return a complete package. They are not assigned commit/push/PR/hidden-repository/Hub duties unless a verified connector exists.
- `KFB-Web-Read` means a bounded task/source packet. `KFB-Web-Push` means a verified GitHub write by a GitHub-capable executor; it never silently implies merge, deployment or Live promotion.
- Added `KFB_SITES_GAME_TOOL_PLATFORM_P0_2026-09-28.md` for the existing KFB Production Control Site.
- Recon proved that the existing Site already has D1 and R2 bindings, authenticated intake, note/link/JSON input, file upload, SHA-256 receipts, reloadable history, export and model-context tools. P0 therefore hardens and adapts the existing foundation instead of rebuilding it.
- The remaining safety gap is explicit: record lists/downloads/mutations must be scoped to the signed-in owner; owner delete and R2 cleanup must be added before broader playtests.
- P0A is narrowed to one compact World M2/Combat playtest-report flow using the existing upload path and a portable `kfb.site-intake/1` receipt.
- Existing HUB-CTRL / Production Desk and GitHub owner truth remain unchanged. No second status database or Hub was introduced.
- The existing approved KFB Production Control Site was updated in place with a visible **KFB Sites P0A · Playtest & Übergaben** card. No replacement design or second Site was created.
- No merge and no Cloudflare Stage/Live promotion occurred.

## Changed GitHub files

- `skills/chat/START_HERE.md`
- `skills/chat/CHANGELOG.md`
- `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
- `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
- `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/KFB_WEB_PUSH_SITES_PERSISTENCE_2026-09-28.md`
- `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/KFB_SITES_GAME_TOOL_PLATFORM_P0_2026-09-28.md`
- this Return

## Verified GitHub checkpoints

1. `bde7162b1bb827d62c22e89f8960676f4e468ff8` — executor matrix written and read back.
2. `bc5d8930c63fa1e96cf6edb2315d2aeb7f8246d1` — fresh-chat routing rule written and read back.
3. `77553ee32c5b7e586c3e49898d89d9bae701e841` — P0 product brief created and read back.
4. `de6123c36aec5b7b10c8830a2ee425d24189ebb0` — Web Read/Push semantics and P0 gate written and read back.
5. `25e7cc3b62bffc7495de55cb32e37523447d5275` — router entries written and read back.
6. `a0c8828415576b5ff641e9be5be3c4b5187d455f` — additive changelog written and read back.
7. `ac661b33db04a3479f7c9590b0ebc9bab2535acd` — P0 brief corrected from greenfield build to hardening of the inspected D1/R2 foundation.
8. `93eca0c07aae37a4c34840435ef6becca400932d` — persistence brief aligned to the same bounded P0A gate.

## Existing Site update and proof

- Site source commit: `cfbbc12cdd52ec75c297046bce17df0f05eb329e`
- Site project: `appgprj_6ab82e3950b88191a8ead3c495e21454`
- Saved/deployed version: `appgprj_6ab82e3950b88191a8ead3c495e21454~appgver_5db0cac49f10819194cc490d589ac8fd`
- Deployment: `appgdep_6aba2455423c8191a360bb3929fabf5b` — succeeded.
- Local production build: all five build stages passed.
- Public browser proof: the exact Site URL was reloaded and the new card text `KFB Sites P0A · Playtest & Übergaben` was visibly present.
- Packaging recovery: the first packaging call lacked the bundled Node path; the source remained intact, the corrected retry succeeded, and no duplicate Site was created.

Documentation checks: required headings and links were read back from GitHub; official OpenAI Sites documentation was rechecked on 2026-09-28.

## Known external status

Cloudflare reported a failed preview build for the earlier documentation head `b2f52f2...`. This branch has no Cloudflare Stage route and no Cloudflare publication outcome; the failure is not retried or promoted as part of this workflow slice.

The deployed Site currently exposes the existing authenticated inbox foundation. It is not yet classified as a multi-user playtest backend until P0A proves owner isolation, download isolation, deletion and attachment cleanup.

Exactly one next gate: implement **P0A** in the existing KFB Production Control Site — harden user ownership and deletion, then add one authenticated World M2/Combat playtest report using the existing R2 upload flow. Prove reload, download isolation, deletion and a portable `kfb.site-intake/1` receipt in the deployed Site.
