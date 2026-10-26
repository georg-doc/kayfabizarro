# R6 — Mindscape Card Doors × Rest Stone × Fluff-Powered Recall Network
**Date:** 2026-10-26
**Status:** GEORG CREATIVE INPUT + ANALYSED OPTIONS — DESIGN ONLY; no existing KFB runtime API, visual donor acceptance or canon promotion
**Owner:** KFB Mindspace / Egregore / Infinite Canvas planning, existing Draft PR #448, `planning/kfb-mindspace-modular-world-r1-2026-10-24`
**Relevant corrected first-play:** [R5 inner-sphere Hypernormalisation → Gutter](KFB_FIRST_PLAY_HYPERNORMALIZATION_SPHERE_ESCAPE_R5_2026-10-26.md); the earlier Minesweeper/tiny panel-room interpretation is **explicitly SUPERSEDED**.
**Goal:** Add network-navigation utility to real collected Cards without fixed world coordinates, while preserving one Deck/Card/Almanac/World/Portal/Fluff authority.

## 1. Georg's input, precisely distinguished from our design expansions
**A. Card Doors (2026-10-26 preceding idea, not previously proven implemented):**
- An *enterable Mindscape sphere* carries **1–6 landscape-format Cards embedded as doors in its OUTER shell**, with **3 as the usual case**. They are physical-looking thresholds rather than a UI selection carousel.
- Cross a Card Door and cartoonishly **pop** into the related **Deck World / Biome / Card Zone**; related “good neighbours” and useful **mismatch/crossover** Decks build a semantic network (Aby Warburg *good neighbors* as a design analogy, not a procedural relation algorithm already available).
- **Collected and crossed Cards** are remembered through the **Fractal Almanac** with journey/provenance, not cloned into another inventory.
- **Gaussian splats and GPU particles** are candidates for source-faithful idle/impact/transition, reusing the WIP splat/Gutter/VFX lane; a visual splat is not geometry, collision, an entrance destination, or proof of working portal.

**B. New Rest Stone / summoning proposal (this user turn):**
- The player can use a collected Card in/at something called a **Ruhestein / resting stone** (working user term; naming remains open) to call forth a **related or similarly categorized Mindscape**, possibly by **spending Fluff**.
- The manifested Mindscape is **enterable**, serves as a navigational **portal/node/triad**, and permits **further travel** to other related Decks/biomes. This creates the experience of a **multiverse time warp** without requiring fixed procedural-world card stations or globally stationary deck portals.
- Cards can also act as **Terrain Cards**, supplying world/zone semantic identity and collection motivation instead of being consumed tickets.
- The phrase “56 Kartendecks” requires source-aware disambiguation: the existing Overworld canon describes a conventional **deck as 56 Cards** (14 content pages × 4), not 56 decks and not a requirement to generate 56 active portals/spheres. Corpus size and exceptional decks must be read from Registry.

**Not yet a decision:** name `Ruhestein`, unlock conditions, Fluff amounts, automatic category mapping, exact Time Warp causality, 1/2/3-cost mechanic, the possible Trivium 3-door ritual, nor actual destination collection on every crossing. Do not silently freeze those.

## 2. Key architectural insight: mobile semantic waypoints
A Card need NOT encode a world location. It can act as a **stable semantic address** and user-held passport for a *temporary portal node* which the world can safely place when summoned.

```text
PLAYER + OWNED CARD / ALMANAC RECORD
       ↓ select genuine Card, preserve immutable source Card
REST STONE  -- (optional Fluff budget; validate before debit) 
       ↓ existing World owner chooses safe place / arrival anchor
MANIFESTED MINDSCAPE SPHERE (node instance / source-backed recipe)
       ├─ Card Door 1  → close semantic neighbor
       ├─ Card Door 2  → related continuation / same Deck-family
       └─ Card Door 3  → curated mismatch / crossover (optional)
       ↓ actual World/Portal transition, cartoon 'plop' VFX
DECK WORLD / BIOME / CARD ZONE
       ↓ immutable Card ref + hosted journey receipt
FRACTAL ALMANAC / RETURN / RECROSS
```

One node can be *authored and finite* even when its appearance position is procedural. The **semantic graph uses Card/Deck IDs**; the **world placement uses seed and safe POI/Surface owner rules**; the **physical doorway uses the existing Portal/Mode/Scene owner**. This separation is the way to avoid handplacing every Deck location in a potentially endless changing world.

### Three distinct "place" notions (do not conflate)
1. **Card source/provenance**: immutable Card ID / Deck ID / genuine media/crop, current source registry.
2. **Mindscape meaning**: authored category, relation edges, scene recipe/biome affinities, context and possibly an Egregore field's contested interpretation.
3. **Appearance/visit**: temporary in-world anchor POI + player return transform, generated seed and visit/session ID owned by WS1. A temporary anchor disappearing NEVER deletes the collected Card or Almanac history.

One Card can be encountered in multiple biomes and recall a related but not identical Sphere; **same semantic anchor does not imply same generated landscape layout**. A source-backed deck world can have several visited instantiations but remains one deck identity. A moving/restored sphere rebinds a destination via host-owned route identity rather than retaining a stale world coordinate.

## 3. Sphere Card Doors topology
**User rule:** 1–6 doors attached to sphere outer surface, **3 default**; cards are recognizably **landscape-format**, legible originals rather than thin anonymous neon windows. Interior-first first-play R5 remains valid: *inside* the Sphere the player may first discover these as membrane/backside/Card silhouettes before crossing to see the outer mounted doors in the **Gutter**.

**Suggested 3-door relationship vocabulary (not a fixed canon taxonomy):**
- **Kin / Good Neighbor:** Card from same or closely related thematic cluster.
- **Continuation / Reframing:** same Deck family/biome thread, distinct scene/question.
- **Counterpoint / Crossover:** deliberate contrast; candidate could be from another Deck family.

The three are candidate **semantic roles**, not three mandatory door types: repeated clusters and non-triadic 1/2/4–6-door spheres remain allowed. Crossover is deliberately authored/weighted rather than random total incoherence. Warburg-inspired neighbor edges should be explainable via an authored card/thematic relation or research link, NOT invented by generic keyword cosine similarity alone. Provide a neutral "show connection" affordance as Card/Almanac provenance where available.

**Density:** do not expand every 56-card Deck into 56 simultaneously loaded spheres/door meshes. Use a *small surfaced subset* of valid source Cards for each node, seed-reproducible arrangement, cached inactive graph edges and on-demand loading. All 56 remain independently readable/collectible where genuine Deck source exists, without all being portal entrances at once.

## 4. Rest Stone interaction = bringing the crossroads to the player
**Working representation:** a discoverable diegetic stone/rest stop/talisman/bench/ritual object whose surface accepts a real Almanac Card. This is **not** a separate inventory screen, a Hearthstone IP/product copy, or a mandatory fast-travel-only icon.

**Minimum satisfying loop:**
1. **DISCOVER** one genuine Card through inspect/hold/traverse; Almanac saves its stable source reference and how it was encountered.
2. **SELECT** an eligible collected Card at the Ruhestein (or via a later authenticated Almanac access at a rest stop).
3. **PREVIEW** a candidate category/related Mindscape + destination family + optional Fluff cost; display *some reason for relation*. No false promise that its precise coordinates are fixed.
4. **MANIFEST** when authorized and feasible: WS1 chooses a nearby safe location/surface anchor not on a road/OSM protected region or obstructing NPCs; or uses an already safe authored entrance. Egregore/reality visual swelling is presentation only.
5. **ENTER / CHOOSE DOOR / POP** into an actual source-linked Card Zone / Biome / Deck World through existing host portal transition; reach a genuine playable scene, not a portal into empty content.
6. **RECORD** actual crossing as a deduplicated Journey/Almanac provenance event; return, revisit or make a second connected choice; the Card itself stays held and unchanged.

**Failure recovery:** no Fluff debit for invalid/unloaded/unsupported destinations, render failure or cancelled summon. If debit occurs, commit it **only after** a valid host-owned manifest/transition receipt, and refund atomically on failure; no double charging on retries/reload. Preserve a free always-usable **return to last safe origin** to prevent softlocks. Do not spend Fluff simply for visually viewing a Card.

**Rest vs remote access:** first iteration can restrict invocation to a source-owned rest location for clear animation/physics and to teach the mechanic. Later mobile/pocket versions are optional and need different collision/place safety decisions. The ability to get out or home is never contingent on owning the exact source Card.

## 5. Fluff economy: two competing designs, NOT a cost decision
**Option A — Low-friction default (recommended first-play):**
- first source-backed Sphere summon **free** or granted through story;
- subsequent special **remote manifestation** may spend a modest verified Fluff amount or use a cooldown;
- entering a *naturally present* sphere/door and **returning home** costs no Fluff;
- ordinary story progression/cards remain discoverable without repeated grind.
Value: emphasizes expressive play and keeps cross-deck curiosity accessible.

**Option B — Ritual-cost exploration:** each summoned temporary node costs Fluff, scaled by rarity/distance/crossover. Risks punishing exploratory curiosity and creating avoidable softlocks; only viable after playtest and actual Fluff owner/balance validation.

The exact **Fluff currency/ledger owner and existing grant/spend semantics are NOT verified** in this research. No second ledger, speculative math, persistent balance reimplementation or fee schedule. Egregore attention/reach is not equivalent to the player's spendable Fluff; do not mine collective NPC belief as currency without explicit canon.

## 6. "Time Warp" and Trivium without broken history
- **Time warp as player-facing sensation:** material/shadow/sound changes, an abrupt cross-Deck biographical epoch change, nonlinear journey order, fast transit through Gutter. *Narrative chronology may differ from geographic distance*. This does not automatically rewrite the authoritative save, rewind social memory, respawn claimed rewards, or change historical real-world facts.
- **Optional Trivium/triad:** at the standard three-door node, three possible relationship perspectives (neighbor/continuation/counterpoint) enact a choice. "Trivium" is a **working conceptual label**; no new lore canon, logical curriculum, or forced three-choice puzzle without Georg acceptance.
- **Agency:** stepping into a crossover world isn't ideological endorsement. A hostile/propaganda Egregore and a calm personal garden can both have boundaries and returns while remaining different experience types.

## 7. Minimal state/transaction sketch — EXAMPLE ONLY
These are **not** existing KFB fields or authoritative contracts. Map into real owners only after source preflight.

```text
CardSourceRef:       deckId + cardId + sourceMediaRef + revision
AlmanacVisitEvent:   eventId + cardRef + eventKind(seen/held/traversed/revisit)
                     + originNodeRef + destinationRef + storyContext + timestamp/sequence
SemanticNodeRecipe:  recipeRef + category/tagRefs + authoredGoodNeighbors[]
                     + authoredCounterpoints[] + scene/biomeConstraintRefs
RestStoneRequest:    sourceCardRef + originWorldRef + sourceAnchorRef
                     + routeIntent + sessionId + optionalFluffQuote
HostManifestReceipt: hostOwnedWorldAnchor + safeReturnContext + targetSceneRef
                     + routeSessionId + commitStatus
```

**Invariant:** card possession ≠ Card read ≠ door approached ≠ world traversed. Only a completed host-authoritative **crossing** marks `traversed`. Merely manifesting a portal does not award a Card; completing a second crossing is a new journey visit, not duplicate Card ownership. Save→reload preserves receipt/return and doesn't multiply rewards. Player can own many Cards with overlapping semantic spheres but summons produce deduplicated intended nodes within the current session.

## 8. Specific donor/owner routing; evidence level
| Seam | Reuse / current source route | Evidence or open question |
|---|---|---|
| Deck/Card source and 56-card convention | `overworld/docs/ChatGPT_Living_Concept_v23.md` §6/12: 14 × 4 = 56 Cards per conventional Deck; collected Cards persistent/non-consumable; actual Registry for each Deck | Document verified; exact candidate Card and PDF crop acceptance pending |
| Old 3 Scene-Card idea | `tools/KFB-ToolBox/_inbox/cloud-design-worldbuilding-2026-09-18/card-zone-lab-v3/zone-index.json` (`scene-card-door` for D6 1/2/3 and KISS three Scene Cards) | Historical **schema/design donor**, NOT proven 3D portal implementation or same sphere |
| Cards as geographical/semantic entrances | `skills/chat/masterplan/KFB_SPLAT_PROCEDURAL_WORLD_R1_2026-10-24.md` PR #423; player-facing Deck/Almanac selection can link to source-backed Card Zones | Existing stated concept/ambition only, no working world proof |
| Fractal Almanac | current Card/Journey/Almanac owner, Town accepted r017–r022 Card provenance | Authoritative ownership and immutable source retained; actual receiver API pending |
| Hypernormalisation intro sphere | [R5](KFB_FIRST_PLAY_HYPERNORMALIZATION_SPHERE_ESCAPE_R5_2026-10-26.md); H13 original HTML source | Corrected author intent; real H13 and shell donor NOT visually isolated |
| Sphere content / Egregore | [R4](EGREGORE_MORPHIC_META_NARRATIVE_FIELDS_R4_2026-10-26.md); Garden R1/R2/R3 | Egregore optional social interpretation, not mandatory on all Mindspaces |
| World, POI, safe spawn, Portal, Gutter/transition | current active WS1/Surface/World with `BRIEF_WS1_MINDSPACE_POCKET_SCENE_R1.md`; Flatworld/Splat PR #423 | Exact current receiving code head/trigger/return API NOT verified |
| Fluff resource/economy | Existing Fluff lore in Four-Island Recovery + current authoritative owner (to locate) | **Fluff-as-spendable-ledger UNVERIFIED**; options only |
| Gaussian splat and GPU particles | existing candidate Splat/Gutter/scene-VFX and recent WS1 particles POCs, current runtime owner | Source asset/renderer and visual/performance PASS still UNKNOWN; GPU effect is cosmetic, not portal authority |
| Audio and NPC interaction | existing KFB Audio/H13, Resident/ChatterBox/Lean Memory | Reuse without second AudioContext, new NPC/Triplet or narrative voice owner |

## 9. Strongest small proof — after the EXISTING WS0 source gate
**Narrative test, not a new engine:** in corrected R5 First Play, FrizzleBob emerges from the first inside-sphere threshold to Gutter, having crossed/collected one **genuine** Card. He reaches one genuine rest point, inserts this Card and sees a **single small temporarily manifested node** bearing 3 source-backed outward landscape Card Doors; one leads to a close neighbor, one to another scene of same family, one to a deliberately surprising crossover. He chooses one, cartoonishly transitions into a **real** other zone and can safely return; Almanac shows visited Card provenance. The first time can be free.

**Before making it code:** WS0 must first isolate original Lovable breathing source, unmodified H13 visual and one actual compelling first Garden/Creative/Mindscape object as in R1–R5, plus actual Card crop and real World/Portal donor. The Rest Stone proof is an **optional storyboard refinement in the same 10–12 frame route**, not a seventh competing launch workstream.

**Later measurable acceptance questions:** 1) one actual Card and three actual targets readable/rights/source pinned; 2) exact single World/Portal owner transaction and safe return; 3) same sourceCard+recipe+seed yields same legal semantic neighbors while world spawn remains placement-safe; 4) invalid destination has no debit/no lost Card; 5) reenter/reload doesn't regrant Card or respend Fluff; 6) original source Card/Almanac remains immutable; 7) real Splat/particle visual vs cheap fallback A/B, actual GPU and reduced-motion proof; 8) optional Fluff economy doesn't lock story/world exits. No thresholds fabricated.

## 10. One next gate — unchanged
**WS0 MINDSPACE SOURCE + FIRST-PLAY STORYBOARD ARBITRATION:** source-isolate original Lovable + untouched H13 + a real appealing Mindscape/Garden visual, pin one genuine Deck Card and the current WS1 source receiver; **include one small Rest Stone/Card Door recall beat as an optional route in the existing corrected inside-sphere → Gutter 10–12-frame storyboard**, with true Card→semantic-neighbor→node→destination relation and safe return. Label all missing donors SOURCE_REQUIRED and give Georg one meaningful artistic A/B choice; then only a separately authorized WS1 owner may implement. No new public Site/Stage gate, merge, Live or second owner.
