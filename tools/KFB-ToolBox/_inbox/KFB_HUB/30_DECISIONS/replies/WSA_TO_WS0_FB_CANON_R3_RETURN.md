# WSA → WS0 · FB_CANON R3 RETURN · 2026-10-22 · V-669

Status: R3 candidate for Georg's visual acceptance; no human PASS, no Live, no canonical figure-card promotion. R2 remains rejected. Owner: existing KFB ToolBox.

## Artifact and private handoff
- Private local Dropbox handoff: `50_BLENDER/FB/_wsa_canon_r3_2026-10-22/` below Georg's `Dropbox/CLAUDE/KFB_HUB/`.
- `FB_CANON.glb`: 6,157,112 bytes.
- SHA-256: `17e20ab4293206366381378a3addb9e17599a658a021c51cd1d18e8b7a75a256`.
- Independently loaded downloaded bytes: height **1.81000 m**.
- Source P08 commit `20a012324f6d71080ae5927ee2dfe8f633b2410a`; profile SHA `8b7ac319a0ba9c4b9cdce5fddc738a35d85a8dc517b6f1f40585c378fc843ce9`; Rig eyes, brow depth −0.08, brow pitch 8°.
- Existing managed Sites source repository: `wsa/fb-canon-r3-2026-10-22` @ `afb97250a49dcc5dc0ea1ab1a82d332143b0fe6d`, fetched back and complete tree `969f314f468aae6458149534e12ecf43c061a65d` verified. This is the existing ToolBox's managed source repo, not a kayfabizarro GitHub branch. Patch in packet permits review without access to that repo. No PR/merge.
- Public/private Site publication unchanged: ToolBox v11; the R3 acceptance evidence was generated locally as WS0 requested, not deployed. No new Stage URL.

## R3 corrections
1. Approved E2 whole closed eyelid skin, only lid slit opening. Two exported `KFB_LidSkin_L/R` meshes; old v6 upper/lower shell meshes absent. Existing EyeRig v6 remains the driver through virtual non-mesh rotation handles. No second eye geometry owner.
2. Exact donor chain from private `georg-doc/KFB-Stunt-Car-Race`, `assets/private` pinned `c157d9bf0d9a2ff940bffb56a9f5e59505c8a52b`, `50_BLENDER/K15/stage/vendor/`: clay-skin-attach.v1.1 → clay-eyelid.v3 → unchanged clay-eyelid.v2 (+v1 helper). E2 v2 SHA `7f1cf72fbe926c6f40c8eca70330e61c87b9181a885b3329ffb40034f3fc2675`. Exact source/hash manifest shipped.
3. Original neutral `FB_Mouth_Smile` textured carrier removed, mouth anchor, placement and behavior recipe retained for `pet-mouth.v1 + face-mount.v1`. Stale baked contact-AO COLOR_0 removed from head export copy only. No speech/viseme behavior acceptance claimed in this geometry slice.
4. A remaining horizontal dark groove was isolated by a controlled identical-mesh/light comparison to the existing Knete shader. After the required Guard review, an optional localized clean-region was added to the existing clay-material.v10 owner, default off. Only the head's material is isolated for this option; body, nose and E2 skin keep existing Clay. Smooth falloff in measured neutral mouth-carrier coordinates removes local relief/cavity tint/roughness, with surrounding head relief retained. The region and owner option persist in head extras and appearance metadata. Shader is not baked; consumers must use included body-surface.v2 with `cleanRegions:true` and `e2Skins:true`.
5. Runtime evidence initially showed old cached clay module (`kfb-clay-v10`, no region). Versioned import now loads updated existing owner. Receipt proves actual rendered `kfb-clay-v10-clean-region` with compiled region equal to GLB metadata. No blind relief tuning.
6. Nose: POSITION and INDEX hashes match the live P08 donor; local transform and placement parent transforms match; nose profile unchanged. Position/normal geometry matches R2. Baked AO/color can differ, so no claim of all vertex attributes being byte identical. Long red side silhouette is thus source-faithful; this establishes provenance, not Georg's design intent. No nose redesign.

## Evidence and actual tests
- Seven requested renderer captures: `images/FB_CANON_front_offen.png`, `three_offen.png`, `side_offen.png`, `face_offen.png`, `face_halb.png`, `face_zu.png`, `scale_offen.png` (each carries full FB_CANON_ prefix).
- Additional `images/FB_CANON_side_zu.png` checks closed E2 from side. Vehicle hidden outside size-comparison view, so it cannot occlude face/side captures.
- E2 compared visually against `30_DECISIONS/replies/E2_REFERENCE/E2_approved_closed_lid_skin.png` (SHA `0ca836ff057f9f36380a258978005a440b6c5ed30718630c8708f3fdb109f780`); open/half/closed and side checked. Independent reviewer checked image set and donor topology. Human aesthetic acceptance pending.
- Native GLB audit: 91 nodes, 21 meshes, 8 skins, 38 clips, exactly two E2 skins, old shells and mouth decal absent, no external URI dependency. Both E2 skins are closed 2-manifolds; donor open/half/closed constant topology and finite coordinates verified.
- Every target/channel/interpolation/input/output for all **2,554 tracks across 38 clips** is byte identical to the R2 technical baseline. Idle_A, Walking_A, Running_A, Jump_Start, Jump_Idle, Jump_Land and kfb_dance_chicken_a included.
- Export freshly loads its own bytes and validates rig/skins/tracks/ear neutral state and 1.81 m. Downloaded GLB independently loaded again through existing product loader; receipt and binary audit included.
- Shared `kfb-stage-light/1` only; Clay sheen capped at 0.05. Racer comparison uses existing Crimson Flame Dragster v3, V-321 scale 0.616381042 metres/native unit, orthographic comparison.
- Changed JS syntax and git whitespace checks PASS; exact vendored donor hashes checked.
- Independent Production Guard: bounded source-owner repair justified after root-cause proof; candidate handoff allowed. No Georg PASS inferred.

## Source files changed
`dist/kfb-lib/actor-glb-export.v1.js`, new `actor-appearance-r3.v1.js`, `body-surface.v2.js`, `clay/clay-material.v10.js`, and exact vendor chain + `e2/SOURCE.json`. Existing source/rig/lighting owners reused. P08 JSON unchanged.

## Next gate
WS0 places this packet in the private branch and shows R3 images/GLB to Georg in the Hub. Only after Georg PASS: update private canonical manifest/hash and `FIGURES_R1/frizzlebob.figure.json`. Ear reduction V-643 remains a separate subsequent step. No Live, merge, new tool or replacement asset.
