# R09 independent onboarding critic / Guard

17 November 2026. No production edits. Source baseline: current GitHub R06 Borromean candidate `5a711778c1318d68e3bd4309510784a6d4c2493c` and local R08 runtime. User rejects R08 matrix/product clarity; prior provisional guard does not constitute user acceptance.

## Concept and learning contract

Restore the three corner cells, three distinct R/A/F dice and contested centre Eye. The centre is a focus state, not a fourth channel. Die identity and occupied channel are different: R/A/F = Resonanz/Amplitude/Frequenz; Resources/Rules/Influence are corner channels. A unique highest die makes its occupied channel free to recruit; a tied maximum makes all recruits cost1. A Frame Plot deliberately changes one face by±1 or swaps corners, then recruits; no random roll or free repeated rotation.

The shortest useful tutorial teaches a concrete causal loop: recruit a visible institution, see its first secured point, use an actual Frame Plot to change one recruit cost, connect a supplier to a need, see production and banked points separately, continue the same game. A one-way two-card link produces4, not6; only mutual satisfaction produces6. Explain with actual selected card names and state-derived numbers.

## Required guard checks on new files

- Tutorial setup preserves all30 institutions/12 Plots and passes legal-action validation. If curated, identify it as a guided opening, not a normal random start. Guarantee the promised Frame action and suitable link without hidden mid-game state injection.
- Each coached action is one engine action; each completed turn banks exactly once. Never deposit on tutorial Next, a replayed animation, reload or skip. Let the engine own turn/round changes.
- Opponent/autoplay pauses while instruction is visible. If a computer acts between steps, make that visible and deterministic; do not silently leave a human-facing instruction on the opponent turn.
- Click or keyboard selection previews; the labelled confirmation commits. A camera drag never commits. Noninteractive animated examples must not look like enabled controls.
- Frame step shows before→after focus and cost, consumed Plot and resulting bank. Explain that the discount is access, not extra points or truth.
- Tutorial is resumable or safely skippable without overwriting an existing saved game silently. Finishing preserves the reached game state and does not give tutorial-only extra turns/resources.
- Visible step count, Back/replay explanation without state reversal, Skip, and Continue. Keyboard-reachable real buttons; no motion-only instruction or color-only state. Reduced-motion presents equivalent still before/after states. Text fallback works without WebGL.
- Keep optional rules (Poach/Veto, role bonus, alternative Window mode) out of the first action explanation; provide clear later help without pretending this teaches every rule.

## Acceptance boundary

A functioning guided opening can demonstrate basic cause/effect. It cannot prove the whole loop is intuitive, compelling or balanced. The restored motif must be a playable control/feedback surface rather than an ornamental triangle above unrelated forms. R08 simulation evidence covers the unchanged engine only; R09 needs its own onboarding transition/input checks and direct user response.

Status: **review pending new implementation**. Outcome-critical blockers would include an illegal/unavailable coached action, double bank, save destruction, a stuck mandatory overlay, or instruction that disagrees with the actual state. Visual polish and additional network graph detail may remain explicitly bounded after the learning path works.

## Implementation review and independent transition check

Read `learn-state.js`, `learn.js`, `board.js` and onboarding integration in `app.js`, `index.html`, `style.css`. Ran an independent Node trace of the actual lesson functions/engine; output `critic-lesson-transition.json`.

**PASS, bounded engine path:** curated30-card/12-Plot conservation; legal first recruitment; Committee passes twice under ordinary turn order; legal A3→4 Frame plus Gate recruitment; human production1→6, bank1→7, exactly2 deposits; round3 active human; preview does not mutate the real state. This specific curated lesson draws another Frame Plot, so final copy offering Frame remains mechanically possible. No full gameplay/browser or human-usability claim.

The five-step copy mostly matches actual state. English instructions, step count, real buttons, focus moved to headings, live region, Skip, Escape, replay entry and reduced-motion CSS are present. Core actions work without WebGL. Existing saved state is retained while the separate lesson runs; Skip does not save lesson state; Continue explicitly adopts it. Lesson progression itself is not persisted, so reload restarts the lesson rather than resuming it.

### Findings supplied to integrator

- **Important visual seam:** centre Eye/focus plaque has dark default lettering on a similarly dark background; give both Eye and state label pale explicit colors before visual acceptance.
- **Teaching seam:** Frame preview originally uses full simulated action, which removes the Gate from the market before confirming. Prefer frame-only preview or call it a result preview, with explicit recruitment result. The underlying real state is safe.
- Tutorial card click originally commits the first recruit directly whereas normal board clicks inspect. Align selection/confirmation, or explicitly disclose this tutorial-only gesture. No silent save is made, but inconsistent training is avoidable.
- Replaying a lesson and choosing Continue replaces the prior game save; the final button should explicitly warn when an existing game will be replaced. Skip/return preserves it.
- No back-to-previous-explanation control; Skip then replay safely restarts. Acceptable bounded limitation if disclosed, but not a resumable full tutorial system.

**Guard:** engine-learning path sound; repair low-contrast centre and clarify preview before presenting as the response to the user's clarity complaint. Continue as a prototype for direct user assessment, never claim the new onboarding proves the game intuitive or enjoyable. The restored triangular focus mechanic follows R06 OptionA, not mathematical Borromean topology or a real-world model of truth/political control.

## Final repaired disposition

**CONTINUE: bounded R09 learning prototype ready for user review.** No remaining outcome-critical blocker identified in reviewed source. This supersedes the earlier repair disposition, not the need for direct human acceptance.

Re-read fixes: centre Eye/state now have explicit gold/pale lettering; Frame preview retains the visible Gate and shows its changed price; tutorial card click selects/focuses the explicit action button without committing; generic PLAY A PLOT copy is accurate; Continue clearly says “Replace saved game with this opening” when a save exists. Skip-preservation note is explicit.

Preview implementation uses a simulated action copy then restores its original market solely for board rendering. That makes it a display projection, not a valid conserved gameplay state (the recruited Gate is also in the simulated network). It is presently safe because only the board consumes it, real `s` is unchanged, and continuation saves real `s`. Do not later serialize this projection or run invariant-dependent gameplay/network logic on it; a frame-only display copy would be cleaner.

Integrator reports actual browser completion of all5 steps at desktop1440, narrow430 initial layout, animated dice and free-card consequence, round3/production6/bank7 continuation, and replay→Skip→reload preservation of that save. These are integrator observations, not independently repeated by this critic. Independent critic evidence remains the real-engine transition trace and code inspection.

Remaining limits: guided opening has a deliberately passive opponent, so it teaches recruiting/focus/link scoring rather than a competitive match; no resumable lesson progress or back-step navigation; narrow-screen full-path and screen-reader use were not independently exercised; no human fun/clarity approval; broader linked-network view and mature art direction are not certified. Unchanged engine simulation evidence is distinct from tutorial usability.

Final reviewed hashes:
- `learn.js`: `7c779a916a06694d6e3c38f4fdff5ae1334edfeb5ed1aa409033594bfaa12d43`
- `learn-state.js`: `21542d311e7f1e2456fdd4fe2b74d7a823e0e5634d0d84d4a778c87912d18675`
- `board.js`: `7a4785bafd60f8a5ebb38af611193ea7474822d1585ab348d2d0f9474c8b9f36`
- `app.js`: `775f85fbb966223351ab84dc3b58ec41ebe7dccf029d1c62b488cfd59ff6a2bb`
- `index.html`: `481881728b136324cc1babc5fb3ae87e2ffa920a8d41d6dd6c13b4497321d015`
- `style.css`: `d5394aa71ce6eff4c7500af0570df2df39edce9a99d197677eb6d9cbc2cfff50`
- `engine.js`: `c8107f181091d883ee95e39bf3ede4b09a9ff67e50b4127c5405f603d367af7f`
