# CA2 Enemy Adapter · additive changelog

## 2026-09-20 · CA2-03A
Exact Skeleton Warrior / Orc Brute / Avian Swordsman sources and Medium/Large clip inventories enumerated. Branch/public 32/32 PASS.

## 2026-09-20 · CA2-03B

### IMPLEMENTATION
Three exact actors visible together; one mixer each. Five-state map plays from exact rig-specific clips. Root/Hips position tracks are stripped, preserving external world-motion ownership.

### BRANCH
Deterministic five-state proof: **109/109 PASS**.

### PUBLICATION REPAIR
First public marker/navigation passed but playback timed out because `lab.mjs` reused the same URL as CA2-03A and could remain stale at Cloudflare. Added a versioned module URL and an explicit public module-body assertion.

### PUBLIC_VERIFIED
Final workflow `35493474052`: branch/public **109/109 PASS**; marker/navigation/module-body PASS; zero failed resources/page errors.

### OPEN
Georg visual state-playback gate only. Arena combat integration remains WSA-owned.
