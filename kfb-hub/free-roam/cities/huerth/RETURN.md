# KFB Free Roam · Hürth · RETURN

**Permanent Cloudflare entry:** https://kayfabizarro.pages.dev/kfb-hub/free-roam/cities/huerth/  
**Current S1 viewer:** https://kayfabizarro.pages.dev/tools/osm-city-lab/?city=huerth-v0  
**Dataset:** `tools/osm-city-lab/data/huerth-v0/`

## CURRENT STATUS

- S0 source/cache/normalization: **TESTED RESULT**
- S1 procedural low-poly viewer: **IMPLEMENTATION · PUBLIC/HUMAN VISUAL GATE OPEN**
- S2 Walk/Drive consumer scene: **IMPLEMENTATION EXPORT · RUNTIME INTEGRATION OPEN**
- Public city entry: **IMPLEMENTATION / PUBLIC PROOF PENDING**
- Georg acceptance: **S1 PENDING · S2 PENDING**

## Read first

1. `tools/osm-city-lab/README.md`
2. `tools/osm-city-lab/data/huerth-v0/SOURCE_SPEC.json`
3. `tools/osm-city-lab/data/huerth-v0/PROVENANCE.json`
4. `tools/osm-city-lab/evidence/huerth-v0-s0-report.json`
5. `tools/osm-city-lab/evidence/huerth-v0-fixture-analysis.json`\n6. `tools/osm-city-lab/docs/CONSUMER_CONTRACT.md`
7. `skills/chat/workflows/ASTRA_INTEGRATION_01_2026-09-18/WALK_DRIVE_COMBAT/CONTRACT_PROPOSAL.md`

## Tested S0 evidence

- bounds: **700.05 × 699.976 m**
- roads: **164** / driveable **116**
- buildings: **700**
- landuse: **22**
- source elements: **5640**
- source-derived corridor candidate: **Am Heideberg · 478.64 m**\n- gates: **residential · intersection · corridor · road/green edge PASS**

## Owner lock

- City Lab: OSM normalization, city geometry, style, export.
- Travel: World/Terrain/Mode/Persistence.
- Ground: existing Travel/WB0 movement seam.
- DRIVE: existing Race Slice-04 donor through the Free-Roam receiver.
- Registry/Librarian: GitHub asset identity/provenance.
- No new city-specific movement, collision, save or asset owner.

## Next runtime gate

```text
walk
→ reach parked vehicle
→ enter
→ forward
→ reverse
→ three-point turn / parking
→ intersection
→ road↔Travel terrain
→ stop
→ exit
```

Do not mark S2 PASS from the exported geometry alone. Preserve this permanent city entry and update its Drive link only after the named receiver has real browser evidence.

