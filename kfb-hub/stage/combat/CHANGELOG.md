# Combat Arena · Web Stage additive changelog

History is additive. Earlier entries are not silently rewritten.

## 2026-09-20 · CA2-01 initial selector/profile POC

### SOURCE / DONORS
Reused the public-verified KayKit Motion Lab donor pin `bdaea0648f27c0f16e0a737bfba237eb54dd4cbb`. FrizzleBob uses the existing Driver Graft reader/contract; GothGirl uses the exact pinned direct GLB. Legacy FrizzleBob remains a Combat Arena source reference and is deliberately not replaced with reconstructed geometry.

### IMPLEMENTATION
Added the stable Combat Web Stage landing and the isolated `ca2-actor-selector` route. The selector exposes candidate/hold status, five explicit gates, retained runtime owners and deterministic `?actor=` selection without Arena state writes.

### DONOR REVIEW REPAIR
Initial browser evidence exposed that the mounted Driver Graft was not receiving its donor `graft.update(dt,camera)` tick. Revision `64638a5818d7b7a75c0a96edd8777580669dcfa3` restores that existing tick; the corrected screenshot shows the expected live EyeRig rather than the pre-tick closed-eye state.

### EVIDENCE
Workflow run `35486077769`, job `106012591388`: **32/32 PASS**, 0 failed HTTP/resources, 0 page/console errors. Artifact `10597264982`, digest `sha256:f7346d76719f7857c52cc2c31b7b4f626497d565671e11125d0a42f1f89f4350`. Human acceptance remains open.
