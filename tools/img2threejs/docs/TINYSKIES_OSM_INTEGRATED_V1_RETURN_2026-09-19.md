# TinySkies × OSM × Grotesque Integrated Proof v1 · RETURN · 2026-09-19

**Status:** IMPLEMENTATION + STATIC + REAL BROWSER SCREENSHOT TESTED RESULT · PUBLIC STAGE PENDING  
**Repo:** `georg-doc/kayfabizarro`  
**Branch:** `img2threejs/tinyskies-osm-integrated-proof-v1-2026-09-19`  
**PR:** [#110](https://github.com/georg-doc/kayfabizarro/pull/110) · DRAFT / OPEN · no auto-merge  
**Exact tested runtime head:** `aa28a743628699271c94c1911af23d0564c6f3cc`  
**Workflow run:** [35471351012](https://github.com/georg-doc/kayfabizarro/actions/runs/35471351012)  
**Artifact:** `tinyskies-osm-integrated-v1-evidence` · ID `10591829944`

## Outcome

One visible world-cohesion proof now combines:

- real current Hürth OSM geometry;
- City Grotesque OSM massing;
- a modular Cologne Cathedral derived from Georg's accepted v0.2 cartoon source;
- a shared low-poly world-rim/material adapter;
- a rolling TinySkies-like terrain host with explicit urban/landmark grounding pads;
- OSM City default lighting;
- Day / Evening / Night comparison from the current pinned KFB Travel/TinySkies-derived world snapshot;
- rain as a world overlay only;
- TinySkies lighthouse and observatory source-derived KFB recreations shown in isolation before integrated evidence.

## Important boundary

The Cathedral's position in the Hürth proof is:

`STYLE_INTEGRATION_ONLY_NOT_GEO`

This is **not** a real Cologne OSM override and no Hürth building is claimed to be the Cathedral.

## Tests actually run

### Static/source proof

**27 / 27 PASS**

Full source scene:
- Hürth OSM buildings: **700**
- Hürth Grotesque building triangles: **65,648**
- modular Cathedral: **1,050 triangles**
- source Cathedral bounds: **44 × 84 × 64 m**
- Grotesque rig remains finite and ground-anchored
- current OSM attribution / undeformed collision contract preserved

### Chromium / WebGL proof

**19 / 19 PASS** · **0 page/console/HTTP errors**

Visible integrated subset:
- OSM buildings: **90**
- OSM Grotesque triangles: **9,459**
- Cathedral: **1,050 triangles**
- default world light: **OSM City**
- source donor reference metadata present
- Evening switch PASS
- Rain switch PASS
- wet facade material = **false**
- rain-driven albedo change = **false**

Screenshots in artifact:
1. `01-source-lighthouse.png`
2. `02-source-observatory.png`
3. `03-integrated-osm.png`
4. `04-integrated-evening.png`
5. `05-integrated-rain.png`

[Evidence summary](../evidence/2026-09-19-tinyskies-osm-integrated-v1/summary.json)

## Visual repair history

The first technically passing composition was not accepted internally as useful evidence because the 900 m terrain dominated camera fitting and the scene was tiny/washed out.

Repair pass 1:
- reduced visible Hürth subset to 90 buildings;
- camera fits OSM + Cathedral rather than the whole terrain plane;
- reduced world-rim strength;
- source references receive tighter isolation framing.

Repair pass 2:
- moved dynamic fog farther out for metre-scale city framing;
- Evening now retains recognizable terrain / OSM / Cathedral identities.

No third visual repair pass was made.

## Current visual conclusion

The proof is now suitable for Georg's human gate:

> terrain + city + hero landmark are lit by one world and read as one toy-world composition, while local object identities remain distinguishable.

The strongest current seam is not another palette pass; it is now the **real OSM Golden Sample**:
- actual Cologne Cathedral identity;
- real footprint;
- metre scale / height;
- yaw;
- load/fallback;
- terrain foundation.

## Source donor boundary

TinySkies donor:
`dannylimanseta/tinyskies@2659a5cc987d7e4a4c5aa7e79c86a1626ad75df6`

The lighthouse / observatory references are procedural KFB recreations used to prove the donor's visual grammar. No upstream mesh or copied asset is asserted.

## Weather boundary

Confirmed baseline:
- rain overlay;
- world lighting / sky / fog / rim;
- stable object albedo;
- semantic local emissive accents.

Deferred KFB extension:
- wetness;
- roughness/specular rain response;
- puddles / wet roads.

## Public Stage

Reserved direct route:

`https://kayfabizarro.pages.dev/kfb-hub/stage/img2threejs/tinyskies-osm-cohesion-v1/`

At this Return-writing point it is **PENDING PUBLICATION / NOT YET CLAIMED LIVE**.

The next publication step must mirror the exact tested runtime to main, link it from KFB Hub and verify the exact Cloudflare URL with a public browser proof.

## Unresolved

- real Cologne OSM override;
- Stage publication / public-browser verification;
- mobile browser check;
- shared KFB rim adapter in the actual Travel/OSM consumer;
- weather wet-material extension;
- Race/Travel contact seam.

## Next gate

**Georg visual review on the direct Cloudflare Stage URL after public verification.**
