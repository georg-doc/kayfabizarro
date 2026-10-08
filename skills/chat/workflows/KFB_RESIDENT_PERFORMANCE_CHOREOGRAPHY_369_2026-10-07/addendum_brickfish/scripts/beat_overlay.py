"""Simple beat-caption overlay + MP4 for interaction previews (Pillow + ffmpeg).
usage: python3 beat_overlay.py <frames_dir> <beats.json> <out.mp4> "<title>"   (beats: [[f0, f1, text], ...])"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"; FONTB = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
INK = (34, 30, 28); PAPER = (250, 247, 240)


def main(frames_dir, beats_path, out_mp4, title):
    rec = json.load(open(beats_path)); beats = rec["beats"]; end = rec["end"]
    tmp = os.path.join(os.path.expanduser("~"), "_beat_ov", os.path.basename(os.path.normpath(frames_dir))); os.makedirs(tmp, exist_ok=True)
    for f in range(1, end + 1):
        src = os.path.join(frames_dir, f"f_{f:04d}.png")
        if not os.path.exists(src): continue
        im = Image.open(src).convert("RGB"); W, H = im.size; d = ImageDraw.Draw(im, "RGBA"); s = W / 960
        F = lambda n, b=False: ImageFont.truetype(FONTB if b else FONT, int(n * s))
        d.rectangle((0, 0, W, int(34 * s)), fill=PAPER + (215,)); d.text((int(12 * s), int(8 * s)), title, font=F(16, True), fill=INK)
        cur = [b for b in beats if b[0] <= f <= b[1]]
        if cur:
            txt = cur[-1][2]; l, t, r, b = d.textbbox((W // 2, H - int(26 * s)), txt, font=F(15, True), anchor="mm")
            d.rounded_rectangle((l - 14, t - 7, r + 14, b + 7), radius=10, fill=PAPER + (230,))
            d.text((W // 2, H - int(26 * s)), txt, font=F(15, True), fill=INK, anchor="mm")
        im.save(os.path.join(tmp, f"o_{f:04d}.jpg"), quality=92)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "24", "-i", os.path.join(tmp, "o_%04d.jpg"),
                    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "23", "-movflags", "+faststart", out_mp4], check=True)


if __name__ == "__main__":
    main(*sys.argv[1:5])
