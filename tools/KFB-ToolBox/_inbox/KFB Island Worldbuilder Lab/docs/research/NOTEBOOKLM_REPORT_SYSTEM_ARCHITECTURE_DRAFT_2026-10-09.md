# **System Architecture Specification: Track Core, R2D Terrain, and Asset Librarian v10 Integration in Three.js**

## **1\. Governance, Scale Contract, and Component Ownership Architecture**

To construct a performant, modular WebGL world without accumulating technical debt or visual defects, strict component governance, unambiguous architectural boundaries, and a normalized spatial coordinate system are mandatory. Distributed engine development across isolated WebGL rendering pipelines frequently collapses into architectural fragmentation—referred to within the system specifications as "second truths" (*zweite Wahrheit*). By enforcing strict Single Source of Truth (SSOT) repositories and a normalized unit scale contract, the system ensures that physics interactions, procedural terrain compilers, parametric road generators, asset ingestion pipelines, and audio/voice layers interface seamlessly within the Three.js r186 execution runtime.

### **1.1 Component Ownership Paradigm & Single Source of Truth (SSOT)**

Architectural stability requires that every subsystem maintain exclusive authority over its domain. Duplicate logic, localized geometry re-creations, or parallel implementations of core runtime features are strictly prohibited (*keine zweite Wahrheit*). The primary upstream state and codebase are centralized within the main GitHub repository (`georg-doc/kayfabizarro`), while runtime asset distribution is governed strictly by the Asset Librarian v10 service.

| Sub-system / Component | Owner & Boundary Scope |
| :---- | :---- |
| **KFB Island Worldbuilder Lab** | **Owner:** Lab (`Steuer-Sitzung`)\<br\>**Architectural Scope:** Local Vite/Three.js r186 execution engine; manages R2D v0 terrain height fields, `aTW` vertex blend weights, polar mesh construction, Scholle v7 volumetric body engine, and building catalog management. Governs the `fluid.js` fluid engine using per-vertex attributes (`aFlow` for 2D flow vectors, `aSN` for curvilinear s, n streamwise/normal coordinates, and `aShore` for distance-to-shore in meters) to guarantee zero-seam fluid rendering across lake, river, and waterfall domains. |
| **Track Core / RKIT** | **Owner:** RKIT (`Claude Code RKIT-Sitzung`)\<br\>**Architectural Scope:** Parametric road network compiler; manages cross-sectional profiles, stationing calculations, edge-profile families (*Bordstein*, *Joyride-Bande*, and *Mauerwerk-Familie A*), and exports `kfb.road-bed/1` interface payloads to the WebGL runtime. |
| **Environment Session** | **Owner:** Environment (`Environment-Sitzung`)\<br\>**Architectural Scope:** Procedural prop composition, biome templates, vegetation clustering, Etherington grounding rule enforcement (`TerrainEmbed`), and narrative placement grammar execution. |
| **Asset Librarian v10** | **Owner:** Asset Librarian (`GPT-Site / Asset Shard`)\<br\>**Architectural Scope:** Asset intake pipeline, CC0 vs. restricted license isolation, canonical asset registry tracking, and live-refresh runtime asset distribution. |
| **KFB-Audio-Owner** | **Owner:** KFB-Audio-Owner\<br\>**Architectural Scope:** Centralized WebAudio master context; maintains the single `AudioContext` instance across the entire application lifespan, managing background music, dynamic engine acoustics, and spatial ambient layers. |
| **ChatterBox Voice Layer** | **Owner:** ChatterBox\<br\>**Architectural Scope:** Dynamic voice synthesis and dialogue layer; manages Resident speech output, diegetic text rendering, subtitle fallback, and real-time audio ducking control. |

### **1.2 Spatial Coordinate Systems & Scale Contract K2**

Imperial and standard metric calculations are fully deprecated across all rendering, compilation, and physics routines. Spatial calculations execute strictly under **Scale Contract K2**, which establishes non-dimensional, relative character-centric units.

### **Scale Contract K2 Reference Standard**

* **H (Base Character Height):** 1.0\\ H \= 3.64\\text{ Lab Units} (derived from the reference mesh *Mummy B* under a global scale factor \\text{FIG\\\_SCALE} \= 1.6).  
* **MC (MacroCell):** 1.0\\ MC \= 4\\text{ KayKit Units } (k) \= 6.4\\text{ Lab Units} \= 1.76\\ H. Defines standard dungeon modules, spatial grid alignment, wall heights, and structural story dimensions.

Spatial Unit Conversion Flow:  
\[ Asset Source Mesh \] \---\> ( Kit-Factor ) \---\> \[ KayKit Unit (k) \] \---\> ( x 1.6 Global Scale ) \---\> \[ Lab Unit \]

When ingesting third-party asset libraries, scale inconsistencies are neutralized by calculating set-specific Kit Factors rather than applying arbitrary per-mesh adjustments:

* **Tiny Treats (Pretty Park, Bakery, Homely House):** Natively matched at Kit Factor 1.0, translating to 1.6 in Lab Units. Doorways measure 1.23\\ H, and structural walls align precisely to 1.0\\ MC (6.4\\text{ Lab Units}).  
* **KayKit Hexagon & City Builder Packs:** Scaled via an adjusted Kit Factor (\\approx 5.0\\text{--}17.0) to align doorway openings to the standard character scale.  
* **Retro Cartoon Cars:** Normalized to a fixed vehicle length of 6.0\\text{ Lab Units} (1.65\\ H), yielding roof clearance levels between 0.74\\ H and 0.87\\ H.  
* **Quaternius Ultimate Nature Pack:** Sourced in centimeter FBX format; normalized via a baseline scale factor of 0.044 to fit role-based target height spans in H (e.g., small trees 1.5\\text{--}2.5\\ H, anchor trees 2.5\\text{--}4.0\\ H).

#### **The Door Rule (\\text{Door Height} \\ge 1.15\\text{--}1.2\\ H)**

To preserve spatial consistency, third-party architectural structures must satisfy the unifying constraint \\text{Door Height} \\ge 1.15\\text{--}1.2\\ H. If an imported building mesh features undersized doorways, the entire asset must be scaled up until the doorway satisfies the threshold. Under Scale Contract K2, character meshes are never scaled down to fit assets; instead, building meshes are scaled up, forcing island surface boundaries to expand to accommodate the larger footprints.

### **1.3 Quality Assurance & Automated Gateways**

Production stability and visual compliance are enforced via a sequential three-tier acceptance gateway. Code and asset additions must pass all automated checks before proceeding to qualitative review.

\[ Build Execution \]   
        │  
        ▼  
┌────────────────────────────────────────────────────────┐  
│ 1\. Automated Hard Rules                                │  
│    \- Collision checks, floating objects (foot \<= 0\)    │  
│    \- Diagnostic auditing via \_\_kfb.\* & three-inspect   │  
└───────────────────┬────────────────────────────────────┘  
                    │ PASS  
                    ▼  
┌────────────────────────────────────────────────────────┐  
│ 2\. Blind Critic Evaluation                             │  
│    \- Context-blind visual & logic evaluation           │  
│    \- Criteria: Mean \>= 8.0, Min Score \>= 6.0, K9 \>= 7.0│  
└───────────────────┬────────────────────────────────────┘  
                    │ PASS  
                    ▼  
┌────────────────────────────────────────────────────────┐  
│ 3\. Executive Approval                                  │  
│    \- Final review by Creative Direction              │  
│    \- Status: PASS | TUNE | FAIL                        │  
└───────────────────┴────────────────────────────────────┘

1. **Automated Hard Rules:** Programmatic validation scripts execute directly within the runtime environment. Diagnostic utilities (`__kfb.envCheck()`, `__kfb.measureRoadBed()`, `__kfb.profile()`, `__kfb.sizes()`, `__kfb.passes()`, and a custom r186 patch of `three-inspect`) measure structural metrics. Geometry violations—such as props floating above terrain (\\text{foot} \> 0), road beds obscured by terrain triangles, camera frustums intersecting geometry, frame geometry exceeding draw-call budgets, or invalid rendering pass counts—result in an immediate automated `FAIL`.  
2. **Blind Critic Evaluation:** An independent, context-blind inspection session evaluates rendered viewports captured from fixed, standardized camera angles (e.g., Bird's-Eye Overview, Character Eye-Level at 1.0\\ H, Close-Up Anchor Grounding, and Boundary Profile). Evaluators score criteria on a scale from 0.0 to 10.0 without access to source code or author explanations.  
   * *Passing Criteria:* Mean score across all categories \\ge 8.0, no individual score \< 6.0, and World Logic / Inner Narrative Integrity (K9 / U8) \\ge 7.0.  
3. **Executive Approval:** Upon passing Tier 1 and Tier 2, the asset or scene assembly is submitted for final sign-off, receiving one of three explicit status assignments:  
   * `PASS`: Approved for core branch merging and runtime integration.  
   * `TUNE`: Requires specific minor parameter modifications; triggers a targeted adjustment loop.  
   * `FAIL`: Rejected due to fundamental visual or structural defects; revokes authorization and returns the feature to the conceptual stage.

Having established architectural governance, scale contracts, and verification gateways, the mathematical mechanics of procedural terrain generation can be evaluated.

## **2\. Procedural Terrain Architecture (R2D v0 & Scholle v7 Engine)**

The terrain sub-system renders seamless, stylistically coherent, claymation-styled floating islands. The system eliminates static tile grids and fragmented mesh boundaries, relying on an analytical continuous height field paired with a volumetric underside engine.

### **2.1 Analytical Terrain Generation & Mathematical Heights**

Terrain surfaces in R2D v0 are defined analytically: every spatial coordinate (x, z) maps directly to elevation, terrain masking, and vertex blend weights via unified mathematical functions.

                           (x, z) Coordinates  
                                    │  
       ┌────────────────────────────┼────────────────────────────┐  
       ▼                            ▼                            ▼  
 Signed Distance Field     Analytical fBm Height       Vertex Weight Vector  
     sdf(x, z)                  heightAt(x, z)              aTW (x, y, z)  
       │                            │                            │  
       ▼                            ▼                            ▼  
 \[ Island Boundary \]      \[ Base Elevation Field \]     \[ Sand / Pflaster / Fels \]

#### **Signed Distance Fields (SDF) & Elevation Fields**

The island perimeter is defined by a 2D Signed Distance Field \\text{sdf}(x, z), where negative values represent points inside the landmass boundary and positive values represent open space. Base topography is calculated using a two-octave analytical fractional Brownian Motion (\\text{fBm}) noise field evaluated in world coordinates:

\\text{height}(x, z) \= A \\cdot \\left( 1.7 \\cdot \\text{fBm}(0.03 \\cdot f \\cdot x, 0.03 \\cdot f \\cdot z) \+ 0.55 \\cdot \\text{fBm}(0.09 \\cdot f \\cdot x, 0.09 \\cdot f \\cdot z) \\right)

where A represents biome elevation amplitude and f represents spatial frequency. Local surface modifications (plazas, road cuts, water basins) apply analytical interpolations (`lerp`) driven by `smoothstep` weighting functions across explicit unit spans:

\\text{height}\_{\\text{final}} \= \\text{lerp}\\left(\\text{height}\_{\\text{base}}, y\_{\\text{target}}, 1.0 \- \\text{smoothstep}(r\_{\\text{inner}}, r\_{\\text{outer}}, d)\\right)

Executing these transitions across wide unit spans (e.g., 4.0\\text{ Lab Units} for structural pads, 7.0\\text{ Lab Units} for road beds) ensures zero sharp internal cuts in the terrain mesh.

#### **Triangulation Mechanics (`cdt2d`)**

Surface mesh generation utilizes Constrained Delaunay Triangulation (`cdt2d`). The algorithm ingests planar polar grid vertices alongside hard edge constraints derived from road bed masks (`mask`) and water boundaries. This prevents degenerate triangles along seam cuts while preserving smooth vertex density across flat plazas and steep embankments.

#### **Vertex Weighting Vector (`aTW`)**

Per-vertex surface material composition is passed to the vertex shader using a three-channel attribute vector `aTW`:

* **Channel X (Sand):** Assigned to road shoulders, lake shorelines, and coastal slopes via distance falloffs (\\text{smoothstep}(hw \+ 0.6, hw \+ 3.4, d\_{\\text{road}})).  
* **Channel Y (Pflaster / Paving):** Assigned to pedestrian paths, walkways, and urban plazas.  
* **Channel Z (Fels / Rock):** Assigned to steep canyon walls, stream cuts, and outer island rim edges.

### **2.2 Multi-Layered Shader Mechanics & `kfbLayer` Texturing**

Surface rendering uses custom shader modifications (`onBeforeCompile`) based on the `kfbBlend` and `kfbLayer` procedural noise algorithms derived from *Joyride J14*.

Shader Surface Blending Pipeline (kfbLayer):  
\[ Weight Vector aTW \] ──► Pass 1: Base Cellular Blobs ( Cell Scale \= 1.1 x 1.46 )  
                       ──► Pass 2: Medium Outward Droplets ( Cell x 0.42 )  
                       ──► Pass 3: Fine Dispersed Outer Droplets ( Cell x 0.20 )  
                       ──► Pass 4: Base Color Back-Droplets ( Cell x 0.36 )  
                                   │  
                                   ▼  
                       \[ Non-Linear Surface Material Blending \]

#### **The 4-Pass `kfbLayer` Procedural Pipeline**

Rather than relying on linear alpha fading or high-frequency noise textures, `kfbLayer` evaluates four successive passes of cellular Voronoi-like noise matrices (`kfbBlend`) at varying spatial scales:

// Procedural cellular blending pipeline within custom fragment shader  
float a \= kfbBlend(p,        cell,        w,                              r1); // Pass 1: Base cellular blobs  
float m \= kfbBlend(p \+ 13.1, cell \* 0.42, smoothstep(0.0, 0.95, w) \* 0.5,  r2); // Pass 2: Medium outward droplets  
float s \= kfbBlend(p \+ 27.7, cell \* 0.20, smoothstep(0.0, 0.70, w) \* 0.32, r3); // Pass 3: Fine dispersed outer droplets  
float b \= kfbBlend(p \+ 41.3, cell \* 0.36, smoothstep(0.0, 0.95, 1.0 \- w) \* 0.42, r4); // Pass 4: Base color back-droplets

float finalSelection \= max(a, max(m, s)) \* (1.0 \- b);

1. **Pass 1 (Base Blobs):** Establishes primary material boundaries using a base cell scale (1.1 \\times 1.46 Lab scaling).  
2. **Pass 2 (Medium Droplets):** Generates medium-sized outward droplets (\\text{cell} \\times 0.42) extending beyond the primary border.  
3. **Pass 3 (Fine Droplets):** Scatters small, highly dispersed droplets (\\text{cell} \\times 0.20) at low density thresholds, forming the outer boundary.  
4. **Pass 4 (Back-Droplets):** Inverts the blending weights (\\text{cell} \\times 0.36) to carve isolated droplets of the underlying base color back into the blending layer.

#### **World-Space Spatial Evaluation**

Because shader calculations evaluate coordinates in 2D world-space (x, z), material distributions remain immune to UV distortion, surface stretching on steep slopes, or texture seam artifacts across disconnected mesh boundaries.

### **2.3 Floating Island Body Engine (Scholle v7 Architecture)**

The volumetric underside of floating terrain islands is generated by the **Scholle v7** direct ring-lofting geometry engine. Scholle v7 replaces legacy 96^3 grid Signed Distance Field (SDF) Marching Cubes voxelization with an analytical ring-lofting system, reducing body execution time from 3,000\\text{--}4,000\\text{ ms} down to 5\\text{--}10\\text{ ms} per island.

Scholle v7 Cross-Sectional Geometry:

      Topography Surface ( Rolling Hills / Plazas )  
  \================─────────────────────────────────=========  ◄── Thin Top Plate ( 2-4% W )  
 (   Quarter-Circle Edge Roll ( Cap=1.4m, Overhang=0.45m )  )  
  \\─────────────────────────────────────────────────────────/   ◄── Transition Shoulder  
   \\                                                       /  
    \\            Radial Profile Taper ( 7-8% / 0.1D )      /    ◄── Volumetric Depth ( 0.43-0.52 W )  
     \\                                                   /  
      \\\_\_\_     /\\        /\\         /\\             \_\_\_\_\_/  
          \\   /  \\      /  \\       /  \\  /\\       /  
           \\ /    \\    /    \\     /    \\/  \\     /          ◄── Spire Field (Tropfsteinfeld)  
            V      \\  /      \\   /          \\   /               ( 5-35 Spires, Off-Center Apex )  
                    \\/        \\ /            \\/  
                               V

1. **Topography & Edge Roll:** The top terrain plate maintains a thin profile equal to 2\\text{--}4\\% of total island width W. The outer edge rolls through a quarter-circle arc (\\text{cap} \= 1.4\\text{m}, \\text{overhang} \= 0.45\\text{m}), tucking surface turf directly into the underlying rock mass.  
2. **Volumetric Depth:** To ensure proportional grounding, the true volumetric depth of the rock body is scaled between 0.43\\ W and 0.52\\ W.  
3. **Direct Ring-Lofting Taper:** Geometry is lofted through concentric polygonal rings that contract radially from the top perimeter down to the bottom cap. Vertex ring counts step down deterministically across depth levels (32 \\rightarrow 14 \\rightarrow 11 \\rightarrow 8 \\rightarrow 5 vertices), contracting at 7\\text{--}8\\% of the island radius per tenth of depth (0.1\\text{ Depth}).  
4. **Spire Mechanics (*Tropfsteinfeld*):** The bottom cap is partitioned using 2D Voronoi cells into an array of 5\\text{--}35 downward-pointing spires. Spires extend downward at varying depths, with the primary apex positioned off-center at a radius offset between 7\\% and 56\\% from the geometric centroid.  
5. **Facet Topology:** Geometry is constructed using low-poly flat facets (600\\text{--}3,000 triangles per body), softened via post-process Taubin smoothing. This rounds sharp edges while preserving the low-poly silhouette.  
6. **Single-Mesh Integrity:** Top surface geometry, edge roll, and lower rock body are welded into a single, watertight, manifold mesh sharing vertex normals across edge boundaries.

Now that procedural terrain generation has been defined, the road network compilation pipeline can be integrated.

## **3\. Procedural Road Core & Surface Boundary Integration (Track Core & `kfb.road-bed/1`)**

Track Core operates as an independent, deterministic road compiler. It converts parametric centerlines, station vectors, and cross-sectional profile definitions into contiguous 3D road geometries that interface cleanly with procedural terrain.

### **3.1 Track Core Compiler & Profile Mechanics**

Track Core processes road geometry as continuous station vectors s alongside orthogonal cross-sectional profile families.

| Profile Family | Primary Target Biome / Setting | K2 Geometric Profile & Dimension Specs |
| :---- | :---- | :---- |
| **Bordstein (Curb Family)** | Urban districts, settlements, KFB Town core. | Wide, rounded masonry curbs; sidewalk width \\ge 1.3\\ H (\\approx 4.8\\text{ Lab Units}), curb width \\approx 0.35\\text{ Lab Units} (\\approx 0.1\\ H), curb height \\approx 0.35\\text{ Lab Units}. |
| **Joyride-Bande (Racetrack Barrier)** | High-speed loops, connectors, rural biomes. | High-curvature, low-poly geometry utilizing soft normal maps and specular clay shading profiles in biome palettes. Overall track width expanded by an island scale factor of 1.46\\times (RACE\\\_W). |
| **Masonry Family A (*Mauerwerk-Familie A*)** | Step terraces, retaining walls, plazas, town borders. | Modular clay-stone masonry blocks providing structural step boundaries, retaining structures, step terraces, and town square perimeter kerbs. |

#### **Transitional Modules**

Profile transitions (e.g., converting an urban curb into a high-speed barrier) must never use continuous geometric morphing, continuous vertex interpolation, or alpha-fading. Transitions are executed strictly via constructed transitional modules—discrete geometric segments featuring explicit starting and ending conditions (e.g., a barrier head sinking into a 0.5\\ MC green buffer strip, followed by a rounded curb header block).

### **3.2 The `kfb.road-bed/1` Interface Contract**

To merge compiler output with runtime WebGL terrain meshes without visual gaps, Track Core exports a standardized JSON payload adhering to the `kfb.road-bed/1` schema:

interface RoadBedSpec {  
  schema: 'kfb.road-bed/1';  
  rkitVersion: string;  
  islandId: string;  
  outlineHash: string; // FNV-1a 32-bit hash of the island boundary polygon  
  frame: string;  
  units: 'K2';  
  roads: {  
    id: string;  
    profileFamily: 'bordstein' | 'joyride-bande' | 'mauerwerk-a';  
    sections: {  
      s: number;        // Station distance along centerline  
      support: string;  
      family: string;  
      L: \[number, number, number\]\[\]; // Left vector samples  
      R: \[number, number, number\]\[\]; // Right vector samples  
    }\[\];  
    seam: {  
      L: { s: number; p: number; from: number; kind: string }\[\];  
      R: { s: number; p: number; from: number; kind: string }\[\];  
      falloff: number;  
    };  
  }\[\];  
  mask: \[number, number, number\]\[\]\[\];  // Vector polygons defining terrain exclusion zones  
  clear: \[number, number, number\]\[\]\[\]; // Vector polygons defining prop exclusion zones  
  anchors: {  
    id: string;  
    kind: 'walkway' | 'bridge' | 'junction';  
    p: \[number, number, number\];  
    dir: \[number, number, number\];  
    width: number;  
  }\[\];  
  rim: {  
    s: number;  
    centre: \[number, number, number\];  
    contour: \[number, number, number\]\[\];  
    rootDepth: number;  
  }\[\]; // Perimeter bridge anchors  
}

### **3.3 Physical Seam Execution & Structural Bridges**

To prevent visual artifacts, road-terrain intersections must comply with specific geometric structural boundaries.

Road-Terrain Seam Integration (Rule T1 & T2):

            Driveable Road Surface  
 ┌──────────────────────────────────────────┐  
 │                                          │  
 └───┬──────────────────────────────────┬───┘  
     │ Extended Apron ( \>= 0.3 Units )  │    
 ───┐│                                  │┌───  ◄── Terrain Surface Margin (hw)  
    ││                                  ││         ( \>= 0.05 Units Below Curb Top )  
    └┘                                  └┘  
  \[ Zero Terrain Triangles Above Driveable Surface (Rule T1) \]

#### **Seam Tightness & Aprons (Rules T1 & T2)**

* **Rule T1 (Zero Encroachment):** Exactly zero terrain mesh triangles may sit above or intersect driveable road surfaces, curbs, or sidewalks.  
* **Rule T2 (Seam Tightness):** Road geometries must extend downward as a vertical apron penetrating at least 0.3\\text{ Lab Units} beneath the terrain surface. At the outer road margin hw, the terrain surface must sit at least 0.05\\text{ Lab Units} below the curb top. Tolerances between shared boundary points must not exceed 0.2\\text{ mm}, preventing visible gap artifacts.

#### **Stone-Arch Structural Bridges (Types C1, C2, C4)**

Bridges spanning island chasms or extending from perimeter `rim` anchors must be constructed as single, continuous meshes originating directly from the island's rock face. Bridges feature a maximum incline grade \\le 8\\%, stone-arch understructures, parapet walls, and "elephant-foot" pier supports extending down into terrain geometry.

Having detailed terrain generation and road integration, the framework for ingesting, placing, and grounding 3D environmental assets can be specified.

## **4\. Asset Lifecycle, Environment Ingestion & Grounding Framework (Asset Librarian v10)**

The Asset Librarian v10 subsystem acts as the centralized gateway governing 3D models, enforcing licensing rules, executing ground integration routines, and directing environmental prop placement across all biomes.

### **4.1 Asset Librarian v10 Ingestion & Registry Pipeline**

Every external 3D model passes through a strict, multi-stage intake process before instantiation in the WebGL runtime:

External Asset Discovery  
        │  
        ▼  
License Verification ───► \[ Restricted / Purchased Asset \] ──► Ingest to Private Inbox Only  
        │                                                       ( Excluded from Public Repos )  
        ▼ CC0 / Open License  
Handoff & Staging  
        │  
        ▼  
Cataloging in Asset Registry ( Asset Librarian v10 )  
        │  
        ▼  
Live-Refresh Runtime Ingestion ( WebGL Application Core )

1. **Ingestion & Licensing Verification:** Newly discovered assets undergo license verification. Purchased proprietary assets (such as Unity Store packages) are strictly segregated into private local storage and excluded from public repositories. Public branches permit CC0 or verified open-license models only.  
2. **Cataloging & Handoff:** Verified models are staged in the private inbox, assigned unique asset IDs, cataloged within the master Asset Librarian registry, and processed for spatial normalization.  
3. **Live-Refresh Runtime Ingestion:** Registered models are exposed to the WebGL execution application via live-refresh APIs, allowing instant runtime instantiation without requiring manual build passes.

### **4.2 Environmental Composition & Etherington Grounding Framework**

Environmental prop placement is governed by the **Etherington Grounding Principles**, which translate artistic composition concepts into strict spatial constraints.

Prop Grounding Techniques ( Etherington Mechanics ):

      EINGRABEN ( Embedding )                  KONTAKT ( Contact )                  ÜBERLAPPEN ( Overlapping )  
        
          /│           │\\                        ┌───────────┐                         /│           │\\  
         / │           │ \\                       │   Prop    │                        / │   Prop    │ \\  
        /  │   Rock    │  \\                      └───────────┘                       /  │           │  \\  
  ─────/───┼───────────┼───\\─────          ───────▓▓▓▓▓▓▓▓▓▓▓───────           ─────/───┼───▓▓▓▓▓───┼───\\─────  
      /    │  (25-45%) │    \\                     Contact Shadow / AO               /   │  Micro-Props  │    \\  
     /     └───────────┘     \\                   ( No Dark Discs )                 /    └───────────────┘     \\

#### **Grounding Mechanics & Programmatic Terrain Embedding (`TerrainEmbed`)**

Assets are integrated into the underlying heightfield using the `addEmbed` / `TerrainEmbed` runtime routine. Programmatically, `TerrainEmbed` ingests the prop's bounding footprint (`foot` polygon) and classification parameters, altering local elevation values y, generating soil/rock wedge contours, and updating local `aTW` vertex blend weights:

1. **Eingraben (Embedding):** Sinks objects into terrain geometry based on physical classification:  
   * *Boulders / Large Rocks:* Embedded 25\\text{--}45\\% of their height. `TerrainEmbed` raises an earthen wedge along the uphill margin and depresses local heightfield values beneath the core mass.  
   * *Trees:* Embedded 5\\text{--}10\\% of their height into localized root mounds (mound radius equal to 1.3\\text{--}1.6\\times trunk radius).  
   * *Shrubs & Bushes:* Embedded 5\\text{--}12\\% of their height, ensuring lower branches touch the ground.  
   * *Props (Crates, Barrels):* Embedded 2\\text{--}5\\% of their height to establish firm contact without altering macro-topography.  
2. **Kontakt (Contact):** Generates localized Ambient Occlusion (AO) footprints and updates `aTW` weights to blend ground material colors into the prop base. Smooth artificial shadow discs, harsh linear shadows, or unshaded contact lines are strictly forbidden.  
3. **Überlappen (Overlapping):** Micro-props (grass tufts, clay rubble, pebble clusters) break object-ground intersection lines. Each primary prop is framed by 3 to 8 micro-props obeying physical causality (e.g., debris accumulating downhill or windward grass tufts).

#### **Rule of Three Composition Matrix**

Props must be placed in odd-numbered clusters (3, 5, or 7 elements) adhering to the **Rule of Three** spatial scaling hierarchy:

| Cluster Role | Quantity | Target Scale Multiplier | Placement Description & Function |
| :---- | :---- | :---- | :---- |
| **Anker (Anchor)** | 1 | 1.2\\text{--}1.4\\times | Primary structural focal point; highest element in the local cluster footprint. |
| **Stützen (Supports)** | 2 to 3 | 0.7\\text{--}0.9\\times | Secondary supporting elements framing the anchor; varied rotational offsets (\\ge 30\\% spacing variance). |
| **Akzent (Accent)** | 1 | 0.15\\text{--}0.35\\times | Micro-detail object (flower tuft, small rock, fallen fruit/fluff, or debris cluster). |

### **4.3 Micro-Storytelling (§00) & Narrative Placement Governance**

Prop placement is regulated by fundamental world-building directives:

### **Rule §00 ("Weltlogik zuerst" / World Logic First)**

Prior to placing any scene element, the authoring pipeline must evaluate a mandatory narrative query:

*"Who built or grew this, with what material, why is it here, and what story does it tell?"*

If an asset placement cannot satisfy this query, it must be excluded from the scene. Arbitrary scatter algorithms, uniform Poisson-disk distributions, and decorative filler assets are strictly prohibited.

Within the procedural instantiation grammar, Rule §00 functions as a **declarative placement constraint constraint gate**. Spatial generation pipelines ingest narrative parameters (biome lore, historical accretion layers, Resident activities) as hard evaluation gates before emitting transform matrices.

Prop layouts are guided by narrative environment templates:

* **Pyramiden-Wüste:** Focuses on incomplete construction and ancient excavations. Features sandstone blocks clustered around stone-quarry faces, quarry sledges positioned along sand drag-trails, and worker encampment props surrounding an oasis.  
* **Canyon:** Focuses on natural erosion and resource harvesting. Features exposed orange cliff faces, timber stumps clustered near a watermill, and rockfall debris accumulated along riverbeds.  
* **Bikini-Bucht:** Features a coastal shoreline environment with rounded drift-stones along the tide line, dune grasses, a seaside tavern, and shallow-water coral beds.  
* **O-Town:** Features suburban planning logic with evenly spaced street trees, manicured hedges, structured pathways, and stone fragments remaining from building excavation pits.

With asset ingestion and grounding rules defined, real-time WebGL rendering optimization and camera management can be addressed.

## **5\. Performance Budgets, Camera Systems & Engine Optimization**

To maintain target framerates across target hardware (baseline Apple Silicon / M-series MacBooks), real-time WebGL execution must observe strict draw-call limitations, memory budgets, and camera safety constraints.

### **5.1 Strict Draw-Call & Geometry Budgets**

Rendering budgets are evaluated per frame using the internal `__kfb.profile()` diagnostic framework.

| Scene Component / Pass | Max Allowable Draw Calls | Max Allowable Triangle Count | Frame Rate Target |
| :---- | :---- | :---- | :---- |
| **Environmental Pass (4 Islands)** | \\le 16 Draw Calls | \\le 120,000 Triangles | 30 to 60 FPS |
| **Full Scene Global Budget** | \\le 120 Draw Calls | \\le 261,000 Triangles | 30 to 60 FPS |

#### **Shadow Pass Costs & Segregation**

Because shadow-casting render passes double draw call and geometry evaluation overhead, strict asset segregation is enforced:

* **Shadow Casters:** Restricted to primary island landmasses, anchor trees, major structural landmarks, and primary character meshes.  
* **Shadow Receivers Only:** Micro-props, grass tufts, small flowers, and secondary shrubs receive shadows but do not cast shadow-map volumes.

### **5.2 Batched Instancing & Shader Optimization Strategy**

To meet geometry budgets without sacrificing scene density, environmental assets are rendered using Three.js `BatchedMesh` or `InstancedMesh` structures.

Instanced Data-Texture Parameter Pipeline:

┌────────────────────────────────────────────────────────────────────────┐  
│ GPU Memory Data Texture ( 64 Groups per Island )                        │  
├──────────────┬──────────────────┬─────────────────┬────────────────────┤  
│ Group ID     │ Animation Phase  │ Wind Stiffness  │ Palette Slot Index │  
└──────┬───────┴─────────┬────────┴────────┬────────┴─────────┬──────────┘  
       │                 │                 │                  │  
       ▼                 ▼                 ▼                  ▼  
┌────────────────────────────────────────────────────────────────────────┐  
│ Vertex Shader Deformer ( OnBeforeCompile / TSL )                       │  
│ \- Base Anchor Fixed ( Preserves Footing Grounding )                    │  
│ \- Wind Bending / Squash & Stretch / Wobble Applied                     │  
└────────────────────────────────────────────────────────────────────────┘

#### **Data-Texture Parameter Pipeline**

Instance-specific attributes—such as Group ID, animation phase offsets, wind stiffness, and palette color mappings—are packed into a small GPU Data Texture (supporting up to 64 groups per island). This structure allows individual prop clusters to react to wind gusts or character interactions without triggering individual CPU-to-GPU uniform updates.

#### **Shadow Pass Deformers (`customDepthMaterial`)**

When applying procedural vertex deformation (wind sway, squash and stretch) via custom shaders, standard WebGL depth passes evaluate shadow maps using original, undeformed geometry vertices. To prevent shadow-mesh detachment artifacts, all deformed meshes must be assigned a corresponding `customDepthMaterial` matching the main material's vertex offset and displacement logic.

#### **Shader Optimization for `kfbBlend`**

In TSL and custom `onBeforeCompile` shaders, procedural calculations are optimized based on dynamic needs:

* **Static Features:** Standard, non-changing surface material textures are pre-baked into static terrain maps.  
* **Dynamic Transition Boundaries:** Procedural noise passes (`kfbBlend` / `kfbLayer`) are evaluated in real time strictly within material transition zones, conserving fragment shader instruction counts.

### **5.3 Spatial Camera Dynamics & Occlusion Management**

The camera execution system operates across three primary modes:

1. **Third-Person Play Camera:** Tracks the active character or vehicle. Allows free orbiting and zooming around the focal point without altering character orientation. Follow lag must not exceed 0.15\\text{ seconds}.  
2. **God Mode (Editor Mode):** Provides free orbital controls utilizing `zoomToCursor` navigation with a smooth damping factor of `0.25`.  
3. **Fixed Evaluation Presets:** Fixed camera configurations used for automated QA checks (e.g., Bird's-Eye, Character Eye-Level at 1.0\\ H, Anchor Grounding, Boundary Profile).

Camera Collision & Occlusion Punching Logic:

                  \[ Orbit Camera Position \]  
                             │  
                             ▼  ( Collision Check )  
             ┌───────────────────────────────┐  
             │ Mesh Collision Sphere (R=Hard)│  ◄── Prevents Near-Plane Clip  
             └───────────────┬───────────────┘      ( 0 Frames Inside Geometry )  
                             │ Impact Detected  
                             ▼  
             ┌───────────────────────────────┐  
             │ Arm Retraction Algorithm      │  ◄── Contracts Arm Length  
             │ ( Max Retraction to 70% )     │      Without Elevation Jumps  
             └───────────────┬───────────────┘  
                             │ Geometry Still Blocks View  
                             ▼  
             ┌───────────────────────────────┐  
             │ Procedural Soft Cutout        │  ◄── Punches View Hole with  
             │ ( Clay Edge Blending )        │      Soft Blended Edges  
             └───────────────────────────────┘

#### **Camera Collision & Soft Occlusion Algorithm**

To ensure uninterrupted character visibility, the camera system follows a sequential three-step safety pipeline:

1. **Mesh Collision Sphere:** A spherical boundary surrounds the camera lens. System logic guarantees exact zero frame instances where the camera near-plane intersects island geometry or prop meshes.  
2. **Arm Retraction:** Upon intersecting geometry, the camera arm contracts dynamically down to a minimum of 70\\% of its standard resting length. The camera maintains its angle without abrupt elevation pops.  
3. **Soft Cutout Punching:** If geometry continues to block the character after arm retraction, the occluding geometry is dynamically clipped using a soft, claymation-styled procedural cutout, maintaining character visibility while preserving background composition.

## **Concluding Summary**

This specification establishes a unified framework for modular WebGL world design in Three.js r186. By enforcing the **Scale Contract K2**, strict **Component Ownership Architecture**, and the **`kfb.road-bed/1` interface contract**, the engine guarantees absolute technical consistency across terrain generation, road network compilation, fluid dynamics, and environmental asset placement. Automated QA gateways, Etherington grounding principles (`TerrainEmbed`), and rigid draw-call budgets ensure that real-time WebGL rendering performance remains locked at 30–60 FPS on target hardware while preserving narrative integrity and visual quality. Strict adherence to these architectural constraints prevents subsystem fragmentation and guarantees visual, structural, and programmatic coherence across the entire application runtime.

