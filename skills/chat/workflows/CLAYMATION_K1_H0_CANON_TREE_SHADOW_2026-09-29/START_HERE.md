# CLAYMATION-K1-H0-CANON-TREE-SHADOW · START_HERE

Date: 2026-09-29
Status: **PASS-1 IMPLEMENTED · BROWSER EVIDENCE RUNNING · NO STAGE/LIVE**
Owner: existing ToolBox Claymation reference + World Core R0A consumer
Repo: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/claymation-k1-h0-canon-tree-shadow-2026-09-29`
Draft PR: #293

## Outcome

Make Georg's re-supplied exact K1/H0 Claymation codebase the mandatory visual/code front door for all claymation work, and repair the black tree-crown seam without reintroducing detached building/prop shadows.

## Binding source

`tools/KFB-ToolBox/_inbox/KFB Knet-Katalog K1 + Hirnwelt Claymation Reference/KFB_K1_H0_CODEBASE_2026-09-29/`

Do not modify that source package during this slice.

Stable router:
`tools/KFB-ToolBox/docs/CLAYMATION_K1_H0_REFERENCE.md`.

## Current findings

- K1/H0 houses use real source models + `clayify()` + `clay-soften.v1` preprocessing; surface shader alone is insufficient.
- R0A currently bends raw donor geometry and therefore is not a faithful K1/H0 façade source.
- R0A had a fixed ±240 m shadow box and `normalBias=0.25`, contrary to the shared shadow recipe.
- K1/H0/R0A clay foliage uses interpenetrating blobs. Allowing all crown blobs to cast and receive shadow creates artificial sibling contact bands; GTAO can amplify the same seam.

## Pass 1

- fitted/snapped shadow follow;
- texel-relative normalBias;
- PCFSoft retained;
- procedural + donor foliage still cast world shadows but do not receive sibling shadow-map shadows;
- trunks remain normal receivers;
- isolated tree proof captures Shadow+AO, AO-only, Shadow-only.

## Stop condition

If the black seam remains in AO-only evidence, do not increase global bias. One second/final repair pass may change only foliage AO/depth/topology representation. If that fails, preserve candidate and export failure recovery.

## Exactly one current gate

GitHub Action `Claymation K1 H0 Tree Shadow` must pass and the three screenshots must identify whether any remaining seam is shadow-map or GTAO/topology.
