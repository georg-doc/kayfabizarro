# KFB Asset Scene Composer · private plugin seed v0.1.0

**Status: CREATED/VERIFIED private skills-only plugin. NOT a one-click image-generation integration.**
- [Plugin öffnen](https://chatgpt.com/plugins/plugins_6acaa1b6b0688191b66448db92767870)
- backend ID: `plugins_6acaa1b6b0688191b66448db92767870`
- stored release: `pluginrel_6acaa1b7ec308191bd98300be692e9d1`
- version: `0.1.0`; scope: `USER`; discoverability `PRIVATE`; creator status `created`
- archive produced for user: `KFB_Asset_Scene_Composer_Private_Plugin_v0.1.0.zip`, SHA256 `921de566d6e14ff4360e39678830f7e1439cac3370f125c990e9c7c3553f71e1`; **archive is a chat artifact, not GitHub**.
- plugin source files: `plugin.json`, `skills/compose-kfb-scene/SKILL.md`, `skills/compose-kfb-scene/references/job-contract.md`; Plugin Creator also exposes `.codex-plugin/plugin.json`.
- Creator re-read: 4 files, all three requested UTF-8 documents readable; manifest and skill/contract conditions checked (no missing/limited paths).

## Implemented now
- A reusable chat skill for SOURCE_FIRST → confirmed actual donor pixels → context or asset plate → image or material-only treatment → QA → parts/provenance/checkpoint.
- Four job modes: `asset_plate`, `scene_context`, `material_study`, `mood_explore`; the last one explicitly does **not** claim donor match.
- Strict assetId/blob identity, selected scene context and KFB style/craft material separation.
- New user-preferred Quaternius first-pass **candidate** for nature, while preserving verified Kenney/KayKit and private source identities.
- Archive state, Golden guard and no second Registry/runtime-owner instructions.

## NOT implemented
- No MCP service, automatic selection context, live rendering of actual source views, image provider invocation, Site button, durable server image storage or direct binary GitHub upload. The plugin is a skills-only private seed, not a functional autonomous imaging service.
- No connection permission granted for additional services, no expense/credits triggered, no Site deployment.
- Connecting/activating the private plugin in the ChatGPT UI may require a separate user action. Creation alone does not prove invocation.

## Integration bridge
The current owning project is **Asset Librarian**, not G1 Island Lab. The [Work Brief](BRIEF_WSA_WORK_PLUGIN_INTEGRATION_R1.md) is the sole integration authority for the actual button. Its first acceptance proof uses the real `Quaternius/Ultimate Nature/FBX/Rock_1.fbx` model, or the existing Quaternius GLB alternatives if necessary, and reuses existing `preview3d.js` + `framing3d.js`. Do not clone the data owner or publish a competing Site/plugin.

## Single next gate
WSA Work **G0**: demonstrate exactly one real Quaternius GLB/FBX donor in the existing Librarian viewer, source-identity/pixel capture and a byte-verifiable source image. Only after this proof add provider generate-job tool and one-click UI.
