# Clay002 512 vs Derek RGB 512 · lokaler Vergleich

Status: **READY FOR LOCAL VISUAL + GPU COMPARISON**
Date: 2026-10-01

## Why this test exists

Global Clay Lite has now passed the representative M1 Max performance check.

Measured:
- procedural Clay: 36.1 fps / 27.73 ms;
- Global Clay Lite · Clay002 512: 92.1 fps / 10.85 ms;
- Global Clay Lite · clay_floor_001 512: 77.0 fps / 12.99 ms;
- Clay off: 89.6 fps / 11.16 ms.

Conclusion:
**Clay002 512 advances as the performance candidate. Visual acceptance is still open.**

Evidence:
`../evidence/WC1_GLOBAL_CLAY_LITE_512_2026-10-01.json`

## What is compared now

Same island world, same mode B, same camera/world state:

1. current procedural Clay reference;
2. Global Clay Lite · Clay002 · 512²;
3. Derek RGB reference tile · 512²;
4. Clay off.

Both lightweight candidates use one active shared 512² texture.

## Derek donor

Source:
`KFB WorldDesign Lab v1`

Pinned ref:
`9248211a831d20f5d6cc665af90a2b38759a4609`

Texture:
`tools/KFB-ToolBox/_inbox/KFB World Design Setup (1)/WORLDDESIGN_LAB_2026-09-23/deliverables/textures/derek-rgb-ref.png`

Blob:
`9548595806461ede898c3c9de09a6905c20cc2ff`

This comparator implements only the Reddit/WorldDesign core:
- one RGB tile;
- triplanar projection;
- RGB channels select three tones derived from each source material colour;
- WorldDesign values: scale 0.32, blend 6, palette spread 0.32, hue drift 0.14, roughness bias 0.10.

Not included in this first fair texture-vs-texture comparison:
- Derek ink;
- Derek cel shading;
- Derek morph;
- extra grain/bump.

Those remain available later if the RGB surface itself is promising.

## Georg-facing artifact

`KFB_Clay002_vs_Derek_Doppelklick.html`

SHA-256:
`347663621a2a75d93755813a95916af6e43e63d3a530a357ca52bb7d0748a175`

Static module syntax:
**PASS** via `node --check`.

## Usage

1. Open in Google Chrome.
2. Use the direct buttons to inspect:
   - current Clay;
   - Clay002;
   - Derek RGB;
   - Clay off.
3. Click **Clay002 vs Derek messen**.
4. Keep the tab visible.
5. Download JSON and return it to Web chat.
6. Also report the simple visual preference: **Clay002 / Derek / current Clay / none**.

No Terminal, server, app or Cloudflare.

## Decision after return

The next decision is not "which has more FPS" alone.

Choose the cheapest candidate that still reads as a convincing KFB world material in:
- near;
- middle;
- far;
- terrain/architecture.

If Clay002 and Derek are both fast, visual quality becomes the deciding factor.

Only after this comparison do we expand into Plaster / Fabric / Wood DIY material families.
