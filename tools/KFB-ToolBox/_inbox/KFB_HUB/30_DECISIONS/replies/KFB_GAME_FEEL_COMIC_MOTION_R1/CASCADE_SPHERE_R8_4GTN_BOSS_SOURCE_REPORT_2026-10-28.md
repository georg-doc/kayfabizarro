# R8 4GTN Rig_Large Boss — Source / Design QA evidence
**2026-10-28 · Source reads and static integration-data QA ONLY. No new executable Boss, WS1 gameplay, animation render, real timed combat or Stage.**

## Directly observed this turn
- Original creator published 4GTN as Jan 2026 planetary scout, dormant/forgotten narrative; second source model confirmed in Series 6 by official KayKit site.
- GitHub main directory `media/3D_Assets/KayKit_Mystery_Series6/7 - January 2026 - 4GTN/` includes 4GTN.glb, 4GTN_Forgotten.glb, 4GTN_texture.png, `gltf/4GTN_Katana.gltf` and corresponding .bin. Actual blobs `fa7a7e418ba90703fdabaf272867a46dda5047ab` and `a514ef273142a90fa35e9e4c1cdbfd58f900b93f`, respectively.
- Existing Asset Librarian identifies 4GTN as rigged with **23 joints**. **Joint count alone does not mean Rig_Medium**. Resident Atlas Rig_Large source classification, separately posed Rig_Large 34 historical clips, measured Medium failure vs Large success were read, not rerun.
- Existing `Rig_Large` animation library directory has six present `Rig_Large_{General,MovementBasic,MovementAdvanced,CombatMelee,Simulation,Special}.glb` files. Exact clip selection/weapon animation in current active WS1 still unknown.
- Existing Atlas S34 compares actual 4GTN vs Forgotten geometry, confirms second is a separate GLB with added overgrown hat and larger depth, and confirms separate emissive `4GTN_glow` meshes. Source handslot/katana fit is historical Resident Atlas study, not current Combat event.
- Existing R4 Maze graph and Work document read. R8 design+JSON source created and GitHub-read-back. **24/24 current-turn static source/design assertions PASS**. They validate file references, rig class, two variants, one boss-authority, proposed bounded phase machine, alternative player types deferred and Work F37–F44 routing.

## Still not proven
- **0** new GLB-in-Three source render, actor skinned animation clip sample, foot contact, Katana contact/collision, source glow material animate, weakpoint world socket, boss AI state integrated, real Mech fighting, player swap, gameplay camera, shader, Audio, mobile/desktop FPS, screenshot/clip, saved encounter return, WFC, Site/Stage/Cloudflare.
- Existing historic Rig_Large test metrics and source tool POC are not newly rerun/verified in active WS1b. The boss encounter is a candidate, not an already functioning end-level opponent.
- Boss phase timings, scan behavior and 90–180 s length are creative constraints, not measured success.

## One next gate remains
`WS0_PLATFORMER_ASSET_INTAKE_AND_L01_SOURCE_GATE` for first L01. 4GTN source may be inspected in parallel only through current Asset Librarian; a later independently authorized optional B01 boss proof follows genuine C1–C3, no new engine or auto-release.
