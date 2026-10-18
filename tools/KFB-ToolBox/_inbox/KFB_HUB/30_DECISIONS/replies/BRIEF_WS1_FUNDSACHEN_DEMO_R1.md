# Brief WS1 · Found items demo on terrain (Georg 18.10.: "I don't see a terrain/demo setup") · V-434/V-437

**Tier 0 (3 lines):**
1. Georg wants to **see** it in the game: a terrain demo with floating found items and fluff on the ground. This is the next visible deliverable, built as stage **C3b** right after C3 (fluff harvest), on the same branch line, not on main.
2. Use only existing modules: figure card + E2, stage-light module, clay v1.1, placement grammar R2, HUD R5f (fluffBar, action bar, backpack).
3. Approval = preview link + a short clip in the staging site; WS0 checks before Georg.

**Block: what the demo shows**
- **Terrain:** a Slice 1 terrain patch (clay ground, without saturated greens), a few KayKit trees with fluff (C3), one path.
- **Found items (V-437):**
  - props, food and drinks **float at hip height of the Medium rig**, rotating slowly (~1 turn per 3 s) with a ±5 % bob, phase randomised per item;
  - soft contact shadow on the ground, **no seam**, no glow, no outline;
  - set = B28, 42 public GLBs, `…/50_BLENDER/B28/`. Origin at the bbox centre; `ground_offset_u` is in the extras.
  - Frequency: food, sweets and drinks often; tools and props rarely. Clustered by placement grammar R2. Never on paths or in entrances.
- **Fluff:** lies on the ground, bounces, rolls and comes to rest (C3 physics). Collected automatically on contact → flies to the `fluffBar`.
- **Pick-up:** "I" / action key "Interagieren" → backpack (R5f); throw away in the backpack detail view.
- **Camera:** C1 follow camera. If C1 isn't finished yet, the current camera is fine; say so in the status.
- **Shadow seam:** WS0 is fixing the bias at the root in `kfb-stage-light.v1.1` (scale-robust bias, self test for small objects). Switch to v1.1 as soon as WS0 sends the link. Until then, report every visible seam as a finding instead of patching it locally.

**Gate:**
- clip of 20–30 s: walking through the terrain, items floating, fluff rolling, one pick-up, one throw-away;
- perf ≥ 55 fps;
- 0 items on paths;
- screenshot of a contact shadow at 200 % zoom.

**Report:** a new § in WS1_STATUS (at most one page) with preview link, clip, measured values, open questions.
