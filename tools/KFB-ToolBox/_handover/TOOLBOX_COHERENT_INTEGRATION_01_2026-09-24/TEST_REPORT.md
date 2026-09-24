# TEST REPORT · TOOLBOX-COHERENT-INTEGRATION-01

Date: 2026-09-24  
Runtime-tested head: `1f59903bfae25e959e106cf4fd1d06dd2cf62588`  
GitHub Actions run: `36027616075`  
Job: `107728032734`  
Conclusion: **SUCCESS**

## Static / owner / contract checks

**22/22 PASS**

Verified:
- exact accepted Stage-First donor SHA-256 `08f9108a6a2a556d0e1e2e34ce564842062a4fdd77a80fb1020a8e723b688fba`;
- review candidate differs from that donor only by the coherent integration module injection;
- shared `edit-layer.js` is reused;
- current Resident Atlas builder/database and all three mandated targets are reused;
- current Driver Graft `mountGraft()` owner and contract contain `graft-driver`;
- `kfb.scene-patch.v1` is preserved and source-pinned;
- patch resolution is atomic before mutation;
- mandated missing sources fail visibly;
- no fallback BoxGeometry and no second WebGLRenderer are introduced;
- free Scale and support-aware Drop come from the shared edit layer;
- Save/Reload uses scene patches rather than a second persistence schema.

## Browser flow

**20/20 PASS · Chromium / local repository HTTP server**

Verified in one runtime flow:
1. coherent runtime reaches ready;
2. accepted real roster remains populated (>=35);
3. startup actor is `graft-driver`;
4. visible Driver is current `kfb.graft-mount/1` owner;
5. Driver source is shown isolated before Resident integration;
6. real Goth Girl Resident loads;
7. Resident actor exists;
8. Drop runs through the shared edit layer;
9. free Scale mode activates;
10. non-uniform scale is permitted;
11. Save emits `kfb.scene-patch.v1`;
12. exact Resident source pin is retained;
13. actor transform op is persisted;
14. Reload rebuilds the same real Resident;
15. Move round-trips;
16. Rotate round-trips;
17. free Scale round-trips;
18. editing remains enabled after Reload;
19. real Orc Warband loads;
20. real Animatronic loads.

## Non-blocking browser diagnostics

The accepted Stage-First donor still emits pre-existing/runtime-adjacent diagnostics:
- template-value warnings such as `{{ themeIcon }}` / `{{ r.value }}`;
- import-map conflict warnings after modules are already resolved;
- Chromium software-WebGL/readback performance warnings;
- one `pet-LIBRARY.json` 404; the donor reports that it falls back to `lab-v2/sources.js`.

These did not fail the requested coherent flow. They remain visible follow-up debt and are not silently classified as fixed.
