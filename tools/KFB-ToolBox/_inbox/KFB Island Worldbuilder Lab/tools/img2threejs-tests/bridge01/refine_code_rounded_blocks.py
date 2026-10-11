"""refine-code (iteration 3) post-process for the generated factory.

The img2threejs v2.0.0 generator ignores geometryDescriptor.edgeTreatment.bevelRadius and,
for `subdivide` boxes, hard-codes a 1-segment BoxGeometry before Catmull-Clark, which turns
every block into an ellipsoid "pebble". The spec cannot express a filleted block, so this
patch swaps those geometries for THREE RoundedBoxGeometry(w, h, d, seg, r) with
r = ROUND * min(w, h, d) (spec: bevel radius >= 18% of min dimension; we use 28%),
and drops the post-hoc non-uniform scale (which would also squash the fillets).
Re-apply after every regeneration:  python3 -I refine_code_rounded_blocks.py <factory.ts>
"""
import re, sys
ROUND = 0.28
p = sys.argv[1]
s = open(p).read()
if "RoundedBoxGeometry" not in s.split("\n", 12)[0:12].__str__():
    s = s.replace("import * as THREE from 'three';",
                  "import * as THREE from 'three';\nimport { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';", 1)
def rb(w, h, d):
    w, h, d = float(w), float(h), float(d)
    r = round(ROUND * min(w, h, d), 3)
    return f"new RoundedBoxGeometry({w}, {h}, {d}, 4, {r})"
# subdivided boxes
pat1 = re.compile(r"new THREE\.BoxGeometry\(1, 1, 1\);\n    return subdivideCatmullClark\(geometry, \d\);\n  \}\)\(\);\n  if \(!(endpoint_\w+)\) \{\n    (mesh_\w+Geometry)\.scale\(([\d.]+), ([\d.]+), ([\d.]+)\);\n  \}")
n1 = 0
def f1(m):
    global n1; n1 += 1
    return f"{rb(m.group(3), m.group(4), m.group(5))};\n    return geometry;\n  }})();\n  if (!{m.group(1)}) {{\n    {m.group(2)}.scale(1, 1, 1);\n  }}"
s = pat1.sub(f1, s)
# plain (non-subdivided) visible boxes larger than pivot carriers
pat2 = re.compile(r"new THREE\.BoxGeometry\(1, 1, 1, \d+, \d+, \d+\);\n  if \(!(endpoint_\w+)\) \{\n    (mesh_\w+Geometry)\.scale\(([\d.]+), ([\d.]+), ([\d.]+)\);\n  \}")
n2 = 0
def f2(m):
    global n2
    w, h, d = map(float, m.group(3, 4, 5))
    if min(w, h, d) < 0.1:
        return m.group(0)
    n2 += 1
    return f"{rb(w, h, d)};\n  if (!{m.group(1)}) {{\n    {m.group(2)}.scale(1, 1, 1);\n  }}"
s = pat2.sub(f2, s)
open(p, "w").write(s)
print(f"rounded subdivided boxes: {n1}, rounded plain boxes: {n2}")
