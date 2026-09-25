# Legacy GVW Hub v0.8.2 · donor analysis for current KFB Hub

Date: 2026-09-25  
Status: **SOURCE-VERIFIED DONOR ANALYSIS · NO FEATURE IMPLEMENTATION**  
Receiving owner: **KFB Production Hub / HUB-CTRL**  
Current integration candidate: **PR #217 · Hub UX Recovery v2**

## Source boundary

Georg supplied the historical public route:

`https://gvw-hub.pages.dev/hub-v0.8.2`

The current chat URL viewer cannot render that Cloudflare host, so no visual screenshot claim is made from this session. The exact archived **v0.8.2** HTML was nevertheless recovered through Georg's connected legacy GVW repository and verified by version metadata. No old project manifest, private content, absolute Vault paths or personal data are copied into KFB.

This memo extracts reusable interaction mechanisms only.

## What maps cleanly to the current Hub

### 1. Voice Capture → current Pocket Inbox · STRONG DONOR

v0.8.2 already contains progressive browser voice input using `SpeechRecognition / webkitSpeechRecognition`, alongside text and file capture.

Adaptation:
- add microphone input as another way to fill the **existing** Pocket Inbox input;
- write the transcript into the current Pocket Inbox / IndexedDB owner;
- keep text/file capture unchanged;
- fail quietly to ordinary text entry when speech recognition is unavailable;
- do not import the old project's stub/project database.

Why useful:
this is immediately useful for quick production notes and later becomes the matching input half of Frizzlebot voice interaction.

Deferred candidate:
`HUB-VOICE-01`.

### 2. Browser TTS → Frizzlebot presentation · STRONG DONOR

v0.8.2 already uses `SpeechSynthesisUtterance` / `speechSynthesis` for character responses.

Adaptation:
- text remains owned by current Hub data / ChatterBox / Triplet logic;
- TTS is presentation only;
- TTS start/end may drive the existing PetMouth talk state;
- EyeRig and Motion receive impulses through their existing owners;
- voice/rate/pitch become a small character presentation profile rather than a new audio engine;
- MUSIC-PERF remains music/song-clock owner; spoken voice may only request duck/pause behavior.

Deferred candidate:
`HUB-VOICE-01` after the current design gate.

### 3. Card → character context injection · BEST CONCEPTUAL DONOR

The legacy Hub's strongest relevant interaction is the v0.7.3/v0.8.2 path:

character on a project card → open that character → inject that card's structured JSON as context.

This maps almost directly onto the intended Frizzlebot moderator.

Adaptation:
- current selected lane / briefing / review is passed as a **read-only context payload**;
- Frizzlebot comments on that real object but does not invent status, owner, URL or next gate;
- ChatterBox/Triplet chooses wording;
- action links still come directly from Production Desk data;
- no direct browser API-key chat drawer is reused.

This lets Frizzlebot say *how* he frames the next task without becoming the source of *what* the task is.

Deferred candidate:
`HUB-CONTEXT-01`.

### 4. Relations → source-derived related work · ADAPT, DO NOT COPY DATA MODEL

v0.8.2 models bidirectional project relations and offers keyboard-searchable linking.

The interaction is useful; the old manually edited `relations[]` truth is not.

Adaptation:
derive related items from current sources such as:
- same owner;
- same strand;
- explicit dependencies;
- same briefing/review source;
- source-backed tags/consumer links.

Render these as compact “related” navigation only when current data supports them.

Do not create a second relation database in the Hub.

Deferred candidate:
`HUB-REL-01`.

### 5. Snapshot / Export → one local Hub recovery bundle · ADAPT

v0.8.2 can export labelled HTML/JSON snapshots.

The new Hub already has local Decisions and Pocket Inbox export. Rather than copy the old snapshot system, later combine current local-only state into one portable recovery package:

- Pocket Inbox entries;
- decision states;
- Resident UI preference;
- optional small UI preferences.

This export is user convenience only and never becomes project status truth.

Deferred candidate:
`HUB-LOCAL-STATE-01`.

### 6. Keyboard-first operation · LOW-COST DONOR

The old Hub uses practical shortcuts such as `/` for search and `Escape` for overlays.

These are worth reusing only where they reduce daily friction. Do not add a discoverability panel or shortcut chrome unless real use shows it is needed.

## Keep out of the daily Hub

### Crit Row / autonomous corridor

The old Crit Row is interesting as character-interaction R&D, but it would fight the current “every pixel pays rent” cockpit.

Possible later home:
a dedicated **Character Lab / Playground** using Resident/NPC-LIFE/Motion owners.

Not the default Today surface.

### Comic floors / room view

Useful historical visual experiment, but the current operational Hub should not become a spatial project browser again. If revived, it belongs to Archive/Playground or a separate game-version of the Hub.

### Direct browser model/API-key chat drawer

Do not reuse as foundation. Current KFB character text must route through current content/ChatterBox/agent owners. Secrets and model ownership do not move into the public Hub.

### Editable legacy project manifest / commit system

Do not import. Production Desk + project SSOTs remain truth. The Hub may capture decisions and notes but does not edit a second project database.

### Absolute Vault paths / local-file project ownership

Do not import into the public Hub. A later desktop/local helper may expose local files, but that is a separate capability and not production truth.

### Auto-thumbnails / decorative card system

Not useful on the current first viewport. Identity/preview images should appear only when they help a concrete review or tool action.

## Recommended feature sequence after the current human gate

These are **DEFERRED proposals**, not the current next gate:

1. `HUB-VOICE-01` — SpeechRecognition into Pocket Inbox + browser TTS presentation hook.
2. `HUB-CONTEXT-01` — selected real briefing/lane → Frizzlebot read-only context payload.
3. Bubble comparison gate — current Overworld v13 vs Podcast-v5 vs Claude candidate behind one presentation seam.
4. Mouth/Eye/Motion coupling to TTS events.
5. `HUB-REL-01` — source-derived related-work links.
6. `HUB-LOCAL-STATE-01` — one export of current local Hub state.
7. Character Playground only if daily Hub use shows a need for multi-character autonomous testing.

## One current gate

**GEORG HUMAN REVIEW · HUB UX RECOVERY V2**

Do not start any legacy-donor feature until the new Hub shell itself is accepted or tuned.
