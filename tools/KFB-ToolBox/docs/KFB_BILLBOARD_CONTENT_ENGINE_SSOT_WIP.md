# KFB Billboard Content + Engine SSOT/WIP

Status: **CURRENT WIP CONTRACT v0.1 · NOT YET INTEGRATED**  
Date: 2026-10-01  
Owner: existing B1/B2a Billboard runtime  
Consumer: `WSA-BILLBOARD-ISLAND-INTEGRATION-01` / Draft PR #300

This is the read-first contract for Billboard content, rotation, responsive composition, caching and playback. It does not own the physical billboard mesh. Read `KFB_BILLBOARD_3D_PRESENTATION_SSOT_WIP.md` for bodies, sockets, clay models and cardboard standees.

## One-owner rule

The existing B1/B2a Billboard runtime remains the only owner of the media surface, fit/crop, front/rear semantics, scheduler/ticker, visibility lifecycle, CSS3D/video/embed playback, cache, failure and resume behaviour.

No donor, island, 3D model or design export may create a second scheduler, media plane, PDF renderer or Billboard engine.

## Donor seams

- **B1:** Kenney body/frame provenance, measured face and content fit.
- **B2a:** CSS3D inline video/embed path and strict front/rear semantics.
- **H4:** Hypernormalisation generator, song form and similarity selection only.
- **H5:** public-domain image pool and FILM access only.
- **H6:** KFB Card/Motif material through the existing `KFBCorpus` only.
- **H13/H14:** additional verified content, effects and recipes only; never runtime ownership.
- **B2b-P1:** `ARCHIVED_FAILED_CANDIDATE`; do not reintroduce it.

H4 song form and similarity weights remain unchanged unless a later named gate replaces them. The caller supplies the seed; `1966` is fallback only.

## Content contract

Every item needs stable metadata: `id`, `sourceKind`, provenance/licence, canonical source or cache reference, aspect/focal crop/safe area, deck/biome/topic/mood tags, SHOW/SPIN/SELL role and triplet identity, duration/weight/cooldown, seed eligibility, palette/signature hints, fallback state and front/rear eligibility.

Public-domain and KFB-owned media belong in canonical GitHub-backed pools or manifests. They are not copied into every design-session ZIP.

## Rotation and anti-repetition

- schedule by SHOW / SPIN / SELL triplets;
- deterministic order for the same seed and manifest;
- no immediate repeat and bounded topic, visual and slogan recurrence;
- long cooldown for short mottoes such as `Panta Rhei` or `Semper Fidelis`;
- deck/biome tags bias selection without collapsing the pool;
- hidden-tab resume advances one owner clock and never starts a second ticker;
- source failure skips the item or uses the bounded existing fallback chain.

Acceptance evidence reports pool size, unique items per five minutes, shortest repeat interval and the ten most frequent words/phrases.

## Responsive composition

The canonical logical output is **1024 × 512 / 2:1**, plus composition metadata so the same item maps safely to different physical faces.

The engine may choose `cover`, `contain`, `cardGrid` or a verified crop. `motifBox` remains candidate metadata until visually accepted. Safe areas protect titles, faces, captions and marks. Wide, square, portrait and die-cut consumers use the same source item and scheduler; they do not fork the engine.

The presentation layer supplies the measured face/socket. The engine supplies responsive composition. Neither guesses the other's geometry.

## Cards, PDF and embedded media

- Never render PDF pages synchronously during active cuts.
- Use baked/cached card and motif images plus `cardGrid` from its SSOT.
- Live PDF/card rendering is an offline bake/proof path, not the game hot path.
- Video and embeds use B2a's bounded path, not uncontrolled iframes per Billboard.
- The B2a rear face never mirrors front media.
- At middle/far distance, use cached/static signature imagery; do not keep full video or PDF work alive.

## Failure chain

Unavailable H5 public-domain material yields zero additional assets, not a runtime failure. FILM uses bounded fallbacks and then skips. Missing H6 material falls back to the existing H5/H4 pool. A deterministic static fallback is allowed only as a non-empty failure surface; it never replaces the donor design.

## Required proof

1. real unchanged B1/B2a source in isolation;
2. CARD, COVER, VIDEO/EMBED, SLOGAN and HYPERNORMALISATION;
3. seed reproducibility and five-minute recurrence limits;
4. source outage, bounded cache, hidden-tab resume and no double ticker;
5. strict front/rear semantics;
6. 0 / 1 / 4 / 8 / 16 visible Billboards in the real browser;
7. near, middle and far behaviour on the reduced island consumer.

## Handoff rule

Design/LLM handoffs target **≤5 MB** and remain **≤10 MB**. Canonical media stays in GitHub or the named asset pool; handoffs contain manifests, recipes, compact evidence and links, not duplicated collections.

## Next gate

PR #300 maps one verified triplet through the single B1/B2a owner onto the three companion consumers: r2 Clay body, cardboard standee and one mapped 3D model. Until browser proof and measurements exist, this remains **WIP**.
