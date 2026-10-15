#!/bin/zsh
# M1: alle Prüfungen nacheinander (kein paralleler Browser), jede einzeln (ein FAIL bricht nichts ab), je Test höchstens 25 min (perl alarm). Ausgabe: test/out/m1/all.log + je Test ein Log.
cd "${0:A:h}/../.."
mkdir -p test/out/m1/logs
: > test/out/m1/all.log
# Prüfspur (Prüfer M1-5, N11): Stand, an dem die Runde lief; die Tests laden dist/ – vorher frisch bauen
echo "HEAD $(git rev-parse --short HEAD) · $(git status --porcelain | wc -l | tr -d ' ') geänderte Dateien · $(date '+%Y-%m-%d %H:%M')" >> test/out/m1/all.log
npx vite build --logLevel error > test/out/m1/logs/build.log 2>&1 || echo 'FAIL build' >> test/out/m1/all.log
run() { local name=$1; shift; perl -e 'alarm shift; exec @ARGV' 1500 "$@" > test/out/m1/logs/$name.log 2>&1; grep -E "^(PASS|FAIL|INFO)" test/out/m1/logs/$name.log | tail -1 >> test/out/m1/all.log || echo "FAIL $name: kein Ergebnis" >> test/out/m1/all.log }
run m1-rank-fence node scripts/m1/rank-fence.mjs
run m1-contract node test/m1-contract.mjs
run m1-move node test/m1-move.mjs
M1_HZ=120 run m1-move-120 node test/m1-move.mjs
M1_HZ=30 run m1-move-30 node test/m1-move.mjs
run m1-hz-equal node scripts/m1/compare-hz.mjs
run m1-fence node test/m1-fence.mjs
M1_NOFENCE=1 run m1-fence-gegenlauf node test/m1-fence.mjs
run m1-rueckwand node scripts/m1/probe-landranks.mjs
run m1-scene node test/m1-scene.mjs
run m1-handover node test/m1-handover.mjs
run m1-eyes node test/m1-eyes.mjs
run m1-bench node scripts/m1/bench.mjs
[ "$M1_ONLY" = 1 ] && { run f1 node test/f1.mjs; echo DONE >> test/out/m1/all.log; exit 0 }
for t in contract-static deps host s0 s1 s5a s5b s5c f1 actors b1 stage d1 d1stage g4 v243 palette cast; do [ -f test/$t.mjs ] && run $t node test/$t.mjs; done
echo DONE >> test/out/m1/all.log
