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

## 2026-10-29 · SESSION CUT R7 · GEORG CREATIVE STEERING · PLAY THE HEEL / WRESTLING MASK / SHADOW BALANCE

- **Georg's new creative boundary:** no morally locked player role: a source-ready Demon Lord, Men in Black, Pencil or other actual compatible Character/rigged PropActor may eventually be playable. The player may play a Heel, change perspective, decline moral alignment or briefly experience an infected condition; final interpretation/closure belongs to the player.
- **Additive design:** `GAME_LOOP_ROLE_MASK_SHADOW_BALANCE_R7.md` keeps **Actor identity**, **Kayfabe wrestling-mask persona**, **temporary condition**, and **actions/social consequences** distinct. Masks are a future physical performance layer, not a six-sided Story-Mode replacement, an alignment score or an eraser of NPC memory.
- **Fluff balance:** current WS0 V-583 explicitly says six coloured Fluff kinds, Black Fluffer=`tainted` condition, **not** a seventh resource. Dark-side play can affect local concealment/corruption and colour-side play can restore, without binary moral metaphysics. Any later dark-currency system stays a separately authorized **PROPOSAL**; no mandatory 50:50 global gauge.
- **Source-owner guard:** the MVP Character Select only names a small initial source-based roster. The longer-term all-character/all-rigged-prop goal is not implemented or freely available until actual rig/motion/physics proofs. V-679 short control-loss on infection remains first; voluntary long-form side switch is LATER. Existing single World/Save/Resident/Card/Motion/Combat owners preserved; World R4 STOP remains.
- **Evidence:** GitHub Character Select, Role-Conscious Residents, Dark Fluffer V-583, infection V-679, PR #400 follow-on, Bigger Picture, Lean Memory and R6 reviewed. R7 concept written/read back exactly. **0 runtime, 0 browser, 0 player playtests, 0 visual source-isolation proofs**.
- **Exactly one next gate:** WS0/Georg register intake of role-agnostic player/Fluff architecture. No Stage, merge, Live or runtime follow-on authorized by this cut.

## 2026-10-29 · SESSION CUT R8 · GEORG CREATIVE STEERING · THE CARD ANOMALY / HYPERNORMALISATION / CONNECT THE DOTS

- **Georg's new narrative framing:** KFB Cards appear in the world as unexplained anomalies / suppressed or cancelled ideas; the Fluff Incident with Hunky/Dory/Academy is established, while Hunky's *failed terraforming causing coloured human-surplus Fluff* is a fresh author clarification for WS0 intake. **Do not claim Hunky or the Men in Black know the origin of the Cards** or that the same incident definitively created them.
- **New design:** `GAME_LOOP_CARD_ANOMALY_HYPERNORM_R8.md`. FrizzleBob as metaphysical investigator, Men in Black/alien containment as a credible optional opposite-side motivation, NPC interpretations and player closure. Card/Deck provenance remains canonical; the Almanac's optional "connect the dots" relations distinguish source facts, NPC claims and player hypotheses.
- **Source donor reuse:** `KONZEPT_KARTENVIERTEL_R1.md` has revealable Card buildings covered by HyperNorm; `KONZEPTBLATT_HYPERNORM_SCENELET_R2.md` has MindSphere Rabbit-Hole/Autopilot and nested Card-collage rooms; `KONZEPT_CASCADE_SPHERE_GAME_IN_GAME_R1.md` has bounded impact/repair; Paper-Facade/Threshold grammar separates visible layer from passage/destination truth. These are concepts/donors, **not proof of a finished integrated runtime**.
- **KISS physical forms:** Terrain Card / Sky Card / Card-building facade / optional MindSphere. A giant impact crater is **not mandatory**. Peel, inspect, talk, cleanse or selectively shoot a source-backed fragile cover; do not assume all homes destructible or all cards require violence.
- **Fluff and save:** colourful Fluff may be an incidental break/reveal FX rather than a central currency. Reveal, acquire, share and cover are distinct source-linked events. Players may investigate or contain without a compulsory morality score; no rewriting canonical Card text or erasing actual Resident knowledge.
- **Evidence:** source GitHub documents read; R8 concept file committed and read back; runtime 0 / browser 0 / player 0 / visual donor isolation 0. No Live, Stage, code, PR merge or R4 World restart.
- **One next gate:** WS0/Georg design-register intake of Card anomalies + investigation/containment; later one real Card with one physically coherent cover and one Resident for a paper/visual source-isolated consumer proof.

## 2026-10-29 · SESSION CUT R12 · PLATO'S DUNGEON CAVE / KAYFABE WRESTLING / DIEGETIC MEANING PLAY

- **Georg creative direction:** explore Plato's cave/role-playing dungeon and wrestling as optional metaphoric Game-in-Game incidents in the open world. A player can stage, cover, peel, perforate, restore or reframe a Card-backed image; the same action may be experienced as censorship, protection, theatrical manipulation or clarification depending on the actor, NPC knowledge and situation. Cognitive dissonance is the existing North Star, not an imposed answer.
- **New docs-only concept:** `GAME_LOOP_PLATO_CAVE_KAYFABE_R12.md`. One small optional Shadow Match, two real Cards (Utopia `forget_utopia:1`, Protopia `embrace_protopia:2`), one NPC, and three optional actions COVER / PEEL / CONNECT. Physical impact and rebuild feedback are cosmetic/limited; canonical Card truth, player collection, NPC knowledge, media montage and world-surface state remain separately owned.
- **Verified sources:** `philosopher_dungeon_raid` 20-entry scenario with unresolved PDF card mapping; two mapped 56-card Plato class/hero sets; `ideology_wrestling:10` Plato's Cave with unresolved print mapping; `big_bad_brain_wrestling:1/2` Babyface/Heel mapped; historical Caveman-home/goldmine cave note is ARCHIVED/OUTDATED. Existing Card Quarter, Cascade Sphere, HyperNorm, Infinite Canvas and resident/Almanac source docs checked. Donors are not integrated runtime proof.
- **No ideology truth-game or compulsory fighting:** no single objectively correct meaning, no blanket accusation about real media institutions, no moral meter, no new full cave, no viral/referral reward gate. Optional sharing of self-authored Card links/scenes is later and consent-based.
- **Prior-local status:** R9, R10 and R11 are local document drafts from earlier discussions, **not** persisted to this GitHub branch. R12 is a directly reviewed continuation of the verified R8 and present conversation, not a claim that R9–R11 were merged.
- **Verification:** R12 concept GitHub write and exact readback; 0 runtime, 0 browser, 0 player playtests, 0 visual source-object isolation. No Stage or Live claim. World R4 STOP unchanged.
- **One next gate:** WS0/Georg register intake for one source-pinned Card surface, one Resident and one optional cave/POI scene; no runtime authorization from this concept cut.

## 2026-10-29 · SESSION CUT R13 · TRANSMEDIA GREATER INTENT

- Georg correction: prioritise the Infinite Canvas across comics, Decks, Card knowledge, varied anthropomorphic performers, songs and videos over detailed micro-scenarios or automatic rap-style NPC output.
- Source-backed new concept: GAME_LOOP_TRANSMEDIA_GREATER_INTENT_R13.md. Topic-to-Deck-to-song/video relations are an optional cross-media discovery and interpretation path, not new game or media owner.
- Existing kfb.deck-song.v1 metadata has deckId. Historical 200+ Suno archive count is not a newly verified complete current catalog. No bulk generation or ideological truth judgments.
- R9–R11 remain local-only drafts; this branch contains R2–R8, R12 and R13. Docs only, no live tests or publication.
- One next gate: WS0/Georg editorial intake of the cross-media Greater Intent.

## 2026-10-29 · SESSION CUT R14 · GLOBAL NORTH STAR / CRITICAL THINKING THROUGH PLAY

- Georg identifies the overarching KFB purpose: a playful, satirical, transmedia encounter with human thought, ideologies, disagreement and contradictions; invite primary-source curiosity, intellectual flexibility and human recognition across radically different views without preaching one authorial worldview.
- `GAME_LOOP_GLOBAL_NORTH_STAR_EPISTEMIC_PLURALISM_R14.md` preserves the distinction **respecting a person ≠ endorsing a claim ≠ excusing harm** and **multiple viewpoints ≠ equal evidence**. Cards remain source-grounded; NPCs can disagree, change or keep convictions with real consequences. Cognitive dissonance is the aesthetic resonance space, not XP or a compulsory ideological quiz.
- No manufactured “neutrality”, fake equivalence, contact-guilt shortcut, social referral gate or moral victory meter. The “2–4%” phrase is an aspiration/metaphor, not a validated effect size. Avoid quantifying user belief changes without evidence.
- This is a **WS0 editorial intake** of the existing Bigger Picture / Global Intent, not their unsanctioned replacement, a new canonical master or a runtime proposal. R9–R11 remain local-only earlier drafts. No World/Main/Hub/Stage/Live modification.
- Evidence: current GitHub global references, R13 concept/Return, startup workflow, and R14 file exact readback. Zero runtime/browser/player playtests.
- Exactly one next gate: WS0/Georg review R14 against current global creative guidance and decide whether to add a cross-reference; no other owner action implied.

## 2026-10-29 · SESSION CUT R15 · UNIVERSE IN A NUTSHELL / NO PHILOSOPHER KING

- **Georg correction:** even subtle game mechanics must not prescribe enlightened behavior, improved empathy, intellectual conversion or a hidden politically/philosophically favored destination. The creative author's humane hopes are not gameplay goals, NPC development requirements or “2–4%” outcomes. A world modeled for surprises is different from a player-education funnel.
- **New additive design:** `GAME_LOOP_UNIVERSE_IN_A_NUTSHELL_NONTELEOLOGY_R15.md`. The playful universe models concrete actors, biases, relationships, constraints, causal events, conflicting source Card claims and social consequences, **not final human interpretations**. Plato's cave need not be escaped; staying, leaving, returning, attacking, helping or not caring must not be ordered by an invisible moral score.
- **Clarifies R14 without rewriting history:** Respect persons without endorsing every claim, maintain factual attribution and integrity, preserve NPC refusal and harm consequences, but don't reward agreement with authorial enlightenment. No hidden didactic “nudges”, compulsory research or empathy checks. Chill gameplay, satire and juicy physics are sufficient on their own.
- **Scope:** existing global Bigger Picture, Global Intent, WS0 and game owners remain authoritative; this is docs-only editorial input for them. R9–R11 remain local-only; no new systems or Live/Stage/Hub work.
- **Proof:** exact R15 GitHub write/readback; no runtime, browser or playtests. **One next gate:** WS0/Georg explicitly reconcile R14 with R15, optionally cross-reference the corrected principle in existing creative homes.

## 2026-10-29 · SESSION CUT R16 · YOU CHOOSE SOMETHING, INVITE THE CONSEQUENCES

- **Georg's motto:** “You choose something, invite the consequences.” KFB models situated social and physical effects of a player's Card use, voice, performed role, concealment, revelation, help or refusal, without granting its author an epistemological or moral scoreboard.
- **New commented concept:** `GAME_LOOP_CHOICE_INVITES_CONSEQUENCES_R16.md`. Keeps action, role/presentation, observers' different interpretations, and resulting social/world consequences distinct. Choice → local state → observable NPC reaction → memory → optional next affordance. This is a conceptual chain **reusing existing** Card/Almanac, World/Combat, Resident/ChatterBox, HyperNorm and Lean Event Memory owners; not a new event engine.
- **R15 completion:** no covert education, no philosopher-king outcome, no hidden reward for approved beliefs, no predicted Plato Cave escape or conversion. Still preserve consequences for harm and source/provenance facts. **Cartoon biofeedback** means expressive clay/FX/gesture/sound, not actual player emotion/ideology/physiology sensing or profiling.
- **Creative ambition:** informed, humane, flexible discourse can be a hoped-for side effect, not a scripted achievement or validated effect size. Reactions can include enthusiasm, disagreement, censorship, a communication deadlock, help, indifference, comedy or unresolved conflict.
- **Evidence:** R16 concept write/readback and current GitHub R15/Bigger Picture/Global Intent/R5 source checks. Runtime/browser/player/visual proofs 0, no deployment, no R4 World restart. R9–R11 remain earlier local-only docs.
- **Exactly one next gate:** WS0/Georg review R15–R16 as the anti-teleology/consequential-world correction; owner-controlled cross-reference in existing global creative guidance only if accepted.
