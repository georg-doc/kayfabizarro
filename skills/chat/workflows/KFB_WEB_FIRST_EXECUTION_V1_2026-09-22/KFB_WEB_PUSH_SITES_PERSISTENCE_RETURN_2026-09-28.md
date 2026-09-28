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
- P0A owner hardening is implemented: list, download and delete are scoped to the signed-in owner; delete also removes matching R2 objects and D1 file rows.
- The former browser-only Pocket Inbox is replaced in the existing Site by the authenticated D1/R2 **Production Inbox**. Local legacy entries remain available in a collapsed rescue area for one-time re-upload.
- The browser-local `visuelle Grammatik für Fahrbahnmarkierungen.md` was visibly present locally but absent from the server inbox. It is therefore preserved, not falsely reported as synchronized.
- Animation Library Production-05 is **PASS → UI/UX TUNE**: 204 clips, 24/24 checks. Added the binding quiet-status/full-preview/complete-inline-editor standard; no rebuild was started.
- The remaining product gate is one real local-file upload/readback, followed later by the compact World M2/Combat playtest report and portable `kfb.site-intake/1` receipt.
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
- `skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/KFB_UI_DENSITY_INLINE_EDITOR_STANDARD_2026-09-28.md`
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

- Site source commit: `d171330bf2f27d1e96427320a529c1c63abb2b41`
- Site project: `appgprj_6ab82e3950b88191a8ead3c495e21454`
- Saved/deployed version: `appgprj_6ab82e3950b88191a8ead3c495e21454~appgver_3179bac9896481919d28c90dafa85ac6`
- Deployment: `appgdep_6aba2fa569588191897a63fc4580ccb2` — succeeded.
- Production build: all five build stages passed; `git diff --check` passed.
- Public browser proof: the exact Site URL was reloaded and visibly showed **Production Inbox**, `1 synchronisiert`, the authenticated system-check record, the legacy rescue disclosure and **Animation Library V1 · PASS → TUNE**.
- WebMCP server readback contained the synchronized system-check record but not `visuelle Grammatik für Fahrbahnmarkierungen.md`; this proves the user file is still local-only rather than silently synchronized.
- No replacement Hub, duplicate Site, merge or Cloudflare promotion was created.

Documentation checks: required headings and links were read back from GitHub; official OpenAI Sites documentation was rechecked on 2026-09-28.

## Known external status

Cloudflare reported a failed preview build for the earlier documentation head `b2f52f2...`. This branch has no Cloudflare Stage route and no Cloudflare publication outcome; the failure is not retried or promoted as part of this workflow slice.

The deployed Site now exposes owner-scoped Production Inbox reads, downloads and deletion. It is not yet classified as a complete multi-user playtest backend until a real attachment roundtrip, cross-user isolation and the explicit playtest-report receipt are proven.

Exactly one next gate: in the same Chrome profile that owns the legacy entry, upload **`visuelle Grammatik für Fahrbahnmarkierungen.md`** once through **Datei dauerhaft ablegen**; then verify its authenticated record and downloadable bytes before extending the schema.
