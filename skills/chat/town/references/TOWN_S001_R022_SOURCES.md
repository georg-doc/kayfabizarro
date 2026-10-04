# KFB Town · S001 r022 · Source and status notes

**Status:** source routing and design boundaries, not a runtime contract.

## ChatterBox / Overworld

The existing Overworld presentation budget uses max two bubbles in the world and one per zone. Speech can displace thought. Replies can exceed the zone cap but not automatically the world budget; curses/taunts use a separate bounded escalation path. Town r022 adopts the attention principle only, not the 2D zone implementation.

Town direction: one active NPC bubble by default, two soft maximum in the current player view, a third only as a named exception. Billboards/Jumbotron/road signs are media/scenery and do not consume the NPC bubble budget. Any actual chat bubble opened by them counts normally.

## Boxel Blitz

Repository search confirms an existing Boxel Blitz host with a grid and bumper events. Earlier S001 research treats Boxel Blitz as a donor for kinetic cube surfaces. r022 does not define a reusable runtime API yet; the design probe is spatial only.

## Almanac provenance

Tourbus/Triplet and Overworld/Journey sources distinguish Cards, events, replay and rewards. r021/r022 derive a removable provenance layer from that distinction. No new Card schema is implemented. Before runtime work, the current Almanac/Journey save contract must be read in its owning project.

## Design probe

`../artifacts/TOWN_R022_DESIGN_PROBE.html` uses dummy Card artwork and schematic geometry. It is not evidence of asset measurements, gameplay, browser execution, physics, rigs, combat, audio or reward behavior.
