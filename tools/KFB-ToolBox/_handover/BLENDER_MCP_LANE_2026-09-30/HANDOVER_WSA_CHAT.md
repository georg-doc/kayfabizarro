# HANDOVER → WSA chat / Web Lead · Blender MCP lane · 2026-09-30

For Georg: this text is for the WSA chat / Web Lead. It lets them reconcile the state without knowing this Cowork chat. The shared channel is GitHub, branch `georg-doc-patch-3`. Nothing here is merged, staged or live.

## Paste-ready start prompt

> @GitHub
>
> Read `tools/KFB-ToolBox/_handover/BLENDER_MCP_LANE_2026-09-30/HANDOVER_WSA_CHAT.md` and `BACKLOG.md` in the same folder, on branch `georg-doc-patch-3`.
>
> Then read the two session cuts the lane worked against:
> - `tools/KFB-ToolBox/_inbox/KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/` (ToolBox Production-06, unpacked);
> - `tools/KFB-ToolBox/_inbox/KFB_RESIDENT_ATLAS_CLAUDE_DESIGN_SESSION_CUT_2026-09-30_r1/` (Resident Atlas S15: zip plus unpacked docs).
>
> Recon and plan only:
> 1. Where do the Motion Library v6, Fight data 0.3 and the eye-socket libs need to be wired (ToolBox, Resident Atlas, WorldBuilder, Hub)?
> 2. Which of the open items in `BACKLOG.md` need a WSA-only capability (multi-repo assembly, deploy, CI)?
> 3. Propose the router writeback (CHANGELOG, REGISTRY).
>
> Do not merge, promote, or redesign. Return: the exact heads read, the files that would change, and `WSA NEEDED` / `WSA NOT NEEDED` per backlog item.

## State in one screen (30.09.2026)

| Strand | State | Where |
|---|---|---|
| Motion Library v6 | 370 clips; `forwardYawDeg` for every clip, `travelYawDeg` for locomotion; `flightLabSet`; 3 catalogue notes corrected | `media/3D_Assets/Animations/KFB_Motion_Library/` (`RETURN_INTAKE_06.md`) |
| Fight Sandbox 01 → 02 → 03 | 03 = data 0.3 + Claude Design brief, not applied yet | `skills/chat/workflows/RESIDENT_FIGHT_SANDBOX_03_2026-09-30/`, data in `…/KFB_Motion_Library/fight/` |
| FrizzleBob eye socket + clay lids | Blender brief delivered; ToolBox P06 implemented it (acceptance 1–7 PASS); Georg's look review is open | `skills/chat/workflows/FB_EYE_SOCKET_CLAY_LIDS_01_2026-09-30/`, session cut ToolBox P06 |
| ToolBox P06 rigging follow-ups | mouth fit, lid rim roundness, clay texture strength (Georg 30.09) | `BACKLOG.md` R1–R3 |
| Flight lab (travel-globe card backside) | base clip set defined, no work started | catalogue `flightLabSet` |

## Owner split (unchanged)

| Owner | Owns |
|---|---|
| Blender MCP lane (Claude Cowork) | Measurement, clip bakes, data files, Blender reference builds, briefs. **No runtime owner.** |
| Claude Design · Resident Atlas | Fight Sandbox runtime (S15 → S16) |
| Claude Design · ToolBox | Rigging / FaceHost / clay material runtime (Production-06) |
| Web Lead / WSA | Router, Hub, integration and deploy |

## Router writeback (for the Web Lead to apply; not applied here)

### → `skills/chat/CHANGELOG.md`

```markdown
## 2026-09-30 · Blender MCP lane · Motion Library v6 + Fight Sandbox 03 + eye socket brief

### TESTED RESULT
- Motion Library intake 06:
  - 25 clips baked (5 duplicates skipped), catalogue 370 clips;
  - export verify: rest skeleton identical, round trip 0.0 cm;
  - every clip carries `forwardYawDeg`.
- Fight data 0.3 answers Georg's Sandbox 02 feedback:
  - facing convention, follow-up re-facing, dust-cloud impact beat;
  - lying lift (two curves), limb capsules;
  - hammer capsules and pop window, rig-scaled ring.
  - Proof renders were checked by eye.
- ToolBox P06 implemented the eye-socket brief; acceptance 1–7 PASS.

### LESSON
The catalogue `facingYawDeg` is a shoulder-line angle, not a direction. Runtimes that turned actors by it put fighters sideways or backwards. Use `forwardYawDeg` / `travelYawDeg`.

Next gates:
- Resident Atlas applies FIGHT_SANDBOX_03, then Georg picks the lift option and the hammer pop;
- Georg reviews the eye-socket look in ToolBox P06.
```

### → `skills/chat/REGISTRY.json`

```json
{
  "id": "blender-mcp-lane-2026-09-30",
  "kind": "data-and-briefs",
  "status": "DELIVERED-NOT-INTEGRATED",
  "branch": "georg-doc-patch-3",
  "owner": "Blender MCP authoring lane (Claude Cowork)",
  "handover": "tools/KFB-ToolBox/_handover/BLENDER_MCP_LANE_2026-09-30/HANDOVER_WSA_CHAT.md",
  "outputs": [
    "media/3D_Assets/Animations/KFB_Motion_Library/KFB_Motion_Library.catalog.json (2026-09-30, 370 clips)",
    "media/3D_Assets/Animations/KFB_Motion_Library/fight/KFB_Fight_Cartoon_Contact_03.json",
    "skills/chat/workflows/RESIDENT_FIGHT_SANDBOX_03_2026-09-30/",
    "skills/chat/workflows/FB_EYE_SOCKET_CLAY_LIDS_01_2026-09-30/"
  ],
  "doesNotOwn": ["Resident Atlas runtime", "ToolBox runtime", "Hub/router", "deploy"],
  "nextGate": "Resident Atlas applies FIGHT_SANDBOX_03 (acceptance 1-8)"
}
```

## Open items for reconciliation

1. **ToolBox P06 shares libs with P05.** `face-mount.v1.js` and `clay-lids.v1.js` changed additively, but P05, the Cube Pets and the full self-test 01–28e were not re-run (P06 TEST_REPORT).
2. **Consumers of `facingYawDeg`:** any consumer outside the Resident Atlas (WorldBuilder, Animation Lab) that turns actors by it has the same 90° bug. This needs a repo-wide search.
3. **itch.io clay textures:** they are in Dropbox only, with an unverified licence, and must not go to GitHub. This matters for backlog R3.
