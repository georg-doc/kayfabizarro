"""Compose the Step A2 tower-donor board (one row per source family)."""
from PIL import Image, ImageDraw, ImageFont
R = 'renders/A/'
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f1 = ImageFont.truetype(F, 24); f2 = ImageFont.truetype(F.replace('-Bold', ''), 17)
ROWS = [
 ('KenneyTD_round', 'Kenney Tower Defense Kit (CC0) · round', 'pieces 1 m wide, bottom 0.6 · middle 0.6 · top 0.5 · roof 1.0-1.3 · stacks: 2.85 / 4.19 m · origin bottom centre'),
 ('KenneyTD_square', 'Kenney Tower Defense Kit (CC0) · square', 'pieces 1-1.1 m wide, 0.5 m per storey · stacks: 2.78 / 3.72 m · height = number of middle pieces'),
 ('KenneyPirate', 'Kenney Pirate Kit (CC0)', 'pieces 3.2 m wide, 2 m per storey · watch stack 6.8 m · roofed stack 12.2 m · complete-small 6.8 / large 10.2 m'),
 ('KayKitHex_blue', 'KayKit Medieval Hexagon (CC0) · blue', 'hex-tile scale, about 1 m wide · tower A 2.2 m, B 2.5 m, catapult 2.0 m · roofs are separate meshes'),
]
W, H = 1280, 480
img = Image.new('RGB', (W, 50 + len(ROWS) * (H + 62)), (240, 238, 232)); d = ImageDraw.Draw(img)
d.text((14, 12), 'A2 · Tower donors · isolated source pieces + test stacks · pink post = Rig_Medium 2.17 m', font=f1, fill=(30, 30, 30))
for k, (n, t, s) in enumerate(ROWS):
    y = 50 + k * (H + 62)
    img.paste(Image.open(R + 'towers_' + n + '.png').convert('RGB'), (0, y))
    d.text((12, y + H + 6), t, font=f1, fill=(20, 20, 20)); d.text((12, y + H + 36), s, font=f2, fill=(70, 70, 70))
img.save(R + 'A2_TOWERS_BOARD.png'); print('ok')
