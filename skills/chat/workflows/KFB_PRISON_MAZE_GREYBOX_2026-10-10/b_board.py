"""Compose the Step B boards (Port candidate, square vs polar maze, basin vs mound, three seeds)."""
from PIL import Image, ImageDraw, ImageFont
R = 'renders/B/'
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f1 = ImageFont.truetype(F, 26); f2 = ImageFont.truetype(F.replace('-Bold', ''), 19)
def label(d, x, y, a, b):
    d.text((x + 12, y + 8), a, font=f1, fill=(20, 20, 20)); d.text((x + 12, y + 40), b, font=f2, fill=(70, 70, 70))
# board 1: overview, 2 x 3 tiles (1200x800 each, scaled to 800x533)
W, H = 800, 533
tiles = [('34_MAZE_square_s1', 'Square maze · basin (Kessel)', 'seed 1 · walls 1.6 m · corridor 1.5 m · tower placeholder 6.8 m'),
         ('34_MAZE_polar_s1', 'Round maze (rings + spokes) · basin', 'seed 1 · 3 rings: 12 / 18 / 24 cells'),
         ('34_MAZE_square_s1_MOUND', 'Square maze · mound', 'same graph, same slider at -1'),
         ('34_MAZE_polar_s1_MOUND', 'Round maze · mound', 'same graph, same slider at -1'),
         ('eye_MAZE_square_s1', 'Player eye at the gate · square', 'pink post = 2.17 m (Rig_Medium height)'),
         ('eye_MAZE_polar_s1', 'Player eye at the gate · round', 'pink post = 2.17 m (Rig_Medium height)')]
img = Image.new('RGB', (2 * W, 50 + 3 * (H + 74)), (240, 238, 232)); d = ImageDraw.Draw(img)
d.text((14, 12), 'B · Port candidate (own copy) · square vs round maze · basin vs mound · walls rebuilt from the graph JSON', font=f1, fill=(30, 30, 30))
for k, (n, a, b) in enumerate(tiles):
    x, y = (k % 2) * W, 50 + (k // 2) * (H + 74)
    img.paste(Image.open(R + n + '.png').convert('RGB').resize((W, H)), (x, y)); label(d, x, y + H, a, b)
img.save(R + 'B_OVERVIEW_BOARD.png')
# board 2: reconfiguration, tops of 3 seeds per layout
S = 520
img = Image.new('RGB', (3 * S, 50 + 2 * (S + 74)), (240, 238, 232)); d = ImageDraw.Draw(img)
d.text((14, 12), 'B · Reconfiguration: three seeds per layout, same island, same courtyard and gate (top view)', font=f1, fill=(30, 30, 30))
ROUTE = {('square', 1): 23, ('square', 2): 23, ('square', 3): 15, ('polar', 1): 23, ('polar', 2): 24, ('polar', 3): 29}
for r, lay in enumerate(('square', 'polar')):
    for s in (1, 2, 3):
        x, y = (s - 1) * S, 50 + r * (S + 74)
        img.paste(Image.open(f'{R}top_MAZE_{lay}_s{s}.png').convert('RGB').resize((S, S)), (x, y))
        label(d, x, y + S, f'{lay} · seed {s}', f'escape route {ROUTE[(lay, s)]} cells')
img.save(R + 'B_RECONFIG_BOARD.png'); print('ok')
