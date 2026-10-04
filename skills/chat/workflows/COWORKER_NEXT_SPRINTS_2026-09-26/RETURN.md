# RETURN · WSA Clay priority correction · 2026-09-26

Status: **GEORG PRIORITY OVERRIDE PERSISTED · PLANNING ONLY · NO RUNTIME / STAGE / LIVE**

## Outcome

The proposed Asset-01 byte/hash lock is no longer on the MVP critical path.

Georg's current direction:
- the texture is secondary;
- it has already been handled in the Blender MCP workstream;
- WSA/Work must not spend budget repeating the source crawl.

This checkpoint does **not** claim Blender/material integration PASS because no exact Blender artifact/ref was present in the inspected GitHub state. The pending return is classified as `REF_PENDING`, not as an MVP blocker.

## Exact sources checked

- PR #231 starting head: `2db01875531382901819d9575e159ad72150770a`
- PR #228 current head: `19d51b70157f03ae44e7a02a71313ef2c6da06c1`
- PR #228 manifest blob: `39b2b0c58ea75153a0b82e9fdcc6233835a48c81`
- accepted Asset-01 manifest SHA-256 preserved:
  `fb952516a6c77448b7107486256798ca201629a3c2fac4397121906dd3c04ea5`

No Dropbox crawl was repeated. No substitute asset was used.

## Owner boundaries

- Blender/material work remains with PR #228 / Blender MCP.
- ToolBox, WorldBuilder, OSM, Track Core and Race retain their existing owners.
- HUB-CTRL #202 remains the only Hub/status/publication owner.
- This planning branch changes no runtime.

## Next gate

**WORLD-R2-STAGE-PREP-01**

Package the already-tested PR #190 World r2 candidate exactly for direct KFB Stage/Human review.

Do not:
- redesign World or Track;
- make Clay a dependency;
- merge;
- promote Live.
