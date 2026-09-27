# KFB Streckenbauer (live track builder) · 2026-09-27

**Georg (27.09):** "Live-Bau-Panel jetzt gerne". The idea comes from the reference analysis: the Race Track Builder's piece inspector, rebuilt on top of our core.

**Artifact:** claude.ai artifact "KFB Streckenbauer" (private, Georg's gallery).
**Files:**

| File | Role |
|---|---|
| `index.html` | the page |
| `track-core.mjs` | core v0.8.1, unchanged copy |
| `stream-to-three.mjs` | loader v2 |
| `worker.mjs` | compiles and runs the checks off the main thread |
| `presets.json` | sandbox, TD03, TD05, showcase seed |

## What it does

- A piece list with a start row. Adding a piece after the selection uses these groups:
  - straight and curves: Gerade, Kurve, Kehre, Spirale, S-Versatz;
  - height: Kuppe, Mulde;
  - stunt: Kicker, Luft, Landung, Looping;
  - width and connection: Breitenwechsel, Anschluss.
- Move, duplicate and delete pieces; undo and redo.
- The inspector has sliders and number fields per piece parameter, optional "auto" fields (ease, bank, loop drift), and the section attributes: width to, marking, skin, tunnel (preset or shape, or leave), drive mode + fx, and the `crossing_ok` tag.
- **Live recompile** on every edit: a web worker runs `compileRecipe` + `runChecks`. The 3D view uses three.js from jsdelivr with orbit controls and shows:
  - the track, markings and tunnel tubes;
  - the selected piece highlighted;
  - failing checks as markers; clicking a check jumps to its place.
- Camera: fit all, focus the selected piece, driver view at the piece start.
- The recipe JSON can be shown, copied or pasted in (paste loads your own recipe). The draft is kept in this browser's local storage.

## Limits

- Single-route recipes only. Graphs (FORK / JOIN branches, TN01 / TN02, FS01) are not editable yet.
- `CONNECT` works with explicit targets; named anchors are shown but not editable.
- Extra fields such as `params` (profile changes) are shown read-only and can be edited in the JSON.
- Downloads are blocked inside artifacts, so export goes through the clipboard or the JSON field.
- The page was tested locally in headless Chromium (light and dark theme, one edit round-trip). The published page's first load in Georg's browser is not verified yet.

## Field size (Georg 27.09)

SP13KTRA runs 8 craft (README: "Race eight anti-gravity craft", "eight rival craft, one colour … each"). Georg: 6 is also fine, depending on performance.

- **Proposal:** design widths and choke points for up to 8 cars; the runtime default is 6 until performance is measured.
