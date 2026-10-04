# KFB_JUKEBOX_CATALOG_01 · Audio Site

**Status:** QA_GREEN · GPT_SITE_PUBLISH_ONLY  
**Date:** 2026-10-04  
**Owner:** KFB Audio & Soundscape Baseline v1  
**Repo:** georg-doc/kayfabizarro  
**Branch:** chatgpt-web/kfb-jukebox-catalog-01-audio-site-2026-10-04  
**Outcome:** canonical Jukebox expansion + lean KFB Audio working Site source.  
**Cloudflare:** deliberately not used.

## Goal

Make all current KFB authored music discoverable through the existing canonical Jukebox and provide one lean Audio Site for catalog browsing, master playback, transition work, source-gap curation, upload intake and LLM prompt context.

## Source facts

- main base: `bf1b20d33d44eebb3bf6f7217c3d26c59a633a13`;
- RoadTrip-v2: 44 master MP3s;
- paired stem families: 14;
- Beetle-Wrestling Entrance 01 = 118 BPM / extended alternate;
- Beetle-Wrestling Entrance = 119 BPM / signature family;
- Surf Groove 3min = 100 BPM;
- exact new Jazz track is pending and is not a blocker.

## Protected boundaries

- no second Jukebox registry;
- no second runtime AudioContext/player;
- master recordings stay Ground Truth;
- stems remain source-only except individually certified donors;
- no cross-song pitched stem mixing by default;
- no Cloudflare iteration path;
- GPT Site publication must use Sites MCP when available; do not silently substitute another host.

## Done when

1. existing canonical Jukebox remains backward-compatible;
2. all 44 RoadTrip-v2 masters are registered;
3. all 14 stem-family dirs are declared and resolve;
4. Audio Site source renders a compact catalog, transition desk, soundscape gaps, intake and prompt context;
5. repository validator + browser QA pass;
6. Site source and an authenticated Site/Production-Control preview artifact are persisted.

## Exactly one next gate

`KFB_AUDIO_SITE_PUBLISH_01` — publish this proven source as a real GPT Site when Sites MCP is available, connect integrated Site Chat to the supplied context + KFB Production Control persistence, and verify the Site URL. No Cloudflare.

## QA stop / recovery · 2026-10-04

Implementation is frozen after two browser-QA repair passes on the same gate, per KFB recovery policy.

What is proven:
- source lock pinned to `main@ffeb161d7c09c64436fbdf1dc83ce2b71e8f8a74`;
- catalog: **54 total / 44 RoadTrip-v2 / 14 paired stem families**;
- repository source validator: **PASS** on run `37168419769`;
- JS syntax check: **PASS** on run `37168419769`;
- browser loaded the candidate Site snapshot and passed:
  1. Site marker;
  2. catalog renders at least 54 tracks;
  3. stats report 44 RoadTrip-v2 masters.
- browser then stopped at the stale assertion `stem filter shows 12`: actual UI value was **14**.

Two repair passes that advanced the same browser gate:
1. `7b480454f0dfb771e1a51e5e34609b7f29bf8069` — switched Site from stale raw-main catalog (10 tracks) to pinned candidate snapshot; next run advanced to old 42-track expectation.
2. `070fdaee25dfcdc671a0a29946092086c0a50562` — corrected 52→54 and 42→44 expectations; next run advanced to the remaining old 12→14 stem-family expectation.

No third QA repair is made in this slice. The observed stop is a **test-expectation mismatch**, not a demonstrated catalog/audio/UI defect.

Run `37168419769` / job `111336177063`:
- Browser checks reached: **4**
- first 3: PASS
- 4th: FAIL only because expected 12, actual 14
- artifact: `11290582496`
- digest: `sha256:ff8f155fe10a6fccffd951fdd6503df4fd53b4eeb36e52f17c60eee517f5e649`

Private workbench preview is already persisted in KFB Production Control:
- workflow: `KFB-JUKEBOX-CATALOG-01`
- record: `750cc070-edb8-4f66-94a0-f8de5d2e22f2`
- file: `KFB_Audio_Site_MVP_01.html`
- file id: `c974646c-7d1b-4550-803d-2922566925bd`
- SHA-256: `79f1411f6c5edf77c0bc0a68cb746f0bd1f9e953c552422ff0c226875d493cad`

Hosting boundary:
- target = real GPT Site through Sites MCP;
- Sites MCP is unavailable in this chat;
- Cloudflare is deliberately not substituted;
- therefore no `.chatgpt.site` live URL is claimed.

**Exactly one next gate:** `KFB_AUDIO_SITE_PUBLISH_01` — in a fresh/Sites-capable executor, change only the stale browser expectation from 12 to 14, rerun the existing QA unchanged otherwise; if green, immediately continue to GPT Site publication/connect integrated Site Chat from the already-prepared source package.

## Current recovery state · 2026-10-04

`KFB_AUDIO_SITE_PUBLISH_01` advanced but did not reach full PASS.

- `12 → 14` stem expectation corrected;
- Prompt Studio navigation moved before mood-field fill;
- validator: **253/253 PASS**;
- browser: five checks PASS, then stale case-sensitive `Master` assertion fails although the generated request visibly contains the requested mood and selected master reference;
- two recovery repair passes exhausted;
- Site publication: **NOT RUN**;
- SFX/Sound-Bed Prompt Bank: **DEFERRED**.

Exactly one next gate: `KFB_AUDIO_SITE_PUBLISH_01` — prompt assertion only, then full browser rerun and Sites publication only on green.

## QA recovery 02 · COMPLETE PASS · 2026-10-04

The final stale prompt assertion was changed only from case-sensitive `Master` to case-insensitive `master`.

Tested implementation head:
`b5835c521264eef6caf1e1260821c5e04f232fcd`

GitHub Actions:
- run `37173411886`
- job `111350911259`
- source/catalog validator: PASS
- JavaScript syntax: PASS
- browser QA: **9/9 PASS**
- artifact `11292621270`
- digest `sha256:6ae512c1dcce56140e7decf6b1fc8b0965a4ffe53b15c77708b4beb13883d4e6`

Browser gate now proves:
1. Site marker;
2. 54-track catalog render;
3. 44 RoadTrip-v2 master count;
4. 14 stem-family filter;
5. Mix view;
6. grounded Prompt Studio request;
7. rain/SOURCE_REQUIRED gap visibility;
8. zero page errors;
9. zero local HTTP errors.

Product source is therefore **QA_GREEN**.

GPT Site publication has **not** been performed in this Webchat because its available toolset does not expose Sites MCP. The previously proven KFB Site publishing lane is the local Sites skill:
`/Users/georg/.codex/plugins/cache/openai-curated-remote/sites/1.0.0-a/skills/sites/SKILL.md`

Cloudflare remains deliberately excluded.

**Exactly one next gate:** `KFB_AUDIO_SITE_PUBLISH_01` — Sites-capable executor publishes the already QA-green source, connects the prepared integrated Site Chat context, opens the resulting `.frizzlebob.chatgpt.site` URL, and verifies this exact revision visually. No product repair should occur in that gate.

## Current override · B / C / D interaction states · 2026-10-05

The same Audio Site is now source `0.2` and deployed owner-private at `https://kfb-audio.frizzlebob.chatgpt.site`.

- B = movement/adventure groove; C = staying/cozy exploration; D = talking/social interaction;
- one lazy AudioContext, one AudioContext clock and the existing semantic buses remain authoritative;
- TTS voice focus/ducking stays separate from D and adds to its speech-space target;
- manual mixer selection and external `kfb:music-context` / `kfb:voice-focus` adapter events are available;
- transitions are smooth gain ramps; no hard-switch or second clock is introduced;
- stems are `FUTURE_NOT_AVAILABLE`; metadata/targets are ready but `audioFiles` is empty;
- the existing authored B/C/D Base + Utopia/Dystopia/Protopia prompt pack is present in Prompt Studio;
- World/Resident/POI/Billboard context may request a state later but does not become audio owner;
- tested GitHub head `18fb126701d2412f6b5a5701f08dc5615f4069a2`: 303/303 static + 17/17 browser PASS;
- Site version `appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_77727ba7f7248191bf12eb7e13cad587`; deployment `appgdep_6ac2e0e36dc48191bd0b49ecd828a500` succeeded;
- no merge, Live promotion or Cloudflare substitution.

**Exactly one next gate:** `WORLD_AUDIO_CONTEXT_BCD_ADAPTER_01` — wire this contract into one bounded next World MVP, including Billboard/POI context, while preserving the World owner and the Audio owner's single runtime.
