# KFB Modular Cartoon Clay HUD Skin Kit · R1
2026-11-04 · SHARED DESIGN / AUTHORING STANDARD · NOT a new runtime
Owner: existing KFB ToolBox/WS0 visual design; Race/World/Travel/Combat/Audio keep their own runtime and state owners.
## Read order
1. HUD_SKIN_SPEC.md (semantic contract)
2. WS0_IMAGE_JOBS.md (two fresh image-generation prompts)
3. HUD_COMPONENT_COVERAGE.csv (existing donors/gaps)
4. SKIN_MANIFEST_SCHEMA.json (machine-readable exchange contract)
5. RETURN.md (current findings and next gate)
This is a persistent authoring kit for the reference-driven family accepted in the image chat. The previously named docs/hud-kit/HUD_SKIN_SPEC.md could NOT be fetched from GitHub before this branch; the WS0 text delivered by Georg is its supplied source for R1.
No fake brand, no generic replacement HUD chrome, no second renderer, no AudioContext, map, speed or progression owner. The same component/anchor semantics work in every visual skin.
The actual accepted image-job PNG source files from this chat are not yet stored in GitHub; record them as SOURCE_REQUIRED for future automated image jobs instead of implying that an arbitrary URL is a visually verified donor.
### Source routes
- Main visual router: skills/chat/KFB_STYLE_REFERENCE_ROUTER_2026-10-07.md
- Clay SSOT: tools/KFB-ToolBox/docs/KFB_CLAYMATION_STYLE_SSOT.md on branch work/clay-style-ssot-2026-10-01.
- Existing WS0 HUD and icon donors: https://github.com/georg-doc/KFB-Stunt-Car-Race/tree/design/claude-design-r3/hud_r1
- Binding WS0 occupancy: hud_r1/HUD_BELEGUNG_R1.md on that branch; six fixed anchors, four action slots in Race.
- K7 flight HUD/inventory donor: tools/KFB-ToolBox/_inbox/KFB HUD Flight Board - Flight VFX/KFB_HUD_FLIGHT_SESSION_CUT_2026-10-09_r1/docs/LIVING_HUD_FLIGHT.md
Do not create new public Stage merely for documentation. All game integration needs its receiving product's review.
