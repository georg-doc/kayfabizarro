# Resident Lean Character Card · contract proposal v0.1 (2026-10-02)

**Purpose.** One compact card per Resident that bundles everything a Resident *is*, by pointing at the owner of each part instead of copying it. This is Georg's "lean character system" and the Base-24 §8 "Per-Resident Lean Character Card", made machine-readable.

**Status.** Proposal for the receiving owner *KFB Town Resident Social Memory* (PR #272 line). No runtime. Schema: `resident-lean-card.v0.1.schema.json`. First two filled cards: `residents/lorekeeper.card.json`, `residents/officer-doppel-denk.card.json`.

## 1 · Rules

1. **Pointer, not copy.** Look and rig stay in Resident Atlas, motion in the Motion Library, Card text in the deck SSOT, language in ChatterBox / the shared Triplet pool, events in the Journey. The card holds ids and authored character facts only.
2. **Every value carries its source** (`src`) and a `status`: `SOURCE` (taken from a named file), `DESIGN` (authored direction in a named doc), `OPEN` (not decided; must not be filled by an agent).
3. **No sample dialogue.** The card never contains lines a Resident would say. Speech is selected at runtime from the Triplet pool by the ChatterBox kernel (#305). The card may reference pool `tripletId`s and give a *register* description; it may not contain sentences.
4. **English in-world.** Every field that can reach the player (names shown in-world, register tags, card refs) is English. Authoring notes may be German.
5. **Stable vs. dynamic.** The card is stable identity. Dynamic state (current routine step, open social threads, receipts) lives in Resident Social Memory, never in the card.
6. **Small.** If a field needs a paragraph, it belongs in a design doc; the card links to it.

## 2 · Field groups

| Group | Fields | Owner of the referenced truth |
|---|---|---|
| Identity | `residentId`, `displayName`, `workingName`, `title` | this card |
| Body | `atlasRecipeId`, `actorId`, `rigFamily`, `props[]`, `defaultPose` | Resident Atlas |
| Place | `home`, `pois[]`, `habitat` | world / navigation owner |
| Routine | `routineSeeds[]`, `resumeBehaviour` | Resident Social Memory (routine runtime later) |
| Drives | `jungDrive`, `journeyFunction`, `motivations[]`, `desire`, `blindSpot`, `tragicomicContradiction`, `darkSecret`, `backstoryRef` | this card (authored) |
| Mind | `personalityShortcut{socialMask, cognitiveStyle, comicFailureMode}`, `epistemicLens`, `attentionBias[]`, `expectationTendencies[]` | this card |
| Cards | `signatureDeck{deckRef, stance, signatureCardRefs[], worldviewTags[], deckGoal}`, `lovedCardRefs[]`, `hatedCardRefs[]` | deck SSOT for Card content; stance authored here |
| Speech | `triplet{signatureTripletRefs[], relationBias[], register}`, `fluffOlectTolerance`, `thoughtStyle` | ChatterBox / shared Triplet pool |
| Moves | `signatureMoves[]{clipRef, use}`, `reactionIntents[]` | Motion Library / Reaction Choreography |
| Culture | `giftResponse`, `brickFishResponse`, `danceResponse`, `fightResponse` | culture docs (#272) |
| Relations | `relationSeeds[]{residentId, tone}` | this card (seeds only); live relations in memory |
| Memory | `memorySalience{keep[], skip[]}`, `memorySeeds[]` | Resident Social Memory |

## 3 · Why these two Residents first

- **Lorekeeper** — source-proven actor (Resident Atlas, isolated in #308/#310), Mentor, archive/evidence lens. Natural *keeper of Card meaning*.
- **Officer Doppel-Denk** — the only Resident with a full working profile, a candidate Signature Deck (Anti-Rules) and an authority lens that misreads. Natural *misreader of Card meaning*.

Together they give the first Card Relay its conflict: one Card, two world-knowledge lenses (archive vs. order), a player who chooses how to present it.

## 4 · What is OPEN on purpose (Georg / authoring, not agents)

- dark secret and tragicomic backstory for both;
- Lorekeeper's Signature Deck (only the lane is known);
- Doppel-Denk's deck stance (A misreads-as-law · B confiscate/destroy · C archivist/evidence locker);
- Doppel-Denk's actor (profile doc says `toy-soldier`; Base-24 lists Offica/Doppeldenk as "actor open" and Toy Soldier as a separate Resident);
- signature Triplet ids in the shared pool (one Lorekeeper id is visible in #310 QA; the pool itself was not read in this recon).
