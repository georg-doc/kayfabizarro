# KFB Game Loop R4 · Card Knowledge, Lean Memory, Social Reputation, Diegetic Wayfinding, Meta Achievements
29.10.2026 · Georg creative steering · Webchat design session

**Status: GEORG CREATIVE DIRECTION / PROPOSAL FOR CONCRETE TIER VALUES, NOT RUNTIME OR VERIFIED PLAY.**
**Additive lineage:** `GAME_LOOP_R1.md` → `GAME_LOOP_FLUFF_ECONOMY_R2.md` → `GAME_LOOP_CARD_WORLD_KNOWLEDGE_R3.md` → **R4**. The R3 direction is confirmed and specified: unique cards + shareable world knowledge lead; Fluff economy stays secondary. R4 adds persistence, social status, inquiry/navigation and optional achievements, not a new gameplay authority.

**Concept intake owner:** KFB_HUB / `30_DECISIONS/replies` on the existing PR #460 planning branch. **Receiving owners remain:** canonical deck/card registry + Almanac; existing `PLAYER_SAVE` / Lean Event Memory / NPC Social Memory; Resident Knowledge and ChatterBox; World/WS1 destination and navigation; existing Motion/EyeRig and HUD. **No second memory/quest/route/animation owner.** Island R4 still STOP/NO MVP; nothing here restarts that runtime.

## 1 · A player has many reasons to explore, not one compulsory leveling ladder

**Main objective:** explore and collect unique real Cards, complete selected decks, find related decks/topics and share cards with interested or opposing Residents. A new deck can invite a new setting, friend, rivalry or satire. All journeys remain optional; no material spend to get permission to talk/travel.

`Explore → discover real Card / topic → meet Resident → ask / show / courier → NPC learns that this Card exists → interprets, rebuts, welcomes or misunderstands → remembers meaningful event → may recommend next known person/place/Card → player chooses route → Almanac collection + relationships deepen.`

One Player Card is a canonical `deckId:cardNumber` identity; acquisition is **binary set membership**, not a duplicate item stack. A deck's card count can derive from its verified registry `cardCount`, e.g. current Utopia and Protopia registry shards each report 56; no assumption that all decks contain the same number.

## 2 · Persistence: reuse existing Lean Memory contract and distinguish four claims

The existing `SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md` explicitly separates **A PLAYER_SAVE**, **B LEAN EVENT MEMORY LEDGER**, **C NPC/SOCIAL MEMORY**, **D FRACTAL ALMANAC**, **E AUTHORING HISTORY**, **F CHAT MEMORY**. **Use A–D for game truth; never ChatGPT chat memory or an invented independent memory backend.**

| State/question | Durable truth/owner | Example (illustrative) |
|---|---|---|
| Does player own this Card? | `CARD_COLLECTION_ENTRY` via PLAYER_SAVE / canonical Almanac refs | `ownedCards[embrace_protopia]` contains Card 1; binary on/off, unique. |
| Has NPC encountered the Card? | NPC Social Memory / references derived from authored `RESIDENT_KNOWLEDGE_PROFILE` and receipts | Farmer knows `forget_utopia:1` from player, with source and time. |
| How did the NPC interpret it? | Authored Resident personality + last meaningful EncounterReceipt/selected outcome; **not** a new Card text | Skeptical maintenance comment; can differ on next encounter. |
| Does NPC like/trust/know player? | `SOCIAL_RELATION` + meaningful shared interaction receipts, independently of knowledge | Met twice, helped once; card mismatch sparked debate. |
| Is the player known to this faction? | Social/standing projection from witnessed/communicated events, not universal omniscience | Town farmer speaks of a visitor to another farmer. |
| Who recommended a destination? | Moment/EncounterReceipt with suggestion source and current destination reference | Farmer points to the workshop. |
| Has achievement been awarded? | Derived once from canonical milestone input + durable reward receipt if notification/award must be one-shot | 10 distinct decks discovered = badge; no duplicate popups on reload. |

**Minimum event semantics (concept vocabulary only; not a new schema/API):**
- first acquisition of real Card;
- Card presented / delivered / refused / discussed with resident;
- Resident knowledge ref introduced;
- reaction / changed interpretation (only if authored or observed);
- helpful act, gift, social promise or relationship turning point;
- reliable clue / rumor / waypoint accepted or declined;
- milestone crossed / optional plaque awarded.

**Restore/replay rule:** one idempotent event ID/receipt per meaningful Card→NPC→interaction outcome; repeating the same handoff, save/load or dialogue does not grant extra cards, standing or badges. The NPC's current memory view is rebuilt from immutable starting refs + durable encounter/social receipts. Cache and animation state are not authoritative. Saved character identity is not replaced by collected Card content. Export/import preserves collected membership, known-by-NPC deltas, social receipts and chosen pointers. Source IDs and manifest/schema versions are pinned for exact replay; legacy saves need explicit migrations or clearly described semantic restoration. A full dialogue transcript is not required.

## 3 · Resident starting knowledge and interpretation

**Georg direction:** each principal Resident starts with a deliberately **curated 1–6 canonical Card refs** (not random six cards and not a 6-card maximum). Every entry comes from one exact deck+card and reflects voice, job, experience or faction. They can learn more through play. Card *known* is not Card *endorsed*.

Keep separate:
- **Recognized:** NPC has heard of/seen the Card (knowledge reference).
- **Interpreted:** NPC has a character-specific comment or question.
- **Adopted/contested:** only where a real encounter calls for a durable stance; no automatic conversion.
- **Publicly visible:** censorship/propaganda can obscure a bubble, not erase the NPC's private knowledge or the canonical Card.

Do not copy whole Deck JSON into NPC save. Starting card list lives with the authoring/profile owner; save contains only event deltas / canonical references. Same Card can be known by many NPCs while the player's collectible stays unique.

## 4 · Small social standing: fame, acquaintance and friendship are *different*

**Concrete design suggestion, not final tuning:**

| Signal | Proposal: cheap rule | Why it matters |
|---|---|---|
| **Recognition / Bekanntheit** with one NPC | Count **distinct, meaningful** Card-first-shares plus actually witnessed encounters; illustrative thresholds **1 / 3 / 6 / 10** for escalating recognition. No benefit for repeating the same item. | Different greetings: unknown → interesting visitor → familiar messenger → well-known collector. |
| **Relationship / Freundschaft** | Derived from actual help, gifts, mutual activity, promises and remembered encounters, not from Card count. Friendly disagreements allowed; no forced friendship just because the NPC listened. | An Orc/Skeleton may become a friend regardless of combat role. |
| **Reputation / Ruf** per faction | Gain only when an event is credibly witnessed/relayed and relevant to the faction; aggregation is **bounded**. Example: one new relevant delivery can earn a small standing increment once, not once per spectator. | Hero or notorious collector status emerges socially; no omniscient faction broadcast. |
| **Knowledge contribution** | Number of distinct canonical Cards shared with each NPC, by source Deck. Counts knowledge exchange, not moral correctness. | A resident might know 8 new ideas and still disagree with 7 of them. |
| **Trust** (optional distinct edge) | Based on kept promises, help and source reliability. A propaganda messenger can have notoriety without earned trust. | Deceptive/contradictory characters remain viable. |

**Tier labels are relationship-specific presentation, never a rigid universal alignment score.** One NPC might call a collector a hero, another “the person who keeps delivering unsettling pamphlets.” Existing Overworld `journey.js` already stores `reputation` for six factions and `factions.js` maps standing to hostility and mob behavior. Treat those as **LEGACY DESIGN/CODE DONORS ONLY**; do not import their combat-triggering thresholds into the new chill social game automatically.

**Suggested low-cost anti-grind:** recognition milestones count **unique cards presented to this NPC**, capped per deck where the actual authored content justifies it; faction standing increments on meaningful curated quest milestones/events rather than blind multiplication of every card by every faction member. A Player's discovery of 10 decks is an achievement, not proof every NPC knows it.

## 5 · Talk to a Resident to discover where to go next

In-world optional short requests: **“Where is …?”**, **“Who knows about …?”**, **“Any other Cards on …?”**, **“Have you seen the next Card?”**. Exact final player-facing copy follows current English-only UI/text policy.

**Source-backed recommendation chain:**
1. Player chooses topic, wanted Card, Deck, known NPC or landmark; topic can be broad (love, Greek philosophy, improvisation, critical/media theory, conspiracy-themed) or a real `deckId`.
2. NPC selects from **its** known Card refs, interests, honest rumor and location knowledge. The Card/Deck registry supplies actual source identity; named destinations require a real world POI/Resident ID. Distinguish *knows*, *heard from X*, *does not know*.
3. NPC delivers one short character-specific bubble, may visibly **turn head/torso + indicate** the next direction. If the target is on another island, gesture toward a meaningful existing exit/Track connector, not a straight ray through terrain or the vacuum of space.
4. Player may accept the hint. **The existing compass/wayfinding presentation** temporarily points to the real target/route anchor. Reject/clear at any time; no mandatory GPS line, fabricated distances or universal map-marker spam.
5. Optional receipt remembers who recommended what. If a rumor is disproved, retain its provenance as part of the satire, don't rewrite it into an accurate statement retroactively.

**Source audit / source-isolation gate before implementation:**
- Existing KFB HUD Flight Board `hud-flight/kfb-hud.js` contains a compass with a needle. **Donor source exists**, but no proof here that this exact code is current WS1 authoritative navigation.
- `travel/KFB Travel Globe v13-1/globe-v13/card-towers.js` has destination-fed signposts (`zielFn`, direction QA). **Historical donor**, not NPC behavior or a live route owner.
- `tools/KFB-ToolBox/_handover/PRESENTER_STANDUP_SLICE_2026-09-15/START_HERE.md` names `Presenter_Point_Indicate` as a **PROPOSAL/DEFERRED clip label**, not a verified available motion.
- Resident reaction contract already includes inspect/point and focus, plus current EyeRig v6 glance/point-to support. **Eye motion is not an arm gesture.**
- Recalled Reddit slice is **UNVERIFIED**; no pinned actual 3D pointing clip/source was found in this source audit. Before reuse, inspect candidate object/clip **in isolation with rig family + gesture endpoint** and pin exact owner/head, then integrate only via current Motion and navigation owner.

**Single hint flow for first proof:** Resident whose knowledge supports `embrace_protopia:1` suggests a real farmer workshop, points to the correct exit/POI, compass optionally follows, save→fresh import keeps the tip, player can clear it without affecting world access. No new navmesh/path planner.

## 6 · Small satirical collectible achievements, not a second XP system

An optional Almanac **“Meta-Plaketten”** tab shows earned collectible milestones; 3D clay/plaque presentation is later and must reuse approved KFB branding/assets. No default gamification chrome. Achievement IDs and card-set membership remain unique and idempotent.

| Milestone (hypothesis) | Trigger on canonical state | Working satirical plaque name (not canon) |
|---|---|---|
| Discover first Card from 10 **different decks** | `distinctDeckCount >= 10` | **Certified Omnivore of Opinions** |
| Complete 1 real deck | `ownedCards[deckId].size == registry[deckId].cardCount` | **Full Deck, Partial Understanding** |
| Share first cross-deck Card with a Resident | one recorded meaningful unique cross-deck handoff | **Unauthorized Context** |
| Offer divergent cards from 3 distinct decks to one NPC | per-NPC unique distinct deck count ≥3, with actual encounters | **Opinion Corridor Building Inspector** |
| Make a genuine friend (help or gift, not Cards alone) | a chosen positive relationship milestone receipt | **Unlicensed Social Bond** |
| Ask three different Residents for meaningful leads | three independent valid tip receipts | **Professional Lost Person** |

These are **suggestions**, not imported game strings. Plaques should satirize certification, status and hollow achievements, including their own authority. No level wall; no popup for every little pickup. Level/POP lineage remains separate. An earned plaque may trigger a short resident-specific quip, collectible display, dance or song link **if real owner/source and reward logic exist**. No fake currency/upgrade rewards.

## 7 · A single joined 12–18-minute encounter (paper prototype)

- Player owns two different real Cards; travels voluntarily to Protopia after hearing of a Farmer.
- Farmer knows an authored 1–6 starting set. Player shows `forget_utopia:1` *The Glossy Horizon* (canonical real Utopia Card). NPC registers a new Card-known ref; does not automatically believe the slogan. He relates it to actual work.
- Player asks `Who knows about it?` Farmer mentions a real Utopia Robot NPC or a known partial rumor, not invented coordinates. He points toward the physical route; player accepts or ignores compass suggestion.
- One cross-deck courier handoff results in a small **recognition** step and memorable NPC reaction; friend status stays unchanged unless the player actually shares a useful action/gift.
- If eligible, the player earns a **one-time** optional satirical plaque for cross-deck exchange; the Card is still owned once.
- Reload: same Card membership, Farmer knowledge, last meaningful encounter and selected compass tip restored. No second reward. Afterward another NPC can disagree in a new scene.
- Fluff may be picked up while driving but is **not required** to access the dialogue or destination.

## 8 · Smallest later consumer gate and non-goals

**Suggested acceptance probe (requires separate owner authorization):** one real NPC, two canonical Card IDs, one cross-deck presentation, one recognition increment, one source-backed hint to actual POI, one gesture/compass route toggle, one Almanac provenance event, and save→full fresh reload. Repeat the exact interaction: no duplicate reputation/achievement/card. Observe distinct knowledge, affection and standing in debug state; no claim of actual runtime here.

**Never infer:** NPC knows every Card in its world; delivery proves belief; all characters become friends at tier 4; faction universally knows player actions; straight-line pointing is a valid road route; user requests an ideological objective; generic badge chrome is permitted; a historical animation label is a real finished clip.

**Explicitly deferred:** universal dialogue model, full map navigator, new reputation combat AI, 3D outfit/badge rewards, public Site/Stage, WB2 runtime integration, R4/R5 world reboot, new schemas/classes. Fluff remains secondary (including optional lifetime total; existing Overworld HP uses another semantics).

**Precisely one next gate:** **WS0/Georg design-register intake of R4**, then nominate **one source-backed NPC + two real Cards + one confirmed POI** for a later paper/executable mini proof under existing owners. The concept alone does not authorize the runtime.

## Source anchors

- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/SITE_GODMODE_LEAN_MEMORY_ARCHITECTURE_2026-10-04.md` — actual planned A–F memory layers, receipt types, export and migration.
- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md` — canonical Card registry, source-locked Resident Knowledge, ChatterBox and Almanac; no second DB.
- `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/GOLDEN_JOURNEY_MVP_2026-10-04.md` — real Card ID examples, open routes and protagonist continuity.
- `registry/assets/v1/decks/embrace_protopia.json`, `registry/assets/v1/decks/forget_utopia.json` — both current canonical examples report `cardCount: 56`.
- `skills/chat/RESIDENT_REACTION_ENCOUNTER_MATRIX_PREP_2026-10-06.md` — social reaction beats and source-owned gaze/gesture presentation.
- `skills/chat/BLENDER_MCP_RESIDENT_PERFORMANCE_CHOREOGRAPHY_PREP_2026-10-06.md` — EyeRig gaze/point-to, Motion authoring contract.
- `tools/KFB-ToolBox/_handover/PRESENTER_STANDUP_SLICE_2026-09-15/START_HERE.md` — `Presenter_Point_Indicate` only planned.
- `tools/KFB-ToolBox/_inbox/KFB HUD Flight Board - Flight VFX/KFB_HUD_FLIGHT_SESSION_CUT_2026-10-09_r1/hud-flight/kfb-hud.js` — compass donor (not proven current WS1).
- `travel/KFB Travel Globe v13-1/globe-v13/card-towers.js` — target-fed signpost donor; not NPC proof.
- `overworld/overworld/journey.js`, `overworld/overworld/factions.js` — historic reputation/Save donor, **not** adoption of its hostile mob behavior.
- `replies/GAME_LOOP_CARD_WORLD_KNOWLEDGE_R3.md` — R3 priorities and knowledge/interpretation distinction.
