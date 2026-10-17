# RETURN · Billboard B3 exploration · rounded cartoon bodies · 2026-09-26

**Status:** EXPLORATION ONLY · **Georg: "still at the tinkering pre-stage, not usable as is"** · not integrated · no Stage / Live

## Georg's verdict (26.09)
- It is not bad, but it reads as an early tinkering stage and cannot be used as is.
- The next round needs a **design concept**; parts are no longer arranged arbitrarily.
- There are probably more fitting props.
- The models can still be mined for parts once there is a concept.

## Defects first
- **Look:** shapes are generic superellipse / curve extrusions with little design intent, and the style families were mixed at random.
- **Look system:** there is no shared shape language with the KFB elastic-grotesque world (Hürth clay, landmarks).
- **Contract:** the face size differs from the protected B0 contract (4.20 × 2.10 m). The bodies are responsive by design, so each board exports its face size / centre / normal in `billboard_b3.bodies.json`. A WSA decision is needed before any media binding.
- **Media:** no media bound; the faces are dark placeholders.
- **Scale:** bodies are up to 8 m face width (highway scale). The Kenney donor at game scale is in the scene for comparison only.

## What exists (Blender 5.2.2, Claude Coworker)
- `scripts/build_billboard_b3_v2.py`: parametric builder.
  - **Four types:**
    - KIDNEY (kidney head, boomerang leg, starburst);
    - ARROW (motel arrow with bulbs, two posts);
    - BLOB (bumpy amoeba on stubby legs; creature-ready);
    - TOTEM (leaning pylon, disc and star crown).
  - **Responsive:** the face is contain-fitted from the content aspect into a max box, and the body is built around it (demo: 16:9, 4:3, 9:16).
  - **Palette roles** (`bb_body`, `bb_frame`, `bb_accent`, `bb_post`, `bb_bulb`, `bb_face`) with three demo palettes (motel, casino, kfb).
  - **Face contract:** `<name>_FACE` plane, UV 0..1, front = −Y (Blender) / +Z (glTF).
- `billboard_b3.bodies.json`: face metadata per board.
- `glb/`: 8 GLBs (≈ 200 KB each).
- `prev/`: Blender review screenshots.
- Local only: `KFB_BILLBOARD_B3_v1.blend` in Georg's Dropbox (`KFB Racetrack Blender Kit/BILLBOARD-B3/`).

## Reusable learnings for the concept round
- **Layered Googie build** (coloured silhouette body + cream frame + recessed face + light-bulb accents) reads well from the road.
- **Solid rear casing** works: the backside is one object, not a plane.
- **The responsive face → body rule** works mechanically and should survive into the concept.

## Exactly one next gate
**Billboard design concept round** (Claude Design or a design sparring chat): shape language, prop families and placement rules first, geometry after. Search for fitting existing props before modelling.
