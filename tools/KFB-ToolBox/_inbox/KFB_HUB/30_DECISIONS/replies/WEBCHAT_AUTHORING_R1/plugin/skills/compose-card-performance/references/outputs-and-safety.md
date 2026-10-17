# Output contracts, proof states and handoff

## Default copy-ready spoken performance
User-facing English plain text, no pseudo-JSON for Suno. Separate **Lyrics/Speech** and **Style**. Card titles unchanged, one main sentence per Card whenever compressing. All Cards represented at full-deck scale, no surprise omission or unsupported new Card. Last spoken line `Stay Fluffy!` on *Card Performances only*. `Welcome, dear Fluffheads!` optional opening that can adapt to chosen character.

## Audio Site import JSON
Current Site `card-performance.js` importer explicitly accepts `kfb.audio-site.card-performance-draft/1` only and overwrites `draftStatus` with `LOCAL_EDITORIAL_DRAFT` and `outro` with `Stay Fluffy!`. The app copies these keys:

`draftStatus`, `sourceRepo`, `sourceRef`, `sourceRevision`, `contentRevision`, `fetchedContentSha`, `performanceId`, `performanceStatus`, `deckId`, `speaker`, `storyMode`, `seed`, `selectedCardNumbers`, `lines`, `bridgeDrafts`, `intro`, `bed`, `delivery`, `rate`, `pitch`.

`lines` maps Card number strings to source-derived Card utterances. `bridgeDrafts` uses keys `17>18` and includes `fromCardId`, `toCardId`, `relation`, `text`, `cost`, `callback`, `sourceRefs`, `editorialStatus`, `provenance`. An import file is a **local draft**: it does not increment the Site's GitHub preview feed revision or make a permanent canonical save. If Site user wants the draft in GitHub and reloaded as a preset, use ordinary GitHub connector to update the explicit current feed with safe current `source` hashes and user approval; do not unilaterally replace another person's pending r3 listening test. In current build, the Site browser has **no direct authenticated GitHub write** and no fake Save to cloud; use export + connected Github workflow.

## Preview feed vs draft
Example current feed path, dynamically re-check ref/head on every task:
`skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/data/KFB_AUDIO_SITE_CARD_PERFORMANCE_FEED_R1_2026-10-12.json`
- Source identity, `contentRevision`, `canonicalDefault`, `performances` array and exact 4 `source` SHA pins.
- `r3 audio-site-preview-r3-card-11-tune` is HUMAN-LISTENING PENDING as of 2026-10-12 (may evolve). Protect until user explicitly authorizes next preview/default; don't make a new feed simply because a separate candidate file was committed.
- Audio Site reload fetches current explicit preview via public GitHub Contents API and validates pinned source sha. Future regular content updates need no Work/Site redeployment but still need genuine feed update if they are to appear through Reload.

## Verification matrix
Before saying valid, check at least:
1. Every ID exists in exact current source; titles exact.
2. Relevant power/lore anchors really exist and source nulls are handled.
3. Page source mapping verified if called a page.
4. One Card utterance vs Bridges clearly separated.
5. Bridges semantically causal, original Card mechanics not changed.
6. All expected Card IDs covered, if full deck.
7. `Stay Fluffy!` as final spoken line; intro optional.
8. Suno limit measured for the actual text (including optional tags); do not invent time.
9. JSON Site draft schema, stable source revision and statuses correct.
10. Human approval, actual audio rendered and real Site playback are independent gates, never inferred from syntax.
11. GitHub branch HEAD and files actually retrieved following a write. Timeouts are UNKNOWN until inspected.
12. No Suno transmission/paid model calls claimed unless an actual connected provider tool succeeds.

## Exact recovery pointers
- Voice PR #379 branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`, latest project Return (re-read).
- Audio PR #365 branch `web/kfb-adaptive-music-stem-proof-2026-10-06`, existing Site Source `0.6.0` Version `9` at 2026-10-12 (re-read/verify before claims).
- Existing KFB Production Control can store checkpoints/proof; not daily navigation or a replacement database.
- Existing KFB Audio site `https://kfb-audio.frizzlebob.chatgpt.site/`; no new Site.
