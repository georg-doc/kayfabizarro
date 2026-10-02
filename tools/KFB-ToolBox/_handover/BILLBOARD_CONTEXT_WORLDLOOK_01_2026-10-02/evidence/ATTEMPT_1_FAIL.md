# BILLBOARD-CONTEXT-WORLDLOOK-01 · Attempt 1/2

Head: `7f08630bdd593a585dbec8a38e2e5bd2c99edf59`
Workflow run: `37047686935`
Job: `110973056364`
Artifact: `11244483951`
Digest: `sha256:553a7c69e3485a2390ff48c427e306f1d57cd55cc54278688422a09dc724a6c3`

Result: **11/13 PASS**.

Confirmed PASS:
- exact K2 donor bytes;
- protected upstream R11/Consumer files unchanged;
- real WorldContext accent `#ffb27a`;
- K2 adaptation applied to 4 physical-body meshes / 4 materials;
- WorldContext seed consumed;
- source materials preserved;
- H13 ambient remained live;
- exact K2 material blob pinned;
- no first-party request failures.

Two failed assertions were measurement-timing defects in the proof:
1. `sourceBox` was captured before B1's accepted H13 2:1 content-fit scaled the Billboard root, while `adaptedBox` was captured after it.
2. panel material UUID was captured before R11 legitimately replaced the panel material during mount/H13 texture setup, so it was not a valid pre/post-K2 comparison.

The page-error was a 30 s full-page screenshot timeout after K2 bake; it was not a runtime or shader exception.

Repair pass 2/2:
- capture source box + panel material immediately before K2 adaptation;
- compare those exact pre-adaptation values afterward;
- screenshot the visible WebGL canvas instead of the whole animated page.
No K2/WorldContext architecture change.
