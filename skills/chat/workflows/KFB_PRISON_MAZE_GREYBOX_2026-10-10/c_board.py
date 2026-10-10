"""Compose the Step C boards (tower, bridge, brick walls, two lighting states, beam sweep, terrain compensation)."""
from PIL import Image, ImageDraw, ImageFont
R = 'renders/C/'
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f1 = ImageFont.truetype(F, 26); f2 = ImageFont.truetype(F.replace('-Bold', ''), 19)
def label(d, x, y, a, b):
    d.text((x + 12, y + 8), a, font=f1, fill=(20, 20, 20)); d.text((x + 12, y + 40), b, font=f2, fill=(70, 70, 70))
W, H = 800, 533
tiles = [('C_dusk_overview', 'Dusk · dark brick walls, darker terrain', 'one bridge, one gate, beam sweeping the maze'),
         ('C_cold_day_overview', 'Cold day · same scene', 'only sun and sky change'),
         ('C_tower_close', 'Tower · rotating lantern under a fixed crown', 'lantern turns with the beam · crenellated deck + cannon stay'),
         ('C_bridge_gate', 'Bridge and gate', '6 separate plank segments · stone bridgehead · blue = guard slots')]
img = Image.new('RGB', (2 * W, 50 + 2 * (H + 74)), (240, 238, 232)); d = ImageDraw.Draw(img)
d.text((14, 12), 'C · Prison island: brick maze, lighthouse tower, single bridge access (greybox)', font=f1, fill=(30, 30, 30))
for k, (n, a, b) in enumerate(tiles):
    x, y = (k % 2) * W, 50 + (k // 2) * (H + 74)
    img.paste(Image.open(R + n + '.png').convert('RGB').resize((W, H)), (x, y)); label(d, x, y + H, a, b)
img.save(R + 'C_OVERVIEW_BOARD.png')
# board 2: beam sweep (4 frames) + terrain compensation (basin vs mound)
S, SH = 400, 300
img = Image.new('RGB', (1600, 50 + SH + 74 + 560 + 74), (240, 238, 232)); d = ImageDraw.Draw(img)
d.text((14, 12), 'C · Beam sweep (one turn in 8 s) and tower height following the terrain', font=f1, fill=(30, 30, 30))
for k, f in enumerate((1, 61, 121, 181)):
    x = k * S
    img.paste(Image.open(f'{R}C_sweep_{f:03d}.png').convert('RGB').resize((S, SH)), (x, 50))
    label(d, x, 50 + SH, f'frame {f}', f'{(f - 1) / 240 * 360:.0f} deg' + (' (beam behind the tower)' if f == 121 else ''))
y = 50 + SH + 74
for k, (t, a, b) in enumerate((('basin', 'Basin: tower on the bowl floor (-2.35)', '2 middle storeys · lamp 5.0 · deck 8.4'),
                               ('mound', 'Mound: tower on the hill (+2.65)', '0 middle storeys · lamp 6.0 · deck 9.4'))):
    x = k * 800
    img.paste(Image.open(f'{R}C_side_{t}.png').convert('RGB').resize((720, 560)), (x + 40, y)); label(d, x, y + 560, a, b)
img.save(R + 'C_BEAM_TERRAIN_BOARD.png'); print('ok')
