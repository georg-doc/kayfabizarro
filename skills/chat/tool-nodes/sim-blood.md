# Project Node · DocCheck SimBlood

Status: CURRENT_PROJECT_SSOT
Kind: project
Updated: 2026-09-17

## Project SSOT

`georg-doc/doccheck/sim-blood/`

Start:
`https://github.com/georg-doc/doccheck/blob/main/sim-blood/START_HERE.md`

Recovery:
`https://github.com/georg-doc/doccheck/blob/main/sim-blood/RECOVERY.md`

Current WIPs:
`https://github.com/georg-doc/doccheck/blob/main/sim-blood/WIP_STATUS.json`

Living document:
`https://github.com/georg-doc/doccheck/blob/main/sim-blood/LIVING_SIMBLOOD.md`

## Current architecture

```text
Morphology Engine
→ typed cell pools + condition recipes + deterministic Field Composer

Microscope Engine
→ circular viewport + pan + zoom + focus + optics

Workflow Engine
→ Explore / Compare / Cell ID / Differential / Tele-Hematology Case
```

## Current POC asset direction

- normal RBC population: procedural/parametric first
- WBCs: isolated reviewed real/open assets and/or domain-tuned synthetic assets
- platelets: dedicated small asset family
- pathological RBC forms: dedicated curated morphology assets/generators
- finished smear images: reference/composition donors, not the preferred runtime representation

## Source-role map

- ASH / ICSH → morphology reference + QA
- NIH/NLM/TCIA/open datasets → production candidates after exact rights/provenance review
- CytoDiff → WBC-specific R&D benchmark; `CONDITIONAL_GO`
- Hemogram → tele-hematology workflow/use-case donor; not a code dependency

## Active WIPs

1. `field-composer-poc` — P0
2. `reference-assets` — P0
3. `cytodiff-audit` — P1
4. `telehematology-use-cases` — P1

Use the machine-readable project manifest for current status:
`sim-blood/WIP_STATUS.json`

## Visual convention

DocCheck UI accent:
`#cc0033`

Use subtly for controls/links/active states only. Never tint microscopy imagery with the brand color.

## Maintenance rule

Normal SimBlood documentation/recovery updates are maintained directly on `main`. Use a branch/PR only for risky implementation work where review/rollback materially helps.

After a substantial slice leave `Living + Changelog + Return + WIP_STATUS` resumable.

## Boundaries

SimBlood owns its morphology/field/microscope/workflow contracts.

It does not automatically own or redistribute third-party reference images, datasets, CytoDiff code, Hemogram code or upstream rights.
