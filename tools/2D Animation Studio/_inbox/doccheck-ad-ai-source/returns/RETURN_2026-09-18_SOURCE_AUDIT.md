# Return · DocCheck AD _Dr_Vorlage.ai source audit

Date: 2026-09-18  
Status: IMPLEMENTATION / SOURCE AUDIT COMPLETE · VISUAL ACCEPTANCE PENDING

## Source pinned

Original Git blob SHA:

`436143b019f0034c6d2d9183154cf613ff8c701e`

Byte-identical intake copy:

`sources/_Dr_Vorlage.ai`

Size: **581313 bytes**.

## Confirmed structure

- Adobe Illustrator 30.3 (Macintosh)
- PDF-compatible AI, PDF 1.6
- one page/artboard: 131.798 × 200.701 pt
- one visible PDF layer: `Ebene 1`
- four top-level PDF Form XObjects plus one nested form
- separate source groups for eye whites/outlines and pupils with the same placement transform
- independent nested stethoscope form
- source stroke families include 5.669 / 2.835 / 2.126 / 1.417 / 1.134 pt

## Produced

- `manifests/_Dr_Vorlage_SOURCE_AUDIT.md`
- `manifests/_Dr_Vorlage_native_structure.json`
- `../../labs/eumel-rig-lab/source-assets/_Dr_Vorlage_PDF_VECTOR_MASTER.svg`
- `../../labs/eumel-rig-lab/source-assets/EUMEL_NATIVE_COMPONENTS.json`
- `../../labs/eumel-rig-lab/source-assets/index.html`

## Evidence boundary

The visible PDF-compatible vector geometry and its Bézier anchors/control points are source-derived, not traced or generated.

The AI file also contains Illustrator private round-trip data in three `AIPrivateData` blocks. Native Illustrator-only group names, hidden object semantics and private constructs are **not** claimed verified from the PDF-compatible layer alone.

The final foreground form is provisionally labelled as an eye/face occlusion foreground because it is drawn after eyes and pupils; that semantic label remains **INFERRED** until visual/native inspection.

## Next gate

1. browser/render comparison against source;
2. confirm semantic role of the foreground form;
3. split accepted vectors into canonical reusable Eumel parts;
4. define pivots/anchors for animation without changing source paths;
5. retarget the browser Rig Lab;
6. Georg/AD visual acceptance.
