# KFB_JUKEBOX_CATALOG_01 · TEST REPORT

**Date:** 2026-10-04  
**Candidate:** `070fdaee25dfcdc671a0a29946092086c0a50562`  
**Status:** SOURCE_VALIDATED · BROWSER_QA_EXPECTATION_RECOVERY_REQUIRED

## Source / static

Run `37168419769` / job `111336177063`:
- sparse checkout: PASS;
- catalog/source-lock validator: PASS;
- JavaScript syntax: PASS.

Validated locked facts:
- 54 catalog tracks;
- 44 RoadTrip-v2 masters;
- 14 paired stem families;
- exact master/tree SHA reconciliation against `source-lock.json`;
- Cyclical Warmth = `certified`;
- other stem families = source-only;
- verified shared soundscape sources locked;
- rain remains explicit SOURCE_REQUIRED.

## Browser

Browser reached four assertions:
1. Site marker — PASS
2. catalog renders >=54 — PASS
3. stats report 44 RoadTrip-v2 — PASS
4. stem filter expected 12 — FAIL, actual **14**

The fourth assertion is stale test data after source advanced from 12 to 14 paired families.

Artifact `11290582496`  
Digest `sha256:ff8f155fe10a6fccffd951fdd6503df4fd53b4eeb36e52f17c60eee517f5e649`

No full browser PASS is claimed.

## Stop reason

Two repair passes on the browser gate already advanced the candidate. Per KFB recovery policy, no third repair is attempted in this slice.

## Next gate

`KFB_AUDIO_SITE_QA_RECOVERY_01`: change only the one stale 12→14 browser assertion and rerun. If it passes, proceed to GPT Site publication with Sites MCP.

## QA recovery 01 result · 2026-10-04

Local source checks on the exact recovery candidate:
- catalog/source-lock validator: **253/253 PASS**;
- JavaScript syntax: **PASS**;
- validated counts remain **54 catalog / 44 RoadTrip-v2 / 14 stem families**.

Browser recovery pass 1:
- corrected only the stale stem-filter expectation `12 → 14`;
- first five checks passed: Site marker, 54-track render, 44 RoadTrip-v2 stats, 14 stem-filter results, Mix view;
- next previously hidden harness defect: the test tried to fill `#pMood` while Prompt Studio was still hidden.

Browser recovery pass 2:
- moved the existing Prompt Studio navigation before the existing mood-field fill;
- first five checks remained PASS;
- Prompt Studio visibly built a grounded request containing `rainy midnight melancholy` and the selected `Awe Before Drama` master reference;
- the sixth assertion failed only because it case-sensitively expects `Master`, while the generated text correctly uses lowercase `masters` / `master`.

This is a second newly exposed QA-harness expectation mismatch, not an observed Site/product failure. Two recovery repair passes are exhausted. No third patch and no Site publication are made in this slice.

Exactly one next gate: `KFB_AUDIO_SITE_QA_RECOVERY_02` — correct only the case-sensitive prompt-output expectation, rerun the same QA, and publish through Sites only if the full browser gate is green.

## QA recovery 02 · COMPLETE PASS

- tested implementation head: `b5835c521264eef6caf1e1260821c5e04f232fcd`
- run `37173411886`
- job `111350911259`
- source/catalog validator: PASS
- JS syntax: PASS
- browser: **9/9 PASS**
- artifact `11292621270`
- digest `sha256:6ae512c1dcce56140e7decf6b1fc8b0965a4ffe53b15c77708b4beb13883d4e6`

The browser gate is fully green. No remaining QA mismatch is known.

Site publishing is not included in this PASS because Sites MCP is not available in the current Webchat toolset.

## B / C / D update · COMPLETE PASS · 2026-10-05

- tested GitHub head: `18fb126701d2412f6b5a5701f08dc5615f4069a2`;
- run `37243655057`, job `111557176078`;
- validator: **303/303 PASS**;
- JavaScript syntax: **PASS**;
- browser: **17/17 PASS**;
- artifact: `11317963584`;
- digest: `sha256:8e74665aaabf6bc9108025a4744e54a4dbca365610294e9b1f26fa0b26485842`.

The 17 browser checks prove:
1. source 0.2 marker;
2. 54-track render;
3. 44 RoadTrip-v2 stats;
4. 14 stem-family filter;
5. Mix view;
6. three B/C/D controls;
7. C default;
8. manual B→C→D reaches D;
9. exactly one AudioContext after transitions;
10. D + separate TTS ducking reduces SCORE gain;
11. TTS does not create a second AudioContext;
12. external World adapter reaches B on the same context;
13. Prompt Studio exposes B/C/D;
14. Conversation-D request is grounded in the authored prompt pack;
15. missing rain remains explicit;
16. zero page errors;
17. zero local HTTP errors.

Sites source commit `b0a620777768c93c2b87a3215b4c8e8730609e53` was saved as version `appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_77727ba7f7248191bf12eb7e13cad587`; deployment `appgdep_6ac2e0e36dc48191bd0b49ecd828a500` succeeded. The Sites screenshot visibly confirms `SITE SOURCE 0.2`, `ONE AUDIO CONTEXT` and 54/44/14. The exact owner-private URL opens to its ChatGPT sign-in boundary in the automation profile; therefore no unauthenticated claim of interactive production access is made.
