# KFB Site-First Persistence Workflow · 2026-09-29

## Status

Binding workflow policy for new KFB chats and production slices. It replaces GitHub-first chat choreography where a long browser/design session waits until the end for one large GitHub write.

## Plain-language rule

The **KFB Production Control GPT Site is the primary working surface** for Georg: current status, playable/tool links, briefings, decisions, uploads, test notes and error reports belong there first. GitHub remains the canonical source/archive for code, approved assets and small auditable checkpoints, but it is not the user-facing cockpit and must not block ordinary review work.

## Required routing

1. **Web Read for Georg/Codex** — a capable chat opens the current KFB Production Control Site and the named slice card before broad repository recon.
2. **Web Push** — decisions, JSON recipes, screenshots, error reports and ZIP/asset inbox uploads go to the Site-backed intake when available. Browser-local storage alone is not accepted as persistence.
3. **GitHub checkpoint** — write GitHub only when code, canonical assets, licences/checksums, recovery or release handoff requires it. Use small checkpoints: implementation, tests/evidence, then Return/Hub metadata.
4. **External agents** — every executable Claude Design/Coworker/Blender job has a complete, public GitHub `.md` briefing or a bounded downloadable package as its canonical cold-start source. A GPT Site route is optional convenience only and may never be the sole source: private/authenticated Site routes are not assumed reachable from Claude. Do not ask external agents to reconstruct the whole repository or await an unrelated deploy.
5. **Large asset packs** — upload once through Site intake, create manifest/checksums and an admission receipt, then perform one bounded canonical GitHub admission.

## Timeout-safe execution

- Persist the brief and source locks before expensive work starts.
- Save useful work in short checkpoints; never leave the only copy inside a chat response or browser state.
- A timeout or interrupted write is **UNKNOWN**. Inspect the exact Site receipt, GitHub ref or deployment first. Retry only when absent.
- After two failed repair passes on the same gate, freeze the candidate and publish a recovery packet.
- Do not hold human review hostage to Cloudflare/GitHub deployment. Report source and review-surface status separately and honestly.

## Execution Card required in every briefing

Every executable briefing states: owner/tool, exact model or strongest named fallback, reasoning effort, expected slice size, persistence route and stop rule.

Default routing:

- **Multi-owner playable integration:** Claude Coworker Desktop · Opus 5.5 High / strongest available coding model. Fallback: Codex GPT-6 Sol High.
- **Visual/UI/Clay grammar:** Claude Design Desktop · Opus 5.5 High / strongest available Design model. Technical integration follows in Coworker or Codex GPT-6 Sol High.
- **Repository + runtime integration:** Codex GPT-6 Sol High. Use Astra only for a bounded red-team/review problem that Sol cannot resolve.
- **Hub/Site sync, briefs and small maintenance:** Codex GPT-6 Sol Medium; raise to High only for real cross-system integration.
- **Simple bounded web intake/recon:** fastest suitable web model, Low/Medium. It must not own long integration or a large final GitHub write.

## Briefing contract for every new chat

Each brief includes one owner/outcome, its Execution Card, a directly reachable public GitHub briefing URL, optional WEB READ/WEB PUSH routes only where the executor can actually use them, exact GitHub pins only where needed, technical defaults, no repeated clarification for settled decisions, and final Site/Hub sync as part of the coordinating integration slice.

**Accessibility gate:** before a Hub card is labelled `STARTKLAR`, open its canonical briefing without relying on the GPT Site login. If the executor cannot reach it, the card is `BLOCKED · BRIEF NOT PUBLIC`, not ready. The private Site may render/copy the same text for Georg, but GitHub or the bounded export remains the external-agent source.

The user must not reconcile parallel briefing versions or decide technical labels such as polygon/triangle counts. Those measurements are executor concerns unless they measurably hurt playability or appearance.

## Current two-lane production rhythm

1. **World acceptance repair:** fix Ground walk/Movement-State timing, complete H0/K2 Clay facade treatment, reduce density to strong clusters, then rerun one Ground/Auto/T4/Flight play loop.
2. **Resident + Animation + Interactions:** complete the unified ToolBox/Resident/Animation UI and playable choreography recipes in the current design session; no fresh-chat restart and no editor-only interim gate.

No third parallel implementation lane starts until one lane returns a usable review surface or recovery packet.
