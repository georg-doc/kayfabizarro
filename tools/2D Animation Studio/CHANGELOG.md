# 2D Animation Studio · Changelog

Additive history. Append; do not rewrite older entries to make the current state look cleaner.

## 2026-09-18 · v0.1 · Tool bootstrap

- created `tools/2D Animation Studio/` as a current KFB tool lane;
- linked central production router/SOP rather than copying skill bodies;
- defined browser-first 2D/2.5D cutout-puppet architecture;
- created scoped `_inbox/` intake with a prepared DocCheck AD Illustrator source job;
- created first lab `labs/eumel-rig-lab/`;
- recorded the current measured Eumel reconstruction as **provisional donor evidence**, not final source SSOT;
- reserved the incoming AD Illustrator file as candidate source SSOT pending verification and acceptance.


## 2026-09-18 · v0.2 · DocCheck AD source intake

- pinned a byte-identical copy of `_Dr_Vorlage.ai` into `_inbox/doccheck-ad-ai-source/sources/` using the original Git blob;
- audited the PDF-compatible Illustrator structure without redrawing;
- confirmed Adobe Illustrator 30.3 source, one visible PDF layer (`Ebene 1`), one page/artboard and distinct stroke families;
- extracted the exact PDF Bézier geometry and placement matrices into a source-derived SVG master;
- identified source-supported seams for eyes, pupils and nested stethoscope;
- added an audit viewer with layer toggles;
- preserved the boundary that native Illustrator private group names/AI-only constructs are not asserted until native/private-data inspection.


## 2026-09-18 · v0.3 · Source-exact Eumel Rig Lab

- split the AD source's visible PDF vectors into reusable source-exact components;
- added candidate semantic left/right aliases without rewriting source IDs;
- added a separate rig contract for derived pivots/hierarchy;
- exposed a byte-identical PDF render alias for human source comparison;
- built the Eumel browser Rig Lab with source-layer toggles, component atlas, pose export, optional 2.5D pointer parallax and five motion presets;
- added lab-level WIP / changelog / Return recovery files;
- status remains IMPLEMENTATION: real-browser QA and Georg/AD acceptance are still pending.


## 2026-09-18 · v0.4 · Neutral bind + shared EyeRig

Human browser feedback found two real rig defects and one presentation defect: leg pivots detached during swing, the authored one-leg lean was a poor reusable locomotion bind, and many component-atlas cards rendered blank.

Additive repairs:
- added measured/PCA-derived neutral bind pose; source pose remains available as QA mode;
- added explicit hip bones so leg swing stays attached to the body;
- added optional lower-leg/knee proxy bend without editing source paths;
- added limb stretch/squash on bone wrappers;
- added a neutral-based walk clip;
- introduced renderer-neutral `kfb.eye-rig.protocol/1` based on existing EyeRig v6 public calls;
- added a 2D EyeRig adapter with the same gaze/blink/emote/kinetics/life control surface;
- added shared semantic eye clips;
- fixed component-atlas fitting in root SVG coordinates;
- reclassified the visible foreground black/white source pair as the source hat/headwear from Georg's browser screenshot;
- documented the richer Eye/Face Modifier Atlas lane for rings/lids/eyewear without inventing unresolved source assets.

Status remains IMPLEMENTATION; browser retest is required.


## 2026-09-18 · v0.5 · ToolBox integration alignment

- aligned 2D Studio with ToolBox EyeRig-v6 semantics instead of creating a second eye-control grammar;
- added a stable ToolBox bridge doc and cross-tool handover;
- added `shared/eye-rig/toolbox-bridge.v1.json`;
- kept ToolBox `kfb.eye-profile/0.1-candidate` unchanged;
- defined companion renderer-binding metadata as the non-breaking bridge;
- documented `eyeFrame()` as the common 2D/3D accessory seam;
- kept whole-body cutout clips and skeletal clips rig-family-specific;
- defined the first cross-render proof as Eumel 2D + one approved Rig_Medium actor using the same semantic eye sequence.

Runtime proof remains pending.


## 2026-09-18 · Dropbox v18 EyeRig cross-check

Read-only donor audit confirmed the Dropbox FrankenStein Studio v18 session carries `pet-eye-rig.v6.js` text-equivalent to the current GitHub EyeRig-v6 donor after line-ending/trailing-whitespace normalization. The same Dropbox session contains Animation Lab v3, but no GitHub/current-tool promotion is inferred from presence alone.


## 2026-09-18 · v0.6 · Cross-render EyeRig proof

- added one renderer-neutral semantic sequence runner;
- corrected shared look clips to use the public gaze-follow/pointTo seam deterministically;
- improved the 2D blink fallback so pupils compress with the eye wrapper instead of floating outside a closed eye;
- built `proofs/cross-render-eye-v1/`;
- 2D target = source-exact DocCheck Eumel;
- 3D target = FrizzleBob Driver Graft on real Rig_Medium / 23 joints / ToolBox EyeRig v6;
- exact shared sequence: `neutral → blink → look_left → look_right → surprised → thinking → neutral`;
- added optional eyeFrame markers in both renderers;
- static sanity PASS; browser/playback proof still pending;
- started the source-first DocCheck Eye/Face Modifier Atlas with current source-resolved parts, KFB logic donors and unresolved richer DocCheck asset categories clearly separated.
