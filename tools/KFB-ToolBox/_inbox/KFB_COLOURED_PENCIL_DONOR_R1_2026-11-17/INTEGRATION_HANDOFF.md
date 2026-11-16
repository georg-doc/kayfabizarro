# Coloured pencil → KFB / Claude Design · source intake R1

Exact original: https://patch.gg/blendi/coloured-pencil
API /repo verified its actual clone URL, public source, MIT code and CC0 art. Source HEAD:0400f90d08ca97aae11edb41e3ff3af830acc8c7. The single central mirror is ~/.codex/mirrors/patch--coloured-pencil.git. It was created with --mirror --filter=blob:none; the server ignored filtering (recorded once). No fallback clone or global install.

## Delivered source and notices

Ten unchanged UTF-8 files /37502bytes are recorded with blob SHA, SHA256 and byte length in SOURCE_LOCK.json. Four source modules form a closed graph: src/pencil.js, page.js, shape.js and noise.js. The minimal pencil-material closure is pencil.js alone. External runtime dependency: host three.js0.186.1 and its BufferGeometryUtils addon. Original LICENSE, LICENCE-NOTES, publicCREDITS and CC0 text remain intact. All paper grain and strokes are made in code; no image/font/model asset is needed by these modules.

Excluded: src/main.js, harbour world, sailor, starter-character assets, input/camera/frame loop and bundled Rapier0.21.0. Original notices mention these because they describe the whole source game; this packet does not ship them. Do not start a second character, world, physics step, renderer or clock. Existing receiving host owners stay authoritative; no receiving physics version is inferred from the donor.

## Exact reusable API

src/pencil.js blob8bea1ef8dd17620ffc74de8177b7d9568e6ebd06:
- field(geometry,a=[.62,1,.34],b=[-.78,1,.22]) mutates geometry to add a vec2 `hatch` attribute. Values are position dot products against normalised a/b, one for each pencil direction.
- fieldBy(geometry,fn): fn(x,y,z,vertexIndex) returns [h1,h2]. Use this for source-sensitive form-following directions.
- hue(geometry,colorOrFn) adds vertex `color`; callback receives position/index/normal.
- createPencil() returns {px,make,line,both,flat}. line is a vertex-coloured MeshLambertMaterial; both is DoubleSide; flat is an even pencil line for ropes/smoke, with depthWrite=false. `px` is a shared uniform.
- createBatch(material) adds geometry then merges. It fills missing normals/hatch/color but DELETES UV and converts indexed geometry to non-indexed. Do not run this over existing textured/anchored KFB assets without an explicit clone/attribute plan.

Practical authoring adapter, not a shader filter: clone a source geometry without modifying its canonical source; prepare hatch once in its rest/object coordinates; preserve normals and intended colour; assign selected pencil material; continue using the existing host renderer and animation. Derivative-based stroke spacing is in whole octaves, fixed to the prepared surface fields rather than camera-position noise. Existing UV-textured art is not automatically preserved by switching to vertex colour. Instancing/skinning/deformation must be checked with the actual receiving mesh type.

The source material owns onBeforeCompile. Existing KFB deformer/clay hooks cannot be replaced silently or blindly layered. Compose shader injections through the current material owner, verify cache keys and normal/depth/shadow behavior, and keep the approved original look selectable. Show actual source pencil output alone before claiming an adapted KFB design.

Screen-space stroke fit follows source main: pencil.px.value = desiredPixelsAt1080 * renderer.getDrawingBufferSize(...).y/1080. Update from the host resize callback, not a second listener/loop owner.

## Paper pass and cloth boundary

Optional page.js uses the supplied renderer, creates one offscreen draw/depth target and a fullscreen paper/graphite stage, and exposes {depth,resize,render}. Its render(scene,camera) performs the scene render then the final pass and changes render target/clear colour. Integrate it into the existing host post chain as the ONE final path; do not render the world once in the host and again independently in this module. Inspect target restoration, viewport, depth, colour/tone mapping and resource lifecycle; source has no explicit dispose hook.

Cloth is separate: `both` only sets a DoubleSide material. It is NOT cloth physics. A moving cloth needs stable rest-space hatch/color attributes carried with the same vertices and its existing cloth/deformer owner. Do not simulate or freeze the floor to mimic cloth. Keep the website's requested cloth/floor seam separately scoped; shared pencil preprocessing can be reused without changing its topology or physics.

## Current receiving intent / done boundary

This is source support for the existing Website R1 / Claude Design owner, not permission to retheme the Racer. Shared per-vertex hatch preparation and selected material swaps are feasible from actual source. Existing cloth/floor, moving colour front, render clock and physics remain their owners. Start with one real static object and one existing animated/deformed object, preserve source identity, and compare source/rest/deformed/shadow views before widening the adaptation.

Checks run: API identity/licence reads; exact central mirrorHEAD; ten text-file blob/SHA/byte locks; four JS syntax checks PASS; zero unresolved relative imports. No GPU shader compile, browser render, performance measurement, Claude Design visual acceptance or receiving integration was performed. Source README's2ms desktop figure is a donor report, not KFB evidence. No GitHub/production write or publication in this intake.
