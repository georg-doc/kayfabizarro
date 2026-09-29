# Motion Library v3 × Animation Library × Asset Librarian

Status: BINDING ADDENDUM FOR CLAUDE DESIGN PROTOTYPE  
Date: 2026-09-28  
Source: PR #275 @ `4fa082714c7200f6926008a1cd0b34db8df4dbad`

## One source, two consumers

`media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.catalog.json` is the only canonical motion manifest.

- **Asset Librarian** discovers, filters and explains all manifest clips.
- **Animation Library** previews one registered character with one clip and owns editorial labels, tags, role assignments and inclusion patches.
- **Blender MCP / Motion Library pipeline** owns conversion, measurements, baked GLBs, contact sheets and canonical registration.

Do not copy the 204 records into a second hand-maintained JSON catalog.

## Pinned v3 facts

- schema: `kfb.motion-catalog.v1`;
- 204 clips, 204 unique immutable IDs;
- both `Rig_Medium` and `Rig_Large` library paths per clip;
- Intake 03 adds 25 clips across five physical library groups;
- all 25 contact sheets were human-reviewed in the intake Return;
- earlier v2 files remain byte-identical; four additions intentionally use `*_i03.glb` supplement files;
- raw FBX remains local/Dropbox-only and is never a Librarian download.

## Manifest projection into the existing Librarian

Each catalog clip becomes a derived `motion` discovery row. The adapter may cache/build this projection, but every row retains its source catalog identity.

Minimum fields:

| Librarian field | Canonical source |
|---|---|
| `assetId` | `motion:<clip.id>` |
| name | editorial label when present, otherwise `label_de`, otherwise `id` |
| type | `animation-source` / motion |
| group | `clip.group` |
| rigs | `clip.rigs` |
| duration/FPS | `durationSec`, `fps`, `frames` |
| movement | `rootMotion`, `travelMetersPerCycle`, `facingYawDeg` |
| contacts | `contacts` |
| runtime source | `library.Rig_Medium`, `library.Rig_Large` |
| preview | `sheets/<group>/<id>.png` when present |
| provenance | catalog path, catalog version, PR/head, NOTICE |

Optional v3 facts such as `events.release`, `pairedWith`, seat requirements and handedness must survive the projection. Unknown future fields must not be dropped from the source manifest or block discovery.

## Deep-link contract

The two tools link without sharing runtime ownership:

- Librarian → Animation Library: `?motion=<immutable-id>&actor=<optional-actor-id>`
- Animation Library → Librarian: `?asset=motion:<immutable-id>`

A deep link selects an item; it never changes compatibility or registers an actor automatically.

## Required v3 checks

1. Catalog parser reports 204 rows and 204 unique IDs.
2. Every row resolves at least one real library path; the pinned candidate resolves both rig families.
3. Search `Reden` returns all distinct talk variants rather than collapsing their repeated labels.
4. Filters expose `talk`, `throw`, `action`, `locomotion` and `reaction` Intake-03 records.
5. `kfb_talk_meeting_a` and `kfb_talk_sitting_a` visibly require a seat.
6. `kfb_throw_run_and_throw_a` shows release candidate frame 53, `hand.l`, travel/one-shot guidance and runtime-confirmation status.
7. The shoulder-throw aggressor/victim pair cross-links and never appears as a prop-throw pair.
8. Both supplement and normal group GLBs resolve from the per-clip `library` field; filenames are never guessed from group alone.
9. Contact sheets lazy-load; missing sheets degrade to honest text, not a fake preview.
10. Asset Librarian and Animation Library select the same immutable ID in a roundtrip.
11. Raw FBX is absent from UI URLs, JSON exports and GitHub packaging.

## Stop condition

Claude Design stops after proving the manifest-driven interaction and the cross-tool deep-link. Production registration/build changes stay a separate bounded Asset Librarian adoption slice after the design is accepted.
