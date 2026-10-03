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
