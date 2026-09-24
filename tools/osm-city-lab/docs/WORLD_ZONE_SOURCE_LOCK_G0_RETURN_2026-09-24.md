# RETURN · WORLD-ZONE-SOURCE-LOCK-G0

Date: 2026-09-24  
Status: **PASS · ISOLATED RECOVERY GATE COMPLETE**

## Exact state

Repository:
`georg-doc/kayfabizarro`

Branch:
`chatgpt-web/world-zone-source-lock-g0-2026-09-24`

Tested head:
`845db87141471d00cc8d6adb62e9b852866083d2`

Parent frozen recovery:
`cd0a3de957c3878df8596b17da1a1c35e543cf80`

## Purpose

This gate intentionally proves only the cached Cologne source locks and deterministic normalization.

It does **not** compile a World Zone.

The failed inline-YAML `node -e` hash logic from the frozen WORLD-ZONE-BAKE-01 branch is replaced here by one repository-native verifier:

`tools/osm-city-lab/tests/world-zone-source-lock-g0.mjs`

CI:
`.github/workflows/world-zone-source-lock-g0.yml`

## Actual evidence

GitHub Actions:
- run: `36028104923`
- job: `107729681085`
- result: **SUCCESS**
- assertions: **14/14 PASS**

Artifact:
- id: `10820816621`
- name: `world-zone-source-lock-g0`
- digest: `sha256:2a1d0e3155508f51b9ad91838db97448067e3b891a7e8a9b3e24f8014e792b5d`

Verified facts:
- source Git blob lock PASS;
- source exact file-byte SHA PASS;
- source payload SHA PASS;
- provenance source SHA PASS;
- source canonical JSON payload PASS;
- normalized Git blob lock PASS;
- normalized exact file-byte SHA PASS;
- normalized payload SHA PASS;
- normalized canonical JSON payload PASS;
- normalization deterministic PASS;
- rebuilt normalized payload hash matches locked payload PASS;
- rebuilt normalized payload equals committed `normalized.json` payload PASS;
- local metre frame PASS;
- feature counts PASS.

Counts:
- roads: **5,236**
- driveable roads: **2,523**
- buildings: **6,351**
- landuse: **456**
- water lines: **6**

Runtime/network requests: **0**.

World Zone compile executed: **false**.

## Owner / scope preserved

- KFB OSM City Lab remains geography/semantic/bake owner.
- WorldBuilder remains a consumer.
- no live Overpass.
- no second world/editor/persistence owner.
- landmarks remain separate modules.

## Exactly one next gate

**WORLD-ZONE-COMPILE-G1 · deterministic compiler-only proof**

Use the frozen compiler candidate unchanged.

Run:
1. G0 verifier as precondition;
2. compile Cologne twice to temporary directories;
3. compare package contracts and byte determinism with the existing World Zone test;
4. upload evidence only.

Do not commit/publish the canonical baked package in G1.
Do not open a Cloudflare loop.
