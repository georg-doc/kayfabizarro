# KFB Chat Production Router · additive changelog

History is additive. Earlier statements are not silently rewritten. If a later entry corrects or replaces an earlier one, mark it `SUPERSEDES` and keep both.

## 2026-09-13

### DECISION
`skills/chat/` becomes the current LLM production routing layer shared by ChatGPT/Astra and Claude Design.

### DECISION
The core production SOP is provider-neutral. Provider-specific behavior belongs only in `adapters/`.

### DECISION
Existing canonical/current skills remain at their canonical paths. `skills/chat/` references them instead of copying them.

### CLASSIFICATION
`skills/KFB Setup Game Design/KFB Design-Bootstrap_v02/` classified `LEGACY_REFERENCE` for current production routing. Its durable rules remain valuable; its project/module/asset state is not assumed current.

### CLASSIFICATION
`skills/KFB PetStudio/KFB Pet Studio v12 (WS0)/` classified `LEGACY_REFERENCE`; FrankenStein Studio v16 is the current actor/look/pose tool reference.

### CURRENT_REFERENCE
`skills/session-design-briefing.md` registered as current design-session reference, version 1.2.

### CURRENT_REFERENCE
`skills/kfb-cartoon-animation_v2.md` registered as animation/motion reference, declared version 2.0 and `canonical-draft` in its own header.

### CURRENT_TOOL
Asset Librarian registered with its repository path and live site.

### CURRENT_PROJECT_SSOT
`georg-doc/KFB-Travel-Globe` registered as Travel implementation SSOT.

### UNVERIFIED
Animation Lab receives a routing node but is not promoted to `CURRENT_TOOL` until its current implementation SSOT and site are explicitly pinned.
