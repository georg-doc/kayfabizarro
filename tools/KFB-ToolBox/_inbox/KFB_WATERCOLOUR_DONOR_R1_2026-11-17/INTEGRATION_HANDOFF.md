# Watercolour → KFB / Claude Design · source intake R1

Exact original: https://patch.gg/blendi/watercolour
API /repo verified actual clone URL, open source, MIT code and CC0 art. Current HEAD:713908667b250c35598a737503e68b72cb9a2192. One central mirror ~/.codex/mirrors/patch--watercolour.git was created with --mirror --filter=blob:none; the server ignored filtering (recorded once), no fallback clone/global install.

## Delivered source and notices

Eleven unchanged UTF-8 files /75372bytes, with blob SHA/SHA256/bytes in SOURCE_LOCK. Closed shading modules: src/wash.js and pencil.js. Optional paper pass: page.js. Optional shape helpers: shape.js→noise.js. Host external dependency is three.js0.186.1 plus BufferGeometryUtils. Preserve original LICENSE, LICENCE-NOTES, publicCREDITS and CC0 text. Noise/paper/pigment are code generated; no image/font/model binary is needed.

Excluded: glade world, hooded character, player/input/camera/loop, starter-character binary assets and bundled Rapier0.21.0. Do not mount a second world/renderer/clock/physics engine. Existing receiving host world and physics owners remain authoritative; the donor's physics version is not the host version.

Source pencil.js is byte-identical to Coloured Pencil (blob8bea1ef8dd17620ffc74de8177b7d9568e6ebd06). shape.js/noise.js are also shared exact blobs. Keep these source locks; a receiving adapter may share their common implementation rather than duplicate active owners.

## Exact paint API

wash.js blob135f864ed4dcfe79f697daf8079c58d2ad969573 imports PENCIL,field,hue from pencil.js.
createWash({x0=-46,z0=-50,size=92,cells=256,reach=14,speed=11}) returns:
- uniforms (uNow, uMap, uRect, uFinale, haze) and px;
- paint.touch(x,z,now,reach,speed): earlier arrival times win in a Float32 DataTexture;
- paint.at(x,z), flood(x,z,now,seconds=7,span=60), done(now), all(when=-100), none(), sync(), NEVER;
- materials solid,both,always,alwaysBoth,water,dab,dabDepth,hill,beam.
The map records when paint arrived, not just a current radius. `sync()` uploads dirty data; host advances uniforms.uNow.value using its existing timebase. all/none change persistent arrival-map state, not a new world save owner.

createBatch(material).add(geometry,colour,a,b,root) provides `hatch`, vertex `color`, and vec4 `root=[x,y,z,secondsPerMetre]` per vertex. Null root uses that vertex's own position and zero delay. A tree normally shares the foot as root, making colour climb. It DELETES UV and merges/bakes geometry: do not apply it blindly to existing source models. Original root/world assumptions rely on their demo's prepared geometry; transformed or instanced KFB meshes need explicit root-coordinate/instanceMatrix verification before adoption.

createDabs(material,depth) builds instanced brush touches via add(x,y,z,{w,h,turn,seed,kind,colour,normal,at,line,sway}). Attributes are offset/normal/color/dabS/dabB/root; it sets customDepthMaterial for matching shadows. This is optional brush geometry, not required to use the solid wash. Source glade constructs hundreds of thousands of touches and handwritten tree arrangements; it is not a ready cheap replacement for accepted Fernwald.

## Existing website colour-front owner wins

The original effect is paced for a walking character: default92m area, reach14m, speed11m/s, persistent touch history and root delays. Do not bolt its player tick onto a driving or website clock. Keep the already planned moving colour front / threshold owner. A receiving adapter can feed existing front events and the common host time to paint.touch/flood, or reuse only pigment/edge shader functions while the current front supplies arrival age. Pick ONE authoritative front/arrival state. Preserve geometry contact, object identity and existing save/reload policy. Do not replace the website's moving front with a hidden second walking-character radius.

Materials are MeshLambertMaterial hooks, with source onBeforeCompile replacing opaque output. Preserve/compose existing KFB material/deformer injection deliberately; verify actual normals, instancing/skinning, depth, tone mapping and shadow variants. DataTexture float filtering and shader directional-light assumptions require an actual host browser check. Source exposes no complete disposal adapter; host must own generated material/texture/target lifecycle.

Optional page.js is the supplied-renderer depth-aware wet-paper pass: render(scene,camera) draws scene into its target then a fullscreen pass, so integrate as ONE host final-render path. It differs from the pencil page and outputs wet/line information using alpha. Do not use both competing final passes or add another renderer. It has a wet uniform; `?wet=0` in the source demo is only a demonstration switch, not a new host URL contract.

## Claude Design next proof / limits

Current use is source support for Website R1, not Racer retheming. Start with a single real existing solid object and existing colour-front event; show dry pencil, wet edge and fully painted states. For trees, retain accepted Fernwald/Lowpoly ownership and first measure one bounded brush adaptation rather than importing the entire glade. Cloth/floor remains its own seam. Keep all source identity, presets and exact material/data provenance visible.

Actual checks: API identity/license/notices; exact mirrorHEAD; eleven text-file SHA/blob/byte locks; five JS syntax checks PASS; relative import closure has zero missing. No shader/GPU/browser run, look acceptance, frame-time benchmark or receiving integration was done. README's650000touches/4–6ms/4.5s-world-build are source claims, not this intake's measurements. No GitHub/production writes/publication.
