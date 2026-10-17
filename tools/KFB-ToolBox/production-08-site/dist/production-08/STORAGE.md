# STORAGE · localStorage of KFB ToolBox Production-08

| Key | Read / write | Content |
|---|---|---|
| `kfb-toolbox-production-08` | R/W · **main store** | Whole workspace (schema below). Written only by **Save**. **Reload** reads it. »Reset to fixture« removes it |
| `kfb-toolbox-production-08.pre-selftest` | R/W/remove | Backup taken during a self-test run. Restored on the next boot, then removed (`__none__` = there was no save) |
| `kfb-toolbox-production-06` | R (once) | Seed: copied into -08 only if -08 does not exist yet |
| `kfb-toolbox-production-05` | R (once) | Seed, same rule (after -06) |
| `kfb-toolbox-production-01` | R (once) | Seed, same rule (after -05; the P03/P04 key) |
| `kfb-anim-library.patch.v1` | R/W | Library tab: editorial patch (kfb.animation-editorial-patch/1), separate from the workspace |
| `kfb-toolbox-fold` | R/W | UI: which Rigging sections are folded |
| `kfb-toolbox-explain` | R/W | UI: notes switch ('1' / '0') |

No module in `kfb-lib/` touches localStorage or sessionStorage (checked by search).

## Workspace schema (`kfb-toolbox-production-08`)
```
{ format: 'kfb-toolbox-workspace', version: 1, id: 'tb-production-01',   // id is checked on load; mismatch = ignored
  savedAt: ISO, ui: { tab, section },
  scene:   WB2/R2 scene doc (kfb-worldbuilder-scene v1 records: stage preset, objects[], actor record with rosterId)
  actors:  { [rosterId]: { schema: 'kfb.actor-profile/0.1', id, label, rigFamily, face: {}, legacy,
                           ears (kfb.ear-rig.v0#tuning), body, hair, lids (EyeRig sliders u/l/s/du/dl/ds/sd),
                           clay (clay-lids fields + one-time migration flags), emotes?, surface?, partColors? } },
  rigs:    { [rosterId]: face-mount entry = F.export() (color, eye, brow, nose, moustache, mouth, original.*, parts) },
  poses:   { [id]: kfb.pose-profile/0.1 }, active: { [rosterId]: { poseId, poseOn } },
  motion:  { [rosterId]: kfb.motion-profile/0.1 }, locomotion: {}, fits: {},
  contactAO?, surfaceLight?, earReview?, solverGate? }
```

## Import · Export (Rigging › Import · Export)
- **Export** (Download / Copy) writes **kfb.pets/1**: `{ schema: 'kfb.pets/1', version: 1, meta { exportedBy, exportedAt, fields }, eyeRig, face, mouth, pets: [entry] }`.
  - FB Ear Rig entry: `kind: 'biped'`, `module: 'FaceHost'`, `variant: 'earrig-v5'`, `source { glb, commit, reader, head }`, the face-mount fields, plus hair, body, ears, lids, clayLids, emotes, surface.
  - Driver Graft: the pinned Driver contract with `pets[graft-driver]` replaced.
  - Cube Pet: `kind: 'cube-pet'`, `module: 'EyeRig'`.
- **Import** takes kfb.pets/1 or a Driver contract (or a bare entry with eye/body/ears/surface). It picks the entry whose id equals the current actor; otherwise the first one with face/ears/body fields. Then: F.load (face fields), body, surface, emotes, hair, ears, lids, clayLids. The result is `rigs[rid]` and the actor profile.
- **Not in the export:** `partColors` (brow/nose colour of model parts, added 14.10.) (A13). Pose, motion and scene profiles have their own exports (motion: kfb.motion-profile/1).
- Example: `data/kfb-pet-frizzlebob-earrig-v5.georg-2026-10-14.json`.
