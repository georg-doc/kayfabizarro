"""Dance preview overlay + audio mux (Pillow + ffmpeg).
Draws title, current section (mode), a 4-dot beat counter, then muxes the music (frame f shows at (f-1)/24, beats
are keyed at round(t*24), so the video is delayed by one frame to stay on the beat).
usage: python3 dance_overlay.py <frames_dir> <run.json> <music.mp3> <out.mp4> "<title>" """
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"; FONTB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
INK = (34, 30, 28); PAPER = (250, 247, 240); ORANGE = (239, 90, 34)
LABEL = {"freestyle": "FREESTYLE · everybody picks their own moves", "unison": "UNISON · line dance, all in step",
         "canon": "CANON · same moves, one beat later each (wave)", "battle": "DANCE-OFF · solos alternate, the crowd reacts"}


def main(frames_dir, run_path, music, out_mp4, title):
    run = json.load(open(run_path)); bf = run["beatFrames"]; end = run["end"]
    secs = []
    for s in run["sections"]:
        k0, k1 = s["blocks"]; f0 = bf[min(4 * k0, len(bf) - 1)]; f1 = bf[min(4 * k1, len(bf) - 1)]
        secs.append((f0, f1, LABEL[s["mode"]]))
    tmp = os.path.join(os.path.expanduser("~"), "_dance_ov", os.path.basename(os.path.normpath(frames_dir))); os.makedirs(tmp, exist_ok=True)
    for f in range(1, end + 1):
        src = os.path.join(frames_dir, f"f_{f:04d}.png")
        if not os.path.exists(src): continue
        im = Image.open(src).convert("RGB"); W, H = im.size; d = ImageDraw.Draw(im, "RGBA"); s = W / 960
        F = lambda n, b=False: ImageFont.truetype(FONTB if b else FONT, int(n * s))
        d.rectangle((0, 0, W, int(50 * s)), fill=PAPER + (215,))
        d.text((int(12 * s), int(6 * s)), title, font=F(16, True), fill=INK)
        d.text((int(12 * s), int(28 * s)), f'music: {run["music"]} (Birthday Radio, VOLE CC0) · {run["musicBpm"]} BPM'
               + (" · half time" if run["halfTime"] else ""), font=F(11), fill=(110, 104, 98))
        n = max([i for i, b in enumerate(bf) if b <= f] or [-1])
        for i in range(4):
            on = n >= 0 and n % 4 == i and f - bf[n] < 8
            cx = W - int((110 - i * 24) * s); cy = int(25 * s); r = int((9 if on else 6) * s)
            d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=ORANGE if on else (200, 194, 186))
        cur = [x for x in secs if x[0] <= f < x[1] + 24]
        if cur:
            txt = cur[-1][2]; l, t, rr, b = d.textbbox((W // 2, H - int(26 * s)), txt, font=F(15, True), anchor="mm")
            d.rounded_rectangle((l - 14, t - 7, rr + 14, b + 7), radius=10, fill=PAPER + (230,))
            d.text((W // 2, H - int(26 * s)), txt, font=F(15, True), fill=INK, anchor="mm")
        im.save(os.path.join(tmp, f"o_{f:04d}.jpg"), quality=92)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-itsoffset", "0.0417", "-framerate", "24", "-i", os.path.join(tmp, "o_%04d.jpg"),
                    "-i", music, "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "23",
                    "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out_mp4], check=True)


if __name__ == "__main__":
    main(*sys.argv[1:6])
