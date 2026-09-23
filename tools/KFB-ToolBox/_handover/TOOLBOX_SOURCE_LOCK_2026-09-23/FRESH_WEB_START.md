# Paste-ready · KFB ToolBox Resident Set Portability · Fresh Web Chat · 2026-09-23

@GitHub @Dropbox

Continue the KFB ToolBox recovery.

Read current versions of:

1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `skills/design-3d_combined_for-design_v1.md`
5. `tools/KFB-ToolBox/_handover/TOOLBOX_SOURCE_LOCK_2026-09-23/START_HERE.md`
6. `tools/KFB-ToolBox/_handover/TOOLBOX_SOURCE_LOCK_2026-09-23/RESIDENT_SET_PORTABILITY_GATE.md`
7. `tools/resident_atlas_s6/data/cast.js`
8. `tools/resident_atlas_s6/lib/atlas.js`
9. `tools/resident_atlas_s6/docs/ASSET_MANIFEST.json`
10. `tools/resident_atlas_s6/docs/ATLAS_RETURN.md`

GitHub state wins.

## Important

Do **not** continue or repair the rejected Claude Round-1 ToolBox.

Do **not** start with isolated actors.

The repeated ChatGPT/HTML failures are now treated as one transport problem:
model + textures + pose + prop attachment + multi-actor state must survive the review/export boundary together.

## One task only · TB-RESIDENT-PORTABILITY-01

Build one zero-install review:

`TOOLBOX_RESIDENT_SET_PORTABILITY_REVIEW.html`

Use three existing Resident Atlas combinations as complete donor fixtures.

### A · Goth Girl

Resident:
`goth-girl`

Prove:
- correct actor/model;
- expected material/texture;
- existing pose/animation;
- stool;
- seated relation;
- ground/contact behavior.

### B · Orc Warband

Resident:
`orc-warband`

Prove:
- both intended characters;
- Legacy assembly;
- expected textures;
- weapons/props;
- attachment relations;
- animation/motion on the intended actors.

### C · Animatronic

Resident:
`animatronic`

Prove:
- both intended characters;
- expected texture/texture variant;
- guitars/props;
- pose/attachment relations;
- existing compatible motion.

## Three views per set

For each set show:

1. **Resident Atlas donor**
2. **ToolBox/review import**
3. **Export → reload**

The goal is visual parity, not a redesigned scene.

## Asset transport rule

Use canonical pinned GitHub RAW URLs.

Never rely on relative `./assets/...` paths in the standalone review.

Do not embed replacement models or silently flatten missing textures.

If a source fails, show the failure and exact missing source. Do not insert a sign, primitive or generic substitute as if it were the asset.

## Pass / fail

Each resident set must visibly preserve:

- actor count;
- correct model identity;
- textures/materials;
- pose;
- ground contact;
- prop count;
- prop placement/attachment;
- selected animation/clip;
- state after export/reload.

A single silent replacement or lost texture is FAIL.

## No extra scope

No FrizzleBob lineage integration yet.
No complete Studio roster yet.
No Stage-First ToolBox rebuild.
No Claude Design.
No Cloudflare.
No Work.

Those come only after the resident-set transport passes.

## Return

Return:

- exact GitHub branch/head;
- `TOOLBOX_RESIDENT_SET_PORTABILITY_REVIEW.html`;
- pass/fail matrix for the three sets;
- exact missing URLs/dependencies if any;
- export/reload result;
- then STOP for Georg.

Exactly one next gate:
**Georg reviews the three resident sets.**
