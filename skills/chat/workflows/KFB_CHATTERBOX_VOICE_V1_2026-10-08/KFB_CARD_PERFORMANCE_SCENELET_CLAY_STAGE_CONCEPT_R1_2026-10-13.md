# KFB Card Performance Scenelet · Clay Stage + Billboard + Triplets + ChatterBox · R1
Date: 2026-10-13
Status: GEORG PRODUCT DIRECTION · DESIGN/INTAKE ONLY · NOT BUILT / NOT VISUALLY PROVEN
Scope: reduced card/performance MVP; modular Scenelet, not four-island WB2 R5.
Primary narrative/content owner: existing KFB ChatterBox / Voice content lane, Draft PR #379, branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`.
Receiving visual/scene owners: existing Resident Atlas Scenelet/ResidentSet and the receiving WB2 scene document only when later authorized. The existing Card Builder/PDF crop, Billboard, KFB Clay SSOT, Audio and Resident State owners remain unchanged.
Publication: none; no new Site/runtime/Cloudflare Stage/Live. This document is a proposal, not a tested 3D delivery.

## 1. User outcome

Create a small reusable toy-theatre/stand-up/card-game situation: source-proven 3D KFB Residents, recognizable KFB Claymation, carefully composed variable stages and camera/light cues, one real KFB Billboard showing the corresponding *original printed Card*, and short source-heavy single-Card Triplet performances with actual semantic Bridges between Cards. The NPC ChatterBox layer selects/responds and permits player interaction. Later, editable source-grounded author dossiers feed alternative performance lenses without replacing the Card corpus.

Use the user's current modular reduced-MVP/floor/scenelet input as **input/donor to identify**, not proof that an unspecified 'Fallmodul' was located or accepted. Before construction, identify its exact module/file/branch from the receiving project.

## 2. Protected source/owner map

| Concern | Existing owner and intake | Rule |
|---|---|---|
| Card identity and semantic facts | Existing deck registry `registry/assets/v1/decks/*.json`, `media/kfb/*.pdf.json` with `cardName, power, lore, grade` | Exact `deckId + cardNumber`; immutable source, no duplicate DB |
| Printed Card pixels/crop | Original Card PDF, Card Builder/Ink `skills/kfb-card-builder.js`, `skills/kfb-ink-canon.js` and deck `cardGrid` | Artwork prompt is NOT printed visual evidence |
| Billboard | Accepted B0 Kenney `billboard.glb` source/face proof; Billboard/Media Residency owner | Show source object in isolation; B0 face measured 4.20×2.10 in *that* proof, reverify actual receiving transforms/crop |
| Residents/sets | Resident Atlas `kfb.resident-set/0.1`, real source GLBs, EyeRig, pose/clip recipes | Source-isolate each character; retain identity, provenance, rig; no invented substitute |
| Clay look | Clay SSOT PR #301, K1/H0 Golden + K2/v10 material/relief/toolmix donor | Preserve source silhouette/color; prove Golden parity, handmade relief/contact/shadows; KayKit default is not final Clay |
| Dialogue | Existing ChatterBox + kernel/semantic pool, `chatter-2d.js`, `bubble-ts.js`; PR #305/Triplet Stage as candidate donors | Single dialogue/timing/presentation owner; no second bubble renderer |
| Voice/mix | ChatterBox Voice PR #379 + existing KFB Audio PR #365/Site | No second AudioContext; voice is delivery, bubble text remains truth and readable when muted |
| World/scene persistence | Resident Atlas scenelet authoring and WB2 scene document | Standalone isolated performance preview first; in-world prefab consumer later, only after explicit world authorization |
| Author dossiers | KFB Hidden Cosmology Atlas/editorial research branch and author-doc workflow, PR #394 | Separate provenance-locked interpretive layer; never rewrite original Card POWER/LORE |

Specific donor proof: `tools/KFB-ToolBox/_inbox/KFB Billboard Media Szene · B0 Source Proof/BILLBOARD_B0_SOURCE_PROOF_2026-09-24/RETURN.md`.
ChatterBox staging donor: `tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/HANDOVER_WSA_CHATTERBOX_TRIPLET.md` (reference, not owner).
Clay source: `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md`.
Deck pipeline: `skills/chat/workflows/KFB_PLAYABLE_MVP_CONSOLIDATION_V1_2026-09-21/DECK_WORLD_SEED_CARD_PIPELINE_2026-10-04.md`.
Triplet product correction: `POSTMORTEM_TRIPLETS_R1_SHOW_IT_POWER_LORE_OMISSION_2026-10-13.md` **HUMAN FAIL remains binding**.

## 3. Stage anatomy and variability (proposal only)

A placeable **card-performance scenelet recipe** references, rather than copies:
- one lightweight stage/floor/backdrop and audience sightline/anchor;
- one accepted ResidentSet of 1–3 source GLB actors with clear marks (speaker, respondent, optional witness);
- one actual Card/3D Billboard object positioned for simultaneous legibility with actor;
- existing authored props / occasion-specific world-kit set dressing;
- stage `lightPreset` (warm tabletop / hard studio / atmospheric night), `shotPreset` (wide, medium-two-shot, speaking close-up, Card close-up), camera safe zones, shadow/contact setup;
- a fixed run/cue sequence, stage variant ID and selection seed.

No second lighting/material runtime: stage presets map onto existing Three/World rendering owners. Avoid generic UI chrome and generic 'game-show' art, unsolicited logos or newly generated replacement posters. The actual source Card stays recognizably visible, not a made-up illustrated interpretation. Build stage as authored arrangement/recipe, not a global world generation engine. Use physical placement and shot blocking as meaning: two characters can contest a Card, not just recite it side by side.

The first isolated scene should prove the *real* billboard source and one actor source independently before assembling both. For each additional actor, first show the isolated original source, then KFB Clay adaptation, then final on-stage contact/eye/bubble alignment. No donor acceptance by URL presence alone.

## 4. Scene direction / clay visuals

For **all eligible KFB Residents**, define reusable presentation slots rather than redraw every mesh: `actorSourceRef, rigClass, clayProfile, mouthOrTalkProfile, eyeProfile, poseClips, silhouetteSafeCameraAngles, contact/grounding, voiceProfileRef`. First isolate three already source-pinned MVP audition examples: Demon Lord (Dystopia), Robot One (Utopia), Farmer A (Protopia). Optional Lorekeeper later; character voice auditions are not final casting.

Visual rule: genuine KayKit/KFB proportions and colors survive softening; hand-worked matte surfaces have relief/marks at consistent physical scale; restrained specular highlights; soft but grounded shadow/contact; stable lighting, shadows and readable eyes/faces. Use K1/H0 accepted Golden comparison and only then K2/v10 target, with fixed-camera screenshots. One stage light can be variable without pretending every preset is a new material/renderer. Cost/LOD after visual matching.

Minimal choreography: turn-to-Card for SHOW, small motivated body/eye/hand gesture for SPIN, deliberate reaction/pause on SELL, partner eye-contact for response, and a distinct Card/shot change on Bridge. Mouth/talk loop follows existing speech events where playable. When silent, allow visible idle/attention, not an invented line.

## 5. The actual Card performance semantic contract

**IMPORTANT: do not conflate two different Triplet families.**
(A) Existing ChatterBox semantic `subject / connector / reframe` selection/presentation donors are not automatically a successful Card stand-up beat.
(B) Current *Card performance Triplet* must pass Georg's 2026-10-13 SHOW/SPIN/SELL correction on exact source:
- SHOW IT: audibly say the exact original `cardName` while Billboard presents the same `deckId/cardNumber`.
- SPIN IT: make real `power` mechanism causally interact with actual `lore` context/irony.
- SELL IT: the source-backed turn changes meaning/cost/stakes; one connected short performable utterance, not three disjoint sentences, field concatenation or generic AI gag.
- Every emitted candidate points to source `cardName/power/lore` evidence and tracks independently the exact Title/POWER/LORE coverage; for first acceptance require all three. If impossible, `NO_TRIPLET`, preserve valid silence and the Card visual.
- **Bridge is independent**: `priorCardEffect → nextCardTrigger/condition → changedStake/cost` with source refs or honest `NO_EDGE`; bridge word alone is not proof of relation.
- Scale: one Card, two Cards, a four-Card printed page, then explicit whole-deck/chapter performance. Never silently reduce scope. Final Card performance may use optional Fluffhead introduction and fixed 'Stay Fluffy!' close per existing authoring brief, subject to speaker/format contract.
- Until human creative gate: existing R1 generator samples remain QUARANTINED (observed exact title 0/5, POWER 1/5, LORE 5/5, complete 0/5). No automatic placement of these lines in the world or voice pool.

## 6. Run of show and source event chain

`select stage + speaker(s) + CardSet + seed`
→ verified Card load + original print on Billboard
→ `cardBeatStarted(cardRef,artRef)`
→ speaker's one connected SHOW/SPIN/SELL utterance, exact visible bubble, optional existing voice/talk/duck
→ meaningful reaction by partner / player ChatterBox choice (BINGO, BOGGLE, BONGO, BLÖDSINN, existing IDs)
→ `bridgeStarted(fromCard,toCard)` *if reviewed real edge* (else honest transition/cut/silence)
→ Billboard changes to next original Card **at the cue boundary**
→ next beat, end/outro and memory receipt (stable IDs only).

The existing Stage donor's 3-block `flip-stagger` remains a presentation candidate for semantic pool Triplets; don't mechanically split a single Card SHOW/SPIN/SELL sentence into three unrelated visible lines. Bubble stays authoritative when sound is off. Audio #365 owns duration/sync/mix, and no invented word-level timestamps from browser TTS/Suno.

Suggested thin data contract (PROPOSAL, no implementation):
`SceneletPerformanceRecipe { id, stageVariantId, residentSetRef, sourceActorRefs[], billboardRef, cardRefs[], approvedBeatIds[], approvedBridgeIdsOrNO_EDGE[], lightPreset, shotPreset, choreographyCueRefs[], choiceOperatorIds[], voiceProfileRefs[], seed, sourceRevision, reviewStatus }`.
References should resolve against authoritative owners, not duplicate their data.

## 7. Author lenses later, not part of first playable gate

Later `authorLensRef` may provide a source-cited worldview/argument, reasoning operator, distinct character delivery and alternate interpretive reaction for a scene. Keep `originalCardFields`, `editorialStageText`, `sourceQuote/authorDossier` visibly separable, with author/source revision and independent editorial approval. Let two NPCs dispute the *same* canonical Card using different lenses; do not retcon printed Card facts. Google Docs/NotebookLM sync and dossier source proof belong to editorial PR #394, not a runtime dependency for R1.

## 8. Bounded proof staircase

**R1A / NO CODE FIRST:** demonstrate just one human-reviewed original Card (title, POWER, LORE) as a successful connected spoken beat and reject a title-omitted or POWER/LORE-omitted counterpart. This is the pre-existing named creative gate: `KFB_TRIPLETS_SHOW_SPIN_SELL_SINGLE_CARD_HUMAN_FORMULA_GATE_R1`. Do not jump over the fail.
**R1B / SOURCE ISOLATION:** real billboard and one actual Resident GLB each isolated, comparison to KFB Golden, then a 2-shot stage. Record screenshots/source objects and claimed vs visually proven state.
**R1C / MINIMUM SCENELET:** one human-accepted original Card on billboard synchronized with one ChatterBox bubble and actor gaze; user can replay, mute, switch one stage light/shot. Voice only via existing owner.
**R1D / SOCIAL + BRIDGE:** second actor reacts through existing ChatterBox, one true source-backed Card bridge or explicit NO_EDGE; stable Card refs across displayed art, dialogue, voice and memory.
**R1E / EXPAND:** accept all eligible source-backed Resident variants with same look protocol; additional stage modules/floor sets; author lenses after editorial sources accepted.

Non-goals for this design checkpoint: build/refactor WB2 or islands; a new 3D/world/audio/bubble/runtime owner; bulk 29-character Clay conversion; unreviewed multi-deck performance automation; LLM dialogue live in-game; public Stage/Live; replacing current visual donors with synthetic approximations.

## 9. Review criteria and exact current result

This checkpoint is **planning only**. No code/renderer/browser test was executed by this document, no isolated source screenshot produced, no Site deployment or human acceptance claimed. Historical other-owner tests are not new tests. Acceptance for subsequent real scene is visual browser proof with:
1. original Cards actually readable/correct on billboard;
2. all spoken one-card beats independently reviewed for exact title/POWER/LORE/semantic turn;
3. no fabricated Card/asset, no copied deck DB;
4. source-isolated character, true KFB Clay contact/lighting vs Golden and stable bubble/head framing;
5. repeatable deterministic cues, valid silence, readable muted path, genuine source-backed inter-card Bridge or explicit NO_EDGE;
6. stage can be authored once and reused later as an instance recipe; no independent world state owner.

**One next gate:** `KFB_TRIPLETS_SHOW_SPIN_SELL_SINGLE_CARD_HUMAN_FORMULA_GATE_R1`. This is the existing blocker for promoting any Card utterance into a ChatterBox/Card Scenelet; the separate 3D source-isolation work may be prepared in parallel without representing semantic acceptance.
