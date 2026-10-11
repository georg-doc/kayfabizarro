# KFB ChatterBox · Suno Spoken-Music / Stand-up Performance Slice R1
Date: 2026-10-11
Status: **GEORG-REQUESTED ADDITIVE PLANNING + CONTENT PRODUCTION PREP · NO AUDIO GENERATED OR RUNTIME BUILD**
Mode: BOUNDED_SLICE (performance content/voice handoff)
Repo: georg-doc/kayfabizarro
Owner branch: planning/kfb-chatterbox-voice-layer-v1-2026-10-08 · Draft PR #379
Owner: existing KFB ChatterBox / Resident Speech output and voice-content authoring lane
Receiving owner: existing KFB Audio Site (audio clock, buses, ducking), KFB Resident Performance/ToolBox Presenter (body/props), existing ChatterBox/Triplet semantic selection
No second dialogue, AudioContext, mixer, site, rig, or world runtime owner.

## 1. Product outcome and user observation

Georg demonstrated that Suno can produce an engaging spoken adult stand-up monologue with tightly integrated rockabilly backing from a thematic prompt. The 2026-10-11 example used a female philosophical comedian discussing Foucault, Deleuze and Derrida, subsequent ideological/institutional appropriation, pop culture and conspiracy allegories. Georg liked the auditory performance, but judged many individual jokes as AI-slop. Therefore the objective is **high-grade, source-aware scripted comedy PLUS expressive music staging**, not automatic promotion of AI-written jokes.

Primary new use case: a KayKit juggling Clown performs 60–120-second thematic spoken-word stand-up sets. Extensions: philosophic two-person exchanges, satire, resident introductions, deck-reactive stage interludes and brief radio/stage performances.

This is a **pre-rendered performance-content family**, not a substitute for interactive ChatterBox turn-by-turn responses or canonical Triplets.

## 2. Mandatory source/ownership pins (inspected on existing branch)

- Current Voice owner entry: skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/START_HERE.md and RETURN.md; same PR #379. Latest owner Voice result before this slice: existing private KFB Audio GPT Site Source 0.5.1, source-bound Triplet audio R1, 51/51 owner + 151/151 Site validation reported. Keep previous human listening gate open; do not claim any new listening.
- Current ChatterBox Triplet Stage donor: tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/HANDOVER_WSA_CHATTERBOX_TRIPLET.md. Semantic authority remains subject / connector / reframe, with valid silence. KFB performer can cite accepted Triplet source IDs without rewriting the pool.
- Existing performance owner: tools/KFB-ToolBox/_handover/PERFORMANCE_SUITE_2026-09-15/START_HERE.md. Presenter Stand-up, right-hand microphone, gesture/punchline/settle, seated option and rig-family QA are existing proposals, not finished game features.
- Clown 3D donor: media/3D_Assets/KayKit_Mystery_Series6/11 - May 2024 - Clown/characters/Clown.glb (tree blob 9d5db2f3a00694b49c6ba182a3b51ebd370f09c8).
- Juggling props: same package /assets/gltf/juggling_pin_blue.gltf (blob ee29969e7d46502ce45f89b44c6f6077f0c5153a); juggling_pin_green/red/yellow and clown_ball.gltf are also listed. Same package /assets/gltf/circus_podium.gltf (blob f25a76577cef3bc850f381f661b40403412d0f68).
- Asset tree listing is **NOT source-object isolation**. Before any 3D-stage integration, show original Clown, props, mic and rig motion independently, then validate donor contact, attachments and the joint composition. No generic substitutes.
- Existing KFB Audio is the sole playback/mixer/ducking owner. The existing private Site is https://kfb-audio.frizzlebob.chatgpt.site ; this planning document does NOT deploy or change that Site.
- Existing Studio ChatterBox Triplet PR #357 remains HOLD/TUNE and is not reclassified as finished runtime.
- WB2 Island R4 remains STOP / NO MVP; Four-Island A/B visual gate remains unchanged. No world R5, merged PR or Live.

## 3. Product modes: two authoring lanes, one accepted asset family

**A. Prompt-to-Performance (discovery / cheap audition)**: short subject + philosophical angles + protagonist/worldview + opponent + comic stakes + pop culture reference + stage tone + musical identity. Let Suno invent lines. Audition in Suno without downloading; use promising takes as mood/timing ideas; script may not be retained as source truth unless a human transcripts/edits and explicitly accepts it.

**B. Script-to-Performance (preferred for production)**: human-curated exact English script with stage beat markers, performance voice direction and separately specified musical style. Use Suno Custom lyrics and Styles fields; insist on spoken, not sung, and natural pause windows. The model may still mutate/omit/repeat words, sing, overplay the band or miss transitions: therefore transcript/speech intelligibility comparison against the locked script is mandatory. Failure -> regenerate or curate, not fake an exact-match pass.

The authored script can be sourced from a Card, a Triplet, an accepted Resident point of view and current scene, but a 2-minute monologue is **not** itself a new Triplet. Keep the source IDs, approval status and any transformations explicit. A candidate Triplet stays AUTHORING_CANDIDATE and never becomes game canon merely by appearing in music.

The final exported mixed audio is a **program-mixed asset**: voice and music may be inseparable. Existing KFB Audio must not overlay a second identical bed or pretend it can duck music *inside* the mixed clip. Other game beds/SFX may still be ducked by existing KFB Audio; voice priority and captions stay readable. Optional stems must be separately verified before claiming isolated voice/music channels.

## 4. Spoken-performance composition / anti-slop acceptance

Target first sets: 60–120 seconds, roughly 125–250 **actually spoken** English words, adjusted to audible pace, band stingers and laugh holds. Start at 75–100 seconds for the Clown POC, not a full 5-minute sketch.

Writer's room rhythm: one concrete situation → opposing interpretation → 2 or 3 escalating material consequences → an actual reversal → economical callback/outro. An argument must have observable stakes and an actor changing tactics. Prefer material specificity, behavior and surprising causality to vague labels, puns, slogan repetition and safe generic HR/Zoom/compliance jokes. No mandatory 4th-wall AI references, no formulaic moral summary.

Quality gate per set: (1) coherent philosophical/thematic claim, (2) speaker's particular motive and worldview, (3) at least two earned, distinctive comic turns, (4) audible naturalness, (5) sound bed complements without swallowing words, (6) one memorable callback, (7) actual stage-action cues that the existing rig *could* support, (8) no invented source quote presented as genuine. Contested interpretations may be staged as opinion/satire rather than falsely attributed direct quotes.

Do not call an unreviewed Suno take GOOD/PASS because the voice is charismatic. Evaluate **text quality and performance quality separately**.

## 5. Cue and media mapping (proposal, no new player/runtime schema)

One content record can reference: performanceId, title, owner, cast/source actor refs, mode (prompt|script), topics/cardRefs/acceptedTripletRefs, worldview/register, scriptRevision, lockedTranscript, musicStyle, intendedDuration, audioRef or private Suno audition link, immutable outputRevision/hash, rights/use status, sourceStatus, humanContentVerdict, humanAudioVerdict, and staged cue offsets.

Cue types to hand to existing performance owner: ENTER, JUGGLE_LOOP (only after compatible rig/prop proof), LINE, EMPHASIS, PUNCHLINE_HOLD, BAND_STING, REACTION, SETTLE, EXIT. Cues are human-authored approximate stage intentions initially; **do not claim Suno produces trustworthy word timestamps, visemes or clown animation**. Musical downbeats are not a reliable timestamp source without validation.

Recommended presentation: captions/full transcript always available; scripted performance can be replayed/cancelled; interactive ChatterBox resumes normally afterward. Stop or mute does not fabricate a conversational reply, Card claim or quest reward.

## 6. Two ready-to-audition Suno inputs (no downloads now)

**A1 · Prompt-first / content exploration:**
Title: The Clown Who Read the Fine Print
Style / performance direction: English spoken-word stand-up, dry razor-sharp adult clown comedian, fast yet perfectly intelligible delivery, vintage rockabilly trio, upright slap bass, clean twang guitar, brushed snare, witty short stop-time stingers, intimate cabaret mic, band low under every spoken line, energetic introduction, little instrumental air after actual punchlines, no sung chorus, no background vocals.
Topic / writer direction: A juggling clown demonstrates how public trust, dissent and surveillance become tools for institutions and platforms. Use three real juggling pins as recurring onstage consequences, not as arbitrary symbols. Distinguish Foucault's analysis of disciplinary power, Deleuze's control-society argument and Derrida's deconstruction rather than treating them as identical. Satirize how later institutions sell certainty as dissent. Build 3 genuinely escalating reversals and a tight final callback. Specific observations over office clichés. Avoid invented philosopher quotations, cheap conspiracy punchlines, moral lectures and generic AI humor. Target 75–100 seconds.

**B1 · Script-first / high-control style:**
Style field: "English, spoken stand-up monologue, mature sardonic feminine comic voice, quick conversational clarity and dry precise pauses, 1950s rockabilly jazz-trio underscoring, walking upright bass, brushed kit, restrained hollow-body guitar, tiny band stabs only BETWEEN clauses, stage-microphone warmth, no singing, no duet, no repeated chorus, no instrumental over speech, 85–105 second set."
Custom Lyrics field: paste a separately approved 170–210-word English script in short paragraphs. Add sparse [Spoken Word], [Band Break] and [Pause] labels **as experimental model cues**, not guaranteed parser commands. Compare audible transcript to source; do not call it exact if Suno revises it.

Later style audition matrix: rockabilly / noir jazz / vaudeville brass / desert western / quiet orchestral or ambient comedy. Change **one independent variable** at a time for informative A/Bs; don't generate every style × every speaker.

## 7. Download-credit and production budget

Suno help (current published policy, 2026-09): Pro 20 monthly downloads; Premier 60 monthly downloads; allowance depends on the user's actual plan, so DO NOT assume 60 is available to this slice. Already-downloaded song re-downloads or multiple formats including stems do not consume a new additional allowance; unspent monthly allowance does not roll over. Listening/sharing within Suno is not the same as downloading, and generation credits are separate.

Official references:
- https://help.suno.com/en/articles/13876865
- https://help.suno.com/en/articles/13926209
- https://help.suno.com/en/articles/13876929
- https://help.suno.com/en/articles/9601665

**Conservative shared-budget proposal, subject to Georg allocation**:
- Discovery: 4 candidate auditions IN Suno, 0 downloads.
- First acceptance set: maximum 2 selected exports: one Clown prompt-first vs one curated script-first.
- If Georg keeps the format: up to 8 further shortlisted exports in this *shared KFB music* budget, not 8 automatically spent.
- Reserve the rest for the existing RoadTrip/Jukebox, Soundscape and other music plans.
- Track actual generation credits separately from download usage; no assumptions about remaining balances.

Rights: capture plan/subscription state at creation/export, source authorship, Suno output link, download receipt, license/commercial permission and human acceptance. Suno describes commercial use rights for paid downloaded original works, but not guaranteed copyright protection. No public/game use before rights and source review.

## 8. Definition of done and deferred integration

**This R1 planning checkpoint is done when**: exact owner branch spec + evidence/report + Return read back, private KFB Production Control Inbox copy available, no Site/deployment claim, and exactly one next gate.

**Next bounded useful POC**: a script-vs-prompt **same-topic Clown A/B audition** using the existing performer donors and KFB Audio listening bench; no automatic audio generation. Georg compares COMEDY KEEP/TUNE/CUT separately from SOUND/ACTING KEEP/TUNE/CUT. Only then integrate a kept mixed piece into the existing performance/audio receiving owners with correct captions/cue provenance.

Deferred: actual Suno exports, transcription, sample-level beat analysis, expressive rig/juggling/microphone verification, LipSync, dynamic dialogue-to-Suno, card-triggered game runtime, reusing in-game fixed dialogue as responsive NPC speech, new Stage/public URL, Site product UI changes.
