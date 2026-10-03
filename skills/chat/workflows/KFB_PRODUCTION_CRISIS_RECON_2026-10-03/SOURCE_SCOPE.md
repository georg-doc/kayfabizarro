# Shared source scope for both crisis audits

Both reviewers must inspect the same current repository state. Chat memory and old briefs are leads, not proof.

## Mandatory current sources

- current `main` of `georg-doc/kayfabizarro`;
- `skills/chat/START_HERE.md` and its current routed owners;
- `skills/chat/REGISTRY.json`;
- `skills/chat/LIVING_MASTERPLAN.md`;
- `skills/chat/PLAIN_LANGUAGE_HANDOFF_STANDARD.md`;
- `skills/chat/KFB_PRODUCTION_CONTROL_CONTRACT.md`;
- `skills/chat/recovery/POSTMORTEM_WSA_LEAD_BRIEFING_CONTROL_FAILURE_2026-10-03.md`;
- current Return/Recovery files for World, Travel/Ground, Race/Drive, Combat, Town/NPC, Audio, Animation, VFX, ToolBox and Hub/Control Plane;
- all currently open pull requests that claim to modify or supersede those owners;
- current state of the separate owner repositories where applicable, especially `KFB-Stunt-Car-Race`, `KFB-Travel-Globe` and `KFB-Combat-Arena-CMVPA`.

## Known issues to verify, not blindly accept

- The Living Masterplan and Registry contain old dates and may describe superseded owners or priorities.
- A large number of open draft pull requests exist, including stacked work and conflicting candidates.
- Some accepted knowledge exists only in branch-local or session-cut paths.
- Some local or Site returns claim success without a merged receiving owner.
- The failed mixed-source Ground prototype is not an accepted locomotion baseline.
- KayKit Character Animations 1.1 is the first source for KayKit-native locomotion; Mixamo is gap-fill only.
- PR #344 is a large working/recovery container and must not be merged wholesale merely because it contains useful corrections.
- Existing Production Control and plugin work may help transport and recovery, but must not be treated as proof that every executor can already read and write the same store.

## Evidence rule

For every important claim, link the exact GitHub file or pull-request diff and state one of:

- **proven current**;
- **working candidate**;
- **accepted donor, not integrated**;
- **stale or superseded**;
- **conflicting**;
- **not found / not proven**.

Do not resolve contradictions by picking the newest timestamp or largest test count. Identify the actual receiving owner and whether it consumes the candidate.

## Communication rule

The main report is written for Georg, not for another engineer. Technical identifiers belong in an appendix. Every recommendation must name:

- who acts next;
- what they do;
- what they must not change;
- what Georg needs to do, or `nothing`;
- what visible or playable result follows.

