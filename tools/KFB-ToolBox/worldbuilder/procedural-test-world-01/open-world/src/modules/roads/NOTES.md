# roads — NOTES (integration, after critic round 4: 7.5 / 8.0 / 8.0 / 7.5)

## Perf (A*, bit-identical)
Mask hash over R=60 is unchanged for seeds 123 / 1337 / 42 / 7 (1984093688 / −315601142 / 1283436542 / 559704799), as are
the expansion counts and the prefetch path (PF=1).
- Numeric-keyed cell reference cache in front of the world getter; numeric memos for staticCost and the ramp costs
  (notch/foot memoised per cell, direction and level); numeric avoid/ring sets and segment keys; a stamped grid
  for the feasibility BFS. The string-keyed corridor memo is gone (terrain's riverCorridor is O(1)).
- A* scratch comes from a pool (typed arrays stamped per route instead of being allocated and filled; a reused
  heap). The goal bearing is cached per cell at prep time. The search runs in plain closures sliced every 400
  expansions (generators de-optimise the hot loop), with flat DIRS arrays and inline heuristic and deviation maths.
- Exact skip in prep: a segment whose bounding box is farther than the soft band can't affect the cell.
- No early fail: a failing route stops at maxExp because its reachable state space is large, so proving failure
  would cost as much as the search itself.
- Measured (load ≈ 17): search 1.35 M expansions in 1.5 s ≈ 0.9 M exp/s (seed 1337). Harness wall time is about 30 %
  lower and CPU about 25 % lower. Browser `/` seed 123, interleaved A/B: ready 10.0 / 12.1 s → 8.3 / 9.7 s; the
  roads layer's self time 3.3 / 4.0 s → 2.2 / 2.7 s.
- Prefetcher: any retry signal (`isRetrySignal`) escaping a step resolves the dependency resumably and restarts
  the closure (memoised, no warning). guard/sync retry other modules' retry signals on the next slice.

## Bank seams, river barrier, tongue-first ramps (game critic r2 + terrain's tongue rule)
- **Bank slits**: the bank-slope shift left each shoulder vertex (y −0.375 m on the hex boundary) 10–15 cm below the
  new slope plane, so every seam showed a dark notch. Shoulders now move half way along with their waterline vertex
  onto the line lip → shifted waterline (canonically along the edge on the boundary). On the hex boundary, river channel shoulders
  are never weld-lifted, and boundary cut points use fixed lines (road strip bevel 0.242, river lip 0.512 units), so
  neighbouring tiles always agree. The bridge bed uses conforming (T-junction-free) subdivision. Height probe over
  the seed-123 bridge reach: no seam mismatch.
- **River as a barrier**: reeds stand right at the water's edge (0.9–1.3 m from the original bank: just beyond the
  sloped bank), 2 per straight cell and 3 per bend; lilies sit in the shallows.
- **Ramps**: road ramps are tongue-first. footCost first tries terrain's tongue shape (only s at L+1; s±1, s±2 and
  the approach at L). The old walled foot ramp and notch ramps are still allowed at +20 cost (`RAMP_FALLBACK`), because
  tongue-only lost ~60 % of the road network. Tongue share: 17–24 of 56–76 road ramps per 1.85 km².
  Ramp tiles are now procedural: a planar road strip (KayKit sunken profile), plus grass wings that rise smoothly to
  L+1 at every side edge whose flank stands at ≥ L+1 (a cutting), with a trimesh collider on raised wings. Side edges
  facing a flank at L stay planar; terrain's embankments should cover those (request sent). `?rampwalls` gives the
  old tile.

## Road ramps sunk + transition cracks (user 2026-10-07)
- **Ramp ground contact:** `roadSinkAt` covers road ramps too. `rampFns(c)` holds the ramp-frame surface functions: `height` is
  the drawn tile, `walk` the same with the strip bevel widened 0.2 m each way (≤ 29°, like the flat tiles' walkTris). The ramp
  tile's WORLD trimesh is now the full `walk` lattice (24 rows), and terrain lowers its planar hull by ROAD_SINK on road ramps.
  The flat→ramp sink fade is gone; only edges into bridge decks keep it.
- **Black triangles at ramp ends:** a road tile's corner on a drop edge dipped to rim height even where both other cells
  reach its height (embankment cones, ramp planes). weldMask has corner bits 8+d ("closed corner": both other cells reach
  our top − ROAD_SINK/2, sampled 0.15 m toward each cell's centre, so every tile at the corner decides the same way), and
  welded() lifts such corners.
- **Dark slits along seams at drop corners:** (1) the seam-cut logic treated the tile's BOTTOM face (y = −HEX_SCALE, also
  on the boundary) as "low rim" and lifted its edge points to grass height, which stood huge slanted bottom triangles up
  through the grass. Only rim-band vertices (−0.07 S < y < −0.01 S) count now. (2) The low-low seam fan left one long,
  laterally steep sliver from each low end (dipped corner / strip edge) to an apex metres inside. Each end now gets a grass-height
  point on its interior edge (0.433 m from a corner, 0.30 m from a strip edge). (3) No grass-height cut on kept-rim (drop) edges.
  (4) Side-wall triangles standing on welded edges are dropped.
- Tools: `voidcheck.mjs` (per road cell, 12 cameras including close knee-high views; sky hidden, magenta clear colour, single-
  sided override, so holes show magenta; sanity view; reload-safe), `crack.mjs` is reload-safe now. Note: in zsh,
  `set -- $a` does not word-split, so loop over explicit commands.

## Verge creases (user 2026-10-07, lengthwise lines at the spawn street)
- Cause: the low→high weld cut also split the strip BEVEL edges at the arm ends "where the grass ends" and lifted that point to
  grass height. That pulled the bevel top in to 1.743 m near each arm end, while KayKit's 15 m bevel triangles otherwise run
  to 1.818 m. One long sliver became nearly flat, so the bevel shaded as two bands with a crease (and the earlier diagonal kink at seams).
- Fix (render-side, variant(id, rot, weld, mask)): bevel edges (low end on the strip, high end on the bevel-top line) are
  never cut. Other strip-end edges are cut exactly on the bevel-top line. BEVEL_TOP = 0.2424 (KayKit's 1.818 m), and stray top
  vertices on the outer arm half snap to it. Bevel faces get the grass texel and normals half-way to up (no bright edge lines).
  The bevel is now one plane per side.
- Bridge beds get vertical skirts along their road edges, so the sunk strip / bevel beyond never shows a slit under the
  parapet feet (voidcheck found 4 × 10 px there after the bevel change).
- Checks: voidcheck 0 (97 spawn 648 views, 97 ramps 300, 123 204, 42 348); crack 123 0, 42 4 (known corners); risers 97 / 1 still 0.

## Walk-surface risers (demo r-input: seed 1 forest leg stuck at (367.8, −0.26, 326.4))
- The spot is the inner corner of a 120° bend tile (hex_road_B, cell (12,25)) beside a crossing and the village
  square. The "outward from the nearest centre line" shift fails at a bend's inner apex: the cell centre lies inside the bevel,
  so strip and grass vertices moved apart only to a 0.45 m bevel = 41.7°. This affected every bend and crossing tile on every seed.
  Fixes in walkTris: (1) a vertex's shift follows the uphill direction of its steep faces where those agree
  (≥ 60 % resultant), else the centre-line direction; (2) only faces within 2.8 m of a road centre line count as bevel
  (kept drop rims were being made steeper).
- Road ramp next to a bridge cell (e.g. seed 1 (−8,24)): the ramp strip stayed sunk against the unsunk deck end (0.37 m
  riser). rampFns now fades the sink over 2.5 m toward bridge edges (key includes the bridge-edge mask).
- `tools/risers.mjs seed [R]` checks walk triangles > 35° spanning > 0.15 m in the road corridor, ramp walk() steps,
  and road-cell edges where the sunk strip meets a neighbour 0.15–1.5 m apart (heightAt ±3 cm).
  `?bevelv1` restores the old surface for before counts. Seeds 97 / 1 / 132 / 123 / 42, R = 60:
  tri risers 358 / 370 / 277 / 313 / 381 → 0, edge risers 2 / 5 / 2 / 7 / 5 → 0, ramp risers 0 → 0.

## Last voids closed (voidcheck r12)
- Pinholes at strip ends (seeds 42 / 97, 2 px): my low-low seam fan split its strip-edge end at 0.30 m with no partner cut on
  the triangle across that interior edge, which left a T-junction. Splits are now only at dipped corners, where the interior-edge
  rule cuts the same point.
- Drop corner on seed 42 (−52.5, 4.33; road cells (−3,0)/(−4,0) above (−4,1)), 22 px: KayKit's rim-inset vertex and a cut
  point form a near-collinear T-junction. Backstop: every road-tile variant has a flat grass cap at −0.065 units under the
  hex (invisible under the top and behind the drop walls; excluded from the collider), so no crack can show the void.
- voidcheck after: seed 97 (−9,−2, r6) 300 views 0, spawn street (−13,4, r8) 648 views 0, seed 123 204 views 0, seed 42 348 views 0.

## Verge shading lines (user 2026-10-07)
- Diagonal lines across the green bevels at every tile seam: the welded seam cut put the bevel top on the hex boundary at
  0.242 units (the old rim band), while the KayKit bevel top runs at 0.2324 (1.743 m). Every tile's bevel jogged 7 cm
  outward over its last 0.3 m, a kinked facet at each seam. All seam cuts (and the ramp tile's BEV) now use
  `BEVEL_TOP = 0.2324`. Crack check seed 97: 9 → 9 (all pre-existing), spawn area 0. Shots: tools/out/roads/r11.

## Ground contact on flat road cells (blind judges: knight floated 0.375 m above the strip)
- `api.roadSinkAt(x, z)`: depth of the walkable road surface below grass height on FLAT road cells (0 off the road and on
  ramp / bridge / river cells). It is read from the drawn tile variant (crossings and bends included), limited to ≤ 3 m from the
  road centre lines (terrain's kept drop rims stay terrain's). Roads wraps `world.heightProvider` (terrain's) at init:
  `h − roadSinkAt`. `?nosink` turns it off.
- WORLD trimesh per flat road cell = the same walkable surface (`walkTris`). Terrain lowers its flat prism top by
  `ROAD_SINK` (terrain/build.ts, the single source of the 0.375 m; the ramp tile uses it too), so this trimesh is the top.
- **Bevel softened in physics:** the KayKit bevel (45°, 0.375 m) counted as a wall for the character (COS_CLIMB 35°: 3 wall
  stops crossing strip → verge). In `walkTris` every vertex of a steep face, plus grass vertices within 0.45 m of the bevel top, moves
  0.2 m · (1 − 2 depth/SINK) away from the road centre line (along the hex edge on the boundary). The result is ≤ 29° and ≤ 0.1 m from
  the drawn bevel. heightAt = physics (ray probe: |Δ| ≤ 1 mm away from fade cells).
- **Sink fade:** on road edges into a ramp or bridge cell (those keep their unsunk planes/decks), the sink fades to 0 over 2.5 m
  (else a 0.375 m riser stood at every ramp foot). Those cells use a 28-step lattice collider of `roadSurfaceOffset` (≤ 0.17 m off
  the drawn surface).
- Tools: `tools/profile.mjs` (ray + heightAt profile along lines, max step per 2 cm), `tools/run.mjs` (real input, no
  screenshots; samples pos / speed / wall stops / heightAt / camera clearance), `tools/kinds.mjs` (straight / bend / crossing cells).

## Critic r3 #3 (road-edge lips) + terrain's crack check
- **Physics:** roads has no colliders on flat road cells. The ground there is terrain's flat hex prism; roads' own WORLD
  colliders are ramp wings, berms and bridge decks. `tools/lipprobe.mjs` casts world-only rays on a 0.25 m grid, offset from lattice lines because a ray
  exactly on a trimesh edge misses. On the seed-97 plaza (28 road cells) it finds 0 roads-owned lips. The rest are village cuboids
  (stairs/props), terrain ramp hulls and terrain ramp-side slopes, identical with `&rampwalls=1&noberm=1`. The critic's 6 s
  slowdown was a character bug (fixed there). Real input (`tools/run.mjs`, screenshot-free, same steps as shoot.mjs):
  weaving across the plaza road edges at shallow angles keeps 3.6–4.6 m/s with 0 wall stops; the critic's legs run at 4.41 m/s.
- **Corner cuts were unsigned:** the seam-cut code compared |along-edge| distances, so an edge running from a low corner to a
  high corner (both at 0.577) was never cut. One slanted face then ran the full 8.7 m edge, leaving a 0.29 m dip against
  terrain's flat grass. Cuts are now signed. A drop corner's band ends at CORNER_BAND (0.5197 units, terrain's flatTop inset:
  RIM_W / sin 120°).
- **Ramp wings:** removed the 3 m blend across the side corner. It lifted a planar side's boundary 0.9 m above a same-level
  flank. Each edge keeps its own target and the corner takes the lower one.
- **Road-cell berm (`roadBerm`):** a flat road cell beside the side of a same-level ramp gets terrain's embankment shoulder
  (ramp side height × (1 − s/6.5 m)). It fades over 3 m at free same-level edges, except within 3 m of the ramp edge. At edges with
  terrain-embanked neighbours it blends to `heightAt` across the edge, so the shared edge matches exactly. It stays flat for 1 m
  beside the road bevel, then rises at ≤ 35° (smooth min). Visual lattice + trimesh collider; skirts visual only. `?noberm`.
- `tools/crack.mjs seed q r radius [query]`: terrain's criterion, i.e. rendered surfaces ±6 cm across shared edges with continuous
  heightAt, flagged when more than 8 cm apart. Before → after: seed 97 (−1,0,5) 14 → 9, seed 123 (0,0,6) 2 → 0, seed 42 (0,0,6) 7 → 4. What is left:
  0.22–0.25 m at 0.13 m from hex corners on drop edges, and road ramp (−6,−3) on seed 97 0.26 m above flanks that terrain does not
  embank.

## Bridge approach funnels (character r3)
- The road strip (±1.8 m incl. bevel) is wider than the walkway between the parapets (±0.9 m). A knight running up the
  outer part of the road hit the parapet side wall's blunt end (player-only hull) head-on and was deflected onto the bank.
  When I removed the low side walls, he climbed over the visible parapet instead. Fix: on each side, a thin player-only wedge from 2.2 m
  out, 2.5 m before the deck end, to the parapet's inner face at the deck end. Contact is glancing and he slides onto the deck.
- `tools/bprobe.mjs seed [radius]`: per bridge, a knight capsule against player-only colliders on the deck (central
  60 %), the straight approach (|ac| ≤ 0.4) and the outer road strip / beside the ramp foot. Deck and centre approach must be 0.
  `tools/colat.mjs seed x z [half]` lists colliders at a point.

## Terrain's river valleys (levels capped near rivers) — re-validation
- **Blocked river gates**: with narrower valleys a road can take every candidate cell of a gate line (seed 7, gate −8
  of river 0), the gate was null and the river ended on both sides (2 river dead ends). A link now runs on to the next open
  gate (≤ 2 skipped); `mask()` looks 4 gates back, the prefetcher warms the skipped gates' cells.
- **River spur**: the relax-5 last resort could arrive at a gate and leave it reversed (seed 50: a one-cell spur). Relax 5
  now keeps gate arrivals/departures within 60° of the gate heading; the old anything-goes is relax 6.
- **Seam groove at terrace corners**: on a welded road edge whose hex corner stays at rim height (its other edge is a
  drop), the KayKit tile had no vertex between the strip edge and the corner, so the grass sagged to rim height and two
  tiles formed a dark V-groove. Those boundary edges now get the bevel-top point (0.242) and the corner-band end (0.075
  units from the corner) at grass height. Both tiles compute the same points. Tools: `tools/row.mjs` (cell dump), `tools/gatedbg.mjs`.

## Natural rivers + tile grass match (game critic r1)
- **Meander**: the river A* state carries the straight run length and the side of the last 60° turn: a third
  straight cell costs +2, a fourth +6, and two same-side turns in a row (a curl) are banned at strict level. The gate
  cells jog too (`jogAt`: toward the side the next gate lies on, 80 %). Arrivals stay on a heading the next link may
  leave with (gate heading or its jog), so a gate cell never turns 120° below the last-resort tier.
  Bend cells went from 31–35 % to 45–51 %; straight runs are now mostly 1–2 cells (longest 4–8). Sharp single-cell
  bends: 0–2 per 1.85 km² (last-resort links). Bridges, dead ends, triangles, level steps and village overlaps are
  all still 0. `rivers.DEBUG_RIV.straightGates` turns gate jogs off; `tools/rlink.mjs seed k n` debugs one link.
- **Banks**: in the tile variant, every waterline vertex under a vertical bank wall moves 0.65 m into the water,
  giving a ~30° slope from the grass lip to the water (on the hex boundary only along the edge, so neighbours agree).
  Collision blockers still come from the original tile. `?hardbanks` restores the vertical walls.
- **Decoration**: lilies and reeds (`waterlily_A/B`, `waterplant_A–C`, about 2× pack scale) sit in the shallows 1.0–2.2 m
  from the bank: 2–3 per bend (a reed on the inner side first), one on every third straight cell. Hash-placed,
  deterministic. `?noriverdeco` turns them off.
- **Grass match**: road/river tiles use terrain's base material (hex_grass), constant texels for flat grass (hex_grass
  top) and the road strip (hex_road_A strip). Ramp tops use terrain's 85 % up-biased normals and constant texels.
  There is no atlas-gradient sampling any more, so no stripes.

## Perf: prefetch steps (streaming request §12)
- Rivers phase: villages (stage 3) read road-node degrees up to ≈ 33 cells around any cell (nodes within VR + 8 of
  the cell's 8×8 block, their rivals within MIN_SPACING, rural features). Every stage-4 read (gate cells, and the
  link's whole A* box, one cell per slice) is preceded by the road regions within ±3 macro regions (`VREACH`), so
  no road region is computed synchronously inside a villages read any more.
- Memoised skip loops (nodes / feas / paths) yield every 16–48 checks; the feasibility BFS is resumable (every 400
  cells); A* slices are 250 expansions; the route box is warmed out to HALF_W + 6; prep tests the corridor before
  reading terrain.
- render: the surface sampler is binned (24×24 grid) and cached per asset. Chunk builds over 12 ms are listed in
  `stats().roads.render.slow`. Only boot-time builds remain slow (first tile variants, bridge shape, bridge bed:
  16–60 ms before ready).
- Flythrough 12 m/s, seed 1337, 60 s (load ≈ 26–28): the longest roads prefetch step went from 68–168 ms (reported)
  to 11.1 ms, with no step over 12 ms; 0 page errors. Mask hashes unchanged (4 seeds + PF path).

## Integration changes
- **Junctions**: the origin node wants 3 roads (was 4), and 3-way nodes pay 40 for adjacent ports (was 12), so the
  seed-1337 main knot is now one clean Y. Free routes are capped at 1.7·d+3 and the others at 1.35·d+3. I tried a
  hairpin reject (two same-way 60° turns in a row) and dropped it, because it cut crossings by a third and added
  hairpins at 2-way nodes.
- **Bridge deck seam**: the line was the river tile's grass rim showing through where the deck's feet dip below the
  tile top near the cell edges. Bridge cells now use a "bed" variant of the river tile, refined only under the deck
  strip, with every vertex there capped 5 cm below the deck's lowest surface. Bridge B also gets a stone strip
  3 cm under its deck (`?nounderlay` turns it off).
- **Parapet collider**: the side colliders now reach from the ground to the parapet top and from the inner face out
  to the model's measured outer face at each station + 0.4 m (the knight's helmet is wider than its capsule).
- **Ramps**: no grass bevel on ramp tiles (the rim lies flat to the hex edge), which removes the V-pits at the
  ramp-top corners and the soft side rim. Top normals take ≤ 40 % of the slope and blend to straight up at the foot
  and high edges, so the road colour has no hard break. The ramp material variant makes terrain's per-level tint
  continuous along the slope.
- **Welded grass edges** (terrain integration): road/river tiles are emitted as per-cell variants, cached per
  (tile, rotation, weld mask) and merged per material per chunk. The KayKit grass rim is lifted to the cell top on
  edges whose neighbour is same-level or higher land (or a ramp) and kept at drops and water. Triangles where grass
  meets the road strip or channel bevel are split at the transition (bisection low → high, so neighbours agree), and
  nothing else is subdivided. Flat grass faces use hex_grass' top texel (no moiré). `?noweld` gives plain tiles.
  Cost: +0.4 % triangles and no extra draw calls (game mode, overview/aerial/follow, 3 seeds).
- Rivers: unchanged (GATE 4 gave river dead ends and sharp bends, so it is back at 5).


## Round 4 changes (critic round 3: 8.0 / 8.0 / 7.5 / 7.0)
1–3. **Planar ramps**: road ramp tiles = flat `hex_road_A` lifted onto terrain's `rampPlaneHeight()` (one inclined plane
   over the whole hex: foot edge at L, high edge at L+steps, side corners at mid). Road strip (−0.05) and grass (0) are
   lifted fully (the old weight lifted the strip only 83 % → the trench); body bottom stays at y0 − 7.5 m = column top,
   so the tile brings its own side walls. All road/river tiles use terrain's `dirt` look (same as terrain everywhere:
   identical tops, dirt bands + grass lip on vertical faces). Falls back to a built-in planar profile if the terrain
   function is missing. Verified: top-down, grazing side view, real-input walk up/down on seeds 1337/42/7.
4. Shadow acne on ramp wings: not visible in the round-4 shots (planar faces, face normals).
5. Free fallback routes avoid ports beside other roads (ring2); route length ≤ 1.6·d+4 (free 2.0·d+4); a lattice
   edge whose path runs within 2 cells of a lighter sibling's path for ≥ 4 cells is dropped (`parallelSibling`).
6. River meander: gates alternate sides of the corridor centre (offset 1.0–1.45 cells, occasional same-side pairs by
   simplex), jitter along the axis ±0.8; curvy tiles off (they pinched the banks at every border).
7. Plain river tile under bridges (no crossing-tile road sliver); bridge 3 cm above the cell top (`?xtile=1` restores).
8. Villages: roads draws the junction tile at crossings; villages should not draw on road cells (roadMask ≠ 0).

## Round 3 changes (critic round 2: 7.0 / 7.5 / 7.5 / 7.0)
1+2. **Ramp hexes**: the cause was KayKit's `hex_road_A_sloped_*` itself (its sand strip is a smooth arc while the grass
   beside it is a half ramp → creases, a sunken road on the plateau half, "ghost" wedges); my flat-normal patch made the
   arc band. Terrain does NOT draw anything on road cells (checked build.ts; ray-cast in page: one surface only).
   Fix: `rebuildRampTile()` rebuilds both sloped road tiles from the flat `hex_road_A` with every top vertex lifted by
   the exact KayKit/terrain ramp profile (linear low half, flat high half) → one inclined plane along the road + the
   plateau, identical to terrain's heightAt/colliders. Road tiles also use DoubleSide (terrain's look is FrontSide).
   `?kayramp=1` shows the original tile.
3. **Route shapes**: routes whose heading turns > 120° within 5 moves are rejected; a road closing a triangle of roads
   with perimeter < 42 cells is dropped if it is the triangle's heaviest edge (before pruning).
4. **River at a cliff**: not a gap — top view (`roads.river_top`, seed 7) shows the river continuous inside its level
   valley; the cliff is a raised cell beside the corridor in a low oblique view. No terrain bug found.
5. `?roadsSpawn=ramp`: spawns on the approach cell at the ramp foot, facing up the ramp.
6. Bridge 5 % larger and 8 cm lower → its feet reach past the road tiles' rim bevel (no dark slit).
7. Bridge model B by default (its arches sit over the water better at the hex 60° road/river angle; `?bridge=A`).
   A 90° road/river crossing does not exist on a hex grid with straight tiles (edges are 60° apart); KayKit's
   crossing tiles + bridges are themselves 60°.
**Perf (streaming request §4)**: every A* is resumable (`*routeIter`, `pathIter`, `feasibleIter`, `extraIter`,
`pathAnyIter`, rivers `linkIter`; sync methods = `drain()` of them, bit-identical: mask hash over R=40 unchanged).
`maxExp` 20 000 (successful routes need ≤ 1 650). The Prefetcher computes each region's closure leaf-first (nodes →
feasibility → routes → repair routes → pruning rounds → region); during a prefetch step `net.strictCache` makes the sync
wrappers throw `Missing` instead of computing inline, the prefetcher computes that dependency resumably and retries the
item. `services.roads.prefetcher()`; roads drives it itself only without a `streaming` service.
Measured: flythrough seed 42 (60 s, 12 m/s, 9 other browsers): roads prefetch max step 9.7 ms, no road work in the worst
frames (max 138 ms = render/shader compile).


## Round 2 changes (critic round 1: 7.0 / 6.5 / 6.5 / 7.5)
1. **Water beside bridges**: bridge cells get full-height player-only boxes over all water EXCEPT the deck strip
   (deck frame from the bridge transform; 0.5 m samples merged per row). Water sampling threshold −0.5 m (the KayKit
   rim bevel at −0.375 m was being treated as water → invisible walls at bridge ends / tile rims).
   Verified with real input: centre walk crosses (y 0 → 1.5 → 0); ±2.2 m off-centre walks stop at / slide along the bank.
2. **Meanders**: river gates on jittered cross lines with a lateral target wandering across the valley (simplex),
   weaker centre pull, stronger meander noise, `hex_river_A_curvy` on ~40 % of straight cells; extra relax pass
   (free first heading) so links never fail (0 gaps on 3 seeds).
3. **Ramps**: two kinds, both with walls on the high flanks: *foot ramp* (low cell, s±1 ≥ L+1) and *notch ramp*
   (terrain's pocket rule: upper cell lowered to L, `cell.level` changed by stage 2, s±1 ≥ H). s±2 preferably high
   (pocket). Approach cell must be flat at the foot level. Sloped road tiles get flat face normals (no darker slope).
4. **Loops / parallels**: heading-to-goal cost in A*, paths whose non-consecutive cells touch are rejected,
   fallback routes avoid all neighbouring roads with a 1-cell halo; port assignment penalises ports > 66° off the
   bearing and ports that lead into a wall.
5. **Dead ends**: feasibility = real terrain-only probe route (ramp rules included) → infeasible lattice edges are not
   selected; fallback 'free' route (any port) when the assigned port fails; generation-2 repair edges for nodes that
   routing left with < 2 roads; 4 rounds of dead-end pruning. 0 dead ends in R=60 on seeds 1337/42/7.
6. **Origin crossing**: node (0,0) searches a wider radius, wants 3–4 roads; nodes in river valleys search further out.
   Origin node degree ≥ 3 on seeds 1337 (4), 42 (4), 7 (3), 3, 99.
7. **Parapets** measured from the model (inner face 0.90 m, outer 1.44 m from the axis); deck collider ±0.85 m.
8. Road cells next to terrain ramp cells cost +1.5 (no brushing against ramp side faces).
9. Banks: both banks keep KayKit's bevel (terrain keeps the bevel on corners touching road/river cells; my tiles keep
   theirs). The visible difference between banks in oblique views is the bank slope facing / facing away from the camera.
- `/?roadsSpawn=crossing` now spawns on a free road cell (no building/reserved/bridge/ramp) next to the crossing.
- Cost: boot computes a wide halo (probes + pruning rounds): ~1000 route calls ≈ 6–12 s CPU before ready on this
  (heavily loaded) machine; streaming afterwards is amortised (12 m/s fly-through: p95 21 ms, worst 152 ms at load 50).


## What it builds
- **Stage-2 road layer** (`net.ts`, pure, seeded, order-free, continuous across chunks):
  - Macro nodes on a triangular lattice, one per 13×13 axial cells (`MACRO`), jittered ±0.15·MACRO, snapped (radius 2)
    to a *clearing*: node cell + ring 1 flat, dry, same level, no coast/rock/mountain, nothing of a river valley within 2.
  - Edge selection is **hash-only** (shallow dependencies → cheap): each node wants its 3 lightest lattice edges, kept if
    both want it, rescue to degree 2, heaviest edge of every fully selected lattice triangle dropped, capped at 3 per node.
    Then terrain filters: both nodes valid + a cheap BFS feasibility test (≤ 1 level per step inside an ellipse).
    Nodes left with < 2 roads rescue their lightest routable edge (target node must have < 3). One dead-end pruning round.
  - **Ports**: every road leaves its node through its own hex edge, ≥ 120° apart on 2-road nodes (no sharp bends).
  - **Routing**: A* over (cell, heading, mode) — max 60° turn per cell (only straight / wide-bend tiles), turn cost,
    low-frequency noise (gentle winding), forest/shore/cliff costs, river valleys cost +3.5 and forbid turning inside
    (roads cross valleys straight, never run along them). Three passes: *strict* (Voronoi corridor vs neighbouring
    roads + 1.3-cell margin, port sectors), *relaxed* (margin 0, wider), *fallback* (no corridor, but ≥ 1 cell away from
    every already-decided neighbouring road; priority = lighter edge). An edge that fails all three is dropped (≈ 10 %).
  - **Level changes** only by a straight road ramp: cell level L, next road cell L+1 (`cell.slope`, tag `road-ramp`,
    tile `hex_road_A_sloped_low`), or along an existing terrain ramp. Ramp rule: no neighbour lower than L on the high
    flanks (d±1) — hard; d±1 at L+1 and d±2 at L preferred by cost. 2-level terraces are walls.
- **Stage-4 river layer** (`rivers.ts`) on terrain's `riverCorridor()` (via `corridor.ts`, namespace import + generator
  fallback): the river axis is estimated from the corridor ids; **gates** every 7 cells along each river (best centre
  cell of corridor k on the cross line), consecutive gates joined by heading-aware A* inside corridor k (≤ 60° per cell,
  meander noise, straight through every gate → no kinks). Endless, single cell, one level, triangle-free.
  Never through village / building / water / coast / rock / ramp cells. Road cells are entered only as **bridges**:
  straight road, river straight through on a different axis → `hex_river_crossing_A/B` + `building_bridge_A`
  (`cell.bridge = true`, `reserved = true`, tag `bridge`). I did not trace terrain's `onCentre` chain literally: its
  zig-zags make 120° turns and it can't be steered through straight road cells; the A* stays inside the same corridor.
- **Rendering** (`render.ts`): road / river / crossing / sloped-road top tiles with exact atlas rotations
  (`matchTile`, `matchCrossing`), terrain's own tile material (`makeTerrainMaterial`, same tonal patches / side bands;
  `dirt` look next to ≥ 2-level drops). Bridge oriented by a principal-axis fit of the model (the KayKit bridge deck runs
  along a 60° hex axis, not along x/z).
- **Colliders**: bridge deck = 12 sloped convex slabs from a vertical ray-test profile of the model (0 → 1.5 m → 0),
  railings player-only boxes. **River water is not walkable**: player-only boxes over the water area of every river
  tile (sampled from the tile geometry per asset → bends covered), up to +2.4 m; on bridge cells they stay ≤ 0.3 m so the
  deck carries the player. Verified with real input: walk over the bridge (y 0 → 1.5 → 0), run into a river (stops at
  the bank).

## Public API (`api.ts`)
`roadDirs(cell)`, `maskDirs(mask)`, `roadMaskAt(seed,q,r)`, `riverMaskAt(seed,q,r)`, `nodeAt(seed,q,r)`,
`isCrossing(seed,q,r)`, `crossingsNear(seed,q,r,radius)`, `nodesNear(seed,q,r,radius)` → `{q,r,level,degree,dirs}`,
`roadFrontage(q,r,get)`, `inRiverCorridor(seed,q,r)`, `distToCrossing(seed,q,r)`, `ROAD_TAG`, `MACRO`, `networkStats`.
Inside a world layer prefer cell data: `roadMask`, `riverMask`, `bridge`, `slope`, tags `road`, `road-node`,
`crossing` (node with ≥ 3 roads = village site; its ring 1 is flat at the node level), `road-ramp`, `river`, `bridge`.
Villages: keep buildings out of river corridors (`inRiverCorridor`) — rivers route around village cells but a village
spanning a whole corridor would cut the river. Service `roads`: `{ net(), rivers(), stats() }`; `window.__roads` in-page.

## Showcase
`/?showcase=roads` (uses terrain; the real unbounded world, loadRadius 330 m). Presets `roads.crossing`,
`crossing_close`, `bridge`, `bridge_top`, `bridge_close`, `ramp`, `ramp_side`, `river`, `overview`, `far`,
`at` (`&at=q,r&atd=dist` top-down debug). All search deterministically near the origin.
Debug: `/?roadsSpawn=bridge|river|crossing|ramp` (game mode) spawns the player in front of the feature;
`&prefetch=1` time-sliced prefetcher (off: it made hitches worse — atomic units too coarse); `&softrim=1` softened tile
rims (off: exposes slits); `&bridge=B`, `&bridgeRot=deg`.
Tools (node, my folder): `tools/harness.mjs <seed> <R>` network stats via Vite SSR; `diag.mjs`, `rdiag.mjs`, `par.mjs`,
`node.mjs`, `halo.mjs`; `tools/peval.mjs <url> <js>` evaluates JS in headless Chrome; `scripts/*.json` input scripts.

## Measured (radius 60 cells ≈ 1.85 km², seeds 1337 / 42 / 7, integration)
road cells 8.0 / 8.1 / 7.4 % of land; crossings 15 / 13 / 18; dead ends 0 / 0 / 0; road triangles 0; level jumps 0;
road on water/coast 0; ramp masks wrong 0; hairpin nodes 3 / 2 / 0; river 2.7–2.9 % of land; bridges 5 / 5 / 4;
**road–river crossings without bridge 0**; river triangles / dead ends / sharp bends / level steps 0.
Shots: 0 console errors, 40–61 fps in the showcase presets.

## Known issues
- Round 4: 2–3 hairpin nodes per 1.85 km² (2-way node whose two roads leave through adjacent edges: one route's goal end
  is not port-constrained in fallback/free modes); some parallel roads ~3 cells apart remain (seed 42 south of the
  crossing); 60° Y forks at some 3-way nodes (seed 7). Tightening the length limit / banning adjacent ports did not
  remove them and cost crossings, so it was reverted.
- River straight runs of 4–5 cells between 120° jogs remain (hex river tiles only have straight and 120° pieces).
- ~2 junctions per 1.8 km² off a node (fallback route touching another road next to a node) — not tagged `crossing`.
- Ramps on single-level steps often show the KayKit ramp's side wedge (flank at L instead of L+1); sample2 has the same.
- Road tiles keep KayKit's deeper rim bevel (terrain's grass is softened) — thin grooves along road cells.
- First query of a new macro region costs a burst (terrain for the routing halo + routes); no time-slicing yet.
- I touched `src/core/main.ts` mtime once (no content change) so Vite re-evaluated `import.meta.glob` for the new module.
