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

## 2026-09-18 · P01-C · FR-S04-02 Sedan adapter contract

### SOURCE REVIEW
- Read current public FR-S04-02 `app.mjs`, `physics.js`, `PROVENANCE.json` and release evidence.
- Receiver currently hardcodes a 2.6 m kart chassis cuboid, four synthetic wheel connection points, 0.42 wheel radius and a 2.8 m visual kart.
- Exact Sedan package geometry differs materially and cannot be treated as a texture/skin swap.

### CREATED FILES
- `vehicle/car-sedan/FR_S04_02_RECEIVER_ADAPTER.json`
- `vehicle/car-sedan/FR_S04_02_RECEIVER_HANDOFF.md`

### DECISION
- Keep BOX1 4.1 m Sedan scale as the package baseline.
- Use the Sedan's four real wheel nodes for visual wheel/steer presentation.
- Runtime collider can use the already-derived numeric body AABB directly as a Rapier cuboid for the first consumer probe.
- The still-missing binary collider GLB remains a **Game Development Studio capability gate**, not a mandatory blocker for a numeric FR-S04-02 receiver experiment.
- Kart mass/inertia/suspension/recovery/camera geometry are not Sedan facts and must be revalidated rather than copied silently.

### TESTED RESULT
- Adapter is source-derived and structurally specified.
- No Sedan receiver runtime/browser test has been executed yet.
