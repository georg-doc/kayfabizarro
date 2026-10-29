# Return · KFB-Verteiler · Deck-/Themengewichte R1 · 2026-10-29

**Status:** DATA-DRAFT SAVED / STRUCTURAL CHECK PASS · **NOT RUNTIME** · NOT ACCEPTED BY WS0/WS1
**Owner:** WS0 / KFB Decisions Register (review authority); one GitHub documentation branch
**Repository:** `georg-doc/kayfabizarro`
**Branch:** `docs/kfb-verteiler-deck-weights-r1-2026-10-29`, forked from `docs/kfb-decisions-register-2026-10-11` @ `6f82f0fa4383ff2387933a85476295b8ed1091bd`
**Delivery:** `replies/KFB_VERTEILER_DECK_WEIGHTS_R1.json` · schema `kfb.verteiler-deck-weight-draft/1`
**Verified implementation checkpoint:** `a6d8e603b58a008f7404f2760483a14564c15209`
**Verified JSON blob:** `839572a43c162ac758603bc4120f3509457f1efd`

## Outcome
Read the currently named V-1007 stochastischer Verteiler, V-1002 Kartenviertel, V-1004/1005/1006, V-963 WS1 I2 brief and WS0 handoff; read the current six-palette colour concept, kfb-place grammar, the 130-deck Registry index, three canonical future Deck shard card maps, 132-character index (13 Dramatis Personae), and the existing Dramatis Personae read-only Return. The original Konzept was independently cross-checked with the Dropbox copy. GitHub is authoritative when copies differ.

Created one data-only draft with **18 profiles** (including non-deck Town and cross-genre review profile), **130 one-to-one deck family assignments**, and **three explicitly verified exhibition overrides, nine canonical Card refs**. Each profile contains category/topic/mood, weights for six actual world palettes, colour-role emphasis, six canonical Story Modes, weighted semantic neighbours, a three-part prop set and a three-part landmark composition, descriptive audio bed family, billboard motif filters, two surreal exception candidates and optional existing Resident affinities.

The three future worlds remain `forget_utopia`, `ignore_dystopia`, `embrace_protopia`. No character signatureDeck field was overwritten or silently filled. Registry semantics and actual PDF Card artwork remain the source of truth. Numeric weights are **proposed starting values, not observations or approvals**. The profile strings are search/composition cues, **not accepted asset IDs**; the actual props must be source-isolated and resolved to the 5,595 accepted Prop-Pool tiles and `kfb-place` before integration. Audio names are families only, not new sound files or mixer modules.

## Narrow evidence
- Source registry: `registry/assets/v1/decks/index.json` blob `b1399317c33fbd6ff17a622da68c684207bd5b4c`; index records 130 decks and 6,985 Cards.
- Colour concept: `kfb-color-concept.r1.json` blob `fa78b9e46f0edd4018aecc216297cb2f4332c207`; six palette keys from real source.
- Characters: `CHARACTERS_R1/index.json` blob `77e39924c0e8ae6ec7f1d11cce10b252dce4bdd0`; exactly 13 flagged Dramatis Personae names for candidate affinities.
- Independent static read-back and structural/source tests: **627/627 PASS**, zero failed. Included 130 deck IDs, complete family coverage, canonical palette and Story Mode keys, all numeric sums, eighteen prop triplets and eighteen landmark triplets, resident references, neighbours and nine live registry shard Card identifiers.
- Exact JSON read-back matched content after GitHub write; branch head confirmed `a6d8e603b58a008f7404f2760483a14564c15209`.
- No renderer, browser gameplay, audio audition, asset source-object isolation or seeded distribution run was performed. **No Stage, GPT Site, Cloudflare, Live, merge or acceptance claim.**

## Deliberate review queue
1. `the_biological_metropolis` has low-confidence `meta_crossgenre` fallback, pending WS0 decision whether the best family is `medical_body` or another source-backed domain.
2. All numeric priors including anomaly cap 0.03 require WS1 seeded empirical frequency checks. No invented forbidden adjacency list.
3. Prop/Landmark triplets are semantic descriptors; each proposed object needs an actual approved Prop-Pool ID, isolated visual and contact/scale gate before use.
4. Only the three exhibition decks have verified per-Card billboard refs; remaining decks are cover-first until Card crop checks.
5. No actual audio loops selected; WS-Audio I6 is the mix/catalog owner. No signature Card or permanent deck role assigned to a Resident.

**Exactly one next gate:** WS1 I2 loads this as an **optional proposed prior** in the new `Settings › World` seed browser, runs a fixed-seed distribution/adjacency replay against the existing `kfb-place` contract, and returns the measured outcome to WS0 before any gameplay promotion. WS0 owns review, register decisions and any eventual acceptance. No action is required from Georg to retain this draft.

## Ownership/routing
This candidate changes no runtime, audio mixer, figure assets, canonical registry, Hub route or deployment. Keep the decisions register and Hub canonical metadata unchanged until WS0 accepts or changes an actual gate/routing decision. The branch/PR is a review candidate; **do not merge automatically**.
