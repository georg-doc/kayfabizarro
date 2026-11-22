# Invisible Handshake R09 · Independent onboarding state review

17 November 2026. Tester made no production edits. **PASS for the tested state/source contract**, not a browser rendering acceptance.

Reproduce with `node onboarding-state.mjs` from this test folder; it reads the sibling `handshake-r07/site/dist` owner candidate. Exact hashes are in `results.json`.

## Verified flow

1. Curated opening conserves all30 Institution and12 Plot identities. Human starts round1 with the Compute Chokepoint in market slot1 and a real Frame Plot.
2. Recruiting Compute costs1 Favor, produces1 point and deposits exactly1 point. Original input state is unchanged.
3. `prepareFrame` is byte-equivalent to two legal Committee PASS actions: one ends round1; the next occurs first in round2. Human next acts in round2. Committee receives two real zero-point deposits.
4. Preview selects the actual legal Frame action: rotate A3→4 at the RULES corner, then recruit Peer Review Gate for0 Favor. The two cards mutually satisfy their needs, producing6 points. Preview preserves the original game and can be repeated/undone without depositing.
5. Committing the same action deposits6 once, giving7 banked total. It consumes the held Plot, ends round2 and advances to the human's round3 turn. Both players now have exactly2 credits. The resulting game has legal continuation actions.
6. Forty deterministic seeded random legal continuations completed all eight rounds:681 further transitions, conservation checked throughout, exactly8 deposits per player, no double credit and no legal action after completion.
7. Save/restore continuation equality checked at the first recruitment, Frame action and continued-game boundaries.
8. Replaying creates a fresh independent lesson; a separate six-seat saved game remains unchanged in the pure-state test.

**10 fixtures passed.** Engine SHA-256 remains the verified R08 `c8107f181091d883ee95e39bf3ede4b09a9ff67e50b4127c5405f603d367af7f`.

## Source review

- The learner module does not write localStorage. Explicit `Continue this game` passes its state to the app; the app then saves it. Choosing a new table passes null. Skipping simply closes the lesson and does not replace a saved game.
- Existing version8 saves remain on the same `handshake-r08` key. The separate intro-seen flag does not itself replace game data.
- Old-game preservation is supported by this source contract and pure-state checks; actual browser storage behavior still needs the integrator's UI test.
- The narration accurately identifies the scripted Committee passes and continuing from round3. The1+6=7 explanation is correct. No fabricated scoring or extra onboarding-only rules are needed.
- Solo result text now implements `score(human) > score(System)`; equal scores remain a System win regardless of Favor, matching the independent R08 comparator.
- Board code reads the game state and modifies its own render objects; the onboarding's numeric explanation has a text path when3D fails.

## Limits and next gate

No browser click, screen-reader, responsive-layout, WebGL failure or actual save-resume UI test was performed by this tester. There is no measured newcomer comprehension or human game duration. The next acceptance gate is the integrator's actual browser traversal: preview → undo → commit → continue, plus saved-game replay/skip. No production-state defect was found in the tested sequence.
