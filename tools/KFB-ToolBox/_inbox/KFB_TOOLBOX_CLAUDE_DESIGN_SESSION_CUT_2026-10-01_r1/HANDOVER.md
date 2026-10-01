# HANDOVER · KFB_TOOLBOX_CLAUDE_DESIGN_SESSION_CUT_2026-10-01_r1

**Active page:** KFB ToolBox Production-08.dc.html. Do not edit P06 or P07 any further.

## State
- Rigging (P06 lane): eye socket + hinge/slide clay lids (LIDS-02), lid level + roll (LIDS-04, measured), floppy ears (FLOPPY-01), conforming painted mouth (MOUTH-FIT-01), contact AO with nose and ear classes.
- Editor (P07 lane, Resident Atlas S15): edit-layer.v2 + snap.v1 + grounding.v1 + one history. Local files in kfb-lib/, not pushed.
- Shared libs changed this session: clay-lids.v1 (`_lvl`), contact-ao.v1 (ear class, `ears` param), face-mount.v1 (Laute hold).

## Decisions taken
- Lid roll sign follows the intent (+ = outer corners up) rather than the brief's formula; documented for Blender MCP.
- Ear shadow: runtime rule, no GLB change. Ears also lose their floor shadow while "Ears cast shadow" is Off.
- Surface seat: splay adds onto the automatic turn (unchanged behaviour); the label now says so.

## Open
1. Standalone HTML boot stalls (see TEST_REPORT).
2. Re-run the full self-test and editor E1–E9 on P08.
3. LIDS-02 check 7: rounding 12 steps vs a looser tolerance (needs the Blender 12-step numbers).
4. Mouth-fit acceptance (NOT_RUN) and GLB measurement (Blender lane).

## Next Gate
Georg look call on P08: lids at Level / Roll ±5, ear roots from above, Laute on the model mouth.
