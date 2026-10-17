# kfb.figure/1 · one card per figure · R1 (WS0, 17.10.2026, V-391)

**One source of truth per character:** `figures/<id>.figure.json`. A figure is body + KFB eye rig in Georg's saved setting + clay. The card holds everything a stage needs. Nothing else is loaded.

## Fields (machine schema: `kfb.figure-1.schema.json`)
| Field | Content |
|---|---|
| `schema`, `id`, `displayName`, `aliases[]` | `"kfb.figure/1"`. `id` is snake_case and equals the file name. Aliases are the ids used elsewhere (voice casting, recipes, Lab). |
| `role` | `protagonist` · `npc` · `performer` · `prop-actor` |
| `body` | `glb {repo, ref, commit, path, blob, sha256, bytes, onMain}`. This is the face-ready GLB. Other fields: `rawSource` (the original KayKit/Meshy file, **never** loaded by itself), `rig`, `scale {value, basis, source}`, `variants[]`. |
| `originals` | `remove[]` and `keep[]` as **explicit** lists of node/island names, plus `method` (`baked` · `switchable-node` · `runtime-texture` · `none`). **Default: only the original eyes are removed.** Mouth, teeth/tusks, brows, nose, glasses and accessories are always in `keep`. Any other removal needs a `vRef`. |
| `eyeRig` | `required` (default `true`), `version` (`pet-eye-rig.v6`), `module {path, blob}`, `seat` (`anchored` · `headpart-socket` · `facehost`), `anchors` (node names + `pos/normal/r` per eye), `lid {type E2 \| skin \| socket-shell, colour, colourMode, fit}`, `irisColour`, `pupil {style, size, gloss, form}`, `settings` (dx, dy, ring, track, inset, converge, splay, oval, lashes, blink, life, emotes, …), `source` (file#path + who/when), `alternatives[]`, `todo[]`. To show a figure without the rig, the card must say `eyeRig: {"required": false, "none": {"reason", "by", "vRef"}}`. |
| `brows` | `owner` (`original-mesh` · `browrig-v2` · `off` · `planned`) + values |
| `mouth` | `owner` (`original-mesh` · `decal-set` · `planned`), `set` (id from `mouth_sets.manifest.json`), `anchor`, `rest`, `visemeMap`, `tint` |
| `appendages[]` | `{id, type ear \| antenna \| eyestalk, bone, side, stiffness {stiffness, damping, maxDeg, …}}`. `side` always comes from the card, never from the node name (V-332). |
| `material` | `clayProfile` (`figure-fine`, V-053/V-340), `sheenMax ≤ 0.05` (V-385), `canon`, notes |
| `voice`, `performance` | Kokoro spec or Suno stem role, plus performance hints (V-086, V-324, V-365) |
| `approval` | `status approved \| candidate \| open-design`, `by`, `date`, `vRef[]`, `parts {body, originals, eyeRig, mouth, material}` (status + evidence for each part), `missing[]` |
| `provenance[]`, `todo[]` | Every value can be traced to a found file (path + ref/sha). Unknown values are `null` and get a `todo` entry. |

## Rules (binding once accepted)
1. **Cards only.** Stages, proof pages, the ToolBox import, WSB renders and videos load **only** `figures/<id>.figure.json`. They never load a raw KayKit or Meshy GLB, and never load a `*_NoEyes.glb` without its card (F8, V-219).
2. **No card, or no eye rig → visible refusal.** The loader refuses the figure when:
   - the schema is not `kfb.figure/1`;
   - `eyeRig` is missing;
   - `eyeRig.required` is false without `none.reason`;
   - the body sha256 does not match;
   - `material` is missing, or `sheenMax` is above 0.05.

   The figure's slot then shows a red sign, `FIGURE REFUSED · <id> · <reason>`, instead of quietly rendering anything (F1). A QA test runs every card through the loader.
3. **Remove only what the card lists.** The default is "eyes only". Anything else counts as a failure: lost teeth, a different mouth, missing brows (F2).
4. **Always clay.** Every proof and stage image uses `material.clayProfile` (V-346.6, F3).
5. **Status gate (proposal, Georg to confirm):**
   - `approved`: allowed everywhere.
   - `candidate`: allowed in proofs, the Figure Workshop and staging, with a "candidate" tag *outside* the image (V-383).
   - `open-design`: Figure Workshop only.
6. **Georg's saved setting wins.** When the Figure Workshop exports a setting, that export replaces `eyeRig.settings`, `mouth` and `brows` 1:1, and `approval` records who, when and which vRef. No other agent writes values over it (V-240).
7. **Changes to `body` or `originals` happen in Blender (WS0/WSB), never at runtime** (V-336). Hiding a whole separate node (`switchable-node`) is allowed. Repainting a texture at runtime (`runtime-texture`) is only a temporary measure and stays in `todo`.
