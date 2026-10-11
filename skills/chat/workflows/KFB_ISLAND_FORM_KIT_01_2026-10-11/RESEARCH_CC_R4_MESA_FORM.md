# Coconino mesas · form research for R4 round 3 ("grown, not baked")

Date: 2026-10-11. Trigger: Georg's verdict on R4 rounds 1–2. The modules looked baked:
- columns pulled up to different heights, with a lid sitting on top;
- hex-plate thinking;
- straight white lines;
- sand made of glued-on balls.

Georg wants a natural terrain that follows how mesas actually grow and erode, read as a cartoon: thinning upward, Road Runner deserts, arches under mesas, and sand that behaves like sand.

## How real mesas get their shape

1. **One mass of flat-lying strata.** A mesa is a remnant of horizontal layers.
   - A resistant layer (sandstone, basalt) protects the softer rock below it.
   - The flat top is simply where that hard layer stops. It is not a separate plate on top.
   - Source: Wikipedia, "Mesa".
2. **Cliff-and-bench.** Hard layers form steep cliffs; soft layers (shale) form gentler slopes or benches between them. This gives the stepped profile. (Wikipedia, "Mesa".)
3. **Retreat by basal sapping.** Water removes the soft layer at the foot, so the cliff above collapses and retreats. Over time:
   - a mesa becomes a butte (smaller summit);
   - then a spire or pinnacle;
   - then it disappears.
   Source: Wikipedia, "Mesa".
4. **Monument Valley sequence, base to top.** Organ Rock shale, then the massive de Chelly sandstone, then Moenkopi shale capped by Shinarump.
   - That reads as a broad talus slope, then a tall vertical cliff, then a short slope with a thin cap.
   - The buttes rise up to about 300 m.
   - Source: Brooklyn College, "Monument Valley".
5. **Arches.** Joints split sandstone into thin, parallel fins.
   - Calcite cement dissolves where it is thinnest, and frost pries along the joints and bedding.
   - A softer layer under a harder one is undercut, which makes alcoves that break through.
   - The result is a self-supporting arch in a fin. Openings low in a wall are called arches; higher ones are called windows.
   - Source: USGS Bulletin 1393, Arches NP.
6. **Talus and scree.**
   - The profile is concave: steepest near the top, at the angle of repose (roughly 30–35° for sandstone debris), and flatter at the foot.
   - Large blocks collect at the bottom of the slope.
   - Debris pours out of every gully as a cone, and neighbouring cones merge into an apron.
   - Wind smooths the sand and drags it into tails on the lee side.
   - Source: Wikipedia, "Scree".

## Cartoon reading (Road Runner / Coyote, Maurice Noble)

- Noble's desert is stylised: "jagged, bright, abstract", flat and graphic rather than painterly realism. It still rests on close observation of real desert terrain and plants.
- The forms serve the gag: a boulder on a high, narrow ledge creates dread.
- Source: 99% Invisible, ep. 85 "Noble Effort"; Wikipedia, "Maurice Noble".
- What we take from it: simple big masses, exaggerated tapering and verticality, iconic arches and needles, and strong silhouettes. No surface noise that fights the silhouette.

## Rules for the generator (`kfb_cc_mesa_v2.py`)

| Rule | Implementation |
| --- | --- |
| No lid, no overhang | One signed-distance field. The body radius never grows with height, so every form thins upward. The top is the rock mass itself, with a smooth rounded rim. |
| Thinning upward, cartoon taper | Radius profile `1 − lean·t^0.75`: flared at the foot, narrower at the top. One side retreats more (asymmetry). |
| Cliff cut by gullies | Irregularly spaced grooves: deep at the foot, fading upward, some stopping short of the top. The ribs between them are buttresses. Vertical streak noise suggests rain-washed sandstone. |
| Cliff-and-bench (M03) | The upper cliff sits on a concave soft-layer bench and is shifted to the back, so one side is nearly flush. |
| Arch (M01) | A fin runs out from one lobe. An elliptic archway sits low in the fin (undercut soft layer). |
| Needle butte (M02) | A tapering, slightly leaning main spire, with shorter secondary spires fused at the foot. |
| Sand | A height field rather than parts: one debris cone per gully at 33°, concave, merged into an apron with a longer lee-side tail. Fallen blocks are half buried and sand banks against them. The sand gets almost no surface noise (wind-smoothed). |
| One mesh | Marching cubes on the SDF, then light smoothing and decimation. One shell, open 0, non-manifold 0, flat base at z = 0. |
| Colour | Soft, warped strata tones: deep red at the foot, red-orange, salmon higher up. No lines and no light cap band. Sandy top and talus. |

## Sources

- [Wikipedia: Mesa](https://en.wikipedia.org/wiki/Mesa)
- [Brooklyn College: Monument Valley](https://academic.brooklyn.cuny.edu/geology/grocha/monument/monument.html)
- [USGS Bulletin 1393, Arches National Park, arch formation](https://npshistory.com/publications/geology/bul/1393/sec8.htm)
- [Wikipedia: Scree](https://en.wikipedia.org/wiki/Scree)
- [99% Invisible, ep. 85 "Noble Effort"](https://99percentinvisible.org/episode/episode-85-noble-effort/transcript/)
- [Wikipedia: Maurice Noble](https://en.wikipedia.org/wiki/Maurice_Noble)
