# KFB Black Ink Blob Monster · Visual DNA and Production Prompt System v1

## A. Immutable visual DNA
1. **Goo body before costume.** Full-bodied footless black-purple ink-splat, one continuous irregular squishy base with 3–8 round lobes / splash fingers / small floating droplets. Never legs, shoes, trousers, sliced-off humanoid torso, pedestal or a clean horizontal severed base. A rounded grounded blob with transparent air around it, not a vertical bust.
2. **Face is the actor.** Broad expressive cartoon eye pair (usually warm red/orange, sometimes wide cream eyes), brows/lids sculpted into goo; toothy gaping mouth with irregular cream fangs. Vary eye size, pupil direction, lid tension, mouth opening, missing/odd teeth, gaze and expression between every slot. Expression isn't limited to angry smirk.
3. **Wet ink meets handmade clay.** Near-black charcoal and dark violet plasticine, nuanced mottled finger-pressed texture, rounded finger-tool marks, soft imperfect edges. Subtle moist ink highlights, **not** mirror-plastic, chrome, human skin, fur, fuzz or flat vector artwork. Props may use muted cream, gold, violet, red, moss green, teal, limited neon.
4. **Readable at small size.** At 96 px: recognizable distinct contour, eyes, mouth and one theme signal. Avoid tiny props, ornate scenes, dense mesh detail or copy-paste six faces.
5. **Cartoon autonomy.** Distinct personal story, recognizable archetype, satirically strange but not generic joke labels. No repeated face/camera/pose or automatic accessories. Keep character identity when the props are hidden.
6. **Presentation.** Full actor in each cell, consistent frontal or gentle 3/4 clay studio camera, soft top-left illumination with warm accents, no environment, floor, cast-shadow disc, background gradient, panel border, caption, title or HUD. Transparent **RGBA bytes**, not a pictured checkerboard.

## B. Variation controls / twelve-slot plan
Before the two jobs specify for each slot:
`characterId, tier, archetype, outlineShape, widthHeightClass, gaze, eyelid, mouthAction, dropletCount, oneOddity, costumeCue, paletteAccent, pose, mood`.
Aim for deliberate silhouette variety (wide squat / compact / taller splat), gaze variety (L / R / up / down / frontal / cross-eyed), mouth variety (laugh / sigh / ooh / open scream / toothy grin / grumpy underbite), plus contrast of elderly, young and neutral-read figures when the family requests it. Avoid implicit “every character has huge hostile eyebrows”.
Use a real twelve-slot roster, no palette-swap duplicates. Do not claim a prompt guarantees that the generator obeyed exact geometry.

## C. Tier grammar
- **L0 / Core low-level:** zero accessories by default. Personality comes from goo morphology, eyes and mouth. Female-read can use the tiniest sculpted eyelash, wave-like goo quiff or posture. Elderly female-read uses soft cream/grey clay wave-bun/wrinkle contours; a headscarf or tiny spectacles are optional *single* identity clues, not full human costume. Younger = expressive, varied, more kinetic, not clones.
- **L1 / Special:** one or two motifs maximum; helmets, tools, headset, badge, scarf, goggles or one themed prop. Keep full lumpy goo perimeter and tapered splat tips visible. Props may never create the impression of a jacket ending at a waistline. A tiny goon still reads as goo after removing the equipment.
- **L2 / Lost/Leader:** an iconic story can combine 2–4 carefully selected symbols: philosopher, historical satiric figure, guru, spy chief, banker, occult cult leader, astronaut etc. Keep the mouth, eyes, goo-lobes and the continuous splat base foremost. Dramatic cloth/collar can wrap around goo; no anthropomorphic torso that ends in a straight cut. Archetypal irony is visual rather than a mere label.

## D. First sheet prompt · copy-ready EN
```text
NEW IMAGE JOB. Produce exactly ONE 1536x1024 game-asset PNG sprite sheet, 3 COLUMNS by 2 ROWS, EXACTLY SIX DISTINCT characters. This is SHEET 1 of the twelve-character KFB BLACK INK BLOB MONSTER family: [FAMILY]. Tier: [L0/L1/L2]. The six roles/personality slots, reading left to right, top to bottom:
01 [NAME / silhouette / gaze / facial acting / defining idea]
02 [...]
03 [...]
04 [...]
05 [...]
06 [...]

VISUAL FAMILY DNA: each actor is a COMPLETE FOOTLESS BLACK INK SPLAT / GOO MONSTER, not an amputated humanoid bust. Lumpy irregular dark charcoal-violet plasticine body with multiple thick round splash arms/lobes integrated into the body, a few detached ink droplets, enormous expressive cartoon eyes, sculpted brows/lids, huge mouth and uneven oversized ivory teeth. Handcrafted stop-motion claymation, subtle fingerprints and slightly wet ink highlights, saturated but constrained accents; soft top-left studio light. Keep faces very different and silhouette/height/width varied. Absolutely no legs, feet, boots, human lower torso or abrupt horizontal waist cut. Level [L0: no props / L1: 1-2 cues / L2: iconic props secondary to the complete goo body].

Exactly six fully visible figures, one per independent grid cell with generous empty gutters: at least 8 percent free safety margin within EACH cell. No overlapping or touching between cells, no clipping, no extra figures. Individual outlines are isolatable at 96 pixels. TRUE transparent RGBA pixels (not a white/grey/colored/checkerboard picture), no floor, no contact shadow disc, no vignette, no scenelet, no text, no labels, no title. Deliver ONE sheet only.
```

## E. Second sheet prompt · separate job · copy-ready EN
```text
NEW IMAGE JOB. SHEET 2 of [FAMILY], six DIFFERENT new KFB black ink blob monsters, slots 07-12, EXACTLY three columns by two rows, isolated on real transparent RGBA. Match the visually verified source sheet 1 [ATTACH A REAL APPROVED SOURCE SHEET IF AVAILABLE]. Preserve the 100% footless goo-splat body, clay surface, oversized eyes/mouth, soft camera/light, and tier [L0/L1/L2]. New roster:
07 [...]
08 [...]
09 [...]
10 [...]
11 [...]
12 [...]
Increase silhouette and facial-acting diversity without merely recoloring, flipping or relabeling the six old faces. Keep rounded ink base fully visible, no severed torso, props secondary. Every character inside its own safe cell with 8% empty margin, NO overlapping, no text, no background/floor/shadows, no extra figures. Render exactly one 3x2 PNG sheet.
```

## F. Single character correction / isolation
```text
Using this visually verified original KFB ink blob as the source, reproduce ONE actor alone in a 512x512 square transparent RGBA sprite. Preserve its exact dark handmade goo body, eye and tooth expression, original proportions and accessories. Only fix [CROP / ALPHA / EYE GAZE / SILHOUETTE / HALO]. The entire footless splat stays visible. No new outfit or generic substitute; no background and no floor.
```

## G. Negative QA anchors
“No severed torso, no trousers/boots/feet, no humanoid shoulders ending at waist, no face floating in an outfit, no uniform grin, no identical angry red pupils, no flat logo badge as punchline, no dense narrative scenery, no mass-produced plastic or shiny glossy CGI, no clean perfect symmetry, no hard cut silhouettes, no floor/contact shadow, no background matte/checkerboard pixels, no 4x3 single master with interwoven characters, no accidentally shared props crossing grid cells.”

## H. Prompt provenance and model honesty
This is a **reconstructed reusable recipe**, based on visual PASS and surviving chat requests/outputs, **not** a purported verbatim original ImageGen prompt, checkpoint, stable seed or reproducible engine setting. Store the actually used prompt, tool/model/date if available, output bytes and individual user verdict **for future jobs**. A fresh image job is normal for each new series; don't re-render an accepted family just to manufacture technical consistency.
