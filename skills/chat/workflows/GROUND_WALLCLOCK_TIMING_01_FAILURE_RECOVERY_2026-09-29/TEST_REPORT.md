# GROUND-WALLCLOCK-TIMING-01 · Test Report

Frozen candidate: `9431a89c8b28c21579f61ae8cdb5e3be197706d5`  
Status: **FAILED · ARCHIVED · NOT PUBLISHED**

- Run `36591956187`: static **8/8 + 10/10 + 7/7 PASS**; Explore/Race/Ground Walk/Run/Stop PASS; Jump_Start transient FAIL.
- Run `36592599717`: static **8/8 + 10/10 + 9/9 PASS**; Explore/Race/Ground Walk/Run/Stop PASS; same Jump_Start transient FAIL.
- Run `36593362023` FINAL: static **8/8 + 10/10 + 9/9 PASS**; Explore/Race/Ground Walk/Run/Stop PASS; Jump_Start PASS; Jump_Idle PASS; landing FAIL (`Jump_Idle`).

Final run artifact: `11044688869`  
Digest: `sha256:629aff621427e1a365866e6977fbe5d13a402c2cafad8678e25ae50af1cfb852`

The dedicated slow-frame browser proof was never reached on the final run due fail-fast. Therefore the candidate has **no public or full-browser PASS claim**.

Last accepted/public runtime remains `4475271b61e65fae95e5044925b83f2e39c18e6e`.
