# BNWN Studio & Game Shows R1 — Format Bible

**Status:** AUTHORING CANDIDATE · text-only · single existing BNWN female presenter · no additional NPC speaker or runtime owner.

## Production concept
The same female presenter cheerfully and sincerely anchors all twelve named formats. These are satirical fictional game shows, quizzes, staged NPC competitions and broadcaster segments, not documentary news or real-world assertions. The absurdity should arise from the content rather than from overtly sarcastic acting. Sponsor slogans and studio links may interrupt the shows.

## Clip grammar
- Exactly eight independent cues per show: INTRO (1), SEGMENT (6), OUTRO (1), plus 12 independent STUDIO_BRIDGES.
- Suggested assembled block: optional INTRO → one or two SEGMENT cues → optional OUTRO. Never require all eight cues sequentially; player-triggered standalone segments remain intelligible.
- Preserve stable cue IDs `BNWN-SHOW-001` through `BNWN-SHOW-108`. Metadata, show headers and IDs are **not spoken**.
- Standard authored gap between clips: `<break time="1.6s" />`. Five explicitly timed dramatic beats inside cues use `<break time="0.45s" />`.
- The tags are the user's requested HeyGen/Hedra-compatible authoring convention from previous TTS workflow; **no claim of measured rendering or timing**.
- Source tone: Georg's uploaded BNWN R3 subtitle transcript, including pre-approved perspectives, pre-bunking, manufactured expert consensus, programmable money, and Consumption/Belief/Obedience. Distinct new stories; no borrowed speaker impressions.

## Show lineup (suggested editorial triggers)
1. **Citizen of the Week** — recognition for loyal NPCs, involuntary awards and self-reporting; suggested `npc_week`.
2. **Who Wants to Be Compliant?** — rigged multi-choice answers; no actual voice callers; suggested `ambient`.
3. **Democracy Deluxe!** — election show in which the result has already been selected; suggested `ambient`.
4. **The Consensus Challenge** — scientific authority relayed through sponsors and preselected panels; suggested `ambient`.
5. **EULA Bingo** — terms-of-service permissions as lottery cards; suggested `ambient`.
6. **Neighborhood Watch-Along** — camera observations and citizen face identification; suggested `npc_witness`.
7. **The Founder Knows Best** — corporate neo-monarchy and tech-managerial governance; suggested `ambient`.
8. **The Price Is Permitted** — programmable spending permissions and food-price quiz; suggested `economy`.
9. **Memory Makeover** — historical-revision TV with before/after showcases; suggested `district_destroyed`.
10. **The Happiness Index** — wellness metrics, behavior dashboards and rewards; suggested `social_score`.
11. **Public Enemy Makeover** — player disobedience rebranded as public enemy or celebrity; suggested `wanted_level_up`.
12. **The Great Normalize-Off** — institutional PR turns disasters into award-winning normality; suggested `building_destroyed`.

## Audience and NPC representation
Use only fictional, prerecorded examples of generic residents. No hardcoded names or new fixed lore. A future NPC-of-the-week selection should come from an already-authoritative game event or resident data, not invented by audio. At present, choosing a prize winner or an audience tally in any clip is fiction in the broadcast, not proof that a dynamic selection has happened.

## Scheduling proposal (not implemented)
- Existing world/game state should issue semantic events, not the narrator. Existing KFB Audio controls AudioContext, radio channel, ducking and output mix. ChatterBox retains resident dialogue ownership.
- With event `building_destroyed`, weight Normalize-Off, Memory Makeover, and unrelated sponsorship; with `wanted_level_up`, Public Enemy Makeover, Watch-Along; with `card_collected`, Citizen of the Week or Public Enemy; with `npc_witness`, Watch-Along or Happiness Index; with inactivity, any show.
- Prevent immediate repeats using a shuffle bag, minimum recent-ID exclusion of ~30 across BNWN pools, and avoid playing consecutive segments from one show by default.
- Optional show block assembled from an INTRO, 1–2 random SEGMENT clips of the same show, OUTRO. Host can interleave BNWN Sponsor Stingers R2 from donor PR #472; no dependency on its merge.
- Use audio-level suppression when an important NPC is speaking; do not run speech in a new AudioContext or parallel radio runtime.

## Next gate
Render one complete master in the established female BNWN voice, check actual spoken performance and sample-accurate cuts before slicing, video work or attaching gameplay triggers.
