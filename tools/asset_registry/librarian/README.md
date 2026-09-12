# KFB Asset Librarian v1 · Browser Slice

**Status:** IMPLEMENTATION CANDIDATE  
**Consumes:** generated `registry/assets/v1/**` + `tools/asset_registry/consumer_profiles.json`  
**Does not own:** assets, decks, donor acceptance, Combat Arena roster membership, Stunt Car Race implementation or rig compatibility.

## Vertical slice

This browser deliberately stays small:

1. load Registry manifest + pack/rig summary;
2. load `catalog.jsonl` only when search starts;
3. load `rigfacts.jsonl` only when a rig/animation query or model detail needs it;
4. search/filter assets;
5. inspect exact path, dependency status and rig facts;
6. preview GLB/GLTF from the commit-pinned RAW URL with Three.js;
7. select one or more assets;
8. export/copy `kfb.asset-handoff.v1` to a receiving consumer;
9. prepare a compact read-only Librarian request packet for a later LLM/MCP connector.

The UI never turns a candidate into an implementation decision.

## Consumers

The dropdown is generated from `../consumer_profiles.json`, currently:

- Animation Lab
- Frankenstein Studio
- Combat Arena
- KFB Stunt Car Race
- Generic Runtime

Each handoff carries the consumer's owner boundary and required downstream validation.

## Run locally

From repository root:

```bash
python3 tools/asset_registry/build.py
python3 tools/asset_registry/validate.py
python3 tools/asset_registry/rigfacts.py build
python3 tools/asset_registry/rigfacts.py validate
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/tools/asset_registry/librarian/
```

Do not open `index.html` via `file://`; browser fetch/CORS behavior requires HTTP.

## Preview

The browser imports Three.js + GLTFLoader + OrbitControls from jsDelivr. Preview is enabled only for `.glb` and `.gltf`. It loads `source.rawPinned`, fits the camera to the loaded scene and plays the first embedded animation clip when present.

Preview success is presentation/runtime evidence only. It does not prove collision, scale, donor quality, skeleton compatibility or gameplay fit.

## Ask Librarian bridge

The `Ask Librarian` panel is intentionally **not a fake LLM**. It copies a compact `kfb.asset-librarian-request.v1` packet containing:

- user question;
- current filters;
- selected asset IDs;
- target consumer;
- source commit;
- intended read-only tool surface.

A later OpenAI Apps SDK / MCP or standalone API connector can consume that packet and call the deterministic Registry tools. No API key or write capability is stored in this static browser.

## Test boundary

Automated CI can verify:

- Registry + rig sidecar build/validation;
- Python query/handoff behavior;
- JS syntax;
- presence of required browser contract paths/IDs.

Automated CI in this slice does **not** prove WebGL rendering or visual quality. Those require an actual browser/render smoke pass and remain a separate tested-result gate.
