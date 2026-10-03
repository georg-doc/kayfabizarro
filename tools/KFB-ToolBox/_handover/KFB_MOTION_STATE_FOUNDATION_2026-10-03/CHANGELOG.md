# CHANGELOG · KFB Motion State Foundation

## 2026-10-03

- created central Animation/Motion SSOT foundation on top of KayKit Motion Lab v1;
- promoted tested locomotion-profiles + anim-map donors byte-identically;
- added motion-state-machine.v1.js;
- added machine-readable Motion State Contract;
- added exact-source Blender measurement schema/template/brief;
- added focused state-machine tests;
- corrected Motion Profile Router to forbid consumer-local locomotion state/clip forks;
- first CI attempt found test-path-only import error;
- repair pass 1 changed test import only;
- exact head aa0166f166c303443a74c7bbae1b84f181fa0900: Foundation workflow PASS;
- no Travel/Combat/Drive/World runtime integration;
- Island World and Resident/EyeRig work remain parallel active.


### Ladder 02 / Motion Library v7 convergence
- adopted the full Motion Library v7 source subtree from donor PR #336; 395-clip closure is now present on current Motion PR #333;
- copied exact Ladder 02 return/review evidence into the central owner;
- added `locomotion-ladder-profile.v1.js`;
- extended central semantic support with `jog` and `run.easy` without removing legacy `walk.fast` compatibility;
- preserved measured phase offsets and exact handoff speeds;
- kept human look choices explicit and unaccepted;
- kept old KCL `Walking_A`/`Running_A` deltas unresolved rather than picking a winner;
- repaired playback-boundary rounding before final acceptance;
- exact head `aaf7f899caee381ede876a50276e0a3d2aaeb6c8`: 26/26 Node tests + syntax/JSON/smoke PASS; Resource Registry + Asset Registry PASS;
- no Stage, merge or Live promotion;
- next gate = neutral ActionFigure WASD+Shift+Space freeplay, then procedural World #332.


### ActionFigure freeplay + human-guidance correction
- added source-backed `backward` mapping from Ladder 02 `walkBack`;
- built neutral ActionFigure freeplay surface with WASD / Shift / Space and Jog/Run/Sprint A/B selectors;
- exact source actor is ActionFigure.glb blob `4785276d...`;
- browser gate consumed exactly two repair passes, then PASS on `f1ce90d31a18973fa981bc982309c4bb01b204b8`;
- browser evidence: Run 2.132 m/s, Sprint 3.006 m/s, Backward 0.489 m/s, Jump Start airborne, 0 console/page errors;
- Motion Foundation advanced to 27/27 PASS;
- exact tested HTML mirrored to KFB Production Control Site, SHA-256 `ebb861191bf68d1f46d71730ed6298b160fb18182bab46a322bd60402bf211ad`;
- review transport = SITE REVIEW, not public Cloudflare Stage;
- mandatory human-guidance rule added: every Return names next executor, concrete action, Georg's task, and what he receives next.


### Human FAIL · mixed Ladder-02 ActionFigure approach archived
- Georg classified the ActionFigure freeplay as TOTAL FAIL, not TUNE.
- Failure observations: step-length mismatch, jitter/wobble, arms pressed into/inside torso, dirty transitions, bad jump behaviour and jerky animation timing.
- Browser PASS remains technical evidence only and is explicitly overridden by human motion-quality FAIL.
- Proven conceptual regression: the active mixed Ladder-02 gait family violated the existing canonical `locomotion-profiles.v1.js` source-priority rule.
- Restored source policy: KayKit Character Animations 1.1 native roles first; Motion Library/Mixamo only for later proven gaps.
- Ladder 02 and Motion Library v7 remain reusable donors, but not the ActionFigure primary locomotion family.
- New next gate: `KAYKIT-NATIVE-BLENDER-BASELINE-01`.
- No Repair 3 on the failed browser foundation.
