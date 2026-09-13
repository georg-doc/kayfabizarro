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

### DECISION
Add `LIVING_MASTERPLAN.md`, `RECOVERY_PATH.md` and `SYNC_PROTOCOL.md` so chat/context loss does not require transcript reconstruction and active chats synchronize through GitHub shared state.

### CURRENT_PROJECT_SSOT
`georg-doc/KFB-Combat-Arena` registered as a project node and Combat Web registered as a synced consumer of the central router while Combat remains its own implementation SSOT.

### CORRECTION
The generic game-production workflow does not require Georg Freeplay before every merge. Human acceptance is a gate when look/feel/play or the project contract requires it; merge authority always comes from the current project contract.

### CURRENT_TOOL
FrankenStein Studio v16 node expanded with verified weapon attachment/mod presentation measurement through existing `weapon-mods.v1.js`. Projectile, damage, runtime combat aim and consumer-specific world facing remain outside Studio ownership.

### DECISION
Do not refactor Travel `cardrider.v1` into a generic shared rider-placement schema during an active consumer slice. Preserve the measured current contract; extract a generic additive successor only after real multi-consumer use proves the need.

### DECISION
Add `INBOX_PROTOCOL.md` for shared cross-project intake packages. The current staging path is `travel/wip/travel_globe_wsa/_inbox/`; its Travel location does not confer Travel ownership and inbox content is never automatically an SSOT.

### SAFETY / PUBLICATION
`georg-doc/kayfabizarro` is public. Shared inbox material must therefore be safe for public publication; confidential DocCheck/customer/patient/person-identifiable or otherwise restricted material must use an appropriate private channel/repository.

### UNVERIFIED PROJECT INTAKE
DocCheck Wissens-Pilli / Interactive Microlearning registered as a project intake. Intended destination: `micro-learning/wissens-pilli/`. Current source package: `travel/wip/travel_globe_wsa/_inbox/DC MicroLearning WS1/`. The target path exists only as a placeholder and is not yet promoted to a complete implementation SSOT/runtime.

### OWNER BOUNDARY
For Wissens-Pilli, current intake assigns CapsuleCarl actor preparation to FrankenStein Studio; the learner runtime owns cards/scene/interaction, while Animation Lab is a later motion consumer. Shared actor vocabulary does not authorize copying FrizzleBob measurements into CapsuleCarl.
