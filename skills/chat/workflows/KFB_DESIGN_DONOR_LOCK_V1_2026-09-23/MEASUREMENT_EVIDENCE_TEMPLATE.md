# KFB Measurement / Source Evidence Packet · Template

Use this file whenever a design/build depends on measured geometry, orientation, timing, attachment, materials or source-specific visual behaviour.

Do not fill gaps from memory.

## Header

```
Project / slice:
Date:
Owner:
Donor repo:
Donor branch/ref:
Donor head/blob:
Consumer:
Human gate:
```

## Evidence classes

Use only:

- `OBSERVED_BUILD` — visibly/functionally present in the working donor;
- `MEASURED` — derived by a named measurement procedure from the donor;
- `SOURCE_FACT` — directly present in source/metadata, but not necessarily visually exercised;
- `DECLARED_ONLY` — documentation/comment/config says it, runtime proof absent;
- `UNPROVEN` — code/path/value exists but was disabled, untested or not visible;
- `HUMAN_DECISION` — Georg explicitly selected/accepted it.

Never promote `DECLARED_ONLY` or `UNPROVEN` to measured donor truth.

## Measurement table

| ID | Subject | Value / state | Units / coordinate frame | Source file | Revision/blob | Evidence class | Visible/active in donor? | Measurement method / donor output | Consumer seam | May consumer change it? |
|---|---|---|---|---|---|---|---|---|---|---|
| M01 |  |  |  |  |  |  |  |  |  |  |

## Required source geometry fields when relevant

### Object / actor
- canonical source asset ID/path;
- rig family;
- loaded scale;
- local/world axis convention;
- pivot/origin;
- visible bounds;
- contact/base point.

### Attachment / prop
- parent joint/object;
- local position;
- local quaternion/Euler;
- local scale;
- grip target;
- secondary hand/target if any;
- source object forward/up axes;
- whether profile was visibly proven.

### Face / EyeRig
- face host frame;
- eye centres;
- inter-eye spacing;
- eye bounds;
- brow centres;
- brow width/gap;
- nose/mouth anchors;
- head/graft scale/pivot.

### Vehicle
- chassis bounds;
- wheel centres/radius;
- seat/driver anchor;
- forward/up axis;
- ground contact;
- prop/trail/light anchors.

### Scene / terrain
- scene root frame;
- surface normal/tangent frame;
- local placement;
- height/contact rule;
- camera target/fit;
- stage/world scale.

### Material / texture
- material name;
- texture path;
- color space;
- tiling/UV assumption;
- roughness/metalness;
- fallback/repair rule;
- whether the donor actually displayed the map.

### Motion / audio
- clip/track ID;
- duration;
- BPM;
- downbeat/phase;
- loop window;
- hand/foot contact phase;
- source animation state;
- procedural adapter values.

## Donor output / proof block

Paste or reference the donor's own observable output:

```
[DONOR OUTPUT]
<exact log line / snapshot / visible measurement / browser evidence>
```

A copied value without donor output is weaker evidence than a source behaviour replay.

## Source-isolation proof

Before integration, record:

```
Source object shown alone: YES / NO
Exact source ref:
Screenshot / review artifact:
What is visibly proven:
What remains unproven:
```

A loaded URL alone is not source-isolation proof.

## Conflict block

If sources disagree:

```
CONFLICT:
Source A:
Source B:
Working donor behaviour:
Decision:
Status: RESOLVED / UNRESOLVED
```

Rule:
working donor behaviour wins for implementation facts unless Georg explicitly changes the product decision.

Do not average conflicting measurements.

## Copy / seam block

```
[FORK]
Exact donor file/module:

[COPY]
Exact block/profile/data reused:

[NAHT]
The first line/object/state that is new:

[UNCHANGED]
Measurements/runtime behaviours that remain donor-owned:
```

## Disabled/unseen source block

List source code/data that exists but was not active or visible in the donor:

| Item | Source | Why unproven | Safe action |
|---|---|---|---|
|  |  |  | leave off / isolate first |

Do not accidentally turn dormant donor code into accepted behaviour.

## Human acceptance block

```
Human gate:
Exact candidate:
Visible difference from donor:
Accepted / Rejected / Partial:
Date:
Next allowed delta:
```

Automated tests do not fill this field.

## Failure / recovery block

After a failed pass:

```
FAILED CANDIDATE:
Failure image/evidence:
Donor rule violated:
Was this candidate built from donor or from previous failed candidate?
Recovery point:
```

If the failed candidate was built from another failed candidate:
discard it and return to donor.

After two failed repair/recovery passes on the same gate:
STOP and create a full failure-recovery export.
