"""S6 · rounded architecture (Georg 27.09): columns, slabs, decks and the core get round edges and round corners.
Non-destructive: two Bevel modifiers per scenery object, the builder geometry stays as it is.
  KFB_round_plan  : plan corners (vertical edges with a sharp corner), radius per role, tagged by edge bevel weight
  KFB_round_edges : every remaining sharp edge (slab rims, column ends, tower top), small radius
Harden normals + smooth shading so flat faces stay flat and only the rounds shade round.
Globals: S6_SCENERY (collection name), S6_ROUND (dict role -> (plan_r, edge_r))."""
import bpy, bmesh, math

SCEN = globals().get('S6_SCENERY', 'S3_UNICENTER_SCENERY')
ROUND = globals().get('S6_ROUND', {
    'columns': (0.34, 0.08),      # 0.7 m square columns -> almost round
    'podium_deck': (4.0, 0.2), 'podium_roof': (4.0, 0.2),
    'wing_deck': (4.0, 0.2),
    'core': (0.0, 1.5),           # cone is round already; the top rim gets a 1.5 m round
})
SEG_PLAN, SEG_EDGE = 6, 3


def tag_plan_corners(me, min_angle=math.radians(20)):
    bm = bmesh.new(); bm.from_mesh(me)
    n = 0; weights = [0.0] * len(bm.edges)
    for e in bm.edges:
        d = (e.verts[1].co - e.verts[0].co)
        if d.length < 1e-6 or abs(d.normalized().z) < 0.95 or len(e.link_faces) != 2:
            continue
        if e.calc_face_angle(0.0) > min_angle:
            weights[e.index] = 1.0; n += 1
    bm.free()
    att = me.attributes.get('bevel_weight_edge') or me.attributes.new('bevel_weight_edge', 'FLOAT', 'EDGE')
    att.data.foreach_set('value', weights)
    return n


def add_bevel(o, name, width, segs, limit, angle=math.radians(30)):
    m = o.modifiers.get(name) or o.modifiers.new(name, 'BEVEL')
    m.width = width; m.segments = segs; m.limit_method = limit; m.affect = 'EDGES'
    m.angle_limit = angle; m.use_clamp_overlap = True; m.harden_normals = True; m.profile = 0.5
    return m


out = {}
for o in bpy.data.collections[SCEN].objects:
    role = o.get('kfb_td02_role')
    if o.type != 'MESH' or role not in ROUND:
        continue
    plan_r, edge_r = ROUND[role]
    me = o.data
    for p in me.polygons:
        p.use_smooth = True
    n = 0
    if plan_r > 0:
        n = tag_plan_corners(me)
        add_bevel(o, 'KFB_round_plan', plan_r, SEG_PLAN, 'WEIGHT')
    add_bevel(o, 'KFB_round_edges', edge_r, SEG_EDGE, 'ANGLE')
    o['kfb_rounded'] = f'plan {plan_r} m / edges {edge_r} m'
    out[o.name] = dict(role=role, plan_corners=n, plan_r=plan_r, edge_r=edge_r)
result = dict(rounded=len(out), objects=out)
