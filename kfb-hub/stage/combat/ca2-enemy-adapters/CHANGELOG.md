# CA2 Enemy Adapter · additive changelog

## 2026-09-20 · CA2-03A source + clip enumeration

### SOURCE
Pinned exact Skeleton Warrior, Orc Brute and Avian Swordsman models from Resident Atlas revision `891eadf…`; animation libraries pinned to `11d7df…`.

### MEASUREMENT
Skeleton Warrior: Rig_Medium · 23 bones · 2.59046 height.  
Orc Brute: Rig_Large · 23 bones · 4.19439 height.  
Avian Swordsman: Rig_Medium · 23 bones · 2.32418 height.

Medium clip sets enumerate 15 General / 11 MovementBasic / 22 CombatMelee. Large enumerates 6 / 3 / 16. Exact state candidates were frozen in `ANIMATION_MAP.json`.

### PUBLIC_VERIFIED
Workflow `35492632529`: branch and public **32/32 PASS**; public marker/navigation PASS; no browser/resource errors.

### NEXT
CA2-03B state playback only. No Arena runtime integration yet.
