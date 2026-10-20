#!/usr/bin/env python3
"""WS-Song Schreibwerkzeug (kein Tor): baut aus <deck>/<deck>.<rev>.draft.json den Songtext (.suno.txt) und
songlines (kfb.songlines.r4) mit Beat-Zuordnung, Quell-Pins und visualMotifs (visualVerified:false).
  python3 build_track.py <deck>/<deck>.<rev>.draft.json
Draft-Beats: "Text" | {"tag": "Crowd Cheering"} | {"card": n, "pre": "...", "text": "<wörtlicher Kartenteil>", "post": "..."}"""
import hashlib, json, os, re, sys
H = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(H, "../../../../../../.."))
sha = lambda p: hashlib.sha256(open(p, "rb").read()).hexdigest()

dp = sys.argv[1]
d = json.load(open(dp, encoding="utf-8"))
deck_path = os.path.join(ROOT, "registry/assets/v1/decks", d["deckId"] + ".json")
deck = json.load(open(deck_path, encoding="utf-8"))
rep = deck["representations"]["cardTextJson"][0]
media_path = os.path.join(ROOT, rep["path"])
media = json.load(open(media_path, encoding="utf-8"))
art = {c["cardNumber"]: c.get("artworkPrompt", "") for c in media.get("cards", [])}

beats, cards = ["[Spoken Word]"], []
for b in d["beats"]:
    if isinstance(b, str):
        beats.append(b)
    elif "tag" in b:
        beats.append(f"[{b['tag']}]")
    else:
        line = " ".join(x for x in (b.get("pre", ""), b["text"], b.get("post", "")) if x).strip()
        idx = len(beats)
        beats.append(line)
        if b.get("cont"):   # Fortsetzung derselben Karte in einem späteren Beat
            prev = next(c for c in reversed(cards) if c["cardNumber"] == b["card"])
            prev["beats"].append(idx)
            prev["cardText"] = (prev["cardText"] if isinstance(prev["cardText"], list) else [prev["cardText"]]) + [b["text"]]
        else:
            cards.append({"cardNumber": b["card"], "beats": [idx], "cardText": b["text"]})
beats.append("Stay Fluffy, Folks!")
stem = dp[: -len(".draft.json")]
open(stem + ".suno.txt", "w", encoding="utf-8").write("\n\n".join(beats) + "\n")

nums = [c["cardNumber"] for c in cards]  # Reihenfolge des ersten Auftritts
sel = sorted(nums)
full = [c["cardNumber"] for c in deck["cards"] if c["cardNumber"] not in d.get("metaSkipped", [])]
motif = lambda n: re.sub(r"\s*Mood:.*$", "", re.sub(r"^.*?Subject:\s*", "", art.get(n, ""))).strip().rstrip(".")
sl = {"schema": "kfb.songlines.r4", "deckId": d["deckId"], "deckTitle": deck["title"], "revision": d["revision"],
      "sourcePins": {"deck": {"path": os.path.relpath(deck_path, ROOT), "sha256": sha(deck_path), "sourceCommit": deck.get("sourceCommit")},
                     "media": {"path": rep["path"], "rawPinned": rep.get("rawPinned"), "sha256": sha(media_path)}},
      "performer": d.get("performer"), "performers": d.get("performers", []), "residentHome": d.get("residentHome", ""), "structure": d.get("structure"), "introType": d.get("introType"),
      "selectionMode": "FULL_DECK" if sel == sorted(full) else "BEST_OF", "bestOf": sel, "bestOfReason": d.get("bestOfReason", []),
      "omitted": d.get("omitted", {}), "orderMode": "deck" if nums == sel else "edited", "orderReason": d.get("orderReason", ""),
      "metaSkipped": d.get("metaSkipped", []), "cards": cards, "songLineChanges": d.get("songLineChanges", []),
      "cues": d.get("cues", []), "refrain": d.get("refrain", ""), "bpmException": d.get("bpmException"),
      "visualMotifs": [{"cardNumber": n, "motif": motif(n), "source": "pdf.json artworkPrompt", "visualVerified": False} for n in sel]}
json.dump(sl, open(stem + ".songlines.json", "w", encoding="utf-8"), indent=2, ensure_ascii=False)
open(stem + ".synopsis.txt", "w", encoding="utf-8").write(d["synopsis"].strip() + "\n")
txt = open(stem + ".suno.txt", encoding="utf-8").read()
print(f"{os.path.basename(stem)}: {len(txt)} Zeichen, {len(beats)} Beats, {len(cards)} Karten ({'edited' if nums != sel else 'deck'} order)")
