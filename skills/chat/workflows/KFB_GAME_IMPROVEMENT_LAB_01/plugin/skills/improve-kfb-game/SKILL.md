---
name: improve-kfb-game
description: Run KFB Game Improvement Lab in Webchat; five scope-aware expert perspectives identify high-impact low-effort game improvements, validate current source claims, and prepare source-backed handoffs. Handles optional focus, scope, mode and help. Use for 'KFB Game Lab', current KFB game playtest improvement, or KFB Game Lab help.
---

# KFB Game Improvement Lab · five-role Webchat workflow

## Routing and syntax

Invoke as `KFB Game Lab [help | focus=<topic> scope=<target> mode=<mode>]` or by conversational German instructions. Parameters can appear in any order, quoted for spaces; they are optional. Plain language overrides mechanical parsing if user intent is clear.

| Parameter | Default | Purpose |
| --- | --- | --- |
| `focus` | `auto` | Narrow attention to `art`, `animation`, `gameplay`, `gamefeel`, `narrative`, `claymation`, `performance`, or free text. |
| `scope` | `current` | Resolve one current game/slice/project/PR/issue/module from GitHub; free-text project or exact ref accepted. |
| `mode` | `discover` | `discover` (read-only); `build` (proposal until separate write authorization); `break` (deferred, disabled until separately authorized isolated test). |
| `help` | command | Show options and short usage only; do **not** inspect GitHub, invoke five roles, modify anything or launch a test. |

### HELP short response (German)

When user says `KFB Game Lab help`, `Game Lab -h`, `Game Lab --help` or simply `help` in the established Game Lab context, output this compact guidance, then stop:

**KFB Game Improvement Lab** — untersucht den aktuellen KFB-Slice mit einem Playtester sowie Art Director, Animation Director, Game Designer und 3D Developer. Ergebnis: eine belegte High-Impact-/Low-Effort-Empfehlung oder `NO ACTION`.

`KFB Game Lab` — automatische Untersuchung, lesend.
`KFB Game Lab focus=animation` — Animationen prüfen.
`KFB Game Lab scope="FrankenStein Composer"` — bestimmtes Produkt.
`KFB Game Lab focus=gameplay scope="PR #348"` — Schwerpunkt und Ziel.
`KFB Game Lab mode=discover` — Standard, keine Codeänderung.

Optional: `focus` (Standard `auto`), `scope` (Standard `current`), `mode` (Standard `discover`). `build` benötigt zusätzlich eine ausdrückliche Freigabe für Owner/Branch; `break` bleibt bis zu einem separaten isolierten Testauftrag gesperrt. `help` startet nichts.

## Source of truth and admissible capabilities

Source: `georg-doc/kayfabizarro`, existing workflow owner `skills/chat/workflows/KFB_GAME_IMPROVEMENT_LAB_01/BRIEF.md` on the current GitHub state (planning origin branch `planning/kfb-game-improvement-lab-01-2026-10-12`). Never treat a plugin-local copy as project SSOT.

Read current GitHub `skills/chat/START_HERE.md`, `skills/chat/CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `skills/chat/FRESH_CHAT_SLICE_PROTOCOL.md`, `skills/chat/KFB_GAME_BIGGER_PICTURE_REFERENCE_2026-10-04.md`, relevant receiving project SSOT/current Return and gates. GitHub state overrides recalled status. Do not read the entire asset library or choose arbitrary assets.

Resolve and echo requested/resolved focus, scope, mode, exact repo, branch/PR/head, allowed test surface and confidence. If `scope=current` is ambiguous, make a read-only routing result `TARGET_UNRESOLVED`, not a guessed write target. Focus never grants permission to enlarge current acceptance criteria.

## Five roles

1. **Playtester/Problem Scout**: evidence-first review, up to three real problems; differentiate documentary evidence from actual hands-on play. No pretend play.
2. **Art Director**: current slice visual legibility, composition, silhouette, claymation style.
3. **Animation Director**: real animation, motion meaning, acting, rig compatibility.
4. **Game Designer**: interaction, fun, player curiosity and KFB meta-story.
5. **3D Developer**: smallest source-reusing solution, technical effort, risk, reproducibility.

These are coordinated expert *perspectives* unless separate independent processes are actually run; never call them five independent runtime agents. Playtester must not independently accept code from his own team; use the established independent QA / Guard for substantive builds.

## Mandatory Scope & Claim Firewall

For each feature mark `TEST_NOW` (implemented/current), `VERIFY_CLAIM` (claimed complete, evidence missing), `NOT_IN_SCOPE` (legitimate future) or `UNVERIFIED` (unavailable evidence/surface). For each concern classify `IMPLEMENTATION_DEFECT`, `CLAIM_MISMATCH`, `EXPERIENCE_GAP` when current goal warrants it, or `FUTURE_SCOPE`. Missing future features are **not** present-slice failures. Consider gameplay context, meta-narrative and existing KFB claymation cartoon design as scale-appropriate reference, not always hard gates. Check implementation, claimed output and actual visual/runtime output separately.

Keep World PR #348 `STOPPED / NO MVP / F-R39 FAIL` and current Four-Island Story Vision A/B gate unless GitHub shows an explicit later authorized override. Do not restart R4/R5, invent replacement world assets, modify game runtime or auto-merge.

## Modes and execution

- `discover` default: inspect actual GitHub and available evidence, identify up to three scoped observations, four expert pitches, disagreement, one decision or `NO ACTION`, low-effort hypothesis and one next owner gate. Read-only product work. Only persist in GitHub/Production Control when the user authorizes a specific state change, following fresh branch/ref verification.
- `build`: **parameter is intent, not authority.** Only implement when user has separately authorized exact receiving owner, branch, bounded code change and testing. Otherwise produce a proposed build brief and mark `NOT_AUTHORIZED`. Builder is only writer; separate Tester/Critic/Guard verify; no Live auto-promote.
- `break`: **DEFERRED**. Respond with test plan/constraints; do not execute destructive probes without separately authorized isolated disposable environment, exact scope and capability confirmation. Do not attack public/third-party services or real player data. Preserve reproducible evidence when eventually authorized.

## Output

Compact report: actual scoped target and evidence quality; Scout observations with claim-status; four discipline pitches plus disagreements; one prioritized improvement or `NO ACTION`; expected impact, approximate effort with uncertainty, smallest existing-owner implementation seam, precise test/retest, unresolved facts and one next gate. Never invent browser passes or visible screenshots. No Hub/Cloudflare updates for routine research.
