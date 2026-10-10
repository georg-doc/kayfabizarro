"""Compose the Step A1 island contact boards from the Blender renders."""
from PIL import Image, ImageDraw, ImageFont
import sys, os
R = 'renders/A/'
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f1 = ImageFont.truetype(F, 22); f2 = ImageFont.truetype(F.replace('-Bold', ''), 16)
ISL = ['01_Demo_Port', '02_Demo_River', '03_Demo_Backyard', '04_Demo_Beach',
       '05_Demo_PirateCave', '06_Demo_Iceland', '07_Demo_PondLand', '08_Demo_Forest']
NOTE = {  # size (m), main flat level area, largest flat circle radius
 '01_Demo_Port': '24x21 m · flat 211 m² · r 4.0', '02_Demo_River': '12x12 m · flat 85 m² · r 4.0',
 '03_Demo_Backyard': '20x20 m · flat 261 m² · r 9.5', '04_Demo_Beach': '12x12 m · flat 87 m² · r 2.5',
 '05_Demo_PirateCave': '26x27 m · flat 322 m² · r 6.0', '06_Demo_Iceland': '27x30 m · flat 310 m² · r 6.5',
 '07_Demo_PondLand': '27x27 m · flat 334 m² · r 6.0', '08_Demo_Forest': '19x19 m · flat 270 m² · r 9.5'}
W, H = 640, 480
def board(prefix, out, title):
    img = Image.new('RGB', (4 * W, 2 * (H + 56) + 50), (240, 238, 232))
    d = ImageDraw.Draw(img); d.text((14, 12), title, font=f1, fill=(30, 30, 30))
    for k, n in enumerate(ISL):
        x, y = (k % 4) * W, 50 + (k // 4) * (H + 56)
        img.paste(Image.open(R + prefix + n + '.png').convert('RGB'), (x, y))
        d.text((x + 10, y + H + 6), n.replace('_Demo_', ' · '), font=f1, fill=(20, 20, 20))
        d.text((x + 10, y + H + 32), NOTE[n], font=f2, fill=(70, 70, 70))
    img.save(R + out)
board('34_', 'A1_ISLANDS_34_BOARD.png', 'A1 · StreakByte Low Poly Floating Islands · 8 demo scenes rebuilt in Blender from the Lab scene JSON (source, untouched)')
# side + top: two half-height tiles per island
img = Image.new('RGB', (4 * W, 2 * (H + 56) + 50), (240, 238, 232)); d = ImageDraw.Draw(img)
d.text((14, 12), 'A1 · Terrain only from above (left) and full island from the side (right) · underside and plateau', font=f1, fill=(30, 30, 30))
for k, n in enumerate(ISL):
    x, y = (k % 4) * W, 50 + (k // 4) * (H + 56)
    t = Image.open(R + 'top_' + n + '.png').convert('RGB'); t = t.crop(((W - H) // 2, 0, (W - H) // 2 + H, H)).resize((W // 2, W // 2))
    s = Image.open(R + 'side_' + n + '.png').convert('RGB').resize((W // 2, H * (W // 2) // W))
    img.paste(t, (x, y + (H - W // 2) // 2)); img.paste(s, (x + W // 2, y + (H - s.height) // 2))
    d.text((x + 10, y + H + 6), n.replace('_Demo_', ' · '), font=f1, fill=(20, 20, 20))
    d.text((x + 10, y + H + 32), NOTE[n], font=f2, fill=(70, 70, 70))
img.save(R + 'A1_ISLANDS_TOP_SIDE_BOARD.png')
print('ok')
