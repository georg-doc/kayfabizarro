# BUILD GUIDE · Animated Donor-Census Review Pages in this DC Environment

A practical recipe, distilled from building `KFB_VFX_01_REVIEW.dc.html`. Use this instead of re-deriving the same five bugs.

## Rule 1 — never put a hole inside `src`

```
WRONG:  <img src="{{ item.src }}">                (silently 404s, no error)
RIGHT:  hardcode one literal <img src="media/x.png"> block per state,
        and gate which one shows with sc-if on a boolean from renderVals()
```

This applies even to `sc-for` over a data array — the loop variable name is not the problem, `src` itself is.

## Rule 2 — `ref` doesn't attach to plain elements

```
WRONG:  <canvas ref="{{ someRef }}">   (ref.current stays null forever)
RIGHT:  <canvas id="my-stable-id">
        ... document.getElementById('my-stable-id') whenever you need it,
        with a small setTimeout retry loop for first-mount timing.
```

## Rule 3 — don't trust `componentDidUpdate`

Trigger side effects (like a canvas redraw) from the actual event handler that causes the transition, not from a lifecycle hook. If you must have a mount-time effect, use `componentDidMount` (that one does fire) plus the same event-handler trigger as a belt-and-suspenders pair.

## Rule 4 — use `setTimeout(fn, 0)`, not `requestAnimationFrame`

rAF can silently never fire in this preview sandbox. `setTimeout` does not have that problem.

## Rule 5 — pure-CSS flipbook for N real frames, zero JS state

Stack N real `<img>` tags absolutely inside one `position:relative` container, each with the SAME shared keyframes and a different negative `animation-delay`:

```css
@keyframes kfbFlipN { 0%,(100/N - 1)% { opacity:1; } (100/N)%,100% { opacity:0; } }
```

Each image: `animation: kfbFlipN <N*STEP>ms steps(1) infinite; animation-delay: -(i*STEP)ms;`

No JS timer, no `src` hole, survives hot-reload, costs nothing at runtime. This is the technique used for every multi-frame donor family in the review.

## Rule 6 — pure-CSS spritesheet-row animation for one packed sheet image

```css
.cell { background-image:url('sheet.png'); background-size:<cols*100>% <rows*100>%;
        background-position:0% 0%; animation:kfbSheetN <dur>ms steps(<cols>) infinite; }
@keyframes kfbSheetN { from{background-position:0% 0%;} to{background-position:-<(cols-1)*100>% 0%;} }
```

Shows the real top row of a packed sheet with zero extra downloads — reuses the one sheet image you already have.

## Rule 7 — verify grouping/sequence visually before animating

Before writing any flipbook/cycle markup for a numbered family (`x_01, x_02, …`), open every frame with an image viewer and confirm they are actually the same subject over time. Filename numbering is not proof of sequence — see Postmortem Bug 5.

## Rule 8 — verify success with real pixel/DOM data, not just "no console error"

`getImageData` on a known pixel, or `element.id / offsetWidth / getAttribute`, not just "the screenshot looks plausible." The screenshot tool in this environment cannot reliably capture `<canvas>` content — a blank-looking screenshot is not proof of failure, and a plausible-looking one is not proof of success either.
