# WORK/WSA ONE-SHOT · COZY TUNES PRIVATE MIGRATION + QA + DELIVERY + CLEANUP

Date: 2026-10-08
Mode: ONE_SHOT
Executor: ChatGPT Work/WSA
Goal: **one Work run only** for the Pizza Doggy Cozy Tunes pack.

Georg must not be asked to upload the tracks again.

## Read first

Current GitHub versions:
1. `skills/chat/START_HERE.md`
2. `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`
3. `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`
4. Audio PR #365 current head
5. `COZY_TUNES_PRIVATE_MIGRATION_MANIFEST.v1.json`
6. `COZY_TUNES_PUBLIC_CLEANUP_LIST.v1.json`
7. `COZY_TUNES_CREDITS_AND_DELIVERY_CONTRACT_2026-10-08.md`
8. `cozy-tunes-classics-pool.v2.json`

GitHub state wins.

## One continuous outcome

Complete ALL of the following in the same Work run:

### Phase 1 · Private binary copy
- clone/fetch public `georg-doc/kayfabizarro`;
- clone/fetch private `georg-doc/KFB-Travel-Globe`;
- copy exactly 24 OGGs from manifest;
- preserve filenames and bytes;
- add the prepared README content;
- verify 24/24 filename + byte size + SHA256 source/private;
- commit/push private source according to Travel repo rules;
- fetch exact private head and intended files.

No LFS migration is required for this pack unless the target repo's current policy has changed. Largest file is <20 MB.

### Phase 2 · Technical/audio QA
Using the verified private source:
- browser/WebAudio decode all 24 OGGs;
- duration, sample rate, channels;
- peak/RMS or existing KFB loudness metric;
- detect obvious decode/zero/silence failures;
- listen/classify each cue;
- assign conservative Audio-owned role tags such as day/cozy, roam, forest/nature, dusk/night, dreamy, POI/discovery, classical/novelty only when listening supports them;
- test crossfade into/out of C/M/N/O;
- per-track PASS/TUNE/HOLD.

No BPM invention if not measured/needed.

### Phase 3 · Catalog/runtime
- update the public metadata catalog using assetKey identities;
- artist everywhere = `Pizza Doggy`;
- collection = `Cozy Tunes - The Classics`;
- credit URL = official itch page;
- approved tracks become optional `MASTER_ROTATION_POOL` entries;
- do not replace C/M/N/O adaptive stems;
- World continues to send context/events only.

### Phase 4 · App/Site delivery seam
Prove one actual deployed-playback route without exposing private GitHub credentials.

Preferred:
- authorized build/publish copies selected private source assets into the existing KFB Audio Site/app artifact or approved media layer;
- runtime resolves assetKey → deployed URL.

Requirements:
- no private GitHub token in browser;
- no client-side private raw URL;
- title + Pizza Doggy visible in Jukebox/Radio metadata surface where that existing surface supports it;
- do not redesign the existing KFB Audio Site;
- update the existing Site only if necessary for the playback proof; never create a second Site.

### Phase 5 · Public current-tree cleanup
ONLY after private copy and playback/source proof:
- delete exactly the 24 OGGs listed in cleanup manifest from the current public tree;
- keep README/catalog/provenance metadata public;
- verify current public folder no longer contains the 24 raw OGGs.

Do NOT history-rewrite `kayfabizarro`.

### Phase 6 · Credits contract
Ensure reusable metadata supports:
- Abspann: `Music: Pizza Doggy · Cozy Tunes`;
- Jukebox/Radio: `<Title> — Pizza Doggy`;
- HUB ticker: artist `Pizza Doggy`;
- Third-party credits link.

Do not mutate Production Hub merely to prove this metadata. HUB consumption can occur through its existing data path later.

## Existing Audio invariants

Preserve:
- one AudioContext;
- one music owner / MusicClock;
- G/D/C/M/N/O verified behavior;
- TTS ducking ownership;
- no track IDs/BPM/stem gains in World.

## GitHub checkpoint budget

Exactly three meaningful checkpoints where possible:
1. private migration + implementation;
2. QA/evidence + public cleanup;
3. final Return.

After every write: refetch exact head + intended files.
Timeout = UNKNOWN until inspected.

## Final Return

Return:
- exact public source pin;
- exact private repo/branch/head;
- 24/24 migration hashes;
- README/provenance;
- 24-track decode/listening table;
- approved/TUNE/HOLD track list;
- catalog/runtime changes;
- actual playback proof;
- visible artist/credit proof;
- public raw-tree cleanup proof;
- explicit note that history was not rewritten;
- changed files;
- unresolved items;
- one next gate.

No separate Work follow-up should be required for this pack unless a real external blocker is discovered.
