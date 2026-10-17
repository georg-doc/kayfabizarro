# ATTEMPT LOG

| Attempt | Workflow head | Run | Result | Artifact | Outcome |
|---|---|---:|---|---:|---|
| 1 | `9254becd331076b616ab4ec71c27e5dfefb1959d` | 36398578326 | **21/23 FAIL** | 10959452416 | Stage booted; two false-negative assertions; screenshot #2 timed out before Hub proof. |
| 2 | `13e3b6a50335fbb0cfb4225153740169fd2d459b` | 36398674762 | **21/23 FAIL** | 10959143954 | Same result; no product regression; Hub proof again not reached. |

Both runs proved:
- `SOURCE.json` HTTP 200;
- Stage HTTP 200;
- exact build marker;
- `__band` selected;
- baseplate false;
- song identity true;
- BPM/phase correct;
- drummer v5c and R strike frame 0;
- Play starts/advances the shared song clock;
- Pause stops it;
- `holdStrike('R')` holds frame 0;
- **0 failed Stage HTTP assets**.

False-negative harness assertions:
1. expected exactly `leader,guitarist,drummer`; actual S39 also has documented optional extension `trumpeter`;
2. expected root `resident-band-module-01`; actual runtime root is `resident-module:resident-band-module-01`.

After all 23 Stage checks, `02-drummer-strike-r.png` timed out at 30000 ms. Hub verification came later in the script, so it never executed.

No third attempt in this slice.
