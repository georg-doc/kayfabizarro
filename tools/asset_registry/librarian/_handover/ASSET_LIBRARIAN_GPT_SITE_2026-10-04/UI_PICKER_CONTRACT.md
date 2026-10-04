# KFB Asset Librarian GPT Site · UI / Picker Contract

Status: **WSA INPUT · UI CONTRACT**  
Date: 2026-10-04  
Parent: `START_HERE.md`

## Design intent

The Site should look and behave like a focused asset browser, not like an internal diagnostics console.

Daily-use priority:
1. find;
2. visually inspect;
3. collect;
4. use in a consumer.

Technical evidence stays available, but it is secondary.

## Full Librarian layout

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ KFB Asset Librarian                                      Registry ● current │
│ [ Search assets, packs, characters, props, motions…                   ⌘K ] │
│ [Family ▼] [Pack ▼] [Collection ▼] [Type ▼]  [Rigged] [Animated] [Filters]│
├───────────────┬───────────────────────────────────────────┬─────────────────┤
│ Browse        │  Results                                  │ Inspector       │
│ Motions       │  248 matches                              │                 │
│ Saved Sets    │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐   │ large preview   │
│ Intake        │  │thumb │ │thumb │ │thumb │ │thumb │   │                 │
│               │  │name  │ │name  │ │name  │ │name  │   │ name / source   │
│               │  │pack  │ │pack  │ │pack  │ │pack  │   │ useful facts    │
│               │  │ +Set │ │ +Set │ │ +Set │ │ +Set │   │ provenance      │
│               │  └──────┘ └──────┘ └──────┘ └──────┘   │ [Add to Set]    │
│               │                                           │ [Use / Handoff] │
├───────────────┴───────────────────────────────────────────┴─────────────────┤
│ Current Set: Town Market · 6 items                 [Open] [Save] [Handoff] │
└─────────────────────────────────────────────────────────────────────────────┘
```

On narrow widths:
- left navigation collapses;
- inspector becomes a slide-over;
- current set becomes a bottom sheet;
- filters become a single drawer;
- result grid remains the primary surface.

## Navigation

### Browse
Default landing surface for Assets + production resources.

### Motions
A focused motion-discovery view using the existing Motion resource owner and proven Motion-on-Actor preview seam.

Do not expose authoring controls that belong to Animation Lab.

### Saved Sets
Human-friendly collection management over the existing candidate handoff format.

### Intake
New/unregistered sources only. Visually separate from canonical results.

## Search behavior

### Live query
- debounced;
- Enter is optional, not required;
- query does not mutate any filter;
- clearing query keeps facets;
- resetting filters does not destroy the current Saved Set.

### Facet dependencies
- Family filters Pack options;
- Pack filters Collection options;
- Collection is disabled until a Pack is selected when the Registry cannot resolve collection names globally;
- changing Family clears invalid Pack/Collection choices;
- changing Pack clears invalid Collection choice.

### Human labels
Show human-readable labels first. Technical IDs remain inspectable/copyable.

Examples:
- `KayKit`
- `Tiny Treats`
- `Kenney`
- `Quaternius`

The label is presentation; underlying Registry IDs remain canonical.

## Filter hierarchy

### Always visible
- Family
- Pack
- Collection
- Type

### Quick chips
- 3D
- Image
- Audio
- Rigged
- Animated

### More filters drawer
- format;
- representation: Primary / All;
- dependency state;
- review/problem state;
- rig family when present;
- clip contains;
- joint contains;
- provenance/license state if supported by current Registry facts.

No filter may create facts that are absent from the Registry.

## Result card

Minimum:
- preview or deterministic placeholder generated from known type only;
- display name;
- Pack;
- Collection if useful;
- concise type/status chips;
- Add to Set control.

Optional:
- rig family;
- animation count;
- format.

Do not show repository paths, SHAs, dependency tables or long IDs on the card.

## Inspector

Order:
1. visual preview;
2. name + Family / Pack / Collection;
3. useful human facts;
4. selection/use actions;
5. provenance;
6. technical details.

### Human facts
Depending on item:
- asset type;
- format;
- dimensions when available;
- rig family / joint count;
- embedded animation count;
- dependency state;
- current resource status.

### Technical drawer
Contains:
- asset/resource ID;
- exact path;
- source repo/ref;
- pinned/raw references;
- dependency list;
- review issues;
- complete provenance.

## Preview rules

Reuse current preview owners:
- Three.js 3D preview for supported models;
- image preview;
- audio player;
- metadata-only fallback.

Motion discovery may load a chosen real preview actor through the existing proven binding path.

No new scrub/transport system in this Site slice.

## Saved Sets

### User model
A Saved Set is a named working collection, e.g.:
- `Town Market Props`
- `Utopia Residents`
- `Ring + Wrestling Props`
- `Curtain Character Candidates`

### UI actions
- New Set
- Add
- Remove
- Reorder
- Rename
- Duplicate
- Notes
- Export
- Import
- Handoff

### Machine representation

The Site may wrap the existing `kfb.asset-handoff.v1` payload with a small presentation envelope:

```json
{
  "schema": "kfb.asset-saved-set.v1",
  "id": "local-or-site-id",
  "name": "Town Market Props",
  "notes": "",
  "items": [
    {
      "kind": "asset",
      "id": "registry-asset-id",
      "source": "registry"
    }
  ],
  "handoff": {
    "schema": "kfb.asset-handoff.v1",
    "consumer": "worldbuilder",
    "status": "candidate-only"
  }
}
```

If a simpler native Site persistence object is preferable, keep the export boundary equivalent.

### Important
JSON is an interoperability layer, not the daily UI.

## Compact Picker layout

Used inside God Mode / WorldBuilder.

```text
┌─────────────────────────────────────────────────────────────┐
│ Assets  [Search…                         ] [Filters] [Set 4] │
│ [KayKit ▼] [Pack ▼] [Collection ▼] [Props ▼]              │
├─────────────────────────────────────────────────────────────┤
│ ▣ ▣ ▣ ▣ ▣ ▣ ▣ ▣   compact scrollable palette              │
│ ▣ ▣ ▣ ▣ ▣ ▣ ▣ ▣                                      [>] │
├─────────────────────────────────────────────────────────────┤
│ selected: market_stall_02 · KayKit · Medieval               │
│ [Preview] [Add to Set] [Place candidate]                    │
└─────────────────────────────────────────────────────────────┘
```

### Shared logic requirement
The compact Picker must consume the same search/query service and item identity model as the full Site.

It may have different layout, not different truth.

## WorldBuilder handoff

The Librarian/Picker returns:
- stable item identity;
- source/provenance;
- candidate payload;
- optional transform suggestion only if already source-backed.

WorldBuilder owns:
- scene insertion;
- transform;
- placement;
- deletion;
- scene save/reload;
- runtime behavior.

No direct scene mutation from the full Librarian Site.

## Intake UX

### Entry
`Add asset`

Potential source adapters:
- Dropbox reference;
- file attachment;
- existing GitHub path;
- later other approved sources.

### States
1. `INTAKE`
2. `PREVIEWABLE`
3. `REGISTRY_PENDING`
4. `REGISTERED`
5. `REJECTED / HOLD`

Only `REGISTERED` items are canonical Registry results.

### Immediate search
The Site may include Intake items in search immediately if:
- they are clearly badged;
- canonical and intake scopes are distinguishable;
- the intake identity cannot silently shadow a canonical Registry item.

## LLM-readable surface

The Site should expose a structured item payload to connected agents so an LLM can use exact IDs/paths/provenance without inferring them from pixels.

Minimum item object:
```json
{
  "id": "",
  "scope": "asset|actor|rig|motion|fx|intake",
  "name": "",
  "family": "",
  "pack": "",
  "collection": "",
  "type": "",
  "format": "",
  "sourcePath": "",
  "sourceRef": "",
  "preview": {},
  "provenance": {},
  "candidateOnly": true
}
```

## Visual language

Use the same interface grammar later in WorldBuilder:
- compact rounded controls;
- neutral surfaces;
- asset preview carries the visual emphasis;
- one primary action per context;
- minimal badges;
- no dashboard-like wall of status pills;
- no replacement KFB branding;
- no generic admin-console chrome.

The Site should feel like a creative asset shelf, not a CI monitor.

## Acceptance checklist for WSA

Phase A is reviewable when:
- [ ] one live search field works;
- [ ] Family → Pack → Collection works from Registry facts;
- [ ] Tiny Treats and KayKit are discoverable without typing technical slugs;
- [ ] type/quick filters work;
- [ ] gallery + inspector work;
- [ ] 3D/image/audio preview reuse is present;
- [ ] Add/Remove Saved Set works;
- [ ] technical details are secondary;
- [ ] no second Registry is created;
- [ ] no scrub transport is introduced;
- [ ] one direct GPT Site review link is returned.

Phase B later adds persistent Saved Sets + explicit WorldBuilder picker seam.

Phase C later adds Intake/Dropbox/file adapters.
