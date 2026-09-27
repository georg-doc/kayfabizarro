# Clay geometry for track pieces · options · 2026-09-27

**Georg (27.09, during S9):** Since we build every piece ourselves, the geometry itself could carry the claymation / diorama look, not only the texture:

- slight irregularities, dents, thumb marks and scratches, while keeping the base form;
- a DIY material mix: balsa-wood struts in mine shafts, metal, plastic, clay, later fur and hair;
- KayKit board-game bits for a "claymation toy world, but in a weird way" vibe;
- non-repetitive, but still a modular track kit.

The texture look runs through the S4 Claude Design brief (style anchor H0 Hirnwelt). This note covers the **geometry** side.

## The key idea: deform in stream coordinates, not per piece

Every mesh the core feeds (road deck, barriers, tube rings, halls, pads) is swept along the stream. If the clay deformation is a function of **stream position s and section angle** (plus a world seed), then:

- **there is no repetition**, because s grows continuously, so no two metres of a track are the same;
- **there are no seams**, because a piece boundary is just another s, so the deformation runs straight across it;
- **the result is deterministic.** Runtime, Blender and GLB build the same bumps from the same numbers, like the skins and markings. Nothing is baked per piece.

## Layers (proposal)

| Layer | What | Size | Where it may act |
|---|---|---|---|
| Lumps | low-frequency swelling, "hand-pressed" | 0.1–0.4 m over 5–20 m | tube walls, barrier outer faces, pillars, hall roofs |
| Thumb dents | sparse round dents with a small rim | 0.3–1.2 m wide, 2–8 cm deep | barrier tops, collars, walls |
| Slump | slight sag under gravity, edges that droop | a few cm | slab edges, barrier caps, portal collars |
| Tool marks / scratches | thin grooves (normal or displacement detail) | mm–cm | everywhere, mostly as a normal map from the same seed |
| Edge softening | no hard edge anywhere | 2–10 cm radius | already the rule since S6 (rounded architecture) |

## Rules so the base form survives

1. **The driving surface stays true.** Wheel contact, colliders and physics use the undeformed stream. Deformation acts only on the visual mesh and on the non-driving faces (barrier sides, walls, undersides). At most a sub-centimetre wobble on the road, for looks.
2. **The clearance budget is explicit.** A tube may bulge inwards by at most `clear − margin` (1.0 − 0.3 = 0.7 m by default). The core check would then run against the deformed ring as well. The vehicle envelope is never touched.
3. **Portals and joints stay clean.** The deformation fades out over the last metres before a collar or hall wall, so mouths keep their exact shape (Georg's portal rule).
4. **Strength is a slider per world.** It goes from "barely hand-made" to "Rocko-style warped", like the existing cartoon deformer.

## Material mix

- The "DIY material mix" is best handled as **props on anchors** (the same idea as the billboard anchors), not as more mesh deformation.
- The core emits anchors (every n metres, per side, per host). Examples: balsa struts and cross-beams in a mine shaft (`host: 'mine'`), rivets and metal bands in a bunker, board-game bits and pegs along a toy track.
- Each anchor gets a small seeded jitter (rotation, length, a missing strut now and then), so it looks hand-built, not arrayed.
- Material comes from the skin / material layer: clay, balsa, metal, plastic, and later fur and hair shells.

## Cheapest first probe (if Georg wants it)

- In Blender, on the TN02 file, apply one displacement modifier driven by an s-based noise texture to one tube and its collar.
- Add a mine-shaft preset with balsa strut anchors.
- Shoot the Gotthard tube before and after.
- **This is look work: Georg decides.** The probe only shows what the geometry layer can add on top of the texture.
