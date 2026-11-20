# Independent critic / production guard · R0.7

17 November 2026. Reviewer: discourse_research acting as independent implementation critic; **no production files changed**. The research worker did author `research/discourse.*`, so its own source packet is not independently accepted by this review. The other worker's influence packet and the main builder's engine/UI were reviewed separately.

## Outcome and authority

The current user authorized a research-informed, modular3D, online-playable prototype for solo and2–6 players. This supersedes the old paper-only gate, but does not authorize merging the game into the existing KFB runtime or assert that a prototype is human-balanced. Shared-screen/pass-and-play plus computer opponents satisfies the stated prototype interpretation only when remote synchronized multiplayer is clearly excluded. Current footer does exclude it.

**Guard decision at source-review stage: CONTINUE.** No demonstrated global outcome blocker. The seams below are bounded repairs/labels; browser acceptance and deployment remain separate evidence requirements. No permission loop or new architecture is warranted.

## Reviewed implementation

- `site/dist/engine.js`: legal-action model, Favor/capacity/score, takeover response, eight-round completion, seeded start and bot choice preview.
- `site/dist/app.js`, `index.html`, `style.css`: setup, controls, held Plot reveal, pass-and-play handoff, result calculation, local persistence, responsive text controls and scope disclosures.
- `site/dist/board.js`, `isolation.html`: source-die loading, frame labels, modular tabletop view and basic camera controls. This was **source inspection**, not independent visual observation of the original model.
- `research/influence.md`: author claims vs empirical comparisons and explicit missing video/book scopes.
- `tests/MECHANICS_REVIEW.md`: read as another reviewer's prior findings, not reproduced test results.

## Findings communicated to builder

| Seam | Classification | Evidence / required treatment |
|---|---|---|
| Bot evaluated next-round event through `apply()` | Functional fairness claim defect, bounded REPAIR | Original `choose` called advancing `apply`; next-round event could affect evaluation. Builder introduced `preview=true` and prevented phase advancement in `finish`. Reviewer then ran12 constructed comparisons:4 seeds×3 policies with identical visible state and opposite next event; choices stayed equal. **Resolved for these fixtures**, not proof of all information-flow properties. |
| Solo plus everyone-human option | Bounded REPAIR | Original `human(i)` returns true for every seat in pass-and-play, including The System when count1. Force bot control for solo or explicitly label manually piloted System. Otherwise setup contradicts “you vs the System”. |
| Auto-run during setup | Minor state/UX seam | Pending callbacks can run after New table opens; pause and cancel pending timer when setup opens. No evidence of illegal move, but avoid unnoticed state advancement. |
| Donor die pips versus value badge | Visual clarity / QUARANTINABLE | `board.update` initially resets all die rotations to0; only the badge changes with the actual face value. Correct donor orientation only with verified face mapping, or disclose badges authoritative/pips decorative for wireframe. Do not claim physical face animation already implemented. |
| Source link page not yet present at review moment | Publication seam, not current build STOP | `research.html` is referenced by navigation but was still being authored. Must exist before packaging. |
| Human fun, six-seat waiting, fairness of role distributions | HUMAN PLAY UNKNOWN | Enumeration and bots cannot establish these. Deliver a playable candidate and ask for one actual session; do not report “optimized for every player type” as measured human evidence. |

## Source/fiction and scope assessment

The main UI calls institutions fictional; the ledger distinguishes game-state actions from justifications; the board states that attention is not truth. This is a useful separation. Roles are end-state incentives and bot labels are policies, not diagnoses of people. Keep these disclosures readable but outside each turn's decision flow.

The research material supports a bounded first pass. It does **not** complete the upstream six-to-ten Hughes video audit, Curtis film with timecodes, ten-to-fifteen individually documented operations or full six-sphere entity matrix. The writer correctly marks these gaps. Final delivery must not summarize all research as finished. Missing corpus coverage does not block a fictional game experiment using the verified conceptual distinctions.

Northwoods must remain a planning source, not executed-event evidence. CCF funding must not imply every contributor knew. Official cognitive-warfare objectives do not establish effectiveness. R/A/F labels are project metaphors, not calibrated measures. “Discourse Focus” is preferable to asserting the triangle is a validated Overton model. The public engine may know exactly what occurred in a match; that certainty must not be transferred to historical allegations.

## Actual independent check performed

Using imported `newGame`, `clone`, `invariant`, `choose`: for seeds1–4, construct two full three-institution networks at round7,last seat, Favor3; duplicate the state and flip only the forthcoming eighth event. Compare builder, raider and framer chosen actions. **12/12 identical choices after preview fix.** This is a focused regression fixture, not12 games, not human play. A prior exploratory80-seed diagnostic was interrupted without a result and is not counted.

Endgame code inspection: highest score, then Favor, shared multiplayer victory if still tied; solo awards an exact tie to System. This matches current help. Full engine coverage belongs to the independent mechanics tester's report.

## Final source re-review and production-guard disposition

Re-read repaired `app.js`, `board.js`, `index.html`, `research.html`, `assets/dice-faces.json`, `PROVENANCE.json` and independent `TEST_REPORT.md`. Engine SHA-256 independently checked: `c7bd234135545cc3d40ac67ed0a34aa4de7a9141261cdc4a42347ea0ab1b38c3`, matching the tester's1800-game record.

- **Solo repair confirmed in code:** `human(i)` excludes solo System; pass-and-play handoff excludes solo.
- **Setup repair confirmed in code:** opening New table sets `auto=false`; pending callbacks check that flag before acting. Timer handles remain uncancelled and rapid reactivation could schedule an extra computer turn sooner than expected. This is a minor animation-tempo seam, not evidence of an illegal action or a blocker.
- **Dice repair confirmed in code:** six face-normal records cover values1–6; the corresponding donor normal is rotated upward using `setFromUnitVectors`. The main builder records21 connected pip components and source isolation in provenance. This critic checked the map/use, not independently reran geometry extraction or visually counted every face. The original fixed-pips defect is therefore resolved at source level, with visual evidence attributed to the builder.
- **Research link confirmed present:** dossier and structured-data links, Atlas backlink, source distinctions and explicit missing corpus scopes are visible in HTML. Some DISC summaries still show raw Markdown link syntax within HTML; this is cosmetic/readability debt, not a false provenance claim or navigation blocker because separate working source anchors exist.
- **Test scope read and preserved:**1800 complete engine simulations,51200 main actions,90539 invariant checks and ten fixtures are reported by the independent mechanics tester. These are not this critic's executed counts and not tests of the full Site bot policy.
- **Small report correction requested:** the simulation's SoloWin counts require strictly greater raw score, whereas the Site allows equal score with greater Favor. Do not claim the raw-score-only statistic exactly matches the Site winner calculation. Preserve counts and relabel this limit; no simulation rerun required to deliver a prototype.

**Final guard classification: CONTINUE TO PRIVATE PROTOTYPE PUBLICATION; NO DEMONSTRATED OUTCOME BLOCKER.** The authorizing user asked for a playable wireframe after tests, not a competitive tournament-ready ruleset. High raw-score tie rates, unequal role opportunity and last-mover advantage are substantive prototype limitations and should be prominent in the Return. They do not require another speculative rules layer or stop publication. The next meaningful decision requires human games rather than further parameter tuning against the same cheap policies.

Browser evidence supplied by main integrator: full six-seat demonstration completed round8; solo/window recruitment, takeover/response, persistence and repaired handoff were exercised. This critic did not independently operate or observe that browser session and therefore records it as **integrator-reported browser evidence**, not independent visual acceptance. Private deployment/version verification remains the main owner’s responsibility.

## Remaining acceptance evidence

Retain the integrator's browser proof of setup→legal turn→reaction/fallback→endgame/save reload and actual rendered3D field; small-screen usability beyond any actually exercised viewport remains unverified. Deployment must report the exact private Site version/source and preserve owner audience. Source inspection alone is not deployed or human-accepted status.

Recommended next human gate after publication: one2-player or solo game, then a six-seat group test, asking whether dependencies and frame changes are understandable and whether choices remain interesting. No claim of actual tabletop duration until observed.
