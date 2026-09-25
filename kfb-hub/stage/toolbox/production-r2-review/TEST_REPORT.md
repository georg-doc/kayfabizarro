# ToolBox r2 Stage Review · TEST REPORT

Status: **SOURCE CANDIDATE · PUBLIC NOT YET VERIFIED**

Receiving owner runtime evidence:
- PR #185 runtime-tested head `5dcf34bcdf9d87445e927c98f60d41adae72f00e`
- Actions `36197260540` SUCCESS
- 31/31 coherent static
- 34/34 AN-PROFILE static
- 20/20 coherent browser
- 25/25 Animation Studio browser
- 13/13 plain review browser

This Stage route replaces only the review transport.
It imports PoseRig + canonical locomotion profile directly from the tested owner head.
It does not create a second ToolBox owner.

Stage-specific browser gate must prove:
- boot with real sources;
- `window.__kfbTB` available;
- Production r2 selftest = 19/19;
- no page errors / failed owner-module requests;
- dominant visible WebGL stage at desktop review width.

Public route remains NOT PUBLIC_VERIFIED until exact pages.dev route is opened and expected revision is visible.
