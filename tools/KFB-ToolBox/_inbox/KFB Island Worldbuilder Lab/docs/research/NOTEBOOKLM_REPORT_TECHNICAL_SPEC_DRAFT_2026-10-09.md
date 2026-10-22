# **Technical Specification: KFB 3D Environment Construction, Shader Transitions, Grounding, and Spatial Scaling Standard**

## **1\. System Scope & Architectural Foundations**

### **1.1 Strategic Importance & Engineering Gates**

In browser-based 3D environment construction, decentralized rendering pipelines often suffer from structural world-model failures, aesthetic fragmentation, and spatial scaling drift. This technical specification establishes binding engineering gates and quantitative constraints within the Kayfabizarro (KFB) rendering runtime (three.js r186 orchestrated via Vite). By embedding rigorous structural verification directly into the compilation and build loops, the framework eliminates arbitrary geometric cuts, floating props, and scale mismatches. Strict programmatic enforcement guarantees that every environmental asset, terrain topology, and material transition reinforces narrative integrity and maintains visual coherence across multi-developer sessions.

### **1.2 Core Operational Governing Principles**

All scene composition, geometry construction, and shader logic within the KFB WebGL engine are anchored by two non-negotiable operational principles:

| Operating Principle | Core Mechanism | Technical Enforcement & Validation |
| :---- | :---- | :---- |
| **Principle §00: "Weltlogik zuerst"**\<br\>*(World Logic First)* | Every environment asset must possess an explicit, single-sentence narrative justification (*Who built/grew it, with what, why, and what story does it convey?*) prior to geometry creation or placement. | Mandated within the pre-compilation *Biom-Blatt* (Biome Sheet) and *Bauweise-Blatt* (Construction Sheet). If an asset's historical or physical cause cannot be documented, generation or instantiation is strictly prohibited. |
| **Principle §01: "Keine harten Schnitte"**\<br\>*(No Hard Cuts)* | Surface transitions, structural edge terminations, and material boundaries must be organically modeled following stop-motion claymation physics. | Linear gradients, alpha-blended transparency cuts, hard polygon edges, noise-sprayed dithering, and artificial dark ambient occlusion contact rings are strictly forbidden. Built ends must utilize rounded clay caps (*Abschlussstücke*) with contextual rubble (*Rubbel*); free ends must express erosion via stepped retreating tiles or procedural clay blotches. |

### **1.3 Single Source of Truth (SSOT), Technical Stack, and Performance Budgets**

The KFB architecture maintains a strict Single Source of Truth (SSOT) pattern. The canonical repository located at `georg-doc/kayfabizarro` on GitHub, synchronized with the local KFB Island Worldbuilder Lab environment, serves as the authoritative state for all world metrics, shader algorithms, and asset registries.

\[GitHub SSOT Hub: georg-doc/kayfabizarro\]  
                    │  
                    ▼  
   \[KFB Island Worldbuilder Lab Runtime\]  
   ├── Core Engine: three.js r186 \+ Vite Server  
   ├── Spatial Triangulation: cdt2d (Constrained Delaunay)  
   ├── Body Volumetrics: SDF Fields \+ Marching Cubes (96³)  
   ├── Data Contract: schema 'kfb.road-bed/1'  
   └── Performance Target: Baseline MacBook (30–60 FPS)

* **Core Engine & Tooling:** three.js r186 running on standard WebGL2 contexts, structured via ES modules and served via Vite. Local editing and programmatic inspection are driven by the KFB Island Worldbuilder Lab, incorporating `three-inspect` and Headless Chrome rendering suites.  
* **Spatial Triangulation & Volumetrics:** Surface terrain mesh generation utilizes `cdt2d` (Constrained Delaunay Triangulation) to enforce hard constraint edges along road network seams. Island undersides (*Scholle v7*) utilize Signed Distance Fields (SDF) combined with Marching Cubes resolution grids (96^3).  
* **Road-to-Terrain Interface Contract (`schema: 'kfb.road-bed/1'`):** The interface between the Track Core road compiler and the island terrain generator is governed by a canonical JSON payload structure containing:  
  * `outlineHash`: FNV-1a 32-bit hash verifying island boundary integrity.  
  * `sections`: Station-by-station cross-sectional support vectors (L/R).  
  * `seam`: Left/right lateral boundary falloff and transition metadata.  
  * `mask`: Explicit terrain void polygons defining road surface footprints.  
  * `clear`: Foliage and prop exclusion polygons (`field.isClear`).  
  * `anchors`: Structural attachment nodes for island paths, bridges, and portals.  
  * `rim`: Bridge root abutment geometry embedded into island edge contours.  
* **GPU Instancing & Instance Data Textures:** Nature assets and environmental props utilize `BatchedMesh` or `InstancedMesh`. Per-instance metadata—including Group ID, Phase offset (\\phi), Bending Stiffness (k\_{\\text{bend}}), and Palette-Slot ID—are stored in a floating-point `DataTexture`. The vertex shader samples this texture per instance to calculate real-time wind deformation, vertex squash-and-stretch, and audio-visualizer reactive animation without CPU-side buffer rewrites.  
* **Asset Performance Budgets:** To guarantee stable 30–60 FPS execution on the baseline hardware target (standard Apple MacBook), strict rendering limits are enforced per pass across all combined floating islands:  
  * **Draw Call Budget:** \\le 16 Draw Calls per pass for all batched nature assets (`BatchedMesh` or `InstancedMesh`). Total scene draw calls must remain \\le 120 per frame.  
  * **Polygon Budget:** \\le 120\\text{k} triangles per pass dedicated to nature assets. Overall scene geometry must not exceed 261\\text{k} triangles per frame.

Having defined the architectural scope and hardware performance parameters, the technical specification moves to the formal K2 Spatial Scale Contract governing all physical dimensions in the KFB environment.

## **2\. Spatial Scaling Contract (K2 Framework)**

### **2.1 Non-Metric Character-Relative Scaling Philosophy**

To preserve proportion and stop-motion toy aesthetic consistency, the KFB engine abandons metric units (such as meters). Standard metric assumptions in source comments are invalid and trigger spatial failures. World construction is governed by the character-relative **K2 Spatial Scale Contract**, wherein every architectural structure, vehicle, road profile, and terrain element scales relative to the standard Medium character figure height (H) or the standardized architectural MacroCell (MC). Characters and character animations are never scaled; geometry scales to fit the character.

### **2.2 Mathematical Unit Conversion Chain**

All spatial transformations convert raw asset source vectors into Lab Units through a standardized conversion pipeline:

\\text{Asset Units} \\longrightarrow \\times \\text{Kit-Factor} \\longrightarrow \\text{KayKit Units } (k) \\longrightarrow \\times 1.6 \\text{ (\\texttt{FIG\\\_SCALE})} \\longrightarrow \\text{Lab Units}

The global scale factor (\\text{\\texttt{FIG\\\_SCALE}} \= 1.6) represents the precise multiplier mapping internal KayKit units (k) directly to WebGL Lab Units.

| Reference Entity | KayKit Units (k) | Lab Units | Relative Height (H) | Metric Mapping Description |
| :---- | :---- | :---- | :---- | :---- |
| **Medium Figure** *(Mummy B / Farmer A)* | 2.27–2.41\\ k | 3.64–3.85 | 1.0\\ H | Core baseline measurement reference (1.0\\ H \\equiv 3.64\\text{ Lab Units}). |
| **Large Figure** *(Demon Lord)* | 4.60\\ k | 7.40 | 2.0\\ H | Scaled entity class; rig dimensions measured individually. |
| **MacroCell (MC)** | 4.00\\ k | 6.40 | 1.76\\ H | Fundamental spatial voxel: 1 Dungeon Module \= 1 Wall Bay \= 1 Story. |
| **Standard Doorway Arc** | \\approx 2.75\\ k | \\approx 4.40 | 1.20\\ H | Architectural baseline reference clearance. |
| **Modular Doorway** *(Tiny Treats)* | 2.80\\ k | 4.50 | 1.23\\ H | Native modular asset match (1.6\\times kit factor). |

  \+--------------------------------------------------------+  
   |                       MACROCELL                        |  
   |              6.40 Lab Units (1.76 H / 4.0 k)           |  
   |                                                        |  
   |   \+------------------------------------------------+   |  
   |   |                 STANDARD DOOR                  |   |  
   |   |          4.40 Lab Units (1.20 H / 2.75 k)       |   |  
   |   |                                                |   |  
   |   |   \+----------------------------------------+   |   |  
   |   |   |             MEDIUM FIGURE              |   |   |  
   |   |   |          3.64 Lab Units (1.00 H)       |   |   |  
   |   |   |                                        |   |   |  
   |   |   \+----------------------------------------+   |   |  
   \+---+------------------------------------------------+---+

### **2.3 Architectural, Asset, and Road Network Metric Constraints**

All geometric modules imported or constructed within the engine must conform to the following precise dimensional boundaries re-expressed in K2 Lab Units:

* **The Door Rule:** Standard doorways must maintain a vertical clearance height between 1.15\\ H and 1.20\\ H (\\approx 4.20 to 4.40 Lab Units).  
* **Building Scaling Standard:** Buildings are scaled strictly according to the Door Rule. Background asset sets (e.g., KayKit City, Medieval Hex, Snow Biome) must be upscaled (typically 1.35\\times to 3.80\\times relative to their raw mini-set scales) until their primary entrance satisfies the Door Rule. Floating island surfaces automatically expand in diameter to support these scaled building footprints.  
* **Vehicle Scaling Rules:** World cars are normalized to a static length of 6.00 Lab Units (1.65\\ H), with roof heights constrained between 0.75\\ H and 0.90\\ H. If character seating within open-top vehicles is explicitly authorized, vehicle height scales up by a factor of 1.30\\times (roof height \\approx 1.10\\ H).  
* **Road Network Profiles:** Standard vehicular lanes maintain widths of 3.75, 4.00, or 4.50 Lab Units. Pedestrian sidewalks require a minimum width of \\ge 1.30\\ H (\\approx 4.80 Lab Units). Curb heights are standardized to \\approx 0.10\\ H (0.35 Lab Units), and protective side walls/guardrails require heights of \\approx 0.35\\ H (1.30 Lab Units). Overhead clearances for bridges and portals must equal or exceed \\ge 1.60\\ H (5.80 Lab Units).  
* **Island Race Loop Multiplier (`RACE_W`):** Track Core island race profiles must apply a uniform width multiplier of `RACE_W` \= 1.46 to accommodate high-speed vehicular mechanics without spatial clipping.

Having established the quantitative spatial scaling contract, the specification details the physical rules governing object embedding through the Etherington Grounding and Placement Grammar.

## **3\. Etherington Grounding & Placement Grammar**

### **3.1 Context & Physical Embedding Principles**

To eliminate visual artifacts such as floating geometry, paste-on props, and unnatural contact edges, asset placement follows quantitative physical embedding rules adapted from the Etherington grounding principles. Assets are never dropped onto topographically flat planes or allowed to float above terrain vertices (\\text{foot elevation} \\le 0).

### **3.2 Core Grounding Mechanics & Expressly Forbidden Approaches**

Physical grounding is achieved using three distinct, coexisting mechanics:

1. **Eingraben (Sinking/Digging):** Sinking the structural base of the mesh below the terrain heightfield so that the ground physically intercepts the asset boundary.  
2. **Kontakt (Contact Physics):** Contextual physical blending via real-time cast/ambient shadows coupled with procedural vertex weight mapping (`aTW`) that draws terrain colors onto the object's base.  
3. **Überlappen (Overlapping):** Placing small, contextually justified micro-props (e.g., gravel, clay crumbs, grass tufts) around the object's base to break up rigid geometric intersection lines.

**Forbidden Grounding Approaches:**

* Floating assets (\\text{foot elevation} \> 0).  
* Dark ambient occlusion shadow discs, artificial painted contact rings (*Kontaktverläufe*), or dark painted circles under bases.  
* Arbitrary, contextless flower rings (*Blümchenringe*) placed around rock or trunk perimeters.

### **3.3 Quantitative Object-Type Placement Matrix**

The structural embedding parameters for all asset categories are strictly mandated in the following matrix:

| Asset Category | Sinking Depth (*Einsinken*) | Base Terrain Deformation (*Boden am Fuß*) | Surrounding Overlap Rules (*Überlappen*) |
| :---- | :---- | :---- | :---- |
| **Large Rocks / Findlinge** | 25\\% to 45\\% of total mesh height | Uphill terrain wedging (*Erdkeil*, soil dam) and downhill scree slope (*Halde*). | Abraded fragments downhill; windward grass tufts; overlapping fragment size \\le 12\\% of main rock height. |
| **Mesa / Rock Groups** | 20\\% to 35\\% of height | Seated on a unified elevation mound. | Surrounding rock fragments arranged in strictly decreasing dimensional size. |
| **Trees** | 5\\% to 10\\% of trunk height | Root flare (*Wurzelanlauf*) with root mound radius equal to 1.3\\times–1.6\\times trunk radius; darker soil under canopy via shader weights. | Grass on shadow side under drip line; fallen fruit/Fluff rolling downhill into terrain depressions. |
| **Bushes** | 5\\% to 12\\% of total height | Branches touch ground level; darker moist soil applied via procedural shader weights beneath canopy. | Grass tufts extending outward from underneath lower branch margins. |
| **Grass Tufts** | 100\\% of base embedded | Standard terrain alignment; no localized elevation deformation required. | Grouped strictly in clusters of 3 to 7 units with staggered height variations. |
| **Buildings** | Visible plinth/sockel 0.05\\ H to 0.15\\ H high | Ground flattened smooth underneath building footprint plane. | Footpaths, worn dirt, and entrance wear patterns applied via procedural sprenkel shader weights. |
| **Props** *(Crates, Barrels)* | 2\\% to 5\\% of total height | Un-depressed terrain surface; no localized terrain elevation changes. | Clustered in functional, narrative-driven groups (e.g., market, workshop). |

### **3.4 Compositional Spatial Constraints**

In addition to individual asset grounding, spatial arrangements must satisfy strict compositional rules:

* **Rule of Three Grouping Structure:** Independent nature assets must not be scattered randomly. They must be grouped into clusters comprising 1 Anchor (1.2\\times–1.4\\times standard role height), 2–3 Supports (0.7\\times–0.9\\times role height), and 1 Accent (e.g., a small rock or flowering plant).  
* **Negative Space Allocation:** A minimum of 30\\% of total floating island top surface area must remain clear of major props, structures, or tree canopy foliage to allow spatial breathing room.  
* **Landmark Visual Hierarchy:** The designated island Landmark must represent the absolute highest point in the island's focal field. No tree placed within the direct line-of-sight cone leading to the Landmark may exceed 60\\% of the Landmark's total height.

Grounding and placement rules ensure physical realism within the scene structure. To merge these disparate meshes visually into a single stop-motion clay world, the engine relies on Procedural Shader Transitions and Rubble Grammar across all surface interfaces.

## **4\. Procedural Shader Transitions & Rubble Grammar**

### **4.1 Technical Function of Clay Shaders**

To achieve a tactile stop-motion aesthetic, hard geometric seams between separate meshes (e.g., terrain-to-rock, path-to-grass, curb-to-road) are eliminated using multi-octave cellular noise shaders (`Clay v10` / `Clay K2`). Surface transitions utilize procedural clay blotches (*Sprenkel*) that break sharp vector edges into distinct clay-like drops.

### **4.2 Multi-Octave Cellular Noise Architecture (`kfbBlend` & `kfbLayer`)**

The blend pipeline operates directly in GLSL within the fragment shader pass, evaluating world-space coordinates (p \= \\text{vTS}) to ensure scale invariance across multi-mesh boundaries.

#### **Core Cellular Blending Function (`kfbBlend`)**

The fundamental GLSL evaluation function samples a cellular grid of size `cell` given blend weight `w`, generating crisp clay-blotch shapes with a darker rim (`rim`):

// kfbBlend: Evaluates cellular grid centers to produce crisp clay-blotch patterns  
float kfbBlend(vec2 p, float cell, float w, out float rim) {  
    vec2 grid \= floor(p / cell);  
    vec2 sub  \= fract(p / cell) \- 0.5;  
    float dist \= length(sub);  
      
    // Hash grid center coordinates to generate pseudo-random cell offsets  
    float h \= fract(sin(dot(grid, vec2(127.1, 311.7))) \* 43758.5453);  
    float radius \= 0.5 \* sqrt(clamp(w, 0.0, 1.0)) \* (0.8 \+ 0.4 \* h);  
      
    // Calculate hard clay edge step and outer rim darkening factor  
    float edge \= step(dist, radius);  
    rim \= smoothstep(radius \- 0.08, radius, dist) \* (1.0 \- smoothstep(radius, radius \+ 0.04, dist));  
      
    return edge;  
}

#### **Multi-Octave Layering Function (`kfbLayer`)**

`kfbLayer` executes four nested calls to `kfbBlend` with decreasing cell dimensions to build the final organic clay-sprenkel pattern:

// kfbLayer: Synthesizes four cellular octaves into an organic clay sprenkel map  
float kfbLayer(vec2 p, float cell, float w, out float rimAccum) {  
    float r1, r2, r3, r4;  
      
    // Octave 1: Primary large clay blotches  
    float a \= kfbBlend(p, cell, w, r1);  
      
    // Octave 2: Medium clay drops extending outward  
    float m \= kfbBlend(p \+ vec2(13.1, 17.4), cell \* 0.42, smoothstep(0.0, 0.95, w) \* 0.50, r2);  
      
    // Octave 3: Small outer clay drops reaching maximum distance  
    float s \= kfbBlend(p \+ vec2(27.7, 31.3), cell \* 0.20, smoothstep(0.0, 0.70, w) \* 0.32, r3);  
      
    // Octave 4: Back-drops stamping base material into the secondary surface  
    float b \= kfbBlend(p \+ vec2(41.3, 47.1), cell \* 0.36, smoothstep(0.0, 0.95, 1.0 \- w) \* 0.42, r4);  
      
    rimAccum \= r1 \+ r2 \+ r3;  
    return max(a, max(m, s)) \* (1.0 \- b);  
}

### **4.3 Vertex Attribute Mapping (`aTW`) & Channel-Specific Cell Scaling**

Terrain vertices store blend weight allocations in a dedicated 3-channel attribute (`aTW`):

* **Channel X (`aTW.x`):** Sand material weight (bankette, pond/river shores, coastal strips).  
* **Channel Y (`aTW.y`):** Pflaster/Paving material weight (town plazas, stone paths, walkways).  
* **Channel Z (`aTW.z`):** Fels/Rock material weight (ravines, cliff faces, outer island edges).

#### **Channel-Specific Cell Scale Multipliers**

To maintain structural proportion across differing material textures, `kfbLayer` adjusts its base grid size `uTCell` (base value 1.10, or 1.606 when scaled by `RACE_W` \= 1.46) using channel-specific multipliers:

* **Channel Z (Fels / Rock):** \\text{cell}\_{\\text{fels}} \= \\text{uTCell} \\times 1.30  
* **Channel X (Sand):** \\text{cell}\_{\\text{sand}} \= \\text{uTCell} \\times 1.00  
* **Channel Y (Pflaster / Paving):** \\text{cell}\_{\\text{pflaster}} \= \\text{uTCell} \\times 0.80

#### **Top-Down Canvas Base Color Sampling (`paintMaps`)**

Prior to executing procedural cellular material blends via `kfbLayer`, the terrain diffuse baseline (\\text{Color}\_{\\text{base}}) is sampled from a 1024^2 top-down canvas texture map (`paintMaps`). This texture evaluates world-space two-octave fBm (0.07x, 0.07z) to assign base grass color variations (`grass2` above 0.14, `hill` below \-0.32, `grass` baseline) and boundary lip coloration (`lip` at inward edge distance e \< 1.30 Lab Units). Sampling directly from world-space UV coordinates prevents polar grid radial chunking artifacts (*R1.1-Befund*).

Fragment evaluation computes final surface diffuse colors by blending base terrain against material channels sequentially through `kfbLayer` using world-space XZ coordinates:

\\text{Diffuse}\_{\\text{final}} \= \\text{Mix}\\left(\\text{Color}\_{\\text{base}}, \\text{Color}\_{\\text{material}}, \\text{kfbLayer}(p\_{\\text{world}}, \\text{cell}\_{\\text{channel}}, aTW\_c)\\right)

### **4.4 Edge & Rubble Grammar (`SPEC_EDGE_RUBBLE_GRAMMAR_R1`)**

Whenever a built material terminates or erodes, specific geometric and procedural rules apply:

BUILT EDGE TERMINATION:  
\+-------------------+  (Rounded Clay Cap)  
|   Walkway Tile    |=======\\  
\+-------------------+        \\\_\_\_\_\_ \[Clay Rubble Scatter\] \_\_\_\_\_\_  
                                   \\\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_/

ERODED TILE TERMINATION:  
\+-----------+  
| Tile N-2  |  
\+-----------+-----------+  
| Tile N-1  | Step 1    | \=====\> \[Irregular Rubble Pile\]  
\+-----------+-----------+        (No uniform noise/sprays)  
| Tile N    | Step 2    |  
\+-----------+-----------+

* **Built Edges:** Curb edges, wall caps, portal arches, and retainers must end in rounded clay caps (*Abschlussstücke*). Standard caps are geometrically rounded in MacroCell dimensions with subtle instanced rubble scattered around the base seam.  
* **Eroded / Verfallen Edges:** Eroded stone paths or broken masonry terminate in a stepped retreat of full, discrete tiles (staggered over 1 to 2 tile lengths). The resulting step voids are filled with irregular, instanced clay rubble pieces (*Rubbel*). Continuous, long zones of tiny filler pieces, smooth gradients, or thin, razor-sharp edge cuts are strictly forbidden.  
* **Zackenkappe (Snow Caps):** Snow boundaries on mountain peaks or rock ledges must form rounded clay tongue shapes (*Knetzungen*) pointing downhill. These caps feature crisp clay edges of varying tooth lengths and subtle outer dot drops. Straight cut lines, uniform linear bands, and soft alpha-blur blurs are prohibited.

The procedural shader system provides continuous material transitions across complex island forms. Next, the document specifies the underlying geometric construction of these floating island structures through Island Topology and Body Geometry Construction.

## **5\. Island Topology, Body Geometry & Fluid Systems**

### **5.1 Overview of Island Architecture**

Floating island dioramas in KFB consist of a unified geometric structure comprising three interconnected components: an analytical top heightmap, a rounded quarter-circle perimeter cap (*Viertelkreis-Kante*), and an undercut facetted rock body (*Scholle v7*).

\+-------------------------------------------------------------------+  \<-- Top Surface (fBm)  
 \\                                                                 /   \<-- Viertelkreis-Kante (Quarter-Circle Cap)  
  \\===============================================================/    \<-- Shoulder Seam  
   \\                           .                                 /  
    \\                         / \\                               /      \<-- Scholle v7 Body Taper  
     \\                       /   \\  \<-- Primary Peak (C)       /           (Depth: 0.36W to 0.50W)  
      \\\_\_\_\_                 /     \\                 \_\_\_\_\_\_\_\_\_\_/  
           \\\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_/       \\\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_/                   \<-- Secondary Spikes (Zapfen)

### **5.2 Analytical Terrain Generation Pipeline (R2D v0)**

1. **Plan & Signed Distance Field:** The perimeter boundary is defined by a 2D Signed Distance Field sdf(x, z), where e \= \-sdf(x, z) represents the inward distance from the island edge in Lab Units.  
2. **Rolling Hills Height Function:** Base terrain height h is computed analytically using a two-octave Fractional Brownian Motion (fBm) function in world-space coordinates:

h \= \\text{amp} \\cdot \\left(1.7 \\cdot \\text{fBm}(0.03 \\cdot \\text{fq} \\cdot x, 0.03 \\cdot \\text{fq} \\cdot z) \+ 0.55 \\cdot \\text{fBm}(0.09 \\cdot \\text{fq} \\cdot x, 0.09 \\cdot \\text{fq} \\cdot z)\\right)

*Amplitude (`amp`) and frequency (`fq`) are configured per biome (e.g., KFB Town \= 1.0 / 1.0; Dystopia \= 1.6 / 1.25).*

1. **Smooth Lerp Flattening:** Town plazas, roadbeds, and water basins are flattened into the heightfield via linear interpolation (`lerp`) using `smoothstep` transition weights over multi-unit margins, preventing sharp slope discontinuities:

h\_{\\text{final}} \= \\text{lerp}\\left(h, h\_{\\text{target}}, 1.0 \- \\text{smoothstep}(r, r \+ 4.0, d)\\right)

1. **Viertelkreis-Kante (Quarter-Circle Edge):** At the island perimeter (e \< 1.40 Lab Units \\approx 0.385\\ H), the top surface rolls downward over a 90° quarter-circle cap (cap \= 1.40 Lab Units, ov \= 0.45 Lab Units), diving vertically into the rock body underneath. Top surface UV color maps extend seamlessly over this edge to prevent visual seams.

### **5.3 Scholle v7 Floating Island Body Construction Rules**

The floating underside of the island (*Scholle v7*) is built as a single closed mesh sharing vertices with the quarter-circle edge termination ring:

* **Taper Profile & Depth:** Overall body depth D must equal 0.36\\times to 0.50\\times total island diameter (W). The cross-sectional radius at depth h contracts toward the center of mass (C) according to a linear V-shaped taper power law:

k \= \\left(1.0 \- \\frac{h}{D}\\right)^{pw}

* **Spike Distribution:** The body converges to a single primary focal peak positioned directly beneath the island center of mass (C). Surrounding this primary peak, 2 to 6 secondary vertical stalactite spikes (*Zapfen*) extend strictly downward from the lower surface.  
* **Faceting & Taubin Smoothing:** Body geometry is constructed from low-poly concentric rings reducing in vertex count (32 \\rightarrow 14 \\rightarrow 8 \\rightarrow 5 vertices). To preserve clay-like planar facets without introducing rounded, pillow-like noise (*Kissenrauschen*), geometry is smoothed using Taubin smoothing (laplacian attenuation that preserves broad angular edges).

### **5.4 `fluid.js` Fluid System Specifications**

All water features (lakes, rivers, waterfalls) are driven by a single unified fluid system module (`fluid.js`):

\+-------------------------------------------------------------------+  
|               UNIFIED FLUID MESH (fluid.js)                       |  
|                                                                   |  
| Vertex Attributes:                                                |  
|  \- Position (y)        : Dynamic water surface elevation          |  
|  \- Flow Vector (aFlow) : Local 2D flow direction & magnitude      |  
|  \- Stream Coords (aSN) : (s \= arc-length, n \= transverse offset)  |  
|  \- Shore Dist (aShore) : Distance in Lab Units to waterline       |  
\+-------------------------------------------------------------------+

* **Unified Mesh Attribute Layout:** Water surfaces consist of a single continuous mesh per feature. Every vertex encodes four mandatory attributes:  
  1. `y` (Water Level Elevation): Surface level height.  
  2. `aFlow` (vec2 Flow Vector): Directional velocity vector (0.0 in standing lakes, 1.50 Lab Units/s in rivers).  
  3. `aSN` (vec2 Stream Coordinate): s \= \\text{arc-length along flow line}, n \= \\text{transverse distance from centerline}.  
  4. `aShore` (float Shore Distance): Exact distance in Lab Units to the Marching Squares waterline (0.25 Lab Units grid resolution).  
* **Hoskins Non-Trigonometric Hashing:** Standard trigonometric GLSL hashes (\\text{fract}(\\sin(\\dots))) are strictly prohibited in `fluid.js`. Standard trigonometric functions suffer from floating-point degradation at high time values (t \\ge 3600\\text{ s}), causing procedural waves to collapse into hairline artifacts and visual striations. `fluid.js` mandates Hoskins non-trigonometric pseudo-random hashing functions.  
* **Dual-Pattern Stream-Coordinate Advection:** Pattern advection evaluates two independent static-velocity advection passes mapped directly to stream coordinates (s, n) and blends them at the result layer (`pat()`). Evaluating flow along stream coordinates prevents spatial distortion and temporal folding in river bends:

\\text{UV}\_{\\text{flow}} \= \\text{aSN} \- \\vec{v}\_{\\text{flow}} \\cdot t

* **Dynamic Edge-Foam Generation:** Shoreline foam and shallow water opacity transitions (0.40 \\rightarrow 0.74) are computed analytically from `aShore` values, eliminating the need for real-time depth-buffer sampling or hard white alpha borders.

To verify that these topographical, shader, and spatial rules are correctly implemented, the engine uses automated validation and fresh-context review protocols through Compliance and Quality Assurance Protocols.

## **6\. Automated Compliance & Evaluation Protocols**

### **6.1 Two-Tier Verification Architecture**

Quality assurance in KFB utilizes a two-tier verification pipeline. Tier 1 executes automated programmatic scripts during scene compilation to validate hard physical constraints. Tier 2 submits standard multi-angle render captures to an isolated "Blind Reviewer" (*Blinder Kritiker*) evaluation protocol to evaluate subjective storytelling, composition, and material execution.

\[Scene Compilation Pass\]  
          │  
          ▼  
   \[Tier 1: Automated Programmatic Suite\]  
   ├── \_\_kfb.envCheck()      \--\> Grounding & Sinking Validation  
   ├── \_\_kfb.measureRoadBed() \--\> Road/Terrain Seam Verification  
   ├── \_\_kfb.sizes()         \--\> K2 Scale Contract Compliance  
   └── \_\_kfb.profile()       \--\> Triangle & Draw Call Budgets  
          │  
          ├── (Fail) ──\> \[Immediate Local Repair\]  
          │  
          ▼ (100% Pass)  
   \[Tier 2: Blind Reviewer Capture Suite\]  
   ├── Camera 1: Overview 45°  
   ├── Camera 2: Eye-level (1.0 H) Path View  
   ├── Camera 3: Close-up Foot Grounding  
   └── Camera 4: Edge Silhouette Profile  
          │  
          ▼  
   \[Scoring Rubric Evaluation (K1–K9, U1–U8)\]  
          │  
          ├── (Score \< 4.0 or Fail) ──\> \[Revert to Step 1: Biom-Blatt\]  
          └── (Score ≥ 8.0 Mean)   ──\> \[PASS / Approved by Creative Authority\]

### **6.2 Automated Execution Suite**

The Worldbuilder Lab runtime exposes four mandatory programmatic inspection functions defined by the following TypeScript interface specification:

// Canonical KFB Automated Inspection Suite Interface  
interface KFBInspectionSuite {  
  /\*\*  
   \* Validates physical grounding and placement depth constraints.  
   \* Fails if foot elevation \> 0 (floating) or if sinking violates object matrix limits.  
   \*/  
  envCheck(objectId: string): {   
    pass: boolean;   
    footElevation: number;   
    sinkDepthRatio: number;   
  };

  /\*\*  
   \* Inspects road-to-terrain mesh seams along Track Core paths.  
   \* Fails if terrain triangles intersect road surfaces, skirt depth \< 0.30, or gap \> 0.20 mm.  
   \*/  
  measureRoadBed(islandId: string): {   
    pass: boolean;   
    intersectingTris: number;   
    skirtDepth: number;   
    maxGapMM: number;   
  };

  /\*\*  
   \* Verifies K2 spatial scale compliance across all registered meshes.  
   \* Fails if door heights \< 1.15 H or vehicle dimensions deviate from normalized targets.  
   \*/  
  sizes(): {   
    pass: boolean;   
    violations: Array\<{ meshId: string; expectedH: number; actualH: number }\>;   
  };

  /\*\*  
   \* Measures real-time frame performance and rendering budgets.  
   \* Fails if Nature assets exceed 16 Draw Calls or 120k triangles per pass.  
   \*/  
  profile(): {   
    pass: boolean;   
    natureDrawCalls: number;   
    natureTriangles: number;   
    totalSceneCalls: number;   
  };  
}

// Global runtime binding  
declare const \_\_kfb: KFBInspectionSuite;

### **6.3 Blind Reviewer Evaluation Rubric**

Scenes passing all programmatic checks are captured from four standardized camera angles (Overview 45°, Eye-level 1.0\\ H path view, Close-up foot grounding, and Edge silhouette profile) and submitted to the evaluation rubric (scored 0.0 to 10.0 across criteria K1–K9 and U1–U8):

| Criterion ID | Evaluation Focus | 10.0 Standard (Pass Benchmark) | 0.0 Standard (Immediate Failure) |
| :---- | :---- | :---- | :---- |
| **K1** | Story Readability (*Story-Lesbarkeit*) | Narrative background clear without explanatory text; *Biom-Blatt* story fully realized. | Random decorative placement without narrative context. |
| **K2** | Color Concept (*Farbkonzept*) | Strict adherence to 60/30/10 palette roles; accent colors guide focus toward Landmark. | Uncontrolled color usage without role assignment. |
| **K3** | Composition (*Komposition & Freifläche*) | Clear Rule-of-Three clusters; broken outer silhouette; \\ge 30\\% clear negative space. | Uniform, scattered asset distribution across the island. |
| **K4** | Grounding (*Etherington-Erdung*) | Visible asset sinking, contact shadow/AO, and contextual micro-rubble present on all objects. | Floating assets, hard intersection edges, or artificial shadow circles. |
| **K5** | Habitat Logic (*Standortlogik*) | Species placement matches terrain physics (e.g., willows at water, pines on slope). | Species placed without environmental justification. |
| **K6** | Style Unity (*Stil-Einheit*) | Assets, shaders, and palette synthesize into one cohesive stop-motion universe. | Incompatible asset styles or jarring mesh shaders. |
| **K7** | Variety Without Noise | Rich visual variety in height and rotation while maintaining visual calm. | Monotonous repetition or chaotic visual noise. |
| **K8** | Reference Fidelity | Strict visual alignment with pre-approved *Biom-Blatt* reference benchmarks. | Complete deviation from approved reference concept. |
| **K9** | World Logic (*Weltlogik*) | Every element exhibits an inner-world historical origin from all viewing angles. | Elements placed solely to satisfy a single camera angle. |
| **U1** | Built vs. Crafted Transitions | Material terminations execute as discrete, crafted clay caps or stepped erosion. | Deformed cross-sections, jagged cuts, or linear fades. |
| **U2** | Predictability of Seams | Transition rules remain consistent across identical material interfaces. | Arbitrary or chaotic seam changes across identical meshes. |
| **U3** | Terrain Seam Integration | Terrain sweeps smoothly into embankments with zero road surface intersection. | Visible mesh gaps or terrain popping through road beds. |
| **U4** | J17 Aesthetic Fidelity | Round clay curbs, thick rounded guardrails, and large irregular clay paving slabs. | Razor-sharp edges, thin flat ribbons, or non-clay looks. |
| **U5** | Mass vs. Thin Bands | Surface elements express substantial volumetric mass rather than thin stripes. | Paper-thin geometry bands or ungrounded surface strips. |
| **U6** | Structural Bridge Integration | Bridge decks grow organically from island rock bodies with anchored abutments. | Disconnected deck slabs floating above support pillars. |
| **U7** | Scale Readability | Walkways, road widths, and portals immediately convey scale relative to 1.0\\ H. | Ambiguous spatial scale confusing figure dimensions. |
| **U8** | Construction Logic | Clear historical order of construction (slabs, coping, wear, ballast) is visible. | Painted-on patterns lacking physical structural logic. |

### **6.4 Pass/Fail Criteria & Iteration Stop-Rules**

A scene submission achieves official **PASS** status only when satisfying all of the following conditions:

1. **100\\% compliance** across all Tier 1 automated programmatic tests (`envCheck`, `measureRoadBed`, `sizes`, `profile`).  
2. **Mean overall score \\ge 8.0** across all Blind Reviewer rubric criteria.  
3. **No individual rubric score \< 6.0**.  
4. **World Logic score (K9 or U8) \\ge 7.0**.

**Iteration Stop-Rules:**

* **Maximum Repairs:** A maximum of **2 repair cycles** are permitted per component submission. If a component fails to gain points on the failing criteria after 2 repair cycles, development halts and an issue report is generated.  
* **Conceptual Reversion:** If any evaluation criterion receives a score **\< 4.0** during the initial review pass, the underlying concept is declared invalid. Repair attempts are prohibited; the asset or scene immediately reverts to Step 1 (*Biom-Blatt* re-authoring).

### **6.5 Concluding Summary**

This technical specification establishes absolute engineering authority over KFB environment generation. By enforcing strict character-relative scale conversions, physical grounding thresholds, multi-octave cellular shader transitions, and automated validation gates, the engine guarantees an immersive, highly performant 3D claymation world operating reliably within standard WebGL browser constraints.

