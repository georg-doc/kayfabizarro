# Changelog · Pilot 01

## 2026-09-18 · P01-A · package metadata implementation

### SOURCE REVIEW
- Pinned Lorekeeper, Staff and Tome.
- Pinned Rig_Medium General and MovementBasic animation sources.
- Confirmed exact BOX1 Sedan is KayKit City Builder Bits `car_sedan.gltf`, not the Kenney sedan.
- Parsed source glTF wheel nodes and body accessor.
- Confirmed CC0 evidence for both KayKit source families.

### CREATED FILES
- Package/source/dependency/provenance manifests.
- Resident binding, rig/socket report, animation map and interaction-proxy proposal.
- Vehicle binding, wheel report, physics handoff, deformer reference and source-derived collider proxy spec.
- Gameplay event, VFX and SFX maps.
- Static QA and consumer test plan.

### TESTED RESULT
- Static/source structural evidence recorded.
- No new browser/runtime consumer test performed in this package step.

### OPEN
- Binary `derived/car-sedan-chassis-proxy.glb` generation/inspection/validation.
- Lorekeeper interaction proxy dimensions.
- Sedan seat anchor.
- Exact SFX source refs.
- Slice-04-derived DRIVE receiver consumer test.
- Human acceptance.


## 2026-09-18 · P01-B · current Free Roam receiver pin

### SOURCE / RECEIVER REVIEW
- Current Free Roam donor is now concretely `fr-s04-02`.
- Race tested source: `a7a48a8c6e1589a18134aa619e2be22d79124c32`.
- Race merge: `63cb97d5e321700e55f7658104b42c9c09d97d70`.
- Actual KFB Cloudflare evidence: run `35367513758`, **62/62 PASS**.
- Human feel review remains open.

### IMPORTANT LIMIT
FR-S04-02 uses the original kart. Its PASS proves the donor receiver/control/contact path, not the Pilot-01 Sedan package. Sedan consumer acceptance remains NOT RUN until the exact `car_sedan.gltf` + wheel bindings + validated chassis proxy are mounted and rerun.
