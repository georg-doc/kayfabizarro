# R13 · Free action choice

Owner: games/invisible-handshake, existing design branch and draft PR 475. Outcome: assess action utility under the shorter claim hold for 2–6 players. Builder and sole GitHub writer: parent; independent tester/critic: mechanics_review. No runtime, Site, merge, faction powers or new card content.

Baseline donor: R12 at d812129ebdc36486b7c8e0478796b92e061d3aa3. One public signature card per player, three shared emotion dice starting at 3, one chip each. A card qualifies with at least one 3–5 and no 1/6. Claims must survive min(2,n−1) opposing actions. Actions invalidate claims BEFORE payout; claims are created afterward. Existing claims cannot revive. No extra reactions.

One free action per turn:
- adjust: choose one die and +1 OR −1; deterministic, including deliberate 0/7 crossing;
- reroll: choose one die, then replace its value with a fresh uniform 1–6;
- move: relocate one die to a different player's card, preserving identity/value;
- swap: exchange locations of two dice, preserving identity/value; exclude same-location no-ops.

Optional fifth category: flip one die to 7−value, hence 1↔6,2↔5,3↔4. Flip and reroll cannot cross 0/7. On an adjustment crossing, replace the target card without a trophy and reset only that die to 3.

Policies are deliberately simple one-step heuristics, not optimal players: build scores own eligibility at 6; deny scores it at 3; both add 4 plus urgency (1/remaining opposing turns) per destroyed enemy claim. Mixed chooses randomly half the time, otherwise uses deny. Random choice and tied-best choice select ACTION CATEGORY uniformly first, then a concrete action uniformly. This avoids favoring move simply because it offers more destinations. It still permits eligibility-neutral swaps when positions differ.

Reroll is scored by the average utility over all six possible outcomes. The actual outcome is not revealed to the policy. Separate random streams for setup, decision and roll; fixed three decision draws and one outcome draw per turn, even when no reroll is selected. Starting seat rotates by seed. Paired seeds preserve exogenous draws, not identical trajectories.

Main batch: 5 player counts ×3 policies ×2 menus ×100 seeds =3,000 games,18 rounds each. Focal omissions: remove one of four actions from player0 only, while all opponents retain all four; 5 counts ×4 omissions ×100 seeds =2,000 games, same deny heuristic. Compare focal trophies to the all-four baseline. This is a marginal utility diagnostic, not a causal estimate independent of policy or proof of strategic dominance.

Separate probe: 5,000 randomly generated four-player position/value snapshots with only currently valid enemy claims, comparing five actions. These snapshots are NOT sampled from main games and need not represent their stationary distribution. Record uniquely best categories under the same immediate heuristic and illustrative examples. Do not present these counts as play frequencies.

Limitations: no card hands/meaning, finite deck/exhaustion, faction-specific goals, NPCs, solo, strategic lookahead, human enjoyment or uncertainty intervals. Only three dice support claims across up to six cards. New menu results must not be described as preserving R12's measured counterplay. Claims accounting and die bounds asserted every turn; independent review and explicit fixtures accompany results.
