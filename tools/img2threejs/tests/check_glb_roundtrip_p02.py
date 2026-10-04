"""Independent Pilot 02 GLB re-import. Run after check_landmarks_p02.mjs.
Requires numpy and trimesh; no browser or consumer acceptance is implied.
"""
from pathlib import Path
import json
import numpy as np
import trimesh
ROOT = Path(__file__).resolve().parents[1] / 'evidence/2026-09-18-landmark-pilot-02'
def main():
    results = []
    for asset_id in ('pentagon', 'spasskaya', 'kremlin-wall'):
        asset = json.loads((ROOT / f'{asset_id}-geometry.json').read_text())['asset']
        scene = trimesh.load(ROOT / f'{asset_id}.glb', force='scene')
        triangles = sum(len(mesh.faces) for mesh in scene.geometry.values())
        error = float(np.max(np.abs(scene.bounds - np.array([asset['bounds']['min'], asset['bounds']['max']]))))
        assert triangles == asset['triangles'], f'{asset_id}: triangle mismatch'
        assert error < 0.0001, f'{asset_id}: bounds mismatch {error}'
        assert all(np.isfinite(mesh.vertices).all() for mesh in scene.geometry.values())
        assert len(scene.geometry) == len({p['zone'] for p in asset['parts']})
        results.append({'id': asset_id, 'triangles': triangles, 'matches': True, 'boundsMaxErrorM': error, 'meshes': len(scene.geometry)})
    report = {'test': 'trimesh binary re-import, not browser/consumer', 'results': results}
    (ROOT / 'glb-roundtrip.json').write_text(json.dumps(report, indent=2) + '\n')
    print(json.dumps(report, indent=2))
if __name__ == '__main__':
    main()
