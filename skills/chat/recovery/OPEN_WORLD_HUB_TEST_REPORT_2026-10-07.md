# Production Hub MVP living view · test evidence · 2026-10-07

Owner: existing KFB Production Hub. Baseline v10/source1013041360cc9c5cdb1990b4db81fab4e6c28236 loaded from Sites before edits. Exactly one saved/deployed v11/source6d9b51689c67a29b896e925fd4806e144f961ae2, deployment appgdep_6ac62ac353f881919a27f0867e90903e.

## Actual checks

| Surface / check | Actual result | Scope |
|---|---|---|
| Exact private production URL | ?view=open-world-mvp renders inside accepted Hub shell | Chrome signed-in profile, direct Site URL |
| JSON-only refresh | .3→.4 shown as GitHub LIVE after explicit refresh and whole-browser refresh | GitHub commit3b345b04b2964ba8aff02de9dcd1711872a40ef2 changes only JSON revision/updatedAt |
| Site identity | version11 / saved version / deployment / source identical before and after JSON change | native Sites record comparison |
| Desktop | 1440×1000 screenshot; current matrix,37required/6NB, binary NO MVP | actual Site |
| Mobile | 390×844; document scrollWidth390 at viewport390; MVP first before Inbox | actual Site |
| Console | zero error/warn messages in root published check | browser captured logs; no full HAR recorded |
| Network | live JSON, live board and style visibly loaded; no network errors surfaced in browser logs | no invented full network trace or forced production outage |
| Navigation regression | Heute, Briefings, Projekte, Entscheidungen, Archiv all display correct sections; MVP exact query routing | local browser test; source preserved, repeated published inspection by critic |
| Filters / search / details |16missing;6nonblockers;search Camera matches5; details show donor/role/scope/UNPROVEN/owner/proof/evidence | local actual browser test; published counterpart independently checked |
| Dependency navigation | query cleared, targetMVP004 opens;43rows exposed | local normal UI input |
| Theme | Paper/Dark toggle and dark state after reload | local actual browser |
| Pocket Inbox | dedicated temporary local test note saved, survived reload, removed after check | local origin; existing production keys/code untouched |
| Resident overlay | FrizzleBob loaded and title reports Idle_A; toggled off after check | local original overlay module unchanged |
| State preservation | theme/decisions/Seen/Inbox/Resident storage namespaces and all existing methods unchanged | exact accepted-source diff; no claim of reading every historical user record |
| Syntax | three inline/external script syntax checks passed | deployed shell/module + standalone reference |
| Loader/error fallback |8/8: live/no fallback, offline/local fallback, downgrade/truncation/duplicate reject, no-data error, complete derivedPASS, one missing overrides declaredPASS | controlled Node VM; not a forced live GitHub outage |

The initial full refresh immediately after commit still received raw GitHub revision.3. Explicit refresh after upstream propagation received.4; a subsequent full browser refresh also showed.4. No code repair, republish or transport substitution occurred. Routine updates remain GitHub JSON → Hub refresh.

## Evidence and limitations

NO_REPUBLISH_PROOF.json records exact native identities and changed JSON fields; loader-tests.json records8 meaningful loader tests. Live desktop/mobile and before/after screenshots are saved beside it. The independent recovery critic owns its separate deployed screenshot/report. All37 required rows remain nongreen; no Open World gameplay, source-isolated design, critic video, integrated save/reload, product Site, Cloudflare, merge or Live acceptance is claimed.

Existing local state code remained untouched except additive navigation/query behavior and a refresh event. Future ordinary copy/status/requirements/donor/evidence/counts/architecture data are supplied by the live JSON. Future behavior changes still require a genuine Site implementation task.
