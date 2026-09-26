# KFB Hub · private Sites mirror · RETURN · 2026-09-26

Owner: HUB-CTRL #202 / tools/production_desk. Canonical candidate: Draft PR #217, `chatgpt-web/hub-ux-recovery-v2-integration-2026-09-25@2b4d800d1e0213c3b344eb3e2ee4b6664447a1ce`. This is a distribution mirror, not a status database or Live promotion.

## Result

Private Site: https://kfb-production-hub.frizzlebob.chatgpt.site
Sites project: `appgprj_6ab7358322a8819183d2fa036b7b12f9`
Site source commit: `52403d29e7370f08991979e6bdeb41a5baef9fcf`
Saved version: `appgprj_6ab7358322a8819183d2fa036b7b12f9~appgver_948f649f6fd481919c42bfa5ac338c3b`
Deployment: `appgdep_6ab735dff0e88191b5ba455dffab7161`, native status `succeeded`.

The private Site uses the exact PR #217 Stage HTML blob `aab750434730bbadd8f4a820a010337fc80a376f`, support.js blob `cb009b69ec6b5e00f48c6287a587fe7e0c6c421b`, and Resident overlay blob `b373b51769715ef70a2f426dd9735a6297344737`. The accepted UI-v2 donor `dfaafac...:kfb-hub/index.html` (blob `0de46343ddeb70a5f423876e75dc916ae7200c5b`) is preserved in isolation at the Site's `/donor/` route.

Existing registry fetch order and embedded fallback are retained. The private Site does not write to GitHub. Browser-local Pocket Inbox, theme and decisions do not migrate between the Cloudflare and Sites origins.

## Checks and limits

- 4/4 local Git blob hashes matched fetched GitHub source blobs.
- 3/3 JavaScript syntax checks passed (page script, support runtime, Resident overlay).
- Embedded JSON parsed; marker `HUB-UX-RECOVERY-V2`, 19 lanes, 90 jobs / 42 READY.
- Native Sites deployment status `succeeded`.
- New Site visual/browser behavior: **not independently verified in this execution profile**. Earlier PR #217 Cloudflare proof remains 20/20, but is not Sites proof.
- Georg's `HUB-MOBILE-TUNE-01` defect remains open; a no-overflow check is not human mobile acceptance.
- The public `/kfb-hub/` root and the Cloudflare Stage route were not changed in this slice. The private Site URL is not a KFB Cloudflare Stage acceptance link. No merge / Live promotion.

Exactly one next gate: Georg opens the private Site on desktop and mobile and reports whether it is a useful daily mirror, including the known mobile defect. Only after that review define automated one-way HUB-CTRL → Sites publication and the Hub link policy.
