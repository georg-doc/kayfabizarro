# KFB Work Escalation Card

Status: CURRENT TEMPLATE  
Use before spending Work/WSA quota.

## Outcome requiring Work

One sentence only.

## Exact source

- repo:
- branch:
- head:
- receiving repo/branch if cross-repo:

## Already proven before Work

- CI:
- local preview:
- Georg human review:
- source marker:

## Why Web / Claude Design / local preview cannot finish this

Name the missing capability precisely.

Examples:
- private binary transfer unavailable through Web connector;
- local multi-repo artifact assembly;
- OS/browser automation unavailable elsewhere.

If there is no concrete missing capability, **do not use Work**.

## Work may do

Closed list only.

## Work must not do

At minimum:

- no feature design;
- no optional asset repair;
- no visual tuning;
- no architecture expansion;
- no unrelated maintenance;
- no repeated debugging loop.

## Success check

Exactly one measurable outcome.

## Stop condition

At the first unexpected runtime failure:

1. capture evidence;
2. preserve candidate;
3. STOP;
4. return to Web for diagnosis/repair.

Work does not continue repairing unless Georg explicitly re-authorizes a new escalation.
