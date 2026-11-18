# R17 Test Report · Narrative Path and HOPE Solution Claim
**Date 2026-11-18 · Only static mechanical arithmetic checked, NOT human narrations, game fun or full 2–6 player simulations.** Owner `games/invisible-handshake/` on `design/invisible-handshake-paper-r0-2026-11-17`, PR #475, Draft/unmerged.

## Audited source / KFB donor
- [R17 proposal](THREE_DIE_NARRATIVE_CHAIN_R17_2026-11-18.md): HATE points to PROBLEM card; FEAR points to REACTION card; HOPE points to SOLUTION card. Actual public card names/images and shared FOCUS are the spoken material; fixed sequence independent from face values 1–6. All three dice remain on distinct outer cards, centre hosts none. A has the story only. B awards focus to human under HOPE (when actor differs) at a positive outer collapse, NPC HOPE causes central reframe, negative outer collapse discards Focus, next full round only refills the missing center.
- Existing verified KFB donor source on default branch: `media/prompts/KAYFABE_TIPS_corpus_v1.md` (therefore/but and finger rule) and `media/prompts/narrator/bunny_carny.md` (three spoken lines, causality, named visual concrete object). This is original KFB narrative technique reuse, not adapted KFB Freestyle scoring/King's Verdict.
- R16 future fixed Fear/Hope/Hate **printed icons** are a different candidate. **Do not stack with R17 dynamic die roles** before human acceptance.

## Static enumeration actually executed
Independent V8 enumerator (in current ChatGPT session) and corresponding committed [Node.js source probe](THREE_DIE_NARRATIVE_CHAIN_R17_PROBE.js), verified by GitHub readback. It enumerates all **6×5×4=120 legal distinct placement orders of HATE/FEAR/HOPE**, each n=2..6 humans, every human actor, each of three triggering dice and both UP/DOWN collapses. **14,400 deterministic event scenarios**, **not complete games**. Each outcome asserts existing 50-card conservation and three legal relocation options for the triggering die (five outer cards remain with two dice present); central Focus never holds a die.
- Positive outer event: **7,200** scenario cases, of which **4,200** yield center Focus to a different HUMAN under HOPE, **1,800** reframe center because HOPE is on an NPC outer narrative, **1,200** leave center because actor already holds HOPE.
- Negative outer event: **7,200** cases, centre discarded/reframed if present.
- **13,200** separate hypothetical *next-round* center refills from the same stock; no extra 51st card, no two center rewards during one round. This count is not an estimate of actual per-round turnover, because every scenario begins from a fresh occupied center.
- Scenario distribution:

| Humans / NPC narratives | Scenarios | Positive Focus to Human / all positives | Positive NPC reframe / all positives | Positive no-focus self / all positives |
|---|---:|---:|---:|---:|
| 2 / 4 | 1,440 | 120 / 720 | 480 / 720 | 120 / 720 |
| 3 / 3 | 2,160 | 360 / 1,080 | 540 / 1,080 | 180 / 1,080 |
| 4 / 2 | 2,880 | 720 / 1,440 | 480 / 1,440 | 240 / 1,440 |
| 5 / 1 | 3,600 | 1,200 / 1,800 | 300 / 1,800 | 300 / 1,800 |
| 6 / 0 | 4,320 | 1,800 / 2,160 | 0 / 2,160 | 360 / 2,160 |

**Critical pattern:** Under uniform symbolic placements and actors, the human-other-than-actor Focus reward fraction is `(n−1)/6`; at n=2 it is **16.7%**, at n=6 **83.3%**. This is a serious potential small-table/large-table fairness and resource-turnover bias, not an acceptable balance outcome. Can humans strategically re-position HOPE often enough to compensate? Unknown. Do not auto-add NPC proxy allegiance, bonus counters or numerical per-card stats without a deliberately isolated variant.

## What has NOT been established
- R17 five-to-fifteen second spoken story tempo, what fraction of players voluntarily use their own satirical card titles/illustrations, whether the storyline is funny/meaningful rather than mechanical parroting, actual cards and their creative copy, or any human play/fun.
- Paired full-game n=2..6 runs with R15C six occupied public outer cards, single-die capacity, R16 editorial NPC pulses and mandatory own-card re-entry. Existing R14's 6,000 bot games are not applicable to those rules.
- NPC influence on Focus over repeated rounds, deliberate coalitions and collusion, face-value trajectories, card churn, stock exhaustion, actual victory conditions and loops.
- One optional fourth QUEST die or any R/A/F alternate meanings. The R17 system uses *exactly three* Fear/Hope/Hate D6.

## Single next gate
One physical **2 humans +4 NPC public narratives** short turn using actual named card titles and finger-point causal template, then one six-human comparison. A/B: pure guided chain versus Hope-Solution Focus claimant. Capture these observables: number of spoken card titles, average seconds for a line, whether MOVE/SWAP changes story plausibility, actual card choice on PLAY/REWRITE, whether Focus claim causes 2- vs 6-seat imbalance, and 5→6 preparation/early center churn. Georg KEEP/TUNE/FAIL before any full-deck card-icon tagging, rule canon, Site/Stage publishing or merge.
