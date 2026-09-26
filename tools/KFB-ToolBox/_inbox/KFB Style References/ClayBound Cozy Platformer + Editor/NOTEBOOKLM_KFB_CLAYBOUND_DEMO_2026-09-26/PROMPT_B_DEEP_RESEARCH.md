# NotebookLM Deep Research Prompt · ClayBound 3D Style

Conduct a **deep technical research study of the ClayBound 3D visual style** using the supplied screenshots, project references, and credible external technical sources.

The purpose is NOT to review the game, summarize its premise, or imitate its characters.

The purpose is to derive a **production-relevant technical recipe** that can be applied to existing KFB 3D assets in Blender.

# RESEARCH QUESTION

What combination of:

- modeling
- geometry treatment
- surface construction
- texturing
- shader design
- lighting
- rendering
- animation treatment
- camera
- color management
- post-processing

most plausibly produces the distinctive ClayBound-style handcrafted clay appearance visible in the supplied references?

# EVIDENCE DISCIPLINE

Separate every important conclusion into one of these categories:

### OBSERVED
Directly visible in the supplied ClayBound references.

### DOCUMENTED
Explicitly supported by a reliable source describing the actual project or technique.

### INFERRED
A plausible technical explanation derived from visual evidence but not confirmed as the actual ClayBound implementation.

### ANALOGOUS TECHNIQUE
A known Blender / game-art / shader technique that could reproduce the observed result, without claiming ClayBound itself uses it.

Do not present inferred implementation details as confirmed ClayBound facts.

If the actual production pipeline is not publicly documented, say so.

The goal is reproducibility, not invented insider knowledge.

# RESEARCH PRIORITIES

Investigate the following areas.

## 1. SHAPE LANGUAGE

Analyze:

- rounded versus hard forms
- edge softness
- bevel strategy
- deliberate asymmetry
- silhouette simplification
- apparent sculpting
- low-poly versus high-poly appearance
- subdivision characteristics
- proportion relationships
- geometric imperfections
- how handcrafted form differs from generic smooth 3D geometry

Determine which qualities likely need:

- actual geometry
- sculpting
- modifiers
- normal treatment
- shader effects

Do not assume surface shaders can replace important shape design.

---

## 2. CLAY SURFACE STRUCTURE

Analyze surface appearance across at least three scales:

### Macro
Broad deformation and slightly handmade form irregularity.

### Meso
Subtle dents, compression, smoothing variation, sculpt-tool traces.

### Micro
Fine clay grain and roughness variation.

For each scale determine the best production mechanism:

- geometry
- displacement
- bump
- normal map
- procedural shader
- image texture

Avoid the simplistic recipe:

“Add Noise Texture and fingerprints.”

Research more sophisticated non-repetitive approaches.

---

## 3. MATERIAL RESPONSE

Estimate the physical/material characteristics visible in the references:

- roughness
- specular response
- diffuse softness
- subsurface contribution
- sheen
- coat
- surface scattering
- color variation
- highlight width
- shadow behavior

Translate these observations into practical Blender Principled BSDF parameter ranges.

Clearly label parameter values as suggested starting points unless directly documented.

---

## 4. SEAMLESS TEXTURE DESIGN

Research how to build production-ready clay textures that support this look.

Investigate:

- tileable clay BaseColor
- Roughness
- Normal
- Height
- optional micro-normal
- optional masks

Define:

- appropriate texture resolution
- real-world scale
- map intensity
- frequency ranges
- anti-repetition techniques
- multi-scale blending
- UV versus object-space mapping
- when textures should be replaced by procedural nodes

Research ways to prevent:

- obvious tiling
- noisy surfaces
- repeated fingerprints
- baked lighting
- high-frequency shimmer during animation

---

## 5. BLENDER SHADER RECIPE

Develop at least one practical Blender shader architecture that could reproduce the observed style.

Prefer:

- reusable node groups
- Principled BSDF
- layered macro / meso / micro controls
- low-amplitude variation
- controllable random seed
- material presets
- object-specific variation without visible pattern repetition

Provide:

- node types
- connection logic
- mapping strategy
- parameter ranges
- blend modes
- procedural frequency ranges
- bump strengths
- roughness ranges

Explain why each layer exists.

Do not merely say “use Noise Texture.”

---

## 6. NON-REPETITIVE SURFACE METHODS

Specifically research methods for avoiding visible procedural repetition.

Compare approaches such as:

- multiple noise frequencies
- domain warping
- rotated texture layering
- stochastic texture sampling
- texture bombing
- triplanar projection
- object-space procedural variation
- UV-space image textures
- curvature / AO masks
- per-object randomization

Evaluate their suitability for animated characters.

Identify techniques likely to produce texture swimming or temporal artifacts.

---

## 7. LIGHTING

Analyze the lighting language visible in the references.

Determine likely characteristics of:

- key light
- fill
- rim
- environment lighting
- shadow radius
- ambient occlusion
- contact shadows
- exposure
- contrast
- background
- highlight control

Separate qualities caused by material from qualities caused by lighting.

Create one practical neutral Blender lighting rig for material evaluation.

Then provide a second presentation-lighting recipe if appropriate.

---

## 8. CAMERA AND PRESENTATION

Research:

- likely focal-length range
- perspective compression
- camera height
- subject framing
- depth of field
- orthographic-like versus perspective presentation
- background separation

Explain which camera choices contribute to the “miniature handcrafted world” impression.

---

## 9. COLOR AND COLOR MANAGEMENT

Analyze:

- palette saturation
- value separation
- warm/cool relationships
- highlight color
- shadow color
- background interaction
- color-management implications

Provide a Blender color-management recommendation.

Distinguish look-development recommendations from confirmed ClayBound implementation.

---

## 10. ANIMATION / STOP-MOTION CHARACTER

Analyze whether the references imply:

- actual stepped animation
- smooth animation styled to resemble stop motion
- pose-to-pose irregularity
- subtle mesh deformation
- material variation
- frame-rate manipulation
- squash/compression
- timing changes

Research production methods for a handmade stop-motion quality that do NOT rely on constant random jitter.

Avoid:

- indiscriminate wobble
- random vertex noise every frame
- texture flickering
- fake low-frame-rate effects without animation intent

Provide an animation-safe recommendation for KFB characters.

---

## 11. BLENDER PRODUCTION PIPELINE

Translate the research into a practical workflow:

1. existing GLB import
2. geometry inspection
3. non-destructive shape treatment
4. material-zone preservation
5. UV / mapping decision
6. texture assignment
7. master shader assignment
8. variation tuning
9. lighting calibration
10. animation test
11. close-up validation
12. export / runtime validation

The workflow must preserve existing KFB character identity and rig compatibility.

---

# COMPARE IMPLEMENTATION OPTIONS

For each important visual feature, compare at least:

### OPTION A — Geometry-driven
Actual mesh/sculpt/modifier solution.

### OPTION B — Texture-driven
Image texture / baked map solution.

### OPTION C — Procedural shader
Blender node solution.

Where relevant include:

### OPTION D — Hybrid

Recommend which method is most production-safe for:

- static close-up
- animated Blender character
- real-time export
- repeated use across multiple KFB assets

---

# SEARCH FOR REUSABLE TECHNIQUES

Look for credible technical references involving:

- Blender clay shaders
- stylized handcrafted materials
- procedural clay materials
- stop-motion-style 3D rendering
- claymation shaders
- non-repeating material textures
- stochastic texture techniques
- stylized roughness
- sculptural surface breakup
- animation-safe procedural texturing

Prioritize:

- official Blender documentation
- technically detailed tutorials
- shader breakdowns
- open-source Blender examples
- academic / graphics references where useful
- well-documented production workflows

Do not rely heavily on shallow “make anything look like clay in five minutes” tutorials.

---

# REQUIRED FINAL REPORT

Produce a structured report with these sections:

## A. Executive Production Summary
The smallest set of techniques that most strongly define the look.

## B. Observed ClayBound Style Grammar
Only visible evidence.

## C. Confirmed / Documented Information
What can actually be verified.

## D. Inferred Technical Reconstruction
Clearly labeled hypotheses.

## E. Blender Master Shader Recipe
Detailed reproducible setup.

## F. Seamless Texture Pack Specification
Exact texture families and map requirements.

## G. Geometry Treatment
What must happen on the mesh rather than in the shader.

## H. Lighting / Camera / Color Recipe
Reproducible setup.

## I. Animation-Safe Claymation Recipe
Practical recommendations.

## J. Production Pipeline for Existing KFB GLBs
Step-by-step.

## K. Parameter Table
Numeric starting ranges wherever useful.

## L. Failure Modes
Especially:
- fake fingerprints
- generic procedural noise
- plastic appearance
- excessive bump
- texture repetition
- noisy roughness
- geometry becoming too melted
- animation shimmer
- loss of KFB identity

## M. Recommended POC
Define the smallest test that could validate the reconstructed style on ONE existing KFB model.

## N. Source List
Cite the sources used and distinguish direct ClayBound evidence from analogous technical research.

# FINAL PRINCIPLE

The research should make it possible for a Blender artist or Blender MCP agent to build the look.

Do not stop at adjectives such as:

“soft,”
“handmade,”
“clay-like,”
“cozy,”
“organic.”

Translate those adjectives into:

- geometry operations
- shader nodes
- texture maps
- parameter ranges
- lighting choices
- animation rules
- measurable production decisions.
