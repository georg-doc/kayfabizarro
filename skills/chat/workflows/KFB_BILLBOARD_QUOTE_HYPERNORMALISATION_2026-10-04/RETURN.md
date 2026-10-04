# RETURN · KFB Billboard Quote Hypernormalisation

Date: 2026-10-04
Status: PLANNING READY · IMPLEMENTATION NOT STARTED
Owner: KFB ToolBox / Billboard Media Residency
Repo: georg-doc/kayfabizarro
Branch: planning/billboard-quote-hypernorm-curator-2026-10-04
Last verified planning head before this Return write: 55d7db18a256439ee483ec62258a6a2f7649327f

## Prepared

- H13 quote read-along loop with attribution and mandatory FrizzleQuestion.
- Card/deck + biome/world deterministic selection.
- Clay TV/full-screen control that keeps the same timeline.
- Existing Audio-owner music/soundbeds feeding H13 visualizer sync.
- Mute plus existing voice-duck behavior.
- Brain Food links / optional QR.
- Private curator/admin Site concept.
- Clean neutral 3D Billboard test stage.
- GitHub-backed curation scaffold for all 130 canonical decks.

## Owners retained

H13 remains the Hypernormalisation reference.
Existing Billboard Context / clay Billboard stack remains physical/context owner.
Existing Card registry/Builder remains Card owner.
Existing Audio baseline/runtime remains audio owner.
No second renderer, Card DB, palette mapper, AudioContext, mixer, input owner or memory owner.

## Files

Added under `skills/chat/workflows/KFB_BILLBOARD_QUOTE_HYPERNORMALISATION_2026-10-04/`:
- START_HERE.md
- WORK_ONE_SHOT_BRIEF.md
- QUOTE_POOL_SCHEMA.json
- DECK_QUOTE_PROFILE_SEED.json
- AUDIO_VISUALIZER_HANDOFF_SCHEMA.json
- TEST_PLAN.md
- CHANGELOG.md
- RETURN.md

Routing updated on this planning branch:
- skills/chat/START_HERE.md
- skills/chat/CHANGELOG.md
- kfb-hub/index.html

## Evidence

Planning/data checks: **8/8 PASS**.
Verified 130 registry decks, 130 unique matching profiles, exact ID/title match, and both JSON contracts parse.

Runtime/browser/audio/3D tests: NOT RUN.
No screenshots because no runtime implementation was performed.

## Publication

Planned Stage:
`https://kayfabizarro.pages.dev/kfb-hub/stage/billboard-hypernorm-curator/`

Status: NOT CREATED · NOT DEPLOYED · NOT PUBLIC_VERIFIED.

No merge. No Live promotion. WB2 PR #348 unchanged.

## Open

Quote research/provenance, publication status per quote, Site implementation, H13 adapter, audio analysis adapter, 3D Stage, game Billboard integration, and later optional player-response persistence.

## One next gate

After the current MVP1 human-review gate clears, start one continuous Work implementation from `WORK_ONE_SHOT_BRIEF.md` and carry it through the integrated curator + 3D Stage + one complete quote/audio/FrizzleQuestion vertical slice before asking Georg for another product gate.
