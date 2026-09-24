# RETURN · KFB VFX-01 · Donor Census + Interactive VFX Review Bank

Status: **REVIEW ARTIFACT DELIVERED · GEORG GATE OPEN**
Slice owner: this chat (Claude Design), per `FRESH_CHAT_SLICE_PROTOCOL.md`
Source of truth for exact pins: `github.md` at the project root (Sync history has every commit/blob touched this slice)

## 1. What was actually pulled from GitHub (not just named)

Every donor family below was opened, verified to exist at the exact path, and has real files copied into this project — nothing here is reconstructed or invented.

| Family | Repo path | What's shown |
|---|---|---|
| Brackeys VFX Bundle | `kayfabizarro@main` `media/3D_Assets/FX_Visual/brackeys_vfx_bundle/` | 3 predrawn sheets (animated, real sheet row) + **all 13 named `particles/opague/` families**, each cycling its real numbered variants: muzzle(5), slash(4, shown as static variants not frames), flame A(01–04)/B(05–06) as 2 separate loops, fire(2), smoke(3, static variants), dirt(3, static variants), scorch(3), light(3), effect(3), magic(2), circle(5), flare(1, static), scratch(1, static) |
| FreeHitVfx (Godot) | `media/3D_Assets/FX_Visual/FreeHitVfx/` | the 1 real texture, animated via a CSS curve that mirrors the actual ported shader math (pop → white-hot → dissolve) |
| free-cartoon-smoke-effects-asset-pack | `media/2D_Assets/free-cartoon-smoke-effects-asset-pack/` | 5 families, each cycling 5 real sampled frames |
| Tiny Swords · Particle FX | `media/2D_Assets/Tiny Swords (Free Pack)/Particle FX/` | full 8/8 files, grouped correctly by type (Dust, Explosion, Fire) not mashed together |
| explosions_smoke | `media/3D_Assets/FX_Visual/explosions_smoke/` | real animated `.gif` (not the static preview PNGs) |
| kenney_smoke-particles | `media/3D_Assets/FX_Visual/kenney_smoke-particles/PNG/**` | followed to the actual leaf files (77 enumerated), 5 sub-effects each animated from 5 real sampled frames |
| KFB Combat Ink-Atlas + VFX Recipes | `KFB-Combat-Arena@main` `modules/{kfb-vfx-recipes.js, kfb-combat-atlas.js, kfb-fx-sprites.js}` | the ink-atlas canvas is a live, faithful port of the actual drawing routine — not a screenshot |
| Boxel Blitz Audio-Feedback POC | `KFB Boxel Blitz/audio-feedback-poc/` | context screenshot + full source pin |

**Honest gap (not hidden):** `kfb-fx-flame.js`, `kfb-fx-trails.js`, `kfb-hit-response.js`, `kfb-combat-cues.js`, `kfb-combat-def.js` are pinned by exact name/size/blob in the review card but were **not opened and read** this slice — only `kfb-vfx-recipes.js`, `kfb-combat-atlas.js`, `kfb-fx-sprites.js` were. If the next slice needs those five, read them fresh — do not assume this census covers their content.

Also spotted but explicitly out of this slice's named scope: `VFX Mysterious Objec - 192x192/` (20 pipo-* frames) and `Beams_BinbunVFX/` (1 texture) — listed in the review's footer, not inspected.

## 2. What was in the original briefing, and where it stands

| Briefing item | Status |
|---|---|
| Donor census, real textures first | **DONE** — see table above |
| Show donor family buttons | **DONE** |
| Show semantic class | **DONE** — per-family tags + the full `kfb-vfx-recipes.js` grammar (muzzle/travel/surface/cascade) |
| Diagnostics hidden by default | **DONE** — toggle, off by default |
| No gameplay dependency | **DONE** — static/interactive review only |
| `SOURCE_REQUIRED` instead of reconstructing | **DONE** — 4 items flagged (see review page callout) |
| Ask Georg: which families feel KFB / which reject / which 3–5 recipes to promote | **OPEN — this is the actual next decision, not a technical task.** The review page has live checkboxes + a copyable summary for this. |
| SFX implementation | **DEFERRED to next slice**, as the original brief specified |
| No Cloudflare / no WSA / no merge/Live | **Respected** — nothing was published or promoted |

## 3. Files in this handover

- `KFB_VFX_01_REVIEW.dc.html` — the review artifact itself (also live in the project root)
- `github.md` — exact sync receipts for every GitHub read/copy this slice
- `POSTMORTEM.md` — the real bugs hit while building this, root causes, fixes
- `BUILD_GUIDE.md` — reusable how-to for this exact kind of animated donor-review page in this environment
- `FIVE_MORE_IDEAS.md` — 5 concrete VFX-pipeline ideas beyond what's already in the repo

## 4. Exactly one next gate

**Georg's 3-question human gate on the live review page.** Nothing else should move until that answer comes back — per the slice protocol, this chat does not promote, merge, or start SFX work on its own judgment.
