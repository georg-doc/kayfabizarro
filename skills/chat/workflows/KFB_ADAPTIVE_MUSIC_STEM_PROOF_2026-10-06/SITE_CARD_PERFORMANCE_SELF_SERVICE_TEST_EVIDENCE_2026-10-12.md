# TEST EVIDENCE · KFB Audio self-service Card Performances R1

Date: 2026-10-12  
Status: **IMPLEMENTED_AND_DEPLOYED · TWO_DATA_REVISIONS_VALIDATED · VISUAL_OWNER_RELOAD_PENDING**

## Outcome tested

The existing KFB Audio Site was upgraded once, in place. It now contains a Voice Acting Card Performance editor and a public-GitHub preview loader with schema validation, pinned source revisions, ETag/revision cache and last-known-good fallback. Routine content rows can change on Voice PR #379 without changing Site source.

## Exact identities

- Audio PR: #365 · branch `web/kfb-adaptive-music-stem-proof-2026-10-06`
- implementation commit: `0528fa48312278f6a37bc03b1a0cf55e09a47aa9`
- Voice PR: #379 · branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`
- final tested Voice head: `341fe721a7280c7d0ed025de129ace750a06ed49`
- final feed blob: `180a7ea461620e469e4f8bdf73905a06308f3ece`
- final content revision: `audio-site-preview-r3-card-11-tune`
- Site project: `appgprj_6ac1c73dc28881919123106bd6d3e90e`
- Site URL: https://kfb-audio.frizzlebob.chatgpt.site
- Site source/version/deployment: `e1a1637395855ae59e6bd73aa36a2da93b2e5365` / `9` / `appgdep_6accacccd79c8191be9c35ff35736f35`

## Acceptance matrix

| Requirement | Evidence | Verdict |
|---|---|---|
| existing shell and URL preserved | generated version-9 screenshot; Catalog/Mix/Voice Acting/Soundscape nav retained | PASS |
| one Audio owner | no AudioContext constructor in module; uses `window.KFBAudioSite` | PASS |
| 48 original Cards | pinned deck blob `695e74af…`; live integration 12/12 | PASS |
| source/performance/Bridge/cues pinned | all four GitHub blob identities matched | PASS |
| safe local editing/import/export | deterministic 18/18 core checks; local-only labels | PASS |
| two post-deploy ordinary content edits | commits `a3eba17…` and `341fe72…` | PASS |
| zero extra Site publishes | Site remained version 9 and same deployment after both edits | PASS |
| loader accepts both revisions | 12/12 PASS for r2 and 12/12 PASS for r3, matching ETags | PASS |
| visible same-host reload | private owner browser still blocked by sign-in in automation | OPEN |
| real audible DRY vs D decision | implementation exposes same-source controls; no human listening verdict in this run | OPEN |

## No-touch boundary

No new Site, runtime owner, mixer, clock, Cloudflare route, Production Hub route, merge or Live promotion. Voice candidates remain explicit non-canon preview data. PR #365 and PR #379 remain Draft and unmerged.

## One next gate

`KFB_AUDIO_CARD_PERFORMANCE_OWNER_RELOAD_AND_LISTEN_R1`: in the owner's normal Site session, open **Voice Acting**, press **Reload GitHub content**, confirm `audio-site-preview-r3-card-11-tune`, then compare the identity-matched control vocal with **Play dry** and **Play D** and return KEEP / TUNE / CUT.
