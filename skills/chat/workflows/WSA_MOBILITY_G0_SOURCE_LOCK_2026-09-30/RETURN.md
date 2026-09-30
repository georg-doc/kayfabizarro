# WSA Mobility Integration R3 · G0 Return

Status: **G0_SOURCE_LOCK_COMPLETE**

Runtime: **NOT STARTED**

Stage/Cloudflare: **NOT TOUCHED**

Merge/Live: **NONE**

## Outcome

The previous wrong-owner path is closed before implementation:

- no Kenney Racer; the only G1 vehicle visual is KayKit `car_hatchback.gltf`;
- no OSM/legacy World runtime;
- Ground remains PR #294's tested single-writer consumer;
- v0.8 remains the accepted Race feel;
- FR-S04-02 is separately identified as the source-tested contact candidate with human feel still open;
- J14 is limited to P1a/pads/choreography;
- J15 is deferred until G3+;
- the Hex/island lane is independent and untouched.

## G1 is now unambiguous

One actor approaches one parked KayKit hatchback on one P1a pad, presses `I`, drives using the Race owner, parks, presses `I`, and returns to Ground at a safe exit transform with heading preserved. No Flight, no visual world expansion, no look pass and no secondary vehicle system.

## Evidence and tests

See `TEST_REPORT.md`. All G0 checks must be green before G1 starts. G0 itself has no public test URL because it intentionally creates no runtime or pseudo-human review surface.

## One next gate

**G1_GROUND_DRIVE_GROUND** — implement only the bounded handoff loop against the locked sources.
