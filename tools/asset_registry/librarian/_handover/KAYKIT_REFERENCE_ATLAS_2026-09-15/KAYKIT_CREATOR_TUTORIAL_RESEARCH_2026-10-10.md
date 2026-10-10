# KayKit Creator Tutorial Research · Lighting / Environment / Production Watchlist

**Date:** 2026-10-10  
**Owner:** existing Asset Librarian / KayKit Reference Atlas  
**Consumer owners:** existing KFB Environment / Sky owner; WorldBuilder/WB2; Motion/Animation only where a tutorial actually covers those seams  
**Mode:** RESEARCH ONLY · no runtime implementation · no new lighting owner · no deployment  
**Primary source:** Kay Lousberg / KayKit creator tutorial  
**Video:** `https://www.youtube.com/watch?v=Vfr3n4WKsc0`  
**Title:** `Basic Environment and Lighting Setup in Godot`

## 0. Evidence discipline

This slice follows the Atlas evidence classes.

- **SOURCE FACT** = stated by Kay Lousberg / official KayKit pages or already-proven KFB source.
- **OBSERVED DEMO** = may be used only after the actual creator video frame/settings are visually inspected.
- **KFB PROPOSAL** = production transfer hypothesis for our own engine and must be proved in the existing KFB owner.
- **VISUAL SCAN REQUIRED** = the current Web source path did not expose the video frames/transcript reliably enough for frame-level claims.

Important limitation for this pass:

The linked YouTube page itself was not available as a frame-by-frame playback/transcript source through the current Web connector. Therefore this report does **not** invent exact Godot values, timestamps or UI settings. The creator-authored Patreon description is sufficient to establish the intended tutorial scope, but exact settings remain a later visual scan.

## 1. What Kay explicitly says this tutorial covers

### SOURCE FACT

In Kay's creator-authored September 2026 update, he describes the tutorial as a walkthrough of:

1. setting up a scene with **World Environment + Lighting** in Godot;
2. building a **day-time scene**;
3. turning **that same scene** into a **night-time scene**;
4. showing **indoor / dungeon lighting principles**.

Creator source:
`https://www.patreon.com/kaylousberg/posts/updates-recap-169539427`

This is unusually relevant to KFB because our current Island product already requires one existing Sky / Environment owner and a coherent world-light state rather than a second renderer or per-character lighting system.

## 2. Direct KFB owner match

### Existing KFB truth

The current WorldBuilder source already defines the correct ownership split:

- **Environment Profile owns** light / fog / torch or local visibility / exposure behavior.
- **Material / shader style remains separate** through its own material owner.
- Existing source-isolated lighting donor:
  `tools/KFB-ToolBox/_inbox/KFB World Design Setup (1)/WORLDDESIGN_LAB_2026-09-23/deliverables/wd-light.js`
- The current donor already exposes:
  `ambient`, `world`, `fog`, `torch`, `torchRange`, `flicker`, `local`, `exposure`.
- It also already has a bounded local-light pool and a shadow-casting directional key.

### Product contract match

Current Island MVP frozen contract:

- **F-R24 · Sky / Environment:** existing Sky/Skydome owner only; coherent world lighting, atmosphere and environment state.
- **F-R39 · Early Visual/Physical Golden:** KFB Clay / Sky / light must already be product-valid before broad fan-out.

Therefore the Kay tutorial should be consumed as **source-author calibration/reference input for the existing Environment owner**, not as a Godot subsystem to port and not as permission to introduce another lighting stack.

## 3. Main production lessons for the MVP

### Lesson A · Environment is a scene state, not a character hack

**SOURCE FACT:** Kay frames the tutorial around World Environment + Lighting and demonstrates day/night/indoor contexts.

**KFB PROPOSAL:** keep global atmosphere/light as one environment-state/profile seam. Characters consume that scene light; they do not carry a second private world-light rig.

This is consistent with the existing Environment Profile architecture.

### Lesson B · Day → Night should be a variant of the same authored scene

**SOURCE FACT:** Kay explicitly describes turning the same day scene into night.

**KFB PROPOSAL:** our eventual Day/Night proof should switch environment/profile state while preserving canonical world geometry and object identity. Do not duplicate the island merely to obtain a different look.

That makes Save/Reload, authoring and future time-of-day transitions substantially safer.

### Lesson C · Indoor / Dungeon is a different lighting problem, not merely "make night darker"

**SOURCE FACT:** the creator calls out indoor/dungeon lighting separately from day/night.

**KFB PROPOSAL:** the KFB Environment owner should support a bounded local-light / local-visibility presentation for interiors while preserving the same material owner. Existing `torch`, `torchRange`, `flicker`, `local` and `exposure` fields already provide the correct architectural seam.

Do not copy Godot light intensities numerically into Three.js. Calibrate them visually in the KFB renderer.

### Lesson D · Evaluate KayKit materials under both neutral and production lighting

The low-poly KayKit characters and props use compact gradient-atlas material language. A lighting mistake can be misdiagnosed as a material problem and vice versa.

**KFB PROPOSAL:** every representative KayKit source proof that matters to the Island Golden should be checked twice:

1. neutral/source-readable light;
2. candidate KFB world Environment Profile.

Material and light remain orthogonal. If an asset looks wrong only in the world profile, tune the environment/profile first rather than destructively rewriting source material.

### Lesson E · Character readability belongs inside the Environment proof

For the MVP, environment lighting is successful only if it preserves readable character silhouettes/faces/limbs in actual third-person play.

**KFB PROPOSAL fixture:**

- `Mannequin_Medium` as the diagnostic KayKit-native actor;
- one representative real Rig_Medium KFB/Resident actor;
- one representative Rig_Large actor;
- same camera, ground and framing;
- neutral vs world-profile comparison;
- idle + locomotion frames, not only T-pose.

Measure visually:
- face/head separation;
- arm/torso separation;
- feet/contact shadow readability;
- dark-side crush;
- overexposure / color wash;
- silhouette against sky/terrain;
- motion readability while turning/running.

### Lesson F · Emission should follow creator-authored material semantics when present

Independent supporting SOURCE FACT from Kay's Holiday Bits release:

Assets with lights use a secondary material named `holiday_glow`, intended to receive emission in the consuming engine.

Source:
`https://www.patreon.com/kaylousberg/posts/holiday-bits-145351214`

**KFB PROPOSAL:** when KayKit assets expose a source-authored glow/emissive material, preserve that material role and map it through the existing material/environment owners. Do not fake the glow by recoloring the whole mesh or by adding arbitrary unbounded point lights.

### Lesson G · Local lights require a budget

The existing KFB WhackMan-derived donor already uses a bounded pool (six torches maximum in that donor).

**KFB PROPOSAL:** if creator tutorial principles lead us to richer dungeon/local lighting, preserve a bounded pooled-light design. No one-light-per-prop explosion. Exact budget remains consumer/performance-owned.

## 4. MVP Lighting SOP candidate

This is a **proposal for a later Environment-owner proof**, not implementation done by this research slice.

### Step 1 · Source isolation

Show one actual KayKit source actor/prop in isolation before adaptation.

Record:
- object/material names;
- emissive/glow material names if present;
- original atlas/material assignment;
- rig class for characters.

### Step 2 · Neutral profile

Use one stable neutral fixture to judge source geometry/material without cinematic grading.

Record:
- key/fill/ambient arrangement;
- shadows on/off;
- exposure/tone mapping;
- background;
- no untracked per-asset light hacks.

### Step 3 · World profile variants

Using the **same scene/object geometry**, compare only environment state:

- outdoor / day candidate;
- outdoor / night candidate;
- indoor / dungeon candidate.

The names are test labels, not new canon IDs.

### Step 4 · Character readability matrix

For each profile:
- Mannequin_Medium;
- representative Rig_Medium Resident/player;
- representative Rig_Large actor.

Capture front / side / 3/4 and one locomotion clip.

### Step 5 · Material/light fault isolation

If a result fails:
1. compare against neutral light;
2. compare material unchanged;
3. compare environment only;
4. alter material only if the source/material owner proves it is necessary.

### Step 6 · Runtime/performance proof

Record:
- active light count;
- shadow-casting light count;
- shadow map settings;
- fog;
- exposure/tone mapping;
- emissive/bloom path if used;
- exact candidate head;
- target-machine performance under actual play.

Do not infer performance from Godot.

## 5. What NOT to transfer from the Godot tutorial

- Godot node structure as a KFB runtime architecture.
- Godot numeric light-energy/exposure values.
- a new WorldEnvironment owner.
- a duplicate Day/Night scene.
- a per-character lighting stack.
- renderer-specific GI/post-processing assumptions.
- default KayKit materials as final KFB Clay/Claybound product look.
- creator video staging as proof of Three.js compatibility.

## 6. Prioritized Kay Lousberg / KayKit creator video queue

This list is **verified but not claimed exhaustive**. The current channel index was not exposed completely by the search surface, so only creator/source-confirmed videos or channel VOD batches are listed.

| Priority | Source | Why it matters to KFB | Next extraction |
|---|---|---|---|
| **P0** | **Basic Environment and Lighting Setup in Godot** · `Vfr3n4WKsc0` | Direct input to F-R24/F-R39; KayKit-native world/character presentation; day/night/dungeon | frame/settings scan; environment controls; light types; shadows; exposure; fog/sky; character readability |
| **P0** | **Using KayKit Characters In Godot (Detailed Version)** · `4p7QaOd8SHE` | Current source-author import/character setup; material/texture handling; rig/attachments; detailed animation setup | exact import settings; material extraction; slots/attachments; Mannequin/rig handling; state machine/timing |
| **P1** | **How to use KayKit Character Animations in Unity and Godot** · `rwst5GnUU7s` | Source-author animation library workflow, applying animations to other KayKit characters, weapons | treat as **legacy 2022-era workflow**; extract only durable rig/library/weapon principles |
| **P1** | **KayKit - Animations - Overview Set 1** · `T1KNCtAqJ7A` | Source-author visual catalogue; useful for clip semantics and intended motion read | label as **pre-current-1.1 overview** (published 2024-11-30); build clip/version crosswalk before using as current truth |
| **P2** | **KayKit Live Show VODs · Episodes 0–4** | Kay's own Blender asset-modeling process; useful for modular construction, proportions, pivots, low-poly style and source-author intent | mine only concrete recurring modeling conventions; do not treat long-form VOD chatter as canon |

### Version note

Current official KayKit Character Animations itch page was updated 2026-09-16 and advertises **161 humanoid animations**, Rig_Medium + Rig_Large, with files split by animation set/category.

Source:
`https://kaylousberg.itch.io/kaykit-character-animations`

The 2022 tutorial belongs to an older animation-pack lineage. The 2024 Overview Set 1 also predates the current 1.1 page update and must not silently define current clip inventory.

## 7. Standard extraction template for every next creator video

For each source-author video, persist:

| Field | Rule |
|---|---|
| source/video id | exact URL + title + publication date when verified |
| asset/version | identify current vs legacy |
| timestamp | exact moment |
| seen | only what is visibly shown |
| spoken/source claim | only what creator states |
| settings visible | exact labels/values where readable |
| source object | character/prop/pack actually shown |
| still | 3–6 stills per important sequence/topic |
| KFB owner | existing owner that may consume it |
| transfer class | KEEP CONCEPT / ADAPT / ENGINE-SPECIFIC / NOT APPLICABLE |
| proof required | exact KFB fixture needed before adoption |
| unresolved | NOT SHOWN instead of guessing |

## 8. Recommended analysis order

1. **Finish visual scan of the linked Lighting tutorial** because it can immediately sharpen the Environment-owner Golden.
2. **Detailed Godot Characters** because it spans import/material/rig/animation seams and has already proven useful to external Godot users.
3. **Animations Overview Set 1** to build a creator-intent clip crosswalk against current 1.1.
4. **2022 Unity/Godot animation tutorial** only for durable principles and historical comparison.
5. **Live Show VODs** selectively when a concrete modeling question appears (road/prop/building/character source construction), not as a binge-watch task.

## 9. Next gate

**KAYKIT-CREATOR-LIGHTING-VISUAL-SCAN-01**

Goal:
obtain real frame/timestamp evidence from `Vfr3n4WKsc0` and populate the missing OBSERVED DEMO layer without changing the current Environment owner.

Return should contain:
- timestamp table;
- readable settings;
- 6–12 decisive stills rather than exhaustive screenshots;
- creator fact vs inference split;
- a delta against existing `wd-light.js` / Environment Profile;
- exactly which KFB A/B fixtures are worth testing next.

No runtime implementation belongs to that scan.


## 10. Additive channel discovery pass · 2026-10-10

### Discovery result

A fresh web search did **not** expose a complete searchable upload index for Kay Lousberg's YouTube channel. It would be inaccurate to present a complete channel inventory or invent individual video IDs. The four named tutorial URLs in section 6 remain the verified direct-watch anchors.

One useful expansion was established from creator/peer-origin material:

- **KayKit Live Show episodes 0–4** are an official **five-episode VOD sequence** and produced the 24-asset Mixed Bag 1 pack. Kay explicitly describes teaching Blender modeling while producing the assets.
  - source: https://www.patreon.com/kaylousberg/posts/updates-recap-169539427
  - individually verified YouTube VOD URLs in this pass: **0/5**; do not invent episode URLs.
- **KayKit Live Show episode 6** is supported by an October 2026 link in Kenney's Bluesky feed to Kay Lousberg's Twitch stream, described as "Episode 6 (Blender3D game asset modeling)" involving an Atari 2600 request. That proves the continuing **live series / Twitch episode**, **not** a verified YouTube VOD upload.
  - source: https://bsky.app/profile/kenney.nl
  - YouTube VOD URL: **NOT VERIFIED**.
- Episode 5 is implied by the episode 6 numbering but has not been individually source-verified in this pass. Do not list it as a watched or available YouTube video.

### Expanded priority queue by productive outcome

| Priority | Existing/extra source | Production use | Evidence status |
|---|---|---|---|
| P0 | Lighting tutorial `Vfr3n4WKsc0` | Environment visual settings / isolated character readability | Direct URL verified; frames/settings pending |
| P0 | Detailed KayKit Characters in Godot `4p7QaOd8SHE` | source import/materials/animation workflow, current MVP Resident seam | Direct URL from existing creator-scan brief; full scan pending |
| P1 | KayKit Animations Overview Set 1 `T1KNCtAqJ7A` | native clip appearance/semantics comparison | Direct URL verified, legacy-vs-1.1 crosswalk pending |
| P1 | KayKit Animations Unity & Godot `rwst5GnUU7s` | weapon/animation import principles | Direct URL verified; legacy source |
| P1 (selective) | Live Show Episodes 0–4 | **Blender source-author geometry**: model scale/pivots, modularity, material atlas, reusable props; especially Town/WorldBuilder/Dungeon/track-side scenery | Creator-confirmed VOD series; per-episode YouTube URL/topic/timestamps pending |
| P2 | Live Show Episode 6 (Twitch stream) | Later modeling academy and prop production; request→Blender asset workflow | Episode/live supported by Kenney; YouTube VOD **unverified** |
| P2 | More KayKit live sessions/episodes | Only inspect if actual official VOD URL + concrete KFB modeling problem available | Open discovery; no invented entries |

### Reusable work-chat queue

For each actual video or 15–30 minute VOD segment, create one additive Atlas entry with:
1. verified creator/source URL and exact video/version;
2. short timestamped evidence table, settings/mesh/material or clip names;
3. `SOURCE FACT` vs `OBSERVED DEMO` vs `KFB PROPOSAL`;
4. one current KFB receiving owner and exact already-existing donor, if any;
5. targeted Lessons Learned / Best-Practice / SOP candidate;
6. acceptance fixture and what remains untested;
7. update this report and owning `RETURN.md` at a coherent milestone.

Keep the first implementation gate unchanged: `KAYKIT-CREATOR-LIGHTING-VISUAL-SCAN-01`. A channel-index pass can proceed separately as research without blocking it.

### Third-party cross-reference (not Kay's own channel)

Brackeys' later Godot 3D tutorial references Kay Lousberg/KayKit assets. It is a **consumer integration example**, not Kay's native authoring guidance; do not silently include third-party videos in the creator-only queue.


## 11. Recovery continuation · 2026-10-10 · newly verified official sources

After verifying previous GitHub head and Production Control records, fresh public source discovery found:

- Official KayKit Mixed Bag 1 source page: https://kaylousberg.itch.io/mixed-bag-1 . Kay lists **24 viewer requests**, over **50 models** counting accessories/variants, and confirms the models were authored live on stream. The page's "watch the VODs here" link resolves to the official channel `https://www.youtube.com/@KayLousberg`, **not to individual episode permalinks**. Therefore per-episode URL/timecode extraction remains open.
- High-value modeling/source-isolation targets from Kay's official request list: **Circus Tent** (Town/performance/stage), **Dungeon Chains** (Dungeon/Prison), **Bicycle/Skateboard/Rollerskates** (mobility props/attachment), **Arcade Machine** (Town/minigame), **Tool Cart** (Fluff worker/equipment), **Sandcastle** (Town/beach terrain staging), **Comic Boxes** (physical KFB-deck/prop composition). These are source-authored asset requests, not proof of present KFB repository ownership or attachment compatibility.
- Mixed Bag 1 FREE vs EXTRA vs SOURCE tiers are distinct: source page describes 16+ FREE models, all 24+ requested assets and variants in EXTRA (59 models), and Blender `.blend` editable files in SOURCE. Do not claim a specific tier is owned without Registry/entitlement proof.
- Official Series 6 pack page https://kaylousberg.itch.io/kaykit-series-6 contains an embedded animation preview `https://www.youtube.com/watch?v=zSzzEmdIiXI`. Treat as **creator-site linked visual demo** for clip/body-scale comparison, not a new standalone tutorial or proof of current Rig_Medium/Rig_Large compatibility.
- Official Character Animations page https://kaylousberg.itch.io/kaykit-character-animations explicitly describes paid SOURCE-tier editable `.blend` per animation set with a basic control rig. This adds a possible source-authored Blender MCP deep-dive when entitlement is verified, not a request to buy or to supplant the native Motion owner.

**One next gate remains:** `KAYKIT-CREATOR-LIGHTING-VISUAL-SCAN-01`. Any further per-episode video link discovery is optional preparatory research.

## 12. Lighting video gate execution attempt · 2026-10-10

The requested next gate was attempted, but the exact YouTube video could not be acquired as playable frames or readable transcript in this Web runtime (YouTube page/oEmbed cache misses; targeted transcript/video-ID searches yielded no source; direct container outbound network/DNS unavailable). Thus: **0 verified frames, 0 timestamps, 0 observed Kay settings**; this is `INPUT_BLOCKED`, not a creator-technique PASS or an authorization to build a substitute lighting runtime.

A useful technical-source audit of the actual KFB lighting donor and newer shared shadow recipe **was** completed with **18/18 source assertions**. Important correction: `wd-light.js` is a **WhackMan WorldDesign Lab comparison donor**, not the authoritative active World Environment implementation. It has only BASELINE/WHACKMAN profiles and fixed old lab shadow biases; the newer `tools/KFB-ToolBox/docs/LESSONS_SHADOWS.md` uses texel-relative shadow bias/frustum fit and remains the intended KFB shared contact approach. `wd-light.js` also writes scene background/fog and renderer tone mapping, so host-owner arbitration is mandatory before any integration.

**Read complete source and acceptance boundary:**
`KAYKIT_LIGHTING_VIDEO_SOURCE_AUDIT_2026-10-10.md`

Single next gate remains `KAYKIT-CREATOR-LIGHTING-VISUAL-SCAN-01` with a video/browser-capable executor; retain source-isolated screenshot/timecode evidence before treating any Kay settings as observed. Current WB2 R4 remains STOPPED/NO MVP, untouched.


## 13. KayKit & Co thematic coverage · 2026-10-10

New cross-creator topic/production gap survey:
`KAYKIT_AND_CO_TOPIC_COVERAGE_MATRIX_2026-10-10.md`

Official Quaternius catalog confirms 28 tutorials. Most immediately useful, source-unreviewed new subjects: Gradient Texturing (#2), Character Rigging (#8), Easy IK (#10), Medieval House (#11), Rigging Objects (#12), Atlas Texturing (#19), Blender Blendshapes (#21–22), Wiggle Bones (#24), Cel Shader (#26), UV Mapping (#27).

Kenney official guides add measured **Asset Forge-specific** module/pivot/scale conventions, GLB/material import and modular export; they are not automatically KayKit or KFB canon.

Survey separates **available creator guidance** from **KFB verified modules** and **still-unproven source-to-runtime behaviour**, explicitly correcting historical old-pack gap claims using the Atlas 2026-09-18 override. No creator video frames, new runtime work or public site update. Current Lighting visual-scan gate remains open.
