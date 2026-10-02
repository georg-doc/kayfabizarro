# B0 TEST STATUS

Status: **SOURCE TRANSPORT FAIL · GEOMETRY NOT REACHED**
Date: 2026-10-02
Owner: KFB WorldBuilder / World Corridor 01

## Run

- head: `1dfe0077679c855f96734bf708158699e6d4e357`
- run: `37032658557`
- job: `110923074620`
- result: FAIL
- artifact: `11238755880`
- digest: `sha256:2c1567a850db427ac823a381096844c76ac76e75eaca2b04d685ee1a6d0b477c`

## Proven failure

The page reached the raw KayKit side-donor load and failed resolving the relative dependency:

`building_A.gltf → building_A.bin`

through the jsDelivr transport.

Console:
- 404 resource;
- `THREE.GLTFLoader: Failed to load buffer "building_A.bin"`.

The QA then timed out waiting for the page to become ready.

## Not proven / not failed

No B0 Golden geometry assertion ran.

Therefore this run does **not** prove a failure in:
- Elastic V2 body;
- Elastic V2 roof;
- B0 body parity;
- B0 roof parity;
- base anchoring;
- the three Golden Hürth controls;
- FACADE_RULE ownership.

## Existing working donor transport

The existing KFB FACADE-A/B Golden code for the exact same source:
- pin `2ff8b350beefe02912bbff6eeeead3882e583d08`;
- `building_A.gltf`;
- external `building_A.bin`;
- external `citybits_texture.png`;

uses pinned `raw.githubusercontent.com` transport.

The KFB clay probe also records these exact three files as bytewise checked at that pin.

## Repair Pass 1 boundary

Change only:
1. KayKit side-donor transport to the already working pinned raw-GitHub path;
2. QA navigation may stop relying on `networkidle` and wait for the explicit B0 ready contract instead.

Do not change:
- B0 module geometry;
- Golden ids;
- Elastic donor pin;
- roof logic;
- facade authority;
- display/material decision.


## Repair Pass 1 result · machine PASS, visual evidence layout FAIL

Repair Pass 1 head:
`5496bba829138a2507e33fccf96fa99769098e4f`

Run/job:
`37033679788 / 110926503919`

Machine result:
**PASS**

Evidence artifact:
- id `11237983944`
- digest `sha256:76400b1ae18756dd28e60d00ed942c3dbdd501cbb206a5f52a2c44c37c594ea3`

Proven for all three Golden controls:
- exact source pin;
- exact ids/heights/roof types;
- 22-building fixture anchor;
- B0 body hash = accepted V2 body hash;
- B0 roof hash = accepted V2 roof hash;
- base anchored;
- facade owner id = `kfb-facade-rule-v1`;
- one renderer;
- no material decision;
- raw `building_A` loaded with original materials, no deformation/adaptation/fallback.

Hashes:
- compact-flat `way/371401529`: body `852d0622`, roof `aace587c`
- larger-gable `way/371401492`: body `f9a30346`, roof `56ab2bad`
- compact-hip `way/371401475`: body `0f0d0b3c`, roof `87803dcb`

Raw `building_A` bounds:
`2 × 1.6499998569 × 2`.

### Visual evidence defect

Manual screenshot inspection found that the source-isolation viewer's normalization code cancels the parent stage offsets.

Result:
the Clean / V2 / B0 Hürth objects overlap around the centre and are obscured by the raw KayKit donor.

Classification:
**VISUAL_EVIDENCE_LAYOUT_FAIL · NOT GEOMETRY**

The machine parity result remains valid, but source-isolation visual evidence is not acceptable yet.

## Repair Pass 2 boundary · last allowed pass for this gate

Change only:
- stage/local centering math in `source-isolation.html`;
- expose/assert four separated stage centres in QA.

Do not change:
- `building-family-b0.mjs`;
- Golden source ids;
- Elastic donor pin;
- body/roof geometry;
- facade owner;
- materials/design.
