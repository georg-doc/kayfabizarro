# TC-01 · TinySkies / Travel Globe Track Terrain Corridor · Stage provenance

Status: **STAGE SOURCE CANDIDATE · LOCAL PUBLIC-MIRROR QA PENDING · NO LIVE PROMOTION**

## Implementation SSOT

`georg-doc/KFB-Travel-Globe`

Source PR:
`georg-doc/KFB-Travel-Globe#31`

Tested implementation evidence head:
`b454ab9d98a2b0b860991e7ccd8adc72d26d0e2b`

Evidence commit:
`8de02df96aaa575eddbe4d65d393fc484bba53d5`

Current Travel base:
`8614282aab2ced43bb5dda9fcf7abadf9768100a`

TinySkies gold-standard:
`dannylimanseta/tinyskies@2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6`

## What this Stage child shows

Left:
- current Travel Globe;
- no Track terrain constraint.

Right:
- same world, seed and Globe topology;
- one visible Track ribbon;
- Track route compiled additively into **45 existing Travel terrain zones**;
- terrain deformation still belongs to the existing Travel `surfaceDisplacementFromValue()` truth.

No Race controller/contact/camera is integrated.

## Tested implementation result

Travel TC-01:
- run `35476602775`
- job `105987356806`
- **15/15 PASS**
- boot **1537 ms**
- page/script errors **0**
- failed HTTP assets **0**
- 43/45 route-center samples measurably reshaped
- 766/66,049 baked Globe vertices changed
- max baked delta ≈ **0.304**
- TinySkies/Travel built-in source probe **0 errors**
- artifact `10595045594`
- digest `sha256:c36a74e2ef05929769d642228a5b94398bdc0de582ae4f316dc9740cbf43535a`

Travel baseline on repaired additive architecture:
- run `35476602776`
- test/build/verify **PASS**

## Public mirror strategy

This package does not copy a second Travel terrain runtime.

The viewer imports the already-published current Travel modules under:

`/travel/wip/travel_globe_wsa/globe-v13/`

The relevant public Travel module blobs were rechecked byte-identical to current Travel `main` before this package was created.

Only these TC-01 additive files are packaged here:
- `index.html`
- `terrain-corridor.mjs`
- `track-corridor-zones.mjs`

## Voxel scope

Voxel remains valid selective KFB technology for deliberate block/Minecraft/mining/building mini-games, editable/destructible terrain and special voxel worlds.

It is only out of scope for this current TinySkies/Travel Globe Track seam.

## Human gate

**Does the embedded Track read as part of the current TinySkies/Travel terrain, rather than as a separate ribbon floating above an unrelated ground plane?**
