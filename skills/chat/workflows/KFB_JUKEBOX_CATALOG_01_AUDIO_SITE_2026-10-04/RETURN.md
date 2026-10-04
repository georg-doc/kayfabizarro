# KFB_JUKEBOX_CATALOG_01 · RETURN

**Status:** QA_GREEN · GPT_SITE_PUBLISH_ONLY  
**Owner:** KFB Audio & Soundscape Baseline v1  
**Branch:** `chatgpt-web/kfb-jukebox-catalog-01-audio-site-2026-10-04`

## Product result

One canonical catalog now carries legacy KFB tracks plus every current RoadTrip-v2 master (44 at source snapshot). A lean KFB Audio Site source uses that catalog for human browsing/playback while exposing transition, source-bank, intake and prompt-authoring workflows without becoming a second audio runtime.

## Site UX

Primary actions are:
- find/hear a track;
- select it as a style reference;
- crossfade two complete masters;
- inspect what environmental source banks exist vs are missing;
- drop local song/stem files to build an intake manifest;
- prepare a grounded request for integrated Site Chat.

It intentionally avoids an analyzer-heavy mixer UI.

## Host status

GPT Site is the target host. This chat has Plugin Creator but no Sites MCP publishing backend, so a real `.chatgpt.site` URL is not claimed. Cloudflare is deliberately not used.

## Exactly one next gate

`KFB_AUDIO_SITE_PUBLISH_01`.

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

## QA recovery 01 Return · 2026-10-04

The intended one-line `12 → 14` recovery was completed and proved the 14-item stem filter. The existing browser flow then exposed two additional QA-harness mismatches in sequence.

- Source validation: **253/253 PASS**.
- Site marker, 54-track render, 44-master count, 14-stem filter and Mix view: PASS.
- Prompt Studio: visibly builds a grounded request with the entered mood and selected master reference.
- Remaining automated failure: case-sensitive `Master` expectation versus lowercase `masters` / `master` in the generated request.
- Publication: **NOT RUN**; no `.chatgpt.site` URL or version exists for this Audio candidate.
- Product source, catalog and prompt-bank follow-up scope remain unchanged.

Two bounded recovery repairs are exhausted, so the candidate is frozen again without a third patch.

Exactly one next gate: `KFB_AUDIO_SITE_PUBLISH_01` — fix only the final stale prompt assertion, rerun the full browser QA, then publish through Sites on green.

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

## Sites publication · COMPLETE · 2026-10-04

`KFB_AUDIO_SITE_PUBLISH_01` is complete.

- Site URL: `https://kfb-audio.frizzlebob.chatgpt.site`
- Site project: `appgprj_6ac1c73dc28881919123106bd6d3e90e`
- saved version: `appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_d542a161ef6c8191adb7f80803df6984`
- deployment: `appgdep_6ac1c79c42988191bdfb28bdfd75da14`
- Site source commit: `a6e2f0a0d938531810a69701b249eb5a5eff1136`
- access: owner-private (`custom`, owner only)
- exact repository source: PR #350 branch `chatgpt-web/kfb-jukebox-catalog-01-audio-site-2026-10-04` at handoff head `758792d5b5d3465f9c8d1e8d7ee202e2cf90dd49`
- tested implementation head: `b5835c521264eef6caf1e1260821c5e04f232fcd`
- product-source diff between tested and handoff heads under `tools/KFB-Audio-Site/`: empty

The deployment contains the prepared `SITE_CHAT_INSTRUCTIONS.md`, `site-chat-context.json`, intake contract and prompt references. Sites also records this Codex thread as `latest_edit_context`; no fake on-page chat widget was added.

Live verification opened the exact production URL and visibly confirmed:
1. Catalog: `54 shown · 54 catalog tracks · 44 RoadTrip v2 · 14 stem families`;
2. Mix transition desk;
3. Soundscape available/missing source bank;
4. Intake surface;
5. Prompt Studio;
6. Brief/current audio rules;
7. zero captured browser warnings or errors.

No Cloudflare route was created and PR #350 was not merged.

**Exactly one next gate:** `KFB_AUDIO_SFX_PROMPT_BANK_REBRIEF_01` — wait for Georg's bounded SFX/Sound-Bed Prompt-Bank rebrief before extending this Site.

## Music interaction states B / C / D · COMPLETE · 2026-10-05

The existing KFB Audio Site and mixer were extended in place. No new Site, AudioContext, clock, bus graph, player or placeholder audio was created.

- B: movement / adventure groove;
- C: staying / cozy exploration;
- D: talking / social interaction;
- per-state targets cover energy, density, music gain, transient/percussion restraint, speech-space/ducking bias, crossfade time and optional BPM/subdivision metadata;
- all transitions schedule gain ramps on the one AudioContext clock;
- D cooperates with the existing voice-focus/TTS ducking path; it does not replace it;
- the external adapter accepts World/Resident/POI/Billboard context while the Audio Site remains runtime owner;
- stems are contract-ready and explicitly `FUTURE_NOT_AVAILABLE`; no fake audio file is mapped;
- Prompt Studio exposes the 12 existing authored B/C/D prompts.

GitHub / QA:
- repo `georg-doc/kayfabizarro`;
- Draft PR #350;
- branch `chatgpt-web/kfb-jukebox-catalog-01-audio-site-2026-10-04`;
- tested implementation head `18fb126701d2412f6b5a5701f08dc5615f4069a2`;
- CI run `37243655057`, job `111557176078`;
- validator 303/303 PASS; JavaScript syntax PASS; browser 17/17 PASS;
- artifact `11317963584`, digest `sha256:8e74665aaabf6bc9108025a4744e54a4dbca365610294e9b1f26fa0b26485842`.

Site:
- exact URL `https://kfb-audio.frizzlebob.chatgpt.site`;
- project `appgprj_6ac1c73dc28881919123106bd6d3e90e`;
- source commit `b0a620777768c93c2b87a3215b4c8e8730609e53`;
- version `appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_77727ba7f7248191bf12eb7e13cad587`;
- deployment `appgdep_6ac2e0e36dc48191bd0b49ecd828a500`: SUCCEEDED;
- access remains `custom`, owner-private;
- Sites deployment screenshot visibly shows `SITE SOURCE 0.2`, `ONE AUDIO CONTEXT` and catalog 54/44/14;
- direct exact URL was opened; the automation browser reached the expected owner-private ChatGPT sign-in boundary, so interactive production behavior is evidenced by the same-source 17/17 browser artifact and deployment screenshot.

No Cloudflare substitution, merge or Live promotion occurred. The repository's existing PR-preview automation may still report its ordinary branch build; that is not the Audio Site deployment or an acceptance surface for this slice.

**Exactly one next gate:** `WORLD_AUDIO_CONTEXT_BCD_ADAPTER_01` — integrate the adapter in one bounded next World MVP, including Billboard/POI context, without transferring mixer/runtime ownership to World.
