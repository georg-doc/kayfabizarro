# KFB Audio & Soundscape Baseline v1 · RETURN

**Date:** 2026-09-24  
**Status:** AUDIO-CAL-01 HUMAN_ACCEPTED  
**Owner:** existing WSA / KFB integration lead  
**Executor:** Fresh Web + GitHub  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `web/kfb-audio-soundscape-baseline-2026-09-24`  
**Draft PR:** `#205` — https://github.com/georg-doc/kayfabizarro/pull/205  
**Base:** `9431dcb8da0158a75d0988d52fc1e7a49aac21f1`

## HUMAN RESULT · PASS

Georg listening result: **PASS** — “klingt sehr gut soweit. passt.”

AUDIO-CAL-01 is now an accepted calibration reference. This does not promote every individual sound to final canon and does not auto-integrate consumers.

## PUBLIC VERIFIED · 2026-09-24

AUDIO-CAL-01 is now publicly verified on the required Cloudflare Stage route.

- publication branch: `cloudflare-live@a8e2af8f79f33b51f638222f203a28f3e1c15b23`
- Cloudflare Pages check: `107727186186` → **SUCCESS**
- Cloudflare deploy completed: `2026-09-24T16:26:22Z`
- Cloudflare preview deployment: `15173f7d`
- public proof workflow: `36025670884`, attempt **3**
- public proof job: `107731456493` → **SUCCESS**
- exact public route: `https://kayfabizarro.pages.dev/kfb-hub/stage/audio-calibration/`
- public Chromium/WebAudio: **31/31 PASS**
- public proof artifact: `10819978496`
- artifact digest: `sha256:49ef9b156efadaced6d257f8768ba553a780a443a6bd13666014781e7a2fd3c2`

The earlier public attempts were timing/observability failures: attempts 1–2 finished before Cloudflare reported the `a8e2af8f…` deployment complete. After the confirmed Pages deploy, the unchanged candidate passed on its first public retry.

Current gate: **HUMAN LISTENING ONLY**. Georg should judge intelligibility, duck amount, event readability and whether the world remains alive across the three calibration states.

## CURRENT OVERRIDE · AUDIO-CAL-01 candidate

AUDIO-CAL-01 is now implemented on this Draft PR as a calibration harness, not a replacement runtime.

- Candidate/runtime head tested: `7013f43a0501c824deb2c5541c1971c2b979a4e6`
- Workflow run: `36024697531`
- Job: `107718140193`
- Manifest/catalog validation: **6/6 groups PASS**
- Browser/WebAudio QA: **31/31 PASS**
- Proof artifact: `10819176933`
- Artifact digest: `sha256:05b9776cc3d501a77360e6ee6660278e1137fb793756aa3a817cb555e2c91012`
- Screenshots: desktop + mobile inside the proof artifact
- repaired `ui-sfx.json`: **16/16** paths now valid
- refreshed shared audio catalog: **1732 actual audio files** = 1687 Audio + 45 Sounds
- Stage source contract: **11/11** referenced assets exist

The three calibration states are implemented: `golden-hour-town`, `graveyard-night`, `ring-performance`.

Automated evidence proves one AudioContext, real asset decode/playback, event wiring, voice-focus ducking and that the diegetic music timeline continues while ducked. It does not prove that the browser TTS voice or final balance sounds good.

Target human route remains:

`https://kayfabizarro.pages.dev/kfb-hub/stage/audio-calibration/`

Historical note: this line described the pre-deploy checkpoint. Current state is **PUBLIC_VERIFIED** per the section above.

## SOURCE

Read and reconciled current GitHub owner state for:

- shared KFB Audio/Sounds pool;
- KFB Chat production workflow;
- Travel audio/narrator owner;
- Race audio returns/recovery;
- Combat semantic/vendored audio;
- Boxel audio-feedback proof.

Dropbox was used read-only to locate mirrored/current handoff material and cross-check older source packages. No Dropbox mutation was performed.

Game Development Studio helper check: `game-dev` unavailable; optional repository-native fallback used.

## INVENTORY RESULT

Fresh Git-tree counts:

- `media/3D_Assets/Audio/`: **1718 blob/file records**
- `media/3D_Assets/Sounds/`: **48 blob/file records**

These totals include non-audio docs/manifests/previews. They are inventory records, not claims of 1766 unique production-ready sounds.

Legacy audited usable pool remains **1006 sounds** for the 2026-09-02 README scope.

Important later material now visible beyond that frozen catalog includes:

- KFB Racer engine assets;
- RoadTrip/Jukebox music;
- more candidate packs / duplicated lineages;
- current game-specific curation and provenance manifests.

## STATIC / SOURCE TESTED

Manifest JSON parse:

- 4 / 4 PASS.

Exact current-tree path validation:

- shared `Audio/sfx.json`: **13 / 13 PASS**
- `Audio/ui-sfx.json`: **0 / 16 PASS** as written
- `Sounds/jukebox.json`: **10 / 10 PASS**

Total exact asset references checked in those manifests: **39**.

The UI failure is systematic and explained: all 16 paths omit the required `kenney_interface-sounds/Audio/` segment.

No audio binary was edited in order to make this audit green.

## EXISTING TEST EVIDENCE CARRIED FORWARD

### Race

- source A6: **139 / 139 PASS**
- tested source: `d459bfea5270e5c7bd5a0916b82b799362c771d5`
- run: `35417064493` attempt 2

Public A6 proof:

- run `35417759627`
- attempt 2: **FAIL**
- failure: deployed-source marker
- browser-driving/audio checks did not run

Therefore no PUBLIC A6 PASS is claimed.

### Boxel

- audio-feedback POC: **8 / 8 browser PASS**
- tested head: `1adbdba8c17b7ef4f1f987197b483ab064c4282d`
- human KFB-wide audio/VFX acceptance remains open.

### Race human decisions preserved

- Audio A1 sonic direction: accepted historically; exact source still missing;
- RoadTrip v2: positive;
- Runner/Shepard direction: positive in later WSA check-in;
- A2 sustained synthetic friction: rejected;
- A3 palettes/patterns: rejected;
- A3 Psychedelic Scratch: rejected.

## ARCHITECTURE DECISION

Do **not** build a universal KFB audio engine.

Use existing owner implementations and normalize only a small semantic role contract:

`VOICE | UI | PLAYER_CRITICAL | WORLD_SFX | DIEGETIC_MUSIC | SCORE | LOCAL_AMBIENCE | GLOBAL_BED`

Primary general donor: Travel.

Additional donors:

- Race: telemetry consumption, radio/music seam, event SFX and authored Runner direction;
- Combat: semantic cue priority/polyphony/spatial/provenance pattern;
- Boxel: cascade/checkpoint/power feedback grammar.

Voice/TTS:

- Travel already proves browser SpeechSynthesis + activity callback + ducking;
- voice activity should control mix focus, not pause music;
- narrator/provider does not own gameplay or the music engine;
- do not canonize an OS-specific voice name.

## POOL GAPS

### Fix first

1. broken UI manifest paths;
2. stale 2026-08-04 audio catalog;
3. placeholder jump/boost/gutter-fall mapping;
4. missing exact Race Audio A1 source package.

### Acquire/curate next only where existing sources fail

1. tyre/skid/friction recording bank;
2. rain/storm/thunder bank;
3. sustained crowd/venue ambience;
4. city/traffic bed/pass-bys;
5. additional loopable machinery;
6. shared character voice-profile metadata/provider fallback.

## NEXT GATE

`AUDIO-CAL-01 · KFB Audio Calibration Stage`

Planned direct route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/audio-calibration/`

Current status:

**NOT CREATED · NOT DEPLOYED · NOT PUBLIC-VERIFIED**

Three required calibration states:

- `golden-hour-town`
- `graveyard-night`
- `ring-performance`

The ring state must specifically test the user's target case:

> Orc-band / loud diegetic music + environmental event/thunder class + addressed FrizzleBob/character speech, with speech intelligible without stopping the music timeline.

## EXISTING DIRECT HUMAN ROUTES

Race audio/music integration evidence surface:

`https://kayfabizarro.pages.dev/kfb-hub/stunt-race/track-environment-lab/?world=facility&seed=KFB-1842&audio=roadtrip-v2`

Boxel audio-feedback donor:

`https://kayfabizarro.pages.dev/kfb-hub/stage/boxel-audio-feedback-poc/`

This audit did not produce a new screenshot or listening result and does not claim either route was re-listened by Georg today.

## OPEN

- repair UI paths;
- refresh catalog + semantic metadata;
- decide minimal AUDIO-CAL-01 asset reference set;
- source/verify missing environment/friction material;
- preserve exact A1 bytes if found;
- then implement and publicly verify AUDIO-CAL-01.

## ONE NEXT GATE

**MUSIC-PERF-01 may proceed as the next independent audio/performance capability; consumer audio integration remains separate.**

Do not spread directly into Racer + Combat + Town simultaneously. First establish one audible cross-KFB mix/voice/ducking calibration surface, get Georg's human listening gate, then let each runtime owner consume the accepted calibration through its existing adapter.


## HANDOFF FILE SET

Changed paths in Draft PR #205:

- `kfb-hub/index.html`
- `skills/chat/START_HERE.md`
- `skills/chat/REGISTRY.json`
- `skills/chat/CHANGELOG.md`
- `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/START_HERE.md`
- `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/INVENTORY_AND_ARCHITECTURE.md`
- `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/RECOVERY.md`
- `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/RETURN.md`
- `skills/chat/workflows/KFB_AUDIO_SOUNDSCAPE_BASELINE_V1_2026-09-24/CHANGELOG.md`

No screenshots were produced because this slice changed documentation/routing only and did not create a new audible/browser Stage.

No merge, Live promotion or runtime deployment is authorized by this Return.
