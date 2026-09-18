# KFB Free Roam · public playtest status

## CURRENT · FR-S04-02 · 18.09.2026

**IMPLEMENTED IN RACE · SOURCE-BROWSER PASS · PUBLICATION CANDIDATE · HUMAN FEEL REVIEW OPEN**

Permanent entry: https://kayfabizarro.pages.dev/kfb-hub/free-roam/

Immutable candidate path after deploy: https://kayfabizarro.pages.dev/kfb-hub/free-roam/versions/fr-s04-02/

Race implementation SSOT: georg-doc/KFB-Stunt-Car-Race. PR #6 merged at `63cb97d5e321700e55f7658104b42c9c09d97d70`. Tested source commit `a7a48a8c6e1589a18134aa619e2be22d79124c32`, Actions run `35365197941`, artifact `10555832979` SHA-256 `bc8eedb71e643cdde43a014501ade168c63a5c52aec7044d37bab7ee118c19b1`.

Source test: 9 drive-intent tests and **33 browser/WebGL checks PASS**. Covered corrected A/D semantic and physical signs, actual chassis rotation, hysteretic reverse without neutral chatter, candidate reverse steering, no reverse boost, Ground-compatible Orbit drag convention, >10 speed boost, open radius-48 baked-Travel area with radius-56 recovery envelope and no circular fence, 180-tick continuous curve without stuck/outside recovery, Hop, pause/blur clearing, raw donor comparison and narrow viewport.

FR-S04-01 remains immutable at `/versions/fr-s04-01/` but is now explicitly the **human-rejected predecessor** for steering/camera direction, reverse wobble and restrictive circular-boundary behavior. Its historical public-browser evidence is preserved.

Public-host verification for FR-S04-02 runs separately through `.github/workflows/free-roam-public.yml`; do not convert source-browser PASS into public PASS until that run succeeds. Human feel acceptance remains separate in all cases.

Not implemented by FR-S04-02: Walk↔Drive handoff, parked vehicle/save restore, city traffic, Combat, audio transfer, driver rig or the next defined stunt-ramp slice. Existing BOX1/v0.8 and Travel/Ground owners remain unchanged.
