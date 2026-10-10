# KAYKIT-CREATOR-LIGHTING-VISUAL-SCAN-01 · source audit / evidence boundary

Date: 2026-10-10
Existing owner: Asset Librarian / KayKit Reference Atlas (research only)
Receiving owners: existing KFB World / Sky / Environment, existing material and shadow owners
Branch: research/kaykit-creator-tutorial-atlas-2026-10-10
Mode: RESEARCH / TECHNICAL SOURCE AUDIT ONLY
Status: SOURCE-AUDIT COMPLETE · VIDEO-FRAME / TRANSCRIPT EVIDENCE UNAVAILABLE · VISUAL SCAN STILL OPEN

## 1. The exact input and acquisition outcome

Primary video: https://www.youtube.com/watch?v=Vfr3n4WKsc0
Creator: Kay Lousberg / KayKit
Topic per creator statement: Godot WorldEnvironment + lighting, daylight scene converted to night using that same scene, and indoor/dungeon lighting principles.

Creator-authored source:
https://www.patreon.com/kaylousberg/posts/updates-recap-169539427

Video acquisition attempted:
- direct YouTube page through Web: cache miss / no readable video frames or transcript;
- YouTube oEmbed through Web: cache miss;
- targeted search for video ID, transcript, captions, and title: no usable transcript/frame result;
- container Python requests: outbound DNS/network unavailable; no video stream could be fetched.

**Zero actual video frames viewed. Zero verified timecodes. Zero transcribed utterances. Zero Godot numeric settings attributed to Kay.**
A title/topic verified from a creator post must not be promoted to `OBSERVED DEMO`.

The visual scan is therefore **INPUT_BLOCKED**, not `PASS`. Do not try to fill the missing evidence with unrelated tutorial illustrations or Godot manual screenshots.

## 2. Separate external Godot engine references (NOT claims about Kay's video)

Official Godot documentation:
- https://docs.godotengine.org/en/4.4/tutorials/3d/environment_and_post_processing.html
- https://docs.godotengine.org/en/4.4/tutorials/3d/physical_light_and_camera_units.html

**ENGINE FACT, not Kay video observation:**
- `WorldEnvironment` applies a scene-wide environment; one per active Godot scene tree; Camera3D may override it.
- The Godot editor's preview sun/environment is not necessarily rendered in the running project.
- Background sky can feed environmental ambient/reflected lighting; background changes therefore affect illumination in some modes.
- Tone mapping / exposure / fog / ambient / direct lights are separate concerns.
- Godot renderer/version-dependent units and GI methods cannot be translated numerically to Three.js.

These facts justify what to inspect in the video and in KFB; they do not establish which values Kay chose.

## 3. Current GitHub owner and donor reconciliation

### A. Frozen product state

WorldBuilder / WB2 PR #348 remains **R4 STOPPED / F-R39 FAIL / NO MVP** per owning Return on that PR. The creator research **does not** authorize World R4 repair, R5, another terrain or renderer implementation.

### B. Existing WorldDesign lighting donor

`tools/KFB-ToolBox/_inbox/KFB World Design Setup (1)/WORLDDESIGN_LAB_2026-09-23/deliverables/wd-light.js`

**SOURCE-INSPECTED TECHNICAL FACTS:**
- The header identifies the file as an **independent comparison layer**, NOT the production runtime Environment owner.
- Only two light profiles are explicitly implemented: `baseline` and `whackman`. There are **no dedicated Day/Night/Indoor profiles** in this module.
- Exposed controls: ambient, world, fog, torch intensity, torch range, flicker, local visibility and exposure; light and material are kept independent.
- One HemisphereLight, one shadow-casting DirectionalLight (key), one DirectionalLight (fill), one local PointLight and a bounded six-PointLight torch pool are created for its comparison rig.
- Torches are enabled only when `profile === 'whackman'`; this is donor behavior, NOT a generally accepted rule for Night/Indoor.
- The source hardcodes `key.shadow.mapSize=(2048,2048)`, `bias=-0.0006` and `normalBias=0.02`; these are lab constants, not current shared contact-shadow recommendations.
- `refresh()` writes `scene.background` and `scene.fog`; `applyRenderer()` writes `renderer.toneMapping` and `toneMappingExposure`. These writes MUST remain under the current host Environment/renderer owner when consumed; never instantiate a competing rig in WB2.
- `scene.userData.skyBg` may override background, but the fog colour derives from the local `bg` token; a Sky/Fog colour mismatch is a potential **integration review point**, not a proven runtime defect.
- Shadow camera is fitted from a passed bounding box; this does not prove camera fitting for a complete island/terrain.

Donor status: `EXISTING LAB / DONOR_ONLY`. No actor lighting look or screenshot was visually isolated or accepted in this slice.

### C. Current shared shadow/contact SOP overrides historical fixed lab numbers

`tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md`

**SOURCE-INSPECTED TECHNICAL FACTS:**
- tight, fitted shadow frustum; snap shadow camera centre to world/light texels;
- derive `normalBias` from world-units-per-shadow-texel, not universal `0.02`;
- keep ordinary bias small;
- preserve actual double-sided glTF body casters; exempt genuinely thin overlays;
- known failure: Peter-panning/contact seams with hardcoded oversized bias and large/frustum far ranges.

**Transfer:** when studying Kay's shadows, record the principle (readable actor/ground contact) but apply the existing KFB `LESSONS_SHADOWS.md` recipe, not the old donor constants.

### D. Material stays orthogonal

KFB's accepted K1/H0 and K2/v10 Clay/Claybound visual directions remain the receiving material truth. Neutral KayKit gradient-atlas light is a SOURCE comparison fixture; not a replacement for KFB product look or a requirement to turn bloom/VFX into print texture.

## 4. Exact concept-to-owner comparison

| Scope | Kay/source status | Existing KFB evidence | Smallest actionable check | Adoption |
|---|---|---|---|---|
| Scene lighting | Creator topic confirms WorldEnvironment | existing Sky/Environment owner; wd-light comparison donor | verify ONE host-owned light state and captured runtime output | proposal, not adopted |
| Day scene | Creator description confirms day setup | baseline lab profile exists; no Day canon preset proved here | source actor on unchanged ground, stable camera, current KFB material | visual test required |
| Night scene | Creator describes transforming same scene | WhackMan dusk/dark torch pool exists as donor | same object IDs/geometry, adjust only Environment state, preserve silhouette | visual test required |
| Dungeon/interior | Creator says separate indoor principles | WhackMan torch pool/local light donor | show real Dungeon KayKit source room, local light reach/contact with outside fallback | visual test required |
| Character lighting | KFB use hypothesis, not creator observation | Mannequin_Medium and Rig_Medium/large source family | 3/4 + front/side/locomotion matched neutral vs KFB World profile | KFB fixture required |
| Shadow grounding | Godot engine supports shadow settings; video unknown | CURRENT `LESSONS_SHADOWS.md` | contact/no peter-panning, double-sided body casters, texel fit | existing SOP, evaluate |
| Sky vs ambient/fog | Official Godot docs establish connection | wd-light background+fog writes; current Sky owner separate | match sky/ambient/fog/renderer state on day/night | no duplicate owner |
| Glow/emission | `holiday_glow` official other Kay source, not this video | additive glow sprites in lab donor | inspect real source material, do not invent a light per emissive prop | pending source isolation |

## 5. Reproducible future visual inspection request for Claude Coworker / Blender MCP

**Only after a readable creator video source exists** (YouTube VOD/legally accessed local copy or an available stream segment):

1. **Timecoded creator observation:** identify when scene environment, day key/sky, night transition, indoor/dungeon local light, shadow properties, tone mapping and exposure are actually shown. Mark unshown fields `NOT SHOWN`, no invented numbers.
2. **Screenshots:** 6–12 useful readable frames across three chapters, with source video ID, exact timestamp, UI setting or object visible. Do not public-rehost the video.
3. **Source isolation:** load an actual registered KayKit character/prop alone with original geometry/materials and an explicit rig/version label. One loaded URL alone is not source-design proof.
4. **Matched proof:** one-source actor under neutral and existing KFB presentation light at the same view/scale; indoor scene via existing Dungeon donor when relevant. Record third-person readability, colour/contrast, hand/head separation, foot/shadow contact, and any shadow artifacts.
5. **Owner transfer:** output source-author `KEEP_CONCEPT` / engine-specific `ADAPT` / `REJECT` rows, with current KFB receiving owner, actual test and missing evidence. No new lighting/runtime owner, and no Godot-to-Three numeric import.
6. **Stop at research proof:** any actual WB2/World integration requires separate explicit post-A/B production authorization. No implementation/publish in this research gate.

Suggested table:

| Time | Setting/asset visibly shown | Creator's claim | Screenshot filename | Engine-specific value (if readable) | KFB owner/transfer | Confidence |
|---|---|---|---|---|---|---|

## 6. Static audit evidence (not runtime quality)

Using current remote `main` versions of `wd-light.js`, the WhackMan/WorldDesign donor router and `LESSONS_SHADOWS.md`:

- **18/18 static source/contract assertions PASS**
- video screenshots: **0**
- source-isolated render screenshots: **0**
- transcript lines: **0**
- exact video settings / timestamps: **0**
- Three.js runtime/browser tests: **0**
- Blender MCP execution: **0**
- Stage/Site publication: **0**

This does **not** close the visual gate.

## 7. Single next gate

`KAYKIT-CREATOR-LIGHTING-VISUAL-SCAN-01` remains **INPUT_BLOCKED** until actual timestamped Kay creator frames/transcript can be accessed by a video/browser-capable executor. Resume from this exact GitHub dossier; do not repeat the source audit or re-create a lighting module.
