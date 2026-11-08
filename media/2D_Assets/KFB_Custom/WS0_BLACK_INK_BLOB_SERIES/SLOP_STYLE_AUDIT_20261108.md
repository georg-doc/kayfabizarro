> The [five-axis addendum](SLOP_STYLE_DRIFT_ADDENDUM_20261108.md) extends the scope to the 72 legacy atlas sources and gives the revised regeneration order.

# Slop catalog style audit · 2026-11-08

Owner WSA. Source is the selected production catalog at `0c6fec08cdff7e2faacfe22680b37e546f9736e8` on `assets/ws0-ink-miners-2026-11-04`, draft PR #469. This is a design review and a proposed repair queue. Georg accepted all six political satire sheets, adding 36 depictions.

## Scope and method

All 235 selected sheets, 1,410 depictions, in production-index order from oldest to newest. The review used the actual PNGs after matching 235 of 235 SHA-256 hashes to their manifests. It covered the corrected sailor source, 230 landscape sheets at 1536 × 1024 and five portrait sheets at 1024 × 1536. Twenty chronological contact boards provided first-pass visual coverage. Selected cases were enlarged, including the officer and pilot, Civil War figures, Roman armor, Men in Black, American football, early mechanics, quiet emotions, the water bottle, the teens, and the school and political silhouettes. This does not establish 1,410 independently isolated, game-ready sprites. The legacy 531-ID Game / Writer's Room roster has a separate source and was outside this visual pass. Its previous metadata receipts do not establish a visual audit.

[Sheet-by-sheet decisions](SLOP_STYLE_AUDIT_INDEX_20261108.csv) link to the original manifests by repository-relative path. Indices in the CSV start at zero. The current index includes two PASS International Couples sheets under their existing intake exclusion. The original rejected mining run was inspected separately as negative evidence. Its glossy purple material and concept-heavy tools are visible in the preserved derived board. The later accepted Mining & Oil sheet already covers the group. A new mining job would need a specific uncovered role.

## Decisions in production order

| Rank | Source | Proposal |
| --- | --- | --- |
| 1 | #53 Confederate Soldiers | Test Leutnantin Vorratsrecht (row 2, column 2). Her lockbox and epaulettes dominate the outline. Preserve the suspicious sideways look and place the lockbox high enough to reveal an uneven ink contour. General Fernlage (row 1, column 1) is a secondary candidate. Compare with #54 Union Soldiers, where the uniform still reads over a complete blob. |
| 2 | #62 Men in Black | Test Agent Zuständig (row 1, column 1). The briefcase and suit read as a squared-off torso. Keep the dry expression and the briefcase, and show ink along its sides or below. Agentin Ohnebefund (row 1, column 2) is optional after the comparison. |
| 3 | #221 Teenagers | Compare Rory Playlist, Tess Mirrorcheck and Gus Strapzip (bottom row). The jacket, sleeves and bag obscure where each body ends. Keep the distinct poses and props. Use a small exposed wave or taper for each character and vary the outline across the row. |
| Prop only | #194 Hitchhiking Tourists | If the catalog close-up warrants repair, test the water bottle of Cal Snackmile. The current granular refraction reads as sand or minerals. Use clear material, a few broad reflections and restrained highlights. |

The catalog review found no case that requires a full-sheet rerun now. The three pilot sheets contain specific characters with clear silhouette concerns. Two further sheets (#128 Cycling, #139 Space Pirates) merit a second look when cutouts are isolated. No design or intake verdict is implied by those watch items.

## Design range to preserve

- The early Mechanics and Explorers are references for tool jokes, character acting and silhouette variety. The newer Ambivalence and Reactions sheets are references for quiet acting, clear gaze and compact props. Use School Staff and Political Archetypes as complementary references for exposed ink shapes.
- Keep a readable, complete ink mass through the lower contour. Round, tapered, leaning, short and wide characters all fit. A wavy hem, a single tip or small irregular lobes can each establish the body. Avoid the universal broad foot base seen in superseded school attempts.
- Keep warm white sclera, red iris and black pupil when an eye is visible. Choose the gaze, lids, mouth and gesture together for a specific emotional beat. Repeated costume, identity or progression cues can be meaningful for couples, emotional states, career and RPG tiers, and unit uniforms.
- Let the material guide the texture. Favor broad worked clay forms with restrained highlights and dark ink bodies. Metal, glass, fabric and rubber should each read as their own material. Keep rich props where they carry the role or joke. Heavy armor, full hazmat suits and mobility aids have functional reasons for covering the body.
- The early Containment sheets repeat compressed brows and angry mouths across several neighboring teams. Broaden the expression palette in additions and close-up variants. Full protective-suit families intentionally depart from the exposed-body norm.

## Technical follow-up

All 235 verified source PNGs have RGBA transparency. On #15 Law Institutions, a 32-pixel span at the top edge reaches alpha 16 or greater and peaks at 213. Inspect that edge as a crop seam. For #46–51 story trios, compare recovered cutouts before deciding size. All have the same 1536 × 1024 source dimensions as Mechanics, while their median cell coverage at alpha ≥128 ranges from 27.7% to 41.3% versus 56.7% for Mechanics. This metric includes props and droplets and is a framing proxy. Review apparent body size on a shared game or catalog canvas. Treat a high-resolution portrait as its own derived version if extra detail is needed. Production sheets and their metadata remain the provenance for individual assets.

Run one source-conditioned character comparison after Georg picks a pilot. Compare the original and candidate on light and dark backgrounds at game and catalog sizes. Record the original source SHA, cell and character ID, candidate revision and Georg's design verdict. A candidate may replace an intake selection only after the separate owner decision already defined in the repair proposal.
