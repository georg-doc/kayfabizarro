# KFB Hub UI v2 · Stage candidate test report

Status: **STATIC PASS · PUBLIC ROUTE VISIBLE · POST-FIX DEPLOY/HUMAN GATES OPEN**
Date: 2026-09-20
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

Human gate remains desktop, split-screen and mobile visual review. No Live promotion.
