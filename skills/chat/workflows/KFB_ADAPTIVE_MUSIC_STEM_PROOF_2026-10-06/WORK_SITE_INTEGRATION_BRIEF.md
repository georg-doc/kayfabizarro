# WORK BRIEF · KFB Audio Adaptive Music G/D Site Integration

Date: 2026-10-06
Execution mode: BOUNDED_SLICE
Executor: ChatGPT Work/WSA · Sites-capable
Owner: existing KFB Audio / Jukebox / Mixer
Repo: georg-doc/kayfabizarro
Draft PR: #365
Branch: web/kfb-adaptive-music-stem-proof-2026-10-06
Starting head: 5909e5486441285919d41e8e644f2ee91fcfbb31

## ONE PRODUCT OUTCOME

Integrate the already source-green adaptive-music G/D proof from PR #365 into the EXISTING KFB Audio Site, run the missing real WebAudio/decoded-alignment/listening proof there, and update that SAME Site in place.

This is NOT a redesign task.
This is NOT a Hub task.
This is NOT a new Site task.

## PRIMARY PRODUCT SITE · EXACT OWNER

Existing Site only:
https://kfb-audio.frizzlebob.chatgpt.site

Current Site identity observed before this Work slice:
- project id: appgprj_6ac1c73dc28881919123106bd6d3e90e
- slug: kfb-audio
- current source version number observed: 2
- current projection revision observed: 4
- status: active

Current visible product shell that MUST remain the design/UX donor:
- KFB AUDIO · WORK SITE
- "Find it. Hear it. Crossfade it. Shape movement, staying and dialogue. Ask for the next sound."
- SITE SOURCE 0.2
- ONE AUDIO CONTEXT
- GitHub = SSOT
- current primary surfaces:
  Catalog
  Mix
  Soundscape
  Intake
  Prompt Studio
  Brief

Current Catalog baseline observed before integration:
- 54 shown / 54 catalog tracks
- 44 RoadTrip v2
- 14 stem families

These are BEFORE-state identifiers, not values to hardcode if the new source legitimately expands them.

## NON-NEGOTIABLE DESIGN GUARD

### 1. SHOW THE CURRENT AUDIO SITE BEFORE TOUCHING IT

Before editing:
1. open the exact existing KFB Audio Site;
2. capture/retain visual proof of the current Catalog, Mix and at least one other existing surface;
3. inspect the actual Site source/project;
4. identify the existing components/layout/styles that own navigation, typography, card/list presentation, mixer presentation and player shell;
5. write a short BEFORE inventory.

A loaded URL alone is NOT donor proof.
The actual current Site object/surface must be shown/inspected in isolation first.

### 2. KEEP THE CURRENT DESIGN

The current KFB Audio Site is the design donor.

Do NOT:
- replace it with the standalone PR #365 proof page design;
- copy the brown AUDIO-CAL-01 lab styling into the productive Site as a new shell;
- invent generic dashboard chrome;
- replace navigation;
- introduce a second mixer;
- introduce a second audio player shell;
- rename or remove Catalog / Mix / Soundscape / Intake / Prompt Studio / Brief;
- replace branding;
- rewrite working screens just to fit the proof.

The PR #365 standalone HTML/CSS is TEST HARNESS presentation only.
Its logic/data seams may be integrated.
Its visual shell is NOT the productive design authority.

### 3. ADD THE FEATURE INSIDE THE EXISTING MIX WORKFLOW

Preferred integration:
- existing Mix remains owner;
- add an "Adaptive Music" section/mode inside Mix using the current Site component language;
- G and D controls should look like they were always part of this Site;
- preserve all current Catalog/player behavior;
- new controls should be compact and secondary to normal listening/mixing.

If a current component already solves a needed UI pattern, reuse it exactly.

## ABSOLUTE NO-TOUCH BOUNDARIES

### KFB Production Hub = NO TOUCH

Do NOT modify, republish, regenerate, route, style or "sync":
- KFB Production Hub Site;
- kfb-hub central product UI;
- Hub cards;
- central router;
- cloudflare-live;
- any Cloudflare Stage.

This slice does not materially change product routing.
The existing Audio Site URL is already canonical.

Do not touch the Hub "for completeness".
Do not update it after the Site integration.
Do not publish any mirror.

### Other products = NO TOUCH

Do not modify:
- World Studio / WB2;
- Race runtime;
- Combat;
- Resident Atlas;
- ToolBox Site;
- Asset Librarian;
- other Sites.

They may be consumers later, not writers in this slice.

## REQUIRED SOURCE READ

Read current GitHub versions before work:
1. skills/chat/START_HERE.md
2. skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md
3. skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md
4. skills/chat/workflows/KFB_ADAPTIVE_MUSIC_STEM_PROOF_2026-10-06/START_HERE.md
5. skills/chat/workflows/KFB_ADAPTIVE_MUSIC_STEM_PROOF_2026-10-06/TEST_EVIDENCE.md
6. skills/chat/workflows/KFB_ADAPTIVE_MUSIC_STEM_PROOF_2026-10-06/SITE_INTEGRATION_PACKET.md
7. skills/chat/workflows/KFB_ADAPTIVE_MUSIC_STEM_PROOF_2026-10-06/RETURN.md
8. tools/KFB-ToolBox/audio/adaptive-music-proof-01/DONOR_PROOF.md
9. tools/KFB-ToolBox/audio/adaptive-music-proof-01/SOURCE.json
10. current KFB Audio Site source/project

GitHub and current Site state override chat memory.

## CURRENT SOURCE-GREEN RESULT TO INTEGRATE

PR #365 head at handoff:
5909e5486441285919d41e8e644f2ee91fcfbb31

Evidence already complete:
- contract/clock/host tests: 18/18 PASS
- exact real G+D source assets: 22/22 PASS
- G master + 10 stems present
- D Base master + 10 stems present

Do NOT redo this work unless current GitHub state changed.

## AUDIO OWNER GUARD

The productive Site already owns its AudioContext and mixer.

Use:
window.__KFB_ADAPTIVE_MUSIC_PROOF__.configureHost({
  audioContext: existingAudioContext,
  destination: existingMusicDestination
});

Required productive diagnostic:
- hostMode = INJECTED_EXISTING_CONTEXT
- this module creates 0 new AudioContexts

If integration causes a second active AudioContext:
FAIL and repair this seam.
Do not create a second audio runtime.

## G · FIRST REAL VERTICAL-LAYER PROOF

Source:
KFB_G_COSMIC_ROADTRIP_ORCHESTRAL_01
120 BPM
10 real source stems

Integrate:
- ROAD
- WIDE
- EPIC

Transition boundary options:
- Immediate
- Next beat
- Next bar
- Next phrase

Rules:
- all decoded stems start once on one scheduled timeline;
- preset changes change gains only;
- do not restart sources for orchestration changes;
- do not run master and stem reconstruction simultaneously;
- unclassified "Lead Vocals" / "Other" labels remain muted until listening classification.

## D · TTS / SPEECH-FOCUS PROOF

Source:
KFB CONVERSATION STYLE D · BASE
94 BPM
10 real source stems

Existing TTS/voice lifecycle remains owner.

On speech start:
- keep existing KFB ducking;
- add D Speech Focus;
- modest music gain reduction;
- speech-band EQ space;
- reduced drums/percussion/brass/guitar as specified in SOURCE.json;
- timeline continues.

On speech end:
- restore open D mix on the configured safe musical boundary.

Do NOT replace the existing ducking implementation.

## REQUIRED RUNTIME EVIDENCE

This is the core reason Work/Sites is needed.

For G and D, measure from REAL decoded files:
1. decoded duration of every stem;
2. min duration;
3. max duration;
4. max-min duration delta in ms;
5. sample rate / channel metadata when available;
6. long playback/loop drift check;
7. whether bar/phrase boundaries correspond audibly to the claimed BPM;
8. G Road -> Wide -> Epic transitions;
9. D open mix -> TTS/Speech Focus -> open mix;
10. confirm music timeline does not pause or restart under TTS.

Do not claim sample alignment merely because filenames share a BPM.

If the real stems are not sufficiently aligned:
- classify the exact defect;
- preserve the candidate;
- fall back to master playback where needed;
- do not fake a PASS;
- do not rebuild the Site around the defect.

## LISTENING CLASSIFICATION

Source labels such as:
- Lead Vocals
- Backing Vocals
- Other

are Suno splitter labels, not semantic KFB truth.

Listen before enabling.
Record what they actually contain.

Do not expose a surprising vocal layer by default in a supposedly instrumental game bed.

## TEST ORDER

### Phase 1 · BEFORE / DONOR
- exact current Site opened;
- existing design/screens proven;
- current Site/project identity recorded.

### Phase 2 · INTEGRATION
- PR #365 logic/data integrated into existing Mix;
- one existing AudioContext injected;
- no visual redesign.

### Phase 3 · TECHNICAL EVIDENCE
- decoded-stem metrics;
- MusicClock transitions;
- timeline continuity;
- TTS Speech Focus;
- no duplicate contexts;
- no console/page/network errors caused by the integration.

### Phase 4 · VISUAL REGRESSION
Compare BEFORE vs AFTER:
- Catalog unchanged except legitimate new source rows/counts;
- navigation unchanged;
- Mix retains existing design;
- Soundscape unchanged;
- Intake unchanged;
- Prompt Studio unchanged;
- Brief unchanged;
- responsive layout still works.

If unrelated UI changed, revert it before publication.

### Phase 5 · SAME SITE UPDATE
Update ONLY:
https://kfb-audio.frizzlebob.chatgpt.site

Then open that exact URL and verify:
- same design;
- new Adaptive Music controls in Mix;
- expected source revision;
- G and D actually work.

Do not claim publication until this exact URL visibly shows the candidate.

## PERSISTENCE / GITHUB

One production writer only.

Use phase-boundary checkpoints:
1. coherent integration implementation;
2. evidence/test result;
3. final Return/handoff.

After EVERY GitHub write:
- fetch exact branch head;
- fetch intended files;
- timeout = UNKNOWN until ref/file inspection proves state.

Do not merge PR #365.

## WHAT NOT TO WRITE

Do NOT update:
- skills/chat/START_HERE.md unless a genuine routing rule changes;
- KFB_ACTIVE_WORK_MAP;
- kfb-hub/index.html;
- Production Hub source;
- Cloudflare;
- World/Combat routes.

This bounded proof does not require central routing churn.

## ACCEPTANCE

PASS requires ALL:
- existing Audio Site design preserved;
- no second Site;
- no Hub mutation;
- one AudioContext;
- real decoded G/D sources work;
- measured stem alignment/drift result recorded;
- quantized G transitions audibly work or exact limitation recorded;
- D Speech Focus works with TTS without timeline restart;
- existing Site screens regress cleanly;
- exact existing Site URL visibly verified after publish;
- Return states exact Site project/version/deployment/source head.

## STOP / FAILURE RULE

Two non-improving repair passes on the same seam:
- stop repairing that seam;
- preserve evidence;
- classify whether it blocks the named G/D Site outcome.

Do NOT respond by:
- redesigning the Site;
- rebuilding the mixer;
- creating another Site;
- modifying the Hub;
- switching to Cloudflare.

## FINAL RETURN MUST INCLUDE

- repo
- branch
- PR
- final head
- changed files
- actual test counts
- decoded stem metrics
- source-label listening classification
- BEFORE/AFTER visual proof
- exact KFB Audio Site project id
- exact source/site version and deployment/revision after update
- exact URL verification result
- unresolved items
- one next gate

## ONE NEXT GATE AFTER WORK

Only after this Site result is genuinely green:
Georg listens to G Road/Wide/Epic transitions and D conversation/TTS behavior in the existing KFB Audio Site.

No merge / no Live promotion follows automatically.
