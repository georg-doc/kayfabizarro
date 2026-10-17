# TEST REPORT · Card Performance self-service

Date: 2026-10-12  
Status: **TECHNICAL HOT-RELOAD CONTRACT GREEN · OWNER-BROWSER AUDITION PENDING**  
Owner: KFB Audio / Draft PR #365  
Content owner: KFB ChatterBox Voice / Draft PR #379

## Published Site identity

- existing Site: https://kfb-audio.frizzlebob.chatgpt.site
- project: `appgprj_6ac1c73dc28881919123106bd6d3e90e`
- Site version: `9`
- source marker: `0.6.0`
- source commit: `e1a1637395855ae59e6bd73aa36a2da93b2e5365`
- version id: `appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_225a4be325ac819190d6fcfd6e3bc9e2`
- deployment: `appgdep_6accacccd79c8191be9c35ff35736f35` · succeeded
- archive: `sha256:55628a1abf77b17e9a628bc79bdcbe7dc7276dff1fb5853a3cdcbabb9c9483af` · 43 files
- audience: existing custom owner-only access preserved

The generated version-9 screenshot visibly shows the preserved KFB Audio shell, source marker `SITE SOURCE 0.6.0` and `GitHub = SSOT + HOT RELOAD`.

## Static and live-source checks

| Check | Result |
|---|---:|
| Card Performance core | 18/18 PASS |
| current GitHub feed + pinned sources | 12/12 PASS |
| complete packaged Site validator | 172/172 PASS |
| `git diff --check` | PASS |
| original deck | 48 Cards |
| full performance text | 50 segments |
| exact ending | `Stay Fluffy!` |
| timed cue profiles | 3 × 50 cues |
| module-created AudioContexts | 0 |

Card 28's absent Lore is retained as source silence. Missing typed edges remain `NO_EDGE` / silence.

## Two post-deploy content-only updates

The Site was already version 9 before both updates.

1. Voice PR #379 commit `a3eba17e2473d511268055a2471df0c19ccbc302`
   - feed blob `e28057d7d4dddcf25ada9e4d1d21462ec0899ad3`
   - revision `audio-site-preview-r2-card-6-tune`
   - loader integration: 12/12 PASS; ETag matched the new feed blob
2. Voice PR #379 commit `341fe721a7280c7d0ed025de129ace750a06ed49`
   - feed blob `180a7ea461620e469e4f8bdf73905a06308f3ece`
   - revision `audio-site-preview-r3-card-11-tune`
   - loader integration: 12/12 PASS; ETag matched the new feed blob

After both updates, Sites still reports latest version `9`, the same source commit and the same deployment. Additional Site publishes after setup: **0**.

## Browser and audio boundary

The private Site's generated screenshot proves the deployed 0.6.0 shell. The separate automated browser still receives the ChatGPT sign-in gate, so the in-tab proof of pressing **Reload GitHub content**, seeing revision r3, and playing DRY versus D is not claimed. Exact-source A/B wiring and reuse of `window.KFBAudioSite` are statically validated; audible human acceptance remains open.

No Site token, GitHub token, private audio or automatic canon promotion was added.
