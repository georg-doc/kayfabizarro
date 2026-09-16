# KFB Resident Atlas

Status: IMPLEMENTATION / mobile live viewer.

Intended permanent product URL: `https://kayfabizarro.pages.dev/resident-atlas/`

Source viewer: `tools/resident_atlas/`
Stable route alias: `resident-atlas/` → `/tools/resident_atlas/`

The Atlas is a composition layer over existing repository assets. It does not replace Asset Registry truth, Animation Lab compatibility ownership, or consumer runtimes.

Current scene: `Caveman · Cave Camp`.

Scene selection lives in `scenes/index.json`; each resident scene is a declarative recipe with exact repository asset paths and transforms.

Caveman calibration rule: use whole, exact KayKit assets as authored models. Do not turn unrelated floors, stairs, walls, rocks or other pieces into improvised substitute props or structures. Scene composition may place and rotate complete assets, but it must not silently reinterpret one asset as another.

Evidence states:
- DECISION: one shared viewer plus declarative scene recipes.
- IMPLEMENTATION: Caveman scene and mobile viewer exist; Cloudflare stable-route alias added.
- TESTED RESULT: Georg confirmed the mobile WebGL viewer loaded `14/14 models` via the public raw.githack test build on 2026-09-16. That result applies to the prior composition; the revised KayKit-only Caveman placement still requires visual QA.
- PUBLIC DEPLOYMENT: Cloudflare route intended; verify live propagation before marking deployed.
- GEORG ACCEPTANCE: viewer mechanism accepted as working; revised Caveman art direction still open.
