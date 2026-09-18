# KFB Game Dev Studio · Additive Changelog

## 2026-09-18 · GDS-01 · permanent tool + preview lane

### USER DIRECTION
- Keep Game Development Studio as a permanent KFB production lane.
- Expose assets/packages with previews at a fixed Cloudflare URL.
- Use existing `tools/` and Asset Librarian/Registry as source infrastructure, but do not copy the Librarian's UI/UX pattern.
- Add this lane to `/kfb-hub/free-roam/`.
- Maintain recovery + additive changelog after substantive turns.

### DECISION
- `tools/game-dev-studio/` owns the small presentation catalog + recovery docs.
- `game-ready/` owns package metadata/derived package artifacts.
- `/kfb-hub/free-roam/game-dev-studio/` is the human-facing permanent page.
- Public previews use pinned GitHub source revisions.
- Librarian remains a source/registry donor, not the UX shell.

### IMPLEMENTATION
- Added data-driven package catalog.
- Added permanent public Game Dev Studio site with direct 3D previews.
- Added Free Roam navigation card.
- Added tool/recovery redirect and documentation wiring.
- Added downstream integration note to Librarian README.
- Added Game-Ready index link back to the public preview lane.

### TESTED RESULT
- Source/model preview URLs are exact pinned GitHub refs.
- Static public/browser deployment proof is still separate and must be verified after Pages deployment.

### PUBLIC DEPLOYMENT
- Target URL defined; verification pending after this GitHub update.

### GEORG ACCEPTANCE
- Pending first visual review of Game Dev Studio UI/previews.

### OPEN
- First public Cloudflare check.
- Binary Sedan collider generation/validation.
- Real consumer gates.
