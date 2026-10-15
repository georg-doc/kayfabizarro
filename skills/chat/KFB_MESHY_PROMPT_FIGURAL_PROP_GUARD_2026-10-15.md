# Meshy scene prompts — figural-prop preservation and external-model language
Status: CURRENT ADDITIVE AUTHORING GUARD · 2026-10-15
Owner: KFB Asset Scene Composer (private plugin; chat authoring only), with Meshy as an external generator.
Scope: Meshy text-to-3D/image-to-3D scene prompts and concept-to-Meshy handoffs. This is not a new runtime, source registry, or model owner.
Decision: Georg explicit correction of the Goblin Bank/Vault diorama prompt, 2026-10-15.

## Incident and root cause
The Goblin Bank scene positively requested a *golden goblin statue*, golden pig and other figural sculpture props, with no living residents/actors in the shot. The previous prompt included an unqualified `No characters`. Meshy or another external generator could interpret this broadly and drop a deliberately requested goblin figure/statue. The image proposal visually contained the statue, so the negative prompt contradicted the expected asset inventory. This was caught before spending Meshy credits; no failed Meshy execution is claimed.

## Binding authoring rule: semantic identity wins over generic negative lists
1. First enumerate the specific requested scene objects and the user's deliberate keep/remove instructions. A statue, bust, idol, figurine, gargoyle, relief, mannequin, puppet, doll, sign sculpture, or carved animal/humanoid is a **static scene prop** when the user intends it as scenery, even when anatomically humanoid or called a "figure"/"character" in ordinary language.
2. Explicit **KEEP** objects override generic negative prompts and simplification. The negative section must be checked for both literal and semantic collisions with KEEP objects.
3. Separate `living_actor` / `posed_scene_character` (person, animated monster, NPC, performance actor) from `figural_static_prop` (stone/clay/metal/wood sculpted figure). "No people", "no characters", "no creatures", "no figures", "no humanoids" may erase BOTH categories; never use those broad exclusions when a figurative prop is required.
4. If the user wants a room empty of live actors, phrase precisely: **"No living or animated inhabitants; preserve all specified statues, sculpted figures, busts and ornamental creature sculptures as static architectural props."** When a specific figure is required, positively name its material, location, pose, scale and function.
5. If the user *explicitly excludes* statuary or ornaments, respect that exclusion. Do not invent decorative figurative props on a source-locked asset. This guard protects only included/selected objects; it is not a default demand to always add statues.
6. `simplify for 3D` = consolidate micro-details, reduce repeated clutter and texture/text complexity; **never silently delete named silhouette, story, function or interaction anchors** (e.g. a goblin statue, grand vault door, stair/upper level, 16:9 screen, treasure types). Preserve clear walkable stage space.
7. Keep interactions as shape intent, not false rigging claims: "a visually separate, thick vault door suitable for later Blender separation" rather than "already animatable".
8. External generators do not know project terms, characters or art canon. **Never make `KFB`, `KayfaBizarro`, a resident name, internal asset ID or a branch path the only style/shape instruction inside the Meshy prompt.** Translate into visual/material/spatial descriptions (e.g. handcrafted stop-motion clay diorama; chunky irregular bevels; isometric cutaway stage; comic proportions). Project refs can be kept in surrounding internal metadata, not as unexplained instructions to Meshy.

## Required pre-credit Meshy prompt preflight
Before displaying a copy-ready Meshy prompt, validate the **whole** text including negative/exclusion words against the requested scene inventory:
- `KEEP`: all explicit main structures, props, sculptures/statues, functional screen/monitor and environment anchors are present with physical descriptions.
- `REMOVE`: only exclusions the user requested, expressed narrowly enough to spare KEEP.
- `CONFLICT`: no negative or generic "clean up" phrase can erase a KEEP object; if any collision remains, rewrite before release.
- `MODEL LANGUAGE`: all essential style and object features are self-contained descriptions intelligible to Meshy without project lore.
- `BUDGET`: detail consolidation does not remove important narrative/functional masses; mention a simple 16:9 **flat rectangular display plane** in its separate gold frame when required so its surface can be replaced later.
- **STOP BEFORE CREDITS**: if KEEP/REMOVE conflict remains, do not label the text Meshy-ready; correct it first. For external credits, prompt inspection is the deliverable; do not claim Meshy generation/tests without evidence.

## Regression examples (authoring expectations)
| Case | Intent | Must preserve | Valid exclusion |
|---|---|---|---|
| 1 Goblin bank | No living banker/goblin; golden goblin statue on plinth | Goblin *statue* and pig statue | No living or animated inhabitants |
| 2 Temple | Empty shrine with carved humanoid idols | Carved idols, reliefs | No live worshippers |
| 3 Museum | Bust of a ruler; no visitors | Bust | No museum visitors |
| 4 Explicit sculpture-free | Empty clean lobby; no people or statuary | No figurative prop required | No people or statues (user requested both) |
| 5 Treasure bank screen | Large gold-framed 16:9 display + vault + upper level | Display plane/frame, vault door, stairs | No characters, rewritten as "no living inhabitants" |
| 6 Low-detail render | Goblin statue, chest, coins, pipes, central desk | All named anchor families in chunkier forms | Avoid tiny loose fittings/microscopic lettering |
| 7 External model prompt | Handmade clay, steampunk/retro-SF financial vault | Shape/material descriptions | No unexplained "in KFB style" |
| 8 Source-locked statue | Existing selected goblin statue asset | Existing silhouette and material regions | Do not add unrelated new figures |

## Safe example for the bank scene (excerpt)
`A large, stylized gold goblin statue seated on a stone pedestal, with exaggerated ears, grin and a coin medallion, clearly a stationary metal sculpture rather than a living creature; a second gold pig statue near the treasure. No living or animated inhabitants; retain all sculpted figures as environmental props. A 16:9 flat dark-green holographic stock-chart display inside an oversized ornamental gold frame is mounted on the left wall. Preserve the open vault, stairs, safety-deposit gallery, banker desk and generously clear floor; simplify only small detailing.`

## Ownership / release
GitHub holds this additive guard and incident learning. The private `kfb-asset-scene-composer` plugin skill should link to this contract and use the pre-credit checklist when composing Meshy prompts. A plugin release needs its own verified release receipt; a GitHub doc alone is not evidence the installed plugin changed. No Stage, Site, Cloudflare mirror, merge or Live promotion is needed for this prompt-safety document.
