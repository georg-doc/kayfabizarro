# RETURN · KFB WorldBuilder v1 · WB1-P1 · 2026-09-23

Status: **WB1-P1 CANDIDATE PRESERVED · STATIC PASS · BROWSER / VISIBLE PROOF BLOCKED · DO NOT START P2**

## Repository / branch / PR

- Repository: `georg-doc/kayfabizarro`
- Branch: `chatgpt-web/world-builder-p1-environment-profile-2026-09-23`
- Draft PR: **#177 · WorldBuilder v1 · WB1-P1 Environment Profile candidate**
- Coordination main reconciled before final metadata: `92f7e54e6e08cce4a07f87d9a26200032ee54797`
- P0 evidence reconciliation checkpoint: `b5bb97c0bc2181287019d640009b939758b9e53c`
- P1 implementation checkpoint: `bbf9a8ead0750dcb69be68d4d1a2a7136bd25ceb`
- P1 test / recovery checkpoint: `6b745a555c80cd0e64d411141c8e346b5e60fd47`
- Current-main reconciliation checkpoint before this metadata commit: `782500cf4ceeabfe28509ce2256bf652a9138b5f`

This metadata commit necessarily advances the branch once more. The authoritative exact final handoff head is recorded on Draft PR #177 after readback and in the chat handoff.

## Outcome

A bounded standalone Environment Profile candidate now exists under:

`tools/KFB-ToolBox/world-building-preflight/environment-profile/`

It owns only:
- DAY diagnostic / WhackMan-derived DUSK world lighting;
- depth fog;
- warm torch source behavior;
- physical torch falloff;
- fixed nearest-light pool, maximum 6;
- asynchronous two-frequency flicker;
- visible glow source;
- local visibility light;
- exposure.

It does **not** own:
- WhackMan movement, MazeGraph, pursuers, pickups, combat or game state;
- World topology / Surface Adapter;
- material policy.

Material remains a separate reversible `MaterialProfileRef`.

## Source-object-first proof contract

The preview is intentionally locked to this order:

1. load and show the real KayKit `torch_mounted.gltf` source object alone;
2. measure its flame point using existing Dungeon-owner functions;
3. render multiple source-only frames;
4. only then unlock the integrated ENVIRONMENT proof.

The implementation exists, but the visible browser observation is still unresolved because browser navigation was blocked before page load.

## Intentional donor deltas

`wd-light.js` was used as the small extraction/adaptation donor, but P1 does not promote its lab-only calibration over the final WhackMan source:

- exposure: `1.0` from final `wm-boot.js`, not lab `0.98`;
- local visibility: max intensity `46`, range `26`, decay `1.6` from final `wm-gate-c.js`;
- material matte behavior is separate and reversible rather than embedded in Environment Profile.

Exact pins are recorded in `environment-profile/SOURCE.json`.

## Tests actually run

Repository-native:
- profile/core tests: **8/8 PASS**
- module syntax checks: **4/4 PASS**

Browser attempts:
- attempt 1: local HTTP → **blocked before page load**
- attempt 2: intercepted test origin → **blocked before page load**
- blocker: `net::ERR_BLOCKED_BY_ADMINISTRATOR`
- successful app page loads: **0**
- browser console-error verification: **UNKNOWN**
- source-object visible proof: **NOT OBSERVED**
- screenshots: **0**
- interactive control tests: **0**

Per the two-repair-pass rule, no third browser transport attempt was made.

## Dropbox / Game Development Studio

Read-only Dropbox provenance found:
- WhackMan v1-1 Session Cut;
- WorldDesign Lab 2026-09-23.

GitHub remains SSOT.

Optional `game-dev` CLI was unavailable. Sealed Game Development Studio evidence is not required by WB1-P1, so repository-native checks were used as the allowed fallback.

## Portable Preview

Preview package files are persisted in the candidate folder:
- `LOCAL_PREVIEW.md`
- `START_PREVIEW.command`
- `STOP_PREVIEW.command`
- `REVISION.json`

This is **LOCAL REVIEW CANDIDATE · NOT PUBLIC** and is not an acceptance surface until the Browser Verify gate is observed.

## Stage / publication

Direct Cloudflare Stage URL: **none — prohibited/not requested for this WB1-P1 slice.**

- Cloudflare deploy: **0**
- public browser verification: **0**
- Live promotion: **0**
- auto-merge: **not used**

## Recovery

Canonical recovery export:

`tools/KFB-ToolBox/_handover/WORLD_BUILDER_V1_2026-09-22/WB1_P1_FAILURE_RECOVERY_2026-09-23.md`

## Unresolved

- required visible source-object isolation proof;
- 0-console-error browser proof;
- integrated Environment Profile screenshot / visible evidence;
- interactive DAY/DUSK / torch / local visibility / reversible material checks.

These are evidence gaps, not permission to redesign the candidate.

## Exactly one next gate

**WB1-P1 Browser Verify.**

Use the persisted candidate unchanged first. Prove the real source object in isolation, then the integrated Environment Profile. Only after that gate passes may WB1-P2 be considered.
