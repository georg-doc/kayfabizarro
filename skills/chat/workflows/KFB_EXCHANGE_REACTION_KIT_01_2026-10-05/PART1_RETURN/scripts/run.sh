cd /tmp/x1
for m in pair lid; do for r in M L; do python3 exch.py $m $r ex > ex_$m$r.log 2>&1; done; done
python3 exch.py heldpop M ex > ex_hp.log 2>&1; python3 exch.py knead M ex > ex_kn.log 2>&1
touch ex.done
