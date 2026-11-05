# KFB Story Stacks / Living Cards — HyperCard, Ren'Py, ink, Twine und H5P

**Stand:** 2026-11-05  
**Status:** GEORG APPROVED FOR PLANNING / RESEARCH · DONOR EVALUATION · NOT AN IMPLEMENTED FEATURE  
**Mode:** bounded RESEARCH, GitHub-first  
**Owning intake:** KFB Story / Fractal Almanac / Card & ChatterBox concepts; Georg creative authority, WS0 authoring/design recipient.  
**No new runtime owner:** existing Card Registry/Almanac, ChatterBox, Resident, World State, Audio and presentation owners remain authoritative.  
**Separate future application:** DocCheck medical microlearning (concept only; not a KFB runtime submodule). See [DOCHECK.md](DOCHECK.md).

## 1. Author decision, scope and product thesis

Georg expressly wants the **HyperCard/card-stack storytelling approach** retained for further KFB planning and conception, with an independently viable medical/DocCheck line. This is an **approval for conceptual exploration**, not a decision to adopt any dependency, art pack, storyboard, implementation schema, deployment or second engine.

**Thesis:** A KFB Card can be a stable semantic reference and an **entry into** linked interactive experiences: card → place/encounter → existing Resident speech/Social Call → existing world consequence → Almanac memory → further card. The Card remains a narrative/evidence object; not every card becomes a quest or power, and a relationship/link is not automatically a completed event.

The historical HyperCard principle (modifiable cards, stacks, links, background/content, event scripts) is more relevant to KFB than another visual-novel runtime. Content/interaction/state/presentation must remain separable.

## 2. External donor findings, source-checked 2026-11-05

| Donor / source | Proven capability and limits | Classification for KFB |
| --- | --- | --- |
| [Ren'Py — Why](https://www.renpy.org/why.html); [Web docs](https://www.renpy.org/doc/html/web.html); [license](https://www.renpy.org/doc/html/license.html) | Open-source visual novel / life-sim tooling; text-based scene/choice language, UI customization, rollback, save/load, audio. Browser export exists via WASM but has documented threading/network/browser constraints and remains Web (Beta) in docs. Commercial use is supported under its component licensing obligations. | **REFERENCE** for authoring legibility, branching and test fixtures. **REJECT** replacement KFB main runtime, second save/rollback owner. |
| [Eliot Gardepe: Ren'Py Hypercard Framework](https://egardepe.itch.io/hypercard) | Downloadable Ren'Py framework/asset pack including classic System 7 UI, font, sounds, menu/save/load/ADV customization. **Not a demonstrated complete implementation of original HyperCard's database/scripting authoring environment.** Listed license **CC BY-NC-SA 4.0**. | **INTERACTION-HISTORY / VISUAL REFERENCE ONLY**; no commercial reuse, no direct intake of UI, icons/fonts/audio, no mimicry of replacement branding. |
| [inkle ink](https://github.com/inkle/ink); [Inky](https://github.com/inkle/inky); [inkjs](https://github.com/y-lohse/inkjs) | Narrative scripting and preview tooling; inkjs runs compiled ink stories in browser/JS, zero-dependency runtime in its README, MIT license. Not an end-to-end game engine. | **STRONG EVALUATION CANDIDATE** for optional declarative story authoring / deterministic replay, ONLY behind existing event/state boundaries; inspect exact APIs/version/license before adopting. |
| [Twine](https://twinery.org/); [publishing](https://play.twinery.org/reference/en/publishing/publishing.html) | Graph-like, low-code branching authoring; variables/conditionals/media; publishes self-contained HTML. The project says created stories can be used commercially. | **BEST LOW-COST UX/AUTHORING REFERENCE** for node linking, previews, editorial navigation; do not inject a separate production runtime. Story-format licenses are separate. |
| [H5P Branching Scenario](https://h5p.org/branching-scenario); [authoring guide](https://help.h5p.com/hc/en-us/articles/7506761308957-Branching-Scenario-Guide); [repository](https://github.com/h5p/h5p-branching-scenario) | Decisions, branches, endings, optional scoring, mixed content; code repository lists MIT. Platform hosting/reporting and content libraries may have their own contracts. | **STRONG DOCHECK AUTHORING/LEARNING DONOR**, less compelling for KFB open-world integration. |
| [Adapt Framework](https://github.com/adaptlearning/adapt_framework) | Responsive HTML5 courses and SCORM delivery, GPL-licensed framework. | **FUTURE LMS EXPORT REFERENCE**, not first-choice KFB story tooling; commercial/plugin/license effects require separate review. |

**Evidence level:** Public documentation / GitHub source-description inspection only. **No package download, source-level integration inspection, code execution, licensing counsel, isolated asset screenshot or browser runtime QA.** An asset pack URL loading does not prove donor artwork usage.

## 3. Verified KFB receivers and boundary map

- **Fractal translation:** `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md` already defines Deck → world/biome → Card → POI/encounter → Resident worldview → Triplet → Billboard/media → Almanac memory → recombination. Our concept fits this existing chain; no new canon.
- **Card identity / art:** `media/kfb/index.json` (deck registry v2) and `travel/travel-v16/terrain-v16/card-registry.js` support normalized `packId`, card number/title/lore and deferred true-art rendering. `overworld/docs/MASTERPLAN_overworld.md` and `overworld/docs/GLOSSAR_KFB.md` distinguish Scene / Actor / Quest / Action Cards and define Fractal Almanac as persistent collection; do not conflate Action Cards and story evidence.
- **ChatterBox:** `tools/KFB-ToolBox/_inbox/KFB_CHATTERBOX_STUDIO_CLAUDE_DESIGN_SESSION_CUT_2026-10-05_r2/HANDOVER_WSA_CHATTERBOX_TRIPLET.md` binds content to PR #310, semantic selection to `prepareResidentTurn` PR #305, bubble presentation to existing renderer. Proposed story branches consume events/choices as **upstream context**, not a second line generator, dialogue state, LLM, or bubble renderer. Silence stays a valid outcome.
- **World:** `skills/chat/recovery/KFB_FOUR_ISLAND_STORY_RECOVERY_2026-10-08.md` and `skills/chat/CLAUDE_DESIGN_FOUR_ISLAND_STORY_VISION_R1_2026-10-08.md`: island history and lived relationships must generate layout. Card/UI logic cannot be a substitute for social/spatial world composition. Island R4 remains **NO MVP; F-R39 FAIL; World Model/Composition Synthesis Failure**; A/B visual gate retains precedence. No new geometry or R5.
- **Audio / Voice:** existing KFB mixer and optional Voice acceptances remain owners; branching creates no new AudioContext.
- **Existing source reuse policy:** isolated source object/actor/art proof before any later integrated presentation, never default placeholders.

### Potential flow — existing Golden Journey, NOT a new story

Use current **Dystopia / Doomsday Clock → Orc Band → Demon Lord birthday performance** as a fixture. A player opens or encounters the true Card; existing encounter/world signals decide whether the event is available; existing ChatterBox/choice routes handle speech and Social Call; the owning World/Quest system applies any allowed progression; Almanac remembers card/event provenance. Distinguish *viewing the card*, *being eligible for encounter*, *making a choice*, *world state change* and *replay*.

**Important:** Ren'Py-style time-travel/rollback cannot arbitrarily rewind persisted world events. Preview/backtracking is authoring-only unless the owning World State supports explicit semantics.

## 4. Candidate interaction grammar — PROPOSAL, not a new schema

An author should be able to connect:
`source reference → invitation/trigger → authored encounter beat → existing player choice → owned effect request → observable consequence → Almanac memory`.

Required separations:
1. **Reference/provenance:** card `packId + number`, existing Resident/POI/event IDs and source status.
2. **Narrative connection:** why one node leads to another, optional prerequisites, alternate entry/exit, readable copy.
3. **State:** only authoritative World/Quest/Resident owners commit state; story graph cannot independently mutate authoritative inventories or progression.
4. **Presentation:** reuse KFB card art, ink, bubble, scenelet and audio interfaces; no generic HyperCard/System-7 skin or duplicated UI chrome.
5. **Authoring/test:** inspect graph, preview in isolation, check unreachable nodes, broken refs, loops, invalid state, seeded replay, save/fresh-load handoff.

This is **not** a request to implement a JSON contract. Authoring must first demonstrate concrete value against known existing paths and source objects.

## 5. Comparative outcome

| Product need | Preferred study | Reason |
| --- | --- | --- |
| KFB authoring UX, map of story links | **Twine / HyperCard concept** | Link/stack mental model without requiring a foreign runtime |
| KFB deterministic branching as text/data | **ink + inkjs research candidate** | Interpreter can be tested behind existing JS interfaces; smaller than Ren'Py |
| KFB final visual/player experience | **Existing Card/ChatterBox/World systems** | Prevents replacement world, duplicate UI/audio/state |
| DocCheck short case-based interactions | **H5P Branching Scenario + Twine/ink comparisons** | Established learning design and optional reporting |
| DocCheck LMS/SCORM needs (later, conditional) | **H5P/Adapt ecosystem comparison** | Depends on actual product integration/accreditation requirements |

**Recommendation:** conceptually adopt **Living Cards / Story Stacks**; adopt **no dependency yet**. Treat Ren'Py primarily as narrative authoring example; original HyperCard as interaction model; itch.io asset pack as non-commercial historical visual reference.

## 6. Suggested smallest future proof (requires separate execution authorization)

In the **existing** KFB receiving owner (not new game/runtime): one true pinned Card (Doomsday Clock), one real Resident event, two source-backed routes/choices as applicable, exact canonical event IDs, one save/fresh-load consequence and a faithful Almanac provenance view. A graph/authoring inspection can use existing StoryMap/authoring donors but must first isolate their actual source objects/artwork. Verify that authored connections are easier to maintain than hard-coded branches, without changing event outcomes or speech.

Checks to require in such a later prototype: source IDs resolvable; deterministic replay; no orphan choices; no silent duplicate effects; no second renderer/state/audio; reload parity; one real end-to-end visible story path. **These are proposed checks, not tests run here.**

## 7. Sources and provenance

External primary references reviewed 2026-11-05:
- https://www.renpy.org/why.html
- https://www.renpy.org/doc/html/web.html
- https://www.renpy.org/doc/html/license.html
- https://egardepe.itch.io/hypercard
- https://twinery.org/
- https://play.twinery.org/reference/en/publishing/publishing.html
- https://github.com/inkle/ink
- https://github.com/inkle/inky
- https://github.com/y-lohse/inkjs
- https://h5p.org/branching-scenario
- https://help.h5p.com/hc/en-us/articles/7506761308957-Branching-Scenario-Guide
- https://github.com/h5p/h5p-branching-scenario
- https://github.com/adaptlearning/adapt_framework

Internal sources: owner SSOTs / Recovery / Handover cited in §3. These were read on GitHub `main` at `bf1a7ca132b3d10ab99e5de382df4964a0b007ae`. Evidence level: **READ_ONLY_RESEARCH**. No runtime/site change, no external assets committed, no adoption of third-party code.
