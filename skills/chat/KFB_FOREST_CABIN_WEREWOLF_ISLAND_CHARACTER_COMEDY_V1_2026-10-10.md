# KFB · Forest / Cabin / Werewolf Island · Concept v1.1 · 2026-10-10

Status: **GEORG AUTHOR IDEATION + SOURCE-ROUTED POST-MVP CONCEPT · NOT IMPLEMENTED**
Owner: existing KFB Island Worldbuilder / Minigame-Ideation on `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`.
Related reference: `skills/chat/KFB_FRAGMENTED_ISLAND_GALAXY_META_BIOMES_VISUAL_GRAMMAR_V1_2026-10-10.md`.
Current Four-Island R1 A/B visual gate, R4 STOP, runtime ownership and the deferred Minigame/Fluff source gate remain unchanged.

> **GEORG CORRECTION · v1.1 · 2026-10-10:** The previous §4 prescriptive account of the Triplet/ChatterBox pool and its illustrative invented JSON triplets was **NOT VERIFIED AS THE CURRENT ACTUAL DIALOGUE MODEL** and is **SUPERSEDED / RETRACTED**. Georg confirms a separately maintained current pool Sheet. Its canonical structure and authoring status have not been audited in this slice. Do not use the historical v1.0 Triplet description or example lines as implementation instructions. This document now specifies **events, character behavior, satire and physical scene beats**, leaving dialogue authoring and pool mechanics to their existing owner and current Sheet.

## 1 · Character story / what this island is about
An uncanny campsite/woodland island built around **two color-variant Hikers, a tent and a woodcutter who becomes a werewolf**. Daily work, outdoor tourism, folklore and social paranoia share the same small inhabitable forest. Neither a generic horror attraction nor an additional current MVP core island.

**New author-directed tragicomic hook:** The woodcutter's shaggy hair, sideburns and rough appearance repeatedly trigger a mistaken association with **Wolverine**, the famous comic-book superhero. Visitors want a movie/hero narrative; he wants people to recognize his actual craft, name and difficult life. The confusion genuinely irritates him. He may occasionally exploit the mistake to protect his real secret, then resent that he played the role others assigned him. He is an independent KFB woodcutter/werewolf, **not a replica of Wolverine**; no copied costume, claws, marks, character graphic or superhero identity.

The stronger satirical mechanism is **projection beating firsthand testimony**: tourists, villagers and amateur detectives insist they already know who he is, while he is the only one not believed about himself. His own secret transformation gives his denials a second contradictory reading. This creates meaningful repeat visits rather than a fixed gag.

## 2 · Existing cast and source evidence
- **Hiker A + Hiker B:** two *on-screen residents* made from the same existing `Hiker.glb` source, with **two actual color texture options** `hiker_texture.png` and `hiker_texture_b.png`. Their second appearance is a source-backed texture variant, **not** an independently modeled second Hiker character. The second texture is not automatically wired into every existing Resident Atlas consumer; actual texture/UV/rig parity and simultaneous two-instance setup remain to validate. Source:
  - `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2025 - Hiker/characters/Hiker.glb`
  - `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2025 - Hiker/textures/hiker_texture.png`
  - `media/3D_Assets/KayKit_Mystery_Series6/11 - May 2025 - Hiker/textures/hiker_texture_b.png`
- **Camp props:** actual `assets/gltf/Tent.gltf` and `assets/gltf/Waterbottle.gltf`. Existing Atlas S36 measures tent ~2.568 × 2.101 × 2.983 against Hiker height ~2.311; these are source-document measurements to recheck at later pinned revision and chosen island scale.
- **Werewolf woodcutter (two distinct source forms):**
  - `media/3D_Assets/KayKit_Mystery_Series6/4 - October 2023 - Werewolf/characters/gltf/Werewolf_Man.glb`
  - `media/3D_Assets/KayKit_Mystery_Series6/4 - October 2023 - Werewolf/characters/gltf/Werewolf_Wolf.glb`
  - the source pack also has `assets/gltf/axe.gltf` and log/log-stack variants.
  Two real model files exist, **but no production-accepted transformation rig/morph/timing/animation has been proven**. Later inspect proper bone/animation compatibility and choose reversible visual swap if appropriate; no replacement rig runtime.
- **Scene assembly:** source assets are confirmed; a fully accepted, precomposed **two-Hiker + woodcutter/wolf + campsite scene** is not yet confirmed as one reusable source recipe. Audit actual Resident Atlas scene donors before claiming ready integration.

## 3 · Two underprepared Hikers: genre-aware, yet trapped in failure spirals
Two visibly different color variants of the same genuine Hiker model inhabit one shared campsite. Their exact personalities are still open. What matters is the **contrast between their confident knowledge of horror-film survival rules and their consistently bad decisions in the actual world**.

- They know perfectly well that characters should never split up. They split anyway, because one calls it "checking the generator" and the other calls it "securing the tent". Each sincerely insists this does not count as splitting.
- They brought sophisticated but irrelevant outdoor equipment, yet forgot something elementary — matches, usable batteries, a working map or weather protection. Do not hardcode any single inventory item unless its actual source exists.
- Each explains away their own mistake as a sophisticated strategy and the other's as typical horror-movie incompetence.
- One interprets every sound as evidence of a werewolf; the other constructs increasingly elaborate non-wolf theories that are just as poorly supported. Their positions can reverse after a new observation.
- Their prior knowledge of plot conventions does **not** give them authorial control of the forest. They try to pre-empt the cliché and cause it to happen.

These are recurring **behavior patterns, not forced permanent personality types**. Both can become helpful, competent or unexpectedly courageous; the comedy requires actions and reversals, not a mechanical parade of ineptitude.

## 4 · Dialogue ownership correction: STORY BEATS ONLY, POOL CONTRACT DEFERRED
**Do not carry over the former §4 "one Triplet = subject/connector/reframe in one bubble" assertion into Forest dialogue production.** That description conflated a particular candidate Studio handover with the actual evolving KFB ChatterBox/pool practice. Georg explicitly reports a **separately maintained pool Sheet**, which was not retrieved or source-verified during this slice.

- This Forest document is authoritative only for **scene situations, character motivations, observable events and suggested comedic reversals**, not Triplet schema, number of bubbles, line count or pool selection rules.
- The existing ChatterBox/content/presentation owners retain dialogue, roles, voice, cadence, valid silence and all pool integration; no Forest-only dialogue engine or private competing pool.
- Candidate event tags below are **scene prompts**, not approved content IDs or runtime fields. The later dialogue executor first reads the **current pool Sheet and current owning ChatterBox state**, then uses their real format. Earlier made-up dialogue JSON examples are retired.
- If current Sheet authority, paths or wording remain unclear, record as OPEN for the owning ChatterBox lane rather than inventing a new normalization rule here.
- Keep dialogue sharp and source/context-specific. We can think up jokes here without falsely labeling them as valid canonical Triplets.

## 4A · Physical comic scene library / failure spirals (POST-MVP PROPOSALS)
Every idea uses a **trigger → visible mistake → consequence or reversal → optional Resident response**. These are ingredients, not fixed scripted scenes or new MVP acceptance gates.

**S1 · We must not split up.** The Hikers discuss the classic horror rule at the fire. A noise is heard near the generator or tent; one walks off to check "just for a second", the other goes to fetch the light. The player sees their lights drift in opposite directions. Both later maintain they were following the rule.

**S2 · Emergency kit with no essentials.** They ceremoniously lay out waterproof gadgets, monster guides and tracking devices but cannot get a campfire started or repair a simple tent peg. A quiet local prop reaction — a sputtering flashlight, slipping tent pole or displaced bedroll — says more than generic banter. Real props depend on source inventory; don't invent working item mechanics from a static scene.

**S3 · Every clue confirms the movie.** A mundane footprint is confidently classified as werewolf evidence; a genuine wolf sign is dismissed as a fake-out because "the reveal cannot happen yet". On revisiting the area, an actual environmental change undermines both theories.

**S4 · The cabin rule.** A dark cabin or shelter is clearly unsafe. They recognize the ominous setup and enter anyway, believing that doing so self-consciously exempts them from the cliché. Once inside they bar the wrong door or switch off the only working light.

**S5 · The heroic woodcutter misunderstanding.** They meet the irritated lumberjack and call him Wolverine. Because they assume he is a superhero, they expect a rescue, ask for an autograph or want him to "transform" for a photograph. His perfectly legitimate axe and knowledge of the woods become suspicious when he insists he is merely a woodcutter. The *real* werewolf transformation later overturns their pop-cultural explanation without turning him into a Marvel imitation.

**S6 · Accusation by committee.** After a nocturnal howl, two witnesses arrive at opposite conclusions. They host a village-style vote, then select only clues that support the majority. An actual helpful witness can become the new suspect; the woodcutter has competing reasons to hide evidence and defend an innocent neighbor.

**S7 · Disastrous horror documentation.** One Hiker wants perfect footage of a mysterious noise rather than helping the other. The recording captures the panicked camera operator and misses the actual reveal behind them. If sound/video capture systems are unavailable, keep this a staging/miming gag; do not install a recording runtime.

**S8 · Campfire spiral / failure memory.** The same campers repeatedly tell the story of their previous "successful" escape while repairing the damage it caused. Later visits can rearrange the physical aftermath or reverse which Hiker insists they were right. Meaningful Resident relationship/Almanac memory uses existing owners, not a new death counter.

**S9 · Genre-booking backstage.** A scare is too early, a dramatic howl arrives while someone is boiling water, or the wolf is visibly exhausted after a set piece. The three may briefly discuss whether the suspense scene counts, then snap back into folklore roles as soon as a visitor appears. Meta-awareness is a comedic tool, not a compulsory wink in every scene.

**S10 · The forest refuses the script.** The hikers' method for "not being horror protagonists" causes them to miss the one real practical clue: a cut tree across the return path, unsafe weather, footprints leading to the lumberjack's workplace. The player can notice and help without being forced into an accusation or a horror-game failure loop.

**Escalation rhythm:** start with a believable camping inconvenience; allow genre certainty to trigger a poor choice; let physical environment/Residents create consequences; reveal that the chosen explanation is wrong or incomplete. Preserve opportunities for an earned competent decision or an unexpectedly gentle ending. Dialogue is optional and subordinate to what visibly happens.

## 5 · Forest island silhouette / Dark Cluster relation
This is a *liminal folklore/wilderness island*, spatially between ordinary nature/crafting routes and the Graveyard/Vampire/Demon dark constellation; not a default new horror-core island and not automatically a morality axis.
Two later **Claude Design** variants:
- **Forest Wedge:** cracked/sloping asymmetric wooded shard; signature bent dead tree and tent campfire visible between dense canopies, woodcutter work site a distinct destination.
- **Split Clearing / Wild Ridge:** torn horseshoe shelf with a welcoming camp-facing edge and darker wolf/forest ridge, one visible trail across the transition, maybe a stream/ravine if actual donors support it.
The story must be readable at three scales: travel-distance island silhouette and landmark; mid-distance camp/cabin/trail/social relationships; close-up two differently colored Hikers, lumberjack axe/logs and personal story. Different daytime/moonlit lighting states are authored presentation ideas, not proof of real simulation.

## 6 · Optional gameplay and story seams (POST-MVP)
- campfire/tent social stage and overheard contradictory gossip;
- real day/night shifts in perception/encounter, not two world owners;
- brief Werewolf/Woodcutter source-form transformation if actual rig/motion proves it;
- social deduction inspired by villagers-and-werewolf tabletop logic (possibly single-player micro-vignette, not a new multiplayer accusation engine);
- a small authored clue/favor/route puzzle that does not force the player to condemn someone;
- distinct local forest soundbed under existing KFB Audio, footsteps, timber strike, night rustle, distant howl; no new AudioContext.
Any Card/deck mapping is **OPEN**, not an invented deck source or canonical one-island-one-deck rule.

## 7 · Creative opportunities / authoring intent, not canon locks
The Wolverine mistaken-identity conflict survives as a **recurring social pressure**, not the island's only joke. Combine it with the Hikers' horror-meta-awareness, changing evidence, practical outdoor failures and woodcutter's real needs. An individual gag should change a visible relationship or cause a new physical choice rather than repeat an invented catchphrase.

Optional narrative tension: The woodcutter knows a visitor is in genuine danger. He could save them by revealing his wolf nature, but the two tourists would immediately turn that revelation into an entirely different kind of celebrity myth. Their knowledge of fictional genres becomes the obstacle to recognizing a real person.

The already existing Resident, Pool, Audio, World, Card and Memory owners decide how any authored scene becomes a supported event and dialogue. Suggestions here are **PROPOSAL**, not a universal new dialogue or cinematic canon.

## 8 · Ownership, recovery, later next step
Current Island Lab/World retains terrain, traversal and save truth; Resident Atlas actor/source scene owns compatible characters; current ChatterBox + validated pool Sheet owners retain dialogue; KFB Audio retains sound and voice mix; Card/Almanac require real provenance; later Claude Design handles visual exploration, Blender may consume isolated assets, not invent new owners.
Later source-first study must show: actual both Hiker texture variants on the *same* Hiker model, isolated Tent and Waterbottle, the two Werewolf forms and actual axe/logs, then 2 island compositions with cabin/camp relationship. Verify scales, source licenses, host anchors and transforms before runtime reuse.
Recovery read path: main START_HERE → CHAT_GITHUB_KFB_STAGE_WORKFLOW → FRESH_CHAT_SLICE_PROTOCOL → branch global Island Galaxy grammar → this Forest doc → current owning Return → named current Lab/Story recovery. A timed-out GitHub write stays UNKNOWN until exact ref/file readback.
Status: **concept only**; no runtime, 3D render, tested rig switch, tested two-Hiker stage, Site/Stage, PR/merge/Live. Existing deferred next gate remains `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT` following playable MVP and Georg authorization; include Forest sources as another subsection then.
