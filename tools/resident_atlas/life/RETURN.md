# NPC-LIFE-01 · Living Resident encounter bus · RETURN

**Status:** REVIEW CANDIDATE · contract tests green · public Stage publication pending  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `chatgpt-web/npc-life-01-2026-09-24`  
**Draft PR:** #210  
**Base:** `main@c049cae386e169c79608c835e69eaa2170838875`

## Outcome

A thin Resident/Town adapter now emits one semantic encounter chain:

`approach → greet → offer → react → accept/decline → leave`

This is a beat bus, not a dialog tree.

## Ownership

- **Host:** encounter legality, participant busy state, relationship context, movement progress.
- **Animation consumer:** independently selects an actually available compatible clip for each beat.
- **ChatterBox consumer:** independently selects text from the existing `OW_PHRASES` content source after a speaking beat.
- **Gift/reward consumer:** independently returns a source-backed offer reference. The encounter host does not write inventory/reward state.
- **No new owner:** no movement engine, Resident DB, memory DB, reward DB or dialogue tree was introduced.

## Real-source proof

Review actors are exact Resident Atlas recipes:
- `goth-girl`;
- `toy-soldier`.

The offer is not fabricated: the provider resolves Toy Soldier's existing `present_side` / `present` signature prop from `data/cast.js`.

The Stage surface includes source-isolate modes for Goth Girl and Toy Soldier before the integrated encounter modes.

## Tests

`node tools/resident_atlas/life/tests/npc-life-01.test.mjs`

**21/21 assertions PASS.**

See `TEST_REPORT.md` and `SOURCE.json`.

## Human review route

`https://kayfabizarro.pages.dev/kfb-hub/stage/resident/npc-life-01/`

**Publication status at this checkpoint:** pending. Do not claim public/browser PASS until the exact URL exposes `NPC-LIFE-01` and the review runtime boots.

## Unresolved

- Public Cloudflare publication + browser proof.
- Human visual review of encounter pacing and clip choices.
- ChatterBox N2 can later replace the thin field adapter without changing the beat bus.
- NPC-MEMORY-01 and NPC-GIFT-01 remain separate follow-on owners; this slice does not implement persistent memory or inventory mutation.

## One next gate

**NPC-LIFE-01 · exact Cloudflare Stage browser verification, then Georg human review.**
