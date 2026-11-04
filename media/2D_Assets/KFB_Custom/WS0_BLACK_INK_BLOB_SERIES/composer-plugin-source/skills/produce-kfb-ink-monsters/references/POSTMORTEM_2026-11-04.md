# Postmortem · Veteran single-image run · 2026-11-04

Verdict: Georg **TOTAL FAIL**. Entire newly generated veteran run rejected. Image production stopped. No selected output, no Design PASS, no Librarian or game admission. Original uploaded designs remain authority.

## Intended outcome
Continue the existing rounded black-purple cartoon clay ink monster family, improve eye readability and make six personalities distinguishable without costume swaps. Six singles were proposed as an experiment.

## What actually happened
The executor assumed “continue” meant a new veteran six-pack and invented six roles. It viewed the original Veteran, but invoked six concurrent text-only jobs: no reference image paths or recent-image input parameter were supplied. Thus visual inspection did NOT become generator conditioning.
Prompts over-specified facial gimmicks and body deformation, including a knotted tongue and question-mark droplet, while underspecifying fidelity to reference modeling. Outputs visibly shifted toward angular/coarse clay and flat purple patchwork.
The executor praised visible novelty and treated expression difference as success despite a family/material mismatch. Georg rejected the watchman, then Funker, then the entire batch (“alle …”, “total FAIL”).
The first Promise.all execution emitted one saved scout before an output moderation rejection. The shared cell failed; other calls' completion was not established. A second attempt restarted five unresolved subjects, creating unnecessary cost/duplication risk. Two more local outputs were saved (Funker and Sergeant); the second cell was terminated after Georg's rejection. Remaining remote outcomes are UNKNOWN, not fabricated as completed.

## Evidence scope
Three locally present PNG outputs: Scout, Funker, Sergeant (see benchmark/evidence JSON hashes and Library IDs). Six initial calls and five restarted calls were invoked; 11 invocation attempts do not mean 11 completed images. No saved watchman file was present in the local three-file roster; Georg's explicit watchman rejection is preserved without inventing an output identity.
Provider error: HTTP400 moderation_blocked at output stage, category other; request ID 2f9987e4-c0d2-4445-a5bf-3737814a902c.
Tool names and parameters are known; underlying model/seed/gen IDs are not exposed here.
Zero runtime tests; zero new accepted game assets. No claim that this failed run proves singles inherently worse or better than sheets.

## Root causes and corrections
| Failure | Correction |
|---|---|
| Reference viewed but not passed | Require actual reference inputs and record role/parameters before generation |
| Six concurrent jobs before visual proof | One pilot first; inspect before expanding |
| Newness mistaken for style quality | Compare material, contour and prop quality to actual original at full/game scale |
| Personality made into arbitrary gag | Prioritize credible body acting, restrained expressions, no automatic knotted tongues/punctuation |
| Generic skill excludes old outputs without explicit-reference exception | Ink-specific route permits user's chosen originals as style inputs for new subjects |
| Warm red/orange eye default conflicts with new rule | White sclera + red iris + black pupil; glow opt-in |
| Batch-level promise rejection loses status | Per-job settlement; UNKNOWN tracked, no blind retry |
| Positive commentary outran evidence | Report observed differences and concrete defects; no self-issued Design PASS |

## Recovery boundary
Do not generate during SOP/plugin persistence. Next gate is one explicitly authorized source-conditioned pilot with side-by-side original comparison, then Georg's design decision before six-pack production.
Keep existing WS0/Librarian/WS1 ownership and historical 18-sheet intake separate. No public Stage is required for this SOP/plugin task.
