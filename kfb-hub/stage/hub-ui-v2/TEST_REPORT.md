# KFB Hub UI v2 · current-state correction test report

Status: **STATIC 6/6 PASS · PUBLIC VERIFICATION PENDING**
Date: 2026-09-28
Source workflow: PR #269 @ `5dc4618e860ac695b7a2785c13aaacdad53ea5fa`
Source runtime: `work/kfb-hub-paper-dark-previews-2026-09-20@90e7d4fee3d874271a9dffd89839d240d1de37a0`
Evidence head: `b12fbb93f1e4721a2db76b0709855ba0b307db40`
Publication head: `cloudflare-live@78f0af6e0aa24e4489fe8ab0e3d52656b4832a90`

Static contract: **18/18 PASS** on the original Hub UI v2 suite. The Stage wrapper additionally preserves same-route hash navigation and keeps the Paper/Dark toggle visible.

Public observation:
- exact Cloudflare route renders;
- Stage / Live view renders 19 KFB targets;
- representative preview screenshots are visible;
- Pocket Inbox is visible;
- no canonical Hub replacement was performed.

First-publication findings:
- filter anchors were root-bound;
- the theme toggle was hidden by lean-header CSS.

Both are corrected in the source/publication heads above. The exact post-fix Cloudflare response is still awaiting deployment/cache confirmation.

Current-state acceptance checks:
- World M2A R5 is the active public freeplay task, not an unstarted repair brief;
- Track T3/T4 is active; T2 remains history only;
- ToolBox aggregate is directly reachable and missing/source-only tools remain honestly labelled;
- no Hub design or navigation replacement.

Repository-native static assertions: **6/6 PASS**. They parse `SOURCE.json`, require the R5, T3/T4, ToolBox aggregate and Clay ToolBox markers, and reject the superseded M2 repair/T2 active markers.

JavaScript compiler check was unavailable because the optional local Node runtime is absent. Browser/public verification remains the real gate.
