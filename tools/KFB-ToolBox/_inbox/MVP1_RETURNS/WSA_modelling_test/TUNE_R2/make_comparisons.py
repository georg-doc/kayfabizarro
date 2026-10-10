import bpy
import numpy as np
from pathlib import Path

R1 = Path('/Users/georgv.westphalen/Dropbox/Mac/Documents/Codex/2026-10-10/kf/outputs/WSA_modelling_test/renders')
R2 = Path('/private/tmp/kfb-wsa-stairs-r2/output/renders')
OUT = Path('/private/tmp/kfb-wsa-stairs-r2/output/comparisons')
OUT.mkdir(parents=True, exist_ok=True)

for name in ('01_frontal', '02_three_quarter_top'):
    left = bpy.data.images.load(str(R1 / f'{name}.jpg'), check_existing=False)
    right = bpy.data.images.load(str(R2 / f'{name}.png'), check_existing=False)
    left.scale(800, 500)
    right.scale(800, 500)
    left_px = np.array(left.pixels[:], dtype=np.float32).reshape((500, 800, 4))
    right_px = np.array(right.pixels[:], dtype=np.float32).reshape((500, 800, 4))
    canvas = np.concatenate((left_px, right_px), axis=1)
    result = bpy.data.images.new(f'compare_{name}', width=1600, height=500, alpha=True)
    result.pixels.foreach_set(canvas.ravel())
    result.update()
    result.filepath_raw = str(OUT / f'{name}_R1-left_R2-right.png')
    result.file_format = 'PNG'
    result.save()
    bpy.data.images.remove(left)
    bpy.data.images.remove(right)
    bpy.data.images.remove(result)
