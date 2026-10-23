#!/usr/bin/env python3
"""Baukasten-Song-Builder (BAUKASTEN_SPOKEN_LINES_SSOT_R1): <deck>.<rev>.lines.py -> suno.txt, triplets.csv, lines.json.
lines.py definiert DECK, REV, INTRO, OUTRO, L=[(cardNumber, pre, triplet, post)]."""
import csv, json, os, sys, runpy
p = sys.argv[1]; g = runpy.run_path(p); d = os.path.dirname(p) or "."
L, INTRO, OUTRO, stem = g["L"], g["INTRO"], g["OUTRO"], os.path.join(d, f"{g['DECK']}.{g['REV']}")
with open(stem + ".triplets.csv", "w", newline="") as f:
    w = csv.writer(f); w.writerow(["line_no", "kind", "card_number", "opener", "triplet"])
    for i, (n, a, t, b) in enumerate(L, 1): w.writerow([i, "card", n, "", t])
json.dump({"schema": "kfb.triplet-set.opener/1", "deckId": g["DECK"], "revision": g["REV"], "bestOf": [x[0] for x in L],
           "intro": INTRO, "outro": OUTRO, "lines": [{"cardNumber": n, "pre": a, "triplet": t, "post": b} for n, a, t, b in L]},
          open(stem + ".lines.json", "w"), indent=1, ensure_ascii=False)
beats = ["[Spoken Word]", INTRO] + [" ".join(x for x in (a, t, b) if x) for n, a, t, b in L] + [OUTRO, "Stay Fluffy, Folks!"]
txt = "\n\n".join(beats) + "\n"; open(stem + ".suno.txt", "w").write(txt)
ow = sum(len((a + " " + b).split()) for _, a, _, b in L) + len(INTRO.split()) + len(OUTRO.split()) + 3
cw = sum(len(t.split()) for _, _, t, _ in L); ops = [a for _, a, _, _ in L]
dbl = [i for i, b in enumerate(beats) if b.count(":") > 1]
print(f"{g['DECK']} {g['REV']}: cards {len(L)} chars {len(txt)} card% {round(100*cw/(cw+ow))} dup {[o for o in set(ops) if ops.count(o)>1]} colons>1 beats {dbl}")
