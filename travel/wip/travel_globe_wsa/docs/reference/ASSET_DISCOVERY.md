# 06 · Asset Librarian Contract

## Decision

For KFB GitHub asset discovery, use the **KFB Asset Librarian / generated Asset Registry first**.

Live browser supplied by Georg:

`https://asset-librarian-v1-2-site-co.kayfabizarro.pages.dev/tools/asset_registry/librarian/`

Asset source / Registry repo:

`georg-doc/kayfabizarro`

Observed current `kayfabizarro` main during this handoff:

`0b48cd2a924ec1b51547485f4b30b348b3bf1243`

Relevant implementation paths:

- `tools/asset_registry/`
- `tools/asset_registry/librarian/`
- `registry/assets/v1/`

## Verified registry history

The post-merge handover records the consolidated Registry + Librarian implementation merged through PR #8 at:

`cb52cc2b3d89f0c45471d8ebc5bfa0b42477b13b`

At that recorded gate:

- 23/23 tests PASS
- Registry build PASS
- Registry validator PASS
- Rigfacts build/validator PASS
- real Librarian query/handoff smoke PASS
- 12,767 assets
- 99 packs
- 4,642 models
- 415 animated models
- 372 rigged models

A later v1.1 OpenAI Responses connector is also present in repository history.

The public site name says `v1-2`; repository documents inspected here still include v1/v1.1 naming. Treat exact site-version naming as presentation metadata, not a reason to invent a new registry contract.

## Ownership boundary

The Librarian explicitly does **not** own:

- assets
- decks
- donor acceptance
- rig compatibility
- Combat roster membership
- Stunt implementation
- Travel implementation

It returns candidates and exact provenance.

The receiving consumer owns suitability and validation.

## Required workflow for future Travel asset selection

```text
question / need
→ Librarian search/filter
→ inspect exact asset record + dependency status + rig facts
→ preview if useful
→ select candidate(s)
→ export/record kfb.asset-handoff.v1
→ receiving Travel/Studio/Lab slice measures and validates
→ only then implementation decision
```

## Do not

- guess asset semantics from filenames
- crawl huge GitHub folders manually when Librarian answers the question
- treat GLB preview PASS as physics/scale/rig compatibility
- copy assets into a second canonical library
- make candidate selection equal runtime acceptance

## Travel consumer profile

The current documented profiles include Animation Lab, Frankenstein Studio, Combat Arena, KFB Stunt Car Race and Generic Runtime.

**PROPOSAL for later:** add a `KFB Travel Globe` consumer profile once its dedicated repo/contracts exist.

Do not make this a B0 blocker.
