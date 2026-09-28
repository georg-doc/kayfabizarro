# TEST_REPORT · RESIDENT-BAND-MODULE-01 · 2026-09-28

Status: **CURRENT STATIC GATE PASS · PUBLIC BROWSER VERIFICATION PENDING**

## Current repository-native gate

Result: **26/26 PASS**

1. PASS · schema · `kfb.resident-band-module/1`
2. PASS · module id · `resident-band-module-01`
3. PASS · baseplate free · `false`
4. PASS · support anchor declared · `[0,0,-0.75]`
5. PASS · Legacy Orc B leader source · `media/3D_Assets/KayKit Legacy/Orc Warband - legacy/characters/gltf/character_orcB.gltf`
6. PASS · Orc Raider guitarist source · `media/3D_Assets/KayKit_Mystery_Series6/1 - July 2023 - Orc Raider/character/OrcRaider.glb`
7. PASS · Orc Brute drummer source · `media/3D_Assets/KayKit_Mystery_Series6/2 - August 2025 - Orc Brute/OrcBrute.glb`
8. PASS · exact Wardrum
9. PASS · left Wardrum stick
10. PASS · right Wardrum stick
11. PASS · signature song ref · `media/3D_Assets/Sounds/KFB RoadTrip JukeBox v2/Rubbish Groove 2min A extend 01.mp3`
12. PASS · BPM 100 · `100`
13. PASS · phase 0.465 · `0.465`
14. PASS · accepted Guitar A action · `ml.guitar.a.fit`
15. PASS · closest current drum action · `orb.drum.v5c`
16. PASS · drummer patch explicitly pending · `{"drummer":null}`
17. PASS · runtime schema constant
18. PASS · single module root
19. PASS · host beat update API
20. PASS · host placement API
21. PASS · S8 band selector
22. PASS · S8 deep-link to band
23. PASS · S8 pause path freezes band
24. PASS · S8 band post/timeline
25. PASS · Stage index byte-identical to S8 · `ee56b1556ca2c25c3d859b639ff224b0f0b6d21c == ee56b1556ca2c25c3d859b639ff224b0f0b6d21c`
26. PASS · Stage definition byte-identical · `f9ac5ca71738562e5fee25e94d97daf255bed235 == f9ac5ca71738562e5fee25e94d97daf255bed235`

## Stage publication integrity

- Cloudflare publication branch checkpoint: `b6a8c7a43989493e6699303f705096004dcd14d1`.
- Stage `index.html` blob: `ee56b1556ca2c25c3d859b639ff224b0f0b6d21c`.
- Owner S8 HTML blob: `ee56b1556ca2c25c3d859b639ff224b0f0b6d21c`.
- Stage band-definition blob: `f9ac5ca71738562e5fee25e94d97daf255bed235`.
- Owner band-definition blob: `f9ac5ca71738562e5fee25e94d97daf255bed235`.
- Therefore the public snapshot introduces **no replacement viewer and no changed Resident-band data**; it is the existing S8 runtime copied byte-identically into the Stage namespace.

## Inherited S39 browser/measured evidence — not rerun in this checkpoint

Recorded by the existing S39 owner:
- action bindings: **7/7 · 69/69 · 69/69**;
- song git-blob identity matched `368eb5ae…`;
- closest v5c strike contacts: R frame 0 = +0.026; L frame 25 = +0.025;
- constant-patch machinery was exercised across 48 frames;
- one-root host placement and support probe were exercised;
- S39b CCD reference test reached residual 0.0008 before its test data was deliberately cleared.

These are retained historical owner facts, not represented as a fresh browser run.

## Public browser state

An exact HTTP/browser verification of
`https://kayfabizarro.pages.dev/kfb-hub/stage/resident-atlas/band/#__band`
has **not yet been proven** by the available public fetch tool. The first exact URL open attempt returned an access/tool error, so state remains **DEPLOYMENT/PUBLIC VERIFICATION UNKNOWN**, not PUBLIC_VERIFIED.

No HUMAN_ACCEPTED claim exists yet.

## One next test gate

Open the exact Pages route successfully and confirm that the S8 band workspace is visible; then Georg authors the drummer reference pose.