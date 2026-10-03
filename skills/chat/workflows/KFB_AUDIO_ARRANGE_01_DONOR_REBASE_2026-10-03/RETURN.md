# AUDIO-ARRANGE-01 DONOR REBASE · RETURN

**Date:** 2026-10-03  
**Status:** SOURCE / BROWSER PASS · PUBLIC PENDING  
**Repo / branch / PR:** `georg-doc/kayfabizarro` · `chatgpt-web/audio-arrange-01-donor-rebase-2026-10-03` · Draft PR #339  
**Head:** `3d85d7e2aa103ab0bb2b388c678584d9ece19484`

## Result

The source-drift failure from PR #337 is resolved by rebasing the preserved donor bench onto current main.

Actual tests:
- **29/29 source PASS**;
- **24/24 Chromium/WebAudio PASS**.

Decoded facts:
- 8/8 stems decode;
- every stem duration is exactly 214.128 s;
- duration spread = 0;
- scheduled start timestamps are identical;
- Cyclical master = 213.2 s;
- Loping master = 204.0 s.

Artifact:
`11262876991`
`sha256:e08c061ac8f580d469b07586c52dd8c52db3fa94dc191e3f77d71f951077df19`

No public Stage, human musical PASS or replacement-instrument PASS is claimed yet.

## One next gate

Publish unchanged donor bench and run human A/B. Loping stems remain deferred.
