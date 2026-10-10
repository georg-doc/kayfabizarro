# KFB Game Bigger-Picture Reference · 2026-10-04

Status: **CURRENT GLOBAL REFERENCE · ORIGIN / PRODUCT INTENT · NOT A RUNTIME OWNER**
Owner: Georg / KFB
Applies to: playable MVP, KFB Town, WorldBuilder, Residents/ChatterBox, Cards/Almanac, minigames, media surfaces and later transmedia game work.

## Public origin references

- KFB / rules / public overview: https://kayfabizarro.pages.dev/#kfb
- Cut&Play / meta-narration / fractal storytelling context: https://kayfabizarro.pages.dev/#cutplay

Repository anchors:
- `Kayfabizarro_Freestyle_Rules_v18-4.md`
- `skills/chat/meta/KFB_META_COMPENDIUM_v1.md`
- current Card/deck registry, Viewer and Card Builder/Ink pipeline.

## Product intent

The digital KFB game is a **chill & fun transmedia adaptation** of the comics, card decks and Cut&Play practice.

It should let a broad audience:
- enter the KFB worlds without first learning the tabletop rules;
- encounter the comics/decks as places, Residents, situations, media and collectible Cards;
- find new or personal meanings by moving, choosing, listening, combining, asking and returning;
- experience KFB as a living claymation-cartoon toy world rather than a didactic rules viewer;
- move back and forth between game, Cards, comics, music, Residents, Almanac and later other media.

The goal is not to digitize the analog rules literally.
The goal is to preserve the generative KFB idea: **Cards and worlds invite behavior, interpretation and recombination.**

## Fractal storytelling reference

Cut&Play is used as a design grammar across scales:

`Deck → world/biome → Card → POI/encounter → Resident worldview → Triplet/dialogue beat → Billboard/media → Almanac memory → recombination`.

The same semantic source may therefore appear:
- as a Card image;
- as world color/light/architecture;
- as an NPC bias;
- as a route or encounter;
- as a HyperNormalisation loop;
- as a remembered provenance entry;
- later as a player-created/recombined scene or story.

This is a **fractal translation**, not one-to-one literal illustration.

## Living-toy implementation metaphor

The 3D target is:
**KFB claymation cartoon open world as a living toy.**

Technical and visual metaphors should reinforce this:
- islands/worlds feel assembled, inhabited, repairable and revisitable;
- tools become places/actions where useful;
- Cards become world objects, media, quests and memories;
- Residents live before the player arrives;
- authored KayKit/KFB assets remain recognisable signature toys;
- procedural systems build the ordinary connective tissue rather than replacing source identity;
- history remains visible as layers, scars, repairs and reused structures.

## Georg author clarification · Creative openness with strict technical boundaries · 2026-10-09

**Status: CROSS-PRODUCT AUTHOR INTENT / INTERPRETATION GUIDE, NOT A NEW CANON LOCK, TECHNICAL OWNER OR MVP ACCEPTANCE GATE.** This clarification scopes earlier writing/style rules; it does not erase source-specific textual quality or the actual canonical KFB Cards and provenance. Carry this intent into future game/world/Resident/POI/VFX/Alchemy/Maker discussions, interpreting constraints in their native domain before imposing them elsewhere.

**1. Narrative text precision is not a world-interaction ban.** Layer Zero guidance against generic anthropomorphic appliance/toaster jokes was written to improve essays, geopolitical argument, analytic narration, scripts and deck text, especially where personifying "the room," "the table" or a mechanism obscures the actual human decision-maker or substitutes familiar filler for substance. It must **NOT** be misapplied as a ban on living/talking objects, whimsical agency or personality in KFB game space. A mushroom can jump, protest, dance, make a claim or speak through the existing ChatterBox context. Boots, fish, stones, equipment, trees and scenery can do likewise. This is **not an exceptional permission that must be granted object-by-object**; it is an intentional core creative affordance of the living toy-world. Specific jokes still benefit from relevant local context and actual authorship, not mechanically repeated generic toaster humor.

**2. The world is alive.** Everything may potentially breathe, pulse, wobble, dance to a source-owned Soundbed, react unexpectedly or assert a viewpoint. Adventure-game curiosity matters: clicking/probing a random mushroom, rock, discarded fish or furniture can reward the player's attention with an immediate physical reaction, sound, emanata, small comic bubble or context-relevant Triplet—even with zero inventory/quest reward. POIs need not be financial/economic. Preserve nonblocking, genuinely surprising interactions; allow player disinterest and pass-by, never force modal dialogs during ordinary Walk/Drive/Flight. A basic reaction can be cheap and broadly reusable; deeper authored/Triplet/voice responses can be selectively elaborated without denying the base world-aliveness intent. Do not translate this into a new requirement to author a huge NPC AI for every mesh.

**3. Source materials and VFX follow their own medium.** Ink, printmaking and watercolor rules apply where they belong: the actual KFB comic/card artwork, typography and specified visual source objects. They are **not** global mandates that force water deformation, explosions, fire, smoke, volumetric effects, particles, cartoon squash/stretch, props, neon-free accent lighting or 3D material response into fake ink/aquarelle print rendering. Keep the established KFB clay/cartoon/world material coherence while allowing the physically and artistically appropriate treatment for each medium. A real water ripple or juicy particle burst is allowed to look like a good water ripple or spectacular clay blast.

**4. Technical rigor, imaginative latitude.** Be strict with **one existing runtime/source owner**, provenance/licensing, canonical Card identity, World/Inventory/Audio/Camera writers, transaction safety, save/reload, actual source isolation before donor integration, test evidence, performance budgets and reversibility. Be flexible with **creative interpretation**, diegetic workarounds, animation cheats, expressive physics, narrative surprises, emergent interaction and eye-candy where they advance the Global Intent. Reuse native building blocks first; a clever small performant hack can be better than an overly literal expensive simulation. Do not reject an interesting idea merely because a document in a different domain forbids its superficially similar language. Do not promote an artist's brainstorming hypothesis into an all-project canonical no-go rule.

**5. Minimum living-prop presentation (PROPOSED architecture heuristic, not a required MVP feature):**
\`World/POI/Prop sourceRef + nearby interaction context → existing interaction/event consumer → lightweight shared reaction bundle [motion / squash / emanata / audio hook / optional comic bubble] → optional source- and context-derived Triplet / short follow-up → return to natural idle\`.
- One source-owned input/raycast system; one Audio/mix owner; reused rig/material/VFX owners.
- Small event/animation presets and stable-seeded variation create **apparent individuality** without persistent agents for every mushroom.
- Near/visible/focused objects respond richly; distant scenery may sway/dance with the soundbed at low cost or be culled. Respect reduced motion, audio mute, low-power hardware, cooldowns and user attention.
- An object can assert an absurd lie and be contradicted; this is diegetic speech, not a new factual canon claim.
- Reactions are allowed to be the *entire* reward. Card/Fluff/Score receipts happen only on actual authoritative grants, not every click.

**Operational reading rule:** Scope every prohibition to its original problem, medium, owner and audience. When in doubt, favor the overarching product vision—**a living, surprising, funny, physically satisfying playable KFB universe**—without weakening technical acceptance or inventing a competing SSOT. If a strict rule blocks that vision, explain the conflict and propose a bounded alternative rather than adding another prohibition. Keep this a *guide for decisions*, not a new meta-gateway to sign off before each playful object.

## Georg author direction · Cognitive dissonance as KFB resonance · 2026-10-10

**Status: GLOBAL CREATIVE INTERPRETATION / NORTH-STAR CLARIFICATION, NOT A NEW CONTENT POLICY, CENSORSHIP FILTER, RUNTIME OWNER, DIALOGUE POOL CONTRACT OR CANON GATE.** Applies across Cards/Decks, ChatterBox/Residents, comics, satire, islands, Almanac, world events, media and travel closure.

> **Cognitive dissonance is KayfaBizarro's resonance space. Closure belongs to the reader/player.**

**Kayfabe + Bizarro:** voices perform incompatible worldviews with full internal seriousness. Their claims can be official, conspiratorial, utopian, radically skeptical, authoritarian, sentimental, absurd or intentionally contradictory. They are *character and media performances*, not propositions that KFB, its author or an assistant must endorse. The author is not obliged to enter each scene as a moderator, fact-checker, referee or moral judge to adjudicate whose worldview wins. Credible physical action and contradictory consequences can expose ideology more sharply than a disclaimer monologue.

**Satirical method:** exaggeration, inversion, **overaffirmation / Überaffirmation** and tragicomic failure loops take assumptions to the point where they become recognizable through distortion. Georg cites **Schwarze Wahrheiten** as a creative precedent for performative overaffirmation: state a position with such rigor that its internal consequences expose the frame, without demanding the narrator explain the gag. Misaligned text/image, unreliable narration, competing Cards, inappropriate seriousness and incompatible visual registers are valid source-native creative devices. A point of view may win the argument and lose the situation; a grotesque character may be right for the wrong reasons. Absurdity is part of the medium, not a defect that must be normalized away.

**Associative and philosophical model, not a forced theory:**
- **Aby Warburg's good neighbor:** bring images, arguments, artifacts and eras into meaningful, sometimes startling proximity without making every link an asserted causal fact.
- **Markus Gabriel's fields of sense (Sinnfelder):** different conceptual frames produce different questions and visibilities; do not impose one flattening meta-narrative on every island, Deck or Resident.
- **Scott McCloud / comic gutter / closure:** let the audience perform the missing relation between conflicting beats, cards, props, islands and journeys.
- **Warburg ↔ Gabriel ↔ McCloud is KFB's *creative montage*,** not a claim that these philosophies are equivalent.

**Purpose:** expose intellectual and institutional Kayfabe, social filtering, media manipulation, ideological habits and hidden assumptions through play and contradiction; encourage reflective friction instead of a guided "critical thinking lesson." Player freedom includes believing, doubting, mocking, misreading, choosing another route or declining to resolve a contradiction. KFB may be acerbic, irreverent, politically and philosophically challenging, and still invite broad audiences through toy-world comedy and multiple meaningful reading layers (Asterix-like).

**Interpretation and provenance:** a polemical article, conspiracy Card or extreme opinion is a legitimate *performed viewpoint or source artifact* in creative KFB. Its inclusion does not automatically mean endorsement or factual validation; nor does it need recurring on-screen ideological caveats. When a separate task explicitly asks what a real source proves, keep traceability and distinguish source assertion from confirmed observation. This is source hygiene, **not** a fictional-character speech restraint.

**Downstream use:** For a Card, scene, minigame or Resident, ask: What worldview is being performed? What is its attractive kernel or useful insight? Which premise is pushed too far? What changes materially when another worldview or actual event collides with it? What remains for audience closure? These are *optional author prompts*, not mandatory checklist beats. Proactively propose fresh, concrete satirical twists where the scene's actual characters, objects, actions or source conflicts permit one; never apply blanket anti-satire, anti-conspiracy or forced middle-ground filters.

**Existing ownership preserved:** ChatterBox dialogue/triplet content uses its real current Sheet/pool owner, without invented tuple/bubble requirements. Card/Deck registry owns Card origin/source, World/Story owners own their domains. This creative lens neither grants a new runtime nor changes a current MVP P0 gate. Cross-project source siblings: `skills/chat/meta/KFB_META_COMPENDIUM_v1.md`, `skills/chat/masterplan/FRACTAL_CANVAS_NARRATORS_AND_PLAY_2026-09-14.md`, `skills/chat/masterplan/KFB_META_NARRATION_ADDENDUM_2026-09-14.md`.

## Georg author clarification · Fractal POV performance, scientific QA and autonomous inquiry · 2026-10-10

**GLOBAL CREATIVE INTERPRETATION — no new content policy, compulsory beat system, pool schema, canon owner or MVP gate.** This qualifies the cognitive-dissonance North Star immediately above.

**The Kayfabe pact:** Players must sometimes present a Card's claim from an Actor's **POV**, with compelling internal logic, even when they personally disagree. Convincingly performing a worldview is not endorsing it. This applies to philosophy, religious and wisdom traditions, science models, metaphysics, conspiracy narratives, pro- and anti-mainstream claims, geopolitics, and deliberately absurd fantasies. A Resident, narrator or author does not have to adjudicate which ideology wins.

**Distinguish two real source grammars:** The Freestyle rules' single Card **intro ritual** is `Name It → Claim It → Power It` (name the Card, state its claim, perform its consequence). The wider **Show It → Spin It → Sell It** composition is a three-beat narrative or semantic performance across Cards, character encounters, acts, minigames, landscapes, journeys, media sequences and Almanac rearrangements. A prior KFB Tourbus donor describes the optional larger `Actor/POV → Show It → Spin It → Sell It → Quest/Endpanel with audience Closure`. These are related *scales*, not an excuse to rename the rules' intro or prescribe the currently unaudited ChatterBox/Triplet pool Sheet. No compulsory three-bubble format.

**Fractal dramaturgy:** Show a Card, object, real argument, situation or claim; spin it into a contrary perspective, causal reversal or inconvenient context; sell the performed viewpoint by accepting its surprising consequences until another viewpoint collides with it. The same logic can inhabit a single quote, a philosophical exchange, a Deck, an RPG encounter, the comic gutter between islands and a sprawling multi-deck arc. This is a creative prompt, not a mandatory schema or game engine.

**Internally coherent before exaggerated:** philosophical traditions, scientific concepts, great wisdom teachings, metaphysical positions and Quotes should first be recognisable as meaningful positions in their own terms. Their conversion into extreme Card powers is satirical embodiment rather than an objective scholarly summary. Reference: the actual KFB deck records `registry/assets/v1/decks/philosopher_dungeon_raid.json` (20 philosophic/dungeon character cards, source page mapping not fully verified) and `registry/assets/v1/decks/platos_dungeon_raid_v05.json` (56 RPG class cards), collectively the Plato's Dungeon Raid lineage. Hardcore philosophy, TV tropes, fantasy violence and TTRPG role satire can coexist in one scene.

**Ideology, geopolitics and conspiracy:** One Card may present mainstream, anti-mainstream, unverified, conspiratorial or utterly invented claims. Neither repetition of warnings nor forced editorial neutralization is needed in every *fictional character's line*. Context and provenance can distinguish who asserts what when the audience wishes to inspect the material. Overaffirmation, conflicting Cards, incompatible authority and text-image contradictions can reveal their own contradictions without an omniscient explainer.

**MED exception:** MedKayfab combines satirical performance with a **stronger medical-scientific QA obligation** for mechanisms, diagnosis, risk, therapeutic claims and patient-facing meaning. Preserve relevant evidence, current guidance, appropriate clinical context and expert/source review. Existing `content/med-en.md` says to prefer medical training and primary sources over comic mnemonic Cards; its Feynman-like mechanism-explanation challenge is a pedagogical ambition, not a guarantee that every Card is clinically correct. In actual care, use current evidence, clinical judgment and applicable standards, not cartoon game rules. This domain standard does not censor non-medical worldview satire.

**Epistemic independence:** A reflective student, clinician, reader, player or citizen should know that primary literature, cross-checking, self-directed research and criticism have greater evidentiary force than an entertaining Card, comic or animated 3D world. Primary literature is evidence *to interrogate*, not automatically infallible or 'more true' by mere origin. Internal coherence grants a performance dramatic legitimacy, never automatic factual truth.

**Desired experience:** KFB is not a preacher, lecturer, official moderator or one-ideology instruction system. It offers contradictory performances in a space of cognitive dissonance, where the public supplies Closure. The freedom to inhabit, challenge, revise, ridicule and recombine viewpoints is a creative design aspiration; no work can guarantee ideological misappropriation is impossible. Resist repetitive ideological boilerplate, not legitimate source criticism when a factual question or safety-critical claim genuinely requires it.

**Ownership/source references:** `Kayfabizarro_Freestyle_Rules_v18-4.md`, `kayfabizarro_freestyle_hub_v18-4.md`, `skills/chat/masterplan/CHATTERBOX_TOURBUS_REUSE_2026-09-14.md`, `content/med-en.md`, actual Deck Registry. Keep existing ChatterBox/Sheet, Cards/Decks, World/Story and clinical review owners; no new runtime or Canon freeze.

## Analog canon vs digital game

Analog/public rules and KFB meta-narration are **high-value origin references**, not shackles on digital gameplay.

Therefore:
- preserve names, source provenance and conceptual distinctions where they matter;
- do not silently claim a digital adaptation rule is an analog canonical rule;
- but do not block a better chill/fun interaction merely because the tabletop version works differently;
- digital meanings of KayfaBINGO / BONGO / BOGGLE / BLÖDSINN!, Cards, Quest beats, inventory, movement, rewards or progression may be explored experimentally when clearly scoped to the game;
- gameplay tests may discover a stronger digital interpretation;
- discussion remains outcome-open.

Source truth matters.
**Canon policing must not replace playtesting.**

## Global interaction principle · PULL, DON'T GATE

For the game as a whole:

**Pull, don't gate.**

Prefer:
- visible curiosity;
- character invitation;
- useful rewards;
- funny social pressure;
- landmarks;
- music;
- Cards;
- optional questions;
- route affordances;
- return value;
- consequences that create another choice.

Avoid using as default:
- invisible walls;
- arbitrary locks;
- mandatory tutorial text;
- forced moral choices;
- one correct route;
- mechanics that exist only to stop the player;
- progression requirements that merely delay exploration.

A Golden Journey may strongly suggest a path.
It must not make the open world fake.

If a reward needs a state, gate the **reward/handoff**, not the player's ability to explore the world wherever practical.

## Digital adaptation heuristics

1. **Invitation before explanation.**
   Let the player see/do/meet something before explaining it.

2. **Meaning after encounter.**
   Almanac and Lorekeeper can deepen meaning after a Card or world has been experienced.

3. **Multiple readings stay alive.**
   KFB works best when official story, absurdity, critique and player interpretation can coexist.

4. **NPCs embody viewpoints, not lesson objectives.**
   Deck knowledge biases Residents; no Resident is the omniscient authorial answer.

5. **Cards are prompts/evidence, not numeric loot by default.**
   Digital uses may add mechanics, but the Card's identity/provenance stays stable.

6. **Chill is a valid play state.**
   Walking, driving, listening, watching a performance, reading a Card, arranging a scene or simply inhabiting a biome are legitimate gameplay.

7. **Return matters.**
   Worlds, Residents and Almanac should remember enough that coming back feels different without requiring a giant simulation.

8. **Satire is participatory.**
   The player should be allowed to accept, reject, misunderstand, remix or ignore an offered framing.

## MVP consequence

The current Golden Journey is the first integrated example of this philosophy:
- it pulls the player through Clown → Card → Driver/taxi → Dystopia performance → Utopia CEO → Protopia Farmers → Lorekeeper;
- every island remains explorable early;
- Cards and dialogue handoffs wait for relevant state;
- the route is reference/acceptance, not coercion;
- the Fractal Almanac records what the player actually encountered.

This reference should be read before major KFB game/world/dialogue/progression decisions.
It does not create a new runtime, rules engine, canon owner or content database.
