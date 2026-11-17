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
