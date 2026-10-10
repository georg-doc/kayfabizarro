# KFB · Forest / Cabin / Werewolf Island · Concept v1 · 2026-10-10

Status: **GEORG AUTHOR IDEATION + SOURCE-ROUTED POST-MVP CONCEPT · NOT IMPLEMENTED**
Owner: existing KFB Island Worldbuilder / Minigame-Ideation on `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`.
Related reference: `skills/chat/KFB_FRAGMENTED_ISLAND_GALAXY_META_BIOMES_VISUAL_GRAMMAR_V1_2026-10-10.md`.
Current Four-Island R1 A/B visual gate, R4 STOP, runtime ownership and the deferred Minigame/Fluff source gate remain unchanged.

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

## 3 · Two Hikers as complementary witnesses — no personality canon lock
The two color-distinct Hikers can play *opposing biases*:
- one treats every incident as genre evidence and has already concluded who the lumberjack is;
- the other observes physical reality more closely but may form an equally wrong conclusion when details conflict.
Their behavior should be driven by context, a real observed event and relationship state rather than hard-coded "rational vs irrational" personality labels forever. Both can be wrong, insightful, frightened or complicit as the scene develops.

## 4 · The KFB Triplet / ChatterBox dialogue contract
**Binding reference to existing owner, not a new dialogue subsystem:**
`tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/HANDOVER_WSA_CHATTERBOX_TRIPLET.md`
and `lib/triplet-stage/donor/resident-chatter-adapter.v0.1.mjs`, with existing `overworld/overworld/chatter-phrases.js` and ChatterBox presentation owner.

Write **semantic Triplet turns**, not scripted 3-line back-and-forth as a substitute. One meaningful actor turn has one triplet with:
1. `subject` — a concrete contextual assertion/scene observation;
2. `connector` — the relation/tension, essential middle beat;
3. `reframe` — changed interpretation, consequence or inversion.
The three pieces belong in **one speech bubble** as three separated blocks (not slash-delimited visible text); silent `…` can be a valid turn. The source-backed selector uses speaker profile, actual witnessed event, Card/source refs if valid, semantic constraints, social operator, recent usage and seed. Keep approved English pool wording unchanged on render, no automatic Fluff-o-lect. Authored concepts below **are candidate lines only**; they are not inserted into canonical shared pool, and future content needs ChatterBox authoring review/semantic validation.

**Illustrative *one-turn* triplet, Woodcutter at autograph request (CANDIDATE):**
```json
{
  "speaker": "woodcutter",
  "event": "hiker_requests_superhero_autograph",
  "triplet": {
    "subject": "They came for a hero",
    "connector": "because they saw my hair",
    "reframe": "I came to cut timber"
  },
  "status": "AUTHORSHIP_CANDIDATE_NOT_IN_POOL"
}
```
**Illustrative Hiker triplet (CANDIDATE):**
```json
{
  "speaker": "hiker_a",
  "event": "suspicious_tracks_near_campsite",
  "triplet": {
    "subject": "We brought a monster guide",
    "connector": "so every footprint fits",
    "reframe": "except the one by our tent"
  },
  "status": "AUTHORSHIP_CANDIDATE_NOT_IN_POOL"
}
```
Those are **not** two lines of a continuous conversation and no additional joke must follow. ChatterBox owns the actual choice of speaker, response/valid silence, bubble, voice and Audio ducking. A dialogue is not automatically required for every environmental reaction. Respect ChatterBox operator semantics and resident profiles instead of fabricating a Forest-only dialogue engine.

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

## 7 · Creative seeds · proposals, not generic mandatory jokes
- **Unwanted celebrity:** A visitor wants superhero merch signed. The woodcutter identifies the tree species of the wooden autograph board; the visitor ignores this.
- **A protective lie backfires:** He plays the expected hero for one minute to send hikers away from a dangerous trail, unintentionally attracting more fans.
- **Village vote:** Residents argue about a wolf, but treat a popular story as stronger than witnessed clues. A quiet triplet may subvert the majority instead of a narrator delivering a moral conclusion.
The underlying character has needs independent of the Wolverine mistake. Keep humor rooted in social interactions and physical place. Additional pro-active satirical/meta ideas are welcome when they have a precise cause, not as automatic filler or globally restrictive canon.

## 8 · Ownership, recovery, later next step
Current Island Lab/World retains terrain, traversal and save truth; Resident Atlas actor/source scene owns compatible characters; ChatterBox/Triplet pool and presentation retain dialogue; KFB Audio retains sound and voice mix; Card/Almanac require real provenance; later Claude Design handles visual exploration, Blender may consume isolated assets, not invent new owners.
Later source-first study must show: actual both Hiker texture variants on the *same* Hiker model, isolated Tent and Waterbottle, the two Werewolf forms and actual axe/logs, then 2 island compositions with cabin/camp relationship. Verify scales, source licenses, host anchors and transforms before runtime reuse.
Recovery read path: main START_HERE → CHAT_GITHUB_KFB_STAGE_WORKFLOW → FRESH_CHAT_SLICE_PROTOCOL → branch global Island Galaxy grammar → this Forest doc → current owning Return → named current Lab/Story recovery. A timed-out GitHub write stays UNKNOWN until exact ref/file readback.
Status: **concept only**; no runtime, 3D render, tested rig switch, tested two-Hiker stage, Site/Stage, PR/merge/Live. Existing deferred next gate remains `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT` following playable MVP and Georg authorization; include Forest sources as another subsection then.
