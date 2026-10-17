# REA / Reverse Engineer Anything — KFB applicability and options R1

Date: 2026-10-16
Mode: RESEARCH / OPTIONS ONLY — no implementation, no installation, no publication, no runtime owner
Repository: georg-doc/kayfabizarro
Research branch: research/kfb-rea-reverse-engineering-options-r1-2026-10-16
Owner: KFB cross-project research / Chat Production planning; receiving owners retain their existing SSOTs
Trigger: https://x.com/hanakoxbt/status/2110067711363457244
Source post verified in public mirror: https://twstalker.com/hanakoxbt/status/2110067711363457244

## Executive assessment

The post claims REA can let AI agents reverse engineer software to the binary level, making rapid reconstruction of a Cursor-like editor possible. Underlying functionality is real; the shortcut from investigation to production-quality clone is promotional, not established. REA is chiefly a local CLI/MCP orchestration and evidence layer over analysis engines, not a new universal decoder, complete source-code recovery service, or replacement for implementation and testing.

Official project: https://github.com/morluto/rea ; https://rea.tools/
Official npm package: rea-agents. Source MIT, other native decompilers and target software under separate licenses.
Checked 2026-10-16: official latest GitHub release rea-agents-6.5.0, published 2026-10-14.
Project's own exemplars: DX-Ball position-to-pan native reconstruction, Notion Electron clipboard bridge, TH04 DOS angle calculation. These are bounded feature investigations; they do not prove arbitrary full-app equivalence.
The repository says results contain evidence, unknowns and limitations. Require actual address/source-map provenance AND behavioral parity tests, not bare 'agent says' confidence.

## How it differs from existing tools

- REA: one agent-facing interface for native binaries (Hopper/Ghidra/IDA, as installed), JS/Electron static analysis, web/CDP observation, network captures, .NET, Android/JADX, packages/resources and more. Exact support varies by platform/provider and release; not all capabilities work everywhere.
- Browser DevTools + Playwright: first choice for ordinary front-end appearance, user flow, network inspection, behavior capture, screenshots. No REA needed.
- Ghidra / IDA / Hopper / Rizin: first choice for skilled native reverse engineering. REA can make these accessible to coding agents and carry evidence between steps.
- jadx / ILSpy: narrow choice for APK / .NET. REA worthwhile only when multiple tools/evidence steps are needed.
- Normal GitHub source review: always the first choice where real source is already available; REA adds analysis overhead in such cases.

## KFB priority matrix (proposals, NOT approved implementation)

| Candidate | Value | Why / limits | Receiving owner |
|---|---|---|---|
| Older own tools, assets, poorly documented packaged formats | HIGH when actual black box | Recover import/export structures, file/IPC boundaries and calls; source/package inventory first | Existing ToolBox/Asset Librarian or owning tool SSOT |
| External Electron/desktop feature investigation | MEDIUM-HIGH selectively | Target one permitted feature, evidence and parity; useful for an independently implemented utility | Existing receiving tool, after separate authorization |
| KFB browser viewer, cards, motioncomic and animations | LOW-MEDIUM | DevTools/Playwright and source-first donor comparison are cheaper; REA as isolated comparative diagnostic only | Existing viewer/motioncomic owner |
| KFB 3D/Game/WorldBuilder technical diagnostics | LOW initially | Might trace JS bundle, shader strings and communication where source unavailable; cannot recover artistic look, rig/meshes/materials, gameplay quality from disassembly | Existing 3D/game owners ONLY, no parallel shader/physics/camera runtime |
| Third-party commercial app wholesale recreation, e.g. Cursor | LOW/NO as KFB roadmap task | High review/legal/equivalence cost, original backend/models/data unavailable | Not authorized |
| Own Procreate brush export or legacy file format compatibility | MEDIUM, separate future interest | Evaluate only exact owned/exported files and needed compatibility question; avoid tackling Procreate proprietary program by default | Separate explicitly approved owner |
| General abandoned-app preservation / interoperability / security research | HIGH in appropriate context | Strong bounded educational/recovery use, with authorized specimen, test oracle and evidence ledger | Independent project |

## Example workflow / proof gate

NO installation, no REA execution and no KFB runtime changes occurred in this R1 research.

Proposed *one* future bounded POC (requires Georg/WS0 priority):
1. Pick one legitimately inspectable, already isolated JS/Electron sample **with known source**, preferably a non-production KFB example or open-source fixture. Do not target WB2 or a working owner directly.
2. Compare ordinary source inspection / DevTools against REA on the exact same one functionality. Pin an explicit rea-agents package release; inspect setup plan, avoid automatic upgrades; run on local sandbox without real credentials.
3. Require isolated source/donor screenshot or trace BEFORE any proposed integration. REA source file loaded or call address found is not proof of design parity.
4. Record costs (tokens/minutes), tool and host prerequisites, runtime side effects, exact facts found, unknowns, evidence addresses, false assertions, and verified behavior test cases. A valid clean-room output must pass independent behavior tests.
5. Decision: keep REA as on-demand research tool only if it produces more evidence or saves meaningful human work versus simple DevTools/source review. Otherwise archive POC; no runtime owner changes.

## Boundaries and caveats

- Local inspection does not imply model-provider privacy: selected tool outputs may be sent to the LLM provider. Isolate private code/secrets and corporate or user health data.
- Static inspection does not execute the target; runtime/proc/browser capture can execute/interact using local permissions. Use authorized disposable VM/test copies.
- Decompilation cannot recover missing backend servers, proprietary model weights, production data, art direction, editable DCC sources, subjective design quality or original source code reliably.
- Use target-specific authorization and license/legal review for commercial software, especially disassembly, license restrictions, reuse of assets and distributed clones. MIT covers only REA-authored code.
- No new MCP authority on live KFB apps. Keep source-first/donor isolation, single owning runtime, current GitHub SSOT/Returns, independent checks, human accept/reject gate as already required.
- No GitHub Pages / githack / raw CDN / local path can be offered as KFB public Stage. This research has no Site/Stage need.

## Sources checked

- Original post mirror: https://twstalker.com/hanakoxbt/status/2110067711363457244
- Original official project and README: https://github.com/morluto/rea
- Official latest release checked: https://github.com/morluto/rea/releases/tag/rea-agents-6.5.0
- Official docs: https://github.com/morluto/rea/blob/main/docs/roadmap.md
- Independent overview with hype/limitations: https://www.onfirstlaunch.com/blog/reverse-engineer-anything-rea-explained (2026-10-12)
- KFB routing: skills/chat/START_HERE.md, CHAT_GITHUB_KFB_STAGE_WORKFLOW.md, FRESH_CHAT_SLICE_PROTOCOL.md, REGISTRY.json, LIVING_MASTERPLAN.md, RECOVERY_PATH.md

## Research decision

Recommendation: WATCH / OPTIONAL POC, NOT ADOPT INTO KFB RUNTIME.
No fake 'tested' claim or GitHub/star popularity as efficacy proof. Exactly one next possible gate: REA vs baseline on one source-known isolated artifact, under the existing tool owner and only when a real black-box question justifies it.
