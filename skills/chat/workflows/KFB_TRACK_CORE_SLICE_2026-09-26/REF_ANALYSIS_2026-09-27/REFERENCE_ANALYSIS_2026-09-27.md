# Reference analysis · Race Track Builder · Stunt Paradise 2 · Mario Kart World · 2026-09-27

**Why:** Georg (27.09) asked to re-analyse the original references for construction logic, track and speed simulation, design and gameplay, against today's Track Core v0.8.1, so nothing gets lost or built twice.
**Sources:** `KFB Stunt Car Race/reference/`:
- `Race Track Builder (Speed)`: 18 frames + `StuntSpeedRaceTrackBuilder_01.pdf`
- `Stunt Paradise 2 (Scenic)`: 10 frames + PDF
- `Super Mario Kart WolrdTour (Game Design)`: 17 frames + PDF

Each PDF is the same frame set at higher resolution. Every frame was looked at, by three parallel readers plus spot checks. Earlier notes: `_handover/WEBCHAT_SLICES_2026-09-10/PRODUCT_COMPASS.md` (10.09, a short summary; this goes deeper and maps to the core).

## Limits first

- **All three are short videos, not gameplay we played.**
  - RTB is a Godot 4.4 devlog prototype ("Build_N_Race", 1:46).
  - SP2 is a 0:53 pre-release trailer with trailer cameras, so its steering and camera cannot be judged.
  - MKW is an 81 s Nintendo update trailer (SNES remakes).
- Rails, wall riding, charge jump, recovery and the MKW modes are **not visible**. They are marked [public knowledge] in the appendix.
- Speed values in RTB come from a debug HUD. The km/h may be scaled for feel, so they are not physics truth.
- Principles only: no Nintendo IP (boxes, coins, pipes, Lakitu, chevron boards as styled), no third-party looks.

## The three references in one line each

| Reference | Georg's label | What it really teaches |
|---|---|---|
| Race Track Builder | Speed | **Building by relative parameters** (turn / climb / roll + length + ease, next piece at the end frame), and **speed feel from feedback, not from m/s**: FOV, streaks, flames, a continuous wall-stick value |
| Stunt Paradise 2 | Scenic | **The stunt island as a staged clearing**: entry pad → stunt → landing / fail zone, dressed in a ring, with a backdrop from a landscape seam; one reserved "ride me" accent; chevrons that glow while in use |
| Mario Kart World | Game design | **Surface is the level design; reward sits on the risk; forgiveness allows daring edges; the road between venues is where the biome and the story change** |

## Cross-cutting synthesis → Track Core

**Already stronger in KFB (keep, don't regress):**

- A compiled stream with checks. RTB has no clearance, landing or junction logic.
- Physics-checked KICKER → AIR → LANDING.
- Width classes and responsive tunnels.
- Forks / Weiche.
- The vehicle envelope.

**Gaps the references expose, in MVP order** (matches RECON §6, nothing new invented):

1. **Race data in the stream.** The first six items were all already on the MVP list; the last three are new from the references.
   - start/finish, checkpoints, target-time medals (RTB);
   - respawn at the nearest stream sample (MKW: forgiveness first, *then* daring edges);
   - **surface id per slot**, mapped to the older Racer's presets (MKW: skin ⇒ surface; RTB: pipe = low grip);
   - stunt zones with bypass;
   - **new:** collectible / pad placement as data `(s, u)` with the rule "reward sits where risk is" (MKW);
   - **new:** a declared trade-off per branch (shorter / risky vs longer / safe);
   - **new:** field size decides the width budget and the choke points.
2. **Drive proof on the core** (the v0.8 vs Rapier comparison). Add a **speed-feel layer**:
   - FOV + ≈15–20° over base (not RTB's 150°);
   - speed marks drawn in the clay style;
   - boost flame.

   Add a **continuous stick value 0–1** = f(speed, surface angle, magnet flag). This is the first runtime consumer for `magnet_catch` / `zero_g` and the stunt states capture → commit (RTB).
3. **Edge layer** (S4 v2 Phase A): red/white rolled kerb as the default race edge (RTB), hatched runoff and chevron cues on tight curves, placed from the stream's curvature (MKW), gravel / sand bed.
4. **Stunt islands in the OSM world** (SP2):
   - author as a package: entry pad (we have pads), stunt, landing / fail zone, a dressing ring (Rule-of-Three), an OSM backdrop anchor;
   - put them at **seams**: bridge heads, embankments, quay walls, car-park edges;
   - one **reserved interactive accent** (the pattern stays constant, the colours come from the seed);
   - chevrons glow while in use, driven by the drive-mode metadata.
5. **The OSM corridor as the "travel road"** (MKW): satire, traffic as moving hazards, and the biome change happen on the corridor. Fantasy tracks are the dense venues.
6. **Many small tricks, a few big jumps** (MKW): trick-able micro-bumps (low CREST) with a landing reward. Big kickers stay the highlights.

**Candidate new pieces / tools** (proposals, Georg decides):

- `HALFPIPE` / slide-pipe cross-section, with the surface bound to it (RTB).
- Gap loop: a loop variant with an AIR segment at the top (SP2). The older Racer's LOOP_REAL is related; check that first.
- `RAIL` = a narrow stream with drive mode `locked` + a release rule; wall-ride = a steep bank + magnet fx (MKW, public).
- **Bank-vs-speed check:** ideal bank = atan(v² / (g·R)). With g 15, v 27 and R 50 that gives about 44°. Warn when the set bank is off by more than about 15° (RTB hand-sets extreme banks).
- **Live builder panel** over the recipe compiler: pick a piece, sliders for turn / climb / roll / ease, "next" attaches at the end frame, live recompile and checks (RTB). This has the highest leverage for building fast, and is a tool, not a dashboard.
- A dev-only physics overlay: stick, air, drift, FOV, speed (RTB).

**Do not copy:**

- RTB: 150° FOV and fisheye; node-per-piece chains without checks; its look.
- SP2: skeletal stilt and cable supports (Georg 27.09: no suspensions or structures in the track, beam constructions are not cartoony enough); faceted low-poly rock; realistic fire crashes. Use a cartoon squash-poof instead.
- MKW:
  - Nintendo iconography;
  - **knockout elimination**, because it is a gate and KFB is pull, not gate (falling behind should change your role or route, never mean exit);
  - an item-lottery catch-up that undercuts "same physics for all vehicles";
  - glossy rendering.

## Decisions for Georg (from this analysis)

1. **Field size:** how many cars per race? This decides the width budget and the choke points.
2. **Live builder panel:** worth building now as a tool, or after the drive proof?
3. **Stunt islands:** do they count as MVP for the OSM corridor, or come later?
4. **Collectibles:** KFB's own token (card seeds?), placed by risk, yes or no?

---

# Appendices · full reader reports

## Appendix A · Race Track Builder (Speed)
**Material check:** I looked at all 18 JPGs and all 18 PDF pages. The PDF has the same 18 frames with the same video timestamps (0:05 to 1:45 of a 1:46 clip), just at higher resolution (about 1820 px wide instead of 1500). It adds no new content. The higher resolution only makes the debug text easier to read, and I used it for that. Where this report cites "rtb_NN", PDF page NN shows the same frame.

### 1. What it is

- **[observed]** These are screenshots of a developer's video of a Godot 4.4.1 project called "Build_N_Race". The editor is in French, running on Windows. Frames 1–2 show the editor and frames 3–18 show a debug play session. It is a work-in-progress prototype, not a shipped game.
- **[observed]** The car is a generic low-poly orange sports car. The track floats as ribbons above an endless flat orange ground with a faint grid (rtb_17, rtb_18). The sky is a stylised cloud skybox.
- **[inferred]** It is a solo or indie tutorial or devlog project. The builder and the racing mode live in the same project ("Build Mod" folder, rtb_01).

### 2. Build logic

- **One parametric piece generator, not snapping and not free splines** [observed, rtb_01, rtb_02]. A single inspector component builds each piece from these fields:
  - piece type
  - **Y angle** (yaw change), **X angle** (pitch change), **Z angle** (roll/bank change)
  - **Z Smooth** and **Horizontal Smooth**, both set to −1 in the frame. [inferred] These are easing exponents that spread the angle change over the piece length.
  - **Horizontal Offset** (sideways shift)
  - **Length** (110 in the frame)
  - **Cut** (20). [inferred] Number of segments along the piece.
  - **Mesh** and **Mesh Offset Y**
  - **Prev Piece** and **Create New**
- **Chaining** [observed, rtb_01]. The scene tree nests each piece as a child of the previous one (a deep Node3D chain). [inferred] Each piece starts at the end frame of its parent. "Create New" spawns the next piece, so building works like a turtle drawing: turn, climb, roll, length, next.
- **Piece types** [observed, rtb_02 dropdown]: Normal Road; Slide Pipe in 10, 15 and 20 m sizes; Nothing (probably a gap, meaning a jump); Test. That is a very small library.
- **Meshes** [observed, rtb_02]: a road mesh loaded from a model file plus an asphalt texture. [inferred] The generator bends the mesh along the piece rather than building the geometry procedurally.
- **Width** [inferred]: one fixed width for the road. The pipes are narrower tubes. There are no width steps, splits or junctions anywhere.
- **Banking** [observed]: the road is heavily rolled in places, up to near-vertical walls (rtb_07, rtb_08). Bank is set per piece through Z angle.
- **Supports, terrain, junctions, connectors**: none visible. The track floats with no pillars and casts shadows onto the plane (rtb_01).
- **Editor aids** [observed, rtb_01]: green cone markers on the road surface. [inferred] They mark piece seams or checkpoints, because they also show up in play (rtb_08, rtb_17). There is a standard move/rotate gizmo and a small distance readout in the viewport.

### 3. Track and speed simulation

- **Speeds shown:** 0, 12, 65, 109, 130, 149, 151, 160, 164, 167, 176–180, 188 and a peak of **211 km/h** (rtb_13). Cruising sits around 150–190 km/h, which is roughly 42–53 m/s. [These] The speedometer may be scaled for feel, so don't read it as a real physics value.
- **FOV rises with speed** [observed in the debug readout]: about 114 at 65 km/h, about 137–147 at 150–190 km/h, and 150 at 211 km/h. That is extreme. Visible fisheye stretching bends the kerbs and pipes in rtb_07, rtb_13 and rtb_16.
- **Camera distance** [observed]: a "calculated distance" of about 2.6–3.3 plus a speed-dependent extra of about 0.2–0.5. A "cam pos offset" value jitters at the 0.01–0.1 level, which [inferred] is procedural camera shake.
- **Speed feedback layers** [observed]:
  - white speed lines on the ground (rtb_05, rtb_06, rtb_14, rtb_15)
  - the sky smeared into radial streaks, like an anime background (rtb_04–rtb_16)
  - motion-smeared track edges
  - blue exhaust flames while boosting (rtb_05, rtb_16)
- **Boost** [observed]: a flame icon inside a ring gauge at bottom left. Extra white and grey arc segments appear next to it (rtb_08, rtb_09, rtb_14). [inferred] It is a segmented boost charge that drifting or airtime may fill.
- **Drift** [observed]: a "drift want" flag, white tyre smoke (rtb_03, rtb_04, rtb_17) and sideways slides at low speed.
- **Slide pipes** [observed, rtb_10–rtb_12]: blue ice or water tubes. A "slime drifting" value reads 1.0 while inside one, with water spray at the wheels. [inferred] The pipes change surface grip, so they act as a surface type as well as a shape.
- **Wall-ride** [observed]: a "Spider man value" between 0 and 1. It reads 1.0 on the steep bank in rtb_07 and on the pipe exit in rtb_13, and 0.39 on a vertical wall in rtb_08. [inferred] This is a continuous stick-to-surface factor, not an on/off state.
- **Jumps and air** [observed]: an "air time" value, and the car flies tilted off a pipe end in rtb_09 with a large rotation value (Speed_Rot_Z −5). The car tumbles in rtb_13. [inferred] The model is loose, arcade-style rigid-body physics with rotation damping.
- **Debug gizmos** [observed]: green up-arrows at each wheel (probably suspension rays or ground normals) and red and blue direction rays (rtb_04, rtb_11).

### 4. Design language

- **Scale:** the road reads as about 3–4 car widths [These].
- **Colours:** grey asphalt with a **continuous red/white striped rolled kerb** on both edges. The kerb is the only real edge treatment and the main direction cue (rtb_01, rtb_03). The pipes are saturated blue with an ice texture. Red slabs stand in rows as obstacles or slalom posts (rtb_15–rtb_18), and one "OK" label is visible in rtb_18. Green arrow cones mark direction.
- **Barriers and runoff:** none. You can fall off the ribbons straight to the ground plane. The ground itself works as runoff, and the car drives on it in rtb_15–rtb_18.
- **Scenery:** none at all, just a flat plane and sky. It is readable only because it is empty.
- **HUD:** condensed italic yellow type in the style of a sports broadcast.

### 5. Gameplay

- **[observed]** The top-left counter reads "Checkpoint 1/5" and never changes during the whole clip. [These] Either the checkpoints were not triggered or progress is broken.
- **[observed]** A stopwatch shows elapsed time and a trophy shows a target time of 03:15:00. [inferred] The goal is a time trial against a medal or target time.
- **Not visible:** no opponents, laps, menus or progression, and no in-game build UI. Building happens in the Godot editor.

### 6. Mapping to KFB Track Core

| Feature | Reference | KFB status | Recommendation |
|---|---|---|---|
| Relative piece parameters (yaw/pitch/roll change + length + ease) | Piece-creator inspector, rtb_01 | have (recipes, CURVE_EASE, bank per piece) | Adopt the principle: one easing parameter per axis in the recipe schema (heading, pitch and bank ease on their own), not only a clothoid on heading |
| Live in-scene piece editor (pick piece, sliders, "next") | rtb_01, rtb_02 | missing (recipes are text/JSON) | Adapt: a light three.js editor panel over the recipe compiler, with next-piece and live recompile. Highest leverage for building fast |
| Piece library picker | dropdown, rtb_02 | partial (piece set rich, no UI) | Adapt: grouped picker (Road, Stunt, Pipe, Junction, Pad) |
| Half-pipe / slide tube piece | Slide Pipe 10/15/20 m | missing (closed tunnels only) | Adapt: a HALFPIPE cross-section profile in the 14-slot section, with fixed lengths as presets |
| Surface-coupled piece (pipe = low grip) | "slime drifting" | older-Racer-has (ICE/OIL/DRIFT presets); core has skins only | Adopt: tie skin to surface preset in section metadata |
| Wall-ride stick factor | "Spider man value" 0–1 | partial (magnet_catch metadata only, no consumer) | Adopt the principle: continuous stick = f(speed, surface angle, magnet flag), fed into the stunt states capture/commit |
| Bank vs speed rule | extreme hand-set banks | partial (manual bank) | Add a check: ideal bank = atan(v²/(g·R)). With g = 15, v = 27, R = 50 m that gives about 44°. Warn when the set bank is off by more than about 15° |
| Speed-linked FOV | 114→150 | missing in core; older Racer has a camera | Adopt the principle, capped at about +15–20° over base. 150 is too much |
| Speed lines, sky streaks, exhaust flame | rtb_05–rtb_16 | missing | Adopt as a speed-feel layer. In the clay look, speed lines can be drawn marks |
| Camera distance + shake by speed | cam dis / offset | older-Racer-has (railClamp) | Keep the older camera and add a speed term |
| Boost gauge filled by drift/air | flame ring | partial (BOOST surface in older Racer, no meter) | Adapt: a charge meter as a reward for stunts |
| Red/white rolled kerb | everywhere | missing (edge layer) | Adopt as the default edge for track/toy skins |
| No barriers, fall to plane | whole clip | have barriers | Ignore. Keep barriers plus respawn |
| Checkpoints + target-time trophy | HUD | older-Racer-has gates/laps; core missing | Adopt target-time medals when race logic lands on the core |
| Gap piece ("Nothing") | dropdown | have (KICKER→AIR→LANDING with physics check) | KFB is ahead. Ignore |
| Slalom slabs / obstacle rows | rtb_15–rtb_18 | missing (props) | Adapt as gate or domino props |
| Live physics debug overlay | right-hand panel | unknown | Adopt as a dev-only toggle (stick, air, drift, FOV, speed) |
| Floating ribbons over an empty plane | world | n/a (OSM plus terrain coupling planned) | Ignore |

### 7. Takeaways

**Top 5 for KFB**
1. **Speed feel comes from feedback, not from m/s.** The reference feels fast mainly because of FOV, streaks and flames. KFB can get the same feel at vMax 27 m/s without touching the jump and clearance maths.
2. **A live builder loop.** Pick a piece, change angles and ease, and the next piece attaches to the end frame. Putting this panel on top of Track Core's compiler would make course building interactive.
3. **Stick as a continuous 0–1 value.** It gives the magnet and zero-g metadata a runtime consumer and matches the capture/commit states.
4. **Pipes as shape plus surface.** Couple the cross-section profile to the grip preset so a piece's type tells the player how it behaves.
5. **One loud edge language.** A striped rolled kerb, plus direction cones at piece starts, keeps busy stunt geometry readable.

**3 things not to copy**
1. **150° FOV and fisheye distortion.** It causes motion sickness and would destroy the claymation look. Cap it.
2. **The deep node-per-piece chain with no connector validation.** KFB's compiled stream with checks is the stronger design. The reference has no clearance, landing or junction logic.
3. **The look itself** (generic sports car, broadcast-style yellow HUD type, empty orange desert, stock-style assets). It is a bad fit for KFB, Georg decides the look, and only the principles above are worth taking.

## Appendix B · Stunt Paradise 2 (Scenic)
### 1. What it is

**[observed]**
- All material comes from one pre-release trailer. It runs 0:53, was screen-captured from reddit and carries a "Wishlist on Steam" badge.
- The 10 JPGs are not in trailer order. By timestamp: sp2_04 is 0:00, 03 is 0:03, 02 is 0:12, 01 is 0:30, 05 is 0:36, 06 is 0:41, 07 is 0:45, 08 is 0:48, 09 is 0:51 and 10 is 0:52.
- The PDF holds the same 10 frames in the same order at higher resolution (about 1823 px wide against 1500). The content is the same. The only extra value is sharper small detail, for example the ramp plates at the viaduct on p.6 and the rainbow pad on p.8.
- The look is stylised and low-poly: faceted rocks, stylised conifers and a realistic-ish 60s muscle car.
- There are two biomes. One is a green forest roadside with a gas station, garage, burger drive-thru sign, tanker truck, satellite dish and hot-air balloon. The other is an autumn canyon with orange larches, rail track with a freight train, a stone arch viaduct, a waterfall gorge and a fire lookout tower.
- There is no HUD in any frame.

**[inferred]**
- All camera work is trailer cinematography (drone orbits, worm's-eye shots), so it says nothing reliable about the gameplay camera. The "restricted steering" noted on 10.09 cannot be checked from stills.
- It looks like a free-roam stunt sandbox, not a circuit racer. No track, lap gates or rivals are visible.

### 2. How the stunt installations are built

- **One visual family.** Every stunt piece has black frame edges and a yellow multi-stripe running surface. The stripes follow the direction of travel, and in places they are chevrons. You can read "this is a stunt object" at any distance. Grass, dirt, asphalt and rock never carry that colour.
- **Gap loop (sp2_01, sp2_05, PDF p.1/p.5).** This is a vertical U open at the top. [inferred] The car climbs one arm, crosses the gap inverted and catches the other arm, like Hot Wheels.
  - It stands on thin black stilts with no foundation, placed on flat dirt.
  - Two saw blades are mounted on the base legs.
  - A separate short curved kicker (a quarter-pipe piece) stands a few car lengths away. It is unclear whether this is the exit catcher or a second stunt.
  - The inner lane chevrons are unlit in sp2_01 and glow emissive yellow in sp2_05, while the car is riding. [inferred] This is state feedback: the piece lights up when it is active.
  - Scale by eye: the loop is about 4 to 5 car lengths tall, so roughly 18 to 22 m.
- **Start pad (sp2_01).** A flat black slab with yellow chevrons, about 1.5 car lengths, sits on open ground about 10 to 12 car lengths from the loop, with nothing built between them. [inferred] It is a spawn or start marker. The approach is simply open terrain, and the player picks the line.
- **Road ramp (sp2_04, PDF p.4).** A long, shallow yellow-striped ramp sits diagonally across the road edge and verge, not aligned to the lane. A burst of gold particles marks its foot. [inferred] This is either a placement/spawn effect or a "take-off here" cue. The installation is dropped into the world rather than built into the road.
- **Viaduct plates (sp2_06, PDF p.6, crop checked).**
  - Two steep yellow-striped plates stand at the abutment where the rail meets the arch viaduct, one at the near edge and one further along.
  - The purpose is unclear: launch ramps onto or along the viaduct, or gate flaps.
  - A freight train runs right beside them, so the stunt is placed at a landscape seam: rail, cliff edge and bridge head.
- **Canyon cable decks (sp2_07, sp2_08).**
  - Two curved deck sections hang from cables anchored on the cliff tops above a turquoise plunge pool. There are no ground supports.
  - Take-off is from the upturned end of the left deck. The right deck is lower and curved like a catcher.
  - Upper right: a cable-hung launcher block, a chevron pad and small glowing markers on stilts. In the far background there is a rainbow-striped arch or loop. The p.8 crop shows a rainbow pad and a red object on a stilt table, meaning unknown.
  - Water is the fail zone.
- **Pantograph arm (sp2_09, sp2_10).** A scissor mechanism on a gear hub, mounted on a rail frame, with sparks at a joint. An explosive barrel hangs from a gallows pole next to it. In sp2_10 the car is in the air and bursting apart, with wheels trailing smoke and a cartoon fireball.
  - [inferred] The arm is a moving obstacle or launcher, and the barrel is the trap. Which one sets off the explosion is ambiguous.

**Composition rule [inferred]:** every installation stands in a cleared "stage". Its approach and landing ground are free, rocks and shrubs ring the edge, and a landscape feature (rail, viaduct, gorge, sky) sits behind it as backdrop.

### 3. Scenic composition

- **Contrast carries readability.** Yellow/black stunt furniture sits against sand, orange foliage and turquoise water. Each biome has 2 to 3 dominant hues, and the stunt yellow is the only saturated accent that repeats everywhere. It reads even inside the autumn palette, which is itself yellow-orange, because of the hard black edges and stripe rhythm.
- **Silhouettes against the sky.** The U-loop, lookout tower, pantograph and gallows pole are tall and thin and break the horizon. They read as landmarks from far away.
- **Depth.** There is strong aerial haze in the canyon: sp2_06 shows a ship-like silhouette fading into the mist. The viaduct curve leads the eye to the vanishing point. Warm low sun casts long tree shadows, and the arch shadows fall on the water (sp2_07/08).
- **Dressing grammar.** Scattered faceted boulders at three sizes, shrub clumps, bare snag trunks, leaning trees, and a moving train as animated dressing. In the forest biome: Americana roadside signs (GAS, Garage 24H, Burger) as landmarks, and bird flocks for life.
- **Hazards as staging.** Saw blades, the gallows barrel and water are shown as spectacle props. They explain themselves visually (spinning, dangling, glowing) and need no text.
- **Seen at speed [inferred].** Big stripe blocks and silhouettes survive motion blur, while fine dressing drops away. There is no rule about near-track clutter density, because there is no track.

### 4. Speed and stunt physics cues

- Jumps are big relative to the car. The canyon gap spans several car lengths and the drop to the water is large. The loop height is about 5 cars.
- Air time is staged in every frame from 0:36 on (sp2_05, 07, 08, 09, 10). The car is shown airborne, often upside down.
- Crash physics are arcade: the car body breaks into panels, detached wheels fly with smoke trails, and a cartoon fireball ring appears. This is destruction as payoff, not as punishment.
- There are no speed lines, boost FX or trails except tyre smoke in the menu shot.
- The camera during stunts pulls far out: high oblique or worm's-eye, framing the car against the sky or water so the jump reads as a whole arc.

### 5. Gameplay loop and meta (as far as visible)

- **Menu (sp2_03).** Start / Settings / Credits / Exit, laid over a live diorama with a drifting car.
- **Vehicle choice (sp2_02).** Next/previous arrows, a named car and a colour cycler. The colour change is diegetic: two floating spray cans spray the car in the world, at the gas station.
- **Hub [inferred].** The gas station and garage are the hub or start area, and the stunt zones are out in the landscape.
- **Not visible:** goals, scoring, timers, currency, unlocks, challenges. There is no evidence of a reward structure.

### 6. Mapping to KFB Track Core

| Feature | Reference | KFB status | Recommendation |
|---|---|---|---|
| Stunt installation stands alone in open terrain | loop, kicker, pad on dirt | partial (pads, KICKER→AIR→LANDING in-route; no terrain coupling) | adapt: "stunt island" = pad + piece + landing in a cleared terrain patch |
| Gap loop (open top) | U-loop | missing (LOOP teardrop only; older Racer: LOOP_REAL) | adapt as LOOP variant composed with an AIR segment |
| One uniform "stunt furniture" colour code | yellow stripes / black rims | partial (skins, magnet arrow bars) | adopt principle: one reserved accent family for interactive surfaces, seeded by palette |
| Emissive lane chevrons when active | loop glows while ridden | partial (markings exist, no runtime) | adopt: tie to drive modes/fx (magnet_catch, assist) |
| Start/spawn pad with chevrons | sp2_01 | have (pads) | adopt as stunt-island entry and respawn |
| Hazards as props (saw, barrel, arm) | 01, 09, 10 | missing (props/dressing) | adapt as clay/toy gags, non-lethal |
| Cable-hung decks over water | 07, 08 | missing; underside slot only | ignore the structure; keep "catch deck over water" for Rhein-Hüpfer |
| Viaduct / bridge-head stunt | 06 | partial (tunnels, bridge shells in Blender) | adopt principle: put stunts at landscape seams |
| Moving train as dressing | 05, 06 | missing | adapt later (animated dressing layer) |
| Landmark signage | GAS / Garage / Burger | older-Racer-has (billboards) + cartoon-sign direction | already covered, confirms direction |
| Biome palettes, aerial haze | green vs autumn, fog | older-Racer-has (environment grammar), no fog | adopt fog/depth layering for OSM long views |
| Crash spectacle | 10 | partial (older-Racer stunt state recover) | adapt as cartoon "poof" without fire realism |
| Diegetic colour customisation | spray cans | partial (card seeds, colour seeding) | adopt: in-world seed/colour moment |
| Race logic, HUD, goals | not shown | missing | no reference value |

### 7. Top 5 takeaways for KFB

1. **A stunt island is a staged clearing, not just a track piece.** For OSM world placement, author each island as a package: entry pad, the stunt, landing or fail zone, a ring of clay boulders and shrubs as its frame, and a backdrop anchor from the OSM scene (a bridge, the Dom, the Rhine). Keep the approach and landing corridor free of dressing.
2. **Reserve one interactive accent.** Stunt surfaces carry one high-contrast stripe code that the environment never uses. In KFB the colours can come from the seed, but the pattern and rim contrast must stay constant so any palette still reads "ride me".
3. **Put stunts at seams.** The strongest frames sit where two landscape systems meet: rail and viaduct, cliff and water. For OSM, seams are bridge heads, embankments, quay walls and parking-deck edges.
4. **Show state with light.** Chevrons that glow while in use are cheap feedback and fit the planned glowing HUD and branch hints. Drive them from the drive-mode metadata so that metadata finally gets a consumer.
5. **Dressing in three sizes around every installation** (big rock, mid shrub, small pebble), plus one tall silhouette per island for reading from far away. For claymation, make these dented clay lumps and toy props, not low-poly facets.

**Don't copy:**
1. **The skeletal black stilt and cable supports.** They conflict with Georg's loop verdict of 27.09: no suspensions or structures in the middle of the track, and beam constructions are not cartoony enough.
2. **The faceted low-poly rock and generic Americana roadside kit.** They are anonymous and not claymation. KFB needs dented clay and elastic-grotesque landmarks.
3. **Realistic explosion and fire as the crash payoff.** It clashes with chill & fun and the satire tone. Use a cartoon squash-poof instead.

**Ambiguities, stated plainly:** I can't confirm what the viaduct plates are for, what the pantograph does, the meaning of the rainbow pad and stilt-table object, the gameplay camera, or any goal or reward system. The frames don't show them.

## Appendix C · Mario Kart World (Game design)
**Source caveat:** the 17 JPGs and the 17-page PDF are the same set of frames, in the same order. The PDF is just a higher-resolution copy (about 1823 px wide against 1500 px); I found nothing in it that the JPGs lack. All frames come from one 81-second Nintendo trailer on YouTube, for a free update (version 1.8.0 shown on screen) that adds remade tracks from Super Mario Kart, the 1992 SNES game. Several frames carry a small picture-in-picture of the SNES original. So this is marketing footage, not gameplay capture. It shows no rails, wall riding, charge jumps, respawns or menus beyond the world map. Everything about those comes from public knowledge, not from these images.

---

### 1. What is shown

**[observed]**
- **Four remade SNES tracks:** ice lake (Vanille-See 1), dirt island (Schoko-Insel 1), wooden ghost boardwalk (Geistertal 1), and a flat SNES-style Mario Circuit. The trailer also shows the SNES original in a small inset window.
- **Mario Circuit seen from above (mkw_02):** the flat SNES layout sits embedded in the open landscape. It has a grass infield, colour-block barriers, pipes on the track, a grandstand, and a road leaving the area at the top left.
- **Travel roads:**
  - mkw_03: highway with traffic (car transporter, truck), guard rail, a floating item box, a bright magenta/orange boost pad on the right, and a ramp further ahead.
  - mkw_12: autumn road with traffic cars and a Bullet Bill.
  - mkw_15: mountain hairpin with a bus and orange hatched runoff.
- **World map (mkw_05, mkw_11):** a painted map with clearly separated regions (desert, volcanic, green meadow, water, snow, Japanese-style). Venues sit on it as small dioramas. mkw_11 joins them with dotted roads and shows a row of cup icons ("Turnip Rally"). mkw_05 shows a track list.
- **HUD:** coin counter, lap counter showing 1/5 on SNES tracks (SNES used 5 laps), two item slots (top left), minimap (outline with racer heads, or a round map on the roads), big place number (5th, 8th). mkw_12 shows "Be 20th or better!" and a counter of 1/6.
- **Direction signs:** yellow chevron signs (>>> / <<<) on barriers and turns (mkw_07, 08, 09). Kerbs are green and white.
- **Item plates:** the "?-Platten" are flat item plates on the road, carried over from SNES (mkw_10).
- **Drift and tricks:** drifting with dust plus blue sparks at the rear wheels (mkw_04, 09). A mid-air trick pose: Donkey Kong, arms out, over a small bump (mkw_06).
- **Coins:** a coin on the centre line of the narrow boardwalk (mkw_08), and a row of coins along the edge (mkw_04).
- **Items on the road:** a mushroom item lying on the track (mkw_12, 14); karts bumping each other (mkw_14).

**[inferred]**
- The subtitle over the aerial shot ("have you ever noticed strange-looking environments?") suggests the flat SNES layouts were already hidden in the open world before the update, as easter eggs.
- mkw_12 is Knockout Tour: 1/6 counts sections, not laps.
- mkw_17 is a finish gate made of floating item boxes, but the image is too blurry to be sure.

**[public knowledge]**
- Launch title for Switch 2 (June 2025).
- 24 racers.
- One connected open world with Free Roam.
- In Grand Prix you drive between tracks along roads.
- Knockout Tour is a nonstop rally that eliminates racers at checkpoints.
- Rail grinding, wall riding, charge jump.
- Coins raise top speed.
- Lakitu recovery, rewind in single player.
- Assist options: smart steering and auto-accelerate.

---

### 2. Track design for gameplay

- **Width versus number of racers:**
  - The travel roads are two or more lanes of real-road width (mkw_03, 12, 15). In mkw_15 around a dozen racers fit side by side through a hairpin, with space left over.
  - The SNES remakes are much wider than the originals. The ice lake (mkw_01) is essentially an open plane.
  - Principle: width grows with the field size (24 racers) so crowding happens at chosen choke points, not everywhere.
- **Surface as the design itself:** each SNES track is one surface idea (ice, dirt, planks over swamp, asphalt).
  - Surface changes are readable at a glance: snow bank against ice, mud pond against dirt, swamp against boardwalk.
  - The penalty zone is always a different material and colour, never just a line.
- **Multiple lines:** on the ice lake, pipes split the plane into lanes (mkw_07). On the highway, traffic acts as moving lane blockers. I cannot see true shortcuts in any frame.
- **Items and coins:**
  - Item plates lie across the racing line. Item boxes float at lane edges.
  - The boardwalk coin sits exactly on the ideal line of a no-barrier section. Risk and reward are put in the same spot.
- **Boost pads:** placed at the lane edge on straights (mkw_03), before a ramp. You choose between the pad and the traffic lane.
- **Hazards:**
  - Pipes on the runoff and inside the track (mkw_09, 07).
  - Piranha plants at the track edge (mkw_04).
  - Traffic, Bullet Bill.
  - Deadly edges: the boardwalk has no barrier.
- **Readability:**
  - Chevron boards at every turn.
  - High-contrast kerbs.
  - Colour-block barriers.
  - Chevron-hatched runoff at the mountain hairpin.
- **Elevation:**
  - The SNES remakes stay deliberately flat, with only small bumps used for tricks.
  - The travel routes carry the elevation: a mountain road cut into terrain with a retaining wall (mkw_15), and a stone ramp at the Japanese venue (mkw_16).

### 3. Speed and handling feedback

- **Drift:** dust plus coloured sparks at the rear wheels. The frames only show blue sparks. **[public knowledge]:** sparks climb through several colour tiers, and each tier gives a bigger boost on release.
- **Boost:** exhaust flames (motorbike, mkw_07) and a glitter/sparkle trail (mkw_08).
- **Tricks:** a clear character pose in the air off small bumps. **[public knowledge]:** a trick gives a boost on landing. The small bump is the design point: tricks are everywhere, not only on big ramps.
- **Camera:**
  - Low chase camera, slightly high.
  - It swings sideways in a drift (mkw_09 shows the kart angled against the view).
  - Wide field of view on the highway.
- **HUD:**
  - Corners only: items top left, coins and laps bottom left, place bottom right, minimap on the right.
  - Low density, large numbers.
  - Contextual banners such as "Be 20th or better!".

### 4. World structure

- **Connected world:** the venues sit in one world. The map shows biome zones (desert, volcanic, meadow, snow, Japanese-style, water) with soft edges between them.
- **Routes:** the map draws dotted roads between venues (mkw_11). On the ground, those roads are ordinary roads with traffic, guard rails, road signs and shops (mkw_03). **[public knowledge]:** a Grand Prix race starts on the road and ends in a lap on the venue.
- **How the track meets the world:**
  - Mario Circuit sits in an open field, but the colour blocks, pipes and grandstand mark it as a venue.
  - Its runoff is sand and grass, with roads going out into the landscape.
  - The mountain road is cut into terrain with a patterned retaining wall.
  - The desert palace (mkw_13) is thick with spectators, animals and a plane.
- **Biome transitions:** the travel road is where the biome changes (autumn trees, lanterns, a pagoda arch approaching the Japanese venue). The biome arrives as dressing before the venue does.

### 5. Game design systems

- **Modes** (observed and public): Grand Prix (cups), Knockout Tour or rally (nonstop, elimination by rank, e.g. "Be 20th or better"), time trial (the inset timer is SNES), Free Roam.
- **Progression:** cup and rally icons, some locked with "?" (mkw_11). Free Roam has collectibles (P-switch missions, medallions) **[public knowledge]**.
- **Catch-up:**
  - The item distribution favours racers who are behind (**[public knowledge]**, series standard).
  - Coins give extra speed to anyone who takes the risk to collect them.
- **Forgiveness:** Lakitu recovery, rewind, and the assists. The boardwalk without barriers only works because falling off costs little **[public knowledge]**.
- **Collectibles:**
  - On the road: coins, item plates, item boxes, dropped items.
  - In the world: medallions and missions.

### 6. Mapping to KFB Track Core

| Feature | Reference | KFB status | Recommendation |
|---|---|---|---|
| Surfaces as gameplay | One surface idea per track (ice, dirt, planks); penalty zones in a different material | **Partial / older Racer has**: Track Core has skins (visual only) and fx metadata; the older Racer has presets GRIP/DRIFT/ICE/OIL/BOOST/… | **Adopt principle:** give a surface id per slot of the 14-slot cross-section in Track Core, mapped to the older Racer's presets; a visual skin always implies its physics surface |
| Alternative lines | Lanes split by pipes; traffic as moving blockers; pad against lane | **Partial**: SPLIT/MERGE, FORK/JOIN, WIDTH_STEP exist as geometry; no valuation, no race logic | **Adapt:** give each branch a declared trade-off (shorter/risky against longer/safe) and check that it holds |
| Rails / wallride as track pieces | [public] grind rails, wall riding | **Missing** as pieces; the older Racer's rubber rails are for containment; magnet_catch/MAG_CASCADE are related | **Adapt:** a RAIL piece is a narrow stream with drive mode "locked" plus a release rule; wallride = a steep bank with magnet fx. Both fit the frame model |
| Collectibles along the stream | Coins on the ideal line / at risky edges, item plates across the lane | **Missing** | **Adopt principle:** place on the stream (s, u offset); rule: reward sits where risk is. KFB tokens are our own design, e.g. card seeds |
| Recovery | Lakitu, rewind; forgiving no-barrier sections | **Missing** in core (respawn is a known gap); the older Racer has a recover state | **Adopt:** respawn at the nearest stream sample with the frame, plus a short ghost phase; this is what makes open edges (boardwalk-like) possible |
| World routes between tracks | Dotted routes, real roads with traffic, biome change on the route | **Partial**: OSM corridor Hürth→Ehrenfeld; older Racer has OSM track modes | **Adapt:** treat the OSM corridor as the "travel road" and the fantasy tracks as venues; biome and satire change along the corridor. Traffic as satirical moving hazards |
| Trick ramps / tricks | Small bumps with a trick pose and landing boost; ramp after boost pad | **Partial**: KICKER→AIR→LANDING with physics checks; no trick input or reward | **Adapt:** add trick-able micro-bumps (CREST with small amplitude); reward on landing; the stunt states free/commit/release in the older Racer already fit |
| Boost pads | Edge-of-lane pad before a ramp | **Older Racer has** (BOOST surface); core: pads are practice areas only | **Adopt:** a boost-pad marking as a surface patch in the cross-section |
| Readability | Chevron boards, contrasting kerbs, hatched runoff | **Partial**: edge and centre markings, magnet arrow bars; edge layer missing | **Adopt:** the edge layer should include chevron boards on curves over a curvature threshold (auto-placed from the stream) |
| Width against field size | Wide venues for 24 racers | **Have** 10.8–21.6 m, but no field size decided | **Decide field size first,** then derive a width budget per racer and plan choke points |
| Laps / checkpoints / elimination | Lap counter, Knockout sections | **Older Racer has** C-3 laps and gates; core missing | Port the gates; skip elimination (see section 7) |
| Hazards / props | Pipes, plants, traffic | **Missing** (props/dressing) | Adapt with KFB's own satirical props |

### 7. Top 5 takeaways for KFB

1. **Surface is the level design.** One legible surface idea per section, with the penalty zone in a clearly different material. Surface id and look are one decision in Track Core.
2. **Put the reward on the risk.** Collectibles, pads and plates go where the line is dangerous or narrow. Placement is data along the stream (s, u), not decoration.
3. **Forgiveness enables daring geometry.** A cheap respawn allows open edges, narrow boardwalks and rails. Build respawn before building more dangerous pieces.
4. **The route between tracks is the travel road and the place where the biome changes.** Our OSM corridor is exactly that piece. Use it to carry the satire (traffic, road signs, shops), and keep the venues as the dense set pieces.
5. **Many small tricks beat a few big jumps.** Micro-bumps with a landing reward keep the pace up. Our big KICKER jumps stay as rare highlights.

### 3 things NOT to copy

1. **Nintendo IP and its iconography:** ? boxes and item plates, shells, pipes, Lakitu, the coin look, colour-block barriers, chevron-board styling. Keep only the principles. KFB needs its own items and tokens (card-seed logic).
2. **Knockout elimination ("Be 20th or better").** Being thrown out by rank is a gate. That conflicts with KFB's pull-not-gate pedagogy. A pull alternative: falling behind changes your role or gives you a new route, never an exit.
3. **The glossy, clean Nintendo rendering and its steep catch-up item lottery.** The look clashes with claymation, and Georg decides the look. The rubber-band item lottery undercuts "same physics for all vehicles". If catch-up exists at all, it should come from the track (shortcuts, pads), not from dice for the back of the field.

---

