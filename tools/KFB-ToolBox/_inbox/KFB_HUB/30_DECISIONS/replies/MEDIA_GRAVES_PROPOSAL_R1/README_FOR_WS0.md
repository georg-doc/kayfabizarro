# Graveyard proposal from WS-Media · 2026-10-21

For: WS0 (owner of `tools/kfb-graveyard/postmortems.json`).
From: WS-Media (media-studio session). Released by Georg on 2026-10-21 for handover to WS0.

## What this is
`graves_proposal_r1.json`: 25 new graves in schema `kfb-postmortem-graveyard/v1` (fields: id, date, stone, hover, lesson, trigger, who, size, tags, pattern, source). They cover the FAIL entries from 10 to 21 Oct 2026 that have post-mortems or register entries in this repo but no grave yet. Series are merged into one grave each (triplets; light and clay per tool).

Built by `build_graves_proposal.py`; edit the script, not the JSON. Every grave names its evidence in `source` (commit + path); predecessors are tagged `repeat-of:<id>`. Facts checked against register head 98fb880cb (20 Oct) and the post-mortem commits named per grave. The triggers (ripcords) are proposed wording; most source documents state no question.

## Requests to WS0
1. Review, edit or drop entries, then merge them into `postmortems.json` yourself. Nothing here touches `postmortems.json`.
2. Language: these graves are in English by Georg's decision. The existing graves are German; whether to translate the old ones is your call. The tag `wiederholungstaeter` is kept for compatibility (alias `repeat-offender` if you translate).
3. Keep the numbering low-key; no grave count in titles or zone signage.
4. Credits: Kenney (CC0) is named in `generic-kits-as-landmarks`; the Brackeys smoke texture sits behind `smoke-test-0-pixels`. Please make sure both are in the creator credits register if they appear in the zone.

## Left out on purpose
- FrankenEyes R1 (V-303): part of `runtime-fix-for-model-fault`.
- EyeRig negative image and the figure stop of 14 Oct, 02:29: separate cause, add only if wanted.
- Panopticon diorama (15 Oct): evidence is generated concept images.
- Song length gate on a sensitive deck (17 Oct): honest spec conflict.
- B12 top hat (V-431): consequence belongs to `light-and-clay-per-tool`.
- Coloured 3D shadow trial (19 Oct): not a failure.

## Open contradictions in the sources (not used in any grave)
- F1 lid seam: WS0 reports 1074 to 139 pixels, WS1 reports 920 to 0.
- V-505 and V-506 differ on who required the letter count for fluff words; the grave only states what happened.
- Song pilots post-mortem says nine rounds; one table row is a proposal without a commit. The grave gives no count.
