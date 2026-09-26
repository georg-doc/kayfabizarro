# KFB × ClayBound · Work package draft for Web chat / WSA · 2026-09-26

**Author:** Claude Coworker (Blender lane).
**Status:** DRAFT. It is for Web chat / WSA to work out, split and approve. Nothing here is decided.
**Companion files:** `BLENDER_LANE_PLAN_CLAYBOUND_2026-09-26.md` (Blender side), `RESEARCH_ROUND_01_REVIEW.md` (corrections), NotebookLM Production Deck (running).

## A · Coworker feedback on the claymation direction

What I would keep, change and add, on top of the Round 01 review:

1. **Form carries the look; the material only confirms it.** ClayBound reads as clay first through rounded, slightly uneven *volumes* and soft silhouettes. Material comes second. For KFB that means the biggest lever is geometry (bevel, soft massing, slight asymmetry), and the shader must stay quiet.
2. **One family, three tiers, one truth.** The material must exist as Cycles look-dev, EEVEE preview and a baked GLB runtime. The runtime tier is the product, and the others serve it. Every deck value is a calibration seed until it has been measured on a KFB asset.
3. **Fake SSS in the web runtime:** use wrap lighting plus a warm terminator tint in the three.js Clay Lab (`onBeforeCompile`), not real subsurface. This is cheap, and it matches the soft "light goes into the clay" edge.
4. **Bake the cavity into AO.** Soft darkening in creases (the ORM R channel) sells hand-pressed clay more than any noise. It is baked once in Blender and costs nothing at runtime.
5. **Seed per object, always.** Repeated props (pillars, billboards, trees) must not share one pattern phase. `seed` goes into glTF `extras`; the Clay Lab reads it.
6. **Animation safety is a test, not a promise.** Tangent-space maps plus UVs for deforming characters; object-space or triplanar only for static scenery. The proof is a marker decal across two poses.
7. **No fingerprints, no stepped jitter as baseline.** Stop-motion character comes from acting and timing. It may come back later as an *optional* look layer.
8. **World consistency ("KlayfaBizarro"):** the same Clay Master on characters, scenery shells (SC01 bridge, SC02 supports), billboards and terrain, so the world looks sculpted as a whole. The palette stays seed-driven, as it already is.

## B · Proposed specs (for WSA to confirm or change)

### B1 · Contract `kfb.clay-material/0.1` (glTF extras on mesh or material)

```json
{
  "schema": "kfb.clay-material/0.1",
  "tier": "runtime",
  "seed": 1234,
  "relief": 0.35,
  "micro": 0.2,
  "mapping": "uv",
  "maps": { "baseColor": "…_bc.png", "orm": "…_orm.png", "normal": "…_n.png" },
  "texelDensity_m": 0.004,
  "source": "blender:KFB_ClayMaster@<commit>"
}
```

- `mapping` is `uv` for deforming meshes and `triplanar` for static scenery.
- Unknown keys are ignored by readers; the contract is additive only.

### B2 · Texture pack v0 (baked by the Blender lane)

- Four seamless 2k tiles: `clay_micro_n`, `clay_meso_h`, `clay_rough_var`, `clay_mottle_mask`.
- Each tile must pass: the half-offset seam test, no baked light, and a stated real-world scale.
- Target location (proposal): `media/3D_Assets/materials/clay_v0/` plus a manifest JSON.

### B3 · Runtime module (Web)

- Promote the three.js Clay Lab (`KFB ClayBound-Perplexity v1/main.js`) into `kfb-lib/clay-material.v1.js`.
- The module: `clayMaterial({seed, relief, micro, maps, mapping})`, with wrap-light fake SSS, the ORM AO cavity, and Vertex displacement off by default (hero meshes only).
- **Parity harness:** the same GLB, camera and lights in Blender T3 and in three.js. A screenshot diff is stored as evidence.

## C · Proposed slices and order

| # | Slice | Owner | Needs | Output |
|---|---|---|---|---|
| C0 | NotebookLM Production Deck | Georg / NotebookLM | running | deck, texture families, zone map |
| C1 | **CLAY-B0** Clay Master scaffold + texture pack v0 | Blender lane (Sonnet-able with the checklist) | none | node group, 4 tiles, eval rig, checks |
| C2 | **WEB-CLAY-0** contract + `clay-material.v1.js` + parity harness | Web chat | C1 tiles (can start on placeholder maps) | module, contract doc, Node / browser tests |
| C3 | **CLAY-B1** calibration on one KFB asset (copy only) | Blender lane | C0, C1, Georg's asset pick | T1/T2/T3 renders, swim test, GLB with extras |
| C4 | **Parity gate** | Web + Blender | C2, C3 | side-by-side evidence; Georg look PASS / TUNE |
| C5 | **CLAY-B2** scenery/world application | Blender lane | C4 PASS | SC01/SC02/billboards in clay, size budget |

Rules for all slices:
- No auto-merge, no Stage/Live without Georg's yes.
- Additive files only.
- Every slice returns defects first and exactly one next gate.

## D · Open decisions for WSA / Georg

1. The calibration asset for C3 (proposal: FrizzleBob v5).
2. The repo location for the texture pack and the module (proposals above).
3. Whether C1 may start before the deck lands. Recommendation: yes, because it is look-neutral.
4. The texel density target (proposal: 4 mm per texel on characters, coarser on scenery).

## E · Exactly one next gate

**WSA:** review this draft, split it into approved slices, and dispatch **C1 (CLAY-B0)** and **C2 (WEB-CLAY-0)**, or name what to change.
