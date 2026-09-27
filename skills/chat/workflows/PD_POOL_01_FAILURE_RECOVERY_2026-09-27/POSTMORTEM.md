# POSTMORTEM · PD-POOL-01

## Goal

Prove the existing public-domain downloader safely with exactly one object each from:
The Met, Art Institute of Chicago, Wikimedia Commons and Internet Archive.

The slice was intentionally **not** a bulk import.

## What worked

- source ZIP and authoritative brief were recovered;
- source-package limitation was identified before inventing a new pool;
- bounded four-item manifest was created;
- Met candidate loaded in GitHub Actions;
- Commons candidate loaded in GitHub Actions;
- Internet Archive candidate loaded in GitHub Actions;
- no partial/failed result was committed as production truth;
- existing Asset Librarian and Billboard owners were preserved.

## Failure evidence

1. Initial real provider gate: AIC image transport returned HTTP 403; the other three candidates loaded.
2. Repair pass 1 introduced a literal `\\n` into Python source and failed compile.
3. Repair pass 2 was intended to remove it but post-write verification showed the same blob and same invalid line.
4. Final current-head run failed compile before provider execution.

## Proven causes

### PROVEN · current candidate compile failure
`tools/public_domain/fetch_pool.py` has a literal `\\n` between two assignments.

### PROVEN · missing original bulk-selection truth
The intake ZIP has no exported hit manifest and no selection UI.

### PROVEN · no durable source assets
The only successful three downloads occurred in a failed runner before the guarded persistence step.

## Hypotheses

### HYPOTHESIS · AIC 403 transport
AIC documents polite/specific API usage and the repair attempted provider headers, but that hypothesis was never exercised because the repaired source did not compile.

Do not promote that header change as a fix.

## Lessons

- Error: changed transport code and syntax in the same repair without verifying the exact post-write line first.
  Rule: after each connector write, verify the precise edited line before allowing CI to be the first syntax check.
  Early test: fetch lines 25–45 immediately after the write.

- Error: initial workflow checkout fetched the entire branch namespace and consumed most of the job startup.
  Rule: bounded asset jobs use shallow checkout unless history is required.
  Early test: inspect checkout config before first run.

- Error avoided: no bulk downloader was run without the selection manifest.
  Rule retained: discovery/selection truth must be recovered before bulk import.
  Early test: list ZIP/package contents before execution.

## Product conclusion

Work mode is **not required** for this job. The blocker is a small Web/GitHub transport gate plus the missing original selected-hit manifest, not a Work-only capability.
