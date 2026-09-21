# KFB Asset Librarian · KayKit Atlas → ToolBox Resource Picker Mapping

**Date:** 2026-09-15  
**Branch:** `chat/kaykit-reference-atlas-2026-09-15`  
**Status:** PROPOSAL / MAPPING CONTRACT NOTES. No ToolBox implementation in this Atlas task.

## 1 · Hard owner boundary

The Reference Atlas must **not** become a second asset Registry or a new compatibility owner.

Existing authoritative paths stay intact:

- Asset files + generated Asset Registry → source/file truth.
- Production Resource Registry → actor/rig/motion/FX resource truth.
- Asset Librarian → read-only discovery, preview and candidate handoff.
- ToolBox / Animation Lab → final attachment, rig, part, motion and visual compatibility.
- Town / Travel / Combat / Stunt → runtime suitability and composition.

Existing handoff remains `kfb.asset-handoff.v1` with `selectionStatus: candidate-only` and `suitabilityDecision: owned-by-receiving-consumer`.

## 2 · Do not mutate `kfb.asset-handoff.v1` for the Atlas

The current compact asset handoff already carries:

- `assetId`
- `name`
- `path`
- `kind`
- `format`
- `packId`
- `collectionPath`
- `dependencyStatus`
- `source`
- `rigFacts`

The Atlas should remain a **sidecar lookup layer** keyed primarily by existing immutable source identity (`assetId`, source path, pack/collection), rather than injecting speculative semantics into generated Registry records.

## 3 · Proposed Atlas sidecar record

Conceptual shape only:

```json
{
  "sourceRef": {
    "assetId": "existing Registry assetId or null",
    "path": "existing repo path or archive/reference path",
    "packId": "existing Registry packId or null",
    "collectionPath": "existing collectionPath or null"
  },
  "atlas": {
    "producer": "KayKit / Kay Lousberg",
    "series": "Mystery 7",
    "month": "2026-09",
    "releaseTier": "FREE | EXTRA | SOURCE | PATREON_MONTHLY | UNKNOWN",
    "ownershipState": "OWNED | REFERENCE_ONLY | NOT_FOUND_IN_CONNECTED_SOURCES | UNKNOWN",
    "registryState": "INDEXED | ARCHIVE_ONLY | NOT_INDEXED | UNKNOWN",
    "parityState": "STRONG | UNVERIFIED | RISK | N/A",
    "referenceEvidence": [],
    "relations": [],
    "kfbUseCandidates": [],
    "confidence": "high | medium | low",
    "statusEvidence": []
  }
}
```

This is **not** a persistent schema decision. Before implementation, reuse an existing sidecar/override/reference owner if one already exists; otherwise propose the smallest additive adjacent artifact.

## 4 · Resource Picker presentation fields

A future Resource Picker can consume Atlas knowledge with compact optional badges/filters rather than exposing research prose.

### Useful compact presentation

- Series: `Mystery 4 / 5 / 6 / 7`
- Month/year for monthly characters
- Tier: `FREE / EXTRA / Patreon`
- Source state: `Indexed / Archive only / Reference only`
- Parity: `Checked / Unverified / Risk`
- Reference evidence: `Demo available`
- Tested evidence: `KFB preview tested`
- Structural related items: `4 same-collection props`

### Keep behind Info / Debug

- exact Dropbox reference filename/path;
- source-page notes;
- dependency warnings;
- confidence language;
- historical container mismatch;
- detailed status provenance;
- rig binding counts / source clip paths.

Normal authoring should remain compact.

## 5 · Proposed relation types

These relations describe discovery evidence, not compatibility:

### `same_collection`

Actual structural sibling asset in the same authored collection.

Examples:

- Goth Girl ↔ Microphone / Mic Stand / Speaker / Stool
- Ultra Turbo Hero Man ↔ Blaster / Sword
- Demon Lord ↔ Demon Heart / Summoning Circle

### `official_companion_pack`

Official source explicitly demonstrates/recommends another pack in composition.

Current evidence:

- Medieval Village Exteriors WIP ↔ Forest Nature Pack trees/rocks

### `official_motion_companion`

Official source explicitly ties a prop/content pack to animation additions.

Current evidence:

- RPG Tools Bits ↔ KayKit Character Animations tool-animation additions

### `reference_demo`

An official/reference GIF/image/video exists for the source.

Example:

- Ultra Turbo Hero Man ↔ Dropbox weapon/grip/pose GIF

### `tested_kfb_preview`

An exact KFB test exists for this actor/source relation.

Example:

- Goth Girl ↔ Rig_Medium clips with measured binding coverage

### `filename_note`

A descriptive recovered filename contains Georg/reference annotations that have not been visually verified.

## 6 · Character Picker mapping

### Existing source truth

Do not build a new hardcoded KayKit roster. Character entries continue to come from Registry/Librarian discovery.

### Atlas enrichment

For physical paths currently living under:

`media/3D_Assets/KayKit_Mystery_Series6/`

Atlas should provide logical series/month grouping:

- Jul 2023–Jun 2024 → Series 4
- Jul 2024–Jun 2025 → Series 5
- Jul 2025–Jun 2026 → Series 6
- Jul 2026 onward → Series 7

Do not rename/move the physical source tree merely to improve UI grouping.

### Proposed Picker behavior

Search/filter can optionally expose:

- `Mystery Series 4`
- `Mystery Series 5`
- `Mystery Series 6`
- `Mystery Series 7`
- month/year
- known measured rig family

Character visibility must not depend on compatibility with the currently selected motion/prop. Unsupported candidates remain visible with compact status.

## 7 · Props / donor palette mapping

### P0 relation: same-collection props

Reuse existing Librarian same-collection discovery first.

Atlas adds human/research context but must not invent ownership:

| Character | Structural sibling assets | Resource Picker treatment |
|---|---|---|
| Goth Girl | Microphone, Mic Stand, Speaker, Stool | high-priority related props; attachment/seating remains ToolBox-owned |
| Ultra Turbo Hero Man | Blaster, Sword | weapon candidates; grip/pose demo reference exists but transform remains untested here |
| Demon Lord | Demon Heart, Summoning Circle | prop/staging candidates; no automatic FX behavior |

### Frankensteining

Do not turn Reference Atlas role labels into swappability claims. The separate ToolBox Coverage / Part Atlas remains the owner for:

- node/mesh separability;
- skeleton signatures;
- bind matrices;
- attachment anchors;
- `DIRECT / ATTACH / CALIBRATE / GRAFT_ADAPTER / EXTRACT_REQUIRED / UNSUPPORTED`.

The Reference Atlas can help prioritize which donors to inspect; it cannot assign those classes by itself.

## 8 · Motion Picker mapping

Motion selection continues to use Production Resource Registry / actual discovered clips.

Atlas can add:

- `official_motion_companion` relationships;
- monthly/source-family context;
- reference-demo pointers;
- tested KFB binding evidence.

### Concrete Goth Girl tested evidence

A useful compact Info state can say:

- Rig family: `Rig_Medium` — measured evidence
- General: `15/15 bound`
- Movement Basic: `11/11 bound`
- Simulation: `14/14 bound`
- Special: `15/15 bound`
- Dance: `not visually accepted yet`

Do **not** transform these numbers into `all Rig_Medium compatible`.

## 9 · Environment / scene Picker mapping

Atlas provides value when official demos show **combinations**, not just individual model identities.

Possible future filters:

- `official companion: Forest Nature`
- `demo reference available`
- `glow/emission reference`
- `stage / boardgame / platforming reference`

These should be presentation filters over Atlas sidecar knowledge, not generated Registry taxonomies.

## 10 · Archive-only source handling

Current archive-only candidates:

- City Builder Bits FREE
- Space Base Bits FREE
- Resource Bits FREE
- Medieval Hexagon FREE

**Decision boundary:** Resource Picker should not fake individual models out of an opaque ZIP. Proper source/import/indexer workflow must expose the real assets first. Until then, the Atlas may show a pack-level `OWNED / ARCHIVE ONLY` card in diagnostics/gap views, but not selectable fake assets.

## 11 · Reference-only media handling

Dropbox promo/GIF/Patreon material should remain linked metadata, not silently copied into public Librarian deployment.

Recommended Resource Picker behavior:

- small `Reference` indicator if a source reference exists;
- optional Open/Inspect action only where licensing/privacy allows;
- no automatic publication/caching of paid Patreon media;
- textual extracted learnings may be stored if they do not reproduce protected media/content excessively.

## 12 · Consumer use mapping

| Atlas signal | Town | Travel | Stunt | Combat | ToolBox | Performance |
|---|---:|---:|---:|---:|---:|---:|
| same-collection props | high | med | med | high | high | high |
| official companion pack | high | high | high | med | low | low |
| motion companion | low | low | low | high | high | high |
| monthly/series grouping | high | low | low | med | high | high |
| glow/material reference | med | med | high | med | med | high |
| demo staging reference | high | med | high | high | med | high |
| archive-only ownership | diagnostic | diagnostic | diagnostic | diagnostic | diagnostic | diagnostic |
| parity risk | high | high | high | high | high | high |

This table is a **PROPOSAL for discovery priority**, not gameplay suitability.

## 13 · Minimal implementation path later

When implementation is explicitly requested, prefer this order:

1. read existing Registry/Production Resource sidecar/override mechanisms;
2. choose the smallest existing-compatible home for Atlas sidecar data;
3. make Resource Picker lookup optional and fail-safe;
4. preserve `kfb.asset-handoff.v1` unchanged unless a real consumer requirement proves otherwise;
5. expose compact UI enrichment only;
6. add browser smoke ensuring candidate-only semantics and owner boundaries remain intact.

No implementation is performed by this document.

## 14 · Acceptance for this mapping document

- no new compatibility owner introduced;
- no Registry generated record redefined;
- physical source path remains immutable;
- historical Mystery container mismatch solved by logical metadata only;
- reference-only/paid media is not republished;
- ToolBox receives better discovery context without the Atlas deciding attachment/rig/motion suitability.
