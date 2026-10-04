# KFB Production Resource Registry · R0

Status: IMPLEMENTATION CANDIDATE.

This is an additive discovery/index layer next to `registry/assets/v1`. It does **not** replace the Asset Registry, ToolBox contracts, actor configs, rig owners, Animation Lab, Rigging Lab, or consumer SSOTs.

## R0 scope

- indexes the six ToolBox WSA JSON config inputs as typed resources;
- preserves their existing schemas instead of normalizing them into a new super-schema;
- indexes ToolBox module references with explicit `DOCUMENTED_REFERENCE` status when loose source is not delivered;
- exposes CapsuleCarl, KayKit Driver Host, and FrizzleBob Driver Graft as actor/discovery records backed by explicit evidence overrides;
- joins the real KayKit `Rig_Medium` animation clips from the canonical Asset Registry `rigfacts.jsonl`;
- exposes documented custom FX such as actor wobble/color without claiming they are runtime-tested;
- exports read-only `candidate-only` composition plans for LLM/tool consumers.

## Build

```bash
python3 tools/resource_registry/build.py build
python3 tools/resource_registry/build.py validate
python3 -m unittest tools/resource_registry/test_resource_registry.py -v
```

## Query

```bash
python3 tools/resource_registry/query.py CapsuleCarl
python3 tools/resource_registry/query.py --actor frizzlebob-driver-graft
python3 tools/resource_registry/query.py --motions frizzlebob-driver-graft
python3 tools/resource_registry/query.py --fx frizzlebob-driver-graft
python3 tools/resource_registry/query.py --compose frizzlebob-driver-graft
```

## Owner rule

The Resource Registry answers **what exists, where it comes from, and which explicit relationships/evidence are known**. It does not declare retarget compatibility, donor fit, gameplay suitability, or canonical actor approval.
