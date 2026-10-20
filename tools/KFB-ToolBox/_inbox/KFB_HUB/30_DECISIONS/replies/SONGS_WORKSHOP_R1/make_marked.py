#!/usr/bin/env python3
"""WS-Song: baut aus <deck>.<rev>.draft.json die Markierung kfb.song.marked/1 (Kartentext/Triplet vs. eigene Brücken vs. Rahmen)
für die markierte Ansicht im Writers' Room. lyricsSha = sha256(suno.txt.rstrip('\\n')+'\\n') zur Erkennung veralteter Markierungen.
  python3 make_marked.py <deck>/<deck>.<rev>.draft.json [out.json]"""
import hashlib, json, sys
dp = sys.argv[1]; d = json.load(open(dp, encoding="utf-8")); stem = dp[: -len(".draft.json")]
lyr = open(stem + ".suno.txt", encoding="utf-8").read()
nonc = [i for i, b in enumerate(d["beats"]) if isinstance(b, str)]
first_card = next(i for i, b in enumerate(d["beats"]) if isinstance(b, dict) and "card" in b)
beats = [{"kind": "tag", "parts": [{"k": "tag", "t": "[Spoken Word]"}]}]
for i, b in enumerate(d["beats"]):
    if isinstance(b, str):
        beats.append({"kind": "intro" if i < first_card else ("outro" if i == nonc[-1] else "frame"), "parts": [{"k": "frame", "t": b}]})
    elif "tag" in b:
        beats.append({"kind": "tag", "parts": [{"k": "tag", "t": f"[{b['tag']}]"}]})
    else:
        p = []
        if b.get("pre"): p.append({"k": "bridge", "t": b["pre"]})
        p.append({"k": "card", "t": b["text"], "n": b["card"]})
        if b.get("post"): p.append({"k": "post", "t": b["post"]})
        beats.append({"kind": "card", "parts": p})
beats.append({"kind": "end", "parts": [{"k": "frame", "t": "Stay Fluffy, Folks!"}]})
rebuilt = "\n\n".join(" ".join(x["t"] for x in bb["parts"]) for bb in beats)
assert rebuilt.strip() == lyr.strip(), "Markierung passt nicht zum Songtext"
w = lambda k: sum(len(x["t"].split()) for bb in beats for x in bb["parts"] if x["k"] in k)
out = {"schema": "kfb.song.marked/1", "revision": d["revision"], "lyricsSha": hashlib.sha256((lyr.rstrip("\n") + "\n").encode()).hexdigest(),
       "words": {"card": w({"card"}), "bridge": w({"bridge", "post"}), "frame": w({"frame"})}, "beats": beats}
json.dump(out, open(sys.argv[2] if len(sys.argv) > 2 else stem + ".marked.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(stem, out["words"])
