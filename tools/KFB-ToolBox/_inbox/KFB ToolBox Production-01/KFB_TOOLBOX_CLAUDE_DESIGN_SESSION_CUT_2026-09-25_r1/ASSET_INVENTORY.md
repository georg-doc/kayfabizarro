# ASSET INVENTORY

| Class | Asset | Note |
|---|---|---|
| EXPORTED | KFB ToolBox Production-01.dc.html | entry point |
| EXPORTED | support.js | DC runtime (relative ./support.js) |
| EXPORTED | kfb-lib/pet-library.v6.js | Cube-pet owner, imported relative ./kfb-lib/ |
| EXPORTED | kfb-lib/pet-eye-rig.v6.js | local mirror (pet-library sibling); runtime EyeRig comes pinned from repo |
| PINNED_REMOTE | georg-doc/kayfabizarro@8922d4b1 · tools/KFB-ToolBox/lib/edit-layer.js, kfb-rigs-embed-v3/** (graft chain, pose-rig.v1, pet-mouth.v1, EyeRig v6), graft profile, tools/resident_atlas/scenes/* | jsDelivr / raw |
| PINNED_REMOTE | georg-doc/kayfabizarro@032c9d50 · media/3D_Assets/Animations/KFB_Motion_Library/{catalog, profile-catalog.v1, motion-profile-reader.v1.js, Rig_Medium/Large GLB} | jsDelivr, raw fallback |
| PINNED_REMOTE | georg-doc/kayfabizarro@b97b5ac5 · KayKit_Character_Animations_1.1 Rig_Large_MovementBasic.glb | raw |
| PINNED_REMOTE | georg-doc/kayfabizarro@10a7fdce · KayKit Legacy (Orc Warband parts+props, Character Animations 1.2 rig) | raw |
| PINNED_REMOTE | georg-doc/kayfabizarro@891eadf0 · OrcBrute.glb + orcbrute_texture_A.png; Resident assets | raw |
| UNPINNED_REMOTE | pet-library.v6 PET_BASE (main) · Cube-pet GLBs | owner-defined, unchanged |
| UNPINNED_REMOTE | pet-mouth.v1 MOUTH_BASE (main) · mouth PNGs; graft-mount RAW (main) · host GLBs | owner-defined inside pinned modules |
| CDN_EXTERNAL | unpkg three@0.160.0 (three, OrbitControls, GLTFLoader, TransformControls via edit-layer) | importmap |
| CDN_EXTERNAL | fonts.googleapis.com · Space Grotesk, IBM Plex Mono |  |
| LOCAL_NOT_EXPORTED | localStorage key kfb-toolbox-production-01 (Georg's workspace save) | browser-local by design |
