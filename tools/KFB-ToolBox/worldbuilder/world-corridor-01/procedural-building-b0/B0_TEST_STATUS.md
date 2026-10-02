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
