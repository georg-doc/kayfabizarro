"""KFB dance engine (pure Python): beat-synced dance timelines from a measured dance pool and a music beat grid.

Music: beat times (s) + per-beat energy (from librosa beat tracking). Above 140 BPM the dancers step on every
second beat (half time). The unit is a 4-beat block: each block is filled with one 4-beat clip window, time-scaled
so its measured steps land on the music beats (strip scale = music block length / window length).
Modes:
  freestyle - every dancer picks its own windows (style preference, energy follows the music, no repeats, mirrors)
  unison    - one shared window sequence, everybody in step (line dance)
  canon     - the shared sequence, dancer k starts k beats later (a wave through the line)
  battle    - two soloists alternate 8-beat solos; the crowd claps / cheers; the off-soloist reacts
A show = a list of (mode, blocks) sections.
"""
import json, math, random


def wchoice(rng, items):
    tot = sum(w for _, w in items); r = rng.random() * tot
    for k, w in items:
        r -= w
        if r <= 0: return k
    return items[-1][0]


class Dance:
    def __init__(self, pool, music, seed, fps=24):
        self.rng = random.Random(seed); self.fps = fps; self.seed = seed
        self.wins = [dict(w, clip=c["clip"], style=c["style"], frozen=c["travelFrozen"], cbpm=c["bpm"])
                     for c in pool["clips"] for w in c["windows"]]
        bpm = music["bpm"]; b = music["beats"]; e = music.get("beatEnergy", [1] * len(b))
        self.half = bpm > 140
        self.beats = b[::2] if self.half else b
        en = e[::2] if self.half else e
        self.energy = en + [en[-1] if en else 1] * 8
        self.music_bpm = bpm / 2 if self.half else bpm
        self.tl = {}; self.log = []; self.flash = [round(t * fps) for t in self.beats]

    def blocks(self):
        return (len(self.beats) - 1) // 4

    def block_frames(self, k, offset=0):
        i = 4 * k + offset
        if i + 4 >= len(self.beats): return None
        return self.beats[i] * self.fps, self.beats[i + 4] * self.fps

    def target_intensity(self, k):
        e = sum(self.energy[4 * k:4 * k + 4]) / 4
        return 1 if e < 0.45 else (2 if e < 0.75 else 3)

    def pick(self, dancer, k, used, styles=None, intensity=None, avoid_clip=None):
        f = self.block_frames(k)
        if f is None: return None
        L = f[1] - f[0]; items = []
        for i, w in enumerate(self.wins):
            sc = L / (w["a1"] - w["a0"])
            if not (0.65 <= sc <= 1.55): continue
            wt = math.exp(-3 * abs(math.log(sc)))
            if styles: wt *= 3.0 if w["style"] in styles else 0.4
            if intensity: wt *= (2.5, 1.0, 0.35)[min(2, abs(w["intensity"] - intensity))]
            if i in used: wt *= 0.05
            if avoid_clip and w["clip"] == avoid_clip: wt *= 0.2
            items.append((i, wt))
        return wchoice(self.rng, items) if items else None

    def place(self, dancer, k, wi, offset_beats=0, mirror=False, label=""):
        f = self.block_frames(k, offset_beats)
        if f is None: return False
        w = self.wins[wi]; sc = (f[1] - f[0]) / (w["a1"] - w["a0"])
        self.tl.setdefault(dancer["id"], []).append({
            "clip": w["clip"], "frozen": w["frozen"], "a0": w["a0"], "a1": w["a1"], "scale": round(sc, 4),
            "start": round(f[0], 2), "mirror": bool(mirror and not w["frozen"]), "label": label or w["style"],
            "win": wi})
        return True

    # ---------------------------------------------------------------- modes
    def freestyle(self, cast, k0, k1):
        for d in cast:
            used = set(); last = None
            for k in range(k0, k1):
                wi = self.pick(d, k, used, d.get("styles"), self.target_intensity(k), last)
                if wi is None: continue
                used.add(wi); last = self.wins[wi]["clip"]
                self.place(d, k, wi, mirror=self.rng.random() < 0.4, label="freestyle · " + self.wins[wi]["style"])
        self.log.append({"mode": "freestyle", "blocks": [k0, k1]})

    def shared_sequence(self, cast, k0, k1, styles=None):
        seq = []; used = set(); last = None
        for k in range(k0, k1):
            wi = self.pick(cast[0], k, used, styles, self.target_intensity(k), last)
            seq.append(wi); used.add(wi); last = self.wins[wi]["clip"] if wi is not None else None
        return seq

    def unison(self, cast, k0, k1, styles=None):
        seq = self.shared_sequence(cast, k0, k1, styles)
        for d in cast:
            for k, wi in zip(range(k0, k1), seq):
                if wi is not None: self.place(d, k, wi, label="unison")
        self.log.append({"mode": "unison", "blocks": [k0, k1], "sequence": [self.wins[w]["clip"] for w in seq if w is not None]})

    def canon(self, cast, k0, k1, styles=None):
        seq = self.shared_sequence(cast, k0, k1, styles)
        for j, d in enumerate(cast):
            for k, wi in zip(range(k0, k1), seq):
                if wi is not None: self.place(d, k, wi, offset_beats=j, label=f"canon +{j}")
        self.log.append({"mode": "canon", "blocks": [k0, k1], "offsetBeatsPerDancer": 1})

    def battle(self, a, b, crowd, k0, k1):
        solo = [a, b]; used = {a["id"]: set(), b["id"]: set()}
        for n, k in enumerate(range(k0, k1, 2)):
            s = solo[n % 2]; o = solo[1 - n % 2]
            for kk in (k, k + 1):
                if kk >= k1: break
                wi = self.pick(s, kk, used[s["id"]], s.get("styles"), 3)
                if wi is not None:
                    used[s["id"]].add(wi); self.place(s, kk, wi, mirror=self.rng.random() < 0.4, label="SOLO")
            f = self.block_frames(k)
            if f: self.tl.setdefault(o["id"], []).append({"react": "watch", "start": round(f[0], 2), "label": "watches"})
            f2 = self.block_frames(min(k + 1, k1 - 1))
            if f2:
                for c in crowd:
                    self.tl.setdefault(c["id"], []).append({"react": "cheer" if self.rng.random() < 0.5 else "clap",
                                                            "start": round(f2[1] - 30, 2), "label": "crowd"})
        for c in crowd:   # the crowd bounces lightly between cheers
            for k in range(k0, k1):
                wi = self.pick(c, k, set(), c.get("styles"), 1)
                if wi is not None and k % 2 == 0: self.place(c, k, wi, label="crowd groove")
        self.log.append({"mode": "battle", "blocks": [k0, k1], "soloists": [a["id"], b["id"]]})

    def result(self, cast, music_name, end_frame):
        for d in self.tl.values(): d.sort(key=lambda e: e["start"])
        return {"schema": "kfb.dance.run.v1", "seed": self.seed, "music": music_name, "musicBpm": round(self.music_bpm, 1),
                "halfTime": self.half, "beatFrames": self.flash, "cast": cast, "sections": self.log,
                "timelines": self.tl, "end": int(end_frame)}


def run(pool_path, music, music_name, cast, show, seed):
    pool = json.load(open(pool_path)); D = Dance(pool, music, seed)
    by = {c["id"]: c for c in cast}
    for sec in show:
        m = sec["mode"]; k0, k1 = sec["blocks"]; k1 = min(k1, D.blocks())
        if m == "freestyle": D.freestyle(cast, k0, k1)
        elif m == "unison": D.unison(cast, k0, k1, sec.get("styles"))
        elif m == "canon": D.canon(cast, k0, k1, sec.get("styles"))
        elif m == "battle": D.battle(by[sec["a"]], by[sec["b"]], [c for c in cast if c["id"] not in (sec["a"], sec["b"])], k0, k1)
    end = int(D.beats[min(len(D.beats) - 1, 4 * D.blocks())] * 24) + 36
    return D.result(cast, music_name, end)
