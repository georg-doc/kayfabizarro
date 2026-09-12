#!/usr/bin/env python3
"""Deterministic AR1+AR2 KFB Asset Registry builder.

AR1 records exact Git inventory facts for loadable assets.
AR2 adds deterministic structural packs and explicit model dependency resolution.
Semantic gameplay roles, licenses, donor suitability, and deck semantics remain out of scope.

Same commit + same config + same override files => byte-identical output.
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from collections import Counter, defaultdict
from pathlib import Path, PurePosixPath
from typing import Iterable
from urllib.parse import quote

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

from dependencies import duplicate_name_problems, resolve_all_models
from packs import assign_packs

SCHEMA = "kfb.asset-registry.v1"
GENERATOR = "tools/asset_registry/build.py"

MODEL_EXTS = {".glb", ".gltf", ".fbx", ".obj", ".blend", ".dae", ".3ds"}
IMAGE_EXTS = {".png", ".jpg", ".svg", ".tif", ".gif", ".webp"}
AUDIO_EXTS = {".wav", ".ogg", ".mp3"}
KIND_BY_EXTENSION = {
    **{ext: "model-3d" for ext in MODEL_EXTS},
    **{ext: "image-2d" for ext in IMAGE_EXTS},
    **{ext: "audio" for ext in AUDIO_EXTS},
}


def _git(repo_root: Path, *args: str) -> str:
    proc = subprocess.run(["git", *args], cwd=repo_root, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return proc.stdout.strip()


def _git_bytes(repo_root: Path, *args: str) -> bytes:
    proc = subprocess.run(["git", *args], cwd=repo_root, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return proc.stdout


def find_repo_root(start: Path | None = None) -> Path:
    start = (start or Path.cwd()).resolve()
    out = subprocess.run(["git", "rev-parse", "--show-toplevel"], cwd=start, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True).stdout.strip()
    return Path(out)


def load_config(repo_root: Path, config_path: str) -> dict:
    path = Path(config_path)
    if not path.is_absolute():
        path = repo_root / path
    return json.loads(path.read_text(encoding="utf-8"))


def load_optional_json(repo_root: Path, rel: str | None, default: object) -> object:
    if not rel:
        return default
    path = Path(rel)
    if not path.is_absolute():
        path = repo_root / path
    if not path.exists():
        return default
    return json.loads(path.read_text(encoding="utf-8"))


def classify(path: str) -> str | None:
    return KIND_BY_EXTENSION.get(PurePosixPath(path).suffix.lower())


def is_texture_candidate(path: str) -> bool:
    return any(part.casefold() == "textures" for part in PurePosixPath(path).parts)


def is_excluded(path: str, exclude_prefixes: Iterable[str]) -> bool:
    if PurePosixPath(path).name == ".DS_Store":
        return True
    return any(path.startswith(prefix) for prefix in exclude_prefixes)


def matched_root(path: str, roots: Iterable[str]) -> str | None:
    for root in roots:
        root = root.rstrip("/")
        if path == root or path.startswith(root + "/"):
            return root
    return None


def raw_url(repo: str, ref: str, path: str) -> str:
    return f"https://raw.githubusercontent.com/{repo}/{ref}/{quote(path, safe='/')}"


def git_tree_entries(repo_root: Path, roots: list[str]) -> list[dict]:
    """Read all tracked blobs under roots; non-asset files are retained for dependency existence checks."""
    payload = _git_bytes(repo_root, "ls-tree", "-r", "-l", "-z", "HEAD", "--", *roots)
    entries: list[dict] = []
    for raw in payload.split(b"\0"):
        if not raw:
            continue
        meta, path_bytes = raw.split(b"\t", 1)
        mode_b, type_b, sha_b, size_b = meta.split(None, 3)
        mode = mode_b.decode("ascii")
        obj_type = type_b.decode("ascii")
        if obj_type != "blob" or not mode.startswith("100"):
            continue
        size_text = size_b.decode("ascii").strip()
        if size_text == "-":
            continue
        entries.append({
            "mode": mode,
            "blobSha": sha_b.decode("ascii"),
            "sizeBytes": int(size_text),
            "path": path_bytes.decode("utf-8", errors="strict"),
        })
    entries.sort(key=lambda item: item["path"])
    return entries


def make_record(entry: dict, *, repo: str, commit: str, roots: list[str]) -> dict:
    path = entry["path"]
    kind = classify(path)
    if kind is None:
        raise ValueError(f"unsupported path passed to make_record: {path}")
    fmt = PurePosixPath(path).suffix.lower().lstrip(".")
    root = matched_root(path, roots)
    record = {
        "assetId": path,
        "name": PurePosixPath(path).stem,
        "path": path,
        "root": root,
        "folder": str(PurePosixPath(path).parent),
        "kind": kind,
        "format": fmt,
        "sizeBytes": entry["sizeBytes"],
        "source": {
            "repo": repo,
            "commit": commit,
            "blobSha": entry["blobSha"],
            "rawLatest": raw_url(repo, "main", path),
            "rawPinned": raw_url(repo, commit, path),
        },
        "provenance": {"identity": "repo-exact", "kind": "generated-structural"},
    }
    if kind == "image-2d":
        record["hints"] = {
            "textureCandidate": is_texture_candidate(path),
            "textureCandidateProvenance": "generated-structural",
        }
    return record


def _write_json(path: Path, value: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _pack_outputs(out_dir: Path, packs: dict[str, dict], records: list[dict]) -> None:
    by_pack: dict[str, list[dict]] = defaultdict(list)
    for rec in records:
        by_pack[rec["packId"]].append(rec)

    model_status: dict[str, Counter] = defaultdict(Counter)
    for rec in records:
        if rec["kind"] == "model-3d":
            model_status[rec["packId"]][rec.get("dependencyStatus", "unresolved")] += 1

    index: list[dict] = []
    for pack_id, meta in sorted(packs.items()):
        item = dict(meta)
        item["dependencyStatus"] = dict(sorted(model_status[pack_id].items()))
        item["shard"] = f"packs/{pack_id}.json"
        index.append(item)
        shard = {
            "schema": "kfb.asset-pack.v1",
            **item,
            "assets": sorted(by_pack.get(pack_id, []), key=lambda rec: rec["path"]),
        }
        _write_json(out_dir / "packs" / f"{pack_id}.json", shard)
    _write_json(out_dir / "packs" / "index.json", index)


def build_registry(repo_root: Path, config: dict, out_dir: Path | None = None) -> dict:
    repo = config["sourceRepo"]
    roots = list(config["roots"])
    exclude_prefixes = list(config.get("excludePrefixes", []))
    out_dir = out_dir or (repo_root / config["output"])

    commit = _git(repo_root, "rev-parse", "HEAD")
    commit_time = _git(repo_root, "show", "-s", "--format=%cI", "HEAD")

    tree_entries = git_tree_entries(repo_root, roots)
    tracked_paths = {entry["path"] for entry in tree_entries if not is_excluded(entry["path"], exclude_prefixes)}
    records: list[dict] = []
    for entry in tree_entries:
        path = entry["path"]
        if is_excluded(path, exclude_prefixes) or classify(path) is None:
            continue
        records.append(make_record(entry, repo=repo, commit=commit, roots=roots))
    records.sort(key=lambda rec: rec["path"])

    pack_overrides = load_optional_json(repo_root, config.get("packOverrides"), {})
    dependency_overrides = load_optional_json(repo_root, config.get("dependencyOverrides"), {})
    packs = assign_packs(records, roots, pack_overrides)
    records, dependency_problems = resolve_all_models(
        repo_root,
        records,
        tracked_paths=tracked_paths,
        overrides=dependency_overrides,
    )
    problems = dependency_problems + duplicate_name_problems(records)
    problems.sort(key=lambda p: (p["type"], p.get("assetPath", ""), p.get("problemId", "")))

    by_kind: dict[str, list[dict]] = defaultdict(list)
    for rec in records:
        by_kind[rec["kind"]].append(rec)
    counts = Counter(rec["kind"] for rec in records)
    root_counts = Counter(rec["root"] for rec in records)
    texture_candidates = sum(1 for rec in records if rec.get("hints", {}).get("textureCandidate") is True)
    dependency_counts = Counter(rec.get("dependencyStatus") for rec in records if rec["kind"] == "model-3d")
    problem_counts = Counter(p["type"] for p in problems)

    shard_paths = {
        "model-3d": "kinds/model-3d.json",
        "image-2d": "kinds/image-2d.json",
        "audio": "kinds/audio.json",
    }
    manifest = {
        "schema": SCHEMA,
        "sourceRepo": repo,
        "sourceCommit": commit,
        "sourceCommitTime": commit_time,
        "generator": GENERATOR,
        "roots": roots,
        "excludePrefixes": exclude_prefixes,
        "overrides": {
            "packs": config.get("packOverrides"),
            "dependencies": config.get("dependencyOverrides"),
        },
        "counts": {
            "total": len(records),
            "byKind": {kind: counts.get(kind, 0) for kind in sorted(shard_paths)},
            "byRoot": {root: root_counts.get(root, 0) for root in roots},
            "packs": len(packs),
            "textureCandidates": texture_candidates,
            "dependencies": {status: dependency_counts.get(status, 0) for status in ("complete", "embedded", "missing", "unresolved")},
            "problems": dict(sorted(problem_counts.items())),
        },
        "shards": {**shard_paths, "packs": "packs/index.json", "problems": "problems.json"},
        "catalog": "catalog.jsonl",
        "determinism": "same commit + same config + same override files => byte-identical output",
        "scope": "AR1 flat inventory + AR2 structural packs and explicit model dependencies; no gameplay roles, license inference or deck semantics",
    }

    out_dir.mkdir(parents=True, exist_ok=True)
    _write_json(out_dir / "manifest.json", manifest)
    with (out_dir / "catalog.jsonl").open("w", encoding="utf-8", newline="\n") as fh:
        for rec in records:
            fh.write(json.dumps(rec, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n")
    for kind, rel in shard_paths.items():
        _write_json(out_dir / rel, by_kind.get(kind, []))
    _pack_outputs(out_dir, packs, records)
    _write_json(out_dir / "problems.json", {
        "schema": "kfb.asset-registry.problems.v1",
        "sourceCommit": commit,
        "counts": dict(sorted(problem_counts.items())),
        "problems": problems,
    })

    summary = [
        "# KFB Asset Registry v1 · AR1 + AR2",
        "",
        f"Source commit: `{commit}`",
        "",
        f"Total indexed assets: **{len(records)}** · packs: **{len(packs)}**",
        "",
        "| Kind | Count |",
        "|---|---:|",
    ]
    for kind in sorted(shard_paths):
        summary.append(f"| `{kind}` | {counts.get(kind, 0)} |")
    summary.extend(["", "## Model dependency status", "", "| Status | Count |", "|---|---:|"])
    for status in ("complete", "embedded", "missing", "unresolved"):
        summary.append(f"| `{status}` | {dependency_counts.get(status, 0)} |")
    summary.extend(["", f"Problems: **{len(problems)}**. See `problems.json`.", "", "Pack grouping is structural; dependency claims come only from explicit model/material references or reviewed overrides.", ""])
    (out_dir / "summary.md").write_text("\n".join(summary), encoding="utf-8", newline="\n")
    return manifest


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build deterministic KFB Asset Registry AR1+AR2")
    parser.add_argument("--repo-root", help="Git checkout root; defaults to git rev-parse --show-toplevel")
    parser.add_argument("--config", default="tools/asset_registry/config.json", help="Config path relative to repo root")
    parser.add_argument("--out", help="Override output directory relative to repo root")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    repo_root = Path(args.repo_root).resolve() if args.repo_root else find_repo_root()
    config = load_config(repo_root, args.config)
    out_dir = None
    if args.out:
        out_dir = Path(args.out)
        if not out_dir.is_absolute():
            out_dir = repo_root / out_dir
    manifest = build_registry(repo_root, config, out_dir)
    print(json.dumps(manifest["counts"], sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
