# START HERE · WSA Claymation MVP Addendum · 2026-09-26

Status: **TOKEN-SPARSE RECON READY · PLANNING ONLY · NO RUNTIME / NO MERGE / NO LIVE**

Owner: **KFB planning / WSA review addendum**  
Repo: `georg-doc/kayfabizarro`  
Branch: `claude/coworker-next-sprints-2026-09-26`  
PR: **#231**

This is the Claymation-specific addendum to the already prepared general WSA dispatcher on PR #222. It does not replace Production Architecture PR #204, ToolBox, WorldBuilder, Race, HUB-CTRL, Asset Librarian or Blender owners.

## Georg priority correction · 2026-09-26

**Asset-01 texture/hash work is secondary and must not block an MVP.** Georg reports that the texture question has already been handled with Blender MCP. This checkpoint does not claim or reconstruct an unverified Blender artifact; it records the priority decision only.

Therefore:
- C0 byte/hash retrieval becomes `DEFERRED_NON_BLOCKING`;
- do not spend WSA/Work budget on another source crawl;
- any Blender result returns through PR #228 when its exact artifact/ref is available;
- the next bounded WSA product gate is the already-green WorldBuilder packaging gate: **WORLD-R2-STAGE-PREP-01** on PR #190.

## Read only these first

1. this file;
2. `WSA_CLAY_RECON_AND_MVP_PLAN_2026-09-26.md`;
3. `RECOVERY.md`.

Only open the detailed Coworker plan or source PRs when the selected gate needs them.

## Current truth in 10 lines

- General WSA/timeout routing already exists on **PR #222**; do not repeat the broad recon.
- Clay asset/Blender pipeline source is **PR #228**.
- Asset 01 r1 is **HUMAN_ACCEPTED · tile QA PASS · not Blender-proven**.
- Asset 01 r1 manifest SHA-256: `fb952516a6c77448b7107486256798ca201629a3c2fac4397121906dd3c04ea5`.
- Exact approved Asset 01 r1 PNG bytes are **not committed in PR #228** and were **not located by the bounded Dropbox ClayBound search**.
- Asset-01 byte/hash retrieval is **DEFERRED_NON_BLOCKING** by Georg; do not re-open visual approval or spend WSA budget on it.
- Asset 03 r2 is tile-green but human-look OPEN; r3 is seam-failed recovery and must not be used.
- PR #230 classifies external sources; Gemini rx1f is **NEEDS FIX**, Xargiv generated output is **CC BY with attribution**, not CC0.
- Main `622249e…` contains a newly uploaded `Asset 02 - ChatGPT-Bild ...png`, but no durable QA/approval record was found: treat it as **UNCLASSIFIED_ARRIVAL**, not accepted queue progress.
- Clay is a material/presentation line, not a new runtime. Existing ToolBox → WorldBuilder → OMS/Race consumers keep ownership.

## WSA job

WSA must not reopen the texture source gate. Treat the Clay/Blender line as a parallel owner lane awaiting an exact return ref. Use the newly available Work budget on one current product gate only: package the already-tested World r2 candidate for its direct Stage/Human review without changing World architecture.

## First practical MVP ladder

`C0 SOURCE LOCK · DEFERRED_NON_BLOCKING`
→ `C1 CLAY-B0 · handled in Blender lane / exact return ref pending`
→ `C2 CLAY-B1 one character/material-zone proof`
→ `C3 ToolBox consumer proof`
→ `C4 WorldBuilder one static patch/prop`
→ `C5 OMS Cologne hero-landmark A/B`
→ Race roadside/scenery only after Track Core prerequisites.

Track geometry remains owned by Track Core/Race. Blender remains oracle + material/set-piece atelier.

## Existing human/public surfaces

Clay briefing/recon only:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/clay-production/`

ToolBox r2 accepted-direction review:
`https://kayfabizarro.pages.dev/kfb-hub/stage/toolbox/production-01-r2/`

Do not claim a clay material is public/in-game from the briefing Stage.

## Timeout rule

For any expensive follow-up, use PR #222's C0 checkpoint rule:
persist owner + branch + `JOB_STATE`/Recovery before browser/CI/large implementation; timeout/stream-cache-expiry = **UNKNOWN**, inspect exact ref/run before retry.

## Exactly one next gate

**C0 · Resolve Asset 01 r1 exact bytes against the accepted SHA-256. If unavailable after the bounded source check, return SOURCE_REQUIRED; do not search broadly or reconstruct it.**
