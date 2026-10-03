# RETURN · Procedural Test World 01

Status: **CURRENT WORLD CANDIDATE · R2D BODY/WATER/NATURE BROWSER PASS · NO PLAYER · NOT STAGE**

## Human result

The old Travel Globe is no longer needed as the routine movement/combat test environment.

PR #332 now contains a clean WorldBuilder host based on current main with:
- continuous R2D island surface;
- visible floating underside;
- Track Core road;
- pond;
- creek;
- waterfall;
- source-proven procedural nature groups from P1/P2;
- no Travel/card startup;
- no legacy `wi1-play`;
- no local locomotion state machine.

This is the world that the central Motion owner can later attach to after its neutral ActionFigure prototype receives Georg visual PASS.

## Current implementation proof

Tested implementation head:
`0335ade26741cf1df4920a723045c25de4fa2a82`

Source tests:
- **7/7 PASS**
- run 37087496100
- job 111100703113

Resource Registry:
- **PASS**
- run 37087496086
- job 111100703115

Real Chromium / WB2:
- **PASS**
- run 37087496103
- job 111100703199
- artifact 11261420332
- digest `sha256:9cef3575443ff99ca7b1144f9cc59e2c3af8ad5db238b81f93749b7ff9a8d9e0`

Browser facts:
- one WB2 renderer/canvas;
- R2D body depth 25.4;
- 14,400 body vertices;
- underside present;
- pond / creek / waterfall present;
- nature groups: 3 centres, 6 trees, 6 bushes, 3 boulders, 5 edge rocks, 4 P2 detail groups;
- Track Core road present;
- legacy player absent;
- Travel Globe absent;
- card-start absent;
- 0 console errors;
- 0 page errors;
- 0 QA problems.

## Travel regression conclusion

The card module itself was not repeatedly rewritten. The regression amplifier was the old host:
- locomotion iterations kept changing `wb0.js` / lifecycle around the card system;
- newer card/Town/presentation work lived on parallel branches while later Mobility work continued from an older Travel recovery host;
- Ground also suppressed a Flight sky-update path that had been pumping PDF card artwork;
- source/owner tests did not prove the final visible card presentation after each host change.

Rule now:
**do not use a legacy or stale host as the default product-integration test world.**

Travel remains a later consumer/donor for Flight/cards, not the neutral world.

## GitHub cleanup

Closed as donor/history, branches preserved:
- Motion donors #127, #294, #331;
- World stack #307, #311, #313, #316, #319, #322, #323, #327 and design brief #328;
- Resident chat donors #305, #306, #308, #310;
- Hex handoff/bench/ramp donors #317, #318, #320;
- Travel legacy/recovery Mobility PRs #39, #41, #43, #44, #45 in KFB-Travel-Globe.

Current clean entry points:
- Motion: PR #333.
- World: PR #332.
- Residents: #330 / #315 + Coworker narrative recon.

## Exactly one next world action

Mount the **existing current building/facade family** onto the R2D building pads inside this same WB2 world.

Do not add Player/Drive/Combat yet.
Do not create another world owner.
Do not publish Stage yet.
