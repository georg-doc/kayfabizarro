# DRAFT · Racer · MVP M2 "a track you can drive" · 2026-09-26

Status: **DRAFT for discussion, solution-open.** Not an execution brief.

## Problem
Many track attempts (R3d, RKIT-01…RKIT-11, Blender workbenches) produced good pieces but no single system. The decision now: **one Track Core, everything else is data.** The first MVP needs one safe, representative drivable section, not the full 2 km route.

## What exists
- **#216 Cologne Route 01** + **#219 Track Core** (planning): one centre-line frame, one canonical slot profile, variation as parameter curves over arc length s, markings as own layer, pieces = generator + curves + sockets, RouteRecipe = single truth. Real clothoid easing adopted; Perplexity example code explicitly not adopted.
- **Agent ladder** in #219: TRACK-CORE-0 (Web census + contract) → Georg language gate (JS core, Blender/Python as oracle) → 1A (Coworker + Blender MCP proof) → 1B (Web runtime parity) → 2 (Claude Design visual grammar) → Playable Track R0 → Cologne OSM Route 01.
- **RKIT-01** (modules, sections, R3d replica) on Race branch `claude/rkit-01-2026-09-24`; **RKIT-11** Mülheimer Brücke incl. stunts (Race PR #42 @bcc422b) = frozen acceptance fixture. RKIT-02 jumps/flaps/flight physics = HOLD.
- Road widths per accepted Racer grammar: WIDE 18 m (WB-W0 road), STANDARD 14.4 m.
- Local: Workbench v5–v9 (~89 MB each), RKIT-11 GLBs + stunt module JSON (26.09.).

## Open questions
1. Georg's language gate: JavaScript as the one authoritative core, Blender/Python only as oracle — yes?
2. Which RKIT-11 section is the "safe representative" MVP section (length, one curve family, one elevation change, no stunts)?
3. How does the track corridor cut into WorldBuilder terrain (who owns the height where they meet)?
4. Physics owner for driving (Rapier TRACK_A in the private Racer repo) — what is proven, what is not?

## Options
- **A · Follow the ladder strictly** (Core 0 → 1A/1B → 2 → R0).
- **B · Shortcut R0 on RKIT-01 GLB modules** while Core 0 runs — risk: another one-off.
- **C · Blender first** for the visual grammar — rejected by #219 unless the core is proven.

## Success signals
- Georg drives one section with a vehicle, no falling through, no seams at transitions.
- The same RouteRecipe renders identically in Blender (oracle) and in the browser.
- A new piece is added as data, not as a new generator.

## Guardrails
No new one-off track generator before TRACK-CORE-0; RKIT-11 stays fixture; private-repo parts that Claude chats must read need a public mirror (WSA task).
