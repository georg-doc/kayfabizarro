# AUDIO-ARRANGE-01 DONOR REBASE · RECOVERY

**Status:** SOURCE / BROWSER PASS · PUBLIC PENDING  
**Branch:** `chatgpt-web/audio-arrange-01-donor-rebase-2026-10-03`  
**PR:** #339  
**Tested head:** `3d85d7e2aa103ab0bb2b388c678584d9ece19484`

Resume here, not PR #337.

The prior failure was source drift. It is resolved on this fresh branch.

Current evidence:
- 29/29 source PASS;
- 24/24 Chromium/WebAudio PASS;
- all eight stems decode to identical 214.128 s timelines;
- exact synchronized source start confirmed;
- no public Stage yet.

Do not change musical logic before Georg's A/B.

Exactly one next gate:
publish unchanged donor bench to the fixed Stage route, public-verify it, then ask Georg to compare Cyclical Master / Loping Master / Stem Reconstruct / KFB Arrange.
