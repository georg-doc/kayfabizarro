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

## 2026-09-19 · Resident Scene Module seam · Clown first proof

### DECISION
`tools/resident_atlas/` bekommt einen dünnen Plug&Play-Vertrag über die bestehenden S6-Resident-Rezepte, statt Vignetten/Rigs/Activities zu duplizieren.

### IMPLEMENTATION
- `modules/index.json`
- `modules/clown-juggling-island.module.json`
- `modules/runtime/s6-resident-module.js`
- `modules/README.md`

Der Consumer liefert Parent/Anchor und besitzt Support/Collision. Das Modul liefert Resident-Root, lokale Aktivität, `update(dt)` und `dispose()`.

### STATIC TESTED RESULT
Manifest parst und hält die Owner-Grenze: `support.owner = consumer`, `collisionOwnedByConsumer = true`, empfohlene Mindestfläche 4×4 Platformer-Zellen.

### OPEN
Erster Consumer-Import in den Free-Roam-Platformer erst nach visueller Abnahme des Clown-Loops.

## 2026-09-19 · WSA handoff checkpoint

### HANDOFF
Created `tools/KFB-ToolBox/_handover/RESIDENT_SCENE_MODULES_WSA_2026-09-19/` with exact source state, Return and scoped backlog for the existing WSA lead.

### PUBLICATION
Human review is Cloudflare-only:
`https://kayfabizarro.pages.dev/resident-atlas-s6/?resident=clown`.

No githack/raw-CDN fallback is part of the active handoff.

### OPEN
Visual Clown S33 acceptance first; Platformer consumer proof second. The module seam does not own Platformer support/collision/movement/camera.

## 2026-09-24 · NPC-LIFE-01 · Living Resident encounter bus

### DECISION
Resident social life is expressed as semantic encounter beats, not as a second dialogue tree or movement AI. The receiving host owns legality, participant busy state, relationship context and movement progress.

### IMPLEMENTATION
- `life/encounter-bus.js`: `approach → greet → offer → react → accept/decline → leave`;
- `life/npc-life-01.adapters.js`: independent Motion / ChatterBox / source-backed offer consumers;
- exact Resident Atlas Goth Girl + Toy Soldier review surface under `kfb-hub/stage/resident/npc-life-01/`;
- Toy Soldier's existing Present prop is the offer proof; no reward/inventory write occurs.

### TESTED RESULT
`node tools/resident_atlas/life/tests/npc-life-01.test.mjs` → **21/21 PASS**.

### OPEN
Cloudflare browser verification and Georg visual pacing/behavior review. No public PASS or Town-wide promotion is claimed at this checkpoint.
