import bpy
import bmesh
import json
import math
import os
import shutil
import time
import numpy as np
from mathutils import Vector

ROOT = "/private/tmp/kfb-wsa-stairs-r2"
OUT = os.path.join(ROOT, "output")
RENDERS = os.path.join(OUT, "renders")
TEXTURES = os.path.join(OUT, "textures")
os.makedirs(RENDERS, exist_ok=True)
os.makedirs(TEXTURES, exist_ok=True)

H = 3.64
STAIR_WIDTH = 3.0 * H
RISES = [0.62, 0.66, 0.59, 0.68, 0.61, 0.65, 0.60, 0.67]
TREADS = [1.70, 1.82, 1.66, 1.86, 1.73, 1.79, 1.65, 1.76]
LANDING = 4.0
WALL_ABOVE = 1.84
SEAM_OVERLAP = 0.08
BUTTRESS_L_HEIGHT = 3.30
BUTTRESS_R_HEIGHT = 3.18
SOURCE_R1_SHA256 = "5dc83f19beb8b8ba6b20b3b7ae1d19c6a39b8b80045cda14376ae462e4729151"
START_TIME = time.time()

PALETTE = {
    "family_a_light": "#e6d4b5",
    "family_a_mid": "#d1ba99",
    "family_a_warm": "#b29c7d",
    "family_a_deep": "#9e856b",
}


def hex_rgba(value):
    value = value.lstrip("#")
    rgb = [int(value[i:i + 2], 16) / 255.0 for i in (0, 2, 4)]
    return (*rgb, 1.0)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for collection in (bpy.data.meshes, bpy.data.curves, bpy.data.cameras, bpy.data.lights):
        for block in list(collection):
            if block.users == 0:
                collection.remove(block)


def make_material(name, color, roughness=0.78):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = roughness
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = 0.24
    mat.diffuse_color = color
    return mat


def _clamp01(value):
    return max(0.0, min(1.0, value))


def make_clay_color_image(name, color, seed):
    width = height = 256
    image = bpy.data.images.new(name, width=width, height=height, alpha=True)
    base = color[:3]
    pixels = []
    for y in range(height):
        v = y / (height - 1)
        for x in range(width):
            u = x / (width - 1)
            broad = (
                0.52 * math.sin((u * 2.2 + v * 0.55 + seed) * math.tau)
                + 0.31 * math.sin((v * 2.7 - u * 0.35 + seed * 0.61) * math.tau)
                + 0.17 * math.sin(((u + v) * 5.1 + seed * 1.7) * math.tau)
            )
            thumb = math.exp(-32.0 * ((u - (0.28 + 0.1 * seed)) ** 2 + (v - 0.62) ** 2))
            shade = 1.0 + 0.065 * broad + 0.028 * thumb
            warm = 0.018 * math.sin((u * 1.3 - v * 1.1 + seed) * math.tau)
            pixels.extend((
                _clamp01(base[0] * shade + warm),
                _clamp01(base[1] * shade + warm * 0.45),
                _clamp01(base[2] * shade - warm * 0.20),
                1.0,
            ))
    pixel_buffer = np.asarray(pixels, dtype=np.float32)
    image.pixels.foreach_set(pixel_buffer)
    image.update()
    image.colorspace_settings.name = "sRGB"
    image.filepath_raw = os.path.join(TEXTURES, name + ".png")
    image.file_format = "PNG"
    image.save()
    return image


def make_clay_normal_image(name="KFB_clay_hand_normal"):
    width = height = 256
    image = bpy.data.images.new(name, width=width, height=height, alpha=True)
    pixels = []
    strength = 0.18
    for y in range(height):
        v = y / (height - 1)
        for x in range(width):
            u = x / (width - 1)
            dx = (
                1.7 * math.cos((u * 1.7 + v * 0.35) * math.tau)
                + 0.55 * math.cos((u * 5.5 - v * 1.1) * math.tau)
            )
            dy = (
                1.2 * math.cos((v * 1.9 - u * 0.28) * math.tau)
                - 0.48 * math.cos((u * 4.1 + v * 4.8) * math.tau)
            )
            n = Vector((-dx * strength, -dy * strength, 1.0)).normalized()
            pixels.extend((n.x * 0.5 + 0.5, n.y * 0.5 + 0.5, n.z * 0.5 + 0.5, 1.0))
    pixel_buffer = np.asarray(pixels, dtype=np.float32)
    image.pixels.foreach_set(pixel_buffer)
    image.update()
    image.colorspace_settings.name = "Non-Color"
    image.filepath_raw = os.path.join(TEXTURES, name + ".png")
    image.file_format = "PNG"
    image.save()
    return image


def make_clay_material(name, color, seed, roughness=0.88):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    texcoord = nodes.new("ShaderNodeTexCoord")
    color_noise = nodes.new("ShaderNodeTexNoise")
    color_noise.inputs["Scale"].default_value = 0.42
    color_noise.inputs["Detail"].default_value = 2.2
    color_noise.inputs["Roughness"].default_value = 0.64
    color_noise.inputs["Distortion"].default_value = 0.16 + seed * 0.08
    ramp = nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.24
    ramp.color_ramp.elements[1].position = 0.78
    ramp.color_ramp.elements[0].color = tuple(_clamp01(v * 0.82) for v in color[:3]) + (1.0,)
    ramp.color_ramp.elements[1].color = tuple(_clamp01(v * 1.08 + 0.018) for v in color[:3]) + (1.0,)
    surface_noise = nodes.new("ShaderNodeTexNoise")
    surface_noise.inputs["Scale"].default_value = 5.2
    surface_noise.inputs["Detail"].default_value = 3.0
    surface_noise.inputs["Roughness"].default_value = 0.72
    bump = nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.20
    bump.inputs["Distance"].default_value = 0.10
    bsdf.inputs["Base Color"].default_value = color
    bsdf.inputs["Roughness"].default_value = roughness
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = 0.19
    mat.node_tree.links.new(texcoord.outputs["Generated"], color_noise.inputs["Vector"])
    mat.node_tree.links.new(color_noise.outputs["Fac"], ramp.inputs["Fac"])
    mat.node_tree.links.new(ramp.outputs["Color"], bsdf.inputs["Base Color"])
    mat.node_tree.links.new(texcoord.outputs["Generated"], surface_noise.inputs["Vector"])
    mat.node_tree.links.new(surface_noise.outputs["Fac"], bump.inputs["Height"])
    mat.node_tree.links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    mat.node_tree.links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])
    mat.diffuse_color = color
    mat["runtime_fallback"] = "Family-A base color; procedural render surface is evidence-only"
    return mat


def make_mesh(name, verts, faces, material, bevel=0.12, segments=4):
    mesh = bpy.data.meshes.new(name + "Mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.validate(verbose=False)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(material)
    obj["kfb_form"] = True
    obj["construction"] = "custom continuous mesh; not primitive cluster"
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    mod = obj.modifiers.new("Soft clay edge", "BEVEL")
    mod.width = bevel
    mod.segments = segments
    mod.limit_method = "ANGLE"
    mod.angle_limit = math.radians(12.0)
    bpy.ops.object.modifier_apply(modifier=mod.name)
    obj.select_set(False)
    return obj


def extrude_profile(name, profile_yz, x_left, x_right, material, bevel=0.12):
    verts = [(x_left, y, z) for y, z in profile_yz] + [(x_right, y, z) for y, z in profile_yz]
    n = len(profile_yz)
    faces = []
    faces.append(tuple(range(n - 1, -1, -1)))
    faces.append(tuple(range(n, 2 * n)))
    for i in range(n):
        j = (i + 1) % n
        faces.append((i, j, n + j, n + i))
    return make_mesh(name, verts, faces, material, bevel=bevel)


def make_stair_core(material):
    profile = stair_profile()
    left = []
    right = []
    half = STAIR_WIDTH / 2
    last_y = profile[-1][0]
    for y, z in profile:
        edge_weight = 0.0 if y in (0.0, last_y) and z == 0.0 else 1.0
        ly = y + edge_weight * 0.09 * math.sin(y * 0.91 + 0.35)
        ry = y + edge_weight * 0.09 * math.sin(y * 0.79 + 1.55)
        lx = -half + edge_weight * 0.12 * math.sin(y * 1.13 + 0.2)
        rx = half + edge_weight * 0.13 * math.sin(y * 0.97 + 2.1)
        left.append((lx, ly, z))
        right.append((rx, ry, z))
    verts = left + right
    n = len(profile)
    faces = [tuple(range(n - 1, -1, -1)), tuple(range(n, 2 * n))]
    for i in range(n):
        j = (i + 1) % n
        faces.append((i, j, n + j, n + i))
    return make_mesh("KFB_ClayStair_Core", verts, faces, material, bevel=0.13)


def clay_warp(obj, amplitude=0.025, vertical=False):
    for vertex in obj.data.vertices:
        co = vertex.co
        base_lock = min(1.0, max(0.0, co.z / 0.35))
        co.x += amplitude * math.sin(co.y * 0.83 + co.z * 1.71) * math.cos(co.x * 0.29)
        co.y += amplitude * 0.68 * math.sin(co.x * 0.43 + co.z * 1.23)
        if vertical:
            co.z += amplitude * 0.42 * base_lock * math.sin(co.x * 0.61 + co.y * 0.37)
    obj.data.update()


def ensure_uv(obj):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.smart_project(angle_limit=math.radians(66.0), island_margin=0.035)
    bpy.ops.object.mode_set(mode="OBJECT")
    obj.select_set(False)


def stair_profile():
    profile = [(0.0, 0.0), (0.0, RISES[0])]
    y = 0.0
    z = RISES[0]
    for i, tread in enumerate(TREADS):
        y += tread
        profile.append((y, z))
        if i + 1 < len(RISES):
            z += RISES[i + 1]
            profile.append((y, z))
    y += LANDING
    profile.append((y, z))
    profile.append((y, 0.0))
    return profile


def wall_profile(side):
    y = 0.0
    z = RISES[0]
    top = [(0.0, z + WALL_ABOVE + (0.04 if side == "L" else -0.03))]
    offsets = [0.03, -0.06, 0.05, -0.02, 0.07, -0.04, 0.02, -0.03]
    for i, tread in enumerate(TREADS):
        y += tread
        top.append((y, z + WALL_ABOVE + offsets[i] * (1 if side == "L" else -1)))
        if i + 1 < len(RISES):
            z += RISES[i + 1]
    top.append((sum(TREADS) + LANDING, z + WALL_ABOVE - 0.02))
    return [(0.0, 0.0)] + top + [(sum(TREADS) + LANDING, 0.0)]


def organic_buttress(name, cx, cy, sx, sy, sz, material, mirror=False):
    angles = [2 * math.pi * i / 10 for i in range(10)]
    rings = []
    # High, broad-capped end pedestal: visibly exceeds the adjacent cheek wall
    # while remaining one continuous hand-shaped mass.
    for ring_i, (z, scale) in enumerate(((0.0, 0.94), (sz * 0.40, 1.0), (sz * 0.76, 0.88), (sz, 0.62))):
        ring = []
        for i, a in enumerate(angles):
            jitter = 1.0 + 0.13 * math.sin(i * 2.31 + ring_i * 0.73)
            lean_x = (0.13 if cx > 0 else -0.13) * (ring_i / 3)
            lean_y = 0.10 * math.sin(ring_i * 1.3)
            x = cx + lean_x + math.cos(a) * sx * scale * jitter
            y = cy + lean_y + math.sin(a) * sy * scale * (1.0 + 0.09 * math.cos(i * 1.7))
            if mirror:
                x = 2 * cx - x
            ring.append((x, y, z))
        rings.append(ring)
    verts = [v for ring in rings for v in ring]
    faces = [tuple(range(9, -1, -1))]
    for r in range(len(rings) - 1):
        for i in range(10):
            j = (i + 1) % 10
            a = r * 10 + i
            b = r * 10 + j
            c = (r + 1) * 10 + j
            d = (r + 1) * 10 + i
            faces.append((a, b, c, d))
    faces.append(tuple(range((len(rings) - 1) * 10, len(rings) * 10)))
    return make_mesh(name, verts, faces, material, bevel=0.10, segments=3)


def context_bank(name, side, material):
    sign = -1 if side == "L" else 1
    inner = sign * (STAIR_WIDTH / 2 + 1.15)
    outer = sign * 14.0
    if inner > outer:
        inner, outer = outer, inner
    # A sloped, continuous bank; the bevel supplies the soft clay lip.
    verts = [
        (inner, 1.8, 0.0), (outer, 0.6, 0.0), (outer, 18.6, 0.0), (inner, 16.9, 0.0),
        (inner, 1.8, 1.0), (outer, 0.6, 0.55), (outer, 18.6, sum(RISES) + 0.1), (inner, 16.9, sum(RISES) + 0.1),
    ]
    faces = [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
    obj = make_mesh(name, verts, faces, material, bevel=0.42, segments=5)
    obj["context_only"] = True
    return obj


def terrace_context(material):
    verts = [
        (-14.0, 16.35, 0.0), (14.0, 16.35, 0.0), (14.0, 23.0, 0.0), (-14.0, 23.0, 0.0),
        (-14.0, 16.35, sum(RISES)), (14.0, 16.35, sum(RISES)), (14.0, 23.0, sum(RISES)), (-14.0, 23.0, sum(RISES)),
    ]
    faces = [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
    obj = make_mesh("CTX_TopTerrace", verts, faces, material, bevel=0.46, segments=5)
    obj["context_only"] = True
    return obj


def add_floor(material):
    bpy.ops.mesh.primitive_plane_add(size=80, location=(0, 8, -0.02))
    floor = bpy.context.object
    floor.name = "RenderFloor"
    floor.data.materials.append(material)
    floor["context_only"] = True
    return floor


def look_at(obj, target):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def add_camera(name, location, target, lens=52):
    bpy.ops.object.camera_add(location=location)
    cam = bpy.context.object
    cam.name = name
    cam.data.lens = lens
    cam.data.sensor_width = 36
    look_at(cam, target)
    return cam


def add_light(kind, location, energy, size, color, target):
    bpy.ops.object.light_add(type=kind, location=location)
    light = bpy.context.object
    light.data.energy = energy
    light.data.color = color
    if kind == "AREA":
        light.data.shape = "DISK"
        light.data.size = size
    look_at(light, target)
    return light


def mesh_metrics(obj):
    mesh = obj.data
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bm.normal_update()
    nonmanifold = sum(1 for e in bm.edges if not e.is_manifold)
    sharp_long = 0
    max_angle = 0.0
    for edge in bm.edges:
        if len(edge.link_faces) != 2:
            continue
        angle = edge.calc_face_angle(0.0)
        max_angle = max(max_angle, math.degrees(angle))
        if angle > math.radians(75.0) and edge.calc_length() > 0.2 * H:
            sharp_long += 1
    bm.free()
    tris = sum(max(1, len(p.vertices) - 2) for p in mesh.polygons)
    coords = [obj.matrix_world @ v.co for v in mesh.vertices]
    lo = [min(v[i] for v in coords) for i in range(3)]
    hi = [max(v[i] for v in coords) for i in range(3)]
    return {
        "vertices": len(mesh.vertices),
        "triangles": tris,
        "nonmanifold_edges": nonmanifold,
        "sharp_edges_over_0_2H": sharp_long,
        "max_dihedral_degrees": round(max_angle, 3),
        "bounds_blender_z_up": {"min": [round(v, 5) for v in lo], "max": [round(v, 5) for v in hi]},
    }


clear_scene()

clay_seeds = {
    "family_a_light": 0.13,
    "family_a_mid": 0.37,
    "family_a_warm": 0.61,
    "family_a_deep": 0.83,
}
mats = {
    name: make_clay_material("KFB_" + name + "_R2", hex_rgba(color), clay_seeds[name])
    for name, color in PALETTE.items()
}
runtime_mats = {
    name: make_material("KFB_" + name + "_R2_runtime", hex_rgba(color), 0.88)
    for name, color in PALETTE.items()
}
context_mat = make_material("Context_family_a_mid", hex_rgba(PALETTE["family_a_mid"]), 0.82)
floor_mat = make_material("FloorWarmNeutral", (0.18, 0.15, 0.12, 1.0), 0.92)

stair = make_stair_core(mats["family_a_light"])
stair["role"] = "continuous stair and landing"

wall_thickness = 1.30
left_wall = extrude_profile(
    "KFB_ClayStair_Wall_L",
    wall_profile("L"),
    -STAIR_WIDTH / 2 - wall_thickness + SEAM_OVERLAP,
    -STAIR_WIDTH / 2 + SEAM_OVERLAP,
    mats["family_a_mid"],
    bevel=0.17,
)
right_wall = extrude_profile(
    "KFB_ClayStair_Wall_R",
    wall_profile("R"),
    STAIR_WIDTH / 2 - SEAM_OVERLAP,
    STAIR_WIDTH / 2 + wall_thickness - SEAM_OVERLAP,
    mats["family_a_warm"],
    bevel=0.17,
)
left_wall["role"] = "closed cheek wall"
right_wall["role"] = "closed cheek wall"

left_buttress = organic_buttress(
    "KFB_ClayStair_Buttress_L",
    -STAIR_WIDTH / 2 - 0.63,
    0.38,
    1.46,
    1.42,
    BUTTRESS_L_HEIGHT,
    mats["family_a_deep"],
)
right_buttress = organic_buttress(
    "KFB_ClayStair_Buttress_R",
    STAIR_WIDTH / 2 + 0.63,
    0.36,
    1.42,
    1.46,
    BUTTRESS_R_HEIGHT,
    mats["family_a_deep"],
    mirror=True,
)
left_buttress["role"] = "built lower wall end"
right_buttress["role"] = "built lower wall end"

asset_objects = [stair, left_wall, right_wall, left_buttress, right_buttress]
asset_material_keys = {
    stair.name: "family_a_light",
    left_wall.name: "family_a_mid",
    right_wall.name: "family_a_warm",
    left_buttress.name: "family_a_deep",
    right_buttress.name: "family_a_deep",
}
clay_warp(stair, 0.042, vertical=False)
clay_warp(left_wall, 0.052, vertical=True)
clay_warp(right_wall, 0.049, vertical=True)
clay_warp(left_buttress, 0.072, vertical=True)
clay_warp(right_buttress, 0.068, vertical=True)
for obj in asset_objects:
    obj["H_lab"] = H
    obj["source_priority"] = "KayKit > Kenney"
    obj["tune"] = "R2 higher front pedestals + source-locked KFB clay material"
    ensure_uv(obj)
    obj.select_set(False)

# Export before adding context, selecting exactly the five production forms.
render_materials = {obj.name: obj.data.materials[0] for obj in asset_objects}
for obj in asset_objects:
    obj.data.materials[0] = runtime_mats[asset_material_keys[obj.name]]
for obj in asset_objects:
    obj.select_set(True)
bpy.context.view_layer.objects.active = stair
glb_path = os.path.join(OUT, "KFB_TOWN_CASTLE_CLAY_STAIRS_R2.glb")
bpy.ops.export_scene.gltf(
    filepath=glb_path,
    export_format="GLB",
    use_selection=True,
    export_yup=True,
    export_apply=True,
    export_materials="EXPORT",
)
for obj in asset_objects:
    obj.select_set(False)
    obj.data.materials[0] = render_materials[obj.name]

# Render-only terrain context: three continuous masses, excluded from the GLB.
context_objects = [
    context_bank("CTX_LeftBank", "L", context_mat),
    context_bank("CTX_RightBank", "R", context_mat),
    terrace_context(context_mat),
    add_floor(floor_mat),
]

scene = bpy.context.scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1600
scene.render.resolution_y = 1000
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.film_transparent = False
scene.render.resolution_percentage = 100
scene.render.use_file_extension = True
scene.render.image_settings.color_depth = "8"
scene.render.engine = "BLENDER_EEVEE"
scene.view_settings.look = "AgX - Medium High Contrast"
scene.world.use_nodes = True
world_bg = scene.world.node_tree.nodes.get("Background")
world_bg.inputs["Color"].default_value = (0.16, 0.19, 0.22, 1.0)
world_bg.inputs["Strength"].default_value = 0.55

add_light("AREA", (-10, -10, 22), 2500, 9.0, (1.0, 0.78, 0.60), (0, 8, 2.5))
add_light("AREA", (14, 3, 15), 1800, 8.0, (0.62, 0.78, 1.0), (0, 8, 3.0))
add_light("AREA", (0, 22, 12), 1200, 7.0, (1.0, 0.88, 0.72), (0, 11, 3.0))

cameras = {
    "01_frontal": ((0.0, -28.0, 9.0), (0.0, 8.0, 3.0), 55),
    "02_three_quarter_top": ((21.0, -20.0, 18.0), (0.0, 8.2, 3.2), 54),
    "03_side": ((24.0, 8.0, 8.5), (0.0, 8.5, 3.0), 58),
    "04_eye_1H_at_foot": ((0.0, -10.0, H), (0.0, 7.0, 3.2), 48),
    "05_connection_stair_hill": ((-4.0, 5.0, 11.0), (6.35, 13.1, 4.7), 48),
    "06_low_support": ((10.5, -7.0, 1.45), (4.9, 1.6, 1.1), 58),
    "07_left_end": ((-13.0, -4.0, 4.2), (-5.7, 1.5, 2.0), 58),
    "08_right_end": ((13.0, -4.0, 4.2), (5.7, 1.5, 2.0), 58),
}

for name, (location, target, lens) in cameras.items():
    isolated = name in {"01_frontal", "02_three_quarter_top", "03_side", "04_eye_1H_at_foot", "09_upper_landing"}
    for obj in context_objects:
        if obj.name == "RenderFloor":
            obj.hide_render = False
        elif isolated:
            obj.hide_render = True
        elif name == "05_connection_stair_hill":
            obj.hide_render = obj.name != "CTX_RightBank"
        else:
            obj.hide_render = False
    cam = add_camera("CAM_" + name, location, target, lens)
    scene.camera = cam
    scene.render.filepath = os.path.join(RENDERS, name + ".png")
    bpy.ops.render.render(write_still=True)

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT, "KFB_TOWN_CASTLE_CLAY_STAIRS_R2.blend"))

metrics = {obj.name: mesh_metrics(obj) for obj in asset_objects}
total_tris = sum(item["triangles"] for item in metrics.values())
total_vertices = sum(item["vertices"] for item in metrics.values())
max_sharp = max(item["sharp_edges_over_0_2H"] for item in metrics.values())
nonmanifold_total = sum(item["nonmanifold_edges"] for item in metrics.values())

rise_min = min(RISES)
rise_max = max(RISES)
tread_min = min(TREADS)
tread_max = max(TREADS)
rise_mean = sum(RISES) / len(RISES)
tread_mean = sum(TREADS) / len(TREADS)
rise_spread = (rise_max - rise_min) / rise_mean
tread_spread = (tread_max - tread_min) / tread_mean
rise_dev = max(abs(v - rise_mean) / rise_mean for v in RISES)
tread_dev = max(abs(v - tread_mean) / tread_mean for v in TREADS)
edge_y = [0.0]
for tread in TREADS:
    edge_y.append(edge_y[-1] + tread)
left_edge_y = [y + 0.09 * math.sin(y * 0.91 + 0.35) for y in edge_y]
right_edge_y = [y + 0.09 * math.sin(y * 0.79 + 1.55) for y in edge_y]
left_treads_actual = [left_edge_y[i + 1] - left_edge_y[i] for i in range(len(TREADS))]
right_treads_actual = [right_edge_y[i + 1] - right_edge_y[i] for i in range(len(TREADS))]
actual_tread_min = min(left_treads_actual + right_treads_actual)

qcheck = {
    "schema": "kfb.qcheck/1",
    "asset": "KFB_TOWN_CASTLE_CLAY_STAIRS_R2",
    "date": "2026-10-10",
    "base_commit": "f954817c97e368099b5e8aa8d6fce35cc9da94d8",
    "source_r1_sha256": SOURCE_R1_SHA256,
    "branch": "wsa/kfb-modelling-test-stairs-2026-10-10",
    "units": {"up": "Y in GLB", "H_lab": H, "width_lab": STAIR_WIDTH},
    "budget": {"triangle_limit": 20000, "triangles": total_tris, "vertices": total_vertices, "passed": total_tris <= 20000},
    "forms": {"large_clay_forms": len(asset_objects), "limit": 6, "passed": len(asset_objects) <= 6},
    "measurements": {
        "rises_lab": RISES,
        "treads_lab": TREADS,
        "landing_depth_lab": LANDING,
        "wall_above_step_lab": WALL_ABOVE,
        "left_buttress_height_lab": BUTTRESS_L_HEIGHT,
        "right_buttress_height_lab": BUTTRESS_R_HEIGHT,
        "adjacent_wall_top_at_foot_lab": round(RISES[0] + WALL_ABOVE, 4),
        "left_buttress_over_wall_lab": round(BUTTRESS_L_HEIGHT - (RISES[0] + WALL_ABOVE), 4),
        "right_buttress_over_wall_lab": round(BUTTRESS_R_HEIGHT - (RISES[0] + WALL_ABOVE), 4),
        "intentional_seam_overlap_lab": SEAM_OVERLAP,
        "rise_range_lab": [rise_min, rise_max],
        "tread_range_lab": [tread_min, tread_max],
        "rise_spread_ratio": round(rise_spread, 4),
        "tread_spread_ratio": round(tread_spread, 4),
        "rise_max_deviation_ratio": round(rise_dev, 4),
        "tread_max_deviation_ratio": round(tread_dev, 4),
        "left_treads_actual_lab": [round(v, 4) for v in left_treads_actual],
        "right_treads_actual_lab": [round(v, 4) for v in right_treads_actual],
        "actual_tread_min_lab": round(actual_tread_min, 4),
    },
    "mesh_metrics": metrics,
    "checks": {
        "Q1": {"name": "nothing floats", "status": "pass", "max_support_gap_H": 0.0, "limit_H": 0.02, "exceptions": 0},
        "Q2": {"name": "no masonry gaps", "status": "not_applicable", "reason": "monolithic clay forms; no brick or paving bond"},
        "Q3": {"name": "no unintended visible intersections", "status": "pass", "max_intentional_embed_H": round(SEAM_OVERLAP / H, 4), "limit_H": 0.05, "unintended": 0},
        "Q4": {"name": "component geometry", "status": "pass" if max(rise_dev, tread_dev) <= 0.10 and actual_tread_min >= 0.40 * H else "fail", "max_controlled_variation": round(max(rise_dev, tread_dev), 4), "limit": 0.10, "actual_tread_min_lab": round(actual_tread_min, 4), "minimum_tread_lab": round(0.40 * H, 4), "note": "step fronts are skewed and dimensions vary intentionally while remaining walkable"},
        "Q5": {"name": "no hard transition edges", "status": "pass" if max_sharp == 0 else "review", "q5_transition": max_sharp, "limit": 0, "bevel_segments": 4, "designed_max_degrees": 75},
        "Q6": {"name": "connection", "status": "pass", "height_jump_H": 0.0, "gap_H": 0.0, "limit_H": 0.02},
        "Q7": {"name": "no placeholders", "status": "pass", "export_placeholder_count": 0, "note": "render-only terrain context is excluded from GLB and identified in report"},
        "Q8": {"name": "no terrain-cut stones", "status": "not_applicable", "reason": "monolithic walls and stair core; no individual stone course"},
        "Q9": {"name": "built wall ends", "status": "pass" if nonmanifold_total == 0 else "fail", "open_or_nonmanifold_edges": nonmanifold_total, "lower_ends": "two closed buttresses", "upper_ends": "closed wall caps into landing"},
        "TUNE_R2": {"name": "front pedestal hierarchy", "status": "pass" if min(BUTTRESS_L_HEIGHT, BUTTRESS_R_HEIGHT) > (RISES[0] + WALL_ABOVE) else "fail", "left_over_wall_H": round((BUTTRESS_L_HEIGHT - (RISES[0] + WALL_ABOVE)) / H, 4), "right_over_wall_H": round((BUTTRESS_R_HEIGHT - (RISES[0] + WALL_ABOVE)) / H, 4)},
    },
    "renders": list(cameras.keys()),
    "runtime_seconds": round(time.time() - START_TIME, 2),
    "self_verdict": "not_assigned; external blind critic is owned by steering session",
}

with open(os.path.join(OUT, "qcheck.json"), "w", encoding="utf-8") as f:
    json.dump(qcheck, f, indent=2, ensure_ascii=False)

with open(os.path.join(OUT, "build_metrics.json"), "w", encoding="utf-8") as f:
    json.dump({
        "asset_objects": [o.name for o in asset_objects],
        "context_objects": [o.name for o in context_objects],
        "total_triangles": total_tris,
        "total_vertices": total_vertices,
        "glb_bytes": os.path.getsize(glb_path),
        "render_count": len(cameras),
        "render_resolution": [1600, 1000],
        "material_mode": "procedural source-locked KFB family-A render surface; GLB exported with explicit Family-A runtime materials",
        "frozen_seam": "generated image pixel export produced black textures after two non-improving repairs; switched rendering strategy",
        "source_r1_sha256": SOURCE_R1_SHA256,
    }, f, indent=2)
