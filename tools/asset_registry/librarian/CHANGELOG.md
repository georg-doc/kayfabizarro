# Changelog · KFB Asset Librarian

## v1.2 Core · 2026-09-12

### Decision
- Daily-use static site first; no LLM dependency.
- Reuse canonical Registry and tested Three.js browser.

### Implementation
- collection + review queue filters
- list/card result views
- exact identity/provenance
- dependency navigation
- richer rig/skeleton facts
- 3D controls and clip selector
- image and audio previews
- persistent local Selection Tray
- candidate-only consumer handoff retained
- dedicated WSA six-task acceptance gate

### Tested result
- existing v1 Chrome/WebGL regression PASS
- v1.2 T1–T6 acceptance PASS in Chrome 152 / WebGL 2
- 0 console errors / 0 runtime exceptions
- six task screenshots + machine-readable `result.json` uploaded by CI

### Preserved
- Registry/indexer owners
- consumer profiles and owner boundaries
- v1 browser WebGL regression test
- v1.1 LLM/OpenAI code, untouched and not required
