# KFB Resident Atlas · Changelog

Additive history. Do not rewrite earlier implementation history as if later corrections had always been present.

## 2026-09-18 · pose-first grounding sync

### DECISION
The scene-composition viewer consumes resident pose evidence from `tools/resident_atlas_s6/` instead of inventing an independent pose vocabulary. It remains a separate composition consumer and does not replace the S6 atlas or any Animation/Movement owner.

### IMPLEMENTATION
- added `residentBinding` provenance to the Caveman scene;
- bound Caveman to `Rig_Medium / Melee_Unarmed_Idle` from the pinned shared KayKit Character Animations library;
- added pose evaluation in the mobile viewer;
- added precise posed-bounds grounding;
- added continuous ground lock for running idle clips;
- kept habitat and signature props as whole KayKit assets;
- added `SCENE_STAGING_CONTRACT.md` and explicit `skills/chat/` sync order.

### STATIC TESTED RESULT
Branch sanity passed: scene JSON parses; the HTML module script parses; the Caveman recipe declares 11 scene assets, `Melee_Unarmed_Idle`, `ground.lock=true`, the exact asset/animation pins, precise posed bounds, and mixer-update-before-ground-lock ordering.

### BROWSER TESTED RESULT
Pending. No live/mobile visual PASS is claimed yet.

### ARCHIVED HISTORY
The 2026-09-16 raw.githack build that loaded `14/14` models remains evidence for the earlier viewer mechanism only. It is not evidence for this posed/grounded revision.
