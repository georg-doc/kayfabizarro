# Game Loop / Fluff Economy · additive Session-Cut Changelog

**Scope:** KFB gameplay conceptual design, not live KFB runtime or decisions register. New entries are appended; historical entries remain verbatim.

## 2026-10-29 · SESSION CUT R2 · PROPOSAL / NOT DECIDED

- **Source intake:** existing `GAME_LOOP_R1.md`, `BRIEF_WEBCHAT_GAME_DESIGN_R1.md`, `FLUFF_WORLD_DRESSING_R1.md`, `CONCEPTS_FLUFF_MINIGAMES_R1/OVERVIEW.md`, `SPEC_FLUFF_SUCTION_R1.md`, `BACKLOG_BLACKFLUFF_INFECTION_R1.md`; GitHub routing, current World/Island STOP, older Overworld HP concept checked.
- **Result:** `GAME_LOOP_FLUFF_ECONOMY_R2.md` introduces one optional 10–20 min session loop, 3 play styles, receipts/visible world response, six-colour Fluff Wallet hypothesis, income/spending table, self-heal nomenclature firewall and one bounded next candidate proof.
- **New idea, not canon:** player uses released/harvested Fluff to make a concrete visible change, not to unlock mandatory exploration; sample balancing 12 incoming → 6 crafted Card + 3 repair → 3 carry-over. Balanced play/colour scarcity **not yet tested**.
- **Preserved decision boundaries:** exactly one real Card ID and Almanac provenance; cards never duplicated or paid for again if owned; no compulsory Life Tree per island; High/Low gameplay pending; Construction vs Damage vs Transfer distinct; WS1/World, Combat, Card and PR #356 retain original owners.
- **Design review:** KFB Game Improvement Lab five perspectives as evidence-only, not a five-agent run or hands-on playtest.
- **Tests:** 0 runtime, 0 browser, 0 player sessions; one code-based document/arithmetical preflight and GitHub exact-content readback on concept commit `1e4b7625892e1e1fa062ad1097a2d932597d2458`.
- **Unresolved:** HP vs collectable Fluff naming; High/Low activation; 1-of-each recipe; price/rate/respawn tuning; whether visible place-change should be primary reward.
- **One next gate:** Georg **TUNE/PASS** on player-visible place-change plus six-colour Wallet as the design hypothesis. No runtime/Stage work authorized by this entry.

## 2026-10-29 · SESSION CUT R3 · GEORG CREATIVE STEERING · CARD/WORLD-KNOWLEDGE FIRST

- **Georg's clarified priority:** main player objective is collecting real KFB Cards; Residents start with a small 1–6 Card knowledge seed and receive additional cross-deck Cards via courier and social exchange. Mismatches motivate dialogue, satire and encounters about propaganda/censorship/opinion corridors. Fluff is a lower-priority physical resource cycle/optional cumulative score.
- **New additive concept:** `GAME_LOOP_CARD_WORLD_KNOWLEDGE_R3.md` preserves R1/R2 but **supersedes R2's primary reward ranking**. Visible place repair and six-colour Crafting are now optional, not the main loop or compulsory Card gate.
- **Runtime reuse:** source-locked `RESIDENT_KNOWLEDGE_PROFILE` already has primary/counterpoint decks and encountered Card refs. Character interpretation, agreement, Card identity/provenance, Lean Memory and quote visibility stay distinct. One canonical Card may be shown/shared without duplicating the player's Almanac collectible.
- **Diegetic counterplay:** Men in Black redact a specific quote, Eraser removes bubble words, Goo occludes visible meaning, identifiable speakers shout propaganda/interpretations. Restore provenance or dispute spin; never mutate the original Card or force agreement.
- **Evidence:** existing Card World Seed Pipeline, Bigger Picture, Resident Life/Reactions, Town character direction and R1/R2 read from GitHub; source-only review, 0 runtime, 0 browser and 0 playtests.
- **Next gate:** WS0/Georg design-register intake for Card-collection-first hierarchy and one two-Card cross-deck Resident scene. No Runtime, Hub, Stage or Live changes.

## 2026-10-29 · SESSION CUT R4 · GEORG CREATIVE STEERING · LEAN MEMORY / SOCIAL REPUTATION / WAYFINDING / ACHIEVEMENTS

- **Georg direction:** persist unique Card acquisition (binary per canonical Card ID), NPC knowledge changes and remembered exchanges in the existing save/Lean Memory; seed 1–6 curated Cards per NPC; derive small reputation/recognition from meaningful card shares and faction relations; keep friendship from help/gifts as a separate relationship. NPCs can recommend people, Card sources, Decks and thematic clusters; point in world and optionally hand off a valid route/POI to the compass. Collecting different decks/completing one can earn satirical Meta-Plaketten.
- **Additive design:** `GAME_LOOP_LEAN_MEMORY_REPUTATION_WAYFINDING_R4.md` details save/ledger/Almanac ownership, canonical Card uniqueness, social-tier *proposals* (1/3/6/10 recognition; not automatic affection), knowledge vs belief, verified vs rumored pointers, exact target vs unresolved route and optional milestones.
- **Verified donor inventory:** `SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md` A–F memory layers + receipts; `DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md` resident knowledge owner; older Overworld `journey.js` and `factions.js` show historic reputation code only; KFB HUD Flight Board compass source exists; `Presenter_Point_Indicate` is a deferred authoring label, NOT a verified animation; Travel Globe target-fed paper signposts are a historical donor; recalled Reddit source not pinned.
- **No fabricated proof:** 0 runtime tests, 0 browser tests, 0 player playtests; source-backed conceptual review, arithmetic/progression milestone semantics inspected. No active runtime change, no new owner, no Hub or Stage update.
- **Exactly one next gate:** WS0/Georg intake R4 design and nominate one real NPC + two canonical Cards + confirmed POI for a bounded later source-aware dialogue/wayfinding/save proof. Runtime remains separately gated.

## 2026-10-29 · SESSION CUT R5 · GEORG CREATIVE STEERING · ORDERED CARD EXPOSURES / SIGNAL MEMORY

- **Georg's addition:** persist the **order** in which the player obtains canonical Cards and each NPC first encounters a Card, including when a cross-deck mismatch arrived through an actual courier/social interaction and from whom. This can make different player save journeys produce meaningfully different NPC dialogue sequences.
- **Soft hypothesis, NOT a new rule/AI:** earlier exposure may carry a mild primacy bias, moderated by latest relevant events and the Resident's authored identity. Do not impose a numeric psychological model, irreversible first-card beliefs, universal alignment scores or extra runtime owner.
- **New concept:** `GAME_LOOP_SIGNAL_MEMORY_R5.md` uses existing `PLAYER_SAVE` + `LEAN EVENT MEMORY LEDGER` + `NPC_MEMORY_VIEW` ownership; source-authored initial 1–6 Card seed order is not falsely treated as a historical lived event; receipts preserve meaningful ordered first-sharing/context and optional later re-interpretation, deduping actual rewards.
- **Minimal proof for later owner:** two disposable per-player save orders with the same final pair of real Cards, equal membership but differing ordered first-exposure receipts, source-grounded short dialogue and exact fresh import. Nothing implemented now.
- **Source state:** current GitHub memory architecture, Card pipeline, R4 and R4 Return re-read, owner/branch current. **0 runtime, 0 browser, 0 human gameplay tests**. No Hub/Cloudflare/Live or runtime alteration.
- **One next gate:** WS0/Georg intake for minimal ordered Card receipts on the existing Lean Memory pipeline; a paper A/B order check only after content source selection.

## 2026-10-29 · SESSION CUT R6 · KAYFABE TOY FLUFF / BLACK FLUFFER / OPTIONAL ALCHEMY & LOOT

- **Georg direction:** Card collection and NPC world knowledge remain primary; Fluff should be a physically enjoyable low-level material ecology and satirical NPC-work resource loop, not a large RPG economy. Correction: **Kayfabe** (not the accidental voice transcription).
- **R6 concept:** `GAME_LOOP_KAYFABE_FLUFF_TOY_LOOT_R6.md`. Six existing Story-Mode Fluff colours, **one optional** six-of-six alchemy recipe at the Witch/Alchemist for one missing real Card; no seventh type or 12-component High/Low market. Other card discovery through quests, residents, found chests, exploration, ordinary rewards and source-backed encounters.
- **Black Fluffer source:** V-583 heals with a **reused action**, becomes peaceful, stops Goo, emits finite colourful Fluff once. `dark_fluffer` tainted state is distinct from coloured types; no extra weapon/FX/runtime owner. `Grab & Hook` currently UNVERIFIED as exact runtime donor, retained only as tactile gameplay candidate.
- **World-source reuse:** WFC/`kfb-place` seeded **placement** is separate from the canonical reward/loot table. Persistent object opening/unique Card provenance must be idempotent; guarded encounters should not universally force combat. V-480 industrial harvest/recycling world causality is enough without a whole production market.
- **Evidence:** re-read relevant WS0 register Fluff/Dark Fluffer/Witch, six-colour dressing, minigame, suction, placement/Verteiler and Game Loop R1. GitHub concept file written and exact ref/file checked. **0 runtime, 0 browser, 0 player playtests**.
- **Next gate:** WS0/Georg intake of R6 toy-first secondary Fluff ecology, followed only under receiving-owner approval by one tiny source-isolated interaction POI proof. No runtime/main/Hub/Stage change.
