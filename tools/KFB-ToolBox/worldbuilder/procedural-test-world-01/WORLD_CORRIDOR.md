# WORLD-MULTI-ISLAND-CORRIDOR-01

Status: **IMPLEMENTED CANDIDATE · SOURCE/BROWSER PROOF PENDING**

Owner: KFB WorldBuilder / WB2
Branch: `chatgpt-web/wb2-convergence-golden-corridor-01-2026-10-04`

## What changed

The proven single R2D island is now composed four times as one WB2 archipelago:
- KFB Town;
- Dystopia;
- Utopia;
- Protopia.

The underlying R2D core is not rewritten.
`r2d-archipelago.v1.js` translates the same deterministic plan/field facts into world coordinates.

Three inter-island roads are compiled by the existing Track Core using `CONNECT`.
Their semantic kind is `ROAD_BRIDGE`.
No second road generator exists.

## Layout

The old R2C direction relationship is retained but compressed to an MVP walking/driving scale:
- Town [0, 0, 0]
- Dystopia [70, -9, 180]
- Utopia [180, +4, -65]
- Protopia [-200, +10, 95]

These are data, not final movement-balance truth.
Final distance tuning waits for the accepted native locomotion baseline.

## Deck/Card seeds

Dystopia:
`ignore_dystopia:1 · The Doomsday Clock`
plus cards 5/6 as semantic context.

Utopia:
`forget_utopia:1 · The Glossy Horizon`
plus cards 2/4.

Protopia:
`embrace_protopia:1 · The Open Notebook`
plus cards 5/6.

Town is the historical/current hub and has no future-deck ID.

## Golden Journey anchors

The world graph now reserves stable spatial anchors for:
Town spawn, Clown, Driver, Taxi, four Billboards, Dystopia party/Orc singer, Utopia CEO/robot works, Protopia Farmers/Lorekeeper.

They are world data only.
No Resident/model is mounted in this slice.

## Global principle

`skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md`

**PULL, DON'T GATE.**
All islands remain physically accessible; later quest state gates handoffs/rewards rather than exploration.

## Protected

No Player.
No Drive.
No Resident runtime.
No Combat.
No Flight.
No Stage/Live.
