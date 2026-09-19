# TinySkies / Travel Globe terrain donor · Stage provenance

Status: **STAGE SOURCE CANDIDATE · NO TRACK INTEGRATION · NO LIVE PROMOTION**

## Implementation owner

`georg-doc/KFB-Travel-Globe`

Source PR:
`georg-doc/KFB-Travel-Globe#30`

Tested evidence head:
`80cfaa685cdfcdeab7cbd52f2cea6fb16bd8d4f4`

Current Travel base:
`8614282aab2ced43bb5dda9fcf7abadf9768100a`

Upstream gold standard:
`dannylimanseta/tinyskies@2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6`

## What this Stage child shows

Two copies of the same current Travel world, same seed and orientation:

- **BASE GLOBE** — no authored terrain zone.
- **EXISTING TRAVEL TERRAIN ZONE** — the current `setTerrainZones()` seam applied before Globe bake.

No Race track is integrated yet.

The view is intentionally source-first: the terrain donor is shown before any Track corridor work.

## Source reuse

This public mirror does not copy a second Travel runtime owner. It imports the already-published current Travel modules under:

`/travel/wip/travel_globe_wsa/globe-v13/`

The relevant public-mirror Git blobs were verified equal to current Travel main before publication.

## Browser evidence

Travel workflow:
- run `35474259865`
- job `105980700507`
- **12/12 PASS**
- boot **834 ms**
- page/script errors **0**
- failed HTTP assets **0**
- evidence artifact `10594047890`
- digest `sha256:062ce05e37db69236f770d3221bdf06f5098d488484666fd73446781d2065403`

Measured baked-mesh delta:
- 66,049 vertices per Globe;
- 1,562 vertices changed by the existing Travel terrain zone;
- changed fraction ≈ 2.365%;
- maximum displacement delta ≈ 0.404.

## Voxel scope

Travel-v16 Voxel remains a valid selective KFB donor for deliberate block/Minecraft/mining/building mini-games, editable/destructible block spaces and special voxel worlds.

It is simply out of scope for this **TinySkies-derived Travel Globe × Track** terrain seam.
