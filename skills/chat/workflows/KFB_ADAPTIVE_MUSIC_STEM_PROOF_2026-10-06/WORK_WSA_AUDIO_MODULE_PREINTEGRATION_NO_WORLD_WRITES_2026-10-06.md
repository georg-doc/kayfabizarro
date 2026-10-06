# WORK/WSA BRIEF · AUDIO MODULE PRE-INTEGRATION · NO WORLD WRITES

Date: 2026-10-06
Execution mode: BOUNDED_SLICE
Executor: ChatGPT Work/WSA
Owner: KFB Audio / Jukebox / Mixer
Repo: georg-doc/kayfabizarro
Write branch: web/kfb-adaptive-music-stem-proof-2026-10-06
Draft PR: #365
Receiving product later: Open World / WB2 · Issue #360 / PR #348

## One outcome

Finish the KFB Audio module so the later Open World Anschluss-Integrator can consume it with a tiny adapter.

This slice must NOT integrate into the World.

## Current routing truth

Claude Coworker is still the active Open World writer.

Observed current World state:
- Issue #360 = RUNNING NOW in Claude Coworker;
- PR #348 remains the receiving World contract;
- no exact Coworker GitHub RETURN/branch handoff is visible yet;
- current preparation plan says Coworker closes Wave A/Core first;
- Audio is Wave C after exact Coworker return.

Therefore:
**NO WORLD WRITES.**

Do not edit:
- PR #348 branch/runtime;
- WB2 files;
- Open World architecture;
- World player/drive/sky/track/resident/media modules.

Do not guess Coworker's uncommitted architecture.

## Read first

1. skills/chat/START_HERE.md
2. skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md
3. skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md
4. Audio PR #365 current Return / Runtime Package Return
5. KFB_AUDIO_WORLD_INTEGRATION_CONTRACT_01.md
6. KFB_AUDIO_CONTEXT_V1.schema.json
7. KFB_AUDIO_EVENT_V1.schema.json
8. INTAKE_M_N_O_2026-10-06.md
9. M_N_O_INTAKE_TEST_EVIDENCE_2026-10-06.md
10. COWORKER_WSA_WORLD_AUDIO_INTEGRATION_HANDOVER_2026-10-06.md
11. tools/KFB-ToolBox/audio/runtime/

GitHub state wins.

## Exact current audio source truth

Canonical binary source:
main@276728f3f82f729cd1656b61e81d278856d736bb

Verified runtime families:
- G · MOVEMENT · 120 BPM
- D · TALKING · 94 BPM

Source-present but runtime-unverified:
- C · Cozy Base · 81 BPM
- M · Island Life · 112 BPM · master + 10 stems
- N · Dusk/Night · 70 BPM · master + 11 stems
- O · Discovery/POI · 82 BPM · master + 9 stems

M/N/O exact source presence:
33/33 non-empty MP3 files.

## Work scope

### A · Validate C/M/N/O independently

For every real stem family:
- decode every stem;
- capture sample rate, channels, duration;
- calculate min/max duration + delta;
- test loop boundary and long-run drift;
- verify BPM / bar / phrase plausibility;
- listen to source-labelled Vocal / Other layers;
- keep ambiguous layers muted unless clearly safe;
- test master fallback;
- record console/network/audio errors.

Family-local promotion only:
- C may PASS while M/N/O do not;
- M may PASS while N/O do not;
- no all-or-nothing gate.

Technical promotion target:
SOURCE_PRESENT_RUNTIME_UNVERIFIED
→ SITE/RUNTIME_VERIFIED only when real evidence supports it.

Do not claim HUMAN_ACCEPTED.

### B · Harden the DOM-free runtime

Current owner:
tools/KFB-ToolBox/audio/runtime/

Preserve:
- injected existing AudioContext only;
- zero AudioContext creation;
- no DOM/window/document;
- no WB2 imports;
- no Site UI dependency;
- Audio owns MusicClock, family choice, stems, transitions, Speech Focus and mix.

Make the runtime a closed consumer module:
- createKfbAudioRuntime(...)
- setContext(kfb.audio.context.v1)
- emit(kfb.audio.event.v1)
- getCapabilities()
- getEvidence()
- suspend/resume/dispose

Only add API surface if required by real tests.

### C · Add synthetic World-context fixtures

Create data fixtures/harness only inside Audio owner.

Minimum scenarios:
1. DAY_ROAM
2. DAY_STAY
3. DUSK_TO_NIGHT
4. POI_DISCOVERY
5. RESIDENT_DIALOGUE
6. BILLBOARD_DIALOGUE
7. DRIVE_TO_STAY
8. MISSING_FAMILY_FALLBACK

They must drive only the public context/event API.

No direct track IDs, BPMs or stem gains in fixtures.

Expected musical intent after families are validated:
- movement → G / profile equivalent;
- staying/day → C or M;
- dusk/night → Audio may choose N;
- POI discovery → Audio may choose O;
- dialogue → D/Speech Focus;
- missing family → keep current verified family, master fallback or silence according to Audio policy.

### D · Make later World integration cheap

Deliver one concise consumer packet showing:

```js
const audio = createKfbAudioRuntime({
  audioContext: existingAudioContext,
  destination: existingScoreBus,
  ...
});

audio.setContext(worldSnapshot);
audio.emit(worldEvent);
```

The later World-side adapter is NOT implemented here.

It should need only:
- normalize World facts;
- call setContext();
- call emit().

## No-touch

Do not:
- write to PR #348 / World branch;
- create audio-context-adapter in WB2;
- import Audio Site UI into World;
- create another AudioContext/mixer/MusicClock;
- modify Production Hub/router;
- touch Cloudflare;
- redesign Audio Site;
- create another Site;
- merge PR #365;
- promote Live.

The existing KFB Audio Site remains Site Version 5 / Source 0.3 unless a real blocker requires a Site-source fix. This slice is module preparation, not Site redesign/publication.

## Evidence

Required:
- exact family decode metrics;
- per-family verdict;
- ambiguous layer classification;
- context-fixture results;
- fallback results;
- runtime ownership invariants;
- one AudioContext contract;
- exact changed files;
- exact branch head after each phase-boundary write.

Use only these GitHub checkpoints:
1. implementation;
2. material test/evidence;
3. final Return.

Timeout = UNKNOWN until ref/file inspection.

## Stop rule

After two non-improving repair passes on one family/seam:
- freeze that smallest seam;
- preserve evidence;
- continue other families/module work unless it blocks the whole Audio module.

## Final Return

Must state:
- repo / branch / PR / final head;
- C/M/N/O verdicts;
- decoded metrics;
- muted/unclassified layer decisions;
- runtime API/capabilities;
- fixture test results;
- fallbacks;
- changed files;
- unresolved items;
- exactly one next gate.

## One next gate

After exact Coworker RETURN:
ChatGPT Work/WSA Anschluss-Integrator consumes the returned Coworker product and implements only the tiny World-side context/event adapter against this finished Audio module.

No World integration before that return.
