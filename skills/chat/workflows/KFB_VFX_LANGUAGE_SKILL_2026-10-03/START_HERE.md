# KFB VFX Language Skill · START HERE

Date: 2026-10-03
Workflow: KFB-VFX-LANGUAGE-SKILL-01

## Bound slice

Owner:
- georg-doc/kayfabizarro

Branch:
- chatgpt-web/kfb-vfx-language-skill-01-2026-10-03

Outcome:
- provider-neutral KFB Visual Effects semantic / authoring skill
- consolidate existing Combat, Travel, Tiny Skies and clay-particle knowledge
- define reusable event, recipe, anchor, timing, primitive, budget and QA grammar
- do not replace existing runtime owners

Primary artifact:
- skills/kfb-cartoon-vfx_v1.md

Research:
- KFB Production Control workflow KFB-VFX-LANGUAGE-SKILL-01
- RESEARCH_SOURCE_MATRIX.md in this directory

Stage route reserved:
- https://kayfabizarro.pages.dev/kfb-hub/stage/vfx-language-skill-01/

Stage status:
- NOT_DEPLOYED
- documentation/research slice currently does not require a visual acceptance surface
- if a later implementation fixture is built, this is the reserved direct Cloudflare route

## Protected runtime ownership

This slice does not replace:

- KFB-Combat-Arena VFX recipes / sprite / trail / hit-response owners;
- Travel speed-lines / drift-smoke / impact-dust / wake / contrails / post-effect owners;
- gameplay / physics / collision / damage owners;
- actor / rig / weapon attachment owners;
- camera owner;
- current KFB clay material / K2 look owner.

The branch-local clay-vfx donor is architectural evidence for instancing, pooling and profile-driven clay primitives. Its reduced material is not promoted as the global KFB material owner.

## Core architecture

~~~text
authoritative gameplay / animation / collision fact
→ semantic KFB VFX event
→ recipe
→ visual hierarchy
→ anchor space
→ phase timing
→ presentation primitive
→ style adapter
→ existing pooled renderer
→ QA / evidence
~~~

## Clay-first primitive vocabulary

- BALL
- DROP
- CHIP
- RIBBON
- RING / SHEET
- MASK / SPRITE
- GLYPH
- SCREEN

## Key semantic distinctions

Never collapse these into one generic impact:

- confirmed target contact
- confirmed world contact
- bounce
- scrape
- near miss

Continuous VFX consume existing authoritative signals such as:

- speed
- driftIntensity / lateral slip
- wheel contacts
- contact point / normal / impulse
- nearGroundFactor
- water contact
- yaw rate
- boost state
- biome / surface

## Required donor rule

A loaded asset URL or numbered filename is not source proof.

For donor integration:

1. inspect actual source object / frame / node;
2. show it in isolation where visual integration is involved;
3. record exact repository/ref/path;
4. only then integrate.

## Current checkpoints

Implementation:
- skills/kfb-cartoon-vfx_v1.md
- verified skill blob: 49578e9459ebad994a4a0c928e5c9b0f7cbe302d
- Draft PR: #347
- branch: chatgpt-web/kfb-vfx-language-skill-01-2026-10-03

Evidence:
- RESEARCH_SOURCE_MATRIX.md is durable on GitHub.
- TEST_REPORT.md records 71/71 skill validation plus 16/16 routing/recovery validation.
- RECOVERY.md closes the earlier ReadTimeout/UNKNOWN write and proves the matrix landed exactly once.
- SOURCE.json pins the KFB Combat, Travel, clay and Tiny Skies donors.

Routing:
- skills/chat/REGISTRY.json registers kfb-cartoon-vfx as CURRENT_REFERENCE.
- skills/chat/START_HERE.md routes VFX work to this skill/workflow.
- skills/chat/CHANGELOG.md has the additive 2026-10-03 VFX v1 entry.

Publication:
- reserved Stage route: https://kayfabizarro.pages.dev/kfb-hub/stage/vfx-language-skill-01/
- status: NOT_DEPLOYED / NOT REQUIRED for this documentation-research closure
- no PUBLIC_VERIFIED, HUMAN_ACCEPTED or Live claim.

Site persistence:
- research ledgers, recovery, test/evidence and routing checkpoints are saved under workflow KFB-VFX-LANGUAGE-SKILL-01.

## Next work in this slice

1. write final RETURN.md on PR #347;
2. update the existing Hub `vfx-sfx` lane on HUB-CTRL PR #202 to point at the finished skill source instead of the obsolete local-review wording;
3. save the final Site RETURN checkpoint.

After that, this documentation/research slice is closed. Runtime adoption belongs to a later bounded consumer fixture using its existing owner.

No merge and no Live promotion without the named human gate.
