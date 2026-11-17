# Copy-ready Webchat continuation

Work on **The Invisible Handshake**, the existing KFB-compatible satirical card-game candidate, without changing KFB game code.

Repository: https://github.com/georg-doc/kayfabizarro
Branch: `design/invisible-handshake-paper-r0-2026-11-17`
Draft PR: https://github.com/georg-doc/kayfabizarro/pull/475
Owner: `games/invisible-handshake/`

Read current GitHub versions of:
1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. `games/invisible-handshake/CURRENT_STATE.md`
5. `games/invisible-handshake/RETURN.md` (latest entry first)
6. `games/invisible-handshake/r14-open-harvest/REPORT.md` and `METHOD.md`; inspect `test.py` when modifying a model.

The central router contains older R0.6 pointers; the owning CURRENT_STATE/Return records the later R14 work. Never restart the old recruitment/market prototype merely because it is already rendered.

**Current rule candidate:**56-card product,6 factions+50 value-free narrative cards;2–6 players; three shared Fear/Hope/Hate D6. One public slot/player, three starting hand cards, max6. One action: adjust±1, reroll, move, swap, draw one, or play one into own empty slot. Actor crossing7 wins any card; crossing0 discards without a trophy. Trigger resets3, displaced dice redistribute to occupied cards. No chips/hold/automatic refill. All details and empty-board behavior in CURRENT_STATE.

**One next job:** propose at most TWO small, precisely specified variants addressing the5→6 preparation gift. At least one may offer a risky same-turn harvest opportunity. Preserve public access to all narratives, no ownership-only scoring, no extra per-card stats. Make assumptions explicit; do not present a proposal as Georg-approved. Explain how the draw/play public-supply incentive behaves. Do not add secret missions to hide unresolved incentives.

Before a large simulation, show two concrete turn traces with The Bell and two contrasting player counts. If executable tools are available, reuse the existing simulator and compare against R14 over2–6 players, recording policies, seeds, seat effects, preparation returns, total scoring, supply/draw costs and failure cases. If tools cannot run, label traces MANUAL and simulations NOT RUN. Never invent results or claim mathematical balance from simple bots.

Deliver a short English rules candidate plus German explanation, exact test evidence/limits, and one recommended next step. Save additively under this owner, update Return, preserve old results, verify branch head and every changed file. No auto-merge, Site rewrite, new deck art, background research or unrelated owner writes.

If GitHub writing is unavailable, return a clearly labeled uncommitted patch/file packet; do not claim it was saved. Reuse connector authentication; do not request personal tokens.

For a later research-only job, use `RESEARCH_QUEUE.md` and the current existing Atlas owner. Choose ONE packet, inventory before searching, and keep source assertions separate from game fiction. No need to execute that queue during this game-mechanics job.
