# SPEC NPC patrols, random encounters, POIs R1 (WS0, Georg 18.10., V-464) · status: planning, built by WS1 after the current slices

**Principle KISS:** NPCs run only in the **player's surroundings** (bubble radius R ≈ 60–120 m). Everything outside is computed, not simulated.

1. **Routes:** per zone, patrol routes as polylines with POI stops: `kfb.npc-route/1` = id, zone, points[], stops[] (poi, wait in s), loop/pingpong, speed. Routes follow paths/terrain (placement grammar, no paths through entrances).
2. **Schedule instead of simulation:** a group has `route + start time + speed`. Its position at time t is calculated (t mod route length). When the player approaches, the group **appears exactly where it should be** (deterministic "teleport"), facing the right way and in the right state. When it leaves the bubble, it is removed. This way you roughly know who walks where, without background load.
3. **Random encounters:** per zone a table (`kfb.encounter-table/1`): entry = group (mob type, number), weight, time of day, weather, cooldown, minimum distance to POIs. Rolled when entering a new tile/zone section, appearing at the edge of the bubble, outside the field of view where possible.
4. **POIs:** places with activities (bench, stand, pub, construction site, harvest tree). NPCs pick POIs on their route and play activity clips there (Kayfabrick bots: rolling, carrying; V-463).
5. **Behaviour FSM** (simple): `idle → patrol → notice (player close / provocation) → alert → (aggro later: chase/attack) → return`. Aggro and combat follow the combat slice (V-426); R1 only notice/alert with a reaction (salute, command triplet, stare).
6. **Groups with roles:** e.g. toy soldiers no. 1–6. No. 1 leads; the rest follow in formation with offsets (Dalton gag: size/delay/stumble); command triplets are triggered by FSM events (start patrol, notice, return).

**Gate R1:** one zone, 2 routes, 1 encounter table, toy-soldier group no. 1–6 + 3 bots at a POI; the player walks away and comes back → the groups are where the schedule says, no pop-in in the field of view; perf ≥ 55 fps.
