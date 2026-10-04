# Resident Atlas · KayKit Legacy Intake · 2026-09-18

**Status:** SOURCE AVAILABLE / REGISTRY INDEXED · CANDIDATE-ONLY  
**No cast promotion is implied.** The existing S6 21-resident cast remains unchanged until a resident recipe is explicitly authored and reviewed.

## Source truth

Central source:

`georg-doc/kayfabizarro/media/3D_Assets/KayKit Legacy/`

Intake manifest:

`media/3D_Assets/KayKit Legacy/KAYKIT_LEGACY_INTAKE_2026-09-18.json`

Canonical Asset Registry pack after PR #51:

`kaykit-legacy`

Registry source commit:

`eb48f50489b9e4903ec1e3d2fb1837605ce7d792`

The pack is split structurally through `collectionPath`; do not collapse the five historical products into one semantic character family merely because Registry stores them under the top-level `KayKit Legacy` pack.

## Resident-relevant browser sources

### Dungeon Pack 1.0 · legacy

Path:

`media/3D_Assets/KayKit Legacy/KayKit Dungeon Pack 1.0 2/`

The ZIP is preserved beside the extracted tree.

Extracted payload:

- 210 files;
- 202 GLTF/GLB model files;
- License present.

Direct character candidates:

- `Models/Characters/gltf/character_barbarian.gltf`
- `Models/Characters/gltf/character_knight.gltf`
- `Models/Characters/gltf/character_mage.gltf`
- `Models/Characters/gltf/character_rogue.gltf`

This is a legacy 1.0 source. It does **not** replace `KayKit_Dungeon_Pack_1.1_FREE 2`, which remains the current Dungeon source used by the existing S13 World/Dungeon work.

### Legacy Character Pack · Skeletons 1.0

Path:

`media/3D_Assets/KayKit Legacy/KayKit Legacy Character Pack - Skeletons 1.0/`

37 GLTF/GLB model files.

Direct resident candidates:

- Skeleton Archer
- Skeleton Archer Broken
- Skeleton Mage
- Skeleton Mage Broken
- Skeleton Minion
- Skeleton Minion Broken
- Skeleton Warrior
- Skeleton Warrior Broken

Relevant exact files are under:

`Models/characters/gltf/`

The pack also contains bows, helmets, hoods, mage clothing, staff, spellbook, shield and bone/skull props under `Models/assets/gltf/`.

### Spooktober Seasonal Pack 1.1

Path:

`media/3D_Assets/KayKit Legacy/KayKit Spooktober Seasonal Pack 1.1/`

48 GLTF/GLB model files.

Direct resident candidates:

- `Models/Characters/Jack/gltf/character_jack.gltf`
- `Models/Characters/Witch/gltf/character_witch.gltf`

Useful habitat/signature-prop candidates include cauldron, coffins, fences, gravestone, jack-o-lanterns, shrine, graveyard tiles and graveyard trees.

### Orc Warband · legacy

Path:

`media/3D_Assets/KayKit Legacy/Orc Warband - legacy/`

Preferred browser character sources:

- `characters/gltf/character_orcA.gltf`
- `characters/gltf/character_orcB.gltf`

Preferred browser prop sources:

- `props/gltf/orc_banner.gltf.glb`
- `props/gltf/orc_hammerAxe.gltf.glb`
- `props/gltf/orc_shield.gltf.glb`
- `props/gltf/orc_sword.gltf.glb`

DAE/FBX/OBJ variants remain source provenance. Do not use them as additional “different residents” or preferred browser representations when the equivalent GLTF/GLB exists.

### Character Animations 1.2 · legacy

Path:

`media/3D_Assets/KayKit Legacy/KayKit Character Animations 1.2 - legacy/`

Historical animation source, including:

`Animations/gltf/KayKit_AnimatedCharacter_v1.2.glb`

and historical FBX single animations.

This is **motion source evidence only**. Presence in the same top-level Legacy folder does not prove compatibility with Skeleton, Spooktober, Orc or Dungeon residents.

Movement / Animation Lab remains the final animation-compatibility owner.

## Librarian result

Canonical Registry after PR #51:

- `kaykit-legacy`: **389 assets**
- five structural collections;
- GLTF/GLB entries retain exact GitHub paths and pinned source provenance;
- alternatives such as DAE/FBX/OBJ remain searchable provenance;
- successful Librarian preview remains candidate evidence only.

Whole canonical registry at this source revision:

- **14,226 assets**
- **5,981 3D models**
- **107 packs**
- **383 rigged models**
- **423 animated models**

## Resident Atlas use rule

For a new Resident Atlas recipe:

1. pick the exact GitHub `AssetRef` from Registry/Librarian;
2. prefer GLB/GLTF for browser authoring;
3. choose a small habitat/landmark + signature props from the same or explicitly named compatible source;
4. measure transforms in Atlas instead of reconstructing by screenshot;
5. keep resulting recipe `candidate-only`;
6. audition animations separately through the existing compatibility owner;
7. do not overwrite an existing Resident identity merely because a legacy model looks similar.

## Candidate expansion ideas — not decisions

Source-backed candidates now possible include, for example:

- Skeleton Archer + quiver/bow + graveyard/shrine context;
- Skeleton Mage + staff/spellbook + graveyard context;
- Witch + cauldron + Spooktober habitat;
- Jack + jack-o-lantern + graveyard/tree habitat;
- Orc A/B + banner/shield/axe;
- Dungeon Barbarian / Knight / Mage / Rogue with Dungeon 1.0 signature props.

These are **PROPOSALS / candidate ensembles**, not implemented S6 residents.

## Tested result

- Legacy Dungeon ZIP blob verified before extraction.
- Unsafe ZIP paths / symlinks rejected by the one-shot unpack gate.
- extracted Dungeon payload contains 202 GLTF/GLB models.
- Asset Registry unit/contract tests, build, validation, rigfacts and handoff smoke passed on the Legacy source revision.
- PR #51 Resource Registry gate: PASS.
- PR #51 Asset Librarian Browser Smoke v1–v1.7: PASS.

No human Resident Atlas composition/visual acceptance is claimed by this document.
