import bpy
from pathlib import Path
r=Path(__file__).resolve().parent
bpy.ops.wm.open_mainfile(filepath=str(r/'candidate.blend'))
bpy.ops.export_scene.gltf(filepath=str(r/'candidate.glb'),export_format='GLB',use_selection=False,export_cameras=False,export_lights=False)
