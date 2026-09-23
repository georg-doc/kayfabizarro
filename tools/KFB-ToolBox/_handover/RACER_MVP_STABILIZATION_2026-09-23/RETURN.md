# RETURN · KFB Racer MVP Stabilization · RSTAB-1 · 2026-09-23

Status: **RSTAB-1 TECHNICAL PASS · HUMAN GEOMETRY GATE NEXT · NO RSTAB-2 YET**

## Runtime owner / candidate

Repository:

`georg-doc/KFB-Stunt-Car-Race`

Source lineage:

`main@cc80f4a1c6c509db9668df79fd53b13cee093a9d`
→ `KFB Cologne Race Option C-3/`

RSTAB-0:

- Draft PR #31
- `chat/racer-rstab0-audit-2026-09-23@58d837a5b858bdf7af178bcf0bb578d6ab018ff4`

RSTAB-1:

- Draft PR **#32**
- branch `chat/racer-rstab1-geometry-2026-09-23`
- exact runtime + bounded-CI candidate head `e9c72a404aff63d46762d9101a727a9e7f94a6b0`
- current branch additionally carries only RSTAB-1 Return/Recovery metadata after that runtime head.

No merge, Stage promotion or Live promotion is authorized.

## RSTAB-1 outcome

Two static geometry owners were repaired without changing route or accepted driving feel.

### Ground wedge / tunnel-cut seam

Root mismatch:

- visible shell is banked and rendered as a 14-facet cross-section;
- old ground-cut seam used one symmetric smooth-shell approximation.

On banked tunnel points the real left/right ground intersections are different, so one common half-width could place ground inside the visible shell on one side and leave a gap on the other.

Repair:

- `tunnelShellGroundSpan()` consumes the same banked 14 shell vertices used by the renderer;
- independent left/right ground-cut edges;
- 10-point smooth transition;
- 0.03 m hole-side seam clearance;
- no later `SLEW_M` mutation after a point is marked covered.

### Support pillars

Old code calculated the banked local support point but ignored its `y` and sized pillars from centerline height.

Repair:

- `structurePillarSpan()` uses each real local banked soffit endpoint;
- existing support cadence remains unchanged;
- support count remains **54**;
- no global shortening or deletion.

## Actual evidence

GitHub Actions:

- workflow `Racer RSTAB-1 geometry`
- run **35807766171**
- job **107012285119**
- Node **22.23.2**
- result **SUCCESS**

TAP result:

**5 tests · 5 PASS · 0 FAIL**

The bounded regression proves:

- route remains **598 points / 2063.844351 m**;
- support roster remains **54**;
- old support rule reproduces exactly the three RSTAB-0 penetrations **166 / 179 / 187**;
- repaired support rule yields **0** road penetrations;
- both rendered-shell side intersections resolve at all **44** tested tunnel-cut points;
- every fully covered cut edge matches its actual rendered shell seam + 0.03 m;
- transition edge step remains **< 1.1 m**;
- old symmetric-shell / `SLEW_M` runtime fallback is absent.

## Race evidence packet

On Draft PR #32:

`_handover/RACER_MVP_STABILIZATION_2026-09-23/RSTAB-1/`

contains:

- `TEST_REPORT.md`
- `LOCAL_PREVIEW.md`
- `CHANGELOG.md`
- `RETURN.md`

Race `RECOVERY.md` is updated on the same branch.

## Preserved boundaries

Unchanged:

- `cologne-route.v1.js`;
- all route control points;
- v0.8 FLOW / FEEL;
- camera;
- vehicle grounding;
- HUD / billboards;
- audio;
- trails;
- roster.

RSTAB-2 hard-curve work is **not started**.

## Browser / human status

This Web environment cannot execute the private C-3 WebGL surface.

Therefore:

- technical RSTAB-1 = **PASS**;
- human-visible WEDGE/PIER acceptance = **PENDING**;
- no screenshot/full-lap browser PASS is claimed.

The local development review procedure lives in the Race RSTAB-1 packet. Local HTTP is an edit-review surface, not the public acceptance surface.

## Public Stage

Historical route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c/`

Current classification:

**HISTORICAL SNAPSHOT · NOT C-3 / NOT RSTAB-1 PROOF.**

No Cloudflare publication happened in RSTAB-1.

## Exactly one next gate

**RSTAB-1 HUMAN GEOMETRY GATE**

Review only:

1. tunnel/ground-cut approach in normal CHASE;
2. support endpoints around the previous 166 / 179 / 187 region.

Only a human **ACCEPT** advances the project to **RSTAB-2 hard-curve stability**.


## Zero-install Stage packaging · 2026-09-23

Human review no longer depends on Git/Terminal/Python.

Intended Stage route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c-rstab1/`

Build marker:

`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c-rstab1/BUILD.json`

Packaging state:

- Race Draft PR #32 current handoff head: `d712a17904f532c2eca9f120d24924073eae0f3c`;
- exact runtime-tested candidate remains `e9c72a404aff63d46762d9101a727a9e7f94a6b0`;
- kayfabizarro Draft PR #178;
- Stage source branch `stage/racer-rstab1-review-2026-09-23@13191b0f600878f96b06db8142d8d7393411a67d`;
- Stage `lab-v9` parity: **20/20 filename + blob SHA identical** to Race RSTAB-1;
- Cloudflare route source commit `77e4bd44aac0d0ce720c5b0149eedb3eef62ac36`;
- Cloudflare Hub metadata commit `a075934bb5f8628535b673459b0b9ddcc0af5312`;
- main Hub metadata commit `fd7680034171f9a327936e9ee7fa2a3cc1f6b4dc`.

Public route verification is **UNKNOWN / PENDING**: the current execution environment cannot resolve/access `kayfabizarro.pages.dev` through either Web fetch or container DNS.

Therefore no `PUBLIC_VERIFIED` or live claim is made.

Exactly one next gate remains:

**RSTAB-1 HUMAN GEOMETRY GATE** on the Stage route once its public `BUILD.json` visibly reports Race runtime source `8dd3cd15147fe403090e00495bb632bd1cf1a203`.


## Human gate fail + WEDGE pass 2 · 2026-09-23

The first zero-install RSTAB-1 human gate failed.

Georg reports:
- at least two brown ground wedges still visible in the first tunnel section;
- extreme jerk/instability at the first ~45° curve;
- Tail/Speedline ribbons overlap and break into rectangular pieces in the same phase;
- vehicle floats above the track at zero speed, with front wheels visibly raised;
- jump/bounce/landing can occur above the track or leave the vehicle inside it.

### Current WEDGE repair

The two remaining brown cut ownership transitions are statically localized to:

- **99 → 100**
- **133 → 134**

Both are inside TUNNEL and have rendered shell geometry at both endpoints.

Pass 2 changes ownership only:
- tunnel shell owns those two transition segments;
- brown ground-cut wall/invert is not emitted across them;
- 90→91 remains ground-owned.

Race runtime/test candidate:

`a9dd49995d32423e101a67f2e591c2b069583252`

Current Race PR #32 handoff head after metadata:
`47fc451f2b03d5418d6ad281213f139b66223269`

GitHub:
- run `35814096388`: SUCCESS
- run `35814091421`: SUCCESS
- 6 active test blocks
- 0 skipped

This is WEDGE repair pass **2**. If the same visible WEDGE gate fails again, stop and create the full failure-recovery export; no pass 3.

### Zero-install Stage pass-2 mirror

- kayfabizarro Draft PR #178
- source branch head `df82e1fa31213d21c13af1f39f369608078633a3`
- mirrored Race world blob `42aa0aa74a1fa0c55da6bc55677948527b3a87c2`
- Cloudflare source commit `ad0036c465e7c5a87c3cfcc0d49cfb2cf3378de0`
- Cloudflare Hub metadata commit `f904c318172848078b9d7f58e2b186c5fda03e7d`
- main Hub metadata commit `db3a651698d4f829ebc1f7be543ab1b51dc20494`

Intended review route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/stunt-world/cologne-option-c-rstab1/`

Public verification remains **UNKNOWN / PENDING** because both Web fetch and container DNS cannot currently access `pages.dev`.

### Downstream gates now fixed in order

After WEDGE ACCEPT:

1. **vehicle support/orientation/landing**
   - current source already explains stationary float: start bank ≈14.1° plus `vehicleLift()` creates ≈0.306 m lift at rest;
   - support/contact must be measured rather than tuned by another heuristic.

2. **hard-curve stability**
   - preserve global v0.8 FLOW/FEEL;
   - repair/localize the ~35.3 m-radius bend / edge-clamp interaction.

3. **trail/speedline continuity**
   - re-test after stable curve motion;
   - rectangle breakup may be downstream of frame-to-frame hard-clamp emitter jumps.

No RSTAB-2 implementation has started yet.

## TARCH-0 architecture reset · Chat artifact review

Current Race candidate:
- Draft PR **#33**
- branch `chat/racer-tarch0-sp13ktra-2026-09-23`
- current handoff head `45fa80d0449efecf6a9ecfb69386c6cb4f9ba1fd`
- runtime-tested head `b37cbad1038e669a0c9929d25789d54d0283b0fc`
- CI `35817990559 / 107043574054 · SUCCESS`
- **7 active architecture tests · 0 skipped**

The old RSTAB-1 tunnel/ground foundation is archived after two failed human repair passes. No pass 3.

TARCH reimplements the observed SP13KTRA architecture independently:
- one continuous road/causeway;
- world ground outside/below the complete banked road/wall envelope;
- dense arch scenery over that same road;
- no tunnel shell, ground-cut wall or invert inside the tunnel path.

SP13KTRA source/assets are **not copied**; donor license is All Rights Reserved.

Human review method:
1. R1 isolated HTML artifact directly in ChatGPT;
2. R2 integrated Racer HTML only after R1 ACCEPT;
3. optional R3 one local integration correction.

Cloudflare / Pages are deferred until after human visual acceptance. They are no longer part of iterative QA.

Recovery / review protocol:
`georg-doc/KFB-Stunt-Car-Race#33 → _handover/RACER_MVP_STABILIZATION_2026-09-23/TARCH-0/CHAT_ARTIFACT_REVIEW_PROTOCOL.md`

Exactly one next gate:
**TARCH-0 HUMAN ARCHITECTURE GATE · R1 CHAT HTML**.


## TARCH R1 accepted · R2 integrated review prepared

R1 isolated architecture review is **GEORG ACCEPTED**.

Accepted artifact:
`georg-doc/KFB-Stunt-Car-Race#33 → _handover/RACER_MVP_STABILIZATION_2026-09-23/TARCH-0/review/KFB_Racer_TARCH0_R1_review.html`

Acceptance evidence:
`review/R1_ACCEPTED.md`

The accepted harness is now the first verified donor in the shared Web-First review pool:

`skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/REVIEW_TEMPLATE_POOL.md`

Registry:
`skills/chat/workflows/KFB_WEB_FIRST_EXECUTION_V1_2026-09-22/review-templates/REGISTRY.json`

Donor ID:
`threejs-focus-review-v1`

Current Race PR #33 branch head after R2 recovery marker:
`6e37fa689441946a1e063af939b16cf0cbb54ce1`

R2:
- filename `KFB_Racer_TARCH0_R2_integrated_review.html`;
- generated SHA-256 `bc5a97f5239c66f54e8cb53bfd21fef0326a7c3f40f524419ddce60cce3b5fc4`;
- size `18179 bytes`;
- source geometry `b37cbad1038e669a0c9929d25789d54d0283b0fc`;
- status **PREPARED · HUMAN REVIEW PENDING**.

R2 reuses the accepted R1 review chrome and adds only:
- longer C-3 entry/tunnel/exit context;
- CHASE-like entry/inside/exit views;
- city ground / TARCH void / deep ground;
- supported TARCH frames;
- optional pinned OSM context.

Cloudflare remains deferred.

Exactly one next gate:
**TARCH-0 R2 · integrated Racer Chat HTML human review**.


## R2 TUNE → R3 track-edge/banking review

R2 integrated TARCH review returned **TUNE**.

Source split:
- saw-tooth edge = chat-review painter artifact, not Runtime Ground Void;
- banking direction = real runtime sign issue.

Runtime change:
`cologne-route.v1.js`
`bank = clamp(curv * 26)`

Unchanged:
- bank gain/cap/smoothing;
- route topology;
- widths;
- TARCH Ground Void architecture.

Runtime/test head:
`5f1ec224a96af7444f0c86ebbcf178dc70d35b72`

CI:
- `35859446787 / 107175757847`: SUCCESS
- `35859451138 / 107175774059`: SUCCESS
- **11/11 PASS · 0 fail · 0 skipped**

R3 review:
`KFB_Racer_TARCH0_R3_track_edge_banking_review.html`

SHA-256:
`980b245478a28f9e39dcf284ece6caaf9e013a65a766f9c0fb51121e48e2d88b`

Race Draft PR #33 current docs head:
`59fa2a4235e7705a495bbd724d92a315befe1628`

Exactly one next gate:
**R3 · TRACK EDGE + BANKING CHAT HTML HUMAN REVIEW**

Cloudflare remains deferred. Grounding, jitter, trails and jump/landing remain later.
