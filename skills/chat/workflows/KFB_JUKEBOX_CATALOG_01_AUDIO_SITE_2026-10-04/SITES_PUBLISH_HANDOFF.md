# KFB_AUDIO_SITE_PUBLISH_01 · SITES HANDOFF

> **Closed 2026-10-04:** published owner-private at `https://kfb-audio.frizzlebob.chatgpt.site` as version `appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_d542a161ef6c8191adb7f80803df6984`; deployment `appgdep_6ac1c79c42988191bdfb28bdfd75da14` succeeded. Live-visible Catalog/Mix/Soundscape/Intake/Prompt Studio/Brief verification passed with zero captured browser warnings/errors. No Cloudflare, no merge.

**Input is QA-green. Do not redesign or repair the product.**

Repo: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/kfb-jukebox-catalog-01-audio-site-2026-10-04`  
Draft PR: #350  
Tested implementation head: `b5835c521264eef6caf1e1260821c5e04f232fcd`  
Source root: `tools/KFB-Audio-Site/`

Required publisher:
`/Users/georg/.codex/plugins/cache/openai-curated-remote/sites/1.0.0-a/skills/sites/SKILL.md`

## Publish exactly this product

KFB Audio Site:
- Catalog/master playback;
- 54 tracks / 44 RoadTrip-v2 / 14 stem families;
- master-to-master A/B transition desk;
- Soundscape source/gap view;
- Intake;
- Prompt Studio;
- prepared integrated Site Chat grounding from:
  - `SITE_CHAT_INSTRUCTIONS.md`
  - `site-chat-context.json`
  - `intake-contract.json`
  - `prompts/`.

## Evidence before publish

Run `37173411886` / job `111350911259`:
- validator PASS;
- syntax PASS;
- browser 9/9 PASS;
- artifact `11292621270`;
- digest `sha256:6ae512c1dcce56140e7decf6b1fc8b0965a4ffe53b15c77708b4beb13883d4e6`.

## Hard boundaries

- do not use Cloudflare;
- do not merge PR #350;
- do not import the later SFX Prompt Bank during this publish gate;
- do not create a second catalog/runtime owner;
- preserve current private-access behavior unless Sites workflow requires an explicit access choice.

## Acceptance

1. Sites deployment succeeds.
2. Return exact Site project/version identity.
3. Open the exact resulting `.frizzlebob.chatgpt.site` URL.
4. Visibly verify Catalog, Mix, Soundscape, Intake and Prompt Studio are present.
5. Verify integrated Site Chat is attached to this source/context.
6. Persist final URL/version to project Return + KFB Production Control.
7. No merge.

If publishing fails, preserve the QA-green source and report host failure; do not rebuild the product.
