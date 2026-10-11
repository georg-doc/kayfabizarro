# KFB Coconino Mesa · Palette, Lighting and Game Environment Art Contract R2
Date: 2026-10-11 · Status: NEW ENVIRONMENT LOOK PRESETS AS **PROPOSALS**, not a new material/renderer/world SSOT or sampled Herriman pigment.
Owners: current KFB Clay SSOT for surface; existing Joyride + Track Core for road paint/material/geometry; World/Environment for fog/light composition; human creative authority Georg. The source donor stays recognizable. Never replace accepted road markings or red/white barrier design with arbitrary desert-themed signs.

## 0 · provenance/role separation
Binding `skills/chat/KFB_OPEN_WORLD_CLAY_SURFACE_CANON_2026-10-07.md` (K1/H0 Golden and K2/v10 technical adapter), `tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md`, and `skills/chat/KFB_STYLE_REFERENCE_ROUTER_2026-10-07.md`.
Numerical **benchmark**, NOT latest Joyride v17 track geometry: `tools/KFB-ToolBox/_inbox/KFB_OPEN_WORLD_STYLEGUIDE_2026-10-07/README.md`. Recorded track presentation tokens: asphalt `#4f5d78`, line `#efe8da`, race red `#e2522a`, race white `#e8dfcf`, underbody oxide `#c9441f`, earth support `#8c7a66`. Track deck and marks must come from actual accepted current source at integration time.
KFB baseline style-guide R2C illumination tokens (read from code by guide author): directional sun color `#fff4e6`, *engine-specific* intensity 2.9, elevation 46°, azimuth 128°; hemisphere sky `#eef4fa`/ground `#9a8a78`, intensity 1.05; backlight `#ffe6d6`, 0.6; bounce `#f3dcc4`, 1.1; sky `#96bede`; fog near 1700/far 5600 in its historical world context. THESE ARE REFERENCE PRESET NUMBERS; not direct Blender watts, not measured new scene, not universal close-range diorama fog or v17 golden.
Creative Coconino swatches below are original design TARGETS, not eyedropper samples of Krazy Kat pages.

## 1 · color roles (hex, sRGB design tokens, proposal)
The **road identity stays fixed** across all presets:
```
track.asphalt       #4F5D78   fixed benchmark family, confirm current owner
track.white         #EFE8DA
track.raceRed       #E2522A
track.raceWhite     #E8DFCF
track.oxideUnder    #C9441F
track.earthSupport  #8C7A66
```
Material ratios (proposed): 55–65% of island visible mass in one dominant family; 20–30% in secondary sand/strata; 5–10% contrasting cap/lip; <=5% accent flora/markers. This is a compositional heuristic, not a shader precision setting. Keep **road asphalt/paint contrast** and far-rock/track separation independent of biome tint; avoid tinting the entire picture with a single LUT.

### P1 · SUNSET MESA / ROAD-TRIP GOLD
```
skyZenith           #8CB9D4  clear softly blue
skyHorizon          #F7C8A4  warm peach distance
terrain.base        #B95F43  baked terracotta
terrain.ochre       #E8A357  mesa rim/sand
terrain.cream       #F2D6A5  clay cap highlight
terrain.shadow      #79546B  mauve-violet shadow
terrain.strata      #D48262  middle band
flora.sage          #8E9A6A  sparse cactus
flora.dark          #587567  small silhouette separator
cloud.clay          #F6EADB  soft/offwhite
```
LIGHT concept: sun low-medium (~30° elevation creative shot, 128° azimuth for comparability) warm key (target `#FFE1BA`), broader blue sky fill `#C9DDEA`, peach ground bounce `#E5A177`, weak cooler rim; long but **soft** contact shadows and one clear illuminated edge. Do not give all flat strata noisy photoreal texture.

### P2 · PAINTED DESERT / VIOLET HOUR
```
skyZenith           #527A9D
skyHorizon          #C8A0B8
terrain.base        #9F6680  plum stone
terrain.ochre       #DE957B  peach eroded cap
terrain.cream       #EBD4B3
terrain.shadow      #524667
terrain.strata      #C785A1
flora.sage          #72907B
flora.dark          #435A5C
cloud.clay          #DCCED8
```
LIGHT concept: directional remaining amber sun at 12–18° elevation, blue-lilac sky fill, very soft rim on far-side capped buttes; shadow colors retain local material difference. Subtle emissive roadside cues only if approved/real source, NOT neon city or self-lit full rock surface.

### P3 · COSMIC / MESARIM STRANGE DUSK (OPTIONAL biome context, not fifth island)
```
skyZenith           #344A73
skyHorizon          #B27B9F
terrain.base        #88587F
terrain.ochre       #DC9B71
terrain.cream       #E7C79F
terrain.shadow      #3E3A5E
terrain.strata      #BD779A
flora.sage          #6C9F99
flora.dark          #3D6970
cloud.clay          #C7B8D2
```
LIGHT concept: persistent cool environment fill, a small warm practical/rim motivated by low horizon light, distinct shadow gradients; selective actual source-based alien emissive foliage only in a cosmic scene. Never use glowing outlines as a substitute for track edge geometry.

## 2 · Light rig translation: existing Three.js -> Blender MCP preview -> game runtime
**Preserve direction and relationships, not a fictitious 1:1 intensity mapping**.
1. Lock world orientation, coordinate units and hero camera from the current scene recipe. Define sun azimuth in a named scene coordinate convention (engine/world axes) and transform consistently to Blender, otherwise azimuth 128° is ambiguous.
2. Three.js candidate benchmark: key Directional `#fff4e6` 2.9 / 46°; Hemi sky/ground 1.05; rim 0.6; bounce 1.1. Use established world light modules where present, not duplicate lights. Use shadow-fit.v1 world fit, texel snapping, normalBias scaled to world units per shadow texel.
3. Blender preview: one Sun lamp aligned to the **same direction**, an environment/World fill gradient or HDRI equivalent set by color roles, one motivated low-power rim, optional bounced diffuse fill. Calibrate via neutral grey and colored clay source reference under matched exposure/white balance. Sun strength, area light power, environmental intensity and color management must be measured/tuned per renderer; no direct mapping of `2.9` to Blender Sun/Watts.
4. Keep Blender render color management documented (view transform, look, exposure, gamma, display profile). Match actual in-game frame luminance and perceptual color from common objects, not screenshot autoexposure. Prefer non-glossy clay/soil, narrow roughness family variation, mild 3D surface relief.
5. Real-time night/twilight variants: one primary shadow casting sun/moon source per scene, fill via environmental indirect light where possible; no unbounded dynamic point-light collection for every cactus. Road and gameplay interactable areas must remain legible in silhouettes regardless of time.
6. Contact: shadow caster and receiver on real merged/continuous landbase, no bright rim under mesa, no detached dark hovering decals. Avoid fixed huge shadow frustum and excessive normal bias (Peter-panning); share fitted frustum/texel method.
7. Near / drive / wide views: use more fingerprint/gouge microdetail only up close; attenuate with pixel footprint/distance; broad layered color and silhouette do the work at distance. Do not bake oversized repetitive fingerprint textures at whole-island scale.
8. Keep sky and aerial depth: modest physically motivated haze according to shot distance; **do not paste historic 1700–5600 fog start/end into a tiny isolated island diorama**. Set fog based on observed scene depth and matching engine units; record measured values when it runs.

## 3 · Track-to-landscape blending / shadow staging
- Surface Truth retains driveable road shoulder, berm, collision and track height. Exposed rocky overhang must not intersect the driving swept volume.
- Gravel/dirt shoulder gradates into sandstone mass with **existing transition-atlas / world material owner**, not a new alpha overlay renderer. Red/white race safety curb stays crisp and legible; taper barriers sensibly at transitions.
- Show topsoil and road level relationship in side proof, supporting ground under ordinary road. Freestanding race span is structurally the approved Track Core source, NEVER Kenney/stone civic bridge parapet pasted under highway.
- Lighting must mark the road turn early; avoid strong same-value asphalt + shadow wall, blind reverse contour lines, overglowing barriers or silhouette loss in twilight.
- Same geo/camera baseline for P1/P2/P3 comparisons; only palette/light differences first. Later M01–M03 form variation is a separate comparison, not entangled with color.
- At least five observation views: hero 3/4, driving approach, driving apex, overhead route, source-isolated neutral/no post. Optional night transition with same exposure record.

## 4 · Suggested photometric/QA checks (NOT EXECUTED)
Design QA: composition (road connects destinations), unique mesa silhouettes, no glued geology, material source identity, track/land collision silhouette, far/near readability, visual differentiation of time of day, reference swatch parity.
Engineering QA: same camera EXR/PNG calibrated capture, shadow offset/separation, collision/traversal headroom, material count/draw calls, game GPU bench measured solo, game accessibility contrast/readability. Batching and instance counts must be measured on implementation, not invented.
Existing styleguide PERF **targets only**: draw calls <=150, <=400k on-screen triangles, 2048^2 shadow map (4096^2 desktop only), pixel ratio <=1.5. They are reference goals, not this scene's test result. Check against current product owner before accepting.

## 5 · Art direction reject list
Generic Western postcard; hyperrealistic geologic erosion; hex footprints and square block stacks; ice-cream pastel uniform wash; neon/glitch outlines; overdecorated miniature train set; unrelated city architecture; random hover rocks glued under island; road painted onto unsupported wall; Quaternius trees made up rather than source copied; repeated key/rim shadows; invented tunnel/bridge clearances and supported contact; large panels or fake KFB logo replacing visual evidence.

**One next gate**: real source-isolated geometry/Dropbox ref pixels + actual same-camera M01–M03 neutral and palette P1/P2 tracks concept before asking Blender MCP to build geometry in a named authorized lane.
