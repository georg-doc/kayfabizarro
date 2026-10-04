# TEST REPORT · WORLD-CONVERGENCE-BASE-01

## Checkpoint `74fae51ac6736f630f7f0e5ce0cc1f84540c66f8`

### Browser
Workflow: Procedural Test World R2D Browser
Run: `37165723175`
Job: `111328087611`
Result: **PASS**

The workflow completed:
- static syntax;
- Playwright/Chromium install;
- exact local HTTP entry boot;
- Browser proof;
- evidence artifact upload.

### Resource Registry
Run: `37165723168`
Result: **PASS**

### Source contract
Workflow: Procedural Test World 01
Run: `37165723177`
Job: `111328087463`
Result: **FAIL**
Syntax step: PASS
Source tests: FAIL

Known deterministic mismatch from committed inputs:
`profile.proceduralDesign.natureMountStatus` did not match the source test's browser-verified status constant.
The browser proof above now establishes that status on this branch.

### Repair Pass 1
Metadata/profile correction only.
No runtime geometry, renderer, road, building or presentation code changes.

Required next evidence:
source PASS + browser PASS on the repair head.
