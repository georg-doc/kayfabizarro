# KFB ToolBox · Asset Librarian Integration · Stage-First

**Datum:** 15.09.2026  
**Status:** CURRENT DESIGN DIRECTION / ADDENDUM  
**Scope:** Integration of the existing Asset Librarian into the minimal Stage-First ToolBox without adding UI clutter or creating a second asset truth.

## 1 · Decision

The Asset Librarian remains a **separate full exploration tool** on the ToolBox overview/site, but inside the Stage-First Studio it is consumed through **one shared context-aware Resource Picker / Library Drawer**.

Do **not** embed the full Librarian UI inside the Studio.  
Do **not** add another permanent tab/header row.  
Do **not** create a second asset index.

The Asset/Resource Registry remains the source for discovery. The receiving Studio/Animation/Rigging consumer remains responsible for compatibility and suitability.

## 2 · Product model

Think of the Librarian as the ToolBox's **content pool**, not as another application nested inside the application.

The same picker opens from different work contexts with different filters:

| Current context | Picker opens as | Typical result |
|---|---|---|
| Actor selection | `Characters` | KayKit / Cube-Pet / current KFB actors |
| Frankensteining | `Donor parts` | compatible heads, bodies, limbs, hair, accessories, meshes |
| Motion | `Motions` | clips / packs compatible or candidate for selected rig |
| Props / Attach | `Props` | microphone, guitar, weapons, stool, handheld/accessory props |
| Stage | `Stage assets` | floor/base, furniture, lights/FX/background props where supported |
| Performance | `Performance assets` | microphone, guitar, stool, war drum/sticks, relevant clips |

Future contexts may add audio/FX, but do not over-expand the first integration.

## 3 · UI rule · no extra permanent navigation

Stage-First still has one global bar and one active context palette.

The Library appears only when invoked:

- compact `Browse…` / magnifier / `+` affordance next to the relevant selector;
- or a single global `Library` command/shortcut that inherits the current context;
- optional pin-open behavior for users doing repeated donor browsing;
- closes after selection by default.

Examples:

- `Actor ▾  Browse…`
- `Motion search  Browse library…`
- `Donor: Head  Browse…`
- `Prop  Browse…`

Do not place a permanent Asset Librarian card on the authoring stage.

## 4 · One Resource Picker, many scoped views

The picker is one reusable component with a context object such as conceptually:

```text
consumer = toolbox-studio
mode = actor | rig-part | motion | prop | stage | performance
selectedActor = <current actor id>
rigFamily = <known family or unknown>
allowedKinds = <from receiving context>
collection / pack filters = optional
```

It queries the existing generated Registry / Production Resource Registry and renders only useful fields for selection.

### Default result cell

Every result should be primarily visual:

- thumbnail / 3D preview where available;
- short name;
- compact pack/source hint only if needed for disambiguation;
- compact compatibility state where it has actually been measured.

No permanent provenance paragraphs, schema text or raw GitHub paths in the normal result grid.

Detailed source facts live behind `… / Info`.

## 5 · Consumer boundary

The Librarian may discover/recommend candidates but **must not declare final suitability**.

This matches the existing `kfb.asset-handoff.v1` contract:

- `selectionStatus: candidate-only`;
- `suitabilityDecision: owned-by-receiving-consumer`;
- Animation Lab / ToolBox performs visual playback, pose/orientation and retarget/binding validation.

Therefore:

### Actor
Registry says the actor exists + rig facts. ToolBox decides whether current readers/features support it.

### Motion
Registry says the clip/source exists and exposes structural rig facts. Animation consumer measures binding and visual playback.

### Frankensteining donor part
Registry/part atlas says the mesh/part exists. Rigging consumer owns extraction, attachment, remapping, weighting and visual acceptance.

### Prop
Registry says the prop exists. ToolBox owns mount hand/anchor, offset, orientation and actor-specific calibration.

## 6 · Frankensteining integration

The future KayKit Part Atlas should become another indexed view consumed by the same picker.

Desired interaction:

`Frankenstein tab → choose target slot → Browse donor parts → preview on current actor → Accept / Revert`

Potential slots are discovered from the atlas rather than hardcoded universal assumptions, e.g.:

- Head
- Hair / head accessory
- Body / torso
- Arm L / R
- Leg L / R
- Hands / gloves where separable
- accessory / backpack / cape
- prop / weapon

If a donor model does not expose a safely extractable part, keep it discoverable but mark that part unavailable. Do not fake separability.

## 7 · Animation / Performance integration

**All discovered KayKit characters remain available in the actor picker for Motion/Performance.**

Motion picker behavior:

1. selected actor supplies known rig facts;
2. picker ranks exact rig-family/local-pack/shared-library candidates first;
3. user may still reveal broader candidate results;
4. receiving Animation Lab measures binding;
5. result becomes PASS / PARTIAL / UNSUPPORTED only after real validation.

Do not hide an actor merely because a particular performance is not yet supported.

Performance Suite uses the same picker for:

- Dance / Groove clips;
- Presenter clips + microphone;
- Stool / seated presentation;
- Guitar;
- Orc War Drum + sticks;
- later performance families.

## 8 · ToolBox overview / site

The full Asset Librarian still deserves its own tile/tool on the ToolBox landing page because free exploration is a valid workflow:

`Asset Librarian` → full repository/registry browser.

But entering the Stage-First Studio should not send the user back and forth between separate apps for ordinary authoring. The scoped Resource Picker provides the in-context route.

## 9 · Search / filters

Keep them compact and contextual.

Useful first filters:

- search text;
- Character / Prop / Motion / Part according to current context;
- KayKit rig family where known;
- pack / collection;
- favourites/recent/current collection;
- compatibility state after receiving-consumer measurement.

Do not surface a taxonomy wall by default.

## 10 · Drag/drop and iteration · later, not blocker

A later enhancement may support drag from the Library onto:

- actor stage;
- a Frankenstein part slot;
- a hand/prop attachment target;
- a motion state slot.

First integration only needs `Browse → Preview → Accept/Revert` to stay surgical.

## 11 · QA acceptance

Prove at least these workflows without leaving the Stage-First Studio:

1. browse/select a KayKit actor from the full current population;
2. browse a Cube-Pet;
3. browse/audition motion candidates for current rig;
4. browse/select a handheld prop;
5. browse/select a Performance prop (microphone/guitar/stool/war drum);
6. browse a Frankenstein donor candidate once Part Atlas exists;
7. rejected candidate returns cleanly to previous state;
8. no second Registry/index is created;
9. normal UI remains clean when Library is closed;
10. diagnostics/provenance remain optional, not permanent chrome.

## 12 · Governing UX principle

> **Library when needed, stage when working.**

The content pool may be huge. The working surface must stay small.

## 13 · Status

- **DECISION:** full Asset Librarian remains a ToolBox overview tool.
- **DECISION:** Stage-First Studio consumes it through one context-aware Resource Picker / Library Drawer.
- **DECISION:** no permanent Librarian tile/panel inside the authoring stage.
- **DECISION:** same picker supports actors, motions, props, future rig parts and Performance resources.
- **DECISION:** Registry discovers; receiving ToolBox/Animation/Rigging consumer validates suitability.
- **PROPOSAL:** `Browse → Preview → Accept/Revert` as first vertical interaction.
- **DEFERRED:** drag/drop and advanced persistent-library layouts.
- **IMPLEMENTATION:** none claimed by this document.
- **TESTED RESULT:** existing Asset Librarian/Registry behavior only; integrated picker not tested yet.
