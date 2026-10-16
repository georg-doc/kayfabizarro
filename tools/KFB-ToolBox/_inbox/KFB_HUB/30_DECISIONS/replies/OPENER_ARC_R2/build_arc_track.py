"""Baut einen Suno-Track nach OPENER_ARC_MODEL_R1 mit Pool R2.
Aufruf: python3 build_arc_track.py <takes.csv> <out_prefix> <modes,komma> [overrides.json]
overrides.json: {"<card_number>": "<opener>" | ""}  (leer = kein Opener)."""
import csv, json, sys, random, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from opener_pool_r2 import POOL, FAMILIES
SECTIONS = [("HOOK",.07,.5,"AP"),("SETUP",.175,.18,"QF"),("COMPLICATION",.125,.35,"FDE"),("TURN",.065,.45,"DPX"),
            ("RISE",.30,.3,"AQE"),("CRISIS",.085,.75,"DEM"),("CLIMAX",.135,.5,"FRPM"),("RESOLUTION",.07,.3,"X")]
SILENCE = 6
def fam(op): return [f for f, m in FAMILIES.items() if op in m]
def main(src, out, modes, ovr_path=None):
    modes = set(modes.split(",")); rows = list(csv.DictReader(open(src, newline="")))
    cards = [r for r in rows if r["kind"] == "card"]; n = len(cards)
    tot = sum(s[1] for s in SECTIONS); bounds = []; acc = 0
    for name, frac, dens, cls in SECTIONS:
        k = round(n * frac / tot); bounds.append((name, acc, min(n, acc + k), dens, cls)); acc += k
    bounds[-1] = bounds[-1][:2] + (n,) + bounds[-1][3:]
    rnd = random.Random(out); used = {}; plan = {}
    def ok(op, idx):
        if op in used: return False
        if op == "Remember" and idx < 15: return False
        for f in fam(op):
            for o, j in used.items():
                if f in fam(o) and abs(idx - j) < 10: return False
        return True
    for name, a, b, dens, cls in bounds:
        span = list(range(a, b))
        if name == "RISE": span = span[:-SILENCE] if len(span) > SILENCE else []
        k = max(1 if name != "RESOLUTION" or b - a > 2 else 0, round(len(span) * dens))
        picks = [span[round(i * (len(span) - 1) / max(1, k - 1))] for i in range(k)] if span and k else []
        if name == "HOOK" and span: picks = sorted(set([span[0]] + picks))
        for i, idx in enumerate(picks):
            want = cls[i % len(cls)]
            cand = [o for o, (c, m, j) in POOL.items() if c == want and (modes & set(m))]
            cand += [o for o, (c, m, j) in POOL.items() if c == want and "any" in m]
            cand += [o for o, (c, m, j) in POOL.items() if c in cls and (modes & set(m) or "any" in m)]
            if name == "HOOK" and idx == 0: cand = ["You with the card in your hand"] + cand
            for o in cand:
                if ok(o, idx + 1): plan[idx] = o; used[o] = idx + 1; break
    sec_of = {i: name for name, a, b, *_ in bounds for i in range(a, b)}
    if ovr_path:
        ov = json.load(open(ovr_path))
        if ov.pop("_full", False): plan.clear()
        num2idx = {int(c["card_number"]): i for i, c in enumerate(cards)}
        for k, v in ov.items():
            i = num2idx[int(k)]
            if v: plan[i] = v
            else: plan.pop(i, None)
    lines = []; outrows = []; lno2idx = {c["line_no"]: i for i, c in enumerate(cards)}
    for r in rows:
        r = dict(r); txt = r["triplet"]
        if r["kind"] == "card":
            i = lno2idx[r["line_no"]]
            op = plan.get(i, ""); r["opener"] = op; r["arc_section"] = sec_of[i]
            r["opener_class"] = POOL[op][0] if op else ""
            if op:
                txt = op + POOL[op][2] + txt
        r["spoken_text"] = txt; outrows.append(r); lines.append(txt)
    suno = "[Spoken Word]\n\n" + "\n\n".join(lines) + "\n"
    open(out + ".suno.txt", "w").write(suno)
    with open(out + ".takes.csv", "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(dict.fromkeys(k for r in outrows for k in r))); w.writeheader(); w.writerows(outrows)
    ops = [r for r in outrows if r.get("opener")]
    print(f"{out}: {len(suno)} chars, {len(ops)}/{n} openers")
    for r in outrows:
        if r["kind"] == "card":
            print(f"{r['card_number']:>3} {r['arc_section'][:5]:5} {r.get('opener',''):36.36} | {r['triplet'][:70]}")
if __name__ == "__main__": main(*sys.argv[1:])
