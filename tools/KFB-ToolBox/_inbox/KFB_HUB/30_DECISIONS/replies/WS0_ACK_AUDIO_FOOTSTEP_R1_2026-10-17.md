# WS0 → WSA · Audio: Footstep-First ACK (V-388) · 17.10.2026

Reply to branch `audio/kfb-racer-motor-grid-r1-v378-2026-10-17` (draft PR #413), `tools/KFB-ToolBox/audio/racer_grid_r1/FOOTSTEP_PILOT_R1.md`.

**ACK, with three TUNE points.**
1. **Footstep-first is right.** The 48-candidate motor grid stays ON HOLD. Georg also finds it too much and too expensive. WS0's own motor set (Hub b69, 12 prompts with 4 variants each) is **also on hold and will be reduced** before anything is generated: 1 variant per prompt, loops 6 s instead of 10 s, and only the roles that are really missing after the R2 donor audit.
2. **Sound character, as Georg puts it:** "visceral, muted, cardboard-dull", warm and substantial, never clicky. In prompts, write e.g. "muffled soft cardboard-and-clay thud, low-mid weight, no click, no squeak, dry, isolated". Gaits: walk, jog, sprint and hop only where real clips with measured contacts exist (KayKit `Walking_A`/`Running_A`, Motion Library). No invented jog/sprint. Landing only from the support state, never from the animation.
3. **Micro-proof builder and location (corrected 17.10., V-389):** WSA work, **in the KFB Audio Site** (`tools/KFB-Audio-Site`, the site Georg knows as "KFB Audio 0.5.1"). It is the only audio owner, with soundbed, mixing, dialogue ducking and buses, so footsteps belong there too. Next to it goes a small motion preview (real Rig_Medium + walk/run/jump), which reads the measured contacts from the existing ToolBox page `kfb-hub/stage/toolbox/kaykit-motion-lab-v1/` ("KayKit Motion Lab"; `locomotion-profiles.v1.js`). No new tool, no second audio owner. Use 3 existing material banks (grass/concrete/gravel) and a landing. Integration into the game comes later, with slice 3 audio (V-379).

**Paid batch (6 files, about 280 credits, 4 clay steps + 2 landings):** only after the micro-proof, and Georg starts it himself. The API key stays with Georg and never goes into a repo, a log or a chat. Licences of the non-Kenney foley/400-sounds files must be checked before production use.

Return: fixture link (staging), contact-drift and double-step measurements, and short audio/video clips for Georg.

## One event timeline (V-389)
Footsteps, SFX, VFX, light and dance are cues on **one timeline**, so they work together in the game (WS1) and in the comic motion/music video (WSV, Remotion). `kfb.performance/1` is extended additively: `sfx[]` (e.g. footstep, land, clap, with surface), `vfx[]` (puffs, sparks, confetti), `lights[]` (V-387). In the game the same cues come from live events (contacts, M2EVENTS); in the video they are pre-rendered. **Footsteps in karaoke dances** (derived from the dance clips' contacts) are planned but deferred.
