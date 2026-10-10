"""KFB Prison Maze · Blender builder (Step B, brick UVs added in Step C).

Builds raised-earth maze walls from prison_maze_graph.json on top of a terrain object.
The graph JSON is the source of truth; this script only makes geometry. Re-run it after the terrain changes
(for example after moving the BASIN_DEPTH shape key): walls are rebuilt to follow the ground.

Use inside Blender:
    exec(open(PATH_TO_THIS_FILE).read())
    build_all(graph_path, terrain_name, scene_name, basin_value)
"""
import bpy, bmesh, json, math
from mathutils import Vector
from mathutils.bvhtree import BVHTree

ARC_STEP = 0.35   # metres between points on curved walls
SINK = 0.35       # walls reach this far below the ground so the base never floats


def wall_material(style='brick'):
    """'brick': dark procedural brick on the wall UVs (u = metres along the wall, v = world height), mossy cap.
    'earth': the Step B look (earth sides, grass top)."""
    name = 'C_WALL_BRICK' if style == 'brick' else 'B_WALL_EARTH'
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; N = nt.nodes; L = nt.links
    bsdf = N['Principled BSDF']; bsdf.inputs['Roughness'].default_value = 0.92
    geo = N.new('ShaderNodeNewGeometry'); sep = N.new('ShaderNodeSeparateXYZ')
    L.new(geo.outputs['Normal'], sep.inputs[0])
    if style == 'earth':
        ramp = N.new('ShaderNodeValToRGB')
        ramp.color_ramp.elements[0].position = 0.55; ramp.color_ramp.elements[0].color = (0.42, 0.30, 0.20, 1)
        ramp.color_ramp.elements[1].position = 0.75; ramp.color_ramp.elements[1].color = (0.36, 0.50, 0.27, 1)
        L.new(sep.outputs['Z'], ramp.inputs[0]); L.new(ramp.outputs[0], bsdf.inputs['Base Color'])
        return m
    def sock(node, ident, out=False):
        return next(x for x in (node.outputs if out else node.inputs) if x.identifier == ident)
    uv = N.new('ShaderNodeUVMap'); uv.uv_map = 'WALL_UV'
    brick = N.new('ShaderNodeTexBrick')
    brick.offset = 0.5; brick.squash = 1.0
    brick.inputs['Scale'].default_value = 1.0                 # UVs are in metres
    brick.inputs['Brick Width'].default_value = 0.56
    brick.inputs['Row Height'].default_value = 0.27
    brick.inputs['Mortar Size'].default_value = 0.035
    brick.inputs['Mortar Smooth'].default_value = 0.2
    brick.inputs['Bias'].default_value = 0.0
    brick.inputs['Color1'].default_value = (0.20, 0.15, 0.12, 1)   # dark umber
    brick.inputs['Color2'].default_value = (0.15, 0.13, 0.12, 1)   # dark grey-brown
    brick.inputs['Mortar'].default_value = (0.07, 0.06, 0.055, 1)
    L.new(uv.outputs['UV'], brick.inputs['Vector'])
    noise = N.new('ShaderNodeTexNoise'); noise.inputs['Scale'].default_value = 3.0
    L.new(uv.outputs['UV'], noise.inputs['Vector'])
    vary = N.new('ShaderNodeMix'); vary.data_type = 'RGBA'; vary.blend_type = 'MULTIPLY'; vary.inputs['Factor'].default_value = 0.35
    L.new(brick.outputs['Color'], sock(vary, 'A_Color')); L.new(noise.outputs['Color'], sock(vary, 'B_Color'))
    cap = N.new('ShaderNodeMix'); cap.data_type = 'RGBA'
    sock(cap, 'B_Color').default_value = (0.11, 0.14, 0.09, 1)   # dark moss on the cap
    step = N.new('ShaderNodeMapRange'); step.inputs['From Min'].default_value = 0.7; step.inputs['From Max'].default_value = 0.8
    L.new(sep.outputs['Z'], step.inputs['Value']); L.new(step.outputs['Result'], cap.inputs['Factor'])
    L.new(sock(vary, 'Result_Color', True), sock(cap, 'A_Color')); L.new(sock(cap, 'Result_Color', True), bsdf.inputs['Base Color'])
    bump = N.new('ShaderNodeBump'); bump.inputs['Strength'].default_value = 0.35
    L.new(brick.outputs['Fac'], bump.inputs['Height']); L.new(bump.outputs['Normal'], bsdf.inputs['Normal'])
    return m


def ground_bvh(terrain):
    dg = bpy.context.evaluated_depsgraph_get()
    ev = terrain.evaluated_get(dg); me = ev.to_mesh()
    mw = terrain.matrix_world
    bvh = BVHTree.FromPolygons([mw @ v.co for v in me.vertices], [list(p.vertices) for p in me.polygons])
    ev.to_mesh_clear()
    return bvh


def ground_z(bvh, x, y):
    hit = bvh.ray_cast(Vector((x, y, 50.0)), Vector((0, 0, -1)))
    return hit[0].z if hit[0] is not None else 0.0


def split(a, b):
    """Straight wall as a point list every ARC_STEP, so the wall top follows curved ground."""
    a, b = Vector(a), Vector(b); n = max(2, int((b - a).length / ARC_STEP) + 1)
    return [tuple(a.lerp(b, i / (n - 1))) for i in range(n)]


def polyline(w):
    if w['type'] == 'line':
        return [tuple(w['a']), tuple(w['b'])]
    if w['type'] == 'radial':
        c, s = math.cos(w['t']), math.sin(w['t'])
        return [(w['r0'] * c, w['r0'] * s), (w['r1'] * c, w['r1'] * s)]
    # arc
    n = max(2, int(abs(w['t1'] - w['t0']) * w['r'] / ARC_STEP) + 1)
    return [(w['r'] * math.cos(w['t0'] + (w['t1'] - w['t0']) * i / (n - 1)),
             w['r'] * math.sin(w['t0'] + (w['t1'] - w['t0']) * i / (n - 1))) for i in range(n)]


def wall_mesh(name, maze, bvh, params, style='brick'):
    """One mesh per maze. UV layer WALL_UV: u = metres along the wall centre line, v = world height on the sides,
    so a brick pattern runs on without stretching over straight, curved and sloped walls."""
    h, t = params['wall']['height'], params['wall']['thickness']
    bm = bmesh.new(); uvl = bm.loops.layers.uv.new('WALL_UV')
    def uvset(face, coords):
        for loop, c in zip(face.loops, coords):
            loop[uvl].uv = c
    for w in maze['walls']:
        pts = polyline(w)
        # extend straight ends by half the thickness so corners close
        if len(pts) == 2 and w['type'] != 'arc':
            a, b = Vector(pts[0]), Vector(pts[1]); d = (b - a).normalized() * (t / 2)
            pts = split(a - d, b + d)
        ring = []; arc = [0.0]
        for i in range(1, len(pts)):
            arc.append(arc[-1] + (Vector(pts[i]) - Vector(pts[i - 1])).length)
        for i, (x, y) in enumerate(pts):
            p = Vector((x, y))
            d = (Vector(pts[min(i + 1, len(pts) - 1)]) - Vector(pts[max(i - 1, 0)])).normalized()
            nrm = Vector((-d.y, d.x)) * (t / 2)
            col = []
            for side in (nrm, -nrm):
                q = p + side; z = ground_z(bvh, q.x, q.y)
                col.append(bm.verts.new((q.x, q.y, z - SINK)))
                col.append(bm.verts.new((q.x, q.y, z + h)))
            ring.append(col)   # [L_bottom, L_top, R_bottom, R_top]
        for k, (a, b) in enumerate(zip(ring, ring[1:])):
            u0, u1 = arc[k], arc[k + 1]
            f = bm.faces.new((a[1], b[1], b[3], a[3]))          # top
            uvset(f, [(u0, 0), (u1, 0), (u1, t), (u0, t)])
            f = bm.faces.new((a[0], b[0], b[1], a[1]))          # left side
            uvset(f, [(u0, a[0].co.z), (u1, b[0].co.z), (u1, b[1].co.z), (u0, a[1].co.z)])
            f = bm.faces.new((a[3], b[3], b[2], a[2]))          # right side
            uvset(f, [(u0, a[3].co.z), (u1, b[3].co.z), (u1, b[2].co.z), (u0, a[2].co.z)])
        s, e = ring[0], ring[-1]
        f = bm.faces.new((s[0], s[1], s[3], s[2])); uvset(f, [(0, s[0].co.z), (0, s[1].co.z), (t, s[3].co.z), (t, s[2].co.z)])
        f = bm.faces.new((e[2], e[3], e[1], e[0])); uvset(f, [(0, e[2].co.z), (0, e[3].co.z), (t, e[1].co.z), (t, e[0].co.z)])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.get(name) or bpy.data.meshes.new(name)
    bm.to_mesh(me); bm.free()
    me.materials.clear(); me.materials.append(wall_material(style))
    return me


def build_all(graph_path, terrain_name, scene_name, basin_value=1.0, only=None, style='brick'):
    sc = bpy.data.scenes[scene_name]
    terrain = bpy.data.objects[terrain_name]
    sk = terrain.data.shape_keys.key_blocks.get('BASIN_DEPTH_2m5') if terrain.data.shape_keys else None
    if sk:
        sk.value = basin_value
    bpy.context.view_layer.update()
    bvh = ground_bvh(terrain)
    doc = json.load(open(graph_path))
    root = bpy.data.collections.get('B_MAZES') or bpy.data.collections.new('B_MAZES')
    if root.name not in sc.collection.children:
        sc.collection.children.link(root)
    made = []
    for m in doc['mazes']:
        key = f"MAZE_{m['layout']}_s{m['seed']}"
        if only and key not in only:
            continue
        me = wall_mesh(key, m, bvh, doc['params'], style)
        o = bpy.data.objects.get(key) or bpy.data.objects.new(key, me)
        o.data = me
        if o.name not in root.objects:
            root.objects.link(o)
        bev = o.modifiers.get('BEVEL') or o.modifiers.new('BEVEL', 'BEVEL')
        bev.width = doc['params']['wall']['bevel']; bev.segments = 2; bev.limit_method = 'ANGLE'; bev.harden_normals = False
        o['graph'] = f"{graph_path.split('/')[-1]}#{m['layout']}/{m['seed']}"; o['basin'] = basin_value
        made.append({'name': key, 'walls': len(m['walls']), 'faces': len(me.polygons)})
    return made
