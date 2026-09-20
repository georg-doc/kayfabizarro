# CA2 Enemy Adapter · additive changelog

## 2026-09-20 · CA2-03A source + clip enumeration
PUBLIC_VERIFIED at the fixed Combat Stage. Exact Medium/Large clip inventories and first state map frozen.

## 2026-09-20 · CA2-03B state playback

### IMPLEMENTATION
Three exact actors are shown together. Each owns one local mixer in the isolated Stage. Root/Hips position tracks are removed from imported clips so no clip becomes a second world-motion writer.

### TESTED RESULT
Run `35493052845`: **109/109 PASS** on five deterministic state samples across Skeleton Warrior, Orc Brute and Avian Swordsman. World anchors remain stable; no rig collapse; grounding stays within the stated gate.

### OPEN
Public Cloudflare proof + Georg visual review. No Arena combat integration yet.
