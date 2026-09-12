# Integration Gate · KFB Asset Librarian v1

**Status:** READY FOR REVIEW · not merged

## Pre-merge facts

- `kayfabizarro/main` baseline at stack start: `133d9451c81d3e50bd38f5f8de752b1834192739`
- integration branch is based on the tested browser top branch
- development stack PRs: #2 → #7
- current aggregate branch is ahead of baseline and not behind it
- existing legacy catalog and deck owners are preserved

## Required before merge

- [x] aggregate diff against `main` inspected
- [x] full WSA handover added
- [x] machine-readable WSA manifest added
- [x] previous browser CI: 23/23 tests PASS
- [x] registry validator PASS
- [x] rigfacts validator PASS
- [x] consumer handoff smoke PASS
- [ ] aggregate integration PR CI PASS

## Required after merge

- [ ] `Refresh KFB Asset Registry` runs on real `main`
- [ ] workflow creates/updates `bot/asset-registry-update`
- [ ] generated Registry PR is reviewed
- [ ] `manifest.json`, `delta.json`, `problems.json`, `rigfacts-summary.json` checked
- [ ] generated Registry PR merged
- [ ] Asset Librarian browser visual/WebGL smoke completed
- [ ] only then mark browser rendering as TESTED

## Historical PR rule

PRs #2–#7 are development history. Once this consolidated integration path is accepted, do not merge those slices individually as well. They can then be closed as superseded/archived history.
