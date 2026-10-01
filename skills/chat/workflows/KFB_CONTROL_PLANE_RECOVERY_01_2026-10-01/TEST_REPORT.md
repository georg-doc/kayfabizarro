# KFB Control Plane Recovery 01 · Test Report

Status: **TESTED CONTRACT PASS · BACKEND DEFECT STILL OPEN**
Date: 2026-10-01

## 1 · Briefing contract

Source:
- `briefing-contract.v1.mjs`
- test blob: `059360dee151d886a82e628b725f3e4134339568`
- runtime: Node `v22.16.0`

Result:
**13/13 PASS**

Covered:
- valid Web/GitHub briefing;
- valid Claude + immutable GitHub fallback;
- valid Claude + complete copy-text fallback;
- Site-only Claude briefing rejected;
- non-HTTPS active Hub URL rejected;
- mutable GitHub fallback rejected;
- valid bounded Work escalation;
- Work without escalation record rejected;
- Work with non-capability reason rejected;
- active briefing without model rejected;
- archived historical briefing allowed to remain minimal;
- active briefing without done-when rejected;
- safe-read policy fixed to workflow-first / limit <= 20 while backend defect remains open.

## 2 · Router consistency

Branch files were fetched from GitHub and checked in-memory.

Result:
**8/8 PASS**

Checks:
1. `REGISTRY.json` parses;
2. Registry no longer routes Fresh Chat to routine “next-day Work review”;
3. Fresh Chat protocol no longer hands ordinary slices to Work by default;
4. Claude adapter contains portable-source fallback rule;
5. Web-first workflow contains explicit `workEscalation.missingCapability` gate;
6. Web-first workflow contains `limit <= 20` safe-read rule;
7. central `START_HERE.md` routes to this recovery workflow;
8. Hub README names Production Control as current human Hub owner and no longer labels the old root as permanent owner.

## 3 · Production-Control recovery read

A WIP checkpoint for this exact workflow was written and then read back using:

`workflow = KFB-CONTROL-PLANE-RECOVERY-01`
`limit = 20`

Result:
**1/1 PASS**

The returned record preserved title, body, structured payload and source URL.

## Known failing evidence retained

Before this slice:
- unfiltered `kfb_web_read({limit:100})` failed server-side while resolving `production_files`;
- unfiltered `limit:20` succeeded.

This slice does **not** claim the server defect repaired.

Prepared escalation:
`WORK_ESCALATION_BACKEND_READ.md`.

## Not tested / not claimed

- Production-Control Site briefing generator has not yet adopted the validator;
- backend `limit:100` repair has not been performed;
- no Claude Design session was launched from a new portable briefing;
- no Work/WSA backend escalation was started;
- no Cloudflare Stage or public browser gate belongs to this technical slice.
