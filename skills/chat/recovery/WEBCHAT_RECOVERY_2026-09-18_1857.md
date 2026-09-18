# KFB Web Lead · Recovery Checkpoint · 2026-09-18 18:57 CEST

**Status:** CURRENT WEBCHAT HANDOFF · GitHub/project SSOTs override this summary.

## Repository heads at checkpoint

- `georg-doc/kayfabizarro/main`: `fe61cf0ae593e2cc9ba8e57b221a47936707acc9`
- `georg-doc/KFB-Stunt-Car-Race/main`: `3286ed5315c837753d1efe93d5580460ee9b8642`

Re-fetch before writing; concurrent chats are active.

## Major work completed / prepared during this long webchat

### Assets / Librarian

- four Race KayKit packs unpacked centrally and indexed;
- KayKit Legacy sources + Dungeon 1.0 unpacked and indexed;
- Tiny Treats House Plants unpacked: 113 GLTF + 113 BIN sidecars; Registry/Librarian promotion completed before this checkpoint;
- existing GitHub assets remain canonical; no duplicate Atlas asset warehouses.

### Resident / World Atlas

- Resident S6 and World/Kit Lab reviewed and promoted as candidate tools;
- Legacy Resident source shelf documented;
- Lorekeeper + Tome/lectern + Staff remains the narrow Travel Atlas consumer fixture after its existing gates.

### Travel / World

- full World / TinySkies / Travel→Walk scope restored in Astra Integration brief r3;
- Travel scope includes world/terrain/water/sky/light, Flight↔Ground movement and world authoring/persistence, not just Lorekeeper import;
- separate Movement-in-Context review prepared for Walk/Run/Jump variants;
- Free Roam Walk↔Drive↔Combat preparation exists; Drive remains a deliberate receiver decision, not a third engine.

### Race / Free Roam

- BOX1 + v0.10 work was reconciled; Race has separate current recovery;
- Free Roam public Drive POC remains its own tested lineage;
- OSM City pilots prepared for Ehrenfeld and Hürth;
- OSM City Lab is geometry/data donor, not Drive owner.

### Platformer Hub

- Claude Design first Project-Island composition is classified STRUCTURAL/VISUAL FAIL as kit reconstruction;
- viewer/UI/camera code may remain donor;
- current recovery order:
  `Asset Atlas S0 → Preview Reconstruction S1 → Platform Grammar S2 → Movement S3 → KFB actors S4 → Project Island S5`;
- `Preview.jpg` and `Preview2.jpg` from the actual Platformer pack are now mandatory source references;
- audio frozen for this recovery pass.

### Plant Prop Lab

- P2 donor/lookdev lane;
- Tiny Treats pots/plants + Quaternius sci-fi botanicals;
- PlantRecipe / prop-rig / procedural pot-pattern mental model;
- optional LivingProp layer reuses EyeRig v6 via FaceHost/EyeAnchor;
- Game Dev Studio records Living Plant as backlog, not active Pilot 01.

### Astra

- Astra Integration 01 remains **NOT STARTED**;
- r3 has Race/BOX1 and World/Travel→Walk as equal core product paths;
- do not start a broad multi-repo writer while new core receiver contracts are still being redefined.

## New next prepared slice · Batch EyeRig Atlas

Current user direction:

- mass-mount existing cartoon EyeRig onto KayKit Rig_Medium first;
- then Rig_Large;
- then Legacy;
- later plants / other Frankensteining hosts;
- use Atlas-style batch approval and optional ToolBox connection.

Canonical fresh-chat brief:

`tools/KFB-ToolBox/_handover/EYE_RIG_BATCH_2026-09-18/START_HERE.md`

Key source facts:

- EyeRig v6: `pet-eye-rig.v6.js`, blob `853bcf5fb090dd6564fda8bc83d0b4cb527e6b26`;
- generic skinned biped FaceHost: `facehost.v1.js`, blob `38ec7770f5fccf3aca93ee234f94b801d527d415`;
- FaceHost already measures head-weighted vertices in bind pose and derives facing;
- EyeRig v6 already owns pupils, lids, blink, gaze, splay, Life/Kinetics and public `eyeFrame()`;
- existing stable eye expression ids: neutral/happy/angry/sad/surprised/thinking;
- known lifecycle trap: `build()` alone is insufficient; `update(dt)` must run or lids may appear closed/stuck;
- Resident Atlas Studio provides manual correction collection/export pattern but no generic patch import;
- Race inbox image archive is secondary visual evidence (~515 images / 375.4 MiB), not primary measurement truth.

v0 explicitly excludes lashes/brows/nose/mouth. Eyelids are core EyeRig and stay included.

## Recovery rule

For any fresh chat:

1. read current GitHub main first;
2. read this checkpoint only as routing context;
3. read the named project/ToolBox brief;
4. preserve current owners/contracts;
5. distinguish SOURCE / DECISION / IMPLEMENTATION / TESTED RESULT / HUMAN ACCEPTANCE;
6. no Bash/terminal work for Georg;
7. on connector timeout, re-fetch before retrying because the write may already have succeeded.

No background work is implied by this checkpoint.


## Source-eye cleanup / vehicle extension · addendum

Batch EyeRig brief now additionally records:
- prefer non-destructive mesh/connected-component removal of original KayKit eyes over recolor;
- GothGirl precedent: head mesh 12 islands, eye islands 6+7 removed; mouth separately handled with texclean;
- female outer lash/spike geometry must be classified rather than assumed;
- selected Mouth/Nose/Brow grafts come only after eye-profile approval;
- vehicle EyeRig is a later explicit extension using verified headlight/front-face anchors;
- current Sedan package proves vehicle axes/wheel nodes but **not** named headlight nodes.

Expansion order:
`Medium → Large → Legacy → selected face grafts → vehicle EyeRig → Living Plants`.
