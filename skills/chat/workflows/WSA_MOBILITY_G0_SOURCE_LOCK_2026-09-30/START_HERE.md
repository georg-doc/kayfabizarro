# WSA Mobility Integration R3 · G0 Source Lock

Status: **G0_SOURCE_LOCK_COMPLETE**

Date: 2026-09-30

Owner: KFB WSA Mobility Integration

Receiver branch: `codex/wsa-mobility-g0-source-lock-2026-09-30`

## What G0 is

G0 fixes the exact sources, owners and exclusions for the first productive mobility loop. It deliberately creates no runtime, no local preview and no public Stage. The Hex/island concept is a separate design lane and is not modified here.

The machine-readable source of truth is `INTEGRATION_LOCK.json`.

## Locked result

1. **GROUND** remains owned by PR #294 and its tested `walk-controller` consumer. There is one Ground world-position writer.
2. **DRIVE** remains Race-owned. Track Lab v0.8 supplies the accepted driving feel; Free Roam FR-S04-02 supplies the source-tested physical contact candidate. G0 does not pretend those two have already been integrated.
3. **VEHICLE VISUAL** is the KayKit `car_hatchback.gltf`. The source file has body plus four wheels and no built-in driver. Kenney vehicles are excluded.
4. **J14** supplies only P1a track geometry, pads and enter/exit choreography. Its k2/k2b/k3 loops, Flight candidate and input policy are not owners.
5. **J15** is held for G3+ as a P1b/TC1 visual/track donor. It is not part of G0/G1 runtime authority.
6. **G1** is exactly one Ground → Drive → Ground loop with `I` for enter/exit, `Space` for mode-local jump/hop, and a world-transform round-trip.

## Read order for G1

1. `INTEGRATION_LOCK.json`
2. `OWNER_LEDGER.md`
3. `DEPENDENCY_TRACE.md`
4. `DONOR_ISOLATION.md`
5. `TEST_REPORT.md`
6. `RETURN.md`

Then read the exact source files at the recorded heads. Do not replace a missing source with a placeholder or a second engine.

## Stop rules

- Stop if any locked head or blob has changed without a reviewed lock update.
- Stop if more than one module writes Ground position or Drive vehicle pose.
- Stop if a Kenney vehicle, OSM world, J14/J15 drive loop, or a local Flight loop enters the receiver.
- Stop after two failed repairs on the same G1 gate and export the full candidate for recovery.
