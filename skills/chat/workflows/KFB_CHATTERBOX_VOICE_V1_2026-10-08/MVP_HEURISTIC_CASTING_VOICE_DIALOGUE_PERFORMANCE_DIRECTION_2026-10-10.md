# KFB · MVP Heuristic Voice Casting + Resident Conversation Performance Direction
Date: 2026-10-10
Status: **GEORG DESIGN DIRECTION · SOURCE-BACKED PREPARATION ONLY · NO GAME RUNTIME / NO NEW SITE**
Owner: **existing KFB ChatterBox / Resident Speech output**, Draft PR #379, branch `planning/kfb-chatterbox-voice-layer-v1-2026-10-08`.
Receivers: KFB Audio PR #365 for mix/clock/duck; Resident Life/Affect for state; ChatterBox Kernel/Triplet pool for content/selection; Bubble/PetStudio for outline, EyeRig/PetMouth and Resident Performance for body/face; WB2 World runtime only after its separate gate.
Current world restriction: Four-Island Story Vision A/B (visual-only); WB2 R4 STOP / NO MVP / NO R5.
Current Site: existing private KFB Audio `Voice Acting` tab. This document may be mirrored into **existing KFB Production Control Site's private Inbox**. Do not claim KFB Audio product Site updated by documentation alone.

## 1. Georg's new steering (2026-10-10)

- He reports that **the current Voice Acting experience works very well**. This is positive usability feedback, **not a KEEP verdict for specific voices or audible model/clip choices**.
- **Heuristic MVP-first casting authorized as a proposal/preparation direction**: match existing voice options to actual visible character identity, initially perceived male/female voice lane and then age, timbre, register, tempo, acting/affect and narrative role. Leave every mapping editable; Georg will fine-tune later rather than block the initial MVP on full casting review. A character can deliberately use an incongruent or non-gendered voice; character identity ≠ TTS voice classification.
- He wants optional spoken player→NPC conversation, including named BINGO/BOGGLE/BONGO and BLÖDSINN escape without clicks, and later free speech→LLM→KFB source-aware semantic Triplet response, with movement remaining normal controls.
- He wants natural wait/thinking idle behavior, three gently scaling/bobbing dots (visually related to the current thought-tail dots), an audible Talking Loop, mouth + gesture + eyes/lids/pupils/brows and reasonably coherent bubble text streaming/voice/bed ducking.
- Long-term maker-space God Mode = **in-world holographic conversation/staging editor** reusing existing modules and real Resident objects, not a second dialogue/3D runtime.
- New concepts remain flexible design candidates; do not convert approximate style/heuristics into rigid universal canon.

## 2. Why reuse is viable: verified source/donor inventory

| Source at check time | Status and exact relevance |
| --- | --- |
| `skills/chat/workflows/KFB_CHATTERBOX_VOICE_V1_2026-10-08/runtime/real-pool-adapter.js` @ blob `011f3a96975bd66ed2aaca219577e6108b893f42` | 166 source ID donor records previously counted; sourceRefs/sourceRevision and AUTHORING_CANDIDATE preserved; thoughts default silent; `voiceAssetKey` must still include renderer/recipe/version/rights for production cache |
| `data/VOICE_CASTING_BENCH_R2_CONTRACT.json` @ blob `11a8f2965d5a1d0ab83f55fbce0ba405848662a3` | Current private Site supports editable Triplet, 6 provisional story modes, browser voice audition, real D bed/ducking, clip intake/export, beat/focus/talk events; no proved native Piper/eSpeak renderer or live ElevenLabs |
| `data/NEXT_MVP_VOICE_PROOF_R1.json` @ blob `5f2f299f96bdeb68322dacc4600979731b8aba0f` | Known MVP actors Demon Lord / Robot One / Farmer A, optional Lorekeeper, source asset refs, silence + muted transcript + one Social Call acceptance |
| `tools/resident_atlas_s6/data/cast.js` @ blob `5e918ae1521e63d121558fb7aff4fd1f8239baec` | Actual source Resident objects, Farmers A/B, Lorekeeper, Witch; **candidate-only** status is not promoted by voice casting |
| `skills/KFB PetStudio/bubble/bubble.v1.js` @ blob `da7fe114c04c1a3fe7c303a195c8a8ac84fdefa4` | Actual speech outline/tapered arrow, thought blob, two thought-tail circle points, whisper dash, pinned/stable bubble and full-text geometry before reveal; **source read**, original visual donor isolation/browser proof still outstanding |
| `tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/HANDOVER_WSA_CHATTERBOX_TRIPLET.md` @ blob `4dbc7be8e9feea5703386bfbd1b454ca3ac94aab` | ChatterBox Kernel `prepareResidentTurn`, current BINGO/BOGGLE/BONGO/BLOEDSINN operator labels, three block Triplet stage `flip-stagger` donor, silence valid, bubble anchors; candidate stage handover not a promoted engine |
| `skills/chat/RESIDENT_PERFORMANCE_EVENT_CONTRACT_PREP_2026-10-06.md` @ blob `79fc0951de708323fdf527e723f008ca4ce96426` | Eight channels: base, relational pose, gesture, micromotion, face, emanata, bubble, audio; event/priority owner boundaries remain intact |
| `skills/chat/BLENDER_MCP_RESIDENT_PERFORMANCE_CHOREOGRAPHY_PREP_2026-10-06.md` @ blob `7e8e186ab511d376e918c849b1c3e78303726b47` | Existing Rig_Medium/Large, EyeRig v6, PetMouth, pose/motion donor; source isolation / COVERED-LAYERABLE-NEW_CLIP_REQUIRED before authoring animations |
| `skills/chat/workflows/KFB_RESIDENT_PERFORMANCE_CHOREOGRAPHY_369_2026-10-07/addendum_eyes/HANDOVER_EYE_RIG_SSOT.md` @ blob `20a9af414a5f3e29258636bc4443aef716923984` | Important open issue #375: final per-character EyeRig SSOT is not built; never overwrite tuned eyes with generic face rig when staging |

The ChatterBox Studio donated a three-part `flip-stagger` reveal; that is **not** an instruction to force a typewriter effect. Existing Pet Studio bubble geometry must not be replaced by generic DOM rectangles. Note two source-specific anchor heuristics: Pet Studio's 44px dead zone vs ChatterBox stage's 14px head anchor tolerance. These belong to different hosts; benchmark both on the actual receiver instead of mixing constants.

## 3. Heuristic casting for audition and first MVPs (not final canon)

The provisional selection uses *perceived acting lane* `masculine | feminine | synthetic/other` only to filter available voices; it never writes biological sex, Gender, Resident Affect, or speaker identity. Scoring/choice is simple, editable and grounded in actual voice inventory, character design/role and audible fit. No absolute rule: age/gravitas, clarity, comic timing, social position, voice contrast within a scene, and intentional subversion are legitimate override criteria.

| Actor / exact Resident donor | Starting audible direction | Priority | State |
| --- | --- | --- | --- |
| **Demon Lord / `demon-lord`** (Rig_Large, Dystopia) | Lower-pitched/dark/resonant masculine audition; commanding but intelligible; alternative dryer/deadpan villain version | MVP required | Candidate voice preset `demon_lord`; no specific engine voice accepted |
| **Robot One / `robot-one`** (Rig_Medium, Utopia) | Controlled synthetic articulation, precise pauses and slight mechanical profile; can be neutral/feminine/masculine voice color, not forced deep male | MVP required | Candidate `robot`; use actual provider audition |
| **Farmer A / `farmers` + `farmer_a`** (Rig_Medium, Protopia) | Warm, grounded adult conversational delivery with clear readable tone; provisional lower-middle/masculine **audition**, source visual does not prove a gender assignment | MVP required | Candidate `farmer`; contrast optional Farmer B only after a separate source sample |
| **Lorekeeper / `lorekeeper`** (Rig_Medium) | Older/"grandpa" warm, weathered, slightly airy but articulate; patient tempo; should not be a tired generic wizard stereotype | Optional MVP | Candidate `lorekeeper`; user-observed bald/grey-bearded look is design steering, not independently rendered here |
| **Witch / `witch`** (existing Atlas candidate) | Feminine/mature/witchy **audition contrast** with clear, characterful timing; avoid caricature voice as default | Optional voice-lane comparison | Candidate `witch`; outside 3-actor MVP requirement |

Candidate machine-readable companion: `data/MVP_HEURISTIC_VOICE_AUDITION_CANDIDATES_R1.json`. Runtime/voice model choice depends on actual English voices and rights. Allow `GeorgOverride`, KEEP/TUNE/CUT and attribution; do not bulk-generate 12 voices or freeze six Story Mode→emotion mappings. This MVP approach **defers detailed human tuning**; it is not a human-accepted final casting set.

## 4. Voice input: incremental and reversible, not Speakrail-dependent

**First helpful voice-control path:** explicit on-screen mic-enable/permission; push-to-talk or tap-to-speak with a visible armed/listening/transcript status. An optional voice activity detector (VAD) can automatically open/close turns after opt-in, with silence padding, false-trigger handling and deterministic cancellation. Never imply an always-on microphone. Preserve click/keyboard/operator choices and all source-backed visible bubbles.

**Two input classes stay distinct:**
1. **Operator lane:** recognized `KayfaBINGO!`, `KayfaBOGGLE?`, `KayfaBONGO!` or `BLÖDSINN!` → resolve against existing operator ID/meaning/exit handler (not newly invented dialogue semantics). Confirm ambiguous recognition rather than trigger accidental leave. Avoid detecting the same command from the game's speaker output; echo suppression + talk gating.
2. **Free speech lane:** ASR final transcript (with user correction), world/Resident/Card context and social relationship → bounded LLM interpretation/selection. The current ChatterBox/Triplet semantic owner returns one **real source-backed** `subject/connector/reframe` turn or valid silence. If an LLM invents a new Triplet, label it `DYNAMIC_CANDIDATE` for preview/review, not accepted canonical pool content. The spoken player's verbatim words must not silently be replaced by a profile-selected reply without revealing the transformation.

**Minimal staged rollout, all conditional:** A) operator voice commands under explicit mic toggle; B) free-form ASR-final → one LLM orchestration/Triplet-selected NPC response; C) interruption/barge-in and full-duplex when measured useful. Never insert a second ChatterBox kernel, TTS engine or mic ownership. Speakrail is **only** a separate possible timing/turn-taking donor, not mandatory or equivalent to Resemble Chatterbox-TTS.

The Web Speech API is not a universal offline solution; browser speech recognition support and cloud/on-device path differ (MDN). Require capability check, microphone disclosure, permission failure and typed fallback. Do not silently send private microphone content to unapproved service; any cloud ASR is a separately reviewed optional provider.

## 5. Conversation/presentation state progression (proposed events, not a new dialogue owner)

```
IDLE / ENCOUNTER
    → USER_ARMED / LISTENING (after opt-in)
    → PARTIAL_TRANSCRIPT (provisional; no dialogue commit)
    → USER_TURN_FINAL (or operator-confirmed)
    → NPC_PROCESSING (LLM/source-selection in flight; NPC "thinking" idle)
    → SPEECH_PREPARING (Triplet chosen, TTS asset/stream buffered)
    → NPC_SPEAKING (real playback start; bubble reveal + talk loop)
    → NPC_SETTLE / AWAIT_USER (playback end, duck restored)
    → IDLE / ENCOUNTER
```

Alternative branches: `SILENCE` is a valid semantic outcome; `CANCELLED`, `MUTED`, `MIC_DENIED`, `RECOGNITION_ERROR`, `TTS_ERROR`, `LLM_TIMEOUT` and `USER_EXIT` recover independently. Use an existing ChatterBox turn/session ID and cancellation token so late LLM/audio replies after exit are ignored, without duplicating a semantic state owner. Pause/interruption releases pending sound and ducking; NPC returns to normal idle pose.

**Three animated dots:** use the same comic shape/ink/paper family as existing thought-tail circles, inside an empty waiting indicator rather than fake displayed thoughts. Suggest one restrained sequential scale/bob loop and reduced-motion static option. Only show while genuinely waiting on LLM/voice preparation, not as a speech bubble for every silent thought. Persist the established thought/speech/whisper bubble distinctions. `…` as meaningful ChatterBox silence is **not** automatically the async loading indicator.

**Thinking/Listening motion:** small layered body sway/breath; occasional upward or sideways thinking gaze (contextual, not permanent), lid/blink shift, brow asymmetry, subtle head incline then settle; on user speech look toward user, not always to sky. Existing Resident Performance channels and EyeRig/PetMouth control these. Avoid foot sliding and pose conflicts; priority: locomotion/gameplay > encounter > dialogue > reaction > idle. No new Blender clip unless existing motions cannot be layered.

## 6. Audio + speech bubble + talking: one shared utterance timeline

Authority: existing **KFB Audio owner** emits/owns actual playback start/position/end, mix and duck. The voice layer resolves approved source IDs to audio asset/provider and emits output callbacks. ChatterBox controls meaning and bubble text. Bubble renderer consumes presentation events. Resident Performance Composer layers body/face controls, never writes semantic dialogue.

Proposed cue sequence (not necessarily a new schema):

```
turn.sourceSelected(text, tripletIds, sourceRevision)   // ChatterBox truth
utterance.prepare(sourceId, voiceProfile, affect)      // provider/resolver
bubble.prepare(fullText, fixedGeometry)                 // no layout jump
audio.playbackStarted(utteranceId, audioClock)         // authoritative onset
  ├─ KFB Audio voice focus: duck ambience/music, not pause timeline
  ├─ NPC Talking Loop starts; eye/brow/pose layer reacts
  ├─ bubble progressive reveal follows audio timeline
  └─ optional word/beat alignments when genuinely available
audio.playbackEnded / cancelled / failed
  ├─ Talking Loop stops and blends back to idle/listening
  ├─ bubble remains legible/full or dismissal after chosen dwell
  └─ duck restores, focus releases even on error
```

**Preferred reveal:** (a) if real TTS word/character timestamps exist, align visible words/three Triplet parts to actual playback time; (b) with measured clip duration only, do an approximate gentle proportional reveal or the existing Triplet `flip-stagger` per semantic part; (c) if browser engine reports no usable boundaries, reveal at comfortable fixed reading cadence but never claim precise sync. Favor 3-part semantic readability over a fast, distracting letter-by-letter typewriter. Full bubble size is computed before revealing; expose the **entire exact text** for mute, reading accessibility and fallback. Timing source is actual media clock (`HTMLMediaElement.currentTime` or current host AudioContext), not wall-clock `setTimeout` that can drift or continue when suspended. Do not fabricate precise duration/viseme data.

**Lip sync MVP:** existing `TALK_LOOP_NO_LIPSYNC` flag with limited mouth open/close or measured amplitude signal; start/stop bound to actual audio. Viseme/phoneme mapping is a *later optional provider-timing enrichment*, not required for the first working dialogue. While muted, semantic talking posture/bubble may still play appropriately without fake sound.

**Failure behavior:** if audio fails, keep source-truth bubble and valid silence; no frozen talking mouth, spinner or permanent duck. Quick click-to-skip/voice interrupt cancels old utterance and drops late callbacks. Only current output owner controls playback; do not construct second `AudioContext`.

## 7. Maker Space / God Mode dialogue stage — future in-world composing tool

Reuse actual accepted Resident Atlas GLBs, existing EyeRig SSOT where approved, PetMouth, pose/gesture library, current bubble paths, ChatterBox source pool and existing KFB Audio buses. The stage is a **consumer/editor of existing receipts**, not a new truth database or controller.

Suggested editable work surface: select 1–2 real Residents → set conversational pairing/proximity/gaze → choose a real Triplet or typed audition candidate → choose available cast/mood/provider → set thinking/listening/talking/rest poses and brows/lids/pupil targets → hear real audio over D bed with/without ducking → inspect bubble reveal/mouth timing → record KEEP/TUNE/CUT, source IDs, timings, edit notes → export back to owning repositories/data paths.

Real 3D character/source reference must be shown **in isolation** before compositing into holographic stage; loaded asset URL alone is insufficient. Do not construct an ersatz generic hologram dashboard, stand-in logo or second world. Current EyeRig SSOT #375 remains an explicit source concern.

## 8. Acceptance slices and next gates

**NOW · This prep only:** source inventory + candidate casting map + contract and failure-state test recipes, GitHub readback and private Production Control documentation. No actual audio render, ASR/mic test, new 3D scene, new GPT Site version, external provider keys, public Stage, World runtime, DocCheck write, PR merge or Live promotion.

**Next self-contained productive Voice slice (separately authorized WSA/receiving-owner job):**
- On current KFB Audio Voice Acting Site, make the candidate three-actor casting usable/testable through real available English voices or imported authorized audio; preserve `mappingFinal:false` and override controls. If no real renderer exists, classify queue/export accurately instead of fake provider toggles.
- Demonstrate one *source-backed* whole-line vs fragment contrast, source/voice/rights/cache identity, mute and stop/duck/restore while viewing a real bubble presentation. Count actual audible/browser tests.
- Georg can tune/keep/cut later; initial heuristic audition is **authorized to proceed without individual voice preapproval**. No automatically accepted production voice licenses or world runtime writes.
- Optional controlled operator ASR proof comes **after** voice output quality proof, reusing existing mic capability; no requirement to buy/host Speakrail or launch full duplex to pass MVP.
- The first **in-world** 3-Resident and Golden-Journey Social Call Voice integration remains gated by the independent Four-Island A/B World authorization and proper Resident/Performance receiving owner.

**Single owner-local next gate:** `KFB_VOICE_HEURISTIC_THREE_ACTOR_SOURCE_AUDITION_R1`. This is an executor/technical audible proof, not another compulsory early Georg casting decision. Later human fine-tuning is available on the existing Site.

## 9. Implementation handoff roles & STOP boundaries

Only production writer = authorized future Work/WSA in existing Voice PR #379. Read-only Integration Tester checks exact Site audio, no second owner and source/manifest. Independent Critic measures artistic/readability/audio mismatches; Production Guard decides CONTINUE/REPAIR/QUARANTINE/STOP. Georg owns final casting, look/feel and product promotion. After two non-improving attempts, quarantine smallest non-core seam and proceed unless Guard proves outcome-critical. Keep Return/tests additive, verify exact branch head/files after each write.

**Terminology lock:** Speakrail ≠ Resemble Chatterbox-TTS ≠ KFB ChatterBox. DocCheck Feynman/VoiceIO/CME remains an independent research/implementation project.
