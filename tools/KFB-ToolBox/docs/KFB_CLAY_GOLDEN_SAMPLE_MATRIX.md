# KFB Clay Golden Sample Matrix

Status: **CURRENT MATRIX v1.0**  
Parent: `KFB_CLAYMATION_STYLE_SSOT.md`

This matrix distinguishes accepted pixel references from implementation baselines and candidates. `GOLDEN` means the fixed comparison target. It does not mean every module inside that old scene must be copied into new runtimes.

| Family | Source object / scene | Golden evidence | Implementation path | State | Required next gate |
|---|---|---|---|---|---|
| Building master | KayKit `building_A` | K1 catalogue; FACADE-A/B-01 | K1 v8 exact comparison, then K2/v10 parity | **GOLDEN** | source · K1 · candidate, 6 m / 30° / K1 light |
| Building secondary | KayKit `building_E` | K1 catalogue | same house profile and preprocessing | **GOLDEN SUPPORT** | repeat after `building_A` passes |
| Mixed buildings | real OSM group + one Kenney building | S5 contract; WorldBuilder evidence | S5/WorldBuilder adapter | **PREPARED · NOT GOLDEN** | unchanged source + adapted + mixed street |
| Terrain | H0 brain-world overview/close | `05-h0-totale.png`, `07-h0-gelaende-nah.png` | H0 geometry/bake as visual reference; receiving world owns terrain | **GOLDEN** | near/traversal/far and silhouette/contact |
| Track/terrain palette | Joyride/World transition atlas | existing T4/Joyride clay-patch transitions | `transition-atlas.v1.js`, caller palette/seed | **CURRENT DONOR** | same seed across zone transition |
| Nature | K1 tree, bush, rock | K1 catalogue | `nature` profile + contact AO | **GOLDEN SUPPORT** | source/candidate close-up; no bright blob seam |
| Cloud anatomy | Jarlan Perez cloud GLB, blob `acd9d653…` | unchanged donor silhouette | compact prebaked clay family; shared geometry/instances | **SOURCE DONOR · TUNE** | donor isolation + front/side/3/4 + near/mid/far + 0/4/12/24 cost |
| Skydome environment | TinySkies Gradient + Travel Skydome + Combat Card-Spindle | pinned source-isolation gates E0–E2 | one `EnvironmentHost`, one active shell | **WIP CONTRACT** | E0–E4 hot-switch, atmosphere and leak proof |
| Street props | streetlight, trafficlight_A, firehydrant, bench | K1 catalogue | `prop` profile | **GOLDEN SUPPORT** | same scale/light, near and traversal view |
| Character Rig_Large | Black Knight | K1 catalogue | character-safe material, preserve skin/rig | **SURFACE REFERENCE** | neutral + motion A/B |
| Character Rig_Medium | Farmer A | K1 catalogue | character-safe material, preserve skin/rig | **SURFACE REFERENCE** | neutral + motion A/B |
| FrizzleBob | FB v5b | ToolBox Production-06 + Joyride J17 | existing face/eye/lid/ear/body owners | **CURRENT CONSUMER DONOR** | neutral + walk + seated, same lighting |
| Vehicle surface | KayKit taxi + police | K1 catalogue | `vehicle` profile | **SURFACE REFERENCE** | source/candidate with wheels/contact unchanged |
| Vehicle gameplay | KFB_CVP1_cabrio | Joyride J17 | J17 scale/seat/physics owners | **CURRENT GAMEPLAY DONOR** | clay surface + drive, no rig/physics rewrite |
| Clay particles | Resident/ToolBox particle profiles | isolated event evidence | existing clay-vfx/event consumers | **CANDIDATE** | land/impact/prop_break/drift sheet + gameplay proof |
| Billboard body | WORLD_BILLBOARD_CLAY01 r2 | current Tune design | B1/B2a surface/fit owners + r2 body donor | **TUNE DONOR** | island placement + 0/1/4/8/16 measurement |

## Fixed façade comparison contract

- asset: `building_A`;
- camera distance: 6 m;
- camera elevation: 30 degrees from above;
- light: K1 light;
- soften: `maxEdge 0.18`, max 3 stages, `maxTris 90000`;
- order: soften → seed geometry → material;
- material for exact Golden: `clay-material.v8`, `house` profile;
- K1 uniforms: Hand `0.5`, tile `1.6`, print `4.5`, scaled against the real object;
- no bend, no mega-mesh merge, no base-plate concealment before PASS.

## Fixed evidence layout

Each row of a comparison sheet is:

`UNCHANGED SOURCE | LOCKED GOLDEN | CURRENT CANDIDATE | CONTACT/EDGE CLOSE-UP | COST`

The cost cell reports triangles, draw calls, preprocessing time, texture/GPU estimate when available and visible frame timing in the receiving browser. A cost cell never replaces the images.

## Expansion policy

Only Georg can promote a `SURFACE REFERENCE`, `CURRENT DONOR` or `CANDIDATE` to `GOLDEN`. Promotion requires the exact source, the fixed view, an accepted image and a dated additive entry. Until then, consumers use the source as evidence without claiming a universal accepted look.
