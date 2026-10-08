# KFB 3D Workflow Research · Evidence / Test Report · 2026-10-08

**Scope:** Source-level audit of external browser shader/scene tooling; no code adopted, executed or deployed.
**Branch:** `planning/hybrid-baked-clay-texture-architecture-2026-10-07`. Reference: `skills/chat/research/KFB_3D_EDITOR_SHADER_INSPECTOR_DONOR_AUDIT_2026-10-08.md`.

## Actual checks
| Check | Observed | Status |
|---|---|---|
| Binding main `START_HERE`, KFB Chat/GitHub Workflow, Fresh Chat Slice Protocol, Clay Surface Canon | Retrieved and read | PASS · read-only |
| Current Material Language owner documents on existing planning branch | Read `SURFACE_MATERIAL_LANGUAGE_STEERING`, `HYBRID_BAKED_CLAY_TEXTURE_ARCHITECTURE_PREP`, `STYLIZED_SURFACE_SHADER_RESEARCH` | PASS · read-only |
| Branch availability / exact head | Existing planning branch `c5b88d9a795fce9a8efff413ad4a3df33bd0bbdf` at research start | PASS · read-only |
| `RhythrosaLabs/webgl-studio` | Repository and `ShaderEditor.tsx`, `WorldView.tsx` read: CodeMirror shader inputs, R3F scene gizmo/transforms | PASS · source evidence |
| `theringsofsaturn/3D-ai-school-threejs` | `Experience.jsx`, `Chat.jsx`, `proxy-server/proxy.js`, package & public folder metadata read | PASS · source evidence; security/age concerns |
| `takahirox/tsl-node-editor` | Public README/source tree inspected; experimental, source `src/App.tsx` monolithic ~677 KB | PASS · repository evidence |
| `threlte/three-inspect` | Public README/source tree inspected; Vanilla `createInspector` interface documented | PASS · repository evidence |
| `Design0r/shaderpass` | Public README claims editable GLSL node graph + JSON export | PASS · README only |
| Browser source-isolation demos (any donor) | Not executed | UNTESTED · 0 |
| K1/K2 Golden screenshots / active material lab | Not executed | UNTESTED · 0 |
| Unit/build/performance tests | Not run | UNTESTED · 0 |
| Cloudflare direct Stage / Site publication | Not made | NOT DEPLOYED · 0 |

## Key disqualifiers / limitations
- `3d-ai-school-threejs`: no demonstrated mastery/persistence, unscoped backend request path, local-only hard-coded API URL; **not** a secure service donor. Public `.env` path seen; file contents deliberately not fetched.
- `webgl-studio`: early codebase and no tests run; only source-level UI/scene controls confirmed.
- `tsl-node-editor`: experimental and WebGPU-dependent; different renderer pins; no drop-in adoption.
- `three-inspect`: candidate dev inspector, not an authorized WB2 editor or accepted perf profiler; possible breaking changes before 1.0.

## Proof needed before implementation
1. Distinct donor visuals/screenshots in isolation, real console/bundle/browser compatibility.
2. One canonical KFB source object + K1/K2 fixed view, each separately confirmed.
3. Same-scene candidate controlled variation + actual before/after and measured cost.
4. Independent critic and human direct Hub-linked `https://kayfabizarro.pages.dev/…` acceptance gate **if** a Stage slice is later authorized.

**No test PASS or material quality improvement is claimed here.**
