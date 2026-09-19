# TEST REPORT · failure-recovery view

## Runtime / integration

- Race workflow `35459658425`: **SUCCESS**
- Hürth C1: **26/26 PASS**
- corridor: **17/17 PASS**
- TE-01: **17/17 PASS**
- combined browser checks: **60/60 PASS**
- page/script errors: **0**

## Packaged local Stage

- workflow `35460338909`: **SUCCESS**
- local proof: **22/22 PASS**
- boot: **963 ms** in recorded branch proof
- artifact: `10589368634`
- digest: `sha256:27ae96fc34dedc4a635c83669fe5ac8c127dd63d1111e27bcd4a39aa7e6462dd`

## Public Cloudflare gate

All three public attempts failed at the **first and only reached check**: `Cloudflare deployment marker`.

- attempt 1: **0/1 PASS**, browser stage not reached
- attempt 2: **0/1 PASS**, browser stage not reached
- attempt 3: **0/1 PASS**, browser stage not reached

Each attempt allowed 42 polls × 10 s.

Therefore:

- `DEPLOYED`: NOT PROVEN
- `PUBLIC_VERIFIED`: NO
- `HUMAN_ACCEPTED`: NO

The exact candidate remains technically valid locally; public publication is the blocked seam.
