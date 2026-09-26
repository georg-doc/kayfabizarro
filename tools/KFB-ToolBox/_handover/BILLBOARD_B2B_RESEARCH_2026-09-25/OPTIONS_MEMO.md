# Billboard B2b · Living Mockup / Collage · Research & Options Memo

Status: **RESEARCH COMPLETE · CHOICE PENDING · RUNTIME NOT STARTED**
Date: 2026-09-25
Owner: **KFB ToolBox / Billboard Media Residency**
Base: accepted B2a `07da4adfd1de293d03682d1af90a01df2a1eba19`

## 0 · Decision in one page

KFB does **not** need a complex Living-Mockup editor.

The smallest useful system is:

**curated source pool → deterministic collage recipe → one shared source texture → optional lightweight screen treatment**

For the first B2b POC, the strongest route is:

### Recommended first POC · A+
**CanvasTexture compositor + small provenance-tracked pool + deterministic no-repeat scheduler + 2–3 “living screen” treatment presets.**

Why:
- KFB already has a working CanvasTexture collage donor in the original Billboard Gate-1 code;
- KFB already uses CanvasTexture widely for cards, titles, signs, dice and screen-like content;
- it can mix stills, KFB card fragments, type and drawn shapes in one surface without another DOM/CSS3D owner;
- it keeps the accepted B2a YouTube CSS3D path separate;
- it can later accept local `VideoTexture` layers or be upgraded to a RenderTarget without changing the billboard owner;
- it is enough to create the “living advertising / hypernormalisation” feel Georg described.

Do **not** start from EffectComposer, a full editor, live web scraping or a miniature second app inside the billboard.

---

# 1 · What the WithSeismic reference actually contributes

Reference:
https://withseismic.com/post/living-mockups

Useful ideas:
- screens/pages/LED surfaces are **live textures**, not baked flat renders;
- multiple visible surfaces can derive from **one shared source**;
- reflections and emissive treatment can respond to that same source;
- browser runtime can remain interactive;
- the editor is incidental to the concept, not required for KFB.

KFB translation:

`CollageSourceCanvas → billboard map/emissive feed → optional reflection/light mask`

The KFB billboard does not need WithSeismic's inline editing UI. It needs the shared-source mapping idea and a restrained believability layer.

---

# 2 · Existing KFB donors · reuse before rebuild

## 2.1 Original Billboard Gate-1 collage is already a real donor

Current source:
`tools/KFB-ToolBox/_inbox/KFB Billboard Media Szene · B0 Source Proof/BILLBOARD_B0_SOURCE_PROOF_2026-09-24/bb-scene.js`

It already contains:
- `drawCollageFace()`;
- torn clipping shapes;
- 3 fragment slots;
- KFB card imagery as the source;
- alpha pulse;
- small drift;
- typography;
- paper grain;
- `BillboardContent`;
- one `THREE.CanvasTexture`;
- a `COLLAGE` mode updated over time.

This is important: **B2b is not a blank-sheet collage engine.**
The old collage was visually only a sketch, but its architecture is the most relevant donor.

Do not simply promote it unchanged because:
- it uses `Math.random()` directly for torn edges/grain;
- the source pool is effectively one KFB card;
- it redraws continuously in COLLAGE mode;
- it has no provenance manifest;
- it has no no-repeat scheduler;
- it has no authored look presets;
- its debug tag is not a player-facing design;
- there is no explicit performance budget.

## 2.2 KFB already prefers CanvasTexture for this exact class of job

Examples already in repo:
- `skills/kfb-card-builder.js`;
- `travel/travel-v16/terrain-v16/card-title.js`;
- `travel/travel-v16/terrain-v16/card-carrier.js`;
- `travel/travel-v16/terrain-v16/hud-cube.js`;
- `tools/osm-city-lab/src/viewer/street-signs.js`.

The Birthday consumer direction also explicitly called for:
**KFB/Public-Domain/own imagery → CanvasTexture or short VideoTexture loop**, not a second app.

Reference:
`tools/KFB-ToolBox/_handover/BIRTHDAY_STARTSCREEN_2026-09-15/POST_RETURN_CORRECTIONS_2026-09-15.md`

## 2.3 Existing Racer rule

The Racer billboard addendum already says later `COLLAGE_LOOP` may mix:
- public-domain still fragments;
- KFB snippets;
- type cards;
- poster fragments;
- short looping screen content;

and that external sources must record provenance.

Reference:
`tools/KFB-ToolBox/_handover/CLAUDE_DESIGN_WORLD_RACER_2026-09-22/RACER_CLAUDE_HUD_BILLBOARDS_ADDENDUM_2026-09-23.md`

B2b should become the reusable implementation concept for that later lane rather than inventing a Racer-only collage.

---

# 3 · Three.js building blocks

## CanvasTexture · primary still/type compositor
Official:
https://threejs.org/docs/pages/CanvasTexture.html

Use for:
- KFB card/detail crops;
- public-domain stills;
- type/headline fragments;
- masks;
- paper/torn shapes;
- grain;
- color/tint overlays;
- composited frames.

This is the best first owner because one canvas can produce exactly one texture for the accepted billboard face.

## VideoTexture · local rights-cleared moving fragments
Official:
https://threejs.org/docs/pages/VideoTexture.html

Use only for:
- local MP4/WebM loops that KFB owns or has explicitly cleared;
- a small number of moving slots;
- pre-authored collage loops if runtime generation is not desired.

Keep **YouTube** on the accepted B2a CSS3D path.
Do not try to route YouTube through VideoTexture.

## WebGLRenderTarget · later richer 2.5D collage
Official:
https://threejs.org/manual/#en/rendertargets
https://threejs.org/docs/pages/WebGLRenderTarget.html

A render target is a texture that another Three.js scene can render into.

Use later if KFB needs:
- real parallax between collage layers;
- tiny 3D objects within the screen;
- particles/lighting inside the billboard content;
- multiple VideoTexture planes with depth.

Not needed for first POC.

## MaskPass / EffectComposer / ShaderPass · optional, not baseline
Official:
https://threejs.org/docs/pages/MaskPass.html
https://threejs.org/docs/pages/EffectComposer.html
https://threejs.org/docs/pages/ShaderPass.html

Useful for sophisticated post-processing but too heavy as B2b's foundation.
A billboard-local texture/mask treatment is cheaper and easier to isolate than changing the host renderer pipeline.

---

# 4 · Architecture options

## Option A · CanvasTexture Collage Engine

### Shape
`asset refs + text refs + recipe + seed → canvas compositor → CanvasTexture → accepted billboard face`

### Capabilities
- still images;
- card crops;
- headlines/text;
- torn masks;
- simple transforms;
- color grading;
- alpha fades;
- pan/zoom;
- cheap non-repetitive sequencing.

### Strengths
- smallest change from accepted KFB donors;
- one texture owner;
- deterministic;
- easy screenshot evidence;
- easy provenance;
- easy performance throttling;
- no CSS3D depth/backside problems.

### Limits
- 2D/2.5D only;
- local videos need an explicit draw-to-canvas or separate VideoTexture strategy;
- reflections/parallax are approximations unless extended.

### Verdict
**Best B2b foundation.**

---

## Option A+ · CanvasTexture + Living-Surface treatment

Same content owner as A, plus 2–3 switchable display treatments.

Potential treatment channels:
- base color = collage canvas;
- restrained emissive contribution;
- vignette / edge falloff;
- subtle reflection gradient;
- optional LED/pixel mask at driving distance;
- optional grime/paper/screen mask;
- one palette/tint preset.

Two implementation depths:

### A+ light
Bake the treatment into the canvas frame:
- gradients;
- scan/LED pattern;
- highlight/reflection streak;
- tinted/luma layer.

Cheapest and safest.

### A+ material
Use the same source texture for map + emissive feed and add one tiny screen-specific mask/material seam.

Closer to WithSeismic's shared-source/reflection/emissive idea.

### Verdict
**Recommended first POC = A plus a very small A+ treatment switch.**

Do not build a post-processing stack yet.

---

## Option B · Mini-scene → WebGLRenderTarget

### Shape
`collage recipe → tiny Three.js content scene → WebGLRenderTarget.texture → billboard`

### Strengths
- real depth/parallax;
- VideoTexture slots are natural;
- particles and dynamic geometry possible;
- later easy to make “surreal TV” content.

### Costs
- more draw calls;
- second render scene/camera;
- more lifecycle/resize complexity;
- harder to author/debug than CanvasTexture.

### Verdict
**Good second-generation mode if A+ feels too flat. Not first POC.**

---

## Option C · Pre-authored montage clips → VideoTexture

### Shape
`short authored MP4/WebM loops → VideoTexture → billboard`

### Strengths
- strongest art direction;
- very cheap runtime logic;
- After Effects/Blender/ffmpeg/manual editing can create complex montage;
- excellent for a few signature loops.

### Costs
- content production becomes a separate editorial pipeline;
- less responsive to game state;
- “non-repetitive” requires multiple clips/variants;
- provenance must be locked before rendering the video.

### Verdict
**Useful companion mode / premium authored pack, not the reusable core.**

---

## Option D · CSS3D collage / HTML composition

### Strengths
- easy DOM text/layout;
- easy embedding of web/iframe content.

### Costs
- B2a already proved the front/back, z-order and pointer-event complexity of CSS3D;
- poor fit for non-interactive collage;
- introduces another DOM presentation path.

### Verdict
**Do not use for collage. Keep CSS3D reserved for interactive YouTube/web content.**

---

## Option E · full post-processing / shader mockup editor

EffectComposer + mask passes + many controls + editable lighting/reflection UI.

### Verdict
**Reject for B2b.**
It copies the least important part of the reference and creates exactly the complexity Georg said he does not need.

---

# 5 · Recommended B2b content contract

A small data contract is enough:

```js
{
  id: "collage-forget-01",
  seed: 18472,
  recipe: "TORN_3",
  durationSec: 6.5,
  transition: "DISSOLVE",
  grade: "WARM_DIRTY",
  slots: [
    { assetRef: "...", crop: "DETAIL", role: "hero" },
    { assetRef: "...", crop: "COVER", role: "support" },
    { textRef: "...", role: "headline" }
  ]
}
```

Runtime should consume this contract; it should not decide licensing or download random web content.

---

# 6 · Non-repetitive loop without procedural overkill

## Use deterministic variation, not per-frame randomness

KFB already prefers stable seeded geometry/recipes over redraw noise.

Recommended rules:
- seeded PRNG per encounter / billboard instance;
- 4–6 composition recipes only;
- 3–5 visible slots per composition;
- 4–8 s composition lifetime;
- 0.4–1.0 s transition;
- bounded layer drift/pan/scale;
- no-repeat memory:
  - do not reuse the last 4 asset IDs;
  - do not reuse the last 2 recipe IDs;
  - do not repeat the same hero role twice;
- rotate grade presets independently but deterministically;
- reconstruct the sequence from seed for Save/Reload/replay.

This reads varied but remains debuggable.

## Example first recipes
- `TORN_3` — 3 torn image pieces + one word;
- `HEADLINE_SPLIT` — newspaper/headline strip + 2 images;
- `CARD_SHOCK` — KFB detail crop + huge ChatterBox phrase + one external still;
- `POSTER_STACK` — 2 posters + small caption + coarse mask.

Do not start with more than four.

---

# 7 · Color mood / “erratic but coherent” treatment

Do not analyze every source every frame.

Prefer metadata or one-time load analysis:

```js
paletteHint: {
  luma: 0.44,
  warmCool: -0.2,
  dominant: ["#8c312a","#d6b46c","#1b2522"]
}
```

Then choose one grade preset:
- `WARM_DIRTY`;
- `COLD_PRINT`;
- `TEAL_RED`;
- `MONO_PAPER`;
- `ACID_FAIRGROUND`.

The grade controls:
- tint;
- saturation;
- contrast;
- vignette;
- optional one-color ink overlay.

This gives Georg the “Farbstimmung” control without a heavy editor.

---

# 8 · Source-pool strategy · curate, never scrape live

## First pool order

### 1. KFB-owned / already registered material
Use first:
- KFB cards/covers;
- KFB artwork already in `media/`;
- ChatterBox phrases;
- authored poster/type fragments.

This produces a complete POC before any external-source dependency.

### 2. Smithsonian Open Access · preferred external still source
Official:
https://www.si.edu/openaccess/faq

Open Access assets marked **CC0** may be reused/modified, including commercially; Smithsonian recommends keeping source metadata even though attribution is not required.

Good for:
- historical photographs;
- objects;
- illustrations;
- ephemera;
- posters/art.

### 3. Library of Congress · Free to Use and Reuse
Official:
https://www.loc.gov/free-to-use/

The Library publishes curated rights-free sets, typically 25–50 images per set.

Good for:
- historic signs/posters;
- photographs;
- maps;
- illustrations.

### 4. Chronicling America · strong headline/newspaper source
Rights:
https://www.loc.gov/collections/chronicling-america/about-this-collection/rights-and-access/

Technical/API:
https://www.loc.gov/collections/chronicling-america/about-this-collection/technical-information/

Especially useful for:
- newspaper typography;
- historic headlines;
- page fragments;
- old advertisements.

For lowest-risk first ingestion, prefer issues clearly older than 95 years and persist the exact issue/page metadata.

### 5. Europeana · good discovery layer if rights allow-list is strict
Rights model:
https://pro.europeana.eu/page/available-rights-statements

Europeana provides machine-readable rights statements.
B2b should ingest only an explicit allow-list such as:
- Public Domain Mark;
- CC0;
- another license Georg explicitly approves.

Do not treat “found on Europeana” as equivalent to public domain.

### 6. Wikimedia Commons · useful but item-by-item
Reuse guidance:
https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia

Commons contains public-domain and many free-license files, but requirements differ per file.

For automatic/curated KFB ingestion:
- first allow only Public Domain / CC0;
- store exact file page + rights/creator metadata;
- expand to CC BY/CC BY-SA only if attribution/share-alike handling is deliberately implemented.

## Secondary / caution

### NYPL
The API supports `publicDomainOnly=true` and exposes rights statements, but the Repository API terms distinguish metadata rights from content and place conditions on API use.
Useful for manual research, **not my first automated KFB ingestion source**.

### NASA
Much NASA media is generally not subject to U.S. copyright, but logos, endorsement, people and third-party material create additional rules.
Treat as a specialty pool, not a generic “free image” bucket.

### Internet Archive / Prelinger
Do not assume that “hosted at Internet Archive” means public domain.
If used later, admit items only when the individual item has explicit reusable-rights evidence.

---

# 9 · Provenance manifest

External assets should enter the ordinary KFB asset/registry path, not a private billboard-only scraper.

Minimum per external item:

```json
{
  "assetId": "billboard-pd-...",
  "localPath": "media/...",
  "sourceUrl": "...",
  "provider": "Smithsonian",
  "title": "...",
  "creator": "...",
  "date": "...",
  "rights": "CC0",
  "rightsUrl": "...",
  "credit": "...",
  "retrievedAt": "2026-...",
  "sha256": "...",
  "tags": ["poster","history"],
  "paletteHint": { "luma": 0.4, "dominant": ["#..."] }
}
```

Runtime consumes `assetId` / registry facts.
Runtime never decides whether a URL is legally reusable.

---

# 10 · Performance budget for first POC

Target one billboard, not a general video editor.

Suggested initial bounds:
- canvas: **1024×576** or **1280×720**;
- active image layers: **≤5**;
- text layers: **≤3**;
- one CanvasTexture;
- redraw:
  - on composition changes;
  - or **12–15 fps** for slow pan/fade;
  - not necessarily every display frame;
- preloaded external stills: **≤12** in first pool;
- local video layers: **0** in POC-1;
- no EffectComposer;
- no extra WebGLRenderTarget in POC-1;
- dispose replaced ImageBitmap/Texture resources explicitly.

Performance should be measured in the actual B2a billboard host before raising these limits.

---

# 11 · Smallest worthwhile POC after Georg chooses

## B2b-P1 · Collage Surface A+

One additional button/mode:
`COLLAGE`

Content:
- existing KFB card/detail crops;
- 6–12 curated KFB/CC0 stills;
- ChatterBox/type phrases;
- 4 recipes;
- 4 grades.

Runtime:
- existing B2a billboard body;
- one `CanvasTexture`;
- deterministic scheduler;
- no-repeat memory;
- A/B treatment:
  1. `FLAT_COLLAGE`;
  2. `LIVING_SCREEN` (small emissive/reflection/vignette treatment).

Proof:
- same seed reproduces same sequence;
- different seed visibly differs;
- 30–45 s capture contains no immediate repeated hero asset/recipe;
- front/3/4/rear behavior remains identical to accepted B2a;
- switching modes stops collage work;
- source/provenance drawer is diagnostic only, not player UI.

No editor.

---

# 12 · Options summary

| Option | Complexity | Visual ceiling | KFB reuse | Recommendation |
|---|---:|---:|---:|---|
| A · CanvasTexture compositor | Low | Medium-high | Excellent | **Foundation** |
| A+ · Canvas + living surface | Low-medium | High | Excellent | **First POC** |
| B · RenderTarget mini-scene | Medium-high | Very high | Good | Later |
| C · authored VideoTexture loops | Medium content cost / low runtime | Very high | Good | Companion |
| D · CSS3D collage | Medium | Medium | Poor for this job | No |
| E · full mockup editor/post stack | High | High | Low value | Reject |

---

# 13 · Open decisions for Georg

Only these choices matter before implementation:

1. **First POC:** A flat Canvas collage only, or **A+** with one living-screen treatment toggle?
2. **External stills in first POC:** KFB-only first, or include a tiny CC0 pack immediately?
3. **Tone:** one preferred initial recipe family:
   - torn-paper/history;
   - newspaper/headline;
   - carnival/ad;
   - mixed hypernormalisation.
4. Should B2b-P1 be the next implementation slice, or should the prepared B3 rounded 3D body run first/in parallel?

No other architecture decision is needed yet.

## Exactly one next gate

**Georg chooses the B2b-P1 option/tone (or says B3 first).**


## 14 · Human selection · 2026-09-25

The option gate is resolved.

Georg selected:
- **A+ CanvasTexture**
- **KFB + small curated CC0 pool**
- **mixed hypernormalisation**

Therefore B2b-P1 should start from the existing Gate-1 collage donor with the exact bounded build brief:
`B2B_P1_BUILD_BRIEF_2026-09-25.md`

The earlier “Open decisions” section remains historical research context; these three choices supersede it.

B3 rounded body remains separately prepared, not started, unless Georg explicitly starts it in parallel.
