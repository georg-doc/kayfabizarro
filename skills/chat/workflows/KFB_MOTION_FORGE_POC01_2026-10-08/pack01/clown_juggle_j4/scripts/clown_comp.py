"""Side-by-side review comps for the clown previews: <label bar> + N panels of 960x540, then an mp4 with K loops."""
import sys, os, subprocess
from PIL import Image, ImageDraw, ImageFont
def comp(out_dir, panels, title, n, loops=3, mp4=None, fps=30):
    os.makedirs(out_dir, exist_ok=True)
    try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 18)
    except Exception: font = ImageFont.load_default()
    W = 960 * len(panels)
    for f in range(n):
        im = Image.new('RGB', (W, 572), (30, 30, 30)); d = ImageDraw.Draw(im)
        for i, (folder, label) in enumerate(panels):
            p = Image.open(os.path.join(folder, f'f_{f:04d}.png')).convert('RGB').resize((960, 540))
            im.paste(p, (960 * i, 32)); d.text((960 * i + 10, 7), label, fill=(230, 230, 230), font=font)
        d.text((W - 260, 7), f'{title}  f{f:03d}', fill=(255, 210, 90), font=font)
        im.save(os.path.join(out_dir, f'c_{f:04d}.jpg'), quality=90)
    if mp4:
        lst = os.path.join(out_dir, 'list.txt')
        with open(lst, 'w') as fh:
            for _ in range(loops):
                for f in range(n): fh.write(f"file 'c_{f:04d}.jpg'\nduration {1/fps:.6f}\n")
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-r', str(fps),
                        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', mp4], check=True)
def sheet(out_dir, frames, path, cols=4):
    ims = [Image.open(os.path.join(out_dir, f'c_{f:04d}.jpg')) for f in frames]
    w, h = ims[0].size; s = 0.5
    tw, th = int(w * s), int(h * s); rows = (len(ims) + cols - 1) // cols
    sh = Image.new('RGB', (tw * min(cols, len(ims)) if len(ims) < cols else tw * cols, th * rows), (20, 20, 20))
    for i, im in enumerate(ims): sh.paste(im.resize((tw, th)), ((i % cols) * tw, (i // cols) * th))
    sh.save(path, quality=85)
if __name__ == '__main__':
    pass


def comp_seq(out_dir, panels, seq_json, mp4, fps=30):
    """Performance-sequence comp: label bar shows the clip, the clip frame and a TALK WINDOW tag."""
    import json
    S = json.load(open(seq_json)); seq, win = S['seq'], S['windows']
    os.makedirs(out_dir, exist_ok=True)
    try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 18)
    except Exception: font = ImageFont.load_default()
    W = 960 * len(panels)
    for i, (clip, f) in enumerate(seq):
        im = Image.new('RGB', (W, 572), (30, 30, 30)); d = ImageDraw.Draw(im)
        for k, (folder, label) in enumerate(panels):
            p = Image.open(os.path.join(folder, f'f_{i:04d}.png')).convert('RGB').resize((960, 540))
            im.paste(p, (960 * k, 32)); d.text((960 * k + 10, 7), label, fill=(230, 230, 230), font=font)
        talk = any(a <= f <= b for a, b in win.get(clip, []))
        d.text((W - 520, 7), f'{clip}  f{f:03d}', fill=(255, 210, 90), font=font)
        if talk:
            d.rectangle((W - 250, 4, W - 10, 28), fill=(200, 60, 60)); d.text((W - 238, 7), 'TALK WINDOW', fill=(255, 255, 255), font=font)
        im.save(os.path.join(out_dir, f'c_{i:04d}.jpg'), quality=90)
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(fps), '-i', os.path.join(out_dir, 'c_%04d.jpg'),
                    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', mp4], check=True)
