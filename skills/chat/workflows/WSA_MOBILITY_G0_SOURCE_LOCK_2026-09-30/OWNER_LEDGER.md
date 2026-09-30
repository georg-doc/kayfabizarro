# G0 Owner Ledger

| Capability | Owner | Exact source | G0 decision |
|---|---|---|---|
| Ground movement and position | kayfabizarro PR #294 | `faf1902e…`; tested runtime `904889a…`; `walk-controller.js` blob `18dd999…` | Keep as sole Ground writer |
| Ground locomotion semantics | ToolBox stable library on PR #294 | `locomotion-profiles.v1.js` blob `3db9fbd…`; `anim-map.v1.js` blob `7120f80…` | Consume, do not recode locally |
| Race driving feel | KFB-Stunt-Car-Race Track Lab v0.8 | Race main `df1e35b…`; config blob `38afec4…`; host blob `53300a7…` | Preserve values and controls |
| Drive physical contact | KFB-Stunt-Car-Race Free Roam FR-S04-02 | physics blob `c14483b…`; intent `57ae25c…`; world `2cfe241…` | Technical candidate; human feel still open |
| Vehicle visual | KayKit City Builder Bits | `car_hatchback.gltf` blob `0a01d2a…` plus pinned BIN/texture | Only vehicle visual in G1 |
| Enter/exit choreography and P1a pads | Joyride J14 | main `aa6fd68…`, exact blobs in lock | Donor only, never movement owner |
| P1b/TC1 course/look | Joyride J15 | ZIP blob `3a8228b…` | Deferred until G3+ |
| Ground↔Drive handoff | New bounded G1 adapter | future receiver route | Owns state transfer, not physics |
| Flight | Travel owner | not loaded in G0/G1 | Deferred |
| Hex/WFC island world | Hex design lane | separate brief | Untouched by G0/G1 |

## Input policy

- `I`: interact; enter or exit the parked KayKit vehicle.
- `Space` in Ground: Ground jump.
- `Space` in Drive: Race jump/hop.
- Double `Space` from Ground may later request Flight through the Travel owner.
- Drive never switches directly to Flight.

## Single-writer invariant

The handoff adapter may transfer state only at mode boundaries. While `GROUND` is active, only `walk-controller` writes the actor world transform. While `DRIVE` is active, only the Race vehicle/contact owner writes the vehicle pose. The adapter may not run a parallel integration loop.
