# BILLBOARD B3 · Rounded Cartoon 3D Body · WSA / Blender MCP Handover

Status: **PREPARED · NOT STARTED · B2B RESEARCH RUNS FIRST**
Date: 2026-09-25
Owner to receive: **WSA / ToolBox 3D authoring**; **Blender MCP** is allowed if real mesh/topology work is the cleanest route.
Current media owner: **KFB ToolBox / Billboard Media Residency**
Source branch: `chatgpt-web/billboard-b2a-css3d-2026-09-24`
Accepted media checkpoint: B2a / PR **#199**

## Intent

Build a more rounded, cartoon 3D billboard body without replacing the accepted billboard/media system.

The current Kenney donor works functionally but its body/support reads too hard-edged and utilitarian. The next body should feel more like a hand-built KFB cartoon prop: rounder silhouette, chunkier/softer frame and supports, slightly imperfect/asymmetric where useful, while still reading instantly as the same billboard.

This is **body/model work only**. It must not become a second media runtime.

## Protected source / contracts

Start from the accepted donor, never a generic replacement:

`media/3D_Assets/kenney_racing-kit/Models/GLTF format/billboard.glb`

Pinned donor commit:
`378b209355b13304e3cff656ec0806ca5b89df28`

Accepted media-face truth:
- measured B0 face: **4.20 × 2.10 world units**;
- content-fit holder scaling from B1 remains valid;
- B2a inline YouTube/CSS3D remains valid;
- final B2a runtime: `89065825448846beb2649082fc0c1bf25df20ccb`;
- rear-side contract: CSS3D media is front-only; the 3D billboard body owns the backside;
- current public reference: https://kayfabizarro.pages.dev/kfb-hub/pruefen/billboard-b2a/.

Do not change:
- card / cover / slogan content owners;
- CSS3D YouTube owner;
- face aspect contract;
- front/rear media semantics;
- KFB card registry/PDF runtime;
- camera/orbit owner.

## Style references already in KFB

Use these as **design-language references**, not as replacement owners:

1. **KFB Elastic / Grotesque / Clay direction**
   - `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs`
   - accepted V2 geometry reference at `0c59e92d9d8688f5a88cd309ae8891dcd174c2fc`.
   - Take the principle: softened/elastic masses, fewer razor-straight seams, readable silhouette.

2. **KFB hand-built cartoon staging direction**
   - skewed/asymmetric physical geometry;
   - strong silhouette;
   - 1990s hand-built cartoon staging is a reference language, not an asset/style copy target.

## WSA decision rule

### Web/Three first only if:
- the accepted Kenney mesh can be made convincingly rounder with a small non-destructive deformation/material pass;
- silhouette and backside remain structurally clean;
- no topology surgery is required.

### Blender MCP preferred if:
- frame corners/posts/support feet need true rounded/chunky topology;
- silhouette needs authored bulges/tapers/asymmetry;
- the backside/casing should become a coherent solid object;
- a reusable GLB should replace ad-hoc runtime deformation.

Blender MCP is therefore **allowed but not mandatory**.

## Required first gate: source-object comparison

Before integration:
1. show the exact accepted Kenney billboard in isolation;
2. show one rounded-cartoon candidate beside it;
3. same camera, same scale, front / 3/4 / side / rear;
4. keep the media face rectangle/anchor measurable and unchanged;
5. no card/video content needed in this first comparison.

A loaded asset URL is not proof. Show the actual source object and candidate visibly.

## Target anatomy

Keep:
- one clear media face;
- one coherent rear casing/body;
- two/support structure if still visually useful;
- stable feet/contact;
- readable side thickness.

Tune:
- round frame corners / softer edge radii;
- slightly chunkier frame;
- softer/chunkier posts/supports;
- less perfectly mechanical joins;
- possibly subtle taper/bulge/asymmetry;
- rear casing should read as one cartoon prop, not a thin plane.

Avoid:
- generic glossy ad-tech kiosk;
- sci-fi chrome;
- inflatable toy look;
- excessive bevel noise;
- replacing the billboard with a new brand/object;
- changing media aspect to make the body easier.

## Integration gate after body acceptance

Only after Georg accepts the isolated body:
- bind the existing B1/B2a measured media face to the new body;
- prove CARD / COVER / VIDEO INLINE / SLOGAN still work;
- prove rear view still hides CSS3D video;
- Save/registry metadata may point to the new authored GLB, but media owners remain unchanged.

## Deliverables

Return:
- exact source and candidate GLB/Blend path;
- Blender MCP or Web method used;
- before/after front / 3/4 / side / rear screenshots;
- measured face dimensions and anchor transform;
- changed files;
- tests/evidence;
- unresolved items;
- one next gate.

Do not merge or promote Live automatically.

## Scheduling note for WSA

This handover is **prepared only**. Georg asked to continue first with **B2b Living Mockup / Collage research/options**. Keep B3 visible in WSA/Production Desk, but do not start modeling until the media-surface research choice is recorded or Georg explicitly starts B3 in parallel.


## Five adjacent KFB billboard ideas · commented drafts

Status for all five: **IDEA BACKLOG · NOT STARTED · NOT REQUIRED FOR B2b-P1 OR B3**.

These are deliberately adjacent ideas that reuse the accepted billboard/media owner rather than creating new apps.

### 1 · PALIMPSEST · Poster archaeology

**Idea**
A billboard remembers what used to be on it. New media does not always replace the old surface perfectly: torn corners, pasted-over fragments, faded words and one or two older images remain as physical residue.

**Why it fits KFB**
The world gains history without exposition. It also turns the mixed-hypernormalisation collage language into something diegetic rather than just “screen graphics”.

**Commented draft**
- current ad: clean hero layer;
- previous 1–2 compositions: cached as low-res stills;
- deterministic tear masks reveal small areas of the older layers;
- location/seed decides where residue persists;
- optional rain/night grade may darken the paper residue, but World remains the mood owner.

**Small proof**
One billboard cycles through three campaigns; after each change, the next frame visibly retains 10–20% of earlier paper/image fragments.

**Boundary**
No asset history database. Keep only a tiny bounded visual ring buffer or authored prior-frame refs.

---

### 2 · BILLBOARD CHORUS · Street-scale call-and-response

**Idea**
Several billboards in one street/scene can behave like a chorus instead of independent random screens.

**Why it fits KFB**
ChatterBox already has short beats/triplets. A city block answering itself is more distinctive than ten unrelated adverts and can create comedy or unease without adding NPC dialogue trees.

**Commented draft**
Board A: `SHOW IT`  
Board B, 400 ms later: `SPIN IT`  
Board C, after the player passes: `SELL IT`

Or one board shows an image while another supplies the contradictory headline.

**Small proof**
Three boards consume one read-only cue:
`{ cueId, beatIndex, phase, seed }`.
They render different presentation roles but never own dialogue/game state.

**Boundary**
Do not create a second ChatterBox or timeline owner. The billboard only consumes a semantic cue bus.

---

### 3 · WORLD MEMORY · Recent-event replay surface

**Idea**
A billboard can briefly show a still from something that actually happened nearby: a Resident encounter, stunt, race moment, card discovery or hero-camera capture.

**Why it fits KFB**
The city appears to watch, remember and reinterpret the player's actions. It also reuses existing hero-camera / Almanac / capture ideas instead of inventing arbitrary stock imagery.

**Commented draft**
- consume an existing capture ref + metadata;
- crop it with the B2b collage recipes;
- combine with a short ChatterBox line;
- expire after a bounded period;
- fall back to ordinary collage if no recent capture exists.

Example:
recent stunt still + `LOCAL MAN DISCOVERS GRAVITY AGAIN`.

**Small proof**
Feed one already-existing capture into `HEADLINE_SHOCK` and compare it to the ordinary KFB+CC0 pool.

**Boundary**
Billboard never creates authoritative game captures or history; it only presents refs supplied by the existing capture/Almanac owner.

---

### 4 · NEIGHBORHOOD DIALECTS · Same content, local visual grammar

**Idea**
The same collage recipe reads differently depending on the world zone: fairground, civic Hürth, dungeon-adjacent, industrial, Academy-controlled, etc.

**Why it fits KFB**
It prevents every billboard from becoming identical branding and gives neighborhoods a visual voice without duplicating content systems.

**Commented draft**
A read-only `zonePresentationHint` may select:
- grade family;
- paper/screen wear;
- type scale;
- transition tempo;
- reflection/emissive strength.

The asset/recipe itself stays the same.

**Small proof**
Render one fixed seed/recipe in three zone hints and verify that composition identity is preserved while surface language changes.

**Boundary**
World/Zone owner supplies the hint. Billboard must not infer or rewrite world state.

---

### 5 · SIGNAL TAKEOVER · Authored interruption / counter-programming

**Idea**
A normal billboard sequence can be interrupted for 2–5 seconds by an authored KFB takeover: FrizzleBob, The Academy, a Resident faction, a card event, or another semantic source.

**Why it fits KFB**
It turns the billboard into a narrative pressure valve without needing a new cutscene system or LLM-generated live ads.

**Commented draft**
Normal collage → hard authored interrupt → one short 3-beat message → exact previous sequence resumes.

Minimal contract:
`{ interruptRef, priority, ttl, returnState }`

Examples:
- Academy warning interrupts a cheerful carnival ad;
- FrizzleBob scribbles one counter-line over an official message;
- Resident Disco temporarily hijacks all nearby displays on the downbeat.

**Small proof**
One deterministic interruption fires during a 30 s collage loop, then returns to the exact prior seed/sequence position.

**Boundary**
No new narrative owner and no free-running runtime LLM. Interruptions are semantic refs supplied by existing systems; billboard only presents them.

---

## Idea-backlog rule

None of these ideas should delay:
1. B2b-P1 mixed-hypernormalisation collage;
2. B3 rounded-cartoon source-object proof.

Promote at most one of them into a future bounded slice after the basic media surface and body are stable.
