# Research brief (web chat) · Cartoon racer feel R1 · how kart games make wild driving feel safe

From WS0 (KFB steering) · 16.10.2026 · V-352. Research only, no code, no repo changes. Write the result as ONE markdown file named `WSA_CARTOON_RACER_RESEARCH_R1_2026-10-16.md` (Georg uploads it or you push it to the register branch `docs/kfb-decisions-register-2026-10-11` under `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/replies/` – name must start with `WSA_`).

## Context (short)
KFB is a cozy claymation open-world game. FrizzleBob (a clay rabbit) hops into dieselpunk cartoon cars and drives over free terrain between diorama stages – no race track. We want a chill-and-fun, almost roller-coaster-like cartoon driving feel, but the player always keeps control. Physics today: three.js + Rapier (vehicle controller "ecctrl") vs. a kinematic arcade model ("k2b" from our Joyride prototype). Controls: W/S gas/brake, A/D steer with a tight turning circle, Q/E drift ("Tokyo drift", like strafing on foot), Shift boost, Space jump. Known pain points from earlier builds: cars flip over too easily at speed; after a crash you land facing the wrong way or stuck; cars get stuck in corners; rolling slowly off a low ramp leaves the car standing on its nose; on slopes the car hops sideways or rolls forever.

## Questions
1. **Reference games:** Mario Kart (8 Deluxe, World if known), Crash Team Racing, Sonic & All-Stars Racing Transformed, Diddy Kong Racing, Rocket League (car control, self-righting), Hot Wheels Unleashed, Kirby Air Ride / Air Riders, Beach Buggy Racing, Garfield/Hello-Neighbor style cozy kart games, open-terrain arcade drivers (e.g. Lego 2K Drive, Horizon Chase). Pick the 6–8 most useful for an open-terrain cozy game and say why.
2. **Arcade physics tricks** they use (with sources: GDC talks, dev blogs, postmortems, modding docs): fake gravity / downforce, auto-righting and orientation assist in the air, landing assists (snap to ground normal, land in driving direction), anti-roll / low virtual centre of mass, speed-dependent steering, drift models (hop-drift, mini-turbo), wall handling (bounce vs. slide vs. wall-ride), anti-stuck logic (corner escape, reverse nudge, respawn rules), slope handling, small-ledge handling (no nose-standing), collision response with buildings (bounce, squash).
3. **Tricks and hero moments:** jump-triggered tricks (Mario Kart trick on ramp lip, CTR boosts), how they reward without taking control away, camera moves for hero shots (driver visible from the front), slow-mo or "juice" (squash/stretch, speed lines, screen shake limits).
4. **Unlockable moves as loot:** examples where special stunt animations / maneuvers are collected or gifted and then woven into normal driving without disturbing it.
5. **Cartoon deformation:** games that squash/stretch cars on landing, bump and crash (e.g. Mario Kart squash, CTR, Cuphead-like rubber-hose vehicles), and how it is done (vertex shader, bone rig, blend shapes).
6. **Translate to KFB:** a short recommended "assist stack" for our case (open terrain, Rapier), ordered by impact/effort, with concrete parameters where sources give them, and what to avoid. Note what is out of scope for now: full race tracks, item weapons, kart customization menus.

## Rules
- Cite sources with links; mark guesses as guesses. No copyrighted text beyond short quotes.
- Keep it readable: German or English, short sections, a final table "trick → what it solves → effort".
- No code, no assets downloaded.
