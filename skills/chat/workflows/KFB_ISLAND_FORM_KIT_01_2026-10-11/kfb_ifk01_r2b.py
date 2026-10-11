"""KFB Island Form Kit 01 · K1 R2 (iteration 2) · rock-block clod after golden candidate M1, critic round 1 applied.

Reference: lab-docs/golden/protopia-makerspace_2026-10-11/M1_farm-maker_racetrack.png (Georg's choice 11.10.).
Critic round 1 (5/4/4 of 10) asked for: no lid (rolling ground, grass draping down the rock in patches with bare rock between),
bays and points in the outline, taller and more varied chiselled blocks with tight edges and cracks, 3 readable tiers with ledges,
2-3 off-centre hanging spires, two-tone sandstone with dark joints and warm light, and a portal that is sunk, arched and mossy.

K2 units: H = 3.64, MC = 6.4. Island M = 20 MC.
Parts: ground (one closed mesh), rock blocks (closed meshes in tiers), grass drapes (closed meshes over block tops),
hidden core, spires, floating rocks, optional portal + pipe.
"""
import bpy, bmesh, math, zlib
from mathutils import Vector

MC, H = 6.4, 3.64
TAU = 2 * math.pi


def rng(seed):
    s = [seed & 0xffffffff]

    def f():
        s[0] = (s[0] + 0x6D2B79F5) & 0xffffffff
        a = s[0]
        t = ((a ^ (a >> 15)) * (1 | a)) & 0xffffffff
        t = ((t + (((t ^ (t >> 7)) * (61 | t)) & 0xffffffff)) & 0xffffffff) ^ t
        return ((t ^ (t >> 14)) & 0xffffffff) / 4294967296
    return f


def lin(h):
    h = h.lstrip('#'); c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple((x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4) for x in c) + (1.0,)


PAL = dict(grass_top='#9cc24f', grass_edge='#5f9a3a', drape='#5e9638', rock_lit='#c49a6c', rock_shade='#8a7a6c',
           grey='#9a958d', core='#3a3029', dark='#120d0a', dark2='#2a201a', pipe='#7d8a8f', pipe_rim='#5f6b70', stain='#4d4136')


def link(o, coll):
    for c in list(o.users_collection):
        c.objects.unlink(o)
    coll.objects.link(o)
    return o


# ---------- materials ----------
def mat_basic(name, hexcol, rough=0.9):
    m = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = lin(hexcol); b.inputs['Roughness'].default_value = rough
    return m


def mat_sandstone(name, lit, shade, var=0.0):
    """Two-tone sandstone: warm ochre where the face looks up/at the light, cooler grey-brown on lower faces,
    dark in the joints (ambient occlusion)."""
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; N = nt.nodes; L = nt.links
    b = N['Principled BSDF']; b.inputs['Roughness'].default_value = 0.9
    geo = N.new('ShaderNodeNewGeometry'); sep = N.new('ShaderNodeSeparateXYZ'); L.new(geo.outputs['Normal'], sep.inputs[0])
    mr = N.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = -0.6; mr.inputs['From Max'].default_value = 0.9
    L.new(sep.outputs['Z'], mr.inputs['Value'])
    ramp = N.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].color = lin(shade); ramp.color_ramp.elements[1].color = lin(lit)
    L.new(mr.outputs['Result'], ramp.inputs['Fac'])
    ao = N.new('ShaderNodeAmbientOcclusion'); ao.samples = 8; ao.inputs['Distance'].default_value = 1.4 * MC
    L.new(ramp.outputs['Color'], ao.inputs['Color'])
    mix = N.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'
    sock = lambda n, i, out=False: next(x for x in (n.outputs if out else n.inputs) if x.identifier == i)
    L.new(ramp.outputs['Color'], sock(mix, 'A_Color'))
    gam = N.new('ShaderNodeMath'); gam.operation = 'POWER'; gam.inputs[1].default_value = 1.8
    L.new(ao.outputs['AO'], gam.inputs[0])
    L.new(gam.outputs[0], sock(mix, 'Factor')) if False else None
    comb = N.new('ShaderNodeCombineColor'); [L.new(gam.outputs[0], comb.inputs[i]) for i in range(3)]
    L.new(comb.outputs['Color'], sock(mix, 'B_Color')); mix.inputs['Factor'].default_value = 1.0
    L.new(sock(mix, 'Result_Color', True), b.inputs['Base Color'])
    return m


def mat_grass(name):
    """Grass: yellow-green on top, deeper green toward the edge and on drapes (vertex colour 'Col' carries the radial blend)."""
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes['Principled BSDF']; b.inputs['Roughness'].default_value = 0.95
    a = nt.nodes.new('ShaderNodeVertexColor'); a.layer_name = 'Col'
    nt.links.new(a.outputs['Color'], b.inputs['Base Color'])
    return m


# ---------- outline with bays and points ----------
def make_outline(R0, seed, stretch=(1.0, 1.0)):
    R = rng(seed)
    lobes = [(2, 0.10), (3, 0.09), (4, 0.05), (6, 0.03)]
    ph = [R() * TAU for _ in lobes]
    sx, sy = stretch

    def r(th):
        e = 1.0 / math.sqrt((math.cos(th) / sx) ** 2 + (math.sin(th) / sy) ** 2)
        return R0 * e * (1 + sum(a * math.sin(k * th + ph[i]) for i, (k, a) in enumerate(lobes)))
    return r


# ---------- ground: rolling top, edge inset, one closed mesh with vertex colours ----------
def build_ground(name, coll, rOut0, seed, W, n=200, inset=0.9):
    R = rng(seed); ph = [R() * TAU for _ in range(8)]
    rOut = lambda a: rOut0(a) * (inset + 0.03 * math.sin(9 * a + ph[0]) + 0.02 * math.sin(15 * a + ph[1]))
    amp = 0.04 * W                                     # rolling ground ±4 % of W (critic fix 1)

    def hz(x, y):
        f = (0.5 * math.sin(x / W * 5.1 + ph[2]) * math.cos(y / W * 4.3 + ph[3]) +
             0.3 * math.sin((x + y) / W * 9.0 + ph[4]) + 0.2 * math.cos((x - y) / W * 13 + ph[5]))
        return amp * (0.5 + 0.5 * f)              # rolling, but never below 0: block tops stay hidden under the grass
    bm = bmesh.new(); lay = bm.verts.layers.float_color.new('Col')
    angs = [i / n * TAU for i in range(n)]
    us = [0.12, 0.25, 0.38, 0.5, 0.62, 0.72, 0.8, 0.87, 0.92, 0.96, 0.99]
    lip = [(1.02, -0.25), (1.03, -0.7), (1.0, -1.1), (0.95, -1.3)]
    top_c, edge_c = lin(PAL['grass_top']), lin(PAL['grass_edge'])
    rows = []
    for u in us:
        row = []
        for a in angs:
            r = rOut(a) * u; x, y = math.cos(a) * r, math.sin(a) * r
            v = bm.verts.new((x, y, hz(x, y) * min(1, (1 - u) * 6)))
            t = max(0.0, (u - 0.55) / 0.45) ** 1.5
            v[lay] = tuple(top_c[i] + (edge_c[i] - top_c[i]) * t for i in range(3)) + (1,)
            row.append(v)
        rows.append(row)
    for (f, z) in lip:
        row = []
        for a in angs:
            r = rOut(a) * f; x, y = math.cos(a) * r, math.sin(a) * r
            v = bm.verts.new((x, y, z * MC * (0.7 + 0.3 * math.sin(4 * a + ph[6]))))
            v[lay] = edge_c; row.append(v)
        rows.append(row)
    centre = bm.verts.new((0, 0, hz(0, 0))); centre[lay] = top_c
    bottom = bm.verts.new((0, 0, -1.4 * MC)); bottom[lay] = edge_c
    for i in range(n):
        j = (i + 1) % n
        bm.faces.new((centre, rows[0][i], rows[0][j]))
        for k in range(len(rows) - 1):
            bm.faces.new((rows[k][i], rows[k + 1][i], rows[k + 1][j], rows[k][j]))
        bm.faces.new((rows[-1][j], rows[-1][i], bottom))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    for p in me.polygons:
        p.use_smooth = True
    o = bpy.data.objects.new(name, me); link(o, coll)
    me.materials.append(mat_grass('IFK3_GRASS'))
    return o, hz, rOut


# ---------- chiselled block: tight edges, flat facets, optional crack ----------
def rock_block(name, coll, w, d, h, seed, mat, taper=0.0, round_=0.07):
    R = rng(seed)
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.subdivide_edges(bm, edges=bm.edges[:], cuts=1, use_grid_fill=True)
    for v in bm.verts:
        x, y, z = v.co
        t = 1 - taper * (0.5 - z)
        v.co = Vector((x * w * t * (1 + (R() - .5) * 0.18), y * d * t * (1 + (R() - .5) * 0.18), z * h + (R() - .5) * 0.1 * h))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); link(o, coll)
    bev = o.modifiers.new('BEVEL', 'BEVEL'); bev.width = min(w, d, h) * round_; bev.segments = 2
    bev.limit_method = 'ANGLE'; bev.angle_limit = math.radians(18); bev.harden_normals = True
    me.materials.append(mat)
    return o


def place(o, loc, yaw, tilt=(0, 0)):
    o.location = loc; o.rotation_euler = (tilt[0], tilt[1], yaw)


# ---------- grass/moss drape: a soft sheet that wraps over the block top and hangs down the front face ----------
def drape(name, coll, blk, seed, hfrac, target=None):
    """A grid sheet laid over the top edge and down the front face of a block; the lower hem has an uneven length
    per column (moss dripping), then solidify + subdivision for a soft clay mat, shrinkwrapped onto the block."""
    R = rng(seed)
    w, d, h = blk['w'], blk['d'], blk['h']
    out = blk['out']; side = Vector((-out.y, out.x, 0))
    top = Vector(blk['loc']) + Vector((0, 0, h / 2))
    nx = 9; fl = hfrac * h
    ph = [R() * TAU for _ in range(3)]
    hem = [fl * (0.55 + 0.25 * math.sin(i * 1.3 + ph[0]) + 0.2 * math.sin(i * 2.9 + ph[1]) * R()) for i in range(nx)]
    bm = bmesh.new(); grid = []
    back = [0.9, 0.55, 0.25]                       # rows on the top face (fraction of half depth behind the front edge)
    for i in range(nx):
        t = (i / (nx - 1) - 0.5) * w * 0.92 * (1 - 0.08 * R())
        col = []
        for f in back:                              # on top
            col.append(bm.verts.new(top + side * t - out * (d * 0.5 * f - d * 0.5) + Vector((0, 0, 0.12 * MC))))
        for k in range(1, 6):                       # down the front face
            z = -hem[i] * (k / 5) ** 1.1
            col.append(bm.verts.new(top + side * t + out * (d * 0.5 + 0.12 * MC) + Vector((0, 0, z))))
        grid.append(col)
    for i in range(nx - 1):
        for k in range(len(grid[0]) - 1):
            bm.faces.new((grid[i][k], grid[i + 1][k], grid[i + 1][k + 1], grid[i][k + 1]))
    me = bpy.data.meshes.new(name); bm.to_mesh(me); bm.free()
    o = bpy.data.objects.new(name, me); link(o, coll)
    if target is not None:
        sw = o.modifiers.new('WRAP', 'SHRINKWRAP'); sw.target = target; sw.wrap_method = 'NEAREST_SURFACEPOINT'; sw.offset = 0.12 * MC
    so = o.modifiers.new('THICK', 'SOLIDIFY'); so.thickness = 0.32 * MC; so.offset = 1.0
    ss = o.modifiers.new('SOFT', 'SUBSURF'); ss.levels = 2; ss.render_levels = 2
    for p in me.polygons:
        p.use_smooth = True
    me.materials.append(mat_basic('IFK3_DRAPE', PAL['drape'], 0.95))
    return o


# ---------- island ----------
def build_island(prefix, coll, Dm=128.0, seed=7, style='columns', openings=False, stretch=(1.0, 1.0)):
    R = rng(seed); W = Dm; R0 = Dm / 2
    rOut = make_outline(R0, seed, stretch)
    ground, hz, rG = build_ground(prefix + '_GROUND', coll, rOut, seed + 1, W, inset=0.95)
    mats = [mat_sandstone(f'IFK3_SAND_{i}', lit, sh) for i, (lit, sh) in
            enumerate([(PAL['rock_lit'], PAL['rock_shade']), ('#cfa676', '#8e7d6d'), ('#b98f63', '#7f7062')])]
    mgrey = mat_sandstone('IFK3_GREY', '#9d978d', '#6f6b66')
    rnd = 0.07 if style == 'columns' else 0.16
    # three tiers with ledges (critic fix 4): radius factor, block height range (MC), width range (MC)
    tiers = [(1.0, (3.2, 4.8), (1.6, 3.8)), (0.84, (2.6, 3.8), (1.6, 3.4)), (0.64, (2.2, 3.2), (1.5, 3.0))]
    if style != 'columns':
        tiers = [(1.0, (2.8, 4.2), (2.4, 4.0)), (0.84, (2.4, 3.4), (2.2, 3.6)), (0.64, (2.2, 3.0), (2.0, 3.2))]
    blocks, info = [], []
    z_top = -0.25 * MC
    for ti, (rf, hr, wr) in enumerate(tiers):
        circ = sum((Vector((math.cos(a) * rOut(a), math.sin(a) * rOut(a))) - Vector((math.cos(a + TAU / 128) * rOut(a + TAU / 128),
                    math.sin(a + TAU / 128) * rOut(a + TAU / 128)))).length for a in [i / 128 * TAU for i in range(128)]) * rf
        a = R() * TAU; hmean = (hr[0] + hr[1]) / 2 * MC; placed = 0.0
        while placed < circ * 0.98:
            w = (wr[0] + (wr[1] - wr[0]) * R() ** 1.3) * MC
            da = w / (circ / TAU) * 0.86
            ac = a + da / 2
            h = (hr[0] + (hr[1] - hr[0]) * R()) * MC
            d = (2.0 + 1.0 * R()) * MC
            rr = rOut(ac) * rf - d * 0.38 + (R() - .5) * 0.5 * MC
            if ti == 0:
                lift = (0.03 + 0.06 * R()) * h if R() < 0.12 else -(0.04 + 0.1 * R()) * h   # some stand above the grass, most notched below
                zc = (lift if lift > 0 else -0.15 * MC + lift) - h / 2
            else:
                zc = z_top - h / 2 - R() * 0.12 * hmean
            m = mgrey if R() < 0.05 else mats[int(R() * 3)]
            nm = f'{prefix}_B{ti}_{len(blocks):03d}'
            crack = ti == 0 and R() < 0.35 and h > 3.6 * MC
            if crack:                                    # a horizontal crack: two stacked pieces
                h1 = h * (0.45 + 0.15 * R()); h2 = h - h1 - 0.12 * MC
                b1 = rock_block(nm + 'a', coll, w, d, h1, seed * 977 + len(blocks), m, 0, rnd)
                b2 = rock_block(nm + 'b', coll, w * 0.97, d * 0.97, h2, seed * 983 + len(blocks), m, 0, rnd)
                yaw = ac + math.pi / 2 + (R() - .5) * 0.2
                place(b1, (math.cos(ac) * rr, math.sin(ac) * rr, zc + h / 2 - h1 / 2), yaw)
                place(b2, (math.cos(ac) * rr, math.sin(ac) * rr, zc - h / 2 + h2 / 2), yaw + (R() - .5) * 0.06)
                blocks += [b1, b2]
            else:
                b = rock_block(nm, coll, w, d, h, seed * 991 + len(blocks), m, 0, rnd)
                place(b, (math.cos(ac) * rr, math.sin(ac) * rr, zc), ac + math.pi / 2 + (R() - .5) * 0.2, ((R() - .5) * 0.05, (R() - .5) * 0.05))
                blocks.append(b)
            info.append(dict(tier=ti, w=w, d=d, h=h, loc=(math.cos(ac) * rr, math.sin(ac) * rr, zc), out=Vector((math.cos(ac), math.sin(ac), 0)),
                             top=zc + h / 2, name=nm, obj=blocks[-2] if crack else blocks[-1]))
            a += da; placed += w * 0.86
        bottoms = [i['loc'][2] - i['h'] / 2 for i in info if i['tier'] == ti]
        z_top = sum(bottoms) / len(bottoms) + 0.35 * hmean        # next tier tucks under: visible ledge, stepping in
        # inner fill of the tier (hidden rock)
        for k in range(8):
            ak = k / 8 * TAU + R()
            rr = rOut(ak) * rf * 0.5
            hh = hmean * 0.9; ww = 3.2 * MC
            b = rock_block(f'{prefix}_F{ti}_{k}', coll, ww, ww, hh, seed * 61 + ti * 8 + k, mats[2], 0, rnd)
            place(b, (math.cos(ak) * rr, math.sin(ak) * rr, z_top - hh / 2 + 0.3 * hmean), R() * TAU)
            blocks.append(b)
    zbody = min(i['loc'][2] - i['h'] / 2 for i in info if i['tier'] == 2)
    t2 = [i for i in info if i['tier'] == 2]; z2 = sum(i['loc'][2] - i['h'] / 2 for i in t2) / len(t2)
    for k in range(7):
        ak = k / 7 * TAU + R(); rr = (0.1 + 0.25 * R()) * R0; hh = (2.4 + 1.0 * R()) * MC; ww = (2.6 + 1.0 * R()) * MC
        b = rock_block(f'{prefix}_CAP_{k}', coll, ww, ww * 0.9, hh, seed * 41 + k, mats[k % 3], 0.15, rnd)
        place(b, (math.cos(ak) * rr, math.sin(ak) * rr, z2 - hh / 2 + 0.8 * MC), R() * TAU); blocks.append(b)
    zbody = min(zbody, z2 - 2.6 * MC)
    # 2-3 hanging spires, off-centre, different lengths; longest ≈ 0.5 × body height (critic fix 4)
    body_h = -zbody
    spires = []
    for k, frac in enumerate([0.55, 0.36, 0.24][: 2 + int(R() * 2)]):
        ak = R() * TAU; rr = (0.12 + 0.18 * R()) * R0
        L = body_h * frac; segs = 2 if frac < 0.3 else 3
        zt = zbody + 0.6 * MC; wseg = (3.2 - 0.4 * k) * MC
        for s in range(segs):
            hs = L / segs * 1.15; ws = wseg * (1 - 0.22 * s)
            b = rock_block(f'{prefix}_SPIRE{k}_{s}', coll, ws, ws * 0.9, hs, seed * 71 + k * 5 + s, mats[s % 3], 0.18 + 0.1 * s, rnd)
            place(b, (math.cos(ak) * rr * (1 - 0.15 * s), math.sin(ak) * rr * (1 - 0.15 * s), zt - hs / 2), R() * TAU)
            zt -= hs * 0.82; blocks.append(b); spires.append(b)
    # floating rocks: varied size, largest ≈ 1 block
    for k, s in enumerate([0.8, 0.5, 0.35, 0.25]):
        ak = R() * TAU; rr = (0.25 + 0.35 * R()) * R0; sz = s * 2.6 * MC
        b = rock_block(f'{prefix}_FLOAT_{k}', coll, sz, sz * 0.85, sz * 1.1, seed * 13 + k, mats[k % 3], 0.25, rnd)
        place(b, (math.cos(ak) * rr, math.sin(ak) * rr, zbody - (0.05 + 0.2 * R()) * body_h - sz * 0.5), R() * TAU, (R() * 0.5, R() * 0.5))
        blocks.append(b)
    # hidden core
    bpy.ops.mesh.primitive_cone_add(vertices=32, radius1=R0 * 0.08, radius2=R0 * 0.78, depth=body_h * 0.95)
    core = bpy.context.active_object; core.name = prefix + '_CORE'; link(core, coll)
    core.location = (0, 0, -body_h * 0.5 - 2.5 * MC); core.scale = (stretch[0] * 0.95, stretch[1] * 0.95, 1)
    core.data.materials.append(mat_basic('IFK3_CORE', PAL['core']))
    # grass drapes on about half of the tier-0 rim, bare rock between (critic fix 1)
    drapes = []
    t0 = [i for i in info if i['tier'] == 0]
    for k, i in enumerate(t0):
        if R() < 0.5 and i['top'] < 0.4 * MC:
            drapes.append(drape(i['name'] + '_DRAPE', coll, i, zlib.crc32(i['name'].encode()), 0.3 + 0.35 * R(), i['obj']))
    parts = dict(ground=ground, blocks=blocks, core=core, drapes=drapes, info=info)
    if openings:
        parts['openings'] = add_openings(prefix, coll, rOut, info, parts, seed, mats, mgrey, rnd)
    return parts


def add_openings(prefix, coll, rOut, info, parts, seed, mats, mgrey, rnd):
    """Portal: sunk ≥ 0.5 block, arch of the same blocks, moss on top, dark gradient inside.
    Pipe: sticks out of a block face, ~0.3 block across, wet stain below."""
    R = rng(seed + 5); out = []
    a = -math.pi / 2 + 0.2
    dirv = Vector((math.cos(a), math.sin(a), 0)); side = Vector((-dirv.y, dirv.x, 0)); yaw = a + math.pi / 2
    r = rOut(a)
    door_w, door_h = 2.2 * MC, 1.8 * MC              # road tunnel: 2 lanes + margins; clearance ≥ 1.6 H (K2)
    base = Vector((math.cos(a) * (r - 0.2 * MC), math.sin(a) * (r - 0.2 * MC), -2.0 * MC - door_h / 2))
    # clear blocks in front of the portal
    keep = []
    for b in parts['blocks']:
        rel = b.location - base
        if abs(rel.dot(side)) < door_w / 2 + 1.6 * MC and abs(rel.z) < door_h / 2 + 2.0 * MC and rel.dot(dirv) > -3.5 * MC and '_SPIRE' not in b.name and '_FLOAT' not in b.name:
            bpy.data.objects.remove(b)
        else:
            keep.append(b)
    parts['blocks'] = keep
    kept = []
    for dr in parts['drapes']:
        vs = dr.data.vertices; c = sum((v.co for v in vs), Vector()) / max(1, len(vs))
        rel = c - base
        if abs(rel.dot(side)) < door_w / 2 + 2.2 * MC and abs(rel.z) < door_h / 2 + 4.0 * MC:
            bpy.data.objects.remove(dr)
        else:
            kept.append(dr)
    parts['drapes'] = kept
    # recess: three boxes, darker with depth
    for k, (dep, col) in enumerate([(1.2, PAL['dark2']), (2.4, '#1c1511'), (4.0, PAL['dark'])]):
        rb = rock_block(f'{prefix}_PORTAL_IN{k}', coll, door_w * (1 - 0.05 * k), 1.3 * MC, door_h * (1 - 0.04 * k), seed + 20 + k,
                        mat_basic(f'IFK3_DARK{k}', col, 1.0), 0, 0.05)
        place(rb, base - dirv * dep * MC, yaw); out.append(rb)
    # arch: jambs (stacked blocks) + lintel, same sandstone, moss on top
    for s in (-1, 1):
        for k in range(2):
            hh = door_h / 2 + 0.25 * MC
            j = rock_block(f'{prefix}_PORTAL_J{s:+d}{k}', coll, 1.4 * MC, 2.2 * MC, hh, seed + 30 + k + (s + 1) * 5, mats[k], 0, rnd)
            place(j, base + side * s * (door_w / 2 + 0.7 * MC) + dirv * 0.6 * MC + Vector((0, 0, -door_h / 2 + hh / 2 + k * hh)), yaw + (R() - .5) * 0.08)
            out.append(j)
    lin_ = rock_block(prefix + '_PORTAL_LINTEL', coll, door_w + 3.4 * MC, 2.4 * MC, 1.3 * MC, seed + 40, mats[1], 0, rnd)
    place(lin_, base + dirv * 0.7 * MC + Vector((0, 0, door_h / 2 + 0.65 * MC)), yaw); out.append(lin_)
    # rock around the portal so it sits in the cliff, not on it
    for s in (-1, 1):
        f = rock_block(f'{prefix}_PORTAL_FILL{s:+d}', coll, 3.0 * MC, 2.6 * MC, door_h + 2.6 * MC, seed + 50 + s, mats[2], 0, rnd)
        place(f, base + side * s * (door_w / 2 + 2.9 * MC) + dirv * 0.2 * MC + Vector((0, 0, 0.1 * MC)), yaw + (R() - .5) * 0.1); out.append(f)
    above = rock_block(prefix + '_PORTAL_ABOVE', coll, door_w + 3.0 * MC, 2.4 * MC, 1.6 * MC, seed + 55, mats[0], 0, rnd)
    place(above, base + dirv * 0.2 * MC + Vector((0, 0, door_h / 2 + 1.9 * MC)), yaw); out.append(above)
    info_l = dict(w=door_w + 3.4 * MC, d=2.4 * MC, h=1.3 * MC, out=dirv, loc=tuple(base + dirv * 0.7 * MC + Vector((0, 0, door_h / 2 + 0.65 * MC))))
    out.append(drape(prefix + '_PORTAL_MOSS', coll, info_l, seed + 60, 0.55, lin_))
    # pipe out of a block face, one tier lower, with a stain below
    a2 = -math.pi / 2 - 0.32
    t1 = [i for i in info if i['tier'] == 1]
    blk = min(t1, key=lambda i: abs(((math.atan2(i['loc'][1], i['loc'][0]) - a2 + math.pi) % TAU) - math.pi))
    d2 = blk['out']; face = Vector(blk['loc']) + d2 * (blk['d'] * 0.5)
    pr = 0.3 * blk['w'] / 2 * 1.6
    rot = d2.to_track_quat('Z', 'Y').to_euler()
    for nm, rad, dep, col, off in [('PIPE_WALL', pr, 1.8 * MC, PAL['pipe'], 0.3 * MC), ('PIPE_RIM', pr * 1.2, 0.35 * MC, PAL['pipe_rim'], 1.2 * MC),
                                   ('PIPE_DARK', pr * 0.75, 0.2 * MC, PAL['dark'], 1.32 * MC)]:
        bpy.ops.mesh.primitive_cylinder_add(vertices=40, radius=rad, depth=dep)
        c = bpy.context.active_object; c.name = f'{prefix}_{nm}'; link(c, coll)
        c.location = face + d2 * off; c.rotation_euler = rot
        bv = c.modifiers.new('BEVEL', 'BEVEL'); bv.width = 0.06 * MC; bv.segments = 3
        for p in c.data.polygons:
            p.use_smooth = True
        c.data.materials.append(mat_basic('IFK3_' + nm, col, 0.55 if nm != 'PIPE_DARK' else 1.0)); out.append(c)
    st = rock_block(prefix + '_PIPE_STAIN', coll, pr * 1.3, 0.08 * MC, blk['h'] * 0.45, seed + 70, mat_basic('IFK3_STAIN', PAL['stain'], 0.3), 0.3, 0.3)
    place(st, face + d2 * 0.05 * MC - Vector((0, 0, pr + blk['h'] * 0.22)), math.atan2(d2.y, d2.x) + math.pi / 2); out.append(st)
    return out


def measure(parts):
    objs = [parts['ground'], parts['core']] + parts['blocks'] + parts['drapes'] + parts.get('openings', [])
    dg = bpy.context.evaluated_depsgraph_get(); xs, ys, zs, tris = [], [], [], 0
    for o in objs:
        if '_FLOAT_' in o.name:
            continue
        ev = o.evaluated_get(dg); me = ev.to_mesh()
        for v in me.vertices:
            w = o.matrix_world @ v.co; xs.append(w.x); ys.append(w.y); zs.append(w.z)
        me.calc_loop_triangles(); tris += len(me.loop_triangles); ev.to_mesh_clear()
    W = max(max(xs) - min(xs), max(ys) - min(ys))
    return dict(W=round(W, 1), W_MC=round(W / MC, 1), depth_W=round(-min(zs) / W, 2), objects=len(objs), tris=tris)
