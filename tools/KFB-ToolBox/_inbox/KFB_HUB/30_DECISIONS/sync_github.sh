#!/bin/zsh
# Mirror the register, Plan R1, PROJECT_STATE and references to GitHub (V-117 persistence duty).
# Usage: zsh sync_github.sh "short message"
set -e
MSG=${1:-"docs(steering): register mirror"}
cd ~/KFB_GitHub_sync
export GIT_SSH_COMMAND="ssh -i ~/.ssh/kfb_kayfabizarro_deploy -o IdentitiesOnly=yes"
REPO=git@github.com:georg-doc/kayfabizarro.git
BR=docs/kfb-decisions-register-2026-10-11
git fetch -q $REPO "+refs/heads/${BR}:refs/remotes/gh/${BR}"
H=~/Dropbox/CLAUDE/KFB_HUB/30_DECISIONS; L=~/Dropbox/CLAUDE/"KFB Island Worldbuilder Lab"
BASE=tools/KFB-ToolBox/_inbox/KFB_HUB/30_DECISIONS
export GIT_INDEX_FILE=$(mktemp -t kfbidx); rm -f $GIT_INDEX_FILE
PARENT=$(git rev-parse gh/$BR); git read-tree $PARENT
add(){ local b=$(git hash-object -w "$1"); git update-index --add --cacheinfo 100644,$b,"$2"; }
for f in DECISIONS.md decisions.json CHANGELOG.md build_decisions.py START_HERE_STEERING.md REVIEW_STEUERUNG_R1.md sync_github.sh; do [[ -f "$H/$f" ]] && add "$H/$f" "$BASE/$f"; done
add "$L/CLAUDE.md" "$BASE/LAB_CLAUDE.md"
for f in KFB_WORLDBUILDER_PLAN_R1.md PROJECT_STATE.md PHASE_C_DONORS_R1.md POSTMORTEM_JOYRIDE_REGRESS_R1.md POSTMORTEM_MVP1_STAGE1_R1.md BASELINE_ACCEPTED_R1.md ACCEPTANCE_INDEX.md ISLAND_ANATOMY_RULES.md SCALE_CONTRACT_K2.md; do add "$L/docs/$f" "$BASE/lab-docs/$f"; done
for d in "$L"/docs/golden/candidates/*_2026-10-1[1-9](N/); do for f in "$d"/*(.N); do add "$f" "$BASE/lab-docs/golden/${d:t}/${f:t}"; done; done
T=$(git write-tree)
if [[ $T == $(git rev-parse "$PARENT^{tree}") ]]; then echo "no change"; exit 0; fi
C=$(printf '%s\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>\n' "$MSG" | git commit-tree $T -p $PARENT)
git push -q $REPO "${C}:refs/heads/${BR}" && echo "pushed ${C}"
rm -f $GIT_INDEX_FILE
