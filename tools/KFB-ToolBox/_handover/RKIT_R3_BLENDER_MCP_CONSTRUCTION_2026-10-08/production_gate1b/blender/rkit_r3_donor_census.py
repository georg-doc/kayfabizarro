# KFB RKIT R3 · source isolation census: every donor file imported ALONE into an empty scene, measured at native scale
# (bounds, tris, materials, file sha256) and rendered alone. Nothing is adapted here. Writes evidence/donors/*.png + JSON.
import bpy, json, os, sys, math
from mathutils import Vector
ROOT = globals().get('RKIT_ROOT') or os.environ.get('RKIT_ROOT')
sys.path.insert(0, os.path.join(ROOT, 'blender'))
import importlib, rkit_r3_lib as L
importlib.reload(L)
KIT = os.path.expanduser('~/Dropbox/CLAUDE/KFB Racetrack Blender Kit')
KEN = os.path.expanduser('~/Dropbox/CLAUDE/KFB Stunt Car Race/racetrack01/assets/racing')
U1 = os.path.expanduser('~/Developer/rkit-r3/donors/unity_lowpoly_track_roads_free/tree/Assets/BEDRILL/Modular_Track_Free/Models')
U2 = os.path.expanduser('~/Developer/rkit-r3/donors/unity_low_poly_street_pack/tree/Assets/LowpolyStreetPack/Meshes')
DONORS = [  # id, path, family, rights, publishable render
    ('RKIT01_track_straight_16m', f'{KIT}/RKIT-01/glb/track_straight_16m.glb', 'race body (R3d 12-pt profile)', 'KFB self-authored (RKIT-01 script)', True),
    ('RKIT01_track_curve_R40_45', f'{KIT}/RKIT-01/glb/track_curve_R40_45deg.glb', 'race curve', 'KFB self-authored', True),
    ('RKIT01_support_bank00', f'{KIT}/RKIT-01/glb/support_bank00.glb', 'support', 'KFB self-authored', True),
    ('RKIT01_arch_standard', f'{KIT}/RKIT-01/glb/arch_standard.glb', 'tunnel arch', 'KFB self-authored', True),
    ('RKIT01_ground_skirt', f'{KIT}/RKIT-01/glb/ground_skirt_R40_45deg.glb', 'embankment / skirt', 'KFB self-authored', True),
    ('RKIT03_funnel_wide_std', f'{KIT}/RKIT-03/glb/funnel_wide_to_standard.glb', 'width transition (fixed piece)', 'KFB self-authored', True),
    ('RKIT03_street_city_narrow', f'{KIT}/RKIT-03/glb/street_city_narrow_s.glb', 'city street (fixed piece)', 'KFB self-authored', True),
    ('RKIT03_tunnel_60', f'{KIT}/RKIT-03/glb/tunnel_60.glb', 'tunnel', 'KFB self-authored', True),
    ('RKIT03_support_styles', f'{KIT}/RKIT-03/glb/support_styles_sample.glb', 'supports', 'KFB self-authored', True),
    ('RKIT07_switch_y', f'{KIT}/RKIT-07/glb/switch_y.glb', 'Y switch / pit split', 'KFB self-authored', True),
    ('RKIT11_muelheimer_bruecke', f'{KIT}/RKIT-11/glb/muelheimer_bruecke.glb', 'bridge fixture (OSM-framed)', 'KFB self-authored; OSM frame ODbL (held back)', True),
    ('SC01_bridge_shell_narrow', f'{KIT}/SC01-BRIDGE-SHELLS/glb/sc01_bridge_shell_narrow_fixture.glb', 'bridge scenery shell', 'KFB self-authored', True),
    ('SC02_supports_classic', f'{KIT}/SC02-SUPPORTS/glb/sc02_supports_classic_fixture.glb', 'support ladder', 'KFB self-authored', True),
    ('KENNEY_lightPostModern', f'{KEN}/lightPostModern.glb', 'street lamp', 'Kenney Racing Kit, CC0 (claim; licence file not in folder)', True),
    ('KENNEY_rail', f'{KEN}/rail.glb', 'guard rail', 'Kenney Racing Kit, CC0 (claim)', True),
    ('KENNEY_barrierRed', f'{KEN}/barrierRed.glb', 'barrier block', 'Kenney Racing Kit, CC0 (claim)', True),
    ('KENNEY_roadCrossing', f'{KEN}/roadCrossing.glb', 'X crossing tile (fixed)', 'Kenney Racing Kit, CC0 (claim)', True),
    ('UNITY_BEDRILL_fence_red_block', f'{U1}/Track_Fence_line_type_01_red_block_1&5m_free.fbx', 'race kerb / fence block', 'Unity Asset Store EULA (BE DRILL ENTER) · local only', False),
    ('UNITY_BEDRILL_start_finish', f'{U1}/Track_line_type_01_start_finish_15m_free.fbx', 'start / finish straight', 'Unity Asset Store EULA · local only', False),
    ('UNITY_STREETPACK_roadmarks', f'{U2}/RoadMarks.FBX', 'road marking decals', 'Unity Asset Store EULA (Dynamic Art) · local only', False),
    ('UNITY_STREETPACK_lampposts', f'{U2}/LampPosts.FBX', 'lamp posts', 'Unity Asset Store EULA · local only', False),
]
main = bpy.context.window.scene
tmp = bpy.data.scenes.get('_rkit_donor') or bpy.data.scenes.new('_rkit_donor')
bpy.context.window.scene = tmp
L.setup_render((800, 450)); tmp.display.shading.background_type = 'WORLD'
tmp.world = bpy.data.worlds.get('RKIT_donor_world') or bpy.data.worlds.new('RKIT_donor_world'); tmp.world.color = (0.86, 0.85, 0.82)
OUT = os.path.join(ROOT, 'evidence', 'donors'); os.makedirs(OUT, exist_ok=True); os.makedirs(os.path.join(OUT, 'local_only'), exist_ok=True)
rows = []; tiles = []
for did, path, fam, rights, pub in DONORS:
    row = {'id': did, 'path': path.replace(os.path.expanduser('~'), '~'), 'family': fam, 'rights': rights, 'exists': os.path.exists(path)}
    if not row['exists']: rows.append(row); continue
    row['sha256'] = L.sha256(path); row['bytes'] = os.path.getsize(path)
    pre = set(bpy.data.objects)
    try:
        if path.lower().endswith('.glb'): bpy.ops.import_scene.gltf(filepath=path)
        else: bpy.ops.wm.fbx_import(filepath=path)
    except Exception as e:
        row['import_error'] = str(e)[:200]; rows.append(row); continue
    new = [o for o in bpy.data.objects if o not in pre]
    for o in new:
        if o.name not in tmp.collection.all_objects: pass
    bpy.context.view_layer.update()
    meshes = [o for o in new if o.type == 'MESH']
    b = L.bounds_world(meshes) if meshes else [[0, 0, 0], [0, 0, 0]]
    size = [round(b[1][i] - b[0][i], 3) for i in range(3)]
    row.update({'objects': len(new), 'meshes': len(meshes), 'tris': sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in meshes),
                'materials': sorted({m.name for o in meshes for m in o.data.materials if m})[:12], 'size_blender_xyz_m': size, 'native_axis_note': 'glTF +Y up -> Blender Z up' if path.lower().endswith('.glb') else 'FBX via Blender importer (unit scale applied)'})
    c = Vector([(b[0][i] + b[1][i]) / 2 for i in range(3)]); R = max(size) or 1.0
    cam = c + Vector((R * 0.9, -R * 1.25, R * 0.75))
    tile = os.path.join(OUT if pub else os.path.join(OUT, 'local_only'), f'{did}.png')
    L.render_view(tile, tuple(c), tuple(cam), lens=38)
    if pub: tiles.append(tile)
    row['render'] = tile.replace(ROOT + '/', '')
    for o in new: bpy.data.objects.remove(o, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.images):
        for d in [d for d in coll if d.users == 0]: coll.remove(d)
    rows.append(row)
bpy.context.window.scene = main; bpy.data.scenes.remove(tmp)
sheet = L.contact_sheet(tiles, os.path.join(OUT, 'donors_isolated_sheet.png'), cols=4)
json.dump({'schema': 'kfb.rkit-r3.donor-census/0.1', 'donors': rows}, open(os.path.join(OUT, 'donor_census.json'), 'w'), indent=1)
result = {'n': len(rows), 'imported': sum(1 for r in rows if 'tris' in r), 'errors': [r['id'] for r in rows if 'import_error' in r or not r['exists']], 'sheet': sheet}
