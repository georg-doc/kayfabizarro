# POSTMORTEM · KFB VFX-01 Review Build

Every one of these was a real failure caught by the verifier or by Georg — not a hypothetical. Recorded so the next slice doesn't re-discover them at cost.

## Bug 1 — `<img src="{{ hole }}">` never resolves in this DC template system

**Symptom:** every donor image 404'd as the literal string `{{ img.src }}`.
**Wrong first diagnosis:** assumed the loop variable name `img` collided with the `<img>` tag name — renamed to `pic`, still broken.
**Real cause:** this environment's asset-serving layer rewrites relative `src` paths to a `/serve/<path>` route **before** template holes are interpolated. A hole inside `src` can never resolve, regardless of variable name or whether the value is static or dynamic.
**Fix:** every image now has a fully literal, hardcoded `src="media/...png"`, with per-family visibility controlled by `sc-if` booleans computed in `renderVals()`. No `sc-for` over an images array with a `src` hole — that pattern is a dead end here.

## Bug 2 — canvas `ref` never attaches

**Symptom:** the live ink-atlas canvas stayed at the browser default 300×150 and never painted, no matter the approach.
**Two ref strategies tried and both failed:** `React.createRef()` and a callback ref (`(el) => { this.atlasCanvas = el; ... }`) — neither ever received the real `<canvas>` DOM node.
**Real cause:** `ref` attributes on a plain (non-component) HTML element are not wired through by this template compiler.
**Fix:** gave the canvas a literal `id="kfb-vfx-atlas-canvas"` and looked it up with `document.getElementById()` at the moment it's needed, with a small retry loop for timing safety.

## Bug 3 — `componentDidUpdate` never fires despite real re-renders

**Symptom:** clicking a family button visibly changed state (button highlight, panel content) but no lifecycle hook logged, ever.
**Real cause:** this `DCLogic` runtime's update path does not invoke `componentDidUpdate`, even though it clearly re-renders on `setState`.
**Fix:** stopped depending on lifecycle entirely for this. The atlas draw is now triggered directly from the click handler (`setFamily`) at the exact moment the user causes the transition, not from a hook that may not exist.

## Bug 4 — `requestAnimationFrame` silently never fires in the preview sandbox

**Symptom:** even a bare `requestAnimationFrame(() => console.log('fired'))` never logged, with no error.
**Likely cause:** rAF is throttled/suspended in this sandboxed preview context (visibility-based throttling is the standard browser behavior for rAF in a backgrounded/inactive frame).
**Fix:** replaced every deferred-draw call with `setTimeout(fn, 0)`, which is not subject to the same throttling.

## Bug 5 — assumed frame-sequence semantics from filenames alone, without looking

**Symptom (caught by Georg, not by any tool):** `flame_01–06` was treated as one 6-frame loop; `slash_01–04` was treated as animation frames of one strike; `smoke_01–03` / `dirt_01–03` were treated as time-sequential frames. All four were wrong.
**Real cause:** numbered suffixes (`_01`, `_02`, …) in these asset packs mix at least three different intents — true animation frames (muzzle), unrelated directional/size variants (slash), and two visually distinct effects that happen to share one numeric range (flame: 01–04 = rounded blob, 05–06 = flame tongue — even the first guessed 3+3 split was wrong until the images were actually opened side by side).
**Fix:** stopped inferring; opened every flame frame with `view_image` and re-grouped by what's actually drawn. **Lesson for next time: never assume grouping/sequence from a filename pattern — view the actual frames before choosing an animation strategy.** The five families not yet corrected this way (`fire, effect, scorch, light, magic, circle`) are flagged in the review's diagnostics as carrying the same unverified risk.

## What this means for the next slice

- Treat `src`, `ref`, and lifecycle hooks in this DC runtime as **unreliable by default** — verify each with a real pixel/DOM check before trusting it, not just a "no console error" check.
- Budget one visual-inspection pass (`view_image` on every frame of every numbered family) into any future donor census — it is not optional overhead, it is the actual content of the census.
