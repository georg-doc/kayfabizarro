#!/bin/zsh
# M3: Stufentests nacheinander (ein Browser zur Zeit), je höchstens 40 min (perl alarm), plus Regression M2 ohne Browser. Ausgabe test/out/m3/all.log
cd "${0:A:h}/../.."
mkdir -p test/out/m3/logs; : > test/out/m3/all.log
echo "HEAD $(git rev-parse --short HEAD) · $(date '+%Y-%m-%d %H:%M')" >> test/out/m3/all.log
npx vite build --logLevel error > test/out/m3/logs/build.log 2>&1 || echo 'FAIL build' >> test/out/m3/all.log
node scripts/m2/turn-circle.mjs > test/out/m3/logs/regression.log 2>&1; echo "INFO G-A3 $(tail -1 test/out/m3/logs/regression.log) · $(head -1 test/out/m3/logs/regression.log | cut -c1-220)" >> test/out/m3/all.log
if (( $# )); then tests=("$@"); else tests=(m3-a m3-b m3-c m3-d m3-e m3-f m3-g); fi # zsh teilt ${@:-…} nicht in Wörter
for t in $tests; do
  s=$(date +%s); perl -e 'alarm shift; exec @ARGV' 2400 node test/$t.mjs > test/out/m3/logs/$t.log 2>&1
  r=$(grep -E "^(PASS|FAIL)" test/out/m3/logs/$t.log | tail -1); echo "${r:-FAIL $t: kein Ergebnis} ($(( ($(date +%s) - s) / 60 )) min)" >> test/out/m3/all.log
done
echo DONE >> test/out/m3/all.log
