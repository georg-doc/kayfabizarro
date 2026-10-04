# HANDOVER → WSA chat / Web Lead · ORB-P1 KayfaBizarros · 2026-09-23

Für Georg: Dieser Text ist für den ChatGPT-Web-Lead/WSA-Chat. Er fasst den Stand zusammen, damit dort abgeglichen werden kann, ohne diesen Cowork-Chat zu kennen. Geteilter Kanal ist GitHub (siehe `COWORKER_WSA_SYNC_BRIDGE.md` in PR #193).

## Paste-ready start prompt

> @GitHub
>
> Read `tools/KFB-ToolBox/_handover/KAYFABIZARROS_ORC_BAND_POC_2026-09-23/RETURN_ORB_P1_2026-09-23.md`, `POSTMORTEM_DRUMMER_v1-v4.md`, `CHANGELOG_ORB_P1.md` and `JOINT_LIMITS_AND_AUDIT.md` on branch `claude/orb-p1-return-postmortem-2026-09-23` (PR titled "ORB-P1 · KayfaBizarros band module · Return + drummer postmortem v0–v5").
>
> Refresh heads of PR #192, #193 and this PR.
>
> Reconcile only: Hub/router status for ORB-P1 and the Blender lane (see "Router writeback" below). Do not redesign the band, do not start a WSA workshop, do not merge or promote.
>
> Return: exact heads read, files changed, and whether any WSA-only capability is needed (expected: `WSA NOT NEEDED`).

## State in one screen

- **Leader** (Legacy Orc B + mic, 8-beat travel dance): Georg OK.
- **Guitarist** (Orc Raider + pink guitar, v4 hold): Georg OK.
- **Drummer** (Orc Brute + war drum): v1–v4 **FAILED**; v0 clip restored as v5 baseline. v0 itself exceeds the new wrist limit (99°), so it is a baseline, not an accepted clip.
- New candidate rule: **joint-limit audit gate** (`blender/orb_joint_audit.py`) before any review.
- Review HTML + v0–v5 GLBs + GIFs are in the handover folder; Dropbox holds the full working set.

## Owner split (unchanged)

- Coworker lead WS0: operational status, next ORB gate, review artifacts.
- Blender MCP lane (Claude Cowork): authoring only; no runtime owner.
- Web Lead: router/Hub reconciliation.
- WSA/Work: **WSA NOT NEEDED** — no step here needs local multi-repo assembly.

## Router writeback (for the Web Lead to apply; not applied in this PR)

### → `skills/chat/CHANGELOG.md`

```markdown
## 2026-09-23 · ORB-P1 · KayfaBizarros band module · Return + drummer postmortem

### TESTED RESULT
Blender MCP lane built a beat-normalised band module (leader bounce 8 beats, guitarist strum 1 beat, drummer 2 beats; 100 BPM / beat 1 at 0.465 s) with review HTML. Leader and guitarist: Georg OK. Drummer passes v1–v4: Georg FAIL; v0 drum clip restored 1:1 as v5 (max error 0 vs the v0 GLB).

### LESSON
Joint-limit audit on all versions: every drummer pass exceeded at least one limit (wrist up to 105°, forearm twist up to 180°). New candidate gate: no clip is shown before `orb_joint_audit.py` passes.

Handover: `tools/KFB-ToolBox/_handover/KAYFABIZARROS_ORC_BAND_POC_2026-09-23/RETURN_ORB_P1_2026-09-23.md`
Next gate: **ORB-D1 · drummer reference pick (Georg) before any new drummer animation.**
```

### → `skills/chat/REGISTRY.json` (update the Blender lane entry or add)

```json
{
  "id": "orb-p1-kayfabizarros-band",
  "kind": "content-candidate",
  "status": "PARTIAL",
  "branch": "claude/orb-p1-return-postmortem-2026-09-23",
  "owner": "Blender MCP authoring lane (Claude Cowork)",
  "handover": "tools/KFB-ToolBox/_handover/KAYFABIZARROS_ORC_BAND_POC_2026-09-23/RETURN_ORB_P1_2026-09-23.md",
  "humanAcceptance": "leader OK, guitarist OK (v4), drummer v1-v4 FAIL, v0 restored as v5 baseline",
  "tested": "joint audit v0-v5; v5 vs v0 GLB max error 0; review HTML under blob-blocking CSP OK",
  "doesNotOwn": ["Animation Lab runtime", "Resident Atlas placement", "Asset Librarian truth", "KayKit source assets"],
  "nextGate": "ORB-D1 · drummer reference pick (Georg)"
}
```

## Open items for reconciliation

1. PR #192 (Clown JUG-P1) is still open and `dirty` against main; this PR is based on main and does not depend on it.
2. `PERFORMANCE_ANIMATION_PILOT.md` (PR #193) says "wrist is a primary stroke driver"; Georg's direction for the orc is the opposite (strike from shoulder/arm, wrist only tips a little). The pilot should record Georg's stylisation before it is promoted.
3. Joint-limit calibration per action family is Georg's call (see `JOINT_LIMITS_AND_AUDIT.md`).
