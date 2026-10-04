"""AR4 deterministic delta helpers for the KFB Asset Registry.

The previous registry is read from Git HEAD, never from mutable workspace state.
That keeps reruns on the same commit deterministic and makes stale generated files
safe to delete before writing the next registry.
"""
from __future__ import annotations

import json
import subprocess
from collections import defaultdict
from pathlib import Path


def _git_show_optional(repo_root: Path, path: str) -> str | None:
    proc = subprocess.run(
        ["git", "show", f"HEAD:{path}"],
        cwd=repo_root,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    if proc.returncode != 0:
        return None
    return proc.stdout


def _json_optional(repo_root: Path, path: str) -> object | None:
    text = _git_show_optional(repo_root, path)
    if text is None:
        return None
    return json.loads(text)


def read_previous_registry(repo_root: Path, output_rel: str) -> dict:
    root = output_rel.rstrip("/")
    manifest = _json_optional(repo_root, f"{root}/manifest.json")

    catalog_text = _git_show_optional(repo_root, f"{root}/catalog.jsonl")
    records: list[dict] = []
    if catalog_text:
        records = [json.loads(line) for line in catalog_text.splitlines() if line.strip()]

    problems_doc = _json_optional(repo_root, f"{root}/problems.json")
    problems: list[dict] = []
    if isinstance(problems_doc, dict):
        problems = list(problems_doc.get("problems", []))

    return {
        "manifest": manifest if isinstance(manifest, dict) else None,
        "records": records,
        "problems": problems,
    }


def _blob_sha(record: dict) -> str | None:
    source = record.get("source") or {}
    return source.get("blobSha")


def _dependency_view(record: dict) -> dict:
    return {
        "dependencyStatus": record.get("dependencyStatus"),
        "dependencies": record.get("dependencies", []),
    }


def _problem_key(problem: dict) -> str:
    problem_id = problem.get("problemId")
    if problem_id:
        return str(problem_id)
    return json.dumps(problem, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def build_delta(
    *,
    previous: dict,
    current_records: list[dict],
    current_problems: list[dict],
    to_commit: str,
) -> dict:
    old_records = list(previous.get("records", []))
    old_problems = list(previous.get("problems", []))
    previous_manifest = previous.get("manifest") or {}

    old_by_path = {record["path"]: record for record in old_records}
    new_by_path = {record["path"]: record for record in current_records}

    old_only = set(old_by_path) - set(new_by_path)
    new_only = set(new_by_path) - set(old_by_path)

    # A move is only asserted when one unique old path and one unique new path
    # share the exact same Git blob SHA. Ambiguous duplicate blobs stay as
    # ordinary add/remove events rather than receiving invented identity.
    old_sha_paths: dict[str, list[str]] = defaultdict(list)
    new_sha_paths: dict[str, list[str]] = defaultdict(list)
    for path in sorted(old_only):
        sha = _blob_sha(old_by_path[path])
        if sha:
            old_sha_paths[sha].append(path)
    for path in sorted(new_only):
        sha = _blob_sha(new_by_path[path])
        if sha:
            new_sha_paths[sha].append(path)

    moved: list[dict] = []
    moved_old: set[str] = set()
    moved_new: set[str] = set()
    for sha in sorted(set(old_sha_paths) & set(new_sha_paths)):
        olds = old_sha_paths[sha]
        news = new_sha_paths[sha]
        if len(olds) == 1 and len(news) == 1:
            moved.append({"from": olds[0], "to": news[0], "blobSha": sha})
            moved_old.add(olds[0])
            moved_new.add(news[0])

    added = sorted(new_only - moved_new)
    removed = sorted(old_only - moved_old)

    changed_dependencies: list[dict] = []
    for path in sorted(set(old_by_path) & set(new_by_path)):
        before = _dependency_view(old_by_path[path])
        after = _dependency_view(new_by_path[path])
        if before != after:
            changed_dependencies.append({"path": path, "before": before, "after": after})

    old_problem_map = {_problem_key(problem): problem for problem in old_problems}
    new_problem_map = {_problem_key(problem): problem for problem in current_problems}
    new_problem_keys = sorted(set(new_problem_map) - set(old_problem_map))
    resolved_problem_keys = sorted(set(old_problem_map) - set(new_problem_map))

    return {
        "schema": "kfb.asset-registry.delta.v1",
        "fromCommit": previous_manifest.get("sourceCommit"),
        "toCommit": to_commit,
        "added": added,
        "removed": removed,
        "moved": moved,
        "changedDependencies": changed_dependencies,
        "newProblems": [new_problem_map[key] for key in new_problem_keys],
        "resolvedProblems": [old_problem_map[key] for key in resolved_problem_keys],
        "counts": {
            "added": len(added),
            "removed": len(removed),
            "moved": len(moved),
            "changedDependencies": len(changed_dependencies),
            "newProblems": len(new_problem_keys),
            "resolvedProblems": len(resolved_problem_keys),
        },
    }
