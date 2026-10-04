# KFB AUDIO SOURCE INTAKE 01 · SITES UPDATE HANDOFF

**Do not create a second Site. Update the existing KFB Audio project.**

Live Site:
`https://kfb-audio.frizzlebob.chatgpt.site/`

Existing Site identity:
- project: `appgprj_6ac1c73dc28881919123106bd6d3e90e`
- current saved version before this intake: `appgprj_6ac1c73dc28881919123106bd6d3e90e~appgver_d542a161ef6c8191adb7f80803df6984`
- current deployment before this intake: `appgdep_6ac1c79c42988191bdfb28bdfd75da14`

Parent source:
- PR #350
- published Return head `64037bc8e181c0796ddc2d505187074e98f04491`

Candidate child source:
- branch `chatgpt-web/kfb-audio-source-intake-01-2026-10-04`
- tested product head `378d7af459d37627a4d5b2285115ecc92ccfc041`
- source root `tools/KFB-Audio-Site/`

## Expected visible delta

Catalog:
- **60 total**
- **50 RoadTrip-v2**
- **20 stem families**
- new `Rain percussion · Beetle / Ring` card with 107 BPM, source-only stems, human-positive tag.

New tab:
- **Source Lab**
- exactly **17 ElevenLabs test candidates**
- HUMAN_TUNE / UNREVIEWED filters
- Play test buttons use existing master preview player.

Soundscape:
- Rain bank must still read `SOURCE_REQUIRED`; tests are not accepted production rain.

Chat grounding:
- old SFX Prompt Bank wording is HUMAN_TUNE and must not be treated as a preferred prompt template;
- ElevenLabs tests are audition-only;
- Rain percussion is a human-positive synced-texture/style reference, not a physical rain source.

## Evidence

Run `37176886034` / job `111360630704`: browser **12/12 PASS**.  
Artifact `11293114042`.  
Digest `sha256:9132d35e7fc34277a74e2c1c80b7a703bebc56026c18d969aba0781da71b1287`.

## Additional human-positive Suno families

The Site update must also include these five complete master+stem families now present in the QA-green catalog:
- Rainy Graveyard · small-room jazz experiment · 89 BPM
- Stormfront Ring · rockabilly electro-funk experiment · 120 BPM
- Wet Neon Road · cosmic surf experiment · 104 BPM
- Wet road rhythmic texture · Road radio · 105 BPM
- Workshop machine pulse · Beetle / Maker Space · 119 BPM

All stems remain `source-only`.

Site Chat grounding also adds:
- musical Ambient Beds as a separate layer between physical soundscape and driving/Jukebox music;
- canonical Utopia/Dystopia/Protopia deck JSONs as semantic inspiration;
- strict external-generator hygiene: no unexplained internal KFB/project/deck identifiers in Suno/ElevenLabs prompts.

## Acceptance

1. Update existing `kfb-audio` Site project — do not create a sibling Site.
2. Open exact live URL.
3. Verify 60 / 50 / 20.
4. Verify Source Lab = 17.
5. Verify Rain remains SOURCE_REQUIRED.
6. Verify Rain percussion card and human-positive tag.
7. Verify 0 browser errors/warnings.
8. Persist new Site version/deployment + source head to this Return and KFB Production Control.

No Cloudflare. No merge.
