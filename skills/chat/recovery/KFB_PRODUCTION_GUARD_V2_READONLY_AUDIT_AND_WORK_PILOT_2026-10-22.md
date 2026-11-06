# KFB Production Guard V2 · Read-only audit and single Work pilot · 2026-10-22

**Status:** RESEARCH / PROPOSAL ONLY — no implementation authorization, no adoption, no WS0/WS1 interruption.
**Outcome:** Prevent stale briefs, decision drift and false-green handoffs by hardening WS0's **existing** brief gate and adding an optional GitHub-native WS0 ↔ WS1 receipt. Do not introduce a second guard, SSOT, runtime, dashboard, producer or admin process.
**Owner:** Existing WS0 production steering / `30_DECISIONS`, with existing KFB Production Control as the human-readable index. WS1 remains the sole game/runtime writer. WSA Work is an independent bounded **candidate builder**, not a new production owner.
**Mode:** RESEARCH now → optional BOUNDED_SLICE Work pilot only after authorization. No Stage/Site, no merges, no Live, no spend or secrets.

## Verified source snapshot (read again at pilot start)

- Root source: `georg-doc/kayfabizarro` main `7e1c4ab0f143b2f1c0f33017eb473574f20190c9`.
- WS0 source: `georg-doc/kayfabizarro` `docs/kfb-decisions-register-2026-10-11` @ `377c8f4dade3e31a81cb313e578659a580f0ba76`. Canonical material lives under `tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS/`; Dropbox is WS0's workspace, **not** an independent new project truth.
- WS1 current game/status mirror: `georg-doc/kayfabizarro` `ws1/mvp-r1` @ `39777d0547e189bfed5325c897935079a48c7a42`. Earlier `ws1/r3f-frame` remains history/status; do not assume it is the newest game.
- WS1 game source: private `georg-doc/KFB-Stunt-Car-Race` `game/mvp-r1` @ `91a5fbf3b8a9fd38712cfddcad33def016b1ab50`; do not read private models/media into a public artifact.
- Current WS0 state: `30_DECISIONS/WS0_STATE.md`; WS0 source-of-owners: `30_DECISIONS/ARCHITECTURE_R1.md`; current decisions `decisions.json`, generated from `build_decisions.py`; active WS0 → WS1 briefing feed `replies/WS0_TO_WS1.md`; WS1 execution result `WS1_STATUS.md` on a relevant WS1 branch.
- Root contracts: `skills/chat/START_HERE.md`, `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `FRESH_CHAT_SLICE_PROTOCOL.md`, `KFB_PRODUCTION_CONTROL_CONTRACT.md`, `KFB_INDEPENDENT_EXECUTION_GUARD_CONTRACT_2026-10-05.md`.
- Private Dropbox diagnostic evidence checked: `/CLAUDE/KFB_HUB/30_DECISIONS/WS0_STATE.md`, `sync_github.sh`, `tools/status_latest.sh`, `GATE/*`; 2026-10-22 ToolBox regression postmortem. This pilot requires no ongoing Dropbox access for WS1.

## Important existing mechanism — **reuse, do not rebuild**

WS0 implemented `tools/brief_gate.py`, `tools/brief_domains.json` and `tools/BRIEF_GATE_PROMPT.md` in the register branch today. The mechanical pass chooses areas, checks cited V-IDs, local paths and explicit `superseded_by`, and builds a `GATE/*.pack.md`. A fresh Sonnet read-only critic can issue a `GATE/*.verdict.json`. Verified Dropbox output already **BLOCKED** the superseded HUD R2 in favor of R3 (V-681) and found omissions in the Character Registry brief. Preserve this useful behavior.

### Gaps evidenced in the current implementation

1. `V-681` says HUD_LAYOUT_R3 replaces HUD_LAYOUT_R2, but `V-680.superseded_by=[]` and `V-681.supersedes=null`. Thus a purely mechanical supersession check cannot detect the conflict. The fresh model reviewer caught it on this sample; that is not a deterministic guarantee.
2. `V-010` stays a valid overall J17 PASS but `V-102` corrects only the road color. Neither decision carries a structured per-attribute edge. Full-record supersession would incorrectly lose valid canon. Likewise `V-676` corrects part of `V-667`, and `V-672` corrects a relevant subclaim from `V-587`.
3. `brief_gate.py` checks a local workspace, not an exact current GitHub WS0 head + required owner/recipient head. No last-minute freshness receipt; an old `PASS` could be reused against an edited brief unless its fingerprint is bound to the verdict.
4. Domain routing auto-selects at most two areas. A real cross-area brief can lose an applicable contract. The agent prompt sees a selected, truncated pack (up to 60k chars **per** spec), not proof of complete coverage.
5. `WS0_TO_WS1.md` is a growing append-only message feed, not proof that WS1 ingested the latest decision. WS1 has no Dropbox access; status files and game source are on separate GitHub/private branches. `WS0_STATE.md` describes `tools/status_latest.sh` locally; `sync_github.sh` does not currently list that script among the files it mirrors.
6. The local `status_latest.sh` picks the greatest numbered status section across branches rather than establishing the actual current game owner/ref. It reads `raw.githubusercontent.com` unauthenticated: assess compatibility before the planned repo-private switch, without placing credentials in a report.
7. The current mechanical gate and critic prove **brief consistency**, not visual/scene/product acceptance. Maintain the separate builder/tester/independent critic/guard/Georg hierarchy. Never call auto-green a Georg PASS.

## Proposed minimal architecture

```
Georg decisions → WS0 existing build_decisions.py / decisions.json
                          │
                          ▼
             WS0 existing brief_gate.py
      + read-only GitHub freshness / scoped overrides /
        contract and receipt integrity checks (candidate)
                          │
         minimal exact GitHub-pinned brief receipt
                          │
                          ▼
   WS1 reads GitHub receipt (NO Dropbox dependency)
   WS1 ACKs consumed brief SHA + decision head + game head
                          │
        existing WS1 implementation / own Return
                          │
        independent evidence + Georg only when needed
                          ▼
        WS0 register closure + optional Hub routing
```

No event broker, no new Site, no second decisions database, no automatic polling loop. Do not replicate large source documents in every brief. A generated `receipt` is a **derived delivery artifact**, never an SSOT.

### Extension A · deterministic preflight on WS0's existing gate

- Input: existing brief, known owner/recipient, exact GitHub ref+commit and blob IDs, scoped effective decisions and pinned specs, latest relevant Return, human decision, and source allow/deny. Fetch these afresh; fail `STALE` or `REVIEW_REQUIRED` when authority cannot be resolved.
- Resolve record-level supersession and partial/field-level overrides **without deleting historical PASS properties**. Explicit ambiguity is reported instead of guessed. In pilot, use read-only fixtures for partial overrides; changes to `build_decisions.py` / `decisions.json` schema are a separate WS0 adoption gate.
- Detect missing obligatory domains rather than silently limiting to two; use manual forced domain scope when cross-cutting.
- Fingerprint the candidate brief and relevant source blobs; a reviewer PASS is valid only for those bytes/head pins.
- Output concise machine JSON with `READY/BLOCKED/REVIEW_REQUIRED/STALE`, exact conflicts/affected attributes and references. Block only creation/dispatch of **this brief**, never stop the parent game because a documentary gate failed.
- Critic receives an appropriately filtered subset **plus source proofs**; it does not become a second builder or repeat 500 KB of register on every consultation.

### Extension B · WS0 → WS1 GitHub handshake (only after A is proven)

- Publish small, non-sensitive `kfb.brief-receipt/0.1` alongside the **already-existing** WS0 briefing under its `replies/` route. Do not copy the `GATE/*.pack.md` or private media into the public repo. Existing WS0 sync already includes `replies/**/*`; validate this before any adoption.
- Fields: unique job/brief ID; writer=WS0; recipient=WS1; brief path/blob SHA; decisions branch/head; effective decision IDs and scoped overrides; protected properties; relevant specs/blobs; intended WS1 source ref; proof state; expiry/freshness policy; one next gate.
- WS1 writes one ACK in its **existing** owner Status/Return branch (not WS0 files): consumed brief SHA, consumed decision head, source ref, `ACCEPTED_TO_BUILD` or `BLOCKED_STALE/SOURCE_REQUIRED`. No ACK means **UNCONFIRMED**, not "WS1 has read it".
- A changed source ref is not automatically an invalid brief: compare the **relevant** changed decision IDs/blobs. Only material updates force preflight regeneration; unrelated changelog updates do not interrupt development.
- WS1's completion receipt keeps actual tests, visible before/after evidence, exact code/build commit and one next gate. WS0 ingestion updates canon only for actual accepted results. Dropbox-only private resources are referenced by authorized private GitHub artifact/verified manifest; lack of bytes remains SOURCE_REQUIRED, never generic substitution.

Example receipt fragment (proposal only, not a deployed schema):

```json
{
  "schema": "kfb.brief-receipt/0.1",
  "state": "READY",
  "jobId": "hud-current-source-check",
  "brief": {"path": "replies/BRIEF_EXAMPLE.md", "blobSha": "<resolved-at-build>"},
  "decisions": {"branch": "docs/kfb-decisions-register-2026-10-11", "head": "<resolved-at-build>"},
  "recipient": {"owner": "WS1", "sourceBranch": "ws1/mvp-r1"},
  "scopedOverrides": [{"older": "V-680", "newer": "V-681", "scope": "HUD layout"}],
  "mustPreserve": ["previously accepted HUD functions"],
  "humanStatus": "NOT_ACCEPTED",
  "proof": {"mechanical": "PASS", "critic": "NOT_RUN"}
}
```

### Extension C · staged, small, non-disruptive adoption

0. **Now, Web Chat:** read-only audit plus this plan; no Claude Code, no Work tokens for coding, no open runtime gate.
1. **One optional ChatGPT Work/WSA candidate:** start on the **fresh WS0 register branch**, create one review branch targeting that branch; patch the existing gate on that branch or add narrow helper functions/tests; no edits to WS0's working directory, WS1 runtime, central router, Hub, Site or Cloudflare. Keep it inactive until reviewed.
2. **Pilot on synthetic/historical read-only fixtures** (see below), record false positives and latency/size. No full-volume permanent Opus advice, no expensive render work.
3. **WS0/Georg adoption only after pilot evidence**: reconcile the patch when WS0 has a natural handoff; optional receipt ACK with exactly one WS1 pilot briefing. Require no retroactive rebrief of currently executing jobs.
4. **Later** optional GitHub CI advisory check, then required checks/branch protection only with Georg/admin authority and proven low false-positive rate. Game Development Studio can later provide sealed render deltas where actually needed; not part of briefing-preflight pilot.

## Minimum pilot tests (independent observable acceptance)

| Fixture | Expected |
| --- | --- |
| HUD R2 `V-680` after `V-681` | Deterministic **BLOCK**, even with no model invocation. |
| J17 `V-010` with corrected road color `V-102` | Preserve J17 PASS; only older road color overridden. |
| `V-667` shadow suggestion corrected by `V-676` | Correct scoped override; no global false supersession. |
| FB_CANON R3 earlier READY then Georg FAIL | Candidate never receives "human ready" or canonical promotion. |
| Source brief unchanged but WS0 relevant decision updated | **STALE**, explicit diff; unrelated changelog does not invalidate. |
| WS1 current `ws1/mvp-r1` versus old `ws1/r3f-frame` | Correct runtime owner/head required, not greatest paragraph count. |
| WS1 ACK absent, or points to another brief blob | UNCONFIRMED / BLOCKED_STALE, never implied delivery. |
| WS1 cannot access Dropbox-only source/private asset | SOURCE_REQUIRED, never substitute a new figure/fixture. |
| Legitimate brief with partial override and exact pins | READY; avoid overblocking productive work. |

These are **specified**, not run. No pilot PASS claimed.

## Cost / role limits

- Web Chat can inspect GitHub/Dropbox and write plan-only evidence without occupying Claude Code builder volume.
- WSA Work, if chosen later, executes the **single** candidate, not concurrent process redesigns; use its spare capacity for implementation/tests rather than a fresh large review bureaucracy.
- Sonnet/Haiku/Opus routing is a **later measured optimization**, not prerequisite for correctness. Existing read-only Sonnet gate should be reused; expensive advisor at high-risk design decisions only.
- Do not use WS0 Lead to design or supervise this pilot while it is actively steering the MVP. WS0 is only the later canonical reviewer and owner.
- No second runtime writer; no auto-merge, Live, publication, new managed Site, credential management, paid asset operations or cloud automation.

## Copy-ready future Work brief (NOT an instruction to run now)

> **Executor:** ChatGPT Work/WSA · one bounded research-to-candidate implementation.
> Read current `skills/chat/START_HERE.md`, `CHAT_GITHUB_KFB_STAGE_WORKFLOW.md`, `FRESH_CHAT_SLICE_PROTOCOL.md`; then read this planning audit, current `docs/kfb-decisions-register-2026-10-11` head, `WS0_STATE.md`, `ARCHITECTURE_R1.md`, `tools/brief_gate.py`, `tools/brief_domains.json`, `tools/BRIEF_GATE_PROMPT.md`, `decisions.json`, and the current `ws1/mvp-r1` status.
>
> **Outcome:** Produce one reviewable **inactive**, read-only hardening candidate for the existing WS0 brief_gate: exact source/brief revision checks, scoped supersession fixture support and minimal deterministic regression tests. Do not redesign `build_decisions.py` or replace its SSOT. Do not create a second guard. No changes to WS0 current branch, WS1 runtime, private media, Hub, Site, Cloudflare or main. Branch from the current WS0 register head; one draft PR targeting that branch. Keep receipt/ACK integration only as a proposal if outside the smallest pilot.
>
> **Independent execution:** Builder=Work candidate author (only candidate writer); Tester=deterministic fixtures; Critic=fresh read-only context for observed mismatches; Guard=existing Production Guard routing; Human gate=Georg/WS0 opt-in adoption only. Apply two-pass rule to the smallest seam.
>
> **Done when:** fixtures for R2/R3, partial J17 color override, stale source and one clean valid brief are run with actual counts; unchanged existing gate still works; exact GitHub branch/file readback passes; return files changed, diff, tests, no deployment, unresolved items and precisely one next gate. Never claim visual product acceptance from briefing tests.

## Return of this Web Chat audit

Repository: `georg-doc/kayfabizarro`; planning branch is documentation-only, based on recorded main. This audit examined existing current sources and two actual gate verdicts, but ran **0 code tests, 0 browser tests, 0 deployment tests**. WS0 owns its source, WS1 owns runtime, and **the next gate is Georg deciding whether to authorize the bounded read-only Work pilot**. No existing task or product milestone is altered.
