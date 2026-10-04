# Coordination plan · WSA (Chat / Work) ↔ Claude Coworker · 2026-10-04

- Written by: Claude Coworker, on Georg's request
- Basis: `skills/chat/KFB_ACTIVE_WORK_MAP_2026-10-04.md` (main), PR #348 (World Studio), PR #19 (Combat), recon branch `coworker/kfb-narrative-core-recon-01-2026-10-02`
- Goal: put the next tokens into the running game, not into routers. Four integration slices into World Studio, each with one owner, built from existing parts.

## 1 · Who does what

| Role | Does | Does not |
|---|---|---|
| **Georg** | plays, decides PASS / TUNE / FAIL, picks content | read decision files; decisions are asked in chat, with context |
| **WSA Chat** (normal web chat) | research, data curation, small planning, PUBLISH_ONLY to existing Sites | multi-system builds |
| **WSA Work** (high reasoning) | one bounded build run per slice | routers, registries, Hub refreshes, research |
| **Claude Coworker** | writes the slice brief from verified sources, reviews the result against the brief, GitHub write + read-back, tells Georg in plain German | runtime ownership |
| **Blender MCP lane** | measurement, clip/prop authoring with exact source contracts | runtime code |
| **Claude Design** | visual look work when a slice needs it | game state |

## 2 · Rules for every slice

1. One owner, one branch, one outcome, one next gate.
2. Reuse donors that are already tested; name them with head SHA in the brief.
3. Work runs only on a written brief. No integration before the owner and the data are clear.
4. Exactly **one Return per slice** (what was built, real tests, open items, one next gate). No extra router/registry/Hub rounds between slices.
5. Stop after two failed repairs on the same gate; freeze and report.
6. Georg is told in short plain German, early, when something is not what it seemed.
7. In-world content English; Resident speech from the shared Triplet pool; no Claude- or LLM-written sample dialogue in briefs (recon `RETURN_WSA.md` §3).

## 3 · Sequence

### Step 0 · Georg plays (no tokens)
- **W1** World Studio four islands: https://kfb-world-studio-mvp1.frizzlebob.chatgpt.site/
- **C1** Card-Hex Combat S3: https://kayfabizarro.pages.dev/kfb-hub/stage/combat/card-hex-ascent-coworker/
- Result per product: PASS / TUNE / FAIL, recorded once by WSA Chat in the work map. Only observed defects get one bounded repair run each.

### Slice S1 · Two Residents talk about one Card (KFB Town island) · first after W1
- **Owner:** World Studio / WB2 (PR #348) as consumer. No second dialogue or memory owner.
- **Donors:** #305 Triplet kernel `prepareResidentTurn` @`5b595a07` (deterministic, tested) · #306 presentation seam @`ba38ed7b` (14/14 + headed browser PASS) · NPC-CARD-SPEC-01 two-Resident card scene · World Studio `wb2-cards`, `wb2-journey`.
- **Outcome:** on KFB Town, the player brings one real Card to two Residents. They react with pool Triplets. The player answers with the four social calls as Monkey-Island buttons (KayfaBINGO! · KayfaBOGGLE? · KayfaBONGO! · BLÖDSINN! as reject/cancel); the call is the `socialOperator` input to #305. The Journey stores one receipt; a revisit changes one reaction.
- **No LLM** in S1 (deterministic, zero running cost). The LLM test bench (research note) comes later as its own slice.
- **Executor:** Claude Coworker writes the brief · WSA Work builds in one run · Claude reviews · PUBLISH_ONLY to the same Site.
- **Georg decides in chat before the brief:** which two Residents stand on KFB Town and which Card is carried.
- **Done when:** Georg plays it on the Site and says PASS / TUNE / FAIL.

### Slice S2 · One soundscape per island · parallel, cheap
- **Owner:** Audio (PR #350 / #352) supplies data; World Studio consumes.
- **Outcome:** one ambient bed per island plus the party jukebox, from the existing Audio catalog. No new audio architecture; the localized mixer bug in #352 is repaired only if this slice needs it.
- **Executor:** WSA Chat (data/mapping) · PUBLISH_ONLY.
- **Done when:** Georg hears four different islands.

### Slice S3 · Card-Hex Combat as an island entrance · only after C1 = PASS
- **Owner:** Combat (PR #19) keeps combat; World Studio owns only entry, return and world context.
- **Outcome:** one portal on one island → a Combat run → back to the same spot with the result.
- **Executor:** WSA Work, one run.
- **Done when:** Georg goes in and comes back without a reload.

### Slice S4 · Collect Fluff from the Life Trees · after S1
- **Owner:** World Studio; Fluff rules from PR #356 as data.
- **Outcome:** Life Trees (already on all four islands) drop Fluff; the player collects it; a visible counter. Building with Fluff comes later.
- **Executor:** WSA Work, small run.
- **Done when:** Georg collects Fluff on all four islands.

## 4 · On hold

- **LOCOMOTION-LADDER-01** (Blender brief, branch `coworker/locomotion-ladder-01-brief-2026-10-03`): **HOLD**. World Studio already consumes `KFB_KAYKIT_LOCO_SET_01` / `loco-blend.v1.mjs`, and the work map forbids a new general locomotion project. Run it only if W1 shows walking/running defects, and then narrowed to the set World Studio uses. The WSA locomotion branch stays frozen.
- **Resident lean-card rewrite** (recon R1): waits for Georg's Resident choices. Not blocking S1.
- **Billboard quote read-along:** waits for quote-pool quality (work map).
- **Provider comparisons, new Sites, router/registry rounds:** not before W1/C1.

## 5 · Channel and Production Control

**Channel:** GitHub. Each slice gets one folder with BRIEF, RETURN and evidence. WSA reads Claude's briefs there; Claude reads WSA's Returns there.

**Production Control plugin for Claude (smoke `KFB-CLAUDE-PC-MCP-SMOKE-01`): FAIL at connect, 2026-10-04.**
- Claude Cowork loads the plugin `kfb-production-control` v0.2.0; its skills (`control`, `recover`, `checkin`, `session-cut`) load.
- The MCP server does **not** connect: client error `JSON Parse error: Unrecognized token ' '`.
- A plain GET on `https://kfb-production-control.frizzlebob.chatgpt.site/mcp` and on `/.well-known/oauth-protected-resource` returns an empty body.
- Likely cause (not proven): the endpoint answers unauthenticated requests with an empty or whitespace body instead of JSON-RPC, or instead of `401` + `WWW-Authenticate` + OAuth metadata JSON. A remote MCP client then cannot start OAuth.
- Consequence: `checkin`, `recover` and `session-cut` cannot persist or read. `control` works only as written protocol. Claude uses GitHub as the channel until fixed.
- **Fix owner:** Production Control (WSA). Next gate: the endpoint returns valid JSON-RPC to `initialize`, or a `401` with OAuth discovery, then Claude repeats the smoke.

## 6 · Exactly one next gate

Georg plays W1 and C1. Then Claude asks Georg in chat for the two Residents and the Card for S1, and writes the S1 brief.
