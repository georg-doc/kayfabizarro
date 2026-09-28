# Blender MCP Brief · Clay Landmarks and WFC Kit Donors

Status: `READY BRIEF · SOURCE-LOCKED AUTHORING ONLY`  
Owner: WorldBuilder landmark presentation  
Executor: Blender MCP  
Receiving consumers: WorldBuilder, WFC-01 catalog, Racer/Travel where explicitly adopted

## Short answer

Yes: Blender MCP is the right place to model **hero landmarks and reusable geometric kit donors** in the claymation style.

It is not the right place to regenerate OSM, own the procedural world, redesign Track Core, simulate residents, or bake the complete runtime scene into one mesh.

## Highest-value Blender work

### Hero landmarks

Create a small, strongly silhouetted set such as:

- observatory;
- lighthouse;
- bent water tower;
- surreal station/portal;
- bridge or tunnel portal;
- simplified cathedral/civic tower when the receiving zone provides a measured footprint and scale;
- KFB billboard/credit monument;
- special workshop/bank/hub entrance.

Each landmark is manually authored and pre-placed. WFC only respects its buffer and may decorate around it.

### Reusable façade kit

Derive source-proven components from approved KayKit/Kenney donors:

- windows;
- doors;
- shutters;
- arches;
- cornices;
- roof caps;
- chimneys;
- balcony/awning pieces.

Do not merely load a donor URL and wrap it in a new shell. Show the real donor in isolation, record its exact source and then create the adaptation.

The result should support controlled scale, bend and palette variants without losing recognizable construction logic.

### WFC module donors

Blender may author or normalize:

- curb stones and corners;
- sidewalk slabs;
- fence sections and posts;
- ditch/berm profiles;
- lamp bases;
- tree pockets;
- billboard mounts;
- quiet filler masses;
- sockets and clearance helpers.

WFC owns placement rules; Blender owns the geometry and authored sockets.

## Clay design language

Use the accepted K2/Hirnwelt direction:

- readable large masses before surface noise;
- slightly bent silhouettes and asymmetric rooflines;
- recessed windows/doors rather than generic objects pasted on façades;
- rounded but constructed edges;
- visible compression, seams and selected dents;
- no uniform procedural scratches;
- no black generic outline shell;
- no detail smaller than its expected screen importance;
- color separation by palette role, not arbitrary per-object random color.

K2 remains the runtime material/presentation donor. Blender should prioritize silhouette, joins, recesses, sockets and material regions. Do not permanently bake dense K2 microrelief into every mesh.

## Scale and interaction

Before modeling, pin the receiving host's exact unit, up-axis, forward-axis, road elevation and actor reference.

Every landmark must demonstrate:

- actor at door/interaction distance;
- vehicle passing clearance where relevant;
- ground-contact plane;
- readable entrance or interaction face;
- camera-safe near and far silhouettes;
- no spawn inside geometry.

If the source measurements are absent, return `SOURCE_REQUIRED`; do not guess fantasy scale.

## Required asset contract

Deliver per asset:

- editable `.blend`;
- runtime `.glb`;
- source/provenance manifest;
- dimensions and pivot;
- named material regions;
- collision proxy separated from presentation mesh;
- WFC footprint and north/east/south/west sockets where applicable;
- landmark buffer and sightline notes;
- anchor empties for door, interaction, sign/billboard, VFX and optional resident;
- LOD0 / LOD1 / LOD2 or a documented reason why a unique hero asset needs another policy;
- neutral contact-sheet renders from front, side, three-quarter and gameplay distance.

Suggested JSON:

```json
{
  "schema": "kfb.clay-landmark/1",
  "id": "landmark.observatory.a",
  "source": [{"id": "<registry id>", "ref": "<exact commit>"}],
  "dimensionsM": [8.4, 11.2, 7.6],
  "pivot": "ground-center",
  "collision": "proxy",
  "anchors": {
    "door": "ANCHOR_DOOR",
    "interaction": "ANCHOR_INTERACT",
    "billboard": "ANCHOR_MEDIA",
    "vfx": "ANCHOR_VFX"
  },
  "wfc": {
    "footprintCells": [3, 3],
    "bufferCells": 2,
    "generated": false
  }
}
```

## Performance guardrails

- shared materials and palette IDs;
- no unique 3K/4K clay texture per landmark;
- microrelief near only; mid/far use simplified materials;
- repeated façade parts are instancing-ready;
- collision mesh is simple and independent;
- shadow casting may be disabled by LOD;
- avoid deep modifier stacks in exported runtime geometry;
- record triangle counts per LOD, but judge them against visible value rather than an arbitrary universal limit.

## First bounded Blender job

`BL-LM-01 · One landmark + one façade strip`

1. Choose one existing, source-proven landmark donor.
2. Show donor in isolation.
3. Create one clay adaptation with measured entrance and interaction anchor.
4. Create one three-building façade strip using reusable window/door pieces.
5. Export LODs, collision, sockets and manifest.
6. Test the GLBs in the real WorldBuilder at walk, drive and flight distances.

Done when the landmark is recognizable at distance, usable at actor scale, does not obstruct the road/camera, and the façade pieces can be consumed by WFC-01 without becoming a second world generator.

## Protected boundaries

Do not:

- modify Track Core geometry;
- bake roads into the landmark;
- create a replacement WorldBuilder;
- invent a new clay shader;
- create a second façade/runtime owner;
- add residents, driving, combat or gameplay scripts inside Blender;
- use the watermarked street-style sample as a texture or modeled trace.
