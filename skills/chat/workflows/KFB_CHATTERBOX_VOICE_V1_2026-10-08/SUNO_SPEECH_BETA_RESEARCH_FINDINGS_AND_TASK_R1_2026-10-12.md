# KFB Suno Speech Beta · Source-Based Recon + Reproducible Research Task R1
Date: 2026-10-12
Status: PRELIMINARY WEB RESEARCH (official product facts + anecdotal Reddit reports) / AUDIO BENCH NOT RUN
Owner: existing ChatterBox Voice PR #379. Research must not create a second runtime or public Site.

## Official facts
- **Suno Speech beta launched 2026-10-01**. Suno describes generating spoken voice and original background music **together** from a user's idea or authored text plus voice/musical style. Beta opens to community and can have wandering accents and dramatic/unexpected pauses.
  Source: https://suno.com/blog/introducing-speech-beta
- Downloads on Pro: **20/month**; Premier: **60/month**; same track formats and stems covered by one download, re-download same song does not spend another; unused regular allotment does not roll over. Exact user's account tier and remaining downloads **UNKNOWN**.
  Source: https://help.suno.com/en/articles/13926209
- Commercial/public use and licensing for each generated candidate require checking applicable terms and account. User's 60-download estimate does not verify their subscription.

## Reddit user experiences, anecdotal not authoritative
- 2026-10-02, worldbuilding actor/voice test reports slurring, variable accent, overbreathing, clipped words and unrequested beds: https://www.reddit.com/r/SunoAI/comments/1ww7w2s/as_a_worldbuilder_sunos_new_speech_feature_would/
- 2026-10-06, "Speech - is it really working as intended?" reports mid-sentence pauses, undesired music and paragraph-final cutoffs: https://www.reddit.com/r/SunoAI/comments/1wzf9ci/speech_is_it_really_working_as_intended/
- 2026-10-01 announcement thread includes 2026-10-08 complaint of severe degradation past one minute and separate comparisons with earlier spoken-word-tag workflows; competing reports exist: https://www.reddit.com/r/SunoAI/comments/1wve1wx/sunocom_introducing_speech_beta/
- 2026-10-03 detailed musical/style/voice descriptors reportedly improve some outcomes; not controlled evidence: https://www.reddit.com/r/SunoAI/comments/1wwh8c0/what_are_your_thoughts_about_the_speech_model/
- 2026-10-10 short test user reports unnatural heavy gasps; useful as failure candidate: https://www.reddit.com/r/SunoAI/comments/1x2pbg1/this_is_terrifying_to_listen_to/

## KFB test hypotheses, not product facts
H1: **SCRIPT_FIRST exact text** beats open-ended PROMPT_FIRST in preserving KFB rules, lore and satirical intent.
H2: **45–60s** clips retain better intelligibility/voice continuity than 75–120s clips. Compare duration-adjusted controlled content; do NOT claim a hard 60s model cap.
H3: Foreground dry voice + **very sparse, low-volume rockabilly bed** is more legible than busy music; ask for drop-to-silence on callback but evaluate actual output.
H4: Long conversational instruction stacks may introduce stilted pauses; keep musical and character direction specific but concise. Embedded timing directives may be voiced as words or ignored: keep editable cue data separately until observed.
H5: A single full speech+music mix may sound coherent but offers fewer independent controls than existing KFB Audio mix; stay with a single mix for first trial and never duplicate the music bed.

## Actual investigation / minimal experiment
1. Test current Suno Speech UI first, document exact fields/toggles and input limits through screenshots; do not infer from Music Custom mode.
2. Use `data/SUNO_SPEECH_CLOWN_FIRST_TAKE_R1_2026-10-12.json` as control. Same authored transcript; A=full exact text, short sparse style, target 55–60s. B=matched style+prompt-first prose premise **only if A insufficient**, not automatic paid fan-out.
3. When one completed track exists, measure duration; compare audible transcript to source manually, word skipped/inserted, pauses cutting thoughts, singing drift, tempo, character timbre, high-frequency voice fatigue, band masking, end cutoff, and whether the final gag lands with actual silence. Preserve exact prompt, generation settings, take ID, observed times.
4. Audition **in Suno before download** if possible. Download only an actual KEEP/TUNE candidate within shared RoadTrip/Soundscape allotment. Avoid unverified claims of free generations or quota.
5. When real file is available, use established KFB Audio Voice Acting Site as *receiving host* for source-backed mix, caption/mute, audio clock, duck lifecycle. Existing Resident Atlas clown has a verified candidate three-club source only; two-club/inspection/performance acting not yet proven.
6. Record comparisons with clip reference, date/model/UI mode and human notes. One pass of actual tests first; maximum two non-improving repairs on a critical seam, preserve failure candidate and report.
7. Expand research only on observed defects: Suno help + release notes, Reddit r/SunoAI dated since beta, other creators' real examples, controls and workarounds with audio evidence. Separate contradictory anecdotes; do not turn subjective user reports into model performance metrics.

## Evaluation
Hard disqualifiers: lost/wrong key rule, wrong speaker, sung sections when spoken requested, inaudible dialogue, end-truncation of punchline, materially altered authored script, incorrect licensing, or orphaned source ID. Measure exact line retention and end clarity where possible.
Soft A/B: 0/1/2 each for opening hook, comic causality, voice naturalness, pause timing, backing bed, payoff/callback. **RULE1 is the sole editorial quality rule; rubric guides listening, not synthetic laughter certification.** A real human listens to audio for KEEP/TUNE/CUT.
Current actual new Suno renders: 0. Audio test verdict: UNKNOWN. Direct KFB origin anchors `#kfb` and `#cutplay` could not be successfully opened through this research tool; GitHub project origin-reference docs were retrieved, not webpage-pixel verified.

## Handoff
Review with Claude Code/parallel fresh chat under existing owner, preserve URLs/dates and outcome evidence in additive research file. Candidate only. One next gate: `KFB_SUNO_CLOWN_FIRST_TAKE_AUDITION_R1`, exact audio+transcript+rights and real playback review before canon acceptance.
