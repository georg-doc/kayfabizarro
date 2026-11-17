# R0.8 · Own-turn banking and functional market board

Same runtime owner: `../r07/site/dist/`. No second engine. Same private Site and PR475.

## Rule
After resolving your action and any defender response, bank 1 point per active institution plus 2 per satisfied need. Eight deposits each. Add the role agenda once at the end. Multiplayer ties: Favor, then shared win. Solo ties: System wins. Banked points cannot be stolen; current production can be interrupted.

## Evidence
1,944 paired simulation games across solo and 2–6, both board modes, three variants. Multiplayer shared wins 55/540 → 19/540 (10.2% → 3.5%). Final-action winner changes 357 → 113 per648 games. Independent production equivalence:144 games,7252 transitions,427 JSON continuations; eight deposits each, agenda once. See tests report and reproduction scripts. Full2MB rows remain in local work/handshake-r08-tests/results.json; committed summary contains every group and aggregate, scripts regenerate rows from pinned old engine.

Caveat: early leaders remain winners more often (42.7% → 71.6% under these fixed policies). Not optimal play, human difficulty or enjoyment validation. Own-turn was selected over round-end because it reduces late-round erasure and preserves the solo proxy outcome.

## Interface
Three supply rows × four persistent market columns. Each actual market card appears exactly once. Empty cells are not extra cards. Board click selects and previews cost/production; explicit confirmation performs recruitment. Zoom buttons/wheel, orbit, Shift/right-drag pan, top/tilt and reset. English game copy. Original KFB dice retained. Browser saves use version8 key; old R07 save is left untouched.

Browser checks: desktop1440 and narrow430 layouts observed; direct boardcard selection without state mutation; confirm recruited and banked1; reload preserved bank/network; zoom visibly enlarged board; top/reset exercised. Narrow viewport still relies on text cards below for full readable detail. No remote multiplayer or final illustrated card art. Human playtest remains required.

Next gate: one solo and one two-person game: does banking reward building without making the final rounds pointless? Measure actual turns and desire for another game, not just engine correctness.
