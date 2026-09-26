# KFB × ClayBound · Blender MCP handoff · Asset 01 + Asset 03 · 2026-09-26

Status: **REVIEW-GATED PIPELINE INPUT · ASSET 01 HUMAN ACCEPTED · ASSET 03 FROZEN CANDIDATE · NO BLENDER/RUNTIME PROMOTION**

Owner: **KFB ToolBox / ClayBound material exploration**  
Receiving lane: **Blender / Blender MCP**  
Current Blender planning owner: **PR #228 · `claude/claybound-blender-lane-plan-2026-09-26`**  
Human look authority: **Georg**

## Read first

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `tools/KFB-ToolBox/_inbox/KFB Style References/ClayBound Cozy Platformer + Editor/CLAYBOUND_INPUT_INTAKE_2026-09-26.md`
5. `.../NOTEBOOKLM_KFB_CLAYBOUND_DEMO_2026-09-26/RESEARCH_ROUND_01_REVIEW.md`
6. `.../NOTEBOOKLM_KFB_CLAYBOUND_DEMO_2026-09-26/BLENDER_LANE_PLAN_CLAYBOUND_2026-09-26.md`
7. this handoff + `ASSET_MANIFEST.json` + `RECOVERY.md`

GitHub state outranks prior chat memory.

## Asset state

### Asset 01 · smooth matte clay · r1

- queue: **1**
- human state: **HUMAN_ACCEPTED**
- 1024×1024 RGB PNG
- SHA-256: `fb952516a6c77448b7107486256798ca201629a3c2fac4397121906dd3c04ea5`
- opposite-edge raster equality: **PASS · 0.00 MAE X/Y**
- role: **Base Color candidate**
- Blender proof: **not run yet**

Use this only as the colour/base surface input. Do not derive a roughness, height or normal claim from it.

### Asset 02 · fine-grain clay

**DEFERRED BY EXPLICIT USER JUMP.**

Do not silently mark it complete.

### Asset 03 · rough / porous handmade clay · meso-height

Current technical candidate: **r2**.

- 2048×2048
- 16-bit grayscale PNG
- SHA-256: `f1d3cf4e5bd0b65e9a7d3d61c38b119efa25270e5905ddd36a50796e02f28e69`
- intent: **relative meso-height source**
- color space: **Non-Color**
- physical displacement calibration: **NOT CLAIMED**
- edge QA: **PASS**
  - X seam/local ratio: 0.898
  - Y seam/local ratio: 0.941
  - half-offset X: 1.104
  - half-offset Y: 1.268
  - acceptance threshold used: < 1.35
- human look gate: **OPEN**
- caveat: r2 is technically tile-green but still reads more cloud/noise-like than the desired hand-modelled sculpt language.

Recovery candidate **r3** is visually closer to broad kneading/compression strokes but **fails tile QA** (X 2.123 / Y 2.079). It is evidence only and must not enter a material.

Per KFB two-pass rule, do not patch r3 again in this slice.

## Blender use contract

### Before Georg accepts Asset 03

Do **not** apply Asset 03 to a production KFB model, source GLB, rig or shipping material.

Allowed:
- inspect source PNG in isolation;
- reproduce r2 with `generator_asset03_r2.py`;
- build a neutral throwaway plane/sphere evaluation scene if needed to answer the human look question;
- verify Blender 5.2 image loading and node sockets without mutating a KFB source asset.

### After Georg accepts Asset 03

Smallest valid CLAY-B0/B1 use:

1. Verify the exact PNG SHA-256 before use.
2. Load Asset 03 as **Non-Color**.
3. Feed it into **Bump · Height** in a valid Bump chain.
4. Do **not** connect the grayscale height map directly to a Normal socket and do not stack Normal Map nodes.
5. Keep Asset 01 colour, Asset 03 meso relief, future micro grain and future roughness variation as separate controls.
6. For deforming character meshes use stable UV/tangent-space downstream detail. Prove two animation poses with no texture swimming.
7. For static scenery only, object-space/triplanar mapping may be tested.
8. Preserve existing material slots; never collapse eyes, mouth, hair, emissive, transparent or prop zones into one clay material.
9. Work on a copy of one approved KFB asset only. No blanket Apply Transforms, modifier re-ordering or rig conversion.
10. Any numeric Bump strength/distance, roughness, SSS or texel-density value is **CALIBRATION START**, not ClayBound truth.

## Renderer tiers

Keep the existing PR #228 separation:

- **T1 · Cycles look-dev:** Cycles-only features may be used for look-dev/bake source.
- **T2 · EEVEE approximation:** valid portable procedural/Bump setup; no Random Walk assumption.
- **T3 · GLB/runtime:** Principled + tested baked maps. Do not assume Blender procedural nodes export.

The proposed `kfb.clay-material/0.1` glTF-extras contract remains **DRAFT** until the WSA/Web owner accepts it. Asset 03 should not become a raw runtime-height dependency by default; after acceptance/calibration, bake/derive a tested tangent-space normal or another explicitly approved runtime representation.

## Donor / QA reuse

Do not invent a second seam system.

Reuse the verified ToolBox donor:
- PR **#173**
- branch `chatgpt-web/toolbox-tileable-macro-seam-2026-09-22`
- source `tileable-rgb-brush.v1.js`
- public evidence: **17/17 PASS**
- Stage donor: `https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/tileable-macro-seam-lab/`

Asset 03 uses the same seam/local and half-offset QA logic conceptually.

## Binary ownership

The exact candidate PNGs are review artifacts in the current ChatGPT handoff. They are intentionally **not promoted to a repository binary destination in this slice** because the approved ToolBox/Asset-Librarian destination is not yet named and Asset 03 has no human look PASS.

GitHub preserves:
- hashes;
- dimensions/formats;
- QA metrics;
- deterministic r2 generator;
- Blender use contract;
- failure recovery.

Once Georg accepts a candidate, route the exact binary into the existing asset/library owner. Do not create a parallel clay registry.

## Exactly one next gate

**GEORG HUMAN REVIEW · Asset 03 r2 look.**

Question: is the technically seamless r2 already sufficiently coarse/hand-modelled for the KFB clay language?

- **PASS** → Blender MCP may run one isolated CLAY-B0/B1 material proof using the exact r2 SHA.
- **TUNE/REJECT** → start a fresh Asset-03 slice from the preserved r3 sculpt-stroke direction and the verified PR #173 periodic seam donor; do not continue patching this slice.
