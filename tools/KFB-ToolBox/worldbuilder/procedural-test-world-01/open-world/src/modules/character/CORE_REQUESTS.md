# CORE_REQUESTS — character

No change to `src/core` is required for the character to work. Requests (nice to have):

1. **No CHAR_SCALE change.** Travel-tempo study (see NOTES.md table): making the walk ≥ 1.5 m/s would need
   CHAR_SCALE × 1.57 (Knight ≈ 3 m vs door ≈ 2.4 m). Chosen instead: run is the default gait (Running_B 4.30 m/s).
2. **docs/LESSONS.md — add under "Character / animation"** (measured in this build, Rapier 0.21):
   - KCC: a grounded move with a downward component stalls on flat convex hulls (cast hits the floor at toi≈0, the
     remainder is dropped). Request purely horizontal moves when grounded; snap-to-ground keeps contact.
   - KCC autostep did not climb 0.3–0.4 m hull/cuboid risers in the game world (works in an isolated world);
     KayKit tile hulls built from the asset vertices have a 45° bevel on the top edge. Use clean prisms for tiles and
     a custom step-up (character module does).
   - KayKit stance speed is not constant (Walking_B 0.3–1.5 m/s within one stance): drive the body with the
     foot-contact root-motion curve, not the mean speed. Running_B's right toe grazes the ground mid-swing for two
     samples — drop stance runs shorter than ~4/128 of the cycle.
   - Natural speeds at CHAR_SCALE 0.75: Walking_A 0.66, Walking_B 0.955, Walking_C 0.45, Running_A 2.49,
     Running_B 4.30 m/s (the 0.6565 / 3.177 / 3.880 figures in LESSONS were not reproduced).
3. (done by integrator: HMR off, `--sheetCrop`, `ctx.getCameraOverride()` — thanks; the character uses the latter.)
4. Player gravity: the character uses core GRAVITY × 1.6 (−38.4) locally (`GRAV_MULT` in player.ts) for a snappy
   0.53 s jump. If the integrator prefers one global value, set core GRAVITY = −38.4 and GRAV_MULT = 1.

---
**Integrator 2026-10-06:** #1 LESSONS updated. #2 HMR disabled on the dev server + shoot.mjs flags `reloadedMidRun`. #3 `--sheetCrop N` added.

5. **Hand item assets (r2).** `src/modules/character/items/` holds 9 KayKit Adventurers item gltfs (+ .bin + 5 textures,
   ~260 KB) loaded via `import.meta.glob('?url')`. That works in dev, but a production `vite build` will most likely not
   copy the `.bin`/`.png` files the gltf references (not built/verified). Request: add a pack to `tools/copy-assets.mjs`
   `items: { src: 'KayKit_Adventurers_2.0_FREE/Assets/gltf' }` limited to sword_1handed, shield_badge_color,
   axe_1handed, shield_round_barbarian, staff, bow, dagger, crossbow_1handed, spellbook_closed (+ their textures),
   regenerate manifest/ASSETS.md; the character module then switches `ITEM_URLS` to manifest ids and deletes `items/`.
