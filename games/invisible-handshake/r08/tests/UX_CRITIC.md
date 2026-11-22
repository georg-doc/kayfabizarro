# R0.8 · Independent UX critic / guard

17 November 2026. Existing Invisible Handshake owner; main builder is sole production writer. Critic reviewed R0.7 `app.js`, `board.js` and `index.html` before the repair. No production edits by critic. New user rejection supersedes the earlier provisional publication disposition: **R0.7 is not visually/product accepted**.

## Why the rejection is substantive

The old3D surface showed three dice, a decorative triangle/eye and anonymous small blocks around a table. It did not show the four actual market choices, provide selectable institutions, draw dependencies or make frame manipulation legible on the object. Almost every consequential choice happened in a distant dropdown. A working renderer and source-backed die did not make this a functioning game board. The single-angle camera and absent Home/zoom buttons made presentation harder to recover. Source isolation and simulation counters do not answer this critique.

The current game also has unresolved structural engagement risks: networks saturate at three cards, many later decisions exchange near-equivalent scoring pieces, and a late takeover can dominate the result. A more readable board can expose these issues and enable an honest playtest; it cannot certify that the loop has become compelling. Satirical labels on a static optimization puzzle are not evidence of an interesting political game.

## Smallest useful repair without new rules

1. **Market is the board.** Four persistent numbered columns ×three named supply channels. Each of the four market cards appears exactly once, at its column/channel intersection. Empty cells are vacant visual positions, not additional recruitable cards. Preserve original column ordering so Window mode still means the same two slots.
2. **Meaningful selection before confirmation.** Clicking a card should select it in the existing action controls and mark it visibly in3D and text. Show actual cost, target and replacement before confirming. A target requiring replacement must never silently choose which owned card is surrendered. Highlight affordable actions, but keep unavailable cards inspectable with their reason.
3. **Frame manipulation must expose consequences.** The die/slot identity and current value must be readable from Home. When a legal Frame action is selected, indicate which channel/market slots would become free and what the recruit costs afterward. A disabled die-control explains that a Frame Plot is required; it must not imply arbitrary free rotations.
4. **Dependencies show a directed transaction.** Draw supplied-channel → matching-need connections within the relevant player's network; label the endpoints. Distinguish suspended, unmet and active nodes by text/symbol as well as color. These lines are game rules, never a claim of a sourced historical relationship.
5. **Camera serves reading.** Default Home frames the entire board at a readable angle; camera interaction is optional. Visible zoom+/−, Reset and top/perspective controls; drag should not accidentally select a card. No automatic spinning. A narrow screen still has all text actions accessible.
6. **Keep one state and one action path.**3D picking only selects an existing legal action; engine remains canonical. Board state, text cost, selected target and resulting log must agree after recruitment, replacement, Frame, takeover response, round change and reload.

## Acceptance checks for this repair

- At Home, identify the four current choices, their supply/need, cost and current active player without orbiting.
- Click one market card and verify the correct action target is selected; confirmation recruits that card, refills its original slot and updates network links.
- With three owned cards, select a recruit and verify replacement is explicit and consistent across board/control/log.
- Select one Frame action and verify the displayed target and cost correspond to the modified frame, not the pre-action price.
- After a suspension, affected links and zero-score node are visibly updated.
- Drag, zoom and Reset; accidental drag-click must not perform a move. Top view must not crop playable fields.
- Check Window mode: only four cards, correct two free columns, no phantom extra positions.
- Check a six-seat populated state: readable focus and local dependencies, with scrolling/text alternative if the whole3D scene cannot be legible at once.
- Reload preserves state; selection can safely reset but cannot commit a stale action.

These are interaction/representation checks. They cannot establish fun, human decision time, role balance or a successful satirical voice.

## Guard status before repair review

**REPAIR the board/interaction seam; continue the existing owner.** No new rules, deck, engine, renderer owner or theory layer is justified by this UI repair. Do not publish a second ornamental composition as the answer. Final guard judgment pending repaired source and actual browser evidence; do not reuse the prior1800-simulation count as evidence that R0.8 UX works.

## Final source review of R0.8

Disposition: **continue as a privately reviewable prototype; human acceptance remains open**. The repaired board now represents the four market choices in a three-channel/four-slot matrix, gives them one clickable location each, highlights selection, and routes confirmation through the canonical action handler. Orbit, pan, zoom buttons, top/tilt and Reset exist. Text controls preserve access if WebGL fails. Game-state ledger and fictional card justifications remain explicitly separated. This is a functional repair of the earlier ornamental board, not proof of entertainment value.

Independent critic read current board.js, app.js, index.html and style.css plus the R08 scoring report/production-equivalence result. Browser observations were supplied by the integrator, not independently repeated here: desktop1440/mobile430, card raycast selects without commit, explicit recruitment deposits1 point, reload preserves, camera zoom/top/reset exercised. These observations are narrower than a full six-seat usability playtest.

### Remaining seams and precise disposition

1. **Dependency visualization is text only.** `board.js` update draws market rows, plaques and dice, with no controlled-network nodes or link geometry. `app.js` renders supplier names within mini cards. This is useful attribution but not a delivered graphical network layer. Quarantine as deferred, or add a dedicated local network visualization later; do not call the new board a dependency graph.
2. **Frame consequences require mental calculation.** `app.js` labelAction/frame and actionGroup display move, institution and replacement but do not preview post-Frame focus/cost. Normal market labels still show current prices. A legal action is enforced by the engine, so this is an explainability gap rather than a corrupt state. The smallest future repair is a preview beside the selected Frame option showing resulting channel/window and price. Do not advertise an implemented Frame preview or clickable dice controls.
3. **Selection persists only until render.** `actionGroup` reconstructs dropdowns with index0 on every render, including Reveal Plot or another board selection. The visible replacement matches the executed action, but a previously chosen replacement can reset. Before confirming, players must read the shown replacement; a retained action key would improve this later.
4. **Solo tie wording:** `app.js` intentionally uses strict score comparison and ignores Favor on equal solo scores. `index.html` help should explicitly say “Multiplayer ties use Favor; equal solo scores favor the System.” Existing wording can otherwise imply solo Favor comparison.
5. **Mobile/large-seat usability:** explicit text alternatives exist, but board plaques at narrow viewport and the entire six-seat relationship view still require human assessment. No screenshot/readability or subjective-fun approval is asserted by this source review.

### Banking is a changed rule, separately evidenced

R08 own-turn banking is more than a UI repair and invalidates reuse of R07 gameplay evidence as validation of the new scoring rule. The separate scoring tester reports1944 paired-policy comparisons, then144 production equivalence games/7252 transitions with exactly8 deposits per player and no deposit duplication across response/reload. Critic read these artifacts; did not rerun or independently observe all games. Engine finish() banks base production before round advancement; score() adds final agenda once. The reports appropriately distinguish test policies from Site chooser.

Own-turn banking lowers final-mover leverage in the tested policies, but preserves more early leads. It does not resolve three-card saturation, establish comeback quality, measure satire, or prove sustained interesting choices. One short human solo game plus one2–3-player pass-and-play test should judge whether middle/late turns still offer meaningful alternatives. No additional mechanical expansion is warranted before that feedback.

Final delivery must describe this as a repaired market board with explicit actions, cumulative scoring, text dependencies and known preview/graph gaps; not as an accepted game or completed network visualization.

Reviewed file hashes:
- `app.js`: `39411569da84c8442e6965b5b624c31731ddd5db22aafa1c154521cefd457fdc`
- `board.js`: `3d15e2d86e3e9414b3397db6cff5aba411c0071af7b7924b00488572434d403a`
- `index.html`: `3b1d2da58e2cc4ed1c7ff8b31093e54f2a0a7ea836894ae41e3892497f16a2f4`
- `style.css`: `734430c94327d2f30355f07e98d88dedc21917ccfabe8abca3604c2935715da3`
- `engine.js`: `c8107f181091d883ee95e39bf3ede4b09a9ff67e50b4127c5405f603d367af7f`
