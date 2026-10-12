# Florence / @flxrnc · Opus 5.5 Motion Lab · KFB Donor Audit · 2026-10-12

**Mode:** SOURCE/WORKFLOW RESEARCH ONLY. **Status:** METHOD DONOR = KEEP/ADAPT selectively; no runtime, shader or audio-source import, no live Stage, no motion acceptance.
**Direct user-supplied source:** https://x.com/flxrnc/status/2105311836190978392
**Source title:** "Opus 5.5 Motion Lab: Make Claude Animate Like a Studio" (dated 2026-09-30). 
**Public text mirror indexed by web search:** https://adhx.com/flxrnc/status/2105311836190978392
**Related creator example summaries (NOT the same tweet):** https://dropday.ai/c/opus-5-5-motion-lab and https://dropday.ai/c/the-watch
**Access truth:** the original X post and mirror pages could not be opened for direct browser inspection here; exact post title/article narrative, timings and technical claims were recovered through indexed search excerpts with the exact tweet ID. Related indexed exemplars could be opened. Video frames, source repo and runnable code were **NOT** retrieved or independently inspected. Do not label media/source isolation verified; no source artifact copied or licensed.

## Author's findings — source claims, not KFB measurements

The article is unusually specific about iterations, not a "one prompt" success claim:
- Six-second looping liquid-chrome → 7 drops → 3D letters → back; a raymarch/SDF scene combined with three.js TextGeometry; author reports **10 visual follow-up prompts**, 12 transitions checked and **5 sound follow-ups**.
- Controlled earbud comparison: the vague brief led to generic glow/orbs/neon/particles; explicit material, studio-light, camera, timing and ban list plus **15 follow-ups** produced the directed result (source-reported). This directly illustrates KFB's existing RULE1/No-Placeholder/Golden-first policy.
- 3D mascot experiment: anticipation, squash/stretch, arcs, overlapping follow-through/settle, exact beat/landing frames; author reports **71 numerical checks**, six initially failing and later fixed. **KFB must not infer that these numbers or author's fixture are reusable code.**
- Core test tactic: explicit deterministic animation time, optionally `renderAt(t)` and `?t=...`; seeded random; render stills at named timestamps, contact sheet, onion-skin and position/speed curves; compare adjacent frames at each transition and loop seam. A frame must be reproducible without dependence on previous frames.
- For **offline/video** clips only, author suggests stepping 0..N-1 frames (not repeating frame N), exact loop phase and subframe motion-blur sampling where useful.
- Audio experiment: author reports synthesized Web Audio SFX and decoded-output measurement (waveform peak, padding, loudness and relative hit timing), **NOT human listening**. In its showcase the 1-frame-after-picture offset is an author design choice, not a global latency rule.
- Reported shader pitfall: engine/version-specific TextGeometry "height" vs "depth" field; pin source/package versions and audit actual constructors instead of copying arbitrary prompt from a different three.js revision.
- Author's time/cost/quality performance numbers are not independent KFB evidence; no verification of frame render, GPU rate, audio quality, licensing or exported output was conducted in this slice.

## KFB applicability and ownership

| KFB area | Valuable transplant (method, not code) | Existing authority / source | Decision |
|---|---|---|---|
| Weather/Environment | Freeze dry/rain transition frames; check rain emitter cadence, fog change, clouds, sky light, no jump/leak | SKY3 EnvironmentHost / Travel day-night, rain overlay | **KEEP method**; no second WeatherManager/timer/fog writer |
| VFX-01 / Combat FX | Source sprite in isolation, effect at t=0, mid, peak, off, reset and loop seam; check draw calls and visual Clay parity | KFB_VFX_01_REVIEW / existing FX owners | **KEEP method**; no new FX engine; source object before clay context |
| SFX / ChatterBox / world audio | Inspect measured onset and loop seam, but **real listening + speech duck/mute** required for acceptance | KFB Audio single AudioContext / mix owner; Travel Audio | **KEEP measurement method**; **REJECT** independent Web Audio synth as second runtime owner |
| Resident Performance / NPC | Frame-accurate anticipation/recovery, foot-contact, gaze/gesture/voice sync, next frame and predecessor; use actual KFB rig/clip | KAYKIT_NATIVE / Motion/Resident Performance Event Contract | **KEEP offline QA**; no new skeleton/animation/nav owner |
| Joyride / camera | Reproducible source-pinned camera/vehicle reaction capture and before/after impact frames | Joyride + Track Core + current camera owner | **KEEP offline QA**; cannot replace runtime time-state or physics |
| KFB Clay visual language | Numerical briefs paired with Golden stills, source-isolated donor comparison; forbid the default glow/neon/stock-UI drift | Clay K1/H0 Golden, K2/v10 comparison | **KEEP direction discipline**, not the article's PBR chrome/brand/UI |
| KFB World design | Time/beat staging *after* meaningful place/Resident/story relations; no decorative feature-checklist scene | Four-Island Story Recovery / R4 failure postmortem | **HOLD runtime integration** until existing A/B visual gate |

**Not a new capability:** Similar deterministic frame-sampling evidence procedures were already proposed as source-read-only adaptation in KFB Production Control's Movez / NPC Motion audit (2026-10-12). This Florence article independently reinforces and details the method, not a reason to create an additional motion engine.

## Transferable micro-protocol for existing-owner tests (candidate)

1. Lock the exact KFB source rig/clip/sprite/audio file and hash; display original donor **alone** before effects are composited or material-swapped.
2. Declare scene invariants and a numeric timeline: source identity and proportions, camera and view, duration, beat frames, one semantic event from existing authority, light/fog/audio owners, seed, expected start/end behavior.
3. Expose a **read-only, side-effect-free test sampler** that can render a snapshot for arbitrary `t` (or reconstruct the same result from t=0 at deterministic fixed steps if source code is stateful). Do **not** replace the live render loop, animator, mixer or movement controller. Never substitute visual replay for actual runtime behavior.
4. Capture timestamps/frames around all named transitions (at minimum t−1 frame, t, t+1 frame), plus representative mid-frame and loop boundary for actual loops; include raw source and Clay-context stills.
5. Validate frame hashes/geometry transforms with same seed, no gaps/pop/frozen shadow at transition, ground contact/feet, expected single weather writer and resource lifecycle. Compare real GPU draw calls/frame costs in the intended target environment separately; deterministic offline export alone proves no FPS.
6. Use waveform + decoded audio timing/level measures as quantitative evidence, then have a **human** listen to voice clarity, ducking and SFX sound; valid silence/mute preserved.
7. Log each fix request with observed frame number and failure class, before/after evidence, and exact source revision. No self-awarded visual/audio product PASS.

## Critical exclusions

- **Do not transfer the article's liquid chrome, UI sticker aesthetics, font, oranges, mascot or synthetic soundtrack into KFB.** Learn process, not art direction.
- **Do not auto-create** a Remotion/HyperFrames/GSAP pipeline. These are referenced tools, not needed for the receiving KFB Three.js/WebGL owners.
- **Do not implement new real-time timeline/scheduler, sky/fog/lighting writer, root-motion/nav system, AudioContext or video export platform** on the back of a demonstration.
- `renderAt(t)` on an authored clip is not equivalent to arbitrary seek on a live Rapier/world scene; world replay requires authoritative state and deterministic fixtures.
- Source article describes technical measurement-based SFX correction, but subjective sound QA was not shown and remains mandatory.
- **No WorldBuilder R5:** Island R4 F-R39 FAIL / NO MVP / no Golden; Four-Island Story Vision A/B remains the human gate.

## Next gate (shared with this research PR)

**KFB WEATHER/SFX THREE-SCENARIO SOURCE-ISOLATION AUDIT** with frame-exact receipts:
A. existing EnvironmentHost dry→rain→dry and named transition captures; B. real CC0 rain loop via existing Audio mixer with waveform timing + speech duck/mute + listening; C. real existing VFX-01 source shown alone, then compared in Clay with deterministic transition captures. Record actual source identity and timing. No new production implementation is authorized by this research note.
