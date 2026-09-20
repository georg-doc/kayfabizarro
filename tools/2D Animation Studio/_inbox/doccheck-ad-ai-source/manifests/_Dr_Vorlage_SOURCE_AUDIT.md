# _Dr_Vorlage.ai · Source Audit 0.1

## Confirmed source facts

- exact Git blob: `436143b019f0034c6d2d9183154cf613ff8c701e`
- size: **581313 bytes**
- PDF-compatible Illustrator file, PDF 1.6
- creator: **Adobe Illustrator 30.3 (Macintosh)**
- document title: `_Dr_Vorlage`
- one page/artboard in the PDF-compatible view: **131.798 × 200.701 pt** (~46.50 × 70.80 mm)
- one visible PDF layer: **Ebene 1**
- visible transparency: false
- visible overprint: true

## 1:1 vector structure recoverable without redrawing

The PDF-compatible portion exposes exact Bézier coordinates, stroke widths, fill/stroke colors, object matrices and draw order. It contains four top-level Form XObjects plus one nested form:

1. `Fm0 / object 9` — base actor assembly.
2. `Fm1 / object 10` — two white eye shapes with black outlines.
3. `Fm2 / object 11` — two black pupils.
4. `Fm3 / object 12` — foreground face/occlusion geometry. The semantic label is inferred from its position after eyes/pupils and should remain `INFERRED` until visual/native Illustrator inspection.
5. nested `Fm0 / object 22` inside the base actor — stethoscope geometry.

The eye/pupil pair has its own shared transform, which is exactly the kind of source-defined eye rig we wanted to preserve rather than recreate.

## Stroke families observed in source PDF

Source strokes include **5.669 pt, 2.835 pt, 2.126 pt, 1.417 pt and 1.134 pt**. These must remain distinct; do not normalize them.

## Important limitation / evidence boundary

The Illustrator file contains native round-trip private data in three `AIPrivateData` blocks. The PDF-compatible vector layer gives us exact visible anchors/control points and grouping at the PDF Form-XObject level, but it does **not** by itself prove every native Illustrator group name, hidden object, symbolic anchor name or AI-only construct.

Therefore:
- visible vector geometry: source-exact extraction is feasible now;
- native Illustrator semantic group names: do not invent;
- `Fm3` semantic role: currently inferred from draw order;
- final promotion requires visual comparison and, where needed, native Illustrator inspection.

## Generated derivative

`_Dr_Vorlage_PDF_VECTOR_MASTER.svg` is a non-redrawn derivative generated from the PDF vector instructions. It preserves source path coordinates and placement matrices; it is not a generative trace.
