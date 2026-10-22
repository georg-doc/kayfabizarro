# KFB Flatworld / Infinite Comic · Deck-Zonen, Panelrahmen und weißer Gutter

**2026-10-18 · GEORG IDEA INTAKE · DESIGN PROPOSAL, not Canon / not runtime authorization**

**Owner:** existing KFB Infinite Canvas / Meta-Narration design lane. Consumers: current Overworld and Four-Island visual world direction only after explicit owner/human adoption. No new engine, world runtime, Town J-decision, or island geometry owner.

## Georgs Impuls (inhaltstreu)

> KFB als Flachwelt = Comic. Decks als Zonen mit schwarzen Panelrahmen (Gizmo / black); dazwischen der (weiße) Gutter als Übergang zur Nachbarwelt beziehungsweise nächsten Zone. Aby Warburg meets Scott McCloud.

The term **Gizmo** is retained as supplied; its exact visual/source referent is **UNVERIFIED**, not silently equated with a technical Three.js transform gizmo. “Black” is the desired look, not yet a new numerical ink token.

## Spatial and narrative reading — proposal, not settled implementation

1. **Deck → zone → walkable panel.** A deck becomes a spatially legible context and social world, not a monochrome tile or a rectangle full of generic props. Its inhabitants, routes, landmarks, activities and authored micro-story still determine its internal geography.
2. **Black ink perimeter → panel boundary.** The contour marks the editorial cut and the point at which one frame stops claiming the whole story. Not an arbitrary invisible wall, UI window frame, or replacement of existing comic ink SSOT.
3. **White gutter → meaningful negative space.** A visibly white inter-panel interval is potentially traversed, jumped, glimpsed or crossed through a deliberate threshold. Its missing information invites player closure, rather than serving only as decorative blank floor or a guaranteed teleporter.
4. **Warburg: adjacency makes argument.** Two decks/scenes next to each other form a constellation, contrast, recurring motif or contradiction; rearrangement or vantage point can change the inferred relationship. Spatial adjacency must not silently mutate canonical card identities or story rules.
5. **McCloud: the cut is playable.** Crossing the space between panels is a player-performed interpretive transition. The player may connect, reject or reinterpret what the neighboring world implies. The game does not announce the sole correct interpretation.
6. **Fractal grammar across scales.** Card ↔ scenelet ↔ panel ↔ deck-zone ↔ four-world composition can repeat the *relation* without requiring every module to use a grid, six sectors or the same topology.

## Suggested first visual proof (future only, requires permission)

- Reuse **two existing source-backed deck-zone scenes**; show each actual visual source family in isolation first. No substitute kit-bash or anonymous placeholders.
- Compose one oblique overview and one player-eye view where a near-black, organically inked panel boundary, pale/white paper gutter and next zone are immediately legible.
- Show one meaningful existing Resident/activity/route on each side and **why** those worlds belong next to each other. Test the visual transition without changing the current journey/owners.
- Produce a clean version (no labels), annotated version and one direct negative test: blank gap without contextual consequence is a FAIL.
- Use only a design board at this gate. **Do not** change WB2, four-island geometry, Travel, Surface Truth, collision, Track, card/Deck schema, progression, Site or Stage.

## Existing source and reuse evidence (GitHub main @ c746a9567e0ea20a24b8969fe9130ac0756e7a7e)

- `skills/chat/masterplan/FRACTAL_CANVAS_NARRATORS_AND_PLAY_2026-09-14.md`: Warburg/McCloud, Infinite Canvas, closure, fractal card-to-world operation already explicitly present. This proposal gives that idea a new *material/spatial* articulation, not a competing meta-master.
- `skills/chat/masterplan/KFB_META_NARRATION_ADDENDUM_2026-09-14.md` and `skills/chat/town/references/KFB_META_NARRATION_SAMMLUNG_WS0_2026-09-14.md`: physical gutters, incomplete transitions, portal holes and player-controlled closure are earlier concept donors, with explicit proposal-versus-canon boundaries.
- `media/kfb/KFB_INK_OUTLINE_STYLE_v2.md`: **KANONISCH** KFB ink for 2D/3D panels; existing ink reference `#1f1a14`, screen-space `bend` / `inked` choices and consistent gutter width. Reuse before creating “black Gizmo” replacement chrome. Exact visual donor isolation is still due; a documented module is not a tested rendering.
- `overworld/overworld/gutter-2d.js`: existing 2D **fluid-filled** gutter ring, ink/bridge/gate logic, with its own technical constraints. This is a source precedent, **not** evidence that a white walkable inter-world gutter exists or that its code can be reused unchanged in 3D.
- `overworld/docs/LIVING_CONCEPT_overworld.md`: deck/card/world spatial projection and a historically flat 2D Overworld working model. Its six-biome topology is not automatic Four-Island canon.
- `skills/chat/recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md`, `skills/chat/CLAUDE_DESIGN_FOUR_ISLAND_STORY_VISION_R1_2026-10-08.md` and `skills/chat/recovery/POSTMORTEM_ISLAND_MVP_R4_WORLD_MODEL_SYNTHESIS_FAILURE_2026-10-08.md`: current four-world story; R4 STOP / NO MVP; composition must show residents, routes and causal history, not a decorative topology. Current A/B/FAIL world-vision gate remains authoritative.

## Open design tensions and guardrails

- Is the gutter **literal walkable paper**, a white void between elevated world panels, an optical screen-space opening, or a controlled threshold? **OPEN**. Each has different navigation/collision/visibility implications and must not be pre-decided by this note.
- Physical neighbor versus narrative neighbor: adjacency can be contextual and editorial without turning every pair into a mandatory physical road or replacing existing legitimate world transitions.
- Over-framing risk: long uninterrupted black fences would contradict free exploration, read as an obstacle course, and overwhelm the living diorama. Boundary should be perceptible but traversal must be purposeful.
- White must read as paper/negative space under the existing KFB visual language, not a generic empty WebGL plane. The perceptual contrast should carry narrative function at actual game camera angles.
- The four established worlds (Town / Dystopia / Utopia / Protopia), their Golden Journey and recovered lore are **not** renamed or reconstructed as arbitrary deck labels.
- No use of the old R4 failed world layout as a Golden donor. No R5 or geometry from this proposal.

## Outcome / next single gate

**Design proposal only**, editorially reviewable. Next: when Georg/WS0 chooses to explore this visually, compare a **source-isolated two-panel white-gutter composition** against the currently mandated Four-Island Story Vision A/B, then Georg decides whether the Flatworld language joins the world direction. Until then: no visual PASS claim, no implementation, no change to A/B/FAIL authority.

## Additive history

- **2026-10-18:** Georg-originated Flatworld/Comic: deck zones + black panel frames + white gutter to neighboring world; Warburg × McCloud. Logged additively as **DESIGN PROPOSAL**, with source pointers and anti-R4 constraints. No Canon adoption or runtime change.

## 2026-10-22 · Additive concept extension: Gutter Space / three-cluster portal journey

Georg clarified the intended term **Gutter Space** (comic-panel interval, not “Gatter-Space”) and extended this Flatworld idea with three distinguishable experiences: **(1)** Gaussian-Splat/hybrid scene portals into distant deck zones/dungeons, including proposed Plato's Dungeon Raid; **(2)** a spatial projection of the *existing* Card/PDF Viewer and searchable Fractal Almanac, selecting a real Card/deck and using validated teleport destinations; **(3)** a surreal, optionally Track-Core/Joyride-bound rollercoaster ride through Gutter Space / Infinite Canvas with non-Euclidean-seeming, Escher-like animated scenery and source-verified splat/photographic environments.

Full source-aligned proposal, reuse map, canonical owner protections, risks and one next gate:

[`KFB_GUTTER_SPACE_SPLAT_PORTAL_ALMANAC_R1_2026-10-22.md`](KFB_GUTTER_SPACE_SPLAT_PORTAL_ALMANAC_R1_2026-10-22.md).

**Status remains DESIGN PROPOSAL:** no new world/Almanac/card index/camera/track/physics owner, no R4 restart, no canon/visual acceptance and no implementation authorization.
