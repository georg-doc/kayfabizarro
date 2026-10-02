# GOLDEN DEFORMATION DONOR EXTRACTION · 2026-10-02

Status: **SOURCE-BACKED EXTRACTION COMPLETE · NO NEW STYLE INVENTED**
Owner: KFB WorldBuilder / World Corridor 01
Repo: `georg-doc/kayfabizarro`
Branch: `chatgpt-web/wc1-procedural-props-local-proof-2026-10-01`
Draft PR: #313

## Purpose

This sheet is the source-backed design basis for future procedural KFB environment/building work.

It does **not** define a new freehand style.

It extracts what already worked from real KFB sources and separates:
- source-proven mechanics;
- human/prod status;
- transferable traits;
- explicit non-transferable parts.

Style grading axis:
- **Polly & Her Pals** = designed graphic/perspective distortion;
- **Rocko's Modern Life** = everyday wonky cartoon-world personality;
- **Fritz Lang / Metropolis** = urban hierarchy / monumental massing.

The style-axis ratings below are **design interpretation**, not claims that the source literally copied those works.

---

## Donor matrix

| Donor | Exact source | Proven status | Source-proven geometry/deformation | Polly | Rocko | Metropolis | Carry forward | Do not carry forward |
|---|---|---|---|---|---|---|---|---|
| **Elastic Grotesque Clay V2 · ordinary OSM building** | `tools/osm-city-lab/experiments/elastic-grotesque-clay-huerth01/elastic-grotesque-clay.mjs@0c59e92d9d8688f5a88cd309ae8891dcd174c2fc` · blob `75c3d794b9341a7074038594b467f91d153486c6` | current proven WorldBuilder building geometry basis | rounded footprint; ≥8 vertical rings; coherent block warp + smaller local warp; lean; bend; height slope; belly; taper; twist; contextual block-pull; roof rebuilt from deformed top ring; details follow shell | **strong** | **strong** | medium | rounded footprint + elastic body + contextual/coherent neighborhood warp + shared roof/detail field | donor default numbers as universal KFB constants; material/lighting from old viewer |
| **City Cartoon/Grotesque · OSM massing** | `tools/osm-city-lab/src/style/cartoon-city.js` blob `d08c19fc45d98546b7ef2803f2ddbcb73b7f6782` + `styles/kfb-city-v0.json` blob `f129cca3041b55b84de26048dad7aef8fac8b292` | established city presentation grammar; exact final visual calibration not universal | object-height normalized bend + lean + taper + twist; deterministic identity seed; optional vertical stack offsets; anchored base; undeformed collision/export truth preserved | **very strong** | **strong** | medium/strong on tall masses | deliberately skewed silhouette; stable family variation; stacked offsets as controlled graphic breakup | applying the historical Grotesque preset wholesale to every object |
| **Cartoon-Verbieger · Zone Props** | `travel/wip/travel_globe_wsa/kfb-cartoon-deform.js` blob `22d1d537915ad7e552dbfa942ac3dd8c291886f2` | reusable older KFB deformation donor | bend, lean, taper, twist, optional volume-preserving squash/stretch; object-normalized; base anchored; deterministic per-instance seed; one shared bounding frame for multi-mesh prop; low-segment fallback to tilt+taper | strong | **very strong** | low | one coherent deform frame for tree/prop assemblies; per-instance variation within bounded family limits; segment-aware fallback | treating every mesh part independently; “rubber” over-deformation |
| **LandmarkElastic · Cologne Cathedral** | `tools/KFB-ToolBox/_inbox/KFB WB-D1 · Cologne World Shell/SESSION_2026-09-24_WB-D1/code/wd1-landmark.js` blob `fbb768840fd29948de78fe178e78184105e11b15` | real Cologne landmark candidate; stronger deformation logic worth retaining; design not final | body: Elastic Clay belly/taper/twist; towers: stronger City Grotesque deform; Y-tessellation before bend; two towers splay/twist with opposite signs; source identity preserved | **very strong** | medium | **very strong** | role-separated deformation: quiet body / expressive tower; landmark + neighbors share same deformation language; tessellate before bend | generic replacement landmark; one universal tower angle |
| **LandmarkElastic · Köln Hbf** | same `wd1-landmark.js` blob `fbb768...` | source-fitted landmark candidate | authored hall fitted to OSM roof envelope; body deformation only: belly 0.025, taper 0.02, twist 0.5°; 24 m barrel height retained; plinth removed after fit | medium | medium | **strong** | long-body rule: small normalized factor can produce large absolute character; preserve source envelope/identity | using cathedral-strength deformation on long horizontal structures |
| **LOOK-TORSION architecture** | `skills/chat/PRODUCTIVE_REVIEW_GATE_POLICY.md` blob `d744a3a340819adfeaefe26653e72a1cae77aa70` + shared façade router | **ARCHITECTURE PASS ONLY** · 45/45 engineering/browser checks in recorded workflow | cumulative height-dependent torsion; anchored base; shared roof/body final deformation field; role/height-dependent magnitude family | strong | medium | **strong** | torsion as cumulative architectural structure, not a one-shot rotation; roof/body coherence; role-aware strength | proxy materials, lighting, shadows, or any universal final torsion angle |
| **FACADE_RULE v1 · ordinary OSM façade** | World Integration r2 `wd1-city.js` blob `c11b6f7156eaee808fe4689ee406f9b3480b6f0b` | global presenter rule in World Integration r2 | semantic edge eligibility; party walls blank; floors from height; per-building spacing; row shift; u/t jitter; skip gaps; street-facing door; long street façades can gain extra doors; deterministic shape family `rect/arch/trap-up/trap-down`; detail vertices follow shell | strong | **very strong** | low/medium | irregular but readable façade rhythm; semantic context before random decoration; gaps and row shifts; road-facing logic | perfect window grids; decorative random stamping detached from geography |
| **P0B soft procedural tree** | `procedural-props-p0/procedural-props-p0b.mjs@94443824...` blob `0174e27c2ada67753f5e29161e4973087cf04d8e` | **HUMAN PROCEED**; trees explicitly positive | flared lathe trunk with root lobes; overlapping smooth sphere/blob crown; deterministic placement; per-instance rotation/scale/color variation; family instancing | low/medium | **strong** | low | soft rounded family construction; simple procedural parts assembled into characterful silhouette; deterministic scalable siblings | treating this reduced proof as the building deformer |
| **P0B rounded pebble cluster** | same P0B source | source-isolation PASS; visually promising but less explicitly praised than trees | two smooth squashed spheres, offset cluster; deterministic family instancing | low | strong | low | rounded multi-blob rock grammar; offset cluster instead of faceted “game rock” | faceted low-poly rock language |
| **Knetstrang T3 world props** | `tools/KFB-ToolBox/_inbox/KFB Knet-Strecke T3 - TUNE/KFB_TRACK_LOOK_S4_T3_KNETSTRANG_2026-09-27/lab-track/track-look.v3.js` + `DESIGN_SPEC_T3.md` | Georg: “endlich ein Design … sehr coole und ausbaufähige Basis” for the T3 direction | world used crooked-trunk tree + nested ball crown; 2–3 blob bushes; single squashed/rotated blob rock; repeated “Rule of Three” grouping around trees | medium | **very strong** | low | grouped nature composition; tree + bushes + rock as a readable cluster; cartoon anatomy over realism | copying T3 material/look wholesale; assuming its simple rock is final |
| **KayKit Forest family corpus** | `tools/world_atlas/source/scenes/forest-clearing.js` + KayKit Forest assets; Room Study records 20 trees / 22 bushes / 43 rocks | source-backed authored family vocabulary | real family scale bands and many authored A…R-like siblings; small/medium/large rock bands; bush/grass density bands | low | strong | low | proportion/source-identity donor and variation corpus; compare generated siblings against actual cartoon-kit readability | replacing source identity with generic generated boxes |

---

# Detailed extraction

## A · Elastic Grotesque Clay V2

### Exact mechanics
`elasticParams()` is not independent random wobble.

It combines:
- a coherent block field;
- small local per-building deviations;
- footprint-derived roundness;
- a contextual pull toward an anchor;
- deterministic identity seed.

Current source defaults are evidence, not a new universal prescription:
- localLean default `.018`;
- localBend default `.018`;
- localSlope default `.009`;
- belly default `.105`;
- taper default `.070`;
- twistDeg default `4.2`;
- blockPull default `.024`;
- roundness default `.15`, clamped to a source-derived radius.

`buildElasticShell()` rounds the OSM footprint and uses at least eight vertical steps.

`buildElasticRoof()` starts from the already deformed top ring; gable/hip/flat roof logic therefore inherits the body deformation rather than floating above it.

`protectedDetails()` runs door/window placement through `deformElasticXZ/Y`.

### Why this survives
This is the strongest existing answer to:
**“How can a normal real building become KFB-cartoon without losing its geographic/source identity?”**

### Style-axis reading
- **Polly:** coherent spatial distortion and non-orthogonal massing.
- **Rocko:** an ordinary building becomes a character without becoming a new object.
- **Metropolis:** useful as the base fabric beneath stronger hero/tower hierarchy.

---

## B · City Grotesque / Cartoon-Verbieger

Historical `grotesque` preset evidence:
- `verticalSteps: 8`
- `bend: 0.105`
- `lean: 0.09`
- `taper: 0.22`
- `twistDeg: 11`
- `stackSteps: 7`
- `stackShift: 0.065`

These are a **proven envelope**, not an instruction to apply those exact numbers to every future house.

The older shared Cartoon-Verbieger adds two important invariants:
1. deformation is object-normalized;
2. a multi-part prop uses one shared bounding/deformation frame.

It also contains a useful honesty rule:
fewer than four meaningful Y-rings should fall back to lean/taper rather than pretending to curve smoothly.

### Skewed perspective layer
The documented City Grotesque view also used:
- 76° FOV;
- filmOffset 10.5;
- mildly tilted up-vector;
- low-oblique camera.

Therefore the “skewed perspective” target must remain two-layered:
**geometry + lens/presentation**.

---

## C · LandmarkElastic · Cologne

### Cathedral
The recovered implementation deliberately keeps role separation:
- body: restrained belly/taper/twist;
- towers: stronger City Grotesque bend/lean/twist;
- tower signs are mirrored so the pair splays rather than drifting together.

Recorded Cologne World Shell result:
- tower bend/torsion review used `bend 1.0 × grotesque` and `torsion 1.2 × grotesque`;
- tip offset reported as **14.7 m on a 157 m tower**;
- nave/body remained comparatively restrained.

That is a **Golden principle**, not a universal amount:
> hero subparts can carry stronger deformation than the whole source object.

### Hauptbahnhof
The Hbf proves the opposite case:
a very long horizontal hero mass needs smaller normalized factors.
Recovered source:
- belly `.025`;
- taper `.02`;
- twist `0.5°`;
- 24 m barrel height retained while x/z fit follows OSM roof envelope.

This gives the future generator a role-dependent magnitude precedent.

---

## D · LOOK-TORSION

The only accepted conclusion is architectural:

**retain**
- cumulative height-dependent torsion;
- anchored base;
- shared roof/body final deformation;
- role/height-dependent magnitude.

**do not retain**
- a universal angle;
- proxy-page light/shadow/material;
- the isolated grey review as final style.

For future procedural buildings this means:
torsion is a structural field over height, not `mesh.rotation.y += random`.

---

## E · FACADE_RULE v1

The façade is already much more specific than “irregular windows”.

Source behavior:
- edges shorter than `2.4 m` are skipped;
- party walls are detected through neighboring footprint probes and remain blank;
- floor rhythm starts from `floorH 3.0 m`;
- spacing comes from `2.6–3.8 m`;
- `skip 0.13`;
- `rowShift 0.1`;
- `jitterU 0.2`;
- `jitterT 0.05`;
- street-facing context selects doors;
- long street facades may add doors every `15 m`;
- base detail family is deterministic per building;
- detail shapes already include `rect / arch / trap-up / trap-down`.

Again: values are current rule evidence, not automatically the final procedural-city values.

### Transfer principle
The correct anti-generic façade idea already exists:
**semantic irregularity, not decorative randomness.**

---

## F · P0B tree / pebble · new accepted procedural-family method

### Tree
Current generated tree uses:
- lathed trunk;
- widened root lobes near ground;
- tapered upper trunk;
- four overlapping smooth blob crowns;
- vertically baked underside shading;
- deterministic per-instance yaw;
- ~±14% uniform scale variation plus small independent Y variation;
- small palette variation.

Human result:
**continue the procedural props/tree direction; trees specifically look very cool.**

### Pebble
Current P0B pebble cluster:
- one broad squashed smooth sphere;
- one smaller offset smooth sphere;
- no faceted low-poly rock silhouette.

### Transfer principle
The best new procedural lesson is:
**simple rounded subforms + asymmetric overlap + deterministic family variation**.

This is the correct source for new rocks/bushes, but not the building deformation authority.

---

# What is now ruled out

The following may **not** become the next Claude brief by themselves:

- “make wonky cartoon houses”;
- a freehand list of random footprint/roof/window patterns;
- P0B tree deformation copied directly onto buildings;
- a generic 1990s Nickelodeon prompt;
- a generic cozy-game prompt;
- one fixed Grotesque preset applied to every building;
- a neighborhood generator invented before individual family grammar is source-proven.

---

# Source-backed next family candidates

The repo already gives us a non-invented path for the next environment props:

## Rocks
Existing donors:
1. P0B two-blob rounded pebble cluster;
2. T3 Knetstrang squashed/rotated blob rock;
3. K1 clay catalogue organic `IcosahedronGeometry` rock with analytic surface perturbation;
4. KayKit Forest: 43 authored rock variants / small-medium-large family bands.

## Bushes
Existing donors:
1. T3 Knetstrang: 2–3 offset squashed blobs;
2. P0B tree crown: overlapping soft-blob construction method;
3. KayKit Forest: 22 authored bushes as cartoon proportion/variation corpus.

## Trees
Existing donors:
1. P0B: human-positive soft lathe-trunk + blob-crown family;
2. T3: crooked trunk + nested-ball crown;
3. KayKit Forest: 20 authored tree variants;
4. Cartoon-Verbieger: one shared deformation frame for trunk+crown and per-instance seeded variation.

Nothing requires a new generic nature grammar.

---

# Result

The procedural environment direction can now be grounded in a real lineage:

**Buildings**
`Elastic Grotesque → City Grotesque → LandmarkElastic → LOOK-TORSION → FACADE_RULE`

**Props**
`Cartoon-Verbieger → T3 nature groups → P0B soft family method → KayKit family corpus`

**Judgement**
`Polly × Rocko × Metropolis`

**Softening constraint**
`Hivebound: cozy / cute / relaxing / smooth stylized 3D / soft rounded cushion forms / not low-poly`

---

# Exactly one next gate

**ENVIRONMENT FAMILY P1 · ROCKS + BUSHES · SOURCE-DERIVED SPEC**

Before Claude Design:
- build a compact family grammar for rocks and bushes using only the four rock donors / three bush donors above;
- preserve the P0B tree as the positive control;
- no material decision in this gate;
- no building implementation yet.

Once Rocks + Bushes are source-derived, the same extraction method can be applied to the first building family without inventing a new visual language.
