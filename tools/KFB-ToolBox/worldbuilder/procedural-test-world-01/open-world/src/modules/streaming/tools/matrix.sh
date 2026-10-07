#!/bin/zsh
# Before/after matrix: passive core scheduling (?stream=0) vs streaming module, real-input run (60 s) + flythrough
# 12 m/s (60 s), seeds 1337 / 42 / 7. Results: src/modules/streaming/tools/out/m_<variant>_<mode>_<seed>.json
# A run whose page was reloaded mid-way (another agent saved a file → Vite reload) is retried up to 2×.
cd "$HOME/Dropbox/CLAUDE/KFB Open World" && . tools/env.sh
T=src/modules/streaming/tools
one() { # name mode seed extra
  for try in 1 2 3; do
    node $T/perf.mjs --mode $2 --secs ${SECS:-60} --seed $3 --name $1 --settle ${SETTLE:-2500} --attr ${=4} > /dev/null 2>&1
    grep -q '"reloadedMidRun"' $T/out/$1.json || break
  done
}
for seed in ${=SEEDS:-1337 42 7}; do
  for mode in ${=MODES:-run fly}; do
    for v in ${=VARIANTS:-before after}; do
      if [ $v = before ]; then one m_before_${mode}_$seed $mode $seed "--params stream=0"; else one m_after_${mode}_$seed $mode $seed ""; fi
    done
  done
done
python3 $T/table.py $T/out/m_*.json
