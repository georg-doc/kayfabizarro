# PC-ARCH-01 · CHANGELOG

## 2026-09-29 · r0 · architecture-first reset
- Reversed the failed world-first approach: no T4, no KFB GLB, no physics, no Residents/Cards.
- Created a minimal PlayCanvas 2.22.4 AppBase bench.
- Added separate Entity/RenderComponent mode and hardware-instanced mode.
- Added controlled object counts 0 / 100 / 250 / 500 / 1000 / 2000.
- Added shadows and device-pixel-ratio as isolated cost switches.
- Added orbit/zoom and a compact metric panel.

## 2026-09-29 · r1 · headless telemetry recovery
- Initial CI full checkout exposed an unrelated repository-size cost (~2.5 GB); workflow changed to sparse checkout.
- Local boot, syntax and WebGL initialization pass.
- Headless SwiftShader AppStats performance telemetry remained zero.
- Repair 1: sparse checkout / normal browser proof path.
- Repair 2: timer + independent render-frame counter; render loop advanced 5 frames / 24 samples but AppStats values remained zero.
- Two repair passes exhausted; no repair 3.
- Frozen implementation: `a072514f111ebf6068606fbf06a017f33f617102`.
- Added Recovery, Export Manifest, Test Report and Return.

## 2026-09-29 · r2 · public real-browser surface
- Mirrored the frozen primitive bench unchanged to `kfb-hub/stage/playcanvas-arch-01/`.
- Added Source marker and KFB Hub card in one `cloudflare-live` publication commit: `d61eb7c45bb2b9a947ece4574db1d38fafa56abf`.
- Public proof attempt 1 reproduced known deployment propagation: HTTP 200 child marker returned root fallback HTML.
- Unchanged attempt 2 PASS:
  - run `36596233422`
  - job `109504616254`
  - artifact `11045904163`
  - digest `sha256:e4430fb2f565ee7235c6490017925bce09173cc3bc1eff97b4b074de4454f76f`
  - exact Source marker PASS
  - PlayCanvas 2.22.4 ready PASS
  - Entity / Instanced / 2000 controls PASS
  - Hub card PASS
  - page errors 0
  - console errors 0
- Stage source/boot is PUBLIC_VERIFIED.
- Representative-device performance remains deliberately unclaimed.

## Exactly one next gate
**PC-ARCH-RB01 · REAL-BROWSER DEVICE BASELINE**

Measure the frozen primitive bench in Georg's normal browser before one real GLB or any physics is introduced.
