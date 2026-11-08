# KFB ChronoLoom R0 — Tzolk’in-inspired Fractal Almanac / Time Lens
2026-11-08 · source-backed BOUNDED_SLICE · design/prototype · NOT production integration.

## One owner, outcome, route
- **Owner:** existing KFB Fractal Almanac / Infinite Canvas design line at `skills/chat/masterplan/FRACTAL_CANVAS_NARRATORS_AND_PLAY_2026-09-14.md`. The Fractal Almanac's future runtime receiver remains the existing World/Town/Almanac owner, not this prototype.
- **Repo:** `georg-doc/kayfabizarro`; **branch:** `feature/fractal-almanac-tzolkin-time-lens-r0-2026-11-08`.
- **Outcome:** an actual pure JS 260-state calculation, four-level deterministic fractal addressing, time-move request objects, 20 distinct original editable SVG motif sources × 13 KFB phase markers, and a source-isolation diagnostic page.
- **Protected:** World R4 STOP, no world geometry/runtime modifications, no second portal/save/memory/datetime renderer owner, no KFB HUD replacement. Site/Cloudflare not in scope.
- **Done:** verify each file/branch head, run countable functional tests, isolate shape sources before any final skin/composition. No public or human visual acceptance asserted.

## Origins, separated clearly
1. Historical Tzolk’in: one 13-number and one 20-name cycle advancing together, repeating after 260 days. Gregorian-to-Tzolk’in correlation needs an explicitly adopted epoch and has **not** been defined here.
   - Smithsonian/NMAI: https://maya.nmai.si.edu/sites/default/files/resources/The%20Maya%20Calendar%20System.pdf
   - Mathematical Association of America: https://old.maa.org/press/periodicals/convergence/maya-cycles-of-time-maya-calendrics
   - Maya Archaeologist Dr Diane Davies: https://www.mayaarchaeologist.co.uk/public-resources/maya-world/maya-calendar-system/
2. User's video inspiration: https://www.youtube.com/watch?v=lXjNlJoGySQ — metadata/transcript **not accessible/verified** in this research pass; do not attribute specific theories or visual motifs to the video.
3. Modern Dreamspell / 13-Moon / Galactic Activation Portal concepts are **separate, later reinterpretations**. Not implicitly historical Maya calendar canon, and not imported into this prototype.
4. KFB adaptation: fractal nesting, 20 action verbs, 13 staging marks, world-state resonances, replay/portal desires and icon art are **original KFB design proposals**, not historical assertions. The 20 SVG silhouettes are original and **not copied Maya logograms**.

## Three interactions
- **Resonance Shift:** shift a read-only kin marker and ask the current lighting/audio/event/scene owners for a reversible alternate presentation. Can be purely cosmetic. Does NOT alter world time or historical saves.
- **Memory Revisit:** request an authoritative existing snapshot/Almanac memory by `snapshotRef`; replay if and only if the memory/save owner permits. A kin number is not evidence a historical snapshot exists.
- **Chrono Portal:** request a state-preserving transfer to a named existing destination instance via its portal/instance owner. `destinationRef` required. No fabricated destination scene or free teleport.
All requests are `REQUEST_ONLY`—no execution function is present.

## Fractal addressing
Canonical address: `[worldStep, dioramaStep, cardStep, memoryStep]`, each an integer coordinate with its own 260-cycle `kinAt`. The repeated operation is select/shift/revisit/recombine, not a claim of strict geometric fractal similarity.
- `shiftLevel([...],level,+13)`: same **tone**, changed **sign** at exactly one narrative scale.
- `shiftLevel([...],level,+20)`: same **sign**, changed **tone** at that scale.
- `shiftLevel([...],level,+260)`: same pair but **new cycle index** at that scale.
- This is independent of the real-world clock; dates and birthdays are not silently converted.

## Icon grammar & design
- `chronoglyphs.mjs`: 20 original source-editable 128×128 SVG contour motifs based on editorial prompts. A ring of 1–13 low-profile KFB marks indicates phase. Background remains actually transparent, no tile or generic HUD chrome, no pseudo Maya glyph authenticity.
- Present art status: **silhouette study only**. It does not claim Claymation output, KFB source donor appearance, authentic Maya epigraphy or Georg visual PASS.
- WS0 can read the precise SVG shape as an isolated donor and replace flat contour with the existing matte handmade KFB clay/ink language after viewing actual source objects and selecting references. Use current approved KFB palette, not invented mapping from D6 colors.
- Avoid automatic 260-image production until 2–3 distinct silhouettes pass source-backed visual comparison. Repeated unique SVGs are data outputs, not final characterful art.

## Reuse & intersections
- Existing KFB memory/canonical Card provenance remains the only true history source.
- Existing World/Travel camera/terrain/instance and portal owners remain authoritative; no R4 reopening.
- Existing P30 VFX Sun Arc research in `georg-doc/KFB-Stunt-Car-Race` Draft PR #92 is a **possible later visual connector** for a time portal; it is not installed or relabeled into this owner.
- No new SoundEngine or new alternate HUD layer.

## Reality of implementation
- Implemented in this branch: `chronoloom-core.mjs`, `chronoglyphs.mjs`, `chronoloom.test.mjs`, `isolation-preview.html`.
- Expected native command after checkout: `node --test skills/chat/masterplan/tzolkin-chronoloom-r0/chronoloom.test.mjs`.
- Direct file opening in a browser may reject ESM; use the repo's normal local HTTP development server for isolated technical previews. This is NOT a KFB public/Stage test URL.
- Known tested: in-process V8 execution of the 19 checked-in test bodies with a compatible assert adapter against the actual fetched GitHub module source — 19/19 PASS. Native Node CLI and browser render not yet run in this environment.

## Single next gate
WS0/WSA: open the isolated current `isolation-preview.html` against the real source SVGs, compare **three** visibly different motifs to an already-approved KFB clay/ink style donor (first show original source objects separately); return three screenshots and KEEP / TUNE / REJECT for a compact ChronoGlyph family. Then hand any accepted look to the actual Fractal Almanac owner. No unapproved world-runtime branching.
