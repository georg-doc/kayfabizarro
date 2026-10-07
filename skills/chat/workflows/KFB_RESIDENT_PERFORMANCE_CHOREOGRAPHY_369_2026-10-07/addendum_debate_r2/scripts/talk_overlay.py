"""Caption overlay for talk-engine preview renders (runs on any machine with Pillow + ffmpeg).

Draws: run title + cast profile, heat meter with bands, the current turn (speaker -> move, interrupts, heckles),
a label above each resident's head (speaker orange, listeners grey) and the outcome card; then encodes MP4.
usage: python3 talk_overlay.py <frames_dir> <overlay.json> <out.mp4> "<title>"
"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"; FONTB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
ORANGE = (239, 90, 34); INK = (34, 30, 28); GREY = (110, 104, 98); PAPER = (250, 247, 240)
ENG = ["absent", "polite", "engaged", "dogged"]
BANDS = [(0.0, "chat"), (0.8, "disagree"), (1.8, "argue"), (2.6, "outburst")]


def heat_at(turns, f):
    h = None
    for t in turns:
        if "move" not in t: continue
        if f < t["t0"]: return t["heatBefore"] if h is None else h
        if f <= t["t1"]:
            k = (f - t["t0"]) / max(1, t["t1"] - t["t0"]); return t["heatBefore"] + k * (t["heatAfter"] - t["heatBefore"])
        h = t["heatAfter"]
    return h or 0.0


def turn_at(turns, f):
    cur = None
    for t in turns:
        if "move" in t and t["t0"] <= f <= t["t1"] + 6: cur = t
    return cur


def pill(d, xy, text, font, fg, bg, anchor="mm", pad=(9, 4)):
    l, t, r, b = d.textbbox(xy, text, font=font, anchor=anchor)
    d.rounded_rectangle((l - pad[0], t - pad[1], r + pad[0], b + pad[1]), radius=9, fill=bg)
    d.text(xy, text, font=font, fill=fg, anchor=anchor)


def main(frames_dir, ov_path, out_mp4, title):
    ov = json.load(open(ov_path)); run = ov["run"]; turns = run["turns"]; end = run["end"]
    names = {a["id"]: a["id"].replace("_", " ").upper() for a in run["actors"]}
    cast = "   ".join(f'{names[a["id"]]}: {ENG[a["engagement"]]}, fuse {a["fuse"]:.1f}, stubborn {a["stubbornness"]:.1f}'
                      + (f', {a["stance"]}' if run.get("actors") and len(run["actors"]) > 2 and a is not run["actors"][0] else "")
                      for a in run["actors"])
    tmp = os.path.join(os.path.expanduser("~"), "_talk_ov", os.path.basename(os.path.normpath(frames_dir))); os.makedirs(tmp, exist_ok=True)
    for f in range(1, end + 1):
        src = os.path.join(frames_dir, f"f_{f:04d}.png")
        if not os.path.exists(src): continue
        im = Image.open(src).convert("RGB"); W, H = im.size; d = ImageDraw.Draw(im, "RGBA")
        s = W / 960; F = lambda n, b=False: ImageFont.truetype(FONTB if b else FONT, int(n * s))
        d.rectangle((0, 0, W, int(54 * s)), fill=(250, 247, 240, 215))
        d.text((int(12 * s), int(8 * s)), title, font=F(16, True), fill=INK)
        d.text((int(12 * s), int(31 * s)), cast, font=F(10.5), fill=GREY)
        # heat meter
        h = heat_at(turns, f); x0, x1, y = int(W - 300 * s), int(W - 14 * s), int(66 * s)
        d.rounded_rectangle((x0, y, x1, y + int(12 * s)), radius=6, fill=(255, 255, 255, 230), outline=GREY)
        d.rounded_rectangle((x0, y, x0 + int((x1 - x0) * min(1, h / 3.0)), y + int(12 * s)), radius=6, fill=ORANGE)
        for v, lab in BANDS:
            xx = x0 + int((x1 - x0) * v / 3.0)
            d.line((xx, y - 2, xx, y + int(14 * s)), fill=INK, width=1)
            d.text((xx + 3, y + int(15 * s)), lab, font=F(9), fill=INK)
        d.text((x0 - 6, y + int(6 * s)), f"heat {h:.2f}", font=F(10, True), fill=INK, anchor="rm")
        # current turn
        t = turn_at(turns, f)
        if t and f <= (turns[-1]["t1"] if "t1" in turns[-1] else end):
            cap = f'{names[t["speaker"]]}  →  {t["move"]}'
            if t.get("interruptedBy"): cap += f'   ·   cut off by {names[t["interruptedBy"]]}'
            if t.get("heckledBy"): cap += f'   ·   heckled by {names[t["heckledBy"]]}'
            pill(d, (W // 2, H - int(26 * s)), cap, F(15, True), INK, (250, 247, 240, 225), pad=(14, 7))
        # head labels
        row = ov["frames"][f - 1]
        spk = t["speaker"] if t else None
        for k, (u, v, lab) in row.items():
            if not lab or not (0 < u < 1 and 0 < v < 1.05): continue
            x, yy = int(u * W), int((1 - v) * H)
            is_spk = (k == spk and lab not in ("listen",)) or lab.startswith("heckle")
            pill(d, (x, max(int(70 * s), yy)), lab, F(11.5, True), (255, 255, 255) if is_spk else INK,
                 ORANGE + (235,) if is_spk else (255, 255, 255, 215))
        # outcome card
        oc = run["outcome"][0].replace("_", " ")
        last_t1 = max(x.get("t1", 0) for x in turns)
        if f > last_t1 + 6:
            who = run["outcome"][1]
            txt = "OUTCOME: " + oc.upper() + (f"  ({names[who]})" if who else "")
            pill(d, (W // 2, H - int(26 * s)), txt, F(17, True), (255, 255, 255), ORANGE + (240,), pad=(16, 8))
        im.save(os.path.join(tmp, f"o_{f:04d}.jpg"), quality=92)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "24", "-i", os.path.join(tmp, "o_%04d.jpg"),
                    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "24", "-movflags", "+faststart", out_mp4], check=True)
    for n in os.listdir(tmp): os.remove(os.path.join(tmp, n))


if __name__ == "__main__":
    main(*sys.argv[1:5])
