# Etherington Brothers · Design-first source pools · Environment + Comic/VFX

Status: **RESEARCH/DATA READY · VISUAL INSPECTION PENDING**  
Date: 2026-10-06  
Owner: KFB Asset Registry / Asset Librarian  
Consumer priority: Claude Design / KFB visual development

## Inventory

The official Etherington corpus is now split into three non-duplicative KFB seeds:

- `ETHERINGTON_OFFICIAL_SEED_01.json` · 13 foundational references
- `ETHERINGTON_OFFICIAL_SEED_02_ENVIRONMENT.json` · 17 Environment references
- `ETHERINGTON_OFFICIAL_SEED_03_COMIC_VFX.json` · 13 Comic/VFX references

Combined:
**43 unique official creator-hosted references**

All new records start with:
- `verification: OFFICIAL_URL_VERIFIED`
- `sourceInspectedInIsolation: false`
- `visualAnalysisStatus: PENDING`

The tags are routing/consumer tags, not claims about visual content beyond the named tutorial topic.

## Environment · first design shortlist

Do not make Claude Design inspect all 17 references in one expensive pass.

For first KFB environment/world design work, start with small problem-specific subsets.

### World mass + depth
- Mountains
- Foreground / Midground / Background
- Forests · Parts C/D
- Overgrown Vegetation

Useful existing Seed 01 companions:
- Rock Formations
- Tree Roots
- Clouds

### Buildings / settlement language
- Game Buildings
- Junk Houses
- Pod Houses
- Brickwork
- Cityscapes

Useful existing Seed 01 companions:
- Perspective Boxes
- Drawing in 3D
- Composition

### Terrain / surface / elemental environment
- Water and Waves
- Water Reflections
- Caves
- Sand
- Pavements / Sidewalks
- Lava
- Fields of Grass
- Mushrooms and Fungus

## Comic/VFX · first design shortlist

### Destruction / impact
- Breaking Glass
- Shatter Technique
- Battle Damage
- Small / Medium / Large

Use with existing Seed 01:
- Impact Debris / Explosion / Destruction
- Small Explosions
- Smoke Effects

### Energy / elemental effects
- Lightning and Electricity
- Small Flames
- Pouring Liquid

Use with existing Seed 01:
- Smoke Effects
- Clouds where volumetric grouping is useful

### Motion / action readability
- Motion Lines
- Car Chases
- Silhouette Thumbnails

Use with existing Seed 01:
- Composition
- Spacing in Composition

### Framing / graphic presentation
- Comic Covers
- Contrast
- Establishing Shots
- Silhouette Thumbnails

Use with existing Seed 01:
- Composition
- Spacing in Composition
- Conversations for dialogue staging

## Claude Design use rule

For each actual design job:

1. select **3–6 references maximum** from these pools;
2. export/copy the selected records into a `kfb.style-reference-pack/1`;
3. Claude Design opens every selected official source itself;
4. record the exact `referenceId` values actually inspected;
5. separate:
   - OBSERVED SOURCE FACT
   - CONSTRUCTION PRINCIPLE
   - KFB DESIGN DECISION
6. create KFB-specific output rather than copying the source drawing.

A URL in a pool is not proof that the source was inspected.

## Immediate recommended jobs

### Job A · KFB procedural/world clouds
Already prepared:
`tools/asset_registry/librarian/reference-packs/claude-design/kfb-clouds-01/`

### Job B · KFB destruction / impact grammar
Suggested first references:
- Seed 01 · Impact Debris / Explosion / Destruction
- Seed 01 · Small Explosions
- Seed 01 · Smoke Effects
- Batch 03 · Breaking Glass
- Batch 03 · Shatter Technique
- Batch 03 · Small / Medium / Large

### Job C · KFB environment mass / living world
Suggested first references:
- Batch 02 · Mountains
- Batch 02 · Forests
- Batch 02 · Overgrown Vegetation
- Batch 02 · Foreground / Midground / Background
- Seed 01 · Rock Formations
- Seed 01 · Tree Roots

## Boundary

No Site code or deployment change is required for this research/data batch.
No remote reference image is mirrored into GitHub.
No source is marked visually inspected.
No automatic style imitation instruction is created.
No merge / no Live promotion.
