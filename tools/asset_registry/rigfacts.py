#!/usr/bin/env python3
"""AR5 deterministic rig/animation facts for model consumers.

Only file-explicit glTF/GLB structure is reported. This module does not claim that
models are gameplay-compatible, retarget-compatible, good donors, or suitable for
any particular consumer.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import subprocess
from collections import Counter
from pathlib import Path

from dependencies import read_glb_json

RIG_SCHEMA = "kfb.asset-rig-facts.v1"
DEFAULT_REGISTRY = "registry/assets/v1"


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
        rows.append([_node_name(nodes, node_index) or "", local_pos.get(parent, -1)])
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


def rig_facts_for_record(repo_root: Path, record: dict) -> tuple[dict, dict | None]:
    fmt = record.get("format")
    if fmt in {"gltf", "glb"}:
        try:
            return extract_rig_facts(_load_doc(repo_root, record["path"], fmt)), None
        except Exception as exc:
            detail = f"{type(exc).__name__}: {exc}"
            return {
                "provenance": "generated-structural",
                "parseStatus": "unresolved",
                "reason": detail,
            }, {
                "problemId": f"RIG_PARSE_ERROR:{record['path']}",
                "type": "RIG_PARSE_ERROR",
                "assetPath": record["path"],
                "detail": detail,
            }
    if fmt == "obj":
        return {
            "provenance": "generated-structural",
            "parseStatus": "not-applicable",
            "hasSkin": False,
            "animationCount": 0,
        }, None
    return {
        "provenance": "generated-structural",
        "parseStatus": "unresolved",
        "reason": f"rig parsing not implemented for .{fmt}",
    }, None


def enrich_rig_facts(repo_root: Path, records: list[dict]) -> tuple[list[dict], list[dict]]:
    enriched: list[dict] = []
    problems: list[dict] = []
    for record in records:
        if record.get("kind") != "model-3d":
            enriched.append(record)
            continue
        rec = dict(record)
        facts, problem = rig_facts_for_record(repo_root, rec)
        rec["rigFacts"] = facts
        if problem:
            problems.append(problem)
        enriched.append(rec)
    problems.sort(key=lambda p: (p["type"], p["assetPath"]))
    return enriched, problems


def _read_catalog(path: Path) -> list[dict]:
    records: list[dict] = []
    with path.open("r", encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line:
                records.append(json.loads(line))
    return records


def _write_json(path: Path, value: object) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def build_sidecar(repo_root: Path, registry_dir: Path) -> dict:
    manifest = json.loads((registry_dir / "manifest.json").read_text(encoding="utf-8"))
    source_commit = manifest["sourceCommit"]
    rows: list[dict] = []
    problems: list[dict] = []
    for record in _read_catalog(registry_dir / "catalog.jsonl"):
        if record.get("kind") != "model-3d":
            continue
        facts, problem = rig_facts_for_record(repo_root, record)
        rows.append({
            "schema": RIG_SCHEMA,
            "assetId": record["assetId"],
            "path": record["path"],
            "format": record["format"],
            "sourceCommit": source_commit,
            "sourceBlobSha": record.get("source", {}).get("blobSha"),
            "rigFacts": facts,
        })
        if problem:
            problems.append(problem)
    rows.sort(key=lambda row: row["path"])
    problems.sort(key=lambda p: (p["type"], p["assetPath"]))

    with (registry_dir / "rigfacts.jsonl").open("w", encoding="utf-8", newline="\n") as fh:
        for row in rows:
            fh.write(json.dumps(row, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n")

    status_counts = Counter(row["rigFacts"].get("parseStatus", "unknown") for row in rows)
    rigged = sum(1 for row in rows if row["rigFacts"].get("hasSkin") is True)
    animated = sum(1 for row in rows if (row["rigFacts"].get("animationCount") or 0) > 0)
    summary = {
        "schema": "kfb.asset-rig-summary.v1",
        "sourceCommit": source_commit,
        "modelCount": len(rows),
        "riggedModelCount": rigged,
        "animatedModelCount": animated,
        "parseStatus": dict(sorted(status_counts.items())),
        "problemCount": len(problems),
        "problems": problems,
        "note": "Skeleton signature equality is structural evidence only, not a retargeting/gameplay compatibility guarantee.",
    }
    _write_json(registry_dir / "rigfacts-summary.json", summary)
    return summary


def validate_sidecar(registry_dir: Path) -> list[str]:
    errors: list[str] = []
    manifest = json.loads((registry_dir / "manifest.json").read_text(encoding="utf-8"))
    expected_commit = manifest["sourceCommit"]
    model_ids = {
        record["assetId"] for record in _read_catalog(registry_dir / "catalog.jsonl")
        if record.get("kind") == "model-3d"
    }
    rows = _read_catalog(registry_dir / "rigfacts.jsonl")
    row_ids = [row.get("assetId") for row in rows]
    if len(row_ids) != len(set(row_ids)):
        errors.append("duplicate assetId in rigfacts.jsonl")
    if set(row_ids) != model_ids:
        errors.append("rigfacts.jsonl does not exactly cover model-3d assets")
    for row in rows:
        if row.get("sourceCommit") != expected_commit:
            errors.append(f"sourceCommit mismatch: {row.get('assetId')}")
    summary = json.loads((registry_dir / "rigfacts-summary.json").read_text(encoding="utf-8"))
    if summary.get("sourceCommit") != expected_commit:
        errors.append("rigfacts-summary sourceCommit mismatch")
    if summary.get("modelCount") != len(rows):
        errors.append("rigfacts-summary modelCount mismatch")
    return errors


def find_repo_root(start: Path | None = None) -> Path:
    start = (start or Path.cwd()).resolve()
    out = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"], cwd=start, check=True,
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
    ).stdout.strip()
    return Path(out)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build or validate KFB rig facts sidecar")
    parser.add_argument("command", choices=("build", "validate"))
    parser.add_argument("--repo-root")
    parser.add_argument("--registry", default=DEFAULT_REGISTRY)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    repo_root = Path(args.repo_root).resolve() if args.repo_root else find_repo_root()
    registry_dir = Path(args.registry)
    if not registry_dir.is_absolute():
        registry_dir = repo_root / registry_dir
    if args.command == "build":
        print(json.dumps(build_sidecar(repo_root, registry_dir), sort_keys=True))
        return 0
    errors = validate_sidecar(registry_dir)
    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1
    print(f"OK: {registry_dir / 'rigfacts.jsonl'}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
