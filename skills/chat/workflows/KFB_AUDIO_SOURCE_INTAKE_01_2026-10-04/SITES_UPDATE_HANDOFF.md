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
- **69 total**
- **59 RoadTrip-v2**
- **23 current stem families + 6 pending palette-expansion stem families**
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

Run `37183221284` / job `111377855125`: browser **12/12 PASS**.  
Artifact `11296116173`.  
Digest `sha256:ce04449f53692c7dfc4eec7576437422f0656a01802a679d79e1aa78dd937f2c`.

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

## Three Ambient Bed winners

Also include:
- Utopia Ambient Bed
- Dystopia Ambient Bed
- Protopia Ambient Bed

All three are human-positive masters. Their stems are not yet in GitHub. Keep the visible/source metadata status `STEMS_PENDING_UNLOCKED_DOWNLOAD`.

Georg action outside the Site update: download the already-unlocked Suno stem packages while they remain available without another unlock.

## Six-zone palette masters

Also include these human-positive masters:
- Soul / R&B Ambient Bed
- Piano / Chamber Minimal Bed
- Cinematic / Epic-but-Playable Bed
- Cartoon Chase / Capers Bed
- Folk / Acoustic / Storybook Bed
- Metaphysical / Cosmic Ambient Bed

Their stems are not yet present. Keep them as `PENDING`; do not infer exact BPM from the authoring range.

Prompt Studio grounding now uses the one-block convention:
`BPM/range + short direction + Style prompt`.

## Acceptance

1. Update existing `kfb-audio` Site project — do not create a sibling Site.
2. Open exact live URL.
3. Verify 69 / 59 / 23 (+6 pending stems).
4. Verify Source Lab = 17.
5. Verify Rain remains SOURCE_REQUIRED.
6. Verify Rain percussion card and human-positive tag.
7. Verify 0 browser errors/warnings.
8. Persist new Site version/deployment + source head to this Return and KFB Production Control.

No Cloudflare. No merge.
