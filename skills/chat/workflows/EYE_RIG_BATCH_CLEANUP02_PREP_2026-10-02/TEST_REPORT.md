# TEST REPORT · EYE-RIG-BATCH-CLEANUP02-01

Date: 2026-10-02  
Branch: `chatgpt-web/eye-rig-cleanup02-consumer-prep-2026-10-02`  
Scope: source/manifest + routing metadata contract. No EyeRig consumer runtime, browser or Cloudflare mutation was executed.

## Result

**28/28 PASS · 0 FAIL**

1. **PASS** · `manifest-schema` · kfb.eye-rig-consumer-intake/0.1-candidate
2. **PASS** · `entry-count` · 31
3. **PASS** · `unique-ids` · 31
4. **PASS** · `source-counts` · {"done":26,"none":5,"blocked":0}
5. **PASS** · `normalized-counts` · 26/5/0
6. **PASS** · `done-has-noeyes-path` · 26/26
7. **PASS** · `done-has-anchors` · 26/26
8. **PASS** · `none-has-no-derivative` · 5/5
9. **PASS** · `source-revisions-pinned` · 31/31
10. **PASS** · `source-brows-preserved` · 31/31
11. **PASS** · `special-decision-set` · mage,pete,rogue,warrior
12. **PASS** · `brow-donor-blob` · ccc91a7f48adbf999ed33ca1708bbe5d1c738d0f
13. **PASS** · `brow-existing-export-schema` · kfb.brow-experiment/0.2
14. **PASS** · `brow-eye-frame-seam` · getEyeFrame + eyeFrame()
15. **PASS** · `brow-left-right-control` · tilt/bend L+R
16. **PASS** · `consumer-roles` · toolbox,residentAtlas,combatArena
17. **PASS** · `no-auto-consumer-rewrite` · true
18. **PASS** · `all-done-glbs-present-at-cleanup-head` · 26/26
19. **PASS** · `texture-cases-explicit` · figure + figure_headB
20. **PASS** · `skeleton-glow-exceptions-explicit` · warrior + rogue + mage
21. **PASS** · `pete-exception-explicit` · pete
22. **PASS** · `stage-not-republished` · PREPARED_NOT_INTEGRATED
23. **PASS** · `registry-json-and-route` · registered
24. **PASS** · `registry-evidence-head` · a4a3232a58e66973eca1f5586f9d0e2cbd2b5177
25. **PASS** · `main-hub-card` · eyerig-cleanup02-prep
26. **PASS** · `toolbox-hub-card` · EyeRig card updated
27. **PASS** · `changelog-current` · 2026-10-02 entry
28. **PASS** · `hub-no-false-publication-claim` · explicit no-publication text

## What this proves

- the complete EYE-CLEANUP-02 set is normalized without losing an entry;
- every `done` actor has a pinned NoEyes GLB present at cleanup head `1820a1c034e9741acedb4d8ba3118cbd1fc776ba`;
- all four human-decision exceptions are quarantined rather than silently treated as approved;
- source brows are preserved in the intake contract;
- the future brow layer is the **existing** `BrowRig v2`, anchored through `eyeFrame()`, with its existing companion export schema;
- ToolBox / Resident Atlas / Combat roles remain separate;
- Registry, additive changelog, main Hub source and ToolBox Hub source all expose the prep without claiming a new public deployment.

## Not tested / not claimed

- no EyeRig visual placement on these 26 derivatives;
- no BrowRig integration on KayKit Residents;
- no animation/motion regression beyond the Blender return's pre-existing bind evidence;
- no Resident Atlas `data/cast.js` mutation;
- no Combat runtime mutation;
- no new Stage deployment or public-browser proof.

Those remain integration gates, not hidden assumptions.
