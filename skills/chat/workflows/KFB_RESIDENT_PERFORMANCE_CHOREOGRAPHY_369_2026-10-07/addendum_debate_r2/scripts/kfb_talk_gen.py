"""KFB talk rule engine (pure Python, no Blender): seeded conversation timelines from a tagged clip pool.

Inputs : data/talk_pool.json (windows of prepared clips), data/talk_rules.json (knobs), a cast and a seed.
Output : per-actor event timelines + a readable turn log + the outcome. The Blender side (kfb_talk.build_nla)
         only plays what this produces; the same engine can run in the three.js runtime later, where the
         dialogue layer (LLM social exchange) would pick the move instead of the weighted dice here.

Actor dict: {id, rig 'M'|'L', engagement 0..3, fuse 0..1 (how fast heat rises against them),
             stubbornness 0..1 (how rarely they give in), stance 'pro'|'contra'|'neutral' (Speaker's Corner)}
"""
import json, math, random
from collections import deque


def wchoice(rng, weights):
    items = [(k, w) for k, w in weights.items() if w > 0]
    tot = sum(w for _, w in items); r = rng.random() * tot
    for k, w in items:
        r -= w
        if r <= 0: return k
    return items[-1][0]


class Engine:
    def __init__(self, pool, rules, seed):
        self.R = rules; self.rng = random.Random(seed); self.seed = seed
        self.clips = pool["clips"]
        self.recent = {}; self.tl = {}; self.walks = []; self.log = []

    # ------------------------------------------------------------------ clip choice
    def pick(self, actor, functions, role, target=None):
        rig = actor["rig"]; rec = self.recent.setdefault(actor["id"], deque(maxlen=self.R["recentWindow"]))
        recshort = {r[1] for r in rec}
        c = [x for x in self.clips if x["rig"] == rig and role in x["roles"] and any(f in x["functions"] for f in functions)]
        if role == "speaker":
            c = [x for x in c if x["energy"] >= self.R["minSpeakerEnergy"]] or c
        if not c: return None
        w = {}
        for x in c:
            s = 1.0
            if target is not None:
                d = abs(x["intensity"].get(role, 2) - target); s *= (3.0, 1.0, 0.35)[min(d, 2)]
            if x["id"] in {r[0] for r in rec}: s *= 0.03
            elif x["short"] in recshort: s *= 0.35
            w[x["id"]] = s
        cid = wchoice(self.rng, w); x = next(y for y in c if y["id"] == cid)
        rec.append((x["id"], x["short"]))
        return x

    def place(self, actor, clip, start, maxlen=None, label="", kind="clip"):
        a0, a1 = clip["a0"], clip["a1"]
        if maxlen is not None and a1 - a0 > maxlen: a1 = a0 + max(30, int(maxlen))
        ev = {"short": clip["short"], "variant": clip["variant"], "a0": a0, "a1": a1, "start": int(start),
              "mirror": bool(clip["mirror"] and self.rng.random() < 0.5), "bi": self.R["blend"], "bo": self.R["blend"],
              "label": label, "kind": kind, "win": clip["id"]}
        self.tl.setdefault(actor["id"], []).append(ev)
        return ev["start"] + (a1 - a0)

    def fill_speaker(self, actor, t0, length, functions, heat, label):
        target = 1 + round(heat / 1.5); t = t0; end = t0
        while t < t0 + length - 20:
            c = self.pick(actor, functions, "speaker", target)
            if c is None: break
            end = self.place(actor, c, t, maxlen=t0 + length - t + 12, label=label, kind="speak")
            t = end - self.R["blend"]
        return max(end, t0 + 24)

    def fill_listener(self, actor, t0, t1, weights, label="listen"):
        g = self.R["signalGap"][actor["engagement"]]
        t = t0 + self.rng.randint(*self.R["listenerDelay"])
        while t < t1 - 20:
            f = wchoice(self.rng, weights)
            c = self.pick(actor, [f], "listener", None)
            if c is not None:
                end = self.place(actor, c, t, maxlen=t1 + 30 - t, label=f, kind="listen")
            else:
                end = t + 24
            t = end + self.rng.randint(*g)

    def cut(self, actor, at, drop_after=True):
        evs = self.tl.get(actor["id"], []); keep = []
        for e in evs:
            ln = e["a1"] - e["a0"]
            if e["start"] >= at:
                if drop_after: continue
            elif e["start"] + ln > at:
                e["a1"] = e["a0"] + max(16, at - e["start"]); e["bo"] = min(e["bo"], 8)
            keep.append(e)
        self.tl[actor["id"]] = keep

    def band(self, heat):
        return sum(1 for b in self.R["heat"]["bands"] if heat >= b)

    def listen_weights(self, listener, move):
        R = self.R; e = listener["engagement"]
        if e == 0: return dict(R["listenAbsent"])
        w = dict(R["listen"][move])
        if e == 1:
            for k, v in R["listenPoliteMix"].items(): w[k] = w.get(k, 0) * 0.5 + v
        if e == 3:
            for k, v in R["doggedBoost"].items(): w[k] = w.get(k, 0) * v if k in w else w.get(k, 0)
        return w

    def outcome_clips(self, actor, t, funcs, label):
        for f in funcs:
            c = self.pick(actor, [f], "listener" if f in ("approve", "bored", "sulk", "mock", "surprise", "doubt", "oppose", "celebrate") else "speaker")
            if c is None: c = self.pick(actor, [f], "speaker")
            if c is None: continue
            t = self.place(actor, c, t, label=label, kind="outcome") - self.R["blend"]
        return t + self.R["blend"]

    def walk_off(self, actor, t, length=150):
        self.walks.append({"actor": actor["id"], "start": int(t), "end": int(t + length)})
        self.cut(actor, t)
        return t + length

    # ------------------------------------------------------------------ debate (two residents)
    def debate(self, actors, max_frames=620, start=10, heat=0.4, first=0):
        R = self.R; rng = self.rng; pat = {a["id"]: R["patience"][a["engagement"]] for a in actors}
        spk = first; t = start; turns = 0; last_move = {a["id"]: None for a in actors}; outcome = None
        while True:
            S, Lr = actors[spk], actors[1 - spk]; band = self.band(heat)
            w = {m: v[band] for m, v in R["moves"].items()}
            if S["engagement"] == 0:
                for m, k in R["absentSpeakerBias"].items(): w[m] = w.get(m, 0) * k
            for m in R["softMoves"]:
                w[m] *= max(0.05, 1 - S["stubbornness"]) * R["stubbornDamp"]
                if last_move[Lr["id"]] in R["softMoves"]: w[m] *= 2
            if S["engagement"] == 3: w["insist"] *= 1.3
            if last_move[S["id"]] in w: w[last_move[S["id"]]] *= 0.5
            move = wchoice(rng, w)
            lo, hi = R["turnFrames"][S["engagement"]]
            L = int(rng.randint(lo, hi) * R["shortMoves"].get(move, 1.0))
            h0 = heat
            end = self.fill_speaker(S, t, L, R["moveFunctions"][move], heat, move)
            self.fill_listener(Lr, t, end, self.listen_weights(Lr, move))
            inter = False; I = R["interrupt"]
            if (Lr["engagement"] >= I["minEngagement"] and heat >= I["minHeat"] and move not in R["softMoves"]
                    and rng.random() < I["p"] * (Lr["engagement"] - 1)):
                at = t + int(rng.uniform(*I["atFraction"]) * (end - t))
                self.cut(S, at); self.cut(Lr, at - 4); end = at; inter = True
            eff = R["heatEffect"][move]
            eff = eff * (0.5 + Lr["fuse"]) if eff > 0 else eff * (1.2 - Lr["stubbornness"])
            heat = max(0.0, min(R["heat"]["max"], heat + eff + (0.1 if inter else 0)))
            pat[Lr["id"]] -= R["patienceCost"].get(move, 0) + (R["absentPatienceCostPerTurn"] if Lr["engagement"] == 0 else 0)
            turns += 1; last_move[S["id"]] = move
            self.log.append({"t0": t, "t1": end, "speaker": S["id"], "move": move, "heatBefore": round(h0, 2),
                             "heatAfter": round(heat, 2), "interruptedBy": Lr["id"] if inter else None})
            if heat >= R["outburstHeat"]: outcome = ("outburst", S["id"] if S["fuse"] >= Lr["fuse"] else Lr["id"])
            elif pat[Lr["id"]] <= 0: outcome = ("walk_off", Lr["id"])
            elif turns >= R["agreeEnd"]["minTurns"] and heat <= R["agreeEnd"]["maxHeat"] and move in R["softMoves"]:
                outcome = ("agree", None)
            elif end >= max_frames: outcome = ("agree_to_disagree", None)
            if outcome: break
            if inter: t = end - I["overlap"]; spk = 1 - spk
            else:
                t = end + rng.randint(*R["pauseFrames"])
                if not (Lr["engagement"] == 0 and rng.random() < 0.5): spk = 1 - spk
        t = end + 6; kind, who = outcome; ends = []
        by = {a["id"]: a for a in actors}
        if kind == "agree":
            for a in actors: ends.append(self.outcome_clips(a, t + rng.randint(0, 10), ["agree", "celebrate"], "agree"))
        elif kind == "agree_to_disagree":
            for a in actors: ends.append(self.outcome_clips(a, t + rng.randint(0, 12), ["doubt", "bored"], "agree to disagree"))
        elif kind == "walk_off":
            W = by[who]; O = [a for a in actors if a["id"] != who][0]
            e1 = self.outcome_clips(W, t, ["dismiss"], "walks off")
            ends.append(self.walk_off(W, e1 - 4))
            ends.append(self.outcome_clips(O, t + 20, ["surprise", "sulk"], "left standing"))
        else:
            H = by[who]; O = [a for a in actors if a["id"] != who][0]
            ends.append(self.outcome_clips(H, t, ["rage", "rage"], "outburst"))
            ends.append(self.outcome_clips(O, t + 8, ["surprise", "oppose"], "outburst"))
        return self.result(actors, outcome, max(ends) + 24)

    # ------------------------------------------------------------------ Speaker's Corner (one speaker, a crowd)
    def corner(self, speaker, crowd, max_frames=720, start=10, heat=0.3):
        R = self.R; C = R["corner"]; rng = self.rng; t = start; heckled = False; outcome = None
        pat = {a["id"]: R["patience"][a["engagement"]] for a in crowd}; gone = set()
        while True:
            band = self.band(heat)
            if heckled: move = wchoice(rng, C["speakerAnswer"]["heckled"])
            elif band >= 2: move = wchoice(rng, {m: v[band] for m, v in R["moves"].items() if m not in R["softMoves"]})
            else: move = wchoice(rng, C["speakerAnswer"]["calm"])
            lo, hi = R["turnFrames"][speaker["engagement"]]
            L = int(rng.randint(lo, hi) * R["shortMoves"].get(move, 1.0)); h0 = heat
            end = self.fill_speaker(speaker, t, L, R["moveFunctions"][move], heat, move)
            pros = 0
            for a in crowd:
                if a["id"] in gone: continue
                w = dict(R["listenAbsent"]) if a["engagement"] == 0 else dict(C["stanceListen"][a["stance"]])
                if a["engagement"] == 3 and a["stance"] == "contra":
                    for k, v in R["doggedBoost"].items(): w[k] = w.get(k, 0) * v
                self.fill_listener(a, t, end, w)
                if a["stance"] == "pro" and a["engagement"] > 0: pros += 1
            heckled = False; H = C["heckle"]
            hk = [a for a in crowd if a["id"] not in gone and a["stance"] == "contra" and a["engagement"] >= H["minEngagement"]]
            hecklerId = None
            if hk and rng.random() < H["p"]:
                h = rng.choice(hk); hm = wchoice(rng, H["moves"]); at = t + int(rng.uniform(0.4, 0.75) * (end - t))
                self.cut(h, at - 4)
                hend = self.fill_speaker(h, at, rng.randint(*H["frames"]), R["moveFunctions"][hm], heat, "heckle: " + hm)
                self.cut(speaker, min(end, at + 24)); end = max(min(end, at + 24), hend - 10)
                heat += C["heatFromHeckle"] * (0.5 + speaker["fuse"]); heckled = True; hecklerId = h["id"]
            else:
                heat += R["heatEffect"][move] * 0.5 + C["heatFromApplause"] * pros
            heat = max(0.0, min(R["heat"]["max"], heat))
            self.log.append({"t0": t, "t1": end, "speaker": speaker["id"], "move": move, "heatBefore": round(h0, 2),
                             "heatAfter": round(heat, 2), "heckledBy": hecklerId})
            for a in crowd:
                if a["id"] in gone: continue
                pat[a["id"]] -= (R["absentPatienceCostPerTurn"] if a["engagement"] == 0 else 0) + (1 if a["stance"] == "neutral" and band >= 2 else 0)
                if pat[a["id"]] <= 0 and len(gone) < len(crowd) - 1:
                    gone.add(a["id"]); self.walk_off(a, end - 20)
                    self.log.append({"t0": end - 20, "event": "walk_off", "actor": a["id"]})
            if heat >= R["outburstHeat"]: outcome = ("outburst", speaker["id"]); break
            if end >= max_frames: outcome = ("applause", None); break
            t = end + rng.randint(*R["pauseFrames"])
        t = end + 6; ends = []
        if outcome[0] == "outburst":
            ends.append(self.outcome_clips(speaker, t, ["rage", "rage"], "outburst"))
            for a in crowd:
                if a["id"] not in gone:
                    ends.append(self.outcome_clips(a, t + rng.randint(4, 16), ["mock"] if a["stance"] == "contra" else ["surprise"], "outburst"))
        else:
            ends.append(self.outcome_clips(speaker, t, ["celebrate"], "applause"))
            for a in crowd:
                if a["id"] in gone: continue
                f = {"pro": ["celebrate"], "neutral": ["approve"], "contra": ["dismiss"]}[a["stance"]]
                ends.append(self.outcome_clips(a, t + rng.randint(0, 14), f, "applause"))
        return self.result([speaker] + crowd, outcome, max(ends) + 24)

    def result(self, actors, outcome, end):
        uses = {}
        for aid, evs in self.tl.items():
            evs.sort(key=lambda e: e["start"])
            uses[aid] = {"events": len(evs), "distinctWindows": len({e["win"] for e in evs}),
                         "distinctClips": len({e["short"] for e in evs})}
        return {"schema": "kfb.talk.run.v1", "seed": self.seed, "actors": actors, "outcome": list(outcome),
                "end": int(end), "turns": self.log, "timelines": self.tl, "walks": self.walks, "variety": uses}


def run(pool_path, rules_path, mode, cast, seed, **kw):
    pool = json.load(open(pool_path)); rules = json.load(open(rules_path))
    E = Engine(pool, rules, seed)
    if mode == "debate": return E.debate(cast, **kw)
    return E.corner(cast[0], cast[1:], **kw)
