# Genius Loci / Iconic Architecture · implementation candidates · 2026-09-19

**Status:** PROPOSAL / PREPARED FOR IMPLEMENTATION  
**Default landmark deformation:** **City Grotesque**  
**Style contract:** `styles/landmark-style-profiles.v1.json`  
**World bridge:** `styles/landmark-world-style.mjs`  
**Machine-readable catalogue:** [GENIUS_LOCI_CANDIDATES_V1.json](GENIUS_LOCI_CANDIDATES_V1.json)

## Design rule

A landmark should read as:

> **recognizable local identity inside one shared breathing KFB world**

Therefore three layers stay separate:

1. **geometry identity** — silhouette, construction grammar, semantic rig groups;
2. **landmark palette** — local/cartoon identity;
3. **world context** — OSM City or Travel/TinySkies-derived biome + day/night + mood.

Grotesque is the default geometry presentation for landmarks. It does **not** change the OSM City Lab's own current default.

## Colour rule

Each landmark gets a small local palette: `structure / secondary / upper / accent / glazing / base`.

The local palette owns its saturation and lightness. Travel mood/biome influence is applied as a bounded hue relation, so a monument can remain visibly itself while still belonging to the same Verdant / Molten / Frost / Bone world.

This follows the important current Travel rule:

> mood changes hue; it does not become a second saturation/lightness writer.

Lighting and fog are host-owned. The landmark lane must not invent a separate lighting language.

## P1 · next useful geometry proofs

| Candidate | Why it is useful | Main geometry problem | Suggested showcase |
| --- | --- | --- | --- |
| **Acropolis / Parthenon** | historical, modular, instantly readable | terrace + repeated columns + pediment | Verdant · Plateau · Evening |
| **Area 51 + crashed UFO** | strongest reactive/living-toy scene | flat base blocks + radar + half-buried saucer | Bone · Flatwater · Night |
| **Sagrada Família** | extreme vertical hero architecture | clustered tapering spires + nave | Verdant · Spires · Evening |
| **Sydney Opera House** | non-box architecture | interlocking shell wedges | Frost · Flatwater · Day |
| **Atomium** | graph-like geometry | spheres + struts | Frost · Spires · Night |
| **Gateway Arch** | clean parametric proof | tapered arch curve | Frost · Plateau · Evening |

The first clean historical build remains **Acropolis**.  
The first full reactive scene-kit candidate remains **Area 51 + crashed UFO**.

## P2 · next architecture / scene families

- **St. Basil's Cathedral** — onion-dome cluster; natural successor to Spasskaya.
- **Hagia Sophia** — central dome + half-dome hierarchy.
- **Taj Mahal** — dome/minaret/plinth symmetry.
- **Colosseum** — elliptical repeated arcade ring.
- **Petra / Al-Khazneh** — architecture embedded in terrain.
- **Mont-Saint-Michel** — island → lower town → abbey vertical stack.
- **Angkor Wat** — concentric galleries + tower quincunx.
- **El Castillo / Chichén Itzá** — stepped geometry; strong voxel/boxel candidate.
- **Machu Picchu** — terrain-first terraces + modular stone settlement.
- **Rapa Nui / Moai field** — repeated landmark actors on a strong terrain locus.
- **Golden Gate Bridge** — towers + deck + procedural suspension cables.
- **JFK / Dealey Plaza route** — City Lab scenario, not one hero mesh.

For the JFK slice, public geography/history and speculative/conspiracy overlays must remain separate data/presentation layers. OSM geography stays geographic truth.

## P3 · biome / special-geometry candidates

- **Underwater Atlantis** — original impossible-geometry kit, submerged plazas/towers/loops. Do not reproduce a specific Escher work.
- **Devils Tower** — terrain/columnar monolith.
- **Uluru** — rounded terrain monolith; culturally respectful presentation required.
- **Guggenheim Bilbao** — simplified original folded-shell approximation.

## Existing landmarks under the new default

| Existing asset | Grotesque path |
| --- | --- |
| Eiffel | generic City Grotesque deformation |
| Giza | generic City Grotesque; Voxel Steps / Boxel remain alternates |
| Stonehenge | generic City Grotesque; later grouped-monolith rig |
| Pentagon | generic City Grotesque; ring-band rig backlog |
| Spasskaya | **Semantic Band Rig v2 + Grotesque** |
| Kremlin wall study | **Semantic Band Rig v2 + Grotesque** |
| Cologne Cathedral | accepted v0.2 visual direction; modular Grotesque migration remains separate work |

## Environment continuity

### OSM City context

Consume current City Lab constants:

- background/fog `#c6d7dc`;
- Hemisphere `0xffffff / 0x58605b · 2.2`;
- sun `0xfff2d6 · 2.7`;
- current City palette and Grotesque deformation source.

### Travel context

Consume the pinned current Travel visual snapshot derived from:

`georg-doc/KFB-Travel-Globe@8614282aab2ced43bb5dda9fcf7abadf9768100a`

It contains only the visual constants required for authoring review:

- DAY / EVENING / NIGHT sky gradients;
- TinySkies-derived eight-light rig values;
- Verdant / Molten / Frost / Bone hue rules;
- Plateau / Spires / Shatter / Flatwater biome colours.

The snapshot is **not canonical**. Travel remains the owner.

## Build-order recommendation

1. Pilot 06 visual review: all current modular landmarks in Grotesque under OSM and Travel contexts.
2. Cologne Cathedral modular Grotesque migration as first real OSM Golden Sample.
3. Acropolis — prove repeated semantic architecture.
4. Area 51/UFO — prove reactive scene kit / living-toy seam.
5. Sagrada Família or Sydney Opera House — prove a harder non-box hero geometry.
6. Only then expand the long-tail catalogue.

## Open implementation questions

- declarative rig manifest rather than model-name code;
- semantic GLB node/pivot preservation;
- hero LOD policy;
- exact consumer-side OSM placement/fallback;
- Travel/OSM world-context adapter inside the actual consumer rather than only authoring viewer;
- surface pass using existing KFB material/edge donors;
- Beat / Impact receiver seams after Audio / Race owners approve them.

