"""Contact sheet for Motion Forge POC 01. Runs on the device VM (PIL).
usage: python3 forge_sheet.py <renders_dir> <rows.json> <out.png> <title>
rows.json: [{"label": "...", "files": ["a_f00.png", ...]}, ...]
"""
import sys, json
from PIL import Image, ImageDraw, ImageFont

d, rows_p, out, title = sys.argv[1:5]
rows = json.load(open(rows_p))
W = 240; LAB = 300; TOP = 34
ncol = max(len(r['files']) for r in rows)
img = Image.new('RGB', (LAB + W * ncol, TOP + W * len(rows)), (34, 34, 38))
dr = ImageDraw.Draw(img)
try:
    f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 13)
    fb = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 16)
except Exception:
    f = fb = ImageFont.load_default()
dr.text((10, 8), title, fill=(255, 255, 255), font=fb)
for i, r in enumerate(rows):
    y = TOP + i * W
    col = (255, 214, 120) if r.get('donor') else (230, 230, 230)
    yy = y + 8
    for line in r['label'].split('\n'):
        dr.text((10, yy), line, fill=col, font=f); yy += 17
    for j, fn in enumerate(r['files']):
        im = Image.open(d + '/' + fn).convert('RGB').resize((W, W))
        img.paste(im, (LAB + j * W, y))
    dr.line([(0, y), (img.width, y)], fill=(70, 70, 70))
img.save(out)
print(img.size)
