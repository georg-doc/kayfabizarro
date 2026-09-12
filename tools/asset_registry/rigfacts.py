"""AR5 deterministic rig/animation facts for model consumers.

Only file-explicit glTF/GLB structure is reported. This module does not claim that
models are gameplay-compatible, retarget-compatible, good donors, or suitable for
any particular consumer.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from dependencies import read_glb_json


def _node_name(nodes: list[dict], index: int) -> str | None:
    if not isinstance(index, int) or index < 0 or index >= len(nodes):
        return None
    name = nodes[index].get("name")
    return name if isinstance(name, str) and name else None


def _parents(nodes: list[dict]) -> dict[int, int]:
    out: dict[int, int] = {}
    for parent_index, node in enumerate(nodes):
        for child in node.get("children", []) or []:
            if isinstance(child, int) and child not in out:
                out[child] = parent_index
    return out


def _skin_signature(nodes: list[dict], parents: dict[int, int], skin: dict) -> str:
    """Hash names + joint-local parent topology, independent of absolute node indices.

    Equality is a structural fact, not a retargeting guarantee.
    """
    joints = [j for j in skin.get("joints", []) if isinstance(j, int)]
    local_pos = {node_index: i for i, node_index in enumerate(joints)}
    rows = []
    for node_index in joints:
        parent = parents.get(node_index)
        rows.append([
            _node_name(nodes, node_index) or "",
            local_pos.get(parent, -1),
        ])
    skeleton = skin.get("skeleton")
    payload = {
        "joints": rows,
        "skeletonJoint": local_pos.get(skeleton, -1) if isinstance(skeleton, int) else -1,
    }
    raw = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def extract_rig_facts(doc: dict) -> dict:
    nodes = doc.get("nodes", []) or []
    skins = doc.get("skins", []) or []
    animations = doc.get("animations", []) or []
    parents = _parents(nodes)

    all_joints: set[int] = set()
    skin_rows: list[dict] = []
    signatures: list[str] = []
    for skin_index, skin in enumerate(skins):
        joints = [j for j in skin.get("joints", []) if isinstance(j, int)]
        all_joints.update(joints)
        joint_set = set(joints)
        inferred_roots = [j for j in joints if parents.get(j) not in joint_set]
        explicit_root = skin.get("skeleton")
        signature = _skin_signature(nodes, parents, skin)
        signatures.append(signature)
        skin_rows.append({
            "skinIndex": skin_index,
            "name": skin.get("name") if isinstance(skin.get("name"), str) else None,
            "jointCount": len(joints),
            "namedJointCount": sum(1 for j in joints if _node_name(nodes, j)),
            "explicitSkeletonRoot": {
                "nodeIndex": explicit_root,
                "name": _node_name(nodes, explicit_root),
            } if isinstance(explicit_root, int) else None,
            "inferredRootJoints": [
                {"nodeIndex": j, "name": _node_name(nodes, j)} for j in inferred_roots
            ],
            "signature": signature,
        })

    skinned_mesh_nodes = [
        i for i, node in enumerate(nodes)
        if isinstance(node.get("mesh"), int) and isinstance(node.get("skin"), int)
    ]

    clips: list[dict] = []
    for animation_index, animation in enumerate(animations):
        target_nodes: set[int] = set()
        target_paths: set[str] = set()
        for channel in animation.get("channels", []) or []:
            target = channel.get("target", {}) or {}
            node_index = target.get("node")
            if isinstance(node_index, int):
                target_nodes.add(node_index)
            path = target.get("path")
            if isinstance(path, str):
                target_paths.add(path)
        clips.append({
            "animationIndex": animation_index,
            "name": animation.get("name") if isinstance(animation.get("name"), str) else None,
            "channelCount": len(animation.get("channels", []) or []),
            "targetNodeCount": len(target_nodes),
            "targetPaths": sorted(target_paths),
        })

    joint_names = sorted({
        name for j in all_joints
        if (name := _node_name(nodes, j)) is not None
    })
    return {
        "provenance": "file-explicit",
        "parseStatus": "ok",
        "hasSkin": bool(skins or skinned_mesh_nodes),
        "skinCount": len(skins),
        "jointCount": len(all_joints),
        "namedJointCount": len(joint_names),
        "jointNames": joint_names,
        "skinnedMeshNodeCount": len(skinned_mesh_nodes),
        "animationCount": len(animations),
        "animationClips": clips,
        "skins": skin_rows,
        "skeletonSignatures": sorted(set(signatures)),
    }


def _load_doc(repo_root: Path, path: str, fmt: str) -> dict:
    full = repo_root / path
    if fmt == "gltf":
        return json.loads(full.read_text(encoding="utf-8-sig"))
    if fmt == "glb":
        return read_glb_json(full.read_bytes())
    raise ValueError(f"unsupported rig format: {fmt}")


def enrich_rig_facts(repo_root: Path, records: list[dict]) -> tuple[list[dict], list[dict]]:
    enriched: list[dict] = []
    problems: list[dict] = []
    for record in records:
        if record.get("kind") != "model-3d":
            enriched.append(record)
            continue
        rec = dict(record)
        fmt = rec.get("format")
        if fmt in {"gltf", "glb"}:
            try:
                rec["rigFacts"] = extract_rig_facts(_load_doc(repo_root, rec["path"], fmt))
            except Exception as exc:
                rec["rigFacts"] = {
                    "provenance": "generated-structural",
                    "parseStatus": "unresolved",
                    "reason": f"{type(exc).__name__}: {exc}",
                }
                problems.append({
                    "problemId": f"RIG_PARSE_ERROR:{rec['path']}",
                    "type": "RIG_PARSE_ERROR",
                    "assetPath": rec["path"],
                    "detail": f"{type(exc).__name__}: {exc}",
                })
        elif fmt == "obj":
            rec["rigFacts"] = {
                "provenance": "generated-structural",
                "parseStatus": "not-applicable",
                "hasSkin": False,
                "animationCount": 0,
            }
        else:
            rec["rigFacts"] = {
                "provenance": "generated-structural",
                "parseStatus": "unresolved",
                "reason": f"rig parsing not implemented for .{fmt}",
            }
        enriched.append(rec)
    problems.sort(key=lambda p: (p["type"], p["assetPath"]))
    return enriched, problems
