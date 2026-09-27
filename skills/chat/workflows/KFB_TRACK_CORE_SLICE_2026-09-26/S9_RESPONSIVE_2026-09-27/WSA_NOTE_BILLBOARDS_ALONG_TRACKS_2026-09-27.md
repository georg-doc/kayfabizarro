# WSA note · KFB billboards along tracks and roads · 2026-09-27

**Source:** Georg, 27.09.2026, as a concept note and update for WSA. This is not built yet.

## What Georg wants

1. **Regular placement.** Along regular track and road stretches, KFB billboards stand at regular intervals in the visible area. They are clearly visible while driving past and readable when the player stops.
2. **Slight variation.** Body shape, size, tilt and colour vary a little from board to board. This follows the earlier billboard direction (26.09): cartoon roadside signs inspired by colourful, irregularly rounded 1950s / 60s US motel and casino signs, in several body types, with seeded KFB palettes.
3. **All display options.** A board can show a 4:3 YouTube video, a ~16:9 KFB card, text, or later a "living" face with cartoon eyes and mouth. The face adapts to the content within a maximum width and height.
4. **"They Live" layer.** Like the sunglasses in *They Live*: with the **KFB sunglasses** on, the player sees the "true" texts and visuals behind the boards. Every board therefore carries two contents: the surface message and the true one.

## Proposal for the track core (open, for WSA to accept or change)

The core already knows everything a placement rule needs: the frame per sample, the section edges, curvature, tunnels, halls and drive modes. It could emit **billboard anchors** as one more stream layer, like markings. Consumers would place and dress the boards, and the core itself would never render one.

- **Anchor:** `{s, side, lat, lift, yaw, sizeClass, context}`.
  - `lat` sits just outside the outer barrier (plus a margin).
  - `lift` puts the board face at driver eye height or above.
  - `yaw` turns the face towards oncoming traffic by about 15–25°, so it reads while approaching and while standing.
- **Spacing rule** (proposal, all values are parameters):
  - about 1 board per 150–250 m of plain street or track;
  - more on the outer side of long curves (in view for longer);
  - none on air spans, loops, `locked` magnet sections or split / merge zones (the player is busy there);
  - in tunnels, only wall-mounted panels in halls and hangars.
- **Visibility check:** the board face must be in the driver's view cone for at least N seconds at design speed (27 m/s), and must not be hidden by barriers, tube walls or the next board.
- **Content binding:** each anchor gets a seed (route id + s). That picks the body variant, palette, surface content and "true" content. The same seed always gives the same board (deterministic, like the skins).
- **Runtime:** the sunglasses are a view toggle or power-up. They swap the board faces to their true content. Optionally the world palette desaturates to black and white while the boards pop.

## Not decided (Georg)

- Density per track type (city street vs stunt track vs toy track).
- Whether boards may also stand in the stunt sections as a gag (upside down on a loop, …).
- Who writes the "true" texts. The content pipeline is the KFB marketing / card corpus; this is not a track-core question.
