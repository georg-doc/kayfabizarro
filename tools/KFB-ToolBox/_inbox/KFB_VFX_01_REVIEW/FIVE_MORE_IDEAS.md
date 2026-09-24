# FIVE MORE IDEAS · Beyond the Current Repo Content

Concrete, not generic. Each one names the exact existing KFB piece it would attach to.

## 1. A material→cell binding table, so new weapons never need new art

`kfb-vfx-recipes.js`'s `SURFACE` table already names abstract cells (`burst`, `star`, `spark`, `ring`, `arc`…) that `kfb-combat-atlas.js` draws procedurally. Now that real donor textures exist for most of those same names (Brackeys `muzzle_0X` for muzzle, `circle_0X`/`light_0X` for ring/spark-adjacent shapes, `smoke_0X` for smoke), a small lookup table could let ONE recipe drive either the procedural ink-atlas or the real donor textures — a style toggle (KFB-ink vs. painterly) that costs nothing at the semantic layer, because the semantic layer never changes.

## 2. One shared hit-flash mask + hue rotation, instead of ten colored textures

FreeHitVfx's own preset pattern (`color_core`/`color_main`/`color_accent` on ONE white-on-black texture) is the exact trick that lets 10 different KFB weapons share one hit texture instead of needing separately painted art per weapon/element type. This is already proven in-repo (FreeHitVfx) and already partially ported (`kfb-fx-sprites.js`'s white-hot/dissolve curve) — the missing piece is applying the same one-mask-many-colors trick to the Brackeys `muzzle_0X`/`slash_0X` masks so a single texture covers every weapon's muzzle color via a runtime tint, not a new PNG per weapon.

## 3. A camera-shake budget fixture — the doc describes it, nothing builds it yet

`kfb-cartoon-animation_v2.md` §9.2 hard-limits camera actions to one per event and explicitly warns against stacking shake on minor hits. That rule currently lives only as prose. A tiny fixture (reuse the `MotionFixture` type already defined in the same skill doc) that flags any authored event exceeding its own `eventBudget.maxCameraActions` would turn a documented rule into something a QA pass can actually fail on.

## 4. Two donor packs worth scouting next, named by their own credit trail

The Brackeys bundle's own `LICENSE & CREDITS.txt` credits **CodeManu's full "VFX Free Pack"** (itch.io) as the source of the predrawn sheets currently in-repo — meaning the repackaged subset here (14 sheets) is very likely not the whole pack. Same file credits **Picster's Godot particle/VFX textures** (GitHub) as the alpha-mask source. Both are named, traceable donors one step upstream of what's already pulled in — worth a dedicated census slice of their own rather than assuming Brackeys' repackaging is complete.

## 5. A "same rig, two style layers" test using the Boxel POC as the harness

The Boxel Blitz audio-feedback POC already proves a clean event grammar (pickup/power-up/power-down/checkpoint/cascade) with a deliberately minimal visual (squash + one burst). That exact harness is a cheap place to A/B the KFB-ink atlas against the real donor textures side by side on the SAME events, before committing either style choice to Combat Arena — turning today's abstract "which donor feels KFB" question into a concrete side-by-side playtest instead of a static image comparison.
