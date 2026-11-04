---
name: kfb-claymation-scenelets
description: Create coherent KFB claymation-cartoon mini scenelets as independent transparent PNGs with derived 4/6/8/12-up sprite-style contact sheets, QA, and private WS0 handoff; extends the existing KFB Asset Scene Composer, not a new runtime.
---

## Ink Monster routing override · 2026-11-04
For Black Ink Blob / Fluffer character requests, read and follow ../produce-kfb-ink-monsters/SKILL.md before this generic profile. Ink R2 overrides generic batch, eye and style-reference rules: user's selected ORIGINAL reference images are allowed and must actually reach the generator; one pilot first after TOTAL FAIL; white sclera/red iris/black pupil. Do not use the planet paint reference for ink bodies. Documentation does not authorize generation.


# KFB Claymation Scenelets · Workshop R1

This is an **additive scenelet recipe** of the EXISTING KFB Asset Scene Composer, not another image model, engine owner, catalog, registry or public uploader. Read `../produce-kfb-2d-assets/SKILL.md` and `../produce-kfb-2d-assets/references/fresh-image-job.md` first. For the full current canonical instructions fetch GitHub private `georg-doc/KFB-Stunt-Car-Race` branch `assets/popup-r1`, file `popup_assets_r1/workflow/claymation-scenelet-workshop-r1/SKILL.md`. Also fetch its `STYLE_BIBLE.md`, `PROMPT_FACTORY.md`, `QA_AND_HANDOFF.md`, `THEME_COVERAGE.json`, and current GitHub owner Return/Recovery. Do not rely on a historical chat instead of current GitHub.

## Reproducible visual DNA
A scenelet is a small freestanding, tactile, surreal cartoon micro-environment with one dominant anchor (roughly 60–70% of the visual read), a subordinate physical contact/environment and one legible story accent. It is not a hero character, whole game stage, merchandising podium or seamless repeating background tile. Favor crooked clay, visible pressed/smeared pigment, broad sculpted shapes, irregular rounded silhouettes, coherent material identity, rich contrasting colors and a small place to stand in front. Keep it readable at **96 px**, with 160/192 px relationship/detail previews. No default humans or dominant NPCs; character-like eyes and bookworms are motif-specific exceptions. No unrequested lettering; preserve meaningful user-requested signs and symbols. Doors stay physically closed unless explicitly requested open; don't substitute a vortex/portal for a door.

**Avoid same-everywhere moon arch, purple stone, crystals, lantern and ornament stack**: force variation in structure axis, door mechanics, terrain, palette and narrative accent. Keep moss/water/rocks/pipes/books as the small real setting, not an invented display plinth. True transparent PNG alpha, no black/checker/white baked background, no halo or cutout fringe.

## Generation & batch semantics
- Count N is N **fresh independent native image jobs**, one subject per call, except when user specifically asks for a composite sheet as final art (then count actual jobs honestly). Each subject needs distinct ID, positive anatomy, anchor/contact/accent, biome, mood, axis, palette and explicit allowed exceptions. A single generated sheet yielding 8 crops is 1 job + 8 crops, NOT 8 independently generated scenelets.
- Use the host image generation tool when available. Do not use old generated images as edit parents for new motifs. Record `gen_id`, `parent_gen_id`, input image pixel evidence if any, original PNG hash and prompt. A reference URL alone is not proof the generator was image-conditioned.
- After originals are evaluated and clean-alpha, assemble a **derived** contact sheet: 4→2×2, 6→3×2, 8→4×2, 12→4×3, without discarding or replacing originals.
- When a generation repeats the same composite/wrong-subject defect twice, preserve full receipts and quarantine that specific seam. Do not claim cropped images were fresh jobs.
- Georg's visible PASS for a shown variant is not yet private GitHub binary archival, technical alpha review, gameplay placement, Asset Librarian registration or Live acceptance.

## Standard outputs
`originals/SCN-001.png`…`originals/SCN-NNN.png`, complete per-motif prompt/receipts, `popup_tags.json` (region, biome, mood, element, size), `contact_sheet.png`, 96/160/192 previews, `QA_REPORT.json` and one Return. Use the existing private owner `georg-doc/KFB-Stunt-Car-Race` and current `assets/popup-r1` with existing WS0 placement catalog; never invent meter sizes or create a parallel registry. No public Stage for private prompt/asset work.

## One-message start
“Nutze **KFB Claymation Scenelets** im vorhandenen Asset Scene Composer. Thema: {THEME}, Anzahl: {N}. Plane N visuell unterschiedliche Mini-Szenen; starte N eigenständige Bildjobs mit je EINEM Motiv und echtem Alpha, erstelle anschließend einen {GRID}-Kontaktbogen. Stil wie die KFB-Knet-Pop-ups, kleine surreale Environment-Kontakte, ohne dominante humanoide Characters; prüfe Original/96/160/192 px, speichere Tags und QA, melde getrennt Generated / Design PASS / GitHub Archived / In-Game. Lies zuerst das private GitHub-Profil.”

For quick topic families and negative criteria read `references/prompt-seeds.md`. Do not silently generate before the user requests imagery.
