# RETURN · KFB ToolBox Home v1

Date: 2026-09-20
Owner: ToolBox / Hub integration
Repository: `georg-doc/kayfabizarro`
Branch: `toolbox/toolbox-home-v1-2026-09-20`
Parent intake: `asset/kaykit-bits-bundle1-2026-09-20`
Stage target: https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/

## DECISION

Use one lightweight ToolBox Home as the front door. It routes existing owners; it does not rebuild Asset Librarian, Resident Atlas, World/Dungeon, the scene editor, rigging or motion tools.

## IMPLEMENTATION

Added:
- `kfb-hub/stage/toolbox/index.html`
- `kfb-hub/stage/toolbox/toolbox-status.v1.json`
- `kfb-hub/stage/toolbox/TEST_REPORT.md`
- `kfb-hub/stage/toolbox/SOURCE.json`

Updated:
- `kfb-hub/index.html` with a top-level ToolBox link and a never-empty ToolBox direct route.

The ToolBox Home currently exposes 15 cards:
- 8 cards with current Cloudflare routes and real page mini-previews;
- 3 integration-gate cards: shared 3D editor, Tiny Treats rooms/prop groups, Plant Prop Lab;
- 4 source-only cards: Vehicle Animation/Deformer, FrankenStein Studio, Rigging Lab, Animation Lab.

## TESTED RESULT

Static contract: **32/32 PASS**.

Public route visibility is now proven in the KFB in-app browser: the exact Cloudflare URL rendered `KFB ToolBox · Stage` with all 15/15 cards and the three intended sections. Cross-origin iframe completeness and Georg's visual/mobile usefulness review remain separate.

## PUBLIC DEPLOYMENT

**PUBLIC ROUTE VISIBLE · HUMAN GATE OPEN.**

https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/

Verified on 2026-09-20 in the KFB in-app browser: ToolBox title, source-first intro, Build scenes, Integrating now, Current source tools and all 15 named cards rendered. This is Stage evidence, not Live promotion.

## OWNER BOUNDARIES

- Asset Registry + Asset Librarian: canonical asset discovery/truth.
- World Atlas Dungeon Generator S13.2: only current dungeon layout/two-level/stairs/recipe owner.
- Tiny Treats: venue/interior/prop-group recipes; not Dungeon Raid content.
- Shared 3D editor: transform/patch module only; Resident/World/Dungeon hosts keep scene, camera, loaders and runtime.
- Plant Lab: source/registry lane until owner-path Stage promotion.
- ToolBox source-only cards remain source-only until direct Cloudflare routes are proven.

## DROPBOX CROSS-CHECK

Read-only source discovery confirmed current Room Study, Tiny Treats Bakery/Kitchen, Environment/Hex and Plant Lab export lines. Nothing in Dropbox was moved, copied, deleted or promoted.

## OPEN / UNRESOLVED

1. Georg visual/mobile usefulness review of ToolBox Home.
2. Current deployed Asset Librarian revision vs. KayKit Bits Bundle 1 discovery.
3. Scene-editor two-host gate: Resident Atlas then Dungeon.
4. Stable Stage routes + real previews for Plant Lab, Vehicle Lab, FrankenStein, Rigging and Animation Lab.
5. Tiny Treats grouped-room recipes still need consumer proof; no Dungeon mixing.

## ONE NEXT GATE

Georg reviews the public ToolBox Home. If accepted, the first functional integration slice is **3D scene-patch adapter: Resident Atlas first → Dungeon S13.2 second**.


## STAGE PUBLICATION ATTEMPT

Lean publication files were copied additively to `cloudflare-live`:
- ToolBox Home page commit: `a4123884bd4e7f411b3a8dfc380fbc92e32ad953`;
- ToolBox status manifest commit: `f83bf34528e0ece03b81a410efeb685350c048b9`;
- current publication Hub link commit / branch head: `d683a3febe5f583d6fc5036943efd8c7368bdc99`.

Exact public route requested for proof:
https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/

Result update · 2026-09-20: **PUBLIC ROUTE VISIBLE**. The KFB in-app browser opened the exact route and rendered all 15/15 cards across the three intended sections. Cross-origin iframe completeness is not counted; Georg's visual/mobile review remains the single gate. No Live promotion or merge was made.
