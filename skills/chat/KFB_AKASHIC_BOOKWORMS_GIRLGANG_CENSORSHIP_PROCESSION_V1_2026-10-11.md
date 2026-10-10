# KFB Akashic Library · Bookworms, Girl Gang, Lending & Censorship Procession v1
Date: 2026-10-11 | Status: **BACKLOG / SIDE QUEST** — Georg 2026-10-11 priority correction; source-audited post-MVP concept, not implemented. Keep out of the current island/resident design and Town XL planning critical path.
Owner: existing KFB Island Worldbuilder/Minigame/Fluff-Almanac planning, on `planning/kfb-fluff-crafting-almanac-ideation-2026-10-09`. Parents: `KFB_AKASHIC_LIBRARY_ISLAND_DESIGN_V1_2026-10-10.md` and `KFB_FANTASY_TAVERN_OPEN_STAGE_DESIGN_V1_2026-10-10.md`.
No new World, Card, Audio, VFX, Inventory, Story, ChatterBox, Combat or Resident Life runtime owner. Current Four-Island R1 A/B / R4 STOP unchanged.

## 1. Girl Gang = actual KayKit Magical Girl May 2026
Georg's publisher reference: `https://www.patreon.com/kaylousberg/posts/may-2026-mystery-157049933?collection=1584794`. Kay Lousberg's **May 1, 2026** publisher post describes **one Magical Girl source figure with four different outfit textures**, wand and compatible KayKit animation sets. Direct repo directory proof (verified 2026-10-11):
`media/3D_Assets/KayKit_Mystery_Series6/11 - May 2026 - Magical Girl/MagicalGirl.glb`;
`magical_girl_texture_A.png`, `magical_girl_texture_B.png`, `magical_girl_texture_C.png`, `magical_girl_texture_D.png`;
`gltf/MagicalGirl_Wand.gltf`.
Four **palette instances** of one model, not four separate modeled characters and not the older Protagonist_A/B pair. Their KFB **Girl Gang / College influencer princess/quest envoys** roles are Georg's authored reinterpretation, not official pack lore. Source-isolate one body, four genuine palettes and wand before any accepted visual group/costume/rig/animation claim. They can visit Gen Z Island, Adventure Tavern and Library or spin an 'abducted sister' Frost Orc quest.

## 2. Library as living reader network, not a passive catalog
**Author principle: ALL KFB NPCs are passionate readers** with personality- and Deck-specific tastes: philosophical, scientific, occult, sensationalist, absurd, scholarly or just obsessively loyal to a misunderstood favorite. Characters do not all need continuous reading animations or mandatory wisdom speeches.
- A Resident gives a heartfelt, eccentric **reading recommendation**, optionally related to a real Deck/Card.
- An NPC asks the player to **borrow** a named work from Akashic Library and **deliver** it, perhaps paired with a Card in the Fractal Almanac.
- An NPC wants an **overdue book returned** to Lorekeeper, defending the book passionately while fearing the librarian's wrath. Return creates a meaningful relationship, not a generic fetch filler.
- Found/borrowed/delivered Book Props become **collected references/copies in a proposed dedicated Book slot of the player's existing Backpack**, analogous to collected tape/radio songs. Physical book object and canonical Book/Deck source identity are separate from actual collection receipt/ownership. Same copy may be in the player's collection while the loaned original is returned; no duplicate Card database.
Current KFB donor `tools/KFB-ToolBox/_inbox/KFB HUD Flight Board - Flight VFX/KFB_HUD_FLIGHT_SESSION_CUT_2026-10-09_r1/hud-flight/kfb-backpack.js` already has bag/tape/item UI; `kfb-jukebox-data.js` declares `BAG_SLOTS` and `TAPES`. **No working Book slot confirmed.** Reuse owning Backpack/Inventory/Almanac contract; this is a FUTURE PROPOSAL.
Books use actual work/author/title, optional cover and verifiable bibliographic/source references, short original satirical flap text and Card linkage; preserve IP and provenance, no made-up author quotes or fake citations. MED/scientific claims use existing medical QA. An Akashic archive is not an automatic factual-truth validator.

## 3. KISS bookworms as cartoon tubes
Small colorful soft **tube** mesh, wormlike tail squiggle and tiny simplified cartoon eyes / optional mini-EyeRig; no custom full-body skeleton or actual voxel mesh-cutting first. A worm visibly pokes through a **cover/back cover** or spine and wiggles its rear end as it munches, with safe occlusion/overlay trick and brief `nom nom, crunch` audio. The original Book Prop remains intact; visible perforation is a cheap authored decal/cover variant only if useful.
Optional **stomp to save the book**: one local step/press triggers soft squash, clay puff and quick reset, no realistic injury. It can yield a found Book or existing-owner Fluff/reward later, not a new combat subsystem.
Worm's **thought bubble** carries a titled short Card-aware commentary based on a work's author, thesis, impact and satirical angle. Example *Tragedy & Hope* — Carroll Quigley — "Nom nom. All the networks, none of the footnotes. Crunch." **Illustrative invented comic voice, not verified scholarly summary or an actual Triplet Schema.** Vary for sci-fi/occult/medical/classic works. Actual ChatterBox Sheet and author/Book pool remain separate.

## 4. Toy Soldier censorship ritual / distant visual signature
Source actually present:
`media/3D_Assets/KayKit_Mystery_Series6/6 - December 2025 - Toy Soldier/ToySoldier.glb` (ONE base model + one texture) with `gltf/ToySoldier_Rifle.gltf` (Resident Atlas identifies bayonet) and `gltf/ToySoldier_Trumpet.gltf`.
**Six hat numbers/ranks 1–6 are Georg's proposed KFB identity decals/authoring, NOT six source-verified character meshes or known original texture variants.**
The squad engages in hyper-serious ritual **book burnings** near/behind semi-open Library walls, in a ring dance ordered by their hat numbers. Recurring flame/smoke plumes act as a recognizable Library 'signal fire' across the fractured islands; rhythmic march/trumpet/fire crackle, a ludicrous charge read against a book's named author/title and an overaffirmed propaganda/anti-knowledge grievance. Some books are banned, others simply too difficult for the censors to understand. This is a fictional satire on censorship/institutional power, not the KFB narrator claiming a source work is truly banned or its content evil.
Donors: `registry/assets/v1/decks/suppressed_book_deck.json` (**The Most Suppressed Books**, 20 existing entries, including Fahrenheit 451) and Card metadata from actual Library/Archive Decks; individual historical claim status remains source-specific.
**Fire/FX**: `tools/KFB-ToolBox/_inbox/KFB_VFX_01_REVIEW/RETURN_VFX_01.md` documents original fire/flame/smoke families with licensing provenance checks. Reuse verified VFX + existing Audio; no new fire/AudioContext. Bonfire is an authored repeatable scene, NOT a mandate to delete canonical collected Book/Card assets.

## 5. Lorekeeper stand-off / non-gory clay brawl
Lorekeeper curses, protests, cries and frantically rescues a book; soldiers perform cartoon crowd outrage; a cloud of clay puffs hides the absurd **free-for-all** fight and returns to a readable exhausted tableau. Existing visual donor `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_SESSION_CUT_2026-10-04_r1/lib/fight-sandbox-02.js` has actual `fx.clay-puff` and `fx.dust-cloud`; its source presence is not a proven Lorekeeper/ToySoldier brawl animation or actual physics contact. Let cartoon comedy and power imbalance read from silhouette and gesture.

## 6. Prison procession = globally recurring encounter, not a bespoke cutscene
A Toy Soldier drives one rotating arrested NPC (or occasionally player) along an **existing-authorized patrol/path to Prison Island**. Longer route connects scattered eye-witness encounters: passerby hears grotesque accusations and follows source Card cues to reconstruct a Kafkaesque public show-trial. Same Toy Soldier / prison escort may emerge near Library, Town, road or adjacent regions; capture/escort/arrival and player freedom/return must be actual World/Movement/Save owners.
- **KISS no chain**: guard walks behind and herds captive; no chain mesh, chain physics, second pathfinding or new ArrestManager required. Footstep/trombone or trumpet, silhouette and spaced animation carry the performance.
- On attempted defense, prisoner turns toward player; guard gives a *non-graphic comic bayonet poke*, captive springs upward in squash/stretch recoil, then resumes walking. This is a **candidate future cartoon acting cue**, not proof the existing combat clips support pokes or contact.
- **Shame accusations:** alternating named Card/book 'offenses' (real Card seed and actual work metadata), soldier's comically solemn charges and prisoner self-justification. A recurring **final English performed shout** aims for **"Shame!"** or **"Guilty!"**, with timing, crowd/reaction/gesture, while preserving current actual ChatterBox Triplet Sheet (its shape has NOT been audited). Do not invent tuples, labels, 3-bubble requirements or hardcode every arrest as identical.
- Player may be threatened with arrest when they voice **KayfaBONGO**, protest or ask the wrong question: *author story direction* not yet an automatic punishment for the existing Social Call. Preserve voluntary encounter invitation, reversible cartoon consequence, and open-world play. Track **count of actual arrests** and some source/Quest event receipt in the owning player memory/Almanac; don't increment for mere patrol sightings. NPC biased memories may tell different stories, grounded by actual event provenance.
- Soldier may invoke unjust and contradictory charges even when the crime is ridiculous; he and captive play incompatible Kayfabe POVs without narrator verdict. Cartoon overtreatment, not an actual clinical/prison legal claim.

## 7. Source-first incremental later proof; NOW NO RUNTIME WORK
P0 isolate MagicalGirl original 4 textures, ToySoldier rifle/trumpet, genuine Book Prop and chosen flame/smoke donor independently before source-visual PASS.
P1 one colorful tube worm + mini-eye look + one chewed Book visual trick + one source-titled thought bubble; KISS.
P2 one real Book recommendation → pickup/Book slot draft → delivery/return → Almanac receipt; optional rewards owner approval.
P3 one Toy Soldier + one pile of stage books + plume + sound + Lorekeeper protest + optional clay cloud; do NOT start with 6 persistent animated soldiers.
P4 one prisoner escorted safely along real route, accusation/defense beat and non-graphic recoil; only later soldiers 1–6 rank dance, actual player arrest count and full cross-island path after authority.
Maintain existing technical owner, reusable source modules, exact donor isolation/rights. No new Stage/Site route, PR, merge, MVP island, global canon lock or P0.
**Single next deferred parent gate remains** `MINIGAME_FLUFF_SOURCE_AND_OWNER_AUDIT`.
