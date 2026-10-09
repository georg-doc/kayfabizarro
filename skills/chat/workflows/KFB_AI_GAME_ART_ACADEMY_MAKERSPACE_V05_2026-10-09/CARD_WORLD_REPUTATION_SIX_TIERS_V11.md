# KFB Card-to-World Discovery, Reputation & Rumor · Six-Tier Projection v1.1
**2026-10-09 · PLANNING / ARCHITECTURE CHECK-IN · NO MVP IMPLEMENTATION**
**Bounded document owner:** KFB AI Game Art Academy / Maker Space planning branch `planning/kfb-ai-game-art-academy-makerspace-v05-2026-10-09`. **Receiving implementation owner:** existing KFB Island Worldbuilder Lab / WorldGraph + PlayerSave + Resident Life and ChatterBox; Card/Almanac, Fluff/Wallet, World publishing remain their existing owners. Does NOT create any new reputation, memory, Card or dialogue runtime.
**User product rule:** six **fractal** reaction/reputation tiers per **World/Island, Deck and individual NPC**, with genuine card collection, favors/courier/crafting, events and rumors altering how the world actually greets the player; **CHILL & FUN** as default, not a grind or compulsory gate.

## 0 · Source reconciliation and hard constraints

- **Deck registry/source:** `registry/assets/v1/decks/forget_utopia.json` (blob `190079f02487d08b040af81839c912bb7519c9f1`), `ignore_dystopia.json` (`b6c0cd3653e773c836e0605263544015f91d5686`), `embrace_protopia.json` (`491c53e48e9d37948f9897a890d94c5246eb57f4`): each declares `metadata.cardCount=56`. The canonical Card key remains **`deckId + cardNumber`**, actual PDF art and authored JSON prevail over generated summaries or alternate artwork.
- World/Deck route `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md` blob `15f8fce5428bfc6c2725b9e3042e9a83966468`: Utopia `forget_utopia`, Dystopia `ignore_dystopia`, Protopia `embrace_protopia`, Town hub is **not** automatically a fourth corresponding deck. Cards stay in the existing Almanac, receipts add provenance, not duplicate Bag objects.
- God Mode/Lean Memory contract `.../SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md` blob `ff4571348634181323059b0babad3b5d862e409c`: `PLAYER_SAVE` includes Card collection, social refs and ledger refs; `LEAN EVENT MEMORY LEDGER` includes encounters, handoffs and quests; `NPC_MEMORY_VIEW` is a derived projection, not a record of transcript; `SOCIAL_RELATION`, `CARD_COLLECTION_ENTRY`, `CARD_PROVENANCE_EVENT`, `MOMENT_RECEIPT`, `ENCOUNTER_RECEIPT` are the intended owner-backed schema families. Chat memory/Production Control is not gameplay truth.
- Resident Life `skills/chat/RESIDENT_LIFE_SEMANTIC_MODEL_PREP_2026-10-06.md` blob `17e5e0e36eb7aaa949a077188bc1509a79681785`: existing proposal for `RelationshipMemory` with `familiarity`, `affinity`, optional `trust`, salient event refs; keep its owner. Existing `relationshipBand` proposal has only unknown/familiar/friendly/close/tense: a new six-tier DISPLAY projection must NOT silently overwrite this older owner enum.
- Resident reactions `skills/chat/RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP_2026-10-06.md` blob `776c79908e09d1802396a4498a86e3c10aab8f18` route semantic events to Affect → Pose/Gesture/EyeRig → ChatterBox/Audio → recover. Performance is not state truth. Negative encounters can yield actual skepticism/banter, not an unearned eternal debuff.
- **Current sibling Fluff owner** `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09` (re-fetch exact head, observed `fb8535a457c72efda12d2b140afce2cfe85ebcf1`): `KFB_FLUFF_CRAFTING_ALMANAC_LAYER_CONCEPT_V0_3_2026-10-09.md` (`950f11df2178045fb7351f0470b2441d8a24773e`); `KFB_PLAY_CRAFT_LEARN_OPTIONAL_SURVIVAL_PROFILES_V0_4_2026-10-09.md` (`de686cf04f47d5fe6008cd6316223851fbccb5c1`); latest Return v0.5. One owner-approved `CraftRequest`, one wallet, D6 six Story Mode colors × HIGH/LOW, chill default. Fluff HP and lore/material wallet stay distinct. Rewards create real `CardProvenance`, `Courier`, item or social event only; never second Card economy.
- **Active receiving Worldbuilder Lab** `sync/lab-rkit-2026-10-09@3c9d7379f5ba15a02434400fff706a1b8a6cca3b`: `tools/KFB-ToolBox/_inbox/KFB Island Worldbuilder Lab/docs/SPEC_WORLDBUILDER_GODMODE_VISION_R1.md` blob `b53fbf75c87a7a8c6aa6bdff8c54d9585ad545fd` says islands have **0…n associated Decks** (not 1:1 immutable World=Deck) and a future Backpack pocket portal toward places whose Card is held. `docs/KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md` blob `1b8db9f93e37a2528ee439c8ea577ecbc66ce0a2` explicitly parks Fluff/Backpack/God Mode post-MVP. It carries header date **2026-10-10** although read on 2026-10-09; current GitHub source is authoritative, but do not infer a completed future-world build from that header. Lab is Vite/three.js r186/WebGL2. Older WB2 R4 remains STOPPED/NO MVP; do not transfer ownership between these streams.
- Existing `GATEKEEPER_ENCOUNTER_GRAMMAR_V10.md`: World owns deterministic access result, ChatterBox/NPC present it. Access from Card or valid delivery is an encounter policy, not a general platform/content-rights bypass.

## 1 · Single truth, three six-tier views

**Fractal six-tier design is a presentation/reaction contract, NOT a new D6 Stat/Fluff currency or independent persisted XP meters.** Compute three small `ReputationView` projections from stable existing owner-backed records:
- `DeckStanding(playerId, deckId)`: `nUniqueCards/totalCards` + relevant quest/provenance receipts + salient narrative deeds; scopes to Deck identity even when many islands reference that Deck.
- `WorldStanding(playerId, worldId)`: combined linked-Deck evidence + witnessed world events/courier/help; scopes to WorldGraph/WorldRecipe stable ID, not just name or deck theme. World can have `0…n deckIds`. A world without a Deck can still derive familiarity from valid encounters; multiple linked decks should NOT sum raw counts as if one 112/56 collection. Derive a capped/weighted projection or choose declared primary Deck only after World owner confirms.
- `NpcStanding(playerId, residentId, worldInstanceId?)`: existing Resident RelationshipMemory and direct encounter/help/trade events + selected genuinely delivered rumors, independent of deck percentage. NPC can dislike a popular world hero or know an obscure courier well. Stable Resident ID + local instance scope prevent accidentally broadcasting a personal relation to every NPC variant.

**A separate social valence overlay**, e.g. `warm | neutral | skeptical`, comes from already proposed affinity/trust/recency, not another ladder of six. The player sees short reactive dialogue/gesture/priority, NOT three RPG bars. World/Deck/NPC tier may differ without conflict. Avoid permanent labels (“evil”) or morality scores. One meaningful experience at a lower Tier may produce more vivid dialogue than raw card count.

## 2 · Six proposed canonical-facing reaction bands per scope

Ordinal `1…6`, used at World, Deck and NPC levels with scope-appropriate evidence. English *working* public-facing labels; these are not canonical final strings.

| Band | Player-facing mood | Deck fixture for 56 cards (illustrative) | World/NPC interpretation |
|---|---|---|---|
| 1 `STRANGER` | Curious stranger / newcomer | 0 unique Cards | NPC can be welcoming by default; world unknown not hostile |
| 2 `MESSENGER` | First contact / courier | 1–2 Cards | first introduction, invitation, delivery, recognized visitor |
| 3 `KNOWN_FACE` | Recognized visitor | 3–9 Cards | repeated visits or a few shared moments |
| 4 `LOCAL_FRIEND` | Friendly local / helpful familiar | from **10** Cards | personal favors, gifts, builds or successful deliveries |
| 5 `TRUSTED_ALLY` | Trusted friend / valued contributor | provisional **28–50** Cards | sustained source-proven helpful deeds / reputation |
| 6 `LEGEND` | Island / Deck legend | **51–56** Cards (>90% of 56; 51/56≈91.07%) plus appropriate witnessed deeds if a *positive hero title* is to be shown | NPC-local “legend” may be reached through exceptional personal service without 51 deck Cards; world legend requires world-scale recognition, not universal NPC affection |

These **numbers are a proposed tuning fixture, NOT accepted balancing**; 28 is midpoint heuristic, 10 and >90% are user-specified direction. On Deck progress, tiers may be derived deterministically by unique Card count alone; for World/NPC standing, events are the dominant evidence and counts provide recognition cues. A completion of **56/56** could award one *optional distinctive title* independent of the six-tier ladder. Avoid downgrading completed Deck Card milestones because a NPC is annoyed; recent negative valence changes presentation, not unique Card ownership.

**Six-tier symmetry across scales ≠ same six thresholds or six mutable counters.** Actual World/NPC thresholds need owner-approved data/feel testing, possibly with light hysteresis so a single harmless misstep does not flip reception back and forth.

## 3 · First Card as destination clue & lightweight access

- First received/gifted/looted/crafted/delivered **canonical source Card** with a linked `deckId` can mark that Deck/associated World **DISCOVERED**. Some authored gates may treat `knownDeckCard(deckId)` or validated courier `DeliveryOrder` / `Invitation` as enough to enter. Neither means all linked worlds automatically open or all permissions are bought.
- The WorldGraph owner decides `DISCOVERED`, `ROUTE_KNOWN`, `ENTRY_GRANTED`, `VISITED` and `FAST_TRAVEL_KNOWN` separately. Access for multi-deck Worlds should be an explicitly authored ANY/ONE or quest rule, not a global “any Card opens any world” hack.
- A messenger may legally carry a Quest Card *in custody*. The existing Golden Journey establishes canonical Card acquisition/provenance and delivery as separate states; the Card may appear in Almanac and be physically “in delivery” without producing two owned Card objects.
- 0 linked-Deck Cards → discovering the gate and accepting one short NPC gift/courier/Fluff craft must remain possible (Chill). No card should mean an interesting invitation, not a locked dead-end. Standard/Hard may add an optional short quest/puzzle; basic Academy practice and freely allowed exploration remain reachable.
- After unlock, grant or discoverable route persists via existing `PLAYER_SAVE`/WorldGraph; actual entry is checked on walk/drive/flight/portal/reconnect; NPC/threshold shader only present truth. Once an island is legitimately accessible, gatekeeper need not replay first-time ceremony on every reentry.
- Provenance routes include Resident Gift, courier, loot from existing Combat or World event, direct find, authentic Fluff alchemy via one CraftRequest, or creator-approved Card receipt. Avoid paid lootbox/gambling-style mechanics or opaque random access gates. Optional randomized in-game finds must not be the only path and require clear provenance; no new cash economy.

## 4 · One event ledger drives world memory and NPC behavior

**Suggested small taxonomy** (conceptual tags mapped to existing Moment/Encounter/CardProvenance/Quest/SocialExchange owner contracts, not independent DB tables):
`CARD_ACQUIRED`, `COURIER_ACCEPTED`, `COURIER_DELIVERED`, `COURIER_DELAYED`, `NPC_GIFT`, `NPC_FAVOR_DONE`, `MAKER_GIFTED_PROP`, `CRAFT_CARD`, `ISLAND_FIRST_VISIT`, `BOSS_ATTEMPT`, `BOSS_CLEAR`, `RESIDENT_HELP`, `BETRAYAL_OR_CONFLICT`, `RUMOR_HEARD`, `WORLD_RECOGNITION`, `TITLE_GRANTED`.
Existing `eventId`, world/deck/resident refs, actor/player and related original `CardRef`, timestamp/game-session/quest deadline, positive/negative valence, salience and provenance are sufficient as **a suggested projection input**. Map to existing schema fields; no forced migration or full message transcript. Timers track in-world/active-play deadlines, not actual real-time months while a user is absent unless a separate owner explicitly authorizes that behavior.
- `COURIER_DELAYED` can yield gentle “still waiting for my Card” teasing; `BOSS_ATTEMPT` repeated three times can produce sympathetic satire rather than a punishment; `NPC_FAVOR_DONE` or Maker-made prop yields trust, physical thank-you and maybe witnessed rumor.
- The authored Card `lore/power/title` and island theme can condition reaction content, but actual Card PDF art/JSON owner remains canonical. The NPC need only store `deckId+cardNumber` and receipt IDs; do not duplicate 56 JSON Cards into NPC brains.
- Resident dialogue and gestures read event-derived views, never generate rewards/penalties. ChatterBox has a valid silent path; short 1–2 sentence exchanges, emotional eyes/pose and meaningful memory are preferred to bureaucratic compliance speeches.

## 5 · Rumors propagate sparingly, not by an LLM telephone network

**Minimal rule:** one durable meaningful direct event may yield up to a small bounded number of local `RUMOR_HEARD` references at actually plausible connected Residents in the same World/region/faction, **one hop in the first implementation**, salience/cooldown/provenance guarded. No NPC graph flood; no re-amplification of the same event (source event ID stays stable), no fabricated rumors, no background LLM running all NPCs.
- A witnessed helpful courier/repaired machine can travel locally and increase recognition of new NPCs.
- Missed favor may become a mild skeptical line; support apologies/recovery, time-based fade of *sentiment* without deleting the recorded receipt.
- Respect world/zone boundaries, story chronology and privacy. An NPC outside the rumor network need not know that the player lost a Demon Lord fight. A negative rumor is challenge-flavor, not irreversible global “bad reputation.”
- Derive `NPC_MEMORY_VIEW` with bounded recent salient receipts and relationship; read-only `ReputationView` selects a current reaction band + valence + optional rumor. Persist source event IDs and actual relation facts only.
- Scope fanout / neighbor transmission and hysteresis must be measured; later cross-island fame requires an authored source (Bard, courier, media bulletin, FrizzleBob broadcast), not omniscience.

## 6 · Visible results with minimal mechanics

Presentation uses already planned KFB `Resident Performance Cue` / ChatterBox owner:
- Tier 1 curious question, open welcoming stance; no default hostility.
- Tier 2 recognizes first Card/messenger assignment and offers route hint.
- Tier 3 addresses prior meeting or returning character, eye/pose softens.
- Tier 4 remembers a specific personal favor, offers an optional reciprocal favor / item, maybe larger smile.
- Tier 5 a nearby NPC has heard of an actual useful deed, social greeting/praise or harmless skeptical comparison.
- Tier 6 regional hero reaction, source-authored celebration/short song/absurd title derived from owned Deck motifs. Fanciful earned titles are optional cosmetic epithets with Card provenance, NOT new authority or arbitrary invented canonical Card.

Do not create a second rank UI or overlaid meter in the normal world. A visible Almanac may show one compact per-Deck count and meaningful story milestones; player could opt into detailed metrics later. The world itself should provide the principal feedback via **eye direction, leaning, greetings, favors, gossip and local invitations**, not numeric HUD clutter.

## 7 · Best small review fixtures (NOT current MVP implementation)

Fixture A: **Town messenger first Card → Dystopia access.** Player receives a genuine Card of `ignore_dystopia` or a validated courier order, sees Dystopia route, 4GTN-style gate checks derived World state and lets player pass with a source-backed gesture. A character who holds no such evidence gets one simple invitation or alternate. Existing Golden Journey is explicitly non-linear; Utopia/Dystopia may be visited in either order.

Fixture B: **10/56 + one helpful interaction → changed NPC greeting.** Same exact Deck/World identity and returning NPC, without duplicate Card or new Social Reputation store. “Friend” reaction should be visible, but a different NPC may still be skeptical.

Fixture C: **51/56 + meaningful deeds → optional legend/absurd title.** Verify one exact named world and correct percent; not all NPCs automatically trust. 56/56 may earn unique Deck-specific title choice after provenance review.

Fixture D: **Courier late / third boss defeat / Maker gift → plausible bounded rumor.** Record source receipt, one nearby connected Resident updates a short greeting; redo/retry does not duplicate rumor or debit Fluff; progress can recover after completing task.

Acceptance for later Work architecture review: unchanged old Golden Journey, real Card ID/data, exact fresh Save→Import→Reload with same collections/reputation/reaction, cross-deck/multi-island/0-deck, access routes (foot/drive/flight/portal), no 2nd NPC memory owner, no World/Resident performance rewrite, no AI verdict. A fresh browser/source proof would be required before classifying any of these as RUNNING.

## 8 · Integration ownership + exact questions for Claude Code

**Read before check-in:** current Lab source `sync/lab-rkit-2026-10-09`, `docs/KFB_MASTERPLAN_MVP_DRIVE_LOOP_R2.md`, `docs/SPEC_WORLDBUILDER_GODMODE_VISION_R1.md`, `docs/PROJECT_STATE.md`; the Academy v1.1 memo here, `GATEKEEPER_ENCOUNTER_GRAMMAR_V10.md`, and sibling Fluff v0.3/v0.4 + Return. Also existing `DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md`, `SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md`, `RESIDENT_LIFE_SEMANTIC_MODEL_PREP_2026-10-06.md` and original Card registries.

Ask one existing **Lab Claude Code steering/WorldBuilder owner** for READ-ONLY **architecture compatibility review**, not implementation:
1. Does current `kfb.island-config/1` / WorldRecipe preserve 0…n `deckIds` and stable `worldId`/portal/threshold anchors for card-derived discoverability?
2. Is canonical Card uniqueness/provenance from existing Card/Almanac/PlayerSave still owner-backed with deterministic persistence across restart? No second inventory index?
3. Which *actual* owner code/API (not just planning docs) implements PlayerSave/WorldGraph/Lean receipts, and where are real gaps before post-MVP reputation projection?
4. Can `ReputationView` be a **pure six-stage selector** over existing collection + Resident RelationshipMemory + receipts, with separate valence and no new event store? For 0…n Deck Worlds and multiple NPCs, no global count collision?
5. Can existing Resident Performance/ChatterBox/Voice read that selector as an input without letting generative text award cards or permissions?
6. Can existing F-S13/World threshold planned seam eventually consume a derived `knownDeckCard`/courier permission so walking, flight, portals and reload agree? Not a new login/auth owner?
7. Can current Fluff CraftRequest and courier transaction produce exactly one canonical Card provenance and reputation event without duplicating Fluff debit/rewards?
8. What is the **smallest post-MVP owner-authorized vertical proof** to test *first Card → gate reaction → Save/Reload* plus *favor → neighbor rumor*, preserving the active Drive Loop? Classify KEEP / ADAPT / AFTER_MVP / BLOCKED and list one future gate, no code writes.

**Important:** Do not widen active MVP-1 Town+Protopia or MVP-2 Drive Loop, current stopped WB2 R4, public Site, or create separate Player progression service. A coherent deterministic replay sample/spec is okay as design evidence, but no new runtime or migration on the Lab branch at this check-in.

**Next actor:** Claude Code steering in its existing Worldbuilder Lab context receives this document and sibling Fluff docs for architecture check-in; it must not become a second Academy executor or write Academy owner files. Academy's active `ACADEMY_MAKERSPACE_VISUAL_SOURCE_PROOF_R1` still belongs to Claude Design (visual source proof), independently. No new Academy Stage/public URL.

## 9 · Decisions deferred to human/game feel, NOT blockers now

- Final English stage names; exact balance for World/NPC tier transitions and thresholds; whether 51/56 alone suffices for Deck Legend vs social deeds for Hero; optional title-generation source rules.
- Whether particular worlds start open or require a first-card/courier invitation; how multi-deck Worlds derive accessibility from 0…n linked Decks; prevent protopia or Golden Journey accidentally becoming gated by default.
- Rumor radius, cooldown and source salience; whether bad reputation turns into comical notoriety rather than progress loss.
- How an optional loot-box-style free in-game reward is transparently implemented, if ever; **no paid randomized gate**, no mandatory randomized progression.
- Exact player-facing Almanac presentation: six stages should mainly alter NPC behavior, not inflate HUD stats.

**Implementation readiness:** source-aligned conceptual spec ready for read-only check-in only; 0 actor/browser/gameplay tests run. No PR/merge/publication in this planning slice.
