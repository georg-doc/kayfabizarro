# KFB Legacy Web Pet v0 · Chrome Extension + Hub Embed

**Date:** 2026-09-21  
**Status:** IMPLEMENTATION CANDIDATE  
**Owner:** KFB ToolBox / Legacy Web Pet presentation adapter  
**Branch:** `chatgpt-web/legacy-web-pet-v0-2026-09-21`  
**Outcome:** one shared Legacy pet presentation runtime for arbitrary Chrome pages and KFB Hub embedding.

## Scope

v0 only:

- one real Rig_Legacy character walks/runs/hops along the bottom of the viewport;
- transparent WebGL overlay with real 3D shadow;
- home/camp at bottom-right;
- camp always uses the exact Legacy Orc Warband banner plus two hostname-stable choices from sword/shield/hammer-axe;
- left-click on the pet triggers one random real Legacy animation plus procedural user-gesture SFX and small 3D particle VFX;
- right-click on pet or camp opens a compact character picker;
- character choices: Barbarian, Knight, Mage, Rogue;
- same host adapter is used by Chrome extension and KFB Hub;
- KFB Hub branch candidate mounts the pet by default;
- `?pet=0` suppresses the Hub embed.

Deferred:
- LLM chat;
- alternate-head authoring;
- gameplay/state/AI;
- Combat/WhackMan integration;
- Chrome Web Store packaging/signing.

## Reused owners

- Rig_Legacy assembly: exact vendored snapshot of the proven Legacy adapter from PR #155 lineage.
- Motion: real 6-bone / 30-clip Legacy donor.
- Character sources: KayKit Dungeon 1.0.
- Camp props: exact Orc Warband GLB browser sources.
- No second animation owner.

## Fixed candidate Stage

`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/legacy-web-pet/`

Do not claim PUBLIC_VERIFIED until opened on Cloudflare.

## First acceptance

1. Hub/demo overlay boots with real Rogue and camp.
2. Pet walks/runs and visibly hops.
3. 3D shadow remains attached.
4. Click triggers a non-Idle Legacy clip + VFX; SFX is initiated from the real user click.
5. Right-click picker changes to Mage.
6. Extension build contains no remote executable JS and injects the same pet on a plain test page.
7. Arbitrary page content remains clickable outside the narrow pet/camp hitboxes.
