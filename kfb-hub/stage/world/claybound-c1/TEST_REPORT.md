# TEST REPORT · CLAYBOUND-WORLD-C1

Date: 2026-09-26  
Branch: `work/claybound-world-c1-2026-09-26`  
Implementation: `6f3f1669c18d502460d151913d8be8dc43b32103`  
Diagnostic: `09d98a8fd65d724277f75cb52035c8be6f9efe61`

## PASS

- GitHub branch and intended implementation files read back at exact head.
- CI package proof: **32/32 PASS**. The 23 accepted World r2 runtime files are byte-identical to the accepted Stage package. Canonical and packaged C1 adapter are identical.
- JavaScript syntax: **PASS** for adapter and browser proof.

## Browser gate · NOT PASSED

- Run [36269230493](https://github.com/georg-doc/kayfabizarro/actions/runs/36269230493): 180-second wait for C1 + Hürth self-test timed out. No A/B capture.
- Diagnostic run [36269548160](https://github.com/georg-doc/kayfabizarro/actions/runs/36269548160): 90-second C1 mount wait timed out. Browser snapshot: `window.__wb2d` present, `world.id=huerth`, C1 adapter absent, world self-test output empty; no captured page/console errors or failed requests at that point. These zero counts are limited to the incomplete load.
- Accepted World r2 CI run [36262361233](https://github.com/georg-doc/kayfabizarro/actions/runs/36262361233) independently timed out on its Hürth browser wait in the same GitHub runner. The accepted r2 package's documented local and public browser PASS remains historical evidence; it is not a C1 PASS.
- C1 desktop and narrow A/B, visible silhouette, idle/walk stability, direct route, and public Stage gate: **UNVERIFIED**.
- No Stage publication or Hub card activation occurred.

## Interpretation

The runner reached the unchanged WorldBuilder before `WORLD.mount()` completed. This does not establish the cause of the stalled load. External donor requests, runner/browser conditions, and a C1 entry sequencing problem remain hypotheses. The C1 adapter has not been exercised in a completed scene.

## Next gate

Run the exact C1 branch over local HTTP in an environment where accepted World r2 completes, then execute the committed desktop/narrow A/B proof and inspect both screenshot pairs. Only after that PASS, publish the intended KFB Stage route and verify its revision.
