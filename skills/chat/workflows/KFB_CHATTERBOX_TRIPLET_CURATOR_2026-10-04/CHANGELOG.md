# CHANGELOG · KFB ChatterBox

## 2026-10-05 · GPT Site-only surface correction

### PRODUCT / REVIEW SURFACE
- The single KFB ChatterBox product, review and acceptance surface is its GPT Site.
- Removed the newly introduced Cloudflare/pages.dev Stage route from the slice plan, implementation packet, Return and test gate.
- Cloudflare/pages.dev is explicitly out of scope and unused for ChatterBox; it is not a route, mirror, fallback or acceptance surface.
- No merge and no Live promotion.

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
Not started. No Site URL invented. No Live change.

### NEXT
One Sites-capable implementation run builds the private ChatterBox / Triplet Curator v1.


## 2026-10-05 · KFB ChatterBox umbrella + live Dialogue Lab

### PRODUCT DECISION
- Umbrella product name is **KFB ChatterBox**.
- Triplet Curator is a module inside ChatterBox, not a separate Site/product.
- Existing ToolBox slot `chatterbox-comic-vfx` remains the single receiving lane.

### DIALOGUE LAB
- Added bounded live LLM dialogue testing.
- First topology is exactly two Residents.
- First voice-distinctness comparison: deterministic baseline → L0 shared-agent → L1 same-model isolated Resident contexts.
- L2 different-model/per-Resident model profiles remain optional until L0/L1 evidence shows a material need.
- First acceptance pair: Goth Girl × Clown, 8–12 turns on the same scene seed.

### PLAYER INTERACTION
- Player may answer with a free Triplet.
- Four explicit interaction calls are included: KayfaBINGO!, KayfaBONGO!, KayfaBOGGLE?, BLÖDSINN!.
- Lab behavior of those calls is logged as experimental digital dialogue behavior, not silently promoted to global canon.

### CRITIC / REPAIR
- Added a second non-speaking LLM critic.
- Critic checks Resident voice distinctness, repetition, Triplet integrity, causality, character clamps, Fluff-o-lect, comic economy and bold/italic emphasis.
- Repairs preserve the original transcript and create a revision.
- Strong generated material may be promoted to candidate Triplets/clusters; bad recurring patterns may become durable negative tests/guardrails.

### PRESENTATION / REACTION
- Added reaction/choreography lab for What the FLUFF?!, Stay fluffy! and four-call reactions.
- Real Resident Atlas 3D actors remain mandatory; cutouts/sprites remain rejected.
- EyeRig v6 remains integrated eye owner.
- Added free Orbit camera + responsive viewport/bubble safe-area/occlusion tests.

### AUDIO / TTS
- Browser speechSynthesis is sufficient for first-pass Resident voice audition.
- Existing KFB Audio owner remains authoritative.
- Mixer owns ducking; ChatterBox does not create a second AudioContext.

### SOURCE
- Added `CHATTERBOX_LLM_DIALOG_LAB_EXTENSION_V1.md`.
- Updated START_HERE, Work One-Shot, Work MIN and Site implementation packet.

### IMPLEMENTATION
Still not started. No Site URL invented. No Live claim.

### NEXT
One Sites-capable Work run implements **KFB ChatterBox v1** from the expanded packet and returns the private Site for Georg's editorial/dialogue-lab freeplay.
