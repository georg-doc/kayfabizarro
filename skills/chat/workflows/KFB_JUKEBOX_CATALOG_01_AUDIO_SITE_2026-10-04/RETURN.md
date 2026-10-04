# KFB_JUKEBOX_CATALOG_01 · RETURN

**Status:** CANDIDATE_FROZEN · SOURCE_VALIDATED · BROWSER_QA_EXPECTATION_RECOVERY_REQUIRED · GPT_SITE_PUBLISH_TOOL_UNAVAILABLE  
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

`KFB_AUDIO_SITE_QA_RECOVERY_01`.

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

**Exactly one next gate:** `KFB_AUDIO_SITE_QA_RECOVERY_01` — in a fresh/Sites-capable executor, change only the stale browser expectation from 12 to 14, rerun the existing QA unchanged otherwise; if green, immediately continue to GPT Site publication/connect integrated Site Chat from the already-prepared source package.
