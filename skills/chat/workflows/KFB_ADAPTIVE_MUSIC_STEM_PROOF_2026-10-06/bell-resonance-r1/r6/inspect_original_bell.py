#!/usr/bin/env python3
"""Strict read-only ORIGINAL source-object inspector; no asset substitution and no FEM."""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path
import numpy as np
import trimesh

def inspect(source: Path, target: Path, *, render: bool = True):
    if not source.is_file():
        raise FileNotFoundError("SOURCE_REQUIRED: " + str(source))
    if source.suffix.lower() == ".gltf":
        data = json.loads(source.read_text())
        missing = [x["uri"] for group in ("buffers", "images") for x in data.get(group, [])
                   if x.get("uri") and not x["uri"].startswith("data:")
                   and not (source.parent / x["uri"]).is_file()]
        if missing:
            raise FileNotFoundError("SOURCE_REQUIRED: original dependencies " + ", ".join(missing))
    scene = trimesh.load(str(source), force="scene", process=False)
    meshes = [(node, name, scene.geometry[name].copy(), matrix)
              for node in sorted(scene.graph.nodes_geometry)
              for matrix, name in [scene.graph[node]]]
    if not meshes:
        raise ValueError("SOURCE_REQUIRED: no real mesh")
    target.mkdir(parents=True, exist_ok=True)
    facts = {"source": str(source), "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
             "sourceGeometry": "ORIGINAL_FILE", "FEM": "NOT_TESTED", "models": [], "renders": []}
    for node, name, geometry, matrix in meshes:
        mesh = geometry.copy()
        mesh.apply_transform(matrix)
        facts["models"].append({"node": node, "mesh": name, "vertices": len(mesh.vertices),
                                "triangles": len(mesh.faces), "watertight": bool(mesh.is_watertight),
                                "bounds": np.round(mesh.bounds, 6).tolist()})
    if render:
        import vtk
        from vtk.util.numpy_support import numpy_to_vtk, numpy_to_vtkIdTypeArray
        ren = vtk.vtkRenderer()
        ren.SetBackground(.09, .10, .12)
        for i, (node, name, geo, matrix) in enumerate(meshes):
            mesh = geo.copy()
            mesh.apply_transform(matrix)
            poly = vtk.vtkPolyData()
            pts = vtk.vtkPoints()
            pts.SetData(numpy_to_vtk(np.asarray(mesh.vertices, dtype=np.float64), deep=True))
            poly.SetPoints(pts)
            faces = np.column_stack([np.full(len(mesh.faces), 3), mesh.faces]).astype(np.int64)
            cells = vtk.vtkCellArray()
            cells.SetCells(len(mesh.faces), numpy_to_vtkIdTypeArray(faces.ravel(), deep=True))
            poly.SetPolys(cells)
            mapper = vtk.vtkPolyDataMapper()
            mapper.SetInputData(poly)
            actor = vtk.vtkActor()
            actor.SetMapper(mapper)
            actor.GetProperty().SetColor(*((.55, .52, .48) if "clapper" in name.lower()
                                           else (.70, .48, .29)))
            ren.AddActor(actor)
        window = vtk.vtkRenderWindow()
        window.SetOffScreenRendering(True)
        window.SetSize(900, 900)
        window.AddRenderer(ren)
        center = scene.bounds.mean(axis=0)
        radius = max(.01, np.linalg.norm(scene.bounds[1] - scene.bounds[0]))
        cam = ren.GetActiveCamera()
        cam.SetViewUp(0, 1, 0)
        for label, vector in {"front": (1.8, -2.7, 1.4), "side": (2.8, .2, 1.1),
                              "underside": (1.5, -1, -2.1), "rear": (-1.4, 2.4, 1.4)}.items():
            cam.SetFocalPoint(*center)
            cam.SetPosition(*(center + np.array(vector) * radius))
            ren.ResetCameraClippingRange()
            window.Render()
            grab = vtk.vtkWindowToImageFilter()
            grab.SetInput(window)
            grab.Update()
            filename = target / (source.stem + "_" + label + ".png")
            writer = vtk.vtkPNGWriter()
            writer.SetInputConnection(grab.GetOutputPort())
            writer.SetFileName(str(filename))
            writer.Write()
            facts["renders"].append(str(filename))
        window.Finalize()
    (target / (source.stem + "_inspection.json")).write_text(json.dumps(facts, indent=2) + "\n")
    return facts

if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", required=True, type=Path)
    ap.add_argument("--output", required=True, type=Path)
    ap.add_argument("--no-render", action="store_true")
    opt = ap.parse_args()
    result = inspect(opt.source, opt.output, render=not opt.no_render)
    print(json.dumps({"status": "SOURCE_GEOMETRY_INSPECTED_NOT_FEM_VALIDATED",
                      "models": len(result["models"]), "views": len(result["renders"])}))
