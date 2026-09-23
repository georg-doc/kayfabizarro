# RETURN · ToolBox Source Lock · 2026-09-23

## Result

The next ToolBox gate has been tightened again after Georg's current HTML-preview review.

The recurring failure is now treated as one **3D preview portability problem**, not a set of isolated model bugs.

Current P0:

`TB-RESIDENT-PORTABILITY-01`

Instead of single actors, three complete known-good Resident Atlas sets must survive:

1. Goth Girl;
2. Orc Warband;
3. Animatronic.

Each must preserve model identity, textures/materials, pose, grounding, props/attachments, actor count and animation through:

`Resident Atlas donor → ToolBox/review import → export/reload`

The earlier FrizzleBob-lineage / roster source review remains necessary, but it now comes **after** this transport gate.

## Repository state

Repository:
`georg-doc/kayfabizarro`

Branch:
`chatgpt-web/toolbox-source-lock-2026-09-23`

Draft PR:
`#185`

Fresh Web briefing:
`tools/KFB-ToolBox/_handover/TOOLBOX_SOURCE_LOCK_2026-09-23/FRESH_WEB_START.md`

Evidence / Hub checkpoint before this Return:
`9747c64a8bc7a48a16312b53a860b44c04651bfe`

## Changed files

- `tools/KFB-ToolBox/_handover/TOOLBOX_SOURCE_LOCK_2026-09-23/START_HERE.md`
- `tools/KFB-ToolBox/_handover/TOOLBOX_SOURCE_LOCK_2026-09-23/SOURCE_EVIDENCE.md`
- `tools/KFB-ToolBox/_handover/TOOLBOX_STAGE_FIRST_DEFAULT_V1_2026-09-23/CLAUDE_DESIGN_BRIEF.md`
- `tools/KFB-ToolBox/CHANGELOG.md`
- `skills/chat/START_HERE.md`
- `kfb-hub/index.html`
- this `RETURN.md`

## Evidence actually checked

- Georg reports roughly ten repeated HTML-preview failures across the current parallel chats.
- Current screenshots show the same class directly: intended source actors/assets missing and replaced by source-missing markers/placeholders in one preview; other previews require texture-repair fallback.
- Existing `skills/design-3d_combined_for-design_v1.md` already requires canonical RAW URLs and identifies relative asset paths as standalone-export bugs.
- Resident Atlas source policy already stores exact source path/revision and canonical RAW runtime URLs.
- Three compound fixtures were selected from current Atlas truth:
  - Goth Girl — pose-first seated grounding;
  - Orc Warband — Legacy assembly + multi-actor + attachments;
  - Animatronic — multi-actor + texture variant + guitars/complex prop relation.

Runtime/browser tests in this documentation slice:
**0**

The next Web chat performs the portability runtime proof.

## Publication

No Cloudflare publication.
No Live promotion.
No Work/WSA.

## Unresolved

- Root causes of all historical preview failures are not yet claimed to be identical; the next gate measures them through the same known-good fixtures.
- FrizzleBob lineage and complete Studio roster review remain queued after portability.
- Claude Design stays blocked until the compound sets transport cleanly.

## Next gate

**TB-RESIDENT-PORTABILITY-01**

Build `TOOLBOX_RESIDENT_SET_PORTABILITY_REVIEW.html` using complete Goth Girl, Orc Warband and Animatronic donors.

For each: donor → import → export/reload.

Stop for Georg before FrizzleBob/roster or Claude Design.
