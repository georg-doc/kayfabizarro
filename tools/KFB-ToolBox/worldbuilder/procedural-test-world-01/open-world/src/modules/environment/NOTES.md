# environment — NOTES

Sky, sun/moon + hemisphere fill, soft stable shadows, focus-centred edge fog, tone mapping/exposure,
time of day, distant clouds, optional GTAO post. Showcase: `/?showcase=environment` (uses terrain).

## Files
| file | what |
|---|---|
| `index.ts` | module: lights, service, per-render fitting (via `scene.onBeforeRender`), showcase + presets |
| `timeOfDay.ts` | sun path + keyframed look (light colours/intensities, sky, fog, exposure) |
| `sky.ts` | gradient sky dome (view-rotation only, drawn first, unfogged; fades into fog colour below horizon), sun glow, stars |
| `fog.ts` | global fog-chunk patch: camera haze + **edge fog centred on the chunk focus** |
| `shadows.ts` | `ShadowFitter`: frustum around focus (pushed toward view dir), radius by camera distance, **texel-snapped** |
| `tonemap.ts` | "KayKit" tone mapping (Neutral shoulder without toe) + 12-tap PCF patch |
| `post.ts` | optional pipeline: MSAA HalfFloat target → GTAO (depth-only, half res) → AO × colour → tone map → canvas |
| `clouds.ts` | `cloud_big`/`cloud_small` far ring (330–900 m, 120–230 m high), wrap around focus, own shader |
| `diorama.ts` | showcase-only village on a flat dry patch found by spiral search (well, 5 houses, windmill, fields, woods, Knight idle) |

## Public API — service `environment`
```ts
setTime(hours)        // 0..24, emits 'time:changed'
hours                 // current
sun                   // THREE.DirectionalLight (also the moon at night)
hemi                  // THREE.HemisphereLight
look                  // current interpolated Look (colours, intensities, lightDir, sunDir, day 0..1)
setPost(on) / post    // GTAO pipeline on/off at runtime
postPipeline          // debug access
daySpeed              // hours per real second (0 = frozen, default)
```
`__kfb.setTime(h)` works through this service.

## URL params (debug / comparison)
`time=h`, `daycycle=1` (+`dayspeed=` h/s, default 24 h per 10 min), `post=0`, `tm=aces|agx|neutral|none|linear`
(default = custom), `exposure=` (multiplier), `ao=` `aoradius=` `aopow=` `aothick=` `aoscale=` `aosamples=` `pdsamples=`
`aodebug=1` (shows AO buffer), `aooff=1`, `shadows=0`, `shadow=vsm` (untested/hung once — don't use), `soft=` (penumbra m),
`nbias=` (normal bias in texels), `nosnap=1` (debug: disables texel snapping), `shadowside=back|front|double`,
`shadowmap=` (size), `pcf=5` (three's default PCF), `clouds=0`.

## Chosen settings and why (all measured against docs/reference)
- **Tone mapping: custom** (`THREE.CustomToneMapping`, `tonemap.ts`) = identity below 0.82, Neutral's soft shoulder above.
  Same lighting, sunlit grass top: reference ≈ rgb(215,222,72) sat .67; none → (197,199,58); Neutral → (192,194,28) sat .85
  (its toe subtracts up to 0.04 per channel → acid yellow); ACES → (204,203,90) (ochre shift, greys greens); AgX → (180,176,106)
  (washed out). Final noon grass: (204–229, 207–232, 62–71), sat .70.
- **Exposure 1.25** (1.28 at golden hour) baked into the keys.
- **Lights (noon):** sun `#fff0d8` 2.9, hemisphere sky `#e4f1ff` / ground `#8e9a5a` 1.75. Morning/evening sun is
  raised to 3.2–3.4 because flat tops get sin(elev) of it; KayKit look needs bright tops at every hour.
- **Sun path:** solar noon 12:30, max ≈ 59°, 8:00/17:00 ≈ 22°, sunrise ≈ 6:10, sunset ≈ 18:50; +Z = south (noon sun),
  +X east. Default time **14:00** (sun from south-south-west → front-left of the default yaw-30 camera, like the references).
  Below +3° elevation the light cross-fades to a fixed moon (bluish, readable night with stars).
- **Shadows:** `PCFShadowMap` (PCFSoft was removed in r18x and only warns), 2048², **12-tap** Vogel/IGN PCF (three's 5 taps
  were visibly grainy at our penumbra), penumbra 0.22 m, frustum half-size `clamp(0.95·camDist + 60, 72, 150)` quantised to
  8 m, centre pushed 0.35·R along the view direction, **snapped to the shadow texel grid** (test: moving the focus in
  sub-texel steps changes 0 pixels with snapping vs ~800 px/step without), normalBias 2 texels, bias −0.00006.
  **shadowSide = BackSide** on the canonical DoubleSide KayKit materials (set via `assets.allMaterials()`, flagged in
  `userData.kfbEnvShadowSide`): with DoubleSide casting, lit walls showed self-shadow grain; back-face casting removed it.
  Currently the assets module's canonical materials are FrontSide, so this does nothing unless they switch to DoubleSide.
- **Fog:** three's fog chunks are patched globally (`fog.ts`): `fogFactor = max(haze, edge)`;
  `edge = smoothstep(edgeEnd−75, edgeEnd, |xz − focus.xz|)` with `edgeEnd = loadRadius − 38` (=152 m at 190 m).
  Derivation: a chunk loads when its centre is within `loadRadius + 72 m`; its far corner is ≤ 104 m from its centre, so
  everything within `loadRadius − 32 m` is guaranteed loaded. Haze = 28 % max over 60–420 m camera distance (aerial
  perspective only). Fog colour = sky horizon tint per time of day; the sky dome below the horizon is the fog colour, so
  the world edge dissolves into it from any camera (follow, overview, aerial). `scene.fog.near/far` are set to a
  camera-distance approximation of the edge for materials that lack the extra uniforms.
- **Post (on by default):** GTAO on the scene depth (normals reconstructed — no extra scene draw), half resolution,
  8 samples, Poisson denoise 12 samples, radius 2.5 m, thickness 1 m (2.5 gave halos behind the Knight), power 3,
  intensity 0.9, faded out 45→130 m view depth (else hex seams show through the fog). Plus 8-bit dither on output
  (sky banding). Cost: ~1.5–3 ms/frame at 1920×1080 on M1 Max (uncapped interleaved on/off, GPU shared with other agents,
  so noisy): game overview 152–634 fps off vs 167–221 on; showcase diorama 265–472 off vs 126–166 on.
  Bloom/colour grade not added — references have neither visible bloom nor grading beyond the albedo look.
- **Clouds:** own ShaderMaterial (top/bottom gradient + soft sun term); Lambert picked up the olive hemisphere ground
  colour on their undersides.

## Global effects (documented on purpose)
- `THREE.ShaderChunk.fog_*` replaced (edge fog), `tonemapping_pars_fragment` CustomToneMapping body replaced,
  `shadowmap_pars_fragment` PCF block replaced (12 taps). All at module import, before any compile.
- `kfbFogA/kfbFogB` uniforms added to every `ShaderLib` entry and to `UniformsLib.fog`.
  **Other modules' custom ShaderMaterials:** include `THREE.UniformsLib.fog` (spread or `UniformsUtils.merge`) and
  `fog: true` + the fog chunks to get the edge fog; otherwise they fall back to plain linear fog (edge approximated).
- `renderer.shadowMap.type`, `toneMapping`, `toneMappingExposure`, `outputColorSpace` are owned here.
- `scene.onBeforeRender` is chained (previous handler still called).

## Known issues / assumptions
- Slight AO/shadow grain on grass right next to small objects (feet, bush bases) at 100 % zoom.
- Shadows end at the frustum edge (~R+0.35R ahead of the focus); in overview this is inside the edge-fog band, in the
  follow view ≈ 97 m ahead, fog starts at 77 m — a far shadow boundary can still be faintly visible at the fog start.
- Golden hour / sunset ground reads olive-brown (correct for warm light, less "KayKit-poster" than noon).
- The VSM option hung a headless shot once; not used.
- Diorama door orientation assumes building fronts on local +Z (looks right in the close preset).
- Perf numbers are noisy because several agents shared the GPU.


## Round 2 changes (critic r1: 6=7.5, 10=6.5, 11=7.0)
1. **Fog model rewritten.** `fogFactor = max(haze, edge)`:
   - haze = `hazeMax(time) · smoothstep(d+30, d+380, viewDepth)` with d = camera→focus distance → the subject and the
     near field are never fogged at any zoom (aerial/180 m orbit no longer milky);
   - edge = narrow 45 m guard band ending at `loadRadius − 36` (only hides the load edge).
   - **View-dependent load radius (documented global effect):** every frame `requiredLoadRadius()` computes what the
     view needs (near field: camHorizDist+120 m; top frame edge reach + 50 m) and calls
     `ctx.chunks.configure({ loadRadius })`, clamped to [base, 1.6·base] = [190, 304] m, 10 m steps. Skipped when a
     `streaming` service exists (wave 3 owns radius; it can read `environment.requiredLoadRadius`) or with `?envradius=0`.
     Cost: overview ≈ 20 chunks, 180 m orbit ≈ 32 chunks (base 16).
2. **Noon −12 %, lower sun:** exposure 1.25 → 1.12 (noon), sun max ≈ 51°, 14:00 ≈ 47° from SW (`az = t·1.6`), hemi
   1.75 → 1.25, sun 3.0 → more shadow contrast. Open grass at 14:00: rgb(200,201,60) (ref ≈ 200,207,72).
   Morning/evening exposure 1.24–1.4 so low-sun tops don't go dull.
3. **Shadow stair steps:** 4096² map, penumbra 0.4 m (PCF radius up to 8 texels, 12 taps). No steps in crops.
4. **AO grain:** radius 1.5 m, 12 GTAO samples, denoise 16 samples/3 rings/radius 12, plus a depth-aware 16-tap disk
   blur of the AO in the output pass, and an AO white point (÷0.85) so open ground is exactly 1. Grain gone in crops.
5. **Night:** moon 0.75, hemi 0.75, exposure 1.0, post night grade (desaturate 60 % toward moon blue), darker clouds.
   Service exposes `nightFactor` (0 day … 1 night) for window/forge glow in villages.
6. **Dusk:** cooler 16–17.5 h keys (less peach fog, haze cap 0.18–0.2); 17 h open grass rgb(189,180,53).

## Round 3 changes (critic r2: 6=8.5 pass, 10=7.5, 11=8.0; plus terrain-critic fog note)
1. **Fog colour = sky colour per view direction.** `skyfn.ts` holds one GLSL `kfbSky(dir)` used by both the sky dome
   and the fog chunk (shared uniform arrays). Fogged geometry fades to exactly the sky behind it → no blue-grey rim.
   Edge band is two-stage: 0–70 % of the band adds a light land haze (fog colour lerped toward grass `#c4d27a`, max 45 %),
   only the last ~third fades to the sky colour — distant cliffs stay solid ground instead of "glass walls".
   Base load radius raised to ≥ 220 m (view-dependent up to 1.4×, still only when no `streaming` service).
2. **High views:** camera haze scales down with camera height (×0.35 at ≥ 170 m above focus); below-horizon sky is a
   land-coloured haze, so the aerial ring reads as distant land, not white.
3. **Night removed from the offered range:** `setTime()` clamps to **6:45–18:00** (`?night=1` lifts the clamp for
   debugging); `?daycycle=1` loops inside that range. Night keys stay in `timeOfDay.ts` but are not offered.
4. **Shadow grain:** replaced three's noise-rotated 5-tap PCF with a Castaño 7×7 tent filter (16 hardware compares, no
   noise) — smooth, grain-free penumbra ≈ 3.5 shadow texels. Shadow camera is rolled 15° off the hex edge directions so
   long cliff shadow edges don't alias into stair runs.
5. **Crease AO:** radius 3 m, thickness 2 m, intensity 1, gamma 1.6 on the blurred AO; fade-out 70→170 m.
6. **Lime, not mustard:** sun colours are neutral-to-slightly-green (`#f8fae6` midday, `#fbf6e2` morning/late afternoon,
   `#fdeccc` at 17:30) instead of warm orange; warmth comes from sky/clouds.

## Round 4 changes (critic r3: 6=8.0, 10=7.0, 11=8.0)
1. **Fog = long gentle land haze, not a sky-coloured band.** `fog.ts`: around the chunk focus the factor ramps from
   85 m to `loadRadius − 40` (`f = mix(t², smoothstep(t), t)`, slow start). Its colour is the light desaturated land
   haze `kfbSkyG` (fog colour lerped 60 % toward `#d2dc8c`) and only converges to the exact sky colour behind the
   fragment as f → 1 (`smoothstep(0.55, 1, f)`), so half-fogged cliffs read as distant land and fully fogged chunk
   ends are invisible against the sky. Base load radius raised to **270 m** (`?baseradius=`), view-dependent up to
   330 m; still only applied when no `streaming` service exists.
2. **AO ghost/halo fixes:** joint-bilateral upsample of the half-res AO (nearest AO texels snapped to their centres,
   depth-weighted with full-res depth at the same centres) → no bright fringe on silhouettes; gentler AO (radius 1.6 m,
   thickness 0.8, intensity 0.8, gamma 1.15) → no black blotches on overlapping cone trees, smaller smear under the knight.
   The "sliver" next to bush bases persists with AO OFF too: it is sunlit ground between the bush's shaded front and
   its shadow cast sideways (sun from SW). Normal bias lowered 2 → 1 shadow texel to tighten contact shadows.
3. **Offered range 7:30–18:00** (sun ≥ 14° at 7:30, readable shadows). 7:30–9 h has a warm peach horizon
   (`#f4e2c8`) under a paler zenith, distinct from noon.
4. Sky gradient exponent 0.38 → 0.30: blue reached sooner above the horizon band (high views less pale).

## Integration pass (after r4: 6=8.5, 10=8.0, 11=8.0)
1. **Offered time range 8:30–16:30** (`MIN_HOURS`/`MAX_HOURS` in index.ts); `setTime` clamps, `?daycycle=1` loops inside it,
   `?night=1` lifts the clamp for debugging. Default stays 14:00. Dawn/dusk keys stay in the table but are not offered.
2. **Fog by camera distance (no aerial vignette):** `fc` ramps with distance to the CAMERA from `d+75` to
   `d+max(160, loadEdge)` (d = camera→focus distance) — uniform across the frame from high views, identical to before at
   play height. A separate narrow guard band (last 60 m before `loadRadius − 40`, around the chunk focus) still hides the
   load edge; streaming owns `loadRadius` and reads `environment.requiredLoadRadius`. Fog colour uses the sky WITHOUT the
   sun glow (`kfbSkyBase`) so no glare is carried into the near field.
3. **Shadow frustum for high cameras:** when the camera is > 40 m above the focus, the shadow square is fitted to the
   view's ground footprint (frustum corner rays ∩ ground, clamped at `camDist + loadRadius`), half-size ≤ 220 m
   (`?highr=`), still texel-snapped; play height unchanged (72–150 m, 4096²). `?highshadow=0` disables for A/B.
4. **Contact AO:** radius 1.2 m, intensity 1.0, output gamma 2.4 (bilateral upsample unchanged → no halos).

## game_r3 #11 (AO halos around window frames)
AO radius 1.2 → 0.6 m and output gamma 2.4 → 1.6: protruding window frames no longer cast a smudgy dark halo on
the wall (before/after at spawn, seed 97: tools/out/environment/b_s97__follow.jpg → t_a__follow.jpg). Plinth/crease
contact darkening is weaker again. Shadow PCF (7×7 tent, noise-free) unchanged; the "dithered" look under the knight
is AO, slightly reduced. Forest crop and an AO blur increase were not verified: the disk was full (0.3 GB free).
