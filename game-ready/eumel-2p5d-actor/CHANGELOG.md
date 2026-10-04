# Changelog · Eumel 2.5D Actor Package

## 2026-09-20 · E25D-01 · candidate package metadata

### SOURCE
- pinned original DocCheck Illustrator intake blob;
- pinned source-exact component SVG;
- pinned neutral-bind calibration;
- pinned three2p5d implementation merge.

### CREATED
- package manifest;
- actor binding;
- source/provenance manifests;
- static QA record;
- consumer test plan.

### TESTED RESULT
- package JSON/static references are structurally prepared;
- upstream three2p5d implementation has static sanity PASS.

### NOT TESTED
- real browser three2p5d proof;
- Resident Atlas mount;
- DocCheck Project Island;
- KFB game consumer.

### HUMAN
- pending.


## 2026-09-20 · E25D-02 · QA-corrected runtime pin

### IMPLEMENTATION PIN
Advanced the world-space implementation reference to:

`52702836bf0740414e53abb5a3867af5981c195a`

This revision corrects the neutral leg presentation so source pixels are bound around the measured `sourceHip` before placement at `targetHip`, rather than rotating around the target coordinate without source-pivot compensation.

### PUBLIC QA
Cloudflare browser workflow started:

run `35480439344`

Status at this package update: **IN PROGRESS**.

Do not mark browser PASS until the workflow finishes green and evidence is recorded.
