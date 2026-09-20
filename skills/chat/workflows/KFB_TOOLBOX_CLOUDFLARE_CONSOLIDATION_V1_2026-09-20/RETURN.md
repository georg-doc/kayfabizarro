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

No public browser pass is claimed. The external browser reader in this chat could not access the current Cloudflare Pages host, so the public deployment state remains separate.

## PUBLIC DEPLOYMENT

**PENDING.**

Target route only:
https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/

Do not call this slice live until that exact route is opened and the build marker `KFB_TOOLBOX_HOME_V1_2026_09_20` is visibly present.

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

1. Public ToolBox Home browser proof.
2. Current deployed Asset Librarian revision vs. KayKit Bits Bundle 1 discovery.
3. Scene-editor two-host gate: Resident Atlas then Dungeon.
4. Stable Stage routes + real previews for Plant Lab, Vehicle Lab, FrankenStein, Rigging and Animation Lab.
5. Tiny Treats grouped-room recipes still need consumer proof; no Dungeon mixing.

## ONE NEXT GATE

Publish this exact candidate to the Cloudflare Stage path and perform the human ToolBox Home review. After that, the first functional integration slice is **3D scene-patch adapter: Resident Atlas → Dungeon S13.2**.


## STAGE PUBLICATION ATTEMPT

Lean publication files were copied additively to `cloudflare-live`:
- ToolBox Home page commit: `a4123884bd4e7f411b3a8dfc380fbc92e32ad953`;
- ToolBox status manifest commit: `f83bf34528e0ece03b81a410efeb685350c048b9`;
- current publication Hub link commit / branch head: `d683a3febe5f583d6fc5036943efd8c7368bdc99`.

Exact public route requested for proof:
https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/

Result: **PUBLIC PROOF UNKNOWN**. The external web reader rejected access to the Pages host and the execution container then failed DNS resolution. This is not counted as a site failure and not counted as a PASS. The Stage branch content itself was fetched back from GitHub after every write and contains the expected build marker.
