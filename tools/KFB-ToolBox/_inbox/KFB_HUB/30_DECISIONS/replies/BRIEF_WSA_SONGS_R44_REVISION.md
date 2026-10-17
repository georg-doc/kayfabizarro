# WS0 → WSA · Songs R4.3: external critic done → one revision (E18) · 17.10.2026

**Tier 0:**
1. The critic JSONs are in `replies/SONG_CRITICS_R1/` (one `<track>.critic.json` per track + `SUMMARY.md`), and all of them passed `song_gate.py critic`.
2. Your writer's room works through the flags **once** per track (the critic proposed no text; the wording is yours).
3. Then `song_gate.py lyrics` (current version on the register branch) + the triplet check, both exit 0. WS0 runs the second critic pass, which only judges, and then the songs go to Georg.

**Block:** recurring weaknesses across all tracks:
- performance and the KayfabeTips (B7: openers as a formula, "So"/"But" too often, bridges that don't carry);
- arc and frame (C9);
- sayability (A4).

Lowest scores: Money Trail part 2 (performance 2, arc 2), 1001 part 2 (performance 2, arc 2), Money Trail part 1 (performance 2), Alice (sayability 2).

Output: `<track>.r4.4.suno.txt` + songlines.json on the existing song branches, plus a short note per flag (fixed / deliberately kept + reason). Do not change the card core lines (A).
