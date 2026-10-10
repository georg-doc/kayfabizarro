# KFB ChatterBox Voice Acting / Casting Bench R2

Date: 2026-10-10  
Status: **IMPLEMENTED + VERIFIED ON EXISTING PRIVATE KFB AUDIO SITE · HUMAN LISTENING OPEN**  
Owner: **KFB ChatterBox / Resident Speech output**  
Receiving surface: **existing KFB Audio GPT Site** (`appgprj_6ac1c73dc28881919123106bd6d3e90e`)  
Protected boundary: no second dialogue owner, Site, AudioContext, mixer, Resident state owner or final story-mode mapping.

## Product outcome

The existing KFB Audio Site gains one `Voice Acting` tab. It is an additive listening and casting surface for the current PR #379 Voice owner.

The choice of surface is deliberate:

- the Site already owns the one browser AudioContext;
- it already exposes the real D conversation bed and speech-focus ducking;
- it can compare voice solo versus voice over bed without copying the mixer;
- ChatterBox remains the source of text, source IDs and casting decisions;
- KFB Audio remains the source of audio buses, clock, bed and ducking.

This supersedes the older generic “do not create a Site” wording only for the explicitly authorized additive use of the **existing** KFB Audio Site. It does not reopen the held PR #357 ChatterBox product Site and creates no duplicate Site.

Published evidence:
- production URL: `https://kfb-audio.frizzlebob.chatgpt.site`;
- Site source commit: `86e8a77810351e992e073c48d8596263357029b0`;
- Site version: `appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_fb9dcfe50fe88191a16097759a287686`;
- deployment: `appgdep_6ac9cb6f5a8c819190a2721a64318f64` (`succeeded`);
- exact live marker: `SITE SOURCE 0.4`;
- static validation: `87/87 PASS`;
- live browser console errors observed: `0`.

## Implemented user loop

1. Choose one of the six canonical Story Modes as an **editable acting-direction candidate**.
2. Choose a Resident audition candidate, Resident Affect candidate and provider acting hint.
3. Edit a three-beat English Triplet while keeping a stable source ID.
4. Choose an English browser voice plus rate/pitch.
5. Play voice solo or over the real D conversation stem bed.
6. Toggle routing through the existing ducking path.
7. Observe exact visible text and word-boundary highlighting where the browser emits boundary events.
8. Queue the take for Piper English, eSpeak NG English or ElevenLabs.
9. Import existing audio clips and retain provider/source/Resident/mode/Affect metadata locally.
10. Export the render queue or the full session/SSOT mapping without a GitHub edit or Work call.

Browser-local state is intentional for R2: editable settings use local storage; audio blobs use IndexedDB. This makes the bench directly user-operated after publication while avoiding premature canonical promotion.

## Six Story Modes · candidate mapping only

The canonical modes remain:

1. Tragic
2. Comic
3. Absurd
4. Heroic
5. Mystical
6. Forbidden

Each currently offers three Resident Affect candidates and three provider-direction candidates. These are audition seeds, not truth. The exported session says `mappingFinal: false`; provider tags never become ChatterBox state.

Exact machine-readable mapping:
`data/VOICE_CASTING_BENCH_R2_CONTRACT.json`.

## Piper, eSpeak NG and browser findings

- Browser `speechSynthesis` is the only immediate, zero-install interactive English route on the current static Site. Voice availability differs by device, so browser voice identity is test metadata rather than accepted casting.
- Piper is a build-time/offline renderer in the current KFB donor. English output should use an English model such as an `en_GB` or `en_US` voice. `de_DE-thorsten_emotional` exposes useful emotional speakers but remains German and is not treated as an English production voice.
- eSpeak NG has an upstream Emscripten browser port, but that path is old and GPLv3. R2 therefore records it as an optional audition/build route rather than silently adding a remote CDN/runtime dependency.
- Neither `piper`, `espeak-ng` nor `ffmpeg` was available in the current local execution environment. R2 exports a render queue instead of pretending synthesis ran.

## ElevenLabs integration and security

R2 implements:

- ElevenLabs clip ingestion;
- voice/model/acting candidate metadata;
- provider-neutral render-request export;
- a status check for a future same-Site secure bridge;
- a clear unconfigured state instead of asking for a key in the browser.

R2 does **not** expose or collect an API key client-side.

The live bridge must use a Sites runtime secret and server-side calls. Minimum controls:

- signed-in private Site user;
- restricted/credit-limited key;
- allowlisted voice and model IDs;
- per-request character cap and per-session/day budget guard;
- exact source ID, text revision, voice, model and settings cache key;
- stored alignment from `with-timestamps` when generated;
- no key in source, browser storage, logs, exports or error messages.

ElevenLabs officially provides character-level timing through `POST /v1/text-to-speech/{voice_id}/with-timestamps`; available voices and models must be queried rather than hardcoded permanently. The final live provider remains optional.

## Bubble, talk animation and performance events

R2 emits:

- `kfb:voice-focus` for existing ducking;
- `kfb:voice-beat` for text/bubble timing;
- `kfb:talk-animation` with `TALK_LOOP_NO_LIPSYNC`.

This is intentionally not viseme lip sync. It is enough for the next integrated test of voice + streaming bubble + bed + simple character talk motion.

No placeholder actor is shown. A real character stage must reuse the accepted Resident Atlas, EyeRig, PetMouth and choreography donors after their current gate opens.

## In-world Maker Space / God Mode direction

The long-term product is not a collection of unrelated meta pages. The same bench contract can become an in-world holographic Maker-Space / God-Mode module:

- order one or two real Residents into a Speaker Corner;
- select source Triplets, voice/casting candidates and bubble skin;
- play a shared timeline;
- inspect eyes, pupils, lids, gaze, mouth talk-loop, pose, gesture, spatial stance and partner relation;
- record KEEP/TUNE/CUT plus timing notes;
- export receipts back to the owning systems.

The studio only composes and measures. ChatterBox, Audio, Bubble, EyeRig, PetMouth, Pose/Choreography and World keep their existing ownership.

## Explicitly deferred

- live ElevenLabs generation until a secret is configured and the static Site has a guarded server bridge;
- Piper/eSpeak rendering until a renderer environment is available;
- real 3D Resident stage until the accepted donor gate is open;
- viseme lip sync;
- final Resident casting;
- final Story Mode → emotion/direction mapping;
- automatic promotion of any imported clip or Triplet.

## One human gate

On the published existing KFB Audio Site, Georg auditions at least one English browser voice in `Voice Acting`:

- voice solo;
- voice over D bed with ducking off;
- voice over D bed with ducking on.

Return `KEEP / TUNE / CUT` for the bench interaction and the chosen voice/preset as an audition result only.
