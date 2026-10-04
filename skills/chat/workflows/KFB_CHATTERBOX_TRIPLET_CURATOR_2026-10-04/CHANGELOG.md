# CHANGELOG · KFB ChatterBox / Triplet Curator

## 2026-10-04 · planning packet

### DECISION
- Reuse the existing ToolBox `chatterbox-comic-vfx` planned specialist slot instead of creating a second dialogue tool.
- ChatterBox remains language/content route; Triplet Curator is authoring/review only.
- GitHub remains authoritative persistence.
- Normal Web Chat is an intended bulk-authoring path.
- Hypernormalisation quotes are referenced by stable quote ID, never copied as a second canonical quote database.
- Bubble design remains presentation-only and may be swapped through an adapter when the current Claude Design return is accepted.

### SOURCE
- Resident Prep base pinned at `422c48e2a82b13c8ae380da70f6c66619639d8aa`.
- Exact 20-entry PR #310 Triplet donor frozen as `TRIPLET_POOL_SEED_20.json`.
- PR #305 deterministic kernel retained.
- PR #354 Quote Pool schema retained.
- current ToolBox reserved specialist lane retained.

### COWORKER DONOR ARRIVAL
- Coordination head `b2ddd72346e3d804b53625f50addbba87be3c9a0` added a real Triplet Review Stage and a normal-Web-Chat pool brief.
- The Site plan now reuses that stage as its first UI/workflow donor rather than rebuilding review controls.
- Current measured content gaps (missing resident-specific relation coverage and Card anchors) are preserved as authoring targets, not hidden by UI.

### SITE READINESS
- Added explicit `kfb.triplet-pool-review/1` schema so Cowork/sidebar exports can enter the Site without re-review.
- Added review migration: keep→GEORG_KEEP, cut→GEORG_CUT, change→GEORG_TUNE.
- Added six real PR #354 quote IDs as editorial bridge fixtures while explicitly recording that S1 Cards #11/#30/#1 have no direct Batch-01 quote match.
- Verified Dropbox review-stage copy has the same filename and exact 26,833-byte size as the GitHub donor.
- Added machine-readable Site implementation packet and token-light Work prompt.
- Cumulative planning/data/donor/site-readiness checks: 34/34 PASS.

### IMPLEMENTATION
Not started. No Site URL invented. No Stage/Live change.

### NEXT
One Sites-capable implementation run builds the private ChatterBox / Triplet Curator v1.
