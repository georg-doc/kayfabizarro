# TEST REPORT · PD-POOL-F1 · 2026-09-27

Status: **PASS · ISOLATED AIC TRANSPORT PROVEN**

Owner: **Asset Librarian / Billboard Media**  
Repository: `georg-doc/kayfabizarro`  
Branch: `chatgpt-web/public-domain-pool-f1-aic-2026-09-27`  
Tested head: `c4f25c156e611a2fac7063becaf4fed3e3769638`  
Workflow run: `36285175091`  
Job: `108524466091`

## Gate

Exactly one provider/object was exercised:

- Art Institute of Chicago artwork `24645`;
- API rights gate requires `is_public_domain=true` plus a non-empty `image_id`;
- exactly one IIIF image request uses `/full/843,/0/default.jpg`;
- no generated image or sidecar is committed by the workflow.

## Actual checks

| Check | Result |
|---|---|
| GitHub checkout | 1/1 PASS |
| Python 3.12 setup | 1/1 PASS |
| `python -m py_compile tools/public_domain/fetch_pool.py` | 1/1 PASS |
| AIC API request | 1/1 PASS · HTTP 200 |
| AIC public-domain + image-id gate | 1/1 PASS |
| AIC 843 px IIIF request | 1/1 PASS · HTTP 200 |
| Non-empty image payload | 1/1 PASS · 238,585 bytes |
| SHA-256 recomputation | 1/1 PASS |
| Sidecar source URL ends in exact 843 path | 1/1 PASS |
| Sidecar API/download HTTP evidence | 2/2 PASS |
| Ephemeral proof / no workflow persistence commit | PASS |

Image SHA-256:

`e0aa55ad5865f5ffa3e0fb7087e91a1e11ce5d7f13f392ba0f493c513b7f0f56`

IIIF URL:

`https://www.artic.edu/iiif/2/b3974542-b9b4-7568-fc4b-966738f61d78/full/843,/0/default.jpg`

## Scope deliberately not tested

- Met, Wikimedia Commons and Internet Archive were not rerun;
- four-source 4/4 persistence was not rerun;
- second-run idempotence was not rerun;
- stale partial-file rejection was not rerun;
- no bulk selected-hit pool was reconstructed;
- no Asset Librarian registration occurred;
- no Stage or Live publication occurred.

## Conclusion

**PD-POOL-F1 passes.** The previously unresolved AIC transport path works from the GitHub-hosted runner with the isolated AIC request handling. This result proves only the AIC transport gate and does not itself satisfy the original four-source PD-POOL-01 acceptance contract.
