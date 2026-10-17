# Brief WSA (web chat) · Landmark candidates R1: genius loci, world heritage sites, landmarks as KFB dioramas (V-421) · 17.10.2026

**Tier 0 (3 lines):**
1. Only search and propose. Georg chooses. Build nothing and integrate nothing.
2. Use only free licences (CC0 preferred, CC-BY with attribution recorded). Nothing purchased or private goes into the public repo.
3. Each candidate gets a clay preview (V-346) before it reaches Georg, and nothing is drawn over the preview image (V-383).

**Block**

**Tools:**
- 3D asset search (MCP `3d-assets`, see `~/Dropbox/CLAUDE/.mcp.json`): `search_assets` → `get_asset`.
- Sources the search can't reach automatically (Sketchfab, Fab, CGTrader, TurboSquid): open them via `also_search_on` in the browser.

**Concept (PR #415, "places first"):** a landmark is a walkable diorama. It is a place, an artefact and a ritual site in one, with a **genius loci** (an NPC/character as the spirit of the place) and a link to one KFB deck. Look: rounded edges, oversized, in the style of the KayKit/Tiny Treats dioramas, KFB clay.

**Already covered (do not search for these again):** Giza, Portal Ruin, Akashic Library, Atlantis, Cologne, amphitheatre, Mesa/Canyon, Goblin Bank, Dystopia/Utopia, comic broadcast, jungle computer, cat in a beer glass, evil clown.

**TOP 10 (WS0 proposal, ranked by deck fit, clay potential and how easy a source is to get):**

| # | Landmark | KFB deck | Genius loci / twist | First lead (WS0 quick check) |
|---|---|---|---|---|
| 1 | Stonehenge | `woad_and_warriors`, `platos_dungeon_raid_*` | Druid as ring announcer, the solstice as main event | OpenGameArt "4-piece stonehenge" (check licence), itch.io |
| 2 | Bremen Town Musicians (statue) | `grimms_kayfabe_legends_expansion_set_02`, `the_bards_barnyard_beatdown` | Animal tower as a tag team, the robber house as heel lair | no hit → Meshy/Blender sculpt from photos |
| 3 | Neuschwanstein | `grimms_…_02`, `nibelungen_booster_pack_design` | Ludwig II as dream booker, Wagner/Nibelungen murals as cards | Kenney Castle Kit (CC0) as a kitbash base; Sketchfab |
| 4 | Ziggurat of Ur | `the_uruk_rumble` | Gilgamesh's stair arena, clay-tablet billboard | no hit → simple stepped form, build in Blender |
| 5 | Tower of Babel (Bruegel form) | `epistemic_sabotage`, `unspoken_systems_kayfabizarro_meta_deck_01` | Each floor speaks a different card language; the Polyglot Parrot lives at the top | Bruegel painting (public domain) as the model, build in Blender |
| 6 | Globe Theatre | `shakespearean_animal_beatdown`, `uncle_frizzlebob_s_tragic_flaws_shakespeare` | Wooden O as a wrestling ring, the Bard as manager | Sketchfab/Fab; low-poly Elizabethan theatre |
| 7 | Moai (Rapa Nui) | `forget_utopia` / `ignore_dystopia` / `embrace_protopia` | Collapse myth vs. reality, heads that talk back | Sketchfab "Moai Pa'a Pa'a" **CC0** (Museo Nacional Chile); BlenderKit statuette |
| 8 | Statue of Liberty / Liberty Island | `federal_kayfabe`, `kayfabizzaro_politics` | Torch as a loan lamp, island as the Fed vault | BlenderKit "Liberty island" (royalty free, 197k polygons, needs decimating) |
| 9 | Chichén Itzá (El Castillo + ball court) | `sonic_warfare_music_history_01`, combat arena (MVP-4) | The stair echo chirps like a quetzal; the ball court is the original arena | OpenGameArt "Chichen Itza – El Castillo" (check licence) |
| 10 | Borobudur | `kreative_kayfab_creative_hero_journey`, `kayfabizarro_monomyth_mayhem` | Pilgrim's path through the mandala as the hero's journey, stupas as checkpoints | BlenderKit photoscan (sculpture only); temple via Sketchfab |

Reserves: Leaning Tower of Pisa (`academic_anarchy_intellectual`, Galileo's drop), Acropolis (`kayfabizarro_philosophy`).
Leave out: anything tied to victims or memorial sites (e.g. WTC, Auschwitz, Hiroshima), and Mount Rushmore (sacred to the Lakota).

**Per landmark, deliver 2–3 candidates:**
- source URL
- licence + attribution
- formats
- polygons
- thumbnail
- downloadable yes/no
- **cartoonification note** (what to simplify, round off and scale up; which clay colour comes from the palette)
- a clay preview (first quick pass: Meshy retexture or a Blender clay material, then WS0 checks)

**Output:**
- `replies/WSA_LANDMARKS_R1_RETURN.md`
- `replies/WSA_LANDMARKS_R1_CANDIDATES.json` (`kfb.landmark-candidates/1`)
- In the **Asset Library**, a "Landmark-Kandidaten" view with a "Auswählen" button for Georg. It is not a new tool (V-390).

Georg's choice → WSB job (Blender: clay retopo, rounded edges, bake) → WS1 placement in a later slice.
