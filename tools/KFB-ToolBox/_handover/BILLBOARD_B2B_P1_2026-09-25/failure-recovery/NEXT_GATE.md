# NEXT GATE · Billboard B2b-P1

**One gate only: isolated lifecycle/quiescence semantics.**

Do not open the full visual candidate first.

Pass criteria to define and prove:
- after mode exit, no continuing periodic work;
- sample after one event-loop turn and after ≥1 s;
- if product intent requires zero callback crossing the call boundary, prove a generation-token/cancellation guard in isolation;
- if post-boundary quiescence is the intended contract, encode that explicitly in the browser assertion.

After this isolated gate passes, a fresh slice may re-run the frozen candidate once. No visual expansion, B2c, B3 or C1 before that.
