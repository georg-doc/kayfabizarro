# Independent master-pilot review · 2026-11-05

**Recommendation: TUNE.** Preserve this as a clearly labelled candidate; do not replace the approved sheet, grant a master Design PASS or import it on this review. The character remains recognisably Frau Löffelrecht, but the generated cutout is an interpretation with unresolved alpha and small design differences.

I actually opened and viewed all three supplied images: `../master-pilot/donor-isolation-qa.png`, `catalogue-master-candidate-r1.png`, and `identity-comparison.jpg`. I also read `TECHNICAL_QA.json` and `PRODUCTION_RECORD.json`, and independently measured existing PNGs with Pillow. No candidate pixels or metadata were changed.

## Visual comparison

- **Identity:** striped cap with red patch, striped scarf, broad violet-black ink body, asymmetric angry/winking expression, lashes, detached left droplet, and the large diagonal spoon remain recognisable. Individual lobes, their spacing and the lower body are reconstructed rather than exactly preserved. The candidate looks slightly taller relative to width.
- **Material:** both read as modelled clay with rounded volumes. The candidate amplifies dense surface texture and shiny spoon wear. This adds invented detail; it cannot establish that missing original detail has been recovered. The steel surface is more conspicuously mottled and reflective.
- **Props and grip:** the spoon bowl stays on viewer-right, the handle remains on viewer-left, and both rounded hands remain associated with the grip. The spoon's width, curvature and surface marks vary. I see no extra prop, humanoid torso, foot or protruding tongue.
- **Teeth:** I can distinguish **three upper ivory tooth shapes in the available donor and three in the candidate**: larger left, central, smaller right. The evidence here does not substantiate a four-to-three loss. The production prompt's demand for “same four” conflicts with the visible donor. Exact approved-source inspection should resolve that discrepancy before treating a fourth tooth as a restoration target. Tooth contours and their proportions are nevertheless newly rendered.
- **Gaze:** viewer-left eye remains closed; viewer-right eye retains ivory sclera, red iris and black pupil directed toward the viewer-left/upper side. Lid folds and the size/placement of the iris are similar in intent, not pixel-equivalent.
- **Red patches:** both original patch locations remain. The scarf patch is more prominent and sculpturally rounded in the candidate, with altered edge/stitch shapes. It reads as a sewn red patch rather than a new wound, but is a visible design change. The hat patch's edge details are also reconstructed.
- **Edges:** at native view the candidate contains tiny red and pale flecks above the cap and faint coloured edge residue. The outer frame also has very small nonzero alpha. These are relevant to a reusable catalogue cutout, especially if bounds are computed from any nonzero pixel.

## Independently measured technical facts

| Measure | Donor isolation | Candidate |
|---|---:|---:|
| Actual PNG size | 512 × 512 | 1254 × 1254 |
| Mode | RGBA | RGBA |
| Alpha >16 bounds | [75,115,437,433] | [52,73,1201,1122] |
| Alpha >16 visible size | 362 × 318 | 1149 × 1049 |
| Any nonzero alpha bounds | [23,25,508,484] | [0,0,1218,1254] |
| Alpha extrema | 0–254 | 0–255 |

The candidate visible width is **3.174×** the donor and visible height **3.299×**; bounding-box area is **10.470×**. Visible width/height ratio decreases approximately **3.78%**, evidence against an exact uniform enlargement. The actual candidate is 1254 square, not the requested 1536 square.

Candidate alpha counts: **699,040 fully clear pixels; 16,855 at alpha 1; 7,968 at alpha 2–16; 847,251 at alpha 17–254; only 1,402 fully opaque pixels**. Most interior alpha is near opaque rather than opaque: **735,793 pixels at alpha 253**, **80,838 at alpha 252**. Six sampled interior body/hat/spoon pixels also measured alpha 252–253. This contradicts the prompt's strict alpha-255-interior target, though the visual difference on many backgrounds may be slight. The outermost edge maximum is **1**, with **160 nonzero edge samples**; edge corners can be counted twice by this perimeter sampling method. Bounds based on alpha >16 are therefore more useful than naive nonzero-alpha bounds, but do not by themselves certify clean production edges.

## Next decision and limitations

The integrator can retain this evidence and decide whether a bounded alpha cleanup is justified under the current production guard. Before it becomes an accepted master, a human must decide whether the reconstructed clay/metal detail, lobe proportions, tooth shapes and red patch treatment still represent the approved character sufficiently faithfully. If exact original design is mandatory, keep the approved donor authoritative and reject any unsupported reconstruction as a replacement.

This is independent assessment of the root's image candidate, not Georg approval. It includes no runtime, catalogue-layout, downsampling or light/dark-background acceptance test. I did not inspect an additional full approved sheet beyond the supplied donor-isolation view. No claim of original-detail recovery, import readiness or publication is made.
